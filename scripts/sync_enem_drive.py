#!/usr/bin/env python3
from pathlib import Path
import requests

FILES=[
("https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D1_CD1.pdf","provas brutas/ENEM/2022/ENEM_2022_dia_1_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2022_PV_impresso_D2_CD7.pdf","provas brutas/ENEM/2022/ENEM_2022_dia_2_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD1.pdf","provas brutas/ENEM/2023/ENEM_2023_dia_1_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD7.pdf","provas brutas/ENEM/2023/ENEM_2023_dia_2_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf","provas brutas/ENEM/2024/ENEM_2024_dia_1_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD7.pdf","provas brutas/ENEM/2024/ENEM_2024_dia_2_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D1_CD1.pdf","provas brutas/ENEM/2025/ENEM_2025_dia_1_caderno_azul.pdf"),
("https://download.inep.gov.br/enem/provas_e_gabaritos/2025_PV_impresso_D2_CD7.pdf","provas brutas/ENEM/2025/ENEM_2025_dia_2_caderno_azul.pdf"),
]
import time
for url,path in FILES:
 p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
 last=None
 for attempt in range(1,7):
  try:
   r=requests.get(url,timeout=180,headers={"User-Agent":"Mozilla/5.0"},stream=True)
   r.raise_for_status()
   with p.open("wb") as out:
    for chunk in r.iter_content(1024*1024):
     if chunk: out.write(chunk)
   if not p.read_bytes().startswith(b"%PDF"): raise RuntimeError(f"PDF invalido: {p}")
   last=None
   break
  except Exception as e:
   last=e
   if p.exists(): p.unlink()
   print(f"Tentativa {attempt}/6 falhou para {url}: {e}")
   time.sleep(attempt*3)
 if last: raise last
