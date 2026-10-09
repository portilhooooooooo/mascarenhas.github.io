export type TaskStateKey = 'urgent' | 'overdue' | 'pending' | 'on_time';

export interface MbaUser {
  id?: string;
  access_kind?: string;
  is_master_admin?: boolean;
  allowed_modules?: string[];
  permissions?: Record<string, boolean>;
}

export interface Task {
  id: string;
  type: string;
  title?: string | null;
  description?: string | null;
  priority?: string | null;
  status?: string | null;
  deadline_at?: string | null;
  responsible_id?: string | null;
  responsible_name?: string | null;
  participant_user_ids?: string[] | null;
  participant_names?: string[] | null;
  total_processes?: number | null;
  completed_processes?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface TaskProcess {
  id: string;
  task_id?: string | null;
  case_number?: string | null;
  party_name?: string | null;
  status?: string | null;
  position?: number | null;
  assignee_id?: string | null;
  folder?: string | null;
  initial_status?: string | null;
  provision_amount?: number | string | null;
  indicio?: string | null;
  indication?: string | null;
  indication_label?: string | null;
  reason?: string | null;
  reason_label?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface WorkItem {
  task: Task;
  process: TaskProcess;
}

export const TASK_TYPE_LABELS: Record<string, string> = {
  comprovante_pagamento: 'Validação de Comprovante',
  liminar: 'Validação de Liminar',
  acordos: 'Saneamento de Acordos',
  encerramento: 'Validação de Encerramento',
  bloqueio: 'Validação de Bloqueio',
  citacao: 'Validação de Citação',
  protocolo: 'Protocolo',
  contestacao: 'Validação de Contestação',
  defesa: 'Validação de Defesa',
  reagendamento: 'Validação de Reagendamento',
};

export const TASK_STATE_ORDER: TaskStateKey[] = ['urgent', 'overdue', 'pending', 'on_time'];

export const TASK_STATE_META: Record<TaskStateKey, { label: string; singular: string }> = {
  urgent: { label: 'Urgentes', singular: 'Urgente' },
  overdue: { label: 'Em atraso', singular: 'Em atraso' },
  pending: { label: 'Pendentes', singular: 'Pendente' },
  on_time: { label: 'Em dia', singular: 'Em dia' },
};

export const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

export function taskTypeLabel(type: unknown) {
  return TASK_TYPE_LABELS[normalize(type)] || 'Tarefa operacional';
}

function localDay(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

export function taskState(task: Task): TaskStateKey {
  const priority = normalize(task.priority);
  const status = normalize(task.status);
  const deadline = localDay(task.deadline_at);
  const today = localDay(new Date());

  // Urgência é exclusivamente explícita na atribuição.
  if (priority === 'high') return 'urgent';
  if (deadline && today && deadline.getTime() < today.getTime()) return 'overdue';
  if (!deadline || ['pending', 'waiting', 'queued', 'created'].includes(status)) return 'pending';
  return 'on_time';
}

export function taskStateRank(task: Task) {
  const index = TASK_STATE_ORDER.indexOf(taskState(task));
  return index < 0 ? TASK_STATE_ORDER.length : index;
}

export function pendingCount(task: Task) {
  return Math.max(0, Number(task.total_processes || 0) - Number(task.completed_processes || 0));
}

export function isTaskActive(task: Task) {
  return !['completed', 'cancelled', 'inactive'].includes(normalize(task.status));
}

export function canManageTasks(user: MbaUser | null) {
  return Boolean(
    user?.is_master_admin
    || user?.permissions?.['tasks.manage']
    || user?.permissions?.['tasks.view_others']
    || user?.permissions?.['tasks.assign']
    || user?.permissions?.['tasks.create'],
  );
}

export function taskAssignedToUser(task: Task, user: MbaUser | null, manager: boolean) {
  if (!user?.id) return false;
  if (user.is_master_admin || user.permissions?.['tasks.manage']) return true;
  if (Array.isArray(user.allowed_modules) && user.allowed_modules.length && !user.allowed_modules.includes(task.type)) return false;

  // /api/tasks already authorizes the parent. A task can be returned solely
  // because one of its processes is assigned to this user; filtering by the
  // parent responsible/participants here would wrongly hide that process.
  return true;
}

export function processAssignedToUser(task: Task, process: TaskProcess, user: MbaUser | null, manager: boolean) {
  if (!user?.id) return false;
  // Management grants oversight, not execution ownership. The database
  // authorizes completion for the assigned analyst (or the master admin).
  // Do not show another analyst's processes as executable for managers.
  if (user.is_master_admin) return true;
  return Boolean(process.assignee_id) && String(process.assignee_id) === String(user.id);
}

export function indicationLabel(task: Task, process: TaskProcess) {
  const direct = process.indicio
    || process.indication
    || process.indication_label
    || process.reason
    || process.reason_label;
  if (direct) return String(direct);

  const paymentLabels: Record<string, string> = {
    incerto: 'Pagamento com situação incerta',
    liquidado: 'Pagamento identificado como liquidado',
    pagamento_recusado: 'Pagamento recusado',
    sem_comprovante: 'Sem comprovante',
    com_comprovante: 'Com comprovante',
  };
  const initial = normalize(process.initial_status);
  if (paymentLabels[initial]) return paymentLabels[initial];
  if (normalize(task.type) === 'liminar') return 'Pedido de tutela/liminar';
  if (normalize(task.type) === 'defesa') return 'Indícios de Enter e DataJud';
  return 'Não informado';
}

export function formatDate(value: unknown) {
  if (!value) return 'Não informado';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? 'Não informado' : date.toLocaleDateString('pt-BR');
}

function safeTime(value: unknown, fallback = Number.MAX_SAFE_INTEGER) {
  if (!value) return fallback;
  const time = new Date(String(value)).getTime();
  return Number.isNaN(time) ? fallback : time;
}

function processPosition(process: TaskProcess) {
  const position = Number(process.position);
  return Number.isFinite(position) && position >= 0 ? position : Number.MAX_SAFE_INTEGER;
}

export function compareTasks(a: Task, b: Task) {
  const state = taskStateRank(a) - taskStateRank(b);
  if (state) return state;
  const deadline = safeTime(a.deadline_at) - safeTime(b.deadline_at);
  if (deadline) return deadline;
  const created = safeTime(a.created_at || a.updated_at) - safeTime(b.created_at || b.updated_at);
  if (created) return created;
  return String(a.id).localeCompare(String(b.id));
}

export function backendPriority(item: WorkItem) {
  return normalize(item.process.priority || item.task.priority) || 'unspecified';
}
export const PRIORITY_LABELS: Record<string, string> = { altissima: 'Altíssima', 'altíssima': 'Altíssima', highest: 'Altíssima', urgent: 'Altíssima', alta: 'Alta', high: 'Alta', media: 'Média', 'média': 'Média', medium: 'Média', normal: 'Média', baixa: 'Baixa', low: 'Baixa', unspecified: 'Não informada' };
export function priorityLevel(item: WorkItem): 'high' | 'medium' | 'low' {
  const value = backendPriority(item);
  if (['altissima', 'altíssima', 'highest', 'urgent', 'urgente', 'alta', 'high'].includes(value)) return 'high';
  if (['baixa', 'low'].includes(value)) return 'low';
  // Valores legados "normal" e sem prioridade explícita permanecem na faixa média.
  return 'medium';
}
function priorityRank(item: WorkItem) {
  const value = backendPriority(item);
  return priorityLevel(item) === 'high' ? 0 : priorityLevel(item) === 'medium' ? 1 : 2;
}
export function processStatus(item: WorkItem, skipped = false) {
  const status = normalize(item.process.status) || 'pending';
  return skipped && !['completed','error','erro','failed'].includes(status) ? 'skipped' : status;
}
export const PROCESS_STATUS_LABELS: Record<string,string> = { pending:'Pendente', in_progress:'Em execução', waiting:'Aguardando', queued:'Na fila', created:'Pendente', completed:'Concluído', skipped:'Pulado', error:'Erro', erro:'Erro', failed:'Erro', cancelled:'Cancelado', inactive:'Inativo' };

export function compareWorkItems(a: WorkItem, b: WorkItem) {
  const priority = priorityRank(a) - priorityRank(b);
  if (priority) return priority;
  const taskOrder = compareTasks(a.task, b.task);
  if (taskOrder) return taskOrder;
  const position = processPosition(a.process) - processPosition(b.process);
  if (position) return position;
  const created = safeTime(a.process.created_at) - safeTime(b.process.created_at);
  if (created) return created;
  return String(a.process.case_number || '').localeCompare(String(b.process.case_number || ''), 'pt-BR');
}

export function workItemKey(item: WorkItem) {
  return `${item.task.id}:${item.process.id}`;
}
