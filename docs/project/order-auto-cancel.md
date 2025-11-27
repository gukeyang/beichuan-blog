---
title: 电商平台中订单未支付过期如何实现自动关单
tags:
  - 电商
  - 订单
categories: 场景题
abbrlink: ac61cbee
date: 2025-10-22 01:41:03
---

## 🧩 一、业务背景

在电商中，用户下单但未付款时，系统会给他一个**支付有效期**（比如 30 分钟）。
 超过有效期还未支付的订单，需要自动关闭，释放库存、恢复优惠券等。

### 目标：用户下单 → 30 分钟未支付 → 系统自动关闭订单

## ⚙️ 二、常见实现方案（按复杂度递进）

### ✅ 方案一：定时任务轮询数据库（最简单）

**思路：**
 用 `Spring Task` 或 `Quartz` 定时任务，每隔几分钟扫描一次未支付且已超时的订单，批量修改为“已关闭”。

**伪代码：**

```java
@Scheduled(cron = "0 */5 * * * ?") // 每5分钟执行一次
public void closeTimeoutOrders() {
    List<Order> orders = orderMapper.findUnpaidOrdersOlderThan(30);
    for (Order order : orders) {
        orderService.closeOrder(order);
    }
}
```

**优点：**

- 实现简单，易于理解。
  **缺点：**
- 不实时（最小粒度取决于定时任务频率）
- 若订单量大，扫描表会很耗性能
- 需要数据库索引优化（创建 `status + create_time` 索引）

**适用：**
 小型项目、学习项目、或没有 MQ 的系统。

## ✅ 方案二：延迟队列（推荐）

**核心思想：**
 订单创建时，发送一条延迟消息（例如延迟 30 分钟）；
 消息到期后自动触发消费逻辑，检查订单是否已支付，若未支付则关闭。

#### 实现方式一：RabbitMQ TTL + 死信队列（最常用）

**流程：**

1. 用户创建订单 → 发送消息到 “订单延迟队列（TTL=30min）”
2. 消息 30 分钟后过期 → 进入死信队列（Dead Letter Queue）
3. 死信消费者监听 → 检查订单是否已支付 → 未支付则关闭

**配置示例：**

```java
// 1. 延迟队列配置
@Configuration
public class RabbitConfig {
    public static final String ORDER_DELAY_QUEUE = "order.delay.queue";
    public static final String ORDER_DEAD_QUEUE = "order.dead.queue";
    public static final String ORDER_EXCHANGE = "order.exchange";

    @Bean
    public Queue orderDelayQueue() {
        return QueueBuilder.durable(ORDER_DELAY_QUEUE)
                .withArgument("x-dead-letter-exchange", ORDER_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", "order.dead")
                .withArgument("x-message-ttl", 30 * 60 * 1000)
                .build();
    }

    @Bean
    public Queue orderDeadQueue() {
        return QueueBuilder.durable(ORDER_DEAD_QUEUE).build();
    }

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(ORDER_EXCHANGE);
    }

    @Bean
    public Binding delayBinding() {
        return BindingBuilder.bind(orderDelayQueue())
                .to(orderExchange())
                .with("order.create");
    }

    @Bean
    public Binding deadBinding() {
        return BindingBuilder.bind(orderDeadQueue())
                .to(orderExchange())
                .with("order.dead");
    }
}
```

**消费者逻辑：**

```java
@RabbitListener(queues = RabbitConfig.ORDER_DEAD_QUEUE)
public void closeOrder(OrderMessage msg) {
    Order order = orderService.findById(msg.getOrderId());
    if (order.isUnpaid()) {
        orderService.closeOrder(order);
    }
}
```

**优点：**

- 实时性高（到期自动触发）
- 不会频繁扫表，性能好
- 扩展性强（可接入库存恢复、优惠券回退等事件）

**缺点：**

- 依赖消息中间件
- 消息可靠性、幂等性、重复消费要重点处理

#### 实现方式二：Redis 延迟任务（ZSet）

**思路：**

- 将订单ID 和过期时间作为 score 放入 Redis Sorted Set；
- 定时轮询 Redis，取出时间 <= 当前时间的订单进行关闭。

```java
// 订单创建时
redisTemplate.opsForZSet().add("order:delay", orderId, System.currentTimeMillis() + 30*60*1000);

// 定时扫描任务
@Scheduled(fixedDelay = 10000)
public void checkExpiredOrders() {
    Set<String> expired = redisTemplate.opsForZSet()
            .rangeByScore("order:delay", 0, System.currentTimeMillis());
    for (String orderId : expired) {
        orderService.closeOrder(orderId);
        redisTemplate.opsForZSet().remove("order:delay", orderId);
    }
}
```

**优点：**

- 不依赖 MQ
- 实现相对简单
  **缺点：**
- Redis 持久化和可靠性不足（节点宕机可能丢任务）

#### 实现方式三：基于 Redisson 的延迟队列

Redisson 自带 `RDelayedQueue`，封装了延迟消息逻辑。

```java
RBlockingQueue<String> blockingQueue = redissonClient.getBlockingQueue("order.queue");
RDelayedQueue<String> delayedQueue = redissonClient.getDelayedQueue(blockingQueue);

// 订单创建时
delayedQueue.offer(orderId, 30, TimeUnit.MINUTES);

// 消费
while (true) {
    String orderId = blockingQueue.take();
    orderService.closeOrder(orderId);
}
```

**优点：**

- 比 Redis ZSet 更优雅
- 适合中小规模系统

### ✅ 方案三：基于时间轮算法（高并发系统）

对于 **高并发订单系统（如天猫、京东）**，可以使用时间轮算法（如 Netty HashedWheelTimer、Kafka DelayQueue、TimerWheel）实现更高效的延迟任务调度。

## 🧠 三、核心技术要点

| 关键点 | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| 幂等性 | 多次消费、任务重试时必须避免重复关单（例如通过订单状态字段判断） |
| 可靠性 | MQ 可能丢消息，要保证消息确认机制（ACK + 重试）              |
| 一致性 | 关闭订单时要同步释放库存、恢复优惠券，建议使用事务或可靠消息 |
| 性能   | 避免数据库全表扫描，使用索引或分表                           |
| 扩展性 | 可将关单任务扩展为“订单状态流转引擎”                         |

## 🧩 四、面试延伸话题

1. **如果 MQ 挂了怎么办？**
   → 增加定时补偿任务（兜底机制）
2. **如何避免重复关单？**
   → 幂等性控制（订单状态机 + 乐观锁）
3. **延迟消息的顺序问题？**
   → 同一个订单 ID 绑定相同 routing key，保证消息顺序
4. **分布式系统中时间不一致怎么办？**
   → 所有节点同步 NTP，或统一以服务端时间为准
5. **支付成功但延迟消息还没到怎么办？**
   → 消费时再次检查订单状态，已支付则直接丢弃消息

## ✅ 推荐方案总结

| 场景          | 推荐方案                                                    |
| ------------- | ----------------------------------------------------------- |
| 学习/小型项目 | Spring Task 定时扫描                                        |
| 中小型项目    | Redis ZSet / Redisson DelayedQueue                          |
| 中大型项目    | RabbitMQ 延迟队列（TTL+DLX）                                |
| 超大规模电商  | 时间轮 + 分布式任务调度（如 DelayLevel、RocketMQ 延迟消息） |
