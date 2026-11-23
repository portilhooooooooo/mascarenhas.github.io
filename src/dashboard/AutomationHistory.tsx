import {useState, type FormEvent} from 'react';
import {QueryClient, QueryClientProvider, useInfiniteQuery, useQuery, useQueryClient} from '@tanstack/react-query';
import {getJob, getJobItems, listJobs, serviceLabels, statusLabels, type AutomationJob, type JobService} from './automationJobsService';

const uuid = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';
const dateFormat = new Intl.DateTimeFormat('pt-BR', {dateStyle: 'short', timeStyle: 'short'});
const dateLabel = (date: string | null) => date ? dateFormat.format(new Date(date)) : '—';
const coverageReasons: Record<string, string> = {
  ITEMS_LINKED_BY_LATEST_IMPORT: 'Os itens refletem apenas a importação mais recente que os atualizou.',
  NO_BATCH_CORRELATION: 'A execução não tem um lote associado.',
  ITEMS_NOT_RECORDED: 'A fonte não registra itens para este tipo de execução.',
};
const itemLabels: Record<string, string> = {
  cnj: 'CNJ', capture_status: 'Status da captura', captured_at: 'Capturado em', error_code: 'Código do erro',
  source: 'Fonte', classification: 'Classificação', history_found: 'Histórico encontrado', observed_at: 'Observado em',
  source_row_number: 'Linha do arquivo', movement_date: 'Data do andamento', evidence_ref: 'Referência da evidência',
  status_operacional: 'Status operacional', benner_identifier: 'Identificador Benner', provision_status: 'Status da provisão',
  provision_analysis_status: 'Análise da provisão', receipt_analysis_status: 'Análise do comprovante',
  receipt_found: 'Comprovante encontrado', automation_message: 'Mensagem', updated_at: 'Atualizado em',
  task_id: 'Tarefa', created_at: 'Criado em',
};

type LoadError = Error & {status?: number; code?: string};
function RequestError({error, retry}: {error: LoadError; retry: () => void}) {
  const message = error.code?.includes('CURSOR') ? 'A página expirou. Recarregue a consulta.'
    : error.status === 401 || error.status === 403 ? 'Acesso indisponível para esta sessão.'
      : error.status === 404 ? 'Registro ou serviço indisponível nesta carteira.'
        : error.status === 503 ? 'Fonte temporariamente indisponível.' : 'Não foi possível carregar os dados.';
  return <p role="alert">{message} <button type="button" onClick={retry}>Recarregar</button></p>;
}

function JobDetails({job, close}: {job: AutomationJob; close: () => void}) {
  const client = useQueryClient();
  const key = ['job', job.service, job.job_id];
  const detail = useQuery({queryKey: key, queryFn: ({signal}) => getJob(job, signal)});
  const items = useInfiniteQuery({
    queryKey: [...key, 'items'], queryFn: ({pageParam, signal}) => getJobItems(job, pageParam, signal),
    initialPageParam: null as string | null, getNextPageParam: page => page.pagination.next_cursor,
    enabled: detail.isSuccess,
  });
  const coverage = items.data?.pages[0]?.coverage;
  const records = items.data?.pages.flatMap(page => page.items) ?? [];
  return <section className="automation-job-panel" aria-label="Detalhes da execução">
    <button type="button" onClick={close}>Voltar ao histórico</button>
    <h2>{serviceLabels[job.service]}</h2>
    <p><code>{job.job_id}</code></p>
    {detail.isPending && <p role="status">Carregando execução…</p>}
    {detail.error && <RequestError error={detail.error} retry={() => void detail.refetch()}/>}
    {detail.data && <>
      <dl>
        <dt>Status</dt><dd>{statusLabels[detail.data.status]}</dd>
        <dt>Usuário</dt><dd>{detail.data.created_by ?? '—'}</dd>
        <dt>Criação</dt><dd>{dateLabel(detail.data.created_at)}</dd>
        <dt>Fim</dt><dd>{dateLabel(detail.data.finished_at)}</dd>
        <dt>Processados / total</dt><dd>{detail.data.processed ?? '—'} / {detail.data.total ?? '—'}</dd>
        <dt>Sucessos / erros</dt><dd>{detail.data.success ?? '—'} / {detail.data.errors ?? '—'}</dd>
      </dl>
      {detail.data.correlation?.shared && <p>Lote compartilhado</p>}
      <h3>Itens</h3>
      {items.isPending && <p role="status">Carregando itens…</p>}
      {items.error && <RequestError error={items.error} retry={() => void client.resetQueries({queryKey: [...key, 'items']})}/>}
      {coverage && coverage.state !== 'AVAILABLE' && <p role="status">
        {coverage.state === 'PARTIAL' ? 'Cobertura parcial. ' : 'Itens indisponíveis. '}
        {coverage.reason && coverageReasons[coverage.reason]}
      </p>}
      {items.isSuccess && coverage?.state === 'AVAILABLE' && !records.length && <p>Nenhum item registrado.</p>}
      {records.length > 0 && <div className="automation-job-table"><table>
        <thead><tr><th scope="col">Item</th><th scope="col">Status</th><th scope="col">Dados</th></tr></thead>
        <tbody>{records.map(item => <tr key={item.item_id}>
          <td>{item.item_id}</td><td>{item.status ?? '—'}</td>
          <td><dl>{Object.entries(item.record).map(([field, value]) => <div key={field}>
            <dt>{itemLabels[field] ?? field}</dt>
            <dd>{typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value ?? '—'}</dd>
          </div>)}</dl></td>
        </tr>)}</tbody>
      </table></div>}
      {items.hasNextPage && !items.isError && <button type="button" disabled={items.isFetching} onClick={() => void items.fetchNextPage()}>Carregar mais itens</button>}
    </>}
  </section>;
}

