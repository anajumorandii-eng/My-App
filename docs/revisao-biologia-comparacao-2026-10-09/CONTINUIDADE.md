# Continuidade

1. Leia `docs/CRIVO-CONTINUIDADE.md`, `docs/CONTINUIDADE-ESTADO.json` e o README desta pasta.
2. Confira a PR da branch `redesign/ilustracoes-comparacao` e seu estado no GitHub. As PRs #288 e #289 já estão integradas. Não reaplique seus commits.
3. Compare apenas mudanças posteriores ao `source_commit` registrado no estado. Preserve trabalho existente e estados de estudo.
4. Prioridade atual: desenhos e ícones de Biologia, depois Geografia e História. Preserve o relevo/3D, os significados de cores e a funcionalidade das interações. Respeite as exceções em que o esquema deve continuar plano para comunicar relações.
5. Use o índice individual e a galeria para revisar capítulos. Confira diagramas ampliados e controles, não só miniaturas. Testes e capturas não representam aprovação pedagógica.
6. Para reproduzir as aberturas, inicie `npm run dev` e execute `node docs/revisao-biologia-comparacao-2026-10-09/capturar.cjs`. Playwright deve estar instalado. Configure `CHROMIUM_PATH` caso use um Chromium do sistema; `CRIVO_VISUAL_BASE_URL` e `CRIVO_VISUAL_AUDIT_DIR` são opcionais. O script grava em `work/` por padrão.
7. Para repetir os estados de interação, execute `node docs/revisao-biologia-comparacao-2026-10-09/verificar-interacoes-reduced.cjs` (66 estados) e `node docs/revisao-biologia-comparacao-2026-10-09/verificar-interacoes-motion.cjs` (36 estados). Aceitam as mesmas variáveis de ambiente. Cada roteiro tem seu diretório padrão em `work/`.
8. Antes de qualquer push: `npm run lint` e `npm test` completos devem passar. Para alterações visuais, também rode `npm run build` e revise capturas em ambos os temas e tamanhos de tela. IDs SVG devem ser únicos por instância; nenhuma seta pode referenciar um marcador fixo de outra figura.
9. Salve código, evidências e estado no GitHub em branch e PR. Nunca deixe a continuidade apenas localmente. Não faça merge automático.

Limites conhecidos: em celular e tablet em retrato os painéis ficam empilhados; figuras grandes podem exigir deslocamento dentro de sua própria área. Desktop tem comparação lado a lado. O modo comparação não deve remontar a cena nem apagar entradas do usuário.
