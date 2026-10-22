const { chromium } = require('C:/Users/HAYA/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({headless: true, channel: 'msedge'});
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 // Freeze the audit date so later deadlines do not make this check brittle.
 await page.addInitScript(() => { const OriginalDate=Date; window.Date=class extends OriginalDate { constructor(...a){super(...(a.length?a:['2026-10-22T12:00:00+08:00']));} }; });
 await page.route('https://**/*', route => route.abort());
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/#subsidies');
 await page.locator('#subsidies.active').waitFor();
 assert.equal(await page.locator('#subsidies .subsidy-card').count(),6);
 assert.equal(await page.locator('#subsidies a[href="#subsidy-enterprise-human-resources"]').count(),0);
 assert.equal(await page.locator('.nav-menu > li:has(a[href="#subsidies"]) + li a').textContent(),'關於我們');
 const links=await page.locator('#subsidies .subsidy-card > a').evaluateAll(as=>as.map(a=>a.hash));
 for(const hash of links) {
  await page.goto('http://127.0.0.1:8765/'+hash);
  await page.locator(hash+'.active').waitFor();
  assert.equal(await page.locator('.page-section.active').count(),1);
  assert.ok((await page.title()).includes(await page.locator(hash+' h1').textContent()));
  assert.ok(await page.locator(hash+' .subsidy-source').count());
  await page.reload(); await page.locator(hash+'.active').waitFor();
  await page.locator(hash+' .subsidy-back').click();
  await page.locator('#subsidies.active').waitFor();
  await page.goBack(); await page.locator(hash+'.active').waitFor();
  await page.goForward(); await page.locator('#subsidies.active').waitFor();
 }
 for(const category of ['training','software']) {
  await page.goto('http://127.0.0.1:8765/#subsidy-category-'+category);
  await page.locator('#subsidy-category-'+category+'.active').waitFor();
  assert.equal(await page.locator('#subsidy-category-'+category+' .subsidy-card').count(),category==='training'?4:2);
  await page.reload();
  await page.locator('#subsidy-category-'+category+'.active').waitFor();
 }
 for(const width of [1440,1024,900,769,768,390,360]) {
  console.log('viewport',width);
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:8765/#subsidies');
  await page.locator('#subsidies.active').waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);
  if(width>768){
   const centers=await page.locator('.nav-menu > .nav-item > a, .nav-menu > .nav-item > .nav-dropdown-heading > a').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width).map(e=>{const r=e.getBoundingClientRect();return r.top+r.height/2}));
   assert.ok(Math.max(...centers)-Math.min(...centers)<1,`nav alignment ${width}: ${centers}`);
   const boxes=await page.locator('.header .logo, .header .nav-menu, .header .theme-toggle').evaluateAll(es=>es.map(e=>({left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})));
   assert.ok(boxes[0].right<=boxes[1].left && boxes[1].right<=boxes[2].left,`header overlap ${width}`);
  } else {
   await page.locator('.mobile-menu-toggle').click();
   for(const id of ['regular-course-menu','enterprise-course-menu','subsidy-nav-menu']) {
    const toggle=page.locator(`[aria-controls="${id}"]`);
    const original=page.url();
    assert.ok(!(await page.locator('#'+id).isVisible()));
    await toggle.click();
    assert.ok(await page.locator('#'+id).isVisible());
    assert.equal(page.url(),original);
    await toggle.click();
    assert.ok(!(await page.locator('#'+id).isVisible()));
    assert.equal(await toggle.getAttribute('aria-expanded'),'false');
   }
   await page.locator('[aria-controls="subsidy-nav-menu"]').click();
   assert.equal(await page.locator('#subsidy-nav-menu [data-nav-toggle]').count(),0);
   for(const category of ['training','software']) {
    const plans=page.locator(`#subsidy-nav-menu > .subsidy-nav-plan[data-category="${category}"] > a`);
    assert.equal(await plans.count(),category==='training'?4:2);
    for(const plan of await plans.all()) assert.ok(await plan.isVisible());
   }
   await page.locator('.nav-menu a[href="#subsidies"]').click();
   assert.ok(!(await page.locator('.nav-menu').evaluate(e=>e.classList.contains('active'))));
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.waitForTimeout(700);
 await page.screenshot({path:'subsidies-desktop.png',fullPage:true});
 await page.locator('#theme-toggle').click();
 await page.waitForTimeout(700);
 await page.screenshot({path:'subsidies-light.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:8765/#subsidy-enterprise-ai');
 await page.locator('#subsidy-enterprise-ai.active').waitFor();
 await page.waitForTimeout(700);
 assert.ok(await page.locator('.header').evaluate(e=>e.getBoundingClientRect().height<150));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'subsidies-mobile.png',fullPage:true});
 const touch = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await touch.route('https://**/*', route=>route.abort());
 await touch.goto('http://127.0.0.1:8765/#subsidies');
 await touch.locator('.mobile-menu-toggle').tap();
 await touch.locator('[aria-controls="subsidy-nav-menu"]').tap();
 assert.equal(await touch.locator('#subsidy-nav-menu > li > a').count(),8);
 for(const link of await touch.locator('#subsidy-nav-menu > li > a').all()) assert.ok(await link.isVisible());
 await touch.screenshot({path:'subsidies-navigation-mobile.png'});
 await touch.locator('.subsidy-nav a[href="#subsidy-category-training"]').tap();
 await touch.locator('#subsidy-category-training.active').waitFor();
 await touch.locator('.mobile-menu-toggle').tap();
 await touch.locator('[aria-controls="subsidy-nav-menu"]').tap();
 await touch.locator('.subsidy-nav-plan a[href="#subsidy-enterprise-ai"]').tap();
 await touch.locator('#subsidy-enterprise-ai.active').waitFor();
 assert.equal(await touch.locator('.mobile-menu-toggle').getAttribute('aria-expanded'),'false');
 await touch.close();
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:8765/#course-cluade-master');
 await page.locator('#course-detail.active').waitFor();
 assert.equal(await page.locator('#course-detail .course-title').textContent(),'Claude/Codex 全能 AI Agent 大師班');
 const courseText=await page.locator('#course-detail').innerText();
 for(const term of ['Chat','Cowork','Code','Claude/Codex','Claude Code／Codex']) assert.ok(courseText.includes(term),term);
 assert.ok(!courseText.includes('Sonnet／Haiku'));
 await page.waitForTimeout(650);
 await page.screenshot({path:'claude-codex-course-desktop.png'});
 await page.reload();
 await page.locator('#course-detail.active').waitFor();
 assert.ok((await page.title()).includes('Claude/Codex'));
 await page.goto('http://127.0.0.1:8765/#enterprise-training');
 await page.waitForTimeout(600);
 await page.screenshot({path:'navigation-aligned-desktop.png'});
 // A future visit must hide fixed-deadline programs and leave no application detail.
 await page.addInitScript(() => { const OriginalDate=Date; window.Date=class extends OriginalDate { constructor(...a){super(...(a.length?a:['2027-08-01T00:00:00+08:00']));} }; });
 await page.reload();
 await page.goto('http://127.0.0.1:8765/#subsidies');
 assert.equal(await page.locator('#subsidies .subsidy-card').count(),3);
 assert.equal(await page.locator('#subsidy-nav-menu .subsidy-nav-plan a').count(),3);
 await page.goto('http://127.0.0.1:8765/#subsidy-hualien-ai');
 assert.equal(await page.locator('#subsidy-hualien-ai h1').textContent(),'此方案已結束受理');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: 6 active subsidy routes, 2 categories, Claude/Codex course and reload, nav horizontal alignment, 7 widths, touch menus, expiry, no page errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
