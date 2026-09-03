const navItems = [...document.querySelectorAll('.nav-item')];
const pages = [...document.querySelectorAll('.page')];

const pageRoutes = { acordos: 'acordos', tarefas: 'tarefas', 'acordo-execucao': 'tarefas/acordos' };
function showPage(pageId, updateRoute = true) {
  pages.forEach((page) => page.classList.toggle('active', page.id === pageId));
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.page === pageId));
  if (updateRoute && pageRoutes[pageId]) {
    const target = window.MBA_LOCAL_PREVIEW ? `#/${pageRoutes[pageId]}` : `/${pageRoutes[pageId]}`;
    if (`${location.pathname}${location.hash}` !== target) history.pushState({ pageId }, '', target);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.showPage = showPage;

function restorePageRoute() {
  const route = (location.hash.replace(/^#\//, '') || location.pathname.replace(/^\//, '')).replace(/\/$/, '');
  const pageId = Object.entries(pageRoutes).find(([, value]) => value === route)?.[0];
  const targetPage = pageId ? document.getElementById(pageId) : null;
  if (pageId && targetPage && !targetPage.hidden) showPage(pageId, false);
}
window.addEventListener('popstate', restorePageRoute);
window.addEventListener('hashchange', restorePageRoute);
window.restorePageRoute = restorePageRoute;

const appShell = document.querySelector('.app-shell');
const sidebarToggle = document.querySelector('#sidebar-toggle');
function setSidebarCollapsed(collapsed) {
  appShell?.classList.toggle('sidebar-collapsed', collapsed);
  if (!sidebarToggle) return;
  sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
  sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
  sidebarToggle.innerHTML = `<i data-lucide="${collapsed ? 'panel-left-open' : 'panel-left-close'}"></i>`;
  window.localStorage.setItem('mba-sidebar-collapsed', collapsed ? '1' : '0');
  window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
}
setSidebarCollapsed(window.localStorage.getItem('mba-sidebar-collapsed') === '1');
sidebarToggle?.addEventListener('click', () => setSidebarCollapsed(!appShell.classList.contains('sidebar-collapsed')));

navItems.forEach((item) => item.addEventListener('click', () => showPage(item.dataset.page)));
document.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => showPage(button.dataset.go)));
document.querySelectorAll('.execute-button').forEach((button) => button.addEventListener('click', () => showPage('tarefa-analise')));

const decisionInputs = [...document.querySelectorAll('input[name="decision"]')];
const notes = document.querySelector('#task-notes');
const notesRequirement = document.querySelector('#notes-requirement');
const notesCount = document.querySelector('#notes-count');

decisionInputs.forEach((input) => input.addEventListener('change', () => {
  document.querySelector('.analysis-error-button')?.removeAttribute('data-selected');
  const isError = input.value === 'erro';
  notes.required = isError;
  notesRequirement.textContent = isError ? '(obrigatório para erro)' : '(opcional)';
}));

notes.addEventListener('input', () => { notesCount.textContent = notes.value.length; });

let currentTask = null;
let currentProcess = null;

document.querySelector('.analysis-error-button')?.addEventListener('click', () => {
  decisionInputs.forEach((input) => { input.checked = false; });
  document.querySelector('.analysis-error-button').dataset.selected = 'true';
  notes.required = true;
  notesRequirement.textContent = '(obrigatório para erro)';
  notes.focus();
});

document.querySelector('#save-next').addEventListener('click', async () => {
  const selectedDecision = document.querySelector('input[name="decision"]:checked');
  const decision = document.querySelector('.analysis-error-button')?.dataset.selected === 'true' ? 'erro' : selectedDecision?.value;
  if (!decision) return;
  if (decision === 'erro' && !notes.value.trim()) {
    notes.setCustomValidity('A observação é obrigatória quando o resultado for Erro.');
    notes.reportValidity();
    return;
  }
  notes.setCustomValidity('');
  if (!currentProcess || !window.MBA_API) return;
  try {
    await window.MBA_AUTOMATION_API.request(`/api/task-processes/${currentProcess.id}/${currentTask.type}-analysis`, { method: 'POST', body: JSON.stringify({ decision, notes: notes.value.trim() || null }) });
    await openTask(currentTask);
  } catch (error) { window.alert(error.message); }
});

// Contrato preparado para a futura integração com Supabase.
// A camada de dados poderá substituir estes valores sem alterar os componentes visuais.
window.BACKOFFICE_DATA_SCHEMA = Object.freeze({
  task: ['id', 'title', 'description', 'priority', 'status', 'deadline_at', 'assignee_id', 'updated_at'],
  taskProcess: ['id', 'task_id', 'case_number', 'party_name', 'status'],
  liminarAnalysis: ['id', 'task_process_id', 'analyst_id', 'decision', 'notes', 'created_at', 'updated_at'],
});

const taskDialog = document.querySelector('#task-dialog');
document.querySelector('#new-task-button')?.addEventListener('click', () => taskDialog.showModal());
document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => taskDialog.close()));

function escapeHtml(value) {
  const element = document.createElement('span'); element.textContent = value ?? ''; return element.innerHTML;
}

let usersCache = [];
let tasksCache = [];
let paymentFilterTimer = null;
let permissionCatalog = [];
let selectedUser = null;
let authenticatedUser = null;
const roleLabels = { admin: 'Administrador', gestor: 'Gestor', user: 'Usuário', task_only: 'Task only', task_worker: 'Operacional' };
const exclusiveUsersEmail = 'gabriel.portilho@mascarenhasbarbosa.com.br';
const permissionSections = { dashboard: 'Dashboard', automations: 'Automações', tutelas: 'Tutelas', encerramentos: 'Encerramentos', pagamentos: 'Pagamentos', agreements: 'Acordos', tasks: 'Tarefas', users: 'Usuários', settings: 'Configurações' };
const permissionSectionOrder = ['dashboard', 'automations', 'tutelas', 'encerramentos', 'pagamentos', 'agreements', 'tasks', 'users', 'settings'];

function userInitials(user) {
  return String(user.name || user.email || 'U').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'U';
}

