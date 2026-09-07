#!/usr/bin/env python3
"""Junta o que os extratores tiraram das apostilas ao banco em public/questions.json.

Roda depois de scripts/extrair-questoes-apostila.py. Traduz o modulo da apostila
para um topico do catalogo (scripts/apostila-topicos.json), escreve o comentario
e grava. E idempotente: questao com id ja presente e substituida, nunca duplicada.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BANCO = RAIZ / "public" / "questions.json"
MAPA = json.loads((RAIZ / "scripts" / "apostila-topicos.json").read_text(encoding="utf-8"))

# "IDADE CONTEMPORÂNEA" atravessa dois topicos do catalogo: o mundo ate 1945 e o
# mundo depois dele. A palavra decide, e o default e o periodo anterior, porque
# as apostilas trazem muito mais Primeira Guerra e entreguerras do que Guerra Fria.
POS_1945 = re.compile(
    r"\b(guerra fria|urss|uni[aã]o sovi[eé]tica|otan|varsóvia|muro de berlim|"
    r"descoloniza[cç][aã]o|apartheid|vietn[aã]|coreia|cuba|revolu[cç][aã]o cubana|"
    r"plano marshall|onu|oriente m[eé]dio|palestin|neoliberal|globaliza[cç][aã]o|"
    r"queda do muro|11 de setembro|guerra do golfe|guerra do golfo)\b",
    re.I,
)
PARNASIANISMO = re.compile(r"parnasian", re.I)


def topico(q: dict) -> str | None:
    if q["id"] in MAPA["_descartes"]:
        return None
    refinado = MAPA["_refinamentos"].get(q["id"])
    if refinado:
        return refinado
    modulo = q["modulo"]
    if modulo == "IDADE CONTEMPORÂNEA":
        alvo = q["prompt"] + " " + " ".join(o["text"] for o in q["options"])
        return "his_guerra_fria_contemporaneo" if POS_1945.search(alvo) else "his_imperialismo_guerras"
    if modulo == "REALISMO/NATURALISMO/PARNASIANISMO" and PARNASIANISMO.search(q["prompt"]):
        return "por_lit_modernismo"
    return MAPA.get(q["subject"], {}).get(modulo)


def comentario(q: dict) -> str:
    correta = next(o for o in q["options"] if o["id"] == q["correctOptionId"])
    banca = q["examSource"]["board"]
    return (
        f"Gabarito oficial da {banca}: alternativa {correta['id']}) {correta['text']}. "
        "Comentário detalhado ainda não escrito para esta questão."
    )


def main(entradas: list[str]) -> int:
    banco = json.loads(BANCO.read_text(encoding="utf-8"))
    por_id = {q["id"]: q for q in banco}
    antes = len(banco)

    novas: list[dict] = []
    sem_topico: dict[str, int] = {}
    for caminho in entradas:
        for q in json.loads(pathlib.Path(caminho).read_text(encoding="utf-8")):
            alvo = topico(q)
            if not alvo:
                if q["id"] in MAPA["_descartes"]:
                    continue
                chave = f"{q['subject']} / {q['modulo']}"
                sem_topico[chave] = sem_topico.get(chave, 0) + 1
                continue
            novas.append(
                {
                    "id": q["id"],
                    "topicId": alvo,
                    "subject": q["subject"],
                    "prompt": q["prompt"],
                    "options": q["options"],
                    "correctOptionId": q["correctOptionId"],
                    "explanation": comentario(q),
                    "difficulty": "medium",
                    "examSource": {"board": q["examSource"]["board"]},
                }
            )

    PENDENTE = "Comentário detalhado ainda não escrito"
    preservados = 0
    # A mesma questao aparece em mais de um modulo da apostila, com numeros
    # diferentes. Sem isto ela cairia duas vezes no mesmo simulado.
    ja_visto: dict[str, str] = {}
    unicas: list[dict] = []
    repetidas = 0
    for q in novas:
        # A mesma questao aparece em apostilas de materias diferentes com a
        # pontuacao final trocada (":" numa, ";" na outra); normalizar so o
        # espaco em branco deixava as duas passarem.
        chave = re.sub(r"[^\w ]+", "", " ".join(q["prompt"].split()).lower())
        if chave in ja_visto:
            repetidas += 1
            continue
        ja_visto[chave] = q["id"]
        unicas.append(q)
    novas = unicas

    # Regra de descarte nova significa questao que estava no banco e nao deveria
    # mais estar. Sem esta poda, apertar o extrator nao limpava nada: as questoes
    # ruins ficavam la, so paravam de ser atualizadas.
    prefixos = {q["id"].rsplit("_", 1)[0] for q in novas}
    ids_novos = {q["id"] for q in novas}
    podadas = [
        i for i in por_id
        if i.rsplit("_", 1)[0] in prefixos and i not in ids_novos
    ]
    for i in podadas:
        del por_id[i]

    for q in novas:
        # Comentario escrito a mao sobrevive a uma nova extracao: reprocessar as
        # apostilas nao pode apagar trabalho que nao esta em nenhum outro lugar.
        anterior = por_id.get(q["id"], {}).get("explanation", "")
        if anterior and PENDENTE not in anterior:
            q["explanation"] = anterior
            preservados += 1
        por_id[q["id"]] = q
    saida = list(por_id.values())
    BANCO.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"banco: {antes} -> {len(saida)} ({len(novas)} vindas das apostilas, "
          f"{preservados} com comentario preservado, {repetidas} repetidas, "
          f"{len(podadas)} podadas por regra nova)")
    for chave, n in sorted(sem_topico.items(), key=lambda kv: -kv[1]):
        print(f"    sem topico no mapa: {chave}: {n}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
