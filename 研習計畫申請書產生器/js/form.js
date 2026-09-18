// 場次表單 UI。
function addSession(data={date:'',start:'',end:'',place:'',people:''}){ sessionData.push(data); renderSessions(); update(); }
function removeSession(i){ if(sessionData.length>1){sessionData.splice(i,1);renderSessions();update();} }
function renderSessions(){
  const box=$('sessions'); box.innerHTML='';
  sessionData.forEach((s,i)=>{
    const el=document.createElement('div'); el.className='session';
    el.innerHTML=`<div class="session-head"><span>場次 ${i+1}</span>${sessionData.length>1?`<button class="btn-danger" onclick="removeSession(${i})">移除</button>`:''}</div>
      <div class="grid2"><div class="field"><label>辦理日期</label><input type="date" value="${s.date||''}" oninput="setSession(${i},'date',this.value)"></div>
      <div class="field"><label>人數限制</label><input type="number" min="0" value="${s.people||''}" oninput="setSession(${i},'people',this.value)"></div></div>
      <div class="grid2"><div class="field"><label>開始時間</label><input type="time" value="${s.start||''}" oninput="setSession(${i},'start',this.value)"></div>
      <div class="field"><label>結束時間</label><input type="time" value="${s.end||''}" oninput="setSession(${i},'end',this.value)"></div></div>
      <div class="hint">本場時數：${sessionDuration(s)>0 ? `${sessionDuration(s)/60} 小時` : '待填寫正確的開始／結束時間'}</div>
      <div class="field"><label>辦理地點</label><input value="${esc(s.place||'')}" oninput="setSession(${i},'place',this.value)"></div>`;
    box.appendChild(el);
  });
}
function setSession(i,k,v){ sessionData[i][k]=v; update(); }
