'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../core.js');
const vm=require('node:vm'),fs=require('node:fs');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../curriculum.js'),'utf8'),context);
const data=JSON.parse(JSON.stringify(context.window.LQ_CURRICULUM));
const topics=data.weeks.flatMap(w=>w.topics.map(t=>({...t,phase:w.phase}))),ids=topics.map(t=>t.id);
const miniature=[{id:'a',phase:1,prerequisites:[]},{id:'b',phase:1,prerequisites:['a']},{id:'c',phase:2,prerequisites:['b']}];
const entry=(id,overrides={})=>({id,topicId:'k01',date:'2026-09-26',result:'independent',minutes:null,problem:'P1001',note:'理解整数相加',...overrides});
test('36周课程、47个稳定ID、先修顺序和资源完整',()=>{
 assert.equal(data.weeks.length,36);assert.equal(ids.length,47);assert.equal(new Set(ids).size,47);
 assert.equal(data.weeks.filter(w=>w.kind==='mock').length,11);
 const seen=new Set();let examples=0;
 for(const t of topics){for(const p of t.prerequisites)assert.ok(seen.has(p),`${t.id}先修${p}`);seen.add(t.id);
 for(const field of ['goal','title'])assert.ok(t[field]);for(const field of ['concepts','pitfalls','criteria','sources'])assert.ok(t[field].length);
 if(t.example.code)examples++;for(const p of t.problems)assert.equal(new URL(p.url).hostname,'www.luogu.com.cn');}
 assert.equal(examples,36);
});
test('日期跨月、跨年和闰年',()=>{assert.equal(C.addDays('2026-12-31',1),'2027-01-01');assert.equal(C.addDays('2028-02-28',1),'2028-02-29');assert.equal(C.validDate('2027-02-29'),false);assert.equal(C.validDate('2026-02-30'),false);});
test('推荐优先级：到期、薄弱、进行中、满足先修的新课',()=>{
 const s=C.empty();assert.equal(C.recommend(s,miniature).id,'a');s.states.a={status:'mastered',date:'2026-09-26'};assert.equal(C.recommend(s,miniature).id,'b');
 s.states.c={status:'learning',date:'2026-09-26'};assert.equal(C.recommend(s,miniature).id,'c');s.states.b={status:'review',date:'2026-09-26'};assert.equal(C.recommend(s,miniature).id,'b');
 s.reviews.push({id:'r',topicId:'a',due:'2026-09-25',doneAt:null,label:'一周'});assert.equal(C.recommend(s,miniature,'2026-09-26').id,'a');
 s.reviews[0].doneAt='2026-09-26';assert.equal(C.recommend(s,miniature,'2026-09-26').id,'b');
});
test('全部掌握后仍建议整卷验证',()=>{const s=C.empty();miniature.forEach(t=>s.states[t.id]={status:'mastered',date:'2026-09-26'});assert.equal(C.recommend(s,miniature).kind,'complete');});
test('练习创建隔天和一周复习，同主题同日去重，不自动掌握',()=>{
 const s=C.empty();C.logPractice(s,entry('one'));C.logPractice(s,entry('two',{result:'hint'}));assert.equal(s.logs.length,2);assert.deepEqual(s.reviews.map(r=>r.due),['2026-09-27','2026-10-03']);assert.equal(C.status(s,'k01'),'learning');
 C.logPractice(s,entry('three',{topicId:'k02',result:'solution'}));assert.equal(s.reviews.length,4);assert.notEqual(C.status(s,'k02'),'mastered');
 C.logPractice(s,entry('study',{topicId:'k03',result:'study'}));assert.equal(s.reviews.length,4);
});
test('统计按自然周、题号去重，区分未填时长和零',()=>{
 const s=C.empty();s.logs=[entry('1',{minutes:30}),entry('2',{minutes:0,problem:'https://www.luogu.com.cn/problem/P1001'}),entry('3',{problem:'P1002 P1001'}),entry('4',{result:'hint',problem:'P1003',minutes:10}),entry('5',{date:'2026-09-20',result:'study',minutes:60})];
 const m=C.metrics(s,topics,'2026-09-26');assert.equal(m.minutes,40);assert.equal(m.missing,1);assert.equal(m.independent,2);
});
test('导出内容可还原中文笔记、状态、复习和未填时长',()=>{
 const s=C.empty();C.logPractice(s,entry('one'));s.notes.k01='边界：0 与负数\n<script>仅文本</script>';s.states.k01={status:'verify',date:'2026-09-26'};s.lastTopic='k01';
 assert.deepEqual(C.validate(JSON.parse(JSON.stringify(s)),ids),s);
});
test('损坏、未来版本、未知知识点、重复ID和非法数据均拒绝',()=>{
 for(const mutate of [s=>s.version=2,s=>s.startDate='2027-02-29',s=>s.states.fake={status:'new',date:'2026-09-26'},s=>s.budget=Infinity,s=>s.notes.k01=1,s=>s.lastTopic='missing',s=>s.logs=[entry('1',{minutes:-1})],s=>s.logs=[entry('1'),entry('1')],s=>s.reviews=[{id:'r',topicId:'k01',due:'bad',label:'一周',doneAt:null}]]){const s=C.empty();mutate(s);assert.throws(()=>C.validate(s,ids));}
 assert.throws(()=>C.validate(null,ids));assert.throws(()=>JSON.parse('{broken'));
});
test('达到日志上限失败时不改变状态',()=>{const s=C.empty();s.logs=Array.from({length:5000},(_,i)=>entry(String(i)));assert.throws(()=>C.logPractice(s,entry('overflow')));assert.equal(s.logs.length,5000);assert.equal(s.reviews.length,0);});