function filteredUsers() {
  const search = document.querySelector('#users-search')?.value.trim().toLowerCase() || '';
  const role = document.querySelector('#users-role-filter')?.value || '';
  const status = document.querySelector('#users-status-filter')?.value || '';
  return usersCache.filter((user) => {
    const matchesSearch = !search || `${user.name || ''} ${user.email || ''}`.toLowerCase().includes(search);
    const matchesRole = !role || user.role === role;
    const matchesStatus = !status || (status === 'active' ? user.active : !user.active);
    return matchesSearch && matchesRole && matchesStatus;
  });
}

function renderUsers() {
  const container = document.querySelector('#users-table-body');
  if (!container) return;
  const users = filteredUsers();
  container.innerHTML = users.map((user) => {
    const permissionCount = Object.values(user.permission_map || {}).filter(Boolean).length;
    return `<tr data-user-id="${user.id}" class="${selectedUser?.id === user.id ? 'selected-user' : ''}">
      <td><div class="user-cell-v2"><span class="user-avatar-v2">${escapeHtml(userInitials(user))}</span><div><strong>${escapeHtml(user.name || 'Sem nome')}</strong><small>${escapeHtml(user.email)}</small></div></div></td>
      <td><span class="role-pill ${user.role === 'admin' ? 'admin' : ''}">${escapeHtml(roleLabels[user.role] || user.role)}</span></td>
      <td><span class="user-status-v2 ${user.active ? '' : 'blocked'}">${user.active ? 'Ativo' : 'Bloqueado'}</span></td>
      <td><span class="access-pill ${permissionCount ? 'allowed' : ''}">${user.otp_limit_blocked ? 'OTP bloqueado' : permissionCount ? `${permissionCount} liberadas` : 'Sem acesso'}</span></td>
      <td><button type="button" class="user-actions-v2" aria-label="Selecionar usuário"><i data-lucide="chevron-right"></i></button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>';
  document.querySelector('#users-total').textContent = usersCache.length;
  document.querySelector('#users-active').textContent = usersCache.filter((user) => user.active).length;
  document.querySelector('#users-authorized').textContent = usersCache.filter((user) => Object.values(user.permission_map || {}).some(Boolean)).length;
  lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
}

function renderPermissionEditor(user) {
  const editor = document.querySelector('#permissions-editor');
  if (!editor || !authenticatedUser?.is_master_admin) return;
  editor.hidden = false;
  document.querySelector('#selected-user-avatar').textContent = userInitials(user);
  document.querySelector('#selected-user-name').textContent = user.name || 'Sem nome';
  document.querySelector('#selected-user-email').textContent = user.email;
  document.querySelector('#selected-user-role').value = user.role;
  document.querySelector('#selected-user-active').checked = Boolean(user.active);
  document.querySelector('#selected-user-task-access').checked = Boolean(user.task_access_enabled);
  const operational = ['task_only', 'task_worker'].includes(user.role);
  document.querySelector('#selected-user-modules').hidden = !operational;
  document.querySelectorAll('#selected-user-modules input').forEach((input) => {
    input.checked = user.role === 'task_only' ? input.value === 'acordos' : (user.allowed_modules || []).includes(input.value);
    input.disabled = user.role === 'task_only';
  });
  document.querySelector('#selected-user-otp-status').textContent = user.role === 'task_only' ? 'Acesso temporário por e-mail, restrito a Tarefas de Acordo.' : operational ? `${user.otp_requests_24h || 0} de ${user.otp_limit || 2} códigos solicitados na janela atual${user.otp_limit_blocked ? ' · limite atingido' : ''}.` : '';
  document.querySelector('#reset-task-otp').hidden = user.role !== 'task_worker';
  const canReceiveUsersAccess = String(user.email || '').trim().toLowerCase() === exclusiveUsersEmail;
  const effective = Object.fromEntries((user.effective_permissions || []).map((item) => [item.key, item]));
  const groups = permissionCatalog.reduce((result, permission) => {
    const section = permission.key.split('.')[0];
    (result[section] ||= []).push(permission);
    return result;
  }, {});
  document.querySelector('#permission-grid').innerHTML = permissionSectionOrder.filter((section) => groups[section]?.length).map((section) => `<div class="permission-edit-card"><h3>${escapeHtml(permissionSections[section] || section)}</h3>${groups[section].map((permission) => {
    const state = effective[permission.key];
    const exclusive = permission.key.startsWith('users.') && !canReceiveUsersAccess;
    const taskOnlyRestricted = ['task_only', 'task_worker'].includes(user.role) && !['tasks.view', 'tasks.execute'].includes(permission.key);
    const locked = exclusive || taskOnlyRestricted;
    const lockLabel = exclusive ? 'Exclusivo' : taskOnlyRestricted ? 'Bloqueado para Task only' : '';
    return `<label class="permission-toggle ${locked ? 'permission-locked' : ''}" title="${exclusive ? 'Acesso exclusivo de ' + exclusiveUsersEmail : taskOnlyRestricted ? 'O perfil Task only acessa somente visualizar e executar Tarefas' : 'Origem atual: ' + (state?.source || 'sem regra')}"><span>${escapeHtml(permission.description || permission.key)}${locked ? `<small>${lockLabel}</small>` : ''}</span><input type="checkbox" data-permission-id="${permission.id}" data-permission-key="${escapeHtml(permission.key)}" ${state?.allowed ? 'checked' : ''} ${locked ? 'disabled' : ''}><span class="permission-switch"></span></label>`;
  }).join('')}</div>`).join('');
}

async function selectUser(userId) {
  const user = await window.MBA_API.request(`/api/users/${userId}`);
  selectedUser = user;
  renderUsers();
  renderPermissionEditor(user);
}

async function loadUsers() {
  const loading = document.querySelector('#users-loading');
  if (!loading || !window.MBA_API) return;
  loading.hidden = false;
  try {
    const [users, permissions] = await Promise.all([
      window.MBA_API.request('/api/users'),
      window.MBA_API.request('/api/permissions'),
    ]);
    permissionCatalog = permissions;
    usersCache = await Promise.all(users.map(async (user) => {
      try {
        const detail = await window.MBA_API.request(`/api/users/${user.id}`);
        return { ...user, effective_permissions: detail.effective_permissions, permission_map: Object.fromEntries((detail.effective_permissions || []).map((item) => [item.key, item.allowed])) };
      } catch (_error) { return { ...user, permission_map: {} }; }
    }));
    loading.hidden = true;
    renderUsers();
  } catch (error) {
    loading.querySelector('strong').textContent = error.code === 'PERMISSION_DENIED' ? 'Sem permissão para visualizar usuários' : 'Não foi possível carregar usuários';
    loading.querySelector('span').textContent = error.message;
  }
}

document.querySelector('#users-table-body')?.addEventListener('click', (event) => {
  const row = event.target.closest('[data-user-id]');
  if (row) selectUser(row.dataset.userId).catch((error) => window.alert(error.message));
});
['#users-search', '#users-role-filter', '#users-status-filter'].forEach((selector) => {
  document.querySelector(selector)?.addEventListener(selector === '#users-search' ? 'input' : 'change', renderUsers);
});

document.querySelector('#save-user-permissions')?.addEventListener('click', async (event) => {
  if (!selectedUser) return;
  const button = event.currentTarget;
  button.disabled = true;
  try {
    const selectedRole = document.querySelector('#selected-user-role').value;
    const allowedModules = selectedRole === 'task_only' ? ['acordos'] : [...document.querySelectorAll('#selected-user-modules input:checked')].map((input) => input.value);
    await window.MBA_API.request(`/api/users/${selectedUser.id}`, { method: 'PATCH', body: JSON.stringify({ role: document.querySelector('#selected-user-role').value, active: document.querySelector('#selected-user-active').checked, task_access_enabled: document.querySelector('#selected-user-task-access').checked, allowed_modules: allowedModules }) });
    const permissions = [...document.querySelectorAll('[data-permission-id]')].map((input) => ({ permission_id: input.dataset.permissionId, allowed: input.checked }));
    await window.MBA_API.request(`/api/users/${selectedUser.id}/permissions`, { method: 'PUT', body: JSON.stringify({ permissions }) });
    button.textContent = 'Alterações salvas';
    await loadUsers();
    await selectUser(selectedUser.id);
    setTimeout(() => { button.textContent = 'Salvar alterações'; }, 1600);
  } catch (error) { window.alert(error.message); } finally { button.disabled = false; }
});

const userCreateDialog = document.querySelector('#user-create-dialog');
document.querySelector('#invite-user-button')?.addEventListener('click', () => userCreateDialog.showModal());
document.querySelectorAll('[data-close-user-create]').forEach((button) => button.addEventListener('click', () => userCreateDialog.close()));
document.querySelector('#user-create-role')?.addEventListener('change', (event) => {
  const operational = ['task_only', 'task_worker'].includes(event.target.value);
  document.querySelector('#user-create-email-field input').required = true;
  document.querySelector('#user-create-modules').hidden = !operational;
  document.querySelector('#user-create-task-access').hidden = !operational;
  document.querySelectorAll('#user-create-modules input').forEach((input) => {
    input.checked = event.target.value === 'task_only' && input.value === 'acordos';
    input.disabled = event.target.value === 'task_only';
  });
});
document.querySelector('#selected-user-role')?.addEventListener('change', (event) => {
  document.querySelector('#selected-user-modules').hidden = !['task_only', 'task_worker'].includes(event.target.value);
  document.querySelectorAll('#selected-user-modules input').forEach((input) => {
    if (event.target.value === 'task_only') input.checked = input.value === 'acordos';
    input.disabled = event.target.value === 'task_only';
  });
});
document.querySelector('#user-create-form')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const errorBox = document.querySelector('#user-create-error'); const submit = form.querySelector('[type="submit"]');
  const operational = ['task_only', 'task_worker'].includes(form.elements.role.value);
  const payload = { role: form.elements.role.value, name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), allowed_modules: form.elements.role.value === 'task_only' ? ['acordos'] : [...form.querySelectorAll('[name="allowed_modules"]:checked')].map((input) => input.value), task_access_enabled: operational && form.elements.task_access_enabled.checked };
  submit.disabled = true; errorBox.hidden = true;
  try { await window.MBA_API.request('/api/users', { method: 'POST', body: JSON.stringify(payload) }); form.reset(); document.querySelector('#user-create-modules').hidden = true; document.querySelector('#user-create-task-access').hidden = true; userCreateDialog.close(); await loadUsers(); window.alert(payload.role === 'task_only' ? 'Acesso temporário criado para Tarefas de Acordo.' : 'Usuário administrativo autorizado. Ele já pode entrar com a conta Google cadastrada.'); }
  catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; } finally { submit.disabled = false; }
});

const taskLabels = { liminar: 'Analisar Pedido de Tutela', encerramento: 'Analisar Indício de Encerramento', bloqueio: 'Analisar Indício de Bloqueio', citacao: 'Analisar Indício de Citação', protocolo: 'Executar Protocolo', acordos: 'Acordos' };
async function loadTasks() {
  if (!window.MBA_API) return;
  try {
    const tasks = await window.MBA_API.request('/api/tasks'); tasksCache = tasks;
    const tbody = document.querySelector('#tasks-table-body');
    const canAssign = authenticatedUser?.permissions?.['tasks.assign'] === true;
    tbody.innerHTML = tasks.length ? tasks.map((task) => `<tr data-task-id="${task.id}"><td><span class="row-icon blue"><i data-lucide="clipboard-check"></i></span><strong>${escapeHtml(task.title || taskLabels[task.type])}</strong></td><td>${escapeHtml(task.description || 'Sem descrição')}</td><td><span class="empty-pill">${task.total_processes - task.completed_processes}</span></td><td><span class="task-status waiting">${escapeHtml(task.status)}</span></td><td>${task.updated_at ? new Date(task.updated_at).toLocaleString('pt-BR') : 'Sem atualização'}</td><td><div class="table-row-actions">${canAssign ? `<button class="secondary-button" type="button" data-assign-task="${task.id}"><i data-lucide="user-plus"></i>Atribuir</button>` : ''}<button class="execute-button" data-task-json="${encodeURIComponent(JSON.stringify(task))}"><i data-lucide="play"></i>Executar</button></div></td></tr>`).join('') : '<tr><td colspan="6">Nenhuma tarefa disponível.</td></tr>';
    lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    if (['task_worker', 'task_only'].includes(authenticatedUser?.role) && tasks[0]) await openTask(tasks[0]);
  } catch (_error) { /* a autorização já controla a visibilidade da área */ }
}

async function openTask(task) {
  if (task.type === 'acordos' && window.openAgreementTask) return window.openAgreementTask(task);
  currentTask = task;
  const processes = await window.MBA_API.request(`/api/tasks/${task.id}/processes`);
  document.querySelector('.detail-heading h1').textContent = task.title;
  document.querySelector('#task-deadline').textContent = task.deadline_at ? new Date(task.deadline_at).toLocaleString('pt-BR') : 'Não informado';
  document.querySelector('#task-progress').textContent = `${task.completed_processes} de ${task.total_processes}`;
  const list = document.querySelector('#process-items');
  list.innerHTML = processes.map((process, index) => `<button class="process-item ${index === 0 ? 'selected' : ''}" data-process-json="${encodeURIComponent(JSON.stringify(process))}"><span><i data-lucide="file-check-2"></i></span><div><strong>${escapeHtml(process.case_number)}</strong><small>${escapeHtml(process.party_name || 'Parte não informada')}</small></div><em>${escapeHtml(process.status)}</em></button>`).join('');
  currentProcess = processes.find((process) => process.status !== 'completed') || processes[0] || null;
  if (currentProcess) {
    document.querySelector('#selected-case-number').textContent = currentProcess.case_number;
    document.querySelector('#selected-party').textContent = currentProcess.party_name || 'Parte não informada';
  }
  showPage('tarefa-analise'); lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
}

document.querySelector('#tasks-table-body')?.addEventListener('click', (event) => {
  const assignButton = event.target.closest('[data-assign-task]');
  if (assignButton) { openTaskAssignment(assignButton.dataset.assignTask); return; }
  const button = event.target.closest('[data-task-json]');
  if (button) openTask(JSON.parse(decodeURIComponent(button.dataset.taskJson))).catch((error) => window.alert(error.message));
});

const taskAssignDialog = document.querySelector('#task-assign-dialog');
async function openTaskAssignment(taskId) {
  if (!usersCache.length) usersCache = await window.MBA_API.request('/api/users');
  const activeUsers = usersCache.filter((user) => user.active && (user.role !== 'task_worker' || user.task_access_enabled));
  const selectedTask = tasksCache.find((item) => item.id === taskId);
  const selectedIds = new Set(selectedTask?.participant_user_ids || (selectedTask?.responsible_id ? [selectedTask.responsible_id] : []));
  document.querySelector('#task-assign-task').innerHTML = tasksCache.map((item) => `<option value="${item.id}">${escapeHtml(item.title || taskLabels[item.type])}</option>`).join('');
  document.querySelector('#task-assign-users').innerHTML = activeUsers.length
    ? activeUsers.map((user) => `<label><input type="checkbox" name="participant_user_ids" value="${escapeHtml(user.id)}" ${selectedIds.has(user.id) ? 'checked' : ''}><span>${escapeHtml(user.name || user.email)}</span></label>`).join('')
    : '<span>Nenhum usuário ativo disponível.</span>';
  document.querySelector('#task-assign-task').value = taskId;
  document.querySelector('#task-assign-error').hidden = true;
  taskAssignDialog.showModal();
}
document.querySelectorAll('[data-close-task-assign]').forEach((button) => button.addEventListener('click', () => taskAssignDialog.close()));
document.querySelector('#task-assign-form')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const submit = form.querySelector('[type="submit"]'); const errorBox = document.querySelector('#task-assign-error'); submit.disabled = true; errorBox.hidden = true;
  try {
    const participantUserIds = new FormData(form).getAll('participant_user_ids').filter(Boolean);
    if (!participantUserIds.length) throw new Error('Selecione ao menos um usuário ativo.');
    await window.MBA_API.request(`/api/tasks/${form.elements.task_id.value}`, { method: 'PATCH', body: JSON.stringify({ participant_user_ids: participantUserIds }) });
    taskAssignDialog.close(); await loadTasks(); window.alert(`Tarefa atribuída a ${participantUserIds.length} participante(s).`);
  }
  catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; } finally { submit.disabled = false; }
});
document.querySelector('#process-items')?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-process-json]'); if (!button) return;
  currentProcess = JSON.parse(decodeURIComponent(button.dataset.processJson));
  document.querySelectorAll('.process-item').forEach((item) => item.classList.toggle('selected', item === button));
  document.querySelector('#selected-case-number').textContent = currentProcess.case_number;
  document.querySelector('#selected-party').textContent = currentProcess.party_name || 'Parte não informada';
});

document.querySelector('#task-create-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget; const submit = form.querySelector('[type="submit"]'); const errorBox = document.querySelector('#task-dialog-error');
  if (!window.MBA_TASK_IMPORT) {
    errorBox.textContent = 'O módulo de importação ainda não está pronto. Atualize a página e entre novamente.';
    errorBox.hidden = false;
    return;
  }
  const originalLabel = submit.innerHTML;
  submit.disabled = true;
  submit.textContent = 'Criando e importando…';
  errorBox.hidden = true;
  try {
    const data = new FormData(form);
    const participantUserIds = data.getAll('participant_user_ids').filter(Boolean);
    if (data.get('type') === 'acordos' && !participantUserIds.length) throw new Error('Selecione ao menos um participante.');
    const result = await window.MBA_TASK_IMPORT.createTaskWithImportedProcesses({ type: data.get('type'), title: data.get('title'), description: data.get('description'), priority: data.get('priority'), deadline_at: data.get('deadline_at') || null, responsible_id: data.get('type') === 'acordos' ? null : (data.get('responsible_id') || null), participant_user_ids: data.get('type') === 'acordos' ? participantUserIds : [], source: 'manual_upload' }, data.get('file'));
    await loadTasks();
    taskDialog.close();
    form.reset();
    window.alert(`Tarefa criada e importada: ${result.rowsImported} processo(s).${result.rowsSkipped ? ` ${result.rowsSkipped} linha(s) sem número de processo foram ignoradas.` : ''}`);
  } catch (error) {
    console.error('Erro ao criar/importar tarefa:', error);
    errorBox.textContent = error.code === '42501' || error.status === 403
      ? 'Você não possui permissão para criar esta tarefa.'
      : error.message || 'Não foi possível criar a tarefa.';
    errorBox.hidden = false;
  } finally {
    submit.disabled = false;
    submit.innerHTML = originalLabel;
  }
});

const integrationDialog = document.querySelector('#integration-dialog');
let integrationPollTimer = null;
const integrationConfig = {
  liminar: { label: 'API de Liminar', run: '/api/integrations/liminar/run', status: (id) => `/api/integrations/liminar/jobs/${id}`, download: (id) => `/api/integrations/liminar/jobs/${id}/download`, done: ['DONE', 'ERROR'], progress: ['done'] },
  datajud: { label: 'CNJ / DataJud', run: '/api/integrations/datajud/run', status: (id) => `/api/integrations/datajud/jobs/${id}`, done: ['CONCLUIDO', 'CONCLUÍDO', 'ERRO'], progress: ['processados', 'done'] },
  encerramentos: { label: 'Agente de Encerramentos', run: '/api/integrations/encerramentos/run', status: (id) => `/api/integrations/encerramentos/jobs/${id}`, download: (id) => `/api/integrations/encerramentos/jobs/${id}/download`, done: ['DONE', 'ERROR'], progress: ['done'] },
};

function setIntegrationHealth(name, online) {
  const badge = document.querySelector(`#${name}-health`);
  const dashboard = document.querySelector(`#dashboard-${name}-status`);
  if (badge) {
    badge.textContent = online ? 'Online' : 'Indisponível';
    badge.className = `status-badge ${online ? 'available' : 'planned'}`;
  }
  if (dashboard) dashboard.textContent = online ? 'Online' : 'Indisponível';
}

function setIntegrationBusy(name, busy) {
  document.querySelectorAll(`.integration-run-button[data-integration="${name}"]`).forEach((button) => {
    button.disabled = Boolean(busy);
    button.title = busy ? 'Já existe um job utilizando este recurso.' : '';
  });
}

function setResourceBusy(name, busy) {
  setIntegrationBusy(name, busy);
  if (name === 'liminar') setIntegrationBusy('encerramentos', busy);
  if (name === 'encerramentos') setIntegrationBusy('liminar', busy);
}

async function loadIntegrationHealth() {
  try {
    const health = await window.MBA_AUTOMATION_API.request('/api/integrations/health');
    setIntegrationHealth('liminar', Boolean(health.liminar?.online));
    setIntegrationHealth('datajud', Boolean(health.datajud?.online));
    setIntegrationHealth('encerramentos', Boolean(health.encerramentos?.online));
    setIntegrationBusy('liminar', Boolean(health.liminar?.busy));
    setIntegrationBusy('encerramentos', Boolean(health.encerramentos?.busy));
    setIntegrationBusy('datajud', Boolean(health.datajud?.busy));
  } catch (_error) {
    setIntegrationHealth('liminar', false);
    setIntegrationHealth('datajud', false);
    setIntegrationHealth('encerramentos', false);
  }
}

function numberFrom(job, keys) {
  for (const key of keys) {
    const value = Number(job[key]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function terminalIntegrationStatus(type, status) {
  const normalized = String(status || '').toLocaleUpperCase('pt-BR');
  return integrationConfig[type].done.some((terminal) => normalized === terminal || normalized.startsWith(terminal));
}

document.querySelectorAll('.integration-run-button').forEach((button) => button.addEventListener('click', async () => {
  const type = button.dataset.integration;
  if (button.id === 'tutelas-run-button') {
    await runStoredTutelas();
    return;
  }
  clearTimeout(integrationPollTimer);
  document.querySelector('#integration-type').value = type;
  document.querySelector('#integration-dialog-title').textContent = `Executar ${integrationConfig[type].label}`;
  document.querySelector('#integration-origin-field').hidden = type !== 'datajud';
  document.querySelector('#integration-criteria-field').hidden = type !== 'encerramentos';
  document.querySelector('#integration-error').hidden = true;
  document.querySelector('#integration-result').hidden = true;
  document.querySelector('#integration-download').hidden = true;
  integrationDialog.showModal();
}));
document.querySelectorAll('[data-close-integration]').forEach((button) => button.addEventListener('click', () => {
  clearTimeout(integrationPollTimer);
  integrationDialog.close();
}));

async function pollIntegration(type, jobId) {
  const config = integrationConfig[type];
  try {
    const job = await window.MBA_AUTOMATION_API.request(config.status(jobId));
    const status = String(job.status || '').toUpperCase();
    const done = numberFrom(job, config.progress);
    const total = Number(job.total || 0);
    document.querySelector('#integration-result-status').textContent = `Status: ${job.status}`;
    document.querySelector('#integration-result-progress').textContent = `${job.last_msg || job.mensagem_atual || 'Em processamento'} · ${done} de ${total}`;
    document.querySelector(`#${type}-job-status`).textContent = job.status;
    document.querySelector(`#${type}-job-progress`).textContent = `${done}/${total}`;
    const finished = terminalIntegrationStatus(type, status);
    if (!finished) integrationPollTimer = setTimeout(() => pollIntegration(type, jobId), 2000);
    if (config.download && status === 'DONE') {
      const download = await window.MBA_AUTOMATION_API.request(config.download(jobId));
      const link = document.querySelector('#integration-download');
      link.href = download.download_url;
      link.hidden = false;
    }
    if (finished && type === 'liminar') loadTutelaCases();
    if (finished && type === 'encerramentos' && status === 'DONE') loadEncerramentosResults(jobId);
    if (finished) loadIntegrationJobs(type);
    if (finished) loadIntegrationHealth();
  } catch (error) {
    document.querySelector('#integration-error').textContent = error.message;
    document.querySelector('#integration-error').hidden = false;
  }
}

document.querySelector('#integration-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = form.querySelector('[type="submit"]');
  const data = new FormData(form);
  const type = data.get('integration');
  const cnjs = [...new Set(String(data.get('cnjs') || '').split(/[\r\n,;]+/).map((value) => value.trim()).filter(Boolean))];
  const errorBox = document.querySelector('#integration-error');
  errorBox.hidden = true;
  submit.disabled = true;
  try {
    if (!cnjs.length) throw new Error('Informe ao menos um processo CNJ.');
    const payload = type === 'liminar' ? { cnj_list: cnjs }
      : type === 'datajud' ? { origem: data.get('origem'), processos: cnjs }
        : { source: 'enter', processos: cnjs, criterios: data.getAll('criterios') };
    if (type === 'encerramentos' && !payload.criterios.length) throw new Error('Selecione ao menos um critério.');
    const job = await window.MBA_AUTOMATION_API.request(integrationConfig[type].run, { method: 'POST', body: JSON.stringify(payload) });
    const jobId = job.job_id || job.id;
    if (!jobId) throw new Error('A integração não retornou o identificador do job.');
    document.querySelector('#integration-result').hidden = false;
    document.querySelector('#integration-result-status').textContent = 'Job criado';
    document.querySelector('#integration-result-progress').textContent = `Identificador: ${jobId}`;
    setResourceBusy(type, true);
    pollIntegration(type, jobId);
  } catch (error) {
    const messages = { 401: 'Sua sessão expirou. Entre novamente.', 403: 'Você não possui permissão para executar esta automação.', 409: 'Já existe uma automação utilizando este recurso.', 413: 'Esta execução excede o limite permitido de processos.', 429: 'Você atingiu o limite diário de execuções desta automação.' };
    errorBox.textContent = messages[error.status] || error.message;
    errorBox.hidden = false;
  } finally { submit.disabled = false; }
});

document.querySelector('#reset-task-otp')?.addEventListener('click', async () => {
  if (!selectedUser) return;
  try {
    await window.MBA_AUTOMATION_API.request(`/api/users/${selectedUser.id}/task-otp/reset`, { method: 'POST' });
    await selectUser(selectedUser.id);
    await loadUsers();
    window.alert('Novo OTP liberado para o usuário.');
  } catch (error) { window.alert(error.message); }
});

async function loadIntegrationJobs(type) {
  const jobs = await window.MBA_AUTOMATION_API.request(`/api/integrations/${type}/jobs`);
  window.dispatchEvent(new CustomEvent('mba:jobs-loaded', { detail: { integration: type, jobs } }));
  return jobs;
}

async function loadEncerramentosResults(jobId) {
  const rows = await window.MBA_AUTOMATION_API.request(`/api/integrations/encerramentos/jobs/${jobId}/results`);
  const body = document.querySelector('#encerramentos-results-body');
  const title = document.querySelector('#encerramentos-results-title');
  if (!body) return;
  title.textContent = `Resultado do job ${jobId}`;
  body.innerHTML = rows.length ? rows.map((row) => `<tr><td>${escapeHtml(row.cnj)}</td><td>${escapeHtml(row.status || '—')}</td><td>${escapeHtml(row.result || '—')}</td><td>${escapeHtml(row.criterion || '—')}</td><td>${escapeHtml(row.error || '—')}</td></tr>`).join('') : '<tr><td colspan="5">Este job não possui resultados persistidos.</td></tr>';
}

async function loadLatestEncerramentosResults() {
  const jobs = await window.MBA_AUTOMATION_API.request('/api/integrations/encerramentos/jobs');
  const latest = jobs.filter((job) => String(job.status || '').toUpperCase() === 'DONE').sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))[0];
  if (latest) await loadEncerramentosResults(latest.job_id || latest.id);
}

window.addEventListener('mba:encerramentos-job-selected', (event) => {
  loadEncerramentosResults(event.detail?.jobId).then(() => window.showPage?.('encerramentos')).catch((error) => window.alert(error.message));
});

window.addEventListener('mba:jobs-request', (event) => {
  loadIntegrationJobs(event.detail?.integration).catch((error) => {
    window.dispatchEvent(new CustomEvent('mba:jobs-loaded', { detail: { integration: event.detail?.integration, jobs: [], error: error.message } }));
  });
});

let tutelaCases = [];
let pagamentoPage = 1;
let lastAcpRows = [];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

function tutelaResultLabel(result) {
  return { com_indicio: 'Com indício', sem_indicio: 'Sem indício', nao_consultado: 'Não consultado', erro: 'Erro' }[result] || 'Não consultado';
}

function renderTutelaCases() {
  const body = document.querySelector('#tutelas-table-body');
  if (!body) return;
  const counts = { total: tutelaCases.length, com_indicio: 0, sem_indicio: 0, nao_consultado: 0, erro: 0 };
  tutelaCases.forEach((item) => { counts[item.resultado] = (counts[item.resultado] || 0) + 1; });
  const values = {
    '#tutelas-total': counts.total, '#tutelas-com-indicio': counts.com_indicio,
    '#tutelas-sem-indicio': counts.sem_indicio, '#tutelas-nao-consultados': counts.nao_consultado,
    '#tutelas-erros': counts.erro, '#tutelas-tab-com-indicio': counts.com_indicio,
    '#tutelas-tab-sem-indicio': counts.sem_indicio, '#tutelas-tab-nao-consultados': counts.nao_consultado,
    '#tutelas-tab-erros': counts.erro,
  };
  Object.entries(values).forEach(([selector, value]) => { const element = document.querySelector(selector); if (element) element.textContent = value; });
  body.innerHTML = tutelaCases.length ? tutelaCases.map((item) => `<tr data-tutela-row data-processo="${escapeHtml(item.cnj)}" data-cliente="${escapeHtml(item.cliente || '')}" data-pedido="${item.pedido ? 'sim' : 'nao'}" data-result="${item.resultado}" data-consulta-date="${String(item.updated_at || '').slice(0, 10)}"><td><strong>${escapeHtml(item.cnj)}</strong></td><td>${escapeHtml(item.cliente || '—')}</td><td><span class="tutela-result ${item.resultado.replace('_', '-')}">${tutelaResultLabel(item.resultado)}</span></td><td><span class="tutela-pedido ${item.pedido ? 'sim' : 'nao'}">${item.pedido ? 'Sim' : 'Não'}</span></td><td>${formatDate(item.updated_at)}</td><td>${item.erro ? `<button class="tutela-action" title="${escapeHtml(item.erro)}"><i data-lucide="triangle-alert"></i></button>` : '—'}</td></tr>`).join('') : '<tr class="tutelas-empty-row"><td colspan="6"><div class="tutelas-empty"><i data-lucide="database"></i><strong>Nenhum caso cadastrado</strong><span>Adicione casos para preparar a busca de tutela.</span></div></td></tr>';
  document.querySelector('#tutelas-pagination-label').textContent = tutelaCases.length ? `${tutelaCases.length} registro(s) exibido(s)` : 'Nenhum registro exibido';
  lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
}

async function loadTutelaCases() {
  tutelaCases = await window.MBA_AUTOMATION_API.request('/api/integrations/liminar/cases');
  renderTutelaCases();
}

const tutelaCasesDialog = document.querySelector('#tutelas-cases-dialog');
document.querySelector('#tutelas-add-cases')?.addEventListener('click', () => {
  document.querySelector('#tutelas-cases-error').hidden = true;
  tutelaCasesDialog.showModal();
});
document.querySelectorAll('[data-close-tutelas-cases]').forEach((button) => button.addEventListener('click', () => tutelaCasesDialog.close()));
document.querySelector('#tutelas-cases-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const errorBox = document.querySelector('#tutelas-cases-error');
  const submit = form.querySelector('[type="submit"]');
  const data = new FormData(form);
  const cases = [...new Set(String(data.get('cnjs') || '').split(/[\r\n,;]+/).map((cnj) => cnj.trim()).filter(Boolean))].map((cnj) => ({ cnj, cliente: data.get('cliente') }));
  submit.disabled = true;
  errorBox.hidden = true;
  try {
    const result = await window.MBA_AUTOMATION_API.request('/api/integrations/liminar/cases', { method: 'POST', body: JSON.stringify({ cases }) });
    form.reset();
    tutelaCasesDialog.close();
    await loadTutelaCases();
    window.alert(`${result.saved} caso(s) salvo(s).${result.invalid ? ` ${result.invalid} inválido(s) foram ignorados.` : ''}`);
  } catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; } finally { submit.disabled = false; }
});

