# Execução local do frontend

O localhost deve executar o mesmo artefato `dist/` publicado pela Cloudflare. Não abra `index.html` diretamente, não use servidor Python para a raiz do repositório e não rode `vite --host` sobre os arquivos-fonte.

## Fluxo

1. Atualize a `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Instale as dependências quando necessário:
   ```bash
   npm ci
   ```
3. Inicie o backend Flask local em `http://127.0.0.1:5000`.
4. Na pasta do frontend, execute:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:5173`.

`npm run dev` executa `npm run build` antes de subir o servidor local. O build recompila `src/dashboard/main.tsx`, gera o bundle React em `.build/react-dashboard`, monta o artefato final em `dist/` e então usa `vite preview` para servir exatamente esse `dist/`.

## API local

Em localhost, o browser chama `/api/*` e `/auth/*` na mesma origem. O Vite Preview encaminha essas rotas para `http://127.0.0.1:5000`.

Para apontar temporariamente para outro backend compatível:

PowerShell:
```powershell
$env:VITE_BACKEND_TARGET='http://127.0.0.1:5001'
npm run dev
```

CMD:
```cmd
set VITE_BACKEND_TARGET=http://127.0.0.1:5001
npm run dev
```

## Microsoft Login

Para testar o login Microsoft real em localhost, o backend local precisa aceitar `http://localhost:5173` como origem do frontend e sua configuração Microsoft precisa usar um redirect URI registrado no tenant para o ambiente local.

## Paridade com produção

Produção e localhost seguem a mesma cadeia:

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

A única diferença intencional é o destino da API: produção usa o proxy público; localhost usa o Flask local através do proxy do Vite Preview.
