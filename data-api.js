(() => {
  'use strict';
  const localHost = ['localhost', '127.0.0.1'].includes(location.hostname);
  const baseUrl = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');
  const tokenKey = 'mba_session_token';
  const preview = window.MBA_LOCAL_PREVIEW && localHost;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const transientStatuses = new Set([502, 503, 504]);
  const sessionInvalidCodes = new Set(['AUTH_REQUIRED', 'SESSION_INVALID']);
  const userDetailCache = new Map();
  const taskProcessCache = new Map();
  const processToTask = new Map();
  const inFlightGets = new Map();
  const TASK_PROCESS_CACHE_MS = 15000;

  const getStoredToken = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  const clearStoredToken = () => {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
  };
  const cloneRows = rows => rows.map(row => ({ ...row }));

  function debugRequest(path, status, startedAt, attempt) {
    if (!preview && window.MBA_API_DEBUG !== true) return;
    const duration = Math.round(performance.now() - startedAt);
    console.debug(`[MBA API] ${path} -> ${status} (${duration}ms, tentativa ${attempt + 1})`);
  }

  function cachedUserDetail(path, method) {
    if (method !== 'GET') return null;
    const match = path.match(/^\/api\/users\/([^/?]+)$/);
    if (!match) return null;
    const cached = userDetailCache.get(match[1]);
    return cached ? { ...cached, effective_permissions: [...(cached.effective_permissions || [])] } : null;
  }

  function updateUserCache(path, method, data) {
    if (method === 'GET' && path === '/api/users' && Array.isArray(data)) {
      userDetailCache.clear();
      data.forEach(user => {
        if (user?.id) userDetailCache.set(String(user.id), user);
      });
      return;
    }
    if (method === 'GET') {
      const match = path.match(/^\/api\/users\/([^/?]+)$/);
      if (match && data?.id) userDetailCache.set(match[1], data);
      return;
    }
    if (path.startsWith('/api/users')) userDetailCache.clear();
  }

  function cacheTaskProcesses(taskId, rows) {
    if (!Array.isArray(rows)) return;
    const previous = taskProcessCache.get(taskId)?.rows || [];
    previous.forEach(row => {
      if (row?.id && processToTask.get(String(row.id)) === taskId) processToTask.delete(String(row.id));
    });
    const snapshot = cloneRows(rows);
    snapshot.forEach(row => {
      if (row?.id) processToTask.set(String(row.id), taskId);
    });
    taskProcessCache.set(taskId, {
      rows: snapshot,
      expiresAt: Date.now() + TASK_PROCESS_CACHE_MS,
    });
  }

  function cachedTaskProcesses(path, method) {
    if (method !== 'GET') return null;
    const match = path.match(/^\/api\/tasks\/([^/?]+)\/processes$/);
    if (!match) return null;
    const cached = taskProcessCache.get(match[1]);
    if (!cached || cached.expiresAt <= Date.now()) {
      if (cached) taskProcessCache.delete(match[1]);
      return null;
    }
    return cloneRows(cached.rows);
  }

  function updateTaskProcessCache(path, method, data) {
    if (method === 'GET') {
      const match = path.match(/^\/api\/tasks\/([^/?]+)\/processes$/);
      if (match && Array.isArray(data)) cacheTaskProcesses(match[1], data);
      return;
    }

    const analysis = path.match(/^\/api\/task-processes\/([^/?]+)\/(?:liminar|encerramento|bloqueio|citacao|comprovante_pagamento|agreement)-analysis$/);
    if (method === 'POST' && analysis) {
      const processId = analysis[1];
      const taskId = processToTask.get(processId);
      const cached = taskId ? taskProcessCache.get(taskId) : null;
      if (cached) {
        cached.rows = cached.rows.map(row => row.id === processId
          ? { ...row, status: 'completed', updated_at: new Date().toISOString() }
          : row);
        cached.expiresAt = Date.now() + TASK_PROCESS_CACHE_MS;
      }
      return;
    }

    const skipped = path.match(/^\/api\/task-processes\/([^/?]+)\/(?:skip|agreement-skip-next)$/);
    if (method === 'POST' && skipped) {
      const taskId = processToTask.get(skipped[1]);
      if (taskId) taskProcessCache.delete(taskId);
      return;
    }

    const taskMutation = path.match(/^\/api\/tasks\/([^/?]+)(?:\/upload)?$/);
    if (method !== 'GET' && taskMutation) taskProcessCache.delete(taskMutation[1]);
  }

  async function backendFetch(path, options = {}) {
    if (!/^\/(api|auth)\//.test(path)) throw new Error('Endereço da API inválido.');
    if (!baseUrl && !localHost) throw new Error('Endereço da API inválido.');

    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const token = getStoredToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const requestOptions = { ...options, headers, credentials: 'omit', redirect: 'error' };
    const bootstrapping = Boolean(token) && document.body.classList.contains('auth-loading');
    const maxAttempts = bootstrapping ? 2 : 1;
    const requestUrl = baseUrl ? baseUrl + path : path;
    let lastError;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const startedAt = performance.now();
      try {
        const response = await fetch(requestUrl, requestOptions);
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

  async function performRequest(path, options, method) {
    const tokenBeforeRequest = getStoredToken();
    const response = await backendFetch(path, options);
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const error = new Error(data?.error || data?.message || 'Não foi possível concluir a solicitação.');
      error.code = data?.code;
      error.status = response.status;

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
    updateUserCache(path, method, data);
    updateTaskProcessCache(path, method, data);
    return data;
  }

  async function request(path, options = {}) {
    if (preview && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const method = String(options.method || 'GET').toUpperCase();

    const userCached = cachedUserDetail(path, method);
    if (userCached) return userCached;
    const processesCached = cachedTaskProcesses(path, method);
    if (processesCached) return processesCached;

    if (method !== 'GET') return performRequest(path, options, method);

    if (inFlightGets.has(path)) return inFlightGets.get(path);
    const pending = performRequest(path, options, method);
    inFlightGets.set(path, pending);
    try {
      return await pending;
    } finally {
      if (inFlightGets.get(path) === pending) inFlightGets.delete(path);
    }
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