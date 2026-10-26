import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import {webcrypto} from 'node:crypto';

function client(status=200,writeIntents) {
 const values=new Map([['mba_session_token','ba_test-fixture']]); const calls=[],events=[];
 const window={MBA_API_BASE_URL:'https://api.example.com',addEventListener(){},dispatchEvent:e=>events.push(e.type)};
 if(writeIntents!==undefined)window.MBA_CURRENT_USER={id:'fixture-user',runtime_features:{write_intents:writeIntents}};
 const storage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const context={crypto:webcrypto,TextEncoder,localStorage:storage,document:{hidden:true,body:{classList:{contains:()=>false}},addEventListener(){}},performance,URL,AbortController,TextDecoder,CustomEvent:class{constructor(type){this.type=type}},setTimeout,clearTimeout,console,window,location:{hostname:'production.example.com'},sessionStorage:{getItem:k=>values.get(k),removeItem:k=>values.delete(k)},Headers,FormData,Event,File,fetch:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify(status===401?{error:'Sessão inválida',code:'SESSION_INVALID'}:{ok:true}),{status,headers:{'content-type':'application/json'}});}};
 vm.runInNewContext(readFileSync(new URL('../data-api.js',import.meta.url),'utf8'),context);
 return {api:window.MBA_API,calls,events,values};
}
test('all module reads terminate on API with bearer and no cookies',async()=>{
 const {api,calls}=client();
 for(const path of ['/api/me','/api/users','/api/tasks','/api/agreements','/api/pagamentos']) await api.request(path);
 assert.equal(calls.length,5);
 for(const call of calls){assert.ok(call.url.startsWith('https://api.example.com/api/'));assert.equal(call.options.headers.get('Authorization'),'Bearer ba_test-fixture');assert.equal(call.options.credentials,'omit');}
});
test('401 invalidates cached session before the next request',async()=>{
 const {api,events,values}=client(401);
 await assert.rejects(api.request('/api/tasks'));
 assert.equal(values.has('mba_session_token'),false);assert.deepEqual(events,['mba:session-expired']);
});
test('client refuses external or protocol-relative path',async()=>{
 const {api,calls}=client();await assert.rejects(api.request('//attacker.example/api/me'));assert.equal(calls.length,0);
});

test('legacy API writes do not send an unsupported idempotency header',async()=>{
 for(const support of [undefined,false]){
  const {api,calls}=client(200,support);
  await api.request('/api/task-processes/12345678-1234-4234-8234-123456789abc/encerramento-analysis',{method:'POST',body:'{}'});
  assert.equal(calls.length,1);assert.equal(calls[0].options.headers.get('Idempotency-Key'),null);
 }
});
test('validated API support enables the operation identity header',async()=>{
 const {api,calls}=client(200,true);
 await api.request('/api/task-processes/12345678-1234-4234-8234-123456789abc/encerramento-analysis',{method:'POST',body:'{}'});
 assert.equal(calls.length,1);assert.match(calls[0].options.headers.get('Idempotency-Key'),/^[0-9a-f-]{36}$/);
});
