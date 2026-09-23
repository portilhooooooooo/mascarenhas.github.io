import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [
  auth,
  api,
  dashboard,
  config,
  packageText,
  vite,
  buildStatic,
  gitignore,
  pageInit,
  reactCompat,
  login,
  tasksApp,
  taskModel,
  taskRenderers,
] = await Promise.all([
  readFile(new URL('../auth.js', import.meta.url), 'utf8'),
  readFile(new URL('../data-api.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/dashboard/main.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../config.js', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
  readFile(new URL('../vite.config.ts', import.meta.url), 'utf8'),
  readFile(new URL('../build-static.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../.gitignore', import.meta.url), 'utf8'),
  readFile(new URL('../page-init-1.js', import.meta.url), 'utf8'),
  readFile(new URL('../react-compat.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/login/main.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/tasks/TasksApp.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/tasks/model.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/tasks/renderers.tsx', import.meta.url), 'utf8'),
]);

const packageJson = JSON.parse(packageText);

assert.match(auth, /if \(microsoftLoginInFlight\) return;/, 'Microsoft login must be single-flight');
assert.match(auth, /button\.disabled = busy;/, 'Microsoft login button must lock while starting OAuth');
assert.match(auth, /dispatchModuleAuthentication\(activePageId\(\), true\)/, 'bootstrap must activate only the current module');
assert.doesNotMatch(auth, /data-auth-provider="google"/, 'rendered login must not offer Google');
assert.match(auth, /window\.MBA_AUTH = \{/, 'auth must expose an explicit service for the React login');
assert.match(auth, /if \(!reactLoginEnabled\) renderMicrosoftOnlyLogin\(\);/, 'legacy auth must not own the React login DOM');

assert.match(pageInit, /window\.MBA_REACT_LOGIN = true;/, 'React login ownership must be declared before bootstrap');
assert.match(pageInit, /window\.MBA_REACT_TASKS = true;/, 'React task ownership must be declared before bootstrap');
assert.doesNotMatch(pageInit, /Continuar via Outlook/, 'page bootstrap must not rebuild the login');
assert.match(config, /window\.MBA_REACT_LOGIN = true;/, 'config must declare React login ownership before auth.js');
assert.match(config, /window\.MBA_REACT_TASKS = true;/, 'config must declare React task ownership before auth.js');
assert.match(login, /MBA_AUTH\?\.startMicrosoftLogin/, 'React login must call the auth service directly');
assert.doesNotMatch(login, /\.click\(\)/, 'React login must not delegate to a detached legacy button');
assert.match(login, /useLayoutEffect/, 'React login must reveal its mount before paint');

assert.match(api, /sessionInvalidCodes = new Set\(\['AUTH_REQUIRED', 'SESSION_INVALID'\]\)/, 'logout must require an explicit session-invalid code');
assert.match(api, /inFlightGets\.has\(path\)/, 'duplicate GETs must share one request');
assert.match(api, /TASK_PROCESS_CACHE_MS = 15000/, 'task process queue must have a short-lived cache');
assert.match(api, /comprovante_pagamento\|agreement\)-analysis/, 'agreement completion must invalidate the shared process cache');
assert.match(api, /skip\|agreement-skip-next/, 'agreement skip must invalidate the shared process cache');

assert.match(config, /MBA_API_BASE_URL = 'https:\/\/mba-backoffice-proxy-production\.up\.railway\.app'/, 'all non-mock runtimes must use the real Railway API');
assert.match(config, /MBA_LOCAL_PREVIEW = mbaIsLocal/, 'mock preview must remain restricted to localhost');
assert.match(packageJson.scripts['dev:local'], /npm run build && vite preview/, 'localhost must build before serving');
assert.match(packageJson.scripts['dev:local'], /--outDir dist/, 'localhost must serve the final dist artifact');
assert.equal(packageJson.scripts.dev, 'npm run dev:local', 'npm run dev must use the deterministic localhost runtime');
assert.doesNotMatch(packageJson.scripts['dev:local'], /vite --host/, 'localhost must not serve the repository source tree directly');

assert.match(vite, /outDir: '\.build\/react-dashboard'/, 'React bundles must be generated outside the tracked source tree');
assert.doesNotMatch(vite, /127\.0\.0\.1:5000/, 'localhost must not depend on a Flask backend running on the workstation');
assert.doesNotMatch(vite, /proxy:/, 'Vite preview must not proxy API/auth to a local backend');
assert.match(vite, /local\.portilhobackoffice\.site/, 'fixed Cloudflare tunnel hostname must be allowed by Vite preview');
assert.match(buildStatic, /'\.build\/react-dashboard'/, 'dist must receive the React bundle generated in the disposable build directory');
assert.doesNotMatch(buildStatic, /await cp\(\s*'assets\/react-dashboard'/, 'dist must not depend on a tracked precompiled React bundle');
assert.doesNotMatch(buildStatic, /tasks-workspace\.js/, 'dist must not load the legacy task workspace controller');
assert.doesNotMatch(buildStatic, /'tasks\.css'/, 'dist must not load the legacy task stylesheet');
assert.doesNotMatch(buildStatic, /\n\s*'security-ui\.js',/, 'dist must not copy the legacy login renderer');
assert.match(buildStatic, /security-ui\\\.js\|login-ui\\\.css/, 'build must reject any surviving legacy login UI reference');
assert.match(buildStatic, /react-compat\.js/, 'dist must install the legacy compatibility guard before authentication');
assert.match(buildStatic, /reactOwnedIndexHtml/, 'build must strip the legacy login markup before serving');
assert.match(buildStatic, /id=\"task-only-login\"\|id=\"google-login\"/, 'build must fail if legacy login controls survive');
assert.match(buildStatic, /somente o mount React do login/, 'build must assert a single login mount point');
assert.match(gitignore, /\.build\//, 'disposable React build output must stay untracked');

assert.match(dashboard, /mountTasksPage\(\);/, 'the application shell must mount the React Tasks workspace');
assert.match(dashboard, /TASK_PAGES\.has\(activePage\.id\)/, 'all task routes must keep the global Tasks nav active');
assert.match(dashboard, /function unmountProtocolosPage\(\)/, 'Protocolos must be unmounted when hidden');
assert.match(dashboard, /document\.addEventListener\('visibilitychange', syncProtocolosLifecycle\)/, 'Protocolos polling must stop while the tab is hidden');
assert.doesNotMatch(dashboard, /\nmountProtocolosPage\(\);\s*$/, 'Protocolos must not mount unconditionally at bundle startup');

assert.match(reactCompat, /'tasks\.view': false/, 'legacy task bootstrap must be suppressed without changing the real user permission');
assert.match(reactCompat, /tarefas\/comprovante-pagamento/, 'legacy task deep links must be normalized to the React workspace');
assert.match(tasksApp, /const CACHE_SIZE = 5;/, 'the visible operator queue must stay at five items');
assert.match(tasksApp, /processAssignedToUser\(task, process, user, manager\)/, 'operators must not receive another participant process from a shared task');
assert.match(tasksApp, /allAssignedTasks/, 'management must retain completed and inactive task visibility');
assert.match(taskModel, /if \(priority === 'high'\) return 'urgent';/, 'urgency must come from explicit assignment priority');
assert.doesNotMatch(taskModel, /deadline.*today.*urgent/i, 'today alone must not make a task urgent');
assert.doesNotMatch(taskRenderers, /data-lucide/, 'answer cards must not use decorative icons');
assert.match(taskRenderers, /workflow_version: 2/, 'payment renderer must use the current payment workflow contract');
assert.match(taskRenderers, /agreement-skip-next/, 'agreement renderer must preserve the backend skip-next contract');

console.log('hardening regression checks passed');
