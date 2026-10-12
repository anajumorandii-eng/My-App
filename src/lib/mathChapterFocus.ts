/**
 * Título e pergunta central por capítulo, para as cenas e instrumentos de
 * Matemática que atendem mais de um capítulo.
 *
 * A varredura do lote de Matemática achou sete pares de capítulos abrindo a
 * prancha com o mesmo título e a mesma pergunta: "Introdução às Sequências" e
 * "Sequências" liam ambos "PA e PG", "Funções Trigonométricas" e
 * "Transformações Trigonométricas" ambos "Amplitude e período…". É o defeito de
 * "Inversão de Funções" abrindo "Função logarítmica" repetido em escala: a cena
 * pode ser compartilhada, porque o objeto é o mesmo, mas a leitura central tem
 * de ser a do capítulo. Cada texto abaixo sai das seções e da pergunta de
 * recuperação do próprio capítulo, não da família.
 *
 * Módulo puro, para o teste conferir que nenhum par volta a coincidir.
 */
export interface ChapterFocus {
  title: string;
  subtitle: string;
}

export const MATH_CHAPTER_FOCUS: Record<string, ChapterFocus> = {
  'summary-matematica-introducao-as-sequencias': {
    title: 'Ler o padrão da sequência',
    subtitle: 'Diferença constante ou razão constante: o que se repete entre um termo e o próximo?',
  },
  'summary-matematica-sequencias': {
    title: 'Recorrência, lei explícita e soma',
    subtitle: 'Do termo anterior à fórmula do n-ésimo termo, e da soma parcial ao limite da série.',
  },
  'summary-matematica-introducao-as-tecnicas-de-contagem': {
    title: 'Princípio multiplicativo',
    subtitle: 'Etapas sucessivas multiplicam; alternativas que se excluem somam. Restrições vêm primeiro.',
  },
  'summary-matematica-tecnicas-de-contagem': {
    title: 'Permutação, arranjo ou combinação',
    subtitle: 'Uma pergunta decide a fórmula: trocar a ordem gera um caso novo?',
  },
  'summary-matematica-a-trigonometria-dos-numeros-reais': {
    title: 'Do triângulo ao ciclo',
    subtitle: 'Radianos dão a volta; o quadrante decide o sinal de seno e cosseno.',
  },
  'summary-matematica-a-relacao-fundamental-da-trigonometria': {
    title: 'sen² x + cos² x = 1',
    subtitle: 'É Pitágoras no ciclo de raio 1: conhecido um, o outro sai a menos do sinal, que vem do quadrante.',
  },
  'summary-matematica-funcoes-trigonometricas': {
    title: 'Gráficos de seno e cosseno',
    subtitle: 'Em a·sen(bx), a estica a imagem e b muda o período para 2π/b: um não mexe no outro.',
  },
  'summary-matematica-transformacoes-trigonometricas': {
    title: 'Soma de arcos e arco duplo',
    subtitle: 'sen(a + b) não é sen a + sen b; com b = 2 a curva de sen 2x completa a volta em π.',
  },
  'summary-matematica-introducao-as-funcoes': {
    title: 'Domínio, imagem e gráfico',
    subtitle: 'Cada x do domínio tem uma única imagem; ler o gráfico é ler esse par.',
  },
  'summary-matematica-funcao-constante-e-funcao-afim': {
    title: 'Taxa de variação constante',
    subtitle: 'O coeficiente angular é quanto y muda por unidade de x; o linear é onde a reta corta o eixo y.',
  },
  'summary-matematica-polinomios': {
    title: 'Grau, divisão e teorema do resto',
    subtitle: 'O resto da divisão por (x − a) é P(a); se P(a) = 0, a é raiz e a curva cruza o eixo ali.',
  },
  'summary-matematica-equacoes-polinomiais': {
    title: 'Raízes e relações de Girard',
    subtitle: 'Achar uma raiz baixa o grau; soma e produto das raízes saem dos coeficientes.',
  },
  'summary-matematica-a-geometria-dos-numeros-complexos': {
    title: 'Forma trigonométrica e De Moivre',
    subtitle: 'Módulo e argumento localizam z; multiplicar complexos multiplica módulos e soma argumentos.',
  },
  'summary-matematica-numeros-complexos': {
    title: 'A unidade imaginária no plano',
    subtitle: 'O que um número complexo é, visto como ponto, e o que o conjugado espelha?',
  },
};

export function chapterFocus(summaryId: string, fallback: ChapterFocus): ChapterFocus {
  return MATH_CHAPTER_FOCUS[summaryId] ?? fallback;
}
