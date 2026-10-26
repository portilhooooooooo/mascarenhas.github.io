# Registro da migração

## Incorporação na main solicitada
Código integrado conforme MAIN_INTEGRATION.md, preservando alterações pré-existentes da main. O frontend negocia suporte a idempotência para permanecer compatível com o backend publicado anterior. Testes e limites da conciliação estão nesse documento. Isso não equivale a deploy manual do backend nem validação autenticada real.


## Revisão final do candidato — 25/10/2026, Campo Grande
**Parecer global: NO-GO para produção.** Build e rollback específicos da última imagem foram agora concluídos; o limite restante não é uma nova bateria de testes sintéticos. Aplicação backend 40d77ab; frontend 99ec81d; imagem sha256:528d196b02881621ca41f692ef36532f69a44dd23f88d53b3a1dd8334bfd222f.

- Rebuild do MESMO commit produziu exatamente o mesmo digest.
- Ensaio final candidata → referência efetiva 01fe904 → candidata passou em nove etapas: três gravações de Encerramentos, três uploads e três comandos de pular. Contagens/eventos únicos conferidos; replay de skip também conferido na candidata antes/depois. O código antigo continua tendo a limitação de replay já documentada; não foi declarado idempotente.
- Quatro verificações focadas compararam os contratos contestados com código capturado, preservado e conferido por hash também nos arquivos do container publicado. Todas passaram em 0,38 s. Defesa e Liminar continuam com arquivos idênticos à referência; a criação genérica mantém o mesmo resultado antes/depois.
- As quatro expectativas históricas que falham NÃO foram modificadas, apagadas, puladas ou marcadas como PASSOU. A nova evidência mostra que são divergências com o baseline preservado, não mudanças introduzidas pela migração. Qualquer alteração dessas regras é decisão de produto separada.
- Nenhum novo teste de carga ou rodada ampla foi realizado. Não houve autenticação do agente nem alteração de produção.

| Caso contestado | Comportamento efetivo preservado |
|---|---|
| Criação genérica sem responsável | A tarefa pode ser criada sem atribuição; o caminho vinculado por Processos continua exigindo responsável. O teste de paridade valida a criação genérica, não certifica todo o fluxo de importação. |
| Fatal de tribunal em 07/10 versus Enter em 05/10 | Guardrail vigente de cinco dias úteis conserva a data operacional de 05/10, mantendo a data do tribunal na evidência. |
| Audiência em 11/10, sem fatal manual | Regra vigente deriva 10/10, um dia antes da audiência. |
| Liminar com evidência inicial insuficiente | Concordância automática é recusada; respostas humanas completas permitem classificar sem_decisao e monitorar. |

A referência de fonte é 01fe904, não a suposição de que main seja o runtime. Conferir arquivos no container é evidência de fonte em disco, não inspeção de cada objeto Python já carregado. Os testes usam somente dados sintéticos. A comparação de paridade não dá aprovação para mudar regras nem encerra a revisão das expectativas históricas.

**Dependências para ir até produção:** validação autenticada legítima pelo launcher .bat/local.portilhobackoffice.site ou main; cobertura operacional e indicadores ainda não certificados; correlação real dos timeouts/pool; revisão técnica/promoção e monitoramento de duas horas. O agente não dispõe de conta autorizada e não contornou o login. Não há trabalho em background prometido para suprir essas dependências.

Evidências: contract-baseline.log/xml, release-review-execution.json, skip-final-rebuild.log e final-rollback.json no manifesto privado. O documento RELEASE_REVIEW.md organiza os gates restantes e o procedimento de promoção. Os checkpoints antigos abaixo ficam como histórico e não substituem este estado atual.


## Fechamento do escopo implementado — 25/10/2026, Campo Grande
**Migração ainda NO-GO para promoção.** Implementação deste checkpoint encerrada, sem abrir novas frentes de desenvolvimento ou repetir testes amplos. Aplicação backend: 40d77ab; frontend release: 99ec81d; dev: ceb55c3. Casos adicionais já executados foram commitados em 1fbd5ad. Produção não foi alterada.

### Última correção concluída: Pular processo
Duas reproduções controladas no caminho anterior falharam: repetir a mesma operação gerou dois eventos e dois movimentos de fila; falhar no evento deixou a fila movida mesmo com resposta de erro. A nova operação runtime_v2_skip_process usa a função de fila efetiva e grava o evento na mesma transação. Recibos duráveis protegem repetição/conexão perdida; uma ação intencional nova continua permitida. O status 409/TASK_ARCHIVED foi preservado.

