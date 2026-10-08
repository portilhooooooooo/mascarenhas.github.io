import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const app = readFileSync(new URL('../src/tasks/TasksApp.tsx', import.meta.url), 'utf8');
const model = readFileSync(new URL('../src/tasks/model.ts', import.meta.url), 'utf8');

test('administrador mestre carrega todas as tarefas na fila de execução, inclusive no refresh', () => {
  const calls = app.match(/apiRequest\(isMaster \? '\/api\/tasks\?scope=all' : '\/api\/tasks\?scope=mine'\)/g) || [];
  assert.equal(calls.length, 2, 'initial load and polling must both use master access');
  assert.match(app, /const isMaster = Boolean\(user\?\.is_master_admin\)/);
});

test('usuários comuns continuam limitados às próprias atribuições', () => {
  assert.match(app, /isMaster \? '\/api\/tasks\?scope=all' : '\/api\/tasks\?scope=mine'/);
  assert.match(app, /const canViewOtherTasks = isMaster \|\| user\?\.permissions\?\.\['tasks\.view_others'\] === true/);
});

test('processos de terceiros são executáveis por mestre sem alterar o desenho da tela', () => {
  assert.match(model, /if \(user\.is_master_admin \|\| user\.permissions\?\.\['tasks\.manage'\]\) return true/g);
  assert.match(app, /for \(const task of allAssignedTasks\)/);
  assert.match(app, /const rows = await hydrateTask\(task\)/);
  assert.doesNotMatch(app, /TaskOversight|tasks-queue-toggle|Tarefas dos colaboradores|Todas as tarefas/);
});
