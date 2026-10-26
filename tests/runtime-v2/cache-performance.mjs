// Actual HTTP asset cache: no Playwright routing (routing disables browser caching).
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdtemp,cp,rm,mkdir,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const port=Number(process.env.PORT||5194),base='http://127.0.0.1:'+port,out='docs/runtime-v2/evidence/http-cache-performance';
const root=await mkdtemp(join(tmpdir(),'mba-cache-performance-'));await cp('dist',root,{recursive:true});
const config=await readFile(join(root,'config.js'),'utf8');assert.ok(config.includes("window.MBA_API_BASE_URL = 'https://api.portilhobackoffice.site';"));
await writeFile(join(root,'config.js'),config.replace("window.MBA_API_BASE_URL = 'https://api.portilhobackoffice.site';","window.MBA_API_BASE_URL = '"+base+"';"));
const profile={id:'fixture-cache-analyst',name:'Fixture',email:'cache@fixture.invalid',role:'legal_leader',permissions:Object.fromEntries(['tasks.view','tasks.view_others','tasks.execute','dashboard.view'].map(p=>[p,true])),portfolios:[{id:'agibank_enter',display_name:'Enter'}],default_portfolio_id:'agibank_enter'};
const result={people:[],summary:{completed:30,today_completed:3,pending:null,growth_percent:null,people:1,measured_analyses:30,measured_transitions:30,slowest:null},generated_at:new Date().toISOString(),methodology:'fixture',truncated:false};
let pending=[],holdIdentity=true;const requests=[];
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.jpg':'image/jpeg'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,base);requests.push({path:url.pathname,method:req.method,at:Date.now()});
  if(url.pathname.startsWith('/api/')){
   if(url.pathname==='/api/me'&&holdIdentity)await new Promise(resolve=>pending.push(resolve));
   const data=url.pathname==='/api/me'?profile:url.pathname==='/api/tasks/results'?result:[];
   res.writeHead(url.pathname==='/api/events/stream'?403:200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));return;
  }
  let file=resolve(root,'.'+url.pathname);
  if(!file.startsWith(root+'/'))file=join(root,'index.html');
  let bytes;try{bytes=await readFile(file);}catch{file=join(root,'index.html');bytes=await readFile(file);}
  const etag='"'+bytes.length+'-'+file.split('/').at(-1)+'"';
  const mustRevalidate=['index.html','auth.js','data-api.js','page-init-1.js','page-init-2.js','portfolio-policy.js','app.js','dashboard-react.js'].some(x=>file.endsWith('/'+x));
  const headers={'Content-Type':mime[extname(file)]||'application/octet-stream','Cache-Control':mustRevalidate?'no-cache':'public, max-age=3600','ETag':etag};
  if(req.headers['if-none-match']===etag){res.writeHead(304,headers);res.end();}else{res.writeHead(200,headers);res.end(bytes);}
 }catch(error){res.writeHead(500);res.end('Fixture server failure');}
});
await new Promise(r=>server.listen(port,'127.0.0.1',r));await mkdir(out,{recursive:true});
let browser;
try{
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1440,height:900}});
 await context.addInitScript(()=>{
  localStorage.setItem('mba_session_token','ba_cache_fixture');localStorage.setItem('mba_portfolio_id','agibank_enter');
  const probe=()=>{
   const shell=document.querySelector('.app-shell'),slots=document.querySelectorAll('.task-results-stat');
   if(!window.__frameMs&&shell?.getBoundingClientRect().height>0&&getComputedStyle(shell).visibility!=='hidden')window.__frameMs=performance.now();
   if(!window.__geometryMs&&slots.length===4&&[...slots].every(e=>e.getBoundingClientRect().height>0))window.__geometryMs=performance.now();
   if(!window.__kpiMs&&slots[0]?.querySelector('strong')?.textContent==='30'){window.__kpiMs=performance.now();observer.disconnect();}
  };
  const observer=new MutationObserver(()=>requestAnimationFrame(probe));observer.observe(document,{childList:true,subtree:true,attributes:true,characterData:true});document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(probe),{once:true});
 });
 const page=await context.newPage(),cdp=await context.newCDPSession(page),cache=[];let unexpected=0;
 page.on('request',r=>{if(r.url().startsWith('https://api.portilhobackoffice.site'))unexpected++;});
 await cdp.send('Network.enable');cdp.on('Network.responseReceived',e=>cache.push({url:new URL(e.response.url).pathname,status:e.response.status,fromDiskCache:!!e.response.fromDiskCache,fromServiceWorker:!!e.response.fromServiceWorker}));
 const samples=[];
 for(let i=0;i<10;i++){
  if(i<2)await cdp.send('Network.clearBrowserCache');
  holdIdentity=true;const before=cache.length;
  if(i===0)await page.goto(base+'/tarefas/resultados');else await page.reload();
  await page.waitForFunction(()=>window.__geometryMs>0);
  assert.notEqual(await page.evaluate(()=>window.MBA_AUTH.getLoginState().status),'authenticated');
  assert.ok((await page.locator('.task-results-stat strong').allTextContents()).every(v=>v==='—'));
  holdIdentity=false;for(const release of pending.splice(0))release();
  await page.waitForFunction(()=>window.__kpiMs>0);
  samples.push({cache:i<2?'cold':'warm',...await page.evaluate(()=>({frameMs:window.__frameMs,geometryMs:window.__geometryMs,kpiMs:window.__kpiMs,auth:window.MBA_RUNTIME_AUTH_METRICS.at(-1)})),responses:cache.slice(before)});
 }
 assert.equal(unexpected,0);await page.screenshot({path:out+'/stable-f5.png',fullPage:true});
 await writeFile(out+'/metrics.json',JSON.stringify({at:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),fixture:true,routing:false,configOverride:'API base only, on a temporary dist copy; same identity/query runtime',assetPolicy:'Revalidate paths match _headers; remaining assets max-age=3600 in local benchmark, not proof of deployed CDN cache policy',samples,requests},null,2));
 console.log(JSON.stringify(samples.map(({responses,...r})=>({...r,assetResponses:responses.length,diskCache:responses.filter(x=>x.fromDiskCache).length,revalidated:responses.filter(x=>x.status===304).length}))));
}finally{holdIdentity=false;for(const release of pending.splice(0))release();await browser?.close();server.closeAllConnections();server.close();await rm(root,{recursive:true,force:true});}
