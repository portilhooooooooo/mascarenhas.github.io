# Base Geral — padronização e painéis compactos (27/10/2026)

- KPIs: altura 100px, padding 13/14, raio 9px, labels 11px e valores 25px, como Encerramentos. Grade única mantém colunas alinhadas entre linhas: quatro colunas sem Faturamento (8 KPIs), três colunas com Faturamento (9 KPIs). Em telas de até 1000px, duas colunas.
- Produtos: lista tabular classificada pelo volume em ordem decrescente; barras horizontais proporcionais na participação, volumes e percentuais explícitos e acesso existente por Ver relação. Sem donut nem pizza, preservando a leitura dos nomes e valores.
- Prejuízo X Lucro: painel abaixo de Produtos, com a mesma largura e altura compacta, barra segmentada e dois detalhes clicáveis (base ativa e base prescrita). Continua comparando quantidades de processos, não valores monetários. Corte de aging de 18 meses inalterado.
- Sem mudança em endpoints, cálculos, permissões ou segregação de Faturamento.

## Verificações

- Build TypeScript/Vite: aprovado.
- 10 testes de Base Geral e padronização: aprovados.
- Chromium com fixtures sintéticas: desktop 1440px sem Faturamento (8 KPIs, quatro por linha), desktop 1440px com Faturamento (9 KPIs, três por linha), mobile 390px (8 KPIs, duas colunas). Todos com altura de 100px, painéis empilhados de mesma largura, barras e ordenação validadas, sem overflow horizontal nem erros de script.
- Comparação compacta: altura 149px no desktop e 173px no mobile.

A implementação é para dev/tasks-workspace, sem promoção automática para produção.

## Revisão visual subsequente — grade uniforme e laranja

- A disposição passa a ser: indicadores, Prejuízo X Lucro, Produtos.
- A comparação e os gráficos de participação utilizam a escala laranja: tom principal #C77436 e tom claro #F0B77E (base prescrita).
- Base Geral e Encerramentos usam quatro colunas no desktop (>1000px), duas no mobile; alturas de 100px. A carteira com faturamento também utiliza quatro colunas, em vez de três.
- Chromium com API sintética confirmou a mesma largura nos dois módulos: 341px em 1440px e 167px em 390px, sem overflow. A comparação permanece com 149px de altura em desktop.
- Capturas de layout com valores fictícios: `docs/screenshots/base-geral-laranja-1440-0.webp` e `docs/screenshots/base-geral-laranja-1440-1.webp`.
