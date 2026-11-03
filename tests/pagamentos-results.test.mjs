import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const source=path=>readFileSync(new URL(path,root),'utf8');
const config=source('src/dashboard/pagamentosSnapshot.ts');
const page=source('src/dashboard/PagamentosResultadosPage.tsx');
const css=source('src/dashboard/pagamentosResultados.css');
const pie=source('src/dashboard/PagamentosTypePie.tsx');

test('kanban removed, retification metric remains',()=>{
 assert.doesNotMatch(page,/PagamentosKanban|Sem comprovante/);
 assert.match(page,/Em retificação/);
 assert.doesNotMatch(css,/payments-results-board-grid/);
 assert.doesNotMatch(config,/stages:Record/);
});
test('single compact endpoint and browser fallback only for 404',()=>{
 assert.match(config,/\/api\/resultados\/pagamentos\?/);
 assert.match(config,/typed\?\.status!==404/);
 assert.match(page,/queryFn:\(\{signal\}\)=>paymentSnapshot\(office,situation,signal,dates\)/);
 assert.doesNotMatch(page,/PagamentosKanban/);
 assert.match(config,/resultados\/pagamentos\/itens/);
});
test('minimal UI: no repeated heading, supporting slogans or loose captions',()=>{
 assert.doesNotMatch(page,/payments-results-top|payments-results-eyebrow|<h1>|payments-results-note|results-period/);
 assert.doesNotMatch(page,/PagamentosKanban|payments-results-board/);
 assert.match(page,/className="base-geral-filters payments-results-filters-standard"/);
 assert.match(page,/className="base-geral-filter"/);
 assert.ok(page.includes('<PagamentosTypePie'), 'payment nature remains a pie chart');
 assert.match(css,/\.payments-results \.payments-results-filters-standard\{/);
 assert.match(css,/\.payments-results-kpi\{[^}]*height:100px/);
 assert.doesNotMatch(page,/Sem comprovante/);
});
test('non-authoritative payment type and receipts never invent values',()=>{
 assert.match(page,/<SelectMenu label="Tipo" value="todos" onChange=\{\(\)=>\{\}\} disabled/);
 assert.doesNotMatch(page,/<select[^>]*aria-label="Tipo de pagamento"/);
 assert.match(page,/data\?\.cards\.retification/);
 assert.match(pie,/Distribuição indisponível/);
 assert.match(pie,/conic-gradient/);
 assert.match(config,/retification:null/);
 assert.match(config,/types:null/);
 assert.match(config,/types:PaymentTypeBreakdown\|null/);
});
