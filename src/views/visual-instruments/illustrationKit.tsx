import React, { useId } from 'react';

/**
 * Peças de ilustração para as cenas dos instrumentos.
 *
 * A Ana Júlia olhou as pranchas de Física no iPad e resumiu: "a estética está
 * feia". Não era um defeito de conteúdo. As cenas eram traço chapado de 2 a 4
 * px sobre fundo vazio — um círculo com contorno para o planeta, um disco
 * escuro com duas bolinhas para o núcleo, uma senoide de 17 pontos que saía
 * em zigue-zague. As referências aprovadas (`referencias-aprovadas/`) pedem
 * objeto com volume, anotação à mão com seta curva e marca-texto no achado.
 *
 * Isto fica num arquivo só porque cada cena repetia à mão o mesmo gradiente,
 * a mesma seta e a mesma legenda, cada uma um pouco diferente. Os ids dos
 * gradientes saem de `useId`: duas pranchas na mesma página (o teste de
 * contrato renderiza todas) não podem disputar o mesmo `url(#…)`.
 */

export type Tom = 'acc' | 'azul' | 'ambar' | 'verde' | 'tinta';

const COR: Record<Tom, string> = {
  acc: 'var(--vs-kit-acc, var(--vs-burgundy))',
  azul: 'var(--vs-blue)',
  ambar: 'var(--vs-amber)',
  verde: 'var(--vs-green)',
  tinta: 'var(--vs-ink)',
};

export const cor = (tom: Tom) => COR[tom];

export function useKit() {
  const base = useId().replace(/:/g, '');
  return {
    /** `fill` de esfera com luz vinda do alto à esquerda. */
    esfera: (tom: Tom) => `url(#${base}-esf-${tom})`,
    metal: `url(#${base}-metal)`,
    vidro: `url(#${base}-vidro)`,
    Defs: () => <defs>
      {(Object.keys(COR) as Tom[]).map(tom =>
        <radialGradient key={tom} id={`${base}-esf-${tom}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset=".22" stopColor={COR[tom]} stopOpacity=".92" />
          <stop offset="1" stopColor={`color-mix(in srgb, ${COR[tom]} 70%, #000)`} />
        </radialGradient>)}
      <linearGradient id={`${base}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="color-mix(in srgb, var(--vs-dim) 45%, #fff)" />
        <stop offset=".45" stopColor="color-mix(in srgb, var(--vs-dim) 80%, #fff)" />
        <stop offset="1" stopColor="color-mix(in srgb, var(--vs-dim) 85%, #000)" />
      </linearGradient>
      <linearGradient id={`${base}-vidro`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--vs-blue)" stopOpacity=".05" />
        <stop offset="1" stopColor="var(--vs-blue)" stopOpacity=".22" />
      </linearGradient>
    </defs>,
  };
}

/** Sombra pousada no chão: é ela que tira o objeto do "recortado e colado". */
export const Sombra = ({ cx, cy, rx, ry = rx * 0.22 }: { cx: number; cy: number; rx: number; ry?: number }) =>
  <ellipse className="vs-kit-sombra" cx={cx} cy={cy} rx={rx} ry={ry} />;

/**
 * Marca-texto atrás de uma palavra. A borda é irregular de propósito: um
 * retângulo perfeito lê como botão, não como caneta sobre o caderno.
 */
export const Marca = ({ x, y, w, h = 15 }: { x: number; y: number; w: number; h?: number }) =>
  <path className="vs-kit-marca" d={`M${x} ${y + 2}q${w * 0.3} -3 ${w} -1l1 ${h - 2}q-${w * 0.55} 3 -${w + 2} 0z`} />;

/**
 * Anotação manuscrita com seta curva. `de` é o ponto comentado; `texto` fica
 * em `em`. A curva dobra para o lado de `curva` (+1 ou -1) — duas notas
 * vizinhas com a mesma curvatura cruzavam as setas.
 */
export function Nota({ de, em, texto, tom = 'acc', ancora, curva = 1, tam = 13 }: {
  de: [number, number];
  em: [number, number];
  texto: string | string[];
  tom?: Tom;
  ancora?: 'start' | 'middle' | 'end';
  curva?: 1 | -1;
  tam?: number;
}) {
  const [ax, ay] = de;
  const [tx, ty] = em;
  const linhas = Array.isArray(texto) ? texto : [texto];
  const alinhamento = ancora ?? (tx < ax - 8 ? 'end' : tx > ax + 8 ? 'start' : 'middle');
  const altura = linhas.length * tam * 1.05;
  // A seta sai do ponto do bloco de texto mais próximo do alvo. Sair sempre
  // da ponta do alinhamento fazia a seta dar a volta por fora do texto quando
  // o alvo ficava do outro lado.
  const largura = Math.max(...linhas.map(l => l.length)) * tam * 0.48;
  const esquerda = alinhamento === 'start' ? tx : alinhamento === 'end' ? tx - largura : tx - largura / 2;
  const sx = Math.min(esquerda + largura, Math.max(esquerda, ax));
  const sy = ay > ty ? ty + altura - tam * 0.55 : ty - tam * 0.95;
  const mx = (sx + ax) / 2 + (ay - sy) * 0.3 * curva;
  const my = (sy + ay) / 2 + (sx - ax) * 0.3 * curva;
  // Ponta desenhada à mão, alinhada com a tangente final da curva.
  const ang = Math.atan2(ay - my, ax - mx);
  const p = (d: number, a: number) => `${(ax - d * Math.cos(ang + a)).toFixed(1)} ${(ay - d * Math.sin(ang + a)).toFixed(1)}`;
  return <g className={`vs-kit-nota vs-kit-nota--${tom}`} aria-hidden="true">
    <path d={`M${sx.toFixed(1)} ${sy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ax} ${ay}`} />
    <path d={`M${p(8, 0.45)}L${ax} ${ay}L${p(8, -0.45)}`} />
    <text x={tx} y={ty} textAnchor={alinhamento} fontSize={tam}>
      {linhas.map((l, i) => <tspan key={i} x={tx} dy={i ? tam * 1.05 : 0}>{l}</tspan>)}
    </text>
  </g>;
}

/** Rótulo impresso da cena: legível no iPad escuro, sem contorno herdado. */
export const Rotulo = ({ x, y, children, tom = 'tinta', tam = 12, peso = 700, ancora = 'middle' }: {
  x: number; y: number; children: React.ReactNode; tom?: Tom | 'dim'; tam?: number; peso?: number; ancora?: 'start' | 'middle' | 'end';
}) => <text x={x} y={y} textAnchor={ancora} fontSize={tam} fontWeight={peso} fill={tom === 'dim' ? 'var(--vs-dim)' : COR[tom]} stroke="none">{children}</text>;

/** Senoide amostrada fino: com 17 pontos ligados por reta a interferência
 * saía em zigue-zague, com bico em cada crista. */
export function senoide({ x0, x1, y, amp, ciclos, fase = 0, passos = 96 }: { x0: number; x1: number; y: number; amp: number; ciclos: number; fase?: number; passos?: number }) {
  const pts = Array.from({ length: passos + 1 }, (_, i) => {
    const t = i / passos;
    return [x0 + (x1 - x0) * t, y - amp * Math.sin(t * ciclos * 2 * Math.PI + fase)] as const;
  });
  return `M${pts.map(([x, yy]) => `${x.toFixed(1)} ${yy.toFixed(1)}`).join('L')}`;
}
