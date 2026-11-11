import type {LucideIcon} from 'lucide-react';
import {MetricDots} from './dashboardFeedback';

/**
 * Explicit per-card data state. A number is only rendered for `certified` and
 * `uncertified`; the latter always carries a visible "não certificado" badge.
 * No other state may show a number, and no state falls back to mock data.
 */
export type CardState =
  | {kind:'loading'}
  | {kind:'unauthenticated';message:string}
  | {kind:'forbidden';message:string}
  | {kind:'error';message:string}
  | {kind:'absent';reasons:string[]}
  | {kind:'certified'|'uncertified';value:number;source:string|null;reasons:string[]};

export type ApiFailure={status?:number;code?:string;message?:string};
export type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};

export const getApi=()=>{
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  return w.MBA_AUTOMATION_API||w.MBA_API;
};
export const currentPortfolio=()=>(window as Window&{MBA_API?:Api}).MBA_API?.getPortfolioId?.()||'';

export const AUTH_EVENTS=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out',
  'mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'] as const;

const formatter=new Intl.NumberFormat('pt-BR');
export const formatCount=(value:number)=>formatter.format(value);

export const isCount=(value:unknown):value is number=>
  typeof value==='number'&&Number.isSafeInteger(value)&&value>=0;

/** Map a request failure to a card state; 401/403 are never shown as "no data". */
export function failureState(error:unknown):CardState{
  const e=(error||{}) as ApiFailure;
  if(e.status===401)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
  if(e.status===403)return {kind:'forbidden',message:e.code==='ORIGIN_NOT_ALLOWED'
    ?'Origem não autorizada para esta leitura.':'Sem permissão para esta carteira.'};
  return {kind:'error',message:e.message||'Indicador indisponível.'};
}

const ABSENT_STATUSES=new Set(['UNAVAILABLE','NOT_APPLICABLE','RESTRICTED','AVAILABLE','ABSENT']);
const UNCERTIFIED_STATUSES=new Set(['PARTIAL','STALE','REBUILDING','UNCERTIFIED']);

export type BackendCard={
  value?:unknown;status?:string;data_status?:string;source?:string|null;
  blockers?:string[];limitations?:string[];provenance?:{source?:string|null}|null;
};

/**
 * Classify one backend card. Certification must be explicit: `data_status:
 * "certified"` (preferred contract) or legacy `status: "CURRENT"` on a body
 * that is not itself STALE. Anything unknown degrades to "não certificado".
 */
export function classifyCard(card:BackendCard|undefined|null,bodyStatus?:string):CardState{
  if(!card)return {kind:'absent',reasons:['CARD_NOT_IN_CONTRACT']};
  const reasons=[...(Array.isArray(card.blockers)?card.blockers:[]),...(Array.isArray(card.limitations)?card.limitations:[])];
  const source=card.provenance?.source??card.source??null;
  const explicit=String(card.data_status||'').toLowerCase();
  const status=String(card.status||'').toUpperCase();
  if(explicit==='absent'||(!explicit&&ABSENT_STATUSES.has(status)))return {kind:'absent',reasons};
  if(!isCount(card.value))return {kind:'absent',reasons:reasons.length?reasons:['VALUE_NOT_PUBLISHED']};
  const bodyStale=String(bodyStatus||'').toUpperCase()==='STALE';
  const certified=!bodyStale&&(explicit?explicit==='certified':status==='CURRENT');
  if(certified)return {kind:'certified',value:card.value,source,reasons};
  const why=bodyStale?['SNAPSHOT_STALE',...reasons]:UNCERTIFIED_STATUSES.has(status)||explicit?reasons:['CERTIFICATION_NOT_DECLARED',...reasons];
  return {kind:'uncertified',value:card.value,source,reasons:why};
}

