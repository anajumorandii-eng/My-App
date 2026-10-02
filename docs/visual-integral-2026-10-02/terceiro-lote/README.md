# Terceiro lote: Sistemas de Equações e Determinantes

Correções propostas em `fix/matematica-sistemas-determinantes`, a partir da `main` em `cfd4e13e`, depois da integração da PR #242. Este lote segue o fluxo autorizado de branch e abertura automática de PR.

## Correções

**Sistemas de Equações:** a segunda reta era `y = x`, embora o sistema fosse `x + y = 10; x − y = 2`. Agora representa `y = x − 2`, com interseção marcada em `(6,4)`. A mesma escala vale para as duas retas, os eixos e o par testado pelo controle. Graduações e legenda identificam coordenadas e equações. Outros candidatos continuam sobre a primeira reta e só satisfazem ambas quando `x = 6`.

**Determinantes:** o antigo triângulo de altura fixa foi substituído pelo paralelogramo das colunas `u = (2,c)` e `v = (3,5)` da matriz `[[2,3],[c,5]]`. A área é `|10−3c|`; o sinal informa a orientação de `u` para `v`. O controle passa por incrementos de `1/3`, permitindo demonstrar `c = 10/3`: vetores colineares, área zero e matriz não invertível. A leitura desse valor usa a fração exata e uma tolerância numérica remove resíduos de arredondamento do controle nativo. Não é uma troca de fórmula ou dos exemplos do capítulo.

## Validação e capturas

Resultados finais locais: lint e build aprovados, 1.574 testes gerais aprovados (786 Node + 788 Vitest), zero falhas, oito testes de navegador aprovados. Matriz de cobertura regenerada sem mudanças. A build mantém o aviso conhecido de chunks grandes.

Sete regressões falharam antes da correção: ponto fora da segunda reta, figura incompatível com o paralelogramo e caso singular inacessível. Os nove testes dirigidos do instrumento passaram após as correções.

O teste `tests/e2e/crivo-matrix.spec.ts` usa os sliders por teclado em 360/390/768/1440 px e nos temas claro/escuro. Verifica quatro candidatos do sistema (`x = 0,5,6,10`) e cinco estados do determinante (`c = 0,3,10/3,4,5`), totalizando 72 estados. Mede as equações das retas e a área orientada a partir da geometria real do SVG, confere singularidade, limites do contêiner e exceções de página. A revisão de código não encontrou problemas importantes.

| Estado | Celular claro | Desktop escuro |
| --- | --- | --- |
| Sistema: candidato não resolve ambas | [x=5](sistemas-5-390-light.png) | [x=5](sistemas-5-1440-dark.png) |
| Sistema: solução comum | [x=6](sistemas-6-390-light.png) | [x=6](sistemas-6-1440-dark.png) |
| Determinante positivo | [c=0](determinante-0-390-light.png) | [c=0](determinante-0-1440-dark.png) |
| Determinante zero | [c=10/3](determinante-10-390-light.png) | [c=10/3](determinante-10-1440-dark.png) |
| Determinante negativo | [c=4](determinante-12-390-light.png) | [c=4](determinante-12-1440-dark.png) |

Capturas da build de produção local, sem login ou dados particulares. A verificação automática dos limites não substitui a inspeção visual de rótulos; foram examinadas capturas dos estados positivo, nulo e negativo e dos candidatos do sistema.

## Limites

Este lote trata de dois capítulos. Os demais achados da [revisão integral](../../REVISAO-VISUAL-INTEGRAL-2026-10-02.md) continuam pendentes, assim como a aprovação editorial integral. Não altera dependências, registros de qualidade, progresso, chaves de armazenamento ou dados remotos.
