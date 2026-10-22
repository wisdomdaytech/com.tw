// 官方資料查核與彙整更新：2026-10-22。固定期限採台灣時間；已截止案件不列入。
(() => {
    const checked = '2026/10/22';
    const plans = [
        {
            id: 'small-business-training', category: 'training', title: '小型企業人力提升計畫（小人提）',
            checked: '2026/10/22', agency: '勞動部勞動力發展署及所屬分署', label: '就保人數 50 人以下', amount: '政府提供訓練輔導與課程服務',
            status: '依分署經費與服務量能受理', deadline: '2026-10-31', deadlineAt: '2026-10-31T17:00:00+08:00',
            period: '115 年度公告受理至 2026/10/31 17:00（以郵戳為憑）；經費用罄不再受理，備取及剩餘量能請向所屬分署確認。服務及課程辦理至 2026/11/15。',
            summary: '協助小型企業找出員工訓練需求，由計畫安排輔導與課程，可評估 AI 資訊應用培訓。',
            audience: '依法設立或辦理營業／稅籍登記，受僱勞工參加就業保險人數 50 人以下的民間投保單位；參訓者須為受僱且具就保身分的員工。總、分支機構應以總機構申請。',
            funding: '提供人才培訓診斷、輔導及核定訓練課程服務；不是每家直接領取固定現金補助。課程費用、外訓墊付及出席核銷條件依分署與核定內容辦理。',
            scope: '資訊應用、行銷與顧客服務等訓練可依企業需求評估加入 AI 文書、資料整理或工作流程應用。課程內容須經輔導與分署核定，非購買本公司任何課程都能申請。',
            steps: ['先向主要訓練所在地分署確認名額、就保人數及辦訓能力資格。', '在官方資訊系統登錄上傳，次日起 5 個工作日內且不得逾收件期限，提交申請表、登記、勞保繳款與明細、納稅等文件。', '配合訓練需求輔導及核定課程安排，完成出席與相關成果、憑證作業。'],
            help: '智日未來科技可協助初步了解申請條件、整理文件與釐清 AI 培訓需求，並協助聯繫官方窗口；可提供的課程與服務須以分署核定及委託安排為準。',
            note: '具自行辦訓能力（含已有人資部門、相關職務或顧問訓練服務等）的企業，可能不提供後續課程服務，須由分署認定。同年度不得重複使用其他政府企業在職訓練補助。',
            links: [['115 年度受理公告（北分署）', 'https://tkyhkm.wda.gov.tw/News_Content.aspx?n=485942419332C50C&s=68FCB104DDDE5533'], ['官方資格與課程說明', 'https://yct168.wda.gov.tw/cp.aspx?Create=1&n=376515AD018ED4B2'], ['法規與申請條件', 'https://laws.mol.gov.tw/FLAW/PrintFLAWDOC01.aspx?flno=7&id=FL072135'], ['官方申請與分署查詢入口', 'https://onjobtraining.wda.gov.tw/']]
        },
        {
            id: 'enterprise-human-resources', category: 'training', title: '企業人力資源提升計畫（大人提）',
            checked: '2026/10/14', agency: '勞動部勞動力發展署雲嘉南分署（本期已查受理公告）', label: '雲嘉南第 3 梯次', amount: '個別型最高 95 萬元',
            status: '雲嘉南公告受理至 10/16', deadline: '2026-10-16',
            period: '本頁收錄雲嘉南分署 115 年度第 3 梯次：2026/10/01–10/16（以郵戳為憑）。核定次日起辦訓，須於 2026/11/25 前完成。其他轄區須另查當地分署公告。',
            summary: '支持企業規劃員工年度訓練，可評估 AI 應用內訓；本期收錄雲嘉南分署仍在受理的梯次。',
            audience: '本期雲嘉南轄區為臺南市、雲林縣、嘉義縣市。民營事業機構、非營利法人或團體，就保人數 51 人以上；未滿 51 人者須符合有效 TTQS／辦訓能力檢核、特定獲獎或小人提轉銜等條件。',
            funding: '個別型上限 95 萬元、聯合型上限 190 萬元；符合特定資格的產業推升型上限 200 萬元。外訓一般補助 50%，符合政策性課程或指定派訓對象等條件可提高至 70%；內訓費用依核定科目與標準編列。',
            scope: '可依員工職務需求規劃 AI 文書、資料分析、行銷或工作流程訓練，納入年度訓練計畫送審；是否符合政策性課程及提高補助比例，由分署審查認定。',
            steps: ['確認企業所在地的受理梯次、就保人數及申請類型；其他轄區勿直接套用雲嘉南期限。', '在官方資訊系統提交年度訓練計畫、課程與預算，次日起 5 個工作日內且在受理期內，向分署送交相關申請文件。', '核定後依計畫辦訓，保留出席、講師、付款及成果資料，依規定申請核銷。'],
            help: '智日未來科技可協助企業評估 AI 內訓方向、規劃課程與成果指標、整理提案文件及經費資料，並配合核定內容提供培訓服務。',
            note: '北分署與桃竹苗已查得的 115 年度第 2 次受理公告截止於 9/30；本頁不將其列為目前可申請。同一課程不得重複申領政府補助，實際補助額度以核定為準。',
            links: [['雲嘉南第 3 梯次最新受理公告', 'https://yct168.wda.gov.tw/News_Content.aspx?n=3457B06B7217EC61&s=087B09D58283363D&sms=9F8CD839BDD2F62F'], ['官方資格、額度與補助類型', 'https://yct168.wda.gov.tw/cp.aspx?n=2F613A9131680CCE'], ['官方申請與分署查詢入口', 'https://onjobtraining.wda.gov.tw/']]
        },
        {
            id: 'enterprise-ai', category: 'training', title: '服務業 AI 職能提升班－企業專班',
            agency: '經濟部商業發展署', label: '企業培訓補助', amount: '每班最高 75 萬元',
            status: '公告受理期間內', deadline: '2027-07-31', period: '受理至 2027/07/31；經費用罄可能提前停止。',
            summary: '從企業實際工作需求出發，規劃 AI 工具應用與實作內訓。',
            audience: '符合計畫指定服務業資格的企業，非專營培訓事業；可單家或 2–5 家聯合申請，每班至少 30 人。',
            funding: '每班補助上限 75 萬元，每家企業至多申請 2 班；每次申請 1 班，完課並核銷後始可再次申請。實際金額依審查核定。',
            scope: '可依企業營運痛點規劃 AI 應用培訓，結合內部數據與工作情境演練。',
            steps: ['確認行業資格與參訓人數。', '準備申請表、課程規劃、師資佐證及相關切結文件，透過官方系統送件。', '核定後依規定開班，完成培訓、成果報告及核銷。'],
            help: '智日未來科技可協助申請資格初評、培訓需求訪談、課程與實作規劃，以及申請資料整理。實際課程與執行方式依核定內容辦理。',
            note: '每班至少 30 小時，實作演練至少占 30%；請依最新申請須知確認參訓及核銷條件。',
            links: [['官方計畫與申請入口', 'https://serv.gcis.nat.gov.tw/AOCAI/enterprise']]
        },
        {
            id: 'public-ai', category: 'training', title: '服務業 AI 職能提升公開班',
            agency: '經濟部商業發展署', label: '免費培訓資源', amount: '符合資格者免學費',
            status: '依各班招生', period: '各班開課日期、報名期限與名額不同，請至官方課程入口查詢。',
            summary: '適合個人或少量員工進修，依工作需求選擇 AI 應用課程。',
            audience: '年滿 18 歲的本國籍服務業從業人員，以及符合規定的應屆畢業生、待業者或有意轉職服務業者。',
            funding: '符合資格者免學費，屬政府提供的培訓資源，並非發放給企業的現金補助。',
            scope: '依官方當期課程選擇 AI 工具、行銷及服務應用等主題。',
            steps: ['在官方網站查詢符合需求且仍招生的班別。', '依辦訓單位規定提交報名及資格資料。', '按課程規定完成出席、測驗與學習要求。'],
            help: '智日未來科技可協助釐清學習需求、查找合適的官方班別，以及整理報名所需資料。',
            note: '本頁介紹政府培訓資源；智日未來科技自有課程是否適用，須另確認是否為該計畫核定班別。',
            links: [['官方課程入口', 'https://serv.gcis.nat.gov.tw/AOCAI/'], ['資格與常見問題', 'https://serv.gcis.nat.gov.tw/AOCAI/contact']]
        },
        {
            id: 'workforce-ai', category: 'training', title: '產業人才投資方案－AI 相關課程',
            agency: '勞動部勞動力發展署', label: '個人學費補助', amount: '每人 3 年最高 10 萬元',
            status: '依核定班別招生', period: '依各核定班別的報名期限與剩餘名額辦理。',
            summary: '透過核定課程學習 AI 軟體應用，補助符合資格在職勞工的訓練費。',
            audience: '年滿 15 歲、符合方案投保及身分規定的在職勞工，須選擇政府核定課程。',
            funding: '依身分補助訓練費用 80% 或 100%，每人 3 年內累計最高 10 萬元；實際可用額度與核撥依官方規定。',
            scope: '可查詢 AI 文書、數據分析、行銷或程式應用等核定課程；非所有市售 AI 課程皆適用。',
            steps: ['查詢官方在職訓練課程及個人補助資格。', '依核定班別的報名規則與繳費方式完成報名。', '完成課程與規定條件，由辦訓單位依程序辦理補助。'],
            help: '智日未來科技可協助了解方案條件、評估 AI 學習方向，並整理申請或報名資料。',
            note: '這是個人訓練費補助；本公司課程並非一律可核銷，應以官方核定課程名單為準。',
            links: [['官方補助額度與計算方式', 'https://thmr.wda.gov.tw/News_Content.aspx?n=1A79903405D714E4&s=6B8BBC06EF5448C2&sms=6789F97D2E2677C3'], ['官方課程查詢', 'https://course.taiwanjobs.gov.tw/']]
        },
        {
            id: 'sbir-ai', category: 'software', title: '中央型 SBIR 小型企業創新研發計畫',
            agency: '經濟部中小及新創企業署', label: '創新研發補助', amount: '先期研究最高 150 萬元',
            status: '隨到隨受理', period: '採隨到隨受理，依官方最新申請須知及公告辦理。',
            summary: '適合具創新性與驗證目標的 AI 軟體、服務或自動化產品研發。',
            audience: '依法登記且符合中小企業認定標準的企業，須提出明確的創新研發內容、驗證目標與執行規劃。',
            funding: '個別申請：Phase 1 最高 150 萬元／6 個月；Phase 2 最高 600 萬元／1 年、1,200 萬元／2 年。補助與自籌經費依當期須知編列及審查核定。',
            scope: '可評估 AI 知識服務、資料分析或工作流程自動化產品研發；須具備技術或服務創新，單純購買、安裝現成軟體不等同創新研發。',
            steps: ['確認企業資格、研發階段與創新性。', '規劃研發工作、驗證指標、時程及經費，整理申請資料並在線上送件。', '配合審查，通過後依契約執行、查核及結案。'],
            help: '智日未來科技可協助 AI 軟體需求盤點、技術可行性評估、研發架構與驗證指標規劃，以及申請文件整理。',
            note: '本公司提供獨立諮詢與申請協助，並非政府委託代辦；核定與補助金額由主管機關審查決定。',
            links: [['官方計畫與資格', 'https://sbir.sme.gov.tw/sbir/info'], ['官方公告與申請入口', 'https://sbir.sme.gov.tw/']]
        },
        {
            id: 'hualien-ai', category: 'software', title: '馬太鞍在地產業 AI 輔導',
            agency: '經濟部產業發展署', label: '花蓮指定地區限定', amount: 'AI 軟體最高補助 10 萬元',
            status: '公告受理期間內', deadline: '2026-10-31', period: '受理至 2026/10/31，或經費用罄之日止。',
            summary: '結合診斷、人才培訓與指定 AI 軟體工具導入，協助在地業者。',
            audience: '具有稅籍登記，且登記所在地為花蓮縣光復鄉、鳳林鎮或萬榮鄉的在地業者或組織。',
            funding: '政府出資診斷輔導，該項免自籌款；提供 30 小時在職員工培訓。依診斷導入指定 AI 軟體工具，最高補助 10 萬元。',
            scope: '導入工具須屬雲市集工業館／AI 工具庫，並符合診斷結果與計畫規範。',
            steps: ['確認登記地、稅籍與過往受輔導情形。', '依官方要求備妥申請書與個人資料告知同意書，郵寄指定窗口。', '依核定安排完成診斷、培訓及工具導入。'],
            help: '智日未來科技可協助確認申請條件、盤點 AI 軟體需求、整理申請文件，並協助對接官方輔導窗口。',
            note: '已接受經濟部產業競爭力輔導團輔導者不得申請。本公司方案是否可納入，須確認指定工具資格。',
            links: [['官方計畫、文件與聯絡窗口', 'https://assist.nat.gov.tw/wSite/ct?ctNode=279&mp=2&xItem=291995']]
        }
    ];
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const active = plans.filter(plan => (!plan.deadline || today <= plan.deadline) && (!plan.deadlineAt || new Date().getTime() <= new Date(plan.deadlineAt).getTime()));
    const escape = value => value.replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
    const sources = plan => plan.links.map(([label, url]) => `<a class="subsidy-source" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span><span class="subsidy-sr-only">（另開分頁）</span></a>`).join('');
    const support = `<aside class="subsidy-support"><div><p class="subsidy-eyebrow">WISDOMDAYTECH · 申請協助</p><h2>讓補助資源，連結企業的 AI 需求</h2><p>智日未來科技可協助申請政府補助：從資格初評、課程與軟體需求規劃，到申請文件整理，陪你釐清適合的方案。</p><p class="subsidy-muted">歡迎提供產業別、登記地、員工人數與預計導入項目，讓我們協助評估。申請與核定仍依各主管機關規定，不保證獲補助。</p></div><a class="btn btn-primary" href="https://line.me/ti/p/@154gflfs" target="_blank" rel="noopener noreferrer">洽詢申請協助 ↗</a></aside>`;
    const categories = [
        ['training', '01', 'AI 培訓課程與人才培育', '企業內訓、免費公開班與個人學費補助，依參訓對象選擇適合的資源。'],
        ['software', '02', 'AI 軟體導入與應用專案', '聚焦 AI 軟體與服務應用；研發型補助與指定地區導入方案各有不同門檻。']
    ];
    const categoryRoute = category => `subsidy-category-${category}`;
    document.getElementById('subsidy-nav-menu').innerHTML = categories.map(([id, num, title]) => `<li class="subsidy-nav-category"><a href="#${categoryRoute(id)}">${title}</a></li>${active.filter(plan => plan.category === id).map(plan => `<li class="subsidy-nav-plan" data-category="${id}"><a href="#subsidy-${plan.id}">${plan.title}</a></li>`).join('')}`).join('');
    const cards = category => active.filter(plan => plan.category === category).map(plan => `<article class="subsidy-card"><div class="subsidy-card-top"><span class="subsidy-tag">${plan.label}</span><span class="subsidy-status">${plan.status}</span></div><h3>${plan.title}</h3><p class="subsidy-amount">${plan.amount}</p><p>${plan.summary}</p><p class="subsidy-period">${plan.period}</p><a class="btn btn-secondary" href="#subsidy-${plan.id}" aria-label="查看${plan.title}申請說明">查看申請說明 <span aria-hidden="true">→</span></a></article>`).join('');
    const overview = `<section id="subsidies" class="page-section subsidy-page" data-page-title="政府補助案申請"><div class="container"><header class="subsidy-hero"><p class="subsidy-eyebrow">AI TRAINING & SOFTWARE</p><h1>政府補助案申請</h1><p class="subsidy-intro">從培育 AI 人才，到導入軟體應用。<br>找到適合你的政府資源，讓智日未來科技協助你開始。</p><div class="subsidy-meta"><span>資料彙整更新 ${checked}</span><span>聚焦培訓與軟體應用</span></div></header><p class="subsidy-notice">依公告受理期間及持續辦理方案整理；班別名額、經費餘額與提前截止公告，請以官方網站為準。已知截止案件不列入。</p>${categories.map(([id, num, title, description]) => `<div class="subsidy-category"><div class="subsidy-category-heading"><span class="subsidy-number">${num}</span><div><h2><a class="subsidy-category-link" href="#${categoryRoute(id)}">${title} <span aria-hidden="true">→</span></a></h2><p>${description}</p></div></div><div class="subsidy-grid">${cards(id)}</div></div>`).join('')}${support}</div></section>`;
    const categoryPages = categories.map(([id, num, title, description]) => `<section id="${categoryRoute(id)}" class="page-section subsidy-page" data-page-title="${title}"><div class="container"><a class="subsidy-back" href="#subsidies">← 返回政府補助案申請</a><header class="subsidy-detail-header"><p class="subsidy-eyebrow">政府補助案申請 · ${num}</p><h1>${title}</h1><p>${description}</p><p class="subsidy-muted">資料彙整更新：${checked}；實際受理狀態以官方公告為準。</p></header><div class="subsidy-grid">${cards(id)}</div>${support}</div></section>`).join('');
    const details = plans.map(plan => {
        const checked = plan.checked || '2026/10/22';
        const isActive = active.includes(plan);
        return `<section id="subsidy-${plan.id}" class="page-section subsidy-page" data-page-title="${plan.title}"><div class="container subsidy-detail"><a class="subsidy-back" href="#subsidies">← 返回政府補助案申請</a>${isActive ? `<header class="subsidy-detail-header"><span class="subsidy-tag">${plan.label}</span><h1>${plan.title}</h1><p>${plan.summary}</p><p class="subsidy-muted">主管單位：${plan.agency} · 資料查核：${checked}</p></header><dl class="subsidy-facts"><div><dt>補助／資源</dt><dd>${plan.amount}</dd></div><div><dt>申請狀態</dt><dd>${plan.status}</dd></div></dl><div class="subsidy-detail-grid"><article class="subsidy-panel"><h2>誰適合申請</h2><p>${plan.audience}</p><h2>補助內容</h2><p>${plan.funding}</p><h2>AI 培訓／軟體應用方向</h2><p>${plan.scope}</p><h2>如何申請</h2><ol>${plan.steps.map(step => `<li>${step}</li>`).join('')}</ol></article><aside class="subsidy-panel subsidy-sidebar"><h2>申請時間</h2><p>${plan.period}</p><h2>官方原始資料</h2><div class="subsidy-sources">${sources(plan)}</div><p class="subsidy-muted">金額均為新臺幣。名額、申請文件及可核銷項目，以最新官方公告為準。</p><h2>申請前請留意</h2><p>${plan.note}</p></aside></div><div class="subsidy-service"><h2>智日未來科技可以怎麼協助你？</h2><p>${plan.help}</p></div>${support}` : `<header class="subsidy-detail-header"><h1>此方案已結束受理</h1><p>請返回補助專區查看其他方案。</p></header>`}</div></section>`;
    }).join('');
    document.querySelector('main').insertAdjacentHTML('beforeend', overview + categoryPages + details);
})();
