/* Mascarenhas Barbosa — seleção Sol / Lua.
 * Executado no <head> para aplicar a preferência antes da primeira pintura.
 * Independente de React, da autenticação e dos módulos operacionais.
 */
(function () {
  'use strict';
  const key = 'mba-backoffice-theme-v1';
  const themes = ['sol', 'lua'];
  const root = document.documentElement;
  const saved = (() => {
    try { return window.localStorage.getItem(key); } catch (_) { return null; }
  })();
  const initial = themes.includes(saved) ? saved : 'sol';
  root.setAttribute('data-mba-theme', initial);
  root.style.colorScheme = initial === 'lua' ? 'dark' : 'light';

  const glyph = {
    sol: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>',
    lua: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.7 13.1A9 9 0 0 1 10.9 3.3 9 9 0 1 0 20.7 13.1Z"/></svg>'
  };

  function decorate(button) {
    const selected = root.getAttribute('data-mba-theme') === 'lua' ? 'lua' : 'sol';
    const next = selected === 'sol' ? 'Lua' : 'Sol';
    button.innerHTML = glyph[selected] + '<span>' + (selected === 'sol' ? 'Sol' : 'Lua') + '</span>';
    button.setAttribute('aria-label', 'Tema ' + (selected === 'sol' ? 'Sol (claro)' : 'Lua (escuro)') + '. Alternar para ' + next);
    button.setAttribute('title', 'Tema: ' + (selected === 'sol' ? 'Sol — claro' : 'Lua — escuro') + '. Mudar para ' + next);
    button.setAttribute('aria-pressed', selected === 'lua' ? 'true' : 'false');
  }

  function setTheme(next) {
    if (!themes.includes(next)) return;
    root.setAttribute('data-mba-theme', next);
    root.style.colorScheme = next === 'lua' ? 'dark' : 'light';
    try { window.localStorage.setItem(key, next); } catch (_) { /* sem armazenamento */ }
    document.querySelectorAll('.mba-theme-switch').forEach(decorate);
  }

  function mount() {
    const actions = document.querySelector('.topbar .top-actions');
    if (!actions || actions.querySelector('.mba-theme-switch')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mba-theme-switch';
    button.addEventListener('click', function () {
      const current = root.getAttribute('data-mba-theme');
      setTheme(current === 'lua' ? 'sol' : 'lua');
    });
    decorate(button);
    const profile = actions.querySelector('.profile');
    if (profile) actions.insertBefore(button, profile);
    else actions.appendChild(button);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();

  window.addEventListener('storage', function (event) {
    if (event.key === key) {
      const next = themes.includes(event.newValue) ? event.newValue : 'sol';
      root.setAttribute('data-mba-theme', next);
      root.style.colorScheme = next === 'lua' ? 'dark' : 'light';
      document.querySelectorAll('.mba-theme-switch').forEach(decorate);
    }
  });
})();
