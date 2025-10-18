// 課程資料最後更新時間: 2025/10/19 上午3:52:22
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
    if ([ 'ai-automation','ai-analytics','ai-communication','digital-media','vibe-coding'].includes(courseId)) {
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
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d3748; font-size: 1.1rem;">課程時段</label>
            <div style="padding: 1rem; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 10px; color: #e53e3e;">
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
        <label for="schedule-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d3748; font-size: 1.1rem;">選擇課程時段 *</label>
        <select id="schedule-select" name="schedule" required style="width: 100%; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; background: white; transition: all 0.3s ease;">
            <option value="">請選擇上課時段</option>
            ${scheduleOptions}
        </select>
        <small style="display: block; margin-top: 0.5rem; color: #718096;">請選擇您希望參加的課程時段</small>
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
        hint.style.color = '#718096';
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
        sendBtn.style.background = '#718096';
        
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
    'ai-automation': {
        title: '工作流程 AI 自動化實戰班',
        subtitle: '運用 AI 實現工作流程自動化，大幅提升營運效率',
        description: '本課程教你如何使用 Google Apps Script 、 Make.com 等工具，建立智能化的工作流程自動化系統，減少重複性工作，提升企業整體效率。',
        image: 'image/ai-automation.png',
        firstClassDate: '2025/9/5', // 第一堂課日期
        scheduleText: '2025/9/5(五)、2025/9/12(五)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '熱門 AI 工具輕鬆上手', desc: '熱門生成式 AI 工具實戰運用' },
            { title: '流程分析與設計', desc: '識別可自動化流程，設計最佳化工作流程' },
            { title: 'Google Apps Script 初探', desc: '自動化文件與試算表處理' },
            { title: 'Make.com 入門', desc: '掌握視覺化流程建構與 API 整合技巧' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:00', topic: '生成式 AI 應用實戰', content: '• AI 發展現況\n• Prompt設定技巧\n• 生成式 AI 實戰' },
            { day: '第一天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第一天', time: '13:00-16:30', topic: '工作流程 AI 自動化', content: '• Google Apps Script入門\n• 關鍵字新聞抓取自動化\n• 自動化觸發條件設定' },
            { day: '第二天', time: '09:30-12:00', topic: '複雜流程 AI 自動化', content: '• 多檔案間數據整合\n• 錯誤處理與例外管理\n• 流程測試與除錯' },
            { day: '第二天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第二天', time: '13:00-16:30', topic: 'No-code 流程自動化', content: '• Line 官方帳號自動化\n• 客服 AI 聊天機器人\n• 監控與維護機制建立' }
        ]
    },
    'ai-analytics': {
        title: 'AI 數據分析與決策輔佐班',
        subtitle: '運用 AI 技術進行深度數據挖掘，提供企業決策強力支撐',
        description: '本課程專為企業決策者與數據分析師設計，教你如何運用數據分析 ICLT 準則，同時搭配 AI 在 Google Apps Script 環境中，進行高效視覺化數據分析洞察隱藏的商機，並建立數據驅動的決策機制。',
        image: 'image/ai-analytics.png',
        firstClassDate: '2025/9/3', // 第一堂課日期
        scheduleText: '2025/9/3(三)、2025/9/10(三)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '熱門 AI 工具輕鬆上手', desc: '熱門生成式 AI 工具實戰運用' },
            { title: '智能數據清理', desc: '使用 AI 工具快速處理髒數據與缺失值' },
            { title: '預測模型建立', desc: '建構業務預測模型，預測銷售與市場趨勢' },
            { title: '視覺化報表', desc: '製作互動式儀表板與數據視覺化報表' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:00', topic: '生成式 AI 應用實戰', content: '• AI 發展現況\n• Prompt設定技巧\n• 生成式 AI 實戰' },
            { day: '第一天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第一天', time: '13:00-16:30', topic: '工作流程 AI 自動化', content: '• Google Apps Script入門\n• 關鍵字新聞抓取自動化\n• 自動化觸發條件設定' },
            { day: '第二天', time: '09:30-12:00', topic: '數據分析 ICLT 準則', content: '• 探索性數據分析法\n• 數據清理 AI 輔助技術\n• 特徵選取 AI 優化'},
            { day: '第二天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第二天', time: '13:00-16:30', topic: '視覺化儀表板設計', content: '• 互動式儀表板設計\n• 自動化報表生成\n• 決策建議系統建立' },
        ]
    },
    'ai-communication': {
        title: '商務營運 AI 通訊助理班',
        subtitle: '透過 AI 實現庫存管理等商務流程通知自動化，打造個人專屬的通訊助理',
        description: '本課程將帶你進階運用 Google Apps Script 與 Make.com 等工具，建立高效率的數據分析與通知自動化系統，並透過自動發送 Email、LINE 等訊息渠道，實現即時商務提醒、庫存管理通知與營運決策支援，協助你優化管理流程並提升工作效率。',
        image: 'image/ai-communication.png',
        firstClassDate: '2025/8/22', // 第一堂課日期
        scheduleText: '2025/8/22(五)、2025/8/29(五)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '熱門 AI 工具輕鬆上手', desc: '熱門生成式 AI 工具實戰運用' },
            { title: '商務數據分析自動化', desc: '運用 AI 分析銷售、庫存與營運數據' },
            { title: '即時通訊自動通知', desc: '透過 Email 與 LINE 自動推送提醒與報告' },
            { title: 'Make.com 進階應用', desc: '多流程整合、跨平台 API 串接與錯誤處理' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:00', topic: '生成式 AI 應用實戰', content: '• AI 發展現況\n• Prompt設定技巧\n• 生成式 AI 實戰' },
            { day: '第一天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第一天', time: '13:00-16:30', topic: '工作流程 AI 自動化', content: '• Google Apps Script入門\n• 關鍵字新聞抓取自動化\n• 自動化觸發條件設定' },
            { day: '第二天', time: '09:30-12:00', topic: '進階通訊自動化實戰', content: '• 多資料來源整合判斷\n• 庫存與銷售異常通知系統\n• 即時營運監控與自動提醒' },
            { day: '第二天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第二天', time: '13:00-16:30', topic: '智慧商務 AI 助理', content: '• 建立商務 AI 通訊自動化助理\n• 多通訊平台整合與推播\n• 權限管理與審核機制' }
        ]
    },
    'digital-media': {
        title: '自媒體 AI 數位創作經營班',
        subtitle: '打造全自動化自媒體經營系統，從內容創作到發布一站到位',
        description: '本課程將教你建立完整的自媒體自動化系統，從數據收集、內容創作、影片製作到自動發布，實現真正的自媒體經營自動化，輕鬆打造被動收入來源。',
        image: 'image/digital-media.png',
        firstClassDate: '2025/9/11', // 第一堂課日期
        scheduleText: '2025/9/11(四)、2025/9/18(四)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '熱門 AI 工具輕鬆上手', desc: '熱門生成式 AI 工具實戰運用' },
            { title: '智能內容生成', desc: '使用 AI 工具自動生成高質量文案與腳本' },
            { title: '自動化影片製作', desc: '批量製作短影片與長影片內容' },
            { title: '多平台自動排程發布', desc: '自動化發布至各社群與自媒體平台' },
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:00', topic: '生成式 AI 應用實戰', content: '• AI 發展現況\n• Prompt設定技巧\n• 生成式 AI 實戰' },
            { day: '第一天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第一天', time: '13:00-16:30', topic: '工作流程 AI 自動化', content: '• Google Apps Script入門\n• 關鍵字新聞抓取自動化\n• 自動化觸發條件設定' },
            { day: '第二天', time: '09:30-12:00', topic: '多媒體 AI 創作', content: '• 自媒體經營策略規劃\n• AI 內容創作技巧\n• 多媒體素材速成法' },
            { day: '第二天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第二天', time: '13:00-16:30', topic: '多平台自動發布', content: '•每日 AI 文本生成\n• 社群媒體素材自動搭配\n• 排程多平台發布系統' },
        ]
    },
    'vibe-coding': {
        title: 'Vibe Coding AI 軟體開發班',
        subtitle: '運用 AI 技術革新軟體開發流程，快速構建現代化應用程式',
        description: '本課程將教授您如何運用最新的 AI 開發工具，從零開始建立完整的軟體應用程式。透過實務導向的教學方式，讓您掌握 AI 輔助開發的核心技能，並學會將應用程式部署到 Github 雲端平台。',
        image: 'image/vibe-coding.png',
        firstClassDate: '2025/8/22', // 第一堂課日期
        scheduleText: '2025/8/22(五)、2025/8/29(五)', // 完整課程時間
        time: '09:30~16:30',
        location: 'GACC傑登商務會議中心',
        features: [
            { title: '熱門 AI 工具輕鬆上手', desc: '熱門生成式 AI 工具實戰運用' },
            { title: 'AI 程式碼生成', desc: '學習使用GitHub Copilot、Cursor等 AI 工具加速開發' },
            { title: '雲端部署實戰', desc: '透過GitHub 實現應用程式部署與上架' },
            { title: '專案作品集', desc: '完成2-3個實際可用的軟體專案作品' }
        ],
        schedule: [
            { day: '第一天', time: '09:30-12:00', topic: '生成式 AI 應用實戰', content: '• AI 發展現況\n• Prompt設定技巧\n• 生成式 AI 實戰' },
            { day: '第一天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第一天', time: '13:00-16:30', topic: '工作流程 AI 自動化', content: '• Google Apps Script入門\n• 關鍵字新聞抓取自動化\n• 自動化觸發條件設定' },
            { day: '第二天', time: '09:30-12:00', topic: '多功能工具實作', content: '• 製作時間相關工具：時鐘、世界時鐘、線上碼錶、計時器、鬧鐘、番茄鐘、時差換算\n• 製作計數相關工具：計數器、計分版、即時匯率轉換\n• 製作隨機娛樂工具：輪盤、隨機數字、擲硬幣、排序、抽籤' },
            { day: '第二天', time: '12:00-13:00', topic: '中午用餐與午休', content: '本課程中午提供餐點' },
            { day: '第二天', time: '13:00-16:30', topic: '個人品牌網頁與雲端部署', content: '• 建立個人品牌網頁\n• 將工具與網頁整合至專案\n• 專案展示與上線測試' }
            
        ]
    },
    'enterprise-general': {
        title: '企業常態課內訓包班',
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
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2026/3/3(二)",
    "上課日期2": "2026/3/4(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2026/3/5(四)",
    "上課日期2": "2026/3/6(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2026/3/10(二)",
    "上課日期2": "2026/3/11(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2026/3/12(四)",
    "上課日期2": "2026/3/13(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2026/3/17(二)",
    "上課日期2": "2026/3/18(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2026/3/19(四)",
    "上課日期2": "2026/3/20(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2026/3/24(二)",
    "上課日期2": "2026/3/25(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2026/3/26(四)",
    "上課日期2": "2026/3/27(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2026/3/31(二)",
    "上課日期2": "2026/4/1(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2026/4/7(二)",
    "上課日期2": "2026/4/8(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2026/4/9(四)",
    "上課日期2": "2026/4/10(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2026/4/14(二)",
    "上課日期2": "2026/4/15(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2026/4/16(四)",
    "上課日期2": "2026/4/17(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2026/4/21(二)",
    "上課日期2": "2026/4/22(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
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
                <a href="javascript:void(0)" onclick="showCourseDetail('${courseId}'); return false;" class="course-link" style="font-size: 1.2rem; font-weight: 600;">
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
    const courses = Object.entries(courseData)
        .filter(([key, course]) => course.firstClassDate)
        .sort((a, b) => {
            const dateA = new Date(a[1].firstClassDate.replace(/\//g, '-'));
            const dateB = new Date(b[1].firstClassDate.replace(/\//g, '-'));
            return dateA - dateB;
        });

    let tablesHTML = '';
    
    courses.forEach(([courseId, course]) => {
        tablesHTML += `
        <div class="course-group-table" style="margin-bottom: 2rem;">
            <h4 class="course-group-title">
                <a href="javascript:void(0)" onclick="showCourseDetail('${courseId}'); return false;" class="course-link" style="font-size: 1.2rem; font-weight: 600;">
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
            <td><a href="https://www.google.com/maps/search/${encodeURIComponent(course.location)}" target="_blank" class="location-link" title="點擊開啟Google Maps">${course.location}</a></td>
                            <td><span class="course-status status-upcoming" data-status="即將到來">即將到來</span></td>
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
    const nameMapping = {
        '工作流程 AI 自動化實戰班': 'ai-automation',
        'AI 數據分析與決策輔佐班': 'ai-analytics',
        '商務營運 AI 通訊助理班': 'ai-communication',
        '自媒體 AI 數位創作經營班': 'digital-media',
        'Vibe Coding AI 軟體開發班': 'vibe-coding',
        '企業常態課內訓包班': 'enterprise-general',
        '客製化企業內訓包班': 'enterprise-custom'
    };
    
    return nameMapping[courseName] || 'ai-automation';
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
                    `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #e2e8f0; color: #718096; cursor: not-allowed;" disabled>
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
    else if (['ai-automation', 'ai-analytics', 'ai-communication', 'digital-media','vibe-coding'].includes(courseId)) {
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
                        ${session.day && (index === 0 || session.day !== course.schedule[index-1].day) ? 
                            `<tr><td colspan="3" class="day-header">${session.day}</td></tr>` : ''}
                        ${session.time === '' && session.topic === '' && session.content === '' && course.additionalInfo ? 
                            `<tr>
                                <td colspan="3" style="text-align: center; vertical-align: middle; padding: 2rem 0; background: rgba(247, 250, 252, 0.5);">
                                    <a href="${course.additionalInfo.buttonLink}" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; font-size: 1rem; padding: 0.8rem 1.5rem;">
                                        <i class="fas fa-calendar-alt"></i>
                                        ${course.additionalInfo.buttonText}
                                    </a>
                                </td>
                            </tr>` : 
                            `<tr>
                                <td style="text-align: center;">${session.time}</td>
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
            <div style="background: #f8f9fa; border-radius: 15px; padding: 2rem; margin: 0.5rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-utensils" style="margin-right: 0.5rem;"></i>課程有供餐嗎？</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">有的！本課程中午提供精美餐點，讓您專心學習無後顧之憂。</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-laptop" style="margin-right: 0.5rem;"></i>上課需要帶電腦嗎？</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">需要！請攜帶個人筆記型電腦，課程中會進行實作練習。建議使用 Windows 或 Mac 系統，並確保網路連線功能正常。</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-graduation-cap" style="margin-right: 0.5rem;"></i>上完這門課後有進階課程嗎？</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">有的！我們提供完整的學習路徑，建議按照目前課程順序：工作流程 AI 自動化實戰班 → AI 分析與洞察實戰班→ AI 溝通與協作實戰班→數位媒體行銷實戰班→ Vibe Coding 實戰班。便能完整掌握 AI 應用與實務操作，讓你能更智慧的過好未來每一日！<span style="background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">🎯 續班學員享有優先報名權與專屬折扣，詳見報名後提供的「報名成功信件」！</span></p>
                </div>
                
                <div style="margin-bottom: 0;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-clipboard-list" style="margin-right: 0.5rem;"></i>報名流程為何？</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
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
            <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 15px; padding: 2rem; margin: 1rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt" style="margin-right: 0.5rem;"></i>課程調整</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        如遇不可抗力因素（如天災、疫情等）或其他變動因素，主辦單位保留調整課程時間、地點或改為線上授課的權利。若有異動將於開課前 48 小時寄送信件通知學員，請密切留意信件！
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-receipt" style="margin-right: 0.5rem;"></i>發票統編開立辦法</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        如需開立統編發票，請於報名時填寫正確的統一編號與公司名稱。
                        發票將於課程結束後 7 個工作天內開立並寄送。
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-undo" style="margin-right: 0.5rem;"></i>退費規定</h4>
                    <div style="color: #4a5568; margin-left: 1.5rem;">
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
                    <p style="color: #4a5568; margin-left: 1.5rem;">
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
