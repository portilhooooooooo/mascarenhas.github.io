export interface AgreementIndicator { label: string; value: number }
export interface AgreementIndicatorRow { id: string | number; origem_acordo: string | null; cnj: string | null; situacao: string | null; tipo: string | null; tarefa: string | null; proposta: number | null }
export interface AgreementsIndicatorsData {
  summary: {
    total: number;
    ticket_medio: number | null;
    fechados: number;
    em_negociacao: number;
    recusados: number;
    propostas_validas: number;
  };
  por_situacao: AgreementIndicator[];
  por_tarefa: AgreementIndicator[];
  por_tipo: AgreementIndicator[];
  table: { rows: AgreementIndicatorRow[]; page: number; page_size: number; total: number; total_pages: number };
  quality: { situacoes_validas: number; tarefas_validas: number; tipos_validos: number; propostas_invalidas: number };
}

export async function getAgreementsIndicators(page = 1, origin = ''): Promise<AgreementsIndicatorsData> {
  if (!window.MBA_AUTOMATION_API) throw new Error('A API do Backoffice não foi inicializada.');
  const params = new URLSearchParams({ page: String(page), page_size: '10' });
  if (origin) params.set('origem_acordo', origin);
  try {
    return await window.MBA_AUTOMATION_API.request(`/api/acordos-indicadores?${params}`) as AgreementsIndicatorsData;
  } catch (error) {
    if (error instanceof TypeError && /fetch/i.test(error.message)) {
      throw new Error('A API do Backoffice não respondeu. Verifique se o backend publicado está ativo e atualizado.');
    }
    throw error;
  }
}
