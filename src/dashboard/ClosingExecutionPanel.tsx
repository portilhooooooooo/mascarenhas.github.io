import {useState} from 'react';
import {FileSpreadsheet,RotateCcw,UploadCloud} from 'lucide-react';

type Action='import'|'reclassify';

/**
 * Intake UI only. The V3 closing import/reclassification write contract is
 * not published. Never send a guessed request to an operational endpoint.
 */
export function ClosingExecutionPanel(){
  const [action,setAction]=useState<Action>('import');
  const [file,setFile]=useState<File|null>(null);
  return <section className="automation-config closing-execution-panel" aria-label="Executar encerramentos">
    <nav className="automation-execute-tabs" aria-label="Ação de encerramentos">
      <button type="button" className={action==='import'?'active':''} aria-pressed={action==='import'}
        onClick={()=>setAction('import')}><UploadCloud size={15}/>Novo lote</button>
      <button type="button" className={action==='reclassify'?'active':''} aria-pressed={action==='reclassify'}
        onClick={()=>setAction('reclassify')}><RotateCcw size={15}/>Reclassificar existentes</button>
    </nav>
    <div className="automation-action-detail">
      {action==='import'?<label className="automation-file-field">
        <strong>Planilha de processos</strong>
        <span className="automation-upload-target">
          <input type="file" accept=".xlsx,.csv" aria-label="Selecionar planilha de processos"
            onChange={event=>setFile(event.currentTarget.files?.[0]||null)}/>
          <FileSpreadsheet size={16}/><span>{file?file.name:'Selecionar XLSX ou CSV'}</span>
        </span>
      </label>:<div className="automation-action-description">
        <strong>Processos já cadastrados</strong>
        <span>Nova classificação dos processos existentes na carteira selecionada.</span>
      </div>}
    </div>
    <div className="automation-submit">
      <button type="button" disabled title="Aguardando contrato V3 de importação e reclassificação">
        {action==='import'?'Importar lote':'Solicitar reclassificação'}
      </button>
    </div>
  </section>;
}
