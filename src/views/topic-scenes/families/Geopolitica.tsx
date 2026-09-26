import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './Geopolitica.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}
type Paced = ReturnType<typeof usePaced>;

// Lote 11 da régua de História e Geografia: geopolítica regional. Os cinco
// capítulos abriam com a mesma ContextScene genérica (três círculos e duas
// setas), que não mostrava território, fluxo nem tempo. Aqui cada cena põe o
// mecanismo no mapa ou na rede que o capítulo descreve. Os contornos são
// traçados a partir de coordenadas reais, simplificados — por isso toda
// prancha com mapa diz "esquemático, sem escala". Nomes, datas e exemplos vêm
// do resumo; nenhuma posição aparece sem quem a sustenta, e nenhuma religião
// ou regime ganha ícone ou cor de vilão.

// Mundo (religiões): x = 44 + 1,8·(lon + 130); y = 50 + 1,8·(74 − lat).
const W_AMERICAS = 'M44 55.4L80 59.9L107 60.8L121.4 62.6L108.8 77L112.4 80.6L130.4 87.8L137.6 77.9L137.6 71.6L148.4 72.5L161 75.2L168.2 82.4L177.2 89.6L170 96.8L162.8 100.4L159.2 103.1L152 104.9L152 108.1L144.8 110.3L141.2 116.6L142.1 119.8L132.2 126.5L133.6 137.3L131.3 137.8L129.1 132.8L126.8 129.2L116.9 128.8L108.8 130.1L102.5 136.4L102.9 145.4L107.9 150.4L114.2 149L115.3 145.4L121.4 144.5L119.1 149.9L119.6 154.6L128.1 156.2L127.3 163.6L131.1 167L134.9 166.1L139.8 167.7L142.1 164.3L148.4 161.6L149.1 163.9L155.4 164.3L162.8 164.1L169.1 167.9L175 172.6L180.8 172.8L186 176.2L188 183.2L190.7 185.4L198.3 187.7L208.7 189.9L214.6 193.1L215 199.4L208 206.6L206.5 218.3L204.2 222.8L197.9 225L191.1 229.1L190.7 230.9L187.1 238.1L181.9 243.9L179.2 246L172.9 245.5L175.9 248.5L174.5 251.6L165.9 253.4L161 259.7L156.5 266L159.6 269.2L153.8 273.2L154.7 277.5L156.9 283.1L152 281.3L144.8 276.8L142.1 269.6L145.3 260.6L145.7 249.8L149.1 242.6L151.1 226.4L151.5 216.5L141.2 208.4L135.8 197.6L131.8 192.2L134 185L138.5 179.6L138.7 176L137.6 167.9L134 170.1L128.6 168.4L123.7 163.4L120.5 159.8L112.4 157.1L107.9 154.4L98 152.6L88.1 146.3L80 140L75.5 131L71.4 126.5L67.4 124.7L60.9 121.1L54.8 111.2L53.9 96.8L44 85.1Z';
const W_GREENLAND = 'M179 53.6L238.4 53.6L240.2 57.2L220.4 60.8L206 66.2L200.6 75.2L191.6 73.4L182.6 64.4L179 57.2Z';
const W_EURASIA = 'M342.8 118L332.9 117L327.1 116.6L325.2 110.8L321.2 110.3L318.5 110.7L320.3 114.8L317.6 117.5L316 114.3L313.1 110.3L312.9 108L305.9 104L302.5 100.9L300.1 101.7L300.5 104L303.2 106.9L306.8 108.7L311.3 110.8L307.7 113.2L306.1 114.8L306.3 111.2L300.5 108.5L296.9 106L293.8 103.3L291.5 104.4L287 105.3L283.6 106.7L283.8 107.8L279.6 109.4L277.5 112.1L276.7 115.5L274 117.1L270.1 117.1L267.9 118.4L261.8 116.6L262.2 107.6L261.4 105.4L274.8 105.1L275.8 100.4L269.9 96.1L275.1 95.5L280.9 91.6L285.2 90.5L286.6 87.8L293.5 86.2L292.6 81L296.9 79.3L296.9 84.2L297.8 86L303.6 86L311.5 85.1L315.8 83.7L315.8 80.6L321.4 78.3L320.3 76.6L328.4 76.1L332.4 75.4L322.8 74.8L318.1 74.5L316.7 68.9L323 66.2L317.6 64.8L309.5 70.7L312 75.2L310.9 76.5L307.7 80.6L303.9 83.1L301.2 83.1L299.4 79.3L297.1 77L292.4 78.6L288.1 77.2L287 73.4L287.5 70.7L292.4 68.9L302.3 60.8L306.8 58.6L312.2 57.2L321.2 55.4L328.4 55.4L333.8 57.2L337.4 58.5L351.8 62.6L359 60.8L386 59L404 52.7L458 50.9L512 54.5L557 57.2L557 76.1L535.4 77L524.6 86L531.8 89.6L530 96.8L521 104.9L511.1 106.7L510.7 119.3L505.7 121.1L504.8 115.7L502.1 111.2L496.7 113L497.6 116.6L492.2 116.2L495.8 125.6L497.6 129.2L493.1 138.2L483.2 143.1L475.5 144.5L472.4 144.5L469.7 147.2L474.2 162.5L467 167.7L463.4 164.3L458 159.1L458.9 170.6L464.3 180.9L459.8 177.8L455.3 168.8L454 153.5L448.1 154.4L443.6 145.4L438.2 144L433.7 147.2L422.5 155.3L422 165.2L417.5 168.8L415.3 165.2L409.4 152.6L408.7 144.5L404 142.7L398.6 138.6L388.9 137.8L380.6 136.8L369.8 131.4L364.4 129.2L368 136.4L371.6 140L378.8 139.1L385.6 142.7L382 149.2L372 155.1L359 160.2L355.9 160.3L354.7 155.3L348.2 144.5L341 132.8L340.1 130.1L339.6 126.9L341 123.8L342.8 119.1Z';
const W_AFRICA = 'M267.4 118.8L296 116.1L296.9 122L312.2 128.7L323 126.1L335.6 126.9L336.5 129.4L341 140L345 149L348.2 155.3L355.9 160.7L370.2 162L366.2 172.4L360.8 179.6L354.5 185L350 190.4L348.7 195.8L350.9 203L350.9 210.2L341 217.4L341.9 226.4L337 230L333.8 236.3L327.5 243.9L314 245.8L311.1 244.4L308.6 235.4L305 230.9L304.1 223.7L299.2 213.8L302.3 203L300.1 194L295.1 185L295.1 176L288.8 175.5L283.4 171.7L274.4 174.6L264.5 175.3L257.3 170.8L254.1 167L250.1 162.5L246.7 156.7L249 149L247.4 145.4L254.6 133.7L260.4 130.1L261.4 124.7L265.8 122Z';
const W_MADAG = 'M366.7 204.8L368.9 211.1L363 228.2L357.2 228.2L355.9 222.8L357.9 212.4L362.6 208.4Z';
const W_BRITAIN = 'M267.7 93.2L280.5 91L281.1 88.3L278 86.9L275.1 83.1L274.4 79.5L272.6 77.7L269 77.7L266.8 80.6L267.9 83.5L269.2 84.6L272.6 86L272.4 87.3L269.7 87.8L270.4 89.2L268.6 90.1L272.6 91Z';
const W_JAPAN = 'M512 126.5L515.6 122L521 122L530 120.2L532.7 114.8L533.6 110.3L531.8 104.9L539.9 105.3L533.2 101.5L530 109.4L529.1 114.8L523.7 116.6L517.4 119.3L513.6 122Z';
const W_SUMATRA = 'M449.5 173.1L454.9 176L465.2 185L468.8 189L468.4 193.6L461.6 190.4L458.5 185L453.5 179.1Z';
const W_JAVA = 'M467.5 195.4L469.7 194L477.8 194.7L484.3 197.2L483.9 198.9L476 197.8L469.7 196.5Z';
const W_BORNEO = 'M475.5 179.6L483.2 174.9L488.6 170.6L492.2 174.2L490.4 181.4L487.7 187.7L486.8 190.4L476.5 188.6L474.2 184.1Z';
const W_GUINEA = 'M513.8 185L521 189.1L531.8 187.9L543.5 194L548 202.1L542.6 201.2L531.8 199.4L526.4 198.3L525.5 192.7L516.5 190.4Z';
const W_AUSTR = 'M483.2 222.8L482.3 230L485 243.5L490.4 246.2L501.2 244.2L510.2 240.1L515.6 240.8L522.1 245.8L526.4 247.3L530 251.6L539 252.3L548 250.7L553.4 239L554.3 228.2L549.8 224.6L540.8 217.4L539.7 210.2L534.5 202.5L532.9 206.1L532.7 213.8L530 215.1L524.2 211.1L524.4 205.2L516.7 203.9L512 206.6L510.2 210.2L504.8 208.4L497.6 214.7L495.8 218.3Z';
const W_CASPIAN = 'M362.6 102.2L368 99L373.4 98.6L373.4 107.6L375.2 111.2L375 116.2L369.8 117L366.4 113.9L367.1 110.3L363.5 105.8Z';
const W_BLACK = 'M329.8 109L328.6 104.9L331.5 101.8L333.3 99.5L336.5 100.2L338.3 102.2L338.8 103.3L341.9 102L343.9 101.7L345.5 102.7L349.6 105.1L352.9 108.3L342.8 108.1L334.2 109.2Z';
// Europa: x = 24 + 4,27·(lon + 11); y = 56 + 6,94·(71 − lat) (cos 52° no eixo x).
const E_MAIN = 'M224.7 297.5L201.2 293.3L187.5 292L182.8 269.8L173.4 267.7L167 269.1L171.3 285L164.9 295.4L161.1 282.9L154.2 267.7L153.8 258.6L137.2 243.4L129 231.6L123.5 234.4L124.3 243.4L130.8 254.5L139.3 261.4L150 269.8L141.4 278.8L137.6 285L138 271.1L124.3 260.7L115.8 251L108.5 240.6L103 244.8L92.3 248.2L84.2 253.8L84.6 258L74.8 264.2L69.7 274.6L68 287.8L61.6 294L52.2 294L47.1 298.9L32.5 292L33.4 257.3L31.7 248.9L63.3 247.5L65.8 229.5L51.8 212.8L64.1 210.8L77.8 195.5L88 191.3L91.5 180.9L107.7 174.7L105.6 154.5L115.8 148.3L115.8 167L117.9 174L131.6 174L150.4 170.5L160.6 165L160.6 153.2L173.9 144.1L171.3 137.9L190.5 135.8L199.9 133L177.3 131L166.2 129.6L162.8 108.1L177.7 97.6L164.9 92.1L145.7 115L151.7 132.3L149.1 137.2L141.4 153.2L132.5 162.9L126.1 162.9L121.8 148.3L116.2 139.3L105.1 145.5L94.9 140L92.3 125.4L93.6 115L105.1 108.1L128.6 76.8L139.3 68.5L152.1 62.9L173.4 56L190.5 56L203.3 62.9L211.9 67.8L246 83.8L263.1 76.8L263.1 278.1L241.8 288.5Z';
const E_BRITAIN = 'M46.6 201.7L76.9 193.4L78.2 183L71 177.4L64.1 162.9L62.4 149L58.2 142.1L49.6 142.1L44.5 153.2L47.1 164.3L50 168.4L58.2 174L57.7 178.8L51.3 180.9L53 186.5L48.8 189.9L58.2 193.4Z';
const E_IRELAND = 'M45.3 186.5L45.3 174L39.8 165L34.7 170.5L28.3 177.4L29.6 190.6L36.8 189.9Z';
const E_SICILY = 'M123.9 284.3L137.6 283.6L135.4 294Z';
const E_BLACK = 'M193.9 262.8L191 246.9L197.8 235.1L202.1 226L209.7 228.8L214 236.4L215.3 240.6L222.6 235.7L227.3 234.4L231.1 238.5L240.9 247.5L248.6 260L224.7 259.3L204.2 263.5Z';
const E_UKRAINE = 'M165.3 212.8L171.7 191.3L201.2 192.7L207.6 186.5L217.4 185.8L222.6 199L234.1 202.4L241.8 204.5L240.5 217L234.1 221.9L221.3 226L214 229.5L202.1 226L197.8 233.7L191.4 233L192.7 214.2L184.6 214.2L168.8 216.3Z';
const E_CRIMEA = 'M209.7 233.7L214.4 228.8L220.8 232.3L227.3 233.7L222.6 235.7L215.3 240.6Z';
const E_FINLAND = 'M162.8 126.8L168.8 133L189.7 128.9L197.8 124L205.5 112.2L196.9 103.2L199.1 79.6L193.5 70.6L192.7 62.9L184.1 63.6L177.7 72.7L160.6 69.2L173 91.4L179 97.6L163.2 110.1Z';
const E_SWEDEN = 'M117.9 140L126.1 164.3L132 162.9L141.4 155.9L150.8 136.5L144.4 125.4L145.7 115L164.9 93.5L173 91.4L160.6 69.2L148.7 73.3L137.6 89.3L123.5 104.6L123.5 121.9L121.4 133.7Z';
const E_YUGO = 'M129.5 233L141.4 226L152.1 228.8L157.7 228.8L167.9 240.6L169.2 253.8L166.6 262.1L158.9 264.2L153.8 258L150 254.5L137.6 244.1L129 235.7Z';
const E_CZECHO = 'M122.6 199.7L134.2 194.8L151.2 202.4L167 208L165.3 212.8L151.2 217L143.6 215.6L135 208.7L129 211.5Z';
// América Latina: x = 30 + 2,7·(lon + 118); y = 52 + 2,8·(33 − lat).
const L_MAIN = 'M85.3 71.6L85.9 85.6L93.5 93.4L102.9 91.2L104.5 85.6L113.7 84.2L110.2 92.6L111 99.9L123.7 102.4L122.6 113.9L128.3 119.2L133.9 117.8L141.2 120.3L144.8 115L154.2 110.8L155.3 114.4L164.7 115L175.8 114.7L185.2 120.6L194.2 127.9L202.8 128.2L210.6 133.5L213.6 144.4L217.7 147.8L229 151.4L244.7 154.8L253.6 159.8L254.1 169.6L243.6 180.8L241.4 199L237.9 206L228.5 209.4L218.2 215.8L217.7 218.6L212.2 229.8L204.4 238.8L200.4 242.1L190.9 241.3L195.5 246L193.4 250.8L180.4 253.6L173.1 263.4L166.4 273.2L170.9 278.2L162.3 284.4L163.7 291.1L166.9 299.8L159.6 297L148.8 290L144.8 278.8L149.6 264.8L150.2 248L155.3 236.8L158.2 211.6L158.8 196.2L143.4 183.6L135.3 166.8L129.4 158.4L132.6 147.2L139.4 138.8L139.6 133.2L138 120.6L132.6 124L124.5 121.4L117.2 113.6L112.4 108L100.2 103.8L93.5 99.6L78.6 96.8L63.8 87L51.6 77.2L44.9 63.2L38.6 56.2L32.7 53.4L38.6 53.4L48.9 56.8L61 55.4L70.5 63.2L80 67.4Z';
// África: x = 30 + 3,4·(lon + 18); y = 50 + 3,4·(38 − lat).
const A_MAIN = 'M71.1 57.5L125.2 52.4L126.9 63.6L155.8 76.2L176.2 71.4L200 72.8L201.7 77.5L210.2 97.6L217.7 114.6L223.8 126.5L238.4 136.7L265.3 139.1L257.8 158.8L247.6 172.4L235.7 182.6L227.2 192.8L224.8 203L228.9 216.6L228.9 230.2L210.2 243.8L211.9 260.8L202.7 267.6L196.6 279.5L184.7 293.8L159.2 297.5L153.8 294.8L149 277.8L142.2 269.3L140.5 255.7L131.3 237L137.1 216.6L133 199.6L123.5 182.6L123.5 165.6L111.6 164.6L101.4 157.4L84.4 162.9L65.7 164.2L52.1 155.7L46 148.6L38.5 140.1L32 129.2L36.5 114.6L33.4 107.8L47 85.7L57.9 78.9L59.9 68.7L68.1 63.6Z';
const A_MADAG = 'M258.8 220L262.9 231.9L251.7 264.2L240.8 264.2L238.4 254L242.2 234.3L251 226.8Z';

