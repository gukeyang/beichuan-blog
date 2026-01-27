# Spring Framework

Spring 是一个轻量级的控制反转 (IoC) 和面向切面 (AOP) 的容器框架。

## 1. IoC (控制反转)

将对象的创建权交给 Spring 容器管理，解耦对象间的依赖关系。

- **DI (依赖注入)**：IoC 的一种实现方式，通过 Setter、构造器或注解注入依赖。

## 2. AOP (面向切面编程)

在不修改源代码的情况下，对现有方法进行增强（如日志、事务、权限控制）。

- **切点 (Pointcut)**：定义在哪些地方插入逻辑。
- **通知 (Advice)**：定义插入什么逻辑 (Before, After, Around)。

## 3. Bean 生命周期

实例化 -> 属性赋值 -> 初始化 (init-method) -> 使用 -> 销毁 (destroy-method)
