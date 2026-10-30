"""Extrai texto nativo e figuras isoladas, nunca páginas, dos cadernos amarelos.

python scripts/extract-enem-complete.py work/enem-full
Requer PyMuPDF, Pillow, fontTools e numpy. Os PDFs de prova e gabarito devem
estar nomeados ANO-DIA-exam.pdf / ANO-DIA-key.pdf no diretório de trabalho.
"""
from __future__ import annotations
import sys,json,re,hashlib,pathlib,unicodedata
import fitz
import numpy as np
from scipy import ndimage
from PIL import Image
from lib.enem_pdf_fonts import fix

ROOT=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else 'work/enem-full')
MEDIA=ROOT/'media';MEDIA.mkdir(exist_ok=True)
HEADER=re.compile(r'^QUEST[ÃA]O\s+(\d{1,3})\b',re.I)
SHARED=re.compile(r'(?:Texto|Textos|Leia|Considere|responder|responda|resolver).*?quest[õoÕO]es\s+(?:de\s+)?(\d{1,2})\s+a\s+(\d{1,2})',re.I)

def clean(s):
    return re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '',s).replace('\u00ad','').replace('\ufffd','').strip()

def native_lines(page):
    out=[]
    for b in page.get_text('dict')['blocks']:
        if b['type']!=0:continue
        split_lines=[]
        for raw in b['lines']:
            spans=raw['spans'];middle=page.rect.width/2
            left=[s for s in spans if s['bbox'][0]<middle];right=[s for s in spans if s['bbox'][0]>=middle]
            if left and right and min(s['bbox'][0] for s in right)-max(s['bbox'][2] for s in left)>7:
                for group in [left,right]:
                    box=fitz.Rect(group[0]['bbox'])
                    for span in group:box|=fitz.Rect(span['bbox'])
                    split_lines.append({'spans':group,'bbox':list(box)})
            else:split_lines.append(raw)
        for line in split_lines:
            superscript=str.maketrans('0123456789+-=()n','⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿ')
            greek=str.maketrans(dict(zip('abgdezhqiklm n xop rstufcyw'.replace(' ',''),'αβγδεζηθικλμνξοπρστυφχψω')))
            parts=[]
            for s in line['spans']:
                t=s['text']
                if s['font'].split('+')[-1] in ('Symbol','SymbolMT'):t=t.translate(greek)
                parts.append(t.translate(superscript) if s['flags']&1 else t)
            text=clean(''.join(parts))
            if text and text.count('ENEM')<3:
                option=bool(line['spans'] and 'Bundesbahn' in line['spans'][0]['font'] and re.match(r'^[A-E](?:\s|$)',text))
                row={'text':text,'box':list(line['bbox']),'option':option}
                spans=line['spans'];math_indices=[i for i,s in enumerate(spans) if 'Math' in s['font']]
                if math_indices:
                    start=math_indices[0];end=math_indices[-1]
                    while start>0 and len(spans[start-1]['text'].strip())<=12:start-=1
                    while end+1<len(spans) and len(spans[end+1]['text'].strip())<=12:end+=1
                    box=fitz.Rect(spans[start]['bbox'])
                    for s in spans[start:end+1]:box|=fitz.Rect(s['bbox'])
                    row['mathBox']=list(box)
                # Alguns PDFs contêm o marcador duas vezes na mesma posição.
                duplicate=next((old for old in out if abs(old['box'][0]-row['box'][0])<1 and abs(old['box'][1]-row['box'][1])<12 and (old['text']==text or (option and old['option'] and old['text'][0]==text[0]))),None)
                if duplicate:
                    if len(text)>len(duplicate['text']):duplicate.update(row)
                else:out.append(row)
    return out

def content_bounds(page,lines):
    # Remove somente margens institucionais, código de barras e rodapé.
    h=page.rect.height;w=page.rect.width
    heads=[l['box'] for l in lines if HEADER.match(l['text'])]
    left=min((r[0] for r in heads),default=w*.055)
    if left>w/2:left=w*.055
    # Páginas antigas usam margem mais larga que os cadernos novos.
    left=max(25,min(left,w*.11));right=min(w-20,w-left+12)
    return fitz.Rect(left-2, max(52,h*.075), right+2, h-42)

