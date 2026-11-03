# Auditoria de estabilidade — Dev Tasks — 30/10/2026

Estado: **NO-GO / trabalho parcial**. Nenhum deploy ou DDL foi executado em produção.

## Baseline e isolamento
Frontend remoto 5ff5e02; backend remoto d420f07. As worktrees locais dev/tasks-workspace estavam em fd14612 (com alterações locais de terceiros) e f453663. Foram usados checkouts isolados dos heads remotos; não houve reset, merge da main ou cherry-pick de toda a branch de escritório.
O config.js de Dev Tasks aponta para api.portilhobackoffice.site, que o Nginx encaminha ao backend de produção em 127.0.0.1:5050. A branch backend remota não continha os módulos atuais de Encerramentos, Base Geral ou SSE. Uma API de testes isolada é pré-requisito para validação HTTP real sem alterar produção.

## Matriz de diagnóstico
|Problema|Causa/evidência|Impacto|Correção|Estado|
|---|---|---|---|---|
|Escritórios OPTIONS 404|Rota ausente no backend servido; branch dev também sem módulos de Encerramentos|Filtro não carrega|Integração seletiva dos módulos de leitura de 71b0511, registro no blueprint e guard de carteira com vínculo ativo|Testes isolados passaram; não publicado na API|
|Análises lentas|Caminho Python pagina até 10.000 análises, busca processos/perfis em lotes de 150; logs ReadTimeout|Falha e ocupação de thread|RPC runtime_v2_closing_analyses passa a ser padrão sem escritório; existe no banco e preserva contrato; flag 0 mantém rollback|Um RPC em teste; paridade SQL e latência HTTP pendentes|
|Análises por escritório|Implementação preparada desvia da RPC e filtra CNJs após carregar análises|Continua cara para coortes grandes|Recorte preservado; requer extensão SQL por escritório e teste de paridade|Pendente|
|Taxa de envio|_args passou de 8 para 9 valores, consumidor antigo não atualizado|Erro de desempacotamento|Desempacotamento corrigido; escritório não suportado rejeitado explicitamente|Teste passou|
|Aging mensal|Múltiplas páginas de histórico/validações + RPC etapas + lotes de 80 pastas; logs ReadTimeout|Alta latência|Módulo de leitura integrado sem alterar metodologia; cache frontend mensal não varia por tipo/período|Otimização SQL e paridade pendentes|
|Base Geral 57014|Statement timeout confirmado; endpoint não existe na branch backend dev|Dashboard indisponível|Nenhuma alteração especulativa de timeout/SQL|Investigação do plano completo pendente|
|SSE 403|Backend pausado por capacidade; frontend ignora REALTIME_PAUSED e reinicia em visibility/profile|Ruído, consultas inúteis e diagnóstico de autorização incorreto|Lê código; pausa tentativas por ciclo da página; mantém identidade e revalidação existente dos módulos|Teste comportamental passou|
|Accept SSE|backendFetch sobrescrevia text/event-stream por application/json|Contrato HTTP incorreto|Preserva Accept explícito|Teste passou|
|Prazos de leitura|Budget do scheduler abortava com AbortError igual à navegação; página silenciava|Falha real oculta|ANALYTICS_TIMEOUT 504 distinto; abort externo preservado; orçamento não aumentado|Teste passou|
|Chamadas mensais redundantes|Benner/Aging sob chave de filtros que não recebem|Reconsulta por mudança de tipo/data|Chaves mensais independentes de tipo/data, preservando escopo e revisão|Build passou; QA React concorrente pendente|
|Cache de escritórios|Fetch direto a cada reentrada|Tráfego repetido|TanStack por runtimeScope e lane analítica|QA de navegador pendente|
|RAM/swap|7.816 MB total; 3.739 MB disponíveis; swap 4.091/4.095 MB; vmstat si/so 0 nas duas amostras seguintes; PSI avg10/60/300=0|Swap ocupada não prova pressão ativa|Nenhum serviço alterado|Sem vazamento ou causa de incidentes comprovados|
|Metabase|1,135 GiB no docker stats; SQL lento é indício de consumo, não causalidade|Possível concorrência a investigar|Somente leitura|Correlação temporal pendente|

