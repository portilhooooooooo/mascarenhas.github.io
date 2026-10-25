# Diagnóstico técnico — Backoffice Runtime V2
## Parecer
**NO-GO para promoção neste checkpoint.** A implementação controlada corrigiu os defeitos reproduzidos de permissão, remontagem, geometria e bootstrap; houve 30 casos PASSOU em Chromium e 30 em Firefox. Paridade de Produtividade, salvamento final concorrente, imagem reproduzível e rollback foram executados. Isso não encerra a migração publicada: integração Microsoft real, validação autenticada do runtime publicado, configuração efetiva do pool, cobertura integral das demais operações e monitoramento após promoção permanecem sem evidência suficiente.

Nenhum deploy, parada, alteração do checkout vivo ou DDL de produção foi realizado. A autorização para interromper produção não substitui o gate técnico. O container publicado permaneceu c1c1645c…f16cc, iniciado em 22/10/2026; a revisão somente leitura de 25/10/2026 às 13h12 de Campo Grande encontrou **zero diferenças nos 166 paths comparados**. Assets publicados foram identificados como f0851b3.

## Causas confirmadas
| Achado | Evidência | Correção |
|---|---|---|
| Evento de auth compartilhava objeto e interceptor modificava tasks.view | A01 baseline falhou; perfil retornado divergiu de MBA_CURRENT_USER | Removida escrita em grants; ownership explícito e cópias imutáveis |
| Navegação externa redefinia subaba e desmontava conteúdo | A02 baseline falhou, DOM desapareceu | Guard de rota e keep-alive seletivo |
| Gate loadedKey/shown retirava cards durante consulta | A04/A05 baseline: zero slots, screenshots | Estrutura permanente; mesma chave mantém snapshot; chave diferente fica neutra |
| Encerramentos aguardava dependências lentas em conjunto | A13 com detalhe atrasado 15 s | Respostas independentes, estados locais de atualização/erro |
| Timeout transitório podia virar falsa tela de sessão encerrada | Fixtures 503/timeout e inspeção de bootstrap | Estado temporarily_unavailable, shell inerte, token preservado e orçamento único |
| Respostas antigas podiam atingir nova identidade | A11 e teste VM de 401 atrasado | Geração/token/escopo conferidos também na rejeição |
| Analytics ocupava capacidade crítica compartilhada | Benchmark de admissão com 30 pessoas + 10 analytics | Limite HTTP por worker e locks transacionais dos novos RPCs |
| Repetição de escrita após ACK perdido podia duplicar trabalho | Testes concorrentes e ACK perdido no HTTP/SQL | Intenção no cliente e recibo durável, sem retry cego |
| Evento de perfil podia anteceder o módulo de rascunhos | Falha real do CI em Processos | Reconciliação na carga e teste com bundle atrasado |
| Versão de acesso não cobria todas as restrições | Revisão de allowed_modules/access_kind/capabilities e testes de facetas | Versão/chave completas; nenhum grant ou critério de negócio alterado |

## Hipóteses e limites ainda abertos
- Não foi comprovada a origem dos timeouts publicados: fila no proxy/Gunicorn, pool/transporte e tempo de SQL não são intercambiáveis.
- Em uma rodada local da imagem 7aadb17, Regular/Admin recebeu 503 no resumo após 2.009 ms. A rodada terminou com 29 PASSOU/1 FALHOU. O reteste passou, com SQL em aproximadamente 116 ms; isso não explica a falha original. Gateway passou a registrar recebimento e conclusão upstream antes da entrega, e a API registra classe/tempo da tentativa falha, sem conteúdo sensível. O timeout não foi aumentado e não se declarou a causa resolvida.
- O máximo efetivo do pool PostgREST e eventual pre-request publicado não foram obtidos. Não foi sobrescrito um hook de segurança desconhecido. A admissão transacional protege os novos RPCs; analytics legado ainda tem limites HTTP.
- A amostra Nubank contém um evento. Nove combinações de papel/carteira foram testadas com identidades sintéticas; isso não certifica representatividade dos indicadores de Nubank.
- Não houve validação Microsoft em dois navegadores reais nem medição de autenticação/escrita publicada. Não foram criadas sessões por impersonação para contornar esse bloqueio.

