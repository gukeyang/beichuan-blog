---
title: 集合框架
tags: 集合
categories: 面试题
date: '2025-10-23 13:50:36'
abbrlink: 7edb9ee1
---

## Java中的集合分类

### **1. Collection 接口**

- **List**：有序、可重复，支持索引访问。

- - **ArrayList**：动态数组，随机访问快，增删慢（非线程安全）。
  - **LinkedList**：双向链表，增删快，随机访问慢。
  - **Vector**：线程安全的动态数组（性能较低，不推荐使用）。

- **Set**：无序、唯一（元素不能重复）。

- - **HashSet**：基于哈希表实现，元素需重写 hashCode() 和 equals()。
  - **LinkedHashSet**：维护插入顺序的哈希表。
  - **TreeSet**：基于红黑树实现，元素需实现 Comparable 接口或提供 Comparator，保证元素有序。

- **Queue**：队列（FIFO）或双端队列（Deque）。

- - **LinkedList**：实现了 Deque 接口，支持双向队列操作。
  - **PriorityQueue**：优先队列，基于堆结构，元素按自然顺序或自定义比较器排序。
  - **ArrayDeque**：动态数组实现的双端队列，性能优于 LinkedList。

### **2. Map 接口**

- **HashMap**：哈希表实现，键值对无序，允许 null 键和 null 值（非线程安全）。
- **LinkedHashMap**：维护插入顺序或访问顺序的哈希表。
- **TreeMap**：基于红黑树，键需实现 Comparable 或提供 Comparator，保证键有序。
- **Hashtable**：线程安全的哈希表（不允许 null 键值，性能较低，不推荐使用）。
- **ConcurrentHashMap**：线程安全的高效哈希表（推荐在多线程环境使用）。

## Java中的线程安全的集合是什么？

在 java.util 包中的线程安全的类主要2个，其他都是非线程安全的。

- Vector:线程安全的动态数组，其内部方法基本都经过synchronized修饰，如果不需要线程安全，并不建议选择，毕竟同步是有额外开销的。Vector 内部是使用对象数组来保存数据，可以根据需要自动的增加容量，当数组已满时，会创建新的数组，并拷贝原有数组数据。
- Hashtable:线程安全的哈希表，HashTable 的加锁方法是给每个方法加上 synchronized 关键字，这样锁住的是整个 Table 对象，不支持 null键和值，由于同步导致的性能开销，所以已经很少被推荐使用,如果要保证线程安全的哈希表，可以用ConcurrentHashMap。

java.util.concurrent 包提供的都是线程安全的集合：

并发map：

- ConcurrentHashMap：它与HashTable的主要区别是二者加锁粒度的不同，在JDK1.7，ConcurrentHashMap加的是分段锁，也就是Segment锁，每个Segment含有整个table的一部分，这样不同分段之间的并发操作就互不影响。在JDK1.8，它取消了Segment字段，直接在table元素上加锁，实现对每一行进行加锁，进一步减小了并发冲突的概率。对于put操作，如果Key对应的数组元素为null，则通过CAS操作（Compare and Swap）将其设置为当前值。如果Key对应的数组元素（也即链表表头或者树的根元素）不为null，则对该元素使用synchronized关键字申请锁，然后进行操作。如果该put操作使得当前链表长度超过一定阈值，则将该链表转换为红黑树，从而提高寻址效率。

- ConcurrentSkipListMap：实现了一个基于SkipList（跳表）算法的可排序的并发集合，SkipList是一种可以在对数预期时间内完成搜索、插入、删除等操作的数据结构，通过维护多个指向其他元素的”跳跃”链接来实现高效查找。

并发Set:

- ConcurrentSkipListSet：是线程安全的有序的集合。底层是使用ConcurrentSkipListMap实现。

