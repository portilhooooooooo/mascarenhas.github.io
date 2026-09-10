import { ArrowRight, Bot, FileBarChart2, Handshake, ReceiptText, Send } from 'lucide-react';

declare global { interface Window { showPage?: (pageId: string, updateRoute?: boolean) => void } }

function currentFirstName() {
  const profileName = document.getElementById('profile-name')?.textContent?.trim();
  if (profileName) return profileName.split(/\s+/)[0];
  const currentUser = (window as Window & { MBA_CURRENT_USER?: { name?: string; full_name?: string; email?: string } }).MBA_CURRENT_USER;
  const candidate = currentUser?.name || currentUser?.full_name || currentUser?.email?.split('@')[0];
  return candidate?.trim().split(/[\s._-]+/)[0] || 'Usuário';
}

export function LobbyPage({ onOpenGestao }: { onOpenGestao: (tab?: 'carteira' | 'acordos' | 'pagamentos') => void }) {
  const firstName = currentFirstName();
  return <div className="lobby-page">
    <header className="lobby-heading"><h1>Olá, {firstName}.</h1><p>Visão geral da operação e acesso aos espaços de trabalho.</p></header>
    <section className="lobby-workspace">
      <article className="lobby-panel"><h2>Gestão Processual</h2><p>Indicadores e leitura da carteira, sem misturar análise com execução.</p><div className="lobby-links">
        <button className="lobby-link" type="button" onClick={() => onOpenGestao('carteira')}><div><strong>Carteira Processual</strong><span>Entradas, ativos, encerramentos, aging, produto e UF</span></div><ArrowRight/></button>
        <button className="lobby-link" type="button" onClick={() => onOpenGestao('acordos')}><div><strong>Acordos</strong><span>Situação, tarefas, tipos e ticket médio</span></div><ArrowRight/></button>
        <button className="lobby-link" type="button" onClick={() => onOpenGestao('pagamentos')}><div><strong>Pagamentos</strong><span>Liquidação, situação, ticket e eficiência por escritório</span></div><ArrowRight/></button>
      </div></article>
      <article className="lobby-panel"><h2>Operação</h2><p>Acesse os módulos de execução sem duplicar indicadores analíticos.</p><div className="lobby-links">
        <button className="lobby-link" type="button" onClick={() => window.showPage?.('acordos')}><div><strong>Acordos</strong><span>Saneamento e negociação</span></div><Handshake/></button>
        <button className="lobby-link" type="button" onClick={() => window.showPage?.('pagamentos')}><div><strong>Pagamentos</strong><span>Importação, validação e ACP</span></div><ReceiptText/></button>
        <button className="lobby-link" type="button" onClick={() => window.showPage?.('protocolo')}><div><strong>Protocolos</strong><span>Importação, matching, execução e exceções</span></div><Send/></button>
        <button className="lobby-link" type="button" onClick={() => window.showPage?.('automacoes')}><div><strong>Automações</strong><span>Execuções e histórico operacional</span></div><Bot/></button>
        <button className="lobby-link" type="button" disabled><div><strong>Relatórios</strong><span>Área mantida na navegação para evolução posterior</span></div><FileBarChart2/></button>
      </div></article>
    </section>
  </div>;
}
