# Refinamento de UX e Processos — revisão de implementação

Branch: `feat/processos-ux-refinement-20261011`. Base frontend: `dev/tasks-workspace`, `1846e101734f00c7900cc0756aa6f6510843ff66`. Backend complementar: `portilhooooooooo/mba-backoffice-backend`, base `f354014b2896502cea7f07c9dd8d915cf5e7a405`.

## Diagnóstico do código real

- `src/tasks/TasksApp.tsx` executa o workspace real: fila, ownership, APIs, cache, rascunho por usuário/processo e renderers de Liminar, Defesas, Encerramentos, Pagamentos e Protocolos. O formulário progressivo já separa seleção, avanço e confirmação. Foi preservado.
- `TaskQuestion.tsx` calculava progresso principalmente pela posição das perguntas. Etapas condicionais dispensadas ficavam pendentes. Agora Encerramentos informa o estado efetivo de cada etapa sem modificar as regras jurídicas.
- CSS herdado impunha altura integral a opções e formulários. O conteúdo simples gastava mais espaço que o necessário. O formulário usa altura intrínseca, opções compactas, scroll automático e rodapé separado; conteúdo condicional extenso continua acessível.
- O breadcrumb estava no shell de `index.html`, compartilhado pelos módulos. Foi retirado apenas esse elemento. Títulos, contexto CNJ, abas, rotas, histórico e permissões foram mantidos.
- Login React tinha email, Entrar e ações duplicadas Microsoft/Google. Agora tem apenas email opcional e Entrar, chamando o mesmo serviço Microsoft PKCE. O email não é enviado nem usado como autenticação: o contrato atual não aceita login_hint. O vídeo institucional permanece no build.
- `GestaoProcessualPage.tsx` é Resultados/analytics, não cadastro individual. O backend tem `base_processual`, tarefas e capturas técnicas DataJud, mas não tinha contratos individuais de processos. Não usamos o agregado `/api/carteira-processual` como timeline.
- O backend-base não aceitava os campos de concordância do frontend v3. A extensão mantém contratos antigos e exige justificativa para divergência, auditada como `necessita_validacao`, sem confirmação jurídica. A projeção também precisa aceitar esse estado para não conservar uma vitória anterior.
- A navegação do código-base é o shell lateral existente. Foi preservada, com a ordem Processos, Tarefas, Operação, Automações, Resultados, sem segundo menu principal.
- O build buscava Lucide por CDN e inseria um texto literal `\n` após o vídeo. Lucide 0.468.0 agora é copiado para o artefato com licença; o texto acidental foi corrigido.

## Alterações e contratos

| Contrato | Comportamento |
| --- | --- |
| `GET /api/me` | `capabilities.processos`, além das permissões e carteiras existentes |
| `GET /api/processos` | `q`, `situation` (valor real exato Benner/CPJ), `uf`, `pending_tasks`, `page`, `page_size`; `{rows,total,page,page_size}` |
| `GET /api/processos/{cnj}` | Identificação efetivamente disponível e permissões de tarefas; 404 igual para inexistente/outra carteira |
| `GET /api/processos/{cnj}/timeline` | `{rows,page,page_size,has_more,sources}`; eventos judiciais e operacionais tipados, fatos/capturas separados |
| `GET /api/processos/{cnj}/tasks` | Tarefas vinculadas, paginadas e filtradas pela visibilidade efetiva |
| `POST /api/tasks` | Reutilizado com `process_cnj`; responsável validado na carteira, tarefa e vínculo criados em uma transação com auditoria |
| `/tarefas/item/{taskId}/{processId}` | Abre o registro autorizado no workspace; consulta em leitura quando não executável |

Listagem padrão 25, máximo 50 por página, até 200 páginas por consulta. A carteira vem de `X-Portfolio-Id`, nunca de filtro enviado pelo browser. Situação usa valores das fontes, sem inventar classificação. Sugestões do filtro usam somente a página consultada. A troca de carteira usa o seletor existente e descarta o componente/caches anteriores.

A timeline usa movimentos das capturas DataJud arquivadas pelo worker, verificando CNJ, hash SHA-256 e tamanho. A identidade de deduplicação inclui grau/tribunal/código/data/nome/complementos. Capturas repetidas mantêm referências de origem/job/hash. Eventos operacionais vêm de `task_events`; não são andamentos judiciais. Só aparecem fatos registrados. O histórico de cada origem é limitado à última captura disponível; não há alegação de completude histórica. Falha do DataJud não elimina o histórico operacional. Capturas externas não são disparadas ao abrir a tela.

Criação direta habilita Liminar, Defesa e Encerramento individual, tipos já suportados. Protocolos automáticos, Acordos e Pagamentos mantêm seus fluxos especializados. Não duplicamos importações ou encerramos tarefas ao preparar PDFs.

Estados de progresso: `pending`, `active`, `completed`, `not_applicable`. Os dois últimos são azuis; `not_applicable` permanece distinto em `data-stage-state`, acessibilidade e notas auditadas pelo backend. No caso Extinção → acórdão mantido → trânsito confirmado → Vitória, execução é dispensada e `execution_requested/full_payment` continuam null. Divergência exige justificativa e confirmação explícita.

## Validação executada

