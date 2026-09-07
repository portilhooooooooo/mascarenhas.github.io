# Redesign e preservação de autorização — SPEC v1

Data: 07/09/2026. Escrita após inspeção e antes de mudanças de implementação.

## Base confirmada

- Frontend main e security/auth-migration: 66436b8ab16cdd04cc548bf64486291bef438538. HTML/JS com dashboard React/TypeScript, Vite, Recharts e Inter. Branch adicional codex/dashboard-redesign não será sobreposta.
- Backend main: 391c7876a21bbc8c5fd022a84e9996bcc862e8b8; security/auth-migration: e965b25f578a1a30993d71555fc715ac4c6d719d. Base escolhida para correção: branch de autenticação, que contém as proteções exigidas. Deploy efetivo da VPS não comprovado por SHA.
- Fontes recuperadas do GitHub; arquivos locais reaproveitados somente quando o blob coincide. Nenhum AGENTS.md encontrado nas árvores.
- Supabase dyxegxreoujdxfhblaye inspecionado por SQL somente leitura. processos_carteira possui product, situation_benner, situation_cpj, date_resolution e updated_at. acordos_carteira não possui origem_acordo. Ambas têm RLS habilitada e não há grants diretos para anon/authenticated.
- agreement_cases e agreement_analyses existem e usam task_process_id. Não substituir nem apagar essas tabelas.

## Gaps encontrados

1. React monta e consulta dashboards antes de /api/me e mesmo para operacional. Esconder section não impede request.
2. showPage não verifica sessão nem permissão; rotas só cobrem três telas. Estado 403 precisa ser explícito.
3. data-api propaga mensagens brutas; 423 não revoga estado local. Respostas antigas podem reaparecer após troca de sessão.
4. Sidebar extensa, contagens demonstrativas fixas, textos de 9–12px e quatro datas permanentes. Tabela React contém buttons diretamente sob tr.
5. Backend de carteira ignora produto e Benner, não calcula encerramentos, aging médio, auditoria nem última atualização. Acordos calcula soma, não média. Filtros desses endpoints não são fechados.
6. Configuração de exemplo e mocks ainda apresentam Supabase/roles antigas. Limpeza de chaves antigas em auth é migração defensiva, não autenticação legada, e deve ser preservada isoladamente.
7. get_assigned_process consulta por ID e filtra depois no servidor. Reforçar consulta com ID E assignee. Preservar validação de módulo e allowlists existentes.
8. Diretório de responsáveis deve ser solicitado apenas ao abrir atribuição/criação, por permissão de criação/atribuição; não na inicialização operacional.

## Contrato de segurança

Backend é autoridade. Sessões operacionais só podem tasks.view/tasks.execute; dashboard.view, agreements.view/export, users.view, pagamentos e automações continuam negados pelo decorator. Nenhum grant de módulo equivale a base completa. IDs de terceiros negados antes de detalhe/alteração. Upload e PATCH de atribuição administrativos. Preservar OAuth Google state/nonce/PKCE, handoff, TOTP/replay, bloqueio, IP, revogação, CSP/HSTS/nosniff/XFO/Referrer/Permissions-Policy.

Frontend monta React apenas após perfil válido, administrativo e dashboard.view. Desmontar em logout/expiração/bloqueio; impedir aplicação de resposta iniciada sob outra sessão. Navbar e rotas verificam mapa retornado por /api/me e access_kind, com estado de acesso negado. Nenhum request Supabase no browser.

401 autenticado: limpar e exibir login. 423: limpar e informar conta bloqueada. 403: acesso negado, sem apresentar dados anteriores. 5xx/rede: mensagem neutra; nunca resposta bruta. Não enfraquecer política para facilitar preview.

## UX e navegação

