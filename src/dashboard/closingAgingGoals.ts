export type AgingCount = { faixa: string; quantidade: number };

export const REGULAR_AGING_GOALS = [
  { faixa: '0–12 meses', label: '0–12 meses', meta: 296 },
  // The backend uses "12–24", covering cases older than 12 and up to 24 months.
  // The operational target calls that same band "13 a 24 meses".
  { faixa: '12–24 meses', label: '13–24 meses', meta: 314 },
  { faixa: '>24 meses', label: 'Acima de 24 meses', meta: 462 },
] as const;

export type RegularAgingGoal = {
  faixa: string;
  label: string;
  atual: number;
  meta: number;
  composicaoPercent: number;
  gap: number;
  faltaPercent: number;
  atingidoPercent: number;
};

export const regularAgingGoals = (aging: readonly AgingCount[], total: number): RegularAgingGoal[] =>
  REGULAR_AGING_GOALS.map(band => {
    const atual = Math.max(0, Number(aging.find(item => item.faixa === band.faixa)?.quantidade || 0));
    const gap = Math.max(0, band.meta - atual);
    return {
      faixa: band.faixa,
      label: band.label,
      atual,
      meta: band.meta,
      composicaoPercent: total > 0 ? atual / total * 100 : 0,
      gap,
      faltaPercent: gap / band.meta * 100,
      atingidoPercent: Math.min(100, atual / band.meta * 100),
    };
  });

export const regularAgingSummary = (rows: readonly RegularAgingGoal[]) => {
  const meta = rows.reduce((sum, row) => sum + row.meta, 0);
  const gap = rows.reduce((sum, row) => sum + row.gap, 0);
  const atual = rows.reduce((sum, row) => sum + row.atual, 0);
  return { meta, gap, atual, faltaPercent: meta > 0 ? gap / meta * 100 : 0 };
};

// Cada faixa atingida vale 0,2 ponto no ranking de encerramentos.
export const regularAgingRanking = (rows: readonly RegularAgingGoal[]) => {
  const faixasAtingidas = rows.filter(row => row.atual >= row.meta).length;
  return {
    faixasAtingidas,
    totalFaixas: REGULAR_AGING_GOALS.length,
    pontos: faixasAtingidas * 2 / 10,
    pontosPossiveis: REGULAR_AGING_GOALS.length * 2 / 10,
  };
};
