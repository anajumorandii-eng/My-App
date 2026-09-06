from __future__ import annotations
from pathlib import Path
import requests
import gdown

ROOT = Path("provas brutas")
UA = {"User-Agent": "Mozilla/5.0 JUJU-Provas/1.0"}

DRIVE = [
    # ENEM
    ("1n8Oxf_5ppv7zj7qPQqYPQ2S7TC7d_L6M","ENEM/2022/ENEM_2022_dia_1_caderno_azul.pdf"),
    ("1BPO35YW7Abpiy0dxtGHEuKy3CfHohDZF","ENEM/2022/ENEM_2022_dia_2_caderno_azul.pdf"),
    ("1AsxF5UK7hi6c2diWC4zHpnm_i9x7DJMK","ENEM/2023/ENEM_2023_dia_1_caderno_azul.pdf"),
    ("1ZT-f-X-tPGDlFHkow4CSUy0v-LL9jdY-","ENEM/2023/ENEM_2023_dia_2_caderno_azul.pdf"),
    ("1M5BT1wFB5qje2thfP0tLFnpGaJ6Ottem","ENEM/2024/ENEM_2024_dia_1_caderno_azul.pdf"),
    ("1PdLH4lpASfaKqzbQ2wcbS9AJ4E9Q440U","ENEM/2024/ENEM_2024_dia_2_caderno_azul.pdf"),
    ("1bXWLx6rrIOITR_VLahtkyBetHUr-exdp","ENEM/2025/ENEM_2025_dia_1_caderno_azul.pdf"),
    ("1Y4G-64LLqyM1Yz0TMoC-Idt1Xgjy5XeB","ENEM/2025/ENEM_2025_dia_2_caderno_azul.pdf"),

    # FUVEST
    ("1kJWCFrkxlAuBk_-KQFGIbVLRmSc09sYf","FUVEST/2023/FUVEST_2023_1a_fase.pdf"),
    ("1G4RGvVa3lpdocG6GfBDXc5kCeycEegFZ","FUVEST/2023/FUVEST_2023_2a_fase_dia_1.pdf"),
    ("1gEvQWT8baFHMOsm2E_HnEq2Ly5f0nOXb","FUVEST/2023/FUVEST_2023_2a_fase_dia_2.pdf"),
    ("1gD4a9ZhbhBSvxU8djskK_ilZ-tvNZV4I","FUVEST/2024/FUVEST_2024_1a_fase.pdf"),
    ("1qQk0vLuE51ZqoGqjMD8YzhVulv7s_PGk","FUVEST/2024/FUVEST_2024_2a_fase_dia_1.pdf"),
    ("18hDzTuGw9qnSwrGfVPcNrkVVD-ejQFBo","FUVEST/2024/FUVEST_2024_2a_fase_dia_2.pdf"),
    ("1jYJ3C5Z7JhV5juqvt3hmSc5Pd0gvUiUg","FUVEST/2025/FUVEST_2025_1a_fase.pdf"),
    ("1VMKVbnhP-OOGrAXbhlQoK3FFZ8JOmvB2","FUVEST/2025/FUVEST_2025_2a_fase_dia_1.pdf"),
    ("1N2afc3Fqi_xzeM3CVmPtLjoGAebjDsZ3","FUVEST/2025/FUVEST_2025_2a_fase_dia_2.pdf"),
    ("16sr_Dr-z5OHbgJwD9y8qyJxr0H7-rNce","FUVEST/2026/FUVEST_2026_1a_fase.pdf"),
    ("17z4yLZ3gRyA6Eju6T4UzV2Nx8De5i5to","FUVEST/2026/FUVEST_2026_2a_fase_dia_1_portugues_redacao.pdf"),
    ("1HJcIsUZyb9JZVr9zdH2H0_0gnrDb5lLo","FUVEST/2026/FUVEST_2026_2a_fase_dia_2_especificas.pdf"),

    # UNICAMP (Drive quando presente)
    ("1KDKMFCmaVSRAvfpnbvMAdAjC4z9tikvK","UNICAMP/2023/UNICAMP_2023_1a_fase.pdf"),
    ("1st4DOEVsxGMNF76G08B1T_k1uHX0mZJs","UNICAMP/2024/UNICAMP_2024_1a_fase.pdf"),
    ("1N6sZYctqVdSq1yBPN75h4F3kXPn76MXZ","UNICAMP/2025/UNICAMP_2025_1a_fase.pdf"),
    ("1OcCcEa-XJThreKgJX-UnoKTrDPyzDDX9","UNICAMP/2025/UNICAMP_2025_2a_fase_dia_1.pdf"),
    ("1jJ0kXkQDNTTGHzLfRhTZYnAViKxu01Li","UNICAMP/2025/UNICAMP_2025_2a_fase_dia_2_biologicas_saude.pdf"),
    ("1R2tVnBPsy72S4dY0Ec8_4fKpNfbXzBav","UNICAMP/2026/UNICAMP_2026_1a_fase.pdf"),

    # UNIFESP
    ("1tu7RIpBEvS7TeWQHxPzT60s2Q46K7YEY","UNIFESP/2023/UNIFESP_2023_dia_1.pdf"),
    ("1TnZRwIF9G4g09rFs4nzXnNxXF74kxQOc","UNIFESP/2023/UNIFESP_2023_dia_2.pdf"),
    ("1ozauBfgRfLyre0T10Bfos5KaVqvytsdY","UNIFESP/2024/UNIFESP_2024_dia_1.pdf"),
    ("1aU-byMO6DyFfGc8337m51p-H1Re_x6y4","UNIFESP/2024/UNIFESP_2024_dia_2_reaplicacao.pdf"),
    ("1phf17UcPQYctMNgbHLH-yy5jLsenNq2S","UNIFESP/2025/UNIFESP_2025_prova_objetiva.pdf"),
    ("1sguo7nYuzotAAh9v4q0ah1wHWmI3o44k","UNIFESP/2025/UNIFESP_2025_prova_discursiva.pdf"),
    ("1BOCLik1kLEJlZxWVK4T-KWGzDDApkuhD","UNIFESP/2026/UNIFESP_2026_prova_objetiva.pdf"),
    ("16jJBtFElo27LFmC-v2hUe6jXXk1rbulu","UNIFESP/2026/UNIFESP_2026_prova_discursiva.pdf"),

    # FAMERP
    ("1VWlLvyRAmWUj5QCNA5-g0AMXsa8rI4MQ","FAMERP/2023/FAMERP_2023_dia_1_conhecimentos_gerais.pdf"),
    ("1SWNU2WjaCDenTto3AInQdraVc5UkJaoM","FAMERP/2023/FAMERP_2023_dia_2.pdf"),
    ("1fyTNxBOj_nsdwJ9PmpyiH3OV_rhdU4qj","FAMERP/2024/FAMERP_2024_dia_1_objetiva.pdf"),
    ("1RroTSRtcAtndvSpMAwzfNHdFpSY-xJ67","FAMERP/2024/FAMERP_2024_dia_2_discursiva.pdf"),
    ("1WGFedyBnck7EWXUWWuiojeM6gvn5GtQA","FAMERP/2025/FAMERP_2025_dia_1_objetiva.pdf"),
    ("1WNRKeoxMf0Y8yQZnU6Wvs18bAyYZs5DB","FAMERP/2025/FAMERP_2025_dia_2_discursiva.pdf"),
    ("1aL0Lxnytncr15PvoKP5es3E9n8zXoR97","FAMERP/2026/FAMERP_2026_dia_1_objetiva.pdf"),
    ("1iPDf6UygGzSY6EIng1acQVnyYVCtrP-6","FAMERP/2026/FAMERP_2026_dia_2_discursiva.pdf"),

    # UNESP
    ("1vkn3Vy_StnanSXBvzrJBwqEW1oCngvDz","UNESP/2023/UNESP_2023_1a_fase.pdf"),
    ("1RdpAapOUsxNOwEs1TgnelKk7FqDFI3wD","UNESP/2023/UNESP_2023_2a_fase.pdf"),
    ("1uuAl2xOg-Fk7Al7lbpTUn_5ULe9T_igm","UNESP/2024/UNESP_2024_1a_fase.pdf"),
    ("1PDq0K9oFaclfG4cyfQaUxtnuQtwhXLFt","UNESP/2024/UNESP_2024_2a_fase.pdf"),
    ("1N9f3uPxcSW0WH71wqJLZoT6-pJ8jVYi3","UNESP/2025/UNESP_2025_1a_fase.pdf"),
    ("1NNC4RpRamPVupoFCjP_iSlSkxT27PAuo","UNESP/2025/UNESP_2025_2a_fase_dia_1.pdf"),
    ("1_IBiPIybMvWXrl6B6p-S91bXvGyXcM0x","UNESP/2025/UNESP_2025_2a_fase_dia_2.pdf"),
    ("15ePcOTrz9yCXb6OKF7cZ-8kfjMQNlpzR","UNESP/2026/UNESP_2026_1a_fase.pdf"),
    ("1GUcTG9SwVMPQfutjauG3zJA-0VZxVstf","UNESP/2026/UNESP_2026_2a_fase_dia_1.pdf"),
    ("1rEMezItCYl0dHkozkAFq8Ayz9kOY-26D","UNESP/2026/UNESP_2026_2a_fase_dia_2.pdf"),
]

