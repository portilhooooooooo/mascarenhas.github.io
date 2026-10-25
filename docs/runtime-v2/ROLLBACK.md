# Release e rollback
## Gate
Não promover enquanto DIAGNOSTICO_FINAL indicar NO-GO. Produção não foi interrompida, alterada ou implantada durante os ensaios. Checkout /home/ubuntu/backend contém alterações alheias e não é fonte do build.

## Build
Backend: scripts/runtime_v2_build.py --commit COMMIT --tag mba-runtime-v2-release:COMMIT. O contexto vem de git archive com lista explícita de paths; não contém .git, .env, docs, testes, fixtures ou diretórios de documentos. Imagem-base é o digest capturado do runtime, sem download de dependências durante o build. A reprodução depende da disponibilidade desse digest; arquivar a imagem no registry aprovado antes da promoção.

Frontend: npm ci && npm run build no commit da branch release/runtime-v2-20261024. Não publicar a branch dev inteira: contém alterações não relacionadas. Preservar o bundle anterior e a configuração de deploy por SHA.

## Ordem de promoção
1. Confirmar commits, backup e preimagens das funções SQL, compatibilidade de pool e integrações reais. Revisar matriz, imagem e rollback.
2. Aplicar migrações aditivas rastreadas no backend; verificar ACL service-role e contratos.
3. Promover backend com flags explicitamente escolhidas e CORS Idempotency-Key; validar leitura/escrita antes do frontend.
4. Promover bundle FE rastreável. Monitorar por pelo menos duas horas, separando substituição intencional de sessão, revogação e indisponibilidade.
Nenhum teste de carga é direcionado a produção por estes scripts.

## Reversão
Conservar o container anterior e seus mounts; nunca substituir o checkout sujo por um git reset. Imagem de referência provém de captura do código efetivamente em execução, inclusive módulos de suporte; o rótulo antigo da imagem não provava a versão.

Antes de voltar a código sem recibos, bloquear temporariamente novas escritas finais e conciliar recibos processing/uncertain. Um timeout pode ter gravado: verificar análise, evento, recurso e trilha pelo ID interno, sem repetir o comando. Não expirar automaticamente uma intenção incerta, não apagar o journal e não reenviar formulários. Só liberar após a conciliação.

Desativar flags SQL/admissão para retornar aos caminhos anteriores preservados. Não dropar colunas/tabelas aditivas durante incidente. Restaurar função antiga somente após verificar dependências e compatibilidade. O epoch global pode continuar aditivo. OAuth/sessão única não deve ser relaxado no rollback.

## Riscos
A política desta versão é reter todos os recibos sem expiração/limpeza automática. WRITE-RECOVERY.md define inventário e conciliação; a ferramenta foi testada em transação read only. Conciliação administrativa real continua não executada. Limpeza sem prova durável poderia permitir replay. Estado fora do código/mounts precisa de inventário final. Ensaios internos não comprovam restauração do banco ou do tráfego publicado.

## Candidata posterior de orçamento
Imagem 8bcc99d / digest 3f28b9ee… substitui a candidata anterior para novos ensaios; nenhuma imagem foi promovida. Rebuild e candidata nova→referência 01fe904→candidata nova executados. Imagens anteriores preservadas. Seleção dos alvos do script é limitada a URLs internas explícitas. A reversão de produção segue condicionada ao procedimento de conciliação já descrito.

## Adendo de 25/10/2026
Imagem candidata 25bb6c1: mba-runtime-v2-release:linked-creation, digest 726fbb1591fe505f8c8ae41c61151f4e65e98f35b0c4ed95978b55cfee7f05c9. Rebuild idêntico; helper aceita explicitamente runtime-v2-image-linked-creation. Ensaio candidato/referência/candidato incluiu save e upload. A referência perde a correção de classificação atômica e continua rejeitando process_cnj; rollback não corrige esses defeitos. Nenhum DDL de produção foi necessário para esses dois ajustes.

## Atomicidade de Encerramentos — 25/10/2026
Nova flag RUNTIME_V2_CLOSING_ATOMIC deve ficar 0 antes de voltar à aplicação anterior ou remover a função. Drenar e conciliar recibos processing/uncertain primeiro. A migração 20261025233600 é aditiva, sem alteração destrutiva de dados; preferir mantê-la no rollback. Se for necessário retirar, após todos os consumidores estarem desligados: DROP FUNCTION public.runtime_v2_save_closing(text,uuid,uuid,jsonb,jsonb,text,date,boolean). Isso não desfaz análises salvas e restaura o risco conhecido de escrita parcial do caminho antigo. Nada foi executado em produção.
