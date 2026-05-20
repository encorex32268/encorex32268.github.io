/* ==========================================================================
   TRANSLATIONS DICTIONARY DATABASE
   ========================================================================== */
const translations = {
    en: {
        navExp: "Experience",
        navProj: "Projects",
        navSkills: "Skills",
        navContact: "Contact",
        heroStatus: "Open to Opportunities",
        heroName: "LiHan Chen",
        heroTitle: "Android Engineer / KMP Developer",
        heroDesc: "Specialized in building premium mobile apps with Kotlin, Jetpack Compose, and clean architecture. Expert in Kotlin Multiplatform (KMP) to deliver seamless, shared-logic apps across iOS & Android with optimized performance.",
        btnConnect: "Let's Connect",
        btnGithub: "GitHub Profile",
        expSectionTitle: "Professional Journey",
        expSectionSubtitle: "A chronological timeline of my career path and professional milestones.",
        projSectionTitle: "Featured Creations",
        projSectionSubtitle: "Some of my key applications and architectural implementations.",
        skillSectionTitle: "Technical Mastery",
        skillSectionSubtitle: "Categorized technologies and frameworks I specialize in daily.",
        skillCatMobile: "Mobile Development",
        skillCatBackend: "Backend & Arch",
        skillCatTools: "Tools & Testing",
        contactTitle: "Start a Conversation",
        contactDesc: "I am always open to discussing new opportunities, architecture designs, or collaboration. Drop me an email or connect with me via social media!",
        contactEmailLabel: "Email Me",
        contactLinkedinLabel: "LinkedIn",
        contactGithubLabel: "GitHub",
        footerTech: "Built with Vanilla CSS, Custom Transitions, and Multi-language Engine.",
        experiences: [
            {
                company: "NEC (Taipei)",
                role: "Android Developer",
                date: "Mar 2024 - Present",
                desc: "Developing native applications using MVI architecture and Jetpack Compose. Focused on core feature development, bug fixing, and continuous performance optimization."
            },
            {
                company: "Clara (Tokyo)",
                role: "Mobile Developer",
                date: "Nov 2022 - Jan 2025",
                desc: "Built modern recruitment apps utilizing KMP (Kotlin Multiplatform) and CMP (Compose Multiplatform), successfully reducing mobile development costs for the company by 75%."
            },
            {
                company: "ZTE (Tokyo)",
                role: "QA Test Engineer",
                date: "May 2019 - Nov 2022",
                desc: "Executed comprehensive 5G signal and network quality testing utilizing QXDM diagnostic tools. Conducted deep validation for both Android hardware (such as GPS) and platform software."
            },
            {
                company: "Asgard (Taipei)",
                role: "Software Engineer",
                date: "Jul 2017 - Mar 2019",
                desc: "Developed high-performance backend systems with Java, Spring Boot, and MySQL. Maintained large-scale revision projects for banking, stock market, and insurance sectors."
            },
            {
                company: "Foodomo (Taipei)",
                role: "Mobile Developer Intern",
                date: "Jan 2015 - Sep 2015",
                desc: "Developed utility apps using Java and Objective-C. Designed and implemented a photo-to-reward feature to collect food and dietary big data."
            }
        ],
        projects: [
            {
                name: "QRCraft",
                url: "https://github.com/encorex32268/QRCraft",
                desc: "A modern, responsive QR Code utility app engineered following the Material 3 design guidelines.",
                techs: ["Kotlin", "Compose", "Clean Arch"]
            },
            {
                name: "VibePlayer",
                url: "https://github.com/encorex32268/VibePlayer",
                desc: "A sleek, minimalist music player built with Compose, focusing on smooth interactions and fluid animations.",
                techs: ["Kotlin", "Compose", "ExoPlayer"]
            },
            {
                name: "MoneyManagerKMP",
                url: "https://github.com/encorex32268/MoneyManagerKMP",
                desc: "A cross-platform financial tracking app using Kotlin Multiplatform, sharing business logic natively across iOS and Android.",
                techs: ["KMP", "Compose Multiplatform", "SQLDelight"]
            },
            {
                name: "Jiburi",
                url: "https://github.com/encorex32268/Jiburi",
                desc: "A studio Ghibli API showcase application utilizing modern Android architecture patterns to display movie directories.",
                techs: ["Kotlin", "Retrofit", "Hilt"]
            },
            {
                name: "JPractice",
                url: "https://github.com/encorex32268/JPractice",
                desc: "A beautiful, interactive Japanese kana learning tool, fully launched and operational on the Google Play Store.",
                techs: ["Kotlin", "Jetpack Compose", "Google Play"]
            }
        ]
    },
    zh: {
        navExp: "工作經歷",
        navProj: "個人作品",
        navSkills: "核心技術",
        navContact: "與我聯絡",
        heroStatus: "歡迎各類合作機會",
        heroName: "陳立翰 LiHan Chen",
        heroTitle: "Android 工程師 / KMP 開發者",
        heroDesc: "專精於使用 Kotlin、Jetpack Compose 與乾淨架構（Clean Architecture）開發高品質行動端應用。深耕 Kotlin Multiplatform (KMP) 跨平台開發，為 iOS 與 Android 提供高效、流暢的邏輯共享方案。",
        btnConnect: "與我聯絡",
        btnGithub: "瀏覽 GitHub",
        expSectionTitle: "職涯歷程",
        expSectionSubtitle: "以時間軸呈現我的工作經歷與職涯中取得的重要里程碑。",
        projSectionTitle: "精選個人作品",
        projSectionSubtitle: "我獨立開發並實踐現代架構與技術的重點應用專案。",
        skillSectionTitle: "專業核心技術",
        skillSectionSubtitle: "在日常開發中熟練運用並引以為傲的技術工具與框架。",
        skillCatMobile: "行動端開發核心",
        skillCatBackend: "後端開發與架構",
        skillCatTools: "工具鏈與系統測試",
        contactTitle: "開啟精彩對話",
        contactDesc: "我隨時歡迎討論新的職缺機會、架構設計或是技術合作。透過郵件或社群網站，隨時與我聯繫！",
        contactEmailLabel: "傳送電子郵件",
        contactLinkedinLabel: "LinkedIn",
        contactGithubLabel: "GitHub",
        footerTech: "基於 Vanilla CSS、自訂流暢過渡動畫與多國語系引擎手工打造。",
        experiences: [
            {
                company: "NEC (台北內湖)",
                role: "Android 工程師",
                date: "2024.03 - 現在",
                desc: "採用現代 MVI 架構與 Jetpack Compose 開發商用客戶端應用。負責新功能研發、既有缺陷修復及應用程式效能深度優化。"
            },
            {
                company: "Clara (東京港區)",
                role: "行動端工程師",
                date: "2022.11 - 2025.01",
                desc: "利用 KMP 與 CMP（Compose Multiplatform）跨平台技術開發商務招聘應用，成功為公司節省了高達 75% 的行動端開發成本。"
            },
            {
                company: "ZTE (東京中央區)",
                role: "QA 測試工程師",
                date: "2019.05 - 2022.11",
                desc: "使用 QXDM 調試工具測試 5G 信號強度與網路傳輸品質。針對 Android 手機硬體（如 GPS 晶片）及系統軟體進行深度驗證與品質把關。"
            },
            {
                company: "Asgard (台北)",
                role: "軟體工程師",
                date: "2017.07 - 2019.03",
                desc: "使用 Java、Spring Boot 與 MySQL 開發高效能後端。長期維護大型銀行、股市交易及保險系統的大規模版本升級與改版計畫。"
            },
            {
                company: "Foodomo (台北)",
                role: "行動端開發實習生",
                date: "2015.01 - 2015.09",
                desc: "使用 Java 與 Objective-C 進行原生 app 開發。負責設計並實作「照片兌換積分」功能，協助收集使用者飲食偏好大數據。"
            }
        ],
        projects: [
            {
                name: "QRCraft",
                url: "https://github.com/encorex32268/QRCraft",
                desc: "遵循 Google Material 3 設計規範所開發的現代化、流暢二維碼掃描與生成器工具。",
                techs: ["Kotlin", "Compose", "Clean Arch"]
            },
            {
                name: "VibePlayer",
                url: "https://github.com/encorex32268/VibePlayer",
                desc: "基於 Jetpack Compose 開發的極簡風格音樂播放器，專注於提供流暢的微動畫與互動體驗。",
                techs: ["Kotlin", "Compose", "ExoPlayer"]
            },
            {
                name: "MoneyManagerKMP",
                url: "https://github.com/encorex32268/MoneyManagerKMP",
                desc: "使用 Kotlin Multiplatform 技術開發的跨平台記帳應用，達成 iOS 與 Android 端核心商業邏輯的百分之百共享。",
                techs: ["KMP", "Compose Multiplatform", "SQLDelight"]
            },
            {
                name: "Jiburi",
                url: "https://github.com/encorex32268/Jiburi",
                desc: "整合吉卜力工作室 API 的展示應用程式，運用現代 Android 單一信源與依賴注入等最佳架構實踐呈現電影資訊。",
                techs: ["Kotlin", "Retrofit", "Hilt"]
            },
            {
                name: "JPractice",
                url: "https://github.com/encorex32268/JPractice",
                desc: "精心設計且深具互動性的日語五十音學習工具，目前已成功上架於 Google Play 商店並穩定運行中。",
                techs: ["Kotlin", "Jetpack Compose", "Google Play"]
            }
        ]
    },
    jp: {
        navExp: "職務経歴",
        navProj: "プロジェクト",
        navSkills: "スキル",
        navContact: "お問い合わせ",
        heroStatus: "お仕事のご依頼受付中",
        heroName: "チェン リハン (LiHan Chen)",
        heroTitle: "Android エンジニア / KMP デベロッパー",
        heroDesc: "Kotlin、Jetpack Compose、およびクリーンアーキテクチャを用いたプレミアムモバイルアプリ開発のスペシャリスト。Kotlin Multiplatform (KMP) に精通し、iOS/Android間でのビジネスロジック共通化による高効率で最適なパフォーマンスを提供します。",
        btnConnect: "お問い合わせ",
        btnGithub: "GitHub プロファイル",
        expSectionTitle: "プロフェッショナルな歩み",
        expSectionSubtitle: "私のこれまでのキャリアパスとプロフェッショナルとしての節目を時系列でご紹介します。",
        projSectionTitle: "代表的なプロジェクト",
        projSectionSubtitle: "これまで開発した主なアプリケーションとアーキテクチャの実装例です。",
        skillSectionTitle: "技術スキル",
        skillSectionSubtitle: "日々の開発業務で得意とし、活用している主要な技術スタックです。",
        skillCatMobile: "モバイル開発核心",
        skillCatBackend: "バックエンド・設計",
        skillCatTools: "ツールチェーン・検証",
        contactTitle: "コラボレーションを開始",
        contactDesc: "新しいキャリアの機会、システム設計、技術的なコラボレーションについて常にオープンに話し合っています。メールやSNSでお気軽にご連絡ください！",
        contactEmailLabel: "メール送信",
        contactLinkedinLabel: "LinkedIn",
        contactGithubLabel: "GitHub",
        footerTech: "Vanilla CSS、カスタムアニメーション、および多言語ローカライズエンジンによるハンドメイド構築。",
        experiences: [
            {
                company: "NEC (台北)",
                role: "Android デベロッパー",
                date: "2024.03 - 現在",
                desc: "MVIアーキテクチャとJetpack Composeを採用したネイティブアプリ開発。新規機能実装、バグ修正、および継続的なパフォーマンスチューニングに従事。"
            },
            {
                company: "クララ (東京)",
                role: "モバイルデベロッパー",
                date: "2022.11 - 2025.01",
                desc: "KMP（Kotlin Multiplatform）およびCMP（Compose Multiplatform）を導入した採用ビジネスアプリの開発。モバイル端末の開発コストを75%削減することに成功。"
            },
            {
                company: "ZTE (東京)",
                role: "QAテストエンジニア",
                date: "2019.05 - 2022.11",
                desc: "QXDM診断ツールを用いた5Gシグナルおよび通信品質テストの設計・実行。Androidの各種センサー（GPSなど）とシステムソフトウェアの深い検証を担当。"
            },
            {
                company: "アスガルド (台北)",
                role: "ソフトウェアエンジニア",
                date: "2017.07 - 2019.03",
                desc: "Java、Spring Boot、およびMySQLを用いた高性能なバックエンド開発。銀行、株式市場、および保険会社向けの大規模なリニューアルプロジェクトを担当。"
            },
            {
                company: "Foodomo (台北)",
                role: "モバイルアプリインターン",
                date: "2015.01 - 2015.09",
                desc: "JavaおよびObjective-Cを用いたアプリ開発。ビッグデータ収集用の機能を目的とした「写真によるポイント還元機能」の設計・開発を実装。"
            }
        ],
        projects: [
            {
                name: "QRCraft",
                url: "https://github.com/encorex32268/QRCraft",
                desc: "GoogleのMaterial 3設計ガイドラインに準拠して設計された、モダンでレスポンシブなQRコードスキャナー兼生成ツール。",
                techs: ["Kotlin", "Compose", "Clean Arch"]
            },
            {
                name: "VibePlayer",
                url: "https://github.com/encorex32268/VibePlayer",
                desc: "Composeで構築された、スムーズなインタラクションと流れるようなアニメーションに特化したシンプルで美しい音楽プレイヤー。",
                techs: ["Kotlin", "Compose", "ExoPlayer"]
            },
            {
                name: "MoneyManagerKMP",
                url: "https://github.com/encorex32268/MoneyManagerKMP",
                desc: "Kotlin Multiplatformを採用し、iOSとAndroidでビジネスロジックをネイティブに共有するクロスプラットフォーム家計簿アプリ。",
                techs: ["KMP", "Compose Multiplatform", "SQLDelight"]
            },
            {
                name: "Jiburi",
                url: "https://github.com/encorex32268/Jiburi",
                desc: "スタジオジブリの公式APIを活用し、最新のAndroidアーキテクチャ手法を用いて開発されたジブリ映画情報ディレクトリ表示アプリ。",
                techs: ["Kotlin", "Retrofit", "Hilt"]
            },
            {
                name: "JPractice",
                url: "https://github.com/encorex32268/JPractice",
                desc: "使いやすくインタラクティブに設計された日本語の五十音（かな）学習ツール。Google Play ストアにて公開中。",
                techs: ["Kotlin", "Jetpack Compose", "Google Play"]
            }
        ]
    }
};

