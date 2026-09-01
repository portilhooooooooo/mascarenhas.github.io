const numberFormatter = new Intl.NumberFormat('pt-BR');
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const percentFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });

export const formatNumberBR = (value: number) => numberFormatter.format(value);
export const formatCurrencyBR = (value: number) => currencyFormatter.format(value);
export const formatPercentBR = (value: number) => `${percentFormatter.format(value)}%`;
export const formatDateBR = (value: string) => value.split('-').reverse().join('/');
