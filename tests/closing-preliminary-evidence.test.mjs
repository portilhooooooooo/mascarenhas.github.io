import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const flow=readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx',import.meta.url),'utf8');
const renderer=readFileSync(new URL('../src/tasks/renderers.tsx',import.meta.url),'utf8');

test('a etapa preliminar requer classificação conhecida e justificativa não vazia',()=>{
  assert.match(flow,/const preliminaryAvailable = \['Vitória', 'Derrota', 'Derrota voluntária', 'Acordo', 'Extinção'\]\.includes\(classifierClassification \|\| ''\)\s*&& Boolean\(classifierReason\?\.trim\(\)\)/);
  assert.match(renderer,/classifierReason=\{closingClassifierReason\(process\)\}/);
  assert.doesNotMatch(flow,/mas o motivo não está documentado\. Você concorda\?/);
});

test('a pergunta avalia o indício, não proclama o encerramento como Vitória',()=>{
  assert.match(flow,/O classificador sugeriu /);
  assert.match(flow,/Esse indício corresponde ao que consta nos autos\?/);
  assert.match(flow,/A resposta valida apenas a evidência apresentada/);
  assert.match(flow,/A aptidão ao encerramento será definida após as etapas jurídicas/);
});

test('sem motivo não há concordância artificial nem workflow v7',()=>{
  assert.match(flow,/stages=\{preliminaryAvailable \? \['Classificação preliminar', \.\.\.CLOSING_STAGES\] : CLOSING_STAGES\}/);
  assert.match(flow,/preliminaryAvailable && preliminaryAgreed === null/);
  assert.match(flow,/workflow_version: preliminaryAvailable \? 7 : 5/);
  assert.match(flow,/\.\.\.\(preliminaryAvailable \? \{ preliminary_classification_agreed: preliminaryAgreed === 'sim' \} : \{\}\)/);
  assert.match(flow,/stage="Cadastro de Sentença"/);
  assert.match(flow,/stage="Cadastro de Encerramento"/);
  assert.match(flow,/classificationAgreed === null/);
});
