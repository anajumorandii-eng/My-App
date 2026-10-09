# Revisão individual dos mecanismos dos capítulos

Esta rodada começa por Matemática, segue para Física, Química e Biologia e percorre as demais matérias. O relatório registra cada capítulo separadamente, em vez de declarar qualidade pela simples existência de uma cena ou pela aplicação do mesmo estilo visual.

## Correções conceituais reproduzidas

| Capítulo | Gatilho | Antes | Agora |
| --- | --- | --- | --- |
| Estudo Analítico da Reta | B = A = (−3, −2) | Classificava o coeficiente angular como caso de reta vertical | Explica que pontos coincidentes não definem uma única reta |
| Posições Relativas entre Duas Retas | P = A = (0, −3) | Gerava a equação 0 = 0, classificava como coincidente e tentava desenhar coordenadas inválidas | Retira a segunda reta, conserva a referência e informa que a posição é indefinida |
| Números Complexos | z = 0 | Mostrava argumento 0° | Módulo continua zero; argumento é indefinido |
| Lugar Geométrico e Equação da Circunferência | P perto da borda, com distância 2,9 ou 3,1 e raio 3 | Chamava de “sobre” uma faixa de 0,12 em torno do raio | Classifica dentro/sobre/fora pelo valor real e oferece os três casos exatos |
| Posições Relativas entre uma Reta e uma Circunferência | P = (2,1; 2,1) ou (2,2; 2,2) | Chamava de tangentes retas secantes ou externas próximas | Compara distância e raio com tolerância apenas numérica e oferece a tangência exata por botão |
| Geometria Molecular | Selecionar CO₂ no modelo 3D | Desenhava uma haste por ligação | Representa O=C=O com duas ligações duplas e explica que cada dupla ocupa uma região de ligação |
| Polaridade das Ligações e das Moléculas | Selecionar CO₂ no modelo 3D | Mesma simplificação visual sem explicação da multiplicidade | Corrige as hastes sem alterar geometria linear, ângulo ou polaridade |
| Ácidos Nucleicos | Abrir a dupla-hélice 3D | A transformação para eixo vertical espelhava a quiralidade; não havia extremidades identificadas | DNA-B destrogiro e extremidades 3′/5′ opostas, coerentes com o sentido da fita molde |

O texto de posições relativas também distingue determinante nulo de paralelismo: é necessário separar retas coincidentes de paralelas distintas. Nesta cena específica, A está fora da reta fixa, portanto uma segunda reta definida por A e P não pode coincidir com ela.

O modelo de DNA usa agora uma geometria pura, testada contra diâmetro, passo e sentido do giro. Girar a vista preserva a quiralidade, o par destacado e sua leitura. As linhas paralelas entre átomos/bases se afastam na direção perpendicular à ligação projetada, mantendo a separação ao girar.

As duas cenas de circunferência têm três escolhas operáveis por teclado. A tangência usa x = y = 3/√2; o texto informa que as coordenadas mostradas são arredondadas, para que o arredondamento não seja confundido com a construção exata.

## Critérios de revisão funcional

Para cada ID, a navegação confere o artefato específico, abre a representação no computador e no celular, varia controles deslizantes pelo teclado até os extremos, verifica a mudança na representação ou nas leituras e experimenta opções de seleção visíveis. A ausência de rolagem horizontal é reavaliada após as alterações. Os valores iniciais são restaurados entre controles. O relatório guarda o nome e os valores de cada controle exercitado; telas sem controles deslizantes continuam explicitamente identificáveis.

A alteração detectada inclui as leituras e a descrição acessível do desenho; ela não é, sozinha, prova de que a geometria ou o raciocínio estão corretos. Listas de opções foram amostradas até 14 escolhas inicialmente não selecionadas por capítulo. Opções dependentes que só surgem após outras escolhas não são exaustivamente combinadas. Isso evita transformar uma varredura técnica em aprovação pedagógica automática.

Um achado foi revisado e preservado: **Equação Fundamental da Ondulatória** volta ao mesmo desenho nos instantes 0 e 1 período. Essa equivalência é correta. Um teste adicional com ¼ de período confirma que a onda responde ao controle intermediário.

Os oito capítulos corrigidos recebem ainda revisão em 1440, 834 e 360 px, temas claro e escuro, movimento normal/reduzido, modo foco, ausência de coordenadas inválidas e acessibilidade automatizada. A revisão conceitual pontual está documentada em [casos-matematicos.json](casos-matematicos.json); as capturas mostram os gatilhos corrigidos.

