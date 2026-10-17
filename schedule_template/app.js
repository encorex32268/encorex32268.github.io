/**
 * GatherSpot — 聚會行程地點產生器
 *
 * 核心特色：
 * 1. 左上角寬敞內嵌式日曆與時間選擇器（點選即時同步至左下角）
 * 2. 左下角緊湊聚會資訊卡（店名、地點 Map URL、日期、時間）與右下角大型 Copy Icon 按鈕
 * 3. 店名與地點 URL 100% 精準對齊：
 *    - Google Maps 模式：點擊 POI 圖示時透過新版 Place.fetchFields -> PlacesService.getDetails -> Geocoder(placeId) 三重官方管道取得「同一個 placeId」的真實名稱與官方連結，絕不張冠李戴抓到隔壁店家。
 *    - 免費 OSM 模式：同時擷取該點的「名稱 + 行政區路名 + 精準經緯度」，合成帶有座標/地址錨點的 Google Maps URL，確保點開連結與店名位置完全一致。
 * 4. 點擊新地點時若前一次還在非同步讀取地名，立即透過 AbortController + RequestId 取消上一次處理
 * 5. 設定按鈕預設隱藏，點擊頁面背景滿 10 下才會出現（刷新頁面自動恢復隱藏）
 * 6. 地圖主題隨時間（06:00~18:00 淺色日間模式，18:00~06:00 深色夜間模式）自動切換
 */

