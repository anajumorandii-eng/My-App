import { useEffect, useRef, useState, useId } from 'react';
import type { StudyMolecule as Molecule } from '../lib/studyVisual';
import { drawStudyMolecule } from '../lib/drawStudyMolecule';

/** Chemical connectivity is laid out locally; no image URLs or generated markup. */
export function StudyMolecule({ molecule }: { molecule: Molecule }) {
  const ref = useRef<SVGSVGElement>(null);
  const id = 'molecule-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [state, setState] = useState<'pending'|'ready'|'error'>('pending');
  useEffect(() => {
    let current = true;
    setState('pending');
    const svg=ref.current;
    if(svg) void drawStudyMolecule(svg,molecule.smiles,molecule.label)
      .then(()=>{if(current)setState('ready');})
      .catch(()=>{if(current)setState('error');});
    return () => { current = false; };
  }, [molecule.smiles, molecule.label]);
  // O nome vem embaixo, em itálico, como legenda de estrutura no livro; em
  // cima, em negrito, competia com o título da figura.
  return <div data-study-molecule className="crivo-molecule">
    <svg ref={ref} id={id} aria-label={`Estrutura de ${molecule.label}`} role="img" className="crivo-molecule__drawing" style={state==='error'?{display:'none'}:undefined} />
    {state==='pending' && <p data-ai-text-pending role="status" className="crivo-molecule__status">Preparando estrutura química…</p>}
    {state==='error' && <p role="status" className="crivo-molecule__status">Não foi possível desenhar esta estrutura. Confira a fórmula e a explicação no texto.</p>}
    <p className="crivo-molecule__name">{molecule.label}</p>
  </div>;
}
