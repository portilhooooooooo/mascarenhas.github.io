import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, FileSpreadsheet, RefreshCw, Search, ShieldCheck, UploadCloud, X } from 'lucide-react';

type BatchStatus = 'aguardando' | 'saneado' | 'tarefa';
type BatchRow = {
  cnj: string;
  fatal: string;
  indications: string;
  status: BatchStatus;
  destination: string;
  updatedAt: string;
};

const ROWS: BatchRow[] = [
  { cnj: '0801001-11.2026.8.12.0001', fatal: '27/09/2026', indications: 'Sem divergência', status: 'saneado', destination: 'Resolvido em lote', updatedAt: '22:14' },
  { cnj: '0801002-22.2026.8.12.0002', fatal: '28/09/2026', indications: 'Retorno AR · DataJud', status: 'tarefa', destination: 'Tarefa de Defesa', updatedAt: '22:13' },
  { cnj: '0801003-33.2026.8.12.0003', fatal: '30/09/2026', indications: 'Tema 1414 · Enter', status: 'saneado', destination: 'Resolvido em lote', updatedAt: '22:12' },
  { cnj: '0801004-44.2026.8.12.0004', fatal: '27/09/2026', indications: 'DJE · Enter', status: 'tarefa', destination: 'Tarefa de Defesa', updatedAt: '22:11' },
  { cnj: '0801005-55.2026.8.12.0005', fatal: '28/09/2026', indications: 'Consulta pendente', status: 'aguardando', destination: 'Aguardando saneamento', updatedAt: '22:09' },
  { cnj: '0801006-66.2026.8.12.0006', fatal: '01/10/2026', indications: 'Turma Recursal', status: 'saneado', destination: 'Resolvido em lote', updatedAt: '22:08' },
  { cnj: '0801007-77.2026.8.12.0007', fatal: '28/09/2026', indications: 'Audiência · AR', status: 'tarefa', destination: 'Tarefa de Defesa', updatedAt: '22:07' },
  { cnj: '0801008-88.2026.8.12.0008', fatal: '30/09/2026', indications: 'Sem citação expedida', status: 'saneado', destination: 'Resolvido em lote', updatedAt: '22:05' },
];

const STATUS_META: Record<BatchStatus, { label: string; className: string }> = {
  aguardando: { label: 'Aguardando', className: 'neutral' },
  saneado: { label: 'Saneado', className: 'success' },
  tarefa: { label: 'Para tarefa', className: 'blue' },
};

