---
title: 并发编程
tags: 并发
categories: 面试题
abbrlink: 498cfd8e
date: 2025-10-23 23:51:36
---





## 什么是线程？什么是进程？

**进程**是系统资源分配的基本单位，拥有独立的内存空间，不同进程之间可以并发执行，创建新进程需要分类独立的内存空间和系统资源，成本高。一个进程的崩溃不会影响其他进程

**线程**是进程中的一个执行单元，是cpu调度的基本单位，共享所属进程的资源，只拥有自己的栈和寄存器；同一个进程内可以有多个线程并发执行，创建新线程成本低。一个线程崩溃可能导致整个进程崩溃。

## Java创建线程有哪几种方式

### 继承自`Thread`类

1. 定义类继承Thread类。
2. 重写run()方法，定义线程执行体。
3. 创建子类对象并调用start()方法启动线程。

```java
class MyThread extends Thread {
    public void run() {
        // 线程执行的逻辑
        System.out.println("MyThread is running...");
    }
}

// 创建并启动线程
MyThread myThread = new MyThread();
myThread.start();

```

### 实现`Runnable`接口

1. 定义类实现Runnable接口。
2. 实现run()方法。
3. 创建实现类对象，将其作为参数传递给Thread构造器，再调用start()方法。

```java
class MyRunnable implements Runnable {
    public void run() {
        // 线程执行的逻辑
        System.out.println("MyRunnable is running...");
    }
}

// 创建并启动线程
Thread myThread = new Thread(new MyRunnable());
myThread.start();

```

### **实现 Callable 接口（带返回值）**

1. 定义类实现Callable接口，指定返回值类型。
2. 实现call()方法，定义线程执行体并返回结果。
3. 通过FutureTask包装Callable实例，再将FutureTask传递给Thread。
4. 调用start()启动线程，通过FutureTask.get()获取返回值。

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

// 1. 实现 Callable 接口，指定返回值类型为 Integer
class MyCallable implements Callable<Integer> {
    private int taskNum;

    public MyCallable(int num) {
        this.taskNum = num;
    }

    // 2. 重写 call() 方法，定义任务逻辑并返回结果
    @Override
    public Integer call() throws Exception {
        System.out.println("任务 " + taskNum + " 开始执行");
        // 模拟任务执行（如计算）
        int result = 0;
        for (int i = 0; i <= taskNum; i++) {
            result += i;
        }
        Thread.sleep(1000); // 模拟耗时操作
        System.out.println("任务 " + taskNum + " 执行完毕，结果为：" + result);
        return result; // 返回计算结果
    }
}

