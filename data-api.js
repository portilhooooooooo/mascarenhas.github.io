(() => {
  'use strict';
  const baseUrl = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');
  const tokenKey = 'mba_session_token';
  const preview = window.MBA_LOCAL_PREVIEW && ['localhost', '127.0.0.1'].includes(location.hostname);
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const transientStatuses = new Set([502, 503, 504]);
  const sessionInvalidCodes = new Set(['AUTH_REQUIRED', 'SESSION_INVALID']);

  const getStoredToken = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  const clearStoredToken = () => {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
  };

  function debugRequest(path, status, startedAt, attempt) {
    if (!preview && window.MBA_API_DEBUG !== true) return;
    const duration = Math.round(performance.now() - startedAt);
    console.debug(`[MBA API] ${path} -> ${status} (${duration}ms, tentativa ${attempt + 1})`);
  }

  async function backendFetch(path, options = {}) {
    if (!baseUrl || !/^\/(api|auth)\//.test(path)) throw new Error('Endereço da API inválido.');
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const token = getStoredToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const requestOptions = { ...options, headers, credentials: 'omit', redirect: 'error' };
    const bootstrapping = Boolean(token) && document.body.classList.contains('auth-loading');
    // During bootstrap we tolerate one transient gateway/network failure. We do
    // not retry 401: authentication failures are deterministic and retries used
    // to amplify login races.
    const maxAttempts = bootstrapping ? 2 : 1;
    let lastError;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const startedAt = performance.now();
      try {
        const response = await fetch(baseUrl + path, requestOptions);
        debugRequest(path, response.status, startedAt, attempt);
        if (!transientStatuses.has(response.status) || attempt === maxAttempts - 1) return response;
      } catch (error) {
        lastError = error;
        if (attempt === maxAttempts - 1) throw error;
      }
      await sleep(250 * (attempt + 1));
    }
    throw lastError || new Error('Não foi possível acessar a API.');
  }

  async function request(path, options = {}) {
    if (preview && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const tokenBeforeRequest = getStoredToken();
    const response = await backendFetch(path, options);
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const error = new Error(data?.error || data?.message || 'Não foi possível concluir a solicitação.');
      error.code = data?.code;
      error.status = response.status;

      // Only explicit backend session codes can invalidate the browser session.
      // A 401 from another integration/proxy endpoint is not enough evidence to
      // log the user out.
      const sessionInvalid = response.status === 401
        && Boolean(tokenBeforeRequest)
        && sessionInvalidCodes.has(String(data?.code || ''));
      if (sessionInvalid && !document.body.classList.contains('auth-loading')) {
        clearStoredToken();
        window.dispatchEvent(new CustomEvent('mba:session-expired', {
          detail: { code: data?.code },
        }));
      }
      throw error;
    }
    return data;
  }

  async function createTaskWithImportedProcesses(payload, file) {
    if (!(file instanceof File) || !/\.(xlsx|csv)$/i.test(file.name)) throw new Error('Selecione uma planilha XLSX ou CSV.');
    const task = await request('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
    const upload = new FormData();
    upload.append('file', file);
    try {
      const result = await request(`/api/tasks/${task.id}/upload`, { method: 'POST', body: upload });
      return {
        task,
        rowsImported: result?.rows_imported || 0,
        rowsSkipped: result?.rows_failed || 0,
        rowsReceived: result?.rows_received || 0,
        workerImport: payload.type === 'acordos',
      };
    } catch (cause) {
      const error = new Error('A tarefa foi criada, mas a importação não terminou. Consulte a tarefa antes de reenviar.');
      error.code = 'TASK_IMPORT_PARTIAL';
      error.status = cause.status;
      throw error;
    }
  }

  window.MBA_API = {
    request,
    fetch: backendFetch,
    baseUrl,
    getAccessToken: async () => getStoredToken(),
  };
  window.MBA_AUTOMATION_API = window.MBA_API;
  window.MBA_TASK_IMPORT = { createTaskWithImportedProcesses };
})();
