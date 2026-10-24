# Runtime V2 — SPEC do candidato e gate de migração

Mandato: R01–R08 e A01–A20/B01–B06 do produto, 23/10/2026. React + TypeScript + Vite e Python permanecem. Nenhuma mudança de UX, regra de negócio, contagem, mediana, carteira, papel ou política de sessão é autorizada por esta migração. Estado: candidato parcial, **NO-GO** para produção.

## Limites e fontes autoritativas

Frontend: portilhooooooooo/mascarenhas.github.io, dev/tasks-workspace, baseline 11a17cf. Backend: portilhooooooooo/mba-backoffice-backend, migration/runtime-v2-20261023, base declarada 89003b5. O container efetivo foi inspecionado: seu código diverge dessa revisão, portanto main/label não são prova de runtime. Não incorporar checkout sujo nem promover a árvore inteira sem reconciliação.

API backend e política server-side são autoritativas. Browser não calcula novos critérios analíticos, concede grants ou interpreta cache como autenticação. Testes com API interceptada são fixtures; replay de dados reais é offline; teste sintético não é carga de produção. Não há deploy/DDL/escrita em produção nesta fase.

## R01 — Identidade e legado

| Estado | Comportamento obrigatório |
|---|---|
| initializing | Shell/geometria podem aparecer; sem valores persistidos ou operações protegidas |
| authenticated | /me confirmou identidade, carteira e grants; consultas e restauração daquele escopo permitidas |
| temporarily_unavailable | Credencial conservada, shell estável/inert, mensagem contextual e tentativa explícita; sem autorização presumida |
| expired_or_revoked | 401 real da mesma geração limpa identidade/caches/rascunhos e pede novo acesso |
| forbidden | 403 protege escopo/perfil; sem apresentar valores do escopo recusado |

Eventos mba:authenticated contêm cópia congelada; não podem transportar uma referência mutável do perfil canônico. mba:module-activated informa ownership/visibilidade e nunca modifica permissões ou simula login. 401 antigo não afeta geração nova. /me diferencia ausência/invalidez (401), perfil proibido (403) e dependência indisponível (503 tipado). Outros 403 de autorização não devem fingir que uma credencial expirou.

Bootstrap: prazo total inicial de 10 s na rotina de validação e uma repetição curta apenas para falha transitória; sem multiplicação browser/API/RPC. A observação desde início do documento inclui custo de boot e ainda precisa ser separada para certificar o SLO. O handoff OAuth herdado e o transporte server-side exigem gate adicional.

Uma sessão por colaborador continua server-side, com exceção Admin vigente. Coordenação local de OAuth não muda essa regra. Duas abas não devem iniciar OAuth concorrente; substituição intencional em outro navegador deve ser distinguida de falha infra. A implementação local inicial não certifica toda essa jornada real.

## R02 — Shell e estado

History API/shell são donos de rota e visibilidade. TasksApp só sincroniza tabs para rotas de Tarefas. Cada subaba visitada preserva instância/estado; nunca duplicar conteúdo visível ou acessível. Ocultos pausam polling/subscriptions/fetch custoso; notificações globais indispensáveis ficam separadas.

UI mantém filtro, ordem, seleção, scroll e rascunho segundo seu dono. Só sessão/usuário/carteira/papel/grants reais invalidam o estado protegido. Navegação nunca recria identidade global. Reentrar durante frescor exibe o painel existente sem nova consulta idêntica.

## R03 — Geometria e erro

Cabeçalho, filtros, quatro slots de KPI, blocos e estrutura de tabela existem antes dos dados. Dados preenchem conteúdo, não decidem existência do shell.

| Situação | Conteúdo | Geometria/status |
|---|---|---|
| Primeira busca | Neutro/localizado; nenhum zero inventado | Slots com tamanho estável |
| Mesma chave em refresh | Último resultado válido do mesmo escopo | Pequeno status de atualização |
| Novo filtro/chave | Não mostrar números da chave anterior sob novo rótulo | Slots mantidos, valor neutro até resposta correta |
| Erro da mesma chave | Resultado válido anterior, se existir, marcado desatualizado | Erro visível; sem tela vazia |
| Erro sem dado válido | Sem fabricar resultado | Estrutura e mensagem local |
| Escopo mudou | Dados anteriores descartados imediatamente | Não reutilizar snapshot/rascunho de outro escopo |

Downloads dependem do resultado autorizado correto. Timestamp ausente usa —, nunca uma data fictícia. Status de atualização reserva altura para não deslocar os blocos.

## R04 — Consultas e persistência

