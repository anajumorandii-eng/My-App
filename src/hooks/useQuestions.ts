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
 * Duas fontes: o banco local (arquivo estático, chega rápido e funciona
 * offline) e o banco compartilhado do Firestore, que traz o que foi editado no
 * painel /admin/conteudo.
 *
 * O Firestore SOBREPÕE POR ID, não substitui a lista inteira. Antes ele
 * trocava tudo, e isso tinha um efeito silencioso e grave: questão nova
 * adicionada ao repositório ficava invisível no app até alguém lembrar de
 * apertar "Semear" no painel. Foi assim que 68 questões da Fuvest existiram no
 * arquivo por horas sem aparecer para ninguém.
 *
 * A contrapartida: questão apagada pelo painel volta a aparecer, porque o
 * arquivo local continua tendo. Trocar conteúdo invisível por conteúdo
 * ressuscitável é o lado certo do erro — o primeiro não dá sinal nenhum, o
 * segundo é visível e corrigível apagando também do arquivo.
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
    let local: Question[] = [];
    let remote: Question[] | null = null;

    // Local como base, Firestore por cima: mesma questão (mesmo id) fica na
    // versão do Firestore, que é onde as edições do painel vivem; questão que
    // só existe no arquivo entra assim mesmo.
    const merge = () => {
      if (!remote) return local;
      const porId = new Map(local.map((q) => [q.id, q]));
      for (const q of remote) porId.set(q.id, q);
      return [...porId.values()];
    };

    getLocalQuestionBank()
      .then((data) => {
        local = data;
        if (!cancelled) setQuestions(merge());
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
        remote = data;
        setQuestions(merge());
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
