# Implantação autorizada — UX e Processos — 11/10/2026

A autorização desta sessão permitiu aplicar migrations, atualizar a VPS e integrar backend na main e frontend em dev/tasks-workspace.

## Versões e acesso

- Backend: PR #24 integrado na main; código 1cde6dd83c279dae02fcc9efb5a092ccaf391d21.
- Frontend: PR #27 integrado em dev/tasks-workspace; código b5810ee86899e0241b959db965c925c88b90bb4d.
- Interface de desenvolvimento: https://dev-tasks-workspace-backoffice.mba-advogados.workers.dev
- Cloudflare Worker backoffice: versão e0d48627-cdab-4cb4-b979-6f2fb8ab57c2, alias dev-tasks-workspace. Cabeçalhos de segurança e SPA preservados.
- A versão padrão do frontend continua f8aeebeb-7f62-48cd-a072-cec29f63d03a. O frontend main não foi modificado.
- API VPS: mba-backoffice:processos-ux-20261011, imagem 6f28ba628a11, derivada da imagem de segurança vigente.
- A atualização inclui os arquivos Python do PR sobre a imagem publicada. Preserva as rotas adicionais de Operação/Benner/Liminar e os demais componentes que existiam somente no runtime.
- Workers Benner, DataJud, RQ, watchdog e Talisman permaneceram nas imagens anteriores; nenhuma automação foi disparada.

## Banco e autorização

Aplicadas e verificadas no Supabase dyxegxreoujdxfhblaye:
- 20261011170940 encerramentos_review_projection, correspondente ao arquivo 20261011003140_encerramentos_review_projection.sql.
- 20261011170950 processos_workspace, correspondente ao arquivo 20261011001039_processos_workspace.sql.

As quatro funções Processos são SECURITY INVOKER, sem EXECUTE para anon/authenticated e com EXECUTE para service_role. A constraint de Encerramentos aceita necessita_validacao.

PROCESSOS_ENABLED=true na API. processos.view foi concedida por carteira apenas a usuários ativos, não bloqueados, com membership ativa e autorização explícita tasks.view já existente: 10 vínculos em agibank_enter e 4 em agibank_mba. Não amplia tasks.create/execute/view_others. Master usa a autorização existente. Novas concessões devem usar o editor de usuários por carteira.

A origem de desenvolvimento foi acrescentada de forma exata ao allowlist da API, mantendo as duas origens anteriores. Sem wildcard, mudança de MFA, extração de sessões ou criação de autenticação local.

## Verificação executada

- Frontend build TypeScript/Vite/static: passou; também passou no GitHub Actions após merge.
- Hardening, portfolio policy, rotas, Q&A e Metabase: passaram.
- Playwright Processos e regressões do workspace: passaram, incluindo 1366×768, 1440×900, 1920×1080 e mobile.
- Backend focado: 70 testes e 17 subtests passaram; CI contracts e security-regressions passaram.
- SQL PGlite: escopo, paginação, visibilidade, criação atômica/auditoria e projeção de revisão passaram.
- API real /health local e público: 200; /api/processos sem sessão: 401.
- Consultas reais da API aos RPCs/registro/tarefas/eventos: passaram nas carteiras MBA e Enter. Andamentos DataJud arquivados lidos e verificados por hash: 23 eventos no primeiro processo verificado na MBA e 14 na Enter.
- Criação no RPC real, vínculo e auditoria: passou em subtransação revertida; nenhuma tarefa de teste permaneceu.
- Playwright no endereço publicado, com Chromium da imagem: login nas quatro resoluções sem overflow horizontal; sem pageerrors; /api/me sem sessão 401 acessível por CORS; clique Entrar chegou ao /auth/microsoft/start real com 200 e URL Microsoft. A navegação ao provedor foi interrompida pelo teste; conclusão interativa do login/MFA não foi automatizada.
- Origem desconhecida no POST de autenticação: 403; preflight da origem dev: 200 com allow-origin exato.
- Capturas de login publicado e live-smoke.json: /home/ubuntu/backend/arquivos/processos-ux-evidence-20261011. Evidências de fluxos/Processos com fixtures continuam em docs/ux-processos-evidence no frontend.

## Operação e rollback

Release na VPS: /home/ubuntu/releases/processos-ux-20261011.
compose-live.sh reproduz todas as camadas de configuração anteriores e adiciona somente o override desta release. A configuração temporária restrita em /dev/shm foi restaurada a partir da configuração do container existente, sem exibir credenciais.

Rollback da API:
`/home/ubuntu/releases/security-deps-20261010/compose-live.sh up -d --no-deps --no-build mba-backoffice-backend`
Retorna à imagem anterior. As migrations são aditivas/compatíveis com a versão antiga; não excluir dados ou permissões para fazer rollback.

A versão padrão do frontend não foi trocada. Para retirar a versão dev, alterar seu alias/versionamento no Worker; não é necessário rollback do domínio padrão.

## Limitações conhecidas

A listagem reflete base_processual real: 45.049 CNJs na MBA e 10 na Enter no momento do smoke. Tarefas ou dados existentes em outras projeções não viram processos fictícios; a cobertura depende do registro central existente. Timeline mostra capturas disponíveis, com indicação de fonte parcial/indisponível.

As falhas legadas da suíte ampla, já reproduzidas na base e descritas nos relatórios anteriores, permanecem documentadas. Este registro não declara a suíte inteira verde.

O check automático Workers Builds: mascarenhas-github-io pertence à conta dba3e599c42ba60ea611dec60d3a588e, que não está autorizada na conexão atual. A publicação de desenvolvimento foi concluída pela API oficial na conta autorizada 4e3f4121dcc77830acccfc5ee473d7e1, Worker backoffice. Não se alterou a configuração do outro build.
