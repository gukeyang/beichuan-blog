---
title: Spring面试题
tags:
  - Spring
  - SpringMVC
  - Springboot
categories: 面试题
abbrlink: 489ef953
date: 2025-10-28 18:31:36
---

## 聊聊你对spring框架的理解？

Spring 是一种轻量级开发框架，旨在提高开发人员的 开发效率以及系统的可维护性，其中有几个核心概念：依赖注入、IOC(控制反转)、AOP（面向切面编程）、事务管理。

**IOC（控制反转）**它是一种创建对象和获取对象的一个技术思想，将对象交给Spring容器进行管理。我们不用手动的创建对象，而是由IOC容器来帮我实现实例化对象。

核心的话是通过依赖注入，依赖注入有三种方式：注解、XML配置、构造器注入

IOC的底层的话是通过反射机制+工厂模式+配置解析：

- ​	IOC 容器启动时，首先会加载并解析描述对象（Bean）及其依赖关系的配置信息。
- ​	容器根据解析后的配置，通过**反射机制**动态创建对象（Bean），而非硬编码 `new` 操作。
- ​	对象创建后，容器会根据配置或注解解析其依赖项（如 `UserService` 依赖 `UserDao`），并自动完成依赖注入。

**AOP（面向切面编程）**是面向切面编程，能够将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，以减少系统的重复代码，降低模块间的耦合度。

在AOP里面有几个概念：

**横切关注点**：系统中分散在多个模块、且与核心业务逻辑无关的通用功能，例如日志记录、性能监控、事务管理、权限校验等。

**切面（Aspect）**：封装横切关注点的模块，是 AOP 的核心载体。它定义了 “做什么”（如日志逻辑）和 “在何时何地做”（通过通知和切点指定）。

**连接点（Join Point）**：程序执行过程中可插入切面逻辑的**特定点**，如方法调用、异常抛出、字段访问等。在 Spring AOP 中，连接点通常指方法的执行（因为 Spring AOP 基于动态代理，主要支持方法级别的拦截）。

**切点（Pointcut）**：用于**定位连接点**的规则（表达式），决定哪些连接点会被切面拦截。

**通知（Advice）**：

切面在连接点执行的**具体逻辑**，并定义了执行时机。常见通知类型：

- **前置通知（Before）**：在连接点执行前执行；
- **后置通知（After）**：在连接点执行后（无论是否异常）执行；
- **返回通知（After Returning）**：在连接点正常返回后执行；
- **异常通知（After Throwing）**：在连接点抛出异常后执行；
- **环绕通知（Around）**：包裹连接点，可在执行前后自定义逻辑，甚至控制是否执行连接点。

**目标对象（Target Object）**：被切面拦截的原始对象（即业务逻辑对象），AOP 通过代理对其增强。

**代理对象（Proxy）**：AOP 在目标对象基础上创建的代理实例

**织入（Weaving）**：

将切面逻辑嵌入到目标对象的过程，生成代理对象。织入时机分为：

- 编译期：通过编译器将切面织入（如 AspectJ）；
- 类加载期：在类加载时织入（需特殊类加载器）；
- 运行期：通过动态代理在运行时织入（如 Spring AOP，最常见）。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 JDK Proxy，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 Cglib 生成一个被代理对象的子类来作为代理。

**AOP的原理**是通过动态代理实现的，在程序运行时动态生成目标对象的代理对象，通过代理对象间接调用目标方法，并在调用过程中嵌入切面逻辑。

动态代理有两种方式：

- **JDK动态代理**：

  基于java的`java.lang.reflect.Proxy`类和`InvocationHandler`接口实现，要求目标对象必须实现接口，代理对象是接口的实现类。

- **CGLIB 代理**：

  基于字节码生成库（Code Generation Library）实现，无需对象实现接口，通过继承目标类生成代理子类实现的。

**AOP的应用常见场景**

最常见的是事务管理,Spring的声明式事务就是基于AOP实现的。我们只需要在方法上面标注@Transactional，Spring就会通过AOP在方法执行前开启事务，执行后根据是否有异常决定提交或回滚

然后就是日志记录，可以定义一个切面，通过@Before获取参数 ，@AfterReturning获取返回值，@Around统计执行时间。

还有权限校验，如果有需要特定角色权限访问 ，可以定义一个切面 ，检查用户权限

## **单例Bean 生命周期的核心阶段**

### 1. **Bean 定义加载与解析**

- Spring 容器启动时，通过 XML 配置、注解（如`@Component`）或 Java 配置类（`@Configuration`）加载 Bean 的定义信息，解析为`BeanDefinition`对象（包含类名、属性、依赖、作用域等元数据），并注册到`BeanDefinitionRegistry`中。

### 2. **Bean 实例化（创建对象）**

- 容器根据`BeanDefinition`的信息，通过反射调用 Bean 的构造方法（无参或有参，有参时需先解析依赖），创建 Bean 的实例（内存中生成对象，但尚未设置属性）。
- **注意**：此阶段仅完成对象的创建，属性（尤其是依赖的其他 Bean）尚未注入。

### 3. **属性注入（依赖注入，DI）**

- 容器根据`BeanDefinition`中定义的属性信息（如`@Autowired`、XML 中的`<property>`），将依赖的 Bean 或基本数据类型值注入到当前 Bean 的对应字段或 setter 方法中。
- 依赖注入的核心是解决 “对象之间的依赖关系”，确保 Bean 在使用前拥有所需的资源。

### 4. **初始化前（Aware 接口回调）**

