# P7 — Integração das rotas V3 ao Backoffice

Data: 2026-11-05 (America/Manaus). Continuação P7, sem P8 e sem cutover produtivo.

## Resultado e escopo

Os dez módulos de **leitura** estão conectados no frontend operacional, selecionáveis individualmente em build de homologação. O adapter está integrado à factory Flask existente e usa SessionService, PortfolioAccessService e PermissionService atuais. A aplicação WSGI da P6 e seus contratos são reutilizados internamente; nenhum novo backend ou login foi criado.

A configuração normal permanece LEGACY, e o adapter está desativado por padrão. O exemplo de homologação seleciona V3 para todos os dez módulos, atendendo à solicitação de conectá-los. Conexão de uma tela não certifica completude do domínio nem autoriza produção.

A P6 foi preservada a partir de `b016d2427da94b112bdf7a350aaa12700663c8e5`, sem merge de main. Backend base `77fc1d0c256f8d27bd4cc29dad4c6c1ea8ad2d9f`. Nova branch frontend `dev/v3-routes-testing` foi criada e publicada inicialmente nesse HEAD P6. Backend continua `dev/databasev3`.

## R00 → R07

| Etapa | Resultado |
|---|---|
| R00 | Branch de testes criada do remoto dev/databasev3; builds normal/P6 aprovados; baseline publicada. |
| R01 | Factory Flask registra adapter opt-in GET /api/v3; sessão, carteira, permissões e revogação verificadas no backend. |
| R02 | Cliente TS centralizado, TanStack separado, flags por módulo, abort/timeout/retry e instrumentação de latência. |
| R03 | Processos, Cadastro e Andamentos conectados e testados sobre o recorte disponível, com cobertura parcial explícita. |
| R04 | Todos os outros sete módulos conectados para homologação; promoção de dados não certificados continua retida. |
| R05 | Cache por transporte/identidade/carteira/tenant/permissões, filtros e cursor; invalidação de sessão/carteira e rejeição de respostas antigas. |
| R06 | Testes locais e medições V3 aprovados. Comparação equivalente com legado e login hospedado real permanecem pendentes. |
| R07 | Auditorias do diff concluídas; achado de visibilidade de tarefas corrigido e verificado; publicação exclusivamente nas branches dev. HEADs finais devem ser confirmados por git ls-remote após push. |

## Rotas e decisão por módulo

Todas as linhas têm o reader V3 implementado e navegação testada. `V3_READ_READY` abaixo significa aptidão da leitura no recorte **isolado de homologação**, com limitações indicadas. `LEGACY_RETAINED` significa que a fonte normal permanece legada até validar cobertura/população; o reader V3 pode ser exercitado pelo exemplo de testes. Nenhuma linha representa aprovação de cutover.

| Módulo | Navegação existente/subrota | Família legada preservada | GET V3 | Decisão de promoção e evidência |
|---|---|---|---|---|
| Processos | /processos | /api/processos | /api/v3/processos | V3_READ_READY no recorte Benner: lista real, filtros, paginação, detalhe e timeline. Campos sem evidência mostram ausência/parcialidade. |
| Cadastro | /analytics/cadastro | /api/base-geral/summary e /api/base-geral/processos | /api/v3/cadastro | LEGACY_RETAINED: no tenant Benner completo não há resultados de reconciliação Benner×CPJ. V3 exibe PARTIAL, não ausência comprovada no CPJ. |
| Andamentos | /analytics/andamentos | /api/integrations/benner-andamentos/status | /api/v3/andamentos | LEGACY_RETAINED: sem eventos confirmados nesse tenant; V3 vazio parcial, sem lançamento Benner. |
| Encerramentos | /operacao/encerramentos e /analytics/encerramentos | serviços EncerramentosPage/OperacaoEncerramentosPage | /api/v3/encerramentos | LEGACY_RETAINED: ausência de classificações reais no recorte não comprova elegibilidade ou autorização. |
| Liminares | /operacao/liminar | /api/operacao/liminar | /api/v3/liminar | LEGACY_RETAINED: sem evidência jurídica populada suficiente; reader/erro/permissão disponíveis. |
| Pagamentos | /operacao/pagamentos | /api/operacao/pagamentos/summary e /items | /api/v3/pagamentos | LEGACY_RETAINED: sem prova financeira real no recorte, sem inferir falta de comprovante. |
| Faturamento | /analytics/faturamento | /api/base-geral/faturamento | /api/v3/faturamento | LEGACY_RETAINED: quatro perfis nomeados + dashboard.view + carteira Regular; leitura de teste explicitamente não é faturamento efetivo. |
| Controladoria | /controladoria/protocolos | ControladoriaPage e serviços de protocolos existentes | /api/v3/controladoria | LEGACY_RETAINED: projeção humana/população não certificada; requer automations.view e tasks.view_others. |
| Tarefas | /tarefas | /api/tasks e TasksApp | /api/v3/tarefas | LEGACY_RETAINED: tasks.view + tasks.view_others para leitura de equipe; projeção própria por atribuição ainda não certificada. Rotas de execução continuam operacionais. |
| Automações | /automacoes | consultas de saúde/status de integrações existentes | /api/v3/automacoes | V3_READ_READY para acompanhamento dos 31 jobs existentes; somente consulta, nenhum dispatcher ou worker iniciado. |

