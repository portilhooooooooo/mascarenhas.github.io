(() => {
  'use strict';
  const labels = {
    PENDING: 'Pendente', RUNNING: 'Em execução',
    DOCUMENTOS_ENVIADOS: 'Documentos enviados', ENVIADO: 'Enviado',
    DONE: 'Concluído', HUMAN_NECESSARY: 'Atuação humana',
  };
  const statusClass = value => String(value || '').toLowerCase().replace(/_/g, '-');
  const number = value => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
  const countLabel = (value, singular, plural) => {
    const amount = Number(value || 0);
    return `${number(amount)} ${amount === 1 ? singular : plural}`;
  };
  const dateTime = value => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short', timeStyle: 'short',
    }).format(date);
  };
  const textCell = (row, value) => {
    const cell = document.createElement('td');
    cell.textContent = value || '—';
    row.appendChild(cell);
    return cell;
  };
  const taskCell = (row, item) => {
    const cell = document.createElement('td');
    const link = document.createElement('a');
    link.className = 'protocolo-task-link';
    link.href = item.task_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Abrir tarefa';
    cell.appendChild(link);
    row.appendChild(cell);
  };
  function renderRows(target, rows, exceptions = false) {
    target.replaceChildren();
    if (!rows.length) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = exceptions ? 5 : 6;
      cell.textContent = exceptions ? 'Nenhuma exceção encontrada.' : 'Nenhuma execução encontrada.';
      row.appendChild(cell); target.appendChild(row); return;
    }
    rows.forEach(item => {
      const row = document.createElement('tr');
      textCell(row, item.cnj);
      if (!exceptions) {
        const cell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `protocolo-status ${statusClass(item.status)}`;
        badge.textContent = labels[item.status] || item.status;
        cell.appendChild(badge); row.appendChild(cell);
      }
      textCell(row, item.human_reason || item.error_code || '—');
      textCell(row, item.stage || '—');
      textCell(row, dateTime(item.updated_at));
      taskCell(row, item);
      target.appendChild(row);
    });
  }
  function documentImportText(documents) {
    if (!documents) return 'Nenhum lote carregado.';
    const stored = Number(documents.stored_documents || 0);
    const ignored = Number(documents.ignored_documents || 0);
    const failed = Number(documents.failed_rows || 0);
    const total = Number(documents.total_rows || 0);
    let text = `Último lote: ${countLabel(stored, 'documento armazenado', 'documentos armazenados')} · ${countLabel(ignored, 'ignorado', 'ignorados')}.`;
    if (failed > 0) {
      const scope = total > 0 ? `${number(failed)} de ${number(total)} linhas` : countLabel(failed, 'linha', 'linhas');
      text += ` Relação: ${scope} não ${failed === 1 ? 'foi processada' : 'foram processadas'} (arquivo não enviado neste lote ou linha com erro).`;
    }
    return text;
  }
  function renderSummary(summary) {
    const strip = document.querySelector('#protocolo-status-strip');
    strip.replaceChildren();
    Object.keys(labels).forEach(status => {
      const chip = document.createElement('span');
      chip.className = 'protocolo-status-chip';
      const label = document.createElement('span');
      label.textContent = labels[status];
      const count = document.createElement('strong');
      count.textContent = String(summary.statuses?.[status] || 0);
      chip.append(label, count); strip.appendChild(chip);
    });
    const control = summary.controladoria;
    const documents = summary.documents;
    document.querySelector('#protocolo-control-feedback').textContent = control
      ? `Última importação: ${control.protocolo_rows} tarefa(s) de protocolo · ${dateTime(control.completed_at || control.created_at)}`
      : 'Nenhuma importação carregada.';
    document.querySelector('#protocolo-documents-feedback').textContent = documentImportText(documents);
  }
  async function load() {
    const [summary, items, exceptions] = await Promise.all([
      window.MBA_API.request('/api/protocolo/summary'),
      window.MBA_API.request('/api/protocolo/items?limit=100'),
      window.MBA_API.request('/api/protocolo/items?status=HUMAN_NECESSARY&limit=100'),
    ]);
    renderSummary(summary);
    renderRows(document.querySelector('#protocolo-items-body'), items.rows || []);
    renderRows(document.querySelector('#protocolo-exceptions-body'), exceptions.rows || [], true);
  }
  async function submit(form, path, feedback, success, options = {}) {
    const button = form.querySelector('[type="submit"]');
    button.disabled = true; feedback.classList.remove('error');
    feedback.textContent = 'Importando e fazendo o matching...';
    try {
      const result = await window.MBA_API.request(path, { method: 'POST', body: new FormData(form) });
      const successMessage = success(result);
      feedback.textContent = successMessage;
      form.reset();
      await load();
      if (options.keepSuccess) feedback.textContent = successMessage;
    } catch (error) {
      feedback.classList.add('error');
      feedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  }
  document.querySelector('#protocolo-control-form')?.addEventListener('submit', event => {
    event.preventDefault();
    submit(event.currentTarget, '/api/protocolo/controladoria',
      document.querySelector('#protocolo-control-feedback'),
      result => `${result.protocol_tasks} tarefa(s) encontrada(s); ${result.reconciliation?.done || 0} concluída(s) por reconciliação.`);
  });
  document.querySelector('#protocolo-documents-form')?.addEventListener('submit', event => {
    event.preventDefault();
    submit(event.currentTarget, '/api/protocolo/documentos',
      document.querySelector('#protocolo-documents-feedback'),
      result => {
        const parts = [
          countLabel(result.stored, 'documento armazenado', 'documentos armazenados'),
          countLabel(result.ignored, 'ignorado', 'ignorados'),
        ];
        if (Number(result.missing || 0) > 0) {
          parts.push(countLabel(result.missing, 'referência sem arquivo neste lote', 'referências sem arquivo neste lote'));
        }
        if (Number(result.errors || 0) > 0) {
          parts.push(countLabel(result.errors, 'linha com erro', 'linhas com erro'));
        }
        if (Number(result.zipped || 0) > 0) {
          parts.push(countLabel(result.zipped, 'ZIP gerado', 'ZIPs gerados'));
        }
        return `Importação concluída: ${parts.join(' · ')}.`;
      },
      { keepSuccess: true });
  });
  document.querySelector('#protocolo-refresh')?.addEventListener('click', () => load().catch(error => {
    document.querySelector('#protocolo-control-feedback').textContent = error.message;
  }));
  document.querySelector('#protocolo-exceptions-download')?.addEventListener('click', async event => {
    event.preventDefault();
    try {
      const response = await window.MBA_API.fetch('/api/protocolo/exceptions.xlsx');
      if (!response.ok) throw new Error('Não foi possível baixar as exceções.');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url; link.download = 'excecoes_protocolo.xlsx'; link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error.message);
    }
  });
  window.addEventListener('mba:authenticated', event => {
    if (event.detail.permissions?.['automations.view']) load().catch(() => {});
  });
})();
