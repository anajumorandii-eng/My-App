import React, { useId } from 'react';

/**
 * Peças de ilustração para as cenas dos instrumentos, no traço tecnológico:
 * painel de vidro, linha de neon, grade de HUD.
 *
 * Histórico de direção, que explica por que as peças são estas:
 * 1. "A estética está feia": traço chapado de 2 a 4 px sobre fundo vazio. O
 *    kit nasceu para dar volume, anotação e destaque às cenas.
 * 2. "Mais divertido": pôsteres de caderno ilustrado. O kit virou lápis de
 *    cor, etiqueta e estrela.
 * 3. "Moderno e tecnológico": a Ana Júlia mandou vídeos de sites imersivos —
 *    fundo escuro, vidro flutuando em profundidade, luz de neon, partículas,
 *    letreiro grande e apertado, dados em monoespaçada. É a direção atual.
 *
 * As cenas não foram redesenhadas a cada troca: elas usam `Painel`, `Bola`,
 * `Nota`, `Pilula` e os tons daqui, e o estilo mora só neste arquivo e em
 * `Visual.css`. É o que faz a troca de direção custar um arquivo, não cinco
 * cenas.
 *
 * Os ids de gradiente e filtro saem de `useId`: duas pranchas na mesma página
 * (o teste de contrato renderiza todas) não podem disputar o mesmo `url(#…)`.
 */

export type Tom = 'acc' | 'azul' | 'ambar' | 'verde' | 'tinta' | 'sol' | 'roxo' | 'laranja' | 'ciano' | 'vermelho' | 'claro';