Os endpoints P6 de lista, `/summary`, detalhe e timeline de Processos são reutilizados. Erros/estados e versão de contrato `1.0.0` permanecem explícitos. O adapter acrescenta metadados de contexto ao status e limitação `SOURCE_COVERAGE_NOT_CERTIFIED`; respostas CURRENT de dados são conservadoramente PARTIAL na homologação. XLSX oficial não foi inventado.

## Autenticação, autorização e isolamento

- Usa o bearer `ba_` já obtido pelo fluxo atual. Login Microsoft, OAuth e TOTP permanecem intactos. `tw_` é capacidade de execução restrita e não ganha acesso ao diretório V3.
- Valida perfil ativo/desbloqueado/administrativo e provedor operacional; aplica papéis atuais, membership e permissões efetivas por carteira, incluindo exceções de master já existentes.
- Escopo vem do header X-Portfolio-Id autorizado e do binding privado servidor carteira→tenant/módulos. Manipulação de tenant/carteira no query string, origem fora da allowlist e parâmetros repetidos são rejeitados.
- A autorização é consultada sem Redis no adapter, e revalidada após SQL antes de enviar a resposta. Identidade opaca inclui sessão, perfil, papel, versão e permissões.
- Faturamento mantém a allowlist existente dos quatro perfis e Regular; autorização de pagamento e faturamento não se confundem. A projeção financeira B13 existente foi preservada.
- A auditoria identificou que `tasks.view` sozinho não autoriza uma listagem de equipe. O commit corretivo exige `tasks.view_others` para Tarefas e Controladoria e impede que suas projeções reapareçam no detalhe/timeline de Processos. Perfis restritos continuam com os serviços operacionais próprios existentes; não foi criada atribuição sintética para liberar V3.
- SQL continua parametrizado, read-only/repeatable-read, com RLS e role Foundation restrita. Banco/role fora da allowlist Foundation não é aceito. Timeout SQL 3s e orçamento de leitura 5s foram mantidos.
- Adapter aceita apenas GET; métodos de escrita retornam 405. Nenhuma flag habilita escrita externa ou remove guardas P4/P5. Factory/serviços operacionais não são executados no ambiente produtivo por este trabalho.

## Configuração e rollback

Frontend: copiar `.env.routes-testing.example` para `.env.routes-testing` local (ignorado pelo Git), ajustar somente as origens de homologação autorizadas e executar `npm run build:routes-testing`. O arquivo é dotenv, não deve ser carregado com `source` em shell: as aspas do JSON precisam ser preservadas. Cada entrada de `VITE_V3_READ_SOURCES` aceita `V3` ou `LEGACY`; valor ausente/inválido seleciona LEGACY. `VITE_V3_ROUTES_ENV` e `VITE_V3_READ_ALLOWED_ORIGINS` também são obrigatórios para selecionar V3.

