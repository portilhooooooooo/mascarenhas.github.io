import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

const source = readFileSync(new URL('../auth.js', import.meta.url), 'utf8');

async function runCase(replaceToken) {
  const storage = new Map([['mba_session_token', 'ba_prior']]);
  const persistence = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  };
  const names = new Set(['auth-loading']);
  const classList = {
    add: (...values) => values.forEach(value => names.add(value)),
    remove: (...values) => values.forEach(value => names.delete(value)),
    contains: value => names.has(value),
  };
  const document = {
    body: { classList },
    head: { appendChild: element => { element.parentNode = document.head; } },
    createElement: () => ({ setAttribute() {}, parentNode: null }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: key => ['profile-name', 'profile-role', 'profile-avatar'].includes(key) ? {textContent:''} : null,
    addEventListener: () => {},
  };
  let rejectFirst;
  let profileRequests = 0;
  const events = [];
  const profile = { id: 'test-id', email: 'person@example.org', name: 'Test Analyst', role: 'analyst', permissions: {'dashboard.view':true}, portfolios: [], default_portfolio_id: null };
  const window = {
    setInterval:()=>1, clearInterval:()=>{},
    MBA_PORTFOLIO_POLICY: { canAccess: () => true },
    MBA_API: {
      request: path => {
        assert.equal(path, '/api/me');
        profileRequests += 1;
        if (profileRequests === 1) return new Promise((_, reject) => { rejectFirst = reject; });
        return Promise.resolve(profile);
      },
    },
    showPage: () => true,
    restorePageRoute: () => true,
    addEventListener: () => {},
    dispatchEvent: event => events.push(event.type),
  };
  const context = {
    window, document, localStorage:persistence, sessionStorage:persistence,
    history: { replaceState:()=>{} },
    location: {hash:'',pathname:'/',search:''},
    URLSearchParams, Date, Reflect, Set, Map, Proxy, Object, Promise, performance, AbortController, crypto:webcrypto,
    navigator:{locks:null},
    CustomEvent:class { constructor(type) { this.type=type; } },
    Event:class { constructor(type) { this.type=type; } },
    queueMicrotask,
    setTimeout, clearTimeout,
  };
  vm.runInNewContext(source, context);
  assert.equal(typeof rejectFirst, 'function');
  if (replaceToken) persistence.setItem('mba_session_token', 'ba_new');
  const error = new Error('old session revoked');
  error.status = 401;
  error.code = 'SESSION_INVALID';
  rejectFirst(error);
  for (let i=0; i<15; i++) await new Promise(resolve => setImmediate(resolve));
  if (replaceToken) {
    assert.equal(persistence.getItem('mba_session_token'), 'ba_new');
    assert.ok(names.has('auth-signed-in'));
    assert.equal(profileRequests, 2);
    assert.ok(window.MBA_CURRENT_USER);
  } else {
    assert.equal(persistence.getItem('mba_session_token'), null);
    assert.ok(names.has('auth-signed-out'));
    assert.equal(profileRequests, 1);
  }
}
await runCase(true);
await runCase(false);
console.log('PASS: stale 401 preserves the replacement token; a genuine 401 expires the original token.');
