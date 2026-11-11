// Verifies the staging/production build split without a browser.
// Run after `npm run build` and `npm run build:staging`.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import vm from 'node:vm';

const PROD_HOST = 'api.portilhobackoffice.site';
const source = await readFile('config.js', 'utf8');

function evaluate(code, hostname, search = '') {
  const listeners = {};
  const window = { addEventListener: (e, f) => { listeners[e] = f; }, dispatchEvent() {} };
  vm.runInNewContext(code, {
    window, location: { hostname, search }, URLSearchParams, queueMicrotask, CustomEvent: class {},
    document: { body: { classList: { add() {}, remove() {} } } },
  });
  return window;
}

// Production artifact: config.js byte-identical to source, prod API, no staging flags.
if (existsSync('dist/config.js')) {
  const prod = await readFile('dist/config.js', 'utf8');
  assert.equal(prod, source, 'dist/config.js must equal source config.js');
  const w = evaluate(prod, 'app.example');
  assert.equal(w.MBA_API_BASE_URL, `https://${PROD_HOST}`);
  assert.equal(w.MBA_DASHBOARD_V1_ENABLED, undefined);
  console.log('PASS production config unchanged');
} else console.log('SKIP production dist not built');

// Staging artifact: loopback API, prod host absent everywhere, preview still localhost-only.
assert.ok(existsSync('dist-staging/config.js'), 'run npm run build:staging first');
const stagingConfig = await readFile('dist-staging/config.js', 'utf8');
const remote = evaluate(stagingConfig, 'staging.example', '?preview=1');
assert.match(remote.MBA_API_BASE_URL, /^http:\/\/(127\.0\.0\.1|localhost):5051$/);
assert.equal(remote.MBA_BUILD_TARGET, 'staging');
assert.equal(remote.MBA_LOCAL_PREVIEW, false, '?preview=1 must not activate off localhost');
assert.equal(evaluate(stagingConfig, '127.0.0.1', '?preview=1').MBA_LOCAL_PREVIEW, true);
assert.equal(evaluate(stagingConfig, '127.0.0.1', '').MBA_LOCAL_PREVIEW, false);
const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true }))
  .map((e) => e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]))).flat();
for (const path of await walk('dist-staging')) {
  if (!/\.(js|css|html|txt|json|svg)$|_headers$/.test(path)) continue;
  assert.ok(!(await readFile(path, 'utf8')).includes(PROD_HOST), `${path} references production API`);
}
assert.ok(!(await readFile('dist-staging/index.html', 'utf8')).includes('mock-api.js'), 'mock API must not ship');
console.log('PASS staging config uses loopback API, no production host, preview localhost-only');
