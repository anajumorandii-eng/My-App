import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './IdadeModerna.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 7B da régua de História e Geografia: Idade Moderna. As fôrmas genéricas
// (camadas, escala, dialética, tipologia) só trocavam texto; aqui cada cena
// desenha o mecanismo que o resumo explica — o metal que enche o cofre da
// metrópole e puxa o trabalho forçado atrás de si, a trava que separa o
// criollo rico do cargo, a posição de Trento feita de pedaços das duas
// anteriores, dois caminhos para o mesmo trono, três propostas acesas pela
// mesma lâmpada. Datas, nomes e números saem só do resumo do capítulo.

// ---------------------------------------------------------------------------
// A Primeira Globalização: camadas. O recorte ativo acende a sua camada no
// mapa; as de baixo continuam visíveis, esmaecidas, porque a tese do capítulo
// é que cada uma condiciona a seguinte — o tráfico não se explica sem o pacto,
// e o pacto não se explica sem a doutrina do metal.
const AMERICA_N = 'M36 80C54 64 92 56 130 58C164 58 196 58 208 70C214 80 204 90 196 96C190 102 188 110 182 116L186 132C182 134 178 130 176 124C168 126 158 126 150 132C146 140 150 148 158 156C162 160 166 164 170 168L166 172C156 164 146 156 138 150C128 142 124 134 116 128C100 122 86 112 72 104C58 96 42 92 36 80Z';
const AMERICA_S = 'M156 166C178 160 202 170 216 184C226 196 222 210 212 222C202 236 194 250 184 266C178 272 172 268 172 258C170 240 162 226 156 212C148 198 146 180 156 166Z';
const EUROPE = 'M312 76C328 62 368 60 394 68C408 78 404 94 394 104C386 114 378 122 362 124C346 122 332 122 322 112C310 100 306 88 312 76Z';
const AFRICA = 'M318 140C340 132 376 134 396 144C410 154 414 174 406 190C398 210 388 230 376 248C368 262 358 270 352 264C346 246 342 226 338 212C328 202 314 192 312 174C310 158 312 146 318 140Z';
const LAYERS = ['metais = riqueza', 'pacto colonial', 'trabalho forçado', 'tráfico atlântico'];

