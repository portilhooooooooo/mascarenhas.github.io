(() => {
      const dialog = document.getElementById('jobs-dialog');
      const title = document.getElementById('jobs-dialog-title');
      const state = document.getElementById('jobs-dialog-state');
      const tableWrap = document.getElementById('jobs-table-wrap');
      const tbody = document.getElementById('jobs-table-body');
      let activeIntegration = null;

      const integrationLabel = (key) => key === 'liminar' ? 'API de Liminar' : key === 'datajud' ? 'CNJ / DataJud' : 'Automação';
      const close = () => dialog?.close();
      document.getElementById('jobs-dialog-close')?.addEventListener('click', close);
      document.getElementById('jobs-dialog-footer-close')?.addEventListener('click', close);

      document.querySelectorAll('[data-integration-jobs]').forEach((button) => {
        button.addEventListener('click', () => {
          activeIntegration = button.dataset.integrationJobs;
          title.textContent = `Jobs · ${integrationLabel(activeIntegration)}`;
          tbody.innerHTML = '';
          tableWrap.hidden = true;
          state.hidden = false;
          state.innerHTML = '<i data-lucide="loader-circle" class="jobs-loading-icon"></i><strong>Consultando jobs</strong><span>Aguardando os dados da integração.</span>';
          if (window.lucide) window.lucide.createIcons();
          dialog.showModal();
          window.dispatchEvent(new CustomEvent('mba:jobs-request', { detail: { integration: activeIntegration } }));
        });
      });

      window.addEventListener('mba:jobs-loaded', (event) => {
        const detail = event.detail || {};
        if (!dialog?.open || detail.integration !== activeIntegration) return;
        const jobs = Array.isArray(detail.jobs) ? detail.jobs : [];
        tbody.innerHTML = '';
        if (!jobs.length) {
          tableWrap.hidden = true;
          state.hidden = false;
          state.innerHTML = '<i data-lucide="inbox"></i><strong>Nenhum job encontrado</strong><span>Não há execuções registradas para esta automação.</span>';
          if (window.lucide) window.lucide.createIcons();
          return;
        }
        state.hidden = true;
        tableWrap.hidden = false;
        for (const job of jobs) {
          const tr = document.createElement('tr');
          const id = String(job.id ?? job.job_id ?? '—');
          const status = String(job.status ?? '—');
          const statusKey = status.toUpperCase();
          const statusClass = statusKey.startsWith('CONCLU') || statusKey === 'DONE' ? 'done'
            : statusKey.startsWith('ERRO') || statusKey === 'ERROR' ? 'error'
            : statusKey ? 'running' : '';
          const done = job.done ?? job.processed ?? '—';
          const total = job.total ?? '—';
          const updated = String(job.updated_at ?? job.updatedAt ?? '—');
          const download = job.download_url ?? job.downloadUrl ?? '';
          const selectResult = activeIntegration === 'encerramentos' ? `<button class="jobs-download" type="button" data-select-encerramentos-job="${id}">Ver</button>` : '';
          tr.innerHTML = `<td>${id}</td><td><span class="job-status-chip ${statusClass}">${status}</span></td><td>${done} / ${total}</td><td>${updated}</td><td>${selectResult}${download ? `<a class="jobs-download" href="${download}" target="_blank" rel="noopener"><i data-lucide="download"></i>Baixar</a>` : !selectResult ? '<span class="jobs-no-download">—</span>' : ''}</td>`;
          tbody.appendChild(tr);
        }
        if (window.lucide) window.lucide.createIcons();
      });
      tbody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-select-encerramentos-job]');
        if (!button) return;
        window.dispatchEvent(new CustomEvent('mba:encerramentos-job-selected', { detail: { jobId: button.dataset.selectEncerramentosJob } }));
        close();
      });
    })();
  