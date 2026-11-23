// Todo campo de texto aqui é Markdown com fórmulas em LaTeX ($…$ na linha,
// $$…$$ em bloco), renderizado pelo AiText (remark-math + KaTeX). Fórmula em
// texto corrido ("2,9 / 4,1 × 10⁻¹⁵") já custou uma conta errada exibida como
// certa: sem agrupamento visível, a divisão parecia outra.

export interface TheoryFormula {
  /** LaTeX sem os delimitadores. */
  tex: string;
  /** O que cada símbolo é e quando usar a fórmula. */
  meaning: string;
}

export interface TheoryExample {
  title: string;
  prompt: string;
  steps: string[];
}

export interface DiscursiveDrill {
  prompt: string;
  /** Resposta-modelo, item por item. */
  modelAnswer: string[];
  /** O que uma correção de 0 a 4 pontos conferiria. */
  scoring: string[];
}

export interface ChapterTheory {
  /** Como o assunto caiu nas provas reais da banca. */
  howItFalls: string;
  /** O mecanismo explicado por inteiro, em Markdown. */
  explanation: string;
  formulas?: TheoryFormula[];
  /** Onde o conceito se aplica: situações, outras matérias, outros assuntos da prova. */
  applications: string[];
  /** Como atacar a questão, passo a passo. */
  strategy: string[];
  /** Exemplos autorais, com números próprios: não reproduzem questão da prova. */
  examples: TheoryExample[];
  discursive?: DiscursiveDrill;
  traps: { trap: string; fix: string }[];
}

/** Tema recorrente das discursivas, que não corresponde a um único capítulo da objetiva. */
export interface DiscursiveTheme extends ChapterTheory {
  id: string;
  subject: 'Biologia' | 'Química' | 'Física';
  title: string;
  /** Anos em que o tema apareceu nas discursivas do banco. */
  years: number[];
}
