# Spec Delta

## Purpose

提供互動式地圖選點與地點搜尋功能，支援點擊地圖自動擷取店名與產生 Google Maps 連結，並內建免費 OpenStreetMap 模式與低配額消耗的 Google Maps API 模式切換機制。

## ADDED Requirements

### Requirement: 預設免費地圖模式（OSM）點擊選點與連結合成
系統 SHALL 預設載入免 API Key 的免費地圖模式，當使用者點擊地圖任一位置或搜尋結果時，系統 MUST 查詢該座標之場所名稱或地址，並自動產生對應的 Google Maps 連結回傳給行程摘要區塊。

#### Scenario: 點擊免費地圖上的店家或座標
- **WHEN** 使用者在預設免費地圖模式下點擊地圖上某一個位置
- **THEN** 系統在地圖上標記該點、向免費逆地理編碼服務查詢該處名稱，並將「店名」與合成的 Google Maps URL 更新至左下角行程資訊區

#### Scenario: 在免費地圖模式透過關鍵字搜尋地點
- **WHEN** 使用者在地圖搜尋框輸入關鍵字並執行搜尋與點選結果
- **THEN** 地圖自動移動至該地點並標記，同時將該地點名稱與對應的 Google Maps URL 更新至左下角行程資訊區

### Requirement: Google Maps API 省流模式切換與點擊擷取
系統 SHALL 提供設定介面讓使用者選填自有的 Google Maps API Key 以切換至原生 Google Maps 模式；在此模式下，系統 MUST 僅透過點擊事件與最小化欄位遮罩（Field Mask）擷取地點資訊，避免自動完成（Autocomplete）按鍵計費與高價欄位消耗。

#### Scenario: 設定 API Key 並點擊原生 Google Map 上的 POI 圖示
- **WHEN** 使用者已設定有效的 Google Maps API Key 並點擊地圖上的原生店家圖示（POI）
- **THEN** 系統攔截預設資訊窗、利用事件中的 `placeId` 與最小欄位要求（僅名稱與連結）取得店名與官方 Google Maps 短連結，並同步至左下角行程資訊區

#### Scenario: 點擊無 POI 的一般座標點
- **WHEN** 使用者在 Google Maps 模式下點擊非特定店家的一般地圖座標
- **THEN** 系統直接使用點擊之經緯度合成 Google Maps 座標連結並更新至左下角行程資訊區，不額外發起計費的 Places Details 請求

### Requirement: 地圖查詢節流與本地快取保護
系統 MUST 對地圖點擊查詢與關鍵字搜尋實施冷卻節流（Debounce/Throttle）與本地座標/地點快取，防止短時間重複點擊消耗免費或付費 API 額度。

#### Scenario: 重複點擊相同地點
- **WHEN** 使用者再次點擊已經查詢過的相同地點或座標範圍
- **THEN** 系統直接從本地快取讀取店名與 Google Maps URL，不重複發送外部 API 請求
