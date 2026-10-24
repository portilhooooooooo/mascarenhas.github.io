# Paridade dos indicadores

Não foram alteradas funções SQL, critérios de vitória/DV, coortes, política de carteira, papéis, mediana/média, limiar de medição ou regra de aging. A Produtividade continua exibindo o payload autoritativo; dados de filtro anterior não são reapresentados sob um filtro novo. O resumo persistido copia somente completed/today_completed e os mesmos contadores de pessoas/cobertura que a tela anterior calculava. Erro de contrato não é convertido em zero.

Os testes de backend de produtividade, escopo de papel, Base Geral e acurácia originária passaram no conjunto de 59 testes, incluindo três casos novos para paginação mutável. Nenhum novo agregado SQL foi implementado/promovido.

Foi executado replay offline de uma amostra real desidentificada: 139 eventos, 21 tarefas e 13 perfis de Enter, Regular e Nubank, capturados em 2026-10-24T03:03:33.959577Z. Foram selecionados até oito pares usuário/processo por carteira e estrato de presença de etapas/conclusões, com todos os seus eventos no recorte de 180 dias. Não houve truncamento do recorte selecionado (139/139). Não contém documentos, e-mails, notas ou números processuais; nomes e IDs foram substituídos e stages preservam equivalência por hash.

O script scripts/runtime_v2_parity.py compara o fonte efetivo do container (SHA-256 6f9f8c73504b42f3d970de2084ac025cab93edca2aa563cc60d9bf4b0b584abe) à branch, com relógio fixo, cinco períodos, cinco filtros de prazo, cinco faixas de duração e três papéis nas três carteiras: 1.125 combinações. Não houve divergência nos campos numéricos compartilhados, incluindo contagens, médias, medianas e cobertura. Foram explicitamente excluídos da comparação o texto de methodology e o campo aditivo timing_by_type, ausente no fonte efetivo; essas diferenças de contrato já existiam e permanecem registradas. Referência, fixture, hashes e resultados completos estão na branch privada backend.

B01 e A16 permanecem NÃO EXECUTADOS em sua definição completa: o replay não executa HTTP/PostgREST/RLS, pendências, novos agregados SQL, base completa, coortes de Encerramentos ou exportações XLSX/CSV. A ordem de empates temporais do runtime não está certificada. Uma amostra sem divergência não certifica a base inteira. Os testes de browser verificam números sintéticos conhecidos apenas para observar cache/escopo/estado visual.

Resultado: nenhuma alteração de regra de negócio foi intencionalmente introduzida; paridade integral NÃO CERTIFICADA. Este item impede promoção.
