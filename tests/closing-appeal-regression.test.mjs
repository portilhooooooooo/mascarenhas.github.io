import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx', import.meta.url), 'utf8');
assert.match(source, /workflow_version: 4/, 'Require explicit appeal effect version');
assert.match(source, /condenacao_reduzida/, 'Reduction of award must be distinguished');
assert.match(source, /condenacao_afastada/, 'Total reversal must be distinguished');
assert.match(source, /Condenação reduzida \(ex\.: redução do dano moral\)/);
assert.match(source, /finalMerit = 'derrota';/, 'Still-adverse appeal outcome remains defeat');
assert.doesNotMatch(source, /appellant === 'banco' \? 'vitoria'/, 'Bank winning appeal alone is insufficient');
assert.match(source, /appealResultValid/, 'Legacy cached generic answers cannot pass automatically');
console.log('Appellate effect v4 UI contract verified.');
