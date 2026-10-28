import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

const file=(path)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const objectId=(path)=>execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();
const mainObjectId=(path)=>execFileSync('git',['rev-parse','origin/main:'+path],{encoding:'utf8'}).trim();

test('video and poster bytes exactly match main',()=>{
 for(const path of ['assets/mascarenhas-login.mp4','assets/mascarenhas-login-poster.jpg'])
  assert.equal(objectId(path),mainObjectId(path),path);
});
test('video has the main size and crop without extra filter',()=>{
 const css=file('src/login/login.css');
 assert.match(css,/#login-view \.react-login-visual \{[^}]*align-self:center;min-width:0;aspect-ratio:7 \/ 5;/s);
 assert.match(css,/#login-view \.react-login-visual video \{[^}]*object-fit:cover;object-position:34% center;/s);
 assert.doesNotMatch(css,/#login-view \.react-login-visual video \{[^}]*filter:/s);
});
test('video cache key and poster match main; no unwanted caption',()=>{
 const source=file('src/login/main.tsx');
 assert.match(source,/mascarenhas-login\.mp4\?v=20261027-3b74ad84/);
 assert.match(source,/mascarenhas-login-poster\.jpg\?v=20261027-3b74ad84/);
 assert.doesNotMatch(source,/react-login-visual-caption/);
 assert.match(source,/Continuar com a Microsoft/);
});