function HistoryPanel({initialService, enabled}: {initialService: JobService | ''; enabled: boolean}) {
  const [filters, setFilters] = useState<Record<string, string>>(initialService ? {service: initialService} : {});
  const [job, setJob] = useState<AutomationJob | null>(null);
  const [invalidPeriod, setInvalidPeriod] = useState(false);
  const client = useQueryClient();
  const serviceFiltered = Boolean(filters.service);
  const discovery = useQuery({
    queryKey: ['services'], queryFn: ({signal}) => listJobs({}, null, signal),
    enabled: enabled && serviceFiltered, staleTime: 60000,
  });
  const jobs = useInfiniteQuery({
    queryKey: ['jobs', filters], queryFn: ({pageParam, signal}) => listJobs(filters, pageParam, signal),
    initialPageParam: null as string | null, getNextPageParam: page => page.pagination.next_cursor, enabled,
  });
  const sources = serviceFiltered ? discovery.data?.sources : jobs.data?.pages[0]?.sources;
  const services = new Set(sources?.map(source => source.service));
  if (filters.service) services.add(filters.service as JobService);
  const rows = jobs.data?.pages.flatMap(page => page.rows) ?? [];
  const unavailable = Array.from(new Set(jobs.data?.pages.flatMap(page => page.sources.filter(source => source.state === 'UNAVAILABLE').map(source => serviceLabels[source.service]))));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entries = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    for (const [name, raw] of entries) {
      const value = String(raw).trim();
      if (!value) continue;
      if (name === 'created_from' || name === 'created_before') next[name] = new Date(value).toISOString();
      else next[name] = name === 'status' ? value : value.toLowerCase();
    }
    const invalid = Boolean(next.created_from && next.created_before && next.created_from >= next.created_before);
    setInvalidPeriod(invalid);
    if (!invalid) setFilters(next);
  }

  return <>
    <section className="automation-job-panel" aria-label="Histórico de Automações" hidden={job !== null}>
      <h2>Histórico de execuções</h2>
      <form className="automation-job-filters" onSubmit={submit}>
        <label>Serviço<select name="service" defaultValue={initialService}>
          <option value="">Todos</option>
          {Array.from(services).map(service => <option key={service} value={service}>{serviceLabels[service]}</option>)}
        </select></label>
        <label>Status<select name="status">
          <option value="">Todos</option>
          {Object.entries(statusLabels).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
        </select></label>
        <label>ID da execução<input name="job_id" pattern={uuid}/></label>
        <label>ID do usuário<input name="created_by" pattern={uuid}/></label>
        <label>Criado a partir de<input name="created_from" type="datetime-local"/></label>
        <label>Criado antes de<input name="created_before" type="datetime-local"/></label>
        <button type="submit">Filtrar</button>
      </form>
      {invalidPeriod && <p role="alert">O fim do período deve ser posterior ao início.</p>}
      {jobs.isPending && <p role="status">Carregando execuções…</p>}
      {jobs.error && <RequestError error={jobs.error} retry={() => void client.resetQueries({queryKey: ['jobs', filters]})}/>}
      {unavailable.length > 0 && <p role="status">Histórico parcial. Fontes indisponíveis: {unavailable.join(', ')}.</p>}
      {jobs.isSuccess && !rows.length && <p>{jobs.data.pages[0].sources.length ? 'Nenhuma execução para os filtros selecionados.' : 'Nenhum serviço de histórico disponível nesta carteira.'}</p>}
      {rows.length > 0 && <div className="automation-job-table"><table>
        <thead><tr><th scope="col">Execução</th><th scope="col">Serviço</th><th scope="col">Criada em</th><th scope="col">Status</th><th scope="col">Processados / total</th></tr></thead>
        <tbody>{rows.map(row => <tr key={`${row.service}/${row.job_id}`}>
          <td><button type="button" onClick={() => setJob(row)}>{row.job_id}</button></td>
          <td>{serviceLabels[row.service]}{row.correlation?.shared && ' · Lote compartilhado'}</td>
          <td>{dateLabel(row.created_at)}</td><td>{statusLabels[row.status]}</td>
          <td>{row.processed ?? '—'} / {row.total ?? '—'}</td>
        </tr>)}</tbody>
      </table></div>}
      {jobs.hasNextPage && !jobs.isError && <button type="button" disabled={jobs.isFetching} onClick={() => void jobs.fetchNextPage()}>Carregar mais execuções</button>}
    </section>
    {enabled && job && <JobDetails job={job} close={() => setJob(null)}/>}
  </>;
}

export function AutomationHistory(props: {initialService: JobService | ''; enabled: boolean}) {
  const [client] = useState(() => new QueryClient({defaultOptions: {queries: {retry: false, refetchOnWindowFocus: false}}}));
  return <QueryClientProvider client={client}><HistoryPanel {...props}/></QueryClientProvider>;
}
