"""Planilha de incidência do ENEM 2018–2025: matérias, assuntos e subtópicos.
Uso: python3 scripts/gerar-planilha-incidencia-enem.py
Lê docs/estudos-2026/enem-incidencia/probabilidades-2026.json (gerado por
scripts/analisar-enem-probabilidades.mts) e grava o .xlsx ao lado dele. Não
recalcula nada: a planilha é outra forma de ler os mesmos números, para que
ela e o relatório nunca discordem."""
import json
from openpyxl import Workbook
from openpyxl.formatting.rule import ColorScaleRule
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

BASE = 'docs/estudos-2026/enem-incidencia/'
data = json.load(open(BASE + 'probabilidades-2026.json'))
years = data['editions']
topics = data['topics']
topic_by_key = {t['key']: t for t in topics}
DAY2 = {'Matemática', 'Biologia', 'Física', 'Química'}
day = lambda s: 'Dia 2 (15/11)' if s in DAY2 else 'Dia 1 (8/11)'
subject_total = {}
for t in topics:
    subject_total[t['subject']] = subject_total.get(t['subject'], 0) + t['total']

def band(p):
    return 'Certo de cair (≥90%)' if p >= .9 else 'Muito provável (75–90%)' if p >= .75 else \
        'Provável (60–75%)' if p >= .6 else 'Possível (40–60%)' if p >= .4 else 'Raro (<40%)'

def trend(x):
    return 'subindo' if x > .12 else 'caindo' if x < -.12 else 'estável'

HEAD = Font(bold=True, color='FFFFFF')
FILL = PatternFill('solid', fgColor='2F4858')
wb = Workbook()

def sheet(title, header, rows, widths, pct_cols=(), scale_col=None):
    ws = wb.create_sheet(title)
    ws.append(header)
    for c in ws[1]:
        c.font, c.fill = HEAD, FILL
        c.alignment = Alignment(wrap_text=True, vertical='center')
    for r in rows:
        ws.append(r)
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for col in pct_cols:
        for cell in ws[get_column_letter(col)][1:]:
            cell.number_format = '0%'
    if scale_col:
        letter = get_column_letter(scale_col)
        ws.conditional_formatting.add(f'{letter}2:{letter}{ws.max_row}', ColorScaleRule(
            start_type='num', start_value=0, start_color='F8D7DA',
            mid_type='num', mid_value=.6, mid_color='FFF3CD',
            end_type='num', end_value=1, end_color='D1E7DD'))
    ws.freeze_panes = 'A2'
    ws.auto_filter.ref = ws.dimensions
    ws.row_dimensions[1].height = 32
    return ws

# Leia primeiro
ws = wb.active
ws.title = 'Leia primeiro'
bt = data['backtest']
notes = [
    ['ENEM 2026 — incidência por matéria, assunto e subtópico'],
    [f"Base: {data['items']} questões das oito aplicações regulares 2018–2025 (caderno amarelo, Inglês como língua estrangeira), classificadas no banco do app; uma classificação por questão."],
    ['P(cair): chance estimada de vir pelo menos uma questão em 2026, com peso maior para provas recentes (0,84 por ano de distância). É histórica, não promessa.'],
    ['Questões esperadas: média ponderada de questões por prova. Edições: em quantas das 8 provas apareceu. % da matéria: parte das questões da matéria nas 8 provas.'],
    ['Subtópico = capítulo do currículo do app. Uma questão conta em um único assunto e subtópico; questões interdisciplinares aparecem só na classificação principal.'],
    [f"Retroteste (2018–2024 prevendo 2025): por assunto, {bt['topic']['top30Hit']} dos 30 mais prováveis caíram; Brier {bt['topic']['brier']:.3f} contra {bt['topic']['naive']:.3f} da referência. Por subtópico a previsão é mais fraca: use para ordenar, não para excluir."],
    ['Contagem não é peso na TRI. Redação fica fora: o tema não se prevê por frequência (ver a aba ENEM 2026 em Redação no app).'],
    ['Use os filtros do cabeçalho: por dia de prova, matéria ou faixa de chance.'],
]
for row in notes:
    ws.append(row)
