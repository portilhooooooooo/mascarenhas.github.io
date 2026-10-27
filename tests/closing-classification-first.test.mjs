import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const src=readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx',import.meta.url),'utf8');
const render=readFileSync(new URL('../src/tasks/renderers.tsx',import.meta.url),'utf8');
test('suggestion appears before sentence workflow, with structured disagreement branches',()=>{
  assert.match(src,/export function ClosingAnalysisFlow\(props: Props\)/);
  assert.match(src,/return <ClosingPreclassificationFlow \{\.\.\.props\}/);
  assert.match(src,/onFullReview=\{\(\) => setFullReview\(true\)\}/);
  assert.match(src,/Identificamos que esse processo se enquadra como /);
  assert.match(src,/Em qual ponto você discorda\?/);
  for(const name of ['sentenca','acordao','execucao','transito','encerramento']){
    assert.match(src,new RegExp(''+name+": \{ question:"));
  }
  assert.match(src,/workflow_version: 6, review_mode: 'preclassification'/);
  assert.match(src,/disagreement_point: agreed === 'nao' \? point : null/);
  assert.match(src,/disagreement_answer: agreed === 'nao' \? answer : null/);
  assert.match(src,/Abrir análise completa/);
  assert.match(src,/não autoriza encerramento automático/);
  assert.match(render,/classifierReason=\{closingClassifierReason\(process\)\}/);
});
