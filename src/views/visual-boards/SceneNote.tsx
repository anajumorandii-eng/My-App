import React from 'react';

/**
 * Rótulo manuscrito com seta curva apontando para um ponto da cena.
 *
 * A referência aprovada pela Ana Júlia não rotula o desenho por fora, com
 * legenda alinhada: ela escreve em cima, à mão, e puxa uma seta até a peça que
 * o texto comenta ("ΔV < 0 → T aumenta" ligado ao pistão que desceu). Era o que
 * faltava nas pranchas autorais — a prancha manipulável já ganhou o equivalente
 * calculado em `curveFamilies.ts`.
 *
 * Fica aqui como peça única, e não copiada dentro de cada cena, porque o
 * posicionamento tem armadilha conhecida: o texto cresce para os dois lados da
 * âncora e vaza do viewBox em legenda comprida. O clamp mora neste arquivo, uma
 * vez, em vez de ser reescrito errado em vinte e seis cenas.
 */
const LARGURA = 320;
const ALTURA = 330;
/** Largura média do glifo da Kalam em 11px — o bastante para o clamp. */
const GLIFO = 4.7;

export function SceneNote({
  text, at, to, align,
}: {
  /** Curto. `sceneNotes` e legendas apertadas já custaram retrabalho. */
  text: string;
  /** Ponto da cena que a seta toca, em coordenadas do viewBox. */
  at: [number, number];
  /** Onde o texto fica, nas mesmas coordenadas. */
  to: [number, number];
  align?: 'start' | 'middle' | 'end';
}) {
  const [ax, ay] = at;
  const alinhamento = align ?? (to[0] < ax ? 'end' : to[0] > ax ? 'start' : 'middle');

  // Meia-largura ocupada à esquerda e à direita do ponto de ancoragem do texto,
  // conforme o alinhamento — é isso que decide de que lado o clamp aperta.
  const largura = text.length * GLIFO;
  const paraEsquerda = alinhamento === 'end' ? largura : alinhamento === 'middle' ? largura / 2 : 0;
  const paraDireita = alinhamento === 'start' ? largura : alinhamento === 'middle' ? largura / 2 : 0;

  const lx = Math.min(LARGURA - 4 - paraDireita, Math.max(4 + paraEsquerda, to[0]));
  const ly = Math.min(ALTURA - 6, Math.max(14, to[1]));

  // Controle da Bézier deslocado na perpendicular do segmento: sem isso a
  // "seta curva" sai reta e perde o traço de caderno.
  const cx = (ax + lx) / 2 + (ay - ly) * 0.24;
  const cy = (ay + ly) / 2 + (lx - ax) * 0.24;
  // A seta parte da borda do texto, não do meio dele.
  const partidaX = alinhamento === 'end' ? lx + 3 : alinhamento === 'start' ? lx - 3 : lx;
  const partidaY = ly < ay ? ly + 4 : ly - 10;

  return (
    <g className="vs-scene-note" aria-hidden="true">
      <path
        className="vs-scene-note-arrow"
        d={`M${partidaX.toFixed(1)} ${partidaY.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`}
      />
      <circle className="vs-scene-note-anchor" cx={ax} cy={ay} r="2.8" />
      <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={alinhamento}>{text}</text>
    </g>
  );
}

export default SceneNote;
