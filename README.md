# 《掌中決》GitHub Pages 靜態網站

這是一個純 HTML、CSS、JavaScript 網站，不需要 Node.js、資料庫或後端伺服器。

## 本機預覽

直接開啟 `index.html` 即可瀏覽；若瀏覽器限制本機影片播放，可使用任一靜態網站伺服器預覽。

## 發布至 GitHub Pages

1. 建立新的 GitHub repository。
2. 將本資料夾內的所有檔案放到 repository 根目錄並推送至 `main` branch。
3. 前往 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**。
5. Branch 選擇 `main`，資料夾選擇 `/ (root)`，再按下 **Save**。

若要保留本資料夾名稱，也可以把檔案放入 repository 的 `docs/`，並在 Pages 設定中選擇 `main` 與 `/docs`。

## 網站檔案

- `index.html`：網站內容與六個主要章節
- `styles.css`：視覺設計與響應式版面
- `app.js`：機台切換及遊戲互動模擬
- `assets/`：圖片、分享預覽圖與宣傳示範影片
- `assets/demo.mp4`：約 30 秒的 1280 × 720 宣傳片，含繁體中文旁白與立體聲配樂
- `.nojekyll`：避免 GitHub Pages 套用 Jekyll 處理

## 更新記錄

- 已將網站影片更新為有聲宣傳版。
- 影片預設不靜音，由使用者按下播放後開始。
- 影片路徑加入版本參數，避免部署後繼續讀取舊的瀏覽器快取。
