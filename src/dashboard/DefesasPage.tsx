import { useMemo, useState } from 'react';
import { CalendarDays, Check, RotateCcw } from 'lucide-react';

type YesNo = 'sim' | 'nao' | null;
type Priority = 'Altíssima' | 'Alta' | 'Baixa' | null;
type Reason = 'suspenso_irdr' | 'suspenso_1414' | 'turma_recursal' | 'retorno_turma_recursal' | 'sentenca' | 'transito_julgado' | 'sem_citacao' | 'defesa_apresentada' | null;
type CriterionKey = 'expedicao_dje' | 'dje_negativo' | 'expedicao_ar' | 'retorno_ar' | 'audiencia' | 'habilitacao';

type Criterion = {
  key: CriterionKey;
  label: string;
  dateLabel: string;
};

const CRITERIA: Criterion[] = [
  { key: 'expedicao_dje', label: 'Expedição de DJE', dateLabel: 'Expedido em' },
  { key: 'dje_negativo', label: 'DJE Negativo', dateLabel: 'DJE negativo em' },
  { key: 'expedicao_ar', label: 'Expedição de Carta AR', dateLabel: 'Carta AR expedida em' },
  { key: 'retorno_ar', label: 'Retorno de Carta AR', dateLabel: 'Retorno da AR em' },
  { key: 'audiencia', label: 'Audiência', dateLabel: 'Audiência agendada para' },
  { key: 'habilitacao', label: 'Juntada de Habilitação', dateLabel: 'Habilitação realizada em' },
];

const REASONS: Array<{ value: Exclude<Reason, null>; label: string }> = [
  { value: 'turma_recursal', label: 'Processo está na Turma Recursal' },
  { value: 'retorno_turma_recursal', label: 'Aguardando retorno da Turma Recursal aos autos' },
  { value: 'sentenca', label: 'Processo tem sentença' },
  { value: 'transito_julgado', label: 'Processo está com trânsito em julgado' },
  { value: 'sem_citacao', label: 'Sem citação para defesa expedida' },
  { value: 'defesa_apresentada', label: 'Já existe defesa apresentada' },
];

const SITUATION_BY_REASON: Record<Exclude<Reason, null>, string> = {
  suspenso_irdr: 'Processo suspenso em razão do IRDR.',
  suspenso_1414: 'Processo suspenso em razão do Tema 1414.',
  turma_recursal: 'Processo está na Turma Recursal.',
  retorno_turma_recursal: 'Processo estava na Turma Recursal, aguardando retorno aos autos.',
  sentenca: 'Processo possui sentença.',
  transito_julgado: 'Processo possui trânsito em julgado.',
  sem_citacao: 'Processo sem citação para defesa expedida.',
  defesa_apresentada: 'Já existe defesa apresentada nos autos.',
};

const PRIORITIES: Array<{ value: Exclude<Priority, null>; label: string; helper: string }> = [
  { value: 'Altíssima', label: 'Altíssima', helper: 'Hoje' },
  { value: 'Alta', label: 'Alta', helper: 'Amanhã' },
  { value: 'Baixa', label: 'Baixa', helper: 'D+2 ou posterior' },
];

