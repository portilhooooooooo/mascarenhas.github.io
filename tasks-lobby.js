(() => {
  const labels = {
    pending: 'Pendente',
    in_progress: 'Em execução',
    completed: 'Concluído',
    inactive: 'Arquivado',
    cancelled: 'Cancelado',
  };

  function normalizeLobby() {
    document.querySelectorAll('#tasks-table-body .task-status').forEach((badge) => {
      const raw = badge.textContent.trim().toLowerCase();
      const key = Object.keys(labels).find((item) => item === raw) || raw.replace(/\s+/g, '_');
      if (labels[key]) badge.textContent = labels[key];
      badge.classList.remove('status-pending', 'status-in-progress', 'status-completed', 'status-inactive', 'status-cancelled');
      if (key === 'in_progress') badge.classList.add('status-in-progress');
      else if (key === 'completed') badge.classList.add('status-completed');
      else if (key === 'inactive') badge.classList.add('status-inactive');
      else if (key === 'cancelled') badge.classList.add('status-cancelled');
      else badge.classList.add('status-pending');
    });
  }

  const body = document.querySelector('#tasks-table-body');
  if (body) {
    const observer = new MutationObserver(normalizeLobby);
    observer.observe(body, { childList: true, subtree: true, characterData: true });
    normalizeLobby();
  }

  window.addEventListener('mba:authenticated', normalizeLobby);
})();
