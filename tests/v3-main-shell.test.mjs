import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(path,'utf8');
const results = read('src/dashboard/GestaoProcessualPage.tsx');
const nav = results.split('const resultsTabs = ')[1]?.split('</nav>')[0];
assert.ok(nav,'Results subnavigation exists');
const labels = [...nav.matchAll(/\}>([^<>]+)<\/button>/g)].map(x=>x[1]);
assert.deepEqual(labels,['Cadastro','Andamentos','Encerramentos','Pagamentos','Defesas','Protocolos'],
 'V3 route integration must preserve the current main/Dev Tasks Results navigation');
assert.match(results,/<BaseGeralPage\b/,'Main Base Geral presentation remains');
assert.match(results,/<PagamentosResultadosPage\b/,'Main Payments presentation remains');
assert.match(results,/<EncerramentosPage\b/,'Main Closings presentation remains');
for(const module of ['faturamento']){
 assert.match(results,new RegExp("readSource\\('"+module+"'\\)"),module+' remains selectable only by explicit V3 deep link');
 assert.doesNotMatch(nav,new RegExp('>'+module+'<','i'),module+' must not be added as main navigation tab');
}
const operation = read('src/dashboard/AutomacoesWorkspace.tsx');
assert.match(operation, /<AutomationKanban/);
assert.match(operation, /<AutomationForm/);
console.log('PASS: V3 routes preserve main Results/Operation presentation and keep extra reader routes opt-in.');
