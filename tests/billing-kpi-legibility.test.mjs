import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/dashboard/baseGeral.css',import.meta.url),'utf8');
const page=readFileSync(new URL('../src/dashboard/BaseGeralPage.tsx',import.meta.url),'utf8');

test('Regular billing KPI keeps its title, amount, and month inside a 100px card',()=>{
 assert.match(page,/className="base-geral-card mba-metric-card base-geral-revenue-card"/);
 assert.match(page,/<strong>\{money\(estimatedRevenue\)\}<\/strong>/);
 assert.match(page,/className="base-geral-revenue-note"/);
 const scope='.gestao-processual-react .base-geral-kpi-layout .base-geral-revenue-card.mba-metric-card';
 const start=css.indexOf(scope+' {');
 assert.ok(start>0);
 const rule=css.slice(start,css.indexOf('}',start));
 assert.match(rule,/display:grid;/);
 assert.match(rule,/grid-template-rows:min-content minmax\(30px,1fr\) min-content;/);
 assert.match(rule,/gap:4px;/);
});
test('the amount cannot be flex-shrunk or clipped vertically and remains numeric',()=>{
 const rule=css.match(/\.gestao-processual-react \.base-geral-kpi-layout \.base-geral-revenue-card\.mba-metric-card > strong \{([^}]+)\}/)?.[1];
 assert.ok(rule);
 assert.match(rule,/overflow:visible;/);
 assert.match(rule,/min-height:30px;/);
 assert.match(rule,/line-height:1\.2;/);
 assert.match(rule,/white-space:nowrap;/);
 assert.match(rule,/font-variant-numeric:tabular-nums;/);
});
test('month subtitle does not steal extra vertical space',()=>{
 const rule=css.match(/\.gestao-processual-react \.base-geral-kpi-layout \.base-geral-revenue-card\.mba-metric-card > \.base-geral-revenue-note \{([^}]+)\}/)?.[1];
 assert.ok(rule);
 assert.match(rule,/margin:0;/);
 assert.match(rule,/line-height:1\.3;/);
});
