// Compatibilidade frontend x contrato V4 (encerramentos e fase), com fixtures sintéticas.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const json=p=>JSON.parse(read('tests/fixtures/closing-v4/'+p));
const regular=json('closing-items.regular.json');
const enter=json('closing-items.enter.json');
const cards=json('andamentos-cards.json');
const service=read('src/dashboard/operacaoEncerramentosService.ts');
const filter=service.match(/ClosingIndicioFilter\s*=\s*([^;]+);/)[1];
const accepted=new Set([...filter.matchAll(/'([A-Z_]+)'/g)].map(m=>m[1]));

test('todo datajud_tipo não nulo cabe no filtro Indício do frontend',()=>{
  for(const r of [...regular.rows,...enter.rows]) if(r.datajud_tipo!==null) assert.ok(accepted.has(r.datajud_tipo),r.datajud_tipo);
});
test('ausência (null) permanece distinta de INDETERMINADO',()=>{
  const absent=regular.rows.filter(r=>r.datajud_tipo===null);
  const indet=regular.rows.filter(r=>r.datajud_tipo==='INDETERMINADO');
  assert.ok(absent.length&&indet.length);
  assert.ok(absent.every(r=>r.datajud_indicio_apto===null&&r.fase_recursal===null));
  assert.match(read('src/dashboard/OperacaoEncerramentosPage.tsx'),/row\.datajud_tipo\|\|'Não classificado'/);
});
test('isolamento: cada payload só traz sua carteira e o mesmo CNJ diverge entre elas',()=>{
  for(const body of [regular,enter]) assert.ok(body.rows.every(r=>r.portfolio_id===body.portfolio_id));
  const a=regular.rows.find(r=>r.cnj.startsWith('0000001')), b=enter.rows.find(r=>r.cnj.startsWith('0000001'));
  assert.notEqual(a.portfolio_id,b.portfolio_id); assert.notEqual(a.datajud_tipo,b.datajud_tipo);
});
test('cards de Andamentos: chaves existem na página e carteira é verificada',()=>{
  const page=read('src/dashboard/AndamentosCardsPage.tsx');
  for(const k of Object.keys(cards.regular_certified_and_gaps.cards)) assert.ok(page.includes("key:'"+k+"'"),k);
  assert.match(page,/body\.portfolio_id!==portfolio/);
  assert.notEqual(cards.regular_certified_and_gaps.portfolio_id,cards.enter_other_scope.portfolio_id);
});
test('zero real (CURRENT) difere de ausência (value null)',()=>{
  const c=cards.regular_certified_and_gaps.cards;
  assert.equal(c.SENTENCA_EXTINCAO.value,0); assert.equal(c.RECURSAL_PROCEDENTE.value,null);
});
