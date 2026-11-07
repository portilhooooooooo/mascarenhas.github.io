export type ClosingStatus = 'PENDENTES' | 'APTOS' | 'INAPTOS' | 'EM_FASE_RECURSAL' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA' | 'ENVIADOS_BENNER';
export type ClosingType = 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA';
export type ClosingValidatedFilter = 'todos' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA' | 'ACORDO';

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
  analisado_em?: string | null;
  fase_recursal?: boolean | null;
  status_envio?: 'NAO_ENVIADO' | 'NA_FILA' | 'PROCESSANDO' | 'ERRO' | 'ENVIADO';
  enviado_benner_em?: string | null;
  benner_referencia?: string | null;
  benner_erro?: string | null;
  observacoes_analista?: string | null;
  tem_motivo_derrota?: boolean | null;
  motivo_derrota_verificado_em?: string | null;
  atualizado_em?: string | null;
}

export type MotivoDerrotaFilter = 'todos' | 'sim' | 'nao' | 'nao_verificado';
export type ClosingIndicioFilter = 'todos' | 'INDETERMINADO' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'VITORIA' | 'ACORDO' | 'EXTINCAO';

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
export function getClosingCases(status: ClosingStatus, limit: number, offset: number, search = '', motivoDerrota: MotivoDerrotaFilter = 'todos', indicio: ClosingIndicioFilter = 'todos', enviado: 'todos' | 'sim' | 'nao' = 'todos', tipoValidado: ClosingValidatedFilter = 'todos', signal?:AbortSignal): Promise<ClosingList> {
  const query = new URLSearchParams({status, limit: String(limit), offset: String(offset)});
  if (search.trim()) query.set('q', search.trim());
  if (motivoDerrota !== 'todos') query.set('motivo_derrota', motivoDerrota);
  if (indicio !== 'todos') query.set('indicio', indicio);
  if (enviado !== 'todos') query.set('enviado_benner', enviado);
  if (tipoValidado !== 'todos') query.set('tipo_validado', tipoValidado);
  return api().request('/api/operacao/encerramentos/items?' + query,{signal});
}
export function sendClosingsToBenner(items: {cnj: string; andamento: string}[]): Promise<ClosingSendResult> {
  return api().request('/api/operacao/encerramentos/enviar-benner', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({items}),
  });
}


/** Evidence-only DataJud V3 snapshots; NOT human-reviewed closing aptness. */
export interface DataJudV3Snapshot {
  state: 'PARTIAL' | 'COMPLETE' | 'NOT_IMPORTED';
  source: 'DATAJUD_V3';
  source_job_id?: string;
  expected_total?: number;
  captured_total?: number;
  remaining_unchecked?: number;
  succeeded?: number;
  failed?: number;
  not_found?: number;
  verified_raw?: number;
  matched_cases?: number;
  unknown_cases?: number;
  preliminary_candidates?: number;
  preliminary_with_blocker?: number;
  source_last_at?: string | null;
  imported_at?: string | null;
  requires_human_review?: boolean;
}
export interface DataJudV3ResultRow {
  cnj: string;
  source_capture_status: 'SUCESSO' | 'ERRO' | 'NAO_ENCONTRADO';
  consultado_em?: string | null;
  identity_state: 'MATCHED' | 'UNMATCHED' | 'AMBIGUOUS';
  classificacao_preliminar?: string | null;
  indicio_apto?: boolean | null;
  evidencia_verificada: boolean;
  bloqueio_reportado?: boolean | null;
  ultima_movimentacao_em?: string | null;
  validacao_humana: 'NAO_INFERIDA_DESTA_FONTE';
  pode_enviar_benner: false;
}
export interface DataJudV3ResultList {
  rows: DataJudV3ResultRow[];
  total: number;
  limit: number;
  offset: number;
  completion_state: 'PARTIAL' | 'COMPLETE';
}

export function getDataJudV3Snapshot(): Promise<DataJudV3Snapshot> {
  return api().request('/api/operacao/encerramentos/datajud-v3');
}

export function getDataJudV3Results(
  status: 'TODOS' | 'SUCESSO' | 'ERRO' | 'NAO_ENCONTRADO',
  limit: number,
  offset: number,
  search = '',
): Promise<DataJudV3ResultList> {
  const query = new URLSearchParams({status,limit:String(limit),offset:String(offset)});
  if (search.trim()) query.set('q',search.trim());
  return api().request('/api/operacao/encerramentos/datajud-v3/items?' + query);
}
