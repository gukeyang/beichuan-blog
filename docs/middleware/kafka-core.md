# Kafka 核心概念

> 📨 分布式消息队列之王

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                      Kafka Cluster                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Broker 0   │  │  Broker 1   │  │  Broker 2   │         │
│  │  (Leader)   │  │  (Leader)   │  │  (Leader)   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│    ┌────┴────┐      ┌────┴────┐      ┌────┴────┐           │
│    │Partition│      │Partition│      │Partition│           │
│    │   0     │      │   1     │      │   2     │           │
│    └─────────┘      └─────────┘      └─────────┘           │
└─────────────────────────────────────────────────────────────┘
           ▲                    │                    ▲
           │                    │                    │
    ┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐
    │  Producer   │      │   ZooKeeper │      │  Consumer   │
    │             │      │  /KRaft     │      │   Group     │
    └─────────────┘      └─────────────┘      └─────────────┘
```

## 核心概念

### Topic（主题）

消息的逻辑分类，类似数据库的表。

```bash
# 创建 Topic
kafka-topics.sh --create \
  --bootstrap-server localhost:9092 \
  --topic order-events \
  --partitions 3 \
  --replication-factor 2

# 查看 Topic
kafka-topics.sh --describe --topic order-events
```

### Partition（分区）

**为什么需要分区？**
- 水平扩展：不同分区可以分布在不同 Broker
- 并行处理：多个消费者可以并行消费
- 提高吞吐：写入和读取都可以并行

**分区策略**：
```java
// 1. 轮询（默认）
partition = (partition + 1) % numPartitions

// 2. 按 Key 哈希
partition = hash(key) % numPartitions

// 3. 自定义分区器
public class CustomPartitioner implements Partitioner {
    @Override
    public int partition(String topic, Object key, byte[] keyBytes,
                        Object value, byte[] valueBytes, Cluster cluster) {
        // 自定义逻辑
        return 0;
    }
}
```

### Offset（偏移量）

每条消息在分区中的唯一标识，从 0 开始递增。

```
Partition 0:
┌───────┬───────┬───────┬───────┬───────┐
│ Off 0 │ Off 1 │ Off 2 │ Off 3 │ Off 4 │
└───────┴───────┴───────┴───────┴───────┘
   ▲                           ▲
   │                           │
消费者 A                    消费者 B
已消费到                     已消费到
```

### Consumer Group（消费者组）

**核心规则**：
- 一个分区只能被组内一个消费者消费
- 一个消费者可以消费多个分区
- 消费者数 ≤ 分区数

```
Topic: order-events (3 partitions)

Consumer Group: order-service
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Consumer A   │     │ Consumer B   │     │ Consumer C   │
│              │     │              │     │              │
│ Partition 0  │     │ Partition 1  │     │ Partition 2  │
└──────────────┘     └──────────────┘     └──────────────┘

添加 Consumer D 后（Rebalance）:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Consumer A   │     │ Consumer B   │     │ Consumer C   │     │ Consumer D   │
│              │     │              │     │              │     │              │
│ Partition 0  │     │ Partition 1  │     │  空闲        │     │ Partition 2  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## 生产者（Producer）

### 核心配置

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

// 可靠性配置
props.put("acks", "all");              // 所有副本确认
props.put("retries", 3);               // 重试次数
props.put("enable.idempotence", true); // 幂等性

// 性能配置
props.put("batch.size", 16384);        // 批次大小
props.put("linger.ms", 5);             // 等待时间
props.put("compression.type", "lz4");  // 压缩

KafkaProducer<String, String> producer = new KafkaProducer<>(props);
```

### 发送消息

```java
// 同步发送
ProducerRecord<String, String> record = 
    new ProducerRecord<>("order-events", "order-123", "{\"orderId\": 123}");
ProducerRecord<String, String> record = new ProducerRecord<>("topic", "key", "value");
Producer<ProducerRecord<String, String> record, String> record = new ProducerRecord<>("order-events", "order-123", "{\"orderId\": 123}");
Future<RecordMetadata> future = producer.send(record);
RecordMetadata metadata = future.get();

// 异步发送（带回调）
producer.send(record, (metadata, exception) -> {
    if (exception != null) {
        exception.printStackTrace();
    } else {
        System.out.printf("发送成功：%s-%d@%d%n", 
            metadata.topic(), metadata.partition(), metadata.offset());
    }
});

// 关闭生产者
producer.close();
```

### 可靠性保证

| acks 配置 | 说明 | 可靠性 | 性能 |
|-----------|------|--------|------|
| 0 | 不等待确认 | 最低 | 最高 |
| 1 | Leader 确认 | 中等 | 高 |
| all/-1 | 所有 ISR 确认 | 最高 | 最低 |

## 消费者（Consumer）

### 核心配置

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "order-service");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

// 消费位置
props.put("auto.offset.reset", "earliest");  // earliest/latest/none

// 提交配置
props.put("enable.auto.commit", false);  // 手动提交
props.put("auto.commit.interval.ms", "5000");

// 会话配置
props.put("session.timeout.ms", "30000");
props.put("max.poll.records", "500");
props.put("max.poll.interval.ms", "300000");

KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("order-events"));
```

