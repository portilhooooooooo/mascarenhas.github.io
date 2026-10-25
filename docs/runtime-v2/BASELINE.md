# Baseline e medições
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
