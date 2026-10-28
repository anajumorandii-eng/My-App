"""Check native page geometry, unchanged cover pixels and effective body size.

Usage: python scripts/audit-review-layout.py <comparison-output-directory>
Requires PyMuPDF. Inputs stay outside the repository unless explicitly public.
"""
import collections
import json
import pathlib
import sys

import fitz

directory = pathlib.Path(sys.argv[1])
for case in json.loads((directory / 'results.json').read_text()):
    before = fitz.open(directory / f"{case['case']}-before.pdf")
    after = fitz.open(directory / f"{case['case']}-after.pdf")
    assert before[0].get_pixmap().samples == after[0].get_pixmap().samples
    sizes = []
    for document in (before, after):
        body_sizes = collections.Counter()
        for page in document:
            assert abs(page.rect.width - 595.28) < 2
            assert abs(page.rect.height - 841.89) < 2
        for page in list(document)[1:]:
            for block in page.get_text('dict')['blocks']:
                for line in block.get('lines', []):
                    for span in line['spans']:
                        if span['font'] == 'LiberationSerif' and len(span['text']) > 25:
                            body_sizes[round(span['size'], 2)] += len(span['text'])
        assert body_sizes, 'Expected original body font in native PDF text'
        sizes.append(body_sizes.most_common(1)[0][0])
    assert sizes[0] == sizes[1] == 10.5, sizes
    print(json.dumps({'case': case['case'], 'coverPixelsIdentical': True,
                      'bodyFontPt': sizes, 'allPagesA4Portrait': True}))
