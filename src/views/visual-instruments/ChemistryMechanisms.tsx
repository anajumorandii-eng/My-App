import React from 'react';
import { motion } from 'motion/react';
import { gasPressure, limitingProduct, molarAmount, weakAcidIonized, type ChemistryId } from '../../lib/chemistryInstrumentLab';

// Dez capítulos do instrumento de Química caíam em três desenhos
// compartilhados: a mesma caixa de 12 bolinhas paradas (gás ideal, lei dos
// gases, mol), duas caixas de bolinhas que ganhavam opacidade (balanceamento,
// estequiometria, combustão) e dois círculos "reagentes/produtos" (ésteres,
// biodiesel, quociente, ácido fraco). Os dados de cada configuração já eram do
// capítulo; o desenho não. Aqui cada um desenha o seu objeto, e todo número
// desenhado sai da mesma conta que produz a leitura ao lado.

type Props = { value: number; t: { duration?: number } };
const ink = 'var(--vs-ink)';
const dim = 'var(--vs-ink-muted)';
const red = 'var(--vs-burgundy)';
const blue = 'var(--vs-blue)';
const f = (v: number, d = 2) => Number(v.toFixed(d)).toLocaleString('pt-BR');

// Átomos em escala de desenho: H pequeno e claro, O vinho, C escuro.
const H = (x: number, y: number, k: string | number, o = 1) => <circle key={`h${k}`} cx={x} cy={y} r="4" fill="var(--vs-paper-strong)" stroke={ink} strokeWidth="1.2" opacity={o} />;
const O = (x: number, y: number, k: string | number, o = 1) => <circle key={`o${k}`} cx={x} cy={y} r="6" fill={red} opacity={o} />;
const C = (x: number, y: number, k: string | number, o = 1) => <circle key={`c${k}`} cx={x} cy={y} r="6.5" fill={ink} opacity={o} />;
const H2 = (x: number, y: number, k: number, o = 1) => <g key={`H2${k}`}>{H(x - 4, y, 'a', o)}{H(x + 4, y, 'b', o)}</g>;
const O2 = (x: number, y: number, k: number, o = 1) => <g key={`O2${k}`}>{O(x - 5, y, 'a', o)}{O(x + 5, y, 'b', o)}</g>;
const H2O = (x: number, y: number, k: number, o = 1) => <g key={`H2O${k}`}>{H(x - 8, y + 5, 'a', o)}{H(x + 8, y + 5, 'b', o)}{O(x, y, 'c', o)}</g>;
const CO2 = (x: number, y: number, k: number, o = 1) => <g key={`CO2${k}`}>{O(x - 12, y, 'a', o)}{C(x, y, 'b', o)}{O(x + 12, y, 'c', o)}</g>;
const CH4 = (x: number, y: number, o = 1) => <g>{[[-8, -8], [8, -8], [-8, 8], [8, 8]].map(([dx, dy], i) => H(x + dx, y + dy, i, o))}{C(x, y, 'c', o)}</g>;
const grade = (i: number, x0: number, y0: number, cols: number, dx: number, dy: number) => [x0 + (i % cols) * dx, y0 + Math.floor(i / cols) * dy] as const;

const Titulo = ({ x, texto }: { x: number; texto: string }) => <text x={x} y="30" textAnchor="middle" fill={dim} fontSize="11" fontWeight="700">{texto}</text>;
const Seta = ({ x, y, dupla = false }: { x: number; y: number; dupla?: boolean }) => dupla
  ? <g stroke={red} strokeWidth="2.5" fill="none"><path d={`M${x} ${y - 4}h22m-6-5 6 5`} /><path d={`M${x + 22} ${y + 4}h-22m6 5-6-5`} /></g>
  : <path d={`M${x} ${y}h22m-7-6 7 6-7 6`} stroke={red} strokeWidth="2.5" fill="none" />;

// --- Balanceamento: 2 H₂ + O₂ → 2 H₂O, desenhado lote a lote ---------------
function Balanceamento({ value: v }: Props) {
  return <g data-detail="balanced-molecules">
    <Titulo x={80} texto="reagentes" /><Titulo x={248} texto="produtos" />
    {Array.from({ length: 2 * v }, (_, i) => { const [x, y] = grade(i, 30, 58, 4, 30, 24); return H2(x, y, i); })}
    {Array.from({ length: v }, (_, i) => { const [x, y] = grade(i, 38, 150, 3, 38, 26); return O2(x, y, i); })}
    <Seta x={150} y={120} />
    {Array.from({ length: 2 * v }, (_, i) => { const [x, y] = grade(i, 200, 58, 4, 32, 30); return H2O(x, y, i); })}
    <text x="160" y="226" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">H: {4 * v} → {4 * v} · O: {2 * v} → {2 * v}</text>
    <text x="160" y="248" textAnchor="middle" fill={dim} fontSize="11">{2 * v} H₂ + {v} O₂ → {2 * v} H₂O · os índices nunca mudam</text>
  </g>;
}

