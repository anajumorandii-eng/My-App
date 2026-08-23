import { useEffect, useState } from 'react';
import { StudyMethod } from '../types';
import { mockStudyMethods } from '../data/mockData';
import { getStudyMethods } from '../lib/contentCatalog';

// Ver useQuestions.ts para o raciocínio do padrão de fallback.
export function useStudyMethods(): { studyMethods: StudyMethod[]; syncError: string | null } {
  const [studyMethods, setStudyMethods] = useState<StudyMethod[]>(mockStudyMethods);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getStudyMethods()
      .then((data) => {
        if (cancelled) return;
        if (data.length > 0) setStudyMethods(data);
      })
      .catch((error) => {
        console.error('Failed to load study methods from Firestore:', error);
        if (!cancelled) setSyncError('Não foi possível carregar os métodos atualizados. Mostrando o conjunto local.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { studyMethods, syncError };
}
