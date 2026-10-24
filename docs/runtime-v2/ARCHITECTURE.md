# Responsabilidades

| Estado | Dono | Invalidação |
|---|---|---|
| Identidade/autorização | auth.js + backend | logout, revogação, perfil |
| Carteira | MBA_API + política | mudança de carteira |
| Rota/shell | History API + shell | navegação de documento |
| Filtros/seleção/rascunho | componente/store de UI | mudança real de escopo |
| Dados remotos | consulta por chave autorizada | TTL/mutação/escopo |

Antes: autenticação → grants temporariamente alterados → loaders; rota externa → execution → unmount; dashboard → barreira de quatro endpoints.

Depois pretendido: identidade → cópia de evento; rota → ativação explícita; subaba visitada → mesma instância; consulta → estado por chave; resumo/detalhe → atualização independente.

Nenhum snapshot local concede acesso. Browser abort não garante cancelamento SQL. Falha de analytics não pode consumir toda capacidade de auth/write. Implementação de isolamento exige benchmark e gate separado.
