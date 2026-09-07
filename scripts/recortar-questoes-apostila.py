#!/usr/bin/env python3
"""Recorta da apostila em PDF a regiao de cada questao que o extrator descartou.

A maior parte do que o extrator recusa e questao inteira e correta: o que nao
sobrevive a extracao em texto e a figura, a formula ou o texto-base. Tudo isso
continua existindo na pagina do PDF, entao a saida daqui e uma imagem por
questao, anexada a ela pelo campo originalPages -- o mesmo caminho que as
questoes da FUVEST 2025 ja usavam.

Tres regras no recorte:

1. A faixa de baixo da pagina sai sempre. E la que fica a marca d'agua com
   nome, e-mail e CPF da licenciada, e este repositorio e publico. Como a marca
   viraria pixel, nenhuma checagem de texto a pegaria depois -- por isso o corte
   e por construcao, calculado a partir da posicao do rodape, e conferido por
   OCR no fim.
2. Questao que depende de um texto-base compartilhado ganha a pagina inteira, e
   a anterior quando comeca perto do topo: o texto que falta esta logo acima.
3. O recorte para no cabecalho "TEXTO PARA AS PROXIMAS QUESTOES", que anuncia o
   texto-base da questao seguinte. Sem isso uma questao arrastava junto uma
   pagina inteira que nao era dela, confundindo quem le e engordando o repo.
"""
from __future__ import annotations

import html
import json
import pathlib
import re
import subprocess
import sys

from PIL import Image

DPI = 150
LARGURA_MAXIMA = 1000
QUALIDADE = 72

RODAPE = re.compile(r"GABARITA[A-Z]*\.COM\.BR|Licenciado para|Protegido por Eduzz", re.I)
# Motivos em que o enunciado extraido nao basta porque falta algo que vinha
# antes dele na pagina; nesses casos o recorte comeca no topo do conteudo.
PRECISA_DO_QUE_VEM_ANTES = re.compile(
    r"texto-base|enunciado curto demais|cabecalho da questao seguinte", re.I
)
# A apostila anuncia o texto-base compartilhado antes das questoes que o usam.
# Ele pertence a questao seguinte, entao o recorte para nele: sem isso, uma
# questao arrastava junto uma pagina inteira que nao era dela.
ABRE_PROXIMO_TEXTO = re.compile(r"^TEXTO PARA (?:A|AS|O|OS)\b", re.I)

LINHA = re.compile(
    r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>', re.S
)
PALAVRA = re.compile(r"<word[^>]*>([^<]*)</word>")
PAGINA = re.compile(r'<page width="([\d.]+)" height="([\d.]+)">(.*?)</page>', re.S)


class Pagina:
    def __init__(self, numero: int, largura: float, altura: float, linhas: list[tuple]):
        self.numero = numero
        self.largura = largura
        self.altura = altura
        self.linhas = linhas  # (yMin, yMax, texto)
        corpo = [l for l in linhas if not RODAPE.search(l[2])]
        rodape = [l for l in linhas if RODAPE.search(l[2])]
        # O limite de baixo e o topo do rodape, nunca a altura da pagina.
        self.fim = min([l[0] for l in rodape], default=altura * 0.94) - 6
        self.inicio = min([l[0] for l in corpo], default=40.0) - 10
        if self.inicio >= self.fim:
            self.inicio = 40.0
        # A apostila deixa linhas pautadas em branco para a resposta depois da
        # ultima alternativa. Elas nao sao texto, entao so este limite as corta.
        self.fim_do_texto = max([l[1] for l in corpo if l[1] < self.fim], default=self.fim) + 8


def ler_paginas(pdf: pathlib.Path) -> list[Pagina]:
    saida = subprocess.run(
        ["pdftotext", "-bbox-layout", str(pdf), "-"],
        check=True, capture_output=True, text=True,
    ).stdout
    paginas = []
    for i, (larg, alt, corpo) in enumerate(PAGINA.findall(saida), start=1):
        linhas = []
        for xm, ym, xM, yM, conteudo in LINHA.findall(corpo):
            texto = html.unescape(" ".join(PALAVRA.findall(conteudo))).strip()
            if texto:
                linhas.append((float(ym), float(yM), texto))
        paginas.append(Pagina(i, float(larg), float(alt), linhas))
    return paginas


def localizar_questoes(paginas: list[Pagina]) -> dict[int, tuple[int, float]]:
    """Numero da questao -> (pagina, y em que ela comeca)."""
    inicio = re.compile(r"^(\d+)\s*\.\s*\(")
    achados: dict[int, tuple[int, float]] = {}
    for pagina in paginas:
        for ym, _, texto in pagina.linhas:
            m = inicio.match(texto)
            if m:
                numero = int(m.group(1))
                achados.setdefault(numero, (pagina.numero, ym))
    return achados