async function runStoredTutelas() {
  if (!tutelaCases.length) await loadTutelaCases();
  const cnjList = tutelaCases.map((item) => item.cnj).filter(Boolean);
  if (!cnjList.length) {
    window.alert('Adicione ao menos um caso antes de procurar tutela.');
    return;
  }
  const button = document.querySelector('#tutelas-run-button');
  button.disabled = true;
  let started = false;
  try {
    const job = await window.MBA_AUTOMATION_API.request('/api/integrations/liminar/run', { method: 'POST', body: JSON.stringify({ cnj_list: cnjList }) });
    document.querySelector('#liminar-job-status').textContent = job.status || 'queued';
    document.querySelector('#liminar-job-progress').textContent = `0/${job.total || cnjList.length}`;
    window.alert(`Busca de tutela iniciada para ${cnjList.length} caso(s).`);
    started = true;
    setResourceBusy('liminar', true);
    pollIntegration('liminar', job.job_id || job.id);
  } catch (error) {
    const messages = { 401: 'A automação não aceitou a credencial atual. Sua sessão no Backoffice continua ativa.', 403: 'Você não possui permissão para executar esta automação.', 409: 'Já existe uma automação utilizando a credencial Enter.', 413: 'Esta execução excede o limite permitido de processos.', 429: 'Você atingiu o limite diário de execuções desta automação.' };
    window.alert(messages[error.status] || error.message);
  } finally { if (!started) button.disabled = false; }
}

