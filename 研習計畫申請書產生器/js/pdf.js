// PDF／列印輸出。PDF 採瀏覽器原生列印，確保與列印結果一致。
function printDocument(){ if(!guardDocumentGeneration()) return; update(); window.print(); }
function downloadPDF(){ if(!guardDocumentGeneration()) return; update(); window.print(); }
