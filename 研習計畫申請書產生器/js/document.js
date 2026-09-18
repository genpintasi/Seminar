// HTML 文件 renderer。所有內容取自 model.js 的 getData()。
function blank(v){return v?esc(v):'＿＿＿＿'}
function docHTML(){
  const d=getData(), teacher=[d.teacher,d.phone,d.email].filter(Boolean).join('／');
  const nature=[d.nature,d.unit?`單位：${d.unit}`:'',d.taxId?`統編：${d.taxId}`:''].filter(Boolean).join('<br>');
  const posterSign=`海報：${d.poster||'＿＿＿＿'}；指示牌：${d.sign||'＿＿＿＿'}`;
  return `<h1>金安文教機構研習計畫申請書</h1><div class="docline">▼申請日：<span class="value">${blank(fmtDate(d.applyDate))}</span></div>
    <div class="docline">一、研習申請區域：<span class="value">${blank(d.region)}</span></div><div class="docline">二、研習類別：<span class="value">${blank(d.type)}</span></div>
    <div class="docline">三、研習時數：<span class="value">${blank(d.hours)}</span>&nbsp;&nbsp; 是否需要申請教師研習時數：<span class="value">${blank(d.teacherCredit)}</span></div>
    <div class="docline">四、研習主題：<span class="value">${blank(d.topic)}</span></div><div class="docline">五、講師／手機／電郵：<span class="value">${blank(teacher)}</span></div>
    <div class="docline">六、辦理日期：<span class="value">${blank(d.dates)}</span></div><div class="docline">七、辦理時間：<span class="value">${blank(d.times)}</span></div>
    <div class="docline">八、辦理地點：<span class="value">${blank(d.places)}</span></div><div class="docline">九、人數限制：<span class="value">${blank(d.people)}</span></div>
    <div class="docblock">十、研習性質：<br><span class="value">${nature||'＿＿＿＿＿＿＿＿＿＿＿＿＿＿'}</span></div><div class="docline">十一、海報、指示牌：<span class="value">${esc(posterSign)}</span></div>
    <div class="docline">十二、雜支費用：<span class="value">${d.miscCost?fmtMoney(d.miscCost)+' 元':'＿＿＿＿'}</span></div><div class="docblock">十三、費用說明：<br><span class="value">${d.costDesc?esc(d.costDesc).replaceAll('\n','<br>'):'＿＿＿＿＿＿＿＿＿＿＿＿＿＿'}</span></div>
    <div class="docblock">十四、其他：${d.other?`<br><span class="value">${esc(d.other).replaceAll('\n','<br>')}</span>`:''}</div><div class="docline">十五、研習完畢請檢附簽到簿、活動照片及相關文件以利核銷。</div><div class="docline">十六、本計畫經主管核可後實施，修正時亦同。</div>
    <table class="signatures" role="presentation" cellspacing="0" cellpadding="0"><tr><td>申請人</td><td>單位主管</td><td>副總</td><td>總經理</td></tr></table>`;
}