Backend: `V3_ROUTES_ENABLED=true` apenas em APP_ENV development/testing/staging; `V3_ROUTES_ALLOWED_ORIGINS` exige allowlist explícita; `V3_ROUTES_SCOPE_BINDINGS` exige JSON carteira→`{tenant,modules}`. Configuração privada Foundation deve ser fornecida via V3_FOUNDATION_CONFIG, com modo0600. Nada disso foi adicionado ao ambiente operacional ou ativado para usuários reais.

Rollback de um módulo: selecionar LEGACY e reconstruir o frontend de homologação; manter o adapter desativado ou remover esse módulo do binding servidor. Para rollback completo, remover as configurações de testes e executar o build normal; desativar V3_ROUTES_ENABLED. Não há migração reversa ou alteração de dados a executar. Não se faz fallback automático após401/403: a sessão é revalidada/bloqueada e o cache é descartado.

Execução local reproduzível do teste: no backend, `V3_FOUNDATION_CONFIG=<arquivo privado> .venv/bin/python tests/v3/backoffice_server.py --fixture-authority`; loopback18767, workersfalse e sem credenciais hospedadas. Servir o build V3 em127.0.0.1:5189 e o normal em127.0.0.1:5190; executar `npm run test:routes`. O harness não é carregado pelo backend normal.

## Cache, atualização e recuperação

Cache V3 é separado do runtime legado e do preview sintético. A chave contempla transporte, identidade opaca, carteira, tenant, módulo, filtros e cursor. Cursor HMAC inclui revisão de dados e contexto; mudança de revisão exige reiniciar a paginação. Status revalida a autoridade a cada30s; eventos de perfil/permissão/carteira/logout/expiração cancelam e limpam consultas imediatamente.

Respostas atrasadas são descartadas pelo transporte existente por token/carteira/epoch e pelo cliente V3 por escopo. Denial latch global usa o escopo capturado antes do request e permanece mesmo se o transporte desmontar a tela. Retry limita-se a uma nova tentativa de leitura por falha transitória;401/403 não repetem nem acionam legado.

Últimos dados aparecem somente para uma revisão da mesma query/contexto ainda autorizado, com estado Defasados e mensagem “Atualização indisponível. Últimos dados preservados. Tentar novamente.” Consultas novas sem dados não exibem um snapshot de outro filtro ou carteira. Cobertura parcial, sem registros no recorte, indisponibilidade e permissão negada têm apresentação distinta. Estilos operacionais estão contidos em .v3-read-surface; não foi carregado o CSS global do preview P6 na aplicação normal.

## Testes e evidências

- Backend: **70 passed,8 skipped** no conjunto selecionado de integração, contratos P6, parser XLSX B12, permissões e regressões de sessão. JUnit `evidence/p7/routes/R06-regression.xml`. Os oito testes SQL do runtime legado exigem RUNTIME_V2_TEST_DSN apontando para um PostgreSQL descartável próprio, não configurado nesta execução; não foram apresentados como aprovados. A Foundation isolada continuou disponível para os testes V3.
- Adapter: sessão válida/inválida/revogada, tw_ restrito, memberships, origem, manipulação de escopo, métodos405, autorização financeira positiva/negativa, consulta de todos os módulos, paginação, filtros, detalhe/timeline, SQLerror, timeout, concorrência, revogação pós-SQL e visibilidade de equipe.
- Browser operacional: **23 checks,70 chamadas API,0 erros JS,0 escritas**. `docs/v3-evidence/routes/browser.json` no frontend. Inclui dez leitores, cobertura parcial, filtros combinados, paginação, detalhe/timeline, falha de rede/última revisão, acesso negado, billing restrito/autorizado fixture, troca de carteira/resposta atrasada, expiração e fallback explícito para build normal.
- Regressão do preview P6: **23 checks,43 chamadas API,0 erros JS**, reaproveitando os dados sintéticos existentes. A sessão antiga havia expirado; foram criadas somente duas sessões sintéticas de uma hora para os mesmos usuários/grants existentes. Nenhum Provider ou importação de dados foi executado. Tokens ficam em arquivo privado local fora do Git.
- Builds normal, routes-testing e preview P6 aprovados; hardening/routing/portfolio/session-race existentes aprovados.
- Filtros reais adicionais verificados sem publicar identificadores: UF retornou200; fase+produto200; CNJ+UF+fase+produto200 e um resultado. Sem ampliar timeout.
- Auditoria backend `dccf9710-1180-4901-aeb3-a52c1616c9dc`: diff imutável77fc1d0..c0f956d, um achado de autorização de equipe. Corrigido em16dfdd7; revisão suplementar confirmou403 e ausência de consulta para perfis semteamgrant, incluindo Controladoria. Query delta também foi revisado.
- Auditoria frontend `a1003df5-7964-4294-9ca2-533035f747dd`: diffb016d24..416eac1, todos13 arquivos runtime e3 auxiliares revisados, nenhum achado novo. O trabalhador de revisão ficou indisponível por limite de uso; revisão de arquitetura e conclusão foram feitas sequencialmente pelo agente principal. Ajuste posterior3875271 só corrige keyframe CSS e foi revisado separadamente.

