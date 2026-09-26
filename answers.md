# 前四周参考答案

> **剧透警告：请先独立练习。W04-04～W04-08 是保留测评，计时结束前不要阅读相应答案。**

全部为原创题参考实现，Python 3 标准库环境即可运行。实现优先对应当前学习阶段；并不保证是每题最快写法。字典和集合的复杂度按通常平均情况描述。全部参考代码的有限用例验证可运行 `python3 check.py --self-test`。

<details>
<summary>W01-01 连续页码求和：展开查看思路和参考代码</summary>

用循环累加，特别检查 range 的右端点。时间 O(n)，额外空间 O(1)。

```python
n = int(input())
total = 0
for number in range(1, n + 1):
    total += number
print(total)
```

</details>

<details>
<summary>W01-02 选择较长路线：展开查看思路和参考代码</summary>

用条件判断覆盖大于、小于和相等的情况。时间与空间均 O(1)。

```python
a, b = map(int, input().split())
if a >= b:
    print(a)
else:
    print(b)
```

</details>

<details>
<summary>W01-03 票号数字和：展开查看思路和参考代码</summary>

每次用 % 10 取末位，再用 // 10 去掉末位。数字 0 不进入循环也能得到正确答案。时间 O(位数)，额外空间 O(1)。

```python
n = int(input())
total = 0
while n > 0:
    total += n % 10
    n //= 10
print(total)
```

</details>

<details>
<summary>W01-04 检查编号：展开查看思路和参考代码</summary>

先用枚举理解计数；也可观察答案等于 n // k。所示实现时间 O(n)，额外空间 O(1)。

```python
n, k = map(int, input().split())
count = 0
for number in range(1, n + 1):
    if number % k == 0:
        count += 1
print(count)
```

</details>

<details>
<summary>W01-05 偶数读数：展开查看思路和参考代码</summary>

对每个输入判断 value % 2 == 0。不要漏掉 0 和负数。时间 O(n)，额外空间 O(1)。

```python
n = int(input())
count = 0
for _ in range(n):
    value = int(input())
    if value % 2 == 0:
        count += 1
print(count)
```

</details>

<details>
<summary>W01-06 排列计数起步：展开查看思路和参考代码</summary>

乘积初始值应是 1，n=0 时循环为空。时间 O(n) 次乘法，所给范围内额外空间 O(1)。

```python
n = int(input())
answer = 1
for value in range(1, n + 1):
    answer *= value
print(answer)
```

</details>

<details>
<summary>W01-07 计时器显示：展开查看思路和参考代码</summary>

先整除得到小时，再从余数中取分钟和秒。时间与空间均 O(1)。

```python
t = int(input())
h = t // 3600
m = (t % 3600) // 60
s = t % 60
print(h, m, s)
```

</details>

<details>
<summary>W01-08 分段积分：展开查看思路和参考代码</summary>

超过阈值时，只对超出的部分采用新计分方式。时间与空间均 O(1)。

```python
n = int(input())
if n <= 10:
    score = n * 2
else:
    score = 20 + (n - 10) * 3
print(score)
```

</details>

<details>
<summary>W02-01 读数摘要：展开查看思路和参考代码</summary>

列表保存一组数据，分别调用 min、max 和 sum。时间 O(n)，存储空间 O(n)。

```python
n = int(input())
values = list(map(int, input().split()))
print(min(values), max(values), sum(values))
```

</details>

<details>
<summary>W02-02 镜面单词：展开查看思路和参考代码</summary>

切片 s[::-1] 得到反转字符串。时间与额外空间均 O(|s|)。

```python
s = input().strip()
print('YES' if s == s[::-1] else 'NO')
```

</details>

<details>
<summary>W02-03 元音数量：展开查看思路和参考代码</summary>

逐个字符判断是否属于固定的五个元音。时间 O(|s|)，额外空间 O(1)。

```python
s = input().strip()
count = 0
for ch in s:
    if ch in 'aeiou':
        count += 1
print(count)
```

</details>

<details>
<summary>W02-04 第 k 张卡片：展开查看思路和参考代码</summary>

排序后访问下标 k-1。重复值不能去重。时间 O(n log n)，总存储 O(n)。

