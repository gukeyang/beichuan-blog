# Spring Cloud

Spring Cloud 为开发者提供了在分布式系统（如配置管理、服务发现、断路器、智能路由、微代理、控制总线、一次性 Token、全局锁、决策竞选、分布式会话和集群状态）中快速构建一些常见模式的工具。

## 1. 核心组件 (Alibaba)

- **Nacos**: 服务注册与发现、配置中心。
- **Sentinel**: 流量控制、熔断降级。
- **Seata**: 分布式事务解决方案。
- **RocketMQ**: 消息驱动。

## 2. 核心组件 (Netflix / 原生)

- **Eureka**: 服务注册中心 (已停止维护)。
- **Ribbon**: 负载均衡。
- **Feign**: 声明式 HTTP 客户端。
- **Hystrix**: 熔断器。
- **Zuul / Gateway**: API 网关。
