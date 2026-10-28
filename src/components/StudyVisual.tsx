import { parseStudyVisual, type StudyVisual as Visual } from '../lib/studyVisual';
import { figureInk } from '../lib/figureInk';
import { StudyMolecule } from './StudyMolecule';
import { StudyLineChart } from './StudyLineChart';
import { StudyGeometry } from './StudyGeometry';
import './StudyVisual.css';

const KICKER: Record<Visual['type'], string> = {
  flow: 'Esquema', bars: 'Gráfico', line: 'Gráfico', molecule: 'Estrutura', reaction: 'Reação', geometry: 'Figura',
};

/**
 * Seta de reação desenhada, com a mesma ponta das setas de ChemistryMechanisms.
 * Era um "↓" de texto, que herdava a fonte do parágrafo e não lia como seta
 * de reação ao lado das estruturas.
 */
function ReactionArrow({ condition }: { condition: string }) {
  return <div className="crivo-arrow">
    <span className="crivo-arrow__condition">{condition}</span>
    <svg viewBox="0 0 92 18" aria-hidden="true" className="crivo-arrow__horizontal">
      <path d="M2 9h84m-8-6 8 6-8 6" fill="none" stroke={figureInk.oxygen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {/* No celular a sequência desce: a seta precisa apontar para baixo, e
        girar a horizontal por CSS a deixava espremida na caixa de 18×52. */}
    <svg viewBox="0 0 18 52" aria-hidden="true" className="crivo-arrow__vertical">
      <path d="M9 2v46m-6-8 6 8 6-8" fill="none" stroke={figureInk.oxygen} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>;
}

function FlowArrow() {
  return <svg viewBox="0 0 18 26" aria-hidden="true" className="crivo-flow__arrow">
    <path d="M9 2v20m-5-6 5 6 5-6" fill="none" stroke={figureInk.oxygen} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

export function StudyVisual({ source }: { source: string }) {
  const visual = parseStudyVisual(source);
  if (!visual) return <p role="status">A representação visual não está disponível neste trecho. Confira o mecanismo na explicação.</p>;
  const max = visual.type === 'bars' ? (Math.max(...visual.data.map(item => item.value)) || 1) : 1;
  return <figure data-study-visual={visual.type} className="crivo-figure">
    <figcaption className="crivo-figure__head">
      <span className="crivo-figure__kicker">{KICKER[visual.type]}</span>
      <span className="crivo-figure__title">{visual.title}</span>
    </figcaption>
    <div className="crivo-figure__body">
      {visual.type === 'molecule' ? <StudyMolecule molecule={visual.molecule} />
      : visual.type === 'reaction' ? <ol aria-label={visual.title} className="crivo-reaction">
        {visual.molecules.map((molecule, index) => <li key={index} className="crivo-reaction__step">
          {index > 0 && <ReactionArrow condition={visual.conditions[index - 1]} />}
          <StudyMolecule molecule={molecule} />
        </li>)}
      </ol>
      : visual.type === 'geometry' ? <StudyGeometry visual={visual} />
      : visual.type === 'line' ? <StudyLineChart visual={visual} />
      : visual.type === 'flow' ? <ol aria-label={visual.title} className="crivo-flow">
        {visual.steps.map((step, index) => <li key={index} className="crivo-flow__item">
          {index > 0 && <FlowArrow />}
          <div className="crivo-flow__step">{step}</div>
        </li>)}
      </ol>
      : <div className="crivo-bars">
        <p className="crivo-figure__caption" style={{ margin: 0 }}>Unidade: {visual.unit}</p>
        {visual.data.map((item, index) => <div key={index} className="crivo-bars__row">
          <div className="crivo-bars__label"><span>{item.label}</span><b>{item.value.toLocaleString('pt-BR')} {visual.unit}</b></div>
          <svg aria-hidden="true" viewBox="0 0 400 12" preserveAspectRatio="none" className="crivo-bars__track">
            <rect width="400" height="12" rx="2" fill={figureInk.line} />
            <rect width={400 * (item.value / max)} height="12" rx="2" fill={figureInk.ink} />
          </svg>
        </div>)}
      </div>}
    </div>
    <div className="crivo-figure__foot">
      <p className="crivo-figure__caption">{visual.caption}</p>
      <p className="crivo-figure__question"><b>Interprete:</b> {visual.question}</p>
    </div>
  </figure>;
}
