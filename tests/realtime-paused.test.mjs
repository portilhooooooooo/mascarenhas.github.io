import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
class CustomEvent extends Event {constructor(name,options={}){super(name);this.detail=options.detail;}}
class Storage {values=new Map();getItem(k){return this.values.get(k)||null;}setItem(k,v){this.values.set(k,v);}removeItem(k){this.values.delete(k);}}
const window=new EventTarget();const document=new EventTarget();
document.hidden=false;document.body={classList:{contains:()=>false}};
window.MBA_CURRENT_USER={id:'test-user'};window.MBA_API_BASE_URL='https://api.example.test';
const localStorage=new Storage();localStorage.setItem('mba_session_token','test-token');
let calls=0,warnings=0,paused=0,accept='';
window.addEventListener('mba:realtime-status',event=>{if(event.detail.status==='paused')paused++;});
const context=vm.createContext({window,document,location:{hostname:'localhost'},localStorage,sessionStorage:new Storage(),
 CustomEvent,Event,Headers,Response,FormData,AbortController,URLSearchParams,performance,TextDecoder,Map,Set,
 setTimeout,clearTimeout,console:{debug(){},warn(){warnings++;}},fetch:async(url,options)=>{
  calls++;accept=options.headers.get('Accept');return new Response(JSON.stringify({code:'REALTIME_PAUSED'}),{status:403,headers:{'content-type':'application/json'}});
 }});
vm.runInContext(readFileSync(new URL('../data-api.js',import.meta.url),'utf8'),context);
window.dispatchEvent(new Event('mba:profile-ready'));
await new Promise(resolve=>setTimeout(resolve,10));
for(let i=0;i<5;i++){window.dispatchEvent(new Event('mba:profile-ready'));document.dispatchEvent(new Event('visibilitychange'));}
await new Promise(resolve=>setTimeout(resolve,20));
assert.equal(calls,1,'Paused stream must not reconnect on visibility/profile events');
assert.equal(paused,1);assert.equal(warnings,0,'Paused is not an authorization error');
assert.equal(accept,'text/event-stream','Transport preserves SSE content negotiation');
assert.equal(window.MBA_CURRENT_USER.id,'test-user','Paused stream preserves authentication');
console.log('Paused SSE: one request, no reconnection or authorization failure, Accept preserved.');