- CopyOnWriteArraySet：是线程安全的Set实现，它是线程安全的无序的集合，可以将它理解成线程安全的HashSet。有意思的是，CopyOnWriteArraySet和HashSet虽然都继承于共同的父类AbstractSet;但是，HashSet是通过”散列表”实现的，而CopyOnWriteArraySet则是通过”动态数组(CopyOnWriteArrayList)”实现的，并不是散列表。

并发List:

- CopyOnWriteArrayList:它是ArrayList 的线程安全的变体，其中所有写操作（add，set等）都通过对底层数组进行全新复制来实现，允许存储null元素。即当对象进行写操作时，使用了Lock锁做同步处理，内部拷贝了原数组，并在新数组上进行添加操作，最后将新数组替换掉旧数组；若进行的读操作，则直接返回结果，操作过程中不需要进行同步。

## Java 集合遍历的常见方式

### 一、List 的遍历方式

#### 1.**for-each 增强 for 循环**

最常用、语法最简洁：

```java
List<String> list = Arrays.asList("A", "B", "C");
for (String s : list) {
    System.out.println(s);
}
```

底层其实是使用 **Iterator** 实现的，只是语法糖。
 编译后会变成：

```java
for (Iterator<String> it = list.iterator(); it.hasNext();) {
    String s = it.next();
    System.out.println(s);
}
```

------

#### 2. **Iterator 显式迭代**

更灵活，可以在遍历中安全删除元素：

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String s = it.next();
    if ("B".equals(s)) {
        it.remove(); // ✅ 安全删除
    }
}
```

**注意：**
 如果直接 `list.remove(s)` 会触发 **ConcurrentModificationException（并发修改异常）**。
 因为集合在创建迭代器后被结构性修改（结构性修改指增删元素）会破坏迭代器的一致性。

------

#### 3. **传统 for 循环（带索引）**

适用于 `List` 类型（随机访问快）：

```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

不适用于 `LinkedList`，因为 `get(i)` 时间复杂度是 `O(n)`，整体变成 `O(n²)`。

------

#### 4. **Lambda 表达式 / forEach**

从 Java 8 开始支持函数式遍历：

```java
list.forEach(s -> System.out.println(s));
```

或者使用方法引用：

```java
list.forEach(System.out::println);
```

**特点：**

- 可读性好；
- 不支持在遍历中删除元素（否则也会抛 ConcurrentModificationException）。

------

#### 5. **Stream 流式遍历**

也是 Java 8 之后的新方式，支持并行处理：

```
list.stream().forEach(System.out::println);
```

如果是大集合，可以用并行流：

```
list.parallelStream().forEach(System.out::println);
```

**注意：**

- `stream()` 是顺序执行；
- `parallelStream()` 是多线程执行（但不保证输出顺序一致）；
- 流式 API 适合做**过滤、映射、聚合**等复杂操作。

------

### 二、Map 的遍历方式

Map 的遍历比 List 要多几种组合方式：

```java
Map<String, Integer> map = new HashMap<>();
map.put("A", 1);
map.put("B", 2);
map.put("C", 3);
```

#### 1. 遍历 `keySet`

```java
for (String key : map.keySet()) {
    System.out.println(key + "=" + map.get(key));
}
```

**缺点**：`get(key)` 会重复查找，效率稍低。

------

#### 2. 遍历 `entrySet`（推荐）

```java
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}
```

效率高，直接访问键值对对象。

------

#### 3. 遍历 `values`

```java
for (Integer value : map.values()) {
    System.out.println(value);
}
```

仅遍历值，不要键。

------

#### 4. 使用 Iterator

```java
Iterator<Map.Entry<String, Integer>> it = map.entrySet().iterator();
while (it.hasNext()) {
    Map.Entry<String, Integer> entry = it.next();
    System.out.println(entry.getKey() + "=" + entry.getValue());
}
```

------

#### 5. 使用 Lambda

```
map.forEach((k, v) -> System.out.println(k + "=" + v));
```

