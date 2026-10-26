# Diagnóstico final — Estabilização Analítica Runtime V2

Data: 26/10/2026. Parecer: **GO para revisão da candidata; NO-GO para promoção de produção neste momento.**

A candidata está implementada, commitada em branches isoladas e validada com navegador real, SQL executado, referência anterior e CI. Produção continua na Runtime V2 anterior. Não houve aplicação das novas migrações, novo deploy nem login do agente.

## Causas confirmadas

1. Encerramentos disparava leituras paralelas sem recuperação coordenada de 429; retry:false deixava a recusa terminal. Reproduzido no browser.
2. Análises paginava/associava dados e agregava em Python; logs observaram até 16 downstream e 13 falhas 503, com ReadTimeout. Uma RPC elimina esse caminho de transferência repetida no candidato.
3. Base Geral reconstruía fallbacks deduplicados globais por request; função efetiva e planos inspecionados. Lookup indexado condicionado passou nas 264 comparações de paridade da Base Geral e melhorou a medição sintética da Base Geral.
4. Respostas prontas de análises ainda dependiam da chave carregada do resumo para aparecer. Agora cada bloco possui chave independente.
5. Dashboard/etapas/consolidado possuíam retry interno adicional. Esses três leitores passam a uma tentativa; recuperação está no scheduler.

## Hipóteses e limites abertos

Origem exata de espera HTTP versus transporte/PostgREST/SQL de cada timeout não foi provada por um trace produtivo completo. Não culpar Supabase, VPS, índices ou pool sem correlação. Há evidência de custo SQL e transferências, mas não exclusividade causal.

Aging mantém agregação Python, páginas/lotes e limite auditável; auditoria identificou custo e sobreposição potencial, sem implementar cache/reuso entre coortes diferentes. O scheduler protege sua entrada e independência visual. Nenhum novo limite de concorrência/threads/timeouts foi aumentado.

Asset público verificado em https://backoffice.mba-advogados.workers.dev/assets/react-dashboard/dashboard-react.js: 688.956 bytes, uma ocorrência de /api/carteira-processual e nenhuma de /api/base-geral/summary. O main investigado também usa carteira-processual. Os requests reais de Base Geral estão no backend, mas a origem específica desse cliente não ficou identificada. O patch de RPC cobre o endpoint; não fingir que a página pública foi migrada para outro contrato. Leituras da Visão Geral atual foram incluídas no scheduler, preservando seu endpoint.

## Mudanças exatas

| Repositório / arquivo | Mudança |
|---|---|
| FE src/analytics/readScheduler.ts | Prioridade, 2 slots, orçamento, retry único, cancelamento e escopo |
| FE data-api.js | Expõe metadado Retry-After do erro |
| FE src/dashboard/EncerramentosPage.tsx | Leituras agendadas, chaves independentes, abort/lease, status localizado |
| FE src/dashboard/VisaoGeralPage.tsx | Leitura atual entra na lane analítica |
| FE src/dashboard/operacaoEncerramentosService.ts | Signal opcional somente na leitura |
| FE tests/analytics-scheduler.test.mjs | 7 testes executáveis |
| FE tests/runtime-v2/browser.mjs | AS01–AS04, controles 429/503 e evidências |
| BE routes/api/encerramentos_analises.py | Caminho SQL com flag; resposta/escopo preservados |
| BE routes/api/encerramentos_bi.py | Uma tentativa nos 3 leitores agendados |
| BE services/processos.py | Seleção de RPC Base Geral por flag |
| BE services/scoped_supabase.py | Novo RPC com carteira forçada pelo servidor |
| BE app.py | CORS expõe Retry-After e headers de rastreio |
| BE supabase/migrations/20261026131535_analytics_stability_closing_analyses.sql | Helpers e RPC backend-only de análises |
| BE supabase/migrations/20261026132034_analytics_stability_base_geral_indexed_lookup.sql | Novas RPCs resumo/lista, sem alterar funções antigas |
| BE tests/test_analytics_stability_{api,base_sql,closing_sql}.py | API, paridade e SQL executados |
| BE scripts/analytics_stability_test_database.py | Bootstrap reproduzível, recusa outro banco |
| Ambos .github/workflows/analytics-stability.yml | CI específico sem deploy |
| Ambos docs/runtime-v2/analytics-stability | SPEC, arquitetura, baseline, paridade, testes, execução e rollback |

## Resultado medido

576 comparações exatas, 7 unitários do scheduler, 35 testes backend aprovados (benchmark opt-in separado), 12 cenários Chromium e 4 Firefox. CI frontend e backend aprovados. Não confundir contagem de combinações com contagem de testes.

Base Geral no stage: 84 mil processos totais em duas carteiras, 20 amostras/versão. P50 1306,11->1042,85 ms; P95 2424,85->1509,84 ms. Comparação não mede auth/HTTP e não certifica operação produtiva.

429 recuperado em duas chamadas, respeitando 2 s do servidor. KPI de análises aparece com resumo 503; altura 98 px preservada. A01–A06 e A14/A19 passaram nos testes selecionados, sem erros de console. Metas <100 ms e P95 HTTP<=2 s seguem pendentes.

Há uma falha antiga reproduzida no main anterior em test_closing_benner_guard: URL vazia produz BENNER_BASE_URL_INVALIDA antes da asserção de conflito. Seis testes de escrita foram ignorados por falta da fixture completa na bateria ampliada. Nenhum desses resultados foi promovido a PASSOU.

## Artefatos e revisão

- ARCHITECTURE.md: antes/depois, alternativas e auditoria aging/Benner.
- BASELINE.md: números, ambientes, amostras e limitações.
- PARIDADE.md: regras, 576 combinações e amostra real reduzida.
- TEST-MATRIX.md: status, falhas e links dos CIs.
- RUN_LOCAL.md: reprodução browser/SQL sem produção.
- ROLLBACK.md: ordem proposta e reversão por flags/artefato.
- MIGRATION_LOG.md: branches e commits.
- evidence: logs, planos, amostras brutas, hashes e baseline.
- Frontend/evidence: screenshots e métricas selecionadas; traces completos nos artefatos CI.

Branches e commits:
FE: fix/analytics-stability-20261026,4c12e12b6eb87641855f6fe99572e1b26fcae1e2.
BE: migration/analytics-stability-20261026,22c6c8568068cbfe7ead4262f96447861c4a109c +1bfc48f1bee340514be8f461ed2730ea4d85d8fe.
Documentação posterior não muda o runtime testado.

## Condições ainda necessárias para promoção

Revisão da candidata e migrações; validação autorizada da cadeia HTTP real com novas flags; comparação com amostras reais estratificadas além de 100 Regular; medição por status/carteira em ambiente equivalente; validação de exportações reais; decisão explícita de promoção. Nenhum novo teste de carga ou gravação deve ser executado em produção para satisfazer esse gate.

Riscos residuais: distribuição de fontes/índices em produção pode mudar benefício; aging permanece caro; limiter do browser não limita outros usuários/abas; admissão backend continua necessária; cancelamento HTTP não garante cancelamento SQL; primeiras aberturas dependem de rede/identidade válida.

Não há conclusão de “incidente produtivo resolvido”. A conclusão comprovada é uma candidata estrutural, com rollback, paridade e CIs aprovados, pronta para revisão.
