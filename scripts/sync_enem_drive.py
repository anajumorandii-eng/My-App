#!/usr/bin/env python3
from pathlib import Path
import gdown

FILES = [
("1n8Oxf_5ppv7zj7qPQqYPQ2S7TC7d_L6M","provas brutas/ENEM/2022/ENEM_2022_dia_1_caderno_azul.pdf"),
("1BPO35YW7Abpiy0dxtGHEuKy3CfHohDZF","provas brutas/ENEM/2022/ENEM_2022_dia_2_caderno_azul.pdf"),
("1AsxF5UK7hi6c2diWC4zHpnm_i9x7DJMK","provas brutas/ENEM/2023/ENEM_2023_dia_1_caderno_azul.pdf"),
("1ZT-f-X-tPGDlFHkow4CSUy0v-LL9jdY-","provas brutas/ENEM/2023/ENEM_2023_dia_2_caderno_azul.pdf"),
("1M5BT1wFB5qje2thfP0tLFnpGaJ6Ottem","provas brutas/ENEM/2024/ENEM_2024_dia_1_caderno_azul.pdf"),
("1PdLH4lpASfaKqzbQ2wcbS9AJ4E9Q440U","provas brutas/ENEM/2024/ENEM_2024_dia_2_caderno_azul.pdf"),
("1bXWLx6rrIOITR_VLahtkyBetHUr-exdp","provas brutas/ENEM/2025/ENEM_2025_dia_1_caderno_azul.pdf"),
("1Y4G-64LLqyM1Yz0TMoC-Idt1Xgjy5XeB","provas brutas/ENEM/2025/ENEM_2025_dia_2_caderno_azul.pdf"),
]
for fid, path in FILES:
    p=Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    gdown.download(id=fid, output=str(p), quiet=False)
    if not p.read_bytes().startswith(b"%PDF"):
        raise SystemExit(f"Arquivo inválido: {p}")
