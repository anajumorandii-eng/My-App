import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

// Lote E da auditoria 39: seis instrumentos de Biologia desenhavam formas
// abstratas (três círculos ligados, um retângulo com duas ondas, uma elipse)
// que não diziam de que objeto se tratava. Cada cena aqui desenha o objeto do
// capítulo e move, com o cursor, a peça que o mecanismo move. Todo rótulo sai
// do resumo do capítulo.

const ink = 'var(--vs-ink)';
const dim = 'var(--vs-dim)';
const accent = 'var(--vs-burgundy)';
const blue = 'var(--vs-blue)';
const paper = 'var(--vs-paper-strong)';
type Props = { value: number; ratio: number };
const Rotulo = ({ x, y, children, cor = ink, ancora = 'middle', peso }: { x: number; y: number; children: React.ReactNode; cor?: string; ancora?: 'start' | 'middle' | 'end'; peso?: number }) =>
  <text x={x} y={y} textAnchor={ancora} fill={cor} fontSize="11" fontWeight={peso}>{children}</text>;
const Ponta = ({ id, cor }: { id: string; cor: string }) => <defs><marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={cor} /></marker></defs>;

/** Osso como traço duplo: contorno escuro e miolo claro, para ler como peça rígida. */
const Osso = ({ d }: { d: string }) => <><path d={d} stroke={ink} strokeWidth="13" strokeLinecap="round" fill="none" /><path d={d} stroke={paper} strokeWidth="8" strokeLinecap="round" fill="none" /></>;

/** Bíceps e tríceps no braço: o cursor é a contração do bíceps. O antebraço gira
 * em torno do cotovelo, o bíceps engrossa e o tríceps afina — músculo só puxa,
 * por isso o movimento inverso precisa do antagonista. */
export function Locomocao({ ratio }: Props) {
  const cotovelo = { x: 96, y: 206 };
  const ang = ((-5 + 80 * ratio) * Math.PI) / 180;
  const ponto = (r: number) => ({ x: cotovelo.x + r * Math.cos(ang), y: cotovelo.y - r * Math.sin(ang) });
  const mao = ponto(150);
  const insercao = ponto(34);
  const barriga = 14 + 22 * ratio;
  const triceps = 16 - 10 * ratio;
  return <g data-bio-system="lever">
    <Rotulo x={312} y={24} ancora="end" cor={accent} peso={700}>bíceps contrai: o tendão</Rotulo>
    <Rotulo x={312} y={38} ancora="end" cor={accent} peso={700}>puxa o antebraço</Rotulo>
    <Rotulo x={312} y={56} ancora="end">tríceps, antagonista, relaxa</Rotulo>
    <path d={`M84 70Q${70 - triceps} 140 88 214`} stroke={blue} strokeWidth={6 + triceps / 2} strokeLinecap="round" fill="none" opacity=".7" />
    <Osso d={`M88 56L${cotovelo.x} ${cotovelo.y}`} />
    <Osso d={`M${cotovelo.x} ${cotovelo.y}L${mao.x.toFixed(1)} ${mao.y.toFixed(1)}`} />
    <path d={`M100 72Q${118 + barriga} 120 106 162Q${104 + barriga * 0.2} 120 100 72Z`} fill={`color-mix(in srgb, ${accent} ${35 + 40 * ratio}%, ${paper})`} stroke={accent} strokeWidth="2" />
    <path d={`M106 162L${insercao.x.toFixed(1)} ${insercao.y.toFixed(1)}`} stroke={ink} strokeWidth="2.5" />
    <circle cx={cotovelo.x} cy={cotovelo.y} r="9" fill={paper} stroke={ink} strokeWidth="2.5" />
    <circle cx={mao.x} cy={mao.y} r="11" fill={paper} stroke={ink} strokeWidth="2.5" />
    <Rotulo x={88} y={240} ancora="end">cotovelo: o eixo</Rotulo>
    <Rotulo x={40} y={140} ancora="end" cor={blue}>tríceps</Rotulo>
    <Rotulo x={160} y={284} cor={ink}>tendão liga músculo a osso</Rotulo>
  </g>;
}

/** Hipófise → TSH → tireoide → T3/T4 ⊣ hipófise. O cursor é o nível de T3/T4
 * no sangue: mais hormônio, mais inibição, menos TSH. */
export function Endocrino({ value, ratio }: Props) {
  const gotas = Math.round(value / 10);
  const estimulo = 1 - ratio;
  return <g data-bio-system="negative-feedback">
    <Ponta id="bm-endo" cor={accent} />
    <ellipse cx="96" cy="62" rx="44" ry="26" fill={paper} stroke={ink} strokeWidth="2.5" />
    <Rotulo x={96} y={66} cor={ink} peso={700}>hipófise</Rotulo>
    <path d="M96 90V176" stroke={accent} strokeWidth={2 + 8 * estimulo} strokeLinecap="round" markerEnd="url(#bm-endo)" opacity={0.3 + 0.7 * estimulo} />
    <Rotulo x={106} y={126} ancora="start" cor={accent} peso={700}>TSH</Rotulo>
    <Rotulo x={106} y={140} ancora="start">estimula</Rotulo>
    <path d="M60 200q14-16 36 0q22-16 36 0q4 26-36 30q-40-4-36-30Z" fill={`color-mix(in srgb, ${accent} 25%, ${paper})`} stroke={ink} strokeWidth="2.5" />
    <Rotulo x={96} y={252} cor={ink} peso={700}>tireoide</Rotulo>
    <rect x="218" y="48" width="30" height="190" rx="12" fill={`color-mix(in srgb, ${blue} 12%, ${paper})`} stroke={blue} strokeWidth="2" />
    <path d="M136 214H218" stroke={blue} strokeWidth="3" />
    {Array.from({ length: gotas }, (_, n) => <circle key={n} cx={227 + (n % 2) * 12} cy={224 - n * 17} r="5" fill={blue} />)}
    <Rotulo x={256} y={150} ancora="start" cor={blue} peso={700}>T3 e T4</Rotulo>
    <Rotulo x={256} y={164} ancora="start">no sangue</Rotulo>
    <path d="M218 62H146" stroke={ink} strokeWidth={1.5 + 4 * ratio} opacity={0.25 + 0.75 * ratio} />
    <path d="M146 50V74" stroke={ink} strokeWidth={1.5 + 4 * ratio} opacity={0.25 + 0.75 * ratio} />
    <Rotulo x={182} y={40} cor={ink}>⊣ inibe</Rotulo>
    <Rotulo x={160} y={284} cor={ink}>mais T3 e T4 → menos TSH</Rotulo>
  </g>;
}