def caixas(numero: int, motivo: str, paginas: list[Pagina], mapa) -> list[tuple[int, float, float]]:
    """(pagina, yTopo, yBase) de cada pedaco que a questao ocupa."""
    if numero not in mapa:
        return []
    pag_inicial, y_inicial = mapa[numero]
    seguintes = [v for k, v in mapa.items() if k > numero]
    fim_pag, fim_y = min(seguintes, default=(len(paginas), None))

    expandir = bool(PRECISA_DO_QUE_VEM_ANTES.search(motivo))
    partes: list[tuple[int, float, float]] = []

    def corta_no_proximo_texto(pagina: Pagina, apos: float) -> float:
        marcas = [ym for ym, _, texto in pagina.linhas
                  if ym > apos and ABRE_PROXIMO_TEXTO.match(texto)]
        return min(marcas, default=pagina.fim) - 4

    primeira = paginas[pag_inicial - 1]
    topo = primeira.inicio if expandir else max(primeira.inicio, y_inicial - 4)
    if expandir and y_inicial < primeira.inicio + (primeira.fim - primeira.inicio) * 0.4:
        anterior = paginas[pag_inicial - 2] if pag_inicial >= 2 else None
        if anterior is not None:
            partes.append((anterior.numero, anterior.inicio, anterior.fim))

    if fim_pag == pag_inicial and fim_y is not None:
        base = min(primeira.fim, fim_y - 2, corta_no_proximo_texto(primeira, y_inicial))
        partes.append((pag_inicial, topo, base))
        return partes

    partes.append(
        (pag_inicial, topo,
         min(primeira.fim, primeira.fim_do_texto, corta_no_proximo_texto(primeira, y_inicial)))
    )
    for n in range(pag_inicial + 1, min(fim_pag, len(paginas)) + 1):
        p = paginas[n - 1]
        limite = corta_no_proximo_texto(p, p.inicio - 1)
        base = min(p.fim, p.fim_do_texto, limite) if n != fim_pag else min(p.fim, (fim_y or p.fim) - 2, limite)
        if base - p.inicio > 20:
            partes.append((n, p.inicio, base))
    return partes


def confere_limite(partes, paginas: list[Pagina]) -> None:
    """Trava para quem mexer em `caixas` depois de mim.

    Hoje ela nao tem como disparar: todo `base` ja sai de um min() que inclui
    o limite da pagina. Ela existe para o caso de alguem acrescentar um ramo
    novo e esquecer esse min() -- o erro apareceria aqui, e nao numa imagem com
    o CPF da licenciada dentro. Quem verifica de verdade e
    scripts/conferir-marca-dagua.py, que le a imagem pronta.
    """
    for numero, _, base in partes:
        limite = paginas[numero - 1].fim
        if base > limite:
            raise AssertionError(
                f"recorte da pagina {numero} desceria ate {base:.1f}, abaixo do rodape em {limite:.1f}"
            )


def recortar(pdf: pathlib.Path, partes, destino: pathlib.Path, ident: str) -> list[dict]:
    destino.mkdir(parents=True, exist_ok=True)
    saidas = []
    for pagina, topo, base in partes:
        base_nome = destino / f"{ident}-p{pagina}"
        subprocess.run(
            ["pdftoppm", "-r", str(DPI), "-f", str(pagina), "-l", str(pagina),
             "-gray", "-png", "-singlefile", str(pdf), str(base_nome)],
            check=True, capture_output=True,
        )
        bruto = base_nome.with_suffix(".png")
        with Image.open(bruto) as img:
            escala = DPI / 72.0
            caixa = (0, max(0, int(topo * escala)), img.width, min(img.height, int(base * escala)))
            corte = img.crop(caixa)
            if corte.width > LARGURA_MAXIMA:
                altura = round(corte.height * LARGURA_MAXIMA / corte.width)
                corte = corte.resize((LARGURA_MAXIMA, altura), Image.LANCZOS)
            arquivo = destino / f"{ident}-p{pagina}.webp"
            corte.save(arquivo, "WEBP", quality=QUALIDADE, method=6)
        bruto.unlink(missing_ok=True)
        saidas.append({"arquivo": arquivo, "page": pagina})
    return saidas


def main(pdf_str: str, descartes_str: str, prefixo: str, saida_json: str, raiz_web: str) -> int:
    pdf = pathlib.Path(pdf_str)
    paginas = ler_paginas(pdf)
    mapa = localizar_questoes(paginas)
    descartes = json.loads(pathlib.Path(descartes_str).read_text(encoding="utf-8"))
    destino = pathlib.Path("public") / raiz_web.strip("/") / prefixo

    resultado, sem_pagina = [], 0
    for q in descartes:
        if not q.get("correctOptionId") or len(q.get("options") or []) < 4:
            continue
        partes = caixas(q["numero"], q["motivo"], paginas, mapa)
        if not partes:
            sem_pagina += 1
            continue
        confere_limite(partes, paginas)
        imagens = recortar(pdf, partes, destino, q["id"])
        q["originalPages"] = [
            {"url": f"/{raiz_web.strip('/')}/{prefixo}/{i['arquivo'].name}", "page": i["page"]}
            for i in imagens
        ]
        resultado.append(q)

    pathlib.Path(saida_json).write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"{prefixo}: {len(resultado)} questoes recortadas, {sem_pagina} sem pagina localizada")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(*sys.argv[1:6]))
