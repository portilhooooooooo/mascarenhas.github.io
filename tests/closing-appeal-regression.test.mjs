import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx', import.meta.url), 'utf8');
const options = source.split('const APPEAL_OPTIONS:')[1].split('function BinaryChoice')[0];
const sentenceOptions = options.match(/  (procedente|parcialmente_procedente|improcedente|extincao): \[([\s\S]*?)\n  \],/g) || [];

assert.match(source, /workflow_version: 5/, 'Acórdão v5 uses its own contract');
assert.equal(sentenceOptions.length, 4, 'All four sentence types have dynamic choices');
for (const group of sentenceOptions) {
  assert.equal((group.match(/value:/g) || []).length, 4, 'Precisely four choices per sentence type');
  for (const choice of ['Sentença anulada', 'Outro']) assert.ok(group.includes(choice), choice);
}
assert.match(options, /Convertida para improcedência/, 'Defeat sentence maps to improcedência');
assert.match(options, /Convertida para procedência/, 'Victory sentence maps to procedência');
assert.match(options, /Manutenção da condenação/);
assert.match(options, /Manutenção da improcedência/);
assert.match(options, /Manutenção da extinção/);
assert.doesNotMatch(options, /Não foi possível identificar|resultado_indeterminado|Condenação reduzida/);
assert.match(source, /appeal_other_description:/, 'Other description is submitted');
assert.match(source, /otherDescriptionValid/, 'Other must contain details');
assert.match(source, /classification_agreed: false/, 'Disagreement is always escalated for human review');
assert.match(source, /setAppealOtherDescription/, 'Other description uses task draft');
assert.match(source, /finalMerit = 'indeterminado'; \/\/ Resultado ainda não mapeado/, 'Other cannot turn into victory');
assert.doesNotMatch(source, /appellant === 'banco' \? 'vitoria'/);
console.log('Acórdão v5: four dynamic options, required Outro description and review verified.');