function Panel({ show, p, title, lines, hand, x = 346, w = 246, handY = 248 }: { show: boolean; p: Paced; title: string; lines: [string, string?][]; hand?: string; x?: number; w?: number; handY?: number }) {
  return <motion.g initial={false} animate={{ opacity: show ? 1 : 0 }} transition={p(0.4, show ? 0.15 : 0)} pointerEvents="none">
    <text x={x + 18} y="84" className="bi-panel-title">{title}</text>
    {lines.map(([line, tone], k) => <motion.g key={line} initial={false} animate={{ opacity: show ? 1 : 0, x: show ? 0 : -8 }} transition={p(0.4, show ? 0.3 + k * 0.14 : 0)}>
      <circle cx={x + 22} cy={105 + k * 22} r="3.5" className={tone === 'warn' ? 'bi-dot bi-dot-warn' : 'bi-dot'} />
      <text x={x + 32} y={109 + k * 22} className={tone === 'strong' ? 'bi-small bi-strong' : 'bi-small'}>{line}</text>
    </motion.g>)}
    {hand && <text x={x + w / 2} y={handY} textAnchor="middle" className="bi-hand-sm">{hand}</text>}
  </motion.g>;
}

// Terrorismo: a mesma rede de dez pontos muda de forma entre os recortes 2 e
// 3 — da árvore com comando no topo, que a inteligência sabia vigiar, para
// células soltas ligadas só pela internet. O recorte 1 mostra o carimbo
// duplo sobre o mesmo grupo; o 4, os custos que ficam depois do atentado.
const NODES = [
  { tree: [180, 80], cells: [180, 80] },
  { tree: [108, 134], cells: [56, 104] }, { tree: [180, 134], cells: [82, 120] }, { tree: [252, 134], cells: [262, 88] },
  { tree: [74, 196], cells: [290, 104] }, { tree: [118, 196], cells: [136, 190] }, { tree: [162, 196], cells: [306, 182] },
  { tree: [198, 196], cells: [74, 214] }, { tree: [242, 196], cells: [220, 142] }, { tree: [286, 196], cells: [246, 158] },
] as const;
const EDGES = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [2, 7], [3, 8], [3, 9]] as const;
const T_TICKS: [number, string, string][] = [[90, '2001', '11 de setembro'], [200, '2003', 'Iraque'], [350, 'anos 2010', 'Estado Islâmico'], [520, 'hoje', 'células e lobos solitários']];

