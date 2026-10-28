import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('async function loadBennerLaunchHealth()'),source.indexOf('async function loadIntegrationHealth()'));
async function scenario(result,{fail=false,changePortfolio=false}={}) {
  const elements=new Map();
  let current='agibank_mba', health;
  const context={
    clearTimeout(){},setTimeout(){},bennerLaunchPollTimer:null,
    document:{getElementById(id){if(id==='automacoes')return null;if(!elements.has(id))elements.set(id,{});return elements.get(id);}},
    window:{MBA_API:{getPortfolioId:()=>current},MBA_AUTOMATION_API:{request:async path=>{
      assert.equal(path,'/api/integrations/benner-andamentos/status');
      if(changePortfolio)current='agibank_enter';
      if(fail)throw new Error('unavailable');
      return result;
    }}},
    setIntegrationHealth:(name,online)=>{health=online;},
  };
  vm.createContext(context);
  vm.runInContext(fn,context);
  await context.loadBennerLaunchHealth();
  return {elements,health};
}
for(const state of ['PENDENTE','AUSENTE','INCONCLUSIVO','VALIDADO']) {
  const r=await scenario({online:true,launch:{counts:{ENVIADO:10,ERRO:2,NA_FILA:1,PROCESSANDO:0}},validation:{state}});
  assert.equal(r.health,true,'Validation must not affect launch consumer health');
  assert.equal(r.elements.get('benner-andamentos-job-status').textContent,'Na fila');
  assert.match(r.elements.get('benner-andamentos-job-progress').textContent,/10 confirmados/);
}
const offline=await scenario({online:false,launch:{counts:{}},validation:{state:'VALIDADO'}});
assert.equal(offline.health,false,'Valid motive must not mask offline consumer');
const failure=await scenario(null,{fail:true});
assert.equal(failure.elements.get('benner-andamentos-health').textContent,'Sem consulta');
const stale=await scenario({online:true},{changePortfolio:true});
assert.equal(stale.elements.size,0,'Late response must not leak previous portfolio counts');
assert.ok(!source.includes("request('/api/automations/benner-andamentos/reasons')"));
console.log('Benner launch health: validation isolation, offline, query failure and portfolio race passed');
