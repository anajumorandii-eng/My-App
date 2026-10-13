"""Merge editorial pages with unchanged official vector pages.

Usage: python3 scripts/montar-caderno-unicamp-2026.py editorial.pdf prova.pdf gabarito.pdf saida.pdf
Requires pypdf. PDFs of the exam/key must match the reviewed official sources.
"""
from __future__ import annotations
import hashlib
import json
import pathlib
import re
import sys
from pypdf import PdfReader, PdfWriter

ROOT = pathlib.Path(__file__).resolve().parent.parent

def normalized(text: str) -> str:
    return re.sub(r"\s+", "", text)

def main(paths: list[str]) -> None:
    if len(paths) != 4:
        raise ValueError("Informe editorial.pdf, prova.pdf, gabarito.pdf e saida.pdf.")
    editorial_path, exam_path, key_path, output_path = map(pathlib.Path, paths)
    source = json.loads((ROOT / 'scripts/data/unicamp-2026-qx-source.json').read_text())
    for path, expected in [(exam_path, source['examSha256']), (key_path, source['answerKeySha256'])]:
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError(f"PDF diferente da fonte oficial conferida: {path.name}.")
    key_bytes = (ROOT / 'gabaritos/UNICAMP/UNICAMP-2026_Provas_Q_e_X.txt').read_bytes()
    if hashlib.sha256(key_bytes).hexdigest() != source['answerKeyTextSha256']:
        raise ValueError('Texto do gabarito diferente da extração conferida.')
    answers = {int(n): letter.lower() for n, letter in re.findall(r'(\d{2})\s+([A-D])\b', key_bytes.decode())}
    bank = json.loads((ROOT / 'public/questions.json').read_text())
    questions = sorted((q for q in bank if q['id'].startswith('unicamp_2026_q')), key=lambda q: q['examSource']['questionNumber'])
    editorial, exam, key = PdfReader(editorial_path), PdfReader(exam_path), PdfReader(key_path)
    if len(editorial.pages) != 74 or len(key.pages) != 1 or len(questions) != 72:
        raise ValueError('Paginação inesperada: confira a impressão do HTML antes de montar.')
    for n, question in enumerate(questions, 1):
        text = editorial.pages[n + 1].extract_text()
        if question['examSource']['questionNumber'] != n or question['correctOptionId'] != answers.get(n):
            raise ValueError(f'Questão/gabarito divergente: {n}.')
        if f'Questão {n} —' not in text:
            raise ValueError(f'Resolução ausente na página esperada: {n}.')
        for block in question['explanation'].split('\n\n')[1:]:
            if normalized(block) not in normalized(text):
                raise ValueError(f'Comentário incompleto ou caracteres alterados na resolução {n}.')
    writer = PdfWriter()
    for page in editorial.pages[:2]: writer.add_page(page)
    for page in exam.pages[2:26]: writer.add_page(page)
    writer.add_page(key.pages[0])
    for page in editorial.pages[2:]: writer.add_page(page)
    writer.add_outline_item('Como estudar', 1)
    exam_outline = writer.add_outline_item('Prova original — 72 questões', 2, is_open=False)
    for question in questions:
        n = question['examSource']['questionNumber']
        writer.add_outline_item(f'Questão {n}', question['sourceMaterial']['page'] - 1, parent=exam_outline)
    writer.add_outline_item('Gabarito oficial Q/X', 26)
    review_outline = writer.add_outline_item('Resoluções e revisão', 27, is_open=False)
    for question in questions:
        n = question['examSource']['questionNumber']
        writer.add_outline_item(f'Questão {n} — {question["subject"]}', 26 + n, parent=review_outline)
    writer.page_mode = '/UseOutlines'
    writer.add_metadata({'/Title': 'Questões reais — Unicamp 2026: prova Q/X, resolução e revisão', '/Author': 'Crivo', '/Subject': '72 questões oficiais, 144 perguntas de recuperação e 72 transferências autorais'})
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open('wb') as file: writer.write(file)
    result = PdfReader(output_path)
    if len(result.pages) != 99:
        raise ValueError('O caderno final não tem as 99 páginas esperadas.')
    for i in range(24):
        if result.pages[i + 2].get_contents().get_data() != exam.pages[i + 2].get_contents().get_data():
            raise ValueError(f'Página oficial alterada: {i + 3}.')
    if result.pages[26].get_contents().get_data() != key.pages[0].get_contents().get_data():
        raise ValueError('Página de gabarito alterada.')
    print('Caderno: 99 páginas; prova/gabarito vetoriais íntegros; 72 comentários completos.')

if __name__ == '__main__':
    try: main(sys.argv[1:])
    except (ValueError, OSError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
