// 課程資料最後更新時間: 2025/9/28 下午11:03:19
// ??????????: 2025/9/28 ??10:53:11
// ??????????: 2025/9/28 ??10:52:23
// ??????????: 2025/9/28 ??10:46:19
// ??????????????
function showPage(pageId) {
    // ??????
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // ??????
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // ??????
    updatePageTitle(pageId);
    
    // ??????
    updateNavActiveState(pageId);
    
    // ???????
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // ?????????
    document.querySelectorAll('.nav-item.dropdown.mobile-active').forEach(item => {
        item.classList.remove('mobile-active');
    });
    
    // ????????
    const courseBackButton = document.getElementById('dynamic-back-button');
    const registrationBackButton = document.getElementById('registration-back-button');
    
    if (pageId === 'course-detail') {
        // ????????????????????????
        if (courseBackButton) courseBackButton.style.display = 'inline-flex';
        if (registrationBackButton) registrationBackButton.style.display = 'none';
    } else if (pageId === 'registration') {
        // ??????????????????????
        if (registrationBackButton) {
            registrationBackButton.style.display = 'inline-flex';
            registrationBackButton.onclick = goBackToCourseDetail;
        }
        if (courseBackButton) courseBackButton.style.display = 'none';
    } else {
        // ?????????????
        if (courseBackButton) courseBackButton.style.display = 'none';
        if (registrationBackButton) registrationBackButton.style.display = 'none';
    }
    
    // ?????URL?pushState???????
    if (pageId !== 'course-detail' && pageId !== 'registration') {
        history.pushState({page: pageId}, '', `#${pageId}`);
    }
    
    // ????????
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ???????
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// ?????????
function toggleMobileDropdown(event) {
    // ???????
    if (window.innerWidth > 768) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    // ???????????????????
    // ????????????????
}

// ??????
function hideDropdown() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show-dropdown');
    });
}

// ??????
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

// ????
function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
}

// ?????????
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, 5000); // ?5???
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// ????
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

// URL????????
function handleUrlAndInit() {
    const hash = window.location.hash.substring(1); // ?? #
    
    if (hash.startsWith('course-')) {
        // ???????
        const courseId = hash.replace('course-', '');
        if (courseData[courseId]) {
            previousPage = 'corporate'; // ???????????
            showCourseDetail(courseId);
            return;
        }
    } else if (hash && ['home', 'corporate', 'enterprise-training', 'consulting', 'about'].includes(hash)) {
        // ???????
        showPageFromUrl(hash);
        return;
    }
    
    // ?????????URL
    showPageFromUrl('home');
}

// ?URL????????pushState?????
function showPageFromUrl(pageId) {
    // ??????
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // ??????
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // ??????
    updatePageTitle(pageId);
    
    // ??????
    updateNavActiveState(pageId);
    
    // ???????
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    // ??URL????hash
    if (window.location.hash !== `#${pageId}`) {
        history.replaceState({page: pageId}, '', `#${pageId}`);
    }
    
    // ????????
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ????????
function updateNavActiveState(pageId) {
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // ?????onclick??
        const onclick = link.getAttribute('onclick');
        if (onclick && onclick.includes(`'${pageId}'`)) {
            link.classList.add('active');
        }
    });
}

