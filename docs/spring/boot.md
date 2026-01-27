# Spring Boot

Spring Boot 旨在简化 Spring 应用的初始搭建和开发过程。

## 1. 核心特性

- **自动配置**：根据 classpath 下的 jar 包自动配置 Bean。
- **Starter 依赖**：一站式引入相关依赖，解决版本冲突。
- **内嵌容器**：内嵌 Tomcat/Jetty，无需部署 WAR 包。

## 2. 常用注解

- `@SpringBootApplication`: 启动类注解
- `@RestController`: 组合注解 (@Controller + @ResponseBody)
- `@Autowired`: 自动注入 Bean

## 3. 配置文件

支持 `application.properties` 和 `application.yml` (推荐)。
