// 頁面切換功能（用戶點擊觸發）
function showPage(pageId) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // 顯示選中頁面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新頁面標題
    updatePageTitle(pageId);
    
    // 更新導航狀態
    updateNavActiveState(pageId);
    
    // 移動端選單收起
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // 關閉手機版下拉選單
    document.querySelectorAll('.nav-item.dropdown.mobile-active').forEach(item => {
        item.classList.remove('mobile-active');
    });
    
    // 更新瀏覽器URL（pushState用於用戶操作）
    if (pageId !== 'course-detail') {
        history.pushState({page: pageId}, '', `#${pageId}`);
    }
    
    // 滾動到頁面最上方
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 移動端選單切換
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// 手機版下拉選單切換
function toggleMobileDropdown(event) {
    // 只在手機版執行
    if (window.innerWidth > 768) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // 手機版直接顯示所有課程選項，不需要切換
    // 這個函數現在主要用於阻止預設行為
}

// 隱藏下拉選單
function hideDropdown() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show-dropdown');
    });
}

// 輪播照片功能
let currentSlideIndex = 1;

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) currentSlideIndex = 1;
    if (n < 1) currentSlideIndex = slides.length;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (dots[currentSlideIndex - 1]) {
        dots[currentSlideIndex - 1].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
}

function currentSlide(n) {
    currentSlideIndex = n;
    showSlide(currentSlideIndex);
}

// 自動輪播
function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

// 初始化輪播自動播放
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, 5000); // 每5秒切換
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// 滾動效果
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.card, .course-table, .about-content');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in', 'visible');
        }
    });
}

// URL處理和頁面初始化
function handleUrlAndInit() {
    const hash = window.location.hash.substring(1); // 移除 #
    
    if (hash.startsWith('course-')) {
        // 如果是課程頁面
        const courseId = hash.replace('course-', '');
        if (courseData[courseId]) {
            previousPage = 'corporate'; // 假設從企業課程頁面進入
            showCourseDetail(courseId);
            return;
        }
    } else if (hash && ['home', 'corporate', 'enterprise-training', 'consulting', 'about'].includes(hash)) {
        // 如果是普通頁面
        showPageFromUrl(hash);
        return;
    }
    
    // 默認顯示首頁並設定URL
    showPageFromUrl('home');
}

// 從URL載入頁面（不觸發pushState避免重複）
function showPageFromUrl(pageId) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // 顯示選中頁面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新頁面標題
    updatePageTitle(pageId);
    
    // 更新導航狀態
    updateNavActiveState(pageId);
    
    // 移動端選單收起
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // 確保URL有正確的hash
    if (window.location.hash !== `#${pageId}`) {
        history.replaceState({page: pageId}, '', `#${pageId}`);
    }
    
    // 滾動到頁面最上方
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 更新導航活動狀態
function updateNavActiveState(pageId) {
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // 檢查連結的onclick屬性
        const onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes(`'${pageId}'`)) {
            link.classList.add('active');
        }
    });
}

