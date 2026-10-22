import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../src/dashboard/BaseGeralPage.tsx', import.meta.url),'utf8');
const tabs = fs.readFileSync(new URL('../src/dashboard/GestaoProcessualPage.tsx', import.meta.url),'utf8');
const styles = fs.readFileSync(new URL('../src/dashboard/baseGeral.css', import.meta.url),'utf8');

test('Base Geral navigation and exact eight compact cards', () => {
  assert.match(tabs, />Base Geral<\/button>/);
  assert.match(tabs, /<BaseGeralPage\/>/);
  assert.match(page, /<h1>Base Geral<\/h1>/);
  const order = ['Base ativa','Base prescrita','Em encerramento','Suspensos',
    'Improcedentes','Extintos','Procedências','Com tutela deferida'];
  assert.deepEqual([...page.matchAll(/key: '([^']+)', label: '([^']+)', subtitle:/g)].map(x=>x[2]),order);
  assert.match(page,/onClick=\{\(\) => openDetail\(key\)\}/);
  assert.match(styles,/\.base-geral-card\{width:100%;min-height:98px/);
  assert.match(styles,/\.base-geral-dialog\{width:min\(960px,100%\)/);
  assert.match(page,/className="base-geral-dialog"/);
  assert.doesNotMatch(page,/base-geral-drawer/);
});

test('unified process directory API serves the summary, products and category drilldown', () => {
  assert.match(page,/\/api\/base-geral\/summary/);
  assert.match(page,/\/api\/base-geral\/processos/);
  assert.doesNotMatch(page,/\/api\/carteira-processual/);
  assert.match(page,/const categories: Partial<Record<Category, number \| null>>/);
  assert.match(page,/active: validNumber\(summary\?\.active\)/);
  assert.match(page,/prescribed: validNumber\(summary\?\.prescribed\)/);
  assert.match(page,/suspended: validNumber\(summary\?\.suspended\)/);
  assert.match(page,/shown\?\.charts\.por_produto/);
  assert.match(page,/params\.set\('category', detailCategory/);
  assert.match(page,/const listSupported = Boolean\(detail\)/);
});

test('filters for period, product, UF, situation and resolution propagate to drilldown and export', () => {
  assert.match(page,/params\.set\('entry_start', dateStart\(period\)\)/);
  assert.match(page,/params\.set\('uf', uf\)/);
  assert.match(page,/params\.set\('product', product\)/);
  assert.match(page,/params\.set\('situation', situation\)/);
  assert.match(page,/params\.set\('resolution', resolution\)/);
  assert.match(page,/new URLSearchParams\(filterQuery\)/);
  assert.match(page,/params\.set\('q', detailSearch\.replace/);
});

test('tutela popup toggles Deferidas and Indeferidas with independent counts', () => {
  assert.match(page,/tutelaOutcome === 'deferidas' \? 'injunction_deferida' : 'injunction_indeferida'/);
  assert.match(page,/aria-pressed=\{tutelaOutcome === outcome\}/);
  assert.match(page,/'Deferidas' : 'Indeferidas'/);
  assert.match(page,/setTutelaOutcome\(outcome\); setDetailPage\(1\)/);
  assert.match(page,/injunction_denied/);
});

test('CSV exports the whole available filtered relation and rejects partial exports', () => {
  assert.match(page,/Promise\.all\(indexes\.map/);
  assert.match(page,/all\.length !== total/);
  assert.match(page,/total > 10000/);
  assert.match(page,/serializeBaseGeralCsv/);
  assert.match(page,/CSV completo/);
  assert.match(page,/base_geral_produtos_/);
  assert.match(page,/\['CNJ', 'Situação', 'UF', 'Pasta', 'Classificação', 'Data entrada', 'Produto', 'Encerramento'\]/);
});

test('18-calendar-month operational aging rule is preserved and closing stays separate', () => {
  assert.match(page,/operationalAgingCutoff/);
  assert.match(page,/month - 1 - 18/);
  assert.match(page,/anniversary\.setUTCDate\(anniversary\.getUTCDate\(\) - 1\)/);
  assert.match(page,/getClosingCases\('APTOS', 10/);
  assert.match(page,/getClosingCases\('APTOS', 25/);
  assert.match(page,/permissions\?\.\['encerramentos\.view'\]/);
});