// --- Reagente limitante: O₂ fixo em 2 mol, H₂ na mão da estudante ----------
function Limitante({ value: v }: Props) {
  const agua = limitingProduct(v, 2);
  const h2Usado = agua;
  const o2Usado = agua / 2;
  const limita = v < 4 ? 'o H₂ limita' : v > 4 ? 'o O₂ limita' : 'proporção exata 2 : 1';
  return <g data-detail="limiting-reagent">
    <Titulo x={80} texto="reagentes" /><Titulo x={248} texto="produtos" />
    {Array.from({ length: v }, (_, i) => { const [x, y] = grade(i, 30, 58, 4, 30, 24); return H2(x, y, i, i < h2Usado ? 1 : 0.28); })}
    {[0, 1].map((i) => O2(52 + i * 50, 160, i, i < Math.floor(o2Usado) ? 1 : i < o2Usado ? 0.6 : 0.28))}
    <text x="78" y="190" textAnchor="middle" fill={dim} fontSize="10">O₂ disponível: 2 mol</text>
    <Seta x={150} y={120} />
    {Array.from({ length: agua }, (_, i) => { const [x, y] = grade(i, 208, 70, 2, 44, 34); return H2O(x, y, i); })}
    <text x="160" y="226" textAnchor="middle" fill={red} fontSize="13" fontWeight="700">{limita}</text>
    <text x="160" y="248" textAnchor="middle" fill={dim} fontSize="11">apagadas: moléculas que sobram sem par</text>
  </g>;
}

// --- Combustão do metano: as duas vagas de O₂ que a equação pede -----------
function Combustao({ value: v }: Props) {
  const completa = v >= 2;
  return <g data-detail="methane-combustion">
    <Titulo x={80} texto="1 CH₄ pede 2 O₂" /><Titulo x={248} texto="produtos" />
    {CH4(34, 118)}
    {[0, 1].map((i) => {
      const cheio = Math.min(1, Math.max(0, v - i));
      return <g key={i}>
        <rect x={74} y={86 + i * 46} width="54" height="30" rx="8" fill="none" stroke={cheio >= 1 ? blue : red} strokeWidth="1.5" strokeDasharray={cheio >= 1 ? undefined : '4 3'} />
        {cheio > 0 && O2(101, 101 + i * 46, i, cheio >= 1 ? 1 : 0.5)}
        {cheio < 1 && <text x="136" y={106 + i * 46} fill={red} fontSize="10" fontWeight="700">falta</text>}
      </g>;
    })}
    {v > 2 && <text x="101" y="200" textAnchor="middle" fill={dim} fontSize="10">+ {f(v - 2, 1)} O₂ em excesso</text>}
    <Seta x={160} y={120} />
    <g opacity={completa ? 1 : 0.25}>{CO2(236, 90, 0)}{H2O(218, 140, 1)}{H2O(258, 140, 2)}</g>
    {!completa && <text x="238" y="186" textAnchor="middle" fill={red} fontSize="12" fontWeight="700">O₂ insuficiente</text>}
    <text x="160" y="244" textAnchor="middle" fill={ink} fontSize="12">CH₄ + 2 O₂ → CO₂ + 2 H₂O</text>
  </g>;
}

// --- Mol: massa ÷ massa molar, e cada caixa é um mol de moléculas ---------
function Mol({ value: v }: Props) {
  const mols = molarAmount(v, 18);
  return <g data-detail="mass-to-mole">
    <path d="M22 78v96q0 12 12 12h52q12 0 12-12V78" fill="none" stroke={ink} strokeWidth="2.5" />
    <path d="M22 118h76" stroke={blue} strokeWidth="1.5" strokeDasharray="5 3" />
    <text x="60" y="160" textAnchor="middle" fill={ink} fontSize="14" fontWeight="800">{v} g</text>
    <text x="60" y="60" textAnchor="middle" fill={dim} fontSize="11">água</text>
    <text x="130" y="108" textAnchor="middle" fill={red} fontSize="11" fontWeight="700">÷ 18 g/mol</text>
    <Seta x={118} y={124} />
    {Array.from({ length: Math.round(mols) }, (_, i) => {
      const [x, y] = grade(i, 170, 70, 5, 29, 46);
      return <g key={i}><rect x={x} y={y} width="26" height="38" rx="4" fill="none" stroke={red} strokeWidth="1.5" />{H2O(x + 13, y + 14, i)}<text x={x + 13} y={y + 34} textAnchor="middle" fill={ink} fontSize="8">1 mol</text></g>;
    })}
    <text x="160" y="226" textAnchor="middle" fill={ink} fontSize="13" fontWeight="700">{f(mols)} mol = {f(mols * 6.022)} × 10²³ moléculas</text>
    <text x="160" y="248" textAnchor="middle" fill={dim} fontSize="11">cada caixa: 6,022 × 10²³ moléculas</text>
  </g>;
}

