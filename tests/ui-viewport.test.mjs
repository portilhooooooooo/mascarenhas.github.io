import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--config','vite.ux.config.ts','--host','127.0.0.1','--port','5176','--strictPort'],{stdio:['ignore','pipe','pipe']});
let browser;
try{
 await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error('vite test timeout')),18000);
  server.stdout.on('data',d=>{if(d.toString().includes('Local:')){clearTimeout(timeout);resolve()}});
  server.on('exit',c=>{clearTimeout(timeout);reject(new Error('vite exited '+c))});
 });
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 for(const width of [1366,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('http://127.0.0.1:5176/?scenario=liminar');
  await page.locator('.task-station .tasks-workspace').waitFor();
  const dimensions=await page.evaluate(()=>{
   const root=document.querySelector('.tasks-react-root');
   const station=document.querySelector('.task-station');
   const work=document.querySelector('.tasks-workspace');
   const footer=document.querySelector('.task-renderer-footer');
   return {zoom:getComputedStyle(root).zoom, stationH:station.getBoundingClientRect().height,
    workH:work.getBoundingClientRect().height, footerBottom:footer?.getBoundingClientRect().bottom,
    viewport:innerHeight, horizontalOverflow:document.documentElement.scrollWidth>innerWidth+4};
  });
  assert.equal(dimensions.zoom,'1');
  assert.ok(dimensions.stationH<=dimensions.viewport+4,JSON.stringify(dimensions));
  assert.ok((dimensions.footerBottom??0)<=dimensions.viewport+4,JSON.stringify(dimensions));
  assert.equal(dimensions.horizontalOverflow,false,JSON.stringify(dimensions));
  console.log('VIEWPORT PASS',width,JSON.stringify(dimensions));
  await page.close();
 }
}finally{await browser?.close();server.kill('SIGTERM')}
