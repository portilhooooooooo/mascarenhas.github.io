# Revisão de release — Runtime V2
Parecer: **NO-GO para produção; pacote de revisão disponível.** Nenhum deploy, parada ou DDL de produção executado.

## Artefatos rastreáveis
- Frontend de trabalho: dev/tasks-workspace; candidato isolado: release/runtime-v2-20261024. Código da aplicação: 99ec81d.
- Backend: migration/runtime-v2-reconciled-20261024; referência efetiva: reference/runtime-v2-effective-20261024/01fe904. Código da aplicação: 40d77ab.
- Imagem candidata e rebuild: sha256:528d196b02881621ca41f692ef36532f69a44dd23f88d53b3a1dd8334bfd222f.
- Nove migrações SQL no candidato; nenhuma aplicada em produção.
- CIs do código aprovados: backend run 40246991661; frontend run 40247238570. Commits posteriores apenas de testes/evidência/documentação não são novos resultados de CI.
- Instruções locais: RUN_LOCAL.md; recuperação: WRITE-RECOVERY.md; rollback: ROLLBACK.md. Evidências com hashes nos manifestos.

## Validação concluída
Navegação/estado/cache/autenticação transitória em browser fixture; gravações e escopo no HTTP/PostgREST/PostgreSQL isolado; paridade de Produtividade na amostra real desidentificada; carga controlada de 30 colaboradores e 10 analytics; 90 gravações confirmadas; build reproduzível e rollback final de nove etapas.
As quantidades e limitações por rodada estão em TEST-MATRIX.md/BASELINE.md. Não somar retestes repetidos como casos novos.

## Gates que permanecem abertos
| Gate | Evidência que falta | Condição para avançar |
|---|---|---|
| Identidade real | Login Microsoft e jornadas com conta autorizada no acesso permitido | Colaborador autorizado valida o candidato pelo launcher .bat/local.portilhobackoffice.site; o agente não possui conta e não deve fabricar sessão. Login já informado como funcional no publicado não certifica sozinho a candidata. |
| Operação integral | Demais comandos, workers/efeitos externos e conciliação real de resultado incerto | Exercitar os fluxos ainda não certificados em ambiente autorizado, com proteção de tráfego; não repetir carga sintética que já passou. |
| Indicadores integrais | Demais indicadores/exportações e amostra representativa de Nubank | Comparar amostras estratificadas autorizadas, sem alterar critérios ou tratar a pequena amostra atual como representativa. |
| Infraestrutura real | Correlação cliente/API/fila/transporte/SQL e pool efetivo | Observabilidade em requisições autorizadas; não atribuir a causa original a Supabase/VPS/índices sem prova. |
| Contratos históricos | Quatro expectativas de testes incompatíveis com o baseline | Registrar disposição na revisão; a migração preservou os quatro resultados. Alterar a regra de produto exige decisão explícita separada. |
| Promoção/M6 | Gate técnico aprovado e monitoramento publicado | Só promover commit/build rastreável após fechar os gates; medir por pelo menos duas horas e separar revogação intencional de erro de infraestrutura. |

## Sequência de promoção preparada, não executada
1. Revisar o diff do frontend contra f0851b3 e o backend contra a referência efetiva 01fe904. Não levar toda a branch dev nem supor que um merge cego em main representa o runtime capturado.
2. Conferir versão de dados/dependências e janela operacional; inventariar/conciliar recibos processing/uncertain sem apagá-los.
3. Com gate aprovado, aplicar as migrações aditivas e publicar a imagem rastreável do backend, com flags compatíveis e capacidade operacional reservada.
4. Publicar o frontend isolado, preservando contratos; nunca usar publicação Cloudflare de testes para suprir a ausência do acesso local autorizado.
5. Medir auth, gravações, reentrada, KPI e erros na janela real. Usar os critérios de rollback documentados se houver regressão.
A preparação acima não é ordem para realizar deploy. O estado publicado continua inalterado.

## O que permite destravar agora
É necessário acesso autenticado legítimo ao candidato pelo fluxo permitido, ou execução acompanhada pelo próprio colaborador autorizado. Não há credenciais de plataforma disponíveis para o agente. Nenhum token/senha deve ser incorporado a fixture, relatório ou cache de diagnóstico. Esse bloqueio não se resolve criando mais testes sintéticos.
