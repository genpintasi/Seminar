// 應用程式入口：集中處理頁面事件與啟動順序。
const $ = id => document.getElementById(id);
const esc = s => (s ?? '').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const fmtMoney = n => Number(n||0).toLocaleString('zh-TW');
const fmtDate = d => d ? d.replaceAll('-','/') : '';
const shortDate = d => { if(!d) return ''; const [y,m,day]=d.split('-'); return `${Number(m)}/${Number(day)}`; };
function updateCostTextIfAuto(){
  if($('costDesc').dataset.manual==='1') return;
  const hasCostInput=['lectureHours','hourlyRate','otherCost','miscCost'].some(id=>$(id).value!=='');
  if(!hasCostInput){ $('costDesc').value=''; return; }
  const d=getData(),lh=Number($('lectureHours').value||0),rate=Number($('hourlyRate').value||0),other=Number($('otherCost').value||0),misc=Number($('miscCost').value||0);
  $('costDesc').value=`講師費：${lh} 小時 × ${fmtMoney(rate)} 元 × ${sessionData.length} 場 = ${fmtMoney(d.lectureFee)} 元\n場地費：${fmtMoney(other)} 元\n雜支費用：${fmtMoney(misc)} 元\n總費用：${fmtMoney(d.total)} 元`;
}
function fitPaperToStage(paperId,stageId,fitViewport=true){
  const paper=$(paperId),stage=$(stageId); if(!paper||!stage) return; paper.style.transform='none';
  const naturalWidth=paper.offsetWidth||794,naturalHeight=paper.offsetHeight||1123,availableWidth=Math.max(1,stage.clientWidth-4),availableHeight=Math.max(1,window.innerHeight-stage.getBoundingClientRect().top-8);
  const scale=fitViewport?Math.min(1,availableWidth/naturalWidth,availableHeight/naturalHeight):1; paper.style.transform=`scale(${scale})`; stage.style.height=`${Math.ceil(naturalHeight*scale)}px`;
}
function fitAllPreviews(){ requestAnimationFrame(()=>{fitPaperToStage('paper','paperStage');if($('modal').classList.contains('show'))fitPaperToStage('modalPaper','modalPaperStage',false);}); }
function update(){
  const d=getData(),hasCostInput=['lectureHours','hourlyRate','otherCost','miscCost'].some(id=>$(id).value!=='');
  $('costSummary').innerHTML=hasCostInput?`講師費：${$('lectureHours').value||0} 小時 × ${fmtMoney($('hourlyRate').value||0)} 元 × ${sessionData.length} 場 ＝ <b>${fmtMoney(d.lectureFee)} 元</b><br>總費用：<b>${fmtMoney(d.total)} 元</b>`:'尚未填寫費用資料';
  updateCostTextIfAuto(); $('paper').innerHTML=docHTML(); $('modalPaper').innerHTML=docHTML(); $('taxId').value=getData().taxId; renderValidation(); saveDraft(); fitAllPreviews();
}
function openFullPreview(){ update(); $('modal').classList.add('show'); document.body.style.overflow='hidden'; requestAnimationFrame(()=>fitPaperToStage('modalPaper','modalPaperStage',false)); }
function closePreview(){ $('modal').classList.remove('show'); document.body.style.overflow=''; }
function setMobileTab(t){ $('layout').classList.toggle('show-preview', t==='preview'); if(t==='preview') requestAnimationFrame(fitAllPreviews); }
function filename(ext){
  const d=getData(); const topic=(d.topic||'未命名').replace(/[\\/:*?"<>|]/g,'_').slice(0,30);
  const date=(sessionData[0]?.date||d.applyDate||'').replaceAll('/','-');
  return `研習計畫申請書_${topic}_${date||'未填日期'}.${ext}`;
}
$('modal').addEventListener('click',e=>{ if(e.target===$('modal')) closePreview(); });
$('paperStage').addEventListener('click',openFullPreview);
$('paperStage').addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openFullPreview();} });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('modal').classList.contains('show')) closePreview(); });
window.addEventListener('resize',fitAllPreviews);
window.addEventListener('orientationchange',()=>setTimeout(fitAllPreviews,120));
$('costDesc').addEventListener('input',function(){ this.dataset.manual='1'; saveDraft(); });
$('applyAutoCost').addEventListener('click',()=>{ $('costDesc').dataset.manual='0'; updateCostTextIfAuto(); update(); });
$('unit').addEventListener('change',update);
document.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('change',saveDraft));
addSession();
loadDraft();
update();
