import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './SeculoXX.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 8 da régua de História: séculos XIX e XX no mundo. Cada cena encena o
// mecanismo que o capítulo defende — duas estradas para a mesma classe, duas
// cadeias de mando colonial, a rede de alianças que a faísca de Sarajevo
// incendeia, a escada de concessões até 1939, três rachaduras que só juntas
// derrubam a democracia alemã, duas trilhas até a independência e a fileira de
// dominós de 1989. Datas, nomes e números vêm do resumo do capítulo; o que é
// desenho sem medida vem com rodapé dizendo isso.

// Europa no século XIX: o operariado parte do mesmo ponto e a cena mostra as
// duas estratégias como caminhos de forma diferente — o salto de Marx e
// Engels e a escada eleitoral da social-democracia.
const Y19 = (y: number) => 40 + (y - 1810) * (540 / 65);
const LEAP = [[160, 216], [200, 143], [256, 101], [322, 82], [362, 80]];
const STAIRS = [[160, 216], [196, 250], [232, 266], [268, 256], [304, 246], [340, 236], [372, 226]];

export function WorkerRoads({ active }: Scene) {
  const p = usePaced();
  const leapOn = active !== 1;
  const stairsOn = active !== 0;
  const hand = [
    ['as contradições do capitalismo', 'gerariam a própria superação'],
    ['reformas por dentro do', 'sistema parlamentar'],
    ['a mesma classe,', 'duas estratégias'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Europa no século XIX: do operariado industrial saem o caminho da revolução, de Marx e Engels, e o da reforma gradual, da social-democracia; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">EUROPA NO SÉCULO XIX · MOVIMENTO OPERÁRIO</text>

    <g className="sx-factory">
      <path d="M36 190v-44l22-14v14l22-14v14l22-14v58Z" />
      <path d="M104 190v-72h14v72Z" />
    </g>
    <path d="M44 172h10M64 172h10M84 172h10" className="sx-window" />
    {[0, 1].map(k => <motion.circle key={k} cx={111} cy={108 - k * 14} r={6 + k * 2} className="sx-smoke" initial={false}
      animate={{ opacity: [0, 0.8, 0.5], y: [4, 0, -2] }} transition={p(1.2, 0.2 + k * 0.3)} />)}
    <Person x={56} y={198} s={0.8} coat="bi-coat-plain" hat="cap" />
    <Person x={84} y={194} s={0.8} coat="bi-coat" hat="brim" />
    <Person x={112} y={198} s={0.8} coat="bi-coat-green" hat="cap" />
    <text x="84" y="246" textAnchor="middle" className="bi-small bi-strong">operariado industrial</text>
    <text x="84" y="260" textAnchor="middle" className="bi-tiny">sindicatos e partidos</text>
    <circle cx="160" cy="236" r="6" className="bi-seal" />

    <motion.path d="M160 236C200 124 300 94 392 104" className="sx-leap" initial={false}
      animate={{ opacity: leapOn ? 1 : 0.3, pathLength: leapOn ? 1 : 0.35 }} transition={p(0.9, 0.1)} />
    <g transform="translate(418 104)" className={leapOn ? '' : 'sx-dim'}>
      <rect x="-20" y="-8" width="18" height="12" rx="6" className="sx-link" transform="rotate(-18)" />
      <rect x="4" y="-4" width="18" height="12" rx="6" className="sx-link" transform="rotate(18)" />
      <motion.path d="M-2 -14l2-6M4 -12l6-4M2 14l1 6" className="sx-sparkline" initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.3, 0.9)} />
    </g>
    <text x="442" y="92" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>Marx e Engels</text>
    <text x="442" y="108" className="bi-small">Manifesto, 1848</text>
    <text x="442" y="124" className="bi-small">revolução proletária</text>

    <motion.path d="M160 236C170 262 186 276 214 276h36v-10h36v-10h36v-10h36v-10h36" className="sx-stairs" initial={false}
      animate={{ opacity: stairsOn ? 1 : 0.3, pathLength: stairsOn ? 1 : 0.35 }} transition={p(1.1, 0.1)} />
    {[0, 1, 2, 3].map(k => <motion.g key={k} initial={false} animate={{ opacity: stairsOn ? 1 : 0.25 }} transition={p(0.3, stairsOn ? 0.4 + k * 0.15 : 0)}>
      <rect x={260 + k * 36} y={259 - k * 10} width="11" height="9" rx="1.5" className="bi-ballot" />
      <path d={`M${263 + k * 36} ${261 - k * 10}h5`} className="sx-slot" />
    </motion.g>)}
    <g transform="translate(418 232)" className={stairsOn ? '' : 'sx-dim'}>
      <path d="M-22 -6l22-14 22 14Z" className="sx-temple" />
      <path d="M-16 -4v20M-6 -4v20M6 -4v20M16 -4v20" className="sx-temple-col" />
      <path d="M-22 18h44" className="sx-temple-col" />
    </g>
    <text x="442" y="226" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>Social-democracia</text>
    <text x="442" y="242" className="bi-small">SPD: voto e negociação</text>
    <text x="442" y="258" className="bi-small">reformas progressivas</text>

    <motion.g initial={false} animate={leapOn
      ? { x: LEAP.map(q => q[0]), y: LEAP.map(q => q[1]), opacity: 1 }
      : { x: 160, y: 216, opacity: 0 }} transition={p(1.4, 0.3)}>
      <Person x={0} y={-4} s={0.55} coat="sx-coat-red" hat="cap" />
    </motion.g>
    <motion.g initial={false} animate={stairsOn
      ? { x: STAIRS.map(q => q[0]), y: STAIRS.map(q => q[1]), opacity: 1 }
      : { x: 160, y: 216, opacity: 0 }} transition={p(1.8, 0.3)}>
      <Person x={0} y={-4} s={0.55} coat="bi-coat-army" hat="brim" />
    </motion.g>

    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.6)}>
      <text x="296" y="178" textAnchor="middle" className="bi-hand-sm">{hand[0]}</text>
      <text x="296" y="196" textAnchor="middle" className="bi-hand-sm">{hand[1]}</text>
    </motion.g>

    <path d="M40 316H580" className="bi-axis" />
    {[[1815, 'Congresso de Viena, 1815', 332, 'start', -8], [1848, 'Manifesto Comunista, 1848', 306, 'middle', 0],
      [1861, 'Itália unificada, 1861', 332, 'middle', 0], [1871, 'Império Alemão, 1871', 306, 'end', 44]].map(([y, text, ty, anchor, dx]) => <g key={y as number}>
      <motion.circle cx={Y19(y as number)} cy="316" r="4" className={y === 1848 ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false}
        animate={{ scale: y === 1848 && active === 0 ? 1.6 : 1 }} transition={p(0.4, 0.3)} />
      <text x={Y19(y as number) + (dx as number)} y={ty as number} textAnchor={anchor as 'start' | 'middle' | 'end'}
        className={y === 1848 && active === 0 ? 'bi-tiny bi-strong' : 'bi-tiny'}>{text}</text>
    </g>)}
  </svg>;
}

