# Base Geral — fluxo de dados e otimização (26/10/2026)

## Coleta do frontend

| Interface | Endpoint | Origem |
|---|---|---|
| Cards, produto, filtros e donut | GET /api/base-geral/summary | ProcessosRepository.base_geral_summary; RPC SQL |
| Em encerramento | GET /api/operacao/encerramentos/items | Fila operacional separada: aptos e não enviados |
| Clique no card | GET /api/base-geral/processos | RPC de lista por categoria + paginação |
| CSV | GET /api/base-geral/export | RPC paginada, exportação completa |

A página React src/dashboard/BaseGeralPage.tsx obtém a carteira de MBA_API.getPortfolioId, constrói filtros com queryFor (período da entrada, UF, situação, produto, resolução) e chama runtimeQueries.fetchQuery. A chave de cache contém runtimeScope (usuário, sessão, carteira, permissões), módulo e filtros. O frontend não acessa PostgreSQL diretamente.

A leitura tem staleTime 75s; o botão Atualizar invalida a chave; revalidação a cada cinco minutos e na retomada da visibilidade. O evento mba:portfolio-changed remove dados/caches de outra carteira e impede exibição de filtros obsoletos.

## Caminho backend

1. GET /api/base-geral/summary: autorização dashboard.view, wallet do servidor, validação dos filtros.
2. Redis por carteira + filtros + cutoff: cache fresco 75s, fallback anterior 300s com sinalização explicita, lock distribuído para evitar stampede.
3. ProcessosRepository → função RPC selecionada por RUNTIME_V2_BASE_GERAL_SUMMARY_SQL; as listagens permanecem na RPC otimizada.
4. Dados: processos_directory, base_processual, base_benner, processos_carteira, processos_movimentacoes_index.
5. Resposta: summary, charts.por_produto, filters, cutoff, updated_at e _read_status (live, fresh-cache, stale).

## Diagnóstico real

Na carteira Agibank Regular, a base_processual tem 45.049 registros, dos quais 45.048 estão sem data e produto na fonte principal. O fallback para Benner e processos_carteira precisa ocorrer quase sempre. A função LATERAL ativa excedeu timeout de 8 segundos na medição; a função alternativa baseada em junções de conjunto levou cerca de 5,86 segundos. ANALYZE executado nas cinco tabelas envolvidas em 26/10/2026, sem alterar os dados.

## Invariantes

A autorização acontece antes de qualquer leitura de cache. Cache por carteira e filtros impede vazamento de dados entre identidades. Resultados antigos são exibidos com aviso de desatualização; nunca como números novos. Não alterados: aging (18 meses calendários), classificação, deduplicação CNJ, workers ou permissões.

## Próxima fase recomendada

Criar uma projeção incremental canônica, alimentada pela ingestão Benner/CPJ/DataJud com versionamento, reconciliação e invalidação de cache. Medir frescor, paridade, duplicidade e latência antes de migrar leituras. Evitar cron/materialized view desatualizados sem controle de consistência.