export function TerrorNetwork({ active }: Scene) {
  const p = usePaced();
  const net = active === 1 || active === 2;
  const cells = active === 2;
  const band = [[0, 0], [60, 230], [290, 560], [60, 560]][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Terrorismo internacional: rótulo em disputa, rede hierárquica de 2001 que vira células e atores isolados, e os custos de vigilância, liberdades e polarização; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">TERRORISMO INTERNACIONAL · DE 2001 A HOJE</text>
    <ArrowHead id="gp-t-head" />

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <Person x={64} y={128} s={1.25} coat="bi-coat-army" />
      <Person x={296} y={128} s={1.25} coat="bi-coat-royal" />
      <text x="64" y="190" textAnchor="middle" className="bi-tiny">governo A</text>
      <text x="296" y="190" textAnchor="middle" className="bi-tiny">governo B</text>
      <rect x="108" y="72" width="144" height="130" rx="8" className="gp-file" />
      <path d="M126 92h108M126 104h84M126 116h96" className="bi-scroll-line" />
      <text x="180" y="222" textAnchor="middle" className="bi-small bi-strong">o mesmo grupo armado</text>
      <text x="180" y="238" textAnchor="middle" className="bi-tiny">mesmos atos contra civis</text>
      <motion.g initial={false} animate={active === 0 ? { x: [-70, 0], opacity: [0, 1] } : { x: 0, opacity: 0 }} transition={p(0.7, 0.4)}>
        <g transform="rotate(-7 180 142)">
          <rect x="134" y="130" width="92" height="24" rx="4" className="gp-stamp-a" />
          <text x="180" y="146" textAnchor="middle" className="gp-stamp-text-a">terrorista</text>
        </g>
      </motion.g>
      <motion.g initial={false} animate={active === 0 ? { x: [70, 0], opacity: [0, 1] } : { x: 0, opacity: 0 }} transition={p(0.7, 1)}>
        <g transform="rotate(5 180 178)">
          <rect x="116" y="166" width="128" height="24" rx="4" className="gp-stamp-b" />
          <text x="180" y="182" textAnchor="middle" className="gp-stamp-text-b">resistência legítima</text>
        </g>
      </motion.g>
      <path d="M84 150Q96 150 104 146" className="bi-arrow-static" />
      <path d="M276 150Q264 150 256 158" className="bi-arrow-static" />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: net ? 1 : 0 }} transition={p(0.4)}>
      {EDGES.map(([a, b], k) => <motion.path key={`${a}-${b}`} d={`M${NODES[a].tree[0]} ${NODES[a].tree[1]}L${NODES[b].tree[0]} ${NODES[b].tree[1]}`} className="gp-edge"
        initial={false} animate={{ pathLength: active === 1 ? 1 : 0, opacity: active === 1 ? 1 : 0 }} transition={p(0.6, active === 1 ? 0.2 + k * 0.06 : 0)} />)}
      {[[1, 2], [3, 4], [8, 9]].map(([a, b], k) => <motion.ellipse key={`cell-${a}`} className="gp-cell"
        cx={(NODES[a].cells[0] + NODES[b].cells[0]) / 2} cy={(NODES[a].cells[1] + NODES[b].cells[1]) / 2} rx="30" ry="22"
        initial={false} animate={{ opacity: cells ? 1 : 0, scale: cells ? 1 : 0.6 }} transition={p(0.5, cells ? 0.9 + k * 0.1 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <motion.g initial={false} animate={{ opacity: cells ? 1 : 0 }} transition={p(0.5, cells ? 1.1 : 0)}>
        <rect x="160" y="224" width="44" height="28" rx="3" className="gp-screen" />
        <path d="M152 256h60" className="gp-laptop" />
        <path d="M170 234h24M170 242h16" className="gp-screen-line" />
        {[5, 6, 7, 3, 8].map(k => <path key={`net-${k}`} d={`M182 224L${NODES[k].cells[0]} ${NODES[k].cells[1]}`} className="gp-wire" />)}
        <text x="220" y="246" className="bi-tiny">internet</text>
      </motion.g>
      {NODES.map((n, k) => <motion.circle key={`node-${k}`} r={k === 0 ? 12 : 8} className={k === 0 ? 'gp-node gp-node-root' : 'gp-node'} initial={false}
        animate={{ cx: cells ? n.cells[0] : n.tree[0], cy: cells ? n.cells[1] : n.tree[1], opacity: cells && k === 0 ? 0 : 1 }}
        transition={p(1.1, cells ? 0.1 + k * 0.04 : 0)} />)}
      <motion.text x="140" y="70" textAnchor="middle" className="bi-tiny" initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.3)}>comando central</motion.text>
      <motion.g initial={false} animate={cells ? { x: [0, 26, -18, 0], y: [0, 6, 10, 0] } : { x: 0, y: 0 }} transition={p(1.8, 1.2)}>
        <circle cx="232" cy="96" r="15" className="gp-lens" />
        <path d="M243 107l12 12" className="gp-lens-handle" />
      </motion.g>
      <motion.text x="180" y="266" textAnchor="middle" className="bi-hand-sm" initial={false}
        animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 0.8)}>inteligência vigia a estrutura</motion.text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4)}>
      {[
        { x: 70, label: 'vigilância', sub: 'custo elevado' },
        { x: 180, label: 'liberdades civis', sub: 'restringidas' },
        { x: 290, label: 'polarização', sub: 'e discriminação' },
      ].map(({ x, label, sub }, k) => <motion.g key={label} initial={false} animate={{ opacity: active === 3 ? 1 : 0, y: active === 3 ? 0 : 10 }} transition={p(0.5, active === 3 ? 0.2 + k * 0.25 : 0)}>
        <circle cx={x} cy="132" r="44" className="gp-medal" />
        <text x={x} y="198" textAnchor="middle" className="bi-small bi-strong">{label}</text>
        <text x={x} y="213" textAnchor="middle" className="bi-tiny">{sub}</text>
      </motion.g>)}
      <g transform="translate(70 132)">
        <path d="M-22 -14h30l6 6v10h-36Z" className="gp-cam" />
        <path d="M14 -2l10 -6v18l-10 -6ZM-12 2v16M-20 18h16" className="gp-cam-line" />
        <motion.path d="M24 1L38 -9L38 11Z" className="gp-beam" initial={false} animate={{ rotate: active === 3 ? [0, -16, 12, 0] : 0 }} transition={p(2.2, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
      </g>
      <g transform="translate(180 132)">
        <path d="M0 -26v46M-14 22h28" className="gp-scale" />
        <motion.g initial={false} animate={{ rotate: active === 3 ? [0, -12] : 0 }} transition={p(1, 0.8)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <path d="M-30 -22h60" className="gp-scale" />
          <path d="M-30 -22l-8 16h16ZM30 -22l-8 16h16Z" className="gp-pan" />
          <path d="M-38 -6h16" className="gp-weight-line" />
        </motion.g>
      </g>
      <g transform="translate(290 132)">
        <motion.g initial={false} animate={{ x: active === 3 ? -9 : 0 }} transition={p(0.9, 1)}>
          <Person x={-12} y={-12} s={0.62} coat="bi-coat-army" /><Person x={-4} y={-4} s={0.62} coat="bi-coat-army" />
        </motion.g>
        <motion.g initial={false} animate={{ x: active === 3 ? 9 : 0 }} transition={p(0.9, 1)}>
          <Person x={6} y={-12} s={0.62} coat="bi-coat-plain" /><Person x={14} y={-4} s={0.62} coat="bi-coat-plain" />
        </motion.g>
        <motion.path d="M0 -24v44" className="gp-rift" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.6, 1.4)} />
      </g>
    </motion.g>

    <rect x="346" y="56" width="246" height="210" rx="14" className="bi-panel" />
    <Panel show={active === 0} p={p} title="DEFINIÇÃO EM DISPUTA" hand="descreve e também deslegitima"
      lines={[['sem definição universal'], ['no direito internacional'], ['o rótulo depende', 'strong'], ['de quem classifica', 'strong'], ['pegadinha: não é de uma só', 'warn'], ['religião ou ideologia', 'warn']]} />
    <Panel show={active === 1} p={p} title="2001 · REDE HIERÁRQUICA" hand="ataque → guerra ao terror"
      lines={[['11 de setembro, nos EUA'], ['coordenado pela Al-Qaeda', 'strong'], ['resposta militar global:'], ['Afeganistão (2001)'], ['Iraque (2003)']]} />
    <Panel show={active === 2} p={p} title="ANOS 2010 · CÉLULAS" hand="difícil de detectar antes"
      lines={[['Estado Islâmico no vácuo'], ['da Síria e do Iraque'], ['derrotado, mas células', 'strong'], ['e afiliados seguem ativos', 'strong'], ['atores isolados, internet', 'warn']]} />
    <Panel show={active === 3} p={p} title="CUSTOS ALÉM DAS VÍTIMAS" hand="segurança × direitos"
      lines={[['segurança e vigilância caras'], ['liberdades civis restringidas'], ['discurso de ódio contra', 'warn'], ['grupos associados, ainda', 'warn'], ['que injustamente', 'warn']]} />

    <path d="M60 292H560" className="bi-axis" />
    <motion.rect y="287" height="10" rx="5" className="gp-band" initial={false}
      animate={{ x: band[0], width: Math.max(band[1] - band[0], 0), opacity: active === 0 ? 0 : 1 }} transition={p(0.8, 0.2)} />
    {T_TICKS.map(([x, year, what], k) => {
      const on = (active === 1 && k < 2) || (active === 2 && k >= 2) || active === 3;
      return <g key={year}>
        <circle cx={x} cy="292" r="5" className={on ? 'gp-tick gp-tick-on' : 'gp-tick'} />
        <text x={x} y="314" textAnchor="middle" className={on ? 'bi-small bi-strong' : 'bi-tiny'}>{year}</text>
        <text x={x} y="328" textAnchor="middle" className="bi-tiny">{what}</text>
      </g>;
    })}
    <text x="30" y="344" className="bi-foot">Esquema: a rede e as posições não medem nada.</text>
  </svg>;
}