// Imperialismo: duas cadeias de mando lado a lado. Na direta o funcionário
// europeu desce até a colônia; na indireta a chefia local fica no meio e a
// pilha de moedas da metrópole encolhe — é o argumento do custo. À direita, a
// régua de Berlim sobre um contorno esquemático da África.
const AFRICA: [number, number][] = [[-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 28], [38, 18], [43, 12], [51, 12], [46, 2], [40, -5], [40, -15], [35, -24],
  [32, -29], [27, -34], [20, -35], [18, -32], [12, -18], [13, -9], [9, -1], [9, 4], [4, 6], [-4, 5], [-8, 4], [-13, 8], [-17, 14], [-17, 21], [-13, 27], [-10, 30]];
const af = ([lon, lat]: [number, number]) => `${(352 + (lon + 20) * 2.2).toFixed(1)} ${(58 + (38 - lat) * 2.2).toFixed(1)}`;
const AFRICA_D = `M${AFRICA.map(af).join('L')}Z`;
const RULER: [number, number][][] = [[[-12, 22], [26, 22]], [[25, 34], [25, 20]], [[8, 22], [8, 8]], [[14, 4], [30, 4]], [[16, -6], [38, -6]], [[22, -18], [34, -18]], [[-2, 14], [14, 14]]];

