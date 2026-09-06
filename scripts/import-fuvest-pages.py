"""Reproducible import of the complete V1/2025 paper, retaining original visuals.

Requires PyMuPDF. Classification is editorial, never inferred from OCR keywords.
The numbered answer key is matched by version and number, not extraction order.
"""
import json
import re
from pathlib import Path
import pymupdf

ROOT = Path(__file__).resolve().parents[1]
YEAR = 2025
source = ROOT / f'provas brutas/FUVEST/{YEAR}/FUVEST_{YEAR}_1a_fase.pdf'
doc = pymupdf.open(source)
assert 'V1' in doc[0].get_text(), 'Wrong paper version'
key_path = ROOT / f'gabaritos/FUVEST/FUVEST_{YEAR}_1a_fase_gabarito.txt'
key_text = key_path.read_text(encoding='utf8')
answers = {}
for line in key_text.splitlines():
    pairs = re.findall(r'(\d{1,2})\s+([A-E*])', line)
    if len(pairs) == 8:
        for n, letter in pairs[:2]:
            assert int(n) not in answers, f'Duplicate answer {n}'
            answers[int(n)] = letter.lower()
assert len(answers) == 90

# Dominant skill assessed. Cross-disciplinary items are placed by the actual command.
groups = {
 'soc_cultura_identidade': [1,90], 'geo_fisica_brasil': [2,50],
 'por_norma_culta': [3], 'his_brasil_colonia': [4,13,85],
 'por_texto': [5,37,38,65,78], 'fil_niilismo_existencialismo': [6],
 'fil_aristoteles': [7], 'fil_medieval': [8,44], 'soc_globalizacao': [9,12],
 'soc_cultura_identidade': [1,10,90], 'por_sintaxe': [11,66],
 'his_brasil_imperio': [14,81], 'ing_01': [15,41,42],
 'mat_trigonometria': [16], 'mat_geometria_plana': [17],
 'fis_dinamica_impulsiva': [18], 'fis_fisica_moderna': [19],
 'qui_modelos_atomicos': [20], 'qui_eletroquimica': [21],
 'fis_optica_geometrica': [22], 'fis_ondulatoria': [23,32,52],
 'qui_inorganica': [24,56], 'geo_cartografia': [25],
 'geo_globalizacao_economica': [26,68], 'geo_climatologia_socioambiental': [27,51,53,88],
 'fis_gravitacao_circular': [28], 'bio_evolucao': [29,30], 'bio_ecologia': [31,54],
 'fis_cinematica': [33,61], 'por_lit_modernismo': [34,35,43,83,86],
 'por_lit_contemporanea': [36,89], 'his_guerra_fria_contemporaneo': [39],
 'soc_movimentos_sociais': [40], 'mat_dados_probabilidade': [45,48],
 'bio_botanica': [46], 'bio_fisio_animal': [47], 'geo_economica_brasil': [49],
 'bio_zoologia': [55], 'qui_solucoes': [57], 'qui_radioatividade': [58],
 'fis_calorimetria': [59], 'qui_oxirreducao': [60], 'fis_energia': [62],
 'qui_termoquimica': [63,64], 'bio_biotecnologia': [67], 'mat_funcoes': [69],
 'mat_sequencias_matrizes': [70], 'bio_microbiologia': [71],
 'qui_estequiometria': [72], 'qui_gases': [73], 'fis_leis_newton': [74],
 'mat_geometria_espacial': [75,76], 'mat_geometria_analitica': [77],
 'his_idade_antiga': [79], 'soc_weber': [80], 'por_lit_romantismo_realismo': [82],
 'por_lit_classica_barroca': [84], 'his_moderna_iluminismo': [87],
}
classification = {n: topic for topic, numbers in groups.items() for n in numbers}
assert set(classification) == set(range(1,91))
subject_by_file = {'fisica':'Física','geografia':'Geografia','historia':'História','portugues':'Português',
                   'biologia':'Biologia','quimica':'Química','matematica':'Matemática',
                   'filosofia':'Filosofia','sociologia':'Sociologia','ingles':'Inglês'}
topics = {}
for filename, subject in subject_by_file.items():
    for topic in json.loads((ROOT/f'scripts/apostila-topics/{filename}.json').read_text(encoding='utf8')):
        topics[topic['id']] = {**topic, 'subject': subject}
previous = json.loads((ROOT/'scripts/classificacao-fuvest-2025.json').read_text(encoding='utf8'))['questoes']
bank_path = ROOT/'public/questions.json'
bank = json.loads(bank_path.read_text(encoding='utf-8-sig'))
by_id = {q['id']:q for q in bank}
pages = {}
for i, page in enumerate(doc):
    for n in re.findall(r'\{(\d{2})\}', page.get_text()):
        assert int(n) not in pages, f'Duplicate question marker {n}'
        pages[int(n)] = i+1
assert set(pages) == set(classification)
media = ROOT/'public/question-media/fuvest-2025'
media.mkdir(parents=True, exist_ok=True)
# Whole pages retain all shared texts and figures. These reading groups also use
# the preceding page when the shared passage starts before the question page.
shared = [{10,11}, {27,28,29}, {37,38}, {41,42}, {65,66}, {73,74}]
rendered = set()
for n in range(1,91):
    if answers[n] == '*':
        continue
    topic = topics[classification[n]]
    page_numbers = {pages[n]}
    for group in shared:
        if n in group:
            first = min(pages[k] for k in group)
            page_numbers.update(range(max(2,first-1),pages[n]+1))
    for p in page_numbers:
        if p not in rendered:
            doc[p-1].get_pixmap(matrix=pymupdf.Matrix(2,2), alpha=False).save(str(media/f'page-{p}.jpg'), jpg_quality=88)
            rendered.add(p)
    id = f'fuvest_2025_q{n}'
    old = by_id.get(id, {})
    c = previous.get(str(n), {})
    chapter = c.get('chapter') if c.get('topicId') == topic['id'] and c.get('chapter') in topic.get('chapters',[]) else None
    item = {**old, 'id': id, 'topicId': topic['id'], 'subject':topic['subject'],
      'prompt':f"FUVEST 2025 · Prova V1 · Questão {n:02d}. Leia a questão e suas alternativas na página original.",
      'options':[{'id':a,'text':f'Alternativa {a.upper()} da prova'} for a in 'abcde'],
      'correctOptionId':answers[n], 'difficulty':old.get('difficulty','medium'),
      'explanation':old.get('explanation') or f"Gabarito oficial da prova V1: alternativa {answers[n].upper()}. Esta questão tem resposta conferida no gabarito; a resolução comentada ainda não foi revisada.",
      'examSource':{'board':'FUVEST','year':2025,'sourceUrl':key_text.splitlines()[0].removeprefix('fonte: ').strip()},
      'sourceMaterial':{'file':str(source.relative_to(ROOT)).replace('\\','/'),'page':pages[n],'questionNumber':n},
      'originalPages':[{'url':f'/question-media/fuvest-2025/page-{p}.jpg','page':p} for p in sorted(page_numbers)]}
    if chapter: item['chapter'] = chapter
    else: item.pop('chapter',None)
    by_id[id] = item
bank_path.write_text(json.dumps(list(by_id.values()),ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
print(f'Imported 90 numbered questions; {len(rendered)} original pages; bank {len(by_id)} questions.')
