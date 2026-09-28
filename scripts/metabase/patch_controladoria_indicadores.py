#!/usr/bin/env python3
"""Non-destructive patch for the existing Controladoria indicators dashboard.

Adds one audited protocol-savings card to the existing Protocolo tab and creates
(or reuses) a Contestação tab with defense KPIs. Default mode is plan-only.
"""
from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request

PROTOCOL_CARD = {
    "name": "Protocolo — Minutos economizados",
    "display": "scalar",
    "sql": """
        SELECT ROUND(COUNT(*) * (300 - 20) / 60.0, 1) AS minutos_economizados
        FROM public.protocolo_indicadores_view
        WHERE modo_execucao = '100% automatizado'
          AND status_protocolo = 'Concluído'
          AND origem_informacao = 'Worker'
          AND evento_fonte = 'ERP_SUBMITTED';
    """,
    "row": 0, "col": 18, "size_x": 6, "size_y": 3,
}

DEFENSE_CARDS = [
    {
        "name": "Contestação — Defesas recebidas", "display": "scalar",
        "sql": """
            SELECT COUNT(*) AS defesas_recebidas
            FROM public.task_processes tp
            JOIN public.tasks t ON t.id = tp.task_id
            WHERE t.type = 'defesa';
        """, "row": 0, "col": 0, "size_x": 6, "size_y": 3,
    },
    {
        "name": "Contestação — Análises pendentes", "display": "scalar",
        "sql": """
            SELECT COUNT(*) AS analises_pendentes
            FROM public.task_processes tp
            JOIN public.tasks t ON t.id = tp.task_id
            WHERE t.type = 'defesa' AND lower(coalesce(tp.status,'')) <> 'completed';
        """, "row": 0, "col": 6, "size_x": 6, "size_y": 3,
    },
    {
        "name": "Contestação — Aptos à defesa", "display": "scalar",
        "sql": """
            SELECT COUNT(*) AS aptos_defesa
            FROM public.defesa_analyses
            WHERE lower(coalesce(decision,'')) = 'apto';
        """, "row": 0, "col": 12, "size_x": 6, "size_y": 3,
    },
    {
        "name": "Contestação — Inaptos à defesa", "display": "scalar",
        "sql": """
            SELECT COUNT(*) AS inaptos_defesa
            FROM public.defesa_analyses
            WHERE lower(coalesce(decision,'')) = 'inapto';
        """, "row": 0, "col": 18, "size_x": 6, "size_y": 3,
    },
    {
        "name": "Contestação — Prioridades", "display": "bar",
        "sql": """
            WITH pendentes AS (
              SELECT
                coalesce(tp.source_metadata->'raw_data'->>'Prioridade','') AS prioridade_enter,
                nullif(tp.source_metadata->>'operational_deadline','')::date AS prazo_operacional
              FROM public.task_processes tp
              JOIN public.tasks t ON t.id = tp.task_id
              WHERE t.type = 'defesa' AND lower(coalesce(tp.status,'')) <> 'completed'
            ), classificados AS (
              SELECT CASE
                WHEN prazo_operacional IS NOT NULL AND prazo_operacional <= current_date THEN 'Urgente'
                WHEN lower(prioridade_enter) = 'alta' THEN 'Alta'
                ELSE 'Baixíssima'
              END AS prioridade
              FROM pendentes
            )
            SELECT prioridade, COUNT(*) AS defesas
            FROM classificados
            GROUP BY prioridade
            ORDER BY CASE prioridade WHEN 'Urgente' THEN 1 WHEN 'Alta' THEN 2 ELSE 3 END;
        """, "row": 3, "col": 0, "size_x": 24, "size_y": 7,
    },
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
    return api("POST", base_url, session, "/api/card", {
        "name": spec["name"],
        "description": None,
        "collection_id": None,
        "dataset_query": {
            "database": database_id,
            "type": "native",
            "native": {"query": spec["sql"].strip(), "template-tags": {}},
        },
        "display": spec["display"],
        "visualization_settings": {},
    })["id"]


def normalized(value):
    return str(value or "").strip().lower()


def dashcard_payload(item):
    payload = {
        "id": item.get("id"),
        "card_id": item.get("card_id"),
        "dashboard_tab_id": item.get("dashboard_tab_id"),
        "row": item.get("row", 0),
        "col": item.get("col", 0),
        "size_x": item.get("size_x", 6),
        "size_y": item.get("size_y", 4),
        "parameter_mappings": item.get("parameter_mappings") or [],
        "visualization_settings": item.get("visualization_settings") or {},
    }
    if item.get("series") is not None:
        payload["series"] = item["series"]
    return payload


def apply(base_url, session, database_id, dashboard_id):
    dashboard = api("GET", base_url, session, f"/api/dashboard/{dashboard_id}")
    tabs = list(dashboard.get("tabs") or [])
    dashcards = list(dashboard.get("dashcards") or [])
    if not tabs:
        raise RuntimeError("O dashboard de Controladoria não possui tabs; patch abortado para preservar o painel atual.")

    protocol_tab = next((tab for tab in tabs if normalized(tab.get("name")) in {"protocolo", "protocolos"}), None)
    if not protocol_tab:
        raise RuntimeError("Tab Protocolo não localizada; patch abortado para não alterar o dashboard errado.")

    contest_tab = next((tab for tab in tabs if normalized(tab.get("name")) in {"contestação", "contestacao"}), None)
    if not contest_tab:
        contest_tab = {"id": -9001, "name": "Contestação", "position": len(tabs)}
        tabs.append(contest_tab)

    existing_names = {
        normalized((item.get("card") or {}).get("name")): item
        for item in dashcards if (item.get("card") or {}).get("name")
    }
    next_temp_id = -9100

    for spec, tab_id in [(PROTOCOL_CARD, protocol_tab["id"])] + [(item, contest_tab["id"]) for item in DEFENSE_CARDS]:
        if normalized(spec["name"]) in existing_names:
            continue
        card_id = create_card(base_url, session, database_id, spec)
        dashcards.append({
            "id": next_temp_id,
            "card_id": card_id,
            "dashboard_tab_id": tab_id,
            "row": spec["row"], "col": spec["col"],
            "size_x": spec["size_x"], "size_y": spec["size_y"],
            "parameter_mappings": [], "visualization_settings": {},
        })
        next_temp_id -= 1

    api("PUT", base_url, session, f"/api/dashboard/{dashboard_id}", {
        "tabs": [{"id": tab["id"], "name": tab["name"], "position": tab.get("position", index)} for index, tab in enumerate(tabs)],
        "dashcards": [dashcard_payload(item) for item in dashcards],
    })


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="patch the configured Controladoria dashboard")
    args = parser.parse_args()
    print("Controladoria / Indicadores")
    print(f"- Protocolo: {PROTOCOL_CARD['name']}")
    print("- Contestação:")
    for spec in DEFENSE_CARDS:
        print(f"  - {spec['name']}")
    print("\nEconomia: 5 min manuais - 20 s de toque humano atual = 280 s poupados por ERP_SUBMITTED comprovado pelo worker.")
    print("Prioridade: Urgente = prazo operacional vencido/hoje; Alta = prioridade Enter Alta futura; Baixíssima = demais pendentes.")
    if not args.apply:
        print("\nPlan only. No Metabase resource was changed.")
        return

    base_url = os.environ.get("MB_URL", "").strip()
    session = os.environ.get("MB_SESSION", "").strip()
    database_id = int(os.environ.get("MB_DATABASE_ID", "2"))
    dashboard_id = int(os.environ.get("MB_CONTROLADORIA_DASHBOARD_ID", os.environ.get("METABASE_PROTOCOLO_DASHBOARD_ID", "6")))
    if not base_url or not session:
        raise SystemExit("MB_URL and MB_SESSION are required with --apply")
    apply(base_url, session, database_id, dashboard_id)
    print(f"\nDashboard {dashboard_id} atualizado.")


if __name__ == "__main__":
    main()
