import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import PhotosynthesisMechanism from './PhotosynthesisMechanism';

export default function PhotosynthesisBoard(props: BoardProps) {
  const par = boardPair(props);
  return <BoardShell
    title="Fotossíntese e quimiossíntese"
    subtitle="A fonte de energia muda. O carbono pode vir do CO₂."
    condition={{ label: 'compare', value: 'energia' }}
    ariaLabel="Prancha de fotossíntese e quimiossíntese: energia e fixação de carbono"
    scene={<PhotosynthesisMechanism />}
    sceneFirst
    emphasis={par.emphasis}
    left={{ label: 'Fotossíntese', headline: 'Luz sustenta a produção de matéria orgânica.', detail: 'Na fotossíntese oxigênica, as reações fotoquímicas liberam O₂ da água e produzem ATP e NADPH. O ciclo de Calvin fixa CO₂.', formula: 'luz → ATP e NADPH → fixação de CO₂' }}
    right={{ label: 'Quimiossíntese', headline: 'Oxidação inorgânica fornece energia.', detail: 'Certos procariontes usam a energia da oxidação de substâncias inorgânicas para sustentar a fixação de carbono, sem depender de luz.', formula: 'oxidação inorgânica → energia → fixação de CO₂' }}
    leftState={par.leftState} rightState={par.rightState}
    leftSelected={par.leftSelected} rightSelected={par.rightSelected}
    onSelectLeft={par.selectLeft} onSelectRight={par.selectRight}
    supports={<>
      <section className="vs-formula-note"><span className="vs-note-title">Não confunda</span><strong>O₂ vem da água</strong><p>O CO₂ fornece carbono para a matéria orgânica. O oxigênio liberado na fotossíntese oxigênica vem da água.</p></section>
      <section className="vs-formula-note"><span className="vs-note-title">Processos simultâneos</span><strong>A planta também respira</strong><p>A respiração ocorre de dia e de noite. Estar sob luz não garante saldo positivo: a taxa fotossintética depende da intensidade luminosa e de outros fatores limitantes.</p></section>
    </>}
    closing="separe a origem da energia da origem do carbono; produzir matéria orgânica não exige sempre a mesma fonte de energia."
  />;
}
