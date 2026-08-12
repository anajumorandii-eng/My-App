// Fonte: relatório "Anglo Analisa Região Sudeste" — incidência de temas por
// vestibular nas provas de 2023-2025. Percentuais são o ano mais recente
// disponível (2025) ou, quando os anos empatam, a leitura geral do gráfico.

export interface TopicIncidence {
  theme: string;
  percent: number;
}

export interface BoardPriorities {
  board: string;
  topics: TopicIncidence[];
}

export interface SubjectPriorities {
  subject: string;
  regionalSummary: TopicIncidence[];
  byBoard: BoardPriorities[];
}

// Vestibulares que a Ana Júlia vai prestar, na ordem em que devem aparecer em destaque.
export const targetExamBoards = ['Fuvest', 'Unicamp', 'Famerp', 'Unifesp'];

// Bancas presentes no relatório mas fora do foco direto — mostradas como contexto extra.
export const extraExamBoards = ['Famema', 'UEMG'];

export const examPriorities: SubjectPriorities[] = [
  {
    subject: 'Biologia',
    regionalSummary: [
      { theme: 'Ecologia', percent: 18.5 },
      { theme: 'Fisiologia animal', percent: 14 },
      { theme: 'Evolução', percent: 13 },
      { theme: 'Genética', percent: 10.5 },
      { theme: 'Estrutura e fisiologia celular', percent: 8 },
      { theme: 'Metabolismo energético', percent: 5 },
      { theme: 'Animais', percent: 4.5 },
      { theme: 'Código genético e síntese proteica', percent: 4.5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Vírus', percent: 33.3 },
        { theme: 'Ecologia', percent: 16.6 },
        { theme: 'Fisiologia vegetal', percent: 16.6 },
        { theme: 'Estrutura e fisiologia celular', percent: 16.6 },
        { theme: 'Biotecnologia', percent: 16.6 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Genética', percent: 14.3 },
        { theme: 'Ecologia', percent: 14.3 },
        { theme: 'Evolução', percent: 14.3 },
        { theme: 'Estrutura e fisiologia celular', percent: 14.3 },
        { theme: 'Fisiologia vegetal', percent: 14.3 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Fisiologia animal', percent: 27.3 },
        { theme: 'Ecologia', percent: 18 },
        { theme: 'Evolução', percent: 18 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Genética', percent: 12.5 },
        { theme: 'Fisiologia animal', percent: 12.5 },
        { theme: 'Ecologia', percent: 12.5 },
        { theme: 'Evolução', percent: 12.5 },
      ]},
    ],
  },
  {
    subject: 'Matemática',
    regionalSummary: [
      { theme: 'Geometria plana', percent: 11 },
      { theme: 'Geometria espacial', percent: 8.7 },
      { theme: 'Funções', percent: 7 },
      { theme: 'Porcentagem', percent: 6.5 },
      { theme: 'Trigonometria', percent: 6.2 },
      { theme: 'Equações de 1º e 2º grau', percent: 6 },
      { theme: 'Análise combinatória', percent: 5.8 },
      { theme: 'Teoria dos números inteiros', percent: 4.5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Geometria analítica', percent: 14 },
        { theme: 'Interpretação e análise de dados', percent: 14 },
        { theme: 'Logaritmos e exponenciais', percent: 14 },
        { theme: 'Trigonometria', percent: 14 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Geometria plana', percent: 15.7 },
        { theme: 'Trigonometria', percent: 10.7 },
        { theme: 'Equações de 1º e 2º grau', percent: 10.5 },
        { theme: 'Funções', percent: 10.5 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Geometria plana', percent: 20 },
        { theme: 'Funções', percent: 20 },
        { theme: 'Porcentagem', percent: 13.3 },
        { theme: 'Equações de 1º e 2º grau', percent: 13.3 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Geometria espacial', percent: 25 },
        { theme: 'Análise combinatória', percent: 12.5 },
        { theme: 'Potenciação e radiciação', percent: 12.5 },
        { theme: 'Trigonometria', percent: 12.5 },
      ]},
    ],
  },
  {
    subject: 'Física',
    regionalSummary: [
      { theme: 'Eletrodinâmica', percent: 11.5 },
      { theme: 'Ondulatória', percent: 10 },
      { theme: 'Trabalho e energia', percent: 9 },
      { theme: 'Óptica geométrica', percent: 8 },
      { theme: 'Calorimetria', percent: 7.5 },
      { theme: 'Dinâmica impulsiva', percent: 6.5 },
      { theme: 'Cinemática vetorial', percent: 6 },
      { theme: 'Física moderna', percent: 5 },
      { theme: 'Gravitação', percent: 5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Física moderna', percent: 27 },
        { theme: 'Ondulatória', percent: 18 },
        { theme: 'Óptica geométrica', percent: 8 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Eletrodinâmica', percent: 28.6 },
        { theme: 'Cinemática escalar', percent: 14.3 },
        { theme: 'Dinâmica do movimento retilíneo', percent: 14.3 },
        { theme: 'Óptica geométrica', percent: 14.3 },
        { theme: 'Trabalho e energia', percent: 14.3 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Cinemática escalar', percent: 10 },
        { theme: 'Dinâmica', percent: 10 },
        { theme: 'Eletrodinâmica', percent: 10 },
        { theme: 'Termologia', percent: 10 },
        { theme: 'Óptica', percent: 10 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Movimentos oscilatórios', percent: 20 },
        { theme: 'Cinemática vetorial', percent: 20 },
        { theme: 'Dinâmica impulsiva', percent: 20 },
        { theme: 'Gravitação', percent: 20 },
        { theme: 'Ondulatória', percent: 20 },
      ]},
    ],
  },
  {
    subject: 'Química',
    regionalSummary: [
      { theme: 'Análises quantitativas e estequiometria', percent: 11.5 },
      { theme: 'Polaridade das ligações e geometria molecular', percent: 11 },
      { theme: 'Modelos atômicos e estrutura do átomo', percent: 10 },
      { theme: 'Funções, nomenclatura e propriedades orgânicas', percent: 8.3 },
      { theme: 'Equilíbrio químico', percent: 8 },
      { theme: 'Termoquímica', percent: 6 },
      { theme: 'Cinética química', percent: 5.5 },
      { theme: 'Soluções', percent: 5.5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Cinética química', percent: 16.7 },
        { theme: 'Análises quantitativas e estequiometria', percent: 11 },
        { theme: 'Equilíbrio químico', percent: 11 },
        { theme: 'Oxirredução', percent: 11 },
        { theme: 'Termoquímica', percent: 11 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Análises quantitativas e estequiometria', percent: 17 },
        { theme: 'Química ambiental', percent: 17 },
        { theme: 'Soluções', percent: 17 },
        { theme: 'Equilíbrio químico', percent: 17 },
        { theme: 'Química inorgânica', percent: 17 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Equilíbrio químico', percent: 23 },
        { theme: 'Análises quantitativas e estequiometria', percent: 15.3 },
        { theme: 'Química inorgânica', percent: 9 },
        { theme: 'Radioatividade', percent: 9 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Eletroquímica', percent: 14.3 },
        { theme: 'Equilíbrio químico', percent: 14.3 },
        { theme: 'Funções e nomenclatura orgânicas', percent: 14.3 },
        { theme: 'Gases', percent: 14.3 },
        { theme: 'Oxirredução', percent: 14.3 },
      ]},
    ],
  },
  {
    subject: 'Língua Portuguesa',
    regionalSummary: [
      { theme: 'Apreensão e compreensão de sentido', percent: 24 },
      { theme: 'Leitura de textos literários', percent: 16 },
      { theme: 'Domínio da norma culta', percent: 9 },
      { theme: 'História da literatura e escolas literárias', percent: 8 },
      { theme: 'Análise sintática', percent: 8 },
      { theme: 'Obras de leitura obrigatória', percent: 7 },
      { theme: 'Leitura de textos sincréticos e não verbais', percent: 6.5 },
      { theme: 'Semântica', percent: 6 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Apreensão e compreensão de sentido', percent: 34 },
        { theme: 'Obras de leitura obrigatória', percent: 25 },
        { theme: 'Leitura de textos literários', percent: 18.5 },
        { theme: 'Leitura de textos sincréticos e não verbais', percent: 12.5 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Apreensão e compreensão de sentido', percent: 18 },
        { theme: 'Leitura de textos literários', percent: 18 },
        { theme: 'Obras de leitura obrigatória', percent: 18 },
        { theme: 'Domínio da norma culta', percent: 9 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Apreensão e compreensão de sentido', percent: 18.7 },
        { theme: 'Análise sintática', percent: 18.7 },
        { theme: 'Semântica', percent: 12.5 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Apreensão e compreensão de sentido', percent: 19 },
        { theme: 'Análise sintática', percent: 14.3 },
        { theme: 'Domínio da norma culta', percent: 14.3 },
      ]},
    ],
  },
  {
    subject: 'Língua Inglesa',
    regionalSummary: [
      { theme: 'Compreensão global', percent: 38.5 },
      { theme: 'Compreensão específica', percent: 20 },
      { theme: 'Reflexão pós-leitura', percent: 12.5 },
      { theme: 'Vocabulário', percent: 7.5 },
      { theme: 'Gramática', percent: 7 },
      { theme: 'Estruturas linguísticas', percent: 3.5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Compreensão específica', percent: 78 },
        { theme: 'Compreensão global', percent: 22 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Compreensão global', percent: 45.5 },
        { theme: 'Reflexão pós-leitura', percent: 36.5 },
        { theme: 'Gramática', percent: 9 },
        { theme: 'Vocabulário', percent: 9 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Compreensão global', percent: 40 },
        { theme: 'Gramática', percent: 20 },
      ]},
      { board: 'Unifesp', topics: [
        { theme: 'Compreensão global', percent: 30 },
        { theme: 'Compreensão específica', percent: 20 },
        { theme: 'Reflexão pós-leitura', percent: 10 },
        { theme: 'Vocabulário', percent: 10 },
      ]},
    ],
  },
  {
    subject: 'História',
    regionalSummary: [
      { theme: 'Brasil República', percent: 21 },
      { theme: 'Idade Contemporânea', percent: 18 },
      { theme: 'Idade Moderna', percent: 11 },
      { theme: 'Idade Média', percent: 10 },
      { theme: 'Idade Antiga', percent: 7 },
      { theme: 'Brasil Império', percent: 6.5 },
      { theme: 'Brasil Colônia', percent: 6 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Idade Média', percent: 18 },
        { theme: 'Historicidade', percent: 18 },
        { theme: 'Idade Contemporânea', percent: 18 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Idade Moderna', percent: 50 },
        { theme: 'Brasil República', percent: 33.3 },
        { theme: 'Idade Contemporânea', percent: 16.6 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Brasil República', percent: 27 },
        { theme: 'Brasil Colônia', percent: 18 },
      ]},
    ],
  },
  {
    subject: 'Geografia',
    regionalSummary: [
      { theme: 'Problemas socioambientais', percent: 9 },
      { theme: 'Climatologia', percent: 8.5 },
      { theme: 'Geografia econômica', percent: 6.5 },
      { theme: 'Globalização', percent: 6.5 },
      { theme: 'Geografia da população', percent: 5.5 },
      { theme: 'Hidrogeografia', percent: 5 },
      { theme: 'Cartografia', percent: 5 },
    ],
    byBoard: [
      { board: 'Fuvest', topics: [
        { theme: 'Geografia da população', percent: 13.3 },
        { theme: 'Geografia econômica', percent: 10 },
        { theme: 'Regionalização', percent: 10 },
      ]},
      { board: 'Unicamp', topics: [
        { theme: 'Globalização', percent: 21.4 },
        { theme: 'Tensões globais', percent: 14.3 },
      ]},
      { board: 'Famerp', topics: [
        { theme: 'Geografia agrária', percent: 12.5 },
        { theme: 'Globalização', percent: 12.5 },
        { theme: 'Cartografia', percent: 12.5 },
      ]},
    ],
  },
];
