---
title: Mybatis面试题
tags:
  - Mybatis
categories: 面试题
abbrlink: a0d0ac1c
date: 2025-10-30 12:31:36
---
## 谈一下你对mybatis的认识？

MyBatis 是一款半自动化 ORM 框架，它对 JDBC 操 作数据库的过程进行了封装，使得开发者只需关注  SQL 本身，而无需处理如注册驱动、创建连接、关闭资源等繁杂的过程。

**核心组件及其作用**：

- `SqlSessionFactory`：会话工厂，由 `SqlSessionFactoryBuilder` 基于配置文件 / 注解构建，是 MyBatis 入口，线程安全。
- `SqlSession`：与数据库交互的会话对象，非线程安全，需手动关闭，提供增删改查方法。
- `Mapper 接口`：定义数据操作方法，MyBatis 动态生成代理实现类，与 Mapper XML 绑定。
- `Executor`：SQL 执行器（核心组件），负责 SQL 执行和缓存管理（默认 `SimpleExecutor`，支持 `BatchExecutor` 等）。
- `StatementHandler`：处理 SQL 编译、参数设置、结果集映射等细节。

**完整的工作流程**：加载配置 → 创建 `SqlSessionFactory` → 获取 `SqlSession` → 获取 Mapper 代理 → 执行方法（SQL 解析、参数映射、执行、结果映射）→ 事务处理 → 关闭会话。

### MyBatis 核心执行流程详解

1. **读取全局配置文件（mybatis-config.xml）**该文件是 MyBatis 的核心配置文件，包含数据库连接池、事务管理、别名配置、环境（如开发 / 生产环境）等全局配置，是 MyBatis 初始化的基础。

2. **加载映射文件（Mapper.xml）**映射文件定义了操作数据库的 SQL 语句（CRUD），每个 SQL 语句对应一个`id`，并指定输入参数类型（`parameterType`）和输出结果类型（`resultType`/`resultMap`）。映射文件需在`mybatis-config.xml`中通过`<mappers>`标签注册（或通过注解映射替代）。

3. **构建会话工厂（SqlSessionFactory）**通过`SqlSessionFactoryBuilder`解析`mybatis-config.xml`，将配置信息加载到内存，生成`SqlSessionFactory`（单例模式，全局唯一），它是创建`SqlSession`的工厂。

4. **创建会话对象（SqlSession）**由`SqlSessionFactory`创建`SqlSession`，该对象是 MyBatis 与数据库交互的核心接口，封装了执行 SQL 的方法（如`selectOne`、`insert`等），并管理事务（默认手动提交，需显式调用`commit()`）。

5. **Executor 执行器（底层操作）**`SqlSession`内部通过`Executor`接口（MyBatis 的执行器）执行 SQL，分为：

   - 基本执行器（SimpleExecutor）：默认，每次执行 SQL 都创建新的 Statement；

   - 重用执行器（ReuseExecutor）：重用 Statement；

   - 批量执行器（BatchExecutor）：批量处理 SQL。

     同时，Executor负责维护一级缓存（SqlSession 级别的缓存）。

6. **MappedStatement 对象**封装映射文件中的 SQL 信息（如`id`、SQL 语句、参数映射、结果映射等），`Executor`通过它找到对应的 SQL 并处理参数。

7. **输入参数映射**根据`parameterType`将 Java 类型（基本类型、POJO、Map、List 等）转换为 SQL 语句中的参数，类似 JDBC 中`PreparedStatement`的参数设置（`setInt`、`setString`等），支持自动类型转换。

8. **执行 SQL 并处理结果**`Executor`通过`MappedStatement`获取 SQL，与数据库交互执行后，将结果集根据`resultType`/`resultMap`映射为 Java 对象（基本类型、POJO、Map、List 等），类似 JDBC 中`ResultSet`的解析。

## #{ }和${ }的区别是什么？（高 频）

**`#{}`：预编译处理**

MyBatis 会将 `#{}` 替换为 JDBC 中的 `?` 占位符，生成预编译的 `PreparedStatement`。

