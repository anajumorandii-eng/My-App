import json
from pathlib import Path
import pymupdf
from PIL import Image, ImageDraw

folder = Path('output/study-pdf')
reports = []
generation = {item['name']: item for item in json.loads((folder/'results.json').read_text(encoding='utf8'))}
for file in folder.glob('*.pdf'):
    doc = pymupdf.open(file)
    fonts = sorted({font[3] for page in doc for font in page.get_fonts()})
    thumbnails = []
    bounds = []
    toc_checks = 0
    first_body = min(generation[file.stem]['sectionPages'].values())
    for index, page in enumerate(doc):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(1, 1), alpha=False)
        pix.save(folder / f'{file.stem}-page-{index+1:02}.png')
        thumb = Image.frombytes('RGB', [pix.width, pix.height], pix.samples)
        thumb.thumbnail((550, 778))
        thumbnails.append(thumb)
        words = page.get_text('words')
        bad = [w[:5] for w in words if w[0] < -1 or w[1] < -1 or w[2] > page.rect.width+1 or w[3] > page.rect.height+1]
        assert not bad, (file.name, index+1, bad[:3])
        if 1 < index+1 < first_body:
            for link in page.get_links():
                if link.get('page', -1) < 0:
                    continue
                rect = link['from']
                candidates = [w[4] for w in words if w[0] > page.rect.width-100 and abs((w[1]+w[3])/2 - (rect.y0+rect.y1)/2) < 5 and w[4].isdigit()]
                assert str(link['page']+1) in candidates, (file.name, index+1, link, candidates)
                toc_checks += 1
        if index+1 >= first_body:
            outside = [w[:5] for w in words if w[1] < 810 and (w[0] < 49 or w[2] > 547 or w[1] < 43 or w[3] > 800)]
            assert not outside, (file.name, index+1, outside[:3])
        bounds.append({'page': index+1, 'words': len(words), 'lastY': round(max((w[3] for w in words), default=0), 1)})
    for offset in range(0, len(thumbnails), 6):
        sheet = Image.new('RGB', (1120, 2430), '#dedede')
        draw = ImageDraw.Draw(sheet)
        for local, thumb in enumerate(thumbnails[offset:offset+6]):
            x, y = (local % 2)*560, (local//2)*810
            draw.text((x+8, y+5), f'{file.stem} / {offset+local+1}', fill='black')
            sheet.paste(thumb, (x+5, y+25))
        sheet.save(folder / f'{file.stem}-sheet-{offset//6+1}.jpg')
    assert any('LiberationSerif' in font for font in fonts), fonts
    assert toc_checks >= len(generation[file.stem]['sectionPages'])
    reports.append({'file': file.name, 'pages': len(doc), 'fonts': fonts, 'tocLinksChecked': toc_checks, 'bounds': bounds})
(folder/'inspection.json').write_text(json.dumps(reports, indent=2), encoding='utf8')
print(json.dumps(reports, indent=2))
