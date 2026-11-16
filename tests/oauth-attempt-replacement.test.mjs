// Behavioural check of the Microsoft OAuth start/callback flow in auth.js.
// Two "tabs" share one localStorage and keep separate sessionStorage, as browsers do.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';

const source = readFileSync(new URL('../auth.js', import.meta.url), 'utf8');
assert.doesNotMatch(source, /Outro acesso Microsoft está em andamento/, 'a pending attempt must not block a new one');
assert.doesNotMatch(source, /setItem\([^)]*mba_oauth_lease/, 'the 60 s lease must not be written anymore');
assert.doesNotMatch(source, /localStorage\.setItem\([^)]*(verifier|handoff)/i, 'verifier/handoff must stay in per-tab storage');

const makeStorage = () => {
  const saved = new Map();
  return {
    getItem: key => (saved.has(key) ? saved.get(key) : null),
    setItem: (key, value) => { saved.set(key, String(value)); },
    removeItem: key => { saved.delete(key); },
  };
};
const profile = { id: 'u1', email: 'user@example.invalid', permissions: {} };
const settle = () => new Promise(resolve => setImmediate(resolve));

// Loads auth.js as one page load of a tab. Reusing `session` models a reload/redirect back.
async function loadTab(browser, session, { hash = '', startFails = false } = {}) {
  const listeners = new Map();
  const states = [];
  const calls = [];
  const classes = new Set();
  const location = { hash, pathname: '/', search: '', assigned: null, assign(url) { this.assigned = url; } };
  const window = {
    crypto: webcrypto,
    addEventListener: (type, fn) => { listeners.set(type, [...(listeners.get(type) || []), fn]); },
    dispatchEvent: event => {
      if (event.type === 'mba:auth-state') states.push(event.detail);
      (listeners.get(event.type) || []).forEach(fn => fn(event));
    },
    MBA_API: {
      request: async (path, options = {}) => {
        calls.push({ path, body: options.body ? JSON.parse(options.body) : null });
        if (path === '/auth/microsoft/start') {
          if (startFails) throw new Error('indisponível');
          return { url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?state=opaque' };
        }
        if (path === '/auth/session/exchange') return { access_token: 'session-for-' + JSON.parse(options.body).handoff_code };
        if (path === '/api/me') return profile;
        throw new Error('unexpected ' + path);
      },
    },
  };
  const context = {
    window, location,
    localStorage: browser, sessionStorage: session,
    document: {
      title: '', hidden: false, head: { appendChild: () => {} },
      body: { classList: { add: (...names) => names.forEach(name => classes.add(name)), remove: (...names) => names.forEach(name => classes.delete(name)) } },
      querySelector: () => null, querySelectorAll: () => [], getElementById: () => null,
      createElement: () => ({}), addEventListener: () => {},
    },
    history: { replaceState: () => { location.hash = ''; } },
    navigator: {}, crypto: webcrypto, performance, btoa, TextEncoder, URL, URLSearchParams, AbortController,
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    Event: class { constructor(type) { this.type = type; } },
    queueMicrotask, clearTimeout, console,
    setTimeout: (fn, ms) => setTimeout(fn, ms > 1000 ? 0 : ms),
  };
  vm.runInNewContext(source, context);
  await settle(); await settle();
  for (let i = 0; i < 20 && classes.has('mba-auth-transition-hold'); i += 1) await settle();
  return {
    window, location, calls, states, classes, session,
    emit: (type, extra = {}) => (listeners.get(type) || []).forEach(fn => fn({ type, ...extra })),
    exchanges: () => calls.filter(call => call.path === '/auth/session/exchange'),
    lastError: () => states.at(-1)?.error ?? null,
  };
}

// 1. Two tabs start in sequence: neither is blocked, the newest becomes current.
{
  const browser = makeStorage();
  const sessionA = makeStorage(); const sessionB = makeStorage();
  const tabA = await loadTab(browser, sessionA);
  await tabA.window.MBA_AUTH.startMicrosoftLogin();
  assert.ok(tabA.location.assigned, 'tab A is redirected to Microsoft');
  const tabB = await loadTab(browser, sessionB);
  await tabB.window.MBA_AUTH.startMicrosoftLogin();
  assert.ok(tabB.location.assigned, 'tab B is redirected immediately while A is pending');
  assert.equal(tabB.lastError(), null);
  assert.equal(browser.getItem('mba_oauth_current_attempt'), sessionB.getItem('mba_oauth_attempt'));
  assert.notEqual(sessionA.getItem('mba_oauth_verifier'), sessionB.getItem('mba_oauth_verifier'));
  assert.equal(browser.getItem('mba_oauth_verifier'), null);

  // 2. A's callback is stale: no exchange, quiet actionable message, B stays current.
  const staleA = await loadTab(browser, sessionA, { hash: '#auth_handoff=codeA' });
  assert.equal(staleA.exchanges().length, 0, 'a superseded callback must not be exchanged');
  assert.match(staleA.lastError(), /substituído por uma tentativa mais recente/);
  assert.equal(staleA.location.hash, '', 'handoff code leaves the URL');
  assert.equal(sessionA.getItem('mba_oauth_handoff'), null);
  assert.equal(sessionA.getItem('mba_oauth_verifier'), null);
  assert.equal(browser.getItem('mba_session_token'), null);
  assert.equal(browser.getItem('mba_oauth_current_attempt'), sessionB.getItem('mba_oauth_attempt'));

  // 3. B's callback is current: exchanged once with B's own verifier; flow state is cleared.
  const verifierB = sessionB.getItem('mba_oauth_verifier');
  const doneB = await loadTab(browser, sessionB, { hash: '#auth_handoff=codeB' });
  assert.deepEqual(doneB.exchanges().map(call => call.body), [{ handoff_code: 'codeB', handoff_verifier: verifierB }]);
  assert.equal(browser.getItem('mba_session_token'), 'session-for-codeB');
  assert.equal(browser.getItem('mba_oauth_current_attempt'), null);
  assert.equal(sessionB.getItem('mba_oauth_verifier'), null);
  assert.equal(doneB.states.at(-1).status, 'authenticated');

  // 4. Replaying the same callback URL in that tab cannot be exchanged again.
  const replay = await loadTab(browser, sessionB, { hash: '#auth_handoff=codeB' });
  assert.equal(replay.exchanges().length, 0);
  assert.equal(replay.states.at(-1).status, 'authenticated', 'tab keeps the stored session');
  assert.equal(replay.lastError(), null);
}

// 5. A stale callback arriving after the newer login finished adopts the stored session.
{
  const browser = makeStorage();
  const sessionA = makeStorage(); const sessionB = makeStorage();
  await (await loadTab(browser, sessionA)).window.MBA_AUTH.startMicrosoftLogin();
  await (await loadTab(browser, sessionB)).window.MBA_AUTH.startMicrosoftLogin();
  await loadTab(browser, sessionB, { hash: '#auth_handoff=codeB' });
  const staleA = await loadTab(browser, sessionA, { hash: '#auth_handoff=codeA' });
  assert.equal(staleA.exchanges().length, 0);
  assert.equal(browser.getItem('mba_session_token'), 'session-for-codeB', 'stale callback must not replace the newer session');
  assert.equal(staleA.states.at(-1).status, 'authenticated');
  assert.equal(staleA.lastError(), null);
}

// 6. A current callback replaces a session already stored in this browser.
{
  const browser = makeStorage(); const session = makeStorage();
  await (await loadTab(browser, session)).window.MBA_AUTH.startMicrosoftLogin();
  browser.setItem('mba_session_token', 'previous-session');
  const done = await loadTab(browser, session, { hash: '#auth_handoff=codeNew' });
  assert.equal(done.exchanges().length, 1);
  assert.equal(browser.getItem('mba_session_token'), 'session-for-codeNew');
}

// 7. A handoff delivered to a tab that never started a login (login CSRF) is not exchanged.
{
  const browser = makeStorage();
  const tab = await loadTab(browser, makeStorage(), { hash: '#auth_handoff=foreign' });
  assert.equal(tab.exchanges().length, 0);
  assert.match(tab.lastError(), /Inicie o login novamente/);
  assert.equal(browser.getItem('mba_session_token'), null);
}

// 8. A start that fails does not supersede the attempt pending in another tab.
{
  const browser = makeStorage(); const sessionA = makeStorage();
  await (await loadTab(browser, sessionA)).window.MBA_AUTH.startMicrosoftLogin();
  const failing = await loadTab(browser, makeStorage(), { startFails: true });
  await failing.window.MBA_AUTH.startMicrosoftLogin();
  assert.equal(failing.location.assigned, null);
  assert.equal(failing.states.at(-1).busy, false);
  assert.equal(browser.getItem('mba_oauth_current_attempt'), sessionA.getItem('mba_oauth_attempt'));
  // The same tab can retry at once.
  failing.window.MBA_API.request = async () => ({ url: 'https://login.microsoftonline.com/x' });
  await failing.window.MBA_AUTH.startMicrosoftLogin();
  assert.ok(failing.location.assigned);
}

// 9. Back from Microsoft via back/forward cache: the button is released and a retry works.
{
  const browser = makeStorage(); const session = makeStorage();
  const tab = await loadTab(browser, session);
  await tab.window.MBA_AUTH.startMicrosoftLogin();
  assert.equal(tab.states.at(-1).busy, true);
  const first = session.getItem('mba_oauth_attempt');
  tab.emit('pageshow', { persisted: true });
  assert.equal(tab.states.at(-1).busy, false);
  tab.location.assigned = null;
  await tab.window.MBA_AUTH.startMicrosoftLogin();
  assert.ok(tab.location.assigned, 'retry is not blocked');
  assert.notEqual(session.getItem('mba_oauth_attempt'), first);
  assert.equal(browser.getItem('mba_oauth_current_attempt'), session.getItem('mba_oauth_attempt'));
}

// 10. An untrusted authorize origin is still refused and leaves no marker behind.
{
  const browser = makeStorage();
  const tab = await loadTab(browser, makeStorage());
  tab.window.MBA_API.request = async () => ({ url: 'https://login.example.invalid/authorize' });
  await tab.window.MBA_AUTH.startMicrosoftLogin();
  assert.equal(tab.location.assigned, null);
  assert.equal(browser.getItem('mba_oauth_current_attempt'), null);
}

console.log('PASS: nova tentativa Microsoft substitui a pendente; callback stale não é trocado.');