- TypeScript + Vite + build estático: passou.
- `npm run test:hardening`: passou (contratos de login, carteiras, rotas e confirmação Q&A).
- `npm run test:metabase`: passou.
- Seleção de testes de produto/acesso/temas/fila: 23 passaram.
- `node tests/spec-product-ui.mjs`: passou; regressões Liminar, Defesa, Pagamentos, Protocolos, teclado, atribuições, login, Resultados e troca de acesso. Workspace em 1366×768, 1440×900, 1920×1080 e mobile 390×844.
- `node tests/processos-ui.mjs`: passou no **dist real**, com APIs interceptadas exclusivamente no teste. Consulta, detalhe, paginação, criação explícita, abertura vinculada, encerramento dispensado/revisão, campos obrigatórios, quatro viewports, carteira, permissões, flag desligada, 404, estados vazios, falhas externas, Microsoft PKCE e estados de erro/loading. Nenhuma exceção JS.
- As medidas da análise simples em desktop: scrollHeight/clientHeight iguais em 511/511, 658/658 e 858/858. Scroll automático fica sem barra quando não há excesso. No mobile o conteúdo segue o fluxo da página, com controles acessíveis. [Medições](ux-processos-evidence/measurements.json).
- Backend:70 testes focados +17 subtests; SQL PGlite de Processos e teste da RPC real de projeção de revisão. Ver relatório complementar no backend.

Capturas são do código integrado com **fixtures de teste**, não de dados reais nem de uma aplicação paralela:

| Tela | Evidência |
| --- | --- |
| Listagem | [1366](ux-processos-evidence/processos-1366.png), [1440](ux-processos-evidence/processos-1440.png), [1920](ux-processos-evidence/processos-1920.png), [mobile](ux-processos-evidence/processos-390.png) |
| Histórico | [Sol](ux-processos-evidence/processo-historico.png), [Lua](ux-processos-evidence/processo-historico-lua.png), [mobile](ux-processos-evidence/processo-historico-mobile.png) |
| Tarefas e criação | [Vínculos](ux-processos-evidence/processo-tarefas.png), [Criar](ux-processos-evidence/processo-criar-tarefa.png) |
| Execução dispensada | [1366](ux-processos-evidence/encerramento-1366.png), [1440](ux-processos-evidence/encerramento-1440.png), [1920](ux-processos-evidence/encerramento-1920.png), [mobile](ux-processos-evidence/encerramento-390.png) |
| Revisão | [Justificativa obrigatória](ux-processos-evidence/encerramento-revisao.png) |
| Login | [Sol](ux-processos-evidence/login-sol.png), [Lua](ux-processos-evidence/login-lua.png) |

## Bloqueios e sequência de homologação

PRs ficam em rascunho; não recomendamos merge enquanto os bloqueios forem resolvidos. O conjunto amplo de testes da base já falha: frontend 41 passaram/5 falharam, reproduzidos sem mudanças (API mocks, ordenação esperada antiga e scripts antigos de browser). Com Chromium disponível, os dois scripts antigos falham em expectativas já obsoletas (Automações na carteira MBA e avanço implícito do Q&A); os novos testes seguem os contratos atuais. Backend também tem falhas prévias documentadas. Não alteramos contratos jurídicos para acomodar esses testes.

Processos permanece oculto por `PROCESSOS_ENABLED=false`, sem fallback fictício. Antes de habilitar em ambiente autorizado: revisar/aplicar as migrations isoladas, verificar schema real/RPCs, conceder `processos.view` por carteira e validar capturas locais DataJud. A migration de revisão deve anteceder o backend, mesmo com Processos desligado. Homologação de ponta a ponta com SSO Microsoft/MFA e sessões reais ainda depende de ambiente autorizado; o teste local não abre uma conta Microsoft nem modifica MFA.

Não houve merge, deploy, migração em produção ou alteração de VPS/Cloudflare/infraestrutura.

A suite de segurança já usada pelo CI do backend também passou:61 testes.

## Arquivos modificados

- `.github/workflows/spec-driven-product-check.yml`
- `app.js`
- `auth.js`
- `build-static.mjs`
- `docs/test-results-ux-processos-20261011.txt`
- `docs/ux-processos-20261011.md`
- `docs/ux-processos-evidence/measurements.json`
- `index.html`
- `package-lock.json`
- `package.json`
- `portfolio-policy.js`
- `src/dashboard/ProcessosPage.tsx`
- `src/dashboard/UsersPage.tsx`
- `src/dashboard/main.tsx`
- `src/dashboard/processos.css`
- `src/dashboard/processosService.ts`
- `src/login/main.tsx`
- `src/tasks/ClosingAnalysisFlow.tsx`
- `src/tasks/TaskQuestion.tsx`
- `src/tasks/TasksApp.tsx`
- `src/tasks/qaWorkspace.css`
- `tests/client-switcher-local.test.mjs`
- `tests/hardening.test.mjs`
- `tests/portfolio-policy.test.mjs`
- `tests/processos-ui.mjs`
- `tests/qa-workspace.test.mjs`
- `tests/spec-product-ui.mjs`
- `tests/spec-product.test.mjs`
- `docs/ux-processos-evidence/*.png`: capturas de fixtures.
