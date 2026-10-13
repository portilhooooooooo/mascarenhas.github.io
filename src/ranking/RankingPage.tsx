import { useEffect, useState } from 'react';
import {
  AGING_BANDS, AGREEMENT_BANDS, BASE_CRITERIA, BONUSES, COST_BANDS,
  PENALTIES, QUALITY_DIMENSIONS, WIN_BANDS, type RankingPortfolio,
  type ScoringBand,
} from './rules';
import './ranking.css';

type Tab = 'criteria' | 'extras' | 'method';
type RankingWindow = Window & typeof globalThis & {
  MBA_API?: { getPortfolioId?: () => string | null | undefined };
};

function activePortfolio(): RankingPortfolio | null {
  const id = String((window as RankingWindow).MBA_API?.getPortfolioId?.() || '').toLowerCase();
  if (id === 'agibank_enter') return 'enter';
  if (id === 'agibank_mba') return 'mba';
  return null;
}

function PointsTable({ rows, ariaLabel }: { rows: ScoringBand[]; ariaLabel: string }) {
  return <table className="ranking-table" aria-label={ariaLabel}>
    <thead><tr><th>Resultado / faixa</th><th>Pontos</th></tr></thead>
    <tbody>{rows.map(row => <tr key={row.band}><td>{row.band}</td><td className="ranking-points">{row.points}</td></tr>)}</tbody>
  </table>;
}

function Criteria({ portfolio }: { portfolio: RankingPortfolio }) {
  return <div className="ranking-criteria-layout">
    <section className="ranking-panel">
      <header><div><h2>Duração e encerramentos</h2><p>Máximo 2,4 pontos · três faixas avaliadas a cada mês</p></div><strong>24%</strong></header>
      <table className="ranking-table">
        <thead><tr><th>Faixa de duração</th><th>Meta sobre estoque</th><th>Por mês</th></tr></thead>
        <tbody>{AGING_BANDS[portfolio].map(row =>
          <tr key={row.duration}><td>{row.duration}</td><td>{row.monthlyTarget}</td><td className="ranking-points">{row.monthlyPoints}</td></tr>
        )}</tbody>
      </table>
      <p className="ranking-panel-foot">A meta considera o estoque por faixa no último dia de cada mês. Não há compensação de metas entre meses.</p>
    </section>
    <section className="ranking-panel">
      <header><div><h2>Custo médio</h2><p>Máximo 3,2 pontos · condenação global nos processos encerrados</p></div><strong>32%</strong></header>
      <PointsTable rows={COST_BANDS[portfolio]} ariaLabel="Pontuação por custo médio" />
    </section>
    <section className="ranking-panel">
      <header><div><h2>Vitórias</h2><p>Máximo 2,0 pontos · encerramentos sem ônus financeiro</p></div><strong>20%</strong></header>
      <PointsTable rows={WIN_BANDS} ariaLabel="Pontuação por vitórias" />
    </section>
    <section className="ranking-panel">
      <header><div><h2>Acordos</h2><p>Máximo 1,4 ponto · desfecho acordo entre todos os encerramentos</p></div><strong>14%</strong></header>
      <PointsTable rows={AGREEMENT_BANDS} ariaLabel="Pontuação por acordos" />
    </section>
  </div>;
}

function Extras() {
  return <div className="ranking-criteria-layout">
    <section className="ranking-panel">
      <header><div><h2>Bônus</h2><p>Até +3,0 pontos sobre a nota-base</p></div><strong>+3,0</strong></header>
      <div className="ranking-rule-list">{BONUSES.map(row =>
        <article key={row.label}><div><strong>{row.label}</strong><p>{row.rule}</p></div><span className="ranking-positive">{row.points}</span></article>
      )}</div>
    </section>
    <section className="ranking-panel">
      <header><div><h2>Detratores</h2><p>Até −3,0 pontos sobre a nota-base</p></div><strong>−3,0</strong></header>
      <div className="ranking-rule-list">{PENALTIES.map(row =>
        <article key={row.label}><div><strong>{row.label}</strong><p>{row.rule}</p></div><span className="ranking-negative">{row.points}</span></article>
      )}</div>
    </section>
  </div>;
}

