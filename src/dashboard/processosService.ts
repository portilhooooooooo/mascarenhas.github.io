export type ProcessRecord = {
  id: number; cnj: string; portfolio_id: string; carteira?: string; cliente?: string; state?: string;
  fase?: string; situation_cpj?: string; situation_benner?: string; integration?: string;
  product?: string; updated_at?: string; last_movement_at?: string | null; last_movement_title?: string | null;
  situation?: 'Em andamento' | 'Encerrado' | 'Reativado'; situation_source?: 'sistema' | 'movimentacao' | 'presumido'; has_pending_tasks?: boolean | null;
};
export type LinkedTask = {
  task_id: string; process_id: string; type: string; title: string; priority: string;
  status: string; responsible_name?: string; deadline_at?: string;
};
export type TimelineEvent = {
  id: string; kind: 'judicial' | 'system' | 'human_analysis' | 'automation' | 'task';
  source: string; source_id?: string; occurred_at?: string; captured_at?: string;
  title: string; raw_title?: string; degree?: string; code?: string | number; actor_id?: string;
  references?: {source_id?: string; job_id?: string; captured_at?: string; payload_sha256?: string}[];
};
export type Paged<T> = {rows: T[]; total: number; page: number; page_size: number};
export type ProcessDetail = {process: ProcessRecord; cnj: string; permissions: {tasks: boolean; create_task: boolean; task_types: string[]}};
export type Timeline = {rows: TimelineEvent[]; page: number; has_more: boolean; sources: {datajud: {state: string; message?: string}; operational: {state: string}}};
type Api = {request: <T>(path: string, options?: RequestInit) => Promise<T>};
export function processRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const api = (window as Window & {MBA_API?: Api}).MBA_API;
  if (!api) return Promise.reject(new Error('API indisponível.'));
  return api.request<T>(path, options);
}
export const processPath = (cnj: string) => '/api/processos/' + encodeURIComponent(cnj);
