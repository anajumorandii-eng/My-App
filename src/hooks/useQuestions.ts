import { useEffect, useState } from 'react';
import { Question } from '../types';
import { mockQuestions } from '../data/mockData';
import { getQuestions } from '../lib/contentCatalog';

// Começa com o banco embutido no bundle (nunca fica vazio nem depende de
// rede pra primeira renderização) e troca pelo banco real do Firestore
// assim que a leitura terminar — mesmo padrão de fallback honesto usado em
// Erros.tsx, mas aqui o conteúdo é compartilhado entre todas as alunas, não
// por usuário, então não há estado de autenticação envolvido.
export function useQuestions(): { questions: Question[]; syncError: string | null } {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getQuestions()
      .then((data) => {
        if (cancelled) return;
        if (data.length > 0) setQuestions(data);
      })
      .catch((error) => {
        console.error('Failed to load questions from Firestore:', error);
        if (!cancelled) setSyncError('Não foi possível carregar o banco de questões atualizado. Mostrando o conjunto local.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, syncError };
}
