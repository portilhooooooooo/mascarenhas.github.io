# V3 — consulta isolada P6

Branch exclusiva: `dev/databasev3`. Esta entrada React/TanStack Query reutiliza os tokens, cards e tipografia existentes. Os módulos legados permanecem preservados; não se deve abrir `index.html`, iniciar `npm run dev` nem usar as configurações de produção para validar P6.

```bash
npm ci --ignore-scripts
npm run build:v3
npm run dev:v3
```

O Vite serve apenas em `127.0.0.1:5186` e encaminha exclusivamente `/api/v3` para a API isolada em `127.0.0.1:8766`. Não há chamada a Supabase, Benner, Enter, Cloudflare ou banco pelo navegador. O build é local, sem deploy. A autenticação é o simulador transacional da P5; não é OAuth/Supabase hospedado.

No backend V3, com configuração privada existente:

```bash
export V3_FOUNDATION_CONFIG=/home/ubuntu/.config/mba-v3-foundation/environment.json
.venv/bin/python -m foundation_v3.read.cli demo --session-file /caminho/privado/p6-session.json
.venv/bin/python -m foundation_v3.read.cli serve --port 8766
```

O arquivo de sessão fica em modo 0600 e contém somente credenciais sintéticas temporárias. Não o publicar. Preencher carteira, tenant e sessão na tela de validação. A sessão fica em memória no navegador. A API valida associação e permissões atuais a cada consulta. Uma segunda carteira só funciona com autorização própria no servidor.

```bash
V3_SESSION_FILE=/caminho/privado/p6-session.json npm run test:v3
```

O teste usa API WSGI e PostgreSQL reais de validação. Injeta falhas apenas no transporte local para testar preservação de revisão, cancelamento de respostas antigas e ausência de vazamento entre perfis. Evidências em `docs/v3-evidence/`. Teste completo/build legado também realizado, sem alterar o fluxo legado.

Resultados → Cadastro e Andamentos são destinos independentes. Encerramentos, Liminares, Pagamentos, Faturamento e Controladoria permanecem separados. Processos, Tarefas e Automações têm sua própria navegação. A navegação operacional legada não é incorporada a esta entrada de consulta.

As query keys incluem carteira, tenant e assinatura de identidade/permissões fornecida pelo servidor, além de módulo, filtros e cursor. Trocar contexto cancela e remove o cache; respostas com escopo incompatível são rejeitadas. Acesso negado remove dados e mostra erro específico. Dados anteriores só são preservados para a mesma chave autorizada. Paginação usa cursor assinado e exige reinício se a revisão mudar.

Os resumos não são calculados por GET. Filtros sem projeção publicada mostram indicadores indisponíveis e conservam a lista SQL filtrada. A atualização analítica é explícita no CLI do backend. Faturamento é simulação; pagamentos sem chave comprovada não compõem totais monetários. Ausência de sincronização humana não vira estado padrão de tarefa.

Nenhum deploy, proxy público, worker real, cron, cutover ou integração hospedada foi ativado. A adaptação da entrada V3 à autenticação e navegação operacionais é uma etapa de rollout posterior, sem autorização automática.