可防止 SQL 注入，由于使用预编译占位符，参数值会被当作普通字符串处理，即使传入恶意内容（如 `1 or 1=1`），也不会被解析为 SQL 语句的一部分。

只要参数是 SQL 中的 “值”（如查询条件、插入 / 更新的字段值），优先使用 `#{}`。

**`${}`：字符串拼接**

MyBatis 会直接将 `${}` 替换为参数的字符串值，相当于直接拼接 SQL。

当参数需要作为 SQL 的 “结构部分”（如动态表名、排序字段、数据库函数参数）时使用，且必须手动过滤参数避免注入。



## **Mybatis分页实现有哪几种方式**

基于sql的分页：借助limit和offset来实现

RowBounds 分页（逻辑分页）：把所有数据查询出来，然后在内存里进行分页操作

```java
RowBounds rowBounds = new RowBounds(offset, pageSize);
List<User> userList = sqlSession.selectList("getUserList", null, rowBounds);
```

拦截器分页（物理分页）：通过自定义拦截器，在执行 SQL 之前对其进行修改，添加上分页参数，以此实现物理分页

```java
@Intercepts({@Signature(
    type = StatementHandler.class,
    method = "prepare",
    args = {Connection.class, Integer.class}
)})
public class PaginationInterceptor implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        // 实现分页逻辑
    }
}
```

分页插件：PageHelper或者MyBatis-Plus

```java
// 开启分页
PageHelper.startPage(pageNum, pageSize);
List<User> list = userMapper.selectList();
PageInfo<User> pageInfo = new PageInfo<>(list);
```



## **分页插件的原理？**

MyBatis 分页插件的核心是通过实现Interceptor接口拦截 SQL 执行过程，其具体原理涉及 MyBatis 的插件机制、Executor 执行流程和反射技术。

MyBatis 允许通过插件（Interceptor）拦截以下四大核心对象的方法：

1. Executor：SQL 执行器，负责执行 SQL 语句（如query、update）
2. ParameterHandler：参数处理器，负责 SQL 参数的处理
3. ResultSetHandler：结果集处理器，负责处理查询结果
4. StatementHandler：SQL 语句处理器，负责生成 SQL 语句

分页插件主要拦截**Executor**的query方法，在 SQL 执行前动态修改 SQL 语句。

插件需要实现Interceptor接口，并使用@Intercepts和@Signature注解指定要拦截的方法

- @Signature：指定拦截的类、方法和参数
- intercept()：拦截后执行的逻辑
- plugin()：生成代理对象
- setProperties()：设置插件属性

**插件的执行流程是什么？**

- mybatis执行mapper方法
- 插件拦截Executor.query()方法：获取原始SQL,参数和分页信息
- 生成分页sql：添加分页语法
- 执行count查询：获取总记录数，用于计算总页数
- 执行分页查询：使用修改后的sql执行实际查询
- 封装分页结果：将查询结果和总记录数封装到PageInfo对象中返回

## Mybatis插件的应用场景

- **SQL性能监控和分析**:在sql执行前后记录时间，统计慢查询，生成性能报表
- **数据权限过滤：**自动为sql添加数据权限条件，实现行级数据隔离
- 分页功能的实现;自动生成分页 简化分页逻辑
- **敏感数据加密：**自动对敏感字段（如手机号、身份证号）进行加密存储和查询解密。
- **sql注入防护：**对 SQL 参数进行安全校验，防止 SQL 注入攻击。
- **自动填充字段**：自动为实体类的创建时间、更新时间等字段赋值

## **Mybatis如何进行批量操作**

### 使用 `foreach` 标签（XML 映射方式）

通过 MyBatis 的 `<foreach>` 标签遍历集合，动态生成包含多条记录的 SQL 语句，一次性执行。

使用foreach标签，它的属性有：

**item**：集合中每一个元素进行迭代的别名

**index**:指定一个名字 用于在迭代过程中，每次迭代的位置

**open**：以什么开始  常用"（"

**separator**:表示在每次进行迭代之间以什么符号作为分隔符 ”，“

**close**:  表示以什么结束   ")"

