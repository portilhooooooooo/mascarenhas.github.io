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
Paridade sobre dados desidentificados não equivale a login real, RLS de um colaborador publicado ou validação end-to-end de todas as telas. XLSX de Produtividade recebeu três testes de células/formatação e conferência pelo HTTP real. Indicadores e exportações de todas as outras áreas não receberam certificação integral. Integração publicada e Nubank com amostra representativa permanecem pendentes.

## Escritas adicionais
Encerramentos, Defesa, três cenários Pagamentos v2 e decisões finais de Liminares foram gravados pelo SDK/PostgREST e funções/triggers efetivos. Foram verificados decisão/resposta, carteira e evento único após concorrência/replay. Isso é integridade de escrita em fixture sintética; não amplia a representatividade do corpus analítico nem certifica os dashboards das demais áreas.

A seleção ampliada de 14 arquivos de domínio foi executada contra a candidata e a referência efetiva 01fe904: mesmos 97 testes e 90 subtests passaram e mesmos sete falharam. Cinco arquivos de regras têm SHA-256 idêntico. A paridade de resultado dessa seleção não transforma as falhas em sucesso e não certifica integrações externas. Pagamentos legado recebeu seis cenários HTTP/SQL adicionais, com uma análise/evento por recurso.

## Adendo de 25/10/2026
Checkpoint 25/10: classificações CSV/XLSX preservadas em RPC atômica; somente duas falhas de domínio mudaram de FALHOU para PASSOU. Os demais 102 registros de teste de domínio mantiveram o mesmo resultado. O conjunto atual de 104 tem 99 PASSOU e cinco FALHOU; 90 subtests PASSOU. Criação vinculada não altera indicadores nem critérios. Paridade analítica de todas as áreas segue pendente.

## Atomicidade de Encerramentos — 25/10/2026
Nova matriz HTTP de Encerramentos: 18 combinações Admin/Legal Leader/Analista × Enter/Regular/Nubank × conclusão/adiamento, com mesma classificação, prazo de reabertura e um evento após replay. Paridade de dados analíticos de outras áreas continua pendente. Correção de mock de módulo inexistente permite executar os asserts originais do adiamento; não é mudança de regra de negócio.

## Fechamento — 25/10/2026
Checkpoint final: nova intenção legítima de skip continua movendo a fila; apenas o replay da MESMA intenção deixa de duplicar posição/evento. Contagens/classificações dos uploads recuperados conferidas. Nenhuma alteração de regras de aptidão, medianas, período/coorte ou permissões foi introduzida. Quatro divergências de domínio e paridade analítica integral permanecem abertas.