// --- Gases: a seta de cada partícula cresce com √T ------------------------
// A energia cinética média é proporcional a T; a velocidade, a √T. As
// posições são fixas de propósito: o que muda com a temperatura é a seta.
const PARTICULAS = [[48, 80, 20], [96, 70, 150], [150, 92, 250], [196, 76, 80], [62, 132, 300], [118, 126, 40], [172, 140, 200], [214, 122, 120], [44, 186, 60], [100, 178, 330], [150, 196, 170], [204, 184, 280]];
// A seta fica presa dentro do recipiente: solta, ela atravessava a parede e
// parecia partícula escapando, o oposto do que o desenho explica.
function setas(escalaX: number, T: number, t: Props['t'], caixa: { x0: number; x1: number; y0: number; y1: number }) {
  const L = 6 + 20 * Math.sqrt(T / 600);
  const prende = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  return PARTICULAS.map(([x0, y, ang], i) => {
    const x = caixa.x0 + 6 + (x0 - 30) * escalaX;
    if (x > caixa.x1 - 8) return null;
    const a = (ang * Math.PI) / 180;
    return <g key={i}>
      <circle cx={x} cy={y} r="6" fill={red} />
      <motion.line x1={x} y1={y} initial={false} animate={{ x2: prende(x + L * Math.cos(a), caixa.x0 + 3, caixa.x1 - 3), y2: prende(y - L * Math.sin(a), caixa.y0 + 3, caixa.y1 - 3) }} transition={t} stroke={ink} strokeWidth="1.5" />
    </g>;
  });
}

function GasRigido({ value: T, t }: Props) {
  const P = gasPressure(1, T, 10);
  const ang = Math.PI * (1 - Math.min(P, 5) / 5);
  return <g data-detail="rigid-gas">
    <rect x="24" y="52" width="210" height="166" rx="10" fill="none" stroke={ink} strokeWidth="3" />
    {setas(1, T, t, { x0: 24, x1: 234, y0: 52, y1: 218 })}
    <path d="M254 118a36 36 0 0 1 72 0" transform="translate(-10 0)" fill="none" stroke={ink} strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5].map((k) => { const a = Math.PI * (1 - k / 5); return <line key={k} x1={280 + 30 * Math.cos(a)} y1={118 - 30 * Math.sin(a)} x2={280 + 36 * Math.cos(a)} y2={118 - 36 * Math.sin(a)} stroke={dim} strokeWidth="1.5" />; })}
    <motion.line x1="280" y1="118" initial={false} animate={{ x2: 280 + 28 * Math.cos(ang), y2: 118 - 28 * Math.sin(ang) }} transition={t} stroke={red} strokeWidth="3" strokeLinecap="round" />
    <text x="280" y="140" textAnchor="middle" fill={ink} fontSize="12" fontWeight="800">{f(P)} atm</text>
    <text x="280" y="156" textAnchor="middle" fill={dim} fontSize="10">manômetro</text>
    <text x="129" y="240" textAnchor="middle" fill={dim} fontSize="11">V = 10 L fixo · setas ∝ √T</text>
  </g>;
}

function Seringa({ value: T, t }: Props) {
  const V = (2 * T) / 300;
  // 4 L (600 K) termina em x = 240, e a haste de 40 ainda cabe no quadro.
  const px = 24 + (V / 4) * 216;
  return <g data-detail="gas-syringe">
    <path d="M24 60H276M24 204H276M24 60V204" fill="none" stroke={ink} strokeWidth="3" />
    {[1, 2, 3, 4].map((k) => <g key={k}><line x1={24 + k * 54} y1="204" x2={24 + k * 54} y2="214" stroke={dim} strokeWidth="1.5" /><text x={24 + k * 54} y="228" textAnchor="middle" fill={dim} fontSize="10">{k} L</text></g>)}
    {setas(Math.max(0.2, (px - 36) / 210), T, t, { x0: 24, x1: px - 5, y0: 60, y1: 204 })}
    <motion.g initial={false} animate={{ x: px }} transition={t}>
      <rect x="-5" y="62" width="10" height="140" fill={dim} />
      <rect x="5" y="126" width="40" height="12" fill={dim} opacity=".6" />
    </motion.g>
    <text x="160" y="46" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">V = {f(V)} L · pressão constante</text>
    <text x="160" y="252" textAnchor="middle" fill={dim} fontSize="11">o êmbolo recua até a pressão voltar a igualar a externa</text>
  </g>;
}

