(function (root) {
  'use strict';
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  function insertion(values) {
    check(Array.isArray(values) && values.length > 0 && values.length <= 12 && values.every(Number.isFinite), '请输入 1～12 个有限数字。');
    const a = values.slice(), states = [];
    const add = (message, line, active = -1, sorted = 1) => states.push({ array: a.slice(), message, line, active, sorted });
    add('第一个元素单独构成有序区间。', 0);
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      add('取出 ' + key + '，向左寻找插入位置。', 1, i, i);
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        add(a[j] + ' 比 ' + key + ' 大，向右移动一格。', 3, j + 1, i);
        j--;
      }
      a[j + 1] = key;
      add('把 ' + key + ' 放入位置 ' + (j + 1) + '，有序区间扩展。', 5, j + 1, i + 1);
    }
    add('排序完成。时间复杂度 O(n²)，额外空间 O(1)。', 5, -1, a.length);
    return states;
  }
  function binary(values, target) {
    check(Array.isArray(values) && values.length <= 12 && values.every(Number.isFinite) && Number.isFinite(target), '请输入至多 12 个有限数字和有效目标值。');
    check(values.every((v, i) => i === 0 || values[i - 1] <= v), '二分查找要求数组按非降序排列，请先调整数组。');
    let lo = 0, hi = values.length; const states = [];
    const add = (message, line, mid = -1) => states.push({ array: values.slice(), lo, hi, mid, target, message, line, answer: null });
    add('在半开区间 [0, ' + hi + ') 中寻找第一个 ≥ ' + target + ' 的位置。', 0);
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      add('检查下标 ' + mid + '，值为 ' + values[mid] + '。', 2, mid);
      if (values[mid] >= target) { hi = mid; add('该值满足条件，继续向左找；hi = ' + hi + '。', 4, mid); }
      else { lo = mid + 1; add('该值过小，排除它及左侧；lo = ' + lo + '。', 6, mid); }
    }
    add(lo === values.length ? '返回 n = ' + lo + '：不存在大于等于目标值的元素。' : '返回下标 ' + lo + '，对应值 ' + values[lo] + '。这不一定等于目标值。', 7);
    states[states.length - 1].answer = lo;
    return states;
  }
  function bfs(size, blocked, start, end) {
    check(Number.isInteger(size) && size > 0 && size <= 10, '网格大小无效。');
    const n = size * size, walls = new Set(blocked);
    check([start, end, ...walls].every(v => Number.isInteger(v) && v >= 0 && v < n), '网格位置无效。');
    check(!walls.has(start) && !walls.has(end), '起点和终点不能是障碍。');
    const queue = [start], seen = new Set([start]), parent = {}, distance = { [start]: 0 }, states = []; let head = 0;
    const pathTo = v => { const path = []; while (v !== undefined) { path.unshift(v); v = parent[v]; } return path; };
    const add = (message, line, current = -1, path = []) => states.push({ size, blocked: [...walls], start, end, current, visited: [...seen], queue: queue.slice(head), distance: { ...distance }, path, message, line });
    add('起点入队，距离为 0；每格只在首次发现时入队。', 0);
    while (head < queue.length) {
      const u = queue[head++]; add('取出格子 (' + Math.floor(u / size) + ', ' + u % size + ')，距离为 ' + distance[u] + '。', 2, u);
      if (u === end) { add('找到最短路径，共 ' + distance[u] + ' 步。', 3, u, pathTo(u)); return states; }
      const row = Math.floor(u / size), col = u % size;
      for (const [r, c] of [[row - 1, col], [row, col + 1], [row + 1, col], [row, col - 1]]) {
        const v = r * size + c;
        if (r < 0 || r >= size || c < 0 || c >= size || walls.has(v) || seen.has(v)) continue;
        seen.add(v); parent[v] = u; distance[v] = distance[u] + 1; queue.push(v);
        add('发现邻格 (' + r + ', ' + c + ')，距离为 ' + distance[v] + '，加入队尾。', 6, u);
      }
    }
    add('队列为空，终点不可达。', 7); return states;
  }
  function knapsack(items, capacity) {
    check(Number.isInteger(capacity) && capacity >= 0 && capacity <= 12, '容量必须是 0～12 的整数。');
    check(Array.isArray(items) && items.length > 0 && items.length <= 6 && items.every(x => Number.isInteger(x.weight) && x.weight > 0 && x.weight <= 30 && Number.isInteger(x.value) && x.value >= 0 && x.value <= 999), '请输入 1～6 件物品；重量为 1～30、价值为 0～999 的整数。');
    const dp = Array.from({ length: items.length + 1 }, () => Array(capacity + 1).fill(0)), states = [];
    const add = (message, line, i = 0, c = 0) => states.push({ items: items.map(x => ({ ...x })), capacity, dp: dp.map(row => row.slice()), i, c, message, line });
    add('dp[i][c] 表示只考虑前 i 件物品、容量不超过 c 时的最大价值。', 0);
    for (let i = 1; i <= items.length; i++) {
      const { weight, value } = items[i - 1];
      for (let c = 0; c <= capacity; c++) {
        dp[i][c] = dp[i - 1][c];
        if (weight <= c) {
          const take = dp[i - 1][c - weight] + value;
          dp[i][c] = Math.max(dp[i][c], take);
          add('物品 ' + i + '、容量 ' + c + '：不选得 ' + dp[i - 1][c] + '，选得 ' + take + '，取最大值 ' + dp[i][c] + '。', 5, i, c);
        } else add('物品 ' + i + ' 重量 ' + weight + ' 超过容量 ' + c + '，只能继承上一行：' + dp[i][c] + '。', 3, i, c);
      }
    }
    add('最优价值为 ' + dp[items.length][capacity] + '。每件物品至多选一次；一维优化必须倒序枚举容量。', 6, items.length, capacity);
    return states;
  }
  const algorithms = { insertion, binary, bfs, knapsack };
  let activeDestroy = null, activeMotion = null, motionEnabled = true;
  const snippets = {
    sort: ['for i in range(1, len(a)):', '    key, j = a[i], i - 1', '    while j >= 0 and a[j] > key:', '        a[j + 1] = a[j]', '        j -= 1', '    a[j + 1] = key'],
    binary: ['lo, hi = 0, len(a)', 'while lo < hi:', '    mid = (lo + hi) // 2', '    if a[mid] >= target:', '        hi = mid', '    else:', '        lo = mid + 1', 'return lo'],
    bfs: ['queue = deque([start]); seen = {start}', 'while queue:', '    u = queue.popleft()', '    if u == end: return distance[u]', '    for v in valid_neighbors(u):', '        if v not in seen:', '            seen.add(v); queue.append(v) # 距离 +1', 'return -1  # 无路径'],
    knapsack: ['dp = [[0] * (C + 1) for _ in range(n + 1)]', 'for i in range(1, n + 1):', '    for c in range(C + 1):', '        dp[i][c] = dp[i - 1][c]', '        if w[i - 1] <= c:', '            dp[i][c] = max(dp[i][c], dp[i-1][c-w[i-1]] + v[i-1])', 'return dp[n][C]']
  };
  function mount(host, kind) {
    if (activeDestroy) activeDestroy();
    check(host && host.ownerDocument && snippets[kind], '演示容器或类型无效。');
    const doc = host.ownerDocument, win = doc.defaultView;
    const reduced = win.matchMedia ? win.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    let timer = null, states = [], index = 0, dead = false;
    let walls = new Set([8, 14, 20, 26]), start = 0, end = 35;
    const el = (tag, text, cls) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = text; if (cls) node.className = cls; return node; };
    const shell = el('section', undefined, 'lq-demo'); host.replaceChildren(shell);
    const form = el('div', undefined, 'lq-demo-inputs'); shell.append(form);
    function field(name, value) {
      const label = el('label', name), input = el('input'); input.value = value; label.append(input); form.append(label); return input;
    }
    let arrayInput, targetInput, itemInput, capInput, mode;
    if (kind === 'sort' || kind === 'binary') arrayInput = field(kind === 'sort' ? '数组（空格或逗号分隔，最多 12 个）' : '非降序数组（空格或逗号分隔，可为空）', kind === 'sort' ? '5 2 4 1 3' : '1 3 3 5 8');
    if (kind === 'binary') targetInput = field('目标值', '3');
    if (kind === 'knapsack') { itemInput = field('物品：重量:价值（空格分隔，最多 6 件）', '2:3 3:4 4:5'); capInput = field('背包容量（0～12）', '6'); capInput.type = 'number'; capInput.min = '0'; capInput.max = '12'; }
    if (kind === 'bfs') {
      const label = el('label', '点击网格操作'); mode = el('select');
      [['wall', '切换障碍'], ['start', '设置起点'], ['end', '设置终点']].forEach(([value, text]) => { const option = el('option', text); option.value = value; mode.append(option); });
      label.append(mode); form.append(label);
      shell.append(el('p', 'S 为起点，E 为终点；可设为同一格。点击网格会重新开始推演。', 'lq-demo-hint'));
    }
    const error = el('p', '', 'lq-demo-error'); error.setAttribute('role', 'alert'); shell.append(error);
    const bar = el('div', undefined, 'lq-demo-controls');
    const play = el('button', '播放'), next = el('button', '下一步'), reset = el('button', '应用输入 / 重置');
    [play, next, reset].forEach(b => { b.type = 'button'; bar.append(b); }); shell.append(bar);
    const count = el('span', '', 'lq-demo-count'); bar.append(count);
    const motionHint = el('p', '动画已关闭：使用“下一步”查看推演。', 'lq-demo-hint'); shell.append(motionHint);
    const view = el('div', undefined, 'lq-demo-view'), status = el('p', '', 'lq-demo-status'), code = el('pre', undefined, 'lq-demo-code');
    status.setAttribute('aria-live', 'polite'); shell.append(view, status, code);
    const lines = snippets[kind].map(text => { const line = el('span', text, 'lq-demo-code-line'); code.append(line); return line; });
    function stop() { if (timer !== null) win.clearInterval(timer); timer = null; play.textContent = '播放'; }
    function render() {
      if (dead || !states.length) return;
      const s = states[index]; view.replaceChildren(); status.textContent = s.message;
      count.textContent = (index + 1) + ' / ' + states.length; next.disabled = index === states.length - 1; play.disabled = !motionEnabled || reduced.matches || next.disabled;
      motionHint.hidden = motionEnabled && !reduced.matches;
      motionHint.textContent = reduced.matches ? '已遵循减少动态效果设置：使用“下一步”查看推演。' : '动画已关闭：使用“下一步”查看推演。';
      lines.forEach((node, i) => node.classList.toggle('is-current', i === s.line));
      if (kind === 'sort' || kind === 'binary') {
        const row = el('div', undefined, 'lq-demo-array');
        s.array.forEach((value, i) => {
          const cell = el('div', undefined, 'lq-demo-cell'); cell.append(el('strong', String(value)), el('small', '[' + i + ']'));
          cell.classList.toggle('is-active', i === s.active || i === s.mid);
          cell.classList.toggle('is-done', kind === 'sort' ? i < s.sorted : s.answer === i);
          cell.classList.toggle('is-muted', kind === 'binary' && s.answer === null && (i < s.lo || i >= s.hi)); row.append(cell);
        }); view.append(row);
        if (kind === 'binary') view.append(el('p', '当前区间 [' + s.lo + ', ' + s.hi + ') · n = ' + s.array.length + ' · 下标从 0 开始', 'lq-demo-hint'));
        if (kind === 'sort') view.append(el('p', '绿色边框：本步操作位置；浅绿背景：已处理的有序前缀。移动过程中可能暂时出现重复值，取出的 key 保存在变量中。', 'lq-demo-hint'));
      } else if (kind === 'bfs') {
        const grid = el('div', undefined, 'lq-demo-grid'); grid.setAttribute('aria-label', '6 行 6 列 BFS 网格');
        for (let i = 0; i < 36; i++) {
          const isWall = walls.has(i), label = i === start && i === end ? 'S/E' : i === start ? 'S' : i === end ? 'E' : isWall ? '■' : s.distance[i] === undefined ? '·' : String(s.distance[i]);
          const cell = el('button', label, 'lq-demo-grid-cell'); cell.type = 'button';
          cell.setAttribute('aria-label', '第 ' + (Math.floor(i / 6) + 1) + ' 行第 ' + (i % 6 + 1) + ' 列，' + (isWall ? '障碍' : i === start && i === end ? '起点和终点' : i === start ? '起点' : i === end ? '终点' : '可通行'));
          cell.classList.toggle('is-wall', isWall); cell.classList.toggle('is-visited', s.visited.includes(i)); cell.classList.toggle('is-path', s.path.includes(i)); cell.classList.toggle('is-active', i === s.current);
          cell.addEventListener('click', () => {
            if (mode.value === 'start') { start = i; walls.delete(i); }
            else if (mode.value === 'end') { end = i; walls.delete(i); }
            else if (i !== start && i !== end) { if (walls.has(i)) walls.delete(i); else walls.add(i); }
            build();
          }); grid.append(cell);
        }
        view.append(grid, el('p', '队列（队首在左）：' + (s.queue.map(i => '(' + Math.floor(i / 6) + ',' + i % 6 + ')').join(' → ') || '空'), 'lq-demo-hint'));
      } else {
        const table = el('table', undefined, 'lq-demo-table');
        const caption = el('caption', '行：考虑的物品数 i；列：容量 c；单元格：最大价值。'); table.append(caption);
        const head = el('thead'), header = el('tr'); header.append(el('th', 'i / c'));
        for (let c = 0; c <= s.capacity; c++) { const th = el('th', String(c)); th.scope = 'col'; header.append(th); } head.append(header); table.append(head);
        const body = el('tbody'); s.dp.forEach((row, i) => { const tr = el('tr'), th = el('th', String(i)); th.scope = 'row'; tr.append(th); row.forEach((value, c) => { const td = el('td', String(value)); td.classList.toggle('is-active', s.i === i && s.c === c); td.classList.toggle('is-muted', i > s.i || i === s.i && c > s.c); tr.append(td); }); body.append(tr); }); table.append(body); view.append(table);
      }
    }
    function parseArray(value) { const trimmed = value.trim(); return trimmed ? trimmed.split(/[\s,，]+/).filter(Boolean).map(Number) : []; }
    function build() {
      stop(); error.textContent = '';
      try {
        if (kind === 'sort') states = insertion(parseArray(arrayInput.value));
        else if (kind === 'binary') { check(targetInput.value.trim() !== '', '请填写目标值。'); states = binary(parseArray(arrayInput.value), Number(targetInput.value)); }
        else if (kind === 'bfs') states = bfs(6, walls, start, end);
        else {
          check(capInput.value.trim() !== '', '请填写容量。');
          const pieces = itemInput.value.trim().split(/\s+/);
          const items = pieces.map(piece => { check(/^\d+[:：]\d+$/.test(piece), '物品格式示例：2:3 3:4（重量:价值）。'); const [weight, value] = piece.split(/[:：]/).map(Number); return { weight, value }; });
          states = knapsack(items, Number(capInput.value));
        }
        index = 0; render();
      } catch (e) { states = []; view.replaceChildren(); status.textContent = ''; count.textContent = ''; lines.forEach(line => line.classList.remove('is-current')); error.textContent = e.message; next.disabled = true; play.disabled = true; }
    }
    next.addEventListener('click', () => { stop(); if (index < states.length - 1) { index++; render(); } });
    reset.addEventListener('click', build);
    play.addEventListener('click', () => {
      if (timer !== null) { stop(); return; }
      if (!motionEnabled || reduced.matches || !states.length) return;
      play.textContent = '暂停'; timer = win.setInterval(() => { if (index < states.length - 1) { index++; render(); } if (index >= states.length - 1) stop(); }, 650);
    });
    const onVisibility = () => { if (doc.hidden) stop(); };
    const onMotion = () => { if (!motionEnabled || reduced.matches) stop(); render(); };
    activeMotion = onMotion;
    doc.addEventListener('visibilitychange', onVisibility);
    if (reduced.addEventListener) reduced.addEventListener('change', onMotion);
    build();
    activeDestroy = () => { if (dead) return; stop(); dead = true; doc.removeEventListener('visibilitychange', onVisibility); if (reduced.removeEventListener) reduced.removeEventListener('change', onMotion); shell.remove(); activeDestroy = null; activeMotion = null; };
    return activeDestroy;
  }
  const api = { algorithms, mount, setMotion: enabled => { motionEnabled = Boolean(enabled); if (activeMotion) activeMotion(); }, destroy: () => { if (activeDestroy) activeDestroy(); } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.LQDemos = api;
})(typeof window !== 'undefined' ? window : null);
