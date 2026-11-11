// Headless Chrome captures of Resultados > Cadastro / Andamentos with the Read Model panel.
//
// Usage (after `npm run build:staging` and `npm run preview:staging`):
//   SCREENS_DIR=/path node tests/screens/capture-results-states.mjs
//
// Two kinds of capture, labelled on-screen and in the filename:
//  * "staging-live-*": localhost ?preview=1 identity, REAL staging API at 127.0.0.1:5051,
//    no session token -> shows the real 401 handling. No interception.
//  * "preview-*": localhost ?preview=1 with SYNTHETIC fixtures injected by this harness via
//    request interception (layout/state review only). Fixtures are never shipped in the app.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const APP = process.env.APP_URL || 'http://127.0.0.1:5173';
const API = process.env.API_URL || 'http://127.0.0.1:5051';
const OUT = process.env.SCREENS_DIR || 'screens';
await mkdir(OUT, { recursive: true });

// The repo's localhost preview user carries no portfolio list; give it one synthetic row.
const identityPatch = () => {
  let user = null;
  Object.defineProperty(window, 'MBA_CURRENT_USER', {
    configurable: true,
    get: () => user,
    set: (value) => {
      user = value && !value.portfolios
        ? { ...value, portfolios: [{ id: 'agibank_enter', name: 'Carteira Exemplo (preview)', operator: 'enter' }] }
        : value;
    },
  });
};
const banner = (text) => `
  const b=document.createElement('div');b.textContent=${JSON.stringify(text)};
  b.style.cssText='position:fixed;right:12px;bottom:12px;z-index:99999;padding:6px 10px;border-radius:6px;'+
    'background:#1f2a37;color:#fff;font:600 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.02em;opacity:.92';
  document.body.appendChild(b);`;

const json = (body, status = 200) => ({ status, contentType: 'application/json',
  headers: { 'access-control-allow-origin': APP, 'cache-control': 'private, no-store' }, body: JSON.stringify(body) });

// ---- Synthetic fixtures (PREVIEW ONLY; fictitious numbers, every state represented) ----
const card = (value, status, extra = {}) => ({ value, status, source: 'BENNER_V3:EXEMPLO', ...extra });
const fixtures = {
  '/api/resultados/cadastro/cards': json({
    contract_version: 'cadastro.cards.v2.1', portfolio_id: 'agibank_enter', status: 'PARTIAL', module: 'cadastro',
    cards: {
      entradas: card(1234, 'CURRENT'),
      cadastrar: card(null, 'UNAVAILABLE', { blockers: ['CPJ_SNAPSHOT_NOT_CERTIFIED'] }),
      com_audiencia: card(null, 'UNAVAILABLE', { blockers: ['HEARING_SOURCE_NOT_CERTIFIED'] }),
      com_liminar: card(87, 'PARTIAL', { blockers: ['JUDICIAL_COVERAGE_NOT_CERTIFIED'] }),
      arquivar: card(42, 'PARTIAL', { blockers: ['PBI_AGIBANK_OTHER_ACCREDITED_OFFICE_NOT_CERTIFIED'] }),
    },
    filters_applied: { entry_start: null, entry_end: null, situation: null, office: 'EXEMPLO' }, limitations: [],
  }),
  '/api/resultados/cadastro/processos': json({
    status: 'CURRENT', total: 3, page: 1, page_size: 25, category: 'entradas',
    rows: [1, 2, 3].map((n) => ({ id: `00000000-0000-0000-0000-00000000000${n}`, cnj: `0000000-00.0000.0.00.000${n}`,
      situation: 'Em andamento', state: 'XX', entry_date: '2026-01-0' + n, product: 'Produto exemplo' })),
  }),
  '/api/resultados/andamentos/cards': json({
    portfolio_id: 'agibank_enter', module: 'andamentos', status: 'CURRENT', charts: { offices: ['EXEMPLO'] },
    metrics: { by_event_kind: { SENTENCA_IMPROCEDENTE: 31, SENTENCA_PROCEDENTE: 9, SUSPENSAO: 4 }, fase_conhecimento: null },
    limitations: ['CANONICAL_PROCESS_PHASE_NOT_AVAILABLE'],
  }),
  '/api/dashboard/v1/cadastro': json({
    contract_version: '1.0.0', dashboard: 'cadastro', status: 'PARTIAL', portfolio_id: 'agibank_enter', source_tenant: 'exemplo',
    revision: '7', calculated_at: '2026-11-11T12:00:00+00:00', data_as_of: '2026-11-11T03:00:00+00:00',
    metrics: [{ module: 'cadastro', name: 'entradas', version: '1', reference_date: '2026-11-11', dimensions: {}, numerator: '1201', denominator: '0', samples: 1 }],
    limitations: ['CADASTRO_ENTRADAS_ONLY', 'LEGACY_PARITY_PENDING', 'DETAIL_AVAILABILITY_PER_METRIC'],
  }),
  '/api/dashboard/v1/cadastro/metrics/entradas/cases': json({
    contract_version: '1.0.0', dashboard: 'cadastro', portfolio_id: 'agibank_enter', revision: '7', total: 1201,
    cases: [1, 2, 3].map((n) => ({ canonical_case_id: `0000000${n}-0000-4000-8000-000000000000`, reference_date: '2026-11-11',
      dimensions: { office: 'EXEMPLO' }, evidence: { source_revision: 7 } })), next_after: '00000003-0000-4000-8000-000000000000',
  }),
  '/api/dashboard/v1/andamentos': json({ contract_version: '1.0.0', dashboard: 'andamentos', status: 'UNAVAILABLE', limitations: ['NO_PUBLISHED_REVISION'] }),
};
const fixtureRoute = (overrides = {}) => async (route) => {
  const url = new URL(route.request().url());
  if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: {
    'access-control-allow-origin': APP, 'access-control-allow-headers': 'authorization,content-type,x-portfolio-id,accept', 'access-control-allow-methods': 'GET' } });
  const hit = overrides[url.pathname] || fixtures[url.pathname];
  return route.fulfill(hit || json({ code: 'NOT_IN_PREVIEW_FIXTURES' }, 404));
};