TanStack Query é a camada remota candidata de Produtividade/resumos. Chave: contrato API + usuário não secreto + geração de sessão + carteira + papel + grants ordenados + módulo + filtros/página/parâmetros. Não usar bearer/token/hash de sessão nas chaves. A versão server-side de política ainda não é fornecida; sua introdução continua pendente.

Frescor inicial: Produtividade 45 s, resumos 60 s; retenção em memória 5 min. Sem retry automático de query nesta etapa; deduplicação por chave e cancelamento/ignorar resposta obsoleta. Abort não prova cancelamento de SQL. Queries ocultas invalidadas aguardam reentrada; ativas podem revalidar. Mutação só invalida após sucesso real/evento confirmado; não há otimista permanente.

Persistência analítica: somente quatro agregados numéricos pequenos de Produtividade. sessionStorage, schema 1, TTL 120 s, máximo 4 KiB, checksum contra corrupção, validação de formato/valores/quota. Checksum não é garantia de autenticidade. Só ler para exibir após /me validar o mesmo escopo. Purga em logout/revogação/troca de usuário/carteira/papel/grants; aba antiga é revalidada. Nunca persistir tokens, hashes de sessão, listas de pessoas, documentos ou bases em cache analítico. O armazenamento de credencial preexistente não é transferido para o query store.

Atribuições e demais caches legados não estão integralmente migrados. Não declarar camada única concluída para todos os módulos.

## R05 — F5 e rascunhos

Boot de UI, identidade e dados são separados. F5 reconstrói DOM; o contrato é restauração estável, não impossibilidade de remontar documento. Preferências de filtros/ordenação restauram sem conceder acesso. Geometria pode aparecer antes da autorização; números persistidos, somente depois. Nova busca não destrói o layout.

Rascunho operacional tem política própria, separado de agregado analítico. Chave v2 inclui usuário/carteira/tarefa/processo; recuperação não envia POST. Perda de escopo purga. Rascunhos v1 não foram migrados automaticamente e exigem decisão/ensaio de migração antes de release. Nenhuma duplicação de gravação pode ser corrigida por ocultação de erro.

## R06 — Analytics autoritativo

Encerramentos tem estado independente para resumo, análises, Benner e aging: resumo pronto aparece imediatamente; erro/demora de detalhe não apaga KPI. Espera conjunta só encerra indicador de atividade.

Contrato restante a implementar: resumo agregado, detalhe paginado e exportação separados; filtro/escopo antes da agregação e paginação no banco, ordem determinística, total correto e nenhuma truncagem silenciosa. Mediana exata, cobertura válida, períodos/coortes, aging e regra dos casos do mês anterior permanecem. Índice exige plano/medida e custo de escrita.

A correção de parâmetros mutáveis de paginação conserva o caminho existente; não substitui fetch-all por SQL. Replay real de 139 eventos é evidência parcial de paridade do caminho Python, não prova de novo agregado ou exportações.

## R07/R08 — Capacidade, observabilidade e release

Request ID/versionamento devem correlacionar browser, proxy, worker, auth, transporte/PostgREST, SQL, transformação e serialização sem registrar credencial/hash/documento. Implementado no candidato: app/Flask e auth_dependency; fila/rede/SQL separados ainda pendentes.

Admissão analítica por processo é opt-in, desativada por padrão. Precisa reservar capacidade abaixo das threads e comprovar 30 colaboradores + 10 analytics com sessão/escrita durável em ambiente equivalente. Não promover por aumento isolado de threads ou benchmark in-process.

CI browser/regressão gera artefatos e não publica Cloudflare. Produção requer commit/digest reproduzível, reconciliação do fonte efetivo, matriz completa, paridade, carga real controlada, revisão de segurança, rollback ensaiado e aprovação expressa. Depois, observação de pelo menos duas horas separando expiração/revogação intencional de infraestrutura.

## Responsáveis e gates

| Dono lógico | Responsabilidade |
|---|---|
| auth.js + backend | Identidade, geração, autorização e classificação de falha |
| shell/app.js | Rota, ownership, módulo visível, scroll |
| componente/store de UI | Filtros, seleção, ordem, rascunho |
| runtimeQueries | Dados por chave, TTL, invalidação e resumo seguro |
| backend/SQL | Indicadores autoritativos, paginação, sessão e escrita |
| QA/observabilidade | Reproduções, métricas comparáveis, evidências e gate |

M0: baseline e causas reproduzidas. M1–M3: candidato testado com fixtures. M4: parcial, SQL e integração pendentes. M5: parcial, suíte legada falha e gates reais não executados. M6: não executado. Critério sem evidência permanece NÃO EXECUTADO; a matriz e o diagnóstico final são autoritativos sobre o resultado efetivamente validado.
