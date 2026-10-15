import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const shell = read('src/tasks/TasksApp.tsx');
const questions = read('src/tasks/TaskQuestion.tsx');
const draft = read('src/tasks/qaDraft.ts');
const closing = read('src/tasks/ClosingAnalysisFlow.tsx');
const defense = read('src/tasks/DefenseAnalysisFlow.tsx');
const legacy = read('src/tasks/renderersLegacy.tsx');
const renderer = read('src/tasks/renderers.tsx');
const style = read('src/tasks/qaWorkspace.css');

assert.match(shell, /mba-qa-v1:.*activeItem\.task\.id.*activeItem\.process\.id/, 'Rascunho isolado por tarefa/processo');
assert.match(shell, /<SelectMenu label="Tipo de tarefa" value=\{selectedType\} options=\{typeOptions\}/, 'Filtro de fila seleciona tipo de tarefa');
assert.match(shell, /normalize\(item\.task\.type\) !== selectedType/, 'Filtro aplica tipo nas linhas da fila');
assert.match(shell, /relevantTasks\.map\(task => normalize\(task\.type\)\)/, 'Tipos provêm das tarefas disponíveis na carteira');
assert.doesNotMatch(shell, /selectedDeadline|deadlineOptions|<SelectMenu label="Prazo"/, 'Filtro de prazo foi substituído');
assert.match(read('src/tasks/model.ts'), /encerramento: 'Fluxo de Encerramento'/, 'Encerramentos são apresentados como fluxo');

for (const name of ['ClosingRenderer', 'DefenseRenderer', 'LiminarRenderer', 'PaymentRenderer']) {
  assert.match(shell, new RegExp('<' + name + '.*draftKey=\\{qaDraftKey\\}'), name + ' recebe cache');
}
assert.match(draft, /sessionStorage\.setItem/, 'Rascunho no cache da sessão');
assert.match(draft, /sessionStorage\.removeItem/, 'Cache deve ser limpo após persistência');
assert.match(questions, /event\.key === 'Backspace'/, 'Backspace navega para trás');
assert.match(questions, /event\.key === 'Enter'/, 'Enter avança etapas');
assert.match(questions, /\^\[1-9\]\$/, 'Números selecionam as opções');
assert.match(questions, /event\.preventDefault\(\); \/\/ Nunca envia o formulário implicitamente\./, 'Enter não deve submeter o formulário');
assert.match(questions, /selected\.click\(\)/, 'Atalho usa o onChange das opções');
assert.match(questions, /onChange=\{\(\) => onChange\(option\.value\)\}/, 'Seleção apenas registra a resposta');
assert.doesNotMatch(questions, /advance\?\.\(\)|setAdvanceTicket|advanceTicket/, 'Somente Enter ou Próxima pode mudar a etapa');
for (const [name, source] of [['Encerramentos', closing], ['Defesas', defense], ['Liminar/Pagamentos', legacy]]) {
  assert.match(source, /<TaskForm[^>]*\bprogressive\b/, name + ' usa Q&A progressivo');
  assert.match(source, /<TaskForm[^>]*draftKey=\{draftKey\}/, name + ' recebe chave de rascunho');
}
assert.match(renderer, /clearQaDraft\(draftKey\)/, 'Limpar cache após resposta da API');
assert.match(legacy, /clearQaDraft\(draftKey\)/, 'Limpar cache de liminar e pagamentos');
assert.match(style, /\.qa-step\[hidden\]/, 'Somente etapa ativa visível');
assert.match(questions, /qa-stage-track/, 'Fluxos exibem as etapas');
assert.match(closing, /stages=\{CLOSING_STAGES\}/, 'Encerramento apresenta etapas fixas');
assert.match(closing, /classification_disagreement_reason/, 'Discordância tem justificativa');
assert.match(closing, /closing-disagreement-field/, 'Campo de divergência visível ao selecionar Não');
assert.doesNotMatch(closing, /Indício automático:/, 'Não influenciar a validação humana com indício automático');
assert.match(shell, /<SelectMenu label="UF" searchable/, 'Filtro UF tem pesquisa');
assert.doesNotMatch(read('src/tasks/model.ts'), /const priority = priorityRank/, 'Prioridade não determina ordenação');
assert.match(questions, /data-qa-last=\{navigation\.canSubmit/, 'Ações refletem a etapa atual');
assert.match(questions, /!qa\.canSubmit/, 'Salvar fica bloqueado em perguntas intermediárias');
assert.doesNotMatch(questions, /requestSubmit\(/, 'Enter e Próximo nunca enviam nem concluem a análise');
assert.match(questions, /current < total - 1/, 'Enter avança apenas entre etapas anteriores');
assert.match(questions, /button\?\.type === 'submit' && form\.contains\(button\)/, 'Enter focado em Salvar não conclui a análise');
assert.match(questions, /current < total - 1 \? <button type="button" className="qa-next-button" onClick=\{next\}>Próximo/, 'Próximo visível e clicável antes da última pergunta');
assert.match(questions, /if \(current >= total - 1\) return;/, 'Próximo não conclui análise na última pergunta');
assert.doesNotMatch(closing, /className=\{'closing-outcome closing-summary '/, 'Card de classificação removido');
assert.doesNotMatch(style, /\.closing-summary/, 'Sem CSS de card de classificação');
assert.match(closing, /closing-classification-agreement/, 'Confirmação final Sim/Não');
assert.match(closing, /outcome === 'apto_derrota_voluntaria'/, 'Classificação considera Derrota Voluntária');
assert.match(closing, /'Identificamos que esse processo está apto para encerramento como '/, 'Confirmação final informa classificação');
assert.match(closing, /closingClassification\.toLocaleUpperCase\('pt-BR'\)/, 'Descrição final explicita classificação');
assert.match(closing, /classificationAgreed === 'nao' && validReason/, 'Discordância justificada libera registro de revisão');
assert.match(closing, /setClassificationAgreed\(null\)/, 'Alterar respostas invalida confirmação anterior');
assert.doesNotMatch(closing, /A análise será registrada para revisão/, 'Texto redundante removido; justificativa e revisão continuam no contrato');
assert.match(style, /form\[data-qa-index='0'\][^\n]*\.qa-context-note/, 'Indício contextual não ocupa todas as perguntas');
assert.doesNotMatch(renderer, /\|\| task\.title/, 'Título da tarefa não pode ser indício daquele processo');
// Liminar: a confirmação automática dispensa etapa redundante de conclusão.
const liminar = read('src/tasks/LiminarRenderer.tsx');
assert.match(liminar, /deferida: 'Identificamos que houve pedido de tutela de urgência deferido nos autos\\.'/);
assert.doesNotMatch(liminar, /Classificação final/, 'A confirmação automática não cria segunda etapa');
assert.match(liminar, /stage="Confirmação" question=\\{initialStatement \\|\\| ''\\}/);
assert.match(liminar, /if \\(value === 'sim'\\) void save\\(true\\)/, 'Sim persiste e avança ao próximo processo');
assert.match(liminar, /agreement === 'nao'/, 'Não abre as perguntas manuais');
assert.match(liminar, /savingRef\\.current/, 'Persistência protegida contra envio duplicado');
assert.match(liminar, /body: JSON\\.stringify\\(\\{ agree, answers \\}\\)/, 'Mantém contrato da API de validação');
console.log('Q&A progressivo: atalhos, cache e gravação explícita verificados.');