function paymentFilters() {
  const query = new URLSearchParams();
  const fields = { data_inicio: '#pagamentos-data-inicio', data_fim: '#pagamentos-data-fim', credenciado: '#pagamentos-credenciado', solicitante: '#pagamentos-solicitante', situacao: '#pagamentos-situacao', tipo_pagamento: '#pagamentos-tipo' };
  Object.entries(fields).forEach(([key, selector]) => { const value = document.querySelector(selector)?.value.trim(); if (value) query.set(key, value); });
  return query;
}

async function loadPagamentos(resetPage = false) {
  if (resetPage) pagamentoPage = 1;
  const filters = paymentFilters();
  const [summary, list, credenciados, situacoes] = await Promise.all([
    window.MBA_API.request(`/api/pagamentos/resumo?${filters}`),
    window.MBA_API.request(`/api/pagamentos?${new URLSearchParams({ ...Object.fromEntries(filters), page: pagamentoPage, page_size: 25 })}`),
    window.MBA_API.request('/api/pagamentos/credenciados'),
    window.MBA_API.request('/api/pagamentos/situacoes'),
  ]);
  const cards = summary.cards || {};
  document.querySelector('#pagamentos-total-pago').textContent = formatCurrency(cards.total_pago);
  document.querySelector('#pagamentos-quantidade').textContent = cards.quantidade_pagamentos ?? 0;
  document.querySelector('#pagamentos-ticket-medio').textContent = formatCurrency(cards.ticket_medio);
  document.querySelector('#pagamentos-tempo-medio').textContent = cards.tempo_medio_pagamento_dias == null ? '—' : `${cards.tempo_medio_pagamento_dias} dias`;
  document.querySelector('#pagamentos-credenciados-ativos').textContent = cards.credenciados_ativos ?? 0;
  const selectOptions = (selector, values, label) => {
    const select = document.querySelector(selector); const selected = select.value;
    select.innerHTML = `<option value="">${label}</option>${(values.rows || []).map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('')}`;
    select.value = selected;
  };
  selectOptions('#pagamentos-credenciado', credenciados, 'Todos');
  selectOptions('#pagamentos-situacao', situacoes, 'Todas');
  document.querySelector('#pagamentos-table-body').innerHTML = list.rows?.length ? list.rows.map((row) => `<tr><td>${escapeHtml(row.pasta)}</td><td>${escapeHtml(row.credenciado || '—')}</td><td>${escapeHtml(row.solicitante || '—')}</td><td>${escapeHtml(row.tipo_pagamento || '—')}</td><td>${formatCurrency(row.valor)}</td><td>${escapeHtml(row.situacao || '—')}</td><td>${formatDate(row.data_aprovacao)}</td><td>${formatDate(row.data_pagamento)}</td><td>${row.tempo_pagamento_dias ?? '—'}</td></tr>`).join('') : '<tr><td colspan="9">Nenhum pagamento encontrado para os filtros informados.</td></tr>';
  document.querySelector('#pagamentos-pagination-label').textContent = list.total ? `${list.total} registro(s) · página ${list.page} de ${list.total_pages}` : 'Nenhum registro';
  const pagination = document.querySelector('#pagamentos-pagination');
  pagination.innerHTML = list.total_pages > 1 ? `<button type="button" data-payment-page="${Math.max(1, list.page - 1)}" ${list.page === 1 ? 'disabled' : ''}>Anterior</button><button type="button" data-payment-page="${Math.min(list.total_pages, list.page + 1)}" ${list.page === list.total_pages ? 'disabled' : ''}>Próxima</button>` : '';
}

