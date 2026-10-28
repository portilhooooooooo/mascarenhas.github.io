import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/tasks/closingEvidence.ts', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../src/tasks/renderers.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  reportDiagnostics: true,
});
const exports = {};
new Function('exports', compiled.outputText)(exports);
const find = exports.closingClassifierEvidence;

const realCase = {
  classifier_classification: 'Vitória',
  regular_triage_group: 'IMPROCEDENCIA_SEM_TRANSITO',
  datajud_victory_review: {
    evidencias: [{
      data: '2024-08-14T15:35:00.000Z',
      texto: 'Improcedência',
      camada: 'datajud_movimento',
      codigo: '220',
      motivo: 'SENTENCA_IMPROCEDENCIA',
    }],
    observacao: 'Captura DataJud limitada; consultar os autos para comprovar situacao recursal e aptidao',
    definitividade: { tipo: 'NAO_IDENTIFICADA', confirmada: false },
  },
};
test('processo 5011929-91.2023.4.04.7112 passa a ter fundamento preliminar', () => {
  const evidence = find(realCase);
  assert.equal(evidence,
    'Movimentação DataJud de 14/08/2024: Improcedência (trânsito em julgado não confirmado)');
  assert.match(renderer, /closingClassifierEvidence\(process\.source_metadata, process\.reason_label\)/);
  assert.match(renderer, /classifierReason=\{closingClassifierReason\(process\)\}/);
});
test('sem movimento documentado não inventa evidência nem pergunta preliminar', () => {
  assert.equal(find({ classifier_classification: 'Vitória', closing_classification_label: 'Revisão pendente — Vitória sem definitividade comprovada',
    datajud_victory_review:{ evidencias: [], observacao:'Consultar os autos' } }), null);
  assert.equal(find({ classifier_classification: 'Derrota' }), null);
});
test('registro com texto vazio ou somente motivo/código não é prova', () => {
  assert.equal(find({datajud_victory_review:{evidencias:[{texto:'  ',codigo:'220',motivo:'IMPROCEDENCIA'}]}}), null);
});
test('prioriza a razão explícita e mantém compatibilidade com fonte operacional', () => {
  assert.equal(find({review_reason:'  Sentença de improcedência comprovada  '}, 'motivo genérico'),
    'Sentença de improcedência comprovada');
  assert.equal(find({}, 'Registro documental conferido'), 'Registro documental conferido');
});
test('normaliza textos e preserva evidência sem data confiável', () => {
  assert.equal(find({datajud_victory_review:{evidencias:[{data:'data inválida',texto:'Extinção  sem mérito'}]}}),
    'Movimentação DataJud: Extinção sem mérito');
});
test('não expõe textos ilimitados', () => {
  assert.equal(find({datajud_victory_review:{evidencias:[{texto:'A'.repeat(600)}]}}).length,280);
});