URLS = [
    ("https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2redporingcn.pdf","UNICAMP/2023/UNICAMP_2023_2a_fase_dia_1.pdf"),
    ("https://www.comvest.unicamp.br/vest2023/F2/provas/2023F2CB.pdf","UNICAMP/2023/UNICAMP_2023_2a_fase_dia_2_biologicas_saude.pdf"),
    ("https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2redporingcn.pdf","UNICAMP/2024/UNICAMP_2024_2a_fase_dia_1.pdf"),
    ("https://www.comvest.unicamp.br/vest2024/F2/provas/2024F2CB.pdf","UNICAMP/2024/UNICAMP_2024_2a_fase_dia_2_biologicas_saude.pdf"),
    ("https://www.comvest.unicamp.br/vest2026/F2/provas/2026F2redporingcn.pdf","UNICAMP/2026/UNICAMP_2026_2a_fase_dia_1.pdf"),
    ("https://www.comvest.unicamp.br/vest2026/F2/provas/2026F2CB.pdf","UNICAMP/2026/UNICAMP_2026_2a_fase_dia_2_biologicas_saude.pdf"),
]

def validate_pdf(path: Path):
    data = path.read_bytes()[:5]
    if not data.startswith(b"%PDF"):
        raise RuntimeError(f"Arquivo inválido/não-PDF: {path}")

def dl_drive(fid: str, rel: str):
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and out.stat().st_size > 1000:
        validate_pdf(out)
        print("JA EXISTE", out)
        return
    result = gdown.download(id=fid, output=str(out), quiet=False)
    if not result:
        raise RuntimeError(f"Falha no Google Drive: {fid}")
    validate_pdf(out)
    print("OK DRIVE", out, out.stat().st_size)

def dl_url(url: str, rel: str):
    out = ROOT / rel
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and out.stat().st_size > 1000:
        validate_pdf(out)
        print("JA EXISTE", out)
        return
    r = requests.get(url, headers=UA, timeout=120)
    r.raise_for_status()
    out.write_bytes(r.content)
    validate_pdf(out)
    print("OK URL", out, out.stat().st_size)

if __name__ == "__main__":
    failures = []
    for fid, rel in DRIVE:
        try:
            dl_drive(fid, rel)
        except Exception as e:
            print("ERRO", rel, e)
            failures.append(rel)
    for url, rel in URLS:
        try:
            dl_url(url, rel)
        except Exception as e:
            print("ERRO", rel, e)
            failures.append(rel)
    if failures:
        raise SystemExit("Falhas: " + ", ".join(failures))
