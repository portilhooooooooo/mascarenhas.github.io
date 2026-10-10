# Mascarenhas Backoffice — auditoria e proposta de experiência

## Escopo e evidência

Auditoria estática do repositório `portilhooooooooo/mascarenhas.github.io`, branch existente `design/mascarenhas-identidade-20261009`, commit `3607fb13d966c7b6b1b95bf95ffe5089a9df4d99`. O nome sem `design/` não existe no remoto consultado. Nenhuma implementação, commit, push ou alteração de infraestrutura foi realizada. A aprovação solicitada ao final decorre da etapa de proposta exigida pelo próprio pedido.

Foram inspecionados os arquivos de entrada, autenticação, política de carteiras, build, estação de tarefas, Q&A, operações, Analytics, usuários, seletor de carteira, serviços e temas. “Integrado” neste relatório significa componente com chamadas implementadas no frontend; não significa que a execução no servidor foi confirmada. O backend não está neste checkout e não foi acessado. Não é possível certificar isolamento, classificação jurídica ou conciliação só pelo frontend.

## 1. Diagnóstico do produto atual

| Área | Evidência no código | Capacidade e limite observado |
|---|---|---|
| Arquitetura | `index.html`, `app.js`, `src/dashboard/main.tsx`, `build-static.mjs` | Shell HTML/JS com montagem React por página. Build copia arquivos legados e bundles React, isola o mount de login e rejeita referências a mock no artefato final. Preservar essa composição na primeira etapa. |
| Tarefas | `src/tasks/TasksApp.tsx`, `model.ts`, `mount.tsx` | Fila por processo; pesquisa CNJ; filtros Prazo, Prioridade e UF; alternância Minhas tarefas/Equipe; Atribuições; criação por planilha, distribuição, exclusão de lote. API `/api/tasks?scope=mine|all` e `/api/tasks/:id/processes`. |
| Execução Q&A | `TaskQuestion.tsx`, `renderers.tsx`, `renderersLegacy.tsx`, `ClosingAnalysisFlow.tsx`, `DefenseAnalysisFlow.tsx`, `ProtocolCollectionRenderer.tsx` | Renderers de Liminar, Defesa, Encerramento, Comprovante, Acordos e Protocolo. “Salvar e próximo” envia POST específico por processo. Tipos Bloqueio/Citação presentes no cadastro não têm renderer específico na seleção principal; caem em `UnsupportedRenderer`. Não tratá-los como execução completa. |
| Pagamentos | `OperacaoPage.tsx`, `operacaoPagamentosService.ts` | Resumo, importação XLSX, disparo da automação, consulta de provisão/comprovante e download CSV dos registros carregados. Endpoints `/api/operacao/pagamentos/{summary,items,importar,run}`. Serviço pode buscar até 50 páginas de 200 itens; filtro/paginação visual são locais. Risco de latência e resultados limitados ao conjunto carregado. |
| Liminar | `OperacaoLiminarPage.tsx`, `operacaoLiminarService.ts` | Importação, resumo, lista paginada, pesquisa e exportação; `/api/operacao/liminar`. Contrato de importação declara `scraping_disparado: false`. Não confundir importação/classificação histórica com novo scraping. |
| Encerramentos operacionais | `OperacaoEncerramentosPage.tsx`, `operacaoEncerramentosService.ts` | Resumo, lista paginada, filtro por motivo e envio ao Benner. Contrato distingue `datajud_indicio_apto`, `validacao_decisao`, `tipo_validado`, `status_envio` e datas. `/api/operacao/encerramentos/{summary,items,enviar-benner}`. |
| Protocolos/Defesas | `ControladoriaPage.tsx`, `ProtocolosPage.tsx`, `protocoloService.ts`, `DefesasPage.tsx` | Ainda agrupados em Controladoria. Protocolos consulta fila, importa correspondências/documentos e possui integração de execução. Defesas consulta tarefas/processos; não é um cadastro processual geral. Indicadores utiliza embed separado. |
| Resultados | `GestaoProcessualPage.tsx`, `MetabaseGestaoEmbed.tsx`, `EncerramentosPage.tsx` | Analytics geral usa configuração JWT de `/api/analytics/metabase/embed`. Encerramentos usa dashboard e resumo do mês anterior. Aba Resultados de Tarefas apenas exibe “O painel do Metabase será disponibilizado aqui”. Não existem ali os KPIs pretendidos. |
| Administração | `UsersPage.tsx`, `app.js`, `user-access-manager.js` | Gestão de usuários, acessos por carteira e estado global; catálogo de permissões do servidor. Há controles de identidade mestre. Não equivale a cinco papéis de negócio. |
| Automações | `app.js`, `index.html` | Chamadas de saúde, disparo e acompanhamento de jobs Liminar, DataJud, Encerramentos e Benner. Execução remota não validada. |
| Processos | `TaskExecution.tsx`, `model.ts` | Contexto da tarefa contém CNJ, pasta e possíveis metadados. Não foi identificado módulo central de Processos nem serviço de timeline DataJud por CNJ entre os serviços auditados. Histórico completo, tarefas relacionadas e criação avulsa por processo permanecem propostas. |

