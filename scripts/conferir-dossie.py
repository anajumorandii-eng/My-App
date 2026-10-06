#!/usr/bin/env python3
"""Confere as citações dos dossiês de obras contra o texto da edição.

Uso:
  python3 scripts/conferir-dossie.py paginar <slug> <arquivo.pdf>
  python3 scripts/conferir-dossie.py conferir [slug ...]

`paginar` extrai o PDF página por página (pdftotext) para
materiais-extraidos/obras/<slug>.paginas.txt, que está no .gitignore: o texto
da edição não pode ir para o repositório. `conferir` exige que cada citação
de src/data/obras/dossies/<slug>.json esteja, literalmente, na página que o
cartão declara, e que cada capítulo comece na página indicada. Falha com
código 1 se algo não bater.

O teste do Vitest confere a estrutura, mas não enxerga o texto da edição;
por isso esta conferência roda localmente, antes de mandar o dossiê para
revisão. Citação que não está na página é pior que citação nenhuma.
"""
import json
import pathlib
import re
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
DOSSIES = RAIZ / 'src/data/obras/dossies'
TEXTOS = RAIZ / 'materiais-extraidos/obras'


def normalizar(texto: str) -> str:
    return re.sub(r'\s+', ' ', texto).strip().lower()


def paginar(slug: str, pdf: str) -> None:
    info = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True, check=True).stdout
    total = int(re.search(r'Pages:\s+(\d+)', info).group(1))
    linhas = []
    for pagina in range(1, total + 1):
        texto = subprocess.run(['pdftotext', '-f', str(pagina), '-l', str(pagina), pdf, '-'],
                               capture_output=True, text=True, check=True).stdout
        linhas.append(f'[p{pagina}] {" ".join(texto.split())}')
    TEXTOS.mkdir(parents=True, exist_ok=True)
    (TEXTOS / f'{slug}.paginas.txt').write_text('\n'.join(linhas), encoding='utf-8')
    print(f'{slug}: {total} páginas extraídas')


def carregar_paginas(slug: str) -> dict[int, str]:
    arquivo = TEXTOS / f'{slug}.paginas.txt'
    if not arquivo.exists():
        raise FileNotFoundError(f'{arquivo} ausente; rode "paginar" antes')
    paginas = {}
    for linha in arquivo.read_text(encoding='utf-8').splitlines():
        achado = re.match(r'\[p(\d+)\] ?(.*)', linha)
        if achado:
            paginas[int(achado.group(1))] = normalizar(achado.group(2))
    return paginas


def conferir_aspas(dossie: dict, paginas: dict[int, str]) -> list[str]:
    """Cartão não é o único lugar com citação: as análises também citam entre
    aspas curvas, e essas nunca passavam por conferência. Aspas seguidas de
    "p. N" precisam estar naquela página; sem página, em algum lugar do livro.
    " / " marca quebra de verso; trecho com reticências descreve um padrão
    (“Por mais que… / Existe…”) e fica de fora, assim como título de uma ou
    duas palavras."""
    textos = [m['markdown'] for m in dossie['modules']]
    for unidade in dossie['units']:
        textos += [unidade['guide']['summary'], *unidade['guide']['observe']]
    for cartao in dossie['evidence']:
        textos += [cartao[k] for k in ('context', 'formalDevice', 'effect', 'wholeRelation')]
    livro = ' '.join(paginas.values())
    erros = []
    for texto in textos:
        for achado in re.finditer(r'“([^”]{8,})”', texto):
            trecho = normalizar(achado.group(1).replace(' / ', ' ')).rstrip('.,;!?…')
            if '…' in trecho or len(trecho.split()) < 3:
                continue
            faixa = re.search(r'p\. (\d+)(?:-(\d+))?', texto[achado.end():achado.end() + 60])
            if faixa:
                inicio, fim = int(faixa.group(1)), int(faixa.group(2) or faixa.group(1))
                if trecho not in ' '.join(paginas.get(p, '') for p in range(inicio, fim + 1)):
                    erros.append(f'aspas “{trecho[:60]}” não estão em p. {inicio}-{fim}')
            elif trecho not in livro:
                erros.append(f'aspas “{trecho[:60]}” não estão no livro')
    return erros


def conferir(slug: str) -> list[str]:
    dossie = json.loads((DOSSIES / f'{slug}.json').read_text(encoding='utf-8'))
    paginas = carregar_paginas(slug)
    erros = []
    for cartao in dossie['evidence']:
        faixa = re.search(r'p\. (\d+)(?:-(\d+))?', cartao['location'])
        if not faixa:
            erros.append(f'{cartao["id"]}: location sem página')
            continue
        inicio = int(faixa.group(1))
        fim = int(faixa.group(2) or inicio)
        texto = ' '.join(paginas.get(p, '') for p in range(inicio, fim + 1))
        if normalizar(cartao['quote']) not in texto:
            onde = [p for p, t in paginas.items() if normalizar(cartao['quote'])[:30] in t]
            erros.append(f'{cartao["id"]}: citação não está em {cartao["location"]} (início achado em {onde or "nenhuma página"})')
    erros += conferir_aspas(dossie, paginas)
    for unidade in dossie['units']:
        # Romance tem capítulo em romano no título; livro de poemas declara em
        # 'opening' o texto que abre a página, porque a parte nem sempre
        # começa com o próprio nome.
        pagina = paginas.get(unidade['pdfStartPage'], '')
        if unidade.get('opening'):
            # Ensaio e livro de poemas: a seção pode começar no meio da página,
            # então basta que o texto de abertura esteja nela.
            abertura = normalizar(unidade['opening'])
            confere = abertura in pagina
        else:
            abertura = normalizar(unidade['title'].split(' ')[0]) + ' '
            confere = pagina.startswith(abertura)
        if not confere:
            erros.append(f'{unidade["id"]}: página {unidade["pdfStartPage"]} não abre com "{abertura}"')
    return erros


def main() -> int:
    if len(sys.argv) >= 2 and sys.argv[1] == 'paginar' and len(sys.argv) == 4:
        paginar(sys.argv[2], sys.argv[3])
        return 0
    if len(sys.argv) >= 2 and sys.argv[1] == 'conferir':
        slugs = sys.argv[2:] or sorted(p.stem for p in DOSSIES.glob('*.json'))
        falhou = False
        for slug in slugs:
            erros = conferir(slug)
            print(f'{slug}: {"ok" if not erros else f"{len(erros)} problema(s)"}')
            for erro in erros:
                print('  -', erro)
            falhou = falhou or bool(erros)
        return 1 if falhou else 0
    print(__doc__)
    return 2


if __name__ == '__main__':
    sys.exit(main())
