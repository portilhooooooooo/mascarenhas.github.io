export type PagamentoOperacaoStatus =
  | 'IMPORTADO'
  | 'NA_FILA'
  | 'EM_APROVACAO'
  | 'EM_RETIFICACAO'
  | 'PAGO_SEM_COMPROVANTE'
  | 'PAGO_COM_COMPROVANTE'
  | 'ACAO_NECESSARIA';

export interface PagamentoOperacaoImport {
  id: string;
  filename?: string | null;
  file_hash?: string | null;
  total_rows?: number | null;
  valid_rows?: number | null;
  rejected_rows?: number | null;
  created_at?: string | null;
  completed_at?: string | null;
}

export interface PagamentoOperacaoSummary {
  session?: { state: string; updated_at?: string | null; message?: string | null };
  importacao: PagamentoOperacaoImport | null;
  statuses: Partial<Record<PagamentoOperacaoStatus, number>>;
  active_total: number;
  concluded_total: number;
  queues?: { provision?: number; receipt?: number };
  updated_at?: string | null;
}

export interface PagamentoOperacaoItem {
  id: string;
  processo?: string | null;
  pasta?: string | null;
  identificador_input?: string | null;
  valor_input?: number | string | null;
  pagamentos_situacao?: string | null;
  pagamentos_match?: 'VALOR' | 'PASTA' | 'PROCESSO' | 'NAO_ENCONTRADO' | null;
  status_operacional: PagamentoOperacaoStatus;
  benner_identifier?: string | null;
  provision_amount?: number | string | null;
  provision_status?: string | null;
  provision_analysis_status?: string | null;
  receipt_analysis_status?: string | null;
  receipt_found?: boolean | null;
  receipt_amount_matches?: boolean | null;
  receipt_filename?: string | null;
  available_identifiers?: Array<{identifier?: string; status?: string | null; value?: string | null}> | null;
  automation_message?: string | null;
  automation_updated_at?: string | null;
  updated_at?: string | null;
}

export interface PagamentoOperacaoImportResult {
  import_id: string;
  rows_imported: number;
  concluded: number;
  reactivated: number;
  automation_dispatched: boolean;
  importacao?: PagamentoOperacaoImport;
  identified_fields?: string[];
  header_row?: number;
}

type BackofficeApi = {
  request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
};

function api(): BackofficeApi {
  const client = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!client) throw new Error('A API do Backoffice não foi inicializada.');
  return client;
}

export async function getPagamentoOperacaoSummary(): Promise<PagamentoOperacaoSummary> {
  return api().request<PagamentoOperacaoSummary>('/api/operacao/pagamentos/summary');
}

export async function getPagamentoOperacaoItems(status?: PagamentoOperacaoStatus): Promise<PagamentoOperacaoItem[]> {
  const rows: PagamentoOperacaoItem[] = [];
  const pageSize = 200;
  let offset = 0;
  for (let page = 0; page < 50; page += 1) {
    const params = new URLSearchParams({limit: String(pageSize), offset: String(offset)});
    if (status) params.set('status', status);
    const result = await api().request<{rows?: PagamentoOperacaoItem[]}>('/api/operacao/pagamentos/items?' + params.toString());
    const batch = result.rows || [];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

export async function importPagamentoOperacao(file: File): Promise<PagamentoOperacaoImportResult> {
  const body = new FormData();
  body.append('file', file);
  return api().request<PagamentoOperacaoImportResult>('/api/operacao/pagamentos/importar', {
    method: 'POST',
    body,
  });
}

export async function startPagamentoOperacao(): Promise<{started: boolean; total: number; import_id?: string}> {
  return api().request('/api/operacao/pagamentos/run', {method: 'POST'});
}
