import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = name => readFileSync(new URL('../src/dashboard/'+name,import.meta.url),'utf8');
const base=read('baseGeral.css'), closing=read('encerramentos.css');
const shared=read('defesasResultados.css');
const page=read('EncerramentosPage.tsx');
const group=read('BaseGeralPage.tsx');
assert.match(base,/\.base-geral-page\{\s*width:100%;\s*max-width:1480px;/);
assert.match(base,/\.base-geral-bottom \{\s*display:flex;\s*flex-direction:column;/);
assert.match(base,/\.base-geral-bottom>\.base-geral-panel \{\s*width:100%;\s*height:auto;\s*min-height:0;/);
assert.match(base,/\.base-geral-kpis-primary \.base-geral-card,\s*\.base-geral-kpis-status \.base-geral-card \{\s*height:100px/);
assert.match(shared,/\.defense-results-card\{\s*height:100px;\s*min-height:100px;/);
assert.match(shared,/\.defense-results-page\{\s*width:100%;\s*max-width:1480px;/);
assert.match(group,/base-geral-products-table/);
assert.doesNotMatch(group,/productGradient/);
assert.match(closing,/\.closing-kpis-main\{grid-template-columns:repeat\(4/);
assert.match(closing,/\.closing-kpis-main \.closing-goal-kpi \.closing-gauge-value \{[\s\S]*?position:absolute/);
assert.match(page,/Ticket médio esperado/);
assert.match(page,/dados\?\.indicadores\?\.ticket_medio/);
assert.match(page,/dados\?\.indicadores\?\.ticket_amostra/);
assert.doesNotMatch(page,/api\/base-geral\/faturamento/);
assert.match(page,/não representa faturamento|Não representa faturamento/);
assert.match(page,/strokeDashoffset=\{\(1-\(goalPercent\?\?0\)\/100\)\*Math\.PI\*43\}/);
console.log('Result modules aligned to 100px and centered 1480px; Meta restored; historical ticket reused without billing access.');

assert.ok(group.indexOf('<section className="base-geral-panel base-geral-comparison">') <
  group.indexOf('<section className="base-geral-panel base-geral-products-table"'),
  'Comparação precede Produtos no fluxo de leitura');
assert.match(base,/--base-geral-orange-primary:#C77436/);
assert.match(base,/--base-geral-orange-light:#F0B77E/);
