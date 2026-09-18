// 文件檢核與錯誤導引。
function parseHours(value){ const m=String(value||'').match(/\d+(?:\.\d+)?/); return m?Number(m[0]):null; }
function validateDocument(){
  const d=getData(), errors=[], warnings=[];
  const required=[['applyDate','申請日'],['region','研習申請區域'],['type','研習類別'],['hours','研習時數'],['topic','研習主題'],['teacher','講師姓名']];
  required.forEach(([id,label])=>{ if(!$(id).value.trim()) errors.push(`${label}尚未填寫。`); });
  if(!sessionData.length) errors.push('至少需要一個場次。');
  sessionData.forEach((s,i)=>{
    const n=i+1;
    if(!s.date) errors.push(`第 ${n} 場：請填寫日期。`);
    if(!s.start) errors.push(`第 ${n} 場：請填寫開始時間。`);
    if(!s.end) errors.push(`第 ${n} 場：請填寫結束時間。`);
    if(s.start && s.end && sessionDuration(s)<=0) errors.push(`第 ${n} 場：結束時間必須晚於開始時間。`);
    if(!s.place.trim()) errors.push(`第 ${n} 場：請填寫辦理地點。`);
    if(s.people==='' || !Number.isFinite(Number(s.people)) || Number(s.people)<0) errors.push(`第 ${n} 場：人數限制必須是 0 或以上的數字。`);
  });
  if(!d.teacherCredit) warnings.push('教師研習時數尚未選擇。');
  if(!d.unit) warnings.push('行政單位尚未選擇。');
  if(!d.costDesc && ['lectureHours','hourlyRate','otherCost','miscCost'].some(id=>$(id).value!=='')) warnings.push('費用說明尚未確認。');
  if(d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) warnings.push('Email 格式可能不正確。');
  if(d.totalMinutes!==null && parseHours(d.hours)!==null && Math.abs(parseHours(d.hours)-d.totalMinutes/60)>0.01) warnings.push(`研習時數不一致：填寫 ${parseHours(d.hours)} 小時，依場次計算為 ${d.totalMinutes/60} 小時。`);
  if(!d.poster || !d.sign) warnings.push('海報／指示牌需求尚未全部選擇。');
  return {valid:errors.length===0,errors,warnings};
}
function renderValidation(){
  const v=validateDocument(), panel=$('validationPanel'); lastValidationErrors=v.errors;
  const items=(cls,icon,arr,withFix=false)=>arr.map((x,i)=>`<li class="${cls}">${icon} ${esc(x)}${withFix?` <button class="fix-link" type="button" onclick="focusValidationError(${i})">前往修正</button>`:''}</li>`).join('');
  const filled=ids=>ids.every(id=>$(id).value.trim());
  const sessionComplete=sessionData.length>0&&sessionData.every(s=>s.date&&s.start&&s.end&&s.place.trim()&&s.people!==''&&sessionDuration(s)>0);
  const state=(ok,hasAlert)=>`<span class="${hasAlert?'status-alert':ok?'status-done':'status-pending'}">${hasAlert?'✕':ok?'✓':'○'}</span>`;
  panel.innerHTML=`<h2>文件檢核</h2><div class="section-status">${state(filled(['applyDate','region']),false)} 基本資料${state(filled(['type','hours','topic','teacher']),false)} 研習資訊${state(sessionComplete,sessionData.some(s=>s.start&&s.end&&sessionDuration(s)<=0))} 場次與時間${state(['lectureHours','hourlyRate','otherCost','miscCost'].some(id=>$(id).value!==''),false)} 人數與費用${state(Boolean($('other').value),false)} 其他說明</div>${v.valid?'<div class="validation-ok">✓ 必要資料完整</div>':'<div class="validation-error">✕ 尚有必要資料未完成</div>'}<ul>${items('validation-error','✕',v.errors,true)}${items('validation-warning','⚠',v.warnings)}${!v.errors.length&&!v.warnings.length?'<li class="validation-ok">所有檢核項目通過。</li>':''}</ul>`;
  return v;
}
function focusValidationError(index){
  const message=lastValidationErrors[index]||'', match=message.match(/第 (\d+) 場/); let target=null;
  if(match) target=$('sessions').children[Number(match[1])-1]?.querySelector('input');
  else { const pairs=[['申請日','applyDate'],['研習申請區域','region'],['研習類別','type'],['研習時數','hours'],['研習主題','topic'],['講師姓名','teacher']]; const pair=pairs.find(([label])=>message.includes(label)); if(pair) target=$(pair[1]); }
  if(target){ target.scrollIntoView({behavior:'smooth',block:'center'}); target.focus(); }
}
function guardDocumentGeneration(){
  const v=renderValidation();
  if(!v.valid){ alert('文件尚有必要資料未完成，請返回修改。'); return false; }
  if(v.warnings.length && !confirm('文件可以產生，但仍有資料尚未確認。\n\n仍要產生嗎？')) return false;
  return true;
}
