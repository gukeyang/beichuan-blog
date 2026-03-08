# Spring Boot 自动配置原理

## 一、什么是自动配置

Spring Boot 的**自动配置（Auto-Configuration）**机制，根据类路径中的依赖自动配置 Spring 应用。比如：

- 引入了 `spring-boot-starter-data-jpa` → 自动配置 JPA
- 引入了 `spring-boot-starter-web` → 自动配置 Tomcat 和 Spring MVC
- 引入了 `mysql-connector-java` → 自动配置 MySQL DataSource

## 二、核心注解

### 2.1 @SpringBootApplication

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

这个注解是三个注解的组合：

```java
@SpringBootConfiguration  // @Configuration 的变体
@EnableAutoConfiguration  // 核心：启用自动配置
@ComponentScan            // 组件扫描
```

### 2.2 @EnableAutoConfiguration

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {
    // ...
}
```

关键点：`@Import(AutoConfigurationImportSelector.class)`

## 三、自动配置流程

### 3.1 加载自动配置类

```
1. AutoConfigurationImportSelector.selectImports()
   ↓
2. getCandidateConfigurations() 
   ↓
3. 读取 META-INF/spring.factories (Spring Boot 2.x)
   或 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (Spring Boot 3.x)
   ↓
4. 返回所有候选配置类（约 100+ 个）
```

### 3.2 条件过滤

不是所有配置类都会生效，通过 `@Conditional` 注解过滤：

```java
@Configuration
@ConditionalOnClass({DataSource.class, EmbeddedDatabaseType.class})
@ConditionalOnMissingBean(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
    // ...
}
```

常见条件注解：

| 注解 | 含义 |
|------|------|
| `@ConditionalOnClass` | 类路径存在指定类 |
| `@ConditionalOnMissingBean` | 容器中不存在指定 Bean |
| `@ConditionalOnProperty` | 配置文件存在指定属性 |
| `@ConditionalOnWebApplication` | 是 Web 应用 |
| `@ConditionalOnExpression` | SpEL 表达式结果为 true |

## 四、自定义自动配置

### 4.1 创建 Starter 项目结构

```
my-spring-boot-starter/
├── src/main/java/
│   └── com/example/autoconfig/
│       ├── MyService.java
│       ├── MyServiceProperties.java
│       └── MyServiceAutoConfiguration.java
└── src/main/resources/
    └── META-INF/
        └── spring.factories (2.x)
        或 spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports (3.x)
```

### 4.2 定义配置属性

```java
@ConfigurationProperties(prefix = "my.service")
public class MyServiceProperties {
    private String name;
    private int timeout = 3000;
    
    // getter/setter
}
```

### 4.3 创建自动配置类

```java
@Configuration
@ConditionalOnClass(MyService.class)
@ConditionalOnProperty(prefix = "my.service", name = "enabled", havingValue = "true")
@EnableConfigurationProperties(MyServiceProperties.class)
public class MyServiceAutoConfiguration {
    
    @Bean
    @ConditionalOnMissingBean
    public MyService myService(MyServiceProperties properties) {
        return new MyService(properties.getName(), properties.getTimeout());
    }
}
```

### 4.4 注册自动配置

**Spring Boot 2.x** (`META-INF/spring.factories`)：
```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
  com.example.autoconfig.MyServiceAutoConfiguration
```

**Spring Boot 3.x** (`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`)：
```
com.example.autoconfig.MyServiceAutoConfiguration
```

## 五、调试自动配置

### 5.1 查看自动配置报告

```properties
# application.properties
debug=true
```

启动时会输出 `CONDITIONS EVALUATION REPORT`，显示：

- 哪些配置类匹配了
- 哪些配置类没匹配，原因是什么

### 5.2 排除自动配置

```java
// 方式 1：在@SpringBootApplication 中排除
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    SecurityAutoConfiguration.class
})

// 方式 2：配置文件排除
spring.autoconfigure.exclude=\
  org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

## 六、源码分析

### 6.1 Spring Boot 2.x 流程

```java
// AutoConfigurationImportSelector.java
protected List<String> getCandidateConfigurations() {
    // 读取 spring.factories
    Enumeration<URL> urls = getClassLoader().getResources("META-INF/spring.factories");
    // 解析并返回所有自动配置类
    return factoryClassNames;
}
```

### 6.2 Spring Boot 3.x 变化

Spring Boot 3.x 改用 Java Service Provider 机制：

```
META-INF/spring/
  org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

内容更简洁，每行一个配置类全限定名。

## 七、最佳实践

1. **按需引入 Starter**，避免不必要的自动配置
2. **自定义配置时合理使用条件注解**
3. **Starter 命名规范**：
   - 官方：`spring-boot-starter-*`
   - 第三方：`*-spring-boot-starter`
4. **避免循环依赖**
5. **配置属性使用 `@ConfigurationProperties` 统一管理**

---

**相关文档：**
- [Spring Boot Starter 开发指南](/spring/spring-boot-starter-guide)
- [Spring Bean 生命周期](/spring/spring-bean-lifecycle)
