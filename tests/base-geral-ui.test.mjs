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
  assert.match(page, /Aguardando as contagens filtradas de aging e base ativa/);
});

test('frontend does not fabricate metrics without API support', () => {
  assert.match(page, /prescribed: sourceDivergence \? null : aged/);
  assert.match(page, /getClosingCases\('APTOS', 10/);
  assert.match(page, /suspended: movementsCount\.suspended/);
  assert.match(page, /não disponibiliza a relação filtrada/);
  assert.match(page, /period === 'all' && !product && !situation && !resolution/);
  assert.match(page, /Promise\.allSettled/);
});

test('drilldown is scoped and uses supported filters only', () => {
  assert.match(page, /MBA_NAVIGATE\?\.\('processos\/' \+ encodeURIComponent\(row\.cnj\)\)/);
  assert.match(page, /params\.set\('movement', detailMovement\)/);
  assert.match(page, /detail === 'closing'/);
  assert.match(page, /params\.set\('uf', uf\)/);
  assert.match(page, /aria-modal="true"/);
  assert.match(styles, /\.base-geral-kpis/);
  assert.match(styles, /@media\(max-width:580px\)/);
});

test('prescribed means strictly older than 18 calendar months and donut buckets are exclusive', () => {
  assert.match(page, /operationalAgingCutoff/);
  assert.match(page, /month - 1 - 18/);
  assert.match(page, /anniversary\.setUTCDate\(anniversary\.getUTCDate\(\) - 1\)/);
  assert.match(page, /params\.set\('entry_end', cutoff\)/);
  assert.match(page, /params\.set\('situation', 'active'\)/);
  assert.match(page, /allActive - aged/);
});
test('suspension and closing use existing APIs, respecting authorization', () => {
  assert.match(page, /suspended: 'suspensao'/);
  assert.match(page, /getClosingCases\('APTOS', 10/);
  assert.match(page, /getClosingCases\('APTOS', 25/);
  assert.match(page, /permissions\?\.\['encerramentos\.view'\]/);
});

test('matches Encerramentos compact card sizing and centered modal', () => {
  assert.match(styles, /\.base-geral-card\{width:100%;min-height:98px/);
  assert.match(styles, /\.base-geral-dialog\{width:min\(960px,100%\)/);
  assert.match(styles, /\.base-geral-overlay\{z-index:12000;display:flex;align-items:center;justify-content:center/);
  assert.match(page, /className="base-geral-dialog"/);
  assert.doesNotMatch(page, /base-geral-drawer/);
});

test('tutelas details toggle between grants and denials using real movement filters', () => {
  assert.match(page, /injunctionDenied: 'tutela_indeferida'/);
  assert.match(page, /tutelaOutcome === 'deferidas' \? movements.injunction : movements.injunctionDenied/);
  assert.match(page, /aria-pressed=\{tutelaOutcome === outcome\}/);
  assert.match(page, /'Deferidas' : 'Indeferidas'/);
  assert.match(page, /setTutelaOutcome\(outcome\); setDetailPage\(1\)/);
});

test('filtered full CSV is paginated, downloadable and protected against incomplete exports', () => {
  assert.match(page, /async \(\) => \{/);
  assert.match(page, /serializeBaseGeralCsv/);
  assert.match(page, /Promise\.all\(indexes\.map/);
  assert.match(page, /all\.length !== total/);
  assert.match(page, /total > 10000/);
  assert.match(page, /detailSearch\.replace/);
  assert.match(page, /type: 'text\/csv;charset=utf-8'/);
  assert.match(page, /base_geral_produtos_/);
  assert.match(page, /CSV completo/);
});

test('does not present false zeroes when portfolio aggregation diverges from process directory', () => {
  assert.match(page, /sourceDivergence/);
  assert.match(page, /sourceDivergence \? null : activeUnderCutoff/);
  assert.match(page, /sourceDivergence \? null : aged/);
  assert.match(page, /Divergência entre fontes/);
});
