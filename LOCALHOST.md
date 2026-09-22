# Execução local do frontend

O localhost deve executar o mesmo artefato `dist/` publicado pela Cloudflare. Não abra `index.html` diretamente, não use servidor Python para a raiz do repositório e não rode `vite --host` sobre os arquivos-fonte.

Neste fluxo, apenas o frontend roda na estação local. API, autenticação, banco e demais serviços continuam usando a infraestrutura real através do proxy Railway.

## Fluxo

1. Verifique se a `main` local está sincronizada com `origin/main`. Prefira comparar os SHAs antes de atualizar; evite `git pull` cego quando houver alterações locais.
2. Instale as dependências quando necessário:
   ```bash
   npm ci
   ```
3. Na pasta do frontend, execute:
   ```bash
   npm run dev
   ```
4. Para acesso direto, use `http://localhost:5173`.
5. Para teste real de HTTPS, origem, CORS e Microsoft Login, exponha o preview através do Cloudflare Tunnel fixo e acesse:
   ```text
   https://local.portilhobackoffice.site
   ```

`npm run dev` executa `npm run build` antes de subir o servidor local. O build recompila `src/dashboard/main.tsx`, gera o bundle React em `.build/react-dashboard`, monta o artefato final em `dist/` e então usa `vite preview --outDir dist` para servir exatamente esse `dist/`.

## API e autenticação

O frontend local e o frontend publicado usam o mesmo endpoint de API:

```text
https://mba-backoffice-proxy-production.up.railway.app
```

Não existe dependência de Flask local em `127.0.0.1:5000` e o Vite Preview não faz proxy de `/api` ou `/auth` para a estação de trabalho.

O fluxo de autenticação no ambiente local é:

```text
https://local.portilhobackoffice.site
        ↓
Railway /auth/microsoft/start
        ↓
Microsoft Entra
        ↓
Railway /auth/microsoft/callback
        ↓
redirect para https://local.portilhobackoffice.site/#auth_handoff=...
```

O `MICROSOFT_REDIRECT_URI` do backend continua sendo o callback público do Railway. Não é necessário um segundo aplicativo Microsoft apenas para o frontend local.

Para que o fluxo funcione, o backend real precisa incluir `https://local.portilhobackoffice.site` em `FRONTEND_ALLOWED_ORIGINS`. O domínio de produção permanece em `FRONTEND_URL`.

## Preview visual sem backend

Para validar apenas UI, navegação e layout usando os mocks já existentes:

```text
http://localhost:5173/?preview=1
```

Esse modo ainda serve o mesmo `dist/`; ele só ativa a identidade/mock API local quando o hostname é `localhost` ou `127.0.0.1` e a query `preview=1` está presente.

## Paridade com produção

Produção e localhost seguem a mesma cadeia de build:

```text
src/dashboard/main.tsx
        ↓
vite build
        ↓
.build/react-dashboard
        ↓
build-static.mjs
        ↓
dist/
        ↓
Cloudflare Workers / Vite Preview
```

A diferença intencional está apenas em onde o frontend é servido. Ambos chamam o mesmo backend real via Railway.
