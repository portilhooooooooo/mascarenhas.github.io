import assert from 'node:assert/strict';
import fs from 'node:fs';

const main = fs.readFileSync('src/dashboard/main.tsx', 'utf8');
const gestaoPage = fs.readFileSync('src/dashboard/GestaoProcessualPage.tsx', 'utf8');
const operacaoPage = fs.readFileSync('src/dashboard/OperacaoPage.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const gestaoManifest = fs.readFileSync('scripts/metabase/rebuild_gestao_processual.py', 'utf8');
const operacaoManifest = fs.readFileSync('scripts/metabase/rebuild_operacao.py', 'utf8');
const controladoriaPatch = fs.readFileSync('scripts/metabase/patch_controladoria_indicadores.py', 'utf8');

assert.match(gestaoPage, /MetabaseGestaoEmbed/);
assert.match(operacaoPage, /MetabaseOperacaoEmbed/);
assert.match(main, /OperacaoPage/);
assert.doesNotMatch(main, /ensureOperationSubnav|mba-operation-subnav/);
assert.doesNotMatch(main, /CarteiraProcessualPage|AcordosAnalyticsPage|PagamentosAnalyticsPage/);
assert.equal(pkg.dependencies?.recharts, undefined, 'recharts must not be used for process analytics');

assert.match(gestaoManifest, /public\.processos_carteira/);
assert.doesNotMatch(gestaoManifest, /public\.acordos_carteira|public\.pagamentos/);
for (const column of ['situation_benner', 'product', 'date_resolution']) {
  assert.match(gestaoManifest, new RegExp(column));
}

for (const tab of ['Jobs', 'Pagamentos', 'Timeline', 'DataJud', 'Acordos', 'Liminar']) {
  assert.match(operacaoManifest, new RegExp(`"${tab}"`));
}
for (const table of ['jobs', 'pagamentos', 'task_events', 'protocolo_events', 'datajud_jobs', 'acordos_carteira', 'liminar']) {
  assert.match(operacaoManifest, new RegExp(`public\\.${table}`));
}

assert.match(controladoriaPatch, /ERP_SUBMITTED/);
assert.match(controladoriaPatch, /COUNT\(\*\) \* \(300 - 20\) \/ 60\.0/);
assert.match(controladoriaPatch, /origem_informacao = 'Worker'/);
for (const label of ['Defesas recebidas', 'Análises pendentes', 'Aptos à defesa', 'Inaptos à defesa', 'Prioridades']) {
  assert.match(controladoriaPatch, new RegExp(label));
}
for (const priority of ['Urgente', 'Alta', 'Baixíssima']) {
  assert.match(controladoriaPatch, new RegExp(priority));
}
assert.match(controladoriaPatch, /public\.defesa_analyses/);

for (const obsolete of ['data_entrada', 'aging_entrada', 'encerrado IS TRUE', 'materia', 'tema']) {
  assert.doesNotMatch(gestaoManifest + operacaoManifest, new RegExp(obsolete));
}

console.log('metabase-only checks passed');
