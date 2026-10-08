import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--outDir', 'dist', '--host', '127.0.0.1', '--port', '5199', '--strictPort'], {
  cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview timeout')), 15000);
    server.stdout.on('data', chunk => {
      if (chunk.toString().includes('Local:')) { clearTimeout(timeout); resolve(); }
    });
    server.stderr.on('data', chunk => process.stderr.write(chunk));
    server.on('exit', code => { clearTimeout(timeout); reject(new Error('Preview stopped: ' + code)); });
  });
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const capturedHeaders = [];
  await page.route('**/api/**', async route => {
    capturedHeaders.push({ url: route.request().url(), id: route.request().headers()['x-portfolio-id'] });
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });
  await page.route('**/auth/**', route => route.fulfill({ status: 401, contentType: 'application/json', body: '{"error":"Teste de interface"}' }));
  await page.goto('http://127.0.0.1:5199/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.MBA_API?.configurePortfolios && !!window.MBA_PORTFOLIO_POLICY?.canAccess);
  assert.equal(await page.locator('.topbar .global-search').count(), 0);
  assert.equal(await page.locator('.topbar #portfolio-switcher').count(), 0, 'portfolio chooser must be removed from topbar');
  assert.equal(await page.locator('.sidebar #portfolio-switcher').count(), 1, 'portfolio chooser must be in sidebar');
  assert.equal(await page.locator('#tasks-nav-count').textContent(), '', 'task badge must not start with fake count');

  const portfolios = [
    { id: 'agibank_enter', client_name: 'Agibank', operator_name: 'Enter' },
    { id: 'agibank_mba', client_name: 'Agibank', operator_name: 'MBA' },
    { id: 'nubank_mba', client_name: 'Nubank', operator_name: 'MBA' },
    { id: 'banco_pan_mba', client_name: 'Banco Pan', operator_name: 'MBA' },
    { id: 'energisa_enter', client_name: 'Energisa', operator_name: 'Enter' },
    { id: 'nubank', client_name: 'Nubank', operator_name: 'Regular' },
  ];
  const permissions = {
    'dashboard.view': true, 'tasks.view': true, 'pagamentos.view': true,
    'automations.view': true, 'users.view': false,
  };
  await page.evaluate(({ portfolios, permissions }) => {
    localStorage.removeItem('mba_portfolio_id');
    const profile = { id: 'test', email: 'test@example.com', portfolios, default_portfolio_id: 'agibank_enter', permissions };
    window.MBA_CURRENT_USER = profile;
    window.MBA_API.configurePortfolios(portfolios, profile.default_portfolio_id);
    window.dispatchEvent(new CustomEvent('mba:profile-ready', { detail: profile }));
    window.dispatchEvent(new CustomEvent('mba:module-visibility-updated'));
  }, { portfolios, permissions });
  await page.evaluate(() => { document.body.classList.remove('auth-loading', 'auth-signed-out'); document.body.classList.add('auth-signed-in'); });
  await page.waitForSelector('.sidebar-client-section');
  assert.equal(await page.locator('.sidebar-client-title').textContent(), 'Clientes');
  const names = await page.locator('.sidebar-portfolio-option').allTextContents();
  assert.deepEqual(names.map(value => value.trim().replace(/^(AE|AM|NM|PM|EE)/, '')), [
    'Agibank <> Enter',
    'Agibank <> MBA',
    'Nubank <> MBA',
    'Pan <> MBA',
    'Energisa <> Enter',
  ]);
  assert.equal(await page.locator('.sidebar-portfolio-option[aria-pressed="true"]').count(), 1);
  assert.equal(await page.locator('.sidebar-portfolio-option[aria-pressed="true"]').getAttribute('aria-label'), 'Agibank <> Enter');
  assert.equal(await page.locator('.topbar .mba-react-select').count(), 0);
  assert.equal(await page.locator('.sidebar-portfolio-option[aria-label="Nubank <> Regular"]').count(), 0);
  // The server-provided memberships (not the static menu) gate visible entries.
  await page.evaluate(({ permissions }) => {
    const authorized = [
      { id: 'agibank_enter' },
      { id: 'nubank_mba' },
    ];
    const profile = { id: 'test', email: 'test@example.com', portfolios: authorized, default_portfolio_id: 'agibank_enter', permissions };
    window.MBA_CURRENT_USER = profile;
    window.MBA_API.configurePortfolios(authorized, profile.default_portfolio_id);
    window.dispatchEvent(new CustomEvent('mba:profile-ready', { detail: profile }));
  }, { permissions });
  await page.waitForFunction(() => document.querySelectorAll('.sidebar-portfolio-option').length === 2);
  assert.deepEqual(await page.locator('.sidebar-portfolio-option').evaluateAll(els => els.map(el => el.getAttribute('aria-label'))), [
    'Agibank <> Enter', 'Nubank <> MBA',
  ]);
  // Restore authorized alternatives for independent module-scope tests.
  await page.evaluate(({ portfolios, permissions }) => {
    const profile = { id: 'test', email: 'test@example.com', portfolios, default_portfolio_id: 'agibank_enter', permissions };
    window.MBA_CURRENT_USER = profile;
    window.MBA_API.configurePortfolios(portfolios, profile.default_portfolio_id);
    window.dispatchEvent(new CustomEvent('mba:profile-ready', { detail: profile }));
  }, { portfolios, permissions });
  await page.waitForFunction(() => document.querySelectorAll('.sidebar-portfolio-option').length === 5);
  await page.evaluate(() => document.querySelector('#sidebar-toggle').click());
  assert.equal(await page.locator('.sidebar-portfolio-label').first().evaluate(el => getComputedStyle(el).display), 'none');
  await page.evaluate(() => document.querySelector('#sidebar-toggle').click());

  assert.equal(await page.evaluate(() => window.MBA_PORTFOLIO_POLICY.canAccess('protocolo')), true);
  await page.evaluate(() => window.MBA_API.setPortfolioId('agibank_mba'));
  assert.equal(await page.evaluate(() => window.MBA_PORTFOLIO_POLICY.canAccess('protocolo')), false);
  assert.equal(await page.locator('[data-page="protocolo"]').getAttribute('data-mba-hidden'), 'true');
  assert.equal(await page.locator('[data-page="automacoes"]').getAttribute('data-mba-hidden'), 'true');
  await page.evaluate(() => window.MBA_API.fetch('/api/tasks'));
  assert.equal(capturedHeaders.at(-1)?.id, 'agibank_mba');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('mba:task-pending-count', { detail: { count: 7 } })));
  assert.equal(await page.locator('#tasks-nav-count').textContent(), '7');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('mba:task-pending-count', { detail: { count: 0 } })));
  assert.equal(await page.locator('#tasks-nav-count').getAttribute('hidden'), '');

  await page.locator('.sidebar-portfolio-option[aria-label="Pan <> MBA"]').evaluate(el => el.click());
  await page.waitForFunction(() => localStorage.getItem('mba_portfolio_id') === 'banco_pan_mba');
  console.log('PASS: sidebar has only five ordered portfolios, membership-gated options, active state, collapsed UI, scope and navigation');
} finally {
  await browser?.close();
  server.kill();
}
