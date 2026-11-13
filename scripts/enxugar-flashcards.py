"""Enxuga os baralhos gerados: um cartão de núcleo e um de pegadinha por capítulo.

Os cartões `sistema_priorizado` vinham de um molde de 16 a 20 frentes por
capítulo ("Mapa básico", "Vocabulário de precisão", "Mecanismo", "FUVEST · 1ª
fase", "UNICAMP · CFCR"...), mas o verso de todas repetia as mesmas duas frases
do capítulo, o núcleo e a pegadinha, mais um conselho de estudo genérico. Eram
dezoito revisões espaçadas do mesmo par de frases.

Ficam dois cartões por capítulo, reaproveitando o id e as etiquetas do cartão 01
(núcleo) e do 05 (fronteira conceitual). Assim, o progresso de revisão desses
dois sobrevive, e a classificação derivada das etiquetas não muda. O foco por
banca, que os moldes 09 a 13 tratavam como texto fixo, passa a ser calculado na
tela a partir da incidência real (`src/lib/flashcardBoardFocus.ts`).

Nos cartões `lembre_se`, saem só as duplicatas exatas (mesma frente e mesmo
verso), mantendo a primeira ocorrência.

Uso: python3 scripts/enxugar-flashcards.py
"""
import html
import json
import re
from pathlib import Path

PASTA = Path('public/flashcards')
ARQUIVOS = ['biologia', 'filosofia', 'fisica', 'geografia', 'historia', 'ingles',
            'matematica', 'portugues', 'quimica', 'sociologia']


def texto(s: str) -> str:
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def numero_molde(card) -> int | None:
    m = re.match(r'<b>(\d+)\s', card['front']) or re.search(r'<hr><b>(\d+) · ', card['front'])
    return int(m.group(1)) if m else None


def bloco(back: str, titulo: str) -> str | None:
    """Formato com caixas: <b>Título</b><br>conteúdo</div>."""
    m = re.search(rf'<b>{re.escape(titulo)}</b><br>(.*?)</div>', back, re.S)
    return m.group(1).strip() if m else None


def rotulo(back: str, titulo: str) -> str | None:
    """Formato simples: <b>Título:</b> conteúdo<br><br>..."""
    m = re.search(rf'<b>{re.escape(titulo)}:</b>\s*(.*?)(?:<br><br>|$)', back, re.S)
    return m.group(1).strip() if m else None


def nucleo_e_pegadinha(cards):
    por_n = {numero_molde(c): c for c in cards}
    um, cinco = por_n.get(1), por_n.get(5)
    if not um or not cinco:
        raise SystemExit(f'capítulo sem os moldes 01 e 05: {cards[0]["subject"]} / {cards[0]["chapter"]}')
    nucleo = bloco(um['back'], 'Núcleo que precisa aparecer') or rotulo(um['back'], 'Modelo')
    pegadinha = bloco(cinco['back'], 'Pegadinha que precisa ser neutralizada') or rotulo(cinco['back'], 'Fronteira')
    if not nucleo or not pegadinha:
        raise SystemExit(f'não achei núcleo/pegadinha: {um["id"]}')
    return um, cinco, nucleo, pegadinha


def enxugar(cards):
    saida, grupos, ordem = [], {}, []
    vistos = set()
    for c in cards:
        if c['source'] == 'sistema_priorizado':
            chave = (c['subject'], c['chapter'])
            if chave not in grupos:
                grupos[chave] = []
                ordem.append(('grupo', chave))
            grupos[chave].append(c)
        else:
            # HTML inteiro, não só o texto: frente só com imagem viraria texto vazio
            # e cartões diferentes passariam por iguais.
            assinatura = (re.sub(r'\s+', ' ', c['front']).strip(), re.sub(r'\s+', ' ', c['back']).strip())
            if assinatura in vistos:
                continue
            vistos.add(assinatura)
            ordem.append(('cartao', c))
    for tipo, item in ordem:
        if tipo == 'cartao':
            saida.append(item)
            continue
        um, cinco, nucleo, pegadinha = nucleo_e_pegadinha(grupos[item])
        capitulo = html.escape(um['chapter'])
        saida.append({**um,
            'front': f'<b>Núcleo</b><br><br>Sem consultar: qual é a ideia central de <i>{capitulo}</i>, e quais relações não podem faltar na explicação?',
            'back': f'{nucleo}<br><br><small>Marque “Esqueci” se só reconheceu depois de virar.</small>'})
        saida.append({**cinco,
            'front': f'<b>Pegadinha</b><br><br>Qual confusão faz errar questões de <i>{capitulo}</i>? Diga a correção junto.',
            'back': pegadinha})
    return saida


antes = depois = 0
for nome in ARQUIVOS:
    caminho = PASTA / f'{nome}.json'
    cards = json.loads(caminho.read_text(encoding='utf-8'))
    novos = enxugar(cards)
    antes += len(cards); depois += len(novos)
    print(f'{nome}: {len(cards)} → {len(novos)}')
    caminho.write_text(json.dumps(novos, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'total: {antes} → {depois}')