// 更新課程詳細頁面的導航狀態
function updateCourseDetailNavState(courseId) {
    // 清除所有active狀態
    const navLinks = document.querySelectorAll('.nav-item a, .dropdown-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // 根據課程ID確定對應的主選單和子選單
    let mainNavSelector = '';
    let subNavSelector = '';
    
    // 實體常態課程
    if (['vibe-coding', 'ai-analytics', 'ai-automation', 'digital-media'].includes(courseId)) {
        mainNavSelector = 'a[onclick*="corporate"]';
        subNavSelector = `a[onclick*="showCourseDetail('${courseId}')"]`;
    }
    // 企業內訓課程
    else if (['enterprise-general', 'enterprise-custom'].includes(courseId)) {
        mainNavSelector = 'a[onclick*="enterprise-training"]';
        subNavSelector = `a[onclick*="showCourseDetail('${courseId}')"]`;
    }
    
    // 設置主選單高亮
    if (mainNavSelector) {
        const mainNavLink = document.querySelector(mainNavSelector);
        if (mainNavLink) {
            mainNavLink.classList.add('active');
        }
    }
    
    // 設置子選單高亮
    if (subNavSelector) {
        const subNavLink = document.querySelector(subNavSelector);
        if (subNavLink) {
            subNavLink.classList.add('active');
        }
    }
}

// 更新頁面標題
function updatePageTitle(pageId, courseTitle = null) {
    const baseName = '智日未來科技 WisdomDaytech';
    const pageTitles = {
        'home': `${baseName} - AI時代的科技教育領航者`,
        'corporate': `實體常態課程 - ${baseName}`,
        'enterprise-training': `企業內訓課程 - ${baseName}`,
        'consulting': `自動化顧問服務 - ${baseName}`,
        'about': `關於我們 - ${baseName}`,
        'course-detail': courseTitle ? `${courseTitle} - ${baseName}` : `課程詳細 - ${baseName}`
    };
    
    document.title = pageTitles[pageId] || pageTitles['home'];
}

// 瀏覽器前進/後退按鈕支援
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.page === 'course-detail' && event.state.courseId) {
            showCourseDetail(event.state.courseId);
        } else {
            showPage(event.state.page);
        }
    } else {
        handleUrlAndInit();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 為卡片和其他元素添加滾動動畫類
    const animatedElements = document.querySelectorAll('.card, .course-table, .about-content');
    animatedElements.forEach(el => el.classList.add('fade-in'));
    
    // 滾動監聽
    window.addEventListener('scroll', handleScrollAnimations);
    
    // 初始檢查
    handleScrollAnimations();
    
    // 處理初始URL
    handleUrlAndInit();
    
    // 初始化課程表格
    const courseTableBody = document.getElementById('course-table-body');
    if (courseTableBody) {
        courseTableBody.innerHTML = generateSortedCourseTable();
    }
    
    // 初始化輪播功能
    if (document.querySelector('.carousel-slide')) {
        startAutoSlide();
        
        // 滑鼠懸停時暫停自動播放
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }
    
    // 手機版下拉選單點擊事件
    const dropdownLinks = document.querySelectorAll('.nav-item.dropdown > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', toggleMobileDropdown);
    });
    
    // 點擊其他地方關閉下拉選單
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isDropdownClick = event.target.closest('.nav-item.dropdown');
            if (!isDropdownClick) {
                // 手機版不需要關閉下拉選單，因為課程選項直接顯示
            }
        }
    });
});

// 監聽hash變化（用戶手動修改URL時）
window.addEventListener('hashchange', function() {
    handleUrlAndInit();
});

// 響應式導航
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
        // 移除手機版下拉選單的活動狀態
        document.querySelectorAll('.nav-item.dropdown.mobile-active').forEach(item => {
            item.classList.remove('mobile-active');
        });
    }
});

