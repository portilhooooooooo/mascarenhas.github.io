# Runtime V2 — contrato de migração
Versão do contrato: runtime-v2.2. Promoção condicionada à matriz e ao diagnóstico final.

## Invariantes
React/TypeScript/Vite e Python permanecem. Layout, navegação, tipografia, cores, ordem, regras de aptidão, períodos/coortes, medianas e políticas de carteira não são redesenhados. Admin, Legal Leader e Analista mantêm autorização no backend antes de agregação ou escrita. A sessão única dos não administradores permanece.

## Ownership
| Estado | Responsável | Invalidação |
|---|---|---|
| Identidade e geração | auth.js; backend autoritativo | logout, revogação, substituição de sessão |
| Rota e shell | navegação legada; roots React persistentes | nenhuma autenticação para navegar |
| Filtros, seleção e scroll | módulo React; preferências por escopo | alteração efetiva de acesso |
| Dados remotos | TanStack Query | chave completa, TTL e mutação pertinente |
| Rascunhos | formulário; armazenamento da aba por usuário/carteira/recurso | logout, troca de carteira ou perda de acesso |
| Escrita confirmada | funções existentes + recibo durável | confirmação autoritativa; nunca timeout como prova |

## Requisitos
- R01: perfil canônico sem mutação de grants; eventos com cópias; initializing/authenticated/temporarily_unavailable/expired_or_revoked/forbidden. 401 invalida somente a identidade que iniciou a requisição; 403 bloqueia; 503 preserva credencial e mantém ações protegidas inertes. Bootstrap: orçamento total de 10 s e no máximo uma repetição transitória compartilhada entre handoff e perfil; nenhuma camada recebe orçamento adicional.
- R02: TasksApp só sincroniza subaba em rota de Tarefas. Execução, Atribuições e Produtividade permanecem após visita. Módulos ocultos não hidratam filas nem fazem polling custoso. Elementos ocultos ficam fora da árvore acessível.
- R03: quatro slots de KPI, filtros e tabela existem independentemente dos dados. Mesma chave preserva snapshot com aviso de atualização/erro; chave diferente mostra estado neutro e nunca os números do filtro anterior.
- R04: chaves incluem usuário não secreto, geração, carteira, papel, grants ordenados, versão de autorização, módulo, filtros/página e contrato. Produtividade: 45 s; dashboards migrados: 60 s. Sem retry automático em consultas. Resumo persistido: somente quatro contagens, até 4 KiB, 120 s, esquema/checksum; leitura só após identidade validada. Nenhum token, documento ou base integral no cache analítico.
- R05: F5 reconstrói geometria antes dos dados. Resumo só após autorização. Rascunhos v2 são separados por usuário/carteira/tarefa/processo; v1 só é migrado quando o renderer autorizado do recurso o solicita. Dados de outro usuário são purgados. F5 não envia formulários.
- R06: Encerramentos atualiza resumo independentemente de análises/Benner/aging. Produtividade possui resumo, detalhe paginado e exportação próprios em SQL; limite de exportação explícito, sem truncamento silencioso. Mediana exata e arredondamento compatível com Python.
- R07: request_id, versão, service time, validação e transporte são medidos sem bearer/hash/documentos. Admissão HTTP limita analytics; novos RPCs também limitam transações no banco. Timeout do cliente não é cancelamento de SQL. Capacidade efetiva do pool publicado precisa ser confirmada antes de promover.
- R08: builds por commit, browser CI em Chromium/Firefox, flags reversíveis, migrações aditivas e rollback ensaiado. CI verde não substitui integração autorizada nem monitoramento após promoção.

## Limites explícitos
Persistência de rascunho operacional é política distinta do resumo analítico. O armazenamento de credencial legado não é usado como cache de consulta. Recibos de escrita contêm resultado operacional no servidor, nunca no cache persistente analítico do navegador. Resultado incerto exige conciliação, sem replay automático.

## Limite de autenticação autorizado
Login somente via executável de testes .bat em local.portilhobackoffice.site ou main publicada no Cloudflare. O agente não possui conta autorizada e não deve fabricar sessão. Login normal confirmado pelo usuário; nenhuma falha geral de login foi demonstrada.

## Adendo de 25/10/2026
Importação de Encerramentos deve persistir classificação junto com upload/processos/evento na transação existente. Criação vinculada pelo formulário de Processos aceita process_cnj, valida autorização/carteira/responsável e usa a RPC já existente, sem ampliar as regras de criação genérica.

## Atomicidade de Encerramentos — 25/10/2026
R06/R04: análise de Encerramentos, estado do processo, metadados e evento devem confirmar na mesma transação, tanto na conclusão quanto no adiamento. Regra dos 60 dias/classificações continuam na implementação existente; o novo SQL não recalcula critérios.
