# Resultados — grid canônico de KPIs

Escopo: somente `Resultados > Base Geral` e `Resultados > Encerramentos` na branch `dev/tasks-workspace`. Mantidos os 8 cards de Base Geral, os 7 de Encerramentos (incluindo Meta semicircular e Ticket médio esperado), respectivas regras de negócio, navegação, permissões, filtros e consultas. Nenhum número foi alterado nem inventado.

Diagnóstico: as folhas Base Geral / Encerramentos continham sucessivas declarações de `grid-template-columns`, breakpoints diferentes e `gap` 9px/10px. O browser exibia 4 colunas em 1440px, mas com pequenas diferenças de largura e cards crescendo muito em resoluções maiores (por exemplo, 327px a 1600px).

Regra canônica em `src/dashboard/ui-foundations.css`:

- Conteúdo de ambos limitado a **1200px**, centralizado no workspace.
- 4 colunas acima de 1160px; 3 de 901 a 1160px; 2 de 501 a 900px; 1 até 500px.
- Espaçamento de **10px**, altura **100px**, padding **13px 14px**, raio **9px**.
- A última linha de Encerramentos contém 3 cards com a mesma largura dos demais; célula final permanece vazia, sem distorcer o último card ou inventar dados.
- Não altera Ranking nem cards de Tarefas.

Validação browser Chromium em 1600, 1440, 1160, 1024, 900, 820, 600, 500 e 390px. Em todas as larguras, cards dos dois módulos tinham **largura idêntica, altura 100px e mesmo número de colunas**, sem overflow horizontal.

A 1600px, largura de cada card: **292,5px**, comparado aos 327,25px e 326,5px anteriores. A 1440px, **286,5px** para ambos. Capturas reais de ambos em modo Sol e Lua, sem dados operacionais porque a sessão visual sintética não acessou as APIs. Sem publicação em `main`.
