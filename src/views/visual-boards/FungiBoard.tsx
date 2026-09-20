import React from 'react';
import { NODE_STATE_LABEL, type NodeState } from '../../lib/visualStudy';
import type { BoardProps } from './types';
import './FungiBoard.css';

type Focus = 'enzimas' | 'absorcao' | 'reproducao' | 'nenhum';

function nodeState(states: Record<string, NodeState>, id?: string): NodeState {
  return id ? states[id] ?? 'nao-avaliado' : 'nao-avaliado';
}

/**
 * The organism is the mycelium, not the mushroom. The board puts the hidden
 * hyphae, extracellular digestion and reproduction in one causal scene so the
 * student can follow matter through the actual fungal body.
 */
export default function FungiBoard({ map, states, selectedId, onSelect }: BoardProps) {
  const [general, diversity, ecology] = map.nodes;
  const focus: Focus = selectedId === diversity?.id ? 'reproducao'
    : selectedId === ecology?.id ? 'absorcao'
      : selectedId === general?.id ? 'enzimas' : 'nenhum';

  const steps = [
    {
      key: 'enzimas' as const,
      node: general,
      title: '1 · Hifas secretam enzimas',
      detail: 'A digestão acontece fora do corpo: polímeros do substrato são quebrados antes de entrar.',
    },
    {
      key: 'absorcao' as const,
      node: ecology,
      title: '2 · Micélio absorve nutrientes',
      detail: 'A rede de hifas aumenta a superfície de contato e leva moléculas pequenas ao fungo.',
    },
    {
      key: 'reproducao' as const,
      node: diversity,
      title: '3 · Estruturas liberam esporos',
      detail: 'O cogumelo é uma estrutura reprodutiva; o corpo vegetativo permanece espalhado no substrato.',
    },
  ];

  return (
    <section className="fungi-board vs-study-board" data-testid="visual-study-board" aria-label="Prancha ilustrada de fungos: micélio, hifas, digestão extracorpórea e esporos">
      <header className="fungi-board__head">
        <div>
          <span className="vs-board-kicker">Biologia · organismo em rede</span>
          <h2>O fungo começa onde você não vê.</h2>
          <p>O cogumelo é só a estrutura que espalha esporos. O organismo que se alimenta é o micélio no substrato.</p>
        </div>
        <div className="fungi-board__badge"><span>nutrição</span><strong>por absorção</strong></div>
      </header>

      <div className="fungi-board__scene" data-focus={focus} role="img" aria-label="Corte do solo com hifas formando um micélio, enzimas atuando no substrato, nutrientes sendo absorvidos e cogumelo liberando esporos">
        <svg viewBox="0 0 760 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <linearGradient id="fungi-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#dfe8df" /><stop offset="1" stopColor="#f5eee1" /></linearGradient>
            <linearGradient id="fungi-soil" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#79594a" /><stop offset="1" stopColor="#332a2a" /></linearGradient>
            <linearGradient id="fungi-cap" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c36a56" /><stop offset="1" stopColor="#6f2e3e" /></linearGradient>
            <filter id="fungi-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
          </defs>
          <rect className="fungi-board__sky" width="760" height="178" fill="url(#fungi-sky)" />
          <path className="fungi-board__ground" d="M0 167C110 153 166 180 260 164S424 148 525 167s158-9 235 2v251H0Z" fill="url(#fungi-soil)" />
          <path className="fungi-board__log" d="M28 211c76-32 156-16 226 11l-16 44c-78-20-139-19-213 4Z" />
          <g className="fungi-board__mushroom">
            <path d="M505 196c11-79 17-109 30-109s20 30 32 109Z" />
            <path className="fungi-board__cap" d="M457 113c18-54 114-62 152 1-15 19-134 20-152-1Z" fill="url(#fungi-cap)" />
            <path className="fungi-board__gills" d="M473 116c32 10 88 10 121-1M486 121c24 8 62 8 96-1" />
          </g>
          <g className="fungi-board__spores">
            {[[474,84],[493,62],[516,42],[546,64],[572,37],[593,88],[619,56]].map(([x,y], index) => <circle key={index} cx={x} cy={y} r="4" />)}
            <path d="M525 98C520 65 521 42 516 24" /><path d="M564 98c11-27 22-42 30-60" />
          </g>
          <g className="fungi-board__hyphae">
            <path d="M535 196c-4 36-38 37-65 58s-23 51-65 56-52 33-109 37" />
            <path d="M469 254c-44-5-77 15-91 50s-61 22-91 59" />
            <path d="M404 310c-37-30-85-23-111-52s-75-20-105-47" />
            <path d="M503 229c43 13 52 36 87 40s55 36 90 50" />
            <path d="M359 292c10 27-10 47-48 54s-40 30-64 51" />
            <path d="M348 308l-30-40M378 282l24-39M470 254l30 31M292 258l-46 14M590 269l15-34" />
          </g>
          <g className="fungi-board__enzymes">
            <circle cx="238" cy="286" r="9" /><circle cx="282" cy="315" r="7" /><circle cx="324" cy="276" r="8" />
            <path d="M250 275l-28-25M286 304l-11-29M332 268l25-26" />
          </g>
          <g className="fungi-board__nutrients">
            {[[218,330],[255,348],[302,331],[340,362],[386,335]].map(([x,y], index) => <circle key={index} cx={x} cy={y} r="5" />)}
            <path d="M218 330c33-11 55-20 83-29M302 331c26-12 48-25 71-40" />
          </g>
          <g className="fungi-board__labels">
            <text x="65" y="237">matéria orgânica</text>
            <text x="92" y="259">no substrato</text>
            <text x="135" y="313">enzimas</text>
            <text x="365" y="385">micélio = corpo do fungo</text>
            <text x="564" y="81">esporos</text>
            <text x="530" y="216">estrutura reprodutiva</text>
          </g>
        </svg>
        <p className="fungi-board__scene-caption"><strong>Substrato → moléculas simples → micélio → esporos</strong><span>Um fluxo de matéria, não uma coleção de nomes.</span></p>
      </div>

      <div className="fungi-board__steps" aria-label="Etapas do funcionamento dos fungos">
        {steps.map((step) => {
          const active = focus === step.key;
          const state = nodeState(states, step.node?.id);
          return (
            <button key={step.key} type="button" data-active={active || undefined} data-state={state} onClick={() => step.node && onSelect(step.node.id)}>
              <span className="fungi-board__step-state">{NODE_STATE_LABEL[state]}</span>
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </button>
          );
        })}
      </div>

      <footer className="fungi-board__closing"><strong>Pegadinha de prova:</strong> fungos não têm clorofila nem digestão interna; parede de quitina e reserva de glicogênio os aproximam mais dos animais do que das plantas.</footer>
    </section>
  );
}
