# Paridade dos indicadores
## Evidência executada
PostgreSQL 17.11 descartável, contra o Python efetivo capturado do runtime; produção é PostgreSQL 17.6/PostgREST 14.5. A captura foi somente leitura, com chave de corte temporal fixa e paginação limitada.

| Amostra | Eventos | Cobertura |
|---|---:|---|
| Inicial desidentificada | 139 | Três carteiras |
| Empates e limites desidentificados | 13 | Ordenação e arredondamento |
| Corpus ampliado | 19.367 | 180 dias; 32 tarefas; 21 perfis |
O corpus ampliado contém 12.159 eventos Regular, 7.207 Enter e apenas 1 Nubank. Não há suporte para afirmar representatividade estatística de Nubank. Não foram copiados documentos, CNJs, emails, notas ou identificadores originais. Metadados têm whitelist; manifesto e SHA-256 estão no backend privado.

A suíte SQL executou 30 testes em 709,98 s: PASSOU. Foram comparadas 2.625 combinações do contrato legado e 2.400 do contrato novo de resumo, totalizando 5.025 combinações, além de testes de borda e permissões.

O contrato legado preserva seus critérios de transição, duplicatas, contagens diárias, limite humano de 0,25 a 1.800 s e cálculo existente de médias e medianas. O contrato de overview possui semântica distinta e foi comparado separadamente: primeiro índice zero até conclusão, lookback de 30 minutos, eventos humanos, aptidão somente nos tipos existentes e mediana exata com round de Python. Não foi trocada mediana por média.

## Paginação e exportação
Detalhe compara total, ordenação determinística e páginas ao modelo anterior. Exportação CSV preserva as células e apresenta erro explícito no limite, sem truncamento silencioso. RPCs não são executáveis por anon/authenticated. Autorização de carteira e equipe ocorre antes da agregação. A fila pendente real não foi exportada: seus casos de atribuição, ausência de responsável e datas têm fixture sintética separada.

## Limites
Paridade sobre dados desidentificados não equivale a login real, RLS de um colaborador publicado ou validação end-to-end de todas as telas. XLSX e todos os fluxos de outras áreas não receberam certificação de paridade completa nesta fase. Integração publicada e Nubank com amostra representativa permanecem pendentes.
