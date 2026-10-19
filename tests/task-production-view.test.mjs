import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('src/tasks/TaskResults.tsx', root), 'utf8');
const shell = readFileSync(new URL('src/tasks/TasksApp.tsx', root), 'utf8');

assert.match(shell, /navigateTaskTab\('tarefas\/resultados'\)}>Produção<\/button>/,
  'A rota de Resultados continua funcionando, mas a aba agora descreve produção.');
for (const label of ['Produção no período', 'Fila atual', 'Entregas por tipo de tarefa', 'Entregas por colaborador']) {
  assert.ok(component.includes(label), 'A visão operacional precisa conter: ' + label);
}
assert.match(component, /duration: 'all'/,
  'Não excluir colaboradores com análises não cronometradas.');
assert.match(component, /Concluídas hoje.*Hoje, dentro dos filtros de conclusão/s,
  'Conclusões de hoje precisam explicitar o escopo do filtro.');
assert.match(component, /não corresponde ao período de conclusão acima/,
  'A fila atual não deve ser apresentada como métrica do período.');
assert.doesNotMatch(component, /motivoFilter|Tempo para avançar de etapa|sortBy === 'step'/,
  'Motivo derrota e ranking de velocidade não devem ser tratados como produtividade.');
console.log('Painel de produção: escopos e separação de métricas verificados.');