- 若 Bean 实现了 Spring 提供的Aware系列接口（如BeanNameAware、BeanFactoryAware、ApplicationContextAware等），容器会调用对应的回调方法，向 Bean 传递容器相关的信息：
  - `BeanNameAware`：注入当前 Bean 在容器中的名称（`setBeanName(String name)`）；
  - `BeanFactoryAware`：注入当前 Bean 所属的 BeanFactory（`setBeanFactory(BeanFactory factory)`）；
  - `ApplicationContextAware`：注入当前应用的 ApplicationContext（`setApplicationContext(ApplicationContext context)`）。

### 5. **初始化前置处理**

- 若容器中注册了`BeanPostProcessor`（Bean 后置处理器），会调用其`postProcessBeforeInitialization`方法，对 Bean 进行初始化前的增强处理（如修改 Bean 的属性、替换 Bean 实例等）。
- 这是 Spring 提供的扩展点，允许在初始化前自定义处理逻辑（例如 Spring 的 AOP 代理生成可能在此阶段介入）。

### 6. **初始化方法执行**

- 执行 Bean 的初始化逻辑，有两种方式（优先级：注解 > 接口 > XML）：
  1. **`@PostConstruct`注解**：标注在方法上，容器会在属性注入完成后自动调用该方法；
  2. **`InitializingBean`接口**：实现接口的`afterPropertiesSet()`方法，容器会在属性注入后调用；
  3. **XML 配置的`init-method`**：在`<bean>`标签中通过`init-method`指定初始化方法，容器会调用该方法。
- 初始化方法通常用于完成 Bean 的资源加载、状态初始化等操作（如连接数据库、初始化缓存）。

### 7. **初始化后置处理**

- 再次调用`BeanPostProcessor`的`postProcessAfterInitialization`方法，对 Bean 进行初始化后的增强处理。
- **典型应用**：Spring AOP 在此阶段为 Bean 生成代理对象（若该 Bean 被切面拦截），最终返回的可能是代理对象而非原始 Bean 实例。

### 8. **Bean 就绪（可使用）**

- 经过上述步骤后，Bean 已完全初始化，被放入 Spring 容器的缓存中（单例 Bean），供应用程序通过`getBean()`方法获取并使用。

### 9. **销毁前准备**

- 当容器关闭时（如应用停止），单例 Bean 会进入销毁阶段。若 Bean 实现了`DisposableBean`接口，容器会先调用其`destroy()`方法的前置逻辑。

### 10. **销毁方法执行**

- 执行 Bean 的销毁逻辑，有两种方式（优先级：注解 > 接口 > XML）：
  1. **`@PreDestroy`注解**：标注在方法上，容器关闭时自动调用；
  2. **`DisposableBean`接口**：实现接口的`destroy()`方法，容器关闭时调用；
  3. **XML 配置的`destroy-method`**：在`<bean>`标签中通过`destroy-method`指定销毁方法，容器关闭时调用。
- 销毁方法通常用于释放资源（如关闭数据库连接、释放文件句柄等）。

## Spring 中的单例 bean 的线程安全问题了解吗？(重要)

在Spring框架中Bean的默认作用域是单例 （Singleton）。这意味着在容器启动时，会创建一个 Bean实例，并在整个应用生命周期中只维护这一个实例。

- 如果Bean是无状态的（即没有成员变量，或只有 查询操作而没有修改操作），那么它在多线程环境 下是线程安全的。因为多个线程访问同一个无状态 Bean时，不会修改其状态，因此不会引发线程安全问题。
- 如果Bean是有状态的（即包含可变数据，如实例 变量），并且多个线程同时访问并修改这些状态， 那么可能会引发线程安全问题。

常见的两种解决办法：

- 尽量避免定义可变的成员变量
- 在类中定义一个ThreadLocal成员变量，将可变成员变量保存在ThreadLocal中（推荐）
- 可以通过使用synchronized等同步机制来保证单例Bean内部的可变状态的线程安全性
- 可以使用ConcurrentHashMap来确保可变状态的线程安全性

## spring bean是线程安全的吗

**单例作用域（Singleton）** 

- 这是Spring的默认作用域，意味着在整个Spring  IoC容器中仅存在一个该类型的Bean实例。 
- 如果这个单例Bean是无状态的（即不包含任何成 员变量或只包含不可变的成员变量），那么它是线程安全的。 
- 如果单例Bean包含可变的状态信息，并且这种状 态被多个线程共享，则需要采取额外措施来确保线程安全，比如使用同步机制或设计成不可变对象等 方法来保护数据的一致性。 

**原型作用域（Prototype）** 

- 每次请求时都会创建一个新的Bean实例。 
- 在这种情况下，每个线程都有自己的Bean副本， 因此通常不需要担心线程安全问题。
- 但如果多个线程访问同一个Prototype Bean的共享 资源（例如静态变量或其他全局状态），仍需注意 线程安全。

## **spring是如何解决循环依赖的？**

假设有两个类A和B，A依赖B，同时B又依赖A，这就形成了循环依赖。

Spring 通过**三级缓存机制**来解决**单例 Bean 的构造器循环依赖**（构造器注入除外）：

当 A 依赖 B，B 又依赖 A 时，Spring 会提前把 A 的代理对象暴露到三级缓存中，等 B 注入 A 时就能从三级缓存中获取 A 的早期引用，从而**打破循环依赖**。