// Os três marcos da escala vêm do resumo: semente seca abaixo de 15%, humano
// adulto entre 60 e 70%, água-viva perto de 98%.
const MARCOS = [{ v: 15, rotulo: 'semente seca (<15%)' }, { v: 65, rotulo: 'humano adulto (60–70%)' }, { v: 98, rotulo: 'água-viva (~98%)' }];

/** Teor de água e metabolismo: a coluna marca o teor, a célula enche até ele e
 * as enzimas trabalham ou param. Abaixo de ~15%, param sem desnaturar. */
export function TeorDeAgua({ value, ratio }: Props) {
  const y = (v: number) => 250 - v * 2;
  const dormente = value < 15;
  const ativas = dormente ? 0 : Math.max(1, Math.round(ratio * 6));
  return <g data-bio-system="water-content">
    <rect x="40" y="50" width="22" height="200" rx="8" fill={paper} stroke={ink} strokeWidth="2" />
    <rect x="42" y={y(value)} width="18" height={value * 2} rx="6" fill={blue} opacity=".55" />
    {MARCOS.map((m) => <g key={m.v}><path d={`M62 ${y(m.v)}h10`} stroke={ink} strokeWidth="1.5" /><Rotulo x={76} y={y(m.v) + 4} ancora="start">{m.rotulo}</Rotulo></g>)}
    <Rotulo x={51} y={272} cor={ink} peso={700}>{value}%</Rotulo>
    <defs><clipPath id="bm-agua-celula"><rect x="212" y="70" width="90" height="150" rx="32" /></clipPath></defs>
    <rect x={212} y={220 - 150 * ratio} width="90" height={150 * ratio} fill={blue} opacity=".22" clipPath="url(#bm-agua-celula)" />
    <rect x="212" y="70" width="90" height="150" rx="32" fill="none" stroke={ink} strokeWidth="2.5" />
    {Array.from({ length: 6 }, (_, n) => {
      const cx = 237 + (n % 2) * 40; const cy = 104 + Math.floor(n / 2) * 42;
      const ativa = n < ativas;
      return <g key={n}><path d={`M${cx - 10} ${cy}a10 10 0 1 1 20 0h-6a4 4 0 0 0-8 0Z`} fill={ativa ? accent : paper} stroke={ativa ? accent : dim} strokeWidth="1.5" />
        {ativa && <circle cx={cx} cy={cy + 6} r="3" fill={blue} />}</g>;
    })}
    <Rotulo x={257} y={244} cor={dormente ? dim : accent} peso={700}>{dormente ? 'enzimas inativas,' : 'em meio aquoso,'}</Rotulo>
    <Rotulo x={257} y={258}>{dormente ? 'não desnaturadas' : `${ativas} de 6 ativas`}</Rotulo>
    <Rotulo x={160} y={290} cor={ink}>mais água → mais atividade metabólica</Rotulo>
  </g>;
}

/** Colar de nucleossomos: o cursor aperta o espaçamento. Com a cromatina frouxa
 * a polimerase alcança o gene e o RNA sai; condensada, o acesso some. */
export function Nucleo({ ratio }: Props) {
  const passo = 34 - 20 * ratio;
  const n = 8;
  const x0 = 160 - (passo * (n - 1)) / 2;
  const xs = Array.from({ length: n }, (_, k) => x0 + k * passo);
  const fio = `M${x0 - 30} 120L${xs[0]} 120${xs.slice(1).map((x, k) => `Q${x - passo / 2} ${k % 2 ? 142 : 98} ${x} 120`).join('')}L${xs[n - 1] + 30} 120`;
  const acesso = 1 - ratio;
  const aberta = ratio < 0.5;
  return <g data-bio-system="chromatin-access">
    <Rotulo x={160} y={30} cor={aberta ? accent : ink} peso={700}>{aberta ? 'eucromatina: frouxa, transcrita' : 'heterocromatina: condensada, inativa'}</Rotulo>
    <path d={fio} stroke={blue} strokeWidth="2.5" fill="none" />
    {xs.map((x, k) => <circle key={k} cx={x} cy={120} r="11" fill={`color-mix(in srgb, ${accent} 30%, ${paper})`} stroke={accent} strokeWidth="2" />)}
    <path d={`M${xs[0]} 106V76`} stroke={dim} strokeWidth="1" />
    <Rotulo x={xs[0]} y={70} ancora="start">histonas + DNA = nucleossomo</Rotulo>
    <motion.g initial={false} animate={{ opacity: 0.15 + 0.85 * acesso }}>
      <ellipse cx="160" cy="178" rx="40" ry="16" fill={paper} stroke={ink} strokeWidth="2" />
      <Rotulo x={160} y={182} cor={ink}>polimerase</Rotulo>
      <path d={`M200 180q14 10 ${Math.max(4, 70 * acesso)} 14`} stroke={accent} strokeWidth="3" fill="none" />
      <Rotulo x={206} y={214} ancora="start" cor={accent}>RNA</Rotulo>
    </motion.g>
    <Rotulo x={160} y={256}>{aberta ? 'a polimerase alcança o gene' : 'DNA enrolado demais: sem acesso'}</Rotulo>
    <Rotulo x={160} y={284} cor={ink}>a sequência de bases não muda</Rotulo>
  </g>;
}

/** PCR: as três etapas de temperatura em volta de um ciclo, e a coluna em
 * escala log2 — cada ciclo dobra, trinta ciclos passam de um bilhão. */
