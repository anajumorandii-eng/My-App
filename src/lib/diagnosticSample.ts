// Amostra do diagnóstico de um tópico inteiro.
//
// Escolher o tópico sem subtópico punha no teste todas as questões de todos
// os subtópicos: Ecologia abria com 86, e "teste rápido" virava uma lista
// que ninguém termina. O que o diagnóstico do tópico precisa é de um sinal de
// cada subtópico, não de todas as questões dele; quem quer todas escolhe o
// subtópico, e aí a lista inteira continua valendo (não passa por aqui).
//
// Questões sem subtópico cadastrado (1.157 das 3.094 do banco) formam um
// grupo próprio com teto separado: tratá-las como um subtópico de 2 jogaria
// fora quase metade do tópico; deixá-las sem teto trazia o problema de volta,
// porque em Ecologia elas são 44 das 86.

export const PER_SUBTOPIC = 2;
export const WITHOUT_SUBTOPIC = 4;

export function sampleAcrossSubtopics<T>(
  items: readonly T[],
  subtopicOf: (item: T) => string | undefined,
  random: () => number = Math.random,
): T[] {
  const groups = new Map<string | undefined, T[]>();
  for (const item of items) {
    const key = subtopicOf(item) || undefined;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const picked: T[] = [];
  for (const [key, group] of groups) {
    picked.push(...shuffle(group, random).slice(0, key === undefined ? WITHOUT_SUBTOPIC : PER_SUBTOPIC));
  }
  return shuffle(picked, random);
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
