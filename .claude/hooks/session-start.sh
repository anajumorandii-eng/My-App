#!/bin/bash
# Instala as dependencias antes da sessao comecar.
#
# Sem isto, uma sessao no Claude Code na web abre com node_modules/ ausente, e
# os dois comandos que o CLAUDE.md exige antes de todo push falham de um jeito
# que engana: `npm run lint` morre com MODULE_NOT_FOUND em vez de erro de tipo,
# e `npm test` para em "tsx: not found" sem rodar um teste sequer. Quem le a
# saida de relance conclui que passou.
set -euo pipefail

# So no ambiente remoto: na maquina da Ana Julia o node_modules ja existe e
# reinstalar a cada sessao custa minutos por nada.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# npm install, e nao o npm ci do CI: o container guarda seu estado depois que o
# hook termina, entao uma arvore ja instalada e reaproveitada em vez de apagada
# e baixada de novo. O lockfile continua sendo respeitado.
npm install --no-audit --no-fund

# O Chromium do Playwright ja vem na imagem; baixar de novo estoura a cota de
# disco da sessao. Ver CLAUDE.md.
echo 'export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1' >> "${CLAUDE_ENV_FILE:-/dev/null}"