function WorldBase() {
  return <g>
    {[W_AMERICAS, W_GREENLAND, W_EURASIA, W_AFRICA, W_MADAG, W_BRITAIN, W_JAPAN, W_SUMATRA, W_JAVA, W_BORNEO, W_GUINEA, W_AUSTR].map(d => <path key={d.slice(0, 24)} d={d} className="bi-land" />)}
    <path d={W_CASPIAN} className="gp-inland" /><path d={W_BLACK} className="gp-inland" />
  </g>;
}

// Geografia das religiões: o mapa responde à pegadinha "origem ≠
// distribuição atual" com setas que partem do berço e halos onde a fé é
// maioria hoje. Jerusalém é um zoom do mesmo mapa; a laicidade compara lei e
// prática lado a lado. Lugares sagrados em arquitetura, nunca em símbolo.
const J = [341.4, 126] as const;
const CAPTION = [
  ['origem no Oriente Médio ≠ maioria hoje nas Américas', 'Império Romano leva à Europa; a colonização, às Américas e à África'],
  ['origem na Arábia ≠ maioria hoje na Ásia', 'o hinduísmo, pouco proselitista, concentra-se na Índia, onde nasceu'],
  ['um só lugar, três lugares sagrados', 'o conflito israelo-palestino é também nacional e territorial'],
  ['laicidade formal ≠ laicidade substantiva', 'sem religião oficial não quer dizer religião longe da política'],
];

export function ReligionsMap({ active }: Scene) {
  const p = usePaced();
  const zoom = active >= 2;
  const christ = active === 0;
  const islam = active === 1;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geografia das religiões: difusão do cristianismo e do islamismo no mapa, Jerusalém sagrada para três religiões e laicidade no Irã, na França e no Brasil; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">GEOGRAFIA DAS RELIGIÕES · ORIGEM ≠ HOJE</text>
    <ArrowHead id="gp-r-head" />
    <defs><clipPath id="gp-r-clip"><rect x="10" y="10" width="600" height="340" rx="17" /></clipPath></defs>
    <g clipPath="url(#gp-r-clip)"><motion.g initial={false} animate={{ scale: zoom ? 2.6 : 1, opacity: zoom ? 0.16 : 1 }} transition={p(1.1)} style={{ transformBox: 'view-box', transformOrigin: `${J[0]}px ${J[1]}px` }}>
      <WorldBase />
      <motion.ellipse cx="160" cy="176" rx="46" ry="52" className="gp-halo" initial={false} animate={{ opacity: christ ? 1 : 0, scale: christ ? [0.4, 1] : 0.4 }} transition={p(0.9, christ ? 1.6 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <motion.ellipse cx="478" cy="190" rx="34" ry="18" className="gp-halo" initial={false} animate={{ opacity: islam ? 1 : 0, scale: islam ? [0.4, 1] : 0.4 }} transition={p(0.9, islam ? 1.4 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <Arrow d="M338 122Q322 98 306 104" on={christ} p={p} head="gp-r-head" delay={0.2} />
      <Arrow d="M294 102Q196 70 108 132" on={christ} p={p} head="gp-r-head" delay={0.8} />
      <Arrow d="M298 114Q252 150 196 192" on={christ} p={p} head="gp-r-head" delay={1} />
      <Arrow d="M304 114Q330 150 316 184" on={christ} p={p} head="gp-r-head" delay={1.2} />
      <Arrow d="M344 142Q318 150 294 134" on={islam} p={p} head="gp-r-head" delay={0.2} />
      <Arrow d="M354 138Q370 110 390 108" on={islam} p={p} head="gp-r-head" delay={0.4} />
      <Arrow d="M356 152Q412 212 470 190" on={islam} p={p} head="gp-r-head" delay={0.6} />
      <motion.circle cx="418" cy="146" r="17" className="gp-ring" initial={false} animate={{ opacity: islam ? 1 : 0 }} transition={p(0.5, islam ? 1 : 0)} />
      <motion.g initial={false} animate={{ opacity: christ ? 1 : 0 }} transition={p(0.4, christ ? 0.3 : 0)}>
        <circle cx={J[0]} cy={J[1]} r="5" className="gp-origin" />
        <text x="352" y="128" className="bi-small bi-strong">Oriente Médio · origem</text>
        <text x="306" y="86" textAnchor="middle" className="bi-tiny">Império Romano</text>
        <text x="214" y="130" textAnchor="middle" className="bi-tiny">colonização</text>
        <text x="160" y="186" textAnchor="middle" className="bi-small bi-strong">Américas</text>
        <text x="316" y="206" textAnchor="middle" className="bi-tiny">África</text>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: islam ? 1 : 0 }} transition={p(0.4, islam ? 0.3 : 0)}>
        <circle cx="349.6" cy="144.7" r="5" className="gp-origin" />
        <text x="342" y="170" textAnchor="end" className="bi-small bi-strong">Arábia · origem</text>
        <text x="288" y="122" textAnchor="end" className="bi-tiny">Norte da África</text>
        <text x="398" y="100" className="bi-tiny">Ásia Central</text>
        <text x="440" y="140" className="bi-tiny">hinduísmo</text>
        <text x="440" y="152" className="bi-tiny">fica na Índia</text>
        <text x="482" y="222" textAnchor="middle" className="bi-small bi-strong">Indonésia</text>
        <text x="482" y="236" textAnchor="middle" className="bi-tiny">mais muçulmanos</text>
      </motion.g>
    </motion.g></g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, scale: active === 2 ? 1 : 0.85 }} transition={p(0.6, active === 2 ? 0.7 : 0)} style={{ transformBox: 'view-box', transformOrigin: `${J[0]}px ${J[1]}px` }}>
      <rect x="110" y="56" width="400" height="228" rx="14" className="gp-card" />
      <text x="130" y="82" className="bi-panel-title">JERUSALÉM · SAGRADA PARA TRÊS RELIGIÕES</text>
      {[
        { x: 190, who: 'judeus', a: 'Muro das', b: 'Lamentações', icon: <path d="M-30 -20h60v40h-60ZM-30 -7h60M-30 7h60M-14 -20v13M10 -20v13M-2 -7v14M20 -7v14M-20 7v13M6 7v13" className="bi-icon" /> },
        { x: 310, who: 'cristãos', a: 'locais da vida', b: 'e morte de Jesus', icon: <path d="M-26 20V-6l26-14 26 14v26ZM-10 20V6a10 10 0 0 1 20 0v14M-26 -6h52" className="bi-icon" /> },
        { x: 430, who: 'muçulmanos', a: 'Mesquita Al-Aqsa', b: 'e Cúpula da Rocha', icon: <path d="M-30 20V2h60v18ZM-20 2a20 20 0 0 1 40 0M0 -18v-5M-22 20v-10M22 20v-10" className="bi-icon" /> },
      ].map(({ x, who, a, b, icon }, k) => <motion.g key={who} initial={false} animate={{ opacity: active === 2 ? 1 : 0, y: active === 2 ? 0 : 8 }} transition={p(0.5, active === 2 ? 1 + k * 0.3 : 0)}>
        <circle cx={x} cy="126" r="34" className="gp-medal" />
        <g transform={`translate(${x} 128)`}>{icon}</g>
        <text x={x} y="178" textAnchor="middle" className="bi-label">{who}</text>
        <text x={x} y="195" textAnchor="middle" className="bi-small">{a}</text>
        <text x={x} y="209" textAnchor="middle" className="bi-small">{b}</text>
        <motion.path d={`M${x} 216Q${x} 228 ${(x + 310) / 2} 230T310 238`} className="gp-tie" initial={false} animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.6, active === 2 ? 2 + k * 0.1 : 0)} />
      </motion.g>)}
      <circle cx="310" cy="240" r="4" className="gp-origin" />
      <text x="310" y="262" textAnchor="middle" className="bi-small bi-strong">soberania sobre a cidade:</text>
      <text x="310" y="276" textAnchor="middle" className="bi-small">ponto sensível do conflito israelo-palestino</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.5, active === 3 ? 0.6 : 0)}>
      <rect x="30" y="56" width="560" height="228" rx="14" className="gp-card" />
      <text x="50" y="82" className="bi-panel-title">LAICIDADE · NO PAPEL E NA PRÁTICA</text>
      <text x="50" y="130" className="bi-small bi-strong">no papel</text>
      <text x="50" y="190" className="bi-small bi-strong">na prática</text>
      <text x="50" y="234" className="bi-small bi-strong">religião na</text>
      <text x="50" y="248" className="bi-small bi-strong">esfera pública</text>
      {[
        { x: 230, name: 'Irã', law: 'teocracia', a: 'leis civis e penais', b: 'em preceitos religiosos', f: 0.95 },
        { x: 380, name: 'França', law: 'Estado laico', a: 'restringe símbolos', b: 'em escolas públicas', f: 0.25 },
        { x: 520, name: 'Brasil', law: 'Estado laico', a: 'bancadas religiosas', b: 'no Congresso', f: 0.7 },
      ].map(({ x, name, law, a, b, f }, k) => <g key={name}>
        <text x={x} y="104" textAnchor="middle" className="bi-label">{name}</text>
        <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0, scale: active === 3 ? 1 : 0.7 }} transition={p(0.4, active === 3 ? 0.9 + k * 0.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={x - 55} y="113" width="110" height="24" rx="12" className={k === 0 ? 'gp-chip gp-chip-warm' : 'gp-chip'} />
          <text x={x} y="129" textAnchor="middle" className="bi-small bi-strong">{law}</text>
        </motion.g>
        <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4, active === 3 ? 1.6 + k * 0.2 : 0)}>
          <text x={x} y="186" textAnchor="middle" className="bi-small">{a}</text>
          <text x={x} y="200" textAnchor="middle" className="bi-small">{b}</text>
        </motion.g>
        <rect x={x - 50} y="232" width="100" height="10" rx="5" className="bi-gauge" />
        <motion.rect x={x - 50} y="232" width={100 * f} height="10" rx="5" className="bi-gauge-fill" initial={false} animate={{ scaleX: active === 3 ? 1 : 0 }} transition={p(0.8, active === 3 ? 1.2 + k * 0.15 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
      </g>)}
      <motion.path d="M380 142Q450 154 520 142" className="gp-bracket" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.6, active === 3 ? 1.4 : 0)} />
      <text x="450" y="164" textAnchor="middle" className="bi-hand-sm">iguais no papel</text>
      <text x="450" y="270" textAnchor="middle" className="bi-hand-sm">diferentes na prática</text>
    </motion.g>

    <text x="30" y="306" className="bi-small bi-strong">{CAPTION[active][0]}</text>
    <text x="30" y="322" className="bi-small">{CAPTION[active][1]}</text>
    <text x="30" y="342" className="bi-foot">Mapa e barras esquemáticos, sem escala: setas mostram direção, não volume.</text>
  </svg>;
}

