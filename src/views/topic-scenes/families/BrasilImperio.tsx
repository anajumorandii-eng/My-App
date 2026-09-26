import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';

// Lote 4 da régua de História e Geografia: Brasil Império e Primeira
// República. Cada cena desenha a estrutura de poder que o capítulo explica —
// o Moderador acima dos três poderes, o trono sem imperador adulto, os apoios
// que sustentavam a monarquia, a pirâmide do coronel ao presidente, a elite
// cafeeira contestada por três lados. Datas e nomes vêm do resumo do
// capítulo; barras e alturas são metáfora e a prancha diz isso.

type Scene = { active: number };

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

function Person({ x, y, s = 1, coat = 'bi-coat', hat }: { x: number; y: number; s?: number; coat?: string; hat?: 'crown' | 'kepi' | 'top' | 'brim' | 'cap' }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-11 34c0-16 5-24 11-24s11 8 11 24Z" className={coat} />
    <circle cx="0" cy="0" r="7" className="bi-face" />
    {hat === 'crown' && <path d="M-7 -6l1-9 3 4 3-6 3 6 3-4 1 9Z" className="bi-crown" />}
    {hat === 'kepi' && <path d="M-7 -4v-7h13l1 7ZM-9 -4h17" className="bi-kepi" />}
    {hat === 'top' && <path d="M-6 -6v-11h12v11ZM-10 -6h20" className="bi-hat" />}
    {hat === 'brim' && <path d="M-5 -6q5-9 10 0ZM-12 -5h24" className="bi-hat" />}
    {hat === 'cap' && <path d="M-7 -4q7-10 14 0ZM5 -5h6" className="bi-cap" />}
  </g>;
}

function Arrow({ d, on, p, head, delay = 0 }: { d: string; on: boolean; p: ReturnType<typeof usePaced>; head: string; delay?: number }) {
  return <motion.path d={d} className="bi-arrow" markerEnd={`url(#${head})`} initial={false}
    animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={p(0.8, on ? delay : 0)} />;
}

function ArrowHead({ id }: { id: string }) {
  return <defs><marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0 0L10 5L0 10Z" className="bi-head" />
  </marker></defs>;
}

