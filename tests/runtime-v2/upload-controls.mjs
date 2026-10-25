// Built UI inventory, synthetic identity only; no production login or writes.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {spawn,execFileSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const out='docs/runtime-v2/evidence/upload-controls';
await mkdir(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir','dist','--host','127.0.0.1','--port','5197','--strictPort'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:5197')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:900}});
 const permissions=Object.fromEntries(['tasks.view','tasks.view_others','tasks.assign','tasks.manage','tasks.execute','tasks.create','dashboard.view','processos.view'].map(k=>[k,true]));
 const profile={id:'synthetic-upload-actor',email:'upload@fixture.invalid',name:'Synthetic upload',role:'legal_leader',permissions,portfolios:[{id:'agibank_mba',display_name:'Regular'}],default_portfolio_id:'agibank_mba'};
 const calls=[],errors=[];
 await context.addInitScript(()=>{localStorage.setItem('mba_session_token','ba_upload_fixture');localStorage.setItem('mba_portfolio_id','agibank_mba');});
 await context.route('https://api.portilhobackoffice.site/**',async route=>{
  const request=route.request(),path=new URL(request.url()).pathname;
  calls.push({method:request.method(),path});
  assert.equal(request.method(),'GET','Inventory must never perform a write or OAuth');
  let body=[];
  if(path==='/api/me')body=profile;
  else if(path==='/api/me/state')body={id:profile.id,policy_epoch:'fixture'};
  else if(path==='/api/task-assignees')body=[{id:profile.id,name:profile.name}];
  if(path==='/api/events/stream')return route.fulfill({status:403,json:{code:'REALTIME_PAUSED'}});
  return route.fulfill({json:body});
 });
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await context.tracing.start({screenshots:true,snapshots:true});
 await page.goto('http://127.0.0.1:5197/tarefas');await page.locator('body.auth-signed-in').waitFor();
 await page.locator('.tasks-react-root').waitFor();await page.evaluate(()=>document.fonts.ready);
 const buttons=await page.getByRole('button').allTextContents();
 const legacyButtonVisible=await page.locator('#new-task-button').isVisible();
 const modalVisible=await page.getByRole('dialog',{name:'Nova tarefa',exact:true}).isVisible();
 const legacyResponsible=await page.locator('#task-create-form [name=responsible_id]').count();
 const record={timestamp:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fixture:true,productionLogin:false,scope:'UI reachability inventory; not successful import certification',route:'/tarefas',legacyButtonVisible,modalVisible,legacyResponsibleFields:legacyResponsible,visibleButtons:buttons,errors,calls};
 await page.screenshot({path:out+'/tasks.png',fullPage:true});
 await writeFile(out+'/inventory.json',JSON.stringify(record,null,2));
 console.log(JSON.stringify(record));
 assert.deepEqual(errors,[]);
 await context.tracing.stop({path:out+'/trace.zip'});
 await context.close();
}finally{await browser?.close();server.kill();}
