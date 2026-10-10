import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { runInNewContext } from 'node:vm';

const src = readFileSync(resolve('ux-preview/reimagined/app.js'), 'utf8');
const css = readFileSync(resolve('ux-preview/reimagined/design.css'), 'utf8');
const html = readFileSync(resolve('ux-preview/reimagined/index.html'), 'utf8');
const root = { innerHTML: '' };
const events = {};
const document = {
  documentElement: {setAttribute() {}},
  getElementById(id) { return id === 'app' ? root : null; },
  addEventListener(name, fn) { events[name] = fn; },
};
const storage = { getItem() { return null; }, setItem() {} };
const context = {
  document,
  localStorage: storage,
  setTimeout() {},
  Intl,
};
runInNewContext(src + '\nglobalThis.TEST_API = {s,roles,render,questions};', context, {timeout: 3000});
const {s,roles,render,questions} = context.TEST_API;
assert.equal(Object.keys(roles).length,5,'five distinct roles');
assert.ok(html.includes('design.css') && html.includes('app.js'));
assert.ok(!css.includes('@import url('),'no remote font stylesheet');
assert.ok(!src.includes('fetch('),'prototype cannot access backend');
const expectations = {
  analista: ['Minha fila','Próximo caso','Meu desempenho'],
  supervisor: ['Central operacional','Oportunidades de execução','Fila da equipe'],
  gerente: ['Visão executiva','Leitura executiva','Ranking'],
  cliente: ['Minha carteira','Sua carteira, com clareza.','Entregas'],
  admin: ['Acessos','Matriz de capacidades','Integrações'],
};
for (const [role,words] of Object.entries(expectations)){
  s.role=role; s.view=roles[role].home;render();
  for(const word of words) assert.ok(root.innerHTML.includes(word),role+' missing '+word);
  assert.ok(root.innerHTML.includes('Dados 100% fictícios'),'clear prototype label');
}
s.role='cliente';s.view='Minha carteira';render();
const clientNav=root.innerHTML.split('<nav class="side-links" aria-label="Navegação principal">')[1].split('</nav>')[0];
assert.ok(!clientNav.includes('Acessos') && !clientNav.includes('Fila da equipe'),'client sidebar must be minimal');
assert.ok(!root.innerHTML.includes('5007488-72.2024.8.21.0048'),'client view hides internal process fixture');
const portfolio=root.innerHTML.split('<select id="portfolio"')[1].split('</select>')[0];
assert.ok(portfolio.includes('Agibank &lt;&gt; MBA') || portfolio.includes('Agibank <> MBA'),'client sees own portfolio');
assert.ok(!portfolio.includes('Nubank'),'client portfolio selector must be scoped');
s.role='analista';s.view='Análise';s.step=0;s.answers={};render();
assert.ok(root.innerHTML.includes('Qual foi o resultado da sentença?'));
assert.equal(questions.at(-1).question,'Você concorda com a classificação?');
s.role='gerente';s.view='Ranking';render();assert.ok(root.innerHTML.includes('Nota não calculada'));
assert.ok(events.click && events.change && events.keydown,'basic demo interactions registered');
console.log('Reimagined preview checks passed: 5 roles, client isolation in UI, Q&A and ranking.');
