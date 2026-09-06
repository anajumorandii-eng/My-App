"""Only visually checked workbook exercises; no answer letter is taken from OCR."""
import json
from pathlib import Path
import pymupdf

root = Path(__file__).resolve().parents[1]
pdf = 'materiais brutos/Geografia (v1) 1.pdf'
doc = pymupdf.open(root/pdf)
# question, PDF page, answer, board, comment. Printed pages = PDF pages - 2.
reviewed = [
 (1,43,'d','VUNESP / Santa Marcelina','Os horários se adiantam a leste de Greenwich e se atrasam a oeste. O antimeridiano está em 180°, e não 360°. A sequência correta é leste, oeste, 180°, atrasadas e adiantadas.'),
 (2,43,'d','VUNESP / Unisa','Tóquio está em UTC+9 e o Rio em UTC−3: a diferença é de 12 horas. Subtraindo 12 h de 9h30 de 22/08, chega-se a 21h30 de 21/08. A questão descreve uma situação de 2016; não se deve atualizar o calendário do enunciado.'),
 (4,43,'a','UFRGS','Nas condições e na data do enunciado, o Rio está em UTC−3, Fernando de Noronha em UTC−2 e a referência amazonense em UTC−4. Assim, 22 h no Rio correspondem a 23 h em Fernando de Noronha e 21 h no Amazonas.'),
 (5,43,'b','PUC-RS','Retire uma hora do horário de verão: restam 12 h. O meridiano central do fuso é 75° O; a cidade está em 80° O, cinco graus mais a oeste. Cada grau corresponde a quatro minutos: retire mais 20 min e obtenha 11h40.'),
 (6,44,'c','Unifenas','O enunciado considera Londres no horário de referência e Manaus em UTC−4. Some as 14 horas de viagem às 8 h e subtraia quatro horas: 8 + 14 − 4 = 18 h. Use as condições fornecidas, sem acrescentar horário de verão não mencionado.'),
 (7,44,'c','Unifenas','A alternativa C identifica o segundo fuso, UTC−3, com as regiões Nordeste, Sudeste e Sul, além de Pará, Amapá, Tocantins, Goiás e Distrito Federal. As demais trocam estados de fuso ou atribuem um deslocamento incorreto.'),
 (9,45,'e','UFRGS','Ao cruzar a Linha Internacional de Data para oeste, acrescenta-se um dia ao calendário. Mantido o horário indicado pela situação idealizada, 10 de janeiro às 8 h passa a 11 de janeiro às 8 h.'),
 (10,45,'a','PUC-RS','O trajeto descrito cruza a Linha Internacional de Data de leste para oeste no mapa de longitudes, isto é, no sentido físico para leste, da Austrália em direção às Américas. Recua-se um dia: 13 h de 21 de setembro passam a 13 h de 20 de setembro no sistema legal indicado.'),
 (11,45,'d','IFSC','Salvador e Recife usam a mesma referência horária na situação descrita e não adotaram horário de verão naquela data. Some as 11 horas de viagem às 7 h: a chegada ocorre às 18 h.'),
 (12,45,'e','UFJF','O nascer exatamente a leste e o pôr exatamente a oeste correspondem, no modelo astronômico usual e fora das condições polares, aos equinócios. Nos demais dias, esses pontos se deslocam ao norte ou ao sul do leste e do oeste.'),
 (13,45,'e','CPS-SP','Some as 11 horas de voo às 6 h: 17 h na referência de Guarulhos. Londres está três horas à frente nas condições do enunciado, que manda desconsiderar horário de verão. Portanto, a chegada é às 20 h.'),
]
media = root/'public/question-media/anglo-geo-v1'
media.mkdir(parents=True,exist_ok=True)
for page in {43,44,45,165}:
    doc[page-1].get_pixmap(matrix=pymupdf.Matrix(1.6,1.6),alpha=False).save(str(media/f'page-{page}.jpg'),jpg_quality=90)
bank_path = root/'public/questions.json'
bank = {q['id']:q for q in json.loads(bank_path.read_text(encoding='utf8'))}
for n,page,answer,board,comment in reviewed:
    id = f'anglo_geo_v1_c3_q{n}'
    bank[id] = {'id':id,'topicId':'geo_cartografia','chapter':'Sistema de Fusos Horários','subject':'Geografia',
      'prompt':f'Apostila de Geografia · volume 1 · capítulo 3 · exercício {n}. Leia o exercício numerado na página original.',
      'options':[{'id':a,'text':f'Alternativa {a.upper()} do exercício'} for a in 'abcde'],
      'correctOptionId':answer,'explanation':comment,'difficulty':'medium',
      'examSource':{'board':board,'sourceUrl':'/question-media/anglo-geo-v1/page-165.jpg'},
      'sourceMaterial':{'file':pdf,'page':page,'questionNumber':n,'answerPage':165},
      'originalPages':[{'url':f'/question-media/anglo-geo-v1/page-{page}.jpg','page':page}]}
bank_path.write_text(json.dumps(list(bank.values()),ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
print(f'{len(reviewed)} visually checked workbook exercises imported.')