function Ballot({ x, y, on, p, delay }: { x: number; y: number; on: boolean; p: Paced; delay: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <motion.rect x="-5" y="-22" width="10" height="13" rx="1" className="bi-ballot" initial={false}
      animate={on ? { y: [-34, -18], opacity: [0, 1, 0] } : { y: -22, opacity: 0 }} transition={p(1, delay)} />
    <rect x="-10" y="-10" width="20" height="16" rx="2" className="gp-box" />
    <path d="M-5 -10h10" className="gp-slot" />
  </g>;
}

// Tensões na Europa: um só mapa com três camadas de tempo. As fronteiras
// redesenhadas no século XX, a Ucrânia de 2014 a 2022, a reação de Finlândia
// e Suécia (o efeito oposto ao objetivo que a Rússia declarou) e os dois
// referendos que o resumo contrapõe — com aval de Londres e sem aval de Madri.
export function EuropeTensions({ active }: Scene) {
  const p = usePaced();
  const on = (k: number) => active === k;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Tensões geopolíticas na Europa: fronteiras do século XX, Ucrânia de 2014 a 2022, Finlândia e Suécia na Otan e referendos da Escócia e da Catalunha; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">EUROPA · FRONTEIRAS, GUERRA, REFERENDOS</text>
    <ArrowHead id="gp-e-head" />
    {[E_MAIN, E_BRITAIN, E_IRELAND, E_SICILY].map(d => <path key={d.slice(0, 20)} d={d} className="bi-land" />)}
    <path d={E_BLACK} className="gp-inland" />
    <motion.path d={E_CZECHO} className="gp-region gp-hl-a" initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.5, on(0) ? 0.3 : 0)} />
    <motion.path d={E_YUGO} className="gp-region gp-hl-warm" initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.5, on(0) ? 0.5 : 0)} />
    <motion.path d={E_UKRAINE} className="gp-region gp-hl-gold" initial={false} animate={{ opacity: on(1) ? 1 : on(2) ? 0.45 : 0 }} transition={p(0.5, on(1) ? 0.2 : 0)} />
    <motion.path d={E_CRIMEA} className="gp-region gp-hl-warm" initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.5, on(1) ? 0.6 : 0)} />
    {[E_FINLAND, E_SWEDEN].map((d, k) => <motion.path key={d.slice(0, 20)} d={d} className="gp-region gp-hl-blue" initial={false}
      animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.6, on(2) ? 1.2 + k * 0.3 : 0)} />)}

    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.4)}>
      <motion.path d="M160.6 165L171.3 174.7L173.4 196.2L165.3 212.8L184.6 214.2L191.4 233" className="gp-oldline" initial={false} animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(1, on(0) ? 0.8 : 0)} />
      <text x="232" y="170" textAnchor="middle" className="bi-tiny">ex-URSS</text>
      <motion.path d="M147 196L144 216" className="gp-split" initial={false} animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(0.5, on(0) ? 1.2 : 0)} />
      <motion.path d="M136 236L146 244L141 252M152 230L155 246L163 252M154 246L157 262" className="bi-crack" initial={false} animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(0.7, on(0) ? 1.5 : 0)} />
      <text x="140" y="190" textAnchor="middle" className="bi-tiny">Checoslováquia</text>
      <text x="150" y="282" textAnchor="middle" className="bi-tiny">Iugoslávia</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4)}>
      <text x="198" y="212" textAnchor="middle" className="bi-small bi-strong">Ucrânia</text>
      <text x="206" y="254" textAnchor="end" className="bi-tiny">Crimeia 2014</text>
      <circle cx="233" cy="215" r="7" className="gp-ring" />
      <text x="244" y="150" textAnchor="middle" className="bi-tiny">Rússia</text>
      <text x="246" y="244" textAnchor="middle" className="bi-tiny">Donbass</text>
      <Arrow d="M244 160Q238 176 226 190" on={on(1)} p={p} head="gp-e-head" delay={1.4} />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4)}>
      <Arrow d="M204 188Q236 150 204 130" on={on(2)} p={p} head="gp-e-head" delay={0.4} />
      <motion.path d="M189.7 128.9L197.8 124L205.5 112.2L196.9 103.2L199.1 79.6L193.5 70.6" className="gp-otan" initial={false} animate={{ pathLength: on(2) ? 1 : 0 }} transition={p(0.9, on(2) ? 1.8 : 0)} />
      <text x="180" y="108" textAnchor="middle" className="bi-tiny gp-on-fill">Finlândia</text>
      <text x="134" y="130" textAnchor="middle" className="bi-tiny gp-on-fill">Suécia</text>
      <text x="238" y="100" textAnchor="middle" className="bi-tiny">Rússia</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4)}>
      <circle cx="70.5" cy="191.3" r="3.5" className="gp-origin" />
      <text x="84" y="196" className="bi-tiny">Londres</text>
      <circle cx="55.2" cy="268.4" r="3.5" className="gp-origin" />
      <text x="50" y="286" textAnchor="middle" className="bi-tiny">Madri</text>
      <motion.path d="M68 186Q70 170 58 162" className="gp-ok" initial={false} animate={{ pathLength: on(3) ? 1 : 0 }} transition={p(0.5, on(3) ? 0.5 : 0)} />
      <motion.path d="M60 264Q66 252 76 256" className="gp-no" initial={false} animate={{ pathLength: on(3) ? 1 : 0 }} transition={p(0.5, on(3) ? 1.1 : 0)} />
      <Ballot x={54} y={156} on={on(3)} p={p} delay={0.9} />
      <Ballot x={82} y={262} on={on(3)} p={p} delay={1.5} />
      <text x="72" y="146" className="bi-small bi-strong">Escócia · 2014</text>
      <text x="96" y="262" className="bi-small bi-strong">Catalunha · 2017</text>
    </motion.g>

    <rect x="282" y="56" width="310" height="244" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.4, on(0) ? 0.2 : 0)}>
      <text x="300" y="82" className="bi-panel-title">FRONTEIRAS DO SÉCULO XX</text>
      <path d="M320 112H554" className="bi-axis" />
      <motion.path d="M320 112H554" className="gp-progress" initial={false} animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(1.4, on(0) ? 0.3 : 0)} />
      {[[320, 'Versalhes', '1ª Guerra'], [437, 'acordos', '2ª Guerra'], [554, 'anos 1990', 'URSS, Iugoslávia']].map(([x, a, b], k) => <g key={a as string}>
        <circle cx={x as number} cy="112" r="5" className="gp-tick gp-tick-on" />
        <text x={x as number} y="134" textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'} dx={k === 0 ? -8 : k === 2 ? 8 : 0} className="bi-small bi-strong">{a}</text>
        <text x={x as number} y="148" textAnchor={k === 0 ? 'start' : k === 2 ? 'end' : 'middle'} dx={k === 0 ? -8 : k === 2 ? 8 : 0} className="bi-tiny">{b}</text>
      </g>)}
      <rect x="300" y="170" width="12" height="12" rx="2" className="gp-hl-a" />
      <text x="320" y="180" className="bi-small bi-strong">Checoslováquia: divisão pacífica</text>
      <text x="320" y="195" className="bi-small">em República Tcheca e Eslováquia</text>
      <rect x="300" y="212" width="12" height="12" rx="2" className="gp-hl-warm" />
      <text x="320" y="222" className="bi-small bi-strong">Iugoslávia: guerras e limpeza étnica</text>
      <text x="320" y="237" className="bi-small">entre grupos de um Estado multiétnico</text>
      <text x="437" y="280" textAnchor="middle" className="bi-hand-sm">fronteira nem sempre = grupo étnico</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4, on(1) ? 0.2 : 0)}>
      <text x="300" y="82" className="bi-panel-title">UCRÂNIA · DUAS DATAS, NÃO UMA</text>
      <text x="304" y="118" className="bi-date">2014</text>
      <text x="572" y="118" textAnchor="end" className="bi-date">2022</text>
      <motion.path d="M354 112H518" className="bi-arrow" markerEnd="url(#gp-e-head)" initial={false} animate={{ pathLength: on(1) ? 1 : 0 }} transition={p(1, on(1) ? 0.6 : 0)} />
      <text x="436" y="104" textAnchor="middle" className="bi-hand-sm">oito anos</text>
      <text x="304" y="140" className="bi-small">anexação da Crimeia</text>
      <text x="304" y="154" className="bi-small">conflito limitado no Donbass</text>
      <text x="572" y="140" textAnchor="end" className="bi-small">invasão em</text>
      <text x="572" y="154" textAnchor="end" className="bi-small">larga escala</text>
      <text x="304" y="186" className="bi-small bi-strong">maior conflito na Europa desde a 2ª Guerra</text>
      <text x="304" y="212" className="bi-tiny">MOTIVOS DECLARADOS PELA RÚSSIA</text>
      <text x="304" y="228" className="bi-small">expansão da Otan, reivindicações históricas,</text>
      <text x="304" y="243" className="bi-small">aproximação da Ucrânia com a UE</text>
      <text x="437" y="280" textAnchor="middle" className="bi-hand-sm">Ocidente: apoio à Ucrânia e sanções</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4, on(2) ? 0.2 : 0)}>
      <text x="300" y="82" className="bi-panel-title">A REAÇÃO OPOSTA AO DECLARADO</text>
      {['invasão da Ucrânia (2022)', 'vizinhos se sentem ameaçados', 'Finlândia e Suécia entram na Otan'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: on(2) ? 1 : 0, y: on(2) ? 0 : -6 }} transition={p(0.4, on(2) ? 0.4 + k * 0.5 : 0)}>
        <rect x="312" y={96 + k * 46} width="250" height="28" rx="8" className={k === 2 ? 'gp-chip gp-chip-blue' : 'gp-chip'} />
        <text x="437" y={115 + k * 46} textAnchor="middle" className="bi-small bi-strong">{line}</text>
        {k < 2 && <path d={`M437 ${126 + k * 46}v14`} className="bi-arrow-static" markerEnd="url(#gp-e-head)" />}
      </motion.g>)}
      <text x="312" y="252" className="bi-small">países historicamente neutros; a UE</text>
      <text x="312" y="267" className="bi-small">acelera a redução do gás russo</text>
      <text x="437" y="290" textAnchor="middle" className="bi-hand-sm">efeito oposto ao pretendido</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4, on(3) ? 0.2 : 0)}>
      <text x="300" y="82" className="bi-panel-title">DOIS REFERENDOS, DOIS CAMINHOS</text>
      {[
        { x: 300, t: 'ESCÓCIA · 2014', l: ['com aval de Londres', 'vitória do "não"', 'Brexit (2020)', 'reacende o debate'], ok: true },
        { x: 446, t: 'CATALUNHA · 2017', l: ['ilegal para Madri', 'crise política', 'sem independência', 'efetiva até hoje'], ok: false },
      ].map(({ x, t, l, ok }) => <g key={t}>
        <text x={x} y="110" className="bi-label">{t}</text>
        {l.map((line, k) => <text key={line} x={x} y={132 + k * 16} className={k === 0 ? `bi-small bi-strong ${ok ? 'gp-ok-text' : 'gp-no-text'}` : 'bi-small'}>{line}</text>)}
      </g>)}
      <path d="M300 206H574" className="bi-tick" />
      <text x="300" y="228" className="bi-small bi-strong">ao mesmo tempo, a UE integra:</text>
      <text x="300" y="244" className="bi-small">euro, Schengen e instituições</text>
      <text x="300" y="259" className="bi-small">supranacionais</text>
      <text x="437" y="288" textAnchor="middle" className="bi-hand-sm">separatismo × integração</text>
    </motion.g>
    <text x="30" y="332" className="bi-foot">Mapa esquemático, sem escala; fronteiras simplificadas.</text>
  </svg>;
}

