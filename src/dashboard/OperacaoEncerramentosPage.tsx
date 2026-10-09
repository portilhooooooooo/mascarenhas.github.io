import {useCallback, useEffect, useMemo, useState} from 'react';
import {AlertTriangle, ChevronLeft, ChevronRight, Clock3, Download, LoaderCircle, RefreshCcw, Search, Send} from 'lucide-react';
import {
  getClosingCases, getClosingSummary, getClosingDivergences, reanalyzeClosingTask, sendClosingsToBenner,
  type ClosingCase, type ClosingStatus, type ClosingSummary, type ClosingType, type MotivoDerrotaFilter,
} from './operacaoEncerramentosService';

const STATUS: Array<{key: ClosingStatus; label: string; tone: string}> = [
  {key:'PENDENTES',label:'Pendentes',tone:'neutral'},
  {key:'APTOS',label:'Aptos',tone:'success'},
  {key:'INAPTOS',label:'Inaptos',tone:'danger'},
  {key:'EM_FASE_RECURSAL',label:'Em fase recursal',tone:'amber'},
  {key:'DERROTA',label:'Derrota',tone:'amber'},
  {key:'DERROTA_VOLUNTARIA',label:'Derrota voluntária',tone:'amber'},
  {key:'VITORIA',label:'Vitória',tone:'success'},
  {key:'CLASSIFICACAO_ERRADA',label:'Classificação errada',tone:'danger'},
  {key:'ENVIADOS_BENNER',label:'Enviados ao Benner',tone:'blue'},
];
const MOVEMENTS: Record<ClosingType, string> = {
  DERROTA:'Apto ao encerramento - Derrota',
  DERROTA_VOLUNTARIA:'Apto ao encerramento - Derrota Voluntária',
  VITORIA:'Apto ao encerramento - Vitória',
};
const count = (value?:number|null) => new Intl.NumberFormat('pt-BR').format(Number(value||0));
const dt = (value?:string|null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
};
const formatCnj = (value:string) => {
  const digits = String(value||'').replace(/\D/g,'');
  return digits.length===20 ? digits.slice(0,7)+'-'+digits.slice(7,9)+'.'+digits.slice(9,13)+'.'+digits.slice(13,14)+'.'+digits.slice(14,16)+'.'+digits.slice(16) : value;
};
function eligible(row:ClosingCase) {
  return !row.classificacao_errada && row.validacao_decisao==='apto' && row.validado_em &&
    Object.prototype.hasOwnProperty.call(MOVEMENTS, row.tipo_validado || '') &&
    !row.enviado_benner_em && !['NA_FILA','PROCESSANDO','ENVIADO'].includes(row.status_envio||'');
}
function exportRows(rows:ClosingCase[]) {
  const headers=['CNJ','PASTA','TIPO DATAJUD','INDÍCIO APTO','DECISÃO HUMANA','CLASSIFICAÇÃO CONFIRMADA','OBSERVAÇÕES DO ANALISTA','TEM MOTIVO DERROTA?','VERIFICADO EM','ANALISTA','VALIDADO EM','BENNER','ERRO BENNER','REFERÊNCIA','ATUALIZADO EM'];
  const data=rows.map(row=>[formatCnj(row.cnj),row.pasta,row.datajud_tipo,row.datajud_indicio_apto,row.validacao_decisao,row.tipo_validado,row.observacoes_analista,row.tem_motivo_derrota===true?'Sim':row.tem_motivo_derrota===false?'Não':'Não verificado',row.motivo_derrota_verificado_em,row.analista_id,row.validado_em,row.status_envio,row.benner_erro,row.benner_referencia,row.atualizado_em]);
  const escape=(value:unknown)=>'"'+String(value??'').replace(/"/g,'""')+'"';
  const csv='\ufeff'+[headers,...data].map(row=>row.map(escape).join(';')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const anchor=document.createElement('a');
  anchor.href=url;anchor.download='operacao_encerramentos_'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.append(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
}

export function OperacaoEncerramentosPage() {
  const [summary,setSummary]=useState<ClosingSummary|null>(null);
  const [rows,setRows]=useState<ClosingCase[]>([]);
  const [total,setTotal]=useState(0);
  const [wrongCount,setWrongCount]=useState(0);
  const [tab,setTab]=useState<ClosingStatus>('PENDENTES');
  const [query,setQuery]=useState('');
  const [appliedQuery,setAppliedQuery]=useState('');
  const [motivoFiltro,setMotivoFiltro]=useState<MotivoDerrotaFilter>('todos');
  const [pageSize,setPageSize]=useState(10);
  const [page,setPage]=useState(1);
  const [loading,setLoading]=useState(true);
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState('');
  const [selected,setSelected]=useState<Record<string,boolean>>({});
  const [movements,setMovements]=useState<Record<string,string>>({});
  const [permissions,setPermissions]=useState({view:false,run:false});
  const canView=permissions.view;
  const canRun=permissions.run;

  const refresh=useCallback(async()=>{
    if(!canView)return;
    try {
      const [nextSummary,wrongOverview,nextList]=await Promise.all([
        getClosingSummary(),
        getClosingDivergences(1,0),
        tab==='CLASSIFICACAO_ERRADA'
          ? getClosingDivergences(pageSize,(page-1)*pageSize,appliedQuery)
          : getClosingCases(tab,pageSize,(page-1)*pageSize,appliedQuery,motivoFiltro),
      ]);
      setWrongCount(Number(wrongOverview.total||0));setSummary(nextSummary);setRows(nextList.rows||[]);setTotal(Number(nextList.total||0));setError('');
    } catch (cause) {
      setError(cause instanceof Error?cause.message:'Não foi possível consultar Encerramentos.');
    } finally {setLoading(false);}
  },[canView,tab,page,pageSize,appliedQuery,motivoFiltro]);

  useEffect(()=>{
    const sync=()=>{
      const current=(window as Window & {MBA_CURRENT_USER?:{permissions?:Record<string,boolean>}}).MBA_CURRENT_USER?.permissions||{};
      setPermissions({view:current['encerramentos.view']===true,run:current['automations.run']===true});
    };
    sync();
    window.addEventListener('mba:authenticated',sync);
    window.addEventListener('mba:profile-ready',sync);
    return ()=>{window.removeEventListener('mba:authenticated',sync);window.removeEventListener('mba:profile-ready',sync);};
  },[]);
  useEffect(()=>{setLoading(true);void refresh();},[refresh]);
  useEffect(()=>{
    if(!canView)return;
    const timer=window.setInterval(()=>{if(!document.hidden&&!submitting)void refresh();},15000);
    return ()=>window.clearInterval(timer);
  },[canView,refresh,submitting]);
  useEffect(()=>{setSelected({});},[tab,page,pageSize,appliedQuery,motivoFiltro]);

  const candidates=useMemo(()=>rows.filter(row=>selected[row.cnj]&&eligible(row)),[rows,selected]);
  const isActionTab=['APTOS','DERROTA','DERROTA_VOLUNTARIA','VITORIA'].includes(tab);
  const maxPage=Math.max(1,Math.ceil(total/pageSize));
  const statusLabel=(row:ClosingCase)=>row.enviado_benner_em?'Enviado ao Benner':
    row.status_envio==='NA_FILA'?'Na fila do Benner':
    row.status_envio==='PROCESSANDO'?'Processando':
    row.status_envio==='ERRO'?'Erro no envio':
    row.validacao_decisao==='apto'?'Apto validado':
    row.fase_recursal?'Em fase recursal · sem acórdão':
    row.validacao_decisao==='nao_apto'?'Inapto validado':'Pendente de análise';
  const send=async()=>{
    if(!canRun||submitting||!candidates.length)return;
    const items=candidates.map(row=>({
      cnj:row.cnj,
      andamento:movements[row.cnj]||MOVEMENTS[row.tipo_validado as ClosingType],
    }));
    if(items.some(item=>!item.andamento)){
      setError('Selecione um andamento válido para cada processo.');
      return;
    }
    if(!window.confirm('Enviar '+items.length+' andamento(s) confirmado(s) ao Benner?'))return;
    setSubmitting(true);setFeedback('');setError('');
    try {
      const result=await sendClosingsToBenner(items);
      setSelected({});
      setFeedback(count(result.queued)+' andamento(s) recebido(s) na fila. A confirmação de envio depende do retorno do Benner.');
      await refresh();
    } catch(cause) {
      setError(cause instanceof Error?cause.message:'Não foi possível iniciar o job do Benner.');
    } finally {setSubmitting(false);}
  };

  if(!canView)return <div className="protocolos-empty"><strong>Sem acesso a Operação / Encerramentos</strong></div>;
  const backend=summary?.backend;
  const busy=backend?.state==='PROCESSANDO'||backend?.state==='NA_FILA';

  return <div className="protocolos-page-react operacao-pagamentos-page operacao-encerramentos-page">
    <header className="protocolos-header"><div><span className="protocolos-eyebrow">OPERAÇÃO</span><h1>Encerramentos</h1></div></header>
    {error?<div className="protocolos-alert error" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>:null}
    {feedback?<p className="protocolos-feedback" role="status">{feedback}</p>:null}
    <section className="protocolos-session-bar" aria-label="Status do backend">
      <div className="protocolos-session-copy">
        <span>Status do backend</span>
        <strong className={'protocolos-session-state '+(busy?'in_use':error?'error':'connected')} aria-live="polite">
          <i aria-hidden="true"/>{loading?'Consultando…':backend?.state==='PROCESSANDO'?'Processando andamentos':backend?.state==='NA_FILA'?'Envios na fila':backend?.state==='ERRO'?'Falhas registradas':backend?.state==='INDISPONIVEL'?'Benner indisponível':'Fila de Encerramentos'}
        </strong>
        <small>{backend?.message||'O envio é confirmado somente após validação no Benner.'}</small>
      </div>
      <button className="protocolos-button secondary" type="button" onClick={()=>void refresh()} disabled={loading||submitting}><RefreshCcw size={14}/>Atualizar</button>
    </section>
    <section className="protocolos-card protocolos-workspace operacao-workspace">
      <header className="protocolos-workspace-head">
        <div><h2>Base operacional</h2><p>Os indícios do DataJud não equivalem a classificações confirmadas. Em fase recursal identifica, apenas em Agibank MBA, a análise humana que confirma apelação ainda sem acórdão. Derrota, Derrota voluntária e Vitória também exigem validação dos analistas.</p></div>
        <div className="protocolos-toolbar-actions">
          <button type="button" className="protocolos-button primary" disabled={!canRun||!isActionTab||!candidates.length||submitting} onClick={()=>void send()}>
            {submitting?<LoaderCircle className="spin" size={15}/>:<Send size={15}/>}Enviar ao Benner ({count(candidates.length)})
          </button>
        </div>
      </header>
      <div className="protocolos-status-strip-react operacao-encerramentos-status" role="tablist" aria-label="Status dos encerramentos">
        {STATUS.map(status=><button type="button" role="tab" aria-selected={tab===status.key} key={status.key} className={(tab===status.key?'active ':'')+status.tone} onClick={()=>{setTab(status.key);setPage(1);}}>
          <span>{status.label}</span><strong>{count(status.key==='CLASSIFICACAO_ERRADA'?wrongCount:summary?.statuses?.[status.key])}</strong>
        </button>)}
      </div>
      <div className="protocolos-toolbar">
        <form className="protocolos-search" onSubmit={event=>{event.preventDefault();setAppliedQuery(query);setPage(1);}}>
          <Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar processo ou pasta…" aria-label="Buscar encerramentos"/>
        </form>
        <div className="protocolos-toolbar-actions">
          <label className="protocolos-page-size"><span>Tem motivo derrota?</span><select aria-label="Filtrar por motivo derrota" value={motivoFiltro} onChange={event=>{setMotivoFiltro(event.target.value as MotivoDerrotaFilter);setPage(1);}}>
            <option value="todos">Todos</option><option value="sim">Sim</option><option value="nao">Não</option><option value="nao_verificado">Não verificado</option>
          </select></label>
          <button type="button" className="protocolos-button secondary operacao-download-button" disabled={loading||!rows.length} onClick={()=>exportRows(rows)}><Download size={14}/>Baixar</button>
          <label className="protocolos-page-size"><span>Exibir</span><select value={pageSize} onChange={event=>{setPageSize(Number(event.target.value));setPage(1);}}>{[10,50,100].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
        </div>
      </div>
      <div className="protocolos-table-wrap">
        <table className="protocolos-table-react operacao-encerramentos-table">
          <thead><tr>{isActionTab?<th><input type="checkbox" aria-label="Selecionar elegíveis" checked={rows.some(eligible)&&rows.filter(eligible).every(row=>selected[row.cnj])} onChange={event=>setSelected(Object.fromEntries(rows.filter(eligible).map(row=>[row.cnj,event.target.checked])))}/></th>:null}<th>Processo / Pasta</th><th>Indício DataJud</th><th>Validação humana</th><th>Observações</th><th>Andamento</th><th>Tem motivo derrota?</th><th>Benner</th><th>Atualização</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan={isActionTab?9:8}><div className="protocolos-empty"><LoaderCircle className="spin" size={20}/><strong>Carregando Encerramentos</strong></div></td></tr>:null}
            {!loading&&!rows.length?<tr><td colSpan={isActionTab?9:8}><div className="protocolos-empty"><Clock3 size={20}/><strong>Nenhum processo neste status</strong><span>Confira os filtros ou aguarde a atualização do backend.</span></div></td></tr>:null}
            {!loading&&rows.map(row=>{
              const canSelect=Boolean(eligible(row));
              const defaultMovement=MOVEMENTS[row.tipo_validado as ClosingType]||'';
              return <tr key={row.portfolio_id+'-'+row.cnj}>
                {isActionTab?<td><input type="checkbox" aria-label={'Selecionar '+formatCnj(row.cnj)} checked={Boolean(selected[row.cnj])} disabled={!canRun||!canSelect||submitting} onChange={event=>setSelected(current=>({...current,[row.cnj]:event.target.checked}))}/></td>:null}
                <td><strong className="protocolos-cnj">{formatCnj(row.cnj)}</strong>{row.classificacao_errada?<small className="operacao-divergence-tag">Classificação errada</small>:null}{row.task_process_id&&row.classificacao_errada&&row.reanalysis_status!=='pending'?<button type="button" className="protocolos-button secondary operacao-reanalyze" disabled={submitting} onClick={async()=>{if(!window.confirm('Reabrir a análise de '+formatCnj(row.cnj)+'? O histórico anterior será preservado.'))return;setSubmitting(true);try{await reanalyzeClosingTask(row.task_process_id!);setFeedback('Processo reaberto para reanálise.');await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível reabrir a análise.');}finally{setSubmitting(false);}}}>Refazer análise</button>:row.classificacao_errada&&row.reanalysis_status==='pending'?<small>Reanálise solicitada</small>:null}<small>{row.pasta?'Pasta '+row.pasta:'Pasta não encontrada'}{row.comarca?' · '+row.comarca+' / '+(row.uf||''):''}</small></td>
                <td><span className="operacao-cell-main">{row.datajud_tipo||'Não classificado'}</span><small>{row.datajud_indicio_apto===true?'Indício favorável':row.datajud_indicio_apto===false?'Indício desfavorável':'Sem indício'}</small></td>
                <td><span className="operacao-cell-main">{row.tipo_validado||statusLabel(row)}</span><small>{row.analisado_em?'Analisado em '+dt(row.analisado_em):row.validado_em?'Confirmado em '+dt(row.validado_em):'Aguardando validação do analista'}</small></td>
                <td><div className="operacao-closing-observation">
                  {row.observacoes_analista
                    ? <details><summary title="Expandir conclusão do analista">{row.observacoes_analista.length>110?row.observacoes_analista.slice(0,110)+'…':row.observacoes_analista}</summary><p>{row.observacoes_analista}</p></details>
                    : <small>Sem análise final registrada</small>}
                </div></td>
                <td>{canSelect&&isActionTab?<select className="operacao-encerramentos-select" aria-label={'Andamento de '+formatCnj(row.cnj)} value={movements[row.cnj]||defaultMovement} onChange={event=>setMovements(current=>({...current,[row.cnj]:event.target.value}))} disabled={submitting}>
                  {Object.entries(MOVEMENTS).map(([key,value])=><option key={key} value={value} disabled={key!==row.tipo_validado}>{value}</option>)}
                </select>:<span className="operacao-cell-main">{defaultMovement||'—'}</span>}</td>
                <td><span className={'operacao-motivo-badge '+(row.tem_motivo_derrota===true?'yes':row.tem_motivo_derrota===false?'no':'unknown')}>
                  {row.tem_motivo_derrota===true?'Sim':row.tem_motivo_derrota===false?'Não':'Não verificado'}</span>
                  {row.motivo_derrota_verificado_em?<small>Verificado em {dt(row.motivo_derrota_verificado_em)}</small>:null}</td>
                <td><span className="operacao-cell-main">{statusLabel(row)}</span><small title={row.benner_erro||undefined}>{row.benner_erro||row.benner_referencia||'Sem confirmação remota'}</small></td>
                <td><span className="protocolos-date">{dt(row.atualizado_em)}</span></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
      {!loading&&total>0?<footer className="protocolos-pagination"><span>{count((page-1)*pageSize+1)}–{count(Math.min(page*pageSize,total))} de {count(total)}</span>
        <div className="protocolos-pagination-controls">
          <button type="button" onClick={()=>setPage(n=>Math.max(1,n-1))} disabled={page<=1} aria-label="Página anterior"><ChevronLeft size={14}/></button>
          <span>{page} / {maxPage}</span>
          <button type="button" onClick={()=>setPage(n=>Math.min(maxPage,n+1))} disabled={page>=maxPage} aria-label="Próxima página"><ChevronRight size={14}/></button>
        </div>
      </footer>:null}
    </section>
  </div>;
}
