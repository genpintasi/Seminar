# 研習計畫申請書產生器

這是一個純前端的 GitHub Pages 靜態網站，不需要登入、資料庫或後端伺服器。

## 功能
- 填寫研習申請資料
- 多場次資料輸入
- 即時 A4 申請書預覽
- 費用自動計算
- 完整預覽
- 直接下載 PDF
- Word 匯出原型

## 部署到 GitHub Pages

1. 在 GitHub 建立一個新的 Repository。
2. 將 `index.html` 上傳到 Repository 根目錄。
3. 到 Repository 的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中：
   - Source 選擇 `Deploy from a branch`
   - Branch 選擇 `main`
   - Folder 選擇 `/ (root)`
5. 儲存後，GitHub 會提供一個 Pages 網址。
6. 使用者開啟該網址即可填寫並下載 PDF。

## PDF 功能
PDF 由瀏覽器端的 html2pdf.js 產生。
所有表單資料只存在使用者目前開啟的頁面，不會上傳到資料庫。

注意：PDF 套件透過 CDN 載入，因此使用者產生 PDF 時需要網路連線。
