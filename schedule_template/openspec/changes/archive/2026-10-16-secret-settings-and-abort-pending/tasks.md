# Tasks

## 1. 隱藏設定按鈕與點擊背景 10 下彩蛋解鎖

- [x] 1.1 在 `index.html` 與 `app.js` 將設定按鈕（`#mapSettingsBtn` 與 `#quotaBadgeBtn`）預設設為 `.hidden`，並實作背景點擊計數器（點擊背景滿 10 下時移除 `.hidden` 顯示設定按鈕，刷新頁面自動恢復隱藏），驗證頁面載入時隱藏且點擊背景 10 下後顯示。

## 2. 取消前次未完成的地圖非同步查詢

- [x] 2.1 在 `app.js` 實作 `AbortController` 與 `activeLookupRequestId` 雙重取消機制，將 `signal` 傳入所有地理編碼 `fetch` 請求（Nominatim、Overpass、BigDataCloud）並校驗 Google Places callback 序號，驗證連續快速點擊不同地點時會立即取消上一次查詢且不會發生舊結果延遲覆蓋畫面的現象。
