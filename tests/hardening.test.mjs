import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [auth, api, dashboard, config, vite] = await Promise.all([
  readFile(new URL('../auth.js', import.meta.url), 'utf8'),
  readFile(new URL('../data-api.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/dashboard/main.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../config.js', import.meta.url), 'utf8'),
  readFile(new URL('../vite.config.ts', import.meta.url), 'utf8'),
]);

assert.match(auth, /if \(microsoftLoginInFlight\) return;/, 'Microsoft login must be single-flight');
assert.match(auth, /button\.disabled = busy;/, 'Microsoft login button must lock while starting OAuth');
assert.match(auth, /dispatchModuleAuthentication\(activePageId\(\), true\)/, 'bootstrap must activate only the current module');
assert.doesNotMatch(auth, /data-auth-provider="google"/, 'rendered login must not offer Google');

assert.match(api, /sessionInvalidCodes = new Set\(\['AUTH_REQUIRED', 'SESSION_INVALID'\]\)/, 'logout must require an explicit session-invalid code');
assert.match(api, /inFlightGets\.has\(path\)/, 'duplicate GETs must share one request');
assert.match(api, /TASK_PROCESS_CACHE_MS = 15000/, 'task process queue must have a short-lived cache');
assert.match(api, /const requestUrl = baseUrl \? baseUrl \+ path : path;/, 'localhost must support same-origin API paths');

assert.match(config, /mbaIsLocal[\s\S]*\? location\.origin[\s\S]*mba-backoffice-proxy-production/, 'localhost must use the Vite origin instead of Railway');
assert.doesNotMatch(config, /mbaIsLocal[\s\S]*\? ''/, 'localhost API base must never be empty');
assert.match(vite, /'\/auth'[\s\S]*target: localBackend/, 'Vite must proxy auth to the local backend');
assert.match(vite, /'\/api'[\s\S]*target: localBackend/, 'Vite must proxy API calls to the local backend');

assert.match(dashboard, /function unmountProtocolosPage\(\)/, 'Protocolos must be unmounted when hidden');
assert.match(dashboard, /document\.addEventListener\('visibilitychange', syncProtocolosLifecycle\)/, 'Protocolos polling must stop while the tab is hidden');
assert.doesNotMatch(dashboard, /\nmountProtocolosPage\(\);\s*$/, 'Protocolos must not mount unconditionally at bundle startup');

console.log('hardening regression checks passed');
