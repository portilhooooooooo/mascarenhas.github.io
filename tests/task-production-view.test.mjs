import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('src/tasks/TaskResults.tsx', root), 'utf8');
const css = readFileSync(new URL('src/tasks/taskResults.css', root), 'utf8');
const shell = readFileSync(new URL('src/tasks/TasksApp.tsx', root), 'utf8');

assert.match(shell, /navigateTaskTab\('tarefas\/resultados'\)}>Produtividade<\/button>/);
for(const label of ['Pendentes','Concluídos','Tempo médio','Tarefas concluídas','Produtividade por colaborador']){
  assert.ok(component.includes(label),'Falta o elemento '+label);
}
assert.match(component,/type="date" aria-label="Data inicial"/);
assert.match(component,/type="date" aria-label="Data final"/);
assert.match(component,/setActiveCard\(kind\)/);
assert.match(component,/api\('\/api\/tasks\/results\/details\?'/);
assert.match(component,/canViewOthers \? <SelectFilter title="Colaborador"/);
assert.match(component,/aria-label="Colaborador fixo" value="self" disabled/);
assert.match(component,/person:canViewOthers\?filters.person:\(userId \|\| 'all'\)/);
assert.match(component,/include_pending:'1'/);
assert.match(component,/layoutVersion:3/);
assert.doesNotMatch(component,/RefreshCw|Sobre as medições|Tempo de conclusão por tipo de tarefa/);
assert.match(css,/task-results-stat-clickable/);
console.log('Produtividade: calendário, cards, detalhamento e perfil testados.');
