import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const login = read('src/login/main.tsx');
const css = read('src/login/login.css');
const build = read('build-static.mjs');
const sourceMark = read('favicon.svg');
const whiteMark = read('favicon-white.svg');
const originalPng = sourceMark.match(/href="(data:image\/png;base64,[^"]+)"/)?.[1];

assert.ok(originalPng, 'O símbolo institucional original precisa existir.');
assert.ok(whiteMark.includes(originalPng), 'O favicon branco deve reutilizar exatamente a arte original.');
assert.match(whiteMark, /<feColorMatrix[^>]*values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/);
assert.match(login, /src="\/favicon-white.svg\?/);
assert.doesNotMatch(login, /react-login-visual-fallback|MBA_BRAND_MEDIA/);

assert.match(login, /<video autoPlay muted playsInline loop preload="auto"/);
assert.match(login, /<source src="\/assets\/mascarenhas-login.mp4\?v=20261027-3b74ad84" type="video\/mp4"\/>/);
assert.match(login, /poster="\/assets\/mascarenhas-login-poster.jpg\?v=20261027-3b74ad84"/);
assert.match(css, /aspect-ratio:16 \/ 9;object-fit:cover/);
assert.match(css, /react-login-visual-caption[\s\S]*position:relative;display:grid/);
assert.doesNotMatch(css, /react-login-visual::before/);
assert.doesNotMatch(css, /react-login-visual:after/);
assert.doesNotMatch(css, /react-login-visual video \{[^}]*object-fit:contain/s);
assert.doesNotMatch(css, /filter:contrast\(1\.08\) saturate\(\.88\) brightness\(\.79\)/);
assert.match(build, /await cp\('assets\/mascarenhas-login.mp4',/);
assert.match(build, /await cp\('assets\/mascarenhas-login-poster.jpg',/);
assert.doesNotMatch(build, /let hasBrandVideo|MBA_BRAND_MEDIA/);

console.log('Login: vídeo institucional obrigatório, favicon branco original e camadas visíveis.');
