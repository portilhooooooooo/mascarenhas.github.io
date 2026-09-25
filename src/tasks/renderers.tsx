import { type FormEvent, useEffect, useMemo, useState } from 'react';
import type { Task, TaskProcess } from './model';

export type ApiRequest = (path: string, options?: RequestInit) => Promise<any>;

type Option = { value: string; label: string; description?: string };

type OptionGroupProps = {
  name: string;
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
};

export function OptionGroup({ name, value, onChange, options, disabled = false }: OptionGroupProps) {
  const columns = options.length === 5 ? 3 : Math.min(Math.max(options.length, 2), 4);
  return (
    <div className={`task-option-grid task-option-grid-${columns}`} role="radiogroup" aria-label={name}>
      {options.map(option => (
        <label className="task-option-card" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
          />
          <span>
            <strong>{option.label}</strong>
            {option.description ? <small>{option.description}</small> : null}
          </span>
        </label>
      ))}
    </div>
  );
}

function ErrorMessage({ message }: { message: string | null }) {
  return message ? <p className="task-renderer-error" role="alert">{message}</p> : null;
}

function RendererFooter({ busy, onSkip }: { busy: boolean; onSkip: () => void }) {
  return (
    <footer className="task-renderer-footer">
      <button className="secondary-button" type="button" disabled={busy} onClick={onSkip}>Pular e voltar depois</button>
      <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button>
    </footer>
  );
}

type BaseRendererProps = {
  api: ApiRequest;
  task: Task;
  process: TaskProcess;
  onCompleted: (process: TaskProcess) => void;
  onSkipped: (process: TaskProcess) => void;
};

export function LiminarRenderer({ api, task, process, onCompleted, onSkipped }: BaseRendererProps) {
  const [decision, setDecision] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDecision(null);
    setNotes('');
    setBusy(false);
    setError(null);
  }, [process.id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!decision) {
      setError('Selecione o resultado da análise.');
      return;
    }
    if (decision === 'erro' && !notes.trim()) {
      setError('A observação é obrigatória quando não foi possível analisar.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/${task.type}-analysis`, {
        method: 'POST',
        body: JSON.stringify({ decision, notes: notes.trim() || null }),
      });
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="task-renderer-form" onSubmit={submit}>
      <section className="task-question">
        <h3>Qual foi o resultado do pedido de tutela?</h3>
        <p>Selecione a opção que melhor descreve a decisão encontrada.</p>
        <OptionGroup
          name="liminar-decision"
          value={decision}
          onChange={setDecision}
          disabled={busy}
          options={[
            { value: 'deferida', label: 'Deferida', description: 'Tutela concedida' },
            { value: 'indeferida', label: 'Indeferida', description: 'Tutela negada' },
            { value: 'nao_solicitada', label: 'Não houve pedido', description: 'Não há pedido de tutela' },
            { value: 'com_sentenca', label: 'Com sentença', description: 'Já foi proferida sentença' },
            { value: 'sem_decisao', label: 'Sem decisão', description: 'Pedido ainda sem decisão' },
            { value: 'erro', label: 'Não foi possível analisar', description: 'Erro operacional ou documental' },
          ]}
        />
      </section>
      <label className="task-text-field">
        <span>Observações {decision === 'erro' ? <b>(obrigatório)</b> : <small>(opcional)</small>}</span>
        <textarea value={notes} maxLength={500} rows={4} disabled={busy} onChange={event => setNotes(event.target.value)} placeholder="Adicione observações relevantes para a análise..." />
        <em>{notes.length}/500</em>
      </label>
      <ErrorMessage message={error} />
      <RendererFooter busy={busy} onSkip={skip} />
    </form>
  );
}


type DefenseIndication = {
  provider?: string | null;
  category?: string | null;
  detected?: boolean | null;
  matched_terms?: string[] | null;
  evidence?: Record<string, any> | null;
};

type DefenseContext = {
  indicios?: DefenseIndication[];
  analysis?: {
    decision?: string | null;
    reason?: string | null;
    fatal_deadline?: string | null;
    notes?: string | null;
  } | null;
};

type DefenseRendererProps = BaseRendererProps & {
  onIndicationChange?: (label: string) => void;
};

function defenseProviderLabel(value: unknown) {
  return String(value || '').toLowerCase() === 'datajud' ? 'DataJud' : 'Enter';
}

