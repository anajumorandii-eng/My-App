import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { DynamicsId } from '../../lib/dynamicsLab';
import type { VectorId } from '../../lib/vectorsLab';
import type { OrbitalId } from '../../lib/orbitalLab';
import type { EnergyId } from '../../lib/energyLab';
import { Brilho, Nota, Painel, Papel, Pilula, useKit } from './illustrationKit';

// Auditoria 37: dinâmica, vetores, órbitas e energia desenhavam uma cena só
// por instrumento — uma caixa com três setas, um triângulo, um círculo dentro
// de outro, uma barra — e trocavam apenas o texto entre capítulos. "Corpos
// interagindo" falava de dois blocos e um fio e desenhava um bloco; as três
// cenas orbitais eram idênticas byte a byte. Aqui cada capítulo desenha o
// próprio objeto, e todo número desenhado sai da mesma conta que produz a
// leitura do instrumento (os `*Lab.ts`).

const ink = 'var(--vs-ink)';
const dim = 'var(--vs-dim)';
const accent = 'var(--vs-burgundy)';
const blue = 'var(--vs-blue)';
const amber = 'var(--vs-amber)';
const paper = 'var(--vs-paper-strong)';
const f = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',');

const Rotulo = ({ x, y, children, cor = dim, ancora = 'middle', peso }: { x: number; y: number; children: React.ReactNode; cor?: string; ancora?: 'start' | 'middle' | 'end'; peso?: number }) =>
  <text x={x} y={y} textAnchor={ancora} fill={cor} fontSize="11" fontWeight={peso}>{children}</text>;

