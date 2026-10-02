# Quarto lote: 11 diagramas de Geometria e Física

A estudante pediu mais correções por etapa. Este lote reúne três grupos independentes em uma única proposta, com validação conjunta, na branch `fix/diagramas-geometria-fisica`, baseada em `main` no commit `1d22bc89`, após a integração da PR #243.

## Correções

| Capítulo | Relação corrigida | Captura móvel |
| --- | --- | --- |
| Introdução à Geometria Plana | A inclinação da transversal acompanha α; os dois arcos são alternos internos iguais | [Inicial](fundamentos-inicial-390-light.png) |
| Ângulos em Triângulos | Construção pela lei dos senos mantém A variável, B=40° e C=140°−A, inclusive A obtuso | [A=115°](angulos-triangulo-maximo-390-light.png) |
| Ângulos e Circunferências | Vértice inscrito fica no arco complementar; arco maior de 180° mantém inscrito=arco/2 | [Arco de 240°](angulos-circunferencia-maximo-390-light.png) |
| Semelhança de Triângulos | Todos os lados e deslocamentos correspondentes recebem o mesmo fator k, sem limite artificial | [k=2,5](semelhanca-maximo-390-light.png) |
| Triângulo Retângulo | Altura √mn usa a mesma escala da hipotenusa; o ângulo do ápice é reto; legenda cabe no extremo | [m=21](triangulo-retangulo-maximo-390-light.png) |
| Áreas de Polígonos | Lado de 4 cm permanece constante quando n varia; raio acompanha 4/(2sen(π/n)) | [Hexágono](areas-poligonos-inicial-390-light.png) |
| Área do Círculo e de suas Partes | Raios externo e interno compartilham a mesma escala | [r=9](area-circulo-maximo-390-light.png) |
| Razões entre Áreas de Figuras Planas | Escala completa até k=3, lados na razão k e áreas k²; inicial 4/3 aparece como 1,33 | [Inicial](razoes-areas-inicial-390-light.png) |
| Áreas de Figuras Planas | Terreno de 20×15 e abertura circular usam a mesma escala, preservando a proporção | [r=7](areas-compostas-maximo-390-light.png) |
| Lançamentos de Cargas em Campo Magnético Uniforme | Projeções perpendicular/paralela distinguem reta, círculo e hélice; v tangente e F radial coerentes para q positivo | [θ=60°](carga-em-b-inicial-390-light.png) |
| Trabalho da Força de Pressão do Gás | Curva p(V) isobárica, eixos graduados e área até o eixo V; expansão, compressão e trabalho zero distintos | [Expansão](gas-work-inicial-390-light.png) |

O caso magnético representa **projeções** do movimento: θ é o ângulo espacial entre v e B. O raio normalizado acompanha senθ; não é uma simulação quantitativa de massa e campo em unidades SI. θ=0° tem força nula e trajetória paralela; θ=90° não tem componente paralela. Pontas das setas se ajustam aos vetores pequenos, incluindo θ=10°.

No gás, Vi=5 L mantém Vf entre 1 e 13 L no domínio do controle. A área geométrica fornece |W|; o sentido do processo define o sinal de W. Os demais exemplos, fórmulas e intervalos dos capítulos foram preservados. O passo 1/6 da razão de áreas já existia e não foi alterado; sua compatibilidade com 4/3 e os extremos recebeu regressão adicional.

## Verificação

- Regressões geométricas observadas falhando antes de cada correção; revisão de código sem problemas importantes após tratar o detalhe das pontas de seta.
- Suíte geral final: **1.607 testes aprovados**, 787 Node + 820 Vitest, zero falhas. O teste da ponta de F em θ=10° detectou a ultrapassagem da origem antes de o tamanho ser corrigido; a suíte final usa a correção.
- TypeScript e build de produção aprovados. Matriz de cobertura regenerada sem diferenças. O aviso de chunks grandes da build continua existente.
- `tests/e2e/crivo-geometry-physics.spec.ts`: 37 estados em dez configurações, **370 estados verificados**. Matriz de 360/390/768/1440 px × claro/escuro com movimento reduzido; celular claro e desktop escuro adicionais com movimento padrão. Os controles também foram acionados por teclado em todos os capítulos.
- Medição de ângulos, lados, raios, proporções, vetores e área a partir das coordenadas SVG efetivamente renderizadas. Contêiner e rótulos dentro da cena, fontes de pelo menos 9 px efetivos nessa matriz, ausência de overflow de página, exceções JavaScript e falhas de carregamento de JS/CSS nas aberturas verificadas.
- O teste de tablet escuro foi interrompido quando a execução simultânea do compilador e navegador atingiu o limite de memória do ambiente. O caso foi repetido isoladamente e passou; TypeScript foi concluído separadamente. Para lotes seguintes, separar o compilador do navegador.

As 33 capturas deste diretório mostram inicial nos dois temas e extremos no celular. Foram inspecionadas cenas móveis dos 11 capítulos e amostras escuras no desktop. As capturas são da build de produção local, sem login, conteúdo privado ou alterações no histórico da estudante.

## Limites e continuidade

Este lote corrige os diagramas indicados; não promove aprovação editorial dos 613 capítulos. Diagnóstico, persistência, todos os valores intermediários, leitor de tela, Safari e aparelho físico não receberam certificação integral. A interface permanece completa em estado estático e as alterações do controle explicam o mecanismo; não foram acrescentadas animações ornamentais.

Sem alteração de dependências, registry, progresso, chaves de armazenamento ou dados remotos. Os demais achados da [revisão integral](../../REVISAO-VISUAL-INTEGRAL-2026-10-02.md), como disjunção de eventos, bijeção, associações de conteúdo, cortes e acessibilidade das outras telas, continuam pendentes.
