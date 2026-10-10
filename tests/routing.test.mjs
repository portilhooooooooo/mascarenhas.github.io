import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8').split('const appShell =')[0];

function environment(initialPath = '/tarefas', options = {}) {
  const allowed = new Set(options.allowed || ['dashboard', 'tarefas', 'automacoes', 'acordos', 'protocolo', 'encerramentos', 'usuarios']);
  const ids = ['dashboard', 'tarefas', 'automacoes', 'acordos', 'protocolo', 'encerramentos', 'tutelas', 'usuarios', 'configuracoes', 'pagamentos', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao', 'sem-acesso'];
  const active = new Map(ids.map(id => [id, false]));
  const pages = ids.map(id => ({ id, classList: { toggle(_name, value) { active.set(id, value); } } }));
  const location = { pathname: '/', hash: '' };
  function setUrl(path) {
    const u = new URL(path, 'https://local.portilhobackoffice.site' + location.pathname);
    location.pathname = u.pathname; location.hash = u.hash;
  }
  setUrl(initialPath);
  const events = [];
  const listeners = new Map();
  const window = {
    MBA_CURRENT_USER: { id: 'test-user', email: 'test@example.com', permissions: options.permissions || { 'tasks.manage': true }, is_master_admin: false },
    MBA_PORTFOLIO_POLICY: { canAccess: id => allowed.has(id) },
    MBA_LOCAL_PREVIEW: Boolean(options.preview), MBA_REACT_TASKS: true,
    addEventListener(name, callback) { listeners.set(name, callback); },
    dispatchEvent(event) { events.push(event); }, scrollTo() {},
  };
  const document = {
    querySelectorAll(selector) { return selector === '.page' ? pages : []; },
    getElementById(id) { return pages.find(page => page.id === id) || null; },
  };
  const history = {
    pushState(_state, _unused, path) { setUrl(path); },
    replaceState(_state, _unused, path) { setUrl(path); },
  };
  class CustomEvent {
    constructor(type, config) { this.type = type; this.detail = config.detail; }
  }
  vm.runInNewContext(source, { window, location, history, document, CustomEvent });
  return { window, location, active, events, listeners, setUrl };
}

test('URLs antigas da Home e página raiz redirecionam a Tarefas', () => {
  for (const entry of ['/home', '/', '/sem-acesso']) {
    const e = environment(entry);
    assert.equal(e.window.restorePageRoute(), true);
    assert.equal(e.active.get('tarefas'), true);
    assert.equal(e.location.pathname, '/tarefas');
  }
});
test('rota antiga Home cai em Analytics sem permissão para Tarefas', () => {
  const e = environment('/home', { allowed: ['dashboard'] });
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('dashboard'), true);
  assert.equal(e.location.pathname, '/analytics');
});

test('navbar muda a URL ao navegar para automações e analytics', () => {
  const e = environment();
  e.window.showPage('automacoes');
  assert.equal(e.location.pathname, '/automacoes');
  assert.equal(e.active.get('automacoes'), true);
  e.window.showPage('dashboard');
  assert.equal(e.location.pathname, '/analytics');
});
test('links diretos e aliases antigos são restaurados sem recarregar', () => {
  const e = environment('/dashboard');
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.location.pathname, '/analytics');
  e.setUrl('/automacoes');
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('automacoes'), true);
});
test('abas React atualizam a rota e restauram a página pai', () => {
  const e = environment();
  assert.equal(e.window.MBA_NAVIGATE('controladoria/defesas'), true);
  assert.equal(e.location.pathname, '/controladoria/defesas');
  assert.equal(e.active.get('protocolo'), true);
  assert.equal(e.window.MBA_NAVIGATE('tarefas/resultados'), true);
  assert.equal(e.active.get('tarefas'), true);
  assert.equal(e.events.at(-1).detail.route, 'tarefas/resultados');
});
test('links sem permissão mostram sem-acesso, incluindo subrota', () => {
  const e = environment('/automacoes', { allowed: ['dashboard', 'tarefas'] });
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.location.pathname, '/sem-acesso');
  e.setUrl('/analytics/encerramentos');
  e.window.restorePageRoute();
  assert.equal(e.active.get('sem-acesso'), true);
});
test('atribuições exigem permissão gerencial', () => {
  const e = environment('/tarefas', { permissions: { 'tasks.manage': false } });
  assert.equal(e.window.MBA_NAVIGATE('tarefas/atribuicoes'), false);
  assert.equal(e.active.get('sem-acesso'), true);
});
test('prévia local preserva navegação em hash', () => {
  const e = environment('/#/tarefas', { preview: true });
  assert.equal(e.window.restorePageRoute(), true);
  e.window.showPage('automacoes');
  assert.equal(e.location.hash, '#/automacoes');
});
test('login não referencia Home e prioriza Tarefas sem perder deep links', () => {
  const auth = readFileSync(new URL('../auth.js', import.meta.url), 'utf8');
  assert.match(auth, /const routeRestored = window\.restorePageRoute\?\.\(\) === true/);
  assert.match(auth, /else if \(!routeRestored\)/);
  const firstModule = auth.indexOf("['tarefas', 'tasks.view']");
  const secondModule = auth.indexOf("['dashboard', 'dashboard.view']");
  assert.ok(firstModule !== -1 && firstModule < secondModule);
  assert.doesNotMatch(auth, /startOnHome|\['home', null\]/);
});

test('operação mantém subrotas e autorizações de cada módulo', () => {
  const e = environment();
  for (const route of ['operacao/liminar', 'operacao/encerramentos', 'operacao/protocolos', 'operacao/defesas', 'operacao/protocolos/indicadores']) {
    const expected = route.includes('protocolo') || route.includes('defesas') ? 'protocolo' : 'acordos';
    if (route.includes('liminar')) continue; // tutelas is absent in this permission fixture
    assert.equal(e.window.MBA_NAVIGATE(route), true);
    assert.equal(e.active.get(expected), true);
  }
  assert.equal(e.window.MBA_NAVIGATE('operacao/liminar'), false);
});
test('respostas pendentes permitem cancelar navegação e restaurar histórico', () => {
  const e = environment();
  e.window.restorePageRoute();
  e.window.MBA_CONFIRM_TASK_LEAVE = () => false;
  assert.equal(e.window.MBA_NAVIGATE('analytics'), false);
  assert.equal(e.window.showPage('dashboard'), false);
  assert.equal(e.location.pathname, '/tarefas');
  e.setUrl('/analytics');
  e.window.restorePageRoute();
  assert.equal(e.location.pathname, '/tarefas');
  assert.equal(e.active.get('tarefas'), true);
});