export function Pcr({ value }: Props) {
  const ciclos = Math.round(value);
  // Cada quadro mostra a fita na etapa: separadas; molde com o primer curto;
  // molde com a fita nova inteira.
  const etapas = [
    { x: 56, y: 70, nome: 'desnaturação', temp: '~95 °C', fitas: [[blue, 36, 0], [accent, 36, 16]] },
    { x: 160, y: 70, nome: 'anelamento', temp: '50–65 °C', fitas: [[blue, 36, 0], [ink, 10, 7]] },
    { x: 110, y: 170, nome: 'extensão', temp: '72 °C', fitas: [[blue, 36, 0], [accent, 36, 7]] },
  ] as const;
  const altura = (ciclos / 30) * 200;
  return <g data-bio-system="pcr-cycle">
    <Ponta id="bm-pcr" cor={accent} />
    {etapas.map((e) => <g key={e.nome}>
      <rect x={e.x - 46} y={e.y - 26} width="92" height="72" rx="12" fill={paper} stroke={ink} strokeWidth="2" />
      <Rotulo x={e.x} y={e.y - 10} cor={ink} peso={700}>{e.nome}</Rotulo>
      <Rotulo x={e.x} y={e.y + 4}>{e.temp}</Rotulo>
      {e.fitas.map(([cor, largura, dy], k) => <path key={k} d={`M${e.x - 18} ${e.y + 22 + dy}h${largura}`} stroke={cor} strokeWidth={k && largura < 20 ? 4 : 3} />)}
    </g>)}
    <path d="M103 80h8" stroke={accent} strokeWidth="2.5" markerEnd="url(#bm-pcr)" />
    <path d="M164 118q-2 16-16 26" stroke={accent} strokeWidth="2.5" fill="none" markerEnd="url(#bm-pcr)" />
    <path d="M66 184q-24-20-14-62" stroke={accent} strokeWidth="2.5" fill="none" markerEnd="url(#bm-pcr)" />
    <Rotulo x={110} y={252} cor={accent} peso={700}>{ciclos} ciclos · cada um dobra</Rotulo>
    <rect x="276" y="40" width="30" height="200" rx="6" fill={paper} stroke={ink} strokeWidth="2" />
    <motion.rect x="278" width="26" rx="4" fill={accent} opacity=".7" initial={false} animate={{ y: 240 - altura, height: altura }} />
    {[[0, '1'], [10, '~mil'], [20, '~milhão'], [30, '~bilhão']].map(([c, t]) => <g key={c}><path d={`M268 ${240 - (Number(c) / 30) * 200}h8`} stroke={ink} strokeWidth="1.5" /><Rotulo x={264} y={244 - (Number(c) / 30) * 200} ancora="end">{t}</Rotulo></g>)}
    <Rotulo x={291} y={260}>cópias</Rotulo>
    <Rotulo x={160} y={288} cor={ink}>primers delimitam a região copiada</Rotulo>
  </g>;
}

// O resumo põe um método em cada etapa, menos na implantação — lá ele fala do
// HCG que o teste detecta, e é isso que a cena mostra, sem inventar método.
const ETAPAS_REPRO = [
  ['pílula: sem pico de LH,', 'não há ovulação'],
  ['barreira e laqueadura impedem o encontro;', 'DIU de cobre: ambiente hostil ao espermatozoide'],
  ['o embrião implantado produz HCG,', 'que o teste de gravidez detecta'],
];

/** Útero, tubas e ovários: o cursor acende o lugar de cada etapa. */
export function Reproducao({ value }: Props) {
  const etapa = Math.max(0, Math.min(2, Math.round(value)));
  const aceso = (k: number) => ({ opacity: k === etapa ? 1 : 0.82 });
  return <g data-bio-system="reproductive-tract">
    <path d="M130 90q30 20 60 0v60q-6 40-30 44q-24-4-30-44Z" fill={paper} stroke={ink} strokeWidth="2.5" />
    <path d="M160 194v34" stroke={ink} strokeWidth="2.5" />
    <path d="M130 94q-30-10-52-4q-12 6-16 20M190 94q30-10 52-4q12 6 16 20" stroke={ink} strokeWidth="2.5" fill="none" />
    <ellipse cx="64" cy="128" rx="18" ry="12" fill={paper} stroke={ink} strokeWidth="2.5" />
    <ellipse cx="256" cy="128" rx="18" ry="12" fill={paper} stroke={ink} strokeWidth="2.5" />
    <motion.g initial={false} animate={aceso(0)}><circle cx="64" cy="128" r="7" fill={accent} /><path d="M72 118q6-8 10-18" stroke={accent} strokeWidth="2" fill="none" /><Rotulo x={64} y={160} cor={accent} peso={700}>ovário</Rotulo></motion.g>
    <motion.g initial={false} animate={aceso(1)}><circle cx="222" cy="86" r="6" fill={accent} />{[0, 1, 2].map((k) => <path key={k} d={`M${196 + k * 6} ${96 + k * 3}q4-4 8 0`} stroke={blue} strokeWidth="2" fill="none" />)}<Rotulo x={232} y={66} cor={accent} peso={700}>tuba uterina</Rotulo></motion.g>
    <motion.g initial={false} animate={aceso(2)}><path d="M142 104q18 8 36 0" stroke={accent} strokeWidth="5" fill="none" /><circle cx="160" cy="112" r="7" fill={accent} /><Rotulo x={198} y={176} ancora="start" cor={accent} peso={700}>endométrio</Rotulo></motion.g>
    <Rotulo x={160} y={252} cor={ink} peso={700}>{ETAPAS_REPRO[etapa][0]}</Rotulo>
    <Rotulo x={160} y={268} cor={ink} peso={700}>{ETAPAS_REPRO[etapa][1]}</Rotulo>
    <Rotulo x={160} y={290}>ovulação → fecundação → implantação</Rotulo>
  </g>;
}

// ---------------------------------------------------------------------------
// Segunda leva (27/09): catorze instrumentos que a auditoria 39 deu como
// aceitáveis, mas que na tela eram uma forma solta — duas ovais para os
// procariotos, uma elipse para o plano corporal, o mesmo besouro para insetos
// e aracnídeos, um "X" para a não disjunção. Mesma regra da primeira leva:
// desenhar o objeto do capítulo e mover o que o mecanismo move; todo rótulo
// sai do resumo.

const green = 'var(--vs-green)';
/** Seta com a ponta desenhada como triângulo: o `marker` do SVG não herda a
 * cor do traço, e aqui as setas mudam de cor com o estado. */
