# Java 并发编程核心概念

并发编程是 Java 开发中的重点和难点，也是面试中的高频考点。

## 一、线程基础

### 创建线程的四种方式

```java
// 方式 1：继承 Thread 类
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Thread running");
    }
}

// 方式 2：实现 Runnable 接口
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("Runnable running");
    }
}

// 方式 3：实现 Callable 接口（有返回值）
class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        return "Callable result";
    }
}

// 方式 4：线程池（推荐）
ExecutorService executor = Executors.newFixedThreadPool(10);
executor.submit(() -> System.out.println("Thread pool task"));
```

### 线程状态转换

```
NEW → RUNNABLE ↔ BLOCKED/WAITING/TIMED_WAITING → TERMINATED
```

## 二、线程安全三要素

### 原子性（Atomicity）
一个或多个操作要么全部执行成功，要么全部不执行。

```java
// ❌ 非原子操作
private int i = 0;
i++; // 线程不安全

// ✅ 使用 AtomicInteger
private AtomicInteger atomicI = new AtomicInteger(0);
atomicI.incrementAndGet(); // 线程安全
```

### 可见性（Visibility）
一个线程修改了共享变量的值，其他线程能够立即看到。

```java
// ✅ 使用 volatile 保证可见性
private volatile boolean flag = false;
```

### 有序性（Ordering）
程序执行的顺序按照代码的先后顺序执行，volatile 可禁止指令重排序。

## 三、volatile 关键字

**作用：**
1. 保证可见性 - 修改后立即刷新到主内存
2. 禁止指令重排序 - 通过内存屏障实现

**使用场景：**
```java
// 状态标记
private volatile boolean isRunning = true;

// 单例模式的双重检查锁
private static volatile Singleton instance;
```

## 四、synchronized 锁机制

### 基本用法

```java
// 修饰实例方法 - 锁当前对象
public synchronized void method1() {}

// 修饰静态方法 - 锁 Class 对象
public static synchronized void method2() {}

// 修饰代码块 - 锁指定对象
public void method3() {
    synchronized (this) {
        // 临界区
    }
}
```

### 锁升级过程

```
无锁 → 偏向锁 → 轻量级锁 → 重量级锁
```

## 五、线程池（ThreadPoolExecutor）

### 核心参数

```java
new ThreadPoolExecutor(
    int corePoolSize,      // 核心线程数
    int maximumPoolSize,   // 最大线程数
    long keepAliveTime,    // 空闲线程存活时间
    TimeUnit unit,         // 时间单位
    BlockingQueue<Runnable> workQueue, // 工作队列
    ThreadFactory threadFactory,       // 线程工厂
    RejectedExecutionHandler handler   // 拒绝策略
)
```

### 工作流程

```
1. 任务提交 → 核心线程是否已满？
2. 否 → 创建新线程执行
3. 是 → 放入工作队列
4. 队列满 → 创建非核心线程
5. 达到最大线程数 → 执行拒绝策略
```

### 推荐使用方式

```java
// ✅ 推荐：使用 ThreadPoolExecutor 显式创建
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    5,  // 核心线程数
    10, // 最大线程数
    60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100),
    new ThreadPoolExecutor.CallerRunsPolicy()
);

// ❌ 不推荐：Executors 创建（可能导致 OOM）
ExecutorService executor = Executors.newFixedThreadPool(10);
```

## 六、面试高频题

### Q1: HashMap 在并发下有什么问题？

**A:** JDK1.7 中扩容时可能导致死循环（环形链表），JDK1.8 虽然解决了死循环，但仍然存在数据覆盖的问题。使用 `ConcurrentHashMap`。

### Q2: ThreadLocal 的原理和内存泄漏问题？

**A:** ThreadLocal 通过 ThreadLocalMap 为每个线程存储独立的变量副本。Key 是弱引用，Value 是强引用，如果线程复用且不及时 remove，会导致 Value 无法回收。使用完后调用 `remove()` 方法。

### Q3: 如何设计一个线程安全的单例？

```java
// 推荐：枚举实现（最有效）
public enum Singleton {
    INSTANCE;
}

// 双重检查锁
public class Singleton {
    private static volatile Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

## 七、最佳实践

1. ✅ 优先使用线程池，避免手动创建线程
2. ✅ 使用并发容器（ConcurrentHashMap 等）
3. ✅ 缩小锁的粒度，减少竞争
4. ✅ 优先使用不可变对象
5. ❌ 避免死锁（按固定顺序获取锁）