最简洁的写法，推荐在 Java 8+ 使用。

## ArrayList的扩容机制说一下

ArrayList在添加元素时，如果当前元素个数已经达到了内部数组的容量上限，就会触发扩容操作。
ArrayList的扩容操作主要包括以下几个步骤：

- 计算新的容量：一般情况下，新的容量会扩大为原容量的1.5倍（在JDK10之后，扩容策略做了调整），然后检查是否超过了最大容量限制。
- 创建新的数组：根据计算得到的新容量，创建一个新的更大的数组。
- 将元素复制：将原来数组中的元素复制到新数组中。**`Arrays.copyOf`**：底层使用 `System.arraycopy` 复制老数组到新数组。
- 更新引用：将ArrayList内部指向原数组的引用指向新数组。
- 完成扩容：扩容完成后，可以继续添加新元素。

ArrayList的扩容操作涉及到数组的复制和内存的重新分配，所以在频繁添加大量元素时，扩容操作可能会影响性能。

为了减少扩容带来的性能损耗，可以在初始化ArrayList时预分配足够大的容量，避免频繁触发扩容操作。之所以扩容是1.5倍，是因为1.5可以充分利用移位操作，减少浮点数或者运算时间和运算次数。

## HashMap实现原理介绍一下？

在JDK1.7版本之前，HashMap数据结构是数组和链表，HashMap通过哈希算法将元素的键（Key）映射到数组中的槽位（Bucket）。如果多个键映射到同一个槽位，它们会以链表的形式存储在同一个槽位上，因为链表的查询时间是O（n），所以冲突很严重，一个索引上的链表非常长，效率就很低了。



<img src="https://cdn.xiaolincoding.com//picgo/1719565480532-57a14329-c36b-4514-8e7d-2f2f1df88a82.webp" alt="img" style="zoom: 67%;" />

所以在JDK1.8版本的时候做了优化，当一个链表的长度超过8的时候就转换数据结构，不再使用链表存储，而是使用红黑树，查找时使用红黑树，时间复杂度O（logn），可以提高查询性能，但是在数量较少时，即数量小于6时，会将红黑树转换回链表。

<img src="https://cdn.xiaolincoding.com//picgo/1719565481289-0c2164f4-f755-46e3-bb39-b5f28621bb6b.webp" alt="img" style="zoom:67%;" />

### HashMap的扩容机制介绍一下

初始容量与负载因子：HashMap 默认初始容量是 16，负载因子默认是 0.75。负载因子是一个衡量 HashMap 满的程度的参数。

扩容时机：当 HashMap 中的键值对数量达到容量乘以负载因子时，就会触发扩容。

扩容方式：扩容时新容量是原容量的 2 倍。在扩容过程中，需要重新计算每个键值对在新数组中的位置并重新插入。这是因为 HashMap 是根据键的哈希值来确定存储位置的，数组大小变化后，哈希值对应的存储位置可能会改变。在 JDK 1.8 之前，重新计算位置较为复杂，需要重新计算哈希值；在 JDK 1.8 中，利用了哈希值的高位来简化计算，提高了扩容效率。

1. 扩容过程：

2. 1. 创建一个新数组，其长度为原数组的两倍。
   2. 遍历原数组中的每个桶，重新计算每个键值对的哈希值。
   3. 根据新的哈希值，将键值对迁移到新数组的对应位置。

## HashMap存取过程

### **1. put 方法过程（存储键值对）**

1. **计算哈希值**对 key 调用 `hashCode()` 方法得到原始哈希值，再通过 HashMap 内部的哈希算法（如扰动函数）处理，减少哈希冲突。
2. **确定桶位置**根据处理后的哈希值与数组长度进行 `&` 运算（等价于取模，效率更高），得到该 key 对应的数组下标（桶位置）。
3. **处理桶位置的元素**
   - 若桶为空（无元素）：直接创建新节点（JDK 8 中为链表节点或树节点），放入该桶。
   - 若桶不为空：
     - 检查桶中首个节点的 key 与当前 key 是否 “相等”（`hash` 相同且 `equals` 为 true），若相等则覆盖旧值。
     - 若不相等，遍历桶中的链表或红黑树：
       - 若找到相同 key 的节点，覆盖旧值。
       - 若未找到，在链表尾部添加新节点；若链表长度超过阈值（默认 8），将链表转为红黑树。
