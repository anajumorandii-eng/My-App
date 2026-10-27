#!/usr/bin/env python3
"""Grava em public/questions.json um lote de questões autorais do CRIVO.

O lote (scripts/data/crivo-*.json) guarda, além da questão, a habilidade e a
pegadinha que ela treina; o banco recebe só os campos de `Question`. Recusa o
lote inteiro se uma questão estiver malformada, em vez de gravar metade:

- id fora do prefixo `crivo_`, ou que já pertence a uma questão não autoral;
- alternativas diferentes de a–e, repetidas ou vazias; gabarito inexistente;
- comentário que não abre com "Resposta X." ou que aponta pegadinha na
  própria alternativa correta (sinal de letra trocada ao embaralhar);
- `examSource`: questão autoral não é prova real, e o filtro "provas reais"
  da tela passaria a mostrá-la como se fosse. A banca imitada vai em
  `styleOf`, que o filtro de banca aceita só fora do "provas reais".

Uso: python3 scripts/aplicar-questoes-autorais.py scripts/data/crivo-<lote>.json
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BANCO = RAIZ / "public" / "questions.json"
CAMPOS = ("id", "chapter", "topicId", "subject", "prompt", "options", "correctOptionId", "explanation", "difficulty", "styleOf")


def problemas(q: dict) -> list[str]:
    erros = []
    if not q.get("id", "").startswith("crivo_"):
        erros.append("id sem prefixo crivo_")
    if "examSource" in q:
        erros.append("questão autoral com examSource")
    if not q.get("styleOf"):
        erros.append("sem styleOf: o filtro de banca não a encontraria")
    ids = [o.get("id") for o in q.get("options", [])]
    if ids != list("abcde") or any(not o.get("text", "").strip() for o in q["options"]):
        erros.append(f"alternativas {ids}")
    if len({o["text"].strip() for o in q.get("options", [])}) != len(ids):
        erros.append("alternativas repetidas")
    certa = q.get("correctOptionId")
    if certa not in ids:
        erros.append(f"gabarito {certa!r} inexistente")
    if q.get("difficulty") not in ("easy", "medium", "hard"):
        erros.append(f"dificuldade {q.get('difficulty')!r}")
    texto = q.get("explanation", "")
    if certa and not texto.startswith(f"Resposta {certa.upper()}."):
        erros.append("comentário não abre com a resposta do gabarito")
    apontadas = re.sub(r"[^A-E]", "", "".join(re.findall(r"^• ([A-E](?:(?:, | e )[A-E])*)", texto, re.M)))
    if certa and certa.upper() in apontadas:
        erros.append("pegadinha atribuída à alternativa correta")
    for campo in ("topicId", "subject", "chapter", "prompt"):
        if not str(q.get(campo, "")).strip():
            erros.append(f"{campo} vazio")
    return erros


def main(argv: list[str]) -> int:
    if len(argv) != 1:
        print(__doc__, file=sys.stderr)
        return 2
    lote = json.loads(pathlib.Path(argv[0]).read_text(encoding="utf-8"))
    banco = json.loads(BANCO.read_text(encoding="utf-8"))
    por_id = {q["id"]: i for i, q in enumerate(banco)}

    falhas = {q.get("id", "?"): p for q in lote if (p := problemas(q))}
    vistos = [q["id"] for q in lote]
    if len(set(vistos)) != len(vistos):
        falhas["lote"] = ["id repetido no lote"]
    if falhas:
        for ident, erros in falhas.items():
            print(f"  {ident}: {'; '.join(erros)}", file=sys.stderr)
        print("lote recusado; nada foi gravado", file=sys.stderr)
        return 1

    novas = substituidas = 0
    for q in lote:
        limpa = {c: q[c] for c in CAMPOS}
        if q["id"] in por_id:
            banco[por_id[q["id"]]] = limpa
            substituidas += 1
        else:
            banco.append(limpa)
            novas += 1

    BANCO.write_text(json.dumps(banco, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{novas} questões novas, {substituidas} substituídas; banco com {len(banco)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
