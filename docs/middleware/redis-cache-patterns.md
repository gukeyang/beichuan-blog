# Redis 缓存设计模式

## 一、缓存基础

### 1.1 为什么用缓存

- **提升性能**：内存读写速度比磁盘快 10 万倍
- **降低数据库压力**：减少直接访问数据库的请求
- **应对高并发**：缓存可以承载更高的 QPS

### 1.2 缓存选型

| 场景 | 推荐方案 |
|------|----------|
| 本地缓存，数据量小 | Caffeine, Guava Cache |
| 分布式缓存，数据量大 | Redis, Memcached |
| 需要持久化 | Redis (RDB/AOF) |
| 简单 KV 存储 | Memcached |

## 二、经典缓存模式

### 2.1 Cache Aside Pattern（旁路缓存）

**最常用的模式**，读写分离：

```java
// 读操作
public User getUser(Long id) {
    // 1. 先读缓存
    User user = redis.get("user:" + id);
    if (user != null) {
        return user;
    }
    
    // 2. 缓存未命中，读数据库
    user = userMapper.selectById(id);
    
    // 3. 写入缓存
    redis.set("user:" + id, user, 3600);
    
    return user;
}

// 写操作
public void updateUser(User user) {
    // 1. 先更新数据库
    userMapper.updateById(user);
    
    // 2. 再删除缓存（下次读时更新）
    redis.delete("user:" + user.getId());
}
```

**要点：**
- 写操作**删除缓存**而非更新缓存
- 避免并发写导致脏数据

### 2.2 Read/Write Through Pattern（读写穿透）

缓存代理数据库，应用只和缓存交互：

```java
// 伪代码示例
public class CacheManager {
    private Cache cache;
    private DataSource dataSource;
    
    public User get(Long id) {
        return cache.get(id, () -> dataSource.query(id));
    }
    
    public void put(User user) {
        cache.put(user.getId(), user);
        // 缓存自动同步到数据库
    }
}
```

**特点：**
- 应用代码简洁
- 需要缓存组件支持（如 Caffeine、Spring Cache）

### 2.3 Write Behind Pattern（异步缓存写入）

先写缓存，异步批量写数据库：

```
应用 → 写缓存 → 立即返回
            ↓
        异步队列 → 批量写数据库
```

**适用场景：**
- 写多读少
- 可以容忍短暂数据不一致
- 需要高吞吐

**风险：**
- 缓存宕机可能丢失数据

## 三、缓存问题与解决方案

### 3.1 缓存穿透

**问题：** 查询不存在的数据，缓存和数据库都没有，请求直达数据库。

**解决方案：**

```java
// 方案 1：缓存空值
public User getUser(Long id) {
    User user = redis.get("user:" + id);
    if (user == NOT_FOUND) {  // 特殊标记
        return null;
    }
    if (user != null) {
        return user;
    }
    
    user = userMapper.selectById(id);
    if (user == null) {
        // 缓存空值，设置较短过期时间
        redis.set("user:" + id, NOT_FOUND, 300);
        return null;
    }
    
    redis.set("user:" + id, user, 3600);
    return user;
}

// 方案 2：布隆过滤器
BloomFilter bloomFilter = BloomFilter.create(...);
if (!bloomFilter.mightContain(id)) {
    return null;  // 肯定不存在
}
```

### 3.2 缓存击穿

**问题：** 热点 key 过期瞬间，大量请求直达数据库。

**解决方案：**

```java
// 方案 1：互斥锁
public User getUser(Long id) {
    User user = redis.get("user:" + id);
    if (user != null) {
        return user;
    }
    
    // 获取分布式锁
    String lockKey = "lock:user:" + id;
    if (tryLock(lockKey)) {
        try {
            // 双重检查
            user = redis.get("user:" + id);
            if (user != null) {
                return user;
            }
            
            user = userMapper.selectById(id);
            redis.set("user:" + id, user, 3600);
        } finally {
            unlock(lockKey);
        }
    } else {
        // 等待重试
        Thread.sleep(50);
        return getUser(id);
    }
    return user;
}

// 方案 2：永不过期 + 异步更新
// 逻辑过期时间存储在 value 中
class CacheObject {
    User data;
    long expireTime;  // 逻辑过期时间
}
```

### 3.3 缓存雪崩

**问题：** 大量 key 同时过期，请求全部打到数据库。

**解决方案：**

```java
// 方案 1：随机过期时间
int expireTime = 3600 + random.nextInt(300);  // 3600-3900 秒
redis.set(key, value, expireTime);

// 方案 2：分层缓存
// 热点数据设置不同过期时间层级

// 方案 3：限流降级
if (dbQps > threshold) {
    return fallback();  // 返回默认值或错误
}
```

### 3.4 数据一致性

**问题：** 数据库和缓存数据不一致。

**解决方案：**

| 方案 | 一致性 | 性能 | 复杂度 |
|------|--------|------|--------|
| 先删缓存再更新 DB | 低 | 高 | 低 |
| 先更新 DB 再删缓存 | 中 | 高 | 低 |
| 延迟双删 | 中高 | 中 | 中 |
| Canal 监听 Binlog | 高 | 高 | 高 |

**延迟双删实现：**

```java
public void updateUser(User user) {
    // 1. 删除缓存
    redis.delete("user:" + user.getId());
    
    // 2. 更新数据库
    userMapper.updateById(user);
    
    // 3. 延迟删除（避免主从同步延迟）
    Thread.sleep(500);
    redis.delete("user:" + user.getId());
}
```

## 四、缓存数据结构设计

### 4.1 String（字符串）

```
用户信息：user:{id} → JSON 对象
计数器：counter:{type} → 数字
分布式锁：lock:{resource} → 请求标识
```

### 4.2 Hash（哈希）

```
用户信息：user:{id} → {name: xxx, age: xxx, email: xxx}
// 优点：可以单独获取/修改字段
HGET user:123 name
HSET user:123 age 25
```

### 4.3 ZSet（有序集合）

```
排行榜：rank:{type} → {user1: 1000, user2: 900, ...}
延迟队列：delay:queue → {task1: timestamp1, task2: timestamp2}

// 获取 Top10
ZREVRANK rank:game 0 9
// 获取到期任务
ZRANGEBYSCORE delay:queue 0 ${currentTime}
```

### 4.4 Bitmap

```
用户签到：signin:{userId}:{month} → bitmap
// 第 5 天签到
SETBIT signin:123:202401 5 1
// 统计签到天数
BITCOUNT signin:123:202401
```

## 五、最佳实践

1. **缓存粒度适中**：不要过大或过小
2. **设置合理过期时间**：避免永不过期
3. **热点数据预热**：活动前提前加载
4. **监控缓存命中率**：低于 70% 需要优化
5. **缓存降级预案**：缓存挂了不影响核心功能
6. **避免大 Key**：单个 value 不超过 10KB

---

**相关文档：**
- [Redis 持久化机制](/middleware/redis-persistence)
- [Redis 集群方案](/middleware/redis-cluster)