function Seta({ x1, y1, x2, y2, cor = ink, largura = 2.5 }: { x1: number; y1: number; x2: number; y2: number; cor?: string; largura?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1), t = 5 + largura;
  const p = (d: number, off: number) => `${(x2 - t * Math.cos(a) + off * Math.cos(a + Math.PI / 2)).toFixed(1)},${(y2 - t * Math.sin(a) + off * Math.sin(a + Math.PI / 2)).toFixed(1)}`;
  return <g><path d={`M${x1} ${y1}L${(x2 - t * Math.cos(a)).toFixed(1)} ${(y2 - t * Math.sin(a)).toFixed(1)}`} stroke={cor} strokeWidth={largura} strokeLinecap="round" /><polygon points={`${x2},${y2} ${p(0, t * 0.6)} ${p(0, -t * 0.6)}`} fill={cor} /></g>;
}
const amber = 'var(--vs-amber)';
type Sel = { value: number };
const sel = (v: number, n: number) => Math.max(0, Math.min(n - 1, Math.round(v)));
const Foco = ({ on, children }: { on: boolean; children: React.ReactNode }) => <motion.g initial={false} animate={{ opacity: on ? 1 : 0.82 }} transition={{ duration: 0.25 }}>{children}</motion.g>;

/** Citoesqueleto: os três filamentos na mesma célula; o escolhido acende. */
export function Citoesqueleto({ value }: Sel) {
  const s = sel(value, 3);
  const nomes = ['microfilamentos de actina', 'filamentos intermediários', 'microtúbulos'];
  const funcoes = ['contração e citocinese', 'resistência mecânica', 'fuso, cílios e flagelos'];
  return <g data-bio-system="cytoskeleton"><Ponta id="bm-cito" cor={accent} />
    <ellipse cx="150" cy="140" rx="120" ry="92" fill={`color-mix(in srgb, ${blue} 6%, ${paper})`} stroke={ink} strokeWidth="2.5" />
    <circle cx="150" cy="140" r="26" fill={paper} stroke={ink} strokeWidth="2" />
    <Foco on={s === 0}>{[0, 1, 2, 3, 4, 5].map((k) => { const a = (k / 6) * Math.PI * 2; return <path key={k} d={`M${150 + 104 * Math.cos(a)} ${140 + 78 * Math.sin(a)}q${-10} ${6} ${-18 * Math.cos(a)} ${-14 * Math.sin(a)}`} stroke={accent} strokeWidth="2" fill="none" />; })}
      <path d="M40 140q10-8 20 0t20 0" stroke={accent} strokeWidth="2.5" fill="none" /></Foco>
    <Foco on={s === 1}>{[[70, 90, 110, 200], [210, 80, 230, 190], [90, 200, 200, 210]].map(([x1, y1, x2, y2], k) => <path key={k} d={`M${x1} ${y1}L${x2} ${y2}`} stroke={amber} strokeWidth="5" strokeLinecap="round" />)}</Foco>
    <Foco on={s === 2}>{[[-60, -60], [60, -50], [-50, 60], [70, 55]].map(([dx, dy], k) => <path key={k} d={`M150 140L${150 + dx} ${140 + dy}`} stroke={blue} strokeWidth="3" />)}
      <path d="M268 132c16-6 22-18 34-10M268 146c16 6 22 18 34 10" stroke={blue} strokeWidth="2.5" fill="none" /><circle cx="150" cy="140" r="5" fill={blue} /></Foco>
    <Rotulo x={160} y={260} cor={[accent, amber, blue][s]} peso={700}>{nomes[s]}</Rotulo>
    <Rotulo x={160} y={278}>{funcoes[s]}</Rotulo>
  </g>;
}