// ?????????????
function updateCourseDetailNavState(courseId) {
    // ????active??
    const navLinks = document.querySelectorAll('.nav-item a, .dropdown-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // ????ID????????????
    let mainNavSelector = '';
    let subNavSelector = '';
    
    // ??????
    if ([ 'ai-automation','ai-analytics','ai-communication','digital-media','vibe-coding'].includes(courseId)) {
        mainNavSelector = 'a[onclick*="corporate"]';
        subNavSelector = `a[onclick*="showCourseDetail('${courseId}')"]`;
    }
    // ??????
    else if (['enterprise-general', 'enterprise-custom'].includes(courseId)) {
        mainNavSelector = 'a[onclick*="enterprise-training"]';
        subNavSelector = `a[onclick*="showCourseDetail('${courseId}')"]`;
    }
    
    // ???????
    if (mainNavSelector) {
        const mainNavLink = document.querySelector(mainNavSelector);
        if (mainNavLink) {
            mainNavLink.classList.add('active');
        }
    }
    
    // ???????
    if (subNavSelector) {
        const subNavLink = document.querySelector(subNavSelector);
        if (subNavLink) {
            subNavLink.classList.add('active');
        }
    }
}

// ??????
function updatePageTitle(pageId, courseTitle = null) {
    const baseName = '?????? WisdomDaytech';
    const pageTitles = {
        'home': `${baseName} - AI ??????????`,
        'corporate': `?????? - ${baseName}`,
        'enterprise-training': `?????? - ${baseName}`,
        'consulting': `??????? - ${baseName}`,
        'about': `???? - ${baseName}`,
        'course-detail': courseTitle ? `${courseTitle} - ${baseName}` : `???? - ${baseName}`
    };
    
    document.title = pageTitles[pageId] || pageTitles['home'];
}

// ?????/??????
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

// ??????
function showRegistration(courseId, scheduleId = null) {
    // ??????ID???ID
    window.currentRegistrationCourse = courseId;
    window.currentRegistrationSchedule = scheduleId;
    
    // ??????
    updatePageTitle('registration', '????');
    
    // ?????URL
    const urlSuffix = scheduleId ? `${courseId}-${scheduleId}` : courseId;
    history.pushState({page: 'registration', courseId: courseId, scheduleId: scheduleId}, '', `#registration-${urlSuffix}`);
    
    // ???????
    showPage('registration');
    
    // ???????????????????
    const registrationBackButton = document.getElementById('registration-back-button');
    if (registrationBackButton) {
        registrationBackButton.onclick = goBackToCourseDetail;
        registrationBackButton.style.display = 'inline-flex';
        registrationBackButton.innerHTML = '<i class="fas fa-arrow-left"></i> ????';
    }
    
    // ?????????????
    const courseBackButton = document.getElementById('dynamic-back-button');
    if (courseBackButton) {
        courseBackButton.style.display = 'none';
    }
    
    // ??????
    const courseSelect = document.getElementById('course-select');
    if (courseSelect && courseId) {
        courseSelect.value = courseId;
    }
    
    // ????????
    updateScheduleSelection(courseId, scheduleId);
    
    // ????????
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ????????
function goBackToCourseDetail() {
    if (window.currentRegistrationCourse) {
        showCourseDetail(window.currentRegistrationCourse);
    } else {
        // ????????????????
        goBackToCourses();
    }
}

// ????????
function updateScheduleSelection(courseId, selectedScheduleId = null) {
    const scheduleContainer = document.getElementById('schedule-selection-container');
    if (!scheduleContainer) return;
    
    // ?????????????
    if (courseId === 'enterprise-general' || courseId === 'enterprise-custom') {
        scheduleContainer.style.display = 'none';
        return;
    }
    
    // ?????????????
    const scheduleData = window.courseScheduleData && window.courseScheduleData[courseId];
    if (!scheduleData || scheduleData.length === 0) {
        scheduleContainer.style.display = 'none';
        return;
    }
    
    // ?????????
    const availableSchedules = scheduleData.filter(schedule => schedule.canRegister);
    
    if (availableSchedules.length === 0) {
        scheduleContainer.innerHTML = `
        <div class="form-group" style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d3748; font-size: 1.1rem;">????</label>
            <div style="padding: 1rem; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 10px; color: #e53e3e;">
                <i class="fas fa-exclamation-triangle"></i> ????????????????
            </div>
        </div>
        `;
        scheduleContainer.style.display = 'block';
        return;
    }
    
    // ????????
    const scheduleOptions = availableSchedules.map((schedule, index) => {
        const scheduleId = `${courseId}-${index}`;
        const scheduleText = formatScheduleText(schedule['????1'], schedule['????2']);
        const timeText = schedule['????'] || '';
        const locationText = schedule['????'] || '';
        
        const displayText = `${scheduleText} ${timeText} (${locationText})`;
        
        return `<option value="${scheduleId}">${displayText}</option>`;
    }).join('');
    
    scheduleContainer.innerHTML = `
    <div class="form-group" style="margin-bottom: 2rem;">
        <label for="schedule-select" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2d3748; font-size: 1.1rem;">?????? *</label>
        <select id="schedule-select" name="schedule" required style="width: 100%; padding: 1rem; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 1rem; background: white; transition: all 0.3s ease;">
            <option value="">???????</option>
            ${scheduleOptions}
        </select>
        <small style="display: block; margin-top: 0.5rem; color: #718096;">?????????????</small>
    </div>
    `;
    
    scheduleContainer.style.display = 'block';
    
    // ?????????????
    if (selectedScheduleId) {
        const scheduleSelect = document.getElementById('schedule-select');
        if (scheduleSelect) {
            scheduleSelect.value = selectedScheduleId;
        }
    }
    
    // ??????????
    const scheduleSelect = document.getElementById('schedule-select');
    if (scheduleSelect) {
        scheduleSelect.addEventListener('change', function() {
            window.currentRegistrationSchedule = this.value;
        });
    }
}

// Email??????
let generatedVerificationCode = '';
let emailVerified = false;
let verificationCodeSent = false;
let currentUserEmail = ''; // ???????Email

// ????????????????????
function generateSecureCode() {
    const timestamp = Date.now().toString().slice(-4); // ?????4?
    const random = Math.floor(10 + Math.random() * 90).toString(); // 2????
    return timestamp + random; // 6?????
}

// ??Email???
function sendEmailVerification() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    // ??Email??
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('??????Email??');
        emailInput.focus();
        return;
    }
    
    // ???????
    generatedVerificationCode = generateSecureCode();
    currentUserEmail = email;
    
    // ??????????
    const sendBtn = document.getElementById('send-email-verification');
    const originalText = sendBtn.textContent;
    sendBtn.textContent = '???...';
    sendBtn.disabled = true;
    
    // ????????????????????
    console.log('???:', generatedVerificationCode);
    
    // ??Email????Google Apps Script
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVUdyHJxcOOZJIqwzgqvZrnZ1Fbur4XQwrU9_Hgcx0W0aQIewfXk1ySbjs-nvnJIyq/exec';
    
    // ??Promise.race?????
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('????')), 15000); // 15???
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
            timestamp: Date.now() // ?????
        })
    });
    
    Promise.race([fetchPromise, timeoutPromise])
    .then(() => {
        // ?????????
        const verificationInput = document.getElementById('verification-code');
        verificationInput.disabled = false;
        verificationInput.focus();
        
        // ??????
        const hint = document.getElementById('verification-hint');
        hint.textContent = `??????? ${email}?????????????????`;
        hint.style.color = '#48bb78';
        
        // ??????
        sendBtn.textContent = '???? (60s)';
        sendBtn.disabled = true;
        sendBtn.style.background = '#718096';
        
        // 60????????
        let countdown = 60;
        const countdownTimer = setInterval(() => {
            countdown--;
            sendBtn.textContent = `???? (${countdown}s)`;
            if (countdown <= 0) {
                clearInterval(countdownTimer);
                sendBtn.textContent = '????';
                sendBtn.disabled = false;
                sendBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
        }, 1000);
        
        verificationCodeSent = true;
        
        // ??10?????
        setTimeout(() => {
            if (!emailVerified) {
                generatedVerificationCode = '';
                hint.textContent = '????????????';
                hint.style.color = '#e53e3e';
                verificationCodeSent = false;
            }
        }, 600000); // 10??
    })
    .catch(error => {
        console.error('???????:', error);
        
        // ????????????no-cors???
        const verificationInput = document.getElementById('verification-code');
        verificationInput.disabled = false;
        verificationInput.focus();
        
        const hint = document.getElementById('verification-hint');
        hint.textContent = `??????? ${email}??????????????????`;
        hint.style.color = '#48bb78';
        
        sendBtn.textContent = '????';
        sendBtn.disabled = false;
        sendBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        
        verificationCodeSent = true;
    });
}

