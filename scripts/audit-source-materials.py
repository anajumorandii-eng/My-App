"""Inventory original PDFs and cache page text for editorial review (never auto-publish OCR)."""
import json
from pathlib import Path
import pymupdf

root = Path(__file__).resolve().parents[1]
out = root / 'artifacts' / 'content-audit'
out.mkdir(parents=True, exist_ok=True)
inventory = []
for path in sorted((root / 'materiais brutos').glob('*.pdf')):
    cache = out / (path.stem + '.json')
    if cache.exists():
        pages = json.loads(cache.read_text(encoding='utf8'))
    else:
        doc = pymupdf.open(path)
        pages = [page.get_text() for page in doc]
        cache.write_text(json.dumps(pages, ensure_ascii=False), encoding='utf8')
    inventory.append({'file': str(path.relative_to(root)), 'pages': len(pages),
                      'characters': sum(map(len, pages)),
                      'answerPages': [i+1 for i,t in enumerate(pages) if 'GABARITO' in t.upper()]})
    print(path.name, len(pages), flush=True)
(out / 'sources.json').write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding='utf8')
