#!/usr/bin/env python3
"""Substitui o texto das secoes de um capitulo de resumo profundo.

Recebe um JSON no formato {"Materia|Topico": ["texto secao 1", ..., "texto secao 5"]}
e reescreve apenas o campo content de cada secao, preservando os titulos e o
recall. Marca o capitulo com rev 2 para que o app peca releitura so dele.

Recusa capitulo desconhecido, numero de secoes diferente do original e texto
mais curto que o que ja estava la - aprofundar nunca deve encurtar.
"""
import json, sys, pathlib

ALVO = pathlib.Path(__file__).resolve().parent.parent / 'src/data/deepSummaryContent.json'
MINIMO = 800  # caracteres por secao; abaixo disso nao e aprofundamento

def main(caminho):
    capitulos = json.loads(ALVO.read_text(encoding='utf-8'))
    indice = {f"{c['subject']}|{c['topic']}": c for c in capitulos}
    novos = json.loads(pathlib.Path(caminho).read_text(encoding='utf-8'))

    erros, aplicados = [], 0
    for chave, textos in novos.items():
        capitulo = indice.get(chave)
        if capitulo is None:
            erros.append(f'{chave}: capitulo inexistente')
            continue
        if len(textos) != len(capitulo['sections']):
            erros.append(f"{chave}: {len(textos)} secoes, o capitulo tem {len(capitulo['sections'])}")
            continue
        for i, (texto, secao) in enumerate(zip(textos, capitulo['sections']), 1):
            if len(texto) < MINIMO:
                erros.append(f'{chave} secao {i}: {len(texto)} caracteres, minimo {MINIMO}')
            elif len(texto) <= len(secao['content']):
                erros.append(f'{chave} secao {i}: mais curta que a versao atual')
    if erros:
        print('nada foi escrito:', file=sys.stderr)
        for e in erros: print(' -', e, file=sys.stderr)
        return 1

    for chave, textos in novos.items():
        capitulo = indice[chave]
        for texto, secao in zip(textos, capitulo['sections']):
            secao['content'] = texto
        capitulo['rev'] = 2
        aplicados += 1

    ALVO.write_text(json.dumps(capitulos, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{aplicados} capitulos aprofundados')
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
