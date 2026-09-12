export type ProtocoloStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'DOCUMENTOS_ENVIADOS'
  | 'ENVIADO'
  | 'DONE'
  | 'HUMAN_NECESSARY';

export interface ControladoriaImportSummary {
  protocolo_rows?: number;
  total_rows?: number;
  completed_at?: string | null;
  created_at?: string | null;
}

export interface DocumentImportSummary {
  total_rows?: number;
  stored_documents?: number;
  ignored_documents?: number;
  failed_rows?: number;
  completed_at?: string | null;
  created_at?: string | null;
}

export interface ProtocoloSummary {
  controladoria: ControladoriaImportSummary | null;
  documents: DocumentImportSummary | null;
  statuses: Partial<Record<ProtocoloStatus, number>>;
}

export interface ProtocoloItem {
  id: string;
  cnj: string;
  task_id: string;
  task_url: string;
  status: ProtocoloStatus;
  stage?: string | null;
  retry_count?: number | null;
  error_code?: string | null;
  human_reason?: string | null;
  retry_allowed?: boolean;
  retry_block_reason?: string | null;
  first_seen_at?: string | null;
  last_seen_at?: string | null;
  started_at?: string | null;
  documents_sent_at?: string | null;
  sent_at?: string | null;
  done_at?: string | null;
  updated_at?: string | null;
  job_id?: string | null;
}

export interface ControladoriaImportResult {
  protocol_tasks: number;
  reconciliation?: { done?: number; reappeared?: number };
}

export interface DocumentImportResult {
  stored: number;
  ignored: number;
  missing: number;
  zipped: number;
  errors: number;
  unrelated_files?: string[];
  jobs?: Array<{ job_id?: string | null; total?: number }>;
}

export interface ProtocoloRetryResult {
  retried: number;
  retried_ids: string[];
  blocked: Array<{ item_id: string; reason?: string | null }>;
  jobs?: Array<{ job_id?: string | null; total?: number }>;
}

type BackofficeApi = {
  request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
  fetch: (path: string, options?: RequestInit) => Promise<Response>;
};

function api(): BackofficeApi {
  const client = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!client) throw new Error('A API do Backoffice não foi inicializada.');
  return client;
}

export async function getProtocoloSummary(): Promise<ProtocoloSummary> {
  return api().request<ProtocoloSummary>('/api/protocolo/summary');
}

export async function getProtocoloItems(status?: ProtocoloStatus): Promise<ProtocoloItem[]> {
  const pageSize = 200;
  const rows: ProtocoloItem[] = [];
  let offset = 0;

  // The API already exposes offset pagination. Pull the complete operational set
  // so the 10/50/100 selector and the status filters remain truthful in the UI.
  for (let page = 0; page < 25; page += 1) {
    const params = new URLSearchParams({ limit: String(pageSize), offset: String(offset) });
    if (status) params.set('status', status);
    const result = await api().request<{ rows?: ProtocoloItem[] }>(`/api/protocolo/items?${params}`);
    const batch = result.rows || [];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return rows;
}

export async function importControladoria(file: File): Promise<ControladoriaImportResult> {
  const body = new FormData();
  body.append('file', file);
  return api().request<ControladoriaImportResult>('/api/protocolo/controladoria', {
    method: 'POST',
    body,
  });
}

export async function importDocuments(relation: File): Promise<DocumentImportResult> {
  const body = new FormData();
  body.append('relation', relation);
  return api().request<DocumentImportResult>('/api/protocolo/documentos', {
    method: 'POST',
    body,
  });
}

export async function retryProtocoloItems(itemIds: string[]): Promise<ProtocoloRetryResult> {
  return api().request<ProtocoloRetryResult>('/api/protocolo/retry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_ids: itemIds }),
  });
}

export async function downloadProtocoloExceptions(): Promise<void> {
  const response = await api().fetch('/api/protocolo/exceptions.xlsx');
  if (!response.ok) throw new Error('Não foi possível baixar as exceções.');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = url;
  link.download = 'excecoes_protocolo.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