Navbar superior: Início, Gestão Processual, Acordos, Pagamentos, Automações, Tarefas; relatórios apenas quando existir capacidade real (não criar exportação fictícia). Perfil abre Usuários/Configurações conforme permissão e Sair. Busca por CNJ leva à base filtrada apenas quando administrativo autorizado; operacional busca somente suas tarefas já entregues pela API.

Gestão: Carteira Processual, Entradas, Encerramentos, Auditoria. Subabas reutilizam consulta e filtros, com data apropriada e foco na tabela. Início oferece atalhos autorizados sem KPIs grandes. Acordos distingue Preditivos (saneamento existente) e carteira em tratativa (dashboard.view necessário), sem contato/minutas.

Manrope via origem de fontes já permitida; fallback sans-serif. Azul, branco e ink; 8px grid, 32px padding desktop, 24–32px entre seções, inputs 44px, radius 8px. Conteúdo funcional >=13px. Navbar quebra em segunda linha em notebooks; tabelas rolam dentro da seção.

## Regras de indicadores e filtros

Situação consolidada segue Benner: Encerrado = encerrado, Em Andamento = ativo; demais = não informado (não inferir ativo de data ausente). Datas de encerramento medem eventos. Aging médio considera números válidos da carteira ativa. Aptos a arquivamento = Benner Encerrado e CPJ Em andamento. Divergência = CPJ Divergente OU estados normalizados diferentes, ambos informados. Regras explícitas e testadas.

Período único com início/fim e tipo entrada/encerramento. Filtros UF, produto, situação e resolution; CNJ/integration paginados. KPIs e composição usam o recorte. Evolução compara eventos de entrada e encerramento no MESMO período, aplicando dimensões mas sem usar data de entrada para excluir encerramentos de casos antigos. Entradas/encerramentos/saldo usam esses eventos. Última atualização = MAX(updated_at), nunca horário do browser fingindo atualização da fonte.

Pontos clicáveis: aging ativo >180, divergência, aptos a arquivamento. Encerramentos abaixo da média exige comparação de meses completos; não inventar baseline. Exibir indicação apenas quando houver série histórica suficiente; clique seleciona período de encerramento comparado.

Acordos: média de proposta numérica finita, incluindo zero e excluindo NULL; sem propostas = null/—. Total, fechados, negociação e recusados agregados no servidor. Distribuições por situação/tarefa/tipo; origem em {terceirizado,interno}. Migration adiciona coluna NOT NULL DEFAULT terceirizado e CHECK; nenhum preditivo copiado para carteira. Paginação determinística. Endpoints reais /api/carteira-processual e /api/acordos-indicadores mantidos, sem aliases fictícios. Filtros desconhecidos/duplicados rejeitados.

## Arquivos e implementação

Frontend: index.html, styles.css/design CSS, app.js, auth.js, data-api.js, config.example.js, mocks, agreements.js, build-static.mjs, src/dashboard/{main,CarteiraProcessualPage,carteiraService,AgreementsIndicatorsSection,agreementsIndicatorsService,carteira.css}, testes e esta documentação.
Backend: modules/{carteira_processual,acordos_indicadores}/routes.py, repositories/task_repository.py, migration de origem e testes de contrato/autorização. Demais arquivos somente se evidência direta exigir.

## Gates e riscos

Testes Flask em rotas reais com sessões operacionais: bases/dashboards/users/upload/PATCH negados; detalhe e análise de IDs alheios negados; admin/user autorizados; filtros e métricas. Testes de cliente 401/403/423/5xx e isolamento de sessão. Build inclui tsc; inspeção browser desktop/notebook/mobile, console, overflow, vazio/loading/erro/403 e ausência de requests administrativos operacional/deslogado.

Fixtures não comprovam login real em produção. Migração e deploy de backend são dependências do frontend. Não afirmar segurança da VPS sem evidência. Agregação Python existente varre a base no servidor; manter paginação estável e registrar custo residual, sem reintroduzir leitura integral no browser. Branches revisáveis, sem merge/deploy automático de main.
