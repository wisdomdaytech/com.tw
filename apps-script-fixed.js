// ===== 報名與驗證專用Apps Script（修正版） =====

// ===== 配置設定 =====
const CONFIG = {
  // 報名資料Sheets配置
  REGISTRATION_SPREADSHEET_ID: '1jb9crlM-DGHH5Z1Z5g49Fsw1JRCvF1HJO0ZDbEtUY2Y', // 使用同一個試算表
  REGISTRATION_SHEET_NAME: '報名資料',
  
  // 課程資料Sheets配置（用於時段解析）
  COURSE_DATA_SPREADSHEET_ID: '1XQuIYgay-mBy0BbdSulAdYzcMd4DHLx1ASDCJX6o-6Y',
  COURSE_DATA_SHEET_NAME: '課程資訊'
};

// ===== 主要處理函數 =====
function doPost(e) {
  try {
    console.log('收到POST請求:', e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    console.log('解析後的資料:', data);
    
    // 如果是發送驗證碼請求
    if (data.action === 'sendVerification') {
      return handleVerificationRequest(data);
    }
    
    // 如果是報名表單提交
    if (data.action === 'submitRegistration') {
      return handleRegistrationSubmit(data);
    }
    
    // 向後兼容：沒有action參數時默認為報名提交
    return handleRegistrationSubmit(data);
    
  } catch (error) {
    console.error('doPost錯誤:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '處理失敗：' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== 處理報名資料提交 =====
function handleRegistrationSubmit(data) {
  try {
    console.log('開始處理報名資料:', data.name, data.course, data.courseType);
    
    // 開啟試算表
    const spreadsheet = SpreadsheetApp.openById(CONFIG.REGISTRATION_SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.REGISTRATION_SHEET_NAME);
    
    // 如果工作表不存在，創建新的
    if (!sheet) {
      console.log('創建新的報名資料工作表');
      sheet = createNewRegistrationSheet(spreadsheet, CONFIG.REGISTRATION_SHEET_NAME);
    }
    
    // 準備要寫入的資料
    const rowData = prepareRowData(data);
    console.log('準備寫入的資料:', rowData);
    
    // 寫入資料
    sheet.appendRow(rowData);
    
    // 格式化最後一行
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, rowData.length);
    
    // 格式化時間欄位
    range.getCell(1, 1).setNumberFormat('yyyy/mm/dd hh:mm:ss');
    
    // 自動調整欄位寬度
    sheet.autoResizeColumns(1, rowData.length);
    
    console.log('報名資料已成功儲存到第', lastRow, '行');
    
    // 判斷是否為企業課程
    const isEnterpriseCourse = data.courseType === 'enterprise' || 
                              ['enterprise-general', 'enterprise-custom'].includes(data.course);
    
    // 報名成功之後發送通知信
    sendPaymentNoticeEmail(
      data.email,
      data.course,
      data.schedule,
      data.name,
      isEnterpriseCourse
    );

    // 根據課程類型返回不同訊息
    if (isEnterpriseCourse) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: '報名成功！我們將盡快與您聯繫！',
          rowNumber: lastRow
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: '報名成功！我們已寄出課程繳費通知！',
          rowNumber: lastRow
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    console.error('儲存報名資料失敗:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '報名失敗：' + error.toString(),
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== 創建新的報名資料工作表 =====
function createNewRegistrationSheet(spreadsheet, sheetName) {
  try {
    const sheet = spreadsheet.insertSheet(sheetName);
    
    const headers = [
      '提交時間', '課程', '課程時段', '姓名', '電話', 'Email', 
      '公司/組織', '統編', '職位', 'AI經驗', '學習期望', '如何得知', '課程類型'
    ];
    
    // 設定標題行
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
    
    // 自動調整欄位寬度
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('新的報名資料工作表已創建');
    return sheet;
    
  } catch (error) {
    console.error('創建工作表失敗:', error);
    throw error;
  }
}

// ===== 準備要寫入的資料 =====
function prepareRowData(data) {
  const courseNames = {
    'ai-automation': '工作流程 AI 自動化實戰班',
    'ai-analytics': 'AI 數據分析與決策輔佐班',
    'ai-communication': '商務營運 AI 通訊助理班',
    'digital-media': '自媒體 AI 數位創作經營班',
    'vibe-coding': 'Vibe Coding AI 軟體開發班',
    'enterprise-general': '企業常態課內訓包班',
    'enterprise-custom': '企業客製化內訓'
  };
  
  // 判斷是否為企業課程
  const isEnterpriseCourse = data.courseType === 'enterprise' || 
                            ['enterprise-general', 'enterprise-custom'].includes(data.course);
  
  // 解析時段資訊
  let scheduleInfo = '未指定';
  if (data.schedule && data.course && !isEnterpriseCourse) {
    scheduleInfo = parseScheduleInfo(data.course, data.schedule);
  } else if (isEnterpriseCourse) {
    scheduleInfo = '依需求安排';
  }
  
  const rowData = [
    new Date(), // 提交時間
    courseNames[data.course] || data.course, // 課程
    scheduleInfo, // 課程時段
    data.name || '', // 姓名
    data.phone || '', // 電話
    data.email || '', // Email
    data.company || '', // 公司/組織
    data['tax-id'] || '', // 統編
    data.position || '', // 職位
    data['ai-experience'] || '', // AI經驗
    data.expectations || '', // 學習期望
    data['how-know'] || '', // 如何得知
    isEnterpriseCourse ? '企業課程' : '一般課程' // 課程類型
  ];
  
  return rowData;
}

// ===== 解析時段資訊 =====
function parseScheduleInfo(courseId, scheduleId) {
  try {
    console.log('解析時段資訊:', courseId, scheduleId);
    
    // scheduleId 格式: courseId-index
    const parts = scheduleId.split('-');
    if (parts.length < 2) {
      return '時段資訊錯誤';
    }
    
    const index = parseInt(parts[parts.length - 1]);
    if (isNaN(index)) {
      return '時段索引錯誤';
    }
    
    // 從課程資料中找到對應的時段
    const courseData = getCourseDataFromSheet();
    const validCourseData = validateCourseData(courseData);
    
    // 按課程名稱分組
    const courseGroups = {};
    validCourseData.forEach(course => {
      const courseName = course['課程名稱'];
      const courseIdFromName = getCourseIdFromName(courseName);
      
      if (courseIdFromName === courseId) {
        if (!courseGroups[courseName]) {
          courseGroups[courseName] = [];
        }
        courseGroups[courseName].push(course);
      }
    });
    
    // 找到對應的課程組
    const courseGroup = Object.values(courseGroups)[0];
    if (!courseGroup || !courseGroup[index]) {
      return '找不到對應時段';
    }
    
    const selectedCourse = courseGroup[index];
    
    // 組合時段資訊
    const parts_info = [];
    
    if (selectedCourse['上課日期1'] || selectedCourse['上課日期2']) {
      const date1 = selectedCourse['上課日期1'] ? formatDateString(selectedCourse['上課日期1']) : '';
      const date2 = selectedCourse['上課日期2'] ? formatDateString(selectedCourse['上課日期2']) : '';
      
      if (date1 && date2) {
        parts_info.push(`${date1}、${date2}`);
      } else {
        parts_info.push(date1 || date2);
      }
    }
    
    if (selectedCourse['上課時間']) {
      parts_info.push(selectedCourse['上課時間']);
    }
    
    if (selectedCourse['上課地點']) {
      parts_info.push(selectedCourse['上課地點']);
    }
    
    return parts_info.join(' | ') || '時段資訊不完整';
    
  } catch (error) {
    console.error('解析時段資訊失敗:', error);
    return '解析失敗: ' + error.toString();
  }
}

// ===== 驗證碼相關函數 =====
function handleVerificationRequest(data) {
  try {
    console.log('處理驗證碼請求:', data.email, data.courseType);
    
    // 判斷是否為企業課程
    const isEnterpriseCourse = data.courseType === 'enterprise' || 
                              ['enterprise-general', 'enterprise-custom'].includes(data.selectedCourse);
    
    const success = sendVerificationEmailAsync(data.email, data.code, data.timestamp, isEnterpriseCourse);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '驗證碼發送請求已處理'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('處理驗證碼請求失敗:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '處理失敗：' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendVerificationEmailAsync(email, code, timestamp, isEnterpriseCourse = false) {
  try {
    const subject = isEnterpriseCourse ? 
      '智日未來科技 - 企業內訓Email驗證碼' : 
      '智日未來科技 - Email驗證碼';
      
    const htmlBody = createEmailTemplate(code, isEnterpriseCourse);
    
    GmailApp.sendEmail(
      email,
      subject,
      `您的驗證碼是：${code}`,
      {
        htmlBody: htmlBody,
        name: '智日未來科技 WisdomDaytech'
      }
    );
    
    console.log(`驗證碼已發送到 ${email}，代碼：${code}，企業課程：${isEnterpriseCourse}，時間：${new Date()}`);
    return true;
    
  } catch (error) {
    console.error('發送郵件失敗:', error);
    return false;
  }
}

function createEmailTemplate(code, isEnterpriseCourse = false) {
  const courseTypeText = isEnterpriseCourse ? '企業內訓課程' : '課程';
  
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <!-- 標題區 -->
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">智日未來科技</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">WisdomDaytech</p>
      </div>
      
      <!-- 內容區 -->
      <div style="padding: 40px 30px; background: white;">
        <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Email 驗證碼</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
          感謝您報名我們的${courseTypeText}！請使用以下驗證碼完成 Email 驗證：
        </p>
        
        <!-- 驗證碼區 -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background: #f7fafc; border: 3px solid #667eea; border-radius: 12px; padding: 25px 35px;">
            <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
        </div>
        
        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
          此驗證碼將在 10 分鐘後失效，請盡快使用。
        </p>
        
        ${isEnterpriseCourse ? `
        <div style="margin-top: 30px; padding: 20px; background: #e6fffa; border-left: 4px solid #38b2ac; border-radius: 8px;">
          <p style="color: #234e52; font-size: 14px; margin: 0; font-weight: 600;">
            🏢 企業內訓課程說明
          </p>
          <p style="color: #285e61; font-size: 14px; margin: 10px 0 0 0;">
            您報名的是企業內訓課程，我們的專業顧問將在驗證完成後與您聯繫，討論課程內容、時間安排及報價等細節。
          </p>
        </div>
        ` : ''}
        
        <div style="margin-top: 40px; padding: 20px; background: #edf2f7; border-radius: 8px;">
          <p style="color: #4a5568; font-size: 14px; margin: 0; text-align: center;">
            如果您沒有申請此驗證碼，請忽略此郵件。<br>
            如有任何問題，請聯繫我們的客服團隊。
          </p>
        </div>
      </div>
      
      <!-- 頁尾 -->
      <div style="background: #2d3748; padding: 20px; text-align: center;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 智日未來科技 WisdomDaytech. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

// ===== 課程資料讀取函數（用於時段解析） =====
function getCourseDataFromSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.COURSE_DATA_SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(CONFIG.COURSE_DATA_SHEET_NAME);
    
    if (!sheet) {
      throw new Error(`找不到工作表: ${CONFIG.COURSE_DATA_SHEET_NAME}`);
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return [];
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const filteredRows = rows.filter(row => {
      return row.some(cell => cell && cell.toString().trim() !== '');
    });
    
    const courseData = filteredRows.map(row => {
      const courseObj = {};
      headers.forEach((header, index) => {
        courseObj[header] = row[index] || '';
      });
      return courseObj;
    });
    
    return courseData;
    
  } catch (error) {
    console.error('讀取課程資料失敗:', error);
    return [];
  }
}

function validateCourseData(courseData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return courseData.filter(course => {
    if (!course['課程名稱'] || course['課程名稱'].toString().trim() === '') {
      return false;
    }
    
    const date1 = parseDate(course['上課日期1']);
    const date2 = parseDate(course['上課日期2']);
    
    if (!date1 && !date2) {
      return false;
    }
    
    let isFutureCourse = false;
    
    if (date1 && date2) {
      isFutureCourse = date2 >= today;
    } else if (date1) {
      isFutureCourse = date1 >= today;
    } else if (date2) {
      isFutureCourse = date2 >= today;
    }
    
    return isFutureCourse;
  });
}

// ===== 繳費通知相關函數 =====
function sendPaymentNoticeEmail(email, courseId, scheduleId, name, isEnterpriseCourse = false) {
  try {
    const courseNames = {
      'ai-automation': '工作流程 AI 自動化實戰班',
      'ai-analytics': 'AI 數據分析與決策輔佐班',
      'ai-communication': '商務營運 AI 通訊助理班',
      'digital-media': '自媒體 AI 數位創作經營班',
      'vibe-coding': 'Vibe Coding AI 軟體開發班',
      'enterprise-general': '企業常態課內訓包班',
      'enterprise-custom': '企業客製化內訓'
    };
    
    const courseName = courseNames[courseId] || courseId;
    let scheduleInfo = '';

    if (!isEnterpriseCourse && scheduleId) {
      scheduleInfo = parseScheduleInfo(courseId, scheduleId);
    } else if (isEnterpriseCourse) {
      scheduleInfo = '由專人安排';
    }

    const subject = isEnterpriseCourse ? 
      `企業內訓諮詢確認 - ${courseName}` : 
      `課程繳費通知 - ${courseName}`;
      
    const htmlBody = createPaymentNoticeTemplate(name, courseName, scheduleInfo, isEnterpriseCourse);

    GmailApp.sendEmail(
      email,
      subject,
      isEnterpriseCourse ? 
        `企業內訓諮詢確認：${courseName}` : 
        `課程繳費通知：${courseName}`,
      {
        htmlBody: htmlBody,
        name: '智日未來科技 WisdomDaytech'
      }
    );

    console.log(`${isEnterpriseCourse ? '企業內訓確認' : '繳費通知'}已發送到 ${email}，課程：${courseName}`);
    return true;

  } catch (error) {
    console.error('發送通知失敗:', error);
    return false;
  }
}

function createPaymentNoticeTemplate(name, courseName, scheduleInfo, isEnterpriseCourse) {
  if (isEnterpriseCourse) {
    // ===== 企業課程信件內容 =====
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">智日未來科技</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">WisdomDaytech</p>
        </div>
        <div style="padding: 40px 30px; background: white;">
          <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px; text-align: center;">企業內訓諮詢確認</h2>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            親愛的 ${name} 您好，<br><br>
            感謝您對【${courseName}】的興趣！我們已收到您的企業內訓諮詢申請。
          </p>
          
          <div style="margin: 25px 0; padding: 20px; background: #e6fffa; border-left: 4px solid #38b2ac; border-radius: 8px;">
            <h3 style="color: #234e52; margin: 0 0 15px 0; font-size: 18px;">📋 後續流程</h3>
            <ul style="color: #285e61; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>我們的專業顧問將在 <strong>1-2 個工作日內</strong> 主動與您聯繫</li>
              <li>深入了解您的企業需求與培訓目標</li>
              <li>客製化課程內容與時間安排</li>
              <li>提供詳細的培訓方案與報價</li>
              <li>安排試聽或進一步討論</li>
            </ul>
          </div>
          
          <div style="margin: 25px 0; padding: 20px; background: #fff5f5; border-left: 4px solid #f56565; border-radius: 8px;">
            <h3 style="color: #742a2a; margin: 0 0 15px 0; font-size: 18px;">🏢 企業內訓優勢</h3>
            <ul style="color: #822727; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>客製化內容：</strong>根據企業需求調整課程重點</li>
              <li><strong>彈性時間：</strong>配合企業作息安排上課時間</li>
              <li><strong>專業師資：</strong>業界資深講師親自授課</li>
              <li><strong>團體優惠：</strong>多人報名享有優惠價格</li>
              <li><strong>後續支援：</strong>提供課後諮詢與技術支援</li>
            </ul>
          </div>
          
          <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
            如有任何急迫問題，歡迎直接來電或回信聯繫我們。<br>
            期待與您進一步討論合作細節！
          </p>
        </div>
        <div style="background: #2d3748; padding: 20px; text-align: center;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0;">
            © 2025 智日未來科技 WisdomDaytech. All rights reserved.
          </p>
        </div>
      </div>
    `;
  }

  // ===== 一般課程信件內容 =====
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
      <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">智日未來科技</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">WisdomDaytech</p>
      </div>
      <div style="padding: 40px 30px; background: white;">
        <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 22px; text-align: center;">課程繳費通知</h2>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          親愛的 ${name} 您好，<br>
          感謝您報名【${courseName}】，以下是課程資訊：
        </p>
        <div style="margin: 20px 0; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f7fafc;">
          <p style="margin: 0; font-size: 15px; color: #2d3748;">
            <strong>課程名稱：</strong>${courseName}<br>
            <strong>課程時段：</strong>${scheduleInfo}
          </p>
        </div>
        <h3 style="color: #2d3748; font-size: 18px; margin: 25px 0 10px;">繳費資訊</h3>
        <div style="padding: 20px; background: #edf2f7; border-radius: 8px;">
          <p style="margin: 0; font-size: 15px; color: #2d3748; line-height: 1.6;">
            銀行：中國信託<br>
            帳號：<strong>0000679540146732</strong><br>
            戶名：張文騫
          </p>
        </div>
        <h3 style="color: #2d3748; font-size: 18px; margin: 25px 0 10px;">課程價格</h3>
        <p style="font-size: 16px; color: #e53e3e; font-weight: bold; text-align: center;">
          原價 NT$ 16,000 → NT$ 10,000<br>
          <span style="color: #38a169;">限時優惠 38% OFF</span>
        </p>
        <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
          請於收到此通知後三日內完成繳費，以確保您的名額。<br>
          完成付款後，請回覆此信或來信提供付款資訊。
        </p>
      </div>
      <div style="background: #2d3748; padding: 20px; text-align: center;">
        <p style="color: #a0aec0; font-size: 12px; margin: 0;">
          © 2025 智日未來科技 WisdomDaytech. All rights reserved.
        </p>
      </div>
    </div>
  `;
}


// ===== 輔助函數 =====
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  if (dateStr instanceof Date) {
    return dateStr;
  }
  
  if (typeof dateStr !== 'string') {
    dateStr = dateStr.toString();
  }
  
  dateStr = dateStr.trim();
  if (dateStr === '') return null;
  
  try {
    const match = dateStr.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
    
    return null;
  } catch (error) {
    console.error('日期解析錯誤:', dateStr, error);
    return null;
  }
}

function formatDateString(dateInput) {
  let date;
  
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = parseDate(dateInput);
  }
  
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];
  
  return `${year}/${month}/${day}(${weekday})`;
}

function getCourseIdFromName(courseName) {
  const courseMapping = {
    '工作流程 AI 自動化實戰班': 'ai-automation',
    'AI 數據分析與決策輔佐班': 'ai-analytics', 
    '商務營運 AI 通訊助理班': 'ai-communication',
    '自媒體 AI 數位創作經營班': 'digital-media',
    'Vibe Coding AI 軟體開發班': 'vibe-coding',
    '企業常態課內訓包班': 'enterprise-general',
    '企業客製化內訓': 'enterprise-custom'
  };
  
  return courseMapping[courseName] || 'unknown';
}

// ===== CORS處理 =====
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// ===== 測試函數 =====
function testRegistrationAPI() {
  try {
    console.log('=== 測試報名API ===');
    
    // 測試資料
    const testData = {
      action: 'submitRegistration',
      name: '測試用戶',
      phone: '0912345678',
      email: 'test@example.com',
      course: 'ai-automation',
      schedule: 'ai-automation-0',
      company: '測試公司',
      'tax-id': '12345678',
      position: '測試職位',
      'ai-experience': '初學者',
      expectations: '學習AI自動化',
      'how-know': '網路搜尋',
      courseType: 'regular'
    };
    
    const result = handleRegistrationSubmit(testData);
    console.log('測試結果:', result.getContentText());
    
    return {
      success: true,
      message: '報名API測試完成'
    };
    
  } catch (error) {
    console.error('測試失敗:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function testEnterpriseRegistrationAPI() {
  try {
    console.log('=== 測試企業內訓報名API ===');
    
    // 測試企業課程資料
    const testData = {
      action: 'submitRegistration',
      name: '企業測試用戶',
      phone: '0987654321',
      email: 'enterprise@example.com',
      course: 'enterprise-general',
      company: '測試企業',
      'tax-id': '87654321',
      position: '人資主管',
      'ai-experience': '中級',
      expectations: '提升團隊AI技能',
      'how-know': '業務推薦',
      courseType: 'enterprise'
    };
    
    const result = handleRegistrationSubmit(testData);
    console.log('企業課程測試結果:', result.getContentText());
    
    return {
      success: true,
      message: '企業內訓報名API測試完成'
    };
    
  } catch (error) {
    console.error('企業課程測試失敗:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function testVerificationAPI() {
  try {
    console.log('=== 測試驗證碼API ===');
    
    // 測試一般課程驗證碼
    const regularData = {
      action: 'sendVerification',
      email: 'test@example.com',
      code: '123456',
      courseType: 'regular',
      selectedCourse: 'ai-automation',
      timestamp: Date.now()
    };
    
    const regularResult = handleVerificationRequest(regularData);
    console.log('一般課程驗證碼測試結果:', regularResult.getContentText());
    
    // 測試企業課程驗證碼
    const enterpriseData = {
      action: 'sendVerification',
      email: 'enterprise@example.com',
      code: '654321',
      courseType: 'enterprise',
      selectedCourse: 'enterprise-general',
      timestamp: Date.now()
    };
    
    const enterpriseResult = handleVerificationRequest(enterpriseData);
    console.log('企業課程驗證碼測試結果:', enterpriseResult.getContentText());
    
    return {
      success: true,
      message: '驗證碼API測試完成'
    };
    
  } catch (error) {
    console.error('驗證碼測試失敗:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

function testSheetAccess() {
  try {
    console.log('=== 測試試算表存取 ===');
    
    const spreadsheet = SpreadsheetApp.openById(CONFIG.REGISTRATION_SPREADSHEET_ID);
    console.log('試算表名稱:', spreadsheet.getName());
    
    let sheet = spreadsheet.getSheetByName(CONFIG.REGISTRATION_SHEET_NAME);
    if (!sheet) {
      console.log('報名資料工作表不存在，創建新的');
      sheet = createNewRegistrationSheet(spreadsheet, CONFIG.REGISTRATION_SHEET_NAME);
    }
    
    console.log('工作表名稱:', sheet.getName());
    console.log('現有資料行數:', sheet.getLastRow());
    
    return {
      success: true,
      spreadsheetName: spreadsheet.getName(),
      sheetName: sheet.getName(),
      lastRow: sheet.getLastRow()
    };
    
  } catch (error) {
    console.error('試算表存取測試失敗:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// ===== GET請求處理（用於測試） =====
function doGet(e) {
  const action = e.parameter.action;
  
  switch (action) {
    case 'test':
      return ContentService
        .createTextOutput(JSON.stringify(testRegistrationAPI()))
        .setMimeType(ContentService.MimeType.JSON);
        
    case 'testEnterprise':
      return ContentService
        .createTextOutput(JSON.stringify(testEnterpriseRegistrationAPI()))
        .setMimeType(ContentService.MimeType.JSON);
        
    case 'testVerification':
      return ContentService
        .createTextOutput(JSON.stringify(testVerificationAPI()))
        .setMimeType(ContentService.MimeType.JSON);
        
    case 'testSheet':
      return ContentService
        .createTextOutput(JSON.stringify(testSheetAccess()))
        .setMimeType(ContentService.MimeType.JSON);
        
    default:
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: '報名與驗證服務運行正常',
          timestamp: new Date().toISOString(),
          availableTests: ['test', 'testEnterprise', 'testVerification', 'testSheet']
        }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}
