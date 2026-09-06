from __future__ import annotations
import re, unicodedata
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

ROOT = Path("provas brutas")
UA = {"User-Agent": "Mozilla/5.0 JUJU-Provas/1.0"}

def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", s).strip().lower()

def download_pdf(url: str, dest: Path) -> bool:
    try:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = requests.get(url, headers=UA, timeout=90, allow_redirects=True)
        r.raise_for_status()
        data = r.content
        if not data.startswith(b"%PDF"):
            raise RuntimeError(f"conteúdo não é PDF ({r.headers.get('content-type')})")
        dest.write_bytes(data)
        print(f"OK {dest} ({len(data)/1024/1024:.1f} MB)")
        return True
    except Exception as e:
        print(f"ERRO {dest}: {url}: {e}")
        return False

def links(page: str):
    r = requests.get(page, headers=UA, timeout=60)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    out = []
    for a in soup.find_all("a", href=True):
        t = " ".join(a.stripped_strings)
        out.append((t, norm(t), urljoin(page, a["href"])))
    return out

def pick(items, predicates):
    for pred in predicates:
        for raw, n, href in items:
            if pred(raw, n, href):
                return href
    return None

def sync_fuvest():
    for year in (2023, 2024, 2025, 2026):
        page = f"https://www.fuvest.br/acervo-vestibular-{year}/"
        items = links(page)
        u1 = pick(items, [
            lambda r,n,h: ("prova" in n and (" v1" in n or n.endswith(" v1"))),
            lambda r,n,h: n == "prova v",
            lambda r,n,h: ("prova" in n and re.search(r"\bv\b", n) is not None),
        ])
        u2d1 = pick(items, [
            lambda r,n,h: ("1o dia" in n and "respost" not in n and "abord" not in n and ("prova" in n or n == "1o dia")),
        ])
        u2d2 = pick(items, [
            lambda r,n,h: ("2o dia" in n and "respost" not in n and "abord" not in n and ("prova" in n or n == "2o dia")),
        ])
        for url, dest in [
            (u1, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_1a_fase.pdf"),
            (u2d1, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_2a_fase_1o_dia.pdf"),
            (u2d2, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_2a_fase_2o_dia.pdf"),
        ]:
            if url:
                download_pdf(url, dest)
            else:
                print(f"ERRO link não encontrado: {dest}")

def sync_unicamp():
    # Para Medicina, o segundo dia específico é o caderno Ciências Biológicas/Saúde.
    # O primeiro dia da 2ª fase é o caderno comum (Redação/Português/Interdisciplinares).
    urls = {
        2023: (
            "https://www.comvest.unicamp.br/vest2023/F1/f12023Q_Z.pdf",
            "https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2redporingcn.pdf",
            "https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2CB.pdf",
        ),
        2024: (
            "https://www.comvest.unicamp.br/vest2024/F1/f12024Q_Y.pdf",
            "https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2redporingcn.pdf",
            "https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2CB.pdf",
        ),
        2025: (
            "https://www.comvest.unicamp.br/vest2025/F1/f12025Q_Z.pdf",
            "https://www.comvest.unicamp.br/vest2025/F2/provas/2025F2redporingcn.pdf",
            "https://www.comvest.unicamp.br/vest2025/F2/provas/2025F2CB.pdf",
        ),
        2026: (
            "https://www.comvest.unicamp.br/vest2026/F1/f12026Q_X.pdf",
            "https://www.comvest.unicamp.br/vest2026/F2/provas/2026F2redporingcn.pdf",
            "https://www.comvest.unicamp.br/vest2026/F2/provas/2026F2CB.pdf",
        ),
    }
    for year, (f1, d1, d2) in urls.items():
        for url, dest in [
            (f1, ROOT/"UNICAMP"/str(year)/f"UNICAMP_{year}_1a_fase.pdf"),
            (d1, ROOT/"UNICAMP"/str(year)/f"UNICAMP_{year}_2a_fase_1o_dia.pdf"),
            (d2, ROOT/"UNICAMP"/str(year)/f"UNICAMP_{year}_2a_fase_2o_dia_Biologicas_Saude.pdf"),
        ]:
            download_pdf(url, dest)

if __name__ == "__main__":
    sync_fuvest()
    sync_unicamp()
