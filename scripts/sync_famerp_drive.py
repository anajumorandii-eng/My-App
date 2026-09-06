#!/usr/bin/env python3
from pathlib import Path
import gdown
FILES=[
("1VWlLvyRAmWUj5QCNA5-g0AMXsa8rI4MQ","provas brutas/FAMERP/2023/FAMERP_2023_dia_1.pdf"),
("1SWNU2WjaCDenTto3AInQdraVc5UkJaoM","provas brutas/FAMERP/2023/FAMERP_2023_dia_2.pdf"),
("1fyTNxBOj_nsdwJ9PmpyiH3OV_rhdU4qj","provas brutas/FAMERP/2024/FAMERP_2024_dia_1.pdf"),
("1RroTSRtcAtndvSpMAwzfNHdFpSY-xJ67","provas brutas/FAMERP/2024/FAMERP_2024_dia_2.pdf"),
("1WGFedyBnck7EWXUWWuiojeM6gvn5GtQA","provas brutas/FAMERP/2025/FAMERP_2025_dia_1.pdf"),
("1WNRKeoxMf0Y8yQZnU6Wvs18bAyYZs5DB","provas brutas/FAMERP/2025/FAMERP_2025_dia_2.pdf"),
("1aL0Lxnytncr15PvoKP5es3E9n8zXoR97","provas brutas/FAMERP/2026/FAMERP_2026_dia_1.pdf"),
("1iPDf6UygGzSY6EIng1acQVnyYVCtrP-6","provas brutas/FAMERP/2026/FAMERP_2026_dia_2.pdf"),
]
for fid,path in FILES:
 p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
 gdown.download(id=fid,output=str(p),quiet=False)
 if not p.read_bytes().startswith(b"%PDF"): raise SystemExit(f"PDF invalido: {p}")
