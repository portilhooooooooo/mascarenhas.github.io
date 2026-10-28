import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');
const config=source('src/dashboard/pagamentosSnapshot.ts');
const page=source('src/dashboard/PagamentosResultadosPage.tsx');
const board=source('src/dashboard/PagamentosKanban.tsx');
const css=source('src/dashboard/pagamentosResultados.css');

test('four disjoint statuses groups and no manual state mutation',()=>{
 const rows=[...config.matchAll(/\{id:'(?:aprovacao|aberto|liquidado|interrompido)',title:'[^']+',statuses:\[([^\]]+)\]/g)];
 assert.equal(rows.length,4);
 const all=rows.flatMap(m=>[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]));
 assert.equal(all.length,new Set(all).size);
 for(const s of ['Em aprovação (Valores)','Em aprovação (Técnica)','Liquidado','Pagamento cancelado'])assert.ok(all.includes(s));
 assert.doesNotMatch(board,/onDrop=|onDragStart=|method:'PATCH'|draggable/);
});
test('single compact endpoint and browser fallback only for 404',()=>{
 assert.match(config,/\/api\/resultados\/pagamentos\?/);
 assert.match(config,/typed\?\.status!==404/);
 assert.match(page,/queryFn:\(\{signal\}\)=>paymentSnapshot\(office,situation,signal\)/);
 assert.doesNotMatch(board,/useQueries|readStage|monthlyLiquidated/);
 assert.match(board,/enabled:enabled&&!!selected&&!!status/);
});
test('minimal UI: no repeated heading, supporting slogans or loose captions',()=>{
 assert.doesNotMatch(page,/payments-results-top|payments-results-eyebrow|<h1>|payments-results-note|results-period/);
 assert.doesNotMatch(board,/payments-results-board-head|board-caption|stage-mode|Visão por situação/);
 assert.match(page,/payments-results-filters--compact/);
 assert.match(css,/\.payments-results-kpi\{[^}]*height:100px/);
 assert.match(css,/\.payments-results-board-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});
test('non-authoritative payment type and receipts never invent values',()=>{
 assert.match(page,/<option value="acordo" disabled>/);
 assert.match(page,/data\?\.cards\.no_receipt/);
 assert.match(page,/Indisponível/);
 assert.match(config,/no_receipt:null/);
 assert.match(config,/types:null/);
});
