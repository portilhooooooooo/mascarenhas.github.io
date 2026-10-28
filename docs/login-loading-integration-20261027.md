# Loading do Backoffice — animação de dados

A experiência de Sol/Lua e vídeo sem legenda da branch de prévia foi preservada. A camada de carregamento é independente e ocupa a viewport inteira, com fundo `#141414`, Canvas 2D de pontos/números abstratos e a única mensagem `Preparando seu espaço.`.

- O clique de login aciona a camada visual sem criar um método de autenticação novo.
- O retorno OAuth válido mantém a animação por pelo menos 5.000ms **após a confirmação de perfil/sessão**. A aplicação protegida permanece oculta durante esse intervalo. Erros não têm espera artificial.
- O F5 com sessão pré-existente não sofre atraso de 5 segundos.
- A animação limita a taxa de quadros a 30 FPS, o device pixel ratio a 2, pausa em aba oculta e respeita `prefers-reduced-motion`.
- A metrificação `visualHoldMs` é separada da latência de API.
- Não foram feitas mudanças em endpoints, regras de autenticação ou permissões.

## Evidências locais (fixtures sintéticas)

- Chromium desktop 1440×900 e mobile 390×844: cobertura integral, texto único, Canvas visível, erro volta ao login e zero exceções JavaScript.
- Retorno Microsoft simulado: cobertura protegeu o shell até a autenticação concluir; retenção após confirmação medida em 5.029ms.
- F5 com sessão previamente autenticada: 862ms de carregamento, sem espera artificial.
- TypeScript e Vite build aprovados, com quatro testes de contrato.

Capturas: `docs/screenshots/login-loading-dados-1440-20261027.webp` e `docs/screenshots/login-loading-dados-390-20261027.webp`.

Publicação somente na branch de prévia. A `main` permanece inalterada.
