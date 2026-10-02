// 課程資料最後更新時間: 2026/4/24 上午3:52:23
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
    
    // 管理返回按鈕顯示
    const courseBackButton = document.getElementById('dynamic-back-button');
    const registrationBackButton = document.getElementById('registration-back-button');
    
    if (pageId === 'course-detail') {
        // 課程詳細頁面：顯示課程返回按鈕，隱藏報名返回按鈕
        if (courseBackButton) courseBackButton.style.display = 'inline-flex';
        if (registrationBackButton) registrationBackButton.style.display = 'none';
    } else if (pageId === 'registration') {
        // 報名頁面：顯示報名返回按鈕，隱藏課程返回按鈕
        if (registrationBackButton) {
            registrationBackButton.style.display = 'inline-flex';
            registrationBackButton.onclick = goBackToCourseDetail;
        }
        if (courseBackButton) courseBackButton.style.display = 'none';
    } else {
        // 其他頁面：隱藏所有返回按鈕
        if (courseBackButton) courseBackButton.style.display = 'none';
        if (registrationBackButton) registrationBackButton.style.display = 'none';
    }
    
    // 更新瀏覽器URL（pushState用於用戶操作）
    if (pageId !== 'course-detail' && pageId !== 'registration') {
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
    if (Object.keys(courseData).filter(id => !id.startsWith('enterprise-')).includes(courseId)) {
        mainNavSelector = 'a[onclick*="corporate"]';
        subNavSelector = `a[data-course-id="${courseId}"]`;
    }
    // 企業內訓課程
    else if (['enterprise-general', 'enterprise-custom'].includes(courseId)) {
        mainNavSelector = 'a[onclick*="enterprise-training"]';
        subNavSelector = `a[data-course-id="${courseId}"]`;
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
        'home': `${baseName} - AI 時代的科技教育領航者`,
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

// 顯示報名頁面
function showRegistration(courseId, scheduleId = null) {
    // 記錄當前課程ID和時段ID
    window.currentRegistrationCourse = courseId;
    window.currentRegistrationSchedule = scheduleId;
    
    // 重置Email驗證狀態
    resetEmailVerificationState();
    
    // 更新頁面標題
    updatePageTitle('registration', '課程報名');
    
    // 更新瀏覽器URL
    const urlSuffix = scheduleId ? `${courseId}-${scheduleId}` : courseId;
    history.pushState({page: 'registration', courseId: courseId, scheduleId: scheduleId}, '', `#registration-${urlSuffix}`);
    
    // 切換到報名頁面
    showPage('registration');
    
    // 顯示報名頁面的返回按鈕（浮動在左上角）
    const registrationBackButton = document.getElementById('registration-back-button');
    if (registrationBackButton) {
        registrationBackButton.onclick = goBackToCourseDetail;
        registrationBackButton.style.display = 'inline-flex';
        registrationBackButton.innerHTML = '<i class="fas fa-arrow-left"></i> 返回課程';
    }
    
    // 隱藏課程詳細頁面的返回按鈕
    const courseBackButton = document.getElementById('dynamic-back-button');
    if (courseBackButton) {
        courseBackButton.style.display = 'none';
    }
    
    // 自動選擇課程
    const courseSelect = document.getElementById('course-select');
    if (courseSelect && courseId) {
        courseSelect.value = courseId;
    }
    
    // 更新時段選擇區域
    updateScheduleSelection(courseId, scheduleId);
    
    // 滾動到頁面最上方
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 返回課程詳細頁面
function goBackToCourseDetail() {
    if (window.currentRegistrationCourse) {
        showCourseDetail(window.currentRegistrationCourse);
    } else {
        // 如果沒有記錄的課程，返回課程列表
        goBackToCourses();
    }
}

// 更新時段選擇區域
function updateScheduleSelection(courseId, selectedScheduleId = null) {
    const scheduleContainer = document.getElementById('schedule-selection-container');
    if (!scheduleContainer) return;
    
    // 企業內訓課程不顯示時段選擇
    if (courseId === 'enterprise-general' || courseId === 'enterprise-custom') {
        scheduleContainer.style.display = 'none';
        return;
    }
    
    // 檢查是否有該課程的時段資料，如果沒有則嘗試生成
    let scheduleData = window.courseScheduleData && window.courseScheduleData[courseId];
    
    // 如果沒有時段資料，嘗試從動態課程資料生成
    if (!scheduleData || scheduleData.length === 0) {
        const course = courseData[courseId];
        if (course && dynamicCourseData && dynamicCourseData.length > 0) {
            // 過濾出對應課程的時段
            const courseSchedules = dynamicCourseData.filter(item => {
                const courseName = item['課程名稱'];
                return courseName === course.title;
            });
            
            if (courseSchedules.length > 0) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // 處理並排序課程時段
                const processedSchedules = courseSchedules.map(schedule => {
                    const date1 = parseDate(schedule['上課日期1']);
                    const date2 = parseDate(schedule['上課日期2']);
                    
                    let status = '';
                    let statusClass = '';
                    let priority = 0;
                    let canRegister = false;
                    
                    // 判斷課程狀態
                    if (date1 && date2) {
                        if (date1 <= today && date2 >= today) {
                            // 進行中
                            status = '進行中';
                            statusClass = 'status-ongoing';
                            priority = 1;
                            canRegister = false;
                        } else if (date1 > today) {
                            // 即將到來
                            status = '即將到來';
                            statusClass = 'status-upcoming';
                            priority = 2;
                            canRegister = true;
                        } else {
                            // 已結束
                            status = '已結束';
                            statusClass = 'status-ended';
                            priority = 3;
                            canRegister = false;
                        }
                    } else if (date1) {
                        if (date1.toDateString() === today.toDateString()) {
                            status = '進行中';
                            statusClass = 'status-ongoing';
                            priority = 1;
                            canRegister = false;
                        } else if (date1 > today) {
                            status = '即將到來';
                            statusClass = 'status-upcoming';
                            priority = 2;
                            canRegister = true;
                        } else {
                            status = '已結束';
                            statusClass = 'status-ended';
                            priority = 3;
                            canRegister = false;
                        }
                    }
                    
                    return {
                        ...schedule,
                        date1,
                        date2,
                        status,
                        statusClass,
                        priority,
                        canRegister,
                        earliestDate: date1 || date2,
                        daysFromToday: date1 ? Math.abs((date1 - today) / (1000 * 60 * 60 * 24)) : 999
                    };
                }).sort((a, b) => {
                    // 按優先級排序（進行中 > 即將到來 > 已結束）
                    if (a.priority !== b.priority) {
                        return a.priority - b.priority;
                    }
                    // 相同優先級按距離今天的天數排序
                    return a.daysFromToday - b.daysFromToday;
                });
                
                // 儲存時段資料
                window.courseScheduleData = window.courseScheduleData || {};
                window.courseScheduleData[courseId] = processedSchedules;
                scheduleData = processedSchedules;
            }
        }
    }
    
    // 如果還是沒有時段資料，隱藏時段選擇
    if (!scheduleData || scheduleData.length === 0) {
        scheduleContainer.style.display = 'none';
        return;
    }
    
    // 過濾出可報名的時段
    const availableSchedules = scheduleData.filter(schedule => schedule.canRegister);
    
    if (availableSchedules.length === 0) {
        scheduleContainer.innerHTML = `
        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text); font-size: 1.1rem;">課程時段</label>
            <div style="padding: 1rem; background: var(--notice-bg); border: 1px solid var(--notice-border); border-radius: 10px; color: #e53e3e;">
                <i class="fas fa-exclamation-triangle"></i> 目前沒有可報名的時段，請稍後再試
            </div>
        </div>
        `;
        scheduleContainer.style.display = 'block';
        return;
    }
    
    // 生成時段選擇選項
    const scheduleOptions = availableSchedules.map((schedule, index) => {
        const scheduleId = `${courseId}-${index}`;
        const scheduleText = formatScheduleText(schedule['上課日期1'], schedule['上課日期2']);
        const timeText = schedule['上課時間'] || '';
        const locationText = schedule['上課地點'] || '';
        
        const displayText = `${scheduleText} ${timeText} (${locationText})`;
        
        return `<option value="${scheduleId}">${displayText}</option>`;
    }).join('');
    
    scheduleContainer.innerHTML = `
    <div class="form-group" style="margin-bottom: 2rem;">
        <label for="schedule-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text); font-size: 1.1rem;">選擇課程時段 *</label>
        <select id="schedule-select" name="schedule" required style="width: 100%; padding: 1rem; border: 2px solid var(--border); border-radius: 10px; font-size: 1rem; background: var(--surface); transition: all 0.3s ease;">
            <option value="">請選擇上課時段</option>
            ${scheduleOptions}
        </select>
        <small style="display: block; margin-top: 0.5rem; color: var(--muted);">請選擇您希望參加的課程時段</small>
    </div>
    `;
    
    scheduleContainer.style.display = 'block';
    
    // 如果有預選的時段，自動選擇
    if (selectedScheduleId) {
        const scheduleSelect = document.getElementById('schedule-select');
        if (scheduleSelect) {
            scheduleSelect.value = selectedScheduleId;
        }
    }
    
    // 綁定時段選擇變更事件
    const scheduleSelect = document.getElementById('schedule-select');
    if (scheduleSelect) {
        scheduleSelect.addEventListener('change', function() {
            window.currentRegistrationSchedule = this.value;
        });
    }
}

// Email驗證相關變數
let generatedVerificationCode = '';
let emailVerified = false;
let verificationCodeSent = false;
let currentUserEmail = ''; // 記錄當前用戶的Email

// 重置Email驗證狀態
function resetEmailVerificationState() {
    // 重置所有驗證相關變數
    generatedVerificationCode = '';
    emailVerified = false;
    verificationCodeSent = false;
    currentUserEmail = '';
    
    // 重置UI元素
    const emailInput = document.getElementById('email');
    const verificationInput = document.getElementById('verification-code');
    const sendBtn = document.getElementById('send-email-verification');
    const hint = document.getElementById('verification-hint');
    
    if (emailInput) {
        emailInput.value = '';
        emailInput.style.borderColor = '';
        emailInput.style.backgroundColor = '';
    }
    
    if (verificationInput) {
        verificationInput.value = '';
        verificationInput.disabled = true;
        verificationInput.style.borderColor = '';
        verificationInput.style.backgroundColor = '';
    }
    
    if (sendBtn) {
        sendBtn.textContent = '發送驗證碼';
        sendBtn.disabled = false;
        sendBtn.style.background = '';
    }
    
    if (hint) {
        hint.textContent = '請先輸入Email並發送驗證碼';
        hint.style.color = 'var(--muted)';
    }
}

// 生成更安全的驗證碼（包含時間戳避免衝突）
function generateSecureCode() {
    const timestamp = Date.now().toString().slice(-4); // 取時間戳後4位
    const random = Math.floor(10 + Math.random() * 90).toString(); // 2位隨機數
    return timestamp + random; // 6位數驗證碼
}

// 發送Email驗證碼
function sendEmailVerification() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    // 驗證Email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('請輸入正確的Email格式');
        emailInput.focus();
        return;
    }
    
    // 生成安全驗證碼
    generatedVerificationCode = generateSecureCode();
    currentUserEmail = email;
    
    // 更新按鈕狀態為發送中
    const sendBtn = document.getElementById('send-email-verification');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = '發送中...';
    sendBtn.disabled = true;
    
    // 顯示驗證碼（開發階段用，實際部署時移除）
    console.log('驗證碼:', generatedVerificationCode);
    
    // 獲取當前選擇的課程類型
    const courseSelect = document.getElementById('course-select');
    const selectedCourse = courseSelect ? courseSelect.value : '';
    const isEnterpriseCourse = ['enterprise-general', 'enterprise-custom'].includes(selectedCourse);
    
    // 發送Email驗證碼到Google Apps Script
    const GOOGLE_SCRIPT_URL = REGISTRATION_API_URL;
    
    // 使用Promise.race來處理超時
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('請求超時')), 15000); // 15秒超時
    });
    
    const fetchPromise = fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'sendVerification',
            email: email,
            code: generatedVerificationCode,
            courseType: isEnterpriseCourse ? 'enterprise' : 'regular',
            selectedCourse: selectedCourse,
            timestamp: Date.now() // 加入時間戳
        })
    });
    
    Promise.race([fetchPromise, timeoutPromise])
    .then(() => {
        // 啟用驗證碼輸入欄位
        const verificationInput = document.getElementById('verification-code');
        verificationInput.disabled = false;
        verificationInput.focus();
        
        // 更新提示文字
        const hint = document.getElementById('verification-hint');
        hint.textContent = `驗證碼已發送到 ${email}，請檢查您的信箱（包含垃圾郵件夾）`;
        hint.style.color = '#48bb78';
        
        // 更新按鈕狀態
        sendBtn.textContent = '重新發送 (60s)';
        sendBtn.disabled = true;
        sendBtn.style.background = 'var(--muted)';
        
        // 60秒後才能重新發送
        let countdown = 60;
        const countdownTimer = setInterval(() => {
            countdown--;
            sendBtn.textContent = `重新發送 (${countdown}s)`;
            if (countdown <= 0) {
                clearInterval(countdownTimer);
                sendBtn.textContent = '重新發送';
                sendBtn.disabled = false;
                sendBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
        }, 1000);
        
        verificationCodeSent = true;
        
        // 設置10分鐘後過期
        setTimeout(() => {
            if (!emailVerified) {
                generatedVerificationCode = '';
                hint.textContent = '驗證碼已過期，請重新發送';
                hint.style.color = '#e53e3e';
                verificationCodeSent = false;
            }
        }, 600000); // 10分鐘
    })
    .catch(error => {
        console.error('發送驗證碼失敗:', error);
        
        // 即使失敗也假設成功（因為no-cors模式）
        const verificationInput = document.getElementById('verification-code');
        verificationInput.disabled = false;
        verificationInput.focus();
        
        const hint = document.getElementById('verification-hint');
        hint.textContent = `驗證碼已發送到 ${email}，請檢查您的信箱。如未收到請稍後重試`;
        hint.style.color = '#48bb78';
        
        sendBtn.textContent = '重新發送';
        sendBtn.disabled = false;
        sendBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        
        verificationCodeSent = true;
    });
}

