# Matriz de testes executados

> Atualização pós-revisão: ver [REVIEW.md](REVIEW.md). Código FE cbba140 / BE 7041476. CIs específicos aprovados; gate geral de segurança falhou em dois aliases preexistentes. NO-GO para promoção.
Código FE 4c12e12; código BE 22c6c85; complemento reproduzível de testes BE 1bfc48f. Commits seguintes são documentação/evidência. Os primeiros ensaios da implementação ocorreram com worktree ainda não commitada e são descritos como ensaios, sem atribuir a eles um hash novo fictício.

| ID / escopo | Resultado | Evidência |
|---|---|---|
| AS01:429 + Retry-After + recuperação | PASSOU Chromium e Firefox | Duas chamadas, espera >=2 s; metrics e screenshots |
| AS02:503 no resumo não impede análises | PASSOU nos dois browsers | KPI visível e altura 98 px |
| AS03:cancelamento/reentrada rápida | PASSOU nos dois browsers | Três alternâncias e resumo visível |
| AS04:503 transiente nas análises | PASSOU nos dois browsers | Duas chamadas e recuperação |
| A01 permissões imutáveis | PASSOU Chromium | Fixture, sem mudança de grants |
| A02/A03 navegação e subabas | PASSOU Chromium | Estado/DOM preservados; retorno fresco sem fetch |
| A04/A05 atualização lenta/filtro | PASSOU Chromium | 15 s controlados; estrutura estável/chave correta |
| A06 F5 profundo | PASSOU Chromium | Filtros/estado conforme contrato existente |
| A14 módulos ocultos | PASSOU Chromium | Sem filas/analytics indevidos nessa jornada |
| A19 console/acessibilidade | PASSOU Chromium | Sem erros; módulo oculto fora da árvore visível |
| Scheduler unitário | 7 PASSARAM | Prioridade/limite2, cancelamento, RetryAfter, 401/403, tentativas e escopo |
| API + SQL + regressão de leitura | 35 PASSARAM / 1 IGNORADO | Benchmark é opt-in e foi executado separadamente |
| Análises SQL sintéticas | PASSOU | 288 comparações exatas com referência Python |
| Amostra real reduzida | PASSOU | 24 comparações;100 Regular; sem IDs reais |
| Base Geral padrão/bordas | PASSOU | 56+208 comparações exatas |
| SQL ACL/carteira | PASSOU | Sem EXECUTE anon/authenticated; proxy força escopo; service_role executa |
| Benchmark Base Geral | PASSOU | n=20/versão,84 mil total; plano/amostras brutas |
| Bootstrap reproduzível | PASSOU local e CI | Banco descartável, guard por nome |
| Guard Benner legado, teste ampliado | FALHOU, pré-existente | BENNER_BASE_URL_INVALIDA; reproduzido no main anterior |
| Idempotência de escrita na bateria ampliada | NÃO EXECUTADO /6 skip | DSN Runtime V2 completa não fornecida à fixture mínima; nenhuma alegação nova de validação |
| HTTP autenticado real com novas RPCs | NÃO EXECUTADO | Sem login do agente e sem deploy/migração produtiva |
| XLSX/CSV reais e paridade de toda população | NÃO EXECUTADO | Listagem/API testada; export real pendente |
| Nova carga30+10/auth/write | NÃO EXECUTADO | Não necessária para validar este patch local; impede certificar meta de concorrência produtiva |
| Memória50 trocas/CLS global | NÃO EXECUTADO neste patch | Não repetir suite histórica como prova nova |
| Meta produção<=2 s e reentrada<100ms | PENDENTE | Não certificada com fixture/SQL isolado |

Bateria ampliada antes da seleção final:41 passaram, 6 skips, 1 falhou (guard Benner citado). Não reportar essa bateria como verde. A falha foi repetida no checkout main anterior,1 falha em 1,18 s; não foi corrigida alterando a regra de Benner. A seleção final concentra os endpoints e módulos alterados.

## CI

- Frontend 4c12e12: https://github.com/portilhooooooooo/mascarenhas.github.io/actions/runs/40333071646 — PASSOU Chromium e Firefox,7 unitários e 4 cenários por browser, build e artefatos.
- Backend 22c6c85: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40333078996 — PASSOU.
- Backend 1bfc48f: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40333556103 — PASSOU, incluindo papel service_role.

CI usa apenas fixture/banco descartável, sem deploy. Artefatos têm trace.zip, screenshots, metrics e JUnit conforme workflow.

## Falhas de desenvolvimento registradas

1. Baseline AS01 reproduziu ausência de recuperação.
2. Primeiro teste de RetryAfter não lia cabeçalho CORS; corrigidos expose_headers real e fixture, adicionado fallback 429 mínimo 1 s.
3. SQL concatenado sem terminador falhou no stage; corrigido antes de qualquer promoção.
4. Primeiro lookup preservou números mas perdeu desempenho; EXPLAIN motivou gate interno.
5. Uma primeira abertura Chromium não mostrou resumo; repetição isolada/Firefox passaram. Lease era mantida até cancelamento assíncrono terminar; cleanup passou a liberar sincronamente e validar visibilidade/chave. Novo AS03 e bateria final passaram. Não alegar causa exclusiva comprovada por um único timeout.
