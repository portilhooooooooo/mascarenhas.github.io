# Reproduzir o candidato

Frontend: Node 24, npm e browser Playwright compatível com o lockfile.

```sh
npm ci --ignore-scripts
npm run build
npx playwright install chromium
npm run test:runtime-v2
node tests/processos-ui.mjs
npm run test:hardening
node --test tests/api-client.test.mjs tests/base-geral-ui.test.mjs tests/task-access.test.mjs
```

A suíte Runtime V2 usa o dist e localhost:5186; a operacional usa localhost:5175. PHASE escolhe a pasta de evidência e PORT permite isolar o servidor da primeira suíte. TEST_IDS=A06,A07 executa um recorte da primeira suíte e deve ser identificado como recorte, nunca como execução completa. Os scripts interceptam o domínio API configurado neste repositório; antes de mudar configuração de endpoints, adapte os interceptores para continuar sem chamadas reais.

`npm run dev:local` serve o build em localhost:5173. Ele aponta para a API configurada e requer sessão autorizada para integração real; não use o modo preview/demo como prova de integração.

Backend: ver migration/runtime-v2-20261023, docs/runtime-v2/VALIDATION.md. Os testes registrados rodaram em container descartável sem rede/credenciais/portas e com limites de CPU/RAM. O Dockerfile.validation não é um release aprovado. Não copiar .env da produção para o ambiente de testes.

Os arquivos metrics.json contêm commit, timestamp, fixture=true, resultados, rede e medidas. Screenshots são dados fictícios. Traces abrem com `npx playwright show-trace CAMINHO`. Tempos de duração dos testes incluem waits e controle browser; só os campos navigation.ms representam a medida in-page até o próximo animation frame. Não comparar duração de jornada com latência da API real.
