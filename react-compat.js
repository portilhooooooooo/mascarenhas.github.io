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

  // React owns Tarefas; legacy loaders inspect MBA_REACT_TASKS explicitly.
  window.addEventListener('popstate', normalizeTaskRoute, true);
  window.addEventListener('hashchange', normalizeTaskRoute, true);
  normalizeTaskRoute();
})();
