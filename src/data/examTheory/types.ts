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

/**
 * Um tipo de cobrança, tirado das questões reais da banca: o que ela pede,
 * como resolver e como as alternativas erradas são montadas. As questões
 * citadas ("2024 q65") são conferidas contra o banco no teste.
 */
export interface ExamPattern {
  title: string;
  /** Questões reais deste tipo, no formato "ano qN". */
  questions: string[];
  asks: string;
  solve: string[];
  /** Como a banca monta as alternativas erradas neste tipo. */
  distractors: string;
}

export interface ChapterTheory {
  /** Tipos de cobrança vistos nas provas reais, com a resolução de cada um. */
  patterns?: ExamPattern[];
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

/** Parágrafo de uma redação-modelo, com o que ele faz em cada critério. */
export interface EssayParagraph {
  role: 'Introdução' | 'Desenvolvimento 1' | 'Desenvolvimento 2' | 'Conclusão';
  text: string;
  /** O que este parágrafo garante na grade (Tema, Estrutura, Língua, Coesão). */
  doesWhat: string[];
}

/** Redação-modelo autoral para um tema real da banca. */
export interface EssayModel {
  year: number;
  theme: string;
  /** A forma da frase temática decide a forma da tese. */
  shape: string;
  thesis: string;
  /** Riscos de fuga parcial específicos deste recorte. */
  recorteTraps: string[];
  paragraphs: EssayParagraph[];
  /** Repertório usado, com o que cada item prova. */
  repertoire: { item: string; proves: string }[];
}
