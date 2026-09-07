#!/usr/bin/env python3
"""Confere por OCR que nenhuma imagem de questao carrega a marca d'agua.

As paginas das apostilas trazem, no rodape, uma linha com nome, e-mail e CPF da
licenciada. O recorte corta essa faixa por construcao, mas uma vez virada pixel
a marca escaparia de qualquer checagem de texto -- e este repositorio e publico.
Entao ela e procurada aqui, na imagem que vai para o commit.

O jeito de olhar importa: rodar OCR na pagina inteira nao acha a marca (ela e
pequena e o resto da pagina confunde o reconhecimento), o que daria uma
checagem que passa sempre. Por isso o OCR roda so na faixa de baixo e em modo
de linha unica, que e como a marca aparece. `--provar` roda a checagem contra
uma pagina inteira, sem recorte, e falha se ela NAO acusar -- e o teste de que
a checagem nao esta passando a toa.
"""
from __future__ import annotations

import glob
import os
import pathlib
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor

from PIL import Image

MARCAS = ("licenciado", "eduzz", "52878101804", "ortizanajulia", "protegido por")
FAIXA = 0.18  # fracao de baixo da imagem em que a marca apareceria


def tem_marca(caminho: str) -> bool:
    with Image.open(caminho) as im:
        faixa = im.crop((0, int(im.height * (1 - FAIXA)), im.width, im.height))
        if faixa.width < 400:
            faixa = faixa.resize((800, max(1, round(faixa.height * 800 / faixa.width))))
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            faixa.save(tmp.name)
            nome = tmp.name
    # OMP_THREAD_LIMIT=1 nao e detalhe: sem ele o tesseract abre threads que
    # brigam entre si quando ja se roda um processo por nucleo, e cada imagem
    # passa de 0,1 s para 5 s -- a checagem inteira ia de um minuto para duas
    # horas, e foi assim que ela ficou rodando a tarde toda.
    ambiente = {**os.environ, "OMP_THREAD_LIMIT": "1"}
    try:
        for psm in ("7", "6", "11"):
            texto = subprocess.run(
                ["tesseract", nome, "-", "-l", "por", "--psm", psm],
                capture_output=True, text=True, env=ambiente,
            ).stdout.lower()
            if any(m in texto for m in MARCAS):
                return True
    finally:
        pathlib.Path(nome).unlink(missing_ok=True)
    return False


def main(argv: list[str]) -> int:
    if argv and argv[0] == "--provar":
        pagina = argv[1]
        if tem_marca(pagina):
            print(f"prova ok: a checagem acusa a marca em {pagina}")
            return 0
        print(f"PROVA FALHOU: a checagem nao acusou a marca em {pagina}", file=sys.stderr)
        return 1

    padrao = argv[0] if argv else "public/question-media/apostilas/**/*.webp"
    arquivos = sorted(glob.glob(padrao, recursive=True))
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as pool:
        sujas = [a for a, achou in zip(arquivos, pool.map(tem_marca, arquivos, chunksize=8)) if achou]
    print(f"{len(arquivos)} imagens conferidas; {len(sujas)} com marca d'agua")
    for a in sujas:
        print(f"    {a}", file=sys.stderr)
    return 1 if sujas else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
