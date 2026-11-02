"""Conta padrões de enunciado nas oito provas regulares do ENEM 2018–2025 do banco.
Uso: python3 scripts/medir-padroes-enem.py
Regra textual sobre o enunciado: é piso, não contagem exata — gráfico e tabela
que só existem na figura não aparecem no texto e ficam de fora."""
import json, re, collections

qs = json.load(open('public/questions.json'))
pres = json.load(open('src/data/enemPreservedPositions.json'))
items = {}
for q in qs:
    real = pres.get(q['id']); s = q.get('examSource') or {}
    y = real['year'] if real else s.get('year'); n = real['number'] if real else s.get('questionNumber')
    if (real or s.get('board') == 'ENEM') and y and n and 2018 <= y <= 2025:
        items[(y, n)] = q
assert len(items) == 1440, len(items)

PATTERNS = {
    'Gráfico citado no enunciado': r'\bgr[aá]fico',
    'Tabela ou quadro': r'\b(tabela|quadro)\b',
    'Porcentagem': r'%|por cento|percentual',
    'Unidades e conversão': r'\b(litros?|mL|cm³|m³|km/h|m/s|kWh|watts?|toneladas?|gramas?)\b',
    'Escala': r'\bescala\b',
    'Média, mediana ou moda': r'\b(mediana|moda)\b|m[eé]dia aritm',
    'Experimento ou grupo controle': r'experimento|grupo controle',
    'Escolha da opção mais barata ou vantajosa': r'mais vantajos|menor (custo|valor|preço)|mais barat',
}
AREA = {'Biologia': 'Natureza', 'Física': 'Natureza', 'Química': 'Natureza', 'Matemática': 'Matemática',
        'Português': 'Linguagens', 'Inglês': 'Linguagens'}
print('| Padrão | Questões em 8 provas | Por prova | Natureza | Matemática | Linguagens | Humanas |')
print('|---|---|---|---|---|---|---|')
for name, rx in PATTERNS.items():
    hits = [q for q in items.values() if re.search(rx, q['prompt'], re.I)]
    c = collections.Counter(AREA.get(q['subject'], 'Humanas') for q in hits)
    print(f"| {name} | {len(hits)} | {len(hits)/8:.1f} | {c['Natureza']} | {c['Matemática']} | {c['Linguagens']} | {c['Humanas']} |")
with_figure = sum(1 for q in items.values() if q.get('figures'))
print(f'\nItens com figura recortada no banco: {with_figure} de {len(items)}.')
