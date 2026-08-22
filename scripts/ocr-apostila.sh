#!/bin/bash
# OCR de apostilas em PDF (scan de imagem, sem camada de texto) usando
# poppler-utils (pdftoppm) + tesseract com o pacote de idioma português.
# Processa páginas em paralelo (xargs -P) — rodar mais de uma matéria ao
# mesmo tempo derruba o desempenho por concorrência de CPU, então processe
# uma matéria de cada vez.
# Uso: ocr-apostila.sh <pasta-com-pdfs> <arquivo-saida.txt> [paralelismo]
set -euo pipefail

SRC_DIR="$1"
OUT_FILE="$2"
JOBS="${3:-4}"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

# Sem isso, cada processo tesseract tenta usar várias threads (OpenMP) e N
# processos em paralelo saturam a CPU (N x threads-por-processo), o que na
# prática travava o lote inteiro por minutos por página em vez de ~2s.
export OMP_THREAD_LIMIT=1

: > "$OUT_FILE"

ocr_one_page() {
  local pdf="$1" page="$2" work="$3"
  local img="$work/p${page}.png"
  timeout 25 pdftoppm -f "$page" -l "$page" -r 150 -png -singlefile "$pdf" "$work/p${page}"
  if [ -f "$img" ]; then
    # Páginas de capa/divisórias com muita imagem podem travar o tesseract
    # por minutos (análise de layout patológica) — timeout descarta a
    # página em vez de travar o lote inteiro; capas não têm conteúdo de
    # teoria relevante mesmo.
    timeout 20 tesseract "$img" - -l por --psm 6 2>/dev/null || echo "[OCR timeout/erro nesta página]"
    rm -f "$img"
  else
    echo "[falha ao renderizar página]"
  fi
}
export -f ocr_one_page

shopt -s nullglob
for pdf in "$SRC_DIR"/*.pdf; do
  base=$(basename "$pdf")
  echo "=== Processando: $base ===" >&2
  pages=$(pdfinfo "$pdf" | awk '/^Pages:/{print $2}')
  echo "$base tem $pages páginas (paralelismo=$JOBS)" >&2

  {
    echo ""
    echo "===== ARQUIVO: $base ====="
  } >> "$OUT_FILE"

  vol_work=$(mktemp -d "$WORK_DIR/vol.XXXX")
  seq 1 "$pages" | xargs -P "$JOBS" -I{} bash -c '
    ocr_one_page "$1" "$2" "$3" > "$3/out_$(printf "%05d" "$2").txt"
  ' _ "$pdf" {} "$vol_work"

  for f in "$vol_work"/out_*.txt; do
    n=$(basename "$f" .txt | sed 's/out_0*//')
    echo "" >> "$OUT_FILE"
    echo "--- página $n ---" >> "$OUT_FILE"
    cat "$f" >> "$OUT_FILE"
  done
  rm -rf "$vol_work"
  echo "  ...concluído: $base" >&2
done

echo "Concluído. Saída em $OUT_FILE" >&2
