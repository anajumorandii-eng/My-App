#!/usr/bin/env python3
"""Acrescenta a pergunta de recuperacao a capitulos ja gravados.

Recebe JSON no formato {"materia": {"capitulo": {"prompt": ..., "elements":
[[rotulo, [palavras]], ...]}}} e grava o campo recall em
src/data/deepSummaryContent.json. Serve para os capitulos escritos antes de o
campo existir; os novos ja vem com recall exigido por juntar-resumos-profundos.
"""
from __future__ import annotations

import json
import pathlib
import sys

DESTINO = pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "deepSummaryContent.json"
ELEMENTOS_MINIMOS = 3


def main(entradas: list[str]) -> int:
    caps = json.loads(DESTINO.read_text(encoding="utf-8"))
    por_chave = {(c["subject"], c["topic"]): c for c in caps}
    problemas: list[str] = []
    escritos = 0
    for caminho in entradas:
        for materia, capitulos in json.loads(pathlib.Path(caminho).read_text(encoding="utf-8")).items():
            for topico, recall in capitulos.items():
                cap = por_chave.get((materia, topico))
                if cap is None:
                    problemas.append(f"{materia} / {topico}: capitulo inexistente")
                    continue
                if not recall.get("prompt") or len(recall.get("elements") or []) < ELEMENTOS_MINIMOS:
                    problemas.append(f"{materia} / {topico}: recall incompleto")
                    continue
                cap["recall"] = {"prompt": recall["prompt"], "elements": recall["elements"]}
                escritos += 1
    if problemas:
        for p in problemas:
            print(f"    {p}", file=sys.stderr)
        print(f"{len(problemas)} recusados; nada foi gravado", file=sys.stderr)
        return 1
    DESTINO.write_text(json.dumps(caps, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    restam = sum(1 for c in caps if not c.get("recall"))
    print(f"recall escrito em {escritos} capitulos; {restam} ainda sem recall proprio")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
