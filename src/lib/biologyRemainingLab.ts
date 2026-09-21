/** Relações didáticas de Biologia. Os valores relativos servem para explorar
 * o mecanismo, sem fingir medidas clínicas ou ambientais reais. */
export const BIOLOGY_REMAINING = {
  'genetics-intro': ['Segregação de alelos', 'Quais gametas um heterozigoto Aa produz?', 'Genótipo parental', 0, 2, 1, 1, '', 'AA → só A; Aa → metade A e metade a; aa → só a', 'Cada gameta recebe um dos alelos do par na meiose.', ['Par Aa', 'Separação', 'Gametas']],
  'blood-groups': ['Compatibilidade ABO', 'Quem pode receber hemácias do tipo A em uma transfusão ABO?', 'Receptor de hemácias A', 0, 3, 1, 0, '', 'hemácias A do doador × anti-A do receptor', 'A compatibilidade ABO de hemácias depende dos antígenos A e B e dos anticorpos do receptor.', ['Doador A', 'Antígeno A', 'Receptor']],
  locomotion: ['Alavanca muscular', 'O que a contração faz a uma articulação?', 'Intensidade relativa', 0, 100, 10, 40, '%', 'músculo contrai → traciona tendão → osso gira', 'Músculos esqueléticos puxam ossos via tendões; antagonistas produzem movimentos opostos.', ['Músculo', 'Tendão', 'Osso']],
  endocrine: ['Realimentação hormonal', 'O que ocorre quando aumenta o hormônio periférico?', 'Hormônio periférico', 0, 100, 10, 40, '%', 'hipófise → glândula → hormônio ⊣ hipófise', 'Na realimentação negativa, o produto reduz o estímulo que iniciou sua produção.', ['Hipófise', 'Glândula', 'Retorno']],
} as const;
export type BiologyRemainingId = keyof typeof BIOLOGY_REMAINING;
export function biologyRemainingReadout(id: BiologyRemainingId, value: number): string {
  if (id === 'genetics-intro') return ['AA: 100% A', 'Aa: 50% A e 50% a', 'aa: 100% a'][value] ?? '';
  if (id === 'blood-groups') return ['O: incompatível (anti-A)', 'A: compatível', 'B: incompatível (anti-A)', 'AB: compatível'][value] ?? '';
  if (id === 'endocrine') return `${100 - value}% de estímulo relativo`;
  return `${value}% relativo`;
}