export function ColonialRule({ active }: Scene) {
  const p = usePaced();
  const cols = [
    { c: 100, name: 'França', mid: 'funcionário europeu', type: 'Direta', note: 'administra e impõe', on: active !== 1 },
    { c: 250, name: 'Reino Unido', mid: 'chefia local mantida', type: 'Indireta', note: 'delega: custa menos', on: active !== 0 },
  ];
  const hand = ['a metrópole governa direto', 'o chefe local serve à metrópole', 'dois tipos, o mesmo imperialismo'][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Imperialismo: dominação direta francesa e dominação indireta britânica, com a partilha da África na Conferência de Berlim; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">IMPERIALISMO · 1870–1914</text>
    <ArrowHead id="sx-head-imp" />
    {cols.map((col, k) => <g key={col.name}>
      <motion.rect x={col.c - 68} y="50" width="136" height="258" rx="12" className="bi-band" initial={false}
        animate={{ opacity: col.on ? 1 : 0 }} transition={p(0.4)} />
      <g transform={`translate(${col.c} 84)`} className={col.on ? '' : 'sx-dim'}>
        <path d="M-22 12v-16l22-12 22 12v16Z" className="sx-metro" />
        <path d="M-12 12v-12M0 12v-12M12 12v-12" className="sx-temple-col" />
        <path d="M0 -16v-12" className="bi-pole" />
        <path d="M0 -28h14l-4 4 4 4H0Z" className={k === 0 ? 'sx-flag-a' : 'sx-flag-b'} />
      </g>
      <text x={col.c} y="116" textAnchor="middle" className={col.on ? 'bi-label bi-on' : 'bi-label'}>{col.name}</text>
      <motion.g initial={false} animate={k === 0
        ? { y: col.on ? [-24, 0] : 0, opacity: col.on ? 1 : 0.3 }
        : { scale: col.on ? [0.7, 1.12, 1] : 0.85, opacity: col.on ? 1 : 0.3 }} transition={p(0.7, 0.3)}
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        {k === 0 ? <Person x={col.c} y={156} s={0.9} coat="bi-coat" hat="top" />
          : <g><Person x={col.c} y={156} s={0.9} coat="sx-coat-chief" /><path d={`M${col.c - 7} 152q7-12 14 0q-7 3-14 0Z`} className="sx-wrap" /></g>}
      </motion.g>
      <text x={col.c} y="202" textAnchor="middle" className="bi-tiny">{col.mid}</text>
      {[-24, 0, 24].map(dx => <Person key={dx} x={col.c + dx} y={226} s={0.66} coat={['bi-coat-plain', 'bi-coat-green', 'bi-coat-plain'][(dx + 24) / 24]} />)}
      <Arrow d={`M${col.c + 30} 90C${col.c + 60} 104 ${col.c + 56} 136 ${col.c + 22} 150`} on={col.on} p={p} head="sx-head-imp" delay={0.2} />
      <Arrow d={`M${col.c + 30} 176C${col.c + 64} 192 ${col.c + 64} 222 ${col.c + 38} 234`} on={col.on} p={p} head="sx-head-imp" delay={0.6} />
      <text x={col.c} y="286" textAnchor="middle" className={col.on ? 'bi-label bi-on' : 'bi-label'}>{col.type}</text>
      <text x={col.c} y="302" textAnchor="middle" className="bi-small">{col.note}</text>
      <text x={col.c} y="268" textAnchor="middle" className="bi-tiny">colonizados</text>
    </g>)}
    {[0, 1, 2].map(k => <motion.ellipse key={k} cx="196" cy={80 - k * 6} rx="11" ry="4" className="sx-coin" initial={false}
      animate={{ opacity: active === 1 && k > 0 ? 0 : cols[1].on ? 1 : 0.35, y: active === 1 && k > 0 ? -10 : 0 }} transition={p(0.5, 0.6 + k * 0.15)} />)}
    <text x="196" y="96" textAnchor="middle" className="bi-tiny">custo</text>
        <motion.text key={active} x="175" y="326" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>{hand}</motion.text>

    <rect x="334" y="50" width="262" height="248" rx="14" className="bi-panel" />
    <clipPath id="sx-africa-clip"><path d={AFRICA_D} /></clipPath>
    <path d={AFRICA_D} className="bi-land" />
    <g clipPath="url(#sx-africa-clip)">
      {RULER.map(([a, b], k) => <motion.path key={k} d={`M${af(a)}L${af(b)}`} className="sx-ruler" initial={false}
        animate={{ pathLength: 1, opacity: active === 2 ? 1 : 0.7 }} transition={p(0.5, 0.2 + k * 0.18)} />)}
    </g>
    <g transform="translate(548 84) rotate(-35)">
      <rect x="-24" y="-5" width="48" height="10" rx="2" className="sx-rule" />
      <path d="M-18 -5v4M-10 -5v4M-2 -5v4M6 -5v4M14 -5v4" className="sx-rule-tick" />
    </g>
    <text x="350" y="246" className="bi-small bi-strong">Conferência de Berlim, 1884–1885</text>
    <text x="350" y="264" className="bi-small">partilha só entre europeus</text>
    <text x="350" y="282" className="bi-small">fronteiras ignoram etnias e línguas</text>
    <text x="30" y="342" className="bi-foot">Contorno esquemático da África; linhas de fronteira ilustrativas.</text>
  </svg>;
}

// Primeira Guerra: a rede de alianças é o paiol, a pressão acumulada é o calor
// e Sarajevo é a faísca. No terceiro recorte a faísca corre o pavio e o
// clarão passa de nó em nó pelas próprias alianças.
const NATIONS = [
  { id: 'uk', name: 'Reino Unido', x: 90, y: 96, bloc: 'e', wave: 5, dy: -22 },
  { id: 'fr', name: 'França', x: 96, y: 196, bloc: 'e', wave: 4 },
  { id: 'ru', name: 'Rússia', x: 330, y: 92, bloc: 'e', wave: 2, dy: -22 },
  { id: 'de', name: 'Alemanha', x: 196, y: 132, bloc: 'a', wave: 3, dy: -22 },
  { id: 'ah', name: 'Áustria-Hungria', x: 250, y: 206, bloc: 'a', wave: 1, dx: -10, dy: 30, anchor: 'start' },
  { id: 'it', name: 'Itália', x: 176, y: 262, bloc: 'a', wave: 6 },
] as const;
const TIES = [
  { d: 'M196 132L250 206', bloc: 'a' }, { d: 'M250 206L176 262', bloc: 'a' }, { d: 'M176 262L196 132', bloc: 'a' },
  { d: 'M90 96L96 196', bloc: 'e' }, { d: 'M90 96Q210 36 330 92', bloc: 'e' }, { d: 'M96 196Q250 176 330 92', bloc: 'e' },
];

export function AllianceFuse({ active }: Scene) {
  const p = usePaced();
  const fire = active === 2;
  const tension = [0.55, 0.9, 1][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Primeira Guerra Mundial: alianças rígidas, pressão acumulada de nacionalismo e corrida armamentista, e Sarajevo como estopim; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">PRIMEIRA GUERRA MUNDIAL · 1914–1918</text>
    {TIES.map((t, k) => <motion.path key={t.d} d={t.d} className={t.bloc === 'a' ? 'sx-tie-a' : 'sx-tie-e'} initial={false}
      animate={{ pathLength: 1, opacity: active === 0 || fire ? 1 : 0.55, strokeWidth: active === 0 ? 4 : 2.6 }} transition={p(0.6, active === 0 ? k * 0.15 : 0)} />)}
    <motion.path d="M340 244Q330 206 266 204" className="sx-fuse" initial={false} animate={{ opacity: fire ? 1 : 0.5 }} transition={p(0.3)} />
    {NATIONS.map(n => <g key={n.id}>
      <motion.circle cx={n.x} cy={n.y} r="16" className="sx-flash" initial={false}
        animate={fire ? { scale: [0.8, 2.2], opacity: [0, 0.9, 0] } : { scale: 0.8, opacity: 0 }} transition={p(0.8, 1.2 + n.wave * 0.28)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <circle cx={n.x} cy={n.y} r="15" className={n.bloc === 'a' ? 'sx-node-a' : 'sx-node-e'} />
      <path transform={`translate(${n.x} ${n.y})`} d="M-6 -7h12v7q0 6-6 9q-6-3-6-9Z" className="sx-shield" />
      <text x={n.x + ('dx' in n ? n.dx : 0)} y={n.y + ('dy' in n ? n.dy : 29)} textAnchor={'anchor' in n ? n.anchor : 'middle'} className="bi-tiny bi-strong">{n.name}</text>
    </g>)}
    <g transform="translate(340 244)">
      <path d="M-10 6l10-18 10 18Z" className="sx-hill" />
      <motion.circle r="5" className="sx-spark" initial={false}
        animate={fire ? { cx: [0, -8, -34, -72], cy: [0, -24, -38, -40], opacity: [1, 1, 1, 0], scale: [1, 1.3, 1, 0.6] } : { cx: 0, cy: 0, opacity: 0.7, scale: 1 }}
        transition={p(1.1, 0.2)} />
    </g>
    <text x="372" y="272" textAnchor="end" className={fire ? 'bi-tiny bi-strong' : 'bi-tiny'}>Sarajevo, jun. 1914</text>

    <rect x="384" y="52" width="210" height="246" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="400" y="76" className="bi-panel-title">ALIANÇAS RÍGIDAS</text>
      <text x="400" y="100" className="bi-small">todas as potências presas</text>
      <text x="400" y="116" className="bi-small">em dois blocos fechados</text>
      <text x="400" y="146" className="bi-hand-sm">um conflito localizado</text>
      <text x="400" y="164" className="bi-hand-sm">arrasta os aliados</text>
      <path d="M404 186h40M404 186l6-4M404 186l6 4M540 186h40M580 186l-6-4M580 186l-6 4" className="bi-arrow-static" />
      <circle cx="492" cy="186" r="7" className="sx-spark" />
      <text x="492" y="214" textAnchor="middle" className="bi-tiny">bilateral vira generalizada</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="400" y="76" className="bi-panel-title">PRESSÃO ACUMULADA</text>
      <motion.g initial={false} animate={{ x: active === 1 ? [18, 0] : 18 }} transition={p(0.8, 0.2)}>
        <path d="M402 110h54l-8 10h-40Z" className="sx-ship" /><path d="M418 110v-8h14v8M424 102v-6M436 106h12" className="sx-ship-line" />
      </motion.g>
      <motion.g initial={false} animate={{ x: active === 1 ? [-18, 0] : -18 }} transition={p(0.8, 0.2)}>
        <path d="M578 110h-54l8 10h40Z" className="sx-ship" /><path d="M562 110v-8h-14v8M556 102v-6M544 106h-12" className="sx-ship-line" />
      </motion.g>
      <text x="489" y="140" textAnchor="middle" className="bi-small bi-strong">corrida naval</text>
      <text x="489" y="154" textAnchor="middle" className="bi-tiny">Alemanha × Reino Unido</text>
      {['nacionalismo exacerbado', 'rivalidade colonial', 'e comercial'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: active === 1 ? 1 : 0, x: active === 1 ? 0 : -8 }} transition={p(0.4, 0.5 + k * 0.15)}>
        {k !== 2 && <circle cx="404" cy={178 + k * 20} r="3.5" className="bi-dot bi-dot-warn" />}
        <text x="414" y={182 + k * 18} className="bi-small">{line}</text>
      </motion.g>)}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: fire ? 1 : 0 }} transition={p(0.4)}>
      <text x="400" y="76" className="bi-panel-title">O ESTOPIM · 1914</text>
      <text x="400" y="100" className="bi-small">arquiduque Francisco</text>
      <text x="400" y="116" className="bi-small">Ferdinando, morto por</text>
      <text x="400" y="132" className="bi-small">um nacionalista sérvio</text>
      <text x="400" y="160" className="bi-small bi-strong">crise balcânica regional</text>
      <text x="400" y="176" className="bi-small">vira guerra continental</text>
      <text x="400" y="212" className="bi-hand">estopim, não</text>
      <text x="400" y="232" className="bi-hand">causa suficiente</text>
    </motion.g>
    <text x="400" y="264" className="bi-tiny">tensão estrutural</text>
    <rect x="400" y="272" width="178" height="12" rx="6" className="bi-gauge" />
    <motion.rect x="400" y="272" height="12" rx="6" className="bi-gauge-fill" initial={false} animate={{ width: 178 * tension }} transition={p(0.9, 0.2)} />

    <circle cx="36" cy="314" r="6" className="sx-node-a" />
    <text x="48" y="318" className="bi-tiny">Tríplice Aliança</text>
    <circle cx="150" cy="314" r="6" className="sx-node-e" />
    <text x="162" y="318" className="bi-tiny">Tríplice Entente</text>
    <text x="30" y="342" className="bi-foot">Posições esquemáticas, não um mapa; barra de tensão ilustrativa.</text>
  </svg>;
}

