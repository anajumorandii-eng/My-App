import { useEffect, useState } from 'react';
import { Question } from '../types';
import { getLocalQuestionBank, getQuestions } from '../lib/contentCatalog';

export interface UseQuestionsResult {
  questions: Question[];
  loading: boolean;
  syncError: string | null;
}

/** Fontes complementares; uma edição remota substitui apenas o mesmo ID. */
export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    let local: Question[] = [];
    let remote: Question[] = [];
    let settled = 0;
    const failures = new Set<string>();
    const publish = () => {
      if (cancelled) return;
      const merged = new Map(local.map(q => [q.id, q]));
      remote.forEach(q => merged.set(q.id, { ...merged.get(q.id), ...q }));
      setQuestions([...merged.values()]);
      setLoading(merged.size === 0 && settled < 2);
      setSyncError(failures.size === 2 ? 'Não foi possível carregar o banco de questões.'
        : failures.has('remote') ? 'Não foi possível atualizar o banco compartilhado. Mostrando o banco local.'
        : failures.has('local') ? 'Não foi possível carregar o banco local. Mostrando o banco compartilhado.' : null);
    };
    getLocalQuestionBank().then(data => { local = data; })
      .catch(() => { failures.add('local'); })
      .finally(() => { settled++; publish(); });
    getQuestions().then(data => { remote = data; })
      .catch(() => { failures.add('remote'); })
      .finally(() => { settled++; publish(); });
    return () => { cancelled = true; };
  }, []);
  return { questions, loading, syncError };
}