// 驗證驗證碼
function verifyCode() {
    const inputCode = document.getElementById('verification-code').value.trim();
    
    if (inputCode === generatedVerificationCode) {
        emailVerified = true;
        const verificationInput = document.getElementById('verification-code');
        verificationInput.style.borderColor = '#48bb78';
        verificationInput.style.backgroundColor = '#f0fff4';
        
        // 顯示驗證成功提示
        const hint = document.getElementById('verification-hint');
        hint.textContent = '✓ Email驗證成功';
        hint.style.color = '#48bb78';
        
        return true;
    } else {
        const hint = document.getElementById('verification-hint');
        hint.textContent = '❌ 驗證碼錯誤，請重新輸入';
        hint.style.color = '#e53e3e';
        return false;
    }
}

// 處理報名表單提交
function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    // 獲取表單數據
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // 基本驗證
    const requiredFields = ['name', 'phone', 'email', 'course', 'verification-code'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    // 對於實體常態課程，時段選擇是必填的
    if (data.course && !['enterprise-general', 'enterprise-custom'].includes(data.course)) {
        if (!data.schedule) {
            missingFields.push('schedule');
        }
    }
    
    if (missingFields.length > 0) {
        const fieldNames = {
            'name': '姓名',
            'phone': '電話',
            'email': 'Email',
            'course': '課程',
            'verification-code': '驗證碼',
            'schedule': '課程時段'
        };
        const missingFieldNames = missingFields.map(field => fieldNames[field]).join('、');
        alert(`請填寫所有必填欄位：${missingFieldNames}`);
        return;
    }
    
    // 驗證Email驗證碼
    if (!verificationCodeSent) {
        alert('請先發送Email驗證碼');
        return;
    }
    
    if (!emailVerified && !verifyCode()) {
        return;
    }
    
    // 驗證Email格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('請輸入正確的Email格式');
        return;
    }
    
    // 驗證電話格式（台灣手機號碼）
    const phoneRegex = /^09\d{8}$|^0\d{1,2}-?\d{6,8}$/;
    if (!phoneRegex.test(data.phone.replace(/\s|-/g, ''))) {
        alert('請輸入正確的電話號碼');
        return;
    }
    
    // 驗證統編格式（如果有填寫）
    if (data['tax-id'] && data['tax-id'].trim()) {
        const taxIdRegex = /^\d{8}$/;
        if (!taxIdRegex.test(data['tax-id'].trim())) {
            alert('統編必須是8位數字');
            return;
        }
    }
    
    // 顯示提交中狀態
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
    submitBtn.disabled = true;
    
    // 準備發送的資料，加入課程類型資訊
    const submissionData = {
        ...data,
        action: 'submitRegistration',
        courseType: ['enterprise-general', 'enterprise-custom'].includes(data.course) ? 'enterprise' : 'regular',
        timestamp: Date.now()
    };
    
    // 發送到Google Apps Script
    // 請將下面的URL替換為您的Google Apps Script部署URL
    const GOOGLE_SCRIPT_URL = REGISTRATION_API_URL;
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // 重要：避免CORS問題
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
    })
    .then(() => {
        // 由於no-cors模式，我們無法讀取回應，但假設成功
        alert('報名成功！我們會盡快與您聯繫！');
        
        // 重置表單
        event.target.reset();
        
        // 恢復按鈕狀態
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 返回課程詳細頁面
        goBackToCourseDetail();
    })
    .catch(error => {
        console.error('提交錯誤:', error);
        
        // 即使出錯也顯示成功，因為no-cors模式下無法判斷實際結果
        alert('報名已提交！我們會盡快與您聯繫。');
        
        // 重置表單
        event.target.reset();
        
        // 恢復按鈕狀態
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // 返回課程詳細頁面
        goBackToCourseDetail();
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeCourseSwipe();
    initializeCourseToolbar();
    // Only intercept ordinary clicks; let the browser handle new-tab/window gestures.
    document.addEventListener('click', function(event) {
        if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const link = event.target.closest('a[data-course-id]');
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        if (!courseData[link.dataset.courseId]) return;
        event.preventDefault();
        window.clickedFromNavMenu = Boolean(link.closest('.nav-menu'));
        showCourseDetail(link.dataset.courseId);
        if (link.hasAttribute('data-course-step')) announceCourseSwitch(courseData[link.dataset.courseId].title);
    });

    // 主頁與內頁共用適合對象，課程資料變更時自動保持一致。
    document.querySelectorAll('[data-course-audience]').forEach(element => {
        const course = courseData[element.dataset.courseAudience];
        if (course) element.textContent = '🔥 適合：' + course.audience;
    });
    document.querySelectorAll('[data-course-paid-ai]').forEach(element => {
        element.textContent = getPaidAiNotice(courseData[element.dataset.coursePaidAi], element.classList.contains('course-paid-ai-label'));
    });

    // 為卡片和其他元素添加滾動動畫類
    const animatedElements = document.querySelectorAll('.card, .course-table, .about-content');
    animatedElements.forEach(el => el.classList.add('fade-in'));
    
    // 滾動監聽
    window.addEventListener('scroll', handleScrollAnimations);
    
    // 初始檢查
    handleScrollAnimations();
    
    // 綁定報名表單提交事件
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // 綁定課程選擇變更事件
    const courseSelect = document.getElementById('course-select');
    if (courseSelect) {
        courseSelect.addEventListener('change', function() {
            const selectedCourse = this.value;
            if (selectedCourse) {
                // 更新時段選擇
                updateScheduleSelection(selectedCourse);
            } else {
                // 隱藏時段選擇
                const scheduleContainer = document.getElementById('schedule-selection-container');
                if (scheduleContainer) {
                    scheduleContainer.style.display = 'none';
                }
            }
        });
    }
    
    // 綁定驗證碼輸入事件
    const verificationInput = document.getElementById('verification-code');
    if (verificationInput) {
        verificationInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                verifyCode();
            }
        });
    }
    
    // 處理初始URL
    handleUrlAndInit();
    
    // 初始化課程表格（使用Google Apps Script自動推送的資料）
    const courseTablesContainer = document.getElementById('course-tables-container');
    if (courseTablesContainer) {
        courseTablesContainer.innerHTML = generateSortedCourseTable();
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
    "ai-essential": {
        "title": "人人都該會的生成式 AI 應用班",
        "subtitle": "一天掌握生成式 AI 與工作自動化入門",
        "description": "從生成式 AI 的日常應用與提示詞技巧出發，透過實作學會使用 Google Apps Script 處理數據、發送提醒與設定自動化觸發條件，建立自己的第一個工作自動化流程。",
        "audience": "所有企業工作者、行政人員，以及希望入門 AI 的零基礎學員。",
        "image": "image/ai-essential.png",
        "days": 1,
        "hours": 6,
        "originalPrice": 8000,
        "price": 5000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶可連網的筆記型電腦，並準備 Google 帳號。",
        "features": [
            {
                "title": "生成式 AI 實戰",
                "desc": "了解 AI 發展與日常工作應用。"
            },
            {
                "title": "Prompt 設計",
                "desc": "練習清楚表達任務、條件與輸出格式。"
            },
            {
                "title": "GAS 入門",
                "desc": "以 AI 協助編寫 Google Apps Script。"
            },
            {
                "title": "提醒自動化",
                "desc": "完成數據分析、提醒與觸發條件設定。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "生成式 AI 應用實戰",
                "content": "• AI 發展現況\n• Prompt 設定技巧\n• 生成式 AI 實戰",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "工作流程 AI 自動化初探",
                "content": "• Google Apps Script 入門\n• 數據分析與提醒自動化\n• 自動化觸發條件設定",
                "period": "下午"
            }
        ]
    },
    "ai-automation": {
        "title": "工作流程 AI 自動化實戰班",
        "subtitle": "GAS 複雜流程整合 × Make.com 規則式客服",
        "description": "進階運用 GAS 串接多檔案數據，建立可測試與除錯的自動化流程，再以 Make.com 完成問卷生成、LINE 官方帳號串接與規則式問答。依問題分類逐步引導，最後根據 Google Sheets 資料提供對應答案。",
        "audience": "行政人員、庶務人員、助理及有基礎 AI 應用經驗的工作者。",
        "image": "image/ai-automation.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶可連網的筆記型電腦，並準備 Google 帳號。",
        "features": [
            {
                "title": "多檔案整合",
                "desc": "以 GAS 串接數據並處理例外。"
            },
            {
                "title": "問卷自動生成",
                "desc": "以 Make.com 建立問卷生成流程。"
            },
            {
                "title": "規則式問答",
                "desc": "透過條件分支引導問題，查詢 Sheets 回答。"
            },
            {
                "title": "維護與監控",
                "desc": "建立流程測試、錯誤紀錄與維護機制。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "GAS 複雜流程 AI 自動化",
                "content": "• 多檔案間數據整合\n• 錯誤處理與例外管理",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "流程測試與 Make.com 問卷生成",
                "content": "• 流程測試與除錯\n• Make.com 問卷自動化生成\n• 串接表單與 Google Sheets",
                "period": "下午"
            },
            {
                "day": "第二天",
                "time": "09:30-12:00",
                "topic": "No-code 流程自動化",
                "content": "• LINE 官方帳號自動化\n• 客服 AI 聊天機器人\n• 監控與維護機制建立",
                "period": "上午"
            },
            {
                "day": "第二天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第二天",
                "time": "13:00-16:30",
                "topic": "Make.com 規則式問答實戰",
                "content": "• 透過規則分類問題，不經 AI 分析數據\n• 依不同問題逐層引導與條件分流\n• 依 Google Sheets 資料內容提供答案",
                "period": "下午"
            }
        ]
    },
    "ai-analytics": {
        "title": "AI 數據分析與決策輔佐班",
        "subtitle": "從資料清理到儀表板與自動化決策報告",
        "description": "學習數據分析法則，以 AI 協助資料前處理與非結構化資料轉換，進行探索式數據分析與異常偵測。結合 Make.com 分析銷售數據，再以 GAS 製作視覺化儀表板及 Google Slides 自動化報告。",
        "audience": "財務人員、管理階層、決策者、數據分析師、行銷及業務人員。",
        "image": "image/ai-analytics.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶可連網的筆記型電腦，並準備 Google 帳號。",
        "features": [
            {
                "title": "AI 資料前處理",
                "desc": "清理資料並將非結構化內容轉為報表。"
            },
            {
                "title": "EDA 與異常偵測",
                "desc": "探索趨勢、關聯與異常數據。"
            },
            {
                "title": "銷售數據分析",
                "desc": "以 Make.com 串接銷售資料分析流程。"
            },
            {
                "title": "自動化報告",
                "desc": "以 GAS 製作圖表並生成 Google Slides。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "數據分析法則與資料前處理",
                "content": "• 數據分析法則\n• AI 輔助資料前處理\n• 非結構化資料轉結構化報表",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "探索式分析與銷售數據實戰",
                "content": "• 探索式數據分析（EDA）\n• 異常偵測\n• Make.com 銷售數據分析",
                "period": "下午"
            },
            {
                "day": "第二天",
                "time": "09:30-12:00",
                "topic": "GAS 專業視覺化與圖表儀表板",
                "content": "• 圖表選型與視覺化設計\n• GAS 儀表板製作\n• 數據更新與互動呈現",
                "period": "上午"
            },
            {
                "day": "第二天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第二天",
                "time": "13:00-16:30",
                "topic": "Google Slides 自動化報告生成",
                "content": "• 將分析結果與圖表整合至簡報\n• 以 GAS 自動生成報告\n• 決策重點整理與成果展示",
                "period": "下午"
            }
        ]
    },
    "ai-communication": {
        "title": "商務營運 AI 通訊助理班",
        "subtitle": "Make.com 通訊助理 × GAS 與 Ragic 營運串接",
        "description": "先以 Make.com 建立營運監控與通訊推播助理，再掌握 API 串接心法，將 Ragic 無程式碼資料庫與 AI 程式寫作結合，以 GAS 實現跨系統 ERP／CRM 營運自動化。",
        "audience": "營運管理師、ERP／CRM 專案人員、管理階層與負責採購、庫存、銷售的工作者。",
        "image": "image/ai-communication.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶筆電，準備 Google、Make.com 與 Ragic 帳號；串接權限及工具方案需求依課前通知。",
        "features": [
            {
                "title": "通訊助理",
                "desc": "整合多資料來源、平台推播與審核。"
            },
            {
                "title": "Ragic 資料庫",
                "desc": "建構採購、庫存、客戶與銷售模組。"
            },
            {
                "title": "GAS API 串接",
                "desc": "以 AI 撰寫抓取、回寫與同步程式。"
            },
            {
                "title": "營運自動化",
                "desc": "完成採購預警與銷售配量建議。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "進階通訊自動化實戰（Make.com）",
                "content": "• 多資料來源整合判斷\n• 庫存與銷售異常通知系統\n• 即時營運監控與自動提醒",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "智慧商務 AI 助理（Make.com）",
                "content": "• 建立商務 AI 通訊自動化助理\n• 多通訊平台整合與推播\n• 權限管理與審核機制",
                "period": "下午"
            },
            {
                "day": "第二天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "Ragic 資料庫與 GAS API 串接",
                "content": "• 建構採購、庫存、客戶與銷售資料庫\n• 理解 Webhook、API Key 與 JSON 資料結構\n• 以 AI 撰寫 GAS，抓取、回寫與同步 Ragic 資料"
            },
            {
                "day": "第二天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第二天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "ERP／CRM 營運自動化實戰",
                "content": "• 安全庫存預警、自動建立採購單與 Email／LINE 審核通知\n• 分析歷史銷售，產生下季度配量建議並寫回 ERP\n• 整合流程測試、Q&A 與實務情境擴充"
            }
        ]
    },
    "digital-media": {
        "paidAiDays": ["第二天"],
        "title": "自媒體 AI 數位創作經營班",
        "subtitle": "AI 生圖生影、虛擬主播與社群自動化經營",
        "description": "從手機免費 App 體驗 AI 影片生成，拆解影片製作流程，建立生圖與生影 Prompt 的 AI Agent。進一步製作虛擬主播產品推廣短片，以 GAS 蒐集新聞並建立 FB、IG 自動回覆與粉專配圖貼文發布流程。",
        "audience": "行銷人員、社群媒體管理員、自媒體經營者與內容創作者。",
        "image": "image/digital-media.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶筆電與智慧型手機，準備 Google 帳號；社群實作需具管理權限的 FB 粉專／IG 帳號，依課前通知設定。",
        "features": [
            {
                "title": "手機影片體驗",
                "desc": "以免費 App 體驗 AI 影片製作。"
            },
            {
                "title": "創作 Agent",
                "desc": "設定生圖、生影提示詞生成助理。"
            },
            {
                "title": "虛擬主播短片",
                "desc": "完成具分享吸引力的產品推廣短片。"
            },
            {
                "title": "社群自動化",
                "desc": "新聞蒐集、自動回覆與配圖貼文發布。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "AI 影片生成與製作流程",
                "content": "• 體驗 AI 影片生成 App\n• 影片製作流程拆解\n• 腳本、素材與鏡頭規劃",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "爆款影片 Prompt 與 AI Agent 設定",
                "content": "• AI 生圖 Prompt 設計\n• AI 生影 Prompt 設計\n• 建立提示詞生成 AI Agent 並迭代影片",
                "period": "下午"
            },
            {
                "day": "第二天",
                "time": "09:30-12:00",
                "topic": "虛擬主播產品推廣與新聞蒐集",
                "content": "• 病毒式虛擬主播產品推廣短片實作\n• GAS 新聞蒐集自動化\n• 整理新聞並轉換為創作素材",
                "period": "上午"
            },
            {
                "day": "第二天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第二天",
                "time": "13:00-16:30",
                "topic": "FB／IG 社群經營自動化",
                "content": "• FB、IG 自動回覆機制\n• FB 粉專自動發布配圖貼文\n• 發布流程測試與內容審核",
                "period": "下午"
            }
        ]
    },
    "human-resources": {
        "paidAiDays": ["第二天"],
        "title": "人資 AI 招募排班績效班",
        "subtitle": "建立招募、排班、薪資與多級績效審核 Web 系統",
        "description": "第一天透過 AI 編寫 GAS 後端與 HTML 前端，打造招募、排班與薪資通知的一站式人資 Web 系統。第二天以 Vibe Coding 自然語言開發模式，建立員工自評、主管多級審核與 HR 視覺化儀表板的完整績效考核系統。",
        "audience": "HR 專員、人資主管、薪酬管理師及排班調度人員。",
        "image": "image/human-resources.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶可連網的筆記型電腦，並準備 Google 帳號。",
        "features": [
            {
                "title": "智慧招募",
                "desc": "履歷表單、職缺關鍵字匹配與評分。"
            },
            {
                "title": "排班與薪資",
                "desc": "設定排班限制與薪資計算、通知流程。"
            },
            {
                "title": "多級考核簽核",
                "desc": "依身分控管自評、退回與核可流程。"
            },
            {
                "title": "HR 儀表板",
                "desc": "九宮格人才矩陣與部門分數分佈。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "AI 人資系統建構與智慧招募",
                "content": "• 拆解人資流程，以 AI 建立 GAS 後端與 HTML 前端\n• 設計履歷 Web 表單，串接 Google Sheets\n• AI 匹配職缺關鍵字、評分並回傳篩選結果"
            },
            {
                "day": "第一天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第一天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "智慧排班與薪資通知實戰",
                "content": "• 依勞基法規與員工偏好設計排班，呈現網頁日曆／表格\n• 編寫加班費、請假扣款與勞健保計算邏輯\n• 一鍵產出與寄送電子薪資單，整合為人資 Web App"
            },
            {
                "day": "第二天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "Vibe Coding 績效考核系統開發",
                "content": "• 用自然語言設計員工自評與主管多級審核流程\n• 建立 RWD 考評表單、動態評分與評語介面\n• 依員工／主管身分切換介面與可視權限"
            },
            {
                "day": "第二天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第二天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "權限簽核與 HR 視覺化儀表板",
                "content": "• 實作送出、通知、退回與核可，控管 Sheets 權限與敏感欄位\n• 以 Chart.js 呈現九宮格人才矩陣與部門分數分佈\n• 整合系統，完成權限測試與部署"
            }
        ]
    },
    "vibe-coding": {
        "paidAiDays": ["第二天"],
        "title": "Vibe Coding AI 軟體開發班",
        "subtitle": "從自然語言開發到具會員與資料庫的網站部署",
        "description": "以 Gemini Canvas 體驗自然語言開發，再進入 Google AI Studio，透過 Gemini 模型與 System Instructions 建立可運行的 Web App。第二天使用付費 AI 開發工具，結合 Supabase 資料庫、會員系統、GitHub 版本管理與 Zeabur 部署，完成訂餐系統等實務專案。",
        "audience": "想開發工具的非技術人員、產品經理、新創團隊及個人創作者。",
        "image": "image/vibe-coding.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶筆電，準備 Google、GitHub、Supabase、Zeabur 帳號；第二天需擁有付費 AI 帳號（建議 Codex 或 Claude），實作環境依課前通知。",
        "features": [
            {
                "title": "Gemini 開發環境",
                "desc": "體驗 Canvas 與 Google AI Studio。"
            },
            {
                "title": "工程提示詞",
                "desc": "System Instructions、結構化提示詞與 Few-Shot。"
            },
            {
                "title": "全端網站實作",
                "desc": "Supabase 資料庫與會員系統。"
            },
            {
                "title": "雲端部署",
                "desc": "專案提交 GitHub 並部署至 Zeabur。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "Gemini 開發體驗與 Prompt 設計",
                "content": "• 體驗 Gemini Canvas 與 Google AI Studio 開發環境\n• 認識 Vibe Coding、模型選擇與 Temperature 設定\n• 設計 System Instructions、結構化提示詞與 Few-Shot 範例"
            },
            {
                "day": "第一天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第一天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "自然語言 Web App 開發實戰",
                "content": "• 從零建立作品集網站／產品訂購計算器\n• 整合表單、計算與互動功能，打造輕量級 Web App\n• 即時預覽、除錯與迭代，規劃第二天資料庫專案"
            },
            {
                "day": "第二天",
                "time": "09:30-12:00",
                "topic": "付費 AI 工具與 Supabase 全端開發",
                "content": "• 以自然語言規劃會員訂餐系統\n• 建立 Supabase 資料庫與會員驗證\n• 串接前端、資料庫及存取權限",
                "period": "上午"
            },
            {
                "day": "第二天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第二天",
                "time": "13:00-16:30",
                "topic": "GitHub 與 Zeabur 部署實戰",
                "content": "• 將專案提交 GitHub 進行版本管理\n• 串接 Zeabur 部署與環境變數設定\n• 測試會員登入、訂餐流程與網站上線",
                "period": "下午"
            }
        ]
    },
    "microsoft-ai": {
        "title": "Microsoft AI 工作自動化班",
        "subtitle": "Copilot × Make.com × VBA 跨檔案辦公自動化",
        "description": "了解 Copilot 的能力與限制，設定簡單任務 Agent 處理客訴信等工作，結合 Make.com 自動化與授權的 Outlook、OneDrive 資料搜尋及回信流程。第二天以 Copilot 輔助撰寫跨檔案 VBA，完成數據分析、工作流程與固定樣式 PowerPoint 簡報自動化。",
        "audience": "以 Microsoft 作為日常辦公環境的企業、行政人員及數據與簡報工作者。",
        "image": "image/microsoft-ai.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶可執行 VBA 的桌面版 Office 筆電，準備 Microsoft、Copilot 與 Make.com 帳號；Outlook／OneDrive 授權及方案依課前通知。",
        "features": [
            {
                "title": "Copilot 任務助理",
                "desc": "了解限制並設定客訴信回覆等簡單任務。"
            },
            {
                "title": "資料與通訊流程",
                "desc": "透過授權資料搜尋、處理並回傳 Outlook。"
            },
            {
                "title": "跨檔案 VBA",
                "desc": "以 Copilot 輔助數據分析與流程自動化。"
            },
            {
                "title": "固定樣式簡報",
                "desc": "使用 PPT 模板與錨點生成簡報。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "time": "09:30-12:00",
                "topic": "Copilot 與簡單任務 Agent",
                "content": "• Copilot 介紹、能力與限制\n• 簡單任務 Agent 設定\n• 客訴信回覆情境實作",
                "period": "上午"
            },
            {
                "day": "第一天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第一天",
                "time": "13:00-16:30",
                "topic": "Make.com 與 Microsoft 資料自動化",
                "content": "• 簡易數據處理自動化\n• 授權 Outlook 與 OneDrive 資料夾存取\n• 知識庫檢索（RAG）：搜尋授權資料、整理分析並回傳結果至 Outlook",
                "period": "下午"
            },
            {
                "day": "第二天",
                "time": "09:30-12:00",
                "topic": "Copilot 輔助跨檔案 VBA",
                "content": "• 以 Copilot 撰寫與除錯 VBA\n• 跨檔案數據整合與分析\n• 工作流程自動化",
                "period": "上午"
            },
            {
                "day": "第二天",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點",
                "period": "中午"
            },
            {
                "day": "第二天",
                "time": "13:00-16:30",
                "topic": "PowerPoint 模板與錨點簡報生成",
                "content": "• 設計固定樣式 PPT 模板與內容錨點\n• 將分析結果寫入指定版位\n• 自動生成簡報並檢查格式",
                "period": "下午"
            }
        ]
    },
    "cluade-master": {
        "paidAiDays": ["第一天", "第二天"],
        "title": "Claude 全能 AI Agent 大師班",
        "subtitle": "Chat、Artifacts、Cowork 與 Claude Code 全面實作",
        "description": "掌握 Claude Sonnet／Haiku 的應用方式，結合 Chat、Projects、Artifacts 與 Computer Use／Cowork，實作動態網頁資料整理、Office 檔案批次處理及簡報生成。第二天使用 Claude Code，理解 AGENTS.md、Skills 與 MCP，完成可執行的 Web 工具。",
        "audience": "使用 Claude 付費方案的企業工作者、個人創作者與希望建立 AI Agent 的學員。",
        "image": "image/cluade-master.png",
        "days": 2,
        "hours": 12,
        "originalPrice": 16000,
        "price": 10000,
        "time": "09:30–16:30（12:00–13:00 午休）",
        "scheduleText": "開課日期待公告",
        "location": "依開課公告",
        "preparation": "請攜帶筆電與 Claude 付費帳號；Cowork、Computer Use 與 Claude Code 可用環境及權限依課前通知。",
        "features": [
            {
                "title": "專案知識庫",
                "desc": "進階提問、Projects 與 Artifacts 互動組件。"
            },
            {
                "title": "Agent 操作",
                "desc": "動態網頁資料抓取與跨視窗資料整理。"
            },
            {
                "title": "Office 批次處理",
                "desc": "VBA／Python 輔助 Excel、Word 與簡報生成。"
            },
            {
                "title": "Claude Code 開發",
                "desc": "認識專案指引、Skills、MCP 並完成 Web App。"
            }
        ],
        "schedule": [
            {
                "day": "第一天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "Claude 核心模式與 Agent 操作",
                "content": "• 進階 Chat 提問與 Projects 企業知識庫設定\n• 以 Artifacts 製作互動組件、心智圖、流程圖與簡易網站\n• 體驗 Computer Use／Cowork，規劃網頁抓取與跨視窗任務"
            },
            {
                "day": "第一天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第一天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "資料整理與 Office 自動化實戰",
                "content": "• 抓取競品價格與動態網站資料，完成結構化清單整理\n• 以 VBA／Python 批次處理 Excel 與 Word\n• 自動生成 PowerPoint 簡報，設定排版與配色"
            },
            {
                "day": "第二天",
                "period": "上午",
                "time": "09:30-12:00",
                "topic": "Claude Code 開發流程與 Web App 起步",
                "content": "• 理解 AGENTS.md、Skills 與 MCP 工具串接邏輯\n• 規劃報價計算器／問卷系統的介面與功能\n• 以自然語言生成可執行的 Web App 雛形"
            },
            {
                "day": "第二天",
                "period": "中午",
                "time": "12:00-13:00",
                "topic": "中午用餐與午休",
                "content": "本課程中午提供餐點"
            },
            {
                "day": "第二天",
                "period": "下午",
                "time": "13:00-16:30",
                "topic": "Web App 整合、除錯與成果展示",
                "content": "• 完成工具核心功能與介面整合\n• 以自然語言迭代，進行測試與除錯\n• 展示可執行的 Web 工具與實務應用"
            }
        ]
    }
,
    'enterprise-general': {
        title: '企業常態課內訓包班',
        mealNote: '由企業提供中餐，午休時段依企業課程安排。',
        subtitle: '根據常態課程內容，提供企業內部培訓課程',
        description: '本課程將我們現有的常態課程內容調整為企業內部培訓版本，讓企業員工能夠在熟悉的環境中學習 AI 技能，提升整體團隊的數位化能力。',
        image: 'image/enterprise-training-generally.png',
        features: [
            { title: '常態課程內容', desc: '基於現有實體常態課程，調整為企業內訓版本' },
            { title: '團隊學習', desc: '適合企業內部團隊一起學習，提升協作效率' },
            { title: '彈性時間', desc: '可根據企業需求安排上課時間' },
            { title: '實務應用', desc: '結合企業實際業務場景進行教學' }
        ],
        schedule: [
            { day: '詳細課程細節可參考', time: '', topic: '', content: '' }
        ],
        additionalInfo: {
            buttonText: '實體常態課程',
            buttonLink: '#corporate'
        }
    },
    'enterprise-custom': {
        title: '客製化企業內訓包班',
        mealNote: '由企業提供中餐，午休時段依企業課程安排。',
        subtitle: '根據企業特定需求，提供完全客製化的內部培訓課程',
        description: '本課程專為企業量身打造，根據企業的產業特性、業務需求、技術水準等因素，設計完全客製化的 AI 培訓方案，確保每位員工都能掌握最適合的 AI 技能。',
        image: 'image/enterprise-training-customization.png',
        features: [
            { title: '需求分析', desc: '深入了解企業業務流程與 AI 應用需求' },
            { title: '客製化設計', desc: '根據企業特性設計專屬培訓內容' },
            { title: '分層教學', desc: '針對不同職級與技術背景設計課程' },
            { title: '持續支援', desc: '提供培訓後的技術支援與諮詢服務' }
        ],
        schedule: [
            { day: '需求調研', time: '1-2週', topic: '企業現況分析', content: '• 業務流程盤點\n• AI 應用機會識別\n• 員工技能評估\n• 培訓需求確認' },
            { day: '課程設計', time: '2-3週', topic: '客製化方案制定', content: '• 課程內容設計\n• 教學方式規劃\n• 教材準備\n• 評估機制建立' },
            { day: '培訓執行', time: '依需求', topic: '分階段培訓實施', content: '• 基礎概念教學\n• 實務操作演練\n• 專案實作指導\n• 成果驗收' },
            { day: '後續支援', time: '持續', topic: '技術支援與優化', content: '• 問題諮詢服務\n• 進階應用指導\n• 成效追蹤評估\n• 持續改進建議' }
        ]
    }
};

