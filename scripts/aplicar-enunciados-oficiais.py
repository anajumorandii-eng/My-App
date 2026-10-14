"""Grava os enunciados conferidos de scripts/data/enunciados-oficiais.json
nas fichas revisadas de cada lote (campo `statement`) e no `prompt` das
mesmas questões em public/questions.json.

Recusa id que não exista nas fichas ou no banco, em vez de gravar pela metade.
Uso: python3 scripts/aplicar-enunciados-oficiais.py
"""
import glob
import json
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
enunciados = json.load(open(os.path.join(RAIZ, "scripts/data/enunciados-oficiais.json")))
fichas = {}
for fonte in glob.glob(os.path.join(RAIZ, "scripts/data/*-source.json")):
    src = json.load(open(fonte))
    arquivo = src.get("itemsFile") or fonte.replace("-source.json", ".json")
    arquivo = arquivo if os.path.isabs(arquivo) else os.path.join(RAIZ, arquivo)
    prefixo = src.get("idPrefix") or f"unicamp_{src['year']}"
    fichas[prefixo] = arquivo
banco_path = os.path.join(RAIZ, "public/questions.json")
banco = json.load(open(banco_path))
por_id = {q["id"]: q for q in banco}
erros = [i for i in enunciados if i not in por_id]
if erros:
    sys.exit(f"ids inexistentes no banco: {erros}")
alterados = {}
for qid, texto in enunciados.items():
    prefixo, numero = re.fullmatch(r"(.+)_q(\d+)", qid).groups()
    if prefixo not in fichas:
        sys.exit(f"lote sem fichas: {qid}")
    alterados.setdefault(fichas[prefixo], {})[int(numero)] = texto
    por_id[qid]["prompt"] = texto
for arquivo, textos in alterados.items():
    itens = json.load(open(arquivo))
    achados = 0
    for item in itens:
        if item["number"] in textos:
            item["statement"] = textos[item["number"]]
            achados += 1
    if achados != len(textos):
        sys.exit(f"{arquivo}: {len(textos) - achados} números sem ficha")
    json.dump(itens, open(arquivo, "w"), ensure_ascii=False, indent=2)
    open(arquivo, "a").write("\n")
json.dump(banco, open(banco_path, "w"), ensure_ascii=False, indent=2)
open(banco_path, "a").write("\n")
print(f"{len(enunciados)} enunciados aplicados")
