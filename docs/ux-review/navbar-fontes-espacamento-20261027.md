# Revisão de espaçamento e tipografia da navegação (somente prévia)

Capturas do frontend React oficial `dev/tasks-workspace`, com tela real de Operação > Pagamentos; uma sessão local sintética autoriza a renderização do componente original de Carteiras. Nenhum endpoint ou dado real foi consultado. Mudanças aplicadas somente como CSS de pré-visualização no navegador.

## Inconsistências verificadas antes da alteração

- Sidebar: Inter 12px e peso 470, itens com 37px de altura, espaço vertical de 3px.
- Subnavegação Operação: Inter 12px, peso 500, com 650 no item ativo; 44px de altura e 24px entre itens.
- Usuários: Inter 12px/peso 470 e altura 37px.
- Sair: 12,5px/peso 500, altura 37px.
- Sol/Lua: 12px/peso 650, altura 40px; botão com estilo específico e fundo muito claro diferente da linguagem de seleção cobre.

## Proposta aplicada às capturas

- Fontes: Inter **12px, line-height 1,25 (15px)**, peso 500 normal ou 600 ativo, nas duas barras e em Usuários/Sair; o botão Sol/Lua é 600 para identificação do comando.
- Sidebar: altura uniforme **40px**, gap vertical **4px** e ícones **16px**; separação especial de Operação de **16px**, preservando hierarquia administrativa.
- Barra superior: altura do submódulo **44px**, espaçamento horizontal **22px**, fonte e pesos iguais aos da sidebar.
- Rodapé: Usuários e Sair usam 40px, com 4px entre os controles. Carteiras conserva o seletor React original e sua identificação, que por ser um controle utilitário usa fonte 11px (não é um item de navegação).
- Sol/Lua: um único botão original que alterna o tema. Fundo cobre-claro **#F1E4D9**, borda **#D9BCA9**, texto **#753E2A**, ícone **#9C573B**; cor idêntica nos modos Sol e Lua.
- Sidebar e navbar permanecem separadas e arredondadas (20px e 16px), com o símbolo original do Mascarenhas ao lado de Backoffice.

## Verificação de navegador

- Chromium 1440x900, capturas nos modos Sol e Lua.
- Cinco itens superiores de sidebar presentes, com altura 40px, fonte 12px e peso 500/600; distâncias entre Processos, Resultados, Tarefas e Automações medidas em **4px**.
- Cinco submódulos, todos 44px, Inter 12px e peso 500/600.
- Itens Usuários e Sair: 40px, Inter 12px, peso 500.
- O botão Sol/Lua mantém ícone/rótulo correspondente, muda o tema e tem fundo RGB (241, 228, 217) em ambos.
- Sem rolagem horizontal no desktop.

## Limites

Esta é uma proposta visual; **nenhuma alteração de código foi incorporada à `main` ou `dev/tasks-workspace`**. As permissões de Operação não foram alteradas. A prévia não confirma dados operacionais.