function defenseCategoryLabel(value: unknown) {
  return String(value || '').toLowerCase() === 'merito' ? 'Mérito' : 'Suspensão';
}

function defenseIndicationLabel(context: DefenseContext | null) {
  const indications = Array.isArray(context?.indicios) ? context!.indicios! : [];
  const positives = indications.filter(item => item.detected === true);
  if (positives.length) {
    return [...new Set(positives.map(item => `${defenseCategoryLabel(item.category)} — ${defenseProviderLabel(item.provider)}`))].join(' · ');
  }
  const unavailable = indications
    .filter(item => {
      const evidence = item.evidence || {};
      return Boolean(String(evidence.erro || evidence.error || '').trim());
    })
    .map(item => defenseProviderLabel(item.provider));
  if (unavailable.length) return `Nenhum indício positivo · ${[...new Set(unavailable)].join(' + ')} sem resultado`;
  return 'Nenhum indício positivo';
}

export function DefenseRenderer({ api, process, onCompleted, onSkipped, onIndicationChange }: DefenseRendererProps) {
  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [fatalDeadline, setFatalDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setDecision(null);
    setReason(null);
    setFatalDeadline('');
    setNotes('');
    setBusy(false);
    setError(null);
    onIndicationChange?.('Consultando Enter e DataJud…');

    api(`/api/task-processes/${process.id}/defesa-context`)
      .then((payload: DefenseContext) => {
        if (cancelled) return;
        onIndicationChange?.(defenseIndicationLabel(payload || null));
        const analysis = payload?.analysis;
        if (analysis) {
          setDecision(analysis.decision || null);
          setReason(analysis.reason || null);
          setFatalDeadline(analysis.fatal_deadline || '');
          setNotes(analysis.notes || '');
        }
      })
      .catch(() => {
        if (!cancelled) onIndicationChange?.('Indícios indisponíveis');
      });

    return () => { cancelled = true; };
  }, [api, process.id, onIndicationChange]);

  const chooseDecision = (value: string) => {
    setDecision(value);
    setReason(null);
    setFatalDeadline('');
    setError(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!decision) return setError('Informe a situação da defesa.');
    if (decision === 'apto' && !fatalDeadline) return setError('Informe o prazo fatal.');
    if (decision === 'inapto' && !reason) return setError('Selecione a justificativa.');

    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/defesa-analysis`, {
        method: 'POST',
        body: JSON.stringify({
          decision,
          reason: decision === 'inapto' ? reason : null,
          fatal_deadline: decision === 'apto' ? fatalDeadline : null,
          notes: notes.trim() || null,
        }),
      });
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise de defesa.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="task-renderer-form defesa-renderer-form" onSubmit={submit}>
      <section className="task-question">
        <h3>Situação</h3>
        <OptionGroup
          name="defesa-decision"
          value={decision}
          onChange={chooseDecision}
          disabled={busy}
          options={[
            { value: 'apto', label: 'Apto à defesa' },
            { value: 'inapto', label: 'Inapto à defesa' },
          ]}
        />
      </section>

      {decision === 'apto' ? <label className="task-text-field defesa-fatal-field">
        <span>Prazo fatal <b>(obrigatório)</b></span>
        <input type="date" value={fatalDeadline} disabled={busy} onChange={event => setFatalDeadline(event.target.value)} />
      </label> : null}

      {decision === 'inapto' ? <section className="task-question task-question-nested">
        <h3>Justificativa</h3>
        <OptionGroup
          name="defesa-reason"
          value={reason}
          onChange={setReason}
          disabled={busy}
          options={[
            { value: 'suspenso', label: 'Suspenso' },
            { value: 'turma_recursal', label: 'Turma Recursal' },
            { value: 'defesa_anterior', label: 'Defesa já apresentada' },
            { value: 'outros', label: 'Outros' },
          ]}
        />
      </section> : null}

      <label className="task-text-field">
        <span>Observação <small>(opcional)</small></span>
        <textarea value={notes} maxLength={1000} rows={5} disabled={busy} onChange={event => setNotes(event.target.value)} placeholder="Registre contexto relevante para a decisão da Controladoria..." />
        <em>{notes.length}/1000</em>
      </label>

      <ErrorMessage message={error} />
      <RendererFooter busy={busy} onSkip={skip} />
    </form>
  );
}

export function PaymentRenderer({ api, process, onCompleted, onSkipped }: BaseRendererProps) {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paidReceipt, setPaidReceipt] = useState<string | null>(null);
  const [manifested, setManifested] = useState<string | null>(null);
  const [manifestationReason, setManifestationReason] = useState('');
  const [unpaidStatus, setUnpaidStatus] = useState<string | null>(null);
  const [requestedAgain, setRequestedAgain] = useState<string | null>(null);
  const [hadBlock, setHadBlock] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPaymentStatus(null);
    setPaidReceipt(null);
    setManifested(null);
    setManifestationReason('');
    setUnpaidStatus(null);
    setRequestedAgain(null);
    setHadBlock(null);
    setBusy(false);
    setError(null);
  }, [process.id]);

  const choosePaymentStatus = (value: string) => {
    setPaymentStatus(value);
    setPaidReceipt(null);
    setManifested(null);
    setManifestationReason('');
    setUnpaidStatus(null);
    setRequestedAgain(null);
  };

  const buildPayload = () => {
    if (!paymentStatus) throw new Error('Informe se o pagamento foi efetuado.');
    if (hadBlock === null) throw new Error('Informe se houve bloqueio.');

    const payload: Record<string, any> = {
      workflow_version: 2,
      payment_status: paymentStatus,
      paid_receipt: null,
      manifested_in_court: null,
      manifestation_reason: null,
      unpaid_status: null,
      requested_again: null,
      had_block: hadBlock === 'true',
      resolved_status: paymentStatus === 'pago' ? 'liquidado' : 'pagamento_recusado',
      liquidated_result: null,
      retry_decision: null,
      wrong_deadline_reason: null,
    };

    if (paymentStatus === 'pago') {
      if (!paidReceipt) throw new Error('Informe se há comprovante.');
      payload.paid_receipt = paidReceipt;
      payload.liquidated_result = paidReceipt;
      if (paidReceipt === 'com_comprovante') {
        if (manifested === null) throw new Error('Informe se o comprovante foi manifestado nos autos.');
        payload.manifested_in_court = manifested === 'true';
        if (manifested === 'false') {
          if (!manifestationReason.trim()) throw new Error('A justificativa é obrigatória quando ainda não houve manifestação.');
          payload.manifestation_reason = manifestationReason.trim();
        }
      }
    }

    if (paymentStatus === 'nao_pago') {
      if (!unpaidStatus) throw new Error('Informe a situação do pagamento não efetuado.');
      payload.unpaid_status = unpaidStatus;
      if (unpaidStatus === 'erro_emissao' || unpaidStatus === 'negado_banco') {
        if (requestedAgain === null) throw new Error('Informe se o pagamento foi solicitado novamente.');
        payload.requested_again = requestedAgain === 'true';
        payload.retry_decision = requestedAgain === 'true' ? 'solicitaremos_novamente' : 'nao_solicitaremos_novamente';
      }
    }
    return payload;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    let payload: Record<string, any>;
    try {
      payload = buildPayload();
    } catch (cause: any) {
      setError(cause?.message || 'Revise as respostas.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/comprovante_pagamento-analysis`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="task-renderer-form" onSubmit={submit}>
      <section className="task-question">
        <h3>Foi pago?</h3>
        <p>Confirme se o pagamento foi efetivado.</p>
        <OptionGroup name="payment-status" value={paymentStatus} onChange={choosePaymentStatus} disabled={busy} options={[
          { value: 'pago', label: 'Foi pago', description: 'Pagamento efetivado' },
          { value: 'nao_pago', label: 'Não foi pago', description: 'Pagamento ainda não efetivado' },
        ]} />
      </section>

      {paymentStatus === 'pago' ? (
        <section className="task-question task-question-nested">
          <h3>Situação do comprovante</h3>
          <OptionGroup name="paid-receipt" value={paidReceipt} onChange={value => { setPaidReceipt(value); setManifested(null); setManifestationReason(''); }} disabled={busy} options={[
            { value: 'com_comprovante', label: 'Com comprovante', description: 'Comprovante localizado' },
            { value: 'sem_comprovante', label: 'Sem comprovante', description: 'Comprovante não localizado' },
          ]} />
        </section>
      ) : null}

      {paymentStatus === 'pago' && paidReceipt === 'com_comprovante' ? (
        <section className="task-question task-question-nested">
          <h3>Manifestado nos autos?</h3>
          <OptionGroup name="manifested" value={manifested} onChange={value => { setManifested(value); if (value === 'true') setManifestationReason(''); }} disabled={busy} options={[
            { value: 'true', label: 'Sim', description: 'Já foi manifestado nos autos' },
            { value: 'false', label: 'Não', description: 'Ainda não foi manifestado' },
          ]} />
        </section>
      ) : null}

      {paymentStatus === 'pago' && paidReceipt === 'com_comprovante' && manifested === 'false' ? (
        <label className="task-text-field">
          <span>Justificativa <b>(obrigatório)</b></span>
          <textarea value={manifestationReason} maxLength={2000} rows={3} disabled={busy} onChange={event => setManifestationReason(event.target.value)} placeholder="Informe por que o comprovante ainda não foi manifestado nos autos..." />
          <em>{manifestationReason.length}/2000</em>
        </label>
      ) : null}

      {paymentStatus === 'nao_pago' ? (
        <section className="task-question task-question-nested">
          <h3>Situação do pagamento</h3>
          <OptionGroup name="unpaid-status" value={unpaidStatus} onChange={value => { setUnpaidStatus(value); setRequestedAgain(null); }} disabled={busy} options={[
            { value: 'em_aprovacao', label: 'Em aprovação', description: 'Aguardando análise do banco' },
            { value: 'erro_emissao', label: 'Erro na emissão', description: 'Falha na geração do pagamento' },
            { value: 'negado_banco', label: 'Negado pelo banco', description: 'Pagamento recusado pelo banco' },
          ]} />
        </section>
      ) : null}

      {paymentStatus === 'nao_pago' && (unpaidStatus === 'erro_emissao' || unpaidStatus === 'negado_banco') ? (
        <section className="task-question task-question-nested">
          <h3>Solicitado novamente?</h3>
          <OptionGroup name="requested-again" value={requestedAgain} onChange={setRequestedAgain} disabled={busy} options={[
            { value: 'true', label: 'Sim', description: 'Pagamento solicitado novamente' },
            { value: 'false', label: 'Não', description: 'Não houve nova solicitação' },
          ]} />
        </section>
      ) : null}

      <section className="task-question task-question-nested">
        <h3>Houve bloqueio?</h3>
        <OptionGroup name="had-block" value={hadBlock} onChange={setHadBlock} disabled={busy} options={[
          { value: 'true', label: 'Sim', description: 'Foi identificado bloqueio relacionado' },
          { value: 'false', label: 'Não', description: 'Não foi identificado bloqueio' },
        ]} />
      </section>

      <ErrorMessage message={error} />
      <RendererFooter busy={busy} onSkip={skip} />
    </form>
  );
}

