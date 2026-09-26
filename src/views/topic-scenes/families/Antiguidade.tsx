import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './Antiguidade.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 7A da régua de História: Antiguidade e Idade Média. Cada cena desenha
// o mecanismo que o capítulo explica — o relevo que separa as póleis, o poder
// romano que sai das instituições e se junta numa pessoa, os dois vínculos
// feudais, a balança que a Peste Negra inverte, a riqueza que chega à obra de
// arte. Datas, nomes e proporções saem do resumo do capítulo; o que é só
// desenho (contorno, quantidade de figuras) a prancha declara no rodapé.

function Temple({ x, y, s = 1, className = 'an-temple' }: { x: number; y: number; s?: number; className?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 -4L0 -12L12 -4Z" className={className} />
    <path d="M-11 -4h22v2h-22ZM-10 -2v10M-4 -2v10M4 -2v10M10 -2v10M-12 8h24v3h-24Z" className={className} />
  </g>;
}

function Peak({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-16 8L-5 -9L1 -1L6 -6L16 8Z" className="an-mount" />;
}

// Mundo grego: o mapa é o argumento da fragmentação — cada pólis cercada de
// montanhas —, e o painel ao lado abre uma pólis por vez. No terceiro recorte
// as linhas até os Jogos Olímpicos mostram o que as unia apesar do relevo.
const POLEIS = [
  { x: 238, y: 144, name: 'Atenas' },
  { x: 146, y: 246, name: 'Esparta' },
  { x: 100, y: 108 },
  { x: 196, y: 102 },
  { x: 160, y: 210 },
];
const GAMES = { x: 94, y: 226 };
const GREECE = 'M34 60H298V92C286 100 276 112 270 126C266 140 272 156 258 164C244 170 230 160 214 168C200 176 186 176 176 184C170 190 176 198 186 204C200 214 204 232 194 246C186 262 196 280 184 292C174 300 164 284 160 276C154 290 144 298 136 292C128 282 132 268 122 262C112 272 98 276 94 262C88 244 70 236 70 218C70 200 90 194 104 190C120 186 140 188 158 188C138 178 112 176 92 172C70 168 52 158 44 140C38 124 34 100 34 60Z';

export function GreekPoleis({ active }: Scene) {
  const p = usePaced();
  const crowd = Array.from({ length: 12 }, (_, k) => k);
  const citizens = [2, 7, 10];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Mundo grego: mapa esquemático das póleis, cidadania restrita de Atenas, sociedade militar de Esparta e a cultura helênica comum; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">GRÉCIA ANTIGA · MOSAICO DE PÓLEIS</text>

    <rect x="24" y="52" width="284" height="262" rx="12" className="an-sea" />
    <path d={GREECE} className="bi-land" />
    {[[262, 226], [52, 292], [236, 290], [284, 176]].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x - 12} ${y}q6-5 12 0t12 0`} className="an-wave" />)}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0.75 }} transition={p(0.4)}>
      {[[70, 96], [150, 124], [222, 112], [116, 152], [196, 234], [118, 222], [170, 272], [272, 98]].map(([x, y], k) => <motion.g key={`${x}-${y}`} initial={false}
        animate={{ y: active === 2 ? [0, -3, 0] : 0 }} transition={p(0.6, active === 2 ? 0.05 * k : 0)}>
        <Peak x={x} y={y} s={k % 2 ? 0.8 : 1} />
      </motion.g>)}
    </motion.g>
    {POLEIS.map((c, k) => <motion.path key={`link-${k}`} d={`M${c.x} ${c.y}Q${(c.x + GAMES.x) / 2} ${Math.min(c.y, GAMES.y) - 30} ${GAMES.x} ${GAMES.y - 10}`} className="an-link" initial={false}
      animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.8, active === 2 ? 0.3 + 0.12 * k : 0)} />)}
    {POLEIS.map((c, k) => {
      const lit = active === 2 || (active === 0 && k === 0) || (active === 1 && k === 1);
      return <motion.g key={`polis-${k}`} initial={false} animate={{ opacity: lit ? 1 : 0.5 }} transition={p(0.4)}>
        <Temple x={c.x} y={c.y} s={c.name ? 1.1 : 0.8} />
        {c.name && <motion.circle cx={c.x} cy={c.y} r="20" className="an-ring" initial={false}
          animate={{ opacity: (active === 0 && k === 0) || (active === 1 && k === 1) ? 1 : 0, scale: (active === 0 && k === 0) || (active === 1 && k === 1) ? [0.6, 1.15, 1] : 0.6 }}
          transition={p(0.7, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
      </motion.g>;
    })}
    <text x="238" y="186" textAnchor="middle" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>Atenas</text>
    <text x="204" y="266" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>Esparta</text>
    <g transform={`translate(${GAMES.x} ${GAMES.y})`}>
      <path d="M-4 2h8l-2 14h-4Z" className="an-torch" />
      <motion.path d="M0 -12c5 4 7 8 7 11a7 7 0 0 1-14 0c0-3 2-5 4-8 0 3 1 5 3 5 0-3-1-5 0-8Z" className="bi-flame" initial={false}
        animate={{ scale: active === 2 ? [1, 1.25, 1] : 1 }} transition={p(0.8, 0.9)} />
    </g>
    <text x="48" y="250" textAnchor="middle" className="bi-tiny">Jogos</text>
    <text x="48" y="262" textAnchor="middle" className="bi-tiny">Olímpicos</text>

    <rect x="322" y="52" width="274" height="262" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="338" y="76" className="bi-panel-title">ATENAS · SÉCULO V A.C.</text>
      <text x="338" y="98" className="bi-small">democracia direta: o cidadão vota</text>
      <text x="338" y="112" className="bi-small">em pessoa, sem representantes</text>
      {['homem adulto', 'livre', 'filho de pai ateniense', 'e de mãe ateniense (Péricles, 451 a.C.)'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: active === 0 ? 1 : 0, x: active === 0 ? 0 : -6 }} transition={p(0.4, 0.2 + 0.15 * k)}>
        <path d={`M342 ${130 + k * 18}l3 3 6-7`} className="an-check" />
        <text x="356" y={134 + k * 18} className="bi-small">{line}</text>
      </motion.g>)}
      {crowd.map(k => {
        const citizen = citizens.includes(k);
        return <motion.g key={`p-${k}-${active === 0}`} initial={active === 0 ? { opacity: 1, y: 0 } : false}
          animate={{ opacity: active === 0 && !citizen ? 0.3 : 1, y: active === 0 && citizen ? -6 : 0 }} transition={p(0.5, 0.9 + 0.05 * k)}>
          <Person x={348 + k * 20} y={216} s={0.5} coat={citizen ? 'bi-coat-royal' : 'bi-coat-plain'} />
        </motion.g>;
      })}
      <text x="338" y="258" className="bi-small bi-warn">fora: mulheres, escravizados, metecos</text>
      <text x="338" y="286" className="bi-hand-sm">cidadãos: uma minoria da cidade</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="338" y="76" className="bi-panel-title">ESPARTA · PRONTIDÃO MILITAR</text>
      {[
        { d: 'M402 92h136l8 30h-152Z', text: 'espartanos · agogé', y: 111, cls: 'an-tier-top' },
        { d: 'M390 128h160l10 30h-180Z', text: 'periecos · livres, sem direitos', y: 147, cls: 'an-tier-mid' },
        { d: 'M376 164h188l14 44h-216Z', text: 'hilotas · escravizados', y: 182, cls: 'an-tier-low' },
      ].map((t, k) => <motion.g key={t.text} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 6 }} transition={p(0.4, 0.15 + 0.15 * (2 - k))}>
        <path d={t.d} className={t.cls} />
        <text x="470" y={t.y} textAnchor="middle" className="an-tier-text">{t.text}</text>
      </motion.g>)}
      <text x="470" y="198" textAnchor="middle" className="bi-tiny">mais numerosos que os cidadãos</text>
      <Arrow d="M398 104C350 116 346 160 372 186" on={active === 1} p={p} head="an-head-gr" delay={0.8} />
      <Arrow d="M544 102C556 94 566 88 582 82" on={active === 1} p={p} head="an-head-gr" delay={1.1} />
      <text x="338" y="232" className="bi-small"><tspan className="bi-strong">dentro:</tspan> a críptia intimida os hilotas</text>
      <text x="338" y="250" className="bi-small"><tspan className="bi-strong">fora:</tspan> guerra com póleis rivais</text>
      <text x="338" y="284" className="bi-hand-sm">o exército vigia dentro e fora</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <text x="338" y="76" className="bi-panel-title">UMA CULTURA, MUITAS PÓLEIS</text>
      <text x="338" y="100" className="bi-small bi-strong">cada pólis tem</text>
      <text x="466" y="100" className="bi-small bi-strong">todas partilham</text>
      <path d="M454 88v100" className="bi-tick" />
      {['governo', 'leis', 'moeda', 'exército'].map((w, k) => <g key={w}>
        <circle cx="344" cy={118 + k * 20} r="3.5" className="bi-dot" />
        <text x="354" y={122 + k * 20} className="bi-small">{w}</text>
      </g>)}
      {['língua grega', 'deuses comuns', 'Jogos Olímpicos'].map((w, k) => <g key={w}>
        <circle cx="472" cy={118 + k * 20} r="3.5" className="bi-dot bi-dot-warn" />
        <text x="482" y={122 + k * 20} className="bi-small">{w}</text>
      </g>)}
      <text x="338" y="214" className="bi-small">relevo montanhoso: difícil integração</text>
      <text x="338" y="232" className="bi-small">rivalidades e guerras entre póleis</text>
      <text x="338" y="250" className="bi-small">ao contrário do Egito e da Pérsia</text>
      <text x="338" y="278" className="bi-hand-sm">unidade cultural,</text>
      <text x="338" y="296" className="bi-hand-sm">fragmentação política</text>
    </motion.g>
    <ArrowHead id="an-head-gr" />
    <text x="30" y="342" className="bi-foot">Mapa esquemático, sem escala; figuras de Atenas ilustrativas, sem contagem.</text>
  </svg>;
}

// Mundo romano: seis fichas de poder. Na República ficam repartidas pelos três
// órgãos; nas guerras civis são arrancadas pelos generais; em 27 a.C. se
// juntam em Augusto — e o templo continua de pé, apagado, porque o capítulo
// insiste que as instituições viraram fachada, não foram abolidas.
const BAYS = [145, 231, 316];
const TOKENS = [0, 1, 2, 3, 4, 5];
const tokenAt = (active: number, k: number): [number, number] => {
  if (active === 0) return [BAYS[Math.floor(k / 2)] + (k % 2 ? 12 : -12), 198];
  if (active === 1) return k < 3 ? [[74, 196], [88, 196], [81, 183]][k] as [number, number] : [[378, 196], [392, 196], [385, 183]][k - 3] as [number, number];
  const angle = Math.PI * (1.12 + 0.152 * k);
  return [230 + 38 * Math.cos(angle), 268 + 38 * Math.sin(angle)];
};

export function RomanPower({ active }: Scene) {
  const p = usePaced();
  const facade = active === 2 ? 0.45 : 1;
  const when = [
    { x: 60, text: '753 a.C. · fundação lendária', anchor: 'start', dot: 40, on: false },
    { x: 262, text: '509 a.C. · República', anchor: 'middle', dot: 262, on: active === 0 },
    { x: 530, text: '27 a.C. · Império', anchor: 'middle', dot: 530, on: active === 2 },
  ] as const;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Roma: poder repartido na República, disputado nas guerras civis e concentrado em Augusto; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ROMA · DA REPÚBLICA AO IMPÉRIO</text>

    <motion.g initial={false} animate={{ opacity: facade }} transition={p(0.6, active === 2 ? 0.6 : 0)}>
      <path d="M96 100L230 62L364 100Z" className="an-facade" />
      <rect x="92" y="100" width="276" height="10" rx="2" className="an-facade" />
      {[96, 182, 268, 352].map(x => <g key={x}>
        <rect x={x} y="110" width="12" height="104" className="bi-column" />
        <path d={`M${x + 4} 114v96M${x + 8} 114v96`} className="bi-flute" />
      </g>)}
      <rect x="86" y="214" width="288" height="10" rx="2" className="an-facade" />
      <g transform="translate(145 166)"><path d="M-14 -10h28M-12 -10v8a12 8 0 0 0 24 0v-8M-8 8h16M0 6v2" className="bi-icon" /></g>
      <g transform="translate(231 166)">{[-12, 0, 12].map(dx => <g key={dx}><circle cx={dx} cy="-6" r="4" className="bi-icon" /><path d={`M${dx - 5} 8q5-12 10 0`} className="bi-icon" /></g>)}</g>
      <g transform="translate(316 166)">{[-7, 7].map(dx => <g key={dx}><circle cx={dx} cy="-6" r="4" className="bi-icon" /><path d={`M${dx - 5} 8q5-12 10 0`} className="bi-icon" /></g>)}</g>
    </motion.g>
    {[['Senado', 145], ['Assembleias', 231], ['Cônsules', 316]].map(([name, x]) => <text key={name} x={x} y="140" textAnchor="middle"
      className={active === 0 ? 'bi-small bi-strong' : 'bi-small'}>{name}</text>)}
    {active === 2 && <motion.text x="230" y="94" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.2)}>fachada</motion.text>}
    {active === 1 && <motion.path d="M226 64l-6 12 8 6-6 12" className="bi-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.8)} />}

    {[['César', 50], ['Pompeu', 414]].map(([name, x], k) => <motion.g key={name} initial={false}
      animate={{ opacity: active === 1 ? 1 : 0, x: active === 1 ? 0 : (k ? 10 : -10) }} transition={p(0.5)}>
      <Person x={x as number} y={150} s={0.9} coat="bi-coat-army" />
      <path d={k ? `M${(x as number) + 12} 176l10-26` : `M${(x as number) - 12} 176l-10-26`} className="bi-rifle" />
      <text x={x} y="220" textAnchor="middle" className="bi-small bi-strong">{name}</text>
    </motion.g>)}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, y: active === 2 ? 0 : 8 }} transition={p(0.5, active === 2 ? 0.3 : 0)}>
      <Person x={230} y={268} s={0.9} coat="bi-coat-royal" />
      <path d="M222 262q-4-9 2-15M238 262q4-9-2-15M221 256l-3-1M221 251l-3-2M239 256l3-1M239 251l3-2" className="an-laurel" />
      <text x="276" y="276" className="bi-small bi-strong">Otávio Augusto</text>
      <text x="276" y="291" className="bi-tiny">27 a.C.</text>
    </motion.g>
    {TOKENS.map(k => {
      const [cx, cy] = tokenAt(active, k);
      return <motion.circle key={k} r="6" className="an-token" initial={false} animate={{ cx, cy }}
        transition={p(0.9, active === 0 ? 0.05 * k : 0.4 + 0.08 * k)} />;
    })}

    <rect x="446" y="52" width="150" height="236" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.2)}>
      {[
        { title: ['509–27 A.C.', 'REPÚBLICA'], lines: [['Senado:', true], ['aristocracia', false], ['patrícia', false], ['Assembleias:', true], ['plebeus e tribuno', false], ['Cônsules:', true], ['eleitos por um ano,', false], ['sempre em pares', false]], hand: ['poder repartido'] },
        { title: ['SÉCULO I A.C.', 'CRISE'], lines: [['guerras civis', true], ['recorrentes', false], ['generais poderosos', false], ['disputam o', false], ['controle político', false]], hand: ['o poder foge', 'das instituições'] },
        { title: ['27 A.C.', 'IMPÉRIO'], lines: [['Augusto,', true], ['sobrinho-neto e', false], ['herdeiro de César,', false], ['concentra autoridade', false], ['militar, política', false], ['e religiosa', false]], hand: ['instituições', 'de fachada'] },
      ].filter((_, k) => k === active).map(panel => <g key={panel.title[0]}>
        <text x="460" y="78" className="bi-panel-title">{panel.title[0]}</text>
        <text x="460" y="94" className="bi-panel-title">{panel.title[1]}</text>
        {panel.lines.map(([line, strong], k) => <text key={line as string} x="460" y={116 + k * 16} className={strong ? 'bi-small bi-strong' : 'bi-small'}>{line}</text>)}
        {panel.hand.map((line, k) => <text key={line} x="460" y={250 + k * 17} className="bi-hand-sm">{line}</text>)}
      </g>)}
    </motion.g>

    <path d="M40 310H580" className="bi-axis" />
    <motion.rect x="376" y="305" width="96" height="10" rx="5" className="bi-dot" initial={false} animate={{ opacity: active === 1 ? 1 : 0.35 }} transition={p(0.4)} />
    <text x="424" y="330" textAnchor="middle" className={active === 1 ? 'bi-tiny bi-strong' : 'bi-tiny'}>séc. I a.C. · crise</text>
    {when.map(w => <g key={w.text}>
      <motion.circle cx={w.dot} cy="310" r="4.5" className="bi-dot" initial={false} animate={{ scale: w.on ? 1.6 : 1 }} transition={p(0.4, 0.3)} />
      <text x={w.anchor === 'start' ? 36 : w.x} y="330" textAnchor={w.anchor} className={w.on ? 'bi-tiny bi-strong' : 'bi-tiny'}>{w.text}</text>
    </g>)}
    <text x="30" y="346" className="bi-foot">Fichas de poder e linha do tempo esquemáticas, fora de escala.</text>
  </svg>;
}

// Feudalismo: dois vínculos lado a lado, porque o capítulo insiste que são
// relações distintas. À esquerda o senhorio e as três obrigações do servo; à
// direita a rede entre nobres, com o vassalo de dois suseranos que limita o
// rei. No terceiro recorte a divisória se desenha entre os dois.
function Castle({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 52V8h6v-6h5v6h6v-6h5v6h4v44ZM44 52V8h6v-6h5v6h6v-6h5v6h4V52ZM26 52V22h18v30ZM31 52v-10a4 4 0 0 1 8 0v10" className="an-castle" />
    <path d="M13 8V-8M13 -8h12l-4 4 4 4H13" className="an-pennant" />
  </g>;
}

export function FeudalBonds({ active }: Scene) {
  const p = usePaced();
  const left = active !== 1;
  const right = active !== 0;
  const duties = ['corveia: trabalho grátis no domínio', 'parte da própria colheita', 'taxas pelo moinho e pelo forno'];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Feudalismo: senhorio com as obrigações do servo e rede de suserania e vassalagem entre nobres; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">EUROPA FEUDAL · DOIS VÍNCULOS</text>
    <ArrowHead id="an-head-fe" />

    <motion.g initial={false} animate={{ opacity: left ? 1 : 0.35 }} transition={p(0.5)}>
      <rect x="24" y="52" width="282" height="270" rx="14" className="bi-panel" />
      <text x="40" y="74" className="bi-panel-title">SENHOR E SERVO</text>
      <Castle x={44} y={88} />
      <text x="80" y="156" textAnchor="middle" className="bi-small bi-strong">senhor</text>
      <rect x="128" y="90" width="166" height="50" rx="6" className="an-field" />
      {[0, 1, 2, 3, 4, 5, 6].map(k => <path key={k} d={`M${140 + k * 22} 134l14-38`} className="an-furrow" />)}
      <text x="228" y="156" textAnchor="middle" className="bi-small">domínio · do senhor</text>

      <Person x={50} y={190} s={0.8} coat="bi-coat-plain" hat="brim" />
      <path d="M58 208q12 6 18 14" className="an-tie-rope" />
      <path d="M76 212v14M68 226h16" className="bi-ground" />
      {[0, 1, 2, 3].map(k => <g key={k}>
        <rect x={92 + k * 31} y="172" width="28" height="54" rx="3" className={k % 2 ? 'an-strip-b' : 'an-strip-a'} />
        <path d={`M${98 + k * 31} 180v40M${106 + k * 31} 180v40M${114 + k * 31} 180v40`} className="an-furrow" />
      </g>)}
      <g transform="translate(248 204)">
        <path d="M-7 20l3-22h8l3 22Z" className="an-castle" />
        <motion.g initial={false} animate={{ rotate: active === 0 ? 90 : 0 }} transition={p(1.4, 0.4)}>
          <path d="M0 -2L-14 -16M0 -2L14 -16M0 -2L-14 12M0 -2L14 12" className="an-blade" />
        </motion.g>
        <circle cx="0" cy="-2" r="2.5" className="bi-dot" />
      </g>
      <g transform="translate(290 214)"><path d="M-12 12a12 14 0 0 1 24 0ZM-4 12v-6h8v6" className="an-castle" /></g>
      <text x="44" y="242" textAnchor="middle" className="bi-small bi-strong">servo</text>
      <text x="150" y="242" textAnchor="middle" className="bi-small">mansos · camponeses</text>
      <text x="248" y="242" textAnchor="middle" className="bi-tiny">moinho</text>
      <text x="291" y="242" textAnchor="middle" className="bi-tiny">forno</text>
      <text x="36" y="256" className="bi-tiny">livre, mas preso à terra</text>
      <Arrow d="M66 178C92 166 116 152 140 140" on={active === 0 || active === 2} p={p} head="an-head-fe" delay={0.3} />
      <Arrow d="M116 170V146" on={active === 0 || active === 2} p={p} head="an-head-fe" delay={0.7} />
      <Arrow d="M256 180C246 82 170 76 106 88" on={active === 0 || active === 2} p={p} head="an-head-fe" delay={1.1} />
      {duties.map((line, k) => <g key={line}>
        <motion.circle cx="44" cy={276 + k * 16} r="6.5" className="an-num" initial={false} animate={{ scale: active === 0 ? [1, 1.3, 1] : 1 }}
          transition={p(0.5, 0.3 + 0.4 * k)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <text x="44" y={279.5 + k * 16} textAnchor="middle" className="an-num-text">{k + 1}</text>
        <text x="56" y={280 + k * 16} className="bi-small">{line}</text>
      </g>)}
      {[[74, 170], [128, 160], [270, 174]].map(([x, y], k) => <g key={`n-${k}`}>
        <circle cx={x} cy={y} r="6.5" className="an-num" />
        <text x={x} y={y + 3.5} textAnchor="middle" className="an-num-text">{k + 1}</text>
      </g>)}
    </motion.g>

    <motion.g initial={false} animate={{ opacity: right ? 1 : 0.35 }} transition={p(0.5)}>
      <rect x="322" y="52" width="274" height="270" rx="14" className="bi-panel" />
      <text x="338" y="74" className="bi-panel-title">NOBRE E NOBRE</text>
      <Person x={400} y={104} s={0.8} coat="bi-coat-royal" hat="crown" />
      <Person x={548} y={104} s={0.8} coat="bi-coat-royal" hat="top" />
      <text x="386" y="112" textAnchor="end" className="bi-small">suserano</text>
      <text x="534" y="112" textAnchor="end" className="bi-small">outro suserano</text>
      <Person x={474} y={186} s={0.8} coat="bi-coat-army" hat="kepi" />
      <text x="492" y="192" className="bi-small bi-strong">vassalo</text>
      <text x="492" y="206" className="bi-tiny">e também suserano</text>
      <Person x={446} y={262} s={0.65} coat="bi-coat-green" />
      <Person x={518} y={262} s={0.65} coat="bi-coat-green" />
      <text x="534" y="268" className="bi-tiny">vassalos</text>
      <text x="534" y="280" className="bi-tiny">dele</text>
      <Arrow d="M406 132C414 154 440 168 460 176" on={active >= 1} p={p} head="an-head-fe" delay={0.3} />
      <Arrow d="M546 132C540 156 506 164 486 172" on={active >= 1} p={p} head="an-head-fe" delay={0.8} />
      <Arrow d="M466 214C460 226 454 234 450 244" on={active >= 1} p={p} head="an-head-fe" delay={1.2} />
      <Arrow d="M482 214C490 226 504 234 512 244" on={active >= 1} p={p} head="an-head-fe" delay={1.3} />
      {active === 1 && <motion.rect width="12" height="9" rx="2" className="an-fief" initial={{ x: 400, y: 136, opacity: 0 }}
        animate={{ x: [400, 430, 454], y: [136, 164, 174], opacity: [0, 1, 1] }} transition={p(1.2, 0.6)} />}
      {active === 1 && <motion.path d="M0 -7l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7v-5Z" className="an-shield" initial={{ x: 470, y: 172, opacity: 0 }}
        animate={{ x: [470, 440, 412], y: [172, 160, 138], opacity: [0, 1, 1] }} transition={p(1.2, 1.4)} />}
      <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, active === 1 ? 1.4 : 0)}>
        <text x="338" y="208" className="bi-hand-sm">lealdades</text>
        <text x="338" y="224" className="bi-hand-sm">sobrepostas</text>
        <text x="338" y="242" className="bi-hand-sm">limitam o rei</text>
      </motion.g>
      <text x="338" y="298" className="bi-small"><tspan className="bi-strong">desce:</tspan> feudo, com autonomia</text>
      <text x="338" y="314" className="bi-small"><tspan className="bi-strong">sobe:</tspan> serviço militar e conselho</text>
    </motion.g>

    <motion.path d="M314 58V318" className="an-divider" initial={false} animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.8, 0.2)} />
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, scale: active === 2 ? 1 : 0.5 }} transition={p(0.5, 0.9)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx="314" cy="186" r="13" className="an-badge" />
      <path d="M308 182h12M308 190h12M318 176l-8 20" className="an-badge-icon" />
    </motion.g>
    <text x="30" y="342" className="bi-foot">Senhorio e rede esquemáticos; o feudalismo variou por região.</text>
  </svg>;
}

// Baixa Idade Média: doze camponeses para ler "entre um terço e metade" —
// quatro morrem com certeza, dois ficam em dúvida. À direita a balança entre
// senhores e camponeses vira quando a mão de obra fica escassa, que é o
// paradoxo do capítulo: a catástrofe fortalece quem sobreviveu.
const DEAD = [1, 4, 8, 11];
const MAYBE = [3, 6];
const yr = (y: number) => 60 + (y - 1330) * 4;

export function BlackDeath({ active }: Scene) {
  const p = usePaced();
  const tilt = active === 0 ? 14 : -14;
  const captions = [
    ['peste bubônica, vinda provavelmente', 'da Ásia Central pelas rotas comerciais'],
    ['escassez súbita de mão de obra', 'eleva o poder de barganha de quem ficou'],
    ['camponeses exigem e às vezes obtêm', 'melhores condições e remuneração'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Baixa Idade Média: Peste Negra, escassez de mão de obra e abalo do trabalho servil; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">SÉCULO XIV · A PESTE E O TRABALHO</text>
    <ArrowHead id="an-head-bd" />

    <text x="40" y="70" className="bi-small bi-strong">Europa</text>
    <text x="304" y="70" textAnchor="end" className="bi-small bi-strong">Ásia Central</text>
    <path d="M286 80C220 98 120 98 58 82" className="an-route" markerEnd="url(#an-head-bd)" />
    <text x="172" y="110" textAnchor="middle" className="bi-tiny">rotas comerciais</text>
    {active === 0 && [0, 1, 2].map(k => <motion.circle key={k} r="4" className="an-germ" initial={{ cx: 286, cy: 80, opacity: 0 }}
      animate={{ cx: [286, 220, 140, 64], cy: [80, 92, 94, 84], opacity: [0, 1, 1, 0] }} transition={p(1.6, 0.2 + 0.35 * k)} />)}

    {Array.from({ length: 12 }, (_, k) => {
      const x = 50 + (k % 6) * 48;
      const y = k < 6 ? 140 : 196;
      const dead = DEAD.includes(k);
      const maybe = MAYBE.includes(k);
      return <g key={k}>
        <motion.g key={`v-${active === 0}`} initial={active === 0 ? { opacity: 1, y: 0 } : false} animate={{ opacity: dead ? 0 : maybe ? 0.3 : 1, y: active === 2 && !dead && !maybe ? -4 : 0 }}
          transition={p(0.6, active === 0 ? 0.4 + 0.12 * k : 0.2)}>
          <Person x={x} y={y} s={0.7} coat={active >= 1 && !dead && !maybe ? 'bi-coat-green' : 'bi-coat-plain'} hat={active === 2 && !dead && !maybe ? 'cap' : undefined} />
        </motion.g>
        {(dead || maybe) && <motion.g key={`g-${active === 0}`} initial={active === 0 ? { opacity: 0 } : false} animate={{ opacity: dead ? 1 : 0.8 }} transition={p(0.5, active === 0 ? 0.7 + 0.12 * k : 0)}>
          <path d={`M${x - 12} ${y + 24}q12-12 24 0Z`} className={dead ? 'an-grave' : 'an-grave an-grave-maybe'} />
          <path d={`M${x} ${y + 16}v-12M${x - 5} ${y + 8}h10`} className={dead ? 'an-grave-cross' : 'an-grave-cross an-grave-maybe'} />
        </motion.g>}
      </g>;
    })}
    <text x="40" y="244" className="bi-small bi-strong">entre um terço e metade da população morre</text>
    <motion.text x="40" y="268" className="bi-hand-sm" initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, 1.4)}>o comércio também espalhou a doença</motion.text>
    <motion.text x="40" y="268" className="bi-hand-sm" initial={false} animate={{ opacity: active === 0 ? 0 : 1 }} transition={p(0.4, 0.8)}>quem sobreviveu vale mais</motion.text>

    <rect x="334" y="52" width="262" height="210" rx="14" className="bi-panel" />
    <motion.g key={`t-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.1)}>
      <text x="350" y="76" className="bi-panel-title">{['1347–1351 · PESTE NEGRA', 'ESCASSEZ DE MÃO DE OBRA', 'ABALO DO TRABALHO SERVIL'][active]}</text>
    </motion.g>
    <path d="M466 200V108M444 200h44" className="an-post" />
    <motion.line x1="396" x2="536" className="an-beam" initial={false} animate={{ y1: 108 + tilt, y2: 108 - tilt }} transition={p(1, 0.5)} />
    <circle cx="466" cy="108" r="4" className="an-pivot" />
    <motion.g initial={false} animate={{ y: tilt }} transition={p(1, 0.5)}>
      <path d="M396 108L380 150M396 108L412 150" className="an-string" />
      <path d="M374 150q22 12 44 0Z" className="an-pan" />
      <g transform="translate(378 116) scale(.5)"><Castle x={0} y={0} /></g>
      {active === 2 && <motion.path d="M392 124l-4 8 4 6-4 8" className="bi-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 1.4)} />}
    </motion.g>
    <motion.g initial={false} animate={{ y: -tilt }} transition={p(1, 0.5)}>
      <path d="M536 108L520 150M536 108L552 150" className="an-string" />
      <path d="M514 150q22 12 44 0Z" className="an-pan" />
      <Person x={528} y={128} s={0.52} coat="bi-coat-green" hat={active === 2 ? 'cap' : undefined} />
      <Person x={544} y={128} s={0.52} coat="bi-coat-green" />
    </motion.g>
    <text x="396" y="190" textAnchor="middle" className="bi-small">senhores</text>
    <text x="536" y="190" textAnchor="middle" className="bi-small">camponeses</text>
    {active === 2 && <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 1.2)}>
      <path d="M566 116h22v26h-22Z" className="bi-scroll" />
      <path d="M570 124h14M570 130h14M570 136h9" className="bi-scroll-line" />
    </motion.g>}
    <motion.g key={`c-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.3)}>
      <text x="350" y="226" className="bi-small bi-strong">{captions[0]}</text>
      <text x="350" y="244" className="bi-small">{captions[1]}</text>
    </motion.g>

    <rect x={yr(1337)} y="290" width={yr(1453) - yr(1337)} height="14" rx="5" className="bi-bar" />
    <motion.rect x={yr(1337)} y="290" height="14" rx="5" className="an-war" initial={false}
      animate={{ width: active === 2 ? yr(1453) - yr(1337) : 0 }} transition={p(1, 0.4)} />
    <text x={(yr(1337) + yr(1453)) / 2} y="301" textAnchor="middle" className={active === 2 ? 'bi-bar-text' : 'an-bar-text-off'}>Guerra dos Cem Anos · 1337–1453</text>
    <motion.rect x={yr(1347)} y="285" width={yr(1351) - yr(1347)} height="24" rx="3" className="an-plague" initial={false}
      animate={{ opacity: active === 0 ? 1 : 0.55 }} transition={p(0.4)} />
    <text x={yr(1349)} y="324" textAnchor="middle" className={active === 0 ? 'bi-tiny bi-strong' : 'bi-tiny'}>Peste Negra · 1347–1351</text>
    <text x="30" y="342" className="bi-foot">Doze figuras ilustrativas: 4 a 6 mortas = um terço a metade. Balança esquemática.</text>
  </svg>;
}

// Renascimento: quatro medalhões em fila, e a trilha dourada da riqueza anda
// até o recorte em foco — riqueza, mecenato, humanismo, arte. O quadro de
// baixo abre o elo: a rota e o banco, o mecenas e os financiados, o centro do
// círculo passando de Deus ao ser humano, a grade da perspectiva se traçando.
const STATIONS = [90, 235, 385, 530];

export function RenaissanceChain({ active }: Scene) {
  const p = usePaced();
  const names = ['comércio e bancos', 'mecenato', 'humanismo', 'arte'];
  const icons = [
    <path key="ship" d="M-18 6h36l-6 10h-24ZM0 6V-18M2 -16l14 20H2ZM-2 -12l-10 16h10Z" className="bi-icon" />,
    <path key="purse" d="M-8 -12h16l-4 6q14 6 10 18q-2 8-14 8t-14-8q-4-12 10-18ZM-4 -6h8M0 2v10M-4 4h6a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h6" className="bi-icon" />,
    <g key="human"><circle cx="0" cy="0" r="18" className="bi-icon" /><circle cx="0" cy="-9" r="3.5" className="bi-icon" /><path d="M0 -5v12M-12 -2h24M0 7l-7 10M0 7l7 10" className="bi-icon" /></g>,
    <g key="art"><path d="M-14 16l12-32 12 32M-2 -16v32" className="bi-icon" /><rect x="-14" y="-12" width="24" height="18" rx="1.5" className="bi-canvas" /><path d="M-10 2l6-8 4 4 6-8" className="bi-paint" /></g>,
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Renascimento: da riqueza comercial ao mecenato, ao humanismo e à arte; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">RENASCIMENTO · DA RIQUEZA À OBRA</text>
    <ArrowHead id="an-head-rn" />

    {STATIONS.slice(0, -1).map((x, k) => <path key={x} d={`M${x + 36} 94H${STATIONS[k + 1] - 38}`} className="bi-arrow-static" markerEnd="url(#an-head-rn)" />)}
    <path d={`M${STATIONS[0]} 136H${STATIONS[3]}`} className="an-trail-bg" />
    <motion.path d={`M${STATIONS[0]} 136H${STATIONS[3]}`} className="an-trail" initial={false}
      animate={{ pathLength: active / 3 }} transition={p(1, 0.2)} />
    <motion.g initial={false} animate={{ x: STATIONS[active] - STATIONS[0] }} transition={p(1, 0.2)}>
      <circle cx={STATIONS[0]} cy="136" r="7" className="an-coin" />
      <path d={`M${STATIONS[0] - 2} 132v8M${STATIONS[0] + 2} 132v8`} className="an-coin-mark" />
    </motion.g>
    {STATIONS.map((x, k) => {
      const on = k === active;
      return <g key={x}>
        <motion.g initial={false} animate={{ scale: on ? 1.1 : 1 }} transition={p(0.5, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={x} cy="94" r="30" className={on ? 'an-medal an-medal-on' : k < active ? 'an-medal an-medal-past' : 'an-medal'} />
          <g transform={`translate(${x} 94)`}>{icons[k]}</g>
        </motion.g>
        <text x={x} y="162" textAnchor="middle" className={on ? 'bi-label bi-on' : 'bi-label'}>{names[k]}</text>
      </g>;
    })}

    <rect x="24" y="180" width="572" height="140" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.2)}>
      {active === 0 && <g>
        <path d="M40 272q10-6 20 0t20 0 20 0 20 0M40 288q10-6 20 0t20 0 20 0 20 0" className="an-wave" />
        <motion.g initial={{ x: -30 }} animate={{ x: 0 }} transition={p(1.4, 0.3)}>
          <path d="M60 262h44l-8 12h-28ZM82 262V220M84 224l16 34H84ZM80 228l-14 30h14Z" className="an-ship" />
        </motion.g>
        <path d="M150 292h54M156 292v-20h42v20" className="an-table" />
        {[0, 1, 2].map(k => <motion.g key={k} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 1 + 0.2 * k)}>
          {[0, 1, 2].slice(0, k + 1).map(h => <ellipse key={h} cx={166 + k * 12} cy={268 - h * 5} rx="5" ry="2.5" className="an-coin" />)}
        </motion.g>)}
        <text x="120" y="310" textAnchor="middle" className="bi-tiny">Mediterrâneo · banco</text>
        <text x="236" y="212" className="bi-label">comércio mediterrâneo e bancos</text>
        <text x="236" y="234" className="bi-small">enriquecem Florença, Veneza, Milão</text>
        <text x="236" y="252" className="bi-small">primeiras formas de capitalismo bancário europeu</text>
        <text x="236" y="290" className="bi-hand-sm">condição necessária, não suficiente</text>
      </g>}
      {active === 1 && <g>
        <Person x={52} y={234} s={0.9} coat="bi-coat-royal" hat="top" />
        <text x="52" y="284" textAnchor="middle" className="bi-tiny">Médici</text>
        {[['artistas', 104], ['arquitetos', 160], ['intelectuais', 222]].map(([who, x], k) => <motion.g key={who as string} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.9 + 0.2 * k)}>
          <Person x={x as number} y={244} s={0.7} coat={['bi-coat-green', 'bi-coat', 'bi-coat-plain'][k]} />
          <text x={x} y={284} textAnchor="middle" className="bi-tiny">{who}</text>
        </motion.g>)}
        <motion.path d="M-6 -6h12l-3 4q9 4 7 12q-1 5-10 5t-10-5q-2-8 7-12Z" className="an-purse" initial={{ x: 70, y: 238 }}
          animate={{ x: [70, 104, 160, 222], y: [238, 214, 214, 214] }} transition={p(1.6, 0.4)} />
        <text x="272" y="212" className="bi-label">mecenas: a família Médici, em Florença</text>
        <text x="272" y="234" className="bi-small">financiam artistas, arquitetos e intelectuais</text>
        <text x="272" y="252" className="bi-small">obras de prestígio pessoal e poder político</text>
        <text x="272" y="290" className="bi-hand-sm">a riqueza vira encomenda</text>
      </g>}
      {active === 2 && <g>
        {[76, 176].map((cx, k) => <g key={cx}>
          <circle cx={cx} cy="246" r="36" className="an-orbit" />
          <text x={cx} y="300" textAnchor="middle" className="bi-tiny">{k ? 'antropocentrismo' : 'teocentrismo'}</text>
        </g>)}
        <g transform="translate(76 246)">
          <path d="M0 -10v20M-10 0h20M-7 -7l14 14M7 -7l-14 14" className="an-rays" />
          <circle r="5" className="an-sun" />
        </g>
        <text x="76" y="272" textAnchor="middle" className="bi-tiny">Deus</text>
        <text x="176" y="274" textAnchor="middle" className="bi-tiny">ser humano</text>
        <Person x={76} y={206} s={0.42} coat="bi-coat-plain" />
        <path d="M118 246h14" className="bi-arrow-static" markerEnd="url(#an-head-rn)" />
        <motion.g initial={{ scale: 0.5, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} transition={p(0.8, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <Person x={176} y={238} s={0.62} coat="bi-coat-green" />
        </motion.g>
        <text x="236" y="212" className="bi-label">do teocentrismo ao antropocentrismo</text>
        <text x="236" y="234" className="bi-small">textos gregos e romanos, guardados por</text>
        <text x="236" y="250" className="bi-small">eruditos islâmicos e bizantinos</text>
        <text x="236" y="268" className="bi-small">Leonardo, homem universal · Copérnico, heliocentrismo</text>
        <text x="236" y="298" className="bi-hand-sm">sem romper com a fé cristã</text>
      </g>}
      {active === 3 && <g>
        <rect x="40" y="194" width="170" height="112" rx="3" className="bi-canvas" />
        {[40, 72, 104, 136, 168, 210].map((x, k) => <motion.path key={x} d={`M${x} 306L125 236`} className="an-grid" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.7, 0.2 + 0.1 * k)} />)}
        {[250, 268, 288].map((y, k) => {
          const f = (y - 236) / 70;
          return <motion.path key={y} d={`M${125 - 85 * f} ${y}H${125 + 85 * f}`} className="an-grid" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.5, 0.9 + 0.15 * k)} />;
        })}
        <path d="M40 236H210" className="an-horizon" />
        <motion.circle cx="125" cy="236" r="4" className="bi-seal" initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={p(0.5, 1.4)} />
        <text x="125" y="226" textAnchor="middle" className="bi-tiny">ponto de fuga</text>
        <text x="236" y="212" className="bi-label">perspectiva linear: Brunelleschi</text>
        <text x="236" y="232" className="bi-small">profundidade 3D consistente numa superfície plana</text>
        <text x="236" y="250" className="bi-small">naturalismo anatômico: Michelangelo, Leonardo</text>
        <text x="236" y="268" className="bi-small">temas religiosos seguem; mitologia clássica cresce</text>
        <text x="236" y="298" className="bi-hand-sm">confiar em observar e raciocinar</text>
      </g>}
    </motion.g>
    <text x="30" y="342" className="bi-foot">Cadeia esquemática: cada elo é condição do seguinte, não causa única.</text>
  </svg>;
}

export const SCENES_LOTE7A: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-antiguidade-classica-o-mundo-grego': GreekPoleis,
  'summary-historia-antiguidade-classica-o-mundo-romano': RomanPower,
  'summary-historia-alta-idade-media-e-feudalismo': FeudalBonds,
  'summary-historia-baixa-idade-media': BlackDeath,
  'summary-historia-vida-urbana-e-renascimento-cultural': RenaissanceChain,
};

export const HEADERS_LOTE7A: Record<string, string> = {
  'summary-historia-antiguidade-classica-o-mundo-grego': 'pólis e cidadania',
  'summary-historia-antiguidade-classica-o-mundo-romano': 'instituições e poder',
  'summary-historia-alta-idade-media-e-feudalismo': 'vínculos feudais',
  'summary-historia-baixa-idade-media': 'crise e trabalho',
  'summary-historia-vida-urbana-e-renascimento-cultural': 'condições e obra',
};
