(() => {
  'use strict';

  if (window.MBA_REACT_TASKS !== true) return;

  const legacyTaskRoutes = new Set([
    'tarefas/acordos',
    'tarefas/comprovante-pagamento',
  ]);

  function currentRoute() {
    return (location.hash.replace(/^#\//, '') || location.pathname.replace(/^\//, '')).replace(/\/$/, '');
  }

  function normalizeTaskRoute() {
    if (!legacyTaskRoutes.has(currentRoute())) return;
    const target = window.MBA_LOCAL_PREVIEW ? '#/tarefas' : '/tarefas';
    history.replaceState({ pageId: 'tarefas' }, '', target);
  }

  const restorePageRoute = window.restorePageRoute;
  if (typeof restorePageRoute === 'function') {
    window.restorePageRoute = function restoreReactRoute() {
      normalizeTaskRoute();
      return restorePageRoute();
    };
  }

  // app.js ainda escuta mba:authenticated para inicializar o lobby legado.
  // No módulo React, retiramos tasks.view somente da cópia transitória do evento.
  // A permissão real permanece intacta em window.MBA_CURRENT_USER e é lida pelo React.
  window.addEventListener('mba:authenticated', event => {
    if (!document.getElementById('tarefas')?.classList.contains('active')) return;
    const detail = event.detail;
    if (!detail?.permissions) return;
    detail.permissions = {
      ...detail.permissions,
      'tasks.view': false,
    };
  }, true);

  window.addEventListener('popstate', normalizeTaskRoute, true);
  window.addEventListener('hashchange', normalizeTaskRoute, true);
  normalizeTaskRoute();
})();
