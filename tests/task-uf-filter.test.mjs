import test from 'node:test';
import assert from 'node:assert/strict';
import { getProcessUf } from '../src/tasks/processUf.ts';
test('explicit valid state takes precedence', () => {
  assert.equal(getProcessUf({case_number:'5007488-72.2024.8.21.0048',uf:'MS'}),'MS');
  assert.equal(getProcessUf({case_number:'5007488-72.2024.8.21.0048',sigla_uf:' sp '}),'SP');
});
test('infer UF only for state courts', () => {
  assert.equal(getProcessUf({case_number:'5007488-72.2024.8.21.0048'}),'RS');
  assert.equal(getProcessUf({case_number:'0000000-00.2024.8.12.0001'}),'MS');
  assert.equal(getProcessUf({case_number:'0000000-00.2024.8.26.0001'}),'SP');
});
test('unknown and non-state courts remain unknown', () => {
  assert.equal(getProcessUf({case_number:'0000000-00.2024.4.03.6100'}),null);
  assert.equal(getProcessUf({case_number:'0000000-00.2024.5.24.0001'}),null);
  assert.equal(getProcessUf({case_number:null,state:'pending'}),null);
});
