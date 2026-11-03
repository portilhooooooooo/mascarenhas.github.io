import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const components = read('src/dashboard/dashboardFeedback.tsx');
const css = read('src/dashboard/dashboardFeedback.css');

assert.match(components, /function MetricDots/);
assert.match(components, /aria-label=\{label\}/);
assert.match(components, /<i aria-hidden="true"\/><i aria-hidden="true"\/><i aria-hidden="true"\/>/);
assert.match(components, /Atualização indisponível\. Últimos dados preservados\./);
assert.match(components, /Dados temporariamente indisponíveis\./);
assert.match(components, /Tentar novamente/);
assert.match(components, /role=\{hasSnapshot\?'status':'alert'\}/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.doesNotMatch(css, /skeleton|shimmer/i);

for (const path of [
  'src/dashboard/BaseGeralPage.tsx',
  'src/dashboard/EncerramentosPage.tsx',
  'src/dashboard/VisaoGeralPage.tsx',
  'src/dashboard/PagamentosResultadosPage.tsx',
  'src/dashboard/DefesasResultadosPage.tsx',
  'src/dashboard/ProtocolosResultadosPage.tsx',
]) {
  const source = read(path);
  assert.match(source, /from '\.\/dashboardFeedback';/, path+' must import shared feedback');
  assert.match(source, /<MetricDots/, path+' must use three-dot KPI loading');
  assert.match(source, /<DashboardRecovery/, path+' must offer shared recovery');
}
const base = read('src/dashboard/BaseGeralPage.tsx');
assert.doesNotMatch(base, /base-geral-skeleton" aria-label="Carregando"/);
assert.match(base, /setBillingError\(cause instanceof Error/);
assert.doesNotMatch(base, /setBilling\(null\); setBillingKey\(''\); setBillingError\(cause/);
assert.match(base, /billingKey === filterKey && portfolio === 'agibank_mba'/);

const closings = read('src/dashboard/EncerramentosPage.tsx');
assert.match(closings, /loading=\{pending && !shown\}/);
assert.match(closings, /loadedKey === filterKey \? dados : null/);
assert.match(closings, /setOfficesRetry\(value=>value\+1\)/);
assert.match(closings, /carteira!=='Agibank Enter'/);
const payments = read('src/dashboard/PagamentosResultadosPage.tsx');
assert.match(payments, /snapshot\.isPending && !data\?<MetricDots\/>/);
assert.match(payments, /<DashboardRecovery hasSnapshot=\{Boolean\(data\)\}/);
const defenses = read('src/dashboard/DefesasResultadosPage.tsx');
const protocols = read('src/dashboard/ProtocolosResultadosPage.tsx');
for (const source of [defenses,protocols]) {
  assert.match(source, /summary\.isPending && !summary\.data\?<MetricDots\/>/);
  assert.match(source, /<DashboardRecovery hasSnapshot=\{Boolean\(summary\.data\)\}/);
}
const overview = read('src/dashboard/VisaoGeralPage.tsx');
assert.equal((overview.match(/<Metric loading=\{pending&&!shown\}/g)||[]).length,8);
console.log('PASS: standardized KPI dots, scoped last-good snapshots and retry feedback for six dashboard modules.');