## Performance e infraestrutura observadas
- pg_stat_statements: encerramentos_etapas_v2 2.905 chamadas, média 399,5 ms, máximo 5.598,2 ms; dashboard_fast 2.498 chamadas, média 408,0 ms, máximo 7.658,2 ms. Acumulados do banco, não latência HTTP e não percentis.
- Nginx no dia, na coleta: 5 respostas 503, 22 respostas 499, 62 GET stream 403 e 9 OPTIONS escritórios 404. Os 499 indicam cliente encerrando a conexão; não demonstram isoladamente crash do servidor.
- EXPLAIN ANALYZE BUFFERS somente de leitura, timeout local 5s: semi-join escritório/projeção em 593,262 ms; índices encerramentos_processos_pkey, encerramentos_historico_escritorio_idx e encerramentos_historico_cnj_escritorio_idx utilizados; sem seq scan nesse recorte. Escritório mínimo testado não tinha correspondências na projeção; não extrapolar para demais escritórios.
- Histórico: 16.647 linhas, 10.210 identificadas, 6.437 sem escritório, 8 escritórios, zero CNJs com mais de um escritório identificado. Nenhum registro foi atualizado.
- Gunicorn: 2 workers x 4 threads. SSE não reativado. Redis 13,66 MB, fragmentação 1,17, zero conexões rejeitadas/evictions. Supabase: 12 conexões na amostra, 1 ativa; max_connections=60. Isso não mede limite do pool HTTP nem pico histórico.
- Backend usa identidade e carteira na validação; cache do dashboard inclui identidade e permissões. Falha de consulta de vínculo retorna 503 e não concede acesso.

## Antes/depois comprovado em testes
|Métrica|Antes|Depois|Natureza|
|---|---|---|---|
|SSE após perfil/visibilidade repetidos|Nova tentativa a cada evento|1 tentativa total quando REALTIME_PAUSED|Teste executando data-api.js|
|Deadline esgotado|AbortError silenciado|ANALYTICS_TIMEOUT, status 504|Scheduler real|
|Análises sem escritório|Páginas + lotes relacionados|1 RPC (além da validação de vínculo)|Flask com banco simulado|
|OPTIONS escritórios no código dev|404, rota ausente|200|Flask isolado|

p50/p95/p99 e antes/depois operacionais **não disponíveis**: sem séries de duração por endpoint no log consultado e sem API Dev Tasks independente. Não calcular percentis a partir de médias. Nenhum ganho de latência de produção é alegado.

## Validação e limites
Build React/TypeScript passou. Testes novos de preflight, vínculo, permissão, filtros, RPC única, SSE, Accept e deadline/cancelamento foram executados. A suíte geral test:hardening falha na asserção de login (espera variável auth; código baseline usa MBA_AUTH diretamente). Execuções separadas também falham em portfolio-policy (posição do seletor), routing (redirecionamento de Ranking) e frontend-stability (label de filtro). Q&A e session-race passam. Estas falhas não foram tratadas como evidência de estabilidade nem corrigidas fora do escopo. Sem validação completa de navegação rápida, rede adversa, paridade em todas as carteiras ou logs pós-publicação.

Migrações do commit 71b0511 foram incluídas como dependências, sem aplicação. As três RPCs de escritório já existem no projeto consultado e são SECURITY INVOKER. A RPC runtime_v2_closing_analyses também existe; a disponibilidade e os privilégios devem ser confirmados na instância Dev Tasks antes de servir o código. Não executar essas migrações em produção como parte deste trabalho.

## Pendências para GO
1. Disponibilizar uma API Dev Tasks isolada com o mesmo contrato, sem mudar o endereço de produção.
2. Resolver o caminho SQL de análises por escritório, o aging e a Base Geral; comparar metodologia com corpus de referência.
3. Medir HTTP p50/p95/p99, chamadas e cancelamentos em cargas representativas, sem disputar jobs reais.
4. Executar QA de troca rápida de carteira e filtros, falhas de rede e segurança RLS; corrigir a suíte geral preservando seu objetivo.
5. Comparar indicadores e logs antes/depois na API de testes. Nenhuma aprovação para produção é dada.
