import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const src = readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../src/tasks/renderers.tsx', import.meta.url), 'utf8');

test('rollback de Encerramentos: iniciar com sentença, sem classificador preliminar', () => {
  assert.match(src, /stages=\{CLOSING_STAGES\}/);
  assert.match(src, /stage="Cadastro de Sentença"/);
  assert.doesNotMatch(src, /stage="Classificação preliminar"/);
  assert.doesNotMatch(src, /closing\.preliminaryAgreed/);
  assert.doesNotMatch(src, /preliminary_classification_agreed/);
  assert.doesNotMatch(renderer, /classifierReason=/);
});

test('contrato V5 e todas as etapas jurídicas continuam preservados', () => {
  assert.match(src, /workflow_version: 5,/);
  assert.match(src, /stage="Cadastro de Acórdão"/);
  assert.match(src, /stage="Cadastro de Execução"/);
  assert.match(src, /stage="Cadastro de Trânsito em Julgado"/);
  assert.match(src, /stage="Cadastro de Encerramento"/);
  assert.match(src, /Houve pedido de execução\?/);
  assert.match(src, /Custas foram pagas\?/);
  assert.match(src, /classificationAgreed === null/);
});
