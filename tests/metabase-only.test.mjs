import assert from 'node:assert/strict';
import fs from 'node:fs';

const main = fs.readFileSync('src/dashboard/main.tsx', 'utf8');
const page = fs.readFileSync('src/dashboard/GestaoProcessualPage.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const manifest = fs.readFileSync('scripts/metabase/rebuild_gestao_processual.py', 'utf8');

assert.match(page, /MetabaseGestaoEmbed/);
assert.doesNotMatch(main, /CarteiraProcessualPage|AcordosAnalyticsPage|PagamentosAnalyticsPage/);
assert.equal(pkg.dependencies?.recharts, undefined, 'recharts must not be used for process analytics');

for (const table of ['processos_carteira', 'acordos_carteira', 'pagamentos']) {
  assert.match(manifest, new RegExp(`public\\.${table}`));
}
for (const column of ['situation_benner', 'product', 'date_resolution', 'origem_acordo', 'tempo_pagamento_dias']) {
  assert.match(manifest, new RegExp(column));
}
for (const obsolete of ['data_entrada', 'aging_entrada', 'encerrado IS TRUE', 'materia', 'tema']) {
  assert.doesNotMatch(manifest, new RegExp(obsolete));
}

console.log('metabase-only checks passed');
