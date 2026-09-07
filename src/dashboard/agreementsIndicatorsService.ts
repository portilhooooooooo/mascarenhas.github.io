export interface AgreementIndicator {label:string;value:number}
export interface AgreementIndicatorRow {id:string|number;cnj:string|null;situacao:string|null;tipo:string|null;tarefa:string|null;proposta:number|null;origem_acordo:string}
export interface AgreementsIndicatorsData {
 summary:{total:number;ticket_medio:number|null;fechados:number;em_negociacao:number;recusados:number;propostas_validas:number};
 por_situacao:AgreementIndicator[];por_tarefa:AgreementIndicator[];por_tipo:AgreementIndicator[];
 table:{rows:AgreementIndicatorRow[];page:number;page_size:number;total:number;total_pages:number};
}
export async function getAgreementsIndicators(page=1,origin=''):Promise<AgreementsIndicatorsData>{
 if(!window.MBA_AUTOMATION_API)throw new Error('Serviço indisponível.');
 return await window.MBA_AUTOMATION_API.request(`/api/acordos-indicadores?page=${page}&page_size=10&origem_acordo=${encodeURIComponent(origin)}`) as AgreementsIndicatorsData;
}