## Arquitetura antes e depois
```mermaid
flowchart TD
 A["Auth e navegação misturadas"] --> B["Subaba condicional e fetch local"]
 B --> C["REST e agregação ampla"]
 D["Identidade canônica por geração"] --> E["Shell persistente e UI por rota"]
 E --> F["Query por escopo autorizado"]
 F --> G["Admissão, SQL paginado e recibos"]
```
O estado visual pertence ao módulo; o servidor continua autoritativo para acesso e escrita. Cache não concede autorização. F5 reconstrói a UI e só hidrata resumo após validar identidade/carteira/grants. Mudança real de escopo invalida imediatamente; epoch de outro usuário não apaga o trabalho corrente.

## Implementação rastreável
Frontend: branch de trabalho dev/tasks-workspace; promoção isolada release/runtime-v2-20261024 baseada em f0851b3, sem levar alterações alheias do desenvolvimento. Código de facetas: a0a284d; orçamento global de retry: dec1b42; correções anteriores relevantes: dfad4c1, 96edb86, 257eb19.

Backend: migration/runtime-v2-reconciled-20261024. Código efetivo capturado na referência privada; commits e74657b (queries/recibos), bd32064 (corpus), 3ca2041 (contexto de build), 0eb988a (logs seguros), f8615e9 (facetas de acesso), b528a39 (falhas de transporte). Imagem final identifica o commit pelo label e por X-Runtime-Version; manifests e digests ficam na evidência privada. Referência de rollback: 01fe904.

| Área | Paths principais |
|---|---|
| Identidade/legado | auth.js, data-api.js, react-compat.js, config.js |
| Navegação/estado | src/tasks/TasksApp.tsx, qaDraft.ts, runtimeQueries.ts |
| Dados/geometry | src/tasks/TaskResults.tsx; src/dashboard/EncerramentosPage.tsx; dashboards adotados |
| Backend | routes/api/me.py, task_results.py; services/productivity_queries.py, runtime_v2.py, http_transport.py, write_intents.py |
| Banco | sete migrações geradas por CLI em supabase/migrations, apenas aplicadas no stage |
| Evidência/CI | tests/runtime-v2, tests/test_runtime_v2*, workflows de browser e backend |

## Testes executados e métricas
A matriz A01–A20 e B01–B06, com durações, commits e caminhos de evidência, está em [TEST-MATRIX.md](TEST-MATRIX.md). A01/A02/A04/A05 falharam no baseline atual; os registros dessas falhas permanecem.

- Browser final: 30/30 Chromium e 30/30 Firefox, sem erros de console/página. Regressão operacional de Processos em quatro viewports passou, inclusive F5 de rascunho legado e módulo carregado após auth.
- Paridade: 30 testes SQL, 5.025 combinações entre Python efetivo e SQL; três casos adicionais compararam células e formatação XLSX. Medianas, arredondamento, contagens, períodos, ordenação, CSV e ACL foram exercitados no escopo de Produtividade.
- Rodada final da imagem congelada: 43/43 testes HTTP/observabilidade/orçamento PASSOU em 21,79 s. Isso não apaga o 503 não induzido da rodada anterior.
- A suíte HTTP usa Gunicorn→SDK Supabase→gateway→PostgREST 14.5→PostgreSQL 17.11 reais. Identidades são sintéticas. Há testes de 10 salvamentos concorrentes, ACK perdido, finalização incerta, revogação e matriz de acesso.
- Reentrada selecionada: mediana 26,0 ms/P95 51,6 ms, sem fetch fresco. Após 46 s: exatamente uma revalidação com snapshot anterior visível.
- F5 com HTTP cache habilitado, n=8 quentes: shell até 266,1 ms; geometria até 327,2 ms; KPI após autorização até 445,6 ms. Fixture local; não é P95 de produção.
- Heap após GC: 12.036.864→12.459.836 bytes na amostra de 50 alternâncias; DOM/listeners/intervals estáveis. Não é certificação geral de ausência de leak.
- Benchmark final na mesma imagem congelada, com/sem admissão: 90 salvamentos finais; auth P95 3.105→196 ms; escrita P95 3.561→760 ms. São variantes da candidata com/sem admissão, não comparação completa com produção. 429 são reportados separadamente.
- O orçamento de identidade que chegou a 10,299 s em Firefox foi corrigido e retestado em 9,501/9,502 s. O teste não teve tolerância relaxada.

