#!/bin/bash
# Processa uma fila de matérias em sequência (nunca em paralelo entre si —
# cada uma já usa paralelismo interno de páginas, e rodar duas ao mesmo
# tempo satura a CPU). Espera qualquer ocr-apostila.sh já em execução
# terminar antes de começar a primeira da fila.
set -uo pipefail

STAGE=/tmp/apostilas-stage
OUT_DIR=/home/user/My-App/materiais-extraidos
SCRIPT=/home/user/My-App/scripts/ocr-apostila.sh

QUEUE=(sociologia filosofia geografia historia matematica portugues biologia fisica)

echo "Aguardando OCR em andamento terminar..." >&2
while pgrep -f "ocr-apostila.sh" > /dev/null; do
  sleep 10
done

for subj in "${QUEUE[@]}"; do
  echo "" >&2
  echo "############ INICIANDO: $subj ############" >&2
  "$SCRIPT" "$STAGE/$subj" "$OUT_DIR/$subj.txt" 4
  echo "############ CONCLUÍDO: $subj ############" >&2
done

echo "Fila completa." >&2
