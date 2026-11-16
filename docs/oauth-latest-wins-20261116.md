# Login Microsoft — nova tentativa substitui a pendente (T-202611161345-2b09)

Escopo: somente frontend (`auth.js`). Nenhuma alteração de backend, API ou produção.

## Diagnóstico

`startMicrosoftLogin` gravava `mba_oauth_lease` (timestamp) em `localStorage` antes de redirecionar e recusava
qualquer novo início por 60 s com "Outro acesso Microsoft está em andamento neste navegador.". O lease só era
removido em troca bem-sucedida ou em falha do `/auth/microsoft/start`. Logo, bloqueava o usuário quando ele:

- voltava da tela da Microsoft (Voltar, fechar a aba, cancelar) e clicava de novo;
- abria o login em outra aba enquanto a primeira estava pendente;
- voltava via back/forward cache: além do lease, `microsoftLoginInFlight` permanecia `true` e o botão ficava ocupado.

O lease não acrescentava segurança: o que vincula o callback à aba é o verificador em `sessionStorage`.

## Fluxo novo (latest-wins)

| Dado | Onde | Conteúdo |
|---|---|---|
| `mba_oauth_verifier` | `sessionStorage` (por aba) | verificador PKCE do handoff — inalterado |
| `mba_oauth_attempt` | `sessionStorage` (por aba) | id aleatório da tentativa desta aba |
| `mba_oauth_current_attempt` | `localStorage` (navegador) | id da tentativa mais recente; não é segredo |

1. **Início**: gera verificador + id, chama `/auth/microsoft/start`, valida a origem Microsoft e só então grava o
   marcador e redireciona. Não há espera nem lease. Um início que falha não derruba a tentativa pendente de outra aba.
2. **Callback**: o `#auth_handoff` sai da URL antes de qualquer outra coisa. A troca só ocorre se a aba tem
   verificador e id **e** o marcador ainda aponta para o id dela.
3. **Callback stale** (outra tentativa começou depois, ou já concluiu): não é trocado; o estado da aba é limpo.
   Se já existe sessão no navegador, a aba a adota sem aviso; se não, mostra
   "Este acesso foi substituído por uma tentativa mais recente neste navegador. Entre novamente."
4. **Sucesso**: o token novo substitui o armazenado; as outras abas revalidam pelo evento `storage` já existente.
   O marcador só é removido por quem ainda é o dono dele.
5. **Concorrência na mesma aba**: uma única troca por código, mesmo se o bootstrap reentrar durante a requisição.
6. **bfcache**: `pageshow` com `persisted` libera o botão para nova tentativa.
7. Handoff entregue a uma aba que não iniciou login (login CSRF) continua sem troca. Verificador e handoff nunca
   vão para `localStorage`; nada de token em log ou URL.

Janela residual aceita: se uma aba inicia depois que outra já passou pela verificação e está trocando o código,
a primeira conclui e a segunda, ao voltar, substitui a sessão — coerente com "o login mais novo vence".
Na implantação, quem estiver no meio do login com o `auth.js` antigo verá o aviso de tentativa substituída uma vez.

## O que o frontend NÃO faz — contrato necessário no backend

O frontend apenas troca o token guardado neste navegador. **Ele não invalida o token anterior no servidor**;
um token antigo copiado continua válido até o backend revogá-lo. Não verifiquei o comportamento atual do backend
(fora do escopo); os itens abaixo precisam ser confirmados/implementados por Harris:

1. `POST /auth/session/exchange`: código de handoff de uso único, expiração curta, vinculado ao `handoff_challenge`
   (S256). Reuso ou verificador divergente → 401/403/422 (o frontend limpa o fluxo nesses status; 409/5xx são
   tratados como transitórios e repetidos uma vez — 409 não deve significar "código já consumido").
2. `POST /auth/microsoft/start`: `state`/PKCE com a Microsoft por tentativa, independentes entre si; iniciar uma
   nova tentativa não pode falhar por existir outra pendente do mesmo navegador/usuário.
3. Política de sessão ao concluir novo login: decidir se revoga as sessões anteriores do usuário (ou só as do mesmo
   dispositivo). Se revogar, responder às chamadas com o token antigo `401 SESSION_INVALID` e
   `reason: "session_replaced"` — o frontend já exibe a mensagem correspondente.
4. Opcional, defesa em profundidade: devolver no fragmento um identificador da tentativa (eco de um valor enviado
   no `start`) para o frontend comparar antes da troca.

## Testes

Automatizado: `node tests/oauth-attempt-replacement.test.mjs` (auth.js real em `node:vm`, duas abas com
`localStorage` compartilhado e `sessionStorage` separados, API simulada).

Manual, pendente em ambiente com navegador e backend de staging:

**Duas abas, mesmo navegador**
1. A: Entrar → parar na tela da Microsoft. B: Entrar → redireciona na hora, sem aviso.
2. Concluir em B → B autenticada. Concluir em A → A abre com a sessão de B, sem nova troca (Network: nenhum
   `/auth/session/exchange` em A).
3. Repetir 1; concluir A antes de B → A mostra o aviso de tentativa substituída; concluir B → B autentica e A,
   ao recarregar, entra com a mesma sessão.
4. A: Entrar → Voltar do navegador → botão disponível → Entrar de novo funciona.
5. Recarregar a URL de callback já usada → sem nova troca, sem erro.

**Duas sessões (navegadores/perfis diferentes, mesmo usuário)**
6. Login em X, depois em Y. Registrar o que o backend faz com X: se revoga, X deve cair com a mensagem
   "sessão substituída"; se não revoga, as duas permanecem — esse é o comportamento do backend, não do frontend.
7. Logout em Y não deve afetar X além do que a política do item 3 definir.
