# Matriz de testes — execução e limites

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