def graphics(page,lines,bounds):
    rects=[]
    math_rects=[]
    for line in lines:
        if 'mathBox' not in line:continue
        r=fitz.Rect(line['mathBox'])
        neighbor_area=r+(-2,-12,20,12)
        for other in lines:
            lr=fitz.Rect(other['box'])
            if len(other['text'])<=25 and len(re.findall(r'[A-Za-zÀ-ÿ]+',other['text']))<5 and lr.x0>=r.x0-3 and neighbor_area.intersects(lr) and int(lr.x0>page.rect.width/2)==int(r.x0>page.rect.width/2):r|=lr
        if bounds.contains(r) and r.width>5 and r.height>5:rects.append(r);math_rects.append(fitz.Rect(r))
    for im in page.get_image_info():
        r=fitz.Rect(im['bbox'])
        if r.width>8 and r.height>8 and bounds.contains(r):rects.append(r)
    paths=[]
    components=[]
    for raw in page.get_drawings():
        groups=[];group=[];last=None
        for item in raw['items']:
            kind=item[0]
            if kind=='re':start=item[1].tl;end=start
            elif kind=='qu':start=item[1].ul;end=start
            else:start=item[1];end=item[-1]
            if group and (last is None or abs(start-last)>.1):groups.append(group);group=[]
            group.append(item);last=end
            if kind in ('re','qu'):groups.append(group);group=[];last=None
        if group:groups.append(group)
        for group in groups:
            points=[]
            for item in group:
                if item[0]=='re':points.extend([item[1].tl,item[1].br])
                elif item[0]=='qu':points.extend([item[1].ul,item[1].ur,item[1].ll,item[1].lr])
                else:points.extend(item[1:])
            xs=[p.x for p in points];ys=[p.y for p in points]
            components.append({**raw,'items':group,'rect':fitz.Rect(min(xs),min(ys),max(xs),max(ys))})
    for path in components:
        r=path['rect']
        if not bounds.contains(r):continue
        # Regras de separação/caixas dos cabeçalhos não são figuras.
        if (r.width<1.5 and r.height>100) or (r.height<1.5 and r.width>180):continue
        if r.width>40 and r.height<18 and any(abs(r.y0-l['box'][1])<15 for l in lines if HEADER.match(l['text'])):continue
        if r.width<22 and r.height<22 and any(r.intersects(fitz.Rect(l['box'][0],l['box'][1],l['box'][0]+14,l['box'][3])) for l in lines if l.get('option')):continue
        if any(r.intersects(fitz.Rect(l['box'])) for l in lines if HEADER.match(l['text'])):continue
        if path.get('fill') and min(path['fill'])>.97 and not path.get('color'):continue
        paths.append(path)
    for box in page.cluster_drawings(x_tolerance=6,y_tolerance=6,drawings=paths,final_filter=False):
        r=fitz.Rect(box)
        if r.width>40 and r.height<18 and any(abs(r.y0-l['box'][1])<15 for l in lines if HEADER.match(l['text'])):continue
        if r.width>=7 and r.height>=7 and r.get_area()>=90:rects.append(r)
        elif 5<=r.width<=100 and r.height<1.5 and any(HEADER.match(l['text']) and int(HEADER.match(l['text'])[1])>=91 for l in lines):
            near=[l['text'] for l in lines if (r+(-2,-12,2,12)).intersects(fitz.Rect(l['box']))]
            if len(near)>=2 and all(len(s)<35 for s in near) and any(re.search(r'\d',s) for s in near):rects.append(r+(-1,-8,1,8))
    changed=True
    while changed:
        changed=False;merged=[]
        for r in rects:
            for i,s in enumerate(merged):
                overlap=max(0,min(r.y1,s.y1)-max(r.y0,s.y0))
                gap=max(0,max(r.x0,s.x0)-min(r.x1,s.x1))
                panel=(int(r.x0>page.rect.width/2)==int(s.x0>page.rect.width/2) and overlap>min(r.height,s.height)*.55 and gap<80 and (r|s).width<bounds.width*.5)
                if (r+(-5,-5,5,5)).intersects(s) or panel:merged[i]=s|r;changed=True;break
            else:merged.append(r)
        rects=merged
    # Rótulos/eixos pertencem à figura. Não incorporar parágrafos vizinhos.
    for i,r in enumerate(rects):
        label_area=r+(-12,-12,12,12)
        for _ in range(3):
            for l in lines:
                lr=fitz.Rect(l['box'])
                if HEADER.match(l['text']) or len(l['text'])>45:continue
                if not l.get('option') and len(re.findall(r'[A-Za-zÀ-ÿ]+',l['text']))>=5:continue
                if l['text'].endswith('.') and len(l['text'].split())>=3:continue
                if re.match(r'^[A-E]\s+\S',l['text']) and len(l['text'])>20:continue
                if label_area.intersects(lr) and lr.width<bounds.width*.48:r|=lr
        rects[i]=r & bounds
    # Frações/alternativas vizinhas podem compartilhar o mesmo painel visual.
    # Unir recortes que se sobrepõem evita repetir fórmulas pela metade.
    pending=rects;rects=[]
    while pending:
        r=pending.pop(0);changed=True
        while changed:
            changed=False
            for other in list(pending):
                if r.intersects(other):r|=other;pending.remove(other);changed=True
        rects.append(r)
    heads=[l['box'] for l in lines if HEADER.match(l['text'])]
    middle=page.rect.width/2
    paired=[max(a[1],b[1]) for a in heads for b in heads if a[0]<middle<b[0] and abs(a[1]-b[1])<35]
    if paired:
        separated=[]
        for r in rects:
            if r.x0<middle-10 and r.x1>middle+10 and r.y0>=min(paired)-15:
                separated.extend([r & fitz.Rect(bounds.x0,bounds.y0,middle-3,bounds.y1),r & fitz.Rect(middle+3,bounds.y0,bounds.x1,bounds.y1)])
            else:separated.append(r)
        rects=[r for r in separated if not r.is_empty]
    clean_rects=[]
    for r in rects:
        text_rows=[l for l in lines if r.intersects(fitz.Rect(l['box']))]
        prose=sum(len(re.findall(r'[A-Za-zÀ-ÿ]{4,}',l['text'])) for l in text_rows)
        intentional_math=any(r.intersects(m) for m in math_rects) and r.width<page.rect.width*.48
        if prose>=4 and not intentional_math:
            pix=page.get_pixmap(matrix=fitz.Matrix(1.5,1.5),clip=r,alpha=True)
            a=np.frombuffer(pix.samples,dtype=np.uint8).reshape(pix.height,pix.width,4)
            ink=(a[:,:,:3].min(2)<210)&(a[:,:,3]>100)
            residual=ink.copy()
            for l in text_rows:
                b=fitz.Rect(l['box']) & r
                x0=max(0,int((b.x0-r.x0)*1.5)-2);x1=min(pix.width,int((b.x1-r.x0)*1.5)+3)
                y0=max(0,int((b.y0-r.y0)*1.5)-2);y1=min(pix.height,int((b.y1-r.y0)*1.5)+3)
                residual[y0:y1,x0:x1]=False
            if residual.sum()<max(30,ink.sum()*.12):continue
        clean_rects.append(r)
    return clean_rects

