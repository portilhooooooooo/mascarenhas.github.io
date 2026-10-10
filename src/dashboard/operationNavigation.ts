export type OperationModule = 'pagamentos' | 'liminar' | 'encerramentos' | 'protocolos' | 'defesas';
export const OPERATION_MODULES: Array<{ id: OperationModule; label: string; route: string; page: string }> = [
  { id: 'pagamentos', label: 'Pagamentos', route: 'operacao/pagamentos', page: 'pagamentos' },
  { id: 'liminar', label: 'Liminar', route: 'operacao/liminar', page: 'tutelas' },
  { id: 'encerramentos', label: 'Encerramentos', route: 'operacao/encerramentos', page: 'encerramentos' },
  { id: 'protocolos', label: 'Protocolos', route: 'operacao/protocolos', page: 'protocolo' },
  { id: 'defesas', label: 'Defesas', route: 'operacao/defesas', page: 'protocolo' },
];
export function operationModuleForRoute(path: string): OperationModule {
  const route = path.replace(/^\/+|\/+$/g, '');
  if (route === 'operacao/defesas' || route === 'controladoria/defesas') return 'defesas';
  if (route.startsWith('operacao/protocolos') || route.startsWith('controladoria/')) return 'protocolos';
  if (route === 'operacao/liminar') return 'liminar';
  if (route === 'operacao/encerramentos') return 'encerramentos';
  return 'pagamentos';
}
export function isProtocolIndicatorsRoute(path: string) {
  return ['operacao/protocolos/indicadores', 'controladoria/indicadores'].includes(path.replace(/^\/+|\/+$/g, ''));
}
