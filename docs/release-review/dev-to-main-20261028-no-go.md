# NO-GO — Integração dev/tasks-workspace → main (28/10/2026)

Esta branch é **um candidato isolado**, não uma promoção de produção.

## Por que não foi enviado a `main`

- As branches divergiram substancialmente (29 conflitos de merge; funcionalidades exclusivas da `main` incluem Runtime V2, políticas de autenticação, Banco de Dados, produtividade e estabilidade de Analytics).
- A integração parcial compila em TypeScript/Vite/build-static, mas a suíte completa `node --test tests/*.test.mjs` terminou com **92 aprovações e 36 falhas (128 testes)**. Parte são contratos desatualizados de login/layout, parte envolve áreas funcionais que exigem resolução e regressão comprovadas.
- `npm run test:hardening` falha nas asserções antigas de login (texto e bootstrap) ao lado das mudanças aprovadas de testes. **Não remover testes ou ajustar expectativas sem confirmar a política vigente**.
- Durante o preparo, a `main` avançou de `62b4bb7` para `e362621`, promovendo o fluxo de perguntas jurídicas. A integração deve ser reconciliada contra esse novo ponto antes de qualquer publicação.

## Preservações e adaptações testadas

- Vídeo, poster, proporção 7:5, login em Georgia e botão Continuar em cobre foram copiados da branch de testes.
- Barra flutuante arredondada, marca Mascarenhas, menu Resultados / Processos / Tarefas / Automações / Operação, Sol/Lua e portais dos submódulos foram combinados.
- `BancoDadosPage` e CSS de Banco de Dados recuperados da `main`; lógica central de auth.js, data-api.js, tarefas e dados/analytics escolhida da `main` para evitar perda de estabilidade.
- Acurácia V2 está protegida por versão de backend antes de mostrar resultado, mantendo processamento operacional em `main` até migração SQL separada.

## Próximas exigências técnicas para GO

Concluir reconciliação do código atual de `main`, revisar casos de falha de testes de autenticação, carteira, produtividade, encerramentos, painéis e responsividade. Rodar CI e Playwright com sessão sintética e endpoints bloqueados, testar carregamento de dashboards e troca de carteiras. Publicar somente com regressões resolvidas e rollback demonstrado.

**Nenhum deploy, push da main ou execução SQL realizada por esta integração.**
