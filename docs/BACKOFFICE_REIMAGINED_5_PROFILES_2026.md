# MBA Backoffice Reimagined — especificação de protótipo

**Branch:** `design/backoffice-reimagined-five-roles-20261009`  
**Entrada de demonstração:** `ux-preview/reimagined/index.html`  
**Estado:** protótipo navegável, com dados 100% fictícios; sem autenticação e sem APIs externas.

## Objetivo

Construir uma aplicação operacional madura, com a disciplina de navegação da Apple, a atenção à tarefa do Linear e do SAP Fiori, a densidade consciente de Cloudscape (AWS), e a redução de contêineres do novo Shopify Admin (setembro de 2026).

A metáfora-base não é **dashboard de cartões**, mas **workspace de decisões**. O processo é a entidade central. Tarefa, evidência, análise e resultado são faces de um mesmo objeto.

## Cinco perfis — não quatro

| Perfil | Tela inicial | Principais capacidades | Informações ocultas por padrão |
| --- | --- | --- | --- |
| **Analista** | Minha fila | Acompanhar tarefa, processo, evidências, Q&A, resultados pessoais | Ranking global, custo corporativo, equipe, usuários |
| **Supervisor** | Central operacional | Distribuir, revisar, investigar gargalos, acompanhar funil e produtividade da equipe | Credenciais, administração de segurança |
| **Gerente** | Visão executiva | Ranking e resultados por carteira autorizada, notas, custos e riscos | Distribuição minuciosa de tarefas como tela inicial |
| **Cliente** | Minha carteira | Indicadores e entregas **somente das carteiras autorizadas**; evidências autorizadas | Funcionários, filas internas, custos de outras carteiras, integrações e configurações |
| **Admin** | Acessos | Gerenciar usuários, papéis, carteiras, auditoria e integrações | Sem isolamento gerencial, mas **com trilha e mínimo privilégio** |

Gerente é um único **tipo de perfil**, podendo agrupar sócio, coordenador, diretor e CEO; a extensão do acesso é determinada por escopo e autorização da pessoa, nunca apenas pelo nome do cargo. Um Admin não deve existir como bypass invisível da política de segurança.

## Estrutura da navegação

- Analista: Minha fila · Processos · Meu desempenho
- Supervisor: Central operacional · Fila da equipe · Encerramentos · Resultados · Processos
- Gerente: Visão executiva · Ranking · Carteiras · Qualidade
- Cliente: Minha carteira · Entregas · Qualidade
- Admin: Acessos · Carteiras · Auditoria · Integrações

Sidebar estável, contextual, seletor de carteira perto do rodapé. Comando global de busca (`⌘/Ctrl+K`). Tema Sol/Lua. Números de trabalho reais só devem aparecer quando forem pertinentes ao objetivo do perfil.

## Princípios derivados de design systems oficiais

