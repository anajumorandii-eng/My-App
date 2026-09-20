import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import './EnzymeBoard.css';

function EnzymeScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reduced = useReducedMotion();
  const action = emphasis === 'esquerda';
  const condition = emphasis === 'direita';
  const transition = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 16 };
  return (
    <svg className="enzyme-atlas" viewBox="0 0 460 360" role="img" data-emphasis={emphasis}
      aria-label="Enzima flexível recebendo um substrato no sítio ativo, liberando produtos e gráfico de energia de ativação reduzida">
      <defs>
        <linearGradient id="enzyme-paper" x1="0" x2="1" y2="1"><stop stopColor="#fff6df" /><stop offset="1" stopColor="#e6f0dc" /></linearGradient>
        <linearGradient id="enzyme-protein" x1="0" x2="1"><stop stopColor="#5d7c53" /><stop offset="1" stopColor="#244938" /></linearGradient>
        <filter id="enzyme-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect width="460" height="360" rx="22" fill="url(#enzyme-paper)" />
      <path className="enzyme-atlas__grid" d="M28 64H432M28 112H432M28 160H432M28 208H432M28 256H432M28 304H432M73 34V327M131 34V327M189 34V327M247 34V327M305 34V327M363 34V327" />
      <text className="enzyme-atlas__title" x="30" y="47">uma proteína muda a rota, não o destino</text>

      <motion.g className="enzyme-atlas__substrate" animate={{ x: action ? 74 : 0, rotate: action ? 10 : 0 }} transition={transition}>
        <path d="M39 145l20-19 24 9 3 28-24 14-23-11Z" /><text x="40" y="113">substrato</text>
      </motion.g>
      <path className="enzyme-atlas__protein" data-active={action || undefined}
        d="M137 117c32-41 96-34 116 6 15 31-3 68-33 79-24 9-44-2-57 13-17 21-43 15-54-7-12-25 4-64 28-91Z" fill="url(#enzyme-protein)" />
      <path className="enzyme-atlas__site" d="M178 148c11 18 29 20 43 1" /><text className="enzyme-atlas__label" x="144" y="239">sítio ativo flexível</text>
      <motion.g className="enzyme-atlas__product" animate={{ x: action ? 22 : 0, opacity: action ? 1 : .45 }} transition={transition}>
        <path d="M281 140l16-17 20 10-1 22-21 8-15-11ZM321 162l13-14 17 9-1 18-18 7-13-10Z" /><text x="286" y="111">produtos</text>
      </motion.g>
      <motion.path className="enzyme-atlas__fit" d="M92 151C117 151 137 151 164 151" initial={false} animate={{ pathLength: action ? 1 : .32, opacity: action ? 1 : .28 }} transition={transition} />

      <g className="enzyme-atlas__energy">
        <path className="enzyme-atlas__axis" d="M43 321H427M43 321V254" />
        <path className="enzyme-atlas__barrier enzyme-atlas__barrier--without" d="M64 313C135 311 160 259 224 262s77 49 170 46" />
        <motion.path className="enzyme-atlas__barrier enzyme-atlas__barrier--with" d="M64 313C136 312 151 291 224 294s81 19 170 17" initial={false} animate={{ opacity: condition ? .45 : 1 }} transition={transition} />
        <text x="63" y="343">reagentes</text><text x="351" y="343">produtos</text>
        <text className="enzyme-atlas__curve-label" x="259" y="270">sem enzima · barreira maior</text><text className="enzyme-atlas__curve-label" x="238" y="304">com enzima · rota acessível</text>
      </g>
      <motion.g className="enzyme-atlas__heat" animate={{ opacity: condition ? 1 : .15, scale: condition ? 1 : .7 }} transition={transition}>
        <path d="M376 80c-12 15 9 17-2 34M395 76c-12 15 9 17-2 34M414 82c-12 15 9 17-2 34" /><text x="353" y="136">calor excessivo</text>
      </motion.g>
      <motion.path className="enzyme-atlas__denatured" d="M361 161c19-19 38-16 50 5-6 17-24 25-43 15-13-7-14-14-7-20Z" initial={false} animate={{ opacity: condition ? 1 : 0, pathLength: condition ? 1 : 0 }} transition={transition} />
    </svg>
  );
}

export default function EnzymeBoard(props: BoardProps) {
  const pair = boardPair(props);
  return (
    <div className="enzyme-board">
      <BoardShell
      kicker="Biologia · catálise em movimento"
      title="A enzima não dá energia. Ela abaixa a barreira."
      subtitle="O sítio ativo reconhece e se ajusta ao substrato; a proteína sai intacta, pronta para repetir a reação."
      condition={{ label: 'a 80°C', value: 'desnatura' }}
      ariaLabel="Prancha ilustrada de enzimas, encaixe induzido, energia de ativação e desnaturação"
      scene={<EnzymeScene emphasis={pair.emphasis} />}
      sceneNotes={{ up: 'encaixe → reação', down: 'estrutura → função' }}
      emphasis={pair.emphasis}
      left={{ label: 'Modelo de ação', headline: 'Encaixe induzido, não chave rígida.', detail: 'O sítio ativo muda de conformação no contato; depois libera o produto e volta a atuar.', formula: 'E + S ⇄ ES → E + P' }}
      right={{ label: 'Temperatura e pH', headline: 'Velocidade não é só colisão.', detail: 'Fora do ótimo, a atividade cai; calor ou pH extremos podem desmontar a forma do sítio ativo.', formula: 'forma perdida → função cai' }}
      leftState={pair.leftState} rightState={pair.rightState}
      leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Energia de ativação', general: 'Eₐ com enzima', condition: '< Eₐ sem enzima', reduced: 'equilíbrio igual' }}
      supports={<>
        <section className="vs-formula-note enzyme-note"><span className="vs-note-title">Competitiva</span><strong>Disputa o mesmo sítio.</strong><p>Mais substrato pode vencer a disputa porque o inibidor ocupa o sítio ativo.</p></section>
        <section className="vs-formula-note enzyme-note"><span className="vs-note-title">Não competitiva</span><strong>Muda a enzima de outro lugar.</strong><p>O inibidor alostérico altera a conformação; aumentar substrato não recupera a atividade.</p></section>
      </>}
      closing="enzimas aceleram reações possíveis ao oferecer uma rota de menor barreira; não são consumidas e não deslocam o equilíbrio final."
      />
    </div>
  );
}