// 全域變數存儲課程資料（由Google Apps Script自動推送更新到GitHub）
let dynamicCourseData = [
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2026/4/23(四)",
    "上課日期2": "2026/4/24(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  }
];

// Apps Script Web App URL（報名與驗證服務）
const REGISTRATION_API_URL = 'https://script.google.com/macros/s/AKfycbzOvqWqexStJaVmNfWGE6x-YKZzIg_c_LWBVfqWVvpgfcwv3vzhqMKrW0t3aeyJwM7I/exec';

// 生成分組課程表格HTML（按課程類型分組，每種課程顯示最近3堂）
function generateSortedCourseTable() {
    // 如果沒有動態資料，使用預設資料作為備用
    if (!dynamicCourseData || dynamicCourseData.length === 0) {
        console.log('使用預設課程資料');
        return generateDefaultCourseTable();
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設定為今天00:00
    
    // 按課程名稱分組
    const courseGroups = {};
    
    dynamicCourseData.forEach(course => {
        const courseName = course['課程名稱'];
        if (!courseName) return;
        
        if (!courseGroups[courseName]) {
            courseGroups[courseName] = [];
        }
        
        // 處理每個課程實例
        const date1 = parseDate(course['上課日期1']);
        const date2 = parseDate(course['上課日期2']);
        
        let status = '';
        let statusClass = '';
        let priority = 0;
        
        // 判斷課程狀態
        if (date1 && date2) {
            if (date1 <= today && date2 >= today) {
                // 進行中
                status = '進行中';
                statusClass = 'status-ongoing';
                priority = 1;
            } else if (date1 > today) {
                // 即將到來
                status = '即將到來';
                statusClass = 'status-upcoming';
                priority = 2;
            } else {
                // 已結束
                status = '已結束';
                statusClass = 'status-ended';
                priority = 3;
            }
        } else if (date1) {
            if (date1.toDateString() === today.toDateString()) {
                status = '進行中';
                statusClass = 'status-ongoing';
                priority = 1;
            } else if (date1 > today) {
                status = '即將到來';
                statusClass = 'status-upcoming';
                priority = 2;
            } else {
                status = '已結束';
                statusClass = 'status-ended';
                priority = 3;
            }
        }
        
        courseGroups[courseName].push({
            ...course,
            date1,
            date2,
            status,
            statusClass,
            priority,
            earliestDate: date1 || date2,
            daysFromToday: date1 ? Math.abs((date1 - today) / (1000 * 60 * 60 * 24)) : 999
        });
    });
    
    // 為每個課程組排序並取前3個
    Object.keys(courseGroups).forEach(courseName => {
        courseGroups[courseName] = courseGroups[courseName]
            .sort((a, b) => {
                // 按優先級排序（進行中 > 即將到來 > 已結束）
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                // 相同優先級按距離今天的天數排序
                return a.daysFromToday - b.daysFromToday;
            })
            .slice(0, 3); // 每種課程最多3堂
    });
    
    // 生成HTML
    let tablesHTML = '';
    
    Object.keys(courseGroups).forEach(courseName => {
        const courses = courseGroups[courseName];
        if (courses.length === 0) return;
        
        const courseId = getCourseIdFromName(courseName);
        
        const tableRows = courses.map(course => {
            const scheduleText = formatScheduleText(course['上課日期1'], course['上課日期2']);
            
            return `
            <tr>
                <td>${scheduleText}</td>
                <td>${course['上課時間'] || ''}</td>
                <td><a href="https://www.google.com/maps/search/${encodeURIComponent(course['上課地點'] || '')}" target="_blank" class="location-link" title="點擊開啟Google Maps">${course['上課地點'] || ''}</a></td>
                <td><span class="course-status ${course.statusClass}" data-status="${course.status}">${course.status}</span></td>
            </tr>
            `;
        }).join('');
        
        tablesHTML += `
        <div class="course-group-table" style="margin-bottom: 2rem;">
            <h4 class="course-group-title">
                <a href="#course-${courseId}" data-course-id="${courseId}" class="course-link" style="font-size: 1.2rem; font-weight: 600;">
                    ${courseName}
                </a>
            </h4>
            <div class="table-responsive">
                <table style="margin-top: 0.5rem;">
                    <thead>
                        <tr>
                            <th>上課日期</th>
                            <th>上課時間</th>
                            <th>上課地點</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    });
    
    return tablesHTML;
}

// 預設課程表格（當沒有Google Sheets資料時）
function generateDefaultCourseTable() {
    const courses = Object.entries(courseData).filter(([key]) => !key.startsWith('enterprise-'));

    let tablesHTML = '';
    
    courses.forEach(([courseId, course]) => {
        tablesHTML += `
        <div class="course-group-table" style="margin-bottom: 2rem;">
            <h4 class="course-group-title">
                <a href="#course-${courseId}" data-course-id="${courseId}" class="course-link" style="font-size: 1.2rem; font-weight: 600;">
                    ${course.title}
                </a>
            </h4>
            <div class="table-responsive">
                <table style="margin-top: 0.5rem;">
                    <thead>
                        <tr>
                            <th>上課日期</th>
                            <th>上課時間</th>
                            <th>上課地點</th>
                            <th>狀態</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
            <td>${course.scheduleText}</td>
            <td>${course.time}</td>
            <td>${course.location}</td>
                            <td><span class="course-status status-ended" data-status="待公告">待公告</span></td>
        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `;
    });

    return tablesHTML;
}

// 解析日期字符串
function parseDate(dateStr) {
    if (!dateStr) return null;
    
    // 處理各種日期格式
    if (typeof dateStr === 'string') {
        // 格式：2025/9/5 或 2025-9-5
        const cleanDate = dateStr.replace(/[()週一二三四五六日]/g, '').trim();
        const parts = cleanDate.split(/[/-]/);
        
        if (parts.length >= 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // JavaScript月份從0開始
            const day = parseInt(parts[2]);
            return new Date(year, month, day);
        }
    }
    
    // 如果是Date物件，直接返回
    if (dateStr instanceof Date) {
        return dateStr;
    }
    
    return null;
}

// 根據課程名稱獲取對應的courseId
function getCourseIdFromName(courseName) {
    const normalizedName = courseName === '數據分析 AI 決策輔佐班' ? 'AI 數據分析與決策輔佐班' : courseName;
    return Object.keys(courseData).find(id => courseData[id].title === normalizedName) || null;
}

// 格式化課程時間顯示
function formatScheduleText(date1, date2) {
    if (!date1 && !date2) return '';
    
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (typeof dateStr === 'string') return dateStr;
        
        // 如果是Date物件，格式化為 YYYY/M/D(週X)
        const year = dateStr.getFullYear();
        const month = dateStr.getMonth() + 1;
        const day = dateStr.getDate();
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[dateStr.getDay()];
        
        return `${year}/${month}/${day}(${weekday})`;
    };
    
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    
    if (formattedDate1 && formattedDate2) {
        return `${formattedDate1}、${formattedDate2}`;
    }
    
    return formattedDate1 || formattedDate2;
}

// 生成課程詳細頁面的時段區段
function generateCourseScheduleSection(courseId) {
    // 企業內訓課程不顯示時段選擇
    if (courseId === 'enterprise-general' || courseId === 'enterprise-custom') {
        return '';
    }
    
    // 如果沒有動態資料，返回空
    if (!dynamicCourseData || dynamicCourseData.length === 0) {
        return '';
    }
    
    const course = courseData[courseId];
    if (!course) return '';
    
    // 過濾出對應課程的時段
    const courseSchedules = dynamicCourseData.filter(item => {
        const courseName = item['課程名稱'];
        return courseName === course.title;
    });
    
    if (courseSchedules.length === 0) {
        return '';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 處理並排序課程時段
    const processedSchedules = courseSchedules.map(schedule => {
        const date1 = parseDate(schedule['上課日期1']);
        const date2 = parseDate(schedule['上課日期2']);
        
        let status = '';
        let statusClass = '';
        let priority = 0;
        let canRegister = false;
        
        // 判斷課程狀態
        if (date1 && date2) {
            if (date1 <= today && date2 >= today) {
                // 進行中
                status = '進行中';
                statusClass = 'status-ongoing';
                priority = 1;
                canRegister = false;
            } else if (date1 > today) {
                // 即將到來
                status = '即將到來';
                statusClass = 'status-upcoming';
                priority = 2;
                canRegister = true;
            } else {
                // 已結束
                status = '已結束';
                statusClass = 'status-ended';
                priority = 3;
                canRegister = false;
            }
        } else if (date1) {
            if (date1.toDateString() === today.toDateString()) {
                status = '進行中';
                statusClass = 'status-ongoing';
                priority = 1;
                canRegister = false;
            } else if (date1 > today) {
                status = '即將到來';
                statusClass = 'status-upcoming';
                priority = 2;
                canRegister = true;
            } else {
                status = '已結束';
                statusClass = 'status-ended';
                priority = 3;
                canRegister = false;
            }
        }
        
        return {
            ...schedule,
            date1,
            date2,
            status,
            statusClass,
            priority,
            canRegister,
            earliestDate: date1 || date2,
            daysFromToday: date1 ? Math.abs((date1 - today) / (1000 * 60 * 60 * 24)) : 999
        };
    }).sort((a, b) => {
        // 按優先級排序（進行中 > 即將到來 > 已結束）
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // 相同優先級按距離今天的天數排序
        return a.daysFromToday - b.daysFromToday;
    }).slice(0, 3); // 只取前3個
    
    if (processedSchedules.length === 0) {
        return '';
    }
    
    const tableRows = processedSchedules.map((schedule, index) => {
        const scheduleText = formatScheduleText(schedule['上課日期1'], schedule['上課日期2']);
        const scheduleId = `${courseId}-${index}`;
        
        return `
        <tr data-schedule-id="${scheduleId}" data-can-register="${schedule.canRegister}">
            <td>${scheduleText}</td>
            <td>${schedule['上課時間'] || ''}</td>
            <td><a href="https://www.google.com/maps/search/${encodeURIComponent(schedule['上課地點'] || '')}" target="_blank" class="location-link" title="點擊開啟Google Maps">${schedule['上課地點'] || ''}</a></td>
            <td><span class="course-status ${schedule.statusClass}" data-status="${schedule.status}">${schedule.status}</span></td>
            <td style="text-align: center;">
                ${schedule.canRegister ? 
                    `<button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="showRegistration('${courseId}', '${scheduleId}')">
                        <i class="fas fa-user-plus"></i> 報名
                    </button>` :
                    `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: var(--border); color: var(--muted); cursor: not-allowed;" disabled>
                        ${schedule.status === '進行中' ? '進行中' : '已截止'}
                    </button>`
                }
            </td>
        </tr>
        `;
    }).join('');

    
    // 儲存課程時段資料供報名頁面使用
    window.courseScheduleData = window.courseScheduleData || {};
    window.courseScheduleData[courseId] = processedSchedules;
    
    return `
    <div class="course-available-schedules" style="margin: 3rem 0;">
        <h3><i class="fas fa-clock"></i> 近期開課時段</h3>
        <div class="course-table">
            <div class="table-responsive">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>上課日期</th>
                            <th>上課時間</th>
                            <th>上課地點</th>
                            <th>狀態</th>
                            <th>報名</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
}

// 課程資料現在由Google Apps Script自動推送到GitHub
// dynamicCourseData陣列會在下方自動更新

// 全域變數儲存返回頁面
let previousPage = 'corporate';

let currentDetailCourseId = null;
let courseSwitchTimer;

function getCourseNeighbors(courseId) {
    const enterprise = courseId.startsWith('enterprise-');
    const ids = Object.keys(courseData).filter(id => id.startsWith('enterprise-') === enterprise);
    const index = ids.indexOf(courseId);
    return { previous: ids[index - 1], next: ids[index + 1], index, total: ids.length };
}

function getPaidAiNotice(course, compact = false) {
    if (!course?.paidAiDays?.length) return '';
    const days = course.paidAiDays.length === course.days ? '兩天皆' : course.paidAiDays.join('、');
    return `${days}需擁有付費 AI 帳號${compact ? '' : '（建議 Codex 或 Claude）。'}`;
}

function renderCourseSwitcher(courseId) {
    const neighbors = getCourseNeighbors(courseId);
    const link = (id, direction) => id ? `
        <a class="course-switch-link" href="#course-${id}" data-course-id="${id}" data-course-step="${direction}" aria-label="${direction === 'previous' ? '上一堂課程' : '下一堂課程'}：${courseData[id].title}" aria-describedby="course-navigation-hint" title="${courseData[id].title}">
            <span class="course-switch-arrow" aria-hidden="true">${direction === 'previous' ? '←' : '→'}</span>
            <span><span class="course-switch-label">${direction === 'previous' ? '上一堂' : '下一堂'}</span><span class="course-switch-title">${courseData[id].title}</span></span>
        </a>` : `<span class="course-switch-link unavailable" aria-disabled="true"><span class="course-switch-arrow" aria-hidden="true">${direction === 'previous' ? '←' : '→'}</span><span>${direction === 'previous' ? '已是第一堂' : '已是最後一堂'}</span></span>`;
    return `<nav class="course-switcher" aria-label="切換課程">
        <div class="course-switch-links">${link(neighbors.previous, 'previous')}<span class="course-switch-count" aria-label="第 ${neighbors.index + 1} 堂，共 ${neighbors.total} 堂">${neighbors.index + 1} / ${neighbors.total}</span>${link(neighbors.next, 'next')}</div>
    </nav>`;
}

function announceCourseSwitch(title, boundary = false) {
    const status = document.getElementById('course-switch-status');
    clearTimeout(courseSwitchTimer);
    status.textContent = boundary ? title : `已切換至「${title}」`;
    status.classList.add('visible');
    courseSwitchTimer = setTimeout(() => status.classList.remove('visible'), 2500);
}

function resetCourseToolbar() {
    document.querySelector('.course-detail-toolbar').classList.remove('is-floating');
    document.querySelector('.course-toolbar-slot').style.height = '';
}

function initializeCourseToolbar() {
    const toolbar = document.querySelector('.course-detail-toolbar');
    const slot = document.querySelector('.course-toolbar-slot');
    const page = document.getElementById('course-detail');
    let lastY = window.scrollY;
    let pending = false;
    const updateGeometry = () => {
        const bounds = slot.getBoundingClientRect();
        const headerBottom = document.querySelector('.header').getBoundingClientRect().bottom;
        toolbar.style.setProperty('--toolbar-top', `${headerBottom + 8}px`);
        toolbar.style.setProperty('--toolbar-left', `${bounds.left}px`);
        toolbar.style.setProperty('--toolbar-width', `${bounds.width}px`);
        return { bounds, headerBottom };
    };
    window.addEventListener('scroll', () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            const y = Math.max(0, window.scrollY);
            if (!page.classList.contains('active')) { resetCourseToolbar(); lastY = y; return; }
            const delta = y - lastY;
            const { bounds, headerBottom } = updateGeometry();
            if (bounds.bottom > headerBottom || delta >= 8) resetCourseToolbar();
            else if (delta <= -8 && !toolbar.classList.contains('is-floating')) {
                slot.style.height = `${toolbar.offsetHeight}px`;
                toolbar.classList.add('is-floating');
            }
            if (Math.abs(delta) >= 8 || y === 0) lastY = y;
        });
    }, { passive: true });
    window.addEventListener('resize', updateGeometry);
}

