import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../data-api.js', import.meta.url), 'utf8');

async function exerciseSessionResponse(changeToken) {
  const saved = new Map([['mba_session_token', 'ba_original_session']]);
  const storage = {
    getItem: key => saved.get(key) || null,
    setItem: (key, value) => saved.set(key, value),
    removeItem: key => saved.delete(key),
  };
  const events = [];
  let completeFetch;
  const window = {
    MBA_API_BASE_URL: 'https://api.invalid',
    addEventListener: () => {},
    dispatchEvent: event => events.push(event.type),
  };
  const context = {
    window,
    localStorage: storage,
    sessionStorage: storage,
    location: { hostname: 'app.invalid' },
    document: {
      hidden: true,
      body: { classList: { contains: () => false } },
      addEventListener: () => {},
    },
    Headers,
    FormData,
    File,
    AbortController,
    TextDecoder,
    URL,
    performance: { now: () => 0 },
    CustomEvent: class { constructor(type) { this.type = type; } },
    fetch: () => new Promise(resolve => { completeFetch = resolve; }),
    setTimeout,
    clearTimeout,
    console,
  };
  vm.runInNewContext(source, context);
  const pending = window.MBA_API.request('/api/me');
  assert.equal(typeof completeFetch, 'function');
  if (changeToken) storage.setItem('mba_session_token', 'ba_fresh_session');
  completeFetch(new Response(JSON.stringify({
    code: 'SESSION_INVALID',
    error: 'Sessão inválida',
  }), { status: 401, headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(pending, /Sessão inválida/);
  if (changeToken) {
    assert.equal(storage.getItem('mba_session_token'), 'ba_fresh_session');
    assert.ok(!events.includes('mba:session-expired'));
  } else {
    assert.equal(storage.getItem('mba_session_token'), null);
    assert.ok(events.includes('mba:session-expired'));
  }
}
await exerciseSessionResponse(true);
await exerciseSessionResponse(false);
console.log('PASS: uma resposta atrasada não remove a sessão mais recente.');
