import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');

test('routes-testing renders the scoped Read Model instead of legacy Todos',()=>{
  const view=read('src/dashboard/ReadModelDashboard.tsx');
  const page=read('src/dashboard/AndamentosCardsPage.tsx');
  const packageJson=JSON.parse(read('package.json'));
  assert.match(packageJson.scripts['build:routes-testing'],/vite build --mode routes-testing/);
  assert.match(view,/import\.meta\.env\.MODE==='routes-testing'/);
  assert.match(page,/if\(readModelEnabled\(\)\)return <ReadModelDashboard dashboard="andamentos"/);
});

test('uncertified source counts remain visible as partial with no false drilldown',()=>{
  const view=read('src/dashboard/ReadModelDashboard.tsx');
  const card=read('src/dashboard/metricState.tsx');
  assert.match(view,/uncertifiedLabel=\{dashboard==='andamentos'\?'parcial':undefined\}/);
  assert.match(view,/partialWithoutDetails=dashboard==='andamentos'&&state.kind==='uncertified'/);
  assert.match(view,/rev&&!partialWithoutDetails/);
  assert.match(view,/ANDAMENTOS_REFRESH_MS=30000/);
  assert.match(view,/refetchInterval:visible&&\(isCadastro\|\|isAndamentos\)/);
  assert.match(card,/const tag=state.kind==='uncertified'&&originalTag&&uncertifiedLabel/);
});
