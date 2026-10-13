# Mascarenhas Backoffice — Spec-driven product audit
**Data:** 10/10/2026  
**Escopo auditado:** frontend \`mascarenhas.github.io\` (\`dev/tasks-workspace\`) e backend \`mba-backoffice-backend\` (\`main\`), interfaces, permissões, Q&A, métricas, Processos e integrações.  
**Estudo-base:** \`pesquisa_50_tech_backoffice.md\` e Edital Ranking Agibank 2026, Legal Day (ago–nov).  
**Regra de segurança:** mudanças somente na branch isolada do frontend; nada de \`main\`, produção, DNS, VPS, Supabase ou deploy automático.

## 1. Princípio e matriz de decisão

A plataforma gerencia o ciclo **processo → tarefa → resposta/decisão → integração → confirmação → auditoria**, substituindo o paradigma de lote por unidade operacional individual.

| Referência | Princípio transferível | Escolha Mascarenhas |
|---|---|---|
| SAP Fiori | Páginas por papel e objeto de negócio | Processos como entidade central e gestão por contexto |
| Microsoft Fluent | Produtividade, navegação e foco | Preservar Tasks Workspace com fila à esquerda |
| IBM Carbon | Tabelas densas, seleção e ações | Atribuições individuais e filtros explícitos |
| ServiceNow Horizon | Workspaces e registros ligados | Estados separados para tarefa, análise e integração |
| Palantir Foundry | Dados → eventos → ações rastreáveis | Classificação validada, evidência e envio não confundidos |
| Netflix experimentation | Medir mudanças de uso | A/B somente se tempo/erro justificarem redesenho |

Estas são recomendações inferidas de documentos públicos, não uma auditoria dos sistemas internos das empresas.

## 2. Fontes reais e contratos existentes

### Frontend
- \`src/tasks/TasksApp.tsx\`: fila esquerda + Q&A direita, filtros tipo/prioridade/UF, rascunhos e abas.
- \`src/tasks/TaskQuestion.tsx\`: navegação progressiva; teclas 1–9 para resposta, Enter avança, Backspace volta.
- \`src/tasks/qaDraft.ts\`: \`sessionStorage\` até confirmação explícita.
- \`src/dashboard/EncerramentosPage.tsx\`: indicadores operacionais e read model de Ranking.
- \`src/dashboard/UsersPage.tsx\`: controle granular de permissões e acesso.
- \`src/login/main.tsx\`: autenticação Microsoft, mídia institucional opcional.
- \`src/dashboard/GestaoProcessualPage.tsx\`: analytics; **não** é um cadastro individual de processos.

### Backend
- \`routes/api/tasks.py\`: \`GET /api/tasks\`, \`GET /api/tasks/{task_id}/processes\`, \`PATCH /api/task-processes/{id}\` exigindo \`tasks.assign\` e associação ativa à carteira.
- \`repositories/task_repository.py\`: \`task_processes\` como unidades por CNJ dentro de tarefas pai.
- \`routes/api/encerramentos_bi.py\` e \`services/ranking_rules.py\`: metas, faixas e cálculo somente com fontes homologadas; \`null\` para informações não verificadas.
- \`modules/carteira_processual/routes.py\`: endpoint analítico agregado \`GET /api/carteira-processual\`; **não oferece registro paginado por processo nem movimentos individuais do DataJud**.
- \`processo_evidencias\`, \`base_processual\`, \`task_events\` e registros de automações são fontes diferentes; agregá-las exige permissões e regras de origem/portfolio.
- \`auth.permissions.require_api_permission\`, sessão Microsoft e \`g.portfolio_id\` garantem controles no servidor; esconder botões não concede permissão.

## 3. Decisões de produto vinculantes

**P-01 — Identidade:** nome do produto segue Mascarenhas Backoffice, preservando Sol/Lua.  
**P-02 — Perfis:** Auxiliar Administrativo (sem distinção Júnior/Sênior), Líder e Admin. Cargo/experiência não substituem grants no backend. Os perfis atuais \`admin/user\` e overrides de permissão precisam de migração formal antes de se tornar três papéis persistidos.  
**P-03 — Workspace:** manter fila à **esquerda** e perguntas à **direita**, sem reformular layout ou esconder etapas.  
**P-04 — Perguntas:** A/B/C são rótulos **visuais**, 1/2/3 seguem atalhos de escolha; Enter avança mas não confirma automaticamente ao selecionar.  
**P-05 — Atribuições:** alocar \`task_processes.id\`; importação em lote continua ferramenta de entrada, não entidade de distribuição.  
**P-06 — Login:** saudação de horário/dia local; frase estável “Explore como estamos trabalhando!”.  
**P-07 — Ranking:** metas e denominadores por carteira; nunca usar “apto”, “enviado” ou indício DataJud como “encerrado Benner”.  
**P-08 — Dados reais:** retirar números de demonstração da UX operacional. Mostrar “—” com fonte e ausência de homologação.  
**P-09 — Segurança:** mudanças de atribuição restritas a \`tasks.assign\`, com validação de carteira e registro auditável no backend.

## 4. Resultados e Ranking

Os cinco KPIs oficiais da base (MBA) são:
- custo médio dos encerrados, 3,2 pontos, melhor faixa até R$ 1.000;
- encerramentos por maturidade (0–12, 12–24 e >24 meses), 2,4 pontos, meta mensal de 5% do estoque por faixa;
- vitórias efetivamente encerradas, 2 pontos, >=76%;
- acordos efetivamente encerrados, 1,4 ponto, >=14%;
- critério qualitativo, 1 ponto, definido por avaliação externa Agibank.

Bonificações/detratores têm base diferente e precisam de confirmação oficial. Regra Enter distinta: custo de máxima nota até R$ 700; aging 3%/4%/5% em 0–3, 4–10 e >10 meses. **A Enter é participante consolidado, o Backoffice MBA não dispõe dos dados completos dos parceiros.**

Eventos separados no painel:
1. \`indicio_detectado\`: sinal de automação (não gera baixa).
2. \`analise_persistida\`: decisão humana (não gera baixa).
3. \`envio_enfileirado\`: solicitação de integração (não gera baixa).
4. \`envio_confirmado\`: confirmação da integração (não prova motivo de encerramento).
5. \`encerramento_benner_confirmado\`: efeito final reconciliado, com filtros do edital.

**Risco de especificação:** o edital apresenta divergências de redação para pontuação mensal e faixas; usar campos oficiais nulos até saneamento, sem somar pontos especulativos.

## 5. Contrato da gestão de Atribuições (alteração incluída)

- A tela lê tarefas pai autorizadas e seus \`task_processes\`; não mostra “apagar lote” como controle de atribuição.
- Filtros: tipo de tarefa, responsável, pesquisa por processo; visões por pessoa, não atribuídas e vencidas.
- Seleção múltipla permite \`PATCH /api/task-processes/{id}\` por item, com \`assignee_id\` validado.
- Não atribuir tarefas concluídas/inativas.
- Disponibilidade de destinatário confirmada pela API por tipo e validada novamente no servidor.
- Falha parcial é informada; conclusão só depois de retorno da API.
- O backend atual não fornece índice paginado de atribuições: a tela usa requisições limitadas em concorrência e mostra resultado parcial se a consulta falhar. **Risco de escala** para carteiras grandes: endpoint paginado de read model precisa vir antes de uso intensivo.

**Especificação recomendada para evolução:** \`GET /api/atribuicoes?status=&tipo=&assignee=&q=&page=\` retornando {items,total,updated_at}, cursor/paginação no backend, contagens agrupadas e competência por carteira; \`POST /api/atribuicoes/redistribuir\` transacional/idempotente, registrando histórico antes/depois. Não lançar redistribuição parcial silenciosamente.

## 6. Processos e timeline — contrato ainda não implementado

Não marcar como “concluído” nem criar uma tela falsa a partir de \`GET /api/carteira-processual\`: essa rota devolve **agregações**, não movimentos. O histórico DataJud bruto tem armazenamento e contratos separados e não há no runtime lido um endpoint protegido de timeline processual. Para entregar Processos com fidelidade será preciso:

- \`GET /api/processos?q=&status=&page=\`: lista paginada por carteira com chave canônica CNJ/cliente, fontes e last-updated.
- \`GET /api/processos/{cnj}\`: registro autorizado + carteiras + tarefas/fluxos + classificação validada + integração comprovada.
- \`GET /api/processos/{cnj}/timeline?origem=judicial|operacional|sistemas&cursor=\`: eventos ordenados, com \`event_at\` e \`captured_at\` distintos, proveniência, \`source_id\`, \`source_version\`, \`evidence_ref\`, e cursor; dedupe de movimentos repetidos.
- Filtro por \`g.portfolio_id\` em **todas as consultas** e contenção de CNJs que existam em mais de uma carteira.
- Dados judiciais têm data de movimento e data de captura, com fonte DataJud. Eventos operacionais têm autor, ação e data. Eventos de sistemas têm job e confirmação. Ausência de movimentação **não** prova ausência de execução.
- Paginação e limites server-side, RLS/serviço interno, eventos sem texto sensível arbitrário e error/empty states.
- Fluxos são a composição de tarefas individuais, não um lote que bloqueia distribuição.

A jornada de consulta: **Processos → Resumo** (últimos fatos e tarefas), **Andamentos** (DataJud completo, quando disponível), **Tarefas** (abertas e concluídas) e **Histórico** (mudanças humanas e automações). No Tasks Workspace, só evidência contextual sob demanda, sem deslocar a fila à esquerda.

## 7. Critérios de aceite verificáveis (test-first)

| ID | Requisito | Teste |
|---|---|---|
| A01 | fila esquerda desktop | bounding boxes 1440/1024 |
| A02 | layout sem overflow 390px | Playwright scrollWidth/clientWidth |
| A03 | letras A/B/C e opção tecla 1–9 | DOM + teclado |
| A04 | pressionar 1 não avança; Enter avança | Playwright |
| A05 | login responde a hora/dia, sem mocks | unidade + integração DOM |
| A06 | legenda literal e SSO preservado | Playwright + fonte |
| A07 | atribuições por processo com guarda de permissão | testes + mock de API |
| A08 | seleção múltipla e falha parcial | Playwright, backend pytest futuro |
| A09 | Ranking sem números demonstrativos | regra estática + payload oficial |
| A10 | Processos não mistura DataJud com auditoria | backend/contract futuro |
| A11 | Sem alteração de main/prod | branch e revisão do diff |
| A12 | Sol/Lua, zoom, resoluções 390/768/1024/1440 | capturas e testes visuais |
| A13 | Sem falha de JavaScript em navegação | pageerror monitor |
| A14 | Sem vazamento intercarteiras | backend pytest da rota futura |

**Critério de saída:** nenhuma feature declarada “pronta” se faltarem contrato do servidor e teste sobre dados reais. UI renderizada em fixture não prova integração com VPS/Benner/DataJud.

## 8. Diagnóstico end-to-end e backlog de bloqueadores

**P0 — verificado no código, modificado no frontend:** tela de atribuições por lote, geração de dados demonstrativos em Encerramentos, saudação e legenda de login, rotulagem A/B/C e preservação Q&A.

**P0 — verificação adicional obrigatória antes de produção:** autenticação real Microsoft, permissões específicas por carteira, respostas persistidas, erro/retry, dados oficiais de Benner e dashboards no servidor real. Testes de browser em preview usam mocks e não substituem smoke autenticado.

**P1 — backend necessário:** Processos como entidade estável, index e timeline DataJud paginados; eventos de auditoria; KPI fonte oficial por carteira; distribuição em escala por API paginada com operação transacional de redistribuição.

**P1 — governança de papéis:** mapear grants para Auxiliar Administrativo, Líder e Admin sem criar roles que não existam no backend; validar impactos em usuários atuais antes de migration.

**P2 — melhorias medidas:** capacidade estimada e tempo ativo por tipo, amostragem de qualidade por analista, inteligência de recomendação de atribuição, telemetria de latência p50/p95 e estudo A/B de interface *somente se houver ganho mensurável*.

## 9. Limites deste ciclo

Sem alteração em runtime backend de produção, migrations, workers, Cloudflare, Nginx ou credenciais. A branch inclui especificações, alterações React e testes. A publicação dependerá de validação visual, smoke autenticado em ambiente de teste e autorização de merge/deploy.
