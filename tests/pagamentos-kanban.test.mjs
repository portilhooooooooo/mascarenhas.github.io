import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root = new URL('../', import.meta.url);
const kanban = readFileSync(new URL('src/dashboard/PagamentosKanban.tsx',root),'utf8');
const page = readFileSync(new URL('src/dashboard/PagamentosResultadosPage.tsx',root),'utf8');
const style = readFileSync(new URL('src/dashboard/pagamentosResultados.css',root),'utf8');
test('kanban uses four disjoint business stages',()=>{
  const stages=[...kanban.matchAll(/\{id:'[^']+',title:'[^']+',statuses:\[([^\]]+)\]/g)];
  assert.equal(stages.length,4);
  const statuses=stages.flatMap(stage=>[...stage[1].matchAll(/'([^']+)'/g)].map(m=>m[1]));
  assert.equal(new Set(statuses).size,statuses.length,'a situation must never be counted twice');
  for(const situation of ['Liquidado','Em aprovação (Valores)','Em aprovação (Técnica)','Em aberto','Aguardando pagamento','Pagamento cancelado','Recusado (Valores)'])assert.ok(statuses.includes(situation),situation);
});
test('kanban is read-only, paginated and isolated by session / office',()=>{
  assert.match(kanban,/readPayments\(office,status,page,25,signal\)/);
  assert.match(kanban,/params\.set\('credenciado',office\)/);
  assert.match(kanban,/scope,'pagamentos-kanban',office,situation,stage\.id/);
  assert.doesNotMatch(kanban,/draggable=|onDragStart=|onDrop=|method:'POST'|method:'PATCH'/);
  assert.match(page,/<PagamentosKanban visible=\{active\} office=\{office\} situation=\{situation\} disabled=\{typed\}\/>/);
});
test('KPIs preserve 100px height and board uses four columns at desktop',()=>{
  assert.match(style,/\.payments-results-kpi\{height:100px;min-height:100px;/);
  assert.match(style,/\.payments-results-board-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});
