# Evolução 2 — 30/10/2026 — Dev Tasks

**NO-GO para produção.** Alterações exclusivamente em dev/tasks-workspace. Nenhum DDL, reinício ou publicação foi aplicado em produção.

## Resultado desta etapa
- Análises por escritório: nova runtime_v2_closing_analyses_office filtra o coorte no SQL antes da classificação, agregação e paginação. A lista de escritórios é validada na mesma carteira; a rota usa duas RPCs em vez de buscar todas as análises e processos. Histórico repetido usa EXISTS e não multiplica análises. O caminho sem escritório mantém a RPC anterior.
- Aging: nova encerramentos_aging_inputs reúne validações, histórico, entradas por pasta e aging validado em uma RPC. _build_monthly_aging permanece responsável pela mesma reconciliação, deduplicação e classificação. A pasta continua cruzada com CNJ; não se atribui aging pela pasta isoladamente. O limite de 10.000 históricos/validações permanece explícito e falha sem truncamento silencioso.
- Rollback de Análises: RUNTIME_V2_CLOSING_ANALYSES_SQL=0. Rollback do lote de inputs de Aging: CLOSING_AGING_INPUTS_SQL=0. As novas migrações devem ser aplicadas primeiro na instância de testes; a existência no repositório não significa aplicação no banco remoto.

## Validação executada
Banco novo runtime_v2_analytics_stability_evolution_20261030, separado do banco de testes anterior e sem conexão com tabelas de produção. Cliente de testes Docker limitado a 1 CPU/384 MB. O script recusa outro nome de banco. Perfis, CNJs e escritórios sintéticos; amostra real de 100 análises já desidentificada no repositório de referência.

|Verificação|Resultado|
|---|---|
|Paridade Análises sem escritório|288 combinações sintéticas + 24 comparações da amostra desidentificada|
|Paridade Análises com escritório|864 combinações: duas carteiras, escritórios distintos/desconhecido, tipo, concordância, busca e paginação; histórico duplicado e carteira externa|
|Paridade Base Geral|56 comparações padrão + 208 de limites de data, origem, filtros e lista completa|
|Aging|Mesmo JSON reconciliado: validação prevalece, saldo anterior pendente, movimentação repetida, última entrada correta e outra carteira excluída|
|Leituras Aging no cenário de teste|4 operações -> 1 RPC|
|Suíte SQL/API/reconciliação|25 passaram; 1 benchmark opt-in foi pulado e executado separadamente|
|Benchmark de Base Geral|1 passou; 10 amostras por variante/cenário, 4.000 registros sintéticos|
|Chromium focado em Encerramentos|Passou: tipo + escritório, cache mensal, troca de carteira sem dados antigos, cancelamento sem alerta e SSE pausado sem reconexão|

Total: **1.440 comparações exatas de filtros** além dos testes de Aging, API, autorização e navegador.

Também foram corrigidos e testados os contratos de falha: filtro inválido retorna JSON com 422, e capacidade analítica P0501 retorna 429 com Retry-After=1, sem depender de um handler ausente na branch legada.

## Base Geral — evidência nova
Consulta read-only no banco remoto: Regular tem 45.049 registros, 45.048 sem data e produto na fonte primária; Enter tem 28.624 registros, todos sem ambos. Isso comprova dependência de fallback, não a causa isolada do timeout. As flags RUNTIME_V2_BASE_GERAL_SQL, RUNTIME_V2_BASE_GERAL_SUMMARY_SQL e RUNTIME_V2_CLOSING_ANALYSES_SQL não estavam definidas no ambiente do container consultado.

Benchmark **sintético SQL, não HTTP nem produção**:

|Cenário|Agregada p50/p95|LATERAL p50/p95|
|---|---|---|
|Fallback parcial|76,15 / 87,47 ms|57,58 / 83,68 ms|
|Fallback em todos os registros|82,20 / 135,84 ms|118,27 / 227,00 ms|

A amostra pequena não estima p99 operacional. A variante LATERAL não foi habilitada globalmente: no cenário mais próximo da ausência de dados primários ela regrediu. A redução dos timeouts de Base Geral ainda exige plano do cenário real e medição em API isolada.

## Limitações e próximos bloqueios
- Backend Dev Tasks ainda não foi publicado em uma API independente; frontend continua apontando para o endereço compartilhado de produção.
- As novas RPCs foram criadas somente no banco descartável de testes. Não estão aplicadas ao Supabase de produção.
- O teste de navegador legado runtime-v2/browser.mjs passou no primeiro cenário e depois expirou esperando um KPI com estrutura/conteúdo antigo. Isso não foi apresentado como aprovação geral. O novo teste focado usa os componentes atuais e passou.
- Os quatro testes gerais já identificados como falhando no baseline continuam pendentes de reconciliação com a UI atual. Nenhum teste foi relaxado para obter aprovação.
- Ainda faltam otimização comprovada de Base Geral, latências HTTP p50/p95/p99 representativas, testes de rede adversa em todos os módulos e correlação temporal de infraestrutura/jobs/Metabase.

## Arquivos e execução
- routes/api/encerramentos_analises.py; routes/api/encerramentos_aging_meta.py
- Migrações novas: closing_analyses_office_sql e closing_aging_inputs_sql, mais dependências SQL originais versionadas para reproduzir os testes.
- scripts/analytics_stability_test_database.py e scripts/run_stability_evolution_tests.py
- tests/test_closing_office_sql.py; testes de paridade/reconciliação/base; tests/test_analytics_portfolio_reads.py
- Frontend: tests/closing-stability-browser.mjs e evidência docs/stability-evolution-20261030/closing-browser.json

Executar python3 scripts/run_stability_evolution_tests.py no host de testes após o bootstrap da base dedicada. STABILITY_BENCHMARK=1 executa o benchmark sintético separado. O runner usa somente a conexão do container runtime-v2-pg e nunca lê credenciais de produção; a imagem do backend é reutilizada como ambiente Python isolado.
