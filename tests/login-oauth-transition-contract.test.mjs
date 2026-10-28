import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const read=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const auth=read('auth.js'),login=read('src/login/main.tsx'),html=read('index.html'),css=read('src/login/login.css');
test('only a real OAuth callback has five-second visual hold; normal F5 never does',()=>{
 assert.match(html,/id="login-transition-root"/);
 assert.match(login,/createPortal\(<AuthTransition visible=\{preparing\}/);
 assert.match(login,/prefers-reduced-motion: reduce/);
 assert.match(login,/cancelAnimationFrame\(frame\)/);
 assert.match(css,/position:fixed;inset:0;z-index:25000/);
 assert.match(auth,/if \(code\) document\.body\.classList\.add\('mba-auth-transition-hold'\)/);
 assert.match(auth,/await loadProfileWithRetry\(deadline, maxAttempts, retryBudget\);\s*if \(code\) \{[\s\S]*?setTimeout\(resolve, 5000\)/);
 assert.match(auth,/finally \{\s*document\.body\.classList\.remove\('mba-auth-transition-hold'\)/);
 assert.doesNotMatch(auth,/setTimeout\(resolve, 5000\)[\s\S]*await loadProfileWithRetry/);
});
