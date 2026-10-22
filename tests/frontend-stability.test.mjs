import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const auth = read('auth.js');
const main = read('src/dashboard/main.tsx');
const index = read('index.html');
const qa = read('src/tasks/TaskQuestion.tsx');
const qaStyle = read('src/tasks/qaWorkspace.css');
const assignments = read('src/tasks/AssignmentsBoard.tsx');
const closePage = read('src/dashboard/OperacaoEncerramentosPage.tsx');
const closeApi = read('src/dashboard/operacaoEncerramentosService.ts');

// Legacy HTML remains to support old links, but permission refresh must not
// make their sidebar buttons reappear during a failed React initialization.
for (const page of ['processos', 'tarefas', 'acordos', 'automacoes', 'dashboard']) {
  assert.match(auth, new RegExp("primaryNav = new Set\\(\\[[^\\]]*'"+page+"'"));
}
assert.match(auth, /!primaryNav\.has\(page\)/);
assert.match(auth, /element\.closest\('\.main-nav'\)/);
assert.match(main, /const visiblePages = new Set\(/);
assert.match(main, /ResultsErrorBoundary/);
assert.match(main, /getDerivedStateFromError/);
assert.match(index, /id="dashboard-root".*Carregando Resultados/);

// Keyboard shortcuts continue to advance via explicit Enter. Save remains
// displayed but disabled until the final stage, so no accidental submits.
assert.match(qa, /disabled=\{busy \|\| !ready \|\| \(qa !== null && !qa\.canSubmit\)\}/);
assert.match(qa, /event\.key === 'Enter'/);
assert.doesNotMatch(qaStyle, /data-qa-last='false'[^\n]*button\[type='submit'\][^\n]*display:\s*none/);

// All assignment perspectives show the same authorized rows, only regrouped.
for (const view of ['people', 'task', 'deadline']) assert.match(assignments, new RegExp("view === '"+view+"'"));
assert.match(assignments, /groupedPeople/);
assert.match(assignments, /bucketMeta/);
assert.match(assignments, /assignments-group-row/);
assert.doesNotMatch(assignments, /setView\('unassigned'\)|setView\('attention'\)/);

// Indication filter must go to the backend, never filter one fetched page.
assert.match(closePage, /Filtrar por tipo de indício DataJud/);
assert.match(closePage, /indicioFiltro/);
assert.match(closeApi, /query\.set\('indicio', indicio\)/);
assert.doesNotMatch(closePage, /rows\.filter\(row=>.*datajud_tipo/);

console.log('Shell, task shortcuts, grouping and indication-filter contracts passed.');

// A tab switch activates lazy modules; it does not reauthenticate the user or
// reset task state. Visited React modules remain mounted while hidden.
const app = read('app.js');
assert.match(auth, /new CustomEvent\('mba:module-activated', \{ detail \}\)/);
assert.match(auth, /new CustomEvent\('mba:authenticated', \{ detail: profile \}\)/);
assert.doesNotMatch(auth, /new CustomEvent\('mba:authenticated', \{ detail \}\)/);
assert.match(app, /addEventListener\('mba:module-activated'/);
const bancoDadosLifecycle = main.slice(main.indexOf('function syncBancoDadosLifecycle()'), main.indexOf('function configureBancoDadosLifecycle()'));
assert.doesNotMatch(bancoDadosLifecycle, /document\.hidden|!visible/);
assert.match(bancoDadosLifecycle, /section\.classList\.contains\('active'\) && !bancoDadosRoot/);
