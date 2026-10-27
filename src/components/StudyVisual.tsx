import { parseStudyVisual } from '../lib/studyVisual';
import { StudyMolecule } from './StudyMolecule';
import { StudyLineChart } from './StudyLineChart';

export function StudyVisual({ source }: { source: string }) {
  const visual = parseStudyVisual(source);
  if (!visual) return <p role="status">A representação visual não está disponível neste trecho. Confira o mecanismo na explicação.</p>;
  const max = visual.type === 'bars' ? (Math.max(...visual.data.map(item => item.value)) || 1) : 1;
  return <figure data-study-visual={visual.type} style={{ margin: '16px 0', padding: '16px', border: '1px solid var(--line, #b8c5bf)', borderRadius: '8px', whiteSpace: 'normal', fontFamily: 'inherit', fontSize: 'inherit' }}>
    <figcaption style={{ fontWeight: 700, marginBottom: '12px' }}>{visual.title}</figcaption>
    {visual.type === 'molecule' ? <StudyMolecule molecule={visual.molecule} /> : visual.type === 'reaction' ? <ol aria-label={visual.title} style={{listStyle:'none',padding:0,margin:0}}>
      {visual.molecules.map((molecule,index)=><li key={index} style={{breakInside:'avoid'}}>
        {index>0 && <div style={{textAlign:'center',padding:'8px',overflowWrap:'anywhere'}}><span aria-hidden="true">↓ </span><span>{visual.conditions[index-1]}</span></div>}
        <StudyMolecule molecule={molecule} />
      </li>)}
    </ol> : visual.type === 'line' ? <StudyLineChart visual={visual} /> : visual.type === 'flow' ? <ol aria-label={visual.title} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {visual.steps.map((step, index) => <li key={index} style={{ textAlign: 'center', breakInside: 'avoid' }}>
        {index > 0 && <div aria-hidden="true" style={{ padding: '3px' }}>↓</div>}
        <div style={{ border: '1px solid var(--line, #b8c5bf)', borderRadius: '6px', padding: '8px', overflowWrap: 'anywhere' }}>{step}</div>
      </li>)}
    </ol> : <div>
      <p>Unidade: {visual.unit}</p>
      {visual.data.map((item, index) => <div key={index} style={{ margin: '10px 0', breakInside: 'avoid' }}>
        <div style={{ overflowWrap: 'anywhere' }}>{item.label}: <b>{item.value.toLocaleString('pt-BR')} {visual.unit}</b></div>
        <svg aria-hidden="true" viewBox="0 0 400 16" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '16px' }}>
          <rect width="400" height="16" fill="#edf1ee" />
          <rect width={400 * (item.value / max)} height="16" fill="#315d50" />
        </svg>
      </div>)}
    </div>}
    <p style={{ marginTop: '12px' }}>{visual.caption}</p>
    <p><b>Interprete:</b> {visual.question}</p>
  </figure>;
}