/** Pontas de seta por cor: o `marker` do SVG não herda a cor do traço. */
const Pontas = () => <defs>
  {[['ink', ink], ['acc', accent], ['blue', blue], ['amber', amber]].map(([id, cor]) =>
    <marker key={id} id={`pm-${id}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={cor} /></marker>)}
</defs>;
const COR_ID: Record<string, string> = { [ink]: 'ink', [accent]: 'acc', [blue]: 'blue', [amber]: 'amber' };

/** Seta de (x1,y1) a (x2,y2). Com comprimento quase nulo não desenha nada —
 * uma ponta solta sem haste parecia força onde não havia. */
function Seta({ x1, y1, x2, y2, cor = accent, largura = 3.5, tracejada }: { x1: number; y1: number; x2: number; y2: number; cor?: string; largura?: number; tracejada?: boolean }) {
  if (Math.hypot(x2 - x1, y2 - y1) < 3) return null;
  return <path d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={cor} strokeWidth={largura} strokeLinecap="round" strokeDasharray={tracejada ? '5 4' : undefined} markerEnd={`url(#pm-${COR_ID[cor]})`} />;
}
const Bloco = ({ x, y, w = 56, h = 40, rotulo }: { x: number; y: number; w?: number; h?: number; rotulo?: string }) => <g>
  <rect x={x} y={y} width={w} height={h} rx="4" fill={paper} stroke={ink} strokeWidth="2.5" />
  {rotulo && <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fill={ink} fontSize="14" fontWeight="800">{rotulo}</text>}
</g>;
const Chao = ({ y, x1 = 24, x2 = 296, aspero }: { y: number; x1?: number; x2?: number; aspero?: boolean }) => <g>
  <path d={`M${x1} ${y}H${x2}`} stroke={ink} strokeWidth="2.5" />
  {Array.from({ length: Math.floor((x2 - x1) / 14) }, (_, k) => <path key={k} d={`M${x1 + 6 + k * 14} ${y + 2}l-8 ${aspero ? 10 : 8}`} stroke={aspero ? amber : dim} strokeWidth={aspero ? 2 : 1.2} />)}
</g>;
/** Eixos de gráfico com rótulo nas pontas — o KinematicsBoard foi apontado por
 * não rotular t e s, e aqui o gráfico é o próprio argumento. */
const Eixos = ({ x0, y0, w, h, rx, ry }: { x0: number; y0: number; w: number; h: number; rx: string; ry: string }) => <g>
  <Seta x1={x0} y1={y0} x2={x0 + w} y2={y0} cor={ink} largura={1.8} />
  <Seta x1={x0} y1={y0} x2={x0} y2={y0 - h} cor={ink} largura={1.8} />
  <Rotulo x={x0 + w} y={y0 + 16} ancora="end" cor={ink}>{rx}</Rotulo>
  <Rotulo x={x0 + 6} y={y0 - h + 4} ancora="start" cor={ink}>{ry}</Rotulo>
</g>;

// ---------------------------------------------------------------------------
// Dinâmica
export function DinamicaCena({ id, v }: { id: DynamicsId; v: number }) {
  const k = 9; // px por newton
  if (id === 'resultante') {
    const r = v - 6;
    return <g data-phys="resultante"><Pontas />
      <Chao y={180} />
      <Bloco x={132} y={140} />
      <Seta x1={188} y1={160} x2={188 + v * k} y2={160} cor={blue} />
      <Rotulo x={196} y={132} ancora="start" cor={blue} peso={700}>{v} N</Rotulo>
      <Seta x1={132} y1={160} x2={132 - 6 * k} y2={160} cor={blue} />
      <Rotulo x={124} y={132} ancora="end" cor={blue} peso={700}>6 N</Rotulo>
      <Rotulo x={160} y={214} cor={ink} peso={700}>resultante</Rotulo>
      <Seta x1={160} y1={232} x2={160 + r * k} y2={232} cor={accent} largura={5} />
      <Rotulo x={160} y={268} cor={r === 0 ? accent : ink} peso={700}>{r === 0 ? 'ΣF = 0: equilíbrio, sem aceleração' : `ΣF = ${Math.abs(r)} N para a ${r > 0 ? 'direita' : 'esquerda'}`}</Rotulo>
      <Rotulo x={160} y={286}>só a resultante decide a aceleração</Rotulo>
    </g>;
  }
  if (id === 'contato') {
    return <g data-phys="contato"><Pontas />
      <Chao y={170} aspero />
      <Bloco x={132} y={130} />
      <Seta x1={188} y1={150} x2={188 + 8 * k} y2={150} cor={blue} />
      <Rotulo x={232} y={140} cor={blue} peso={700}>aplicada 8 N</Rotulo>
      <Seta x1={150} y1={170} x2={150 - v * k} y2={170} cor={amber} largura={4} />
      <Rotulo x={116} y={194} ancora="end" cor={amber} peso={700}>atrito {v} N</Rotulo>
      <Seta x1={170} y1={130} x2={170} y2={78} cor={accent} />
      <Rotulo x={178} y={86} ancora="start" cor={accent} peso={700}>normal ⊥ superfície</Rotulo>
      <Rotulo x={196} y={200} ancora="start" cor={amber}>atrito ∥ superfície,</Rotulo>
      <Rotulo x={196} y={214} ancora="start" cor={amber}>contra o deslizamento</Rotulo>
      <Rotulo x={160} y={276} cor={ink} peso={700}>resultante horizontal: {8 - v} N</Rotulo>
    </g>;
  }
  if (id === 'corpos') {
    // Dois blocos e o fio entre eles: a tração puxa A para a frente e B para
    // trás, com o mesmo módulo, porque o fio (ideal) só transmite a força.
    return <g data-phys="corpos"><Pontas />
      <Chao y={180} />
      <Bloco x={50} y={140} rotulo="A" />
      <Bloco x={200} y={140} rotulo="B" />
      <path d="M106 160H200" stroke={ink} strokeWidth="2" />
      <Rotulo x={153} y={152} cor={ink}>fio</Rotulo>
      <Seta x1={106} y1={172} x2={106 + v * 5} y2={172} cor={accent} />
      <Seta x1={200} y1={172} x2={200 - v * 5} y2={172} cor={accent} />
      <Rotulo x={78} y={122} cor={accent} peso={700}>T = {v} N →</Rotulo>
      <Rotulo x={228} y={122} cor={accent} peso={700}>← T = {v} N</Rotulo>
      <Rotulo x={160} y={222} cor={ink} peso={700}>Fio ideal: forças do fio sobre A e B</Rotulo>
      <Rotulo x={160} y={240}>Pares: cada bloco age sobre o fio.</Rotulo>
      <g data-third-law-pair="A-fio"><Seta x1={136} y1={260} x2={136-v*4} y2={260} cor={blue}/><Rotulo x={100} y={282}>A puxa o fio ←</Rotulo></g>
      <g data-third-law-pair="B-fio"><Seta x1={185} y1={260} x2={185+v*4} y2={260} cor={blue}/><Rotulo x={229} y={282}>B puxa o fio →</Rotulo></g>
      <Rotulo x={160} y={302}>Trações em A/B não formam um par.</Rotulo>
    </g>;
  }
  // Plano inclinado: P fixo de 10 N (60 px) e as duas componentes calculadas
  // com o mesmo θ da leitura.
  const t = (v * Math.PI) / 180;
  const base = { x: 40, y: 240 };
  const len = 210;
  const topo = { x: base.x + len * Math.cos(t), y: base.y - len * Math.sin(t) };
  const c = { x: base.x + 0.55 * len * Math.cos(t), y: base.y - 0.55 * len * Math.sin(t) };
  const n = { x: -Math.sin(t), y: -Math.cos(t) };
  const centro = { x: c.x + 20 * n.x, y: c.y + 20 * n.y };
  const P = 50;
  const par = { x: -Math.cos(t) * P * Math.sin(t), y: Math.sin(t) * P * Math.sin(t) };
  const perp = { x: -n.x * P * Math.cos(t), y: -n.y * P * Math.cos(t) };
  return <g data-phys="plano"><Pontas />
    <path d={`M${base.x} ${base.y}L${topo.x.toFixed(1)} ${topo.y.toFixed(1)}L${topo.x.toFixed(1)} ${base.y}Z`} fill={`color-mix(in srgb, ${amber} 12%, ${paper})`} stroke={ink} strokeWidth="2.5" />
    {v > 0 && <path d={`M${base.x + 40} ${base.y}A40 40 0 0 0 ${(base.x + 40 * Math.cos(t)).toFixed(1)} ${(base.y - 40 * Math.sin(t)).toFixed(1)}`} fill="none" stroke={ink} strokeWidth="1.5" />}
    <Rotulo x={base.x + 50} y={base.y - 6} ancora="start" cor={ink}>θ = {v}°</Rotulo>
    <g transform={`rotate(${-v} ${centro.x.toFixed(1)} ${centro.y.toFixed(1)})`}><rect x={centro.x - 20} y={centro.y - 20} width="40" height="40" rx="4" fill={paper} stroke={ink} strokeWidth="2.5" /></g>
    <Seta x1={centro.x} y1={centro.y} x2={centro.x} y2={centro.y + P} cor={blue} />
    <Seta x1={centro.x} y1={centro.y} x2={centro.x + par.x} y2={centro.y + par.y} cor={accent} />
    <Seta x1={centro.x} y1={centro.y} x2={centro.x + perp.x} y2={centro.y + perp.y} cor={accent} tracejada />
    <Rotulo x={centro.x + 8} y={centro.y + P + 14} ancora="start" cor={blue} peso={700}>P = 10 N</Rotulo>
    <Rotulo x={20} y={30} ancora="start" cor={accent} peso={700}>P∥ = {f(10 * Math.sin(t))} N, ladeira abaixo</Rotulo>
    <Rotulo x={20} y={46} ancora="start" cor={accent}>P⊥ = {f(10 * Math.cos(t))} N (tracejada), que a normal equilibra</Rotulo>
  </g>;
}

// ---------------------------------------------------------------------------
// Vetores
export function VetoresCena({ id, v }: { id: VectorId; v: number }) {
  if (id === 'composicao') {
    // Travessia: margens, correnteza e o ponto de chegada rio abaixo. O
    // barco aponta sempre para o norte a 4 m/s; o desvio cresce com a
    // correnteza, e o tempo de travessia não muda, porque só depende da
    // componente perpendicular às margens.
    const largura = 150;
    const y0 = 220, y1 = y0 - largura;
    const x0 = 70;
    const deriva = (largura * v) / 4;
    const chegada = Math.min(300, x0 + deriva);
    return <g data-phys="travessia"><Pontas />
      <rect x="0" y={y1} width="320" height={largura} fill={`color-mix(in srgb, ${blue} 12%, ${paper})`} />
      <path d={`M0 ${y1}H320M0 ${y0}H320`} stroke={ink} strokeWidth="2.5" />
      {v > 0 && [0, 1, 2].map((k) => <Seta key={k} x1={180 + (k % 2) * 40} y1={y1 + 30 + k * 40} x2={180 + (k % 2) * 40 + v * 10} y2={y1 + 30 + k * 40} cor={blue} largura={2} />)}
      <path d={`M${x0} ${y0}L${chegada.toFixed(1)} ${y1}`} stroke={dim} strokeWidth="1.5" strokeDasharray="5 4" />
      <path d={`M${x0 - 8} ${y0 + 4}l8-16 8 16Z`} fill={accent} />
      <Seta x1={x0} y1={y0} x2={x0} y2={y0 - 64} cor={accent} />
      <Seta x1={x0} y1={y0} x2={x0 + v * 16} y2={y0} cor={blue} />
      <Seta x1={x0} y1={y0} x2={x0 + v * 16} y2={y0 - 64} cor={ink} largura={2.5} />
      <circle cx={chegada} cy={y1} r="5" fill={accent} />
      <Rotulo x={x0 - 8} y={y0 - 60} ancora="end" cor={accent} peso={700}>barco</Rotulo>
      <Rotulo x={x0 - 8} y={y0 - 46} ancora="end" cor={accent} peso={700}>4 m/s</Rotulo>
      <Rotulo x={20} y={24} ancora="start" cor={ink} peso={700}>{v === 0 ? 'sem correnteza: chega em frente' : chegada >= 300 ? 'chega fora do quadro, rio abaixo' : 'chega rio abaixo'}</Rotulo>
      <Rotulo x={20} y={40} ancora="start">tempo de travessia: o mesmo, com ou sem rio</Rotulo>
      <Rotulo x={x0 + 6} y={y0 + 20} ancora="start" cor={blue} peso={700}>rio {v} m/s</Rotulo>
      <Rotulo x={160} y={284}>cada movimento segue independente do outro</Rotulo>
    </g>;
  }
  // Vetor em componentes: origem no meio para caber Vx negativo.
  const o = { x: 130, y: 200 };
  const s = 18;
  const vx = id === 'velocidade' ? 4 : v;
  const vy = id === 'vetores' ? 3 : v;
  const ponta = { x: o.x + vx * s, y: o.y - vy * s };
  const modulo = Math.hypot(vx, vy);
  // O rótulo de Vy vai para fora do triângulo enquanto couber no quadro.
  const fora = vx >= 0 ? ponta.x + 56 < 316 : ponta.x - 56 > 4;
  return <g data-phys={id}><Pontas />
    {Array.from({ length: 15 }, (_, k) => <path key={`v${k}`} d={`M${o.x + (k - 5) * s} 44V${o.y + 5 * s}`} stroke={dim} strokeWidth=".5" opacity=".5" />)}
    {Array.from({ length: 14 }, (_, k) => <path key={`h${k}`} d={`M${o.x - 5 * s} ${o.y - (k - 5) * s}H${o.x + 9 * s}`} stroke={dim} strokeWidth=".5" opacity=".5" />).filter((_, k) => o.y - (k - 5) * s >= 44)}
    <path d={`M${o.x - 5 * s} ${o.y}H${o.x + 9 * s}M${o.x} 44V${o.y + 5 * s}`} stroke={ink} strokeWidth="1.5" />
    <Seta x1={o.x} y1={o.y} x2={ponta.x} y2={o.y} cor={blue} />
    <Seta x1={ponta.x} y1={o.y} x2={ponta.x} y2={ponta.y} cor={blue} tracejada />
    <Seta x1={o.x} y1={o.y} x2={ponta.x} y2={ponta.y} cor={accent} largura={4.5} />
    <Rotulo x={(o.x + ponta.x) / 2} y={o.y + 16} cor={blue} peso={700}>{id === 'velocidade' ? 'Vx = 4' : `Vx = ${vx}`}</Rotulo>
    <Rotulo x={ponta.x + (fora ? 8 : -8) * (vx >= 0 ? 1 : -1)} y={(o.y + ponta.y) / 2} ancora={(vx >= 0) === fora ? 'start' : 'end'} cor={blue} peso={700}>{id === 'vetores' ? 'Vy = 3' : `Vy = ${vy}`}</Rotulo>
    {id === 'velocidade'
      ? <><circle cx={o.x} cy={o.y} r="8" fill={paper} stroke={ink} strokeWidth="2.5" />
        <path d={`M${o.x - (ponta.x - o.x) * 0.9} ${o.y - (ponta.y - o.y) * 0.9}L${o.x} ${o.y}`} stroke={dim} strokeWidth="1.5" strokeDasharray="4 4" />
        <Rotulo x={20} y={24} ancora="start" cor={accent} peso={700}>rapidez {f(modulo)} m/s: só o comprimento</Rotulo>
        <Rotulo x={20} y={40} ancora="start">a seta inteira é a velocidade vetorial</Rotulo></>
      : <><Rotulo x={20} y={24} ancora="start" cor={accent} peso={700}>|V| = √({vx}² + 3²) = {f(modulo)}</Rotulo>
        <Rotulo x={20} y={40} ancora="start">componentes perpendiculares somam como vetores</Rotulo></>}
  </g>;
}

// ---------------------------------------------------------------------------
// Órbitas
const PLANETA = { x: 160, y: 160, r: 42 };

/** Trajetória do satélite lançado na horizontal a partir de r0, por integração
 * numérica simples. v = 4 é a velocidade circular. Acima de 4, a escala sobe
 * devagar e para abaixo da de escape (1,32 × circular): o resumo trata de
 * órbita circular ou elíptica e de queda, não de escape, e a leitura do
 * instrumento diz "orbita" para todo v ≥ 4. */
export function trajetoria(v: number) {
  const r0 = 78;
  const gm = 1;
  const vc = Math.sqrt(gm / r0);
  const u = v < 4 ? (v / 4) * vc : vc * (1 + (v - 4) * 0.08);
  let x = 0, y = -r0, vx = u, vy = 0;
  const pts: string[] = [];
  const dt = 0.6;
  let ang = 0, anterior = Math.atan2(y, x), caiu = false;
  for (let k = 0; k < 20000 && ang < Math.PI * 2; k++) {
    const r = Math.hypot(x, y);
    if (r <= PLANETA.r) { caiu = true; break; }
    const a = gm / (r * r);
    vx += (-x / r) * a * dt; vy += (-y / r) * a * dt;
    x += vx * dt; y += vy * dt;
    const atual = Math.atan2(y, x);
    let d = atual - anterior; if (d < -Math.PI) d += 2 * Math.PI; if (d > Math.PI) d -= 2 * Math.PI;
    ang += Math.abs(d); anterior = atual;
    if (k % 20 === 0) pts.push(`${(PLANETA.x + x).toFixed(1)} ${(PLANETA.y + y).toFixed(1)}`);
  }
  pts.push(`${(PLANETA.x + x).toFixed(1)} ${(PLANETA.y + y).toFixed(1)}`);
  return { d: `M${PLANETA.x} ${PLANETA.y - r0}L${pts.join('L')}`, caiu, r0 };
}

export function OrbitalCena({ id, v }: { id: OrbitalId; v: number }) {
  // O traçado da órbita se desenha para mostrar a queda que não chega; com
  // movimento reduzido aparece pronto.
  const reduzir = useReducedMotion();
  if (id === 'balistica') {
    // Estroboscopia: posições a intervalos iguais. O espaçamento horizontal é
    // constante (Vx uniforme); o vertical encolhe e cresce (g só na vertical).
    const vy0 = 6, g = 1.5, esc = 4.2;
    const tvoo = (2 * vy0) / g;
    const pos = Array.from({ length: 9 }, (_, k) => { const t = (k / 8) * tvoo; return { x: 30 + v * t * esc, y: 240 - (vy0 * t - (g * t * t) / 2) * 14 }; });
    return <g data-phys="balistica"><Pontas />
      <Chao y={240} x1={16} x2={304} />
      <path d={`M${pos.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L')}`} stroke={dim} strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
      {pos.map((p, k) => <g key={k}><circle cx={p.x} cy={p.y} r="5" fill={accent} />
        {k % 2 === 0 && k < 8 && <><Seta x1={p.x} y1={p.y} x2={p.x + v * 4} y2={p.y} cor={blue} largura={2} /><Seta x1={p.x} y1={p.y} x2={p.x} y2={p.y - (vy0 - g * (k / 8) * tvoo) * 4} cor={amber} largura={2} /></>}
        <path d={`M${p.x} 244v6`} stroke={blue} strokeWidth="1.5" /></g>)}
      <Rotulo x={20} y={24} ancora="start" cor={blue} peso={700}>Vx = {v}: marcas do chão igualmente espaçadas</Rotulo>
      <Rotulo x={20} y={40} ancora="start" cor={amber} peso={700}>Vy diminui, zera no topo e troca de sentido</Rotulo>
      <Rotulo x={160} y={272}>alcance proporcional a Vx: {f(v)}</Rotulo>
    </g>;
  }
  if (id === 'gravidade') {
    // r em raios do planeta, medido do centro: com raio de 34 px, a marca kR
    // fica a 34k px do centro. A força encolhe com 1/r² na seta e nas barras.
    const c = 38, R = 34;
    const x = c + v * R;
    const F = 60 / (v * v);
    return <g data-phys="gravidade"><Pontas />
      <circle cx={c} cy="150" r={R} fill={`color-mix(in srgb, ${blue} 30%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      {[1, 2, 3, 4, 5, 6, 7, 8].map((k) => k <= 8 && c + k * R < 316 && <g key={k}><path d={`M${c + k * R} 138v24`} stroke={dim} strokeWidth="1" strokeDasharray="3 3" /><Rotulo x={c + k * R} y={178}>{k}R</Rotulo></g>)}
      <circle cx={x} cy="150" r="7" fill={accent} />
      <Seta x1={x} y1={104} x2={x - F} y2={104} cor={accent} largura={4} />
      <Rotulo x={x} y={96} ancora="middle" cor={accent} peso={700}>F</Rotulo>
      <Rotulo x={20} y={30} ancora="start" cor={accent} peso={700}>r = {v}R → F = F₀/{v * v} = {f(1 / (v * v))} F₀</Rotulo>
      <Rotulo x={20} y={46} ancora="start">dobrar a distância reduz a força a um quarto</Rotulo>
      {[1, 2, 3, 4, 5, 6].map((k) => <rect key={k} x={c + k * R - 8} y={260 - 50 / (k * k)} width="16" height={50 / (k * k)} fill={k === v ? accent : dim} opacity={k === v ? 1 : 0.35} />)}
      <path d={`M${c + R - 16} 260H${c + 6 * R + 16}`} stroke={ink} strokeWidth="1.5" />
      <Rotulo x={160} y={282}>F em cada distância</Rotulo>
    </g>;
  }
  if (id === 'circular') {
    // Pista, corpo e três posições anteriores com a velocidade: o módulo é o
    // mesmo e a direção muda — é isso que a força centrípeta faz.
    const c = { x: 150, y: 160 }, R = 80;
    const pos = [-90, -150, -210, -270].map((g) => (g * Math.PI) / 180);
    return <g data-phys="circular"><Pontas />
      <circle cx={c.x} cy={c.y} r={R} fill="none" stroke={dim} strokeWidth="1.5" strokeDasharray="5 4" />
      <circle cx={c.x} cy={c.y} r="3" fill={ink} />
      {pos.map((a, k) => { const p = { x: c.x + R * Math.cos(a), y: c.y + R * Math.sin(a) }; const tg = { x: -Math.sin(a), y: Math.cos(a) };
        return <g key={k} opacity={k ? 0.35 : 1}><circle cx={p.x} cy={p.y} r="8" fill={k ? paper : accent} stroke={ink} strokeWidth="2" />
          <Seta x1={p.x} y1={p.y} x2={p.x - tg.x * v * 8} y2={p.y - tg.y * v * 8} cor={blue} largura={k ? 2.5 : 3.5} /></g>; })}
      <Seta x1={c.x} y1={c.y - R + 10} x2={c.x} y2={c.y - R + 10 + Math.min(70, v * v * 1.1)} cor={accent} largura={4} />
      <Rotulo x={c.x + R + 14} y={c.y - R + 4} ancora="start" cor={blue} peso={700}>v tangente</Rotulo>
      <Rotulo x={c.x + 8} y={c.y - 20} ancora="start" cor={accent} peso={700}>Fc ∝ v² = {f(v * v)}</Rotulo>
      <Rotulo x={20} y={272} ancora="start">módulo igual, direção mudando: há aceleração</Rotulo>
      <Rotulo x={20} y={288} ancora="start">no MCU, a resultante aponta para o centro</Rotulo>
    </g>;
  }
  return <OrbitaCena v={v} reduzir={!!reduzir} />;
}

/**
 * Órbitas. O traçado continua saindo de `trajetoria` — é a conta que decide
 * "cai" ou "orbita" —, mas a cena ganhou corpo: o planeta tinha contorno e
 * preenchimento chapado, o satélite era uma bolinha, e as duas setas não
 * diziam o que eram. A referência aprovada rotula o achado com seta à mão, e
 * aqui o achado é que a gravidade aponta para o centro enquanto v aponta para
 * o lado: é a soma das duas que curva a queda.
 */
function OrbitaCena({ v, reduzir }: { v: number; reduzir: boolean }) {
  const kit = useKit();
  const clip = `${useId().replace(/:/g, '')}-ceu`;
  const traj = trajetoria(v);
  const sat = { x: PLANETA.x, y: PLANETA.y - traj.r0 };
  // Estrelas fixas: posições tiradas de uma sequência determinística, para o
  // desenho não mudar a cada render nem entre servidor e teste.
  const estrelas = Array.from({ length: 26 }, (_, k) => [(k * 97) % 290 + 16, (k * 53) % 214 + 24, k % 3 ? 0.9 : 1.6]);
  const leitura = traj.caiu ? 'cai: a queda alcança o planeta' : v === 4 ? 'órbita circular: Fg = Fc' : 'órbita elíptica: ainda cai em volta';
  const { x, y, r } = PLANETA;
  return <g data-phys="orbitas">
    <kit.Defs /><Pontas />
    <defs><clipPath id={clip}><rect x="6" y="14" width="308" height="232" rx="10" /></clipPath></defs>
    <Papel kit={kit} />
    <Painel x={6} y={14} w={308} h={232} titulo="ÓRBITA" tom="roxo" escuro />
    <g clipPath={`url(#${clip})`}>
      {estrelas.map(([ex, ey, er], k) => Math.hypot(ex - x, ey - y) > r + 14 && <circle key={k} cx={ex} cy={ey} r={er} fill="#fff" opacity=".7" />)}
      <Brilho x={40} y={60} r={6} /><Brilho x={282} y={210} r={5} tom="claro" /><Brilho x={270} y={70} r={4} tom="sol" />
      <circle cx={x} cy={y} r={r + 6} fill="none" stroke="#7fc8ff" strokeWidth="5" opacity=".35" />
      <circle cx={x} cy={y} r={r} fill="#2f7fc1" />
      <path d={`M${x - 30} ${y - 16}q8 -16 24 -10t12 12q-6 12 -20 8t-16 -10z M${x + 4} ${y + 8}q16 -8 28 2t-4 22q-14 4 -22 -8z M${x - 22} ${y + 18}q8 -2 12 6t-6 8q-8 -2 -6 -14z`} fill="#4caf6a" stroke="#1f5f36" strokeWidth="1" />
      <path d={`M${x - 36} ${y + 2}q10 -5 20 0M${x + 8} ${y - 26}q10 -4 18 2`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <circle cx={x} cy={y} r={r} fill={kit.reflexo} />
      <circle cx={x} cy={y} r={r} fill={kit.esfera('claro')} opacity=".25" />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#0d1210" strokeWidth="1.5" />
      <motion.path key={v} d={traj.d} fill="none" stroke={traj.caiu ? '#ff9a62' : '#ffd23f'} strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" initial={reduzir ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
    </g>
    {/* Setas com cor própria: o azul e o vinho do papel somem no céu escuro,
        e o `marker` de `Seta` só conhece esses tons. */}
    <g strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M${sat.x} ${sat.y}H${sat.x + 12 + v * 7}m-8 -6l8 6-8 6`} stroke="#6fd0e0" />
      <path d={`M${sat.x} ${sat.y + 10}V${sat.y + 34}m-6 -8l6 8 6-8`} stroke="#ff7b7b" />
    </g>
    <g>
      {[-1, 1].map(lado => <g key={lado}>
        <rect x={lado < 0 ? sat.x - 25 : sat.x + 9} y={sat.y - 5} width="16" height="10" fill="#3a6fb0" stroke="#0d1210" strokeWidth="1" />
        <path d={`M${lado < 0 ? sat.x - 17 : sat.x + 17} ${sat.y - 5}v10M${lado < 0 ? sat.x - 25 : sat.x + 9} ${sat.y}h16`} stroke="#bcd7f5" strokeWidth=".8" />
      </g>)}
      <circle cx={sat.x} cy={sat.y} r="8" fill={kit.ouro} stroke="#0d1210" strokeWidth="1.2" />
    </g>
    <Nota de={[sat.x + 14 + v * 7, sat.y - 2]} em={[304, 42]} ancora="end" tom="ciano" texto="v: para o lado" curva={-1} />
    <Nota de={[sat.x - 4, sat.y + 28]} em={[18, 104]} ancora="start" tom="vermelho" texto={['gravidade:', 'para o centro']} curva={1} />
    <Pilula x={14} y={258} w={292} tom={traj.caiu ? 'laranja' : 'roxo'}>{leitura}</Pilula>
  </g>;
}

// ---------------------------------------------------------------------------
// Energia: trabalho como área e potência como inclinação, o mesmo princípio
// que o `ThermoBoard` usa para o trabalho do gás.
export function EnergiaCena({ id, v }: { id: EnergyId; v: number }) {
  if (id === 'impulso') {
    const x0 = 50, y0 = 220, sx = 70, sy = 14;
    return <g data-phys="impulso"><Pontas />
      <rect x={x0} y={y0 - v * sy} width={2 * sx} height={v * sy} fill={`color-mix(in srgb, ${accent} 25%, transparent)`} stroke={accent} strokeWidth="2" />
      <Eixos x0={x0} y0={y0} w={200} h={170} rx="t (s)" ry="F (N)" />
      <path d={`M${x0 + 2 * sx} ${y0}v6`} stroke={ink} strokeWidth="1.5" /><Rotulo x={x0 + 2 * sx} y={y0 + 18}>2 s</Rotulo>
      {v > 0 && <Rotulo x={x0 + sx} y={y0 - (v * sy) / 2 + 4} cor={accent} peso={700}>I = {2 * v} N·s</Rotulo>}
      <Rotulo x={20} y={24} ancora="start" cor={accent} peso={700}>impulso = área sob F × t = Δp</Rotulo>
      <Rotulo x={20} y={40} ancora="start">força menor por mais tempo pode dar o mesmo efeito</Rotulo>
      <Rotulo x={160} y={276}>F = {v} N durante 2 s</Rotulo>
    </g>;
  }
  if (id === 'momento') {
    // A (2 kg, v) encontra B parado e seguem juntos: as setas de p mudam de
    // corpo, a soma não muda. B de 2 kg é a escolha do modelo, não do resumo.
    const p = 2 * v;
    const linha = (y: number, rotulo: string, corpos: React.ReactNode, setas: React.ReactNode) => <g>
      <Rotulo x={20} y={y - 40} ancora="start" cor={ink} peso={700}>{rotulo}</Rotulo>
      <path d={`M20 ${y + 22}H300`} stroke={ink} strokeWidth="2" />
      {corpos}{setas}
    </g>;
    return <g data-phys="momento"><Pontas />
      {linha(90, 'antes', <><Bloco x={110} y={72} w={40} h={40} rotulo="A" /><Bloco x={190} y={72} w={40} h={40} rotulo="B" /></>,
        <Seta x1={130} y1={64} x2={130 + p * 7} y2={64} cor={accent} />)}
      {linha(200, 'depois (grudados)', <><Bloco x={120} y={182} w={40} h={40} rotulo="A" /><Bloco x={160} y={182} w={40} h={40} rotulo="B" /></>,
        <Seta x1={160} y1={174} x2={160 + p * 7} y2={174} cor={accent} />)}
      <Rotulo x={300} y={50} ancora="end" cor={accent} peso={700}>p = {p} kg·m/s</Rotulo>
      <Rotulo x={300} y={160} ancora="end" cor={accent} peso={700}>p = {p} kg·m/s</Rotulo>
      <Rotulo x={160} y={262} cor={ink} peso={700}>forças internas trocam momento entre A e B</Rotulo>
      <Rotulo x={160} y={280}>o total não muda: v final = {f(v / 2)} m/s</Rotulo>
    </g>;
  }
  if (id === 'trabalho') {
    const x0 = 60, y0 = 190, sx = 36, sy = 9;
    const pos = v >= 0;
    return <g data-phys="trabalho"><Pontas />
      <Chao y={80} x1={40} x2={290} />
      <Bloco x={50} y={48} w={40} h={32} />
      <Bloco x={50 + 5 * sx} y={48} w={40} h={32} />
      <Seta x1={70} y1={96} x2={70 + 5 * sx} y2={96} cor={ink} largura={2} />
      <Rotulo x={70 + 2.5 * sx} y={112} cor={ink}>d = 5 m</Rotulo>
      <Seta x1={90 + 5 * sx} y1={64} x2={90 + 5 * sx + v * 5} y2={64} cor={accent} />
      <rect x={x0} y={pos ? y0 - v * sy : y0} width={5 * sx} height={Math.abs(v) * sy} fill={`color-mix(in srgb, ${pos ? accent : blue} 25%, transparent)`} stroke={pos ? accent : blue} strokeWidth="2" />
      <Eixos x0={x0} y0={y0} w={215} h={80} rx="d (m)" ry="F (N)" />
      <path d={`M${x0} ${y0 + 45}V${y0}`} stroke={ink} strokeWidth="1.5" />
      <Rotulo x={160} y={262} cor={pos ? accent : blue} peso={700}>{v === 0 ? 'sem força na direção do movimento: W = 0' : `W = F · d = ${5 * v} J${pos ? '' : ' (força contra o deslocamento)'}`}</Rotulo>
      <Rotulo x={160} y={280}>trabalho = área sob F × d</Rotulo>
    </g>;
  }
  if (id === 'cinetica') {
    const x0 = 50, y0 = 230, sx = 28, sy = 2.6;
    const curva = Array.from({ length: 33 }, (_, k) => { const u = k / 4; return `${(x0 + u * sx).toFixed(1)} ${(y0 - u * u * sy).toFixed(1)}`; }).join('L');
    const dobro = Math.min(8, 2 * v);
    return <g data-phys="cinetica"><Pontas />
      <path d={`M${curva}`} fill="none" stroke={accent} strokeWidth="2.5" />
      <Eixos x0={x0} y0={y0} w={250} h={172} rx="v (m/s)" ry="Ec (J)" />
      {v > 0 && v <= 4 && <><circle cx={x0 + dobro * sx} cy={y0 - dobro * dobro * sy} r="5" fill={paper} stroke={accent} strokeWidth="2" /><Rotulo x={x0 + dobro * sx - 8} y={y0 - dobro * dobro * sy + 4} ancora="end">2v: {dobro * dobro} J</Rotulo></>}
      <path d={`M${x0 + v * sx} ${y0}V${y0 - v * v * sy}H${x0}`} stroke={dim} strokeWidth="1.2" strokeDasharray="4 3" fill="none" />
      <circle cx={x0 + v * sx} cy={y0 - v * v * sy} r="6" fill={accent} />
      <Rotulo x={20} y={24} ancora="start" cor={accent} peso={700}>m = 2 kg, v = {v} m/s → Ec = {v * v} J</Rotulo>
      <Rotulo x={20} y={40} ancora="start">{v > 0 && v <= 4 ? `dobrar v (para ${dobro} m/s) quadruplica: ${dobro * dobro} J` : 'Ec cresce com o quadrado da velocidade'}</Rotulo>
    </g>;
  }
  // Potência: o mesmo trabalho de 120 J em tempos diferentes. No gráfico W × t
  // a reta chega ao mesmo topo; a inclinação é a potência.
  const x0 = 50, y0 = 230, sx = 20, sy = 1.4;
  return <g data-phys="potencia"><Pontas />
    <path d={`M${x0} ${y0 - 120 * sy}H${x0 + 12 * sx}`} stroke={dim} strokeWidth="1" strokeDasharray="4 3" />
    <Rotulo x={x0 + 12 * sx} y={y0 - 120 * sy - 6} ancora="end">120 J</Rotulo>
    {[2, 12].filter((t) => t !== v).map((t) => <path key={t} d={`M${x0} ${y0}L${x0 + t * sx} ${y0 - 120 * sy}`} stroke={dim} strokeWidth="1.2" opacity=".5" />)}
    <path d={`M${x0} ${y0}L${x0 + v * sx} ${y0 - 120 * sy}`} stroke={accent} strokeWidth="3" />
    <circle cx={x0 + v * sx} cy={y0 - 120 * sy} r="5" fill={accent} />
    <Eixos x0={x0} y0={y0} w={265} h={172} rx="t (s)" ry="W (J)" />
    <Rotulo x={20} y={24} ancora="start" cor={accent} peso={700}>P = 120 J / {v} s = {f(120 / v)} W</Rotulo>
    <Rotulo x={20} y={40} ancora="start">mesmo trabalho, menos tempo: mais inclinada</Rotulo>
    <Rotulo x={160} y={284}>a inclinação de W × t é a potência</Rotulo>
  </g>;
}
