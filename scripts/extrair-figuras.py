"""Recorta só as figuras de cada questão a partir das páginas da prova.

A Ana Júlia pediu o texto da questão sem a página do PDF embaixo, mas com as
figuras (mapas, gráficos, esquemas) que o texto não carrega. A página inteira
trazia as questões vizinhas; aqui cada questão ganha apenas os recortes do
que é desenho.

Como acha a figura: o OCR marca onde há palavra; o que sobra de tinta fora
das palavras é desenho. Rótulos dentro do desenho voltam para o recorte porque
a caixa é expandida pelas palavras que encostam nela. Nas páginas inteiras
(Fuvest 2025, Unicamp 2026, Anglo) a questão é localizada antes pelo
cabeçalho numerado, em ordem de leitura de duas colunas, para não recortar a
figura da questão vizinha.

Uso: python3 scripts/extrair-figuras.py [--so id1,id2] [--previa dir]
Grava public/question-media/figuras/<id>-<k>.webp e o campo `figures` em
public/questions.json. Rode scripts/conferir-marca-dagua.py nos recortes.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor

import numpy as np
from PIL import Image
from scipy import ndimage

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(RAIZ, "public")
SAIDA = os.path.join(PUBLIC, "question-media", "figuras")
AMBIENTE = {**os.environ, "OMP_THREAD_LIMIT": "1"}

PAGINA_INTEIRA = ("/question-media/fuvest-2025/", "/question-media/oficiais/", "/question-media/anglo-geo-v1/")


def ocr(im: Image.Image) -> list[dict]:
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        im.save(tmp.name)
        nome = tmp.name
    try:
        tsv = subprocess.run(["tesseract", nome, "-", "-l", "por", "--psm", "3", "tsv"],
                             capture_output=True, text=True, env=AMBIENTE).stdout
    finally:
        os.unlink(nome)
    palavras = []
    for linha in tsv.splitlines()[1:]:
        c = linha.split("\t")
        if len(c) < 12 or not c[11].strip():
            continue
        palavras.append({"x": int(c[6]), "y": int(c[7]), "w": int(c[8]), "h": int(c[9]),
                         "conf": float(c[10]), "t": c[11].strip(),
                         "linha": (c[2], c[3], c[4])})
    return palavras


def cabecalhos_anglo(im: Image.Image) -> list[tuple[int, int]]:
    W = im.width
    meio = W / 2
    a = np.asarray(im.convert("L"))
    escuro = a < 130
    rot, _ = ndimage.label(escuro)
    caixas = []
    for s in ndimage.find_objects(rot):
        h, w = s[0].stop - s[0].start, s[1].stop - s[1].start
        col = int(s[1].start > meio)
        esquerda = s[1].start - (0 if col == 0 else meio)
        if 18 <= h <= 32 and 26 <= w <= 45 and escuro[s].mean() > 0.6 and esquerda < W * 0.15:
            caixas.append((col, s[0].start))
    return sorted(caixas)


def cabecalhos(im: Image.Image, palavras: list[dict], url: str) -> list[tuple[int, int, int]]:
    """(numero, coluna, y) de cada questão que começa nesta página."""
    W = im.width
    meio = W / 2
    achados = []
    if "/oficiais/" in url:
        for i, p in enumerate(palavras):
            if p["t"].upper().startswith("QUEST") and i + 1 < len(palavras):
                m = re.match(r"(\d{1,2})", palavras[i + 1]["t"])
                if m:
                    achados.append((int(m.group(1)), int(p["x"] > meio), p["y"]))
    elif "/fuvest-2025/" in url:
        linhas: dict = {}
        for p in palavras:
            linhas.setdefault(p["linha"], []).append(p)
        for ws in linhas.values():
            if len(ws) == 1 and re.fullmatch(r"\d{1,2}", ws[0]["t"]) and ws[0]["h"] >= 18:
                p = ws[0]
                col = int(p["x"] > meio)
                esquerda = 60 if col == 0 else meio + 20
                if p["x"] < esquerda + 40:
                    achados.append((int(p["t"]), col, p["y"]))
    elif "/apostilas/" in url:
        primeiras: dict = {}
        for p in palavras:
            primeiras.setdefault(p["linha"], p)
        for p in primeiras.values():
            m = re.fullmatch(r"(\d{1,3})\.", p["t"])
            if m and p["x"] < W * 0.2:
                achados.append((int(m.group(1)), 0, p["y"]))
    else:  # anglo: número branco num quadrado escuro, em sequência na página
        # O dígito branco no quadrado não é lido pelo OCR (testado com psm 7, 8,
        # 10 e 13). Os exercícios do capítulo 3 começam no 1 da página 43 e
        # seguem em sequência, então o número sai da contagem de quadrados.
        m = re.search(r"page-(\d+)\.jpg", url)
        if m and int(m.group(1)) >= 43:
            antes = 0
            for pag in range(43, int(m.group(1))):
                anterior = Image.open(os.path.join(PUBLIC, "question-media", "anglo-geo-v1", f"page-{pag}.jpg"))
                antes += len(cabecalhos_anglo(anterior))
            achados = [(1 + antes + i, col, y) for i, (col, y) in enumerate(cabecalhos_anglo(im))]
    return achados


def figuras_na_regiao(im: Image.Image, palavras: list[dict], caixa: tuple[int, int, int, int]) -> list[tuple[int, int, int, int]]:
    x0, y0, x1, y1 = caixa
    rgb = np.asarray(im.convert("RGB")).astype(int)[y0:y1, x0:x1]
    if rgb.size == 0:
        return []
    cinza = rgb.mean(axis=2)
    satur = rgb.max(axis=2) - rgb.min(axis=2)
    tinta = (cinza < 225) | (satur > 35)
    dentro = [p for p in palavras if p["conf"] > 30 and x0 <= p["x"] and p["x"] + p["w"] <= x1
              and y0 <= p["y"] and p["y"] + p["h"] <= y1]
    tocam = [p for p in palavras if p["conf"] > 30 and p["x"] < x1 and p["x"] + p["w"] > x0
             and p["y"] < y1 and p["y"] + p["h"] > y0]
    for p in tocam:
        if p["h"] > 60:  # "palavra" gigante é desenho lido como texto
            continue
        # Folga de 6 px: na página escaneada (Anglo) o halo borrado da letra
        # passa da caixa do OCR e sobrava como "desenho".
        tinta[max(0, p["y"] - y0 - 6):p["y"] - y0 + p["h"] + 6, max(0, p["x"] - x0 - 6):p["x"] - x0 + p["w"] + 6] = False
    # Fio de separação e régua de coluna: componente com uma dimensão fina e
    # outra longa. Sem isso o fio da coluna grudava no número da questão e
    # virava "figura" com o enunciado em volta.
    rot0, _ = ndimage.label(tinta)
    for i, sl in enumerate(ndimage.find_objects(rot0), 1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if min(h, w) <= 6 and max(h, w) > 60:
            tinta[sl][rot0[sl] == i] = False
    juntos = ndimage.binary_closing(ndimage.binary_dilation(tinta, iterations=16), iterations=6)
    rot, _ = ndimage.label(juntos)
    caixas = []
    for s in ndimage.find_objects(rot):
        h, w = s[0].stop - s[0].start, s[1].stop - s[1].start
        pixels = tinta[s].sum()
        if h < 70 or w < 70 or pixels < 900:
            continue
        caixas.append([s[1].start + x0, s[0].start + y0, s[1].stop + x0, s[0].stop + y0])
    # Rótulos que encostam no desenho entram no recorte, em cadeia: o "70°E"
    # do eixo puxa o vizinho. Linha longa (título, legenda) entra só se
    # encostar no desenho já com os rótulos, sem cadeia -- senão o título
    # puxava o parágrafo do enunciado que vem logo acima dele.
    linhas: dict = {}
    for p in dentro:
        linhas.setdefault(p["linha"], []).append(p)
    # Parágrafo de texto corrido (muitas palavras no mesmo bloco do OCR) nunca
    # entra em cadeia, mesmo nas linhas curtas do fim do parágrafo.
    por_par: dict = {}
    for p in dentro:
        por_par[p["linha"][:2]] = por_par.get(p["linha"][:2], 0) + 1
    curtas = [p for ws in linhas.values() if len(ws) < 5 and por_par[ws[0]["linha"][:2]] < 12 for p in ws]
    longas = [(min(p["x"] for p in ws), min(p["y"] for p in ws), max(p["x"] + p["w"] for p in ws),
               max(p["y"] + p["h"] for p in ws)) for ws in linhas.values() if len(ws) >= 5]

    margem = float(np.percentile([b[0] for b in longas], 20)) if longas else x0
    direita_texto = float(np.percentile([b[2] for b in longas], 80)) if longas else x1

    def encosta(c, b, mx, my):
        return b[0] < c[2] + mx and b[2] > c[0] - mx and b[1] < c[3] + my and b[3] > c[1] - my

    def absorve(c, b):
        novo = [min(c[0], b[0]), min(c[1], b[1]), max(c[2], b[2]), max(c[3], b[3])]
        mudou = novo != c
        c[:] = novo
        return mudou

    for c in caixas:
        mudou = True
        while mudou:
            mudou = False
            for p in curtas:
                b = (p["x"], p["y"], p["x"] + p["w"], p["y"] + p["h"])
                if encosta(c, b, 25, 16) and absorve(c, b):
                    mudou = True
        nucleo = c
        for b in longas * 3:
            # Linha que começa na margem do texto é enunciado ("conforme o mapa
            # a seguir"), não título (centralizado) nem legenda (recuada).
            if b[0] < margem + 12:
                continue
            if encosta(nucleo, b, 10, 16) and (b[2] - b[0]) < 1.6 * (nucleo[2] - nucleo[0]):
                absorve(c, b)
    # Linhas de texto corrido não podem ter sido engolidas: se a caixa cobre
    # mais palavras que desenho, era parágrafo com fio, não figura.
    finais = []
    for c in caixas:
        area = (c[2] - c[0]) * (c[3] - c[1])
        texto = sum(p["w"] * p["h"] for p in dentro if p["x"] >= c[0] and p["x"] + p["w"] <= c[2]
                    and p["y"] >= c[1] and p["y"] + p["h"] <= c[3])
        sub = tinta[c[1] - y0:c[3] - y0, c[0] - x0:c[2] - x0]
        if texto > 0.45 * area and sub.mean() < 0.04:
            continue
        # Pauta de anotação, quadro "Note e adote", tabela só de texto: tirando
        # as linhas longas, não sobra desenho.
        # Fio é traço longo e fino; área pintada (mapa) sobrevive à abertura
        # grossa e não conta como fio.
        fios = np.zeros_like(sub)
        for fino, grosso in (((1, 60), (9, 60)), ((60, 1), (60, 9))):
            fios |= ndimage.binary_opening(sub, structure=np.ones(fino)) & ~ndimage.binary_opening(sub, structure=np.ones(grosso))
        sem_fios = sub & ~ndimage.binary_dilation(fios, iterations=2)
        sem_fios = ndimage.binary_opening(sem_fios, structure=np.ones((2, 2)))
        cor = (satur[c[1] - y0:c[3] - y0, c[0] - x0:c[2] - x0] > 60).sum()
        if sem_fios.sum() < 1200 and cor < 2000:
            continue
        # Texto mal lido pelo OCR (página escaneada borrada) sobra como tinta,
        # mas em pedaços do tamanho de letra. Desenho tem traço contínuo maior.
        rot2, _ = ndimage.label(sem_fios)
        maiores = [min(sl[0].stop - sl[0].start, sl[1].stop - sl[1].start) for sl in ndimage.find_objects(rot2)]
        if (not maiores or max(maiores) < 18) and cor < 2000:
            continue
        W, H = im.size
        c = [max(0, c[0] - 8), max(0, c[1] - 8), min(W, c[2] + 8), min(H, c[3] + 8)]
        # Linha de texto cortada pela borda (a dilatação encosta no descendente
        # da linha vizinha) sai do recorte em vez de aparecer pela metade.
        for p in tocam:
            px0, py0, px1, py1 = p["x"], p["y"], p["x"] + p["w"], p["y"] + p["h"]
            if px1 <= c[0] or px0 >= c[2]:
                continue
            if py0 < c[1] < py1:
                c[1] = py1 + 1
            if py0 < c[3] < py1:
                c[3] = py0 - 1
        finais.append(tuple(c))
    finais = sorted(set(finais), key=lambda c: (c[1], c[0]))
    # Junta caixas sobrepostas.
    juntas: list[list[int]] = []
    for c in finais:
        for j in juntas:
            if c[0] < j[2] and c[2] > j[0] and c[1] < j[3] and c[3] > j[1]:
                j[:] = [min(j[0], c[0]), min(j[1], c[1]), max(j[2], c[2]), max(j[3], c[3])]
                break
        else:
            juntas.append(list(c))
    return [tuple(j) for j in juntas if j[2] - j[0] > 60 and j[3] - j[1] > 60]


def numero_da_questao(q: dict) -> int | None:
    n = (q.get("examSource") or {}).get("questionNumber")
    if n:
        return int(n)
    m = re.search(r"_q?(\d+)$", q["id"])
    return int(m.group(1)) if m else None


def regioes(q: dict, im: Image.Image, palavras: list[dict], url: str, comecou: bool):
    """Retângulos da página que pertencem à questão, e se ela já começou."""
    W, H = im.size
    if "/apostilas/" in url:
        topo, base, cols = int(H * 0.03), H, [(0, W)]
    else:
        # Na Anglo a faixa "Exercícios" ocupa o alto da página até 13%.
        topo, base = int(H * (0.13 if "anglo" in url else 0.055)), int(H * 0.955)
        direita = int(W * 0.93) if "anglo" in url else int(W * 0.985)
        cols = [(int(W * 0.02), W // 2), (W // 2, direita)]
    heads = sorted(((num, min(c, len(cols) - 1), y) for num, c, y in cabecalhos(im, palavras, url)),
                   key=lambda h: (h[1], h[2]))
    n = numero_da_questao(q)
    inicio = next(((c, y) for num, c, y in heads if num == n), None)
    if inicio is None:
        if not comecou:
            return [], False
        inicio = (0, topo)
    fim = (len(cols) - 1, base)
    seguinte = next(((c, y) for num, c, y in heads if (c, y) > inicio and num != n), fim)
    rs = []
    for c in range(inicio[0], seguinte[0] + 1):
        ya = inicio[1] if c == inicio[0] else topo
        yb = seguinte[1] - 4 if c == seguinte[0] else base
        if yb - ya > 40:
            rs.append((cols[c][0], max(ya, topo), cols[c][1], min(yb, base)))
    return rs, True


def processar(q: dict) -> tuple[str, list[dict], list[str]]:
    recortes, avisos = [], []
    paginas = q.get("originalPages") or []
    comecou = False
    for pg in paginas:
        caminho = os.path.join(PUBLIC, pg["url"].lstrip("/"))
        im = Image.open(caminho).convert("RGB")
        palavras = ocr(im)
        rs, comecou = regioes(q, im, palavras, pg["url"], comecou)
        for r in rs:
            for c in figuras_na_regiao(im, palavras, r):
                recortes.append((im, c))
    if not comecou:
        avisos.append(f"{q['id']}: cabeçalho da questão não achado")
    figs = []
    os.makedirs(SAIDA, exist_ok=True)
    for k, (im, c) in enumerate(recortes, 1):
        nome = f"{q['id']}-{k}.webp"
        im.crop(c).save(os.path.join(SAIDA, nome), "WEBP", quality=82)
        figs.append({"url": f"/question-media/figuras/{nome}"})
    return q["id"], figs, avisos


def main(argv: list[str]) -> int:
    so = None
    if "--so" in argv:
        so = set(argv[argv.index("--so") + 1].split(","))
    caminho = os.path.join(PUBLIC, "questions.json")
    with open(caminho, encoding="utf-8") as f:
        banco = json.load(f)
    alvo = [q for q in banco if q.get("originalPages") and (so is None or q["id"] in so)]
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as pool:
        res = {qid: (figs, av) for qid, figs, av in pool.map(processar, alvo, chunksize=4)}
    # Ícone decorativo da apostila (o bloco de notas) aparece igual em dezenas
    # de questões; figura de verdade é de uma questão só.
    def assinatura(url):
        with Image.open(os.path.join(PUBLIC, url.lstrip("/"))) as im:
            g = np.asarray(im.convert("L").resize((24, 24))).astype(int)
            return (im.width // 12, im.height // 12, (g < g.mean() - 10).tobytes())
    vistos: dict = {}
    for qid, (figs, _) in res.items():
        for f in figs:
            vistos.setdefault(assinatura(f["url"]), set()).add(qid)
    repetidas = {k for k, v in vistos.items() if len(v) >= 3}
    for qid, (figs, av) in res.items():
        manter = []
        for f in figs:
            if assinatura(f["url"]) in repetidas:
                os.unlink(os.path.join(PUBLIC, f["url"].lstrip("/")))
            else:
                manter.append(f)
        res[qid] = (manter, av)
    total = 0
    for q in banco:
        if q["id"] in res:
            figs, av = res[q["id"]]
            for a in av:
                print("AVISO", a, file=sys.stderr)
            if figs:
                q["figures"] = figs
                total += len(figs)
            else:
                q.pop("figures", None)
    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(banco, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{len(alvo)} questões; {sum(1 for v in res.values() if v[0])} com figura; {total} recortes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
