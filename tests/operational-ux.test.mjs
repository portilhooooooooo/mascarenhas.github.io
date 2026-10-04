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
  await page.getByRole('button',{name:'Próximos',exact:true}).click();
  await page.locator('.tasks-process-item').filter({hasText:'DEMO 0006 · SP'}).click();
  await page.getByRole('heading', {name:'DEMO 0006 · SP',exact:true}).waitFor();


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
        if (path.endsWith('/stage') || path.endsWith('/skip')) return {};
        throw new Error('Falha simulada: nenhum dado real foi gravado.');
      }
      return original(path, options);
    };
  });
  const submissions = () => page.evaluate(() => window.__uxSubmissions);
  const openScenario = async scenario => {
    await page.setViewportSize({width:1600,height:900});
    await page.goto(`http://127.0.0.1:5174/?scenario=${scenario}`);
    await page.locator('.execution-process-heading').waitFor();
    await installLocalCapture();
  };
  const canvas = async () => { await page.locator('.task-renderer-footer').scrollIntoViewIfNeeded(); return page.locator('.tasks-workspace').evaluate(root => ({height:root.getBoundingClientRect().height, overflow:root.scrollWidth > root.clientWidth + 1})); };
  await openScenario('liminar');
  const shortHeight=await page.locator('.execution-card').evaluate(el=>el.getBoundingClientRect().height);
  const liminarSubmit = page.getByRole('button', {name:'Salvar e próximo',exact:true});
  assert.equal(await liminarSubmit.isEnabled(), false);
  const choose = async (group, answer) => page.getByRole('radiogroup',{name:group,exact:true}).getByText(answer,{exact:true}).click();
  await choose('liminar-requested','Não');
  assert.equal(await page.locator('.task-question').count(),1);
  await liminarSubmit.click(); await page.getByRole('alert').waitFor();
  assert.deepEqual((await submissions()).at(-1).body,{decision:'nao_solicitada',notes:null});
  for(const [decided, answer, expected] of [['Sim','Deferida','deferida'],['Sim','Indeferida','indeferida'],['Não','Sim','com_sentenca'],['Não','Não','sem_decisao']]) {
    await choose('liminar-requested','Não'); await choose('liminar-requested','Sim'); await choose('liminar-decided',decided);
    assert.equal(await liminarSubmit.isEnabled(),false);
    await choose(decided === 'Sim' ? 'liminar-result' : 'liminar-judgment', answer);
    await liminarSubmit.click(); await page.getByRole('alert').waitFor();
    assert.deepEqual((await submissions()).at(-1).body,{decision:expected,notes:null});
    assert.ok(await page.locator('.execution-card').evaluate(el=>el.getBoundingClientRect().height)>shortHeight+80,'Content grows naturally');
  }
  await choose('liminar-decided','Sim'); await choose('liminar-result','Deferida');
  await choose('liminar-decided','Não'); assert.equal(await page.getByRole('radiogroup',{name:'liminar-result',exact:true}).count(),0);
  assert.equal(await liminarSubmit.isEnabled(),false);
  await choose('liminar-requested','Não'); assert.equal(await page.locator('.task-question').count(),1);
  await page.screenshot({path:`${shots}/liminar-review.png`});

  await openScenario('comprovante_pagamento');
  await page.getByText('Foi pago', {exact:true}).click();
  await page.getByText('Com comprovante', {exact:true}).click();
  await page.getByRole('radiogroup',{name:'manifested',exact:true}).getByText('Não',{exact:true}).click();
  await page.getByLabel('Justificativa', {exact:false}).fill('Comprovante localizado, manifestação pendente.');
  await page.getByRole('radiogroup',{name:'had-block',exact:true}).getByText('Não',{exact:true}).click();
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const payment = (await submissions())[0].body;
  assert.equal(payment.workflow_version,2);
  assert.equal(payment.payment_status,'pago');
  assert.equal(payment.paid_receipt,'com_comprovante');
  assert.equal(payment.manifested_in_court,false);
  assert.equal(payment.had_block,false);
  await page.screenshot({path:`${shots}/payment-review.png`});

  await openScenario('defesa');
  await page.locator('.task-question').filter({hasText:'O fatal da Enter está correto'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.locator('.task-question').filter({hasText:'Existe prazo para apresentação de defesa'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Processo tem sentença',exact:true}).locator('..').click();
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const defense = (await submissions())[0].body;
  assert.equal(defense.workflow_version,3);
  assert.equal('decision' in defense,false);
  assert.equal('priority' in defense,false);
  assert.equal(defense.reason,'sentenca');
  assert.equal(defense.cpj_fatal_deadline,null);
  await page.screenshot({path:`${shots}/defense-review.png`});

  await openScenario('protocolo');
  assert.equal(await page.getByRole('button',{name:'Salvar e próximo',exact:true}).isEnabled(),false);
  await page.getByText('Não consegui reunir os documentos',{exact:true}).click();
  await page.getByText('Defesa não localizada',{exact:true}).click();
  assert.equal(await page.getByRole('textbox',{name:/Justificativa/}).count(),0);
  assert.equal(await page.getByRole('button',{name:'Salvar e próximo',exact:true}).isEnabled(),true);
  await page.getByText('Outro motivo',{exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Salvar e próximo',exact:true}).isEnabled(),false);
  await page.getByRole('textbox',{name:/Justificativa/}).fill('Texto que será descartado.');
  await page.getByText('Defesa não localizada',{exact:true}).click();
  assert.equal(await page.getByRole('textbox',{name:/Justificativa/}).count(),0);
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const collection = (await submissions())[0];
  assert.ok(collection.path.endsWith('/protocol-collection-error'));
  assert.equal(collection.body.reason,'DEFESA_AUSENTE');
  assert.equal(collection.body.notes,'Defesa não localizada');
  await page.getByText('Outro motivo',{exact:true}).click();
  assert.equal(await page.getByRole('textbox',{name:/Justificativa/}).inputValue(),'');
  await page.getByRole('textbox',{name:/Justificativa/}).fill('Documento incompatível com este processo.');
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click(); await page.getByRole('alert').waitFor();
  assert.equal((await submissions()).at(-1).body.reason,'OUTRO');
  assert.equal((await submissions()).at(-1).body.notes,'Documento incompatível com este processo.');
  await page.getByRole('button',{name:'Voltar para a coleta de documentos',exact:true}).click();
  const pdf = {name:'defesa-demo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')};
  await page.locator('.protocol-native-file').nth(0).setInputFiles(pdf);
  await page.locator('.protocol-native-file').nth(1).setInputFiles({...pdf,name:'protocolo-demo.pdf'});
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const docs = await submissions();
  assert.equal(docs[2].body.document_type,'DEFESA');
  assert.equal(docs[3].body.document_type,'PROTOCOLO');
  assert.ok(docs[4].path.endsWith('/protocol-collection/commit'));
  await page.screenshot({path:`${shots}/protocol-review.png`});

  await openScenario('acordos');
  await page.getByRole('radiogroup',{name:'has-agreement',exact:true}).getByText('Sim',{exact:true}).click();
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const agreement = (await submissions())[0].body;
  assert.equal(agreement.has_agreement,true);
  assert.equal(agreement.has_judgment,false);
  assert.equal(agreement.needs_support,false);
  await page.screenshot({path:`${shots}/agreement-review.png`});


  await openScenario('');
  await page.getByRole('button',{name:'Pular esse prazo',exact:true}).click();
  await page.getByRole('heading',{name:'DEMO 0002 · SP',exact:true}).waitFor();
  for(let i=0;i<4 && await page.getByRole('button',{name:'Próximos',exact:true}).isEnabled();i++) { await page.getByRole('button',{name:'Próximos',exact:true}).click(); await page.waitForTimeout(100); }
  assert.equal(await page.locator('.tasks-process-item').last().locator('strong').textContent(),'DEMO 0001 · SP','Skipped item at the end of the global queue');

  await openScenario('defesa');
  await page.locator('.task-question').filter({hasText:'O fatal da Enter está correto'}).getByRole('radio',{name:'Sim',exact:true}).locator('..').click();
  assert.equal(await page.getByRole('button',{name:'Salvar e próximo',exact:true}).isEnabled(),true);
  assert.equal(await page.locator('.defesa-flow-priority').count(),0);
  await page.locator('.task-question').filter({hasText:'O fatal da Enter está correto'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.locator('.task-question').filter({hasText:'Existe prazo para apresentação de defesa'}).getByRole('radio',{name:'Sim',exact:true}).locator('..').click();
  for(const name of ['Expedição de DJE','DJE Negativo','Expedição de Carta AR','Retorno de Carta AR','Audiência','Juntada de Habilitação']) await page.getByRole('button',{name,exact:true}).click();
  for(const input of await page.locator('.defesa-flow-criteria input').all()) await input.fill('2026-10-02');
  await page.getByLabel('Fatal Real registrado no CPJ').fill('2026-10-10');
  for(const width of [1920,1600,1366]) { await page.setViewportSize({width,height:900}); assert.equal((await canvas()).overflow,false,`All defense evidence fits at ${width}`); }
  await page.setViewportSize({width:1600,height:900});
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  const evidenceBody=(await submissions())[0].body;
  assert.equal(evidenceBody.criteria.length,6);
  assert.equal(evidenceBody.cpj_fatal_deadline,'2026-10-10');
  assert.equal('priority' in evidenceBody,false);
  await page.screenshot({path:`${shots}/defense-evidence.png`,fullPage:true});
  await page.locator('.task-question').filter({hasText:'Existe prazo para apresentação de defesa'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Suspenso',exact:true}).locator('..').click();
  assert.equal(await page.getByRole('radio',{name:'Suspenso',exact:true}).isChecked(),true);
  await page.getByRole('heading',{name:/Qual o tema da suspensão/}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Salvar e próximo',exact:true}).isEnabled(),false);
  await page.getByRole('radio',{name:'Tema 1414',exact:true}).locator('..').click();
  await page.screenshot({path:`${shots}/defense-suspension.png`,fullPage:true});
  assert.equal((await canvas()).overflow,false);

  await openScenario('acordos');
  for(const [group,answer] of [['has-agreement','Não'],['has-judgment','Não'],['has-impediment','Não'],['has-defense','Sim'],['has-obf','Sim']]) await page.getByRole('radiogroup',{name:group,exact:true}).getByText(answer,{exact:true}).click();
  await page.getByLabel('Causa raiz',{exact:false}).selectOption('alega_nao_fez');
  await page.getByLabel('Tipo de OBF',{exact:false}).selectOption('nulidade');
  await page.getByLabel('Produto',{exact:false}).selectOption('seguro');
  await page.getByLabel('Valor sugerido',{exact:false}).fill('2000');
  await page.getByLabel('Saldo devedor',{exact:false}).fill('1000');
  await page.getByRole('radiogroup',{name:'sent-platform',exact:true}).getByText('Sim',{exact:true}).click();
  await page.screenshot({path:`${shots}/agreement-full.png`,fullPage:true});
  for(const width of [1920,1600,1366]) { await page.setViewportSize({width,height:900}); assert.equal((await canvas()).overflow,false,`Full agreement fits at ${width}`); }
  await page.setViewportSize({width:1600,height:900});
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('alert').waitFor();
  assert.equal((await canvas()).overflow,false,'Full agreement with save error fits');
  await page.screenshot({path:`${shots}/agreement-full.png`,fullPage:true});
  for (const scenario of ['liminar','defesa','comprovante_pagamento','protocolo','acordos']) {
    for (const width of [1920,1600,1366,390]) {
      await page.setViewportSize({width,height:width===1920?1080:900});
      await page.goto(`http://127.0.0.1:5174/?scenario=${scenario}`);
      await page.locator('.execution-process-heading').waitFor();
      assert.equal(await page.locator('.workbench-header').count(),0,'Queue hero removed');
      assert.equal(await page.locator('.execution-process-heading p').count(),0,'Batch subtitle removed');
      assert.equal(await page.locator('.execution-review,.tasks-execution-summary').count(),0,'Reviews and status removed');
      const innerScroll = await page.locator('.tasks-workspace').evaluate(root => [...root.querySelectorAll('*')].filter(el => ['auto','scroll'].includes(getComputedStyle(el).overflowY) && el.scrollHeight>el.clientHeight+1).map(el=>el.className));
      assert.deepEqual(innerScroll,[],`${scenario} has no nested scroll at ${width}`);
      assert.equal((await canvas()).overflow,false);
      await page.screenshot({path:`${shots}/${scenario}-${width}.png`,fullPage:width>=1024});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth>innerWidth),false,`${scenario} overflow at ${width}`);
    }
  }
  await openScenario('comprovante_pagamento');
  await page.getByRole('radiogroup',{name:'payment-status',exact:true}).getByText('Não foi pago',{exact:true}).click();
  await page.getByRole('radiogroup',{name:'had-block',exact:true}).getByText('Não',{exact:true}).click();
  await page.screenshot({path:`${shots}/payment-clean.png`,fullPage:true});
  await openScenario('defesa');
  await page.locator('.task-question').filter({hasText:'O fatal da Enter está correto'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.locator('.task-question').filter({hasText:'Existe prazo para apresentação de defesa'}).getByRole('radio',{name:'Não',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Suspenso',exact:true}).locator('..').click();
  assert.equal(await page.getByRole('radio',{name:'Suspenso',exact:true}).isChecked(),true);
  await page.getByRole('radio',{name:'Tema 1414',exact:true}).locator('..').click();
  await page.screenshot({path:`${shots}/defense-clean.png`,fullPage:true});
  await page.getByRole('radio',{name:'Processo tem sentença',exact:true}).locator('..').click();
  assert.equal(await page.getByRole('radiogroup',{name:'defense-suspension',exact:true}).count(),0);
  await page.getByRole('radio',{name:'Suspenso',exact:true}).locator('..').click();
  assert.equal(await page.getByRole('radiogroup',{name:'defense-suspension',exact:true}).locator('input:checked').count(),0);
  await page.getByRole('button',{name:'Pular esse prazo',exact:true}).click();
  assert.equal(await page.locator('.task-question input:checked').count(),0);
  assert.equal(await page.locator('.execution-process-heading small').textContent(),'Validação de Defesa');
  await openScenario('');
  await page.getByLabel('Filtrar tipo').selectOption('liminar');
  await page.getByRole('radiogroup',{name:'liminar-requested',exact:true}).getByText('Não',{exact:true}).click();
  await page.evaluate(() => { const original=window.MBA_API.request; window.MBA_API.request=async(path,options) => path.endsWith('/liminar-analysis') ? {} : original(path,options); });
  await page.getByRole('button',{name:'Salvar e próximo',exact:true}).click();
  await page.getByRole('heading',{name:'DEMO 0002 · SP',exact:true}).waitFor();
  assert.equal(await page.locator('.task-question input:checked').count(),0);
  await page.getByLabel('Filtrar tipo').selectOption('all');
  await page.getByLabel('Buscar processo ou parte').fill('RS');
  await page.getByRole('radiogroup',{name:'defense-deadline',exact:true}).waitFor();
  assert.equal(await page.locator('.execution-process-heading small').textContent(),'Validação de Defesa');
  assert.equal(await page.locator('.task-question input:checked').count(),0);
  const keyboardNo=page.getByRole('radiogroup',{name:'defense-deadline',exact:true}).getByRole('radio',{name:'Não',exact:true}); await keyboardNo.focus(); await keyboardNo.press('Enter'); assert.equal(await keyboardNo.isChecked(),true);
  assert.deepEqual(errors, [], 'No browser errors');
  assert.deepEqual(outbound, [], 'Demo must remain isolated from production');
  console.log('Operational UX interactions and responsive checks passed; no external requests.');
} finally {
  await browser?.close();
  server.kill();
}