### Navegação e autorização

`app.js` publica rotas, restaura links diretos e verifica `MBA_PORTFOLIO_POLICY`; `main.tsx` altera rótulos/visibilidade e sincroniza seleção. Hoje há Tarefas, Analytics, Operação, Controladoria e Automações. Operação seleciona suas três esteiras em estado React; Controladoria interpreta subrotas. Isso gera duas formas diferentes de orientar o usuário.

`PortfolioSwitcher.tsx` filtra as cinco opções conhecidas pelos `profile.portfolios` devolvidos pelo servidor. `data-api.js` envia bearer e `X-Portfolio-Id`; configurar carteiras valida a seleção contra a lista recebida. `portfolio-policy.js` combina permissões, carteira e módulos declarados. Protocolos é restrito a carteiras Enter nessa política. Não alterar isso ao reagrupar navegação.

`auth.js` carrega `/api/me`, restaura rota antes de escolher a primeira página e publica eventos de autenticação/ativação. Papéis visíveis são admin/user e referências operacionais legadas; capabilities como `tasks.view`, `tasks.execute`, `tasks.create`, `tasks.manage`, `tasks.view_others`, `users.view` e `users.manage` determinam ações. Analista/Supervisor/Gerente/Cliente/Admin são experiências desejadas, não credenciais confirmadas.

### Atritos prioritários

1. **Respostas podem se perder na troca de processo.** `TasksApp.tsx` atribui `key=workItemKey(activeItem)` ao corpo e os fluxos usam estado local. Não foi identificado rascunho persistido. Propor proteção contra saída com respostas pendentes; não prometer autosave.
2. **Classificação visual já existe.** `ClosingAnalysisFlow.tsx` calcula `finalMerit`, `outcome`, prazos e possibilidade de envio. `renderers.tsx` envia respostas para `encerramento-analysis` e interpreta `reopen_at`. Preservar o cálculo existente nesta refatoração; confirmar no backend sua validação independente e chamar o resultado anterior ao POST de preliminar.
3. **Resultados de tarefas é uma promessa sem conteúdo funcional.** Evitar transformá-la em painel fictício ou duplicar Analytics. Só ativar métricas após contrato e escopo confirmados.
4. **Demonstração está acessível em Analytics operacional.** `EncerramentosPage.tsx` contém `makeDemo`, `STAFF` fictício e toggle “Demonstração”, embora desligado inicialmente. Proposta: retirar essa opção do bundle operacional e, se necessária, manter exclusivamente em ferramenta de QA separada.
5. **Notificações exibem “3” fixo no HTML.** `index.html` contém o contador; não foi identificado serviço de notificações nos handlers inspecionados. Remover o contador sem fonte, conservando apenas ações que tenham comportamento comprovado.
6. **Contexto é escasso no cabeçalho.** `TaskBrief` mostra somente pasta, e exclui comprovantes desse resumo. Prazo/origem devem aparecer quando disponíveis, sem campo genérico vazio ou inferência de fatos jurídicos.
7. **Contagem da fila é parcial.** O código informa “carregados” e hidrata lotes em background com concorrência 3. Não rebatizar esse número como backlog total.
8. **Estado desatualizado é silencioso.** Refresh de tarefas a cada 20 segundos mantém fila ao falhar, mas o catch não informa falha. Propor status discreto de atualização sem bloquear respostas.
9. **CSS tem autoridades sobrepostas.** `styles.css`, `brand-identity.css`, `brand-themes.css`, `design-system-v2.css` e CSS React combinam cores literais e muitos `!important`. Sol/Lua já possuem tokens grafite/cobre, mas a ordem controla exceções. Migrar por componente, sem adicionar outra camada global de sobrescrita.
10. **Densidade depende de zoom fixo.** `taskStation.css` usa `zoom: .9`; `TasksApp.tsx` compensa altura dividindo por 0.9. Precisa de verificação conjunta em notebook, zoom do navegador e formulários longos.

## 2. Jornadas propostas

