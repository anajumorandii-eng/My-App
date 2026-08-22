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
JOBS="${3:-3}"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

: > "$OUT_FILE"

ocr_one_page() {
  local pdf="$1" page="$2" work="$3"
  local img="$work/p${page}.png"
  pdftoppm -f "$page" -l "$page" -r 150 -png -singlefile "$pdf" "$work/p${page}"
  tesseract "$img" - -l por --psm 6 2>/dev/null
  rm -f "$img"
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
