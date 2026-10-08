import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/tasks/TasksApp.tsx', import.meta.url), 'utf8');
const oversight = readFileSync(new URL('../src/tasks/TaskOversight.tsx', import.meta.url), 'utf8');

test('visualização de terceiros depende da permissão concedida pelo backend', () => {
  assert.match(app, /const canViewOtherTasks = isMaster \|\| user\?\.permissions\?\.\['tasks\.view_others'\] === true/);
  assert.match(app, /canViewOtherTasks \? apiRequest\('\/api\/tasks\?scope=all'\) : Promise\.resolve\(null\)/);
  assert.match(app, /taskScope === 'all' && canViewOtherTasks \? <TaskOversight/);
});

test('filas de execução e supervisão usam conjuntos separados', () => {
  assert.match(app, /apiRequest\('\/api\/tasks\?scope=mine'\)/);
  assert.match(app, /<TaskOversight tasks=\{allVisibleTasks\}/);
  assert.match(app, /const workItems = useMemo\(\(\) => \{/);
  assert.match(app, /for \(const task of allAssignedTasks\)/);
  assert.match(app, /setTaskScope\('mine'\);\s+setSelectedType\(normalize\(task\.type\)\)/);
});

test('supervisão consulta processos mas não chama ações de escrita', () => {
  assert.match(oversight, /api\(\`\/api\/tasks\/\$\{encodeURIComponent\(selectedTask\.id\)\}\/processes\`\)/);
  assert.match(oversight, /process\.assignee_id \|\| ''\) !== assignee/);
  assert.match(oversight, /tasks-oversight-readonly/);
  assert.doesNotMatch(oversight, /method:\s*['"](?:POST|PATCH|PUT|DELETE)['"]/);
  assert.doesNotMatch(oversight, /ClosingRenderer|DefenseRenderer|PaymentRenderer|LiminarRenderer/);
});

test('aba atribuições abre o lote em modo de consulta', () => {
  assert.match(app, /setOversightTaskId\(task\.id\); setTaskScope\('all'\); navigateTaskTab\('tarefas'\)/);
});
