#!/usr/bin/env python3
from pathlib import Path
import time
import requests

FILES=[
("https://riep.inep.gov.br/bitstreams/7d656252-c499-42dc-93c9-ea825cce7a0e/download","provas brutas/ENEM/2022/ENEM_2022_dia_1_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/481e4c70-e485-4d0b-ac11-82746e24bc16/download","provas brutas/ENEM/2022/ENEM_2022_dia_2_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/6f6e6a08-9f0b-4365-9f52-a24c5e4ab2e7/download","provas brutas/ENEM/2023/ENEM_2023_dia_1_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/3f2f049c-3994-4c95-966c-1ab61663b668/download","provas brutas/ENEM/2023/ENEM_2023_dia_2_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/71aaf57d-a5b7-4300-bd8b-fcf2ec490570/download","provas brutas/ENEM/2024/ENEM_2024_dia_1_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/00b05856-bf94-4bfb-b209-65758a35b81b/download","provas brutas/ENEM/2024/ENEM_2024_dia_2_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/a11f89c6-3693-49f0-8164-2794b5dac372/download","provas brutas/ENEM/2025/ENEM_2025_dia_1_caderno_amarelo.pdf"),
("https://riep.inep.gov.br/bitstreams/d43be9d0-2316-42bf-9ea7-dc4475645c52/download","provas brutas/ENEM/2025/ENEM_2025_dia_2_caderno_amarelo.pdf"),
]

for url,path in FILES:
    p=Path(path)
    p.parent.mkdir(parents=True,exist_ok=True)
    last=None
    for attempt in range(1,7):
        try:
            with requests.get(url,timeout=180,headers={"User-Agent":"Mozilla/5.0"},stream=True) as r:
                r.raise_for_status()
                with p.open("wb") as out:
                    for chunk in r.iter_content(1024*1024):
                        if chunk:
                            out.write(chunk)
            if not p.read_bytes().startswith(b"%PDF"):
                raise RuntimeError(f"PDF invalido: {p}")
            print("OK",p,p.stat().st_size)
            last=None
            break
        except Exception as e:
            last=e
            if p.exists():
                p.unlink()
            print(f"Tentativa {attempt}/6 falhou para {url}: {e}")
            time.sleep(attempt*3)
    if last:
        raise last
