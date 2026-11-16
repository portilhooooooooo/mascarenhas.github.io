// T-202611161345-7a1a — Read Model cards (Cadastro/Andamentos): absent values render a quiet
// dash with no "sem dados" tag, and no technical provenance is rendered or exposed on hover.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=name=>readFileSync(new URL('../src/dashboard/'+name,import.meta.url),'utf8');
const strip=source=>source.replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');
const metric=strip(read('metricState.tsx'));
const cadastro=strip(read('CadastroCpjCards.tsx'));
const dialog=strip(read('MetricCasesDialog.tsx'));
const readModel=strip(read('ReadModelDashboard.tsx'));
const andamentos=strip(read('AndamentosCardsPage.tsx'));

// (4) No "Sem dados" copy in the Read Model card surfaces.
for(const [name,source] of Object.entries({metric,cadastro,dialog,readModel,andamentos}))
  assert.doesNotMatch(source,/sem dados/i,name+' must not render "sem dados"');
assert.match(metric,/loading:null,certified:null,absent:null/,'absent has no visible tag');
assert.match(metric,/hasValue\?formatCount\(state\.value\):'—'/,'absent/error/forbidden keep the dash, never a number');
// Internal distinction is preserved: every state keeps its kind, and failures keep their own tag.
for(const kind of ['absent','unauthenticated','forbidden','error','certified','uncertified','loading'])
  assert.ok(metric.includes("kind:'"+kind+"'")||metric.includes("'"+kind+"'"),'state kind '+kind+' preserved');
assert.match(metric,/forbidden:\{label:'sem acesso'/);
assert.match(metric,/error:\{label:'erro'/);
assert.match(metric,/data-state=\{state\.kind\}/);
assert.match(cadastro,/productState\.kind==='unauthenticated'\|\|productState\.kind==='forbidden'\|\|productState\.kind==='error'/,
  'products panel tags only real failures');

// (5) No hover tooltip on RM cards/panels; accessible name carries no source/endpoint/message.
assert.doesNotMatch(metric,/\btitle=/,'MetricCard has no title tooltip');
assert.doesNotMatch(cadastro,/\btitle=/,'Cadastro products panel has no title tooltip');
assert.doesNotMatch(readModel,/<section[^>]*\btitle=/,'Read Model section has no title tooltip');
const aria=metric.slice(metric.indexOf('export function metricAriaLabel'),metric.indexOf('export function MetricCard'));
assert.ok(aria.length>0);
assert.doesNotMatch(aria,/source|message|reasons|\/api\//,'aria-label never includes provenance, backend message or reasons');
assert.match(metric,/aria-label=\{name\+' — abrir relação de processos'\}/);

// Dialog: provenance stays in the CaseSource object but is never rendered.
assert.match(dialog,/source:'Fonte: \/api\/resultados\/cadastro\/processos/,'provenance kept internally');
assert.doesNotMatch(dialog,/\{source\.source\}/,'dialog does not render the source string');
assert.doesNotMatch(dialog,/base-geral-dialog-source/);
// Keyboard: Escape closes, dismiss and pagination remain real buttons.
assert.match(dialog,/event\.key==='Escape'/);
assert.match(dialog,/aria-label="Fechar relação"/);
assert.match(metric,/<button type="button" className="base-geral-card mba-metric-card"/);
console.log('rm-absent-values-and-provenance: ok');
