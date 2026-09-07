#!/usr/bin/env python3
"""Le uma apostila de "ultimos 10 anos" em texto e devolve as questoes objetivas.

A apostila vem organizada por modulo (CARTOGRAFIA, GENETICA, IDADE MEDIA...),
com as questoes numeradas de forma continua e um gabarito no fim, tambem por
modulo. O modulo e o que da o capitulo da questao no app, entao ele e lido do
sumario e nao adivinhado.

O texto de origem NAO entra no repositorio: ele carrega uma marca d'agua com
nome, e-mail e CPF da licenciada em toda pagina. `limpar` remove essas linhas
antes de qualquer coisa, e `montar` so devolve enunciado, alternativas e letra
do gabarito -- a resolucao escrita pela apostila fica de fora, porque e texto
autoral de terceiro e este repositorio e publico.

O que este script recusa nao esta perdido: as questoes descartadas saem num
arquivo .descartes.json ao lado da saida principal, e scripts/recortar-questoes-
apostila.py as recupera anexando a imagem da pagina original, onde a figura, a
formula e o texto-base continuam existindo.
"""
from __future__ import annotations

import json
import pathlib
import re
import sys
import unicodedata
from dataclasses import dataclass, field

# A marca d'agua as vezes vira uma linha propria e as vezes gruda no fim da
# ultima alternativa, entao nao da para ancorar em inicio de linha.
MARCA = re.compile(r"[ \t]*Licenciado para\s*-.*?Protegido por Eduzz\.com", re.I | re.S)
RODAPE = re.compile(r"^\s*\d*\s*GABARITA[A-Z]*\.COM\.BR\s*\d*\s*$", re.M)
RODAPE_INLINE = re.compile(r"\s*\d*\s*GABARITA[A-Z]*\.COM\.BR\s*\d*\s*")
CPF = re.compile(r"\b\d{11}\b")

INICIO_QUESTAO = re.compile(r"^(\d+)\\?\.\s*\((?:[^)]{0,40})\)\s*", re.M)
RESPOSTA = re.compile(r"^Resposta da quest[aã]o (\d+):", re.M)
# A letra vem na linha seguinte ou colada no mesmo "Resposta da questão 1: [A]",
# dependendo de como o PDF foi convertido.
LETRA = re.compile(r"\\?\[\\?([A-E])\\?\]")

# Uma questao que depende de figura, mapa, grafico ou tabela nao pode ser
# respondida so com o texto -- a apostila e um PDF e a imagem nao vem junto.
# Plural incluido de proposito: "as imagens abaixo" ja escapou uma vez.
VISUAL = re.compile(
    r"\b(imagem|imagens|figuras?|gr[aá]ficos?|mapas?|tabelas?|quadros?|esquemas?|"
    r"charges?|tirinhas?|cartuns?|cartoons?|fotografias?|fotos?|ilustra[cç][aã]o|"
    r"ilustra[cç][oõ]es|desenhos?|diagramas?|infogr[aá]ficos?|cartazes?|telas?|"
    r"pinturas?|gravuras?|litografias?|caricaturas?|quadrinhos?|mapa-m[uú]ndi|"
    r"planta baixa|croquis?|organogramas?|fluxogramas?|histogramas?|pir[aâ]mide et[aá]ria|"
    r"genealogias?|heredogramas?|pedigrees?|cari[oó]tipos?|cladogramas?|[aá]rvore genealogica|[aá]rvore filogen[eé]tica)\b",
    re.I,
)


# Descartes decididos lendo a questao, quando nenhuma regra automatica dava
# conta sem derrubar questao boa junto. Ficam num arquivo separado para poderem
# ser revistos sem mexer no extrator.
LIDOS_A_MAO = json.loads(
    (pathlib.Path(__file__).resolve().parent / "apostila-descartes.json").read_text(encoding="utf-8")
)