```python
n, k = map(int, input().split())
values = list(map(int, input().split()))
values.sort()
print(values[k - 1])
```

</details>

<details>
<summary>W02-05 高于平均值：展开查看思路和参考代码</summary>

用 value*n > total 比较，避免浮点数。时间 O(n)，存储 O(n)。

```python
n = int(input())
values = list(map(int, input().split()))
total = sum(values)
count = 0
for value in values:
    if value * n > total:
        count += 1
print(count)
```

</details>

<details>
<summary>W02-06 队伍左移：展开查看思路和参考代码</summary>

先对 n 取余，再切片拼接。无需做 k 次移动。时间与空间均 O(n)。

```python
n, k = map(int, input().split())
values = list(map(int, input().split()))
k %= n
result = values[k:] + values[:k]
print(*result)
```

</details>

<details>
<summary>W02-07 删除指定读数：展开查看思路和参考代码</summary>

建立新列表保存需要保留的数，避免一边遍历一边删除。时间与空间均 O(n)。

```python
n, x = map(int, input().split())
values = list(map(int, input().split()))
remaining = []
for value in values:
    if value != x:
        remaining.append(value)
print(len(remaining))
if remaining:
    print(*remaining)
else:
    print('EMPTY')
```

</details>

<details>
<summary>W02-08 连续差值：展开查看思路和参考代码</summary>

从下标 1 开始，相邻相减，注意差值方向。时间与空间均 O(n)。

```python
n = int(input())
values = list(map(int, input().split()))
result = []
for i in range(1, n):
    result.append(values[i] - values[i - 1])
if result:
    print(*result)
else:
    print('EMPTY')
```

</details>

<details>
<summary>W03-01 最常见编号：展开查看思路和参考代码</summary>

字典计数，然后按出现次数优先、数值次优选择答案。平均时间 O(n)，空间 O(n)。

```python
n = int(input())
values = list(map(int, input().split()))
counts = {}
for value in values:
    counts[value] = counts.get(value, 0) + 1
best = min(counts)
for value, count in counts.items():
    if count > counts[best] or (count == counts[best] and value < best):
        best = value
print(best, counts[best])
```

</details>

<details>
<summary>W03-02 首次出现顺序：展开查看思路和参考代码</summary>

集合判断是否见过，列表保留顺序；不能直接输出集合。平均时间与空间均 O(n)。

```python
n = int(input())
values = list(map(int, input().split()))
seen = set()
result = []
for value in values:
    if value not in seen:
        seen.add(value)
        result.append(value)
print(len(result))
print(*result)
```

</details>

<details>
<summary>W03-03 共同收录：展开查看思路和参考代码</summary>

集合去重后取交集。平均时间与空间均 O(n+m)。

```python
n, m = map(int, input().split())
a = set(map(int, input().split()))
b = set(map(int, input().split()))
print(len(a & b))
```

</details>

<details>
<summary>W03-04 库存查询：展开查看思路和参考代码</summary>

先构建频数字典，每次用 get 查询，缺失时返回 0。平均时间 O(n+q)，空间 O(n)。

```python
n, q = map(int, input().split())
counts = {}
for value in map(int, input().split()):
    counts[value] = counts.get(value, 0) + 1
for _ in range(q):
    x = int(input())
    print(counts.get(x, 0))
```

</details>

<details>
<summary>W03-05 每行总量：展开查看思路和参考代码</summary>

每次读入一行便可计算，不需要把整张表保存。时间 O(nm)，额外空间 O(m)。

```python
n, m = map(int, input().split())
for _ in range(n):
    row = list(map(int, input().split()))
    print(sum(row))
```

</details>

<details>
<summary>W03-06 翻转表格坐标：展开查看思路和参考代码</summary>

输入存为二维列表，输出时交换两层循环的行列角色。时间与存储均 O(nm)。

```python
n, m = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(n)]
for j in range(m):
    row = []
    for i in range(n):
        row.append(grid[i][j])
    print(*row)
```

</details>

<details>
<summary>W03-07 网格行走距离：展开查看思路和参考代码</summary>

横向与纵向距离分别不可省略，两者相加即可。时间 O(q)，额外空间 O(1)。

