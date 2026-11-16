import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root),'utf8');

test('the focused landing hero does not draw a copper frame',()=>{
  const css=read('src/login/login.css');
  assert.match(css,/#login-view \.lp-hero:focus-visible\s*\{\s*outline:none;\s*\}/);
  assert.match(css,/#login-view \.lp :focus-visible/,'interactive controls retain visible focus styles');
});

test('process movements omit technical origin, traceability, and TR badge',()=>{
  const page=read('src/dashboard/ProcessosPage.tsx');
  const timeline=page.slice(page.indexOf("events.rows.length ? <ol"),page.indexOf('</ol> :'));
  assert.ok(timeline.length>100,'timeline markup found');
  assert.doesNotMatch(timeline,/Rastreabilidade|e\.source|e\.degree|DataJud/);
  assert.match(timeline,/eventTitle\(e\)/);
  assert.match(page,/Histórico judicial parcialmente disponível/);
});

test('Cadastro omits manual retry while preserving automatic refresh',()=>{
  const base=read('src/dashboard/BaseGeralPage.tsx');
  const cadastro=read('src/dashboard/CadastroCpjCards.tsx');
  const model=read('src/dashboard/ReadModelDashboard.tsx');
  assert.match(base,/!cardsOnly && error && <DashboardRecovery/);
  assert.match(base,/!cardsOnly && billingError &&/);
  assert.match(cadastro,/refetchInterval:active\?REFRESH_MS:false/);
  assert.match(model,/!isCadastro&&summary.error/);
  assert.match(model,/refetchInterval:isCadastro&&visible\?REFRESH_MS:false/);
});
