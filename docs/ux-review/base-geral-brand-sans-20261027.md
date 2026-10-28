# Base Geral — atualização de fonte da marca

Branch oficial `dev/tasks-workspace`. A marca Backoffice foi alterada exclusivamente de Georgia 17px/400 para Instrument Sans 15px/600, mantendo o símbolo institucional original; navegação principal Instrument Sans 13px e indicadores/tabelas Inter.

A página Resultados agora projeta suas abas React reais Base Geral / Encerramentos / Ranking (e Defesas / Protocolos quando autorizados) na navbar superior, com `createPortal`, mantendo handlers. O portal só fica presente quando Resultados está visível, evitando uma segunda faixa horizontal vazia. A mesma regra de permissões permanece.

Capturas desktop 1440×900, modo Sol e Lua, feitas com componentes React reais, fontes carregadas e sessão isolada. Os indicadores estão em skeleton/sem dados porque a sessão visual não acessa APIs operacionais. Sem números fictícios e sem faturamento.

Validações: fonte da marca 15px/600, abas na navbar, 8 cards de Base Geral, painéis Prejuízo X Lucro e Produto, ordem Resultados / Processos / Tarefas / Automações / Operação, sem overflow horizontal; 16 testes focados aprovados e build TypeScript/Vite aprovado.

Produção (`main`) não alterada.
