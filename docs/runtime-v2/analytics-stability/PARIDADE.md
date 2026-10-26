# Paridade e cobertura

| Área | Comparação executada | Resultado |
|---|---|---|
| Análises sintéticas | 288 combinações, duas carteiras, tipo/concordância/busca/offset | Igualdade exata do JSON com Python congelado |
| Análises reais desidentificadas | 100 registros Regular, 24 combinações | Igualdade exata no conjunto reduzido |
| Base Geral | 56 combinações de resumo/lista/categorias/página | Igualdade exata com definições efetivas anteriores |
| Base Geral, bordas | 208 combinações de cutoff/datas/fontes/filtros/busca/página completa | Igualdade exata |
| Aging/Benner | Testes existentes de coorte, reconciliação e mês anterior | Passaram na bateria de 35 casos |
| Acurácia originária | Testes existentes + referência congelada | Denominador anterior preservado |
| ACL | anon/authenticated sem EXECUTE; service_role executa análises no stage | Passou |
| Exportação | Contrato SQL de listagem completa e testes API existentes | Passou nesse nível; XLSX/CSV real da candidata não executado |

São 576 comparações de paridade, não 576 testes pytest. Os 288 casos sintéticos incluem JSON inválido, JSON não objeto, classificador ausente/vazio e concordância não booleana. A amostra real é limitada aos últimos 45 dias, no máximo 100 por carteira; retornou somente Regular. Não alegar cobertura real de Enter, Nubank ou de toda a população.

Amostra removeu identificadores e textos livres, mapeou classificações fora da whitelist para UNKNOWN e preservou presença/truthiness do classificador. Prova agregados/regras desse conjunto reduzido; não prova equivalência de todo payload textual real.

Análises: o caminho anterior interrompia acima de 10 mil registros; o SQL agrega o coorte completo e entrega apenas a página solicitada. Não houve truncamento silencioso. Empates de data agora têm desempate explícito por id, mantendo ordem estável. Cenários com empates indistinguíveis no código antigo podem ter ordem diferente, sem alteração do conjunto/total.

Base Geral usa a mesma resolução de fontes; nenhum indicador jurídico, aptidão, mediana ou classificação foi redefinido. Não foram reprocessados processos em produção.
