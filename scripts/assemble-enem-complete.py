"""Monta o lote integral a partir da extração conferida estruturalmente.

Grava artefatos de revisão; não altera o banco publicado. A classificação
de 2018–2023 usa similaridade lexical e fica explicitamente identificada.
"""
import json,re,sys,pathlib,unicodedata,difflib,math,collections,hashlib,shutil
ROOT=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'work/enem-full')
OUT=pathlib.Path('scripts/data/enem-completo-2018-2025');OUT.mkdir(parents=True,exist_ok=True)
bank=json.load(open('public/questions.json'))
# Reexecutar a montagem não passa a tratar o próprio lote como referência.
base=[q for q in bank if not q['id'].startswith('enem_completo_')]
old=[q for q in base if q.get('examSource',{}).get('board')=='ENEM']
topics=json.load(open(ROOT/'topics.json'));catalog={t['id']:t for t in topics}
rows=[q for y in range(2018,2026) for d in [1,2] for q in json.load(open(ROOT/f'{y}-{d}-extracted.json'))]
assert len(rows)==1440
issues=[(q['year'],q['number'],q['warnings']) for q in rows if q['warnings']]
assert not issues,issues
def norm(s):return re.sub(r'\W','',unicodedata.normalize('NFKD',s).lower())
stop=set('a o as os e de da do das dos um uma umas uns em na no nas nos para por que com se ao aos ou como mais sua seu suas seus esse essa este esta isso isto são ser não foi sobre entre pelo pela pelos pelas'.split())
def tokens(s):
 s=''.join(c for c in unicodedata.normalize('NFKD',s).lower() if not unicodedata.combining(c))
 return {w for w in re.findall(r'[a-z]{3,}',s) if w not in stop}
corpus=[tokens(q['prompt']) for q in base]
freq=collections.Counter(w for words in corpus for w in words)
idf={w:math.log((len(corpus)+1)/(n+1))+1 for w,n in freq.items()}
def similarity(a,b):
 shared=a&b
 return sum(idf.get(w,4)**2 for w in shared)/math.sqrt(max(1,sum(idf.get(w,4)**2 for w in a))*max(1,sum(idf.get(w,4)**2 for w in b)))
matched={};mapping=[]
for q in old:
 candidates=[x for x in rows if x['year']==q['examSource']['year'] and (x['year'],x['number']) not in matched]
 rank=sorted(((difflib.SequenceMatcher(None,norm(q['prompt'])[:600],norm(x['prompt'])[:600]).ratio(),x) for x in candidates),key=lambda x:-x[0])
 score,row=rank[0]
 # Canção com texto antes incorporado indevidamente ao ornamento do cabeçalho.
 assert score>.45 or (q['id']=='enem_expansao_2019_q07' and row['number']==6),(q['id'],score,row['number'])
 assert q['correctOptionId']==row['answer'],(q['id'],row['answer'])
 matched[row['year'],row['number']]=q
 mapping.append({'questionId':q['id'],'year':row['year'],'number':row['number'],'textSimilarity':round(score,4)})
incidence={}
for y in [2024,2025]:
 data=json.load(open(f'scripts/data/board-incidence/enem/{y}.json'))
 for paper in data['papers']:
  for item in paper['questions']:
   if item['number'].isdigit():incidence[y,int(item['number'])]=item
def classify(row):
 n=row['number'];y=row['year'];reference=incidence.get((y,n))
 if n<=5:return 'ing_01',catalog['ing_01']['chapters'][0],'language-option'
 if reference and reference.get('topicId') in catalog:
  topic=catalog[reference['topicId']];words=tokens(' '.join([row['prompt'],reference['summary']]))
  chapter=max(topic['chapters'],key=lambda c:similarity(words,tokens(c)))
  return topic['id'],chapter,'existing-editorial-incidence'
 allowed=({'Português'} if n<=45 else {'História','Geografia','Filosofia','Sociologia'} if n<=90 else {'Biologia','Física','Química'} if n<=135 else {'Matemática'})
 words=tokens(row['prompt']+' '+' '.join(o['text'] for o in row['options']))
 candidates=[(similarity(words,corpus[i]),q) for i,q in enumerate(base) if q['subject'] in allowed and q['topicId'] in catalog]
 score,q=max(candidates,key=lambda x:x[0]);topic=catalog[q['topicId']]
 chapter=q.get('chapter') if q.get('chapter') in topic['chapters'] else max(topic['chapters'],key=lambda c:similarity(words,tokens(c)))
 return topic['id'],chapter,'automatic-lexical-similarity'