const ROOT_CAUSES = [
  ['alega_nao_fez', 'Alega que não fez'],
  ['revisao_juros', 'Revisão de Juros'],
  ['exibitoria', 'Exibitória'],
  ['alteracao_domicilio_bancario', 'Alteração de Domicílio Bancário'],
  ['orgaos_protecao_credito', 'Órgãos de Proteção ao Crédito'],
  ['venda_enganosa', 'Venda Enganosa'],
] as const;

const OBF_TYPES = [
  ['nulidade', 'Nulidade'],
  ['exibicao', 'Exibição'],
  ['alteracao_domicilio_bancario', 'Alteração de domicílio bancário'],
  ['retirar_restricao_orgaos_protecao_credito', 'Retirar restrição dos órgãos de proteção ao crédito'],
  ['revisao_juros', 'Revisão de Juros'],
] as const;

const PRODUCTS = [
  ['cartao_rmc_rcc', 'Cartão RMC/RCC'],
  ['emprestimo_pessoal_consignado', 'Empréstimo Pessoal/Consignado'],
  ['seguro', 'Seguro'],
  ['tarifa', 'Tarifa'],
] as const;

const OBLIGATION_PREVIEW: Record<string, string> = {
  nulidade: 'Liquidaremos o contrato objeto da lide.',
  exibicao: 'Exibiremos os documentos ativos discutidos na lide.',
  alteracao_domicilio_bancario: 'Colocaremos uma trava nos nossos sistemas que impede o benefício de voltar ao Banco Agibank.',
  retirar_restricao_orgaos_protecao_credito: 'Procederemos com a retirada do nome da autora dos órgãos de proteção ao crédito.',
  revisao_juros: 'Liquidaremos o contrato.',
};

