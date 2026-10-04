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
  const save = () => page.getByRole('button',{name:'Salvar e próximo',exact:true});
  const choose = async (group, answer) => { await page.getByRole('radiogroup',{name:group,exact:true}).getByText(answer,{exact:true}).click(); await page.waitForTimeout(150); };
  const records = () => page.evaluate(() => window.__uxSubmissions);
  const open = async (scenario='', fixture='') => {
    await page.goto(`http://127.0.0.1:5174/?scenario=${scenario}&fixture=${fixture}`);
    await page.locator('.execution-process-heading').waitFor();
    await page.locator('.task-station .tasks-react-subnav').waitFor();
    await page.evaluate(() => {
      window.__uxSubmissions=[];
      const original=window.MBA_API.request;
      window.MBA_API.request=async(path,options) => {
        if(options?.method==='POST' && !path.endsWith('/next-agreement')) {
          const body=options.body instanceof FormData ? {document_type:options.body.get('document_type')} : JSON.parse(options.body || '{}');
          window.__uxSubmissions.push({path,body});
          if(path.endsWith('/skip') || path.endsWith('/stage')) return {};
          throw new Error('Falha simulada: nenhum dado real foi gravado.');
        }
        return original(path,options);
      };
    });
    await page.evaluate(() => document.fonts.ready);
  };
  const submit = async () => { await save().click(); await page.getByRole('alert').waitFor(); return (await records()).at(-1).body; };
  const layout = async () => page.locator('.execution-card').evaluate(el => {
    const footer=el.querySelector('.task-renderer-footer'),content=el.querySelector('.task-form-content');
    return {height:el.getBoundingClientRect().height,bottom:el.getBoundingClientRect().bottom,footerBottom:footer?.getBoundingClientRect().bottom,footerInScroll:content?.contains(footer),scroll:content?.scrollHeight>content?.clientHeight+1,documentScroll:document.documentElement.scrollHeight>innerHeight+1,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  await open('liminar');
  assert.equal(await save().isEnabled(),false);
  for(const [decided,answer,expected] of [[null,'Não','nao_solicitada'],['Sim','Deferida','deferida'],['Sim','Indeferida','indeferida'],['Não','Sim','com_sentenca'],['Não','Não','sem_decisao']]) {
    await choose('liminar-requested','Não');
    if(decided) { await choose('liminar-requested','Sim'); await choose('liminar-decided',decided); await choose(decided==='Sim'?'liminar-result':'liminar-judgment',answer); }
    assert.deepEqual(await submit(),{decision:expected,notes:null});
    assert.equal((await layout()).footerInScroll,false);
    assert.equal((await layout()).height, await page.locator('.tasks-workspace').evaluate(el=>el.getBoundingClientRect().height));
  }
  assert.equal(await page.getByRole('heading',{name:/03.*Esse processo teve sentença/}).count(),1);
  await choose('liminar-decided','Sim'); await choose('liminar-result','Deferida'); await choose('liminar-decided','Não');
  assert.equal(await page.getByRole('radiogroup',{name:'liminar-result'}).count(),0); assert.equal(await save().isEnabled(),false);
  await choose('liminar-requested','Não'); assert.equal(await page.locator('.task-question').count(),1);
  await page.screenshot({path:`${shots}/liminar-review.png`});

  await open('defesa');
  await choose('defense-deadline','Sim');
  const confirmed=await submit(); assert.equal(confirmed.workflow_version,4); assert.equal(confirmed.has_defense_order,null); assert.equal(confirmed.court_fatal_deadline,null);
  await choose('defense-deadline','Não'); await choose('defense-active','Não'); await choose('defense-reason','Suspenso');
  assert.equal(await page.getByRole('radio',{name:'Suspenso',exact:true}).isChecked(),true);
  assert.equal(await save().isEnabled(),false);
  assert.equal(await page.locator('.task-question').filter({hasText:'Qual o tema da suspensão?'}).locator('.task-question').count(),0);
  await choose('defense-suspension','Tema 1414'); assert.equal((await submit()).reason,'suspenso_1414');
  await page.screenshot({path:`${shots}/defense-clean.png`});
  await choose('defense-reason','Processo tem sentença'); assert.equal(await page.getByRole('radiogroup',{name:'defense-suspension'}).count(),0);
  await choose('defense-reason','Suspenso'); assert.equal(await page.getByRole('radiogroup',{name:'defense-suspension'}).locator('input:checked').count(),0);
  await choose('defense-active','Sim'); await choose('defense-court-valid','Sim');
  assert.equal(await save().isEnabled(),false); await page.getByLabel('Data fatal do expediente').fill('2026-10-10');
  const court=await submit(); assert.equal(court.court_fatal_deadline,'2026-10-10'); assert.equal(court.has_valid_court_deadline,true); assert.deepEqual(court.criteria,[]); assert.equal('cpj_fatal_deadline' in court,false);
  await choose('defense-court-valid','Não'); assert.equal(await page.getByLabel('Data fatal do expediente').count(),0);
  await open('defesa'); await choose('defense-deadline','Não'); await choose('defense-active','Sim'); await choose('defense-court-valid','Não');
  for(const name of ['Expedição de DJE','DJE Negativo','Expedição de Carta AR','Retorno de Carta AR','Audiência','Juntada de Habilitação']) await page.getByRole('button',{name,exact:true}).click();
  for(const input of await page.locator('.defesa-flow-criteria input').all()) await input.fill('2026-10-02');
  await page.screenshot({path:`${shots}/defense-shell.png`});
  await page.screenshot({path:`${shots}/defense-evidence-clean.png`});
  const evidence=await submit(); assert.equal(evidence.criteria.length,6); assert.equal(evidence.court_fatal_deadline,null); assert.equal(evidence.has_valid_court_deadline,false); assert.equal('priority' in evidence,false);
  await page.screenshot({path:`${shots}/defense-evidence.png`});
  await choose('defense-court-valid','Sim'); assert.equal(await page.getByLabel('Data fatal do expediente').inputValue(),'');
  await page.getByRole('button',{name:'Pular esse prazo',exact:true}).click();
  await page.getByRole('heading',{name:'DEMO 0002 · RS',exact:true}).waitFor(); assert.equal(await page.locator('.task-question input:checked').count(),0);

  await open('protocolo'); assert.equal(await page.locator('.protocol-native-file').count(),0);
  await choose('protocol-can-attach','Não'); assert.equal(await page.getByRole('textbox',{name:/Justificativa/}).count(),0);
  assert.equal(await page.getByRole('radiogroup',{name:'protocol-error-reason'}).getByRole('radio').count(),2);
  for(const [answer,code] of [['A defesa foi concluída externamente','DEFESA_CONCLUIDA_EXTERNAMENTE'],['Ainda não foi protocolado nos autos','AINDA_NAO_PROTOCOLADO']]) {
    await choose('protocol-error-reason',answer); const body=await submit(); assert.equal(body.reason,code); assert.equal(body.notes,null);
  }
  await choose('protocol-can-attach','Sim');
  const pdf={name:'defesa-demo.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')};
  await page.locator('.protocol-native-file').nth(0).setInputFiles(pdf); await page.locator('.protocol-native-file').nth(1).setInputFiles({...pdf,name:'protocolo-demo.pdf'});
  await page.screenshot({path:`${shots}/protocol-documents-clean.png`});
  await submit(); assert.ok((await records()).at(-1).path.endsWith('/protocol-collection/commit'));
  const staged=(await records()).filter(x=>x.path.endsWith('/stage')); assert.deepEqual(staged.map(x=>x.body.document_type),['DEFESA','PROTOCOLO']);
  await choose('protocol-can-attach','Não'); assert.equal(await page.getByRole('radiogroup',{name:'protocol-can-attach'}).getByRole('radio',{name:'Não',exact:true}).isChecked(),true); assert.equal(await page.getByRole('radiogroup',{name:'protocol-can-attach'}).getByRole('radio',{name:'Sim',exact:true}).isChecked(),false); assert.equal(await page.locator('[name="protocol-error-reason"]:checked').count(),0); assert.equal(await save().isEnabled(),false);
  await page.screenshot({path:`${shots}/protocol-review.png`});

  await open('comprovante_pagamento'); assert.equal(await page.locator('.execution-brief').count(),0);
  await choose('payment-status','Sim'); await choose('paid-receipt','Não'); await choose('had-block','Não');
  assert.equal(await page.getByRole('heading',{name:/03.*Houve bloqueio/}).count(),1);
  await page.screenshot({path:`${shots}/payment-answers-clean.png`});
  assert.equal((await submit()).paid_receipt,'sem_comprovante');
  await page.screenshot({path:`${shots}/payment-clean.png`});
  await choose('paid-receipt','Sim'); await choose('manifested','Não'); await page.getByLabel('Justificativa',{exact:false}).fill('Manifestação pendente.');
  const paid=await submit(); assert.equal(paid.workflow_version,2); assert.equal(paid.manifested_in_court,false);
  await choose('paid-receipt','Não'); assert.equal(await page.getByLabel('Justificativa',{exact:false}).count(),0); assert.equal((await submit()).manifestation_reason,null);
  await choose('payment-status','Não'); await choose('unpaid-status','Erro na emissão'); await choose('requested-again','Sim');
  assert.equal((await submit()).requested_again,true);

  await open('acordos');
  for(const [group,answer] of [['has-agreement','Não'],['has-judgment','Não'],['has-impediment','Não'],['has-defense','Sim'],['has-obf','Sim']]) await choose(group,answer);
  await page.getByLabel('Causa raiz',{exact:false}).selectOption('alega_nao_fez'); await page.getByLabel('Tipo de OBF',{exact:false}).selectOption('nulidade'); await page.getByLabel('Produto',{exact:false}).selectOption('seguro'); await page.getByLabel('Valor sugerido',{exact:false}).fill('2000'); await page.getByLabel('Saldo devedor',{exact:false}).fill('1000'); await choose('sent-platform','Sim');
  assert.equal((await submit()).has_defense_presented,true);
  for(const height of [900,650]) {
    await page.setViewportSize({width:1366,height}); await page.waitForTimeout(150);
    const before=await layout(); await page.locator('.task-form-content').evaluate(el=>el.scrollTop=el.scrollHeight);
    const after=await layout(); assert.equal(after.footerBottom,before.footerBottom); assert.equal(after.footerInScroll,false); assert.equal(after.documentScroll,false);
  }
  await page.screenshot({path:`${shots}/agreement-full.png`});

  await page.setViewportSize({width:1600,height:900}); await open('liminar','states');
  await page.getByLabel('Prioridade',{exact:true}).selectOption('altissima');
  await page.getByRole('heading',{name:'DEMO 0004 · SP',exact:true}).waitFor();
  await page.getByLabel('Prioridade',{exact:true}).selectOption('all'); await page.getByLabel('Situação',{exact:true}).selectOption('completed');
  await page.getByText('Processo concluído',{exact:true}).waitFor(); assert.equal(await save().count(),0);
  await page.getByLabel('Situação',{exact:true}).selectOption('error'); assert.equal(await page.locator('.tasks-process-item').count(),1);
  await page.getByLabel('Situação',{exact:true}).selectOption('pending'); await page.getByLabel('Buscar processo',{exact:true}).fill('Parte demonstrativa'); assert.equal(await page.locator('.tasks-process-item').count(),0);
  await page.getByLabel('Buscar processo',{exact:true}).fill('0004'); assert.equal(await page.locator('.tasks-process-item').count(),1);
  await page.getByLabel('Buscar processo',{exact:true}).fill('');

  for(const scenario of ['liminar','defesa','protocolo','comprovante_pagamento','acordos']) {
    for(const [width,height] of [[1920,1080],[1600,900],[1366,768],[390,844]]) {
      await page.setViewportSize({width,height}); await open(scenario);
      const sizes=await page.locator('.task-option-grid').evaluateAll(groups=>groups.map(g=>[...g.querySelectorAll('.task-option-card')].map(c=>({width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height})))); for(const group of sizes) for(const size of group) { assert.ok(Math.abs(size.width-group[0].width)<2); assert.ok(Math.abs(size.height-group[0].height)<2); }
      const metrics=await layout(); assert.equal(metrics.overflow,false,`No horizontal overflow ${scenario}/${width}`); assert.equal(metrics.documentScroll,false); assert.equal(metrics.footerInScroll,false); assert.ok(Math.abs(metrics.footerBottom-metrics.bottom)<2);
      assert.equal(await page.locator('.tasks-execution-summary,.execution-review').count(),0);
      assert.equal(await page.locator('.demo-navbar').isVisible(),true);
      assert.equal(await page.locator('.tasks-react-subnav').count(),1);
      await page.screenshot({path:`${shots}/${scenario}-${width}.png`});
    }
  }
  await page.setViewportSize({width:1600,height:900}); await open('');
  await choose('liminar-requested','Não');
  await page.evaluate(() => { const old=window.MBA_API.request; window.MBA_API.request=async(path,options)=>path.endsWith('/liminar-analysis')?{}:old(path,options); });
  await save().click(); await page.getByRole('heading',{name:'DEMO 0002 · SP',exact:true}).waitFor(); assert.equal(await page.locator('.task-question input:checked').count(),0);
  await page.getByLabel('Buscar processo',{exact:true}).fill('RS'); await page.getByRole('radiogroup',{name:'defense-deadline'}).waitFor();
  assert.equal(await page.locator('.execution-process-heading small').textContent(),'Validação de Defesa');
  const keyboard=page.getByRole('radiogroup',{name:'defense-deadline'}).getByRole('radio',{name:'Não',exact:true}); await keyboard.focus(); await keyboard.press('Enter'); assert.equal(await keyboard.isChecked(),true);
  await page.getByRole('button',{name:'Atribuições',exact:true}).click(); assert.equal(await page.locator('.demo-navbar').isVisible(),true);
  await page.getByRole('button',{name:'Resultados',exact:true}).click();
  assert.equal(await page.getByRole('heading',{name:'Resultados',exact:true}).count(),1);
  assert.equal(await page.locator('.demo-navbar').isVisible(),true);
  await page.locator('.tasks-react-subnav').getByRole('button',{name:'Tarefas',exact:true}).click();
  await page.locator('.execution-process-heading').waitFor();
  await page.evaluate(()=>{
    window.MBA_CURRENT_USER.permissions['automations.run']=true;
    window.__controlCalls=[];
    const original=window.MBA_AUTOMATION_API.request;
    window.__automationState='authenticating'; window.__failSecondUpload=true;
    window.MBA_AUTOMATION_API.request=async(path,options)=>{
      if(path==='/api/protocolo/summary')return {session:{state:window.__automationState},controladoria:null,documents:null,statuses:{}};
      if(options?.method==='POST'){
        const body=options.body;
        window.__controlCalls.push({path,fields:body instanceof FormData?[...body.entries()].map(([key,file])=>[key,file.name]):[]});
        if(path.endsWith('/upload')){if(body.get('documents').name==='minuta.docx' && window.__failSecondUpload){window.__failSecondUpload=false;throw new Error('Falha simulada no segundo documento');}return {stored:1,duplicates:0};}
        if(path.endsWith('/documentos'))return {stored:2,ignored:0,missing:0,errors:0};
        if(path.endsWith('/run')){window.__automationState='in_use';return {};}
      }
      return original(path,options);
    };
  });
  await page.getByRole('button',{name:'Controladoria',exact:true}).click();
  await page.getByText('Fazendo login…',{exact:true}).waitFor();
  assert.equal(await page.locator('.protocolos-page-react table,.workbench-attention,.protocolos-page-react details').count(),0);
  for(const label of ['Baixar exceções','Atualizar','Arquivo do Metabase','Sessão Enter'])assert.equal(await page.getByText(label,{exact:true}).count(),0);
  assert.equal(await page.getByRole('heading',{name:'Correspondências',exact:true}).count(),1);
  const uploadInput=page.getByLabel('Selecionar documentos',{exact:true});
  await uploadInput.setInputFiles([{name:'defesa.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4')},{name:'minuta.docx',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:Buffer.from('mock-docx')}]);
  await page.getByRole('button',{name:'Enviar documentos',exact:true}).click();await page.getByText(/1 enviados · 1 pendentes/).waitFor();
  assert.equal(await page.locator('.protocolos-selected-file').count(),1);
  await page.getByRole('button',{name:'Enviar documentos',exact:true}).click();await page.getByText(/1 arquivos enviados à VPS/).waitFor();
  await page.getByLabel('Selecionar correspondências',{exact:true}).setInputFiles({name:'correspondencias.xlsx',mimeType:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',buffer:Buffer.from('mock-xlsx')});
  await page.getByRole('button',{name:'Importar correspondências',exact:true}).click();await page.getByText(/2 documentos relacionados/).waitFor();
  const calls=await page.evaluate(()=>window.__controlCalls);
  assert.deepEqual(calls.map(x=>x.path),['/api/protocolo/documentos/upload','/api/protocolo/documentos/upload','/api/protocolo/documentos/upload','/api/protocolo/documentos']);
  assert.deepEqual(calls.map(x=>x.fields),[[['documents','defesa.pdf']],[['documents','minuta.docx']],[['documents','minuta.docx']],[['relation','correspondencias.xlsx']]]);
  await page.screenshot({path:`${shots}/control-1600.png`});
  for(const [state,label] of [['in_use','Em produção'],['lost','Erro de sessão'],['idle','Aguardando execução']]) {
    await page.getByRole('button',{name:'Tarefas',exact:true}).first().click();
    await page.evaluate(value=>window.__automationState=value,state);
    await page.getByRole('button',{name:'Controladoria',exact:true}).click();await page.getByText(label,{exact:true}).waitFor();
  }
  await page.getByRole('button',{name:'Iniciar',exact:true}).click();await page.getByText('Em produção',{exact:true}).waitFor();
  await page.evaluate(()=>{window.MBA_CURRENT_USER.permissions['automations.run']=false;window.dispatchEvent(new Event('mba:authenticated'));});
  assert.equal(await page.getByRole('button',{name:'Enviar documentos',exact:true}).isDisabled(),true);
  for(const [width,height] of [[1920,1080],[1600,900],[1366,768]]) {
    await page.setViewportSize({width,height}); await open('defesa','shell');
    assert.equal(await page.locator('.sidebar').isVisible(),true);assert.equal(await page.locator('.topbar').isVisible(),true);
    assert.equal((await layout()).documentScroll,false);assert.equal((await layout()).overflow,false);
    await page.screenshot({path:`${shots}/task-shell-${width}.png`});
    await page.getByRole('button',{name:'Controladoria',exact:true}).click();
    await page.getByRole('heading',{name:'Correspondências',exact:true}).waitFor();
    assert.equal(await page.locator('.sidebar').isVisible(),true);assert.equal(await page.locator('.topbar').isVisible(),true);
    await page.screenshot({path:`${shots}/protocol-shell-${width}.png`});
  }
  assert.deepEqual(errors,[]); assert.deepEqual(outbound,[]);
  console.log('Task station branches, fixed actions, filters, keyboard and responsive checks passed; no external requests.');
} finally {
  await browser?.close();
  server.kill();
}