document.querySelector('#pagamentos-pagination')?.addEventListener('click', (event) => { const button = event.target.closest('[data-payment-page]'); if (!button) return; pagamentoPage = Number(button.dataset.paymentPage); loadPagamentos(); });
document.querySelector('#pagamentos-refresh')?.addEventListener('click', () => loadPagamentos(true).catch((error) => window.alert(error.message)));
['#pagamentos-data-inicio', '#pagamentos-data-fim', '#pagamentos-credenciado', '#pagamentos-situacao', '#pagamentos-tipo'].forEach((selector) => document.querySelector(selector)?.addEventListener('change', () => loadPagamentos(true).catch(() => {})));
document.querySelector('#pagamentos-solicitante')?.addEventListener('input', () => { clearTimeout(paymentFilterTimer); paymentFilterTimer = setTimeout(() => loadPagamentos(true).catch(() => {}), 350); });
document.querySelector('#pagamentos-export-button')?.addEventListener('click', async () => {
  if (window.MBA_LOCAL_PREVIEW) { window.alert('Na integração, esta ação exporta a base filtrada em XLSX.'); return; }
  try { const response = await window.MBA_AUTOMATION_API.fetch(`/api/pagamentos/exportar?${paymentFilters()}`); if (!response.ok) throw new Error('Não foi possível exportar a base.'); const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href = url; link.download = 'base_pagamentos.xlsx'; link.click(); URL.revokeObjectURL(url); } catch (error) { window.alert(error.message); }
});

