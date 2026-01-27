# 2. 面向对象编程 (OOP)

面向对象编程 (Object-Oriented Programming, OOP) 是 Java 的核心思想。

## 1. 三大特性

### 封装 (Encapsulation)
将数据和操作数据的方法进行有机结合，隐藏对象的属性和实现细节，仅对外公开接口来和对象进行交互。

### 继承 (Inheritance)
使用已存在的类的定义作为基础建立新类，新类的定义可以增加新的数据或新的功能，也可以用父类的功能，但不能选择性地继承父类。

### 多态 (Polymorphism)
同一个行为具有多个不同表现形式或形态的能力。

## 2. 类与对象

```java
public class Person {
    private String name;
    private int age;
    
    // 构造方法、Getter/Setter
}
```

## 3. 抽象类与接口

- **抽象类**：包含抽象方法的类，不能实例化。
- **接口**：一种规范，只包含抽象方法（Java 8+ 支持默认方法）。
