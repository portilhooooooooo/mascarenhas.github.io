import type { ProtocoloItem } from './protocoloService';

const STAGES: Record<string, string> = {
  CLAIMED: 'Preparando tarefa', RUN_STARTED: 'Abrindo tarefa',
  DOCUMENTS_MATCHED: 'Documentos relacionados', DOCUMENT_INTAKE: 'Conferência documental',
  DOCUMENT_MATCHING: 'Conferência documental', PROGRESS_SELECTION: 'Selecionando andamento',
  DOCUMENT_INPUT: 'Localizando campos de documento', DOCUMENT_ATTACH: 'Anexando documentos',
  DOCUMENT_SUBMITTING: 'Enviando documentos', DOCUMENT_UPLOAD_SUBMITTING: 'Enviando documentos',
  ERP_CONFIRMATION: 'Confirmando ERP', ERP_SUBMITTING: 'Aguardando confirmação do ERP',
  ERP_SUBMITTED: 'Enviado à Enter', RECONCILED: 'Reconciliado com a Controladoria',
  RETRY_RECONCILIATION: 'Conferindo estado na Enter', RETRY_REQUESTED: 'Aguardando nova tentativa',
  RETRY_PENDING: 'Aguardando nova tentativa', RETRY_EXHAUSTED: 'Revisão necessária',
  WORKER: 'Execução do agente',
};
const ERRORS: Record<string, string> = {
  DOCUMENT_ATTACH_FAILED: 'Não foi possível anexar os documentos',
  DOCUMENT_INPUT_NOT_FOUND: 'Os campos de documento não ficaram disponíveis',
  PROGRESS_SELECTION_FAILED: 'Não foi possível selecionar o andamento',
  TASK_OPEN_FAILED: 'Não foi possível abrir a tarefa da Enter',
  BROWSER_CLOSED: 'A sessão do navegador foi interrompida',
  EXTERNAL_STATE_UNCERTAIN: 'O estado da tarefa na Enter não pôde ser confirmado',
  ERP_SUBMISSION_UNCERTAIN: 'O envio ao ERP não pôde ser confirmado',
  UNEXPECTED_WORKER_ERROR: 'A execução foi interrompida e precisa de revisão',
};
export function protocolDetail(item: ProtocoloItem): string {
  if (item.status === 'PENDING' && ['INTERRUPTED_RESTART', 'RECOVERED_AFTER_RESTART'].includes(item.stage || ''))
    return 'Execução anterior interrompida por reinicialização';
  if (['PENDING', 'RUNNING'].includes(item.status))
    return item.retry_count ? `Nova tentativa automática — ${item.retry_count} de 5` : 'Fluxo automático';
  if (item.status === 'HUMAN_NECESSARY')
    return item.human_reason || ERRORS[item.error_code || ''] || item.error_message || 'Revisão necessária';
  return item.status === 'ENVIADO' ? 'Aguardando reconciliação com a Controladoria' : 'Fluxo automático';
}
export function protocolStage(item: ProtocoloItem): string {
  if (item.status === 'PENDING' && ['INTERRUPTED_RESTART', 'RECOVERED_AFTER_RESTART'].includes(item.stage || '')) return 'Aguardando retomada';
  return STAGES[item.stage || ''] || 'Acompanhamento';
}
export const SESSION_LABELS: Record<string, string> = {
  idle: 'Não iniciada', starting: 'Iniciando…', authenticating: 'Autenticando…',
  connected: 'Conectada', in_use: 'Em uso', lost: 'Sessão perdida', unknown: 'Verificando sessão',
};
