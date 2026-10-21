import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const component = readFileSync(new URL('src/tasks/TaskResults.tsx', root), 'utf8');
const shell = readFileSync(new URL('src/tasks/TasksApp.tsx', root), 'utf8');

assert.match(shell, /navigateTaskTab\('tarefas\/resultados'\)}>Produtividade<\/button>/,
  'A rota legada permanece, mas a aba descreve produtividade.');
for (const label of ['Produtividade por colaborador', 'Tempo de conclusão por tipo de tarefa', 'Cobertura de tempo']) {
  assert.ok(component.includes(label), 'A visão operacional precisa conter: ' + label);
}
assert.match(component, /withOldApiFallback/, 'A API antiga deve continuar funcionando até o deploy.');
assert.match(component, /include_growth: '0'/, 'Evitar consultar histórico que a tela não apresenta.');
assert.match(component, /include_pending: '0'/,
  'Deve dispensar consulta onerosa de pendências.');
assert.match(component, /duration: 'all'/,
  'Não excluir colaboradores com análises não cronometradas.');
assert.match(component, /Concluídas hoje.*Hoje, dentro do filtro escolhido/s,
  'Conclusões de hoje precisam explicitar o escopo do filtro.');
assert.doesNotMatch(component, /Fila atual|Análises pendentes|Fotografia das atribuições abertas/,
  'A fila atual deve desaparecer completamente da aba.');
assert.doesNotMatch(component, /motivoFilter|Tempo para avançar de etapa|sortBy === 'step'|Tipos concluídos/,
  'Motivo derrota e ranking de velocidade não devem ser tratados como produtividade.');
console.log('Painel de produtividade: escopos e separação de métricas verificados.');
