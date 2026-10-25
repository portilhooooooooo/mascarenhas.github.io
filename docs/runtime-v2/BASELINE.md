# Baseline e medições

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

## Ambientes separados
| Ambiente | Versão | Uso |
|---|---|---|
| Frontend publicado, somente leitura | assets f0851b3 verificados no navegador | identificação do runtime; tela de login, sem integração autenticada |
| Baseline frontend local | f0851b3 | reprodução Chromium com fixture |
| Frontend candidato | release/runtime-v2-20261024; consultar commit em cada metrics.json | testes de comportamento/UX |
| Backend publicado, somente leitura | container c1c1645c…f16cc; código capturado na referência privada | inventário; não foi implantado nem interrompido |
| Banco publicado, somente leitura | PostgreSQL 17.6, PostgREST 14.5 | captura limitada desidentificada; não é carga/integracão de colaborador |
| Stage interno descartável | PostgreSQL 17.11, PostgREST 14.5, Redis, Gunicorn 2×4 | SDK/HTTP/SQL reais com identidades sintéticas |

A imagem publicada tinha rótulo que não correspondia integralmente ao código ativo. A main não foi presumida como runtime. As medidas históricas de /api/me e dashboards fornecidas no diagnóstico NÃO são baseline atual.

## Defeitos reproduzidos no baseline atual
A01 falhou: o listener alterou tasks.view no objeto canônico. A02 falhou: o painel sumiu na volta de outro módulo; a continuação da jornada não era possível e o trace/fatal foram preservados. A04 e A05 falharam: os quatro slots passaram a zero durante refresh/filtro pendente.

A04/A05 foram isolados após desabilitar somente o interceptor react-compat na fixture, para que a mutação de grants não mascarasse os defeitos internos de renderização. Isso é um contrafactual declarado de diagnóstico, não uma alteração de produção. Screenshots e metrics têm timestamp e commit.

## Concorrência — comparação de admissão
Três rodadas por variante; 30 colaboradores sintéticos e 10 aberturas analíticas simultâneas; 15 validações + 15 salvamentos finais por rodada; SQL atrasada em 1,5 s. Mesma imagem congelada (commit 289f9be, digest 2be3050c…), mesmos contratos e Gunicorn 2×4. A variante anterior remove somente admissão HTTP/transacional da candidata: NÃO representa benchmark completo do backend publicado anterior.

| Fluxo | Sem admissão mediana/P95 (ms) | Com admissão mediana/P95 (ms) |
|---|---:|---:|
| Autenticação | 1833,7 / 3105,2 | 85,0 / 196,1 |
| Salvamento final | 3195,8 / 3561,1 | 490,9 / 759,7 |
| Analytics, somente respostas 200 | 1797,0 / 4621,8 | 1569,8 / 1598,4 |

Foram verificados 90 salvamentos finais duráveis, 90 análises e seus eventos/recibos nas rodadas, sem duplicações observadas. Após admissão, 12 analytics tiveram sucesso e 18 receberam 429/Retry-After. Recusas rápidas não são sucesso nem são misturadas à latência de analytics bem-sucedidos. Auth: 90 respostas 200; escrita: 90 respostas 201, somando variantes.

Uma tentativa anterior foi abortada por RemoteProtocolError entre cliente de benchmark e Gunicorn; não produziu resultado válido. Keepalive do cliente foi alinhado a 1 s, abaixo dos 2 s do servidor; novo ensaio não repetiu a falha. Isso NÃO comprova a causa dos incidentes de transporte publicados. Nenhuma gravação foi repetida automaticamente para esconder a falha. Evidência e erro original foram preservados.

## Navegador
Reentrada em 50 alternâncias: mediana 26,0 ms, P95 51,6 ms, máximo 84,1 ms na rodada selecionada. Sem fetch idêntico durante frescor; após 46 s, exatamente uma revalidação com snapshot anterior visível. DOM/listeners/intervals permaneceram estáveis. Heap Chromium após GC: 12.036.864 → 12.459.836 bytes; acréscimo de aproximadamente 0,40 MiB, sem certificação geral de ausência de leak.

Playwright routing desabilita cache HTTP. Portanto, medições de assets quentes usam benchmark separado, sem routing e com servidor HTTP da fixture. Na repetição congelada: shell quente até 266,1 ms; geometria dos quatro slots até 327,2 ms; primeiro KPI autorizado até 445,6 ms, n=8. Cache frio, n=2: shell 494,2/378,4 ms; geometria 611,6/465,1 ms. API local controlada, não latência do serviço publicado. A política dos assets restantes é declarada no metrics.json; não equivale a medir a política efetiva do CDN.

A04/A05 mantiveram geometria por 15 s. Encerramentos exibiu KPI em 728 ms em rodada sob outros testes enquanto detalhe aguardava 15 s; não é P95 do endpoint publicado. O orçamento de identidade excedeu 10 s em uma rodada Firefox (10,299 s), foi corrigido com reserva de 500 ms dentro do fluxo e retestado em 9,501/9,502 s.

## Pendente
P95 de autenticação e salvamento publicados, resumos frios/quentes reais, fila no proxy/Gunicorn, pool efetivo PostgREST e causa dos timeouts de produção. CLS global de boot e mudanças provocadas por interação são registrados separadamente; não declarar CLS zero com base apenas em cards estáveis. Ver os JSONs brutos, matriz e diagnóstico final.

