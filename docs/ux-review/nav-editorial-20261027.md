# Navegação editorial (dev/tasks-workspace)

## Escopo

- Marca: símbolo Mascarenhas original e Backoffice em Georgia 17px, como no login.
- Navegação: Instrument Sans 13px (500 normal / 600 selecionado), mantendo dados, tabelas e perguntas em Inter.
- Sidebar flutuante 20px, navbar superior 16px; geometria do cartão de Carteiras nos itens da barra (40px / raio 7px), fundo apenas no ativo, sem contorno em todos.
- Ordem principal: Processos, Resultados, Tarefas, Automações, Operação. A autorização pré-existente de Operação foi preservada, sem fazer promessa de nova restrição.
- Usuários acima de Sair como botão real, visível somente com `users.view`/policy; Carteiras usa o componente original.
- Sol/Lua permanece na navbar superior com o botão original de um clique; não existe seletor duplicado na sidebar.
- Operação utiliza `createPortal` para renderizar as suas abas reais no topo, mantendo handlers e estado. O observer remove as abas ao alternar para outros módulos.
- Fonte Instrument Sans carregada por Google Fonts CSS; fallback Inter em ambientes offline. Nenhum arquivo de fonte armazenado no repositório.

## Testes

- `npm run build` (TypeScript + Vite + build-static) passou e o CSS está incluído no dist com bust de cache.
- Testes focados (navegação, marca, temas e unificação de UI): 15/15 aprovados.
- Chromium: desktop 1440 e mobile 390, Sol e Lua, sem overflow horizontal.
- Desktop: marca Georgia 17; Instrument Sans 13 carregada; cards de navegação 40px com gaps 4px; tabs da Operação existentes e funcionais.
- Clique real do tema alternou Sol/Lua em ambos os cenários. Usuários navegou para a seção autorizada. Tabs saíram do topo ao abandonar Operação.
- O teste legado `brand-priorities.test.mjs` contém falha de ordenação **pré-existente**, reproduzida na branch anterior, não modificada neste trabalho.
- Capturas usam uma sessão sintética local sem consultar endpoints, credenciais ou processos reais.

## Publicação

Somente branch `dev/tasks-workspace`, sem alterações na `main` nem publicação de produção explicitamente solicitada.
