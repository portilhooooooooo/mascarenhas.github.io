// Branch-scoped presentation data. Read-only responses; operational requests are untouched.
(() => {
  'use strict';
  const offices=['Mascarenhas Barbosa','Lima Feigelson','Eckermann','Renno Machado'];
  const officeWeights=[0.52,0.23,0.15,0.10];
  const products=[
    {label:'Empréstimo consignado',share:0.48},
    {label:'Cartão consignado',share:0.29},
    {label:'Crédito pessoal',share:0.15},
    {label:'Outros produtos',share:0.08},
  ];
  const states=[{label:'SP',share:0.32},{label:'MG',share:0.17},{label:'RJ',share:0.14},{label:'BA',share:0.11},{label:'PR',share:0.09},{label:'MS',share:0.07},{label:'Outros',share:0.10}];
  const number=(value)=>Math.max(0,Math.round(value));
  const iso=(date)=>date.toISOString().slice(0,10);
  const today=new Date();
  const year=today.getFullYear(),month=today.getMonth()+1;
  const period=year+'-'+String(month).padStart(2,'0');
  const volume=(portfolio)=>portfolio==='agibank_mba'?84892:portfolio==='agibank_enter'?82842:portfolio==='nubank_mba'?36184:42890;
  const mkCnJ=(i)=>String(8000000+i%99999).padStart(7,'0')+'-00.2026.8.12.0001';
  function ratio(q){
    let fraction=1;
    const start=q.get('entry_start')||q.get('inicio')||q.get('data_inicio');
    const end=q.get('entry_end')||q.get('fim')||q.get('data_fim');
    if(start){
      const days=Math.max(1,Math.min(730,Math.ceil(((end?new Date(end+'T12:00:00'):today)-new Date(start+'T12:00:00'))/86400000)+1));
      fraction=Math.min(1,days/31*0.0285);
    }
    if(q.get('state')||q.get('uf'))fraction*=0.30;
    if(q.get('product'))fraction*=0.48;
    if(q.get('situation')==='active')fraction*=0.78;
    if(q.get('situation')==='closed')fraction*=0.21;
    if(q.get('situation')==='unknown')fraction*=0.01;
    if(q.get('resolution'))fraction*=0.16;
    if(q.get('attention'))fraction*=0.075;
    return fraction;
  }
  function base(q,portfolio){
    const total=number(volume(portfolio)*ratio(q));
    const active=number(total*.775),closed=number(total*.218),unknown=total-active-closed;
    const byShare=(arr)=>arr.map((entry,i)=>({label:entry.label,value:i===arr.length-1?total-arr.slice(0,-1).reduce((sum,item)=>sum+number(total*item.share),0):number(total*entry.share)}));
    const timeline=Array.from({length:12},(_,i)=>{
      const d=new Date(Date.UTC(year,month-12+i,1));
      const swing=[-120,83,145,-35,162,78,-90,35,103,55,-25,115][i];
      return {date:iso(d),entries:number(2440+swing),closures:number(1890+swing*0.85)};
    });
    return {summary:{
      total,active,closed,unknown,aging_mean:183.6,eligible:number(total*.082),
      critical:number(active*.18),divergent:number(total*.026),archive:number(total*.021),
      dismissed:number(total*.139),extinct:number(total*.116),upheld:number(total*.092),
      injunction_granted:number(total*.047),injunction_denied:number(total*.019),
      prescribed:number(total*.191),suspended:number(total*.073),without_entry_date:number(total*.012),
    },movement:{entries:timeline.reduce((n,r)=>n+r.entries,0),closures:timeline.reduce((n,r)=>n+r.closures,0),balance:0},
    charts:{timeline,por_uf:byShare(states),por_produto:byShare(products),aging:[
      {label:'0 a 90 dias',value:number(total*.15)},{label:'91 a 180 dias',value:number(total*.25)},
      {label:'181 a 365 dias',value:number(total*.34)},{label:'Mais de 365 dias',value:number(total*.26)}
    ]},filters:{states:states.slice(0,-1).map(s=>s.label),products:products.map(p=>p.label),resolutions:['Vitória','Derrota','Extinção','Acordo']},
    updated_at:new Date().toISOString(),aging_calculation:{basis:'entry_date',as_of:iso(today),sample:total,source:'cpj'}};
  }
  const types=[{tipo:'VITORIA',quantidade:302},{tipo:'EXTINCAO',quantidade:221},{tipo:'DERROTA_VOLUNTARIA',quantidade:110},{tipo:'DERROTA',quantidade:96},{tipo:'ACORDO',quantidade:83}];
  const aging=[{faixa:'0–12 meses',quantidade:252},{faixa:'12–24 meses',quantidade:302},{faixa:'>24 meses',quantidade:410},{faixa:'Sem tag / não reconhecida',quantidade:104}];
  function closingDashboard(q,portfolio){
    const carteira=q.get('carteira')||'Agibank Regular',selected=q.get('tipo')||'TODOS';
    const qty=selected==='TODOS'?812:(types.find(t=>t.tipo===selected)?.quantidade||0);
    const f=q.get('escritorio')?0.52:1, m=(n)=>number(n*f);
    const stageTypes=selected==='TODOS'?types:types.filter(t=>t.tipo===selected);
    const etapas={etapa:q.get('etapa')||'validados',total:m(qty),
      tipos:stageTypes.map(t=>({tipo:t.tipo,quantidade:m(t.quantidade)})),
      aging:aging.map(a=>({faixa:a.faixa,quantidade:m(a.quantidade)})),
      matriz:[],fonte:'benner',mensagem:'',
      mapa:[{uf:'SP',vitorias:126,derrotas:54},{uf:'MG',vitorias:81,derrotas:24},{uf:'RJ',vitorias:58,derrotas:18}],
      comarcas:[{comarca:'São Paulo',uf:'SP',derrotas:49},{comarca:'Belo Horizonte',uf:'MG',derrotas:27},{comarca:'Rio de Janeiro',uf:'RJ',derrotas:21}],
      ticket_medio:2458.40,ticket_amostra:214,aging_medio:174.2,analistas:[]};
    return {carteira,tipo:selected==='TODOS'?null:selected,escritorio_andamentos:q.get('escritorio')?m(1360):null,
      indicadores:{consultados:m(1640),encontrados:m(1517),analisados:m(1045),ticket_medio:2458.40,ticket_amostra:m(214),aging_medio:174.2},
      analises_humanas:{total:m(1045),aptos:m(812),inaptos:m(171),revisao:m(45),outros:m(17),fonte:'analises'},
      aging:aging.map(a=>({faixa:a.faixa,quantidade:m(a.quantidade)})),
      estados:[{uf:'SP',perdas:48,amostra:131,ticket_medio:2650,faixa:'0–12 meses'}],
      analistas:[{id:'01',nome:'Equipe Backoffice',analisados:m(1045)}],
      classificacoes:stageTypes.map(t=>({tipo:t.tipo,quantidade:m(t.quantidade)})),
      distribuicao_tipos:stageTypes.map(t=>({tipo:t.tipo,quantidade:m(t.quantidade)})),
      mapa:etapas.mapa,comarcas:etapas.comarcas,matriz:[],etapas};
  }
  function paymentSnapshot(q){
    const office=q.get('credenciado'),status=q.get('situacao');
    const scale=office?officeWeights[offices.indexOf(office)]||.12:1;
    const paid=number(1688*scale),approval=number(352*scale),retification=number(200*scale);
    const all=paid+approval+retification;
    const single=status==='Liquidado'?paid:status==='Em retificação'?retification:status?.startsWith('Em aprovação')?number(approval/2):all;
    const firms=offices.map((credenciado,i)=>({credenciado,quantidade:number(1688*officeWeights[i]),valor:number(2948000*officeWeights[i])})).filter(item=>!office||item.credenciado===office);
    return {version:2,source:{import_id:'2026-11',updated_at:new Date().toISOString()},
      cards:{total:single,paid:status&&status!=='Liquidado'?0:paid,approval:status&&!status.startsWith('Em aprovação')?0:status?number(approval/2):approval,
        retification:status&&status!=='Em retificação'?0:retification,ticket_median:1968.45},
      monthly:{period,total:firms.reduce((s,f)=>s+f.valor,0),firms},
      filters:{offices,situations:['Liquidado','Em aprovação (Valores)','Em aprovação (Técnica)','Em retificação']},
      types:{acordo:number(paid*.37),condenacao:paid-number(paid*.37)}};
  }
  function pagedRows(q,kind){
    const limit=Math.min(100,Math.max(1,Number(q.get('page_size')||q.get('limit')||25)));
    const page=Math.max(1,Number(q.get('page')||(q.get('offset')?Math.floor(Number(q.get('offset'))/limit)+1:1)));
    const category=q.get('category')||q.get('situacao')||q.get('kind')||'';
    const totals=kind==='payments'?{'Liquidado':1688,'Em retificação':200,'Em aprovação (Valores)':176,'Em aprovação (Técnica)':176}:null;
    const scale=q.get('credenciado')?officeWeights[offices.indexOf(q.get('credenciado'))]||.12:1;
    const total=kind==='payments'?number((totals[category]||2240)*scale):kind==='closing'?1045:Math.max(0,number(84892*(category==='active'?.775:category==='prescribed'?.191:.045)));
    const rows=Array.from({length:Math.max(0,Math.min(limit,total-(page-1)*limit))},(_,j)=>{
      const i=(page-1)*limit+j+1,cnj=mkCnJ(i);
      if(kind==='payments')return {id:'p'+i,pasta:String(1000000+i),credenciado:offices[i%4],situacao:category||'Liquidado',valor:1680+(i%21)*87,data_pagamento:iso(new Date(Date.UTC(year,month-1,1+(i%25))))};
      if(kind==='closing')return {id:'a'+i,cnj,analista:'Equipe Backoffice',analista_id:'Equipe Backoffice',tipo:types[i%5].tipo,
        resultado:types[i%5].tipo,analisado_em:new Date().toISOString(),classificador_originario:types[(i+(i%10===0?1:0))%5].tipo,
        classificacao_validada:types[i%5].tipo,concorda:i%10!==0};
      return {id:i,cnj,state:['SP','MG','RJ','MS'][i%4],situation:'Em andamento',pasta:String(1000000+i),tipo_validado:types[i%5].tipo,
        entry_date:iso(new Date(Date.UTC(year-1,month-1,1+(i%25)))),product:products[i%4].label};
    });
    if(kind==='closing')return {total,rows,analistas:[{id:'01',nome:'Equipe Backoffice',analisados:1045}],limit,offset:(page-1)*limit,
      acuracia_originaria:{metodologia:'classificacao_validada_v2',confirmados:776,divergentes:94,avaliados:870,nao_avaliados:175,percentual:89.2}};
    if(kind==='payments')return {rows,total,page,total_pages:Math.ceil(total/limit)};
    return {rows,total,page,page_size:limit};
  }
  window.MBA_PRODUCT_METRICS = function(path,portfolio){
    const url=new URL(path,'https://data.local'),route=url.pathname,q=url.searchParams;
    const current=volume(portfolio),b=base(q,portfolio);
    if(route==='/api/carteira-processual'||route==='/api/base-geral/summary')return b;
    if(route==='/api/resultados/cadastro/cards'){
      const count=b.summary.total;
      return {metrics:{entradas:count,para_cadastro:number(count*.027),com_audiencia:number(count*.116),
        com_liminar:number(count*.047),em_arquivamento:number(count*.021)}};
    }
    if(route==='/api/resultados/andamentos/cards'){
      const f=q.get('office')?0.52:1,s=n=>number(n*current/84892*f);
      return {status:'CURRENT',metrics:{fase_conhecimento:s(48396),by_event_kind:{
        SENTENCA_EXTINCAO:s(9421),SENTENCA_IMPROCEDENTE:s(10643),SENTENCA_PROCEDENTE:s(7820),
        RECURSAL_EXTINCAO:s(1812),RECURSAL_IMPROCEDENTE:s(2716),RECURSAL_PROCEDENTE:s(3459),
        TRANSITO_EM_JULGADO_VITORIA:s(5329),TRANSITO_EM_JULGADO:s(9377),TRANSITO_EM_JULGADO_DERROTA:s(4048),
        SUSPENSAO:s(5812),PEDIDO_BLOQUEIO:s(724),CUMPRIMENTO_SENTENCA:s(7621)}},
        charts:{offices}};
    }
    if(route==='/api/base-geral/faturamento'){
      const billed=2457,sent=1837,advanced=620,fee=35,installments=18;
      return {billing_month:period,source_send_month:period,fee_brl:fee,installments_per_case:installments,
        monthly_cases:billed,monthly_amount:billed*fee,sent_cases:sent,advanced_cases:advanced,
        advanced_installments:advanced*installments,advance_amount:advanced*installments*fee,
        total_amount:billed*fee+advanced*installments*fee,missing_entry_date:17,not_under_35_years:64};
    }
    if(route==='/api/base-geral/processos')return pagedRows(q,'process');
    if(route==='/api/resultados/pagamentos')return paymentSnapshot(q);
    if(route==='/api/resultados/pagamentos/itens')return pagedRows(q,'payments');
    if(route==='/api/operacao/encerramentos/escritorios')return {offices};
    if(route==='/api/operacao/encerramentos/dashboard')return closingDashboard(q,portfolio);
    if(route==='/api/operacao/encerramentos/analises')return pagedRows(q,'closing');
    if(route==='/api/operacao/encerramentos/consolidado-mensal')return {
      periodo:period,unidade:'andamentos',fonte:'benner',ultima_importacao:new Date().toISOString(),ultimo_andamento_em:iso(today),
      mes_vigente:{enviados:1073,sem_baixa:248,com_baixa:825},saldo_mes_anterior:{periodo:'2026-10',pendentes:287},
      total_em_acompanhamento:1360,total_sem_baixa:535,total_com_baixa_no_mes_vigente:825};
    if(route==='/api/operacao/encerramentos/meta-aging-mensal')return {
      periodo:period,unidade:'cnjs_unicos',total_elegivel:1068,total_com_faixa:964,sem_tag:104,aging,
      classificacoes:{total:1068,tipos:[{tipo:'VITORIA',quantidade:397},{tipo:'EXTINCAO',quantidade:290},{tipo:'DERROTA_VOLUNTARIA',quantidade:143},{tipo:'DERROTA',quantidade:126},{tipo:'ACORDO',quantidade:112}],regra:'CNJ',itens:[]},
      origens:{validacoes_do_mes:812,historico_adicional:256,do_mes_adicionais:147,herdados_adicionais:109,
        sobreposicoes_deduplicadas:37,movimentos_excluidos_por_tipo:12}};
    if(route==='/api/resultados/defesas'||route==='/api/resultados/protocolos'){
      const defense=route.endsWith('/defesas');
      const summary=defense?{apt:132,inapt:47,reschedule:28,pending:91}:{no_documents:37,processing:64,sent:408,human:21,active:122};
      const kind=q.get('kind')||(defense?'apt':'no_documents');
      return {summary,rows:[],total:summary[kind]||0,page:Number(q.get('page')||1),limit:Number(q.get('limit')||25)};
    }
    return undefined;
  };
})();