const browser = await chromium.launch();
async function shot(name, path, { label, route, after } = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript(identityPatch);
  if (route) await page.route(API + '/**', route);
  await page.goto(`${APP}/${path}?preview=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  if (after) await after(page);
  await page.evaluate(banner(label));
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
  await context.close();
}

await shot('cadastro-staging-live-unauthenticated', 'analytics/cadastro',
  { label: 'STAGING LIVE · API 127.0.0.1:5051 · sem sessão (401)' });
await shot('andamentos-staging-live-unauthenticated', 'analytics/andamentos',
  { label: 'STAGING LIVE · API 127.0.0.1:5051 · sem sessão (401)' });
await shot('cadastro-preview-states', 'analytics/cadastro',
  { label: 'PREVIEW · dados sintéticos', route: fixtureRoute() });
await shot('cadastro-preview-drilldown-cadastro', 'analytics/cadastro', {
  label: 'PREVIEW · dados sintéticos', route: fixtureRoute(),
  after: async (p) => { await p.getByRole('button', { name: /^Entradas — .*abrir relação/ }).first().click(); await p.waitForTimeout(800); },
});
await shot('cadastro-preview-drilldown-read-model', 'analytics/cadastro', {
  label: 'PREVIEW · dados sintéticos', route: fixtureRoute(),
  after: async (p) => { await p.locator('.mba-read-model button.base-geral-card').first().click(); await p.waitForTimeout(800); },
});
await shot('andamentos-preview-states', 'analytics/andamentos',
  { label: 'PREVIEW · dados sintéticos', route: fixtureRoute() });
await shot('cadastro-preview-error-forbidden', 'analytics/cadastro', {
  label: 'PREVIEW · dados sintéticos · 503 / 403', route: fixtureRoute({
    '/api/resultados/cadastro/cards': json({ code: 'CANONICAL_CARDS_UNAVAILABLE', error: 'Indicadores indisponíveis.' }, 503),
    '/api/dashboard/v1/cadastro': json({ contract_version: '1.0.0', code: 'PORTFOLIO_ACCESS_DENIED' }, 403),
  }),
});
await browser.close();
