export type DateType = 'entry' | 'resolution';

export interface CarteiraFilters {
  periodStart: string;
  periodEnd: string;
  dateType: DateType;
  state: string;
  product: string;
  situation: '' | 'active' | 'closed' | 'unknown';
  resolution: string;
  groupBy: 'day' | 'week' | 'month';
}

export interface LabeledValue { label: string; value: number }
export interface TimelinePoint { date: string; entries: number; closures: number }

export interface CarteiraData {
  summary: {
    total: number;
    active: number;
    closed: number;
    unknown: number;
    aging_mean: number | null;
  };
  movement: { entries: number; closures: number; balance: number };
  charts: {
    timeline: TimelinePoint[];
    por_uf: LabeledValue[];
    por_produto: LabeledValue[];
    aging: LabeledValue[];
  };
  filters: { states: string[]; resolutions: string[]; products: string[] };
  updated_at: string | null;
}

declare global { interface Window { MBA_AUTOMATION_API?: { request: (path: string, options?: RequestInit) => Promise<unknown> } } }

export async function getCarteiraData(filters: CarteiraFilters): Promise<CarteiraData> {
  const params = new URLSearchParams({
    group_by: filters.groupBy,
    page: '1',
    page_size: '10',
  });
  if (filters.periodStart) params.set(filters.dateType === 'entry' ? 'entry_start' : 'resolution_start', filters.periodStart);
  if (filters.periodEnd) params.set(filters.dateType === 'entry' ? 'entry_end' : 'resolution_end', filters.periodEnd);
  if (filters.state) params.set('state', filters.state);
  if (filters.product) params.set('product', filters.product);
  if (filters.situation) params.set('situation', filters.situation);
  if (filters.resolution) params.set('resolution', filters.resolution);

  if (!window.MBA_AUTOMATION_API) throw new Error('A API do Backoffice não foi inicializada.');
  try {
    return await window.MBA_AUTOMATION_API.request(`/api/carteira-processual?${params}`) as CarteiraData;
  } catch (error) {
    if (error instanceof TypeError && /fetch/i.test(error.message)) {
      throw new Error('A API do Backoffice não respondeu. Verifique se o backend publicado está ativo e atualizado.');
    }
    throw error;
  }
}
