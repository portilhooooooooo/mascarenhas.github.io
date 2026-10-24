import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const phase=process.env.PHASE||'baseline';
const out=`docs/runtime-v2/evidence/${phase}`;
await mkdir(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir','dist','--host','127.0.0.1','--port','5186','--strictPort']);
const base='http://127.0.0.1:5186';
const profile={id:'fixture-analyst',email:'runtime@fixture.invalid',name:'Runtime Fixture',role:'user',permissions:Object.fromEntries(['tasks.view','tasks.view_others','tasks.assign','tasks.execute','dashboard.view','encerramentos.view'].map(p=>[p,true])),portfolios:[{id:'agibank_enter',display_name:'Agibank · Enter'},{id:'agibank_regular',display_name:'Agibank · Regular'},{id:'nubank_mba',display_name:'Nubank · MBA'}],default_portfolio_id:'agibank_enter'};
const payload=(n=30)=>({period:'30',people:[{id:'fixture-analyst',name:'Pessoa Fixture',completed:n,analysis_samples:n,median_analysis_seconds:60,mean_analysis_seconds:70,step_samples:n,mean_step_seconds:70,by_type:{encerramento:n}}],summary:{completed:n,today_completed:3,pending:null,growth_percent:null,previous_completed:0,people:1,measured_analyses:n,measured_transitions:n,slowest:null},generated_at:new Date().toISOString(),methodology:'fixture',truncated:false});
let browser;
const results=[],calls=[],errors=[];
try{
 for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,args:['--no-sandbox'],executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.tracing.start({screenshots:true,snapshots:true});
 await context.addInitScript(()=>{
  localStorage.setItem('mba_session_token','ba_runtime_fixture');
  window.__metrics={shifts:[],long:[],marks:[]};
  for(const type of ['layout-shift','longtask'])try{new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics[type==='longtask'?'long':'shifts'].push({t:e.startTime,value:e.value,duration:e.duration});}).observe({type,buffered:true});}catch{}
 });
 let delay=0,meStatus=200;
 await context.route('https://api.portilhobackoffice.site/**',async route=>{
  const url=new URL(route.request().url());calls.push({t:Date.now(),path:url.pathname,query:url.search});
  if(url.pathname==='/api/me')return route.fulfill({status:meStatus,json:meStatus===200?profile:{error:'Dependência indisponível',code:'AUTH_DEPENDENCY_UNAVAILABLE'}});
  if(url.pathname==='/api/tasks/results'){if(delay)await new Promise(r=>setTimeout(r,delay));return route.fulfill({json:payload(url.searchParams.get('period')==='7'?7:30)});}
  return route.fulfill({json:[]});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const test=async(id,fn)=>{const start=performance.now();try{const detail=await fn();results.push({id,status:'PASSOU',ms:performance.now()-start,detail});}catch(e){results.push({id,status:'FALHOU',ms:performance.now()-start,error:e.message});}await page.screenshot({path:`${out}/${id}.png`,fullPage:true});};
 await page.goto(base+'/tarefas/resultados');await page.locator('body.auth-signed-in').waitFor();
 await test('A01',async()=>{assert.deepEqual(await page.evaluate(()=>window.MBA_CURRENT_USER.permissions),profile.permissions);await page.locator('.task-results-stat').first().waitFor({timeout:3000});});
 if(phase==='baseline'){
  // Counterfactual isolation only: original interceptor masks lifecycle defects.
  await context.route('**/react-compat.js*',route=>route.fulfill({contentType:'text/javascript',body:''}));await page.reload();
 }
 await page.locator('.task-results-stat').first().waitFor({timeout:5000});
 const navigate=route=>page.evaluate(r=>window.MBA_NAVIGATE(r),route);
 await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='baseline-node');
 await test('A02',async()=>{const count=calls.filter(c=>c.path==='/api/tasks/results').length;await navigate('analytics');await navigate('tarefas/resultados');await page.waitForTimeout(250);assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'baseline-node');assert.equal(calls.filter(c=>c.path==='/api/tasks/results').length,count);});
 await page.locator('.task-results-page').evaluate(el=>el.dataset.instance='subtab-node');
 await test('A03',async()=>{await navigate('tarefas/atribuicoes');await navigate('tarefas/resultados');await page.waitForTimeout(250);assert.equal(await page.locator('.task-results-page').getAttribute('data-instance'),'subtab-node');});
 await test('A04',async()=>{await page.locator('.task-results-stat').first().waitFor();delay=15000;const before=await page.locator('.task-results-stats').boundingBox();await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.waitForTimeout(300);assert.equal(await page.locator('.task-results-stat').count(),4);assert.deepEqual(await page.locator('.task-results-stats').boundingBox(),before);await page.waitForTimeout(15000);delay=0;});
 await test('A05',async()=>{delay=15000;await page.locator('.task-results-filters select').first().selectOption('7');await page.waitForTimeout(250);assert.equal(await page.locator('.task-results-stat').count(),4);assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'—');await page.waitForTimeout(15000);assert.equal(await page.locator('.task-results-stat strong').first().innerText(),'7');delay=0;});
 await test('A06',async()=>{await page.reload();await page.locator('body.auth-signed-in').waitFor();await page.locator('.task-results-stat').first().waitFor();assert.equal(await page.locator('.task-results-filters select').first().inputValue(),'7');});
 await test('A08',async()=>{meStatus=503;const start=performance.now();await page.reload();await page.waitForTimeout(10500);assert.equal(await page.evaluate(()=>localStorage.getItem('mba_session_token')),'ba_runtime_fixture');assert.equal(await page.locator('body.auth-signed-out').count(),0);assert.equal(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'temporarily_unavailable');return {budgetMs:performance.now()-start};});
 await writeFile(out+'/metrics.json',JSON.stringify({timestamp:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fixture:true,results,calls,errors,performance:await page.evaluate(()=>window.__metrics)},null,2));
 await context.tracing.stop({path:out+'/trace.zip'});console.log(JSON.stringify(results,null,2));
}finally{await browser?.close();server.kill();}
