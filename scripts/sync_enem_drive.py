#!/usr/bin/env python3
from pathlib import Path
import gdown

FILES=[
("1l98xT79txRrJfj3-8A_ju5JauUmN3I0B","provas brutas/ENEM/2022/ENEM_2022_dia_1_caderno_azul.pdf"),
("1yQhkjrT27QhtpkwIDtC3kVfUNGO6Sp25","provas brutas/ENEM/2022/ENEM_2022_dia_2_caderno_azul.pdf"),
("12RvjLGbhmWmv1XUoWYH3jozDuX8CjxcL","provas brutas/ENEM/2023/ENEM_2023_dia_1_caderno_azul.pdf"),
("14vk1bcAasCdgbIboAS7SGU6gODz24yUk","provas brutas/ENEM/2023/ENEM_2023_dia_2_caderno_azul.pdf"),
("1Jm3kEyUd_eXir6YpO5kXcoZBGbxn09_v","provas brutas/ENEM/2024/ENEM_2024_dia_1_caderno_azul.pdf"),
("1aB1Ie6lVKrBzlr0w0Ek_3XOi0qKxXGcp","provas brutas/ENEM/2024/ENEM_2024_dia_2_caderno_azul.pdf"),
("1Fre1ZypKTCjxLXiK_TnzOuvEuW-PA9na","provas brutas/ENEM/2025/ENEM_2025_dia_1_caderno_azul.pdf"),
("1Wnx1a3pH5vyYsk5waPi6PlwCrEr72wR7","provas brutas/ENEM/2025/ENEM_2025_dia_2_caderno_amarelo.pdf"),
]
for fid,path in FILES:
    p=Path(path)
    p.parent.mkdir(parents=True,exist_ok=True)
    result=gdown.download(id=fid,output=str(p),quiet=False)
    if not result or not p.read_bytes().startswith(b"%PDF"):
        raise SystemExit(f"PDF invalido ou download falhou: {p}")
    print("OK",p,p.stat().st_size)