function Factory({ x, y, on, p, delay }: { x: number; y: number; on: boolean; p: Paced; delay: number }) {
  return <motion.g initial={false} animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={p(0.6, on ? delay : 0)}
    style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
    <path transform={`translate(${x} ${y})`} d="M-12 6V-4l7 -5v5l7 -5v5l6 -4V-14h4V6Z" className="bi-factory" />
  </motion.g>;
}

// América Latina: o mapa marca de onde sai a matéria-prima em cada época;
// o painel mostra para onde ela vai. O último recorte fecha o círculo que o
// resumo descreve: a mesma troca de matéria-prima por manufaturados, com a
// China no lugar da Europa e dos Estados Unidos.
const LA_PRODUCTS = [
  { x: 171.1, y: 199.3, t: 'prata · Potosí', dx: -8, anchor: 'end', colony: true },
  { x: 230.1, y: 196.2, t: 'ouro · Minas', dx: -24, anchor: 'start', colony: true },
  { x: 170.4, y: 122, t: 'petróleo', dx: 8, anchor: 'start', colony: false },
  { x: 159.6, y: 220, t: 'cobre', dx: -8, anchor: 'end', colony: false },
  { x: 216.3, y: 206, t: 'café', dx: 8, anchor: 'start', colony: false },
  { x: 178.5, y: 239.6, t: 'carne e grãos', dx: 8, anchor: 'start', colony: false },
] as const;
const MERCOSUL = [[213.6, 178], [192, 208.8], [197.4, 235.4], [173, 245.6]] as const;
const PACIFICO = [[73.2, 80], [148.8, 131.8], [143.4, 172.4], [156.9, 228.4]] as const;

