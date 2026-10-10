import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', 'vite.ux.config.ts', '--host', '127.0.0.1'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;
try {
  // Readiness must be a real HTTP response, not a fragile stdout log
  // (Vite prints different address labels and formatting across environments).
  let startupError = '';
  server.stdout.on('data', data => { startupError += String(data); });
  server.stderr.on('data', data => { startupError += String(data); });
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const response = await fetch('http://127.0.0.1:5174/');
      if (response.ok) { ready = true; break; }
    } catch { /* ainda iniciando */ }
    if (server.exitCode !== null) break;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!ready) throw new Error('Servidor da prévia não respondeu em http://127.0.0.1:5174/. ' + startupError.slice(-1200));
  browser = await chromium.launch({ headless: true });
  await mkdir('.build/spec-ui', { recursive: true });
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => errors.push(error.message));
  const base = 'http://127.0.0.1:5174';
  const assertNoHorizontalOverflow = async (label) => {
    const size = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    assert.ok(size.scroll <= size.viewport + 2, label + ': overflow horizontal: ' + JSON.stringify(size));
  };

  for (const [w,h] of [[1440,900],[1024,768],[390,844]]) {
    await page.setViewportSize({ width:w, height:h });
    await page.goto(base + '/?scenario=liminar');
    await page.locator('.tasks-workspace-sidebar').waitFor();
    await page.locator('.tasks-execution-panel').waitFor();
    const boxes = await page.evaluate(() => {
      const sidebar = document.querySelector('.tasks-workspace-sidebar').getBoundingClientRect();
      const panel = document.querySelector('.tasks-execution-panel').getBoundingClientRect();
      return {left:sidebar.left,right:sidebar.right,answerLeft:panel.left,answerTop:panel.top,queueTop:sidebar.top};
    });
    if(w > 900) assert.ok(boxes.right <= boxes.answerLeft + 1, 'Fila continua à esquerda: ' + w);
    else assert.ok(boxes.queueTop <= boxes.answerTop, 'Fila acima das perguntas no mobile');
    await assertNoHorizontalOverflow('Workspace ' + w);
    await page.screenshot({ path:'.build/spec-ui/workspace-'+w+'.png', fullPage:true });
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+'/?scenario=liminar');
  await page.locator('.qa-step:not([hidden]) .task-question-number').waitFor();
  assert.equal(await page.locator('.qa-step:not([hidden]) .task-question-number').innerText(), 'A');
  const stepBefore = await page.locator('form[data-qa-progressive]').getAttribute('data-qa-index');
  await page.keyboard.press('1');
  assert.equal(await page.locator('form[data-qa-progressive]').getAttribute('data-qa-index'), stepBefore, 'Tecla numérica não avança automaticamente');
  await page.keyboard.press('Enter');
  const stepAfter = await page.locator('form[data-qa-progressive]').getAttribute('data-qa-index');
  assert.ok(Number(stepAfter) > Number(stepBefore), 'Enter avança depois de selecionar resposta');
  assert.equal(await page.locator('.qa-step:not([hidden]) .task-question-number').innerText(), 'B');

  for(const [w,h] of [[1440,900],[768,760],[390,844]]) {
    await page.setViewportSize({width:w,height:h});
    await page.goto(base+'/tarefas/atribuicoes');
    await page.locator('.assignments-board').waitFor();
    await page.getByRole('heading',{name:'Atribuições'}).waitFor();
    await page.getByText('Não atribuídas',{exact:true}).first().click();
    await page.locator('.assignments-table').waitFor();
    await assertNoHorizontalOverflow('Atribuições '+w);
    await page.screenshot({path:'.build/spec-ui/assignments-'+w+'.png',fullPage:true});
  }

  await page.setViewportSize({width:1440,height:900});
  await page.goto(base+'/tarefas/atribuicoes?fixture=assignments');
  await page.locator('.assignments-board').waitFor();
  await page.locator('.assignments-table tbody tr').first().locator('input[type="checkbox"]').waitFor();
  await page.locator('.assignments-table tbody tr').nth(0).locator('input[type="checkbox"]').check();
  await page.locator('.assignments-table tbody tr').nth(1).locator('input[type="checkbox"]').check();
  await page.locator('.assignments-bulk select').selectOption('fixture-analyst');
  await page.getByRole('button',{name:'Atribuir selecionadas'}).click();
  await page.locator('.assignments-notice').getByText(/1 atribuição\(ões\) confirmada\(s\)/).waitFor();
  await page.locator('.assignments-notice').getByText(/Não concluídas/).waitFor();
  await page.screenshot({path:'.build/spec-ui/assignments-partial-error.png',fullPage:true});

  for(const [w,h] of [[1440,900],[390,844]]) {
    await page.setViewportSize({width:w,height:h});
    await page.goto(base+'/login.html');
    await page.locator('#react-login-title').waitFor();
    assert.match(await page.locator('#react-login-title').innerText(), /^(Bom dia|Boa tarde|Boa noite)\./);
    assert.equal(await page.locator('.react-login-subtitle').innerText(),'Explore como estamos trabalhando!');
    await assertNoHorizontalOverflow('Login '+w);
    await page.screenshot({path:'.build/spec-ui/login-'+w+'.png',fullPage:true});
  }
  assert.deepEqual(errors, [], 'Não pode haver exceções JS em nenhuma das telas');
  console.log('UI: login, A/B/C, fila à esquerda, atribuições, 3 larguras e ausência de overflow validados.');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