// Formação do Estado: o Poder Moderador fica desenhado nos três recortes
// porque é ele o problema que a repressão de 1824 não resolveu; a barra de
// baixo acumula a insatisfação até a abdicação.
export function StateFormation({ active }: Scene) {
  const p = usePaced();
  const pillars = [
    { x: 85, label: 'Executivo', icon: <path d="M-14 -6h28v18h-28ZM-6 -6v-4h12v4M-14 2h28" className="bi-icon" /> },
    { x: 175, label: 'Legislativo', icon: <path d="M-16 12h32M-13 12V2M-5 12V2M5 12V2M13 12V2M-16 2h32M-14 -2a14 11 0 0 1 28 0Z" className="bi-icon" /> },
    { x: 265, label: 'Judiciário', icon: <path d="M0 -10v22M-14 -6h28M-14 -6l-5 10h10ZM14 -6l-5 10h10ZM-7 12h14" className="bi-icon" /> },
  ];
  const fill = [0.34, 0.62, 1][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Formação do Estado nacional: Poder Moderador acima dos três poderes, Confederação do Equador reprimida e abdicação de 1831; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">PRIMEIRO REINADO · 1822–1831</text>

    <motion.g initial={false} animate={{ scale: active === 0 ? 1.08 : 1 }} transition={p(0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <path d="M151 96l4-26 12 13 8-19 8 19 12-13 4 26Z" className="bi-crown" />
      <rect x="150" y="94" width="50" height="7" rx="2" className="bi-crown-band" />
      <circle cx="175" cy="68" r="3" className="bi-jewel" />
    </motion.g>
    <text x="175" y="122" textAnchor="middle" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>Poder Moderador</text>
    <text x="175" y="137" textAnchor="middle" className="bi-small">o imperador, acima dos três</text>
    {pillars.map(({ x }, k) => <motion.path key={`reach-${x}`} d={`M175 144C175 162 ${x} 158 ${x} 180`} className="bi-reach" initial={false}
      animate={{ pathLength: 1, opacity: active === 0 ? 1 : 0.55 }} transition={p(0.6, 0.15 * k)} />)}
    {pillars.map(({ x, label, icon }) => <g key={label}>
      <rect x={x - 38} y="182" width="76" height="62" rx="10" className="bi-block" />
      <g transform={`translate(${x} 204)`}>{icon}</g>
      <text x={x} y="236" textAnchor="middle" className="bi-small">{label}</text>
    </g>)}
    <rect x="40" y="250" width="270" height="16" rx="4" className="bi-plinth" />
    <text x="175" y="262" textAnchor="middle" className="bi-plinth-text">Constituição de 1824</text>

    <rect x="330" y="58" width="262" height="206" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="350" y="84" className="bi-panel-title">1823–1824 · OUTORGA</text>
      <g transform="translate(386 124)">
        <path d="M-24 -4L0 -20L24 -4ZM-20 -4h40v26h-40ZM-12 -4v26M0 -4v26M12 -4v26" className="bi-icon" />
        <motion.path d="M-26 -22L26 24M26 -22L-26 24" className="bi-cross" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.6, 0.4)} />
      </g>
      <text x="386" y="164" textAnchor="middle" className="bi-tiny">Constituinte</text>
      <text x="386" y="176" textAnchor="middle" className="bi-tiny">dissolvida</text>
      <path d="M424 124h36" className="bi-arrow-static" /><path d="M456 119l7 5-7 5" className="bi-arrow-static" />
      <g transform="translate(508 124)">
        <path d="M-24 -26h44a4 4 0 0 1 4 4v44h-44a4 4 0 0 1-4-4Z" className="bi-scroll" />
        <path d="M-16 -16h32M-16 -8h32M-16 0h24M-16 8h28" className="bi-scroll-line" />
        <motion.circle cx="14" cy="14" r="7" className="bi-seal" initial={false} animate={{ scale: active === 0 ? [0, 1.25, 1] : 0 }} transition={p(0.5, 0.9)} />
      </g>
      <text x="508" y="164" textAnchor="middle" className="bi-tiny">Constituição</text>
      <text x="508" y="176" textAnchor="middle" className="bi-tiny">outorgada</text>
      {['dissolve a Câmara', 'nomeia e demite ministros', 'nomeia senadores vitalícios'].map((line, k) => <g key={line}>
        <circle cx="356" cy={203 + k * 20} r="3.5" className="bi-dot" />
        <text x="366" y={207 + k * 20} className="bi-small">{line}</text>
      </g>)}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="350" y="84" className="bi-panel-title">CONFEDERAÇÃO DO EQUADOR</text>
      <g transform="translate(372 120)">
        <path d="M0 26V-18" className="bi-pole" />
        <motion.path d="M0 -18h40l-8 10 8 10H0Z" className="bi-flag" initial={false} animate={{ skewY: active === 1 ? [0, -6, 3, 0] : 0 }} transition={p(1.4, 0.3)} />
        <path d="M17 -12l2 4 4 1-4 1-2 4-2-4-4-1 4-1Z" className="bi-star" />
      </g>
      <text x="424" y="112" className="bi-label">1824</text>
      <text x="424" y="128" className="bi-small">Pernambuco e outras</text>
      <text x="424" y="142" className="bi-small">províncias do Nordeste</text>
      <text x="350" y="176" className="bi-small bi-strong">republicana e federalista</text>
      <text x="350" y="194" className="bi-small">contra a centralização no Rio</text>
      <text x="350" y="216" className="bi-small bi-warn">reprimida; Frei Caneca executado</text>
      <motion.text x="461" y="250" textAnchor="middle" className="bi-hand-sm" initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 0.9)}>cala a revolta, não o problema</motion.text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <text x="350" y="84" className="bi-panel-title">ABDICAÇÃO · ABRIL DE 1831</text>
      <Person x={390} y={112} coat="bi-coat-royal" />
      <Person x={540} y={124} s={0.72} coat="bi-coat-royal" />
      <motion.path d="M-7 -6l1-9 3 4 3-6 3 6 3-4 1 9Z" className="bi-crown" initial={false}
        animate={active === 2 ? { x: [390, 465, 540], y: [112, 86, 124] } : { x: 390, y: 112 }} transition={p(1.4, 0.4)} />
      <text x="390" y="162" textAnchor="middle" className="bi-tiny">D. Pedro I</text>
      <text x="540" y="162" textAnchor="middle" className="bi-tiny">D. Pedro II</text>
      <text x="540" y="174" textAnchor="middle" className="bi-tiny">criança</text>
      {['Cisplatina perdida (1828)', 'autoritarismo do Moderador', 'interesses portugueses'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : -8 }} transition={p(0.4, 0.2 + k * 0.15)}>
        <circle cx="356" cy={199 + k * 20} r="3.5" className="bi-dot bi-dot-warn" />
        <text x="366" y={203 + k * 20} className="bi-small">{line}</text>
      </motion.g>)}
    </motion.g>

    <text x="30" y="286" className="bi-small">insatisfação das elites com o poder concentrado</text>
    <rect x="30" y="292" width="560" height="12" rx="6" className="bi-gauge" />
    <motion.rect x="30" y="292" height="12" rx="6" className="bi-gauge-fill" initial={false} animate={{ width: 560 * fill }} transition={p(0.9, 0.2)} />
    {[[0.2, '1824 outorga'], [0.46, '1824 Confederação'], [0.72, '1828 Cisplatina']].map(([f, text]) => <g key={text as string}>
      <path d={`M${30 + 560 * (f as number)} 290v16`} className="bi-tick" />
      <text x={30 + 560 * (f as number)} y="318" textAnchor="middle" className="bi-tiny">{text}</text>
    </g>)}
    <text x="590" y="318" textAnchor="end" className="bi-tiny">1831 abdicação</text>
    <text x="30" y="342" className="bi-foot">Barra ilustrativa: mostra acúmulo, não mede nada.</text>
  </svg>;
}

