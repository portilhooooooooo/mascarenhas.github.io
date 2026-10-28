import type {PaymentTypeBreakdown} from './pagamentosSnapshot';

const number=(n:number)=>new Intl.NumberFormat('pt-BR').format(n);
const percent=(n:number)=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(n)+'%';

/** Pizza de quantidades; nunca produz proporções artificiais com dados ausentes. */
export function PagamentosTypePie({types}:{types:PaymentTypeBreakdown|null|undefined}){
  const valid=types!==undefined&&types!==null&&
    Number.isSafeInteger(types.acordo)&&types.acordo>=0&&
    Number.isSafeInteger(types.condenacao)&&types.condenacao>=0;
  const total=valid ? types.acordo+types.condenacao : 0;
  const hasData=valid&&total>0;
  const agreementShare=hasData?types.acordo/total*100:0;
  const settlementShare=hasData?100-agreementShare:0;
  return <div className={'payments-results-pie-layout'+(hasData?'':' is-unavailable')}>
    <div className="payments-results-pie" role="img"
      aria-label={hasData?'Acordos '+percent(agreementShare)+' e condenações '+percent(settlementShare):'Distribuição indisponível'}
      style={hasData?{
        background:'conic-gradient(var(--mba-blue, #46649c) 0% '+agreementShare+'%, var(--mba-pie-second, #87a1bd) '+agreementShare+'% 100%)',
      }:undefined}>
      {!hasData&&<span aria-hidden="true">—</span>}
    </div>
    <div className="payments-results-pie-legend">
      <div><i className="is-agreement"/><span>Acordo</span><strong>{hasData?number(types.acordo):'—'}</strong><small>{hasData?percent(agreementShare):'—'}</small></div>
      <div><i className="is-condemnation"/><span>Condenação</span><strong>{hasData?number(types.condenacao):'—'}</strong><small>{hasData?percent(settlementShare):'—'}</small></div>
      {!hasData&&<span className="payments-results-pie-availability">Classificação indisponível</span>}
    </div>
  </div>;
}