function moneyToApi(value: string) {
  return value.trim().replace(/R\$\s*/i, '').replace(/\./g, '').replace(',', '.');
}

function moneyNumber(value: string) {
  const normalized = moneyToApi(value);
  if (!normalized) return Number.NaN;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function currency(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
}

type AgreementRendererProps = {
  api: ApiRequest;
  task: Task;
  onServerProcess: (agreement: TaskProcess | null) => void;
  onAgreementCompleted: (previous: TaskProcess, next: TaskProcess | null) => void;
  onAgreementSkipped: (previous: TaskProcess, next: TaskProcess | null) => void;
};

export function AgreementRenderer({ api, task, onServerProcess, onAgreementCompleted, onAgreementSkipped }: AgreementRendererProps) {
  const [agreement, setAgreement] = useState<TaskProcess | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAgreement, setHasAgreement] = useState<string | null>(null);
  const [hasJudgment, setHasJudgment] = useState<string | null>(null);
  const [hasImpediment, setHasImpediment] = useState<string | null>(null);
  const [hasDefense, setHasDefense] = useState<string | null>(null);
  const [rootCause, setRootCause] = useState('');
  const [hasObf, setHasObf] = useState<string | null>(null);
  const [obfType, setObfType] = useState('');
  const [product, setProduct] = useState('');
  const [suggestedAmount, setSuggestedAmount] = useState('');
  const [outstandingBalance, setOutstandingBalance] = useState('');
  const [needsSupport, setNeedsSupport] = useState(false);
  const [sentToPlatform, setSentToPlatform] = useState<string | null>(null);

  const resetAnswers = () => {
    setHasAgreement(null);
    setHasJudgment(null);
    setHasImpediment(null);
    setHasDefense(null);
    setRootCause('');
    setHasObf(null);
    setObfType('');
    setProduct('');
    setSuggestedAmount('');
    setOutstandingBalance('');
    setNeedsSupport(false);
    setSentToPlatform(null);
    setError(null);
  };

  useEffect(() => {
    let cancelled = false;
    setAgreement(null);
    setLoading(true);
    resetAnswers();
    api(`/api/tasks/${task.id}/next-agreement`, { method: 'POST', body: '{}' })
      .then(result => {
        if (cancelled) return;
        const next = (result?.agreement || null) as TaskProcess | null;
        setAgreement(next);
        onServerProcess(next);
      })
      .catch((cause: any) => {
        if (!cancelled) setError(cause?.message || 'Não foi possível carregar o próximo acordo.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [task.id]);

  const hasAgreementBool = hasAgreement === null ? null : hasAgreement === 'true';
  const hasJudgmentBool = hasJudgment === null ? null : hasJudgment === 'true';
  const hasImpedimentBool = hasImpediment === null ? null : hasImpediment === 'true';
  const hasDefenseBool = hasDefense === null ? null : hasDefense === 'true';
  const hasObfBool = hasObf === null ? null : hasObf === 'true';
  const balance = moneyNumber(outstandingBalance);
  const balanceExceeded = Number.isFinite(balance) && balance > 15000;
  const preliminaryEligible = hasAgreementBool === false && hasJudgmentBool === false && hasImpedimentBool === false && hasDefenseBool === true;
  const fullyEligible = preliminaryEligible && Number.isFinite(balance) && balance <= 15000;

  const ineligibleReason = useMemo(() => {
    if (hasAgreementBool === true) return 'Já possui acordo.';
    if (hasJudgmentBool === true) return 'Possui sentença.';
    if (hasImpedimentBool === true) return 'Possui Termo de Impedimento 12. Abrir MAN no CPJ para manifestarmos o documento.';
    if (hasDefenseBool === false) return 'Não possui defesa apresentada nos autos.';
    if (balanceExceeded) return 'Saldo devedor superior a R$ 15.000,00.';
    return null;
  }, [hasAgreementBool, hasJudgmentBool, hasImpedimentBool, hasDefenseBool, balanceExceeded]);

  const offer = useMemo(() => {
    const suggested = moneyNumber(suggestedAmount);
    const provision = Number(agreement?.provision_amount);
    if (!Number.isFinite(provision)) return null;
    return Number.isFinite(suggested) ? Math.min(suggested, provision) : provision;
  }, [suggestedAmount, agreement?.provision_amount]);

  const resultLabel = ineligibleReason ? 'Inapto para acordo' : fullyEligible ? 'Apto para acordo' : 'Em análise';
  const resultTone = ineligibleReason ? 'ineligible' : fullyEligible ? 'eligible' : 'pending';

  const setNextAgreement = (next: TaskProcess | null) => {
    setAgreement(next);
    resetAnswers();
    onServerProcess(next);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!agreement) return;
    if (hasAgreementBool === null
      || (hasAgreementBool === false && hasJudgmentBool === null)
      || (hasAgreementBool === false && hasJudgmentBool === false && hasImpedimentBool === null)
      || (hasAgreementBool === false && hasJudgmentBool === false && hasImpedimentBool === false && hasDefenseBool === null)) {
      setError('Responda às perguntas impeditivas antes de continuar.');
      return;
    }

    const payload: Record<string, any> = {
      has_agreement: hasAgreementBool,
      has_judgment: hasAgreementBool ? false : hasJudgmentBool,
      has_impediment_12: hasAgreementBool || hasJudgmentBool ? false : hasImpedimentBool,
      has_defense_presented: hasAgreementBool || hasJudgmentBool || hasImpedimentBool ? false : hasDefenseBool,
      needs_support: needsSupport,
    };

    if (!payload.has_agreement && !payload.has_judgment && !payload.has_impediment_12 && payload.has_defense_presented) {
      payload.root_cause = rootCause;
      payload.has_obf = hasObfBool;
      payload.obf_type = hasObfBool ? obfType : null;
      payload.product = product;
      const typed = moneyNumber(suggestedAmount);
      const provision = Number(agreement.provision_amount);
      payload.suggested_amount = Number.isFinite(provision)
        ? String(Number.isFinite(typed) ? Math.min(typed, provision) : provision)
        : moneyToApi(suggestedAmount);
      payload.outstanding_balance = moneyToApi(outstandingBalance);

      if (!payload.root_cause || payload.has_obf === null || (payload.has_obf && !payload.obf_type) || !payload.product || !payload.suggested_amount || !payload.outstanding_balance) {
        setError('Preencha os campos obrigatórios antes de continuar.');
        return;
      }
      if (fullyEligible) {
        if (sentToPlatform === null) {
          setError('Informe se o caso apto foi enviado para a plataforma.');
          return;
        }
        payload.sent_to_platform = sentToPlatform === 'true';
      }
    }

    setBusy(true);
    setError(null);
    try {
      const result = await api(`/api/task-processes/${agreement.id}/agreement-analysis`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const next = (result?.next_agreement || null) as TaskProcess | null;
      const previous = agreement;
      setNextAgreement(next);
      onAgreementCompleted(previous, next);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    if (!agreement) return;
    setBusy(true);
    setError(null);
    try {
      const result = await api(`/api/task-processes/${agreement.id}/agreement-skip-next`, { method: 'POST', body: '{}' });
      const next = (result?.agreement || null) as TaskProcess | null;
      const previous = agreement;
      setNextAgreement(next);
      onAgreementSkipped(previous, next);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="task-renderer-state"><strong>Carregando processo</strong><span>Preparando o próximo acordo atribuído.</span></div>;
  if (!agreement && !error) return <div className="task-renderer-state"><strong>Fila concluída</strong><span>Não há outros acordos pendentes nesta tarefa.</span></div>;

  return (
    <form className="task-renderer-form" onSubmit={submit}>
      {agreement ? <div className="agreement-context"><div><span>Provisão</span><strong>{currency(agreement.provision_amount)}</strong></div><div><span>Valor a ofertar</span><strong>{currency(offer)}</strong></div><div><span>Resultado</span><strong className={resultTone}>{resultLabel}</strong></div></div> : null}

      <section className="task-question">
        <h3>Já possui acordo?</h3>
        <OptionGroup name="has-agreement" value={hasAgreement} onChange={value => { setHasAgreement(value); setHasJudgment(null); setHasImpediment(null); setHasDefense(null); }} disabled={busy} options={[
          { value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' },
        ]} />
      </section>

      {hasAgreementBool === false ? <section className="task-question task-question-nested"><h3>Há sentença?</h3><OptionGroup name="has-judgment" value={hasJudgment} onChange={value => { setHasJudgment(value); setHasImpediment(null); setHasDefense(null); }} disabled={busy} options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} /></section> : null}
      {hasAgreementBool === false && hasJudgmentBool === false ? <section className="task-question task-question-nested"><h3>Há Termo de Impedimento 12?</h3><OptionGroup name="has-impediment" value={hasImpediment} onChange={value => { setHasImpediment(value); setHasDefense(null); }} disabled={busy} options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} /></section> : null}
      {hasAgreementBool === false && hasJudgmentBool === false && hasImpedimentBool === false ? <section className="task-question task-question-nested"><h3>Há defesa apresentada nos autos?</h3><OptionGroup name="has-defense" value={hasDefense} onChange={setHasDefense} disabled={busy} options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} /></section> : null}

      {ineligibleReason ? <div className="agreement-result agreement-result-ineligible"><strong>Inapto para acordo</strong><span>{ineligibleReason}</span></div> : null}

      {preliminaryEligible ? (
        <div className="agreement-fields">
          <label className="task-select-field"><span>Causa raiz</span><select value={rootCause} disabled={busy} onChange={event => setRootCause(event.target.value)}><option value="">Selecione</option>{ROOT_CAUSES.map(([optionValue, label]) => <option value={optionValue} key={optionValue}>{label}</option>)}</select></label>
          <section className="task-question task-question-nested"><h3>Há obrigação de fazer (OBF)?</h3><OptionGroup name="has-obf" value={hasObf} onChange={value => { setHasObf(value); if (value === 'false') setObfType(''); }} disabled={busy} options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} /></section>
          {hasObfBool === true ? <label className="task-select-field"><span>Tipo de OBF</span><select value={obfType} disabled={busy} onChange={event => setObfType(event.target.value)}><option value="">Selecione</option>{OBF_TYPES.map(([optionValue, label]) => <option value={optionValue} key={optionValue}>{label}</option>)}</select>{obfType ? <small>{OBLIGATION_PREVIEW[obfType]}</small> : null}</label> : null}
          <label className="task-select-field"><span>Produto</span><select value={product} disabled={busy} onChange={event => setProduct(event.target.value)}><option value="">Selecione</option>{PRODUCTS.map(([optionValue, label]) => <option value={optionValue} key={optionValue}>{label}</option>)}</select></label>
          <div className="agreement-money-grid">
            <label className="task-text-field"><span>Valor sugerido</span><input value={suggestedAmount} inputMode="decimal" disabled={busy} onChange={event => setSuggestedAmount(event.target.value)} placeholder="0,00" /><small>Preencha apenas se a oferta puder ser inferior à provisão.</small></label>
            <label className="task-text-field"><span>Saldo devedor</span><input value={outstandingBalance} inputMode="decimal" disabled={busy} onChange={event => setOutstandingBalance(event.target.value)} placeholder="0,00" />{balanceExceeded ? <small className="field-danger">Saldo acima de R$ 15.000,00 torna o processo inapto.</small> : null}</label>
          </div>
          {fullyEligible ? <section className="task-question task-question-nested"><h3>Enviado para a plataforma?</h3><OptionGroup name="sent-platform" value={sentToPlatform} onChange={setSentToPlatform} disabled={busy} options={[{ value: 'true', label: 'Sim' }, { value: 'false', label: 'Não' }]} /></section> : null}
        </div>
      ) : null}

      <label className="task-check-field"><input type="checkbox" checked={needsSupport} disabled={busy} onChange={event => setNeedsSupport(event.target.checked)} /><span>Preciso de Apoio</span></label>
      <ErrorMessage message={error} />
      {agreement ? <RendererFooter busy={busy} onSkip={skip} /> : null}
    </form>
  );
}

export function UnsupportedRenderer({ task }: { task: Task }) {
  return <div className="task-renderer-state"><strong>Fluxo ainda não definido para este tipo</strong><span>{task.type} permanece bloqueado para evitar registrar uma análise com critérios incorretos.</span></div>;
}
