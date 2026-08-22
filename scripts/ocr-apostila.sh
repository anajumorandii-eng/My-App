#!/bin/bash
# OCR de apostilas em PDF (scan de imagem, sem camada de texto) usando
# poppler-utils (pdftoppm) + tesseract com o pacote de idioma português.
# Uso: ocr-apostila.sh <pasta-com-pdfs> <arquivo-saida.txt>
set -euo pipefail

SRC_DIR="$1"
OUT_FILE="$2"
WORK_DIR=$(mktemp -d)
trap 'rm -rf "$WORK_DIR"' EXIT

: > "$OUT_FILE"

shopt -s nullglob
for pdf in "$SRC_DIR"/*.pdf; do
  base=$(basename "$pdf")
  echo "=== Processando: $base ===" >&2
  pages=$(pdfinfo "$pdf" | awk '/^Pages:/{print $2}')
  echo "$base tem $pages páginas" >&2

  echo "" >> "$OUT_FILE"
  echo "===== ARQUIVO: $base =====" >> "$OUT_FILE"

  for ((p=1; p<=pages; p++)); do
    printf -v padded "%03d" "$p"
    pdftoppm -f "$p" -l "$p" -r 200 -png "$pdf" "$WORK_DIR/page"
    img=$(ls "$WORK_DIR"/page-*.png 2>/dev/null | head -1)
    if [ -n "$img" ]; then
      echo "" >> "$OUT_FILE"
      echo "--- página $p ---" >> "$OUT_FILE"
      tesseract "$img" - -l por 2>/dev/null >> "$OUT_FILE" || true
      rm -f "$img"
    fi
    if (( p % 10 == 0 )); then
      echo "  ...$p/$pages páginas" >&2
    fi
  done
done

echo "Concluído. Saída em $OUT_FILE" >&2
