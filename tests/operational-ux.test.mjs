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
  const installLocalCapture = async () => page.evaluate(() => {
    window.__uxSubmissions = [];
    const original = window.MBA_API.request;
    window.MBA_API.request = async (path, options) => {
      if (options?.method === 'POST' && !path.endsWith('/next-agreement')) {
        const body = options.body instanceof FormData ? {document_type: options.body.get('document_type')} : JSON.parse(options.body || '{}');
        window.__uxSubmissions.push({path, body});
        if (path.endsWith('/stage')) return {};
        throw new Error('Falha simulada: nenhum dado real foi gravado.');
      }
      return original(path, options);
    };
  });
  const submissions = () => page.evaluate(() => window.__uxSubmissions);
  const openScenario = async scenario => {
    await page.setViewportSize({width:1600,height:900});
    await page.goto(`http://127.0.0.1:5174/?scenario=${scenario}`);
    await page.locator('.execution-brief').waitFor();
    await installLocalCapture();
  };
  await openScenario('liminar');
  const liminarSubmit = page.getByRole('button', {name:'Registrar resultado e continuar',exact:true});
  assert.equal(await liminarSubmit.isEnabled(), false);
  await page.getByText('Não foi possível analisar', {exact:true}).click();
  assert.equal(await liminarSubmit.isEnabled(), false);
  await page.getByLabel('Observações', {exact:false}).fill('Decisão indisponível para conferência.');
  await liminarSubmit.click();
  await page.getByRole('alert').waitFor();
  assert.deepEqual((await submissions())[0].body, {decision:'erro',notes:'Decisão indisponível para conferência.'});
  await page.getByText('Deferida', {exact:true}).click();
  await page.locator('.execution-review').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${shots}/liminar-review.png`});

  await openScenario('comprovante_pagamento');
  await page.getByText('Foi pago', {exact:true}).click();
  await page.getByText('Com comprovante', {exact:true}).click();
  await page.getByRole('radiogroup',{name:'manifested',exact:true}).getByText('Não',{exact:true}).click();
  await page.getByLabel('Justificativa', {exact:false}).fill('Comprovante localizado, manifestação pendente.');
  await page.getByRole('radiogroup',{name:'had-block',exact:true}).getByText('Não',{exact:true}).click();
  await page.getByRole('button',{name:'Registrar análise e continuar',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const payment = (await submissions())[0].body;
  assert.equal(payment.workflow_version,2);
  assert.equal(payment.payment_status,'pago');
  assert.equal(payment.paid_receipt,'com_comprovante');
  assert.equal(payment.manifested_in_court,false);
  assert.equal(payment.had_block,false);
  await page.locator('.execution-review').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${shots}/payment-review.png`});

  await openScenario('defesa');
  await page.locator('.defesa-flow-question').filter({hasText:'O fatal recebido corresponde'}).getByRole('button',{name:'Não',exact:true}).click();
  await page.locator('.defesa-flow-question').filter({hasText:'Existe prazo de defesa'}).getByRole('button',{name:'Não',exact:true}).click();
  await page.getByRole('button',{name:'Processo tem sentença',exact:true}).click();
  await page.getByRole('button',{name:'Registrar análise e continuar',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const defense = (await submissions())[0].body;
  assert.equal(defense.workflow_version,2);
  assert.equal(defense.decision,'inapto');
  assert.equal(defense.reason,'sentenca');
  assert.equal(defense.fatal_deadline,null);
  await page.locator('.execution-review').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${shots}/defense-review.png`});

  await openScenario('protocolo');
  assert.equal(await page.getByRole('button',{name:'Registrar coleta e continuar',exact:true}).isEnabled(),false);
  await page.getByText('Não consegui reunir os documentos',{exact:true}).click();
  await page.getByText('Defesa não localizada',{exact:true}).click();
  await page.getByRole('textbox',{name:/Justificativa/}).fill('Defesa não localizada na pasta do processo.');
  await page.getByRole('button',{name:'Registrar impedimento e continuar',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const collection = (await submissions())[0];
  assert.ok(collection.path.endsWith('/protocol-collection-error'));
  assert.equal(collection.body.reason,'DEFESA_AUSENTE');
  await page.getByRole('button',{name:'Voltar para a coleta de documentos',exact:true}).click();
  const pdf = {name:'defesa-demo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')};
  await page.locator('.protocol-native-file').nth(0).setInputFiles(pdf);
  await page.locator('.protocol-native-file').nth(1).setInputFiles({...pdf,name:'protocolo-demo.pdf'});
  await page.getByRole('button',{name:'Registrar coleta e continuar',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const docs = await submissions();
  assert.equal(docs[1].body.document_type,'DEFESA');
  assert.equal(docs[2].body.document_type,'PROTOCOLO');
  assert.ok(docs[3].path.endsWith('/protocol-collection/commit'));
  await page.locator('.execution-review').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${shots}/protocol-review.png`});

  await openScenario('acordos');
  await page.getByRole('radiogroup',{name:'has-agreement',exact:true}).getByText('Sim',{exact:true}).click();
  await page.getByRole('button',{name:'Registrar análise e continuar',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const agreement = (await submissions())[0].body;
  assert.equal(agreement.has_agreement,true);
  assert.equal(agreement.has_judgment,false);
  assert.equal(agreement.needs_support,false);
  await page.locator('.execution-review').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${shots}/agreement-review.png`});
  for (const scenario of ['liminar','defesa','comprovante_pagamento','protocolo','acordos']) {
    for (const width of [1920,1366,390]) {
      await page.setViewportSize({width,height:width===1920?1080:900});
      await page.goto(`http://127.0.0.1:5174/?scenario=${scenario}`);
      await page.locator('.execution-brief').waitFor();
      await page.screenshot({path:`${shots}/${scenario}-${width}.png`});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false,`${scenario} overflow at ${width}`);
    }
  }
  assert.deepEqual(errors, [], 'No browser errors');
  assert.deepEqual(outbound, [], 'Demo must remain isolated from production');
  console.log('Operational UX interactions and responsive checks passed; no external requests.');
} finally {
  await browser?.close();
  server.kill();
}
