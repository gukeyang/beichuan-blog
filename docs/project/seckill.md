# 秒杀系统设计与实现

高并发秒杀系统的架构设计和实现方案。

## 系统特点

- **高并发**: 瞬时大量请求
- **库存有限**: 商品数量有限
- **公平性**: 防止作弊和刷单
- **高性能**: 低延迟响应

## 架构设计

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   CDN    │ ──▶ │  网关层   │ ──▶ │  服务层   │
│ 静态资源  │     │ 限流熔断  │     │ 业务逻辑  │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                              ┌────────▼────────┐
                              │                 │
                         ┌────▼────┐      ┌────▼────┐
                         │  Redis  │      │  MySQL  │
                         │ 缓存层   │      │ 数据库   │
                         └─────────┘      └─────────┘
```

## 核心技术方案

### 1. 库存预热

```java
// 活动开始前将库存加载到 Redis
redis.set("seckill:product:1001:stock", "1000");
```

### 2. 扣减库存

```java
// 使用 Redis DECR 原子操作
Long stock = redis.decr("seckill:product:1001:stock");
if (stock < 0) {
    redis.incr("seckill:product:1001:stock");
    return Result.fail("库存不足");
}
```

### 3. 消息队列异步下单

```java
// 秒杀成功后发送消息
mq.send("seckill.order.queue", {
    userId: userId,
    productId: productId
});
```

### 4. 限流和防刷

```java
// 令牌桶限流
if (!rateLimiter.tryAcquire(userId)) {
    return Result.fail("请求太频繁");
}

// 验证码
if (!captchaService.verify(captcha)) {
    return Result.fail("验证码错误");
}
```

## 数据库优化

### 1. 乐观锁

```sql
UPDATE product 
SET stock = stock - 1 
WHERE id = 1001 AND stock > 0;
```

### 2. 分库分表

- 按用户 ID 分表
- 按商品 ID 分表
- 历史数据归档

### 3. 读写分离

- 主库写
- 从库读
- 缓存优先

## 前端优化

### 1. 按钮防重复点击

```javascript
let clicked = false;
button.onclick = () => {
    if (clicked) return;
    clicked = true;
    // 发送请求
};
```

### 2. 倒计时同步

```javascript
// 使用服务器时间校准
const serverTime = await fetch('/api/time');
const countdown = serverTime - startTime;
```

### 3. 静态资源 CDN

- HTML 动态
- CSS/JS 静态
- 图片 CDN

## 常见问题

### 超卖问题

- Redis 原子操作
- 数据库乐观锁
- 最终一致性校验

### 恶意刷单

- IP 限流
- 用户限流
- 验证码
- 风控系统

### 系统雪崩

- 服务降级
- 熔断机制
- 限流保护
- 排队系统

## 相关文档

- [分布式一致性](/notes/engineering/distributed-consistency)
- [Redis 缓存模式](/notes/middleware/redis-cache-patterns)
- [Kafka 核心](/notes/middleware/kafka-core)
