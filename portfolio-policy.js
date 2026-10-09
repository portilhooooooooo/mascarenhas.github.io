/* Portfolio-aware presentation policy. Server-side authorization remains authoritative. */
(() => {
  'use strict';
  const PAGE_PERMISSIONS = Object.freeze({
    dashboard: 'dashboard.view',
    tarefas: 'tasks.view',
    'tarefa-analise': 'tasks.view',
    'comprovante-execucao': 'tasks.view',
    'acordo-execucao': 'tasks.view',
    acordos: 'pagamentos.view',
    pagamentos: 'pagamentos.view',
    automacoes: 'automations.view',
    protocolo: 'automations.view',
    tutelas: 'tutelas.view',
    encerramentos: 'encerramentos.view',
    usuarios: 'users.view',
    configuracoes: 'settings.view',
  });
  const ENTER_ONLY = new Set(['protocolo']);
  const GLOBAL_PAGES = new Set(['usuarios', 'configuracoes']);
  const SHARED_PAGES = new Set(['dashboard', 'tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao', 'acordos', 'pagamentos', 'tutelas', 'encerramentos']);
  const canonical = value => String(value || '').trim().toLowerCase();
  const getPortfolio = user => {
    const rows = Array.isArray(user?.portfolios) ? user.portfolios : [];
    const id = window.MBA_API?.getPortfolioId?.();
    return rows.find(row => canonical(row.id) === canonical(id)) || null;
  };
  const isEnter = portfolio => {
    const id = canonical(portfolio?.id);
    const operator = canonical(portfolio?.operator_name || portfolio?.operator);
    return /(?:^|[_-])enter$/.test(id) || operator === 'enter';
  };
  // Explicit backend portfolio module capabilities, when supplied, override fallback rules.
  const declaredModules = portfolio => {
    for (const key of ['enabled_modules', 'available_modules', 'modules']) {
      if (Array.isArray(portfolio?.[key])) return new Set(portfolio[key].map(canonical));
    }
    return null;
  };
  const moduleAvailable = (pageId, user) => {
    // Home não concede acesso aos módulos operacionais.
    if (pageId === 'home') return Boolean(user?.id); // Toda sessão autenticada acessa a Home, independentemente de carteira/permissões.
    if (!user || !PAGE_PERMISSIONS[pageId]) return false;
    if (GLOBAL_PAGES.has(pageId)) return true;
    const portfolio = getPortfolio(user);
    if (!portfolio) return false; // Never infer entitlements from a stale or missing portfolio.
    const modules = declaredModules(portfolio);
    const moduleAliases = {
      dashboard: ['dashboard', 'analytics', 'gestao_processual'],
      tarefas: ['tarefas', 'tasks'],
      'tarefa-analise': ['tarefas', 'tasks'],
      'comprovante-execucao': ['tarefas', 'tasks'],
      'acordo-execucao': ['tarefas', 'tasks'],
      acordos: ['operacao', 'acordos', 'agreements', 'pagamentos', 'liminar', 'tutelas', 'encerramentos'],
      pagamentos: ['operacao', 'pagamentos'],
      automacoes: ['automacoes', 'automations'],
      protocolo: ['controladoria', 'protocolo', 'protocolos'],
      tutelas: ['tutelas', 'liminar'],
      encerramentos: ['encerramentos'],
    };
    if (ENTER_ONLY.has(pageId) && !isEnter(portfolio)) return false;
    if (pageId === 'automacoes' && !isEnter(portfolio) && canonical(portfolio.id) !== 'agibank_mba') return false;
    if (modules) return (moduleAliases[pageId] || [pageId]).some(key => modules.has(key));
    // Without declared capabilities, allow generic modules only by user permission.
    // Modules tied to Enter still require an Enter portfolio.
    return SHARED_PAGES.has(pageId) || (pageId === 'automacoes' && (isEnter(portfolio) || canonical(portfolio.id) === 'agibank_mba')) || (ENTER_ONLY.has(pageId) && isEnter(portfolio));
  };
  const canAccess = (pageId, user = window.MBA_CURRENT_USER) => {
    if (pageId === 'home') return moduleAvailable(pageId, user);
    const permission = PAGE_PERMISSIONS[pageId];
    if (pageId === 'acordos') return Boolean((user?.permissions?.['pagamentos.view'] === true || user?.permissions?.['tutelas.view'] === true || user?.permissions?.['encerramentos.view'] === true) && moduleAvailable(pageId, user));
    return Boolean(permission && user?.permissions?.[permission] === true && moduleAvailable(pageId, user));
  };
  window.MBA_PORTFOLIO_POLICY = Object.freeze({ canAccess, moduleAvailable, getPortfolio, isEnter, PAGE_PERMISSIONS });
})();
