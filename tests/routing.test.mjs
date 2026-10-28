import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8').split('const appShell =')[0];

function environment(initialPath = '/tarefas', options = {}) {
  const allowed = new Set(options.allowed || ['dashboard', 'ranking', 'tarefas', 'automacoes', 'acordos', 'protocolo', 'encerramentos', 'usuarios']);
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
    MBA_CURRENT_USER: { permissions: options.permissions || { 'tasks.manage': true }, is_master_admin: false },
    MBA_PORTFOLIO_POLICY: { canAccess: id => allowed.has(id) },
    MBA_LOCAL_PREVIEW: Boolean(options.preview), MBA_REACT_TASKS: true,
    addEventListener(name, callback) { listeners.set(name, callback); },
    dispatchEvent(event) { events.push(event); }, scrollTo() {},
  };
  const document = {
    querySelector(selector) { return selector === 'main .page.active' ? pages.find(page=>active.get(page.id)) || null : null; },
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
  vm.runInNewContext(source, { window, location, history, document, CustomEvent, performance, requestAnimationFrame:callback=>callback() });
  return { window, location, active, events, listeners, allowed, setUrl };
}

test('navbar muda a URL ao navegar para automações e analytics', () => {
  const e = environment();
  e.window.showPage('automacoes');
  assert.equal(e.location.pathname, '/automacoes');
  assert.equal(e.active.get('automacoes'), true);
  e.window.showPage('dashboard');
  assert.equal(e.location.pathname, '/analytics');
});
test('aba de produção preserva a rota legada e exige autorização da carteira', () => {
  const enabled = environment('/analytics/ranking');
  assert.equal(enabled.window.restorePageRoute(), true);
  assert.equal(enabled.active.get('dashboard'), true);
  assert.equal(enabled.location.pathname, '/analytics/ranking');
  assert.equal(enabled.window.MBA_NAVIGATE('ranking'), true);
  assert.equal(enabled.location.pathname, '/analytics/ranking');
  const denied = environment('/analytics/ranking', { allowed: ['dashboard'] });
  assert.equal(denied.window.restorePageRoute(), true);
  assert.equal(denied.active.get('sem-acesso'), true);
  assert.equal(denied.location.pathname, '/analytics/ranking');
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
test('links sem permissão não apagam deep links e se recuperam após autorização', () => {
  const e = environment('/automacoes', { allowed: ['dashboard', 'tarefas'] });
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.location.pathname, '/automacoes');
  assert.equal(e.active.get('sem-acesso'), true);
  e.allowed.add('automacoes');
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('automacoes'), true);
  e.setUrl('/analytics/encerramentos');
  e.allowed.delete('encerramentos');
  e.window.restorePageRoute();
  assert.equal(e.active.get('sem-acesso'), true);
  assert.equal(e.location.pathname, '/analytics/encerramentos');
  e.allowed.add('encerramentos');
  e.window.restorePageRoute();
  assert.equal(e.active.get('dashboard'), true);
  assert.equal(e.location.pathname, '/analytics/encerramentos');
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
test('autenticação prioriza rota compartilhada', () => {
  const auth = readFileSync(new URL('../auth.js', import.meta.url), 'utf8');
  assert.match(auth, /const routeRestored = window\.restorePageRoute\?\.\(\) === true/);
  assert.match(auth, /else if \(!routeRestored\)/);
});


test('links de Operação abrem cada submódulo e restauram histórico', () => {
  const e = environment('/operacao/pagamentos', {
    allowed: ['acordos', 'pagamentos', 'tutelas', 'encerramentos', 'protocolo'],
  });
  const modules = ['pagamentos', 'liminar', 'encerramentos', 'protocolos', 'defesas'];
  for (const module of modules) {
    assert.equal(e.window.MBA_NAVIGATE('operacao/' + module), true, module);
    assert.equal(e.active.get('acordos'), true, module);
    assert.equal(e.location.pathname, '/operacao/' + module, module);
    assert.equal(e.window.restorePageRoute(), true, module);
    assert.equal(e.location.pathname, '/operacao/' + module, module);
  }
  e.window.showPage('dashboard');
  e.window.showPage('acordos');
  assert.equal(e.location.pathname, '/operacao/defesas', 'Operação retoma a última aba autorizada');
});

test('links legados de Operação são canônicos, preservando Controladoria', () => {
  const e = environment('/pagamentos', {
    allowed: ['acordos', 'pagamentos', 'tutelas', 'encerramentos', 'protocolo'],
  });
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.location.pathname, '/operacao/pagamentos');
  assert.equal(e.window.MBA_NAVIGATE('operacao/tutelas'), true);
  assert.equal(e.location.pathname, '/operacao/liminar');
  assert.equal(e.window.MBA_NAVIGATE('controladoria/defesas'), true);
  assert.equal(e.location.pathname, '/controladoria/defesas');
  assert.equal(e.active.get('protocolo'), true);
});

test('Operação sem Pagamentos abre o primeiro módulo autorizado', () => {
  const e = environment('/tarefas', { allowed: ['acordos', 'tutelas', 'tarefas'] });
  e.window.showPage('acordos');
  assert.equal(e.location.pathname, '/operacao/liminar');
  assert.equal(e.window.MBA_NAVIGATE('operacao/pagamentos'), false);
  assert.equal(e.active.get('sem-acesso'), true);
});

test('deep links sem permissão não mostram módulos indevidos', () => {
  const e = environment('/operacao/defesas', { allowed: ['acordos', 'pagamentos'] });
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('sem-acesso'), true);
  assert.equal(e.location.pathname, '/operacao/defesas');
  e.allowed.add('protocolo');
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('acordos'), true);
  assert.equal(e.location.pathname, '/operacao/defesas');
  const preview = environment('/#/operacao/liminar', {
    preview: true, allowed: ['acordos', 'tutelas'],
  });
  assert.equal(preview.window.restorePageRoute(), true);
  assert.equal(preview.location.hash, '#/operacao/liminar');
});
test('subabas de Operação sincronizam a rota em vez de alterar apenas o estado local', () => {
  const source = readFileSync(new URL('../src/dashboard/OperacaoPage.tsx', import.meta.url), 'utf8');
  for (const module of ['pagamentos', 'liminar', 'encerramentos', 'protocolos', 'defesas']) {
    assert.match(source, new RegExp("navigateOperationModule\\('"+module+"'\\)"));
  }
  assert.match(source, /mba:route-changed/);
  assert.match(source, /operationModuleFromLocation/);
});

test('Resultados / Pagamentos exige administração e permissão financeira', () => {
  const e = environment('/analytics/pagamentos', {allowed:['dashboard'],permissions:{'pagamentos.view':true}});
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('sem-acesso'), true);
  e.window.MBA_CURRENT_USER.is_master_admin = true;
  assert.equal(e.window.restorePageRoute(), true);
  assert.equal(e.active.get('dashboard'), true);
  assert.equal(e.location.pathname, '/analytics/pagamentos');
  e.window.MBA_CURRENT_USER.permissions['pagamentos.view'] = false;
  assert.equal(e.window.MBA_NAVIGATE('analytics/pagamentos'), false);
  assert.equal(e.active.get('sem-acesso'), true);
});