// 課程資料庫
const courseData = {
    'vibe-coding': {
        title: 'Vibe Coding AI 軟體開發實戰班',
        subtitle: '運用AI技術革新軟體開發流程，快速構建現代化應用程式',
        description: '本課程將教授您如何運用最新的AI開發工具，從零開始建立完整的軟體應用程式。透過實務導向的教學方式，讓您掌握AI輔助開發的核心技能，並學會將應用程式部署到雲端平台。',
        image: 'image/vibe-coding.png',
        firstClassDate: '2025/8/22', // 第一堂課日期
        scheduleText: '2025/8/22(五)、2025/8/29(五)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: 'AI程式碼生成', desc: '學習使用GitHub Copilot、Cursor等AI工具加速開發' },
            { title: '全端開發技能', desc: '掌握前端介面設計與後端邏輯實現' },
            { title: '雲端部署實戰', desc: '透過Firebase實現應用程式自動部署與上架' },
            { title: '專案作品集', desc: '完成2-3個實際可用的軟體專案作品' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: 'AI開發環境建置與基礎', content: '• AI開發工具介紹與安裝\n• Cursor IDE使用教學\n• GitHub Copilot設定\n• 基礎程式設計概念復習' },
            { day: '第一天', time: '13:30-16:30', topic: '前端開發與AI輔助', content: '• HTML/CSS/JavaScript基礎\n• AI輔助前端開發\n• 響應式設計實作\n• 使用者介面設計原則' },
            { day: '第二天', time: '09:30-12:30', topic: '後端邏輯與API開發', content: '• Node.js基礎與Express框架\n• RESTful API設計\n• 資料庫連接與操作\n• AI輔助後端開發' },
            { day: '第二天', time: '13:30-16:30', topic: 'Firebase部署與專案完成', content: '• Firebase平台介紹\n• 專案部署流程\n• 域名設定與SSL憑證\n• 專案展示與問題解決' }
        ]
    },
    'ai-analytics': {
        title: 'AI 數據分析與決策實戰班',
        subtitle: '運用AI技術進行深度數據挖掘，提供企業決策強力支撐',
        description: '本課程專為企業決策者與數據分析師設計，教授如何運用AI工具進行高效數據分析，發現隱藏的商業洞察，並建立數據驅動的決策機制。',
        image: 'image/ai-analytics.png',
        firstClassDate: '2025/9/3', // 第一堂課日期
        scheduleText: '2025/9/3(三)、2025/9/10(三)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '智能數據清理', desc: '使用AI工具快速處理髒數據與缺失值' },
            { title: '預測模型建立', desc: '建構業務預測模型，預測銷售與市場趨勢' },
            { title: '視覺化報表', desc: '製作互動式儀表板與數據視覺化報表' },
            { title: '決策支援系統', desc: '建立自動化決策建議系統' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: '數據分析基礎與AI工具', content: '• Python數據分析環境建置\n• Pandas、NumPy基礎操作\n• AI輔助數據清理技術\n• 數據品質評估方法' },
            { day: '第一天', time: '13:30-16:30', topic: '探索性數據分析', content: '• 統計描述與數據分布\n• 相關性分析與特徵工程\n• 異常值檢測與處理\n• AI輔助特徵選取' },
            { day: '第二天', time: '09:30-12:30', topic: '機器學習模型建立', content: '• 監督學習模型實作\n• 模型評估與調優\n• 預測模型建立\n• AutoML工具使用' },
            { day: '第二天', time: '13:30-16:30', topic: '報表製作與決策系統', content: '• Power BI / Tableau實作\n• 互動式儀表板設計\n• 自動化報表生成\n• 決策建議系統建立' }
        ]
    },
    'ai-automation': {
        title: '企業流程 AI 自動化實戰班',
        subtitle: '運用低代碼平台實現企業流程自動化，大幅提升營運效率',
        description: '本課程教授如何使用Make.com、Google Apps Script等工具，建立智能化的業務流程自動化系統，減少重複性工作，提升企業整體效率。',
        image: 'image/ai-automation.png',
        firstClassDate: '2025/9/5', // 第一堂課日期
        scheduleText: '2025/9/5(五)、2025/9/12(五)', // 完整課程時間
        time: '09:30~16:30',
        location: '犇亞商務暨會議中心',
        features: [
            { title: '流程分析與設計', desc: '識別可自動化流程，設計最佳化工作流程' },
            { title: 'Make.com平台精通', desc: '掌握視覺化流程建構與API整合' },
            { title: 'Google Workspace整合', desc: '自動化文件處理、郵件發送、行事曆管理' },
            { title: '智能通知系統', desc: '建立多渠道智能通知與提醒機制' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: '自動化概念與平台介紹', content: '• 業務流程自動化基礎\n• Make.com平台註冊與設定\n• 基礎模組與觸發器\n• 簡單自動化流程建立' },
            { day: '第一天', time: '13:30-16:30', topic: 'Google Workspace自動化', content: '• Google Apps Script入門\n• Gmail自動化處理\n• Google Sheets數據自動化\n• Google Drive檔案管理自動化' },
            { day: '第二天', time: '09:30-12:30', topic: '複雜流程設計與API整合', content: '• 條件判斷與迴圈設計\n• 第三方服務API整合\n• 錯誤處理與例外管理\n• 流程測試與除錯' },
            { day: '第二天', time: '13:30-16:30', topic: '企業級自動化專案', content: '• 客戶關係管理自動化\n• 訂單處理流程自動化\n• 人事管理流程自動化\n• 監控與維護機制建立' }
        ]
    },
    'digital-media': {
        title: '自媒體 AI 數位創作實戰班',
        subtitle: '打造全自動化自媒體經營系統，從內容創作到發布一站到位',
        description: '本課程將教授您建立完整的自媒體自動化系統，從數據收集、內容創作、影片製作到自動發布，實現真正的自媒體經營自動化。',
        image: 'image/digital-media.png',
        firstClassDate: '2025/9/11', // 第一堂課日期
        scheduleText: '2025/9/11(四)、2025/9/18(四)', // 完整課程時間
        time: '09:30~16:30',
        location: 'TCCC台灣文創訓練中心-台北松江1館',
        features: [
            { title: '智能內容生成', desc: '使用AI工具自動生成高質量文案與腳本' },
            { title: '自動化影片製作', desc: '批量製作短影片與長影片內容' },
            { title: '多平台發布', desc: '同時發布至YouTube、TikTok、Instagram等平台' },
            { title: '數據分析優化', desc: '分析內容表現，持續優化創作策略' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: '自媒體策略與AI內容創作', content: '• 自媒體經營策略規劃\n• ChatGPT內容創作技巧\n• 標題與縮圖優化\n• 腳本撰寫自動化' },
            { day: '第一天', time: '13:30-16:30', topic: '影片製作自動化', content: '• AI配音工具使用\n• 自動化剪輯軟體操作\n• 字幕生成與同步\n• 影片模板設計' },
            { day: '第二天', time: '09:30-12:30', topic: '多平台發布系統', content: '• YouTube API設定與使用\n• 社群媒體發布自動化\n• 排程發布系統建立\n• 跨平台內容適配' },
            { day: '第二天', time: '13:30-16:30', topic: '數據追蹤與優化', content: '• 網路爬蟲技術應用\n• 競爭對手分析自動化\n• 熱門話題監控系統\n• 成效分析與優化策略' }
        ]
    },
    'custom-training': {
        title: '客製化企業內訓包班',
        subtitle: '根據企業特定需求，提供完全客製化的內部培訓課程',
        description: '我們將根據貴公司的具體需求和目標，設計專屬的AI培訓課程，確保每位員工都能掌握最適合其工作職能的AI技能。',
        image: 'image/enterprise-training.png',
        features: [
            { title: '需求分析', desc: '深入了解企業需求，制定專屬培訓計畫' },
            { title: '客製課程', desc: '根據企業文化和目標設計專屬課程內容' },
            { title: '彈性安排', desc: '配合企業時間安排，提供最適合的培訓時程' },
            { title: '持續支援', desc: '提供課後諮詢和技術支援服務' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: '企業需求分析與AI基礎', content: '• 企業現況分析與需求評估\n• AI技術概論與應用案例\n• 企業AI轉型策略規劃\n• 員工技能現況盤點' },
            { day: '第一天', time: '13:30-16:30', topic: '客製化AI工具導入', content: '• 企業專屬AI工具選擇\n• 工具安裝與環境設定\n• 基礎操作教學\n• 實務案例演練' },
            { day: '第二天', time: '09:30-12:30', topic: '部門應用實戰', content: '• 各部門AI應用場景分析\n• 實際業務流程優化\n• 團隊協作AI工具使用\n• 效率提升策略制定' },
            { day: '第二天', time: '13:30-16:30', topic: '成效評估與持續改進', content: '• AI導入成效評估\n• 問題診斷與解決方案\n• 後續發展規劃\n• 技術支援機制建立' }
        ]
    },
    'enterprise-general': {
        title: '企業常態課內訓包班',
        subtitle: '根據常態課程內容，提供企業內部培訓課程',
        description: '本課程將我們現有的常態課程內容調整為企業內部培訓版本，讓企業員工能夠在熟悉的環境中學習AI技能，提升整體團隊的數位化能力。',
        image: 'image/enterprise-training-generally.png',
        features: [
            { title: '常態課程內容', desc: '基於現有實體常態課程，調整為企業內訓版本' },
            { title: '團隊學習', desc: '適合企業內部團隊一起學習，提升協作效率' },
            { title: '彈性時間', desc: '可根據企業需求安排上課時間' },
            { title: '實務應用', desc: '結合企業實際業務場景進行教學' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:30', topic: 'AI基礎概念與工具介紹', content: '• AI技術概覽\n• 常用AI工具介紹\n• 企業AI應用案例\n• 基礎操作教學' },
            { day: '第一天', time: '13:30-16:30', topic: '實務操作演練', content: '• 分組實作練習\n• 企業場景模擬\n• 問題解決討論\n• 成果分享' },
            { day: '第二天', time: '09:30-12:30', topic: '進階應用與整合', content: '• 進階功能教學\n• 系統整合應用\n• 效率提升技巧\n• 最佳實務分享' },
            { day: '第二天', time: '13:30-16:30', topic: '企業導入規劃', content: '• 導入策略制定\n• 風險評估與管理\n• 成效評估方法\n• 後續支援機制' }
        ]
    },
    'enterprise-custom': {
        title: '客製化企業內訓包班',
        subtitle: '根據企業特定需求，提供完全客製化的內部培訓課程',
        description: '本課程專為企業量身打造，根據企業的產業特性、業務需求、技術水準等因素，設計完全客製化的AI培訓方案，確保每位員工都能掌握最適合的AI技能。',
        image: 'image/enterprise-training-customization.png',
        features: [
            { title: '需求分析', desc: '深入了解企業業務流程與AI應用需求' },
            { title: '客製化設計', desc: '根據企業特性設計專屬培訓內容' },
            { title: '分層教學', desc: '針對不同職級與技術背景設計課程' },
            { title: '持續支援', desc: '提供培訓後的技術支援與諮詢服務' }
        ],
        schedule: [
            { day: '需求調研', time: '1-2週', topic: '企業現況分析', content: '• 業務流程盤點\n• AI應用機會識別\n• 員工技能評估\n• 培訓需求確認' },
            { day: '課程設計', time: '2-3週', topic: '客製化方案制定', content: '• 課程內容設計\n• 教學方式規劃\n• 教材準備\n• 評估機制建立' },
            { day: '培訓執行', time: '依需求', topic: '分階段培訓實施', content: '• 基礎概念教學\n• 實務操作演練\n• 專案實作指導\n• 成果驗收' },
            { day: '後續支援', time: '持續', topic: '技術支援與優化', content: '• 問題諮詢服務\n• 進階應用指導\n• 成效追蹤評估\n• 持續改進建議' }
        ]
    }
};

