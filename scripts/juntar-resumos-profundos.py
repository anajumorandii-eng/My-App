#!/usr/bin/env python3
"""Acrescenta capitulos a src/data/deepSummaryContent.json.

Recebe arquivos JSON com uma lista de capitulos no mesmo formato do destino
({subject, topic, sections:[{title, content}]}) e junta ao que ja existe.
Capitulo com o mesmo par subject+topic e substituido, nunca duplicado, para
que reescrever um lote seja seguro.

Confere tres coisas antes de gravar, porque o app confia nelas: o capitulo tem
de existir no curriculo (senao nunca sera exibido), tem de ter cinco secoes na
ordem que applyDeepSummary espera, e cada secao precisa de conteudo de verdade
-- foi o resumo de duas frases que motivou este trabalho, e nao adianta trocar
duas frases curtas por cinco ainda mais curtas.

Exige tambem a pergunta de recuperacao (campo recall), porque applyDeepSummary
substitui a pergunta antiga do resumo pela do capitulo: capitulo sem recall
deixa o resumo sem nenhuma pergunta.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "src" / "data" / "deepSummaryContent.json"
CURRICULO = RAIZ / "src" / "data" / "summaryCurriculum.ts"

MINIMO_POR_SECAO = 240
SECOES_ESPERADAS = 5
ELEMENTOS_MINIMOS = 3


def titulos_do_curriculo() -> set[tuple[str, str]]:
    """Pares (materia, capitulo) que o app sabe exibir.

    O curriculo e TypeScript, e le-lo por expressao regular exige aceitar as
    duas formas de aspas -- o arquivo usa duplas, e supor simples fez a
    checagem recusar o curriculo inteiro na primeira vez que rodou.
    """
    texto = CURRICULO.read_text(encoding="utf-8")
    campo = r"""(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')"""
    achados = set()
    for m in re.finditer(rf"title:\s*{campo}\s*,\s*subject:\s*{campo}", texto):
        titulo = m.group(1) if m.group(1) is not None else m.group(2)
        materia = m.group(3) if m.group(3) is not None else m.group(4)
        achados.add((materia, titulo))
    return achados


def main(entradas: list[str]) -> int:
    existentes = json.loads(DESTINO.read_text(encoding="utf-8"))
    por_chave = {(c["subject"], c["topic"]): c for c in existentes}
    antes = len(por_chave)
    validos = titulos_do_curriculo()

    problemas: list[str] = []
    novos = 0
    for caminho in entradas:
        for cap in json.loads(pathlib.Path(caminho).read_text(encoding="utf-8")):
            chave = (cap["subject"], cap["topic"])
            onde = f"{cap['subject']} / {cap['topic']}"
            if chave not in validos:
                problemas.append(f"{onde}: nao existe no curriculo")
                continue
            if len(cap["sections"]) != SECOES_ESPERADAS:
                problemas.append(f"{onde}: {len(cap['sections'])} secoes, esperadas {SECOES_ESPERADAS}")
                continue
            curtas = [s["title"] for s in cap["sections"] if len(s["content"]) < MINIMO_POR_SECAO]
            if curtas:
                problemas.append(f"{onde}: secoes curtas demais: {curtas}")
                continue
            # Sem pergunta de recuperacao o resumo vira texto para ler, e o
            # ciclo de estudo do app depende dela. Escrever o capitulo sem
            # recall foi o que deixou 111 resumos mudos antes desta checagem.
            recall = cap.get("recall")
            if not recall or not recall.get("prompt"):
                problemas.append(f"{onde}: falta a pergunta de recuperacao (recall)")
                continue
            elementos = recall.get("elements") or []
            if len(elementos) < ELEMENTOS_MINIMOS:
                problemas.append(f"{onde}: recall com {len(elementos)} elementos, minimo {ELEMENTOS_MINIMOS}")
                continue
            sem_palavra = [rotulo for rotulo, chaves in elementos if not chaves]
            if sem_palavra:
                problemas.append(f"{onde}: elementos sem palavras-chave: {sem_palavra}")
                continue
            por_chave[chave] = cap
            novos += 1

    if problemas:
        for p in problemas:
            print(f"    {p}", file=sys.stderr)
        print(f"{len(problemas)} capitulos recusados; nada foi gravado", file=sys.stderr)
        return 1

    saida = sorted(por_chave.values(), key=lambda c: (c["subject"], c["topic"]))
    DESTINO.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"capitulos com resumo profundo: {antes} -> {len(saida)} ({novos} escritos neste lote)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
