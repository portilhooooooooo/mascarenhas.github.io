# Migração, promoção e rollback

Estado: candidata isolada; nada desta alteração foi implantado nem aplicado ao banco de produção.

## Ordem de promoção proposta, ainda não executada

1. Conferir main/publicação novamente e reconciliar alterações posteriores.
2. Gate: CIs aprovados, paridade, revisão SQL, cadeia HTTP autenticada no ambiente autorizado e comparação com carteira real. Não usar login do agente.
3. Aplicar aditivamente, em transação, 20261026131535_analytics_stability_closing_analyses.sql e 20261026132034_analytics_stability_base_geral_indexed_lookup.sql. Não reaplicar indiscriminadamente todas as migrações históricas.
4. Publicar backend rastreável com as flags novas inicialmente desligadas; verificar CORS/Retry-After.
5. Ativar separadamente RUNTIME_V2_CLOSING_ANALYSES_SQL=1 e RUNTIME_V2_BASE_GERAL_SQL=1 após smoke/paridade. Sem fallback automático no erro que dobre a consulta pesada.
6. Publicar frontend da candidata somente após aprovação expressa; observar 429/503, downstream, latências por status, auth e gravações.
7. Definir rollback se surgirem divergências, isolamento incorreto, erro de leitura ou regressão crítica. Metas reais de 2 s e reentrada <100 ms continuam não certificadas.

Dependências: schema runtime_v2, round_tenth e acquire_analytics_slot já publicados. Postgre SQL UTF-8 com normalize; índices funcionais existentes de portfolio/CNJ devem coincidir com as expressões. Não foi adicionado índice novo.

## Reversão

Desligar apenas as duas flags novas restaura as RPCs antigas. Reverter frontend ao commit publicado 25d654c e backend ao artefato anterior e113eed/imagem ac23cc157170..., preservando variáveis/flags da Runtime V2 já publicada. O backend main documental bc139ff contém esse código-base, mas não deve ser confundido com um deploy executado.

Novas funções podem permanecer sem uso: são leituras aditivas. A remoção só deve ocorrer depois de todos os consumidores voltarem e após inventário de dependências. Não remover schema runtime_v2, helpers compartilhados, receipts ou tabelas operacionais. Não há dados a desfazer nem projeção nova a reconstruir.

CI criado para estas branches apenas testa; nenhum job de deploy. Não integrar em main antes da autorização: workflows antigos de main podem publicar automaticamente.
