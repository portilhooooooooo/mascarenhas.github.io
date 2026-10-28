import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const login=read('src/login/main.tsx'),css=read('src/login/login.css');
assert.match(login,/<h1 id="react-login-title">Explore como estamos trabalhando<\/h1>/);
assert.doesNotMatch(login,/Boa noite|Boa tarde|Bom dia|react-login-subtitle/);
assert.match(login,/Continuar via Microsoft/);
assert.match(login,/onClick=\{\(\) => void startMicrosoftLogin\(\)\}/);
assert.match(login,/<div className="react-login-divider" aria-hidden="true">ou<\/div>/);
assert.doesNotMatch(login,/Transformando ideias em produção\./);
assert.doesNotMatch(login,/MASCARENHAS BARBOSA · DESDE 1968/);
assert.match(login,/<source src="\/assets\/mascarenhas-login.mp4\?v=20261027-3b74ad84"/);
assert.match(css,/object-fit:cover;object-position:34% center/);
assert.doesNotMatch(css,/react-login-visual-caption/);

assert.match(css,/font:400 clamp\(37px,3\.35vw,61px\)\/1\.08 Georgia/);
console.log('Login: original video and title font, balanced centered caption, Microsoft button and divider.');
