// --- Time and Date Sync ---
function updateDateTime() {
    const now = new Date();
    
    // Format hours and minutes
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const timeStr = `${hours}:${minutes}`;
    
    // Update status bar time
    const statusTime = document.getElementById('statusTime');
    if (statusTime) statusTime.textContent = timeStr;
    
    // Update widget time
    const widgetTime = document.getElementById('widgetTime');
    if (widgetTime) widgetTime.textContent = timeStr;
    
    // Update widget date
    const widgetDate = document.getElementById('widgetDate');
    if (widgetDate) {
        const weeksZH = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
        const weeksEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeksJA = ['日', '月', '火', '水', '木', '金', '土'];
        
        const month = now.getMonth() + 1;
        const date = now.getDate();
        
        if (currentLang === 'en') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            widgetDate.textContent = `${months[now.getMonth()]} ${date}, ${weeksEN[now.getDay()]}`;
        } else if (currentLang === 'ja') {
            widgetDate.textContent = `${month}月${date}日 (${weeksJA[now.getDay()]})`;
        } else {
            widgetDate.textContent = `${month}月${date}日 ${weeksZH[now.getDay()]}`;
        }
    }
}


// --- Multi-language Translations Dictionary ---
const translations = {
    zh: {
        profileTitle: "Android 開發者",
        profileBio: "「我的使命是開發 App 直到世界不再需要它們為止。😄」",
        resumeBtnText: "個人履歷",
        sectionTitle: "作品集",
        sectionSubtitle: "點擊手機內的 App 圖示以查看截圖與來源",
        searchBarText: "搜尋手機內容...",
        detailsPlaceholderTitle: "點擊上方的 App 圖示以查看截圖與來源",
        detailsPlaceholderDesc: "將會在此處顯示專案的完整截圖與 GitHub 原始碼連結。",
        viewSourceText: "查看 GitHub 原始碼",
        screenshotTitle: "專案截圖 / UI 預覽",
        closeBtnText: "關閉",
        
        // Project Detail Section Headers
        overviewTitle: "專案概述",
        techTitle: "採用技術",
        
        // Project Descriptions
        japaneseDesc: "一款專為日語學習者設計的五十音練習應用程式。提供平假名、片假名的對照學習與發音練習功能，介面簡潔直覺，幫助初學者輕鬆掌握基礎日語發音。",
        pizzaDesc: "一個比薩訂購客製化 Demo 應用程式。使用者可以瀏覽比薩目錄、選擇配料、客製化比薩大小，專注於流暢的 UI 動畫與使用者互動體驗。",
        qrcraftDesc: "強大的 QR Code 掃描器與產生器。結合 CameraX 與 Google ML Kit 提供極速掃描體驗，並支援儲存歷史紀錄與產生自訂風格的 QR Code。",
        vibeplayerDesc: "一款美觀、流暢的本地音樂播放器。提供專輯分類、播放清單管理，以及精美的音量視覺化波形面板，支援後台背景播放。",
        moneymanagerDesc: "基於 Kotlin Multiplatform (KMP) 與 Compose Multiplatform 打造的跨平台記帳管理工具。支援 Android 與 iOS 雙平台，提供收支記帳與類別統計分析。",
        smartstepDesc: "結合 Google Gemini AI 健走教練的現代化 Android 計步應用程式。具備即時步數追蹤、前台服務 (Foreground Service) 背景監控、每週數據分析圖表，採用 Clean Architecture (MVI 架構、Jetpack Compose、Room、Koin)。",
        screenComingSoonTitle: "截圖即將推出",
        screenComingSoonDesc: "UI 截圖正在準備中。歡迎點擊上方按鈕前往 GitHub 查看完整原始碼與 README！",
        
        // Resume Modal
        modalRole: "Android 開發者 | Mobile Developer",
        modalLocation: "📍 台北市，台灣",
        modalAboutTitle: "關於我",
        modalAboutText: "我是陳立翰 (LiHan)。作為一名 Android 開發者，我的使命是開發 App 直到世界不再需要它們為止！😄 我專注於行動裝置 App 開發，熱衷於實作乾淨的架構 (Clean Architecture)、MVI 設計模式以及 Jetpack Compose 聲明式 UI。近年來也積極投入 Kotlin Multiplatform (KMP) 跨平台開發領域。",
        modalExpTitle: "工作經歷",
        timelineNECTime: "2024.03 - 至今",
        timelineNECRole: "Android Developer | NEC",
        timelineNECLocation: "台灣台北內湖",
        timelineNECBullet1: "使用 <strong>MVI 架構</strong> 與 <strong>Jetpack Compose</strong> 進行企業級客戶 App 專案開發。",
        timelineNECBullet2: "負責定位、修正產品缺陷 (Bugs) 與實作全新客製化功能。",
        timelineNECBullet3: "優化 Compose 渲染效能，提升 App 流暢度。",
        timelineClaraTime: "2022.11 - 2025.01",
        timelineClaraRole: "Mobile Developer | Clara",
        timelineClaraLocation: "日本東京都港區",
        timelineClaraBullet1: "使用 <strong>KMP (Kotlin Multiplatform)</strong> 進行跨平台專案前期調研與核心邏輯模組化開發。",
        timelineClaraBullet2: "跨國團隊協作，使用英文與日文進行日常技術溝通與專案進度管理。",
        modalEduTitle: "學歷背景",
        timelineEduTime: "大學畢業",
        timelineEduDegree: "資訊管理學系 (Information Management)",
        timelineEduSchool: "德明財經科技大學 (Takming University of Science and Technology)",
        modalSkillsTitle: "專業技能",
        skillCat1: "行動開發 (Mobile)",
        skillCat2: "架構與程式庫 (Libraries)",
        skillCat3: "其他技術與語言"
    },
    en: {
        profileTitle: "Android Developer",
        profileBio: '"My mission is to develop apps until this world no longer needs them. 😄"',
        resumeBtnText: "Resume",
        sectionTitle: "Portfolio",
        sectionSubtitle: "Click on the App icons inside the phone to view screenshots and source code",
        searchBarText: "Search phone...",
        detailsPlaceholderTitle: "Click on the App icons above to view screenshots and source code",
        detailsPlaceholderDesc: "This section will display the app's full screenshot and its GitHub repository link.",
        viewSourceText: "View Source on GitHub",
        screenshotTitle: "Project Screenshot / UI Preview",
        closeBtnText: "Close",
        
        // Project Detail Section Headers
        overviewTitle: "Project Overview",
        techTitle: "Technologies",
        
        // Project Descriptions
        japaneseDesc: "A Japanese Kana learning application designed for beginners. It offers Hiragana and Katakana comparison charts, pronunciation guides, and interactive lessons with a clean and intuitive interface.",
        pizzaDesc: "A pizza ordering and customization demo app. Users can browse a pizza catalog, choose toppings, and customize pizza sizes. It focuses on smooth UI animations and interactive experiences.",
        qrcraftDesc: "A powerful QR code scanner and generator. Combining CameraX and Google ML Kit to provide high-speed scanning, it supports saving history and generating custom-styled QR codes.",
        vibeplayerDesc: "An elegant and fluid local music player. Features album categorization, playlist management, and a beautiful dynamic visualizer panel, with full support for background audio playback.",
        moneymanagerDesc: "A cross-platform money management tool built with Kotlin Multiplatform (KMP) and Compose Multiplatform. Supporting both Android and iOS, it provides expense tracking and category analytics.",
        smartstepDesc: "A modern Android pedometer app featuring Google Gemini AI coaching, real-time step tracking with Foreground Service, weekly analytics, and Clean Architecture (MVI, Jetpack Compose, Room, Koin).",
        screenComingSoonTitle: "Screenshot Coming Soon",
        screenComingSoonDesc: "UI screenshots are currently being prepared. Feel free to click the button above to view the source code and README on GitHub!",
        
        // Resume Modal
        modalRole: "Android Developer | Mobile Developer",
        modalLocation: "📍 Taipei City, Taiwan",
        modalAboutTitle: "About Me",
        modalAboutText: "I am LiHan Chen. As an Android Developer, my mission is to develop apps until this world no longer needs them! 😄 I focus on mobile app development, specializing in Clean Architecture, MVI pattern, and Jetpack Compose declarative UI. Recently, I've been actively working on Kotlin Multiplatform (KMP) cross-platform development.",
        modalExpTitle: "Work Experience",
        timelineNECTime: "2024.03 - Present",
        timelineNECRole: "Android Developer | NEC",
        timelineNECLocation: "Neihu, Taipei, Taiwan",
        timelineNECBullet1: "Developed enterprise-level client applications using <strong>MVI architecture</strong> and <strong>Jetpack Compose</strong>.",
        timelineNECBullet2: "Responsible for debugging and implementing new customized features.",
        timelineNECBullet3: "Optimized Compose rendering performance to improve app responsiveness.",
        timelineClaraTime: "2022.11 - 2025.01",
        timelineClaraRole: "Mobile Developer | Clara",
        timelineClaraLocation: "Minato-ku, Tokyo, Japan",
        timelineClaraBullet1: "Conducted research on <strong>KMP (Kotlin Multiplatform)</strong> and modularized core logic for cross-platform apps.",
        timelineClaraBullet2: "Collaborated in multinational teams, communicating daily in English and Japanese.",
        modalEduTitle: "Education",
        timelineEduTime: "Graduated",
        timelineEduDegree: "Department of Information Management",
        timelineEduSchool: "Takming University of Science and Technology",
        modalSkillsTitle: "Professional Skills",
        skillCat1: "Mobile Development",
        skillCat2: "Architecture & Libraries",
        skillCat3: "Other Technologies & Languages"
    },
    ja: {
        profileTitle: "Androidデベロッパー",
        profileBio: "「この世界にアプリが必要なくなるまで、アプリを開発し続けることが私の使命です。😄」",
        resumeBtnText: "履歴書",
        sectionTitle: "ポートフォリオ",
        sectionSubtitle: "スマートフォンのアプリアイコンをクリックして、スクリーンショットとソースコードを表示します",
        searchBarText: "端末内を検索...",
        detailsPlaceholderTitle: "上のアプリアイコンをクリックして、スクリーンショットとソースコードを表示します",
        detailsPlaceholderDesc: "ここには、プロジェクトのスクリーンショットとGitHubソースコードへのリンクが表示されます。",
        viewSourceText: "GitHubでソースコードを表示",
        screenshotTitle: "プロジェクトのスクリーンショット / UIプレビュー",
        closeBtnText: "閉じる",
        
        // Project Detail Section Headers
        overviewTitle: "プロジェクト概要",
        techTitle: "採用技術",
        
        // Project Descriptions
        japaneseDesc: "日本語学習者のために設計された五十音練習アプリです。平仮名と片仮名の対照表、発音練習機能を提供し、シンプルで直感的なインターフェースで初学者が日本語の基礎を容易に習得できるようサポートします。",
        pizzaDesc: "ピザ注文・カスタマイズのデモアプリです。ユーザーはピザのカタログを閲覧し、トッピングを選択してサイズをカスタマイズできます。スムーズなUIアニメーションとインタラクティブなユーザー体験に注力しています。",
        qrcraftDesc: "強力なQRコードスキャナーおよび生成アプリです。CameraXとGoogle ML Kitを組み合わせて高速スキャンを提供し、スキャン履歴の保存やカスタマイズされたスタイルのQRコード生成をサポートします。",
        vibeplayerDesc: "美しく滑らかなローカル音楽プレーヤーです。アルバム分類、プレイリスト管理、美しいダイナミックなビジュアライザーパネルを提供し、バックグラウンド再生を完全にサポートしています。",
        moneymanagerDesc: "Kotlin Multiplatform（KMP）とCompose Multiplatformで構築されたクロスプラットフォーム家計簿ツールです。AndroidとiOSの両方をサポートし、収支の記録やカテゴリ別の分析機能を提供します。",
        smartstepDesc: "Google Gemini AIウォーキングコーチを統合したモダンなAndroid歩数計アプリです。リアルタイムの歩数計測、フォアグラウンドサービスによるバックグラウンド監視、週間分析レポートを提供し、Clean Architecture（MVI、Jetpack Compose、Room、Koin）を採用しています。",
        screenComingSoonTitle: "スクリーンショット準備中",
        screenComingSoonDesc: "UIスクリーンショットは現在準備中です。上のボタンからGitHubでソースコードと詳細をご確認いただけます。",
        
        // Resume Modal
        modalRole: "Androidデベロッパー | モバイルデベロッパー",
        modalLocation: "📍 台湾台北市",
        modalAboutTitle: "自己紹介",
        modalAboutText: "陳立翰（LiHan）と申します。Androidデベロッパーとして、「この世界にアプリが必要なくなるまで、アプリを開発し続けること」をミッションとしています！😄 モバイルアプリ開発に特化し、クリーンアーキテクチャ（Clean Architecture）、MVIパターン、Jetpack Composeによる宣言型UIの実裝に注力しています。近年はKotlin Multiplatform（KMP）によるクロスプラットフォーム開発にも積極的に取り組んでいます。",
        modalExpTitle: "職歴",
        timelineNECTime: "2024.03 - 現在",
        timelineNECRole: "Androidデベロッパー | NEC",
        timelineNECLocation: "台湾台北内湖",
        timelineNECBullet1: "<strong>MVIアーキテクチャ</strong>と<strong>Jetpack Compose</strong>を用いた企業向けクライアントアプリの開発。",
        timelineNECBullet2: "バグ修正および新規カスタマイズ機能の実裝を担当。",
        timelineNECBullet3: "Composeのレンダリングパフォーマンスを最適化し、アプリの応答性を向上。",
        timelineClaraTime: "2022.11 - 2025.01",
        timelineClaraRole: "モバイルデベロッパー | クララオンライン",
        timelineClaraLocation: "東京都港区",
        timelineClaraBullet1: "<strong>KMP (Kotlin Multiplatform)</strong>を用いたクロスプラットフォームプロジェクトの先行調査およびコアロジックのモジュール開発。",
        timelineClaraBullet2: "多国籍チームと連携し、英語と日本語を用いて日常的な技術コミュニケーションと進捗管理を遂行。",
        modalEduTitle: "学歴",
        timelineEduTime: "卒業",
        timelineEduDegree: "情報管理学科",
        timelineEduSchool: "徳明財経科技大学",
        modalSkillsTitle: "専門スキル",
        skillCat1: "モバイル開発",
        skillCat2: "アーキテクチャ & ライブラリ",
        skillCat3: "その他技術 & 言語"
    }
};

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    
    // Update active lang buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const t = translations[lang];
    if (!t) return;
    
    // Perform DOM translation replacements
    document.getElementById('profileTitle').textContent = t.profileTitle;
    document.getElementById('profileBio').textContent = t.profileBio;
    document.getElementById('resumeBtnText').textContent = t.resumeBtnText;
    document.getElementById('sectionTitle').textContent = t.sectionTitle;
    document.getElementById('sectionSubtitle').textContent = t.sectionSubtitle;
    document.getElementById('searchBarText').textContent = t.searchBarText;
    
    document.getElementById('detailsPlaceholderTitle').textContent = t.detailsPlaceholderTitle;
    document.getElementById('detailsPlaceholderDesc').textContent = t.detailsPlaceholderDesc;
    
    // Modal translations
    document.getElementById('modalRole').textContent = t.modalRole;
    document.getElementById('modalLocation').textContent = t.modalLocation;
    document.getElementById('modalAboutTitle').textContent = t.modalAboutTitle;
    document.getElementById('modalAboutText').textContent = t.modalAboutText;
    document.getElementById('modalExpTitle').textContent = t.modalExpTitle;
    document.getElementById('modalEduTitle').textContent = t.modalEduTitle;
    document.getElementById('modalSkillsTitle').textContent = t.modalSkillsTitle;
    document.getElementById('closeModalFooterBtn').textContent = t.closeBtnText;
    
    // Timeline items
    document.getElementById('timelineNECTime').textContent = t.timelineNECTime;
    document.getElementById('timelineNECRole').innerHTML = t.timelineNECRole;
    document.getElementById('timelineNECLocation').textContent = t.timelineNECLocation;
    document.getElementById('timelineNECBullet1').innerHTML = t.timelineNECBullet1;
    document.getElementById('timelineNECBullet2').innerHTML = t.timelineNECBullet2;
    document.getElementById('timelineNECBullet3').innerHTML = t.timelineNECBullet3;
    
    document.getElementById('timelineClaraTime').textContent = t.timelineClaraTime;
    document.getElementById('timelineClaraRole').innerHTML = t.timelineClaraRole;
    document.getElementById('timelineClaraLocation').textContent = t.timelineClaraLocation;
    document.getElementById('timelineClaraBullet1').innerHTML = t.timelineClaraBullet1;
    document.getElementById('timelineClaraBullet2').innerHTML = t.timelineClaraBullet2;
    
    document.getElementById('timelineEduTime').textContent = t.timelineEduTime;
    document.getElementById('timelineEduDegree').textContent = t.timelineEduDegree;
    document.getElementById('timelineEduSchool').textContent = t.timelineEduSchool;
    
    // Skills Headers
    document.getElementById('skillCat1').textContent = t.skillCat1;
    document.getElementById('skillCat2').textContent = t.skillCat2;
    document.getElementById('skillCat3').textContent = t.skillCat3;
    
    // Refresh date formatting on the phone launcher widget
    updateDateTime();
    
    // If a project is currently selected in the details panel, refresh its text translation
    if (activeProjectName) {
        showProjectDetails(activeProjectName);
    }
}