const pagamentosImportDialog = document.querySelector('#pagamentos-import-dialog');
document.querySelector('#pagamentos-import-button')?.addEventListener('click', () => pagamentosImportDialog.showModal());
document.querySelectorAll('[data-close-pagamentos-import]').forEach((button) => button.addEventListener('click', () => pagamentosImportDialog.close()));
document.querySelector('#pagamentos-import-form')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const submit = form.querySelector('[type="submit"]'); const errorBox = document.querySelector('#pagamentos-import-error');
  submit.disabled = true; errorBox.hidden = true;
  try { const result = await window.MBA_AUTOMATION_API.request('/api/pagamentos/importar', { method: 'POST', body: new FormData(form) }); form.reset(); pagamentosImportDialog.close(); await loadPagamentos(true); window.alert(`Base importada: ${result.importacao.valid_rows} linha(s) válida(s).`); } catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; } finally { submit.disabled = false; }
});

const pagamentosAcpDialog = document.querySelector('#pagamentos-acp-dialog');
document.querySelector('#pagamentos-acp-button')?.addEventListener('click', () => pagamentosAcpDialog.showModal());
document.querySelectorAll('[data-close-pagamentos-acp]').forEach((button) => button.addEventListener('click', () => pagamentosAcpDialog.close()));
document.querySelector('#pagamentos-acp-form')?.addEventListener('submit', async (event) => {
  event.preventDefault(); const form = event.currentTarget; const submit = form.querySelector('[type="submit"]'); const errorBox = document.querySelector('#pagamentos-acp-error');
  submit.disabled = true; errorBox.hidden = true;
  try { const result = await window.MBA_AUTOMATION_API.request('/api/pagamentos/validacao', { method: 'POST', body: new FormData(form) }); lastAcpRows = result.rows || []; document.querySelector('#pagamentos-acp-result').hidden = false; document.querySelector('#pagamentos-acp-summary').textContent = `${result.summary.encontrados} encontrado(s) de ${result.summary.total}`; document.querySelector('#pagamentos-acp-detail').textContent = `${result.summary.nao_encontrados} não encontrado(s).`; } catch (error) { errorBox.textContent = error.message; errorBox.hidden = false; } finally { submit.disabled = false; }
});
document.querySelector('#pagamentos-acp-export')?.addEventListener('click', async () => {
  try { const response = await window.MBA_AUTOMATION_API.fetch('/api/pagamentos/validacao/exportar', { method: 'POST', body: JSON.stringify({ rows: lastAcpRows }) }); if (!response.ok) throw new Error('Não foi possível exportar a validação.'); const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href = url; link.download = 'validacao_acp.xlsx'; link.click(); URL.revokeObjectURL(url); } catch (error) { window.alert(error.message); }
});

window.addEventListener('mba:authenticated', (event) => {
  authenticatedUser = event.detail;
  if (event.detail.permissions?.['users.view']) loadUsers();
  if (event.detail.permissions?.['automations.view']) loadIntegrationHealth();
  if (event.detail.permissions?.['encerramentos.view']) loadLatestEncerramentosResults().catch(() => {});
  if (event.detail.permissions?.['tutelas.view'] || event.detail.permissions?.['automations.view']) loadTutelaCases().catch(() => {});
  if (event.detail.permissions?.['pagamentos.view']) loadPagamentos(true).catch(() => {});
  if (event.detail.permissions?.['agreements.view']) window.loadAgreements?.(true);
  if (event.detail.permissions?.['tasks.view']) loadTasks();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('.search-box input')?.focus();
  }
});

lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
