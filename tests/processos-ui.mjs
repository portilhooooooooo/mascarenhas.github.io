// Playwright exercises the built application; all API responses below are test fixtures.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir','dist','--host','127.0.0.1','--port','5175','--strictPort'],{stdio:'pipe'});
const base='http://127.0.0.1:5175', out='docs/ux-processos-evidence';
const actor='11111111-1111-4111-8111-111111111111', taskId='22222222-2222-4222-8222-222222222222', processId='33333333-3333-4333-8333-333333333333';
const cnj='0000001-74.2026.8.26.0001';
const permissions=Object.fromEntries(['processos.view','tasks.view','tasks.execute','tasks.create','tasks.assign','tasks.view_others','dashboard.view','pagamentos.view','encerramentos.view','automations.view'].map(p=>[p,true]));
const profile={id:actor,email:'analista@fixture.invalid',name:'Analista de teste',role:'user',permissions,capabilities:{processos:true},portfolios:[{id:'agibank_enter',display_name:'Agibank · Enter'},{id:'nubank_mba',display_name:'Nubank · MBA'}],default_portfolio_id:'agibank_enter'};
const record={id:1,cnj,portfolio_id:'agibank_enter',carteira:'Agibank',state:'SP',fase:'Conhecimento',situation_benner:'Ativo',integration:'Base processual',updated_at:'2026-10-10T15:00:00Z',last_movement_at:'2026-10-09T12:00:00Z',situation:'Em andamento',situation_source:'sistema',has_sentence:true,has_pending_tasks:true};
const task={id:taskId,type:'encerramento',title:'Análise de encerramento',priority:'high',status:'pending',responsible_id:actor,responsible_name:'Analista de teste',created_by:actor,total_processes:1,completed_processes:0};
const fixtureProcess={id:processId,task_id:taskId,case_number:cnj,status:'pending',assignee_id:actor,position:1,source:'api',source_metadata:{}};
let browser;
try {
 for(let i=0;i<120;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{if(!localStorage.getItem('fixture_logged_out'))localStorage.setItem('mba_session_token','ba_test_fixture');if(!localStorage.getItem('mba_portfolio_id'))localStorage.setItem('mba_portfolio_id','agibank_enter');});
 let noPermission=false, flag=true, empty=false, datajudOffline=false, apiOffline=false;
 const calls=[],writes=[],errors=[],measurements=[];
 await context.route('https://api.portilhobackoffice.site/**',async route=>{
  const req=route.request(),url=new URL(req.url()),path=decodeURIComponent(url.pathname),method=req.method(),portfolio=req.headers()['x-portfolio-id'];
  calls.push({path,query:url.search,method,portfolio});
  const reply=(data,status=200)=>route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  if(method==='OPTIONS')return reply({});
  if(path==='/api/me') return reply({...profile,capabilities:{processos:flag},permissions:{...permissions,'processos.view':!noPermission}});
  if(path==='/api/task-assignees')return reply([{id:actor,name:'Analista de teste'}]);
  if(path==='/auth/microsoft/start'){assert.match(req.postDataJSON().handoff_challenge,/^[A-Za-z0-9_-]{43}$/);assert.deepEqual(Object.keys(req.postDataJSON()),['handoff_challenge']);return reply({error:'Falha de SSO de teste'},503);}
  if(method==='POST'){writes.push({path,body:req.postDataJSON()});if(path==='/api/tasks')return reply({...task,process_id:processId},201);return reply({...fixtureProcess,status:'completed'});}
  if(path==='/api/tasks')return reply([task]);
  if(path==='/api/tasks/'+taskId)return reply(task);
  if(path==='/api/tasks/'+taskId+'/processes')return reply([fixtureProcess]);
  if(path==='/api/task-processes/'+processId)return reply(fixtureProcess);
  if(path==='/api/processos'){
   if(apiOffline)return reply({error:'Não foi possível consultar os processos.'},503);
   return reply({rows:empty?[]:[{...record,portfolio_id:portfolio,carteira:portfolio==='nubank_mba'?'Nubank':'Agibank'}],total:empty?0:26,page:Number(url.searchParams.get('page')||1),page_size:25});
  }
  if(path==='/api/processos/'+cnj)return reply({process:record,cnj,permissions:{tasks:true,create_task:true,task_types:['liminar','defesa','encerramento']}});
  if(path.endsWith('/timeline'))return reply({rows:[
   {id:'judicial',kind:'judicial',source:'DataJud',source_id:'fixture-datajud',title:'Sentença',occurred_at:'2026-10-10T00:00:00Z',captured_at:'2026-10-11T00:00:00Z',degree:'G1',references:[{job_id:'fixture-job',captured_at:'2026-10-11T00:00:00Z',source_id:'fixture-datajud'}]},
   {id:'analysis',kind:'human_analysis',source:'Backoffice',title:'analysis_completed',occurred_at:'2026-10-09T00:00:00Z'},
   {id:'automation',kind:'automation',source:'Backoffice',title:'Automation run',occurred_at:'2026-10-08T00:00:00Z'},
   {id:'task',kind:'task',source:'Backoffice',title:'task_created',occurred_at:'2026-10-07T00:00:00Z'},
   {id:'system',kind:'system',source:'Backoffice',title:'Atualização',occurred_at:'2026-10-06T00:00:00Z'}].filter(e=>(url.searchParams.get('view')||'important')!=='important'||e.kind==='judicial'),page:1,has_more:false,sources:{datajud:{state:datajudOffline?'unavailable':'available',message:'Histórico DataJud indisponível. Tente novamente.'},operational:{state:'available'}}});
  if(path.endsWith('/tasks'))return reply({rows:[{task_id:taskId,process_id:processId,type:'encerramento',title:task.title,priority:'high',status:'pending',responsible_name:'Analista de teste'}],total:1,page:1,page_size:25});
  if(path.startsWith('/api/processos/'))return reply({error:'Processo não encontrado.'},404);
  return reply([]);
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const noOverflow=async label=>{const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));if(dims.scroll>dims.width+2){console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).slice(-20)));await page.screenshot({path:out+'/overflow-debug.png',fullPage:true});}assert.ok(dims.scroll<=dims.width+2,label+JSON.stringify(dims));};
 await mkdir(out,{recursive:true});
 for(const [width,height] of [[1366,768],[1440,900],[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(250);await page.goto(base+'/processos');
  await page.locator('.processos-table-wrap').waitFor();await page.getByRole('columnheader',{name:'Data da última movimentação'}).waitFor();assert.equal(await page.getByRole('columnheader',{name:'Tarefas pendentes'}).count(),0);await noOverflow('Processos '+width);
  assert.equal(await page.locator('.mba-context-label').count(),0);
  assert.equal(await page.locator('.main-nav [data-page="processos"]').count(),1);
  await page.screenshot({path:out+`/processos-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1440,height:900});
 await page.getByLabel('Movimentações',{exact:true}).selectOption('sentence_improcedente');
 assert.ok(calls.some(c=>c.path==='/api/processos'&&c.query.includes('movement=sentence_improcedente')));
 await page.getByLabel('Movimentações',{exact:true}).selectOption('');
 await page.getByLabel('Situação',{exact:true}).selectOption('Encerrado');
 assert.ok(calls.some(c=>c.path==='/api/processos'&&c.query.includes('situation=Encerrado')));
 await page.getByLabel('Situação',{exact:true}).selectOption('');
 await page.getByRole('button',{name:'Próxima',exact:true}).click();
 await page.getByText('Página 2',{exact:false}).waitFor();
 assert.ok(calls.some(c=>c.path==='/api/processos'&&c.query.includes('page=2')&&c.portfolio==='agibank_enter'));
 await page.getByRole('button',{name:cnj,exact:true}).click();await page.locator('.processos-timeline').waitFor();
 assert.equal(await page.locator('[data-event-kind]').count(),1,'Principais deve mostrar apenas atos judiciais relevantes');
 await page.locator('summary').first().click();await page.getByText('fixture-job',{exact:false}).waitFor();
 await page.screenshot({path:out+'/processo-historico.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);await noOverflow('Detalhe mobile');await page.screenshot({path:out+'/processo-historico-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(250);await page.evaluate(()=>document.documentElement.dataset.mbaTheme='lua');await page.screenshot({path:out+'/processo-historico-lua.png',fullPage:true});await page.evaluate(()=>document.documentElement.dataset.mbaTheme='sol');
 await page.getByRole('complementary',{name:'Tarefas do processo'}).getByRole('button',{name:/Abrir tarefa/}).waitFor();
 await page.screenshot({path:out+'/processo-tarefas.png',fullPage:true});
 await page.getByRole('button',{name:'Criar tarefa',exact:true}).click();
 await page.getByRole('dialog').getByLabel('Responsável',{exact:false}).selectOption(actor);
 assert.equal(writes.length,0,'Abrir formulário não persiste');await page.screenshot({path:out+'/processo-criar-tarefa.png',fullPage:true});
 await page.getByRole('button',{name:'Criar tarefa',exact:true}).last().click();await page.getByText('Tarefa criada e vinculada ao processo.').waitFor();
 assert.equal(writes[0].body.process_cnj,cnj);assert.equal(writes[0].body.source,'api');
 await page.getByRole('complementary',{name:'Tarefas do processo'}).getByRole('button',{name:/Abrir tarefa/}).click();await page.getByRole('radiogroup',{name:'closing-sentence'}).waitFor();
 const choose=async(group,label)=>{await page.getByRole('radiogroup',{name:group}).getByText(label,{exact:true}).click();await page.getByRole('button',{name:/Próxima/}).click();};
 await choose('closing-sentence','Extinção');await choose('closing-appeal','Sim');await choose('closing-appellant','Parte autora');await choose('closing-appeal-decided','Sim');await choose('closing-appeal-result','Mantida a improcedência');await choose('closing-transit-confirmed','Sim');
 const execution=page.locator('.qa-stage-segment').filter({hasText:'Cadastro de Execução'});
 assert.equal(await execution.getAttribute('data-stage-state'),'not_applicable');assert.match(await execution.getAttribute('class'),/complete/);
 assert.equal(writes.length,1,'Respostas intermediárias permanecem em rascunho');
 for(const [width,height] of [[1366,768],[1440,900],[1920,1080],[390,844]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(250);await noOverflow('Encerramento '+width);
  const m=await page.locator('.qa-form-content').evaluate(el=>({scroll:el.scrollHeight,client:el.clientHeight,overflow:getComputedStyle(el).overflowY}));
  measurements.push({width,height,...m});if(width>=1366)assert.ok(m.scroll<=m.client+2,'Análise simples não precisa scroll '+JSON.stringify(m));
  await page.getByRole('button',{name:'Salvar e próximo'}).scrollIntoViewIfNeeded();assert.ok(await page.getByRole('button',{name:'Salvar e próximo'}).isVisible());
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:out+`/encerramento-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1366,height:768});
 await page.getByRole('radiogroup',{name:'closing-classification-agreement'}).getByText('Não',{exact:true}).click();
 assert.ok(await page.locator('.closing-disagreement-field textarea').isVisible());assert.equal(await page.getByRole('button',{name:'Salvar e próximo'}).isEnabled(),false);
 await page.locator('.closing-disagreement-field textarea').fill('Conferir o teor integral do acórdão antes da classificação.');
 await page.keyboard.press('Backspace'); // focused textarea edits text and must not navigate.
 assert.ok(await page.locator('.closing-disagreement-field textarea').isVisible());
 await page.screenshot({path:out+'/encerramento-revisao.png',fullPage:true});
 await page.getByRole('button',{name:'Salvar e próximo'}).click();
 await page.waitForFunction(()=>!document.querySelector('button[aria-busy="true"]'));
 assert.ok(writes.some(w=>w.path.includes('encerramento')&&w.body.classification_agreed===false),JSON.stringify(writes));
 // Server errors, real empty results, absent process and missing permissions.
 await page.goto(base+'/processos/inexistente');await page.getByRole('alert').filter({hasText:'Processo não encontrado.'}).waitFor();
 empty=true;await page.goto(base+'/processos');await page.getByText('Nenhum processo encontrado para os filtros selecionados.').waitFor();empty=false;
 apiOffline=true;await page.reload();await page.getByRole('alert').filter({hasText:'Não foi possível consultar os processos.'}).waitFor();apiOffline=false;
 datajudOffline=true;await page.goto(base+'/processos/'+cnj);await page.getByText('Histórico DataJud indisponível. Tente novamente.').waitFor();datajudOffline=false;
 await page.goto(base+'/processos');await page.locator('.processos-table-wrap').waitFor();
 await page.evaluate(()=>window.MBA_API.setPortfolioId('nubank_mba'));await page.reload();
 await page.locator('.processos-table-wrap').waitFor();assert.ok(calls.some(c=>c.path==='/api/processos'&&c.portfolio==='nubank_mba'));
 noPermission=true;await page.reload();assert.equal(await page.locator('.processos-table-wrap').count(),0);await page.locator('body.auth-signed-in').waitFor();assert.ok(await page.locator('[data-page="processos"]').isHidden());noPermission=false;
 flag=false;await page.reload();await page.locator('body.auth-signed-in').waitFor();assert.ok(await page.locator('[data-page="processos"]').isHidden());
 // Login uses actual existing Microsoft PKCE service, with only the OAuth boundary mocked.
 await page.evaluate(()=>{localStorage.setItem('fixture_logged_out','true');localStorage.removeItem('mba_session_token');});await page.reload();await page.locator('#react-login-title').waitFor();
 assert.equal(await page.getByPlaceholder('apenas@mascarenhasbarbosa.com.br').count(),1);assert.equal(await page.getByRole('button',{name:'Entrar',exact:true}).count(),1);
 assert.equal(await page.getByText(/Continuar via Microsoft|Entrar com Google|Seu espaço de trabalho está pronto/).count(),0);
 await page.screenshot({path:out+'/login-sol.png',fullPage:true});await page.evaluate(()=>document.documentElement.dataset.mbaTheme='lua');await page.screenshot({path:out+'/login-lua.png',fullPage:true});
 await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.getByRole('alert').getByText('Falha de SSO de teste').waitFor();
 const oauth=calls.filter(c=>c.path==='/auth/microsoft/start');assert.equal(oauth.length,1,'Entrar inicia o serviço Microsoft existente');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('mba:auth-state',{detail:{busy:true,error:null}})));assert.ok(await page.getByRole('button',{name:'Redirecionando…'}).isDisabled());
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('mba:auth-state',{detail:{busy:false,error:'Falha de SSO de teste'}})));await page.getByRole('alert').getByText('Falha de SSO de teste').waitFor();
 assert.deepEqual(errors,[]);
 await writeFile(out+'/measurements.json',JSON.stringify({fixture:true,viewports:measurements,requests:calls.length,writes:writes.length,jsErrors:errors},null,2));
 console.log('Built UI: Processos, paginação, timeline, criação explícita, tarefa vinculada, Encerramento NA/revisão, 4 viewports, troca de carteira, erros, permissões e login validados.');
}finally{if(browser)await browser.close();server.kill('SIGTERM');}
