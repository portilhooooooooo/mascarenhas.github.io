import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../src/dashboard/BaseGeralPage.tsx', import.meta.url), 'utf8');
const tabs = fs.readFileSync(new URL('../src/dashboard/GestaoProcessualPage.tsx', import.meta.url), 'utf8');
const styles = fs.readFileSync(new URL('../src/dashboard/baseGeral.css', import.meta.url), 'utf8');

test('Entradas is renamed Base Geral on the analytics tab and page', () => {
  assert.match(tabs, />Base Geral<\/button>/);
  assert.match(tabs, /<BaseGeralPage\/>/);
  assert.match(page, /<h1>Base Geral<\/h1>/);
});

test('eight clickable metrics are configured in requested order', () => {
  const order = ['Base ativa', 'Base prescrita', 'Em encerramento', 'Suspensos',
    'Improcedentes', 'Extintos', 'Procedências', 'Com tutela deferida'];
  const entries = [...page.matchAll(/key: '([^']+)', label: '([^']+)', subtitle:/g)];
  assert.deepEqual(entries.map(match => match[2]), order);
  assert.match(page, /catalog\.map\(/);
  assert.match(page, /onClick=\{\(\) => openDetail\(key\)\}/);
});

test('Product and Prejuízo X Lucro sections are interactive and based on real data', () => {
  assert.match(page, /<h2>Produto<\/h2>/);
  assert.match(page, /<h2>Prejuízo X Lucro<\/h2>/);
  assert.match(page, /shown\?\.charts\.por_produto/);
  assert.match(page, /setProduct\(item\.label\)/);
  assert.match(page, /onClick=\{\(\) => openDetail\('prescribed'\)\}/);
  assert.match(page, /donutReady/);
  assert.match(page, /Comparativo aguardando indicador de prescrição da API/);
});

test('frontend does not fabricate metrics without API support', () => {
  assert.match(page, /prescribed: validNumber\(summary\?\.prescribed\)/);
  assert.match(page, /closing: validNumber\(summary\?\.closing_in_progress\)/);
  assert.match(page, /suspended: validNumber\(summary\?\.suspended\)/);
  assert.match(page, /não oferece um filtro verificável/);
  assert.match(page, /period === 'all' && !product && !situation && !resolution/);
  assert.match(page, /Promise\.allSettled/);
});

test('drilldown is scoped and uses supported filters only', () => {
  assert.match(page, /MBA_NAVIGATE\?\.\('processos\/' \+ encodeURIComponent\(row\.cnj\)\)/);
  assert.match(page, /params\.set\('movement', detailMovement\)/);
  assert.match(page, /params\.set\('situation', 'Em andamento'\)/);
  assert.match(page, /params\.set\('uf', uf\)/);
  assert.match(page, /aria-modal="true"/);
  assert.match(styles, /\.base-geral-kpis/);
  assert.match(styles, /@media\(max-width:580px\)/);
});