Na rodada final a0a284d, Firefox teve reentrada mediana 11/P95 34 ms (máximo 38 ms). Timeout final: Chromium 9500,2 ms e Firefox 9958 ms, ambos dentro de 10 s. Os retestes de 9501/9502 ms acima pertencem à correção anterior e permanecem históricos.

## Correção do orçamento analítico — 25/10
Foi reproduzido um defeito da candidata: a divisão igual do orçamento de 8 s impunha read timeout de 2 s aos dois novos RPCs analíticos. Com SQL controlada de 2,3 s, a imagem 289f9be devolveu 503 em 2.022,609 ms. Não é prova da causa dos timeouts publicados nem da falha histórica de 2.009 ms.

8bcc99d distribui as fases dos RPCs de Produtividade dentro do mesmo orçamento remanescente: conexão até 1 s, pool/escrita do pedido até 0,5 s cada, leitura até 4 s; a soma nunca supera o restante e limites menores já configurados são preservados. Autenticação e gravações de negócio não mudam. Não há novo retry, espera artificial no aplicativo ou aumento do orçamento total. Outros endpoints não são declarados corrigidos por este ajuste.

Na imagem nova, a mesma SQL de 2,3 s retornou 200 em 2.325,663 ms (um caso controlado, não P95). Suite HTTP/runtime/orçamento: 68 PASSOU em 28,62 s. A falha anterior e ambos os resultados permanecem no JUnit/logs privados. Helper c8ab5f3 registra tempo/status; falha de transporte status 0 foi explicitamente excluída da população de sucessos do benchmark. Populações e percentis foram conferidos contra todos os requests brutos.

Carga repetida na MESMA imagem 8bcc99d com/sem admissão, três rodadas de 30 colaboradores + 10 analytics: 90 salvamentos duráveis, sem duplicação. Valores abaixo não representam baseline de produção.

| Fluxo | Sem admissão mediana/P95 (ms) | Com admissão mediana/P95 (ms) |
|---|---:|---:|
| Auth (45 sucessos por variante) | 1555,5 / 1638,7 | 83,5 / 132,1 |
| Salvamento (45 sucessos por variante) | 1819,5 / 2182,7 | 470,6 / 719,4 |
| Analytics, somente 200 | 1637,9 / 3166,7 (n=30) | 1572,1 / 1583,8 (n=12) |

Na variante protegida houve 18 recusas 429/Retry-After. Não foram misturadas aos sucessos analíticos. Nenhuma autenticação/salvamento falhou nesse ensaio.

Imagem 8bcc99d: sha256:3f28b9eef63d4ed7d10b6ae1c0bc19216925d0af393aa293c5989f33d98acef3; duas reconstruções deram digest idêntico. A imagem histórica 289f9be permanece preservada. Ensaio 28385ca: candidata nova → referência efetiva 01fe904 → candidata nova, com auth/leitura 200 e escrita 201, uma análise e um evento por operação. Sem cutover de produção.

Login real continua não executado pelo agente sem conta autorizada; o usuário confirmou login normal. Diagnóstico de transporte/pool publicado, A15/A16 integrais e M6 permanecem abertos. NO-GO para promoção.

## Metadados reais somente leitura — limite da observação
Janela fixa 25/10/2026 13h57–14h57 de Campo Grande (17h57–18h57 UTC). Sem login do agente e sem teste de carga/gravação em produção. Foram retornadas 19 respostas do gateway Supabase: 18 com 200 e uma com 206. Os logs PostgREST têm seis registros com os termos error/timeout; não foi estabelecida correlação com esses requests, rota, fila, SQL ou causa. Não há prova de indisponibilidade geral.

| Chamada downstream real | n | Status | Mediana (ms) | Máximo (ms) |
|---|---:|---|---:|---:|
| auth_session_profile | 6 | 200 | 8 | 304 |
| auth_oauth_session | 1 | 200 | 90 | 90 |
| protocolo_v2_sync_talisman | 2 | 200 | 3172,5 | 3452 |
| carteira_processual_dashboard_v2 | 1 | 200 | 1004 | 1004 |

Tempo informado pelo header x-envoy-upstream-service-time: processamento upstream mais rede entre Envoy/upstream, conforme [documentação oficial](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-upstream-service-time). NÃO é tempo SQL isolado, fila Gunicorn ou latência completa de /api/me. A mediana foi recalculada em Python a partir dos tempos numéricos, usando ponto médio dos dois centrais para n par; quantileExact(0.5) superior não foi apresentado como essa mediana. P95 nearest-rank e contagens estão no JSON privado; n é pequeno e não comprova metas de produção.

A extração reteve somente nome de tabela/RPC normalizado, status, números e contagens. Não foram coletados mensagens brutas, query strings, documentos, CNJ, IP, JWT, assinatura ou perfil. O tamanho do pool permanece desconhecido. Leituras iniciais de campos de diagnóstico não expostos retornaram erro; não foram usadas como métricas. Nenhuma configuração do Supabase foi modificada.

CI de 8bcc99d: [PASSOU](https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40223094336). Produção permanece sem deploy desta migração. A hipótese de falha geral de login continua retirada; autenticação real não foi executada pelo agente sem conta autorizada.