4. **扩容检查**插入后若哈希表的元素总数（size）超过阈值（容量 × 负载因子），则触发扩容：创建新数组（容量翻倍），将旧数组中的元素重新哈希并迁移到新数组中。

### **2. get 方法过程（获取键对应的值）**

1. **计算哈希值**与 `put` 一致，对 key 计算处理后的哈希值。
2. **确定桶位置**通过哈希值定位到对应的桶（数组下标）。
3. **查找对应节点**
   - 若桶为空，返回 `null`。
   - 若桶不为空：
     - 检查桶中首个节点的 key 是否与目标 key 相等，若相等则返回对应 value。
     - 若不相等，遍历桶中的链表或红黑树：
       - 若找到相同 key 的节点，返回其 value。
       - 若遍历结束仍未找到，返回 `null`。

## 什么是哈希冲突？怎么解决哈希冲突？

**什么是hash碰撞？**

哈希碰撞（Hash Collision），也叫哈希冲突，是指在哈希函数的应用中，不同的输入数据经过哈希函数计算后，得到相同的哈希值的现象。这是由于哈希函数将无限的输入空间映射到有限的输出空间所导致的必然结果。

**哈希碰撞产生的原因？**

哈希函数的设计目标是将不同的输入尽可能的均匀分布到哈希表的不同位置。然而，无论哈希函数设计的多么巧妙，由于输入数据的可能性是无限的，哈希值的范围是有限的，所以不可避免的出现，不同输入数据产生相同哈希值的情况。

**解决哈希碰撞的方法**

**1.** **链地址法（Separate Chaining）**

- 原理：在哈希表的每个槽位（bucket）中维护一个链表。**当发生哈希碰撞时，将具有相同哈希值的元素依次插入到对应的链表中。**
- 优点：实现简单，插入和查找操作的平均时间复杂度在哈希表负载因子合理的情况下接近 O (1)。链表可以动态扩展，无需预先知道数据的数量。
- 缺点：当链表过长时，查找效率会下降，时间复杂度可能退化为 O (n)，其中 n 是链表的长度。此外，链表需要额外的指针空间来维护节点之间的连接。

**2.** **开放地址法（Open Addressing）**

- 线性探测法（Linear Probing）：

- - 原理：当发生哈希碰撞时，**从产生碰撞的哈希地址开始，依次探测下一个地址，直到找到一个空闲的槽位来插入元素。**例如，假设哈希表大小为 10，元素 A 经过哈希函数计算得到地址 3，若地址 3 已被占用，就依次探测地址 4、5、6…… 直到找到空闲位置插入 A。
  - 优点：不需要额外的链表空间，哈希表的空间利用率较高。在数据量较小且哈希函数分布均匀的情况下，性能较好。
  - 缺点：容易出现 “聚集” 现象，即连续的多个槽位被占用，导致后续插入和查找时需要探测更多的位置，性能下降。

- 二次探测法（Quadratic Probing）：

- - 原理：与线性探测法类似，但探测的步长不是固定为 1，而是**按照二次函数的方式变化**。例如，第一次探测步长为 1，第二次为 4，第三次为 9…… 即探测地址 hash(key) + i^2（i 从 1 开始递增）。这样可以减少 “聚集” 现象的发生。
  - 优点：减少了线性探测法中的聚集问题，提高了哈希表的性能和空间利用率。
  - 缺点：实现相对复杂，并且不能完全避免聚集现象，当哈希表接近满载时，性能仍然会受到影响。