// Os tons de neon vêm de tokens de Visual.css: no tema claro o mesmo tom
// escurece, senão ciano e âmbar somem no vidro branco.
const COR: Record<Tom, string> = {
  acc: 'var(--vs-kit-acc, var(--vs-burgundy))',
  azul: 'var(--vs-kit-azul, var(--vs-blue))',
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
    /** Reflexo de vidro por cima de um preenchimento: faixa clara no alto. */
    reflexo: `url(#${base}-reflexo)`,
    grade: `url(#${base}-grade)`,
    /** Halo de neon em volta do traço. Nunca em grupo com texto: a letra com
     * halo borra, que é o defeito corrigido na lousa do iPad. */
    neon: `url(#${base}-neon)`,
    Defs: () => <defs>
      {(Object.keys(COR) as Tom[]).map(tom =>
        <radialGradient key={tom} id={`${base}-esf-${tom}`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".22" stopColor={COR[tom]} />
          <stop offset="1" stopColor={`color-mix(in srgb, ${COR[tom]} 55%, #000)`} />
        </radialGradient>)}
      <linearGradient id={`${base}-metal`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4f6fa" />
        <stop offset=".5" stopColor="#aab3c2" />
        <stop offset="1" stopColor="#5d6675" />
      </linearGradient>
      <linearGradient id={`${base}-ouro`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff1c2" />
        <stop offset=".5" stopColor="#f0b93f" />
        <stop offset="1" stopColor="#9a6410" />
      </linearGradient>
      <linearGradient id={`${base}-reflexo`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".38" />
        <stop offset=".45" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <pattern id={`${base}-grade`} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" className="vs-kit-grade" />
      </pattern>
      {/* Região em coordenadas da cena: com a caixa do próprio objeto, uma
          linha reta (a soma zerada na interferência) tem altura zero e o
          filtro a apagava inteira. */}
      <filter id={`${base}-neon`} filterUnits="userSpaceOnUse" x="0" y="0" width="320" height="300">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="halo" />
        <feMerge><feMergeNode in="halo" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>,
  };
}

type Kit = ReturnType<typeof useKit>;

/** Grade fina de HUD atrás de tudo. */
export const Papel = ({ kit }: { kit: Kit }) =>
  <rect x="0" y="0" width="320" height="300" fill={kit.grade} />;

/**
 * Painel de vidro com cantoneiras de HUD e rótulo monoespaçado. `escuro` pinta
 * o fundo de espaço (a órbita), escuro também no tema claro.
 */
export function Painel({ x, y, w, h, titulo, tom = 'roxo', escuro }: { x: number; y: number; w: number; h: number; titulo?: string; tom?: Tom; escuro?: boolean }) {
  const c = 9;
  const cantos = [
    `M${x} ${y + c}V${y}H${x + c}`, `M${x + w - c} ${y}H${x + w}V${y + c}`,
    `M${x + w} ${y + h - c}V${y + h}H${x + w - c}`, `M${x + c} ${y + h}H${x}V${y + h - c}`,
  ].join('');
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="8" fill={escuro ? 'var(--vs-kit-ceu, #070b1a)' : 'var(--vs-kit-vidro)'} stroke={`color-mix(in srgb, ${COR[tom]} 45%, transparent)`} strokeWidth="1" />
    <path d={cantos} fill="none" stroke={COR[tom]} strokeWidth="2" strokeLinecap="round" />
    {titulo && <g>
      <circle cx={x + 12} cy={y + 11} r="2.6" fill={COR[tom]} className="vs-kit-pulso" />
      <text x={x + 20} y={y + 14.5} className="vs-kit-mono" fontSize="9.5" fill={COR[tom]} stroke="none" letterSpacing="1.2">{titulo}</text>
    </g>}
  </g>;
}

/** Ponto de luz: o brilho solto dos sites imersivos. */
export const Brilho = ({ x, y, r = 5, tom = 'sol' }: { x: number; y: number; r?: number; tom?: Tom }) => <g>
  <circle cx={x} cy={y} r={r * 1.1} fill={COR[tom]} opacity=".22" />
  <circle cx={x} cy={y} r={r * 0.45} fill={COR[tom]} />
  <circle cx={x} cy={y} r={r * 0.2} fill="#fff" />
</g>;

/** Marcador de status: o ponto aceso que abre a pílula de resultado. */
export function Estrela({ x, y, r = 7, tom = 'ciano' }: { x: number; y: number; r?: number; tom?: Tom }) {
  return <g>
    <circle cx={x} cy={y} r={r * 0.95} fill={COR[tom]} opacity=".25" className="vs-kit-pulso" />
    <circle cx={x} cy={y} r={r * 0.45} fill={COR[tom]} />
  </g>;
}

/** Esfera brilhante com reflexo e halo. */
export const Bola = ({ kit, cx, cy, r, tom }: { kit: Kit; cx: number; cy: number; r: number; tom: Tom }) => <g>
  <circle cx={cx} cy={cy} r={r + 2.5} fill={COR[tom]} opacity=".18" />
  <circle cx={cx} cy={cy} r={r} fill={kit.esfera(tom)} />
  <circle cx={cx} cy={cy} r={r} fill={kit.reflexo} />
  <circle cx={cx} cy={cy} r={r} fill="none" stroke={`color-mix(in srgb, ${COR[tom]} 60%, #fff)`} strokeWidth=".8" opacity=".7" />
</g>;

/**
 * O resultado do cursor num chip de vidro com ponto aceso. É a linha que se
 * lê primeiro, como o contador em destaque dos painéis de dados.
 */
export function Pilula({ x, y, w, children, tom = 'ciano' }: { x: number; y: number; w: number; children: React.ReactNode; tom?: Tom }) {
  return <g>
    <rect x={x} y={y} width={w} height="28" rx="8" fill="var(--vs-kit-vidro-forte)" stroke={`color-mix(in srgb, ${COR[tom]} 60%, transparent)`} strokeWidth="1.2" />
    <path d={`M${x + 10} ${y + 27.4}H${x + w - 10}`} stroke={COR[tom]} strokeWidth="1.6" opacity=".8" />
    <Estrela x={x + 15} y={y + 14} r={7} tom={tom} />
    <text x={x + 28 + (w - 32) / 2} y={y + 18.5} textAnchor="middle" className="vs-kit-mono" fontSize="11.5" fill="var(--vs-ink)" stroke="none">{children}</text>
  </g>;
}

/** Sombra pousada no chão. */
export const Sombra = ({ cx, cy, rx, ry = rx * 0.22 }: { cx: number; cy: number; rx: number; ry?: number }) =>
  <ellipse className="vs-kit-sombra" cx={cx} cy={cy} rx={rx} ry={ry} />;

/** Faixa de destaque atrás de uma palavra. */
export const Marca = ({ x, y, w, h = 15 }: { x: number; y: number; w: number; h?: number }) =>
  <rect className="vs-kit-marca" x={x} y={y} width={w} height={h} rx="3" />;

/**
 * Anotação de HUD: ponto no alvo, linha de chamada em cotovelo e rótulo
 * monoespaçado. Substitui a seta curva manuscrita da direção anterior; a
 * assinatura (`de`, `em`, `texto`) é a mesma, então as cenas não mudam.
 */
export function Nota({ de, em, texto, tom = 'acc', ancora, tam = 11 }: {
  de: [number, number];
  em: [number, number];
  texto: string | string[];
  tom?: Tom;
  ancora?: 'start' | 'middle' | 'end';
  /** Mantido por compatibilidade com as cenas; o traço de HUD é reto. */
  curva?: 1 | -1;
  tam?: number;
}) {
  const [ax, ay] = de;
  const [tx, ty] = em;
  const linhas = Array.isArray(texto) ? texto : [texto];
  const alinhamento = ancora ?? (tx < ax - 8 ? 'end' : tx > ax + 8 ? 'start' : 'middle');
  const altura = linhas.length * tam * 1.2;
  // A linha sai do ponto do bloco de texto mais próximo do alvo, como na
  // versão anterior: sair da ponta do alinhamento cruzava o próprio texto.
  const largura = Math.max(...linhas.map(l => l.length)) * tam * 0.6;
  const esquerda = alinhamento === 'start' ? tx : alinhamento === 'end' ? tx - largura : tx - largura / 2;
  const sx = Math.min(esquerda + largura, Math.max(esquerda, ax));
  const sy = ay > ty ? ty + altura - tam * 0.7 : ty - tam * 1.05;
  // Cotovelo: primeiro na vertical, depois na diagonal até o alvo.
  const cy = sy + (ay - sy) * 0.55;
  return <g aria-hidden="true">
    <path d={`M${sx.toFixed(1)} ${sy.toFixed(1)}V${cy.toFixed(1)}L${ax} ${ay}`} fill="none" stroke={COR[tom]} strokeWidth="1.1" opacity=".85" />
    <circle cx={ax} cy={ay} r="4.5" fill="none" stroke={COR[tom]} strokeWidth="1" opacity=".7" />
    <circle cx={ax} cy={ay} r="1.8" fill={COR[tom]} />
    <text x={tx} y={ty} textAnchor={alinhamento} fontSize={tam} className="vs-kit-mono" fill={COR[tom]} stroke="none">
      {linhas.map((l, i) => <tspan key={i} x={tx} dy={i ? tam * 1.2 : 0}>{l}</tspan>)}
    </text>
  </g>;
}

/** Rótulo da cena, sem contorno herdado. */
export const Rotulo = ({ x, y, children, tom = 'tinta', tam = 12, peso = 600, ancora = 'middle' }: {
  x: number; y: number; children: React.ReactNode; tom?: Tom | 'dim'; tam?: number; peso?: number; ancora?: 'start' | 'middle' | 'end';
}) => <text x={x} y={y} textAnchor={ancora} fontSize={tam} fontWeight={peso} className="vs-kit-rotulo" fill={tom === 'dim' ? 'var(--vs-dim)' : COR[tom]} stroke="none">{children}</text>;

/** Senoide amostrada fino: com 17 pontos ligados por reta a interferência
 * saía em zigue-zague, com bico em cada crista. */
export function senoide({ x0, x1, y, amp, ciclos, fase = 0, passos = 96 }: { x0: number; x1: number; y: number; amp: number; ciclos: number; fase?: number; passos?: number }) {
  const pts = Array.from({ length: passos + 1 }, (_, i) => {
    const t = i / passos;
    return [x0 + (x1 - x0) * t, y - amp * Math.sin(t * ciclos * 2 * Math.PI + fase)] as const;
  });
  return `M${pts.map(([x, yy]) => `${x.toFixed(1)} ${yy.toFixed(1)}`).join('L')}`;
}
