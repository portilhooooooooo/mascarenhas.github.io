# Registro da migração
## Escopo e versões
Frontend de desenvolvimento: dev/tasks-workspace. Candidato de promoção: release/runtime-v2-20261024, baseado em f0851b3. No navegador publicado, scripts /auth.js, /data-api.js e /assets/react-dashboard/dashboard-react.js mostraram ?v=f0851b3 em 25/10/2026 UTC. O candidato preserva diferenças funcionais da main; não promove o desenvolvimento inteiro.

Backend reconciliado: migration/runtime-v2-reconciled-20261024. A main e o rótulo da imagem divergiam do código ativo; foi criada a referência privada reference/runtime-v2-effective-20261024. Checkout de produção não foi limpo, alterado ou usado como fonte do build.

## Marcos realizados
- M0: inventário de código efetivo, manifesto de hashes, referências das funções e fixtures Chromium. Baseline histórico é separado do baseline f0851b3.
- M1: eliminação da mutação de tasks.view; cópias imutáveis, estados tipados de autenticação, stale 401, PKCE/coordenação de handoff, sessão única e motivo de revogação preservados.
- M2: keep-alive seletivo, sincronização de subaba apenas em Tarefas, geometria estável e pausa de módulos ocultos.
- M3: TanStack Query por escopo, TTL, deduplicação, resumo numérico autorizado, restauração de filtros e rascunhos. Rascunho v1 migra somente por renderer autorizado; não é descartado no primeiro perfil.
- M4: resumos/detalhes/exportação SQL de Produtividade, medianas compatíveis, requests correlacionados, admissão HTTP e transacional, análises finais com recibo durável, Encerramentos com respostas independentes.
- M5: testes SQL, HTTP real em rede interna, Chromium/Firefox, regressão operacional, build e rollback em ensaio. A matriz explicita lacunas. Ainda não é um gate completo de promoção.
- M6: NÃO EXECUTADO. Nenhum deploy/parada/DDL de produção; monitoramento de duas horas após promoção não ocorreu.

## Regressões e correções encontradas
- Resposta velha de bootstrap podia invalidar a sessão nova: guard de identidade na rejeição e na resolução.
- Realtime pausado reconectava indevidamente e usava variáveis inexistentes: sequência/controlador/escopo corretos e pausa testada.
- Epoch global de outro usuário não pode apagar rascunhos ou abortar a escrita corrente: versão efetiva de acesso separada do epoch.
- Arredondamento numeric aproximado divergia de Python: conversão IEEE-754 e casos de empate corrigidos; nenhuma mudança silenciosa de indicador.
- FK duplicada na fixture PostgREST causou PGRST201: somente as constraints descartáveis redundantes foram removidas.
- Testes operacionais antigos esperavam controles/atalhos retirados na main: ajustados ao comportamento efetivamente publicado, sem redesenho.
- Reload sob /me com atraso fixo podia validar cedo demais: fixture passou a usar barreira explícita de identidade.
- Firefox apresentou 10,299 s no orçamento de 10 s: reservados 500 ms dentro do mesmo fluxo para propagação de abort e estabilização. Retestes: Chromium 9,501 s; Firefox 9,502 s. Nenhuma tolerância foi relaxada.
- Interceptação Playwright desabilita o cache HTTP: benchmark quente separado com servidor HTTP e sem routing; suites de falha permanecem com interceptação.
- Builder Docker legado ignorou exclusão específica do Dockerfile e incluiu metadados: build agora usa git archive com allowlist e .dockerignore na raiz. Imagens iniciais foram rejeitadas; somente o build corrigido é candidato.

## Commits de referência
Frontend: dfad4c1 (rascunhos/telemetria), d5a44f4 (medição), 96edb86 (orçamento).
Backend: e74657b (SQL e recibos), bd32064 (corpus), 318e977/3ca2041 (empacotamento), 0eb988a (escopo seguro nos logs).
Referência de rollback: 01fe904. Ver git log para o histórico completo e a evidência por execução.

