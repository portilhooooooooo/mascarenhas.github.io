import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../src/dashboard/', import.meta.url);
const read = name => readFileSync(new URL(name, root), 'utf8');
const css = read('baseGeral.css');
const page = read('BaseGeralPage.tsx');
const closing = read('encerramentos.css');
const defense = read('defesasResultados.css');

assert.match(css,/\.base-geral-kpi-layout \{\s*display:grid;\s*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(css,/\.base-geral-kpi-layout\.with-billing \{\s*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css,/\.base-geral-kpi-layout>\.base-geral-kpis \{\s*display:contents/);
assert.match(page,/className=\{'base-geral-kpi-layout'/);
assert.match(css,/\.base-geral-kpi-layout \.base-geral-card \{\s*height:100px;\s*min-height:100px/);
assert.match(css,/\.base-geral-bottom \{\s*display:flex;\s*flex-direction:column/);
assert.match(css,/\.base-geral-bottom>\.base-geral-panel \{\s*width:100%;\s*height:auto;\s*min-height:0/);
assert.match(page,/\.sort\(\(a, b\) => Number\(b\.value\) - Number\(a\.value\)\)/);
assert.match(page,/className="base-geral-product-share"/);
assert.match(page,/setProduct\(row\.label\)/);
assert.match(page,/className=\{'base-geral-comparison-track'/);
assert.match(page,/openDetail\('active'\)/);
assert.match(page,/openDetail\('prescribed'\)/);
assert.doesNotMatch(page,/conic-gradient|className=\{'base-geral-donut '/);
assert.match(closing,/\.closing-kpi-button,\.closing-goal-kpi\{height:100px/);
assert.match(defense,/\.defense-results-card\{\s*height:100px/);
console.log('Aligned KPI rows, stacked product list, compact segmented comparison and drilldowns.');
