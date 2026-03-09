# 常见排序算法详解

> 📊 面试必考，开发常用

## 算法对比

| 算法 | 平均时间 | 最好 | 最坏 | 空间 | 稳定性 |
|------|----------|------|------|------|--------|
| 快速排序 | O(nlogn) | O(nlogn) | O(n²) | O(logn) | 不稳定 |
| 归并排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(n) | 稳定 |
| 堆排序 | O(nlogn) | O(nlogn) | O(nlogn) | O(1) | 不稳定 |
| 冒泡排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 插入排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |

## 快速排序（Quick Sort）

**核心思想**：分治法，选择一个基准值，将数组分为两部分，递归排序。

```java
public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];  // 选择最后一个元素作为基准
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }
    
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    // 测试
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}
```

**优化技巧**：
- 三数取中法选择基准值
- 小数组使用插入排序
- 三路快排处理大量重复元素

## 归并排序（Merge Sort）

**核心思想**：分治法，将数组递归拆分，然后合并有序子数组。

```java
public class MergeSort {
    public static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
    private static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        
        // 合并两个有序数组
        while (i <= mid && j <= right) {
            temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
        }
        
        // 处理剩余元素
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        
        // 复制回原数组
        System.arraycopy(temp, 0, arr, left, temp.length);
    }
}
```

**应用场景**：
- 链表排序
- 外部排序（大数据）
- 需要稳定排序的场景

## 堆排序（Heap Sort）

**核心思想**：利用堆这种数据结构（完全二叉树）进行排序。

```java
public class HeapSort {
    public static void heapSort(int[] arr) {
        int n = arr.length;
        
        // 构建最大堆
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        
        // 逐个提取最大元素
        for (int i = n - 1; i > 0; i--) {
            swap(arr, 0, i);
            heapify(arr, i, 0);
        }
    }
    
    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        
        if (largest != i) {
            swap(arr, i, largest);
            heapify(arr, n, largest);
        }
    }
    
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

**应用场景**：
- Top K 问题
- 优先队列
- 空间受限的场景

## 冒泡排序（Bubble Sort）

```java
public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        
        for (int i = 0; i < n - 1; i++) {
            swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                    swapped = true;
                }
            }
            // 如果没有发生交换，说明已经有序
            if (!swapped) break;
        }
    }
}
```

## 插入排序（Insertion Sort）

```java
public class InsertionSort {
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            
            // 将比 key 大的元素向后移动
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }
}
```

**适用场景**：小数组、基本有序的数据

## 选择排序（Selection Sort）

```java
public class SelectionSort {
    public static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            
            // 找到最小元素的索引
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            
            if (minIndex != i) {
                swap(arr, i, minIndex);
            }
        }
    }
}
```

## 面试高频题

### 1. 链表排序

```java
// 使用归并排序
public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    
    // 找到中点
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    ListNode right = sortList(slow.next);
    slow.next = null;
    ListNode left = sortList(head);
    
    return merge(left, right);
}

private ListNode merge(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    
    curr.next = l1 != null ? l1 : l2;
    return dummy.next;
}
```

### 2. 颜色分类（荷兰国旗问题）

```java
// 75. 颜色分类 - 三路快排思想
public void sortColors(int[] nums) {
    int left = 0, right = nums.length - 1, i = 0;
    
    while (i <= right) {
        if (nums[i] == 0) {
            swap(nums, i++, left++);
        } else if (nums[i] == 2) {
            swap(nums, i, right--);
        } else {
            i++;
        }
    }
}
```

### 3. 最大数

```java
// 179. 最大数 - 自定义排序规则
public String largestNumber(int[] nums) {
    String[] strs = new String[nums.length];
    for (int i = 0; i < nums.length; i++) {
        strs[i] = String.valueOf(nums[i]);
    }
    
    Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));
    
    if (strs[0].equals("0")) return "0";
    
    StringBuilder sb = new StringBuilder();
    for (String s : strs) sb.append(s);
    return sb.toString();
}
```

## 性能测试

```java
public class SortBenchmark {
    public static void main(String[] args) {
        int[] sizes = {100, 1000, 10000};
        
        for (int size : sizes) {
            System.out.println("数组大小：" + size);
            int[] arr = generateRandomArray(size);
            
            long start = System.nanoTime();
            quickSort(arr.clone(), 0, arr.length - 1);
            long quickTime = System.nanoTime() - start;
            
            start = System.nanoTime();
            mergeSort(arr.clone(), 0, arr.length - 1);
            long mergeTime = System.nanoTime() - start;
            
            System.out.printf("快速排序：%d ms%n", quickTime / 1_000_000);
            System.out.printf("归并排序：%d ms%n", mergeTime / 1_000_000);
        }
    }
    
    private static int[] generateRandomArray(int size) {
        Random random = new Random();
        int[] arr = new int[size];
        for (int i = 0; i < size; i++) {
            arr[i] = random.nextInt(10000);
        }
        return arr;
    }
}
```

## 总结

| 场景 | 推荐算法 |
|------|----------|
| 通用排序 | Arrays.sort() (双轴快排) |
| 需要稳定 | 归并排序 |
| 空间受限 | 堆排序 |
| 小数组 | 插入排序 |
| 基本有序 | 插入排序、冒泡排序 |
| 链表排序 | 归并排序 |

## 下一步

- [ ] 实现希尔排序
- [ ] 学习计数排序、桶排序、基数排序
- [ ] LeetCode 刷题实践
