import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';

// Lote 3 da régua de História e Geografia: geografia física do Brasil. Cada
// cena desenha o processo que o capítulo explica, e o recorte escolhido
// decide o que se move. Fatos, nomes e números vêm do resumo do capítulo;
// mapas e perfis são esquemáticos e dizem isso na própria prancha.

type Scene = { active: number };

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Contorno do Brasil a partir de coordenadas reais (projeção retangular) e
// regiões aproximadas recortadas por ele. Limites climáticos e de domínio são
// faixas, não linhas — a prancha avisa.
export const BRAZIL = 'M138.9 36.2L212.7 43.1L216.8 76.2L237.3 87L271.7 95.5L319.3 104.7L346.4 120.9L348.8 138.6L319.3 176.3L313.6 213.3L304.5 232.5L290.6 253.3L280.8 252.5L255.3 261L237.3 288.7L224.2 306.4L197.1 335.7L162.7 308.7L195.5 284.1L187.3 272.6L184 261L161 245.6L159.4 199.4L143 180.2L102 153.2L29 133.2L36.4 110.9L61.8 108.5L85.6 64.7L114.3 60.8Z';
const ZONE = {
  equatorial: 'M11.8 22.3L274.2 22.3L274.2 99.3L225 145.5L143 160.9L11.8 153.2Z',
  semiarido: 'M274.2 99.3L331.6 107L327.5 153.2L302.9 184L278.3 191.7L266 145.5Z',
  subtropical: 'M143 257.1L307 257.1L307 353.4L143 353.4Z',
  amazonico: 'M11.8 22.3L249.6 22.3L249.6 107L208.6 145.5L143 168.6L11.8 160.9Z',
  cerrado: 'M143 168.6L208.6 145.5L249.6 107L266 145.5L278.3 191.7L266 230.2L225 245.6L167.6 237.9Z',
  caatinga: 'M266 145.5L274.2 99.3L331.6 107L327.5 153.2L302.9 184L278.3 191.7Z',
  mares: 'M331.6 107L356.2 114.7L356.2 153.2L323.4 184L315.2 222.5L290.6 261L241.4 284.1L225 268.7L266 230.2L278.3 191.7L302.9 184L327.5 153.2Z',
  araucarias: 'M192.2 261L241.4 272.6L229.1 295.7L192.2 291.8Z',
  pradarias: 'M159.4 299.5L216.8 299.5L216.8 345.7L159.4 345.7Z',
};