| Experiência | Jornada | Evidência/condição |
|---|---|---|
| Analista | Abrir carteira autorizada → localizar pendência → consultar contexto → responder Q&A → salvar → receber confirmação → próximo registro | Reutilizar fila e renderers; acrescentar proteção contra abandono e melhor feedback. |
| Supervisor | Abrir Atribuições → localizar lote pendente → distribuir → inspecionar Equipe → verificar exceção → acompanhar resultado confirmado | Usar `tasks.manage`, `tasks.create`, `tasks.view_others`; consulta de terceiros não deve conceder execução. |
| Gerente | Selecionar carteira autorizada → abrir Resultados → distinguir etapa e período → consultar detalhes permitidos | Sem criar novo role; somente capabilities existentes. Riscos agregados novos dependem de fonte. |
| Cliente | Consultar entregas da própria carteira e fontes permitidas | Não habilitar como experiência pronta sem contrato backend específico e testes de isolamento. |
| Admin | Abrir Usuários → selecionar pessoa → configurar acesso por carteira → salvar no servidor | Preservar editor, catálogo, restrições mestre e auditoria existente. |

## 3. Arquitetura de informação

Navegação persistente proposta: **Tarefas · Operação · Resultados**, com **Automações** e **Administração** condicionadas às capabilities. Preservar sidebar atual e seletor de carteira acima de Sair. Nenhuma segunda navbar global.

- Tarefas: Minha fila; Atribuições e inspeção da Equipe apenas para quem possui acesso. Resultados pessoais só quando houver fonte verificável; enquanto isso, acesso ao Analytics autorizado sem inventar métricas.
- Operação: Pagamentos, Liminar, Encerramentos, Protocolos, Defesas. Reagrupar componentes atuais, mantendo guards por esteira e restrição Enter. Preservar links antigos como aliases; criar rotas canônicas por esteira apenas na etapa aprovada de navegação.
- Resultados: Analytics existente e Encerramentos; manter distinções de etapa/fonte/período e embeds autorizados.
- Administração: Usuários e configurações que possuam implementação real. Não adicionar painel de configurações fictício.
- Processos: começar como inspeção contextual da tarefa, não como nova seção global. Módulo central só após confirmar API de consulta, vínculos, histórico e andamentos.

## 4. Proposta visual da estação real

Esta é uma especificação para aprovação, ainda não um protótipo implementado.

| Região | Desktop | Componente real de partida |
|---|---|---|
| Navegação | Sidebar atual discreta; carteira persistentemente identificada; tema junto ao usuário | Shell HTML, `PortfolioSwitcher`, `brand-theme.js` |
| Fila | Aproximadamente 280–320 px; filtros compactos, CNJ, tipo, prioridade e prazo disponível; seleção por marcador cobre; quantidade carregada claramente nomeada | `TasksApp`, `SelectMenu`, `model` |
| Processo ativo | Cabeçalho fixo com CNJ/copiar, tipo, pasta e prazo disponível; uma ação de inspeção do contexto | `ProcessHeading`, `TaskBrief` |
| Análise | Maior região; perguntas sequenciais visíveis conforme o fluxo atual; mesmos controles por resposta; evidência conhecida próxima da pergunta relevante | `TaskQuestion`, `OptionGroup`, fluxos e renderers |
| Contexto | Painel recolhível; ao abrir não desmonta Q&A. Só dados realmente presentes e com origem disponível; sem timeline vazia fingindo integração | Nova composição dos dados já recebidos, sem endpoint inventado |
| Ações | Rodapé sempre alcançável; “Salvar e próximo” primário, pular secundário; ocupado desabilita reenvio; falha conserva respostas | `TaskForm`, `TaskActionBar`, handlers atuais |

Em notebook, o contexto vira painel sobreposto/recolhível sem três colunas comprimidas. No fallback móvel, alternar fila e análise conservando estado; validar foco de retorno. Trocar de registro com respostas pendentes exige escolha clara de permanecer ou descartar, sem salvamento automático implícito.

Inter, textos operacionais em 13–14 px, perguntas em 14–16 px, espaçamento em múltiplos de 4, controles 32–36 px, bordas apenas em controles e divisões úteis. Superfícies neutras, cobre para seleção/ação, cores semânticas para estados. Sol/Lua usam os tokens existentes; contraste mínimo de 4,5:1 para texto comum e 3:1 para elementos relevantes. Foco visível, radios nativos, labels associados, mensagens acessíveis e movimento reduzido.

Estados: carregamento preserva dimensões; vazio diferencia fila sem pendência de filtro sem resultado; erro permite retry localizado; falha de refresh mantém contexto com aviso de atualização; confirmação só depois de resposta do servidor; reagendamento mostra a data retornada pelo servidor. Nenhum envio será rotulado como encerramento efetivo.