// Entreguerras: a cadeia do capítulo no alto, uma cena por elo no meio e a
// linha do tempo de 1918 a 1939 embaixo, com os anos do elo aceso.
const Y20 = (y: number) => 40 + (y - 1918) * (540 / 21);
const LINKS = ['Crise de 1929', 'Totalitarismos', 'Apaziguamento', 'Guerra, 1939'];
const HOT20 = [[1929, 1933], [1922, 1924, 1933], [1936, 1938, 1939]];
const REGIMES = [
  { x: 30, name: 'Itália', who: 'Mussolini', a: 'fascismo fundado em 1919', b: 'Marcha sobre Roma, 1922' },
  { x: 222, name: 'URSS', who: 'Stalin', a: 'coletivização forçada', b: 'Grande Terror, anos 1930' },
  { x: 414, name: 'Alemanha', who: 'nazismo', a: 'no poder em 1933', b: 'crise ainda mais aguda' },
];
const STONES = [
  { x: 176, name: 'Renânia', sub: '', year: '1936' },
  { x: 284, name: 'Áustria', sub: '', year: '1938' },
  { x: 392, name: 'parte da', sub: 'Tchecoslováquia', year: '1938' },
];

export function InterwarChain({ active }: Scene) {
  const p = usePaced();
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Período entreguerras: Crise de 1929, ascensão dos totalitarismos e fracasso do apaziguamento até a guerra de 1939; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ENTREGUERRAS · 1918–1939</text>
    <ArrowHead id="sx-head-int" />
    {LINKS.map((l, k) => {
      const x = 30 + k * 146;
      const w = k === 3 ? 118 : 124;
      const on = k === active || (active === 2 && k === 3);
      return <g key={l}>
        <motion.rect x={x} y="52" width={w} height="26" rx="13" className={on ? 'sx-chip sx-chip-on' : 'sx-chip'} initial={false}
          animate={{ opacity: k <= active + (active === 2 ? 1 : 0) ? 1 : 0.45 }} transition={p(0.4)} />
        <text x={x + w / 2} y="69" textAnchor="middle" className={on ? 'sx-chip-text-on' : 'bi-small bi-strong'}>{l}</text>
        {k < 3 && <path d={`M${x + w + 4} 65h12`} className="bi-arrow-static" markerEnd="url(#sx-head-int)" />}
      </g>;
    })}

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="44" y="104" className="bi-tiny bi-strong">bolsa de Nova York</text>
      <path d="M44 112v118h220" className="bi-axis" />
      <motion.path d="M48 206L84 196L114 182L144 166L174 148L198 132L208 214L240 222L258 224" className="sx-chart" initial={false}
        animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(1.4, 0.2)} />
      <circle cx="204" cy="176" r="12" className="sx-ring" />
      <text x="204" y="248" textAnchor="middle" className="bi-small bi-strong">outubro de 1929</text>
      <text x="44" y="266" className="bi-tiny">curva ilustrativa, sem escala</text>
      <g transform="translate(318 162)">
        {[0, 1, 2].map(k => <motion.circle key={k} r="26" className="sx-ripple" initial={false}
          animate={active === 0 ? { scale: [1, 1.9 + k * 0.2], opacity: [0.8, 0] } : { scale: 1, opacity: 0 }} transition={p(1.2, 1 + k * 0.35)} />)}
        <circle r="24" className="sx-globe" />
        <text y="44" textAnchor="middle" className="bi-tiny">espalha-se</text>
        <text y="56" textAnchor="middle" className="bi-tiny">pelo mundo</text>
        <path d="M-24 0h48M0 -24v48M-17 -17q17 17 0 34M17 -17q-17 17 0 34M-20 -12h40M-20 12h40" className="sx-globe-line" />
      </g>
      {['desemprego massivo', 'bancos e empresas falidos', 'comércio mundial em colapso'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: active === 0 ? 1 : 0, x: active === 0 ? 0 : -8 }} transition={p(0.4, 1.2 + k * 0.2)}>
        <circle cx="370" cy={120 + k * 22} r="3.5" className="bi-dot bi-dot-warn" />
        <text x="380" y={124 + k * 22} className="bi-small">{line}</text>
      </motion.g>)}
      <rect x="364" y="194" width="224" height="62" rx="10" className="bi-block" />
      <text x="376" y="214" className="bi-small bi-strong">New Deal · Roosevelt, 1933</text>
      <text x="376" y="230" className="bi-tiny">obras públicas, regulação, assistência</text>
      <text x="376" y="246" className="bi-tiny">rompe o liberalismo clássico</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      {REGIMES.map((r, k) => <motion.g key={r.name} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 10 }} transition={p(0.5, 0.2 + k * 0.3)}>
        <rect x={r.x} y="94" width="176" height="152" rx="12" className="bi-block" />
        <g transform={`translate(${r.x + 36} 132)`}>
          {k === 0 && <g><path d="M-10 22V-10M10 22V-10M-14 -10h28M-14 -16h28v6h-28ZM-14 22h28" className="bi-icon" /><path d="M-4 -2v16M4 -2v16" className="sx-flute" /></g>}
          {k === 1 && <g><path d="M-16 22V4l8-5v5l8-5v5l8-5v23ZM10 4V-14h6v26" className="bi-icon" /><path d="M-4 -18q-8 8 0 18M-4 -18q8 8 0 18M-4 0v-24" className="sx-wheat" /></g>}
          {k === 2 && <g><path d="M-14 22h28l-4-14h-20ZM0 8V-6" className="bi-icon" /><path d="M0 -6l14-8v20l-14-6Z" className="sx-horn" /><path d="M18 -10q5 6 0 12M22 -14q9 10 0 20" className="sx-wave" /></g>}
        </g>
        <text x={r.x + 72} y="124" className="bi-label">{r.name}</text>
        <text x={r.x + 72} y="142" className="bi-small">{r.who}</text>
        <text x={r.x + 14} y="192" className="bi-tiny">{r.a}</text>
        <text x={r.x + 14} y="208" className="bi-tiny">{r.b}</text>
        <path d={`M${r.x + 14} 222h148`} className="sx-rule-line" />
        <text x={r.x + 14} y="236" className="bi-tiny bi-strong">{k === 1 ? 'esquerda revolucionária' : 'extrema direita'}</text>
      </motion.g>)}
      <text x="310" y="272" textAnchor="middle" className="bi-hand-sm">crise do pós-guerra e de 1929 como terreno comum</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <Person x={54} y={134} s={0.9} coat="bi-coat-dark" hat="top" />
      <Person x={88} y={138} s={0.9} coat="bi-coat-royal" hat="top" />
      <text x="72" y="192" textAnchor="middle" className="bi-tiny bi-strong">Reino Unido</text>
      <text x="72" y="204" textAnchor="middle" className="bi-tiny bi-strong">e França cedem</text>
      {STONES.map((s, k) => <motion.g key={s.name + s.sub} initial={false}
        animate={{ opacity: active === 2 ? 1 : 0, y: active === 2 ? [12, 0] : 12 }} transition={p(0.5, 0.2 + k * 0.45)}>
        <path transform={`translate(${s.x} 162)`} d="M-30 4q-4-14 9-18t22 2q14-4 22 5t-4 18q-9 7-24 4t-25-11Z" className="sx-stone" />
        <text x={s.x} y="163" textAnchor="middle" className="bi-date">{s.year}</text>
        <text x={s.x} y="200" textAnchor="middle" className="bi-small bi-strong">{s.name}</text>
        {s.sub && <text x={s.x} y="214" textAnchor="middle" className="bi-small bi-strong">{s.sub}</text>}
      </motion.g>)}
      {[['M120 150Q148 118 170 140', 0.4], ['M210 142Q236 112 262 138', 0.85], ['M318 142Q344 112 370 138', 1.3], ['M428 142Q468 108 502 140', 1.75]].map(([d, delay]) =>
        <Arrow key={d as string} d={d as string} on={active === 2} p={p} head="sx-head-int" delay={delay as number} />)}
      <motion.g initial={false} animate={{ scale: active === 2 ? [0, 1.2, 1] : 0 }} transition={p(0.6, 2.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path transform="translate(530 160) scale(1.4)" d="M0 -30c12 10 18 19 18 28a18 18 0 0 1-36 0c0-9 6-15 11-20 0 7 3 12 7 12 0-9-3-14 0-20Z" className="bi-flame" />
      </motion.g>
      <text x="530" y="206" textAnchor="middle" className="bi-date">1939</text>
      <text x="530" y="222" textAnchor="middle" className="bi-small bi-strong">guerra</text>
      <text x="310" y="252" textAnchor="middle" className="bi-hand-sm">cada concessão encoraja a próxima exigência</text>
      <text x="310" y="272" textAnchor="middle" className="bi-tiny">trauma da guerra + aposta de que concessões bastariam</text>
    </motion.g>

    <path d="M40 306H580" className="bi-axis" />
    {[1918, 1920, 1922, 1924, 1929, 1933, 1936, 1938, 1939].map(y => {
      const hot = HOT20[active].includes(y);
      return <g key={y}>
        <motion.circle cx={Y20(y)} cy="306" r="4" className={hot ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false}
          animate={{ scale: hot ? 1.6 : 1 }} transition={p(0.4, 0.3)} />
        <text x={y === 1918 ? 36 : Y20(y)} y={y === 1939 ? 296 : 322} textAnchor={y === 1918 ? 'start' : y === 1939 ? 'end' : 'middle'}
          className={hot ? 'bi-tiny bi-strong' : 'bi-tiny'}>{y}</text>
      </g>;
    })}
    <text x={Y20(1920)} y="336" textAnchor="middle" className="bi-tiny">Liga das Nações</text>
    <text x={Y20(1924)} y="336" textAnchor="middle" className="bi-tiny">Lênin morre</text>
  </svg>;
}

// Nazismo: três rachaduras numa mesma fachada. Nos três primeiros recortes a
// cena mostra cada fator sozinho, e o edifício da democracia fica de pé; só
// no quarto, com as três juntas, ele cede e aparece o caminho legal de 1933.
// Sem iconografia do regime: o painel da direita mostra mecanismos.
const FACTORS = [
  { y: 58, title: 'Hiperinflação · 1923', sub: 'desespero econômico', crack: 'M-38 0l6 14-5 12 7 16-4 18' },
  { y: 122, title: 'Depressão de 1929', sub: 'crédito americano recua', crack: 'M-8 0l-5 16 7 14-6 14 5 16' },
  { y: 186, title: 'Democracia frágil', sub: 'fraqueza institucional', crack: 'M26 0l5 12-6 16 6 12-4 20' },
];

export function DemocracyCracks({ active }: Scene) {
  const p = usePaced();
  const all = active === 3;
  const lit = (k: number) => all || active === k;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Nazismo na Alemanha: hiperinflação, Grande Depressão e fragilidade institucional só em combinação levam a 1933; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ALEMANHA · BASES DA ASCENSÃO NAZISTA</text>
    <ArrowHead id="sx-head-naz" />
    {FACTORS.map((f, k) => <g key={f.title}>
      <motion.rect x="26" y={f.y} width="200" height="54" rx="10" className={lit(k) ? 'bi-block sx-block-on' : 'bi-block'} initial={false}
        animate={{ opacity: lit(k) ? 1 : 0.5 }} transition={p(0.4)} />
      <g transform={`translate(50 ${f.y + 27})`}>
        {k === 0 && [0, 1, 2, 3].map(j => <motion.g key={j} initial={false} animate={{ y: lit(k) ? -j * 5 : -j * 2, opacity: lit(k) || j < 2 ? 1 : 0 }} transition={p(0.4, 0.2 + j * 0.15)}>
          <rect x="-14" y="4" width="28" height="12" rx="2" className="sx-note" /><circle cx="0" cy="10" r="3" className="sx-note-mark" />
        </motion.g>)}
        {k === 1 && <g>{[-10, 0, 10].map(dx => <Person key={dx} x={dx} y={-8} s={0.5} coat="bi-coat-dark" />)}<path d="M-16 12h32" className="bi-ground" /></g>}
        {k === 2 && <g><path d="M-12 14V-10M12 14V-10M-16 -10h32M-16 14h32" className="bi-icon" /><motion.path d="M-2 -8l4 8-4 6 3 8" className="bi-crack" initial={false} animate={{ pathLength: lit(k) ? 1 : 0, opacity: lit(k) ? 1 : 0 }} transition={p(0.5, 0.3)} /></g>}
      </g>
      <text x="76" y={f.y + 24} className={lit(k) ? 'bi-small bi-strong bi-on' : 'bi-small bi-strong'}>{f.title}</text>
      <text x="76" y={f.y + 40} className="bi-tiny">{f.sub}</text>
      <Arrow d={`M228 ${f.y + 27}C244 ${f.y + 27} 242 ${150 + k * 30} 256 ${150 + k * 30}`} on={lit(k)} p={p} head="sx-head-naz" delay={0.3} />
    </g>)}

    <motion.g initial={false} animate={{ rotate: all ? -3 : 0, y: all ? 6 : 0 }} transition={p(0.8, 1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom left' }}>
      <path d="M264 132l54-30 54 30Z" className="sx-temple" />
      {[276, 302, 334, 360].map(x => <rect key={x} x={x - 7} y="134" width="14" height="80" rx="2" className="sx-column" />)}
      <rect x="262" y="214" width="112" height="10" rx="2" className="sx-temple" />
      <g transform="translate(318 138)">
        {FACTORS.map((f, k) => <motion.path key={f.title} d={f.crack} className="bi-crack" initial={false}
          animate={{ pathLength: lit(k) ? 1 : 0, opacity: lit(k) ? 1 : 0 }} transition={p(0.7, 0.5 + (all ? k * 0.25 : 0))} />)}
      </g>
    </motion.g>
    <text x="318" y="246" textAnchor="middle" className="bi-small bi-strong">democracia alemã</text>
    <motion.text key={active} x="318" y="268" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.9)}>
      {all ? 'juntos, abrem caminho' : 'sozinho, não basta'}
    </motion.text>

    <rect x="398" y="52" width="196" height="238" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: all ? 0 : 1 }} transition={p(0.4)}>
      <text x="412" y="76" className="bi-panel-title">CONDIÇÕES REUNIDAS?</text>
      {['1923', '1929', 'democracia frágil'].map((slot, k) => <g key={slot}>
        <rect x="414" y={94 + k * 44} width="164" height="32" rx="16" className={active === k ? 'sx-slot-box sx-slot-on' : 'sx-slot-box'} />
        <motion.circle cx="434" cy={110 + k * 44} r="8" className="sx-slot-dot" initial={false}
          animate={{ scale: active === k ? [0.4, 1.3, 1] : 0.6, opacity: active === k ? 1 : 0.35 }} transition={p(0.5, 0.5)} />
        <text x="452" y={114 + k * 44} className={active === k ? 'bi-small bi-strong' : 'bi-small'}>{slot}</text>
      </g>)}
      <text x="496" y="248" textAnchor="middle" className="bi-hand-sm">falta a combinação:</text>
      <text x="496" y="266" textAnchor="middle" className="bi-hand-sm">uma só não abre</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: all ? 1 : 0 }} transition={p(0.4, 1.4)}>
      <text x="412" y="76" className="bi-panel-title">1933 · POR VIAS LEGAIS</text>
      {[['Hitler, chanceler', 'nomeado por Hindenburg'], ['Decreto do Incêndio', 'do Reichstag'], ['Lei de Plenos Poderes', '']].map(([a, b], k) => <motion.g key={a}
        initial={false} animate={{ opacity: all ? 1 : 0, x: all ? 0 : -8 }} transition={p(0.4, 1.6 + k * 0.3)}>
        <circle cx="418" cy={96 + k * 38} r="4" className="bi-dot" />
        {k < 2 && <path d={`M418 ${102 + k * 38}v26`} className="bi-tick" />}
        <text x="430" y={100 + k * 38} className="bi-small bi-strong">{a}</text>
        {b && <text x="430" y={114 + k * 38} className="bi-tiny">{b}</text>}
      </motion.g>)}
      <g transform="translate(436 222)">
        <path d="M-10 -6h6l12-8v28l-12-8h-6Z" className="bi-icon" /><path d="M12 -6q5 6 0 12" className="bi-icon" />
      </g>
      <g transform="translate(500 222)">
        <path d="M-12 14v-28h24v28ZM-12 -14l24 28" className="bi-icon" /><circle cx="6" cy="0" r="2" className="sx-note-mark" />
      </g>
      <g transform="translate(564 222)">
        <rect x="-10" y="-12" width="20" height="24" rx="2" className="bi-ballot" /><path d="M-14 -14l28 28M14 -14l-28 28" className="bi-cross" />
      </g>
      <text x="436" y="252" textAnchor="middle" className="bi-tiny">propaganda</text>
      <text x="436" y="264" textAnchor="middle" className="bi-tiny">(Goebbels)</text>
      <text x="500" y="252" textAnchor="middle" className="bi-tiny">Gestapo</text>
      <text x="564" y="252" textAnchor="middle" className="bi-tiny">oposição</text>
      <text x="564" y="264" textAnchor="middle" className="bi-tiny">eliminada</text>
    </motion.g>
    <text x="30" y="316" className="bi-small">pano de fundo: Tratado de Versalhes (1919) e ressentimento nacionalista</text>
    <text x="30" y="342" className="bi-foot">Rachaduras ilustrativas: mostram combinação, não medem o peso de cada fator.</text>
  </svg>;
}