Frontend guarda apenas o identificador/checksum da intenção, isolado por usuário/carteira. client_action_at é telemetria, não muda a identidade da operação ao reenviar após F5. Nenhum payload operacional, token ou resposta passou a ser persistido por essa mudança. O backend continua autoritativo para autorização antes do replay.

**Nona migração, stage somente:** 20261025235800_runtime_v2_atomic_skip.sql. Flag RUNTIME_V2_SKIP_ATOMIC=1 somente nas instâncias descartáveis; função e RPC anterior sem EXECUTE para anon/authenticated, como confirmado por metadata somente leitura. Nenhum DDL publicado foi executado.

### Verificações necessárias e seus resultados
- **Quatro testes de upload PASSOU:** ACK perdido com consulta autoritativa e reenvio 409 sem duplicação; seis envios simultâneos com uma aceitação; rollback integral seguido de reenvio explícito; perfil revogado durante a espera sem importação. Integridade de contagens, classificação e atribuição conferida em PostgreSQL.
- **Onze casos de skip PASSOU em 5,54 s:** replay sem repetir evento/fila, rollback do evento, concorrência, ACK perdido, nova intenção legítima, negações por carteira/atribuição/arquivamento/revogação e duas negações de RPC de browser.
- Browser: A15-skip-intent e A15-write-intent PASSOU em Chromium e Firefox na release e Chromium na dev; sem erros JS/console. Comandos simultâneos foram deduplicados; F5 não enviou comando e reenvio com outro timestamp manteve o mesmo identificador. Respostas de browser são fixtures; provas de escrita estão nos testes HTTP/SQL separados.
- CI do código backend 40d77ab: PASSOU (run 40246991661). CI frontend 99ec81d: PASSOU (run 40247238570). A suíte completa do CI do código foi executada; os nove casos adicionados depois foram executados localmente dentro do grupo de onze, sem nova rodada ampla.
- Uma seleção local com palavra skip também correspondeu ao marcador skipif do módulo e executou a suíte HTTP inteira: 122 PASSOU e uma falha de fixture. O teste usava nomes de colunas incorretos para revogação; foi corrigido para revoked_at/revocation_reason reais. O grupo afetado de onze passou depois. **Não se apresenta essa execução como uma suíte única com 123 PASSOU.** Os logs da falha ficam preservados.
- Houve ainda um erro de sintaxe na nova fixture de upload, corrigido antes da execução, e tentativa prematura de criar imagem antes do fim do build, retornando 404 somente no harness. Não foram falhas de produção.
- Build disponível: sha256:528d196b02881621ca41f692ef36532f69a44dd23f88d53b3a1dd8334bfd222f, fonte 40d77ab. Rebuild/rollback anteriores pertencem à imagem de Encerramentos. O ensaio específico de reprodutibilidade/rollback dessa imagem final de skip NÃO foi repetido; continua como gate, sem herdar indevidamente a validação anterior.

### Pendências remanescentes, sem expansão do escopo
1. Quatro divergências entre testes de domínio e comportamento efetivo: criação genérica sem responsável; dois contratos de prazo de Defesa; concordância automática em Liminar sem evidência suficiente. Permanecem registradas; regras e asserts não foram alterados para forçar verde.
2. A15 integral: demais comandos operacionais, workers/integrações externas e conciliação real de escrita incerta. Upload e skip acima cobrem os cenários enumerados, não todos os fluxos.
3. A16 integral: paridade dos demais indicadores/exportações e representatividade de Nubank.
4. B03 real: correlação dos timeouts, fila/transporte/SQL e configuração efetiva de pool, ainda sem causa original comprovada.
5. Validação autenticada legítima via .bat/local.portilhobackoffice.site ou main Cloudflare. O agente não tem conta autorizada e não fabricou login.
6. Gate final da imagem/rollback, promoção rastreável e duas horas de monitoramento após liberação. Sem deploy ou parada de produção nesta fase.

Para evitar novas rodadas sem necessidade, commits de evidência/documentação e o commit exclusivamente de testes já executados usam [skip ci]. Isso não transforma o HEAD documental em um novo resultado de CI: os commits de aplicação efetivamente aprovados são os identificados acima. O frontend visual permanece preservado. Não existe aprovação técnica GO implícita neste fechamento.


