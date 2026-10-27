import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = name => readFileSync(new URL('../src/tasks/'+name, import.meta.url), 'utf8');
const flow = read('ClosingAnalysisFlow.tsx');
const renderer = read('renderers.tsx');
const style = read('closingAnalysisFlow.css');

assert.match(flow,/type ClosingConfirmationDraft = \{/);
assert.match(flow,/workflow_version: 6;\s*confirmation: 'sim';/);
assert.match(flow,/await onSubmit\(\{workflow_version:6,confirmation:'sim'\}\)/);
assert.doesNotMatch(flow,/useQaField<YesNo>\(draftKey, 'closing\.classificationAgreed'/,
  'An old final agreement must never become a new initial YES');
assert.match(flow,/closing\.priorClassificationAgreed/);
assert.match(flow,/closing\.disagreementPoint/);
const confirm=flow.indexOf('name="closing-prior-agreement"');
const point=flow.indexOf('name="closing-disagreement-point"');
const sentence=flow.indexOf('name="closing-sentence"');
assert.ok(confirm>0 && point>confirm && sentence>point,'Prior review and disagreement precede legal questions');
assert.match(flow,/Identificamos que esse processo se enquadra como/);
assert.match(flow,/Você concorda com a afirmação acima/);
assert.match(flow,/O motivo não consta da análise prévia/);
for (const field of ['sentenca','acordao','recurso','transito','execucao','custas','classificacao','outro']){
  assert.match(flow,new RegExp('value:\''+field+'\''));
}
assert.match(flow,/manualReview && classificationAgreed === 'nao' && hasSelectedPoint && otherPointValid/);
assert.match(flow,/classification_agreed: false/);
assert.match(flow,/classification_disagreement_reason: \(disagreementExplanation/);
assert.match(flow,/first_instance_merit: sentence/);
assert.match(renderer,/classifierReason=\{classifierReason\}/);
assert.match(renderer,/source_metadata/);
assert.match(renderer,/ClosingAnalysisDraft \| ClosingConfirmationDraft/);
assert.match(style,/\[data-qa-last='true'\] \.closing-review-observation\[aria-label='Resultado proposto da correção'\]/);
console.log('V6: first classification question, explicit disagreement point, manual legal flow, safe drafts, server-only YES.');