function formatDate(value: string) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function naturalList(values: string[]) {
  if (!values.length) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} e ${values[1]}`;
  return `${values.slice(0, -1).join(', ')} e ${values[values.length - 1]}`;
}

function criterionPhrase(key: CriterionKey, value: string) {
  const date = formatDate(value);
  const phrases: Record<CriterionKey, string> = {
    expedicao_dje: `expedição do DJE em ${date}`,
    dje_negativo: `DJE negativo em ${date}`,
    expedicao_ar: `Carta AR expedida em ${date}`,
    retorno_ar: `retorno da Carta AR em ${date}`,
    audiencia: `audiência agendada para ${date}`,
    habilitacao: `habilitação realizada em ${date}`,
  };
  return phrases[key];
}

function BinaryChoice({ value, onChange }: { value: YesNo; onChange: (value: Exclude<YesNo, null>) => void }) {
  return <div className="defesa-binary-choice">
    {(['sim', 'nao'] as const).map(option => <button
      key={option}
      type="button"
      className={value === option ? 'active' : ''}
      onClick={() => onChange(option)}
    >{option === 'sim' ? 'Sim' : 'Não'}</button>)}
  </div>;
}

export function DefesasPage() {
  const [cnj] = useState('0801009-99.2026.8.12.0009');
  const [controlDeadline] = useState('2026-09-28');
  const [deadlineCorrect, setDeadlineCorrect] = useState<YesNo>(null);
  const [priority, setPriority] = useState<Priority>(null);
  const [activeDefense, setActiveDefense] = useState<YesNo>(null);
  const [correctFatal, setCorrectFatal] = useState('');
  const [criteria, setCriteria] = useState<Record<CriterionKey, string>>({
    expedicao_dje: '', dje_negativo: '', expedicao_ar: '', retorno_ar: '', audiencia: '', habilitacao: '',
  });
  const [criterionKeys, setCriterionKeys] = useState<CriterionKey[]>([]);
  const [reason, setReason] = useState<Reason>(null);
  const [suspended, setSuspended] = useState<YesNo>(null);

  const completedCriteria = useMemo(
    () => CRITERIA.filter(item => criterionKeys.includes(item.key) && Boolean(criteria[item.key])),
    [criteria, criterionKeys],
  );

  const result = useMemo(() => {
    if (deadlineCorrect === 'sim') {
      return {
        status: priority ? 'Apto' : '—',
        priority: priority || '—',
        situation: priority ? 'Prazo determinado pela Controladoria confirmado.' : 'Aguardando definição da prioridade.',
        fatal: controlDeadline,
      };
    }
    if (deadlineCorrect === 'nao' && activeDefense === 'sim') {
      const phrases = completedCriteria.map(item => criterionPhrase(item.key, criteria[item.key]));
      const criteriaComplete = criterionKeys.length > 0 && completedCriteria.length === criterionKeys.length;
      return {
        status: correctFatal && priority && criteriaComplete ? 'Apto' : '—',
        priority: priority || '—',
        situation: !criterionKeys.length
          ? 'Aguardando os critérios utilizados para definição do prazo.'
          : !criteriaComplete
            ? 'Preencha as datas dos critérios selecionados.'
            : `Prazo de defesa identificado com base em ${naturalList(phrases)}.`,
        fatal: correctFatal,
      };
    }
    if (deadlineCorrect === 'nao' && activeDefense === 'nao') {
      return {
        status: reason ? 'Inapto' : '—',
        priority: '—',
        situation: reason ? SITUATION_BY_REASON[reason] : 'Aguardando a situação processual.',
        fatal: '',
      };
    }
    return { status: '—', priority: '—', situation: 'Aguardando análise.', fatal: '' };
  }, [activeDefense, completedCriteria, controlDeadline, correctFatal, criteria, criterionKeys, deadlineCorrect, priority, reason]);

  const reset = () => {
    setDeadlineCorrect(null);
    setPriority(null);
    setActiveDefense(null);
    setCorrectFatal('');
    setCriteria({ expedicao_dje: '', dje_negativo: '', expedicao_ar: '', retorno_ar: '', audiencia: '', habilitacao: '' });
    setCriterionKeys([]);
    setReason(null);
    setSuspended(null);
  };

  const chooseDeadline = (value: Exclude<YesNo, null>) => {
    setDeadlineCorrect(value);
    setPriority(null);
    setActiveDefense(null);
    setCorrectFatal('');
    setCriteria({ expedicao_dje: '', dje_negativo: '', expedicao_ar: '', retorno_ar: '', audiencia: '', habilitacao: '' });
    setCriterionKeys([]);
    setReason(null);
    setSuspended(null);
  };

  const chooseActiveDefense = (value: Exclude<YesNo, null>) => {
    setActiveDefense(value);
    setPriority(null);
    setCorrectFatal('');
    setCriteria({ expedicao_dje: '', dje_negativo: '', expedicao_ar: '', retorno_ar: '', audiencia: '', habilitacao: '' });
    setCriterionKeys([]);
    setReason(null);
    setSuspended(null);
  };

  const chooseReason = (value: Exclude<Reason, null>) => {
    setReason(value);
    setSuspended(null);
  };

  const toggleCriterion = (key: CriterionKey) => {
    setCriterionKeys(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
    if (criterionKeys.includes(key)) setCriteria(current => ({ ...current, [key]: '' }));
  };

  return <section className="defesas-analysis-page" aria-label="Análise de Defesas">
    <header className="defesas-analysis-header">
      <div>
        <span>CONTROLADORIA · DEFESAS</span>
        <h1>Análise de Defesas</h1>
        <p>Valide o prazo informado pela Controladoria e registre a devolutiva oficial do processo.</p>
      </div>
      <button className="secondary-button defesas-reset" type="button" onClick={reset}><RotateCcw size={14}/>Limpar análise</button>
    </header>

    <div className="defesas-context-strip">
      <div><small>PROCESSO</small><strong>{cnj}</strong></div>
      <div><small>FATAL CONTROLADORIA</small><strong><CalendarDays size={13}/>{formatDate(controlDeadline)}</strong></div>
      <div><small>ORIGEM</small><strong>Controladoria Enter</strong></div>
    </div>

    <div className="defesas-analysis-grid">
      <div className="defesas-form-card">
        <section className="defesas-question">
          <div className="defesas-step">01</div>
          <div className="defesas-question-body">
            <h2>O prazo determinado pela Controladoria está correto?</h2>
            <BinaryChoice value={deadlineCorrect} onChange={chooseDeadline}/>
          </div>
        </section>

        {deadlineCorrect === 'sim' ? <section className="defesas-question nested">
          <div className="defesas-step">02</div>
          <div className="defesas-question-body">
            <h2>Qual a prioridade da defesa?</h2>
            <div className="defesas-priority-grid">{PRIORITIES.map(item => <button key={item.value} type="button" className={priority === item.value ? 'active' : ''} onClick={() => setPriority(item.value)}><strong>{item.label}</strong><span>{item.helper}</span></button>)}</div>
          </div>
        </section> : null}

        {deadlineCorrect === 'nao' ? <section className="defesas-question nested">
          <div className="defesas-step">02</div>
          <div className="defesas-question-body">
            <h2>Esse processo tem citação para defesa correndo?</h2>
            <BinaryChoice value={activeDefense} onChange={chooseActiveDefense}/>
          </div>
        </section> : null}

        {deadlineCorrect === 'nao' && activeDefense === 'sim' ? <>
          <section className="defesas-question nested">
            <div className="defesas-step">03</div>
            <div className="defesas-question-body">
              <h2>Com qual critério você está se baseando?</h2>
              <p>Selecione um ou mais critérios. Cada seleção abre sua respectiva data.</p>
              <div className="defesas-criteria-list">{CRITERIA.map(item => {
                const selected = criterionKeys.includes(item.key);
                return <div className={`defesas-criterion ${selected ? 'selected' : ''}`} key={item.key}>
                  <button type="button" className="defesas-criterion-toggle" onClick={() => toggleCriterion(item.key)}><span className="defesas-checkbox">{selected ? <Check size={12}/> : null}</span><strong>{item.label}</strong></button>
                  {selected ? <label><span>{item.dateLabel}</span><input type="date" value={criteria[item.key]} onChange={event => setCriteria(current => ({ ...current, [item.key]: event.target.value }))}/></label> : null}
                </div>;
              })}</div>
            </div>
          </section>

          <section className="defesas-question nested compact-fields">
            <div className="defesas-step">04</div>
            <div className="defesas-question-body">
              <h2>Defina a conclusão do prazo</h2>
              <div className="defesas-conclusion-grid">
                <label><span>Fatal correto</span><input type="date" value={correctFatal} onChange={event => setCorrectFatal(event.target.value)}/></label>
                <div><span>Prioridade</span><div className="defesas-priority-grid compact">{PRIORITIES.map(item => <button key={item.value} type="button" className={priority === item.value ? 'active' : ''} onClick={() => setPriority(item.value)}><strong>{item.label}</strong><small>{item.helper}</small></button>)}</div></div>
              </div>
            </div>
          </section>
        </> : null}

        {deadlineCorrect === 'nao' && activeDefense === 'nao' ? <section className="defesas-question nested">
          <div className="defesas-step">03</div>
          <div className="defesas-question-body">
            <h2>Qual é a situação do processo?</h2>
            <div className="defesas-reason-grid">
              <button type="button" className={reason === 'suspenso_irdr' || reason === 'suspenso_1414' ? 'active' : ''} onClick={() => { setSuspended('sim'); setReason(null); }}>Suspenso</button>
              {REASONS.map(item => <button type="button" key={item.value} className={reason === item.value ? 'active' : ''} onClick={() => chooseReason(item.value)}>{item.label}</button>)}
            </div>
            {suspended === 'sim' ? <div className="defesas-suspension-box"><span>Qual suspensão foi identificada?</span><div className="defesas-binary-choice"><button type="button" className={reason === 'suspenso_irdr' ? 'active' : ''} onClick={() => setReason('suspenso_irdr')}>IRDR</button><button type="button" className={reason === 'suspenso_1414' ? 'active' : ''} onClick={() => setReason('suspenso_1414')}>Tema 1414</button></div></div> : null}
          </div>
        </section> : null}
      </div>

      <aside className="defesas-result-card">
        <header><span>DEVOLUTIVA OFICIAL</span><h2>Resultado final</h2><p>Prévia do registro que será consolidado em <code>defesa_analyses</code>.</p></header>
        <dl>
          <div><dt>CNJ</dt><dd>{cnj}</dd></div>
          <div><dt>Resultado</dt><dd>{result.status === 'Apto' ? <span className="defesas-result-pill apto">Apto</span> : result.status === 'Inapto' ? <span className="defesas-result-pill inapto">Inapto</span> : '—'}</dd></div>
          <div><dt>Prioridade</dt><dd>{result.priority}</dd></div>
          <div className="wide"><dt>Situação</dt><dd>{result.situation}</dd></div>
          <div><dt>Fatal</dt><dd>{result.fatal ? formatDate(result.fatal) : '—'}</dd></div>
        </dl>
        <div className="defesas-result-preview"><small>REGISTRO FINAL</small><strong>{cnj}</strong><span>{result.status} · {result.priority} · {result.situation} · {result.fatal ? formatDate(result.fatal) : '—'}</span></div>
        <footer><span>Os critérios ficam estruturados internamente. A base final permanece limpa e padronizada.</span></footer>
      </aside>
    </div>
  </section>;
}
