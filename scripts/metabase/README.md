# Gestão Processual — Metabase

A Gestão Processual não calcula nem renderiza indicadores no React. O frontend só hospeda o embed autenticado do Metabase; a definição analítica fica versionada neste diretório.

`rebuild_gestao_processual.py` usa o schema atual das tabelas `processos_carteira`, `acordos_carteira` e `pagamentos`. O dashboard possui três abas: **Carteira Processual**, **Acordos** e **Pagamentos**. Cada aba termina com a base tabular, permitindo exportação pelo próprio Metabase.

Por segurança, a execução padrão apenas imprime o plano. Para criar um novo dashboard em um ambiente autorizado, defina `MB_URL`, `MB_SESSION` e, se necessário, `MB_DATABASE_ID`, e execute `python3 scripts/metabase/rebuild_gestao_processual.py --apply`.

O script é create-only: não sobrescreve dashboard existente. A promoção para produção exige apontar `METABASE_DASHBOARD_ID` do backend para o novo dashboard após validação.