**collection** ： 必须指定输入的集合参数  list  array  map

### 使用 SqlSession 批量执行器

MyBatis 提供了 `BatchExecutor` 执行器，支持批量提交 SQL 语句（适用于大量数据，减少网络交互）。

#### 注意：

- 批量执行器适用于 **同类型 SQL 语句**（如批量插入同一表）。
- 需手动管理事务（`commit()`），否则不会生效。
- 可通过 `sqlSession.clearCache()` 清除缓存（避免内存溢出）。

## **在Mapper中如何传递多个参数**

- **使用 @Param 注解（推荐）**参数较少且明确时。通过@Param指定参数名，MyBatis 将参数封装为 Map。
- **使用 Map 传递参数** 参数较多或动态不确定时。将参数封装到 Map 中，SQL 通过 Map 的 key 引用。
- **使用 Java Bean（实体类）**参数属于同一业务对象时。通过对象的属性名访问值。

## **如何获取生成的主键**

### 使用 `useGeneratedKeys` 和 `keyProperty`（推荐，适用于支持自增主键的数据库）

对于支持自增主键的数据库（如 MySQL 的 `AUTO_INCREMENT`、SQL Server 的 `IDENTITY`），可以通过在映射文件或注解中配置 `useGeneratedKeys` 和 `keyProperty` 直接获取生成的主键。

在 `<insert>` 标签中添加两个属性：

- `useGeneratedKeys="true"`：告诉 MyBatis 启用获取生成的主键功能。
- `keyProperty="id"`：指定实体类中接收主键的属性名（如 `User` 类的 `id` 字段）。

### 使用 `<selectKey>` 标签（适用于不支持自增主键的数据库，如 Oracle）

对于不支持自增主键的数据库（如 Oracle 通常使用序列生成主键），可以通过 `<selectKey>` 标签先查询主键生成策略（如序列的下一个值），再将其作为主键插入，并回写到实体类中。

- 在 `<insert>` 标签内部添加 `<selectKey>` 标签，配置主键生成逻辑。
- `keyProperty`：指定实体类接收主键的属性。
- `order`：`BEFORE`（插入前获取主键）或 `AFTER`（插入后获取，适用于自增但数据库不支持 `useGeneratedKeys` 的情况）。
- `resultType`：主键的数据类型。

## **Mybatis实现一对一、一对多有几种方式**

### **嵌套查询（Nested Select）**

- **原理**：分两次查询（主表查询 → 根据主表外键查询关联表），通过 association 标签的 select 属性触发第二次查询。

  例：查询用户（主表）时，通过 user_id 调用 selectAddressByUserId 方法查询地址（关联表）。

- **优点**：SQL 语句简单，易于维护（主表和关联表查询分离）。

- **缺点**：可能产生 “N+1 查询问题”（若主表返回 N 条记录，会触发 N 次关联表查询），性能较差。

- **适用场景**：关联表数据查询频率低、主表返回数据量小的场景。

### **嵌套结果（Nested Results**）

- **原理**：一次 JOIN 联合查询获取所有数据，通过 resultMap 中的 association 标签配置字段与实体的映射关系（避免字段冲突）。

  例：SELECT u.*, a.id AS addr_id, a.detail AS addr_detail FROM user u LEFT JOIN address a ON u.addr_id = a.id，再通过 columnPrefix="addr_" 映射地址字段。

- **优点**：仅执行一次 SQL，性能更优（无 N+1 问题）。

- **缺点**：SQL 可能复杂（需处理表连接和字段别名），结果映射配置较繁琐。

- **适用场景**：主表和关联表数据需频繁同时查询、主表返回数据量大的场景。

### association 标签（一对一关联）

- `property`  关联对象在主实体类中的属性名(如 User 类中的idcard 属性)。
- `javaType` 关联对象的全类名或别名（如 `com.example.pojo.IdCard` 或 `IdCard`），指定该属性的类型。
- `column`  主表中与关联对象关联的字段名（如用户表的 `id` 字段，用于关联身份证表的 `user_id`）
- `select`  嵌套查询的 Mapper 方法全路径（如 `com.example.mapper.IdCardMapper.getById`），表示通过该方法查询关联对象。
- `fetchType`  加载策略：`lazy`（延迟加载，按需加载关联对象）、`eager`（立即加载）。覆盖全局延迟加载配置。
- `resultMap` 引用已定义的 `resultMap` 来映射关联对象（若关联对象的映射规则复杂，可复用已有的 resultMap）。

