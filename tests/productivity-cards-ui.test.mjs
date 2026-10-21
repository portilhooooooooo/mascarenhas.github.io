import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5189','--strictPort'],{stdio:['ignore','pipe','pipe']});
let browser;
try {
 await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('Server failed to start')),15000);
  server.stdout.on('data',part=>{if(part.toString().includes('Local:')){clearTimeout(timer);resolve();}});
  server.stderr.on('data',part=>process.stderr.write(part));
  server.on('exit',c=>{clearTimeout(timer);reject(new Error('Vite exited '+c));});
 });
 browser=await chromium.launch({headless:true,...(process.env.UX_CHROMIUM_PATH?{executablePath:process.env.UX_CHROMIUM_PATH,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']}: {})});
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:5189/tests/productivity-fixture.html');
 await page.getByRole('button',{name:/Análises realizadas: 3/}).waitFor();
 const scenarios=[
 ['Análises realizadas','3 registros'],
 ['Aptidões','1 registros'],
 ['Inaptidões','1 registros'],
 ['Pendências','2 registros'],
 ['Tempo de execução','2 registros']
 ];
 for(const [name,count] of scenarios){
  await page.getByRole('button',{name:new RegExp('^'+name+':')}).click();
  await page.getByText(count,{exact:false}).first().waitFor();
  assert.ok((await page.locator('tbody tr').count())>=1,'Rows of '+name);
 }
 await page.getByRole('button',{name:/Análises realizadas: 3/}).click();
 await page.locator('.task-results-drilldown .task-results-cnj').first().click();
 assert.match(await page.evaluate(()=>window.__navigated),/^tarefas\/item\/[0-9a-f-]{36}\/[0-9a-f-]{36}$/);
 await page.getByRole('button',{name:'Voltar'}).click();
 await page.getByRole('button',{name:/Ver 3 CNJs/}).click();
 await page.locator('.task-results-drilldown .task-results-counter').getByText('3 registros').waitFor();
 assert.equal(await page.locator('.task-results-drilldown tbody tr').count(),3);
 await page.getByLabel('Módulo').selectOption('encerramento');
 await page.getByRole('button',{name:/Análises realizadas: 2/}).waitFor();
 await page.getByRole('button',{name:/Aptidões: 1/}).click();
 await page.locator('.task-results-drilldown .task-results-counter').getByText('1 registros').waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: five clickable cards, CNJ deep-link, daily analyst drilldown, module filter, no browser errors.');
} finally {
 await browser?.close();
 server.kill('SIGTERM');
}
