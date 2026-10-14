"""Rascunho do enunciado de cada questão oficial, a partir da prova.

As questões dos lotes oficiais (Unicamp 2025/2026, Fuvest 2026, Unesp,
Famerp, Unifesp, ENEM) diziam só "leia o enunciado nas páginas abaixo": o
texto existia apenas na imagem da página. A Ana Júlia pediu a questão em
texto, sem a página, então o enunciado precisa ser transcrito.

Quando o PDF oficial tem camada de texto (Comvest, Fuvest, INEP), as palavras
saem dele, exatas; as provas da Vunesp só são servidas como página HTML, e aí
as palavras saem do OCR das páginas já guardadas em public/question-media.
Em ambos os casos a questão vai do seu cabeçalho até o próximo, em ordem de
leitura de duas colunas; as alternativas ficam de fora (já estão em
`options`), e o texto-base compartilhado ("Para responder às questões de 01
a 05...") entra em cada questão que ele serve.

Isto é rascunho: a saída é conferida questão por questão contra a página
antes de ir para scripts/data/<lote>-enunciados.json. Fórmula com expoente,
tabela e texto dentro de figura não sobrevivem à extração.

Uso: python3 scripts/transcrever-enunciados.py <lote> <pdf-ou-"ocr"> <saida.json>
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from html import unescape

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AMBIENTE = {**os.environ, "OMP_THREAD_LIMIT": "1"}


def palavras_pdf(pdf: str, pagina: int) -> tuple[list[dict], float]:
    html = subprocess.run(["pdftotext", "-bbox", "-f", str(pagina), "-l", str(pagina), pdf, "-"],
                          capture_output=True, text=True).stdout
    largura = float(re.search(r'<page width="([\d.]+)"', html).group(1))
    ws = []
    for m in re.finditer(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</word>', html):
        x0, y0, x1, y1 = map(float, m.groups()[:4])
        ws.append({"x": x0, "y": y0, "x1": x1, "h": y1 - y0, "t": unescape(m.group(5))})
    return ws, largura


def palavras_ocr(imagem: str) -> tuple[list[dict], float]:
    im = Image.open(imagem).convert("L")
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        im.save(tmp.name)
        tsv = subprocess.run(["tesseract", tmp.name, "-", "-l", "por", "--psm", "3", "tsv"],
                             capture_output=True, text=True, env=AMBIENTE).stdout
    os.unlink(tmp.name)
    ws = []
    for linha in tsv.splitlines()[1:]:
        c = linha.split("\t")
        if len(c) < 12 or not c[11].strip() or float(c[10]) < 0:
            continue
        x, y, w, h = map(int, c[6:10])
        ws.append({"x": x, "y": y, "x1": x + w, "h": h, "t": c[11].strip()})
    # Famerp e Unesp põem o número em branco numa caixa colorida, que o OCR
    # da página lê como "[Z]" ou "[E]". A caixa invertida, lida só com
    # dígitos, devolve o número.
    for i, w in enumerate(ws):
        if w["t"].upper() in ("QUESTÃO", "QUESTAO") and i + 1 < len(ws) and not ws[i + 1]["t"].strip(".:").isdigit():
            caixa = im.crop((w["x1"] + 2, w["y"] - 8, w["x1"] + 60, w["y"] + w["h"] + 8))
            caixa = caixa.point(lambda v: 0 if v > 200 else 255).resize((caixa.width * 4, caixa.height * 4))
            fundo = Image.new("L", (caixa.width + 60, caixa.height + 60), 255)
            fundo.paste(caixa, (30, 30))
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
                fundo.save(tmp.name)
                t = subprocess.run(["tesseract", tmp.name, "-", "--psm", "7", "-c", "tessedit_char_whitelist=0123456789"],
                                   capture_output=True, text=True, env=AMBIENTE).stdout.strip()
            os.unlink(tmp.name)
            if t.isdigit():
                ws[i + 1] = {**ws[i + 1], "t": t, "y": w["y"]}
    return ws, float(im.width)


def cabecalhos(ws: list[dict], largura: float) -> list[tuple[int, int, float, int]]:
    """(número, coluna, y, índice da palavra) de cada questão na página."""
    achados = []
    for i, w in enumerate(ws):
        n = None
        if w["t"].upper().rstrip(":").startswith("QUEST") and i + 1 < len(ws):
            m = re.fullmatch(r"(\d{1,3})", ws[i + 1]["t"].strip(".:"))
            if m and abs(ws[i + 1]["y"] - w["y"]) < w["h"]:
                n = int(m.group(1))
        # Fuvest 2026: "{   18}", que o PDF guarda como "{", "18", "}".
        if re.fullmatch(r"\d{1,3}", w["t"]) and 0 < i < len(ws) - 1 and ws[i - 1]["t"] == "{" and ws[i + 1]["t"] == "}":
            n = int(w["t"])
        if n is not None:
            achados.append((n, int(w["x"] > largura / 2), w["y"], i))
    return achados


def linhas(ws: list[dict]) -> list[str]:
    ws = sorted(ws, key=lambda w: (w["y"], w["x"]))
    saida: list[list[dict]] = []
    for w in ws:
        if saida and abs(saida[-1][0]["y"] - w["y"]) < max(3.0, 0.5 * w["h"]):
            saida[-1].append(w)
        else:
            saida.append([w])
    return [" ".join(p["t"] for p in sorted(l, key=lambda p: p["x"])) for l in saida]


OPCAO = re.compile(r"^\(?([A-Ea-e])\)\s")
COMPARTILHADO = re.compile(r"(responder|resolver)\s+[àa]s\s+quest[õo]es\s+de\s+(\d+)\s+a\s+(\d+)", re.I)


def separar(texto: list[str]) -> str:
    """Tira as alternativas, que já estão em `options`. O bloco começa no
    primeiro "a)"/"(A)" seguido, mais adiante, de "b)"/"(B)"; "Note e adote"
    depois das alternativas é parte do enunciado e volta."""
    corte = None
    for i, l in enumerate(texto):
        m = OPCAO.match(l)
        if m and m.group(1).lower() == "a" and any(OPCAO.match(x) and OPCAO.match(x).group(1).lower() == "b" for x in texto[i + 1:]):
            corte = i
            break
    if corte is None:
        return "\n".join(texto)
    antes = texto[:corte]
    depois = []
    for j, l in enumerate(texto[corte:]):
        if re.match(r"^(Note e adote|Dados?:|Considere)", l, re.I):
            depois = texto[corte + j:]
            break
    return "\n".join(antes + ([""] + depois if depois else []))


def juntar_hifen(t: str) -> str:
    t = re.sub(r"(\w)[-¬]\n(\w)", r"\1\2", t)
    t = re.sub(r"(?<![.:;?!”\"])\n(?=[a-zà-ú])", " ", t)
    return t.replace("¬", " ").strip()


def main(argv: list[str]) -> int:
    lote, fonte, saida = argv
    source = json.load(open(os.path.join(RAIZ, "scripts", "data", f"{lote}-source.json")))
    paginas = sorted(m["page"] for m in source["media"])
    url = {m["page"]: m["url"] for m in source["media"]}
    fluxo: list[tuple[str, dict]] = []  # ("h", {n}) ou ("w", palavra)
    for p in paginas:
        if fonte == "ocr":
            ws, largura = palavras_ocr(os.path.join(RAIZ, "public", url[p].lstrip("/")))
        else:
            ws, largura = palavras_pdf(fonte, p)
        heads = cabecalhos(ws, largura)
        pular = {j for *_, i in heads for j in (i - 1, i, i + 1)}
        topo = min((w["y"] for w in ws), default=0) + 0.04 * largura
        for col in (0, 1):
            dentro = [(w["y"], i, w) for i, w in enumerate(ws) if int(w["x"] > largura / 2) == col
                      and i not in pular and w["y"] > topo]
            marcas = sorted((y, n) for n, c, y, _ in heads if c == col)
            # Corta a coluna em trechos: antes do 1º cabeçalho continua a questão anterior.
            limites = [y for y, _ in marcas] + [float("inf")]
            trecho = [w for y, _, w in dentro if y < limites[0]]
            fluxo.append(("w", {"ws": trecho}))
            for k, (y, n) in enumerate(marcas):
                fluxo.append(("h", {"n": n}))
                fluxo.append(("w", {"ws": [w for yy, _, w in dentro if y <= yy < limites[k + 1]]}))
    blocos: dict[int, list[str]] = {}
    atual = None
    compartilhado: dict[int, list[str]] = {}
    for tipo, d in fluxo:
        if tipo == "h":
            atual = d["n"]
            blocos.setdefault(atual, [])
            continue
        ls = linhas(d["ws"])
        # Texto-base compartilhado começa no próprio trecho e serve a um intervalo.
        for i, l in enumerate(ls):
            m = COMPARTILHADO.search(l)
            if m:
                proprio, comum = ls[:i], ls[i:]
                if atual is not None:
                    blocos[atual] += proprio
                for n in range(int(m.group(2)), int(m.group(3)) + 1):
                    compartilhado[n] = comum
                atual = None
                break
        else:
            if atual is not None:
                blocos[atual] += ls
            elif ls and compartilhado:
                ultimo = max(compartilhado)
                for n, comum in compartilhado.items():
                    if comum is compartilhado[ultimo]:
                        comum += ls
    prefixo = source.get("idPrefix") or "unicamp_2026"
    resultado = {}
    for n in sorted(blocos):
        partes = []
        if n in compartilhado:
            partes.append(juntar_hifen("\n".join(compartilhado[n])))
        partes.append(juntar_hifen(separar(blocos[n])))
        resultado[f"{prefixo}_q{n:02d}"] = "\n\n".join(p for p in partes if p)
    json.dump(resultado, open(saida, "w"), ensure_ascii=False, indent=1)
    print(f"{lote}: {len(resultado)} enunciados")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
