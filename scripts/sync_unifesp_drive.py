#!/usr/bin/env python3
from pathlib import Path
import gdown
FILES=[
("1tu7RIpBEvS7TeWQHxPzT60s2Q46K7YEY","provas brutas/UNIFESP/2023/UNIFESP_2023_dia_1.pdf"),
("1TnZRwIF9G4g09rFs4nzXnNxXF74kxQOc","provas brutas/UNIFESP/2023/UNIFESP_2023_dia_2.pdf"),
("1ozauBfgRfLyre0T10Bfos5KaVqvytsdY","provas brutas/UNIFESP/2024/UNIFESP_2024_dia_1.pdf"),
("1aU-byMO6DyFfGc8337m51p-H1Re_x6y4","provas brutas/UNIFESP/2024/UNIFESP_2024_dia_2_reaplicacao.pdf"),
("1phf17UcPQYctMNgbHLH-yy5jLsenNq2S","provas brutas/UNIFESP/2025/UNIFESP_2025_prova_objetiva.pdf"),
("1sguo7nYuzotAAh9v4q0ah1wHWmI3o44k","provas brutas/UNIFESP/2025/UNIFESP_2025_prova_discursiva.pdf"),
("1BOCLik1kLEJlZxWVK4T-KWGzDDApkuhD","provas brutas/UNIFESP/2026/UNIFESP_2026_prova_objetiva.pdf"),
("16jJBtFElo27LFmC-v2hUe6jXXk1rbulu","provas brutas/UNIFESP/2026/UNIFESP_2026_prova_discursiva.pdf"),
]
for fid,path in FILES:
 p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
 gdown.download(id=fid,output=str(p),quiet=False)
 if not p.read_bytes().startswith(b"%PDF"): raise SystemExit(f"PDF invalido: {p}")
