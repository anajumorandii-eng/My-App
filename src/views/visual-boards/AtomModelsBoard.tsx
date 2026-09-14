import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Os modelos atômicos lado a lado, cada um com o experimento que o derrubou.
 *
 * A sequência Dalton → Thomson → Rutherford → Bohr costuma ser decorada como
 * lista de nomes. O que a torna inteligível é que cada modelo caiu por um
 * experimento específico, e o seguinte nasceu para explicar exatamente o que o
 * anterior não explicava. Por isso a cena mostra o modelo junto do achado que o
 * substituiu, em vez de quatro desenhos soltos em ordem cronológica.
 */
function AtomScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  // Rutherford (núcleo denso) ou Bohr (níveis quantizados): o salto entre os
  // dois é onde a ideia de órbita ganha energia definida.
  const bohr = emphasis === 'direita';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={bohr
        ? 'Modelo de Bohr com níveis de energia definidos e o salto do elétron emitindo luz'
        : 'Modelo de Rutherford com núcleo denso e partículas alfa desviadas'}>
      {/* Núcleo: pequeno e denso, o achado de Rutherford. */}
      <circle className="vs-nucleus" cx="160" cy="150" r="15" />
      <text className="vs-nucleus-label" x="160" y="155" textAnchor="middle">+</text>

      {/* Camadas eletrônicas. Em Bohr elas ganham rótulo de energia. */}
      {[52, 84, 114].map((r, i) => (
        <circle key={i} className={`vs-shell${bohr ? ' vs-shell--quantized' : ''}`} cx="160" cy="150" r={r} />
      ))}

      {bohr ? (
        <g className="vs-bohr">
          {/* Salto entre níveis: a diferença de energia vira fóton. */}
          <circle className="vs-electron" cx="160" cy="98" r="6.5" />
          <circle className="vs-electron vs-electron--ghost" cx="160" cy="36" r="6.5" />
          <path className="vs-jump" d="M160 92 L160 44" />
          <path className="vs-arrow" d="M160 44 l-5 10 l10 0 z" />
          <text className="vs-level" x="176" y="102">n=1</text>
          <text className="vs-level" x="176" y="42">n=3</text>
          <path className="vs-photon" d="M196 60 q 8 -8, 16 0 q 8 8, 16 0 q 8 -8, 16 0" />
          <text className="vs-photon-label" x="252" y="46">hν</text>
        </g>
      ) : (
        <g className="vs-rutherford">
          {/* Alfa que passa direto: o átomo é quase todo vazio. */}
          <path className="vs-alpha" d="M18 214 L302 214" />
          <path className="vs-arrow" d="M302 214 l-11 -5 l0 10 z" />
          {/* Alfa que desvia: existe algo pequeno, denso e positivo. */}
          <path className="vs-alpha vs-alpha--deflected" d="M18 168 L138 156 C 152 152, 158 140, 150 120 L128 74" />
          <path className="vs-arrow" d="M128 74 l0 12 l10 -5 z" />
          <text className="vs-alpha-label" x="52" y="200">α</text>
          <text className="vs-scene-caption" x="160" y="238" textAnchor="middle">quase tudo passa · pouquíssimas desviam</text>
        </g>
      )}

      <text className="vs-scene-caption" x="160" y={bohr ? 268 : 262} textAnchor="middle">
        {bohr ? 'a órbita tem energia definida · o salto emite luz' : 'a carga positiva está concentrada no núcleo'}
      </text>
      <text className="vs-scene-caption" x="160" y={bohr ? 288 : 282} textAnchor="middle">
        {bohr ? 'espectro de linhas, não contínuo' : 'o resto do átomo é vazio'}
      </text>
    </svg>
  );
}

export default function AtomModelsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Modelos atômicos"
      subtitle="Cada modelo caiu por um experimento — e o seguinte nasceu dele."
      condition={{ label: 'critério', value: 'evidência' }}
      ariaLabel="Prancha ilustrada da evolução dos modelos atômicos"
      scene={<AtomScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'Rutherford ↑', down: '↓ Bohr' }}
      emphasis={par.emphasis}
      left={{
        label: 'Rutherford',
        headline: 'O átomo é quase todo vazio.',
        detail: 'A folha de ouro deixou quase toda partícula alfa passar, e desviou pouquíssimas. Logo, a carga positiva está concentrada num núcleo minúsculo.',
        formula: 'núcleo denso + eletrosfera vazia',
      }}
      right={{
        label: 'Bohr',
        headline: 'As órbitas têm energia definida.',
        detail: 'O modelo anterior previa que o elétron espiralaria até o núcleo. Bohr quantizou os níveis: o elétron só ocupa órbitas específicas e salta entre elas.',
        formula: 'ΔE = h · ν',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'O que Bohr explica', general: 'espectro de linhas', condition: 'e não', reduced: 'espectro contínuo' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">A pergunta de cada modelo</span>
            <strong>Dalton → Thomson</strong>
            <strong>Thomson → Rutherford</strong>
            <p>Raios catódicos mostraram que o átomo tem parte negativa; a folha de ouro mostrou que a positiva está concentrada, não espalhada no pudim.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que o salto emite luz</span>
            <strong>Cor = diferença de energia</strong>
            <p>A energia perdida no salto sai como fóton de frequência exata. Por isso cada elemento tem um espectro próprio — é a assinatura dos seus níveis.</p>
          </section>
        </>
      }
      closing="a sequência dos modelos não é cronologia a decorar: cada um responde ao experimento que derrubou o anterior."
    />
  );
}
