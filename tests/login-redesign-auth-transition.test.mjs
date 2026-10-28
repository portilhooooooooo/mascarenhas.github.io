import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const login = read('src/login/main.tsx');
const css = read('src/login/login.css');
const auth = read('auth.js');
const html = read('index.html');

test('minimal corporate form and original institutional video', () => {
  assert.match(login, /Explore como estamos trabalhando/);
  assert.match(login, /Continuar com a Microsoft/);
  assert.match(login, />Continuar<\/button>/);
  assert.match(login, /Digite seu e-mail corporativo/);
  assert.match(login, /type="email"[^>]*required/);
  assert.match(login, /onSubmit=\{submitEmail\}/);
  assert.match(login, /void startMicrosoftLogin\(\)/);
  assert.match(login, /<video autoPlay muted playsInline loop preload="auto"/);
  assert.match(login, /<source src="\/assets\/mascarenhas-login\.mp4\?v=20261027-3b74ad84"/);
  assert.doesNotMatch(login, /greetingFor|Boa noite|Faça login abaixo|Autenticador|TOTP|Google/);
  assert.match(css, /#login-view \.react-login-primary \{[\s\S]*?background:#b97a58;border-color:#b97a58;color:#fff/);
  assert.match(css, /body\[data-react-login="true"\] \.login-screen \{[^}]*background:#161617/);
});

test('real auth lifecycle drives full viewport loading screen', () => {
  assert.match(html, /id="login-transition-root"/);
  assert.match(login, /createPortal\(<AuthTransition visible=\{preparing\}/);
  assert.match(login, /<DataField active=\{visible\}\/>/);
  assert.match(login, /Preparando seu espaço\./);
  assert.match(login, /prefers-reduced-motion: reduce/);
  assert.match(login, /requestAnimationFrame\(tick\)/);
  assert.match(login, /cancelAnimationFrame\(frame\)/);
  assert.match(login, /document\.hidden/);
  assert.match(css, /position:fixed;inset:0;z-index:25000/);
  assert.match(css, /body\.mba-auth-transition-hold \.app-shell \{visibility:hidden!important/);
  assert.match(auth, /if \(code\) document\.body\.classList\.add\('mba-auth-transition-hold'\)/);
  assert.match(auth, /await loadProfileWithRetry\(deadline, maxAttempts, retryBudget\);\s*if \(code\) \{[\s\S]*?setTimeout\(resolve, 5000\)/);
  assert.match(auth, /finally \{\s*document\.body\.classList\.remove\('mba-auth-transition-hold'\)/);
  assert.doesNotMatch(auth, /setTimeout\(resolve, 5000\)[\s\S]*await loadProfileWithRetry/,
    'Do not delay the OAuth token exchange or backend validation');
});
