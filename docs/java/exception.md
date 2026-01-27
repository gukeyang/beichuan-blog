# 4. 异常处理

Java 异常处理机制可以让程序在发生错误时，按照预定的方式处理，而不是直接崩溃。

## 1. 异常体系

所有异常的父类是 `java.lang.Throwable`。

- **Error**: 严重错误，如 OOM (OutOfMemoryError)，程序无法处理。
- **Exception**: 程序可以处理的异常。
    - **Checked Exception**: 受检异常，编译时必须处理 (IOException)。
    - **Unchecked Exception**: 非受检异常，运行时异常 (NullPointerException)。

## 2. try-catch-finally

```java
try {
    // 可能抛出异常的代码
} catch (Exception e) {
    // 异常处理逻辑
} finally {
    // 无论是否发生异常都会执行
}
```

## 3. throw vs throws

- `throw`: 手动抛出一个异常对象。
- `throws`: 声明方法可能抛出的异常。
