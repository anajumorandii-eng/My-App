import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Hemácia com antígenos e plasma com anticorpos, lado a lado.
 *
 * A tabela de quem doa para quem é decorada e esquecida. Ela sai sozinha de uma
 * regra: a hemácia carrega antígeno, o plasma carrega o anticorpo contra o
 * antígeno que a pessoa NÃO tem. Doar é mandar hemácia; receber é expor essa
 * hemácia aos anticorpos de quem recebe. O tipo O não tem antígeno, então
 * nenhuma hemácia é atacada — doador universal. O AB não tem anticorpo, então
 * aceita qualquer hemácia — receptor universal. A cena mostra os dois lados
 * para que a regra seja lida, não memorizada.
 */
function BloodScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const foco = emphasis === 'esquerda' ? 'doador' : emphasis === 'direita' ? 'receptor' : 'nenhum';
  const tipo = foco === 'receptor' ? 'AB' : 'O';

  const antigenos = tipo === 'AB' ? ['A', 'B'] : [];
  const anticorpos = tipo === 'AB' ? [] : ['anti-A', 'anti-B'];

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={`Tipo sanguíneo ${tipo}: hemácia com ${antigenos.length} antígenos e plasma com ${anticorpos.length} anticorpos`}>
      <text className="vs-blood-type" x="160" y="46" textAnchor="middle">tipo {tipo}</text>

      {/* Hemácia: o que a pessoa doa. */}
      <g className="vs-rbc">
        <ellipse cx="96" cy="130" rx="52" ry="40" />
        <ellipse className="vs-rbc-dimple" cx="96" cy="130" rx="22" ry="15" />
        {antigenos.map((a, i) => (
          <g key={a} className="vs-antigen">
            <line x1={96 + (i ? 34 : -34)} y1={i ? 104 : 156} x2={96 + (i ? 48 : -48)} y2={i ? 88 : 172} />
            <circle cx={96 + (i ? 50 : -50)} cy={i ? 84 : 176} r="9" />
            <text x={96 + (i ? 50 : -50)} y={i ? 88 : 180} textAnchor="middle">{a}</text>
          </g>
        ))}
        <text className="vs-part-label" x="96" y="204" textAnchor="middle">hemácia</text>
        <text className="vs-part-sub" x="96" y="218" textAnchor="middle">
          {antigenos.length ? `antígenos ${antigenos.join(' e ')}` : 'sem antígeno'}
        </text>
      </g>

      {/* Plasma: o que ataca a hemácia que chega. */}
      <g className="vs-plasma">
        <rect x="182" y="90" width="112" height="82" rx="14" />
        {anticorpos.map((a, i) => (
          <g key={a} className="vs-antibody">
            <path d={`M${206 + i * 48} ${118 + i * 24} l 10 -12 l 10 12 l -10 6 z`} />
            <text x={216 + i * 48} y={142 + i * 24} textAnchor="middle">{a}</text>
          </g>
        ))}
        {!anticorpos.length && <text className="vs-plasma-empty" x="238" y="136" textAnchor="middle">sem anticorpo</text>}
        <text className="vs-part-label" x="238" y="204" textAnchor="middle">plasma</text>
        <text className="vs-part-sub" x="238" y="218" textAnchor="middle">
          {anticorpos.length ? 'ataca A e B' : 'não ataca nada'}
        </text>
      </g>

      <text className="vs-scene-caption" x="160" y="262" textAnchor="middle">
        {tipo === 'AB' ? 'sem anticorpo → aceita qualquer hemácia' : 'sem antígeno → nenhuma hemácia é atacada'}
      </text>
      <text className="vs-scene-caption" x="160" y="284" textAnchor="middle">
        {tipo === 'AB' ? 'receptor universal' : 'doador universal'}
      </text>
      <text className="vs-scene-caption" x="160" y="310" textAnchor="middle">o anticorpo é contra o antígeno que falta</text>
    </svg>
  );
}

export default function BloodTypeBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Sistema ABO"
      subtitle="A tabela de doação sai de uma regra só."
      condition={{ label: 'anticorpo', value: 'anti-X' }}
      ariaLabel="Prancha ilustrada do sistema ABO: antígenos na hemácia e anticorpos no plasma"
      scene={<BloodScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'doador ↑', down: '↓ receptor' }}
      emphasis={par.emphasis}
      left={{
        label: 'Doador universal · O',
        headline: 'Hemácia sem antígeno.',
        detail: 'Sem A nem B na superfície, não há o que os anticorpos de quem recebe reconheçam. A hemácia passa em qualquer plasma.',
        formula: 'O → A, B, AB, O',
      }}
      right={{
        label: 'Receptor universal · AB',
        headline: 'Plasma sem anticorpo.',
        detail: 'Tendo os dois antígenos, não produz anti-A nem anti-B. Nenhuma hemácia que chegue será atacada.',
        formula: 'A, B, AB, O → AB',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'A regra', general: 'antígeno na hemácia', condition: 'anticorpo', reduced: 'contra o que falta' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que decorar a tabela falha</span>
            <strong>São 16 combinações</strong>
            <p>A regra é uma só e gera todas: quem doa manda antígeno, quem recebe tem anticorpo contra o que não possui. Compatível é quando os dois não se encontram.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">O fator Rh é separado</span>
            <strong>Anti-Rh não é natural</strong>
            <p>Diferente do ABO, o Rh− só produz anti-Rh depois de um primeiro contato. É isso que torna a segunda gestação o caso de risco na eritroblastose.</p>
          </section>
        </>
      }
      closing="quem lê a hemácia e o plasma separadamente monta a tabela de compatibilidade inteira sem ter decorado uma linha dela."
    />
  );
}
