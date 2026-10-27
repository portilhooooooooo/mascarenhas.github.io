import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const css = fs.readFileSync(new URL('../src/login/login.css', import.meta.url),'utf8');
const login = fs.readFileSync(new URL('../src/login/main.tsx', import.meta.url),'utf8');
const system = fs.readFileSync(new URL('../design-system-v2.css', import.meta.url),'utf8');

test('login uses Sol surfaces regardless of the saved Lua workspace preference', () => {
  assert.match(system, /html\[data-mba-theme="sol"\]/);
  assert.match(css, /body\[data-react-login="true"\] \.login-screen \{[^}]*background:#F4F5F3;[^}]*color-scheme:light;/);
  assert.match(css, /#login-view \.react-login-view \{[\s\S]*?background:#F4F5F3;[\s\S]*?color:#242826;[\s\S]*?color-scheme:light;/);
  assert.match(css, /border:1px solid #E7E9E6;border-radius:22px;background:#FFFFFF;/);
  assert.match(css, /background:#F9FAF8;color:#242826/);
  assert.match(css, /--login-accent:#B95A32/);
  assert.match(css, /filter:brightness\(0\)/);
});

test('retains same institutional video in semantic HTML with accessible fallback', () => {
  assert.match(login, /<video autoPlay muted playsInline loop preload="auto"/);
  assert.match(login, /<source src="\/assets\/mascarenhas-login.mp4" type="video\/mp4"\/>/);
  assert.match(login, /poster="\/assets\/mascarenhas-login-poster.jpg"/);
  assert.match(css, /object-fit:cover;z-index:0/);
  assert.match(css, /rgba\(16,16,17,.82\)/);
});
