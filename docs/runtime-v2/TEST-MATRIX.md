# Matriz de testes

IDs e critérios seguem integralmente o mandato do produto. Evidência executável: tests/runtime-v2/browser.mjs; resultados reais por ID em evidence/*/metrics.json. Nenhum assert textual equivale a browser ou integração.

A01 identidade; A02 módulos; A03 subabas; A04 refresh 15 s; A05 filtro 15 s; A06 F5; A07 storage; A08 bootstrap; A09 revogação; A10 abas; A11 corrida; A12 matriz; A13 dashboard; A14 ocultos; A15 rascunhos; A16 integridade; A17 falhas; A18 memória; A19 visual/acessibilidade; A20 perda de escopo.

B01 paridade real; B02 paginação; B03 tracing; B04 carga 30+10; B05 concorrência/idempotência; B06 rebuild/rollback. Sem resultado registrado = NÃO EXECUTADO. Fixtures não validam permissões backend nem regras SQL.
