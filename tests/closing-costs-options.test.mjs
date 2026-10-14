import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flow = readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx', import.meta.url), 'utf8');

// Cost statuses must remain distinct, including their saved payloads.
assert.match(flow, /type CostsAnswer = 'sim' \| 'nao' \| 'sem_pendencia' \| null/);
assert.match(flow, /question="Custas foram pagas\?"/);
for (const [value, label] of [
  ['sim', 'Sim'], ['nao', 'Não'], ['sem_pendencia', 'Não há custas pendentes'],
]) {
  assert.ok(flow.includes(`{ value: '${value}', label: '${label}' }`), label);
}
assert.match(flow, /final_costs_paid: boolean \| 'sem_pendencia' \| null/);
assert.match(flow, /costsPaid === 'sem_pendencia' \? 'sem_pendencia'/);
assert.match(flow, /costsPaid === 'sem_pendencia' \? 'NÃO HÁ CUSTAS FINAIS PENDENTES'/);

// The execution question must be visible for each answered cost status.
assert.match(flow, /costsPaid !== null \?\s*<TaskQuestion[^>]+question="Houve pedido de execução\?"/);
assert.doesNotMatch(flow, /costsPaid === 'sim' \?\s*<TaskQuestion[^>]+question="Houve pedido de execução\?"/);
assert.match(flow, /costsPaid !== null && executionRequested === 'sim' \?/);
assert.match(flow, /outcome = fullPayment === 'sim' \? 'apto_derrota' : 'inapto_execucao_pendente'/);
assert.match(flow, /outcome = transitTooRecent\s+\? 'inapto_aguardando_transito_60d'\s+: 'apto_derrota_voluntaria'/);
assert.match(flow, /costsPaid !== null && executionRequested === 'nao' \?/);
assert.doesNotMatch(flow, /'apto_pending_custas'/, 'Custas não substituem classificação de mérito');
console.log('Custas finais: opções Sim/Não/Sem pendências; execução independente e estado persistido.');
