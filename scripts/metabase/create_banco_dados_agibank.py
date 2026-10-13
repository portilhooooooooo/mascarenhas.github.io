#!/usr/bin/env python3
"""Metabase: Banco de Dados - Agibank <> MBA.

Cria exclusivamente um dashboard com três abas e perguntas salvas (table).
As consultas usam tabelas atuais, com colunas explicitamente selecionadas e
portfolio_id fixado em agibank_mba. Nunca cria, copia ou migra bancos/tabelas.

Modo padrão: plano sem mutações.
Modo aplicação: MB_URL, MB_SESSION ou MB_API_KEY, MB_DATABASE_ID e --apply.
"""
from __future__ import annotations

import argparse
import json
import os
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

NAME = "Banco de Dados - Agibank <> MBA"
TABS = ("Encerramentos", "Tarefas", "Andamentos")

CARDS = (
    {
        "tab": "Encerramentos", "name": "Encerramentos — Retorno dos validados",
        "sql": """
            SELECT ep.cnj AS "Processo", ep.pasta AS "Pasta",
                   ep.uf AS "UF", ep.comarca AS "Comarca",
                   ep.dt_entrada AS "Entrada",
                   ep.datajud_tipo AS "Indício DataJud",
                   ep.tipo_validado AS "Tipo validado",
                   CASE ep.validacao_decisao
                     WHEN 'apto' THEN 'Apto'
                     WHEN 'nao_apto' THEN 'Não apto'
                     ELSE ep.validacao_decisao END AS "Decisão do analista",
                   ep.fase_recursal AS "Fase recursal",
                   p.name AS "Analista",
                   a.reason AS "Motivo", a.notes AS "Observações",
                   ep.validado_em AS "Validado em",
                   ep.enviado_benner_em AS "Enviado ao Benner em",
                   ep.benner_referencia AS "Referência Benner"
            FROM public.encerramentos_processos ep
            LEFT JOIN public.profiles p ON p.id = ep.analista_id
            LEFT JOIN public.encerramento_analyses a
              ON a.id = ep.analysis_id AND a.portfolio_id = ep.portfolio_id
            WHERE ep.portfolio_id = 'agibank_mba'
              AND ep.validado_em IS NOT NULL
              AND ep.validacao_decisao IS NOT NULL
            ORDER BY ep.validado_em DESC, ep.cnj
        """,
        "row": 0, "size_y": 12,
    },
    {
        "tab": "Tarefas", "name": "Tarefas — Retorno por processo",
        "sql": """
            SELECT t.type AS "Tipo de tarefa", t.title AS "Tarefa",
                   tp.case_number AS "Processo", tp.party_name AS "Parte",
                   t.priority AS "Prioridade", t.status AS "Status da tarefa",
                   tp.status AS "Status do processo",
                   assigned.name AS "Atribuído a", responsible.name AS "Responsável",
                   t.source AS "Origem da tarefa", tp.source AS "Origem do processo",
                   t.deadline_at AS "Prazo",
                   COALESCE(closing.decision, defense.decision, injunction.decision,
                            receipt.resolved_status, agreement.result) AS "Resultado da análise",
                   COALESCE(closing.reason, defense.reason, agreement.return_reason)
                     AS "Motivo do retorno",
                   COALESCE(closing.notes, defense.notes, injunction.notes)
                     AS "Observações da análise",
                   defense.criteria AS "Critérios da defesa",
                   receipt_answers.answers AS "Respostas da validação de pagamento",
                   agreement.has_agreement AS "Possui acordo",
                   COALESCE(receipt_answers.completed_at, receipt.completed_at,
                            agreement.completed_at, closing.created_at,
                            defense.created_at, injunction.created_at)
                     AS "Analisado em",
                   tp.created_at AS "Criado em", tp.updated_at AS "Atualizado em"
            FROM public.task_processes tp
            JOIN public.tasks t ON t.id = tp.task_id AND t.portfolio_id = tp.portfolio_id
            LEFT JOIN public.profiles assigned ON assigned.id = tp.assignee_id
            LEFT JOIN public.profiles responsible ON responsible.id = t.responsible_id
            LEFT JOIN public.encerramento_analyses closing
              ON closing.task_process_id = tp.id AND closing.portfolio_id = tp.portfolio_id
            LEFT JOIN public.defesa_analyses defense
              ON defense.task_process_id = tp.id AND defense.portfolio_id = tp.portfolio_id
            LEFT JOIN public.liminar_analyses injunction
              ON injunction.task_process_id = tp.id AND injunction.portfolio_id = tp.portfolio_id
            LEFT JOIN public.payment_receipt_analyses receipt
              ON receipt.task_process_id = tp.id AND receipt.portfolio_id = tp.portfolio_id
            LEFT JOIN public.payment_receipt_answers_v2 receipt_answers
              ON receipt_answers.task_process_id = tp.id
                AND receipt_answers.portfolio_id = tp.portfolio_id
            LEFT JOIN public.agreement_analyses agreement
              ON agreement.task_process_id = tp.id AND agreement.portfolio_id = tp.portfolio_id
            WHERE tp.portfolio_id = 'agibank_mba'
            ORDER BY tp.updated_at DESC, tp.case_number
        """,
        "row": 0, "size_y": 11,
    },
    {
        "tab": "Tarefas", "name": "Tarefas — Histórico de retornos e respostas",
        "sql": """
            SELECT t.type AS "Tipo", t.title AS "Tarefa",
                   tp.case_number AS "Processo", e.event_type AS "Evento",
                   p.name AS "Usuário", e.metadata AS "Dados registrados",
                   e.created_at AS "Registrado em"
            FROM public.task_events e
            JOIN public.task_processes tp
              ON tp.id = e.task_process_id AND tp.portfolio_id = e.portfolio_id
            JOIN public.tasks t ON t.id = tp.task_id AND t.portfolio_id = e.portfolio_id
            LEFT JOIN public.profiles p ON p.id = e.user_id
            WHERE e.portfolio_id = 'agibank_mba'
            ORDER BY e.created_at DESC
        """,
        "row": 12, "size_y": 11,
    },
    {
        "tab": "Andamentos", "name": "Andamentos — Envios de encerramentos",
        "sql": """
            SELECT e.cnj AS "Processo", e.tipo_validado AS "Tipo validado",
                   e.andamento AS "Texto do andamento",
                   e.status AS "Status do envio",
                   CASE WHEN e.status = 'ENVIADO' THEN 'Confirmado pelo worker'
                     WHEN e.status = 'ERRO' THEN 'Falha no envio'
                     WHEN e.status = 'PROCESSANDO' THEN 'Processando'
                     WHEN e.status = 'NA_FILA' THEN 'Aguardando'
                     ELSE 'Verificar' END AS "Situação",
                   p.name AS "Solicitante", e.solicitado_em AS "Solicitado em",
                   e.processado_em AS "Processado em",
                   e.enviado_em AS "Enviado em",
                   e.benner_referencia AS "Referência Benner",
                   e.erro AS "Erro"
            FROM public.encerramentos_benner_envios e
            LEFT JOIN public.profiles p ON p.id = e.solicitado_por
            WHERE e.portfolio_id = 'agibank_mba'
            ORDER BY e.solicitado_em DESC
        """,
        "row": 0, "size_y": 11,
    },
    {
        "tab": "Andamentos", "name": "Andamentos — Motivo da derrota",
        "sql": """
            SELECT e.cnj AS "Processo", e.motivo AS "Motivo",
                   e.status AS "Status do envio", p.name AS "Solicitante",
                   e.criado_em AS "Solicitado em", e.processado_em AS "Processado em",
                   e.enviado_em AS "Enviado em",
                   e.benner_referencia AS "Referência Benner", e.erro AS "Erro"
            FROM public.motivo_derrota_envios e
            LEFT JOIN public.profiles p ON p.id = e.solicitado_por
            WHERE e.portfolio_id = 'agibank_mba'
            ORDER BY e.criado_em DESC
        """,
        "row": 12, "size_y": 10,
    },
    {
        "tab": "Andamentos", "name": "Andamentos — Histórico importado do Benner",
        "sql": """
            SELECT h.cnj AS "Processo", h.nr_pasta AS "Pasta",
                   h.ds_andamento AS "Andamento", h.tipo AS "Tipo",
                   h.situacao AS "Situação no Benner",
                   h.andamento_em AS "Data do andamento",
                   h.encerrado_em AS "Data do encerramento",
                   h.fonte AS "Fonte", h.importado_em AS "Importado em"
            FROM public.encerramentos_benner_historico h
            WHERE h.portfolio_id = 'agibank_mba'
            ORDER BY h.andamento_em DESC NULLS LAST, h.importado_em DESC
        """,
        "row": 23, "size_y": 11,
    },
)


