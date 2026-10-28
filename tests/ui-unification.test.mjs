import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const root=new URL('../',import.meta.url);
const file=(path)=>readFileSync(new URL('src/'+path,root),'utf8');
const css=file('dashboard/ui-foundations.css');
const base=file('dashboard/BaseGeralPage.tsx');
const closing=file('dashboard/EncerramentosPage.tsx');
const tasks=file('tasks/TaskResults.tsx');
const assigns=file('tasks/AssignmentsBoard.tsx');
const station=file('tasks/taskStation.css');
const shell=file('tasks/TasksApp.tsx');
test('shared metric dimensions, typography, controls and focus states',()=>{
 for(const token of ['--mba-ui-card-height: 100px','--mba-ui-label-size: 12px','--mba-ui-value-size: 26px','--mba-ui-field-height: 36px'])
  assert.ok(css.includes(token),token);
 assert.match(css,/button\.mba-metric-card:focus-visible/);
 assert.match(file('dashboard/main.tsx'),/import '\.\/ui-foundations\.css';/);
 for(const component of [base,closing,tasks,assigns])
  assert.ok(component.includes('mba-metric-card'),'Card not standardized');
});
test('short labels, preserved legal methodology',()=>{
 assert.doesNotMatch(base,/base-geral-card-bottom/);
 assert.match(base,/title=\{subtitle\}/);
 assert.match(base,/Critérios do indicador/);
 assert.match(base,/não confirmação de prescrição jurídica/);
 assert.doesNotMatch(assigns,/Tarefas abertas<\/small>|Prazos do dia<\/small>|Exigem atenção<\/small>/);
 assert.match(closing,/Consolidado mensal · independe dos filtros acima/);
});
test('cards perform meaningful navigation and scope is intact',()=>{
 assert.match(base,/onClick=\{\(\) => openDetail\(key\)\}/);
 assert.match(closing,/onClick=\{\(\)=>onOpen\(card\.key\)\}/);
 assert.match(tasks,/onClick=\{onOpen\}/);
 assert.match(assigns,/onClick=\{\(\) => \{ setStatus\('unassigned'\)/);
 assert.match(shell,/user\?\.role === "legal_leader" && canViewOtherTasks/);
 assert.match(tasks,/aria-label="Colaborador fixo" value="self" disabled/);
});
test('task scale is native; viewport math no longer applies 0.9 multiplier',()=>{
 assert.match(station,/\.tasks-react-root \{ zoom: 1; \}/);
 assert.doesNotMatch(shell,/getBoundingClientRect\(\)\.top - bottom\) \/ 0\.9/);
});
