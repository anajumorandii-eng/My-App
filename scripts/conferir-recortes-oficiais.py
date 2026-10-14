"""Confere ou regenera os 15 recortes manuais da expansão oficial.

Os retângulos e hashes vêm de scripts/data/recortes-oficiais-revisados.json.
Uso: python3 scripts/conferir-recortes-oficiais.py [--write]
--write regenera somente os arquivos de imagem; não altera o banco.
"""
import hashlib
import io
import json
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

def main():
    rows = json.loads((ROOT / 'scripts/data/recortes-oficiais-revisados.json').read_text())
    outputs = []
    for row in rows:
        source = ROOT / 'public' / row['source'].lstrip('/')
        output = ROOT / 'public' / row['url'].lstrip('/')
        if hashlib.sha256(source.read_bytes()).hexdigest() != row['sourceSha256']:
            raise ValueError(f"Fonte diferente da página conferida: {row['questionId']}")
        with Image.open(source) as image:
            x0, y0, x1, y1 = row['box']
            if not (0 <= x0 < x1 <= image.width and 0 <= y0 < y1 <= image.height):
                raise ValueError(f"Retângulo fora da página: {row['questionId']}")
            if '--write' in sys.argv:
                buffer = io.BytesIO()
                image.crop(row['box']).save(buffer, 'WEBP', quality=90)
                data = buffer.getvalue()
                if hashlib.sha256(data).hexdigest() != row['sha256']:
                    raise ValueError(f"Codificação difere do recorte conferido: {row['questionId']}")
                outputs.append((output, data))
            elif hashlib.sha256(output.read_bytes()).hexdigest() != row['sha256']:
                raise ValueError(f"Recorte diferente da imagem conferida: {row['questionId']}")
    # Confere todo o lote antes de regenerar o primeiro arquivo.
    for output, data in outputs:
        output.write_bytes(data)
    print(f'{len(rows)} recortes e fontes conferidos; {len(outputs)} regenerados.')

if __name__ == '__main__':
    main()
