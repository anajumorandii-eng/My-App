# Continuidade da inspeção visual

Pedido vigente: conferir os 613 capítulos e corrigir o que não acompanha o visual aprovado; usar objetos com estética 3D próprios do conteúdo. A direção mantém papel quente, fundo escuro de estudo, tipografia editorial e interações úteis.

Branch desta entrega: `redesign/inspecao-visual-613`. Base: `ac108c60`, com Geografia e História já integradas pela PR #288. Nunca reaplicar o trabalho da PR #288.

## Fontes e localização

- `src/views/visual-boards/chapterIconModels.json`: associação explícita dos 613 IDs ao objeto, contexto e título.
- `src/views/visual-boards/chapterIconGeometry.ts`: desenhos originais dos objetos.
- `src/views/visual-boards/ChapterObjectIcon.tsx`: materiais, sombra e renderização. O ícone é decorativo; o cartão ou botão é o elemento interativo.
- `src/views/ChapterSceneFrame.css`: moldura, hierarquia, altura dos controles e foco.
- `src/views/VisualArtifact.tsx` + `HumanitiesConcepts.tsx`: percurso acessível em todas as matérias.
- Famílias de Biologia e Química: destaque de seleção sem apagar as partes que precisam ser comparadas.
- Esta pasta: inventário, resultados individuais, capturas e galeria.

## Como reproduzir

1. Audite `origin/main`, as PRs abertas e a branch desta entrega. Preserve alterações locais. Não faça merge automático.
2. Instale dependências se necessário e execute `npm run dev`. O navegador instalado é `/usr/bin/chromium`.
3. Na raiz do checkout, execute `node docs/inspecao-visual-613-2026-10-09/capturar.cjs depois`. Capturas e métricas vão para `work/inspecao-613`; não publique essa pasta inteira. `CRIVO_VISUAL_URL` e `CRIVO_VISUAL_AUDIT_DIR` permitem mudar o servidor e a saída.
4. Confira a associação de todos os IDs e as folhas de contato. Amplie uma captura quando houver dúvida de leitura, forma ou corte. A captura espera a representação nativa e as fontes, em vez de aceitar o SVG do ícone como indicação de cena carregada.
5. Execute `node docs/inspecao-visual-613-2026-10-09/verificar-tablet.cjs` para verificar a seleção de conceitos por teclado nos 613 capítulos. Use uma pasta de saída nova quando o código mudar; o script reaproveita verificações que passaram se já houver `tablet-result.json`. Confira também os três modos, Escape e os controles nativos. Seleção não é evidência de domínio.
6. Rode `npm run lint`, `npm test` e `npm run build`. Faça a suíte completa quando as capturas em massa terminarem: carga concorrente do navegador pode causar timeouts dos testes de catálogo.
7. Antes de cada push, lint limpo e suíte completa verde. Envie a branch e abra ou atualize a PR. Se a implementação estiver incompleta, mantenha a PR em rascunho e registre exatamente o que falta.

Não mude chaves de progresso do localStorage, dados pessoais, avaliações ou estados de aprovação pedagógica. Não publique apostilas nem dados reais da estudante. Os arquivos desta entrega usam somente o catálogo público e estados locais sintéticos para inspeção.

## Próxima decisão

Após a verificação final e a revisão da PR, a integração depende da decisão da responsável pelo repositório. A publicação no site deve ser confirmada pelo fluxo de implantação do projeto e por uma inspeção da versão publicada.
