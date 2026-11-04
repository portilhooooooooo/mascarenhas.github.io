// Exercises the real loopback WSGI API and PostgreSQL synthetic cohort.
// Failure injections below target only the local transport; no hosted service is called.
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const s=JSON.parse(await readFile(process.env.V3_SESSION_FILE,'utf8'));
const base=process.env.V3_FRONTEND_URL||'http://127.0.0.1:5186';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();const errors=[],calls=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
await context.route('**/*',async route=>{const u=new URL(route.request().url());if(u.hostname!=='127.0.0.1'&&u.hostname!=='localhost'){calls.push({external:u.hostname});return route.abort();}if(u.pathname.startsWith('/api/'))calls.push({path:u.pathname,method:route.request().method(),portfolio:u.searchParams.get('portfolio_id')});return route.continue();});
const login=async token=>{await page.goto(base);await page.getByLabel('Carteira',{exact:true}).fill(s.portfolio_id);await page.getByLabel('Tenant de validação').fill(s.source_tenant);await page.getByLabel('Sessão sintética').fill(token);await page.getByRole('button',{name:'Consultar',exact:true}).click();await page.locator('[data-module="cadastro"] table tbody tr').first().waitFor();};
const module=async name=>{await page.getByRole('button',{name,exact:true}).click();await page.getByRole('heading',{name,exact:true,level:1}).waitFor();await page.waitForFunction(()=>!document.querySelector('[aria-label="Carregando dados"]'));};
const noOverflow=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
try{
 await login(s.session);checks.push('authenticated_synthetic_api');
 assert.equal(await page.getByRole('button',{name:'Base Geral',exact:true}).count(),0);
 for(const name of ['Cadastro','Andamentos','Encerramentos','Liminares','Pagamentos','Faturamento','Controladoria','Tarefas','Processos','Automações']){
  await module(name);assert.equal(await page.locator('.base-geral-error').count(),0,name);await noOverflow();
  if(name==='Faturamento')assert.match(await page.locator('main').innerText(),/não representam faturamento efetivo/);
  checks.push('module_'+name);
 }
 await module('Cadastro');await page.getByRole('button',{name:'Próxima página',exact:true}).click();await page.getByText('Página 2',{exact:true}).waitFor();assert.ok(await page.locator('tbody tr').count()>0);checks.push('keyset_pagination');
 await page.getByLabel('Pesquisar',{exact:true}).fill('SYNTH-MISSING');await page.getByLabel('Situação',{exact:true}).fill('CADASTRO_CANDIDATE');await page.getByRole('button',{name:'Aplicar filtros',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length===1);assert.match(await page.locator('tbody').innerText(),/SYNTH-MISSING/);checks.push('combined_server_filters');
 await page.getByRole('button',{name:/^Detalhes /}).first().click();await page.getByRole('dialog').getByText('p1.benner-cpj.v1',{exact:true}).waitFor();assert.match(await page.getByRole('dialog').innerText(),/p1.benner-cpj.v1/);await page.getByLabel('Fechar detalhe').click();checks.push('reconciliation_detail');
 await page.getByLabel('Pesquisar',{exact:true}).fill('NONEXISTENT-SYNTHETIC');await page.getByRole('button',{name:'Aplicar filtros',exact:true}).click();await page.getByText('Nenhum registro para os filtros selecionados.').waitFor();checks.push('empty_state');
 await module('Processos');await page.getByRole('button',{name:/^Detalhes /}).first().click();await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Ver timeline',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('[role="dialog"] [aria-label="Carregando dados"]'));await page.getByLabel('Fechar detalhe').click();checks.push('canonical_detail_timeline');
 await page.getByRole('button',{name:'Usar tema escuro'}).click();assert.ok(await page.locator('html').evaluate(e=>e.classList.contains('dark')));checks.push('theme');
 await page.setViewportSize({width:390,height:844});await noOverflow();await page.screenshot({path:'docs/v3-evidence/mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});
 await module('Cadastro');await page.screenshot({path:'docs/v3-evidence/cadastro.png',fullPage:true});
 // Refresh failure preserves only this query's previously authorized revision.
 await page.route('**/api/v3/cadastro?*',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error_code:'READ_UNAVAILABLE',message:'Fixture transport unavailable',retryable:true,request_id:'00000000-0000-4000-8000-000000000001',last_valid_revision:null})}));
 await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.getByText('Atualização indisponível. Últimos dados preservados.',{exact:false}).first().waitFor();assert.ok(await page.locator('tbody tr').count()>0);checks.push('failed_refresh_preserves_same_scope');await page.unroute('**/api/v3/cadastro?*');
 // A delayed response for the old scope is cancelled and cannot repaint after switching.
 await page.route('**/api/v3/cadastro?*',async route=>{await new Promise(r=>setTimeout(r,700));try{await route.continue();}catch{}});
 await page.getByRole('button',{name:'Atualizar',exact:true}).click();await page.getByLabel('Carteira atual').fill(s.second_portfolio_id);await page.getByRole('button',{name:'Trocar carteira',exact:true}).click();await page.waitForFunction(p=>document.querySelector('[aria-label="Carteira atual"]').value===p,s.second_portfolio_id);await page.waitForTimeout(1000);await page.waitForFunction(()=>document.querySelectorAll('tbody tr').length>0);await page.unroute('**/api/v3/cadastro?*');
 const late=await page.locator('main').innerText();assert.ok(!late.includes(s.portfolio_id));checks.push('portfolio_switch_late_response');
 await page.getByRole('button',{name:'Sair',exact:true}).click();await login(s.limited_session);
 assert.equal(await page.getByRole('button',{name:'Faturamento',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Pagamentos',exact:true}).count(),0);assert.ok(!(await page.locator('main').innerText()).includes('66.67'));checks.push('limited_profile_no_financial_cache');
 await module('Processos');await page.getByRole('button',{name:/^Detalhes /}).first().click();await page.getByRole('dialog').waitFor();assert.ok(!(await page.getByRole('dialog').innerText()).includes('Consultas financeiras disponíveis'));await page.getByLabel('Fechar detalhe').click();checks.push('process_financial_redaction');
 await page.getByRole('button',{name:'Sair',exact:true}).click();await page.getByLabel('Carteira',{exact:true}).fill(s.portfolio_id);await page.getByLabel('Tenant de validação').fill(s.source_tenant);await page.getByLabel('Sessão sintética').fill('00000000-0000-4000-8000-000000000000');await page.getByRole('button',{name:'Consultar',exact:true}).click();await page.getByText('Acesso não autorizado.',{exact:false}).waitFor();checks.push('authentication_failure');
 assert.equal(errors.length,0,errors.join('\n'));assert.ok(!calls.some(c=>c.external));assert.ok(calls.every(c=>c.method==='GET'&&c.path.startsWith('/api/v3/')));checks.push('no_external_calls_or_writes');
 await writeFile('docs/v3-evidence/browser.json',JSON.stringify({status:'PASS',checks,calls:calls.length,page_errors:errors,external_calls:0,writes:0,api:'REAL_LOOPBACK_WSGI_POSTGRESQL_SYNTHETIC'},null,2)+'\n');console.log(JSON.stringify({status:'PASS',checks:checks.length,api_calls:calls.length}));
}finally{await browser.close();}
