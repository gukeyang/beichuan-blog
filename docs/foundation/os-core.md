# 操作系统核心概念

> 🔧 理解程序运行的底层世界

## 进程 vs 线程

### 核心区别

| 对比项 | 进程 | 线程 |
|--------|------|------|
| 定义 | 资源分配的最小单位 | CPU 调度的最小单位 |
| 内存空间 | 独立地址空间 | 共享进程内存 |
| 通信方式 | IPC（管道、消息队列、共享内存） | 直接读写共享数据 |
| 开销 | 创建/切换开销大 | 创建/切换开销小 |
| 独立性 | 一个进程崩溃不影响其他进程 | 一个线程崩溃可能导致整个进程崩溃 |

### 进程状态

```
    ┌─────────┐
    │  新建   │
    └────┬────┘
         ▼
    ┌─────────┐     ┌─────────┐
◄───│  就绪   │────►│  运行   │
    └────┬────┘     └────┬────┘
         │               │
         ▼               ▼
    ┌─────────┐     ┌─────────┐
    │  阻塞   │     │  终止   │
    └─────────┘     └─────────┘
```

### Java 线程状态

```java
public enum ThreadState {
    NEW,           // 新建
    RUNNABLE,      // 就绪/运行
    BLOCKED,       // 阻塞（等待锁）
    WAITING,       // 无限期等待
    TIMED_WAITING, // 限期等待
    TERMINATED     // 终止
}
```

## 内存管理

### 虚拟内存

```
用户空间
┌─────────────────┐
│    栈 Stack     │ ← 局部变量、函数调用
├─────────────────┤
│      ↓ 增长     │
│                 │
│      ↑ 增长     │
├─────────────────┤
│    堆 Heap      │ ← 动态分配对象
├─────────────────┤
│   共享库        │
├─────────────────┤
内核空间
│    内核空间     │
└─────────────────┘
```

### 分页与分段

| 机制 | 单位 | 优点 | 缺点 |
|------|------|------|------|
| 分页 | 固定大小页（4KB） | 无外部碎片 | 可能有内部碎片 |
| 分段 | 逻辑段（代码段、数据段） | 符合逻辑结构 | 有外部碎片 |

### 页面置换算法

```java
// LRU (Least Recently Used) 实现
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);  // accessOrder = true
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

## 进程调度算法

| 算法 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| FCFS | 先来先服务 | 简单公平 | 短作业等待时间长 |
| SJF | 短作业优先 | 平均等待时间最短 | 长作业可能饿死 |
| 时间片轮转 | 固定时间片轮流执行 | 响应快 | 上下文切换开销大 |
| 优先级调度 | 按优先级执行 | 灵活 | 低优先级可能饿死 |
| 多级反馈队列 | 综合多种算法 | 适应性好 | 实现复杂 |

## 死锁

### 产生条件（四个必要条件）

1. **互斥** - 资源一次只能被一个进程使用
2. **占有并等待** - 进程持有资源的同时等待其他资源
3. **不可抢占** - 资源不能被强制剥夺
4. **循环等待** - 存在循环等待链

### 预防策略

```java
// 破坏循环等待：按顺序申请锁
class BankAccount {
    private final int id;
    private int balance;
    
