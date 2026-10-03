import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', 'vite.ux.config.ts', '--host', '127.0.0.1'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview did not start')), 15000);
    server.stdout.on('data', data => {
      if (data.toString().includes('Local:')) { clearTimeout(timeout); resolve(); }
    });
    server.stderr.on('data', data => process.stderr.write(data));
    server.on('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited: ${code}`)); });
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.env.UX_CHROMIUM_PATH ? { executablePath: process.env.UX_CHROMIUM_PATH, args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-zygote', '--single-process'] } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [], outbound = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:5174')) outbound.push(request.url());
  });
  const shots = '.build/ux-qa';
  await mkdir(shots, { recursive: true });
  await page.goto('http://127.0.0.1:5174');
  await page.getByText('DEMO 0001 · SP', { exact: true }).first().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${shots}/tasks-1600.png` });

  // A user can reach work beyond the first five records.
  await page.getByRole('button', { name: 'Próximos', exact: true }).click();
  await page.getByText('DEMO 0006 · SP', { exact: true }).first().waitFor();
  await page.getByRole('button', { name: 'Anterior', exact: true }).click();

  // Choosing an empty filter must not silently change the selected filter.
  const emptyFilter = page.getByRole('button', { name: 'Em atraso 0', exact: true });
  await emptyFilter.click();
  await page.getByText('Nenhum processo neste filtro.').waitFor();
  assert.equal(await emptyFilter.getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Todos 13', exact: true }).click();
  await page.getByLabel('Buscar processo ou parte').fill('0003');
  await page.getByText('DEMO 0003 · SP', { exact: true }).first().waitFor();
  assert.equal(await page.locator('.tasks-process-item').count(), 2);
  await page.getByLabel('Buscar processo ou parte').fill('');

  await page.getByRole('button', { name: 'Controladoria', exact: true }).click();
  await page.getByRole('heading', { name: 'Fila de protocolos' }).waitFor();
  await page.screenshot({ path: `${shots}/control-1600.png` });
  await page.getByRole('button', { name: /Revisão necessária/ }).click();
  assert.equal(await page.locator('tbody tr').count(), 2);
  assert.equal(await page.getByRole('button', { name: 'Tentar novamente', exact: true }).isEnabled(), false);
  await page.getByText('Importar base e documentos', { exact: false }).click();
  await page.getByRole('heading', { name: 'Arquivo do Metabase' }).waitFor();
  await page.getByRole('button', { name: 'Defesas', exact: true }).click();
  await page.getByRole('heading', { name: 'Defesas', exact: true }).waitFor();
  await page.screenshot({ path: `${shots}/defesas-1600.png` });
  for (const width of [1920, 1366, 768, 390]) {
    await page.setViewportSize({ width, height: width === 1920 ? 1080 : 900 });
    await page.getByRole('button', { name: 'Tarefas', exact: true }).click();
    await page.screenshot({ path: `${shots}/tasks-${width}.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Tasks overflow at ${width}`);
    await page.getByRole('button', { name: 'Controladoria', exact: true }).click();
    await page.screenshot({ path: `${shots}/control-${width}.png` });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Controladoria overflow at ${width}`);
  }
  assert.deepEqual(errors, [], 'No browser errors');
  assert.deepEqual(outbound, [], 'Demo must remain isolated from production');
  console.log('Operational UX interactions and responsive checks passed; no external requests.');
} finally {
  await browser?.close();
  server.kill();
}
