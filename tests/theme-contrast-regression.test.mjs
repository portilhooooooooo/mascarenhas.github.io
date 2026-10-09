import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [protocols, gestao, operacao, dark] = await Promise.all([
  readFile(new URL('../src/dashboard/protocolos.css', import.meta.url),'utf8'),
  readFile(new URL('../src/dashboard/gestaoMetabase.css', import.meta.url),'utf8'),
  readFile(new URL('../src/dashboard/operacaoMetabase.css', import.meta.url),'utf8'),
  readFile(new URL('../brand-themes.css', import.meta.url),'utf8'),
]);

test('status do backend usa superfície dependente de tema', () => {
  const selector = /\.protocolos-session-bar\s*\{([\s\S]*?)\}/.exec(protocols)?.[1];
  assert.ok(selector, 'status bar must exist');
  assert.match(selector,/background:\s*var\(--mba-surface/);
  assert.match(selector,/color:\s*var\(--mba-text/);
  assert.match(dark,/html\[data-mba-theme="lua"\] \.app-shell \.protocolos-session-bar\s*\{\s*background:#29292c !important/);
  assert.match(dark,/\.protocolos-button\.primary:disabled\s*\{[\s\S]*?opacity:1 !important/);
});

test('Analytics mantém container visível, com texto de erros legível', () => {
  for (const css of [gestao,operacao]) {
    assert.match(css,/background:var\(--mba-surface,#fff\)/);
  }
  assert.match(dark,/\.gestao-metabase-shell/);
  assert.match(dark,/\.gestao-metabase-mount/);
  assert.match(dark,/metabase-dashboard\s*\{[\s\S]*?color-scheme:light/);
  assert.match(dark,/\.gestao-metabase-loading/);
  assert.doesNotMatch(dark,/\.gestao-metabase-mount\s*\{[^}]*display\s*:\s*none/);
});

test('correções atingem apenas Lua e Sol continua disponível', () => {
  assert.match(dark,/html\[data-mba-theme="sol"\]/);
  const index = dark.indexOf('Regression fix: session bars');
  assert.ok(index > 0);
  const fixes = dark.slice(index);
  assert.match(fixes,/html\[data-mba-theme="lua"\]/);
  assert.doesNotMatch(fixes,/html\[data-mba-theme="sol"\]/);
});