## Limites e continuidade

Esta entrega não reescreve 613 capítulos, não adiciona 613 simulações novas e não certifica pedagogicamente cada texto. A revisão funcional por capítulo e as oito correções conceituais são registradas separadamente. O inventário de aprovação formal e a fila editorial existente permanecem com seus próprios critérios; não recebem aprovações por contagem ou teste automatizado.

Os próximos aprofundamentos conceituais devem partir de casos específicos de cada capítulo e de evidências de uso, preservando os mecanismos corretos. As pendências editoriais históricas de Redação e Atualidades continuam rastreadas na fila original; esta rodada de controles não as encerra.

## Resultado da varredura

**613 capítulos, 1.226 verificações em 1440/360 px e 2.165 controles/opções exercitados**, com zero falhas finais de interação. O [registro JSON](registro-613-capitulos.json) guarda cada capítulo e seu resultado nas duas larguras; o [índice CSV](indice-capitulos.csv) facilita filtrar por matéria. As duas equivalências periódicas (uma por largura) foram revisadas e preservadas, não tratadas como defeitos.

Os oito capítulos corrigidos passaram em 48 estados de largura/tema e 16 checagens automatizadas de acessibilidade, sem violações. O acompanhamento confirmou ausência de erros de execução/console e de recursos essenciais com falha nos casos corrigidos. Ver [relatório dos casos específicos](verificacao-casos-corrigidos.json).

## Verificação do projeto

`npm run lint`, `npm run build` e `npm test` passaram na versão final. A suíte completa reuniu 943 testes de modelos/servidor e 1.402 testes de interface (183 arquivos): 2.345 testes aprovados. As verificações de navegador foram concluídas antes da suíte completa. A comparação d/r usa a mesma classificação numérica da tangência, evitando contradição por ponto flutuante.

## Capturas dos casos corrigidos

- [co2-summary-quimica-geometria-molecular-celular-escuro](capturas/co2-summary-quimica-geometria-molecular-celular-escuro.png)
- [co2-summary-quimica-geometria-molecular](capturas/co2-summary-quimica-geometria-molecular.png)
- [co2-summary-quimica-polaridade-das-ligacoes-e-das-moleculas-celular-escuro](capturas/co2-summary-quimica-polaridade-das-ligacoes-e-das-moleculas-celular-escuro.png)
- [co2-summary-quimica-polaridade-das-ligacoes-e-das-moleculas](capturas/co2-summary-quimica-polaridade-das-ligacoes-e-das-moleculas.png)
- [dna-summary-biologia-acidos-nucleicos-celular-escuro](capturas/dna-summary-biologia-acidos-nucleicos-celular-escuro.png)
- [dna-summary-biologia-acidos-nucleicos](capturas/dna-summary-biologia-acidos-nucleicos.png)
- [duas-summary-matematica-posicoes-relativas-entre-duas-retas-celular-escuro](capturas/duas-summary-matematica-posicoes-relativas-entre-duas-retas-celular-escuro.png)
- [duas-summary-matematica-posicoes-relativas-entre-duas-retas](capturas/duas-summary-matematica-posicoes-relativas-entre-duas-retas.png)
- [reta-summary-matematica-estudo-analitico-da-reta-celular-escuro](capturas/reta-summary-matematica-estudo-analitico-da-reta-celular-escuro.png)
- [reta-summary-matematica-estudo-analitico-da-reta](capturas/reta-summary-matematica-estudo-analitico-da-reta.png)
- [zero-summary-matematica-numeros-complexos-celular-escuro](capturas/zero-summary-matematica-numeros-complexos-celular-escuro.png)
- [zero-summary-matematica-numeros-complexos](capturas/zero-summary-matematica-numeros-complexos.png)
- [circulo-summary-matematica-lugar-geometrico-e-equacao-da-circunferencia-celular-escuro](capturas/circulo-summary-matematica-lugar-geometrico-e-equacao-da-circunferencia-celular-escuro.png)
- [circulo-summary-matematica-lugar-geometrico-e-equacao-da-circunferencia](capturas/circulo-summary-matematica-lugar-geometrico-e-equacao-da-circunferencia.png)
- [circulo-summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia-celular-escuro](capturas/circulo-summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia-celular-escuro.png)
- [circulo-summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia](capturas/circulo-summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia.png)
