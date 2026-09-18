// 草稿保存、恢復與清除。
function saveDraft(){ clearTimeout(saveTimer); saveTimer=setTimeout(saveDraftNow,250); }
function saveDraftNow(){
  const form={}; formIds.forEach(id=>form[id]=$(id).value);
  const hasContent=Object.values(form).some(Boolean)||sessionData.some(s=>Object.values(s).some(v=>v!==''&&v!==null&&v!==undefined));
  if(!hasContent){ localStorage.removeItem(DRAFT_KEY); $('draftStatus').textContent=''; $('bannerDraftStatus').textContent=''; return; }
  form.costDescManual=$('costDesc').dataset.manual==='1';
  const payload={version:2,schemaVersion:2,savedAt:new Date().toISOString(),model:buildDocumentModel(),form,sessions:sessionData}; localStorage.setItem(DRAFT_KEY,JSON.stringify(payload));
  const savedText=`已保存：${new Date(payload.savedAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}`;
  $('draftStatus').textContent=savedText; $('bannerDraftStatus').textContent=savedText;
}
function manualSaveDraft(){ clearTimeout(saveTimer); saveDraftNow(); }
function loadDraft(){
  try{
    const raw=localStorage.getItem(DRAFT_KEY); if(!raw) return; const draft=JSON.parse(raw);
    if(![1,2].includes(draft.version) || !draft.form || !Array.isArray(draft.sessions)) return;
    const when=new Date(draft.savedAt);
    if(confirm(`發現上次未完成的研習資料。\n\n最後儲存：${when.toLocaleString('zh-TW')}\n\n按「確定」恢復資料，按「取消」開始新填寫。`)){
      formIds.forEach(id=>{if(draft.form[id]!==undefined) $(id).value=draft.form[id];}); $('costDesc').dataset.manual=draft.form.costDescManual?'1':'0';
      sessionData=draft.sessions.map(s=>({date:s.date||'',start:s.start||'',end:s.end||'',place:s.place||'',people:s.people??''})); if(!sessionData.length) sessionData=[{date:'',start:'',end:'',place:'',people:''}];
      renderSessions(); update(); $('draftStatus').textContent=`已恢復草稿：${when.toLocaleString('zh-TW')}`; $('bannerDraftStatus').textContent='草稿已恢復';
    } else { clearTimeout(saveTimer); localStorage.removeItem(DRAFT_KEY); }
  }catch(e){ localStorage.removeItem(DRAFT_KEY); }
}
function clearCurrentData(){
  if(!confirm('確定要清除目前填寫內容嗎？\n\n此操作將刪除目前草稿資料。')) return;
  formIds.forEach(id=>$(id).value=''); sessionData=[{date:'',start:'',end:'',place:'',people:''}]; $('costDesc').dataset.manual='0'; localStorage.removeItem(DRAFT_KEY); renderSessions(); update(); $('draftStatus').textContent='已清除目前資料。';
}