Princípios: Apple — hierarquia, familiaridade e feedback; Finder — seleção/contexto estáveis; Gmail/Outlook — fila e repetição eficiente; Cloudscape — inspeção contextual; Fiori — atividades conforme acesso; Shopify — preservar posições e hábitos; Salesforce — contexto do registro; ServiceNow — resolver sem sair da estação. São decisões de projeto, não cópia de componentes.

Fontes oficiais consultadas: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/design-principles), [Cloudscape split view](https://cloudscape.design/patterns/resource-management/view/split-view/), [SAP Fiori](https://experience.sap.com/fiori-design-web/design-principles/). As demais referências são analogias propostas, sem alegar pesquisa empírica com usuários ou auditoria atual desses produtos.

## 5. Preservar, alterar, remover

| Preservar | Alterar após aprovação | Remover da experiência operacional |
|---|---|---|
| OAuth Microsoft, bearer, `/api/me`, carteira e guards | Hierarquia visual e agrupamento de navegação | Contador fixo sem fonte |
| APIs, payloads, formulários e regras Q&A | Contexto próximo do Q&A e proteção contra troca involuntária | Toggle de dados demonstrativos |
| Renderers, importações, envios e histórico existente | Tokens e componentes comuns, por módulo | Decoração redundante, após QA |
| Embeds e fontes reais de resultados | Estados de atualização, erro e confirmação | Promessas visuais de funcionalidade ainda inexistente |
| Rotas antigas e capacidades atuais | Novas rotas canônicas com aliases, se aprovadas | Nenhuma capacidade funcional comprovada |

## 6. Implementação progressiva e riscos

1. **Baseline e contratos:** registrar permissões e payloads por renderer; confirmar backend para validação e isolamento; resolver testes quebrados antes de usá-los como garantia. Risco: fronteira entre contrato declarado e comportamento remoto.
2. **Estação:** refatorar apresentação de `TasksApp`, `TaskExecution` e componentes compartilhados; preservar regras; adicionar proteção de troca e contexto disponível. Entrega: um fluxo Encerramentos completo, depois Defesa/Liminar/Comprovante/Protocolo/Acordos. Riscos: remontagem, perda de respostas, avanço e reagendamento.
3. **Validação:** testar payloads, falha ao salvar, repetição de clique, salto, conclusão, troca de carteira, consulta de terceiros e falta de permissão. QA em Sol/Lua, 1920×1080, 1600×900 e notebook; teclado, overflow e zoom 90–100%.
4. **Operação:** reutilizar componentes de cabeçalho, filtros, tabela, status e inspeção; reagrupar Protocolos/Defesas preservando restrições. Riscos: aliases e ações indevidamente expostas. Não reescrever integração.
5. **Resultados:** retirar modo demonstração operacional; separar indício, análise, aptidão, envio e conciliação. Métricas novas exigem denominadores, competência e fonte. Não implementar ranking sem edital.
6. **Experiências por acesso:** adaptar entradas e ações pelas capabilities reais; Cliente e novos papéis ficam fora até implementação autorizada no backend. Risco: confundir visibilidade com autorização.

Cada etapa deve produzir commit pequeno, build e regressões pertinentes na branch autorizada. Nenhuma alteração de main, VPS, Cloudflare ou produção está incluída. Aprovação da proposta não autoriza ampliar backend ou criar permissões novas.

## Validação da baseline

- `npm ci --ignore-scripts`: concluído.
- `npm run build`: passou (TypeScript, Vite e montagem estática), SHA do artefato `3607fb1`.
- `npm run test:hardening`: passou, incluindo política de carteiras e 9 testes de rotas.
- `npm run test:metabase`: passou.
- Lote adicional de testes de identidade, tema, prioridades, acesso, UF, escopo mestre e cliente API: 23 passaram e 2 falharam. Ambos em `tests/api-client.test.mjs`: `localStorage is not defined` no ambiente VM e expectativa de invalidação de sessão não satisfeita. Falhas da baseline sem modificação de código; a primeira sugere fixture desatualizada, mas não foi corrigida ou considerada inofensiva sem investigação.
- `npm run test:ux`: bloqueado antes de iniciar cenários por ausência do Chromium do Playwright. Tentativa de instalação recebeu arquivo inválido/truncado; não há validação visual ou teste de navegador concluído nesta auditoria.
- Não testados: sessão real autenticada, chamadas reais, backend, concorrência entre colaboradores, DataJud, envio/baixa Benner, isolamento multi-carteira no servidor e contraste computado de todas as telas.

## Decisão para aprovação

Aprovar a estrutura Tarefas/Operação/Resultados e a primeira etapa de implementação centrada na estação real, preservando a sidebar, identidade Sol/Lua, payloads e regras atuais. O painel de contexto inicia somente com dados existentes; Processos completo e novos perfis não serão considerados implementados.
