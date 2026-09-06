#!/usr/bin/env python3
from pathlib import Path
import gdown
FILES=[
("1vkn3Vy_StnanSXBvzrJBwqEW1oCngvDz","provas brutas/UNESP/2023/UNESP_2023_1a_fase.pdf"),
("1RdpAapOUsxNOwEs1TgnelKk7FqDFI3wD","provas brutas/UNESP/2023/UNESP_2023_2a_fase.pdf"),
("1uuAl2xOg-Fk7Al7lbpTUn_5ULe9T_igm","provas brutas/UNESP/2024/UNESP_2024_1a_fase.pdf"),
("1PDq0K9oFaclfG4cyfQaUxtnuQtwhXLFt","provas brutas/UNESP/2024/UNESP_2024_2a_fase.pdf"),
("1N9f3uPxcSW0WH71wqJLZoT6-pJ8jVYi3","provas brutas/UNESP/2025/UNESP_2025_1a_fase.pdf"),
("1NNC4RpRamPVupoFCjP_iSlSkxT27PAuo","provas brutas/UNESP/2025/UNESP_2025_2a_fase_dia_1.pdf"),
("1_IBiPIybMvWXrl6B6p-S91bXvGyXcM0x","provas brutas/UNESP/2025/UNESP_2025_2a_fase_dia_2.pdf"),
("15ePcOTrz9yCXb6OKF7cZ-8kfjMQNlpzR","provas brutas/UNESP/2026/UNESP_2026_1a_fase.pdf"),
("1GUcTG9SwVMPQfutjauG3zJA-0VZxVstf","provas brutas/UNESP/2026/UNESP_2026_2a_fase_dia_1.pdf"),
("1rEMezItCYl0dHkozkAFq8Ayz9kOY-26D","provas brutas/UNESP/2026/UNESP_2026_2a_fase_dia_2.pdf"),
]
for fid,path in FILES:
 p=Path(path); p.parent.mkdir(parents=True,exist_ok=True)
 gdown.download(id=fid,output=str(p),quiet=False)
 if not p.read_bytes().startswith(b"%PDF"): raise SystemExit(f"PDF invalido: {p}")
