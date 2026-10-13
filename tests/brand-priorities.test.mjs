import test from 'node:test';
import assert from 'node:assert/strict';
import { priorityLevel, compareWorkItems, PRIORITY_LABELS } from '../src/tasks/model.ts';

const makeItem = (priority, processPriority = null) => ({
  task: { id: `task-${priority}`, type: 'encerramento', priority, status: 'pending' },
  process: { id: `p-${priority}`, case_number: `500-${priority}`, status: 'pending', priority: processPriority },
});

test('há exatamente três classes funcionais de prioridade', () => {
  assert.equal(priorityLevel(makeItem('high')), 'high');
  assert.equal(priorityLevel(makeItem('medium')), 'medium');
  assert.equal(priorityLevel(makeItem('low')), 'low');
  assert.equal(priorityLevel(makeItem('normal')), 'medium');
  assert.equal(priorityLevel(makeItem('urgent')), 'high');
  assert.equal(priorityLevel(makeItem('altissima')), 'high');
  assert.equal(priorityLevel(makeItem(undefined)), 'medium');
});

test('prioridade explícita do processo prevalece sobre a do lote', () => {
  assert.equal(priorityLevel(makeItem('low', 'high')), 'high');
  assert.equal(priorityLevel(makeItem('high', 'low')), 'low');
});

test('ordenação da fila é alta, média e baixa', () => {
  const sorted = [makeItem('low'), makeItem('high'), makeItem('medium')].sort(compareWorkItems);
  assert.deepEqual(sorted.map(priorityLevel), ['high', 'medium', 'low']);
});

test('rótulos legados não criam uma quarta prioridade visual', () => {
  for (const label of Object.values(PRIORITY_LABELS)) {
    assert.ok(['Alta', 'Média', 'Baixa'].includes(label), `Rótulo inesperado: ${label}`);
  }
});