## Checkpoint adicional — atomicidade de Encerramentos, 25/10/2026
**Parecer atual: NO-GO.** Nova candidata de aplicação 14503a1, SQL/testes 581b8e1. Este checkpoint passa a registrar quatro falhas de domínio restantes; os números anteriores abaixo são históricos. Os CIs finais do checkpoint anterior (release 69fb5ea, backend 9a9f5fc) concluíram com sucesso.

### Defeito reproduzido e correção
A gravação de Encerramentos tinha fronteiras de transação separadas. Com payload V5 válido e falha SQL controlada:
- erro ao inserir evento de adiamento: análise persistida, status alterado, evento ausente;
- erro ao atualizar metadados de adiamento: análise persistida, status anterior, evento ausente;
- erro ao atualizar metadados de conclusão: análise persistida, status concluído e evento já persistido, metadados ausentes.
A falha no evento de conclusão já fazia rollback pela RPC antiga: o quarto cenário era e continua correto.

A função nova runtime_v2_save_closing reúne essas etapas na mesma transação e bloqueia a linha do processo. Na conclusão, chama a auth_save_analysis efetiva, preservando seus checks/regras; no adiamento, preserva as mesmas condições da rota atual. Carteira é vinculada pelo proxy de escopo e conferida em SQL. EXECUTE segue restrito ao backend. Metadados alheios são preservados, e raiz inválida recebe a mesma normalização do legado. **Não mudaram classificações, prazo de 60 dias, perfis ou grants.**

Implementação atrás de RUNTIME_V2_CLOSING_ATOMIC=1, habilitada somente no stage. Oitava migração: 20261025233600_runtime_v2_atomic_closing_save.sql. Não houve aplicação SQL ou deploy de produção. Recibo pode permanecer uncertain após erro de transporte: não se presume rollback só porque houve 503 e não se habilita retry cego.

### Evidência executada
- Suíte HTTP/runtime/orçamento: **126 PASSOU em 46,35 s**. Mais cinco casos de segurança SQL PASSOU; mais três casos de metadados inválidos PASSOU (junto de 18 casos de escopo repetidos). Total de **134 casos distintos aprovados**, sem somar retestes duplicados.
- Casos focados: 25 PASSOU, incluindo quatro falhas transacionais, matriz de 18 combinações papel/carteira × conclusão/adiamento, replay e duas negações de RPC para browser. Nas falhas, análise/status/metadados/evento voltam integralmente ao estado anterior.
- Cinco negações SQL: carteira divergente, ator não atribuído, perfil bloqueado e campos inesperados em valores/metadados; nenhuma gravação.
- Regressão ampliada: **100 testes e 90 subtests PASSOU; quatro FALHOU**. Um teste de adiamento não chegava aos asserts porque mockava closing_projection ausente no runtime. Apenas esse mock foi retirado; todos os asserts originais passaram. Permanecem criação genérica sem responsável, dois contratos de prazos de Defesa e concordância automática em Liminar sem evidência suficiente. Nenhum assert foi afrouxado para ocultar essas divergências.
- Chromium e Firefox: A13 e A15-write-intent PASSOU, sem erro JS/console. Respostas são fixtures de browser; integração HTTP/SQL é a prova separada descrita acima.
- Build da imagem 14503a1 reproduzido: sha256:c7109322a6fe84ca6ef8b722feb25ddc9f808db936d89f54d47add6e63d19afd. A versão SQL 581b8e1 é identificada separadamente por hash. Banco vazio reconstruído com essa versão.
- Rollback candidata → referência efetiva 01fe904 → candidata: leitura/auth 200, gravação/importação 201 e contagens únicas. Migrações aditivas mantidas no ensaio.

A primeira fixture de adiamento misturava campos de versões e retornou 400. Foi corrigida antes de usar os resultados como evidência: os arquivos before-valid/valid-after contêm o payload válido. Os resultados iniciais inválidos foram preservados e explicitamente separados em closing-atomic-execution.json. Não são reprodução do defeito.

### Carga na nova imagem, stage somente
Três rodadas com 30 colaboradores sintéticos + 10 analytics, SQL atrasado 1,5 s. A mesma imagem atômica foi usada nas variantes com/sem admissão. Portanto a comparação abaixo mede admissão, não o efeito isolado de atomicidade.

