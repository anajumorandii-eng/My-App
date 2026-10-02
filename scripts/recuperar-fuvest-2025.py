"""Recupera texto da prova V1 conferida; o PDF e a extração ficam fora do Git.

Uso: python scripts/recuperar-fuvest-2025.py PDF --output /tmp/recuperacao.json
Aplicação: python scripts/recuperar-enunciado.py /tmp/recuperacao.json
Requer PyMuPDF. Não altera classificação, imagens, comentários ou gabaritos.
"""
import argparse
import hashlib
import json
import re
import unicodedata
from pathlib import Path
import pymupdf

EXPECTED_SHA = 'f512449b47ac31abe1ae00d5f88fb14478c7139fa1db137145b7e33cec1b97c8'
SYMBOLS = str.maketrans({'൅': '+', 'െ': '−', 'ൈ': '×', 'ൌ': '=', '൏': '<', '൐': '>', '൑': '≤', 'ሺ': '(', 'ሻ': ')', 'ሾ': '[', 'ሿ': ']', 'ᇱ': '′', '଴': '₀', 'ଵ': '₁', 'ଶ': '²', 'ା': '₊', '௡': 'ₙ', '௛': 'h', '௥': 'r', 'ꟷ': '—'})
SUPER = str.maketrans('0123456789+-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻')
SUB = str.maketrans('0123456789', '₀₁₂₃₄₅₆₇₈₉')

def page_text(page):
    lines = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            spans = line['spans']
            normal = max(spans, key=lambda x: x['size'])
            text = ''
            for span in spans:
                s = span['text']
                # PDF keeps raised exponents and lowered chemical indices in small spans.
                if span['flags'] & 1 and span['size'] < .85 * normal['size']:
                    s = s.replace('ꟷ', '-').translate(SUPER)
                elif span['size'] < .85 * normal['size'] and span['origin'][1] > normal['origin'][1] + .3:
                    s = s.translate(SUB)
                s = ''.join(unicodedata.normalize('NFKC', c) if 0x1D400 <= ord(c) <= 0x1D7FF or c == 'ℎ' else c for c in s)
                text += s.translate(SYMBOLS)
            lines.append(text.rstrip())
    return '\n'.join(lines)

def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument('pdf', type=Path)
    cli.add_argument('--output', type=Path, required=True)
    args = cli.parse_args()
    if hashlib.sha256(args.pdf.read_bytes()).hexdigest() != EXPECTED_SHA:
        raise ValueError('PDF diferente da prova V1 registrada; não aplicar a transcrição.')
    paper = pymupdf.open(args.pdf)
    assert paper[0].get_text().lstrip().startswith('V1')
    text = '\n'.join(page_text(page) for page in paper[1:-1])
    text = re.sub(r'^Concurso Vestibular FUVEST 2025 – Prova V1\s*\n', '', text, flags=re.M)
    shared = {}
    for match in re.finditer(r'TEXTO PARA AS QUESTÕES(?: DE)? (\d+) (E|A) (\d+)\s*(.*?)(?=\{\d{2}\})', text, re.S):
        a, b = int(match[1]), int(match[3])
        numbers = [a, b] if match[2] == 'E' else range(a, b + 1)
        for number in numbers:
            assert number not in shared
            shared[number] = match[4].strip()
    assert set(shared) == {10,11,27,28,29,37,38,41,42,65,66,73,74}
    blocks = list(re.finditer(r'\{(\d{2})\}\s*(.*?)(?=#####)', text, re.S))
    assert len(blocks) == 90 and {int(m[1]) for m in blocks} == set(range(1,91))
    result = {}
    for match in blocks:
        number = int(match[1])
        body = match[2].strip()
        # Cambria's custom character map loses fraction layout; these are read
        # against the original formula. The digit glyph also serves x² and n₂.
        if number == 19:
            body, count = re.subn(r'λ′=λ₀\+α\s*m\(1 −cos θ\)', 'λ′ = λ₀ + (α/m)(1 − cos θ)', body)
            assert count == 1, 'Fração de Compton não reconhecida'
        if number == 22:
            body = body.replace('n²', 'n₂')
        if number == 76:
            body = re.sub(r'\bh\s*²', 'h/2', body)
            body = re.sub(r'\br\s*²', 'r/2', body)
            body = re.sub(r'([CVA])²', r'\1₂', body)
        options = re.split(r'\(([A-E])\)', body)
        assert len(options) == 11, f'{number}: divisão de alternativas ambígua'
        prompt = options[0].strip()
        texts = {options[i].lower(): options[i+1].strip() for i in range(1,11,2)}
        if 'Note e adote:' in texts['e']:
            texts['e'], note = texts['e'].split('Note e adote:', 1)
            prompt += '\n\nNote e adote:\n' + note.strip()
            texts['e'] = texts['e'].strip()
        if number in (60,69):
            assert all(not s for s in texts.values())
            texts = {k:f'Gráfico {k.upper()} na página {23 if number==60 else 26} da prova original (alternativa visual).' for k in 'abcde'}
            prompt += '\n\nAs cinco alternativas são gráficos. Consulte a página original abaixo para compará-los.'
        if number in shared:
            prompt = shared[number] + '\n\n' + prompt
        if number == 22:
            prompt = prompt.replace('n²', 'n₂')
        assert all(s for s in texts.values())
        assert not re.search(r'[\u0B00-\u0FFF\u1200-\u137F\uA7F7]', prompt + ''.join(texts.values())), f'{number}: glifo sem conversão'
        result[f'fuvest_2025_q{number}'] = {'prompt': f'FUVEST 2025 · Prova V1 · Questão {number:02d}.\n\n{prompt}', 'options':texts}
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
    print(f'90 enunciados; 88 conjuntos de alternativas textuais; 2 conjuntos de gráficos; 13 questões com textos compartilhados. Saída: {args.output}')

if __name__ == '__main__':
    main()
