import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import './FungiBoard.css';

function FungiScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reduced = useReducedMotion();
  const reproduction = emphasis === 'esquerda';
  const ecology = emphasis === 'direita';
  const transition = reduced ? { duration: 0 } : { duration: 1.1, ease: 'easeOut' as const };

  return (
    <svg className="fungi-atlas" viewBox="0 0 460 360" role="img" data-emphasis={emphasis}
      aria-label="Corte de uma floresta mostrando cogumelo, micélio, hifas que liberam enzimas no solo, nutrientes absorvidos e raiz em micorriza">
      <defs>
        <linearGradient id="fungi-sky-v2" x1="0" x2="0" y2="1"><stop stopColor="#dfe9dc" /><stop offset="1" stopColor="#f8ead8" /></linearGradient>
        <linearGradient id="fungi-soil-v2" x1="0" x2="0" y2="1"><stop stopColor="#76543d" /><stop offset="1" stopColor="#2b2725" /></linearGradient>
        <radialGradient id="fungi-cap-v2"><stop stopColor="#e2846f" /><stop offset="1" stopColor="#6e2941" /></radialGradient>
        <filter id="fungi-grain-v2"><feTurbulence baseFrequency=".72" numOctaves="2" seed="12" result="grain" /><feComposite in="grain" in2="SourceGraphic" operator="in" /><feBlend in="SourceGraphic" mode="multiply" /></filter>
        <filter id="fungi-glow-v2" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      <rect width="460" height="142" fill="url(#fungi-sky-v2)" />
      <path className="fungi-atlas__horizon" d="M0 133c68-18 110 5 174-4 74-11 143-25 286 9v222H0Z" fill="url(#fungi-soil-v2)" filter="url(#fungi-grain-v2)" />
      <path className="fungi-atlas__log" d="M24 187c62-26 134-16 205 16l-16 40c-67-22-125-21-190 1Z" />
      <path className="fungi-atlas__log-ring" d="M48 201c45-16 100-8 143 12M57 217c38-12 78-7 116 7" />

      <g className="fungi-atlas__mushroom">
        <path d="M328 169c6-43 12-77 23-77 12 0 19 34 25 77Z" />
        <path className="fungi-atlas__cap" d="M289 109c16-56 105-65 129 2-18 17-110 19-129-2Z" fill="url(#fungi-cap-v2)" />
        <path className="fungi-atlas__gills" d="M303 112c29 10 72 10 100 0M313 119c23 8 56 8 80 0" />
      </g>

      <motion.g className="fungi-atlas__spores" animate={reproduction && !reduced ? { y: [-2, -18, -2], opacity: [1, .55, 1] } : { y: 0, opacity: reproduction ? 1 : .6 }} transition={{ ...transition, repeat: reproduction && !reduced ? Infinity : 0, repeatDelay: .25 }}>
        {[[303, 83], [321, 59], [347, 43], [367, 64], [389, 48], [405, 80]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
        <path d="M342 97c-5-22-2-43 4-57M371 96c9-20 16-31 21-46" />
      </motion.g>

      <g className="fungi-atlas__hyphae" data-active={ecology || undefined}>
        <path d="M350 168c-2 36-22 51-55 57s-37 36-70 47-38 38-79 54" />
        <path d="M306 223c-41-8-67 12-81 41s-42 30-78 43-36 27-61 35" />
        <path d="M270 258c-32-36-68-31-101-53s-68-15-113-43" />
        <path d="M333 205c34 17 52 23 69 53s29 38 49 47" />
        <path d="M225 264l-34-34M245 245l17-35M171 245l-44 3M294 223l23 29M144 289l-35-5M403 258l14-28" />
      </g>

      <motion.g className="fungi-atlas__enzymes" animate={reduced ? { opacity: 1 } : { opacity: [1, .42, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        {[[129, 239], [155, 257], [182, 233], [197, 274]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" />)}
        <path d="M129 239l-20-17M155 257l-12-22M182 233l20-19M197 274l21-12" />
      </motion.g>
      <motion.g className="fungi-atlas__nutrients" animate={ecology && !reduced ? { x: [0, 14, 0], opacity: [1, .55, 1] } : { x: 0, opacity: .72 }} transition={{ ...transition, repeat: ecology && !reduced ? Infinity : 0 }}>
        {[[109, 292], [142, 306], [181, 295], [219, 307], [255, 281]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />)}
        <path d="M109 292c36-13 75-18 114-35M181 295c28-8 49-22 72-41" />
      </motion.g>

      <g className="fungi-atlas__root" data-active={ecology || undefined}>
        <path d="M450 168c-38 19-48 43-51 66s-24 39-39 61" />
        <path d="M426 186c-23 8-36 23-45 42M412 218c-17 4-29 17-39 36M402 250c-15 2-27 15-34 31" />
      </g>
      <path className="fungi-atlas__mycorrhiza" d="M369 266c12-8 23-6 36 4M359 280c13-7 26-5 38 7M350 294c12-7 24-4 35 8" />

      <g className="fungi-atlas__notes">
        <text x="48" y="217">madeira morta</text><text x="49" y="234">matéria orgânica</text>
        <text x="76" y="261">enzimas fora</text><path d="M133 264C124 254 121 249 116 244" />
        <text x="202" y="337">micélio · corpo do fungo</text><path d="M263 326c-12-12-21-22-30-37" />
        <text x="331" y="74">esporos</text><text x="347" y="316">micorriza</text>
      </g>
      <motion.path className="fungi-atlas__connection" d="M280 310C313 324 347 318 373 297" initial={false}
        animate={{ pathLength: ecology ? 1 : .32, opacity: ecology ? 1 : .28 }} transition={transition} />
    </svg>
  );
}

export default function FungiBoard(props: BoardProps) {
  const pair = boardPair(props);
  return (
    <div className="fungi-board">
      <BoardShell
      kicker="Biologia · organismo em rede"
      title="O fungo começa onde você não vê."
      subtitle="O cogumelo libera esporos; o organismo que digere, absorve e se associa às raízes é o micélio espalhado no substrato."
      condition={{ label: 'nutrição', value: 'absorção' }}
      ariaLabel="Prancha ilustrada de fungos, micélio, digestão extracorpórea, esporos e micorriza"
      scene={<FungiScene emphasis={pair.emphasis} />}
      sceneNotes={{ up: 'enzimas → fora', down: 'nutrientes → dentro' }}
      emphasis={pair.emphasis}
      left={{ label: 'Diversidade · esporos', headline: 'O grupo se reconhece pela estrutura reprodutiva.', detail: 'Ascos, basídios e zigósporos organizam grupos clássicos. O cogumelo é corpo de frutificação, não o organismo inteiro.', formula: 'micélio → estrutura → esporos' }}
      right={{ label: 'Ecologia · simbiose', headline: 'A rede devolve matéria e amplia raízes.', detail: 'Na decomposição, libera nutrientes. Na micorriza, recebe açúcares e estende a absorção de água e fósforo da planta.', formula: 'hifa + raiz ↔ troca' }}
      leftState={pair.leftState} rightState={pair.rightState}
      leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Fluxo de matéria', general: 'substrato → moléculas', condition: 'enzimas fora', reduced: '→ absorção' }}
      supports={<>
        <section className="vs-formula-note fungi-note"><span className="vs-note-title">O que entra primeiro?</span><strong>Não é alimento inteiro.</strong><p>As hifas lançam enzimas no substrato. Só depois da quebra externa é que moléculas pequenas atravessam para o micélio.</p></section>
        <section className="vs-formula-note fungi-note"><span className="vs-note-title">Pegadinha de prova</span><strong>Quitina e glicogênio, não celulose e amido.</strong><p>Fungos são eucariontes heterótrofos. Líquen é associação; micorriza é mutualismo, não parasitismo da raiz.</p></section>
      </>}
      closing="o corpo vegetativo é o micélio: ele digere fora, absorve depois e conecta decomposição, esporos e simbioses no mesmo organismo."
      />
    </div>
  );
}
