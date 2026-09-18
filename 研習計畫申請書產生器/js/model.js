// Document Model：預覽、驗證與匯出共用的資料讀取層。
function minutesBetween(start,end){
  if(!start||!end) return null;
  const [sh,sm]=start.split(':').map(Number), [eh,em]=end.split(':').map(Number);
  return (eh*60+em)-(sh*60+sm);
}
function sessionDuration(s){ return minutesBetween(s.start,s.end); }
function getData(){
  sessionData.forEach(s=>{ s.durationMinutes=sessionDuration(s); });
  const totalPeople=sessionData.reduce((a,s)=>a+Number(s.people||0),0);
  const samePeople=sessionData.length && sessionData.every(s=>Number(s.people||0)===Number(sessionData[0].people||0));
  const sameTime=sessionData.length && sessionData.every(s=>s.start===sessionData[0].start && s.end===sessionData[0].end);
  const durations=sessionData.map(sessionDuration);
  const totalMinutes=durations.every(Number.isFinite) ? durations.reduce((a,n)=>a+n,0) : null;
  const dur = sessionData[0] ? sessionDuration(sessionData[0]) : null;
  const lectureFee=Number($('lectureHours').value||0)*Number($('hourlyRate').value||0)*sessionData.length;
  const total=lectureFee+Number($('otherCost').value||0)+Number($('miscCost').value||0);
  const org=organizations.find(o=>o.name===$('unit').value);
  return {
    applyDate:$('applyDate').value, region:$('region').value, type:$('type').value, hours:$('hours').value, topic:$('topic').value,
    teacher:$('teacher').value, phone:$('phone').value, email:$('email').value, teacherCredit:$('teacherCredit').value, nature:$('nature').value,
    unit:$('unit').value, taxId:org?.taxId||'', poster:$('poster').value, sign:$('sign').value,
    miscCost:Number($('miscCost').value||0), costDesc:$('costDesc').value, other:$('other').value,
    dates:sessionData.map(s=>fmtDate(s.date)).filter(Boolean).join('、'),
    times:sameTime && sessionData[0] ? `${sessionData[0].start}～${sessionData[0].end}${dur>0?`，每場 ${dur/60} 小時`:''}` : sessionData.map((s,i)=>`${shortDate(s.date)} ${s.start}～${s.end}${durations[i]>0?`（${durations[i]/60} 小時）`:''}`).join('、'),
    places:sessionData.map(s=>`${shortDate(s.date)} ${s.place}`).filter(x=>x.trim()).join('、'),
    people:(samePeople && sessionData[0]) ? `每場 ${sessionData[0].people||0} 人，共 ${totalPeople} 人次` : `各場上限：${sessionData.map(s=>s.people||0).join('、')} 人，共 ${totalPeople} 人次`,
    peopleLimitValues:sessionData.map(s=>s.people), durations, totalMinutes, lectureFee,total
  };
}
function buildDocumentModel(){
  const d=getData();
  return {schemaVersion:2,basic:{applyDate:d.applyDate,region:d.region,nature:d.nature,unit:d.unit,taxId:d.taxId,poster:d.poster,sign:d.sign},seminar:{type:d.type,hours:d.hours,teacherCredit:d.teacherCredit,topic:d.topic,teacher:d.teacher,phone:d.phone,email:d.email},sessions:sessionData.map(s=>({date:s.date,start:s.start,end:s.end,durationMinutes:sessionDuration(s),place:s.place,peopleLimit:s.people})),budget:{lectureHours:Number($('lectureHours').value||0),hourlyRate:Number($('hourlyRate').value||0),venue:Number($('otherCost').value||0),miscellaneous:Number($('miscCost').value||0),description:$('costDesc').value},notes:d.other};
}
