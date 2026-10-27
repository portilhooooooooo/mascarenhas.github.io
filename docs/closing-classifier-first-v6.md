# Encerramentos Q&A — Conferência da classificação prévia (v6)

## Sequência

1. O primeiro painel apresenta: `Identificamos que esse processo se enquadra como {Tipo} por {Motivo}. Você concorda com a afirmação acima?` (teclas `1 Sim`, `2 Não`). Quando a origem não tem motivo, não é permitido inventar um: o texto informa a lacuna.
2. **Sim**: formulário envia somente `{workflow_version:6,confirmation:'sim'}`. O servidor verifica a classificação original persistida no processo, registra a concordância e marca **necessita_validacao**; não concede aptidão nem gera envio ao Benner por falta de prova jurídica das etapas obrigatórias.
3. **Não**: perguntar `Em qual ponto você discorda?` com opções Sentença, Acórdão, Recurso / prazo, Trânsito, Execução / pagamento, Custas, Classificação sugerida e Outro. A opção Outro requer descrição.
4. Após o motivo da divergência, apresentar o questionário jurídico atual completo (v5), com prefill conservador; produzir nova classificação a partir das respostas. `classification_agreed:false` e `classification_disagreement_reason` estruturado são auditados pelo servidor, que encaminha para revisão e não envia ao Benner automaticamente.
5. Quando a classificação prévia não existe ou não é conclusiva, oferecer `Iniciar análise` e o questionário jurídico normal. Nenhum Sim automático.
6. A confirmação inicial usa a chave de rascunho `closing.priorClassificationAgreed`, evitando reaproveitar a concordância FINAL persistida em versões anteriores.

## Dados

A classificação vem dos campos por processo já existentes (`indicio` / `source_metadata.classifier_classification` etc.). O motivo vem de `review_reason`, `classifier_reason`, `classification_reason` ou `reason` da tarefa, quando disponível. Nenhuma inferência é tratada como motivo confirmado.

## Deploy

As branches frontend e backend devem ser publicadas coordenadamente. O endpoint de salvamento em produção só aceita v5 até a implantação do backend v6. **Não publicar frontend isoladamente.**
