const assert = require('node:assert/strict');
const demos = require('../demos.js');
const { algorithms: a } = demos;
const last = array => array[array.length - 1];
let tests = 0;
function test(name, fn) { fn(); tests++; console.log('✓ ' + name); }
test('插入排序支持负数和重复值且不修改输入', () => { const input = [3, -1, 3, 0, -9]; assert.deepEqual(last(a.insertion(input)).array, [-9, -1, 0, 3, 3]); assert.deepEqual(input, [3, -1, 3, 0, -9]); });
test('插入排序单元素与非法数据', () => { assert.deepEqual(last(a.insertion([1])).array, [1]); assert.throws(() => a.insertion([])); assert.throws(() => a.insertion([NaN])); });
test('二分返回第一个满足条件的位置', () => { assert.equal(last(a.binary([1, 3, 3, 8], 3)).answer, 1); assert.equal(last(a.binary([1, 3, 3, 8], 4)).answer, 3); assert.equal(last(a.binary([1, 3, 3, 8], 9)).answer, 4); assert.equal(last(a.binary([1, 3], -1)).answer, 0); assert.equal(last(a.binary([], 3)).answer, 0); assert.throws(() => a.binary([3, 1], 2)); });
test('BFS最短路径、不可达和起终点相同', () => { const s = last(a.bfs(3, [], 0, 8)); assert.equal(s.distance[8], 4); assert.equal(s.path.length, 5); assert.equal(s.path[0], 0); assert.equal(s.path.at(-1), 8); assert.equal(last(a.bfs(3, [1, 3], 0, 8)).path.length, 0); assert.deepEqual(last(a.bfs(3, [], 4, 4)).path, [4]); assert.throws(() => a.bfs(3, [0], 0, 8)); });
test('BFS遍历不重复、相邻路径合法', () => { for (const s of a.bfs(4, [5, 6, 9], 0, 15)) { assert.equal(s.visited.length, new Set(s.visited).size); for (let i = 1; i < s.path.length; i++) { const u = s.path[i - 1], v = s.path[i]; assert.equal(Math.abs(Math.floor(u / 4) - Math.floor(v / 4)) + Math.abs(u % 4 - v % 4), 1); } } });
test('背包最优值、容量0和放不下', () => { const items = [{ weight: 2, value: 3 }, { weight: 3, value: 4 }, { weight: 4, value: 5 }]; assert.equal(last(a.knapsack(items, 6)).dp[3][6], 8); assert.equal(last(a.knapsack(items, 0)).dp[3][0], 0); assert.equal(last(a.knapsack([{ weight: 4, value: 7 }], 3)).dp[1][3], 0); assert.equal(last(a.knapsack([{ weight: 2, value: 3 }], 6)).dp[1][6], 3); });
test('背包与枚举子集独立对拍', () => { for (let seed = 1; seed <= 30; seed++) { const items = Array.from({ length: 5 }, (_, i) => ({ weight: 1 + ((seed * (i + 3)) % 6), value: ((seed + 3) * (i + 1)) % 13 })); for (let cap = 0; cap <= 12; cap++) { let expected = 0; for (let mask = 0; mask < (1 << items.length); mask++) { let weight = 0, value = 0; items.forEach((item, i) => { if (mask & (1 << i)) { weight += item.weight; value += item.value; } }); if (weight <= cap) expected = Math.max(expected, value); } assert.equal(last(a.knapsack(items, cap)).dp[items.length][cap], expected); } } });
test('二分与线性查找独立对拍', () => { for (let seed = 0; seed < 20; seed++) { const arr = Array.from({ length: seed % 13 }, (_, i) => Math.floor(i / 2) - 3); for (let target = -5; target <= 8; target++) { const index = arr.findIndex(v => v >= target); assert.equal(last(a.binary(arr, target)).answer, index < 0 ? arr.length : index); } } });
test('全局动画开关停止定时器，保留单步，与系统偏好共同约束', () => {
  const nodes = [], timers = new Set();
  const media = { matches: false, addEventListener() {}, removeEventListener() {} };
  const doc = {
    defaultView: { matchMedia: () => media, setInterval(fn) { timers.add(fn); return fn; }, clearInterval(fn) { timers.delete(fn); } },
    addEventListener() {}, removeEventListener() {},
    createElement(tag) {
      const node = { tag, ownerDocument: doc, children: [], events: {}, classList: { toggle() {}, remove() {} },
        append(...children) { this.children.push(...children); }, replaceChildren(...children) { this.children = children; },
        setAttribute() {}, addEventListener(name, callback) { this.events[name] = callback; }, remove() {} };
      nodes.push(node); return node;
    }
  };
  demos.setMotion(true); demos.mount(doc.createElement('div'), 'binary');
  const play = nodes.find(n => n.tag === 'button' && n.textContent === '播放');
  const next = nodes.find(n => n.tag === 'button' && n.textContent === '下一步');
  assert.equal(play.disabled, false); play.events.click(); assert.equal(timers.size, 1);
  demos.setMotion(false); assert.equal(timers.size, 0); assert.equal(play.disabled, true); assert.equal(next.disabled, false);
  next.events.click(); assert.equal(next.disabled, false); assert.equal(play.disabled, true);
  demos.setMotion(true); assert.equal(play.disabled, false);
  media.matches = true; demos.setMotion(true); assert.equal(play.disabled, true);
  media.matches = false; demos.setMotion(true); play.events.click(); assert.equal(timers.size, 1);
  demos.destroy(); assert.equal(timers.size, 0);
  demos.setMotion(false); nodes.length = 0; demos.mount(doc.createElement('div'), 'sort');
  assert.equal(nodes.find(n => n.tag === 'button' && n.textContent === '播放').disabled, true);
  demos.destroy(); demos.setMotion(true);
});
console.log(tests + ' 组演示测试通过。');
