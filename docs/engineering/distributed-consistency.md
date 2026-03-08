# 分布式系统一致性方案

## 一、CAP 理论

分布式系统无法同时满足以下三点：

| 特性 | 含义 | 说明 |
|------|------|------|
| **C**onsistency（一致性） | 所有节点同一时刻数据一致 | 强一致性 vs 最终一致性 |
| **A**vailability（可用性） | 部分节点故障系统仍可用 | 读写都能响应 |
| **P**artition Tolerance（分区容错） | 网络分区时系统仍能运行 | 分布式系统必须满足 |

**现实选择：**
- **CP 系统**：ZooKeeper、Etcd（保证一致性，分区时可能不可用）
- **AP 系统**：Eureka、Cassandra（保证可用性，数据可能不一致）

## 二、BASE 理论

对 CAP 的补充，适用于互联网场景：

- **BA**（Basically Available）：基本可用，允许部分功能降级
- **S**（Soft State）：软状态，允许中间状态
- **E**（Eventual Consistency）：最终一致性，一段时间后数据一致

## 三、一致性解决方案

### 3.1 两阶段提交（2PC）

```
阶段一：准备阶段
  Coordinator → 所有 Participant：准备提交？
  Participant → Coordinator：Yes/No

阶段二：提交阶段
  如果全部 Yes：
    Coordinator → 所有 Participant：提交
  如果有 No：
    Coordinator → 所有 Participant：回滚
```

**优点：** 强一致性
**缺点：** 
- 同步阻塞，性能差
- 单点故障（Coordinator）
- 数据不一致风险（阶段二故障）

**实现：** XA 协议、MySQL 主从复制

### 3.2 三阶段提交（3PC）

在 2PC 基础上增加预提交阶段，降低阻塞风险：

```
阶段一：CanCommit
  询问是否可以开始事务

阶段二：PreCommit
  预执行，不提交

阶段三：DoCommit
  正式提交
```

**改进：** 参与者在超时后可以主动提交，减少阻塞
**问题：** 网络分区时仍可能数据不一致

### 3.3 TCC（Try-Confirm-Cancel）

**应用层实现的事务方案：**

```java
@TccTransaction(confirmMethod = "confirm", cancelMethod = "cancel")
public void transfer(Account from, Account to, Long amount) {
    // Try 阶段：预留资源
    from.freeze(amount);
    to.freeze(amount);
}

public void confirm(Account from, Account to, Long amount) {
    // Confirm 阶段：实际扣减
    from.deduct(amount);
    to.add(amount);
}

public void cancel(Account from, Account to, Long amount) {
    // Cancel 阶段：释放资源
    from.unfreeze(amount);
    to.unfreeze(amount);
}
```

**特点：**
- 无资源锁定，性能较好
- 需要业务实现三个方法
- 支持幂等、防悬挂、空回滚

**框架：** Seata、ByteTCC

### 3.4 本地消息表

**最终一致性方案：**

```
1. 业务数据 + 消息记录 写入同一数据库事务
2. 定时任务扫描消息表，发送消息
3. 消费者处理消息
4. 更新消息状态为已完成
```

```sql
-- 消息表
CREATE TABLE message (
    id BIGINT PRIMARY KEY,
    business_id BIGINT,
    payload TEXT,
    status TINYINT,  -- 0:待发送 1:已发送 2:已完成
    retry_count INT,
    create_time DATETIME
);
```

**优点：** 简单可靠，不依赖中间件
**缺点：** 有延迟，需要轮询

### 3.5 事务消息（RocketMQ）

```
1. 发送 Half 消息（对消费者不可见）
2. 执行本地事务
3. 根据本地事务结果：
   - 成功 → Commit 消息（消费者可见）
   - 失败 → Rollback 消息
   - 无响应 → 回查本地事务状态
```

```java
@TransactionalListener
public TransactionListener createListener() {
    return new TransactionListener() {
        @Override
        public LocalTransactionState executeLocalTransaction(Message msg, Object arg) {
            // 执行本地事务
            try {
                businessService.process();
                return LocalTransactionState.COMMIT_MESSAGE;
            } catch (Exception e) {
                return LocalTransactionState.ROLLBACK_MESSAGE;
            }
        }
        
        @Override
        public LocalTransactionState checkLocalTransaction(MessageExt msg) {
            // 回查本地事务状态
            return businessService.checkStatus(msg);
        }
    };
}
```

**优点：** 高吞吐，最终一致性
**缺点：** 依赖特定消息队列

### 3.6 Saga 模式

**长事务解决方案，适用于微服务：**

```
Saga = {T1, T2, T3, ..., Tn}

正常流程：T1 → T2 → T3 → ... → Tn
补偿流程：Cn → Cn-1 → ... → C2 → C1
```

**实现方式：**

- **协调式**：中心化协调器控制流程
- ** choreography**：各服务自行触发下一步

```java
// 订单 Saga
@SagaStart
public void createOrder(Order order) {
    // T1: 创建订单
    orderService.create(order);
    
    // T2: 扣减库存
    inventoryService.deduct(order.getItems());
    
    // T3: 扣减账户
    accountService.deduct(order.getUserId(), order.getAmount());
}

// 补偿方法
@Compensable
public void compensateCreateOrder(Order order) {
    orderService.cancel(order.getId());
    inventoryService.restore(order.getItems());
    accountService.refund(order.getUserId(), order.getAmount());
}
```

**框架：** Seata Saga、Axon Framework

## 四、分布式锁

### 4.1 Redis 分布式锁

```java
// 加锁
String requestId = UUID.randomUUID().toString();
Boolean locked = redis.set(lockKey, requestId, 
    SetParams.setParams().nx().ex(30));

if (locked) {
    try {
        // 业务逻辑
    } finally {
        // 解锁（Lua 脚本保证原子性）
        String script = 
            "if redis.call('get', KEYS[1]) == ARGV[1] then " +
            "   return redis.call('del', KEYS[1]) " +
            "else " +
            "   return 0 " +
            "end";
        redis.eval(script, Collections.singletonList(lockKey), requestId);
    }
}
```

**Redisson 实现（推荐）：**
```java
RLock lock = redisson.getLock("myLock");
lock.lock();  // 自动续期（Watch Dog）
try {
    // 业务逻辑
} finally {
    lock.unlock();
}
```

### 4.2 ZooKeeper 分布式锁

```
1. 创建临时顺序节点：/locks/lock-0001
2. 检查是否有更小的节点
3. 如果没有，获得锁
4. 如果有，监听前一个节点
5. 前一个节点删除后，获得锁
```

**特点：** 强一致性，可靠性高，性能较低

## 五、方案选型指南

| 场景 | 推荐方案 | 一致性级别 |
|------|----------|------------|
| 单体应用事务 | 本地事务 | 强一致 |
| 跨服务调用，要求强一致 | TCC / 2PC | 强一致 |
| 跨服务调用，可接受延迟 | 事务消息 / 本地消息表 | 最终一致 |
| 长流程业务 | Saga | 最终一致 |
| 高并发秒杀 | Redis 锁 + 队列 | 最终一致 |
| 配置中心 | ZooKeeper / Etcd | 强一致 |

## 六、最佳实践

1. **优先本地事务**，能不用分布式事务就不用
2. **选择最终一致性**，互联网场景足够
3. **做好幂等设计**，防止重复执行
4. **设置超时和重试**，避免死锁
5. **监控和告警**，及时发现异常
6. **降级预案**，事务失败时的补救措施

---

**相关文档：**
- [分布式 ID 生成方案](/engineering/distributed-id)
- [微服务架构设计](/engineering/microservice-architecture)