As verificações de autenticação usam o mecanismo real existente, com **transporte de autoridade fixture** no harness local. Não demonstram login Microsoft/TOTP nem aceitação de sessão real pelo serviço hospedado. A prova hospedada depende de sessão e ambiente autorizados; não foi simulada como concluída.

## Performance e correções

Medição read-only sobre o mesmo recorte existente de60.221 observações Benner, com autoridade de transporte fixture. Não foi criada coorte/importação.

| Medida | Amostra | p50 | p95 | p99 |
|---|---:|---:|---:|---:|
| Flask adapter em processo, concorrência4 |100|849,99ms|1.061,60ms|1.332,87ms|
| HTTP loopback, sequencial |30|254,54ms|441,58ms|não calculado (amostra insuficiente)|
| SQL domínio, concorrência4 |100|714,03ms|808,45ms|1.150,26ms|

130/130 respostas200;3 queries de domínio e3 ajustes de budget por leitura; resposta12.625bytes. RSS de pico do processo de medição50.980→58.156KiB; não é memória total do backend/DB. Evidência `evidence/p7/routes/R06-performance.json`.

A primeira medição expôs timeouts por enriquecer diretório com current_states amplo. O enriquecimento foi limitado às chaves de fonte dos processos selecionados, preservando versão corrente/segurança invoker/RLS. Cadastro excedia3s só compilando JIT para plano com JSON/subqueries; JIT agora é desligado apenas na transação de leitura. A amostra final acima foi obtida após as correções. Não se ampliaram timeouts nem índices/migrations.

**Comparação equivalente LEGACY×V3 pendente:** rotas legadas dependem do transporte operacional hospedado, não disponível/autorizado neste harness. Fallback no browser usa fixtures e não serve como benchmark legado. O JSON registra NOT_COMPARABLE, sem alegar aceleração, SLO hospedado ou capacidade produtiva. Essa limitação mantém R06 parcialmente validada.

## Integridade, publicação e pendências

Nenhuma nova importação Benner/CPJ, coleta DataJud, reprocessamento jurídico, exclusão de jobs, faturamento real ou alteração de provisões. Consulta read-only final manteve32 migrations,60.221 source_states,31 jobs e0 external_actions no tenant Benner completo. Arquivos de migrations permanecem sem diff. O gate NO_GO produtivo anterior não foi alterado.

Commits de implementação: backend `c0f956d0a00937a634230c6b3e9114db11945a09` e `16dfdd78808ebea9900a07144728b68d3db3bf24`; frontend `416eac1f5669749da1e57896e4da3c40d443ec53` e `38752712649e8a8283fd3a6bba45e1d4f2953360`. Relatório/evidências são publicados em commits posteriores nas mesmas branches. Os HEADs completos de entrega são confirmados depois do push e registrados no relatório final ao usuário.

Pendências reais: validar transporte de sessão real em homologação autorizada; comparar legado e V3 em condições equivalentes; comprovar reconciliação CPJ/Benner, eventos, finanças e projeção humana antes de promover fontes; projetar tarefas próprias com autoridade confiável para perfis sem view_others; certificar capacidade/cobertura antes de liberação de usuários. Nenhum Nginx, DNS, Cloudflare, container, worker real ou rota produtiva foi modificado.
