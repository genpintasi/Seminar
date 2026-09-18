// 場次資料的時間計算規則。
// 目前實際函式由 model.js 提供，這個模組保留場次領域的責任邊界。
function isValidSessionTime(session){ return sessionDuration(session)>0; }
