# 臺灣華語 Taiwan Mandarin

給外國人學臺灣華語的 RPG 遊戲。純靜態網站，不需要建置步驟，也沒有後端。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` | 遊戲頁面 |
| `assets/style.ebfa3b42db.css` | 樣式 |
| `assets/app.c1c4cd117c.js` | 遊戲程式與題庫（檔名含雜湊值，可長期快取） |
| `favicon.svg`、`site.webmanifest` | 網站圖示與「加到主畫面」設定 |
| `vercel.json` | Vercel 設定（快取與安全性標頭） |

## 部署到 Vercel

### 方法一：Vercel CLI

```bash
npm i -g vercel
cd taiwan-mandarin-vercel
vercel          # 第一次會問專案設定，Framework 選 Other，其他用預設值
vercel --prod   # 正式上線
```

### 方法二：從 GitHub 匯入

1. 把這個資料夾推上一個 GitHub repository。
2. 在 Vercel 點 **Add New → Project**，選這個 repository。
3. **Framework Preset** 選 **Other**，Build Command 和 Output Directory 都留空。
4. 按 **Deploy**。

### 方法三：直接拖曳

在 Vercel 的新增專案頁面，把整個資料夾拖進去也可以部署。

## 本機預覽

```bash
npx serve .
# 或
python3 -m http.server 8080
```

## 注意事項

- **存檔**：進度存在玩家瀏覽器的 localStorage，換裝置或清除瀏覽資料就會不見。
- **聽力語音**：使用瀏覽器內建的語音合成，而且只用臺灣華語（zh-TW）語音。裝置沒有臺灣語音時，聽力題會改成顯示文字。正式版建議換成錄好的真人音檔。
- **字型**：從 Google Fonts 載入。
- **題庫**：依臺師大《當代中文課程》各冊主題編排的原創練習句；若要使用課本原文，需先取得授權。