public class CallableDemo {
    public static void main(String[] args) {
        // 3. 创建 Callable 实例
        MyCallable callable1 = new MyCallable(100);
        MyCallable callable2 = new MyCallable(200);

        // 4. 用 FutureTask 包装 Callable（FutureTask 用于接收结果）
        FutureTask<Integer> futureTask1 = new FutureTask<>(callable1);
        FutureTask<Integer> futureTask2 = new FutureTask<>(callable2);

        // 5. 启动线程（FutureTask 实现了 Runnable，可作为 Thread 的参数）
        new Thread(futureTask1).start();
        new Thread(futureTask2).start();

        try {
            // 6. 获取结果（get() 方法会阻塞，直到任务完成）
            int result1 = futureTask1.get();
            int result2 = futureTask2.get();
            System.out.println("总结果：" + (result1 + result2));
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
    }
}
```

### ** 通过线程池进行创建**

使用 Executors 工厂类创建线程池（简单快捷）

​	`newFixedThreadPool(n)`：固定大小线程池

​	`newCachedThreadPool()`：可缓存线程池

​    `newSingleThreadExecutor()`：单线程化线程池

使用 ThreadPoolExecutor 自定义线程池（推荐方式）

使用 ScheduledThreadPoolExecutor 创建定时任务线程池

## **什么是线程池？为什么要使用线程池？**

线程池是采用池化思想管理线程的工具，就像一个容器，里面存放着一定数量的线程。它基于 JUC 包中的 ThreadPoolExecutor 类及其体系实现。使用线程池有诸多好处，比如降低资源消耗，通过重用已存在的线程，减少线程创建和销毁的开销

## **ThreadPoolExecutor 都有哪些核心参数？**

ThreadPoolExecutor 有 7 个核心参数，分别是核心线程数（corePoolSize）、最大线程数（maximumPoolSize）、空闲线程超时时间	（keepAliveTime）、时间单位（unit）、阻塞队列（workQueue）、拒绝策略（handler）、线程工厂（ThreadFactory）。

- 常见队列类型：

  - `ArrayBlockingQueue`：有界数组队列（需指定容量，如 `new ArrayBlockingQueue<>(100)`），防止内存溢出（推荐）。

  适用于需要严格控制任务数量，防止资源过度消耗的场景

  - `LinkedBlockingQueue`：无界链表队列（默认容量 `Integer.MAX_VALUE`，可能因任务过多导致 OOM，谨慎使用）。

  当任务产生的速度相对较慢，或者系统资源足够充足，能够处理大量任务时，可以使用无界队列。它可以保证任务不会因为队列满而被拒绝，但需要注意可能会导致内存占用过高的问题

  - `SynchronousQueue`：同步队列（不存储任务，直接传递给线程，适合 `newCachedThreadPool` 场景）。
  - `PriorityBlockingQueue`：优先级队列（按任务优先级排序执行）。

- JDK 内置 4 种拒绝策略：
  - `AbortPolicy`（默认）：直接抛出 `RejectedExecutionException`，中断任务提交。
  - `CallerRunsPolicy`：让提交任务的线程自己执行该任务（减缓提交速度，适用于并发不高的场景）。
  - `DiscardPolicy`：默默丢弃新任务，不抛出异常（可能丢失任务，需谨慎）。
  - `DiscardOldestPolicy`：丢弃队列中最旧的任务，然后尝试提交新任务（可能丢失旧任务）。
- **自定义策略**：实现 `RejectedExecutionHandler` 接口，如记录日志、持久化任务到数据库后续重试

## **线程池的运行原理是什么？**

线程池刚创建时没有线程。当调用 execute () 方法添加任务时，会进行如下判断：

如果正在运行的线程数量小于 corePoolSize，马上创建线程运行这个任务；如果正在运行的线程数量大于或等于 corePoolSize，将任务放入队列；

如果队列满了，且正在运行的线程数量小于 maximumPoolSize，创建非核心线程立刻运行这个任务；

如果队列满了，且正在运行的线程数量大于或等于 maximumPoolSize，线程池会拒绝这个任务，调用 RejectedExecutionHandler 来处理。

当一个线程完成任务时，会从阻塞队列尝试获取下一个任务执行，若未获取到则进入阻塞状态。当一个线程超过 keepAliveTime 没有获取到任务，且当前运行的线程数大于 corePoolSize，这个线程会被停掉退出。

## 如何优雅地关闭线程池？

**shutdown()**

- 拒绝新任务。
- 执行完队列中已有任务后再关闭。
- 是优雅关闭的第一步。

**awaitTermination(timeout)**

- 阻塞当前线程，等待线程池在指定时间内完成所有任务。
- 返回 `true` 表示全部任务执行完。
- 返回 `false` 表示超时。

**shutdownNow()**

- 如果等待超时，还没结束，则强制关闭。
- 同时发送中断信号给正在执行的任务。
- 返回未执行的任务列表。

**Thread.interrupt()**

- 捕获中断后要恢复中断状态（`Thread.currentThread().interrupt()`），防止异常吞掉中断标记。

## 线程的生命周期？

- 新建状态（New）：当线程对象对创建后，即进入了新建状态，如：Thread t = new MyThread()；

- 就绪状态（Runnable）：当调用线程对象的start()方法（t.start();），线程即进入就绪状态。处于就绪状态的线程，只是说明此线程已经做好了准备，随时等待CPU调度执行，并不是说执行了t.start()此线程立即就会执行；

- 运行状态（Running）：当CPU开始调度处于就绪状态的线程时，此时线程才得以真正执行，即进入到运行状态。就绪状态是进入到运行状态的唯一入口，也就是说，线程要想进入运行状态执行，首先必须处于就绪状态中；

- 阻塞状态（Blocked）：处于运行状态中的线程由于某种原因，暂时放弃对CPU的使用权，停止执行，此时进入阻塞状态，直到其进入到就绪状态，才 有机会再次被CPU调用以进入到运行状态。

- 死亡状态（Dead）：线程执行完了或者因异常退出了run()方法，该线程结束生命周期

## **线程的常用方法**

**start()**启动线程，使线程进入就绪状态（等待 CPU 调度）。

**run()**线程的执行体，包含线程要执行的任务代码。

**sleep(long millis)**让当前线程暂停执行指定时间（毫秒），进入**TIMED_WAITING**状态。

**join()** **/** **join(long millis)**等待当前线程执行完毕，或等待指定时间后继续执行。

**yield()**提示线程调度器当前线程愿意让出 CPU 时间片，进入**RUNNABLE**状态。

## yield和join的区别

`yield()` 和 `join()` 是 Thread 类中用于线程调度的两个重要方法，但它们的作用、场景和底层逻辑有显著区别，核心差异如下：

### **1. 作用不同**

- **`yield()`**：让当前线程**主动让出 CPU 资源**，从 “运行状态” 回到 “就绪状态”，给其他**优先级相同或更高**的线程提供执行机会。这是一种 “建议性” 的操作，CPU 可能忽略该请求（当前线程仍可能继续执行）。
- **`join()`**：让**当前线程阻塞等待**目标线程执行完毕后，再继续执行。例如：主线程调用 `t.join()` 后，会暂停执行，直到线程 `t` 执行结束，主线程才恢复运行。

### **2. 阻塞行为不同**

- **`yield()`**：不会阻塞线程，只是短暂放弃 CPU，线程状态从 “运行” 转为 “就绪”，立即参与下一次 CPU 调度竞争。
- **`join()`**：会阻塞**当前线程**（调用 `join()` 的线程），直到目标线程执行完毕或超时。阻塞期间，当前线程不参与 CPU 调度。

### **3. 对锁的影响不同**

- **`yield()`**：不会释放当前线程持有的锁（如 `synchronized` 锁），只是让出 CPU 执行权，锁仍被当前线程持有。
- **`join()`**：底层通过 `wait()` 实现，会释放当前线程持有的锁（如果有的话）。阻塞期间，其他线程可以获取该锁。

### **4. 使用场景不同**

- **`yield()`**：适用于**避免线程长时间独占 CPU**的场景，例如在循环中偶尔让出资源，让其他线程有机会执行。示例：一个低优先级线程在执行非紧急任务时，定期调用 `yield()` 给高优先级线程机会。
- **`join()`**：适用于**线程间协作，需要等待其他线程完成后再执行**的场景，例如主线程等待所有子线程计算完毕后汇总结果。

## wait和sleep的区别

`wait()` 和 `sleep()` 是 Java 中用于暂停线程执行的两个常用方法，但它们的设计目的、使用场景和底层机制有本质区别，核心差异如下：

### **1. 所属类不同**

- **`wait()`**：属于 `Object` 类（所有对象都有此方法），是线程间协作的核心方法。
- **`sleep(long millis)`**：属于 `Thread` 类，是线程自身的休眠方法。

### **2. 对锁的处理不同（最核心区别）**

- **`wait()`**：**会释放当前线程持有的对象锁**。调用 `wait()` 时，线程必须先持有该对象的锁（在 `synchronized` 同步块 / 方法中），调用后会释放锁并进入该对象的 “等待队列”，其他线程可以获取该锁。
- **`sleep()`**：**不会释放任何锁**。即使线程持有 `synchronized` 锁，`sleep()` 期间锁仍被当前线程持有，其他线程无法获取该锁。

### **3. 使用场景不同**

- **`wait()`**：用于**线程间协作**，等待某个条件满足（如生产者 - 消费者模型中，消费者等待商品生产完成）。必须在 `synchronized` 同步块 / 方法中调用，否则会抛出 `IllegalMonitorStateException`。
- **`sleep()`**：用于**让当前线程暂停执行一段固定时间**（如模拟网络延迟、定时轮询），与线程间协作无关，无需在同步块中调用。

### **4. 唤醒方式不同**

- **`wait()`**：
  - 需通过其他线程调用同一个对象的 `notify()` 或 `notifyAll()` 唤醒（进入就绪状态，重新竞争锁）。
  - 若调用 `wait(long timeout)`，超时后会自动唤醒。
- **`sleep()`**：
  - 时间到后自动唤醒（进入就绪状态）。
  - 可被其他线程调用 `interrupt()` 中断，抛出 `InterruptedException`。

## 线程锁

在并发编程中，**锁（Lock）** 是一种同步机制，用于控制多个执行单元（线程、进程）对共享资源的访问，确保资源在同一时间只能被一个执行单元操作，从而避免数据不一致、冲突或错误（如 “脏读”“丢失更新” 等问题）。

锁的分类本质是为了适应不同的并发场景：

- 单进程内线程同步优先用 **线程锁**（`synchronized`、`ReentrantLock`）；
- 跨进程同步用 **进程锁** 或 **分布式锁**；
- 读多写少用 **共享锁 / 乐观锁**，写操作频繁用 **排他锁 / 悲观锁**；
- 需公平性用 **公平锁**，追求性能用 **非公平锁**。

## 锁的分类

| **锁类型**   | **核心思想**                     | **实现方式**                                   | **适用场景**                         | **优点**                     | **缺点**                          |
| ------------ | -------------------------------- | ---------------------------------------------- | ------------------------------------ | ---------------------------- | --------------------------------- |
| **悲观锁**   | 假设冲突一定会发生，先加锁再操作 | - Java:synchronized关键字、ReentrantLock       | 写操作频繁、冲突概率高的场景         | 数据安全性高，避免并发冲突   | 性能开销大，可能导致线程阻塞      |
| **乐观锁**   | 假设冲突很少发生，更新时检查版本 | 通过版本号（Version）或时间戳（Timestamp）实现 | 读操作频繁、冲突概率低的场景         | 无需加锁，并发性能高         | 可能需要重试，不适合高冲突场景    |
| **公平锁**   | 按请求顺序分配锁（先到先得）     | - Java:ReentrantLock(true)                     | 需要保证线程公平性、避免饥饿的场景   | 避免线程饥饿，执行顺序可预测 | 维护队列开销大，上下文切换频繁    |
| **非公平锁** | 不按请求顺序分配锁，当前线程优先 | - Java:ReentrantLock()（默认）                 | 追求高吞吐量、允许线程饥饿的场景     | 减少上下文切换，性能更高     | 可能导致部分线程长时间无法获取锁  |
| **可重入锁** | 允许同一线程多次获取同一把锁     | - Java:ReentrantLock                           | 递归调用或嵌套锁的场景               | 避免死锁，简化代码逻辑       | 需注意锁的释放顺序                |
| **读写锁**   | 读锁共享、写锁独占               | - Java:ReentrantReadWriteLock                  | 读多写少的场景                       | 提高读操作并发度             | 写操作可能长时间等待              |
| **自旋锁**   | 获取锁失败时循环等待而非阻塞     | - Java: 通过AtomicBoolean                      | 锁持有时间短、线程不希望被阻塞的场景 | 减少线程上下文切换           | 消耗 CPU 资源，不适用于长耗时操作 |

## 你知道Java中有哪些锁吗？

**synchronized**（关键字，JVM实现）
特性：可重入、自动释放、非公平锁
优势：代码简洁，低竞争时性能优异
**ReentrantLock**（类，JUC包，基于AQS）
特性：可重入、手动释放（finally中unclock()）、提供限时等待、支持公平\非公平锁
优势：高竞争场景（非公平模式）性能略优（减少线程切换）
**ReadWriteLock**（如ReentrantReadWriteLock）
特性：读锁共享，写锁互斥
优势：读操作并发高，写操作互斥保持数据一致性
**StampedLock**（JDK8+，优化读写锁）
特性：支持乐观读（无锁读取，验证版本号，冲突时降级为读锁），三种模式（读、写、乐观读）
优势：乐观读的性能远远优于读写锁（无锁竞争），适合用于极低写频率场景（如统计系统）

## Synchronized 用过吗，其原理是什么

`synchronized` 是 Java 中最基础也最常用的线程同步机制，用于保证多线程环境下临界区代码的原子性、可见性和有序性。`synchronized` 可作用于**方法**或**代码块**，核心是通过 “锁对象” 实现线程互斥：

**互斥性**：Synchronized 保证同一时刻只有一个线程可以获取锁，并且只有该线程可以执行同步代码块中的代码。

**可重入性**：同一个线程可以多次获取同步锁而不会被阻塞，这样可以避免死锁的发生。

**独占性**： 如果一个线程获得了对象的锁，则其他线程必须等待该线程释放锁之后才能获取锁。

核心原理：

`synchronized` 的底层实现依赖 **JVM 的锁机制** 和 **对象头（Object Header）** 中的标记位，其核心逻辑是 “通过锁对象控制线程对临界区的访问”。

#### 1. **锁的载体：对象头（Object Header）**

Java 中每个对象都有一个 “对象头”，用于存储对象的元数据（如哈希码、GC 年龄、锁状态等）。` synchronized` 的锁状态就记录在对象头的 **Mark Word** 中（32 位 JVM 中占 32bit，64 位占 64bit）。

#### 2. **锁的升级：从无锁到重量级锁**

为了减少锁的开销，JVM 对 `synchronized` 进行了**分层优化**，锁会根据竞争程度从 “低开销” 向 “高开销” 动态升级（不可逆）：

- **第一步：无锁状态**对象刚创建时，Mark Word 存储哈希码等信息，无锁竞争。
- **第二步：偏向锁（Biased Locking）**当只有一个线程多次获取锁时，锁会 “偏向” 这个线程：
  - 首次获取锁时，通过 CAS 操作将线程 ID 写入对象头的 Mark Word，设置 “偏向锁标志” 为 1。
  - 后续该线程再次进入同步块时，无需竞争，直接通过线程 ID 匹配确认持有锁（几乎无开销）。
  - **触发升级**：当有其他线程尝试获取锁时，偏向锁会膨胀为轻量级锁。
- **第三步：轻量级锁（Lightweight Locking）**当出现轻度锁竞争（线程交替获取锁，无长时间阻塞）时：
  - 线程获取锁时，会在自己的栈帧中创建 “锁记录（Lock Record）”，存储对象头中 Mark Word 的拷贝（Displaced Mark Word）。
  - 通过 CAS 操作将对象头的 Mark Word 替换为指向栈中锁记录的指针（表示持有轻量级锁）。
  - 若 CAS 成功，获取锁；若失败（说明有竞争），线程会自旋（循环重试）几次，仍失败则升级为重量级锁。
- **第四步：重量级锁（Heavyweight Locking）**当竞争激烈（自旋失败或线程阻塞）时，锁升级为重量级锁：
  - 依赖操作系统的 **互斥量（Mutex）** 实现，线程获取不到锁时会进入内核态阻塞（放弃 CPU），等待锁释放后被唤醒。
  - 开销大（涉及用户态与内核态切换），但适合长时间持有锁或高竞争场景

## **`Lock` 与 `synchronized` 的对比**

| 特性          | `Lock`（如 `ReentrantLock`）               | `synchronized`                        |
| ------------- | ------------------------------------------ | ------------------------------------- |
| 锁获取 / 释放 | 显式调用 `lock()`/`unlock()`（需手动释放） | 隐式（JVM 自动获取 / 释放）           |
| 可重入性      | 支持                                       | 支持                                  |
| 公平性        | 可选择（公平 / 非公平）                    | 仅非公平                              |
| 中断响应      | 支持（`lockInterruptibly()`）              | 不支持（等待时无法被中断）            |
| 超时获取      | 支持（`tryLock(time)`）                    | 不支持                                |
| 条件变量      | 支持多个 `Condition`（精细控制）           | 仅一个等待队列（`wait()`/`notify()`） |
| 性能          | 高并发下性能更稳定                         | 低并发下优化好（偏向锁 / 轻量级锁）   |

## **ReentrantLock****的底层原理**

`ReentrantLock` 是基于 **AQS（AbstractQueuedSynchronizer）** 实现的可重入独占锁，它比 `synchronized` 更灵活、更可控。

`ReentrantLock` 内部通过一个 **Sync** 对象（继承自 AQS）来实现锁的获取与释放：AQS 内部维护一个整数 `state` 表示锁状态：

- `state = 0` 表示未加锁；
- `state > 0` 表示已加锁（持有线程数，也体现“可重入性”）。

加锁流程（lock）

#### 1. CAS 尝试加锁

当线程调用 `lock()` 时：

- 若当前 `state == 0`（无锁），通过 **CAS**（Compare-And-Swap）将其改为 1；
- 若成功，当前线程成为锁的持有者；
- 若失败（锁被占用），进入 **AQS 等待队列**。

#### 2. 可重入性

如果当前线程已经持有锁，则允许再次进入：

#### 3. 入队与阻塞

若其他线程也想获取锁，`tryAcquire()` 失败后会调用 `acquire()`：

- AQS 会创建一个 `Node`（包含线程、状态、前后指针），加入 **CLH 双向队列**；
- 线程会被 `LockSupport.park()` 阻塞，直到前驱节点释放锁。

### 公平锁与非公平锁

- **非公平锁（默认）**：新线程插队尝试直接获取锁，竞争激烈时性能高；
- **公平锁**：线程必须排队，遵循“先到先得”，通过 `hasQueuedPredecessors()` 判断是否排队。

## 解释一下volatile关键字的作用和使用场景。

`volatile` 是 Java 中用于保证变量**可见性**和**禁止指令重排序**的关键字级关键字，主要用于解决多线程环境下共享变量的同步问题，但它**不保证原子性**。

### **一、volatile 的核心作用**

#### 1. 保证可见性

当一个变量被 `volatile` 修饰时，它会确保：

- 线程对该变量的**修改会立即刷新到主内存**（而非仅停留在线程的工作内存）。
- 其他线程读取该变量时，会**直接从主内存加载最新值**（而非使用工作内存中的缓存副本）。

**没有 volatile 的问题**：多线程环境中，线程会将共享变量从主内存加载到自己的工作内存（CPU 缓存）中操作，若变量未被 `volatile` 修饰，一个线程的修改可能不会及时同步到主内存，导致其他线程读取到旧值（“不可见”）。

#### 2. 禁止指令重排序

编译器或 CPU 为了优化性能，可能会对**没有数据依赖**的指令进行重排序（调整执行顺序）。`volatile` 会通过**内存屏障**（Memory Barrier）禁止这种重排序，保证指令执行顺序与代码逻辑一致。

**没有 volatile 的风险**：在初始化单例对象等场景中，指令重排序可能导致其他线程获取到 “未完全初始化” 的对象。

### `volatile` 的实现原理是什么？

底层实现靠的是 **JVM 在读写 volatile 变量时插入内存屏障指令**。
 不同 CPU 架构实现不同，但通用原理一致：

- **写屏障（Store Barrier）**：强制将工作内存中变量刷新到主内存。
- **读屏障（Load Barrier）**：强制从主内存中重新读取最新值。

`volatile` 通过在读写操作前后插入内存屏障（Memory Barrier）， 确保变量的可见性和有序性，底层依赖 CPU 的缓存一致性协议（MESI）。 但它不保证复合操作的原子性，因此只能用于状态标志或单次读写场景。

## **volatile 与 synchronized 的区别**

| 特性     | volatile                 | synchronized               |
| -------- | ------------------------ | -------------------------- |
| 作用     | 保证可见性、禁止重排序   | 保证原子性、可见性、有序性 |
| 原子性   | 不保证（复合操作不安全） | 保证（临界区代码原子执行） |
| 开销     | 轻量（无锁竞争）         | 可能较重（锁升级机制优化） |
| 适用场景 | 状态标记、简单变量读写   | 复杂逻辑、复合操作         |

## ReentrantLock的底层原理

ReentrantLock是 Java 里用于实现线程同步的一个类，它出自java.util.concurrent.locks包，提供了比synchronized关键字更丰富的锁操作。其底层原理主要基于 AQS（Abstract Queued Synchronizer）框架：

**1. AQS** **框架概述**

AQS 是一个用于构建锁和同步器的框架，很多同步类的实现都依赖于它，像ReentrantLock、CountDownLatch等。AQS 内部维护了一个volatile int state变量，用于表示同步状态，还维护了一个FIFO（先进先出）的线程等待队列。

**2.** ReentrantLock**的结构**

ReentrantLock内部有一个静态抽象类Sync，它继承自AbstractQueuedSynchronizer，并且有两个具体的实现类：NonfairSync（非公平锁）和FairSync（公平锁）。

**3.** **非公平锁（**NonfairSync**）的加锁原理**

**尝试直接获取锁**：当线程调用lock()方法时，ReentrantLock会先尝试直接将state状态从 0 变为1，如果成功，就表示获取到了锁，当前线程成为锁的持有者。

**进入** **AQS** **队列**：若尝试失败，线程会进入 AQS 的等待队列。

**重入情况**：如果当前线程已经是锁的持有者，再次获取锁时，state的值会加 1，这体现了锁的可重入性。

**4.** **公平锁（**FairSync**）的加锁原理**

**检查队列**：公平锁在获取锁时，会先检查 AQS 队列中是否有其他线程在等待，如果有，当前线程会进入队列尾部等待。

**尝试获取锁**：若队列中没有其他线程等待，才会尝试将state状态从 0 变为 1。**5.** **解锁原理**

**释放锁**：当线程调用unlock()方法时，会将state的值减 1。

**完全释放**：若state的值减为 0，就表示锁被完全释放，此时会唤醒 AQS 队列中等待的线程。

## **多线程如何获取异步执行结果**

#### （1）`Future` + `Callable`（最常用）

- `Callable` 是带返回值的线程任务接口，与 `Runnable` 不同，它的 `call()` 方法可以返回结果。
- `Future` 是一个 “未来结果” 的容器，用于存储 `Callable` 的执行结果，支持阻塞等待结果、超时等待等。

#### （2）`CompletableFuture`（Java 8+，非阻塞式）

`CompletableFuture` 支持异步回调，无需主动阻塞等待，更适合复杂的异步流程（如链式调用、多任务组合）。

## **什么是线程死锁？死锁如何产生？**

例如，假设线程 A 持有资源 X，并等待资源 Y，而线程 B持有资源 Y，并等待资源 X，这时候就会出现死锁。

**死锁**

线程死锁是指由于两个或者多个线程互相持有对方所需要的资源，导致这些线程处于等待状态，无法前往执行。

当线程进入对象的synchronized代码块时，便占有了资源，直到它退出该代码块或者调用wait方法，才释放资

源，在此期间，其他线程将不能进入该代码块。当线程互相持有对方所需要的资源时，会互相等待对方

释放资源，如果线程都不主动释放所占有的资源，将产生死锁。

**死锁的产生的一些特定条件**

Java 中，死锁产生的一些特定条件通常包括以下四个方面：

互斥条件：一个资源一次只能被一个线程持有，如果其他线程想要获取该资源，就必须等待该线程释放该资源。

请求保持：一个线程请求资源时，如果已经持有了其他资源，就可以保持对这些资源的控制，直到满足所有资源的要求才释放。

不剥夺条件：已经分配的资源不能被其他线程剥夺，只能由持有资源的线程释放。

循环等待条件：多个线程形成一种循环等待的关系，每个线程都在等待其他线程所持有的资源，从而导致死锁的产生。

当以上条件同时满足时，就可能会出现死锁的情况。为了避免死锁，需要在设计时遵循一定的规范和原则，例如尽量避免嵌套锁，确保同步代码块执行时间尽可能短等，同时也可以使用专门的工具进行死锁检测和分析，帮助我们找到死锁的根本原因并进行相应的优化和调整。

**如何避免死锁**

要避免线程死锁，可以采取以下几种方法：

尽量避免使用多个锁，尽量使用一个锁或者使用更加高级的锁，例如读写锁或者 ReentrantLock。

确保同步代码块的执行时间尽可能短，这样可以减少线程等待时间，从而避免死锁的产生。

使用更高级的锁，通过 ReentrantLock.tryLock() 方法可以尝试获取锁，如果在规定时间内获取不到锁，则放弃锁。

避免嵌套锁，如果需要使用多个锁，请确保它们的获取顺序是一致的，这样可以避免死锁。

## ThreadLocal 原理？底层如何防止内存泄漏？

ThreadLocal 为每个线程维护一个独立的变量副本，底层通过 `Thread` 持有的 `ThreadLocalMap` 存储，
 其中 `key` 是对 ThreadLocal 的弱引用（防止对象无法回收），`value` 是强引用。
 为避免 key 被回收后 value 残留导致内存泄漏，JVM 在 `get/set/remove` 时会清理 key=null 的条目，
 但开发者仍应在使用后手动调用 `remove()` 释放资源。

ThreadLocal 为每个线程提供一个**独立的变量副本**，让变量在多线程间互不干扰。

每个线程都持有自己独立的 `ThreadLocalMap`。key：`ThreadLocal`（**弱引用 WeakReference**）。value：实际存放的对象（**强引用**）

ThreadLocalMap 的 key 是弱引用，value 是强引用。
 当外部没有引用 ThreadLocal 对象时，key 会被 GC 回收，key=null，但 value 还强引用着对象。

如果当前线程是**线程池中的线程**（不会销毁），
 这些 `value` 就会永远被挂在 `ThreadLocalMap` 里，导致 **内存泄漏（Memory Leak）**。



## 什么是线程安全？怎么保证线程安全？

当多个线程**同时访问同一份共享数据**时，无论执行时序如何交替，**程序的执行结果都是一致且符合预期的**，那么我们说这个代码是线程安全的。

线程不安全的根源：三大问题

1. **原子性（Atomicity）缺失**
    操作不是一个不可分割的整体，比如 `i++` 实际是三步（读、加、写）。
2. **可见性（Visibility）问题**
    线程对变量的修改，其他线程看不到（因为 CPU 缓存、JMM 工作内存）。
3. **有序性（Ordering）问题**
    指令重排（reordering）让程序执行顺序与预期不一致。

### 如何保证线程安全（从思想到实现）

#### **不共享（线程封闭 Thread Confinement）**

最简单的线程安全：不让数据共享。

- **局部变量**（每个线程栈独有）
- **ThreadLocal**（线程隔离）

#### **不可变（Immutable）对象**

如果对象不可变（immutable），线程之间共享也没问题。

典型例子：

- `String`
- `Integer`
- `BigDecimal`

因为不可变对象状态不会改变，所以天然线程安全。

#### 互斥锁（Synchronized / Lock）

让多个线程“排队”访问共享资源。

这类机制确保：

- 同一时刻只有一个线程执行临界区；
- 写操作对其他线程可见；
- 保证原子性和有序性。

#### 原子类（CAS + volatile 实现无锁并发）

使用 **CAS（Compare And Swap）** 实现原子更新，不用加锁。CAS 底层依赖 CPU 指令（如 x86 的 `LOCK CMPXCHG`），保证操作不可中断。

“线程安全是指多个线程同时访问共享变量时，能保证数据一致性和程序的预期行为。
 它主要涉及原子性、可见性、有序性三大问题。
 保障方式有多种：
 1）通过线程封闭或不可变对象避免共享；
 2）通过 synchronized / Lock 实现互斥访问；
 3）通过 CAS 实现无锁原子操作；
 4）通过并发容器封装线程安全逻辑。
 实际项目中会根据场景权衡性能与安全。”

## 什么是“可见性”、“原子性”、“有序性”？

### 可见性（Visibility）

**定义：**
 当一个线程修改了共享变量的值，其他线程能够**立即看到这个修改**。

**问题来源：**
 Java 中每个线程都有一个**工作内存（线程本地缓存）**，它会从主内存中拷贝变量的值到本地进行计算。
 修改后，不一定马上写回主内存。
 所以另一个线程可能还在读旧值。

**解决：**

- 使用 `volatile` 保证可见性；
- 使用 `synchronized`、`Lock`（它们隐含内存屏障）；
- 使用 `final`（构造完成后值不会再变）。

### 原子性（Atomicity）

**定义：**
 一个操作或一组操作要么全部执行完毕，要么全部不执行，不会出现中间状态。

**问题来源：**
 很多看似简单的操作其实**不是原子的**。

**解决：**

- 使用 **synchronized** 或 **Lock**，让操作互斥；
- 使用 **原子类**（`AtomicInteger`、`AtomicReference`），底层用 CAS（Compare-And-Swap） 实现；
- 使用 **不可变对象（Immutable Object）**。

### 有序性（Ordering）

**定义：**
 程序的执行顺序与代码顺序一致。

**问题来源：**
 编译器和 CPU 会对指令进行 **重排序（Instruction Reordering）**，以提高性能。
 重排序对单线程无影响，但多线程下可能出事。

**解决：**

- 使用 `volatile`（禁止重排序）；
- 使用 `synchronized` 或 `Lock`；
- 使用 `happens-before` 原则保证执行顺序。

## AQS

AQS，全称是 **AbstractQueuedSynchronizer（抽象队列同步器）**，是 **Java 并发包（`java.util.concurrent.locks`）的核心基础类**。
 几乎所有常用的并发同步工具类（如 `ReentrantLock`、`CountDownLatch`、`Semaphore`、`ReentrantReadWriteLock`、`CyclicBarrier`）的底层实现都依赖于它。

AQS 通过一个「状态值（state）」 + 「FIFO 双向队列」来管理线程的竞争与阻塞。

简单来说：

- **state** 表示资源状态（比如锁是否被占用、剩余许可数等）。
- **CAS（Compare And Swap）** 用来原子修改 state。
- **CLH 队列（FIFO）** 维护等待的线程队列。

AQS 把“**同步器的共性**”抽象出来，让开发者只需要实现它的几个钩子方法，就能轻松构建各种并发控制器。

### AQS 的两种模式

AQS 支持两种同步模式：

1. **独占模式（Exclusive）**
   - 同一时间只有一个线程能持有资源。
   - 典型代表：`ReentrantLock`
2. **共享模式（Shared）**
   - 允许多个线程同时获取资源。
   - 典型代表：`Semaphore`、`CountDownLatch`、`ReentrantReadWriteLock.ReadLock`

## CAS

CAS 是一种 **无锁（Lock-Free）并发原语**，用于在多线程环境下实现原子操作。

当且仅当内存中的值等于预期值时，才把它更新为新值，否则不做任何修改。

### CAS 的优点

1. **无锁高性能**
    不阻塞线程，适合高并发下的原子更新。
2. **避免上下文切换开销**
    不像 synchronized 那样需要内核态的锁管理。
3. **原子性由硬件保证**
    无需锁机制就能确保线程安全。

### CAS 的问题（面试高频）

#### 1. ABA 问题

举个例子：

- 线程 T1 读取值 A；
- 线程 T2 把 A 改成 B，又改回 A；
- T1 再比较时发现值还是 A，于是以为没人改过，但实际上它被改过。

解决方案：

- 使用 **版本号机制**，比如 `AtomicStampedReference`，记录值的版本：每次修改不仅改值，还更新版本号。

#### 2. 自旋开销大

当竞争激烈时，线程会一直自旋重试，导致 CPU 占用高。

优化：

- Java 内部有 **自适应自旋锁**，如果线程竞争不频繁，则短暂自旋；
- 否则直接挂起线程，避免浪费。

#### 3. 只能保证单个变量的原子性

CAS 只能保证一个内存地址的更新是原子的。
 如果要同时修改多个变量，就得用更高层的机制，比如 `AtomicReference` 封装对象，或使用锁。
