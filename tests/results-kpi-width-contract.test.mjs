import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/dashboard/ui-foundations.css',import.meta.url),'utf8');
test('Base Geral and Encerramentos share one maximum content width',()=>{
 assert.match(css,/\.gestao-processual-react :is\(\.base-geral-page,\.closing-page-v2\)\s*\{[^}]*max-width:1440px/s);
});
test('hierarchy grid: 60-track desktop and two columns up to 900px, ten-pixel gutter',()=>{
 assert.match(css,/:is\(\.base-geral-kpi-layout,\.closing-kpis-main\)\s*\{[^}]*repeat\(60,minmax\(0,1fr\)\)[^}]*gap:10px/s);
 const start=css.lastIndexOf('@media(max-width:900px)');
 assert.match(css.slice(start,start+300),/repeat\(2,minmax\(0,1fr\)\)/);
});
test('secondary cards share compact height and padding; the first card leads',()=>{
 assert.match(css,/:is\(\.base-geral-kpi-layout \.base-geral-card,\.closing-kpis-main>\.closing-kpi\)\s*\{[^}]*min-height:84px;[^}]*padding:12px 14px/s);
 assert.match(css,/:first-child \{\s*grid-column:span 30/);
});