// --- Ésteres: cada álcool encontra um ácido; o que sobra fica apagado ------
const Caixa = ({ x, y, texto, cor, o = 1 }: { x: number; y: number; texto: string; cor: string; o?: number }) => <g opacity={o}>
  <rect x={x} y={y} width="62" height="22" rx="6" fill="var(--vs-paper-strong)" stroke={cor} strokeWidth="1.5" />
  <text x={x + 31} y={y + 15} textAnchor="middle" fill={ink} fontSize="9" fontWeight="700" fontFamily="ui-monospace, monospace">{texto}</text>
</g>;

function Esterificacao({ value: v }: Props) {
  const ester = Math.min(v, 3);
  return <g data-detail="esterification">
    <Titulo x={80} texto="ácido + álcool" /><Titulo x={248} texto="éster + água" />
    {[0, 1, 2].map((i) => <Caixa key={`a${i}`} x={10} y={48 + i * 32} texto="R–COOH" cor={red} o={i < ester ? 1 : 0.3} />)}
    {Array.from({ length: v }, (_, i) => <Caixa key={`b${i}`} x={82} y={48 + i * 32} texto="R′–OH" cor={blue} o={i < ester ? 1 : 0.3} />)}
    <Seta x={150} y={96} dupla />
    {Array.from({ length: ester }, (_, i) => <g key={`e${i}`}><Caixa x={180} y={48 + i * 32} texto="R–COO–R′" cor={red} />{H2O(274, 59 + i * 32, i)}</g>)}
    <text x="160" y="228" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">teto: {ester} mol de éster (1 : 1)</text>
    <text x="160" y="248" textAnchor="middle" fill={dim} fontSize="11">⇌ reversível: o equilíbrio pode parar antes do teto</text>
  </g>;
}

// --- Biodiesel: cada álcool solta uma cadeia; três soltas liberam o glicerol
function Biodiesel({ value: v }: Props) {
  const esteres = Math.min(v, 6);
  return <g data-detail="transesterification">
    <Titulo x={80} texto="triglicerídeos (2)" /><Titulo x={250} texto="ésteres (biodiesel)" />
    {[0, 1].map((tg) => {
      const y0 = 64 + tg * 88;
      const soltas = Math.max(0, Math.min(3, esteres - tg * 3));
      return <g key={tg}>
        <line x1="28" y1={y0} x2="28" y2={y0 + 48} stroke={soltas === 3 ? red : ink} strokeWidth="4" strokeLinecap="round" />
        {soltas === 3 && <text x="28" y={y0 + 66} textAnchor="middle" fill={red} fontSize="10" fontWeight="700">glicerol</text>}
        {[0, 1, 2].map((c) => {
          const y = y0 + c * 24;
          const solta = c < soltas;
          return <g key={c}>
            <path d={`M32 ${y}h14l8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6`} fill="none" stroke={ink} strokeWidth="2" opacity={solta ? 0.18 : 1} strokeDasharray={solta ? '3 3' : undefined} />
            {solta && <path d={`M196 ${y}l8-6 8 6 8-6 8 6 8-6 8 6 8-6 8 6h10`} fill="none" stroke={red} strokeWidth="2" />}
            {solta && <text x="292" y={y + 4} fill={blue} fontSize="9" fontWeight="700">–R′</text>}
          </g>;
        })}
      </g>;
    })}
    <Seta x={146} y={128} dupla />
    <text x="160" y="236" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">{v} R′–OH → {esteres} ésteres{v > 6 ? ` · sobram ${v - 6} álcool` : ''}</text>
    <text x="160" y="254" textAnchor="middle" fill={dim} fontSize="11">3 álcoois por triglicerídeo: três cadeias, um glicerol</text>
  </g>;
}

