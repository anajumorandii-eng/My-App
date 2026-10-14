import { canonicalExamBoard } from '../lib/questionExamFilters';
import { useEffect, useState } from 'react';
import { useDailyStudyAvailability } from '../features/availability/useDailyStudyAvailability';
import { isoToLocalDate, formatIsoTimeInSaoPaulo } from '../features/availability/time';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { useAuth } from '../context/AuthContext';
import { remainingReviewIntervals, reviewExamFocus, buildReviewBlocks } from '../lib/reviewSessionPlan';

export function ReviewSessionGuide({ open }: { open: (resource:string,path?:string)=>void }) {
  const { user }=useAuth();
  const [now,setNow]=useState(()=>new Date().toISOString());
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date().toISOString()),30_000); return ()=>clearInterval(timer);},[]);
  const localDate=isoToLocalDate(now);
  const {availability,loading,syncError}=useDailyStudyAvailability(localDate);
  const {goals,loading:goalsLoading,syncError:goalsError}=useStudentGoals();
  const [minutes,setMinutes]=useState(30);
  const focus=goalsLoading || goalsError ? null : reviewExamFocus(localDate,goals);
  const intervals=remainingReviewIntervals(availability?.intervals??[],localDate,goals,now);
  const blocks=buildReviewBlocks(intervals,minutes,focus);
  return <section className="ni-panel p-5 space-y-4" aria-labelledby="roteiro-central">
    <div><h2 id="roteiro-central" className="font-display text-xl">O que revisar agora</h2>
      <p className="text-sm text-[var(--dim)]">Recupere sem consulta → resolva → confira → explique → transfira. A atividade avaliada orienta o próximo passo.</p></div>
    {focus ? <div className="rounded-lg border border-[var(--line)] p-3 space-y-1">
      <p className="font-semibold">{focus.exam.label} · {focus.days===0 ? 'hoje' : `em ${focus.days} dia(s)`}</p>
      <p className="text-sm">{focus.days===0 ? 'Dia de prova: preserve o tempo da prova e o descanso.' : focus.days===1 ? 'Véspera: revisão leve do que já estudou, sem abrir conteúdos novos.' : focus.exam.phase==='2a-fase' ? 'Priorize respostas completas, comandos, justificativas e preparação por gênero. A convocação precisa ser confirmada.' : 'Priorize questões reais, erros recorrentes e recuperação ativa. Obras e redação seguem disponíveis para as etapas que as exigem.'}</p>
      <p className="text-xs text-[var(--dim)]">{user ? 'Foco calculado pelos objetivos cadastrados.' : 'Prévia com os objetivos de demonstração; personalize sua conta.'} Data: {focus.exam.date.split('-').reverse().join('/')} · <a href={focus.exam.source} target="_blank" rel="noreferrer" className="underline">Fonte cadastrada</a></p>
    </div> : <p className="text-sm">{goalsError ? 'Não foi possível determinar a prova em foco com seus objetivos salvos.' : goalsLoading ? 'Consultando os objetivos...' : 'Nenhuma próxima prova confirmada nas bancas e fases ativas. Revise os objetivos no perfil.'}</p>}
    <label className="block text-sm">Tempo desejado para este roteiro
      <select aria-label="Tempo desejado para este roteiro" value={minutes} onChange={e=>setMinutes(Number(e.target.value))} className="ml-2 rounded-lg border border-[var(--line)] bg-[var(--surface2)] p-2">{[15,30,45,60].map(m=><option key={m} value={m}>{m} minutos</option>)}</select>
    </label>
    <details><summary className="cursor-pointer font-semibold">Ver roteiro com horários e critérios</summary>
    {(loading || goalsLoading) ? <p role="status">Conferindo agenda e objetivos...</p> : <>
      <p className="text-sm text-[var(--dim)]">{user ? 'Roteiro nas janelas restantes da agenda' : 'Exemplo de roteiro na rotina de demonstração'} · horários de São Paulo. Janelas reservadas para revisão têm preferência.</p>
      {blocks.length ? <ol className="grid gap-3 sm:grid-cols-2">{blocks.map((block,index)=><li key={`${block.start}:${block.resource}`} className="rounded-lg border border-[var(--line)] p-4 space-y-2">
        <p className="text-xs text-[var(--dim)]">{formatIsoTimeInSaoPaulo(block.start)}–{formatIsoTimeInSaoPaulo(block.end)} · {block.minutes} min</p>
        <h3 className="font-semibold">{index+1}. {block.title}</h3><p className="text-sm">{block.action}</p>
        <p className="text-xs text-[var(--dim)]"><b>Confira:</b> {block.criterion}</p>
        <button type="button" onClick={()=>open(block.resource, block.resource==='questoes' && focus ? `/questoes?board=${encodeURIComponent(canonicalExamBoard(focus.exam.board))}` : undefined)} className="rounded-lg bg-[var(--action-primary)] px-3 py-2 text-sm text-[var(--text-inverse)]">Abrir atividade</button>
      </li>)}</ol> : <p className="text-sm">Nenhum bloco cabe nas janelas restantes. Confira compromissos, pausas e sono antes de ajustar a agenda.</p>}
    </>}
    </details>
    {(syncError || goalsError) && <p role="alert" className="text-sm">{syncError || goalsError}</p>}
    <p className="text-xs text-[var(--dim)]">Este roteiro é uma sugestão de uso do tempo restante; ele não marca atividades como concluídas nem mede domínio. Encerre o bloco ao atingir o tempo, mesmo que a tarefa continue em outra sessão.</p>
    <button type="button" onClick={()=>open('agenda')} className="text-sm underline">Ajustar agenda e rotina do cursinho</button>
  </section>;
}
