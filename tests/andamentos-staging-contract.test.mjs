// Contrato de Andamentos V2 (frontend + API de staging): 11 cards.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');
const expected=[
  'fase_conhecimento',
  'recursal_extincao',
  'recursal_improcedente',
  'recursal_procedente',
  'transito_em_julgado',
  'transito_em_julgado_extincao',
  'transito_em_julgado_improcedente',
  'transito_em_julgado_procedente',
  'suspensao',
  'pedido_bloqueio',
  'cumprimento_sentenca',
];

test('os 11 indicadores de Andamentos V2 estão presentes uma única vez',()=>{
  const view=read('src/dashboard/ReadModelDashboard.tsx');
  const section=view.match(/\bandamentos:\[([\s\S]*?)\n  \],/);
  assert.ok(section,'bloco de Andamentos ausente');
  const names=[...section[1].matchAll(/\bname:'([^']+)'/g)].map(match=>match[1]);
  assert.deepEqual(names,expected);
  assert.equal(new Set(names).size,11);
  assert.ok(names.every(name=>section[1].includes(`name:'${name}',label:`)),'todo card deve ter rótulo');
});

test('resumo e detalhamento usam o mesmo dashboard, revisão e escopo autenticado',()=>{
  const view=read('src/dashboard/ReadModelDashboard.tsx');
  const detail=read('src/dashboard/MetricCasesDialog.tsx');
  assert.match(view,/request<Summary>\('\/api\/dashboard\/v1\/'\+dashboard/);
  assert.match(view,/portfolio_id!==portfolio/);
  assert.match(view,/dashboardV1Cases\(dashboard,m\.name,m\.label\+' \(Read Model\)',rev!,portfolio\)/);
  assert.match(detail,/andamentos:'2'/);
  assert.match(detail,/new URLSearchParams\(\{revision,version,limit:String\(size\)\}\)/);
  assert.match(detail,/\`\/api\/dashboard\/v1\/\$\{dashboard\}\/metrics\/\$\{metric\}\/cases\?/);
  assert.match(detail,/body\.portfolio_id!==portfolio\|\|body\.revision!==revision/);
  assert.match(detail,/if\(status===409\)/,'falhas de cobertura não devem fabricar contagens');
});

test('a build de homologação usa backend loopback e habilita o Read Model somente em staging',()=>{
  const build=read('build-static.mjs');
  assert.match(build,/const staging = target === 'staging'/);
  assert.match(build,/stagingApiBaseUrl = String\(process\.env\.MBA_STAGING_API_BASE_URL \|\| 'http:\/\/127\.0\.0\.1:5051'\)/);
  assert.match(build,/window\.MBA_DASHBOARD_V1_ENABLED = true/);
  assert.match(build,/if \(staging\) \{/);
  assert.match(build,/if \(staging && dist === 'dist'\)/);
  const scripts=JSON.parse(read('package.json')).scripts;
  assert.match(scripts['build:staging'],/MBA_BUILD_TARGET=staging/);
});
