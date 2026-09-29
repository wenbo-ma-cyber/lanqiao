(function (root) {
  'use strict';
  const KEY = 'lanqiao-learning-state-v1';
  const statuses = { new: '未开始', learning: '学习中', verify: '待验证', mastered: '已掌握', review: '需巩固', deferred:'暂缓选修' };
  const results = { independent: '独立完成', hint: '提示后完成', solution: '题解后完成', unfinished: '未完成', study: '学习记录', mock: '模拟复盘' };
  const dateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function validDate(s) { if(typeof s!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return !isNaN(d)&&dateKey(d)===s; }
  function addDays(s,n) { const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return dateKey(d); }
  function empty() { return {version:1,startDate:'2026-09-28',budget:10,motion:true,lastTopic:null,states:{},notes:{},logs:[],reviews:[],updatedAt:null}; }
  const obj = v => v!==null && typeof v==='object' && !Array.isArray(v);
  function cleanEvidence(value) {
    if(!obj(value)||typeof value.unseen!=='boolean'||!['self','samples','judge'].includes(value.verification)||typeof value.submission!=='string'||value.submission.length>2000)throw Error('练习证据无效。');
    return {unseen:value.unseen,verification:value.verification,submission:value.submission};
  }
  function cleanAssessment(value) {
    const text=(v,max)=>typeof v==='string'&&v.length<=max;
    const minutes=v=>Number.isInteger(v)&&v>=0&&v<=1440;
    const source=v=>{if(!text(v,2000))return false;if(!v)return true;try{return ['https:','http:'].includes(new URL(v).protocol);}catch{return false;}};
    if(!obj(value)||!text(value.year,40)||!text(value.group,120)||!['省赛','国赛'].includes(value.stage)||!source(value.source)||typeof value.unseen!=='boolean'||typeof value.blind!=='boolean'||!minutes(value.duration)||!text(value.repair,10000)||!Array.isArray(value.items)||value.items.length>20)throw Error('模拟档案无效。');
    const items=value.items.map(item=>{
      if(!obj(item)||!text(item.name,200)||!['full','partial','failed','unverified'].includes(item.result)||!minutes(item.minutes)||!text(item.cause,2000))throw Error('模拟逐题记录无效。');
      return {name:item.name,result:item.result,minutes:item.minutes,cause:item.cause};
    });
    return {year:value.year,group:value.group,stage:value.stage,source:value.source,unseen:value.unseen,blind:value.blind,duration:value.duration,items,repair:value.repair};
  }
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
      const log={id:l.id,topicId:l.topicId,date:l.date,result:l.result,minutes:l.minutes,problem:l.problem,note:l.note};
      if(l.evidence!==undefined)log.evidence=cleanEvidence(l.evidence);
      if(l.assessment!==undefined)log.assessment=cleanAssessment(l.assessment);
      logIds.add(l.id);state.logs.push(log);
    }
    const reviewIds=new Set();
    for(const r of raw.reviews){
      if(!obj(r)||typeof r.id!=='string'||!r.id||r.id.length>100||reviewIds.has(r.id)||!known(r.topicId)||!validDate(r.due)||(r.doneAt!==null&&!validDate(r.doneAt))||!['隔天','一周','三周','补测','手动'].includes(r.label))bad('复习安排无效。');
      reviewIds.add(r.id);state.reviews.push({id:r.id,topicId:r.topicId,due:r.due,doneAt:r.doneAt,label:r.label});
    }
    if(raw.updatedAt!==null&&(typeof raw.updatedAt!=='string'||!Number.isFinite(Date.parse(raw.updatedAt))))bad('备份更新时间无效。');
    state.updatedAt=raw.updatedAt;return state;
  }
  function status(state,id){return state.states[id]?.status||'new';}
  const failed = result => ['hint','solution','unfinished'].includes(result);
  function orderedLogs(state,id) {
    // 日期优先，同日以追加顺序为准；补录旧日志不会覆盖更新的验证证据。
    return state.logs.map((log,index)=>({log,index})).filter(x=>x.log.topicId===id)
      .sort((a,b)=>a.log.date.localeCompare(b.log.date)||a.index-b.index).map(x=>x.log);
  }
  function concern(state,id) {
    let unresolved=null;
    for(const log of orderedLogs(state,id)) {
      if(failed(log.result))unresolved=log;
      else if(log.result==='independent')unresolved=null;
    }
    return unresolved;
  }
  function recommend(state,topics,today=dateKey()) {
    const repair=topics.map(t=>({topic:t,log:concern(state,t.id)})).filter(x=>x.log)
      .sort((a,b)=>b.log.date.localeCompare(a.log.date));
    if(repair.length)return {id:repair[0].topic.id,reason:`最近一次验证为“${results[repair[0].log.result]}”，还没有之后独立完成的证据。先补弱并重新验证。`,kind:'repair'};
    const due=state.reviews.filter(r=>!r.doneAt&&r.due<=today).sort((a,b)=>a.due.localeCompare(b.due)||topics.findIndex(t=>t.id===a.topicId)-topics.findIndex(t=>t.id===b.topicId));
    if(due.length) return {id:due[0].topicId,reason:`${due[0].due} 的${due[0].label}复习尚未完成。先检验旧知识是否还会。`,kind:'review'};
    const current=topics.find(t=>!['mastered','deferred'].includes(status(state,t.id)));
    const weak=topics.find(t=>status(state,t.id)==='review');
    if(weak)return {id:weak.id,reason:'有明确标记为需巩固的知识点，先修复它再拓展。',kind:'review'};
    const working=topics.filter(t=>['learning','verify'].includes(status(state,t.id)));
    const next=working.find(t=>t.id===state.lastTopic)||working[0];
    if(next)return {id:next.id,reason:status(state,next.id)==='verify'?'概念已学，接下来去洛谷完成陌生题验证。':'继续正在学习的知识点，完成理解后再去洛谷验证。',kind:status(state,next.id)};
    const eligible=topics.find(t=>status(state,t.id)==='new'&&(t.prerequisites||[]).every(id=>status(state,id)==='mastered'));
    if(eligible)return {id:eligible.id,reason:'先修要求已满足，这是路线中的下一个未开始知识点。',kind:'new'};
    if(current)return {id:current.id,reason:'回到尚未完成的知识点，检查先修和验收要求。',kind:'review'};
    return {id:state.lastTopic||topics.at(-1)?.id,reason:'当前必学任务已完成自评，选修可能暂缓。继续用陌生整卷和定期重做检验稳定性。',kind:'complete'};
  }
  function appendPractice(state,entry,schedule,completedReview=null) {
    if(state.logs.length>=5000)throw Error('已达5000条记录，请先导出备份。');
    if(state.logs.some(l=>l.id===entry.id))throw Error('该日志已记录，请勿重复提交。');
    const additions=[];
    for(const [offset,label]of schedule) {
      const due=addDays(entry.date,offset);
      // 仅合并尚未完成的事项；过去完成过同日任务不能吞掉新的失败补测。
      if(state.reviews.some(r=>r!==completedReview&&r.topicId===entry.topicId&&r.due===due&&!r.doneAt)||additions.some(r=>r.due===due))continue;
      let id=`${entry.id}-${offset}`,suffix=0;
      while(state.reviews.some(r=>r.id===id)||additions.some(r=>r.id===id))id=`${entry.id}-${offset}-${++suffix}`;
      additions.push({id,topicId:entry.topicId,due,label,doneAt:null});
    }
    if(state.reviews.length+additions.length>10000)throw Error('复习记录已达上限，请先导出备份。');
    state.logs.push(entry);state.reviews.push(...additions);
    if(completedReview)completedReview.doneAt=entry.date;
    if(['independent','hint','solution','unfinished'].includes(entry.result)&&status(state,entry.topicId)==='new')state.states[entry.topicId]={status:'learning',date:entry.date};
  }
  function logPractice(state,entry) {
    const schedule=['independent','hint','solution','unfinished'].includes(entry.result)?[[1,failed(entry.result)?'补测':'隔天'],[7,'一周']]:[];
    appendPractice(state,entry,schedule);
  }
  function recordReview(state,entry,reviewId) {
    const review=state.reviews.find(r=>r.id===reviewId);
    if(!review||review.topicId!==entry.topicId||review.doneAt)throw Error('复习事项不存在、主题不匹配或已经完成。');
    if(entry.date<review.due)throw Error('请在复习到期后记录验证结果。');
    if(!['independent','hint','solution','unfinished'].includes(entry.result))throw Error('复习需要记录独立完成、提示后完成、题解后完成或未完成。');
    const schedule=failed(entry.result)?[[1,'补测']]:review.label==='三周'?[]:review.label==='一周'?[[21,'三周']]:[[7,'一周']];
    appendPractice(state,entry,schedule,review);
  }
  function problemIds(problem) {
    return problem.toUpperCase().match(/\b(?:P\d+|B\d+|CF\d+[A-Z]\d*|AT_[A-Z0-9_]+|SP\d+|U\d+)\b/g)||[];
  }
  function hasEvidence(state,id) {
    if(concern(state,id))return false;
    const dates=new Map(),unseen=new Set();
    for(const log of state.logs.filter(l=>l.topicId===id&&l.result==='independent'&&l.evidence?.verification==='judge')) {
      for(const problem of problemIds(log.problem)) {
        if(!dates.has(problem))dates.set(problem,new Set());
        dates.get(problem).add(log.date);
        if(log.evidence.unseen)unseen.add(problem);
      }
    }
    // 保守证据：至少两道声明为陌生且通过评测的题，另有跨日独立评测复测。
    return unseen.size>=2&&[...unseen].some(problem=>dates.get(problem).size>=2);
  }
  function metrics(state,topics,today=dateKey()) {
    const mastered=topics.filter(t=>status(state,t.id)==='mastered').length;
    const start=new Date(today+'T12:00:00');start.setDate(start.getDate()-(start.getDay()+6)%7);
    const weekStart=dateKey(start),end=addDays(weekStart,7);
    const weekLogs=state.logs.filter(l=>l.date>=weekStart&&l.date<end);
    const minutes=weekLogs.reduce((sum,l)=>sum+(l.minutes??0),0);
    const proof=new Set();for(const l of state.logs.filter(l=>l.result==='independent'))for(const id of problemIds(l.problem))proof.add(id);
    const knowledge=topics.filter(t=>t.kind!=='mock'),mocks=topics.filter(t=>t.kind==='mock');
    const knowledgeMastered=knowledge.filter(t=>status(state,t.id)==='mastered').length;
    const evidenceConfirmed=knowledge.filter(t=>hasEvidence(state,t.id)).length;
    return {mastered,total:topics.length,minutes,missing:weekLogs.filter(l=>l.minutes===null).length,independent:proof.size,due:state.reviews.filter(r=>!r.doneAt&&r.due<=today).length,
      knowledgeMastered,knowledgeTotal:knowledge.length,
      mockCompleted:mocks.filter(t=>status(state,t.id)==='mastered').length,mockTotal:mocks.length,
      needsEvidence:knowledge.filter(t=>status(state,t.id)==='mastered'&&!hasEvidence(state,t.id)).length,evidenceConfirmed,
      concerns:topics.filter(t=>concern(state,t.id)).length};
  }
  const api={KEY,statuses,results,dateKey,validDate,addDays,empty,validate,status,recommend,concern,logPractice,recordReview,hasEvidence,metrics};
  root.LQCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
