/* 自包含教学例程；输入是下方展示的函数参数，不是外部题目的提交答案。 */
(() => {
  const lessons = {};
  const add = (id, intuition, derivation, invariant, code, complexity, cases, checks, python) => {
    lessons[id] = { intuition, derivation, invariant, code, complexity,
      cases: cases.map(([input, expected, why]) => ({ input, expected, why })),
      checks: checks.map(([question, answer]) => ({ question, answer })), python };
  };
  add('k01', '把输入文字变成数值，再按题意做整数运算；先确定单位和输出含义。',
    ['字符串 "17 5" 按空白拆为两个字段，分别转为整数。', '商 q 与余数 r 必须满足 n = q × size + r。size 为正数时，0 ≤ r < size。'],
    '整袋数与余数共同还原原数量；除数必须是正整数。', `def pack(text):
    n, size = map(int, text.split())
    if n < 0 or size <= 0:
        raise ValueError("数量非负，容量为正")
    return n // size, n % size

if __name__ == "__main__":
    print(pack("17 5"))`,
    '按竞赛常见定长整数估算，计算 O(1)；解析长度为 L 的文字需 O(L)。',
    [['pack("17 5")', '(3, 2)', '普通情况。'], ['pack("0 5")', '(0, 0)', '没有物品时不产生袋子。']],
    [['为什么不用 int(n / size)？', '/ 先生成浮点数，大整数可能丢精度；// 直接进行整数除法。'], ['负数的 // 是否向零取整？', '不是，Python 向下取整，例如 -3 // 2 为 -2；本例主动限制数量非负。']],
    '整数没有固定 32 位溢出，但位数越多计算越贵；竞赛输出不要添加交互提示。');
  add('k02', '循环把同一个判断作用于每项；变量含义必须在执行前后都清楚。',
    ['设 count 表示已经检查的成绩中达标的数量，初始为 0。', '每读取一项，只在成绩 ≥ 60 时增加 1；遍历结束时所有项都已检查。'],
    '处理前 i 项之后，count 恰好等于这 i 项中达标的数量。', `def passed(scores):
    count = 0
    for score in scores:
        if score >= 60:
            count += 1
    return count

if __name__ == "__main__":
    print(passed([59, 60, 92]))`, 'n 为成绩数量，时间 O(n)，额外空间 O(1)。',
    [['passed([59, 60, 92])', '2', '等于 60 也计入。'], ['passed([])', '0', '空序列循环执行零次。']],
    [['把 >= 改成 > 会漏掉什么？', '恰好 60 分的成绩。'], ['while 何时会死循环？', '循环条件一直为真且循环体没有让状态趋向退出条件时。']],
    'range(n) 产生 0 到 n-1；遍历值时直接 for score in scores，避免无必要索引。');
  add('k03', '排序把大小关系变为位置关系，但原始顺序会丢失。',
    ['先复制排序，得到 b[0] ≤ b[1] ≤ …。', '相邻差只需访问 b[i] 与 b[i-1]；从 i=1 开始，避免误把首尾当相邻。'],
    '第 i 个差对应排序后位置 i-1 与 i，两端都在有效下标内。', `def adjacent_gaps(values):
    b = sorted(values)
    return [b[i] - b[i - 1] for i in range(1, len(b))]

if __name__ == "__main__":
    print(adjacent_gaps([8, 3, 5]))`, 'n 为元素个数，排序 O(n log n)，扫描 O(n)，额外空间 O(n)。',
    [['adjacent_gaps([8, 3, 5])', '[2, 3]', '先建立有序关系。'], ['adjacent_gaps([7])', '[]', '一个元素没有相邻对。']],
    [['a = a.sort() 为什么不对？', 'sort 原地修改并返回 None；sorted 才返回新列表。'], ['如果题目要原编号怎么办？', '排序前将值与原编号组成记录，避免丢失对应关系。']],
    '切片和 sorted 都可能复制列表；不能把它们当作 O(1) 操作。');
  add('k04', '先定义匹配单位。本例把空白分隔的整段文字当作单词，并保留其原字符位置。',
    ['用下标扫描并跳过空白，再找到一个完整单词的起止位置。', '比较该单词的小写形式，命中时保存起点；不要先 split 后猜原位置。'],
    '每个非空白单词恰好扫描一次，下标始终引用原始字符串。', `def word_positions(text, target):
    if not target or any(ch.isspace() for ch in target):
        raise ValueError("目标应为一个非空单词")
    answer, i = [], 0
    target = target.lower()
    while i < len(text):
        if text[i].isspace():
            i += 1
            continue
        start = i
        while i < len(text) and not text[i].isspace():
            i += 1
        if text[start:i].lower() == target:
            answer.append(start)
    return answer

if __name__ == "__main__":
    print(word_positions("  To today TO", "to"))`, 'L 为文本长度，时间 O(L+目标长度)，输出空间 O(命中数)，单次切片占用 O(最长单词长度)。',
    [['word_positions("  To today TO", "to")', '[2, 11]', '连续空格保留，today 不算整词 to。'], ['word_positions("", "to")', '[]', '空文本没有匹配。']],
    [['to, 是否匹配 to？', '按本例空白分词规则不匹配，标点属于单词；真实题目必须先读清规则。'], ['为什么不能直接找子串？', '子串可能出现在 today 这样的更长单词内部。']],
    '字符串不可原地改字符。反复用 s += 小片段构造长文本时，考虑列表收集后 join。');
  add('k05', '集合回答是否出现，字典回答出现几次；重复数决定计数问题的权重。',
    ['每读取 x，先取此前次数，缺失按 0 处理，再加 1。', '全部读取后，键的个数是不同值数量，所有次数之和是原元素数量。'],
    '处理任意前缀后，freq[x] 都是 x 在该前缀中的出现次数。', `def frequencies(values):
    freq = {}
    for x in values:
        freq[x] = freq.get(x, 0) + 1
    return freq

if __name__ == "__main__":
    print(frequencies([2, 2, 5]))`, 'n 为输入数，u 为不同值数；哈希操作平均 O(1) 时，总时间 O(n)，空间 O(u)。',
    [['frequencies([2, 2, 5])', '{2: 2, 5: 1}', '保留重复次数。'], ['frequencies([])', '{}', '空输入没有键。']],
    [['set(values) 能恢复次数吗？', '不能，去重时已丢失信息。'], ['字典键为何不能是列表？', '列表可变且不可哈希，可用不可变元组表达固定组合。']],
    '字典和集合的常数及内存比紧凑数值数组大，极大数据要实测；平均复杂度不是所有输入的最坏保证。');
  add('k06', '函数把计算封装为可重复测试的单位；二维列表的每一行必须是独立对象。',
    ['用推导式为每一行分别创建列表。', '函数返回矩阵而非只打印，使调用者能继续处理或断言结果。'],
    '修改 grid[r][c] 只影响这个格子，不改变其他行的同列。', `def marked_grid(rows, cols, r, c):
    if rows <= 0 or cols <= 0 or not (0 <= r < rows and 0 <= c < cols):
        raise ValueError("坐标必须位于非空网格内")
    grid = [[0] * cols for _ in range(rows)]
    grid[r][c] = 7
    return grid

if __name__ == "__main__":
    print(marked_grid(2, 3, 0, 1))`, 'R 行 C 列，时间与空间均 O(RC)。',
    [['marked_grid(2, 3, 0, 1)', '[[0, 7, 0], [0, 0, 0]]', '其他行不受影响。'], ['marked_grid(1, 1, 0, 0)', '[[7]]', '最小非空网格。']],
    [['[[0] * cols] * rows 有什么问题？', '外层重复的是同一行对象的引用，修改一行会连带修改其他行。'], ['print 与 return 有什么差别？', 'print 显示文本；return 把值交回调用方。没有显式 return 时返回 None。']],
    '函数的可变默认参数会跨调用共享；需要新列表时用 None 作为默认值并在函数内创建。');
  add('k07', '模拟先确定状态与事件次序，再逐步更新。本例每月领 300、支付支出、把整百存起来。',
    ['状态分为手头 cash 与已存 saved，存款不可用于当月支出。', '每月先加收入、再支付；负余额立即返回失败月份，否则存入整百。'],
    '成功处理每个月后 0 ≤ cash < 100，saved 是所有已转存的本金。', `def savings(expenses):
    cash = saved = 0
    for month, cost in enumerate(expenses, 1):
        cash += 300 - cost
        if cash < 0:
            return -month
        deposit = cash // 100 * 100
        saved += deposit
        cash -= deposit
    return cash + saved * 6 // 5

if __name__ == "__main__":
    print(savings([150, 250]))`, 'm 为月份数，时间 O(m)，额外空间 O(1)。收益按本例约定为本金的 1.2 倍。',
    [['savings([150, 250])', '240', '月末依次存 100、100，最后本金 200。'], ['savings([301])', '-1', '第一个月就不够支付。']],
    [['为什么不能先存款再支付？', '会把本月应付支出的可用现金移走，改变题意。'], ['样例正确后最先补哪些测试？', '恰好够支付、剩余恰好 100、第一月失败、最后一月失败。']],
    '金额尽量用整数最小单位表示；调试输出应在提交前移除，避免污染答案。');
  add('k08', '枚举必须覆盖所有合法解；如果某个变量已由约束唯一确定，就不必再枚举它。',
    ['三个数均在 1..m 中，和为 target；固定 a、b 后 c = target-a-b。', '只保留 1 ≤ c ≤ m 的候选，每个有序三元组恰好由自己的 a、b 被生成。'],
    '每次加入的三元组合法，每个合法有序三元组只出现一次。', `def triples(m, target):
    answer = []
    for a in range(1, m + 1):
        for b in range(1, m + 1):
            c = target - a - b
            if 1 <= c <= m:
                answer.append((a, b, c))
    return answer

if __name__ == "__main__":
    print(triples(3, 4))`, '时间 O(m²)，输出空间 O(答案数量)，最坏 O(m²)。',
    [['triples(3, 4)', '[(1, 1, 2), (1, 2, 1), (2, 1, 1)]', '顺序不同属于不同解。'], ['triples(3, 2)', '[]', '最小总和为 3，没有解。']],
    [['如果不区分排列怎么办？', '枚举时限制 a ≤ b ≤ c，每种无序组合恰好保留一个代表。'], ['为什么不是 O(target²)？', '两层循环的实际范围都是 m，与 target 的数值无直接关系。']],
    '输出极多答案时，存下全部列表可能超内存，可逐个生成或只统计数量。');
  add('k09', '把比较规则翻译成元组的字典序，每一项只负责一个优先级。',
    ['记录采用 (编号, 总分, 语文)，整体移动记录才能保持属性对应。', '总分降序、语文降序、编号升序，对应 (-总分, -语文, 编号)。'],
    '相邻排序记录的比较符合题面第一条有差异的规则。', `def rank_students(rows):
    return sorted(rows, key=lambda row: (-row[1], -row[2], row[0]))

if __name__ == "__main__":
    print(rank_students([(2, 270, 90), (1, 270, 95), (3, 280, 88)]))`, 'n 为人数，时间 O(n log n)，空间 O(n)。',
    [['rank_students([(2, 270, 90), (1, 270, 95), (3, 280, 88)])', '[(3, 280, 88), (1, 270, 95), (2, 270, 90)]', '先总分，再语文。'], ['rank_students([(2, 10, 5), (1, 10, 5)])', '[(1, 10, 5), (2, 10, 5)]', '前两项相同时编号升序。']],
    [['对整个排序加 reverse=True 可以吗？', '会同时反转编号顺序，与本题的混合升降序不符。'], ['完全相同的排序键怎么处理？', 'Python 排序稳定，保留这些记录原来的相对顺序；题目需要其他规则时应显式加入。']],
    'key 每条记录计算一次，通常比自行实现比较函数更直接；不要把负号用于不支持取负的字符串。');
  add('k10', '把每个区间表示成两个前缀之差，从重复求和中移除重复工作。',
    ['约定区间为 0 下标半开 [l,r)，p[i] 是前 i 项之和，p[0]=0。', 'p[r] 包含前 r 项，减去 p[l] 后恰好留下下标 l..r-1。'],
    'p[i+1]=p[i]+a[i]，因此任意合法区间和等于 p[r]-p[l]。', `def range_sums(a, queries):
    p = [0]
    for x in a:
        p.append(p[-1] + x)
    answer = []
    for l, r in queries:
        if not 0 <= l <= r <= len(a):
            raise ValueError("区间采用 [l,r)")
        answer.append(p[r] - p[l])
    return answer

if __name__ == "__main__":
    print(range_sums([2, 4, 1], [(1, 3), (0, 3)]))`, 'n 为数组长度，q 为查询数，预处理 O(n)，每次 O(1)，总时间 O(n+q)，存储 O(n+q)。',
    [['range_sums([2, 4, 1], [(1, 3), (0, 3)])', '[5, 7]', '内部区间与全区间。'], ['range_sums([], [(0, 0)])', '[0]', '空区间和为 0。']],
    [['出现负数还能用吗？', '能，相减恒等式不需要元素非负。'], ['修改 a[i] 后为什么旧前缀失效？', '所有包含 a[i] 的后续前缀都应变化；频繁交替修改查询可考虑树状数组。']],
    'sum(a[l:r]) 每次都复制并扫描区间；虽然代码短，但不是 O(1) 查询。');
  add('k11', '区间增加只改变两处相邻差：开始增加的位置和停止增加的位置。',
    ['采用 0 下标半开 [l,r)，为变化量开 n+1 格，记录 d[l]+=v、d[r]-=v。', '从左到右累计变化量，并加回原数组；所有修改可叠加，因为加法满足交换律。'],
    '扫描到位置 i 时，累计值恰好是所有覆盖 i 的修改量之和。', `def range_add(a, operations):
    n = len(a)
    diff = [0] * (n + 1)
    for l, r, value in operations:
        if not 0 <= l <= r <= n:
            raise ValueError("区间采用 [l,r)")
        diff[l] += value
        diff[r] -= value
    answer, extra = [], 0
    for i, x in enumerate(a):
        extra += diff[i]
        answer.append(x + extra)
    return answer

if __name__ == "__main__":
    print(range_add([1, 2, 3, 4], [(1, 3, 5)]))`, 'n 为数组长度，q 为修改次数，时间 O(n+q)，额外空间 O(n)。',
    [['range_add([1, 2, 3, 4], [(1, 3, 5)])', '[1, 7, 8, 4]', '半开右端不增加。'], ['range_add([3], [(0, 1, -2), (0, 0, 8)])', '[1]', '支持负修改，空区间没有影响。']],
    [['闭区间 [l,r] 要怎样改？', '取消变化的位置变成 r+1，同时为末尾哨兵保留空间。'], ['能立即回答每次修改后的任意区间和吗？', '本例不能高效完成，必须先还原；在线需求要重新选择数据结构。']],
    'n 达到数百万时，原数组、差分、输出同时保留会放大内存；可根据输入顺序复用存储或流式输出。');
  add('k12', '非负数组中，扩张窗口不会降低和；因此不合法时可以持续移动左端。',
    ['求和不超过 limit 的最长连续段；右端逐项加入当前和。', '只要超限就移出左端，直到合法；此时该右端下最早的合法左端产生最长候选。负数会破坏这个推导。'],
    '每次更新答案前窗口合法，左右端均只向右移动。', `def longest_window(a, limit):
    if limit < 0 or any(x < 0 for x in a):
        raise ValueError("本算法要求非负元素与非负上限")
    left = total = best = 0
    for right, x in enumerate(a):
        total += x
        while total > limit:
            total -= a[left]
            left += 1
        best = max(best, right - left + 1)
    return best

if __name__ == "__main__":
    print(longest_window([1, 2, 1, 3], 4))`, 'n 为元素数，每个元素加入、移出最多一次，时间 O(n)，额外空间 O(1)。',
    [['longest_window([1, 2, 1, 3], 4)', '3', '前 3 项和恰好 4。'], ['longest_window([0, 0, 5], 0)', '2', '零元素和窗口被清空的边界。']],
    [['双层循环为什么不是 O(n²)？', '内层循环的 left 全程最多移动 n 次，而非每个 right 都从头开始。'], ['负数有什么反例？', '[5,-4]、上限 1：看见 5 时删掉它会错过长度 2 的合法区间。']],
    '窗口和用变量增减维护，避免每一轮 sum(a[left:right+1])。');
  add('k13', '找边界比找某个相等值更通用：答案是第一个不小于 x 的位置，也可能在数组末尾之后。',
    ['令 [left,right) 为尚未分类的区间，初始 [0,n)。left 左侧都 < x，right 及右侧都 ≥ x。', '若 a[mid] < x，left=mid+1；否则 right=mid。区间严格缩小，最后 left 即边界。'],
    'left 左侧全小于 x，right 右侧（含 right）全不小于 x。', `def lower_bound(a, x):
    left, right = 0, len(a)
    while left < right:
        mid = (left + right) // 2
        if a[mid] < x:
            left = mid + 1
        else:
            right = mid
    return left

if __name__ == "__main__":
    print(lower_bound([1, 3, 3, 7], 3))`, 'n 为已排序数组长度，时间 O(log(n+1))，额外空间 O(1)，不含排序成本。',
    [['lower_bound([1, 3, 3, 7], 3)', '1', '返回重复值第一次出现的位置。'], ['lower_bound([], 5)', '0', '空数组的插入位置也是 0。']],
    [['返回下标后就能认定 x 存在吗？', '不能，还需 i < len(a) 且 a[i] == x；边界可能等于 n 或指向更大值。'], ['为何不能 left=mid？', '当 right=left+1 且中点落在 left 时，区间不会缩小，可能死循环。']],
    '实际代码可用 bisect_left；先理解不变量，再用库函数减少边界错误。');
  add('k14', '把最优值问题转成一个单调判断：切割高度越高，得到的木材越少。',
    ['判定 cut 是否可行：sum(max(0,h-cut)) ≥ need。可行高度构成从 0 开始的前缀。', '先判断总木材够不够。维护 lo 可行、hi 不可行的边界；本例 hi=max_height+1 是搜索域外哨兵，need=0 时最高合法高度仍是 max_height。'],
    '答案始终落在 [lo,hi)；lo 是已验证可行值，hi 是不可选边界。', `def highest_cut(heights, need):
    if need < 0 or any(h < 0 for h in heights):
        raise ValueError("高度和需求非负")
    if sum(heights) < need:
        return None
    lo, hi = 0, max(heights, default=0) + 1
    while lo + 1 < hi:
        mid = (lo + hi) // 2
        wood = sum(max(0, h - mid) for h in heights)
        if wood >= need:
            lo = mid
        else:
            hi = mid
    return lo

if __name__ == "__main__":
    print(highest_cut([4, 7], 3))`, 'n 为树木数，H 为最大高度，时间 O(n log(H+2))，额外空间 O(1)。',
    [['highest_cut([4, 7], 3)', '4', '高度 4 可行，高度 5 不可行。'], ['highest_cut([4, 7], 12)', 'None', '需求大于总量，必须显式判无解。']],
    [['需求为 0 返回什么？', '按本例搜索域为 0..最高树高，返回最高树高；题面允许更大切高时要重新定义答案范围。'], ['二分用了 O(log H) 次，所以总时间也是这个量吗？', '不是，每次判定扫描 n 棵树，总时间要乘 n。']],
    '生成器 sum 避免建立中间列表；若循环开销成为瓶颈，先实测，不牺牲单调性与边界正确性。');
  add('k15', '想选最多个互不重叠区间，先选结束最早者给后续留下最多空间。',
    ['限定每个区间 start < end，端点相接允许，按结束时间升序排序。', '设最优解首段为 A，贪心首段为 G；G 结束不晚于 A，用 G 替换 A 后其余段仍可选，数量不变。对子问题重复论证。'],
    '已选区间不重叠，并存在一个包含当前贪心前缀的最优解。', `def max_intervals(intervals):
    if any(l >= r for l, r in intervals):
        raise ValueError("区间长度应为正")
    end = None
    count = 0
    for l, r in sorted(intervals, key=lambda pair: pair[1]):
        if end is None or l >= end:
            count += 1
            end = r
    return count

if __name__ == "__main__":
    print(max_intervals([(0, 10), (1, 2), (2, 3)]))`, 'n 为区间数，排序 O(n log n)，扫描 O(n)，额外空间 O(n)。',
    [['max_intervals([(0, 10), (1, 2), (2, 3)])', '2', '最早开始的长区间并不最优。'], ['max_intervals([(-5, -3), (-3, -1)])', '2', '负坐标与端点相接。']],
    [['如果端点相接不允许？', '选择条件改为 l > end，证明需对应新的兼容条件。'], ['若每段有不同收益，还成立吗？', '不成立，最多数量与最大收益是不同目标，后者常用排序加动态规划。']],
    '用 None 表示尚未选区间，避免 end=-1 误伤负坐标。');
  add('k16', '回溯把一个解拆成逐层决策；路径描述已经做的选择，撤销保证兄弟分支互不污染。',
    ['排列 1..n，path 保存前缀，used 记录已经使用的数。', '枚举未使用数字，标记并加入；递归返回后弹出并解除标记。深度 n 时保存路径副本。'],
    '进入每层时 path 中元素不重复，used 与 path 恰好对应；返回时恢复进入前状态。', `def permutations(n):
    if n < 0:
        raise ValueError("n 非负")
    answer, path = [], []
    used = [False] * (n + 1)
    def dfs():
        if len(path) == n:
            answer.append(path[:])
            return
        for x in range(1, n + 1):
            if not used[x]:
                used[x] = True
                path.append(x)
                dfs()
                path.pop()
                used[x] = False
    dfs()
    return answer

if __name__ == "__main__":
    print(permutations(3))`, '输出 n! 个长度 n 的排列，时间 O(n·n!)，保存答案 O(n·n!)，搜索栈与标记 O(n)。',
    [['permutations(2)', '[[1, 2], [2, 1]]', '两个分支都被遍历。'], ['permutations(0)', '[[]]', '空集合有一个空排列。']],
    [['为何要 append(path[:])？', 'path 会继续被原地修改；保存同一列表引用会让所有答案随之变化。'], ['剪枝需要什么依据？', '必须证明该分支无法产生合法答案或无法改善目标，不能因为当前看起来差就丢弃。']],
    '递归深度与解数量分别限制规模；提高递归上限不能解决阶乘爆炸。');
  add('k17', '无权图每条边花费相同，队列按距离从近到远扩展，因此第一次发现一个点就是最短步数。',
    ['邻接表表示可走方向，dist 初始 -1 表示尚未发现，起点为 0。', '出队 u 后，将尚未发现的邻居 v 设为 dist[u]+1 并立即标记入队，避免重复入队。'],
    '队列中距离非递减；被首次赋值的距离已是最短边数。', `from collections import deque

def bfs(n, edges, source):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)  # 本例为有向图
    dist = [-1] * n
    dist[source] = 0
    queue = deque([source])
    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                queue.append(v)
    return dist

if __name__ == "__main__":
    print(bfs(4, [(0, 1), (1, 2)], 0))`, 'n 个点、m 条边，时间与空间 O(n+m)，要求 0 ≤ source < n 且边端点合法。',
    [['bfs(4, [(0, 1), (1, 2)], 0)', '[0, 1, 2, -1]', '不连通点保持 -1。'], ['bfs(1, [], 0)', '[0]', '起点到自己的距离为零。']],
    [['为何入队就标记？', '多个前驱可能同时发现同一点；出队才标记会产生大量重复项。'], ['不同边权还能直接用 BFS 吗？', '一般不能；第一次发现不一定最短，需根据权值选择 0-1 BFS、Dijkstra 等方法。']],
    '用 deque.popleft()，不要用 list.pop(0)，后者每次搬移剩余元素。');
  add('k18', '一个连通块就是从某个未访问格子能到达的全部格子；洪泛一次消耗一个完整分量。',
    ['本例 1 可走、0 不可走，只允许上下左右。逐格寻找未访问的 1。', '每找到一个就增加块数，并从它出发用显式栈标记所有可达格子。下一次启动搜索必然属于另一个块。'],
    '一次搜索结束后，起点所在的整个连通块都已标记，而且没有标记其他块。', `def components(grid):
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    seen, count = set(), 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != 1 or (r, c) in seen:
                continue
            count += 1
            stack = [(r, c)]
            seen.add((r, c))
            while stack:
                x, y = stack.pop()
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1 and (nx, ny) not in seen:
                        seen.add((nx, ny))
                        stack.append((nx, ny))
    return count

if __name__ == "__main__":
    print(components([[1, 0], [0, 1]]))`, '矩形网格 R 行 C 列，时间与额外空间 O(RC)。',
    [['components([[1, 0], [0, 1]])', '2', '对角相邻不属于四连通。'], ['components([])', '0', '空网格没有块。']],
    [['如何识别被包围的 0？', '从边界所有 0 多源搜索，能到达的是外部区域，剩余 0 才被包围。'], ['为什么不从每一个 1 都加一？', '同一块中的多个格子代表同一个分量，必须先查访问标记。']],
    '大型网格的坐标元组集合较耗内存，可用 bytearray 按 r*C+c 编号；显式栈避免长链递归深度问题。');
  add('k19', '只需要回答是否同组时，用代表元素维护集合，不必每次搜索整张图。',
    ['parent[x] 指向父节点，根满足 parent[root]=root；find 沿父指针找到代表。', '合并两个根时把小集合挂到大集合，find 途中缩短路径；已经同根就不重复合并。'],
    '两个点连通当且仅当 find 得到同一个根；父指针构成森林。', `class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]
        return True

def connected(n, edges, queries):
    dsu = DSU(n)
    for a, b in edges:
        dsu.union(a, b)
    return [dsu.find(a) == dsu.find(b) for a, b in queries]

if __name__ == "__main__":
    print(connected(3, [(0, 1)], [(0, 1), (0, 2)]))`, 'n 个点、m 次合并、q 次查询，初始化 O(n)，其余总计摊还 O((m+q)α(n))，空间 O(n)；端点在 0..n-1。',
    [['connected(3, [(0, 1)], [(0, 1), (0, 2)])', '[True, False]', '已连通与未连通。'], ['connected(1, [(0, 0)], [(0, 0)])', '[True]', '自环与同点查询。']],
    [['可以直接 parent[a]=b 吗？', '必须先找根；任意节点挂接可能破坏已有集合结构，甚至产生环。'], ['能直接支持删除边吗？', '本结构不能恢复拆开的历史连通关系，删除问题需要额外离线或可回滚等设计。']],
    '迭代 find 避免递归开销；α(n) 是反阿克曼函数，不能把摊还近常数误写为严格每次 O(1)。');
  add('k20', 'Dijkstra 每次确定当前最短的未确定点。非负边保证绕过更远的点不会反而让它变短。',
    ['dist[s]=0，其余为无穷；小根堆保存 (当前候选距离, 点)，邻接表保留每条有向边。', '弹出 (d,u)。若 d 不等于当前 dist[u]，这是更优候选替换前的旧记录，跳过。否则尝试每条边 u→v：若 d+w 更小就更新并入堆。', '证明：假设弹出的最小候选 u 仍存在更短路径，取该路径上第一个未确定点；其前驱已确定，松弛必会给出不大于该路径长度的候选，与 u 最小矛盾。非负边使路径前缀不会更长。', '例如 0→1 为 10，0→2 为 2，2→1 为 3：先发现距离 10，之后用 5 替换，堆中的 10 必须忽略。'],
    'dist 是已发现路径的最小长度上界；每次弹出的非过期最小候选在非负边条件下即为最终最短距离。', `from heapq import heappush, heappop

def dijkstra(n, edges, source):
    if not 0 <= source < n:
        raise ValueError("起点越界")
    graph = [[] for _ in range(n)]
    for u, v, weight in edges:
        if not (0 <= u < n and 0 <= v < n) or weight < 0:
            raise ValueError("端点合法且边权必须非负")
        graph[u].append((v, weight))
    dist = [float("inf")] * n
    dist[source] = 0
    heap = [(0, source)]
    while heap:
        d, u = heappop(heap)
        if d != dist[u]:
            continue
        for v, weight in graph[u]:
            candidate = d + weight
            if candidate < dist[v]:
                dist[v] = candidate
                heappush(heap, (candidate, v))
    return [None if d == float("inf") else d for d in dist]

if __name__ == "__main__":
    print(dijkstra(4, [(0, 1, 10), (0, 2, 2), (2, 1, 3)], 0))`,
    'n 个点、m 条有向边。允许重边的懒删除堆实现时间 O(n+m log(m+2))，图、距离和堆总空间 O(n+m)；简单图通常写 O((n+m) log n)。',
    [['dijkstra(4, [(0, 1, 10), (0, 2, 2), (2, 1, 3)], 0)', '[0, 5, 2, None]', '旧堆记录被替换，不可达点明确返回 None。'], ['dijkstra(2, [(0, 1, 5), (0, 1, 0), (1, 1, 0)], 0)', '[0, 0]', '重边、零边权和零自环不造成重复更新。']],
    [['为什么不能在第一次入堆时永久标记？', '第一次发现只是一个上界，后续可能经别的点得到更短路径；示例中 1 从 10 降为 5。'], ['负边为什么不适用？', '到更远点后再走负边可能使已确定点变短，确定顺序的证明失效；应重新选择算法并检查负环。'], ['题目是无向图要改哪里？', '每条输入边分别加入 u→v 与 v→u，两条边的权值相同。']],
    'heapq 没有原地 decrease-key；用新记录入堆和过期判断实现。图边用元组存储有对象开销，大规模要实测内存，不能仅凭复杂度认定可过。');
  add('k21', 'Floyd 按允许的中间点集合逐步放宽路径。它适合点数较少、需要任意两点最短路的情形。',
    ['d[i][i]=0，直接边取最小权值，无边为无穷；重复边不能盲目覆盖。', '第 k 轮允许路径内部经过 0..k。最短路径要么不经过 k，要么分成 i→k 和 k→j，两者取更小。', '因此 k 必须在最外层；读取的子路径只使用此前允许的中间点。对不存在的子路径跳过相加。', '负边可以存在，但若最后某个 d[i][i]<0，说明有负环；这时相关最短路没有有限最小值，本例直接报错。'],
    '完成第 k 轮后，d[i][j] 是内部顶点仅来自 0..k 的最短路径长度（无负环时）。', `def floyd(n, edges):
    inf = float("inf")
    dist = [[inf] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, weight in edges:
        if not (0 <= u < n and 0 <= v < n):
            raise ValueError("端点越界")
        dist[u][v] = min(dist[u][v], weight)
    for k in range(n):
        for i in range(n):
            if dist[i][k] == inf:
                continue
            for j in range(n):
                if dist[k][j] != inf:
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    if any(dist[i][i] < 0 for i in range(n)):
        raise ValueError("图中存在负环")
    return [[None if x == inf else x for x in row] for row in dist]

if __name__ == "__main__":
    print(floyd(3, [(0, 1, 4), (1, 2, -2), (0, 2, 9)]))`,
    'n 个点，初始化 O(n²+m)，三层循环 O(n³)，存储 O(n²)；Python 中应按真实 n 和时限实测。',
    [['floyd(3, [(0, 1, 4), (1, 2, -2), (0, 2, 9)])', '[[0, 4, 2], [None, 0, -2], [None, None, 0]]', '有负边但无负环，经过中间点改善距离。'], ['floyd(2, [])', '[[0, None], [None, 0]]', '没有边时只有自身距离为零。']],
    [['把 i 放在最外层会怎样？', '无法保证被使用的子路径已按允许中间点集合计算完成，一次扫描可能漏掉路径。'], ['如何选择 BFS、Dijkstra 与 Floyd？', '等权单源用 BFS；非负权单源常用 Dijkstra；小点数全源可用 Floyd。还要考虑密度、负权与查询数量。'], ['负环为何不是一个普通负数答案？', '可绕负环任意多次使路径长度不断降低，因此不存在有限最小值。']],
    '二维列表需逐行创建；三重循环瓶颈通常来自 n³，不要靠微调输入输出掩盖不合适的算法规模。');
  add('k22', '动态规划把共享的子问题只计算一次。先明确状态、转移、初值和答案，最后决定遍历顺序。',
    ['每次走 1 或 2 阶，ways[i] 表示恰好走到第 i 阶的方案数。', '最后一步来自 i-1 或 i-2，且两类互斥，所以相加。ways[0]=1 表示不走的唯一空方案。'],
    '计算 ways[i] 时，所有更小阶数的方案数已经正确。', `def stair_ways(n):
    if n < 0:
        return 0
    ways = [0] * (n + 1)
    ways[0] = 1
    for i in range(1, n + 1):
        ways[i] = ways[i - 1]
        if i >= 2:
            ways[i] += ways[i - 2]
    return ways[n]

if __name__ == "__main__":
    print(stair_ways(4))`, 'n 为阶数，按定长整数模型时间 O(n)、空间 O(n)；无取模时方案数位数随 n 增长，大整数计算额外增加成本。',
    [['stair_ways(4)', '5', '可按最后一步分类手算验证。'], ['stair_ways(0)', '1', '空方案是转移的起点。']],
    [['为什么两类可以相加？', '最后一步长度不可能同时为 1 和 2，分类互斥且覆盖所有方案。'], ['可以只保存两个数吗？', '可以，因为下一状态只依赖前两个状态；但需要输出全部中间结果时应保留数组。']],
    '计数题若要求模 M，应在转移时取模；不要使用浮点数保存巨大方案数。');
  add('k23', '0/1 背包每个物品最多使用一次；滚动数组必须保留“上一层”的含义。',
    ['dp[c] 表示只考虑已处理物品、总重量不超过 c 的最大价值，允许不选所以初值为 0。', '对物品 (w,v)，从大容量到小容量更新 dp[c]=max(dp[c],dp[c-w]+v)。倒序保证 dp[c-w] 尚未使用当前物品。'],
    '处理完第 i 个物品，dp[c] 恰好是前 i 件物品在容量 c 内的最优价值。', `def knapsack01(items, capacity):
    if capacity < 0 or any(w <= 0 for w, _ in items):
        raise ValueError("容量非负且重量为正")
    dp = [0] * (capacity + 1)
    for weight, value in items:
        for c in range(capacity, weight - 1, -1):
            dp[c] = max(dp[c], dp[c - weight] + value)
    return dp[capacity]

if __name__ == "__main__":
    print(knapsack01([(2, 3), (3, 4)], 4))`, 'n 为物品数，C 为容量，时间 O(nC)，空间 O(C)；这是依赖容量数值的伪多项式算法。',
    [['knapsack01([(2, 3), (3, 4)], 4)', '4', '重量 2 的物品不能选两次。'], ['knapsack01([(1, -5)], 0)', '0', '零容量且允许空选。']],
    [['改正序会怎样？', '较小容量刚用过当前物品，较大容量又读取它，变成允许重复选择。'], ['恰好装满能否全初始化为 0？', '不能，只令 dp[0]=0，其他状态为负无穷表示不可达，否则会把未装满状态当可行。']],
    '容量很大时先估算 n*C；不能因物品很少就认为二维枚举一定可行。');
  add('k24', '完全背包允许同一种物品重复选择，因此本轮更新后的状态可以继续使用。',
    ['沿用容量不超过 c 的最大价值状态，允许空选，初始化为 0。', '每种物品按容量从小到大更新；读取 dp[c-w] 时它可以已包含当前物品，于是自然表示多次使用。'],
    '当前物品处理到容量 c 时，dp[c] 包含使用当前物品任意有限次的最优方案。', `def unbounded_knapsack(items, capacity):
    if capacity < 0 or any(w <= 0 for w, _ in items):
        raise ValueError("容量非负且重量为正")
    dp = [0] * (capacity + 1)
    for weight, value in items:
        for c in range(weight, capacity + 1):
            dp[c] = max(dp[c], dp[c - weight] + value)
    return dp[capacity]

if __name__ == "__main__":
    print(unbounded_knapsack([(2, 3), (3, 4)], 4))`, 'n 为物品种数，C 为容量，时间 O(nC)，空间 O(C)。',
    [['unbounded_knapsack([(2, 3), (3, 4)], 4)', '6', '重量 2 的物品选两次。'], ['unbounded_knapsack([], 7)', '0', '没有物品，只能空选。']],
    [['重量为 0、价值为正为什么不能照算？', '可无限取用导致答案无穷，本例要求重量为正以排除这种模型。'], ['最大价值改成计数时能直接替换 max 吗？', '还要区分顺序是否算不同方案；物品外层通常数无序组合，容量外层可能数有序序列。']],
    '正序与倒序不是模板口诀，而是数据依赖选择；调试时用仅一件重量 2 价值 3、容量 4 检查差异。');
  add('k25', '子序列保留原位置顺序，可以跳过元素。状态以“结尾位置”区分未来可接哪些值。',
    ['dp[i] 是以 a[i] 结尾的最长严格上升子序列长度，单独选它至少为 1。', '遍历所有 j<i 且 a[j]<a[i]，尝试 dp[j]+1；最终答案是所有结尾中的最大值，不一定在末尾。'],
    '计算 dp[i] 时所有合法前驱已求出；转移同时保持下标和数值严格递增。', `def lis_length(a):
    dp = [1] * len(a)
    for i in range(len(a)):
        for j in range(i):
            if a[j] < a[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp, default=0)

if __name__ == "__main__":
    print(lis_length([3, 1, 2, 4]))`, 'n 为序列长度，时间 O(n²)，空间 O(n)。大规模可另学最小结尾数组加二分的 O(n log n) 方法。',
    [['lis_length([3, 1, 2, 4])', '3', '1、2、4 为合法非连续子序列。'], ['lis_length([2, 2, 2])', '1', '严格上升不能接相等元素。']],
    [['先排序原数组再求长度可以吗？', '不可以，排序改变原下标顺序，也就改变了可行解集合。'], ['如何恢复具体方案？', '在改善 dp[i] 时保存前驱 j，从最大 dp 对应的结尾沿前驱回溯并反转。']],
    '空数组要用 max(..., default=0) 或显式处理；不要让边界被 max([]) 异常掩盖。');
  add('k26', '二维位置不是关键，关键是依赖无环。本例只向右或向下，每个格子只依赖上方和左方。',
    ['dp[r][c] 为从左上到此格子的最大路径和，不可达初值设负无穷。', '先赋起点，再按行、列递增；从存在的上方和左方中取更优路径，再加当前格子。负数时不能拿 0 冒充不存在的路径。'],
    '计算一个格子时，所有合法前驱已经计算完；每个状态代表一条真实可达路径。', `def max_grid_path(grid):
    if not grid or not grid[0]:
        return None
    rows, cols = len(grid), len(grid[0])
    dp = [[float("-inf")] * cols for _ in range(rows)]
    dp[0][0] = grid[0][0]
    for r in range(rows):
        for c in range(cols):
            if r == c == 0:
                continue
            best = float("-inf")
            if r > 0:
                best = max(best, dp[r - 1][c])
            if c > 0:
                best = max(best, dp[r][c - 1])
            dp[r][c] = best + grid[r][c]
    return dp[-1][-1]

if __name__ == "__main__":
    print(max_grid_path([[1, 2], [3, 4]]))`, '矩形网格 R 行 C 列，时间与空间 O(RC)；只需最终值时可滚动为 O(C) 空间。',
    [['max_grid_path([[1, 2], [3, 4]])', '8', '下、右比右、下更优。'], ['max_grid_path([[-5, -2]])', '-7', '负数路径不能从不存在的零收益位置重新开始。']],
    [['四个方向都能走还可这样遍历吗？', '不可以，可能出现环。若要求严格降高，可按高度排序建立无环顺序，否则需要另行建模。'], ['滚动数组时 dp[c] 与 dp[c-1] 分别是什么？', '更新前 dp[c] 是上一行的上方，更新后的 dp[c-1] 是当前行左方。']],
    '大网格可滚动存储；如果题目需要还原路径，还要保留决策或用其他恢复策略。');
  add('k27', '相邻石子合并的最后一步必定把整个区间拆成左右两段。倒着看最后一步，可以避免枚举完整合并顺序。',
    ['定义 dp[l][r] 为把闭区间 l..r 合成一堆的最小代价；单堆不需合并，所以 dp[i][i]=0。', '最后一次分界在 k：左段 l..k、右段 k+1..r 分别已合并，再付整个区间重量。转移为 min(dp[l][k]+dp[k+1][r])+sum(l..r)。', '用前缀和 O(1) 计算重量；按区间长度从 2 到 n 枚举，保证两段严格更短且已计算。', '本例只求线性最小代价。环形需复制数组为两倍长度，只计算长度 ≤ n 的窗口，再在 n 个起点取最小；最大代价是另一个状态目标。'],
    '处理长度 length 的区间前，所有更短区间的最优代价都已确定；每种最后分界都被考虑。', `def merge_cost(weights):
    if any(x < 0 for x in weights):
        raise ValueError("石子重量非负")
    n = len(weights)
    if n == 0:
        return 0
    prefix = [0]
    for x in weights:
        prefix.append(prefix[-1] + x)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n + 1):
        for left in range(n - length + 1):
            right = left + length - 1
            total = prefix[right + 1] - prefix[left]
            best = float("inf")
            for split in range(left, right):
                candidate = dp[left][split] + dp[split + 1][right] + total
                best = min(best, candidate)
            dp[left][right] = best
    return dp[0][n - 1]

if __name__ == "__main__":
    print(merge_cost([2, 3, 4]))`, 'n 为堆数，长度、起点、分界三层共 O(n³)，表空间 O(n²)。前缀和避免每次再扫描区间。',
    [['merge_cost([2, 3, 4])', '14', '先合 2、3 得 5，再合 4 得 9，总计 14。'], ['merge_cost([7])', '0', '一堆已经完成，不应付重量 7。']],
    [['为什么不能总合并最小的相邻两堆？', '局部便宜不保证后续累计代价最小；如 [4,3,3,4]，先合中间得到 30，分两边合得到 28。'], ['为什么 split 不包含 right？', '左右两段必须非空，split=right 会让右段越界且不再严格缩短。'], ['为什么不能按 left、right 任意顺序填表？', '转移读取的子区间可能还未求出，初始 0 就会被误当作有效最优值。']],
    '二维 Python 整数表较耗内存，n³ 也很快不可承受；先核实题目规模，不把这个基础实现宣称为所有规模的最优方案。');
  add('k28', '共同整除关系在取余后保持不变；因数总是成对出现，试除只需到当前剩余数的平方根。',
    ['gcd(a,b)=gcd(b,a%b)，当 b=0 时结束；零和负数可先取绝对值。', '分解正整数 n：对每个 d 连续除尽并计指数。循环后若剩余 n>1，它是一个尚未记录的质因子。'],
    '已记录质因子乘积乘当前剩余 n 恒等于原数；已试过的因子不会再整除剩余数。', `def gcd(a, b):
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a

def factorize(n):
    if n < 1:
        raise ValueError("只分解正整数")
    factors, d = [], 2
    while d * d <= n:
        power = 0
        while n % d == 0:
            n //= d
            power += 1
        if power:
            factors.append((d, power))
        d += 1
    if n > 1:
        factors.append((n, 1))
    return factors

if __name__ == "__main__":
    print(gcd(8, 12), factorize(84))`, '欧几里得余数迭代次数 O(log(max(|a|,|b|)+1))；试除最坏 O(√N) 次候选，N 为原正整数，按定长运算估算。',
    [['factorize(84)', '[(2, 2), (3, 1), (7, 1)]', '最后剩余大质因子 7 也要记录。'], ['(gcd(0, -12), factorize(1))', '(12, [])', '零参与 gcd，1 没有质因子。']],
    [['为什么共同约数整除余数？', 'a=q*b+r，若 d 整除 a、b 就整除 r；反向同样成立。'], ['为什么用 d*d<=n？', '避免浮点平方根舍入误差；随着 n 被除小还可提前停止。']],
    '求 lcm 用 a // gcd(a,b) * b 并处理零，不使用 /；若只要 gcd 可优先用 math.gcd。');
  add('k29', '筛法把逐个判断质数改成批量排除合数；模运算控制计数大小但必须遵守代数条件。',
    ['将 0、1 排除。若 p 尚未标为合数，则 p 是质数，标记从 p² 开始的倍数。', '小于 p² 的 p 的倍数已有更小质因子处理。加法与乘法可边算边取模；除法需要逆元且并非总存在。'],
    '处理到 p 时，所有含有更小质因子的合数已被划掉，未划掉的 p 因此为质数。', `def primes_up_to(n):
    if n < 2:
        return []
    prime = bytearray([1]) * (n + 1)
    prime[0] = prime[1] = 0
    p = 2
    while p * p <= n:
        if prime[p]:
            for multiple in range(p * p, n + 1, p):
                prime[multiple] = 0
        p += 1
    return [x for x in range(2, n + 1) if prime[x]]

if __name__ == "__main__":
    print(primes_up_to(10))
    print(pow(2, 10, 1000))`, '上界 n，埃氏筛时间 O(n log log n)，标记空间 O(n)，结果列表另占 O(质数个数)。',
    [['primes_up_to(10)', '[2, 3, 5, 7]', '含平方数 4、9 的普通范围。'], ['primes_up_to(1)', '[]', '1 不是质数，也不应访问不存在的下标。']],
    [['为什么不是从 2p 开始？', '从 2p 也正确，但重复处理已由更小质因子覆盖的倍数。'], ['(a//b)%m 等于 (a%m)//(b%m) 吗？', '一般不等，例如 a=8,b=2,m=5：左边 4，右边 1；模意义除法须满足逆元条件。']],
    'bytearray 每个标记占一个字节，比布尔列表紧凑；pow(a,b,m) 可做快速模幂，避免先构造 a**b。');
  add('k31', '前缀和修改后要更新很多位置。树状数组把前缀拆成少量固定区间，让更新和查询都只经过 O(log n) 个节点。',
    ['采用 1 下标，lowbit(i)=i&-i，tree[i] 存区间 [i-lowbit(i)+1,i] 的和。例如 tree[6] 覆盖 [5,6]，tree[4] 覆盖 [1,4]。', '查询前 i 项时先取 tree[i]，令 i-=lowbit(i)，不断取互不相交、首尾衔接的块。查询 6 就取 [5,6] 与 [1,4]。', '单点 i 增加 delta 时令 i+=lowbit(i)，依次更新所有包含该位置的上层块；从 3 开始经过 3、4、8。', '区间 [l,r] 用 prefix(r)-prefix(l-1)。本例更新是增加量而非赋值；赋值需先计算新旧差。离散化另把原值映射到排序后的 1 下标，保留顺序与相等，不保留距离。'],
    '每个 tree[i] 始终等于自身 lowbit 区间的总和；查询选取的块恰好组成前缀且互不重叠。', `class Fenwick:
    def __init__(self, n):
        if n < 0:
            raise ValueError("长度非负")
        self.n = n
        self.tree = [0] * (n + 1)

    def add(self, index, delta):
        if not 1 <= index <= self.n:
            raise ValueError("更新下标必须从 1 开始")
        while index <= self.n:
            self.tree[index] += delta
            index += index & -index

    def prefix(self, index):
        if not 0 <= index <= self.n:
            raise ValueError("前缀下标越界")
        answer = 0
        while index > 0:
            answer += self.tree[index]
            index -= index & -index
        return answer

    def range_sum(self, left, right):
        if not 1 <= left <= right <= self.n:
            raise ValueError("查询为 1 下标闭区间")
        return self.prefix(right) - self.prefix(left - 1)

def fenwick_demo(values, index, delta, left, right):
    bit = Fenwick(len(values))
    for i, x in enumerate(values, 1):
        bit.add(i, x)
    bit.add(index, delta)
    return bit.range_sum(left, right)

def compress(values):
    rank = {v: i + 1 for i, v in enumerate(sorted(set(values)))}
    return [rank[v] for v in values]

if __name__ == "__main__":
    print(fenwick_demo([1, 2, 3, 4], 3, 5, 2, 4))
    print(compress([100, 5000, 100]))`,
    'n 为长度，本例逐项构建 O(n log n)，每次更新/查询 O(log(n+1))，存储 O(n)。离散化 n 个值需 O(n log n) 时间与 O(n) 空间。',
    [['fenwick_demo([1, 2, 3, 4], 3, 5, 2, 4)', '14', '第 3 项从 3 增至 8，查询 2+8+4。'], ['fenwick_demo([7], 1, -7, 1, 1)', '0', '单元素、负增量与完整区间。'], ['compress([100, 5000, 100])', '[1, 2, 1]', '重复值映射到同一排名。']],
    [['更新下标为 0 为什么危险？', 'lowbit(0)=0，index+=0 不会前进；本例直接拒绝非法下标。'], ['把 100、5000 映射到 1、2 后，差值能用 1 吗？', '不能，离散化只保持相对大小，原距离仍为 4900。'], ['求小于 x 的数量应查询哪个排名？', '对已离散化的 x 查询 rank[x]-1，并按需使用二分处理尚未出现在坐标表中的阈值。']],
    '索引规则统一为 1 下标；不要直接复制 0 下标输入。计数常用树状数组，区间最小值等不同运算不能直接照搬前缀相减。');
  add('k32', '单调栈保留还没等到答案的位置。更大的新值到来时，恰好给栈顶较小值提供右侧第一个更大位置。',
    ['从左到右处理，栈保存下标，对应值保持非递增。', '新值 x 大于栈顶值时反复弹出并记录答案为当前下标；随后把当前下标压入。相等值不能给严格更大问题作答案。'],
    '栈中每个位置在已扫描范围内尚无严格更大元素；被弹出时当前值就是其第一个更大值。', `def next_greater(a):
    answer = [-1] * len(a)
    stack = []
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            answer[stack.pop()] = i
        stack.append(i)
    return answer

if __name__ == "__main__":
    print(next_greater([2, 1, 3]))`, 'n 为元素数，每个下标进出栈最多一次，时间 O(n)，空间 O(n)。答案采用 0 下标，-1 表示不存在。',
    [['next_greater([2, 1, 3])', '[2, 2, -1]', '一个新元素解决多个候选。'], ['next_greater([2, 2])', '[-1, -1]', '相等不算严格更大。']],
    [['为什么存下标而不只存值？', '需要把答案写回每个原位置；相同值也可能有不同位置。'], ['右侧第一个更大与右侧最大值相同吗？', '不同，前者要求位置最近而非数值最大，例如 [1,2,9] 中 1 的答案是 2 所在位置。']],
    '百万级整数列表和下标栈可能占大量内存；先用小规模验证，再在目标规模测峰值内存，不把大题作为首次理解的唯一验收。');
  add('k33', '滑动窗口最大值只需保留“还没过期且没被更晚更大的值支配”的候选。',
    ['队列保存下标，队首先删除不在窗口内的位置。', '新值到来时从队尾删去小于等于它的旧值：新值更大或相等、过期更晚，旧值永远不会再优于它。队首就是当前最大值。'],
    '队列下标递增、值严格递减，所有下标都在当前窗口内。', `from collections import deque

def window_max(a, size):
    if not 1 <= size <= len(a):
        raise ValueError("窗口长度必须在 1..n")
    queue, answer = deque(), []
    for i, x in enumerate(a):
        while queue and queue[0] <= i - size:
            queue.popleft()
        while queue and a[queue[-1]] <= x:
            queue.pop()
        queue.append(i)
        if i >= size - 1:
            answer.append(a[queue[0]])
    return answer

if __name__ == "__main__":
    print(window_max([1, 3, 2], 2))`, 'n 为数组长度，k 为窗口长度，时间 O(n)，队列空间 O(k)，结果空间 O(n-k+1)。',
    [['window_max([1, 3, 2], 2)', '[3, 3]', '值 3 支配 1，但不被 2 支配。'], ['window_max([2, 2], 1)', '[2, 2]', '每次旧下标先过期。']],
    [['只保持值单调够了吗？', '不够，过期的最大值可能仍在队首，必须按下标删除。'], ['相等时保留较晚者为什么安全？', '两者值相同，新者在后续窗口中存活更久，旧者没有优势。']],
    'deque 支持两端 O(1) 操作；输出很多窗口答案时按需批量拼接，避免同时维护多份大字符串。');
  add('k34', '集合相同但停留位置不同，下一步成本可能不同，所以访问全部点的最短路径需要“已访问集合＋终点”两个维度。',
    ['本例给完整有向非负距离矩阵，从点 0 出发，访问每点恰好一次，不要求返回起点。dp[mask][last] 表示访问集合 mask、停在 last 的最小花费。', '初始只访问 0：dp[1][0]=0，其余无穷。对不在 mask 内的 nxt，用 dist[last][nxt] 扩展到 dp[mask|(1<<nxt)][nxt]。', '加一位后新 mask 的数值严格增加，因此按 mask 从小到大即可保证来源已计算。不可达状态跳过；不把 last 不在集合中的状态当合法。', '答案为满集合对应行的最小值；若要求回到起点，应在末尾分别加 dist[last][0] 再取最小，不能直接复用本例答案。'],
    '每个有限状态都对应从 0 出发、恰好访问 mask 中各点一次并终止于 last 的路径；相同状态只保留成本最小者。', `def visit_all(dist):
    n = len(dist)
    if n == 0:
        return 0
    if any(len(row) != n for row in dist) or any(x < 0 for row in dist for x in row):
        raise ValueError("需要完整非负距离方阵")
    total = 1 << n
    dp = [[float("inf")] * n for _ in range(total)]
    dp[1][0] = 0
    for mask in range(1, total):
        if not mask & 1:
            continue
        for last in range(n):
            current = dp[mask][last]
            if current == float("inf"):
                continue
            for nxt in range(n):
                bit = 1 << nxt
                if not mask & bit:
                    new_mask = mask | bit
                    candidate = current + dist[last][nxt]
                    if candidate < dp[new_mask][nxt]:
                        dp[new_mask][nxt] = candidate
    return min(dp[total - 1])

if __name__ == "__main__":
    print(visit_all([[0, 2, 9], [2, 0, 3], [9, 3, 0]]))`,
    'n 为点数，状态 2^n·n，转移 O(2^n n²)，空间 O(2^n n)。n 每增加 1，指数部分约翻倍；此教学实现只面向小 n。',
    [['visit_all([[0, 2, 9], [2, 0, 3], [9, 3, 0]])', '5', '路径 0→1→2，未计返回 0。'], ['visit_all([[0]])', '0', '只有起点，不需走边。']],
    [['为什么不能只存 dp[mask]？', '未来转移距离依赖停留点，丢掉 last 会合并未来行为不同的状态，不能保证最优。'], ['加入元素为什么用 | 而不是 ^？', '| 是幂等地设为 1；^ 会翻转，若已存在就会删除。虽然本例已检查未访问，语义上 | 更清楚。'], ['n=20 是否一定能在 Python 里承受？', '不一定，约 2097 万个状态槽，还包括行对象、数值对象和指数转移；必须按时限内存实测或压缩表示。']],
    '初学先用 n≤8 的全排列暴力对拍；不要在浏览器复制运行时直接把 n 改成 20，先估算状态和循环量。');
  add('k35', '把区间和转成两个前缀之差，再用哈希计数匹配；优化后用独立暴力在小数据上寻找反例。',
    ['若当前前缀和为 prefix，要求区间和 target，就需要此前前缀等于 prefix-target。', '先累计匹配数，再登记当前前缀；否则 target=0 时会意外计算空区间。初始 {0:1} 让从第一项开始的区间也能被统计。', '暴力按每个左端累加右端，复杂度 O(n²)。用固定随机种子生成含负数、零和重复值的小数组，对比两种结果；对拍是测试，不替代证明。'],
    '处理第 i 项之前，seen 只包含更早的前缀，所有被计数区间都非空且恰好以当前项结尾。', `def count_subarrays(a, target):
    seen, prefix, answer = {0: 1}, 0, 0
    for x in a:
        prefix += x
        answer += seen.get(prefix - target, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return answer

def brute_subarrays(a, target):
    answer = 0
    for left in range(len(a)):
        total = 0
        for right in range(left, len(a)):
            total += a[right]
            if total == target:
                answer += 1
    return answer

if __name__ == "__main__":
    import random
    rng = random.Random(2026)
    for _ in range(200):
        a = [rng.randint(-3, 3) for _ in range(rng.randint(0, 8))]
        target = rng.randint(-4, 4)
        assert count_subarrays(a, target) == brute_subarrays(a, target), (a, target)
    print(count_subarrays([1, 2, 1], 3))`,
    'n 为长度，优化算法平均时间 O(n)、空间 O(n)；暴力时间 O(n²)、额外空间 O(1)。',
    [['count_subarrays([1, 2, 1], 3)', '2', '两段不同下标区间都计入。'], ['count_subarrays([0, 0], 0)', '3', '两个单点和一个全区间，不计空区间。']],
    [['有负数为什么仍成立？', '前缀相减恒等式不依赖正负，哈希不使用滑动窗口的单调性。'], ['对拍 200 次通过算证明吗？', '不算，只说明这些用例一致；还要证明每个合法区间恰好计数一次。']],
    '固定随机种子方便复现。发现不一致后先保存输入并缩小反例，不要仅增加随机次数碰运气。');
  add('k40', '树上相邻节点不能同时选时，父节点只需知道孩子“选或不选”两种结果。树结构保证不同孩子子树之间没有额外边。',
    ['先把无向树以 0 为根，得到 parent 和从父到子的访问顺序。反转顺序即可先处理孩子，避免深链递归。', 'take[u] 为必须选 u 的子树最大收益，初值 value[u]；skip[u] 为不选 u 的最大收益，初值 0。', '每个孩子 v：选 u 就只能加 skip[v]；不选 u 可以加 max(take[v],skip[v])。孩子子树相互独立，所以收益相加。', '根的答案取两状态最大值；允许空选，因此所有权值为负时答案为 0。若题目要求至少选一个，初始化和状态需要改变。'],
    '倒序处理到 u 时，所有孩子的两种状态已正确；take 与 skip 始终保留父节点决策所需的完整信息。', `def tree_independent_set(values, edges):
    n = len(values)
    if n == 0:
        if edges:
            raise ValueError("空树不能有边")
        return 0
    if len(edges) != n - 1:
        raise ValueError("需要一棵树")
    graph = [[] for _ in range(n)]
    for u, v in edges:
        if not (0 <= u < n and 0 <= v < n):
            raise ValueError("端点越界")
        graph[u].append(v)
        graph[v].append(u)
    parent = [-2] * n
    parent[0] = -1
    order = [0]
    for u in order:
        for v in graph[u]:
            if v == parent[u]:
                continue
            if parent[v] != -2:
                raise ValueError("输入含环或重边")
            parent[v] = u
            order.append(v)
    if len(order) != n:
        raise ValueError("输入不连通")
    take, skip = values[:], [0] * n
    for u in reversed(order):
        for v in graph[u]:
            if parent[v] == u:
                take[u] += skip[v]
                skip[u] += max(take[v], skip[v])
    return max(take[0], skip[0])

if __name__ == "__main__":
    print(tree_independent_set([5, 4, 4], [(0, 1), (0, 2)]))`,
    'n 为树节点数，树有 n-1 条边，建树和转移均 O(n)，存储 O(n)。本实现避免 O(n) 深递归调用栈。',
    [['tree_independent_set([5, 4, 4], [(0, 1), (0, 2)])', '8', '不选根，可以同时选两个孩子。'], ['tree_independent_set([-3], [])', '0', '单节点负权，允许空选。']],
    [['每个子树只存一个最大值为何不够？', '父节点选中时必须知道孩子不选的结果，子树无约束最大值可能选择了孩子。'], ['为什么一般有环图不能照搬？', '不同子树可能被跨边连接，独立相加会漏掉约束；树的分离性质是转移成立的前提。'], ['遍历顺序为什么需要倒转？', '构造时父先于子，倒序后子先于父，符合 DP 的依赖方向。']],
    '显式 order 和 parent 在链形树上同样可运行；不要只用星形三节点样例检验递归深度和状态顺序。');
  add('k41', '线段树把数组分成左右区间，父节点保存可由孩子合并的信息。本例实现单点赋值与半开区间求和。',
    ['将底层叶子数量补到不小于 n 的最小二次幂，未使用叶子补 0；从叶子向上求和完成建树。', '单点赋值先改叶子，再逐层重新合并祖先，两侧未受影响的节点保持不变。', '查询 [l,r) 时把边界移到叶层：l 是右孩子则它整段属于答案，取出后 l++；r 是右边界且为奇数，则 --r 后取出其左邻段。然后两端同时上移。', '这些区间互不重叠且覆盖原查询范围；边界相遇结束。0 是加法单位元，因此空区间答案 0。改成其他运算必须检查结合律与单位元，不能随便替换。'],
    '每个内部节点始终等于两个孩子之和；查询已收集区间与尚待处理区间互不重叠，其并集始终是原区间。', `class SegmentTree:
    def __init__(self, values):
        self.n = len(values)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [0] * (2 * self.size)
        for i, x in enumerate(values):
            self.tree[self.size + i] = x
        for p in range(self.size - 1, 0, -1):
            self.tree[p] = self.tree[p * 2] + self.tree[p * 2 + 1]

    def set_value(self, index, value):
        if not 0 <= index < self.n:
            raise ValueError("修改下标越界")
        p = self.size + index
        self.tree[p] = value
        p //= 2
        while p:
            self.tree[p] = self.tree[p * 2] + self.tree[p * 2 + 1]
            p //= 2

    def query(self, left, right):
        if not 0 <= left <= right <= self.n:
            raise ValueError("查询采用 0 下标半开区间")
        left += self.size
        right += self.size
        answer = 0
        while left < right:
            if left & 1:
                answer += self.tree[left]
                left += 1
            if right & 1:
                right -= 1
                answer += self.tree[right]
            left //= 2
            right //= 2
        return answer

def segment_demo(values, index, value, left, right):
    tree = SegmentTree(values)
    tree.set_value(index, value)
    return tree.query(left, right)

if __name__ == "__main__":
    print(segment_demo([1, 2, 3, 4], 2, 8, 0, 4))`,
    'n 为数组长度，建树 O(n)，每次单点赋值和区间查询 O(log(n+1))，空间 O(n)；空数组只允许空区间查询。',
    [['segment_demo([1, 2, 3, 4], 2, 8, 0, 4)', '15', '第 3 项赋值为 8，祖先和同步更新。'], ['segment_demo([5], 0, -2, 0, 1)', '-2', '单元素、负值与完整范围。'], ['SegmentTree([]).query(0, 0)', '0', '空区间采用加法单位元。']],
    [['这是单点增加还是单点赋值？', 'set_value 是赋值；若需要增加 delta，应先维护原值或查询该单点再加 delta。'], ['区间加能否只给对应节点的和加一次？', '不够，区间和应增加 delta×区间长度，且未来子区间查询需要传播延迟信息；这属于另行学习的懒标记。'], ['什么时候树状数组更合适？', '只有单点加和区间和时，树状数组更简洁；线段树适用于更一般可结合的区间信息。']],
    '迭代实现省去递归栈，补齐叶子占用不到约 4n 个槽。此代码没有懒标记，不是区间加模板题的完整答案。');
  window.LQ_LESSONS = lessons;
})();
