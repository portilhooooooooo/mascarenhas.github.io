export interface PaymentAnalyticsFilters {
  startDate: string;
  endDate: string;
  firm: string;
  situation: string;
  type: string;
  requester: string;
}

export interface PaymentOverview {
  importacao: { updated_at?: string; created_at?: string } | null;
  cards: {
    total_pago: number;
    quantidade_pagamentos: number;
    ticket_medio: number;
    tempo_medio_pagamento_dias: number | null;
    credenciados_ativos: number;
  };
  evolucao_pagamentos: Array<{ periodo: string; valor_total_pago: number }>;
  pagamentos_por_credenciado: Array<{ credenciado: string; valor_total_pago: number }>;
  tempo_por_credenciado: Array<{ credenciado: string; tempo_medio_dias: number; quantidade: number; mediana_dias: number; minimo_dias: number; maximo_dias: number }>;
  paid_statuses_configurados: string[];
}

export interface PaymentAnalyticsData {
  overview: PaymentOverview;
  firms: string[];
  situations: string[];
  types: string[];
  statusCounts: Array<{ label: string; value: number }>;
  pendingApproval: number;
  cancelled: number;
  liquidated: number;
  nature: Array<{ label: string; value: number }>;
  ticketByFirm: Array<{ label: string; value: number }>;
  requestsByFirm: null;
  timeByFirm: Array<{ label: string; value: number }>;
  updatedAt: string | null;
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
}

function params(filters: PaymentAnalyticsFilters, overrides: Partial<PaymentAnalyticsFilters> = {}) {
  const current = { ...filters, ...overrides };
  const query = new URLSearchParams();
  if (current.startDate) query.set('data_inicio', current.startDate);
  if (current.endDate) query.set('data_fim', current.endDate);
  if (current.firm) query.set('credenciado', current.firm);
  if (current.situation) query.set('situacao', current.situation);
  if (current.type) query.set('tipo_pagamento', current.type);
  if (current.requester) query.set('solicitante', current.requester);
  return query;
}

async function request<T>(path: string): Promise<T> {
  if (!window.MBA_AUTOMATION_API) throw new Error('A API do Backoffice não foi inicializada.');
  return await window.MBA_AUTOMATION_API.request(path) as T;
}

async function countWith(filters: PaymentAnalyticsFilters, field: 'situation' | 'type', value: string) {
  const query = params(filters, field === 'situation' ? { situation: value } : { type: value });
  query.set('page', '1'); query.set('page_size', '1');
  const result = await request<{ total: number }>(`/api/pagamentos?${query}`);
  return result.total ?? 0;
}

async function overviewWith(filters: PaymentAnalyticsFilters, overrides: Partial<PaymentAnalyticsFilters> = {}) {
  return await request<PaymentOverview>(`/api/pagamentos/resumo?${params(filters, overrides)}`);
}

export async function getPaymentAnalytics(filters: PaymentAnalyticsFilters): Promise<PaymentAnalyticsData> {
  const baseQuery = params(filters);
  const sampleQuery = new URLSearchParams(baseQuery);
  sampleQuery.set('page', '1'); sampleQuery.set('page_size', '200');

  const [overview, firmOptions, situationOptions, sample] = await Promise.all([
    overviewWith(filters),
    request<{ rows: string[] }>('/api/pagamentos/credenciados'),
    request<{ rows: string[] }>('/api/pagamentos/situacoes'),
    request<{ rows: Array<{ tipo_pagamento?: string | null }> }>(`/api/pagamentos?${sampleQuery}`),
  ]);

  const situations = situationOptions.rows ?? [];
  const firms = firmOptions.rows ?? [];
  const types = [...new Set((sample.rows ?? []).map(row => String(row.tipo_pagamento ?? '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const statusCounts = await Promise.all(situations.map(async label => ({ label, value: await countWith(filters, 'situation', label) })));
  const pendingApproval = statusCounts.filter(item => normalize(item.label).includes('aprova')).reduce((sum, item) => sum + item.value, 0);
  const cancelled = statusCounts.filter(item => normalize(item.label).includes('cancel')).reduce((sum, item) => sum + item.value, 0);
  const liquidated = overview.cards.quantidade_pagamentos ?? 0;

  const agreementType = types.find(value => normalize(value).includes('acordo'));
  const condemnationType = types.find(value => normalize(value).includes('conden'));
  const nature: Array<{ label: string; value: number }> = [];
  if (condemnationType) nature.push({ label: 'Condenação', value: await countWith(filters, 'type', condemnationType) });
  if (agreementType) nature.push({ label: 'Acordos', value: await countWith(filters, 'type', agreementType) });

  const rankedFirms = overview.pagamentos_por_credenciado.slice(0, 6).map(item => item.credenciado);
  const ticketByFirm = await Promise.all(rankedFirms.map(async firm => ({ label: firm, value: (await overviewWith(filters, { firm })).cards.ticket_medio ?? 0 })));
  const timeByFirm = overview.tempo_por_credenciado
    .slice().sort((a, b) => a.tempo_medio_dias - b.tempo_medio_dias)
    .slice(0, 6)
    .map(item => ({ label: item.credenciado, value: item.tempo_medio_dias }));

  return {
    overview,
    firms,
    situations,
    types,
    statusCounts: statusCounts.filter(item => item.value > 0),
    pendingApproval,
    cancelled,
    liquidated,
    nature,
    ticketByFirm,
    requestsByFirm: null,
    timeByFirm,
    updatedAt: overview.importacao?.updated_at ?? overview.importacao?.created_at ?? null,
  };
}
