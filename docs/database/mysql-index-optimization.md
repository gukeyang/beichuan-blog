# MySQL 索引优化实战

## 一、索引基础

### 1.1 什么是索引

索引是帮助 MySQL **高效获取数据**的数据结构。类比字典的目录，通过索引可以快速定位到目标数据，而无需全表扫描。

### 1.2 索引数据结构

MySQL 主要使用以下几种索引结构：

| 结构 | 特点 | 适用场景 |
|------|------|----------|
| B+Tree | 多路平衡查找树，叶子节点链表连接 | 范围查询、排序、InnoDB 默认 |
| Hash | 哈希表，等值查询 O(1) | 精确匹配，不支持范围查询 |
| R-Tree | 空间索引 | 地理信息系统 |
| Full-Text | 全文索引 | 文本搜索 |

## 二、索引分类

### 2.1 按物理存储分类

- **聚簇索引（Clustered Index）**：数据与索引存储在一起，InnoDB 的主键索引
- **非聚簇索引（Secondary Index）**：叶子节点存储主键值，需要回表查询

### 2.2 按逻辑分类

- **主键索引（PRIMARY）**：唯一且非空
- **唯一索引（UNIQUE）**：唯一但可空
- **普通索引（INDEX）**：无特殊限制
- **联合索引（COMPOSITE）**：多列组合索引
- **覆盖索引（COVERING）**：查询列都在索引中，无需回表

## 三、索引优化原则

### 3.1 最左前缀原则

联合索引 `(a, b, c)` 遵循最左前缀原则：

```sql
-- ✅ 使用索引
WHERE a = 1 AND b = 2
WHERE a = 1 AND b = 2 AND c = 3
WHERE a = 1

-- ❌ 不使用索引
WHERE b = 2 AND c = 3
WHERE c = 3
```

### 3.2 索引失效场景

```sql
-- 1. 对索引列使用函数
WHERE DATE(create_time) = '2024-01-01'  -- ❌
WHERE create_time >= '2024-01-01' AND create_time < '2024-01-02'  -- ✅

-- 2. 隐式类型转换
WHERE phone = 13800138000  -- ❌ phone 是字符串类型
WHERE phone = '13800138000'  -- ✅

-- 3. LIKE 以%开头
WHERE name LIKE '%张三'  -- ❌
WHERE name LIKE '张三%'  -- ✅

-- 4. OR 连接条件
WHERE a = 1 OR b = 2  -- ❌ (a,b 没有都建索引)
WHERE a = 1 OR a = 2  -- ✅
```

### 3.3 索引选择策略

```sql
-- 1. 区分度高的列适合建索引
-- 性别列（男/女）不适合，用户 ID 适合

-- 2. 频繁用于 WHERE、JOIN、ORDER BY 的列

-- 3. 联合索引考虑查询频率和顺序
-- (user_id, create_time) 比 (create_time, user_id) 更常用
```

## 四、实战案例

### 4.1 慢查询分析

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query%';

-- 使用 EXPLAIN 分析
EXPLAIN SELECT * FROM orders WHERE user_id = 123 ORDER BY create_time DESC;
```

### 4.2 EXPLAIN 关键字段

| 字段 | 含义 | 优化目标 |
|------|------|----------|
| type | 连接类型 | 至少 range，最好 ref/eq_ref/const |
| possible_keys | 可能使用的索引 | - |
| key | 实际使用的索引 | - |
| rows | 扫描行数 | 越少越好 |
| Extra | 额外信息 | 避免 Using filesort, Using temporary |

### 4.3 索引优化示例

**优化前：**
```sql
-- 查询用户最近 10 个订单，耗时 2.5s
SELECT * FROM orders 
WHERE user_id = 123 
ORDER BY create_time DESC 
LIMIT 10;
```

**优化后：**
```sql
-- 创建联合索引
CREATE INDEX idx_user_create ON orders(user_id, create_time DESC);

-- 使用覆盖索引
SELECT id, order_no, amount, create_time 
FROM orders 
WHERE user_id = 123 
ORDER BY create_time DESC 
LIMIT 10;
-- 耗时降至 50ms
```

## 五、索引维护

### 5.1 索引碎片整理

```sql
-- 查看表碎片
SELECT table_name, data_free 
FROM information_schema.tables 
WHERE table_schema = 'your_db';

-- 优化表（重建索引）
OPTIMIZE TABLE orders;
```

### 5.2 索引监控

```sql
-- 查看索引使用情况
SELECT * FROM sys.schema_unused_indexes;

-- 查看索引统计信息
SHOW INDEX FROM orders;
```

## 六、最佳实践总结

1. **单表索引数控制在 5 个以内**
2. **联合索引列数不超过 5 列**
3. **优先选择区分度高的列**
4. **避免在索引列上做计算**
5. **定期分析和优化索引**
6. **写多读少的表谨慎建索引**

---

**相关文档：**
- [MySQL 事务与锁机制](/database/mysql-transaction-lock)
- [MySQL 执行计划详解](/database/mysql-explain)
