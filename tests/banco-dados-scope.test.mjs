import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const policySrc = read('portfolio-policy.js');
function policyFor(portfolioId) {
  const user = { permissions: { 'dashboard.view': true }, portfolios: [{ id: portfolioId }] };
  const w = { MBA_CURRENT_USER: user, MBA_API: { getPortfolioId: () => portfolioId } };
  vm.runInNewContext(policySrc, { window: w });
  return w.MBA_PORTFOLIO_POLICY;
}
for (const id of ['agibank_enter', 'agibank_mba', 'nubank_mba', 'banco_pan_mba', 'energisa_enter']) {
  assert.equal(policyFor(id).canAccess('banco-dados'), false, 'legacy module must remain inaccessible: ' + id);
}
assert.doesNotMatch(read('app.js'), /'banco-dados': 'banco-dados'/);
assert.doesNotMatch(read('index.html'), /data-page="banco-dados"|id="banco-dados"/);
assert.doesNotMatch(read('src/dashboard/main.tsx'), /BancoDadosPage|configureBancoDadosLifecycle|bancoDadosRoot|bancoDados\.css/);
assert.equal(existsSync(new URL('src/dashboard/BancoDadosPage.tsx', root)), false);
assert.equal(existsSync(new URL('src/dashboard/bancoDados.css', root)), false);
console.log('PASS: retired Banco de Dados module is absent from navigation and routes');
