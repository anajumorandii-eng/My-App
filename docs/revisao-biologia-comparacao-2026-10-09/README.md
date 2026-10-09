# Revisão de Biologia, Geografia e História — 09/10/2026

Biologia é a prioridade indicada pela usuária. Foram inspecionadas as aberturas dos **184 capítulos**: 72 de Biologia, 63 de Geografia e 49 de História. A entrega parte de `2928b786`, após a integração da PR #289. Não reaplica as PRs #288 ou #289.

## Mudanças

- Biologia: materiais com volume em 18 cenas de fenômenos e nas cinco cenas de fisiologia; coração anatômico, ramificações pulmonares e detalhes renais nos ícones. Cores que distinguem estruturas e processos continuam significativas.
- Nefron: setas e legendas explicitam reabsorção (túbulo → sangue) e secreção (sangue → túbulo).
- Geografia e História: 103 capítulos permitem ver dois recortes distintos ao mesmo tempo. Cada desenho tem identificadores SVG próprios; gradientes, setas e recortes não se confundem entre instâncias.
- Botão **Comparar painéis** compacta a apresentação sem reiniciar os controles. Em fisiologia, figura e explicação ficam lado a lado a partir de 960 px. As figuras de fenômenos biológicos ficam centralizadas e limitadas a 820 px a partir de 900 px.
- Duas pranchas de Geografia/História ficam lado a lado a partir de 960 px; abaixo disso ficam empilhadas. Figuras grandes mantêm deslocamento horizontal próprio para conservar letras legíveis. Não há promessa de mostrar dois desenhos completos simultaneamente no celular.
- Materiais dos ícones seguem o assunto: tecido, jade, metal e bronze. O registro de 613 capítulos e 152 modelos é preservado.

Não há migração de dados ou alteração das chaves de progresso. Esta revisão não promove aprovação pedagógica dos capítulos.

## Evidências

[Galeria com 24 pranchas e exemplos ampliados](GALERIA.md) · [Índice dos 184 capítulos](INDICE.md) · [Resultados das 368 aberturas](resultado-184.json).

Todas as 368 aberturas passaram pelas verificações de overflow da página, referências SVG, IDs únicos, erros de execução e saída do modo foco. As 24 pranchas foram inspecionadas visualmente. Mais 102 estados de interação foram conferidos em 360, 834 e 1366 px, nos dois temas: 66 com movimento reduzido e 36 com movimento normal. Incluem controles por teclado, foco, Escape e navegação entre etapas.

A inspeção é de aberturas e estados representativos em Chromium, não de todos os valores de controles, rolagens ou aparelhos físicos. As capturas usam preferências sintéticas, sem dados de estudantes. No celular, a captura pode mostrar apenas parte de uma figura que admite deslocamento horizontal.

Validação final: **2466 testes passaram** (943 Node e 1523 Vitest em 186 arquivos), `npm run lint` limpo e `npm run build` concluído. A regra de movimento distingue os materiais SVG estáticos das cenas animadas.

Consulte [verificação](verificacao.json) para os resultados finais de testes, lint e build, e [continuidade](CONTINUIDADE.md) para retomar o trabalho. A proposta deve ser revisada antes da integração; sem merge automático.