def request(method, base_url, session, path, payload=None):
    # Metabase permite autenticação por sessão curta ou chave de API com escopo próprio.
    auth_header = {"X-API-Key": session[4:]} if session.startswith("key:") else {"X-Metabase-Session": session}
    req = Request(
        base_url.rstrip("/") + path,
        data=json.dumps(payload).encode("utf-8") if payload is not None else None,
        method=method,
        headers={
            "Content-Type": "application/json",
            **auth_header,
        },
    )
    try:
        with urlopen(req, timeout=35) as response:
            raw = response.read()
            return json.loads(raw) if raw else {}
    except HTTPError as exc:
        # Do not print headers, cookies, session, DB credentials or error bodies.
        raise RuntimeError(f"Metabase respondeu HTTP {exc.code} em {method} {path.split('?')[0]}") from exc


def check_preconditions(url, session, database):
    metadata = request("GET", url, session, f"/api/database/{database}")
    if not isinstance(metadata, dict) or metadata.get("id") != database:
        raise RuntimeError("ID de conexão do Metabase não encontrado.")
    if metadata.get("engine") != "postgres":
        raise RuntimeError("A conexão do Metabase selecionada precisa ser PostgreSQL.")
    sample = request("POST", url, session, "/api/dataset", {
        "database": database, "type": "native",
        "native": {
            "query": "SELECT count(*) AS registros FROM public.encerramentos_processos WHERE portfolio_id = 'agibank_mba'",
            "template-tags": {},
        },
    })
    if "error" in sample or sample.get("status") == "failed":
        raise RuntimeError("A conexão não permite consultar a base operacional de encerramentos.")
    # Protect against duplicate dashboard creation: leave any matching dashboard untouched.
    results = request("GET", url, session, "/api/search?q=" + quote("Banco de Dados"))
    matches = results.get("data", results) if isinstance(results, dict) else results
    if any(row.get("model") == "dashboard" and row.get("name") == NAME for row in matches):
        raise RuntimeError("Dashboard com este nome já existe; criação abortada para evitar duplicidade.")