ws['A1'].font = Font(bold=True, size=14)
ws.column_dimensions['A'].width = 140
for row in ws.iter_rows(min_row=2):
    row[0].alignment = Alignment(wrap_text=True)

# Matérias
subjects = sorted(subject_total, key=lambda s: -subject_total[s])
rows = []
for s in subjects:
    ts = [t for t in topics if t['subject'] == s]
    per_year = [sum(t['perYear'][i] for t in ts) for i in range(len(years))]
    top = max(ts, key=lambda t: (t['pAtLeastOne'], t['expected']))
    rows.append([s, day(s), subject_total[s], round(subject_total[s] / len(years), 1), len(ts),
                 sum(1 for t in ts if t['pAtLeastOne'] >= .9), top['label'], *per_year])
sheet('Matérias', ['Matéria', 'Dia', 'Questões em 8 provas', 'Média por prova', 'Assuntos cobrados',
                   'Assuntos ≥90%', 'Assunto mais provável', *map(str, years)],
      rows, [16, 14, 12, 10, 10, 10, 44] + [7] * len(years))

# Assuntos
rows = [[t['subject'], day(t['subject']), t['label'], t['pAtLeastOne'], band(t['pAtLeastOne']),
         t['expected'], f"{t['presence']}/8", t['total'], t['total'] / subject_total[t['subject']],
         trend(t['trend']), *t['perYear']]
        for t in sorted(topics, key=lambda t: (t['subject'], -t['pAtLeastOne'], -t['expected']))]
sheet('Assuntos', ['Matéria', 'Dia', 'Assunto', 'P(cair)', 'Faixa', 'Questões esperadas', 'Edições',
                   'Total 8 provas', '% da matéria', 'Tendência', *map(str, years)],
      rows, [14, 13, 46, 9, 24, 11, 9, 10, 10, 10] + [6] * len(years), pct_cols=(4, 9), scale_col=4)

# Subtópicos
rows = []
for c in data['chapters']:
    topic_id, chapter = c['key'].split('::', 1)
    topic = topic_by_key.get(topic_id)
    rows.append([c['subject'], day(c['subject']), topic['label'] if topic else topic_id, chapter,
                 c['pAtLeastOne'], band(c['pAtLeastOne']), c['expected'], f"{c['presence']}/8", c['total'],
                 c['total'] / subject_total[c['subject']], trend(c['trend']), *c['perYear']])
topic_p = {t['label']: t['pAtLeastOne'] for t in topics}
rows.sort(key=lambda r: (r[0], -topic_p.get(r[2], 0), r[2], -r[4]))
sheet('Subtópicos', ['Matéria', 'Dia', 'Assunto', 'Subtópico (capítulo)', 'P(cair)', 'Faixa',
                     'Questões esperadas', 'Edições', 'Total 8 provas', '% da matéria', 'Tendência',
                     *map(str, years)],
      rows, [14, 13, 38, 50, 9, 24, 11, 9, 10, 10, 10] + [6] * len(years), pct_cols=(5, 10), scale_col=5)

# Retroteste
rows = [[nivel, b['faixa'], b['n'], b['caiu'], b['caiu'] / b['n'] if b['n'] else 0]
        for nivel, key in (('Assunto', 'topic'), ('Subtópico', 'chapter')) for b in bt[key]['bins']]
sheet('Retroteste 2025', ['Nível', 'Faixa prevista (com 2018–2024)', 'Itens na faixa', 'Caíram em 2025',
                          'Taxa real'], rows, [12, 30, 14, 14, 10], pct_cols=(5,))

out = BASE + 'incidencia-enem-2018-2025.xlsx'
wb.save(out)
print(out, len(topics), 'assuntos', len(data['chapters']), 'subtópicos')
