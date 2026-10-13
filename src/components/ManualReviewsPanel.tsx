import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { completeUserManualReview } from '../lib/userData';
import { mockTopics } from '../data/mockData';
import { isoToLocalDate } from '../features/availability/time';
import { getManualReviews, saveManualReview, validReviewDate, type ManualReview } from '../lib/manualReviews';
import type { Question, TopicMastery } from '../types';
import { ActiveTopicReview } from './ActiveTopicReview';

type Rating = 'fraco' | 'mediano' | 'forte';
type Props = { questions: Question[]; loading: boolean; onReview: (topicId: string, rating: Rating) => Promise<boolean>; onCommitted: (uid: string, mastery: TopicMastery[]) => boolean };
export function ManualReviewsPanel(props: Props) {
  const { user } = useAuth();
  return <AccountManualReviews key={user?.uid ?? 'demo'} uid={user?.uid ?? null} {...props} />;
}
function AccountManualReviews({ uid, questions, loading, onReview, onCommitted }: Props & { uid: string | null }) {
  const [reviews, setReviews] = useState<ManualReview[]>([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [topicId, setTopicId] = useState('');
  const [chapter, setChapter] = useState('');
  const [board, setBoard] = useState('');
  const [date, setDate] = useState(() => isoToLocalDate(new Date().toISOString()));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    let current = true;
    setReady(false); setLoadError(false);
    getManualReviews(uid).then(items => { if (current) { setReviews(items); setReady(true); } }).catch(() => { if (current) setLoadError(true); });
    return () => { current = false; };
  }, [uid, reload]);
  const topic = mockTopics.find(item => item.id === topicId);
  const supportedChapters = topic?.chapters?.filter(name => mockTopicDiscursivePrompts.some(prompt => prompt.topicId === topic.id && prompt.chapter === name)) ?? [];
  const today = isoToLocalDate(new Date().toISOString());
  const pending = reviews.filter(item => item.status === 'scheduled').sort((a, b) => a.date.localeCompare(b.date));
  async function addReview(event: React.FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    if (!ready || !topic || topic.subject !== subject || !validReviewDate(date) || date < today || (chapter && !supportedChapters.includes(chapter))) { setError('Escolha matéria, tópico e uma data a partir de hoje.'); return; }
    if (pending.some(item => item.topicId === topicId && item.chapter === chapter && item.board === board && item.date === date)) { setError('Esta revisão já está agendada para essa data.'); return; }
    setSaving(true);
    const review: ManualReview = { id: crypto.randomUUID(), topicId, chapter, board, date, status: 'scheduled' };
    try {
      await saveManualReview(uid, review);
      if (!mounted.current) return;
      setReviews(items => [...items, review]); setOpen(false); setMessage('Revisão adicionada.');
    } catch { if (mounted.current) setError('Não foi possível adicionar a revisão. Seus campos foram preservados; tente novamente.'); }
    finally { if (mounted.current) setSaving(false); }
  }
  async function finish(review: ManualReview, rating: Rating): Promise<boolean> {
    try {
      if (uid) {
        const committed = await completeUserManualReview(uid, review.id, rating);
        if (!mounted.current) return false;
        onCommitted(uid, committed);
      } else {
        // No modo demonstração, salve primeiro; uma falha não altera o treino local.
        await saveManualReview(null, { ...review, status: 'completed' });
        if (!mounted.current) return false;
        await onReview(review.topicId, rating);
      }
      if (!mounted.current) return false;
      setReviews(items => items.map(item => item.id === review.id ? { ...item, status: 'completed' } : item));
      setActiveId(current => current === review.id ? null : current);
      setMessage('Revisão concluída e próximo intervalo atualizado.'); return true;
    } catch { return false; }
  }
  return <section aria-labelledby="manual-reviews-title" className="my-4 p-4 rounded-xl border border-[var(--line)] space-y-3">
    <div className="flex flex-wrap gap-3 items-center justify-between"><h2 id="manual-reviews-title" className="font-semibold">Revisões adicionadas por você</h2><button className="ni-button" onClick={() => { setOpen(value => !value); setError(''); setMessage(''); }} aria-expanded={open}>Adicionar revisão</button></div>
    {!uid && <p className="text-xs text-[var(--dim)]">Revisões salvas neste navegador, no modo demonstração. Entre na sua conta para salvar na nuvem.</p>}
    {!ready && !loadError && <p role="status">Carregando revisões…</p>}
    {loadError && <div role="alert">Não foi possível carregar suas revisões. <button onClick={() => setReload(value => value + 1)}>Tentar novamente</button></div>}
    {message && <p role="status">{message}</p>}
    {open && <form onSubmit={addReview} className="space-y-3">
      <p className="text-xs text-[var(--dim)]">Os capítulos listados têm exercício de recuperação disponível.</p>
      <fieldset disabled={saving || !ready} className="grid gap-3 sm:grid-cols-2">
        <label>Matéria da nova revisão<select className="block w-full p-2 rounded bg-[var(--surface2)] border" required value={subject} onChange={event => { setSubject(event.target.value); setTopicId(''); setChapter(''); }}><option value="">Escolha a matéria</option>{[...new Set(mockTopics.map(item => item.subject))].map(name => <option key={name}>{name}</option>)}</select></label>
        <label>Tópico da nova revisão<select className="block w-full p-2 rounded bg-[var(--surface2)] border" required disabled={!subject} value={topicId} onChange={event => { setTopicId(event.target.value); setChapter(''); }}><option value="">Escolha o tópico</option>{mockTopics.filter(item => item.subject === subject).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label>Capítulo da nova revisão<select className="block w-full p-2 rounded bg-[var(--surface2)] border" disabled={!topic} value={chapter} onChange={event => setChapter(event.target.value)}><option value="">Tópico inteiro</option>{supportedChapters.map(name => <option key={name}>{name}</option>)}</select></label>
        <label>Data da nova revisão<input className="block w-full p-2 rounded bg-[var(--surface2)] border" required type="date" min={today} value={date} onChange={event => setDate(event.target.value)} /></label>
        <label>Banca da nova revisão<select className="block w-full p-2 rounded bg-[var(--surface2)] border" value={board} onChange={event => setBoard(event.target.value)}><option value="">Todas as bancas</option>{['Fuvest', 'Unicamp / Comvest', 'Unesp / Vunesp', 'Famerp', 'Unifesp', 'ENEM / Inep'].map(name => <option key={name}>{name}</option>)}</select></label>
        <div className="flex items-end gap-2"><button type="submit" className="ni-button">{saving ? 'Salvando…' : 'Salvar revisão'}</button><button type="button" onClick={() => setOpen(false)}>Cancelar</button></div>
      </fieldset>
      {error && <p role="alert">{error}</p>}
    </form>}
    {ready && pending.length === 0 && <p className="text-sm text-[var(--dim)]">Você ainda não tem revisões manuais pendentes.</p>}
    {pending.map(review => { const item = mockTopics.find(candidate => candidate.id === review.topicId); return <article key={review.id} className="border-t border-[var(--line)] pt-3 space-y-2">
      <h3 className="font-semibold">{item?.name ?? 'Tópico indisponível'}</h3>
      <p className="text-sm">{item?.subject} · {review.chapter || 'Tópico inteiro'} · {review.board || 'Todas as bancas'}</p>
      <p className="text-xs">{review.date < today ? 'Atrasada' : review.date === today ? 'Para hoje' : 'Programada'} · {review.date.split('-').reverse().join('/')}</p>
      {item && activeId !== review.id && <button className="ni-button" onClick={() => setActiveId(review.id)}>Abrir revisão</button>}
      {activeId === review.id && <ActiveTopicReview questions={questions} loading={loading} topicId={review.topicId} chapter={review.chapter || undefined} board={review.board} onComplete={rating => finish(review, rating)} />}
    </article>; })}
  </section>;
}