def create_card(url, session, database, specification):
    return request("POST", url, session, "/api/card", {
        "name": specification["name"], "description": None,
        "collection_id": None, "display": "table",
        "dataset_query": {
            "database": database, "type": "native",
            "native": {"query": specification["sql"].strip(), "template-tags": {}},
        },
        "visualization_settings": {},
    })["id"]


def apply(url, session, database):
    check_preconditions(url, session, database)
    dashboard_id = None
    saved_cards = []
    try:
        dash = request("POST", url, session, "/api/dashboard", {
            "name": NAME,
            "description": "Relatórios somente leitura da carteira Agibank <> MBA sobre registros operacionais existentes. Não cria tabelas.",
            "collection_id": None,
        })
        dashboard_id = dash["id"]
        tab_ids = {name: -(i + 1) for i, name in enumerate(TABS)}
        dashcards = []
        for i, spec in enumerate(CARDS):
            card_id = create_card(url, session, database, spec)
            saved_cards.append(card_id)
            dashcards.append({
                "id": -(i + 1), "card_id": card_id,
                "dashboard_tab_id": tab_ids[spec["tab"]],
                "row": spec["row"], "col": 0, "size_x": 24, "size_y": spec["size_y"],
                "parameter_mappings": [], "visualization_settings": {},
            })
        request("PUT", url, session, f"/api/dashboard/{dashboard_id}", {
            "tabs": [
                {"id": tab_ids[name], "name": name, "position": idx}
                for idx, name in enumerate(TABS)
            ],
            "dashcards": dashcards,
            "enable_embedding": True,
            "embedding_params": {},
        })
        return dashboard_id
    except Exception:
        # Delete only objects this particular execution just created.
        if dashboard_id is not None:
            try:
                request("DELETE", url, session, f"/api/dashboard/{dashboard_id}")
            except Exception:
                pass
        for card_id in saved_cards:
            try:
                request("DELETE", url, session, f"/api/card/{card_id}")
            except Exception:
                pass
        raise


def main():
    parser = argparse.ArgumentParser(description=NAME)
    parser.add_argument("--apply", action="store_true", help="Cria dashboard e perguntas no Metabase existente.")
    args = parser.parse_args()
    print(NAME)
    for tab in TABS:
        print(f"{tab}: {sum(c['tab'] == tab for c in CARDS)} tabela(s)")
    print("Operações em banco de dados: NENHUMA. Escopo SQL: portfolio_id = 'agibank_mba'.")
    if not args.apply:
        print("Plano somente. Para aplicar: MB_URL, MB_DATABASE_ID e MB_SESSION ou MB_API_KEY + --apply.")
        return
    url = os.environ.get("MB_URL", "").strip()
    database_id = os.environ.get("MB_DATABASE_ID", "").strip()
    session = os.environ.get("MB_SESSION", "").strip()
    api_key = os.environ.get("MB_API_KEY", "").strip()
    if session and api_key:
        raise SystemExit("Informe MB_SESSION ou MB_API_KEY, não os dois.")
    auth = "key:" + api_key if api_key else session
    if not url or not auth or not database_id.isdigit() or int(database_id) <= 0:
        raise SystemExit("MB_URL, MB_DATABASE_ID e MB_SESSION ou MB_API_KEY válidos são obrigatórios.")
    dashboard_id = apply(url, auth, int(database_id))
    print(f"Dashboard criado: {dashboard_id}")
    print(f"Configurar no backend de testes: METABASE_BANCO_DADOS_DASHBOARD_ID={dashboard_id}")


if __name__ == "__main__":
    main()
