# RM drill-down "Baixar CSV" — frontend behaviour and backend endpoint request

Task: THOM-OPUS-CSV-20261116 (Thomas). Base: backoffice_frontend 4b00afe.

## What the frontend does now
- Every Read Model card that opens a process drill-down (`MetricCard` with `onOpen`) keeps
  a single click target. The detail dialog (`MetricCasesDialog`) displays "Baixar CSV"
  beside the close button when a positive total is available. Covered:
  - Cadastro (`CadastroCpjCards`): Entradas, Cadastrar (Enter only), Com liminar, Arquivar,
    Desconsideração de patrocínio, Ativos, Prescritos.
  - Read Model V1 panel (`ReadModelDashboard`): Cadastro, Andamentos (13 indicators), Encerramentos.
- The legacy Andamentos cards have no drill-down, so they get no CSV action. Legacy Base Geral,
  Defesas and Encerramentos pages are not RM cards and are unchanged.
- No export endpoint exists in the backend snapshot (61b281a). The browser pages through the **same**
  endpoint, headers and query as the drill-down dialog:
  - `GET /api/resultados/cadastro/processos?category&revision&entry_start&entry_end&situation&page&page_size=50`
    (`processos.view`; backend caps page ≤ 200, page_size ≤ 50).
  - `GET /api/dashboard/v1/<dashboard>/metrics/<metric>/cases?revision&version&limit=200&after`
    (keyset cursor; limit ≤ 200).
  Carteira travels in `X-Portfolio-Id` through `MBA_API.request`. The revision comes from the summary
  that produced the card value, so the count and the file come from the same frozen revision.
- A file is written only if all pages return the same `total`, no row repeats and the row count equals
  `total`. 401/403/409/5xx, a total change, a carteira or session change, or cancelling discard the
  export. No partial CSV is produced.
- Limit: 5,000 rows (`CSV_EXPORT_MAX_ROWS`), i.e. ≤ 100 requests on Cadastro and ≤ 25 on V1, one
  export at a time. When the detail dialog's published total or the first page's total is above
  the limit, the export is refused with a message in the dialog. It is not truncated.
- File: UTF-8 with BOM, `;` separator, CRLF, every cell quoted. Cells starting with `= + - @`
  (also after leading whitespace), tab or CR get a leading `'` (formula injection).

## Backend endpoint needed for sets above 5,000 rows (owner: Harris)
`GET /api/resultados/cadastro/processos.csv` and
`GET /api/dashboard/v1/<dashboard>/metrics/<metric>/cases.csv`
- Same authentication, permission (`processos.view` / dashboard binding), origin allowlist and
  `X-Portfolio-Id` scope checks as the JSON routes. Fail closed (403) and never fall back to another carteira.
- Required `revision` (exact, no "latest"), plus the same filters/category/version as the JSON route.
  Closed query allowlist, and 400 on unknown params.
- 409 with the existing limitation code when the detail is unavailable for that revision. No empty file.
- Streamed response: `Content-Type: text/csv; charset=utf-8`, BOM, `Content-Disposition: attachment;
  filename="<module>_<metric>_rev<revision>_<portfolio>.csv"`, `Cache-Control: private, no-store`,
  `Vary: Authorization, Origin, X-Portfolio-Id`.
- Header row includes `X-Export-Total` (or a trailer row) equal to the card's count for that revision.
- Server-side formula neutralization identical to the client (`'` prefix for `= + - @ \t \r`).
- Rate limit per user (e.g. 1 concurrent export, 10/min) and an explicit max row count with 413 when exceeded.
- Audit log: user, portfolio, metric, revision, row count. Do not log row contents.

When this exists, `useCaseCsvExport` can be switched to a single authenticated request per card. Keep
the UI and the cap message until then.