- 一级缓存（singletonObjects）：这是一个 ConcurrentHashMap，用于存放完全初始化好的单例 Bean，即已经经历了实例化、属性赋值和初始化等所有阶段的 Bean。当 Spring 从容器中获取 Bean 时，首先会从这个缓存中查找，如果找到了直接返回。
- 二级缓存（earlySingletonObjects）：也是一个 ConcurrentHashMap，用于存放早期暴露的单例 Bean，即已经完成实例化，但还未进行属性赋值和初始化的 Bean。当一个 Bean 实例化后，会将其提前暴露到这个缓存中，目的是让其他依赖它的 Bean 可以提前获取到这个 Bean 的引用，即使它还没有完全初始化。
- 三级缓存（singletonFactories）：同样是 ConcurrentHashMap，存放的是 ObjectFactory，通过这个工厂可以获取到早期暴露的单例 Bean。ObjectFactory 是一个接口，只有一个 getObject 方法，用于创建对象。在创建 Bean 时，如果发现存在循环依赖，会将一个 ObjectFactory 放入三级缓存，这个工厂在需要时可以返回早期暴露的 Bean。

过程:

1.spring创建a，先实例化a，此时a没有进行属性赋值和初始化，将a的ObjectFactory放入到三级缓存中

2，在为a进行属性赋值时，发现a依赖于b，于是开始创建b

3.spring实例化b，将b的ObjectFactory放入三级缓存singletonFactories

4.在为b属性赋值时，发现b依赖a，此时从三级缓存中获取a的ObjectFactory，通过ObjectFactory获取早期暴露的a将其放入到二级缓存 earllySingletonObjects中，并从三级缓存中移出对应的ObjectFactory，然后将暴露a注入到b

5.b完成属性赋值和初始化，将b放入到一级缓存singletonObjects

6.回到a的创建过程，由于已经创建了b，继续完成a的属性赋值和初始化，最后将a放入到一级缓存singletonObjects



## Spring事务

### 事务的实现方式

Spring中有两种实现方式一种是声明式事务，一种是编程式事务。声明式事务因非侵入性成为主流。

声明式事务：**基于注解 `@Transactional`**，在需要事务的方法或类上标注 `@Transactional`，Spring 通过 AOP 动态增强方法，自动管理事务。

编程式事务：手动通过 `TransactionTemplate` 或 `PlatformTransactionManager` 控制事务，侵入性强，适用于复杂的事务逻辑。

### Transactional的五个属性

- 传播行为：

  定义当一个事务方法调用另一个事务方法时，事务如何嵌套执行

  - `REQUIRED`（默认）：若当前存在事务，则加入该事务；若不存在，则新建事务。
  - `REQUIRES_NEW`：无论当前是否有事务，都新建一个独立事务（原事务挂起）。
  - `NESTED`：若当前有事务，则嵌套在当前事务中（子事务可独立回滚，不影响父事务）；若无，则同 `REQUIRED`。
  - `SUPPORTS`：若当前有事务，加入；否则以非事务方式执行。
  - `MANDATORY`：必须在事务中执行，否则抛异常。
  - `NOT_SUPPORTED`：以非事务方式执行，若当前有事务则挂起。
  - `NEVER`：以非事务方式执行，若当前有事务则抛异常。

- 隔离级别：

  控制多个并发事务之间的相互影响，解决脏读、不可重复读、幻读等问题。

  - `DEFAULT`（默认）：使用数据库默认隔离级别（如 MySQL 默认为 `REPEATABLE_READ`，Oracle 默认为 `READ_COMMITTED`）。
  - `READ_UNCOMMITTED`：允许读取未提交的数据（可能导致脏读、不可重复读、幻读）。
  - `READ_COMMITTED`：只能读取已提交的数据（避免脏读，可能出现不可重复读、幻读）。
  - `REPEATABLE_READ`：保证多次读取同一数据结果一致（避免脏读、不可重复读，可能出现幻读）。
  - `SERIALIZABLE`：最高隔离级别，事务串行执行（避免所有并发问题，但性能极低）。

- 回滚规则：

  指定哪些异常触发事务回滚，哪些异常不触发。

  - rollbackFor：需要回滚的异常类型（默认只回滚 RuntimeException 及其子类）。
    例：rollbackFor = {Exception.class, IOException.class}（所有 Exception 都回滚）。
  - rollbackForClassName：需要回滚的异常类名（字符串形式，如 rollbackForClassName = "java.lang.Exception"）。
  - noRollbackFor：不需要回滚的异常类型（即使发生也不回滚）。例：noRollbackFor = BusinessException.class（自定义业务异常不回滚）。
  - noRollbackForClassName：不需要回滚的异常类名（字符串形式）。

- 超时时间：

  设置事务的最大执行时间（秒），若超过该时间未完成，则自动回滚并释放资源，避免长期占用数据库连接。

- 只读属性：

  标记事务是否为 “只读事务”，用于优化只读操作（如查询）的性能。

### 事务的失效的场景

**方法访问权限问题**

- `@Transactional` 仅对 **public 方法** 生效（非 public 方法的注解会被 AOP 忽略，因 Spring 代理机制限制）。
- 解决：将方法改为 public，或通过 XML 配置强制增强非 public 方法（不推荐）。

**自调用问题（同一类内方法调用）**

- 若类内部 **无事务的方法 A 调用有事务的方法 B**，因未经过 Spring 代理对象（直接调用原始对象方法），B 的事务会失效。

  解决：

  - 注入自身代理对象（`@Autowired private OrderService self;`，再调用 `self.methodB()`）；
  - 从 Spring 容器中获取代理对象（`ApplicationContext.getBean(OrderService.class)`）。

**异常被捕获且未抛出**