def transparent_crop(page,rect,name):
    rect=rect+(-2,-2,2,2)
    pix=page.get_pixmap(matrix=fitz.Matrix(2.5,2.5),clip=rect,alpha=True)
    a=np.frombuffer(pix.samples,dtype=np.uint8).reshape(pix.height,pix.width,4).copy()
    # Remover só o branco neutro do suporte. Não recolorir fotografias/mapas.
    alpha=a[:,:,3].astype(np.float32)
    rgb=np.where(alpha[:,:,None]>0,a[:,:,:3].astype(np.float32)*255/np.maximum(alpha[:,:,None],1),255)
    neutral=rgb.max(2)-rgb.min(2)<12
    white=neutral & (rgb.min(2)>240)
    traversable=white | (a[:,:,3]==0)
    seed=np.zeros_like(traversable);seed[0,:]=traversable[0,:];seed[-1,:]=traversable[-1,:];seed[:,0]=traversable[:,0];seed[:,-1]=traversable[:,-1]
    background=ndimage.binary_propagation(seed,mask=traversable)
    a[background,3]=0
    a[:,:,:3]=np.clip(rgb,0,255).astype(np.uint8)
    im=Image.fromarray(a,'RGBA');bbox=im.getbbox()
    if not bbox or bbox[2]-bbox[0]<8 or bbox[3]-bbox[1]<8:return None
    im=im.crop(bbox)
    canvas=Image.new('RGBA',(im.width+2,im.height+2),(0,0,0,0));canvas.alpha_composite(im,(1,1));im=canvas
    im.save(MEDIA/name,format='WEBP',lossless=True)
    return {'url':f'/question-media/enem-completo/{name}','width':im.width,'height':im.height,
            'sha256':hashlib.sha256((MEDIA/name).read_bytes()).hexdigest(),'alphaCanvas':True}

