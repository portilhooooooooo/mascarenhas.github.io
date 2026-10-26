# Matriz de testes — execução e limites

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


PASSOU nesta matriz significa o escopo controlado descrito, não validação em produção. NÃO EXECUTADO identifica o cenário integral ainda sem evidência, mesmo quando subcasos passaram. Nenhum resultado de regex/build é usado como prova principal.

## Browser

| ID | Resultado do cenário | Fixture, ações e asserções | Duração real e commit | Evidência |
|---|---|---|---|---|
| A01 — Permissões imutáveis | PASSOU | Perfil tasks.view=true; emitir authenticated; comparar perfil e abrir painel | chromium: 158.8 ms; a0a284dc; firefox: 315.9 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A02 — Módulos e frescor | PASSOU | Produtividade→Analytics→volta; DOM/filtro/ordem/scroll; zero fetch fresco; uma revalidação após 46 s | chromium: 48794.3 ms; a0a284dc; firefox: 48890.9 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A03 — Subabas | PASSOU | Produtividade→Atribuições→volta e rota externa; mesma instância e estado | chromium: 935.7 ms; a0a284dc; firefox: 1171.8 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A04 — Refetch lento | PASSOU | Mesma chave, atraso real 15 s; quatro cards e tabela permanecem | chromium: 15612.3 ms; a0a284dc; firefox: 15738.2 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A05 — Filtro lento | PASSOU | 30→7 dias; quatro slots neutros, sem números da chave anterior; Entradas separadamente | chromium: 46300.9 ms; a0a284dc; firefox: 46267.7 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A06 — F5 profundo | PASSOU | Barreira de /me; geometria antes da identidade; snapshot apenas autorizado; filtros/ordem restaurados | chromium: 16946.8 ms; a0a284dc; firefox: 17640.5 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A07 — Storage inválido | PASSOU | JSON corrompido, TTL vencido, schema desconhecido e quota; busca correta sem crash | chromium: 7236.3 ms; a0a284dc; firefox: 10411.9 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A08 — Auth transitória | PASSOU | 503 e timeout de 20 s; no máximo duas tentativas; token preservado; shell inerte; recuperação da query | chromium: 13590.6 ms; a0a284dc; firefox: 16631.6 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A09 — Revogação/403 | PASSOU | 401 SESSION_INVALID e 403; purge de dados/token; guard informa substituição por novo login | chromium: 5392.2 ms; a0a284dc; firefox: 7941.7 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A10 — Abas e OAuth real | NÃO EXECUTADO | Duas abas sem novo OAuth PASSOU; dedup/revogação/Admin em SQL PASSOU; Microsoft e dois navegadores reais não exercitados | chromium: 1712.9 ms; a0a284dc; firefox: 2600.1 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A11 — Corridas | PASSOU | 401 antigo, payload de carteira anterior e novo handoff do mesmo usuário; nunca substituem novo contexto | chromium: 1803.2 ms; a0a284dc; firefox: 1918.6 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A12 — Matriz de acesso | PASSOU | 3 papéis × 3 carteiras no browser e no HTTP/SQL; escopos não se misturam | chromium: 14259.2 ms; a0a284dc; firefox: 23275.8 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A13 — Encerramentos independente | PASSOU | Resumo imediato, detalhe atrasado 15 s; KPI não espera a barreira global | chromium: 15402.5 ms; a0a284dc; firefox: 15301.5 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A14 — Módulos ocultos | PASSOU | Produtividade não hidrata fila/analytics; realtime pausado sem reconexão em avalanche | chromium: 5764.1 ms; a0a284dc; firefox: 7439.8 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A15 — Rascunhos e escritas | NÃO EXECUTADO | Rascunho legado/F5/seleção, migração após auth e comandos duráveis de Encerramentos, Defesa, Pagamentos v2 e Liminares (legado e quatro decisões finais) PASSOU; uploads, monitoramento assíncrono e demais operações não certificados | chromium: 2132.5 ms; a0a284dc; firefox: 2712.2 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A16 — Integridade integral | NÃO EXECUTADO | Produtividade: 5.025 combinações, mediana, CSV/XLSX PASSOU; conjunto integral de indicadores das demais áreas não certificado | Ver logs SQL/HTTP e Processos | PARIDADE.md; evidência privada backend |
| A17 — Erros e orçamento | PASSOU | 429/502/503/504 controlados, sem avalanche e sem perder snapshot válido; backend HTTP inclui SQL lenta | chromium: 2107.0 ms; a0a284dc; firefox: 2520.7 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A18 — 50 alternâncias | PASSOU | DOM/listeners/intervals/requests estáveis; heap pós-GC em Chromium e amostra temporal | chromium: 21231.7 ms; a0a284dc; firefox: 17428.5 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A19 — Acessibilidade/visual | PASSOU | Nenhum pageerror/console error; heading oculto fora da árvore acessível; screenshots e regressão operacional em 4 viewports | chromium: 392.6 ms; a0a284dc; firefox: 350.2 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
| A20 — Mudança de acesso | PASSOU | Revogar tasks.view, mudar papel/carteira; epoch próprio versus alheio; allowed_modules/master/access_kind/capabilities | chromium: 14731.5 ms; a0a284dc; firefox: 23323.1 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |

