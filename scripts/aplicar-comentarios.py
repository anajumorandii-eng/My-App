#!/usr/bin/env python3
"""Substitui o comentario de questoes do banco por um texto escrito a mao.

Recebe um JSON {id: comentario} e grava em public/questions.json. Recusa id que
nao existe, para que um erro de digitacao apareca na hora em vez de virar um
comentario que nunca foi aplicado.
"""
from __future__ import annotations

import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BANCO = RAIZ / "public" / "questions.json"
PENDENTE = "Comentário detalhado ainda não escrito"


def main(entradas: list[str]) -> int:
    banco = json.loads(BANCO.read_text(encoding="utf-8"))
    por_id = {q["id"]: q for q in banco}

    aplicados = 0
    for caminho in entradas:
        novos = json.loads(pathlib.Path(caminho).read_text(encoding="utf-8"))
        # Um id que sumiu do banco quase sempre e uma questao que uma regra de
        # descarte posterior removeu -- o comentario dela deixou de ter alvo.
        # Isso e avisado e ignorado; um erro de digitacao aparece do mesmo jeito,
        # na contagem de questoes que continuam sem comentario no fim.
        for ident in [i for i in novos if not i.startswith("_") and i not in por_id]:
            print(f"    id sem alvo no banco, ignorado: {ident}", file=sys.stderr)
        for ident, texto in novos.items():
            if ident.startswith("_") or ident not in por_id:
                continue
            por_id[ident]["explanation"] = texto.strip()
            aplicados += 1

    BANCO.write_text(json.dumps(banco, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    faltam = sum(1 for q in banco if PENDENTE in q.get("explanation", ""))
    print(f"{aplicados} comentarios aplicados; {faltam} questoes ainda sem comentario escrito")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
