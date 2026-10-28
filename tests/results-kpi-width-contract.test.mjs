import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/dashboard/ui-foundations.css',import.meta.url),'utf8');
test('Base Geral and Encerramentos share one maximum content width',()=>{
 assert.match(css,/\.gestao-processual-react :is\(\.base-geral-page,\.closing-page-v2\)\s*\{[^}]*max-width:1200px/s);
});
test('one explicit 4 / 3 / 2 / 1 column grid with a ten-pixel gutter',()=>{
 assert.match(css,/:is\(\.base-geral-kpi-layout,\.closing-kpis-main\)\s*\{[^}]*repeat\(4,minmax\(0,1fr\)\)[^}]*gap:10px/s);
 for(const [width,columns] of [[1160,3],[900,2],[500,1]]){
  const start=css.lastIndexOf(`@media(max-width:${width}px)`);
  assert.ok(start!==-1,'Breakpoint '+width+' missing');
  assert.match(css.slice(start,start+300),new RegExp(columns===1?'grid-template-columns:minmax\\(0,1fr\\)':'grid-template-columns:repeat\\('+columns+',minmax\\(0,1fr\\)\\)'));
 }
});
test('equal 100px card heights and same padding',()=>{
 assert.match(css,/:is\(\.base-geral-kpi-layout \.base-geral-card,\.closing-kpis-main>\.closing-kpi\)\s*\{[^}]*height:100px;[^}]*padding:13px 14px/s);
});
