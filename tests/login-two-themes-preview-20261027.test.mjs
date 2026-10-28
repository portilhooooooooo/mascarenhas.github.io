import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const jsx=read('src/login/main.tsx');
const css=read('src/login/login.css');
const theme=read('brand-theme.js');
assert.doesNotMatch(jsx,/react-login-visual-caption|Transformando ideias em produção/);
assert.doesNotMatch(jsx,/MASCARENHAS BARBOSA · DESDE 1968/);
assert.match(css,/width:min\(465px,100%\);align-self:center;justify-self:center/);
assert.match(css,/#login-view \.react-login-access h1\{width:100%;max-width:100%;margin-inline:0;text-align:center\}/);
assert.doesNotMatch(css,/react-login-visual-caption/);

assert.match(css,/html\[data-mba-theme="sol"\] body\[data-react-login="true"\] #login-view \.react-login-view/);
assert.match(css,/html\[data-mba-theme="sol"\] body\[data-react-login="true"\] #login-view \.react-login-form/);
assert.match(theme,/mba-backoffice-theme-v1/);
