import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

function ImmunityScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const vaccine = emphasis !== 'direita';
  return <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
    aria-label={vaccine ? 'Vacina apresenta antígeno, ativa linfócitos, produz anticorpos e células de memória' : 'Soro fornece anticorpos prontos, com ação imediata e sem memória imunológica'}>
    <text x="160" y="38" textAnchor="middle" className="vs-blood-type">{vaccine ? 'VACINA · imunização ativa' : 'SORO · imunização passiva'}</text>
    {vaccine ? <>
      <circle cx="54" cy="126" r="25" className="vs-rbc"/><text x="54" y="131" textAnchor="middle" className="vs-part-label">Ag</text>
      <path d="M82 126H126M120 120l8 6-8 6" className="mf-axis"/>
      <circle cx="158" cy="126" r="27" className="vs-plasma"/><text x="158" y="131" textAnchor="middle" className="vs-part-label">linfócito</text>
      <path d="M188 126H228M222 120l8 6-8 6" className="mf-axis"/>
      <g className="vs-antibody"><path d="M249 110l10-12 10 12-10 7zM249 145l10-12 10 12-10 7z"/></g>
      <text x="259" y="178" textAnchor="middle" className="vs-part-sub">anticorpos próprios</text>
      <circle cx="160" cy="226" r="24" className="vs-rbc-dimple"/><text x="160" y="231" textAnchor="middle" className="vs-part-label">memória</text>
      <path d="M160 155v43M154 192l6 8 6-8" className="mf-axis"/>
      <text x="160" y="282" textAnchor="middle" className="vs-scene-caption">resposta lenta no início · proteção duradoura</text>
    </> : <>
      <rect x="34" y="94" width="96" height="72" rx="14" className="vs-plasma"/><text x="82" y="126" textAnchor="middle" className="vs-part-label">anticorpos</text><text x="82" y="145" textAnchor="middle" className="vs-part-sub">prontos</text>
      <path d="M139 130H188M182 124l8 6-8 6" className="mf-axis"/>
      <circle cx="232" cy="130" r="37" className="vs-rbc"/><text x="232" y="126" textAnchor="middle" className="vs-part-label">neutralização</text><text x="232" y="145" textAnchor="middle" className="vs-part-sub">imediata</text>
      <path d="M76 212H244" stroke="var(--mf-red)" strokeWidth="3" strokeDasharray="6 5"/><text x="160" y="240" textAnchor="middle" className="vs-part-label">sem expansão clonal · sem memória</text>
      <text x="160" y="282" textAnchor="middle" className="vs-scene-caption">efeito rápido · proteção temporária</text>
    </>}
  </svg>;
}

export default function BloodTypeBoard(props: BoardProps) {
  const par = boardPair(props);
  return <BoardShell
    title="Imunidade adaptativa"
    subtitle="Vacina ensina o organismo; soro entrega o produto pronto."
    condition={{ label: 'diferença-chave', value: 'memória' }}
    ariaLabel="Prancha comparativa de vacina e soro na resposta imune"
    scene={<ImmunityScene emphasis={par.emphasis} />}
    sceneNotes={{ up: 'antígeno ↑', down: '↓ anticorpo pronto' }} emphasis={par.emphasis}
    left={{ label: 'Vacina · ativa', headline: 'O organismo fabrica a resposta.', detail: 'Antígenos seguros ativam clones específicos. Plasmócitos produzem anticorpos e parte dos linfócitos permanece como memória.', formula: 'antígeno → seleção clonal → memória' }}
    right={{ label: 'Soro · passiva', headline: 'O anticorpo já chega pronto.', detail: 'A neutralização é imediata e útil após uma exposição urgente, mas os anticorpos caem com o tempo e não deixam células de memória.', formula: 'anticorpo pronto → ação imediata' }}
    leftState={par.leftState} rightState={par.rightState} leftSelected={par.leftSelected} rightSelected={par.rightSelected} onSelectLeft={par.selectLeft} onSelectRight={par.selectRight}
    equation={{ label: 'Resposta secundária', general: 'células de memória', condition: 'novo contato', reduced: 'mais rápida e intensa' }}
    supports={<><section className="vs-formula-note"><span className="vs-note-title">Antes da especificidade</span><strong>Imunidade inata</strong><p>Barreiras, inflamação e fagócitos respondem rapidamente e reconhecem padrões gerais; não substituem a especificidade nem a memória adaptativa.</p></section><section className="vs-formula-note"><span className="vs-note-title">No sangue</span><strong>Leucócitos defendem</strong><p>Hemácias transportam gases e plaquetas participam da coagulação. Anticorpos são proteínas do plasma produzidas por plasmócitos, não funções das hemácias.</p></section></>}
    closing="vacina demora porque constrói clones e memória; soro age depressa porque traz anticorpos, mas essa proteção desaparece sem memória imunológica."
  />;
}
