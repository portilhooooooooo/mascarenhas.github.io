import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const css = fs.readFileSync(new URL('../src/login/login.css', import.meta.url), 'utf8');
const login = fs.readFileSync(new URL('../src/login/main.tsx', import.meta.url), 'utf8');

test('login restores the dark Lua presentation independent of saved workspace theme', () => {
  assert.match(css, /body\[data-react-login="true"\] \.login-screen \{[^}]*background:#161617;/);
  assert.match(css, /#login-view \.react-login-view \{[\s\S]*?background:#161617;[\s\S]*?color:#f6f0ec;/);
  assert.match(css, /border:1px solid #373436;border-radius:22px;background:#171719;/);
  assert.match(css, /outline:0;background:#202022;color:#fff8f3/);
  assert.match(css, /background:#b97a58;border-color:#b97a58;color:#fff/);
});

test('institutional video and HTML5 playback remain unchanged', () => {
  assert.match(login, /<video autoPlay muted playsInline loop preload="auto"/);
  assert.match(login, /<source src="\/assets\/mascarenhas-login.mp4\?v=20261027-3b74ad84" type="video\/mp4"\/>/);
  assert.match(login, /poster="\/assets\/mascarenhas-login-poster.jpg\?v=20261027-3b74ad84"/);
  assert.match(css, /object-fit:cover;object-position:34% center;z-index:0/);
});