// 生成排序後的課程表格HTML
function generateSortedCourseTable() {
    // 獲取所有課程並按第一堂課日期排序
    const courses = Object.entries(courseData)
        .filter(([key, course]) => course.firstClassDate) // 只包含有日期的課程
        .sort((a, b) => {
            // 將日期字符串轉換為Date對象進行比較
            const dateA = new Date(a[1].firstClassDate.replace(/\//g, '-'));
            const dateB = new Date(b[1].firstClassDate.replace(/\//g, '-'));
            return dateA - dateB; // 升序排列（最早的在前）
        });

    // 生成表格HTML
    const tableRows = courses.map(([courseId, course]) => `
        <tr>
            <td><a href="javascript:void(0)" onclick="showCourseDetail('${courseId}'); return false;" class="course-link">${course.title}</a></td>
            <td>${course.scheduleText}</td>
            <td>${course.time}</td>
            <td><a href="https://www.google.com/maps/search/${encodeURIComponent(course.location)}" target="_blank" class="location-link" title="點擊開啟Google Maps">${course.location}</a></td>
        </tr>
    `).join('');

    return tableRows;
}

// 全域變數儲存返回頁面
let previousPage = 'corporate';

// 顯示課程詳細頁面
function showCourseDetail(courseId) {
    // 隱藏下拉選單
    hideDropdown();
    
    // 記錄當前頁面
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) {
        previousPage = currentActive.id;
        window.lastCourseSourcePage = currentActive.id; // 記錄來源頁面
    }
    
    // 記錄點擊的課程卡片位置
    const courseCard = document.querySelector(`[onclick="showCourseDetail('${courseId}')"]`);
    if (courseCard) {
        window.lastCourseScrollPosition = courseCard.offsetTop - 100; // 減去100px讓卡片稍微在視窗上方
        window.lastClickedCourseId = courseId;
    }
    
    // 簡化邏輯：根據課程類型直接設置返回頁面
    // 企業內訓課程永遠返回企業內訓頁面
    if (['enterprise-general', 'enterprise-custom'].includes(courseId)) {
        window.lastCourseSourcePage = 'enterprise-training';
        window.isFromHomeTable = false;
    } 
    // 實體常態課程：根據當前頁面和點擊來源判斷
    else if (['vibe-coding', 'ai-analytics', 'ai-automation', 'digital-media'].includes(courseId)) {
        // 檢查是否從首頁的課程表格點擊
        const courseLink = document.querySelector(`#home a[onclick*="showCourseDetail('${courseId}')"]`);
        const isFromHomeTable = currentActive && currentActive.id === 'home' && 
                               courseLink && courseLink.classList.contains('course-link');
        
        if (isFromHomeTable && !window.clickedFromNavMenu) {
            window.isFromHomeTable = true;
        } else {
            window.lastCourseSourcePage = 'corporate';
            window.isFromHomeTable = false;
        }
    } 
    // 其他情況
    else {
        window.lastCourseSourcePage = currentActive ? currentActive.id : 'corporate';
        window.isFromHomeTable = false;
    }
    
    // 清除導航選單點擊標記
    window.clickedFromNavMenu = false;
    
    // 記錄課程卡片位置用於返回時高亮顯示
    const allCourseCards = document.querySelectorAll(`[onclick*="showCourseDetail('${courseId}')"]`);
    if (allCourseCards.length > 0) {
        // 優先選擇卡片類型的元素（用於高亮顯示）
        const cardElement = Array.from(allCourseCards).find(card => 
            card.classList.contains('clickable-card') || card.classList.contains('card')
        );
        if (cardElement) {
            window.lastCourseCardElement = cardElement;
        }
    }
    

    const course = courseData[courseId];
    if (!course) return;

    // 更新頁面標題
    updatePageTitle('course-detail', course.title);

    // 更新瀏覽器URL，添加課程標籤
    history.pushState({page: 'course-detail', courseId: courseId}, '', `#course-${courseId}`);

    // 生成課程詳細內容
    const contentHTML = `
        <div class="course-header">
            <img src="${course.image}" alt="${course.title}" class="course-hero-image">
            <h1 class="course-title">${course.title}</h1>
            <p class="course-subtitle">${course.subtitle}</p>
            <div class="price-section">
                ${courseId === 'enterprise-general' || courseId === 'enterprise-custom' ? 
                    '<span style="color: #718096; font-weight: 600; font-size: 1.5rem;">依需求報價</span>' :
                    `<span class="original-price">原價 NT$ 16,000</span>
                    <span class="current-price">NT$ 10,000</span>
                    <span class="discount-badge">限時優惠 38% OFF</span>`
                }
            </div>
        </div>

        <div class="course-description">
            <h3>課程簡介</h3>
            <p>${course.description}</p>
        </div>

        <div class="course-features">
            ${course.features.map(feature => `
                <div class="feature-item">
                    <h4>${feature.title}</h4>
                    <p>${feature.desc}</p>
                </div>
            `).join('')}
        </div>

        <div class="course-schedule">
            <h3><i class="fas fa-calendar-alt"></i> 課程安排 (2天共12小時)</h3>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>時間</th>
                        <th>主題</th>
                        <th>內容大綱</th>
                    </tr>
                </thead>
                <tbody>
                    ${course.schedule.map((session, index) => `
                        ${index === 0 || session.day !== course.schedule[index-1].day ? 
                            `<tr><td colspan="3" class="day-header">${session.day}</td></tr>` : ''}
                        <tr>
                            <td>${session.time}</td>
                            <td><strong>${session.topic}</strong></td>
                            <td style="text-align: left; white-space: pre-line;">${session.content}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
            <a href="#" class="btn btn-primary" style="font-size: 1.2rem; padding: 1rem 2rem;">
                <i class="fas fa-phone"></i> 立即報名諮詢
            </a>
        </div>
        
    `;

    // 更新課程詳細內容
    document.getElementById('course-detail-content').innerHTML = contentHTML;

    // 更新浮動返回按鈕
    const backButton = document.getElementById('dynamic-back-button');
    if (backButton) {
        if (isFromHomeTable) {
            backButton.innerHTML = '<i class="fas fa-home"></i> 返回首頁';
            backButton.onclick = goBackToHome;
        } else {
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> 返回課程列表';
            backButton.onclick = goBackToCourses;
        }
        backButton.style.display = 'inline-flex';
    }

    // 切換到課程詳細頁面
    showPage('course-detail');
    
    // 更新導航狀態 - 設置課程詳細頁面的高亮狀態
    updateCourseDetailNavState(courseId);
    
    // 滾動到頁面最上方
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 返回課程列表
function goBackToCourses() {
    // 根據來源頁面決定返回位置
    const sourcePage = window.lastCourseSourcePage || 'corporate';
    showPage(sourcePage);
    
    // 延遲滾動到課程位置，確保頁面已完全載入
    setTimeout(() => {
        if (window.lastCourseScrollPosition !== undefined) {
            window.scrollTo({
                top: window.lastCourseScrollPosition,
                behavior: 'smooth'
            });
            
            // 高亮顯示剛才點擊的課程卡片
            if (window.lastClickedCourseId) {
                // 尋找對應的課程卡片（優先選擇.clickable-card類型）
                const allCards = document.querySelectorAll(`[onclick*="showCourseDetail('${window.lastClickedCourseId}')"]`);
                const courseCard = Array.from(allCards).find(card => 
                    card.classList.contains('clickable-card') || card.classList.contains('card')
                ) || allCards[0];
                
                if (courseCard) {
                    courseCard.style.transform = 'scale(1.02)';
                    courseCard.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.4)';
                    courseCard.style.border = '2px solid #00d4ff';
                    courseCard.style.transition = 'all 0.3s ease';
                    
                    // 3秒後恢復正常樣式
                    setTimeout(() => {
                        courseCard.style.transform = '';
                        courseCard.style.boxShadow = '';
                        courseCard.style.border = '';
                        courseCard.style.transition = '';
                    }, 3000);
                }
            }
        } else {
            // 如果沒有記錄位置，滾動到課程區域開始
            const courseSection = document.querySelector('#corporate .card-grid');
            if (courseSection) {
                window.scrollTo({
                    top: courseSection.offsetTop - 120,
                    behavior: 'smooth'
                });
            }
        }
    }, 100);
}

// 返回首頁並定位到課程表格
function goBackToHome() {
    showPage('home');
    
    // 延遲滾動到課程表格位置
    setTimeout(() => {
        const courseTable = document.querySelector('.course-table');
        if (courseTable) {
            const tablePosition = courseTable.offsetTop - 100; // 減去100px讓表格稍微在視窗上方
            window.scrollTo({
                top: tablePosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// 切換頁面但不自動滾動到頂部
function showPageWithoutScroll(pageId) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // 顯示選中頁面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新導航狀態
    updateNavActiveState(pageId);
    
    // 移動端選單收起
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}
