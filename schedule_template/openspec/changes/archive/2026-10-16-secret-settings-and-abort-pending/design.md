# Design

## Context

使用者希望進一步優化單頁行程產生器的互動體驗（參見 `proposal.md` - Why）：
1. 預設隱藏設定按鈕，只有在點擊背景滿 10 下時才出現，且重新整理頁面後自動恢復隱藏。
2. 點擊地圖查詢地點名稱時，若前一次的非同步請求尚未完成，必須立即取消前一次請求，避免舊回應稍後完成時「自己更新」覆蓋畫面。

## Goals / Non-Goals

**Goals:**
- 實作記憶體層級（不寫入 `localStorage`）的背景點擊計數器，點擊背景達 10 下時顯示設定按鈕。
- 使用 `AbortController` 搭配遞增的 `activeLookupRequestId` 雙重保障，徹底取消未完成的 `fetch` 請求（Nominatim / Overpass / BigDataCloud）並丟棄過期的 Google Places callback。

**Non-Goals:**
- 設定按鈕的顯示狀態不跨頁面持久化（刷新頁面即隱藏）。

## Decisions

### 1. 點擊背景 10 下顯示設定按鈕
- **決定**：
  - 在 `index.html` 將 `#mapSettingsBtn`（以及可開啟設定的 `#quotaBadgeBtn`）預設加上 `.hidden` 類別。
  - 在 `app.js` 維護 `state.bgClickCount = 0`。監聽 `document.body` 的 `click` 事件，當 `event.target` 為背景區域（例如 `document.body`、`.app-shell`、或卡片標題/空白處，排除地圖畫布 `.map-viewport`、輸入框 `input`、按鈕 `button`、日曆格子 `.day-cell` 與對話框 `dialog`）時，`bgClickCount++`。
  - 當 `bgClickCount >= 10` 時，移除 `#mapSettingsBtn`（與 `#quotaBadgeBtn`）的 `.hidden` 類別，並在狀態列提示「🔓 已解鎖隱藏設定按鈕」。因為 `bgClickCount` 僅存於 JS 記憶體變數，重新整理頁面自然歸零並恢復隱藏。

### 2. 非同步地點查詢取消機制（`AbortController` + `activeLookupRequestId`）
- **決定**：
  - 在 `state` 中維護 `activeAbortController: null` 與 `activeLookupRequestId: 0`。
  - 每次觸發地圖選點（`handleOsmMapClick` 或 `handleGoogleMapClick`）時：
    1. 若 `state.activeAbortController` 存在，立即呼叫 `state.activeAbortController.abort()` 中斷所有進行中的 `fetch` 請求（Nominatim、Overpass、BigDataCloud 均傳入 `{ signal }`）。
    2. 建立新的 `AbortController` 並將 `const requestId = ++state.activeLookupRequestId` 綁定於當次呼叫。
    3. 在任何 `await` 或 Google `PlacesService.getDetails` callback 回傳後，先檢查 `if (signal.aborted || requestId !== state.activeLookupRequestId) return;`，若已過期則直接靜默丟棄，絕不呼叫 `updateLocationSummary` 或移動標記。
  - 同時移除原有的 650ms 拒絕點擊冷卻限制，讓使用者隨時點擊新位置都能立即取消舊請求並響應新位置。

## Risks / Trade-offs

- **[Risk] Google Maps JS SDK 的 `PlacesService.getDetails` 使用傳統 callback 不原生支援 `AbortSignal`** → **Mitigation**：結合 `requestId !== state.activeLookupRequestId` 檢查，當使用者在等待期間點擊了其他位置，舊 callback 回來時因 `requestId` 不符會被立即忽略，不會更新 UI。
