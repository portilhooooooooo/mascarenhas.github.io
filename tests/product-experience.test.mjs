import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// Exercise the deployable dist, not a replacement application. All remote calls
// are intercepted; fixture identities and records never reach an actual API.
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--outDir', 'dist', '--host', '127.0.0.1', '--port', '5175', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  let serverOutput = '';
  server.stdout.on('data', data => { serverOutput += String(data); });
  server.stderr.on('data', data => { serverOutput += String(data); });
  const startedAt = Date.now();
  while (true) {
    if (server.exitCode !== null) throw new Error(`Preview exited: ${server.exitCode}\n${serverOutput}`);
    try {
      const response = await fetch('http://127.0.0.1:5175/', { signal: AbortSignal.timeout(1000) });
      if (response.ok) break;
    } catch { /* server may not be listening yet */ }
    if (Date.now() - startedAt > 15000) throw new Error(`Preview did not start\n${serverOutput}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true, ...(process.env.UX_CHROMIUM_PATH ? { executablePath: process.env.UX_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-zygote', '--single-process'] } : {}) });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [], submissions = [], requests = [];
  let failSave = true;
  let delaySave = false;
  let releaseSave;
  const task = { id: 'qa-closing', type: 'encerramento', title: 'QA — regressão de encerramentos', priority: 'medium', status: 'pending', total_processes: 2, completed_processes: 0 };
  const processes = [1, 2].map(i => ({ id: `qa-case-${i}`, task_id: task.id, case_number: `QA PROCESSO ${i}`, assignee_id: 'qa-user', folder: `QA ${i}`, party_name: 'Parte de teste', status: 'pending', position: i, source: 'datajud', indicio: 'Indício recebido na fixture', updated_at: '2026-10-09T18:00:00Z' }));
  const permissions = { 'tasks.view': true, 'tasks.execute': true, 'tasks.manage': true, 'tasks.view_others': true, 'dashboard.view': true, 'pagamentos.view': true, 'tutelas.view': true, 'encerramentos.view': true, 'automations.view': true };
  const portfolios = [{ id: 'agibank_mba', operator_name: 'MBA' }, { id: 'agibank_enter', operator_name: 'Enter' }];
  const profile = { id: 'qa-user', name: 'Usuário QA', email: 'qa@example.test', is_master_admin: true, role: 'admin', permissions, portfolios, default_portfolio_id: 'agibank_mba' };
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem('mba_session_token')) localStorage.setItem('mba_session_token', 'qa-fixture-token');
    if (!localStorage.getItem('mba_portfolio_id')) localStorage.setItem('mba_portfolio_id', 'agibank_mba');
  });
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url());
    if (url.hostname === '127.0.0.1') return route.continue();
    if (url.hostname !== 'api.portilhobackoffice.site') return route.fulfill({ contentType: 'application/javascript', body: url.hostname === 'unpkg.com' ? 'window.lucide={createIcons(){}};' : '' });
    requests.push({ path: url.pathname, portfolio: request.headers()['x-portfolio-id'] });
    let body = [], status = 200;
    if (url.pathname === '/api/me') body = profile;
    else if (url.pathname === '/api/tasks') body = [task];
    else if (url.pathname.endsWith('/processes')) body = processes;
    else if (url.pathname.endsWith('/encerramento-analysis')) {
      const answers = request.postDataJSON(); submissions.push({ path: url.pathname, answers });
      if (delaySave) await new Promise(resolve => { releaseSave = resolve; });
      if (failSave) { status = 422; body = { error: 'QA — validação recusada pelo servidor', code: 'QA_VALIDATION' }; }
      else { processes.find(item => url.pathname.includes(item.id)).status = 'completed'; task.completed_processes += 1; body = {}; }
    } else if (url.pathname === '/api/operacao/pagamentos/summary') body = { active_total: 0, statuses: {}, queues: {}, session: { state: 'idle' } };
    else if (url.pathname === '/api/operacao/pagamentos/items') body = { rows: [] };
    else if (url.pathname === '/api/protocolo/summary') body = { statuses: {}, session: { state: 'idle' } };
    else if (url.pathname === '/api/protocolo/items') body = { rows: [] };
    else if (url.pathname === '/api/operacao/encerramentos/dashboard') body = { carteira: 'Agibank Enter', indicadores: { consultados: 0, encontrados: 0, analisados: 0, ticket_medio: null, ticket_amostra: 0, aging_medio: null }, aging: [], estados: [], analistas: [], classificacoes: [], distribuicao_tipos: [], etapas: { etapa: 'validados', total: 0, tipos: [], aging: [], matriz: [], fonte: 'fixture', mensagem: 'QA', analistas: [] } };
    else if (url.pathname.endsWith('/resumo-mes-anterior')) body = { periodo_inicio: '2026-09-01', periodo_fim_exclusivo: '2026-10-01', enviados: 0, encerrados: 0, em_andamento: 0, fonte: 'fixture' };
    return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  await page.goto('http://127.0.0.1:5175/tarefas');
  await page.getByRole('heading', { name: 'QA PROCESSO 1', exact: true }).waitFor();
  const choose = async (group, answer) => page.getByRole('radiogroup', { name: group, exact: true }).getByText(answer, { exact: true }).click();
  await choose('closing-sentence', 'Improcedente');
  await page.locator('.execution-context summary').click();
  assert.equal(await page.locator('[name="closing-sentence"]:checked').inputValue(), 'improcedente', 'context inspection must preserve answers');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('mba:authenticated', { detail: { ...window.MBA_CURRENT_USER, permissions: { ...window.MBA_CURRENT_USER.permissions } } })));
  assert.equal(await page.locator('[name="closing-sentence"]:checked').inputValue(), 'improcedente', 'same-user revalidation must preserve answers');
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('.tasks-process-item').nth(1).click();
  assert.equal(await page.getByRole('heading', { name: 'QA PROCESSO 1', exact: true }).count(), 1);
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('.main-nav [data-page="dashboard"]').click();
  assert.ok(page.url().endsWith('/tarefas'), 'cancelled navigation must preserve URL');
  await page.getByRole('searchbox', { name: 'Buscar processo', exact: true }).fill('QA PROCESSO 2');
  assert.equal(await page.getByRole('heading', { name: 'QA PROCESSO 1', exact: true }).count(), 1, 'search must not erase an active draft');
  await page.getByRole('searchbox', { name: 'Buscar processo', exact: true }).fill('');
  await choose('closing-appeal', 'Não');
  await choose('closing-deadline-open', 'Não');
  await choose('closing-transit-confirmed', 'Sim');
  const save = page.getByRole('button', { name: 'Salvar e próximo', exact: true });
  await save.click();
  await page.getByRole('alert').filter({ hasText: 'QA — validação recusada' }).waitFor();
  assert.equal(await page.locator('[name="closing-sentence"]:checked').inputValue(), 'improcedente');
  assert.equal(submissions[0].answers.workflow_version, 2);
  assert.equal(submissions[0].answers.first_instance_merit, 'improcedente');
  assert.equal(submissions[0].answers.transit_date, null, 'no new calculation or transit date for victory');

  await mkdir('.build/product-qa', { recursive: true });
  for (const viewport of [{ width: 1920, height: 1080 }, { width: 1600, height: 900 }, { width: 1366, height: 768 }]) {
    await page.setViewportSize(viewport);
    for (const theme of ['sol', 'lua']) {
      await page.locator('.mba-theme-switch').evaluate((button, theme) => { if (document.documentElement.getAttribute('data-mba-theme') !== theme) button.click(); }, theme);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `.build/product-qa/tasks-${theme}-${viewport.width}.png` });
      const geometry = await page.locator('.execution-card').evaluate(card => ({ right: card.getBoundingClientRect().right, footer: card.querySelector('.task-renderer-footer').getBoundingClientRect().bottom, viewport: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth }));
      assert.equal(geometry.overflow, false);
      assert.ok(geometry.footer <= geometry.viewport + 2, 'primary action must stay in viewport');
    }
  }
  failSave = false; delaySave = true;
  await save.click();
  await page.waitForFunction(() => document.querySelector('.execution-save-state').textContent.includes('Aguardando'));
  page.once('dialog', dialog => dialog.accept());
  await page.locator('.tasks-process-item').nth(1).click();
  assert.equal(await page.getByRole('heading', { name: 'QA PROCESSO 1', exact: true }).count(), 1, 'in-flight save must block navigation');
  releaseSave();
  await page.getByRole('heading', { name: 'QA PROCESSO 2', exact: true }).waitFor();
  assert.equal(await page.locator('.task-question input:checked').count(), 0, 'next process must start clean');
  assert.equal(submissions.length, 2);

  await page.locator('.main-nav [data-page="acordos"]').click();
  await page.locator('#acordos .operacao-module-subnav').waitFor();
  assert.equal(await page.locator('#acordos .operacao-module-subnav').getByRole('button', { name: 'Protocolos', exact: true }).count(), 0, 'MBA portfolio must not expose Enter-only protocols');
  await page.locator('.sidebar-portfolio-trigger').click();
  assert.equal(await page.getByRole('menuitemradio', { name: /Nubank/ }).count(), 0);
  await page.getByRole('menuitemradio', { name: 'Agibank <> Enter', exact: true }).click();
  await page.locator('#acordos .operacao-module-subnav').getByRole('button', { name: 'Protocolos', exact: true }).waitFor();
  await page.locator('#acordos .operacao-module-subnav').getByRole('button', { name: 'Defesas', exact: true }).click();
  assert.ok(page.url().endsWith('/operacao/defesas'));
  await page.locator('#protocolo .operacao-module-subnav').getByRole('button', { name: 'Protocolos', exact: true }).click();
  assert.ok(page.url().endsWith('/operacao/protocolos'));
  await page.evaluate(() => window.MBA_NAVIGATE('analytics/encerramentos'));
  await page.getByRole('heading', { name: 'Encerramentos', exact: true }).waitFor();
  assert.equal(await page.getByText('Demonstração', { exact: true }).count(), 0);
  assert.equal(await page.locator('.closing-filter-row select').first().inputValue(), 'TODOS');
  assert.equal(await page.locator('.closing-filter-row').getByText('Carteira', { exact: true }).count(), 0, 'analytics must use the authorized global portfolio');
  assert.ok(requests.some(item => item.path.endsWith('/dashboard') && item.portfolio === 'agibank_enter'));
  assert.deepEqual(errors, []);
  console.log('PASS: deployable shell, Q&A payload, unsaved answers, server error/success, pending save, authorized portfolios, Operação routes, Sol/Lua and desktop geometry');
} finally { await browser?.close(); server.kill(); }
