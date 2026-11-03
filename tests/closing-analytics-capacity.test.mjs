import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/analytics/readScheduler.ts', import.meta.url),'utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const { analyticalRead, retryAfterMs } = await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
assert.equal(retryAfterMs('2'),2000);
assert.equal(retryAfterMs('not a date'),0);
let attempts=0;
const recovered=await analyticalRead(async()=>{
  attempts++;
  if(attempts===1)throw Object.assign(new Error('Capacidade analítica ocupada.'),{status:429,code:'ANALYTICS_BUSY',retryAfter:'1'});
  return {total_elegivel:30};
},{budgetMs:4000});
assert.equal(attempts,2);
assert.equal(recovered.total_elegivel,30);
let forbidden=0;
await assert.rejects(analyticalRead(async()=>{forbidden++;throw Object.assign(new Error('forbidden'),{status:403});}),/forbidden/);
assert.equal(forbidden,1);
let auth=0;
await assert.rejects(analyticalRead(async()=>{auth++;throw Object.assign(new Error('auth unavailable'),{status:503,code:'AUTH_TEMPORARILY_UNAVAILABLE'});}),/auth unavailable/);
assert.equal(auth,1);
const canceled = new AbortController();
canceled.abort();
let called = false;
await assert.rejects(analyticalRead(async()=>{called=true;}, {signal:canceled.signal}),{name:'AbortError'});
assert.equal(called,false);
let inFlight=0,peak=0;
await Promise.all(Array.from({length:4},()=>analyticalRead(async()=>{
  inFlight++;peak=Math.max(peak,inFlight);
  await new Promise(resolve=>setTimeout(resolve,20));
  inFlight--;return true;
},{budgetMs:4000})));
assert.ok(peak<=2,'A client analytical lane must never exceed two concurrent reads.');
const page=readFileSync(new URL('../src/dashboard/EncerramentosPage.tsx',import.meta.url),'utf8');
const api=readFileSync(new URL('../data-api.js',import.meta.url),'utf8');
assert.match(api,/error\.retryAfter = response\.headers\.get\('Retry-After'\)/);
assert.match(page,/run\('aging',loadMonthlyAging,setAgingMensal\)/);
assert.match(page,/blockKeys\.aging===filterKey\?agingMensal:null/);
assert.match(page,/closing-goal-kpi-title">Meta<\/span>/);
assert.doesNotMatch(page,/Pontuação Aging/);
assert.match(page,/runtimeQueries\.cancelQueries/);
console.log('Analytical lane: 429 recovered, Retry-After forwarded, ACL nonretryable, abort safe, concurrency bounded, Meta preserved.');

// Budget exhaustion is a visible failure; external cancellation remains silent.
await assert.rejects(analyticalRead(signal=>new Promise((resolve,reject)=>{
 signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true});
}),{budgetMs:15}),error=>error.code==='ANALYTICS_TIMEOUT'&&error.status===504);
const navigation=new AbortController();
const pendingNavigation=analyticalRead(signal=>new Promise((resolve,reject)=>{
 signal.addEventListener('abort',()=>reject(new DOMException('aborted','AbortError')),{once:true});
}),{signal:navigation.signal,budgetMs:1000});
setTimeout(()=>navigation.abort(),5);
await assert.rejects(pendingNavigation,{name:'AbortError'});
assert.equal(await analyticalRead(async()=>42),42,'Canceled reads release their lane');
console.log('Read deadline and navigation cancellation have distinct outcomes.');
