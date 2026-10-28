import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const [script, themesCss, identityCss, index, buildStatic] = await Promise.all([
  readFile(new URL('../brand-theme.js', import.meta.url), 'utf8'),
  readFile(new URL('../brand-themes.css', import.meta.url), 'utf8'),
  readFile(new URL('../brand-identity.css', import.meta.url), 'utf8'),
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../build-static.mjs', import.meta.url), 'utf8'),
]);

function launch(saved = null) {
  const state = new Map(saved == null ? [] : [['mba-backoffice-theme-v1', saved]]);
  const attributes = new Map();
  let loaded;
  const events = {};
  let button;
  const actions = {
    querySelector() { return button ?? null; },
    insertBefore(value) { button = value; },
    appendChild(value) { button = value; },
  };
  const document = {
    readyState: 'loading',
    documentElement: {
      style: {},
      setAttribute(k,v) { attributes.set(k,v); },
      getAttribute(k) { return attributes.get(k); },
    },
    addEventListener(name,fn) { if (name === 'DOMContentLoaded') loaded = fn; },
    querySelector(q) {
      if (q === '.topbar .top-actions') return actions;
      return null;
    },
    querySelectorAll() { return button ? [button] : []; },
    createElement() {
      const listeners = {};
      return {
        listeners,
        addEventListener(name,fn) { listeners[name] = fn; },
        setAttribute(k,v) { this[k] = v; },
      };
    },
  };
  const window = {
    localStorage: {
      getItem(key) { return state.get(key) ?? null; },
      setItem(key,value) { state.set(key,value); },
    },
    addEventListener(name,fn) { events[name] = fn; },
  };
  vm.runInNewContext(script, { document, window });
  loaded();
  return { state, attributes, document, button, events };
}

test('Sol é o padrão e o seletor acessível alterna para Lua', () => {
  const app = launch();
  assert.equal(app.attributes.get('data-mba-theme'), 'sol');
  assert.equal(app.document.documentElement.style.colorScheme, 'light');
  assert.match(app.button.innerHTML, /Sol/);
  app.button.listeners.click();
  assert.equal(app.attributes.get('data-mba-theme'), 'lua');
  assert.equal(app.state.get('mba-backoffice-theme-v1'), 'lua');
  assert.equal(app.button['aria-pressed'], 'true');
  assert.match(app.button.title, /Lua/);
  app.button.listeners.click();
  assert.equal(app.attributes.get('data-mba-theme'), 'sol');
});

test('preferência Lua é restaurada antes de renderizar a interface', () => {
  const app = launch('lua');
  assert.equal(app.attributes.get('data-mba-theme'), 'lua');
  assert.equal(app.document.documentElement.style.colorScheme, 'dark');
  assert.match(app.button.innerHTML, /Lua/);
});

test('mudança em outra aba atualiza tema e seletor', () => {
  const app = launch();
  app.events.storage({key:'mba-backoffice-theme-v1',newValue:'lua'});
  assert.equal(app.attributes.get('data-mba-theme'),'lua');
  assert.match(app.button.innerHTML,/Lua/);
});

test('Sol mantém a paleta clara e Lua define as superfícies de trabalho grafite', () => {
  assert.match(identityCss,/--mba-bg: #f7f6f3/);
  assert.match(themesCss,/html\[data-mba-theme="lua"\]/);
  assert.match(themesCss,/--mba-bg:#1e1e20/);
  assert.match(themesCss,/--mba-surface:#29292c/);
  assert.match(themesCss,/\.tasks-renderer-card/);
  assert.match(themesCss,/\.tasks-process-item\.selected/);
  assert.match(themesCss,/\.queue-item-badges \.tasks-state-pill\.medium/);
});

test('script executa antes das folhas e acompanha o build de produção', () => {
  assert.ok(index.indexOf('brand-theme.js') < index.indexOf('styles.css'));
  assert.ok(index.indexOf('brand-themes.css') > index.indexOf('brand-identity.css'));
  for (const file of ['brand-theme.js','brand-themes.css']) {
    assert.ok(buildStatic.includes(`'${file}'`));
    assert.ok(buildStatic.includes(`${file}?v=${'$'}{buildVersion}`));
  }
});
