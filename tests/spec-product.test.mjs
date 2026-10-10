import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('A/B/C labels do not change the answer keyboard contract', () => {
  const question = read('src/tasks/TaskQuestion.tsx');
  assert.match(question, /questionLabel\(stepIndex\)/);
  assert.match(question, /String\.fromCharCode\(65/);
  assert.match(question, /<kbd className="qa-option-key"/);
  assert.match(question, /selected\.click\(\)/);
  assert.match(question, /if \(event\.key === 'Enter'\)/);
});
test('workspace still has left queue and right answers', () => {
  const shell = read('src/tasks/TasksApp.tsx');
  const index = shell.indexOf('<section className="tasks-workspace">');
  assert.ok(index >= 0);
  assert.ok(shell.indexOf('<aside className="tasks-workspace-sidebar"', index) < shell.indexOf('<main className="tasks-execution-panel"', index));
  assert.match(read('src/tasks/tasks.css'), /\.tasks-workspace\{[^}]*grid-template-columns:310px minmax\(0,1fr\)/);
});
test('assignments operate per task_process with server-side enforcement', () => {
  const app = read('src/tasks/TasksApp.tsx'), board = read('src/tasks/AssignmentsBoard.tsx');
  assert.match(app, /<AssignmentsBoard tasks=\{allVisibleTasks\}/);
  assert.doesNotMatch(app, /tab === 'management' && manager \? <section className="tasks-management-view"/);
  assert.match(board, /\/api\/task-processes\//);
  assert.match(board, /assignee_id: recipient/);
  assert.match(board, /canAssign/);
  assert.match(board, /Promise\.allSettled/);
  assert.doesNotMatch(board, /\/api\/tasks\/' \+ row\.task\.id.*PATCH/);
});
test('login text is contextual, fixed caption matches spec', () => {
  const login = read('src/login/main.tsx');
  assert.match(login, /greetingFor\(date: Date\)/);
  assert.match(login, /date\.getDay\(\)/);
  assert.match(login, /date\.getHours\(\)/);
  assert.match(login, /Explore como estamos trabalhando!/);
  assert.doesNotMatch(login, /Tarefas, operação e automações em um único lugar/);
});
