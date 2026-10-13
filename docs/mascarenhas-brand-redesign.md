# Identidade visual — Mascarenhas Barbosa Backoffice

A branch aplica uma camada visual sobre a interface já existente, sem alterar autenticação, roteamento, autorização por carteira, APIs ou as respostas das tarefas.

## Padrão
- Sidebar grafite, sem riscos diagonais nem decoração intrusiva.
- Áreas operacionais off-white, painéis brancos e tipografia Inter; títulos editoriais discretos.
- Cobre apenas para navegação ativa, seleção e chamadas à ação.
- Cores de sucesso, erro e urgência continuam semânticas.
- Tarefas preserva o workspace original: fila à esquerda e fluxo Q&A à direita; scroll interno.
- Prioridade da tarefa/processo: Alta `high`, Média `medium`, Baixa `low`. Valores legados são normalizados apenas para exibição e filtro; payloads continuam compatíveis com backend.

## Vídeo de fachada
A versão reduzida do vídeo fornecido foi preparada com início no sobrevoo do edifício, excluindo o trecho inicial da cidade. A mídia **não está incluída no GitHub** até ser publicada separadamente.

Para ativar o vídeo na tela de login nesta branch:
1. Enviar o arquivo otimizado para `assets/mascarenhas-login.mp4`.
2. Enviar o quadro para `assets/mascarenhas-login-poster.jpg`.
3. Fazer o build normalmente: `npm ci && npm run build`.

O `build-static.mjs` copia os arquivos e injeta a configuração do vídeo **somente quando o MP4 está presente**. Caso contrário, a tela usa o fallback institucional. A reprodução será automática, sem áudio e em loop. Nada é baixado no workspace de Tarefas.

## Autenticação
Os botões e o campo de e-mail reproduzem a linguagem visual solicitada. O OAuth Microsoft permanece funcional como já estava. O botão Google é explicitamente desabilitado porque **não existe integração OAuth Google no servidor**. O campo de e-mail encaminha para o fluxo Microsoft, não constitui autenticação por senha.

## Validação
A branch foi adicionada ao workflow `React Tasks Migration Check` para verificar hardening, escopo da execução, arquitetura do Metabase, testes de prioridade e build.


## Reimaginado v2 — referência das plataformas de IA

A camada final `design-system-v2.css` consolida a identidade: Sol neutro (#F4F5F3) e Lua grafite (#171A1B), acentos laranja/cobre, tipografia operacional Inter, densidade de tarefas e foco claro. Ela é intencionalmente carregada depois de `brand-identity.css` e `brand-themes.css`; não modifica contratos de API, login, autorização, backend nem a lógica jurídica de Q&A.

Em Tarefas, a fila e o workspace continuam lado a lado com scroll próprio. O filtro UF usa campos explícitos do processo e, em último caso, o código de tribunal do CNJ da Justiça Estadual (8.01–8.27); regiões federais e trabalhistas sem UF explícita aparecem em **Não informada**. O filtro só afeta exibição; dados ausentes não são convertidos em informação artificial.

Fora do escopo: timeline DataJud sem integração verificada, simulação de salvamento, produtividade sem fonte de dados, e endpoints de ajuda inexistentes. Build e testes são verificados pelo workflow da branch; não mesclar na main sem validação visual e operacional.
