# 中间件

Kafka、RabbitMQ、Elasticsearch、ZooKeeper 等中间件实战应用。

## 🔥 高频考点

### Kafka
- 架构设计（Producer、Broker、Consumer、ZooKeeper）
- 消息可靠性保证（ACK 机制、重试、幂等）
- 顺序消息实现
- 消息积压解决方案
- Consumer Group 重平衡机制

### RabbitMQ
- 交换机类型（Direct、Fanout、Topic、Headers）
- 消息可靠性（Confirm、Return、持久化）
- 死信队列和延迟队列
- 集群和镜像队列

### Elasticsearch
- 倒排索引原理
- 分片和副本机制
- 写入和查询流程
- 性能优化（Mapping、分词器）

### ZooKeeper
- ZAB 协议
- 节点类型（持久、临时、顺序）
- Watcher 机制
- 分布式锁实现

## 📝 选型对比

| 场景 | 推荐方案 |
|------|----------|
| 日志收集 | Kafka |
| 订单消息 | RocketMQ/RabbitMQ |
| 实时计算 | Kafka |
| 搜索引擎 | Elasticsearch |
| 配置管理 | Nacos/Apollo |
| 分布式锁 | ZooKeeper/Redis |