function initializeCourseSwipe() {
    const content = document.getElementById('course-detail-content');
    if (!content) return;
    let gesture = null;
    const reset = () => {
        gesture = null;
        content.classList.remove('course-dragging');
    };
    content.addEventListener('pointerdown', event => {
        if (!event.isPrimary || event.button !== 0 || !document.getElementById('course-detail').classList.contains('active')) return;
        // Preserve links, form controls, text selection and independent table scrolling.
        if (event.target.closest('a, button, input, textarea, select, table, [contenteditable="true"]') || window.getSelection().toString()) return;
        gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, started: performance.now() };
        content.setPointerCapture(event.pointerId);
    });
    content.addEventListener('pointermove', event => {
        if (!gesture || gesture.id !== event.pointerId) return;
        const dx = event.clientX - gesture.x;
        const dy = event.clientY - gesture.y;
        if (Math.abs(dy) > 24 && Math.abs(dy) > Math.abs(dx)) { reset(); return; }
        if (Math.abs(dx) > 18 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            content.classList.add('course-dragging');
            event.preventDefault();
        }
    });
    content.addEventListener('pointerup', event => {
        if (!gesture || gesture.id !== event.pointerId) return;
        const dx = event.clientX - gesture.x;
        const dy = event.clientY - gesture.y;
        const elapsed = performance.now() - gesture.started;
        reset();
        if (Math.abs(dx) < 65 || Math.abs(dx) <= Math.abs(dy) * 1.5 || elapsed > 1500 || !currentDetailCourseId) return;
        const neighbors = getCourseNeighbors(currentDetailCourseId);
        const nextId = dx < 0 ? neighbors.next : neighbors.previous;
        if (!nextId) { announceCourseSwitch(dx < 0 ? '已是最後一堂課程' : '已是第一堂課程', true); return; }
        showCourseDetail(nextId);
        announceCourseSwitch(courseData[nextId].title);
    });
    content.addEventListener('pointercancel', reset);
    content.addEventListener('lostpointercapture', reset);
}

