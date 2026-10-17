# Design

## Context

目前專案目錄下包含 [`sample.png`](file:///Users/chenlihan/Downloads/schedule_template/sample.png) 設計草圖與 OpenSpec 設定，尚無程式碼。使用者希望建立一個免安裝環境、直接開啟 `index.html` 即可運作的純前端單頁應用程式（SPA），並且特別關注如何防止 Google Maps API 用量消耗過快或超出免費額度（參見 `proposal.md` - Why）。

## Goals / Non-Goals

**Goals:**
- 忠實還原 `sample.png` 的雙欄式深色邊框佈局（左上：DateAndTime Picker、左下：店名/地點/日期/時間 + 右下大 Copy Icon、右側：地圖）。
- 實作雙模式地圖配接器（Map Adapter Pattern），預設使用 100% 免費的 OpenStreetMap (Leaflet)，並支援填入 Google Maps API Key 無縫切換為省流版 Google Maps。
- 實作完整的 Google Maps 配額保護策略（Field Mask 最小化、不綁定即時 Autocomplete、Session Cache、點擊節流）。

**Non-Goals:**
- 不建立後端伺服器或資料庫（所有設定如選填的 API Key 僅存於瀏覽器 `localStorage`）。
- 不實作多人協作或帳號登入系統。

## Decisions

### 1. 純前端無建置工具架構（Vanilla HTML/CSS/JS）
- **決定**：採用原生 HTML5、CSS3（CSS Grid / Flexbox + 自訂深色主題變數）與 ES6+ JavaScript，透過 CDN 引入 Leaflet 與 Lucide/SVG 圖示。
- **理由**：免去 Node.js / Vite 建置步驟，使用者雙擊 `index.html` 或放到任何靜態空間（如 GitHub Pages）即可直接使用，維護成本最低。
- **替代方案**：Vite + React。雖元件化方便，但對此單頁小工具而言增加了不必要的編譯與環境依賴。

### 2. 防止 Google Maps 用量消耗過快的核心策略（雙模式 + 4 層省流機制）
- **決定**：採用「預設免費 OSM + 選填 Google Maps 省流模式」雙軌設計：
  1. **第一層（預設零消耗 - OSM + Nominatim）**：
     - 預設使用 Leaflet 載入 OpenStreetMap 圖磚（完全免費、免 Key）。
     - 點擊地圖時，呼叫 Nominatim Reverse Geocoding API（`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=...&lon=...`）取得店家/建築名稱（`name` 或 `display_name`），並自動合成正統 Google Maps 連結：
       - 若有具體名稱：`https://www.google.com/maps/search/?api=1&query={名稱}+{lat},{lng}`
       - 若僅有座標：`https://www.google.com/maps?q={lat},{lng}`
  2. **第二層（Google Maps 原生 POI 點擊攔截，省去 Geocoding 費用）**：
     - 當使用者切換至 Google Maps 模式並點擊地圖上的店家圖示（POI）時，Google Maps 的 `click` 事件會直接回傳 `IconMouseEvent`，內含免費的 `placeId`！
     - 我們呼叫 `event.stop()` 阻擋預設氣泡視窗，直接拿這個 `placeId` 產生官方連結：`https://www.google.com/maps/search/?api=1&query=Google&query_place_id={placeId}`，並只針對該 `placeId` 請求名稱。
  3. **第三層（嚴格限制 Places API Field Mask 至 Basic 等級）**：
     - Google Places API 採「依請求欄位最高等級計費」。若不限制欄位，預設會拉取聯絡資訊與評論（觸發昂貴的 Contact / Atmosphere SKU）。
     - 在本設計中，向 Google 請求地點詳情時，嚴格鎖定 `fields: ['displayName', 'googleMapsUri']`（或舊版 `['name', 'url']`），確保每次點擊只歸類在最便宜的基礎請求，且一般空白處點擊直接用經緯度合成 URL，完全不呼叫 Places API。
  4. **第四層（不綁定 Keystroke Autocomplete + 本地快取 `MapCache`）**：
     - 搜尋框採「按下 Enter 或搜尋鈕才觸發查詢」而非每打一個字就呼叫 `AutocompleteService`，省下約 80% 搜尋配額。
     - 以 `placeId` 或四捨五入至小數點後 5 位（約 1.1 公尺精度）的 `lat,lng` 作為 Key 存入記憶體與 `sessionStorage`，重複點選同一地點時 0 API 呼叫。

### 3. 日期時間選擇器與左下角摘要連動設計
- **決定**：左上角「DateAndTime Picker」設計為直覺的內嵌式日曆與時間快速選擇面板（同時支援原生日期/時間點選與快速時段按鈕），點選任一日期或時間立即觸發狀態更新，寫入左下角的「日期:」與「時間:」欄位。左下角四個欄位皆為可微調輸入框（點擊地圖自動填入，也可手動修改店名），右下角配置大型 SVG Copy 圖示按鈕。

## Risks / Trade-offs

- **[Risk] Nominatim 免費 API 有每秒 1 次的頻率限制（Rate Limit）** → **Mitigation**：在前端實作 800ms 點擊節流（Debounce/Throttle）與座標快取；若請求失敗，仍保底以經緯度產生有效的 Google Maps URL（`https://www.google.com/maps?q=lat,lng`），並允許使用者在左下角手動輸入店名。
- **[Risk] 使用者在前端填入 Google Maps API Key 儲存在瀏覽器** → **Mitigation**：僅儲存在使用者本機的 `localStorage`，不經過任何第三方伺服器，並在設定介面提示使用者可在 Google Cloud Console 設定 HTTP Referrer 網域限制與每日配額上限（Quota Limit）以保障帳單安全。
