# 5. 多线程与并发

并发编程是 Java 后端开发的核心难点，也是高薪面试的必考题。

## 1. 线程基础

### 线程的创建
1. 继承 Thread 类
2. 实现 Runnable 接口
3. 实现 Callable 接口 (有返回值)

### 线程生命周期
新建 (New) -> 就绪 (Runnable) -> 运行 (Running) -> 阻塞 (Blocked) -> 死亡 (Terminated)

## 2. 线程池

使用线程池可以减少创建和销毁线程的开销。

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize,
    maximumPoolSize,
    keepAliveTime,
    unit,
    workQueue
);
```

## 3. JUC 包

- `ReentrantLock`: 可重入锁
- `CountDownLatch`: 倒计时门闩
- `ConcurrentHashMap`: 线程安全的 Map
