import {useMemo,useRef,useState} from 'react';
import {FileSpreadsheet,Search,UploadCloud} from 'lucide-react';
import {getPagamentoOperacaoItems,type PagamentoOperacaoItem} from './operacaoPagamentosService';

type ACPRow={pasta:string;situacao?:string|null;encontrado:boolean};
type ACPResponse={summary:{total:number;encontrados:number;nao_encontrados:number};rows:ACPRow[];importacao_id?:string};
type EnrichedRow=ACPRow&{receipt:string};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>};
const number=(value:number)=>new Intl.NumberFormat('pt-BR').format(value);

function receiptStatus(item:PagamentoOperacaoItem|undefined){
  if(!item)return 'Não verificado';
  if(item.receipt_analysis_status==='validated'||item.receipt_found===true)return 'Localizado';
  if(item.receipt_analysis_status==='no_receipt')return 'Não localizado';
  if(item.receipt_analysis_status==='amount_mismatch')return 'Valor divergente';
  if(item.receipt_analysis_status==='needs_ocr')return 'Revisão necessária';
  if(item.receipt_analysis_status==='running'||item.receipt_analysis_status==='pending')return 'Em análise';
  // A ausência de um resultado validado nunca significa ausência de comprovante.
  return 'Não verificado';
}

function findMatch(items:PagamentoOperacaoItem[],pasta:string){
  const match=items.filter(item=>String(item.pasta||'').trim()===pasta);
  if(!match.length)return undefined;
  match.sort((a,b)=>String(b.updated_at||'').localeCompare(String(a.updated_at||'')));
  return match[0];
}

export function PaymentsACPExecutionPanel(){
  const [file,setFile]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState<EnrichedRow[]|null>(null);
  const [query,setQuery]=useState('');
  const [visibleCount,setVisibleCount]=useState(50);
  const [error,setError]=useState('');
  const [warning,setWarning]=useState('');
  const generation=useRef(0);
  const filtered=useMemo(()=>result?.filter(row=>
    row.pasta.toLowerCase().includes(query.trim().toLowerCase())||
    String(row.situacao||'').toLowerCase().includes(query.trim().toLowerCase())
  )||[],[result,query]);
  const shown=filtered.slice(0,visibleCount);

  const validate=async()=>{
    if(!file||busy)return;
    const api=(window as Window & {MBA_API?:Api}).MBA_API;
    if(!api){setError('Não foi possível consultar a base.');return;}
    const serial=++generation.current;
    setBusy(true);setError('');setWarning('');setResult(null);
    try{
      const body=new FormData();body.append('file',file);
      // Read-only ACP validation. No batch is imported and no worker is dispatched.
      const response=await api.request<ACPResponse>('/api/pagamentos/validacao',{method:'POST',body});
      if(!response||!Array.isArray(response.rows)||!response.summary)
        throw new Error('Resposta da consulta inválida.');
      let items:PagamentoOperacaoItem[]=[];
      try{
        // Existing operational read model includes payment/receipt evidence.
        // If inaccessible, retain only the ACP validation and mark receipts unverified.
        // Consultar apenas os estados de pagamento com evidência relevante
        // para comprovantes. Evita carregar todo o Kanban operacional.
        const batches=await Promise.all([
          getPagamentoOperacaoItems('PAGO_COM_COMPROVANTE'),
          getPagamentoOperacaoItems('PAGO_SEM_COMPROVANTE'),
        ]);
        items=batches.flat();
      }catch{
        setWarning('Não foi possível confirmar os comprovantes nesta consulta.');
      }
      if(generation.current!==serial)return;
      setResult(response.rows.map(row=>{
        const pasta=String(row.pasta||'').trim();
        return {...row,pasta,receipt:receiptStatus(findMatch(items,pasta))};
      }));
      setVisibleCount(50);setQuery('');
    }catch(cause){
      if(generation.current===serial)setError(cause instanceof Error?cause.message:'Não foi possível analisar o ACP.');
    }finally{if(generation.current===serial)setBusy(false);}
  };

  return <section className="automation-config payments-acp-panel" aria-label="Analisar pagamentos do ACP">
    <div className="automation-action-detail">
      <label className="automation-file-field">
        <strong>Base ACP do CPJ</strong>
        <span className="automation-upload-target">
          <input type="file" accept=".xls,.xlsx" disabled={busy} aria-label="Selecionar ACP do CPJ"
            onChange={event=>{setFile(event.currentTarget.files?.[0]||null);setResult(null);setError('');setWarning('');}}/>
          <FileSpreadsheet size={16}/><span>{file?file.name:'Selecionar XLS ou XLSX'}</span>
        </span>
      </label>
      <div className="automation-submit">
        <button type="button" disabled={!file||busy} onClick={()=>void validate()}>
          <UploadCloud size={14}/>{busy?'Analisando…':'Analisar ACP'}
        </button>
      </div>
    </div>
    {error&&<p className="automation-form-error" role="alert">{error}</p>}
    {result&&<div className="payments-acp-results">
      <div className="payments-acp-summary">
        <strong>{number(result.length)} processos</strong>
        <span>{number(result.filter(row=>row.encontrado).length)} encontrados na base de pagamentos</span>
      </div>
      {warning&&<p className="payments-acp-note" role="status">{warning}</p>}
      <label className="payments-acp-search"><Search size={14}/><input type="search" placeholder="Buscar pasta ou situação"
        value={query} onChange={event=>{setQuery(event.currentTarget.value);setVisibleCount(50)}}/></label>
      <div className="payments-acp-table-wrap" onScroll={event=>{
        const element=event.currentTarget;
        if(visibleCount<filtered.length&&element.scrollTop+element.clientHeight>=element.scrollHeight-120)
          setVisibleCount(count=>Math.min(count+50,filtered.length));
      }}>
        <table><thead><tr><th>Pasta</th><th>Situação do pagamento</th><th>Comprovante</th></tr></thead>
          <tbody>{shown.map((row,index)=><tr key={row.pasta+'-'+index}>
            <td><strong>{row.pasta}</strong></td>
            <td>{row.encontrado?(row.situacao||'Não informado'):'Não encontrado'}</td>
            <td>{row.receipt}</td>
          </tr>)}</tbody>
        </table>
        {!filtered.length&&<p className="payments-acp-note">Nenhum registro encontrado.</p>}
      </div>
      <footer className="payments-acp-footer">{number(shown.length)} de {number(filtered.length)} registros</footer>
    </div>}
  </section>;
}
