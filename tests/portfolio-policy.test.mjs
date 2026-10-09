import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const policySource = readFileSync(new URL('../portfolio-policy.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../src/dashboard/main.tsx', import.meta.url), 'utf8');
const users = readFileSync(new URL('../src/dashboard/UsersPage.tsx', import.meta.url), 'utf8');
const taskPage = readFileSync(new URL('../src/tasks/TasksApp.tsx', import.meta.url), 'utf8');

const allPermissions = {
  'dashboard.view': true, 'tasks.view': true, 'pagamentos.view': true,
  'automations.view': true, 'users.view': true, 'settings.view': true,
  'encerramentos.view': true, 'tutelas.view': true,
};
const portfolios = [
  { id: 'agibank_enter', client_name: 'Agibank', operator_name: 'Enter' },
  { id: 'agibank_mba', client_name: 'Agibank', operator_name: 'MBA' },
  { id: 'energisa_enter', client_name: 'Energisa', operator_name: 'Enter' },
  { id: 'banco_pan_mba', client_name: 'Banco Pan', operator_name: 'MBA' },
];
function createPolicy(id, overrides = {}) {
  const user = { id: 'u1', email: 'test@example.com', portfolios, permissions: allPermissions, ...overrides };
  const window = { MBA_CURRENT_USER: user, MBA_API: { getPortfolioId: () => id } };
  vm.runInNewContext(policySource, { window });
  return window.MBA_PORTFOLIO_POLICY;
}
assert.equal(createPolicy('not-allowed').canAccess('home'), true, 'Home accessible to authenticated profiles even without active portfolio');
assert.equal(createPolicy('agibank_mba', { id: null }).canAccess('home'), false, 'Home denies invalid profiles');
assert.match(html, /data-page="home"/, 'Home must appear in navigation');
assert.match(html, /class="page active home-page" id="home"/, 'Home is the initial section');
for (const id of ['agibank_mba', 'banco_pan_mba']) {
  const policy = createPolicy(id);
  assert.equal(policy.canAccess('dashboard'), true);
  assert.equal(policy.canAccess('automacoes'), id === 'agibank_mba', id + ' automation scope must follow Agibank Mascarenhas authorization');
  assert.equal(policy.canAccess('protocolo'), false, id + ' must not see Controladoria');
  assert.equal(policy.canAccess('tarefas'), true);
}
for (const id of ['agibank_enter', 'energisa_enter']) {
  const policy = createPolicy(id);
  assert.equal(policy.canAccess('automacoes'), true);
  assert.equal(policy.canAccess('protocolo'), true);
}
assert.equal(createPolicy('agibank_enter', { permissions: { ...allPermissions, 'automations.view': false } }).canAccess('automacoes'), false, 'individual user denial must take precedence');
assert.equal(createPolicy('agibank_mba', { permissions: { ...allPermissions, 'automations.view': false } }).canAccess('automacoes'), false, 'Agibank MBA automation still requires user permission');
assert.equal(createPolicy('not-allowed').canAccess('automacoes'), false, 'unknown portfolio must fail closed');
assert.equal(createPolicy('not-allowed').canAccess('dashboard'), false, 'unknown portfolio must not expose shared modules');
const metadata = portfolios.map(item => item.id === 'agibank_enter' ? { ...item, enabled_modules: ['analytics', 'tasks'] } : item);
const explicit = createPolicy('agibank_enter', { portfolios: metadata });
assert.equal(explicit.canAccess('automacoes'), false, 'declared backend capability denies undeclared module');
assert.equal(explicit.canAccess('dashboard'), true, 'analytics alias must be recognized');
assert.equal(explicit.canAccess('tarefas'), true, 'task alias must be recognized');

assert.doesNotMatch(html, /nav-badge">23<\/em>/, 'task badge must not be hardcoded');
assert.match(html, /id="tasks-nav-count"[^>]*hidden/, 'task badge must start empty');
assert.match(html, /portfolio-policy\.js/, 'portfolio policy must be loaded for classic navigation');
assert.match(shell, /dashboard: 'Analytics'/, 'Analytics must be the module name');
assert.match(shell, /const eligible = page === 'home'/, 'Home must remain visible to authenticated users regardless of portfolio module permissions');
assert.match(shell, /data-page="home"/, "Home must be present in React navigation order");
assert.match(shell, /mayOpen\('protocolo'\)/, 'Controladoria lifecycle must enforce the portfolio');
assert.match(shell, /<PortfolioSwitcher\s*\/>/, 'portfolio selector must be React');
assert.match(html, /id="portfolio-switcher"/, 'sidebar must mount a portfolio selector');
assert.match(html, /<div class="sidebar-bottom">\s*<div id="portfolio-switcher"[^>]*><\/div>\s*<button class="sidebar-logout"/, 'compact selector must sit immediately above Sair');
assert.match(taskPage, /<SelectMenu label="Prazo"/, 'task filters must be React listboxes');
assert.match(users, /Visibilidade dos módulos/, 'user permissions must have module view');
console.log('PASS: portfolio access, module visibility, selectors, and task badge regression checks');
