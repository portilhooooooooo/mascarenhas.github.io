# Registro de migração Runtime V2

Data da execução: 23/10/2026 em America/Campo_Grande; timestamps de evidência em UTC (24/10/2026). Estado: candidato de testes; produção não promovida. O histórico exato está em COMMITS.txt e os caminhos em CHANGED-PATHS.txt.

## M0 — Inventário e reprodução

Lidos o diagnóstico anterior e os fontes dev/tasks-workspace 11a17cf, main f0851b3, checkout operacional da VPS e arquivos do container. Produção não foi inferida de main: backend declarou 89003b5, checkout estava em c2cb57d com muitas alterações locais. Foram comparados hashes e inventariadas divergências. O auth.js publicado corresponde a f0851b3 e emite o perfil compartilhado; o interceptor compatível do main e do dev tem o mesmo SHA.

SPEC, arquitetura, baseline e matriz foram criados antes das correções. O replay original confirmou A01 (evento com referência compartilhada), desmontagem em navegação, remoção de cards, filtro perdido no F5 e falso login após 503. O bootstrap dev pode passar inicialmente por usar cópia/proxy; isso não torna o listener imutável. Para isolar as falhas seguintes, o replay baseline remove só o interceptor dentro da fixture. Sem alteração pública.

O Chromium deste executor não instalou (ZIP truncado). Builds e Playwright foram executados em localhost no dispositivo autorizado; chamadas API da suíte foram interceptadas. Não se usou login de colaborador nem dados judiciais reais. As primeiras rodadas M1/M2 foram overlays locais sobre o checkout de baseline: seus rótulos Git não identificam sozinhos todos os arquivos aplicados. Elas são evidência de desenvolvimento; a qualificação final usa commits rastreáveis e não depende dessas rodadas.

## M1 — Identidade e bootstrap

7d8797b remove mutação de grants, congela cópias canônicas/eventos, separa ativação de módulo e autenticação e dá ao bootstrap um orçamento de 10 s com no máximo duas tentativas. A API browser deixa de repetir por camada; credencial não é apagada por falha transitória. Respostas de token/carteira/época anterior são descartadas. OAuth tem coordenação local inicial, sem relaxar a regra server-side de sessão única.

A08 passou na rodada de autenticação; navegação ainda falhava, conforme esperado antes de M2. Backend 570795a adicionou 503 tipado em falha transitória de dependência, uma tentativa na validação, request_id e tempos de serviço/RPC. A política SQL de sessões não foi alterada. Login em navegador distinto e exceção Admin reais continuam sem certificação end-to-end.

## M2 — Instâncias, geometria e navegação

524e389 mantém subabas visitadas, filtra rotas externas e introduz TanStack Query em Produtividade. O primeiro teste lento detectou deslocamento de aproximadamente 17 px causado pelo texto Atualizando; a2bb3d9/1471a87 reservaram uma faixa fixa e alturas durante troca de filtro. O mesmo filtro conserva dados; outra chave mantém slots sem apresentar números anteriores. Os cards existem durante a consulta e erros não viram zero.

A revisão da suíte encontrou duas lacunas: um contador de listeners incluía nós descartados, e A03 não confirmava entrada real em Atribuições porque a fixture não tinha tasks.manage. Foram corrigidos a instrumentação e o perfil controlado, sem alterar grants reais. O aquecimento aguarda a primeira inicialização de Base Geral antes de medir 50 reentradas. Filtros e ordenação não padrão, scroll e retorno pelo menu principal passaram a ser assertados. 0f3fbba preserva rota visitada e scroll; a navegação não emite autenticação.

Atribuições preserva seleção/instância e usa a lease de atualização do estado retido; a lista de responsáveis passa pelo query client. Sua hidratação legada de várias páginas ainda não foi migrada por completo.

## M3 — Consultas, F5 e escopo

Consultas usam usuário, geração não secreta, carteira, papel, grants ordenados, módulo, filtros e versão de contrato. Frescor: 45 s para Produtividade; 60 s para resumos. Query data permanece em memória. Snapshot persistido contém só quatro agregados, schema/checksum/TTL/limite, com restauração após identidade validada. Filtro e ordenação são preferências separadas; quota/corrupção não travam o boot.

071dcef mostra shell inert durante validação com token existente; os slots podem existir sem valores autorizados. a1b3e27 revalida troca de carteira e isola rascunhos por usuário/carteira/tarefa/processo. c965e37 remove credenciais das chaves da deduplicação legada. 9e2d825 purga rascunhos também em perda de acesso/papel/identidade. Não há envio automático na recuperação. Rascunhos v1 exigem revisão de migração antes de promoção.