## Backend e integração

| ID | Resultado | Execução e asserções | Limite |
|---|---|---|---|
| B01 | PASSOU | 30 testes SQL; 5.025 combinações Python↔SQL; 3 testes de células/formatação XLSX | Corpus desidentificado; Nubank tem 1 evento; fila pendente em fixture sintética |
| B02 | PASSOU | Total, página, ordem determinística, autorização, CSV e ACL RPC no PostgreSQL/PostgREST | Escopo: Produtividade; não certificar paginações não migradas |
| B03 | NÃO EXECUTADO | Correlação cliente/API/gateway/PostgREST/SQL executada no stage; tempo de SQL separado de transporte | Fila real de proxy/worker, pool e causa dos timeouts publicados não comprovados |
| B04 | PASSOU | 30 colaboradores + 10 analytics; 90 salvamentos finais verificados; auth e escrita preservadas | Rede interna; não é teste de carga de produção; refusas 429 discriminadas |
| B05 | PASSOU | Concorrência de sessão/Admin/revogação, phase save e 10 final saves concorrentes; perda de ACK e resultado incerto não duplicam | Escritas integradas em Encerramentos, Defesa, Pagamentos v2 e Liminares; cobertura integral permanece pendente em A15 |
| B06 | PASSOU | Imagens por git archive, rebuild de digest idêntico, HTTP real na imagem limpa e candidato→referência→candidato | Ensaio interno; não houve cutover nem restauração de produção |

## Regressões preservadas no histórico

- Baseline f0851b3: A01/A02/A04/A05 FALHOU com trace; A02 interrompeu continuidade e foi registrado como fatal.
- Rodada inicial Firefox: timeout 10,299 s FALHOU. Reserva de 500 ms no fluxo; retestes Chromium 9,501 s e Firefox 9,502 s PASSOU.
- CI de Processos: rascunho alheio persistia se o módulo carregasse depois do perfil. Reconciliação na inicialização corrigida; reteste com módulo atrasado PASSOU.
- O discovery indiscriminado do pytest encontrou quatro imports de funcionalidades antigas ausentes no runtime capturado. A suite selecionada e o CI são listados explicitamente; não se declara o repositório inteiro verde.

## Onde executar e encontrar detalhes

RUN_LOCAL.md contém comandos. Cada metrics.json guarda timestamp, commit, duração por caso, requisições, cache, paints, shifts e erros. PNG por caso e trace ZIP ficam junto da execução; artefatos do CI são a cópia durável dos traces completos. Evidências backend e corpus permanecem no repositório privado. O manifesto de evidências registra hashes.

## Complemento do orçamento global
A08-shared-retry: PASSOU em Chromium/Firefox no commit dec1b42: duas tentativas de handoff e uma de perfil, total de uma repetição. Oito casos de auth foram reexecutados por navegador; métricas em evidence/shared-budget-chromium e evidence/shared-budget-firefox. CI completo: https://github.com/portilhooooooooo/mascarenhas.github.io/actions/runs/40217373556 (sucesso).

## Ampliação de escritas e recuperação — 25/10
- Backend 2980a0a: Defesa, 10 chamadas concorrentes e replay; uma análise e um evento, sem demo.
- Backend 3d5ed8a: três cenários Pagamentos v2, seis chamadas concorrentes por cenário e replay; respostas e carteira exatas. Suite HTTP de 22 casos PASSOU em 17,33 s. A referência nullable de upload é um stub de FK, não uma integração de upload.
- Backend 5579fd4: quatro decisões finais no fluxo moderno de Liminares, evidência contraditória em outra carteira ignorada, concorrência/replay únicos; seis decisões legadas também passaram. Banco novo reconstruído com contratos SQL efetivos.
- Backend 50a3cde: replay recusado após revogação e em carteira incorreta; auditoria read only, sem identidade/outcome na saída e incapaz de DELETE. Dois casos PASSOU em 1,13 s. Suite ampliada HTTP/runtime/orçamento: 59/59 PASSOU em 22,26 s.
- Runtime da imagem permanece 289f9be: alterações acima são fixtures, testes e ferramenta operacional externa à imagem. Logs/JUnit e manifesto no repositório privado; não são integração publicada.

