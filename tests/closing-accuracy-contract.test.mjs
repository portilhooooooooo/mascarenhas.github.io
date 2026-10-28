import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/dashboard/EncerramentosPage.tsx',import.meta.url),'utf8');
test('card denominator and non-comparable counts are explained',()=>{
  assert.match(source,/accuracy\?\.avaliados\?\?0/);
  assert.match(source,/análises com resultado jurídico comparável/);
  assert.match(source,/sem comparação válida/);
});
test('drilldown displays the classifier, the legal result and their comparison',()=>{
  assert.match(source,/classificacao_validada:row\.classificacao_validada/);
  assert.match(source,/<th>Validado<\/th>/);
  assert.match(source,/original × resultado jurídico validado/);
  assert.match(source,/Corresponde/);
  assert.match(source,/Não comparável/);
  assert.doesNotMatch(source,/concordância declarada pelo analista/);
});
