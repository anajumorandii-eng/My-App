// Prática intercalada (interleaving): alternar entre matérias numa mesma
// sessão de estudo melhora a capacidade de reconhecer qual conceito ou
// estratégia usar em cada questão, em vez de simplesmente repetir a última
// (Rohrer & Taylor, 2007; Rohrer, Dedrick & Stershic, 2015 — prática
// intercalada em matemática gerou desempenho muito maior em teste posterior
// do que a prática em bloco, mesmo com o mesmo conteúdo e tempo total).
//
// Esta função reordena uma lista já priorizada, alternando entre as
// matérias disponíveis (preservando a ordem relativa de prioridade dentro
// de cada matéria) em vez de deixar vários itens seguidos da mesma matéria
// só porque ela dominou o ranking de prioridade.
export function interleaveBySubject<T extends { subject: string }>(actions: T[]): T[] {
  if (actions.length <= 2) return actions;

  const subjectOrder: string[] = [];
  const bySubject = new Map<string, T[]>();
  for (const action of actions) {
    if (!bySubject.has(action.subject)) {
      bySubject.set(action.subject, []);
      subjectOrder.push(action.subject);
    }
    bySubject.get(action.subject)!.push(action);
  }

  const result: T[] = [];
  let lastSubject: string | null = null;

  while (result.length < actions.length) {
    const candidate = subjectOrder.find((subject) => {
      const queue = bySubject.get(subject);
      return queue && queue.length > 0 && subject !== lastSubject;
    });
    // Se só sobrou uma matéria com itens (ou todas as outras esvaziaram),
    // aceita repetir — não há alternativa real pra intercalar com.
    const subject = candidate ?? subjectOrder.find((s) => (bySubject.get(s)?.length ?? 0) > 0)!;
    const queue = bySubject.get(subject)!;
    result.push(queue.shift()!);
    lastSubject = subject;
  }

  return result;
}
