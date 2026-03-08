# Spring 全家桶

Spring Framework、Spring Boot、Spring Cloud 核心技术与实战。

## 🔥 面试高频考点

### Spring Core
- IOC 和 DI 的概念及实现原理
- Bean 的生命周期详解
- AOP 原理（JDK 动态代理 vs CGLIB）
- 循环依赖如何解决（三级缓存）
- 事务传播机制和隔离级别

### Spring Boot
- 自动配置原理（@EnableAutoConfiguration）
- Starter 工作机制
- 配置文件加载顺序
- Actuator 监控端点

### Spring Cloud
- Eureka/Nacos 服务注册与发现
- Ribbon/LoadBalancer 负载均衡
- Feign/OpenFeign 声明式调用
- Hystrix/Sentinel 熔断降级
- Gateway/Zuul 网关路由

## 📝 IOC 容器示例

```java
@Configuration
public class AppConfig {
    @Bean
    public UserService userService() {
        return new UserServiceImpl(userRepository());
    }
}
```

## 📝 AOP 切面示例

```java
@Aspect
@Component
public class LogAspect {
    @Around("execution(* com.example.service.*.*(..))")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();
        long cost = System.currentTimeMillis() - start;
        System.out.println(pjp.getSignature() + " cost: " + cost + "ms");
        return result;
    }
}
```