```python
def distance(x1, y1, x2, y2):
    return abs(x1 - x2) + abs(y1 - y2)

q = int(input())
for _ in range(q):
    x1, y1, x2, y2 = map(int, input().split())
    print(distance(x1, y1, x2, y2))
```

</details>

<details>
<summary>W03-08 第一个独特字母：展开查看思路和参考代码</summary>

先统计全部次数，再按原字符串顺序找第一个次数为 1 的位置。时间 O(|s|)，字母表固定时额外空间 O(1)。

```python
s = input().strip()
counts = {}
for ch in s:
    counts[ch] = counts.get(ch, 0) + 1
answer = 0
for i, ch in enumerate(s, 1):
    if counts[ch] == 1:
        answer = i
        break
print(answer)
```

</details>

<details>
<summary>W04-01 区间读数求和：展开查看思路和参考代码</summary>

把题目的 1 起始位置转成列表下标。每次最多扫描 n 项，时间 O(nq)，存储 O(n)。

```python
n, q = map(int, input().split())
values = list(map(int, input().split()))
for _ in range(q):
    left, right = map(int, input().split())
    total = 0
    for i in range(left - 1, right):
        total += values[i]
    print(total)
```

</details>

<details>
<summary>W04-02 闰年卡片：展开查看思路和参考代码</summary>

按题面直接构造逻辑条件；特别检查整百年。时间 O(q)，额外空间 O(1)。

```python
def is_leap(year):
    return year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)

q = int(input())
for _ in range(q):
    print('YES' if is_leap(int(input())) else 'NO')
```

</details>

<details>
<summary>W04-03 清单补齐：展开查看思路和参考代码</summary>

先用集合记录已有编号，再按递增顺序检查目标范围。平均时间 O(n+m)，空间 O(n+m)。

```python
n, m = map(int, input().split())
owned = set(map(int, input().split()))
missing = []
for value in range(1, m + 1):
    if value not in owned:
        missing.append(value)
print(len(missing))
if missing:
    print(*missing)
else:
    print('COMPLETE')
```

</details>

<details>
<summary>W04-04 连续在线记录：展开查看思路和参考代码</summary>

维护以当前位置结尾的连续长度，遇到 0 清零。时间 O(n)，所示存储 O(n)，扫描额外空间 O(1)。

```python
n = int(input())
values = list(map(int, input().split()))
current = 0
best = 0
for value in values:
    if value == 1:
        current += 1
        best = max(best, current)
    else:
        current = 0
print(best)
```

</details>

<details>
<summary>W04-05 筛选页码积分：展开查看思路和参考代码</summary>

直接枚举闭区间，用整除条件筛选后累加。时间 O(R-L+1)，额外空间 O(1)。

```python
left, right, k = map(int, input().split())
total = 0
for page in range(left, right + 1):
    if page % k == 0:
        total += page
print(total)
```

</details>

<details>
<summary>W04-06 压缩连续字母：展开查看思路和参考代码</summary>

只比较当前字符与已保留的最后一个字符；集合去重会破坏题意。时间与空间均 O(|s|)。

```python
s = input().strip()
result = []
for ch in s:
    if not result or result[-1] != ch:
        result.append(ch)
print(''.join(result))
```

</details>

<details>
<summary>W04-07 两张卡片配对：展开查看思路和参考代码</summary>

枚举 i<j，既避免使用同一张卡片，也避免重复计数。时间 O(n²)，存储 O(n)。

```python
n, target = map(int, input().split())
values = list(map(int, input().split()))
count = 0
for i in range(n):
    for j in range(i + 1, n):
        if values[i] + values[j] == target:
            count += 1
print(count)
```

</details>

<details>
<summary>W04-08 边框总量：展开查看思路和参考代码</summary>

逐格判断是否属于任意一条边，条件用 or 连接，每格最多累加一次。时间 O(nm)，额外空间 O(m)。

```python
n, m = map(int, input().split())
total = 0
for i in range(n):
    row = list(map(int, input().split()))
    for j in range(m):
        if i == 0 or i == n - 1 or j == 0 or j == m - 1:
            total += row[j]
print(total)
```

</details>
