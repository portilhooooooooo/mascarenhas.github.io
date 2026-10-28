import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const page = fs.readFileSync(new URL('../src/dashboard/BaseGeralPage.tsx', import.meta.url),'utf8');
const tabs = fs.readFileSync(new URL('../src/dashboard/GestaoProcessualPage.tsx', import.meta.url),'utf8');
const styles = fs.readFileSync(new URL('../src/dashboard/baseGeral.css', import.meta.url),'utf8');

test('Base Geral navigation and exact eight compact cards', () => {
  assert.match(tabs, />Base Geral<\/button>/);
  assert.match(tabs, /<BaseGeralPage\b/);
  assert.doesNotMatch(page, /<h1>Base Geral<\/h1>/);
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

test('Base Geral is purely drilldown-driven without CSV or manual refresh controls', () => {
  assert.doesNotMatch(page,/Exportando|CSV completo|base_geral_produtos_|base-geral-csv-action|RefreshCw|Atualizar Base Geral|exportDetails|saveCsv/);
  assert.match(page,/onClick=\{\(\) => openDetail\(key\)\}/);
  assert.match(page,/className="base-geral-kpis base-geral-kpis-status"/);
  assert.match(page,/catalog\.slice\(3\)/);
  assert.match(page,/base-geral-products-table/);
  assert.match(page,/productTotal/);
  assert.match(page,/className="base-geral-products"/);
  assert.match(page,/className="base-geral-product-share"/);
  assert.match(page,/className=\{'base-geral-comparison-track'/);
  assert.match(page,/base-geral-comparison/);
  assert.match(styles,/\.base-geral-kpis-status\{grid-template-columns:repeat\(5/);
  assert.match(styles,/\.base-geral-bottom \{\s*display:flex;\s*flex-direction:column;/);
});

test('18-calendar-month operational aging rule is preserved and closing stays separate', () => {
  assert.match(page,/operationalAgingCutoff/);
  assert.match(page,/month - 1 - 18/);
  assert.match(page,/anniversary\.setUTCDate\(anniversary\.getUTCDate\(\) - 1\)/);
  assert.match(page,/getClosingCases\('APTOS', 10/);
  assert.match(page,/getClosingCases\('APTOS', 25/);
  assert.match(page,/permissions\?\.\['encerramentos\.view'\]/);
});

test('Regular billing reads its own secured endpoint and never multiplies the entire portfolio', () => {
  assert.match(page, /type RegularBilling = \{/);
  assert.match(page, /\/api\/base-geral\/faturamento/);
  assert.match(page, /const estimatedRevenue = currentBilling\?\.total_amount \?\? null/);
  assert.doesNotMatch(page, /total \* REGULAR_CASE_FEE/);
  assert.match(page, /portfolio === 'agibank_mba' && canViewBilling && <button/);
  assert.match(page, /billingSequence.current/);
  assert.match(page, /refreshBilling\(true\)/);
  assert.match(page, /currentBilling\?\.source_send_month/);
  assert.match(page, /currentBilling\?\.advanced_installments/);
  assert.match(page, /não representa valores faturados ou recebidos/);
  assert.match(styles, /base-geral-kpis-with-billing\{grid-template-columns:repeat\(4/);
});

test('only backend-issued permission makes billing visible and fetchable', () => {
  assert.match(page,/permissions\?\.\['faturamento\.view'\] === true/);
  assert.match(page,/if \(!visibleRef\.current \|\| portfolio !== 'agibank_mba' \|\| !canViewBilling\) return/);
  assert.match(page,/currentBilling = canViewBilling && billingKey/);
  assert.match(page,/revenueOpen && portfolio === 'agibank_mba' && canViewBilling/);
  assert.doesNotMatch(page,/Acesso restrito|acesso restrito/);
});
