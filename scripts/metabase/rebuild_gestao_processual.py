#!/usr/bin/env python3
"""Versioned Metabase definition for Gestão Processual.

Gestão Processual is restricted to portfolio/process indicators. Operational
results live in the Operação dashboard. Default mode is plan-only.
"""
from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request

DASHBOARD_NAME = "Gestão Processual"
TABS = ["Carteira Processual"]


def card(name, display, sql, row, col, size_x, size_y, settings=None):
    return {
        "tab": "Carteira Processual",
        "name": name,
        "display": display,
        "sql": sql.strip(),
        "row": row,
        "col": col,
        "size_x": size_x,
        "size_y": size_y,
        "visualization_settings": settings or {},
    }


CARDS = [
    card("Processos — Total", "scalar", "SELECT COUNT(*) AS total FROM public.processos_carteira;", 0, 0, 6, 3),
    card("Processos — Ativos", "scalar", """
        SELECT COUNT(*) AS ativos FROM public.processos_carteira
        WHERE lower(btrim(coalesce(situation_benner, ''))) = 'em andamento';
    """, 0, 6, 6, 3),
    card("Processos — Encerrados", "scalar", """
        SELECT COUNT(*) AS encerrados FROM public.processos_carteira
        WHERE lower(btrim(coalesce(situation_benner, ''))) = 'encerrado';
    """, 0, 12, 6, 3),
    card("Processos — Aging médio ativos", "scalar", """
        SELECT ROUND(AVG(aging)::numeric, 1) AS aging_medio_dias
        FROM public.processos_carteira
        WHERE aging IS NOT NULL
          AND lower(btrim(coalesce(situation_benner, ''))) = 'em andamento';
    """, 0, 18, 6, 3),
    card("Processos — Aptos ao encerramento", "scalar", """
        SELECT COUNT(*) AS aptos_ao_encerramento
        FROM public.processos_carteira
        WHERE resolution IS NOT NULL AND btrim(resolution) <> '';
    """, 3, 0, 6, 3),
    card("Processos — Divergências CPJ x Benner", "scalar", """
        SELECT COUNT(*) AS divergencias
        FROM public.processos_carteira
        WHERE lower(btrim(coalesce(situation_cpj, ''))) = 'divergente'
           OR (btrim(coalesce(situation_cpj, '')) <> ''
               AND btrim(coalesce(situation_benner, '')) <> ''
               AND lower(btrim(situation_cpj)) <> lower(btrim(situation_benner)));
    """, 3, 6, 6, 3),
    card("Processos — Aptos a arquivamento", "scalar", """
        SELECT COUNT(*) AS aptos_a_arquivamento
        FROM public.processos_carteira
        WHERE lower(btrim(coalesce(situation_benner, ''))) = 'encerrado'
          AND lower(btrim(coalesce(situation_cpj, ''))) = 'em andamento';
    """, 3, 12, 6, 3),
    card("Processos — Aging crítico 180+", "scalar", """
        SELECT COUNT(*) AS aging_critico
        FROM public.processos_carteira
        WHERE coalesce(aging, 0) > 180
          AND lower(btrim(coalesce(situation_benner, ''))) = 'em andamento';
    """, 3, 18, 6, 3),
    card("Processos — Entradas x Encerramentos", "line", """
        WITH meses AS (
          SELECT date_trunc('month', date)::date AS mes, COUNT(*)::bigint AS entradas, 0::bigint AS encerramentos
          FROM public.processos_carteira WHERE date IS NOT NULL GROUP BY 1
          UNION ALL
          SELECT date_trunc('month', date_resolution)::date, 0::bigint, COUNT(*)::bigint
          FROM public.processos_carteira WHERE date_resolution IS NOT NULL GROUP BY 1
        )
        SELECT mes, SUM(entradas) AS entradas, SUM(encerramentos) AS encerramentos
        FROM meses GROUP BY mes ORDER BY mes;
    """, 6, 0, 16, 7),
    card("Processos — Situação Benner", "pie", """
        SELECT coalesce(nullif(btrim(situation_benner), ''), 'Não informado') AS situacao,
               COUNT(*) AS processos
        FROM public.processos_carteira GROUP BY 1 ORDER BY processos DESC;
    """, 6, 16, 8, 7),
    card("Processos — Por produto", "bar", """
        SELECT coalesce(nullif(btrim(product), ''), 'Não informado') AS produto, COUNT(*) AS processos
        FROM public.processos_carteira GROUP BY 1 ORDER BY processos DESC;
    """, 13, 0, 12, 7),
    card("Processos — Por UF", "bar", """
        SELECT coalesce(nullif(btrim(state), ''), 'Não informado') AS uf, COUNT(*) AS processos
        FROM public.processos_carteira GROUP BY 1 ORDER BY processos DESC;
    """, 13, 12, 12, 7),
    card("Processos — Aging dos ativos", "bar", """
        WITH base AS (
          SELECT CASE WHEN aging <= 0 THEN '0' WHEN aging <= 30 THEN '1–30'
                      WHEN aging <= 60 THEN '31–60' WHEN aging <= 90 THEN '61–90'
                      WHEN aging <= 120 THEN '91–120' WHEN aging <= 180 THEN '121–180'
                      WHEN aging <= 365 THEN '181–365' ELSE '365+' END AS faixa,
                 CASE WHEN aging <= 0 THEN 1 WHEN aging <= 30 THEN 2 WHEN aging <= 60 THEN 3
                      WHEN aging <= 90 THEN 4 WHEN aging <= 120 THEN 5 WHEN aging <= 180 THEN 6
                      WHEN aging <= 365 THEN 7 ELSE 8 END AS ordem
          FROM public.processos_carteira
          WHERE aging IS NOT NULL AND lower(btrim(coalesce(situation_benner, ''))) = 'em andamento'
        )
        SELECT faixa, COUNT(*) AS processos FROM base GROUP BY faixa, ordem ORDER BY ordem;
    """, 20, 0, 12, 7),
    card("Processos — Tipo de encerramento", "bar", """
        SELECT coalesce(nullif(btrim(resolution), ''), 'Sem classificação') AS encerramento,
               COUNT(*) AS processos
        FROM public.processos_carteira GROUP BY 1 ORDER BY processos DESC;
    """, 20, 12, 12, 7),
    card("Base — Processos", "table", """
        SELECT cnj AS "Processo", integration AS "Integração", date AS "Entrada", state AS "UF",
               product AS "Produto", aging AS "Aging", resolution AS "Encerramento",
               date_resolution AS "Data encerramento", situation_cpj AS "Situação CPJ",
               situation_benner AS "Situação Benner", adverse_lawyer AS "Advogado adverso",
               bottleneck AS "Gargalo", updated_at AS "Atualizado em"
        FROM public.processos_carteira ORDER BY date DESC NULLS LAST;
    """, 27, 0, 24, 9),
]