| Fluxo | n antes/depois | Mediana antes/depois (ms) | P95 antes/depois (ms) |
|---|---:|---:|---:|
| Validação de sessão | 45 / 45 | 1694,2 / 95,3 | 3104,5 / 226,2 |
| Gravação final | 45 / 45 | 2021,1 / 417,1 | 3441,9 / 619,0 |
| Analytics com sucesso | 30 / 12 | 1670,5 / 1581,8 | 4614,3 / 1590,9 |

Novamente 90/90 gravações confirmadas. Analytics: 12 respostas 200 + 18 respostas 429 na candidata; rejeições não contam na distribuição de sucesso. Não houve carga em produção.

A15 integral, A16 integral, correlação real/pool de B03, validação autenticada legítima e M6 com monitoramento permanecem pendentes. A migração não está concluída nem promovida. Evidências privadas em evidence/final-controlled/closing-atomic-* e screenshots/metrics públicos em evidence/closing-atomic-chromium e evidence/closing-atomic-firefox.


## Checkpoint de 25/10/2026 — importação atômica e criação por Processos

**Parecer atual: NO-GO para promoção.** Este checkpoint substitui os totais anteriores, preservados abaixo como histórico. Fonte candidata: backend 25bb6c1; testes adicionais ce9a4ce. Frontend: release ce569da e dev 4324990, sem nova mudança de layout/aplicação neste checkpoint.

### Correções e provas executadas

- **Importação de Encerramentos (634d862):** o Python criava upload/processos via RPC e só depois aplicava as classificações por PATCH. Uma falha controlada nesse PATCH devolveu 503, mas deixou um upload e três processos sem classificação. A função SQL já publicada aceita a classificação na mesma transação. A candidata passou a enviá-la nessa chamada, preservando parser, filtros, distribuição e critérios. Nenhum DDL de produção foi necessário ou aplicado.
- CSV e XLSX: três linhas válidas e duas rejeitadas, classificações e responsáveis exatos, um upload/evento; repetição devolve 409 e não duplica. Falha SQL interna desfaz upload/processos/eventos. Perfil, responsável e carteira indevidos são rejeitados; RPCs continuam exclusivos do backend, sem EXECUTE para anon/authenticated.
- **Criação pelo módulo Processos (25bb6c1):** o formulário ativo envia process_cnj; a referência capturada rejeitou o contrato com 422. Foi reconciliado apenas esse caminho já existente em main, usando processos_create_task já publicado. Validação de CNJ, carteira, responsável e permissão precede a transação; não foram importadas as demais mudanças de política de criação/atribuição de main.
- **22 casos do fluxo Processos PASSOU:** nove combinações de Liminar/Defesa/Encerramento × Enter/Regular/Nubank, onze rejeições/falhas transacionais e duas negações de RPC direto. O diretório do stage é uma projeção sintética mínima de existência: não certifica sincronização ou indicadores de Processos.
- **Suíte HTTP/runtime/orçamento: 102 PASSOU em 51,57 s.** Gunicorn → cliente Supabase → PostgREST → PostgreSQL reais dentro do stage, com identidades sintéticas. O teste sem opt-in falha antes de executar o corpo; alvos HTTP e banco são limitados ao ambiente descartável.
- **Regressão ampliada: 99 testes e 90 subtests PASSOU; cinco FALHOU.** As duas falhas de importação CSV/XLSX anteriores foram corrigidas. Os demais resultados ficaram idênticos, inclusive após a correção de Processos. Restam: referência de teste a closing_projection ausente; criação genérica sem responsável; dois contratos de prazos de Defesa; concordância automática em Liminar sem evidência suficiente. Não se alterou regra de negócio para tornar esses testes verdes.
- Imagem de 25bb6c1 reconstruída com o mesmo digest **sha256:726fbb1591fe505f8c8ae41c61151f4e65e98f35b0c4ed95978b55cfee7f05c9**. Candidata → referência efetiva 01fe904 → candidata: auth/leitura 200 e gravação 201, uma análise/evento; importação de arquivo também 201, duas classificações corretas e um evento em cada variante. O rollback restaura o comportamento anterior, inclusive limitações conhecidas; não certifica que a referência aceite process_cnj.

### Nova carga controlada na imagem 634d862

Três rodadas, 30 colaboradores sintéticos + 10 aberturas de analytics por rodada, SQL atrasado 1,5 s, Gunicorn 2 × 4. Variantes da mesma imagem com/sem admissão. Resultados de 25/10 às 22h44 UTC, sem tráfego em produção:

