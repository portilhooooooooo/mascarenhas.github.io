# Reconciliação — 24/10/2026, candidato NO-GO

Referência do código efetivo: reference/runtime-v2-effective-20261024, 34c48c7. Captura somente leitura do container c1c1645c, imagem declarada 64b00348da25. Manifesto de hashes confirma 161 arquivos do escopo da aplicação e cinco caminhos rastreados ausentes; arquivos de código/build somente, sem env, sessões, documentos ou bancos. AST de Python válido; uma checagem heurística de credenciais não encontrou padrões (não é auditoria de segurança). O escopo não prova que cada arquivo é importado/executado.

Inventário ampliado: 325 arquivos presentes; 46 conhecidos no histórico em outras revisões, 3 iguais ao baseline, 186 iguais ao candidato antigo e 90 sem conteúdo correspondente no histórico alcançável. Outros 52 caminhos rastreados estão ausentes. Esses totais incluem arquivos/scripts/backups, não são 90 defeitos. No escopo da aplicação: 28 de outra revisão conhecida, 3 iguais ao baseline, 117 iguais ao candidato, 13 não versionados e 5 ausentes. O manifesto separa cada caminho.

Nova branch migration/runtime-v2-reconciled-20261024 deriva da referência. 0cb9435 aplica somente correções de autenticação, request_id/tempos e admissão opt-in. b9c09f2 adiciona testes de proveniência/paginação e build de validação. A paginação efetiva já continha a correção, portanto não foi substituída pela implementação antiga.

O primeiro ensaio de testes da branch anterior falhou na coleta porque services.task_productivity/timing_by_type não existe no runtime. Esse teste específico de funcionalidade aditiva da branch antiga não foi apresentado como teste do runtime. O conjunto reconciliado tem 59 testes: retira os dois casos dessa funcionalidade ausente e acrescenta dois testes do inventário. Os 59 passaram em 3,34 s com código read-only e 3,37 s na imagem reconstruída sem bind de fonte. Não são exatamente os mesmos 59 casos do checkpoint anterior.

Imagem de validação b9c09f2: sha256:6b9d922798bd740d51fd802547a75f67e4bc26a89bf63ace7ea670b64b687e09. Dockerfile remove /app/backend antes de COPY; copiar por cima não garante exclusão dos arquivos ausentes. Dependências globais da imagem imutável foram preservadas. Sem rede, 1 CPU/512 MiB, sem credenciais ou portas de produção. Não é uma imagem de release aprovada.

Replay offline de 1.125 combinações da amostra real desidentificada repetido sobre a imagem reconciliada: ver RECONCILED_PARITY.json. Mantém as limitações da amostra (139 eventos, 21 tarefas, 13 perfis, sem filas pendentes/exports/SQL/RLS real; Nubank sem tempos medidos). Não é nova implementação SQL.

Pendente: inventariar assets/dependências/configuração de inicialização/writable layer além dos fontes, completar build de release e rollback, novos endpoints/SQL, tracing fila/rede/SQL, acesso e carga equivalentes, segurança, CI específico dessa branch e gates integrais. Produção não foi alterada. As branches antigas e o checkout operacional foram preservados. Esta referência reduz a divergência de código como bloqueio; não libera promoção.

Atualização: b8088ae adiciona CI específico para a branch reconciliada, sem deploy. A execução hospedada ainda deve ser observada; não é alegada como aprovada neste checkpoint. O replay local sobre a imagem passou: 1.125 combinações, zero diferenças numéricas, 1,219 s.