b804003 centraliza invalidação de queries relevantes após gravação confirmada ou evento de atualização. A consulta ativa revalida; consultas ocultas ficam stale até reentrada. Não há gravação otimista permanente nem retry automático de writes introduzido.

## M4 — Dashboards e backend

Encerramentos publica resumo, análises, Benner e aging independentemente; a espera conjunta restante só encerra atividade, não segura setDados. Módulos analíticos ocultos não inicializam por grants globais, e seus timers consultam visibilidade do módulo.

O backend isolado passou em 10 testes de autenticação/admissão e em 56 testes de regressão. Uma imagem de validação derivada da dependência imutável foi construída; os 56 testes passaram novamente sem bind de fonte. O benchmark sintético 30+10 em dois executores de quatro threads demonstra admissão, com seis analytics recusados e trinta respostas críticas 200. Não representa PostgreSQL, rede, sessão real ou gravação durável.

A comparação ampliada encontrou 34 fontes de aplicação alterados e 9 ausentes em relação ao commit declarado. Não foram incorporadas alterações do checkout sujo. NÃO foram implementados/promovidos os novos agregados/paginação SQL, nem certificada paridade real. Não se determinou a origem dos timeouts de transporte. Tempo de RPC não foi renomeado como tempo SQL. O limite analítico server-side segue opt-in/desativado por padrão, até configuração e teste equivalente aprovados.

## M5 — Qualificação e CI

A suíte browser opera o build real com fixtures, atrasos de 15 s, corrupção/quota/TTL/schema, 401/403/503/timeout, resposta atrasada de carteira anterior, nove combinações de papel/carteira, refetch, navegação e invalidação após write. A suíte operacional adicional cobre quatro viewports, formulários, rascunho/F5 e confirmação explícita.

A suíte estática permanece auxiliar. Foram atualizados mocks antigos que não ofereciam as APIs do browser e asserts que exigiam a sintaxe exata de um componente sem props. Não foram enfraquecidas as verificações browser. Os workflows novos só testam/publicam artefatos de QA; não fazem deploy. O workflow existente de upload ao Cloudflare não foi modificado nem acionado pelo seu filtro de paths. Execução do CI hospedado não é alegada sem resultado observável.

A revisão formal de segurança não foi executada: o recurso de preflight referenciado pela skill não pôde ser lido e não há ferramentas de scan expostas. As invariantes exercitadas pelas fixtures não substituem essa revisão nem RLS real.

## M6 — Não executado

Sem promoção, deploy, mudança SQL ou observação de produção de duas horas. Falta ambiente equivalente e identidade técnica autorizada para integração, reconciliação de runtime, paridade real, tracing de fila/rede/SQL, carga com writes reais e rollback completo. Parecer: NO-GO; esta execução é uma migração parcial documentada, não encerramento do incidente.

## Qualificação consolidada e continuação

O teste ampliado de carteira detectou uma corrida real na ordem dos eventos: a revalidação começava antes do evento de troca incrementar a época, invalidando sua própria resposta. 58c5704 publica a invalidação antes de iniciar /me; A11 passou depois da correção. e643f7b corrige o timestamp neutro dos slots sem resultado (não mostrar 1970) e acrescenta assert browser.

Execução final em e643f7b, UTC 2026-10-24T03:05:07.783Z: 20 subcasos Chromium PASSARAM, além da suíte operacional do build real em quatro viewports. Cinquenta reentradas tiveram mediana de 31,75 ms e P95 de 51,90 ms na medida in-page de navegação; o KPI de resumo apareceu em 381,84 ms com detalhe atrasado 15 s. São fixtures, não latências de API real. As durações completas dos testes incluem esperas e controle Playwright.

Na continuação, uma leitura limitada do banco autorizou uma amostra de 139 eventos reais, 21 tarefas e 13 perfis, com identificadores/nomes substituídos e sem conteúdo judicial. O replay offline de 1.125 combinações não encontrou diferença nos campos numéricos compartilhados entre o fonte efetivo do container e a branch. Texto de metodologia e campo adicional timing_by_type são diferenças preexistentes explicitadas, não removidas do produto para passar no teste. A16/B01 integrais permanecem pendentes.

O teste de builder PostgREST mutável falhou três vezes antes da correção ac1f3f4 no backend e passou no conjunto de 59 testes depois (4,39 s). A correção corresponde ao comportamento observado no runtime, preserva filtro de carteira e evita acumular offset/limit. Ela não implementa B02 completo: ainda existe fetch-all Python e não há novo endpoint agregado/paginado SQL. b7ba52b versiona o replay, a referência e a fixture no repositório privado.
