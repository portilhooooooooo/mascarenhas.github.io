# Tarefas e Controladoria — revisão de UX

Implementação na branch `dev/tasks-workspace`. Sem deploy, merge em main, alteração de autenticação ou gravação de processos reais.

## Workspace de tarefas

Todos os tipos de tarefa usam a mesma área de execução no desktop: altura mínima de 900 px, ajustada apenas para viewports mais altos. Respostas condicionais não mudam o tamanho do workspace. Não há rolagem interna. Em resoluções menores que o conteúdo, apenas a página rola; no fallback móvel, o conteúdo segue o fluxo natural.

O número do processo é seguido por pasta, indicação recebida e respostas da análise, sem o subtítulo do lote. Tutoriais, descrições de opções e legendas de perguntas foram removidos. A seleção e as ações usam o azul do tema `#142b67` e seus tokens existentes. Textos extensos nos indicadores usam elipse e título com o valor completo; permanecem legíveis no campo de edição.

A coluna da fila ocupa a mesma altura e apresenta a quantidade de processos que cabe nessa área, com paginação para os demais. “Pular esse prazo” chama o endpoint existente e envia o item para o final da fila exibida, incluindo outros tipos de tarefa. Essa ordem é preservada durante as atualizações da sessão. “Salvar e próximo” mantém as validações e os retornos de erro. Atualização por eventos do backend é uma etapa separada.

## Defesa

A data da Enter aparece uma única vez: “A Enter determinou que essa defesa deve ser apresentada em DD/MM/AAAA”. Não há indícios nem faixa repetida de Fatal Controladoria.

1. O fatal da Enter está correto?
2. Se não: existe prazo para apresentação de defesa em curso?
3. Se sim: evidências e respectivas datas, com o Fatal Real observado no CPJ. Se não: motivo.
4. Se suspenso: tema da suspensão.

Prioridade e conclusão não são escolhidas pelo operador nem enviadas pelo frontend. O contrato V3 envia as respostas; a compatibilidade no backend está preparada na mesma branch do repositório `mba-backoffice-backend`. O servidor lê a data da Enter do contexto autorizado e usa o Fatal Real CPJ confirmado, sem recalcular pela data de AR, DJE ou audiência.

Frontend e backend V3 precisam de homologação conjunta antes de promoção. A versão em execução na VPS continua com o contrato anterior. O suporte a Defesa do RPC já existente na VPS também é uma dependência da branch histórica do backend. Nenhuma migration foi executada.

![Pagamento](execucao-tarefas.png)
![Defesa](defesa-workspace.png)

## Controladoria

Preservadas as mudanças anteriores: atalhos por estado operacional, importações recolhíveis, filtros explícitos, busca/paginação de defesas e últimos dados preservados quando a atualização falha. Permissões, retries e estados continuam determinados pelo backend. A paginação visual não substitui a paginação de dados no servidor.

## Prévia e validação

```bash
npm ci
npm run dev:ux
```

A entrada `ux-preview/` monta componentes reais com dados fictícios. Não importa login ou configuração da API real. O seletor “Fluxo da prévia” abre cada formulário. Gravações são bloqueadas; nos testes, POSTs são interceptados localmente para conferir contratos, falhas e retenção de respostas.

```bash
npm run build
npm run test:hardening
npm run test:metabase
npm run test:ux
```

Com outro Chromium, use `UX_CHROMIUM_PATH=/caminho/chromium npm run test:ux`. Capturas ficam em `.build/ux-qa`.

Verificações: navegação e filtros; envio para o final da fila; formulários de Liminar, Defesa, Pagamento, Protocolo e Acordos; duas etapas de envio de PDFs; payloads; ausência de requisições externas e erros JavaScript. Área constante e ausência de sobreposição verificadas nos caminhos extensos de Defesa e Acordos em 1920, 1600 e 1366 px. Fallback móvel inspecionado em 390 px. Backend: testes de resolução e persistência com RPC substituído por mock.

A plataforma abriu sem sessão autenticada. A operação com dados reais em homologação permanece pendente.
