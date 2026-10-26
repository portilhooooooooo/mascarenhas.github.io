# Incorporação do Runtime V2 na main

Integração solicitada expressamente pelo usuário após a revisão do candidato. Isso incorpora código; não transforma medições sintéticas em validação autenticada publicada.

## Frontend
Base main f0851b3; candidato release/runtime-v2-20261024/4149b4d. A árvore inicial de merge era idêntica ao candidato aprovado. Foi acrescentada negociação de suporte: Idempotency-Key só é enviado quando /api/me declara runtime_features.write_intents=true. Isso mantém salvamentos compatíveis com o backend antigo e seu CORS enquanto o novo backend não foi implantado.
Cinco testes de cliente passaram; três jornadas afetadas passaram em Chromium e Firefox. Build passou. Sem alteração de layout.

## Backend
Base main 89003b5. Aplicado apenas o delta de 01fe904 → candidato 4802c0a; não foi feito merge cego das diferenças da captura efetiva. Preservados workers, Base Geral, dependências, TaskService e UploadService já presentes na main.
Quatro conflitos reconciliados. Mantidos os guards de carteira e tasks.execute_others da main, inclusive antes do replay de recibo. Mantida a sincronização consolidada de Encerramentos também no caminho atômico.
Adicionado services/productivity_overview.py como dependência do novo endpoint. Não existem imports internos sem arquivo correspondente no inventário AST.

TaskService e classificação inicial de Liminar têm regras diferentes entre main e o runtime capturado. Nesta integração, suas versões da main foram preservadas, sem substituir pelas versões capturadas. As verificações de contrato da integração usam explicitamente a referência main 89003b5 nesses dois casos; os testes/evidências anteriores da branch de migração permanecem no histórico.

## Verificação proporcional à mudança
- Primeira seleção backend: 43 casos passaram; dois falharam. Uma falha era referência de contrato apontando para a captura em vez da main; a outra era arquivo de migração ausente na cópia do harness. Ajustados alvo/harness, três casos afetados passaram (inclui a regra original de Liminar).
- Dois testes adicionais da declaração de suporte a write intents passaram.
- Cinco testes de cliente frontend passaram; a primeira fixture VM não expunha TextEncoder, corrigido no harness.
- Três jornadas frontend em cada browser: API antiga sem cabeçalho incompatível; intenção de skip; intenção de análise. Todas passaram, sem erro JS/console.
Nenhuma carga, login, escrita funcional ou migração SQL foi executada em produção para realizar essa incorporação.

## Publicação e limites
A main do frontend possui workflows que publicam automaticamente no Cloudflare; seus resultados precisam ser acompanhados. O backend não tem deploy automático identificado nos workflows e o container vivo não foi editado/reiniciado. As nove migrações e flags estão incorporadas no repositório, sem aplicação manual de DDL.
A imagem 40d77ab e seus benchmarks continuam sendo evidências do candidato isolado; não são uma imagem ou benchmark do novo código integrado da main.
Os gates reais de autorização, integrações, indicadores, infraestrutura e monitoramento continuam descritos em RELEASE_REVIEW.md. A ordem de incorporação na main não foi apresentada como conclusão dessas validações.
