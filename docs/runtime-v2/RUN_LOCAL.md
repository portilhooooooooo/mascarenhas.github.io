# Execução reproduzível
## Frontend
Branch de trabalho dev/tasks-workspace; candidato de promoção release/runtime-v2-20261024 baseado na main efetivamente publicada, preservando funcionalidades mais novas.

```sh
npm ci
npm run build
npm run test:hardening
PHASE=acceptance-chromium BROWSER=chromium PORT=5191 node tests/runtime-v2/browser.mjs
PHASE=acceptance-firefox BROWSER=firefox PORT=5192 node tests/runtime-v2/browser.mjs
npm run test:processos
npm run test:ux
```
Instalar browsers do Playwright conforme CI. As rotas de API destes testes são fixtures explícitas; não são integração Microsoft nem prova de latência publicada. A suíte inclui espera real de 15 s e expiração real do TTL. Metrics JSON, trace ZIP e screenshots ficam em docs/runtime-v2/evidence/PHASE. Nunca publicar fixtures de teste no Cloudflare.

## Backend
Branch migration/runtime-v2-reconciled-20261024. Usar Python 3.12, PostgreSQL 17 e PostgREST 14.5 conforme workflow. Banco novo e vazio deve se chamar runtime_v2_* e ter opt-in explícito; scripts recusam outros destinos. Fixtures de contrato são de inicialização única: para reconstruir, usar outro banco descartável vazio. Não reutilizar credenciais de produção.

```sh
python -m pip install -r requirements.txt
RUNTIME_V2_TEST_DATABASE=1 RUNTIME_V2_TEST_DSN="host=127.0.0.1 user=postgres dbname=runtime_v2_test" PYTHONPATH=. python scripts/runtime_v2_test_database.py
```
A workflow runtime-v2-reconciled.yml contém os comandos completos de suites, gateway prefixado, Gunicorn 2×4, Redis e serviço PostgREST. Testes HTTP usam o SDK real e SQL real; identidades são sintéticas. O benchmark scripts/runtime_v2_http_load.py aceita somente os hosts internos explicitamente permitidos no script, incluindo as imagens finais, e banco descartável. Ele compara três rodadas de 30 colaboradores + 10 analytics e verifica 90 salvamentos finais duráveis.

Fixtures reais desidentificadas ficam apenas no repositório privado do backend. Não exportar documentos ou bases integrais. O corpus ampliado possui manifesto e SHA-256. Inicializador carrega tarefas antes dos eventos para respeitar o trigger efetivo de carteira.

Para evidência por caso: executar pytest com --junitxml=runtime-v2-cases.xml -o junit_logging=no. O XML registra duração individual e timestamp de execução. Para investigar recibos sem alterá-los, consultar WRITE-RECOVERY.md; a ferramenta operacional não é incluída na imagem do aplicativo.

CI remoto da branch dev também foi executado após o último código frontend: bf54945 passou nos workflows React e browser. A branch release preserva a base main efetivamente publicada; não promover dev inteira. Registros de domínio adicional mantêm falhas pré-existentes explicitamente e não integram uma afirmação de discovery global verde.

Para o ensaio de orçamento: imagem mba-runtime-v2-release:analytical-budget, fonte 8bcc99d, API interna runtime-v2-image-analytical-budget:5000. Variantes before/rollback anteriores foram paradas após os testes; credenciais sintéticas têm TTL e devem ser renovadas pelo helper isolado antes de nova rodada. Não confundir esse ambiente com login autorizado via .bat/local ou main Cloudflare.

## Adendo de 25/10/2026
Suíte HTTP: RUNTIME_V2_TEST_DATABASE=1, banco runtime_v2_* e API HTTP interna explicitamente permitida; python -m pytest tests/test_runtime_v2_http.py tests/test_runtime_v2.py tests/test_runtime_v2_auth_budget.py -q. Fixture inclui upload-stage-schema.sql e linked-task-stage-schema.sql. Não apontar para produção; os scripts de imagem emitem credenciais sintéticas com TTL. Build reproduzível: PYTHONPATH=. python scripts/runtime_v2_build.py --commit 25bb6c1 --tag mba-runtime-v2-release:linked-creation.


Teste híbrido de comando (opcional; stage Docker interno já iniciado):
1. No checkout backend, executar dentro de runtime-v2-runner: python -m scripts.runtime_v2_linked_browser_fixture prepare. Redirecionar a saída para arquivo temporário com umask 077; contém somente sessão sintética, nunca anexar como evidência.
2. No frontend com dist pronto: RUNTIME_V2_BROWSER_STATE=/tmp/runtime-v2-linked-browser-state.json BROWSER=chromium node tests/runtime-v2/linked-command.mjs. Repetir com fixture nova para Firefox.
3. Sempre executar python -m scripts.runtime_v2_linked_browser_fixture verify dentro do runner, recebendo o mesmo JSON por stdin, para conferir e remover os dados; apagar o arquivo temporário em seguida. A verificação também limpa registros quando a contagem falha.
A API aceita somente a instância runtime-v2-image-linked-creation identificada por label de fixture, rede interna e ausência de portas públicas. Leituras são simuladas e o resultado é registrado como teste híbrido.

## Atomicidade de Encerramentos — 25/10/2026
Para validar o novo caminho, aplicar as OITO migrações no banco descartável via scripts/runtime_v2_test_database.py e usar RUNTIME_V2_CLOSING_ATOMIC=1. Imagem de aplicação 14503a1: mba-runtime-v2-release:closing-atomic; SQL final 581b8e1. Testes de falha: -k closing_event_failure. Benchmark e rollback aceitam somente os nomes internos explicitamente adicionados para essa variante.

## Fechamento — 25/10/2026
Último grupo necessário executado: python -m pytest tests/test_runtime_v2_http.py -k "actual_skip or atomic_skip_rpc" -o junit_family=xunit1 -q. Evitar -k skip isolado: corresponde também ao marcador skipif e pode selecionar todo o módulo. Para upload: -k upload_recovery. NOVE migrações no inicializador do stage; RUNTIME_V2_SKIP_ATOMIC=1 habilita a nova função, sem modificar produção. CIs válidos do código: backend 40d77ab/run40246991661 e frontend 99ec81d/run40247238570. Casos adicionais já executados: 1fbd5ad; documentação/evidência usa skip-ci para não repetir baterias.
