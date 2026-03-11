# 分布式一致性

分布式系统中保证数据一致性的方案。

## CAP 定理

分布式系统最多同时满足以下三个特性中的两个：

- **Consistency (一致性)**: 所有节点在同一时间看到相同的数据
- **Availability (可用性)**: 每个请求都能得到响应
- **Partition Tolerance (分区容错性)**: 系统在网络分区时仍能运行

## 一致性模型

### 强一致性

- 线性一致性（Linearizability）
- 顺序一致性（Sequential Consistency）

### 弱一致性

- 最终一致性（Eventual Consistency）
- 因果一致性（Causal Consistency）

## 分布式事务方案

### 2PC (两阶段提交)

1. **准备阶段**: 协调者询问所有参与者是否可以提交
2. **提交阶段**: 如果所有参与者都同意，则提交；否则回滚

### 3PC (三阶段提交)

在 2PC 基础上增加预提交阶段，减少阻塞。

### TCC (Try-Confirm-Cancel)

- **Try**: 尝试执行，预留资源
- **Confirm**: 确认执行
- **Cancel**: 取消执行，释放资源

### 本地消息表

通过数据库消息表实现最终一致性。

### MQ 事务消息

使用消息队列的事务消息功能。

## 相关文档

- [Kafka 核心](/notes/middleware/kafka-core)
- [MySQL 索引优化](/notes/database/mysql-index-optimization)
