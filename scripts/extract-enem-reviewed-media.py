"""Reproduz os recortes conferidos a partir dos quatro PDFs com hash validado.

python scripts/extract-enem-reviewed-media.py /diretorio/dos/pdfs [--write]
Entradas: 2022-d1-prova.pdf, 2022-d2-prova.pdf, 2023-d1-prova.pdf,
2023-d2-prova.pdf. Sem --write, compara os resultados com o manifesto.
Requer PyMuPDF, numpy, scipy e Pillow. Não redesenha o conteúdo das figuras.
"""
from __future__ import annotations
import hashlib
import io
import json
from pathlib import Path
import sys

import fitz
import numpy as np
from PIL import Image
from scipy import ndimage


def extract(page, media):
    pix = page.get_pixmap(matrix=fitz.Matrix(2.5, 2.5), clip=fitz.Rect(media['box']), alpha=True)
    pixels = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 4).copy()
    alpha = pixels[:, :, 3].astype(float)
    rgb = np.where(alpha[:, :, None] > 0, pixels[:, :, :3] * 255.0 / np.maximum(alpha[:, :, None], 1), 255)
    white = (rgb.min(2) > 240) & (rgb.max(2) - rgb.min(2) < 12)
    if media['backgroundMode'] == 'edge-connected':
        # Fotografias e peças gráficas mantêm o branco que faz parte da imagem.
        mask = white | (pixels[:, :, 3] == 0)
        seed = np.zeros_like(mask)
        seed[[0, -1], :] = mask[[0, -1], :]
        seed[:, [0, -1]] = mask[:, [0, -1]]
        background = ndimage.binary_propagation(seed, mask=mask)
    else:
        # Diagramas vetoriais: também remove o papel dentro das células fechadas.
        background = white
    pixels[background, 3] = 0
    pixels[:, :, :3] = np.clip(rgb, 0, 255).astype('uint8')
    image = Image.fromarray(pixels, 'RGBA')
    bounds = image.getbbox()
    assert bounds, media['url']
    image = image.crop(bounds)
    canvas = Image.new('RGBA', (image.width + 4, image.height + 4))
    canvas.alpha_composite(image, (2, 2))
    assert canvas.size == (media['width'], media['height']), media['url']
    output = io.BytesIO()
    canvas.save(output, format='WEBP', lossless=True)
    return output.getvalue()


def main():
    root = Path(__file__).resolve().parent.parent
    source = Path(sys.argv[1])
    review = json.loads((root / 'scripts/data/enem-conferencia-2022-2023.json').read_text())
    documents = {}
    for item in review['items']:
        key = (item['year'], item['day'])
        if key in documents:
            continue
        pdf = source / f'{key[0]}-d{key[1]}-prova.pdf'
        assert hashlib.sha256(pdf.read_bytes()).hexdigest() == item['sourceSha256'], pdf
        documents[key] = fitz.open(pdf)
    for media in review['media']:
        output = extract(documents[media['year'], media['day']][media['page'] - 1], media)
        assert hashlib.sha256(output).hexdigest() == media['sha256'], media['url']
        destination = root / f'public{media["url"]}'
        if '--write' in sys.argv:
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(output)
        else:
            assert destination.read_bytes() == output, destination
    print(f'{len(documents)} fontes e {len(review["media"])} recortes transparentes conferidos.')


if __name__ == '__main__':
    main()
