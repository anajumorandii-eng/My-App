import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Árvore de possibilidades com os mesmos elementos contados de dois jeitos.
 *
 * O erro do tema não é a fórmula, é escolher entre arranjo e combinação. A
 * pergunta que decide é uma só: trocar a ordem gera um caso diferente? Com três
 * elementos tomados dois a dois, a árvore mostra os seis pares ordenados — e
 * riscar os que são o mesmo conjunto deixa três. A cena rabisca exatamente
 * esses, para que a divisão por 2! deixe de ser um passo mecânico e vire o que
 * ela é: descontar as repetições que a ordem criou.
 */
function CountingScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const combinacao = emphasis === 'direita';
  const letras = ['A', 'B', 'C'];

  // Os seis pares ordenados. Em combinação, metade é duplicata do outro par.
  const pares: Array<[string, string]> = [];
  for (const a of letras) for (const b of letras) if (a !== b) pares.push([a, b]);

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={combinacao
        ? 'Seis pares ordenados de três elementos, com metade riscada por serem o mesmo conjunto: restam três combinações'
        : 'Árvore com os seis arranjos possíveis de três elementos tomados dois a dois'}>
      {/* Primeira escolha: três ramos. */}
      {letras.map((l, i) => {
        const x = 62 + i * 98;
        return (
          <g key={l} className="vs-count-node">
            <circle cx={x} cy={72} r="17" />
            <text x={x} y={78} textAnchor="middle">{l}</text>
            <path className="vs-count-edge" d={`M160 34 L${x} 55`} />
          </g>
        );
      })}
      <circle className="vs-count-root" cx="160" cy="26" r="9" />

      {/* Segunda escolha: dois ramos por nó, seis folhas. */}
      {pares.map(([a, b], i) => {
        const paiX = 62 + letras.indexOf(a) * 98;
        const x = 44 + i * 46;
        // Um par é duplicata quando o seu invertido já apareceu antes.
        const duplicado = combinacao && letras.indexOf(b) < letras.indexOf(a);
        return (
          <g key={`${a}${b}`} className="vs-count-leaf" data-riscado={duplicado ? 'true' : undefined}>
            <path className="vs-count-edge" d={`M${paiX} 89 L${x} 150`} />
            <rect x={x - 21} y={150} width="42" height="30" rx="6" />
            <text x={x} y={170} textAnchor="middle">{a}{b}</text>
            {duplicado && <path className="vs-count-strike" d={`M${x - 22} 182 L${x + 22} 148`} />}
          </g>
        );
      })}

      {/* Sem a anotação, os riscos parecem correção; com ela, ficam sendo o que
          são: a contagem das cópias que a ordem criou. */}
      {combinacao && <SceneNote text="riscados: mesmo conjunto" at={[66, 165]} to={[150, 206]} align="middle" />}
      {!combinacao && <SceneNote text="3 escolhas, depois 2" at={[160, 40]} to={[236, 24]} align="start" />}

      <text className="vs-count-total" x="160" y="222" textAnchor="middle">
        {combinacao ? '6 ÷ 2! = 3 combinações' : '3 × 2 = 6 arranjos'}
      </text>

      <text className="vs-scene-caption" x="160" y="264" textAnchor="middle">
        {combinacao ? 'AB e BA são o mesmo conjunto' : 'AB e BA são casos diferentes'}
      </text>
      <text className="vs-scene-caption" x="160" y="286" textAnchor="middle">a ordem importa?</text>
    </svg>
  );
}

export default function CountingBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Arranjo ou combinação"
      subtitle="Uma pergunta decide tudo: trocar a ordem gera um caso novo?"
      condition={{ label: 'exemplo', value: 'C(3,2)' }}
      ariaLabel="Prancha ilustrada de análise combinatória"
      scene={<CountingScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'ordem importa ↑', down: '↓ ordem não importa' }}
      emphasis={par.emphasis}
      left={{
        label: 'Arranjo',
        headline: 'A ordem cria casos diferentes.',
        detail: 'Senha, pódio, ordem de chegada. Trocar a posição dos mesmos elementos produz outro resultado, e todos contam.',
        formula: 'A(n,p) = n! / (n−p)!',
      }}
      right={{
        label: 'Combinação',
        headline: 'A ordem não muda nada.',
        detail: 'Comissão, sorteio, escolha de equipe. Os mesmos elementos em outra ordem são o mesmo caso — por isso divide-se por p!.',
        formula: 'C(n,p) = n! / p!(n−p)!',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'A relação', general: 'C(n,p)', condition: 'é', reduced: 'A(n,p) ÷ p!' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">De onde vem o p!</span>
            <strong>É o desconto das repetições</strong>
            <p>Cada conjunto de p elementos aparece p! vezes entre os arranjos, uma para cada ordem possível. Dividir por p! apaga exatamente essas cópias.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">O teste rápido</span>
            <strong>Inverta dois elementos</strong>
            <p>Se o resultado passa a ser outro (1º e 2º lugar), é arranjo. Se continua sendo o mesmo (dois membros de uma comissão), é combinação.</p>
          </section>
        </>
      }
      closing="a fórmula vem depois: quem responde primeiro se a ordem importa já escolheu o caminho certo."
    />
  );
}
