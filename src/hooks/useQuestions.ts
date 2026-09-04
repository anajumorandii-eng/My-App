import { useEffect, useState } from 'react';
import { Question } from '../types';
import { getLocalQuestionBank, getQuestions } from '../lib/contentCatalog';

export interface UseQuestionsResult {
  questions: Question[];
  /** true até a primeira fonte responder — as telas mostram esqueleto, não "0 questões". */
  loading: boolean;
  syncError: string | null;
}

/**
 * Duas fontes, em ordem de prioridade: o banco local (arquivo estático, chega
 * rápido e funciona offline) e o banco compartilhado do Firestore, que
 * sobrepõe o local quando responde e traz o que foi editado no painel
 * /admin/conteudo.
 *
 * Antes o banco local vinha importado do bundle, o que dava resposta
 * instantânea ao custo de 1,5 MB baixados em toda tela do app — inclusive nas
 * que não têm questão nenhuma. Agora ele é buscado, e o preço é um estado de
 * carregamento que as telas precisam mostrar.
 */
export function useQuestions(): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let hasRemote = false;

    getLocalQuestionBank()
      .then((data) => {
        // Se o Firestore já respondeu, ele manda: não regredir pro local.
        if (!cancelled && !hasRemote) setQuestions(data);
      })
      .catch((error) => {
        console.error('Failed to load the local question bank:', error);
        if (!cancelled) setSyncError('Não foi possível carregar o banco de questões.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getQuestions()
      .then((data) => {
        if (cancelled || data.length === 0) return;
        hasRemote = true;
        setQuestions(data);
        setSyncError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions from Firestore:', error);
        if (!cancelled) setSyncError('Não foi possível carregar o banco de questões atualizado. Mostrando o conjunto local.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, loading, syncError };
}
