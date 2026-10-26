# Paridade dos indicadores

## Revisão final do candidato — 25/10/2026, Campo Grande
**Parecer global: NO-GO para produção.** Build e rollback específicos da última imagem foram agora concluídos; o limite restante não é uma nova bateria de testes sintéticos. Aplicação backend 40d77ab; frontend 99ec81d; imagem sha256:528d196b02881621ca41f692ef36532f69a44dd23f88d53b3a1dd8334bfd222f.

- Rebuild do MESMO commit produziu exatamente o mesmo digest.
- Ensaio final candidata → referência efetiva 01fe904 → candidata passou em nove etapas: três gravações de Encerramentos, três uploads e três comandos de pular. Contagens/eventos únicos conferidos; replay de skip também conferido na candidata antes/depois. O código antigo continua tendo a limitação de replay já documentada; não foi declarado idempotente.
- Quatro verificações focadas compararam os contratos contestados com código capturado, preservado e conferido por hash também nos arquivos do container publicado. Todas passaram em 0,38 s. Defesa e Liminar continuam com arquivos idênticos à referência; a criação genérica mantém o mesmo resultado antes/depois.
- As quatro expectativas históricas que falham NÃO foram modificadas, apagadas, puladas ou marcadas como PASSOU. A nova evidência mostra que são divergências com o baseline preservado, não mudanças introduzidas pela migração. Qualquer alteração dessas regras é decisão de produto separada.
- Nenhum novo teste de carga ou rodada ampla foi realizado. Não houve autenticação do agente nem alteração de produção.

| Caso contestado | Comportamento efetivo preservado |
|---|---|
| Criação genérica sem responsável | A tarefa pode ser criada sem atribuição; o caminho vinculado por Processos continua exigindo responsável. O teste de paridade valida a criação genérica, não certifica todo o fluxo de importação. |
| Fatal de tribunal em 07/10 versus Enter em 05/10 | Guardrail vigente de cinco dias úteis conserva a data operacional de 05/10, mantendo a data do tribunal na evidência. |
| Audiência em 11/10, sem fatal manual | Regra vigente deriva 10/10, um dia antes da audiência. |
| Liminar com evidência inicial insuficiente | Concordância automática é recusada; respostas humanas completas permitem classificar sem_decisao e monitorar. |

A referência de fonte é 01fe904, não a suposição de que main seja o runtime. Conferir arquivos no container é evidência de fonte em disco, não inspeção de cada objeto Python já carregado. Os testes usam somente dados sintéticos. A comparação de paridade não dá aprovação para mudar regras nem encerra a revisão das expectativas históricas.

**Dependências para ir até produção:** validação autenticada legítima pelo launcher .bat/local.portilhobackoffice.site ou main; cobertura operacional e indicadores ainda não certificados; correlação real dos timeouts/pool; revisão técnica/promoção e monitoramento de duas horas. O agente não dispõe de conta autorizada e não contornou o login. Não há trabalho em background prometido para suprir essas dependências.

Evidências: contract-baseline.log/xml, release-review-execution.json, skip-final-rebuild.log e final-rollback.json no manifesto privado. O documento RELEASE_REVIEW.md organiza os gates restantes e o procedimento de promoção. Os checkpoints antigos abaixo ficam como histórico e não substituem este estado atual.

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
