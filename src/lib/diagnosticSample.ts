// Amostra do diagnóstico de um tópico inteiro.
//
// Escolher o tópico sem subtópico punha no teste todas as questões de todos
// os subtópicos: Ecologia abria com 86, e "teste rápido" virava uma lista
// que ninguém termina. O que o diagnóstico do tópico precisa é de um sinal de
// cada subtópico, não de todas as questões dele; quem quer todas escolhe o
// subtópico, e aí a lista inteira continua valendo (não passa por aqui).
//
// Uma questão por subtópico basta para saber onde há lacuna; a segunda só
// entra para completar o piso. O piso existe porque, com poucas questões, o
// resultado é sorte (acertar 3 de 4 não separa domínio de chute); o teto,
// porque o teste é rápido e tópicos como Inglês têm 18 subtópicos.
//
// Questões sem subtópico cadastrado (1.157 das 3.094 do banco) formam um
// grupo próprio com cota separada: deixá-las de fora ignoraria quase metade
// do tópico; sem cota, trariam o problema de volta (em Ecologia são 44 das 86).

export const PER_SUBTOPIC = 1;
export const WITHOUT_SUBTOPIC = 2;
export const MIN_ITEMS = 8;
export const MAX_ITEMS = 15;

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
  // Cada grupo embaralhado uma vez; as rodadas tiram sempre do topo, então
  // a segunda questão de um subtópico nunca repete a primeira.
  const queues = shuffle([...groups].map(([key, group]) => ({ key, queue: shuffle(group, random) })), random);
  const picked: T[] = [];
  const take = (limit: number, perGroup: (key: string | undefined) => number) => {
    for (const { key, queue } of queues) {
      if (picked.length >= limit) return;
      picked.push(...queue.splice(0, Math.min(perGroup(key), limit - picked.length)));
    }
  };
  take(MAX_ITEMS, (key) => key === undefined ? WITHOUT_SUBTOPIC : PER_SUBTOPIC);
  // Abaixo do piso, completa uma questão por grupo por rodada, para a sobra
  // não sair toda do mesmo subtópico.
  while (picked.length < MIN_ITEMS && queues.some(({ queue }) => queue.length > 0)) take(MIN_ITEMS, () => 1);
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
