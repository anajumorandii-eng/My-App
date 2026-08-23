import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, HelpCircle, FlaskConical, Headphones, ShieldCheck } from 'lucide-react';
import { getFirebaseIdToken } from '../lib/auth';
import { mockTopics } from '../data/mockData';
import { Question, StudyMethod, PodcastEpisode, QuizOption } from '../types';

// Painel administrativo do banco de conteúdo compartilhado — questões,
// métodos de estudo e episódios de podcast, que antes só existiam
// hardcoded em src/data/mockData.ts e agora vivem no Firestore (ver
// server/content/contentAdminRoutes.ts). O botão "Semear" faz a migração
// inicial do conjunto embutido no código; depois disso, conteúdo novo pode
// ser cadastrado por aqui, sem deploy.

async function adminFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/admin/content${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.error || `Falha em ${path} (${response.status})`;
    throw new Error(body.detail ? `${message} — ${body.detail}` : message);
  }
  return body as T;
}

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
}

function csvToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

export default function AdminConteudo() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studyMethods, setStudyMethods] = useState<StudyMethod[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState('Todas');

  const loadAll = useCallback(async (t: string) => {
    const [q, m, e] = await Promise.all([
      adminFetch<Question[]>('/questions', t),
      adminFetch<StudyMethod[]>('/study-methods', t),
      adminFetch<PodcastEpisode[]>('/podcast-episodes', t),
    ]);
    setQuestions(q);
    setStudyMethods(m);
    setEpisodes(e);
  }, []);

  useEffect(() => {
    getFirebaseIdToken().then(async (t) => {
      if (!t) throw new Error('Entre na conta administrativa.');
      setToken(t);
      await loadAll(t);
    }).catch((cause) => setError(cause.message));
  }, [loadAll]);

  async function withBusy(fn: () => Promise<void>) {
    setError('');
    setBusy(true);
    try { await fn(); } catch (cause) { setError((cause as Error).message); } finally { setBusy(false); }
  }

  function handleSeed() {
    withBusy(async () => {
      if (!token) return;
      const result = await adminFetch<{ questions: number; studyMethods: number; podcastEpisodes: number }>('/seed', token, { method: 'POST' });
      await loadAll(token);
      window.alert(`Semeado: ${result.questions} questões, ${result.studyMethods} métodos de estudo, ${result.podcastEpisodes} episódios de podcast.`);
    });
  }

  function handleCreateQuestion(form: HTMLFormElement) {
    const data = new FormData(form);
    const optionTexts = [1, 2, 3, 4].map((n) => String(data.get(`option${n}`) ?? '').trim()).filter(Boolean);
    const options: QuizOption[] = optionTexts.map((text, i) => ({ id: `o${i + 1}`, text }));
    const correctIndex = Number(data.get('correctOption')) - 1;
    withBusy(async () => {
      if (!token) return;
      await adminFetch('/questions', token, {
        method: 'POST',
        body: JSON.stringify({
          topicId: data.get('topicId'),
          subject: data.get('subject'),
          prompt: data.get('prompt'),
          options,
          correctOptionId: options[correctIndex]?.id,
          explanation: data.get('explanation'),
          difficulty: data.get('difficulty'),
          chapter: data.get('chapter') || undefined,
        }),
      });
      await loadAll(token);
      form.reset();
    });
  }

  function handleCreateStudyMethod(form: HTMLFormElement) {
    const data = new FormData(form);
    withBusy(async () => {
      if (!token) return;
      await adminFetch('/study-methods', token, {
        method: 'POST',
        body: JSON.stringify({
          name: data.get('name'),
          category: data.get('category'),
          summary: data.get('summary'),
          steps: linesToArray(data.get('steps')),
          bestFor: csvToArray(data.get('bestFor')),
        }),
      });
      await loadAll(token);
      form.reset();
    });
  }

  function handleCreateEpisode(form: HTMLFormElement) {
    const data = new FormData(form);
    withBusy(async () => {
      if (!token) return;
      await adminFetch('/podcast-episodes', token, {
        method: 'POST',
        body: JSON.stringify({
          topicId: data.get('topicId'),
          title: data.get('title'),
          subject: data.get('subject'),
          durationMinutes: Number(data.get('durationMinutes')),
          script: data.get('script'),
        }),
      });
      await loadAll(token);
      form.reset();
    });
  }

  function handleDeleteQuestion(id: string) {
    withBusy(async () => {
      if (!token) return;
      await adminFetch(`/questions/${id}`, token, { method: 'DELETE' });
      await loadAll(token);
    });
  }

  const subjects = useMemo(() => ['Todas', ...new Set(questions.map((q) => q.subject))].sort(), [questions]);
  const filteredQuestions = useMemo(() => {
    let result = questionSubjectFilter === 'Todas' ? questions : questions.filter((q) => q.subject === questionSubjectFilter);
    const term = questionSearch.trim().toLowerCase();
    if (term) result = result.filter((q) => q.prompt.toLowerCase().includes(term));
    return result.slice(0, 100);
  }, [questions, questionSubjectFilter, questionSearch]);

  return <div className="space-y-8">
    <header>
      <h1 className="text-3xl font-bold flex items-center"><ShieldCheck className="w-7 h-7 mr-3 text-indigo-500" />Conteúdo — Administração</h1>
      <p className="text-zinc-500 mt-2">Questões, métodos de estudo e episódios de podcast, administráveis sem deploy.</p>
    </header>
    {error && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">{error}</div>}

    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold flex items-center mb-1"><Database className="w-5 h-5 mr-2" />Migração inicial</h2>
      <p className="text-sm text-zinc-500 mb-4">
        {questions.length} questões, {studyMethods.length} métodos, {episodes.length} episódios já no Firestore.
      </p>
      <button disabled={busy} onClick={handleSeed} className="bg-emerald-600 text-white rounded-lg px-3 py-1.5 text-sm disabled:opacity-50">
        Semear/atualizar com o conjunto embutido no código (idempotente)
      </button>
    </section>

    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold flex items-center mb-4"><HelpCircle className="w-5 h-5 mr-2" />Questões ({questions.length})</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        <input value={questionSearch} onChange={(e) => setQuestionSearch(e.target.value)} placeholder="Buscar no enunciado..."
          className="border rounded-lg px-2 py-1.5 text-sm dark:bg-zinc-800 flex-1 min-w-[200px]" />
        <select value={questionSubjectFilter} onChange={(e) => setQuestionSubjectFilter(e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm dark:bg-zinc-800">
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ul className="text-sm space-y-1 max-h-64 overflow-y-auto mb-4">
        {filteredQuestions.map((q) => (
          <li key={q.id} className="flex items-start justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 py-1.5">
            <span className="truncate">{q.subject} — {q.prompt}</span>
            <button disabled={busy} onClick={() => handleDeleteQuestion(q.id)} className="shrink-0 text-xs text-rose-500 hover:underline">excluir</button>
          </li>
        ))}
        {questions.length > filteredQuestions.length && (
          <li className="text-xs text-zinc-400 pt-1">Mostrando as 100 primeiras — refine a busca para ver outras.</li>
        )}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateQuestion(e.currentTarget); }} className="grid sm:grid-cols-2 gap-2 text-sm">
        <select name="topicId" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2">
          {mockTopics.map((t) => <option key={t.id} value={t.id}>{t.subject} — {t.name}</option>)}
        </select>
        <input name="subject" placeholder="Matéria (ex.: Biologia)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <select name="difficulty" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800">
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <textarea name="prompt" placeholder="Enunciado" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" rows={2} />
        {[1, 2, 3, 4].map((n) => (
          <input key={n} name={`option${n}`} placeholder={`Alternativa ${n}${n > 2 ? ' (opcional)' : ''}`} required={n <= 2} className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        ))}
        <select name="correctOption" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800">
          <option value="">Alternativa correta...</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>Alternativa {n}</option>)}
        </select>
        <input name="chapter" placeholder="Capítulo (opcional)" className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <textarea name="explanation" placeholder="Explicação da resposta" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" rows={2} />
        <button disabled={busy} className="sm:col-span-2 bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Cadastrar questão</button>
      </form>
    </section>

    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold flex items-center mb-4"><FlaskConical className="w-5 h-5 mr-2" />Métodos de estudo ({studyMethods.length})</h2>
      <ul className="text-sm space-y-1 max-h-48 overflow-y-auto mb-4">
        {studyMethods.map((m) => <li key={m.id} className="border-b border-zinc-100 dark:border-zinc-800 py-1.5">{m.name} <em className="text-zinc-400">({m.category})</em></li>)}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateStudyMethod(e.currentTarget); }} className="grid sm:grid-cols-2 gap-2 text-sm">
        <input name="name" placeholder="Nome do método" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <select name="category" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800">
          <option value="aquisicao">aquisição</option>
          <option value="retencao">retenção</option>
          <option value="aplicacao">aplicação</option>
          <option value="foco">foco</option>
        </select>
        <textarea name="summary" placeholder="Resumo" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" rows={2} />
        <textarea name="steps" placeholder="Passos (um por linha)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" rows={3} />
        <input name="bestFor" placeholder="Bom para (separado por vírgula)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" />
        <button disabled={busy} className="sm:col-span-2 bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Cadastrar método</button>
      </form>
    </section>

    <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
      <h2 className="font-semibold flex items-center mb-4"><Headphones className="w-5 h-5 mr-2" />Episódios de podcast ({episodes.length})</h2>
      <ul className="text-sm space-y-1 max-h-48 overflow-y-auto mb-4">
        {episodes.map((ep) => <li key={ep.id} className="border-b border-zinc-100 dark:border-zinc-800 py-1.5">{ep.title} <em className="text-zinc-400">({ep.subject}, {ep.durationMinutes} min)</em></li>)}
      </ul>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateEpisode(e.currentTarget); }} className="grid sm:grid-cols-2 gap-2 text-sm">
        <select name="topicId" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2">
          {mockTopics.map((t) => <option key={t.id} value={t.id}>{t.subject} — {t.name}</option>)}
        </select>
        <input name="title" placeholder="Título" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <input name="subject" placeholder="Matéria" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <input name="durationMinutes" type="number" min={1} placeholder="Duração (min)" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800" />
        <textarea name="script" placeholder="Roteiro narrado" required className="border rounded-lg px-2 py-1.5 dark:bg-zinc-800 sm:col-span-2" rows={4} />
        <button disabled={busy} className="sm:col-span-2 bg-indigo-600 text-white rounded-lg px-3 py-1.5 disabled:opacity-50">Cadastrar episódio</button>
      </form>
    </section>
  </div>;
}
