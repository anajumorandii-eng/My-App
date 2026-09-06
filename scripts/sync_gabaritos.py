"""Baixa os gabaritos oficiais das bancas e extrai o texto.

Por que existe: o banco de questões objetivas do app só pode receber uma questão
real quando a alternativa correta vem do gabarito oficial. Sem isso, marcar a
resposta seria chute — e um chute com cara de prova oficial ensina errado.

O que NÃO fazemos aqui: adivinhar resposta, aceitar gabarito de cursinho, ou
inferir a alternativa a partir do enunciado. Só entra o PDF publicado pela banca.

As bancas mudam o padrão de URL de um ano para o outro (a Fuvest usa
`fuvest2026-fase1-gabarito.pdf` em 2026 e `fuvest2025_gabarito_primeira_fase.pdf`
em 2025), então cada ano tem uma lista de candidatas e a primeira que responder
com um PDF de verdade vence. Falha de um ano não derruba os outros: o script
relata o que faltou e sai com erro só no fim.
"""
from __future__ import annotations

from pathlib import Path
import sys
import tempfile

import requests
from pypdf import PdfReader

# Só o texto entra no repositório. O PDF é intermediário: guardá-lo custaria
# cota de LFS (já estourada) sem acrescentar nada — o que o app precisa é da
# lista de respostas, e a URL de origem fica registrada no cabeçalho do .txt.
OUT_DIR = Path("gabaritos")
UA = {"User-Agent": "Mozilla/5.0 JUJU-Provas/1.0"}
TIMEOUT = 120

# (destino, [urls candidatas em ordem de preferência])
ALVOS: list[tuple[str, list[str]]] = [
    (
        "FUVEST/FUVEST_2026_1a_fase_gabarito.pdf",
        ["https://www.fuvest.br/wp-content/uploads/fuvest2026-fase1-gabarito.pdf"],
    ),
    (
        "FUVEST/FUVEST_2025_1a_fase_gabarito.pdf",
        [
            "https://www.fuvest.br/wp-content/uploads/fuvest2025_gabarito_primeira_fase.pdf",
            "https://www.fuvest.br/wp-content/uploads/fuvest2025-fase1-gabarito.pdf",
        ],
    ),
    (
        "FUVEST/FUVEST_2024_1a_fase_gabarito.pdf",
        [
            "https://www.fuvest.br/wp-content/uploads/fuvest2024_gabarito_primeira_fase.pdf",
            "https://www.fuvest.br/wp-content/uploads/fuvest2024-fase1-gabarito.pdf",
        ],
    ),
    (
        "FUVEST/FUVEST_2023_1a_fase_gabarito.pdf",
        [
            "https://www.fuvest.br/wp-content/uploads/fuvest2023_gabarito_primeira_fase.pdf",
            "https://www.fuvest.br/wp-content/uploads/fuvest2023-fase1-gabarito.pdf",
            "https://www.fuvest.br/wp-content/uploads/gabarito_primeira_fase_2023.pdf",
        ],
    ),
]


def baixar(urls: list[str], destino: Path) -> str | None:
    """Tenta cada URL; devolve a que funcionou, ou None."""
    for url in urls:
        try:
            r = requests.get(url, headers=UA, timeout=TIMEOUT)
        except Exception as e:  # rede instável não deve matar o lote inteiro
            print(f"    {url} -> erro de rede: {e}")
            continue
        if r.status_code != 200:
            print(f"    {url} -> HTTP {r.status_code}")
            continue
        if not r.content.startswith(b"%PDF"):
            # Muitos sites devolvem 200 com uma página de erro em HTML.
            print(f"    {url} -> 200 mas não é PDF ({len(r.content)} bytes)")
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_bytes(r.content)
        print(f"    OK {url} ({len(r.content)} bytes)")
        return url
    return None


def extrair_texto(pdf: Path, destino: Path, url: str) -> int:
    reader = PdfReader(str(pdf))
    partes = [
        f"fonte: {url}",
        f"paginas: {len(reader.pages)}",
        "",
    ]
    for i, page in enumerate(reader.pages, 1):
        partes.append(f"===== pagina {i} =====")
        partes.append(page.extract_text() or "")
    texto = "\n".join(partes)
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(texto, encoding="utf-8")
    return sum(len(p.extract_text() or "") for p in reader.pages)


def main() -> int:
    faltando: list[str] = []
    for rel, urls in ALVOS:
        saida = OUT_DIR / rel.replace(".pdf", ".txt")
        print(f"{rel}:")
        if saida.exists() and saida.stat().st_size > 200:
            print("    JA EXISTE")
            continue
        with tempfile.TemporaryDirectory() as tmp:
            pdf = Path(tmp) / "g.pdf"
            url = baixar(urls, pdf)
            if url is None:
                faltando.append(rel)
                continue
            chars = extrair_texto(pdf, saida, url)
            print(f"    texto extraido: {chars} caracteres -> {saida}")
            if chars < 200:
                # Gabarito é uma tabela curta, mas 200 caracteres é pouco até
                # para isso: provavelmente o PDF é digitalizado e precisa de OCR.
                print("    AVISO: quase sem texto — pode ser PDF digitalizado")

    if faltando:
        print("\nNão foi possível baixar:")
        for f in faltando:
            print(f"  - {f}")
        print("As bancas mudam o caminho dos PDFs; confira a URL e atualize ALVOS.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