// ?????
function verifyCode() {
    const inputCode = document.getElementById('verification-code').value.trim();
    
    if (inputCode === generatedVerificationCode) {
        emailVerified = true;
        const verificationInput = document.getElementById('verification-code');
        verificationInput.style.borderColor = '#48bb78';
        verificationInput.style.backgroundColor = '#f0fff4';
        
        // ????????
        const hint = document.getElementById('verification-hint');
        hint.textContent = '? Email????';
        hint.style.color = '#48bb78';
        
        return true;
    } else {
        const hint = document.getElementById('verification-hint');
        hint.textContent = '? ???????????';
        hint.style.color = '#e53e3e';
        return false;
    }
}

// ????????
function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    // ??????
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // ????
    const requiredFields = ['name', 'phone', 'email', 'course', 'verification-code'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    // ?????????????????
    if (data.course && !['enterprise-general', 'enterprise-custom'].includes(data.course)) {
        if (!data.schedule) {
            missingFields.push('schedule');
        }
    }
    
    if (missingFields.length > 0) {
        const fieldNames = {
            'name': '??',
            'phone': '??',
            'email': 'Email',
            'course': '??',
            'verification-code': '???',
            'schedule': '????'
        };
        const missingFieldNames = missingFields.map(field => fieldNames[field]).join('?');
        alert(`??????????${missingFieldNames}`);
        return;
    }
    
    // ??Email???
    if (!verificationCodeSent) {
        alert('????Email???');
        return;
    }
    
    if (!emailVerified && !verifyCode()) {
        return;
    }
    
    // ??Email??
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('??????Email??');
        return;
    }
    
    // ??????????????
    const phoneRegex = /^09\d{8}$|^0\d{1,2}-?\d{6,8}$/;
    if (!phoneRegex.test(data.phone.replace(/\s|-/g, ''))) {
        alert('??????????');
        return;
    }
    
    // ?????????????
    if (data['tax-id'] && data['tax-id'].trim()) {
        const taxIdRegex = /^\d{8}$/;
        if (!taxIdRegex.test(data['tax-id'].trim())) {
            alert('?????8???');
            return;
        }
    }
    
    // ???????
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ???...';
    submitBtn.disabled = true;
    
    // ???Google Apps Script
    // ?????URL?????Google Apps Script??URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKVQouyajizJopfUE33Y-qo9swPVVYVYD7m5BvfXFMpK8DoBrMhkF4QWX4M9hNd4Bd/exec';
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // ?????CORS??
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // ??no-cors?????????????????
        alert('???????????????');
        
        // ????
        event.target.reset();
        
        // ??????
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // ????????
        goBackToCourseDetail();
    })
    .catch(error => {
        console.error('????:', error);
        
        // ????????????no-cors???????????
        alert('????????????????');
        
        // ????
        event.target.reset();
        
        // ??????
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // ????????
        goBackToCourseDetail();
    });
}

// ???
document.addEventListener('DOMContentLoaded', function() {
    // ???????????????
    const animatedElements = document.querySelectorAll('.card, .course-table, .about-content');
    animatedElements.forEach(el => el.classList.add('fade-in'));
    
    // ????
    window.addEventListener('scroll', handleScrollAnimations);
    
    // ????
    handleScrollAnimations();
    
    // ??????????
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // ??????????
    const courseSelect = document.getElementById('course-select');
    if (courseSelect) {
        courseSelect.addEventListener('change', function() {
            const selectedCourse = this.value;
            if (selectedCourse) {
                // ??????
                updateScheduleSelection(selectedCourse);
            } else {
                // ??????
                const scheduleContainer = document.getElementById('schedule-selection-container');
                if (scheduleContainer) {
                    scheduleContainer.style.display = 'none';
                }
            }
        });
    }
    
    // ?????????
    const verificationInput = document.getElementById('verification-code');
    if (verificationInput) {
        verificationInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                verifyCode();
            }
        });
    }
    
    // ????URL
    handleUrlAndInit();
    
    // ??????????Google Apps Script????????
    const courseTablesContainer = document.getElementById('course-tables-container');
    if (courseTablesContainer) {
        courseTablesContainer.innerHTML = generateSortedCourseTable();
    }
    
    // ???????
    if (document.querySelector('.carousel-slide')) {
        startAutoSlide();
        
        // ???????????
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
        }
    }
    
    // ???????????
    const dropdownLinks = document.querySelectorAll('.nav-item.dropdown > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', toggleMobileDropdown);
    });
    
    // ????????????
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isDropdownClick = event.target.closest('.nav-item.dropdown');
            if (!isDropdownClick) {
                // ???????????????????????
            }
        }
    });
});

