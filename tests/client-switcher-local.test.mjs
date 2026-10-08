import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--outDir', 'dist', '--host', '127.0.0.1', '--port', '5199', '--strictPort'], {
  cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe']
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview timeout')), 15000);
    server.stdout.on('data', chunk => {
      if (chunk.toString().includes('Local:')) { clearTimeout(timeout); resolve(); }
    });
    server.stderr.on('data', chunk => process.stderr.write(chunk));
    server.on('exit', code => { clearTimeout(timeout); reject(new Error('Preview stopped: '+code)); });
  });
  browser = await chromium.launch({ headless: true, args:['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport:{width:1440,height:900} });
  const capturedHeaders=[];
  await page.route('**/api/**', async route => {
    capturedHeaders.push({url:route.request().url(), id:route.request().headers()['x-portfolio-id']});
    await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify([])});
  });
  await page.route('**/auth/**', route=>route.fulfill({status:401,contentType:'application/json',body:JSON.stringify({error:'Teste de interface'})}));
  await page.addInitScript(() => { window.lucide = {createIcons(){}}; });
  await page.goto('http://127.0.0.1:5199/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => !!window.MBA_API?.configurePortfolios);
  assert.equal(await page.locator('#global-search-input').count(),0,'Global process search must not appear in navbar');
  assert.equal(await page.locator('.topbar .global-search').count(),0);
  assert.equal(await page.locator('.topbar #client-select').count(),1,'Client selection must remain');
  assert.equal(await page.locator('.topbar #portfolio-select').count(),1,'Operation selection must remain');
  const portfolioList = [
    {id:'agibank_enter',client_name:'Agibank',operator_name:'Enter',display_name:'Agibank <> Enter'},
    {id:'agibank_mba',client_name:'Agibank',operator_name:'MBA',display_name:'Agibank <> MBA'},
    {id:'nubank_mba',client_name:'Nubank',operator_name:'MBA',display_name:'Nubank <> MBA'}
  ];
  await page.evaluate(portfolios=>{
    window.dispatchEvent(new CustomEvent('mba:authenticated', {detail:{portfolios,default_portfolio_id:'agibank_enter',permissions:{}}}));
  },portfolioList);
  const options = await page.locator('#client-select option').allTextContents();
  assert.deepEqual(options,['Agibank','Nubank']);
  assert.deepEqual(await page.locator('#portfolio-select option').allTextContents(),['Enter','MBA']);
  assert.equal(await page.locator('#client-select').isDisabled(),false);
  await page.evaluate(() => {window.MBA_API.setPortfolioId('agibank_mba')});
  await page.evaluate(() => window.MBA_API.fetch('/api/tasks'));
  assert.equal(capturedHeaders.at(-1)?.id,'agibank_mba','request must be scoped to selected portfolio');
  await page.evaluate(()=>{
    document.querySelector('#client-select').value='Nubank';
    document.querySelector('#client-select').dispatchEvent(new Event('change',{bubbles:true}));
  });
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => localStorage.getItem('mba_portfolio_id')), 'nubank_mba');
  await page.evaluate(portfolios=>{window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:{portfolios,default_portfolio_id:'agibank_enter',permissions:{}}}));}, portfolioList);
  assert.equal(await page.locator('#client-select').inputValue(),'Nubank');
  console.log('PASS: client separation, operation options, switch persistence, API header');
  await page.evaluate(() => localStorage.removeItem('mba_portfolio_id'));
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(() => !!window.MBA_API?.configurePortfolios);
  await page.evaluate(()=>{
    window.dispatchEvent(new CustomEvent('mba:authenticated', {detail:{portfolios:[{id:'banco_pan_mba',client_name:'Banco Pan',operator_name:'MBA',display_name:'Banco Pan <> MBA'}],default_portfolio_id:'banco_pan_mba',permissions:{}}}));
  });
  assert.deepEqual(await page.locator('#client-select option').allTextContents(),['Banco Pan']);
  assert.equal(await page.locator('#client-select').isDisabled(),true);
  assert.equal(await page.locator('#portfolio-select').isDisabled(),true);
  assert.equal(await page.evaluate(()=>window.MBA_API.getPortfolioId()), 'banco_pan_mba');
  console.log('PASS: user with one authorized client has no cross-client options');
} finally {
  await browser?.close();
  server.kill();
}
