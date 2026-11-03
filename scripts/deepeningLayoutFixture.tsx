import { renderToStaticMarkup } from 'react-dom/server';
import AiTextRenderer from '../src/components/AiTextRenderer';
import { createStrategyPrintRoot } from '../src/lib/printStrategyGuide';
import { printStyles } from '../src/lib/printStyles';

/** Synthetic geometry source: no account, private material or generation call. */
export function deepeningLayoutFixture() {
  const article = document.createElement('article');
  Object.assign(article.dataset, {
    printSubject: 'Matemática', printTopic: 'Geometria Plana',
    printSubtopic: 'Ângulos na circunferência · Área do círculo',
    printBoard: 'FUVEST', printPurpose: 'Aprofundamento dos conceitos e de como são cobrados nas provas',
  });
  article.innerHTML = renderToStaticMarkup(<AiTextRenderer text={String.raw`
## Ângulos e unidades

Os ângulos internos de um triângulo somam um ângulo raso. Antes de substituir valores, confira se todos os ângulos estão expressos na mesma unidade. A relação abaixo usa graus e não depende do tamanho dos lados.

$$\alpha + \beta + \gamma = 180^\circ$$

Um ângulo inscrito mede metade do ângulo central que determina o mesmo arco. Compare os arcos antes de aplicar essa relação; dois ângulos que parecem próximos podem determinar arcos diferentes.

$$\beta = \frac{\theta}{2}$$

## Relações métricas

Em um triângulo retângulo, a hipotenusa é o lado oposto ao ângulo reto. O cateto oposto depende do ângulo de referência escolhido. Ao trocar esse ângulo pelo complementar, os papéis dos catetos se invertem.

$$\sin\theta = \frac{\text{cateto oposto}}{\text{hipotenusa}}$$

| Elemento | Identificação | Verificação |
| --- | --- | --- |
| Hipotenusa | Oposta ao ângulo reto | É o maior lado |
| Cateto oposto | Não toca o ângulo de referência | Muda quando muda a referência |
| Cateto adjacente | Toca o ângulo de referência | Não é a hipotenusa |

## Área de setores

A área de um setor é proporcional ao ângulo central. Quando o ângulo está em radianos, a expressão é a seguinte. O resultado tem unidade de área, pois o raio aparece elevado ao quadrado.

$$A_{\text{setor}} = \frac{R^2\theta}{2}$$

Para usar graus, converta o ângulo antes de substituí-lo. Uma volta completa corresponde a dois pi radianos, e cento e vinte graus correspondem a um terço de volta.

$$\theta = 120^\circ = \frac{2\pi}{3}$$

## Exemplo resolvido

Uma região pode ser obtida subtraindo a área de um triângulo da área de um setor. Desenhe as duas parcelas separadamente para verificar a operação. Preserve os valores exatos durante o cálculo e aproxime apenas se o enunciado pedir.

$$A = 12\pi - 9\sqrt{3}$$

1. Identifique o setor e seu ângulo central.
2. Calcule a área do triângulo no mesmo sistema de unidades.
3. Subtraia as áreas, mantendo pi e o radical na forma exata.
4. Confira se a resposta é positiva e menor que a área do setor.

## Conferência e treino

Explique por que a fórmula do setor requer radianos. Em seguida, refaça o cálculo com uma fração de volta. Os dois caminhos devem produzir o mesmo resultado, pois descrevem a mesma região.

| Ângulo | Fração da volta | Radianos | Área do setor |
| --- | --- | --- | --- |
| $30^\circ$ | $1/12$ | $\pi/6$ | $\pi R^2/12$ |
| $60^\circ$ | $1/6$ | $\pi/3$ | $\pi R^2/6$ |
| $90^\circ$ | $1/4$ | $\pi/2$ | $\pi R^2/4$ |
| $120^\circ$ | $1/3$ | $2\pi/3$ | $\pi R^2/3$ |
| $180^\circ$ | $1/2$ | $\pi$ | $\pi R^2/2$ |

## Diagrama de referência

O esquema identifica o centro, um raio e o ângulo central. Ele serve para relacionar os elementos do desenho com as expressões, sem alterar a escala de uma página inteira.
`} />);
  article.insertAdjacentHTML('beforeend', '<figure><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" role="img" aria-label="Círculo com raio e ângulo central"><g fill="none" stroke="#145a60" stroke-width="2"><circle cx="300" cy="100" r="85"/><path d="M385 100H300L342.5 26.4M325 100A25 25 0 0 0 312.5 78.4"/></g><g fill="#263c3d" font-size="18"><text x="278" y="121">O</text><text x="344" y="120">R</text><text x="330" y="84">θ</text></g></svg><figcaption>Raio e ângulo central: identifique primeiro os elementos geométricos.</figcaption></figure>');
  const root = createStrategyPrintRoot(article, 'Aprofundamento — Geometria Plana');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${printStyles}</style></head><body>${root.outerHTML}</body></html>`;
}
