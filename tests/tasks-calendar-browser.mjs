// Weekly/Monthly + card contextual: abertura, preenchimento, salvamento e retorno à view.
// Usa a prévia isolada (ux-preview): nenhuma API real é acessada.
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const port = 5177;
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', 'vite.ux.config.ts', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
const log = (...args) => console.log('PASS', ...args);
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('vite timeout')), 25000);
    server.stdout.on('data', d => { if (d.toString().includes('Local:')) { clearTimeout(timeout); resolve(); } });
    server.on('exit', c => { clearTimeout(timeout); reject(new Error('vite exited ' + c)); });
  });
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const writes = [];
  // A prévia não define prazos por processo nem aceita gravações: simulamos só isso.
  await page.addInitScript(() => {
    let api;
    Object.defineProperty(window, 'MBA_API', {
      configurable: true,
      get: () => api,
      set: value => {
        const original = value.request;
        const day = offset => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toISOString().slice(0, 10); };
        api = { ...value, request: async (path, options) => {
          if (options?.method === 'POST') {
            (window.__writes ||= []).push({ path, method: options.method });
            return {};
          }
          const result = await original(path, options);
          if (/\/api\/tasks\/[^/]+\/processes/.test(path) && Array.isArray(result)) {
            return result.map((row, i) => ({ ...row, deadline_at: i >= result.length - 2 ? null : day((i % 9) - 3) }));
          }
          return result;
        } };
      },
    });
  });
  await page.goto(`http://127.0.0.1:${port}/?scenario=liminar`);
  await page.locator('.tcal').waitFor();
  await page.locator('.tcal-item').first().waitFor();

  assert.equal(await page.locator('.task-agenda-header').count(), 0);
  assert.equal(await page.locator('.tcal-weekly').count(), 1);
  assert.equal(await page.locator('.tcal-kanban-column').count(), 7);
  assert.equal(await page.locator('.tcal-kanban').count(), 1);
  assert.equal(await page.locator('.tcal-grid').count(), 0);
  assert.ok(await page.locator('.tcal-kanban-column .tcal-item').count() > 0);
  assert.equal(await page.locator('.tasks-workspace-sidebar').count(), 0);
  log('Weekly abre com 7 colunas Kanban e', await page.locator('.tcal-item').count(), 'itens visíveis');

  // Sem prazo fica acessível pelo filtro, sem seção paralela por padrão.
  assert.equal(await page.locator('.tcal-undated-view').count(), 0);
  assert.equal(await page.locator('.tcal-count').count(), 0);
  assert.equal(await page.locator('.tcal-kanban-empty').count(), 0);
  await page.getByLabel('Prazo', {exact:true}).selectOption('undated');
  assert.equal(await page.locator('.tcal-undated-items .tcal-item').count(), 2);
  await page.locator('.tcal-undated-items .tcal-item').first().click();
  await page.locator('.task-card-shell[role="dialog"]').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.task-card-shell[role="dialog"]').waitFor({state:'detached'});
  assert.equal(await page.getByLabel('Prazo', {exact:true}).inputValue(), 'undated');
  await page.getByLabel('Prazo', {exact:true}).selectOption('dated');
  log('Sem prazo: filtro e execução acessíveis sem poluir o calendário');

  await page.getByRole('button', { name: 'Monthly' }).click();
  await page.locator('.tcal-monthly').waitFor();
  assert.ok(await page.locator('.tcal-day').count() >= 28);
  log('Monthly abre com', await page.locator('.tcal-day').count(), 'células e mesma fila (24)');
  await page.getByRole('button', { name: 'Weekly' }).click();
  await page.locator('.tcal-weekly').waitFor();

  // Período: avançar uma semana e voltar para hoje.
  const label0 = await page.locator('.tcal-nav strong').innerText();
  await page.getByRole('button', { name: 'Próxima semana' }).click();
  const label1 = await page.locator('.tcal-nav strong').innerText();
  assert.notEqual(label0, label1);
  await page.getByRole('button', { name: 'Hoje' }).click();
  assert.equal(await page.locator('.tcal-nav strong').innerText(), label0);
  log('navegação de período e Hoje');

  // Filtro: busca preservada ao abrir/fechar.
  await page.locator('.tasks-process-search input').fill('DEMO 0005');
  await page.waitForTimeout(200);
  assert.equal(await page.locator('.tcal-item').count(), 1);
  await page.locator('.tasks-process-search input').fill('');
  await page.getByRole('button', { name: 'Próxima semana' }).click();
  const periodBefore = await page.locator('.tcal-nav strong').innerText();
  const url = page.url();
  const pagesBefore = browser.contexts()[0].pages().length;

  await page.locator('.tasks-process-search input').fill('DEMO 00');
  const item = page.locator('.tcal-item').first();
  const caseNumber = (await item.locator('strong').innerText()).trim();
  const searchBefore = await page.locator('.tasks-process-search input').inputValue();

  // Abertura pela agenda, sem fila lateral duplicada.
  const calendarItem = page.locator('.tcal-item', { hasText: caseNumber }).first();
  await calendarItem.click();
  const dialog = page.locator('.task-card-shell[role="dialog"]');
  await dialog.waitFor();
  assert.equal(page.url(), url, 'não pode trocar de rota');
  assert.equal(browser.contexts()[0].pages().length, pagesBefore, 'não pode abrir aba');
  assert.ok(await dialog.locator('.execution-card').count());
  assert.match(await dialog.innerText(), new RegExp(caseNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  log('card abre na própria view:', caseNumber);

  await page.screenshot({ path: '/tmp/tcal-card.png' });
  // Esc fecha e devolve o foco; período, modo, busca e posição se mantêm.
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  assert.equal(await page.locator('.tcal-nav strong').innerText(), periodBefore);
  assert.equal(await page.locator('.tasks-process-search input').inputValue(), searchBefore);
  log('Esc fecha, período e filtro preservados');

  // Reabre, responde e salva pelo fluxo existente.
  await calendarItem.click();
  await dialog.waitFor();
  const layoutBefore = await dialog.boundingBox();
  await dialog.getByText('Não', { exact: true }).first().click();
  const save = dialog.getByRole('button', { name: 'Salvar e próximo' });
  await save.waitFor();
  await page.waitForFunction(() => !document.querySelector('.task-card-shell button[type="submit"]')?.disabled);
  const layoutAfter = await dialog.boundingBox();
  assert.ok(Math.abs(layoutBefore.height - layoutAfter.height) < 2 && Math.abs(layoutBefore.width - layoutAfter.width) < 2, 'card não pode mudar de tamanho ao responder');
  await save.click();
  await dialog.waitFor({ state: 'detached' });
  const writesNow = await page.evaluate(() => window.__writes || []);
  assert.ok(writesNow.some(w => /liminar-validation$/.test(w.path)), JSON.stringify(writesNow));
  log('salvou via', writesNow.find(w => /liminar-validation$/.test(w.path)).path);

  // Estado atualizado: item concluído sai da fila; período, modo e busca intactos.
  assert.equal(await page.locator('.tcal-nav strong').innerText(), periodBefore);
  assert.equal(await page.locator('.tcal-weekly').count(), 1);
  assert.equal(await page.locator('.tasks-process-search input').inputValue(), searchBefore);
  assert.equal(await page.locator('.tcal-item', { hasText: caseNumber }).count(), 0);
  log('retorno à view com estado atualizado:', caseNumber, 'saiu da fila');

  // Analytics permanece como submódulo.
  assert.equal(await page.locator('.tasks-react-subnav button', { hasText: 'Analytics' }).count(), 1);
  assert.equal(await page.locator('.tasks-react-subnav button', { hasText: 'Produtividade' }).count(), 0);
  assert.equal(await page.locator('.tasks-react-subnav button').count(), 2);
  assert.equal(await page.locator('.task-agenda-actions button', { hasText: 'Atribuições' }).count(), 1);
  log('duas abas e acesso gerencial preservado');
  await page.screenshot({ path: '/tmp/tcal-weekly.png' });
  await page.getByRole('button', { name: 'Monthly' }).click();
  await page.screenshot({ path: '/tmp/tcal-monthly.png' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 4);
  assert.equal(overflow, false);
  log('sem overflow horizontal');
} finally {
  await browser?.close();
  server.kill('SIGTERM');
}