/* ==========================================================================
   TRANSLATION ENGINE CONTROLLER
   ========================================================================== */
function changeLang(lang) {
    const data = translations[lang];
    if (!data) return;

    // 1. Translation for static nodes using data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (data[key]) {
            element.innerText = data[key];
        }
    });

    // 2. Dynamic generation of Experience Timeline
    const experienceList = document.getElementById('experienceList');
    if (experienceList) {
        experienceList.innerHTML = ''; // Clean up first
        
        data.experiences.forEach((exp, idx) => {
            const item = document.createElement('div');
            item.className = 'timeline-item fade-in';
            // Set active state for the first item (current position)
            if (idx === 0) {
                item.classList.add('active');
            }
            
            // Set progressive delay to create premium entrance motion
            item.style.animationDelay = `${idx * 0.12}s`;
            
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-card">
                    <div class="timeline-header">
                        <div>
                            <h3 class="timeline-role">${exp.role}</h3>
                            <div class="timeline-company-info">
                                <i class="fa-solid fa-building"></i> ${exp.company}
                            </div>
                        </div>
                        <span class="timeline-date-badge">${exp.date}</span>
                    </div>
                    <p class="timeline-desc">${exp.desc}</p>
                </div>
            `;
            experienceList.appendChild(item);
        });
    }

    // 3. Dynamic generation of Projects Showcase
    const projectList = document.getElementById('projectList');
    if (projectList) {
        projectList.innerHTML = ''; // Clean up first
        
        data.projects.forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = 'project-card fade-in';
            card.style.animationDelay = `${idx * 0.1}s`;
            
            // Create tech badges HTML
            const techBadges = proj.techs.map(tech => `<span class="project-badge">${tech}</span>`).join('');
            
            card.innerHTML = `
                <div class="project-card-header">
                    <div class="project-icon">
                        <i class="fa-brands fa-github"></i>
                    </div>
                    <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="Open project repository">
                        Code <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
                <h3 class="project-name">${proj.name}</h3>
                <p class="project-desc">${proj.desc}</p>
                <div class="project-badges">
                    ${techBadges}
                </div>
            `;
            projectList.appendChild(card);
        });
    }
}

/* ==========================================================================
   THEME MANAGER CONTROLLER
   ========================================================================== */
function initTheme() {
    const themeIcon = document.getElementById('themeIcon');
    const storedTheme = localStorage.getItem('theme');
    
    // Check local storage preference or fall back to system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }
}

function toggleDarkMode() {
    const themeIcon = document.getElementById('themeIcon');
    const isDark = document.documentElement.classList.contains('dark');
    
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-moon';
            // Subtle pop animation
            themeIcon.classList.add('fa-bounce');
            setTimeout(() => themeIcon.classList.remove('fa-bounce'), 800);
        }
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.className = 'fa-solid fa-sun';
            themeIcon.classList.add('fa-spin');
            setTimeout(() => themeIcon.classList.remove('fa-spin'), 800);
        }
    }
}

/* ==========================================================================
   INTERACTION & SCROLL HANDLERS
   ========================================================================== */
function initScrollListeners() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    
    if (mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDrawer.classList.toggle('active');
            
            // Toggle menu icon between bars and x
            const icon = mobileToggle.querySelector('i');
            if (mobileDrawer.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close drawer on click outside
        document.addEventListener('click', (e) => {
            if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileDrawer.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });

        // Close drawer when clicking nav links
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

/* Scroll Reveal Intersection Observer */
function initScrollReveal() {
    const options = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it has revealed
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observe specific cards and containers
    document.querySelectorAll('.skills-card, .contact-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

/* ==========================================================================
   INITIALIZATION TRIGGER
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize active theme settings
    initTheme();
    
    // 2. Setup scroll listeners and mobile menu triggers
    initScrollListeners();
    initMobileMenu();
    
    // 3. Initialize Language settings (Defaulting to English 'en')
    const langSelect = document.getElementById('langSelect');
    let activeLang = 'en';
    const storedLang = localStorage.getItem('lang');
    
    if (storedLang && ['en', 'zh', 'jp'].includes(storedLang)) {
        activeLang = storedLang;
    }
    
    if (langSelect) {
        langSelect.value = activeLang;
        langSelect.addEventListener('change', (e) => {
            const nextLang = e.target.value;
            localStorage.setItem('lang', nextLang);
            changeLang(nextLang);
        });
    }
    
    // Trigger initial language translation load
    changeLang(activeLang);
    
    // 4. Setup Theme Toggle button listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // 5. Initialize Intersection Observers for Scroll Reveal
    setTimeout(initScrollReveal, 400);

    // 6. Complete loading state
    document.body.classList.remove('loading');
});
