import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firestore';
import { parseStudyPlan, type StudyPlan } from '../lib/studyPlan';

// Sem conta, o cronograma pode vir do próprio navegador: é o mesmo lugar onde
// o modo demonstração já guarda revisões manuais, e é por onde as capturas
// de conferência carregam um cronograma sem tocar na conta de ninguém.
export const DEMO_STUDY_PLAN_KEY = 'crivo-study-plan';

function readDemoPlan(): StudyPlan | null {
  try {
    const stored = localStorage.getItem(DEMO_STUDY_PLAN_KEY);
    return stored ? parseStudyPlan(JSON.parse(stored)) : null;
  } catch {
    return null;
  }
}

export function useStudyPlan() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<{ uid: string | null; plan: StudyPlan | null; loading: boolean; error: string | null }>(
    () => ({ uid, plan: uid ? null : readDemoPlan(), loading: Boolean(uid), error: null }),
  );

  useEffect(() => {
    if (!uid) { setState({ uid, plan: readDemoPlan(), loading: false, error: null }); return; }
    let cancelled = false;
    setState({ uid, plan: null, loading: true, error: null });
    getDoc(doc(db, 'users', uid, 'data', 'studyPlan')).then((snapshot) => {
      if (!cancelled) setState({ uid, plan: snapshot.exists() ? parseStudyPlan(snapshot.data()) : null, loading: false, error: null });
    }).catch(() => {
      if (!cancelled) setState({ uid, plan: null, loading: false, error: 'Não foi possível carregar seu cronograma agora.' });
    });
    return () => { cancelled = true; };
  }, [uid]);

  // Troca de conta: até o efeito rodar, não mostrar o cronograma da anterior.
  return state.uid === uid ? state : { uid, plan: null, loading: Boolean(uid), error: null };
}