### **collection 标签（一对多）**

- `property`  集合属性在主实体类中的名称
- `ofType`  集合中元素的全类名或别名，指定集合中元素的类型
- `column`  主表中与子表关联的字段名
- `select`  嵌套查询的 Mapper 方法全路径（如 `com.example.mapper.IdCardMapper.getById`），表示通过该方法查询关联对象。
- `fetchType`  加载策略：`lazy`（延迟加载，按需加载关联对象）、`eager`（立即加载）。覆盖全局延迟加载配置。
- `resultMap` 引用已定义的 `resultMap` 来映射关联对象（若关联对象的映射规则复杂，可复用已有的 resultMap）。
- `javaType`  可选：指定集合本身的类型（如 `ArrayList`、`HashSet`），默认是 `ArrayList`。

## Mybatis是否支持延迟加载

MyBatis 支持延迟加载（Lazy Loading），也称为懒加载。它的核心思想是：**在需要使用关联对象（如一对一的子对象、一对多的集合）时才执行查询，而不是在加载主对象时就立即加载所有关联数据**，以此减少不必要的数据库交互，提升性能。

### **延迟加载的实现原理**

MyBatis 的延迟加载基于 **动态代理（JDK 动态代理或 CGLIB 代理）** 实现，核心步骤如下：

1. **生成代理对象**当查询主对象（如 User）时，MyBatis 不会直接返回原始的实体对象，而是返回一个**代理对象**（通过动态代理生成）。这个代理对象继承或实现了原始实体类，并重写了关联属性（如 `idCard` 或 `orderItems`）的 getter 方法。
2. **拦截关联属性的访问**当首次调用关联属性的 getter 方法（如 `user.getIdCard()`）时，代理对象会拦截这个调用，判断关联数据是否已加载：
   - 若未加载，则触发预先定义的查询（如执行查询身份证的 SQL），获取关联数据并赋值给该属性。
   - 若已加载，则直接返回已缓存的关联数据。
3. **依赖 SqlSession**延迟加载的查询需要依赖当前的 `SqlSession`（数据库会话），因此必须确保在访问关联属性时，`SqlSession` 尚未关闭，否则会抛出 `org.apache.ibatis.exceptions.PersistenceException` 异常（无法执行延迟查询）。

### **如何开启延迟加载？**

延迟加载默认是关闭的，需通过全局配置或局部配置开启：

#### 1. 全局配置（mybatis-config.xml）

在 MyBatis 核心配置文件中，通过 `<settings>` 标签开启全局延迟加载：

```xml
<configuration>
  <settings>
    <!-- 开启全局延迟加载（默认 false） -->
    <setting name="lazyLoadingEnabled" value="true"/>
    <!-- （可选）是否按需加载关联属性，默认 false。true 表示只有调用关联属性的 getter 才加载，更精准 -->
    <setting name="aggressiveLazyLoading" value="false"/>
  </settings>
</configuration>
```

- `lazyLoadingEnabled`：全局开关，设为 `true` 表示开启延迟加载。
- `aggressiveLazyLoading`：设为 `false` 时，仅在调用关联属性的 getter 方法时才加载该属性（按需加载）；设为 `true` 时，加载主对象时会同时加载所有关联属性（已过时，MyBatis 3.4.1+ 后默认 false）。

#### 2. 局部配置（覆盖全局）

在 `association` 或 `collection` 标签中，通过 `fetchType` 属性单独指定加载策略，优先级高于全局配置：