export function FirstGlobalization({ active }: Scene) {
  const p = usePaced();
  const still = p(1).duration === 0;
  const layer = (k: number) => ({ opacity: k === active ? 1 : k < active ? 0.42 : 0 });
  const panel = [
    { title: ['DOUTRINA', 'MERCANTILISTA'], lines: ['riqueza = ouro e prata', 'acumulados', '', 'comércio: soma zero —', 'o ganho de um país', 'é a perda de outro'] },
    { title: ['PACTO', 'COLONIAL'], lines: ['a colônia fornece', 'matéria-prima barata', 'e compra manufaturados', 'só da metrópole:', 'exclusividade comercial'] },
    { title: ['TRABALHO', 'COMPULSÓRIO'], lines: ['em larga escala:', 'é o que viabiliza', 'economicamente', 'a exploração colonial', 'primeiro, indígenas', 'escravizados'] },
    { title: ['TRÁFICO', 'TRANSATLÂNTICO'], lines: ['depois, majoritariamente,', 'africanos escravizados', 'sustentam plantations', 'de açúcar e mineração', 'abolição gradual,', 'só no século XIX'] },
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`A Primeira Globalização em camadas: doutrina mercantilista, pacto colonial, trabalho compulsório e tráfico transatlântico no mapa do Atlântico; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="im-head-glob" />
    <text x="30" y="40" className="bi-kicker">MERCANTILISMO · SÉC. XVI–XVIII</text>
    <path d={AMERICA_N} className="bi-land" />
    <path d={AMERICA_S} className="bi-land" />
    <path d={EUROPE} className="bi-land" />
    <path d={AFRICA} className="bi-land" />
    <text x="118" y="88" textAnchor="middle" className="bi-tiny">AMÉRICA · colônias</text>
    <text x="358" y="118" textAnchor="middle" className="bi-tiny">EUROPA</text>
    <text x="364" y="184" textAnchor="middle" className="bi-tiny">ÁFRICA</text>
    <text x="272" y="214" textAnchor="middle" className="im-sea-text">Atlântico</text>
    {['M52 160q5-5 10 0t10 0', 'M100 256q5-5 10 0t10 0', 'M256 264q5-5 10 0t10 0', 'M286 278q5-5 10 0t10 0'].map(d => <path key={d} d={d} className="im-wave" />)}
    <g transform="translate(60 268)">
      <circle r="13" className="im-compass" />
      <path d="M0 -17l4 13-4 4-4-4ZM0 17l4-13-4-4-4 4Z" className="im-compass-needle" />
      <text y="-20" textAnchor="middle" className="bi-tiny">N</text>
    </g>

    {/* Camada 1: o cofre da metrópole. Três moedas atravessam o oceano e só
        então a pilha cresce — riqueza medida pelo metal acumulado. */}
    <motion.g initial={false} animate={layer(0)} transition={p(0.5)}>
      <g transform="translate(358 88)">
        <path d="M-17 0h34v18h-34Z" className="im-chest" />
        <path d="M-17 0q17-13 34 0" className="im-chest" />
        <rect x="-3" y="4" width="6" height="7" rx="1" className="im-gold" />
      </g>
      {[0, 1, 2].map(k => <motion.ellipse key={k} cx={346 + k * 12} cy="80" rx="5" ry="2.6" className="im-gold" initial={false}
        animate={{ opacity: 1, y: active === 0 && !still ? [-40, -40, 0] : 0 }} transition={p(1.6, 0.2 + k * 0.35)} />)}
      <g transform="translate(190 236)">
        <path d="M-12 10l12-18 12 18Z" className="im-mine" />
        <path d="M-4 10v-6h8v6" className="im-mine-door" />
      </g>
      <path d="M200 226C240 170 290 120 340 92" className="im-route" />
      {active === 0 && [0, 1, 2].map(k => <motion.circle key={`fly-${k}`} cx="200" cy="226" r="4.5" className="im-gold" initial={{ opacity: still ? 0 : 1 }}
        animate={still ? { opacity: 0 } : { x: [0, 60, 140], y: [0, -80, -134], opacity: [1, 1, 0] }} transition={p(1.3, 0.1 + k * 0.35)} />)}
    </motion.g>

    {/* Camada 2: as duas mãos do pacto, com a trava da exclusividade. */}
    <motion.g initial={false} animate={layer(1)} transition={p(0.5)}>
      <Arrow d="M222 190C258 150 282 128 306 112" on={active >= 1} p={p} head="im-head-glob" delay={0.2} />
      <Arrow d="M312 80C270 68 228 72 202 84" on={active >= 1} p={p} head="im-head-glob" delay={0.6} />
      <text x="286" y="182" textAnchor="middle" className="bi-hand-sm">matéria-prima</text>
      <text x="256" y="62" textAnchor="middle" className="bi-hand-sm">manufaturados</text>
      <motion.g initial={false} animate={{ scale: active === 1 ? [0.4, 1.2, 1] : 1 }} transition={p(0.6, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M258 136v-5a6 6 0 0 1 12 0v5" className="im-lock-arc" />
        <rect x="254" y="136" width="20" height="15" rx="3" className="im-lock" />
        <circle cx="264" cy="143" r="2" className="im-lock-hole" />
      </motion.g>
    </motion.g>

    {/* Camada 3: a cana e a mina na colônia, com a corrente do trabalho forçado. */}
    <motion.g initial={false} animate={layer(2)} transition={p(0.5)}>
      <g transform="translate(180 196)">
        {[-7, 0, 7].map((dx, k) => <motion.path key={dx} d={`M${dx} 14V${-12 + k * 2}M${dx} ${-2 + k}l-6 -6M${dx} ${4 - k}l6 -6`} className="im-cane" initial={false}
          animate={{ pathLength: active >= 2 ? 1 : 0 }} transition={p(0.7, 0.2 + k * 0.15)} />)}
      </g>
      <g transform="translate(96 200)">
        {[0, 13, 26].map((dx, k) => <motion.ellipse key={dx} cx={dx} cy="0" rx="7.5" ry="4.5" className="im-chain" initial={false}
          animate={{ opacity: active >= 2 ? 1 : 0, rotate: k % 2 ? 0 : 0 }} transition={p(0.4, 0.5 + k * 0.15)} />)}
        <text x="13" y="22" textAnchor="middle" className="bi-tiny">larga escala</text>
      </g>
      <Arrow d="M130 200C140 200 146 198 152 194" on={active >= 2} p={p} head="im-head-glob" delay={0.9} />
    </motion.g>

    {/* Camada 4: o navio negreiro cruza da África para a América. */}
    <motion.g initial={false} animate={layer(3)} transition={p(0.5)}>
      <path d="M326 216C296 244 254 246 224 220" className="im-route" />
      <motion.g initial={false} animate={active === 3 && !still ? { x: [0, -50, -100], y: [0, 24, 2] } : { x: active === 3 ? -100 : 0, y: active === 3 ? 2 : 0 }} transition={p(2.2, 0.3)}>
        <g transform="translate(328 214)">
          <path d="M-14 0h28l-6 8h-16Z" className="im-hull" />
          <path d="M0 0v-20" className="im-mast" />
          <path d="M1 -19l11 15h-11Z" className="im-sail" />
          <path d="M-1 -17l-9 13h9Z" className="im-sail" />
        </g>
      </motion.g>
    </motion.g>

    <rect x="428" y="56" width="168" height="220" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.2)}>
      {panel.title.map((l, k) => <text key={l} x="512" y={78 + k * 15} textAnchor="middle" className="bi-panel-title">{l}</text>)}
      {active === 0 && <g transform="translate(512 136)">
        <path d="M0 -22v34M-16 12h32" className="bi-icon" />
        <motion.g initial={false} animate={{ rotate: still ? -12 : [0, -12] }} transition={p(0.9, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}>
          <path d="M-34 -22h68" className="bi-icon" />
          <path d="M-34 -22l-8 14h16ZM34 -22l-8 14h16Z" className="im-pan" />
          <ellipse cx="-34" cy="-12" rx="4" ry="2" className="im-gold" />
          <ellipse cx="-34" cy="-15" rx="4" ry="2" className="im-gold" />
        </motion.g>
      </g>}
      {active === 1 && <g transform="translate(512 130)">
        <path d="M-40 -10h66M20 -15l7 5-7 5M40 10h-66M-20 5l-7 5 7 5" className="bi-icon" />
        <path d="M-6 -4v-5a6 6 0 0 1 12 0v5" className="im-lock-arc" />
        <rect x="-10" y="-4" width="20" height="15" rx="3" className="im-lock" />
      </g>}
      {active === 2 && <g transform="translate(512 130)">
        {[-26, -13, 0, 13, 26].map((dx, k) => <motion.ellipse key={dx} cx={dx} cy="0" rx="8" ry="5" className="im-chain" initial={false}
          animate={{ y: still ? 0 : [0, k % 2 ? 3 : -3, 0] }} transition={p(0.8, 0.3 + k * 0.1)} />)}
      </g>}
      {active === 3 && <g transform="translate(512 134)">
        <path d="M-22 0h44l-9 12h-26Z" className="im-hull" />
        <path d="M-4 0v-30M8 0v-24" className="im-mast" />
        <path d="M-3 -29l14 24h-14ZM9 -23l10 18h-10Z" className="im-sail" />
        <path d="M-40 18q5-5 10 0t10 0t10 0t10 0t10 0t10 0t10 0t10 0" className="im-wave" />
      </g>}
      {panel.lines.map((l, k) => l && <text key={l} x="512" y={170 + k * 17} textAnchor="middle"
        className={(active === 3 && k >= 4) ? 'bi-small bi-warn' : k === 0 ? 'bi-small bi-strong' : 'bi-small'}>{l}</text>)}
    </motion.g>

    {LAYERS.map((l, k) => {
      const x = 30 + k * 142;
      return <g key={l}>
        <motion.rect x={x} y="290" width="124" height="26" rx="13" className={k === active ? 'im-chip im-chip-on' : 'im-chip'} initial={false}
          animate={{ opacity: k <= active ? 1 : 0.5 }} transition={p(0.4)} />
        <text x={x + 62} y="307" textAnchor="middle" className={k === active ? 'im-chip-text im-chip-text-on' : 'im-chip-text'}>{l}</text>
        {k < 3 && <path d={`M${x + 128} 303h10M${x + 134} 299l4 4-4 4`} className="bi-arrow-static" />}
      </g>;
    })}
    <text x="30" y="342" className="bi-foot">Contornos esquemáticos, sem escala; cada camada condiciona a seguinte.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// América Espanhola: a pirâmide de castas vista da base ao topo, na ordem dos
// recortes. O que a escala sozinha escondia é a trava entre o criollo e o
// cargo — riqueza não compra o degrau de cima, e é essa exclusão que o resumo
// liga à independência.
export function SpanishCastes({ active }: Scene) {
  const p = usePaced();
  const still = p(1).duration === 0;
  const tiers = [
    { x: 40, y: 206, w: 340, h: 74, label: 'mestiços · indígenas · escravizados africanos' },
    { x: 100, y: 142, w: 220, h: 58, label: 'criollos' },
    { x: 150, y: 78, w: 120, h: 58, label: 'peninsulares' },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`América Espanhola: pirâmide de castas dos grupos subordinados aos criollos e aos peninsulares, com os cargos mais altos travados para os criollos; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="im-head-casta" />
    <text x="30" y="40" className="bi-kicker">AMÉRICA ESPANHOLA · CASTAS</text>
    <path d="M52 196V88" className="bi-arrow-static" markerEnd="url(#im-head-casta)" />
    <text x="62" y="98" className="bi-tiny">mais direitos,</text>
    <text x="62" y="111" className="bi-tiny">cargos e status</text>

    {tiers.map((t, k) => <motion.rect key={t.label} x={t.x} y={t.y} width={t.w} height={t.h} rx="6" className={k === active ? 'im-tier im-tier-on' : 'im-tier'}
      initial={false} animate={{ opacity: k === active ? 1 : 0.75 }} transition={p(0.4)} />)}

    {/* Base: as subdivisões são as posições intermediárias por combinação
        étnica; acendem uma a uma, cada uma com seu lugar codificado. */}
    {[0, 1, 2, 3, 4].map(k => <motion.rect key={k} x={48 + k * 66} y="214" width="60" height="30" rx="4" className="im-cell" initial={false}
      animate={{ opacity: active === 0 ? 1 : 0.55, y: active === 0 && !still ? [6, 0] : 0 }} transition={p(0.4, active === 0 ? 0.15 * k : 0)} />)}
    {[0, 1, 2, 3, 4].map(k => <Person key={`base-${k}`} x={78 + k * 66} y={220} s={0.45} coat={['bi-coat-plain', 'bi-coat-green', 'bi-coat', 'bi-coat-plain', 'bi-coat-green'][k]} />)}
    <text x="210" y="266" textAnchor="middle" className={active === 0 ? 'bi-small bi-strong' : 'bi-small'}>{tiers[0].label}</text>

    <Person x={140} y={160} s={0.62} coat="bi-coat-royal" hat="brim" />
    <Person x={280} y={160} s={0.62} coat="bi-coat-royal" hat="brim" />
    {[118, 302].map(x => <g key={x} transform={`translate(${x} 176)`}>
      <path d="M-8 10q-2-12 4-15h8q6 3 4 15Z" className="im-sack" />
      <path d="M-3 -5h6" className="bi-sack-tie" />
    </g>)}
    <text x="210" y="168" textAnchor="middle" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>criollos</text>
    <text x="210" y="186" textAnchor="middle" className="bi-tiny">nascidos na América</text>

    <Person x={186} y={90} s={0.62} coat="bi-coat-dark" hat="top" />
    <g transform="translate(236 100)">
      <path d="M-8 -14h16v20h-16Z" className="im-doc" />
      <path d="M-4 -8h8M-4 -3h8" className="bi-scroll-line" />
      <circle cx="5" cy="5" r="4" className="bi-seal" />
    </g>
    <text x="210" y="124" textAnchor="middle" className={active === 2 ? 'bi-label bi-on' : 'bi-label'}>peninsulares</text>

    {/* A trava: o criollo sobe com a riqueza e é devolvido ao próprio degrau. */}
    <path d="M148 139H272" className="im-gate" />
    <motion.g initial={false} animate={{ x: active === 1 && !still ? [0, -2, 2, -2, 0] : 0 }} transition={p(0.5, 1.1)}>
      <path d="M204 134v-4a6 6 0 0 1 12 0v4" className="im-lock-arc" />
      <rect x="200" y="133" width="20" height="13" rx="3" className="im-lock" />
    </motion.g>
    {active === 1 && <motion.g initial={{ y: 0, opacity: still ? 0 : 1 }} animate={still ? { opacity: 0 } : { y: [0, -24, -10, 0], opacity: [1, 1, 1, 0] }} transition={p(1.6, 0.2)}>
      <Person x={250} y={160} s={0.55} coat="bi-coat-royal" hat="brim" />
    </motion.g>}
    <motion.text x="142" y="132" textAnchor="end" className="bi-hand-sm" initial={false} animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.4, 1)}>travado</motion.text>

    {/* O navio só chega no recorte dos peninsulares: nascer na Espanha é o que os põe no topo. */}
    <motion.g initial={false} animate={{ x: active === 2 ? 0 : 40, opacity: active === 2 ? 1 : 0.35 }} transition={p(1.1, 0.2)}>
      <g transform="translate(330 96)">
        <path d="M-16 0h32l-7 9h-18Z" className="im-hull" />
        <path d="M0 0v-22" className="im-mast" />
        <path d="M1 -21l12 17h-12Z" className="im-sail" />
      </g>
      <text x="330" y="124" textAnchor="middle" className="bi-tiny">da Espanha</text>
    </motion.g>

    <rect x="408" y="56" width="188" height="224" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.25)}>
      {active === 0 && <g>
        <text x="502" y="80" textAnchor="middle" className="bi-panel-title">GRUPOS SUBORDINADOS</text>
        {['posições intermediárias', 'por combinação étnica,', 'reconhecidas em lei'].map((l, k) => <text key={l} x="502" y={104 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
        <text x="502" y="166" textAnchor="middle" className="bi-small bi-strong">a casta determinava:</text>
        {[['direitos legais', 'M-6 -5h12M0 -5v12M-8 -1l-3 6h6ZM8 -1l-3 6h6Z'], ['ocupações permitidas', 'M-7 7l10-10M1 -6l7 3-3 3'], ['status social', 'M-7 6h14M-5 6V0M0 6V-5M5 6V-2']].map(([word, d], k) => <g key={word}>
          <g transform={`translate(430 ${190 + k * 24})`}><path d={d} className="bi-icon" /></g>
          <text x="446" y={194 + k * 24} className="bi-small">{word}</text>
        </g>)}
      </g>}
      {active === 1 && <g>
        <text x="502" y="80" textAnchor="middle" className="bi-panel-title">CRIOLLOS</text>
        {['descendentes de espanhóis', 'nascidos na América'].map((l, k) => <text key={l} x="502" y={102 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
        <text x="428" y="152" className="bi-small bi-strong">poder econômico</text>
        <text x="580" y="152" textAnchor="end" className="im-yes">sim</text>
        <text x="428" y="174" className="bi-small bi-strong">cargos mais altos</text>
        <text x="580" y="174" textAnchor="end" className="im-no">não</text>
        <path d="M428 186H580" className="bi-tick" />
        <text x="502" y="210" textAnchor="middle" className="bi-hand-sm">ressentimento</text>
        <text x="502" y="230" textAnchor="middle" className="bi-small">alimenta, depois,</text>
        <text x="502" y="246" textAnchor="middle" className="bi-small">a independência liderada</text>
        <text x="502" y="262" textAnchor="middle" className="bi-small">pela elite crioula</text>
      </g>}
      {active === 2 && <g>
        <text x="502" y="80" textAnchor="middle" className="bi-panel-title">PENINSULARES</text>
        {['espanhóis nascidos', 'na própria Espanha'].map((l, k) => <text key={l} x="502" y={102 + k * 16} textAnchor="middle" className="bi-small">{l}</text>)}
        <text x="502" y="148" textAnchor="middle" className="bi-small bi-strong">cargos mais elevados:</text>
        <g transform="translate(456 176)"><path d="M-9 -12h18v22h-18ZM-5 -6h10M-5 -1h10" className="bi-icon" /></g>
        <text x="456" y="204" textAnchor="middle" className="bi-tiny">administrativos</text>
        <g transform="translate(548 176)"><path d="M0 -13v24M-7 -5h14" className="bi-icon" /></g>
        <text x="548" y="204" textAnchor="middle" className="bi-tiny">eclesiásticos</text>
        <text x="502" y="236" textAnchor="middle" className="bi-small">vice-reis: Nova Espanha</text>
        <text x="502" y="252" textAnchor="middle" className="bi-small">(México) e Peru (Lima)</text>
      </g>}
    </motion.g>
    <text x="30" y="306" className="bi-small">origem étnica + local de nascimento → lugar na hierarquia</text>
    <text x="30" y="342" className="bi-foot">Esquema da hierarquia jurídica; a altura dos degraus não mede população.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Reforma Religiosa: tese, crítica e síntese. O que a fôrma dialética dizia
// em palavras a cena mostra em material: as duas colunas de Trento recebem
// um fio de cada estação anterior — o dogma mantido vem da Igreja de antes,
// a correção dos abusos vem da crítica.
const STATIONS = [
  { x: 24, title: 'ANTES DA REFORMA', when: 'indulgências' },
  { x: 222, title: 'CRÍTICA LUTERANA', when: '95 teses · 1517' },
  { x: 420, title: 'CONCÍLIO DE TRENTO', when: '1545–1563' },
];

export function ReformationDialectic({ active }: Scene) {
  const p = usePaced();
  const still = p(1).duration === 0;
  const dim = (k: number) => ({ opacity: k === active || (active === 2 && k < 2) ? 1 : 0.5 });
  const notes = ['pagar para reduzir o purgatório', 'salvação pela fé, sem intermediário pago', 'nem a Igreja de antes, nem a simples recusa'];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Reforma Religiosa em três tempos: venda de indulgências, crítica luterana de 1517 e Concílio de Trento, que mantém dogmas e corrige abusos; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="im-head-ref" />
    <text x="30" y="40" className="bi-kicker">REFORMA E CONTRARREFORMA · SÉC. XVI</text>
    {STATIONS.map((s, k) => <g key={s.title}>
      <rect x={s.x} y="54" width="176" height="176" rx="14" className={k === active ? 'bi-panel im-card-on' : 'bi-panel'} />
      <motion.g initial={false} animate={dim(k)} transition={p(0.4)}>
        <text x={s.x + 88} y="76" textAnchor="middle" className="bi-panel-title">{s.title}</text>
        <text x={s.x + 88} y="92" textAnchor="middle" className="bi-tiny">{s.when}</text>
      </motion.g>
    </g>)}

    {/* Estação 1: a moeda cai no cofre e sai o papel; a ampulheta do
        purgatório perde areia. */}
    <motion.g initial={false} animate={dim(0)} transition={p(0.4)}>
      <path d="M44 166v-30l22-18 22 18v30ZM58 166v-14a8 8 0 0 1 16 0v14M66 118v-12M61 111h10" className="bi-icon" />
      <rect x="100" y="150" width="34" height="16" rx="2" className="im-chest" />
      <path d="M112 150h10" className="im-slot" />
      <motion.circle cx="117" cy="130" r="5" className="im-gold" initial={false}
        animate={active === 0 && !still ? { y: [-6, 20, 20], opacity: [1, 1, 0] } : { y: 20, opacity: 0 }} transition={p(1, 0.3)} />
      <Arrow d="M138 150C146 140 150 132 152 124" on={active === 0} p={p} head="im-head-ref" delay={0.9} />
      <motion.g initial={false} animate={{ y: active === 0 && !still ? [12, 0] : 0 }} transition={p(0.6, 1.1)}>
        <path d="M156 100h24v30h-24Z" className="im-doc" />
        <path d="M160 108h16M160 114h16M160 120h10" className="bi-scroll-line" />
      </motion.g>
      <g transform="translate(168 184)">
        <path d="M-9 -16h18M-9 16h18M-7 -16c0 12 14 12 14 32M7 -16c0 12-14 12-14 32" className="bi-icon" />
        <motion.path d="M-5 -12h10l-5 9Z" className="im-sand" initial={false} animate={{ scale: active === 0 ? 0.45 : 1 }} transition={p(1.2, 1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
        <motion.path d="M-6 14h12l-6 -6Z" className="im-sand" initial={false} animate={{ scale: active === 0 ? 1 : 0.4 }} transition={p(1.2, 1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      </g>
      <text x="92" y="190" textAnchor="middle" className="bi-small bi-strong">paga-se</text>
      <text x="92" y="206" textAnchor="middle" className="bi-tiny">menos purgatório</text>
    </motion.g>

    {/* Estação 2: a porta, o martelo e as teses. */}
    <motion.g initial={false} animate={dim(1)} transition={p(0.4)}>
      <path d="M244 196v-72a28 28 0 0 1 56 0v72ZM272 96v100" className="im-door" />
      <motion.g initial={false} animate={{ scale: active === 1 && !still ? [0.7, 1] : 1 }} transition={p(0.4, 0.7)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x="252" y="130" width="40" height="46" rx="2" className="im-doc" />
        <text x="272" y="152" textAnchor="middle" className="im-theses">95</text>
        <text x="272" y="166" textAnchor="middle" className="bi-tiny">teses</text>
      </motion.g>
      <motion.g initial={false} animate={{ rotate: active === 1 && !still ? [0, -30, 0, -30, 0] : 0 }} transition={p(1, 0.1)} style={{ transformBox: 'view-box', transformOrigin: '336px 176px' }}>
        <path d="M336 176L304 146" className="im-handle" />
        <path d="M292 146l12-12 10 10-12 12Z" className="im-hammer" />
      </motion.g>
      <g transform="translate(360 124)">
        <path d="M-14 -10h11a4 4 0 0 1 3 2v20a4 4 0 0 0-3-2h-11ZM14 -10h-11a4 4 0 0 0-3 2v20a4 4 0 0 1 3-2h11Z" className="bi-icon" />
      </g>
      <text x="360" y="150" textAnchor="middle" className="bi-tiny">Bíblia em</text>
      <text x="360" y="162" textAnchor="middle" className="bi-tiny">língua local</text>
      <text x="310" y="214" textAnchor="middle" className="bi-small bi-strong">justificação pela fé</text>
    </motion.g>

    {/* Estação 3: duas colunas, cada uma alimentada por um fio. */}
    <motion.g initial={false} animate={dim(2)} transition={p(0.4)}>
      <rect x="434" y="102" width="70" height="104" rx="6" className="im-col-keep" />
      <rect x="512" y="102" width="70" height="104" rx="6" className="im-col-fix" />
      <text x="469" y="118" textAnchor="middle" className="im-col-title">reafirma</text>
      <text x="547" y="118" textAnchor="middle" className="im-col-title">corrige</text>
      {['autoridade', 'papal', 'sacramentos', 'fé + obras'].map((l, k) => <text key={l} x="469" y={138 + k * 16} textAnchor="middle" className="bi-tiny">{l}</text>)}
      {['venda de', 'indulgências', 'formação', 'do clero'].map((l, k) => <text key={l} x="547" y={138 + k * 16} textAnchor="middle" className="bi-tiny">{l}</text>)}
      <text x="508" y="222" textAnchor="middle" className="bi-tiny">a resposta: Contrarreforma</text>
    </motion.g>

    <motion.path d="M92 230V250H469V232" className="im-thread-keep" initial={false} animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(1, 0.2)} />
    <motion.path d="M310 230V242H547V232" className="im-thread-fix" initial={false} animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(1, 0.6)} />

    <motion.text key={active} x="310" y="276" textAnchor="middle" className="bi-hand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, active === 2 ? 1.4 : 0.8)}>{notes[active]}</motion.text>

    <path d="M40 304H580" className="bi-axis" />
    {[[1517, '95 teses'], [1540, 'jesuítas'], [1545, 'Trento abre'], [1563, 'Trento fecha']].map(([y, l]) => {
      const x = 60 + ((y as number) - 1517) * (500 / 46);
      const hot = active === 2 ? (y as number) >= 1540 : active === 1 && y === 1517;
      return <g key={y}>
        <motion.circle cx={x} cy="304" r="4.5" className={hot ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false} animate={{ scale: hot ? 1.4 : 1 }} transition={p(0.4, 0.3)} />
        <text x={x} y="322" textAnchor="middle" className={hot ? 'bi-tiny bi-strong' : 'bi-tiny'}>{y}</text>
        <text x={y === 1540 ? x + 8 : y === 1545 ? x - 8 : x} y="334" textAnchor={y === 1540 ? 'end' : y === 1545 ? 'start' : 'middle'} className="bi-tiny">{l}</text>
      </g>;
    })}
  </svg>;
}

// ---------------------------------------------------------------------------
// Absolutismo: dois caminhos, o mesmo trono. Bossuet desce do céu, Hobbes
// sobe da guerra de todos contra todos; no terceiro recorte os dois fios
// acendem juntos e se encontram no mesmo pedestal.
export function AbsolutismPaths({ active }: Scene) {
  const p = usePaced();
  const still = p(1).duration === 0;
  const on = (k: number) => active === k || active === 2;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Absolutismo: o direito divino de Bossuet e o contrato de Hobbes partem de bases diferentes e chegam ao mesmo poder absoluto; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="im-head-abs" />
    <text x="30" y="40" className="bi-kicker">ABSOLUTISMO · DUAS JUSTIFICATIVAS</text>

    {/* Trono central. */}
    <g>
      <path d="M284 244v-78a6 6 0 0 1 6-6h40a6 6 0 0 1 6 6v78M276 214h68v10h-68Z" className="bi-throne-big" />
      <path d="M292 172h36v40h-36Z" className="bi-cushion" />
      <Person x={310} y={186} s={0.9} coat="bi-coat-royal" />
      <motion.path d="M298 172l2-14 6 6 4-10 4 10 6-6 2 14Z" className="bi-crown" initial={false}
        animate={{ scale: active === 2 ? [1, 1.3, 1.15] : 1.15 }} transition={p(0.8, 1.4)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <motion.rect x="226" y="246" width="168" height="24" rx="5" className="bi-plinth" initial={false} animate={{ opacity: active === 2 ? 1 : 0.75 }} transition={p(0.4)} />
      <text x="310" y="262" textAnchor="middle" className="bi-plinth-text">PODER ABSOLUTO</text>
    </g>

    {/* Bossuet: nuvem, raios descendo sobre a coroa. */}
    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0.45 }} transition={p(0.4)}>
      <path d="M150 92a14 14 0 0 1 22-14a18 18 0 0 1 32 4a12 12 0 0 1 2 24h-52a10 10 0 0 1-4-14Z" className="im-cloud" />
      {[0, 1, 2].map(k => <motion.path key={k} d={`M${168 + k * 14} 108l${10 + k * 6} ${22 + k * 4}`} className="im-ray" initial={false}
        animate={{ pathLength: on(0) ? 1 : 0.4 }} transition={p(0.6, on(0) ? 0.2 + k * 0.12 : 0)} />)}
      <Arrow d="M216 128C250 132 276 144 294 158" on={on(0)} p={p} head="im-head-abs" delay={0.5} />
      <Person x={70} y={124} s={1} coat="bi-coat-dark" />
      <path d="M67 136v8M73 136v8" className="im-collar" />
      <g transform="translate(96 146)">
        <path d="M-8 -8h16v16h-16Z" className="im-book" />
        <path d="M0 -5v10M-3 -2h6" className="im-book-cross" />
      </g>
      <text x="30" y="186" className="bi-label">direito divino</text>
      <text x="30" y="202" className="bi-small">Bossuet, França</text>
      <text x="30" y="224" className="bi-small">o poder vem direto de Deus;</text>
      <text x="30" y="240" className="bi-small">contestar o rei = afronta</text>
      <text x="30" y="256" className="bi-small">à ordem divina</text>
    </motion.g>

    {/* Hobbes: estado de natureza, direitos cedidos, soberano. */}
    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0.45 }} transition={p(0.4)}>
      <Person x={456} y={70} s={0.6} coat="bi-coat-plain" />
      <Person x={500} y={70} s={0.6} coat="bi-coat-green" />
      <motion.g initial={false} animate={{ rotate: active === 1 && !still ? [0, 18, -6, 0] : 0 }} transition={p(0.8, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d="M464 76l26-16M492 76l-26-16" className="im-sword" />
      </motion.g>
      <text x="478" y="104" textAnchor="middle" className="bi-tiny">guerra de todos contra todos</text>
      <Arrow d="M478 112V130" on={on(1)} p={p} head="im-head-abs" delay={0.4} />
      {[0, 1].map(k => <motion.rect key={k} x={452 + k * 44} y="80" width="9" height="7" rx="1" className="bi-ballot" initial={false}
        animate={active === 1 && !still ? { x: [0, 26 - k * 44, 26 - k * 44], y: [0, 50, 64], opacity: [1, 1, 0] } : { x: 0, y: 0, opacity: 0 }} transition={p(1.4, 0.6 + k * 0.2)} />)}
      <g transform="translate(482 156)">
        <path d="M-22 -14h40a4 4 0 0 1 4 4v24h-40a4 4 0 0 1-4-4Z" className="bi-scroll" />
        <path d="M-15 -6h28M-15 0h28M-15 6h20" className="bi-scroll-line" />
      </g>
      <text x="530" y="152" className="bi-small bi-strong">Leviatã</text>
      <text x="530" y="166" className="bi-small">1651</text>
      <Arrow d="M456 168C420 170 368 170 342 178" on={on(1)} p={p} head="im-head-abs" delay={0.9} />
      <text x="590" y="202" textAnchor="end" className="bi-label">contrato · Hobbes</text>
      <text x="590" y="224" textAnchor="end" className="bi-small">cada um cede seus direitos</text>
      <text x="590" y="240" textAnchor="end" className="bi-small">naturais ao soberano</text>
      <text x="590" y="256" textAnchor="end" className="bi-small">em troca de segurança e paz</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0.35 }} transition={p(0.5, active === 2 ? 1 : 0)}>
      <text x="118" y="298" textAnchor="middle" className="im-base-tag">base religiosa</text>
      <text x="424" y="298" className="im-base-tag">base racional e contratual</text>
      <path d="M170 294C206 294 220 284 232 272M416 294C398 294 398 284 388 272" className="im-thread-keep" />
    </motion.g>
    <motion.text key={active} x="310" y="300" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.2)}>
      {['de Deus para o rei', 'do contrato para o rei', 'partidas diferentes,'][active]}
    </motion.text>
    {active === 2 && <motion.text x="310" y="318" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.4)}>mesma conclusão</motion.text>}
    <text x="30" y="342" className="bi-foot">Esquema das duas teorias; o trono é metáfora do poder centralizado.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Iluminismo: a lâmpada da razão embaixo, três propostas em cima. Cada
// recorte leva a luz por um galho; o último acende os três de uma vez, que é
// a tese do capítulo — base comum, propostas diferentes.
const THINKERS = [
  { x: 24, name: 'MONTESQUIEU', work: 'O Espírito das Leis · 1748', idea: 'separação dos poderes' },
  { x: 222, name: 'ROUSSEAU', work: 'O Contrato Social · 1762', idea: 'soberania popular' },
  { x: 420, name: 'VOLTAIRE', work: 'contra o fanatismo religioso', idea: 'liberdade de expressão' },
];

export function EnlightenmentLamp({ active }: Scene) {
  const p = usePaced();
  const still = p(1).duration === 0;
  const lit = (k: number) => active === k || active === 3;
  const dim = (k: number) => ({ opacity: lit(k) ? 1 : 0.5 });
  const notes = [
    ['evita concentrar o poder;', 'influencia EUA e a Carta de 1824'],
    ['legitimidade na vontade geral,', 'não no direito divino'],
    ['critica a intolerância', 'institucional da Igreja'],
    ['razão, não tradição:', 'mesma base, propostas diferentes'],
  ][active];
  // A pena percorre as quatro linhas da folha; sob movimento reduzido fica no fim da última.
  const quill = { x: [468, 504, 468, 504, 468, 504, 468, 490], y: [126, 126, 138, 138, 150, 150, 162, 162] };
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Iluminismo: da mesma base racionalista saem a separação dos poderes de Montesquieu, a soberania popular de Rousseau e a liberdade de expressão de Voltaire; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <defs><marker id="im-head-ilu" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="im-up-head" /></marker></defs>
    <text x="30" y="40" className="bi-kicker">ILUMINISMO · SÉCULO XVIII</text>

    {THINKERS.map((t, k) => <g key={t.name}>
      <rect x={t.x} y="54" width="176" height="164" rx="14" className={lit(k) ? 'bi-panel im-card-on' : 'bi-panel'} />
      <motion.g initial={false} animate={dim(k)} transition={p(0.4)}>
        <text x={t.x + 88} y="76" textAnchor="middle" className="bi-panel-title">{t.name}</text>
        <text x={t.x + 88} y="91" textAnchor="middle" className="bi-tiny">{t.work}</text>
        <text x={t.x + 88} y="206" textAnchor="middle" className={lit(k) ? 'bi-small bi-strong' : 'bi-small'}>{t.idea}</text>
      </motion.g>
    </g>)}

    {/* Montesquieu: um bloco só de poder se parte em três pilares. */}
    <motion.g initial={false} animate={dim(0)} transition={p(0.4)}>
      <text x="112" y="108" textAnchor="middle" className="bi-tiny">um bloco de poder vira três</text>
      {['E', 'L', 'J'].map((l, k) => <motion.g key={l} initial={false}
        animate={{ x: lit(0) ? (k - 1) * 20 : 0 }} transition={p(0.8, lit(0) ? 0.4 : 0)}>
        <rect x={91 + k * 14} y="118" width="14" height="6" className="im-capital" />
        <rect x={93 + k * 14} y="124" width="10" height="50" className="im-pillar" />
        <motion.text x={98 + k * 14} y="188" textAnchor="middle" className="bi-tiny bi-strong" initial={false} animate={{ opacity: lit(0) ? 1 : 0 }} transition={p(0.4, 0.9)}>{l}</motion.text>
      </motion.g>)}
      <path d="M64 176h96" className="bi-ground" />
    </motion.g>

    {/* Rousseau: a coroa riscada em cima, a legitimidade subindo do povo. */}
    <motion.g initial={false} animate={dim(1)} transition={p(0.4)}>
      <path d="M296 124l2-12 6 5 4-9 4 9 6-5 2 12Z" className="bi-crown" />
      <motion.path d="M290 106l36 22M326 106l-36 22" className="bi-cross" initial={false} animate={{ pathLength: lit(1) ? 1 : 0, opacity: lit(1) ? 1 : 0 }} transition={p(0.5, 0.9)} />
      {[262, 286, 310, 334, 358].map((x, k) => <Person key={x} x={x} y={160} s={0.5} coat={['bi-coat-plain', 'bi-coat-green', 'bi-coat', 'bi-coat-green', 'bi-coat-plain'][k]} />)}
      {[274, 310, 346].map((x, k) => <motion.path key={x} d={`M${x} 150v-16`} className="im-up" markerEnd="url(#im-head-ilu)" initial={false}
        animate={{ pathLength: lit(1) ? 1 : 0, opacity: lit(1) ? 1 : 0 }} transition={p(0.6, lit(1) ? 0.2 + k * 0.15 : 0)} />)}
      <text x="310" y="190" textAnchor="middle" className="bi-tiny">vontade geral</text>
    </motion.g>

    {/* Voltaire: a pena escreve; o cadeado se abre. */}
    <motion.g initial={false} animate={dim(2)} transition={p(0.4)}>
      <path d="M458 112h56v66h-56Z" className="im-doc" />
      {[0, 1, 2, 3].map(k => <motion.path key={k} d={`M468 ${126 + k * 12}h${k === 3 ? 22 : 36}`} className="im-ink" initial={false}
        animate={{ pathLength: lit(2) ? 1 : 0.25 }} transition={p(0.35, lit(2) ? 0.2 + k * 0.35 : 0)} />)}
      <motion.g initial={false} animate={lit(2) && !still ? quill : { x: 490, y: 162 }} transition={p(1.5, 0.2)}>
        <path d="M0 0c10-14 22-22 30-24c-2 8-10 20-24 30Z" className="im-quill" />
        <path d="M0 0l-3 4" className="im-ink" />
      </motion.g>
      <g transform="translate(556 162)">
        <motion.path d="M-6 -2v-6a6 6 0 0 1 12 0" className="im-lock-arc" initial={false} animate={{ y: lit(2) ? -7 : 0 }} transition={p(0.4, 1.6)} />
        <rect x="-10" y="-2" width="20" height="15" rx="3" className="im-lock" />
      </g>
    </motion.g>

    {/* Base: a lamparina e os três galhos de luz. */}
    {[112, 310, 508].map((x, k) => <g key={x}>
      <path d={`M310 240C310 230 ${x} 234 ${x} 220`} className="im-branch" />
      <motion.path d={`M310 240C310 230 ${x} 234 ${x} 220`} className="im-branch-on" initial={false}
        animate={{ pathLength: lit(k) ? 1 : 0, opacity: lit(k) ? 1 : 0 }} transition={p(0.8, lit(k) ? 0.1 : 0)} />
    </g>)}
    <motion.circle cx="310" cy="262" r="24" className="im-glow" initial={false} animate={{ scale: active === 3 ? 1.3 : 1, opacity: active === 3 ? 0.85 : 0.45 }} transition={p(0.7, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    <g transform="translate(310 272)">
      <path d="M-26 -6h52c-4 12-44 12-52 0Z" className="im-lamp" />
      <path d="M26 -4c10-2 12 8 2 10" className="im-lamp-handle" />
      <path d="M-8 6l-4 8h24l-4-8" className="im-lamp" />
      <path d="M-4 -6v-4h8v4" className="im-lamp" />
      <path d="M0 -12c-6-8-2-16 0-22c2 6 6 14 0 22Z" className="bi-flame" />
    </g>
    <text x="310" y="306" textAnchor="middle" className={active === 3 ? 'bi-label bi-on' : 'bi-label'}>razão</text>

    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>
      <text x={active === 2 ? 590 : 30} y="258" textAnchor={active === 2 ? 'end' : 'start'} className="bi-hand-sm">{notes[0]}</text>
      <text x={active === 2 ? 590 : 30} y="276" textAnchor={active === 2 ? 'end' : 'start'} className="bi-hand-sm">{notes[1]}</text>
    </motion.g>
    <text x="30" y="342" className="bi-foot">Esquema das propostas; a lamparina é metáfora da base racionalista comum.</text>
  </svg>;
}

export const SCENES_LOTE7B: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-a-primeira-globalizacao': FirstGlobalization,
  'summary-historia-america-espanhola': SpanishCastes,
  'summary-historia-reforma-religiosa': ReformationDialectic,
  'summary-historia-absolutismo': AbsolutismPaths,
  'summary-historia-iluminismo': EnlightenmentLamp,
};
export const HEADERS_LOTE7B: Record<string, string> = {
  'summary-historia-a-primeira-globalizacao': 'camadas da exploração colonial',
  'summary-historia-america-espanhola': 'hierarquia de castas',
  'summary-historia-reforma-religiosa': 'tese, crítica e síntese',
  'summary-historia-absolutismo': 'duas justificativas, um poder',
  'summary-historia-iluminismo': 'base comum, propostas distintas',
};