| Fluxo | n por variante | Mediana antes/depois (ms) | P95 antes/depois (ms) |
|---|---:|---:|---:|
| Validação de sessão | 45 | 3031,8 / 79,5 | 3135,2 / 118,5 |
| Gravação final | 45 | 2193,0 / 425,3 | 3508,4 / 680,3 |
| Analytics com sucesso | 30 / 12 | 1659,2 / 1575,9 | 4636,7 / 1590,1 |

Houve 18 respostas 429 de admissão na candidata e 12 respostas 200; os 429 não foram misturados à distribuição de sucesso. Todas as 90 gravações finais esperadas foram encontradas no banco. Esses números são do stage e da imagem 634d862; não foram atribuídos à imagem posterior 25bb6c1 nem ao runtime publicado. Não houve teste de carga de produção.

### Browser, CI e limites

O inventário com Playwright confirmou que um modal React antigo não é alcançável pelo fluxo atual. Não se redesenhou a interface com base nesse código morto. Screenshot/inventory.json em evidence/upload-controls registram o estado real do build com identidade fixture; não são certificação de upload concluído pela UI.

Uma rodada histórica do Firefox (run 40224116675, fonte 121a6e0) fechou página/contexto inesperadamente após A15-write-intent. A causa continua aberta. Acrescentaram-se eventos de crash/close/disconnect e DEBUG=pw:browser no CI, sem retries ou afrouxamento de asserts. A injeção explícita de fechamento prova a captura do erro, não reproduz a causa histórica. A15-write-intent e A11-handoff-same-user passaram em Firefox nas duas branches. CIs de ce569da (40241489835), dev 4324990 (40241491634) e backend 25bb6c1 (40242549216) passaram.

**Pendências de promoção:** cinco falhas de domínio precisam de resolução contratual; A15 integral (todos os writes, retomada de upload e workers); A16 integral e representatividade Nubank; B03 com correlação real e configuração do pool; validação autenticada legítima via .bat/local ou main; conciliação operacional de recibos em incidente; M6 com deploy rastreável e duas horas de monitoramento. Não houve login do agente, deploy, parada, alteração do checkout vivo ou DDL de produção. A hipótese de indisponibilidade geral do login permanece retirada, conforme o login bem-sucedido informado pelo usuário.

Evidências completas do backend estão em evidence/final-controlled: upload-execution.json, upload-full-80.log/xml, upload-before.log/xml, domain-atomic.log/xml, linked-execution.json, linked-full.log/xml, linked-negative.log/xml, domain-linked.log/xml, upload-load.json e linked-rollback.json, com hashes no MANIFEST privado. Os testes controlados não substituem integração autenticada publicada.

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

Browser de encerramento deste checkpoint: A02, A03, A04, A05 e A13 PASSOU em Chromium, build release ce569da, sem erros de console/lifecycle. Respostas são fixtures controladas; a prova separada do backend é a suíte HTTP/SQL de 102 testes. Metrics e screenshots em evidence/linked-followup-chromium; trace integral no workspace/CI.

### Formulário ativo → API → PostgreSQL: prova adicional
O teste híbrido de criação vinculada passou em Chromium e Firefox. O navegador enviou um único POST /api/tasks; a API 25bb6c1 retornou 201. Uma verificação SQL independente encontrou exatamente uma tarefa de Liminar, um processo atribuído na carteira selecionada e um evento task_created por execução; os registros sintéticos foram removidos. Sem erro JavaScript ou início de OAuth. O header de carteira enviado pelo browser é conferido antes do encaminhamento.

**Limite:** identidade/apresentação e leituras de Processos usam fixtures; somente o comando atravessa a cadeia real do stage. A lista de tarefas mostrada no screenshot é fixture vazia e não prova atualização da leitura após criação. Não é login Microsoft nem integração de produção. O bearer sintético é usado apenas pelo encaminhador Node, não entra no storage/trace do navegador; arquivo temporário removido após limpeza. A prova não cobre ACK perdido/repetição de criação: a idempotência durável implementada cobre análises, e a cobertura de todos os outros writes continua pendente em A15.

Build da aplicação permaneceu sem alterações. Teste reproduzível: frontend tests/runtime-v2/linked-command.mjs (437287f); seed/verificação backend scripts/runtime_v2_linked_browser_fixture.py (82842f6). Métricas, screenshots e verificação de contagens estão em evidence/linked-command-chromium e evidence/linked-command-firefox. A reconstrução do banco vazio runtime_v2_rebuild_linked_25bb6c1 também passou com os schemas e sete migrações do stage.
