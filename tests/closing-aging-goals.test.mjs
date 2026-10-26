import assert from 'node:assert/strict';
import { regularAgingGoals, regularAgingRanking, regularAgingSummary, REGULAR_AGING_GOALS } from '../src/dashboard/closingAgingGoals.ts';
import { readFileSync } from 'node:fs';

const screenshot = [
  { faixa: '0–12 meses', quantidade: 31 },
  { faixa: '12–24 meses', quantidade: 59 },
  { faixa: '>24 meses', quantidade: 113 },
  { faixa: 'Sem tag / não reconhecida', quantidade: 0 },
];
const rows = regularAgingGoals(screenshot, 203);
const total = regularAgingSummary(rows);
assert.deepEqual(REGULAR_AGING_GOALS.map(row => row.meta), [296, 314, 462]);
assert.deepEqual(rows.map(row => row.atual), [31, 59, 113]);
assert.deepEqual(rows.map(row => row.gap), [265, 255, 349]);
assert.deepEqual(rows.map(row => Math.round(row.composicaoPercent * 10) / 10), [15.3, 29.1, 55.7]);
assert.deepEqual(rows.map(row => Math.round(row.faltaPercent * 10) / 10), [89.5, 81.2, 75.5]);
assert.equal(rows[1].label, '13–24 meses');
assert.equal(total.meta, 1072);
assert.equal(total.atual, 203);
assert.equal(total.gap, 869);
assert.deepEqual(regularAgingRanking(rows), { faixasAtingidas: 0, totalFaixas: 3, pontos: 0, pontosPossiveis: 0.6 });
assert.equal(Math.round(total.faltaPercent * 10) / 10, 81.1);

// Overachievement never creates a negative gap or a negative percentage.
const over = regularAgingGoals([
  { faixa: '0–12 meses', quantidade: 360 },
  { faixa: '12–24 meses', quantidade: 400 },
  { faixa: '>24 meses', quantidade: 500 },
], 1260);
assert.deepEqual(over.map(row => row.gap), [0, 0, 0]);
assert.deepEqual(over.map(row => row.faltaPercent), [0, 0, 0]);
assert.equal(regularAgingSummary(over).gap, 0);
assert.deepEqual(regularAgingRanking(over), { faixasAtingidas: 3, totalFaixas: 3, pontos: 0.6, pontosPossiveis: 0.6 });
const partialRanking = regularAgingRanking(regularAgingGoals([
  { faixa: '0–12 meses', quantidade: 296 },
  { faixa: '12–24 meses', quantidade: 313 },
  { faixa: '>24 meses', quantidade: 462 },
], 1071));
assert.equal(partialRanking.faixasAtingidas, 2);
assert.equal(partialRanking.pontos, 0.4);

// Unrecognized aging counts in the composition denominator but does not reduce any goal.
const unknown = regularAgingGoals([...screenshot.slice(0, 3),
  { faixa: 'Sem tag / não reconhecida', quantidade: 20 }], 223);
assert.equal(regularAgingSummary(unknown).gap, 869);
assert.equal(Math.round(unknown[0].composicaoPercent * 10) / 10, 13.9);

const ui = readFileSync(new URL('../src/dashboard/EncerramentosPage.tsx', import.meta.url), 'utf8');
assert.ok(ui.includes('regularAgingGoals(ages, total)'));
assert.ok(ui.includes('const regular = dados?.carteira ==='));
assert.ok(ui.includes('closing-matrix-gap'));
assert.ok(ui.includes('Composição atual'));
assert.ok(ui.includes('Faltam (%)'));
assert.ok(ui.includes('GAP total do Regular'));
assert.ok(ui.includes('Pontuação Aging'));
assert.ok(ui.includes('closing-aging-card-gap'));
assert.ok(ui.includes('closing-goal-footer'));
assert.ok(!ui.includes('closing-gauge'));
console.log('Metas Regular, composição, percentual faltante e GAP validados.');
