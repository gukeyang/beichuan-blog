# 数据库

MySQL、Redis 等数据库原理与优化实战。

## 🔥 MySQL 高频考点

- InnoDB vs MyISAM 存储引擎区别
- B+ 树索引原理及优化
- 事务隔离级别和 MVCC 机制
- 锁机制（行锁、间隙锁、Next-Key Lock）
- SQL 执行计划分析（EXPLAIN）
- 慢查询优化实战
- 分库分表方案设计

## 🔥 Redis 高频考点

- 5 种基本数据结构及应用场景
- RDB 和 AOF 持久化机制
- 主从复制和哨兵模式
- Redis Cluster 集群原理
- 缓存穿透、击穿、雪崩解决方案
- 分布式锁实现（Redlock）

## 📝 MySQL 最佳实践

```sql
-- ✅ 推荐：使用覆盖索引
SELECT id, name FROM users WHERE id = 1;

-- ❌ 避免：SELECT *
SELECT * FROM users WHERE id = 1;

-- ✅ 推荐：批量插入
INSERT INTO users (name, age) VALUES 
    ('a', 1), ('b', 2), ('c', 3);
```

## 📝 Redis 最佳实践

```java
// ✅ 推荐：使用 pipeline 批量操作
Pipeline pipeline = jedis.pipelined();
for (int i = 0; i < 1000; i++) {
    pipeline.set("key:" + i, "value:" + i);
}
pipeline.sync();
```
