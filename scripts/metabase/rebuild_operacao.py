#!/usr/bin/env python3
"""Versioned Metabase definition for the Operação workspace.

Default mode is plan-only. Use --apply explicitly with MB_URL, MB_SESSION and
MB_DATABASE_ID to create a new dashboard. It never updates an existing dashboard.
"""
from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.request

DASHBOARD_NAME = "Operação"
TABS = ["Jobs", "Pagamentos", "Timeline", "DataJud", "Acordos", "Liminar"]


def card(tab, name, display, sql, row, col, size_x, size_y, settings=None):
    return {
        "tab": tab,
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
    card("Jobs", "Jobs — Total", "scalar", "SELECT COUNT(*) AS total FROM public.jobs;", 0, 0, 6, 3),
    card("Jobs", "Jobs — Em execução", "scalar", """
        SELECT COUNT(*) AS em_execucao FROM public.jobs
        WHERE lower(coalesce(status, '')) IN ('running','in_progress','processing','started');
    """, 0, 6, 6, 3),
    card("Jobs", "Jobs — Concluídos", "scalar", """
        SELECT COUNT(*) AS concluidos FROM public.jobs
        WHERE lower(coalesce(status, '')) IN ('done','completed','success','succeeded');
    """, 0, 12, 6, 3),
    card("Jobs", "Jobs — Erros", "scalar", """
        SELECT COUNT(*) AS erros FROM public.jobs
        WHERE lower(coalesce(status, '')) IN ('error','failed','failure') OR error IS NOT NULL;
    """, 0, 18, 6, 3),
    card("Jobs", "Jobs — Por status", "pie", """
        SELECT coalesce(nullif(btrim(status), ''), 'Não informado') AS status, COUNT(*) AS jobs
        FROM public.jobs GROUP BY 1 ORDER BY jobs DESC;
    """, 3, 0, 8, 7),
    card("Jobs", "Jobs — Por worker", "bar", """
        SELECT coalesce(nullif(btrim(worker), ''), 'Não informado') AS worker, COUNT(*) AS jobs
        FROM public.jobs GROUP BY 1 ORDER BY jobs DESC;
    """, 3, 8, 16, 7),
    card("Jobs", "Jobs — Recentes", "table", """
        SELECT job_id AS "Job", worker AS "Worker", status AS "Status", done AS "Processados",
               total AS "Total", last_msg AS "Última mensagem", error AS "Erro",
               created_at AS "Criado em", updated_at AS "Atualizado em"
        FROM public.jobs ORDER BY created_at DESC NULLS LAST LIMIT 500;
    """, 10, 0, 24, 9),

    card("Pagamentos", "Pagamentos — Total", "scalar", "SELECT COUNT(*) AS total FROM public.pagamentos;", 0, 0, 5, 3),
    card("Pagamentos", "Pagamentos — Em aprovação", "scalar", """
        SELECT COUNT(*) AS em_aprovacao FROM public.pagamentos WHERE situacao ILIKE 'Em aprovação%';
    """, 0, 5, 5, 3),
    card("Pagamentos", "Pagamentos — Liquidados", "scalar", """
        SELECT COUNT(*) AS liquidados FROM public.pagamentos WHERE situacao = 'Liquidado';
    """, 0, 10, 5, 3),
    card("Pagamentos", "Pagamentos — Cancelados", "scalar", """
        SELECT COUNT(*) AS cancelados FROM public.pagamentos WHERE situacao = 'Pagamento cancelado';
    """, 0, 15, 4, 3),
    card("Pagamentos", "Pagamentos — Ticket médio liquidado", "scalar", """
        SELECT ROUND(AVG(valor)::numeric, 2) AS ticket_medio FROM public.pagamentos
        WHERE situacao = 'Liquidado' AND valor IS NOT NULL;
    """, 0, 19, 5, 3),
    card("Pagamentos", "Pagamentos — Valor liquidado no tempo", "line", """
        SELECT date_trunc('month', data_pagamento)::date AS mes, SUM(valor) AS valor_liquidado
        FROM public.pagamentos WHERE situacao = 'Liquidado' AND data_pagamento IS NOT NULL
        GROUP BY 1 ORDER BY 1;
    """, 3, 0, 16, 7),
    card("Pagamentos", "Pagamentos — Por situação", "pie", """
        SELECT coalesce(nullif(btrim(situacao), ''), 'Não informado') AS situacao, COUNT(*) AS pagamentos
        FROM public.pagamentos GROUP BY 1 ORDER BY pagamentos DESC;
    """, 3, 16, 8, 7),
    card("Pagamentos", "Pagamentos — Por tipo", "bar", """
        SELECT coalesce(nullif(btrim(tipo_pagamento), ''), 'Não informado') AS tipo, COUNT(*) AS pagamentos
        FROM public.pagamentos GROUP BY 1 ORDER BY pagamentos DESC;
    """, 10, 0, 12, 7),
    card("Pagamentos", "Pagamentos — Tempo médio por credenciado", "bar", """
        SELECT coalesce(nullif(btrim(credenciado), ''), 'Não informado') AS credenciado,
               ROUND(AVG(tempo_pagamento_dias)::numeric, 1) AS dias
        FROM public.pagamentos WHERE tempo_pagamento_dias IS NOT NULL
        GROUP BY 1 ORDER BY dias DESC LIMIT 20;
    """, 10, 12, 12, 7),
    card("Pagamentos", "Base — Pagamentos", "table", """
        SELECT pasta AS "Pasta", credenciado AS "Credenciado", solicitante AS "Solicitante",
               tipo_pagamento AS "Tipo", valor AS "Valor", situacao AS "Situação",
               data_aprovacao AS "Aprovação", data_pagamento AS "Pagamento",
               tempo_pagamento_dias AS "Dias", created_at AS "Criado em"
        FROM public.pagamentos ORDER BY created_at DESC NULLS LAST LIMIT 2000;
    """, 17, 0, 24, 9),

    card("Timeline", "Timeline — Eventos", "scalar", """
        SELECT (SELECT COUNT(*) FROM public.task_events) +
               (SELECT COUNT(*) FROM public.protocolo_events) AS eventos;
    """, 0, 0, 6, 3),
    card("Timeline", "Timeline — Eventos 24h", "scalar", """
        SELECT (SELECT COUNT(*) FROM public.task_events WHERE created_at >= now() - interval '24 hours') +
               (SELECT COUNT(*) FROM public.protocolo_events WHERE created_at >= now() - interval '24 hours') AS eventos_24h;
    """, 0, 6, 6, 3),
    card("Timeline", "Timeline — Por origem", "pie", """
        SELECT origem, COUNT(*) AS eventos FROM (
          SELECT 'Tarefas'::text AS origem FROM public.task_events
          UNION ALL
          SELECT 'Protocolo'::text AS origem FROM public.protocolo_events
        ) eventos GROUP BY 1 ORDER BY eventos DESC;
    """, 0, 12, 12, 6),
    card("Timeline", "Timeline — Evolução diária", "line", """
        SELECT dia, COUNT(*) AS eventos FROM (
          SELECT date_trunc('day', created_at)::date AS dia FROM public.task_events
          UNION ALL
          SELECT date_trunc('day', created_at)::date AS dia FROM public.protocolo_events
        ) eventos WHERE dia >= current_date - 30 GROUP BY 1 ORDER BY 1;
    """, 6, 0, 16, 7),
    card("Timeline", "Timeline — Eventos mais frequentes", "bar", """
        SELECT evento, COUNT(*) AS ocorrencias FROM (
          SELECT coalesce(nullif(btrim(event_type), ''), 'Não informado') AS evento FROM public.task_events
          UNION ALL
          SELECT coalesce(nullif(btrim(event_type), ''), 'Não informado') AS evento FROM public.protocolo_events
        ) eventos GROUP BY 1 ORDER BY ocorrencias DESC LIMIT 15;
    """, 6, 16, 8, 7),
    card("Timeline", "Timeline — Últimos eventos", "table", """
        SELECT * FROM (
          SELECT 'Tarefa'::text AS "Origem", tp.case_number AS "Processo", te.event_type AS "Evento",
                 te.metadata AS "Detalhes", te.created_at AS "Data/hora"
          FROM public.task_events te
          LEFT JOIN public.task_processes tp ON tp.id = te.task_process_id
          UNION ALL
          SELECT 'Protocolo'::text, pe.cnj, pe.event_type, pe.metadata, pe.created_at
          FROM public.protocolo_events pe
        ) timeline ORDER BY "Data/hora" DESC NULLS LAST LIMIT 1000;
    """, 13, 0, 24, 10),

    card("DataJud", "DataJud — Jobs", "scalar", "SELECT COUNT(*) AS jobs FROM public.datajud_jobs;", 0, 0, 5, 3),
    card("DataJud", "DataJud — Processados", "scalar", "SELECT COALESCE(SUM(processados),0) AS processados FROM public.datajud_jobs;", 0, 5, 5, 3),
    card("DataJud", "DataJud — Sucessos", "scalar", "SELECT COALESCE(SUM(sucessos),0) AS sucessos FROM public.datajud_jobs;", 0, 10, 5, 3),
    card("DataJud", "DataJud — Erros", "scalar", "SELECT COALESCE(SUM(erros),0) AS erros FROM public.datajud_jobs;", 0, 15, 4, 3),
    card("DataJud", "DataJud — Não encontrados", "scalar", "SELECT COALESCE(SUM(nao_encontrados),0) AS nao_encontrados FROM public.datajud_jobs;", 0, 19, 5, 3),
    card("DataJud", "DataJud — Jobs por status", "pie", """
        SELECT coalesce(nullif(btrim(status), ''), 'Não informado') AS status, COUNT(*) AS jobs
        FROM public.datajud_jobs GROUP BY 1 ORDER BY jobs DESC;
    """, 3, 0, 8, 7),
    card("DataJud", "DataJud — Volume por origem", "bar", """
        SELECT coalesce(nullif(btrim(origem), ''), 'Não informado') AS origem,
               COALESCE(SUM(total),0) AS processos
        FROM public.datajud_jobs GROUP BY 1 ORDER BY processos DESC;
    """, 3, 8, 16, 7),
    card("DataJud", "DataJud — Jobs recentes", "table", """
        SELECT id AS "Job", worker AS "Worker", origem AS "Origem", status AS "Status",
               total AS "Total", processados AS "Processados", sucessos AS "Sucessos",
               erros AS "Erros", nao_encontrados AS "Não encontrados", mensagem_atual AS "Mensagem",
               iniciado_em AS "Início", finalizado_em AS "Fim", updated_at AS "Atualizado em"
        FROM public.datajud_jobs ORDER BY coalesce(iniciado_em, created_at) DESC NULLS LAST LIMIT 1000;
    """, 10, 0, 24, 9),

    card("Acordos", "Acordos — Total", "scalar", "SELECT COUNT(*) AS total FROM public.acordos_carteira;", 0, 0, 5, 3),
    card("Acordos", "Acordos — Fechados", "scalar", "SELECT COUNT(*) AS fechados FROM public.acordos_carteira WHERE situacao = 'Acordo Fechado';", 0, 5, 5, 3),
    card("Acordos", "Acordos — Em negociação", "scalar", "SELECT COUNT(*) AS em_negociacao FROM public.acordos_carteira WHERE situacao = 'Em negociação';", 0, 10, 5, 3),
    card("Acordos", "Acordos — Recusados", "scalar", "SELECT COUNT(*) AS recusados FROM public.acordos_carteira WHERE situacao = 'Acordo recusado';", 0, 15, 4, 3),
    card("Acordos", "Acordos — Ticket médio", "scalar", "SELECT ROUND(AVG(proposta)::numeric,2) AS ticket_medio FROM public.acordos_carteira WHERE proposta IS NOT NULL;", 0, 19, 5, 3),
    card("Acordos", "Acordos — Por situação", "bar", """
        SELECT coalesce(nullif(btrim(situacao), ''), 'Não informado') AS situacao, COUNT(*) AS acordos
        FROM public.acordos_carteira GROUP BY 1 ORDER BY acordos DESC;
    """, 3, 0, 12, 7),
    card("Acordos", "Acordos — Por origem", "pie", """
        SELECT coalesce(nullif(btrim(origem_acordo), ''), 'Não informado') AS origem, COUNT(*) AS acordos
        FROM public.acordos_carteira GROUP BY 1 ORDER BY acordos DESC;
    """, 3, 12, 12, 7),
    card("Acordos", "Base — Acordos", "table", """
        SELECT cnj AS "Processo", situacao AS "Situação", tipo AS "Tipo", tarefa AS "Tarefa",
               proposta AS "Proposta", origem_acordo AS "Origem"
        FROM public.acordos_carteira ORDER BY id DESC LIMIT 2000;
    """, 10, 0, 24, 9),

    card("Liminar", "Liminar — Processos consultados", "scalar", "SELECT COUNT(*) AS processos FROM public.liminar;", 0, 0, 6, 3),
    card("Liminar", "Liminar — Deferidas pelo worker", "scalar", "SELECT COUNT(*) AS deferidas FROM public.liminar WHERE lower(coalesce(liminar,'')) = 'deferido';", 0, 6, 6, 3),
    card("Liminar", "Liminar — Indeferidas pelo worker", "scalar", "SELECT COUNT(*) AS indeferidas FROM public.liminar WHERE lower(coalesce(liminar,'')) = 'indeferido';", 0, 12, 6, 3),
    card("Liminar", "Liminar — Análises humanas", "scalar", "SELECT COUNT(*) AS analisadas FROM public.liminar_analyses;", 0, 18, 6, 3),
    card("Liminar", "Liminar — Resultado do worker", "bar", """
        SELECT coalesce(nullif(btrim(liminar), ''), 'Não informado') AS resultado, COUNT(*) AS processos
        FROM public.liminar GROUP BY 1 ORDER BY processos DESC;
    """, 3, 0, 12, 7),
    card("Liminar", "Liminar — Decisão da análise", "pie", """
        SELECT coalesce(nullif(btrim(decision), ''), 'Não informado') AS decisao, COUNT(*) AS analises
        FROM public.liminar_analyses GROUP BY 1 ORDER BY analises DESC;
    """, 3, 12, 12, 7),
    card("Liminar", "Liminar — Acurácia analisada", "bar", """
        SELECT coalesce(nullif(btrim(acerto_worker), ''), 'Não informado') AS resultado, COUNT(*) AS analises
        FROM public.vw_liminar_analyses_accuracy GROUP BY 1 ORDER BY analises DESC;
    """, 10, 0, 12, 7),
    card("Liminar", "Liminar — Análises recentes", "table", """
        SELECT processo AS "Processo", indicio AS "Indício", decisao_analista AS "Decisão",
               acerto_worker AS "Acurácia worker", observacoes AS "Observações",
               created_at AS "Analisado em", updated_at AS "Atualizado em"
        FROM public.vw_liminar_analyses_accuracy ORDER BY created_at DESC NULLS LAST LIMIT 1000;
    """, 10, 12, 12, 9),
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
        "description": "Operação consolidada em Metabase: jobs, pagamentos, timeline, DataJud, acordos e liminar.",
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
            "parameter_mappings": [],
            "visualization_settings": {},
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
    for tab in TABS:
        names = [item["name"] for item in CARDS if item["tab"] == tab]
        print(f"- {tab}: {len(names)} cards")
        for name in names:
            print(f"  - {name}")
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