(() => {
  'use strict';

  // ==================== 狀態管理 ====================
  const state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    selectedTime: getCurrentRoundedTime(),
    mapMode: localStorage.getItem('schedule_map_mode') || 'osm', // 'osm' | 'google'
    googleApiKey: localStorage.getItem('schedule_google_api_key') || '',
    // 背景點擊 10 下解鎖設定按鈕（僅存記憶體，刷新頁面即歸零並隱藏）
    bgClickCount: 0,
    settingsUnlocked: false,
    // 非同步查詢取消控制（AbortController + 遞增序號）
    activeAbortController: null,
    activeLookupRequestId: 0,
    // 記錄最後一次地圖選點的座標，供手動改店名時同步更新精準連結
    lastPickedCoords: null,
    osmMap: null,
    osmMarker: null,
    googleMap: null,
    googleMarker: null,
    googlePlacesService: null,
    googleGeocoder: null,
    googleScriptLoaded: false,
  };

  function getCurrentRoundedTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = now.getMinutes() < 30 ? '00' : '30';
    return `${hh}:${mm}`;
  }

  // ==================== 取消前一次未完成的非同步地點讀取 ====================
  function beginNewLocationLookup() {
    if (state.activeAbortController) {
      try {
        state.activeAbortController.abort();
      } catch (_) {}
    }
    const controller = new AbortController();
    state.activeAbortController = controller;
    const requestId = ++state.activeLookupRequestId;
    return {
      signal: controller.signal,
      requestId,
      isCurrent() {
        return !controller.signal.aborted && requestId === state.activeLookupRequestId;
      },
    };
  }

  // ==================== 日夜地圖配色判斷 (06:00 <= time < 18:00 為淺色，其餘深色) ====================
  function isDaytimeHours(timeStr) {
    let totalMinutes;
    if (typeof timeStr === 'string' && /^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
      const [h, m] = timeStr.trim().split(':').map(Number);
      totalMinutes = h * 60 + m;
    } else {
      const now = new Date();
      totalMinutes = now.getHours() * 60 + now.getMinutes();
    }
    return totalMinutes >= 360 && totalMinutes < 1080;
  }

  // ==================== 本地快取模組 (MapCache) ====================
  const CACHE_STORAGE_KEY = 'schedule_map_location_cache_v3';

  const MapCache = {
    store: new Map(),

    init() {
      try {
        const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.entries(parsed).forEach(([k, v]) => this.store.set(k, v));
        }
      } catch (err) {
        console.warn('無法載入本地地圖快取:', err);
      }
      this.updateUIStats();
    },

    persist() {
      try {
        const obj = Object.fromEntries(this.store.entries());
        sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
      } catch (err) {
        console.warn('無法寫入本地地圖快取:', err);
      }
      this.updateUIStats();
    },

    coordKey(lat, lng) {
      return `coord:${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
    },

    placeKey(placeId) {
      return `place:${placeId}`;
    },

    get(key) {
      return this.store.get(key) || null;
    },

    set(key, value) {
      this.store.set(key, {
        ...value,
        cachedAt: Date.now(),
      });
      this.persist();
    },

    clear() {
      this.store.clear();
      try {
        sessionStorage.removeItem(CACHE_STORAGE_KEY);
      } catch (_) {}
      this.updateUIStats();
    },

    updateUIStats() {
      const statsEl = document.getElementById('cacheStatsText');
      if (statsEl) {
        statsEl.textContent = `已快取地點數：${this.store.size} 筆（重複點擊 0 消耗）`;
      }
    },
  };

  // ==================== Google Maps URL 合成工具（確保店名與地點位置 100% 一致） ====================
  function buildGoogleMapsUrl({ name, address, lat, lng, placeId }) {
    const hasCoords = lat !== undefined && lng !== undefined;
    const coordStr = hasCoords ? `${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}` : '';

    // 1. 有官方 placeId 時，以 placeId 為權威目標，並帶上店名或座標作為 query
    if (placeId) {
      const queryPart = name ? name : coordStr || 'Google';
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryPart)}&query_place_id=${encodeURIComponent(placeId)}`;
    }

    // 2. 無 placeId（如免費 OSM 模式或點擊一般位置）：
    //    為了避免只搜尋「全家」或「星巴克」而跳到外縣市分店，將「店名 + 區域路名」或「店名 + 經緯度」一起編入搜尋！
    if (name && hasCoords) {
      const contextQuery =
        address && !address.includes(name) ? `${name} ${address}` : `${name} ${coordStr}`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contextQuery)}`;
    }

    if (hasCoords) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordStr)}`;
    }

    if (name) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
    }

    return '';
  }

  // ==================== DOM 元素參照 ====================
  const dom = {
    calendarMonthLabel: document.getElementById('calendarMonthLabel'),
    calendarGrid: document.getElementById('calendarGrid'),
    prevMonthBtn: document.getElementById('prevMonthBtn'),
    nextMonthBtn: document.getElementById('nextMonthBtn'),
    todayBtn: document.getElementById('todayBtn'),
    timeInput: document.getElementById('timeInput'),
    quickTimeList: document.getElementById('quickTimeList'),

    storeNameInput: document.getElementById('storeNameInput'),
    locationUrlInput: document.getElementById('locationUrlInput'),
    openMapLink: document.getElementById('openMapLink'),
    dateOutputInput: document.getElementById('dateOutputInput'),
    timeOutputInput: document.getElementById('timeOutputInput'),
    copyBtn: document.getElementById('copyBtn'),
    copyStatusToast: document.getElementById('copyStatusToast'),

    mapSearchForm: document.getElementById('mapSearchForm'),
    mapSearchInput: document.getElementById('mapSearchInput'),
    searchResultsList: document.getElementById('searchResultsList'),
    quotaBadgeBtn: document.getElementById('quotaBadgeBtn'),
    quotaBadge: document.getElementById('quotaBadge'),
    locateMeBtn: document.getElementById('locateMeBtn'),
    mapSettingsBtn: document.getElementById('mapSettingsBtn'),
    osmMapContainer: document.getElementById('osmMapContainer'),
    googleMapContainer: document.getElementById('googleMapContainer'),
    mapStatusBanner: document.getElementById('mapStatusBanner'),

    settingsDialog: document.getElementById('settingsDialog'),
    settingsForm: document.getElementById('settingsForm'),
    closeDialogBtn: document.getElementById('closeDialogBtn'),
    cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
    googleApiKeyInput: document.getElementById('googleApiKeyInput'),
    clearCacheBtn: document.getElementById('clearCacheBtn'),
  };

  // ==================== 視覺高亮輔助 ====================
  function flashInput(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('flash-highlight');
    void inputEl.offsetWidth;
    inputEl.classList.add('flash-highlight');
  }

  function setStatusBanner(message) {
    if (dom.mapStatusBanner) {
      dom.mapStatusBanner.textContent = message;
    }
  }

  // ==================== 點擊背景 10 下顯示設定按鈕（刷新頁面即恢復隱藏） ====================
  function updateSettingsButtonsVisibility() {
    if (!dom.mapSettingsBtn || !dom.quotaBadgeBtn) return;
    dom.mapSettingsBtn.classList.toggle('hidden', !state.settingsUnlocked);
    dom.quotaBadgeBtn.classList.toggle('hidden', !state.settingsUnlocked);
  }

  function initSecretBackgroundClickUnlock() {
    state.bgClickCount = 0;
    state.settingsUnlocked = false;
    updateSettingsButtonsVisibility();

    document.addEventListener('click', (e) => {
      if (state.settingsUnlocked) return;

      const target = e.target;
      if (
        target.closest(
          'button, input, a, label, dialog, .map-viewport, .calendar-grid, .search-bar, .search-results-list'
        )
      ) {
        return;
      }

      state.bgClickCount += 1;
      if (state.bgClickCount >= 10) {
        state.settingsUnlocked = true;
        updateSettingsButtonsVisibility();
        setStatusBanner('🔓 已解鎖隱藏設定按鈕（重新整理頁面後將自動隱藏）');
      }
    });
  }

  // ==================== 地圖日夜主題切換（06:00~18:00 淺色 / 18:00~06:00 深色） ====================
  const GOOGLE_DARK_MAP_STYLES = [
    { elementType: 'geometry', stylers: [{ color: '#1d222f' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1d222f' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#30394d' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#424f6b' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0f1521' }],
    },
  ];

  function updateMapThemeByTime(timeOverride) {
    const isLight = isDaytimeHours(timeOverride);

    if (dom.osmMapContainer) {
      dom.osmMapContainer.classList.toggle('map-theme-light', isLight);
      dom.osmMapContainer.classList.toggle('map-theme-dark', !isLight);
    }

    if (state.googleMap) {
      state.googleMap.setOptions({
        styles: isLight ? null : GOOGLE_DARK_MAP_STYLES,
      });
    }
  }

  // ==================== 左上角：日期與時間選擇器 ====================
  const WEEKDAY_NAMES = ['日', '一', '二', '三', '四', '五', '六'];

  function formatDateString(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const w = WEEKDAY_NAMES[dateObj.getDay()];
    return `${y}/${m}/${d} (${w})`;
  }

  function isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function renderCalendar() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();
    dom.calendarMonthLabel.textContent = `${year} 年 ${month + 1} 月`;

    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    dom.calendarGrid.innerHTML = '';
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'day-cell';

      let cellDate;
      if (i < startDayOfWeek) {
        const dayNum = daysInPrevMonth - startDayOfWeek + i + 1;
        cellDate = new Date(year, month - 1, dayNum);
        btn.classList.add('other-month');
      } else if (i >= startDayOfWeek + daysInMonth) {
        const dayNum = i - (startDayOfWeek + daysInMonth) + 1;
        cellDate = new Date(year, month + 1, dayNum);
        btn.classList.add('other-month');
      } else {
        const dayNum = i - startDayOfWeek + 1;
        cellDate = new Date(year, month, dayNum);
      }

      btn.textContent = cellDate.getDate();

      if (isSameDay(cellDate, today)) {
        btn.classList.add('today');
      }
      if (isSameDay(cellDate, state.selectedDate)) {
        btn.classList.add('selected');
        btn.setAttribute('aria-selected', 'true');
      }

      btn.addEventListener('click', () => {
        state.selectedDate = cellDate;
        state.currentMonth = new Date(cellDate.getFullYear(), cellDate.getMonth(), 1);
        renderCalendar();
        syncDateToOutput();
      });

      dom.calendarGrid.appendChild(btn);
    }
  }

  function syncDateToOutput() {
    dom.dateOutputInput.value = formatDateString(state.selectedDate);
    flashInput(dom.dateOutputInput);
  }

  function renderScrollableTimeSlots() {
    if (!dom.quickTimeList) return;
    dom.quickTimeList.innerHTML = '';
    for (let h = 0; h < 24; h++) {
      for (const m of ['00', '30']) {
        const timeStr = `${String(h).padStart(2, '0')}:${m}`;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-chip';
        btn.dataset.time = timeStr;
        btn.textContent = timeStr;
        dom.quickTimeList.appendChild(btn);
      }
    }
  }

  function syncTimeToOutput(timeStr, triggeredByUser = false) {
    state.selectedTime = timeStr;
    dom.timeInput.value = timeStr;
    dom.timeOutputInput.value = timeStr;
    flashInput(dom.timeOutputInput);

    let activeChip = null;
    const chips = dom.quickTimeList.querySelectorAll('.time-chip');
    chips.forEach((chip) => {
      const isMatch = chip.dataset.time === timeStr;
      chip.classList.toggle('active', isMatch);
      if (isMatch) activeChip = chip;
    });

    if (activeChip && dom.quickTimeList) {
      const container = dom.quickTimeList;
      const targetScrollTop =
        activeChip.offsetTop -
        container.offsetTop -
        container.clientHeight / 2 +
        activeChip.clientHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: triggeredByUser ? 'smooth' : 'auto',
      });
    }

    updateMapThemeByTime(triggeredByUser ? timeStr : undefined);
  }

  function initDateTimePicker() {
    renderScrollableTimeSlots();
    renderCalendar();
    syncDateToOutput();
    syncTimeToOutput(state.selectedTime, false);

    dom.prevMonthBtn.addEventListener('click', () => {
      state.currentMonth = new Date(
        state.currentMonth.getFullYear(),
        state.currentMonth.getMonth() - 1,
        1
      );
      renderCalendar();
    });

    dom.nextMonthBtn.addEventListener('click', () => {
      state.currentMonth = new Date(
        state.currentMonth.getFullYear(),
        state.currentMonth.getMonth() + 1,
        1
      );
      renderCalendar();
    });

    dom.todayBtn.addEventListener('click', () => {
      const now = new Date();
      state.selectedDate = now;
      state.currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      renderCalendar();
      syncDateToOutput();
      updateMapThemeByTime();
    });

    dom.timeInput.addEventListener('input', (e) => {
      if (e.target.value) {
        syncTimeToOutput(e.target.value, true);
      }
    });

    dom.quickTimeList.addEventListener('click', (e) => {
      const chip = e.target.closest('.time-chip');
      if (!chip) return;
      syncTimeToOutput(chip.dataset.time, true);
    });
  }

  // ==================== 左下角：行程摘要與大 Copy 圖示按鈕 ====================
  function updateLocationSummary({ name, url, lat, lng, placeId, address }) {
    if (lat !== undefined && lng !== undefined) {
      state.lastPickedCoords = { lat, lng, placeId: placeId || null, address: address || '' };
    }
    if (name !== undefined) {
      dom.storeNameInput.value = name;
      flashInput(dom.storeNameInput);
    }
    if (url !== undefined) {
      dom.locationUrlInput.value = url;
      flashInput(dom.locationUrlInput);
      updateOpenMapLinkIcon(url);
    }
  }

  function updateOpenMapLinkIcon(url) {
    if (url && /^https?:\/\//i.test(url.trim())) {
      dom.openMapLink.href = url.trim();
      dom.openMapLink.classList.remove('hidden');
    } else {
      dom.openMapLink.classList.add('hidden');
    }
  }

  function buildCopyText() {
    const storeName = dom.storeNameInput.value.trim();
    const locationUrl = dom.locationUrlInput.value.trim();
    const dateText = dom.dateOutputInput.value.trim();
    const timeText = dom.timeOutputInput.value.trim();

    return [
      `店名: ${storeName}`,
      `地點: ${locationUrl}`,
      `日期: ${dateText}`,
      `時間: ${timeText}`,
    ].join('\n');
  }

  let copyFeedbackTimer = null;

  async function handleCopyClick() {
    const textToCopy = buildCopyText();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const tempArea = document.createElement('textarea');
        tempArea.value = textToCopy;
        tempArea.style.position = 'fixed';
        tempArea.style.opacity = '0';
        document.body.appendChild(tempArea);
        tempArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempArea);
      }

      const copyIcon = dom.copyBtn.querySelector('.copy-icon');
      const checkIcon = dom.copyBtn.querySelector('.check-icon');
      const caption = dom.copyBtn.querySelector('.copy-btn-caption');

      dom.copyBtn.classList.add('copied');
      copyIcon.classList.add('hidden');
      checkIcon.classList.remove('hidden');
      caption.textContent = 'COPIED';
      dom.copyStatusToast.textContent = '已複製！';
      dom.copyStatusToast.classList.add('visible');

      if (copyFeedbackTimer) clearTimeout(copyFeedbackTimer);
      copyFeedbackTimer = setTimeout(() => {
        dom.copyBtn.classList.remove('copied');
        copyIcon.classList.remove('hidden');
        checkIcon.classList.add('hidden');
        caption.textContent = 'COPY';
        dom.copyStatusToast.classList.remove('visible');
      }, 1800);
    } catch (err) {
      console.error('複製失敗:', err);
      dom.copyStatusToast.textContent = '複製失敗';
      dom.copyStatusToast.classList.add('visible');
    }
  }

  function initOutputCard() {
    dom.locationUrlInput.addEventListener('input', (e) => {
      updateOpenMapLinkIcon(e.target.value);
    });
    // 當使用者手動修改「店名」時，若先前有選點座標，同步更新「地點」URL 的 query 參數，讓店名與地點連結永遠對齊
    dom.storeNameInput.addEventListener('input', (e) => {
      const customName = e.target.value.trim();
      if (!customName) return;
      if (state.lastPickedCoords) {
        const syncedUrl = buildGoogleMapsUrl({
          name: customName,
          address: state.lastPickedCoords.address,
          lat: state.lastPickedCoords.lat,
          lng: state.lastPickedCoords.lng,
          placeId: state.lastPickedCoords.placeId,
        });
        dom.locationUrlInput.value = syncedUrl;
        updateOpenMapLinkIcon(syncedUrl);
      }
    });
    dom.timeOutputInput.addEventListener('input', (e) => {
      if (/^\d{1,2}:\d{2}$/.test(e.target.value.trim())) {
        updateMapThemeByTime(e.target.value.trim());
      }
    });
    dom.copyBtn.addEventListener('click', handleCopyClick);
  }

  // 免費模式下：不使用免費店名猜測，直接擷取乾淨的「路名／門牌地址」
  function extractRoadNameFromNominatim(data) {
    if (!data) return null;
    const addr = data.address || {};

    const city = addr.city || addr.county || '';
    const district = addr.suburb || addr.city_district || addr.town || addr.village || '';
    const road =
      addr.road ||
      addr.pedestrian ||
      addr.footway ||
      addr.cycleway ||
      addr.path ||
      addr.neighbourhood ||
      '';
    const houseNo = addr.house_number
      ? addr.house_number.endsWith('號')
        ? addr.house_number
        : `${addr.house_number}號`
      : '';

    if (road) {
      return `${district}${road}${houseNo}`;
    }
    if (district) {
      return `${city}${district}`;
    }
    if (data.display_name) {
      return data.display_name.split(',')[0].trim();
    }
    return null;
  }

  // 直接抓取點擊座標的「路名地址」
  async function resolvePlaceDetailsByCoords(lat, lng, signal) {
    // 1. Nominatim 直接擷取路名與門牌
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1&accept-language=zh-TW,zh`,
        { signal }
      );
      if (resp.ok) {
        const data = await resp.json();
        const roadAddress = extractRoadNameFromNominatim(data);
        if (roadAddress) {
          return {
            name: roadAddress,
            address: roadAddress,
            lat,
            lng,
          };
        }
      }
    } catch (err) {
      if (signal && signal.aborted) throw err;
      console.warn('Nominatim 路名查詢暫時無法連線:', err);
    }

    if (signal && signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 2. BigDataCloud 保底擷取行政區與路名
    try {
      const bdcResp = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&localityLanguage=zh`,
        { signal }
      );
      if (bdcResp.ok) {
        const bdc = await bdcResp.json();
        const locality = bdc.locality || bdc.city || bdc.principalSubdivision || '';
        const informative =
          (bdc.localityInfo &&
            bdc.localityInfo.informative &&
            bdc.localityInfo.informative.slice(-1)[0]?.name) ||
          '';
        const combined = `${locality}${informative && informative !== locality ? informative : ''}`.trim();
        if (combined) {
          return { name: combined, address: combined, lat, lng };
        }
      }
    } catch (err) {
      if (signal && signal.aborted) throw err;
    }

    return { name: '選取路段', address: '', lat, lng };
  }

  // ==================== 地圖引擎 1：預設免費智慧模式 (Leaflet) ====================
  const DEFAULT_CENTER = { lat: 25.033964, lng: 121.564468 }; // 預設台北 101 商圈

  function initOsmMap() {
    updateMapThemeByTime();

    if (state.osmMap) return;

    state.osmMap = L.map(dom.osmMapContainer, {
      center: [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng],
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(state.osmMap);

    state.osmMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      handleOsmMapClick(lat, lng);
    });
  }

  function setOsmMarker(lat, lng, popupTitle) {
    if (!state.osmMap) return;
    if (!state.osmMarker) {
      state.osmMarker = L.marker([lat, lng]).addTo(state.osmMap);
    } else {
      state.osmMarker.setLatLng([lat, lng]);
    }
    if (popupTitle) {
      state.osmMarker.bindPopup(`<strong>${escapeHtml(popupTitle)}</strong>`).openPopup();
    }
  }

  async function handleOsmMapClick(lat, lng) {
    const lookup = beginNewLocationLookup();

    const cacheKey = MapCache.coordKey(lat, lng);
    const cached = MapCache.get(cacheKey);
    if (cached) {
      setOsmMarker(cached.lat ?? lat, cached.lng ?? lng, cached.name);
      updateLocationSummary({
        name: cached.name,
        url: cached.url,
        lat: cached.lat ?? lat,
        lng: cached.lng ?? lng,
        address: cached.address,
      });
      setStatusBanner(`⚡ 已從快取帶入地點：${cached.name}（0 API 消耗）`);
      return;
    }

    setOsmMarker(lat, lng, '正在辨識地點名稱...');
    setStatusBanner('🔍 正在辨識該處店家名稱與地址...');

    try {
      const info = await resolvePlaceDetailsByCoords(lat, lng, lookup.signal);
      if (!lookup.isCurrent()) return;

      const googleUrl = buildGoogleMapsUrl({
        name: info.name,
        address: info.address,
        lat: info.lat,
        lng: info.lng,
      });

      MapCache.set(cacheKey, {
        name: info.name,
        address: info.address,
        url: googleUrl,
        lat: info.lat,
        lng: info.lng,
      });
      setOsmMarker(info.lat, info.lng, info.name);
      updateLocationSummary({
        name: info.name,
        url: googleUrl,
        lat: info.lat,
        lng: info.lng,
        address: info.address,
      });
      setStatusBanner(`✅ 已選取地點：${info.name}`);
    } catch (err) {
      if (!lookup.isCurrent()) return;
      console.warn('查詢異常:', err);
    }
  }

  // ==================== 地圖引擎 2：Google Maps 省流模式 ====================
  function loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        state.googleScriptLoaded = true;
        resolve();
        return;
      }

      const existingScript = document.getElementById('googleMapsSdkScript');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'googleMapsSdkScript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&language=zh-TW`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        state.googleScriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Google Maps JS SDK 載入失敗，請檢查 API Key 是否有效。'));
      };
      document.head.appendChild(script);
    });
  }

  async function initGoogleMap() {
    if (!state.googleApiKey) {
      throw new Error('尚未設定 Google Maps API Key');
    }

    await loadGoogleMapsScript(state.googleApiKey);

    const isLight = isDaytimeHours();

    if (!state.googleMap) {
      state.googleMap = new window.google.maps.Map(dom.googleMapContainer, {
        center: DEFAULT_CENTER,
        zoom: 16,
        clickableIcons: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: isLight ? null : GOOGLE_DARK_MAP_STYLES,
      });

      state.googlePlacesService = new window.google.maps.places.PlacesService(state.googleMap);
      state.googleGeocoder = new window.google.maps.Geocoder();

      state.googleMap.addListener('click', (event) => {
        handleGoogleMapClick(event);
      });
    } else {
      updateMapThemeByTime();
    }
  }

  function setGoogleMarker(latLng, title) {
    if (!state.googleMap) return;
    if (!state.googleMarker) {
      state.googleMarker = new window.google.maps.Marker({
        position: latLng,
        map: state.googleMap,
        title: title || '',
      });
    } else {
      state.googleMarker.setPosition(latLng);
      state.googleMarker.setTitle(title || '');
    }
  }

  // 透過多重官方管道解析同一個 Google placeId 的名稱與 URL（確保店名與 placeId 100% 同一間店）
  async function resolveGooglePlaceById(placeId, lat, lng) {
    // 管道 1：Google Maps Places API (New) — Place.fetchFields (Basic 最小欄位)
    if (
      window.google?.maps?.places?.Place &&
      typeof window.google.maps.places.Place === 'function'
    ) {
      try {
        const placeObj = new window.google.maps.places.Place({ id: placeId });
        if (typeof placeObj.fetchFields === 'function') {
          await placeObj.fetchFields({ fields: ['displayName', 'googleMapsURI'] });
          if (placeObj.displayName) {
            return {
              name: placeObj.displayName,
              url:
                placeObj.googleMapsURI ||
                buildGoogleMapsUrl({ name: placeObj.displayName, lat, lng, placeId }),
            };
          }
        }
      } catch (_) {}
    }

    // 管道 2：傳統 PlacesService.getDetails (Basic 最小欄位 ['name', 'url'])
    if (state.googlePlacesService) {
      const legacyResult = await new Promise((resolve) => {
        state.googlePlacesService.getDetails(
          { placeId, fields: ['name', 'url'] },
          (place, status) => {
            if (
              status === window.google.maps.places.PlacesServiceStatus.OK &&
              place &&
              place.name
            ) {
              resolve({
                name: place.name,
                url:
                  place.url ||
                  buildGoogleMapsUrl({ name: place.name, lat, lng, placeId }),
              });
            } else {
              resolve(null);
            }
          }
        );
      });
      if (legacyResult) return legacyResult;
    }

    // 管道 3：Google Geocoder({ placeId })（針對未開啟 Places API 的 Key，直接以同一個 placeId 查詢地址）
    if (state.googleGeocoder) {
      const geocodeResult = await new Promise((resolve) => {
        state.googleGeocoder.geocode({ placeId }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const r = results[0];
            const cleanAddr = r.formatted_address
              ? r.formatted_address.replace(/^\d{3,6}\s*台灣/, '')
              : null;
            if (cleanAddr) {
              resolve({
                name: cleanAddr,
                url: buildGoogleMapsUrl({ name: cleanAddr, lat, lng, placeId }),
              });
              return;
            }
          }
          resolve(null);
        });
      });
      if (geocodeResult) return geocodeResult;
    }

    return null;
  }

  async function handleGoogleMapClick(event) {
    const lookup = beginNewLocationLookup();

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (event.placeId) {
      if (typeof event.stop === 'function') {
        event.stop();
      }

      const pKey = MapCache.placeKey(event.placeId);
      const cached = MapCache.get(pKey);
      if (cached) {
        setGoogleMarker(event.latLng, cached.name);
        updateLocationSummary({
          name: cached.name,
          url: cached.url,
          lat,
          lng,
          placeId: event.placeId,
        });
        setStatusBanner(`⚡ 已從快取帶入店家：${cached.name}（0 API 消耗）`);
        return;
      }

      setGoogleMarker(event.latLng, '正在擷取店家名稱...');
      setStatusBanner('🔍 正在擷取該店家名稱與連結...');

      const googlePoi = await resolveGooglePlaceById(event.placeId, lat, lng);
      if (!lookup.isCurrent()) return;

      if (googlePoi) {
        MapCache.set(pKey, { name: googlePoi.name, url: googlePoi.url, lat, lng });
        setGoogleMarker(event.latLng, googlePoi.name);
        updateLocationSummary({
          name: googlePoi.name,
          url: googlePoi.url,
          lat,
          lng,
          placeId: event.placeId,
        });
        setStatusBanner(`✅ 已選取店家：${googlePoi.name}`);
        return;
      }

      // 若使用者的 Google Key 未開通任何 Google 查詢 API，退回免費 OSM 時，
      // 重要：不要把隔壁 OSM 店家的名字硬配給 Google 的 placeId，而是統一用 OSM 解析出的店名+地址產生一致的 URL！
      try {
        const info = await resolvePlaceDetailsByCoords(lat, lng, lookup.signal);
        if (!lookup.isCurrent()) return;

        const consistentUrl = buildGoogleMapsUrl({
          name: info.name,
          address: info.address,
          lat: info.lat,
          lng: info.lng,
        });
        MapCache.set(pKey, {
          name: info.name,
          address: info.address,
          url: consistentUrl,
          lat: info.lat,
          lng: info.lng,
        });
        setGoogleMarker(event.latLng, info.name);
        updateLocationSummary({
          name: info.name,
          url: consistentUrl,
          lat: info.lat,
          lng: info.lng,
          address: info.address,
        });
        setStatusBanner(`✅ 已選取地點：${info.name}`);
      } catch (_) {}
      return;
    }

    // 點擊非 POI 的一般位置
    const cacheKey = MapCache.coordKey(lat, lng);
    const cached = MapCache.get(cacheKey);
    if (cached) {
      setGoogleMarker(event.latLng, cached.name);
      updateLocationSummary({
        name: cached.name,
        url: cached.url,
        lat,
        lng,
        address: cached.address,
      });
      setStatusBanner(`⚡ 已從快取帶入地點：${cached.name}（0 API 消耗）`);
      return;
    }

    setGoogleMarker(event.latLng, '正在辨識地點名稱...');
    setStatusBanner('🔍 正在免費解析該位置店名或地址（不消耗 Google Places 額度）...');

    try {
      const info = await resolvePlaceDetailsByCoords(lat, lng, lookup.signal);
      if (!lookup.isCurrent()) return;

      const coordUrl = buildGoogleMapsUrl({
        name: info.name,
        address: info.address,
        lat: info.lat,
        lng: info.lng,
      });
      MapCache.set(cacheKey, {
        name: info.name,
        address: info.address,
        url: coordUrl,
        lat: info.lat,
        lng: info.lng,
      });
      setGoogleMarker(event.latLng, info.name);
      updateLocationSummary({
        name: info.name,
        url: coordUrl,
        lat: info.lat,
        lng: info.lng,
        address: info.address,
      });
      setStatusBanner(`✅ 已選取地點：${info.name}（0 Google Places 額度消耗）`);
    } catch (_) {}
  }

  // ==================== 關鍵字搜尋 ====================
  async function handleMapSearch(e) {
    e.preventDefault();
    const query = dom.mapSearchInput.value.trim();
    if (!query) return;

    const lookup = beginNewLocationLookup();

    const searchCacheKey = `search:${state.mapMode}:${query.toLowerCase()}`;
    const cachedResults = MapCache.get(searchCacheKey);
    if (cachedResults && Array.isArray(cachedResults.items)) {
      renderSearchResults(cachedResults.items);
      selectSearchResultItem(cachedResults.items[0]);
      setStatusBanner(`⚡ 從本地快取顯示「${query}」搜尋結果（0 API 消耗）`);
      return;
    }

    setStatusBanner(`🔍 正在搜尋「${query}」...`);

    if (state.mapMode === 'google' && state.googlePlacesService) {
      state.googlePlacesService.findPlaceFromQuery(
        {
          query,
          fields: ['name', 'geometry', 'place_id', 'formatted_address'],
        },
        (results, status) => {
          if (!lookup.isCurrent()) return;

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results.length > 0
          ) {
            const items = results.map((r) => {
              const lat = r.geometry?.location?.lat();
              const lng = r.geometry?.location?.lng();
              const name = r.name || query;
              const address = r.formatted_address || '';
              const url = buildGoogleMapsUrl({
                name,
                address,
                lat,
                lng,
                placeId: r.place_id,
              });
              return {
                name,
                address,
                lat,
                lng,
                placeId: r.place_id,
                url,
              };
            });
            MapCache.set(searchCacheKey, { items });
            renderSearchResults(items);
            selectSearchResultItem(items[0]);
          } else {
            searchWithNominatim(query, searchCacheKey, lookup);
          }
        }
      );
      return;
    }

    await searchWithNominatim(query, searchCacheKey, lookup);
  }

  async function searchWithNominatim(query, searchCacheKey, lookup) {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&accept-language=zh-TW,zh`,
        { signal: lookup ? lookup.signal : undefined }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const list = await resp.json();
      if (lookup && !lookup.isCurrent()) return;

      if (!Array.isArray(list) || list.length === 0) {
        dom.searchResultsList.classList.add('hidden');
        setStatusBanner(`⚠️ 找不到「${query}」，請嘗試其他關鍵字或直接點擊地圖`);
        return;
      }

      const items = list.map((item) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const roadAddr = extractRoadNameFromNominatim(item) || item.display_name || '';
        const name =
          item.name ||
          roadAddr ||
          (item.display_name ? item.display_name.split(',')[0].trim() : query);
        const url = buildGoogleMapsUrl({ name, address: roadAddr, lat, lng });
        return {
          name,
          address: roadAddr,
          lat,
          lng,
          url,
        };
      });

      MapCache.set(searchCacheKey, { items });
      renderSearchResults(items);
      selectSearchResultItem(items[0]);
    } catch (err) {
      if (lookup && !lookup.isCurrent()) return;
      console.error('搜尋失敗:', err);
      setStatusBanner('⚠️ 搜尋服務暫時無回應，請直接點擊地圖選點');
    }
  }

  function renderSearchResults(items) {
    dom.searchResultsList.innerHTML = '';
    if (!items || items.length <= 1) {
      dom.searchResultsList.classList.add('hidden');
      return;
    }

    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'search-result-item';
      li.setAttribute('role', 'option');
      li.innerHTML = `
        <span class="search-result-title">${escapeHtml(item.name)}</span>
        <span class="search-result-address">${escapeHtml(item.address)}</span>
      `;
      li.addEventListener('click', () => {
        beginNewLocationLookup();
        selectSearchResultItem(item);
        dom.searchResultsList.classList.add('hidden');
      });
      dom.searchResultsList.appendChild(li);
    });

    dom.searchResultsList.classList.remove('hidden');
  }

  function selectSearchResultItem(item) {
    if (!item) return;
    updateLocationSummary({
      name: item.name,
      url: item.url,
      lat: item.lat,
      lng: item.lng,
      placeId: item.placeId,
      address: item.address,
    });

    if (state.mapMode === 'google' && state.googleMap && item.lat && item.lng) {
      const pos = { lat: item.lat, lng: item.lng };
      state.googleMap.panTo(pos);
      state.googleMap.setZoom(17);
      setGoogleMarker(pos, item.name);
    } else if (state.osmMap && item.lat && item.lng) {
      state.osmMap.setView([item.lat, item.lng], 17);
      setOsmMarker(item.lat, item.lng, item.name);
    }

    setStatusBanner(`✅ 已定位至：${item.name}`);
  }

  // ==================== 模式切換與設定 Dialog ====================
  async function applyMapMode(mode) {
    const isLight = isDaytimeHours();
    const themeLabel = isLight ? '☀️ 日間淺色地圖' : '🌙 夜間深色地圖';

    if (mode === 'google' && state.googleApiKey) {
      try {
        dom.osmMapContainer.classList.add('hidden');
        dom.googleMapContainer.classList.remove('hidden');
        await initGoogleMap();
        state.mapMode = 'google';
        localStorage.setItem('schedule_map_mode', 'google');
        dom.quotaBadgeBtn.className = 'quota-pill mode-google';
        updateSettingsButtonsVisibility();
        dom.quotaBadge.textContent = `Google 省流 (${themeLabel})`;
        setStatusBanner(`🗺️ 已啟用 Google Maps 省流模式（${themeLabel}，06:00~18:00 自動為淺色）`);
        return;
      } catch (err) {
        console.warn('切換 Google Maps 失敗，自動退回免費模式:', err);
        alert(`${err.message}\n將自動退回免費智慧地圖模式。`);
      }
    }

    state.mapMode = 'osm';
    localStorage.setItem('schedule_map_mode', 'osm');
    dom.googleMapContainer.classList.add('hidden');
    dom.osmMapContainer.classList.remove('hidden');
    initOsmMap();
    setTimeout(() => {
      if (state.osmMap) state.osmMap.invalidateSize();
    }, 60);
    dom.quotaBadgeBtn.className = 'quota-pill mode-free';
    updateSettingsButtonsVisibility();
    dom.quotaBadge.textContent = `免費省流地圖 (${themeLabel})`;
  }

  function openSettingsModal() {
    const dialog = dom.settingsDialog;
    const radios = dom.settingsForm.querySelectorAll('input[name="mapMode"]');
    radios.forEach((r) => {
      r.checked = r.value === state.mapMode;
    });
    dom.googleApiKeyInput.value = state.googleApiKey;
    MapCache.updateUIStats();
    dialog.showModal();
  }

  function initSettingsDialog() {
    const dialog = dom.settingsDialog;

    if (dialog && !('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isDialogContent) {
          dialog.close();
        }
      });
    }

    dom.mapSettingsBtn.addEventListener('click', openSettingsModal);
    dom.quotaBadgeBtn.addEventListener('click', openSettingsModal);
    dom.closeDialogBtn.addEventListener('click', () => dialog.close());
    dom.cancelSettingsBtn.addEventListener('click', () => dialog.close());

    dom.clearCacheBtn.addEventListener('click', () => {
      MapCache.clear();
      setStatusBanner('🧹 已清除本地地點快取');
    });

    dom.settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const selectedRadio = dom.settingsForm.querySelector('input[name="mapMode"]:checked');
      const chosenMode = selectedRadio ? selectedRadio.value : 'osm';
      const apiKey = dom.googleApiKeyInput.value.trim();

      state.googleApiKey = apiKey;
      if (apiKey) {
        localStorage.setItem('schedule_google_api_key', apiKey);
      } else {
        localStorage.removeItem('schedule_google_api_key');
      }

      if (chosenMode === 'google' && !apiKey) {
        alert('若要使用原生 Google Maps 省流模式，請填入您的 Google Maps API Key，或選擇「免費智慧模式」。');
        return;
      }

      dialog.close();
      await applyMapMode(chosenMode);
    });
  }

  // ==================== 定位目前位置按鈕 ====================
  function initLocateMeButton() {
    dom.locateMeBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        setStatusBanner('⚠️ 您的瀏覽器不支援地理定位功能');
        return;
      }
      setStatusBanner('📍 正在取得您的目前位置...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          if (state.mapMode === 'google' && state.googleMap) {
            const latLng = new window.google.maps.LatLng(lat, lng);
            state.googleMap.panTo(latLng);
            state.googleMap.setZoom(17);
            handleGoogleMapClick({ latLng });
          } else if (state.osmMap) {
            state.osmMap.setView([lat, lng], 17);
            handleOsmMapClick(lat, lng);
          }
        },
        () => {
          setStatusBanner('⚠️ 無法取得定位權限，請直接在地圖上點選或搜尋');
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ==================== 啟動應用程式 ====================
  function bootstrap() {
    MapCache.init();
    initSecretBackgroundClickUnlock();
    initDateTimePicker();
    initOutputCard();
    initSettingsDialog();
    initLocateMeButton();
    dom.mapSearchForm.addEventListener('submit', handleMapSearch);
    applyMapMode(state.mapMode);

    setInterval(() => {
      updateMapThemeByTime();
    }, 60 * 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
