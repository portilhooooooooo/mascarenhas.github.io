/* Saudação contextual pelo horário local e perfil autenticado. */
(() => {
  'use strict';
  const heading = document.getElementById('home-greeting');
  const taskLink = document.getElementById('home-open-tasks');
  if (!heading) return;

  function selectGreeting(date, userId) {
    const hour = date.getHours();
    let greetings, period;
    if (hour >= 5 && hour < 9) {
      period = 'cedo'; greetings = ['Bom dia', 'Pronto(a) pra mais um dia', 'E aí', 'Oi'];
    } else if (hour >= 9 && hour < 12) {
      period = 'manha'; greetings = ['Bom dia', 'E aí', 'Oi'];
    } else if (hour >= 12 && hour < 18) {
      period = 'tarde'; greetings = ['Boa tarde', 'E aí', 'Oi'];
    } else if (hour >= 18 && hour < 22) {
      period = 'noite'; greetings = ['Boa noite', 'E aí', 'Oi'];
    } else {
      period = 'madrugada'; greetings = ['Boa noite', 'Ainda na ativa', 'Oi'];
    }
    // O mesmo usuário recebe a mesma saudação dentro do período e do dia.
    const seed = [userId, date.getFullYear(), date.getMonth(), date.getDate(), period].join(':');
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619) >>> 0;
    }
    return greetings[hash % greetings.length];
  }

  function render() {
    const user = window.MBA_CURRENT_USER;
    if (!user?.id) {
      heading.textContent = 'Bem-vindo ao Backoffice.';
      if (taskLink) taskLink.hidden = true;
      return;
    }
    const fallback = String(user.email || '').split('@')[0] || 'você';
    const firstName = String(user.name || user.nome || fallback).trim().split(/\s+/)[0] || 'você';
    const greeting = selectGreeting(new Date(), user.id);
    switch (greeting) {
      case 'Ainda na ativa': heading.textContent = `Ainda na ativa, ${firstName}?`; break;
      case 'Pronto(a) pra mais um dia': heading.textContent = `Pronto(a) pra mais um dia, ${firstName}?`; break;
      case 'E aí': heading.textContent = `E aí, ${firstName}?`; break;
      case 'Oi': heading.textContent = `Oi, ${firstName}!`; break;
      default: heading.textContent = `${greeting}, ${firstName}!`;
    }
    if (taskLink) taskLink.hidden = window.MBA_PORTFOLIO_POLICY?.canAccess('tarefas', user) !== true;
  }

  window.addEventListener('mba:profile-ready', render);
  window.addEventListener('mba:module-visibility-updated', render);
  window.addEventListener('mba:portfolio-changed', render);
  window.addEventListener('mba:route-changed', event => { if (event.detail?.pageId === 'home') render(); });
  window.addEventListener('mba:logged-out', render);
  window.addEventListener('mba:session-expired', render);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  render();
})();
