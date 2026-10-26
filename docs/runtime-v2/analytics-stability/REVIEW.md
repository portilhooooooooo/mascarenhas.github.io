# Revisão técnica da candidata analítica

Data: 26/10/2026. Escopo: PR frontend #37 e backend #39. **Revisão concluída com correções; NO-GO para promoção.**

Não houve merge, login do agente, migração SQL ou deploy de produção. Os PRs continuam em rascunho. Os dois PRs estão sem conflito de merge contra as bases investigadas; isso não equivale a autorização de publicação.

## Commits revisados e correções

A revisão partiu de FE 6d4186d e BE a7b95aa. Código corrigido e testado:
- Frontend: cbba140e603797039579122c2f0ef8ccfd8f7461.
- Backend (código da candidata): 704147651e03b34f5068c374ab24032ad5eda860.
- Reconciliação do contrato Nubank nos testes: a67932318665697fc9a6a68a18aa65cd046d7a8d.

Commits posteriores de relatório não alteram esse código. Foram revisados scheduler, cancelamento, estados parciais, chamadas API, decorators/escopo, tratamento HTTP, novas funções SQL, índices existentes, flags e rollback. Não foi executada uma nova auditoria exaustiva do repositório.

| ID | Prioridade | Achado | Correção e prova |
|---|---|---|---|
| RV01 | P1 | Um refresh apagava análises válidas da mesma chave quando o resumo ainda não tinha sucesso | Removida limpeza global dependente de loadedKey; cada bloco mantém seu gate por chave. AS05 falhou antes e passou depois |
| RV02 | P1 | Release do slot bombeava a próxima leitura antes de registrar cooldown 429, inclusive quando o chamador encerrava seu orçamento | Cooldown registrado antes de release, mesmo sem nova tentativa do chamador. O oitavo teste unitário falhou antes e passou depois |
| RV03 | P1 | O except genérico de análises convertia a recusa SQL P0501 em 503 | APIError P0501 chega ao handler existente: 429, ANALYTICS_BUSY e Retry-After=1. Teste Flask falhou com 503 antes e passou com 429 depois; SQL real recusou com quatro slots ocupados e voltou após liberar um |
| RV04 | P2 | Aging Regular e posição do modal Benner ainda dependiam do sucesso do resumo | Carteira autorizada passada explicitamente ao aging/Meta; modal usa a chave do próprio Benner. AS06 reproduziu a ausência de aging antes; depois validou aging e posição 30 no modal com resumo 503 |
| RV05 | P2 | enabled:false parava polling da Visão Geral, mas não cancelava uma leitura já iniciada/enfileirada | Cleanup cancela a query exata ao ocultar/trocar contexto. AS07 comprovou ausência de abort antes e cancelamento depois |

As fixtures 23, 30 e demais valores acima são sintéticas. Não são números da operação real.

## Validação executada

- Unitários frontend: **8 passaram**; limites de concorrência, prioridades, cancelamento, Retry-After, erros sem retry, orçamento de tentativas, resposta obsoleta e cooldown coordenado.
- Chromium local no commit cbba140: **9 cenários passaram** — A02, A05-Entradas e AS01–AS07. Sem erros de console. A05-Entradas manteve resultado da mesma chave por 15 s e mudou filtro com outros 15 s de latência controlada.
- CI frontend: **8 unitários e 7 cenários em Chromium e Firefox passaram**, com build e artefatos.
- API local relacionada: 23 casos passaram na primeira bateria; o teste novo já retornava 429, mas verificava CORS fora de /api. Corrigida a rota da fixture para /api; esse caso passou individualmente. O CI executou a versão final da bateria completa.
- SQL local: recusa P0501 com quatro transações ocupadas, seguida de sucesso após liberação, passou. Banco descartável.
- CI backend analytics: **37 passaram, 1 ignorado**, em 6,69 s. O ignorado é o benchmark opt-in já executado na etapa anterior.
- SQL de agregação não mudou nesta revisão: mantêm-se as 576 comparações anteriores e seus limites de cobertura. Não foi repetido benchmark sem alteração de consulta.
- Gate de processos/encerramentos do PR: **passou**.
- Gate geral de segurança do PR: **passou** após reconciliar duas expectativas legadas de alias com o contrato canônico já vigente. Localmente, o conjunto exato fechou com **133 testes e 46 subtestes aprovados**.

Os ensaios de reprodução anteriores às correções usavam fixtures novas sobre o build/código da candidata anterior. Não foram apresentados como testes aprovados dos commits novos. Logs e métricas anteriores e finais estão em evidence/review; traces completos finais são artefatos do CI.

## Gate geral: aliases Nubank reconciliados

A implementação já canonicalizava `Nubank`, `NUBANK_BASE_ATIVA_*` e `nubank_mba` como `nubank_mba` desde o commit 7f95326 de 15/10/2026. Duas expectativas criadas antes dessa mudança ainda exigiam o identificador legado `nubank`.

O commit a679323 atualizou somente o contrato de teste: as duas expectativas agora apontam para `nubank_mba` e foi acrescentada cobertura explícita para `NUBANK_MBA`. Não houve alteração em autorização, escopo, aliases do runtime ou dados. O arquivo isolado passou com **24 testes**; o gate completo passou localmente com **133 testes e 46 subtestes** e também passou no GitHub Actions.

A execução anterior 40335900360 permanece registrada como evidência da falha. A execução 40338384417 demonstra a reconciliação. A falha legada do guard Benner descrita no diagnóstico anterior permanece separada e não foi repetida, pois não houve mudança relacionada.

## CIs e artefatos

- Frontend cbba140: https://github.com/portilhooooooooo/mascarenhas.github.io/actions/runs/40335887476 — PASSOU, Chromium e Firefox.
- Backend 7041476, analytics: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40335892928 — PASSOU.
- Backend 7041476, processos/encerramentos: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40335899594 — PASSOU.
- Backend 7041476, segurança geral anterior: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40335900360 — FALHOU nos dois aliases legados.
- Backend a679323, analytics: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40338373148 — PASSOU.
- Backend a679323, processos/encerramentos: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40338384646 — PASSOU.
- Backend a679323, segurança geral: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40338384417 — PASSOU.
- PR frontend: https://github.com/portilhooooooooo/mascarenhas.github.io/pull/37.
- PR backend: https://github.com/portilhooooooooo/mba-backoffice-backend/pull/39.

## Riscos e trabalho ainda aberto

A revisão não certifica latência HTTP produtiva, exportações reais, paridade de toda a população ou carga multiusuário. Não houve novo teste de autenticação real. Aging mantém o custo de paginação/lotes e a origem exata dos timeouts de transporte continua aberta.

Benner e aging mensais ainda usam a chave composta do painel; mudanças de filtro podem causar leituras equivalentes desses blocos. Isso já existia no desenho anterior e não foi reestruturado nesta revisão; deve entrar na otimização do aging com invalidação por revisão/mês comprovada. O scheduler limita a rajada, mas não elimina esse custo.

Os testes verificam preservação do conteúdo e altura dos KPIs; não certificam CLS global. Banners de erro e notas de estado podem alterar a posição vertical do conteúdo. A revisão não introduz redesign para resolver esse ponto.

## Parecer

Os cinco achados da candidata foram corrigidos e têm cobertura direcionada. A candidata pode seguir para revisão humana e validação integrada em ambiente autorizado.

**NO-GO para merge que dispare publicação ou promoção produtiva:** validação HTTP autenticada das novas RPCs e gates de promoção descritos em ROLLBACK.md ainda pendentes. Flags novas seguem desligadas por padrão; a aplicação produtiva não foi alterada.
