# Execução reproduzível

## Frontend

```bash
git switch fix/analytics-stability-20261026
npm ci --ignore-scripts
npx playwright install --with-deps chromium firefox
npm run build
node --test tests/analytics-scheduler.test.mjs
TEST_IDS=AS01-recover-429,AS02-independent-kpi,AS03-cancel-reentry,AS04-recover-503 PHASE=analytics-local node tests/runtime-v2/browser.mjs
BROWSER=firefox TEST_IDS=AS01-recover-429,AS02-independent-kpi,AS03-cancel-reentry,AS04-recover-503 PHASE=analytics-firefox PORT=5195 node tests/runtime-v2/browser.mjs
```

O browser usa API controlada, token sintético e servidor local. Não faz login nem prova integração com Microsoft/API real. Evidências: docs/runtime-v2/evidence/PHASE, incluindo metrics.json, screenshots e trace.zip. CI publica os artefatos.

## Backend

Criar Postgre SQL 17 descartável com banco EXATAMENTE runtime_v2_analytics_stability e definir ANALYTICS_STABILITY_TEST_DSN para ele. O bootstrap recusa outro nome. Nunca usar credencial/host de produção. Instalar requirements.txt num ambiente Python 3.12.

```bash
PYTHONPATH=. python scripts/analytics_stability_test_database.py
PYTHONPATH=. python -m pytest tests/test_analytics_stability_api.py tests/test_analytics_stability_closing_sql.py tests/test_analytics_stability_base_sql.py tests/test_base_geral_api.py tests/test_closing_aging_meta_monthly.py tests/test_closing_monthly_consolidation.py tests/test_closing_origin_accuracy.py -q -s
ANALYTICS_STABILITY_BENCHMARK=1 ANALYTICS_STABILITY_BENCHMARK_ROWS=84000 ANALYTICS_STABILITY_BENCHMARK_SAMPLES=20 PYTHONPATH=. python -m pytest tests/test_analytics_stability_base_sql.py::test_base_plan_benchmark -q -s
```

Benchmark é opt-in e altera somente tabelas sintéticas desse banco. Não executar em paralelo com testes de Base Geral que troquem sua fixture. Raw samples e planos são gravados em /tmp/analytics-base-benchmark.json. As funções antigas vêm do código efetivo congelado; a referência Python é carregada sem decorators para comparação direta.

Na execução local foi utilizada imagem ac23cc157170... com código da branch montado read-only; DSN sintética fornecida por arquivo protegido em /dev/shm. Não se depende desse arquivo para reproduzir: definir sua própria DSN descartável.
