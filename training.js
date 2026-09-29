/* 本站原创混合题；标签与解答只在主动展开答案后显示。 */
window.LQ_TRAINING = [
  {
    "id": "m01",
    "title": "收支核对",
    "prompt": "按时间记录 n 笔净收支，收入为正、支出为负。求有多少个非空连续时间段的净收支恰好为 target。不同起止位置计作不同时间段。",
    "input": "第一行 n target；第二行 n 个整数。",
    "output": "一个整数，表示符合要求的时间段数。",
    "sampleInput": "5 3\n1 2 -1 1 2",
    "sampleOutput": "3",
    "constraints": "1≤n≤200000，|a[i]|≤10^9，|target|≤10^14。",
    "hint": "把一段的和写成两个前缀的差；允许负数，所以普通非负滑动窗口的单调性不成立。",
    "solution": "import sys\nn, target = map(int, sys.stdin.buffer.readline().split())\na = list(map(int, sys.stdin.buffer.readline().split()))\nseen = {0: 1}\nprefix = answer = 0\nfor x in a:\n    prefix += x\n    answer += seen.get(prefix - target, 0)\n    seen[prefix] = seen.get(prefix, 0) + 1\nprint(answer)",
    "topics": [
      "k05",
      "k10",
      "k35"
    ],
    "difficulty": "基础组合",
    "explanation": "在当前前缀 p 之前出现的 p-target 各对应一个合法非空子段，先查询再登记当前前缀。每个子段按右端点唯一计入。平均 O(n) 时间，O(n) 空间。样例三段为 [1,2]、[1,4]、[4,5]（1-based）。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m02",
    "title": "活动排班",
    "prompt": "n 天最初没有工作量。每项活动在闭区间 [l,r] 的每一天增加 v 单位工作量。所有活动确定后，找连续 k 天的最大总工作量。",
    "input": "第一行 n m k；接下来 m 行 l r v。",
    "output": "最大总工作量。",
    "sampleInput": "5 2 2\n1 3 2\n3 5 1",
    "sampleOutput": "5",
    "constraints": "1≤n≤200000，0≤m≤200000，1≤k≤n，1≤l≤r≤n，0≤v≤10^9。",
    "hint": "修改是批量给出的，先还原每天工作量，再移动固定长度的窗口。",
    "solution": "import sys\nread = sys.stdin.buffer.readline\nn, m, k = map(int, read().split())\nd = [0] * (n + 2)\nfor _ in range(m):\n    l, r, v = map(int, read().split())\n    d[l] += v; d[r+1] -= v\nload = [0] * n\ncurrent = 0\nfor i in range(n):\n    current += d[i+1]\n    load[i] = current\nwindow = sum(load[:k])\nanswer = window\nfor i in range(k, n):\n    window += load[i] - load[i-k]\n    answer = max(answer, window)\nprint(answer)",
    "topics": [
      "k11",
      "k12"
    ],
    "difficulty": "基础组合",
    "explanation": "区间增加只改变两个差分边界；还原后窗口每次增加右端、减去离开左端。所有长度 k 的窗口各访问一次，O(n+m) 时间、O(n) 空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m03",
    "title": "仓库通道",
    "prompt": "仓库由 .（可通行）和 #（障碍）组成。从左上角走到右下角，每步上下左右移动一格，求最短步数和最短路径条数。起点或终点为障碍时无法到达。",
    "input": "第一行 n m；随后 n 行长度为 m 的网格。",
    "output": "可达时输出最短步数及路径数 mod 1000000007；不可达输出 -1 0。",
    "sampleInput": "2 3\n...\n...",
    "sampleOutput": "3 3",
    "constraints": "1≤n,m≤400。不同经过格子序列算不同路径。",
    "hint": "先确定一个格子最短距离；来自上一层的每个前驱都可以贡献最短路径条数。",
    "solution": "from collections import deque\nn, m = map(int, input().split())\ng = [input().strip() for _ in range(n)]\nif g[0][0] == '#' or g[-1][-1] == '#':\n    print(-1, 0)\nelse:\n    dist = [[-1] * m for _ in range(n)]\n    ways = [[0] * m for _ in range(n)]\n    dist[0][0] = 0; ways[0][0] = 1\n    q = deque([(0, 0)])\n    while q:\n        x, y = q.popleft()\n        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n            a, b = x+dx, y+dy\n            if not (0 <= a < n and 0 <= b < m) or g[a][b] == '#':\n                continue\n            if dist[a][b] == -1:\n                dist[a][b] = dist[x][y] + 1\n                q.append((a, b))\n            if dist[a][b] == dist[x][y] + 1:\n                ways[a][b] = (ways[a][b] + ways[x][y]) % 1000000007\n    print(dist[-1][-1], ways[-1][-1])",
    "topics": [
      "k17",
      "k18",
      "k22"
    ],
    "difficulty": "搜索迁移",
    "explanation": "队列按距离非降处理；每个点只入队一次，但可以累计多个前驱的贡献。只累计 dist[v]=dist[u]+1 的边，既不计绕路也不产生循环依赖。O(nm) 时间与空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m04",
    "title": "培训名额",
    "prompt": "n 门课程各有费用与收益，每门至多选一次。预算最多 B，必须恰好选择 K 门，求最大总收益。收益允许为负。",
    "input": "第一行 n B K；后面 n 行 cost gain。",
    "output": "若存在方案输出最大收益，否则输出 IMPOSSIBLE。",
    "sampleInput": "3 5 2\n2 3\n3 5\n4 9",
    "sampleOutput": "8",
    "constraints": "1≤n≤100，0≤B≤2000，0≤K≤min(n,20)，1≤cost≤2000，|gain|≤10^6。",
    "hint": "仅保存费用不足以知道选了多少门；不可达状态与收益 0 是两种不同情况。",
    "solution": "n, budget, k = map(int, input().split())\ndp = [[None] * (budget + 1) for _ in range(k + 1)]\ndp[0][0] = 0\nfor _ in range(n):\n    cost, gain = map(int, input().split())\n    for used in range(k, 0, -1):\n        for money in range(budget, cost-1, -1):\n            previous = dp[used-1][money-cost]\n            if previous is not None:\n                candidate = previous + gain\n                if dp[used][money] is None or candidate > dp[used][money]:\n                    dp[used][money] = candidate\nvalues = [v for v in dp[k] if v is not None]\nprint(max(values) if values else 'IMPOSSIBLE')",
    "topics": [
      "k23",
      "k53"
    ],
    "difficulty": "状态设计",
    "explanation": "dp[j][c] 表示恰好 j 门且恰好花 c 的最优收益；初始只有 dp[0][0]=0。倒序保护上一件物品的状态。最终在所有 c≤B 的 dp[K][c] 取最大。O(nKB) 时间、O(KB) 空间，接近上界应实测运行成本。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m05",
    "title": "双人技能队",
    "prompt": "每个人用两个 0/1 标记表示是否会 Python、是否会 SQL。选择两个不同的人组队，使团队中至少一人会 Python 且至少一人会 SQL。顺序不计。",
    "input": "第一行 n；随后 n 行 p s。",
    "output": "合法双人队数量。",
    "sampleInput": "4\n1 0\n0 1\n1 1\n0 0",
    "sampleOutput": "4",
    "constraints": "1≤n≤200000，p,s∈{0,1}。",
    "hint": "从全部无序人对里排除缺 Python 和缺 SQL 的队伍；两项都缺的人对被减了几次？",
    "solution": "import sys\nread = sys.stdin.buffer.readline\nn = int(read())\nno_python = no_sql = neither = 0\nfor _ in range(n):\n    p, s = map(int, read().split())\n    no_python += p == 0\n    no_sql += s == 0\n    neither += p == 0 and s == 0\ndef choose2(x):\n    return x * (x-1) // 2\nprint(choose2(n) - choose2(no_python) - choose2(no_sql) + choose2(neither))",
    "topics": [
      "k48",
      "k05"
    ],
    "difficulty": "计数迁移",
    "explanation": "缺某技能意味着两人都没有该技能；两种不合格条件的交集是两人两项都不会。用容斥从总数减去不合格，O(n) 时间、O(1) 额外空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m06",
    "title": "旧路与新桥",
    "prompt": "n 个村庄已有 k 条免费道路，另有 m 条可选新桥，每座有非负费用。求让全部村庄连通的最少新增费用。",
    "input": "首行 n k m；随后 k 行 u v；再随后 m 行 u v cost。所有道路无向，可有重边或自环。",
    "output": "最少新增费用；无法连通输出 IMPOSSIBLE。",
    "sampleInput": "4 1 4\n1 2\n2 3 5\n1 3 2\n3 4 3\n2 4 10",
    "sampleOutput": "5",
    "constraints": "1≤n≤100000，0≤k,m≤200000，0≤cost≤10^9。",
    "hint": "先把已有道路连通的点缩成分量，再考虑收费连接。不要把已有道路条数当成已成功合并次数。",
    "solution": "import sys\nread = sys.stdin.buffer.readline\nn, k, m = map(int, read().split())\np = list(range(n)); size = [1] * n\ncomponents = n\ndef find(x):\n    while x != p[x]:\n        p[x] = p[p[x]]; x = p[x]\n    return x\ndef union(u, v):\n    a, b = find(u), find(v)\n    if a == b:\n        return False\n    if size[a] < size[b]:\n        a, b = b, a\n    p[b] = a; size[a] += size[b]\n    return True\nfor _ in range(k):\n    u, v = map(int, read().split())\n    components -= union(u-1, v-1)\nedges = []\nfor _ in range(m):\n    u, v, cost = map(int, read().split())\n    edges.append((cost, u-1, v-1))\nanswer = 0\nfor cost, u, v in sorted(edges):\n    if union(u, v):\n        components -= 1; answer += cost\nprint(answer if components == 1 else 'IMPOSSIBLE')",
    "topics": [
      "k19",
      "k51"
    ],
    "difficulty": "图建模",
    "explanation": "已有道路内部无需额外花费。按费用考虑跨分量桥梁，最小跨边可由交换论证安全加入。只在成功合并时减少分量数；O(m log m+(n+k+m)α(n)) 时间，O(n+m) 空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m07",
    "title": "项目交付日",
    "prompt": "n 项任务各有正工期。若存在 u→v，v 必须等 u 完工后才能开始。可无限并行，时间从 0 开始。求全部任务最早完成时间；依赖有环则不可能完成。",
    "input": "第一行 n m；第二行 n 个工期；后面 m 行 u v，无重边。",
    "output": "最早完成时间；有环输出 IMPOSSIBLE。",
    "sampleInput": "4 4\n2 3 5 4\n1 2\n1 3\n2 4\n3 4",
    "sampleOutput": "11",
    "constraints": "1≤n≤100000，0≤m≤200000，1≤duration≤10^9。",
    "hint": "一个任务要等最晚完成的前驱，而不是等待所有前驱工期之和。没有前驱的任务在时间 0 同时开始。",
    "solution": "from collections import deque\nimport sys\nread = sys.stdin.buffer.readline\nn, m = map(int, read().split())\nduration = list(map(int, read().split()))\ng = [[] for _ in range(n)]; deg = [0] * n\nfor _ in range(m):\n    u, v = map(int, read().split())\n    u -= 1; v -= 1\n    g[u].append(v); deg[v] += 1\nfinish = duration[:]\nq = deque(i for i in range(n) if deg[i] == 0)\nprocessed = 0\nwhile q:\n    u = q.popleft(); processed += 1\n    for v in g[u]:\n        finish[v] = max(finish[v], finish[u] + duration[v])\n        deg[v] -= 1\n        if deg[v] == 0:\n            q.append(v)\nprint(max(finish) if processed == n else 'IMPOSSIBLE')",
    "topics": [
      "k50",
      "k26"
    ],
    "difficulty": "依赖建模",
    "explanation": "拓扑出队时所有前驱的最早完工时间已经确定，取最大后加自身工期，给出满足全部依赖的最早可行时间。并行不增加额外等待。O(n+m) 时间与空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  },
  {
    "id": "m08",
    "title": "温室热度",
    "prompt": "n×m 网格初始温度均为 0。u 次操作给矩形内每格增加 v（允许降温），所有修改完成后回答 q 次矩形温度总和查询。",
    "input": "第一行 n m u q；随后 u 行 x1 y1 x2 y2 v；再随后 q 行 x1 y1 x2 y2。坐标为 1-based 闭区间。",
    "output": "每个查询输出一行总温度。",
    "sampleInput": "2 3 2 2\n1 1 2 2 3\n2 2 2 3 -1\n1 1 2 3\n2 2 2 3",
    "sampleOutput": "10\n1",
    "constraints": "1≤n,m≤400，0≤u≤100000，1≤q≤100000，矩形合法，|v|≤10^6。",
    "hint": "先用四角差分恢复最终网格，再对最终值建立二维前缀；一份数组能否在两次累计后代表不同含义？",
    "solution": "import sys\nread = sys.stdin.buffer.readline\nn, m, u, q = map(int, read().split())\nd = [[0] * (m+2) for _ in range(n+2)]\nfor _ in range(u):\n    x1, y1, x2, y2, v = map(int, read().split())\n    d[x1][y1] += v; d[x2+1][y1] -= v\n    d[x1][y2+1] -= v; d[x2+1][y2+1] += v\nfor i in range(1, n+1):\n    for j in range(1, m+1):\n        d[i][j] += d[i-1][j] + d[i][j-1] - d[i-1][j-1]\n# 第一遍得到最终温度，第二遍得到温度的二维前缀。\nfor i in range(1, n+1):\n    for j in range(1, m+1):\n        d[i][j] += d[i-1][j] + d[i][j-1] - d[i-1][j-1]\nfor _ in range(q):\n    x1, y1, x2, y2 = map(int, read().split())\n    print(d[x2][y2] - d[x1-1][y2] - d[x2][y1-1] + d[x1-1][y1-1])",
    "topics": [
      "k49",
      "k11",
      "k10"
    ],
    "difficulty": "二维组合",
    "explanation": "四角更新在还原时只覆盖目标矩形；第一次二维累计把差分变成温度，第二次把温度变成前缀和。两个阶段必须各自完整结束后再开始下一阶段。O(nm+u+q) 时间，O(nm) 空间。",
    "origin": "本站原创教学题；不计作蓝桥杯真题或获奖水平证明"
  }
];
