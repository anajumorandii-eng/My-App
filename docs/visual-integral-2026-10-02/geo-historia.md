> As capturas completas citadas neste parecer estão no pacote local `/workspace/crivo-visual-review-2026-10-02/geo-historia/`; não foram todas adicionadas ao repositório. Ver o relatório principal para evidências selecionadas e os limites de cobertura.

# Revisão visual Geografia + História — 02/10/2026

112 capítulos: 63 Geografia e 49 História. Resultado: {'manter': 108, 'ajustar': 4}. Nenhuma implementação realizada.

As 224 capturas centrais foram inspecionadas pelas sheets01–05; suspeitas foram ampliadas individualmente. O browser.json registra seis combinações por capítulo (390/768/1440 × light/dark), reduced motion, efeitos mínimos, fundo caderno e três modos. Não houve falha do harness, erro de console/runtime ou imagem quebrada. Houve overflow horizontal da página em Independência, confirmado em uma navegação limpa adicional.

`manter` significa conservar a representação central no escopo observado; não é aprovação editorial nem certificação de todos os fluxos. As capturas são do tema claro. Tema escuro e tablet têm verificações DOM, sem revisão visual dedicada.

## Achados confirmados

- **Ajustar — Independência do Brasil (alta):** em 390px, scrollWidth da página 869px, section 850px e viewport 820px. O desenho contém navegação interna planejada, mas os ancestrais se expandem; não é recorte esperado. Full screenshot e JSON DOM adicionais confirmam. Fonte IndependenceBoard.css.
- **Ajustar — Transição e bônus demográfico:** a cena autoral LaborSectors, com lavoura/indústria/serviços e trabalhadores, é fiel ao tópico Estrutura Ativa da População. Porém o título anuncia transição e bônus demográfico, que não são o mecanismo central. Fontes: `Populacao.tsx/LaborSectors`, `data/geografia.ts:339`, catálogo atual e screenshot geo-bonus-demografico. O próprio conteúdo é de Estrutura Ativa da População: a mudança deve conciliar o título e o recorte, sem inventar um mecanismo ausente do capítulo.
- **Ajustar — Dinâmica Interna da Colonização:** desenho autoral casa-grande/senzala/quilombo adequado e ressalva historiográfica correta, mas rótulos ficam perto de 6px no celular. Confirmado em screenshot390 ampliada e CSS .en-label 10px/.en-small 9.5px na SVG 460 escalada a 300px.
- **Ajustar — Mineração no Brasil Colonial:** relação um quinto/devido à Coroa é clara; placa CASA DE FUNDIÇÃO usa 6.5px e fica ilegível no celular. Confirmado em captura e CSS .mc-plate.

## Evidências de especificidade e honestidade

- Fusos: globo polar com 24 fusos, conta 360/24 e ressalva de desvios políticos, em `Cartografia.tsx/TimeZones`. Os nomes de família do catálogo não autorizam concluir que a cena é genérica: `TopicScene.tsx` roteia esses IDs para `HistoriaGeografia.tsx`, com componentes autorais nos lotes.
- Projeções: indicatrizes com propriedades diferentes e aviso de que não são mapas reais; `HistoriaGeografia.tsx/ProjectionComparison`.
- América Latina: matérias-primas, eixo de preço vulnerável e aviso de mapa/barras sem escala; zoom confirmou ausência de colisão cobre/Chile no estado inicial. `Geopolitica.tsx/LatinAmericaExports`.
- Climatologia brasileira: massas de ar e faixas aproximadas; zoom confirmou labels sem colisão no recorte inicial. `GeografiaFisica.tsx/ClimateMap`.
- Grandes Revoluções XX: cronologia1910/1917/1938/1949 ordenada, ressalva de figuras esquemáticas, sem colisão visível no estado inicial; `SeculoXX.tsx/CenturyRevolutions`.
- Revolução Francesa: cronologia e anotação radicalização sem causa única; o mecanismo preserva a ressalva multicausal. `HistoriaGeografia.tsx/FrenchRevolution`.

## Suspeitas que não viraram achados

As flags automáticas de colisão examinam opacity do próprio text, sem multiplicar opacity dos ancestrais. Por isso incluem painéis/recortes inativos, por exemplo os quatro títulos de Fusos na mesma posição. A inspeção de screenshots e o código dos grupos motion confirmam o falso positivo no recorte inicial; não se afirma revisão dos demais recortes. Africa/Lagos-Cairo-Nairóbi e Ásia/portos-ferrovias-energia são tinyText de estados inativos na captura inicial e não foram promovidos a defeito confirmado.

As cenas HG mantêm SVG 620px em viewport móvel dentro de .hg-figure com overflow-x:auto, aviso Deslize e região focusable com ArrowLeft/ArrowRight. O recorte parcial da captura móvel é navegação interna planejada. A maioria das pranchas não registra overflow da página; a exceção confirmada é Independência do Brasil (layout separado de HG). Não testado o deslocamento completo desta região em cada capítulo.

O primeiro botão já selecionado gera changedText=false em muitos capítulos; este harness não prova transição funcional pelo clique. A passagem pelos três modos foi verificada, mas não a integridade pedagógica de cada exercício.

Fontes-base: `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`, referências aprovadas desktop02/mobile01, `topic-scenes/TopicScene.tsx`, `topic-scenes/families/HistoriaGeografia.tsx`, `visual-instruments/registry.ts`, `visual-boards/registry.ts`, `topic-experiments/catalog.ts`, catálogo atual. `capitulos.json` traz evidência e fonte por ID.
