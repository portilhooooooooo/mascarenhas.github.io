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
