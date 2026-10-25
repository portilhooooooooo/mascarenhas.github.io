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
