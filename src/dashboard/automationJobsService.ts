export const serviceLabels = {
  datajud: 'CNJ / DataJud', encerramentos: 'Encerramentos', liminar: 'Liminar',
  andamentos: 'Andamentos', pagamentos: 'Pagamentos', protocolos: 'Protocolos',
};
export type JobService = keyof typeof serviceLabels;
export const statusLabels = {
  QUEUED: 'Na fila', RUNNING: 'Em execução', COMPLETED: 'Concluído',
  FAILED: 'Falhou', CANCELLED: 'Cancelado', UNKNOWN: 'Desconhecido',
};
type JobStatus = keyof typeof statusLabels;
type Coverage = {state: string; reason: string | null};
type JobRef = {service: JobService; job_id: string};
export type AutomationJob = JobRef & {
  kind: string | null;
  created_by: string | null;
  created_at: string | null;
  finished_at: string | null;
  status: JobStatus;
  total: number | null;
  processed: number | null;
  success: number | null;
  errors: number | null;
  coverage: Coverage | null;
  correlation: {shared?: boolean} | null;
};
type Pagination = {next_cursor: string | null};
type JobPage = {
  rows: AutomationJob[];
  pagination: Pagination;
  partial: boolean;
  sources: {service: JobService; state: 'AVAILABLE' | 'UNAVAILABLE'}[];
};
type ItemPage = {
  items: {item_id: string; status: string | null; record: Record<string, string | number | boolean | null> | null}[];
  pagination: Pagination;
  coverage: Coverage;
};

type Api = {request: <T>(path: string, options?: RequestInit) => Promise<T>};
const base = '/api/automations/jobs';

function request<T>(path: string, signal: AbortSignal): Promise<T> {
  const api = (window as Window & {MBA_AUTOMATION_API?: Api}).MBA_AUTOMATION_API;
  if (!api) throw new Error('A API do Backoffice não foi inicializada.');
  return api.request<T>(path, {signal});
}

function jobPath(job: JobRef) {
  return `${base}/${encodeURIComponent(job.service)}/${encodeURIComponent(job.job_id)}`;
}

export function listJobs(filters: Record<string, string>, cursor: string | null, signal: AbortSignal) {
  const query = new URLSearchParams(filters);
  query.set('limit', '25');
  if (cursor) query.set('cursor', cursor);
  return request<JobPage>(`${base}?${query}`, signal);
}

export function getJob(job: JobRef, signal: AbortSignal) {
  return request<AutomationJob>(jobPath(job), signal);
}

export function getJobItems(job: JobRef, cursor: string | null, signal: AbortSignal) {
  const query = new URLSearchParams({limit: '50'});
  if (cursor) query.set('cursor', cursor);
  return request<ItemPage>(`${jobPath(job)}/items?${query}`, signal);
}
