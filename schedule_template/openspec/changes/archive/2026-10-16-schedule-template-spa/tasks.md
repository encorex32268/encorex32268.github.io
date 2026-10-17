# Tasks

## 1. 基礎單頁版面與視覺樣式（對照 sample.png）

- [x] 1.1 建立 `index.html` 與 `styles.css`，實作深色圓角邊框雙欄式佈局（左上：DateAndTime Picker、左下：行程資訊卡片與大型 Copy SVG Icon 按鈕、右側：地圖與搜尋列），並在瀏覽器中開啟驗證版面與 `sample.png` 一致且支援響應式縮放。

## 2. 日期時間選擇器與左下角行程卡片連動

- [x] 2.1 在 `app.js` 實作左上角內嵌式日期與時間選擇器（含日曆選取與時間點選），驗證點選任一日期或時間後，左下角的「日期:」與「時間:」欄位會即時更新。
- [x] 2.2 實作左下角「店名、地點、日期、時間」可微調欄位與右下角大型 Copy 圖示按鈕，驗證點擊 Copy 按鈕後能將四行格式化文字複製到系統剪貼簿，且大型圖示會切換為勾選狀態提供視覺回饋。

## 3. 雙模式地圖引擎與省流快取機制

- [x] 3.1 實作本地快取與節流模組（`MapCache` 與 800ms 點擊節流），並建立預設免費 OpenStreetMap (Leaflet + Nominatim) 選點與關鍵字搜尋功能，驗證免 API Key 點擊地圖任一位置即可自動帶入「店名」與合成的 Google Maps URL 至左下角。
- [x] 3.2 實作選填 Google Maps API Key 的設定視窗與省流版 Google Maps 配接器（攔截原生 POI 點擊 `placeId`、限制 Places Field Mask 僅取 `name`/`url`、一般座標點擊免呼叫 API），驗證切換模式與點擊選點行為正常運作。
