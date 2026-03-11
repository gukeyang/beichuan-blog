# 排序算法

常见排序算法的实现和复杂度分析。

## 排序算法对比

| 算法 | 平均时间 | 最好 | 最坏 | 空间 | 稳定性 |
|------|---------|------|------|------|--------|
| 冒泡排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n) | O(n²) | O(1) | 稳定 |
| 快速排序 | O(n log n) | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n log n) | O(n) | 稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 希尔排序 | O(n log n) | O(n log n) | O(n²) | O(1) | 不稳定 |
| 计数排序 | O(n+k) | O(n+k) | O(n+k) | O(k) | 稳定 |
| 桶排序 | O(n+k) | O(n+k) | O(n²) | O(n+k) | 稳定 |
| 基数排序 | O(n×k) | O(n×k) | O(n×k) | O(n+k) | 稳定 |

## 代码实现

### 快速排序

```java
public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}
```

### 归并排序

```java
public void mergeSort(int[] arr, int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}
```

## 使用场景

- **数据量小**: 插入排序、冒泡排序
- **数据量大**: 快速排序、归并排序、堆排序
- **要求稳定**: 归并排序、插入排序
- **近乎有序**: 插入排序、冒泡排序
- **整数排序**: 计数排序、桶排序、基数排序
