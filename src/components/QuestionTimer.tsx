import { Button } from './ui/Button';
import { formatQuestionTime } from '../lib/questionTiming';

export function QuestionTimer({ seconds, expectedSeconds, started, onStart, running, manualPause, finished, onTogglePause, onExpectedChange }: {
  seconds: number; expectedSeconds: number; started: boolean; onStart: () => void; running: boolean; manualPause: boolean; finished: boolean;
  onTogglePause: () => void; onExpectedChange: (seconds: number) => void;
}) {
  const difference = seconds - expectedSeconds;
  return <section aria-label="Tempo desta questão" className="my-4 rounded-xl border border-[var(--line)] p-3 text-sm">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs text-[var(--dim)]">{finished ? 'Tempo gasto' : 'Tempo nesta questão'}</p><div className="flex flex-wrap items-baseline gap-3"><strong role="timer" aria-label="Tempo decorrido" aria-live="off" className="text-2xl tabular-nums">{formatQuestionTime(seconds)}</strong><span className="text-xs text-[var(--dim)]">{finished ? 'Concluída' : !started ? 'Aguardando início' : running ? 'Em andamento' : manualPause ? 'Pausado por você' : 'Pausado com a aba oculta'}</span></div></div>
      {!started && <Button type="button" onClick={onStart}>Iniciar questão</Button>}
      {started && !finished && <button type="button" onClick={onTogglePause} className="min-h-11 rounded-lg border border-[var(--line)] px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{manualPause ? 'Retomar cronômetro' : 'Pausar cronômetro'}</button>}
      <label className="flex flex-wrap items-center gap-2 text-xs"><span>Tempo esperado</span><select aria-label="Tempo esperado por questão" disabled={finished} value={expectedSeconds} onChange={event => onExpectedChange(Number(event.target.value))} className="min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 text-sm text-[var(--text)] disabled:opacity-70">{[60,120,180,240,300,360,480,600,900].map(value=><option key={value} value={value}>{formatQuestionTime(value)}</option>)}</select></label>
    </div>
    <p className="mt-2 text-xs text-[var(--dim)]">{finished ? difference === 0 ? 'Concluída no tempo esperado.' : `${formatQuestionTime(Math.abs(difference))} ${difference > 0 ? 'acima' : 'abaixo'} do tempo esperado.` : !started ? 'Clique em Iniciar questão quando estiver pronto. Escolher filtros e buscar não conta como tempo de resolução.' : seconds > expectedSeconds ? 'Você passou da meta de treino. Pode continuar resolvendo, sem bloqueio.' : 'A contagem para ao responder. Pausas e tempo com a aba oculta não entram no total.'}</p>
    <details className="mt-2 text-xs text-[var(--dim)]"><summary className="cursor-pointer py-1">Como funciona o tempo esperado?</summary><p className="mt-1">É uma meta de treino ajustável: 2 minutos para questões fáceis, 3 para médias e 5 para difíceis. Não é um tempo oficial da banca nem uma média do seu histórico. Ajuste à sua estratégia; rapidez não substitui compreensão.</p></details>
  </section>;
}
