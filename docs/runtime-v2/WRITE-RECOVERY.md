# Recuperação de gravações e retenção dos recibos

## Política desta versão
O journal permanece no servidor e todos os recibos são retidos, sem TTL ou limpeza automática. Processing e uncertain nunca expiram por tempo. Completed também não é apagado: remover a prova de idempotência pode permitir reenvio. Qualquer futura compactação precisa preservar a chave e a prova de conclusão, ter migração versionada e testes de replay. Esta versão não executa essa compactação.

Não armazenar payload, resposta, token ou identificador judicial no navegador para resolver uma operação. O cliente guarda somente identificador não secreto da intenção e fingerprint. O resultado autoritativo fica no servidor, sujeito à autorização.

## Inventário somente leitura
Operador de banco com acesso autorizado usa uma credencial dedicada de leitura, fornecida por variável de ambiente, nunca como argumento ou em logs:

```sh
PYTHONPATH=. python scripts/runtime_v2_write_audit.py --limit 1000
```

RUNTIME_V2_AUDIT_DSN deve estar configurada pelo mecanismo de segredos do ambiente. O comando inicia transação read only, limita a consulta a 2 segundos e examina até 1.001 recibos ativos. Saída agrega carteira/estado/idade e presença de conclusão; não contém usuário, processo, chave, fingerprint ou outcome. truncated=true exige investigação adicional: não interpretar a amostra como inventário completo. Erro de banco é erro explícito, nunca contagem zero.

Um evento de conclusão é somente um indício. Pode pertencer a outro comando ou anteceder falha de efeitos posteriores; não autoriza marcar o recibo como concluído automaticamente. O comando não altera recibos e não contém modo de liberação.

## Conciliação
1. Bloquear novo envio do recurso afetado; preservar recibo, journal, versão, request_id e trilha de auditoria. Não criar nova chave para contornar processing/uncertain.
2. Um operador autorizado consulta o recurso pelo fluxo protegido e compara tarefa/carteira/analista, análise persistida, status, metadados e eventos com a intenção original. Não copiar conteúdo judicial para logs.
3. Se a cadeia completa não puder ser comprovada, manter o bloqueio. Se houver escrita parcial, abrir correção rastreável específica; não repetir a sequência inteira nem aplicar SQL genérica que supõe sucesso.
4. Se todos os efeitos forem comprovados, preparar reconciliação específica com resultado original verificável, identificação do recibo e auditoria do operador. Revisão independente deve conferir evidência e escopo antes de qualquer transição administrativa. Não existe endpoint público de force-complete/reset nesta versão.
5. Se houver prova de ausência de qualquer efeito e de que a execução anterior terminou, preparar liberação específica e auditada. Ausência momentânea de linha, timeout, cancelamento de fetch ou idade não são essa prova.

O procedimento seguro pode manter a operação indisponível enquanto a incerteza persistir. Isso preserva a regra de não duplicar gravação, em vez de inventar conclusão.

## Rollback e gates
Antes de voltar a código sem recibos, suspender novas gravações finais e conciliar todos os ativos; não apagar o journal. O ensaio controlado de rollback usa comandos novos e concluídos, não demonstra reconciliação de uma escrita parcial publicada.

Testes HTTP executados verificam ACK perdido com replay único, resultado incerto bloqueando outra chave, recusa de replay após revogação/carteira incorreta e auditoria incapaz de DELETE. A implementação da ferramenta e esses testes são do stage. Conciliação administrativa de um incidente real e escala do journal em produção NÃO EXECUTADAS.
