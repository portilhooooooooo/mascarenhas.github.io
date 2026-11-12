import {useCallback,useEffect,useState} from 'react';
import {AlertTriangle,ChevronLeft,ChevronRight,RefreshCcw} from 'lucide-react';
import {
  getDataJudV3Snapshot,getDataJudV3Results,
  type DataJudV3Snapshot,type DataJudV3ResultList,
} from './operacaoEncerramentosService';

type CaptureStatus = 'TODOS'|'SUCESSO'|'ERRO'|'NAO_ENCONTRADO';
const formatted = (number?:number|null) => new Intl.NumberFormat('pt-BR').format(number ?? 0);
const timestamp = (value?:string|null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
};

/** DataJud observations are NEVER an approval to close a proceeding. */
export function DataJudEvidencePanel({portfolioId,canView}:{
  portfolioId:string;canView:boolean;
}) {
  const active=portfolioId==='agibank_mba' && canView;
  const [snapshot,setSnapshot]=useState<DataJudV3Snapshot|null>(null);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [status,setStatus]=useState<CaptureStatus>('TODOS');
  const [query,setQuery]=useState('');
  const [appliedQuery,setAppliedQuery]=useState('');
  const [page,setPage]=useState(0);
  const [rows,setRows]=useState<DataJudV3ResultList|null>(null);
  const [listError,setListError]=useState('');
  const [revision,setRevision]=useState(0);

  const reload=useCallback(async()=>{
    if (!active) return;
    setLoading(true);
    try {
      const result=await getDataJudV3Snapshot();
      if (result.source!=='DATAJUD_V3') throw new Error('Origem DataJud inesperada');
      setSnapshot(result);setError('');setRevision(v=>v+1);
    } catch {
      setError('Não foi possível consultar o snapshot DataJud V3.');
    } finally {setLoading(false);}
  },[active]);

  useEffect(()=>{
    if (!active) {setSnapshot(null);setRows(null);return;}
    void reload();
    const timer=window.setInterval(()=>{if(!document.hidden)void reload();},300000);
    return ()=>window.clearInterval(timer);
  },[active,reload]);

  useEffect(()=>{
    if (!active||!expanded||!snapshot||snapshot.state==='NOT_IMPORTED')return;
    let cancelled=false;
    setListError('');
    void getDataJudV3Results(status,15,page*15,appliedQuery)
      .then(result=>{if(!cancelled)setRows(result);})
      .catch(()=>{if(!cancelled)setListError('Não foi possível consultar a relação DataJud.');});
    return ()=>{cancelled=true;};
  },[active,expanded,snapshot?.source_job_id,snapshot?.state,status,page,appliedQuery,revision]);

  if (!active)return null;
  const captured=snapshot?.captured_total??0;
  const expected=snapshot?.expected_total??0;
  const indicators:Array<{key:CaptureStatus;label:string;value:number}>= [
    {key:'TODOS',label:'Consultas registradas',value:captured},
    {key:'SUCESSO',label:'Sucesso verificado',value:snapshot?.succeeded??0},
    {key:'ERRO',label:'Erros',value:snapshot?.failed??0},
    {key:'NAO_ENCONTRADO',label:'Não encontrados',value:snapshot?.not_found??0},
  ];
  const lastPage=Math.max(1,Math.ceil((rows?.total??0)/15));

  return <section className="protocolos-card protocolos-workspace operacao-workspace" aria-label="Resultados da execução DataJud V3">
    <header className="protocolos-workspace-head">
      <div>
        <h2>DataJud — Consulta de novembro</h2>
        <p>{snapshot?.state==='PARTIAL'?'Execução parcial':snapshot?.state==='COMPLETE'?'Execução completa':'Histórico em verificação'}
          {expected>0?' · '+formatted(captured)+' de '+formatted(expected)+' processos consultados':''}
          {snapshot?.source_last_at?' · último resultado '+timestamp(snapshot.source_last_at):''}
        </p>
      </div>
      <div className="protocolos-toolbar-actions">
        <button type="button" className="protocolos-button secondary" onClick={()=>void reload()} disabled={loading}>
          <RefreshCcw size={14}/>Atualizar
        </button>
      </div>
    </header>
    {error?<div className="protocolos-alert error" role="alert"><AlertTriangle size={15}/><span>{error}</span></div>:null}
    {snapshot?.state==='NOT_IMPORTED'?<p>Não há importação DataJud disponível para esta carteira.</p>:null}
    {snapshot?.state!=='NOT_IMPORTED' && snapshot?
      <>
        <div className="protocolos-status-strip-react operacao-encerramentos-status" role="group" aria-label="Situação das consultas DataJud">
          {indicators.map(item=><button type="button" key={item.key}
            className={expanded&&status===item.key?'active':''}
            aria-pressed={expanded&&status===item.key}
            onClick={()=>{setStatus(item.key);setPage(0);setExpanded(true);}}>
            <span>{item.label}</span><strong>{formatted(item.value)}</strong>
          </button>)}
        </div>
        <p className="protocolos-workspace-note">
          <strong>{formatted(snapshot.preliminary_candidates)} indícios preliminares</strong> entre consultas bem-sucedidas
          {snapshot.preliminary_with_blocker?' · '+formatted(snapshot.preliminary_with_blocker)+' com bloqueio registrado':''}.
          São indícios DataJud, <strong>não aptidões validadas</strong>; a fila de encerramentos exige revisão humana.
          {snapshot.unknown_cases?' · '+formatted(snapshot.unknown_cases)+' CNJs sem correspondência na Base Geral':''}
          {snapshot.remaining_unchecked?' · '+formatted(snapshot.remaining_unchecked)+' ainda sem resultado nesta execução':''}.
        </p>
        {expanded?
          <>
            <div className="protocolos-toolbar">
              <form className="protocolos-search" onSubmit={event=>{event.preventDefault();setAppliedQuery(query);setPage(0);}}>
                <input value={query} onChange={event=>setQuery(event.target.value)}
                  placeholder="Buscar CNJ na execução…" aria-label="Buscar CNJ no DataJud"/>
              </form>
              <button type="button" className="protocolos-button secondary" onClick={()=>{setExpanded(false);setRows(null);}}>
                Recolher resultados
              </button>
            </div>
            {listError?<div role="alert">{listError}</div>:null}
            <div className="protocolos-table-wrap">
              <table className="protocolos-table-react">
                <thead><tr>
                  <th>Processo</th><th>Consulta DataJud</th><th>Indício preliminar</th><th>Revisão</th><th>Consultado em</th>
                </tr></thead>
                <tbody>
                  {(rows?.rows??[]).map(row=><tr key={row.cnj}>
                    <td><strong className="protocolos-cnj">{row.cnj}</strong></td>
                    <td>{row.source_capture_status==='SUCESSO'?'Sucesso':
                         row.source_capture_status==='ERRO'?'Erro':'Não encontrado'}
                      {row.identity_state!=='MATCHED'?<small>Identidade pendente</small>:null}</td>
                    <td>{row.evidencia_verificada?row.classificacao_preliminar||'Indeterminado':'Sem evidência verificada'}
                      {row.indicio_apto===true?<small>Indício favorável, sem validação humana</small>:null}
                      {row.bloqueio_reportado?<small>Bloqueio identificado</small>:null}</td>
                    <td>Aguardando validação humana</td>
                    <td>{timestamp(row.consultado_em)}</td>
                  </tr>)}
                  {!rows&&!listError?<tr><td colSpan={5}>Carregando…</td></tr>:null}
                  {rows&&!rows.rows?.length?<tr><td colSpan={5}>Sem resultados nesta seleção.</td></tr>:null}
                </tbody>
              </table>
            </div>
            {rows&&rows.total>0?<footer className="protocolos-pagination">
              <span>{formatted(page*15+1)}–{formatted(Math.min((page+1)*15,rows.total))} de {formatted(rows.total)}</span>
              <div className="protocolos-pagination-controls">
                <button type="button" disabled={page===0} onClick={()=>setPage(n=>Math.max(0,n-1))}
                  aria-label="Página anterior DataJud"><ChevronLeft size={14}/></button>
                <span>{page+1} / {lastPage}</span>
                <button type="button" disabled={page+1>=lastPage} onClick={()=>setPage(n=>n+1)}
                  aria-label="Próxima página DataJud"><ChevronRight size={14}/></button>
              </div>
            </footer>:null}
          </>:null}
      </>:null}
  </section>;
}
