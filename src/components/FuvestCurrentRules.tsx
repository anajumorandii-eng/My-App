import rules from '../data/fuvest2027Rules.json';
export function FuvestCurrentRules() {
  return <details className="ni-panel p-5">
    <summary className="cursor-pointer font-semibold">O que muda na prova deste ano · FUVEST 2027</summary>
    <div className="space-y-4 mt-4 text-sm">
      <p>Ingresso em 2027, com provas em 2026. Regras consultadas em 18/10/2026. Separe o histórico observado do formato vigente.</p>
      {rules.rules.map(rule => <article key={rule.id} className="border-t border-[var(--line)] pt-3 space-y-2">
        <h3 className="font-semibold">{rule.title}</h3><p>{rule.description}</p><p><b>Como adaptar o treino:</b> {rule.implication}</p>
        <a className="underline text-xs" href={`${rule.sourceUrl}#page=${rule.page}`} target="_blank" rel="noreferrer">Fonte oficial · página {rule.page}</a>
      </article>)}
      <div className="border-t border-[var(--line)] pt-3"><h3 className="font-semibold">Medicina · carreira {rules.medicine.careerCode}</h3>
        <p>{rules.medicine.secondDaySubjects.join(' · ')}. {rules.medicine.questionSelectionRule}</p>
        <a className="underline text-xs" href={`${rules.medicine.sourceUrl}#page=${rules.medicine.page}`} target="_blank" rel="noreferrer">Guia de carreiras · página {rules.medicine.page}</a>
      </div>
      <div className="border-t border-[var(--line)] pt-3"><h3 className="font-semibold">Mudanças que pertencem a 2028</h3>
        {rules.futureChanges.map(change => <div key={change.appliesTo} className="space-y-2"><p>{change.description}</p><p>{change.implication}</p><a className="underline text-xs" href={change.sourceUrl} target="_blank" rel="noreferrer">Anúncio oficial e ciclo de aplicação</a></div>)}
      </div>
    </div>
  </details>;
}
