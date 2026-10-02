> As capturas completas citadas neste parecer estão no pacote local `/workspace/crivo-visual-review-2026-10-02/linguagens/`; não foram todas adicionadas ao repositório. Ver o relatório principal para evidências selecionadas e os limites de cobertura.

# Linguagens — revisão visual de 92 capítulos, 02/10/2026

92 capítulos inspecionados em desktop e celular nas quatro folhas `sheets/01.jpg` a `04.jpg`, com ampliação individual dos casos centrais. Fontes comparadas: conteúdo atual de `../catalog.json`, resolução de representação, registros de instrumentos, cenas e experimentos. Resultado: **60 ajustar, 32 redesenhar, 0 manter, 0 não verificado**. Nenhum resultado constitui aprovação editorial. Não houve edição no aplicativo.

| Matéria | Capítulos | Ajustar | Redesenhar |
|---|---:|---:|---:|
| Gramática | 26 | 25 | 1 |
| Língua Inglesa | 17 | 11 | 6 |
| Literatura | 37 | 12 | 25 |
| Entendimento de Texto | 12 | 12 | 0 |

## Casos confirmados e implicações

- **Hurricanes e Stem Cells:** a cena abre com “The quake may disrupt services” e “Aftershocks might occur”. O domínio permanece terremoto, embora o título seja furacões ou células-tronco. A escala de modalização é válida como estratégia, mas o objeto precisa ser adaptado ao capítulo. Fontes: `EnglishInstrument.tsx:44` e `registry.ts:427–437`; capturas dos respectivos IDs.
- **Global Warming e Health – Probiotics:** “poor sleep observed” e “memory problems” são a mesma relação do capítulo Human Brain. Correlação/causalidade é estratégia útil, mas usar o exemplo de outro tema como objeto central viola a representação fiel. Fonte: `EnglishInstrument.tsx:69` e roteamento em `registry.ts:429,436`.
- **Digital Technology:** exibe “A pathogen is an organism that causes disease”, reutilizando lexical-inference de Bacteria. A fonte de conteúdo trata tese, benefícios, riscos e condições de uso de ferramentas digitais. Fontes: `englishInstrumentLab.ts:121`, `registry.ts:435` e seção “Tese e recorte” no catálogo.
- **Taxonomy and Terminology:** o experimento é inferência de ônibus atrasado e chegada de Maya à reunião. Não há classificação, hierarquia ou definição taxonômica, e o conteúdo atual oferece esses mecanismos. Fontes: `TopicExperiment.tsx:209`, `topic-experiments/catalog.ts:11` e catálogo.
- **Funções Sintáticas Nominais e Vocativo:** os estados ensinam sujeito/objeto direto/vocativo. O capítulo atual distingue adjunto adnominal, complemento nominal, aposto e vocativo. O exemplo “O aluno estudou → sujeito → pratica a ação” foi ampliado individualmente. Fonte: `GrammarInstrument.tsx:92`; seção “Adjuntos e complementos nominais” no catálogo.
- **Literatura, 25 instrumentos:** cartões de facetas ou fichas Trajetória/Técnica/Obras com emblemas e legendas indicam assuntos, mas não demonstram no objeto literário os procedimentos descritos. Em Clarice, olho/sintaxe interrompida/estrela não mostra uma passagem do detalhe banal à revelação; em Machado, livro com 1881/balão interrogativo/sorriso não torna perceptível a operação do narrador não confiável. Fontes: `LiteraryTraitInstrument.tsx:37`, `LiteraryAuthorInstrument.tsx:62`, labs de autores/traços e seções correspondentes no catálogo. Capturas individualmente ampliadas de Clarice e Poesia Concreta e folhas com todos os 37 capítulos.

## Distinções que evitam condenação automática

Gramática mostra relações concretas legítimas: sintagma nominal com núcleo e modificadores, fusão da preposição e artigo na crase, referência Marina/ela, alteração de aspecto verbal, recorte do grupo pela vírgula e duas leituras do telescópio. O compartilhamento de caixas/setas não prova, por si, irrelevância. As frases e estados próprios em `GrammarInstrument.tsx` sustentam os mecanismos. Esses capítulos recebem ajuste da composição editorial, preservando a operação. A formulação “abstrato → só existe na ideia” merece também revisão conceitual; observação proveniente da fonte, sem alegar captura do estado alternativo.

Em Literatura, **Elementos da Narrativa**, **Naturalismo** e **Poesia Concreta** mostram respectivamente curva de clímax, triângulo meio/raça/momento e disposição espacial da palavra; recebem ajustar, assim como as oito cenas e o experimento literário. A seleção e coexistência de tipos podem representar uma relação específica, embora a densidade e autoria visual ainda precisem se aproximar das referências.

Os onze instrumentos de leitura desenham objetos e operações distintos: localizar pistas, relação entre dois textos, notícia versus opinião, narrador dentro/fora da cena, destaque e corte de imagem, circuito comunicativo, ritmo, metáfora, projeção sem evidência, tirinha e ferramenta com contexto social. O experimento de coesão transforma a relação por conectivo. Recebem ajustar. Em **TDIC**, uso/acesso/trabalho/poder ficam quase invisíveis no estado inicial claro; confirmado na imagem individual. Não foi afirmada falha numérica de contraste WCAG.

A distância editorial comum é sustentada pela inspeção das cinco referências aprovadas (`references.jpg`) e pelo contrato `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`: as capturas centrais atuais predominam em contornos simples, diagramas esparsos e tipografia uniforme, com pouca anotação autoral integrada. Isso sustenta ajuste visual, sem confundir o uso pertinente de uma frase ou diagrama com paisagem genérica.

## Verificação e limites

O harness concluiu **92/92, 552 configurações** (390/768/1440 × claro/escuro), com **184 capturas claras**, três modos por capítulo, zero falhas, zero erros de página/console e nenhum flag de overflow, texto SVG cortado/colidido ou imagem quebrada. Esses flags automatizados são auxílio, não prova integral de qualidade. Todas as 184 capturas foram vistas em folhas; casos decisivos também individualmente.

O primeiro botão visível foi acionado, mas o texto mudou em apenas **1/92**: frequentemente a opção já está ativa ou a ação seleciona um conceito. Isso não comprova sliders, estados alternativos, diagnóstico ou integração ao Caderno; também não demonstra que estejam quebrados. A inspeção visual corresponde às capturas centrais em tema claro, fundo caderno, efeitos mínimos e movimento reduzido. Tema escuro/tablet tiveram medidas, sem inspeção visual completa de capturas. Não foram cobertos todos os fundos, níveis de movimento, drag/drop, teclado nem página inteira; a barra móvel que entra em algumas capturas não foi tratada como bug de oclusão.

`capitulos.json` contém os 92 IDs, fonte e evidências por capítulo, veredicto, severidade e limites. `browser.json` é a evidência bruta da execução atual; nenhuma conclusão foi copiada de auditoria histórica.