const REASON_LABELS:Record<string,string>={
  CARD_NOT_IN_CONTRACT:'Indicador não publicado pelo backend',
  VALUE_NOT_PUBLISHED:'Valor não publicado',
  SNAPSHOT_STALE:'Snapshot em cache (desatualizado)',
  CERTIFICATION_NOT_DECLARED:'Fonte sem certificação declarada',
  NO_PUBLISHED_REVISION:'Nenhuma revisão publicada',
  LEGACY_PARITY_PENDING:'Paridade com o legado pendente',
  HEARING_SOURCE_NOT_CERTIFIED:'Fonte de audiências não certificada',
  JUDICIAL_COVERAGE_NOT_CERTIFIED:'Cobertura judicial não certificada',
  JUDICIAL_TUTELA_EVENTS_NOT_PUBLISHED_FOR_SCOPE:'Eventos de tutela não publicados',
  JUDICIAL_EVENTS_NOT_PUBLISHED_FOR_SCOPE:'Eventos judiciais não publicados',
  CANONICAL_PROCESS_PHASE_NOT_AVAILABLE:'Fase processual não disponível',
  BENNER_FULL_SNAPSHOT_FLOOR_NOT_FOUND:'Snapshot completo do Benner não localizado',
  PBI_AGIBANK_OTHER_ACCREDITED_OFFICE_NOT_CERTIFIED:'Outro escritório credenciado não certificado',
  FILTER_NOT_APPLIED:'Filtro não aplicado pelo backend',
  NO_PUBLISHED_EVENTS_FOR_KIND:'Sem eventos publicados para este tipo',
  NO_METRIC_CONTRIBUTIONS:'Sem contribuições publicadas',
  CADASTRO_ENTRADAS_ONLY:'Read Model publica apenas Entradas',
  ANDAMENTOS_KNOWLEDGE_PHASE_ONLY:'Read Model publica apenas Fase de conhecimento',
  ENCERRAMENTOS_STAGE_COUNTS_ONLY:'Read Model publica apenas contagens de etapa',
  DETAIL_AVAILABILITY_PER_METRIC:'Relação disponível por indicador',
  NO_REVISION_BOUND_DETAILS:'Revisão sem relação de processos vinculada',
  DETAIL_SOURCE_PROVENANCE_UNAVAILABLE:'Proveniência da relação indisponível',
  DETAIL_UNAVAILABLE:'Relação indisponível',
  METRIC_UNAVAILABLE:'Indicador indisponível para esta carteira',
};
export const reasonText=(reasons:string[])=>reasons.map(r=>REASON_LABELS[r]||r).join(' · ');

const STATE_TAG:Record<CardState['kind'],{label:string;tone:string}|null>={
  loading:null,certified:null,
  uncertified:{label:'não certificado',tone:'warn'},
  absent:{label:'sem dados',tone:'muted'},
  unauthenticated:{label:'não autenticado',tone:'auth'},
  forbidden:{label:'sem acesso',tone:'auth'},
  error:{label:'erro',tone:'error'},
};

/** Compact KPI card; clickable only when a number exists and a drilldown is offered. */
export function MetricCard({label,icon:Icon,state,onOpen}:{
  label:string;icon:LucideIcon;state:CardState;onOpen?:()=>void;
}){
  const tag=STATE_TAG[state.kind];
  const hasValue=state.kind==='certified'||state.kind==='uncertified';
  const detail=state.kind==='loading'?''
    :'reasons' in state?reasonText(state.reasons):state.message;
  const title=[label,tag?.label,detail].filter(Boolean).join(' — ');
  const body=<>
    <span className="base-geral-card-top"><span>{label}</span><Icon size={14} strokeWidth={1.7}/></span>
    <strong className={state.kind==='uncertified'?'mba-metric-uncertified':undefined}>
      {state.kind==='loading'?<MetricDots/>:hasValue?formatCount(state.value):'—'}
    </strong>
    {tag&&<span className={'mba-data-tag mba-data-tag--'+tag.tone} data-state={state.kind}>{tag.label}</span>}
  </>;
  const canOpen=Boolean(onOpen)&&hasValue;
  return canOpen
    ?<button type="button" className="base-geral-card mba-metric-card" data-state={state.kind} title={title}
      aria-label={title+' — abrir relação de processos'} onClick={onOpen}>{body}</button>
    :<article className="base-geral-card mba-metric-card" data-state={state.kind} title={title} aria-label={title}>{body}</article>;
}