// Período Regencial: o mapa situa as quatro revoltas, e a linha do tempo à
// direita mostra o que o mapa sozinho esconde — elas se sobrepõem, e a
// Farroupilha sobrevive à própria Regência.
const toMap = (x: number, y: number) => [14 + 0.86 * x, 40 + 0.86 * y];
const REVOLTS = [
  { name: 'Cabanagem', province: 'Grão-Pará', at: toMap(206, 99), start: 1835, end: 1840, label: [-12, 4, 'end'] },
  { name: 'Farroupilha', province: 'Rio Grande do Sul', at: toMap(196, 300), start: 1835, end: 1845, label: [-12, 4, 'end'] },
  { name: 'Sabinada', province: 'Bahia', at: toMap(300, 186), start: 1837, end: 1838, label: [12, 4, 'start'] },
  { name: 'Balaiada', province: 'Maranhão', at: toMap(262, 112), start: 1838, end: 1841, label: [10, -12, 'start'] },
] as const;
const year = (y: number) => 350 + (y - 1831) * (240 / 14);

export function RegencyRevolts({ active }: Scene) {
  const p = usePaced();
  const lit = (k: number) => active === 3 || active === k || (active === 2 && k === 3);
  const [rioX, rioY] = toMap(275, 252);
  const notes = [
    ['pobres, mestiços e indígenas', 'uma das mais sangrentas'],
    ['pecuaristas contra as tarifas', 'república efêmera; paz negociada'],
    ['Bahia e Maranhão:', 'a crise cobre o território'],
    ['sem monarca adulto, o centro', 'não contém as províncias'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Período Regencial: Cabanagem, Farroupilha, Sabinada e Balaiada no mapa e na linha do tempo de 1831 a 1845; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">REGÊNCIAS · 1831–1840</text>
    <path d={BRAZIL} transform="translate(14 40) scale(.86)" className="bi-land" />
    <g transform={`translate(${rioX} ${rioY})`}>
      <path d="M-6 6v-14h12v14M-8 6h16M-6 -2h12" className="bi-throne" />
      <path d="M-3 -10l1-4 2 2 2-2 1 4Z" className="bi-crown" />
    </g>
    <text x={rioX + 12} y={rioY + 6} className="bi-tiny">Rio · corte</text>
    {REVOLTS.map((r, k) => <g key={r.name}>
      <motion.g initial={false} animate={{ scale: lit(k) ? 1 : 0.7, opacity: lit(k) ? 1 : 0.35 }}
        transition={p(0.5, lit(k) && active === 3 ? (r.start - 1835) * 0.25 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path transform={`translate(${r.at[0]} ${r.at[1]})`} d="M0 -16c7 6 10 11 10 16a10 10 0 0 1-20 0c0-5 3-8 6-11 0 4 2 7 4 7 0-5-2-8 0-12Z" className="bi-flame" />
      </motion.g>
      <text x={r.at[0] + (r.label[0] as number)} y={r.at[1] + (r.label[1] as number)} textAnchor={r.label[2]} className={lit(k) ? 'bi-small bi-strong' : 'bi-tiny'}>{r.province}</text>
    </g>)}

    <Person x={368} y={66} s={0.55} coat="bi-coat-royal" hat="crown" />
    <text x="386" y="66" className="bi-small">D. Pedro II tinha 5 anos em 1831</text>
    <text x="386" y="82" className="bi-small">regências disputam o poder</text>
    <rect x="350" y="106" width={year(1840) - 350} height="118" rx="6" className="bi-band" />
    <text x="356" y="122" className="bi-tiny">Período Regencial</text>
    {REVOLTS.map((r, k) => {
      const y0 = 134 + k * 22;
      const w = year(r.end) - year(r.start);
      const inside = w > 110;
      return <g key={r.name}>
        <rect x={year(r.start)} y={y0} width={w} height="13" rx="4" className="bi-bar" />
        <motion.rect x={year(r.start)} y={y0} height="13" rx="4" className="bi-bar-on" initial={false}
          animate={{ width: lit(k) ? w : 0 }} transition={p(0.7, lit(k) && active === 3 ? (r.start - 1835) * 0.25 : 0.1)} />
        <text x={inside ? year(r.start) + 6 : year(r.end) + 5} y={y0 + 10} className={inside ? 'bi-bar-text' : lit(k) ? 'bi-tiny bi-strong' : 'bi-tiny'}>{r.name}</text>
      </g>;
    })}
    <path d={`M${year(1840)} 102v126`} className="bi-marker" />
    <text x={year(1840)} y="98" textAnchor="middle" className="bi-tiny">1840: maioridade</text>
    {[1831, 1835, 1840].map(y => <text key={y} x={year(y)} y="242" textAnchor="middle" className="bi-tiny">{y}</text>)}
    <text x="590" y="242" textAnchor="end" className="bi-tiny">1845</text>

    <g transform="translate(362 286)">
      {active === 0 && [0, 22, 44].map((dx, k) => <motion.g key={dx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.2 + k * 0.12)}>
        <Person x={dx} y={-12} s={0.6} coat={['bi-coat-plain', 'bi-coat', 'bi-coat-green'][k]} />
      </motion.g>)}
      {active === 1 && <motion.g initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={p(0.6, 0.2)}>
        <path d="M0 -8h22a4 4 0 0 1 4 4v8H-4v-8a4 4 0 0 1 4-4ZM-1 4v8M22 4v8M26 -5l5-4" className="bi-cattle" />
      </motion.g>}
      {active >= 2 && <motion.path d="M0 -4c8 7 12 12 12 17a12 12 0 0 1-24 0c0-5 4-9 7-12 0 4 2 7 5 7 0-5-2-8 0-12Z" className="bi-flame" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.5, 0.2)} />}
    </g>
    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.3)}>
      <text x={active === 0 ? 424 : 402} y="282" className="bi-small bi-strong">{notes[0]}</text>
      <text x={active === 0 ? 424 : 402} y="298" className="bi-small">{notes[1]}</text>
    </motion.g>
    <text x="30" y="342" className="bi-foot">Contorno simplificado; posições aproximadas.</text>
  </svg>;
}

