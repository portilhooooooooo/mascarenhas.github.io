# Matriz de testes e evidências

Frontend qualificado: e643f7bd747573de093f599ad367c8a56b0f6b6c, UTC 2026-10-24T03:05:07.783Z. API fixture, Chromium, build real em localhost. Vinte subcasos PASSARAM. PASSOU abaixo refere-se ao recorte controlado; não certifica integração. Os critérios integrais incompletos ficam NÃO EXECUTADO.

Fixture, ações e asserções: tests/runtime-v2/browser.mjs. Resultados, commit, timestamp, chamadas e duração: evidence/qualified/metrics.json. Cada ID tem screenshot e há trace.zip/browser.log. Duração do teste inclui waits deliberados e não é latência da API.

| ID | Resultado | Duração fixture (s) | Ações/asserções | Limite |
|---|---|---:|---|---|
| A01 | PASSOU | 0.13 | Perfil/evento imutável; painel abre. | Fixture; não integração. |
| A02 | PASSOU | 1.52 | Menu → Analytics → menu; instância, filtro 90, ordem e scroll; zero nova consulta fresca. | Fixture; não integração. |
| A03 | PASSOU | 0.94 | Atribuições realmente visível; volta conserva subaba, filtro, ordem e scroll. | Fixture; não integração. |
| A04 | PASSOU | 15.63 | Refetch da mesma chave com 15 s: quatro cards e bounding box preservados. | Fixture; não integração. |
| A05 | PASSOU | 15.52 | 30 → 7 com 15 s: slots ficam, valores anteriores não são atribuídos ao novo filtro. | Fixture; não integração. |
| A06 | PASSOU | 17.95 | F5 profundo: shell/slots, preferências e resumo somente após /me válido. | SLO de shell frio/quente não certificado. |
| A07 | PASSOU | 4.38 | Checksum/schema/TTL inválidos e quota esgotada: fallback sem crash. | Inclui A07-quota. |
| A08 | PASSOU | 2.18 | 503 e timeout: credencial preservada, shell inert, duas tentativas no máximo. | Inclui A08-timeout; latência real /me não certificada. |
| A09 | PASSOU | 2.71 | 401 SESSION_INVALID e 403 PROFILE_NOT_AUTHORIZED purgam acesso/cache. | Fixture; não integração. |
| A10 | NÃO EXECUTADO | 1.55 | Subteste de duas abas PASSOU. | Substituição em navegador distinto, OAuth concorrente real e exceção Admin não executados. |
| A11 | PASSOU | 0.93 | 401 antigo não revoga token novo; payload atrasado não cruza troca real de carteira na fixture. | Fixture; não integração. |
| A12 | NÃO EXECUTADO | 14.49 | Nove combinações de papel/carteira PASSARAM no browser. | Permissões/RLS/SQL reais não certificados. |
| A13 | PASSOU | 15.44 | Resumo de Encerramentos aparece antes do detalhe atrasado 15 s. | API inteiramente interceptada. |
| A14 | PASSOU | 1.82 | Produtividade gera /me, SSE e results; sem hidratação das filas ocultas. | Badges globais completos exigem cobertura de integração. |
| A15 | NÃO EXECUTADO | — | Suite operacional PASSOU: rascunho na navegação/F5 sem POST automático e confirmação explícita. | Não cobre todos os formulários, escrita durável concorrente nem idempotência real. |
| A16 | NÃO EXECUTADO | — | 1.125 replays offline de amostra real sem diferença numérica compartilhada. | Novos agregados SQL, base completa, XLSX/CSV e demais dashboards pendentes. |
| A17 | NÃO EXECUTADO | 1.96 | Subtestes 429/502/503/504 e invalidação após write confirmado PASSARAM. | Orçamento e backoff no transporte/backend real não certificados. |
| A18 | PASSOU | 22.05 | 50 reentradas: listeners/timers/DOM estáveis e sem nova consulta fresca. | Heap observado sem GC controlado; não certifica ausência absoluta de leak. |
| A19 | PASSOU | 0.38 | Sem pageerror; ocultos fora da árvore acessível; screenshots revisados. | Chromium; Firefox não executado; sem comparação pixel a pixel de todas as telas. |
| A20 | PASSOU | 1.81 | Perda de tasks.view limpa queries, resumo e rascunho do escopo. | Fixture; não integração. |

A07 inclui quota e A08 inclui timeout. A15 usa tests/processos-ui.mjs e evidence/operations, sem duração individual instrumentada. A16 usa scripts/runtime_v2_parity.py na branch backend. A10/A12/A17 têm subtestes PASSOU no JSON, mas não satisfazem o critério integral.

| ID backend | Resultado integral | Evidência parcial executada | O que falta |
|---|---|---|---|
| B01 | NÃO EXECUTADO | 1.125 replays de 139 eventos reais desidentificados/21 tarefas/13 perfis, sem desvio numérico compartilhado | Novos agregados SQL, base completa, coortes e exports |
| B02 | NÃO EXECUTADO | Builder mutável: 3 falhas antes, 3 testes passam após corrigir parâmetros; escopo preservado | Endpoint paginado no banco, total/ordem e plano reais |
| B03 | NÃO EXECUTADO | Request ID, versão, app e auth_dependency testados | Fila/rede/pool/PostgREST/SQL na mesma requisição |
| B04 | NÃO EXECUTADO | Modelo 30 críticos + 10 analytics; todos críticos 200 | HTTP/Gunicorn/banco/sessões/writes duráveis equivalentes |
| B05 | NÃO EXECUTADO | 59 testes unitários/regressão; regra de sessão preservada | Revogação e idempotência concorrente reais |
| B06 | NÃO EXECUTADO | Imagem derivada imutável b7ba52b, 59 testes e 1.125 replays sem bind de fonte | Runtime reconciliado e rollback operacional completo |

Backend: migration/runtime-v2-20261023, correção ac1f3f4, replay b7ba52b, documentação 0d78860. Fonte read-only: 59 PASSARAM em 4,39 s; imagem reconstruída: 59 em 3,36 s e 1.125 replays em 1,311 s. evidence/backend contém logs e sumário da amostra; dataset e referência completos ficam no repositório privado backend. Sem SQL/DDL ou deploy em produção. CI hospedado frontend/backend PASSOU nos commits registrados em evidence/CI_RESULTS.json, incluindo 20 subcasos/operacional e 59 testes/replay/benchmark. Revisão formal Codex Security e monitoramento de duas horas não certificados.