# O PDF posiciona expoente, indice, fracao e simbolo matematico como glifos
# soltos, e a extracao linear devolve "5 × 10 5 km/h" no lugar de 5x10^5 km/h,
# "P 100 W =" no lugar de P = 100 W, "(x 4x + 1) 2" no lugar de (x-4x+1)^2.
# Nao da para consertar isso lendo o texto, e nao da para saber quando quebrou:
# por isso a regra nao tenta reconhecer o estrago, e sim recusar qualquer
# questao que dependa de notacao. Isso pega quase toda a Matematica e a Fisica
# -- e por isso o descarte nao e o fim da linha: scripts/recortar-questoes-
# apostila.py recupera essas questoes anexando a imagem da pagina, onde a
# formula continua legivel.
NOTACAO = re.compile(
    r"[=×÷√∑∫≅≈≠≤≥∆Δ→↔^]|\b[A-Z]\s+\d|\d\s+\d"
    # expoente de unidade que virou digito solto: "10 km 2" era 10 km2.
    r"|\b(?:km|cm|mm|dm|m|kg|mg|g|L|ml|s|h|min)\s+[23]\b"
    # fatorial e fracao: "9! (2!2!)" era 9!/(2!2!), e a barra nao veio.
    r"|\d\s*!"
    # menos orfao depois de parentese: "(180 y) -" era 180 - y.
    r"|\)\s*-(?:\s|$)"
    # indice de formula quimica que migrou para a frente do simbolo:
    # "2 CO" e "2O" eram CO2 e O2.
    r"|\b\d\s+[A-Z][A-Za-z]?\b"
    # indice que se soltou de uma variavel: "(x 1 ,y 1 )" era (x1, y1).
    r"|\d\s+[,)]"
)

# A apostila emenda o cabecalho do texto-base da questao seguinte no fim da
# ultima alternativa.
PROXIMA_QUESTAO = re.compile(r"TEXTO PARA (?:A|AS) (?:PR[OÓ]XIMA|QUEST)", re.I)

# "34 da altura do cilindro" era 3/4 da altura: a barra da fracao sumiu e os
# dois digitos colaram.
FRACAO_COLADA = re.compile(r"^\d{2}\s+d[aeo]s?\b", re.I)
# Numa questao de razao ou probabilidade, alternativa que e um inteiro solto
# quase sempre era uma fracao cuja barra se perdeu: "52" era 5/2, "1781" era
# 17/81. O par (pergunta por razao, resposta inteira) e o que denuncia.
PEDE_RAZAO = re.compile(r"\b(raz[aã]o|probabilidade|fra[cç][aã]o|propor[cç][aã]o)\b", re.I)
SO_NUMERO = re.compile(r"^\d+$")
# Cabecalho da questao seguinte que escapou do corte por estar no meio da linha.
QUESTAO_SEGUINTE = re.compile(r"\d+\s*\.\s*\((?:Unicamp|Fuvest|Unesp|Enem)\)", re.I)


# A conversao em markdown escapa colchete, asterisco e afins com contrabarra.
# Isso so pode sair no fim: e a mesma contrabarra que marca "1\\." como inicio
# de questao e "\\[C\\]" como gabarito.
ESCAPE_MD = re.compile(r"\\([\[\]*_#~`.()!<>-])")

# A apostila agrupa questoes sob um texto-base comum ("Leia o texto para
# responder as questoes 11 e 12"). O parser fatia por numero de questao, entao a
# segunda questao do grupo chega sem o texto de que ela fala.
REFERE_TEXTO = re.compile(
    # O determinante importa tanto quanto o substantivo: "nessa crônica" e
    # "deste grafite" apontam para algo que deveria estar no enunciado do mesmo
    # jeito que "no texto", e a primeira versao desta regra so pegava a ultima.
    r"\b(?:n?[oa]s?|n?est[ae]s?|n?ess[ae]s?|n?aquel[ae]s?|d[oa]s?|a[oa]?s?|pel[oa]s?)\s+"
    r"(texto|trecho|excerto|fragmento|poema|soneto|documento|depoimento|discurso|"
    r"cita[cç][aã]o|passagem|versos|estrofe|carta|manifesto|romance|conto|cr[oô]nica|"
    r"reportagem|not[ií]cia|entrevista|artigo|mat[eé]ria|manchete|post|publica[cç][aã]o|"
    r"grafite|montagem|slogan|an[uú]ncio|propaganda|di[aá]logo|can[cç][aã]o|can[cç][oõ]es|"
    r"m[uú]sica|letra da can[cç][aã]o|capa)s?\b"
    r"|\btextos?\s+[IVX]+\b"
    # "o autor diz", sem o texto do autor por perto, e a mesma falta.
    r"|\b[oa]s?\s+autor(?:a|es|as)?\b",
    re.I,
)
CITACAO = re.compile(r"[“\"«][^”\"»]{80,}[”\"»]")


