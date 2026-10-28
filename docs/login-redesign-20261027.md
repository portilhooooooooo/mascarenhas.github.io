# Redesign do login — 27/10/2026

Implementação da direção visual aprovada na branch de testes.

- Login: título fixo "Acesse o Backoffice.", sem subtítulo; opção "Continuar com a Microsoft"; separador OU; e-mail corporativo com continuidade pelo SSO Microsoft já existente. Nenhum novo mecanismo de login foi introduzido.
- Vídeo: preservados os arquivos originais de MP4 e poster, overlay institucional sobre o vídeo: "MASCARENHAS BARBOSA · DESDE 1968" e "Transformando ideias em produção."
- Tela transitória: cobertura integral independente do formulário/vídeo; Canvas 2D com pontos, linhas visuais implícitas e números abstratos, paleta cobre/cinza, até 30 fps, resolução limitada, pausa em aba oculta, respeita movimento reduzido e libera recursos no unmount.
- OAuth Microsoft: após retorno **válido** e conclusão do perfil em `/api/me`, a camada visual permanece por **5.000 ms mínimos**. Fluxos de erro não recebem atraso e retornam a estados de erro existentes. F5 de sessão já autenticada não recebe o atraso.
- A tela oculta a aplicação protegida no estado `mba-auth-transition-hold`. Nenhum novo token ou permissão é criado e o exchange OAuth existente não foi alterado.
- Telemetria: `visualHoldMs` separado de `ms` da validação, evitando interpretar o atraso intencional como lentidão da API.

## Testes

- Build Vite + TypeScript: aprovado.
- 5 testes de contrato do login: aprovados.
- Regressões `session-race` e `frontend-stability`: aprovadas.
- Chromium Playwright, preview local sem API de produção: desktop (1440 × 900), mobile (390 × 844), slogan, vídeo, acesso Microsoft, acesso via e-mail, overlay cobrindo viewport, recuperação de erro, nenhum erro de JavaScript.
- Chromium com OAuth e perfil **simulados**: tempo após autenticação até liberação da interface **5.031 ms**, shell protegido oculto durante a espera e liberado ao final. Sem credenciais reais.

## Publicação

Implementar na branch `dev/tasks-workspace` e manter `main`/produção inalteradas até a validação final. O preview de UI isolado não é automaticamente atualizado.