[BASELINE.md](BASELINE.md) define ambiente, denominadores, mediana/P95 e limitações. Os JSONs brutos preservam requests, cache hit/miss, payload bytes, shifts com/sem interação, long tasks e chamadas redundantes. Não se usou regex/build como prova principal.

## Evidência visual
Imagens abaixo contêm somente fixtures, sem documentos ou identidades reais.

Antes, durante atualização:
![Baseline: cards removidos](evidence/baseline-current-render/A04.png)

Depois, mesma chave com atualização lenta:
![Candidato: estrutura preservada](evidence/final-chromium/A04.png)

Traces completos são disponibilizados como artefatos do CI; screenshots e métricas selecionados estão versionados. Evidência autenticada real não é publicada no repositório público do frontend.

## Segurança e consistência
Foram revisados os caminhos de identidade/401, grants, escopo de query, snapshots, SQL/RPC, recibos e logs. Testes verificam bloqueio de RPC a anon/authenticated, carteira/papel, falhas de dependência, purga e respostas antigas. Nenhuma política de sessão única foi relaxada. Não se alteraram critérios de aptidão nem mediana por média.

Snapshot analítico contém somente quatro contagens, com TTL/esquema/checksum, e só aparece após autorização. Rascunhos operacionais têm política separada por usuário/carteira/recurso; não são usados como dados de servidor. Logs não contêm bearer, token_hash, nomes ou documentos. A revisão manual e testes focados não equivalem a uma certificação externa de segurança; o scanner formal não estava disponível.

## Regressões e recuperação
O CI encontrou problemas reais e problemas da fixture; cada um foi separado no MIGRATION_LOG. Não se restauraram funcionalidades antigas ausentes do runtime só para fazer pytest discovery passar. Não se publicou teste no Cloudflare.

O primeiro empacotamento com builder legado foi rejeitado por incluir metadados. O contexto final vem somente de git archive com allowlist; .git/.env/docs/tests/scripts foram conferidos como ausentes. Duas reconstruções produziram o mesmo digest. O rollback interno executou leitura/auth/escrita no candidato, na referência e novamente no candidato, com uma análise e um evento por operação.

[ROLLBACK.md](ROLLBACK.md) contém ordem de promoção, retenção do container/mounts, desativação de flags e conciliação de intenções processing/uncertain antes de voltar a código sem recibos. Não dropar journal nem repetir escrita incerta.

## Pendências que impedem encerramento
1. Validar identidade Microsoft e navegação/API publicadas com sessão legítima, sem fabricar sessão ou grants.
2. Fechar o diagnóstico de transporte/pool e discriminar fila real; a falha local não induzida permanece registrada.
3. Completar a certificação integral A15/A16 das demais gravações e indicadores, além do escopo de Produtividade/Encerramentos testado.
4. Finalizar procedimento de conciliação/retenção dos recibos. Inventário somente leitura confirmou o bind de arquivos e ausência de handles abertos para o SQLite conhecido.
5. Promover somente com gate aprovado e acompanhar por pelo menos duas horas. Esse monitoramento não ocorreu.

A autorização para prosseguir já foi dada. Não é necessária outra confirmação genérica para continuar trabalho local; autenticação segura do usuário e evidência dos gates são as dependências concretas restantes. Até lá, o parecer é **NO-GO**, e não “migração concluída”.

## Último gate de CI
Frontend dec1b42: [CI executado com sucesso](https://github.com/portilhooooooooo/mascarenhas.github.io/actions/runs/40217373556). Backend f940cae: [CI executado com sucesso](https://github.com/portilhooooooooo/mba-backoffice-backend/actions/runs/40215951745). O último ajuste compartilha uma única repetição entre handoff e perfil; oito retestes selecionados passaram em cada navegador, incluindo handoff 503 seguido de /me 503 sem retry adicional. Nenhum desses resultados equivale a integração Microsoft publicada.