def desescapar(texto: str) -> str:
    return ESCAPE_MD.sub(r"\1", texto)


def limpar(texto: str) -> str:
    # A quebra de pagina do pdftotext e um form feed grudado na primeira linha
    # da pagina seguinte, o que faz o inicio de linha sumir para as ancoras.
    texto = texto.replace("\f", "\n")
    texto = MARCA.sub("", texto)
    # Indice de paginas que a conversao deixa como link de markdown solto.
    texto = re.sub(r"\[\\?#\d+\\?\]\(#\d+\)", "", texto)
    texto = RODAPE.sub("", texto)
    texto = RODAPE_INLINE.sub(" ", texto)
    texto = re.sub(r"\n{3,}", "\n\n", texto)
    return texto


def sem_acento(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")


def ler_sumario(texto: str) -> list[str]:
    """Os modulos vem do sumario, na ordem em que aparecem no corpo."""
    corte = texto.find("SUMÁRIO")
    if corte < 0:
        return []
    bloco = texto[corte : corte + 6000]
    fim = bloco.find("Gabarito:")
    if fim > 0:
        bloco = bloco[:fim]
    modulos = []
    for pedaco in re.findall(r"([A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ][A-ZÁÂÃÀÉÊÍÓÔÕÚÜÇ /–\-]{2,})\s*\.{4,}", bloco):
        nome = pedaco.strip()
        if nome and nome not in modulos:
            modulos.append(nome)
    return modulos


def separar_gabarito(texto: str) -> tuple[str, str]:
    """Corta no ponto em que o gabarito comeca de verdade, nao no sumario."""
    primeira = RESPOSTA.search(texto)
    if not primeira:
        return texto, ""
    cabecalho = texto.rfind("\nGabarito:", 0, primeira.start())
    corte = cabecalho if cabecalho > 0 else primeira.start()
    return texto[:corte], texto[corte:]


def ler_respostas(gabarito: str) -> dict[int, str]:
    respostas: dict[int, str] = {}
    marcas = list(RESPOSTA.finditer(gabarito))
    for i, m in enumerate(marcas):
        numero = int(m.group(1))
        fim = marcas[i + 1].start() if i + 1 < len(marcas) else len(gabarito)
        # Só o começo do bloco: mais adiante a resolução cita alternativas
        # ("descartaria a alternativa [A]") e isso não é o gabarito.
        corpo = gabarito[m.end() : min(fim, m.end() + 120)]
        letra = LETRA.search(corpo)
        if letra:
            respostas[numero] = letra.group(1).lower()
    return respostas


@dataclass
class Bloco:
    numero: int
    modulo: str
    texto: str


def ler_questoes(corpo: str, modulos: list[str]) -> list[Bloco]:
    """Percorre o corpo uma vez, trocando de modulo quando bate o titulo."""
    titulos = {sem_acento(m).upper(): m for m in modulos}
    blocos: list[Bloco] = []
    modulo_atual = modulos[0] if modulos else ""
    marcas = list(INICIO_QUESTAO.finditer(corpo))
    # Um mesmo numero aparecendo duas vezes quer dizer que um dos dois inicios e
    # falso, e nao da para saber qual: os dois saem.
    vistos: dict[int, int] = {}
    for m in marcas:
        n = int(m.group(1))
        vistos[n] = vistos.get(n, 0) + 1
    repetidos = {n for n, c in vistos.items() if c > 1}
    for i, m in enumerate(marcas):
        fim = marcas[i + 1].start() if i + 1 < len(marcas) else len(corpo)
        trecho = corpo[m.end() : fim]
        # O titulo do proximo modulo aparece no fim do bloco da questao anterior.
        antes = corpo[marcas[i - 1].end() if i else 0 : m.start()]
        for linha in antes.split("\n"):
            chave = sem_acento(linha.strip()).upper()
            if chave in titulos:
                modulo_atual = titulos[chave]
        numero = int(m.group(1))
        if numero in repetidos:
            continue
        # O titulo do proximo modulo vem logo depois da ultima alternativa e
        # acabava grudado nela ("...as afirmativas I, II e III. IDADE MÉDIA").
        for linha in trecho.split("\n"):
            if sem_acento(linha.strip()).upper() in titulos:
                trecho = trecho[: trecho.index(linha)]
                break
        blocos.append(Bloco(numero, modulo_atual, trecho.strip()))
    return blocos


def separar_alternativas(texto: str, letras: str) -> tuple[str, list[tuple[str, str]]]:
    """Alternativas vem coladas na mesma linha: 'a) ... b) ... c) ...'."""
    posicoes: list[tuple[str, int, int]] = []
    inicio = 0
    for letra in letras:
        # A alternativa comeca em inicio de linha ou depois de espaco, nunca no
        # meio de uma palavra: "a)" dentro de "(letra a)" nao vale.
        padrao = re.compile(r"(?:^|(?<=\s))" + re.escape(letra) + r"\)\s", re.M)
        achado = padrao.search(texto, inicio)
        if not achado:
            return texto, []
        posicoes.append((letra, achado.start(), achado.end()))
        inicio = achado.end()
    enunciado = texto[: posicoes[0][1]].strip()
    alternativas = []
    for i, (letra, ini, fim_marca) in enumerate(posicoes):
        fim = posicoes[i + 1][1] if i + 1 < len(posicoes) else len(texto)
        alternativas.append((letra, " ".join(texto[fim_marca:fim].split()).strip(" .")))
    return enunciado, alternativas


def descartar(enunciado: str, alternativas: list[tuple[str, str]]) -> str | None:
    if len(enunciado) < 60:
        return "enunciado curto demais"
    if len(enunciado) > 3500:
        return "enunciado longo demais"
    # Qualquer mencao a um elemento visual desqualifica, sem tentar adivinhar se
    # e mesmo uma referencia a figura do PDF. Exigir uma palavra de deixis por
    # perto ("abaixo", "a seguir") deixava passar "como na figura" e "a tela de
    # Rodolfo Amoedo mostra". Isso derruba tambem alguns enunciados em que a
    # palavra e figurada ("a imagem do pais no exterior"), e esse e o lado certo
    # de errar: questao sem a figura nao tem resposta, so frustracao.
    achado = VISUAL.search(enunciado)
    if achado:
        return f"depende de elemento visual ({achado.group(0)})"
    if not alternativas:
        return "alternativas nao identificadas"
    textos = [t.strip().lower() for _, t in alternativas]
    if len(set(textos)) != len(textos):
        # Duas alternativas iguais quer dizer que o que as distinguia (raiz,
        # expoente, fracao) se perdeu na extracao.
        return "alternativas repetidas depois da extracao"
    if any(FRACAO_COLADA.match(t) for _, t in alternativas):
        return "fracao virou numero colado na alternativa"
    if PEDE_RAZAO.search(enunciado) and all(SO_NUMERO.match(t) for _, t in alternativas):
        return "fracao virou numero colado na alternativa"
    if QUESTAO_SEGUINTE.search(enunciado) or any(QUESTAO_SEGUINTE.search(t) for _, t in alternativas):
        return "cabecalho da questao seguinte grudado no bloco"
    if any(PROXIMA_QUESTAO.search(t) for _, t in alternativas) or PROXIMA_QUESTAO.search(enunciado):
        return "cabecalho da questao seguinte grudado no bloco"
    # Alternativa que comeca com "1," ou "2," esta lendo os numeros de uma legenda
    # de mapa ou esquema que ficou no PDF.
    if sum(1 for _, t in alternativas if re.match(r"^\d+\s*[,)]", t)) >= 2:
        return "alternativas referenciam uma legenda numerada"
    if REFERE_TEXTO.search(enunciado) and not CITACAO.search(enunciado) and len(enunciado) < 900:
        return "cita um texto-base que ficou fora do enunciado"
    # Uma parte de cada vez: juntar enunciado e alternativas num texto so criava
    # falso positivo, porque o fim do enunciado colado ao inicio da alternativa
    # ("igual a: 21 20 15") vira "digito espaco digito" sem que nada tenha
    # quebrado. Foi assim que questoes intactas viraram descarte.
    if any(NOTACAO.search(p) for p in [enunciado, *(t for _, t in alternativas)]):
        return "depende de notacao que nao sobrevive a extracao"
    for _, t in alternativas:
        if not t or len(t) > 600:
            return "alternativa vazia ou longa demais"
    return None


def montar(
    caminho: str,
    banca: str,
    subject: str,
    letras: str,
    prefixo: str,
    caminho_gabarito: str | None = None,
) -> tuple[list[dict], dict[str, int]]:
    """O enunciado e o gabarito podem vir de extracoes diferentes do mesmo PDF.

    A conversao em markdown preserva simbolos que importam no enunciado (grau,
    expoente), mas trunca documentos longos; a conversao do pdftotext vem
    inteira e perde alguns simbolos. Como o gabarito e so uma letra, ler o
    enunciado de uma e a letra da outra da o melhor dos dois.
    """
    texto = limpar(open(caminho, encoding="utf-8").read())
    modulos = ler_sumario(texto)
    corpo, gabarito = separar_gabarito(texto)
    if caminho_gabarito:
        _, gabarito = separar_gabarito(limpar(open(caminho_gabarito, encoding="utf-8").read()))
    respostas = ler_respostas(gabarito)
    blocos = ler_questoes(corpo, modulos)

    questoes: list[dict] = []
    descartadas: list[dict] = []
    motivos: dict[str, int] = {}
    for bloco in blocos:
        letra = respostas.get(bloco.numero)
        if not letra:
            motivos["sem gabarito"] = motivos.get("sem gabarito", 0) + 1
            continue
        enunciado, alternativas = separar_alternativas(bloco.texto, letras)
        # Pontuacao solta no comeco sobra quando o enunciado se separa do titulo
        # do modulo na linha anterior.
        enunciado = re.sub(r"^[;:,.\s]+", "", desescapar(" ".join(enunciado.split())))
        alternativas = [(l, desescapar(t)) for l, t in alternativas]
        ident = f"{prefixo}_{bloco.numero:03d}"
        motivo = LIDOS_A_MAO.get(ident) or descartar(enunciado, alternativas)
        if motivo is None and letra not in {l for l, _ in alternativas}:
            motivo = "gabarito fora das alternativas"
        if motivo:
            motivos[motivo] = motivos.get(motivo, 0) + 1
            # Boa parte do que sai daqui e questao inteira: so o que estava na
            # figura, na formula ou no texto-base e que nao sobrevive ao texto.
            # Guardar o descarte permite recupera-la depois anexando a pagina
            # original, que e onde essas coisas continuam existindo.
            descartadas.append(
                {
                    "id": ident,
                    "numero": bloco.numero,
                    "subject": subject,
                    "modulo": bloco.modulo,
                    "motivo": motivo,
                    "prompt": enunciado,
                    "options": [{"id": l, "text": t} for l, t in alternativas],
                    "correctOptionId": letra,
                    "examSource": {"board": banca},
                }
            )
            continue
        if CPF.search(enunciado) or "Licenciado para" in enunciado:
            motivos["marca d'agua no enunciado"] = motivos.get("marca d'agua no enunciado", 0) + 1
            continue
        questoes.append(
            {
                "id": ident,
                "subject": subject,
                "modulo": bloco.modulo,
                "prompt": enunciado,
                "options": [{"id": l, "text": t} for l, t in alternativas],
                "correctOptionId": letra,
                "examSource": {"board": banca},
            }
        )
    return questoes, descartadas, motivos


if __name__ == "__main__":
    caminho, banca, subject, letras, prefixo, saida = sys.argv[1:7]
    caminho_gabarito = sys.argv[7] if len(sys.argv) > 7 else None
    questoes, descartadas, motivos = montar(caminho, banca, subject, letras, prefixo, caminho_gabarito)
    with open(saida, "w", encoding="utf-8") as f:
        json.dump(questoes, f, ensure_ascii=False, indent=2)
    with open(saida.replace(".json", ".descartes.json"), "w", encoding="utf-8") as f:
        json.dump(descartadas, f, ensure_ascii=False, indent=2)
    print(f"{prefixo}: {len(questoes)} aproveitadas")
    for motivo, n in sorted(motivos.items(), key=lambda kv: -kv[1]):
        print(f"    descartadas por {motivo}: {n}")
