import { createRoot } from 'react-dom/client';
import { GestaoProcessualPage } from '../src/dashboard/GestaoProcessualPage';
import '../src/dashboard/shell.css';

// Only test-only data, isolated from actual backend; null means unavailable.
const dashboard = {
  carteira:'Agibank Regular',
  tipo:null,
  indicadores:{consultados:40,encontrados:20,analisados:8,ticket_medio:null,ticket_amostra:0,aging_medio:null},
  analises_humanas:{total:8,aptos:4,inaptos:3,revisao:1,outros:0,fonte:'fixture'},
  aging:[],estados:[],analistas:[],classificacoes:[],distribuicao_tipos:[],
  ranking:{
    dados_oficiais_suficientes:false,scope:'operacional_parcial',aviso:'Sem base oficial homologada nesta prévia.',
    custo:{atual:null,limites:[1000]},vitoria:{taxa:null},acordo:{taxa:null},
    faixas:[{id:'jovens',rotulo:'0–12 meses',estoque:90,meta_percentual:5,meta_quantidade:5,realizado:3,faltam:2}]
  },
  etapas:{etapa:'validados',total:8,tipos:[],aging:[],matriz:[],fonte:'fixture',mensagem:'Dados de teste'}
};
// Emula a troca de carteira sem mudar as permissões do usuário.
let resultsPortfolioAllowed = true;
history.replaceState({}, '', '/analytics/encerramentos');
Object.assign(window,{
  MBA_CURRENT_USER:{permissions:{'dashboard.view':true,'encerramentos.view':true}},
  MBA_PORTFOLIO_POLICY:{canAccess:(page:string)=>resultsPortfolioAllowed && ['dashboard','encerramentos'].includes(page)},
  __setResultsPortfolioAllowed:(allowed:boolean)=>{
    resultsPortfolioAllowed = allowed;
    window.dispatchEvent(new Event('mba:portfolio-changed'));
  },

  MBA_API:{getPortfolioId:()=> 'agibank_mba'},
  MBA_AUTOMATION_API:{request:async(path:string)=>{
    if(path.startsWith('/api/operacao/encerramentos/dashboard?')) return dashboard;
    if(path==='/api/operacao/encerramentos/resumo-mes-anterior') return {enviados:2,encerrados:1,em_andamento:1,periodo_inicio:'2026-09-01',periodo_fim_exclusivo:'2026-10-01',fonte:'fixture'};
    throw new Error('Endpoint indisponível na prévia: '+path);
  }}
});
createRoot(document.getElementById('results-root')!).render(<GestaoProcessualPage/>);
