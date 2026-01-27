# 3. 集合框架

Java 集合框架 (Java Collections Framework) 提供了一套性能优良、使用方便的接口和类，位于 `java.util` 包中。

## 1. 集合体系结构

- **Collection** 接口
    - **List**: 有序、可重复 (ArrayList, LinkedList)
    - **Set**: 无序、不可重复 (HashSet, TreeSet)
    - **Queue**: 队列 (PriorityQueue)
- **Map** 接口
    - 键值对映射 (HashMap, TreeMap, ConcurrentHashMap)

## 2. List 详解

### ArrayList
基于动态数组实现，支持随机访问。

### LinkedList
基于双向链表实现，适合频繁插入删除。

## 3. Map 详解

### HashMap
基于哈希表实现，非线程安全。

### ConcurrentHashMap
线程安全的哈希表，使用 CAS + synchronized 实现。
