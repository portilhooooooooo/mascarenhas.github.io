// Hybrid evidence: read fixtures + actual authorized synthetic write to internal stage.
// No Microsoft login, production traffic or real bearer in browser storage/trace.
import assert from 'node:assert/strict';
import {spawn,execFileSync} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium,firefox} from 'playwright';
const state=JSON.parse(await readFile(process.env.RUNTIME_V2_BROWSER_STATE,'utf8'));
assert.equal(state.wallet,'agibank_mba');assert.match(state.profile.email,/@fixture.invalid$/);
const info=JSON.parse(execFileSync('docker',['inspect','runtime-v2-image-linked-creation']))[0];
assert.equal(info.Config.Labels['mba.runtime-v2.fixture'],'true');
assert.equal(info.HostConfig.NetworkMode,'runtime-v2-test');
assert.ok(!info.HostConfig.PortBindings||Object.keys(info.HostConfig.PortBindings).length===0);
const ip=info.NetworkSettings.Networks['runtime-v2-test'].IPAddress;
assert.match(ip,/^172\.\d+\.\d+\.\d+$/);
const name=process.env.BROWSER||'chromium',port=process.env.PORT||'5194';
const out='docs/runtime-v2/evidence/linked-command-'+name;
await mkdir(out,{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--outDir','dist','--host','127.0.0.1','--port',port,'--strictPort']);
let browser,context,page;const commands=[],errors=[];let result;
try{
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:'+port)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await(name==='firefox'?firefox:chromium).launch({headless:true,...(name==='firefox'?{}:{args:['--no-sandbox'],executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH})});
 context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(wallet=>{localStorage.setItem('mba_session_token','ba_inert_browser_fixture');localStorage.setItem('mba_portfolio_id',wallet);},state.wallet);
 await context.route('https://api.portilhobackoffice.site/**',async route=>{
  const request=route.request(),url=new URL(request.url()),path=decodeURIComponent(url.pathname);
  const reply=(json,status=200)=>route.fulfill({json,status});
  if(path==='/api/me')return reply({...state.profile,capabilities:{...state.profile.capabilities,processos:true}});
  if(path==='/api/me/state')return reply({id:state.actor,policy_epoch:state.profile.policy_epoch||'legacy'});
  if(path==='/api/task-assignees')return reply([{id:state.actor,name:'Synthetic HTTP'}]);
  if(path.startsWith('/auth/'))throw Error('OAuth forbidden in this synthetic test');
  if(request.method()==='POST'){
   assert.equal(path,'/api/tasks','Only the isolated linked creation command is allowed');
   assert.equal(request.headers()['x-portfolio-id'],state.wallet,'Browser wallet must match authorized fixture scope');
   const payload=request.postDataJSON(),start=performance.now();
   const response=await fetch('http://'+ip+':5000/api/tasks',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+state.token,'X-Portfolio-Id':state.wallet},body:JSON.stringify(payload)});
   const json=await response.json();
   commands.push({path,status:response.status,duration_ms:performance.now()-start,payload_keys:Object.keys(payload).sort(),type:payload.type,source:payload.source,cnj_matches:payload.process_cnj===state.cnj,server_timing:response.headers.get('server-timing'),backend_commit:info.Config.Labels['org.opencontainers.image.revision']});
   return reply(json,response.status);
  }
  if(path==='/api/processos/'+state.cnj)return reply({process:{id:1,cnj:state.cnj,portfolio_id:state.wallet,carteira:'Synthetic',state:'SP',situation:'Em andamento'},cnj:state.cnj,permissions:{tasks:true,create_task:true,task_types:['liminar','defesa','encerramento']}});
  if(path.endsWith('/timeline'))return reply({rows:[],page:1,has_more:false,sources:{datajud:{state:'available'},operational:{state:'available'}}});
  if(path.endsWith('/tasks'))return reply({rows:[],total:0,page:1,page_size:25});
  return reply([]);
 });
 await context.tracing.start({screenshots:true,snapshots:true});
 page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:'+port+'/processos/'+encodeURIComponent(state.cnj));
 await page.getByRole('button',{name:'Criar tarefa',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Criar tarefa vinculada'});
 await dialog.getByLabel('Responsável').selectOption(state.actor);
 await dialog.getByLabel('Título').fill('Synthetic browser linked task');
 await page.screenshot({path:out+'/before.png',fullPage:true});
 await dialog.getByRole('button',{name:'Criar tarefa',exact:true}).click();
 await page.getByText('Tarefa criada e vinculada ao processo.').waitFor({timeout:10000});
 assert.equal(commands.length,1);assert.equal(commands[0].status,201);assert.equal(commands[0].cnj_matches,true);assert.deepEqual(errors,[]);
 await page.screenshot({path:out+'/after.png',fullPage:true});
 result={status:'PASSOU',timestamp:new Date().toISOString(),frontend_commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),browser:name,fixture:'read fixtures; real internal stage command and separate PostgreSQL verification',production_changed:false,oauth_starts:0,commands,errors};
}catch(error){result={status:'FALHOU',timestamp:new Date().toISOString(),error:error.message,commands,errors};process.exitCode=1;
 if(page)await page.screenshot({path:out+'/failure.png',fullPage:true}).catch(()=>{});
}finally{
 await context?.tracing.stop({path:out+'/trace.zip'}).catch(()=>{});
 await writeFile(out+'/metrics.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 await browser?.close();server.kill();
}
