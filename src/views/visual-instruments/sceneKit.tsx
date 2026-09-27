import React from 'react';

// Peças de desenho das oficinas de Redação e de Leitura: texto, caixa com
// quebra por palavra, seta com ponta da mesma cor e selo de certo/errado.
// Ficam juntas para que as duas famílias leiam igual — mesma borda para falha,
// mesma cor para o que se sustenta.

export const ink = 'var(--vs-ink)';
export const dim = 'var(--vs-ink-muted)';
export const accent = 'var(--vs-burgundy)';
export const green = 'var(--vs-green, var(--vs-blue))';
export const paper = 'var(--vs-paper)';

export const T = ({ x, y, children, cor = ink, tam = 12, peso = 700, ancora = 'middle' }: { x: number; y: number; children: React.ReactNode; cor?: string; tam?: number; peso?: number; ancora?: 'start' | 'middle' | 'end' }) =>
  <text x={x} y={y} textAnchor={ancora} style={{ fill: cor, fontSize: tam, fontWeight: peso }}>{children}</text>;

/** Quebra por palavra: o SVG não quebra linha, e "não chega a quem enfrenta a
 * barreira" saía da caixa de 146. */
export function quebrar(texto: string, max: number) {
  return texto.split(' ').reduce<string[]>((a, w) => {
    const u = a[a.length - 1];
    if (u !== undefined && `${u} ${w}`.length <= max) a[a.length - 1] = `${u} ${w}`; else a.push(w);
    return a;
  }, []);
}

/** Caixa com título e texto quebrado na largura; `estado` pinta a borda. */
export function Caixa({ x, y, w, h = 52, linhas, estado = 'neutro', tracejada }: { x: number; y: number; w: number; h?: number; linhas: string[]; estado?: 'neutro' | 'falha' | 'ok'; tracejada?: boolean }) {
  const cor = estado === 'falha' ? accent : estado === 'ok' ? green : dim;
  const max = Math.max(6, Math.floor((w - 10) / 6.4));
  const todas = linhas.flatMap((l, k) => quebrar(l, max).map((t) => ({ t, titulo: k === 0 })));
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="10" fill={paper} stroke={cor} strokeWidth={estado === 'neutro' ? 2 : 3.5} strokeDasharray={tracejada ? '6 5' : undefined} />
    {todas.map((l, k) => <T key={k} x={x + w / 2} y={y + h / 2 + 4 + (k - (todas.length - 1) / 2) * 16} tam={11} peso={l.titulo ? 800 : 600} cor={l.titulo ? ink : dim}>{l.t}</T>)}
  </g>;
}
export const Pontas = () => <defs>
  {[['wm-ink', dim], ['wm-acc', accent], ['wm-ok', green]].map(([id, cor]) =>
    <marker key={id} id={id} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={cor} /></marker>)}
</defs>;
export const Seta = ({ d, cor = 'ink', larg = 2.5, tracejada }: { d: string; cor?: 'ink' | 'acc' | 'ok'; larg?: number; tracejada?: boolean }) =>
  <path d={d} fill="none" stroke={cor === 'acc' ? accent : cor === 'ok' ? green : dim} strokeWidth={larg} strokeDasharray={tracejada ? '5 4' : undefined} markerEnd={`url(#wm-${cor})`} />;
export const Selo = ({ x, y, ok }: { x: number; y: number; ok: boolean }) => <g>
  <circle cx={x} cy={y} r="12" fill={ok ? green : accent} />
  <path d={ok ? `M${x - 5} ${y}l4 4 7-8` : `M${x - 5} ${y - 5}l10 10m0-10l-10 10`} stroke={paper} strokeWidth="2.5" fill="none" strokeLinecap="round" />
</g>;

