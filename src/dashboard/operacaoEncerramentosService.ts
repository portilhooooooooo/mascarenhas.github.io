export type ClosingStatus = 'PENDENTES' | 'APTOS' | 'INAPTOS' | 'EM_FASE_RECURSAL' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA' | 'ENVIADOS_BENNER';
export type ClosingType = 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA';

export interface ClosingCase {
  portfolio_id: string;
  cnj: string;
  pasta?: string | null;
  comarca?: string | null;
  uf?: string | null;
  datajud_tipo?: string | null;
  datajud_indicio_apto?: boolean | null;
  datajud_consultado_em?: string | null;
  validacao_decisao?: 'apto' | 'nao_apto' | null;
  tipo_validado?: string | null;
  analista_id?: string | null;
  validado_em?: string | null;
  fase_recursal?: boolean | null;
  status_envio?: 'NAO_ENVIADO' | 'NA_FILA' | 'PROCESSANDO' | 'ERRO' | 'ENVIADO';
  enviado_benner_em?: string | null;
  benner_referencia?: string | null;
  atualizado_em?: string | null;
}

export interface ClosingSummary {
  statuses: Record<ClosingStatus, number>;
  total: number;
  backend: { state: string; message?: string | null; updated_at?: string | null };
}
export interface ClosingList {rows: ClosingCase[]; total: number; limit: number; offset: number;}
export interface ClosingSendResult {job_ids: string[]; queued: number; rejected?: number;}

type ApiClient = {request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>};
function api(): ApiClient {
  const client = (window as Window & {MBA_AUTOMATION_API?: ApiClient}).MBA_AUTOMATION_API;
  if (!client) throw new Error('A API do Backoffice não foi inicializada.');
  return client;
}
export function getClosingSummary(): Promise<ClosingSummary> {
  return api().request('/api/operacao/encerramentos/summary');
}
export function getClosingCases(status: ClosingStatus, limit: number, offset: number, search = ''): Promise<ClosingList> {
  const query = new URLSearchParams({status, limit: String(limit), offset: String(offset)});
  if (search.trim()) query.set('q', search.trim());
  return api().request('/api/operacao/encerramentos/items?' + query);
}
export function sendClosingsToBenner(items: {cnj: string; andamento: string}[]): Promise<ClosingSendResult> {
  return api().request('/api/operacao/encerramentos/enviar-benner', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({items}),
  });
}
