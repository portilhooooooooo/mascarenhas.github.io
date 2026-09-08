(() => {
  if (!window.MBA_LOCAL_PREVIEW) return;

  const users = [
    { id: '10000000-0000-0000-0000-000000000001', name: 'Gabriel Portilho', email: 'gabriel.portilho@mascarenhasbarbosa.com.br', role: 'admin', active: true, task_access_enabled: false, allowed_modules: [] },
    { id: '10000000-0000-0000-0000-000000000002', name: 'Ana Souza', email: 'ana@mascarenhasbarbosa.com.br', role: 'task_only', active: true, task_access_enabled: true, allowed_modules: ['acordos'], otp_requests_24h: 1, otp_limit: 2, otp_limit_blocked: false },
    { id: '10000000-0000-0000-0000-000000000003', name: 'Vitória Lima', email: 'vitoria@mascarenhasbarbosa.com.br', role: 'task_worker', active: true, task_access_enabled: true, allowed_modules: ['acordos'], otp_requests_24h: 2, otp_limit: 2, otp_limit_blocked: true },
    { id: '10000000-0000-0000-0000-000000000004', name: 'João Martins', email: 'joao@local.preview', role: 'user', active: true, task_access_enabled: false },
    { id: '10000000-0000-0000-0000-000000000005', name: 'Maria Alves', email: 'maria@local.preview', role: 'task_worker', active: false, task_access_enabled: false },
  ];
  const permissionDefinitions = [
    ['dashboard.view', 'Visualizar Dashboard'], ['automations.view', 'Visualizar Automações'], ['automations.run', 'Executar automações'],
    ['automations.manage', 'Gerenciar automações'], ['automations.override_daily_limit', 'Ampliar limite diário de automações'], ['tutelas.view', 'Visualizar Tutelas'], ['encerramentos.view', 'Visualizar Encerramentos'],
    ['pagamentos.view', 'Visualizar Pagamentos'], ['pagamentos.import', 'Importar pagamentos'], ['agreements.view', 'Visualizar Acordos'],
    ['agreements.export', 'Exportar Acordos'], ['tasks.view', 'Visualizar Tarefas'], ['tasks.create', 'Criar tarefas'],
    ['tasks.assign', 'Atribuir tarefas'], ['tasks.execute', 'Executar tarefas'], ['tasks.manage', 'Gerenciar tarefas'],
    ['users.view', 'Visualizar Usuários'], ['users.manage', 'Gerenciar usuários'], ['settings.view', 'Visualizar Configurações'],
    ['settings.manage', 'Gerenciar configurações'],
  ].map(([key, description], index) => ({ id: `permission-${index + 1}`, key, description }));
  const permissionOverrides = Object.fromEntries(users.map((user) => [user.id, Object.fromEntries(permissionDefinitions.map((permission) => [permission.key,
    user.email === 'gabriel.portilho@mascarenhasbarbosa.com.br' || user.role === 'admin' || (['task_worker', 'task_only'].includes(user.role) && ['tasks.view', 'tasks.execute'].includes(permission.key))
  ]))]));
  const effectivePermissions = (user) => permissionDefinitions.map((permission) => ({ key: permission.key, allowed: Boolean(permissionOverrides[user.id]?.[permission.key]), source: 'override' }));
  const task = { id: '20000000-0000-0000-0000-000000000001', type: 'acordos', title: 'Acordos — Agosto', description: 'Saneamento da base de acordos recebida em agosto.', priority: 'high', status: 'in_progress', total_processes: 251, completed_processes: 12, updated_at: '2026-08-14T13:45:00-04:00' };
  task.participant_user_ids = [users[0].id, users[1].id];
  const otherTask = { id: '20000000-0000-0000-0000-000000000002', type: 'liminar', title: 'Analisar Pedido de Tutela', description: 'Análise humana dos resultados de tutela.', priority: 'medium', status: 'pending', total_processes: 30, completed_processes: 8, updated_at: '2026-08-14T12:20:00-04:00' };
  const processes = [
    { id: '30000000-0000-0000-0000-000000000001', task_id: task.id, case_number: '5007115-48.2025.8.21.0002', status: 'in_progress', assignee_id: users[0].id, provision_amount: '10000.00' },
    { id: '30000000-0000-0000-0000-000000000002', task_id: task.id, case_number: '5012844-20.2024.8.21.0001', status: 'pending', assignee_id: users[0].id, provision_amount: '7250.00' },
    { id: '30000000-0000-0000-0000-000000000003', task_id: task.id, case_number: '5039910-72.2023.8.21.7000', status: 'pending', assignee_id: users[0].id, provision_amount: '18400.00' },
  ];
  const agreements = [
    ['5007115-48.2025.8.21.0002','10000.00','completed','eligible','Apto para acordo.','revisao_juros','revisional','8500.00','10000.00','2026-08-21',5,30,'pre_agreement','2026-08-14T13:42:00-04:00','Gabriel Portilho'],
    ['5011932-09.2024.8.21.0001','7250.00','completed','ineligible','Possui sentença.',null,null,null,null,null,null,null,null,'2026-08-14T13:31:00-04:00','Ana Souza'],
    ['5039910-72.2023.8.21.7000','18400.00','pending',null,null,null,null,null,null,null,null,null,null,null,null],
    ['5009281-33.2025.8.21.0004','12600.00','completed','eligible','Apto para acordo.','cobranca_indevida',null,'14000.00','12600.00','2026-08-20',5,30,'pre_agreement','2026-08-13T16:08:00-04:00','Vitória Lima'],
    ['5023301-64.2022.8.21.0008','9300.00','completed','ineligible','Possui Termo de Impedimento 12.',null,null,null,null,null,null,null,null,'2026-08-13T15:21:00-04:00','João Martins'],
    ['5004408-15.2025.8.21.0010','22150.00','in_progress',null,null,null,null,null,null,null,null,null,null,null,'Gabriel Portilho'],
    ['5041002-88.2023.8.21.0001','5800.00','completed','eligible','Apto para acordo.','outros','exibicao','4900.00','5800.00','2026-08-19',5,30,'pre_agreement','2026-08-12T11:14:00-04:00','Ana Souza'],
    ['5001880-42.2024.8.21.0021','15000.00','pending',null,null,null,null,null,null,null,null,null,null,null,null],
  ].map((values, index) => ({
    id: `40000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`, task_id: task.id, job_id: '50000000-0000-0000-0000-000000000001',
    case_number: values[0], provision_amount: values[1], status: values[2], result: values[3], return_reason: values[4], root_cause: values[5], obf_type: values[6], suggested_amount: values[7], payment_deadline_date: values[9], payment_term_business_days: values[10], obligation_term_business_days: values[11], phase: values[12], completed_at: values[13], responsible_user: values[14] ? { name: values[14] } : null,
  }));

  const jsonBody = (options) => { try { return JSON.parse(options?.body || '{}'); } catch (_error) { return {}; } };
  const filterAgreements = (params) => agreements.filter((row) => {
    const contains = (value, query) => !query || String(value || '').toLowerCase().includes(query.toLowerCase());
    return contains(row.case_number, params.get('processo')) && (!params.get('status') || row.status === params.get('status'))
      && (!params.get('resultado') || row.result === params.get('resultado')) && contains(row.return_reason, params.get('retorno'))
      && contains(row.responsible_user?.name, params.get('responsavel')) && (!params.get('causa_raiz') || row.root_cause === params.get('causa_raiz'))
      && (!params.get('obf') || row.obf_type === params.get('obf'));
  });

  async function handle(path, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const url = new URL(path, 'http://local.preview');
    const method = (options.method || 'GET').toUpperCase();
    if (url.pathname === '/api/integrations/health') return {
      liminar: { online: true, busy: false },
      datajud: { online: true, busy: false },
      encerramentos: { online: true, busy: false },
    };
    if (url.pathname === '/api/users' && method === 'GET') return users;
    if (url.pathname === '/api/users' && method === 'POST') { const body = jsonBody(options); const user = { id: crypto.randomUUID(), name: body.name, email: body.email, role: body.role || 'user', active: true, task_access_enabled: ['task_only', 'task_worker'].includes(body.role), allowed_modules: body.allowed_modules || [], otp_requests_24h: 0, otp_limit: 2, otp_limit_blocked: false }; users.push(user); permissionOverrides[user.id] = Object.fromEntries(permissionDefinitions.map((permission) => [permission.key, ['task_only', 'task_worker'].includes(user.role) && ['tasks.view', 'tasks.execute'].includes(permission.key)])); return user; }
    if (url.pathname === '/api/permissions') return permissionDefinitions;
    const userDetail = url.pathname.match(/^\/api\/users\/([^/]+)$/);
    if (userDetail && method === 'GET') { const user = users.find((item) => item.id === userDetail[1]) || users[0]; return { ...user, effective_permissions: effectivePermissions(user) }; }
    if (userDetail && method === 'PATCH') { const user = users.find((item) => item.id === userDetail[1]); Object.assign(user, jsonBody(options)); return user; }
    if (/^\/api\/users\/[^/]+\/task-otp\/reset$/.test(url.pathname)) { const userId = url.pathname.split('/')[3]; const user = users.find((item) => item.id === userId); if (user) { user.otp_requests_24h = 0; user.otp_limit_blocked = false; } return { message: 'Novo OTP liberado.' }; }
    if (/^\/api\/users\/[^/]+\/permissions$/.test(url.pathname)) {
      const userId = url.pathname.split('/')[3]; const items = jsonBody(options).permissions || [];
      items.forEach((item) => { const definition = permissionDefinitions.find((permission) => permission.id === item.permission_id); if (definition) permissionOverrides[userId][definition.key] = Boolean(item.allowed); });
      const user = users.find((item) => item.id === userId) || users[0]; return { updated: items.length, effective_permissions: effectivePermissions(user) };
    }
    if (url.pathname === '/api/tasks' && method === 'GET') return [task, otherTask];
    if (url.pathname === '/api/tasks' && method === 'POST') return { ...task, ...jsonBody(options), id: crypto.randomUUID(), total_processes: 0, completed_processes: 0, status: 'pending' };
    const taskDetail = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
    if (taskDetail && method === 'PATCH') {
      const selected = [task, otherTask].find((item) => item.id === taskDetail[1]); const body = jsonBody(options); Object.assign(selected, body);
      if (body.participant_user_ids?.length && selected.id === task.id) {
        let pendingIndex = 0;
        processes.forEach((process) => { if (process.status === 'pending') process.assignee_id = body.participant_user_ids[pendingIndex++ % body.participant_user_ids.length]; });
      }
      return selected;
    }
    if (/\/api\/tasks\/[^/]+\/upload$/.test(url.pathname)) return { job_id: crypto.randomUUID(), upload_id: crypto.randomUUID(), status: 'queued' };
    if (url.pathname === `/api/tasks/${task.id}/processes`) return processes;
    if (url.pathname === `/api/tasks/${task.id}/next`) return processes.find((row) => row.status !== 'completed') || { process: null };
    const agreementDetail = url.pathname.match(/^\/api\/task-processes\/([^/]+)\/agreement$/);
    if (agreementDetail) return processes.find((row) => row.id === agreementDetail[1]) || null;
    const agreementComplete = url.pathname.match(/^\/api\/task-processes\/([^/]+)\/agreement-analysis$/);
    if (agreementComplete) {
      const process = processes.find((row) => row.id === agreementComplete[1]);
      const body = jsonBody(options); if (process) process.status = 'completed'; task.completed_processes += 1;
      const balanceExceeded = Number(body.outstanding_balance) > 15000;
      const blocked = body.has_judgment || body.has_impediment_12 || !body.has_defense_presented || balanceExceeded;
      const provision = Number(process?.provision_amount); const requested = Number(body.suggested_amount);
      const suggested_amount = blocked || !Number.isFinite(requested) ? body.suggested_amount : String(Math.min(requested, provision));
      const deadline = new Date(); deadline.setDate(deadline.getDate() + 30);
      return { ...body, suggested_amount: blocked ? null : suggested_amount, offer_amount: blocked ? null : suggested_amount, outstanding_balance: body.outstanding_balance, case_number: process?.case_number, provision_amount: process?.provision_amount, result: blocked ? 'ineligible' : 'eligible', return_reason: body.has_judgment ? 'Possui sentença.' : body.has_impediment_12 ? 'Possui Termo de Impedimento 12. Abrir MAN no CPJ para manifestarmos o documento.' : !body.has_defense_presented ? 'Não possui defesa apresentada nos autos.' : balanceExceeded ? 'Saldo devedor superior a R$ 15.000,00.' : 'Apto para acordo.', payment_deadline_date: blocked ? null : deadline.toISOString().slice(0, 10), payment_term_business_days: blocked ? null : 30, obligation_term_business_days: blocked ? null : 30, phase: blocked ? null : 'pre_agreement', management_alert: !blocked && requested > provision ? 'Oferecemos o valor da provisão. Caso seja um caso sensível, alertar a gestão.' : undefined };
    }
    if (/\/api\/task-processes\/[^/]+\/skip$/.test(url.pathname)) {
      const id = url.pathname.split('/')[3]; const index = processes.findIndex((row) => row.id === id); const process = processes[index];
      if (process) { process.status = 'pending'; processes.splice(index, 1); processes.push(process); }
      return process || { status: 'pending' };
    }
    if (url.pathname === '/api/agreements') {
      const filtered = filterAgreements(url.searchParams); const page = Number(url.searchParams.get('page') || 1); const pageSize = Number(url.searchParams.get('page_size') || 20); const start = (page - 1) * pageSize;
      return { rows: filtered.slice(start, start + pageSize), page, page_size: pageSize, total: filtered.length, total_pages: Math.ceil(filtered.length / pageSize) };
    }
    if (url.pathname === '/api/agreements/summary') {
      const filtered = filterAgreements(url.searchParams); const suggested = filtered.filter((row) => row.suggested_amount != null).map((row) => Number(row.suggested_amount)).filter(Number.isFinite);
      return { total: filtered.length, pending: filtered.filter((row) => row.status === 'pending').length, completed: filtered.filter((row) => row.status === 'completed').length, eligible: filtered.filter((row) => row.result === 'eligible').length, ineligible: filtered.filter((row) => row.result === 'ineligible').length, average_suggested_amount: suggested.length ? String(suggested.reduce((sum, value) => sum + value, 0) / suggested.length) : null };
    }
    if (url.pathname === '/api/pagamentos/resumo') return { cards: { total_pago: 45800, quantidade_pagamentos: 9, ticket_medio: 5088.89, tempo_medio_pagamento_dias: 6.4, credenciados_ativos: 3 } };
    if (url.pathname === '/api/pagamentos') return { rows: [{ pasta: 'PAG-1001', credenciado: 'Escritório Norte', solicitante: 'Marina Alves', tipo_pagamento: 'Acordo', valor: 5200, situacao: 'Pago', data_aprovacao: '2026-08-02', data_pagamento: '2026-08-08', tempo_pagamento_dias: 6 }], page: 1, page_size: 25, total: 1, total_pages: 1 };
    if (url.pathname === '/api/pagamentos/credenciados') return { rows: ['Escritório Norte'] };
    if (url.pathname === '/api/pagamentos/situacoes') return { rows: ['Pago', 'Pendente'] };
    if (url.pathname === '/api/pagamentos/importar') return { importacao: { id: crypto.randomUUID(), valid_rows: 1 } };
    throw Object.assign(new Error('Endpoint indisponível na prévia local.'), { code: 'MOCK_NOT_FOUND', status: 404 });
  }

  window.MBA_MOCK_API = { handle, agreements, users, task };
})();
