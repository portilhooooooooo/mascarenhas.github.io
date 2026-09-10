import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { LEGACY_LOCAL_SCRIPTS, singleRuntimeHtml } from '../scripts/single-runtime-html.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const removedRootScripts = [
  'config.js', 'mock-api.js', 'data-api.js', 'app.js', 'agreements.js',
  'auth.js', 'security-ui.js', 'page-init-1.js', 'page-init-2.js',
];

test('Vite is the only production build pipeline', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts.build, 'node --test tests/*.test.mjs && tsc --noEmit && vite build');
  assert.equal(existsSync(new URL('../build-static.mjs', import.meta.url)), false);
  assert.equal(existsSync(new URL('../assets/react-dashboard/dashboard-react.js', import.meta.url)), false);
  assert.equal(existsSync(new URL('../assets/react-dashboard/dashboard-react.css', import.meta.url)), false);
});

test('application scripts have one source tree and one entrypoint', () => {
  for (const path of removedRootScripts) {
    assert.equal(existsSync(new URL(`../${path}`, import.meta.url)), false, `${path} must not exist at repository root`);
  }
  const runtime = read('src/runtime/index.ts');
  for (const path of removedRootScripts) assert.ok(runtime.includes(`./${path}`), `${path} must be imported by runtime/index.ts`);
  assert.match(read('src/dashboard/main.tsx'), /import ['"]\.\.\/runtime\/index['"]/);
});

test('HTML build transform removes every parallel local application script', () => {
  const output = singleRuntimeHtml(read('index.html'));
  for (const source of LEGACY_LOCAL_SCRIPTS) {
    assert.equal(output.includes(`src="${source}`), false, `${source} leaked into transformed HTML`);
    assert.equal(output.includes(`src="/${source}`), false, `${source} leaked into transformed HTML`);
  }
  assert.equal((output.match(/src=["']\/src\/dashboard\/main\.tsx["']/g) || []).length, 1);
  assert.equal((output.match(/src=["']\/vendor\/qrcode\.js["']/g) || []).length, 1);
});

test('browser source does not contain a Supabase client', () => {
  const pkg = read('package.json');
  const config = read('src/runtime/config.js');
  assert.doesNotMatch(pkg, /@supabase\//i);
  assert.doesNotMatch(config, /supabase\.co|SUPABASE_URL|SUPABASE_ANON/i);
});

test('base imports bypass generic task creation and target backend contracts', () => {
  const source = read('src/dashboard/taskBaseImport.ts');
  assert.match(source, /base_benner[\s\S]*\/api\/base-processual\/benner\/importar/);
  assert.match(source, /base_cpj[\s\S]*\/api\/base-processual\/cpj\/importar/);
  assert.match(source, /\/api\/base-processual\/consolidar/);
  assert.doesNotMatch(source, /\/api\/tasks/);
  assert.match(source, /body\.append\(['"]file['"],\s*file\)/);
});
