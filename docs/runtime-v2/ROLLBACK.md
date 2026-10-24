# Rollback e promoção

Nenhum frontend foi publicado no Worker/Cloudflare; nenhum container ou banco de produção foi alterado. Branch frontend: dev/tasks-workspace. Backend: migration/runtime-v2-20261023. NÃO substituir o checkout operacional da VPS nem fazer deploy desta árvore inteira.

A reversão nesta fase consiste em reverter, em ordem inversa, os commits de migração na branch de teste ou criar um novo worktree no baseline 11a17cf. Não usar reset/checkout no diretório operacional sujo. Auth, consultas e keep-alive voltam juntos; reverter só metade do contrato de eventos pode interromper loaders legados.

Os snapshots possuem schema 1, chave com escopo e TTL de 120 s. Uma reversão pode excluir somente chaves mba_runtime_summary: e mba_runtime_filters: da aba, sem apagar mba_session_token. Rascunhos novos usam mba-qa-v2:usuario:carteira:tarefa:processo; os antigos v1 não são migrados automaticamente. Esse risco requer revisão antes de promover. Logout/revogação/troca de carteira purgam rascunhos; não há envio automático na recuperação.

O backend não mudou schema nem dados. O limite analítico é opt-in (RUNTIME_V2_ANALYTICS_LIMIT), desativado por padrão. A imagem de validação é derivada de dependências locais imutáveis e NÃO é uma imagem aprovada para produção. A label de commit do runtime não representa todos os arquivos em execução.

Gate para promoção: reconciliar runtime/image/source e os 43 caminhos de aplicação divergentes; comparar agregações antigas/novas com dados autorizados; executar B01–B06 completos e matriz de acesso real; demonstrar orçamento server-side/isolamento de auth/write; executar CI e revisão de segurança; obter aprovação expressa. Depois: imagem e assets por digest/commit, rollback anterior conhecido e observação de duas horas com revogação intencional separada de falha de infraestrutura.

Não há comando de deploy autorizado nesta etapa. Parecer atual: NO-GO.