export function EarthSeasons({ active }: Scene) {
  const p = usePaced();
  const tilt = 23.5;
  const earth = (cx: number, sunRight: boolean, key: string) => <g key={key}>
    <circle cx={cx} cy="196" r="24" className="gf-ocean" />
    <path d={sunRight ? `M${cx} 172A24 24 0 0 0 ${cx} 220Z` : `M${cx} 172A24 24 0 0 1 ${cx} 220Z`} className="gf-night" />
    <g transform={`rotate(${tilt} ${cx} 196)`}>
      <ellipse cx={cx} cy="196" rx="24" ry="5" className="gf-equator" />
      <path d={`M${cx} 162V230`} className="gf-axis" />
      <text x={cx} y="157" textAnchor="middle" className="gf-tiny">N</text>
    </g>
  </g>;
  const orbit = Array.from({ length: 9 }, (_, k) => Math.PI - (k * Math.PI) / 8);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Movimentos da Terra: eixo inclinado 23,5 graus, hemisférios alternam, incidência direta e estações opostas; elo ${active + 1} destacado`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-night-sky" />
    <text x="30" y="40" className="gf-kicker gf-kicker-light">TRANSLAÇÃO · FORA DE ESCALA</text>
    <ellipse cx="250" cy="196" rx="180" ry="64" className="gf-orbit" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d={`M${250 + 34 * Math.cos(a * Math.PI / 180)} ${196 + 34 * Math.sin(a * Math.PI / 180)}l${8 * Math.cos(a * Math.PI / 180)} ${8 * Math.sin(a * Math.PI / 180)}`} className="gf-sunray" />)}
    <circle cx="250" cy="196" r="28" className="gf-sun" />
    <text x="250" y="200" textAnchor="middle" className="gf-sun-label">Sol</text>

    <motion.g initial={false} animate={{ opacity: active === 1 ? 0.35 : 1 }} transition={p(0.4)}>
      {earth(70, true, 'jun')}
      {earth(430, false, 'dez')}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <path d="M70 150V242" className="gf-ref" />
      <path d="M70 160A36 36 0 0 1 84.4 163" className="gf-arc" />
      <text x="62" y="150" textAnchor="end" className="gf-hand">23,5°</text>
      <text x="430" y="120" textAnchor="middle" className="gf-hand">o eixo aponta sempre</text>
      <text x="430" y="138" textAnchor="middle" className="gf-hand">para o mesmo lado</text>
    </motion.g>
    {active === 1 && <motion.g initial={{ x: -180, y: 0 }}
      animate={p(1).duration === 0 ? { x: 180, y: 0 } : { x: orbit.map(a => 180 * Math.cos(a)), y: orbit.map(a => -64 * Math.sin(a)) }}
      transition={p(2.6)}>
      {earth(250, true, 'moving')}
    </motion.g>}
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, 0.2)}>
      <rect x="476" y="54" width="128" height="140" rx="10" className="gf-inset" />
      <text x="540" y="72" textAnchor="middle" className="gf-tiny-dark">raios diretos</text>
      {[520, 540, 560].map(x => <path key={x} d={`M${x} 78V112`} className="gf-beam" />)}
      <path d="M516 114h48" className="gf-hot" />
      <text x="540" y="136" textAnchor="middle" className="gf-tiny-dark">raios oblíquos</text>
      {[504, 524, 544].map(x => <path key={x} d={`M${x} 140l24 36`} className="gf-beam" />)}
      <path d="M516 178h72" className="gf-cool" />
      <text x="540" y="190" textAnchor="middle" className="gf-tiny-dark">mesma luz, área maior</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0.15 }} transition={p(0.5, 0.3)}>
      <text x="70" y="262" textAnchor="middle" className="gf-season">junho</text>
      <text x="70" y="280" textAnchor="middle" className="gf-small-light">verão no Norte</text>
      <text x="70" y="296" textAnchor="middle" className="gf-small-light">inverno no Sul</text>
      <text x="430" y="262" textAnchor="middle" className="gf-season">dezembro</text>
      <text x="430" y="280" textAnchor="middle" className="gf-small-light">verão no Sul</text>
      <text x="430" y="296" textAnchor="middle" className="gf-small-light">inverno no Norte</text>
    </motion.g>
    <text x="30" y="336" className="gf-foot-light">A distância ao Sol varia pouco (periélio e afélio); o que muda é a inclinação dos raios.</text>
  </svg>;
}

export function ReliefProfile({ active }: Scene) {
  const p = usePaced();
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Relevo brasileiro em perfil: planaltos antigos e erodidos, planícies de sedimentos recentes e depressões rebaixadas pela erosão; ${['planaltos', 'planícies', 'depressões'][active]} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-sky" />
    <text x="30" y="40" className="gf-kicker">PERFIL ESQUEMÁTICO · AB'SÁBER</text>
    <path d="M20 300V130Q60 112 100 116T170 128L200 206H290L310 150Q350 136 380 142T430 150L450 248H600V300Z" className="gf-rock" />
    <path d="M20 300V214Q120 226 200 222H290Q360 230 450 256H600V300Z" className="gf-shield" />
    <text x="100" y="290" textAnchor="middle" className="gf-small-light">escudo cristalino antigo</text>
    <path d="M450 248H600V262H450Z" className="gf-sediment" /><path d="M450 262H600V274H450Z" className="gf-sediment-2" />
    <path d="M556 248q10 -4 20 0" className="gf-river" />


    {[[80, 118], [120, 118], [340, 140], [390, 142]].map(([x, y], k) => <motion.circle key={k} r="3" className="gf-grain" initial={false}
      animate={active === 0 ? { cx: [x, x + (k < 2 ? 70 : 90)], cy: [y, k < 2 ? 196 : 240], opacity: [1, 0] } : { cx: x, cy: y, opacity: 0 }}
      transition={p(1.4, 0.2 + k * 0.2)} />)}
    <motion.text x="30" y="72" className="gf-hand" initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, 0.5)}>cerca de 60% do território: antigos e desgastados</motion.text>

    <motion.path d="M450 236H600V248H450Z" className="gf-sediment-new" initial={false} animate={{ scaleY: active === 1 ? 1 : 0 }} transition={p(1, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    {[470, 500, 530, 560, 590].map((x, k) => <motion.circle key={x} cx={x} r="2.6" className="gf-grain" initial={false}
      animate={active === 1 ? { cy: [200, 240], opacity: [1, 0] } : { cy: 200, opacity: 0 }} transition={p(1, 0.1 + k * 0.12)} />)}
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 0.5)}><text x="590" y="96" textAnchor="end" className="gf-hand">sedimentos recentes (Amazônica, Pantanal)</text><path d="M525 104V214" className="gf-leader" /></motion.g>

    <motion.path d="M200 190H290V206H200Z" className="gf-rock-top" initial={false} animate={{ opacity: active === 2 ? 0 : 1, y: active === 2 ? 10 : 0 }} transition={p(1.2, 0.3)} />
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, 0.2)}>
      {[206, 284].map(x => <path key={x} d={`M${x} 156v16m-4-5 4 5 4-5`} className="gf-down" />)}
      <text x="245" y="132" textAnchor="middle" className="gf-hand-sm">a erosão rebaixa</text>
      <text x="245" y="148" textAnchor="middle" className="gf-hand-sm">entre planaltos</text>
    </motion.g>
    <text x="95" y="102" textAnchor="middle" className={active === 0 ? 'gf-label gf-on' : 'gf-label'}>planalto</text>
    <text x="370" y="128" textAnchor="middle" className={active === 0 ? 'gf-label gf-on' : 'gf-label'}>planalto</text>
    <text x="245" y="184" textAnchor="middle" className={active === 2 ? 'gf-label gf-on' : 'gf-label'}>depressão</text>
    <text x="525" y="228" textAnchor="middle" className={active === 1 ? 'gf-label gf-on' : 'gf-label'}>planície</text>
    <text x="590" y="336" textAnchor="end" className="gf-foot">Alturas e distâncias fora de escala.</text>
  </svg>;
}

export function SoilProfiles({ active }: Scene) {
  const p = usePaced();
  const cols = [120, 310, 500];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Perfis de solo: latossolo profundo e pobre, terra roxa fértil sobre basalto, solo raso do semiárido sujeito à salinização; ${['latossolo', 'terra roxa', 'semiárido'][active]} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-sky" />
    <text x="30" y="40" className="gf-kicker">TRÊS PERFIS · PROFUNDIDADE FORA DE ESCALA</text>
    {cols.map((x, i) => <motion.g key={x} initial={false} animate={{ opacity: active === i ? 1 : 0.55 }} transition={p(0.4)}>
      <rect x={x - 70} y="110" width="140" height="190" className="gf-soil-frame" />
    </motion.g>)}
    <rect x="50" y="110" width="140" height="8" className="gf-horizon-o" />
    <rect x="50" y="118" width="140" height="182" className="gf-latossolo" />
    <text x="120" y="96" textAnchor="middle" className={active === 0 ? 'gf-label gf-on' : 'gf-label'}>latossolo</text>
    <text x="120" y="320" textAnchor="middle" className="gf-small">profundo e avermelhado</text>
    {[0, 1, 2, 3].map(k => <motion.circle key={k} r="3.2" className="gf-nutrient" initial={false}
      animate={active === 0 ? { cx: 80 + k * 26, cy: [140, 290], opacity: [1, 0] } : { cx: 80 + k * 26, cy: 150 + (k % 2) * 16, opacity: 1 }}
      transition={p(1.6, 0.3 + k * 0.2)} />)}
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      {[76, 104, 132, 160].map(x => <path key={x} d={`M${x} 74l-4 10`} className="gf-rain" />)}
      <text x="120" y="340" textAnchor="middle" className="gf-hand-sm">lixiviação: a chuva leva nutrientes</text>
    </motion.g>

    <rect x="240" y="110" width="140" height="8" className="gf-horizon-o" />
    <rect x="240" y="118" width="140" height="118" className="gf-terra-roxa" />
    <rect x="240" y="236" width="140" height="64" className="gf-basalt" />
    {[256, 280, 304, 328, 352].map(x => <path key={x} d={`M${x} 236v64`} className="gf-joint" />)}
    <path d="M310 110v-22m0 8q-10-2-12-10m12 16q10-2 12-10" className="gf-plant" />
    <circle cx="302" cy="96" r="2.4" className="gf-coffee" /><circle cx="318" cy="94" r="2.4" className="gf-coffee" />
    <text x="310" y="72" textAnchor="middle" className={active === 1 ? 'gf-label gf-on' : 'gf-label'}>terra roxa</text>
    <text x="310" y="320" textAnchor="middle" className="gf-small">sobre basalto</text>
    {[0, 1, 2, 3, 4, 5, 6].map(k => <motion.circle key={k} cx={256 + (k % 4) * 30 + (k > 3 ? 14 : 0)} cy={140 + Math.floor(k / 4) * 40 + (k % 2) * 12} r="3.2" className="gf-nutrient"
      initial={false} animate={{ scale: active === 1 ? 1 : 0.5, opacity: active === 1 ? 1 : 0.6 }} transition={p(0.5, active === 1 ? 0.3 + k * 0.08 : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      {[266, 310, 354].map(x => <path key={x} d={`M${x} 250v-22m-4 6 4-6 4 6`} className="gf-up" />)}
      <text x="310" y="340" textAnchor="middle" className="gf-hand-sm">basalto alterado: mais fértil</text>
    </motion.g>

    <rect x="430" y="110" width="140" height="42" className="gf-semiarid" />
    <rect x="430" y="152" width="140" height="148" className="gf-crystal" />
    {[[446, 170], [496, 196], [540, 176], [470, 246], [528, 262]].map(([x, y], k) => <path key={k} d={`M${x} ${y}l14-8 16 6-4 14-18 2Z`} className="gf-crystal-block" />)}
    <path d="M500 110v-26m0 8h-8v-8m8 12h8v-10" className="gf-cactus" />
    <text x="500" y="72" textAnchor="middle" className={active === 2 ? 'gf-label gf-on' : 'gf-label'}>semiárido</text>
    <text x="500" y="320" textAnchor="middle" className="gf-small">raso, sobre rocha cristalina</text>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      {[456, 486, 516, 546].map((x, k) => <motion.circle key={x} cx={x} r="3" className="gf-water" initial={false}
        animate={active === 2 ? { cy: [84, 120], opacity: [1, 0] } : { cy: 84, opacity: 0 }} transition={p(0.9, k * 0.1)} />)}
      <motion.path d="M430 108h140v6H430Z" className="gf-salt" initial={false} animate={{ scaleX: active === 2 ? 1 : 0 }} transition={p(0.9, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
      <text x="500" y="340" textAnchor="middle" className="gf-hand-sm">irrigação sem manejo: sal na superfície</text>
    </motion.g>
  </svg>;
}

function BrazilBase({ id }: { id: string }) {
  return <>
    <defs><clipPath id={id}><path d={BRAZIL} /></clipPath></defs>
    <path d={BRAZIL} className="gf-land" />
  </>;
}

export function ClimateMap({ active }: Scene) {
  const p = usePaced();
  const clip = 'gf-clip-clima';
  const zone = (d: string, cls: string, on: boolean) => <motion.path d={d} className={cls} clipPath={`url(#${clip})`} initial={false}
    animate={{ opacity: on ? 1 : 0.35 }} transition={p(0.5)} />;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Climas do Brasil: equatorial na Amazônia, tropical e semiárido, subtropical no Sul; ${['equatorial', 'tropical e semiárido', 'subtropical'][active]} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-sky" />
    <BrazilBase id={clip} />
    {zone(BRAZIL, 'gf-z-tropical', active === 1)}
    {zone(ZONE.equatorial, 'gf-z-equatorial', active === 0)}
    {zone(ZONE.semiarido, 'gf-z-semiarido', active === 1)}
    {zone(ZONE.subtropical, 'gf-z-subtropical', active === 2)}
    <path d={BRAZIL} className="gf-outline" />
    <path d="M12 76.2H389" className="gf-latline" /><text x="386" y="72" textAnchor="end" className="gf-tiny-dark">Equador</text>
    <path d="M12 256.7H389" className="gf-latline" /><text x="386" y="252" textAnchor="end" className="gf-tiny-dark">Trópico de Capricórnio</text>
    <text x="118" y="104" textAnchor="middle" className="gf-map-label">equatorial</text>
    <text x="206" y="196" textAnchor="middle" className="gf-map-label">tropical</text>
    <text x="298" y="142" textAnchor="middle" className="gf-map-label">semiárido</text>
    <text x="232" y="284" textAnchor="middle" className="gf-map-label">subtropical</text>

    <rect x="404" y="40" width="196" height="276" rx="12" className="gf-inset" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      {[0, 1, 2].map(k => <motion.path key={k} d={`M${40 + k * 40} ${70 + k * 12}q30 -14 60 0t60 0`} className="gf-airmass" initial={false}
        animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(1.1, k * 0.2)} />)}
      <text x="502" y="80" textAnchor="middle" className="gf-panel-title">massa Equatorial</text>
      <text x="502" y="104" textAnchor="middle" className="gf-small">influência constante</text>
      <text x="502" y="120" textAnchor="middle" className="gf-small">sobre a Amazônia</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="502" y="64" textAnchor="middle" className="gf-panel-title">chuva ao longo do ano</text>
      <text x="420" y="88" className="gf-small">tropical: estações definidas</text>
      {[30, 28, 24, 12, 5, 3, 3, 4, 10, 18, 24, 28].map((h, k) => <motion.rect key={k} x={420 + k * 14} y={150 - h} width="10" height={h} className="gf-rainbar"
        initial={false} animate={{ scaleY: active === 1 ? 1 : 0 }} transition={p(0.5, 0.2 + k * 0.04)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
      <text x="420" y="184" className="gf-small">semiárido: escassa e irregular</text>
      {[4, 10, 2, 0, 6, 1, 0, 0, 3, 0, 8, 2].map((h, k) => <motion.rect key={k} x={420 + k * 14} y={246 - h} width="10" height={h} className="gf-rainbar gf-rainbar-dry"
        initial={false} animate={{ scaleY: active === 1 ? 1 : 0 }} transition={p(0.5, 0.6 + k * 0.04)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
      <path d="M418 150h170M418 246h170" className="gf-baseline" />
      <text x="502" y="270" textAnchor="middle" className="gf-tiny-dark">barras ilustrativas, sem medida</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <text x="502" y="80" textAnchor="middle" className="gf-panel-title">invernos frios</text>
      <g transform="translate(502 150)">
        {[0, 60, 120].map(a => <path key={a} d="M0 -30V30M-6 -24l6 6 6-6M-6 24l6-6 6 6" className="gf-snow" transform={`rotate(${a})`} />)}
      </g>
      <text x="502" y="210" textAnchor="middle" className="gf-small">geadas ocasionais:</text>
      <text x="502" y="226" textAnchor="middle" className="gf-small">única região com inverno</text>
      <text x="502" y="242" textAnchor="middle" className="gf-small">regularmente frio</text>
    </motion.g>
    <text x="600" y="336" textAnchor="end" className="gf-foot">Limites aproximados: climas mudam em faixas.</text>
  </svg>;
}

export function DomainsMap({ active }: Scene) {
  const p = usePaced();
  const clip = 'gf-clip-dominios';
  const focus = ['amazonico', 'cerrado', 'caatinga'] as const;
  const region = (d: string, cls: string, idx: number) => <motion.path d={d} className={cls} clipPath={`url(#${clip})`} initial={false}
    animate={{ opacity: idx < 0 ? 0.5 : active === idx ? 1 : 0.4 }} transition={p(0.5)} />;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Domínios morfoclimáticos de Ab'Sáber: ${['Amazônico', 'Cerrado', 'Caatinga'][active]} em foco, entre seis domínios e faixas de transição`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-sky" />
    <BrazilBase id={clip} />
    {region(ZONE.amazonico, 'gf-d-amazonico', 0)}
    {region(ZONE.cerrado, 'gf-d-cerrado', 1)}
    {region(ZONE.caatinga, 'gf-d-caatinga', 2)}
    {region(ZONE.mares, 'gf-d-mares', -1)}
    {region(ZONE.araucarias, 'gf-d-araucarias', -1)}
    {region(ZONE.pradarias, 'gf-d-pradarias', -1)}
    <path d={BRAZIL} className="gf-outline" />
    <text x="118" y="100" textAnchor="middle" className="gf-map-label">Amazônico</text>
    <text x="214" y="192" textAnchor="middle" className="gf-map-label">Cerrado</text>
    <text x="300" y="138" textAnchor="middle" className="gf-map-label">Caatinga</text>
    <text x="300" y="228" textAnchor="middle" className="gf-map-label-dim">Mares de Morros</text>
    <text x="252" y="282" className="gf-map-label-dim">Araucárias</text>
    <text x="154" y="324" textAnchor="end" className="gf-map-label-dim">Pradarias</text>

    <rect x="404" y="40" width="196" height="276" rx="12" className="gf-inset" />
    <text x="502" y="62" textAnchor="middle" className="gf-panel-title">{['Amazônico', 'Cerrado', 'Caatinga'][active]}</text>
    <path d="M414 240H590" className="gf-ground" />
    <motion.g key={focus[active]} initial={{ opacity: p(1).duration === 0 ? 1 : 0, y: p(1).duration === 0 ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={p(0.6)}>
      {active === 0 && <g>
        <path d="M414 240v-12h176v12" className="gf-plateau" />
        {[430, 456, 482, 508, 534, 560, 582].map((x, k) => <g key={x}><path d={`M${x} 228v-${40 + (k % 3) * 14}`} className="gf-trunk" /><circle cx={x} cy={228 - 40 - (k % 3) * 14} r={16 + (k % 2) * 4} className="gf-canopy" /></g>)}
        <text x="502" y="266" textAnchor="middle" className="gf-small">floresta densa, baixos platôs</text>
        <text x="502" y="282" textAnchor="middle" className="gf-small">e planícies; solos pobres</text>
      </g>}
      {active === 1 && <g>
        <path d="M414 240v-44h120l20 44" className="gf-chapada" />
        {[436, 470, 506].map(x => <path key={x} d={`M${x} 196q-4-14 4-26m0 10q10-4 12-12`} className="gf-twisted" />)}
        {[450, 488, 520].map(x => <circle key={x} cx={x} cy="168" r="9" className="gf-canopy-dry" />)}
        <path d="M566 240q-6-14 4-22 2 10 8 6 4 10-4 16Z" className="gf-fire" />
        <text x="502" y="266" textAnchor="middle" className="gf-small">savana sobre chapadas;</text>
        <text x="502" y="282" textAnchor="middle" className="gf-small">seca longa, fogo periódico</text>
      </g>}
      {active === 2 && <g>
        <circle cx="570" cy="96" r="14" className="gf-sun" />
        {[440, 520].map(x => <path key={x} d={`M${x} 240v-44m0 16h-10v-14m10 22h10v-16`} className="gf-cactus" />)}
        {[476, 556].map(x => <path key={x} d={`M${x} 240l-8-26m8 26 6-30m-6 30 14-22`} className="gf-shrub" />)}
        <path d="M430 246l10 4 8-3M500 248l12 3 10-4" className="gf-crack" />
        <text x="502" y="266" textAnchor="middle" className="gf-small">semiárido; vegetação</text>
        <text x="502" y="282" textAnchor="middle" className="gf-small">adaptada à falta de água</text>
      </g>}
    </motion.g>
    <text x="600" y="336" textAnchor="end" className="gf-foot">Limites aproximados; entre domínios há faixas de transição.</text>
  </svg>;
}

export function RockCycle({ active }: Scene) {
  const p = usePaced();
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Rochas por origem: ígneas do magma, sedimentares de sedimentos compactados com fósseis, metamórficas por calor e pressão; ${['ígneas', 'sedimentares', 'metamórficas'][active]} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="gf-sky" />
    <text x="30" y="40" className="gf-kicker">CORTE ESQUEMÁTICO · O CICLO DAS ROCHAS</text>
    <path d="M8 150H60L120 76L180 150H340Q380 158 420 156H612V352H8Z" className="gf-crust" />
    <path d="M122 80q8 18 24 34" className="gf-lava-line" />
    <path d="M134 244Q128 160 120 82" className="gf-conduit" />

    <motion.ellipse cx="140" cy="276" rx="70" ry="34" className="gf-magma" initial={false}
      animate={{ opacity: active === 0 ? 1 : 0.6 }} transition={p(0.5)} />
    <motion.ellipse cx="140" cy="276" rx="70" ry="34" className="gf-granite" initial={false}
      animate={{ opacity: active === 0 ? [0, 0, 1] : 0 }} transition={p(2, 0.3)} />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, 1.2)}>
      {[[112, 270], [136, 262], [160, 282], [124, 290], [152, 266]].map(([x, y], k) => <path key={k} d={`M${x} ${y}l6-4 6 4-2 7h-8Z`} className="gf-crystal-big" />)}
      <text x="24" y="334" className="gf-small-light">plutônica: esfria devagar, cristais grandes (granito)</text>
      {[0, 1, 2, 3, 4, 5].map(k => <circle key={k} cx={140 + k * 4} cy={106 + (k % 2) * 4} r="1.2" className="gf-crystal-small" />)}
      <text x="196" y="96" className="gf-hand-sm">vulcânica: esfria rápido,</text>
      <text x="196" y="112" className="gf-hand-sm">cristais pequenos (basalto)</text>
    </motion.g>

    <path d="M180 150q60 6 110 2t130 4" className="gf-river-long" />
    <path d="M420 156H612V210H420Z" className="gf-basin" />
    {[0, 1, 2].map(k => <motion.path key={k} d={`M420 ${204 - k * 14}H612V${210 - k * 14}H420Z`} className={`gf-layer gf-layer-${k}`} initial={false}
      animate={{ scaleY: active === 1 ? 1 : 0.3, opacity: active === 1 ? 1 : 0.5 }} transition={p(0.6, active === 1 ? 0.6 + k * 0.3 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
    {[0, 1, 2, 3].map(k => <motion.circle key={k} r="2.6" className="gf-grain" initial={false}
      animate={active === 1 ? { cx: [170, 300, 440 + k * 30], cy: [140, 150, 184], opacity: [1, 1, 0] } : { cx: 170, cy: 140, opacity: 0 }}
      transition={p(1.6, k * 0.25)} />)}
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0, scale: active === 1 ? 1 : 0.6 }} transition={p(0.5, 1.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <path d="M520 190q10-10 20 0l-10 6Z" className="gf-fossil" /><path d="M524 188l6 4m0-6v6m6-4-6 4" className="gf-fossil-rib" />
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 1.2)}>
      <text x="516" y="140" textAnchor="middle" className="gf-hand-sm">camadas compactadas;</text>
      <text x="516" y="124" textAnchor="middle" className="gf-hand-sm">só elas guardam fósseis</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 0 : 0.9 }} transition={p(0.8, 0.4)}>
      {[0, 1, 2, 3].map(k => <path key={k} d={`M400 ${250 + k * 14}H580`} className="gf-band" />)}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.8, 0.6)}>
      {[0, 1, 2, 3].map(k => <path key={k} d={`M400 ${250 + k * 14}q22-14 44 0t44 0t44 0t48 0`} className="gf-band gf-band-folded" />)}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : -10 }} transition={p(0.6, 0.2)}>
      <path d="M362 270h26m-8-6 8 6-8 6" className="gf-press" /><path d="M612 270h-20m8-6-8 6 8 6" className="gf-press" />
      <text x="600" y="334" textAnchor="end" className="gf-small-light">calor e pressão, sem fundir (mármore, gnaisse)</text>
    </motion.g>
    <text x="490" y="236" textAnchor="middle" className="gf-small-light">rochas em profundidade</text>
  </svg>;
}