def api(method, base_url, session, path, payload=None):
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        base_url.rstrip("/") + path,
        data=data,
        method=method,
        headers={"Content-Type": "application/json", "X-Metabase-Session": session},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Metabase HTTP {error.code}: {detail}") from error


def create_card(base_url, session, database_id, spec):
    payload = {
        "name": spec["name"],
        "description": None,
        "collection_id": None,
        "dataset_query": {
            "database": database_id,
            "type": "native",
            "native": {"query": spec["sql"], "template-tags": {}},
        },
        "display": spec["display"],
        "visualization_settings": spec["visualization_settings"],
    }
    return api("POST", base_url, session, "/api/card", payload)["id"]


def apply(base_url, session, database_id):
    dashboard = api("POST", base_url, session, "/api/dashboard", {
        "name": DASHBOARD_NAME,
        "description": "Indicadores da carteira processual. Resultados operacionais ficam no dashboard Operação.",
        "collection_id": None,
    })
    dashboard_id = dashboard["id"]
    tab_ids = {name: -(index + 1) for index, name in enumerate(TABS)}
    dashcards = []
    for index, spec in enumerate(CARDS):
        card_id = create_card(base_url, session, database_id, spec)
        dashcards.append({
            "id": -(index + 1),
            "card_id": card_id,
            "dashboard_tab_id": tab_ids[spec["tab"]],
            "row": spec["row"], "col": spec["col"],
            "size_x": spec["size_x"], "size_y": spec["size_y"],
            "parameter_mappings": [], "visualization_settings": {},
        })
    api("PUT", base_url, session, f"/api/dashboard/{dashboard_id}", {
        "tabs": [{"id": tab_ids[name], "name": name, "position": i} for i, name in enumerate(TABS)],
        "dashcards": dashcards,
    })
    return dashboard_id


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="create a new dashboard in Metabase")
    args = parser.parse_args()
    print(f"Dashboard: {DASHBOARD_NAME}")
    print(f"Tabs: {', '.join(TABS)}")
    for item in CARDS:
        print(f"- {item['name']}")
    if not args.apply:
        print("\nPlan only. No Metabase resource was changed.")
        return
    base_url = os.environ.get("MB_URL", "").strip()
    session = os.environ.get("MB_SESSION", "").strip()
    database_id = int(os.environ.get("MB_DATABASE_ID", "2"))
    if not base_url or not session:
        raise SystemExit("MB_URL and MB_SESSION are required with --apply")
    dashboard_id = apply(base_url, session, database_id)
    print(f"\nCreated dashboard ID: {dashboard_id}")


if __name__ == "__main__":
    main()
