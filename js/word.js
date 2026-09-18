// Word 輸出 renderer。
function downloadWord(){
  if(!guardDocumentGeneration()) return; update();
  const html=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>研習計畫申請書</title><style>body{font-family:"Microsoft JhengHei","PMingLiU",serif;font-size:10.5pt;line-height:1.55}h1{text-align:center;font-size:15pt;font-weight:bold;margin-bottom:18px}.docline,.docblock{margin:3px 0}.signatures{width:100%;margin-top:36px;border-collapse:collapse}.signatures td{width:25%;border-top:1px solid black;text-align:center;padding-top:6px}</style></head><body>${$('paper').innerHTML}</body></html>`;
  const blob=new Blob(['\ufeff',html],{type:'application/msword'}), url=URL.createObjectURL(blob), link=document.createElement('a'); link.href=url; link.download=filename('doc'); document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
