# Dashboards — Metabase

Os indicadores do Backoffice ficam no Metabase. O frontend apenas hospeda embeds autenticados; SQL e estrutura dos painéis ficam versionados neste diretório.

## Gestão Processual

`rebuild_gestao_processual.py` usa `processos_carteira` e mantém a Gestão Processual focada na carteira: entradas, encerramentos, situação, aging, produto, UF e auditoria CPJ x Benner.

## Operação

`rebuild_operacao.py` cria o workspace operacional 100% Metabase com as abas **Jobs**, **Pagamentos**, **Timeline**, **DataJud**, **Acordos** e **Liminar**. O backend usa `METABASE_OPERACAO_DASHBOARD_ID` para o embed em `/api/operacao/metabase/embed`.

## Controladoria / Indicadores

`patch_controladoria_indicadores.py` preserva o dashboard atual e adiciona:

- **Protocolo**: total de minutos economizados somente em protocolos concluídos por automação, com `ERP_SUBMITTED` comprovado pelo worker. O baseline manual é 5 minutos por protocolo e o tempo real do worker é descontado.
- **Contestação**: Defesas recebidas, Análises pendentes, Aptos à defesa, Inaptos à defesa e distribuição de Prioridades (Urgente, Alta, Baixíssima).

A regra de prioridade é operacional: **Urgente** quando o prazo operacional venceu ou vence hoje; **Alta** quando ainda há prazo e a origem Enter marca prioridade Alta; **Baixíssima** para os demais pendentes.

## Aplicação

Por segurança, os scripts rodam em modo plano por padrão. Para aplicar em ambiente autorizado, defina `MB_URL`, `MB_SESSION` e, se necessário, `MB_DATABASE_ID`, e use `--apply`.

Os scripts `rebuild_*` são create-only. O patch de Controladoria altera somente o dashboard explicitamente configurado por `MB_CONTROLADORIA_DASHBOARD_ID` (fallback para `METABASE_PROTOCOLO_DASHBOARD_ID`). A promoção para produção exige validação do dashboard e atualização dos IDs do backend.