export function DefesasPage() {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | BatchStatus>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const counts = useMemo(() => ({
    all: ROWS.length,
    aguardando: ROWS.filter(row => row.status === 'aguardando').length,
    saneado: ROWS.filter(row => row.status === 'saneado').length,
    tarefa: ROWS.filter(row => row.status === 'tarefa').length,
  }), []);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ROWS.filter(row => (status === 'all' || row.status === status) && (!term || row.cnj.toLowerCase().includes(term) || row.indications.toLowerCase().includes(term)));
  }, [search, status]);

  const previewImport = () => {
    if (!file) return;
    setFeedback(`${file.name} pronto para integração com o fluxo de importação em lote.`);
  };

  return <section className="defesas-batch-page" aria-label="Defesas em lote">
    <header className="protocolos-header">
      <div><span className="protocolos-eyebrow">CONTROLADORIA</span><h1>Defesas</h1><p>Importe a base da Controladoria, acompanhe o saneamento automático e envie para Tarefas apenas os processos que exigem análise humana.</p></div>
      <div className="protocolos-header-actions"><button className="protocolos-button secondary" type="button"><RefreshCw size={14}/>Atualizar</button></div>
    </header>

    <section className="protocolos-intake-grid-react defesas-batch-intake">
      <article className="protocolos-card protocolos-upload-card">
        <header><span className="protocolos-card-icon"><FileSpreadsheet size={17}/></span><div><h3>Base de Controladoria</h3><p className="defesas-card-copy">XLSX com os processos encaminhados para validação de defesa.</p></div></header>
        <div className="protocolos-upload-field">
          <input ref={fileInput} type="file" accept=".xlsx,.xls" onChange={event => { setFile(event.target.files?.[0] || null); setFeedback(null); }}/>
          {!file ? <button className="protocolos-modern-drop" type="button" onClick={() => fileInput.current?.click()}><span className="protocolos-drop-icon"><UploadCloud size={16}/></span><span className="protocolos-drop-copy"><strong>Selecionar base</strong><small>XLSX exportado pela Controladoria</small></span></button> : <div className="protocolos-selected-file"><span className="protocolos-file-icon"><FileSpreadsheet size={15}/></span><span className="protocolos-file-copy"><strong>{file.name}</strong><small>Arquivo pronto para importação</small></span><span className="protocolos-file-ready"><CheckCircle2 size={13}/>Pronto</span><button type="button" onClick={() => { setFile(null); setFeedback(null); if (fileInput.current) fileInput.current.value = ''; }}><X size={14}/></button></div>}
        </div>
        <footer className="protocolos-card-footer"><div className="protocolos-import-line"><strong>Última carga</strong><i>·</i><span>200 processos</span><i>·</i><span>27/09/2026</span></div><button className="protocolos-button primary" type="button" disabled={!file} onClick={previewImport}>Importar base</button></footer>
        {feedback ? <p className="protocolos-feedback">{feedback}</p> : null}
      </article>

      <article className="protocolos-card defesas-saneamento-card">
        <header><span className="protocolos-card-icon"><ShieldCheck size={17}/></span><div><h3>Saneamento automático</h3><p className="defesas-card-copy">Enter + DataJud procuram indícios antes de criar uma tarefa humana.</p></div></header>
        <div className="defesas-saneamento-grid"><div><small>RECEBIDOS</small><strong>200</strong></div><div><small>RESOLVIDOS NO LOTE</small><strong>142</strong></div><div><small>PARA TAREFA</small><strong>58</strong></div></div>
        <div className="defesas-provider-line"><span><i className="success"/>Enter scraper</span><span><i className="success"/>DataJud</span><em>Fluxo ativo</em></div>
      </article>
    </section>

    <section className="protocolos-card protocolos-workspace defesas-batch-workspace">
      <header className="protocolos-workspace-head"><div><h2>Processos da base</h2><p>Visão operacional do saneamento antes do encaminhamento para Tarefas.</p></div></header>
      <div className="protocolos-status-strip-react">
        <button type="button" className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>Todos <strong>{counts.all}</strong></button>
        <button type="button" className={`success ${status === 'saneado' ? 'active' : ''}`} onClick={() => setStatus('saneado')}>Saneados <strong>{counts.saneado}</strong></button>
        <button type="button" className={`blue ${status === 'tarefa' ? 'active' : ''}`} onClick={() => setStatus('tarefa')}>Para tarefa <strong>{counts.tarefa}</strong></button>
        <button type="button" className={status === 'aguardando' ? 'active' : ''} onClick={() => setStatus('aguardando')}>Aguardando <strong>{counts.aguardando}</strong></button>
      </div>
      <div className="protocolos-toolbar"><label className="protocolos-search"><Search size={14}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar CNJ ou indício"/></label></div>
      <div className="protocolos-table-wrap"><table className="protocolos-table-react defesas-batch-table"><thead><tr><th>Processo</th><th>Fatal Controladoria</th><th>Indícios</th><th>Status</th><th>Destino</th><th>Atualizado</th></tr></thead><tbody>{visibleRows.map(row => <tr key={row.cnj}><td><span className="protocolos-cnj">{row.cnj}</span></td><td><span className="protocolos-date">{row.fatal}</span></td><td><span className="protocolos-context">{row.indications}</span></td><td><span className={`protocolos-badge ${STATUS_META[row.status].className}`}>{STATUS_META[row.status].label}</span></td><td><strong className={row.status === 'tarefa' ? 'defesas-destination-task' : 'defesas-destination'}>{row.destination}</strong></td><td><span className="protocolos-date">{row.updatedAt}</span></td></tr>)}</tbody></table>{!visibleRows.length ? <div className="protocolos-empty"><strong>Nenhum processo neste filtro</strong><span>Ajuste a busca ou selecione outro status.</span></div> : null}</div>
    </section>
  </section>;
}