    public void transfer(BankAccount to, int amount) {
        BankAccount first = this.id < to.id ? this : to;
        BankAccount second = this.id < to.id ? to : this;
        
        synchronized (first) {
            synchronized (second) {
                // 转账操作
            }
        }
    }
}
```

### 银行家算法

```java
// 安全性检查
boolean isSafe(int[] available, int[][] max, int[][] allocation, int[][] need) {
    int[] work = available.clone();
    boolean[] finish = new boolean[need.length];
    
    while (true) {
        boolean found = false;
        for (int i = 0; i < need.length; i++) {
            if (!finish[i] && canAllocate(work, need[i])) {
                // 模拟分配
                for (int j = 0; j < work.length; j++) {
                    work[j] += allocation[i][j];
                }
                finish[i] = true;
                found = true;
            }
        }
        if (!found) break;
    }
    
    // 检查是否所有进程都能完成
    for (boolean f : finish) {
        if (!f) return false;
    }
    return true;
}
```

## 文件管理

### 文件描述符

```
0 - stdin   标准输入
1 - stdout  标准输出
2 - stderr  标准错误
3+ - 其他打开的文件/套接字
```

### Linux 文件权限

```
-rwxr-xr--  1 user group  4096 Mar 9 10:00 file.txt
│││││││││
││││││││└── 其他人读
│││││││└─── 其他人执行
││││││└──── 组写
│││││└───── 组读
││││└────── 组执行
│││└─────── 所有者写
││└──────── 所有者读
│└───────── 所有者执行
└────────── 文件类型 (- 文件，d 目录，l 链接)
```

## 系统调用

### 常见系统调用

| 类别 | 系统调用 |
|------|----------|
| 进程控制 | fork(), exec(), exit(), wait() |
| 文件操作 | open(), read(), write(), close() |
| 内存管理 | brk(), mmap(), munmap() |
| 网络通信 | socket(), bind(), listen(), accept() |

### Java 中的系统调用

```java
// JVM 通过 JNI 调用系统调用
FileInputStream 底层调用 read() 系统调用
FileOutputStream 底层调用 write() 系统调用
ServerSocket 底层调用 socket(), bind(), listen()
```

## 性能监控

### Linux 命令

```bash
# 进程信息
top              # 实时进程监控
ps aux           # 进程快照
pstree           # 进程树

# 内存信息
free -h          # 内存使用
vmstat 1         # 虚拟内存统计

# I/O 信息
iostat -x 1      # I/O 统计
iotop            # I/O 进程监控

# 网络信息
netstat -tlnp    # 网络连接
ss -tlnp         # 更快的 netstat
```

### Java 监控

```java
// 获取运行时信息
Runtime runtime = Runtime.getRuntime();
System.out.println("可用处理器：" + runtime.availableProcessors());
System.out.println("空闲内存：" + runtime.freeMemory());
System.out.println("最大内存：" + runtime.maxMemory());
System.out.println("总内存：" + runtime.totalMemory());

// 获取线程信息
ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
System.out.println("活动线程数：" + threadBean.getThreadCount());
```

## 面试高频题

### 1. 进程间通信方式

```
1. 管道（Pipe）- 匿名管道、命名管道
2. 消息队列（Message Queue）
3. 共享内存（Shared Memory）- 最快
4. 信号量（Semaphore）
5. 信号（Signal）
6. 套接字（Socket）
```

### 2. 线程同步方式

```java
// 1. synchronized
synchronized (lock) {
    // 临界区
}

// 2. ReentrantLock
Lock lock = new ReentrantLock();
lock.lock();
try {
    // 临界区
} finally {
    lock.unlock();
}

// 3. volatile
volatile boolean flag = false;

// 4. CountDownLatch
CountDownLatch latch = new CountDownLatch(3);
latch.countDown();
latch.await();

// 5. CyclicBarrier
CyclicBarrier barrier = new CyclicBarrier(3);
barrier.await();

// 6. Semaphore
Semaphore semaphore = new Semaphore(3);
semaphore.acquire();
semaphore.release();
```

### 3. 用户态 vs 内核态

```
用户态：运行用户程序，权限受限
  │
  │ 系统调用/异常/中断
  ▼
内核态：运行内核代码，可访问所有资源
  │
  │ 返回
  ▼
用户态
```

**性能影响**：每次上下文切换约 1000ns

## 总结

| 知识点 | 重要程度 | 面试频率 |
|--------|----------|----------|
| 进程 vs 线程 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 死锁 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 内存管理 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 进程调度 | ⭐⭐⭐ | ⭐⭐⭐ |
| 文件管理 | ⭐⭐⭐ | ⭐⭐ |

## 下一步

- [ ] 深入学习 Linux 内核
- [ ] 实践操作系统实验
- [ ] 阅读《深入理解计算机系统》
