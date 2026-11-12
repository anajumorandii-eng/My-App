/**
 * A física da cena de Lenz, separada do desenho para rodar em teste sem canvas.
 *
 * O eixo x é o eixo comum do ímã e da espira; o ímã tem o polo norte voltado
 * para a espira (lado +x). Tudo aqui é qualitativo: o que a cena precisa
 * acertar é o SINAL — se o fluxo cresce ou cai, e para que lado a corrente
 * gira —, porque é isso que a lei de Lenz afirma e é isso que cai em prova.
 */
export const COIL_X = 44;
/** Metade do comprimento do ímã. */
export const HALF = 35;
/** Posição do centro do ímã longe e perto da espira. */
export const FAR = -150, NEAR = -52;
/** Duração de uma passada de aproximação ou afastamento, em segundos. */
export const PASS = 4.2;
/** Período do vaivém do cenário "em movimento" da última etapa. */
export const SWING = 5;

export type Motion = 'longe' | 'aproximando' | 'afastando' | 'vaivem' | 'parado';

/** O que o ímã faz em cada etapa. Na última, `moving` escolhe o cenário. */
export function motionFor(phase: number, moving: boolean): Motion {
  if (phase === 0) return 'longe';
  if (phase === 1 || phase === 2) return 'aproximando';
  if (phase === 3) return 'afastando';
  return moving ? 'vaivem' : 'parado';
}

/**
 * Posição e velocidade do ímã no tempo `t`.
 *
 * Aproximar e afastar são passadas em velocidade constante que se repetem: ao
 * fim de cada uma a cena some e volta ao começo (`alpha`), em vez de parar na
 * ponta. Parar ali seria mostrar um ímã imóvel com corrente desenhada, que é
 * exatamente o erro que a última etapa existe para desfazer.
 */
export function magnetAt(motion: Motion, t: number): { x: number; v: number; alpha: number } {
  if (motion === 'longe') return { x: FAR, v: 0, alpha: 1 };
  if (motion === 'parado') return { x: NEAR, v: 0, alpha: 1 };
  if (motion === 'vaivem') {
    const w = 2 * Math.PI / SWING, mid = (FAR + NEAR) / 2, amp = (NEAR - FAR) / 2;
    return { x: mid + amp * Math.sin(w * t), v: amp * w * Math.cos(w * t), alpha: 1 };
  }
  const u = ((t % PASS) + PASS) % PASS / PASS, span = NEAR - FAR;
  const alpha = Math.min(1, u / .08, (1 - u) / .12);
  return motion === 'aproximando'
    ? { x: FAR + span * u, v: span / PASS, alpha }
    : { x: NEAR - span * u, v: -span / PASS, alpha };
}

/** Quadro representativo de cada movimento, para pausa e movimento reduzido. */
export function stillMagnet(motion: Motion): { x: number; v: number; alpha: number } {
  if (motion === 'vaivem') return magnetAt(motion, 0);
  if (motion === 'aproximando' || motion === 'afastando') return { ...magnetAt(motion, PASS * .55), alpha: 1 };
  return magnetAt(motion, 0);
}

/** Fluxo do campo do ímã pela espira, de 0 a 1: cresce quando o polo norte chega perto. */
export function flux(x: number): number {
  const distance = Math.max(0, COIL_X - (x + HALF));
  return 1 / Math.pow(1 + (distance / 60) ** 2, 1.5);
}

/**
 * Corrente induzida, com sinal, entre −1 e 1.
 *
 * Positiva = anti-horária para quem olha do lado do ímã: é o sentido em que o
 * campo da própria espira aponta de volta para o ímã, contra o aumento do
 * fluxo. Sai de −dΦ/dt: como o fluxo só depende da posição, dΦ/dt = v·dΦ/dx,
 * e dΦ/dx é sempre positivo, então o sinal da corrente é o da velocidade.
 * Ímã parado dá zero por mais intenso que seja o fluxo.
 */
export function inducedCurrent(x: number, v: number): number {
  const slope = (flux(x + 1) - flux(x - 1)) / 2;
  return Math.max(-1, Math.min(1, v * slope * 4.2));
}

/** Para onde aponta o campo criado pela corrente induzida, no eixo: −1 é de volta para o ímã. */
export const inducedFieldDirection = (current: number): -1 | 0 | 1 => current > .02 ? -1 : current < -.02 ? 1 : 0;

/** A face da espira voltada para o ímã vira qual polo: norte repele o norte que chega; sul atrai o que sai. */
export const facingPole = (current: number): 'N' | 'S' | null => current > .02 ? 'N' : current < -.02 ? 'S' : null;
