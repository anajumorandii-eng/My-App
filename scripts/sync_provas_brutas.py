from __future__ import annotations
import os, re, sys, unicodedata
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

def download_pdf(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    r = requests.get(url, headers=UA, timeout=90, allow_redirects=True)
    r.raise_for_status()
    data = r.content
    if not data.startswith(b"%PDF"):
        raise RuntimeError(f"Não é PDF: {url} -> {r.headers.get('content-type')}")
    dest.write_bytes(data)
    print(f"OK {dest} ({len(data)/1024/1024:.1f} MB)")

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
                return href, raw
    return None, None

def sync_fuvest():
    for year in (2023, 2024, 2025, 2026):
        page = f"https://www.fuvest.br/acervo-vestibular-{year}/"
        items = links(page)
        # Uma versão canônica da 1ª fase. V/V1 têm o mesmo conteúdo, mudando ordem/cor.
        u1, l1 = pick(items, [
            lambda r,n,h: ("prova" in n and (" v1" in n or n.endswith(" v1"))),
            lambda r,n,h: (n == "prova v"),
            lambda r,n,h: ("prova" in n and re.search(r"\bv\b", n) is not None),
        ])
        u2d1, l2d1 = pick(items, [
            lambda r,n,h: ("1o dia" in n and "respost" not in n and "abord" not in n and ("prova" in n or n == "1o dia")),
        ])
        u2d2, l2d2 = pick(items, [
            lambda r,n,h: ("2o dia" in n and "respost" not in n and "abord" not in n and ("prova" in n or n == "2o dia")),
        ])
        found = [
            (u1, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_1a_fase.pdf"),
            (u2d1, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_2a_fase_1o_dia.pdf"),
            (u2d2, ROOT/"FUVEST"/str(year)/f"FUVEST_{year}_2a_fase_2o_dia.pdf"),
        ]
        for url, dest in found:
            if not url:
                raise RuntimeError(f"Link não encontrado em {page}: {dest.name}")
            download_pdf(url, dest)

if __name__ == "__main__":
    sync_fuvest()
