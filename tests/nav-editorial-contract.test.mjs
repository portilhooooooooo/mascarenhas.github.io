import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const css=read('nav-editorial.css');
const build=read('build-static.mjs');
const operation=read('src/dashboard/OperacaoPage.tsx');
const results=read('src/dashboard/GestaoProcessualPage.tsx');
const shell=read('src/dashboard/main.tsx');
const theme=read('brand-theme.js');

test('marca original e fonte Instrument Sans alinhada ao shell',()=>{
  assert.match(html, /<img class="brand-symbol" src="\/favicon-white.svg\?v=20261013-original-mark" alt="Mascarenhas Barbosa">/);
  assert.match(html, /<span class="brand-word">Backoffice<\/span>/);
  assert.match(css,/\.sidebar \.brand \.brand-word \{[\s\S]*?font:600 15px\/1\.1 "Instrument Sans"/);
  assert.match(html,/Instrument\+Sans:wght@400;500;600/);
  assert.match(css,/font-family:"Instrument Sans",Inter/);
  assert.doesNotMatch(css, /(?:\.protocolos-table-react|\.tasks-management-table).*Instrument Sans/);
});

test('topbar independente, switch original Sol Lua',()=>{
  assert.match(html, /<div id="mba-shell-tabs" class="mba-shell-tabs" aria-label="Submódulos"><\/div>/);
  assert.match(css,/\.app-shell > \.sidebar \{[\s\S]*?border-radius:20px/);
  assert.match(css,/\.app-shell > \.main-area > \.topbar \{[\s\S]*?border-radius:16px/);
  assert.match(theme,/const actions = document\.querySelector\('\.topbar \.top-actions'\)/);
  assert.match(theme,/button\.addEventListener\('click', function/);
  assert.doesNotMatch(html, /qa-theme-selector|data-theme="sol"/);
});

test('geometria de Carteiras, estado ativo e ordenação',()=>{
  assert.match(css,/\.app-shell \.sidebar \.main-nav \{[\s\S]*?gap:4px/);
  assert.match(css,/\.app-shell \.sidebar \.main-nav \.nav-item,[\s\S]*?height:40px/);
  assert.match(css,/border-radius:7px/);
  assert.match(css,/\.nav-item:not\(\.active\) \{[\s\S]*?background:transparent !important/);
  const nav=shell.match(/const orderedItems: Array<HTMLElement \| null> = \[([\s\S]*?)\];/)[1];
  const pages=[...nav.matchAll(/\[data-page="([^"]+)"\]/g)].map(x=>x[1]);
  assert.deepEqual(pages,['dashboard','processos','tarefas','automacoes','acordos']);
  assert.doesNotMatch(css,/\.main-nav \.nav-item\[data-page="acordos"\]\s*\{\s*margin-top/);
  assert.doesNotMatch(css,/\.main-nav \.nav-item\[data-page="acordos"\]::after/);
});

test('usuários no rodapé respeita permissão existente',()=>{
  assert.match(html,/<button class="nav-item sidebar-users-button" data-page="usuarios" data-permission="users.view" type="button" hidden>/);
  assert.ok(html.indexOf('class="sidebar-users-button"')===-1); // class is part of nav-item
  assert.ok(html.indexOf('data-permission="users.view" type="button" hidden')<html.indexOf('id="logout-button"'));
  assert.match(css,/\.sidebar-users-button\[hidden\] \{ display:none !important/);
});

test('submódulos reais no portal somem quando Operação não está ativa',()=>{
  assert.match(operation,/import \{createPortal\} from 'react-dom'/);
  assert.match(operation,/const shellTabs = document\.getElementById\('mba-shell-tabs'\)/);
  assert.match(operation,/attributeFilter:\['class'\]/);
  assert.match(operation,/operationVisible \? createPortal\(operationTabs, shellTabs\) : null/);
  assert.match(operation,/onClick=\{\(\) => navigateOperationModule\('pagamentos'\)\}/);
});

test('deploy de testes inclui o CSS novo e versão anti-cache',()=>{
  assert.match(build,/'nav-editorial.css'/);
  assert.match(build,/nav-editorial\\\.css/);
});

test('submódulos reais de Resultados usam a navbar sem duplicação',()=>{
  assert.match(results,/import \{createPortal\} from 'react-dom'/);
  assert.match(results,/const shellTabs = document\.getElementById\('mba-shell-tabs'\)/);
  assert.match(results,/visible \? createPortal\(resultsTabs, shellTabs\) : null/);
  assert.match(results,/aria-label="Seções de Analytics"/);
  assert.match(results,/onClick=\{\(\) => navigateAnalytics\('analytics'\)\}/);
});
