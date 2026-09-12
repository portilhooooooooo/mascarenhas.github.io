(() => {
  'use strict';
  const baseUrl = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');
  const tokenKey = 'mba_session_token';
  const preview = window.MBA_LOCAL_PREVIEW && ['localhost', '127.0.0.1'].includes(location.hostname);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function backendFetch(path, options = {}) {
    if (!baseUrl || !/^\/(api|auth)\//.test(path)) throw new Error('Endereço da API inválido.');
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const token = sessionStorage.getItem(tokenKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const requestOptions = { ...options, headers, credentials: 'omit', redirect: 'error' };
    const bootstrapping = Boolean(token) && document.body.classList.contains('auth-loading');
    const maxAttempts = bootstrapping ? 3 : 1;
    let response;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      response = await fetch(baseUrl + path, requestOptions);
      if (response.status !== 401 || attempt === maxAttempts - 1) break;
      await sleep(250 * (attempt + 1));
    }

    if (
      response.status === 401 &&
      token &&
      !path.startsWith('/api/operational/') &&
      !document.body.classList.contains('auth-loading')
    ) {
      sessionStorage.removeItem(tokenKey);
      window.dispatchEvent(new Event('mba:session-expired'));
    }
    return response;
  }

  async function request(path, options = {}) {
    if (preview && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const response = await backendFetch(path, options);
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const error = new Error(data?.error || data?.message || 'Não foi possível concluir a solicitação.');
      error.code = data?.code; error.status = response.status;
      throw error;
    }
    return data;
  }

  async function createTaskWithImportedProcesses(payload, file) {
    if (!(file instanceof File) || !/\.(xlsx|csv)$/i.test(file.name)) throw new Error('Selecione uma planilha XLSX ou CSV.');
    const task = await request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
    const upload = new FormData(); upload.append('file', file);
    try {
      const result = await request(`/api/tasks/${task.id}/upload`, { method: 'POST', body: upload });
      return { task, rowsImported: result?.rows_imported || 0, rowsSkipped: result?.rows_failed || 0,
        rowsReceived: result?.rows_received || 0, workerImport: payload.type === 'acordos' };
    } catch (cause) {
      const error = new Error('A tarefa foi criada, mas a importação não terminou. Consulte a tarefa antes de reenviar.');
      error.code = 'TASK_IMPORT_PARTIAL'; error.status = cause.status; throw error;
    }
  }

  window.MBA_API = { request, fetch: backendFetch, baseUrl, getAccessToken: async () => sessionStorage.getItem(tokenKey) };
  window.MBA_AUTOMATION_API = window.MBA_API;
  window.MBA_TASK_IMPORT = { createTaskWithImportedProcesses };
})();
