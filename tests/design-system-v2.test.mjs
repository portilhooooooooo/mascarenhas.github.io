import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const [html, build, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url),'utf8'),
  readFile(new URL('../build-static.mjs', import.meta.url),'utf8'),
  readFile(new URL('../design-system-v2.css', import.meta.url),'utf8'),
]);
test('v2 is last stylesheet and deployed with cache version', () => {
  assert.ok(html.indexOf('brand-themes.css') < html.indexOf('design-system-v2.css'));
  assert.ok(build.includes("'design-system-v2.css'"));
  assert.ok(build.includes('design-system-v2.css?v='));
});
test('Sol and Lua use neutral palettes and semantic accent', () => {
  for (const value of ['--mba-canvas:#F4F5F3','--mba-canvas:#171A1B','--mba-accent:#B95A32','--mba-accent:#E58B58'])
    assert.ok(css.includes(value), value);
});
test('task workstation layout, keyboard focus and reduced motion are preserved', () => {
  assert.ok(css.includes('grid-template-columns:280px minmax(0,1fr)'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(!css.includes('linear-gradient('));
});