// Bind language switcher buttons
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
    });
});


// --- Resume Modal Toggle ---
const resumeModal = document.getElementById('resumeModal');
const avatarBtn = document.getElementById('avatarBtn');
const resumeBtn = document.getElementById('resumeBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModalFooterBtn = document.getElementById('closeModalFooterBtn');

function openModal() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = '';
}

if (avatarBtn) avatarBtn.addEventListener('click', openModal);
if (resumeBtn) resumeBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (closeModalFooterBtn) closeModalFooterBtn.addEventListener('click', closeModal);

if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
            closeModal();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
        closeModal();
    }
});


// --- Portfolio Projects Database ---
const projectsData = {
    japanese: {
        title: "日本語五十音",
        repo: "JPracticePublic",
        image: "app_screen/日本語五十音.png",
        github: "https://github.com/encorex32268/JPracticePublic",
        tech: ["Kotlin", "Jetpack Compose", "Coroutines", "Clean Architecture", "MVVM", "Room"]
    },
    pizza: {
        title: "LazyPizza",
        repo: "LazyPizza",
        image: "app_screen/LazyPizza.png",
        github: "https://github.com/encorex32268/LazyPizza",
        tech: ["Kotlin", "Jetpack Compose", "Coroutines", "Room Database", "StateFlow", "MVVM"]
    },
    qrcraft: {
        title: "QRCraft",
        repo: "QRCraft",
        image: "app_screen/QRCraft.png",
        github: "https://github.com/encorex32268/QRCraft",
        tech: ["Kotlin", "Jetpack Compose", "Google ML Kit", "CameraX", "MVI Architecture", "Coroutines & Flow"]
    },
    vibeplayer: {
        title: "VibePlayer",
        repo: "VibePlayer",
        image: "app_screen/VibePlayer.png",
        github: "https://github.com/encorex32268/VibePlayer",
        tech: ["Kotlin", "Jetpack Compose", "Media3 ExoPlayer", "Coroutines", "Room", "Service Binding"]
    },
    moneymanager: {
        title: "MoneyManager",
        repo: "MoneyManagerKMP",
        image: "app_screen/MoneyManager.png",
        github: "https://github.com/encorex32268/MoneyManagerKMP",
        tech: ["Kotlin", "Kotlin Multiplatform (KMP)", "Compose Multiplatform", "SQLDelight", "Ktor Client", "MVI StateFlow"]
    },
    smartstep: {
        title: "SmartStep",
        repo: "SmartStep",
        image: null,
        icon: "app_icons/SmartStep.webp",
        github: "https://github.com/encorex32268/SmartStep",
        tech: ["Kotlin", "Jetpack Compose", "Gemini AI", "Clean Architecture", "MVI", "Room", "Koin", "Foreground Service", "WorkManager"]
    }
};