```xml
<!-- 一对一关联：单独设置延迟加载 -->
<association 
  property="idCard" 
  javaType="IdCard"
  select="com.example.mapper.IdCardMapper.getById"
  column="id"
  fetchType="lazy"  <!-- lazy：延迟加载；eager：立即加载 -->
/>

<!-- 一对多关联：单独设置立即加载 -->
<collection 
  property="orderItems" 
  ofType="OrderItem"
  select="com.example.mapper.OrderItemMapper.getByOrderId"
  column="id"
  fetchType="eager"  <!-- 覆盖全局，强制立即加载 -->
/>
```



## MyBatis的一级、二级缓存（高 频）

缓存中查找数据，如果存在则直接返回，无需再次查询数据库，从而提高查询效率。

当 SqlSession **执行close()方法关闭**，或者执行commit()方法提交事务时，一级缓存会被清空。

在同一个 SqlSession 内**执行insert、update、delete等修改数据库的操作时**，MyBatis 会认为数据可能发生了变化，为保证数据一致性，会清空一级缓存。

**二级缓存**是 **Mapper 级别的缓存，多个 SqlSession 可以共享**。当一个 SqlSession 执行查询并将结果放入二级缓存后，其他 SqlSession 执行相同查询时，也可以从二级缓存中获取数据。

当对 Mapper 对应的表**执行insert、update、delete操作**时，无论在哪个 SqlSession 中执行，MyBatis 都会清空该 Mapper 的二级缓存

可以**通过配置标签指定多个 Mapper 共享同一个缓存，并在需要时手动调用相关方法清空缓存**。在 Java 代码中，可以使用**SqlSession的clearCache()方法**，该方法会清空当前 SqlSession 所关联的二级缓存（前提是该 SqlSession 操作的 Mapper 开启了二级缓存）。

在**标签中可以通过flushInterval属性设置缓存刷新间隔**（单位为毫秒）。

**cache标签**:

| 属性          | 类型         | 默认值         | 说明                                                         |
| ------------- | ------------ | -------------- | ------------------------------------------------------------ |
| type          | Class        | PerpetualCache | 指定缓存实现类（可以自定义）                                 |
| eviction      | Class        | LRU            | 指定缓存淘汰策略（LRU、FIFO、SOFT、WEAK）                    |
| flushInterval | long（毫秒） | 0              | 缓存刷新间隔，单位毫秒。0 表示不自动刷新。                   |
| size          | int          | 1024           | 缓存最大条数，超出会触发淘汰策略                             |
| readOnly      | boolean      | false          | 是否只读缓存。true 表示缓存中的对象是只读的，返回的是副本而非原对象 |
| blocking      | boolean      | false          | 是否开启阻塞缓存。true 表示当缓存未命中时，其他线程会阻塞等待。 |

## **Mybatis的动态sql**

<if>标签：用于条件判断，根据表达式的结果决定是否包含某段SQL片段
<choose>、<when>、<otherwise>标签：类似于Java 中的`switch 一 case`语句，用于多条件分支判断
<foreach>标签：用于对集合进行遍历，生成重复的SQL片段，通常用于IN条件或批量操作
<where>标签：用于自动处理SQL语句中的WHERE条件，它会自动添加WHERE关键字，并在条件之间自动添加AND或OR连接词，同时会处理第一个条件前不需要AND或OR的情况。
<set>标签：主要用于动态更新语句，自动处理SET关键字和逗号分隔。

## **动态sql的执行原理**

MyBatis 动态 SQL 的核心是通过动态标签解析（生成 SqlNode 树）、OGNL 条件计算（决定 SQL 片段取舍）、预编译（保证安全与性能）、参数绑定执行四个阶段，实现了 SQL 结构的动态化，同时兼顾了安全性和效率。

**解析阶段**：当mybatis启动并加载XML映射文件时，会对其中的动态SQL标签进行解析，核心是将标签逻辑转换为可执行的sqlNode对象树。

**动态拼接**：当执行mapper方法并传入参数之后，Mybatis会触发动态sql的拼接过程，核心依赖于OGNL表达式计算和SqlNode树遍历

**预编译**：动态拼接生成完整的静态sql，mybatis会将其发送到数据库进行预编译

**执行阶段**：预编译生成PrepareStatement后进入执行阶段 -->
