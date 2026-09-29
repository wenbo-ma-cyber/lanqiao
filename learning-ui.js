/* 教学与训练组件只负责呈现；学习状态统一交给 core.js 保存。 */
(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safe = value => { try { const u = new URL(value); return ['http:','https:'].includes(u.protocol) ? u.href : '#'; } catch { return '#'; } };
  const list = values => `<ul>${(values || []).map(v => `<li>${esc(v)}</li>`).join('')}</ul>`;
  const code = value => `<div class="code-wrap"><button type="button" class="copy-code small">复制代码</button><pre><code>${esc(value)}</code></pre></div>`;
  const sessions = new Map();
  let clock = null;

  function lesson(t) {
    const l = t.lesson || window.LQ_LESSONS?.[t.id];
    if (!l) return '';
    return `<section class="panel" id="learn-derive"><p class="eyebrow">01 · 从问题到方法</p><h2>把思路推出来</h2><p>${esc(l.intuition)}</p><ol class="derivation">${l.derivation.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div class="invariant"><strong>为什么这样做成立</strong><p>${esc(l.invariant)}</p></div></section>
      <section class="panel" id="learn-code"><p class="eyebrow">02 · 手推后再实现</p><h2>完整 Python 示例</h2><p class="muted">先写自己的实现，再展开对照。示例用于学习方法，不是下方外部题目的提交答案。</p><details><summary>展开完整实现与示例调用</summary><div class="detail-body">${code(l.code)}</div></details><h3 class="spaced">复杂度与适用条件</h3><p>${esc(l.complexity)}</p><h3>Python 实现成本</h3><p>${esc(l.python)}</p></section>
      <section class="panel" id="learn-check"><p class="eyebrow">03 · 用边界验证理解</p><h2>先预测，再运行</h2><div class="case-list">${l.cases.map(c=>`<article><p class="field-label">输入或调用</p><pre>${esc(c.input)}</pre><details><summary>查看预期与检查目的</summary><div class="detail-body"><pre>${esc(c.expected)}</pre><p>${esc(c.why)}</p></div></details></article>`).join('')}</div><h3 class="spaced">能解释，才算理解</h3>${l.checks.map(c=>`<details><summary>${esc(c.question)}</summary><div class="detail-body"><p>${esc(c.answer)}</p></div></details>`).join('')}</section>`;
  }

  function practice(t) {
    if (!t.practicePlan?.length) return '';
    return `<section class="panel" id="learn-practice"><p class="eyebrow">04 · 从会写到会选择</p><h2>分层练习任务</h2><p class="muted">每一层检验不同能力。未独立完成就留在这一层；重复同一道题不算新的陌生题证据。</p>${t.practiceNote?`<p class="notice">${esc(t.practiceNote)}</p>`:''}<div class="practice-ladder">${t.practicePlan.map((p,i)=>`<article><span class="ladder-number">${i+1}</span><div><span class="tag">${esc(p.kind)}</span><h3>${esc(p.title)}</h3><p>${esc(p.prompt)}</p>${p.url?`<a class="button small" href="${safe(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.problemId || '打开练习')} ↗</a>`:''}${p.links?.length?`<ul>${p.links.map(link=>`<li><a href="${safe(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.title)} ↗</a><p class="state-help">${esc(link.task)}</p></li>`).join('')}</ul>`:''}<p class="state-help"><strong>验证方式：</strong>${esc(p.verification)}</p></div></article>`).join('')}</div><a class="button" href="#training">进入无标签混合训练 →</a>${t.externalValidation?`<p class="state-help">${esc(t.externalValidation)}</p>`:''}</section>`;
  }

  function checkpoint(w) {
    const c = w.checkpoint;
    return c ? `<details class="checkpoint"><summary>阶段诊断 · ${esc(c.title)} · ${esc(c.minutes)} 分钟</summary><div class="detail-body"><h3>关闭题解，独立完成</h3>${list(c.tasks)}<h3>据此决定下一步</h3>${list(c.criteria)}<a class="button small" href="#training">选择混合训练题 →</a><p class="state-help">若主要问题是建模或实现，下一周先修复再推进。提前国赛题组用于诊断，不计作整卷成绩。</p></div></details>` : '';
  }

  function timer(key, minutes) {
    return `<div class="training-timer" data-timer="${esc(key)}" data-target="${minutes}"><div><span class="field-label">${minutes} 分钟训练计时</span><strong class="clock-readout">00:00:00</strong><span class="timer-status muted">尚未开始</span></div><div class="actions"><button type="button" data-timer-start>开始计时</button><button type="button" data-timer-end disabled>结束本次训练</button></div><p class="state-help">离开本页后继续计时；刷新会重置。结束时手动保存实际耗时。计时不会自动判定完成或得分。</p></div>`;
  }

  function paper(t, state) {
    const p = t.paper || {}, saved = [...state.logs].reverse().find(l=>l.topicId===t.id && l.assessment)?.assessment;
    return `<section class="panel" id="learn-derive"><p class="eyebrow">01 · 先登记，再开卷</p><h2>本次试卷档案</h2>${p.title?`<h3>${esc(p.title)}</h3>`:''}<div class="paper-meta"><span class="tag">${esc(p.stage || (t.week<29?'省赛':'国赛'))}</span><span class="tag">${esc(p.group || 'Python 大学 B 组')}</span><span class="tag">${p.mode==='reserved'?'保留测评卷':'训练卷'}</span></div><p>${esc(p.selection || '选择一套完整且未读过题解的对应组别试卷，先核对来源与题目完整性。')}</p>${p.year?`<p>计划年份：${esc(p.year)}（开始前仍需核对卷面）。</p>`:''}<div class="notice">${saved?`最近登记：${esc(saved.year)} · ${esc(saved.group)} · ${saved.unseen?'未见卷':'含已见题'} · ${saved.blind?'赛中不看评测':'使用即时反馈'}。`:'尚未记录本次训练。请核对推荐原卷，并登记你实际使用的年份、组别和来源。'}</div><div class="actions"><a class="button primary" href="${safe(p.source || 'https://www.lanqiao.cn/paper/')}" target="_blank" rel="noopener noreferrer">${p.year?'打开指定原卷':'官方真题卷入口'} ↗</a><button data-record="${esc(t.id)}">登记试卷 / 记录复盘</button></div>${p.access?`<p class="state-help">${esc(p.access)}</p>`:''}${p.verification?`<details><summary>来源核验范围</summary><div class="detail-body"><p>${esc(p.verification)}</p></div></details>`:''}<h3 class="spaced">开始前核对</h3><ul><li>确认届数、语言、组别、省赛或国赛，完整保留题面和评分说明。</li><li>保留测评卷应没有做过或读过题解；含已见题时改记训练卷，不作陌生卷比较。</li><li>平时练习可以看评测；模拟时关闭提示和即时反馈，结束后统一核验。</li></ul>${list(p.criteria)}${timer(t.id,p.minutes || 240)}</section>
      <section class="panel"><p class="eyebrow">02 · 比赛中的执行</p><h2>无即时反馈，也能检查答案</h2><ol><li>通读题目，记录可做题与可获得部分分的边界。时间投入依据进展调整。</li><li>每题至少核对最小规模、等值、极端值和不可达/无解情况；小规模用暴力对拍。</li><li>保留当前可靠的代码版本，提交前核对文件和输入输出。不要用未验证改动覆盖可靠解法。</li><li>结束后才查看评测。区分完整评测、样例检查和自己的有限测试。</li></ol><p class="state-help">参考第十七届规则：4小时、赛中不反馈、最后一次提交计分、Python 3.8.6 与自带库。2027环境和规则需按当届通知重新核对。<a href="https://ie.cufe.edu.cn/info/1069/7376.htm" target="_blank" rel="noopener noreferrer">规则来源（附件5）↗</a></p></section>`;
  }

  function training(id, byId) {
    const problems = window.LQ_TRAINING || [];
    const p = problems.find(x=>x.id===id);
    if (!id) return `<div class="page-heading"><div><p class="eyebrow">TRANSFER YOUR KNOWLEDGE</p><h1>先读题，再选方法。</h1><p>原创混合训练 · 默认隐藏算法标签和解法 · 本地实现后对照样例</p></div></div><section class="panel"><h2>用陌生题检验迁移</h2><p>先独立写下复杂度估计和解题理由，再开始实现。样例通过只说明有限输入正确；这些自编题没有在线评测，记录时请选择“自测”或“样例”。</p><p class="state-help">看过提示或答案后如实记录。本页与官方真题整卷分开，不能替代比赛成绩。</p></section><div class="training-grid">${problems.map((x,i)=>`<a class="panel training-card" href="#training/${esc(x.id)}"><span class="eyebrow">CHALLENGE ${String(i+1).padStart(2,'0')}</span><h2>${esc(x.title)}</h2><p>先独立建模，再查看提示</p><span>阅读题目 →</span></a>`).join('')}</div>`;
    if (!p) return '<section class="panel"><h1>没有找到这道训练题</h1><a href="#training">返回混合训练</a></section>';
    return `<div class="breadcrumb"><a href="#training">无标签混合训练</a> / ${esc(p.id)}</div><section class="panel"><p class="eyebrow">INDEPENDENT CHALLENGE</p><h1>${esc(p.title)}</h1><p class="text-note">${esc(p.prompt)}</p><h3>输入格式</h3><p class="text-note">${esc(p.input)}</p><h3>输出格式</h3><p class="text-note">${esc(p.output)}</p><h3>数据范围</h3><p>${esc(p.constraints)}</p><div class="sample-grid"><div><h3>样例输入</h3><pre>${esc(p.sampleInput)}</pre></div><div><h3>样例输出</h3><pre>${esc(p.sampleOutput)}</pre></div></div>${timer(p.id,60)}</section><section class="panel"><h2>完成独立尝试后再打开</h2><details><summary>我需要一个提示（此后不再记为无提示独立完成）</summary><div class="detail-body"><p>${esc(p.hint)}</p></div></details><details><summary>查看参考思路、算法标签与完整实现</summary><div class="detail-body"><p class="text-note">${esc(p.explanation)}</p><div class="actions">${(p.topics||[]).map(id=>`<a class="button small" href="#topic/${esc(id)}">${esc(byId.get(id)?.title || id)}</a>`).join('')}</div>${code(p.solution)}<p class="state-help">先运行自己的程序，确认样例与自造边界；再以参考实现做小规模对照。有限测试不代替正确性论证。</p></div></details><button class="button primary spaced" data-training-log="${esc(p.id)}">记录本次训练结果</button></section>`;
  }

  function evidenceFields(old) {
    const e = old?.evidence;
    return `<fieldset id="evidence-fields"><legend>验证证据（与自评掌握分开）</legend><label class="check-field"><input type="checkbox" id="proof-unseen" ${e?.unseen?'checked':''}>本题此前未做过、未读过题解</label><div class="field"><label for="proof-verification">结果依据</label><select id="proof-verification"><option value="self" ${!e||e.verification==='self'?'selected':''}>自己的有限测试</option><option value="samples" ${e?.verification==='samples'?'selected':''}>仅通过题目样例</option><option value="judge" ${e?.verification==='judge'?'selected':''}>外部平台完整评测通过</option></select></div><div class="field"><label for="proof-submission">提交记录或验证说明（可选）</label><input id="proof-submission" maxlength="2000" value="${esc(e?.submission || '')}" placeholder="提交链接，或写下实际测试了哪些边界"></div><p class="state-help">网站不读取外部提交，证据仍由你如实填写。样例通过不会被当成完整评测。</p></fieldset>`;
  }

  function assessmentRow(item={},i=0) {
    return `<div class="assessment-row"><div class="field"><label for="paper-name-${i}">题号 / 名称</label><input id="paper-name-${i}" data-item-name maxlength="100" value="${esc(item.name || '')}"></div><div class="field"><label for="paper-result-${i}">验证结果</label><select id="paper-result-${i}" data-item-result>${[['unverified','未完整验证'],['full','完整评测通过'],['partial','已验证部分分'],['failed','未完成 / 错误']].map(([key,label])=>`<option value="${key}" ${item.result===key?'selected':''}>${label}</option>`).join('')}</select></div><div class="field"><label for="paper-minutes-${i}">分钟</label><input id="paper-minutes-${i}" data-item-minutes type="number" min="0" max="1440" value="${item.minutes || 0}"></div><div class="field row-cause"><label for="paper-cause-${i}">卡点 / 验证范围</label><input id="paper-cause-${i}" data-item-cause maxlength="1000" value="${esc(item.cause || '')}" placeholder="如状态遗漏、仅通过小规模数据"></div><button type="button" class="remove-paper-row" aria-label="移除此题记录">移除此题</button></div>`;
  }

  function assessmentFields(old,t) {
    const a = old?.assessment || {}, p=t?.paper || {};
    return `<fieldset id="assessment-fields"><legend>试卷与逐题复盘</legend><div class="form-grid"><div class="field"><label for="paper-year">届数 / 年份</label><input id="paper-year" maxlength="40" value="${esc(a.year || p.year || '')}" placeholder="按实际试卷填写"></div><div class="field"><label for="paper-group">语言与组别</label><input id="paper-group" maxlength="100" value="${esc(a.group || p.group || 'Python 大学 B 组')}"></div></div><div class="field"><label for="paper-stage">阶段</label><select id="paper-stage"><option ${a.stage==='省赛'||(!a.stage&&p.stage!=='国赛')?'selected':''}>省赛</option><option ${a.stage==='国赛'||(!a.stage&&p.stage==='国赛')?'selected':''}>国赛</option></select></div><div class="field"><label for="paper-source">具体原卷来源（可选链接）</label><input id="paper-source" type="url" maxlength="2000" value="${esc(a.source || (p.year?p.source:''))}" placeholder="填写具体原卷链接，题库首页不算原卷确认"></div><label class="check-field"><input type="checkbox" id="paper-unseen" ${a.unseen?'checked':''}>整卷此前未做过、未读过题解</label><label class="check-field"><input type="checkbox" id="paper-blind" ${a.blind?'checked':''}>限时期间没有看评测反馈、提示或答案</label><p class="state-help">未勾选的训练仍有价值，但不能当作陌生盲测证据；结果未核验时保留“未完整验证”。</p><div id="assessment-items">${(a.items?.length?a.items:[{},{}]).map(assessmentRow).join('')}</div><button type="button" id="paper-add-row">增加题目记录</button><div class="field spaced"><label for="paper-repair">下一步修复任务</label><textarea id="paper-repair" rows="2" maxlength="5000" placeholder="写清薄弱能力、补做题和再次验证的方式">${esc(a.repair || '')}</textarea></div></fieldset>`;
  }

  function bindRecord(byId) {
    const topic=document.querySelector('#log-topic'),result=document.querySelector('#log-result');
    let rowSerial=document.querySelectorAll('.assessment-row').length;
    function toggle(){const mock=byId.get(topic.value)?.kind==='mock'||result.value==='mock';document.querySelector('#assessment-fields').hidden=!mock;document.querySelector('#evidence-fields').hidden=mock;document.querySelector('#record-dialog').classList.toggle('wide-dialog',mock);}
    topic.addEventListener('change',toggle);result.addEventListener('change',toggle);toggle();
    document.querySelector('#paper-add-row').onclick=()=>{const host=document.querySelector('#assessment-items');if(host.children.length>=20)return;host.insertAdjacentHTML('beforeend',assessmentRow({},rowSerial++));};
    document.querySelector('#assessment-items').onclick=e=>{if(e.target.closest('.remove-paper-row'))e.target.closest('.assessment-row').remove();};
  }

  function readEvidence(){return {unseen:document.querySelector('#proof-unseen').checked,verification:document.querySelector('#proof-verification').value,submission:document.querySelector('#proof-submission').value.trim()};}
  function readAssessment(minutes){return {year:document.querySelector('#paper-year').value.trim(),group:document.querySelector('#paper-group').value.trim(),stage:document.querySelector('#paper-stage').value,source:document.querySelector('#paper-source').value.trim(),unseen:document.querySelector('#paper-unseen').checked,blind:document.querySelector('#paper-blind').checked,duration:minutes??0,items:[...document.querySelectorAll('.assessment-row')].map(row=>({name:row.querySelector('[data-item-name]').value.trim(),result:row.querySelector('[data-item-result]').value,minutes:Number(row.querySelector('[data-item-minutes]').value),cause:row.querySelector('[data-item-cause]').value.trim()})).filter(x=>x.name||x.cause),repair:document.querySelector('#paper-repair').value.trim()};}
  function assessmentSummary(a){return a?`<div class="assessment-summary"><p>${esc(a.year || '年份未登记')} · ${esc(a.group)} · ${esc(a.stage)} · ${a.unseen?'陌生卷':'含已见题 / 未确认'} · ${a.blind?'无即时反馈':'非盲测 / 未确认'}</p>${a.source?`<a href="${safe(a.source)}" target="_blank" rel="noopener noreferrer">原卷来源 ↗</a>`:''}${a.items.length?`<div class="table-scroll"><table><thead><tr><th>题目</th><th>结果</th><th>分钟</th><th>卡点 / 验证范围</th></tr></thead><tbody>${a.items.map(i=>`<tr><td>${esc(i.name)}</td><td>${({full:'完整评测通过',partial:'已验证部分分',failed:'未完成 / 错误',unverified:'未完整验证'})[i.result]}</td><td>${i.minutes}</td><td>${esc(i.cause)}</td></tr>`).join('')}</tbody></table></div>`:''}<p class="text-note"><strong>修复任务：</strong>${esc(a.repair || '尚未登记')}</p></div>`:'';}

  function bind(notify) {
    document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>{const target=document.getElementById(b.dataset.jump);target?.scrollIntoView({behavior:'auto',block:'start'});if(target){target.tabIndex=-1;target.focus({preventScroll:true});}});
    document.querySelectorAll('.copy-code').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.parentElement.querySelector('code').textContent);notify('代码已复制，请在本地 Python 运行并验证。');}catch{notify('无法访问剪贴板，请选择代码后手动复制。');}});
    clearInterval(clock);
    const host=document.querySelector('[data-timer]');
    if(!host)return;
    const key=host.dataset.timer;
    function update(){const s=sessions.get(key);const seconds=s?Math.max(0,Math.floor(((s.end||Date.now())-s.start)/1000)):0;host.querySelector('.clock-readout').textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(x=>String(x).padStart(2,'0')).join(':');host.querySelector('.timer-status').textContent=!s?'尚未开始':s.end?'已结束，请保存记录':seconds>=Number(host.dataset.target)*60?'已到计划时长，请结束并复盘':'计时中 · 结束前不看反馈';host.querySelector('[data-timer-start]').disabled=!!s&&!s.end;host.querySelector('[data-timer-start]').textContent=s?.end?'开始新一次计时':'开始计时';host.querySelector('[data-timer-end]').disabled=!s||!!s.end;}
    host.querySelector('[data-timer-start]').onclick=()=>{sessions.set(key,{start:Date.now(),end:null});update();};
    host.querySelector('[data-timer-end]').onclick=()=>{const s=sessions.get(key);if(s)s.end=Date.now();update();};update();clock=setInterval(update,1000);
  }
  const elapsed = key => {const s=sessions.get(key);return s?Math.ceil(((s.end||Date.now())-s.start)/60000):null;};
  window.LQLearning={lesson,practice,checkpoint,paper,training,evidenceFields,assessmentFields,bindRecord,readEvidence,readAssessment,assessmentSummary,bind,elapsed};
})();