export function LatinAmericaExports({ active }: Scene) {
  const p = usePaced();
  const on = (k: number) => active === k;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`América Latina: pauta primário-exportadora da colônia às independências, substituição de importações de 1930 a 1970, Mercosul e Aliança do Pacífico, e a China como novo parceiro; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">AMÉRICA LATINA · O QUE SAI E PARA ONDE</text>
    <ArrowHead id="gp-l-head" />
    <path d={L_MAIN} className="bi-land" />
    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4)}>
      <motion.path d="M84 72L92 96L140 124L146 142L140 172L152 196L152 262L168 290" className="gp-coast" initial={false}
        animate={{ pathLength: on(2) ? 1 : 0 }} transition={p(1, on(2) ? 0.3 : 0)} />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.4)}>
      {LA_PRODUCTS.map(({ x, y, t, dx, anchor, colony }, k) => <motion.g key={t} initial={false}
        animate={{ opacity: on(0) ? (colony ? [0, 1, 1, 0.5] : [0, 0, 1]) : 0, scale: on(0) ? 1 : 0.5 }}
        transition={p(colony ? 2.4 : 1.6, on(0) ? (colony ? 0.2 + k * 0.2 : 1.6 + k * 0.15) : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={x} cy={y} r="5" className={colony ? 'gp-pin gp-pin-gold' : 'gp-pin'} />
        <text x={x + dx} y={t === 'ouro · Minas' ? y - 10 : t === 'cobre' ? y + 16 : y + 4} textAnchor={anchor} className="bi-small bi-strong">{t}</text>
      </motion.g>)}
      <Arrow d="M240 218Q256 226 270 214" on={on(0)} p={p} head="gp-l-head" delay={2.4} />
      <Arrow d="M180 116Q200 96 222 100" on={on(0)} p={p} head="gp-l-head" delay={2.5} />
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4)}>
      <Factory x={216.3} y={206} on={on(1)} p={p} delay={0.5} />
      <Factory x={190.9} y={241.3} on={on(1)} p={p} delay={0.8} />
      <Factory x={81} y={90.1} on={on(1)} p={p} delay={1.1} />
      <text x="232" y="214" className="bi-tiny">Brasil</text>
      <text x="206" y="252" className="bi-tiny">Argentina</text>
      <text x="100" y="98" className="bi-tiny">México</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4)}>
      {MERCOSUL.map(([x, y], k) => <motion.circle key={`m${k}`} cx={x} cy={y} r="6" className="gp-pin gp-pin-teal" initial={false}
        animate={{ scale: on(2) ? [0, 1.3, 1] : 0 }} transition={p(0.5, on(2) ? 0.6 + k * 0.12 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      {PACIFICO.map(([x, y], k) => <motion.circle key={`p${k}`} cx={x} cy={y} r="6" className="gp-pin gp-pin-gold" initial={false}
        animate={{ scale: on(2) ? [0, 1.3, 1] : 0 }} transition={p(0.5, on(2) ? 1.2 + k * 0.12 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <circle cx="170.4" cy="122" r="6" className="gp-pin-hollow" />
      <text x="72" y="190" textAnchor="middle" className="bi-small bi-strong">Pacífico</text>
      <text x="252" y="262" textAnchor="middle" className="bi-small bi-strong">Atlântico</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4)}>
      <circle cx="213.6" cy="178" r="5" className="gp-pin" />
      <circle cx="156.9" cy="228.4" r="5" className="gp-pin" />
      <text x="206" y="170" textAnchor="end" className="bi-tiny">Brasil</text>
      <text x="150" y="232" textAnchor="end" className="bi-tiny">Chile</text>
      <Arrow d="M220 176Q262 162 294 180" on={on(3)} p={p} head="gp-l-head" delay={0.6} />
      <Arrow d="M164 226Q246 214 294 192" on={on(3)} p={p} head="gp-l-head" delay={0.9} />
    </motion.g>

    <rect x="300" y="56" width="292" height="248" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.4, on(0) ? 0.2 : 0)}>
      <text x="318" y="82" className="bi-panel-title">PAUTA PRIMÁRIO-EXPORTADORA</text>
      <rect x="318" y="94" width="256" height="24" rx="8" className="gp-chip gp-chip-warm" />
      <text x="446" y="110" textAnchor="middle" className="bi-small bi-strong">colônia: prata (Potosí), ouro (Minas)</text>
      <path d="M446 120v12" className="bi-arrow-static" markerEnd="url(#gp-l-head)" />
      <rect x="318" y="138" width="256" height="24" rx="8" className="gp-chip" />
      <text x="446" y="154" textAnchor="middle" className="bi-small bi-strong">após as independências, século XIX</text>
      <path d="M330 234V184M330 234H566" className="bi-axis" />
      <motion.path d="M336 206L360 194L378 218L400 190L420 222L444 188L466 214L490 196L512 226L538 192L560 210" className="bi-price" initial={false}
        animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(1.6, on(0) ? 1.4 : 0)} />
      <text x="336" y="250" className="bi-tiny">preço oscila → economia vulnerável</text>
      <text x="446" y="286" textAnchor="middle" className="bi-hand-sm">vende matéria-prima, compra manufatura</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4, on(1) ? 0.2 : 0)}>
      <text x="318" y="82" className="bi-panel-title">SUBSTITUIÇÃO DE IMPORTAÇÕES</text>
      <text x="318" y="104" className="bi-small bi-strong">décadas de 1930 a 1970</text>
      <path d="M318 196h256" className="bi-ground" />
      <path transform="translate(372 196)" d="M-30 0V-24l12-8v8l12-8v8l12-8V-44h6V0Z" className="bi-factory" />
      <text x="372" y="214" textAnchor="middle" className="bi-tiny">indústria nacional</text>
      <rect x="446" y="136" width="12" height="60" rx="2" className="gp-wall" />
      <text x="452" y="128" textAnchor="middle" className="bi-tiny">tarifa</text>
      {[0, 1, 2].map(k => <motion.rect key={`imp${k}`} y={150 + k * 16} width="18" height="12" rx="2" className="gp-crate" initial={false}
        animate={on(1) ? { x: [560, 464, 486] } : { x: 560 }} transition={p(1.2, on(1) ? 0.6 + k * 0.25 : 0)} />)}
      <text x="530" y="214" textAnchor="middle" className="bi-tiny">importados</text>
      <text x="318" y="240" className="bi-small">Brasil, Argentina e México; resultados</text>
      <text x="318" y="255" className="bi-small">parciais: parques industriais que ainda pesam</text>
      <text x="446" y="288" textAnchor="middle" className="bi-hand-sm">não foi fracasso total</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4, on(2) ? 0.2 : 0)}>
      <text x="318" y="82" className="bi-panel-title">DOIS BLOCOS, DUAS ORIENTAÇÕES</text>
      {[
        { x: 318, dot: 'gp-pin gp-pin-teal', t: 'MERCOSUL · 1991', l: ['Brasil, Argentina,', 'Paraguai, Uruguai', 'tarifa comum', 'mais protecionista'] },
        { x: 450, dot: 'gp-pin gp-pin-gold', t: 'ALIANÇA DO PACÍFICO', l: ['México, Colômbia,', 'Peru, Chile', 'livre-comércio', 'mais liberal'] },
      ].map(({ x, dot, t, l }) => <g key={t}>
        <circle cx={x + 5} cy="104" r="5" className={dot} />
        <text x={x + 16} y="108" className="bi-tiny bi-strong">{t}</text>
        {l.map((line, k) => <text key={line} x={x} y={130 + k * 16} className={k === 3 ? 'bi-small bi-strong' : 'bi-small'}>{line}</text>)}
      </g>)}
      <circle cx="323" cy="214" r="5" className="gp-pin-hollow" />
      <text x="334" y="218" className="bi-small">Venezuela: suspensa desde 2016</text>
      <text x="318" y="244" className="bi-small">acordo Mercosul-UE: mais de duas</text>
      <text x="318" y="259" className="bi-small">décadas de negociação</text>
      <text x="446" y="290" textAnchor="middle" className="bi-hand-sm">integração lenta e fragmentada</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4, on(3) ? 0.2 : 0)}>
      <text x="318" y="82" className="bi-panel-title">REPRIMARIZAÇÃO · ANOS 2000</text>
      {([[318, 70, 'petróleo'], [394, 108, 'minério de ferro'], [508, 62, 'soja']] as const).map(([x, w, t], k) => <motion.g key={t} initial={false} animate={{ opacity: on(3) ? 1 : 0, x: on(3) ? 0 : -10 }} transition={p(0.4, on(3) ? 0.4 + k * 0.2 : 0)}>
        <rect x={x} y="96" width={w} height="24" rx="12" className="gp-chip" />
        <text x={x + w / 2} y="112" textAnchor="middle" className="bi-tiny bi-strong">{t}</text>
      </motion.g>)}
      <text x="318" y="146" className="bi-tiny">PARCEIRO COMERCIAL DE BRASIL E CHILE</text>
      <text x="318" y="170" className="bi-small bi-strong">EUA</text>
      <text x="318" y="194" className="bi-small bi-strong">China</text>
      <rect x="364" y="160" width="170" height="12" rx="6" className="gp-bar-a" />
      <motion.rect x="364" y="184" width="206" height="12" rx="6" className="gp-bar-b" initial={false} animate={{ scaleX: on(3) ? [0.3, 1] : 0.3 }} transition={p(1.2, on(3) ? 1 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
      <text x="318" y="224" className="bi-small">a China supera os EUA e investe em</text>
      <text x="318" y="239" className="bi-small">infraestrutura e mineração</text>
      <text x="446" y="276" textAnchor="middle" className="bi-hand-sm">nova dependência,</text>
      <text x="446" y="293" textAnchor="middle" className="bi-hand-sm">agora voltada à Ásia</text>
    </motion.g>
    <text x="30" y="332" className="bi-foot">Mapa e barras esquemáticos, sem escala nem valores.</text>
  </svg>;
}

// África: fronteiras de régua sobre grupos que não cabem nelas, as trajetórias
// que desmentem o "bloco homogêneo", as rotas financiadas por empréstimo
// garantido em minério e a maldição dos recursos. As manchas de grupos são
// esquemáticas — o resumo não localiza grupo nenhum, e a prancha diz isso.
const BLOBS = [
  { cx: 86, cy: 138, rx: 28, ry: 14, c: 'gp-blob-a' },
  { cx: 152, cy: 122, rx: 30, ry: 15, c: 'gp-blob-b' },
  { cx: 164, cy: 222, rx: 17, ry: 13, c: 'gp-blob-c' },
  { cx: 194, cy: 226, rx: 16, ry: 13, c: 'gp-blob-b' },
] as const;
const ROUTE_PTS = [[[169, 189], [150, 194], [133, 200]], [[169, 189], [196, 192], [224, 200]], [[182, 224], [196, 234], [210, 244]]];
const ROUTES = ROUTE_PTS.map(pts => `M${pts.map(q => q.join(' ')).join('L')}`);

export function AfricaToday({ active }: Scene) {
  const p = usePaced();
  const on = (k: number) => active === k;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`África no mundo atual: fronteiras da Conferência de Berlim cortando grupos, diversidade de trajetórias, empréstimos chineses garantidos por recursos e maldição dos recursos; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ÁFRICA · HERANÇA, DIVERSIDADE, RECURSOS</text>
    <ArrowHead id="gp-a-head" />
    <path d={A_MAIN} className="bi-land" /><path d={A_MADAG} className="bi-land" />

    <motion.g initial={false} animate={{ opacity: on(0) ? 1 : 0 }} transition={p(0.4)}>
      {BLOBS.map(b => <ellipse key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} className={`gp-blob ${b.c}`} />)}
      {['M92 94V156', 'M126 90L178 160', 'M144 198H216L208 252H148Z'].map((d, k) => <motion.path key={d} d={d} className="gp-ruler" initial={false}
        animate={{ pathLength: on(0) ? 1 : 0 }} transition={p(0.7, on(0) ? 0.4 + k * 0.5 : 0)} />)}
      <text x="86" y="172" textAnchor="middle" className="bi-tiny bi-strong">grupo dividido</text>
      <text x="180" y="268" textAnchor="middle" className="bi-tiny bi-strong">rivais no mesmo país</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4)}>
      {[[102.8, 157.1, 'Lagos', -8, 'end'], [197.3, 77.2, 'Cairo', 8, 'start'], [216.3, 183.6, 'Nairóbi', 8, 'start']].map(([x, y, t, dx, a], k) => <motion.g key={t as string}
        initial={false} animate={{ opacity: on(1) ? 1 : 0, scale: on(1) ? 1 : 0.6 }} transition={p(0.5, on(1) ? 0.4 + k * 0.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path transform={`translate(${x} ${y})`} d="M-7 4V-6h5v-5h5v7h4V4Z" className="gp-city" />
        <text x={(x as number) + (dx as number)} y={(y as number) + 4} textAnchor={a as 'start' | 'end'} className="bi-small bi-strong">{t}</text>
      </motion.g>)}
      {[[193.2, 186, 'Ruanda', -8, 'end'], [172.8, 254, 'Botsuana', 8, 'start'], [223.8, 148.6, 'Etiópia*', 8, 'start']].map(([x, y, t, dx, a], k) => <motion.g key={t as string}
        initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.5, on(1) ? 1.1 + k * 0.2 : 0)}>
        <motion.path d={`M${x} ${(y as number) + 6}v-12m-4 4l4-4 4 4`} className="gp-grow" initial={false} animate={{ pathLength: on(1) ? 1 : 0 }} transition={p(0.5, on(1) ? 1.2 + k * 0.2 : 0)} />
        <text x={(x as number) + (dx as number)} y={(y as number) + 4} textAnchor={a as 'start' | 'end'} className="bi-tiny">{t}</text>
      </motion.g>)}
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4)}>
      {ROUTES.map((d, k) => <g key={d}>
        <motion.path d={d} className="gp-rail" initial={false} animate={{ pathLength: on(2) ? 1 : 0 }} transition={p(0.8, on(2) ? 0.4 + k * 0.3 : 0)} />
        <motion.path d={d} className="gp-ties" initial={false} animate={{ pathLength: on(2) ? 1 : 0 }} transition={p(0.8, on(2) ? 0.4 + k * 0.3 : 0)} />
      </g>)}
      {[[133, 200], [224, 200], [210, 244]].map(([x, y]) => <g key={`port-${x}`}>
        <circle cx={x} cy={y} r="5" className="gp-port" />
      </g>)}
      {ROUTE_PTS.map((pts, k) => <motion.circle key={`ore-${k}`} r="3.5" className="gp-ore" initial={false}
        animate={on(2) ? { cx: pts.map(q => q[0]), cy: pts.map(q => q[1]), opacity: [0, 1, 1] } : { cx: pts[0][0], cy: pts[0][1], opacity: 0 }}
        transition={p(1.2, on(2) ? 1.6 + k * 0.2 : 0)} />)}
      <text x="128" y="214" textAnchor="end" className="bi-tiny">porto</text>
      <text x="232" y="204" className="bi-tiny">porto</text>
      <text x="168" y="180" textAnchor="middle" className="bi-tiny bi-strong">minas</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4)}>
      <motion.g initial={false} animate={{ scale: on(3) ? [0.6, 1.15, 1] : 0.6 }} transition={p(0.6, on(3) ? 0.4 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x="160" y="182" width="18" height="12" rx="2" className="gp-battery" /><rect x="178" y="185" width="3" height="6" className="gp-battery" />
      </motion.g>
      <text x="170" y="210" textAnchor="middle" className="bi-small bi-strong">cobalto · RDC</text>
      {[[118.4, 148.6, 'Nigéria', 8, 'start'], [149, 226, 'Angola', -10, 'end']].map(([x, y, t, dx, a], k) => <motion.g key={t as string} initial={false}
        animate={{ opacity: on(3) ? 1 : 0, y: on(3) ? 0 : -6 }} transition={p(0.5, on(3) ? 0.8 + k * 0.2 : 0)}>
        <path transform={`translate(${x} ${y})`} d="M0 -10c5 6 7 9 7 12a7 7 0 0 1-14 0c0-3 2-6 7-12Z" className="gp-oil" />
        <text x={(x as number) + (dx as number)} y={(y as number) + 4} textAnchor={a as 'start' | 'end'} className="bi-tiny bi-strong">{`${t} · petróleo`}</text>
      </motion.g>)}
      <path transform="translate(179.6 271)" d="M-7 -3l3-4h8l3 4-7 8Z" className="gp-gem" />
      <text x="190" y="284" className="bi-tiny">ouro, diamantes</text>
    </motion.g>

    <rect x="290" y="56" width="302" height="248" rx="14" className="bi-panel" />
    <Panel show={on(0)} p={p} x={290} w={302} handY={284} title="CONFERÊNCIA DE BERLIM · 1884-1885" hand="a régua europeia ficou no mapa"
      lines={[['fronteiras de potências europeias', 'strong'], ['critério europeu, não étnico'], ['divide grupos unidos e une rivais', 'warn'], ['independências: décadas de 1950 a 1970'], ['exportar cacau, café, minerais, algodão'], ['padrão que muitos ainda não superaram']]} />
    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0 }} transition={p(0.4, on(1) ? 0.2 : 0)}>
      <text x="308" y="82" className="bi-panel-title">MAIS DE 50 PAÍSES, NÃO UM BLOCO</text>
      {[0.3, 0.44, 0.6, 0.78, 1].map((w, k) => <motion.rect key={w} x={520 - 52 * w} y={100 + k * 16} width={104 * w} height="12" rx="3" className="gp-age" initial={false}
        animate={{ scaleX: on(1) ? 1 : 0 }} transition={p(0.6, on(1) ? 0.4 + (4 - k) * 0.15 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="520" y="194" textAnchor="middle" className="bi-tiny">base larga: muitos jovens</text>
      <text x="308" y="108" className="bi-small bi-strong">a população</text>
      <text x="308" y="123" className="bi-small bi-strong">mais jovem</text>
      <text x="308" y="138" className="bi-small bi-strong">do planeta</text>
      <text x="308" y="160" className="bi-tiny">bônus demográfico,</text>
      <text x="308" y="173" className="bi-tiny">se houver educação</text>
      <text x="308" y="186" className="bi-tiny">e emprego</text>
      <text x="308" y="220" className="bi-small">cidades: Lagos (a maior), Nairóbi, Cairo</text>
      <text x="308" y="238" className="bi-small">crescimento: Ruanda, Botsuana, Etiópia*</text>
      <text x="308" y="256" className="bi-tiny">* antes do seu conflito interno recente</text>
      <text x="441" y="290" textAnchor="middle" className="bi-hand-sm">trajetórias muito distintas</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0 }} transition={p(0.4, on(2) ? 0.2 : 0)}>
      <text x="308" y="82" className="bi-panel-title">CHINA: INFRAESTRUTURA POR RECURSOS</text>
      <rect x="318" y="96" width="176" height="26" rx="8" className="gp-chip gp-chip-warm" />
      <text x="406" y="113" textAnchor="middle" className="bi-small bi-strong">empréstimo chinês</text>
      <path d="M406 124v16" className="bi-arrow-static" markerEnd="url(#gp-a-head)" />
      <rect x="318" y="146" width="176" height="26" rx="8" className="gp-chip" />
      <text x="406" y="163" textAnchor="middle" className="bi-small bi-strong">estradas, ferrovias, portos</text>
      <motion.path d="M496 160Q548 136 498 110" className="bi-arrow" markerEnd="url(#gp-a-head)" initial={false} animate={{ pathLength: on(2) ? 1 : 0 }} transition={p(0.7, on(2) ? 1.4 : 0)} />
      <text x="530" y="128" className="bi-tiny">garantia:</text>
      <text x="530" y="140" className="bi-tiny">minérios</text>
      <text x="530" y="152" className="bi-tiny">e energia</text>
      <text x="318" y="200" className="bi-small bi-strong">+ avanço real de infraestrutura</text>
      <text x="318" y="218" className="bi-small bi-warn">− preocupação com endividamento</text>
      <text x="441" y="262" textAnchor="middle" className="bi-hand-sm">ecoa a exploração colonial,</text>
      <text x="441" y="280" textAnchor="middle" className="bi-hand-sm">com outros atores</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0 }} transition={p(0.4, on(3) ? 0.2 : 0)}>
      <text x="308" y="82" className="bi-panel-title">MALDIÇÃO DOS RECURSOS</text>
      {['riqueza mineral concentrada', 'disputa pelo controle da renda', 'instabilidade e corrupção'].map((line, k) => <motion.g key={line} initial={false}
        animate={{ opacity: on(3) ? 1 : 0, y: on(3) ? 0 : -6 }} transition={p(0.4, on(3) ? 0.5 + k * 0.5 : 0)}>
        <rect x="318" y={96 + k * 44} width="246" height="26" rx="8" className={k === 2 ? 'gp-chip gp-chip-warm' : 'gp-chip'} />
        <text x="441" y={113 + k * 44} textAnchor="middle" className="bi-small bi-strong">{line}</text>
        {k < 2 && <path d={`M441 ${124 + k * 44}v12`} className="bi-arrow-static" markerEnd="url(#gp-a-head)" />}
      </motion.g>)}
      <text x="318" y="246" className="bi-small">RDC: maior parte das reservas mundiais</text>
      <text x="318" y="261" className="bi-small">de cobalto, para baterias de carros elétricos</text>
      <text x="441" y="292" textAnchor="middle" className="bi-hand-sm">riqueza não garante desenvolvimento</text>
    </motion.g>
    <text x="30" y="332" className="bi-foot">Mapa esquemático, sem escala; manchas de grupos são ilustrativas.</text>
  </svg>;
}

export const SCENES_LOTE11: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-terrorismo-internacional': TerrorNetwork,
  'summary-geografia-geografia-das-religioes': ReligionsMap,
  'summary-geografia-tensoes-geopoliticas-na-europa': EuropeTensions,
  'summary-geografia-geopolitica-e-geoeconomia-da-america-latina': LatinAmericaExports,
  'summary-geografia-africa-no-mundo-atual': AfricaToday,
};
export const HEADERS_LOTE11: Record<string, string> = {
  'summary-geografia-terrorismo-internacional': 'rede e rótulo em disputa',
  'summary-geografia-geografia-das-religioes': 'origem, território e laicidade',
  'summary-geografia-tensoes-geopoliticas-na-europa': 'fronteiras, guerra e referendos',
  'summary-geografia-geopolitica-e-geoeconomia-da-america-latina': 'pauta exportadora e blocos',
  'summary-geografia-africa-no-mundo-atual': 'herança colonial e recursos',
};