// 顯示課程詳細頁面
function showCourseDetail(courseId) {
    resetCourseToolbar();
    clearTimeout(courseSwitchTimer);
    document.getElementById('course-switch-status').classList.remove('visible');
    // 隱藏下拉選單
    hideDropdown();
    
    // 記錄當前頁面
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) {
        previousPage = currentActive.id;
        window.lastCourseSourcePage = currentActive.id; // 記錄來源頁面
    }
    
    // 記錄點擊的課程卡片位置
    const courseCard = document.querySelector(`.card[data-course-id="${courseId}"]`);
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
    else if (Object.keys(courseData).filter(id => !id.startsWith('enterprise-')).includes(courseId)) {
        // 檢查是否從首頁的課程表格點擊
        const courseLink = document.querySelector(`#home a[data-course-id="${courseId}"]`);
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
    const allCourseCards = document.querySelectorAll(`[data-course-id="${courseId}"]`);
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
    currentDetailCourseId = courseId;
    document.getElementById('course-switcher-container').innerHTML = renderCourseSwitcher(courseId);
    const contentHTML = `
        <div class="course-header">
            <img src="${course.image}" alt="${course.title}" class="course-hero-image" draggable="false">
            <h1 class="course-title">${course.title}</h1>
            <p class="course-subtitle">${course.subtitle}</p>
            <div class="price-section">
                ${courseId === 'enterprise-general' || courseId === 'enterprise-custom' ? 
                    '<span style="color: var(--muted); font-weight: 600; font-size: 1.5rem;">依需求報價</span>' :
                    `<span class="original-price">原價 NT$ ${course.originalPrice.toLocaleString()}</span>
                    <span class="current-price">NT$ ${course.price.toLocaleString()}</span>
                    <span class="discount-badge">限時優惠 38% OFF</span>`
                }
            </div>
        </div>

        <div class="course-description">
            <h3>課程簡介</h3>
            <p>${course.description}</p>
            ${course.audience ? `<p class="course-audience"><strong>適合對象：</strong>${course.audience}</p>` : ''}
            ${course.preparation ? `<p class="course-preparation"><strong>課前準備：</strong>${course.preparation}</p>` : ''}
            ${course.paidAiDays ? `<p class="course-paid-ai-note"><strong>AI 帳號需求：</strong>${getPaidAiNotice(course)}</p>` : ''}
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
            <h3><i class="fas fa-calendar-alt"></i> 課程安排${course.days ? `（${course.days}天共${course.hours}小時）` : ''}</h3>
            ${course.mealNote ? `<p class="course-preparation course-meal-note"><strong>中午用餐與午休：</strong>${course.mealNote}</p>` : ''}
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
                        ${session.day && (index === 0 || session.day !== course.schedule[index-1].day) ? 
                            `<tr><td colspan="3" class="day-header">${session.day}${course.paidAiDays?.includes(session.day) ? '<span class="course-day-paid-ai">需擁有付費 AI 帳號（建議 Codex 或 Claude）</span>' : ''}</td></tr>` : ''}
                        ${session.time === '' && session.topic === '' && session.content === '' && course.additionalInfo ? 
                            `<tr>
                                <td colspan="3" style="text-align: center; vertical-align: middle; padding: 2rem 0; background: var(--surface-soft);">
                                    <a href="${course.additionalInfo.buttonLink}" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 1rem; padding: 0.8rem 1.5rem;">
                                        <i class="fas fa-calendar-alt"></i>
                                        ${course.additionalInfo.buttonText}
                                    </a>
                                </td>
                            </tr>` : 
                            `<tr>
                                <td style="text-align: center;">${session.period ? `<strong>${session.period}</strong><br>` : ''}${session.time}</td>
                                <td style="text-align: center;"><strong>${session.topic}</strong></td>
                                <td style="text-align: center; white-space: pre-line;">${session.content}</td>
                            </tr>`
                        }
                    `).join('')}
                </tbody>
            </table>
        </div>

        ${generateCourseScheduleSection(courseId)}

        <div class="course-faq" style="margin: 4rem 0;">
            <h3><i class="fas fa-question-circle"></i> 課程常見問題</h3>
            <div style="background: var(--surface-soft); border-radius: 15px; padding: 2rem; margin: 0.5rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-utensils" style="margin-right: 0.5rem;"></i>課程有供餐嗎？</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">${course.mealNote || '有的！本課程中午提供精美餐點，讓您專心學習無後顧之憂。'}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-laptop" style="margin-right: 0.5rem;"></i>上課需要帶電腦嗎？</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">需要！請攜帶個人筆記型電腦，課程中會進行實作練習。建議使用 Windows 或 Mac 系統，並確保網路連線功能正常。</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-graduation-cap" style="margin-right: 0.5rem;"></i>上完這門課後有進階課程嗎？</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">有的！我們提供完整的學習路徑，建議按照目前課程順序：人人都該會的生成式 AI 應用班 → 依工作需求選修工作流程、數據分析、商務營運、自媒體、人資、Vibe Coding、Microsoft 或 Claude 課程，逐步掌握 AI 應用與實務操作，讓你能更智慧的過好未來每一日！<span style="background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">🎯 續班學員享有優先報名權與專屬折扣，詳見報名後提供的「報名成功信件」！</span></p>
                </div>
                
                <div style="margin-bottom: 0;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-clipboard-list" style="margin-right: 0.5rem;"></i>報名流程為何？</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">
                        1. 填寫報名表單並完成 Email 驗證<br>
                        2. 我們會在 1 小時內寄送「報名成功信件」<br>
                        3. 收到「報名成功信件」後依照繳費通知完成付款，<span style="background: linear-gradient(135deg, #e53e3e, #f56565); color: white; padding: 0.2rem 0.6rem; border-radius: 15px; font-weight: 600; font-size: 1.1rem;">⏰ 請於收到通知後 72 小時內完成付款</span>，逾期將取消報名資格<br>
                        4. 開課前 3 天會發送上課提醒與詳細資訊
                    </p>
                </div>
            </div>
        </div>

        <div class="course-notice" style="margin: 4rem 0;">
            <h3><i class="fas fa-exclamation-triangle"></i> 注意事項</h3>
            <div style="background: var(--notice-bg); border: 1px solid var(--notice-border); border-radius: 15px; padding: 2rem; margin: 1rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt" style="margin-right: 0.5rem;"></i>課程調整</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">
                        如遇不可抗力因素（如天災、疫情等）或其他變動因素，主辦單位保留調整課程時間、地點或改為線上授課的權利。若有異動將於開課前 48 小時寄送信件通知學員，請密切留意信件！
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-receipt" style="margin-right: 0.5rem;"></i>發票統編開立辦法</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">
                        如需開立統編發票，請於報名時填寫正確的統一編號與公司名稱。
                        發票將於課程結束後 7 個工作天內開立並寄送。
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-undo" style="margin-right: 0.5rem;"></i>退費規定</h4>
                    <div style="color: var(--text-secondary); margin-left: 1.5rem;">
                        <p style="margin-bottom: 0.5rem;"><strong>根據最新退費法規：</strong></p>
                        <ul style="margin-left: 1rem;">
                            <li>開課日 30 天前（含）提出：退回 95% 學費</li>
                            <li>開課日前 15 至 29 天提出：退回 85% 學費</li>
                            <li>開課日前 4 至 14 天提出：退回 60% 學費</li>
                            <li>開課日前 1 至 3 天提出：退回 30% 學費</li>
                            <li>開課日當天提出：不接受退費</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>其他退費規定：</strong></p>
                        <ul style="margin-left: 1rem;">
                            <li>學員因個人因素無法參與課程，可申請保留名額至下期課程（限一次）</li>
                            <li>退費申請需以書面方式提出，退款將於 30 個工作天內完成</li>
                        </ul>
                    </div>
                </div>
                
                <div style="margin-bottom: 0;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-shield-alt" style="margin-right: 0.5rem;"></i>個資相關規定</h4>
                    <p style="color: var(--text-secondary); margin-left: 1.5rem;">
                        課程期間所拍攝之照片、影片，僅做相關活動推廣使用，同時會依據個資法妥善保管資料，若不同意請主動告知，否則將視為同意授權使用。
                    </p>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
            <a href="javascript:void(0)" onclick="showRegistration('${courseId}')" class="btn btn-primary" style="font-size: 1.2rem; padding: 1rem 2rem;">
                <i class="fas fa-user-plus"></i> 立即報名
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
    updatePageTitle('course-detail', course.title);
    
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
                const allCards = document.querySelectorAll(`[data-course-id="${window.lastClickedCourseId}"]`);
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
