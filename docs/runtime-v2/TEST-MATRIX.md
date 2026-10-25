# Matriz de testes — execução e limites

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
| A15 — Rascunhos e escritas | NÃO EXECUTADO | Rascunho legado/F5/seleção, migração após auth e comando durável de Encerramentos PASSOU; todas as gravações de outros módulos não certificadas | chromium: 2132.5 ms; a0a284dc; firefox: 2712.2 ms; a0a284dc | [chromium](evidence/final-chromium/metrics.json) / [firefox](evidence/final-firefox/metrics.json) |
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
| B05 | PASSOU | Concorrência de sessão/Admin/revogação, phase save e 10 final saves concorrentes; perda de ACK e resultado incerto não duplicam | Escrita final integrada certificada em Encerramentos; demais writes pendentes em A15 |
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
