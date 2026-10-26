import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../src/analytics/readScheduler.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {analyticalRead,retryAfterMs}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
test('analytical reads have two slots and prioritize queued primary summaries',async()=>{
 let active=0,max=0;const order=[];let release;
 const gate=new Promise(resolve=>release=resolve);
 const block=()=>analyticalRead(async()=>{active++;max=Math.max(max,active);await gate;active--;return 1;});
 const first=block(),second=block();await sleep(10);
 const low=analyticalRead(async()=>{order.push('secondary');return 1;},{priority:9});
 const high=analyticalRead(async()=>{order.push('summary');return 1;},{priority:0});
 release();await Promise.all([first,second,low,high]);
 assert.equal(max,2);assert.deepEqual(order,['summary','secondary']);
});
test('obsolete queued reads never start and do not leak a slot',async()=>{
 let release,started=false;
 const gate=new Promise(resolve=>release=resolve);
 const a=analyticalRead(()=>gate),b=analyticalRead(()=>gate);await sleep(5);
 const controller=new AbortController();
 const queued=analyticalRead(async()=>{started=true;},{signal:controller.signal});
 const rejection=assert.rejects(queued,error=>error.name==='AbortError');
 controller.abort();await rejection;release();await Promise.all([a,b]);
 assert.equal(started,false);assert.equal(await analyticalRead(async()=>42),42);
});
test('Retry-After supports seconds and HTTP dates without authorizing invalid responses',()=>{
 assert.equal(retryAfterMs('2'),2000);
 assert.equal(retryAfterMs('Mon, 26 Oct 2026 12:00:02 GMT',Date.parse('2026-10-26T12:00:00Z')),2000);
 assert.equal(retryAfterMs('bad'),0);
});
test('429 retries respect the server delay then return the real response',async()=>{
 let calls=0;const at=Date.now();
 const result=await analyticalRead(async()=>{
  if(++calls===1)throw Object.assign(new Error('busy'),{status:429,retryAfter:'1'});
  return 23;
 });
 assert.equal(calls,2);assert.equal(result,23);assert.ok(Date.now()-at>=1000);
});
test('permission/session failures do not retry',async()=>{
 for(const problem of [{status:401},{status:403},{status:503,code:'AUTH_TEMPORARILY_UNAVAILABLE'}]){
  let calls=0;
  await assert.rejects(analyticalRead(async()=>{calls++;throw Object.assign(new Error('denied'),problem);}));
  assert.equal(calls,1);
 }
});
test('transient read errors have a bounded retry owner',async()=>{
 let calls=0;
 await assert.rejects(analyticalRead(async()=>{calls++;throw Object.assign(new Error('down'),{status:503});}));
 assert.equal(calls,3);
});
test('a result from a superseded scope is rejected without replay',async()=>{
 let current=true,calls=0;
 await assert.rejects(analyticalRead(async()=>{calls++;current=false;return 999;},{isCurrent:()=>current}),
   error=>error.code==='STALE_ANALYTICS_SCOPE');
 assert.equal(calls,1);
});
test('429 cooldown is applied before queued reads acquire the released slot',async()=>{
 let rejectBusy,releaseSecond,queuedAt=0;
 const firstGate=new Promise((_,reject)=>rejectBusy=reject);
 const secondGate=new Promise(resolve=>releaseSecond=resolve);
 const first=analyticalRead(()=>firstGate,{budgetMs:500});
 const firstRejection=assert.rejects(first,error=>error.status===429);
 const second=analyticalRead(()=>secondGate);
 await sleep(5);
 const queued=analyticalRead(async()=>{queuedAt=Date.now();return 1;});
 const busyAt=Date.now();
 rejectBusy(Object.assign(new Error('busy'),{status:429,retryAfter:'1'}));
 await firstRejection;releaseSecond();await Promise.all([second,queued]);
 assert.ok(queuedAt-busyAt>=1000,`queued read escaped cooldown after ${queuedAt-busyAt}ms`);
});