// Descolonização: duas trilhas do mesmo ponto de partida (o pós-guerra).
// A indiana anda em passos contínuos e se parte em duas no fim; a argelina é
// uma linha quebrada em chamas que só termina em 1962.
const STEPS = Array.from({ length: 8 }, (_, k) => 170 + k * 22);

export function Decolonization({ active }: Scene) {
  const p = usePaced();
  const aOn = active !== 1;
  const bOn = active !== 0;
  const hand = [['negociada, mas partida', 'em dois Estados'], ['guerra longa, porque a', 'França não aceitava perder'], ['postura da metrópole +', 'condições da colônia']][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Descolonização afro-asiática: trajetória negociada da Índia em 1947 e guerra de libertação da Argélia até 1962; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">DESCOLONIZAÇÃO AFRO-ASIÁTICA</text>
    <ArrowHead id="sx-head-dec" />

    <rect x="24" y="52" width="114" height="238" rx="12" className="bi-panel" />
    <text x="81" y="72" textAnchor="middle" className="bi-panel-title">PÓS-1945</text>
    <g transform="translate(81 98)">
      <path d="M-18 12v-14l18-10 18 10v14ZM-10 12v-8M0 12v-8M10 12v-8" className="bi-icon" />
      <path d="M4 -8l-4 8 5 4-3 8" className="bi-crack" />
    </g>
    <text x="81" y="128" textAnchor="middle" className="bi-tiny">metrópoles</text>
    <text x="81" y="140" textAnchor="middle" className="bi-tiny">exauridas</text>
    <g transform="translate(81 166)">
      <circle r="13" className="sx-globe" /><path d="M-13 0h26M0 -13v26M-9 -9q9 9 0 18M9 -9q-9 9 0 18" className="sx-globe-line" />
      <path d="M-18 8q-4-10 2-20M18 8q4-10-2-20" className="sx-laurel" />
    </g>
    <text x="81" y="196" textAnchor="middle" className="bi-tiny">ONU, 1945:</text>
    <text x="81" y="208" textAnchor="middle" className="bi-tiny">autodeterminação</text>
    <g transform="translate(81 236)">
      <Person x={-10} y={-12} s={0.5} coat="bi-coat-green" />
      <Person x={10} y={-12} s={0.5} coat="bi-coat-plain" />
    </g>
    <text x="81" y="260" textAnchor="middle" className="bi-tiny">nacionalismos</text>
    <text x="81" y="272" textAnchor="middle" className="bi-tiny">nas colônias</text>

    <g className={aOn ? '' : 'sx-dim'}>
      <text x="156" y="76" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>Índia britânica</text>
      <text x="156" y="92" className="bi-small">não violência · Gandhi</text>
      {STEPS.map((x, k) => <motion.ellipse key={x} cx={x} cy={k % 2 ? 128 : 120} rx="5" ry="3" className="sx-step" initial={false}
        animate={{ opacity: aOn ? 1 : 0.3 }} transition={p(0.2, aOn ? 0.2 + k * 0.12 : 0)} />)}
      <circle cx="344" cy="124" r="6" className="bi-seal" />
      <text x="344" y="150" textAnchor="middle" className="bi-date">1947</text>
      <Arrow d="M352 120L416 100" on={aOn} p={p} head="sx-head-dec" delay={1.2} />
      <Arrow d="M352 128L416 148" on={aOn} p={p} head="sx-head-dec" delay={1.2} />
      <text x="428" y="100" className="bi-small bi-strong">Índia</text>
      <text x="428" y="114" className="bi-tiny">maioria hindu</text>
      <text x="428" y="148" className="bi-small bi-strong">Paquistão</text>
      <text x="428" y="162" className="bi-tiny">maioria muçulmana</text>
      <motion.path d="M420 124h150" className="sx-partition" initial={false} animate={{ pathLength: aOn ? 1 : 0 }} transition={p(0.6, 1.6)} />
            <text x="428" y="186" className="bi-tiny bi-strong">partição violenta:</text>
      <text x="428" y="198" className="bi-tiny">milhões de pessoas deslocadas</text>
    </g>
    <motion.g initial={false} animate={{ x: aOn ? [0, 136] : 0, opacity: aOn ? 1 : 0.3 }} transition={p(1.4, 0.2)}>
      <Person x={176} y={96} s={0.6} coat="sx-coat-light" />
      <path d="M184 104l6 22" className="sx-staff" />
    </motion.g>

    <g className={bOn ? '' : 'sx-dim'}>
      <text x="156" y="222" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>Argélia francesa</text>
      <text x="156" y="238" className="bi-small">para a França, território nacional</text>
      <motion.path d="M160 272l20-14 18 22 20-20 20 18 20-22 22 20 20-16 22 20 20-18 20 14 18-4" className="sx-zig" initial={false}
        animate={{ pathLength: bOn ? 1 : 0.2 }} transition={p(1.6, 0.2)} />
      {[214, 290, 364].map((x, k) => <g key={x} transform={`translate(${x} 262)`}>
        <motion.path d="M0 -14c6 5 9 9 9 13a9 9 0 0 1-18 0c0-4 3-7 5-9 0 3 2 5 4 5 0-4-2-6 0-9Z" className="bi-flame"
          initial={false} animate={{ scale: bOn ? [0, 1.2, 1] : 0.6, opacity: bOn ? 1 : 0.3 }} transition={p(0.5, 0.5 + k * 0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      </g>)}
      <text x="160" y="298" textAnchor="middle" className="bi-tiny bi-strong">1954</text>
      <circle cx="408" cy="272" r="6" className="bi-seal" />
      <text x="408" y="298" textAnchor="middle" className="bi-tiny bi-strong">1962</text>
      <text x="424" y="268" className="bi-small bi-strong">independência</text>
      <text x="424" y="282" className="bi-tiny">após guerra de libertação</text>
    </g>

    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>
      <text x="156" y="172" className="bi-hand-sm">{hand[0]}</text>
      <text x="156" y="190" className="bi-hand-sm">{hand[1]}</text>
    </motion.g>

    <text x="30" y="318" className="bi-tiny bi-strong">heranças:</text>
    {['fronteiras artificiais', 'dependência de matérias-primas', 'autoritarismo herdado'].map((h, k) => <g key={h}>
      <circle cx={[100, 250, 450][k]} cy="314" r="3.5" className="bi-dot" />
      <text x={[110, 260, 460][k]} y="318" className="bi-tiny">{h}</text>
    </g>)}
    <text x="30" y="342" className="bi-foot">Trilhas esquemáticas, sem escala de tempo.</text>
  </svg>;
}

// Fim da Guerra Fria: quatro estações de uma mesma reação em cadeia. As
// estações já percorridas ficam no estado final; a acesa roda o seu
// movimento; as seguintes esperam apagadas.
const Y90 = (y: number) => 40 + (y - 1955) * (540 / 37);
const DOMINOES = ['Polônia', 'Hungria', 'Tchecoslováquia', 'Romênia'];
const BRICKS: [number, number, number][] = [0, 1, 2, 3].flatMap(row => {
  const y = 118 + row * 18;
  return row % 2 ? [[208, y, 8], [217, y, 17], [235, y, 17], [253, y, 8]] : [[208, y, 17], [226, y, 17], [244, y, 17]];
});

export function ColdWarEnd({ active }: Scene) {
  const p = usePaced();
  const done = (k: number) => k <= active;
  const stations = [
    { c: 95, title: 'Reformas', date: '1985 · Gorbachev', cap: ['tensões represadas', 'vêm à tona'] },
    { c: 235, title: 'Muro de Berlim', date: 'nov. 1989', cap: ['1956 e 1968: interveio', '1989: não interveio'] },
    { c: 375, title: 'Cascata', date: '1989', cap: ['a mesma sinalização', 'derruba um após outro'] },
    { c: 520, title: 'Dissolução', date: 'dez. 1991', cap: ['Rússia, sob Yeltsin,', 'herda o assento na ONU'] },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Fim da Guerra Fria: reformas de Gorbachev, não intervenção soviética, queda em cascata dos regimes do Leste em 1989 e dissolução da URSS em 1991; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">O FIM DA GUERRA FRIA · 1985–1991</text>
    <ArrowHead id="sx-head-gf" />
    {stations.map((s, k) => <g key={s.title}>
      <motion.rect x={s.c - 64} y="50" width="128" height="226" rx="12" className="bi-band" initial={false}
        animate={{ opacity: k === active ? 1 : 0 }} transition={p(0.4)} />
      <text x={s.c} y="70" textAnchor="middle" className={k === active ? 'bi-label bi-on' : 'bi-label'}>{s.title}</text>
      <text x={s.c} y="86" textAnchor="middle" className="bi-tiny">{s.date}</text>
      <motion.g initial={false} animate={{ opacity: done(k) ? 1 : 0.35 }} transition={p(0.4)}>
        <text x={s.c} y="252" textAnchor="middle" className="bi-tiny">{s.cap[0]}</text>
        <text x={s.c} y="265" textAnchor="middle" className="bi-tiny">{s.cap[1]}</text>
      </motion.g>
      {k < 3 && <Arrow d={['M134 190h26', 'M294 190h18', 'M444 190h22'][k]} on={done(k + 1)} p={p} head="sx-head-gf" delay={0.1} />}
    </g>)}

    <motion.g initial={false} animate={{ opacity: done(0) ? 1 : 0.35 }} transition={p(0.4)}>
      <path d="M67 156q0 40 28 40t28-40Z" className="sx-pot" />
      <path d="M63 156h64" className="sx-pot-rim" />
      <motion.path d="M68 146q27-12 54 0Z" className="sx-pot" initial={false}
        animate={{ y: done(0) ? -18 : 0, rotate: done(0) ? -14 : 0 }} transition={p(0.6, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'left bottom' }} />
      {[80, 95, 110].map((x, j) => <motion.path key={x} d={`M${x} 150q-6-10 0-18t0-18`} className="sx-steam" initial={false}
        animate={{ pathLength: done(0) ? 1 : 0, opacity: done(0) ? 1 : 0 }} transition={p(0.7, 0.6 + j * 0.15)} />)}
      <text x="95" y="216" textAnchor="middle" className="bi-tiny bi-strong">perestroika: economia</text>
      <text x="95" y="230" textAnchor="middle" className="bi-tiny bi-strong">glasnost: abertura</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: done(1) ? 1 : 0.35 }} transition={p(0.4)}>
      {BRICKS.map(([x, y, w], j) => {
        const falls = y < 150 && x !== 226;
        return <motion.rect key={j} x={x} y={y} width={w} height="16" rx="2" className="sx-brick"
          initial={false} animate={falls && done(1) ? { y: 40, x: x < 226 ? -20 : 20, rotate: x < 226 ? -50 : 50, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={p(0.8, 0.5 + (y - 116) * 0.006)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />;
      })}
      {[-46, 46].map((dx, j) => <motion.g key={dx} initial={false} animate={{ x: done(1) ? (j ? -6 : 6) : 0 }} transition={p(0.6, 0.2)}>
        <Person x={235 + dx} y={170} s={0.62} coat={j ? 'bi-coat-plain' : 'bi-coat-green'} />
      </motion.g>)}
      <path d="M190 206h90" className="bi-ground" />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: done(2) ? 1 : 0.35 }} transition={p(0.4)}>
      {DOMINOES.map((name, j) => {
        const x = 322 + j * 28;
        return <motion.g key={name} initial={false} animate={{ rotate: done(2) ? 10 : 0 }} transition={p(0.4, active === 2 ? 0.3 + j * 0.3 : 0)}
          style={{ transformBox: 'fill-box', transformOrigin: 'right bottom' }}>
          <rect x={x} y="112" width="18" height="94" rx="3" className="sx-domino" />
          <text transform={`translate(${x + 13} 202) rotate(-90)`} className="sx-domino-text">{name}</text>
        </motion.g>;
      })}
      <path d="M312 208h118" className="bi-ground" />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: done(3) ? 1 : 0.35 }} transition={p(0.4)}>
      <text x="520" y="112" textAnchor="middle" className="bi-tiny bi-strong">URSS</text>
      {Array.from({ length: 15 }, (_, j) => {
        const r = Math.floor(j / 5); const c = j % 5;
        return <motion.rect key={j} x={475 + c * 18} y={120 + r * 22} width="17" height="21" rx="2" className={j === 0 ? 'sx-tile sx-tile-ru' : 'sx-tile'} initial={false}
          animate={done(3) ? { x: (c - 2) * 5, y: (r - 1) * 6, rotate: ((j * 7) % 5 - 2) * 3 } : { x: 0, y: 0, rotate: 0 }}
          transition={p(0.8, 0.3 + j * 0.04)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />;
      })}
      <text x="520" y="222" textAnchor="middle" className={done(3) ? 'bi-small bi-strong bi-on' : 'bi-small bi-strong'}>15 repúblicas</text>
    </motion.g>

    <path d="M40 306H580" className="bi-axis" />
    {[[1956, '1956 Hungria', 322, 'start', -8], [1968, '1968 Tchecoslováquia', 322, 'middle', 0], [1985, '1985', 322, 'middle', 0],
      [1989, 'nov. 1989', 296, 'middle', 0], [1991, 'dez. 1991', 322, 'end', 16]].map(([y, text, ty, anchor, dx], k) => {
      const hot = k >= 2 && k - 2 <= active && (k - 2 === active || (k === 4 && active === 3) || (k === 3 && active === 1));
      return <g key={y as number}>
        <motion.circle cx={Y90(y as number)} cy="306" r="4" className={k < 2 ? 'bi-dot' : 'bi-dot bi-dot-warn'} initial={false}
          animate={{ scale: hot ? 1.6 : 1 }} transition={p(0.4, 0.3)} />
        <text x={Y90(y as number) + (dx as number)} y={ty as number} textAnchor={anchor as 'start' | 'middle' | 'end'} className={hot ? 'bi-tiny bi-strong' : 'bi-tiny'}>{text}</text>
      </g>;
    })}
    <text x={(Y90(1956) + Y90(1968)) / 2} y="338" textAnchor="middle" className="bi-tiny">intervenções soviéticas</text>
  </svg>;
}

export const SCENES_LOTE8: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-europa-no-seculo-xix': WorkerRoads,
  'summary-historia-imperialismo-e-belle-epoque': ColonialRule,
  'summary-historia-primeira-guerra-mundial-1914-1918': AllianceFuse,
  'summary-historia-o-periodo-entreguerras-1918-1939': InterwarChain,
  'summary-historia-o-nazismo-na-alemanha': DemocracyCracks,
  'summary-historia-descolonizacao-afro-asiatica': Decolonization,
  'summary-historia-o-fim-da-guerra-fria': ColdWarEnd,
};

export const HEADERS_LOTE8: Record<string, string> = {
  'summary-historia-europa-no-seculo-xix': 'estratégias em disputa',
  'summary-historia-imperialismo-e-belle-epoque': 'formas de dominação',
  'summary-historia-primeira-guerra-mundial-1914-1918': 'causas combinadas',
  'summary-historia-o-periodo-entreguerras-1918-1939': 'cadeia de causas',
  'summary-historia-o-nazismo-na-alemanha': 'condições combinadas',
  'summary-historia-descolonizacao-afro-asiatica': 'trajetórias comparadas',
  'summary-historia-o-fim-da-guerra-fria': 'reação em cadeia',
};
