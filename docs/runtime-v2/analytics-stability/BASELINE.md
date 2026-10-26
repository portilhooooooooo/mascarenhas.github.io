# Baseline e resultado medido

## Produção: observação anterior ao candidato

Captura em 2026-10-26T13:10:13Z, janela anterior de 30 minutos, tráfego existente, sem carga gerada pelo agente. Frontend público 25d654c; backend vivo e113eed/imagem ac23cc157170. P95 abaixo usa a amostra observada, não certifica operação normal.

| Endpoint | Status / n | P50 ms | P95 ms | Outros |
|---|---:|---:|---:|---|
| Encerramentos análises | 503 / 13 | 6.737 | 7.358 | Até 16 downstream; mais 1 x 429 |
| Base Geral resumo | 200 / 7 | 8.289 | 9.332 | Mais 1 x 429 |
| Base Geral resumo | 503 / 4 | 9.227 | 9.617 | SQL 57014 observado |
| Base Geral lista | 200 / 2 | 6.050 | 7.644 | Mais 1 x 503 em 8.968 ms |
| Benner consolidado | 200 / 7 | 1.215 | 2.526 | Mais 1 x 429 |
| Aging | 200 / 5 | 3.925 | 4.925 | Até 12 downstream; 3 x 429; 1 x 503 |
| Encerramentos resumo | 200 / 7 | 2.430 | 9.181 | Fonte antiga |

Raw: evidence/baseline-production.json. Não misturar sucessos e erros para reportar melhoria.

## Stage Postgre SQL: comparação controlada sintética

Banco descartável runtime_v2_analytics_stability, Postgre SQL, mesma instância/fixture por comparação; host compartilhado, sem isolamento de hardware. Sem tráfego gerado contra a API produtiva. 84 mil processos no total, divididos entre duas carteiras (42 mil por consulta de carteira), 252 mil linhas Benner e 168 mil carteira. Não é réplica da distribuição/volume por carteira de produção.

| Resumo Base Geral | n | P50 ms | P95 ms |
|---|---:|---:|---:|
| Função anterior efetiva | 20 | 1.306,11 | 2.424,85 |
| Lookup indexado com gate interno | 20 | 1.042,85 | 1.509,84 |

Amostras sequenciais por versão; P95 nearest-rank. Mediana aproximadamente 20% menor; P95 amostral aproximadamente 38% menor. Inclui chamada psycopg e resultado, sem HTTP/auth/PostgREST. Não é benchmark frio/quente de produção nem certificação de <=2 s. Browser e outros processos no host podem afetar dispersão.

EXPLAIN ANALYZE BUFFERS e raw samples: evidence/base-benchmark/analytics-base-benchmark.json. Duração do teste 68,29 s. Teste exige mediana candidata menor, não compara cada amostra.

Histórico preservado: primeira alternativa LATERAL com gate no ON passou paridade mas não melhorou P50 (330,52 ->337,64 ms, n=5, 20 mil processos). Após gate interno, amostra intermediária caiu de 336,62 para 203,39 ms, n=5. Esses números intermediários não substituem a comparação maior.

## Browser controlado

Antes, AS01 falhou: após 429, não houve recuperação. Na candidata Chromium, AS01 fez exatamente duas chamadas e aguardou 2.235 ms para Retry-After=2 s. Firefox: 2.323 ms. AS02 mostrou análises apesar do resumo 503 e preservou altura do bloco KPI em98 px. AS03 reentrou rapidamente três vezes; AS04 recuperou503 com duas chamadas.

São respostas de fixture, não valores reais do produto. Não usar duração completa do teste como tempo percebido de reentrada. A meta <100 ms não foi medida nesse candidato.

A01–A06/A14/A19 passaram no Chromium, incluindo atualização de15 s, geometria, filtros, F5 e ausência de hidratação de analytics ocultos. A medição de layout-shift existe no metrics.json, mas nenhum limiar global de CLS foi certificado. Screenshots e traces estão em artefatos do CI; cópias selecionadas no frontend.

## Análises

API candidata executa uma RPC (assert de integração com cliente mock); SQL executado no Postgre SQL e como service_role. Substitui a cadeia antiga observada com até 16 downstream. Não foi medida latência HTTP real da candidata, nem afirmado novo P95 desse endpoint. O tempo SQL isolado não substitui a cadeia HTTP.