items=[];positions=[];media=[]
for row in rows:
 y,n,day=row['year'],row['number'],row['day'];previous=matched.get((y,n));tid,chapter,method=classify(row)
 if previous:
  question=dict(previous);method='preserved-existing-record'
 else:
  # Fórmulas extraídas como imagens não devem virar rótulos incompletos como
  # "Y =" ou apenas o numerador. A letra permanece junto da expressão original.
  for option in row['options']:
   markers=[m for m in row['optionMarkers'] if m[0]==option['id']]
   visual=any(f['page']==m[1] and f['box'][0]<=m[2][0]+5<=f['box'][2] and f['box'][1]<=m[2][1]+5<=f['box'][3] for m in markers for f in row['graphics'])
   if visual:option['text']=f'Alternativa {option["id"].upper()} — expressão ou figura identificada por essa letra.'
  topic=catalog[tid];source=f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/enem/{y}/'+('presencial/' if y==2020 else '')+f'{day}dia/enem{y}_{day}dia_'
  question={'id':f'enem_completo_{y}_d{day}_q{n:03d}','topicId':tid,'subject':topic['subject'],'chapter':chapter,
   'prompt':row['prompt'],'options':row['options'],'correctOptionId':row['answer'] if row['answer']!='*' else '',
   'explanation':f'Gabarito do caderno amarelo: {row["answer"].upper()} · ENEM {y} · {day}º dia · questão {n}.',
   'difficulty':'medium','statementComplete':True,'explanationSource':'answer-key',
   'examSource':{'board':'ENEM','year':y,'sourceUrl':source+'prova_amarelo.pdf','answerKeyUrl':source+'gabarito_amarelo.pdf',
    'phase':f'{day}º dia · aplicação regular','version':f'CD{2 if day==1 else 5} amarelo','questionNumber':n}}
  if row['answer']=='*':
   question['status']='annulled';question['explanation']='Questão anulada no gabarito definitivo. Preservada para consulta, sem alternativa correta e sem efeito no progresso.'
  elif (y,n) in incidence:
   editorial=incidence[y,n]
   question['explanation']+='\n\n'+editorial['rationale']+'\n\nEstratégia:\n'+'\n'.join(f'{i+1}. {s}' for i,s in enumerate(editorial['strategy']))+'\n\nAtenção: '+editorial['trap'];question['explanationSource']='editorial'
 # Imagens com transparência, isoladas por questão e rastreáveis ao PDF.
 figs=[{'url':f['url']} for f in row['graphics']]
 if figs:question['figures']=figs
 items.append(question)
 positions.append({'year':y,'day':day,'number':n,'questionId':question['id'],'status':'annulled' if row['answer']=='*' else 'active',
                   'answer':row['answer'],'version':f'CD{2 if day==1 else 5} amarelo','language':'ingles' if n<=5 else None,
                   'pages':row['pages'],'classificationMethod':method})
 for f in row['graphics']:media.append({'questionId':question['id'],**f})
assert len({q['id'] for q in items})==1440
assert sum(q.get('status')=='annulled' for q in items)==10
documents=[]
for y in range(2018,2026):
 for day in [1,2]:
  source=f'https://www.curso-objetivo.br/vestibular/resolucao-comentada/enem/{y}/'+('presencial/' if y==2020 else '')+f'{day}dia/enem{y}_{day}dia_'
  for role,suffix in [('exam','prova'),('key','gabarito')]:
   f=ROOT/f'{y}-{day}-{role}.pdf'
   documents.append({'year':y,'day':day,'role':role,'url':source+suffix+'_amarelo.pdf','sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'bytes':f.stat().st_size})
(OUT/'questions.json').write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n')
(OUT/'manifest.json').write_text(json.dumps({'years':list(range(2018,2026)),'positions':positions,'media':media,'documents':documents,'preservedIds':mapping},ensure_ascii=False,indent=2)+'\n')
pathlib.Path('src/data/enemPreservedPositions.json').write_text(json.dumps({p['questionId']:{'year':p['year'],'number':p['number'],'day':1 if p['number']<=90 else 2} for p in mapping},ensure_ascii=False,indent=2)+'\n')
print('Montagem:',len(items),'posições; preservados',len(old),'IDs; novas',len(items)-len(old),'anuladas',10,'figuras',len(media))
