# Matriz de compatibilidade: frontend x DataContract V4 (encerramentos e fase)

Base: frontend em dev/thomworkspace (aed7e5d); DataContract conforme relato do Harris (classificador 9cab7e5, DDL P1-P4). JSON do card HTTP, estado "não publicado" e portfolio_id por linha seguem em aberto (#57).
Fixtures sintéticas: tests/fixtures/closing-v4/. Teste: tests/closing-v4-fixtures.test.mjs.

## Encerramentos (/api/operacao/encerramentos/items)

| Frontend lê | Uso na tela | Ausente/null | DataContract V4 | Compatibilidade |
|---|---|---|---|---|
| datajud_tipo (string livre) | coluna Indício, exibido cru; filtro indicio | "Não classificado" | sentence_outcome / appeal_outcome (anuláveis, sem enum no DDL): VITORIA, DERROTA, ACORDO, EXTINCAO, INDETERMINADO (+ DERROTA_VOLUNTARIA no encerramento) | Compatível se a API entregar caixa alta sem acento e escolher qual dos dois outcomes alimenta datajud_tipo. Falta definir |
| datajud_indicio_apto (bool/null) | "favorável/desfavorável/sem indício" | "Sem indício" | sem campo equivalente informado | Lacuna |
| fase_recursal (bool/null) | "Em fase recursal · sem acórdão" | tratado como não recursal | judicial_phase: CONHECIMENTO, RECURSAL, EXECUCAO, ENCERRADO; final_judgment_on anulável | Mapear: RECURSAL=true, demais=false, null/ausente=null. Frontend perde EXECUCAO/ENCERRADO |
| validacao_decisao (apto/nao_apto/null) | rótulo de status | "Pendente de análise" | validation_state: pending, validated, rejected, undetermined | Mapear: validated=apto, rejected=nao_apto, pending/undetermined=null; undetermined hoje cai em "Pendente de análise" (confunde com pending) |
| tipo_validado | elegibilidade de envio Benner (DERROTA, DERROTA_VOLUNTARIA, VITORIA) | inelegível | derivado da classificação de encerramento | ACORDO/EXTINCAO/INDETERMINADO nunca elegíveis: correto |
| portfolio_id | chave da linha | chave duplicada se vazio | em aberto (#57) | Lacuna de isolamento |

## Enum, ausência, indeterminado

| Situação | Representação | Risco |
|---|---|---|
| Classificado | um dos 6 valores, caixa alta | grafia diferente aparece crua e não casa com o filtro |
| Indeterminado | "INDETERMINADO" | painel DataJud V3 mostra null como "Indeterminado"; Encerramentos mostra null como "Não classificado" |
| Ausente | null | nunca string vazia |
| Não publicado | indefinido para linhas | em aberto (#57) |

## Fase (Andamentos)

Card: {value, status|data_status, source, limitations}, com portfolio_id no corpo. CURRENT=certificado; valor com outro status=não certificado; value null=traço; STALE rebaixa. Divergência: a página de cards usa TRANSITO_EM_JULGADO_VITORIA/_DERROTA, e o teste do Read Model espera transito_em_julgado_extincao/improcedente/procedente. O DataContract precisa declarar o vocabulário canônico. O trânsito vem de final_judgment_on (data), não de enum.

## Isolamento

Andamentos descarta resposta de outra carteira. Encerramentos não valida portfolio_id do corpo/linhas, e EncerramentosPage.tsx:187 monta linhas com portfolio_id vazio. Correção no frontend aguarda o portfolio_id do backend e ok do Gabriel.

## Pedidos ao backend

1. Enum fechado de resultado e qual campo alimenta datajud_tipo.
2. Indicar de onde vem o indício apto.
3. portfolio_id no corpo e nas linhas.
4. Estado "não publicado" distinto de zero e de null.
5. Vocabulário canônico dos KIND de Andamentos.