function Methodology({ portfolio }: { portfolio: RankingPortfolio }) {
  return <div className="ranking-criteria-layout">
    <section className="ranking-panel"><header><div><h2>Base elegível</h2><p>Fonte de verdade: Benner, conforme item 4.1 do edital</p></div></header>
      <p>Processos cíveis, judiciais, polo passivo e situação Encerrado, com motivo Vitória, Derrota ou Acordo. Excluem-se equipes Bancoob e Estratégico e encerramentos por Erro de Cadastro.</p>
      <p>Os indicadores de encerramentos utilizam a data de encerramento, não a de pagamento. Detratores seguem as próprias regras de apuração.</p>
    </section>
    <section className="ranking-panel"><header><div><h2>Qualitativos · 1,0 ponto</h2><p>NPS interno do Jurídico Agibank · avaliação de julho a novembro</p></div></header>
      <ul className="ranking-quality">{QUALITY_DIMENSIONS.map(label => <li key={label}>{label}</li>)}</ul>
      <p className="ranking-panel-foot">A nota depende de avaliação do cliente. Não é inferida a partir do volume de tarefas da plataforma.</p>
    </section>
    <section className="ranking-panel"><header><div><h2>Composição da edição</h2><p>Julho + agosto a novembro de 2026</p></div></header>
      <p>Nota de julho: 1/5 (20%). Nota de agosto a novembro: 4/5 (80%). Bônus e detratores dependem da apuração comparativa oficial.</p>
      {portfolio === 'enter' && <p>A nota oficial da Enter consolida as parcerias MBA, E&amp;S e RM; o recorte de uma única parceria não deve ser apresentado como ranking oficial da Enter.</p>}
      <p className="ranking-panel-foot">Observações do edital: a faixa de 12 meses se sobrepõe na régua MBA; há lacunas na tabela de revelias para exatamente 5 e 10 casos. Validar antes de automatizar essas fronteiras.</p>
    </section>
  </div>;
}

export function RankingPage() {
  const [portfolio, setPortfolio] = useState<RankingPortfolio | null>(activePortfolio);
  const [tab, setTab] = useState<Tab>('criteria');
  useEffect(() => {
    const sync = () => { setPortfolio(activePortfolio()); setTab('criteria'); };
    window.addEventListener('mba:portfolio-changed', sync);
    window.addEventListener('mba:profile-ready', sync);
    return () => {
      window.removeEventListener('mba:portfolio-changed', sync);
      window.removeEventListener('mba:profile-ready', sync);
    };
  }, []);
  if (!portfolio) return <div className="ranking-page"><p role="status">O Ranking Agibank está disponível apenas na respectiva carteira.</p></div>;
  return <div className="ranking-page">
    <header className="ranking-heading">
      <div><span className="ranking-eyebrow">AGIBANK · LEGAL DAY 2026</span><h1>Ranking</h1>
        <p>{portfolio === 'enter' ? 'Agibank <> Enter' : 'Agibank <> Mascarenhas'} · edição agosto–novembro</p>
      </div>
      <span className="ranking-source">Critérios oficiais · sem apuração de nota</span>
    </header>
    <div className="ranking-overview">
      <div className="ranking-total"><span>Pontuação-base máxima</span><strong>10,0 <small>pontos</small></strong><p>9,0 quantitativos + 1,0 qualitativo</p></div>
      {BASE_CRITERIA.map(item => <article key={item.id} className="ranking-metric">
        <div><span>{item.label}</span><strong>{item.points} <small>pts</small></strong></div>
        <p>{item.detail}</p><span className="ranking-weight">{item.weight} da nota</span>
      </article>)}
    </div>
    <p className="ranking-data-notice">Pontuações efetivas ainda não apuradas neste módulo. Esta tela apresenta somente metas e réguas do edital, sem simular dados de processos ou tratar indícios DataJud como encerramentos homologados.</p>
    <div className="ranking-tabs" role="tablist" aria-label="Informações do ranking">
      {([['criteria','Critérios e metas'],['extras','Bônus e detratores'],['method','Metodologia']] as const).map(([id,label]) =>
        <button type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} key={id} onClick={() => setTab(id)}>{label}</button>)}
    </div>
    {tab === 'criteria' ? <Criteria portfolio={portfolio}/> : tab === 'extras' ? <Extras/> : <Methodology portfolio={portfolio}/>}
    <footer className="ranking-footer">Fonte: Edital Ranking de Escritórios Cíveis, Edição Especial Legal Day AGO–NOV/2026. Resultado oficial depende do Benner, NPS e comparação com os demais participantes.</footer>
  </div>;
}
