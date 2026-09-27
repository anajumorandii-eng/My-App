import React, { useId } from 'react';

/**
 * Peças de ilustração para as cenas dos instrumentos, no traço de caderno
 * ilustrado (sketchnote).
 *
 * Primeira rodada: a Ana Júlia olhou as pranchas de Física no iPad e resumiu
 * "a estética está feia" — traço chapado de 2 a 4 px sobre fundo vazio. O kit
 * trouxe volume, anotação à mão e marca-texto.
 *
 * Segunda rodada: ela mandou pôsteres de caderno ilustrado (astronomia,
 * eletricidade, DNA) e pediu "um pouco mais assim, mais divertido". O que
 * esses pôsteres têm e as cenas não tinham:
 * - quadros de borda colorida com etiqueta no alto ("SOLAR SYSTEM");
 * - contorno de tinta em volta de cada objeto, como desenho à mão;
 * - textura de lápis de cor no preenchimento;
 * - estrelinhas e brilhos soltos;
 * - rótulo manuscrito embaixo de cada objeto;
 * - a frase-resumo numa pílula com estrela ("★ Gravity holds worlds in orbit").
 * Cada uma dessas virou uma peça aqui.
 *
 * Os ids de gradiente, padrão e filtro saem de `useId`: duas pranchas na mesma
 * página (o teste de contrato renderiza todas) não podem disputar o mesmo
 * `url(#…)`.
 */

export type Tom = 'acc' | 'azul' | 'ambar' | 'verde' | 'tinta' | 'sol' | 'roxo' | 'laranja' | 'ciano' | 'vermelho' | 'claro';

// Os tons vivos vêm de tokens de Visual.css: o mesmo lápis precisa clarear na
// lousa, senão o roxo e o vermelho somem no fundo escuro.
const COR: Record<Tom, string> = {
  acc: 'var(--vs-kit-acc, var(--vs-burgundy))',
  azul: 'var(--vs-blue)',
  ambar: 'var(--vs-amber)',
  verde: 'var(--vs-kit-verde, var(--vs-green))',
  tinta: 'var(--vs-ink)',
  sol: 'var(--vs-kit-sol, #f2b705)',
  roxo: 'var(--vs-kit-roxo, #7b5ea7)',
  laranja: 'var(--vs-kit-laranja, #e8743b)',
  ciano: 'var(--vs-kit-ciano, #2a9db0)',
  vermelho: 'var(--vs-kit-vermelho, #d64545)',
  claro: '#f7f1e3',
};

export const cor = (tom: Tom) => COR[tom];