// Declínio do Segundo Reinado: a monarquia como plataforma sobre três
// apoios. Um apoio a menos faz balançar, não cair; os três juntos derrubam —
// é a tese do capítulo ("perda simultânea"), e a cena a encena literalmente.
const SUPPORTS = [
  { x: 110, group: 'clero', issue: 'Questão Religiosa', when: '1872–1875' },
  { x: 220, group: 'Exército', issue: 'Questão Militar', when: '1883–1887' },
  { x: 330, group: 'cafeicultores', issue: 'Lei Áurea, 1888', when: 'sem indenização' },
];

export function EmpireDecline({ active }: Scene) {
  const p = usePaced();
  const gone = (k: number) => active === 3 || active === k;
  const platform = [
    { rotate: -4, y: 4 }, { rotate: 0, y: 9 }, { rotate: 4, y: 4 }, { rotate: -16, y: 76 },
  ][active];
  const badge = [
    <path key="c" d="M0 -11v22M-7 -4h14" className="bi-badge-icon" />,
    <path key="m" d="M-8 4V-6q8-5 16 0V4ZM-11 4h14l5 5h-19Z" className="bi-badge-icon" />,
    <g key="f"><path d="M-8 9C-4 0 2-5 9-9" className="bi-badge-icon" /><ellipse cx="-4" cy="-2" rx="3" ry="4" className="bi-bean" /><ellipse cx="4" cy="3" rx="3" ry="4" className="bi-bean" /></g>,
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Declínio do Segundo Reinado: clero, Exército e cafeicultores sustentam a monarquia; um apoio a menos faz balançar, os três juntos derrubam em 1889; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">SEGUNDO REINADO · 1870–1889</text>
    <path d="M30 262H410" className="bi-ground" />
    {SUPPORTS.map((s, k) => <motion.g key={s.group} initial={false}
      animate={{ y: gone(k) ? 22 : 0, opacity: gone(k) ? 0.3 : 1, rotate: gone(k) ? (k - 1) * 6 || 4 : 0 }}
      transition={p(0.7, active === 3 ? k * 0.25 : 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
      <rect x={s.x - 30} y="144" width="60" height="9" rx="2" className="bi-capital" />
      <rect x={s.x - 22} y="153" width="44" height="109" className="bi-column" />
      <path d={`M${s.x - 10} 160v96M${s.x + 10} 160v96`} className="bi-flute" />
      <circle cx={s.x} cy="198" r="17" className="bi-badge" />
      <g transform={`translate(${s.x} 198)`}>{badge[k]}</g>
    </motion.g>)}
    {SUPPORTS.map((s, k) => <motion.path key={`crack-${s.x}`} d={`M${s.x - 8} 170l10 14-8 10 12 16`} className="bi-crack" initial={false}
      animate={{ pathLength: gone(k) ? 1 : 0, opacity: gone(k) ? 1 : 0 }} transition={p(0.5, active === 3 ? k * 0.25 : 0)} />)}
    <motion.g initial={false} animate={platform} transition={p(active === 3 ? 1.1 : 0.7, active === 3 ? 0.8 : 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <rect x="70" y="128" width="300" height="16" rx="4" className="bi-beam" />
      <path d="M198 128v-40a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v40M192 108h56v8h-56Z" className="bi-throne-big" />
      <path d="M206 88h28v18h-28Z" className="bi-cushion" />
      {active !== 3 && <path d="M206 84l3-18 8 9 3-13 3 13 8-9 3 18Z" className="bi-crown" />}
    </motion.g>
    {/* Na queda a coroa se solta do trono e rola até o chão. */}
    {active === 3 && <motion.path d="M206 84l3-18 8 9 3-13 3 13 8-9 3 18Z" className="bi-crown" initial={{ x: 0, y: 0, rotate: 0 }}
      animate={{ x: 150, y: 168, rotate: 70 }} transition={p(1.2, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
    {SUPPORTS.map((s, k) => <g key={`label-${s.x}`}>
      <text x={s.x} y="282" textAnchor="middle" className={gone(k) ? 'bi-label bi-on' : 'bi-label'}>{s.group}</text>
      <text x={s.x} y="298" textAnchor="middle" className="bi-small">{s.issue}</text>
      <text x={s.x} y="312" textAnchor="middle" className="bi-tiny">{s.when}</text>
    </g>)}

    <rect x="432" y="58" width="164" height="178" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.3)}>
      {active === 0 && <g>
        <path d="M514 76l12 12v24h-24V88ZM514 64v12M508 70h12M510 112v-9a4 4 0 0 1 8 0v9" className="bi-icon" />
        {['padroado: o Estado', 'interfere na Igreja;', 'bispos recusam'].map((l, k) => <text key={l} x="514" y={140 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
      </g>}
      {active === 1 && <g>
        <path d="M498 106V88q16-10 32 0v18ZM492 106h30l8 7h-38ZM498 94h32" className="bi-icon" /><path d="M542 72l-8 44M536 84h12" className="bi-icon" />
        {['oficiais punidos por', 'críticas na imprensa;', 'Exército forte desde', 'a Guerra do Paraguai'].map((l, k) => <text key={l} x="514" y={140 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
      </g>}
      {active === 2 && <g>
        <text x="514" y="84" textAnchor="middle" className="bi-panel-title">ABOLIÇÃO GRADUAL</text>
        {[['1871', 'Ventre Livre'], ['1885', 'Sexagenários'], ['1888', 'Lei Áurea']].map(([y, law], k) => <g key={y}>
          <circle cx="452" cy={110 + k * 28} r="5" className={k === 2 ? 'bi-dot bi-dot-warn' : 'bi-dot'} />
          {k < 2 && <path d={`M452 ${115 + k * 28}v18`} className="bi-tick" />}
          <text x="464" y={114 + k * 28} className="bi-small bi-strong">{y}</text>
          <text x="496" y={114 + k * 28} className="bi-small">{law}</text>
        </g>)}
        <text x="514" y="214" textAnchor="middle" className="bi-small bi-warn">sem indenização</text>
      </g>}
      {active === 3 && <g>
        <text x="514" y="92" textAnchor="middle" className="bi-date">15 nov. 1889</text>
        {['Deodoro depõe', 'D. Pedro II, sem', 'resistência armada'].map((l, k) => <text key={l} x="514" y={120 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
        <text x="514" y="184" textAnchor="middle" className="bi-small bi-strong">+ ideias republicanas</text>
        <text x="514" y="200" textAnchor="middle" className="bi-small">(positivismo)</text>
      </g>}
    </motion.g>
    <motion.text x="514" y="262" textAnchor="middle" className="bi-hand-sm" key={`a-${active === 3}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, active === 3 ? 1.6 : 0.9)}>
      {active === 3 ? 'os três de uma vez:' : 'um apoio a menos:'}
    </motion.text>
    <motion.text x="514" y="280" textAnchor="middle" className="bi-hand-sm" key={`b-${active === 3}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, active === 3 ? 1.7 : 1)}>
      {active === 3 ? 'a monarquia cai' : 'balança, não cai'}
    </motion.text>
    <text x="30" y="342" className="bi-foot">Metáfora de sustentação: os apoios não têm peso medido.</text>
  </svg>;
}

// Oligarquias: a pirâmide que o próprio resumo nomeia ("do coronel local até o
// presidente"). Cada recorte mostra o fio que liga os níveis: dependência,
// voto, reconhecimento federal, alternância café com leite.
const cx = 212;
const halfWidth = (y: number) => 36 + (y - 70) * 0.6;
const tier = (top: number, bottom: number) => `M${cx - halfWidth(top)} ${top}H${cx + halfWidth(top)}L${cx + halfWidth(bottom)} ${bottom}H${cx - halfWidth(bottom)}Z`;
const VOTERS = [70, 104, 138, 172, 252, 286, 320, 354];

export function OligarchyPyramid({ active }: Scene) {
  const p = usePaced();
  const tiers = [
    { d: tier(256, 314), on: active <= 1, label: 'eleitores dependentes', y: 310 },
    { d: tier(194, 252), on: active <= 1, label: 'coronéis e fazendas', y: 210 },
    { d: tier(132, 190), on: active >= 1 && active <= 2, label: 'oligarquias estaduais', y: 185 },
    { d: tier(70, 128), on: active >= 1, label: 'presidente', y: 123 },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Ascensão e domínio das oligarquias: pirâmide do eleitor dependente ao coronel, ao governador e ao presidente; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="bi-head-olig" />
    <text x="30" y="40" className="bi-kicker">A PIRÂMIDE OLIGÁRQUICA</text>
    {tiers.map(t => <g key={t.label}>
      <motion.path d={t.d} className="bi-tier" initial={false} animate={{ opacity: t.on ? 1 : 0.45 }} transition={p(0.4)} />
      <text x={cx} y={t.y} textAnchor="middle" className={t.on ? 'bi-small bi-strong' : 'bi-small'}>{t.label}</text>
    </g>)}
    <path d="M190 112V96l22-12 22 12v16ZM196 112v-14M205 112v-14M219 112v-14M228 112v-14" className="bi-icon" />
    {[172, 212, 252].map(x => <path key={x} d={`M${x - 12} 172v-14l12-8 12 8v14ZM${x - 3} 172v-7h6v7`} className="bi-icon" />)}
    {[150, 274].map(x => <path key={x} d={`M${x - 16} 246v-14l16-10 16 10v14ZM${x - 4} 246v-8h8v8`} className="bi-house" />)}
    <Person x={212} y={223} s={0.7} coat="bi-coat-dark" hat="brim" />
    {VOTERS.map((x, k) => <Person key={x} x={x} y={272} s={0.55} coat={k % 2 ? 'bi-coat-plain' : 'bi-coat-green'} />)}

    {VOTERS.map((x, k) => <motion.path key={`tie-${x}`} d={`M212 247Q${(x + 212) / 2} 256 ${x} 266`} className="bi-tie" initial={false}
      animate={{ pathLength: active === 0 ? 1 : 0, opacity: active === 0 ? 1 : 0 }} transition={p(0.6, active === 0 ? 0.2 + k * 0.06 : 0)} />)}
    {active === 1 && VOTERS.map((x, k) => <motion.rect key={`ballot-${x}`} width="10" height="7" rx="1" className="bi-ballot" x={x - 5} y="262"
      initial={{ opacity: 0 }} animate={p(1).duration === 0 ? { x: 212 - x, y: -170, opacity: 0 } : { x: [0, 212 - x, 212 - x, 212 - x], y: [0, -50, -110, -170], opacity: [1, 1, 1, 0] }}
      transition={p(2.2, 0.2 + k * 0.08)} />)}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <Arrow d="M166 94C118 100 104 128 124 148" on={active === 2} p={p} head="bi-head-olig" delay={0.2} />
      <Arrow d="M300 150C322 128 312 102 262 94" on={active === 2} p={p} head="bi-head-olig" delay={0.7} />
      <text x="104" y="104" textAnchor="end" className="bi-hand-sm">apoio</text>
      <text x="104" y="120" textAnchor="end" className="bi-hand-sm">federal ↓</text>
      <text x="322" y="118" className="bi-hand-sm">votos no</text>
      <text x="322" y="134" className="bi-hand-sm">Congresso ↑</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4)}>
      {/* SP e MG trocam de lado por cima do topo: a alternância na presidência. */}
      <motion.g initial={false} animate={active === 3 && p(1).duration !== 0 ? { x: [0, 72, 144], y: [0, -26, 0] } : { x: 0, y: 0 }} transition={p(1.8, 0.5)}>
        <path d="M130 98h20v-5a10 10 0 0 0-20 0ZM150 90h5a4 4 0 0 1 0 8h-5" className="bi-cup" />
        <text x="140" y="112" textAnchor="middle" className="bi-tiny bi-strong">SP</text>
      </motion.g>
      <motion.g initial={false} animate={active === 3 && p(1).duration !== 0 ? { x: [0, -72, -144], y: [0, -12, 0] } : { x: 0, y: 0 }} transition={p(1.8, 0.5)}>
        <path d="M274 98l2-16h6v-4h6v4h6l2 16Z" className="bi-jug" />
        <text x="284" y="112" textAnchor="middle" className="bi-tiny bi-strong">MG</text>
      </motion.g>
      <text x="212" y="60" textAnchor="middle" className="bi-hand-sm">revezam a presidência</text>
    </motion.g>

    <rect x="422" y="58" width="174" height="248" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.25)}>
      {active === 0 && <g>
        <text x="509" y="84" textAnchor="middle" className="bi-panel-title">CORONELISMO</text>
        {[['emprego', 'M-8 8l12-12M2 -6l6 6M-2 -2l6 6'], ['moradia', 'M-10 8v-8l10-8 10 8v8ZM-3 8v-5h6v5'], ['terra', 'M-12 8h24M-10 8v-10M0 8v-10M10 8v-10M-12 -2h24']].map(([word, d], k) => <g key={word}>
          <g transform={`translate(${452 + k * 57} 116)`}><path d={d} className="bi-icon" /></g>
          <text x={452 + k * 57} y="142" textAnchor="middle" className="bi-tiny">{word}</text>
        </g>)}
        {['dependência econômica', 'vira controle do voto', 'do trabalhador rural'].map((l, k) => <text key={l} x="509" y={176 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
      </g>}
      {active === 1 && <g>
        <text x="509" y="84" textAnchor="middle" className="bi-panel-title">VOTO DE CABRESTO</text>
        <path d="M486 108c0-14 46-14 46 0s-46 14-46 0ZM532 108h24" className="bi-rope" />
        {['vota como o coronel', 'manda; voto aberto', 'na prática', 'quem desobedece perde', 'emprego, casa ou terra'].map((l, k) => <text key={l} x="509" y={146 + k * 16} textAnchor="middle" className={k >= 3 ? 'bi-small bi-warn' : 'bi-small'}>{l}</text>)}
      </g>}
      {active === 2 && <g>
        <text x="509" y="84" textAnchor="middle" className="bi-panel-title">POLÍTICA DOS</text>
        <text x="509" y="100" textAnchor="middle" className="bi-panel-title">GOVERNADORES</text>
        <text x="509" y="120" textAnchor="middle" className="bi-small">Campos Sales, 1898–1902</text>
        <g transform="translate(509 152) rotate(-8)">
          <rect x="-44" y="-14" width="88" height="26" rx="4" className="bi-stamp" />
          <text x="0" y="4" textAnchor="middle" className="bi-stamp-text">RECONHECIDO</text>
        </g>
        {['a Comissão de Verificação', 'só reconhece eleitos', 'alinhados; a oposição', 'fica de fora'].map((l, k) => <text key={l} x="509" y={196 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
      </g>}
      {active === 3 && <g>
        <text x="509" y="84" textAnchor="middle" className="bi-panel-title">CAFÉ COM LEITE</text>
        <text x="509" y="106" textAnchor="middle" className="bi-small bi-strong">SP: café para exportar</text>
        <text x="509" y="122" textAnchor="middle" className="bi-small bi-strong">MG: peso político</text>
        <motion.g initial={{ x: -30 }} animate={{ x: 0 }} transition={p(1.4, 0.3)}>
          <path d="M470 176h72l-10 14h-54ZM488 176v-26M488 152l18 16h-18" className="bi-ship" />
          <rect x="508" y="164" width="12" height="12" rx="2" className="bi-sack" /><rect x="522" y="164" width="12" height="12" rx="2" className="bi-sack" />
        </motion.g>
        {['café financia importações;', 'na superprodução, o governo', 'compra e estoca', '(valorização do café)'].map((l, k) => <text key={l} x="509" y={214 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
      </g>}
    </motion.g>
    <text x="30" y="342" className="bi-foot">Esquema das relações de poder; os níveis não têm proporção medida.</text>
  </svg>;
}

// Declínio oligárquico: a elite cafeeira no pedestal de sacas e três
// contestações vindas de esferas diferentes para o mesmo alvo. A linha do
// tempo embaixo mantém as datas do resumo à vista.
const CHALLENGERS = [
  { x: 120, title: 'tenentismo', note: 'Copacabana, Coluna Prestes' },
  { x: 310, title: 'movimento operário', note: 'greve geral, SP 1917' },
  { x: 500, title: 'modernismo', note: 'Semana de Arte Moderna, 1922' },
];
const when = (y: number) => 40 + (y - 1917) * (540 / 13);

export function OligarchicDecline({ active }: Scene) {
  const p = usePaced();
  const hot = [[1929, 1930], [1922, 1925], [1917], [1922]][active];
  const lead = [['o café', 'sustenta a política'], ['contestação', 'nas armas'], ['contestação', 'nas fábricas'], ['contestação', 'na arte']][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Declínio oligárquico: elite cafeeira de São Paulo e Minas contestada pelo tenentismo, pelo movimento operário e pelo modernismo; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="bi-head-decl" />
    <text x="30" y="40" className="bi-kicker">PRIMEIRA REPÚBLICA · 1917–1930</text>
    <text x="310" y="64" textAnchor="middle" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>elite cafeeira de SP e MG</text>
    <text x="310" y="80" textAnchor="middle" className="bi-small">eleições fraudadas · voto de cabresto</text>
    <Person x={292} y={104} coat="bi-coat-dark" hat="top" />
    <Person x={328} y={104} coat="bi-coat-dark" hat="top" />
    {[[262, 170], [310, 170], [358, 170], [286, 140], [334, 140]].map(([x, y]) => <g key={`${x}-${y}`}>
      <path d={`M${x - 22} ${y + 28}q-2-24 6-28h32q8 4 6 28Z`} className="bi-sack-big" />
      <path d={`M${x - 8} ${y + 2}h16`} className="bi-sack-tie" />
      <text x={x} y={y + 20} textAnchor="middle" className="bi-sack-text">café</text>
    </g>)}
    {active === 0 && <motion.path d="M378 172l-8 10 6 8-8 12" className="bi-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 1.4)} />}

    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.3)}>
      <text x="30" y="96" className="bi-hand">{lead[0]}</text>
      <text x="30" y="118" className="bi-hand">{lead[1]}</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="444" y="92" className="bi-small bi-strong">preço do café</text>
      <path d="M444 100v56h140" className="bi-axis" />
      <motion.path d="M448 116l22 4 22-6 22 4 20-2 12 38" className="bi-price" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(1.2, 0.3)} />
      <text x="546" y="170" textAnchor="middle" className="bi-tiny">1929</text>
      <text x="444" y="186" className="bi-tiny">ilustrativo, sem escala</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 0 ? 0 : 1 }} transition={p(0.4)}>
      <text x="514" y="104" textAnchor="middle" className="bi-hand-sm">esferas diferentes,</text>
      <text x="514" y="122" textAnchor="middle" className="bi-hand-sm">o mesmo alvo</text>
    </motion.g>

    {CHALLENGERS.map((c, k) => {
      const on = active === k + 1;
      return <g key={c.title}>
        <Arrow d={k === 0 ? 'M150 232C184 214 214 206 236 200' : k === 1 ? 'M300 232V208' : 'M470 232C438 214 408 206 384 200'} on={on} p={p} head="bi-head-decl" delay={0.3} />
        <motion.g initial={false} animate={{ opacity: on || active === 0 ? 1 : 0.4, y: on ? -4 : 0 }} transition={p(0.4)}>
          {k === 0 && <g><Person x={120} y={236} coat="bi-coat-army" hat="kepi" /><path d="M134 276l10-40" className="bi-rifle" /></g>}
          {k === 1 && <g><path d="M258 276v-26l14-8v8l14-8v8l14-8v34ZM292 242v-16h8v24" className="bi-factory" /><Person x={334} y={244} s={0.9} coat="bi-coat-green" hat="cap" /></g>}
          {k === 2 && <g transform="translate(-10 0)"><path d="M494 276l14-44 14 44M508 232v44" className="bi-easel" /><rect x="490" y="232" width="36" height="26" rx="2" className="bi-canvas" /><path d="M496 252l8-10 6 6 8-12 6 16" className="bi-paint" /><ellipse cx="540" cy="266" rx="12" ry="8" className="bi-palette" /><circle cx="536" cy="264" r="2" className="bi-dot" /><circle cx="544" cy="268" r="2" className="bi-dot bi-dot-warn" /></g>}
        </motion.g>
        <text x={c.x} y="296" textAnchor="middle" className={on ? 'bi-label bi-on' : 'bi-label'}>{c.title}</text>
        <text x={c.x} y="311" textAnchor="middle" className="bi-small">{c.note}</text>
      </g>;
    })}

    <path d="M40 326H580" className="bi-axis" />
    {[1917, 1922, 1929].map(y => <g key={y}>
      <motion.circle cx={when(y)} cy="326" r="4" className="bi-dot" initial={false} animate={{ scale: hot.includes(y) ? 1.6 : 1 }} transition={p(0.4, 0.4)} />
      <text x={when(y)} y="343" textAnchor="middle" className={hot.includes(y) ? 'bi-tiny bi-strong' : 'bi-tiny'}>{y}</text>
    </g>)}
    <motion.rect x={when(1925)} y="322" width={when(1927) - when(1925)} height="8" rx="4" className="bi-dot" initial={false} animate={{ opacity: hot.includes(1925) ? 1 : 0.5 }} transition={p(0.4)} />
    <text x={(when(1925) + when(1927)) / 2} y="343" textAnchor="middle" className={hot.includes(1925) ? 'bi-tiny bi-strong' : 'bi-tiny'}>1925–27</text>
    <motion.circle cx="580" cy="326" r="4" className="bi-dot bi-dot-warn" initial={false} animate={{ scale: hot.includes(1930) ? 1.6 : 1 }} transition={p(0.4, 0.4)} />
    <text x="580" y="343" textAnchor="end" className={hot.includes(1930) ? 'bi-tiny bi-strong' : 'bi-tiny'}>1930</text>
  </svg>;
}