1. **Apple HIG:** hierarquia e conteúdo em primeiro plano, controles em camada distinta, relevância e consistência da disposição. [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
2. **Shopify Admin 2026:** foco, ação direta no objeto, menos camadas e respeito à memória muscular. [Admin redesign](https://www.shopify.com/blog/admin-new-look)
3. **Microsoft Fluent:** usar proximidade e respiro para orientar decisões; evitar divisores para tudo. [Fluent layout](https://fluent2.microsoft.design/layout)
4. **AWS Cloudscape:** dois níveis de densidade, toolbar para produtividade, navegação lateral persistente, inspetor à direita. [App layout](https://cloudscape.design/foundation/visual-foundation/layout/) e [Content density](https://cloudscape.design/foundation/visual-foundation/content-density/)
5. **SAP Fiori:** *worklist* orientada à decisão, diferente de relatório de consulta. [Worklist](https://experience.sap.com/fiori-design-web/work-list/); design adaptado ao papel da pessoa. [Princípios](https://experience.sap.com/fiori-design-web/v1-70/a-beginners-guide-to-the-design-guidelines/)

## Painéis projetados

### Analista
- Pendências por prazo, próximas tarefas, status e contexto processual
- Q&A progressivo, evidências ao lado, rascunho e confirmação humana
- Produtividade individual sem exposição de ranking público entre pessoas

### Supervisor
- Backlog por etapa, aptos sem envio, envio sem conciliação, retrabalho e pendências críticas
- Ações imediatas: concluir envio, redistribuir tarefas, revisar divergências
- Funil DataJud → análise → aptidão validada → envio Benner → encerramento confirmado

### Gerente
- Ranking oficial vs projetado; custo, encerramentos por aging, vitórias, acordos e qualitativo
- Competência, data de atualização, origem, regra e política de cada carteira
- Nenhuma pontuação automática sem validação do edital e conciliação oficial

### Cliente
- Entregas confirmadas e evolução da carteira contratada
- Ocultar nomes de funcionários, decisões internas não validadas, custos de outras carteiras e credenciais
- Exportações do próprio escopo, conforme política e contrato

### Admin
- Matriz de capacidades, vínculos usuário×carteira×módulo, auditoria, status de integrações
- Princípio de privilégio mínimo, revisão de permissões e segregação de responsabilidades

## Modelo de dados que a implementação real vai precisar

- `roles`, `permissions`, `role_permissions`
- `user_role_assignments`: usuário, papel, emissor, vigência e status
- `user_portfolios`: carteira, papel, permissões efetivas e restrições
- `processes_canonical`: CNJ, identificador interno, carteira, origem e integridade
- `process_events`: andamento DataJud, data, fonte, hash/ID, coleta e versão
- `task_events`: criação, distribuição, progresso, prazo e conclusão
- `analysis_events`: respostas, versão do classificador, evidências, autor e revisão
- `closing_events`: indício, aptidão humana, tentativa de envio, retorno Benner, conciliação
- `ranking_snapshots`: competência, estoque-base, aging, despesa, pontuação, fonte e validação
- `audit_events`: sujeito, ação, antes/depois, recurso, carteira e data

**Invariantes:** (a) `indicio != apto_validado`; (b) `enviado != encerrado_conciliado`; (c) estimativa não é dado oficial; (d) acesso por carteira tem de ser autorizado na API e no banco, não só escondido no frontend; (e) nunca presumir zero para integração indisponível.

## Benchmark interpretativo de 50 empresas / plataformas tecnológicas

Esta tabela é uma **amostra deliberada de 50 referências**, não um ranking financeiro atualizado das 50 companhias mais valiosas. Os traços são **direções de benchmarking** úteis ao MBA e não alegações de medição sistemática de todos os componentes CSS de cada site.

| # | Empresa / plataforma | Site | Lição aplicável |
|---:|---|---|---|
| 1 | Apple | https://apple.com | Menos distração, mais hierarquia e contexto |
| 2 | Microsoft | https://microsoft.com | Consistência multiárea, identidade de componentes |
| 3 | Google | https://google.com | Busca central, compreensão imediata |
| 4 | Amazon / AWS | https://aws.amazon.com | Densidade configurável e ferramentas operacionais |
| 5 | Meta | https://meta.com | Clareza de estado e comunicação visual |
| 6 | NVIDIA | https://nvidia.com | Informação técnica, hierarquia por finalidade |
| 7 | Samsung | https://samsung.com | Linguagem editorial com áreas específicas |
| 8 | Tesla | https://tesla.com | Chamada à ação direta e fluxo enxuto |
| 9 | IBM | https://ibm.com | Estrutura para aplicações complexas |
| 10 | Oracle | https://oracle.com | Governança e profundidade funcional |
| 11 | Salesforce | https://salesforce.com | Objetos, estados e ações próximos do registro |
| 12 | SAP | https://sap.com | Worklist e aplicações por perfil |
| 13 | ServiceNow | https://servicenow.com | Fluxos de aprovação e gestão por exceção |
| 14 | Adobe | https://adobe.com | Ferramentas com controles contextuais |
| 15 | Cisco | https://cisco.com | Estados de sistema e confiabilidade |
| 16 | Atlassian | https://atlassian.com | Fluxos e comunicação entre equipes |
| 17 | Shopify | https://shopify.com | Reduzir camadas, aumentar foco |
| 18 | Intuit | https://intuit.com | Números acionáveis e compreensão financeira |
| 19 | Workday | https://workday.com | Perfis e experiência de gestão |
| 20 | Palantir | https://palantir.com | Contexto e rastreabilidade de decisões |
| 21 | GitHub | https://github.com | Busca, contexto, revisão e trilha |
| 22 | Cloudflare | https://cloudflare.com | Navegação por serviços e status técnico |
| 23 | Vercel | https://vercel.com | Ações claras e minimalismo de controle |
| 24 | Supabase | https://supabase.com | Workspace técnico com entidades acessíveis |
| 25 | Stripe | https://stripe.com | Operação financeira auditável |
| 26 | Databricks | https://databricks.com | Fluxos de dados com etapas explícitas |
| 27 | Snowflake | https://snowflake.com | Isolamento de dados e papéis |
| 28 | MongoDB | https://mongodb.com | Organização de hierarquias técnicas |
| 29 | Elastic | https://elastic.co | Observabilidade e busca por contexto |
| 30 | Docker | https://docker.com | Estados simples de objetos complexos |
| 31 | Netflix | https://netflix.com | Priorizar o próximo objeto relevante |
| 32 | Spotify | https://spotify.com | Personalização e navegação persistente |
| 33 | Airbnb | https://airbnb.com | Clareza de filtros e confiança |
| 34 | Uber | https://uber.com | Serviço e status no momento oportuno |
| 35 | Booking.com | https://booking.com | Fluxos de busca e progressão |
| 36 | Mercado Livre | https://mercadolivre.com.br | Informação transacional e confiança |
| 37 | TikTok / ByteDance | https://tiktok.com | Priorizar foco sobre navegação excessiva |
| 38 | Tencent | https://tencent.com | Escala com múltiplos produtos |
| 39 | Xiaomi | https://mi.com | Economia visual |
| 40 | Sony | https://sony.com | Identidade sofisticada e neutra |
| 41 | OpenAI | https://openai.com | Simplicidade da interação principal |
| 42 | Anthropic | https://anthropic.com | Tipografia serena, tom editorial |
| 43 | Perplexity | https://perplexity.ai | Acesso direto ao conhecimento |
| 44 | Cursor | https://cursor.com | Contexto adjacente ao objeto de trabalho |
| 45 | Notion | https://notion.com | Navegação flexível sem sobrecarga |
| 46 | Figma | https://figma.com | Painel de inspeção contextual |
| 47 | Canva | https://canva.com | Progressão acolhedora para usuários não técnicos |
| 48 | Linear | https://linear.app | Filas, atalhos e baixo atrito |
| 49 | Mistral | https://mistral.ai | Personalidade visual controlada |
| 50 | ElevenLabs | https://elevenlabs.io | Ações com presença visual clara |

**Decisão sintetizada:** Apple (clareza), SAP/Shopify (trabalho por tarefa), AWS (densidade), Linear (velocidade), Claude (calma visual). Não copiar landing pages para uma interface de operação jurídica.

## Como executar

Na raiz do repositório:

```bash
npm ci
npm run dev:ux
```

Abrir **http://127.0.0.1:5174/reimagined/index.html**. Para gerar build estático: `npm run build:ux`; a saída inclui a rota `.build/ux-preview/reimagined/index.html`.

**Interações reais da demonstração:** trocar perfil, trocar tema Sol/Lua, alternar carteira (só a autorizada para Cliente), navegar entre módulos, pesquisar via `Ctrl/⌘+K`, filtrar tarefas, iniciar Q&A, responder, exportar amostra CSV, ver matriz de acesso.

**Não implementado:** criação de contas, autenticação, RLS, rotas de backend, logs reais, carregamento de DataJud ou Benner, cálculo oficial do ranking e lançamento operacional. Tudo isso exige migração e validação de política antes de produção.