def answer_key(year,day):
    doc=fitz.open(ROOT/f'{year}-{day}-key.pdf');text='\n'.join(p.get_text() for p in doc)
    answers={}
    for m in re.finditer(r'(?m)^\s*(\d{1,3})\s*\n\s*([A-E]|Anulad[ao])\b',text,re.I):
        n=int(m[1]);answers.setdefault(n,m[2].lower() if len(m[2])==1 else '*')
    expected=range(1,91) if day==1 else range(91,181)
    for n in expected:
        if n not in answers and re.search(rf'Quest[ãa]o\s+{n}\s+Anulada',text,re.I):answers[n]='*'
    assert all(n in answers for n in expected),(year,day,'gabarito incompleto',[n for n in expected if n not in answers])
    return {n:answers[n] for n in expected}

def extract(year,day):
    original=fitz.open(ROOT/f'{year}-{day}-exam.pdf');doc=fix(original)
    answers=answer_key(year,day);questions={};current=None;skip=False;shared=None;shared_rows=[]
    for pi,page in enumerate(doc):
        if pi==0:continue
        lines=native_lines(page);bounds=content_bounds(page,lines);figs=graphics(page,lines,bounds)
        # O anúncio de 2019/07 é um fundo tipográfico com texto nativo completo.
        # Extrair as palavras evita transformar seu papel texturizado em figura.
        if (year,day,pi+1)==(2019,1,6):figs=[r for r in figs if r.x0>page.rect.width/2]
        # Conferência visual: continuação na outra coluna e imagens cujo BBox
        # original ultrapassa a máscara de recorte do PDF. Coordenadas da fonte.
        reviewed_regions={
            (2019,2,20):[(286,517,538,640)],
            (2023,2,19):[(159,127,409,217),(140,465,426,620)],
            (2023,2,20):[(49,183,250,265),(31.12,279.4,277.85,444.53),(293,72,535,201),(355,378,478,485)],
            (2024,2,12):[(31.3,140.2,277.1,427),(31.3,433,277.1,713),(290.07,368.22,536.80,608.47)],
        }
        if (year,day,pi+1) in reviewed_regions:figs=[fitz.Rect(r) for r in reviewed_regions[year,day,pi+1]]
        reviewed_additions={
            (2019,1,11):[(30,137,277.5,559.1)],
            (2021,2,16):[(94,596,224,740)],
            (2025,2,4):[(287,611,539,741)],
            (2025,2,5):[(285,633,540,743)],
            (2025,2,17):[(20,152,276,342)],
        }
        for box in reviewed_additions.get((year,day,pi+1),[]):
            corrected=fitz.Rect(box)
            figs=[r for r in figs if (r & corrected).get_area()<r.get_area()*.25]
            figs.append(corrected)
        # Texto de apoio pode ocupar a página inteira, antes das questões.
        common=next((l for l in lines if SHARED.search(l['text'])),None)
        wide=bool(common and any(fitz.Rect(l['box']).width>bounds.width*.65 for l in lines if len(l['text'])>30))
        middle=page.rect.width/2
        wide_lines=[l for l in lines if bounds.contains(fitz.Point(l['box'][0]+1,l['box'][1])) and fitz.Rect(l['box']).width>bounds.width*.65]
        right_heads=[l['box'][1] for l in lines if HEADER.match(l['text']) and l['box'][0]>middle]
        if wide or (wide_lines and not right_heads):regions=[bounds]
        elif wide_lines and max(l['box'][3] for l in wide_lines)<min(right_heads)-2:
            split=min(right_heads)-2
            regions=[fitz.Rect(bounds.x0,bounds.y0,bounds.x1,split),fitz.Rect(bounds.x0,split,middle,bounds.y1),fitz.Rect(middle,split,bounds.x1,bounds.y1)]
        else:regions=[fitz.Rect(bounds.x0,bounds.y0,middle,bounds.y1),fitz.Rect(middle,bounds.y0,bounds.x1,bounds.y1)]
        for region in regions:
            col=int(region.x0>=middle)
            ls=[l for l in lines if region.contains(fitz.Point(l['box'][0]+1,(l['box'][1]+l['box'][3])/2))]
            ls=sorted(ls,key=lambda l:(round(l['box'][1]/3),l['box'][0]))
            prefix_owner=current
            if col==1 and not skip:
                first_head=next((i for i,l in enumerate(ls) if HEADER.match(l['text'])),len(ls))
                prefix=ls[:first_head]
                first_option=next((l['text'][0].lower() for l in prefix if l.get('option')),None)
                if first_option:
                    expected='abcde'[:'abcde'.index(first_option)]
                    candidates=[]
                    for number,question in questions.items():
                        letters=''.join(l['text'][0].lower() for l in question['lines'] if l.get('option'))
                        if letters==expected:candidates.append(number)
                    if candidates:current=prefix_owner=candidates[-1]
            for li,l in enumerate(ls):
                text=l['text'];hm=HEADER.match(text);sm=SHARED.search(text)
                if sm:
                    shared=(int(sm[1]),int(sm[2]));shared_rows=[];current=None;skip=False;continue
                if hm:
                    n=int(hm[1]);skip=n in questions
                    if day==1 and n>5 and pi+1<5:skip=False;continue
                    if skip:current=None;continue
                    if not (1<=n<=90 if day==1 else 91<=n<=180):current=None;continue
                    current=n;questions[n]={'number':n,'lines':[],'graphics':[],'pages':[],'answer':answers[n]}
                    if shared and shared[0]<=n<=shared[1]:questions[n]['lines']+=shared_rows
                    continue
                if skip:continue
                if re.match(r'^(?:LINGUAGENS|CIÊNCIAS|MATEMÁTICA|E SUAS TECNOLOGIAS|Questões de|ENEM\d|\*\w+\*|LC -|CN -|CH -|MT -)',text):continue
                if re.match(r'^\d{1,2}$',text) and l['box'][1]>bounds.y1-10:continue
                row={**l,'page':pi+1,'column':col}
                if current is not None:
                    questions[current]['lines'].append(row)
                    if pi+1 not in questions[current]['pages']:questions[current]['pages'].append(pi+1)
                elif shared:shared_rows.append(row)
            # Relacionar cada figura ao cabeçalho anterior na coluna.
            heads=[(int(HEADER.match(l['text'])[1]),l['box'][1]) for l in ls if HEADER.match(l['text'])]
            for gi,r in enumerate(figs):
                center=fitz.Point((r.x0+r.x1)/2,(r.y0+r.y1)/2)
                if not region.contains(center):continue
                before=[(n,y) for n,y in heads if y<=r.y0+3]
                owner=before[-1][0] if before else prefix_owner
                if owner not in questions:continue
                # Espanhol opcional não pode substituir a imagem do Inglês.
                if day==1 and owner<=5 and questions[owner]['pages'] and pi+1 not in questions[owner]['pages']:continue
                name=f'enem-{year}-d{day}-q{owner:03d}-p{pi+1}-{gi}.webp'
                asset=transparent_crop(page,r,name)
                if asset:questions[owner]['graphics'].append({**asset,'page':pi+1,'box':list(r)})
    expected=list(range(1,91) if day==1 else range(91,181))
    assert sorted(questions)==expected,(year,day,'questões ausentes',set(expected)-set(questions))
    output=[]
    for n,q in sorted(questions.items()):
        rows=q.pop('lines');figures=q['graphics'];texts=[];options={};option=None;markers=[]
        for l in rows:
            s=l['text'];r=fitz.Rect(l['box'])
            m=re.match(r'^([A-E])(?:\s+|$)(.*)',s)
            # Marcadores ficam junto à margem, diferentemente de títulos A/B.
            left=31 if page.rect.width<600 else 60
            relative=r.x0-(page.rect.width/2 if l['column']==1 else 0)
            if m and l.get('option'):
                option=m[1].lower();options.setdefault(option,[]);markers.append((option,l['page'],l['box']))
                if m[2].strip():options[option].append(m[2].strip())
                continue
            inside=any(f['page']==l['page'] and fitz.Rect(f['box']).contains(fitz.Point((r.x0+r.x1)/2,(r.y0+r.y1)/2)) for f in figures)
            if inside:continue
            if option:options[option].append(s)
            else:texts.append(s)
        prompt='\n'.join(texts).strip()
        if (year,n)==(2023,147):
            prompt=('Num certo momento de um jogo, a tela do computador apresenta a imagem representada na figura. '
                    'O ponto Q₁ representa a posição de um jogador que está com a bola, os pontos Q₂, Q₃, Q₄, Q₅ e Q₆ também indicam posições '
                    'de jogadores da mesma equipe, e os pontos A e B indicam os dois pés da trave mais próxima deles. '
                    'No momento da partida retratado, o jogador Q₁ tem a posse da bola, que será passada para um dos outros jogadores '
                    'das posições Qₙ, n ∈ {2, 3, 4, 5, 6}, cujo ângulo AQₙB tenha a mesma medida do ângulo AQ₁B.\n\n'
                    'Qual é o jogador que receberá a bola?')
        # A referência ao texto comum é mantida na ficha, não em uma página.
        for letter in 'abcde':
            if not options.get(letter):options[letter]=[f'Alternativa visual {letter.upper()} (ver figura identificada pela letra).']
        q.update({'prompt':prompt,'options':[{'id':letter,'text':'\n'.join(options[letter]).strip()} for letter in 'abcde'],
                  'optionMarkers':markers,'year':year,'day':day})
        q['warnings']=[]
        if len(markers)!=5:q['warnings'].append(f'{len(markers)} marcadores de alternativa')
        if len(prompt)<30:q['warnings'].append('enunciado curto')
        if any('Alternativa visual' in o['text'] for o in q['options']) and not figures:q['warnings'].append('alternativa sem figura')
        output.append(q)
    (ROOT/f'{year}-{day}-extracted.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(year,day,len(output),'figuras',sum(len(q['graphics']) for q in output),'alertas',sum(bool(q['warnings']) for q in output),flush=True)
    return output

if __name__=='__main__':
    import concurrent.futures
    pairs=[(y,d) for y in range(2018,2026) for d in [1,2]]
    with concurrent.futures.ProcessPoolExecutor(max_workers=1) as executor:
        jobs=[executor.submit(extract,*pair) for pair in pairs]
        for job in jobs:job.result()
