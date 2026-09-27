import React from 'react';
import { motion } from 'motion/react';

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
const Rotulo = ({ x, y, children, cor = dim, ancora = 'middle', peso }: { x: number; y: number; children: React.ReactNode; cor?: string; ancora?: 'start' | 'middle' | 'end'; peso?: number }) =>
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
  const aceso = (k: number) => ({ opacity: k === etapa ? 1 : 0.25 });
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
