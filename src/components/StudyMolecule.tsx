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
  return <div data-study-molecule style={{breakInside:'avoid',minWidth:0}}>
    <p style={{fontWeight:600,margin:'8px 0',overflowWrap:'anywhere'}}>{molecule.label}</p>
    <div style={{background:'#fff',borderRadius:6,color:'#172b24',maxWidth:440,margin:'0 auto'}}>
      <svg ref={ref} id={id} aria-label={`Estrutura de ${molecule.label}`} role="img" style={{display:state==='error'?'none':'block',width:'100%',height:220}} />
    </div>
    {state==='pending' && <p data-ai-text-pending role="status">Preparando estrutura química…</p>}
    {state==='error' && <p role="status">Não foi possível desenhar esta estrutura. Confira a fórmula e a explicação no texto.</p>}
  </div>;
}
