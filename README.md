# 臺灣華語 Taiwan Mandarin

給外國人學臺灣華語的 RPG 遊戲。地圖畫面用 [PlayCanvas](https://playcanvas.com/) 引擎繪製，用 Vite 建置，沒有後端。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 遊戲頁面 |
| `src/main.js` | 進入點：建立畫面、接上輸入、開始遊戲 |
| `src/state.js` | 遊戲狀態（玩家存檔 `S`、目前地圖 `MAP`）與存讀檔；只能用 `setPlayer`／`setMap` 換掉 |
| `src/scene.js` | 遊戲模式（title、world、dialog、choice、menu、battle、cut）；只能用 `setMode` 切換 |
| `src/world/` | 地圖：產生（`maps.js`）、人物外觀（`looks.js`）、移動與換地圖（`overworld.js`）、要畫什麼（`map-view.js`） |
| `src/battle/` | 對戰、遭遇、道館、語言大聯盟 |
| `src/town/` | 室內：旅館、商店、茶店、廟、路人 |
| `src/ui/` | 對話框、HUD、面板、選單 |
| `src/scenes/` | 標題畫面、開場與搭車動畫 |
| `src/render/` | 繪圖引擎，和遊戲內容無關：`view.js`（攝影機、貼圖快取、依深度排序），後端 `backend-webgl.js`（PlayCanvas）與 `backend-canvas.js`（沒有 WebGL 時的備案） |
| `src/art.js` | 程序美術：用 2D 畫布畫樹、建築、人物、動物、徽章、室內 |
| `src/art/pixel-tiles.js` | 城鎮地面的像素地塊（草地、石板路、泥土路、高草叢、水），直接用調色盤畫 |
| `src/render/pixel.js` | 掌機像素風：調色盤 `PALETTE`、把美術畫成每格 16 點再收成四色並整數倍放大；招牌上的字放大後才畫，保持清楚 |
| `src/text.js`、`src/i18n.js`、`src/speech.js` | 拼音／注音、多語文字、臺灣口音語音 |
| `src/content.js`、`src/quiz.js`、`src/progress.js` | 題庫整理、出題、經驗值與金錢 |
| `src/data/` | 題庫與內容 |
| `src/style.css` | 樣式 |
| `public/` | 網站圖示與「加到主畫面」設定，原樣複製到輸出 |
| `vercel.json` | Vercel 設定（建置、快取與安全性標頭） |

對話框、選單、HUD、對戰畫面和過場動畫是 HTML 與 2D 畫布，疊在地圖畫面上。
整個遊戲只用四個綠色階（掌機風格）：地圖、對戰、過場動畫的畫布都經過 `src/render/pixel.js` 轉換，CSS 也只用這四個顏色。
裝置不支援 WebGL 時，地圖會自動改用 2D 畫布繪製；網址加 `?renderer=2d` 可以強制使用。
地圖上要加新的物件類型，只要在 `src/world/map-view.js` 的 `OBJECTS` 加一個項目。

## 開發

```bash
npm install
npm run dev       # 開發伺服器
npm run build     # 輸出到 dist/
npm run preview   # 預覽 dist/
```

## 部署到 Vercel

`vercel.json` 已經指定 Vite 建置（`npm run build`，輸出 `dist/`），不用另外設定。

### 方法一：Vercel CLI

```bash
npm i -g vercel
vercel          # 第一次會問專案設定，用預設值即可
vercel --prod   # 正式上線
```

### 方法二：從 GitHub 匯入

1. 把這個資料夾推上一個 GitHub repository。
2. 在 Vercel 點 **Add New → Project**，選這個 repository。
3. **Framework Preset** 會自動選 **Vite**。
4. 按 **Deploy**。

## 注意事項

- **存檔**：進度存在玩家瀏覽器的 localStorage，換裝置或清除瀏覽資料就會不見。
- **聽力語音**：使用瀏覽器內建的語音合成，而且只用臺灣華語（zh-TW）語音。裝置沒有臺灣語音時，聽力題會改成顯示文字。正式版建議換成錄好的真人音檔。
- **字型**：從 Google Fonts 載入。
- **題庫**：依臺師大《當代中文課程》各冊主題編排的原創練習句；若要使用課本原文，需先取得授權。