- 若事务方法中 **异常被 try-catch 捕获且未重新抛出**，Spring 无法感知异常，不会触发回滚

  解决：捕获后重新抛出异常（`throw new RuntimeException(e)`）。

**错误配置回滚规则**

- 默认只回滚 **RuntimeException 及其子类**，若方法抛出 checked 异常（如 `IOException`），未通过 `rollbackFor` 指定，则事务不回滚。
- 解决：显式配置 `rollbackFor = Exception.class`。

**数据库引擎不支持事务**

- 如 MySQL 使用 **MyISAM 引擎**（默认不支持事务），需改为 InnoDB 引擎。

**错误的传播行为**

- 若配置 `propagation = Propagation.NOT_SUPPORTED`（非事务方式执行）或 `NEVER`，会导致事务失效。

## @Component 和 @Bean 的区 别是什么？

@Component ：

- 作用于**类**上，用于标识一个类是 “组件”，Spring 会自动扫描并通过**类的默认构造方法**创建其实例，并注册到容器中。
- 用于**自定义类**的注册。当类是自己编写的（可直接修改源码），通过在类上标注 `@Component`，配合 Spring 的组件扫描（`@ComponentScan`），即可自动注册到容器，无需手动编写创建逻辑。
- 依赖 Spring 的**组件扫描机制**。

@Bean：

- 作用于**方法**上，用于将方法的**返回值**（对象）注册到 Spring 容器中。
- 用于**第三方类**或**无法修改源码的类**的注册。
- `@Bean` 方法必须定义在标注了 `@Configuration` 的配置类中
- 依赖**方法的执行**。

## **@Autowired 和 @Resource 有什么区别**

- - **来源**：

  - - @Autowired是 Spring 框架提供的注解，用于依赖注入。
    - @Resource是 JSR - 250 规范（Java EE 5 引入）中的注解，JavaEE 和 Spring 框架都支持使用。

  - **注入方式**：

  - - @Autowired默认按类型匹配进行依赖注入。如果容器中存在多个相同类型的 Bean，会根据 Bean 的名称进行匹配，如果名称也不唯一，则会抛出NoUniqueBeanDefinitionException异常。可以通过@Qualifier注解指定要注入的 Bean 的名称来解决歧义。例如：@Autowired @Qualifier("userDaoImpl") UserDao userDao;
    - @Resource默认按名称匹配进行依赖注入。如果找不到指定名称的 Bean，则按类型匹配。例如，@Resource(name = "userDao") UserDao userDao;如果没有指定name属性，会根据变量名或 setter 方法名来匹配 Bean 的名称。

  - **所属包不同**：

  - - @Autowired属于org.springframework.beans.factory.annotation包。
    - @Resource属于javax.annotation包，这也体现了@Resource更具通用性，可在 JavaEE 环境中使用，而@Autowired是 Spring 特有的。

## Spring 中有哪些设计模式？

### 1. **单例模式（Singleton Pattern）**

- **核心思想**：确保一个类仅有一个实例，并提供全局访问点。

- Spring 应用：

  Spring 容器中的 Bean 默认是单例模式（scope="singleton"），由容器负责创建和管理唯一实例，避免重复创建对象带来的资源消耗。（可通过@Scope("prototype")改为原型模式，每次获取时创建新实例。）

### 2. **工厂模式（Factory Pattern）**

- **核心思想**：通过工厂类封装对象的创建逻辑，解耦对象创建与使用。
- Spring 应用：
  - `BeanFactory` 是 Spring 最基础的 IoC 容器，作为 “Bean 工厂” 负责创建和管理 Bean（通过 `getBean()` 方法获取实例）。
  - `ApplicationContext` 继承自 `BeanFactory`，扩展了更多功能（如事件发布、国际化等），本质上也是工厂模式的实现。

### 3. **代理模式（Proxy Pattern）**

- **核心思想**：通过代理对象增强目标对象的功能，且不修改目标对象代码。

- Spring 应用：

  是 Spring AOP 的核心实现方式。当 Bean 需要被切面增强时，Spring 会动态生成代理对象（JDK 动态代理或 CGLIB 代理），在目标方法执行前后插入横切逻辑（如日志、事务）。

### 4. **观察者模式（Observer Pattern）**

- **核心思想**：定义对象间的一对多依赖，当一个对象状态变化时，所有依赖它的对象会收到通知并自动更新。
- 例如：
  - `ApplicationEvent` 是事件源（如 `ContextRefreshedEvent` 表示容器刷新完成）。
  - `ApplicationListener` 是观察者，监听特定事件并执行回调逻辑。
  - `ApplicationEventMulticaster` 作为事件广播器，负责将事件转发给所有观察者。

### 5. **模板方法模式（Template Method Pattern）**

- **核心思想**：父类定义算法骨架，将可变步骤延迟到子类实现，避免重复代码。
- Spring 应用：
  - `JdbcTemplate`：封装了 JDBC 的固定流程（如获取连接、释放资源），将 SQL 执行、结果映射等可变逻辑通过回调接口（如 `RowMapper`）交给用户实现。
  - 类似的还有 `HibernateTemplate`、`RedisTemplate` 等，均通过模板方法简化数据访问层代码。

### 6. **适配器模式（Adapter Pattern）**

- **核心思想**：将一个类的接口转换为客户端期望的另一个接口，使不兼容的类可以一起工作。
- Spring 应用：
  - Spring MVC 中的 `HandlerAdapter`：适配不同类型的处理器（如 `@Controller`、`HttpRequestHandler`），将其统一转换为 `DispatcherServlet` 可处理的接口，避免 `DispatcherServlet` 直接依赖各种处理器类型。
  - `AopAdapter`：适配不同的通知类型（如 `BeforeAdvice`、`AfterAdvice`），统一转换为 AOP 代理可执行的逻辑。

