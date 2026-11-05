// Actual operational shell + Flask + existing PostgreSQL. Only authority transport
// and explicit fault injections are fixtures. No real OAuth or external effects.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.V3_FRONTEND_URL||'http://127.0.0.1:5189';
const checks=[],calls=[],errors=[];let fault='',delay=false;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const ctx=await browser.newContext({viewport:{width:1440,height:1000}});
await ctx.route('**/*',async route=>{
 const req=route.request(),u=new URL(req.url());
 if(!['127.0.0.1','localhost'].includes(u.hostname))return route.abort();
 if(u.pathname==='/config.js')return route.fulfill({contentType:'application/javascript',body:"window.MBA_API_BASE_URL='http://127.0.0.1:18767';window.MBA_REACT_TASKS=true;"});
 if(u.pathname.startsWith('/api/')){
  calls.push({path:u.pathname,method:req.method(),portfolio:req.headers()['x-portfolio-id']});
  if(u.pathname.startsWith('/api/v3/')){
   if(delay&&u.pathname==='/api/v3/processos'){await new Promise(r=>setTimeout(r,900));}
   if(fault&&u.pathname==='/api/v3/processos'){
    if(fault==='network')return route.abort();
    return route.fulfill({status:Number(fault),contentType:'application/json',body:JSON.stringify({code:fault==='401'?'SESSION_INVALID':'PERMISSION_DENIED',message:'Local fault injection'})});
   }
   return route.continue();
  }
  if(['/api/me','/api/me/state'].includes(u.pathname))return route.continue();
  // Other legacy shell panels are outside the V3 read test. Never send writes.
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({rows:[],total:0,page:1,page_size:20,items:[],data:[],permissions:{},summary:{},status:'UNAVAILABLE'})});
 }
 return route.continue();
});
const page=await ctx.newPage();page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
const step=async(name,fn)=>{await fn();checks.push(name);console.log('PASS '+name);};
const navigate=async(route,module)=>{
 await page.evaluate(route=>window.MBA_NAVIGATE(route),route);
 await page.locator(`[data-module="${module}"]`).waitFor({timeout:15000});
 await page.locator(`[data-module="${module}"] [aria-label="Carregando dados"]`).first().waitFor({state:'detached',timeout:15000});
};
const surface=()=>page.locator('.v3-read-surface:visible');
const login=async()=>{
 await page.addInitScript(()=>{const billing=localStorage.getItem('mba_fixture_billing')==='1';localStorage.setItem('mba_session_token',billing?'ba_billing_route_fixture':'ba_route_fixture');localStorage.setItem('mba_portfolio_id',billing?'agibank_mba':'agibank_enter');});
 await page.goto(base+'/processos');
 await page.locator('[data-module="processos"] tbody tr').first().waitFor({timeout:20000});
};
try{
 await step('existing_login_ui',async()=>{await page.goto(base);await page.waitForFunction(()=>document.querySelector('#login-screen')||document.body.innerText.includes('Microsoft'));});
 await step('existing_session_bootstrap',login);
 for(const [route,module] of [['processos','processos'],['analytics/cadastro','cadastro'],['analytics/andamentos','andamentos'],['operacao/encerramentos','encerramentos'],['operacao/liminar','liminar'],['operacao/pagamentos','pagamentos'],['controladoria/protocolos','controladoria'],['tarefas','tarefas'],['automacoes','automacoes']]){
  await step('navigation_'+module,async()=>{await navigate(route,module);assert.ok(calls.some(c=>c.path==='/api/v3/'+module));assert.equal(await page.locator(`[data-module="${module}"] [role="alert"]`).count(),0);});
 }
 await step('partial_coverage',async()=>{await navigate('analytics/cadastro','cadastro');await surface().getByText('Nenhum registro disponível neste recorte; a cobertura pode estar incompleta.').waitFor();assert.match(await page.locator('[data-module="cadastro"]').innerText(),/Cobertura parcial/);});
 await step('pagination',async()=>{await navigate('processos','processos');await surface().getByRole('button',{name:'Próxima página',exact:true}).click();await page.getByText('Página 2',{exact:true}).waitFor();await page.locator('[data-module="processos"] tbody tr').first().waitFor();await surface().getByRole('button',{name:'Anterior',exact:true}).click();});
 await step('detail_timeline',async()=>{await surface().getByRole('button',{name:/^Detalhes /}).first().click();await page.getByRole('dialog').waitFor();await surface().getByRole('button',{name:'Ver timeline',exact:true}).click();await page.locator('[role="dialog"] [aria-label="Carregando dados"]').waitFor({state:'detached'});await page.getByLabel('Fechar detalhe').click();});
 await step('combined_filters',async()=>{await surface().getByLabel('Pesquisar',{exact:true}).fill('NO-SUCH-ROUTE-FIXTURE');await surface().getByLabel('Fonte',{exact:true}).fill('CANONICAL');await surface().getByRole('button',{name:'Aplicar filtros',exact:true}).click();await surface().getByText('Nenhum registro disponível neste recorte; a cobertura pode estar incompleta.').waitFor({timeout:15000});await surface().getByLabel('Pesquisar',{exact:true}).fill('');await surface().getByLabel('Fonte',{exact:true}).fill('');await surface().getByRole('button',{name:'Aplicar filtros',exact:true}).click();await page.locator('[data-module="processos"] tbody tr').first().waitFor();});
 await step('network_last_valid_revision',async()=>{fault='network';await surface().getByRole('button',{name:'Atualizar',exact:true}).click();await surface().getByText('Atualização indisponível. Últimos dados preservados.',{exact:false}).first().waitFor({timeout:15000});assert.ok(await page.locator('[data-module="processos"] tbody tr').count()>0);fault='';await surface().getByRole('button',{name:'Atualizar',exact:true}).click();await page.locator('[data-module="processos"] [role="alert"]').waitFor({state:'detached'});});
 await step('financial_restriction',async()=>{const code=await page.evaluate(async()=>{const r=await fetch('http://127.0.0.1:18767/api/v3/faturamento',{headers:{Authorization:'Bearer ba_route_fixture','X-Portfolio-Id':'agibank_enter'}});return r.status;});assert.equal(code,403);assert.equal(await page.getByRole('button',{name:'Faturamento',exact:true}).count(),0);});
 await step('access_denied_no_fallback',async()=>{fault='403';const before=calls.length;await surface().getByRole('button',{name:'Atualizar',exact:true}).click();await page.waitForFunction(()=>!window.MBA_CURRENT_USER||document.body.innerText.includes('Acesso não autorizado.'));await page.waitForFunction(()=>document.querySelectorAll('[data-module="processos"] tbody tr').length===0);await page.waitForTimeout(1200);assert.ok(calls.slice(before).filter(c=>c.path==='/api/v3/processos').length<=2);assert.ok(!calls.slice(before).some(c=>c.path.startsWith('/api/processos')||c.path.includes('dashboard')));fault='';await page.reload();await page.locator('[data-module="processos"] tbody tr').first().waitFor();});
 await step('portfolio_switch_late_response',async()=>{delay=true;await surface().getByRole('button',{name:'Atualizar',exact:true}).click();await page.evaluate(()=>{window.MBA_API.setPortfolioId('agibank_mba');window.dispatchEvent(new Event('mba:portfolio-changed'));});await page.waitForTimeout(1400);assert.equal(await page.locator('[data-module="processos"] tbody tr').count(),0);assert.equal(await page.evaluate(()=>window.MBA_API.getPortfolioId()),'agibank_mba');delay=false;});
 await step('session_expired_clears_data',async()=>{await page.evaluate(()=>{localStorage.removeItem('mba_session_token');window.dispatchEvent(new Event('mba:session-expired'));});assert.equal(await page.locator('[data-module="processos"] tbody tr').count(),0);});
 await step('billing_named_fixture_read',async()=>{
  // A registered ID in a fixture response exercises the existing allowlist;
  // this token is accepted only by the explicit loopback test harness.
  await page.evaluate(()=>localStorage.setItem('mba_fixture_billing','1'));
  await page.goto(base+'/analytics/faturamento');await page.locator('[data-module="faturamento"]').waitFor();await surface().getByText('Simulação. Estes valores não representam faturamento efetivo do escritório.').waitFor();assert.ok(calls.some(c=>c.path==='/api/v3/faturamento'));
 });
 await step('explicit_legacy_default_build',async()=>{
  const before=calls.length;const legacyResponse=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/processos');await page.goto('http://127.0.0.1:5190/processos');await page.waitForFunction(()=>window.MBA_V3_READ_SOURCE?.('processos')==='LEGACY');
  await legacyResponse;assert.equal(await page.locator('[data-module="processos"]').count(),0);assert.ok(!calls.slice(before).some(c=>c.path.startsWith('/api/v3/')));
 });
 await step('no_external_writes',async()=>{assert.ok(calls.every(c=>['GET','OPTIONS'].includes(c.method)),JSON.stringify(calls.filter(c=>!['GET','OPTIONS'].includes(c.method))));});
 assert.deepEqual(errors,[]);
 const out=process.env.V3_ROUTES_EVIDENCE||'docs/v3-evidence/routes';await mkdir(out,{recursive:true});await writeFile(out+'/browser.json',JSON.stringify({status:'PASS',checks,api_calls:calls.length,page_errors:errors,authority:'FIXTURE_TRANSPORT_EXISTING_SESSION_SERVICE',data:'EXISTING_BENNER_POSTGRESQL',real_oauth_tested:false,external_writes:0},null,2)+'\n');
}catch(e){console.error('STATE',await page.evaluate(()=>({path:location.pathname,modules:[...document.querySelectorAll('[data-module]')].map(x=>x.dataset.module),alerts:[...document.querySelectorAll('[role=alert]')].map(x=>x.innerText.slice(0,180))})));throw e;}finally{await browser.close();}
