import { useState } from 'react';
import { essayOfficialSources, essayBoardTraining, essayGenres, essayMicroPractice, essayPlanFields, essayPracticeBlock, type EssayPlan } from '../data/essayWorkshop';
import { studyBoardProfiles } from '../data/studyProtocols';
export function EssayWorkshop({ board, plan, onChange }: { board: string; plan: EssayPlan; onChange: (plan: EssayPlan) => void }) {
  const [minutes, setMinutes] = useState<20 | 40 | 60>(40);
  const [exerciseId, setExerciseId] = useState('tese');
  const [response, setResponse] = useState('');
  const [practiceRewrite, setPracticeRewrite] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const exercise = essayMicroPractice.find(item => item.id === exerciseId)!;
  const guide = essayBoardTraining[board];
  const profile = studyBoardProfiles.find(item => item.board === (board === 'Unesp/Vunesp' ? 'UNESP' : board));
  const change = (key: keyof EssayPlan, value: string) => onChange({ ...plan, [key]: value });
  return <section aria-labelledby="essay-workshop-title" className="ni-panel p-5 space-y-4">
    <h2 id="essay-workshop-title" className="font-display text-xl">Da proposta ao projeto de texto</h2>
    <p className="text-sm">{guide?.focus}</p>
    {profile && <a className="underline text-xs" href={essayOfficialSources[board] ?? profile.source} target="_blank" rel="noreferrer">Consultar instruções institucionais de {board}</a>}
    <details><summary className="cursor-pointer font-semibold">Como trabalhar a proposta de {board}</summary><ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">{guide?.steps.map(step => <li key={step}>{step}</li>)}</ol><ul className="list-disc pl-5 mt-3 text-sm">{guide?.pitfalls.map(pitfall => <li key={pitfall}>{pitfall}</li>)}</ul></details>
    <label className="block text-sm">Proposta e informações da coletânea<textarea rows={4} maxLength={6000} className="field block w-full" value={plan.proposal} onChange={event => change('proposal', event.target.value)} placeholder="Cole o comando e os textos necessários ou registre as informações com suas origens. Sem a coletânea, a correção não consegue verificar seu uso." /></label>
    <label className="block text-sm">Gênero solicitado<select className="field block w-full" value={board === 'ENEM' ? 'Dissertativo-argumentativo' : plan.genre} disabled={board === 'ENEM'} onChange={event => change('genre', event.target.value)}>{essayGenres.map(genre => <option key={genre}>{genre}</option>)}</select></label>
    <div className="grid sm:grid-cols-2 gap-3">{essayPlanFields.map(([key, label, hint]) => <label key={key} className="text-sm">{label}<p className="text-xs text-[var(--dim)] my-1">{hint}</p><textarea rows={3} maxLength={800} className="field block w-full" value={plan[key]} onChange={event => change(key, event.target.value)} /></label>)}</div>
    <details><summary className="cursor-pointer font-semibold">Bloco de escrita e revisão</summary><label className="block mt-3">Tempo de treino<select className="field block w-full" value={minutes} onChange={event => setMinutes(Number(event.target.value) as 20 | 40 | 60)}>{[20, 40, 60].map(value => <option key={value} value={value}>{value} minutos</option>)}</select></label><ol className="list-decimal pl-5 mt-3 space-y-2 text-sm">{essayPracticeBlock(minutes).map(step => <li key={step.task}><b>{step.minutes} min:</b> {step.task}</li>)}</ol><p className="text-xs mt-2">Duração de treino estimada; limites e tempo de prova devem ser conferidos nas instruções oficiais.</p></details>
    <details><summary className="cursor-pointer font-semibold">Treino de habilidade com recuperação e transferência</summary>
      <label className="block mt-3">Habilidade para treinar<select className="field block w-full" value={exerciseId} onChange={event => { setExerciseId(event.target.value); setResponse(''); setPracticeRewrite(''); setRevealed(false); setChecked([]); }}>{essayMicroPractice.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
      <p className="text-sm my-3">{exercise.prompt}</p><label className="block text-sm">Minha resposta sem consultar<textarea className="field block w-full" value={response} disabled={revealed} onChange={event => setResponse(event.target.value)} /></label>
      {!revealed && <button className="ni-button mt-3" disabled={!response.trim()} onClick={() => setRevealed(true)}>Conferir critérios e exemplo</button>}
      {revealed && <div className="space-y-3 mt-3 text-sm"><p>{exercise.model}</p><p>Marque apenas o que sua resposta original já atende. Esta é uma autoavaliação, não uma nota automática.</p>{exercise.criteria.map(criterion => <label className="block" key={criterion}><input type="checkbox" checked={checked.includes(criterion)} onChange={event => setChecked(items => event.target.checked ? [...items, criterion] : items.filter(item => item !== criterion))} /> {criterion}</label>)}<p>{checked.length === exercise.criteria.length ? 'Próximo passo: aplicar a habilidade em outro contexto.' : 'Próximo passo: reescrever o trecho que não atende aos critérios antes de avançar.'}</p><label className="block">Minha reescrita após conferir<textarea className="field block w-full" value={practiceRewrite} onChange={event => setPracticeRewrite(event.target.value)} /></label><p>Compare a nova versão com os critérios acima; a primeira tentativa fica preservada para comparação.</p><p><b>Transferência:</b> {exercise.transfer}</p><details><summary className="cursor-pointer">Conferir critérios de transferência</summary><p>{exercise.expected}</p></details></div>}
    </details>
  </section>;
}