### 7. **策略模式（Strategy Pattern）**

- **核心思想**：定义一系列算法，封装每个算法并使它们可互换，客户端根据需求选择算法。
- Spring 应用：
  - 事务管理：`PlatformTransactionManager` 是策略接口，不同的实现类（如 `DataSourceTransactionManager` 用于 JDBC 事务、`HibernateTransactionManager` 用于 Hibernate 事务）对应不同的事务管理策略，用户可按需配置。
  - Spring Security 中的认证策略：`AuthenticationManager` 可集成多种认证策略（如用户名密码认证、OAuth2 认证）。

### 8. **装饰器模式（Decorator Pattern）**

- **核心思想**：动态给对象添加额外功能，不改变其原始结构。
- Spring 应用：
  - `BeanWrapper`：对 Bean 对象进行包装，提供属性访问、类型转换等增强功能，同时不修改原始 Bean。
  - Spring MVC 的 `HandlerInterceptor`：拦截器本质是对处理器（`Handler`）的装饰，在请求处理前后添加日志、权限校验等逻辑。

### 9. **组合模式（Composite Pattern）**

- **核心思想**：将对象组合成树形结构，统一处理单个对象和组合对象。
- Spring 应用：
  - `ApplicationContext` 的层次结构：`WebApplicationContext` 可包含多个 `ServletContext`，形成父子容器，通过组合模式统一管理上下文中的 Bean。
  - `HandlerMapping` 链：多个 `HandlerMapping` 可组合成一个链，Spring MVC 会依次查找适合的处理器，统一处理映射逻辑。

### 10. **其他常用模式**

- **注册表模式（Registry Pattern）**：`BeanDefinitionRegistry` 负责注册和管理 `BeanDefinition`（Bean 的元数据），提供注册、查询、删除等操作，是 Spring 容器初始化的核心组件。
- **委托模式（Delegate Pattern）**：`DispatcherServlet` 作为 Spring MVC 的前端控制器，将请求委托给 `HandlerMapping`、`HandlerAdapter` 等组件处理，自身不直接处理业务逻辑。
- **桥接模式（Bridge Pattern）**：`DataSource` 接口作为抽象层，其实现类（如 `DriverManagerDataSource`、`HikariDataSource`）对应不同数据库连接池的具体实现，通过桥接模式分离抽象与实现，方便替换数据源。

## Spring注解

<img src="https://s2.loli.net/2025/10/30/piqXshP7JYkwb2g.png" alt="image-20251029211505794" style="zoom:200%;" />

## 什么是Spring MVC

Spring MVC 是 Spring 框架中用于构建 Web 应用程序的**MVC（Model-View-Controller）设计模式实现**，它是 Spring Web 模块的核心部分，用于处理 HTTP 请求并构建灵活、松耦合的 Web 应用。

MVC 将应用分为三个核心组件，职责分离：

1. **Model（模型）**：处理应用核心业务逻辑和数据，通常是 Java 实体类（POJO）或服务层（Service）组件，负责数据的存储、验证和处理。
2. **View（视图）**：负责数据的展示，将模型中的数据以用户可交互的形式呈现（如 JSP、Thymeleaf、HTML 等）。
3. **Controller（控制器）**：接收用户请求，协调模型和视图，是请求的入口。它调用模型处理业务，再选择合适的视图返回给用户。

## Spring MVC工作流程

SpringMVC的工作流程如下：