let activeProjectName = null;

// Selectors
const detailsPlaceholder = document.getElementById('detailsPlaceholder');
const detailsContent = document.getElementById('detailsContent');
const detailsSection = document.getElementById('detailsSection');

// Add launcher grid click handlers
document.querySelectorAll('.launcher-app-item').forEach(item => {
    item.addEventListener('click', () => {
        const appName = item.getAttribute('data-app');
        
        // Show project screenshot and GitHub source below
        showProjectDetails(appName);
    });
});

function showProjectDetails(appName) {
    const data = projectsData[appName];
    if (!data) return;
    
    activeProjectName = appName;
    
    // Hide placeholder
    detailsPlaceholder.classList.add('hidden');
    
    // Fetch translation strings
    const currentT = translations[currentLang] || translations['zh'];
    
    // Generate technology tags
    const techTagsHtml = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
    
    // Build screenshot or placeholder preview HTML
    let previewHtml;
    if (data.image) {
        previewHtml = `
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:5px;">${currentT.screenshotTitle}</div>
            <img src="${data.image}" alt="${data.title} ${currentT.screenshotTitle}" class="details-screenshot-img" onerror="this.outerHTML='<div class=\\'screenshot-placeholder-card\\'><div class=\\'placeholder-icon-wrap\\'><img src=\\'${data.icon || 'app_icons/SmartStep.webp'}\\' class=\\'placeholder-icon-img\\'></div><div class=\\'placeholder-title\\'>${currentT.screenComingSoonTitle}</div><div class=\\'placeholder-subtitle\\'>${currentT.screenComingSoonDesc}</div></div>'">
        `;
    } else {
        previewHtml = `
            <div style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:5px;">${currentT.screenshotTitle}</div>
            <div class="screenshot-placeholder-card">
                <div class="placeholder-icon-wrap">
                    <img src="${data.icon || 'app_icons/SmartStep.webp'}" alt="${data.title}" class="placeholder-icon-img">
                </div>
                <div class="placeholder-title">${currentT.screenComingSoonTitle}</div>
                <div class="placeholder-subtitle">${currentT.screenComingSoonDesc}</div>
            </div>
        `;
    }
    
    // Build and inject Details HTML (restoring project description and tech tags)
    detailsContent.innerHTML = `
        <div class="details-header">
            <div>
                <h3 class="details-app-title">${data.title}</h3>
                <span class="details-repo-name">${data.repo}</span>
            </div>
            <a href="${data.github}" target="_blank" class="btn btn-primary" id="detailsViewSourceBtn">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                ${currentT.viewSourceText}
            </a>
        </div>
        
        <div class="details-grid">
            <div class="details-info">
                <div>
                    <h4 class="details-subtitle">${currentT.overviewTitle}</h4>
                    <p class="details-desc">${currentT[appName + 'Desc']}</p>
                </div>
                
                <div>
                    <h4 class="details-subtitle">${currentT.techTitle}</h4>
                    <div class="tech-tags">
                        ${techTagsHtml}
                    </div>
                </div>
            </div>
            
            <div class="details-preview-card" style="background: none; border: none; padding: 0;">
                <div style="text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; width: 100%;">
                    ${previewHtml}
                </div>
            </div>
        </div>
    `;
    
    detailsContent.classList.remove('hidden');
    
    // Smooth scroll down to details section
    if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initial setup
updateDateTime();
setInterval(updateDateTime, 30000);
setLanguage('en'); // Default to English