- 双重哈希法（Double Hashing）：

- - 原理：**使用两个哈希函数** **hash1(key)** **和** **hash2(key)****。当发生哈希碰撞时，使用第二个哈希函数** **hash2(key)** **计算出一个步长，然后按照这个步长进行探测**。例如，hash1(key) 计算出的哈希地址为 h1，若 h1 位置已被占用，则探测地址 (h1 + hash2(key)) % table_size。
  - 优点：能更均匀地分布冲突元素，减少聚集现象，在各种负载情况下都能保持较好的性能。
  - 缺点：需要设计两个哈希函数，增加了设计的复杂性，并且第二个哈希函数的设计也会影响性能。

**3.** **再哈希法（Rehashing）**

- **原理**‌：当冲突发生时，采用第二个哈希函数重新**计算位置**。不计算步长。例如首次使用h1(key)=key%7，冲突后采用h2(key)=key%13+1。‌‌2‌‌8

- ‌**优势**‌：显著减少聚集现象。
- ‌**局限**‌：多重哈希计算增加时间成本，需精心设计哈希函数组合。

**4.** **公共溢出区法**

- 原理：**将哈希表分为基本表和溢出表。**当发生哈希碰撞时，将冲突的元素统一存储在溢出表中。基本表存储正常插入且无冲突的元素。例如，在插入元素时，先计算其哈希值，若在基本表中该位置未被占用，则直接插入；若已被占用，则插入到溢出表中。
- 优点：实现相对简单，对于解决哈希碰撞有一定效果，且基本表的查询效率不受溢出表的影响。
- 缺点：溢出表的查询效率相对较低，因为需要先在基本表查询，若未找到再到溢出表查询。而且溢出表可能会变得很大，影响整体性能。

## **说说你对 ConcurrentHashMap 的了解**

- - **线程安全性**：ConcurrentHashMap是线程安全的哈希表，允许多个线程同时读，部分线程写。它采用了分段锁（Segment）机制（在 JDK 1.7 及之前版本），将数据分成多个段，每个段有自己的锁，不同段的数据可以被不同线程同时修改，提高了并发性能。在 JDK 1.8 及之后版本，摒弃了分段锁机制，采用数组加链表（红黑树）的数据结构，并使用 CAS（Compare - And - Swap）操作和Synchronized关键字来保证线程安全。

  - **数据结构**：

  - - JDK 1.7 中，ConcurrentHashMap由多个Segment组成，每个Segment继承自ReentrantLock，内部包含一个哈希表。当对ConcurrentHashMap进行写操作时，需要先获取对应Segment的锁，读操作一般不需要加锁，除非读取时发现元素正在被修改。
    - JDK 1.8 中，数据结构与HashMap类似，由数组、链表和红黑树组成。当链表长度超过一定阈值（默认为 8）时，链表会转换为红黑树，以提高查找性能。写操作时，对数组中每个桶（bucket）使用Synchronized关键字进行同步，读操作不加锁，但会通过 volatile 关键字保证可见性。

  - **并发性能**：相比Hashtable，ConcurrentHashMap在多线程环境下具有更好的并发性能。Hashtable对整个哈希表加锁，同一时间只能有一个线程进行读写操作；而ConcurrentHashMap允许多个线程同时访问不同的段（JDK 1.7）或桶（JDK 1.8），大大提高了并发访问效率。

  - **适用场景**：适用于多线程环境下需要高效读写的场景，如缓存系统、统计系统等，既保证线程安全，又能提供较好的并发性能。

## **泛型在集合中的作用？为什么集合不能存储基本类型？**

- 作用：编译时检查类型安全，避免运行时`ClassCastException`。
- 不能存基本类型：泛型擦除后，集合实际存储的是`Object`，而基本类型不是`Object`子类（需用包装类，如`Integer`代替`int`）。