/** Rota de secreção: RER → Golgi → vesícula → exterior, com a proteína na etapa. */
export function RotaSecrecao({ value }: Sel) {
  const s = sel(value, 3);
  const pos = [{ x: 118, y: 150 }, { x: 196, y: 120 }, { x: 268, y: 70 }];
  return <g data-bio-system="secretion"><Ponta id="bm-sec" cor={dim} />
    <path d="M20 40H300V250H20Z" fill={`color-mix(in srgb, ${blue} 5%, ${paper})`} stroke={ink} strokeWidth="2.5" rx="30" />
    <circle cx="60" cy="150" r="30" fill={paper} stroke={ink} strokeWidth="2" /><Rotulo x={60} y={154} cor={dim}>núcleo</Rotulo>
    {[0, 1, 2].map((k) => <path key={k} d={`M96 ${118 + k * 22}c14-10 30-10 44 0`} stroke={s === 0 ? accent : ink} strokeWidth="3" fill="none" />)}
    {[0, 1, 2].map((k) => [0, 1, 2, 3].map((j) => <circle key={`${k}${j}`} cx={100 + j * 11} cy={114 + k * 22} r="2" fill={ink} />))}
    <Rotulo x={118} y={196} cor={s === 0 ? accent : dim} peso={700}>RER</Rotulo>
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M${176 + k * 3} ${100 + k * 12}h${40 - k * 6}`} stroke={s === 1 ? accent : ink} strokeWidth="4" strokeLinecap="round" />)}
    <Rotulo x={196} y={166} cor={s === 1 ? accent : dim} peso={700}>Golgi</Rotulo>
    <circle cx="262" cy="74" r="10" fill="none" stroke={s === 2 ? accent : ink} strokeWidth="2.5" />
    <Rotulo x={250} y={30} cor={s === 2 ? accent : dim} peso={700}>exocitose</Rotulo>
    <Seta x1={142} y1={140} x2={172} y2={128} cor={ink} largura={2} /><Seta x1={220} y1={104} x2={250} y2={84} cor={ink} largura={2} /><Seta x1={272} y1={62} x2={290} y2={42} cor={ink} largura={2} />
    <motion.circle r="6" fill={accent} initial={false} animate={{ cx: pos[s].x, cy: pos[s].y }} transition={{ duration: 0.4 }} />
    <Rotulo x={160} y={278} cor={ink}>{['síntese e entrada no retículo', 'modificação e triagem', 'vesícula funde e libera'][s]}</Rotulo>
  </g>;
}

/** Não disjunção: onde a separação falha muda quantos gametas saem alterados. */
export function NaoDisjuncao({ value }: Sel) {
  const s = sel(value, 3);
  // Número de cópias do cromossomo acompanhado em cada célula-filha.
  const filhas = s === 0 ? [3, 1] : s === 1 ? [2, 2, 0, 0] : [1, 1, 2, 0];
  const normal = s === 0 ? 2 : 1;
  const w = 300 / filhas.length;
  const rotulo = (n: number) => s === 0 ? (n > normal ? '2n + 1' : '2n − 1') : n === normal ? 'n' : n > normal ? 'n + 1' : 'n − 1';
  return <g data-bio-system="nondisjunction">
    <Rotulo x={160} y={24} cor={ink} peso={700}>{['mitose: falha na linhagem somática', 'anáfase I: homólogos não se separam', 'anáfase II: cromátides não se separam'][s]}</Rotulo>
    <circle cx="160" cy="80" r="34" fill={paper} stroke={ink} strokeWidth="2.5" />
    <path d="M150 62v36M168 62v36" stroke={accent} strokeWidth="6" strokeLinecap="round" />
    {filhas.map((n, k) => { const cx = 10 + w * k + w / 2; const alterada = n !== normal; return <g key={k}>
      <path d={`M160 114L${cx} 150`} stroke={dim} strokeWidth="1.5" />
      <circle cx={cx} cy="190" r="30" fill={alterada ? `color-mix(in srgb, ${accent} 16%, ${paper})` : paper} stroke={alterada ? accent : ink} strokeWidth="2.5" />
      {Array.from({ length: n }, (_, j) => <path key={j} d={`M${cx - (n - 1) * 5 + j * 10} 176v28`} stroke={accent} strokeWidth="5" strokeLinecap="round" />)}
      <Rotulo x={cx} y={240} cor={alterada ? accent : ink} peso={700}>{rotulo(n)}</Rotulo>
    </g>; })}
    <Rotulo x={160} y={276}>{s === 1 ? 'os quatro gametas saem alterados' : s === 2 ? 'dois normais, dois alterados' : 'células do próprio corpo'}</Rotulo>
  </g>;
}

/** Porífero × cnidário: poros e coanócitos contra tecidos, tentáculos e cnidócito. */
export function PoriferoCnidario({ value }: Sel) {
  const s = sel(value, 2);
  return <g data-bio-system="sponge-cnidarian"><Ponta id="bm-pc" cor={blue} />
    <Foco on={s === 0}>
      <path d="M40 240V90q0-30 30-30h30q30 0 30 30v150" fill={`color-mix(in srgb, ${amber} 18%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      {[100, 130, 160, 190, 220].map((y) => <g key={y}><circle cx="44" cy={y} r="4" fill={paper} stroke={ink} /><circle cx="126" cy={y} r="4" fill={paper} stroke={ink} /></g>)}
      {[110, 150, 190].map((y) => <Seta key={y} x1={20} y1={y} x2={48} y2={y} cor={blue} largura={2} />)}
      <Seta x1={85} y1={80} x2={85} y2={34} cor={blue} largura={2.5} />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${56 + k * 18} ${200 - k * 30}q4-8 0-14`} stroke={accent} strokeWidth="1.8" fill="none" />)}
      <Rotulo x={85} y={26} cor={blue}>ósculo</Rotulo><Rotulo x={85} y={262} cor={ink} peso={700}>porífero</Rotulo><Rotulo x={85} y={278}>coanócitos, sem tecidos</Rotulo>
    </Foco>
    <Foco on={s === 1}>
      <path d="M200 240V120q0-20 30-20h20q30 0 30 20v120Z" fill={`color-mix(in srgb, ${accent} 14%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      <path d="M212 236V128q0-12 18-12h20q18 0 18 12v108" fill="none" stroke={ink} strokeWidth="1.5" strokeDasharray="4 3" />
      {[-30, -12, 12, 30].map((dx) => <path key={dx} d={`M${240 + dx * 0.6} 104q${dx} -30 ${dx * 1.4} -64`} stroke={ink} strokeWidth="2.5" fill="none" />)}
      <circle cx="290" cy="62" r="7" fill={paper} stroke={accent} strokeWidth="2" /><path d="M296 58l14-8" stroke={accent} strokeWidth="2" />
      <Rotulo x={316} y={86} cor={accent} ancora="end">cnidócito</Rotulo><Rotulo x={240} y={176} cor={dim}>cavidade</Rotulo>
      <Rotulo x={240} y={262} cor={ink} peso={700}>cnidário</Rotulo><Rotulo x={240} y={278}>tecidos verdadeiros</Rotulo>
    </Foco>
  </g>;
}

/** Plano corporal em corte: onde fica a cavidade, e quem a reveste. */
export function PlanoCorporal({ value }: Sel) {
  const s = sel(value, 3);
  const nomes = ['acelomado', 'pseudocelomado', 'celomado'];
  const expl = ['mesênquima maciço preenche o espaço', 'cavidade entre mesoderme e tubo', 'cavidade forrada de mesoderme'];
  return <g data-bio-system="body-cavity">
    <circle cx="160" cy="130" r="96" fill={paper} stroke={ink} strokeWidth="3" />
    <circle cx="160" cy="130" r="86" fill="none" stroke={amber} strokeWidth="8" opacity={s === 0 ? 0 : 1} />
    {s === 0 && <circle cx="160" cy="130" r="82" fill={`color-mix(in srgb, ${amber} 35%, ${paper})`} />}
    {s === 0 && Array.from({ length: 40 }, (_, k) => { const a = k * 2.4; const r = 34 + (k % 5) * 9; return <circle key={k} cx={160 + r * Math.cos(a)} cy={130 + r * Math.sin(a)} r="2" fill={amber} />; })}
    {s === 1 && <circle cx="160" cy="130" r="80" fill={`color-mix(in srgb, ${blue} 12%, ${paper})`} />}
    {s === 2 && <><circle cx="160" cy="130" r="80" fill={`color-mix(in srgb, ${blue} 12%, ${paper})`} /><circle cx="160" cy="130" r="32" fill="none" stroke={amber} strokeWidth="8" /></>}
    <circle cx="160" cy="130" r="24" fill={`color-mix(in srgb, ${green} 30%, ${paper})`} stroke={ink} strokeWidth="2" />
    <Rotulo x={160} y={134} cor={ink}>tubo</Rotulo>
    <Rotulo x={290} y={40} ancora="end" cor={amber} peso={700}>mesoderme</Rotulo>
    {s > 0 && <Rotulo x={160} y={78} cor={blue} peso={700}>cavidade</Rotulo>}
    <Rotulo x={160} y={256} cor={accent} peso={700}>{nomes[s]}</Rotulo><Rotulo x={160} y={274}>{expl[s]}</Rotulo>
  </g>;
}

/** Inseto, crustáceo e miriápode: tagmas, antenas e patas contados no desenho. */
export function Artropodes({ value, aracnideo = false }: Sel & { aracnideo?: boolean }) {
  const s = aracnideo ? sel(value, 2) : sel(value, 3);
  const tipo = aracnideo ? (['inseto', 'aracnídeo'] as const)[s] : (['inseto', 'crustáceo', 'miriápode'] as const)[s];
  const pata = (x: number, y: number, lado: number, k: number) => <path key={`${x}${y}${lado}${k}`} d={`M${x} ${y}l${lado * 22} ${-6 + k * 4}l${lado * 10} 14`} stroke={ink} strokeWidth="2.2" fill="none" />;
  let corpo: React.ReactNode;
  if (tipo === 'inseto') corpo = <>
    <circle cx="160" cy="70" r="14" fill={paper} stroke={ink} strokeWidth="2.5" /><ellipse cx="160" cy="112" rx="18" ry="24" fill={paper} stroke={ink} strokeWidth="2.5" /><ellipse cx="160" cy="176" rx="22" ry="40" fill={paper} stroke={ink} strokeWidth="2.5" />
    <path d="M154 58q-14-24-30-30M166 58q14-24 30-30" stroke={accent} strokeWidth="2.5" fill="none" />
    {[0, 1, 2].map((k) => [pata(142, 100 + k * 12, -1, k), pata(178, 100 + k * 12, 1, k)])}</>;
  else if (tipo === 'aracnídeo') corpo = <>
    <ellipse cx="160" cy="96" rx="26" ry="30" fill={paper} stroke={ink} strokeWidth="2.5" /><ellipse cx="160" cy="170" rx="30" ry="42" fill={paper} stroke={ink} strokeWidth="2.5" />
    <path d="M152 68l-6-14M168 68l6-14" stroke={accent} strokeWidth="4" strokeLinecap="round" />
    {[0, 1, 2, 3].map((k) => [pata(136, 80 + k * 10, -1, k), pata(184, 80 + k * 10, 1, k)])}</>;
  else if (tipo === 'crustáceo') corpo = <>
    <path d="M120 70q40-30 80 0v70q-40 20-80 0Z" fill={`color-mix(in srgb, ${accent} 12%, ${paper})`} stroke={ink} strokeWidth="2.5" />
    {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${128 + k * 3} ${146 + k * 16}h${64 - k * 6}`} stroke={ink} strokeWidth="2.5" />)}
    <path d="M140 66q-20-30-50-40M146 64q-10-20-30-40M180 66q20-30 50-40M174 64q10-20 30-40" stroke={accent} strokeWidth="2.2" fill="none" />
    {[0, 1, 2, 3, 4].map((k) => [pata(120, 84 + k * 11, -1, k), pata(200, 84 + k * 11, 1, k)])}</>;
  else corpo = <>
    {Array.from({ length: 9 }, (_, k) => <g key={k}><rect x={146} y={48 + k * 22} width="28" height="18" rx="6" fill={paper} stroke={ink} strokeWidth="2" />{k > 0 && [pata(144, 58 + k * 22, -1, 1), pata(176, 58 + k * 22, 1, 1)]}</g>)}
    <path d="M152 48q-10-20-24-28M168 48q10-20 24-28" stroke={accent} strokeWidth="2.2" fill="none" /></>;
  const info: Record<string, [string, string]> = {
    inseto: ['cabeça, tórax e abdome', '3 pares de patas · 1 par de antenas'],
    aracnídeo: ['cefalotórax e abdome', '4 pares de pernas · quelíceras, sem antenas'],
    crustáceo: ['cefalotórax e abdome', '2 pares de antenas'],
    miriápode: ['cabeça e tronco segmentado', 'patas em muitos segmentos · 1 par de antenas'],
  };
  return <g data-bio-system={`arthropod-${tipo}`}>{corpo}
    <Rotulo x={300} y={40} ancora="end" cor={accent} peso={700}>{tipo}</Rotulo>
    <Rotulo x={160} y={262} cor={ink} peso={700}>{info[tipo][0]}</Rotulo><Rotulo x={160} y={280}>{info[tipo][1]}</Rotulo>
  </g>;
}

/** Cartilaginoso × ósseo: fendas sem opérculo e sem bexiga, contra opérculo e bexiga natatória. */
export function Peixes({ value }: Sel) {
  const s = sel(value, 2);
  return <g data-bio-system="fish">
    {s === 0 ? <>
      <path d="M30 140q60-50 170-30l40-40-10 52 60-10-60 30 10 50-40-38q-110 20-170-14Z" fill={`color-mix(in srgb, ${blue} 14%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      <path d="M190 110l20-44 10 42" fill={`color-mix(in srgb, ${blue} 14%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${86 + k * 8} 126v18`} stroke={accent} strokeWidth="2.5" />)}
      <Rotulo x={100} y={176} cor={accent} peso={700}>fendas sem opérculo</Rotulo>
      <Rotulo x={160} y={62} cor={dim}>sem bexiga natatória</Rotulo>
      <Rotulo x={160} y={256} cor={ink} peso={700}>cartilaginoso (tubarões, raias)</Rotulo><Rotulo x={160} y={274}>esqueleto de cartilagem · fígado oleoso</Rotulo>
    </> : <>
      <path d="M40 140q60-60 170-20l50-40v120l-50-40q-110 40-170-20Z" fill={`color-mix(in srgb, ${amber} 16%, ${paper})`} stroke={ink} strokeWidth="2.5" />
      <path d="M96 116q14 24 0 48" stroke={accent} strokeWidth="3" fill="none" />
      <ellipse cx="160" cy="134" rx="32" ry="12" fill={`color-mix(in srgb, ${blue} 25%, ${paper})`} stroke={blue} strokeWidth="2" />
      <Rotulo x={96} y={192} cor={accent} peso={700}>opérculo</Rotulo><Rotulo x={160} y={112} cor={blue} peso={700}>bexiga natatória</Rotulo>
      <Rotulo x={160} y={256} cor={ink} peso={700}>ósseo</Rotulo><Rotulo x={160} y={274}>esqueleto ossificado · a bexiga regula a flutuação</Rotulo>
    </>}
  </g>;
}

/** Flor em corte: o óvulo vira semente e o ovário vira fruto. */
export function FlorFruto({ value }: Sel) {
  const s = sel(value, 3);
  const inchado = s === 2;
  return <g data-bio-system="flower-fruit">
    <path d="M160 270V190" stroke={green} strokeWidth="4" />
    {s < 2 && <><path d="M100 150q-40-50 30-60M220 150q40-50-30-60" fill={`color-mix(in srgb, ${accent} 16%, ${paper})`} stroke={ink} strokeWidth="2" />
      <path d="M130 150V100M190 150V100" stroke={ink} strokeWidth="2" /><ellipse cx="130" cy="94" rx="7" ry="10" fill={amber} /><ellipse cx="190" cy="94" rx="7" ry="10" fill={amber} />
      <Rotulo x={100} y={80} cor={dim}>estame</Rotulo></>}
    <path d="M160 150V60" stroke={ink} strokeWidth="3" /><circle cx="160" cy="58" r="6" fill={ink} opacity={inchado ? 0.25 : 1} />
    <motion.ellipse cx="160" cy="176" fill={inchado ? `color-mix(in srgb, ${accent} 30%, ${paper})` : paper} stroke={s === 2 ? accent : ink} strokeWidth="3" initial={false} animate={{ rx: inchado ? 52 : 26, ry: inchado ? 46 : 22 }} transition={{ duration: 0.5 }} />
    {[-10, 0, 10].map((dx) => <motion.ellipse key={dx} cx={160 + dx} cy="176" rx="5" ry="7" fill={s >= 1 ? `color-mix(in srgb, ${amber} 60%, ${paper})` : paper} stroke={s === 1 ? accent : ink} strokeWidth={s === 1 ? 2.5 : 1.5} initial={false} animate={{ scale: s >= 1 ? 1.5 : 1 }} transition={{ duration: 0.4 }} />)}
    <Rotulo x={308} y={30} ancora="end" cor={s === 2 ? accent : ink} peso={700}>ovário{s === 2 ? ' → fruto' : ''}</Rotulo>
    <Rotulo x={308} y={48} ancora="end" cor={s === 1 ? accent : ink} peso={700}>óvulo{s >= 1 ? ' → semente' : ''}</Rotulo>
    <Rotulo x={160} y={290} cor={ink}>{['a flor antes da fecundação', 'fecundado, o óvulo vira semente', 'o ovário cresce e envolve as sementes'][s]}</Rotulo>
  </g>;
}

/** Três vias de transferência horizontal de DNA entre bactérias. */
export function TransferenciaGenica({ value }: Sel) {
  const s = sel(value, 3);
  const bac = (x: number, cor: string) => <rect x={x} y="96" width="84" height="56" rx="28" fill={paper} stroke={cor} strokeWidth="2.5" />;
  return <g data-bio-system="gene-transfer"><Ponta id="bm-tg" cor={accent} />
    {s === 0 && <>
      <path d="M40 100l20-16M44 120q6-10 20-6" stroke={dim} strokeWidth="2" fill="none" /><Rotulo x={60} y={70} cor={dim}>célula morta</Rotulo>
      <path d="M110 124q10-10 20 0t20 0" stroke={accent} strokeWidth="3" fill="none" />
      <Seta x1={156} y1={124} x2={190} y2={124} cor={accent} />{bac(196, accent)}<path d="M214 124q10-10 20 0t20 0" stroke={accent} strokeWidth="3" fill="none" />
      <Rotulo x={130} y={100} cor={accent}>DNA livre</Rotulo></>}
    {s === 1 && <>
      {bac(24, ink)}{bac(212, accent)}
      <g transform="translate(160 70)"><polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill={paper} stroke={ink} strokeWidth="2" /><path d="M0 18v22M-10 40l10-6 10 6" stroke={ink} strokeWidth="2" fill="none" /><path d="M-6 -2q6-6 12 0" stroke={accent} strokeWidth="2.5" fill="none" /></g>
      <Seta x1={108} y1={110} x2={140} y2={84} cor={accent} /><Seta x1={180} y1={84} x2={210} y2={110} cor={accent} />
      <Rotulo x={160} y={34} cor={ink} peso={700}>bacteriófago</Rotulo></>}
    {s === 2 && <>
      {bac(24, ink)}{bac(212, accent)}
      <path d="M108 124H212" stroke={ink} strokeWidth="5" /><Rotulo x={160} y={112} cor={ink}>pilus</Rotulo>
      <circle cx="66" cy="124" r="10" fill="none" stroke={accent} strokeWidth="2.5" /><motion.circle cy="124" r="10" fill="none" stroke={accent} strokeWidth="2.5" initial={false} animate={{ cx: 254 }} />
      <Rotulo x={66} y={172} cor={accent}>plasmídeo</Rotulo></>}
    <Rotulo x={160} y={234} cor={accent} peso={700}>{['transformação', 'transdução', 'conjugação'][s]}</Rotulo>
    <Rotulo x={160} y={254}>{['a bactéria capta DNA do ambiente', 'um vírus leva DNA de uma bactéria a outra', 'o pilus liga as duas e passa um plasmídeo'][s]}</Rotulo>
    <Rotulo x={160} y={278} cor={dim}>transferência sem reprodução sexual</Rotulo>
  </g>;
}

/** Caule em corte: epiderme por fora, feixes com xilema para dentro e floema para fora. */
export function TecidosVegetais({ value }: Sel) {
  const s = sel(value, 3);
  return <g data-bio-system="plant-tissues">
    <circle cx="112" cy="136" r="88" fill={`color-mix(in srgb, ${green} 10%, ${paper})`} stroke={s === 2 ? accent : ink} strokeWidth={s === 2 ? 6 : 3} />
    {Array.from({ length: 8 }, (_, k) => { const a = (k / 8) * Math.PI * 2; const x = 112 + 54 * Math.cos(a); const y = 136 + 54 * Math.sin(a); const ang = (a * 180) / Math.PI;
      return <g key={k} transform={`rotate(${ang + 90} ${x} ${y})`}>
        <rect x={x - 11} y={y - 14} width="22" height="12" rx="4" fill={s === 1 ? `color-mix(in srgb, ${amber} 50%, ${paper})` : paper} stroke={s === 1 ? accent : ink} strokeWidth="1.8" />
        <rect x={x - 11} y={y} width="22" height="14" rx="4" fill={s === 0 ? `color-mix(in srgb, ${blue} 40%, ${paper})` : paper} stroke={s === 0 ? accent : ink} strokeWidth="1.8" />
      </g>; })}
    <Rotulo x={312} y={60} ancora="end" cor={s === 0 ? accent : dim} peso={700}>xilema (dentro)</Rotulo>
    <Rotulo x={312} y={78} ancora="end" cor={s === 1 ? accent : dim} peso={700}>floema (fora)</Rotulo>
    <Rotulo x={312} y={96} ancora="end" cor={s === 2 ? accent : dim} peso={700}>epiderme</Rotulo>
    <Rotulo x={160} y={264} cor={ink} peso={700}>{['xilema: água e sais sobem da raiz', 'floema: açúcares das folhas', 'epiderme: revestimento, cutícula e estômatos'][s]}</Rotulo>
  </g>;
}

/** Raiz, caule e folha na mesma planta, cada um com a função que a forma serve. */
export function OrgaosVegetais({ value }: Sel) {
  const s = sel(value, 3);
  return <g data-bio-system="plant-organs">
    <path d="M20 190H300" stroke={amber} strokeWidth="3" />
    <Foco on={s === 0}><path d="M160 190v50M160 214l-30 30M160 206l34 26M160 226l-12 28" stroke={amber} strokeWidth="3" fill="none" /></Foco>
    <Foco on={s === 1}><path d="M160 190V60" stroke={green} strokeWidth="7" /><circle cx="160" cy="120" r="5" fill={green} /><circle cx="160" cy="86" r="5" fill={green} /><Rotulo x={176} y={124} ancora="start" cor={dim}>nó e gema</Rotulo></Foco>
    <Foco on={s === 2}><path d="M160 120c-40-4-70-26-80-50 34-2 66 16 80 50Z" fill={`color-mix(in srgb, ${green} 30%, ${paper})`} stroke={green} strokeWidth="2.5" /><path d="M160 86c36-8 58-30 64-54-30 2-58 22-64 54Z" fill={`color-mix(in srgb, ${green} 30%, ${paper})`} stroke={green} strokeWidth="2.5" />
      {[[110, 100], [196, 58]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill={paper} stroke={ink} />)}</Foco>
    <Rotulo x={160} y={276} cor={ink} peso={700}>{['raiz: fixa e absorve', 'caule: sustenta e conduz; tem gemas e nós', 'folha: trocas gasosas e fotossíntese'][s]}</Rotulo>
  </g>;
}

/** Dispersão normal × inversão térmica: a mesma chaminé, a tampa de ar quente muda tudo. */
export function InversaoTermica({ value }: Sel) {
  const s = sel(value, 2);
  const inv = s === 1;
  const reduced = useReducedMotion();
  return <g data-bio-system="thermal-inversion">
    <path d="M10 230L60 150 110 230M210 230L260 140 310 230" fill={`color-mix(in srgb, ${green} 14%, ${paper})`} stroke={ink} strokeWidth="2" />
    <path d="M10 230H310" stroke={ink} strokeWidth="2.5" />
    <rect x="150" y="170" width="16" height="60" fill={paper} stroke={ink} strokeWidth="2" />
    {inv && <><rect x="10" y="110" width="300" height="26" fill={`color-mix(in srgb, ${accent} 16%, transparent)`} /><Rotulo x={300} y={104} ancora="end" cor={accent} peso={700}>camada de ar quente</Rotulo></>}
    {!inv && <Rotulo x={20} y={60} ancora="start" cor={blue} peso={700}>ar quente sobe e dispersa</Rotulo>}
    {Array.from({ length: 14 }, (_, k) => { const alto = inv ? 140 + (k % 4) * 20 : 160 - k * 9; const x = 160 + (k % 2 ? 1 : -1) * (inv ? 10 + k * 9 : 6 + k * 4);
      return <motion.circle key={k} r="5" fill={dim} initial={false} animate={{ cx: x, cy: alto, opacity: inv ? 0.8 : 0.9 - k * 0.05 }} transition={reduced ? { duration: 0 } : { duration: 0.8, delay: k * 0.03 }} />; })}
    <Rotulo x={160} y={262} cor={inv ? accent : ink} peso={700}>{inv ? 'a tampa prende o poluente rente ao solo' : 'o poluente sobe e se dilui'}</Rotulo>
    <Rotulo x={160} y={280}>{inv ? 'ar frio embaixo, quente em cima' : 'mesma emissão, concentração diferente'}</Rotulo>
  </g>;
}

/** POPs e biorremediação: o contaminante persiste; microrganismos o transformam. */
export function Biorremediacao({ value, ratio }: Props) {
  const restantes = Math.round(12 * (1 - ratio));
  return <g data-bio-system="bioremediation">
    <path d="M10 110H310V240H10Z" fill={`color-mix(in srgb, ${amber} 16%, ${paper})`} stroke={ink} strokeWidth="2" />
    <Rotulo x={20} y={100} ancora="start" cor={ink} peso={700}>solo contaminado</Rotulo>
    {Array.from({ length: 12 }, (_, k) => { const x = 36 + (k % 6) * 48; const y = 140 + Math.floor(k / 6) * 50; const vivo = k < restantes;
      return <g key={k} opacity={vivo ? 1 : 0.18}><polygon points={[0, 1, 2, 3, 4, 5].map((j) => `${(x + 10 * Math.cos((j * Math.PI) / 3)).toFixed(1)},${(y + 10 * Math.sin((j * Math.PI) / 3)).toFixed(1)}`).join(' ')} fill="none" stroke={accent} strokeWidth="2.5" /></g>; })}
    {Array.from({ length: Math.round(ratio * 6) }, (_, k) => <rect key={k} x={52 + k * 44} y={216} width="18" height="9" rx="4" fill={green} />)}
    <path d="M250 110V60M250 80l-16-14M250 70l16-12" stroke={green} strokeWidth="3" fill="none" />
    <Rotulo x={296} y={36} ancora="end" cor={green}>bactérias, fungos, plantas</Rotulo>
    <Rotulo x={160} y={264} cor={ink} peso={700}>{restantes} de 12 moléculas restam ({value}% degradado)</Rotulo>
    <Rotulo x={160} y={282}>POPs resistem à degradação; organismos a aceleram</Rotulo>
  </g>;
}
