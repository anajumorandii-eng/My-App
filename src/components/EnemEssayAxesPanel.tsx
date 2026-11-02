import { enemEssayAxes, enemEssayPattern, enemEssayThemes, enemEssayTimedPlan, enemEssayWildcards } from '../data/enemEssay2026';

export function EnemEssayAxesPanel({ onPractice }: { onPractice: (theme: string) => void }) {
  return <div className="space-y-4">
    <section aria-labelledby="enem-essay-history" className="ni-panel p-5 space-y-3">
      <h2 id="enem-essay-history" className="font-display text-xl">Redação do ENEM 2026: o que os temas mostram</h2>
      <p className="text-sm text-[var(--dim)]">O tema é sigiloso e não se prevê por frequência. O que se treina é o padrão: recorte brasileiro, grupo ou direito pouco reconhecido, obstáculos concretos e intervenção.</p>
      <ol className="space-y-1 text-sm">{[...enemEssayThemes].reverse().map(item => <li key={item.year}><b>{item.year}</b> · {item.theme} <span className="text-xs text-[var(--dim)]">({item.group})</span></li>)}</ol>
      <ul className="list-disc pl-5 space-y-1 text-sm">{enemEssayPattern.map(line => <li key={line}>{line}</li>)}</ul>
    </section>
    <section aria-labelledby="enem-essay-axes" className="space-y-3">
      <h2 id="enem-essay-axes" className="font-display text-lg">Eixos para treinar, do mais ao menos provável</h2>
      {enemEssayAxes.map((axis, index) => <details key={axis.id} className="ni-panel p-4" open={index === 0 ? true : undefined}>
        <summary className="cursor-pointer"><b>{index + 1}. {axis.title}</b><span className="block text-sm text-[var(--dim)]">{axis.why}</span></summary>
        <div className="mt-3 space-y-2 text-sm">
          <p><b>Recortes possíveis:</b> {axis.angles.join(' · ')}</p>
          <p className="font-semibold">Repertório verificável</p>
          <ul className="list-disc pl-5 space-y-1">{axis.repertoire.map(item => <li key={item}>{item}</li>)}</ul>
          <p><b>Proposta de treino:</b> {axis.practice}</p>
          <button className="ni-button" onClick={() => onPractice(axis.practice)}>Treinar esta proposta</button>
        </div>
      </details>)}
    </section>
    <section aria-labelledby="enem-essay-wild" className="ni-panel p-5 space-y-3">
      <h2 id="enem-essay-wild" className="font-display text-lg">Se o tema surpreender</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm">{enemEssayWildcards.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="font-semibold text-sm">No dia 8/11</p>
      <ul className="list-disc pl-5 space-y-1 text-sm">{enemEssayTimedPlan.map(item => <li key={item}>{item}</li>)}</ul>
      <p className="text-xs text-[var(--dim)]">Use repertório só se souber explicar como ele sustenta o argumento. Os dados numéricos vêm da coletânea da prova; não traga número de memória.</p>
    </section>
  </div>;
}
