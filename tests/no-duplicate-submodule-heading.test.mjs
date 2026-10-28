import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const pages=[
 ['src/dashboard/BaseGeralPage.tsx','Base Geral'],
 ['src/dashboard/EncerramentosPage.tsx','Encerramentos'],
 ['src/ranking/RankingPage.tsx','Ranking'],
 ['src/dashboard/OperacaoPage.tsx','Pagamentos'],
 ['src/dashboard/OperacaoLiminarPage.tsx','Liminar'],
 ['src/dashboard/OperacaoEncerramentosPage.tsx','Encerramentos'],
 ['src/dashboard/ProtocolosPage.tsx','Protocolos'],
 ['src/dashboard/DefesasPage.tsx','Defesas'],
 ['src/dashboard/DefesasResultadosPage.tsx','Defesas'],
 ['src/dashboard/ProtocolosResultadosPage.tsx','Protocolos']
];
test('submodule tab names remain accessible in the real upper navigation',()=>{
  const analytics=read('src/dashboard/GestaoProcessualPage.tsx');
  const operation=read('src/dashboard/OperacaoPage.tsx');
  for(const label of ['Base Geral','Encerramentos','Ranking','Defesas','Protocolos'])
    assert.match(analytics,new RegExp('>'+label+'<\\/button>'));
  for(const label of ['Pagamentos','Liminar','Encerramentos','Protocolos','Defesas'])
    assert.match(operation,new RegExp('>'+label+'<\\/button>'));
});
test('module bodies do not duplicate their active tab as large h1 headings',()=>{
  for(const [file,label] of pages) {
    assert.doesNotMatch(read(file),new RegExp('<h1>'+label+'<\\/h1>'),file);
  }
});
test('critical inner section headings, controls and context are kept',()=>{
  const base=read('src/dashboard/BaseGeralPage.tsx');
  const close=read('src/dashboard/EncerramentosPage.tsx');
  const ranking=read('src/ranking/RankingPage.tsx');
  const defenses=read('src/dashboard/DefesasResultadosPage.tsx');
  assert.match(base,/<h2>Prejuízo X Lucro<\/h2>/);
  assert.match(base,/<h2>Produto<\/h2>/);
  assert.match(base,/className="base-geral-filters"/);
  assert.match(close,/closing-filter-row/);
  assert.match(close,/Distribuição por aging/);
  assert.match(close,/aria-label="Encerramentos"/);
  assert.match(ranking,/Projeção não homologada/);
  assert.match(ranking,/ranking-refresh/);
  assert.match(defenses,/Enter · Pendências Talisman/);
});
test('theme uses persisted sol/lua semantics and labels current mode',()=>{
  const theme=read('brand-theme.js');
  assert.match(theme,/selected === 'sol' \? 'Sol' : 'Lua'/);
  assert.match(theme,/Tema ' \+ \(selected === 'sol'/);
  assert.match(theme,/localStorage\.setItem\(key, next\)/);
});