- 用户发送请求至前端控制器DispatcherServlet
- DispatcherServlet收到请求调用处理器映射器HandlerMapping。
- 处理器映射器根据请求url找到具体的处理器，生成处理器执行链HandlerExecutionChain(包括处理器对象和处理器拦截器)一并返回给DispatcherServlet。
- DispatcherServlet根据处理器Handler获取处理器适配器HandlerAdapter执行HandlerAdapter处理一系列的操作，如：参数封装，数据格式转换，数据验证等操作
- 执行处理器Handler(Controller，也叫页面控制器)。
- Handler执行完成返回ModelAndView
- HandlerAdapter将Handler执行结果ModelAndView返回到DispatcherServlet
- DispatcherServlet将ModelAndView传给ViewReslover视图解析器
- ViewReslover解析后返回具体View
- DispatcherServlet对View进行渲染视图(即将模型数据model填充至视图中）。
- DispatcherServlet响应用户。

![img](https://cdn.xiaolincoding.com//picgo/1716791047520-ac0d9673-be0a-4005-8732-30bdedc8f1af.webp)

## Spring MVC 的核心组件

**DispatcherServlet**  作用：接收请求，响应结果，相当于转发器，中央处理 器。有了DispatcherServlet减少了其它组件之间的耦合度。

**HandlerMapping** 作用：根据请求的url查找Handler，既负责完成客户请 求到 Controller 映射。SpringMVC提供了不同的映射器 实现实现不同的映射方式，例如：配置文件方式、实现 接口方式、注解方式等。

**HandlerAdapter** 作用：按照特定规则（HandlerAdapter要求的规则）去 执行Handler。

**Handler**：Handler是继DispatcherServlet前端控制器的后端控制器，在DispatcherServlet的控制下，Handler对具体的 用户请求进行处理。 由于Handler设计到具体的用户业务请求，所以一般情况 需要程序员根据业务需求开发Handler。

**ViewResolver**:作用：进行视图解析，根据逻辑视图名解析成真正的视 图（view）

## @RestController 和   @Controller 有什么区别？

返回结果不同 : @Controller 返回逻辑视图 @RestController 返回的是xml或json格式数据 

组合不同 :  @RestController 是@Controller+@ResponseBody两个 注解的复合 注解。 @RestController 注解，在 @Controller 基础上，增 加了 @ResponseBody 注解，更加适合目前前后端分离的 架构下，提供 Restful API ，返回 JSON 数据格式。

## SpringMVC的常用注解（掌 握）

![image-20251029212749542](https://s2.loli.net/2025/10/30/6joHbJ5Y7KPMT3z.png)

## **后端验证注解**

 @Valid —— JSR 标准注解

- 来源：javax.validation.Valid
- 标准 JSR-303/JSR-380 提供
- ✅ 可以用在字段、方法参数、构造器上
- ❌ **不支持分组校验**

 @Validated —— Spring 提供的增强版

- 来源：org.springframework.validation.annotation.Validated
- ✅ 可以触发校验
- ✅ **支持分组校验**（最大优势）
- 常用于 Controller 方法参数、类级别等

**常用注解**

![image-20251029212859665](https://s2.loli.net/2025/10/30/vUnHgsuMYI2T4Lo.png)





## Spring 中的拦截器是什么？它的作用是什么？（掌握）

拦截器（Interceptor）是一种可以对请求处理流程进行 “横切” 干预的组件。

拦截器需要实现HandlerInterceptor接口，该接口包含以下三个核心方法：

- **preHandle**：在请求到达控制器之前执行，返回true表示允许请求继续向下传递，返回false则会中断请求。
- **postHandle**：在控制器处理完请求但还未渲染视图时执行。
- **afterCompletion**：在整个请求处理完成（包括视图渲染）后执行，通常用于资源清理工作

拦截器的主要作用：

- **日志记录**：可以记录请求的信息，比如请求的 URL、参数、响应状态等，方便后续的分析和问题排查。
- **权限验证**：在请求到达控制器之前，检查用户是否拥有访问该资源的权限，起到安全防护的作用。
- **性能监控**：通过记录请求的处理时间，分析系统的性能瓶颈，有助于系统的优化。
- **请求预处理**：对请求参数进行统一的编码转换、格式校验等操作，提高请求处理的效率和准确性。
- **缓存处理**：判断是否可以直接使用缓存结果，减少对后端资源的访问，提升系统的响应速度。
- **请求头处理**：统一设置响应头，如跨域（CORS）配置、安全相关的响应头设置等。

## **Spring的拦截器的执行顺序**

1. **多个拦截器的链**：可以配置多个拦截器形成一个拦截器链，它们会按照定义的顺序依次执行。
2. **preHandle 的顺序**：preHandle方法按照拦截器配置的顺序依次执行。
3. **postHandle 的顺序**：postHandle方法的执行顺序与preHandle相反。
4. **afterCompletion 的顺序**：同样与preHandle的执行顺序相反，并且只有preHandle返回true的拦截器才会执行此方法。

- preHandle 按拦截器定义顺序调用
- postHandl 按拦截器定义逆序调用
- afterCompletion 按拦截器定义逆序调用postHandler 在拦截器链内所有拦截器返成功调用
- afterCompletion 只有preHandle返回true才调用

## 拦截器和过滤器的区别

| 比较项       | 过滤器（Filter）                                             | 拦截器（Interceptor）                                        |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 定义与范围   | Servlet 规范一部分，基于函数回调，Servlet 容器启动时初始化，可处理所有 Web 应用请求（静态与动态资源） | Spring MVC 框架特有，基于 Java 反射机制，Spring 容器启动时初始化，仅拦截映射到 Spring MVC 控制器的请求 |
| 执行顺序     | 在拦截器之前执行                                             | 在过滤器之后执行                                             |
| 功能与灵活性 | 主要用于通用请求处理，如字符编码设置、日志记录、请求过滤，功能较单一，主要在请求进容器前和响应离开容器前处理 | 在 Spring MVC 请求处理过程有更多切入点，可在请求处理前（preHandle）、请求处理后（postHandle）及视图渲染后（afterCompletion）处理，更适合 Spring MVC 相关业务逻辑，如权限验证、记录请求处理时间 |
| 依赖注入     | 由 Servlet 容器创建，无法直接使用 Spring 依赖注入，如需使用 Spring 容器中的 Bean 需特殊方式获取 | 由 Spring 容器管理，可直接使用 Spring 依赖注入功能，方便获取其他 Bean 进行业务处理 |

## **CORS两种请求**

跨域资源共享（CORS）

浏览器将CORS请求分成两类：简单请求（simplerequest）和非简单请求（not-so-simple request）。

在 CORS（跨域资源共享）中，存在两种请求类型。

简单请求，其条件是请求方法为GET、HEAD或POST ，且请求头仅涉及Accept、Accept - Language、Content - Language以及特定的Content - Type（application/x - www - form - urlencoded、multipart/form - data、text/plain）。浏览器会直接发起此类跨域请求，服务器通过Access - Control - Allow - Origin响应头判断是否允许，若允许前端获取响应，否则报错。

预检请求，当请求不满足简单请求条件时触发。浏览器先发送OPTIONS方法的预检请求，携带Access - Control - Request - Method说明实际请求方法，Access - Control - Request - Headers列出实际请求自定义头。服务器检查后，以Access - Control - Allow - *系列响应头告知是否允许。若允许，浏览器再发实际请求；否则，阻止并报错。

##  SpringBoot用到哪些设计模式？

- 代理模式：Spring 的 AOP（面向切面编程）是代理模式的核心体现。Spring Boot 中默认集成了 AOP 功能，通过动态代理（JDK 动态代理或 CGLIB 代理）对目标方法进行增强（如日志记录、事务管理、权限校验等）。
- 策略模式:Spring Boot 可通过 `spring-boot-starter-logging` 自动适配 Logback、Log4j2 等，底层通过策略模式选择具体日志实现。
- 装饰器模式：Spring 的 `BeanWrapper` 接口：通过装饰器模式对 JavaBean 进行包装，增强其属性访问、类型转换等功能。
- 单例模式：Spring 容器默认对 Bean 采用单例模式管理（`scope="singleton"`），确保一个 Bean 在容器中只有一个实例。
- 简单工厂模式：`BeanFactory`：Spring 的核心工厂接口，负责创建和管理 Bean，通过 `getBean()` 方法根据名称或类型返回具体 Bean 实例，无需关心 Bean 的创建过程。
- 工厂方法模式：`FactoryBean` 接口：自定义 Bean 工厂，通过 `getObject()` 方法创建复杂对象（如 MyBatis 的 `SqlSessionFactoryBean` 用于创建 `SqlSessionFactory`）。
- 观察者模式：配置文件刷新：当配置文件（如 `application.yml`）动态修改时，`EnvironmentChangeEvent` 会触发相关 Bean 重新加载配置。
- 模板方法模式：数据访问模板：`JdbcTemplate`、`RestTemplate` 等，封装了固定的流程（如数据库连接获取、释放，HTTP 请求发送），开发者只需关注具体的 SQL 或请求参数（通过回调方法实现）。
- 适配器模式：`HandlerAdapter`：Spring MVC 中的处理器适配器，适配不同类型的控制器（如注解式 Controller、传统 Controller），使 `DispatcherServlet` 无需关心具体控制器类型，统一通过适配器调用处理方法。

## SpringBoot的项目结构

![img](https://cdn.xiaolincoding.com//picgo/1721712159282-79195670-9acf-4bfb-93b1-47d089a4bc1c.png)



## **springboot自动装配原理**（重要）

@SpringBootApplication 注解，该注解是一个组合注解，核心作用由三个子注解实现：

- - @SpringBootConfiguration：将启动类标记为配置类，允许定义 @Bean。

  - @ComponentScan：扫描当前包及子包下的 @Component 等注解，注册业务组件。

  - @EnableAutoConfiguration：触发自动配置的核心逻辑。

  - - @Import({AutoConfigurationImportSelector.class}) 导入选择器，该类负责加载候选自动配置类。

    - - META-INF/spring.factories 文件中读取EnableAutoConfiguration 对应的配置类列表

      - - 对候选配置类逐一校验，只有满足所有条件注解的类才会被保留

        - - @ConditionalOnClass：类路径中存在指定类（如引入 spring-webmvc 才会加载 WebMvcAutoConfiguration）。

- - - - - - @ConditionalOnMissingBean：容器中不存在用户自定义的同类型 Bean（确保用户配置优先）

          - - 符合条件的配置类被实例化，其内部的@Bean 方法会生成默认组件（如数据源、视图解析器等）并注册到 Spring 容器

## 说几个启动器（starter)？

### 1. **Web 开发相关**

- **`spring-boot-starter-web`**最基础的 Web 开发 starter，整合了 Spring MVC、嵌入式 Tomcat 服务器、Jackson（JSON 处理）等，支持开发 RESTful API 或传统 Web 应用。
- **`spring-boot-starter-webflux`**基于响应式编程的 Web 开发 starter，整合 Spring WebFlux 和 Netty 服务器，适用于高并发、低延迟的响应式应用。

### 2. **数据访问相关**

- **`spring-boot-starter-data-jpa`**整合 Spring Data JPA 和 Hibernate，简化基于 JPA 的数据库操作，支持自动生成 SQL、实体映射等。
- **`spring-boot-starter-jdbc`**整合 Spring JDBC 和 HikariCP（默认连接池），用于直接通过 JDBC 操作数据库，适合简单的 SQL 执行场景。
- **`spring-boot-starter-data-redis`**整合 Spring Data Redis 和 Lettuce（默认客户端），支持 Redis 缓存、分布式锁等操作。
- **`mybatis-spring-boot-starter`**（第三方）MyBatis 官方提供的 starter，整合 MyBatis 和 Spring Boot，支持 XML 或注解式 SQL 映射。

### 3. **安全相关**

- `spring-boot-starter-security`整合 Spring Security，提供身份认证、授权、CSRF 防护等安全功能，可快速实现登录验证、角色权限控制。

### 4. **模板引擎（视图层）**

- **`spring-boot-starter-thymeleaf`**整合 Thymeleaf 模板引擎，用于渲染 HTML 视图，支持自然模板（静态 HTML 可直接预览），替代传统 JSP。
- **`spring-boot-starter-freemarker`**整合 FreeMarker 模板引擎，适用于需要复杂模板逻辑的场景。

### 5. **DevOps 与监控**

- **`spring-boot-starter-actuator`**提供应用监控和管理功能，可暴露健康检查、指标统计（如内存、CPU）、环境配置等端点（如 `/health`、`/metrics`），方便生产环境运维。
- **`spring-boot-starter-test`**整合 JUnit、Mockito、Spring Test 等测试框架，支持单元测试、集成测试，简化测试代码编写。

### 6. **消息队列**

- **`spring-boot-starter-amqp`**整合 Spring AMQP 和 RabbitMQ，支持基于 AMQP 协议的消息发送与接收。
- **`spring-boot-starter-artemis`**整合 Apache Artemis（Java 消息服务，JMS 实现），用于分布式系统的消息通信。

### 7. **其他常用**

- **`spring-boot-starter-cache`**整合 Spring 缓存抽象，支持多种缓存实现（如 Caffeine、Redis），通过 `@Cacheable` 等注解快速实现缓存功能。
- **`spring-boot-starter-validation`**

## 写过SpringBoot starter吗?

自定义 Spring Boot Starter 是扩展 Spring Boot 功能的常见方式，其核心目的是将一组相关的配置、Bean 定义封装成可复用的组件，让其他项目通过引入依赖即可快速使用。下面结合一个简单案例，说明自定义 Starter 的实现思路。

### 场景：自定义一个 “简单日志 Starter”

需求：实现一个 Starter，自动配置一个 `LogService` 组件，支持打印带前缀的日志，且前缀可通过配置文件自定义。

### 自定义 Starter 的核心步骤

#### 1. 项目结构

自定义 Starter 通常需要两个模块（也可合并）：

- **autoconfigure 模块**：存放自动配置类、组件定义等核心逻辑。
- **starter 模块**：仅作为依赖入口，引入 autoconfigure 模块（避免用户手动引入多个依赖）。

```plaintext
my-log-spring-boot-starter/
├─ my-log-spring-boot-autoconfigure/  # 自动配置模块
│  ├─ src/main/java/com/example/log/
│  │  ├─ config/MyLogAutoConfiguration.java  # 自动配置类
│  │  ├─ service/LogService.java            # 核心服务类
│  │  └─ properties/LogProperties.java      # 配置属性类
│  └─ src/main/resources/META-INF/spring.factories  # 注册自动配置
└─ my-log-spring-boot-starter/  # Starter 模块（仅依赖管理）
   └─ pom.xml  # 引入 autoconfigure 模块
```

#### 2. 实现核心组件

##### （1）定义配置属性类（绑定配置文件）

通过 `@ConfigurationProperties` 绑定 application.yml 中的配置，例如允许用户配置日志前缀：

```java
// LogProperties.java
@ConfigurationProperties(prefix = "my.log")  // 绑定配置前缀
public class LogProperties {
    private String prefix = "DEFAULT";  // 默认前缀

    // getter/setter
    public String getPrefix() { return prefix; }
    public void setPrefix(String prefix) { this.prefix = prefix; }
}
```

##### （2）定义核心服务类

实现具体功能（如带前缀的日志打印）：

```java
// LogService.java
public class LogService {
    private final String prefix;

    // 构造器注入配置的前缀
    public LogService(String prefix) {
        this.prefix = prefix;
    }

    // 打印带前缀的日志
    public void print(String message) {
        System.out.println("[" + prefix + "] " + message);
    }
}
```

##### （3）编写自动配置类

通过 `@Configuration` 和 `@Conditional` 等注解，根据条件自动注册 Bean：

```java
// MyLogAutoConfiguration.java
@Configuration
@EnableConfigurationProperties(LogProperties.class)  // 启用配置属性
public class MyLogAutoConfiguration {

    // 注入配置属性
    private final LogProperties logProperties;

    public MyLogAutoConfiguration(LogProperties logProperties) {
        this.logProperties = logProperties;
    }

    // 当容器中没有 LogService 时，自动注册
    @Bean
    @ConditionalOnMissingBean  // 允许用户自定义 Bean 覆盖默认实现
    public LogService logService() {
        return new LogService(logProperties.getPrefix());
    }
}
```

#### 3. 注册自动配置类

Spring Boot 启动时会扫描 `META-INF/spring.factories` 文件，加载其中声明的自动配置类：

```properties
# src/main/resources/META-INF/spring.factories
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.example.log.config.MyLogAutoConfiguration
```

#### 4. 打包与使用

- 将 autoconfigure 和 starter 模块打包（mvn install）。

- 其他项目引入 starter 依赖：

  ```xml
  <dependency>
      <groupId>com.example</groupId>
      <artifactId>my-log-spring-boot-starter</artifactId>
      <version>1.0.0</version>
  </dependency>
  ```

  

- 在项目中直接注入LogService

  ```java
  @RestController
  public class TestController {
      @Autowired
      private LogService logService;
  
      @GetMapping("/test")
      public String test() {
          logService.print("Hello from custom starter!");
          return "success";
      }
  }
  ```

- 可在 application.yml 中自定义前缀：

  ```yaml
  my:
    log:
      prefix: "MY-APP"  # 日志前缀改为 MY-APP
  ```

### 关键注解说明

- `@ConfigurationProperties`：绑定配置文件中的属性。
- `@EnableConfigurationProperties`：启用配置属性类，使其可被注入。
- `@ConditionalOnMissingBean`：当容器中不存在指定 Bean 时才注册，允许用户自定义覆盖。
- `@ConditionalOnClass`/`@ConditionalOnMissingClass`：根据类是否存在决定是否生效（如依赖某个类才启用配置）。
- `@ConditionalOnProperty`：根据配置文件中的属性值决定是否生效（如 `@ConditionalOnProperty(name = "my.log.enabled", havingValue = "true")`）。

通过这种方式，自定义 Starter 可以像官方 Starter 一样，实现 “引入依赖即生效，配置可自定义” 的效果，广泛用于封装公司内部组件或开源工具。



## SPI服务发现机制
