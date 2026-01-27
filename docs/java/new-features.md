# 6. Java 8+ 新特性

Java 8 是 Java 发展史上的一个里程碑版本，引入了 Lambda 表达式、Stream API 等函数式编程特性。

## 1. Lambda 表达式

简化匿名内部类的写法。

```java
// 旧写法
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
}).start();

// Lambda 写法
new Thread(() -> System.out.println("Hello")).start();
```

## 2. Stream API

提供了一套高效处理集合数据的 API。

```java
list.stream()
    .filter(s -> s.startsWith("A"))
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## 3. Optional

用于优雅地解决 NullPointerException 问题。

## 4. 新日期时间 API

`java.time` 包下的 `LocalDate`, `LocalTime`, `LocalDateTime` 等，线程安全且易用。
