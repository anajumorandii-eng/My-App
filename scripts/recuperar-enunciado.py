#!/usr/bin/env python3
"""Repoe enunciado e alternativas de questoes que ficaram so com a imagem.

Algumas questoes da apostila perderam o texto na extracao e entraram no banco
com um enunciado provisorio que apenas remete a imagem da pagina. Este script
recebe um JSON {id: {"prompt": ..., "options": {"a": ...}, "explanation": ...}}
com o texto lido da propria imagem e grava no banco.

Mantem originalPages como esta: o objetivo e devolver o texto, nao reclassificar
a questao. O campo "correct" e aceito, mas so deve ser usado quando a resolucao
e inequivoca e a chave impressa na coletanea diverge dela -- acontece, e deixar
a chave errada faria o app corrigir a aluna ao contrario. Toda troca de chave e
listada na saida, para que a decisao fique visivel em vez de silenciosa.

Recusa id inexistente e alternativa que nao existe na questao, para que um
engano apareca agora e nao vire questao quebrada.
"""
from __future__ import annotations

import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
BANCO = RAIZ / "public" / "questions.json"


def main(entradas: list[str]) -> int:
    banco = json.loads(BANCO.read_text(encoding="utf-8"))
    por_id = {q["id"]: q for q in banco}

    problemas: list[str] = []
    trocas: list[str] = []
    aplicados = 0
    for caminho in entradas:
        for ident, dados in json.loads(pathlib.Path(caminho).read_text(encoding="utf-8")).items():
            if ident.startswith("_"):
                continue
            questao = por_id.get(ident)
            if questao is None:
                problemas.append(f"{ident}: id inexistente no banco")
                continue
            existentes = {o["id"] for o in questao["options"]}
            desconhecidas = set(dados.get("options", {})) - existentes
            if desconhecidas:
                problemas.append(f"{ident}: alternativas inexistentes {sorted(desconhecidas)}")
                continue
            if "prompt" in dados:
                questao["prompt"] = dados["prompt"].strip()
            for letra, texto in dados.get("options", {}).items():
                for opcao in questao["options"]:
                    if opcao["id"] == letra:
                        opcao["text"] = texto.strip()
            if "correct" in dados and dados["correct"] != questao["correctOptionId"]:
                if dados["correct"] not in existentes:
                    problemas.append(f"{ident}: chave {dados['correct']} nao existe")
                    continue
                trocas.append(f"{ident}: chave {questao['correctOptionId']} -> {dados['correct']}")
                questao["correctOptionId"] = dados["correct"]
            if "explanation" in dados:
                questao["explanation"] = dados["explanation"].strip()
            aplicados += 1

    if problemas:
        for p in problemas:
            print(f"    {p}", file=sys.stderr)
        print(f"{len(problemas)} recusados; nada foi gravado", file=sys.stderr)
        return 1

    BANCO.write_text(json.dumps(banco, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for t in trocas:
        print(f"    chave corrigida -- {t}")
    print(f"enunciado recuperado em {aplicados} questoes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
