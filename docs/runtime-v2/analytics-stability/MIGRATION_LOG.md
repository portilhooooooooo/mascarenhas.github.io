# Registro da migração analítica —26/10/2026

Esta é uma candidata posterior à Runtime V2 publicada. Não altera o registro de deploy anterior.

- Confirmadas versões: FE público/main 25d654c; BE vivo e113eed/imagem ac23cc157170; BE main bc139ff. Re-fetch final manteve esses heads de main.
- Investigados código efetivo, erros ReadTimeout/57014, admissão e 30 min de tráfego observado.
- SPEC criada antes das alterações; baseline 429 reproduzida em Chromium.
- FE 4c12e12b6eb87641855f6fe99572e1b26fcae1e2: scheduler opt-in, RetryAfter, abort/escopo, blocos independentes, teste CORS e reentradas.
- BE 22c6c8568068cbfe7ead4262f96447861c4a109c: RPC análises, Base Geral indexada, flags, sem retry empilhado nos leitores alterados, testes e referências congeladas.
- BE 1bfc48f1bee340514be8f461ed2730ea4d85d8fe: bootstrap/service_role e benchmark parametrizado.
- Paridade: 576 comparações; 35 testes finais backend aprovados, 7 unitários FE, 12 cenários Chromium e 4 Firefox aprovados.
- Benchmark: 84 mil no total/n=20 concluído: P50 1306->1043 ms; P95 2425->1510 ms, stage.
- CIs das duas branches concluídos com sucesso. Jobs de deploy não existem nesses workflows.
- Documentação/evidências acrescentadas em commit posterior; código dos commits acima permanece o testado.

Branches: fix/analytics-stability-20261026 e migration/analytics-stability-20261026. Nenhum merge em main, deploy, login do agente ou DDL de produção desta candidata.

## Revisão posterior

FE cbba140 e BE 7041476 corrigem cinco achados. Ver REVIEW.md para testes, CIs e o gate geral de segurança com duas falhas legadas de aliases. Nenhum deploy.
