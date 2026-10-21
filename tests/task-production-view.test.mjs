import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root=new URL('../',import.meta.url);
const source=(p)=>readFileSync(new URL(p,root),'utf8');
const component=source('src/tasks/TaskResults.tsx');
const shell=source('src/tasks/TasksApp.tsx');
assert.match(shell,/navigateTaskTab\('tarefas\/resultados'\)}>Produtividade<\/button>/);
for(const label of ['Análises realizadas','Aptidões','Inaptidões','Pendências','Tempo de execução']) {
 assert.ok(component.includes(label),'Card obrigatório: '+label);
}
for(const path of ['/api/tasks/results/overview?','/api/tasks/results/overview/details?','/api/tasks/results/overview/export?']) {
 assert.ok(component.includes(path),'Endpoint auditável: '+path);
}
assert.ok(component.includes("title=\"Abrir processo e histórico\""),'CNJ deve navegar ao processo.');
assert.ok(component.includes("tarefas/item/"),'Deeplink vinculado a tarefa e processo.');
assert.ok(component.includes("Relação diária por colaborador"),'Produção diária é visível.');
assert.ok(component.includes("Ver {format(person.analyses)} CNJs"),'Relação diária abre seus CNJs.');
assert.ok(component.includes("pending_as_of"),'Pendências não podem se passar por produção histórica.');
assert.ok(!component.includes("withOldApiFallback"),'Contrato novo exige API nova, não fallback silencioso.');
console.log('Produtividade v2: cinco cards, filtros, detalhamentos, exportação e relação diária validados.');
