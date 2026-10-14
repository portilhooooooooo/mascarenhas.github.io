/** Ranking Agibank, Edital Legal Day AGO–NOV/2026, itens 4–9.
 * Apenas regras publicadas; métricas operacionais devem vir de dados Benner auditáveis.
 */
export type RankingPortfolio = 'enter' | 'mba';
export type ScoringBand = { band: string; points: string };
export type AgingBand = { duration: string; monthlyTarget: string; monthlyPoints: string };

export const BASE_CRITERIA = [
  { id: 'aging', label: 'Duração / encerramentos', weight: '24%', points: '2,4', detail: 'Até 0,2 por faixa e por mês' },
  { id: 'cost', label: 'Custo médio', weight: '32%', points: '3,2', detail: 'Custo global de condenação' },
  { id: 'wins', label: 'Encerramentos com vitória', weight: '20%', points: '2,0', detail: 'Meta igual ou superior a 76%' },
  { id: 'agreements', label: 'Encerramentos por acordo', weight: '14%', points: '1,4', detail: 'Meta igual ou superior a 14%' },
  { id: 'quality', label: 'Qualitativos', weight: '10%', points: '1,0', detail: 'Avaliação interna do Jurídico Agibank' },
] as const;

export const AGING_BANDS: Record<RankingPortfolio, AgingBand[]> = {
  enter: [
    { duration: '0 a 3 meses', monthlyTarget: '3%', monthlyPoints: '0,2' },
    { duration: '4 a 10 meses', monthlyTarget: '4%', monthlyPoints: '0,2' },
    { duration: 'Mais de 10 meses', monthlyTarget: '5%', monthlyPoints: '0,2' },
  ],
  mba: [
    { duration: '0 a 12 meses', monthlyTarget: '5%', monthlyPoints: '0,2' },
    { duration: '12 a 24 meses', monthlyTarget: '5%', monthlyPoints: '0,2' },
    { duration: 'Mais de 24 meses', monthlyTarget: '5%', monthlyPoints: '0,2' },
  ],
};

export const COST_BANDS: Record<RankingPortfolio, ScoringBand[]> = {
  enter: [
    { band: 'Até R$ 700,00', points: '3,2' },
    { band: 'R$ 700,01 a R$ 800,00', points: '2,4' },
    { band: 'R$ 800,01 a R$ 900,00', points: '1,6' },
    { band: 'R$ 900,01 a R$ 1.000,00', points: '0,8' },
    { band: 'R$ 1.000,01 a R$ 1.100,00', points: '0,0' },
    { band: 'Acima de R$ 1.100,00', points: '−0,5' },
  ],
  mba: [
    { band: 'Até R$ 1.000,00', points: '3,2' },
    { band: 'R$ 1.000,01 a R$ 1.100,00', points: '2,4' },
    { band: 'R$ 1.100,01 a R$ 1.200,00', points: '1,6' },
    { band: 'R$ 1.200,01 a R$ 1.300,00', points: '0,8' },
    { band: 'R$ 1.300,01 a R$ 1.400,00', points: '0,0' },
    { band: 'Acima de R$ 1.400,00', points: '−0,5' },
  ],
};

export const WIN_BANDS: ScoringBand[] = [
  { band: '76% ou mais', points: '2,0' },
  { band: '74,6% a 75,9%', points: '1,5' },
  { band: '73,3% a 74,5%', points: '1,0' },
  { band: '72% a 73,2%', points: '0,5' },
  { band: 'Abaixo de 72%', points: '0,0' },
];

export const AGREEMENT_BANDS: ScoringBand[] = [
  { band: '14% ou mais', points: '1,4' },
  { band: '12% a 13,9%', points: '1,0' },
  { band: 'Abaixo de 12%', points: '0,0' },
];

export const BONUSES = [
  { label: 'Maior percentual de acordos recomendados realizados', points: '+1,0', rule: 'Entre acordos encerrados no período.' },
  { label: 'Menor custo médio entre os participantes', points: '+1,0', rule: 'Exige alcançar a faixa de 3,2 pontos de custo do próprio grupo.' },
  { label: 'Maior percentual de vitórias entre os participantes', points: '+1,0', rule: 'Exige atingir ao menos 76% de vitórias.' },
] as const;

export const PENALTIES = [
  { label: 'Bloqueios judiciais indevidos', points: 'Até −1,0', rule: 'Acima de 5%: −0,25; 7,5% a 7,9%: −0,5; 8% a 10%: −0,75; acima de 10%: −1,0.' },
  { label: 'Revelias', points: 'Até −0,5', rule: '6 a 9: −0,3; mais de 10: −0,5. O edital não define inequivocamente os valores de 5 e 10.' },
  { label: 'Reativações', points: 'Até −0,5', rule: 'Acima de 3% até 5%: −0,3; acima de 5%: −0,5. Exclui Reativação Saldo Remanescente.' },
  { label: 'Maior custo médio entre os participantes', points: '−1,0', rule: 'Aplicável ao participante com o maior custo médio do período.' },
] as const;

export const QUALITY_DIMENSIONS = [
  'Qualidade da prestação de serviços',
  'Atualização e disciplina operacional no Benner',
  'Qualidade das defesas',
  'Inovação e tecnologia',
  'Treinamento contínuo da equipe',
] as const;
