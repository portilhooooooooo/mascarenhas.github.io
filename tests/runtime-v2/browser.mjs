import assert from 'node:assert/strict';
import {chromium,firefox} from 'playwright';
const browserName=process.env.BROWSER||'chromium';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,writeFile,mkdtemp,cp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const phase=process.env.PHASE||'baseline';
const port=process.env.PORT||'5186';
const out=`docs/runtime-v2/evidence/${phase}`;
await mkdir(out,{recursive:true});
const serveDir=await mkdtemp(join(tmpdir(),'mba-runtime-v2-build-'));
await cp('dist',serveDir,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir',serveDir,'--host','127.0.0.1','--port',port,'--strictPort']);
const base='http://127.0.0.1:'+port;
const profile={id:'fixture-analyst',email:'runtime@fixture.invalid',name:'Runtime Fixture',role:'legal_leader',runtime_features:{write_intents:true},permissions:Object.fromEntries(['tasks.view','tasks.view_others','tasks.assign','tasks.manage','tasks.execute','dashboard.view','encerramentos.view'].map(p=>[p,true])),portfolios:[{id:'agibank_enter',display_name:'Agibank · Enter'},{id:'agibank_mba',display_name:'Agibank · Regular'},{id:'nubank_mba',display_name:'Nubank · MBA'}],default_portfolio_id:'agibank_enter'};
const payload=(n=30)=>({period:'30',people:[{id:'fixture-analyst',name:'Pessoa Fixture',completed:n,analysis_samples:n,median_analysis_seconds:60,mean_analysis_seconds:70,step_samples:n,mean_step_seconds:70,by_type:{encerramento:n}}],summary:{completed:n,today_completed:3,pending:null,growth_percent:null,previous_completed:0,people:1,measured_analyses:n,measured_transitions:n,slowest:null},generated_at:new Date().toISOString(),methodology:'fixture',truncated:false});
let browser,context,page;
const consoleErrors=[];
const browserLifecycle=[];let cleaningUp=false;
const results=[],calls=[],errors=[],network=[];
try{
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await (browserName==='firefox'?firefox:chromium).launch({headless:true,...(browserName==='firefox'?{}:{args:['--no-sandbox'],executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH})});
 browser.on('disconnected',()=>{if(!cleaningUp)browserLifecycle.push({event:'browser_disconnected',t:Date.now()});});
 context=await browser.newContext({viewport:{width:1440,height:900}});
 context.on('requestfinished',async request=>{try{const response=await request.response(),url=new URL(request.url());network.push({path:url.pathname,method:request.method(),status:response?.status(),timing:request.timing(),sizes:await request.sizes().catch(()=>null)});}catch{}});
 await context.tracing.start({screenshots:true,snapshots:true});
 await context.addInitScript(()=>{
  localStorage.setItem('mba_session_token','ba_runtime_fixture');
  window.__metrics={shifts:[],long:[],marks:[],auth:[]};
  const geometry=()=>{
   const shell=document.querySelector('.app-shell'),slots=document.querySelectorAll('.task-results-stat');
   if(!window.__shellGeometryMs && shell && slots.length===4 && shell.getBoundingClientRect().width>0 && [...slots].every(el=>el.getBoundingClientRect().height>0))window.__shellGeometryMs=performance.now();
   if(!window.__firstKpiMs && slots[0]?.querySelector('strong')?.textContent==='30')window.__firstKpiMs=performance.now();
   if(window.__shellGeometryMs&&window.__firstKpiMs)geometryObserver.disconnect();
  };
  const geometryObserver=new MutationObserver(()=>requestAnimationFrame(geometry));
  geometryObserver.observe(document,{subtree:true,childList:true,attributes:true,characterData:true});
  document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(geometry),{once:true});
  window.__listenerCount=0;
  const registry=new WeakMap(),add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
  const capture=o=>typeof o==='boolean'?o:!!o?.capture;
  EventTarget.prototype.addEventListener=function(type,fn,options){let rows=registry.get(this);if(!rows){rows=[];registry.set(this,rows);}if(fn&&!rows.some(r=>r.type===type&&r.fn===fn&&r.capture===capture(options))){rows.push({type,fn,capture:capture(options)});window.__listenerCount++;}return add.call(this,type,fn,options);};
  EventTarget.prototype.removeEventListener=function(type,fn,options){const rows=registry.get(this)||[];const i=rows.findIndex(r=>r.type===type&&r.fn===fn&&r.capture===capture(options));if(i>=0){rows.splice(i,1);window.__listenerCount--;}return remove.call(this,type,fn,options);};
  window.__listenerStats=()=>({window:(registry.get(window)||[]).length,document:(registry.get(document)||[]).length,connectedDOM:[...document.querySelectorAll('*')].reduce((n,target)=>n+(registry.get(target)||[]).length,0)});
  const intervals=new Set(),startInterval=window.setInterval,endInterval=window.clearInterval;
  window.setInterval=(...args)=>{const id=startInterval(...args);intervals.add(id);return id;};
  window.clearInterval=id=>{intervals.delete(id);return endInterval(id);};window.__intervals=intervals;
  if(localStorage.getItem('fixture_quota')==='1'){const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===sessionStorage)throw new DOMException('fixture full','QuotaExceededError');return set.call(this,k,v);};}

  window.addEventListener('mba:auth-state',e=>window.__metrics.auth.push({t:performance.now(),status:e.detail.status}));
  for(const type of ['layout-shift','longtask'])try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics[type==='longtask'?'long':'shifts'].push({t:e.startTime,value:e.value,duration:e.duration,hadRecentInput:e.hadRecentInput});}).observe({type,buffered:true});}catch{}
 });
 let closingSummaryFails=false;let analysisBusyOnce=false;let analysisUnavailableOnce=false;let analysisBusyCalls=0;let analysisFirstBusyAt=0;let analysisRecoveryAt=0;
 let overviewDelay=0;
 let meGate=null;
 let delay=0,meStatus=200,meReason=null,meDelay=0,detailDelay=0,currentProfile=profile,resultStatus=200,resultCount=null;
 await context.route('https://api.portilhobackoffice.site/**',async route=>{
  const url=new URL(route.request().url());calls.push({t:Date.now(),path:url.pathname,query:url.search});
  if(url.pathname==='/api/me'){if(meGate)await meGate;if(meDelay)await new Promise(r=>setTimeout(r,meDelay));return route.fulfill({status:meStatus,json:meStatus===200?currentProfile:{error:'Fixture indisponível',reason:meReason,code:meStatus===401?'SESSION_INVALID':meStatus===403?'PROFILE_NOT_AUTHORIZED':'AUTH_DEPENDENCY_UNAVAILABLE'}});}
  if(url.pathname==='/api/events/stream')return route.fulfill({status:403,json:{code:'REALTIME_PAUSED',error:'Fixture stream paused'}});
  if(url.pathname==='/api/me/state')return route.fulfill({json:{id:currentProfile.id,policy_epoch:currentProfile.policy_epoch||'legacy'}});
  if(url.pathname==='/api/tasks/results'){if(delay)await new Promise(r=>setTimeout(r,delay));return route.fulfill({status:resultStatus,json:resultStatus===200?payload(resultCount ?? (url.searchParams.get('period')==='7'?7:30)):{error:'Falha fixture',code:'DEPENDENCY_UNAVAILABLE'}});}
  if(url.pathname==='/api/carteira-processual'){if(overviewDelay)await new Promise(r=>setTimeout(r,overviewDelay));return route.fulfill({json:{summary:{total:10,active:10,closed:0,unknown:0},movement:{entries:10,closures:0,balance:10},charts:{timeline:[],por_uf:[],por_produto:[],aging:[]},filters:{states:[],products:[],resolutions:[]},updated_at:new Date().toISOString()}});}
  if(url.pathname==='/api/base-geral/summary')return route.fulfill({json:{summary:{total:10,active:10,closed:0,unknown:0},charts:{por_produto:[]},filters:{states:[],products:[],resolutions:[]}}});
  if(url.pathname==='/api/operacao/encerramentos/dashboard'&&closingSummaryFails)return route.fulfill({status:503,json:{code:'DEPENDENCY_UNAVAILABLE',error:'Resumo indisponível fixture'}});
  if(url.pathname==='/api/operacao/encerramentos/dashboard')return route.fulfill({json:{carteira:'Agibank Enter',tipo:null,indicadores:{consultados:19,encontrados:19,analisados:19,ticket_medio:null,ticket_amostra:0,aging_medio:null},aging:[],estados:[],analistas:[],classificacoes:[],distribuicao_tipos:[],etapas:{etapa:'validados',total:19,tipos:[],aging:[],matriz:[],fonte:'fixture',mensagem:''}}});
  if(url.pathname==='/api/operacao/encerramentos/analises'){if(analysisUnavailableOnce){analysisUnavailableOnce=false;return route.fulfill({status:503,json:{code:'DEPENDENCY_UNAVAILABLE',error:'Fixture transiente'}});}if(analysisBusyOnce){analysisBusyCalls++;if(analysisBusyCalls===1){analysisFirstBusyAt=Date.now();return route.fulfill({status:429,headers:{'Retry-After':'2','Access-Control-Expose-Headers':'Retry-After'},json:{code:'ANALYTICS_BUSY',error:'Capacidade analítica ocupada.'}});}analysisRecoveryAt=Date.now();}if(detailDelay)await new Promise(r=>setTimeout(r,detailDelay));return route.fulfill({json:{total:23,rows:[],analistas:[],limit:20,offset:0}});}
  if(url.pathname==='/api/operacao/encerramentos/consolidado-mensal')return route.fulfill({json:{periodo:'2026-10',unidade:'andamentos',fonte:'fixture',mes_vigente:{enviados:25,sem_baixa:20,com_baixa:5},saldo_mes_anterior:{periodo:'2026-09',pendentes:5},total_em_acompanhamento:30,total_sem_baixa:25,total_com_baixa_no_mes_vigente:5}});
  if(url.pathname==='/api/operacao/encerramentos/meta-aging-mensal')return route.fulfill({json:{periodo:'2026-10',carteira:'Agibank Regular',total_elegivel:10,total_com_faixa:10,sem_tag:0,aging:[{faixa:'0–12 meses',quantidade:3},{faixa:'12–24 meses',quantidade:3},{faixa:'>24 meses',quantidade:4}],origens:{validacoes_do_mes:10,historico_adicional:0,do_mes_adicionais:0,herdados_adicionais:0,sobreposicoes_deduplicadas:0,movimentos_excluidos_por_tipo:0}}});
  if(url.pathname==='/api/operacao/encerramentos/casos')return route.fulfill({json:{total:0,rows:[]}});
  return route.fulfill({json:[]});
 });
 page=await context.newPage();page.on('crash',()=>browserLifecycle.push({event:'page_crashed',t:Date.now()}));page.on('close',()=>{if(!cleaningUp)browserLifecycle.push({event:'page_closed',t:Date.now()});});page.on('console',message=>{if(message.type()==='error'&&!message.text().startsWith('Failed to load resource:'))consoleErrors.push(message.text());});page.on('pageerror',e=>{errors.push(e.message);console.log('PAGEERROR',e.message);});
 const test=async(id,fn)=>{if(process.env.TEST_IDS && !process.env.TEST_IDS.split(',').includes(id))return;const start=performance.now();try{const detail=await fn();results.push({id,status:'PASSOU',ms:performance.now()-start,detail});}catch(e){results.push({id,status:'FALHOU',ms:performance.now()-start,error:e.message});}try{results.at(-1).measurement=await page.evaluate(()=>({paint:performance.getEntriesByType('paint').map(e=>({name:e.name,startTime:e.startTime})),navigation:performance.getEntriesByType('navigation').map(e=>({domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd,type:e.type})),shifts:window.__metrics.shifts,longTasks:window.__metrics.long,route:location.pathname,authFlows:window.MBA_RUNTIME_AUTH_METRICS,queries:window.MBA_RUNTIME_QUERY_METRICS}));}catch(error){results.at(-1).status='FALHOU';results.at(-1).measurementError=error instanceof Error?error.message:String(error);}console.log(JSON.stringify(results.at(-1)));delay=0;await page.screenshot({path:`${out}/${id}.png`,fullPage:true});};
 await page.goto(base+'/tarefas/resultados');await page.locator('body.auth-signed-in').waitFor();
 if(process.env.BROWSER_TERMINATION_PROBE==='1')await test('PROBE-browser-close',async()=>{await browser.close();await page.evaluate(()=>true);});
 await test('A01',async()=>{await page.evaluate(()=>window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:window.MBA_CURRENT_USER})));assert.deepEqual(await page.evaluate(()=>window.MBA_CURRENT_USER.permissions),profile.permissions);await page.locator('.task-results-stat').first().waitFor({timeout:3000});});
 if(phase.startsWith('baseline')){
  // Counterfactual isolation only: original interceptor masks lifecycle defects.
  await context.route('**/react-compat.js*',route=>route.fulfill({contentType:'text/javascript',body:''}));await page.reload();
 }
 await page.locator('.task-results-stat').first().waitFor({timeout:5000});
 await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
 const navigate=async route=>{await page.waitForFunction(()=>typeof window.MBA_NAVIGATE==='function');return page.evaluate(r=>window.MBA_NAVIGATE(r),route);};
 await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='baseline-node');
 await test('A02',async()=>{
  const filter=page.locator('.task-results-filters select').first();
  await filter.selectOption('90');await page.waitForTimeout(150);
  await page.getByLabel('Ordenar colaboradores').selectOption('name');
  await page.evaluate(()=>scrollTo(0,100));const scroll=await page.evaluate(()=>scrollY);assert.ok(scroll>0);
  const count=calls.filter(c=>c.path==='/api/tasks/results').length;
  await page.locator('.main-nav [data-page="dashboard"]').click();
  await page.locator('.main-nav [data-page="tarefas"]').click();
  await page.waitForTimeout(150);
  assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'baseline-node');
  assert.equal(await filter.inputValue(),'90');assert.equal(await page.getByLabel('Ordenar colaboradores').inputValue(),'name');
  assert.equal(await page.evaluate(()=>scrollY),scroll);
  assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,count);
  await filter.selectOption('30');await page.getByLabel('Ordenar colaboradores').selectOption('most');await page.evaluate(()=>scrollTo(0,0));
 });
 await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='subtab-node');
 await test('A03',async()=>{
  const filter=page.locator('.task-results-filters select').first();await filter.selectOption('90');
  await page.getByLabel('Ordenar colaboradores').selectOption('least');await page.evaluate(()=>scrollTo(0,100));const scroll=await page.evaluate(()=>scrollY);
  await navigate('tarefas/atribuicoes');await page.locator('.assignments-board').waitFor();
  await navigate('tarefas/resultados');await page.waitForTimeout(150);
  assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'subtab-node');assert.equal(await filter.inputValue(),'90');
  assert.equal(await page.getByLabel('Ordenar colaboradores').inputValue(),'least');assert.equal(await page.evaluate(()=>scrollY),scroll);
  await filter.selectOption('30');await page.getByLabel('Ordenar colaboradores').selectOption('most');await page.evaluate(()=>scrollTo(0,0));
 });
 await test('A04',async()=>{await page.locator('.task-results-stat').first().waitFor();delay=15000;const before=await page.locator('.task-results-stats').boundingBox();await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.waitForTimeout(300);assert.equal(await page.locator('.task-results-stat').count(),4);assert.deepEqual(await page.locator('.task-results-stats').boundingBox(),before);await page.waitForTimeout(15000);delay=0;});
 await test('A05',async()=>{delay=15000;await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForTimeout(250);assert.equal(await page.locator('.task-results-stat').count(),4);assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'—');assert.ok(!(await page.locator('.task-results-method').innerText()).includes('1970'));await page.waitForTimeout(15000);assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'7');delay=0;});
 await test('A06',async()=>{
  await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');await page.getByLabel('Ordenar colaboradores').selectOption('name');
  let release;meGate=new Promise(resolve=>release=resolve);delay=15000;
  try{
   await page.reload();assert.ok(await page.locator('.app-shell').isVisible());await page.locator('.task-results-stat').first().waitFor();assert.equal(await page.locator('.task-results-stat').count(),4);
   assert.notEqual(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'authenticated');
   assert.equal(await page.locator('.task-results-stat strong').allTextContents().then(values=>values.some(v=>v!=='—')),false,'nenhum valor antes da identidade validada');
   release();meGate=null;await page.locator('body.auth-signed-in').waitFor();await page.locator('.task-results-stat').first().waitFor();
   assert.equal(await page.locator('.task-results-filters select').first().inputValue(),'7');assert.equal(await page.getByLabel('Ordenar colaboradores').inputValue(),'name');
   assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'7','resumo autorizado restaurado enquanto consulta nova aguarda');
   await page.waitForTimeout(15000);
  }finally{release();meGate=null;meDelay=0;}
 });
 if(!phase.startsWith('baseline') && phase!=='m1'){
  await test('A07',async()=>{
   await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');
   for(const mode of ['corrupt','expired','schema']){
    await page.evaluate(mode=>{for(const key of Object.keys(sessionStorage))if(key.startsWith('mba_runtime_summary:')&&JSON.parse(key.slice('mba_runtime_summary:'.length))[1]?.period==='7'){if(mode==='corrupt')sessionStorage.setItem(key,'{broken');else{const v=JSON.parse(sessionStorage.getItem(key));if(mode==='expired')v.at=Date.now()-121000;else v.version=999;sessionStorage.setItem(key,JSON.stringify(v));}}},mode);
    const before=calls.filter(c=>c.path==='/api/tasks/results').length;await page.reload();await page.locator('body.auth-signed-in').waitFor();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');
    assert.equal(await page.locator('.task-results-stat').count(),4);assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,before+1);await page.waitForFunction(()=>Object.keys(sessionStorage).some(key=>{if(!key.startsWith('mba_runtime_summary:')||JSON.parse(key.slice('mba_runtime_summary:'.length))[1]?.period!=='7')return false;try{const value=JSON.parse(sessionStorage.getItem(key));return value.version===1&&Date.now()-value.at<120000;}catch{return false;}}));
   }
  });
  await test('A07-quota',async()=>{await page.evaluate(()=>localStorage.setItem('fixture_quota','1'));await page.reload();await page.locator('body.auth-signed-in').waitFor();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');assert.equal(await page.locator('.task-results-stat').count(),4);await page.evaluate(()=>localStorage.removeItem('fixture_quota'));await page.reload();await page.locator('body.auth-signed-in').waitFor();});
  await test('A10',async()=>{const tab=await context.newPage();await tab.goto(base+'/tarefas/resultados');await tab.locator('body.auth-signed-in').waitFor();assert.equal(calls.filter(c=>c.path==='/auth/microsoft/start').length,0);await tab.close();return {coverage:'Duas abas sem OAuth; substituição em outro navegador e Admin SQL não exercitados'};});
  await test('A11',async()=>{let release;await context.route('**/api/runtime-race',async route=>{await new Promise(r=>release=r);await route.fulfill({status:401,json:{code:'SESSION_INVALID'}});});await page.evaluate(()=>{window.__race=window.MBA_API.request('/api/runtime-race').catch(e=>e.code);});while(!release)await page.waitForTimeout(10);await page.evaluate(()=>localStorage.setItem('mba_session_token','ba_new_fixture'));release();await page.waitForFunction(()=>window.__race);assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),'ba_new_fixture');assert.equal(await page.evaluate(()=>window.__race),'STALE_IDENTITY');await page.evaluate(()=>localStorage.setItem('mba_session_token','ba_runtime_fixture'));
   let payloadRelease;await context.route('**/api/runtime-payload-race',async route=>{await new Promise(r=>payloadRelease=r);await route.fulfill({json:{oldPortfolio:'Enter'}});});
   await page.evaluate(()=>{window.__payloadRace=window.MBA_API.request('/api/runtime-payload-race').catch(e=>e.code);});while(!payloadRelease)await page.waitForTimeout(10);
   await page.evaluate(()=>window.MBA_API.setPortfolioId('nubank_mba'));
   await page.waitForFunction(()=>window.MBA_CURRENT_USER&&!document.body.classList.contains('auth-validating'));
   payloadRelease();assert.equal(await page.evaluate(()=>window.__payloadRace),'STALE_IDENTITY');assert.equal(await page.evaluate(()=>window.MBA_API.getPortfolioId()),'nubank_mba');
   await page.evaluate(()=>window.MBA_API.setPortfolioId('agibank_enter'));await page.waitForFunction(()=>window.MBA_CURRENT_USER&&!document.body.classList.contains('auth-validating'));
   await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');
  });
  await test('AS01-recover-429',async()=>{
    analysisBusyOnce=true;analysisBusyCalls=0;
    await navigate('analytics/encerramentos');
    await page.getByRole('button',{name:/Aptidões: 19/}).waitFor({timeout:4000});
    await page.waitForFunction(()=>document.querySelector('.closing-kpis')?.textContent?.includes('23'),{},{timeout:6000});
    assert.equal(analysisBusyCalls,2);assert.ok(analysisRecoveryAt-analysisFirstBusyAt>=2000);
    return {requests:analysisBusyCalls,retryAfterMs:analysisRecoveryAt-analysisFirstBusyAt};
  });
  await test('AS02-independent-kpi',async()=>{
    await navigate('tarefas/resultados');closingSummaryFails=true;
    await page.evaluate(()=>window.dispatchEvent(new Event('mba:portfolio-changed')));
    await navigate('analytics/encerramentos');
    await page.waitForFunction(()=>document.querySelector('.closing-kpis')?.textContent?.includes('23'),{},{timeout:4000});
    const before=await page.locator('.closing-kpis').boundingBox();
    await page.waitForTimeout(2500);
    const after=await page.locator('.closing-kpis').boundingBox();assert.equal(before.height,after.height);
    closingSummaryFails=false;return {independentAnalyses:true,kpiHeight:after.height};
  });
  await test('AS03-cancel-reentry',async()=>{
    await navigate('tarefas/resultados');
    for(let i=0;i<3;i++){await navigate('analytics/encerramentos');await page.waitForTimeout(30);await navigate('tarefas/resultados');}
    await navigate('analytics/encerramentos');
    await page.getByRole('button',{name:/Aptidões: 19/}).waitFor({timeout:4000});
    return {rapidReentries:3,summaryVisible:true};
  });
  await test('AS04-recover-503',async()=>{
    await navigate('tarefas/resultados');analysisBusyOnce=false;analysisUnavailableOnce=true;
    await page.evaluate(()=>window.dispatchEvent(new Event('mba:portfolio-changed')));
    const count=calls.filter(c=>c.path.endsWith('/analises')).length;
    await navigate('analytics/encerramentos');
    await page.waitForFunction(()=>document.querySelector('.closing-kpis')?.textContent?.includes('23'),{},{timeout:4000});
    assert.equal(calls.filter(c=>c.path.endsWith('/analises')).length-count,2);
    return {requests:2,recovered503:true};
  });
  await test('AS05-preserve-partial-refresh',async()=>{
    await navigate('tarefas/resultados');closingSummaryFails=true;analysisBusyOnce=false;
    await page.evaluate(()=>window.dispatchEvent(new Event('mba:portfolio-changed')));
    await navigate('analytics/encerramentos');
    await page.waitForFunction(()=>document.querySelector('.closing-kpis')?.textContent?.includes('23'),{},{timeout:4000});
    await page.waitForFunction(()=>document.querySelector('.closing-page-v2')?.getAttribute('aria-busy')==='false',{},{timeout:5000});
    detailDelay=1500;
    const count=calls.filter(c=>c.path.endsWith('/analises')).length;
    await page.evaluate(()=>window.dispatchEvent(new Event('mba:closing-analysis-saved')));
    await page.waitForFunction(()=>document.querySelector('.closing-page-v2')?.getAttribute('aria-busy')==='true');
    await page.waitForTimeout(100);
    assert.ok((await page.locator('.closing-kpis').innerText()).includes('23'),'same-key analyses disappeared after failed summary');
    await page.waitForFunction(()=>document.querySelector('.closing-page-v2')?.getAttribute('aria-busy')==='false',{},{timeout:6000});
    assert.ok(calls.filter(c=>c.path.endsWith('/analises')).length>count);
    detailDelay=0;closingSummaryFails=false;
    return {partialSnapshotPreserved:true};
  });
  await test('AS06-independent-aging-benner',async()=>{
    await navigate('tarefas/resultados');closingSummaryFails=true;analysisBusyOnce=false;
    await page.evaluate(()=>window.MBA_API.setPortfolioId('agibank_mba'));
    await navigate('analytics/encerramentos');
    await page.waitForFunction(()=>document.querySelector('.closing-kpis')?.textContent?.includes('30'),{},{timeout:4000});
    await page.waitForFunction(()=>document.querySelector('.closing-page-v2')?.getAttribute('aria-busy')==='false',{},{timeout:5000});
    assert.equal(await page.locator('.closing-aging-cards article').count(),3,'Regular aging must not depend on summary success');
    await page.getByRole('button',{name:/Andamentos Benner: 30/}).click();
    assert.equal(await page.locator('.closing-monthly-total strong').innerText(),'30');
    await page.getByRole('button',{name:'Fechar andamentos Benner'}).click();
    closingSummaryFails=false;await navigate('tarefas/resultados');await page.evaluate(()=>window.MBA_API.setPortfolioId('agibank_enter'));
    return {regularAgingIndependent:true,bennerDialogIndependent:true};
  });
  await test('AS07-hidden-overview-abort',async()=>{
    await navigate('tarefas/resultados');overviewDelay=1500;
    await page.evaluate(()=>{
      window.__overviewAbortCount=0;window.__reviewOriginalFetch=window.fetch;
      window.fetch=function(input,init){
        if(String(input).includes('/api/carteira-processual'))init?.signal?.addEventListener('abort',()=>window.__overviewAbortCount++,{once:true});
        return window.__reviewOriginalFetch.call(this,input,init);
      };
      window.dispatchEvent(new Event('mba:portfolio-changed'));
    });
    const count=calls.filter(c=>c.path==='/api/carteira-processual').length;
    await navigate('analytics');
    await page.waitForFunction(()=>document.querySelector('.overview-refresh')?.disabled);
    await page.waitForTimeout(100);await navigate('tarefas/resultados');await page.waitForTimeout(100);
    assert.ok(await page.evaluate(()=>window.__overviewAbortCount>0),'hidden overview kept its in-flight analytical request');
    assert.equal(calls.filter(c=>c.path==='/api/carteira-processual').length,count+1);
    await page.evaluate(()=>{window.fetch=window.__reviewOriginalFetch;delete window.__reviewOriginalFetch;});overviewDelay=0;
    return {cancelledOnModuleHide:true};
  });
  await test('A13',async()=>{detailDelay=15000;const started=performance.now();await navigate('analytics/encerramentos');await page.getByRole('button',{name:/Aptidões: 19/}).waitFor({timeout:4000});const kpiMs=performance.now()-started;assert.ok(kpiMs<4000);assert.ok(calls.some(c=>c.path.endsWith('/analises')));await page.waitForTimeout(15000);detailDelay=0;return {kpiMs,detailDelayMs:15000};});
  await navigate('tarefas/resultados');
  await test('A14',async()=>{const fresh=await context.newPage();const before=calls.length;await fresh.goto(base+'/tarefas/resultados');await fresh.locator('body.auth-signed-in').waitFor();await fresh.waitForTimeout(250);const journey=calls.slice(before);await fresh.close();assert.equal(journey.filter(c=>c.path==='/api/tasks'||c.path.startsWith('/api/base-geral')||c.path.startsWith('/api/operacao/encerramentos/')).length,0);return journey;});
  await test('A05-Entradas',async()=>{
  await navigate('analytics');await page.waitForFunction(()=>document.querySelector('.overview-metric strong')?.textContent==='10');
  const before=await page.locator('.overview-kpis').boundingBox();overviewDelay=15000;
  await page.locator('.overview-refresh').click();await page.waitForTimeout(250);
  assert.equal(await page.locator('.overview-metric strong').first().textContent(),'10');
  assert.deepEqual(await page.locator('.overview-kpis').boundingBox(),before);
  await page.waitForFunction(()=>!document.querySelector('.overview-refresh')?.disabled,{},{timeout:17000});
  await page.locator('.overview-filters select').first().selectOption('90');await page.waitForTimeout(200);
  assert.equal(await page.locator('.overview-metric strong').first().textContent(),'—');
  assert.ok(Math.abs((await page.locator('.overview-kpis').boundingBox()).height-before.height)<.5);
  await page.waitForFunction(()=>document.querySelector('.overview-metric strong')?.textContent==='10',{},{timeout:17000});
  overviewDelay=0;await navigate('tarefas/resultados');return {sameKeyDelayMs:15000,newKeyDelayMs:15000};
 });
 await test('A14-realtime-paused',async()=>{await page.reload();await page.locator('body.auth-signed-in').waitFor();await page.waitForTimeout(200);const count=calls.filter(c=>c.path==='/api/events/stream').length;await page.waitForTimeout(2200);assert.equal(calls.filter(c=>c.path==='/api/events/stream').length,count,'Realtime pausado não deve reconectar em avalanche');});
 await test('A15-legacy-api',async()=>{
  currentProfile={...profile,runtime_features:{write_intents:false}};
  await page.reload();await page.locator('body.auth-signed-in').waitFor();
  const path='/api/task-processes/12345678-1234-4234-8234-123456789abc/encerramento-analysis';const sent=[];
  await context.route('**'+path,route=>{sent.push(route.request().headers());return route.fulfill({json:{saved:true}});});
  await page.evaluate(path=>window.MBA_API.request(path,{method:'POST',body:'{}'}),path);
  assert.equal(sent.length,1);assert.equal(sent[0]['idempotency-key'],undefined);
  assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('mba_write_intent:')).length),0);
  await context.unroute('**'+path);currentProfile=profile;
  await page.reload();await page.locator('body.auth-signed-in').waitFor();
  return {oldBackendSupported:true,unsupportedHeaders:0,permissionMutation:false};
 });
 await test('A15-skip-intent',async()=>{
  const path='/api/task-processes/12345678-1234-4234-8234-123456789abc/skip';let status=503;const sent=[];
  await context.route('**'+path,async route=>{
   sent.push({id:route.request().headers()['idempotency-key'],body:route.request().postDataJSON()});
   await new Promise(r=>setTimeout(r,150));
   return route.fulfill({status,json:status===200?{id:'fixture-process',status:'pending'}:{code:'WRITE_OUTCOME_UNKNOWN',error:'Fixture skip unavailable'}});
  });
  const call=at=>page.evaluate(({path,at})=>window.MBA_API.request(path,{method:'POST',body:JSON.stringify({client_action_at:at})}).then(()=>true,()=>false),{path,at});
  assert.deepEqual(await Promise.all([call('2026-10-25T23:00:00Z'),call('2026-10-25T23:00:01Z')]),[false,false]);
  assert.equal(sent.length,1);assert.match(sent[0].id,/^[0-9a-f-]{36}$/);
  const pending=await page.evaluate(()=>Object.entries(sessionStorage).filter(([key])=>key.startsWith('mba_write_intent:')));
  assert.equal(pending.length,1);assert.ok(!JSON.stringify(pending).includes('2026-10-25'));
  await page.reload();await page.locator('body.auth-signed-in').waitFor();assert.equal(sent.length,1);
  status=200;assert.equal(await call('2026-10-25T23:00:02Z'),true);
  assert.equal(sent.length,2);assert.equal(sent[1].id,sent[0].id);
  assert.notEqual(sent[1].body.client_action_at,sent[0].body.client_action_at);
  assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('mba_write_intent:')).length),0);
  await context.unroute('**'+path);
  return {concurrentCalls:2,commands:2,automaticRetries:0,sameIntentAfterF5:true,telemetryTimestampNotBusinessPayload:true};
 });
 await test('A15-write-intent',async()=>{
  const path='/api/task-processes/12345678-1234-4234-8234-123456789abc/encerramento-analysis';let status=503;const sent=[];
  await context.route('**'+path,async route=>{sent.push(route.request().headers()['idempotency-key']);await new Promise(r=>setTimeout(r,250));return route.fulfill({status,json:status===201?{saved:true}:{code:'WRITE_DEPENDENCY_UNAVAILABLE',error:'Fixture write unavailable'}});});
  const body=JSON.stringify({decision:'inapto',notes:'Private draft fixture'});
  const first=await page.evaluate(async({path,body})=>Promise.allSettled([window.MBA_API.request(path,{method:'POST',body}),window.MBA_API.request(path,{method:'POST',body})]).then(rows=>rows.map(r=>r.status)),{path,body});
  assert.deepEqual(first,['rejected','rejected']);assert.equal(sent.length,1);assert.match(sent[0],/^[0-9a-f-]{36}$/);
  const stored=await page.evaluate(()=>Object.entries(sessionStorage).filter(([key])=>key.startsWith('mba_write_intent:')));
  assert.equal(stored.length,1);assert.ok(!JSON.stringify(stored).includes('Private draft fixture'));
  assert.deepEqual(Object.keys(JSON.parse(stored[0][1])).sort(),['at','id','version']);
  await page.reload();await page.locator('body.auth-signed-in').waitFor();assert.equal(sent.length,1,'No automatic write on F5');
  status=201;assert.deepEqual(await page.evaluate(({path,body})=>window.MBA_API.request(path,{method:'POST',body}),{path,body}),{saved:true});
  assert.equal(sent.length,2);assert.equal(sent[1],sent[0],'Same operation ID recovered after F5');
  assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(key=>key.startsWith('mba_write_intent:')).length),0);
  await context.unroute('**'+path);return {networkCommands:2,concurrentCalls:2,automaticRetries:0,recoveredIntent:true};
 });
 await test('A11-handoff-same-user',async()=>{
  await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='old-session-node');
  const generation=await page.evaluate(()=>window.MBA_SESSION_GENERATION);
  await context.route('**/auth/session/exchange',route=>route.fulfill({json:{access_token:'ba_fixture_new_intentional_session'}}));
  await page.evaluate(()=>{sessionStorage.setItem('mba_oauth_handoff','fixture-handoff');sessionStorage.setItem('mba_oauth_verifier','fixture-verifier');window.dispatchEvent(new Event('mba:authorization-invalidated'));});
  await page.waitForFunction(()=>localStorage.getItem('mba_session_token')==='ba_fixture_new_intentional_session'&&window.MBA_AUTH.getLoginState().status==='authenticated');
  assert.notEqual(await page.evaluate(()=>window.MBA_SESSION_GENERATION),generation);
  await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
  assert.notEqual(await page.locator('.task-results-page').getAttribute('data-instance'),'old-session-node');
  assert.equal(calls.filter(c=>c.path==='/auth/microsoft/start').length,0);
  await context.unroute('**/auth/session/exchange');
  await page.evaluate(()=>{localStorage.setItem('mba_session_token','ba_runtime_fixture');window.dispatchEvent(new StorageEvent('storage',{key:'mba_session_token'}));});
  await page.waitForFunction(()=>window.MBA_AUTH.getLoginState().status==='authenticated');return {scopePurgedForSameUserNewSession:true,oauthStarts:0};
 });
 await test('A17',async()=>{
   await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='7');
   const statuses=[];
   for(const status of [429,502,503,504]){
    resultStatus=status;const before=calls.filter(c=>c.path==='/api/tasks/results').length;await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.getByRole('alert').filter({hasText:'Não foi possível atualizar'}).waitFor();
    assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'7');assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,before+1);
    resultStatus=200;await page.getByRole('button',{name:'Tentar novamente',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.task-results-error'));statuses.push(status);
   }
   const before=calls.filter(c=>c.path==='/api/tasks/results').length;await page.evaluate(()=>window.MBA_API.request('/api/task-processes/fixture/activity',{method:'POST',body:'{}'}));await page.waitForTimeout(150);assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,before+1);
   return {statuses,mutationInvalidation:true};
  });
  await test('A18',async()=>{
  const memorySession=browserName==='chromium'?await context.newCDPSession(page):null;
  const preciseHeap=async()=>{if(!memorySession)return null;await memorySession.send('HeapProfiler.collectGarbage');return memorySession.send('Runtime.getHeapUsage');};
  await navigate('analytics');await page.locator('.overview-page').waitFor();await page.waitForFunction(()=>!document.querySelector('.overview-refresh')?.disabled);await page.evaluate(()=>new Promise(requestAnimationFrame));await navigate('tarefas/resultados');await page.waitForTimeout(100);const preciseBefore=await preciseHeap();const before=await page.evaluate(()=>({heap:performance.memory?.usedJSHeapSize,listeners:window.__listenerStats(),intervals:window.__intervals.size,dom:document.querySelectorAll('*').length}));const startCalls=calls.filter(c=>c.path==='/api/tasks/results').length;await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='fifty');const runs=[],checkpoints=[];for(let i=0;i<50;i++){const start=await page.evaluate(()=>performance.now());await navigate('analytics');await navigate('tarefas/resultados');runs.push(await page.evaluate(t=>performance.now()-t,start));if(i%10===9)checkpoints.push(await page.evaluate(()=>({listeners:window.__listenerStats(),intervals:window.__intervals.size,heap:performance.memory?.usedJSHeapSize})));}assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'fifty');assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,startCalls);const after=await page.evaluate(()=>({heap:performance.memory?.usedJSHeapSize,listeners:window.__listenerStats(),intervals:window.__intervals.size,dom:document.querySelectorAll('*').length}));assert.deepEqual(after.listeners,before.listeners,JSON.stringify({before,after,checkpoints}));assert.equal(after.intervals,before.intervals);return {roundTripsMs:runs,before,after,checkpoints,navigation:await page.evaluate(()=>window.MBA_RUNTIME_METRICS),preciseHeap:{before:preciseBefore,after:await preciseHeap()},coverage:'50 navegações, DOM, requests, listeners e intervals; heap pós-GC em Chromium, sem certificação geral de ausência de leak'};});
  await test('A02-stale',async()=>{
  const old=await page.locator('.task-results-stat strong').first().textContent();
  const before=calls.filter(c=>c.path==='/api/tasks/results').length;
  await navigate('analytics');await page.waitForTimeout(46000);delay=1000;
  await navigate('tarefas/resultados');assert.equal(await page.locator('.task-results-stat strong').first().textContent(),old);
  await page.waitForTimeout(200);assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length-before,1);
  await page.waitForFunction(()=>![...document.querySelectorAll('.task-results-page button')].find(b=>b.textContent.includes('Atualizar'))?.disabled);
  assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length-before,1);
  return {freshnessWaitMs:46000,revalidations:1,previousSnapshotVisible:true};
 });
 await test('A19',async()=>{assert.equal(errors.length,0,JSON.stringify(errors));await navigate('tarefas/atribuicoes');assert.ok(await page.locator('.task-results-page').isHidden());assert.equal(await page.getByRole('heading',{name:'Produtividade',exact:true}).count(),0);await navigate('tarefas/resultados');});
  await test('A12',async()=>{const states=[];for(const role of ['admin','legal_leader','analyst'])for(const portfolio of ['agibank_enter','agibank_mba','nubank_mba']){currentProfile={...profile,id:'fixture-'+role,role,is_master_admin:role==='admin',permissions:{...profile.permissions,'tasks.view_others':role!=='analyst','tasks.manage':role!=='analyst','tasks.assign':role!=='analyst'}};resultCount=10+states.length;await page.evaluate(id=>window.MBA_API.setPortfolioId(id),portfolio);await page.reload();await page.waitForFunction(n=>document.querySelector('.task-results-stat strong')?.textContent===String(n),resultCount);assert.equal(await page.evaluate(id=>Object.keys(sessionStorage).filter(k=>k.startsWith('mba_runtime_summary:')).every(k=>k.includes(id)),currentProfile.id),true);states.push({role,portfolio,count:resultCount});}currentProfile=profile;resultCount=null;await page.evaluate(()=>window.MBA_API.setPortfolioId('agibank_enter'));await page.reload();await page.locator('body.auth-signed-in').waitFor();return {coverage:'9 combinações com autorização fixture; não comprova RLS/SQL',states};});
  await test('A20',async()=>{await page.evaluate(()=>sessionStorage.setItem('mba-qa-v2:fixture-analyst:agibank_enter:fixture:fixture','{}'));await page.evaluate(()=>{window.MBA_CURRENT_USER={...window.MBA_CURRENT_USER,permissions:{...window.MBA_CURRENT_USER.permissions,'tasks.view':false}};window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:window.MBA_CURRENT_USER}));});await page.waitForTimeout(150);assert.equal(await page.locator('.task-results-page').count(),0);assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('mba-qa-v2:')).length),0);assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('mba_runtime_summary:')).length),0);await page.reload();await page.locator('body.auth-signed-in').waitFor();});
  await test('A20-policy',async()=>{
   currentProfile={...profile,authorization_version:'fixture-policy-1',policy_epoch:'1'};
   await page.reload();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
   const count=calls.filter(c=>c.path==='/api/me').length;
   currentProfile={...currentProfile,authorization_version:'fixture-policy-2',policy_epoch:'2',permissions:{...profile.permissions,'tasks.view':false}};
   await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
   await page.waitForFunction(()=>window.MBA_CURRENT_USER?.authorization_version==='fixture-policy-2');
   assert.equal(await page.locator('.task-results-page').count(),0);
   assert.equal(await page.evaluate(()=>Object.keys(sessionStorage).filter(k=>k.startsWith('mba_runtime_summary:')).length),0);
   assert.equal(calls.filter(c=>c.path==='/api/me').length,count+1);
   assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),'ba_runtime_fixture');
   currentProfile=profile;await page.reload();await page.locator('body.auth-signed-in').waitFor();
  });
  await test('A20-unrelated',async()=>{
   currentProfile={...profile,authorization_version:'same-access',policy_epoch:'10'};
   await page.reload();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
   await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='unrelated-policy');
   await page.evaluate(()=>sessionStorage.setItem('mba-qa-v2:fixture-analyst:agibank_enter:fixture:fixture','{"draft":true}'));
   const before=calls.filter(c=>c.path==='/api/tasks/results').length;
   let writes=0;
   await context.route('**/api/runtime-fixture/write',async route=>{writes++;await new Promise(r=>setTimeout(r,800));return route.fulfill({json:{saved:true}});});
   await page.evaluate(()=>{window.__pendingPolicyWrite=window.MBA_API.request('/api/runtime-fixture/write',{method:'POST',body:'{}'}).then(value=>({value}),error=>({error:error.message}));});
   currentProfile={...currentProfile,policy_epoch:'11'};
   await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
   await page.waitForFunction(()=>window.MBA_CURRENT_USER?.policy_epoch==='11');
   assert.deepEqual(await page.evaluate(()=>window.__pendingPolicyWrite),{value:{saved:true}});
   assert.equal(writes,1);assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'unrelated-policy');
   assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,before);
   assert.ok(await page.evaluate(()=>sessionStorage.getItem('mba-qa-v2:fixture-analyst:agibank_enter:fixture:fixture')));
   await context.unroute('**/api/runtime-fixture/write');currentProfile=profile;await page.reload();await page.locator('body.auth-signed-in').waitFor();
  });
 }
 if(process.env.PERFORMANCE_PROBE==='1')await test('A06-shell',async()=>{
  const samples=[];
  for(let i=0;i<8;i++){
   let release;meGate=new Promise(resolve=>release=resolve);
   try{
    await page.reload();await page.waitForFunction(()=>window.__shellGeometryMs>0);
    assert.notEqual(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'authenticated');
    assert.equal(await page.locator('.task-results-stat strong').allTextContents().then(v=>v.some(x=>x!=='—')),false);
    release();meGate=null;await page.locator('body.auth-signed-in').waitFor();
    await page.waitForFunction(()=>window.__firstKpiMs>0);
    samples.push(await page.evaluate(()=>({shellMs:window.__shellGeometryMs,kpiMs:window.__firstKpiMs,auth:window.MBA_RUNTIME_AUTH_METRICS.at(-1)})));
   }finally{release();meGate=null;}
  }
  return {cache:'warm assets; repeated document reload; identity response gated until geometry assertion',samples};
 });
 await test('A20-scope-facets',async()=>{
  const facets=[['allowed_modules',['liminar']],['access_kind','administrative'],['is_master_admin',true],['capabilities',{processos:false}]];
  for(const [facet,value]of facets){
   currentProfile={...profile,authorization_version:'fixture-legacy-version'};
   await page.reload();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
   await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='scope-before');
   const before=calls.filter(c=>c.path==='/api/tasks/results').length;
   currentProfile={...currentProfile,[facet]:value};await page.evaluate(()=>window.dispatchEvent(new Event('mba:authorization-invalidated')));
   await page.waitForFunction(()=>document.querySelector('.task-results-page')?.dataset.instance!=='scope-before'&&document.querySelector('.task-results-stat strong')?.textContent==='30');
   assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length-before,1,facet);
  }
  currentProfile=profile;await page.reload();await page.locator('body.auth-signed-in').waitFor();
  return {facets:facets.map(([key])=>key),constantLegacyVersion:true,queryInvalidations:4};
 });
 await test('A08-shared-retry',async()=>{
  let exchanges=0;meStatus=503;
  await context.route('**/auth/session/exchange',route=>{exchanges++;return route.fulfill({status:exchanges===1?503:200,json:exchanges===1?{code:'AUTH_DEPENDENCY_UNAVAILABLE'}:{access_token:'ba_fixture_shared_retry'}});});
  const before=calls.filter(c=>c.path==='/api/me').length;
  try{
   await page.evaluate(()=>{sessionStorage.setItem('mba_oauth_handoff','fixture-combined-handoff');sessionStorage.setItem('mba_oauth_verifier','fixture-combined-verifier');});
   await page.reload();await page.waitForFunction(()=>window.MBA_AUTH.getLoginState().status==='temporarily_unavailable');
   assert.equal(exchanges,2);assert.equal(calls.filter(c=>c.path==='/api/me').length-before,1,'The retry already used by handoff cannot be repeated by /me');
   assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),'ba_fixture_shared_retry');
   assert.equal(await page.locator('body.auth-signed-out').count(),0);
   assert.equal(await page.evaluate(()=>window.MBA_RUNTIME_AUTH_METRICS.at(-1).retries),1);
   return {handoffAttempts:2,profileAttempts:1,totalRetries:1};
  }finally{await context.unroute('**/auth/session/exchange');meStatus=200;await page.reload();await page.locator('body.auth-signed-in').waitFor();}
 });
 await test('A08-active-recovery',async()=>{
  currentProfile={...profile,policy_epoch:'501'};await page.reload();await page.locator('body.auth-signed-in').waitFor();await page.waitForFunction(()=>document.querySelector('.task-results-stat strong')?.textContent==='30');
  await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='active-transient');resultStatus=503;
  await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.getByText('Dados desatualizados',{exact:true}).waitFor();
  meStatus=503;await context.route('**/api/me/state',route=>route.fulfill({status:503,json:{code:'AUTH_DEPENDENCY_UNAVAILABLE',error:'Fixture unavailable'}}));
  await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.locator('body.auth-unavailable').waitFor();
  assert.equal(await page.locator('.task-results-stat strong').first().textContent(),'30');assert.equal(await page.locator('.app-shell').getAttribute('inert'),'');
  meStatus=200;resultStatus=200;const before=calls.filter(c=>c.path==='/api/tasks/results').length;
  await page.getByRole('button',{name:'Tentar novamente',exact:true}).last().click();await page.locator('body.auth-signed-in').waitFor();
  await page.waitForFunction(()=>document.querySelector('.runtime-query-status')?.textContent==='');
  assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length-before,1);assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'active-transient');
  await context.unroute('**/api/me/state');currentProfile=profile;return {revalidation:1,domPreserved:true};
 });
 await test('A09-guard-revoked',async()=>{
  currentProfile={...profile,policy_epoch:'900'};await page.reload();await page.locator('body.auth-signed-in').waitFor();
  await context.route('**/api/me/state',route=>route.fulfill({status:401,json:{code:'SESSION_INVALID',reason:'session_replaced',error:'Fixture revoked'}}));
  await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  await page.locator('body.auth-signed-out').waitFor();
  assert.equal(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'expired_or_revoked');
  assert.match(await page.evaluate(()=>window.MBA_AUTH.getLoginState().error),/novo login/);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),null);assert.equal(await page.locator('.task-results-page').count(),0);
  await context.unroute('**/api/me/state');currentProfile=profile;await page.reload();await page.locator('body.auth-signed-in').waitFor();
 });
 await test('A08',async()=>{meStatus=503;const start=performance.now();await page.reload();await page.waitForFunction(()=>window.MBA_AUTH.getLoginState().status==='temporarily_unavailable',{},{timeout:10500});assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),'ba_runtime_fixture');assert.equal(await page.locator('body.auth-signed-out').count(),0);assert.equal(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'temporarily_unavailable');return {observedMs:performance.now()-start,auth:await page.evaluate(()=>window.__metrics.auth)};});
 if(!phase.startsWith('baseline') && phase!=='m1'){
  await test('A08-timeout',async()=>{
   meStatus=200;meDelay=20000;const count=calls.filter(c=>c.path==='/api/me').length;
   try{await page.reload();await page.waitForFunction(()=>window.MBA_AUTH.getLoginState().status==='temporarily_unavailable',{},{timeout:11000});
    const states=await page.evaluate(()=>window.__metrics.auth);const flow=await page.evaluate(()=>window.MBA_RUNTIME_AUTH_METRICS.at(-1));
    assert.ok(flow.ms<=flow.budgetMs+150,JSON.stringify(flow));assert.equal(calls.filter(c=>c.path==='/api/me').length-count,2);assert.equal(await page.locator('body.auth-signed-out').count(),0);
    return {states,attempts:2,flow};
   }finally{meDelay=0;}
  });
  await test('A09',async()=>{for(const status of [401,403]){meStatus=status;meReason=status===401?'session_replaced':null;await page.reload();await page.locator('body.auth-signed-out').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),null);assert.equal(await page.locator('.task-results-page').count(),0);if(status===401)assert.match(await page.evaluate(()=>window.MBA_AUTH.getLoginState().error),/novo login/);}return {statuses:[401,403],replacementReason:true};});
 }
 await writeFile(out+'/metrics.json',JSON.stringify({timestamp:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fixture:true,browser:browserName,results,calls,errors,consoleErrors,browserLifecycle,network,performance:await page.evaluate(()=>window.__metrics)},null,2));
 await context.tracing.stop({path:out+'/trace.zip'});console.log(JSON.stringify(results,null,2));if(results.some(r=>r.status==='FALHOU')||errors.length||consoleErrors.length||browserLifecycle.length)process.exitCode=1;
}catch(error){
 const fatal=error instanceof Error?error.message:String(error);
 await writeFile(out+'/metrics.json',JSON.stringify({timestamp:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fixture:true,browser:browserName,results,calls,errors,consoleErrors,browserLifecycle,network,fatal},null,2));
 await page?.screenshot({path:out+'/fatal.png',fullPage:true}).catch(()=>{});
 await context?.tracing.stop({path:out+'/trace.zip'}).catch(()=>{});
 console.error(fatal);process.exitCode=1;
}finally{cleaningUp=true;await browser?.close();server.kill();await rm(serveDir,{recursive:true,force:true});}
