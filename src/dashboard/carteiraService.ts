export interface CarteiraFilters {
  entryStart: string;
  entryEnd: string;
  resolutionStart: string;
  resolutionEnd: string;
  state: string;
  resolution: string;
  cnj: string;
  integration: string;
  groupBy: 'day' | 'week' | 'month';
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
}

export interface LabeledValue { label: string; value: number }
export interface CarteiraRow { id: string; cnj: string | null; integration: string | null; date: string | null; state: string | null; aging: number | string | null; resolution: string | null; date_resolution: string | null; situation_cpj: string | null; adverse_lawyer: string | null }
export interface CarteiraData {
  summary: { total: number; entries: number };
  charts: { entradas_timeline: Array<LabeledValue & { date: string }>; por_uf: LabeledValue[]; aging: LabeledValue[]; por_situacao: LabeledValue[] };
  table: { rows: CarteiraRow[]; page: number; page_size: number; total: number };
  filters: { states: string[]; resolutions: string[] };
  available_fields: { tema: boolean; materia: boolean; encerrado: boolean; apto_encerramento: boolean; tipo_encerramento: boolean; status_source: string };
}

declare global { interface Window { MBA_AUTOMATION_API?: { request: (path: string) => Promise<unknown> } } }

export async function getCarteiraData(filters: CarteiraFilters): Promise<CarteiraData> {
  const params = new URLSearchParams();
  const mapping: Record<string, string> = { entryStart: 'entry_start', entryEnd: 'entry_end', resolutionStart: 'resolution_start', resolutionEnd: 'resolution_end', state: 'state', resolution: 'resolution', cnj: 'cnj', integration: 'integration', groupBy: 'group_by', page: 'page', pageSize: 'page_size', sortBy: 'sort_by', sortDirection: 'sort_direction' };
  Object.entries(filters).forEach(([key, value]) => { if (value !== '') params.set(mapping[key], String(value)); });
  if (!window.MBA_AUTOMATION_API) throw new Error('A API do Backoffice não foi inicializada.');
  return window.MBA_AUTOMATION_API.request(`/api/carteira-processual?${params}`) as Promise<CarteiraData>;
}
