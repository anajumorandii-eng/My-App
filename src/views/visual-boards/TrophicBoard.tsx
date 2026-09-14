import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Pirâmide de energia com os 10% que passam e os 90% que se perdem.
 *
 * A cadeia costuma ser desenhada como setas iguais entre níveis, o que sugere
 * que a energia circula. Ela não circula: entra pelo sol, atravessa os níveis
 * perdendo cerca de 90% em cada passagem, e sai como calor. É essa perda que
 * explica por que cadeias raramente passam de quatro ou cinco níveis e por que
 * a base tem que ser larga — e é o que a pirâmide mostra e a corrente de setas
 * esconde. A matéria cicla; a energia, não.
 */
function TrophicScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const focoPerda = emphasis === 'direita';

  const niveis = [
    { nome: 'produtores', energia: 10000, y: 224 },
    { nome: '1º consumidor', energia: 1000, y: 178 },
    { nome: '2º consumidor', energia: 100, y: 132 },
    { nome: '3º consumidor', energia: 10, y: 86 },
  ];
  const larguraMax = 232;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Pirâmide de energia com quatro níveis tróficos: cada nível recebe cerca de dez por cento do anterior e o resto se perde como calor">
      {niveis.map((n, i) => {
        const larg = larguraMax * (0.26 + 0.74 * (3 - i) / 3);
        const x = 160 - larg / 2;
        return (
          <g key={n.nome} className="vs-trophic-level" data-nivel={i}>
            <rect x={x} y={n.y} width={larg} height="38" rx="5" />
            <text className="vs-trophic-energy" x="160" y={n.y + 18} textAnchor="middle">{n.energia.toLocaleString('pt-BR')} kcal</text>
            <text className="vs-trophic-name" x="160" y={n.y + 31} textAnchor="middle">{n.nome}</text>
          </g>
        );
      })}

      {/* Perda como calor: é para onde vão os 90% que não sobem. */}
      {focoPerda && niveis.slice(0, 3).map((n, i) => (
        <g key={`p${i}`} className="vs-heat-loss">
          <path d={`M${160 + (larguraMax * (0.26 + 0.74 * (3 - i) / 3)) / 2 + 6} ${n.y + 19} l 30 0`} />
          <path className="vs-arrow" d={`M${160 + (larguraMax * (0.26 + 0.74 * (3 - i) / 3)) / 2 + 36} ${n.y + 19} l -10 -5 l 0 10 z`} />
        </g>
      ))}
      {focoPerda && <text className="vs-heat-label" x="292" y="160" textAnchor="middle">calor</text>}

      {/* Sol: a energia entra uma vez e não retorna. */}
      <g className="vs-sun">
        <circle cx="34" cy="42" r="13" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (-30 + i * 24) * (Math.PI / 180);
          return <line key={i} x1={34 + Math.cos(a) * 18} y1={42 + Math.sin(a) * 18} x2={34 + Math.cos(a) * 25} y2={42 + Math.sin(a) * 25} />;
        })}
        <path className="vs-light-ray" d="M50 56 L82 214" />
      </g>

      <text className="vs-scene-caption" x="160" y="286" textAnchor="middle">×10% a cada nível · o resto vira calor</text>
      <text className="vs-scene-caption" x="160" y="306" textAnchor="middle">a matéria cicla · a energia não</text>
    </svg>
  );
}

export default function TrophicBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Fluxo de energia"
      subtitle="A matéria cicla. A energia atravessa uma vez e sai como calor."
      condition={{ label: 'por nível', value: '~10%' }}
      ariaLabel="Prancha ilustrada de ecologia: níveis tróficos e fluxo de energia"
      scene={<TrophicScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'o que sobe ↑', down: '↓ o que se perde' }}
      emphasis={par.emphasis}
      left={{
        label: 'Transferência',
        headline: 'Cerca de 10% passa adiante.',
        detail: 'Só a fração incorporada como biomassa fica disponível para o nível seguinte. O número varia, mas a ordem de grandeza é essa.',
        formula: 'Enível+1 ≈ 0,1 · Enível',
      }}
      right={{
        label: 'Perda',
        headline: 'O resto vira calor.',
        detail: 'Respiração, movimento e excreção dissipam a maior parte. Essa energia não volta ao sistema — por isso a base precisa ser larga.',
        formula: '~90% dissipado por nível',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Por que a cadeia é curta', general: '10⁴ → 10¹ kcal', condition: 'em 4 níveis', reduced: 'sobra pouco' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Ciclo e fluxo</span>
            <strong>Não são a mesma coisa</strong>
            <p>Carbono, nitrogênio e água ciclam: voltam ao início. A energia não — ela entra pelo sol e sai como calor, o que torna o fluxo unidirecional.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Pirâmide invertida</span>
            <strong>Energia nunca inverte</strong>
            <p>A de número e a de biomassa podem inverter (uma árvore sustenta milhares de insetos). A de energia não pode: violaria a termodinâmica.</p>
          </section>
        </>
      }
      closing="a pirâmide não é um gráfico decorativo: a largura de cada degrau é a energia que sobrou do degrau de baixo."
    />
  );
}
