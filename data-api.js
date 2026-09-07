(() => {
  'use strict';
  const baseUrl = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');
  const tokenKey = 'mba_session_token';
  const preview = window.MBA_LOCAL_PREVIEW && ['localhost', '127.0.0.1'].includes(location.hostname);
  async function backendFetch(path, options = {}) {
    if (!baseUrl || !/^\/(api|auth)\//.test(path)) throw new Error('Endereço da API inválido.');
    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');
    if (options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
    const token = sessionStorage.getItem(tokenKey);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(baseUrl + path, { ...options, headers, credentials: 'omit', redirect: 'error' });
    if (token !== sessionStorage.getItem(tokenKey)) throw new Error('A sessão foi alterada. Atualize a página.');
    if (response.status === 423) {
      sessionStorage.removeItem(tokenKey); window.dispatchEvent(new Event('mba:account-locked'));
    }
    if (response.status === 401 && token) {
      sessionStorage.removeItem(tokenKey);
      window.dispatchEvent(new Event('mba:session-expired'));
    }
    return response;
  }
  async function request(path, options = {}) {
    if (preview && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const response = await backendFetch(path, options);
    let data = null;
    if (response.headers.get('content-type')?.includes('application/json')) { try { data=await response.json(); } catch (_) {} }
    if (!response.ok) {
      const messages = {401:'Sua sessão terminou. Entre novamente.',403:'Você não tem permissão para acessar este conteúdo.',423:'Sua conta está bloqueada. Entre em contato com o administrador.',400:'Verifique os dados e filtros informados.',422:'Verifique os campos informados.',409:'A operação não pôde ser concluída. Atualize os dados e tente novamente.',429:'Muitas tentativas. Aguarde antes de tentar novamente.'};
      const error = new Error(messages[response.status] || 'Serviço indisponível no momento. Tente novamente.');
      if (response.status===403 && window.MBA_CURRENT_USER) window.showPage?.('sem-acesso',false);
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
