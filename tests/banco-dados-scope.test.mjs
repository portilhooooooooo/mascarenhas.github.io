import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const policySrc = read('portfolio-policy.js');
function policyFor(portfolioId, enabledModules = undefined) {
  const user = { permissions: { 'dashboard.view': true }, portfolios: [
    { id: portfolioId, ...(enabledModules && { enabled_modules: enabledModules }) },
  ] };
  const w = { MBA_CURRENT_USER: user, MBA_API: { getPortfolioId: () => portfolioId } };
  vm.runInNewContext(policySrc, { window: w });
  return w.MBA_PORTFOLIO_POLICY;
}
for (const id of ['agibank_enter', 'nubank_mba', 'banco_pan_mba', 'energisa_enter']) {
  assert.equal(policyFor(id).canAccess('banco-dados'), false, 'other portfolio must never see database: ' + id);
}
assert.equal(policyFor('agibank_mba').canAccess('banco-dados'), true);
assert.equal(policyFor('agibank_mba', ['dashboard']).canAccess('banco-dados'), true);
assert.equal(policyFor('agibank_mba', ['tasks']).canAccess('banco-dados'), false);
assert.match(read('app.js'), /'banco-dados': 'banco-dados'/);
assert.match(read('index.html'), /data-page="banco-dados"/);
assert.match(read('src/dashboard/main.tsx'), /configureBancoDadosLifecycle\(\)/);
assert.match(read('src/dashboard/BancoDadosPage.tsx'), /\/api\/banco-dados\/metabase\/embed/);
console.log('PASS: Banco de Dados is restricted to Agibank MBA and has a dedicated route');
