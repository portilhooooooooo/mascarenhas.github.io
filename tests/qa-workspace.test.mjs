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
for (const [name, source] of [['Encerramentos', closing], ['Defesas', defense], ['Liminar/Pagamentos', legacy]]) {
  assert.match(source, /progressive draftKey=\{draftKey\}/, name + ' usa Q&A progressivo');
}
assert.match(renderer, /clearQaDraft\(draftKey\)/, 'Limpar cache após resposta da API');
assert.match(legacy, /clearQaDraft\(draftKey\)/, 'Limpar cache de liminar e pagamentos');
assert.match(style, /\.qa-step\[hidden\]/, 'Somente etapa ativa visível');
assert.match(questions, /data-qa-last=\{navigation\.canSubmit/, 'Ações refletem a etapa atual');
assert.match(questions, /!qa\.canSubmit/, 'Salvar fica bloqueado em perguntas intermediárias');
assert.match(style, /form\[data-qa-last='true'\][^\n]*\.closing-summary/, 'Resultado apenas na etapa final');
assert.match(style, /form\[data-qa-index='0'\][^\n]*\.qa-context-note/, 'Indício contextual não ocupa todas as perguntas');
assert.doesNotMatch(renderer, /\|\| task\.title/, 'Título da tarefa não pode ser indício daquele processo');
assert.match(closing, /Resultado das respostas/, 'Resultado distinguido do indício automático');
assert.match(closing, /qa-classifier-difference/, 'Divergência de classificação contextualizada');
console.log('Q&A progressivo: atalhos, cache e gravação explícita verificados.');
