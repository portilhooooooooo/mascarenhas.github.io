import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

function client(status=200) {
 const values=new Map([['mba_session_token','tw_test-fixture']]); const calls=[],events=[];
 const window={MBA_API_BASE_URL:'https://api.example.com',dispatchEvent:e=>events.push(e.type)};
 const context={window,location:{hostname:'production.example.com'},sessionStorage:{getItem:k=>values.get(k),removeItem:k=>values.delete(k)},Headers,FormData,Event,File,fetch:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify({ok:true}),{status,headers:{'content-type':'application/json'}});}};
 vm.runInNewContext(readFileSync(new URL('../data-api.js',import.meta.url),'utf8'),context);
 return {api:window.MBA_API,calls,events,values};
}
test('all module reads terminate on API with bearer and no cookies',async()=>{
 const {api,calls}=client();
 for(const path of ['/api/me','/api/users','/api/tasks','/api/agreements','/api/pagamentos']) await api.request(path);
 assert.equal(calls.length,5);
 for(const call of calls){assert.ok(call.url.startsWith('https://api.example.com/api/'));assert.equal(call.options.headers.get('Authorization'),'Bearer tw_test-fixture');assert.equal(call.options.credentials,'omit');}
});
test('401 invalidates cached session before the next request',async()=>{
 const {api,events,values}=client(401);
 await assert.rejects(api.request('/api/tasks'));
 assert.equal(values.has('mba_session_token'),false);assert.deepEqual(events,['mba:session-expired']);
});
test('client refuses external or protocol-relative path',async()=>{
 const {api,calls}=client();await assert.rejects(api.request('//attacker.example/api/me'));assert.equal(calls.length,0);
});
test('423 locks out the session locally',async()=>{
 const {api,events,values}=client(423);await assert.rejects(api.request('/api/tasks'),/bloqueada/);
 assert.equal(values.has('mba_session_token'),false);assert.deepEqual(events,['mba:account-locked']);
});
test('403 is distinguished from session expiration',async()=>{
 const {api,events,values}=client(403);await assert.rejects(api.request('/api/users'),e=>e.status===403&&/permissão/.test(e.message));
 assert.ok(values.has('mba_session_token'));assert.equal(events.length,0);
});
test('5xx returns a neutral service message',async()=>{
 const {api}=client(503);await assert.rejects(api.request('/api/tasks'),/Serviço indisponível/);
});
