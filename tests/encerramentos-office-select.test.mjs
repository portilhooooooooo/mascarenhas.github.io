import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../src/dashboard/'+name,import.meta.url),'utf8');
const closing=read('EncerramentosPage.tsx'),payments=read('PagamentosResultadosPage.tsx');
test('filter selector is React, office scope goes to both dashboard and analyses',()=>{
  assert.match(closing,/<SelectMenu label="Escritório"/);
  assert.match(closing,/<SelectMenu label="Tipo"/);
  assert.match(closing,/query\.set\('escritorio', escritorio\)/);
  assert.match(closing,/params\.set\('escritorio',escritorio\)/);
  assert.match(closing,/escritorio_andamentos/);
});
test('payments selectors use React and disabled type stays unavailable',()=>{
  assert.match(payments,/<SelectMenu label="Escritório"/);
  assert.match(payments,/<SelectMenu label="Situação"/);
  assert.ok(payments.includes('<SelectMenu label="Tipo" value="todos" onChange={()=>{}} disabled'));
});
test('all dashboard filter bars use the same React dropdown control',()=>{
  for(const name of ['BaseGeralPage.tsx','VisaoGeralPage.tsx','OperacaoEncerramentosPage.tsx','OperacaoLiminarPage.tsx','ProtocolQueue.tsx']){
    assert.match(read(name),/SelectMenu/,name);
  }
});
