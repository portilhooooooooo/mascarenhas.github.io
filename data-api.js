(() => {
  'use strict';
  const db = window.MBA_SUPABASE;
  const apiBase = String(window.MBA_API_BASE_URL || '').trim().replace(/\/$/, '');

  function apiError(error, fallback = 'Não foi possível concluir a solicitação.') {
    const result = new Error(error?.message || fallback);
    result.code = error?.code;
    result.status = error?.status || (error?.code === '42501' ? 403 : undefined);
    return result;
  }
  function body(options) {
    if (!options?.body || options.body instanceof FormData) return {};
    return typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  }
  async function value(promise, fallback) {
    const result = await promise;
    if (result.error) throw apiError(result.error, fallback);
    return result.data;
  }
  async function backendOptions(options = {}) {
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    if (!(options.body instanceof FormData) && options.body !== undefined) headers['Content-Type'] = 'application/json';
    const operationalToken = window.sessionStorage.getItem('mba_task_worker_token');
    if (operationalToken) headers.Authorization = `Bearer ${operationalToken}`;
    else if (db) {
      const { data } = await db.auth.getSession();
      if (data.session?.access_token) headers.Authorization = `Bearer ${data.session.access_token}`;
    }
    return { ...options, headers, credentials: 'omit' };
  }
  async function backendFetch(path, options = {}) {
    if (!apiBase) throw apiError(null, 'A URL da API de automações não foi configurada.');
    return fetch(`${apiBase}${path}`, await backendOptions(options));
  }
  async function backendRequest(path, options = {}) {
    if (window.MBA_LOCAL_PREVIEW && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    const response = await backendFetch(path, options);
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const error = apiError(data, 'Automação temporariamente indisponível.');
      error.status = response.status;
      throw error;
    }
    return data;
  }
  async function requestAgreementWorkerUpload(taskId, file) {
    const path = `/api/tasks/${taskId}/upload`;
    const url = `${apiBase}${path}`;
    const { data, error: sessionError } = await db.auth.getSession();
    const accessToken = data?.session?.access_token;
    if (sessionError || !accessToken) {
      const error = new Error('Sua sessão expirou. Faça login novamente.');
      error.code = 'AUTH_SESSION_MISSING'; error.url = url;
      throw error;
    }
    const upload = new FormData(); upload.append('file', file);
    let response;
    try {
      response = await fetch(url, {
        method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: upload,
        credentials: 'omit',
      });
    } catch (error) {
      error.url = url;
      error.stage = 'agreement_worker_upload';
      throw error;
    }
    const rawBody = await response.text();
    let responseBody = rawBody;
    try { responseBody = rawBody ? JSON.parse(rawBody) : null; } catch (_error) { /* resposta não JSON */ }
    if (!response.ok) {
      const error = apiError(responseBody, 'Não foi possível iniciar a importação de Acordos.');
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = url;
      error.responseBody = responseBody;
      error.stage = 'agreement_worker_upload';
      throw error;
    }
    return responseBody;
  }

  async function effectivePermissions(profile) {
    const [permissions, roles, overrides] = await Promise.all([
      value(db.from('permissions').select('id,key,description,created_at').order('key')),
      value(db.from('role_permissions').select('permission_id,allowed').eq('role', profile.role)),
      value(db.from('user_permissions').select('permission_id,allowed').eq('user_id', profile.id)),
    ]);
    const roleMap = Object.fromEntries(roles.map((row) => [row.permission_id, Boolean(row.allowed)]));
    const overrideMap = Object.fromEntries(overrides.map((row) => [row.permission_id, Boolean(row.allowed)]));
    return permissions.map((permission) => {
      let allowed = Object.hasOwn(overrideMap, permission.id) ? overrideMap[permission.id] : Boolean(roleMap[permission.id]);
      let source = Object.hasOwn(overrideMap, permission.id) ? (allowed ? 'override_allow' : 'override_deny') : 'role';
      if (permission.key.startsWith('users.') && String(profile.email).toLowerCase() !== 'gabriel.portilho@mascarenhasbarbosa.com.br') { allowed = false; source = 'exclusive_policy'; }
      if (['task_only','task_worker'].includes(profile.role) && !['tasks.view','tasks.execute'].includes(permission.key)) { allowed = false; source = 'operational_scope'; }
      return { key: permission.key, allowed, source };
    });
  }

  async function users(path, options) {
    if (path === '/api/users' && (!options.method || options.method === 'GET')) {
      return value(db.from('profiles').select('*').order('created_at', { ascending: false }));
    }
    if (path === '/api/permissions') return value(db.from('permissions').select('id,key,description,created_at').order('key'));
    if (path === '/api/users' && options.method === 'POST') {
      const payload = body(options); const operational = ['task_only','task_worker'].includes(payload.role);
      const row = { id: crypto.randomUUID(), name: payload.name, email: String(payload.email || '').trim().toLowerCase(), role: payload.role,
        active: true, allowed_modules: operational ? (payload.allowed_modules || []) : [], task_access_enabled: operational && Boolean(payload.task_access_enabled),
        auth_provider: operational ? 'otp' : 'google', password_hash: null };
      return (await value(db.from('profiles').insert(row).select().single(), 'Não foi possível criar o perfil.'));
    }
    let match = path.match(/^\/api\/users\/([0-9a-f-]+)$/i);
    if (match && (!options.method || options.method === 'GET')) {
      const profile = await value(db.from('profiles').select('*').eq('id', match[1]).single());
      return { ...profile, otp_requests_24h: 0, otp_limit: 2, otp_limit_blocked: false, effective_permissions: await effectivePermissions(profile) };
    }
    if (match && options.method === 'PATCH') {
      const allowed = body(options); delete allowed.id; delete allowed.email; delete allowed.auth_provider; delete allowed.password_hash;
      return value(db.from('profiles').update(allowed).eq('id', match[1]).select().single());
    }
    match = path.match(/^\/api\/users\/([0-9a-f-]+)\/permissions$/i);
    if (match && options.method === 'PUT') {
      const rows = (body(options).permissions || []).map((item) => ({ user_id: match[1], permission_id: item.permission_id, allowed: Boolean(item.allowed) }));
      if (rows.length) await value(db.from('user_permissions').upsert(rows, { onConflict: 'user_id,permission_id' }));
      return { updated: rows.length };
    }
    return null;
  }

  const TASK_IMPORT_MAX_ROWS = 10000;
  const normalizedHeader = (value) => String(value || '').trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_');
  const readCsv = (text) => {
    const firstLine = String(text).split(/\r?\n/, 1)[0] || '';
    const delimiter = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
    const rows = []; let row = []; let value = ''; let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index]; const next = text[index + 1];
      if (character === '"' && quoted && next === '"') { value += '"'; index += 1; }
      else if (character === '"') quoted = !quoted;
      else if (character === delimiter && !quoted) { row.push(value); value = ''; }
      else if ((character === '\n' || character === '\r') && !quoted) {
        if (character === '\r' && next === '\n') index += 1;
        row.push(value); if (row.some((cell) => String(cell).trim())) rows.push(row); row = []; value = '';
      } else value += character;
    }
    row.push(value); if (row.some((cell) => String(cell).trim())) rows.push(row);
    return rows;
  };
  const recordsFromMatrix = (matrix) => {
    const [headers, ...values] = matrix;
    if (!headers?.length) return [];
    const keys = headers.map(normalizedHeader);
    return values.map((row) => Object.fromEntries(keys.map((key, index) => [key, row[index]])));
  };
  const fieldValue = (row, names) => {
    const key = Object.keys(row).find((candidate) => names.includes(candidate));
    return key ? row[key] : null;
  };
  async function parseTaskProcesses(file) {
    if (!(file instanceof File)) throw new Error('Selecione uma planilha XLSX ou CSV para importar.');
    const filename = String(file.name || '').toLowerCase(); let records;
    if (filename.endsWith('.csv')) records = recordsFromMatrix(readCsv(await file.text()));
    else if (filename.endsWith('.xlsx')) {
      if (!window.XLSX) throw new Error('O leitor de planilhas não foi carregado. Atualize a página e tente novamente.');
      const workbook = window.XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      records = sheet ? window.XLSX.utils.sheet_to_json(sheet, { defval: '' }).map((row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [normalizedHeader(key), value]))) : [];
    } else throw new Error('Envie um arquivo XLSX ou CSV.');
    if (records.length > TASK_IMPORT_MAX_ROWS) throw new Error('O arquivo excede o limite de 10.000 linhas.');
    const processes = records.map((row, index) => ({
      case_number: String(fieldValue(row, ['case_number','numero_processo','processo','cnj']) || '').trim(),
      party_name: String(fieldValue(row, ['party_name','parte','party','cliente','parte_autora']) || '').trim() || null,
      position: index + 1,
    }));
    const valid = processes.filter((process) => process.case_number);
    if (!valid.length) throw new Error('A planilha não possui uma coluna Processo, CNJ, case_number ou numero_processo preenchida.');
    return { rows: valid, skipped: processes.length - valid.length, received: processes.length };
  }
  async function requireAdministrativeSession() {
    if (window.MBA_LOCAL_PREVIEW) return { user: { id: 'preview' } };
    const { data, error } = await db.auth.getSession();
    if (error || !data.session) {
      const sessionError = new Error('Sua sessão expirou. Faça login novamente.');
      sessionError.code = 'AUTH_SESSION_MISSING'; throw sessionError;
    }
    return data.session;
  }
  async function insertTask(payload, profileId, totalProcesses = 0) {
    const participants = payload.participant_user_ids || [];
    const insertPayload = { ...payload, created_by: profileId, total_processes: totalProcesses };
    delete insertPayload.participant_user_ids;
    const task = await value(db.from('tasks').insert(insertPayload).select().single(), 'Não foi possível criar a tarefa.');
    if (participants.length) await value(db.rpc('frontend_assign_task_participants', { p_task_id: task.id, p_user_ids: participants }));
    return task;
  }
  async function createTaskWithImportedProcesses(payload, file) {
    if (payload.type === 'acordos') {
      if (!(file instanceof File)) throw new Error('Selecione uma planilha XLSX ou CSV para importar.');
      if (window.MBA_LOCAL_PREVIEW && window.MBA_MOCK_API) {
        const task = await window.MBA_MOCK_API.handle('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
        return { task, rowsImported: 0, rowsSkipped: 0, rowsReceived: 0, workerImport: true };
      }
      await requireAdministrativeSession();
      const profileId = await value(db.rpc('frontend_current_profile_id'), 'Sua conta não está autorizada para criar tarefas.');
      const task = await insertTask(payload, profileId);
      try {
        const result = await requestAgreementWorkerUpload(task.id, file);
        return { task, rowsImported: result?.rows_imported || 0, rowsSkipped: result?.rows_failed || 0, rowsReceived: (result?.rows_imported || 0) + (result?.rows_failed || 0), workerImport: true };
      } catch (error) {
        console.error('Erro na importação especializada de Acordos:', {
          error, url: error?.url || `${apiBase}/api/tasks/${task.id}/upload`,
          status: error?.status, statusText: error?.statusText, responseBody: error?.responseBody,
        });
        throw error;
      }
    }
    const parsed = await parseTaskProcesses(file);
    if (window.MBA_LOCAL_PREVIEW && window.MBA_MOCK_API) {
      const task = await window.MBA_MOCK_API.handle('/api/tasks', { method: 'POST', body: JSON.stringify(payload) });
      return { task, rowsImported: parsed.rows.length, rowsSkipped: parsed.skipped, rowsReceived: parsed.received };
    }
    await requireAdministrativeSession();
    const profileId = await value(db.rpc('frontend_current_profile_id'), 'Sua conta não está autorizada para criar tarefas.');
    if (!profileId) throw new Error('Sua conta não está autorizada para criar tarefas.');
    let task;
    try {
      task = await insertTask(payload, profileId, parsed.rows.length);
      for (let offset = 0; offset < parsed.rows.length; offset += 500) {
        const batch = parsed.rows.slice(offset, offset + 500).map((process) => ({
          ...process, task_id: task.id, assignee_id: task.responsible_id || null, status: 'pending',
        }));
        await value(db.from('task_processes').insert(batch), 'Não foi possível importar os processos da tarefa.');
      }
      return { task, rowsImported: parsed.rows.length, rowsSkipped: parsed.skipped, rowsReceived: parsed.received };
    } catch (error) {
      if (task?.id) {
        const rollback = await db.from('tasks').delete().eq('id', task.id);
        if (rollback.error) {
          const partial = new Error('A tarefa foi criada, mas houve uma falha ao importar os processos.');
          partial.code = 'TASK_IMPORT_PARTIAL'; partial.cause = error; throw partial;
        }
      }
      throw error;
    }
  }

  async function tasks(path, options) {
    if (path === '/api/tasks' && (!options.method || options.method === 'GET')) {
      const rows = await value(db.from('tasks').select('*,task_participants(user_id)').order('created_at', { ascending: false }));
      return rows.map((row) => ({ ...row, participant_user_ids: (row.task_participants || []).map((item) => item.user_id), task_participants: undefined }));
    }
    if (path === '/api/tasks' && options.method === 'POST') {
      const payload = body(options); const me = await value(db.rpc('frontend_current_profile_id'));
      const participants = payload.participant_user_ids || []; delete payload.participant_user_ids;
      const task = await value(db.from('tasks').insert({ ...payload, created_by: me }).select().single());
      if (participants.length) await value(db.rpc('frontend_assign_task_participants', { p_task_id: task.id, p_user_ids: participants }));
      return { ...task, participant_user_ids: participants };
    }
    let match = path.match(/^\/api\/tasks\/([0-9a-f-]+)$/i);
    if (match && options.method === 'PATCH') {
      const payload = body(options); const participants = payload.participant_user_ids; delete payload.participant_user_ids;
      let task = Object.keys(payload).length ? await value(db.from('tasks').update(payload).eq('id', match[1]).select().single()) : await value(db.from('tasks').select('*').eq('id', match[1]).single());
      if (participants) task = await value(db.rpc('frontend_assign_task_participants', { p_task_id: match[1], p_user_ids: participants }));
      return task;
    }
    match = path.match(/^\/api\/tasks\/([0-9a-f-]+)\/processes$/i);
    if (match) return value(db.from('task_processes').select('*').eq('task_id', match[1]).order('position'));
    match = path.match(/^\/api\/tasks\/([0-9a-f-]+)\/next$/i);
    if (match && options.method === 'POST') return value(db.rpc('frontend_claim_next_task_process', { p_task_id: match[1] }));
    match = path.match(/^\/api\/task-processes\/([0-9a-f-]+)\/skip$/i);
    if (match && options.method === 'POST') return value(db.rpc('frontend_skip_task_process', { p_task_process_id: match[1] }));
    match = path.match(/^\/api\/task-processes\/([0-9a-f-]+)\/agreement$/i);
    if (match) {
      const row = await value(db.from('task_processes').select('id,task_id,case_number,status,assignee_id,agreement_cases!inner(id,job_id,provision_amount)').eq('id', match[1]).single());
      const agreement = Array.isArray(row.agreement_cases) ? row.agreement_cases[0] : row.agreement_cases;
      delete row.agreement_cases; return { ...row, agreement_case_id: agreement.id, job_id: agreement.job_id, provision_amount: agreement.provision_amount };
    }
    return null;
  }

  function applyFilters(query, params, payment = false) {
    const mappings = payment
      ? { data_inicio:['gte','data_pagamento'],data_fim:['lte','data_pagamento'],credenciado:['eq','credenciado'],situacao:['eq','situacao'],tipo_pagamento:['eq','tipo_pagamento'],solicitante:['ilike','solicitante'] }
      : { processo:['ilike','case_number'],status:['eq','status'],resultado:['eq','result'],retorno:['ilike','return_reason'],causa_raiz:['eq','root_cause'],obf:['eq','obf_type'],responsavel:['ilike','responsible_name'],data_inicio:['gte','completed_at'],data_fim:['lte','completed_at'],task_id:['eq','task_id'],job_id:['eq','job_id'] };
    for (const [key,[operator,column]] of Object.entries(mappings)) if (params.get(key)) query = query[operator](column, operator === 'ilike' ? `%${params.get(key)}%` : params.get(key));
    return query;
  }
  async function agreements(path) {
    const [pathname, queryString=''] = path.split('?'); const params = new URLSearchParams(queryString);
    if (pathname === '/api/agreements') {
      const page = Math.max(1, Number(params.get('page') || 1)); const pageSize = Math.min(200, Math.max(1, Number(params.get('page_size') || 50)));
      let query = db.from('agreement_admin_view').select('*', { count: 'exact' }); query = applyFilters(query, params);
      const result = await query.order('created_at', { ascending: false }).range((page-1)*pageSize, page*pageSize-1);
      if (result.error) throw apiError(result.error); const total = result.count || 0;
      return { rows: result.data || [], page, page_size: pageSize, total, total_pages: total ? Math.ceil(total/pageSize) : 0 };
    }
    if (pathname === '/api/agreements/summary') {
      const args = { p_case_number:params.get('processo'),p_status:params.get('status'),p_result:params.get('resultado'),p_return_reason:params.get('retorno'),p_root_cause:params.get('causa_raiz'),p_obf_type:params.get('obf'),p_responsible:params.get('responsavel'),p_start_date:params.get('data_inicio'),p_end_date:params.get('data_fim'),p_task_id:params.get('task_id'),p_job_id:params.get('job_id') };
      return value(db.rpc('frontend_agreement_summary', args));
    }
    return null;
  }

  async function payments(path) {
    const [pathname, queryString=''] = path.split('?'); const params = new URLSearchParams(queryString);
    if (!['/api/pagamentos','/api/pagamentos/resumo','/api/pagamentos/credenciados','/api/pagamentos/situacoes'].includes(pathname)) return null;
    const current = await value(db.from('pagamentos_importacoes').select('*').eq('status','completed').eq('is_current',true).maybeSingle());
    if (!current) return pathname === '/api/pagamentos' ? { rows:[],page:1,page_size:25,total:0,total_pages:0,importacao:null } : pathname.endsWith('resumo') ? { cards:{} } : { rows:[] };
    if (pathname.endsWith('credenciados') || pathname.endsWith('situacoes')) {
      const field = pathname.endsWith('credenciados') ? 'credenciado' : 'situacao';
      const rows = await value(db.from('pagamentos').select(field).eq('importacao_id',current.id).not(field,'is',null));
      return { rows:[...new Set(rows.map((row) => row[field]).filter(Boolean))].sort((a,b) => a.localeCompare(b,'pt-BR')) };
    }
    if (pathname === '/api/pagamentos') {
      const page=Math.max(1,Number(params.get('page')||1)), pageSize=Math.min(200,Math.max(1,Number(params.get('page_size')||50)));
      let query=db.from('pagamentos').select('*',{count:'exact'}).eq('importacao_id',current.id); query=applyFilters(query,params,true);
      const result=await query.order('source_row_number').range((page-1)*pageSize,page*pageSize-1); if(result.error) throw apiError(result.error); const total=result.count||0;
      return {rows:result.data||[],page,page_size:pageSize,total,total_pages:total?Math.ceil(total/pageSize):0,importacao:current};
    }
    return value(db.rpc('frontend_payments_summary', {
      p_start_date:params.get('data_inicio'),p_end_date:params.get('data_fim'),p_credenciado:params.get('credenciado'),
      p_situacao:params.get('situacao'),p_tipo_pagamento:params.get('tipo_pagamento'),p_solicitante:params.get('solicitante'),
    }));
  }

  async function directRequest(path, options = {}) {
    if (!db) throw apiError(null, window.MBA_SUPABASE_ERROR || 'Supabase não configurado.');
    let result = await users(path, options); if (result !== null) return result;
    result = await tasks(path, options); if (result !== null) return result;
    result = await agreements(path, options); if (result !== null) return result;
    result = await payments(path, options); if (result !== null) return result;
    return null;
  }
  async function request(path, options = {}) {
    if (window.MBA_LOCAL_PREVIEW && window.MBA_MOCK_API) return window.MBA_MOCK_API.handle(path, options);
    if (window.sessionStorage.getItem('mba_task_worker_token')) return backendRequest(path, options);
    const direct = await directRequest(path, options);
    return direct !== null ? direct : backendRequest(path, options);
  }
  window.MBA_API = { request, fetch: backendFetch, baseUrl: apiBase, getAccessToken: async () => (await db?.auth.getSession())?.data?.session?.access_token || window.sessionStorage.getItem('mba_task_worker_token') || null };
  window.MBA_AUTOMATION_API = { request: backendRequest, fetch: backendFetch, baseUrl: apiBase };
  window.MBA_TASK_IMPORT = { createTaskWithImportedProcesses };
})();