### 消费消息

```java
// 手动提交
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("收到消息：%s-%d@%d: %s%n",
            record.topic(), record.partition(), record.offset(), record.value());
        
        // 处理业务逻辑
        processOrder(record.value());
    }
    
    // 同步提交
    consumer.commitSync();
    
    // 异步提交
    // consumer.commitAsync((offsets, exception) -> {
    //     if (exception != null) {
    //         // 处理提交失败
    //     }
    // });
}
```

### Rebalance（重平衡）

**触发条件**：
- 消费者加入或离开组
- Topic 分区数变化
- 消费者超时未发送心跳

**监听 Rebalance**：
```java
consumer.subscribe(Arrays.asList("order-events"), new ConsumerRebalanceListener() {
    @Override
    public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
        // 提交偏移量，清理资源
        consumer.commitSync();
    }
    
    @Override
    public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
        // 可以从特定偏移量开始消费
    }
});
```

## 存储机制

### 日志文件结构

```
/var/kafka-logs/order-events-0/
├── 00000000000000000000.log      # 日志段
├── 00000000000000000000.index    # 偏移量索引
├── 00000000000000000000.timeindex # 时间戳索引
├── 00000000000000000100.log      # 下一个日志段
├── 00000000000000000100.index
└── leader-epoch-checkpoint       # Leader 纪元
```

### 消息格式

```
┌────────────────────────────────────────┐
│             Message Set                 │
├────────────────────────────────────────┤
│  Offset │ Size │ CRC │ Magic │ ...    │
│  8 bytes│ 4 bytes│4 bytes│1 byte│ ... │
└────────────────────────────────────────┘
```

## 高可用机制

### ISR（In-Sync Replicas）

```
Partition 0:
┌─────────────┐
│  Leader     │  Broker 0  ← 处理读写请求
├─────────────┤
│  ISR:       │
│  - Broker 0 │  ✓
│  - Broker 1 │  ✓
│  - Broker 2 │  ✗ (落后)
└─────────────┘
```

### HW（High Watermark）与 LEO

```
Broker 0 (Leader):
┌─────────────────────────────────┐
│ LEO = 100  │ 最新写入位置       │
├─────────────────────────────────┤
│ HW = 90    │ 所有 ISR 同步位置   │
├─────────────────────────────────┤
│            │ 消费者可见消息     │
└─────────────────────────────────┘

消费者只能消费到 HW 之前的消息
```

## 监控指标

### 关键指标

| 指标 | 说明 | 告警阈值 |
|------|------|----------|
| UnderReplicatedPartitions | 未完全复制的分区数 | > 0 |
| OfflinePartitionsCount | 离线分区数 | > 0 |
| RequestHandlerAvgIdlePercent | 请求处理空闲率 | < 70% |
| NetworkProcessorAvgIdlePercent | 网络处理空闲率 | < 70% |
| ConsumerLag | 消费者延迟 | > 10000 |

### 查看消费者延迟

```bash
# 查看消费组延迟
kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
  --group order-service --describe

# 输出示例
GROUP           TOPIC          PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
order-service   order-events   0          1000            1500            500
order-service   order-events   1          2000            2100            100
order-service   order-events   2          1500            1600            100
```

## 最佳实践

### 生产者

1. **启用幂等性**：`enable.idempotence=true`
2. **合理设置 acks**：金融场景用 `all`，日志场景用 `1`
3. **批次发送**：调整 `batch.size` 和 `linger.ms`
4. **异常处理**：捕获 `TimeoutException` 和 `RetriableException`

### 消费者

1. **手动提交**：业务处理成功后再提交
2. **幂等消费**：处理重复消息
3. **控制批次**：根据处理能力调整 `max.poll.records`
4. **监控延迟**：及时处理消费积压

### Topic 设计

1. **分区数**：根据吞吐量和消费者数量确定
2. **副本数**：生产环境至少 2，建议 3
3. **保留策略**：根据存储容量和业务需求设置
4. **压缩**：日志类数据启用压缩

## 常见问题

### Q: 消息丢失怎么办？

```
生产者：acks=all + 重试 + 幂等性
Broker：min.insync.replicas=2
消费者：手动提交 + 幂等处理
```

### Q: 消息重复怎么办？

```
消费者实现幂等性：
- 数据库唯一键
- Redis 去重
- 状态机检查
```

### Q: 消费积压怎么办？

```
1. 增加消费者数量（不超过分区数）
2. 增加分区数（需要重建 Topic）
3. 优化消费逻辑
4. 临时扩容：新 Topic + 多消费者
```

## 下一步

- [ ] 搭建 Kafka 集群
- [ ] 实践生产者/消费者代码
- [ ] 学习 Kafka Streams
- [ ] 了解 KRaft 模式
