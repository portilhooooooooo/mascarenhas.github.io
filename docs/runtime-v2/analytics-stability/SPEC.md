# SPEC — Estabilização analítica Runtime V2
Data: 26/10/2026. Estado: diagnóstico e candidata isolada; não autorizado novo deploy de produção por esta especificação.

## Fontes verificadas
Frontend público 25d654c; backend vivo e113eed/imagem ac23cc157170, container 96c3507b...; origin/main FE 25d654c e BE bc139ff.
Branches: fix/analytics-stability-20261026 (frontend), migration/analytics-stability-20261026 (backend).
Worktrees: /home/ubuntu/analytics-stability-frontend e /home/ubuntu/analytics-stability-backend.
Não modificar checkout vivo nem presumir paridade de branches.

## Diagnóstico confirmado
Encerramentos dispara resumo, análises, Benner e aging simultaneamente; query client retry:false. API mantém admissão 2/worker, 2 workers x 4 threads.
Últimos 30 minutos de tráfego observado: análises 13 x 503, P50 6736,88 ms, P95 amostral 7358,32 ms, até 16 downstream. Base Geral summary 7 x 200 (P50 8288,84 ms), 4 x 503 (P50 9227,13 ms) e 1 x 429.
Aging: até 12 chamadas downstream; 5 sucessos, 3 recusas e 1 x 503. Populações pequenas e condições não controladas; não certificar P95 normal.
Logs confirmam ReadTimeout e cancelamento SQL 57014. Origem exata de pool/fila não inferida desses fatos.
Base Geral refaz normalização/deduplicação Benner/carteira e joins por request. Hashes efetivos em effective-base-geral.json.

## Contratos imutáveis
- Autorização antes da agregação; portfolio_id sempre derivado da sessão/servidor.
- Encerramentos: created_at da análise, início inclusivo/fim exclusivo no fuso America/Campo_Grande; ausência de processo/CNJ exclui registro.
- Origem do classificador: notes.classifier_classification truthy, senão source_metadata.classifier_classification. Não substituir por classificação humana.
- Tipo final: source_metadata.closing_final_classification truthy, senão notes.final_classification; NFKD/ascii/uppercase/espaços para underscore, somente tipos existentes.
- Acurácia: após filtro de tipo, ANTES de busca CNJ e filtro de concordância; avaliados=confirmados+divergentes, não avaliados separados; percentual None se denominador zero.
- Analisados/lista/agrupamento por colaborador usam filtros de concordância/busca. Não mudar esse comportamento para coincidir números.
- Base Geral: data/product/resolution/pasta e precedência exatas da função efetiva; cutoff de 18 meses calculado pelo backend; filtros opcionais, nulls e ordenação determinística preservados.
- Não apagar dados, mudar grants, medianas, aptidões ou política de sessão.
- Sem login do agente, carga ou gravações sintéticas em produção.

## Solução proposta, sujeita a evidência
1. Scheduler somente para leituras analíticas opt-in, concorrência limitada (sem afetar auth/write), prioridade de resumo, abort de fila obsoleta e orçamento de retry único. Transportar Retry-After; retry elegível limitado, backoff com jitter. 401/403/erros de identidade/validação não repetem.
2. Uma RPC SQL para análises com resumo e detalhe paginado, eliminando fetch-all e joins em Python. Ordem created_at desc,id desc para empates. Caminho anterior preservado por flag; paridade testada contra referência congelada.
3. Base Geral: avaliar plano no stage, fonte canônica normalizada com refresh/invalidação rastreável ou alternativa equivalente; não ativar projeção silenciosamente stale. Decisão final depende do plano e comparação.
4. Auditar aging/Benner sem alterar coorte/semântica; reduzir duplicação comprovada. Não desativar admissão nem ampliar timeouts indiscriminadamente.

## Evidência exigida
Browser: 429 uma vez e Retry-After seguido de sucesso; 503 elegível; sem retry 401/403; resumo independente; filtro/carteira/aborto; geometria preservada; reentrada fresca sem chamada.
SQL/API: igualdade de contagens/acurácia/rows/total/analistas por filtros, bordas/JSON inválido/classificador ausente/duplicatas/empates/fuso/duas carteiras; ACL backend-only; paginação/exportação.
Base Geral: plano EXPLAIN ANALYZE BUFFERS no banco descartável; matriz de filtros/precedência/nulls/cutoff e atualização da projeção; carga sintética somente stage.
Registrar P50/P95 com n/status/ambiente por endpoint. Uma bateria final relacionada, sem retestes amplos não justificados.

## Rollback
Flags independentes e caminhos anteriores mantidos; candidata não toca produção. Novos objetos SQL aditivos e restritos ao backend. Projeção não pode ser declarada atual sem contrato de atualização/versão. Não tocar recibos de gravação. GO somente após paridade, browser e SQL executados; caso contrário NO-GO com limites explícitos.

## Registro
baseline-production.json é observacional, sem bearer/query strings/documentos. Referências SQL têm apenas código e hashes. Novos commits e resultados serão acrescentados em MIGRATION_LOG.md.