// ??hash?????????URL??
window.addEventListener('hashchange', function() {
    handleUrlAndInit();
});

// ?????
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelector('.nav-menu').classList.remove('active');
        // ??????????????
        document.querySelectorAll('.nav-item.dropdown.mobile-active').forEach(item => {
            item.classList.remove('mobile-active');
        });
    }
});

// ?????
const courseData = {
    'ai-automation': {
        title: '???? AI ??????',
        subtitle: '?? AI ??????????????????',
        description: '????????? Google Apps Script ? Make.com ?????????????????????????????????????',
        image: 'image/ai-automation.png',
        firstClassDate: '2025/9/5', // ??????
        scheduleText: '2025/9/5(?)?2025/9/12(?)', // ??????
        time: '09:30~16:30',
        location: 'GACC????????',
        features: [
            { title: '?? AI ??????', desc: '????? AI ??????' },
            { title: '???????', desc: '??????????????????' },
            { title: 'Google Apps Script ??', desc: '???????????' },
            { title: 'Make.com ??', desc: '?????????? API ????' }
        ],
        schedule: [
            { day: '???', time: '09:30-12:00', topic: '??? AI ????', content: '? AI ????\n? Prompt????\n? ??? AI ??' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ???', content: '? Google Apps Script??\n? ??????????\n? ?????????' },
            { day: '???', time: '09:30-12:00', topic: '???? AI ???', content: '? ????????\n? ?????????\n? ???????' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: 'No-code ?????', content: '? Line ???????\n? ?? AI ?????\n? ?????????' }
        ]
    },
    'ai-analytics': {
        title: 'AI ??????????',
        subtitle: '?? AI ?????????????????????',
        description: '????????????????????????????? ICLT ??????? AI ? Google Apps Script ????????????????????????????????????',
        image: 'image/ai-analytics.png',
        firstClassDate: '2025/9/3', // ??????
        scheduleText: '2025/9/3(?)?2025/9/10(?)', // ??????
        time: '09:30~16:30',
        location: 'GACC????????',
        features: [
            { title: '?? AI ??????', desc: '????? AI ??????' },
            { title: '??????', desc: '?? AI ?????????????' },
            { title: '??????', desc: '??????????????????' },
            { title: '?????', desc: '????????????????' }
        ],
        schedule: [
            { day: '???', time: '09:30-12:00', topic: '??? AI ????', content: '? AI ????\n? Prompt????\n? ??? AI ??' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ???', content: '? Google Apps Script??\n? ??????????\n? ?????????' },
            { day: '???', time: '09:30-12:00', topic: '???? ICLT ??', content: '? ????????\n? ???? AI ????\n? ???? AI ??'},
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '????????', content: '? ????????\n? ???????\n? ????????' },
        ]
    },
    'ai-communication': {
        title: '???? AI ?????',
        subtitle: '?? AI ????????????????????????????',
        description: '?????????? Google Apps Script ? Make.com ?????????????????????????????? Email?LINE ??????????????????????????????????????????????',
        image: 'image/ai-communication.png',
        firstClassDate: '2025/8/22', // ??????
        scheduleText: '2025/8/22(?)?2025/8/29(?)', // ??????
        time: '09:30~16:30',
        location: 'GACC????????',
        features: [
            { title: '?? AI ??????', desc: '????? AI ??????' },
            { title: '?????????', desc: '?? AI ????????????' },
            { title: '????????', desc: '?? Email ? LINE ?????????' },
            { title: 'Make.com ????', desc: '????????? API ???????' }
        ],
        schedule: [
            { day: '???', time: '09:30-12:00', topic: '??? AI ????', content: '? AI ????\n? Prompt????\n? ??? AI ??' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ???', content: '? Google Apps Script??\n? ??????????\n? ?????????' },
            { day: '???', time: '09:30-12:00', topic: '?????????', content: '? ?????????\n? ???????????\n? ???????????' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ??', content: '? ???? AI ???????\n? ??????????\n? ?????????' }
        ]
    },
    'digital-media': {
        title: '??? AI ???????',
        subtitle: '??????????????????????????',
        description: '??????????????????????????????????????????????????????????????????',
        image: 'image/digital-media.png',
        firstClassDate: '2025/9/11', // ??????
        scheduleText: '2025/9/11(?)?2025/9/18(?)', // ??????
        time: '09:30~16:30',
        location: 'GACC????????',
        features: [
            { title: '?? AI ??????', desc: '????? AI ??????' },
            { title: '??????', desc: '?? AI ??????????????' },
            { title: '???????', desc: '?????????????' },
            { title: '?????????', desc: '???????????????' },
        ],
        schedule: [
            { day: '???', time: '09:30-12:00', topic: '??? AI ????', content: '? AI ????\n? Prompt????\n? ??? AI ??' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ???', content: '? Google Apps Script??\n? ??????????\n? ?????????' },
            { day: '???', time: '09:30-12:00', topic: '??? AI ??', content: '? ?????????\n? AI ??????\n? ????????' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???????', content: '??? AI ????\n? ??????????\n? ?????????' },
        ]
    },
    'vibe-coding': {
        title: 'Vibe Coding AI ?????',
        subtitle: '?? AI ??????????????????????',
        description: '?????????????? AI ????????????????????????????????????? AI ????????????????????? Github ?????',
        image: 'image/vibe-coding.png',
        firstClassDate: '2025/8/22', // ??????
        scheduleText: '2025/8/22(?)?2025/8/29(?)', // ??????
        time: '09:30~16:30',
        location: 'GACC????????',
        features: [
            { title: '?? AI ??????', desc: '????? AI ??????' },
            { title: 'AI ?????', desc: '????GitHub Copilot?Cursor? AI ??????' },
            { title: '??????', desc: '??GitHub ???????????' },
            { title: '?????', desc: '??2-3????????????' }
        ],
        schedule: [
            { day: '???', time: '09:30-12:00', topic: '??? AI ????', content: '? AI ????\n? Prompt????\n? ??? AI ??' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???? AI ???', content: '? Google Apps Script??\n? ??????????\n? ?????????' },
            { day: '???', time: '09:30-12:00', topic: '???????', content: '? ?????????????????????????????????????\n? ???????????????????????\n? ??????????????????????????' },
            { day: '???', time: '12:00-13:00', topic: '???????', content: '?????????' },
            { day: '???', time: '13:00-16:30', topic: '???????????', content: '? ????????\n? ???????????\n? ?????????' }
            
        ]
    },
    'enterprise-general': {
        title: '?????????',
        subtitle: '???????????????????',
        description: '??????????????????????????????????????????? AI ????????????????',
        image: 'image/enterprise-training-generally.png',
        features: [
            { title: '??????', desc: '????????????????????' },
            { title: '????', desc: '???????????????????' },
            { title: '????', desc: '?????????????' },
            { title: '????', desc: '??????????????' }
        ],
        schedule: [
            { day: '?????????', time: '', topic: '', content: '' }
        ],
        additionalInfo: {
            buttonText: '??????',
            buttonLink: '#corporate'
        }
    },
    'enterprise-custom': {
        title: '?????????',
        subtitle: '???????????????????????',
        description: '??????????????????????????????????????????? AI ??????????????????? AI ???',
        image: 'image/enterprise-training-customization.png',
        features: [
            { title: '????', desc: '??????????? AI ????' },
            { title: '?????', desc: '??????????????' },
            { title: '????', desc: '???????????????' },
            { title: '????', desc: '???????????????' }
        ],
        schedule: [
            { day: '????', time: '1-2?', topic: '??????', content: '? ??????\n? AI ??????\n? ??????\n? ??????' },
            { day: '????', time: '2-3?', topic: '???????', content: '? ??????\n? ??????\n? ????\n? ??????' },
            { day: '????', time: '???', topic: '???????', content: '? ??????\n? ??????\n? ??????\n? ????' },
            { day: '????', time: '??', topic: '???????', content: '? ??????\n? ??????\n? ??????\n? ??????' }
        ]
    }
};

// ????????????Google Apps Script???????
// Google Apps Script????Google Sheets??????????????GitHub
let dynamicCourseData = [
  {
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2025/10/21(二)",
    "上課日期2": "2025/10/29(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2025/12/15(一)",
    "上課日期2": "2025/12/22(一)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2025/12/16(二)",
    "上課日期2": "2025/12/23(二)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2025/12/17(三)",
    "上課日期2": "2025/12/24(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2025/12/18(四)",
    "上課日期2": "2025/12/25(四)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2025/12/19(五)",
    "上課日期2": "2025/12/26(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "工作流程 AI 自動化實戰班",
    "上課日期1": "2026/1/5(一)",
    "上課日期2": "2026/1/6(二)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2026/1/6(二)",
    "上課日期2": "2026/1/7(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2026/1/7(三)",
    "上課日期2": "2026/1/8(四)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2026/1/8(四)",
    "上課日期2": "2026/1/9(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2026/1/9(五)",
    "上課日期2": "2026/1/10(六)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "AI 數據分析與決策輔佐班",
    "上課日期1": "2025/9/23(二)",
    "上課日期2": "2025/9/30(二)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "自媒體 AI 數位創作經營班",
    "上課日期1": "2025/9/24(三)",
    "上課日期2": "2025/10/1(三)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "Vibe Coding AI 軟體開發班",
    "上課日期1": "2025/9/25(四)",
    "上課日期2": "2025/10/2(四)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  },
  {
    "課程名稱": "商務營運 AI 通訊助理班",
    "上課日期1": "2025/9/26(五)",
    "上課日期2": "2025/10/3(五)",
    "上課時間": "09:30~16:30",
    "上課地點": "GACC傑登商務會議中心"
  }
];

// ????????HTML?????????????????3??
function generateSortedCourseTable() {
    // ???????????????????
    if (!dynamicCourseData || dynamicCourseData.length === 0) {
        console.log('????????');
        return generateDefaultCourseTable();
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ?????00:00
    
    // ???????
    const courseGroups = {};
    
    dynamicCourseData.forEach(course => {
        const courseName = course['????'];
        if (!courseName) return;
        
        if (!courseGroups[courseName]) {
            courseGroups[courseName] = [];
        }
        
        // ????????
        const date1 = parseDate(course['????1']);
        const date2 = parseDate(course['????2']);
        
        let status = '';
        let statusClass = '';
        let priority = 0;
        
        // ??????
        if (date1 && date2) {
            if (date1 <= today && date2 >= today) {
                // ???
                status = '???';
                statusClass = 'status-ongoing';
                priority = 1;
            } else if (date1 > today) {
                // ????
                status = '????';
                statusClass = 'status-upcoming';
                priority = 2;
            } else {
                // ???
                status = '???';
                statusClass = 'status-ended';
                priority = 3;
            }
        } else if (date1) {
            if (date1.toDateString() === today.toDateString()) {
                status = '???';
                statusClass = 'status-ongoing';
                priority = 1;
            } else if (date1 > today) {
                status = '????';
                statusClass = 'status-upcoming';
                priority = 2;
            } else {
                status = '???';
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
    
    // ???????????3?
    Object.keys(courseGroups).forEach(courseName => {
        courseGroups[courseName] = courseGroups[courseName]
            .sort((a, b) => {
                // ?????????? > ???? > ????
                if (a.priority !== b.priority) {
                    return a.priority - b.priority;
                }
                // ???????????????
                return a.daysFromToday - b.daysFromToday;
            })
            .slice(0, 3); // ??????3?
    });
    
    // ??HTML
    let tablesHTML = '';
    
    Object.keys(courseGroups).forEach(courseName => {
        const courses = courseGroups[courseName];
        if (courses.length === 0) return;
        
        const courseId = getCourseIdFromName(courseName);
        
        const tableRows = courses.map(course => {
            const scheduleText = formatScheduleText(course['????1'], course['????2']);
            
            return `
            <tr>
                <td>${scheduleText}</td>
                <td>${course['????'] || ''}</td>
                <td><a href="https://www.google.com/maps/search/${encodeURIComponent(course['????'] || '')}" target="_blank" class="location-link" title="????Google Maps">${course['????'] || ''}</a></td>
                <td><span class="course-status ${course.statusClass}">${course.status}</span></td>
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
                            <th>????</th>
                            <th>????</th>
                            <th>????</th>
                            <th>??</th>
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

// ??????????Google Sheets????
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
                            <th>????</th>
                            <th>????</th>
                            <th>????</th>
                            <th>??</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${course.scheduleText}</td>
                            <td>${course.time}</td>
                            <td><a href="https://www.google.com/maps/search/${encodeURIComponent(course.location)}" target="_blank" class="location-link" title="????Google Maps">${course.location}</a></td>
                            <td><span class="course-status status-upcoming">????</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `;
    });

    return tablesHTML;
}

// ???????
function parseDate(dateStr) {
    if (!dateStr) return null;
    
    // ????????
    if (typeof dateStr === 'string') {
        // ???2025/9/5 ? 2025-9-5
        const cleanDate = dateStr.replace(/[()????????]/g, '').trim();
        const parts = cleanDate.split(/[/-]/);
        
        if (parts.length >= 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // JavaScript???0??
            const day = parseInt(parts[2]);
            return new Date(year, month, day);
        }
    }
    
    // ???Date???????
    if (dateStr instanceof Date) {
        return dateStr;
    }
    
    return null;
}

// ???????????courseId
function getCourseIdFromName(courseName) {
    const nameMapping = {
        '???? AI ??????': 'ai-automation',
        'AI ??????????': 'ai-analytics',
        '???? AI ?????': 'ai-communication',
        '??? AI ???????': 'digital-media',
        'Vibe Coding AI ?????': 'vibe-coding',
        '?????????': 'enterprise-general',
        '?????????': 'enterprise-custom'
    };
    
    return nameMapping[courseName] || 'ai-automation';
}

// ?????????
function formatScheduleText(date1, date2) {
    if (!date1 && !date2) return '';
    
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        if (typeof dateStr === 'string') return dateStr;
        
        // ???Date??????? YYYY/M/D(?X)
        const year = dateStr.getFullYear();
        const month = dateStr.getMonth() + 1;
        const day = dateStr.getDate();
        const weekdays = ['?', '?', '?', '?', '?', '?', '?'];
        const weekday = weekdays[dateStr.getDay()];
        
        return `${year}/${month}/${day}(${weekday})`;
    };
    
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    
    if (formattedDate1 && formattedDate2) {
        return `${formattedDate1}?${formattedDate2}`;
    }
    
    return formattedDate1 || formattedDate2;
}

// ?????????????
function generateCourseScheduleSection(courseId) {
    // ?????????????
    if (courseId === 'enterprise-general' || courseId === 'enterprise-custom') {
        return '';
    }
    
    // ????????????
    if (!dynamicCourseData || dynamicCourseData.length === 0) {
        return '';
    }
    
    const course = courseData[courseId];
    if (!course) return '';
    
    // ??????????
    const courseSchedules = dynamicCourseData.filter(item => {
        const courseName = item['????'];
        return courseName === course.title;
    });
    
    if (courseSchedules.length === 0) {
        return '';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // ?????????
    const processedSchedules = courseSchedules.map(schedule => {
        const date1 = parseDate(schedule['????1']);
        const date2 = parseDate(schedule['????2']);
        
        let status = '';
        let statusClass = '';
        let priority = 0;
        let canRegister = false;
        
        // ??????
        if (date1 && date2) {
            if (date1 <= today && date2 >= today) {
                // ???
                status = '???';
                statusClass = 'status-ongoing';
                priority = 1;
                canRegister = false;
            } else if (date1 > today) {
                // ????
                status = '????';
                statusClass = 'status-upcoming';
                priority = 2;
                canRegister = true;
            } else {
                // ???
                status = '???';
                statusClass = 'status-ended';
                priority = 3;
                canRegister = false;
            }
        } else if (date1) {
            if (date1.toDateString() === today.toDateString()) {
                status = '???';
                statusClass = 'status-ongoing';
                priority = 1;
                canRegister = false;
            } else if (date1 > today) {
                status = '????';
                statusClass = 'status-upcoming';
                priority = 2;
                canRegister = true;
            } else {
                status = '???';
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
        // ?????????? > ???? > ????
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // ???????????????
        return a.daysFromToday - b.daysFromToday;
    }).slice(0, 3); // ???3?
    
    if (processedSchedules.length === 0) {
        return '';
    }
    
    const tableRows = processedSchedules.map((schedule, index) => {
        const scheduleText = formatScheduleText(schedule['????1'], schedule['????2']);
        const scheduleId = `${courseId}-${index}`;
        
        return `
        <tr data-schedule-id="${scheduleId}" data-can-register="${schedule.canRegister}">
            <td>${scheduleText}</td>
            <td>${schedule['????'] || ''}</td>
            <td><a href="https://www.google.com/maps/search/${encodeURIComponent(schedule['????'] || '')}" target="_blank" class="location-link" title="????Google Maps">${schedule['????'] || ''}</a></td>
            <td><span class="course-status ${schedule.statusClass}">${schedule.status}</span></td>
            <td style="text-align: center;">
                ${schedule.canRegister ? 
                    `<button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;" onclick="showRegistration('${courseId}', '${scheduleId}')">
                        <i class="fas fa-user-plus"></i> ??
                    </button>` :
                    `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; background: #e2e8f0; color: #718096; cursor: not-allowed;" disabled>
                        ${schedule.status === '???' ? '???' : '???'}
                    </button>`
                }
            </td>
        </tr>
        `;
    }).join('');
    
    // ???????????????
    window.courseScheduleData = window.courseScheduleData || {};
    window.courseScheduleData[courseId] = processedSchedules;
    
    return `
    <div class="course-available-schedules" style="margin: 3rem 0;">
        <h3><i class="fas fa-clock"></i> ??????</h3>
        <div class="course-table">
            <div class="table-responsive">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>????</th>
                            <th>????</th>
                            <th>????</th>
                            <th>??</th>
                            <th>??</th>
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

// ?????????????????Google Apps Script?????GitHub
// ?????????? dynamicCourseData ???

// ??????????
let previousPage = 'corporate';

// ????????
function showCourseDetail(courseId) {
    // ??????
    hideDropdown();
    
    // ??????
    const currentActive = document.querySelector('.page-section.active');
    if (currentActive) {
        previousPage = currentActive.id;
        window.lastCourseSourcePage = currentActive.id; // ??????
    }
    
    // ???????????
    const courseCard = document.querySelector(`[onclick="showCourseDetail('${courseId}')"]`);
    if (courseCard) {
        window.lastCourseScrollPosition = courseCard.offsetTop - 100; // ??100px??????????
        window.lastClickedCourseId = courseId;
    }
    
    // ???????????????????
    // ????????????????
    if (['enterprise-general', 'enterprise-custom'].includes(courseId)) {
        window.lastCourseSourcePage = 'enterprise-training';
        window.isFromHomeTable = false;
    } 
    // ????????????????????
    else if (['ai-automation', 'ai-analytics', 'ai-communication', 'digital-media','vibe-coding'].includes(courseId)) {
        // ??????????????
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
    // ????
    else {
        window.lastCourseSourcePage = currentActive ? currentActive.id : 'corporate';
        window.isFromHomeTable = false;
    }
    
    // ??????????
    window.clickedFromNavMenu = false;
    
    // ?????????????????
    const allCourseCards = document.querySelectorAll(`[onclick*="showCourseDetail('${courseId}')"]`);
    if (allCourseCards.length > 0) {
        // ???????????????????
        const cardElement = Array.from(allCourseCards).find(card => 
            card.classList.contains('clickable-card') || card.classList.contains('card')
        );
        if (cardElement) {
            window.lastCourseCardElement = cardElement;
        }
    }
    

    const course = courseData[courseId];
    if (!course) return;

    // ??????
    updatePageTitle('course-detail', course.title);

    // ?????URL???????
    history.pushState({page: 'course-detail', courseId: courseId}, '', `#course-${courseId}`);

    // ????????
    const contentHTML = `
        <div class="course-header">
            <img src="${course.image}" alt="${course.title}" class="course-hero-image">
            <h1 class="course-title">${course.title}</h1>
            <p class="course-subtitle">${course.subtitle}</p>
            <div class="price-section">
                ${courseId === 'enterprise-general' || courseId === 'enterprise-custom' ? 
                    '<span style="color: #718096; font-weight: 600; font-size: 1.5rem;">?????</span>' :
                    `<span class="original-price">?? NT$ 16,000</span>
                    <span class="current-price">NT$ 10,000</span>
                    <span class="discount-badge">???? 38% OFF</span>`
                }
            </div>
        </div>

        <div class="course-description">
            <h3>????</h3>
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
            <h3><i class="fas fa-calendar-alt"></i> ???? (2??12??)</h3>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>??</th>
                        <th>??</th>
                        <th>????</th>
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
            <h3><i class="fas fa-question-circle"></i> ??????</h3>
            <div style="background: #f8f9fa; border-radius: 15px; padding: 2rem; margin: 0.5rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-utensils" style="margin-right: 0.5rem;"></i>???????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">???????????????????????????</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-laptop" style="margin-right: 0.5rem;"></i>?????????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">????????????????????????????? Windows ? Mac ???????????????</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-graduation-cap" style="margin-right: 0.5rem;"></i>?????????????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">?????????????????????????????? AI ?????? ? AI ????????? AI ??????????????????? Vibe Coding ?????????? AI ???????????????????????<span style="background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">? ??????????????????????????????????</span></p>
                </div>
                
                <div style="margin-bottom: 0;">
                    <h4 style="color: #667eea; margin-bottom: 0.5rem;"><i class="fas fa-clipboard-list" style="margin-right: 0.5rem;"></i>???????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        1. ????????? Email ??<br>
                        2. ???? 1 ?????????????<br>
                        3. ??????????????????????<span style="background: linear-gradient(135deg, #e53e3e, #f56565); color: white; padding: 0.2rem 0.6rem; border-radius: 15px; font-weight: 600; font-size: 1.1rem;">? ??????? 72 ???????</span>??????????<br>
                        4. ??? 3 ?????????????
                    </p>
                </div>
            </div>
        </div>

        <div class="course-notice" style="margin: 4rem 0;">
            <h3><i class="fas fa-exclamation-triangle"></i> ????</h3>
            <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 15px; padding: 2rem; margin: 1rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-calendar-alt" style="margin-right: 0.5rem;"></i>????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        ???????????????????????????????????????????????????????????? 48 ???????????????????
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-receipt" style="margin-right: 0.5rem;"></i>????????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        ?????????????????????????????
                        ????????? 7 ???????????
                    </p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-undo" style="margin-right: 0.5rem;"></i>????</h4>
                    <div style="color: #4a5568; margin-left: 1.5rem;">
                        <p style="margin-bottom: 0.5rem;"><strong>?????????</strong></p>
                        <ul style="margin-left: 1rem;">
                            <li>??? 30 ?????????? 95% ??</li>
                            <li>???? 15 ? 29 ?????? 85% ??</li>
                            <li>???? 4 ? 14 ?????? 60% ??</li>
                            <li>???? 1 ? 3 ?????? 30% ??</li>
                            <li>?????????????</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>???????</strong></p>
                        <ul style="margin-left: 1rem;">
                            <li>???????????????????????????????</li>
                            <li>????????????????? 30 ???????</li>
                        </ul>
                    </div>
                </div>
                
                <div style="margin-bottom: 0;">
                    <h4 style="color: #e53e3e; margin-bottom: 0.5rem;"><i class="fas fa-shield-alt" style="margin-right: 0.5rem;"></i>??????</h4>
                    <p style="color: #4a5568; margin-left: 1.5rem;">
                        ??????????????????????????????????????????????????????????????
                    </p>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin-top: 3rem;">
            <a href="javascript:void(0)" onclick="showRegistration('${courseId}')" class="btn btn-primary" style="font-size: 1.2rem; padding: 1rem 2rem;">
                <i class="fas fa-user-plus"></i> ????
            </a>
        </div>
        
    `;

    // ????????
    document.getElementById('course-detail-content').innerHTML = contentHTML;

    // ????????
    const backButton = document.getElementById('dynamic-back-button');
    if (backButton) {
        if (isFromHomeTable) {
            backButton.innerHTML = '<i class="fas fa-home"></i> ????';
            backButton.onclick = goBackToHome;
        } else {
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> ??????';
            backButton.onclick = goBackToCourses;
        }
        backButton.style.display = 'inline-flex';
    }

    // ?????????
    showPage('course-detail');
    
    // ?????? - ?????????????
    updateCourseDetailNavState(courseId);
    
    // ????????
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ??????
function goBackToCourses() {
    // ????????????
    const sourcePage = window.lastCourseSourcePage || 'corporate';
    showPage(sourcePage);
    
    // ???????????????????
    setTimeout(() => {
        if (window.lastCourseScrollPosition !== undefined) {
            window.scrollTo({
                top: window.lastCourseScrollPosition,
                behavior: 'smooth'
            });
            
            // ?????????????
            if (window.lastClickedCourseId) {
                // ??????????????.clickable-card???
                const allCards = document.querySelectorAll(`[onclick*="showCourseDetail('${window.lastClickedCourseId}')"]`);
                const courseCard = Array.from(allCards).find(card => 
                    card.classList.contains('clickable-card') || card.classList.contains('card')
                ) || allCards[0];
                
                if (courseCard) {
                    courseCard.style.transform = 'scale(1.02)';
                    courseCard.style.boxShadow = '0 25px 50px rgba(0, 212, 255, 0.4)';
                    courseCard.style.border = '2px solid #00d4ff';
                    courseCard.style.transition = 'all 0.3s ease';
                    
                    // 3????????
                    setTimeout(() => {
                        courseCard.style.transform = '';
                        courseCard.style.boxShadow = '';
                        courseCard.style.border = '';
                        courseCard.style.transition = '';
                    }, 3000);
                }
            }
        } else {
            // ??????????????????
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

// ????????????
function goBackToHome() {
    showPage('home');
    
    // ???????????
    setTimeout(() => {
        const courseTable = document.querySelector('.course-table');
        if (courseTable) {
            const tablePosition = courseTable.offsetTop - 100; // ??100px??????????
            window.scrollTo({
                top: tablePosition,
                behavior: 'smooth'
            });
        }
    }, 100);
}

// ?????????????
function showPageWithoutScroll(pageId) {
    // ??????
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // ??????
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // ??????
    updateNavActiveState(pageId);
    
    // ???????
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
}
