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
  assert.match(login, /Faça login abaixo e explore como estamos trabalhando/);
  assert.doesNotMatch(login, /Tarefas, operação e automações em um único lugar/);
});

test('liminar, payments and defense expose conditional stage progress', () => {
  const liminar = read('src/tasks/renderersLegacy.tsx');
  const defense = read('src/tasks/DefenseAnalysisFlow.tsx');
  const closing = read('src/tasks/ClosingAnalysisFlow.tsx');
  const form = read('src/tasks/TaskQuestion.tsx');
  for (const source of [liminar, defense]) {
    assert.match(source, /dynamicStages/, 'flow uses stages matching the current decision branch');
    assert.match(source, /stage="/, 'questions belong to named stages');
  }
  assert.match(form, /displayStages = dynamicStages/, 'stage track skips irrelevant branches');
  assert.match(form, /displayStages\.length/, 'track uses the actual stage count');
  assert.match(closing, /stages=\{CLOSING_STAGES\}/, 'closing preserves five fixed stages');
});
test('payment validation name is presentation-only', () => {
  const model = read('src/tasks/model.ts');
  assert.match(model, /comprovante_pagamento: 'Validação de Pagamento'/);
  assert.match(read('src/tasks/TasksApp.tsx'), /normalize\(activeItem\.task\.type\) === 'comprovante_pagamento'/);
});
test('Results visibility synchronizes with portfolio changes', () => {
  const auth = read('auth.js');
  const results = read('src/dashboard/GestaoProcessualPage.tsx');
  assert.match(auth, /function syncAuthorizedPages\(/);
  assert.match(auth, /mba:portfolio-changed', syncAuthorizedPages/);
  assert.match(auth, /window\.MBA_PORTFOLIO_POLICY\?\.canAccess\(pageId, user\) === true/);
  assert.match(results, /mba:portfolio-changed', sync/);
  assert.match(results, /forcePortfolioPolicySync/);
  assert.match(results, /const displayedTab = activeTab === 'encerramentos' && canViewClosing/);
  assert.doesNotMatch(results, /if \(!canViewClosing && activeTab === 'encerramentos'\) setActiveTab\('geral'\)/);
});
test('protocol requires actual Save activation, not implicit form submit', () => {
  const protocol = read('src/tasks/ProtocolCollectionRenderer.tsx');
  assert.match(protocol, /onSaveIntent=\{\(\) => \{ saveIntent\.current = true/);
  assert.match(protocol, /if \(!saveIntent\.current \|\| submitting\.current \|\| busy\) return/);
  assert.match(protocol, /onKeyDownCapture=/);
  assert.match(protocol, /event\.preventDefault\(\)/);
});
