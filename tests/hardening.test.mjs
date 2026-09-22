import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [auth, api, dashboard, config, packageText, vite, buildStatic, gitignore] = await Promise.all([
  readFile(new URL('../auth.js', import.meta.url), 'utf8'),
  readFile(new URL('../data-api.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/dashboard/main.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../config.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
  readFile(new URL('../vite.config.ts', import.meta.url), 'utf8'),
  readFile(new URL('../build-static.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../.gitignore', import.meta.url), 'utf8'),
]);

const packageJson = JSON.parse(packageText);

assert.match(auth, /if \(microsoftLoginInFlight\) return;/, 'Microsoft login must be single-flight');
assert.match(auth, /button\.disabled = busy;/, 'Microsoft login button must lock while starting OAuth');
assert.match(auth, /dispatchModuleAuthentication\(activePageId\(\), true\)/, 'bootstrap must activate only the current module');
assert.doesNotMatch(auth, /data-auth-provider="google"/, 'rendered login must not offer Google');

assert.match(api, /sessionInvalidCodes = new Set\(\['AUTH_REQUIRED', 'SESSION_INVALID'\]\)/, 'logout must require an explicit session-invalid code');
assert.match(api, /inFlightGets\.has\(path\)/, 'duplicate GETs must share one request');
assert.match(api, /TASK_PROCESS_CACHE_MS = 15000/, 'task process queue must have a short-lived cache');

assert.match(config, /mbaIsLocal[\s\S]*\? ''[\s\S]*mba-backoffice-proxy-production/, 'localhost must use same-origin API paths while production keeps Railway');
assert.match(packageJson.scripts['dev:local'], /npm run build && vite preview/, 'localhost must build before serving');
assert.match(packageJson.scripts['dev:local'], /--outDir dist/, 'localhost must serve the final dist artifact');
assert.equal(packageJson.scripts.dev, 'npm run dev:local', 'npm run dev must use the deterministic localhost runtime');
assert.doesNotMatch(packageJson.scripts['dev:local'], /vite --host/, 'localhost must not serve the repository source tree directly');

assert.match(vite, /outDir: '\.build\/react-dashboard'/, 'React bundles must be generated outside the tracked source tree');
assert.match(vite, /preview:[\s\S]*proxy: localProxy/, 'production preview must proxy API and auth to the local backend');
assert.match(buildStatic, /'\.build\/react-dashboard'/, 'dist must receive the React bundle generated in the disposable build directory');
assert.doesNotMatch(buildStatic, /await cp\(\s*'assets\/react-dashboard'/, 'dist must not depend on a tracked precompiled React bundle');
assert.match(gitignore, /\.build\//, 'disposable React build output must stay untracked');

assert.match(dashboard, /function unmountProtocolosPage\(\)/, 'Protocolos must be unmounted when hidden');
assert.match(dashboard, /document\.addEventListener\('visibilitychange', syncProtocolosLifecycle\)/, 'Protocolos polling must stop while the tab is hidden');
assert.doesNotMatch(dashboard, /\nmountProtocolosPage\(\);\s*$/, 'Protocolos must not mount unconditionally at bundle startup');

console.log('hardening regression checks passed');