export function useKit() {
  const base = useId().replace(/:/g, '');
  return {
    /** `fill` de esfera com luz vinda do alto à esquerda. */
    esfera: (tom: Tom) => `url(#${base}-esf-${tom})`,
    metal: `url(#${base}-metal)`,
    ouro: `url(#${base}-ouro)`,
    /** Hachura de lápis por cima de um preenchimento. */
    lapis: `url(#${base}-lapis)`,
    pontos: `url(#${base}-pontos)`,
    /** Traço trêmulo de desenho à mão. Nunca em grupo com texto: a letra
     * deformada fica borrada, que é o defeito que acabou de ser corrigido. */
    tremido: `url(#${base}-tremido)`,
    Defs: () => <defs>
      {(Object.keys(COR) as Tom[]).map(tom =>
        <radialGradient key={tom} id={`${base}-esf-${tom}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".8" />
          <stop offset=".25" stopColor={COR[tom]} />
          <stop offset="1" stopColor={`color-mix(in srgb, ${COR[tom]} 72%, #000)`} />
        </radialGradient>)}
      <linearGradient id={`${base}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9e6df" />
        <stop offset=".5" stopColor="#b9b4aa" />
        <stop offset="1" stopColor="#7d786f" />
      </linearGradient>
      <linearGradient id={`${base}-ouro`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe7a3" />
        <stop offset=".5" stopColor="#e7b24a" />
        <stop offset="1" stopColor="#a86f1c" />
      </linearGradient>
      <pattern id={`${base}-lapis`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <path d="M0 0V5" stroke="#fff" strokeWidth="1.1" opacity=".32" />
      </pattern>
      <pattern id={`${base}-pontos`} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r=".9" className="vs-kit-ponto" />
      </pattern>
      {/* Região em coordenadas da cena: com a caixa do próprio objeto, uma
          linha reta (a soma zerada na interferência) tem altura zero e o
          filtro a apagava inteira. */}
      <filter id={`${base}-tremido`} filterUnits="userSpaceOnUse" x="0" y="0" width="320" height="300">
        <feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="2" />
      </filter>
    </defs>,
  };
}

type Kit = ReturnType<typeof useKit>;

/** Papel pontilhado do caderno, atrás de tudo. */
export const Papel = ({ kit }: { kit: Kit }) =>
  <rect x="0" y="0" width="320" height="300" fill={kit.pontos} />;

/**
 * Quadro de borda colorida com etiqueta no canto, como os blocos dos pôsteres.
 * `escuro` pinta o fundo de céu noturno (a faixa do sistema solar), que fica
 * escuro também no tema claro.
 */
export function Painel({ x, y, w, h, titulo, tom = 'roxo', escuro }: { x: number; y: number; w: number; h: number; titulo?: string; tom?: Tom; escuro?: boolean }) {
  const larguraEtiqueta = titulo ? titulo.length * 6.6 + 16 : 0;
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={escuro ? 'var(--vs-kit-ceu, #17213d)' : `color-mix(in srgb, ${COR[tom]} 7%, transparent)`} stroke={COR[tom]} strokeWidth="1.8" />
    {titulo && <g>
      <rect x={x + 10} y={y - 9} width={larguraEtiqueta} height="18" rx="9" fill="var(--vs-paper)" stroke={COR[tom]} strokeWidth="1.6" />
      <text x={x + 10 + larguraEtiqueta / 2} y={y + 4.5} textAnchor="middle" className="vs-kit-mao" fontSize="11" fill={COR[tom]} stroke="none" letterSpacing=".6">{titulo}</text>
    </g>}
  </g>;
}

/** Estrela de quatro pontas, o brilho solto dos pôsteres. */
export const Brilho = ({ x, y, r = 5, tom = 'sol' }: { x: number; y: number; r?: number; tom?: Tom }) =>
  <path d={`M${x} ${y - r}Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y}Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r}Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y}Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r}Z`} fill={COR[tom]} stroke="none" />;

/** Estrela de cinco pontas com contorno de tinta. */
export function Estrela({ x, y, r = 7, tom = 'sol' }: { x: number; y: number; r?: number; tom?: Tom }) {
  const pts = Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5; const rr = k % 2 ? r * 0.45 : r; return `${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`; });
  return <path d={`M${pts.join('L')}Z`} fill={COR[tom]} stroke="var(--vs-kit-contorno, var(--vs-ink))" strokeWidth="1" strokeLinejoin="round" />;
}

/**
 * Bola de lápis de cor: volume do gradiente, hachura por cima e contorno de
 * tinta. O contorno é o que dá cara de desenho à mão, e não de render 3D.
 */
export const Bola = ({ kit, cx, cy, r, tom }: { kit: Kit; cx: number; cy: number; r: number; tom: Tom }) => <g>
  <circle cx={cx} cy={cy} r={r} fill={kit.esfera(tom)} />
  <circle cx={cx} cy={cy} r={r} fill={kit.lapis} />
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--vs-kit-contorno, var(--vs-ink))" strokeWidth="1.3" />
</g>;

/**
 * A frase-resumo numa pílula com estrela. É onde o resultado do cursor mora:
 * no pôster é a linha que se lê primeiro.
 */
export function Pilula({ x, y, w, children, tom = 'laranja' }: { x: number; y: number; w: number; children: React.ReactNode; tom?: Tom }) {
  return <g>
    <rect x={x} y={y} width={w} height="28" rx="14" fill={`color-mix(in srgb, ${COR[tom]} 16%, var(--vs-paper))`} stroke={COR[tom]} strokeWidth="1.8" />
    <Estrela x={x + 16} y={y + 14} r={7} />
    <text x={x + 30 + (w - 34) / 2} y={y + 19} textAnchor="middle" className="vs-kit-mao" fontSize="14" fill="var(--vs-ink)" stroke="none">{children}</text>
  </g>;
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
  // A cor vai inline, e não por classe: as classes só existiam para os cinco
  // tons da primeira rodada, e os lápis novos saíam em preto e sem seta.
  return <g className="vs-kit-nota" aria-hidden="true">
    <path d={`M${sx.toFixed(1)} ${sy.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${ax} ${ay}`} stroke={COR[tom]} />
    <path d={`M${p(8, 0.45)}L${ax} ${ay}L${p(8, -0.45)}`} stroke={COR[tom]} />
    <text x={tx} y={ty} textAnchor={alinhamento} fontSize={tam} fill={COR[tom]} stroke="none">
      {linhas.map((l, i) => <tspan key={i} x={tx} dy={i ? tam * 1.05 : 0}>{l}</tspan>)}
    </text>
  </g>;
}

/** Rótulo da cena, manuscrito como os do pôster, sem contorno herdado. */
export const Rotulo = ({ x, y, children, tom = 'tinta', tam = 12, peso = 700, ancora = 'middle' }: {
  x: number; y: number; children: React.ReactNode; tom?: Tom | 'dim'; tam?: number; peso?: number; ancora?: 'start' | 'middle' | 'end';
}) => <text x={x} y={y} textAnchor={ancora} fontSize={tam} fontWeight={peso} className="vs-kit-mao" fill={tom === 'dim' ? 'var(--vs-dim)' : COR[tom]} stroke="none">{children}</text>;

/** Senoide amostrada fino: com 17 pontos ligados por reta a interferência
 * saía em zigue-zague, com bico em cada crista. */
export function senoide({ x0, x1, y, amp, ciclos, fase = 0, passos = 96 }: { x0: number; x1: number; y: number; amp: number; ciclos: number; fase?: number; passos?: number }) {
  const pts = Array.from({ length: passos + 1 }, (_, i) => {
    const t = i / passos;
    return [x0 + (x1 - x0) * t, y - amp * Math.sin(t * ciclos * 2 * Math.PI + fase)] as const;
  });
  return `M${pts.map(([x, yy]) => `${x.toFixed(1)} ${yy.toFixed(1)}`).join('L')}`;
}
