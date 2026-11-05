import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(path,'utf8');
const results = read('src/dashboard/GestaoProcessualPage.tsx');
const nav = results.split('const resultsTabs = ')[1]?.split('</nav>')[0];
assert.ok(nav,'Results subnavigation exists');
const labels = [...nav.matchAll(/\}>([^<>]+)<\/button>/g)].map(x=>x[1]);
assert.deepEqual(labels,['Base Geral','Encerramentos','Pagamentos','Defesas','Protocolos'],
 'V3 route integration must preserve the current main/Dev Tasks Results navigation');
assert.match(results,/<BaseGeralPage\b/,'Main Base Geral presentation remains');
assert.match(results,/<PagamentosResultadosPage\b/,'Main Payments presentation remains');
assert.match(results,/<EncerramentosPage\b/,'Main Closings presentation remains');
for(const module of ['cadastro','andamentos','faturamento']){
 assert.match(results,new RegExp("readSource\\('"+module+"'\\)"),module+' remains selectable only by explicit V3 deep link');
 assert.doesNotMatch(nav,new RegExp('>'+module+'<','i'),module+' must not be added as main navigation tab');
}
const operation = read('src/dashboard/OperacaoPage.tsx');
for(const component of ['PagamentosPage','OperacaoLiminarPage','OperacaoEncerramentosPage']){
 assert.match(operation,new RegExp('<'+component+'\\b'),component+' remains in the legacy operational surface');
}
console.log('PASS: V3 routes preserve main Results/Operation presentation and keep extra reader routes opt-in.');
