import { useState } from 'react';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import type { Question, TopicDiscursivePrompt } from '../types';
import { canonicalExamBoard } from '../lib/questionExamFilters';
import { QuestionStatement } from './QuestionStatement';
import { useStudyDraft, isText } from '../hooks/useStudyDraft';
import { StudyDraftNotice } from './StudyDraftNotice';

export function ActiveTopicReview({ topicId, chapter, board, questions, loading = false, onStart, onComplete }: {
  topicId: string; chapter?: string; board: string; questions: Question[]; loading?: boolean; onStart?: () => void;
  onComplete: (rating: 'fraco' | 'mediano' | 'forte') => Promise<boolean>;
}) {
  const targetBoard = board.split(' / ')[0];
  const prompts = mockTopicDiscursivePrompts.filter(p => p.topicId === topicId && (!chapter || p.chapter === chapter));
  const compatibleQuestions = questions.filter(q => q.topicId === topicId && (!board || canonicalExamBoard(q.examSource?.board ?? '') === canonicalExamBoard(targetBoard)));
  const [sessionPrompt, setSessionPrompt] = useState<TopicDiscursivePrompt | undefined>();
  const prompt = sessionPrompt ?? prompts.find(p => compatibleQuestions.some(q => q.chapter === p.chapter)) ?? prompts[0];
  const candidate = [...questions].sort((a, b) => Number(Boolean(b.examSource)) - Number(Boolean(a.examSource))).find(q => q.topicId === topicId && (!prompt?.chapter || q.chapter === prompt.chapter) && (!board || canonicalExamBoard(q.examSource?.board ?? '') === canonicalExamBoard(targetBoard)));
  const [question, setQuestion] = useState<Question | undefined>();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [started, setStarted] = useState(false);
  const [response, setResponse, responseStatus] = useStudyDraft(`revisao:${topicId}:${prompt?.id}:${board}`, '', isText);
  const [revealed, setRevealed] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  if (!prompt) return <p className="text-xs mt-3">Não há exercício de recuperação para este recorte. Escolha outro tópico; consultar uma dica não conclui a revisão.</p>;
  if (!started) return <button className="ni-button mt-3" disabled={loading} onClick={() => { setSessionPrompt(prompt); setQuestion(candidate); setStarted(true); onStart?.(); }}>Iniciar revisão ativa · 10–15 min</button>;
  const ready = revealed && (!question || answer !== null);
  const correct = question ? answer === question.correctOptionId : false;
  return <section aria-label="Treino de revisão ativa" className="mt-4 space-y-3 border-t border-[var(--line)] pt-3">
    <StudyDraftNotice statuses={[responseStatus]} />
    <p className="text-xs">1. Recuperar sem consulta (3 min) → 2. Conferir critérios (2 min) → 3. Aplicar em questão (5–10 min).</p>
    <p className="font-semibold">{prompt.prompt}</p>
    <label className="block">Sua explicação sem consulta<textarea className="block w-full rounded border p-2 bg-[var(--surface2)]" value={response} disabled={revealed} onChange={e => setResponse(e.target.value)} /></label>
    {!revealed && <button className="ni-button" disabled={!response.trim()} onClick={() => setRevealed(true)}>Conferir minha recuperação</button>}
    {revealed && <>
      <p className="whitespace-pre-line">{prompt.modelAnswer}</p>
      <p>Marque apenas os critérios presentes na sua resposta original:</p>
      {prompt.keyPoints.map(point => <label key={point} className="block text-sm"><input type="checkbox" disabled={completed || saving} checked={checks.includes(point)} onChange={e => setChecks(old => e.target.checked ? [...old, point] : old.filter(p => p !== point))} /> {point}</label>)}
      {question ? <><p className="font-semibold">Aplicação · {question.examSource?.board ?? 'Exercício autoral'} {question.examSource?.year ?? ''}</p><QuestionStatement question={question} />{question.options.map(option => <button className="block border rounded p-2 w-full text-left" key={option.id} disabled={answer !== null} onClick={() => setAnswer(option.id)}>{option.id.toUpperCase()}. {option.text}</button>)}
        {answer !== null && <div role="status"><p>{correct ? 'Você acertou.' : 'Você errou.'} Alternativa correta: {question.correctOptionId.toUpperCase()}.</p><p className="whitespace-pre-line">{question.explanation}</p></div>}
      </> : <p>Sem questão disponível para esta banca e tópico. Esta sessão registra somente recuperação; selecione outro recorte para treinar aplicação.</p>}
      <p className="text-sm">Próximo passo: {checks.length < prompt.keyPoints.length || (question && !correct) ? 'retome o conceito ausente e refaça a estratégia sem olhar a solução.' : 'explique por que uma alternativa incorreta falha e tente uma questão com outro contexto.'}</p>
      <button className="ni-button" disabled={!ready || completed || saving} onClick={async () => { setSaving(true); setSaveError(false); try { const saved = await onComplete(checks.length === 0 || (question && !correct) ? 'fraco' : checks.length === prompt.keyPoints.length && correct ? 'forte' : 'mediano'); setCompleted(saved); setSaveError(!saved); } catch { setSaveError(true); } finally { setSaving(false); } }}>{completed ? 'Revisão registrada' : saving ? 'Registrando revisão…' : 'Registrar revisão com esta evidência'}</button>
      {saveError && <p role="alert">Não foi possível registrar a revisão. Sua resposta foi preservada; tente novamente.</p>}
    </>}
  </section>;
}
