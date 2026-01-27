# 秒杀系统设计

> 秒杀是电商系统中最具挑战性的场景之一。它具有瞬时高并发、库存少、业务流程简单但对数据一致性要求极高的特点。本文将从前端、网关、服务层、数据库层全方位解析一个生产级秒杀系统的设计。

## 一、核心挑战

| 挑战点 | 描述 | 解决方案 |
| :--- | :--- | :--- |
| **高并发** | 流量是平时的几十倍甚至上百倍 | 多级缓存、限流、削峰 |
| **超卖** | 库存扣减出现负数 | 乐观锁、Redis 原子操作 |
| **恶意请求** | 脚本抢购、黄牛刷单 | 图形验证码、IP限流、隐藏秒杀地址 |
| **数据库宕机** | 瞬时写压力打挂数据库 | 消息队列异步下单 |

---

## 二、总体架构设计

```text
用户请求 
  ↓
[CDN] (静态资源加速)
  ↓
[Nginx] (负载均衡 + IP限流)
  ↓
[API 网关] (鉴权 + 全局限流 + 黑名单)
  ↓
[秒杀服务] (Redis 预减库存 + 本地缓存)
  ↓ (库存充足)
[MQ 消息队列] (削峰填谷)
  ↓ (异步消费)
[订单服务] (数据库扣减库存 + 创建订单)
  ↓
[MySQL] (最终一致性)
```

---

## 三、详细设计方案

### 1. 前端层：将请求拦截在最外层

前端是流量的第一道防线，原则是**尽量减少发送到后端的请求**。

-   **页面静态化**：将秒杀详情页（商品描述、图片）静态化并推送到 CDN，用户访问时直接从最近的节点获取，不打应用服务器。
-   **按钮控制**：
    -   秒杀开始前，按钮置灰（"未开始"）。
    -   秒杀开始后，点击一次后立即置灰几秒（防止狂点），并显示 "排队中..."。
-   **防刷验证**：在点击秒杀前，强制弹出滑块验证码或计算题，增加请求成本，拦截自动化脚本。
-   **动态秒杀地址**：秒杀接口地址不固定（如 `/seckill/{randomKey}`），用户只有在点击秒杀时才能获取到这个动态 Key，防止提前通过 API 刷单。

### 2. 网关层：流量过滤

使用 Nginx 或 Spring Cloud Gateway 进行流量清洗。

**Nginx 限流配置示例：**

```nginx
http {
    # 定义限流区域：按 IP 限制，每秒 10 个请求
    limit_req_zone $binary_remote_addr zone=seckill_zone:10m rate=10r/s;

    server {
        location /seckill {
            # 应用限流，突发不超过 20 个
            limit_req zone=seckill_zone burst=20 nodelay;
            proxy_pass http://seckill-service;
        }
    }
}
```

### 3. 服务层：极致性能优化

#### A. Redis 预减库存 (核心)

数据库无法抗住每秒万级的扣减请求，必须在 Redis 中完成库存扣减。

1.  **预热**：秒杀开始前，将商品库存加载到 Redis (`set seckill_goods_1001 100`)。
2.  **扣减**：使用 Lua 脚本保证 "读取-判断-扣减" 的原子性。

**Lua 脚本 (seckill.lua):**

```lua
local goodsId = KEYS[1]
local userId = KEYS[2]

-- 1. 校验用户是否已抢购 (幂等性)
local orderKey = "seckill_order:" .. goodsId
if redis.call("sismember", orderKey, userId) == 1 then
    return -1 -- 重复抢购
end

-- 2. 校验库存
local stockKey = "seckill_stock:" .. goodsId
local stock = tonumber(redis.call("get", stockKey))

if stock <= 0 then
    return 0 -- 库存不足
end

-- 3. 扣减库存 & 记录用户
redis.call("decr", stockKey)
redis.call("sadd", orderKey, userId)

return 1 -- 抢购成功
```

**Java 调用代码：**

```java
public boolean seckill(String userId, String goodsId) {
    Long result = stringRedisTemplate.execute(
        seckillLuaScript, 
        Arrays.asList(goodsId, userId)
    );
    return result != null && result == 1;
}
```

#### B. 本地缓存 (JVM)

对于 "秒杀是否开始"、"秒杀是否结束" 这种全局状态标记，可以使用 Guava Cache 或 ConcurrentHashMap 缓存在 JVM 本地。这样连 Redis 都不用查，性能进一步提升。

### 4. 异步层：削峰填谷

当 Redis 扣减库存成功后，并不直接写数据库，而是发送一条消息到 MQ。

-   **消息体**：`{userId: 1001, goodsId: 8888, time: ...}`
-   **生产者**：秒杀服务，发送消息后直接给前端返回 "排队中"。
-   **消费者**：订单服务，监听 MQ，以数据库能承受的速度慢慢消费。

### 5. 数据库层：兜底保障

虽然 Redis 挡住了绝大部分流量，但最终还是要写库。数据库层需要保证**数据绝对一致性**。

**表结构设计：**

```sql
CREATE TABLE `seckill_stock` (
  `goods_id` bigint(20) NOT NULL COMMENT '商品ID',
  `count` int(11) NOT NULL COMMENT '库存数量',
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `seckill_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `goods_id` bigint(20) NOT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_goods` (`user_id`, `goods_id`) -- 唯一索引防重
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**乐观锁减库存 SQL：**

消费者在执行扣减时，利用 `count > 0` 条件作为乐观锁，防止 Redis 和 数据库数据不一致导致的超卖。

```sql
UPDATE seckill_stock 
SET count = count - 1 
WHERE goods_id = 8888 AND count > 0;
```

如果 Update 影响行数为 0，说明库存已空，标记该订单失败。

---

## 四、总结

秒杀系统的设计核心在于：**把请求拦截在系统上游，将数据库的压力降到最低**。

1.  **浏览器端**：拦截 80% 的无效请求（点击限制）。
2.  **网关层**：拦截恶意流量和超频 IP。
3.  **缓存层**：Redis 扛住核心读写压力，拦截 99% 的流量。
4.  **数据库**：只处理真正有效的 1% 订单写入，且通过 MQ 削峰。