// --- Quociente: onde Q está em relação a K decide o sentido ---------------
function Quociente({ value: Q, t }: Props) {
  const x = (q: number) => 30 + (q / 4) * 260;
  const sentido = Math.abs(Q - 1) < 0.001 ? 'em equilíbrio' : Q < 1 ? 'avança para os produtos →' : '← favorece os reagentes';
  return <g data-detail="reaction-quotient">
    <text x="90" y="40" textAnchor="middle" fill={dim} fontSize="11" fontWeight="700">[reagentes]</text>
    <text x="230" y="40" textAnchor="middle" fill={dim} fontSize="11" fontWeight="700">[produtos]</text>
    <rect x="70" y="60" width="40" height="80" fill="none" stroke={ink} strokeWidth="2" />
    <rect x="70" y="100" width="40" height="40" fill={blue} opacity=".7" />
    <rect x="210" y="60" width="40" height="80" fill="none" stroke={ink} strokeWidth="2" />
    <motion.rect x="210" width="40" fill={red} opacity=".7" initial={false} animate={{ y: 140 - Math.min(80, 40 * Q), height: Math.min(80, 40 * Q) }} transition={t} />
    <text x="160" y="104" textAnchor="middle" fill={ink} fontSize="14" fontWeight="800">Q = {f(Q, 1)}</text>
    <line x1="30" y1="190" x2="290" y2="190" stroke={ink} strokeWidth="2" />
    {[0, 1, 2, 3, 4].map((k) => <g key={k}><line x1={x(k)} y1="184" x2={x(k)} y2="196" stroke={dim} /><text x={x(k)} y="212" textAnchor="middle" fill={dim} fontSize="10">{k}</text></g>)}
    <line x1={x(1)} y1="170" x2={x(1)} y2="198" stroke={blue} strokeWidth="3" /><text x={x(1)} y="164" textAnchor="middle" fill={blue} fontSize="11" fontWeight="800">K = 1</text>
    <motion.circle cy="190" r="7" fill={red} initial={false} animate={{ cx: x(Q) }} transition={t} />
    <text x="160" y="244" textAnchor="middle" fill={red} fontSize="13" fontWeight="700">{sentido}</text>
  </g>;
}

// --- Ácido fraco: diluir baixa [H⁺] e, ao mesmo tempo, sobe a fração ionizada
function AcidoFraco({ value: c, t }: Props) {
  const ka = 1.8e-5;
  const h = weakAcidIonized(c, ka);
  const alfa = h / c;
  const pH = -Math.log10(h);
  const px = (p: number) => 30 + (p / 7) * 260;
  return <g data-detail="weak-acid-dilution">
    <text x="30" y="40" fill={dim} fontSize="11" fontWeight="700">[H⁺] (× 10⁻³ mol/L)</text>
    <rect x="30" y="48" width="260" height="16" rx="3" fill="none" stroke={ink} strokeWidth="1.2" />
    <motion.rect x="30" y="48" height="16" rx="3" fill={red} initial={false} animate={{ width: Math.min(260, (h / 2e-3) * 260) }} transition={t} />
    <text x="290" y="80" textAnchor="end" fill={ink} fontSize="11" fontWeight="700">{f(h * 1000)}</text>
    <text x="30" y="104" fill={dim} fontSize="11" fontWeight="700">fração ionizada α</text>
    <rect x="30" y="112" width="260" height="16" rx="3" fill="none" stroke={ink} strokeWidth="1.2" />
    <motion.rect x="30" y="112" height="16" rx="3" fill={blue} initial={false} animate={{ width: Math.min(260, (alfa / 0.05) * 260) }} transition={t} />
    <text x="290" y="144" textAnchor="end" fill={ink} fontSize="11" fontWeight="700">{f(alfa * 100)} %</text>
    <line x1="30" y1="186" x2="290" y2="186" stroke={ink} strokeWidth="2" />
    {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => <g key={p}><line x1={px(p)} y1="180" x2={px(p)} y2="192" stroke={dim} /><text x={px(p)} y="206" textAnchor="middle" fill={dim} fontSize="10">{p}</text></g>)}
    <motion.circle cy="186" r="7" fill={red} initial={false} animate={{ cx: px(pH) }} transition={t} />
    <text x="30" y="172" fill={dim} fontSize="10">pH</text>
    <text x="160" y="240" textAnchor="middle" fill={ink} fontSize="12" fontWeight="700">diluir: [H⁺] cai, α sobe, o pH sobe</text>
  </g>;
}

export const CHEMISTRY_MECHANISMS: Partial<Record<ChemistryId, React.ComponentType<Props>>> = {
  balancing: Balanceamento,
  stoichiometry: Limitante,
  oxidation: Combustao,
  mole: Mol,
  'gas-state': GasRigido,
  'gas-law': Seringa,
  esterification: Esterificacao,
  biodiesel: Biodiesel,
  'equilibrium-shift': Quociente,
  'ionic-equilibrium': AcidoFraco,
};
