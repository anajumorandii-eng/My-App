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


# O cabecalho do texto-base da questao seguinte as vezes gruda no fim do bloco.
PROXIMA = re.compile(r"\s*TEXTO PARA (?:A|AS) (?:PR[OÓ]XIMA|QUEST).*$", re.I | re.S)
# O texto extraido presta ou nao presta: quem decide e ele proprio, nao o motivo
# do descarte. Decidir pelo motivo deixava passar 139 questoes que mostravam na
# tela "F Sol = GMm r 2" e alternativas com a questao seguinte grudada.
QUEBRADO = re.compile(
    r"[=×÷√∑∫≅≈≠≤≥∆Δ→↔^]"          # simbolo de formula solto
    r"|\d\s+\d"                      # expoente ou indice que virou digito separado
    r"|\b[A-Z]\s+\d"                 # variavel colada a um numero: "P 100"
    r"|\d\s+[,)]"                    # indice que se soltou: "(x 1 ,y 1 )"
    r"|\b[a-e]\)\s"                  # alternativa dentro do texto de outra
)


def texto_perdido(prompt: str, options: list[dict]) -> bool:
    textos = [o["text"] for o in options]
    if QUEBRADO.search(prompt) or any(QUEBRADO.search(t) for t in textos):
        return True
    if len({t.strip().lower() for t in textos}) != len(textos):
        return True
    # Alternativa muito mais longa que as outras costuma ser a que engoliu o
    # comeco da questao seguinte.
    if textos and max(map(len, textos)) > 4 * max(60, min(map(len, textos))):
        return True
    return False


def limpar_cauda(texto: str) -> str:
    return PROXIMA.sub("", texto).strip()


def com_imagem(q: dict) -> dict:
    """Questao recuperada pela pagina original: o texto entra quando presta."""
    numero = q["numero"]
    banca = q["examSource"]["board"]
    if texto_perdido(limpar_cauda(q["prompt"]), q["options"]):
        prompt = (
            f"{banca} · {q['subject']} · questão {numero} da coletânea. "
            "O enunciado, os dados e as alternativas estão na imagem da página original, abaixo."
        )
        options = [{"id": o["id"], "text": f"Alternativa {o['id'].upper()} da prova"} for o in q["options"]]
    else:
        prompt = limpar_cauda(q["prompt"])
        options = [{"id": o["id"], "text": limpar_cauda(o["text"])} for o in q["options"]]
    correta = next(o for o in options if o["id"] == q["correctOptionId"])
    return {
        "prompt": prompt,
        "options": options,
        "explanation": (
            f"Gabarito oficial da {banca}: alternativa {correta['id']}). "
            "Esta questão depende da figura, da fórmula ou do texto-base que só existem na "
            "página original — por isso ela vem com a imagem da página, e não só com o texto."
        ),
        "originalPages": q["originalPages"],
    }


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
            # Os arquivos .descartes.json guardam o que o extrator recusou, para
            # o recortador consumir; entrar aqui, so a versao ja recortada.
            if q.get("motivo") and not q.get("originalPages"):
                continue
            alvo = topico(q)
            if not alvo:
                chave = f"{q['subject']} / {q['modulo']}"
                sem_topico[chave] = sem_topico.get(chave, 0) + 1
                continue
            base = {
                "id": q["id"],
                "topicId": alvo,
                "subject": q["subject"],
                "correctOptionId": q["correctOptionId"],
                "difficulty": "medium",
                "examSource": {"board": q["examSource"]["board"]},
            }
            if q.get("originalPages"):
                base.update(com_imagem(q))
            else:
                base.update(
                    {
                        "prompt": limpar_cauda(q["prompt"]),
                        "options": [{"id": o["id"], "text": limpar_cauda(o["text"])} for o in q["options"]],
                        "explanation": comentario(q),
                    }
                )
            novas.append(base)

    # Comentarios que o proprio script escreve. Nao contam como trabalho a
    # preservar: se contassem, uma questao que sai da imagem para o texto (ou o
    # contrario) ficaria com o comentario da forma antiga, que nao vale mais.
    AUTOMATICOS = ("Comentário detalhado ainda não escrito", "por isso ela vem com a imagem")
    preservados = 0
    # A mesma questao aparece em mais de um modulo da apostila, com numeros
    # diferentes. Sem isto ela cairia duas vezes no mesmo simulado.
    ja_visto: dict[str, str] = {}
    unicas: list[dict] = []
    repetidas = 0
    # Quando a mesma questao aparece em duas apostilas e uma delas a aproveitou
    # em texto, e a versao em texto que fica: ela tem enunciado legivel e pode
    # ter comentario escrito a mao, que a versao por imagem nao tem.
    novas.sort(key=lambda q: bool(q.get("originalPages")))
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
        if anterior and not any(m in anterior for m in AUTOMATICOS):
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