## Fechamento dos testes adicionais
Backend 65a7e92: suite ampliada 65/65 PASSOU em 25,25 s; seis casos de Pagamentos legado PASSOU. JUnit e final-65-execution.json registram os casos individualmente, sem logs de conteúdo. CI completo: https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40220349776.

Regressão de domínio adicional: 97 testes + 90 subtests PASSOU; sete FALHOU, tanto na candidata quanto na referência efetiva 01fe904, com os mesmos casos/resultados. A comparação executada e os hashes das regras estão em domain-comparison.json no backend privado. Isso é evidência de divergência pré-existente, não autorização para ignorá-la nem prova de paridade de todas as áreas. A15/A16 integrais permanecem abertos.

Correção de acesso: usuário confirmou login normal. A10 real segue NÃO EXECUTADO pelo agente sem credenciais autorizadas, não por indisponibilidade comprovada. A15 adicional: Encerramento diferido com trânsito recente, concorrência/replay e estado waiting verificado no HTTP/SQL; um evento diferido e nenhuma conclusão artificial.

## R07 — corte prematuro da candidata
Reprodução na imagem 289f9be: FALHOU, SQL controlada 2,3 s recebeu 503 em 2,023 s. Em 8bcc99d: PASSOU, 200 em 2,326 s, dentro do mesmo orçamento total. Suite ampliada: 68/68 em 28,62 s. B04 repetido: 90 saves verificados; B06: rebuild idêntico e rollback na nova imagem passaram. B03 de produção continua NÃO EXECUTADO. Ver seção correspondente do diagnóstico e budget-* no backend privado.

B03 parcial: metadados reais de 19 respostas Supabase coletados somente por leitura; 6 validações de sessão 200 e 1 OAuth 200. Tempo upstream não equivale a /api/me nem SQL isolado. Seis registros com termos error/timeout não foram correlacionados. B03 integral e pool real continuam abertos. CI 8bcc99d PASSOU: run 40223094336.

Browser de encerramento deste checkpoint: A02, A03, A04, A05 e A13 PASSOU em Chromium, build release ce569da, sem erros de console/lifecycle. Respostas são fixtures controladas; a prova separada do backend é a suíte HTTP/SQL de 102 testes. Metrics e screenshots em evidence/linked-followup-chromium; trace integral no workspace/CI.

### Formulário ativo → API → PostgreSQL: prova adicional
O teste híbrido de criação vinculada passou em Chromium e Firefox. O navegador enviou um único POST /api/tasks; a API 25bb6c1 retornou 201. Uma verificação SQL independente encontrou exatamente uma tarefa de Liminar, um processo atribuído na carteira selecionada e um evento task_created por execução; os registros sintéticos foram removidos. Sem erro JavaScript ou início de OAuth. O header de carteira enviado pelo browser é conferido antes do encaminhamento.

**Limite:** identidade/apresentação e leituras de Processos usam fixtures; somente o comando atravessa a cadeia real do stage. A lista de tarefas mostrada no screenshot é fixture vazia e não prova atualização da leitura após criação. Não é login Microsoft nem integração de produção. O bearer sintético é usado apenas pelo encaminhador Node, não entra no storage/trace do navegador; arquivo temporário removido após limpeza. A prova não cobre ACK perdido/repetição de criação: a idempotência durável implementada cobre análises, e a cobertura de todos os outros writes continua pendente em A15.

Build da aplicação permaneceu sem alterações. Teste reproduzível: frontend tests/runtime-v2/linked-command.mjs (437287f); seed/verificação backend scripts/runtime_v2_linked_browser_fixture.py (82842f6). Métricas, screenshots e verificação de contagens estão em evidence/linked-command-chromium e evidence/linked-command-firefox. A reconstrução do banco vazio runtime_v2_rebuild_linked_25bb6c1 também passou com os schemas e sete migrações do stage.
