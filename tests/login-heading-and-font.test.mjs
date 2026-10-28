import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const css=readFileSync(new URL('../src/login/login.css',import.meta.url),'utf8');
const src=readFileSync(new URL('../src/login/main.tsx',import.meta.url),'utf8');
test('login primary uses same Inter 12.5px 500 typography as Microsoft SSO',()=>{
 assert.match(css,/#login-view \.react-login-corporate,#login-view \.react-login-primary \{\s*height:44px;border-radius:9px;font-size:12.5px/);
 assert.match(css,/#login-view \.react-login-primary\{[^}]*font-family:Inter,system-ui,sans-serif;font-size:12.5px;font-weight:500;/);
 assert.match(css,/#login-view \.react-login-primary\{[^}]*line-height:1;letter-spacing:normal;/);
 assert.match(src,/>Continuar<\/button>/);
});
test('larger editorial heading stays centered and scales on mobile',()=>{
 assert.match(css,/font:400 clamp\(36px,3vw,46px\)\/1\.13 Georgia/);
 assert.match(css,/letter-spacing:-\.042em; text-align:center; text-wrap:balance;/);
 assert.match(css,/#login-view \.react-login-access h1 \{ font-size:34px; margin-bottom:24px; \}/);
});
