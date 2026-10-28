# Paridade de vídeo do login com a main (dev/tasks-workspace)

Escopo: exclusivamente mídia e geometria do painel direito do login. Preservados copy, autenticação Microsoft, loading, tema e demais componentes da branch de testes.

- Assets `assets/mascarenhas-login.mp4` e `assets/mascarenhas-login-poster.jpg` restaurados **byte a byte** de `origin/main` em 28/10/2026. IDs de objeto Git: vídeo `a7685a4fab2815b7adcbc814b4f1c83c8937f4eb`, poster `ac666078dcbd2e98e9a4d6e935c1c31562201fac`.
- `react-login-visual`: `aspect-ratio:7/5`, `align-self:center`, `min-width:0`, raio de 22px; vídeo `object-fit:cover`, `object-position:34% center`, sem filtro CSS adicional. Sobreposição de gradiente igual à main.
- Parâmetros de cache iguais à main (`v=20261027-3b74ad84`) para vídeo e poster.
- Sem reintroduzir slogan, legendas ou textos sobrepostos no vídeo; pedido anterior do usuário preservado.

Testes: build TypeScript/Vite/estático aprovado; SHA-256 dos assets do `dist` corresponde ao arquivo de origem; 3 testes de contrato passaram; Playwright Chromium com reprodução real, readyState=4, 910×512 de resolução intrínseca e proporção do painel 1,4 em 1024px/1440px/1600px. Captura em 1440×900 criada com a UI real e autorização de teste bloqueada; a camada de loading foi ocultada apenas no navegador de captura (não no código).
