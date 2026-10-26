(() => {
  'use strict';
  const localHost = ['localhost', '127.0.0.1'].includes(location.hostname);
  const baseUrl = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');
  const tokenKey = 'mba_session_token';
  const portfolioKey = 'mba_portfolio_id';
  const defaultPortfolioId = 'agibank_enter';
  const preview = window.MBA_LOCAL_PREVIEW && localHost;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const transientStatuses = new Set([502, 503, 504]);
  const sessionInvalidCodes = new Set(['AUTH_REQUIRED', 'SESSION_INVALID']);
  const userDetailCache = new Map();
  const taskProcessCache = new Map();
  const processToTask = new Map();
  const inFlightGets = new Map();
  let authorizationEpoch=0;
  const TASK_PROCESS_CACHE_MS = 15000;

  const getStoredToken = () => localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
  const clearStoredToken = () => {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
  };
  const cloneRows = rows => rows.map(row => ({ ...row }));
  const getPortfolioId = () => localStorage.getItem(portfolioKey) || defaultPortfolioId;
  const setPortfolioId = (portfolioId) => {
    const value = String(portfolioId || '').trim().toLowerCase();
    if (!/^[a-z0-9_]+$/.test(value)) throw new Error('Carteira inválida.');
    if(value===getPortfolioId())return value;
    localStorage.setItem(portfolioKey, value);
    window.MBA_CURRENT_USER=null;
    taskProcessCache.clear();
    processToTask.clear();
    inFlightGets.clear();
    window.dispatchEvent(new CustomEvent('mba:portfolio-changed', { detail: { portfolio_id: value } }));
    // Complete every invalidation before starting the new identity request.
    window.dispatchEvent(new CustomEvent('mba:authorization-invalidated'));
    return value;
  };
  const configurePortfolios = (portfolios, fallback = defaultPortfolioId) => {
    const allowed = new Set((Array.isArray(portfolios) ? portfolios : []).map(item => String(item?.id || '')));
    let selected = getPortfolioId();
    if (!allowed.has(selected)) {
      selected = allowed.has(fallback) ? fallback : (allowed.values().next().value || defaultPortfolioId);
      localStorage.setItem(portfolioKey, selected);
    }
    return selected;
  };

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

    const completedProcess = path.match(/^\/api\/task-processes\/([^/?]+)\/(?:(?:liminar|defesa|encerramento|bloqueio|citacao|comprovante_pagamento|agreement)-analysis|protocol-collection(?:\/commit)?|protocol-collection-error)$/);
    if (method === 'POST' && completedProcess) {
      const processId = completedProcess[1];
      const taskId = processToTask.get(processId);
      const cached = taskId ? taskProcessCache.get(taskId) : null;
      if (cached) {
        const serverProcess = data?.process && String(data.process.id) === processId ? data.process : null;
        cached.rows = cached.rows.map(row => row.id === processId
          ? { ...row, ...(serverProcess || {}), status: serverProcess?.status || 'completed', updated_at: serverProcess?.updated_at || new Date().toISOString() }
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
    if (path.startsWith('/api/')) headers.set('X-Portfolio-Id', getPortfolioId());

    const requestOptions = { ...options, headers, credentials: 'omit', redirect: 'error' };
    const bootstrapping = Boolean(token) && document.body.classList.contains('auth-loading');
    const maxAttempts = 1; // Retry budget belongs to the calling flow.
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
    const portfolioBeforeRequest = getPortfolioId();
    const epochBeforeRequest=authorizationEpoch;
    if (path !== '/api/me' && path.startsWith('/api/') && (document.body.classList.contains('auth-unavailable')||document.body.classList.contains('auth-validating'))) throw Object.assign(new Error('Acesso aguardando validação.'),{code:'AUTH_TEMPORARILY_UNAVAILABLE',status:503});
    const response = await backendFetch(path, options);
    const data = response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
    if (epochBeforeRequest!==authorizationEpoch || tokenBeforeRequest !== getStoredToken() || (path !== '/api/me' && portfolioBeforeRequest !== getPortfolioId())) throw Object.assign(new Error('Resposta de contexto anterior descartada.'), {code:'STALE_IDENTITY'});
    if (!response.ok) {
      const error = new Error(data?.error || data?.message || 'Não foi possível concluir a solicitação.');
      error.code = data?.code;
      error.status = response.status;
      error.reason = ['session_replaced', 'session_revoked', 'session_expired'].includes(data?.reason) ? data.reason : 'invalid';

      const sessionInvalid = response.status === 401
        && Boolean(tokenBeforeRequest)
        && getStoredToken() === tokenBeforeRequest
        && sessionInvalidCodes.has(String(data?.code || ''));
      if (sessionInvalid && !document.body.classList.contains('auth-loading')) {
        clearStoredToken();
        window.dispatchEvent(new CustomEvent('mba:session-expired', {
          detail: Object.freeze({ code: data?.code, reason: error.reason }),
        }));
      }
      if (response.status === 403 && path !== '/api/me' && tokenBeforeRequest
        && ['PERMISSION_DENIED','PORTFOLIO_ACCESS_DENIED','PROFILE_NOT_AUTHORIZED'].includes(data?.code)) {
        window.MBA_CURRENT_USER = null;
        window.dispatchEvent(new Event('mba:logged-out'));
        window.dispatchEvent(new Event('mba:authorization-invalidated'));
      }
      throw error;
    }
    updateUserCache(path, method, data);
    updateTaskProcessCache(path, method, data);
    if(method!=='GET' && path.startsWith('/api/')){
      const module=path.startsWith('/api/task')?'tarefas':path.includes('/encerramentos')?'encerramentos':path.includes('/pagamentos')?'pagamentos':null;
      if(module)window.dispatchEvent(new CustomEvent('mba:server-data-changed',{detail:{module,portfolio_id:portfolioBeforeRequest}}));
    }
    return data;
  }

  const pendingWrites=new Map(),writeIntents=new Map();
  const writeIntentPrefix='mba_write_intent:';
  function clearWriteIntents(){
    pendingWrites.clear();writeIntents.clear();
    try{for(const key of Object.keys(sessionStorage))if(key.startsWith(writeIntentPrefix))sessionStorage.removeItem(key);}catch{}
  }
  // Only operation IDs and a payload checksum persist, alongside the separate
  // operational draft policy. No token, response, document or answer is stored here.
  async function operationalWrite(path,options,method){
    const user=window.MBA_CURRENT_USER;
    if(!user?.id)throw Object.assign(new Error('Acesso aguardando validação.'),{status:503,code:'AUTH_TEMPORARILY_UNAVAILABLE'});
    const epoch=authorizationEpoch,portfolio=getPortfolioId();
    const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])])):value;
    // A skip timestamp is telemetry; retain the same operation after F5/retry.
    const payload=path.endsWith('/skip')?{}:JSON.parse(options.body||'{}');
    const raw=JSON.stringify([path,canonical(payload)]);
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
    const checksum=[...new Uint8Array(bytes)].map(v=>v.toString(16).padStart(2,'0')).join('');
    if(epoch!==authorizationEpoch||portfolio!==getPortfolioId()||user.id!==window.MBA_CURRENT_USER?.id)throw Object.assign(new Error('Contexto alterado antes do salvamento.'),{code:'STALE_IDENTITY'});
    const storageKey=writeIntentPrefix+user.id+':'+portfolio+':'+checksum;
    if(pendingWrites.has(storageKey))return pendingWrites.get(storageKey);
    let intent=writeIntents.get(storageKey);
    if(!intent)try{const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');if(saved?.version===1&&/^[0-9a-f-]{36}$/.test(saved.id)&&Number.isFinite(saved.at)&&saved.at<=Date.now()+1000)intent=saved;}catch{}
    if(!intent)intent={version:1,id:crypto.randomUUID(),at:Date.now()};
    writeIntents.set(storageKey,intent);
    try{sessionStorage.setItem(storageKey,JSON.stringify(intent));}catch{/* The in-memory intent survives navigation; server receipts guard uncertain repeats. */}
    const headers=new Headers(options.headers||{});headers.set('Idempotency-Key',intent.id);
    const pending=performRequest(path,{...options,headers},method);pendingWrites.set(storageKey,pending);
    try{
      const result=await pending;writeIntents.delete(storageKey);
      try{sessionStorage.removeItem(storageKey);}catch{}
      return result;
    }finally{if(pendingWrites.get(storageKey)===pending)pendingWrites.delete(storageKey);}
  }

  async function request(path, options = {}) {
    if(path.startsWith('/api/') && path!=='/api/me' && (document.body.classList.contains('auth-unavailable')||document.body.classList.contains('auth-validating')))throw Object.assign(new Error('Acesso aguardando validação.'),{code:'AUTH_TEMPORARILY_UNAVAILABLE',status:503});
    if (preview && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const method = String(options.method || 'GET').toUpperCase();

    const userCached = cachedUserDetail(path, method);
    if (userCached) return userCached;
    const processesCached = cachedTaskProcesses(path, method);
    if (processesCached) return processesCached;

    if(window.MBA_CURRENT_USER?.runtime_features?.write_intents===true&&method==='POST'&&/^\/api\/task-processes\/[0-9a-f-]{36}\/(?:skip|liminar-validation|(?:liminar|defesa|encerramento|comprovante_pagamento)-analysis)$/.test(path))return operationalWrite(path,options,method);
    if (method !== 'GET') return performRequest(path, options, method);

    const requestKey = JSON.stringify([window.MBA_CURRENT_USER?.id||'unvalidated',window.MBA_SESSION_GENERATION||'bootstrap',authorizationEpoch,getPortfolioId(),path]);
    if (!options.signal && inFlightGets.has(requestKey)) return inFlightGets.get(requestKey);
    const pending = performRequest(path, options, method);
    if (!options.signal) inFlightGets.set(requestKey, pending);
    try {
      return await pending;
    } finally {
      if (inFlightGets.get(requestKey) === pending) inFlightGets.delete(requestKey);
    }
  }

  for (const event of ['mba:logged-out','mba:session-expired','mba:portfolio-changed','mba:profile-ready','mba:authenticated','mba:authorization-invalidated']) window.addEventListener(event, () => { authorizationEpoch+=1; userDetailCache.clear(); taskProcessCache.clear(); processToTask.clear(); inFlightGets.clear(); });

  for(const event of ['mba:logged-out','mba:session-expired','mba:portfolio-changed'])window.addEventListener(event,clearWriteIntents);
  let writeScope=null;
  for(const event of ['mba:profile-ready','mba:authenticated'])window.addEventListener(event,()=>{
    const user=window.MBA_CURRENT_USER;
    const next=user?JSON.stringify([user.id,getPortfolioId(),user.role,user.authorization_version,Object.entries(user.permissions||{}).sort()]):null;
    if((writeScope&&next!==writeScope)||user?.permissions?.['tasks.execute']!==true)clearWriteIntents();
    const own=writeIntentPrefix+user?.id+':'+getPortfolioId()+':';
    try{for(const key of Object.keys(sessionStorage))if(key.startsWith(writeIntentPrefix)&&!key.startsWith(own))sessionStorage.removeItem(key);}catch{}
    writeScope=next;
  });

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
    getPortfolioId,
    setPortfolioId,
    configurePortfolios,
  };
  window.MBA_AUTOMATION_API = window.MBA_API;
  window.MBA_TASK_IMPORT = { createTaskWithImportedProcesses };

  // One authenticated SSE stream per browser, shared by all modules.
  // There are no process details in these notifications: they invalidate
  // authorized views, which then fetch their own scoped data.
  let eventController = null;
  let eventRetryTimer = null;
  let eventRetryDelay = 1000;
  let eventSequence = 0;
  const lastRevisions = new Map();
  const realtimeModules = new Set(['tarefas','encerramentos','defesas','liminar','pagamentos','protocolos','processos','acordos']);

  function signalRealtime(module, portfolioId) {
    if (!realtimeModules.has(module) || portfolioId !== getPortfolioId()) return;
    window.dispatchEvent(new CustomEvent('mba:realtime-invalidate', {
      detail: { module, portfolio_id: portfolioId },
    }));
  }

  function stopRealtime() {
    eventSequence += 1;
    if (eventRetryTimer) clearTimeout(eventRetryTimer);
    eventRetryTimer = null;
    if (eventController) eventController.abort();
    eventController = null;
  }

  async function consumeRealtime(sequence, controller, portfolioId) {
    const response = await backendFetch('/api/events/stream', {
      method: 'GET', headers: { Accept: 'text/event-stream' },
      signal: controller.signal,
    });
    if (sequence !== eventSequence || controller.signal.aborted || portfolioId !== getPortfolioId()) return;
    if (!response.ok) {
      const problem = new Error('Realtime indisponível (' + response.status + ')');
      problem.status = response.status;
      throw problem;
    }
    if (!response.body) throw new Error('Streaming não suportado neste navegador.');
    eventRetryDelay = 1000;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffered = '';
    const handleEvent = (block) => {
      let event = '';
      const data = [];
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        if (line.startsWith('data:')) data.push(line.slice(5).trimStart());
      }
      if (!data.length) return;
      let payload;
      try { payload = JSON.parse(data.join('\n')); } catch (_) { return; }
      if (event === 'ready' && payload.revisions) {
        const next = payload.revisions;
        for (const [module, revision] of Object.entries(next)) {
          if (!realtimeModules.has(module) || !Number.isFinite(Number(revision))) continue;
          const key = portfolioId + ':' + module;
          const previous = lastRevisions.get(key);
          lastRevisions.set(key, Number(revision));
          if (previous != null && Number(revision) > previous) signalRealtime(module, portfolioId);
        }
      }
      if (event === 'invalidate' && realtimeModules.has(payload.module)) {
        const key = portfolioId + ':' + payload.module;
        const previous = lastRevisions.get(key);
        const revision = Number(payload.revision);
        if (!Number.isFinite(revision) || (previous != null && revision <= previous)) return;
        lastRevisions.set(key, revision);
        signalRealtime(payload.module, portfolioId);
      }
    };
    try {
      while (sequence === eventSequence && !controller.signal.aborted) {
        const { value, done } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
        if (buffered.length > 65536) throw new Error('Evento de atualização inválido.');
        let boundary;
        while ((boundary = buffered.indexOf('\n\n')) !== -1) {
          handleEvent(buffered.slice(0, boundary));
          buffered = buffered.slice(boundary + 2);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  function startRealtime() {
    stopRealtime();
    if (!getStoredToken() || !window.MBA_CURRENT_USER || document.hidden) return;
    const current = eventSequence;
    const controller = new AbortController();
    eventController = controller;
    const portfolioId = getPortfolioId();
    let reconnectAllowed = true;
    void consumeRealtime(current, controller, portfolioId).catch(error => {
      if (controller.signal.aborted) return;
      // 401/403: wait for refreshed profile rather than repeatedly requesting.
      if (error?.status === 401 || error?.status === 403) {
        reconnectAllowed = false;
        console.warn('Canal de eventos sem autorização; aguardando nova autenticação.');
        return;
      }
    }).finally(() => {
      if (!reconnectAllowed || current !== eventSequence || controller.signal.aborted || document.hidden || !getStoredToken()) return;
      eventController = null;
      eventRetryTimer = setTimeout(() => {
        eventRetryTimer = null;
        startRealtime();
      }, eventRetryDelay);
      eventRetryDelay = Math.min(eventRetryDelay * 2, 30000);
    });
  }

  window.addEventListener('mba:profile-ready', startRealtime);
  window.addEventListener('mba:portfolio-changed', startRealtime);
  window.addEventListener('mba:session-expired', stopRealtime);
  window.addEventListener('mba:logged-out', stopRealtime);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRealtime();
    else startRealtime();
  });
})();
