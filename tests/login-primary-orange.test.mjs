import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const main=readFileSync(new URL('../src/login/main.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/login/login.css',import.meta.url),'utf8');
test('corporate email form retains its submit action and says Continuar',()=>{
 assert.match(main,/className="react-login-primary" type="submit"[\s\S]*?disabled=\{authState.busy\}>Continuar<\/button>/);
 assert.doesNotMatch(main,/>Continuar com e-mail<\/button>/);
 assert.match(main,/onSubmit=\{submitEmail\}/);
});
test('primary action matches institutional copper from main; white text and copper hover',()=>{
 assert.match(css,/#login-view \.react-login-primary\{\s*margin:0;background:#b97a58;color:#fff;border:1px solid #b97a58;font-weight:600;/);
 assert.match(css,/#login-view \.react-login-primary:hover:not\(:disabled\)\{\s*background:#c38b69;border-color:#c38b69;/);
 assert.doesNotMatch(css,/#login-view \.react-login-primary\{[^}]*background:#f1f1f1/);
});
