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
  assert.match(source, /progressive draftKey=\{draftKey\}/, name + ' usa Q&A progressivo');
}
assert.match(renderer, /clearQaDraft\(draftKey\)/, 'Limpar cache após resposta da API');
assert.match(legacy, /clearQaDraft\(draftKey\)/, 'Limpar cache de liminar e pagamentos');
assert.match(style, /\.qa-step\[hidden\]/, 'Somente etapa ativa visível');
assert.match(questions, /data-qa-last=\{navigation\.canSubmit/, 'Ações refletem a etapa atual');
assert.match(questions, /!qa\.canSubmit/, 'Salvar fica bloqueado em perguntas intermediárias');
assert.match(questions, /form\.requestSubmit\(save\)/, 'Enter salva explicitamente na última pergunta');
assert.match(questions, /current < total - 1/, 'Enter avança apenas entre etapas anteriores');
assert.match(questions, /save\) form\.requestSubmit\(save\)/, 'Sem botão válido não há envio');
assert.doesNotMatch(closing, /className=\{'closing-outcome closing-summary '/, 'Card de classificação removido');
assert.doesNotMatch(style, /\.closing-summary/, 'Sem CSS de card de classificação');
assert.match(closing, /closing-classification-agreement/, 'Confirmação final Sim/Não');
assert.match(closing, /pode ser encerrado como Derrota Voluntária\. Você concorda/, 'Texto da Derrota Voluntária');
assert.match(closing, /ready=\{Boolean\(outcome && classificationAgreed === 'sim'\)\}/, 'Apenas Sim habilita o salvamento');
assert.match(closing, /setClassificationAgreed\(null\)/, 'Alterar respostas invalida confirmação anterior');
assert.match(closing, /classificação antes de salvar/, 'Não mantém rascunho para revisão');
assert.match(style, /form\[data-qa-index='0'\][^\n]*\.qa-context-note/, 'Indício contextual não ocupa todas as perguntas');
assert.doesNotMatch(renderer, /\|\| task\.title/, 'Título da tarefa não pode ser indício daquele processo');
console.log('Q&A progressivo: atalhos, cache e gravação explícita verificados.');
