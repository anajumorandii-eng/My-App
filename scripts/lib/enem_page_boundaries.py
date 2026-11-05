"""Page boundaries shared by the native ENEM extraction pipeline."""
import re
HEADER=re.compile(r"^QUEST[ÃA]O\s+(\d{1,3})\b",re.I)

def is_essay_page(lines):
    """Do not carry the preceding question into the standalone writing task."""
    texts=[line['text'] for line in lines]
    if any(HEADER.match(text) for text in texts):return False
    if any(re.fullmatch(r'Transcreva a sua Reda[çc][ãa]o para a Folha de Reda[çc][ãa]o\.',text.strip(),re.I) for text in texts):return True
    return any(re.fullmatch(r'(?:PROPOSTA DE REDA[ÇC][ÃA]O|INSTRU[ÇC][ÕO]ES PARA A REDA[ÇC][ÃA]O)',text.strip(),re.I) for text in texts)

def is_institutional_footer(text):
    return bool(re.fullmatch(r'(?:LC|CH|CN|MT)\s*[12][ºo°]?\s*dia\s*\|\s*Caderno\s*\d+\s*[-–]\s*AMARELO\s*[-–]\s*Página\s*\d+', text.strip(), re.I))