## Fechamento controlado de 25/10
- 30 casos Chromium e 30 Firefox PASSOU em a0a284d.
- Metadados completos de acesso: f8615e9/a0a284d; grants e critérios preservados.
- Falha local não induzida de resumo Regular/Admin em 7aadb17: 503 após 2.009 ms; 29 PASSOU/1 FALHOU. Reteste PASSOU; origem não comprovada. Instrumentação b528a39/289f9be registra classe, tentativa falha e upstream antes da entrega, sem aumentar timeout.
- Imagem congelada 289f9be reconstruída com digest idêntico 2be3050ce3c617937bfae1cd89d70ef191a3f9a141b8b6cd306d8a64aeec466a; 43 testes finais PASSOU.
- Benchmark final: mesma imagem, 90 salvamentos duráveis; P95 auth 3105,2→196,1 ms; escrita 3561,1→759,7 ms. Analytics: 12 respostas 200 e 18 recusas 429 na variante protegida.
- Ensaio interno de rollback atualizado: candidato→referência→candidato; auth/leitura 200, escrita 201, exatamente uma análise e um evento por operação.
- Revisão somente leitura dos 166 paths publicados: zero drift; container e main FE inalterados. Produção segue sem deploy e sem DDL da migração.

- dec1b42/bd64022: retry único compartilhado entre handoff e perfil; falha combinada testada em Chromium/Firefox, oito casos por navegador PASSOU. CI do candidato verde.
- Branch dev/tasks-workspace: 29 casos locais Chromium PASSOU antes do ajuste final de retry; builds/hardening passaram. O candidato de promoção mantém a main e suas diferenças funcionais.

- Ampliação A15: schema/triggers/helpers de Defesa capturados somente por leitura. Teste HTTP real com 10 chamadas concorrentes + replay confirmou uma análise e um evento, is_demo=false, carteira correta. Primeiro carregamento da fixture revelou dependência SQL ausente; a função efetiva foi incluída, sem alterar regra de negócio.
- Diagnóstico de borda: OPTIONS da API devolveu Cloudflare 403/1010 e a configuração browser_check está on. Nenhuma configuração de segurança foi alterada; a correlação com o erro genérico do navegador ainda não foi comprovada.

- 3d5ed8a: três cenários de Pagamentos v2 e replay concorrente passaram no HTTP/SQL; suite ampliada 22/22.
- 5579fd4: Liminares modernas (quatro decisões finais) e legadas (seis decisões), isolamento de evidência por carteira e replay; banco descartável novo reconstruído. Monitoramento externo não certificado.
- 50a3cde: auditoria somente leitura e runbook de conciliação/retenção; bloqueio de replay após perda de acesso testado. Suite ampliada 59/59 em 22,26 s. Sem mudança de código runtime da imagem 289f9be.

- 65a7e92: seis cenários de Pagamentos legado, contratos SQL efetivos e JUnit preservado no CI. Suite ampliada 65/65 em 25,25 s; CI remoto completo PASSOU.
- Regressão de domínio adicional encontrou sete falhas/97 testes e 90 subtests aprovados. Mesma seleção executada na referência 01fe904 reproduziu os sete casos e todos os resultados. Regras comparadas têm hashes idênticos. Falhas mantidas na evidência; nenhuma mudança de negócio para alinhá-las à main.
- Revisão de documentação: corrigida a limitação antiga que dizia XLSX não testado; células/formatação já haviam sido comparadas. Manifests atualizados após os relatórios, com verificação de todos os hashes.

- Retirada atribuição do erro isolado de início de OAuth a falha geral da plataforma: login normal confirmado pelo usuário. Sem conta autorizada do agente, integração autenticada não executada. Caminhos autorizados registrados na SPEC.
- A15 adicional: Encerramento diferido exercitado pelo HTTP/SQL real, seis chamadas e replay sem duplicação, preservando prazo e estado waiting.

- 8bcc99d: corrigida distribuição prematura de orçamento dos dois RPCs analíticos; reprodução HTTP/SQL antes falhou, depois passou. Limite total, auth e writes preservados. 68 testes passaram; carga/rollback/rebuild repetidos. c8ab5f3 preserva latência por caso e separa falhas de transporte; 28385ca permite somente os novos alvos internos explícitos no ensaio de rollback.

- Consulta somente leitura dos metadados reais de 25/10 13h57–14h57 CG: 19 respostas, sem 5xx observado nessa amostra; não é prova geral de disponibilidade. Auth sessão/OAuth tiveram sucesso. Seis mensagens com termos error/timeout seguem sem correlação. Nenhum login do agente, segredo ou documento coletado.
- CI 8bcc99d PASSOU. Variantes descartáveis obsoletas foram paradas após os ensaios para liberar recursos; imagens preservadas e container de produção inalterado.
