import React from 'react';

// Desenho estático, sem movimento próprio: mora fora de families/ porque o
// portão de movimento cobra motion/react de toda família, e quem o usa (a
// galeria de Geometria Molecular e os cartões de tipologia) já anima.

/** Desenho plano da geometria; também é o ícone da galeria no palco de Geometria Molecular. */
export function MolecularGlyph({ label }: { label: string }) {
  const atom = (x: number, y: number, key: string, central = false) => (
    <circle key={key} cx={x} cy={y} r={central ? 11 : 8} className={central ? 'tc-chem-atom tc-chem-atom--central' : 'tc-chem-atom'} />
  );
  const bond = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="tc-chem-bond" />
  );
  const center = atom(60, 42, 'c', true);

  if (label === 'Linear') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(20, 42, 100, 42, 'b')}{atom(18, 42, 'a')}{center}{atom(102, 42, 'd')}</svg>;
  if (label === 'Trigonal plana') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 60, 10, 'b1')}{bond(60, 42, 27, 67, 'b2')}{bond(60, 42, 93, 67, 'b3')}{atom(60, 9, 'a')}{center}{atom(25, 69, 'd')}{atom(95, 69, 'e')}</svg>;
  if (label === 'Tetraédrica') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 60, 9, 'b1')}{bond(60, 42, 24, 64, 'b2')}{bond(60, 42, 96, 64, 'b3')}<path d="M60 42 L91 20" className="tc-chem-bond tc-chem-bond--wedge" />{atom(60, 8, 'a')}{center}{atom(22, 66, 'd')}{atom(98, 66, 'e')}{atom(94, 18, 'f')}</svg>;
  if (label === 'Piramidal trigonal') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 38, 25, 67, 'b1')}{bond(60, 38, 95, 67, 'b2')}<path d="M60 38 L60 73" className="tc-chem-bond tc-chem-bond--wedge" /><circle cx="55" cy="13" r="2.7" className="tc-chem-pair" /><circle cx="65" cy="13" r="2.7" className="tc-chem-pair" />{center}{atom(23, 69, 'a')}{atom(97, 69, 'd')}{atom(60, 74, 'e')}</svg>;
  const water = label.includes('H2O');
  return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 25, 68, 'b1')}{bond(60, 42, 95, 68, 'b2')}{center}{atom(23, 70, 'a')}{atom(97, 70, 'd')}<circle cx="49" cy="17" r="2.7" className="tc-chem-pair" /><circle cx="56" cy="14" r="2.7" className="tc-chem-pair" />{water && <><circle cx="64" cy="14" r="2.7" className="tc-chem-pair" /><circle cx="71" cy="17" r="2.7" className="tc-chem-pair" /></>}</svg>;
}
