import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { findBoard } from '../visual-boards/registry';
import { INSTRUMENTS, findInstrument } from './registry';

describe('registro de instrumentos', () => {
  it('não registra instrumento que nenhum capítulo alcança', () => {
    for (const item of INSTRUMENTS) {
      const alcancados = interactiveSummaries.filter((s) => findInstrument(s)?.id === item.id);
      expect(alcancados.length, `instrumento "${item.id}" não alcança capítulo nenhum`).toBeGreaterThan(0);
    }
  });

  it('não empresta instrumento de uma matéria para capítulo de outra', () => {
    for (const item of INSTRUMENTS) {
      const alheios = interactiveSummaries.filter((s) => s.subject !== item.subject);
      for (const s of alheios) expect(findInstrument(s)?.id).not.toBe(item.id);
    }
  });

  it('mantém id único por instrumento', () => {
    const ids = INSTRUMENTS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('não disputa capítulo com prancha autoral', () => {
    // A cena desenhada à mão sempre ganha, e a tela consulta os dois registros
    // nessa ordem. Um capítulo que casasse com os dois esconderia a cena atrás
    // de um instrumento genérico — que é justamente o que não pode acontecer.
    const disputados = interactiveSummaries.filter((s) => findBoard(s) && findInstrument(s));
    expect(disputados.map((s) => s.topic)).toEqual([]);
  });

  it('cada instrumento de sólidos alcança exatamente o capítulo de que é objeto', () => {
    const esperado: Record<string, string> = {
      'cubos-paralelepipedos': 'Cubos e Paralelepípedos',
      prismas: 'Prismas',
      piramides: 'Pirâmides',
      'solidos-de-revolucao': 'Sólidos de Revolução',
      'razoes-entre-volumes': 'Razões entre Volumes de Sólidos',
    };
    for (const [id, topico] of Object.entries(esperado)) {
      const alcancados = interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic);
      expect(alcancados, id).toEqual([topico]);
    }
  });

  it('cada configuração de geometria plana alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'geometria-plana-fundamentos': 'Introdução à Geometria Plana',
      'angulos-triangulo': 'Ângulos em Triângulos',
      'angulos-poligono': 'Ângulos em Polígonos',
      'angulos-circunferencia': 'Ângulos e Circunferências',
      'simetrias-congruencias': 'Simetrias e Congruências',
      'simetrias-i': 'Identificação de Simetrias I',
      'simetrias-ii': 'Identificação de Simetrias II',
      'geometria-proporcionalidade': 'A Geometria da Proporcionalidade',
      'semelhanca-triangulos': 'Semelhança de Triângulos',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada instrumento de medidas e áreas alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'triangulo-retangulo-metrico': 'Triângulo Retângulo',
      'geometria-metrica-plana': 'A Geometria Métrica Plana',
      'areas-poligonos': 'Áreas de Polígonos',
      'area-circulo-partes': 'Área do Círculo e de suas Partes',
      'razoes-areas-planas': 'Razões entre Áreas de Figuras Planas',
      'areas-figuras-planas': 'Áreas de Figuras Planas',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada configuração de álgebra alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'tecnicas-algebricas': 'Técnicas Algébricas',
      igualdades: 'Igualdades',
      desigualdades: 'Desigualdades',
      'modelagem-algebrica-i': 'Modelagem Algébrica de Problemas I',
      'modelagem-algebrica-ii': 'Modelagem Algébrica de Problemas II',
      'representacao-geometrica-inequacoes': 'Representação Geométrica de Inequações',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada configuração de matrizes e sistemas alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'sistemas-equacoes': 'Sistemas de Equações',
      'tabelas-matrizes': 'Tabelas e Matrizes',
      'multiplicacao-matrizes': 'Multiplicação de Matrizes',
      determinantes: 'Determinantes',
      'discussao-sistemas': 'Discussão de Sistemas Lineares',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('separa PA de PG pelo tópico e pela regra', () => {
    expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === 'progressao-aritmetica').map((s) => s.topic)).toEqual(['Progressão Aritmética']);
    expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === 'progressao-geometrica').map((s) => s.topic)).toEqual(['Progressão Geométrica']);
  });

  it('mantém os instrumentos de termodinâmica nos três capítulos que eles modelam', () => {
    const esperado: Record<string, string> = {
      'trabalho-gas': 'Trabalho da Força de Pressão do Gás',
      'primeira-lei': 'Primeira Lei da Termodinâmica',
      'ciclo-carnot': 'Máquinas Térmicas e Ciclo de Carnot',
    };
    for (const [id, topico] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topico]);
    }
    const aplicada = interactiveSummaries.find((s) => s.topic === 'Primeira Lei da Termodinâmica Aplicada a Algumas Transformações Particulares');
    expect(findInstrument(aplicada!)).toBeNull();
  });

  it('mantém cada instrumento elétrico no capítulo da relação que ele mede', () => {
    const esperado: Record<string, string> = {
      'corrente-eletrica': 'Corrente Elétrica',
      'potencia-eletrica': 'Potência Elétrica',
      resistores: 'Resistores',
      'leis-kirchhoff': 'Eletrodinâmica: as Leis de Kirchhoff',
      capacitores: 'Capacitores',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('mantém cada instrumento eletrostático no fenômeno que ele representa', () => {
    const esperado: Record<string, string> = {
      'lei-coulomb': 'Força Elétrica: Lei de Coulomb',
      'campo-eletrico': 'Campo Elétrico',
      'potencial-eletrico': 'Energia Potencial e Potencial Elétrico',
      'campo-uniforme': 'Campo Elétrico Uniforme: Abordagem Escalar e Abordagem Vetorial',
      'dinamica-cargas': 'Dinâmica das Cargas Elétricas',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('mantém cada instrumento ondulatório no capítulo de seu fenômeno', () => {
    const esperado: Record<string, string> = {
      'intensidade-sonora': 'Intensidade Sonora',
      'interferencia-ondas': 'Interferência de Ondas: Análise Quantitativa, Aplicações e Batimento',
      'ondas-cordas': 'Ondas Estacionárias em Cordas',
      'efeito-doppler': 'Efeito Doppler: Descrição e Estudo Quantitativo',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('mantém cada instrumento magnético no capítulo que descreve sua interação', () => {
    const esperado: Record<string, string> = {
      'fio-espira': 'Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações',
      'carga-em-b': 'Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme',
      'fios-paralelos': 'Análise de Força Magnética em Fios Percorridos por Correntes Contínuas',
      lenz: 'Indução Eletromagnética: Lei de Lenz',
      'gerador-inducao': 'Indução Eletromagnética: Análise da Corrente Induzida em Geradores',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('mantém cada instrumento óptico no capítulo da construção de raios correspondente', () => {
    const esperado: Record<string, string> = {
      'espelho-plano': 'Reflexão em Superfícies Planas',
      'espelho-esferico': 'Reflexão em Superfícies Esféricas',
      refracao: 'Refração: Fundamentos, Leis e Aplicações',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('mantém os instrumentos finais de mecânica em suas condições físicas', () => {
    const esperado: Record<string, string> = {
      'plano-vertical': 'Analisando Movimentos Contidos em um Plano Vertical',
      mhs: 'Movimento Harmônico Simples (MHS)',
      'energia-potencial': 'Trabalho e Energia: o Teorema da Energia Potencial',
      'nao-conservativo': 'Sistemas Conservativos e Sistemas Não Conservativos',
      'massa-energia': 'Equivalência Massa-Energia',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos finais de ondas nos fenômenos específicos', () => {
    const esperado: Record<string, string> = {
      'eco-refracao': 'Reflexão, Eco, Reverberação e Refração de Ondas',
      'difracao-polarizacao': 'Fenômenos Ondulatórios: Difração, Polarização e Ressonância',
      'ondas-tubos': 'Ondas Estacionárias em Tubos',
      'fisica-quantica': 'Noções Básicas de Física Quântica',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de eletroquímica nos cinco processos que modelam', () => {
    const esperado: Record<string, string> = {
      redox: 'Processos de Oxirredução',
      'pilhas-baterias': 'Introdução ao Estudo das Pilhas e Baterias',
      'eletroquimica-espontanea': 'Eletroquímica de Processos Espontâneos',
      eletrolise: 'Eletroquímica de Processos não Espontâneos',
      'faraday-metalurgia': 'Aspectos Quantitativos da Eletroquímica e Metalurgia',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de biologia nos mecanismos restantes', () => {
    const esperado: Record<string, string> = {
      'acidos-nucleicos': 'Ácidos Nucleicos',
      'ligacao-genica': 'Ligação Gênica',
      'fisiologia-respiracao': 'Fisiologia da Respiração',
      'hormonios-vegetais': 'Fisiologia Vegetal: Hormônios Vegetais',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de geografia nos cinco sistemas espaciais', () => {
    const esperado: Record<string, string> = { 'fusos-horarios': 'Sistema de Fusos Horários', 'linguagem-cartografica': 'Linguagem Cartográfica', 'agua-superficie': 'Água na Superfície Terrestre', 'matriz-energetica': 'Matriz Energética', 'redes-mundiais': 'Geografia das Redes Mundiais' };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de história nos cinco processos comparados', () => {
    const esperado: Record<string, string> = { 'america-xix': 'América no Século XIX', 'segunda-guerra': 'Segunda Guerra Mundial (1939-1945)', 'guerra-fria': 'Guerra Fria', 'interiorizacao-colonial': 'A Interiorização da Colonização', 'mineracao-colonial': 'A Mineração no Brasil Colonial' };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de linha do tempo nos dez capítulos de história que cobrem', () => {
    const esperado: Record<string, string> = {
      'grandes-revolucoes-seculo-xx': 'Grandes Revoluções do Século XX',
      'america-latina-seculo-xx': 'América Latina no Século XX',
      'dinamica-interna-colonizacao': 'Dinâmica Interna da Colonização',
      'disputas-europeias-brasil-colonial': 'Disputas Europeias no Brasil Colonial',
      'segundo-reinado': 'Brasil Império: Segundo Reinado (1840-1889)',
      'republica-da-espada': 'A República da Espada',
      'republica-liberal-democracia': 'República Liberal (1945-1964): Democracia em Tempos de Guerra Fria',
      'republica-liberal-desenvolvimentismo': 'República Liberal (1945-1964): Desenvolvimentismo e Populismo',
      'regime-militar-i': 'Regime Militar (1964-1985) I',
      'regime-militar-ii': 'Regime Militar (1964-1985) II',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos de gramática nas cinco operações linguísticas', () => {
    const esperado: Record<string, string> = { 'sintagma-nominal': 'Artigo, Numeral e Adjetivo no Sintagma Nominal', concordancia: 'Concordância', 'pontuacao-i': 'Pontuação I: Princípios para o Uso da Vírgula', crase: 'Crase', 'vozes-verbais': 'Vozes Verbais' };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os 16 instrumentos de gramática da rodada de maximização de cobertura em exatamente seus capítulos', () => {
    // Decisão de 21/09/2026 da Ana Júlia: instrumento genérico de leitura de
    // frase, aceito onde não há objeto manipulável clássico. "verbo-sintaxe-
    // -oracao" precisa ficar fora de "verbo" (transitividade ≠ tempo/aspecto).
    const esperado: Record<string, string> = {
      'lingua-sistema': 'Língua: um Sistema Complexo',
      'substantivo-visao-enunciador': 'Substantivo: os Nomes e a Visão do Enunciador',
      'tipos-de-texto': 'Tipos de Texto: Explorando Elementos Concretos e Conceitos Abstratos',
      'adverbio-circunstanciadores': 'Advérbio e Locuções Adverbiais: Circunstanciadores',
      'verbo-sintaxe-oracao': 'Verbo e Sintaxe da Oração',
      'significados-implicitos': 'Significados Implícitos',
      'tipos-de-discurso': 'Tipos de Discurso',
      'pontuacao-ii': 'Pontuação II: Vírgula entre Orações e Outros Sinais de Pontuação',
      'lexico-em-contexto': 'O Léxico em Contexto: Variadas Possibilidades Semânticas',
      'mecanismo-regencia': 'Mecanismo de Regência',
      'formacao-palavras': 'Processos de Formação de Palavras',
      'funcoes-sintaticas-nominais': 'Funções Sintáticas Nominais e Vocativo',
      'tipos-de-sujeito': 'Tipos de Sujeito',
      'oracoes-substantivas': 'Orações Substantivas',
      'oracoes-adjetivas': 'Orações Adjetivas',
      'oracoes-adverbiais': 'Orações Adverbiais',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    // "Verbo" continua exclusivo de verbal-aspect: os dois capítulos não podem
    // colidir no mesmo instrumento.
    const verbo = interactiveSummaries.find((s) => s.subject === 'Gramática' && s.topic === 'Verbo');
    expect(findInstrument(verbo!)?.id).toBe('verbo');
  });

  it('mantém os instrumentos de inglês nos cinco textos que orientam a leitura', () => {
    const esperado: Record<string, string> = { 'songs-poems': 'Text Comprehension: Songs and Poems', 'calories-energy': 'Text Comprehension: Calories and Energy', earthquakes: 'Text Comprehension: Earthquakes', 'greenhouse-gases': 'Text Comprehension: Ecology (Greenhouse Gases)', 'human-brain': 'Text Comprehension: The Human Brain' };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });

  it('mantém os instrumentos fundamentais de redação nas cinco operações que modelam', () => {
    const esperado: Record<string, string> = {
      'dissertacao-mitos': 'A Dissertação no Vestibular: Mitos e Verdades',
      'avaliacao-dissertacao': 'O que se Avalia na Dissertação: Competências e Habilidades',
      'organizacao-ideias': 'Organizando as Ideias: Brainstorm e Mind Maps',
      repertorio: 'Repertório: o Diferencial de Redações de Sucesso',
      'eixos-tematicos': 'Qual Será o Tema deste Ano: Grandes Eixos Temáticos',
    };
    for (const [id, topic] of Object.entries(esperado)) expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
  });
});
