/* 章节与题面于 2026-09-29 核对；链接核对不代表在外部 OJ 完成 Python 提交。 */
(() => {
  const topics = window.LQ_CURRICULUM.weeks.flatMap(w => w.topics);
  const py = 'https://docs.python.org/zh-cn/3/';
  const oi = 'https://oi-wiki.org/';
  const reading = {};
  const source = (id, title, url, task) => {
    (reading[id] ||= []).push({title, url, task, checkedAt:'2026-09-29'});
  };
  source('k01','Python 官方教程 · 数字与运算',py+'tutorial/introduction.html','阅读“数字”，分别手算并运行 /、//、% 的结果，说明为何竞赛整数运算不应先转浮点数。');
  source('k01','Python 官方文档 · 内置函数',py+'builtins/functions.html','只查 input、int、print 三项；写出读入、类型转换、计算、输出的完整链条。');
  source('k02','Python 官方教程 · 控制流',py+'tutorial/controlflow.html','阅读 if、for、range 和 break；为同一段循环写出每一步变量值与退出条件。');
  source('k03','Python 官方教程 · 数据结构',py+'tutorial/datastructures.html','阅读列表方法，比较 sort 的原地修改与 sorted 的返回值；检查空列表和单元素边界。');
  source('k04','Python 官方教程 · 文本与切片',py+'tutorial/introduction.html','阅读“文本”中的索引、切片与不可变性；说明单词序号为什么不等于原文字符位置。');
  source('k05','Python 官方教程 · 集合与字典',py+'tutorial/datastructures.html','阅读集合与字典两节；分别保存是否出现和出现次数，解释丢失重复次数的后果。');
  source('k06','Python 官方教程 · 定义函数',py+'tutorial/controlflow.html','阅读“定义函数”，练习 return 与 print 的区别；将邻格计算写成接收矩阵并返回新矩阵的函数。');
  source('k06','Python 官方教程 · 嵌套列表推导式',py+'tutorial/datastructures.html','阅读嵌套列表推导式；分别创建独立行与重复引用的行，通过修改一个格子解释两者差异。');
  source('k07','Python 官方教程 · 错误和异常',py+'tutorial/errors.html','先阅读语法错误与异常；把自己的错误分为语法、运行和逻辑错误，保存能复现它的最小输入。');
  source('k08','OI Wiki · 枚举',oi+'basic/enumerate/','阅读枚举对象和优化枚举的讨论；说明候选为什么不漏不重，再估算检查次数。');
  source('k09','Python 官方文档 · 排序的技术',py+'howto/sorting.html','阅读 key、多字段排序与稳定性；对分数降序、耗时升序、同键保留原序分别构造样例。');
  source('k10','OI Wiki · 前缀和与差分',oi+'basic/prefix-sum/','只读一维前缀和部分；手推含首元素、末元素与单元素的区间公式，暂不读高维扩展。');
  source('k11','OI Wiki · 前缀和与差分',oi+'basic/prefix-sum/','阅读差分部分；画出闭区间增加时的两个端点修改，并解释为什么要预留 r+1。');
  source('k12','OI Wiki · 双指针',oi+'misc/two-pointer/','分别阅读相向与同向指针；证明指针移动不丢解，再给含负数的窗口求和构造反例。');
  source('k13','OI Wiki · 二分',oi+'basic/binary/','先阅读有序序列二分；选定一种区间约定，推导等于目标、目标不存在与全相等时的边界。');
  source('k14','OI Wiki · 二分',oi+'basic/binary/','阅读二分答案相关内容；先写可行性判断与单调性证明，再决定查找第一个真还是最后一个真。');
  source('k15','OI Wiki · 贪心',oi+'basic/greedy/','阅读正确性论证与反例；用相邻交换解释自己的选择规则，不能仅以“看起来最优”代替证明。');
  source('k16','OI Wiki · DFS',oi+'search/dfs/','阅读搜索树与回溯过程；画出一次选择和撤销，写清状态、终止条件以及每条剪枝的依据。');
  source('k17','OI Wiki · BFS',oi+'search/bfs/','阅读队列展开过程；手推各距离层，解释入队时标记以及为什么该证明需要等权边。');
  source('k18','OI Wiki · BFS',oi+'search/bfs/','将每个格子视为状态，写出合法邻接条件；对边界外部区域搜索，区别可达区域与被包围区域。');
  source('k19','OI Wiki · 并查集',oi+'ds/dsu/','阅读查询、合并与路径压缩；手推 parent 的变化，说明比较原始父节点为何不足以判断连通。');
  source('k20','OI Wiki · 最短路：Dijkstra',oi+'graph/shortest-path/','只读 Dijkstra 的过程和正确性；解释非负权前提、松弛、过期堆条目，暂不扩展 Johnson。');
  source('k21','OI Wiki · 最短路：Floyd',oi+'graph/shortest-path/','阅读 Floyd 与算法比较；解释中转点必须在外层循环，并区分负边、负环、不可达。');
  source('k22','OI Wiki · 动态规划基础',oi+'dp/basic/','阅读状态与转移的推导；对新题逐项写出状态含义、初值、转移、计算顺序和最终答案。');
  source('k23','OI Wiki · 背包 DP',oi+'dp/knapsack/','只读 0/1 背包及一维优化；用一个物品手推正序与逆序更新，指出重复选取发生在哪里。');
  source('k24','OI Wiki · 背包 DP',oi+'dp/knapsack/','阅读完全背包，与 0/1 背包比较容量循环方向；解释当前层状态为什么可以再次参与转移。');
  source('k25','OI Wiki · 动态规划基础：子序列',oi+'dp/basic/','阅读最长公共子序列例子，比较子序列与连续子段；再对照本课的递增子序列状态，说明两种问题不能照搬同一个转移。');
  source('k25','Python 官方文档 · bisect',py+'library/bisect.html','先完成本课 O(n²) 实现，再读 bisect_left 和 bisect_right 的分区定义；用重复元素推导严格递增与不下降所需的边界。');
  source('k26','OI Wiki · DAG 上的 DP',oi+'dp/dag/','把网格中的合法转移画成有向边；说明无环依赖如何决定计算顺序，不能只凭网格形状套循环。');
  source('k27','OI Wiki · 区间 DP',oi+'dp/interval/','阅读区间状态与分割点枚举；从两堆、三堆推到一般递推，并解释按长度计算的原因。');
  source('k28','OI Wiki · 最大公约数',oi+'math/number-theory/gcd/','阅读欧几里得算法与最小公倍数；用整除关系证明一次取余不改变公约数集合。');
  source('k29','OI Wiki · 筛法',oi+'math/number-theory/sieve/','先读埃氏筛，解释从 p² 开始标记的原因；估算布尔容器与 Python 整数列表的不同成本。');
  source('k31','OI Wiki · 树状数组',oi+'ds/fenwick/','阅读 lowbit、单点修改与前缀查询；手推下标 6 的查询链和修改链，再说明离散化保留什么顺序。');
  source('k31','OI Wiki · 离散化',oi+'misc/discrete/','阅读把值映射到排名的过程；对重复的大整数手推去重排序与映射，解释为什么原数值距离不会被保留。');
  source('k32','OI Wiki · 单调栈（旧版章节）','https://next.oi-wiki.org/ds/monotonous-stack/','阅读单调栈的入栈、弹栈与基本应用；本链接为可访问旧版章节。用相等元素检查严格与非严格比较。');
  source('k33','OI Wiki · 单调队列',oi+'ds/monotonic-queue/','阅读滑动窗口分析；分别解释队首过期与队尾淘汰，证明每个下标只入队、出队有限次。');
  source('k34','OI Wiki · 状压 DP',oi+'dp/state/','阅读集合的二进制表达与状态转移；说明哪些信息由 mask 决定、哪些必须额外保存，先做小规模手推。');
  source('k35','OI Wiki · 常见技巧：对拍',oi+'contest/common-tricks/','只读“对拍”部分；分别编写独立的暴力基准、随机数据生成器与优化程序，固定种子并保存首个反例。');
  source('k40','OI Wiki · 树形 DP',oi+'dp/tree/','阅读树上状态合并；画出子节点先于父节点的依赖，并对选择或不选择根分别推导转移。');
  source('k41','OI Wiki · 线段树基础',oi+'ds/seg/','本课先读建树、单点修改与区间查询；手推不相交、完全覆盖、部分覆盖三种情况。懒标记是后续选学。');
  source('k48','OI Wiki · 排列组合',oi+'math/combinatorics/combination/','阅读排列与组合的区别；先判断是否计顺序，再用 n≤6 的枚举验证自己推导的计数。');
  source('k48','OI Wiki · 容斥原理',oi+'math/combinatorics/inclusion-exclusion-principle/','先读两个、三个集合的容斥；用重叠区域说明为何先加后减，暂不要求一般子集枚举实现。');
  source('k49','OI Wiki · 前缀和与差分',oi+'basic/prefix-sum/','阅读二维前缀和，再将差分思想推广到四个角；在 3×3 网格上同时核对矩形查询与增加。');
  source('k50','OI Wiki · 拓扑排序',oi+'graph/topo/','阅读 Kahn 算法；手动维护入度，解释处理点数不足时为什么存在环，再把顺序用于路径计数。');
  source('k50','OI Wiki · 图的存储',oi+'graph/save/','比较邻接矩阵与邻接表；把题意中的对象、方向、权值映射成点和边，估算稀疏图的存储量。');
  source('k51','OI Wiki · 最小生成树',oi+'graph/mst/','只读 Kruskal 及正确性；分别说明不能成环、为何可选当前跨分量最轻边，以及如何识别不连通。');
  source('k52','OI Wiki · 模逆元',oi+'math/number-theory/inverse/','阅读逆元存在条件和快速幂求法；检查素数模数与分母非零条件，构造无逆元的反例。');
  source('k52','OI Wiki · 排列组合',oi+'math/combinatorics/combination/','阅读组合数计算；区分整数除法与模下除法，说明阶乘逆元法为何要求当前做法中的 n 小于素数模数。');
  source('k53','OI Wiki · 背包 DP',oi+'dp/knapsack/','比较 0/1、完全与多重背包；为恰好装满建立不可达状态，并用小数据区分最大价值与方案计数。');

  const additions = {};
  const problem = (topicId,id,title,level,focus) => {
    (additions[topicId] ||= []).push({id,title,level,focus,url:'https://www.luogu.com.cn/problem/'+id,checkedAt:'2026-09-29'});
  };
  problem('k01','P1421','小玉买文具','独立验证','金额统一为角后计算；a≤10000、0≤b≤9。验证不足一支与刚好整除。');
  problem('k03','P1427','小鱼的数字游戏','独立验证','不超过100个数字，以唯一末尾0结束；区分反转顺序与排序，结束标志不输出。');
  problem('k04','P5015','[NOIP 2018 普及组] 标题统计','入门理解','标题长度不超过5；仅统计题目要求的字符，区别空格、换行和数字字符。');
  problem('k06','P5731','【深基5.习6】蛇形方阵','提高','n≤9；用独立二维行存状态，把方向更新封装成函数，注意每个数字的3字符输出宽度。');
  problem('k07','P1424','小鱼的航程（改进版）','90分钟诊断候选','n≤10^6，周末休息；考试开始后独立阅读题面，结束前不查看题解和评测反馈。');
  problem('k07','P1085','[NOIP 2004 普及组] 不高兴的津津','90分钟诊断候选','固定7天、每天两个小于10的非负整数；先独立理解题意并检查最终输出。');
  problem('k07','P1420','最长连号','90分钟诊断候选','n≤10^4、元素≤10^9；独立完成并保存测试用例与耗时，勿预先阅读解法。');
  problem('k07','P5719','【深基4.例3】分类平均','90分钟诊断候选','n≤10000、k≤100；两类均非空。开始前只统一复习小数位输出格式，不讨论本题解法。');
  problem('k07','P5722','【深基4.例11】数列求和','90分钟诊断候选','n≤100；遵守题面不能直接使用等差求和公式的要求，按实际独立完成情况记录。');
  problem('k08','P1980','[NOIP 2013 普及组] 计数问题','变式练习','n≤10^6；枚举数字并处理重复出现的数位，估算 O(n log n) 数位检查及字符串转换成本。');
  problem('k08','P1008','[NOIP 1998 普及组] 三连击','变式练习','固定1至9组成三个三位数，无输入；从比例减少枚举维数，解释所有候选为何不漏不重。');
  problem('k09','P1068','[NOIP 2009 普及组] 分数线划定','变式练习','n≤5000；排序键之外还要处理分数线同分扩招，不能只截取排序后的前若干人。');
  problem('k09','P1781','宇宙总统','变式练习','n≤20、票数最多100位且互不相同；比较 Python 整数键与数字字符串长度、字典序复合键，保留原编号。');
  problem('k15','P1223','排队接水','变式练习','n≤1000、接水时间≤10^6；证明交换相邻两人的效果，区分等待时间与本人接水时间。');
  problem('k15','P1094','[NOIP 2007 普及组] 纪念品分组','综合变式','n≤30000、每组至多两件；结合已学排序与双指针，解释当前最重物品可否配对。');
  problem('k18','P1141','01迷宫','进阶：多次询问','n≤1000、询问≤100000；先做小图对照，再考虑连通块复用。百万格的 Python 对象和队列内存需实测。');
  problem('k19','P1551','亲戚','独立验证','人数、关系数、询问数均≤5000；把关系闭包转成连通分量，检查重复合并与自查询。');
  problem('k22','P1115','最大子段和','变式练习','n≤200000；状态须说明是否以当前点结尾；全负序列仍必须选非空段。');
  problem('k22','P1002','[NOIP 2002 普及组] 过河卒','二维状态变式','网格目标坐标各≤20；先手推障碍与初始状态，再解释右、下移动如何确定计算顺序。');
  problem('k31','P1908','逆序对','进阶：离散化应用','n≤500000、值≤10^9；离散化后处理严格大小关系。先与双循环对拍，完整规模的 Python 时间与内存未提交验证。');
  problem('k34','P1896','[SCOI2005] 互不侵犯','进阶：行状态 DP','N≤9，0≤K≤N²；比集合路径多出行兼容与数量维度，先预处理合法状态并手推 N≤3。Python 完整提交未验证。');
  problem('k49','P3397','地毯','独立验证','n,m≤1000；矩形覆盖次数，先用小矩阵逐格更新核对；大矩阵的整数对象和输出峰值需实测。');
  problem('k50','P4017','最大食物链计数','进阶：拓扑计数','点≤5000、边≤500000，保证无环；计数模80112002。不是最长路径长度；Python 大量邻接边内存与时限需实测。');
  problem('k51','P3366','【模板】最小生成树','独立验证','点≤5000、边≤200000；额外验证不连通时输出 orz，排序边的 Python 内存需评估。');
  problem('k53','P1164','小 A 点菜','独立验证','N≤100、M≤10000，每道菜只有一份且价格可重复；建立恰好花完的方案计数，区别相同价格与相同菜。');

  const condition = '这些是带主题提示的外部练习，不自动算作无标签陌生题。开始前自行确认未做过、未读题解；若已见，记录为复测。完整规模是否通过以自己的 Python 提交结果为准。';
  for (const t of topics) {
    if (reading[t.id]) t.sources = reading[t.id];
    for (const p of additions[t.id] || []) {
      if (!t.problems.some(old => old.id === p.id)) t.problems.push(p);
    }
    if (reading[t.id]) {
      t.resourceNote = '阅读任务与本课配套；OI Wiki 的示例可能使用 C++，请先解释算法，再独立转换为 Python。文档版本不代表比赛环境。';
      t.practiceNote = condition;
      t.externalValidation = '新增题目已核对公开题意及所列数据范围；未在外部 OJ 完成 Python 提交验证。';
    }
    if (additions[t.id] && t.practicePlan?.[3]) {
      t.practicePlan[3].links = additions[t.id].map(p => ({title:p.id+' · '+p.title,url:p.url,task:p.focus}));
    }
    if (t.id === 'k07') {
      t.diagnosticProblems = additions.k07.map(p => p.id);
      t.practicePlan[3].title = '90分钟基础诊断候选题组';
      t.practicePlan[3].prompt = '下方五题未在本站前三周指定练习中使用。统一计时90分钟，自行确认是否已见；计时结束前不看题解与评测反馈。已见题需记录为复测，不据此声称陌生题达标。';
      t.practicePlan[3].verification = '逐题保存代码、耗时、自测与计时后真实评测结果；先修复未完成题，再用不同题验证。五题是候选题组，不保证对每个用户陌生。';
    }
  }
})();
