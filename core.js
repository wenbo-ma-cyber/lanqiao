(function (root) {
  'use strict';
  const KEY = 'lanqiao-learning-state-v1';
  const statuses = { new: '未开始', learning: '学习中', verify: '待验证', mastered: '已掌握', review: '需巩固' };
  const results = { independent: '独立完成', hint: '提示后完成', solution: '题解后完成', unfinished: '未完成', study: '学习记录', mock: '模拟复盘' };
  const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function validDate(s) { if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !isNaN(d)&&dateKey(d)===s; }
  function addDays(s,n) { const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d); }
  function empty() { return {version:1,startDate:'2026-09-28',budget:10,motion:true,lastTopic:null,states:{},notes:{},logs:[],reviews:[],updatedAt:null}; }
  const obj = v => v!==null && typeof v==='object' && !Array.isArray(v);
  function validate(raw, ids) {
    const allowed=new Set(ids),known=x=>allowed.has(x),bad=message=>{throw Error(message);};
    if(!obj(raw)||raw.version!==1)bad('不是本网站的 v1 备份。');
    if(!validDate(raw.startDate)||!Number.isFinite(raw.budget)||raw.budget<1||raw.budget>40||typeof raw.motion!=='boolean')bad('日期或学习设置无效。');
    if(raw.lastTopic!==null&&!known(raw.lastTopic))bad('最近学习位置无效。');
    if(!obj(raw.states)||!obj(raw.notes)||!Array.isArray(raw.logs)||!Array.isArray(raw.reviews))bad('记录结构不完整。');
    if(raw.logs.length>5000||raw.reviews.length>10000)bad('记录数量超过可导入上限。');
    const state=empty();Object.assign(state,{startDate:raw.startDate,budget:raw.budget,motion:raw.motion,lastTopic:raw.lastTopic});
    for(const [id,value]of Object.entries(raw.states)) {
      if(!known(id)||!obj(value)||!Object.hasOwn(statuses,value.status)||!validDate(value.date))bad('知识点状态无效。');
      state.states[id]={status:value.status,date:value.date};
    }
    for(const [id,value]of Object.entries(raw.notes)) {
      if(!known(id)||typeof value!=='string'||value.length>50000)bad('笔记无效或超过单知识点 50,000 字。');
      state.notes[id]=value;
    }
    const logIds=new Set();
    for(const l of raw.logs){
      if(!obj(l)||typeof l.id!=='string'||!l.id||l.id.length>100||logIds.has(l.id)||!known(l.topicId)||!validDate(l.date)||!Object.hasOwn(results,l.result))bad('学习日志无效。');
      if(l.minutes!==null&&(!Number.isInteger(l.minutes)||l.minutes<0||l.minutes>1440))bad('耗时应为空或 0～1440 分钟整数。');
      if(typeof l.problem!=='string'||l.problem.length>2000||typeof l.note!=='string'||l.note.length>10000)bad('日志内容过长或无效。');
      logIds.add(l.id);state.logs.push({id:l.id,topicId:l.topicId,date:l.date,result:l.result,minutes:l.minutes,problem:l.problem,note:l.note});
    }
    const reviewIds=new Set();
    for(const r of raw.reviews){
      if(!obj(r)||typeof r.id!=='string'||!r.id||r.id.length>100||reviewIds.has(r.id)||!known(r.topicId)||!validDate(r.due)||(r.doneAt!==null&&!validDate(r.doneAt))||!['隔天','一周','手动'].includes(r.label))bad('复习安排无效。');
      reviewIds.add(r.id);state.reviews.push({id:r.id,topicId:r.topicId,due:r.due,doneAt:r.doneAt,label:r.label});
    }
    if(raw.updatedAt!==null&&(typeof raw.updatedAt!=='string'||!Number.isFinite(Date.parse(raw.updatedAt))))bad('备份更新时间无效。');
    state.updatedAt=raw.updatedAt;return state;
  }
  function status(state,id){return state.states[id]?.status||'new';}
  function recommend(state,topics,today=dateKey()) {
    const due=state.reviews.filter(r=>!r.doneAt&&r.due<=today).sort((a,b)=>a.due.localeCompare(b.due)||topics.findIndex(t=>t.id===a.topicId)-topics.findIndex(t=>t.id===b.topicId));
    if(due.length) return {id:due[0].topicId,reason:`${due[0].due} 的${due[0].label}复习尚未完成。先检验旧知识是否还会。`,kind:'review'};
    const current=topics.find(t=>status(state,t.id)!=='mastered');
    const weak=topics.find(t=>status(state,t.id)==='review'&&t.phase===(current?.phase||7));
    if(weak)return {id:weak.id,reason:'当前阶段有需要巩固的知识点，先修复它再拓展。',kind:'review'};
    const working=topics.filter(t=>['learning','verify'].includes(status(state,t.id)));
    const next=working.find(t=>t.id===state.lastTopic)||working[0];
    if(next)return {id:next.id,reason:status(state,next.id)==='verify'?'概念已学，接下来去洛谷完成陌生题验证。':'继续正在学习的知识点，完成理解后再去洛谷验证。',kind:status(state,next.id)};
    const eligible=topics.find(t=>status(state,t.id)==='new'&&(t.prerequisites||[]).every(id=>status(state,id)==='mastered'));
    if(eligible)return {id:eligible.id,reason:'先修要求已满足，这是路线中的下一个未开始知识点。',kind:'new'};
    if(current)return {id:current.id,reason:'回到尚未完成的知识点，检查先修和验收要求。',kind:'review'};
    return {id:state.lastTopic||topics.at(-1)?.id,reason:'全路线已标记掌握。继续用陌生整卷和定期重做检验稳定性。',kind:'complete'};
  }
  function logPractice(state,entry) {
    if(state.logs.length>=5000)throw Error('已达5000条记录，请先导出备份。');
    state.logs.push(entry);
    // 同一知识点同一天只建一对复习事项，批量录题不制造重复任务。
    if(['independent','hint','solution','unfinished'].includes(entry.result)) {
      for(const [offset,label]of [[1,'隔天'],[7,'一周']]){
        const due=addDays(entry.date,offset);
        if(!state.reviews.some(r=>r.topicId===entry.topicId&&r.due===due))state.reviews.push({id:`${entry.id}-${offset}`,topicId:entry.topicId,due,label,doneAt:null});
      }
      if(status(state,entry.topicId)==='new')state.states[entry.topicId]={status:'learning',date:entry.date};
    }
  }
  function metrics(state,topics,today=dateKey()) {
    const mastered=topics.filter(t=>status(state,t.id)==='mastered').length;
    const start=new Date(today+'T12:00:00');start.setDate(start.getDate()-(start.getDay()+6)%7);
    const weekStart=dateKey(start),end=addDays(weekStart,7);
    const weekLogs=state.logs.filter(l=>l.date>=weekStart&&l.date<end);
    const minutes=weekLogs.reduce((sum,l)=>sum+(l.minutes??0),0);
    const proof=new Set();for(const l of state.logs.filter(l=>l.result==='independent')){
      for(const id of l.problem.toUpperCase().match(/\b(?:P\d+|B\d+|CF\d+[A-Z]\d*|AT_[A-Z0-9_]+|SP\d+|U\d+)\b/g)||[])proof.add(id);
    }
    return {mastered,total:topics.length,minutes,missing:weekLogs.filter(l=>l.minutes===null).length,independent:proof.size,due:state.reviews.filter(r=>!r.doneAt&&r.due<=today).length};
  }
  const api={KEY,statuses,results,dateKey,validDate,addDays,empty,validate,status,recommend,logPractice,metrics};
  root.LQCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
