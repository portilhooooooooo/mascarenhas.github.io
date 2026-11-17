import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const apiSource=read('data-api.js');

function environment(code,status=403,stageBridge=false){
  const saved=new Map([['mba_session_token','ba_valid_fixture'],['mba_portfolio_id','agibank_enter']]);
  const events=[];
  const listeners=new Map();
  const storage={
    getItem:key=>saved.get(key)??null,
    setItem:(key,value)=>saved.set(key,String(value)),
    removeItem:key=>saved.delete(key),
  };
  const user={id:'admin-test',is_master_admin:true,permissions:{'dashboard.view':true}};
  const window={
    MBA_API_BASE_URL:'https://api.portilhobackoffice.site',
    MBA_STAGE_READ_BRIDGE:stageBridge?{enabled:true,mode:'staging-v3',readonly:true}:undefined,
    MBA_CURRENT_USER:user,
    addEventListener:(name,fn)=>listeners.set(name,[...(listeners.get(name)||[]),fn]),
    dispatchEvent:event=>{events.push(event.type);for(const listener of listeners.get(event.type)||[])listener(event);},
  };
  const context={
    window,localStorage:storage,sessionStorage:{...storage},location:{hostname:'local.portilhobackoffice.site'},
    document:{body:{classList:{contains:()=>false}},hidden:true,addEventListener:()=>{}},
    fetch:async()=>new Response(JSON.stringify({code}),{status,headers:{'Content-Type':'application/json'}}),
    Headers,Response,FormData,File:class{},URL,AbortController,TextDecoder,crypto,
    Event:class{constructor(type){this.type=type;}},
    CustomEvent:class{constructor(type,{detail}={}){this.type=type;this.detail=detail;}},
    setTimeout,clearTimeout,console,performance,
  };
  vm.runInNewContext(apiSource,context);
  return {window,events,storage,user};
}

for(const code of ['PORTFOLIO_ACCESS_DENIED','PERMISSION_DENIED']){
  test(code+' keeps the authenticated admin session and avoids loading loop',async()=>{
    const {window,events,storage,user}=environment(code);
    await assert.rejects(window.MBA_API.request('/api/dashboard/v1/andamentos'),error=>error.status===403&&error.code===code);
    assert.strictEqual(window.MBA_CURRENT_USER,user);
    assert.equal(storage.getItem('mba_session_token'),'ba_valid_fixture');
    assert.ok(!events.includes('mba:authorization-invalidated'));
    assert.ok(!events.includes('mba:logged-out'));
  });
}

test('identity-wide profile revocation still triggers revalidation',async()=>{
  const {window,events}=environment('PROFILE_NOT_AUTHORIZED');
  await assert.rejects(window.MBA_API.request('/api/dashboard/v1/andamentos'),{status:403,code:'PROFILE_NOT_AUTHORIZED'});
  assert.ok(events.includes('mba:authorization-invalidated'));
  assert.ok(events.includes('mba:logged-out'));
});

test('401 session invalidation still clears the session',async()=>{
  const {window,events,storage}=environment('SESSION_INVALID',401);
  await assert.rejects(window.MBA_API.request('/api/dashboard/v1/andamentos'),{status:401,code:'SESSION_INVALID'});
  assert.equal(storage.getItem('mba_session_token'),null);
  assert.ok(events.includes('mba:session-expired'));
});

test('staging read identity refusal does not invalidate production Microsoft session',async()=>{
  const {window,events,storage,user}=environment('PROFILE_NOT_AUTHORIZED',403,true);
  await assert.rejects(window.MBA_API.request('/api/dashboard/v1/andamentos'),{status:403,code:'PROFILE_NOT_AUTHORIZED'});
  assert.strictEqual(window.MBA_CURRENT_USER,user);
  assert.equal(storage.getItem('mba_session_token'),'ba_valid_fixture');
  assert.ok(!events.includes('mba:authorization-invalidated'));
});

test('staging 401 does not clear a production Microsoft session',async()=>{
  const {window,events,storage}=environment('SESSION_INVALID',401,true);
  await assert.rejects(window.MBA_API.request('/api/dashboard/v1/andamentos'),{status:401,code:'SESSION_INVALID'});
  assert.equal(storage.getItem('mba_session_token'),'ba_valid_fixture');
  assert.ok(!events.includes('mba:session-expired'));
});

test('test build and navigation use the same per-portfolio Read Model scope',()=>{
  const build=read('build-static.mjs');
  const app=read('app.js');
  const results=read('src/dashboard/GestaoProcessualPage.tsx');
  const cadastro=read('src/dashboard/BaseGeralPage.tsx');
  assert.doesNotMatch(cadastro,/ReadModelDashboard/);
  assert.match(cadastro,/CadastroCpjCards/);
  assert.match(build,/npm_lifecycle_event === 'build:routes-testing'/);
  assert.match(build,/MBA_DASHBOARD_V1_SCOPES = Object.freeze/);
  assert.ok(build.includes('cadastro:["agibank_enter","agibank_mba"]'));
  assert.match(app,/window\.MBA_READ_MODEL_SCOPE_ALLOWED = readModelScopeAllowed/);
  assert.doesNotMatch(app,/route === 'analytics\/andamentos' && !readModelScopeAllowed\('andamentos'\)/);
  assert.doesNotMatch(app,/route === 'analytics\/cadastro' && !readModelScopeAllowed\('cadastro'\)/);
  assert.match(results,/const canViewCadastro=canViewAnalytics;/);
  assert.match(results,/const canViewAndamentos=canViewAnalytics&&permissions\['automations.view'\]===true;/);
  assert.match(results,/Dados de Cadastro ainda não publicados para esta carteira/);
  assert.match(results,/Dados de Andamentos ainda não publicados para esta carteira/);
  assert.match(results,/\{canViewAndamentos && <button/);
});
