# Proposal

## Why

使用者在安排聚會或行程時，經常需要整理「店名、Google Maps 地點連結、日期、時間」並複製傳送給他人。建立一個直覺的一頁式網站（對照 `sample.png` 佈局），讓使用者能直接點選日期時間與地圖上的地點，自動填入左下角模板並透過大型 Copy 圖示一鍵複製，同時採用雙模式地圖架構（預設免費 OpenStreetMap + 可選填 Google Maps API Key 節流模式）以避免 Google Maps API 額度快速消耗或產生高額費用。

## What Changes

- 建立免安裝、純前端的一頁式網站（`index.html`、`styles.css`、`app.js`），支援深色主題手繪邊框/卡片式視覺風格，左側為「日期時間選擇器」與「行程資訊預覽與大型 Copy 圖示按鈕」，右側為「互動式地圖」。
- 新增雙模式互動地圖引擎：
  - **預設免費模式（OSM + Leaflet + Nominatim / Overpass POI 查詢）**：100% 免費且免 API Key，支援關鍵字搜尋、點擊地圖取得地點名稱與座標，並自動合成標準 Google Maps URL。
  - **Google Maps 省流模式（選填 API Key）**：當使用者設定自有 API Key 時可切換為原生 Google Maps JS API；透過攔截原生 POI 點擊事件（`IconMouseEvent.placeId`）搭配 Places API (New) 最小化 Field Mask（僅取 `displayName`, `googleMapsUri`）與本地快取，將 API 消耗降至最低。
- 新增日期與時間選擇器（DateAndTime Picker），選取後即時同步至左下角摘要區塊。
- 新增左下角行程摘要卡片，包含「店名、地點（Map URL）、日期、時間」（支援點擊自動帶入與手動微調）以及右下角大型 Copy Icon 按鈕（支援一鍵複製格式化文字與複製成功視覺回饋）。

## Capabilities

### New Capabilities
- `map-location-picker`: 負責右側互動式地圖顯示、地點搜尋、點擊地圖擷取店名與 Google Maps 連結，以及免費 OSM 模式與 Google Maps API 省流模式的切換與額度保護機制。
- `schedule-card-generator`: 負責左上角日期時間選擇器、左下角行程摘要資訊（店名、地點、日期、時間）的即時綁定與編輯，以及右下角大型 Copy 圖示按鈕的一鍵剪貼簿複製功能。

### Modified Capabilities
<!-- 無既有 capability 變更 -->

## Impact

- 新增前端靜態檔案：`index.html`、`styles.css`、`app.js`。
- 外部 CDN 與公開 API 依賴：
  - Leaflet CSS/JS（用於免費模式地圖渲染）
  - OpenStreetMap Tile Server & Nominatim Reverse Geocoding / Search API（免費地理編碼）
  - Google Maps JavaScript API（僅在使用者主動填入 API Key 並切換至 Google 模式時動態載入）
