import { Topic, TopicMastery, UserProfile, ErrorLog, Question, PodcastEpisode, StudyMethod, BacklogItem, StudentGoals } from '../types';

// Currículo real, extraído dos sumários das apostilas (Anglo/Plural, cadernos de
// estudo 1-4, 1º e 2º semestres de 2026) da aluna. Agrupado por assunto/módulo —
// não por capítulo — para casar com a granularidade do plano de estudos.
export const mockTopics: Topic[] = [
  // Biologia
  {
    id: 'bio_estrutura_fisio_celular', name: 'Estrutura e Fisiologia Celular', subject: 'Biologia', prerequisites: [],
    chapters: [
      'Origem da Vida e as Primeiras Células', 'Composição Química Celular: Compostos Inorgânicos',
      'Composição Química Celular: Carboidratos e Lipídios', 'Composição Química Celular: Proteínas e sua Função Estrutural',
      'Membranas Celulares', 'Citoplasma: Estrutura e Componentes I', 'Citoplasma: Estrutura e Componentes II',
      'Núcleo Celular',
    ],
  },
  {
    id: 'bio_metabolismo_energetico', name: 'Metabolismo Energético', subject: 'Biologia', prerequisites: ['bio_estrutura_fisio_celular'],
    chapters: [
      'Proteínas: Enzimas', 'Bioenergética: Fermentação e Respiração', 'Bioenergética: Fotossíntese e Quimiossíntese',
    ],
  },
  {
    id: 'bio_codigo_genetico_sintese', name: 'Código Genético e Síntese Proteica', subject: 'Biologia', prerequisites: ['bio_estrutura_fisio_celular'],
    chapters: ['Ácidos Nucleicos', 'Divisão Celular', 'Mutações Cromossômicas e Gametogênese'],
  },
  {
    id: 'bio_biotecnologia', name: 'Biotecnologia', subject: 'Biologia', prerequisites: ['bio_codigo_genetico_sintese'],
    chapters: ['Biotecnologia'],
  },
  {
    id: 'bio_genetica', name: 'Genética', subject: 'Biologia', prerequisites: ['bio_codigo_genetico_sintese'],
    chapters: [
      'Introdução à Genética', 'Alelos Múltiplos e Herança dos Grupos Sanguíneos', 'Herança Sexual',
      'Segunda Lei de Mendel', 'Segunda Lei de Mendel e Interação Gênica', 'Ligação Gênica', 'Mutações Gênicas',
    ],
  },
  {
    id: 'bio_evolucao', name: 'Evolução', subject: 'Biologia', prerequisites: ['bio_genetica'],
    chapters: ['Evolução Biológica: Construção Histórica', 'Mecanismos da Evolução Biológica'],
  },
  {
    id: 'bio_ecologia', name: 'Ecologia', subject: 'Biologia', prerequisites: [],
    chapters: [
      'Introdução à Ecologia', 'Dinâmica de Populações', 'Espécies Invasoras e Controle Biológico',
      'Sucessão Ecológica', 'Ciclos Biogeoquímicos – Ciclo do Carbono', 'Ciclo do Nitrogênio',
      'Ciclo Hidrológico e Poluição da Água', 'Eutrofização', 'Poluição do Ar', 'Biomagnificação',
      'Poluição: Aquecimento Global, POPs e Biorremediação', 'Biomas Brasileiros',
    ],
  },
  {
    id: 'bio_zoologia', name: 'Zoologia', subject: 'Biologia', prerequisites: [],
    chapters: [
      'Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética',
      'Protozoários e Protozooses', 'Poríferos e Cnidários',
      'Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos', 'Moluscos', 'Anelídeos',
      'Artrópodes: Insetos, Crustáceos e Miriápodes', 'Artrópodes: Aracnídeos', 'Equinodermos',
      'Introdução aos Cordados e os Peixes', 'Cordados Tetrápodes',
    ],
  },
  {
    id: 'bio_botanica', name: 'Botânica', subject: 'Biologia', prerequisites: [],
    chapters: [
      'Fungos', 'Algas', 'Ciclos de Vida', 'Plantas Terrestres I: Briófitas e Pteridófitas',
      'Plantas Terrestres II: Gimnospermas e Angiospermas',
    ],
  },
  {
    id: 'bio_microbiologia', name: 'Microbiologia e Virologia', subject: 'Biologia', prerequisites: ['bio_estrutura_fisio_celular'],
    chapters: ['Procariotos', 'Vírus'],
  },
  {
    id: 'bio_fisio_animal', name: 'Fisiologia Animal e Humana', subject: 'Biologia', prerequisites: ['bio_estrutura_fisio_celular'],
    chapters: [
      'Embriologia Animal', 'Fisiologia da Sustentação e da Locomoção', 'Fisiologia da Digestão',
      'Sangue e Imunologia', 'Coração e Vasos Sanguíneos', 'Fisiologia da Respiração', 'Fisiologia da Excreção',
      'Fisiologia da Coordenação Nervosa I', 'Coordenação Nervosa II', 'Sistemas Sensoriais: Visão e Audição',
      'Coordenação Endócrina I', 'Coordenação Endócrina II', 'Reprodução Humana e Métodos Contraceptivos',
    ],
  },
  {
    id: 'bio_fisio_vegetal', name: 'Fisiologia Vegetal', subject: 'Biologia', prerequisites: ['bio_botanica'],
    chapters: [
      'Histologia e Morfologia Vegetal', 'Morfofisiologia Vegetal: Caules e Folhas',
      'Traqueófitas: Transpiração e Reposição Rápida de Água', 'Fisiologia Vegetal: Transporte no Floema',
      'Fisiologia Vegetal: Hormônios Vegetais',
    ],
  },
  // Matemática
  {
    id: 'mat_aritmetica_proporcionalidade', name: 'Aritmética e Proporcionalidade', subject: 'Matemática', prerequisites: [],
    chapters: ['Potências e Radicais', 'Razão e Proporção', 'Porcentagem'],
  },
  {
    id: 'mat_teoria_numeros', name: 'Teoria dos Números Inteiros', subject: 'Matemática', prerequisites: [],
    chapters: ['O Sistema de Numeração Decimal', 'Introdução à Teoria dos Números Inteiros'],
  },
  {
    id: 'mat_sequencias_matrizes', name: 'Sequências, Matrizes e Sistemas Lineares', subject: 'Matemática', prerequisites: ['mat_aritmetica_proporcionalidade'],
    chapters: [
      'Introdução às Sequências', 'Progressão Aritmética', 'Progressão Geométrica', 'Sequências',
      'Sistemas de Equações', 'Tabelas e Matrizes', 'Multiplicação de Matrizes', 'Determinantes',
      'Discussão de Sistemas Lineares', 'Médias',
    ],
  },
  {
    id: 'mat_combinatoria', name: 'Análise Combinatória', subject: 'Matemática', prerequisites: ['mat_aritmetica_proporcionalidade'],
    chapters: ['Introdução às Técnicas de Contagem', 'O Problema da Fila', 'O Problema do Grupo', 'Técnicas de Contagem'],
  },
  {
    id: 'mat_dados_probabilidade', name: 'Probabilidade e Interpretação de Dados', subject: 'Matemática', prerequisites: ['mat_combinatoria'],
    chapters: [
      'Introdução às Probabilidades', 'Operações com Probabilidades', 'Eventos Disjuntos e Eventos Independentes',
      'Estatística Descritiva',
    ],
  },
  {
    id: 'mat_geometria_plana', name: 'Geometria Plana', subject: 'Matemática', prerequisites: [],
    chapters: [
      'Introdução à Geometria Plana', 'Ângulos em Triângulos', 'Ângulos em Polígonos', 'Ângulos e Circunferências',
      'Simetrias e Congruências', 'Identificação de Simetrias I', 'Identificação de Simetrias II',
      'A Geometria da Proporcionalidade', 'Semelhança de Triângulos', 'O Ponto Médio e o Baricentro de um Triângulo',
      'Triângulo Retângulo', 'A Geometria Métrica Plana', 'Áreas de Polígonos', 'Área do Círculo e de suas Partes',
      'Razões entre Áreas de Figuras Planas', 'Áreas de Figuras Planas',
    ],
  },
  {
    id: 'mat_trigonometria', name: 'Trigonometria', subject: 'Matemática', prerequisites: ['mat_geometria_plana'],
    chapters: [
      'Trigonometria no Triângulo Retângulo', 'Relações Trigonométricas em Polígonos',
      'A Trigonometria dos Números Reais', 'Outras Razões Trigonométricas', 'A Relação Fundamental da Trigonometria',
      'Transformações Trigonométricas', 'Funções Trigonométricas',
    ],
  },
  {
    id: 'mat_geometria_espacial', name: 'Geometria Espacial', subject: 'Matemática', prerequisites: ['mat_geometria_plana'],
    chapters: [
      'O Universo Tridimensional', 'Cubos e Paralelepípedos', 'Prismas', 'Pirâmides', 'Sólidos de Revolução',
      'Razões entre Volumes de Sólidos',
    ],
  },
  {
    id: 'mat_geometria_analitica', name: 'Geometria Analítica', subject: 'Matemática', prerequisites: ['mat_geometria_plana'],
    chapters: [
      'Introdução à Geometria Analítica', 'Lugar Geométrico e Equação da Circunferência', 'Estudo Analítico da Reta',
      'Posições Relativas entre Duas Retas', 'Distância entre um Ponto e uma Reta',
      'Posições Relativas entre uma Reta e uma Circunferência', 'Introdução ao Estudo Analítico das Cônicas',
      'Representação Geométrica de Inequações', 'A Geometria dos Números Complexos',
    ],
  },
  {
    id: 'mat_equacoes', name: 'Equações, Desigualdades e Modelagem Algébrica', subject: 'Matemática', prerequisites: ['mat_aritmetica_proporcionalidade'],
    chapters: [
      'Técnicas Algébricas', 'Igualdades', 'Desigualdades', 'Modelagem Algébrica de Problemas I',
      'Equações do 2º Grau', 'Modelagem Algébrica de Problemas II',
    ],
  },
  {
    id: 'mat_funcoes', name: 'Funções', subject: 'Matemática', prerequisites: ['mat_equacoes'],
    chapters: [
      'Introdução às Funções', 'Transformações em Gráficos de Funções', 'Composição de Funções',
      'Inversão de Funções', 'Funções Bijetoras', 'Função Constante e Função Afim', 'Função Quadrática',
      'Estudo do Sinal de Funções',
    ],
  },
  {
    id: 'mat_log_exponenciais', name: 'Logaritmos e Exponenciais', subject: 'Matemática', prerequisites: ['mat_funcoes'],
    chapters: [
      'Introdução ao Modelo Exponencial', 'Introdução aos Logaritmos', 'Equações e Funções Logarítmicas',
      'Modelagem Exponencial de Problemas',
    ],
  },
  {
    id: 'mat_complexos_polinomios', name: 'Números Complexos e Polinômios', subject: 'Matemática', prerequisites: ['mat_equacoes'],
    chapters: ['Módulo de um Número Real', 'Números Complexos', 'Polinômios', 'Equações Polinomiais'],
  },
  // Física
  {
    id: 'fis_cinematica', name: 'Cinemática Escalar', subject: 'Física', prerequisites: ['mat_funcoes'],
    chapters: [
      'Cinemática Escalar. Conceitos Fundamentais', 'Movimento Uniforme', 'Movimento Uniformemente Variado',
      'O Movimento Circular',
    ],
  },
  {
    id: 'fis_cinematica_vetorial', name: 'Cinemática Vetorial', subject: 'Física', prerequisites: ['fis_cinematica'],
    chapters: [
      'Grandezas Físicas e Operações com Vetores', 'Velocidade Vetorial', 'Composição de Movimentos',
      'Aceleração Vetorial',
    ],
  },
  {
    id: 'fis_leis_newton', name: 'Leis de Newton e Dinâmica do Movimento Retilíneo', subject: 'Física', prerequisites: ['fis_cinematica_vetorial'],
    chapters: [
      'Força e seus Tipos', 'Resultante de um Sistema de Forças', 'As Leis de Newton', 'A Força de Contato',
      'Sistema de Corpos Interagindo e os Elementos Transmissores de Força', 'Plano Inclinado',
    ],
  },
  {
    id: 'fis_gravitacao_circular', name: 'Gravitação e Movimento Circular', subject: 'Física', prerequisites: ['fis_leis_newton'],
    chapters: [
      'Leis da Gravitação', 'Dinâmica do Movimento Circular', 'Analisando Movimentos Contidos em um Plano Vertical',
      'Órbitas', 'Balística', 'Movimento Harmônico Simples (MHS)',
    ],
  },
  {
    id: 'fis_dinamica_impulsiva', name: 'Dinâmica Impulsiva', subject: 'Física', prerequisites: ['fis_leis_newton'],
    chapters: ['Impulso e Quantidade de Movimento', 'Sistemas Isolados e a Conservação da Quantidade de Movimento', 'Colisões'],
  },
  {
    id: 'fis_energia', name: 'Dinâmica Energética e Transformações de Energia', subject: 'Física', prerequisites: ['fis_leis_newton'],
    chapters: [
      'Trabalho e Energia: Trabalho de uma Força', 'Trabalho e Energia: Teorema da Energia Cinética',
      'Trabalho e Energia: o Teorema da Energia Potencial', 'Sistemas Conservativos e Sistemas Não Conservativos',
      'Potência, Máquina e Rendimento',
      "A Física por trás da Obtenção de Energia Elétrica, das Quedas-d'Água aos Reatores Nucleares",
      'Equivalência Massa-Energia',
    ],
  },
  {
    id: 'fis_estatica', name: 'Estática dos Corpos Sólidos e dos Fluidos', subject: 'Física', prerequisites: ['fis_leis_newton'],
    chapters: ['Estática', 'Hidrostática: Densidade e Pressão'],
  },
  {
    id: 'fis_calorimetria', name: 'Calorimetria', subject: 'Física', prerequisites: [],
    chapters: [
      'Temperatura, Calor e seus Mecanismos de Transferência', 'Dilatação ou Contração Térmica dos Sólidos e Líquidos',
      'Calor Sensível e Calor Latente',
    ],
  },
  {
    id: 'fis_termodinamica_gases', name: 'Termodinâmica dos Gases', subject: 'Física', prerequisites: ['fis_calorimetria'],
    chapters: [
      'Gases Ideais: Variáveis de Estado e as Transformações Gasosas', 'Trabalho da Força de Pressão do Gás',
      'Primeira Lei da Termodinâmica', 'Primeira Lei da Termodinâmica Aplicada a Algumas Transformações Particulares',
      'Máquinas Térmicas e Ciclo de Carnot',
    ],
  },
  {
    id: 'fis_eletrostatica', name: 'Eletrostática e Campo Elétrico', subject: 'Física', prerequisites: [],
    chapters: [
      'Eletrostática: Processos de Eletrização e Aplicações', 'Força Elétrica: Lei de Coulomb', 'Campo Elétrico',
      'Energia Potencial e Potencial Elétrico', 'Mapeamento do Campo Elétrico: Linhas de Força e Superfícies Equipotenciais',
      'Campo Elétrico Uniforme: Abordagem Escalar e Abordagem Vetorial', 'Dinâmica das Cargas Elétricas',
    ],
  },
  {
    id: 'fis_circuitos', name: 'Circuitos Elétricos', subject: 'Física', prerequisites: ['fis_eletrostatica'],
    chapters: [
      'Corrente Elétrica', 'Potência Elétrica', 'Resistores', 'Medidores Elétricos', 'Geradores', 'Receptores',
      'Circuitos de Malha Única', 'Eletrodinâmica: as Leis de Kirchhoff', 'Capacitores',
    ],
  },
  {
    id: 'fis_eletromagnetismo', name: 'Eletromagnetismo', subject: 'Física', prerequisites: ['fis_circuitos'],
    chapters: [
      'Ímãs, Campo de Indução Magnético devido a Ímãs e Campo Magnético Terrestre',
      'Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações',
      'Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme',
      'Análise de Força Magnética em Fios Percorridos por Correntes Contínuas',
      'Indução Eletromagnética: Lei de Lenz', 'Indução Eletromagnética: Análise da Corrente Induzida em Geradores',
    ],
  },
  {
    id: 'fis_optica_geometrica', name: 'Óptica Geométrica', subject: 'Física', prerequisites: [],
    chapters: [
      'Fundamentos da Óptica Geométrica', 'Reflexão em Superfícies Planas', 'Reflexão em Superfícies Esféricas',
      'Refração: Fundamentos, Leis e Aplicações', 'Lentes Esféricas: Estudo Gráfico',
    ],
  },
  {
    id: 'fis_optica_instrumental', name: 'Óptica Instrumental e da Visão', subject: 'Física', prerequisites: ['fis_optica_geometrica'],
    chapters: [
      'Estudo Analítico das Lentes Esféricas', 'Equação do Fabricante de Lentes e Associação de Lentes',
      'Óptica da Visão', 'Microscópio e Luneta Astronômica (ou Telescópio Refrator): Noções Básicas',
    ],
  },
  {
    id: 'fis_ondas_fundamentos', name: 'Fundamentos de Ondas e Oscilações', subject: 'Física', prerequisites: [],
    chapters: ['Conceitos Básicos', 'Equação Fundamental da Ondulatória'],
  },
  {
    id: 'fis_ondulatoria', name: 'Ondulatória', subject: 'Física', prerequisites: ['fis_ondas_fundamentos'],
    chapters: [
      'Ondulatória: Ondas Eletromagnéticas', 'Ondulatória: Som e suas Propriedades', 'Intensidade Sonora',
      'Reflexão, Eco, Reverberação e Refração de Ondas', 'Fenômenos Ondulatórios: Análise de Refração e Reflexão em Cordas',
      'Fenômenos Ondulatórios: Difração, Polarização e Ressonância',
      'Interferência de Ondas: Análise Quantitativa, Aplicações e Batimento',
      'Um Caso Particular de Interferência: Onda Estacionária', 'Ondas Estacionárias em Cordas',
      'Ondas Estacionárias em Tubos', 'Efeito Doppler: Descrição e Estudo Quantitativo',
    ],
  },
  {
    id: 'fis_fisica_moderna', name: 'Física Moderna', subject: 'Física', prerequisites: ['fis_ondulatoria'],
    chapters: ['Noções Básicas de Física Quântica'],
  },
  // Química
  {
    id: 'qui_modelos_atomicos', name: 'Modelos Atômicos e Estrutura do Átomo', subject: 'Química', prerequisites: [],
    chapters: ['Evolução dos Modelos Atômicos', 'Organização da Tabela Periódica dos Elementos'],
  },
  {
    id: 'qui_radioatividade', name: 'Radioatividade', subject: 'Química', prerequisites: ['qui_modelos_atomicos'],
    chapters: ['Radioatividade: o Estudo das Radiações'],
  },
  {
    id: 'qui_polaridade_geometria', name: 'Polaridade das Ligações e Geometria Molecular', subject: 'Química', prerequisites: ['qui_modelos_atomicos'],
    chapters: [
      'Ligações Químicas e Alotropia', 'Geometria Molecular', 'Polaridade das Ligações e das Moléculas',
      'Interações Intermoleculares',
    ],
  },
  {
    id: 'qui_gases', name: 'Gases', subject: 'Química', prerequisites: [],
    chapters: ['Composição da Matéria: Estados Físicos', 'O Estado Gasoso', 'Estudo dos Gases II'],
  },
  {
    id: 'qui_estequiometria', name: 'Análises Quantitativas e Estequiometria', subject: 'Química', prerequisites: ['qui_gases'],
    chapters: [
      'Separação de Misturas', 'Transformações Físicas e Químicas e Balanceamento de Equações',
      'Massa Atômica, Mol e Massa Molar', 'Determinação de Fórmulas Químicas', 'Estequiometria: Leis Ponderais',
      'Cálculos Estequiométricos',
    ],
  },
  {
    id: 'qui_inorganica', name: 'Química Inorgânica', subject: 'Química', prerequisites: ['qui_gases'],
    chapters: ['Química Inorgânica', 'Equações Iônicas e outras Teorias para Ácidos e Bases'],
  },
  {
    id: 'qui_oxirreducao', name: 'Oxirredução', subject: 'Química', prerequisites: ['qui_inorganica'],
    chapters: ['Processos de Oxirredução', 'Química Ambiental'],
  },
  {
    id: 'qui_organica_fundamentos', name: 'Fundamentos e Nomenclatura Orgânica', subject: 'Química', prerequisites: ['qui_polaridade_geometria'],
    chapters: [
      'Introdução à Química Orgânica', 'Nomenclatura de Compostos Orgânicos',
      'Nomenclatura de Compostos Orgânicos Oxigenados e Nitrogenados',
      'Reconhecimento de Funções Orgânicas e Algumas de suas Propriedades', 'Isomeria', 'Combustíveis Fósseis',
    ],
  },
  {
    id: 'qui_organica_reacoes', name: 'Reações e Aplicações Orgânicas', subject: 'Química', prerequisites: ['qui_organica_fundamentos'],
    chapters: [
      'Interpretando Reações Orgânicas', 'Reações de Substituição', 'Reações de Adição',
      'Reações de Oxidação em Hidrocarbonetos', 'Álcoois', 'Ácidos Graxos e Esterificação',
      'Transesterificação (Alcoólise)', 'Acidez e Basicidade (pKa)', 'Polímeros',
    ],
  },
  {
    id: 'qui_solucoes', name: 'Soluções', subject: 'Química', prerequisites: [],
    chapters: ['Dispersões', 'Efeitos Coligativos'],
  },
  {
    id: 'qui_termoquimica', name: 'Termoquímica', subject: 'Química', prerequisites: ['qui_solucoes'],
    chapters: ['Termoquímica I', 'Termoquímica II'],
  },
  {
    id: 'qui_cinetica', name: 'Cinética Química', subject: 'Química', prerequisites: ['qui_termoquimica'],
    chapters: ['Cinética Química'],
  },
  {
    id: 'qui_eletroquimica', name: 'Eletroquímica', subject: 'Química', prerequisites: ['qui_cinetica'],
    chapters: [
      'Introdução ao Estudo das Pilhas e Baterias', 'Eletroquímica de Processos Espontâneos',
      'Eletroquímica de Processos não Espontâneos', 'Aspectos Quantitativos da Eletroquímica e Metalurgia',
    ],
  },
  {
    id: 'qui_equilibrio', name: 'Equilíbrio Químico', subject: 'Química', prerequisites: ['qui_cinetica'],
    chapters: ['Equilíbrios Químicos I', 'Deslocamento de Equilíbrio', 'Equilíbrios Iônicos', 'Equilíbrios Iônicos II'],
  },
  // Geografia
  {
    id: 'geo_cartografia', name: 'Cartografia e Fundamentos', subject: 'Geografia', prerequisites: [],
    chapters: [
      'Coordenadas Geográficas', 'Movimentos da Terra', 'Sistema de Fusos Horários', 'Linguagem Cartográfica',
      'Projeções Cartográficas', 'Cartografia Digital', 'Representações Gráficas e Cartográficas',
    ],
  },
  {
    id: 'geo_climatologia_socioambiental', name: 'Climatologia e Problemas Socioambientais', subject: 'Geografia', prerequisites: ['geo_cartografia'],
    chapters: [
      'Dinâmica Climática', 'Clima Mundial', 'Geomorfologia Mundial', 'Biogeografia Mundial',
      'Água na Superfície Terrestre', 'Desafios Ambientais do Século XXI', 'Geopolítica Ambiental',
    ],
  },
  {
    id: 'geo_hidrogeografia', name: 'Hidrogeografia', subject: 'Geografia', prerequisites: ['geo_cartografia'],
    chapters: ['Geopolítica dos Recursos Hídricos', 'Hidrogeografia Mundial'],
  },
  {
    id: 'geo_globalizacao_economica', name: 'Globalização e Geografia Econômica', subject: 'Geografia', prerequisites: ['geo_climatologia_socioambiental'],
    chapters: [
      'Do Mundo Bipolar ao Multipolar', 'Globalização e Processos Econômicos Atuais', 'Geografia das Redes Mundiais',
      'Unilateralismo e Multilateralismo', 'Blocos Econômicos', 'União Europeia', 'Desigualdades Globais',
      'Mobilidade Populacional', 'Geografia do Turismo', 'Produção Agrícola Mundial', 'Indústria I', 'Indústria II',
      'Gedeconomia Mundial',
    ],
  },
  {
    id: 'geo_geopolitica_regional', name: 'Geopolítica Regional Contemporânea', subject: 'Geografia', prerequisites: ['geo_globalizacao_economica'],
    chapters: [
      'Terrorismo Internacional', 'Geografia das Religiões', 'Tensões Geopolíticas na Europa',
      'Geopolítica e Geoeconomia da América Latina', 'África no Mundo Atual', 'Geopolítica e Geoeconomia da Ásia',
      'Geografia do Oriente Médio', 'Questão Palestina', 'Conflitos no Mundo Árabe',
    ],
  },
  {
    id: 'geo_fisica_brasil', name: 'Geografia Física do Brasil', subject: 'Geografia', prerequisites: [],
    chapters: [
      'Paisagem, Espaço Geográfico e Ciência Geográfica', 'Geologia e Geomorfologia', 'Relevo Brasileiro',
      'Pedologia', 'Climatologia do Brasil', 'Biogeografia do Brasil I', 'Biogeografia do Brasil II',
      'Políticas Ambientais Brasileiras', 'Hidrogeografia do Brasil', 'Domínios Morfoclimáticos',
    ],
  },
  {
    id: 'geo_economica_brasil', name: 'Geografia Econômica do Brasil', subject: 'Geografia', prerequisites: ['geo_fisica_brasil'],
    chapters: [
      'Matriz Energética', 'Combustíveis Fósseis e Biocombustíveis no Brasil', 'Energia Elétrica no Mundo',
      'Energia Elétrica no Brasil', 'Produção Mineral', 'O Espaço Agrário Brasileiro',
      'O Espaço Industrial Brasileiro I', 'O Espaço Industrial Brasileiro II',
    ],
  },
  {
    id: 'geo_populacao_urbana_brasil', name: 'Geografia da População e Urbana do Brasil', subject: 'Geografia', prerequisites: ['geo_fisica_brasil'],
    chapters: [
      'Dinâmica Demográfica', 'Estrutura Étnica e Fluxos Migratórios', 'Estrutura Ativa da População',
      'O Espaço Urbano I', 'O Espaço Urbano II', 'As Redes de Transportes', 'Os Fluxos do Comércio Externo',
    ],
  },
  // História
  {
    id: 'his_idade_antiga', name: 'Idade Antiga', subject: 'História', prerequisites: [],
    chapters: [
      'Introdução à História e Primeiras Civilizações', 'Antiguidade Clássica: o Mundo Grego',
      'Antiguidade Clássica: o Mundo Romano',
    ],
  },
  {
    id: 'his_idade_media', name: 'Idade Média', subject: 'História', prerequisites: ['his_idade_antiga'],
    chapters: ['Alta Idade Média e Feudalismo', 'Baixa Idade Média', 'A Primeira Globalização'],
  },
  {
    id: 'his_moderna_iluminismo', name: 'Idade Moderna e Iluminismo', subject: 'História', prerequisites: ['his_idade_media'],
    chapters: [
      'América Espanhola', 'Vida Urbana e Renascimento Cultural', 'Reforma Religiosa', 'Absolutismo',
      'Revolução Industrial', 'Iluminismo', 'Revolução Francesa', 'América no Século XIX',
    ],
  },
  {
    id: 'his_imperialismo_guerras', name: 'Imperialismo e Guerras Mundiais', subject: 'História', prerequisites: ['his_moderna_iluminismo'],
    chapters: [
      'Europa no Século XIX', 'Imperialismo e Belle Époque', 'Primeira Guerra Mundial (1914-1918)',
      'Grandes Revoluções do Século XX', 'O Período Entreguerras (1918-1939)', 'O Nazismo na Alemanha',
      'Segunda Guerra Mundial (1939-1945)',
    ],
  },
  {
    id: 'his_guerra_fria_contemporaneo', name: 'Guerra Fria e Mundo Contemporâneo', subject: 'História', prerequisites: ['his_imperialismo_guerras'],
    chapters: ['Guerra Fria', 'Descolonização Afro-Asiática', 'América Latina no Século XX', 'O Fim da Guerra Fria'],
  },
  {
    id: 'his_brasil_colonia', name: 'Brasil Colônia', subject: 'História', prerequisites: [],
    chapters: [
      'A História e o Brasil', 'Grandes Navegações e Conquista Colonial', 'A Montagem da Colonização',
      'Dinâmica Interna da Colonização', 'Disputas Europeias no Brasil Colonial', 'A Interiorização da Colonização',
      'A Mineração no Brasil Colonial', 'A Crise do Antigo Sistema Colonial', 'A Independência do Brasil',
    ],
  },
  {
    id: 'his_brasil_imperio', name: 'Brasil Império', subject: 'História', prerequisites: ['his_brasil_colonia'],
    chapters: [
      'Brasil Império: Formação do Estado Nacional Brasileiro', 'Brasil Império: o Período Regencial (1831-1840)',
      'Brasil Império: Segundo Reinado (1840-1889)', 'Brasil Império: o Declínio do Segundo Reinado',
    ],
  },
  {
    id: 'his_primeira_republica_vargas', name: 'Primeira República e Era Vargas', subject: 'História', prerequisites: ['his_brasil_imperio'],
    chapters: [
      'A República da Espada', 'Ascensão e Domínio das Oligarquias', 'A Primeira República: o Declínio Oligárquico (1889-1930)',
      'A Era Vargas', 'A Era Vargas: o Governo Constitucional (1934-1937)', 'A Era Vargas: o Estado Novo',
    ],
  },
  {
    id: 'his_republica_liberal_atual', name: 'República Liberal e Brasil Contemporâneo', subject: 'História', prerequisites: ['his_primeira_republica_vargas'],
    chapters: [
      'República Liberal (1945-1964): Democracia em Tempos de Guerra Fria',
      'República Liberal (1945-1964): Desenvolvimentismo e Populismo', 'Regime Militar (1964-1985) I',
      'Regime Militar (1964-1985) II', 'O Brasil Atual',
    ],
  },
  // Português
  {
    id: 'por_norma_culta', name: 'Domínio da Norma Culta', subject: 'Português', prerequisites: [],
    chapters: [
      'Língua: um Sistema Complexo', 'Variação Linguística', 'Substantivo: os Nomes e a Visão do Enunciador',
      'Tipos de Texto: Explorando Elementos Concretos e Conceitos Abstratos',
      'Artigo, Numeral e Adjetivo no Sintagma Nominal', 'Pronomes', 'Verbo',
      'Advérbio e Locuções Adverbiais: Circunstanciadores', 'Verbo e Sintaxe da Oração', 'Concordância',
      'Significados Implícitos', 'Tipos de Discurso', 'Pontuação I: Princípios para o Uso da Vírgula',
      'Pontuação II: Vírgula entre Orações e Outros Sinais de Pontuação',
      'O Léxico em Contexto: Variadas Possibilidades Semânticas', 'Ambiguidade: Duplicidade no Léxico e na Sintaxe',
      'Mecanismo de Regência', 'Crase', 'Processos de Formação de Palavras',
    ],
  },
  {
    id: 'por_sintaxe', name: 'Análise Sintática', subject: 'Português', prerequisites: ['por_norma_culta'],
    chapters: [
      'Funções Sintáticas Nominais e Vocativo', 'Tipos de Sujeito', 'Vozes Verbais', 'Orações Substantivas',
      'Orações Adjetivas', 'Orações Adverbiais', 'Orações Coordenadas',
    ],
  },
  {
    id: 'por_texto', name: 'Entendimento de Texto', subject: 'Português', prerequisites: [],
    chapters: [
      'Fatores de Textualidade', 'Os Dois Níveis da Leitura', 'Intertextualidade e Interdiscursividade',
      'Gêneros Textuais', 'Gêneros Narrativos e Níveis de Compreensão', 'Gêneros não Verbais: Fundamentos de Leitura',
      'Funções da Linguagem', 'Função Poética e Linguagem Literária', 'Figuras de Linguagem',
      'Modelos de Leitura e Distorções Interpretativas', 'Leitura de Textos Cômicos',
      'Tecnologias Digitais da Informação e Comunicação (TDIC): Impactos Sociais',
    ],
  },
  {
    id: 'por_lit_classica_barroca', name: 'Literatura Clássica, Medieval e Barroca', subject: 'Português', prerequisites: [],
    chapters: [
      'A Arte e suas Linguagens', 'Texto Literário x Texto não Literário', 'Trovadorismo e Humanismo',
      'Renascimento e Camões', 'Brasil: Primeiros Registros', 'A Estética Barroca', 'A Estética Neoclássica',
    ],
  },
  {
    id: 'por_lit_romantismo_realismo', name: 'Romantismo e Realismo', subject: 'Português', prerequisites: ['por_lit_classica_barroca'],
    chapters: [
      'A Estética Romântica: Poesia', 'Elementos da Narrativa', 'A Estética Romântica: Prosa', 'A Estética Realista',
      'Machado de Assis', 'Naturalismo', 'Realismo Português: Eça de Queirós',
    ],
  },
  {
    id: 'por_lit_modernismo', name: 'Simbolismo, Pré-Modernismo e Modernismo', subject: 'Português', prerequisites: ['por_lit_romantismo_realismo'],
    chapters: [
      'Parnasianismo', 'Simbolismo', 'Pré-Modernismo', 'Vanguardas Artísticas', 'Fernando Pessoa',
      'Semana de Arte Moderna', 'Modernismo no Brasil: Primeira Geração', 'Segunda Geração Modernista: Prosa',
      'Graciliano Ramos', 'Segunda Geração Modernista: Poesia', 'Carlos Drummond de Andrade',
      'João Cabral de Melo Neto',
    ],
  },
  {
    id: 'por_lit_contemporanea', name: 'Literatura Contemporânea', subject: 'Português', prerequisites: ['por_lit_modernismo'],
    chapters: [
      'Poesia Concreta', 'Clarice Lispector', 'Guimarães Rosa', 'Poesia Brasileira: 1960-1980',
      'Prosa Brasileira: 1960-1980', 'Literatura Lusófona Contemporânea', 'Poesia Brasileira Contemporânea',
      'Prosa Brasileira Contemporânea', 'Artes Plásticas Brasileiras', 'Teatro Brasileiro',
      'Cancioneiro Popular Brasileiro',
    ],
  },
  {
    id: 'por_red_fundamentos', name: 'Fundamentos da Dissertação', subject: 'Português', prerequisites: ['por_norma_culta', 'por_texto'],
    chapters: [
      'A Dissertação no Vestibular: Mitos e Verdades', 'O que se Avalia na Dissertação: Competências e Habilidades',
      'Organizando as Ideias: Brainstorm e Mind Maps', 'Projeto de Texto em Favor da Progressão Textual',
      'Repertório: o Diferencial de Redações de Sucesso', 'Qual Será o Tema deste Ano: Grandes Eixos Temáticos',
      'Diferentes Graus de Adequação à Proposta', 'Tangenciamento e Fuga: a Fronteira do Tema',
      'Gêneros e sua Relação com a Estrutura do Texto', 'Estrutura Clássica do Texto Dissertativo',
    ],
  },
  {
    id: 'por_red_repertorio', name: 'Leitura de Coletânea e Repertório Temático', subject: 'Português', prerequisites: ['por_red_fundamentos'],
    chapters: [
      'Lendo a Coletânea: a Apreensão de Sentidos I', 'Lendo a Coletânea: a Apreensão de Sentidos II',
      'Lendo a Coletânea: a Compreensão e o Texto Autoral I', 'Lendo a Coletânea: a Compreensão e o Texto Autoral II',
      'Incrementando o Repertório: Meio Ambiente', 'Analisando Tema de Redação: Meio Ambiente',
      'Incrementando o Repertório: Educação e Trabalho', 'Analisando Tema de Redação: Educação e Trabalho',
      'Incrementando o Repertório: Temas Abstratos', 'Analisando Tema Abstrato de Redação',
      'Incrementando o Repertório: Corpo, Saúde e Sexualidade', 'Analisando Tema de Redação: Corpo, Saúde e Sexualidade',
      'Incrementando o Repertório: Violência, Leis e Punição', 'Analisando Tema de Redação: Violência, Leis e Punição',
      'Incrementando o Repertório: Cidadania e Poder', 'Analisando Tema de Redação: Cidadania e Poder',
      'Incrementando o Repertório: Arte, Cultura e Relações Sociais',
      'Analisando o Tema de Redação: Arte, Cultura e Relações Sociais',
      'Incrementando o Repertório: Mídia e Sociedade', 'Analisando Tema de Redação: Mídia e Sociedade',
    ],
  },
  {
    id: 'por_red_argumentacao', name: 'Introdução, Argumentação e Coerência', subject: 'Português', prerequisites: ['por_red_fundamentos'],
    chapters: [
      'Parágrafo de Introdução: Delimitando a Opinião', 'Parágrafo de Introdução: como Contextualizar',
      'Argumentação: Auditório Particular e Universal', 'Argumentação Quase-Lógica e Efeito de Verdade',
      'Argumentação e Coerência Interna', 'Argumentação e Coerência Externa',
      'Recursos Argumentativos: Dados Numéricos e Exemplos', 'Recursos Argumentativos: Vozes Prestigiadas',
      'Ressalvando o Ponto de Vista Contrário', 'Refutando o Ponto Contrário',
      'Recursos Argumentativos: Interdiscursividade e Intertextualidade',
      'Recursos Argumentativos: Temas de Redação já Analisados', 'Recursos Argumentativos: Fatos da Atualidade',
      'Recursos Argumentativos: Múltiplos Domínios do Saber',
    ],
  },
  {
    id: 'por_red_estrutura_coesao', name: 'Coesão, Conclusão e Proposta de Intervenção', subject: 'Português', prerequisites: ['por_red_argumentacao'],
    chapters: [
      'Conclusão por Síntese ou Retomada da Tese', 'Conclusão: Sumarização, Focalização e Expressividade',
      'Proposta de Intervenção: Atores Sociais e Cidadania', 'Proposta de Intervenção: Viabilização e Inovação',
      'Proposta de Intervenção: Coerência Argumentativa', 'Proposta de Intervenção: Respeito aos Direitos Humanos',
      'Recursos de Coesão Referencial no Texto Dissertativo', 'Recursos de Coesão Sequencial no Texto Dissertativo',
      'Coesão no Texto Dissertativo: Análise de Problemas', 'Recursos Linguísticos: Norma, Clareza e Expressividade',
    ],
  },
  {
    id: 'por_red_direitos_modelo', name: 'Direitos Humanos e Redações Modelo', subject: 'Português', prerequisites: ['por_red_estrutura_coesao'],
    chapters: [
      'Os Direitos Humanos de 1ª Geração: Direitos Individuais',
      'Os Direitos Humanos de 2ª e 3ª Geração: Direitos Sociais, Coletivos e Difusos',
      'Redações Nota 1000: Trunfos a Inspirar', 'Redações na Mídia: como Aprimorar',
    ],
  },
  // Inglês
  {
    id: 'ing_01', name: 'Compreensão de Texto em Inglês', subject: 'Inglês', prerequisites: [],
    chapters: [
      'Text Comprehension: Taxonomy and Terminology', 'Text Comprehension: Songs and Poems',
      'Text Comprehension: Calories and Energy', 'Text Comprehension: Earthquakes',
      'Text Comprehension: Hurricanes', 'Text Comprehension: Ecology (Greenhouse Gases)',
      'Text Comprehension: Pollution', 'Text Comprehension: The Human Brain',
      'Text Comprehension: Global Warming', 'Text Comprehension: Novels/Short Stories',
      'Text Comprehension: Bacteria', 'Text Comprehension: Viruses',
      'Text Comprehension: Discrimination Against Women', 'Text Comprehension: Women Empowerment',
      'Text Comprehension: Digital Technology', 'Text Comprehension: Health – Probiotics',
      'Text Comprehension: Stem Cells',
    ],
  },
];

// Ponto de partida para uma aluna que ainda não estudou pelo módulo agrupado —
// níveis baixos/incertos por padrão; os módulos com histórico no banco de
// questões acima herdam valores plausíveis de um primeiro contato.
export const mockMastery: TopicMastery[] = [
  // Biologia — carries forward the old bio_celular estimate to its 4 split topics
  { topicId: 'bio_estrutura_fisio_celular', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_metabolismo_energetico', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_codigo_genetico_sintese', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_biotecnologia', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_genetica', level: 30, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'bio_evolucao', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 12 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'bio_ecologia', level: 40, uncertainty: 0.6, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'bio_zoologia', level: 25, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 16 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_botanica', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 18 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_microbiologia', level: 65, uncertainty: 0.35, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_fisio_animal', level: 55, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_fisio_vegetal', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  // Matemática — carries forward the old 3-frente estimates to their split topics
  { topicId: 'mat_aritmetica_proporcionalidade', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'mat_teoria_numeros', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'mat_sequencias_matrizes', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'mat_combinatoria', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'mat_dados_probabilidade', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'mat_geometria_plana', level: 70, uncertainty: 0.3, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_trigonometria', level: 63, uncertainty: 0.38, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'mat_geometria_espacial', level: 70, uncertainty: 0.3, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_geometria_analitica', level: 70, uncertainty: 0.3, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_equacoes', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'mat_funcoes', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'mat_log_exponenciais', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'mat_complexos_polinomios', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  // Física — carries forward the old frente estimates to their split topics
  { topicId: 'fis_cinematica', level: 75, uncertainty: 0.2, lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_cinematica_vetorial', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_leis_newton', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_gravitacao_circular', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_dinamica_impulsiva', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'fis_energia', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 13 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_estatica', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 17 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_calorimetria', level: 35, uncertainty: 0.65, lastReviewed: new Date(Date.now() - 9 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_termodinamica_gases', level: 35, uncertainty: 0.65, lastReviewed: new Date(Date.now() - 9 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_eletrostatica', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_circuitos', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_eletromagnetismo', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 21 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'fis_optica_geometrica', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 4 },
  { topicId: 'fis_optica_instrumental', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 4 },
  { topicId: 'fis_ondas_fundamentos', level: 80, uncertainty: 0.15, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'fis_ondulatoria', level: 80, uncertainty: 0.15, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'fis_fisica_moderna', level: 80, uncertainty: 0.15, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  // Química — carries forward the old frente estimates to their split topics
  { topicId: 'qui_modelos_atomicos', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_radioatividade', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_polaridade_geometria', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_gases', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'qui_estequiometria', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'qui_inorganica', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'qui_oxirreducao', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'qui_organica_fundamentos', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 11 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'qui_organica_reacoes', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 11 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'qui_solucoes', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_termoquimica', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_cinetica', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_eletroquimica', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_equilibrio', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  // Geografia — carries forward the old frente estimates to their split topics
  { topicId: 'geo_cartografia', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_climatologia_socioambiental', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_hidrogeografia', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_globalizacao_economica', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_geopolitica_regional', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_fisica_brasil', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_economica_brasil', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_populacao_urbana_brasil', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  // História — carries forward the old frente estimates to their split topics
  { topicId: 'his_idade_antiga', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_idade_media', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_moderna_iluminismo', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_imperialismo_guerras', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_guerra_fria_contemporaneo', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_brasil_colonia', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_brasil_imperio', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_primeira_republica_vargas', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_republica_liberal_atual', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  // Português — carries forward the old frente estimates to their split topics
  { topicId: 'por_norma_culta', level: 45, uncertainty: 0.55, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_sintaxe', level: 45, uncertainty: 0.55, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_texto', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 9 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_lit_classica_barroca', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_lit_romantismo_realismo', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_lit_modernismo', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_lit_contemporanea', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_red_fundamentos', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_red_repertorio', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_red_argumentacao', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_red_estrutura_coesao', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_red_direitos_modelo', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'ing_01', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 0 }
];

export const mockProfile: UserProfile = {
  targetCourse: 'Medicina',
  targetUniversities: ['USP', 'UNICAMP', 'UNESP'],
  // Fuvest é a prioridade principal (ver mockStudentGoals), mas as demais
  // bancas continuam ativas por padrão — nenhuma é ignorada de saída.
  targetExams: ['FUVEST', 'UNICAMP', 'UNESP', 'ENEM', 'FAMERP', 'UNIFESP'],
  availableHoursPerWeek: 40,
  currentEnergyLevel: 'medium',
  autonomyIndex: 35, // starts low, increases over time
  podcastDurationPreference: null,
  podcastVoiceName: null
};

// Objetivos e peso por banca — ponto de partida editável em Perfil. Fuvest
// como prioridade principal (peso 1, ambas as fases), as demais com peso
// menor mas nenhuma zerada — "tema sem incidência não é irrelevante" vale
// também para bancas: uma banca ativa com peso baixo ainda conta, só conta
// menos.
export const mockStudentGoals: StudentGoals = {
  primaryGoal: 'FUVEST — Medicina',
  secondaryGoals: ['Manter Unicamp e Unesp como alternativas reais', 'Não zerar Redação'],
  boardWeights: [
    { board: 'FUVEST', weight: 1, phaseFocus: 'ambas' },
    { board: 'UNICAMP', weight: 0.7, phaseFocus: 'ambas' },
    { board: 'UNESP', weight: 0.6, phaseFocus: 'ambas' },
    { board: 'ENEM', weight: 0.6, phaseFocus: 'ambas' },
    { board: 'FAMERP', weight: 0.35, phaseFocus: 'ambas' },
    { board: 'UNIFESP', weight: 0.35, phaseFocus: 'ambas' },
  ],
};

export const mockErrorLogs: ErrorLog[] = [
  {
    id: 'err_1',
    topicId: 'mat_combinatoria',
    questionId: 'q_mat_02_1',
    date: new Date().toISOString(),
    type: 'interpretation',
    notes: 'Confundi "pelo menos um" com "exatamente um".',
    aiHypothesis: 'A hipótese provável é falha na decodificação do jargão lógico de combinatória. Recomendo mapear as palavras-chave (e/ou, no mínimo/no máximo).'
  }
];

export const mockQuestions: Question[] = [
  // Biologia — Metabolismo Energético
  {
    id: 'q_bio_metabolismo_energetico_1',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Na respiração celular aeróbica, a etapa conhecida como glicólise ocorre em qual compartimento da célula, e qual é o seu principal produto imediato antes das etapas seguintes?',
    options: [
      { id: 'a', text: 'Na matriz mitocondrial, produzindo diretamente CO2 e H2O' },
      { id: 'b', text: 'No citoplasma (citosol), produzindo ácido pirúvico (piruvato)' },
      { id: 'c', text: 'Na membrana interna da mitocôndria, produzindo ATP em grande quantidade' },
      { id: 'd', text: 'No núcleo celular, produzindo diretamente moléculas de glicose' }
    ],
    correctOptionId: 'b',
    explanation: 'A glicólise ocorre no citosol (fora da mitocôndria) e quebra uma molécula de glicose em duas de ácido pirúvico, com saldo líquido de 2 ATP e 2 NADH. Só depois, na presença de oxigênio, o piruvato entra na mitocôndria para as etapas seguintes (ciclo de Krebs e cadeia respiratória).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_metabolismo_energetico_2',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Na ausência de oxigênio, células musculares humanas realizam fermentação lática em vez de respiração aeróbica completa. Isso ocorre principalmente porque:',
    options: [
      { id: 'a', text: 'A fermentação produz muito mais ATP por molécula de glicose que a respiração aeróbica' },
      { id: 'b', text: 'A fermentação regenera o NAD+ consumido na glicólise, permitindo que ela continue mesmo sem oxigênio disponível' },
      { id: 'c', text: 'A fermentação ocorre exclusivamente na mitocôndria, dispensando o oxigênio' },
      { id: 'd', text: 'A fermentação converte diretamente glicose em CO2 e água' }
    ],
    correctOptionId: 'b',
    explanation: 'Sem oxigênio, a cadeia transportadora de elétrons para, e o NADH da glicólise não pode ser reoxidado a NAD+ por essa via. A fermentação lática regenera NAD+ ao converter piruvato em ácido lático, permitindo que a glicólise continue produzindo ATP (embora com rendimento energético bem menor que a respiração aeróbica completa).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_metabolismo_energetico_3',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Na fotossíntese, as reações da fase clara (fotoquímica), que ocorrem nas membranas dos tilacoides, têm como principal função:',
    options: [
      { id: 'a', text: 'Fixar CO2 diretamente em moléculas de glicose' },
      { id: 'b', text: 'Converter energia luminosa em energia química (ATP e NADPH), além de liberar O2 a partir da quebra da água' },
      { id: 'c', text: 'Realizar exclusivamente a respiração celular da planta' },
      { id: 'd', text: 'Armazenar amido nos cloroplastos sem qualquer produção de energia' }
    ],
    correctOptionId: 'b',
    explanation: 'Na fase clara (fotoquímica), pigmentos fotossintéticos captam energia luminosa para produzir ATP e NADPH, usados na fase seguinte (ciclo de Calvin) para fixar CO2 em glicose. A quebra da água (fotólise) nessa fase libera O2 como subproduto.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_metabolismo_energetico_4',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'O ciclo de Krebs, etapa da respiração celular aeróbica que ocorre na matriz mitocondrial, tem como principal função:',
    options: [
      { id: 'a', text: 'Produzir a maior parte do ATP celular diretamente' },
      { id: 'b', text: 'Oxidar completamente o acetil-CoA, liberando CO2 e gerando a maior parte dos transportadores de elétrons (NADH e FADH2) usados na cadeia respiratória' },
      { id: 'c', text: 'Realizar a fotólise da água' },
      { id: 'd', text: 'Converter diretamente glicose em ácido pirúvico' }
    ],
    correctOptionId: 'b',
    explanation: 'O ciclo de Krebs oxida o acetil-CoA (derivado do piruvato) em uma série de reações que liberam CO2 e produzem NADH e FADH2 — os principais transportadores de elétrons que alimentam a cadeia respiratória, onde a maior parte do ATP é de fato produzida.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_metabolismo_energetico_5',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Comparando a respiração celular aeróbica completa com a fermentação, a principal razão pela qual a respiração aeróbica produz muito mais ATP por molécula de glicose é que:',
    options: [
      { id: 'a', text: 'A respiração aeróbica usa o oxigênio como aceptor final de elétrons na cadeia respiratória, permitindo a oxidação completa da glicose e a produção de muito mais ATP na fosforilação oxidativa' },
      { id: 'b', text: 'A fermentação ocorre mais rapidamente, mas produz moléculas maiores de ATP' },
      { id: 'c', text: 'A respiração aeróbica não depende de nenhuma etapa citoplasmática' },
      { id: 'd', text: 'A fermentação consome mais glicose por molécula de ATP produzida, mas gera mais energia por essa razão' }
    ],
    correctOptionId: 'a',
    explanation: 'Na respiração aeróbica, o oxigênio como aceptor final de elétrons permite que a cadeia transportadora de elétrons opere plenamente, gerando um grande gradiente de prótons usado pela ATP sintase para produzir muito mais ATP (por fosforilação oxidativa) do que a fermentação, que para na glicólise e produz apenas 2 ATP líquidos por glicose.',
    difficulty: 'hard'
  },
  // Biologia — Código Genético e Síntese Proteica
  {
    id: 'q_bio_codigo_genetico_sintese_1',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'No processo de transcrição, a enzima RNA polimerase utiliza uma das fitas do DNA como molde para sintetizar uma molécula de:',
    options: [
      { id: 'a', text: 'DNA, formando uma cópia idêntica do cromossomo' },
      { id: 'b', text: 'RNA mensageiro (ou outro tipo de RNA), complementar à fita molde de DNA' },
      { id: 'c', text: 'Proteína, diretamente a partir do DNA' },
      { id: 'd', text: 'Um novo gene, inserido em outro local do genoma' }
    ],
    correctOptionId: 'b',
    explanation: 'A transcrição é o processo de síntese de RNA (mensageiro, ribossômico, transportador, entre outros) a partir de uma fita de DNA usada como molde, com pareamento de bases complementares (com uracila no lugar da timina no RNA).',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_2',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'Durante a tradução, cada trinca de nucleotídeos do RNA mensageiro (um códon) especifica:',
    options: [
      { id: 'a', text: 'Um cromossomo inteiro' },
      { id: 'b', text: 'Um aminoácido específico (ou um sinal de início/término da tradução)' },
      { id: 'c', text: 'Uma molécula completa de DNA' },
      { id: 'd', text: 'Um ribossomo específico' }
    ],
    correctOptionId: 'b',
    explanation: 'O código genético é lido em trincas (códons); cada códon corresponde a um aminoácido específico (ou a um sinal de início — AUG — ou de término da tradução), sendo decodificado pelos RNAs transportadores durante a síntese da proteína no ribossomo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_3',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'Uma mutação pontual troca um único nucleotídeo em um gene, mas o aminoácido codificado permanece o mesmo, sem alterar a proteína final. Esse tipo de mutação é chamado de:',
    options: [
      { id: 'a', text: 'Mutação missense (com troca de sentido)' },
      { id: 'b', text: 'Mutação silenciosa (sinônima)' },
      { id: 'c', text: 'Mutação nonsense (sem sentido)' },
      { id: 'd', text: 'Mutação por deleção' }
    ],
    correctOptionId: 'b',
    explanation: 'Por causa da degenerescência do código genético (vários códons diferentes podem especificar o mesmo aminoácido), uma troca de nucleotídeo pode gerar um códon diferente que ainda assim codifica o mesmo aminoácido — essa é a mutação silenciosa (ou sinônima), que não altera a proteína final.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_4',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'Os ribossomos, estruturas responsáveis pela tradução do RNA mensageiro em proteínas, são compostos por:',
    options: [
      { id: 'a', text: 'DNA e proteínas' },
      { id: 'b', text: 'RNA ribossômico (rRNA) e proteínas' },
      { id: 'c', text: 'Apenas lipídios de membrana' },
      { id: 'd', text: 'Exclusivamente RNA transportador (tRNA)' }
    ],
    correctOptionId: 'b',
    explanation: 'Os ribossomos são formados por duas subunidades compostas de RNA ribossômico (rRNA) associado a proteínas; eles não são delimitados por membrana e podem estar livres no citoplasma ou associados ao retículo endoplasmático rugoso.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_5',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'O código genético é considerado universal porque:',
    options: [
      { id: 'a', text: 'Todos os organismos possuem exatamente o mesmo número de genes' },
      { id: 'b', text: 'A correspondência entre códons e aminoácidos é, com raríssimas exceções, a mesma em praticamente todos os seres vivos' },
      { id: 'c', text: 'Todos os organismos usam apenas DNA, nunca RNA, na síntese proteica' },
      { id: 'd', text: 'Cada espécie tem seu próprio código genético exclusivo' }
    ],
    correctOptionId: 'b',
    explanation: 'A universalidade do código genético significa que o mesmo códon especifica, com raríssimas exceções, o mesmo aminoácido em organismos tão diferentes quanto bactérias, plantas e humanos — evidência forte da ancestralidade comum de toda a vida na Terra, e o que torna possível, por exemplo, transferir genes entre espécies diferentes na biotecnologia.',
    difficulty: 'medium'
  },
  // Biologia — Genética
  {
    id: 'q_bio_genetica_1',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'No cruzamento entre dois heterozigotos (Aa x Aa), considerando dominância completa, qual é a proporção fenotípica esperada na prole?',
    options: [
      { id: 'a', text: '1:1' },
      { id: 'b', text: '1:2:1' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '9:3:3:1' }
    ],
    correctOptionId: 'c',
    explanation: 'Com dominância completa, o cruzamento Aa x Aa produz genótipos na proporção 1AA:2Aa:1aa. Como AA e Aa têm o mesmo fenótipo dominante, a proporção fenotípica resultante é 3 dominantes : 1 recessivo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_2',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Em um cruzamento di-híbrido entre dois indivíduos duplo-heterozigotos (AaBb x AaBb), com genes localizados em cromossomos diferentes (segregação independente), qual é a proporção fenotípica esperada na prole?',
    options: [
      { id: 'a', text: '3:1' },
      { id: 'b', text: '1:1:1:1' },
      { id: 'c', text: '9:3:3:1' },
      { id: 'd', text: '1:2:1' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela Segunda Lei de Mendel (segregação independente), genes em cromossomos diferentes se combinam de forma independente. O cruzamento AaBb x AaBb gera a clássica proporção fenotípica 9:3:3:1 entre as quatro combinações possíveis de fenótipos.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_3',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Um casal tem um filho com um distúrbio genético recessivo autossômico, embora nenhum dos pais manifeste a doença. Isso é possível porque:',
    options: [
      { id: 'a', text: 'A doença surgiu por uma mutação espontânea apenas no filho, sem relação com os genes dos pais' },
      { id: 'b', text: 'Ambos os pais são heterozigotos (portadores), carregando o alelo recessivo sem manifestar a doença, e cada um transmitiu esse alelo ao filho' },
      { id: 'c', text: 'A doença é obrigatoriamente ligada ao cromossomo Y' },
      { id: 'd', text: 'Um distúrbio recessivo nunca pode aparecer em um filho se os pais não o têm' }
    ],
    correctOptionId: 'b',
    explanation: 'Em uma doença autossômica recessiva, indivíduos heterozigotos (Aa) são portadores assintomáticos, pois o alelo dominante normal (A) mascara o efeito do alelo recessivo (a). Se ambos os pais são Aa, há 25% de chance de um filho herdar dois alelos recessivos (aa) e manifestar a doença, mesmo sem nenhum dos pais manifestá-la.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_4',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A hemofilia é uma condição recessiva ligada ao cromossomo X. Se uma mulher heterozigota (portadora, XHXh) tem filhos com um homem não hemofílico (XHY), qual é a probabilidade de um filho homem nascer hemofílico?',
    options: [
      { id: 'a', text: '0%' },
      { id: 'b', text: '25% do total de filhos, ou 50% considerando apenas os filhos homens' },
      { id: 'c', text: '100% dos filhos homens' },
      { id: 'd', text: '50% do total de filhos, incluindo meninas' }
    ],
    correctOptionId: 'b',
    explanation: 'Os filhos homens recebem o cromossomo Y do pai e um X da mãe. Da mãe heterozigota (XHXh), metade dos gametas carrega Xh. Logo, metade dos filhos homens (XhY) será hemofílica — o que corresponde a 25% do total de filhos (meninos e meninas juntos), ou 50% considerando apenas os filhos do sexo masculino.',
    difficulty: 'hard'
  },
  // Biologia — Fisiologia Animal e Humana
  {
    id: 'q_bio_fisio_animal_1',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'No sistema circulatório humano, qual câmara do coração bombeia sangue oxigenado para todo o corpo através da artéria aorta?',
    options: [
      { id: 'a', text: 'Átrio direito' },
      { id: 'b', text: 'Ventrículo direito' },
      { id: 'c', text: 'Átrio esquerdo' },
      { id: 'd', text: 'Ventrículo esquerdo' }
    ],
    correctOptionId: 'd',
    explanation: 'O ventrículo esquerdo recebe sangue oxigenado do átrio esquerdo (vindo dos pulmões) e o bombeia com alta pressão para a aorta, distribuindo-o para todo o corpo — por isso tem a parede muscular mais espessa entre as quatro câmaras.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_animal_2',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Nos néfrons, unidades funcionais dos rins, a filtração do sangue ocorre em uma estrutura específica antes que o filtrado seja modificado ao longo dos túbulos renais. Essa estrutura é:',
    options: [
      { id: 'a', text: 'A alça de Henle' },
      { id: 'b', text: 'O glomérulo (dentro da cápsula de Bowman)' },
      { id: 'c', text: 'O ducto coletor' },
      { id: 'd', text: 'A bexiga urinária' }
    ],
    correctOptionId: 'b',
    explanation: 'A filtração do sangue ocorre no glomérulo, um novelo de capilares envolvido pela cápsula de Bowman. O filtrado inicial (semelhante ao plasma, sem as proteínas grandes) segue então pelos túbulos renais (túbulo contorcido proximal, alça de Henle, túbulo contorcido distal) onde ocorrem reabsorção e secreção seletivas até formar a urina final.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_3',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'No sistema nervoso, a transmissão do impulso nervoso entre dois neurônios ocorre em uma região especializada chamada sinapse, geralmente por meio de:',
    options: [
      { id: 'a', text: 'Contato elétrico direto entre as membranas dos dois neurônios, em todos os casos' },
      { id: 'b', text: 'Liberação de neurotransmissores químicos pelo neurônio pré-sináptico, que se ligam a receptores no neurônio pós-sináptico' },
      { id: 'c', text: 'Transferência direta de DNA entre os neurônios' },
      { id: 'd', text: 'Fusão completa das membranas dos dois neurônios' }
    ],
    correctOptionId: 'b',
    explanation: 'Na sinapse química (a mais comum), o neurônio pré-sináptico libera neurotransmissores na fenda sináptica; esses neurotransmissores se ligam a receptores específicos na membrana do neurônio pós-sináptico, podendo gerar um novo impulso nervoso (existem também sinapses elétricas, mais raras, com contato direto).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_4',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Durante a respiração pulmonar humana, a troca gasosa (difusão de O2 e CO2) entre o ar e o sangue ocorre principalmente em qual estrutura?',
    options: [
      { id: 'a', text: 'Na traqueia' },
      { id: 'b', text: 'Nos brônquios principais' },
      { id: 'c', text: 'Nos alvéolos pulmonares' },
      { id: 'd', text: 'Na laringe' }
    ],
    correctOptionId: 'c',
    explanation: 'Os alvéolos pulmonares são pequenas bolsas de paredes finíssimas, envoltas por uma extensa rede de capilares sanguíneos, o que oferece grande área de superfície para a difusão eficiente de O2 (do ar para o sangue) e CO2 (do sangue para o ar). Traqueia, brônquios e laringe apenas conduzem o ar, sem realizar troca gasosa significativa.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_5',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O sistema endócrino regula diversas funções do corpo por meio da liberação de hormônios na corrente sanguínea. Uma das principais diferenças entre a regulação hormonal (endócrina) e a regulação nervosa é que a regulação hormonal geralmente:',
    options: [
      { id: 'a', text: 'Age de forma mais lenta, mas com efeitos mais duradouros, já que os hormônios viajam pelo sangue até órgãos-alvo distantes' },
      { id: 'b', text: 'Age de forma instantânea, sempre mais rápida que o sistema nervoso' },
      { id: 'c', text: 'Não depende de receptores específicos nas células-alvo' },
      { id: 'd', text: 'Atua exclusivamente sobre o próprio órgão que produziu o hormônio' }
    ],
    correctOptionId: 'a',
    explanation: 'Hormônios são liberados na corrente sanguínea e podem levar segundos a horas para alcançar órgãos-alvo distantes, mas seus efeitos tendem a ser mais duradouros (minutos a dias) que os do sistema nervoso, que transmite impulsos elétricos quase instantaneamente, mas com efeitos geralmente mais breves e localizados.',
    difficulty: 'hard'
  },
  // Biologia — Ecologia
  {
    id: 'q_bio_ecologia_1',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Em uma cadeia alimentar, os organismos que realizam fotossíntese (como plantas e algas) ocupam qual nível trófico, na base de toda a cadeia?',
    options: [
      { id: 'a', text: 'Consumidores primários' },
      { id: 'b', text: 'Consumidores secundários' },
      { id: 'c', text: 'Produtores' },
      { id: 'd', text: 'Decompositores' }
    ],
    correctOptionId: 'c',
    explanation: 'Os produtores (como plantas e algas) realizam fotossíntese, convertendo energia luminosa em energia química, e ocupam a base de toda cadeia alimentar — são a única entrada de energia (via luz solar) na maioria dos ecossistemas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_ecologia_2',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Em uma relação de mutualismo entre duas espécies, como no caso clássico dos líquens (associação entre fungos e algas/cianobactérias), o que caracteriza esse tipo de interação ecológica?',
    options: [
      { id: 'a', text: 'Uma espécie se beneficia e a outra é prejudicada' },
      { id: 'b', text: 'Ambas as espécies se beneficiam da interação, frequentemente de forma obrigatória (nenhuma sobrevive isoladamente)' },
      { id: 'c', text: 'Uma espécie se beneficia e a outra não é afetada' },
      { id: 'd', text: 'Ambas as espécies competem diretamente pelo mesmo recurso' }
    ],
    correctOptionId: 'b',
    explanation: 'No mutualismo, as duas espécies envolvidas se beneficiam da interação. No caso dos líquens, o fungo obtém compostos orgânicos produzidos pela fotossíntese da alga/cianobactéria, enquanto esta recebe proteção e retenção de água do fungo — uma relação tão estreita que nenhum dos dois sobrevive isoladamente na natureza.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_3',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A eficiência ecológica de transferência de energia entre níveis tróficos consecutivos (por exemplo, de produtores para consumidores primários) costuma ser de apenas cerca de 10%. Isso explica principalmente por que:',
    options: [
      { id: 'a', text: 'Cadeias alimentares muito longas (com muitos níveis tróficos) são raras, já que a energia disponível diminui drasticamente a cada nível' },
      { id: 'b', text: 'Todos os ecossistemas possuem exatamente o mesmo número de níveis tróficos' },
      { id: 'c', text: 'Os decompositores recebem mais energia que os produtores' },
      { id: 'd', text: 'A energia se acumula igualmente em todos os níveis tróficos, sem perdas' }
    ],
    correctOptionId: 'a',
    explanation: 'A cada nível trófico, a maior parte da energia é perdida (na forma de calor, através da respiração, ou não é consumida/digerida), restando apenas cerca de 10% para o próximo nível. Por isso, após poucos níveis tróficos, a energia disponível se torna tão pequena que não sustenta mais um nível adicional — daí a raridade de cadeias alimentares muito longas.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_ecologia_4',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Os decompositores (fungos e bactérias decompositoras) desempenham um papel fundamental nos ecossistemas porque:',
    options: [
      { id: 'a', text: 'Produzem energia luminosa para os produtores' },
      { id: 'b', text: 'Decompõem matéria orgânica morta, devolvendo nutrientes inorgânicos ao ambiente, para serem reaproveitados pelos produtores' },
      { id: 'c', text: 'Ocupam sempre o topo da cadeia alimentar' },
      { id: 'd', text: 'Realizam fotossíntese em conjunto com as plantas' }
    ],
    correctOptionId: 'b',
    explanation: 'Os decompositores quebram a matéria orgânica de organismos mortos (e de excretas), liberando nutrientes inorgânicos (como nitrogênio e fósforo) de volta ao solo ou à água, onde podem ser reabsorvidos pelos produtores — fechando os ciclos biogeoquímicos dos ecossistemas.',
    difficulty: 'medium'
  },
  // Biologia — Evolução
  {
    id: 'q_bio_evolucao_1',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'Segundo a teoria da seleção natural de Darwin, o que determina a sobrevivência e reprodução diferencial dos indivíduos de uma população ao longo de gerações?',
    options: [
      { id: 'a', text: 'O uso e desuso das características ao longo da vida do indivíduo' },
      { id: 'b', text: 'Características adquiridas durante a vida, transmitidas depois à prole' },
      { id: 'c', text: 'Variações hereditárias pré-existentes na população, algumas mais adaptadas ao ambiente que outras' },
      { id: 'd', text: 'A vontade consciente do organismo em se adaptar ao ambiente' }
    ],
    correctOptionId: 'c',
    explanation: 'A seleção natural atua sobre variações hereditárias já existentes na população (geradas por mutações e recombinação), não sobre características adquiridas durante a vida (essa era a ideia de Lamarck, hoje refutada). Indivíduos com variações mais adaptadas ao ambiente tendem a sobreviver e deixar mais descendentes, aumentando a frequência dessas variações na população ao longo de gerações.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_evolucao_2',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'A especiação por isolamento geográfico (alopátrica) ocorre quando:',
    options: [
      { id: 'a', text: 'Populações de uma mesma espécie são separadas fisicamente (por uma barreira geográfica) e acumulam diferenças genéticas independentes, até não conseguirem mais se reproduzir entre si' },
      { id: 'b', text: 'Novas espécies se formam na mesma área geográfica, sem qualquer barreira física entre as populações' },
      { id: 'c', text: 'Uma espécie inteira é extinta por competição com outra' },
      { id: 'd', text: 'Duas espécies diferentes se cruzam e geram descendentes férteis' }
    ],
    correctOptionId: 'a',
    explanation: 'Na especiação alopátrica, uma barreira geográfica (um rio, uma cordilheira, um oceano) separa fisicamente populações de uma mesma espécie. Isoladas, essas populações acumulam mutações e adaptações distintas ao longo de gerações, até se tornarem tão diferentes geneticamente que não conseguem mais se reproduzir entre si mesmo que a barreira desapareça — formando então duas espécies distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_evolucao_3',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'Estruturas homólogas, como o braço humano, a asa do morcego e a nadadeira da baleia, têm a mesma origem embrionária e esquelética, mas funções diferentes. Essas estruturas são consideradas evidência evolutiva porque indicam que:',
    options: [
      { id: 'a', text: 'Essas espécies compartilham um ancestral comum, cuja estrutura original foi modificada ao longo da evolução para funções diferentes' },
      { id: 'b', text: 'Essas espécies desenvolveram, de forma totalmente independente, soluções estruturais coincidentemente parecidas' },
      { id: 'c', text: 'Não há qualquer relação evolutiva entre essas espécies' },
      { id: 'd', text: 'Essas estruturas surgiram simultaneamente em todas as espécies, sem relação de ancestralidade' }
    ],
    correctOptionId: 'a',
    explanation: 'Estruturas homólogas compartilham a mesma origem embrionária e o mesmo plano estrutural básico, apesar de exercerem funções diferentes hoje — evidência forte de que as espécies que as possuem descendem de um ancestral comum, cuja estrutura ancestral foi modificada por seleção natural para desempenhar funções distintas em cada linhagem (diferente de estruturas análogas, que têm função semelhante mas origens evolutivas distintas).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_evolucao_4',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'A deriva genética é um mecanismo evolutivo que causa mudanças na frequência dos alelos de uma população principalmente por:',
    options: [
      { id: 'a', text: 'Seleção ativa dos indivíduos mais adaptados ao ambiente' },
      { id: 'b', text: 'Eventos aleatórios (ao acaso), com efeito mais pronunciado em populações pequenas' },
      { id: 'c', text: 'Mutações que sempre aumentam a aptidão dos indivíduos' },
      { id: 'd', text: 'Migração constante de indivíduos entre populações' }
    ],
    correctOptionId: 'b',
    explanation: 'Diferentemente da seleção natural (que favorece características vantajosas de forma não aleatória), a deriva genética altera as frequências alélicas por puro acaso — por exemplo, por sobrevivência aleatória em um desastre natural. Seu efeito é muito mais pronunciado em populações pequenas, onde flutuações aleatórias têm maior impacto proporcional sobre a frequência dos alelos.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_evolucao_5',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'A resistência de populações de bactérias a antibióticos, um problema crescente de saúde pública, é um exemplo direto de seleção natural em ação porque:',
    options: [
      { id: 'a', text: 'O antibiótico "ensina" as bactérias a se tornarem resistentes, alterando seu DNA de forma direcionada' },
      { id: 'b', text: 'Bactérias com variantes genéticas que já conferiam resistência, presentes ao acaso na população antes do contato com o antibiótico, sobrevivem e se reproduzem mais, aumentando a frequência dessa resistência na população' },
      { id: 'c', text: 'Todas as bactérias de uma população se tornam resistentes simultaneamente e da mesma forma' },
      { id: 'd', text: 'A resistência surge apenas depois que todas as bactérias sensíveis já morreram, sem qualquer relação com variação genética prévia' }
    ],
    correctOptionId: 'b',
    explanation: 'Antes mesmo do contato com o antibiótico, algumas bactérias já possuem, por variação genética ao acaso (mutação), características que conferem resistência. Quando a população é exposta ao antibiótico, as bactérias sensíveis morrem, mas as resistentes sobrevivem e se reproduzem, aumentando a frequência dos genes de resistência nas gerações seguintes — um exemplo claro de seleção natural, não de "adaptação direcionada" pelo próprio antibiótico.',
    difficulty: 'hard'
  },
  // Biologia — Microbiologia e Virologia
  {
    id: 'q_bio_microbiologia_1',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'As bactérias, organismos procariontes, se diferenciam estruturalmente das células eucarióticas principalmente por:',
    options: [
      { id: 'a', text: 'Possuírem núcleo delimitado por membrana' },
      { id: 'b', text: 'Não possuírem núcleo delimitado por membrana nem organelas membranosas complexas, com material genético disperso no citoplasma' },
      { id: 'c', text: 'Possuírem mitocôndrias em grande quantidade' },
      { id: 'd', text: 'Possuírem retículo endoplasmático desenvolvido' }
    ],
    correctOptionId: 'b',
    explanation: 'As bactérias (procariontes) não possuem núcleo delimitado por membrana nem organelas membranosas complexas (como mitocôndrias ou retículo endoplasmático); seu material genético (geralmente um único cromossomo circular) fica disperso em uma região do citoplasma chamada nucleoide.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_microbiologia_2',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Um vírus, ao contrário de bactérias e outros organismos celulares, é considerado por muitos biólogos como não vivo (ou na fronteira da vida) principalmente porque:',
    options: [
      { id: 'a', text: 'É formado por material genético e uma cápsula proteica, mas não realiza metabolismo próprio nem se reproduz sozinho, dependendo obrigatoriamente da maquinaria de uma célula hospedeira' },
      { id: 'b', text: 'Não possui nenhum tipo de material genético' },
      { id: 'c', text: 'É sempre maior que uma célula bacteriana' },
      { id: 'd', text: 'Realiza fotossíntese de forma independente' }
    ],
    correctOptionId: 'a',
    explanation: 'Vírus não têm estrutura celular nem metabolismo próprio: fora de uma célula hospedeira, são partículas inertes. Para se replicar, precisam invadir uma célula viva e sequestrar sua maquinaria metabólica (ribossomos, enzimas, energia) — por isso são considerados parasitas intracelulares obrigatórios, e sua classificação como "vivos" é debatida.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_microbiologia_3',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Qual é a principal diferença entre imunidade inata e imunidade adaptativa no sistema imunológico humano?',
    options: [
      { id: 'a', text: 'A imunidade inata é específica para cada patógeno e gera memória imunológica; a adaptativa não' },
      { id: 'b', text: 'A imunidade inata é rápida mas inespecífica (mesma resposta para diferentes patógenos); a adaptativa é mais lenta para se desenvolver, porém específica e gera memória imunológica' },
      { id: 'c', text: 'Apenas a imunidade adaptativa existe em seres humanos' },
      { id: 'd', text: 'A imunidade inata atua exclusivamente contra vírus, nunca contra bactérias' }
    ],
    correctOptionId: 'b',
    explanation: 'A imunidade inata é a primeira linha de defesa, rápida mas inespecífica (barreiras físicas, fagócitos, inflamação — a mesma resposta geral para diferentes ameaças). A imunidade adaptativa é mais lenta para se desenvolver na primeira exposição, porém é altamente específica para o patógeno e gera células de memória, o que permite uma resposta muito mais rápida em exposições futuras — o princípio por trás da vacinação.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_microbiologia_4',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Os antibióticos são substâncias eficazes no tratamento de infecções bacterianas, mas não têm efeito contra infecções virais. Isso ocorre porque os antibióticos atuam sobre:',
    options: [
      { id: 'a', text: 'Estruturas ou processos metabólicos exclusivos de células bacterianas (como a parede celular ou a síntese proteica bacteriana), que os vírus simplesmente não possuem por não serem células' },
      { id: 'b', text: 'O sistema imunológico do próprio paciente, independentemente do tipo de patógeno' },
      { id: 'c', text: 'Qualquer tipo de material genético, seja de bactérias ou de vírus' },
      { id: 'd', text: 'A membrana celular de forma genérica, igual em bactérias e em células humanas' }
    ],
    correctOptionId: 'a',
    explanation: 'Antibióticos são desenhados para atacar estruturas ou processos específicos de células bacterianas (como a síntese da parede celular de peptideoglicano, ou a maquinaria de síntese proteica bacteriana, diferente da humana). Como vírus não são células e não possuem essas estruturas próprias (dependem da célula hospedeira para se replicar), antibióticos não têm alvo nenhum para atuar contra eles.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_microbiologia_5',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'As vacinas funcionam estimulando o sistema imunológico a desenvolver memória imunológica contra um patógeno específico, sem causar a doença. Isso geralmente é feito por meio da exposição a:',
    options: [
      { id: 'a', text: 'O patógeno vivo e totalmente ativo, em sua forma mais virulenta' },
      { id: 'b', text: 'Uma versão enfraquecida, inativada, ou apenas partes (como proteínas específicas) do patógeno, suficientes para provocar uma resposta imune sem causar a doença completa' },
      { id: 'c', text: 'Antibióticos diretamente, sem qualquer componente do patógeno' },
      { id: 'd', text: 'Células humanas saudáveis, sem qualquer relação com o patógeno' }
    ],
    correctOptionId: 'b',
    explanation: 'Vacinas expõem o sistema imunológico a uma versão enfraquecida ou inativada do patógeno, ou apenas a fragmentos específicos dele (como uma proteína de superfície, ou mRNA que instrui a produção dessa proteína) — o suficiente para provocar uma resposta imune adaptativa e gerar células de memória, sem causar a doença em sua forma completa.',
    difficulty: 'medium'
  },
  // Matemática — Funções
  {
    id: 'q_mat_funcoes_1',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Se f(x) = 2x + 1 e g(x) = x², qual é o valor de f(g(3))?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '10' },
      { id: 'c', text: '19' },
      { id: 'd', text: '37' }
    ],
    correctOptionId: 'c',
    explanation: 'Primeiro calcula-se g(3) = 3² = 9. Em seguida, f(9) = 2×9 + 1 = 19.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_2',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é a função inversa de f(x) = 3x - 6?',
    options: [
      { id: 'a', text: 'f⁻¹(x) = (x + 6)/3' },
      { id: 'b', text: 'f⁻¹(x) = (x - 6)/3' },
      { id: 'c', text: 'f⁻¹(x) = 3x + 6' },
      { id: 'd', text: 'f⁻¹(x) = x/3 - 6' }
    ],
    correctOptionId: 'a',
    explanation: 'Trocando x por y e isolando y: x = 3y - 6 → 3y = x + 6 → y = (x + 6)/3.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_funcoes_3',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é o domínio da função f(x) = 1/(x - 4) + √(x - 2)?',
    options: [
      { id: 'a', text: 'x ≥ 2' },
      { id: 'b', text: 'x ≥ 2 e x ≠ 4' },
      { id: 'c', text: 'x > 2' },
      { id: 'd', text: 'x ≠ 4' }
    ],
    correctOptionId: 'b',
    explanation: 'A raiz quadrada exige x - 2 ≥ 0, ou seja, x ≥ 2. Já a fração exige que o denominador não seja zero, ou seja, x ≠ 4. As duas condições precisam valer ao mesmo tempo.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_4',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'O gráfico de uma função f é crescente no intervalo (-∞, 2) e decrescente no intervalo (2, +∞). O que podemos concluir sobre o ponto x = 2?',
    options: [
      { id: 'a', text: 'É um ponto de mínimo' },
      { id: 'b', text: 'É um ponto de máximo' },
      { id: 'c', text: 'É necessariamente uma raiz da função' },
      { id: 'd', text: 'Não é possível concluir nada sobre esse ponto' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando uma função para de crescer e passa a decrescer em um ponto, esse ponto é um máximo local (o valor da função ali é maior que em pontos vizinhos de ambos os lados).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_5',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Quantas soluções reais tem a equação |x - 2| = 5?',
    options: [
      { id: 'a', text: 'Nenhuma' },
      { id: 'b', text: 'Uma' },
      { id: 'c', text: 'Duas' },
      { id: 'd', text: 'Infinitas' }
    ],
    correctOptionId: 'c',
    explanation: 'A equação modular se desdobra em dois casos: x - 2 = 5 (x = 7) ou x - 2 = -5 (x = -3). Ambos são válidos, logo há duas soluções.',
    difficulty: 'medium'
  },
  // Matemática — Análise Combinatória
  {
    id: 'q_mat_combinatoria_1',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'Quantos anagramas distintos podem ser formados com as letras da palavra "ARARA"?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '20' },
      { id: 'c', text: '60' },
      { id: 'd', text: '120' }
    ],
    correctOptionId: 'a',
    explanation: 'A palavra tem 5 letras, com a letra A repetida 3 vezes e a letra R repetida 2 vezes. O número de anagramas distintos é 5!/(3!×2!) = 120/12 = 10.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_combinatoria_2',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'De um grupo de 10 pessoas, quantas comissões de 3 pessoas podem ser formadas, sem distinção de cargo entre os membros?',
    options: [
      { id: 'a', text: '30' },
      { id: 'b', text: '70' },
      { id: 'c', text: '120' },
      { id: 'd', text: '720' }
    ],
    correctOptionId: 'c',
    explanation: 'Como a ordem não importa (é uma comissão, não cargos distintos), usa-se combinação: C(10,3) = 10!/(3!×7!) = 120.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_combinatoria_3',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'Uma prova tem 10 questões, das quais o aluno deve escolher exatamente 7 para responder — sendo que as duas primeiras questões são obrigatórias. De quantas formas diferentes o aluno pode escolher o conjunto de questões que vai responder?',
    options: [
      { id: 'a', text: '21' },
      { id: 'b', text: '56' },
      { id: 'c', text: '70' },
      { id: 'd', text: '120' }
    ],
    correctOptionId: 'b',
    explanation: 'As 2 obrigatórias já estão garantidas; restam escolher 5 das outras 8 questões: C(8,5) = 56.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_combinatoria_4',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'Quantos números de 3 algarismos distintos podem ser formados usando apenas os algarismos 1, 2, 3, 4 e 5 (sem repetição)?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '60' },
      { id: 'c', text: '125' },
      { id: 'd', text: '625' }
    ],
    correctOptionId: 'b',
    explanation: 'A ordem dos algarismos importa (123 é diferente de 321), então é um arranjo: A(5,3) = 5×4×3 = 60.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_combinatoria_5',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'No desenvolvimento do binômio (x + y)⁶, qual é o coeficiente do termo x²y⁴?',
    options: [
      { id: 'a', text: '6' },
      { id: 'b', text: '15' },
      { id: 'c', text: '20' },
      { id: 'd', text: '30' }
    ],
    correctOptionId: 'b',
    explanation: 'Pelo binômio de Newton, o termo geral é C(6,k)·x^(6-k)·y^k. Para obter x²y⁴, precisamos de k = 4, e o coeficiente é C(6,4) = 15.',
    difficulty: 'hard'
  },
  // Matemática — Geometria Plana
  {
    id: 'q_mat_geometria_plana_1',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Duas torres verticais projetam sombras no chão no mesmo instante do dia. A torre menor, de 6 m de altura, projeta uma sombra de 4 m. Se a torre maior projeta uma sombra de 10 m, qual é sua altura, sabendo que as duas situações formam triângulos semelhantes?',
    options: [
      { id: 'a', text: '12 m' },
      { id: 'b', text: '15 m' },
      { id: 'c', text: '18 m' },
      { id: 'd', text: '20 m' }
    ],
    correctOptionId: 'b',
    explanation: 'Por semelhança de triângulos, a razão altura/sombra é constante: 6/4 = h/10 → h = 60/4 = 15 m.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_2',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um trapézio tem bases medindo 8 cm e 12 cm, e altura de 5 cm. Qual é a sua área?',
    options: [
      { id: 'a', text: '40 cm²' },
      { id: 'b', text: '45 cm²' },
      { id: 'c', text: '50 cm²' },
      { id: 'd', text: '60 cm²' }
    ],
    correctOptionId: 'c',
    explanation: 'A área do trapézio é dada por (base maior + base menor)/2 × altura = (12 + 8)/2 × 5 = 10 × 5 = 50 cm².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_3',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Em um triângulo retângulo, a altura relativa à hipotenusa mede 4,8 cm, e um dos segmentos que ela determina na hipotenusa mede 3,6 cm. Qual é o comprimento do cateto adjacente a esse segmento?',
    options: [
      { id: 'a', text: '4,8 cm' },
      { id: 'b', text: '6 cm' },
      { id: 'c', text: '7,2 cm' },
      { id: 'd', text: '8,4 cm' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela relação h² = m·n, o outro segmento é n = h²/m = 4,8²/3,6 = 23,04/3,6 = 6,4 cm. A hipotenusa total é m + n = 10 cm. O cateto adjacente ao segmento m satisfaz c² = m × hipotenusa = 3,6 × 10 = 36, logo c = 6 cm.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_plana_4',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a medida de cada ângulo interno de um hexágono regular?',
    options: [
      { id: 'a', text: '100°' },
      { id: 'b', text: '108°' },
      { id: 'c', text: '120°' },
      { id: 'd', text: '135°' }
    ],
    correctOptionId: 'c',
    explanation: 'A soma dos ângulos internos de um polígono de n lados é (n-2)×180°. Para o hexágono (n=6): (6-2)×180° = 720°. Dividindo pelos 6 ângulos iguais: 720°/6 = 120°.',
    difficulty: 'medium'
  },
  {
    id: 'q_real_enem_2023_mat',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Sejam a, b e c as medidas dos lados de um triângulo retângulo, tendo a como medida da hipotenusa. Esses valores a, b e c são, respectivamente, os diâmetros dos círculos C1, C2 e C3. Essa construção assegura, pelo teorema de Pitágoras, que área(C1) = área(C2) + área(C3). Um professor de matemática desafiou dois amigos: sem usar instrumento de medição, ele poderia afirmar se a área do círculo correspondente à pizza que ele pedisse era maior, igual ou menor do que a soma das áreas das pizzas dos dois amigos. Formou-se um triângulo com os diâmetros das três pizzas, com ângulo α oposto ao diâmetro da pizza do professor. O professor afirmou que a área de sua pizza é maior do que a soma das áreas das outras duas. Isso ocorre porque:',
    options: [
      { id: 'a', text: '0° < α < 90°' },
      { id: 'b', text: 'α = 90°' },
      { id: 'c', text: '90° < α < 180°' },
      { id: 'd', text: 'α = 180°' },
      { id: 'e', text: '180° < α < 360°' }
    ],
    correctOptionId: 'c',
    explanation: 'Quando α = 90°, o triângulo é retângulo e, pelo Teorema de Pitágoras, a área do maior círculo é exatamente igual à soma das outras duas. Se α aumenta além de 90° (triângulo obtusângulo), o lado oposto a α cresce em relação ao caso retângulo, tornando a área do círculo maior do professor ainda maior que a soma das outras duas.',
    difficulty: 'hard',
    examSource: { board: 'ENEM', year: 2023, sourceUrl: 'https://rendewo.com/content/enem_2023/q142.html' }
  },
  // Matemática — Probabilidade e Interpretação de Dados
  {
    id: 'q_mat_dados_probabilidade_1',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Uma urna tem 5 bolas vermelhas e 3 azuis. Retiram-se 2 bolas sucessivamente, sem reposição. Qual é a probabilidade de as duas serem vermelhas?',
    options: [
      { id: 'a', text: '5/14' },
      { id: 'b', text: '5/8' },
      { id: 'c', text: '25/64' },
      { id: 'd', text: '1/2' }
    ],
    correctOptionId: 'a',
    explanation: 'Na primeira retirada, P(vermelha) = 5/8. Sem reposição, na segunda retirada restam 4 vermelhas em 7 bolas: P(vermelha) = 4/7. A probabilidade das duas é (5/8)×(4/7) = 20/56 = 5/14.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_dados_probabilidade_2',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Uma moeda honesta é lançada 3 vezes. Qual é a probabilidade de sair pelo menos uma cara?',
    options: [
      { id: 'a', text: '1/8' },
      { id: 'b', text: '3/8' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '7/8' }
    ],
    correctOptionId: 'd',
    explanation: 'É mais fácil calcular o complementar: P(nenhuma cara) = (1/2)³ = 1/8. Logo, P(pelo menos uma cara) = 1 - 1/8 = 7/8.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_dados_probabilidade_3',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Em uma sala de 40 alunos, 25 gostam de Matemática, 20 gostam de Física, e 10 gostam das duas matérias. Escolhendo um aluno ao acaso, qual é a probabilidade de que ele não goste de nenhuma das duas matérias?',
    options: [
      { id: 'a', text: '1/8' },
      { id: 'b', text: '1/4' },
      { id: 'c', text: '3/8' },
      { id: 'd', text: '1/2' }
    ],
    correctOptionId: 'a',
    explanation: 'Pelo princípio da inclusão-exclusão, gostam de pelo menos uma: 25 + 20 - 10 = 35. Não gostam de nenhuma: 40 - 35 = 5. A probabilidade é 5/40 = 1/8.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_dados_probabilidade_4',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Um conjunto de dados tem os valores 2, 3, 3, 5 e 100. Qual medida de tendência central melhor representa o valor "típico" desse conjunto, considerando a presença do valor discrepante 100?',
    options: [
      { id: 'a', text: 'A média' },
      { id: 'b', text: 'A mediana' },
      { id: 'c', text: 'As duas representam igualmente bem' },
      { id: 'd', text: 'Nenhuma das duas' }
    ],
    correctOptionId: 'b',
    explanation: 'A média é 113/5 = 22,6, fortemente distorcida pelo valor discrepante 100. A mediana (o valor central, 3) não é afetada por esse outlier e representa melhor o "típico" desse conjunto.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_dados_probabilidade_5',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Ao formar uma comissão de 3 pessoas escolhidas aleatoriamente entre 4 homens e 6 mulheres (total de 10 pessoas), qual é a probabilidade de a comissão ser formada por exatamente 2 mulheres e 1 homem?',
    options: [
      { id: 'a', text: '1/3' },
      { id: 'b', text: '2/5' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '3/5' }
    ],
    correctOptionId: 'c',
    explanation: 'Casos favoráveis: C(6,2)×C(4,1) = 15×4 = 60. Total de comissões possíveis: C(10,3) = 120. Probabilidade = 60/120 = 1/2.',
    difficulty: 'hard'
  },
  // Matemática — Trigonometria
  {
    id: 'q_mat_trigonometria_1',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Em um triângulo, dois lados medem 7 cm e 10 cm, e o ângulo entre eles é 60°. Usando a Lei dos Cossenos (cos 60° = 0,5), qual é, aproximadamente, a medida do terceiro lado?',
    options: [
      { id: 'a', text: '7,9 cm' },
      { id: 'b', text: '8,9 cm' },
      { id: 'c', text: '9,9 cm' },
      { id: 'd', text: '10,9 cm' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Lei dos Cossenos: a² = 7² + 10² - 2×7×10×0,5 = 49 + 100 - 70 = 79. Logo, a = √79 ≈ 8,9 cm.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_trigonometria_2',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Se sen(x) = 0,6 e x é um ângulo agudo, qual é o valor de cos(x)?',
    options: [
      { id: 'a', text: '0,4' },
      { id: 'b', text: '0,6' },
      { id: 'c', text: '0,8' },
      { id: 'd', text: '1,0' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela relação fundamental sen²(x) + cos²(x) = 1: cos²(x) = 1 - 0,36 = 0,64, logo cos(x) = 0,8 (positivo, pois x é agudo).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_3',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Qual é o período da função f(x) = sen(2x)?',
    options: [
      { id: 'a', text: 'π/2' },
      { id: 'b', text: 'π' },
      { id: 'c', text: '2π' },
      { id: 'd', text: '4π' }
    ],
    correctOptionId: 'b',
    explanation: 'O período da função seno padrão é 2π. Quando o argumento é multiplicado por 2 (sen(2x)), o período é dividido por 2: 2π/2 = π.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_trigonometria_4',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'De um ponto no chão, a 30 m da base de um prédio, o ângulo de elevação até o topo do prédio é de 45°. Qual é, aproximadamente, a altura do prédio?',
    options: [
      { id: 'a', text: '15 m' },
      { id: 'b', text: '21 m' },
      { id: 'c', text: '26 m' },
      { id: 'd', text: '30 m' }
    ],
    correctOptionId: 'd',
    explanation: 'tan(45°) = altura/distância = 1. Como a distância é 30 m, a altura também é 30 m.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_5',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Em um triângulo, um ângulo mede 45° e o lado oposto a ele mede 10 cm. Outro ângulo mede 30°. Pela Lei dos Senos (sen 30° = 0,5; sen 45° ≈ 0,71), qual é, aproximadamente, a medida do lado oposto ao ângulo de 30°?',
    options: [
      { id: 'a', text: '5,0 cm' },
      { id: 'b', text: '6,0 cm' },
      { id: 'c', text: '7,0 cm' },
      { id: 'd', text: '8,5 cm' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela Lei dos Senos: x/sen(30°) = 10/sen(45°) → x = 10 × 0,5/0,71 ≈ 7,0 cm.',
    difficulty: 'hard'
  },
  // Física — Cinemática Escalar
  {
    id: 'q_fis_cinematica_1',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um trem se move com velocidade constante de 72 km/h. Convertendo para o Sistema Internacional (m/s), qual é essa velocidade?',
    options: [
      { id: 'a', text: '7,2 m/s' },
      { id: 'b', text: '20 m/s' },
      { id: 'c', text: '36 m/s' },
      { id: 'd', text: '200 m/s' }
    ],
    correctOptionId: 'b',
    explanation: 'Para converter km/h em m/s, divide-se por 3,6: 72/3,6 = 20 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_cinematica_2',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um objeto é lançado verticalmente para cima com velocidade inicial de 30 m/s. Desprezando a resistência do ar e usando g = 10 m/s², quanto tempo leva até atingir a altura máxima?',
    options: [
      { id: 'a', text: '1,5 s' },
      { id: 'b', text: '3 s' },
      { id: 'c', text: '6 s' },
      { id: 'd', text: '9 s' }
    ],
    correctOptionId: 'b',
    explanation: 'Na altura máxima, v = 0. Usando v = v0 - g·t: 0 = 30 - 10t → t = 3 s.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_cinematica_3',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Dois carros partem do mesmo ponto, no mesmo instante, na mesma direção e sentido. O carro A parte com velocidade constante de 20 m/s. O carro B parte do repouso, com aceleração constante de 4 m/s². Após quantos segundos o carro B alcança o carro A?',
    options: [
      { id: 'a', text: '5 s' },
      { id: 'b', text: '8 s' },
      { id: 'c', text: '10 s' },
      { id: 'd', text: '20 s' }
    ],
    correctOptionId: 'c',
    explanation: 'Posição de A: 20t. Posição de B: 2t² (usando s=½at²). Igualando: 20t = 2t² → t = 10 s (descartando t=0).',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_cinematica_4',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um corpo em movimento retilíneo uniformemente variado parte com velocidade inicial de 10 m/s e aceleração de 2 m/s². Qual é a distância percorrida entre os instantes t=2s e t=5s?',
    options: [
      { id: 'a', text: '30 m' },
      { id: 'b', text: '45 m' },
      { id: 'c', text: '51 m' },
      { id: 'd', text: '60 m' }
    ],
    correctOptionId: 'c',
    explanation: 'Posição s(t) = 10t + t². s(5) = 50+25 = 75 m. s(2) = 20+4 = 24 m. Distância percorrida entre os dois instantes: 75 - 24 = 51 m.',
    difficulty: 'hard'
  },
  // Física — Eletrodinâmica (Circuitos Elétricos)
  {
    id: 'q_fis_circuitos_1',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Em um circuito, um resistor de 10 Ω é percorrido por uma corrente de 2 A. Qual é a diferença de potencial (tensão) sobre esse resistor?',
    options: [
      { id: 'a', text: '5 V' },
      { id: 'b', text: '8 V' },
      { id: 'c', text: '12 V' },
      { id: 'd', text: '20 V' }
    ],
    correctOptionId: 'd',
    explanation: 'Pela Lei de Ohm, V = R × I = 10 × 2 = 20 V.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_circuitos_2',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Dois resistores de 4 Ω e 6 Ω estão associados em série em um circuito com uma fonte de 20 V. Qual é a corrente total que percorre o circuito?',
    options: [
      { id: 'a', text: '0,5 A' },
      { id: 'b', text: '2 A' },
      { id: 'c', text: '5 A' },
      { id: 'd', text: '10 A' }
    ],
    correctOptionId: 'b',
    explanation: 'Em série, a resistência equivalente é 4+6 = 10 Ω. Pela Lei de Ohm, I = V/Req = 20/10 = 2 A.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_circuitos_3',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Dois resistores de 6 Ω cada estão associados em paralelo. Qual é a resistência equivalente dessa associação?',
    options: [
      { id: 'a', text: '3 Ω' },
      { id: 'b', text: '6 Ω' },
      { id: 'c', text: '12 Ω' },
      { id: 'd', text: '36 Ω' }
    ],
    correctOptionId: 'a',
    explanation: 'Em paralelo: 1/Req = 1/6 + 1/6 = 2/6 = 1/3, logo Req = 3 Ω.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_circuitos_4',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Em uma associação de resistores em série, o que se mantém igual em todos os resistores?',
    options: [
      { id: 'a', text: 'A corrente elétrica' },
      { id: 'b', text: 'A tensão' },
      { id: 'c', text: 'A potência dissipada' },
      { id: 'd', text: 'A resistência' }
    ],
    correctOptionId: 'a',
    explanation: 'Em uma associação em série, a mesma corrente atravessa todos os resistores, um após o outro — é a tensão que se divide entre eles, proporcionalmente à resistência de cada um.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_circuitos_5',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Um chuveiro elétrico tem potência de 4.400 W e opera em uma tensão de 220 V. Qual é a corrente elétrica que passa pelo chuveiro durante o funcionamento?',
    options: [
      { id: 'a', text: '2 A' },
      { id: 'b', text: '10 A' },
      { id: 'c', text: '20 A' },
      { id: 'd', text: '200 A' }
    ],
    correctOptionId: 'c',
    explanation: 'A potência elétrica é P = V×I, logo I = P/V = 4400/220 = 20 A.',
    difficulty: 'hard'
  },
  // Física — Leis de Newton e Dinâmica do Movimento Retilíneo
  {
    id: 'q_fis_leis_newton_1',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'Um bloco de massa 5 kg está sobre uma superfície horizontal sem atrito e é puxado por uma força horizontal de 20 N. Qual é a aceleração do bloco?',
    options: [
      { id: 'a', text: '2 m/s²' },
      { id: 'b', text: '4 m/s²' },
      { id: 'c', text: '5 m/s²' },
      { id: 'd', text: '100 m/s²' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Segunda Lei de Newton, a = F/m = 20/5 = 4 m/s².',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_leis_newton_2',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'Um bloco de massa 10 kg é puxado por uma força horizontal de 50 N sobre uma superfície com coeficiente de atrito cinético de 0,2. Usando g = 10 m/s², qual é a aceleração do bloco?',
    options: [
      { id: 'a', text: '2 m/s²' },
      { id: 'b', text: '3 m/s²' },
      { id: 'c', text: '5 m/s²' },
      { id: 'd', text: '7 m/s²' }
    ],
    correctOptionId: 'b',
    explanation: 'A força de atrito é Fat = μ×N = 0,2×10×10 = 20 N. A força resultante é 50-20 = 30 N. A aceleração é a = 30/10 = 3 m/s².',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_leis_newton_3',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'Dois blocos, A (massa 3 kg) e B (massa 2 kg), estão conectados por um fio ideal e são puxados por uma força horizontal de 20 N aplicada em A, sobre uma superfície sem atrito. Qual é a tração no fio que conecta os blocos?',
    options: [
      { id: 'a', text: '4 N' },
      { id: 'b', text: '8 N' },
      { id: 'c', text: '12 N' },
      { id: 'd', text: '20 N' }
    ],
    correctOptionId: 'b',
    explanation: 'A massa total do sistema é 5 kg, então a aceleração é a = 20/5 = 4 m/s². A tração no fio é a força necessária para acelerar apenas o bloco B: T = mB×a = 2×4 = 8 N.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_leis_newton_4',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'De acordo com a Terceira Lei de Newton (ação e reação), quando um cavalo puxa uma carroça para frente, a carroça também exerce uma força sobre o cavalo. Por que, então, o conjunto se move para frente, em vez de ficar parado?',
    options: [
      { id: 'a', text: 'Porque as forças de ação e reação atuam em corpos diferentes, então não se anulam entre si' },
      { id: 'b', text: 'Porque a força da carroça sobre o cavalo é sempre menor' },
      { id: 'c', text: 'Porque não existe atrito nesse sistema' },
      { id: 'd', text: 'Porque a Terceira Lei não se aplica a esse caso' }
    ],
    correctOptionId: 'a',
    explanation: 'As forças de ação e reação têm sempre a mesma intensidade, mas atuam em corpos DIFERENTES (uma no cavalo, outra na carroça) — por isso nunca se cancelam entre si. O movimento do conjunto depende da resultante de todas as forças que atuam em cada corpo, incluindo o atrito do chão sobre as patas do cavalo.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_leis_newton_5',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'Um elevador de massa 800 kg sobe com aceleração de 2 m/s² (para cima). Usando g = 10 m/s², qual é a tração no cabo que sustenta o elevador?',
    options: [
      { id: 'a', text: '6.400 N' },
      { id: 'b', text: '8.000 N' },
      { id: 'c', text: '9.600 N' },
      { id: 'd', text: '16.000 N' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela Segunda Lei de Newton, T - mg = ma → T = m(g+a) = 800×(10+2) = 9.600 N.',
    difficulty: 'hard'
  },
  // Física — Calorimetria
  {
    id: 'q_fis_calorimetria_1',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Qual é a quantidade de calor necessária para elevar a temperatura de 500 g de água de 20°C para 60°C? (calor específico da água = 1 cal/g°C)',
    options: [
      { id: 'a', text: '2.000 cal' },
      { id: 'b', text: '10.000 cal' },
      { id: 'c', text: '20.000 cal' },
      { id: 'd', text: '40.000 cal' }
    ],
    correctOptionId: 'c',
    explanation: 'Q = m×c×ΔT = 500×1×40 = 20.000 cal.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_calorimetria_2',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Durante uma mudança de estado físico (como a fusão do gelo), o que acontece com a temperatura da substância enquanto o calor está sendo fornecido?',
    options: [
      { id: 'a', text: 'Aumenta proporcionalmente ao calor fornecido' },
      { id: 'b', text: 'Permanece constante até a mudança de estado se completar' },
      { id: 'c', text: 'Diminui' },
      { id: 'd', text: 'Oscila de forma imprevisível' }
    ],
    correctOptionId: 'b',
    explanation: 'Durante uma mudança de estado, todo o calor fornecido (calor latente) é usado para reorganizar as ligações entre as moléculas, não para aumentar a agitação térmica — por isso a temperatura permanece constante até a transição terminar.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_calorimetria_3',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Qual é a quantidade de calor necessária para fundir completamente 100 g de gelo a 0°C, sabendo que o calor latente de fusão do gelo é 80 cal/g?',
    options: [
      { id: 'a', text: '80 cal' },
      { id: 'b', text: '800 cal' },
      { id: 'c', text: '8.000 cal' },
      { id: 'd', text: '80.000 cal' }
    ],
    correctOptionId: 'c',
    explanation: 'Q = m×L = 100×80 = 8.000 cal.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_calorimetria_4',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Um bloco de metal de 200 g, a 100°C, é colocado em 300 g de água a 20°C, em um sistema termicamente isolado. O calor específico da água é 1 cal/g°C e do metal é 0,2 cal/g°C. Qual é, aproximadamente, a temperatura de equilíbrio do sistema?',
    options: [
      { id: 'a', text: '24°C' },
      { id: 'b', text: '29°C' },
      { id: 'c', text: '40°C' },
      { id: 'd', text: '60°C' }
    ],
    correctOptionId: 'b',
    explanation: 'O calor perdido pelo metal é igual ao ganho pela água: 200×0,2×(100-Te) = 300×1×(Te-20). Resolvendo: 4000-40Te = 300Te-6000 → 10000 = 340Te → Te ≈ 29,4°C.',
    difficulty: 'hard'
  },
  // Física — Termodinâmica dos Gases
  {
    id: 'q_fis_termodinamica_gases_1',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'Um gás ideal está em um recipiente de volume fixo. Se sua temperatura absoluta dobra, o que acontece com sua pressão, mantendo o número de mols constante?',
    options: [
      { id: 'a', text: 'Permanece igual' },
      { id: 'b', text: 'Dobra' },
      { id: 'c', text: 'Reduz à metade' },
      { id: 'd', text: 'Quadruplica' }
    ],
    correctOptionId: 'b',
    explanation: 'A volume e número de mols constantes, pressão e temperatura absoluta são diretamente proporcionais (Lei de Gay-Lussac): dobrar T dobra P.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_termodinamica_gases_2',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'Um gás ideal ocupa 2 L a uma pressão de 3 atm. Se a pressão for reduzida para 1 atm, mantendo a temperatura constante, qual será o novo volume do gás?',
    options: [
      { id: 'a', text: '2 L' },
      { id: 'b', text: '3 L' },
      { id: 'c', text: '6 L' },
      { id: 'd', text: '9 L' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela Lei de Boyle (transformação isotérmica), P1V1 = P2V2 → 3×2 = 1×V2 → V2 = 6 L.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_termodinamica_gases_3',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'Um gás ideal sofre uma transformação isotérmica (temperatura constante) de um estado A para um estado B, com redução do volume. O que acontece com a energia interna desse gás durante essa transformação?',
    options: [
      { id: 'a', text: 'Aumenta' },
      { id: 'b', text: 'Diminui' },
      { id: 'c', text: 'Permanece constante' },
      { id: 'd', text: 'Torna-se zero' }
    ],
    correctOptionId: 'c',
    explanation: 'Para um gás ideal, a energia interna depende exclusivamente da temperatura. Como a transformação é isotérmica (T constante), a energia interna não muda, mesmo com a variação de volume e pressão.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_termodinamica_gases_4',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'Segundo a Primeira Lei da Termodinâmica, a variação da energia interna de um sistema é igual a:',
    options: [
      { id: 'a', text: 'Calor recebido mais trabalho realizado pelo sistema' },
      { id: 'b', text: 'Calor recebido menos trabalho realizado pelo sistema' },
      { id: 'c', text: 'Apenas o calor recebido' },
      { id: 'd', text: 'Apenas o trabalho realizado' }
    ],
    correctOptionId: 'b',
    explanation: 'A Primeira Lei da Termodinâmica é ΔU = Q - W, onde Q é o calor trocado com o sistema e W é o trabalho realizado PELO sistema.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_termodinamica_gases_5',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'Um mol de gás ideal ocupa um volume de 22,4 L nas CNTP (0°C, 1 atm). Se a temperatura for elevada para 273°C, mantendo a pressão constante, qual será, aproximadamente, o novo volume?',
    options: [
      { id: 'a', text: '11,2 L' },
      { id: 'b', text: '22,4 L' },
      { id: 'c', text: '44,8 L' },
      { id: 'd', text: '89,6 L' }
    ],
    correctOptionId: 'c',
    explanation: 'Em Kelvin, a temperatura inicial é 273 K e a final é 273+273 = 546 K, ou seja, dobra. A pressão constante, volume e temperatura absoluta são diretamente proporcionais (Lei de Charles): o volume também dobra, para 44,8 L.',
    difficulty: 'hard'
  },
  // Física — Óptica Geométrica
  {
    id: 'q_fis_optica_geometrica_1',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'Um objeto está posicionado no centro de curvatura de um espelho côncavo. Onde se forma a imagem?',
    options: [
      { id: 'a', text: 'No foco' },
      { id: 'b', text: 'No centro de curvatura' },
      { id: 'c', text: 'No infinito' },
      { id: 'd', text: 'Atrás do espelho (imagem virtual)' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando o objeto está no centro de curvatura de um espelho côncavo, a imagem se forma exatamente no mesmo ponto — real, invertida e de mesmo tamanho que o objeto.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_optica_geometrica_2',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'Um espelho plano gera uma imagem de um objeto colocado a 30 cm de sua superfície. A que distância do espelho está a imagem, e que tipo de imagem é formada?',
    options: [
      { id: 'a', text: '15 cm, real' },
      { id: 'b', text: '30 cm, virtual' },
      { id: 'c', text: '60 cm, real' },
      { id: 'd', text: '30 cm, real' }
    ],
    correctOptionId: 'b',
    explanation: 'Em um espelho plano, a imagem se forma sempre à mesma distância do espelho que o objeto, mas do lado oposto (atrás do espelho) — sendo sempre virtual e de mesmo tamanho.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_optica_geometrica_3',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'Um objeto é colocado a 20 cm de uma lente convergente de distância focal 10 cm. Usando a equação de Gauss (1/f = 1/p + 1/p\'), a que distância da lente se forma a imagem?',
    options: [
      { id: 'a', text: '10 cm' },
      { id: 'b', text: '15 cm' },
      { id: 'c', text: '20 cm' },
      { id: 'd', text: '40 cm' }
    ],
    correctOptionId: 'c',
    explanation: '1/10 = 1/20 + 1/p\' → 1/p\' = 1/10 - 1/20 = 1/20 → p\' = 20 cm.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_optica_geometrica_4',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'A refração da luz ocorre quando ela passa de um meio para outro com índice de refração diferente. O que acontece com a velocidade da luz ao passar do ar (menos denso opticamente) para a água (mais densa opticamente)?',
    options: [
      { id: 'a', text: 'Aumenta' },
      { id: 'b', text: 'Diminui' },
      { id: 'c', text: 'Permanece igual' },
      { id: 'd', text: 'A luz para de se propagar' }
    ],
    correctOptionId: 'b',
    explanation: 'Quanto maior o índice de refração de um meio, menor é a velocidade de propagação da luz nele. Como a água tem índice de refração maior que o ar, a velocidade da luz diminui ao entrar na água.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_optica_geometrica_5',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'Um raio de luz incide sobre um espelho plano com ângulo de incidência de 40° (medido em relação à reta normal à superfície). Qual é o ângulo de reflexão desse raio?',
    options: [
      { id: 'a', text: '20°' },
      { id: 'b', text: '40°' },
      { id: 'c', text: '50°' },
      { id: 'd', text: '80°' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Lei da Reflexão, o ângulo de incidência é sempre igual ao ângulo de reflexão, ambos medidos em relação à normal: 40°.',
    difficulty: 'easy'
  },
  // Física — Óptica Instrumental e da Visão
  {
    id: 'q_fis_optica_instrumental_1',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Uma pessoa com hipermetropia tem dificuldade para enxergar objetos próximos, pois a imagem se forma atrás da retina. Que tipo de lente corretiva é indicada?',
    options: [
      { id: 'a', text: 'Convergente' },
      { id: 'b', text: 'Divergente' },
      { id: 'c', text: 'Plana' },
      { id: 'd', text: 'Nenhuma correção óptica resolve' }
    ],
    correctOptionId: 'a',
    explanation: 'Lentes convergentes aumentam a convergência dos raios de luz, adiantando a formação da imagem para que ela caia exatamente sobre a retina, corrigindo a hipermetropia.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_optica_instrumental_2',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Uma pessoa com miopia tem dificuldade para enxergar objetos distantes, pois a imagem se forma antes da retina. Que tipo de lente corretiva é indicada?',
    options: [
      { id: 'a', text: 'Convergente' },
      { id: 'b', text: 'Divergente' },
      { id: 'c', text: 'Bifocal, apenas' },
      { id: 'd', text: 'Nenhuma correção óptica resolve' }
    ],
    correctOptionId: 'b',
    explanation: 'Lentes divergentes reduzem a convergência dos raios de luz, atrasando a formação da imagem até que ela caia exatamente sobre a retina, corrigindo a miopia.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_optica_instrumental_3',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Um microscópio composto é formado por duas lentes convergentes: a objetiva (próxima ao objeto) e a ocular (próxima ao olho). Qual é a principal função da lente objetiva nesse sistema?',
    options: [
      { id: 'a', text: 'Formar uma imagem real e ampliada do objeto, que servirá de objeto para a ocular' },
      { id: 'b', text: 'Formar uma imagem virtual reduzida' },
      { id: 'c', text: 'Corrigir apenas a miopia do observador' },
      { id: 'd', text: 'Não tem função óptica relevante' }
    ],
    correctOptionId: 'a',
    explanation: 'A objetiva forma uma primeira imagem real e ampliada do objeto original; essa imagem serve como "objeto" para a lente ocular, que a amplia ainda mais, formando a imagem final virtual observada pelo olho.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_optica_instrumental_4',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Uma lupa (lente de aumento) é uma lente convergente usada para observar objetos pequenos, ampliados. Para que a lupa produza uma imagem virtual, direita e ampliada, o objeto deve ser posicionado:',
    options: [
      { id: 'a', text: 'Além do centro de curvatura' },
      { id: 'b', text: 'Exatamente no foco' },
      { id: 'c', text: 'Entre o foco e a lente (distância menor que a focal)' },
      { id: 'd', text: 'No infinito' }
    ],
    correctOptionId: 'c',
    explanation: 'Quando o objeto está entre o foco e a lente convergente, a imagem formada é virtual, direita e ampliada — exatamente o efeito desejado em uma lupa.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_optica_instrumental_5',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Qual é o nome dado à dificuldade de acomodação visual para perto, comum a partir dos 40-45 anos de idade, causada pela perda de elasticidade natural do cristalino ao longo da vida?',
    options: [
      { id: 'a', text: 'Miopia' },
      { id: 'b', text: 'Hipermetropia' },
      { id: 'c', text: 'Presbiopia' },
      { id: 'd', text: 'Astigmatismo' }
    ],
    correctOptionId: 'c',
    explanation: 'A presbiopia (ou "vista cansada") é a perda progressiva da capacidade de acomodação visual do cristalino com o envelhecimento, dificultando o foco em objetos próximos.',
    difficulty: 'medium'
  },
  // Física — Ondulatória
  {
    id: 'q_fis_ondulatoria_1',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'O efeito Doppler explica por que o som de uma ambulância parece mais agudo quando ela se aproxima e mais grave quando ela se afasta. O que causa essa mudança percebida na frequência do som?',
    options: [
      { id: 'a', text: 'Uma mudança real na velocidade do som no ar' },
      { id: 'b', text: 'O movimento relativo entre a fonte sonora e o observador' },
      { id: 'c', text: 'A mudança na temperatura do ar ao redor da ambulância' },
      { id: 'd', text: 'O efeito Doppler não existe para ondas sonoras' }
    ],
    correctOptionId: 'b',
    explanation: 'O efeito Doppler ocorre devido ao movimento relativo entre fonte e observador: quando se aproximam, as frentes de onda chegam mais compactadas (frequência percebida maior); quando se afastam, chegam mais espaçadas (frequência percebida menor).',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_ondulatoria_2',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'Em um tubo sonoro fechado em uma extremidade, apenas harmônicos de ordem ímpar (1º, 3º, 5º...) da frequência fundamental são possíveis. Se a frequência fundamental de um tubo é 100 Hz, qual é a frequência do harmônico de ordem 5 nesse tubo?',
    options: [
      { id: 'a', text: '200 Hz' },
      { id: 'b', text: '300 Hz' },
      { id: 'c', text: '500 Hz' },
      { id: 'd', text: '700 Hz' }
    ],
    correctOptionId: 'c',
    explanation: 'O harmônico de ordem n corresponde a n vezes a frequência fundamental: 5 × 100 Hz = 500 Hz.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_ondulatoria_3',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'O fenômeno da ressonância ocorre quando um sistema é excitado por uma força externa cuja frequência coincide com:',
    options: [
      { id: 'a', text: 'A frequência natural (própria) de vibração do sistema' },
      { id: 'b', text: 'A velocidade do som no ar' },
      { id: 'c', text: 'O comprimento de onda da luz visível' },
      { id: 'd', text: 'A amplitude máxima possível de qualquer onda' }
    ],
    correctOptionId: 'a',
    explanation: 'A ressonância ocorre quando a frequência da força excitadora coincide com a frequência natural de vibração do sistema, levando a uma amplitude de oscilação muito maior que o normal.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_ondulatoria_4',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'Duas cordas de mesmo material e mesma tensão, mas com comprimentos diferentes (uma o dobro da outra), vibram livremente. Qual delas produz um som de frequência mais baixa (mais grave)?',
    options: [
      { id: 'a', text: 'A corda mais curta' },
      { id: 'b', text: 'A corda mais longa' },
      { id: 'c', text: 'As duas produzem a mesma frequência' },
      { id: 'd', text: 'Não é possível determinar sem saber a tensão exata' }
    ],
    correctOptionId: 'b',
    explanation: 'A frequência fundamental de uma corda vibrante é inversamente proporcional ao seu comprimento. A corda mais longa, portanto, produz uma frequência mais baixa (som mais grave).',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_ondulatoria_5',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'Uma onda sonora se propaga do ar para a água. O que permanece constante nessa transição entre os dois meios?',
    options: [
      { id: 'a', text: 'A velocidade de propagação' },
      { id: 'b', text: 'O comprimento de onda' },
      { id: 'c', text: 'A frequência' },
      { id: 'd', text: 'A amplitude' }
    ],
    correctOptionId: 'c',
    explanation: 'A frequência de uma onda é determinada pela fonte que a gera, permanecendo constante ao mudar de meio. Já a velocidade de propagação e o comprimento de onda mudam, pois dependem das propriedades do meio.',
    difficulty: 'hard'
  },
  // Química — Análises Quantitativas e Estequiometria
  {
    id: 'q_qui_estequiometria_1',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Na reação de combustão do metano: CH₄ + 2O₂ → CO₂ + 2H₂O, quantos mols de O₂ são necessários para queimar completamente 3 mols de CH₄?',
    options: [
      { id: 'a', text: '3 mols' },
      { id: 'b', text: '6 mols' },
      { id: 'c', text: '9 mols' },
      { id: 'd', text: '12 mols' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela proporção estequiométrica (1 CH₄ : 2 O₂), 3 mols de CH₄ exigem 3×2 = 6 mols de O₂.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_estequiometria_2',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Reagindo 4 mols de H₂ com 1 mol de N₂, segundo a equação N₂ + 3H₂ → 2NH₃, qual reagente está em excesso, e quanto sobra dele ao final da reação?',
    options: [
      { id: 'a', text: 'N₂ em excesso, sobra 1 mol' },
      { id: 'b', text: 'H₂ em excesso, sobra 1 mol' },
      { id: 'c', text: 'H₂ em excesso, sobra 3 mols' },
      { id: 'd', text: 'Nenhum reagente está em excesso' }
    ],
    correctOptionId: 'b',
    explanation: '1 mol de N₂ precisa de 3 mols de H₂ para reagir completamente. Como há 4 mols de H₂ disponíveis, sobra 4-3 = 1 mol de H₂ ao final — o N₂ é o reagente limitante.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_estequiometria_2b',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Qual é a massa (em gramas) de CO₂ produzida na queima completa de 44 g de propano (C₃H₈), segundo a reação C₃H₈ + 5O₂ → 3CO₂ + 4H₂O? (massas molares: C₃H₈ = 44 g/mol, CO₂ = 44 g/mol)',
    options: [
      { id: 'a', text: '44 g' },
      { id: 'b', text: '88 g' },
      { id: 'c', text: '132 g' },
      { id: 'd', text: '176 g' }
    ],
    correctOptionId: 'c',
    explanation: '44 g de propano correspondem a 1 mol. Pela proporção (1 C₃H₈ : 3 CO₂), formam-se 3 mols de CO₂ = 3×44 = 132 g.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_estequiometria_4',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Uma reação tem rendimento real de 80%. Se o rendimento teórico previsto for de 50 g de produto, qual é a massa real obtida na prática?',
    options: [
      { id: 'a', text: '10 g' },
      { id: 'b', text: '40 g' },
      { id: 'c', text: '50 g' },
      { id: 'd', text: '62,5 g' }
    ],
    correctOptionId: 'b',
    explanation: 'A massa real é 80% do rendimento teórico: 50 × 0,8 = 40 g.',
    difficulty: 'hard'
  },
  // Química — Polaridade das Ligações e Geometria Molecular
  {
    id: 'q_qui_polaridade_geometria_1',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'Qual é a geometria molecular da molécula de água (H₂O), considerando os dois pares de elétrons não ligantes no oxigênio?',
    options: [
      { id: 'a', text: 'Linear' },
      { id: 'b', text: 'Angular' },
      { id: 'c', text: 'Trigonal plana' },
      { id: 'd', text: 'Tetraédrica' }
    ],
    correctOptionId: 'b',
    explanation: 'Os dois pares de elétrons não ligantes no oxigênio "empurram" as ligações O-H, resultando em uma geometria angular (dobrada), com ângulo de ligação de aproximadamente 104,5°.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_polaridade_geometria_2',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'A molécula de CO₂ (dióxido de carbono) é apolar, mesmo tendo ligações C=O polares. Por que isso ocorre?',
    options: [
      { id: 'a', text: 'Porque o carbono não tem eletronegatividade' },
      { id: 'b', text: 'Porque a molécula é linear e simétrica, fazendo os vetores de polaridade das duas ligações se cancelarem' },
      { id: 'c', text: 'Porque o oxigênio é menos eletronegativo que o carbono' },
      { id: 'd', text: 'Porque CO₂ não tem ligações covalentes' }
    ],
    correctOptionId: 'b',
    explanation: 'Apesar de cada ligação C=O ser polar, a geometria linear e simétrica do CO₂ faz com que os dois vetores de dipolo, de mesma intensidade e sentidos opostos, se cancelem exatamente, resultando em uma molécula apolar.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_polaridade_geometria_3',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'A geometria molecular do metano (CH₄) é tetraédrica, com ângulos de ligação de aproximadamente 109,5°. O que determina essa geometria, segundo a Teoria da Repulsão dos Pares de Elétrons da Camada de Valência (VSEPR)?',
    options: [
      { id: 'a', text: 'Os pares de elétrons ao redor do átomo central se repelem, distribuindo-se o mais afastados possível uns dos outros' },
      { id: 'b', text: 'A geometria é determinada apenas pelo tamanho dos átomos de hidrogênio' },
      { id: 'c', text: 'Não existe nenhuma regra geral; cada molécula é um caso único' },
      { id: 'd', text: 'A geometria depende exclusivamente da massa atômica do carbono' }
    ],
    correctOptionId: 'a',
    explanation: 'A Teoria VSEPR prevê que os pares de elétrons (ligantes ou não) ao redor de um átomo central se repelem eletrostaticamente, adotando a disposição espacial que minimiza essa repulsão — no caso de 4 pares ligantes sem pares isolados, essa disposição é a tetraédrica.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_polaridade_geometria_4',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'Qual tipo de força intermolecular é responsável pelo ponto de ebulição anormalmente alto da água, comparado a outros hidretos de elementos do mesmo grupo (como H₂S)?',
    options: [
      { id: 'a', text: 'Força de London (dipolo induzido)' },
      { id: 'b', text: 'Ligação de hidrogênio' },
      { id: 'c', text: 'Força íon-dipolo' },
      { id: 'd', text: 'Ligação covalente' }
    ],
    correctOptionId: 'b',
    explanation: 'As ligações (pontes) de hidrogênio, muito mais fortes que outras forças intermoleculares, ocorrem entre moléculas de água devido à alta eletronegatividade do oxigênio ligado a hidrogênio, exigindo mais energia (temperatura mais alta) para separar as moléculas na ebulição.',
    difficulty: 'medium'
  },
  // Química — Fundamentos e Nomenclatura Orgânica
  {
    id: 'q_qui_organica_fundamentos_1',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Qual é a fórmula molecular do etano, um alcano de 2 carbonos?',
    options: [
      { id: 'a', text: 'C₂H₄' },
      { id: 'b', text: 'C₂H₆' },
      { id: 'c', text: 'C₂H₂' },
      { id: 'd', text: 'C₃H₈' }
    ],
    correctOptionId: 'b',
    explanation: 'Alcanos seguem a fórmula geral CnH2n+2. Para n=2: C₂H(2×2+2) = C₂H₆.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_organica_fundamentos_2',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Um carbono é classificado como terciário quando está ligado a quantos outros átomos de carbono?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '4' }
    ],
    correctOptionId: 'c',
    explanation: 'A classificação do carbono (primário, secundário, terciário, quaternário) depende do número de OUTROS átomos de carbono aos quais ele está diretamente ligado — o carbono terciário está ligado a exatamente 3 outros carbonos.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_organica_fundamentos_3',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Dois compostos orgânicos são isômeros entre si quando:',
    options: [
      { id: 'a', text: 'Têm a mesma fórmula molecular, mas estruturas diferentes' },
      { id: 'b', text: 'Têm fórmulas moleculares diferentes, mas propriedades iguais' },
      { id: 'c', text: 'São sempre da mesma função orgânica' },
      { id: 'd', text: 'Têm o mesmo número de átomos de hidrogênio apenas' }
    ],
    correctOptionId: 'a',
    explanation: 'Isômeros são compostos com a mesma fórmula molecular (mesmos átomos, nas mesmas quantidades), mas com estruturas (arranjos espaciais ou de ligações) diferentes — podendo até pertencer a funções orgânicas diferentes.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_organica_fundamentos_4',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Qual é a hibridação dos átomos de carbono em uma ligação dupla C=C, como no eteno (H₂C=CH₂)?',
    options: [
      { id: 'a', text: 'sp' },
      { id: 'b', text: 'sp²' },
      { id: 'c', text: 'sp³' },
      { id: 'd', text: 'Não há hibridação em ligações duplas' }
    ],
    correctOptionId: 'b',
    explanation: 'Carbonos com uma ligação dupla (e duas ligações simples adicionais) apresentam hibridação sp², com geometria trigonal plana ao redor de cada carbono da dupla ligação.',
    difficulty: 'hard'
  },
  // Química — Soluções
  {
    id: 'q_qui_solucoes_1',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Uma solução é preparada dissolvendo 20 g de sal em 500 mL de solução final. Qual é a concentração comum (em g/L) dessa solução?',
    options: [
      { id: 'a', text: '10 g/L' },
      { id: 'b', text: '20 g/L' },
      { id: 'c', text: '40 g/L' },
      { id: 'd', text: '100 g/L' }
    ],
    correctOptionId: 'c',
    explanation: 'Concentração comum = massa do soluto (g) / volume da solução (L) = 20 / 0,5 = 40 g/L.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_solucoes_2',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Uma solução aquosa tem concentração molar de 2 mol/L de NaCl, em um volume de 500 mL. Quantos mols de NaCl estão dissolvidos nessa solução?',
    options: [
      { id: 'a', text: '0,5 mol' },
      { id: 'b', text: '1 mol' },
      { id: 'c', text: '2 mols' },
      { id: 'd', text: '4 mols' }
    ],
    correctOptionId: 'b',
    explanation: 'n = C×V = 2 mol/L × 0,5 L = 1 mol.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_solucoes_3',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Ao misturar 200 mL de uma solução 1 mol/L de HCl com 300 mL de água pura, qual é a nova concentração molar da solução resultante (assumindo volumes aditivos)?',
    options: [
      { id: 'a', text: '0,2 mol/L' },
      { id: 'b', text: '0,4 mol/L' },
      { id: 'c', text: '0,6 mol/L' },
      { id: 'd', text: '1 mol/L' }
    ],
    correctOptionId: 'b',
    explanation: 'Os mols de HCl não mudam com a diluição: n = 1×0,2 = 0,2 mol. O novo volume é 200+300 = 500 mL = 0,5 L. Nova concentração: C = 0,2/0,5 = 0,4 mol/L.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_solucoes_4',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Qual é a massa de soluto necessária para preparar 2 L de uma solução 0,5 mol/L de NaOH (massa molar = 40 g/mol)?',
    options: [
      { id: 'a', text: '10 g' },
      { id: 'b', text: '20 g' },
      { id: 'c', text: '40 g' },
      { id: 'd', text: '80 g' }
    ],
    correctOptionId: 'c',
    explanation: 'n = C×V = 0,5×2 = 1 mol. Massa = n×massa molar = 1×40 = 40 g.',
    difficulty: 'hard'
  },
  // Questões reais de provas passadas (verificadas contra o gabarito oficial)
  {
    id: 'q_real_enem_2023_qui',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'O Aldrin é um inseticida agrícola organoclorado sintético de baixa polaridade, cuja estrutura molecular simétrica, de fórmula C12H8Cl6, foi introduzida na agricultura a partir da década de 1950. Esse composto apresenta alta persistência no meio ambiente e acumulação nos organismos, sendo danoso para a saúde. Um pesquisador coletou fluidos biológicos de indivíduos de uma população contaminada por esse inseticida agrícola, analisando amostras de saliva, sangue, lágrima, urina e leite quanto à presença dessa substância. Em qual dos fluidos o pesquisador provavelmente encontrou a maior concentração dessa substância?',
    options: [
      { id: 'a', text: 'Saliva, por consequência da atividade de enzimas.' },
      { id: 'b', text: 'Sangue, em função das hemácias e leucócitos.' },
      { id: 'c', text: 'Lágrima, em razão da concentração de sais.' },
      { id: 'd', text: 'Urina, pela presença de moléculas de ureia.' },
      { id: 'e', text: 'Leite, por causa do alto teor de gorduras.' }
    ],
    correctOptionId: 'e',
    explanation: 'O Aldrin é uma substância apolar (lipossolúvel), então se acumula preferencialmente em meios ricos em gordura, como o leite, e não em fluidos aquosos/hidrofílicos como saliva, sangue, lágrima ou urina — o fenômeno da bioacumulação de organoclorados no tecido adiposo.',
    difficulty: 'medium',
    examSource: { board: 'ENEM', year: 2023, sourceUrl: 'https://www.indagacao.com.br/2023/11/enem-2023-o-aldrin-e-um-inseticida-agricola-organoclorado-sintetico-de-baixa-polaridade-cuja-estrutura-molecular-simetrica-de-formula-c12h8cl16-esta-representada-na-figura.html' }
  },
  {
    id: 'q_real_fuvest_2022_bio',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A deficiência na enzima G6PD é uma condição recessiva ligada ao cromossomo X, que pode ser diagnosticada no teste do pezinho expandido. Pessoas com deficiência nessa enzima são suscetíveis à anemia hemolítica ao serem expostas à cloroquina ou primaquina, drogas amplamente prescritas por médicos no tratamento da malária. Assinale a alternativa correta:',
    options: [
      { id: 'a', text: 'Não é necessário fazer o teste do pezinho expandido em filhos de casais da região Nordeste do Brasil que apresentem deficiência da G6PD, já que menos de 3% dos testes serão positivos.' },
      { id: 'b', text: 'Aproximadamente 8,5 milhões de pessoas da região Centro-Oeste do Brasil têm somente um alelo recessivo para a deficiência em G6PD, sendo assintomáticas.' },
      { id: 'c', text: 'Cerca de 900 mil pessoas da região Norte do Brasil podem desenvolver anemia hemolítica devido ao tratamento com cloroquina, sendo a maioria do sexo masculino.' },
      { id: 'd', text: 'Descendentes de casais que não apresentam deficiência em G6PD têm mais de 25% de chance de possuírem o alelo recessivo e podem ser tratados com cloroquina em áreas onde a malária não seja endêmica.' },
      { id: 'e', text: 'Os pacientes do sexo masculino devem ser investigados quanto à presença de anemia hemolítica na família paterna caso vivam em regiões onde a malária é endêmica.' }
    ],
    correctOptionId: 'c',
    explanation: 'Por ser uma herança recessiva ligada ao cromossomo X, homens (XY) manifestam a deficiência com apenas um alelo recessivo, enquanto mulheres (XX) precisam de dois — o que torna a condição, e o risco de anemia hemolítica sob cloroquina, muito mais comum no sexo masculino.',
    difficulty: 'medium',
    examSource: { board: 'FUVEST', year: 2022, sourceUrl: 'https://acervo.fuvest.br/fuvest/2022/fuvest_2022_primeira_fase_tipo_V.pdf' }
  },
  {
    id: 'q_real_fuvest_2023_qui',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Combustíveis fósseis, como o diesel, contêm em sua composição uma fração de enxofre. Durante o processo de combustão, o enxofre é convertido em SO2, tornando-se um poluente ambiental, segundo a reação: S(s) + O2(g) → SO2(g). Em postos de combustível, normalmente são comercializados dois tipos de diesel: o Diesel S10, que contém 10 ppm de enxofre, e o Diesel S500, que contém 500 ppm de enxofre (1 ppm de enxofre equivale a 1 mg de enxofre por kg de diesel). Determine, em mg por kg de diesel, a diferença entre a massa de SO2 liberada na queima de 1 kg de Diesel S500 e a massa de SO2 liberada na queima de 1 kg de Diesel S10.',
    options: [
      { id: 'a', text: '245 mg/kg' },
      { id: 'b', text: '490 mg/kg' },
      { id: 'c', text: '980 mg/kg' },
      { id: 'd', text: '1960 mg/kg' },
      { id: 'e', text: '3920 mg/kg' }
    ],
    correctOptionId: 'c',
    explanation: 'A diferença de enxofre entre os dois dieseis é 500 - 10 = 490 mg de S por kg. Como 1 mol de S gera 1 mol de SO2 (massas molares 32 g/mol e 64 g/mol, razão 64/32 = 2), a massa de SO2 correspondente é 490 × 2 = 980 mg/kg.',
    difficulty: 'medium',
    examSource: { board: 'FUVEST', year: 2023, sourceUrl: 'https://old.kuadro.com.br/gabarito/fuvest/2023/quimica/fuvest-2023-1-fase-combustveis-fsseis-como-o-diese/77104' }
  },
  {
    id: 'q_real_comvest_2020_qui',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Um medicamento se apresenta na forma de comprimidos de 750 mg ou como suspensão oral na concentração de 100 mg/mL. A bula do remédio informa que o comprimido não pode ser partido, aberto ou mastigado e que, para crianças abaixo de 12 anos, a dosagem máxima é de 15 mg/kg/dose. Uma criança de 11 anos, pesando 40 kg, poderia ingerir com segurança, no máximo:',
    options: [
      { id: 'a', text: '6,0 mL da suspensão oral em uma única dose.' },
      { id: 'b', text: '7,5 mL da suspensão oral, ou um comprimido em uma única dose.' },
      { id: 'c', text: 'um comprimido em uma única dose.' },
      { id: 'd', text: '4,0 mL da suspensão oral em uma única dose.' }
    ],
    correctOptionId: 'a',
    explanation: 'A dose máxima para a criança é 15 mg/kg × 40 kg = 600 mg. Como o comprimido de 750 mg excede esse limite e não pode ser partido, ele não pode ser usado. Usando a suspensão de 100 mg/mL, o volume correspondente a 600 mg é 600/100 = 6,0 mL.',
    difficulty: 'easy',
    examSource: { board: 'COMVEST', year: 2020, sourceUrl: 'https://www.indagacao.com.br/2019/11/unicamp-2020-questao-50.html' }
  },
  {
    id: 'q_real_comvest_2023_fis',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um balão, inicialmente em repouso no solo, decola e sobe em movimento uniformemente variado. Se o balão atinge a altura h = 80 m após um tempo t = 40 s, conclui-se que a aceleração vertical do balão nesse movimento é igual a:',
    options: [
      { id: 'a', text: '2,0 m/s²' },
      { id: 'b', text: '4,0 m/s²' },
      { id: 'c', text: '0,05 m/s²' },
      { id: 'd', text: '0,1 m/s²' }
    ],
    correctOptionId: 'd',
    explanation: 'Partindo do repouso (v0 = 0), usa-se h = v0·t + ½·a·t². Substituindo: 80 = ½·a·(40)² → 80 = 800·a → a = 0,1 m/s².',
    difficulty: 'easy',
    examSource: { board: 'COMVEST', year: 2023, sourceUrl: 'https://www.questoes.indagacao.com/2022/11/um-balao-inicialmente-em-repouso-no-solo-decola-e-sobe-em-movimento-uniformemente-variado.html' }
  },
  {
    id: 'q_real_vunesp_2022_qui',
    topicId: 'qui_organica_reacoes',
    subject: 'Química',
    prompt: 'A etanolamina (NH2CH2CH2OH) é uma substância prebiótica detectada no espaço interestelar, que contém quatro dos seis elementos químicos essenciais à vida. Ela é parte constituinte dos fosfolipídios que compõem as membranas celulares e pode servir de precursora do aminoácido glicina. A transformação da molécula de etanolamina em glicina envolve uma reação de:',
    options: [
      { id: 'a', text: 'Oxidação' },
      { id: 'b', text: 'Isomerização' },
      { id: 'c', text: 'Esterificação' },
      { id: 'd', text: 'Redução' },
      { id: 'e', text: 'Adição' }
    ],
    correctOptionId: 'a',
    explanation: 'Na etanolamina, o carbono da hidroxila tem nox -1; na glicina, o carbono da carboxila tem nox +3. O aumento do número de oxidação do carbono caracteriza uma oxidação (conversão de álcool a ácido carboxílico) — não isomerização, esterificação, redução ou adição.',
    difficulty: 'medium',
    examSource: { board: 'VUNESP', year: 2022, sourceUrl: 'https://old.kuadro.com.br/gabarito/unesp/2022/quimica' }
  },
  {
    id: 'q_qui_organica_reacoes_1',
    topicId: 'qui_organica_reacoes',
    subject: 'Química',
    prompt: 'A produção industrial de perfumes e aromatizantes artificiais depende fortemente de uma classe de reações orgânicas que combina um ácido carboxílico com um álcool, liberando água como subproduto. Essa reação é chamada de:',
    options: [
      { id: 'a', text: 'Saponificação' },
      { id: 'b', text: 'Esterificação' },
      { id: 'c', text: 'Halogenação' },
      { id: 'd', text: 'Hidrogenação' }
    ],
    correctOptionId: 'b',
    explanation: 'A esterificação é a reação entre um ácido carboxílico e um álcool, formando um éster e água. Ésteres de cadeia curta têm odores característicos de frutas e flores, sendo a base de aromatizantes e perfumes artificiais.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_organica_reacoes_2',
    topicId: 'qui_organica_reacoes',
    subject: 'Química',
    prompt: 'Na adição de HBr ao propeno (CH3-CH=CH2), a Regra de Markovnikov prevê que o produto principal será aquele em que o hidrogênio se liga:',
    options: [
      { id: 'a', text: 'ao carbono com maior número de hidrogênios já ligados a ele' },
      { id: 'b', text: 'sempre ao carbono da extremidade da cadeia, independentemente da estrutura' },
      { id: 'c', text: 'ao carbono mais substituído da dupla ligação' },
      { id: 'd', text: 'igualmente aos dois carbonos da dupla, formando uma mistura 50/50' }
    ],
    correctOptionId: 'a',
    explanation: 'A Regra de Markovnikov afirma que, na adição de HX a um alceno assimétrico, o hidrogênio se liga ao carbono da dupla que já possui mais hidrogênios (menos substituído), e o halogênio ao carbono mais substituído — que estabiliza melhor o carbocátion intermediário.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_organica_reacoes_3',
    topicId: 'qui_organica_reacoes',
    subject: 'Química',
    prompt: 'A reação de um ácido graxo (ácido carboxílico de cadeia longa) com uma base forte, como o NaOH, produzindo um sal que atua como sabão, é conhecida como:',
    options: [
      { id: 'a', text: 'Esterificação' },
      { id: 'b', text: 'Saponificação' },
      { id: 'c', text: 'Craqueamento' },
      { id: 'd', text: 'Polimerização' }
    ],
    correctOptionId: 'b',
    explanation: 'A saponificação é a hidrólise básica de um éster (como um triglicerídeo) ou a reação direta de um ácido graxo com uma base forte, gerando o sal de ácido graxo (sabão) e glicerol ou água.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_organica_reacoes_4',
    topicId: 'qui_organica_reacoes',
    subject: 'Química',
    prompt: 'A desidratação intramolecular do etanol (CH3-CH2-OH), na presença de ácido sulfúrico concentrado e aquecimento acima de 170 °C, produz eteno e água. Essa transformação é classificada como uma reação de:',
    options: [
      { id: 'a', text: 'Adição' },
      { id: 'b', text: 'Substituição' },
      { id: 'c', text: 'Eliminação' },
      { id: 'd', text: 'Oxirredução' }
    ],
    correctOptionId: 'c',
    explanation: 'A desidratação intramolecular do etanol remove uma molécula de água da própria cadeia carbônica, formando uma dupla ligação (eteno). Reações que removem átomos ou grupos de uma molécula, formando uma insaturação ou ciclo, são classificadas como eliminação — o inverso de uma adição.',
    difficulty: 'medium'
  },
  {
    id: 'q_real_vunesp_2023_bio',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: '"Se a Amazônia é vista como o pulmão do mundo, podemos dizer que o Pantanal é o \'rim\' da porção da América do Sul", diz Cássio Bernardino, coordenador de Projetos do WWF-Brasil. Um professor solicitou aos alunos que analisassem a afirmação sobre a Amazônia e o Pantanal possuírem, respectivamente, funções análogas à função dos pulmões e à dos rins. É correto afirmar que:',
    options: [
      { id: 'a', text: 'ambas as analogias são adequadas, uma vez que nos pulmões ocorrem as mesmas trocas gasosas que as realizadas pelas plantas da floresta; e que no Pantanal, assim como nos rins, as substâncias tóxicas são diluídas em água e eliminadas no ambiente.' },
      { id: 'b', text: 'assim como os pulmões, as florestas liberam gás carbônico para o ambiente, mas não são as responsáveis por repor na atmosfera o oxigênio consumido no planeta; e que, assim como os rins, o Pantanal participa do controle do fluxo de água e da ciclagem de substâncias.' },
      { id: 'c', text: 'ambas as analogias são inadequadas, uma vez que as trocas gasosas na floresta ocorrem por difusão, enquanto que nos pulmões ocorrem por diferença de pressão; e que nos rins o controle do fluxo de água para o ambiente ocorre por reabsorção, enquanto que no Pantanal o volume de água é controlado pela evaporação.' },
      { id: 'd', text: 'a Amazônia é o pulmão do mundo, pois retira da atmosfera o gás carbônico, do qual usa o carbono para seu crescimento, e devolve o oxigênio da molécula para a atmosfera; e que o Pantanal pode ser comparado aos rins, uma vez que, assim como esse órgão, filtra a água circulante.' },
      { id: 'e', text: 'as florestas não podem ser comparadas aos pulmões, pois estes lançam na atmosfera gás carbônico e dela retiram oxigênio, sendo que as florestas fazem exatamente o contrário.' }
    ],
    correctOptionId: 'b',
    explanation: 'As plantas também respiram (consomem O2 e liberam CO2), então a analogia direta com pulmões não é exata quanto ao sentido das trocas gasosas líquidas. Já o Pantanal, como planície de inundação, regula o fluxo de água e a ciclagem de nutrientes na bacia — papel comparável, em termos funcionais, ao dos rins.',
    difficulty: 'hard',
    examSource: { board: 'VUNESP', year: 2023, sourceUrl: 'https://old.kuadro.com.br/gabarito/unesp/2023/biologia/unesp-1-fase-um-professor-de-biologia-apresentou-a/76824' }
  },
  {
    id: 'q_real_famerp_2018_fis',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Em um recipiente de capacidade térmica desprezível, 300 g de água, inicialmente a 20 ºC, foram aquecidos. Após 2,0 minutos, quando a temperatura da água era 40 ºC, mais 300 g de água a 20 ºC foram adicionados ao recipiente. Considerando que não ocorreu perda de calor da água para o meio e que a fonte fornece calor a uma potência constante durante o processo, o tempo decorrido, após a adição da água, para que a temperatura da água atingisse 80 ºC foi de:',
    options: [
      { id: 'a', text: '5,0 min.' },
      { id: 'b', text: '14,0 min.' },
      { id: 'c', text: '10,0 min.' },
      { id: 'd', text: '15,0 min.' },
      { id: 'e', text: '8,0 min.' }
    ],
    correctOptionId: 'c',
    explanation: 'Na 1ª etapa, 300 g de água aquecem de 20°C a 40°C (ΔT=20°C) em 2,0 min, logo a potência da fonte é P = (300×20)/2 = 3000 cal/min. Após misturar com mais 300 g a 20°C, a temperatura final da mistura (600 g) é 30°C. Para elevar 600 g de 30°C a 80°C (ΔT=50°C) são necessárias 600×50 = 30000 cal, o que leva 30000/3000 = 10,0 min.',
    difficulty: 'medium',
    examSource: { board: 'FAMERP', year: 2018, sourceUrl: 'https://www.indagacao.com.br/2020/10/famerp-2018-em-um-recipiente-de-capacidade-termica-desprezivel-300-g-de-agua-inicialmente-a-20-c-foram-aquecidos.html' }
  },
  {
    id: 'q_real_famerp_2019_qui',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'A combinação dos elementos Ca e Br forma uma substância solúvel em água, de fórmula ___________. Uma solução aquosa dessa substância é classificada como ___________ de eletricidade.',
    options: [
      { id: 'a', text: 'Ca₂Br – condutora' },
      { id: 'b', text: 'CaBr₂ – condutora' },
      { id: 'c', text: 'Ca₂Br – não condutora' },
      { id: 'd', text: 'CaBr₂ – não condutora' },
      { id: 'e', text: 'CaBr – condutora' }
    ],
    correctOptionId: 'b',
    explanation: 'O cálcio (grupo 2, 2 elétrons de valência) forma o cátion Ca²⁺ e o bromo (grupo 17, 7 elétrons de valência) forma o ânion Br⁻; a fórmula neutra correta é CaBr2. Por ser um composto iônico, ao dissolver-se em água ele se dissocia em íons livres, tornando a solução condutora de eletricidade.',
    difficulty: 'easy',
    examSource: { board: 'FAMERP', year: 2019, sourceUrl: 'https://www.indagacao.com.br/2019/01/famerp-2019-combinacao-dos-elementos-ca-e-br-forma-uma-substancia-soluvel-em-agua.html' }
  },
  // Biologia — Fisiologia Vegetal
  {
    id: 'q_bio_fisio_vegetal_1',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Qual estrutura é responsável por conduzir a seiva bruta (água e sais minerais) das raízes até as folhas em uma planta vascular?',
    options: [
      { id: 'a', text: 'Floema' },
      { id: 'b', text: 'Xilema' },
      { id: 'c', text: 'Câmbio' },
      { id: 'd', text: 'Epiderme' }
    ],
    correctOptionId: 'b',
    explanation: 'O xilema (ou lenho) é o tecido condutor responsável pelo transporte ascendente da seiva bruta, impulsionado principalmente pela transpiração nas folhas (teoria da tensão-coesão-adesão). O floema, por sua vez, conduz a seiva elaborada (açúcares) produzida na fotossíntese.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_vegetal_2',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'O fototropismo positivo do caule em direção à luz é explicado pela ação de qual hormônio vegetal, que se acumula no lado sombreado e estimula o alongamento celular desse lado?',
    options: [
      { id: 'a', text: 'Etileno' },
      { id: 'b', text: 'Ácido abscísico' },
      { id: 'c', text: 'Auxina' },
      { id: 'd', text: 'Citocinina' }
    ],
    correctOptionId: 'c',
    explanation: 'A auxina migra para o lado menos iluminado do caule e estimula o alongamento das células nesse lado, curvando o caule em direção à luz. É a base do modelo clássico de Cholodny-Went para o fototropismo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_vegetal_3',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'A transpiração, perda de água na forma de vapor pelos estômatos das folhas, é fundamental para a subida da seiva bruta pelo xilema principalmente porque:',
    options: [
      { id: 'a', text: 'Cria uma pressão positiva na raiz que empurra a água para cima' },
      { id: 'b', text: 'Gera uma tensão (pressão negativa) nas folhas que "puxa" a coluna contínua de água pelo xilema, aproveitando a coesão entre as moléculas de água' },
      { id: 'c', text: 'Aquece a água, fazendo-a subir por convecção' },
      { id: 'd', text: 'Não tem qualquer relação com o transporte de água na planta' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela teoria da tensão-coesão-adesão, a evaporação de água nos estômatos gera uma tensão (pressão negativa) que se propaga por toda a coluna de água no xilema, "puxando-a" para cima. Isso só é possível porque as moléculas de água se mantêm coesas entre si (pontes de hidrogênio) e aderem às paredes dos vasos do xilema, formando uma coluna contínua capaz de suportar essa tensão sem se romper.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_4',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Os estômatos, poros presentes principalmente na epiderme das folhas, regulam a troca gasosa e a perda de água da planta. Sua abertura e fechamento são controlados principalmente por:',
    options: [
      { id: 'a', text: 'Mudanças na turgescência das células-guarda que os delimitam' },
      { id: 'b', text: 'Contração muscular, semelhante à de animais' },
      { id: 'c', text: 'Um processo puramente passivo, sem qualquer regulação celular' },
      { id: 'd', text: 'A temperatura do solo, exclusivamente' }
    ],
    correctOptionId: 'a',
    explanation: 'Os estômatos são delimitados por um par de células-guarda, cuja forma muda de acordo com sua turgescência (quantidade de água interna): quando túrgidas (cheias de água), essas células se curvam e abrem o poro estomático; quando perdem turgescência (flácidas), o poro se fecha. Esse mecanismo permite à planta regular a troca gasosa e a perda de água conforme as condições ambientais.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_vegetal_5',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'O hormônio vegetal etileno, ao contrário da maioria dos outros hormônios vegetais (geralmente líquidos ou sólidos), é notável por ser um gás. Sua principal função conhecida é:',
    options: [
      { id: 'a', text: 'Estimular o alongamento celular em direção à luz' },
      { id: 'b', text: 'Promover o amadurecimento de frutos' },
      { id: 'c', text: 'Inibir totalmente a germinação de sementes, em qualquer condição' },
      { id: 'd', text: 'Regular exclusivamente a abertura dos estômatos' }
    ],
    correctOptionId: 'b',
    explanation: 'O etileno é um hormônio vegetal gasoso, conhecido principalmente por promover o amadurecimento de frutos (mudança de cor, amolecimento, produção de aromas) — por isso frutos verdes são frequentemente armazenados junto de frutos maduros (que liberam etileno) para acelerar seu próprio amadurecimento.',
    difficulty: 'medium'
  },
  // Física — Dinâmica Impulsiva
  {
    id: 'q_fis_dinamica_impulsiva_1',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Qual é o impulso de uma força constante de 20 N aplicada durante 3 segundos sobre um corpo?',
    options: [
      { id: 'a', text: '6,7 N·s' },
      { id: 'b', text: '23 N·s' },
      { id: 'c', text: '60 N·s' },
      { id: 'd', text: '600 N·s' }
    ],
    correctOptionId: 'c',
    explanation: 'I = F×t = 20×3 = 60 N·s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_dinamica_impulsiva_2',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Um corpo de massa 4 kg está em repouso e recebe um impulso de 20 N·s. Qual é a velocidade final desse corpo?',
    options: [
      { id: 'a', text: '1,25 m/s' },
      { id: 'b', text: '4 m/s' },
      { id: 'c', text: '5 m/s' },
      { id: 'd', text: '80 m/s' }
    ],
    correctOptionId: 'c',
    explanation: 'O impulso é igual à variação da quantidade de movimento: I = Δp = m×Δv → Δv = I/m = 20/4 = 5 m/s.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_dinamica_impulsiva_3',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Duas esferas de massas iguais colidem frontalmente e permanecem grudadas após a colisão (colisão perfeitamente inelástica). A esfera A tinha velocidade de 6 m/s e a esfera B estava parada. Qual é a velocidade do conjunto após a colisão?',
    options: [
      { id: 'a', text: '2 m/s' },
      { id: 'b', text: '3 m/s' },
      { id: 'c', text: '6 m/s' },
      { id: 'd', text: '12 m/s' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela conservação da quantidade de movimento: m×6 + m×0 = 2m×v → v = 3 m/s.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_dinamica_impulsiva_4',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Em uma colisão perfeitamente elástica entre dois corpos, o que se conserva, além da quantidade de movimento?',
    options: [
      { id: 'a', text: 'A energia cinética total' },
      { id: 'b', text: 'Apenas a quantidade de movimento — nada mais se conserva' },
      { id: 'c', text: 'A velocidade de cada corpo individualmente' },
      { id: 'd', text: 'A energia térmica gerada pelo impacto' }
    ],
    correctOptionId: 'a',
    explanation: 'A característica que define uma colisão como perfeitamente elástica é justamente a conservação da energia cinética total do sistema, além da quantidade de movimento (que se conserva em qualquer colisão).',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_dinamica_impulsiva_5',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Uma bola de massa 0,5 kg é arremessada contra uma parede com velocidade de 8 m/s e quica de volta com velocidade de 6 m/s (sentido oposto). Qual é o módulo do impulso exercido pela parede sobre a bola?',
    options: [
      { id: 'a', text: '1 N·s' },
      { id: 'b', text: '3,5 N·s' },
      { id: 'c', text: '7 N·s' },
      { id: 'd', text: '14 N·s' }
    ],
    correctOptionId: 'c',
    explanation: 'Tomando o sentido inicial como positivo: p_inicial = 0,5×8 = 4 kg·m/s; p_final = 0,5×(-6) = -3 kg·m/s. O impulso é a variação: |Δp| = |-3-4| = 7 N·s.',
    difficulty: 'hard'
  },
  // Física — Estática dos Corpos Sólidos e dos Fluidos
  {
    id: 'q_fis_estatica_1',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Uma barra horizontal rígida está em equilíbrio, apoiada em um único ponto, com um peso de 100 N pendurado a 2 m do apoio, de um lado. Qual peso deve ser pendurado a 4 m do apoio, do outro lado, para manter o equilíbrio?',
    options: [
      { id: 'a', text: '25 N' },
      { id: 'b', text: '50 N' },
      { id: 'c', text: '100 N' },
      { id: 'd', text: '200 N' }
    ],
    correctOptionId: 'b',
    explanation: 'Para o equilíbrio de rotação, os torques dos dois lados devem se igualar: 100×2 = P×4 → P = 50 N.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_estatica_2',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Um objeto totalmente submerso em água tem peso aparente (peso medido dentro da água) menor que seu peso real fora da água. Isso ocorre devido a qual força?',
    options: [
      { id: 'a', text: 'Força de atrito' },
      { id: 'b', text: 'Força de empuxo' },
      { id: 'c', text: 'Força elástica' },
      { id: 'd', text: 'Força centrípeta' }
    ],
    correctOptionId: 'b',
    explanation: 'O empuxo, previsto pelo Princípio de Arquimedes, é uma força vertical para cima exercida pelo fluido sobre qualquer corpo nele submerso, reduzindo o peso aparente medido.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_estatica_3',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Um bloco de volume 0,002 m³ está totalmente submerso em água (densidade 1000 kg/m³). Usando g = 10 m/s², qual é o módulo do empuxo sobre esse bloco?',
    options: [
      { id: 'a', text: '2 N' },
      { id: 'b', text: '10 N' },
      { id: 'c', text: '20 N' },
      { id: 'd', text: '200 N' }
    ],
    correctOptionId: 'c',
    explanation: 'E = densidade_fluido × V × g = 1000 × 0,002 × 10 = 20 N.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_estatica_4',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Para que um corpo rígido esteja em equilíbrio estático completo, quais duas condições precisam ser satisfeitas simultaneamente?',
    options: [
      { id: 'a', text: 'Resultante das forças nula e resultante dos torques nula' },
      { id: 'b', text: 'Apenas resultante das forças nula' },
      { id: 'c', text: 'Apenas resultante dos torques nula' },
      { id: 'd', text: 'Massa nula' }
    ],
    correctOptionId: 'a',
    explanation: 'O equilíbrio estático exige tanto o equilíbrio de translação (resultante das forças = 0) quanto o equilíbrio de rotação (resultante dos torques = 0) — um corpo pode ter forças equilibradas e ainda assim girar, se os torques não estiverem equilibrados.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_estatica_5',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Um objeto flutua parcialmente submerso em um líquido, em equilíbrio. O que podemos concluir sobre a relação entre o peso do objeto e o empuxo que ele recebe?',
    options: [
      { id: 'a', text: 'O empuxo é maior que o peso' },
      { id: 'b', text: 'O empuxo é igual ao peso' },
      { id: 'c', text: 'O empuxo é menor que o peso' },
      { id: 'd', text: 'Não há relação necessária entre eles' }
    ],
    correctOptionId: 'b',
    explanation: 'Para um corpo flutuando em equilíbrio (sem afundar nem subir), a força de empuxo deve equilibrar exatamente o peso do corpo — por isso os dois têm o mesmo módulo.',
    difficulty: 'hard'
  },
  // Física — Eletromagnetismo
  {
    id: 'q_fis_eletromagnetismo_1',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Uma carga elétrica em movimento dentro de um campo magnético uniforme, com velocidade paralela às linhas de campo magnético, sofre qual força magnética?',
    options: [
      { id: 'a', text: 'Máxima' },
      { id: 'b', text: 'Nula' },
      { id: 'c', text: 'Perpendicular à velocidade' },
      { id: 'd', text: 'Igual ao peso da carga' }
    ],
    correctOptionId: 'b',
    explanation: 'A força magnética é F = q·v·B·sen(θ), onde θ é o ângulo entre v e B. Quando v é paralela a B, θ=0° e sen(0°)=0, tornando a força nula.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletromagnetismo_2',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Um fio retilíneo percorrido por uma corrente elétrica de 5 A está imerso em um campo magnético uniforme de 0,2 T, perpendicular ao fio, ao longo de um comprimento de 0,5 m. Qual é o módulo da força magnética sobre o fio?',
    options: [
      { id: 'a', text: '0,05 N' },
      { id: 'b', text: '0,5 N' },
      { id: 'c', text: '1 N' },
      { id: 'd', text: '5 N' }
    ],
    correctOptionId: 'b',
    explanation: 'F = B×I×L = 0,2×5×0,5 = 0,5 N.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_eletromagnetismo_3',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Ao aproximar um ímã de uma espira condutora fechada, surge uma corrente induzida na espira. De acordo com a Lei de Lenz, o sentido dessa corrente induzida é tal que:',
    options: [
      { id: 'a', text: 'Favorece o aumento do fluxo magnético que a gerou' },
      { id: 'b', text: 'Se opõe à variação do fluxo magnético que a gerou' },
      { id: 'c', text: 'É sempre no mesmo sentido, independente do movimento do ímã' },
      { id: 'd', text: 'Não tem sentido definido' }
    ],
    correctOptionId: 'b',
    explanation: 'A Lei de Lenz estabelece que a corrente induzida sempre flui em um sentido que se opõe à variação do fluxo magnético que a gerou — uma consequência direta da conservação de energia.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletromagnetismo_4',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'O que é necessário para que uma corrente elétrica seja induzida em uma espira condutora, segundo a Lei de Faraday?',
    options: [
      { id: 'a', text: 'A espira precisa estar em um campo magnético constante e parada' },
      { id: 'b', text: 'Precisa haver variação do fluxo magnético através da espira' },
      { id: 'c', text: 'A espira precisa ser feita de um material isolante' },
      { id: 'd', text: 'Não é necessário nenhum campo magnético' }
    ],
    correctOptionId: 'b',
    explanation: 'A Lei de Faraday afirma que a força eletromotriz induzida é proporcional à taxa de variação do fluxo magnético — sem variação de fluxo (mesmo com campo presente), não há indução.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletromagnetismo_5',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Um próton se move com velocidade perpendicular a um campo magnético uniforme. Qual é a direção da força magnética resultante sobre o próton, em relação à sua velocidade?',
    options: [
      { id: 'a', text: 'Paralela à velocidade' },
      { id: 'b', text: 'Perpendicular tanto à velocidade quanto ao campo magnético' },
      { id: 'c', text: 'Igual à direção do campo magnético' },
      { id: 'd', text: 'Nula' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela regra da mão direita (F = qv×B), a força magnética é sempre perpendicular tanto ao vetor velocidade quanto ao vetor campo magnético — é essa força que causa o movimento circular de cargas em campos magnéticos.',
    difficulty: 'hard'
  },
  // Português — Redação
  {
    id: 'q_por_redacao_1',
    topicId: 'por_red_argumentacao',
    subject: 'Português',
    prompt: 'Em uma redação dissertativo-argumentativa, o uso de um dado estatístico de uma fonte confiável (como IBGE ou OMS) logo na introdução tem principalmente a função de:',
    options: [
      { id: 'a', text: 'Substituir a necessidade de uma tese' },
      { id: 'b', text: 'Contextualizar e legitimar o problema abordado, sustentando a argumentação com repertório sociocultural' },
      { id: 'c', text: 'Encerrar a discussão sobre o tema logo no início' },
      { id: 'd', text: 'Preencher espaço quando faltam argumentos próprios' }
    ],
    correctOptionId: 'b',
    explanation: 'Um repertório sociocultural produtivo — como um dado estatístico pertinente — contextualiza o problema e fortalece a argumentação ao ancorá-la em uma fonte externa confiável, mas deve estar articulado ao argumento, não apenas citado.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_redacao_2',
    topicId: 'por_red_estrutura_coesao',
    subject: 'Português',
    prompt: 'Qual das alternativas abaixo caracteriza uma proposta de intervenção completa e bem estruturada, nos moldes cobrados pelo ENEM e por vestibulares que adotam critério semelhante?',
    options: [
      { id: 'a', text: 'Uma sugestão genérica, como "a sociedade deveria mudar", sem detalhamento' },
      { id: 'b', text: 'Uma ação com agente definido, meio de execução, finalidade e, quando possível, detalhamento — conectada aos argumentos desenvolvidos no texto' },
      { id: 'c', text: 'A repetição da tese apresentada na introdução' },
      { id: 'd', text: 'Uma crítica ao governo sem propor nenhuma ação concreta' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma proposta de intervenção bem avaliada precisa explicitar quem deve agir (agente), como (meio/modo), com que objetivo (finalidade) e, idealmente, detalhar a ação — sempre coerente com os argumentos já desenvolvidos no texto, não uma ideia solta ao final.',
    difficulty: 'medium'
  },
  // Matemática — Aritmética e Proporcionalidade
  {
    id: 'q_mat_aritmetica_proporcionalidade_1',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Uma torneira enche sozinha um tanque em 6 horas, e outra torneira, sozinha, enche o mesmo tanque em 3 horas. Abrindo as duas torneiras juntas, em quanto tempo o tanque será cheio?',
    options: [
      { id: 'a', text: '2 horas' },
      { id: 'b', text: '4,5 horas' },
      { id: 'c', text: '1,5 hora' },
      { id: 'd', text: '9 horas' }
    ],
    correctOptionId: 'a',
    explanation: 'As vazões (taxas de enchimento) se somam: 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 do tanque por hora. Para encher o tanque inteiro, o tempo é o inverso: 2 horas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_2',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Uma equipe de 8 trabalhadores constrói um muro em 12 dias, todos no mesmo ritmo. Se 2 trabalhadores saírem da equipe, em quantos dias os 6 restantes terminariam o mesmo muro?',
    options: [
      { id: 'a', text: '9 dias' },
      { id: 'b', text: '10 dias' },
      { id: 'c', text: '14 dias' },
      { id: 'd', text: '16 dias' }
    ],
    correctOptionId: 'd',
    explanation: 'Número de trabalhadores e dias são inversamente proporcionais (menos gente demora mais). O produto se mantém constante: 8 × 12 = 6 × x → x = 96/6 = 16 dias.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_3',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Um investimento rende 10% de juros no primeiro ano e, sobre o novo montante, mais 10% no segundo ano. Qual é o rendimento percentual total acumulado nos dois anos, em relação ao valor inicial?',
    options: [
      { id: 'a', text: '20%' },
      { id: 'b', text: '21%' },
      { id: 'c', text: '22%' },
      { id: 'd', text: '19%' }
    ],
    correctOptionId: 'b',
    explanation: 'Juros compostos não se somam diretamente: partindo de 100, após o primeiro ano fica 110, e após o segundo, 110 × 1,10 = 121. O rendimento total é 21%, não 20%.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_4',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Uma máquina produz 150 peças em 5 horas, funcionando em ritmo constante. Mantendo o mesmo ritmo, quantas peças ela produzirá em 8 horas?',
    options: [
      { id: 'a', text: '210' },
      { id: 'b', text: '225' },
      { id: 'c', text: '240' },
      { id: 'd', text: '270' }
    ],
    correctOptionId: 'c',
    explanation: 'A taxa de produção é 150/5 = 30 peças por hora (grandezas diretamente proporcionais). Em 8 horas: 30 × 8 = 240 peças.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_5',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Uma herança de R$ 90.000,00 deve ser dividida entre três herdeiros na proporção direta de 2:3:4. Quanto receberá o herdeiro com a maior parte?',
    options: [
      { id: 'a', text: 'R$ 30.000,00' },
      { id: 'b', text: 'R$ 36.000,00' },
      { id: 'c', text: 'R$ 40.000,00' },
      { id: 'd', text: 'R$ 45.000,00' }
    ],
    correctOptionId: 'c',
    explanation: 'A soma das partes é 2+3+4 = 9. Cada parte vale 90.000/9 = 10.000. O herdeiro com a maior proporção (4 partes) recebe 4 × 10.000 = 40.000.',
    difficulty: 'hard'
  },
  // Matemática — Teoria dos Números Inteiros
  {
    id: 'q_mat_teoria_numeros_1',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Um número inteiro positivo, quando dividido por 7, deixa resto 3; e quando dividido por 5, deixa resto 2. Qual das alternativas apresenta um valor possível para esse número?',
    options: [
      { id: 'a', text: '17' },
      { id: 'b', text: '21' },
      { id: 'c', text: '33' },
      { id: 'd', text: '45' }
    ],
    correctOptionId: 'a',
    explanation: '17 ÷ 7 = 2 resto 3, e 17 ÷ 5 = 3 resto 2 — as duas condições valem. Os demais falham em pelo menos uma delas (por exemplo, 45 ÷ 7 dá resto 3, mas 45 ÷ 5 dá resto 0).',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_teoria_numeros_2',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Qual é o menor número natural maior que 10 que, ao ser dividido por 4, 6 e 9, deixa sempre resto 1?',
    options: [
      { id: 'a', text: '36' },
      { id: 'b', text: '37' },
      { id: 'c', text: '72' },
      { id: 'd', text: '73' }
    ],
    correctOptionId: 'b',
    explanation: 'O número procurado é MMC(4,6,9) + 1. Como MMC(4,6,9) = 36, o menor valor maior que 10 é 36 + 1 = 37.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_teoria_numeros_3',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'O número 2¹⁰ - 1 (ou seja, 1023) é divisível por qual dos números abaixo?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '11' },
      { id: 'c', text: '13' },
      { id: 'd', text: '17' }
    ],
    correctOptionId: 'b',
    explanation: 'Fatorando, 1023 = 3 × 11 × 31. Logo, 1023 é divisível por 11 (1023/11 = 93), mas não por 7, 13 ou 17.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_teoria_numeros_4',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Quantos números inteiros entre 1 e 100 são múltiplos de 3 ou de 5?',
    options: [
      { id: 'a', text: '40' },
      { id: 'b', text: '44' },
      { id: 'c', text: '47' },
      { id: 'd', text: '53' }
    ],
    correctOptionId: 'c',
    explanation: 'Pelo princípio da inclusão-exclusão: múltiplos de 3 são 33, múltiplos de 5 são 20, e múltiplos de ambos (de 15) são 6. Total: 33 + 20 - 6 = 47.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_teoria_numeros_5',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Qual é o número de divisores positivos de 360?',
    options: [
      { id: 'a', text: '16' },
      { id: 'b', text: '20' },
      { id: 'c', text: '24' },
      { id: 'd', text: '30' }
    ],
    correctOptionId: 'c',
    explanation: '360 = 2³ × 3² × 5¹. O número de divisores é (3+1)×(2+1)×(1+1) = 4×3×2 = 24.',
    difficulty: 'hard'
  },
  // Matemática — Sequências, Matrizes e Sistemas Lineares
  {
    id: 'q_mat_sequencias_matrizes_1',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Em uma progressão aritmética, o quinto termo é 17 e o décimo termo é 37. Qual é a razão dessa progressão?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '8' }
    ],
    correctOptionId: 'b',
    explanation: 'Entre o 5º e o 10º termo há 5 intervalos de razão: a₁₀ - a₅ = 5r → 37 - 17 = 5r → r = 4.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_2',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Em uma progressão geométrica de razão 3, o terceiro termo vale 45. Qual é o primeiro termo dessa progressão?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '5' },
      { id: 'c', text: '15' },
      { id: 'd', text: '135' }
    ],
    correctOptionId: 'b',
    explanation: 'a₃ = a₁ × r² → 45 = a₁ × 9 → a₁ = 5.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_3',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Qual é a soma dos 20 primeiros termos da progressão aritmética (3, 7, 11, 15, ...)?',
    options: [
      { id: 'a', text: '780' },
      { id: 'b', text: '800' },
      { id: 'c', text: '820' },
      { id: 'd', text: '840' }
    ],
    correctOptionId: 'c',
    explanation: 'a₁ = 3, r = 4, então a₂₀ = 3 + 19×4 = 79. A soma é Sₙ = n(a₁+aₙ)/2 = 20×(3+79)/2 = 20×41 = 820.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_sequencias_matrizes_4',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Resolvendo o sistema linear {2x + y = 8; x - y = 1} pela regra de Cramer, qual é o determinante da matriz dos coeficientes?',
    options: [
      { id: 'a', text: '-3' },
      { id: 'b', text: '-1' },
      { id: 'c', text: '1' },
      { id: 'd', text: '3' }
    ],
    correctOptionId: 'a',
    explanation: 'A matriz dos coeficientes é [[2,1],[1,-1]]. O determinante é 2×(-1) - 1×1 = -2 - 1 = -3.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_sequencias_matrizes_5',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Qual é a soma dos infinitos termos da progressão geométrica infinita (1, 1/2, 1/4, 1/8, ...)?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '1,5' },
      { id: 'c', text: '2' },
      { id: 'd', text: 'Infinito (a soma diverge)' }
    ],
    correctOptionId: 'c',
    explanation: 'Como |r| < 1 (r = 1/2), a soma converge: S = a₁/(1-r) = 1/(1-0,5) = 2.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Espacial
  {
    id: 'q_mat_geometria_espacial_1',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um cilindro reto tem volume de 500π cm³ e altura de 5 cm. Qual é o raio da base desse cilindro?',
    options: [
      { id: 'a', text: '5 cm' },
      { id: 'b', text: '10 cm' },
      { id: 'c', text: '25 cm' },
      { id: 'd', text: '50 cm' }
    ],
    correctOptionId: 'b',
    explanation: 'V = π×r²×h → 500π = π×r²×5 → r² = 100 → r = 10 cm.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_2',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um cone e um cilindro têm a mesma base (mesmo raio) e a mesma altura. Qual é a razão entre o volume do cone e o volume do cilindro?',
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/3' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '2/3' }
    ],
    correctOptionId: 'b',
    explanation: 'V(cone) = (1/3)πr²h e V(cilindro) = πr²h, com o mesmo r e h. A razão entre eles é sempre 1/3, independentemente das dimensões.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_3',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Uma caixa em forma de paralelepípedo retângulo tem dimensões 4 cm × 5 cm × 6 cm. Qual é a área total (soma de todas as faces) dessa caixa?',
    options: [
      { id: 'a', text: '74 cm²' },
      { id: 'b', text: '120 cm²' },
      { id: 'c', text: '148 cm²' },
      { id: 'd', text: '158 cm²' }
    ],
    correctOptionId: 'c',
    explanation: 'A área total é 2×(ab + ac + bc) = 2×(4×5 + 4×6 + 5×6) = 2×(20+24+30) = 2×74 = 148 cm².',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_4',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Qual é o volume aproximado de uma esfera de raio 3 cm? (use π ≈ 3,14)',
    options: [
      { id: 'a', text: '37,68 cm³' },
      { id: 'b', text: '94,2 cm³' },
      { id: 'c', text: '113,04 cm³' },
      { id: 'd', text: '339,12 cm³' }
    ],
    correctOptionId: 'c',
    explanation: 'V = (4/3)×π×r³ = (4/3)×3,14×27 = 339,12/3 = 113,04 cm³.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_5',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Uma pirâmide é seccionada por um plano paralelo à base, exatamente na metade de sua altura. Qual é a razão entre o volume da pirâmide menor (o topo, semelhante à original) e o volume da pirâmide original?',
    options: [
      { id: 'a', text: '1/2' },
      { id: 'b', text: '1/4' },
      { id: 'c', text: '1/8' },
      { id: 'd', text: '1/16' }
    ],
    correctOptionId: 'c',
    explanation: 'Em sólidos semelhantes, o volume escala com o cubo da razão de semelhança linear. Como a razão linear é 1/2, a razão de volumes é (1/2)³ = 1/8.',
    difficulty: 'hard'
  },
  // Matemática — Geometria Analítica
  {
    id: 'q_mat_geometria_analitica_1',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a equação da reta que passa pelos pontos A(0, 3) e B(2, 7)?',
    options: [
      { id: 'a', text: 'y = 2x + 3' },
      { id: 'b', text: 'y = 2x - 3' },
      { id: 'c', text: 'y = 3x + 2' },
      { id: 'd', text: 'y = 4x + 3' }
    ],
    correctOptionId: 'a',
    explanation: 'O coeficiente angular é (7-3)/(2-0) = 2. Como a reta passa por (0,3), o coeficiente linear é 3. A equação é y = 2x + 3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_2',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a distância do ponto (3, 4) à reta de equação 3x + 4y - 10 = 0?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5' }
    ],
    correctOptionId: 'c',
    explanation: 'd = |3×3 + 4×4 - 10|/√(3²+4²) = |9+16-10|/5 = 15/5 = 3.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_analitica_3',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é o raio da circunferência de equação x² + y² - 6x + 4y - 3 = 0?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '16' }
    ],
    correctOptionId: 'b',
    explanation: 'Completando quadrados: (x-3)² - 9 + (y+2)² - 4 - 3 = 0 → (x-3)² + (y+2)² = 16. Logo r² = 16, r = 4.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_analitica_4',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'As retas r: y = 3x + 1 e s: y = mx - 2 são perpendiculares entre si. Qual é o valor de m?',
    options: [
      { id: 'a', text: '-3' },
      { id: 'b', text: '-1/3' },
      { id: 'c', text: '1/3' },
      { id: 'd', text: '3' }
    ],
    correctOptionId: 'b',
    explanation: 'Retas perpendiculares têm coeficientes angulares cujo produto é -1: 3×m = -1 → m = -1/3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_5',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a área do triângulo cujos vértices são A(0,0), B(4,0) e C(0,3)?',
    options: [
      { id: 'a', text: '3,5' },
      { id: 'b', text: '6' },
      { id: 'c', text: '7' },
      { id: 'd', text: '12' }
    ],
    correctOptionId: 'b',
    explanation: 'O lado AB está sobre o eixo x (comprimento 4) e a altura até C é 3 (distância de C ao eixo x). Área = (base × altura)/2 = (4×3)/2 = 6.',
    difficulty: 'medium'
  },
  // Matemática — Equações, Desigualdades e Modelagem Algébrica
  {
    id: 'q_mat_equacoes_1',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'A soma de dois números é 20, e o produto entre eles é 96. Quais são esses dois números?',
    options: [
      { id: 'a', text: '10 e 10' },
      { id: 'b', text: '12 e 8' },
      { id: 'c', text: '15 e 5' },
      { id: 'd', text: '16 e 4' }
    ],
    correctOptionId: 'b',
    explanation: 'Chamando os números de x e 20-x: x(20-x) = 96 → x² - 20x + 96 = 0. O discriminante é 400-384=16, e as raízes são (20±4)/2 = 12 ou 8.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_2',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Para quais valores de x a inequação x² - 5x + 6 ≤ 0 é satisfeita?',
    options: [
      { id: 'a', text: 'x ≤ 2 ou x ≥ 3' },
      { id: 'b', text: '2 ≤ x ≤ 3' },
      { id: 'c', text: 'x < 2' },
      { id: 'd', text: 'x > 3' }
    ],
    correctOptionId: 'b',
    explanation: 'As raízes de x² - 5x + 6 são 2 e 3. Como a parábola tem concavidade para cima, ela é negativa ou nula (≤0) apenas entre as raízes: 2 ≤ x ≤ 3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_3',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'O lucro mensal de uma empresa, em milhares de reais, é dado por L(x) = -2x² + 40x - 150, onde x é a quantidade (em centenas) de produtos vendidos. Para qual quantidade x o lucro é máximo?',
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '10' },
      { id: 'c', text: '15' },
      { id: 'd', text: '20' }
    ],
    correctOptionId: 'b',
    explanation: 'O máximo de uma função quadrática com concavidade para baixo ocorre no vértice: x = -b/2a = -40/(2×(-2)) = 10.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_equacoes_4',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Para quais valores reais de x a expressão (x-1)(x+3) é negativa?',
    options: [
      { id: 'a', text: 'x < -3' },
      { id: 'b', text: '-3 < x < 1' },
      { id: 'c', text: 'x > 1' },
      { id: 'd', text: 'x < -3 ou x > 1' }
    ],
    correctOptionId: 'b',
    explanation: 'As raízes são -3 e 1. Como o coeficiente de x² é positivo (concavidade para cima), a expressão é negativa apenas entre as raízes: -3 < x < 1.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_5',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Resolvendo a equação irracional √(x+3) = x - 3, para x real (lembrando de verificar as soluções na equação original), qual é o valor válido de x?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '6' },
      { id: 'c', text: '1 e 6' },
      { id: 'd', text: 'Nenhuma solução real' }
    ],
    correctOptionId: 'b',
    explanation: 'Elevando ao quadrado: x+3 = (x-3)² → x² - 7x + 6 = 0 → x = 1 ou x = 6. Mas o lado direito (x-3) precisa ser ≥ 0, ou seja, x ≥ 3. Isso elimina x=1; apenas x=6 é válido (verificação: √9 = 3 = 6-3 ✓).',
    difficulty: 'hard'
  },
  // Matemática — Logaritmos e Exponenciais
  {
    id: 'q_mat_log_exponenciais_1',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Sabendo que log(2) ≈ 0,30 e log(3) ≈ 0,48, qual é o valor aproximado de log(6)?',
    options: [
      { id: 'a', text: '0,18' },
      { id: 'b', text: '0,60' },
      { id: 'c', text: '0,78' },
      { id: 'd', text: '1,44' }
    ],
    correctOptionId: 'c',
    explanation: 'Como 6 = 2×3, log(6) = log(2) + log(3) = 0,30 + 0,48 = 0,78.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_2',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Resolva a equação 2^(x+1) = 32. Qual é o valor de x?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '16' }
    ],
    correctOptionId: 'b',
    explanation: 'Como 32 = 2⁵, temos x+1 = 5, logo x = 4.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_3',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Resolva a equação log₂(x) + log₂(x - 2) = 3, para x real (lembre de verificar o domínio).',
    options: [
      { id: 'a', text: '-2' },
      { id: 'b', text: '4' },
      { id: 'c', text: '-2 e 4' },
      { id: 'd', text: '8' }
    ],
    correctOptionId: 'b',
    explanation: 'Usando log(a)+log(b)=log(ab): log₂[x(x-2)] = 3 → x(x-2) = 8 → x²-2x-8=0 → x=4 ou x=-2. Como o domínio exige x>0 e x-2>0 (ou seja, x>2), apenas x=4 é válido.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_log_exponenciais_4',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Uma cultura de bactérias tem crescimento dado por P(t) = P₀ × 3ᵗ, sendo t em horas. Após quantas horas a população será 81 vezes o valor inicial?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '9' },
      { id: 'd', text: '27' }
    ],
    correctOptionId: 'b',
    explanation: 'Precisamos de 3ᵗ = 81 = 3⁴, logo t = 4 horas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_5',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Qual é o valor de log₄(8)?',
    options: [
      { id: 'a', text: '1/2' },
      { id: 'b', text: '2/3' },
      { id: 'c', text: '3/2' },
      { id: 'd', text: '2' }
    ],
    correctOptionId: 'c',
    explanation: 'Usando mudança de base: log₄(8) = log₂(8)/log₂(4) = 3/2.',
    difficulty: 'hard'
  },
  // Matemática — Números Complexos e Polinômios
  {
    id: 'q_mat_complexos_polinomios_1',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Qual é o resultado de (2 + 3i) × (1 - 2i)?',
    options: [
      { id: 'a', text: '8 - i' },
      { id: 'b', text: '2 - i' },
      { id: 'c', text: '-4 + 7i' },
      { id: 'd', text: '8 + i' }
    ],
    correctOptionId: 'a',
    explanation: '(2+3i)(1-2i) = 2 - 4i + 3i - 6i² = 2 - i - 6(-1) = 2 - i + 6 = 8 - i.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_complexos_polinomios_2',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Qual é o módulo do número complexo z = 3 + 4i?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '7' }
    ],
    correctOptionId: 'c',
    explanation: '|z| = √(3² + 4²) = √25 = 5.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_complexos_polinomios_3',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Sabendo que 2 é uma raiz do polinômio P(x) = x³ - 4x² + x + 6, quais são as outras duas raízes?',
    options: [
      { id: 'a', text: '1 e 3' },
      { id: 'b', text: '-1 e 3' },
      { id: 'c', text: '-3 e 1' },
      { id: 'd', text: '-2 e 3' }
    ],
    correctOptionId: 'b',
    explanation: 'Dividindo P(x) por (x-2), obtemos o quociente x² - 2x - 3 = (x-3)(x+1). As outras raízes são 3 e -1.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_complexos_polinomios_4',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Qual é o valor de i²³ (sendo i a unidade imaginária)?',
    options: [
      { id: 'a', text: 'i' },
      { id: 'b', text: '-i' },
      { id: 'c', text: '1' },
      { id: 'd', text: '-1' }
    ],
    correctOptionId: 'b',
    explanation: 'As potências de i se repetem em ciclos de 4. Como 23 = 4×5 + 3, i²³ = i³ = -i.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_complexos_polinomios_5',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Um polinômio de grau 4 com coeficientes reais tem exatamente uma raiz real, x = 5, com multiplicidade 2. Quantas raízes complexas não reais (contando multiplicidade) esse polinômio deve ter?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1' },
      { id: 'c', text: '2' },
      { id: 'd', text: '4' }
    ],
    correctOptionId: 'c',
    explanation: 'Um polinômio de grau 4 tem 4 raízes ao todo (Teorema Fundamental da Álgebra). Se 2 delas são reais (5, com multiplicidade 2), as outras 2 devem ser complexas não reais — e, como os coeficientes são reais, elas formam um par conjugado.',
    difficulty: 'hard'
  },
  // Geografia — Cartografia e Fundamentos
  {
    id: 'q_geo_cartografia_1',
    topicId: 'geo_cartografia',
    subject: 'Geografia',
    prompt: 'Um mapa está na escala 1:50.000. Uma distância de 4 cm no mapa corresponde, na realidade, a quantos quilômetros?',
    options: [
      { id: 'a', text: '0,2 km' },
      { id: 'b', text: '2 km' },
      { id: 'c', text: '20 km' },
      { id: 'd', text: '200 km' }
    ],
    correctOptionId: 'b',
    explanation: '4 cm × 50.000 = 200.000 cm = 2.000 m = 2 km.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_cartografia_2',
    topicId: 'geo_cartografia',
    subject: 'Geografia',
    prompt: 'A projeção cartográfica de Mercator, amplamente usada em navegação, é classificada como conforme porque:',
    options: [
      { id: 'a', text: 'Preserva as áreas reais dos continentes' },
      { id: 'b', text: 'Preserva os ângulos e as formas locais, mas distorce as áreas, especialmente em altas latitudes' },
      { id: 'c', text: 'Preserva as distâncias entre todos os pontos do globo' },
      { id: 'd', text: 'É a única projeção sem nenhum tipo de distorção' }
    ],
    correctOptionId: 'b',
    explanation: 'Projeções conformes, como a de Mercator, preservam ângulos e formas locais (úteis para navegação), mas distorcem áreas — por isso a Groenlândia aparece desproporcionalmente grande em relação à África nesse tipo de projeção.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_cartografia_3',
    topicId: 'geo_cartografia',
    subject: 'Geografia',
    prompt: 'Em um mapa com curvas de nível bastante espaçadas entre si em uma determinada área, isso indica que, naquele trecho, o relevo apresenta:',
    options: [
      { id: 'a', text: 'Declividade acentuada (relevo íngreme)' },
      { id: 'b', text: 'Declividade suave (relevo mais plano)' },
      { id: 'c', text: 'Uma depressão absoluta abaixo do nível do mar' },
      { id: 'd', text: 'Impossibilidade de representar a altitude' }
    ],
    correctOptionId: 'b',
    explanation: 'Curvas de nível representam pontos de mesma altitude; quando estão bem espaçadas entre si, significa que a altitude varia pouco ao longo de uma distância maior, indicando um relevo suave. Curvas muito próximas umas das outras indicam, ao contrário, declividade acentuada.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_cartografia_4',
    topicId: 'geo_cartografia',
    subject: 'Geografia',
    prompt: 'O Sistema de Posicionamento Global (GPS) permite determinar a localização exata de um ponto na superfície terrestre principalmente por meio de:',
    options: [
      { id: 'a', text: 'Comparação visual direta com mapas impressos' },
      { id: 'b', text: 'Triangulação de sinais recebidos de uma rede de satélites artificiais' },
      { id: 'c', text: 'Medição exclusiva da altitude em relação ao nível do mar' },
      { id: 'd', text: 'Cálculo baseado unicamente na direção do vento' }
    ],
    correctOptionId: 'b',
    explanation: 'O GPS funciona por meio da triangulação: um receptor calcula sua posição com base no tempo que os sinais de rádio levam para chegar de múltiplos satélites (normalmente pelo menos 4), cada um com posição orbital conhecida, permitindo determinar latitude, longitude e altitude com precisão.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_cartografia_5',
    topicId: 'geo_cartografia',
    subject: 'Geografia',
    prompt: 'Diferentemente das projeções conformes (como Mercator), as projeções equivalentes (como a de Peters) priorizam preservar:',
    options: [
      { id: 'a', text: 'Os ângulos e as formas locais dos continentes' },
      { id: 'b', text: 'As áreas reais dos continentes, mesmo distorcendo suas formas' },
      { id: 'c', text: 'Exclusivamente as distâncias entre os polos' },
      { id: 'd', text: 'Apenas a cor dos oceanos' }
    ],
    correctOptionId: 'b',
    explanation: 'Projeções equivalentes, como a de Peters, priorizam a representação proporcionalmente correta das áreas dos continentes (útil para comparar o tamanho real de diferentes países), ao custo de distorcer suas formas — o oposto do que fazem as projeções conformes, como a de Mercator.',
    difficulty: 'medium'
  },
  // Geografia — Climatologia e Problemas Socioambientais
  {
    id: 'q_geo_climatologia_socioambiental_1',
    topicId: 'geo_climatologia_socioambiental',
    subject: 'Geografia',
    prompt: 'O fenômeno da ilha de calor urbana é caracterizado por:',
    options: [
      { id: 'a', text: 'Temperaturas mais baixas nos centros urbanos em comparação às áreas rurais vizinhas' },
      { id: 'b', text: 'Temperaturas mais altas nas áreas centrais e densamente construídas das cidades em relação ao seu entorno' },
      { id: 'c', text: 'Formação de ilhas artificiais para regulação térmica' },
      { id: 'd', text: 'Aumento do nível do mar causado exclusivamente pela urbanização' }
    ],
    correctOptionId: 'b',
    explanation: 'A ilha de calor urbana ocorre porque o asfalto, o concreto e a menor cobertura vegetal absorvem e retêm mais calor, elevando a temperatura nas áreas centrais das cidades em relação às áreas rurais ou verdes do entorno.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_climatologia_socioambiental_2',
    topicId: 'geo_climatologia_socioambiental',
    subject: 'Geografia',
    prompt: 'O efeito estufa intensificado, associado às mudanças climáticas contemporâneas, é impulsionado principalmente pelo aumento da concentração atmosférica de gases como:',
    options: [
      { id: 'a', text: 'Oxigênio e nitrogênio' },
      { id: 'b', text: 'Gás carbônico (CO₂) e metano (CH₄)' },
      { id: 'c', text: 'Hidrogênio e hélio' },
      { id: 'd', text: 'Ozônio troposférico apenas' }
    ],
    correctOptionId: 'b',
    explanation: 'A queima de combustíveis fósseis, o desmatamento e a pecuária intensiva elevam a concentração de CO₂ e CH₄ na atmosfera, intensificando a retenção de calor e o efeito estufa natural do planeta.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_climatologia_socioambiental_3',
    topicId: 'geo_climatologia_socioambiental',
    subject: 'Geografia',
    prompt: 'A chuva ácida, um problema socioambiental associado à poluição atmosférica industrial e veicular, é formada principalmente pela combinação de água presente na atmosfera com:',
    options: [
      { id: 'a', text: 'Gás oxigênio e gás nitrogênio, componentes naturais do ar' },
      { id: 'b', text: 'Óxidos de enxofre e de nitrogênio, liberados pela queima de combustíveis fósseis' },
      { id: 'c', text: 'Vapor de água puro, sem qualquer poluente' },
      { id: 'd', text: 'Gás carbônico exclusivamente, sem outros poluentes' }
    ],
    correctOptionId: 'b',
    explanation: 'A chuva ácida se forma quando óxidos de enxofre (SOx) e de nitrogênio (NOx), liberados principalmente pela queima de combustíveis fósseis em indústrias e veículos, reagem com a água presente na atmosfera, formando ácidos que precipitam na chuva, prejudicando solos, corpos d\'água, construções e ecossistemas.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_climatologia_socioambiental_4',
    topicId: 'geo_climatologia_socioambiental',
    subject: 'Geografia',
    prompt: 'O fenômeno El Niño, caracterizado pelo aquecimento anômalo das águas do Oceano Pacífico equatorial, tende a causar, entre outros efeitos, no Brasil:',
    options: [
      { id: 'a', text: 'Chuvas intensas no Sul e seca no Norte/Nordeste, entre outros padrões regionais alterados' },
      { id: 'b', text: 'Nenhuma alteração perceptível no clima brasileiro' },
      { id: 'c', text: 'Queda uniforme de temperatura em todo o território nacional' },
      { id: 'd', text: 'Aumento generalizado e uniforme de chuvas em todo o país' }
    ],
    correctOptionId: 'a',
    explanation: 'O El Niño altera padrões de circulação atmosférica globalmente, e no Brasil costuma estar associado a chuvas acima da média na região Sul e a estiagens mais intensas no Norte e Nordeste, entre outras alterações regionais — os efeitos não são uniformes em todo o território.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_climatologia_socioambiental_5',
    topicId: 'geo_climatologia_socioambiental',
    subject: 'Geografia',
    prompt: 'A desertificação, processo de degradação de terras em regiões áridas e semiáridas, é intensificada, além de fatores climáticos naturais, principalmente por ações humanas como:',
    options: [
      { id: 'a', text: 'Reflorestamento intensivo e conservação do solo' },
      { id: 'b', text: 'Desmatamento, sobrepastoreio e práticas agrícolas inadequadas, que aceleram a degradação do solo' },
      { id: 'c', text: 'Irrigação controlada e manejo sustentável exclusivamente' },
      { id: 'd', text: 'Ausência total de atividade humana na região' }
    ],
    correctOptionId: 'b',
    explanation: 'Embora a desertificação tenha relação com condições climáticas naturais de regiões áridas/semiáridas, ela é fortemente intensificada por práticas humanas insustentáveis — como desmatamento da vegetação nativa, sobrepastoreio (excesso de gado por área) e uso inadequado do solo agrícola — que aceleram a perda de fertilidade e a degradação do solo, tornando a terra progressivamente mais improdutiva.',
    difficulty: 'medium'
  },
  // Geografia — Hidrogeografia
  {
    id: 'q_geo_hidrogeografia_1',
    topicId: 'geo_hidrogeografia',
    subject: 'Geografia',
    prompt: 'O maior aquífero subterrâneo da América do Sul, com grande extensão em território brasileiro, é o:',
    options: [
      { id: 'a', text: 'Aquífero Guarani' },
      { id: 'b', text: 'Aquífero Alter do Chão' },
      { id: 'c', text: 'Aquífero Cárstico' },
      { id: 'd', text: 'Aquífero Bambuí' }
    ],
    correctOptionId: 'a',
    explanation: 'O Aquífero Guarani é um dos maiores reservatórios subterrâneos de água doce do mundo, estendendo-se por Brasil, Argentina, Paraguai e Uruguai.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_hidrogeografia_2',
    topicId: 'geo_hidrogeografia',
    subject: 'Geografia',
    prompt: 'Um rio de planalto, com relevo acidentado e presença de corredeiras e quedas d\'água, apresenta principalmente potencial para:',
    options: [
      { id: 'a', text: 'Navegação de grande porte' },
      { id: 'b', text: 'Geração de energia hidrelétrica' },
      { id: 'c', text: 'Irrigação exclusiva de áreas costeiras' },
      { id: 'd', text: 'Formação de grandes deltas' }
    ],
    correctOptionId: 'b',
    explanation: 'Rios de planalto, com desníveis acentuados e correnteza forte, favorecem o aproveitamento hidrelétrico — diferente dos rios de planície, mais navegáveis por terem menor declividade.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_hidrogeografia_3',
    topicId: 'geo_hidrogeografia',
    subject: 'Geografia',
    prompt: 'A Bacia Hidrográfica Amazônica, a maior do mundo em volume de água, se destaca também por:',
    options: [
      { id: 'a', text: 'Ter seus rios praticamente sem uso para navegação, devido ao relevo extremamente acidentado' },
      { id: 'b', text: 'Concentrar uma rede de rios volumosos, com grande potencial de navegação, que funcionam como importantes vias de transporte regional' },
      { id: 'c', text: 'Estar localizada exclusivamente fora do território brasileiro' },
      { id: 'd', text: 'Não possuir nenhum afluente relevante' }
    ],
    correctOptionId: 'b',
    explanation: 'A Bacia Amazônica reúne o rio Amazonas e diversos afluentes volumosos (como o Negro, o Madeira e o Tapajós), que, por percorrerem trechos de planície com pouca declividade, oferecem grande potencial de navegação, sendo vias essenciais de transporte de pessoas e mercadorias na região.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_hidrogeografia_4',
    topicId: 'geo_hidrogeografia',
    subject: 'Geografia',
    prompt: 'O ciclo hidrológico (ciclo da água) descreve a circulação contínua da água entre a atmosfera, a superfície terrestre e os corpos d\'água. A etapa em que a água líquida se transforma em vapor, retornando à atmosfera a partir de rios, lagos e oceanos, é chamada de:',
    options: [
      { id: 'a', text: 'Precipitação' },
      { id: 'b', text: 'Evaporação' },
      { id: 'c', text: 'Infiltração' },
      { id: 'd', text: 'Escoamento superficial' }
    ],
    correctOptionId: 'b',
    explanation: 'A evaporação é a etapa do ciclo hidrológico em que a água líquida, presente em oceanos, rios e lagos, se transforma em vapor d\'água e retorna à atmosfera, de onde poderá formar nuvens e, posteriormente, precipitar novamente na forma de chuva.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_hidrogeografia_5',
    topicId: 'geo_hidrogeografia',
    subject: 'Geografia',
    prompt: 'A poluição de rios urbanos no Brasil, um problema socioambiental recorrente, é causada principalmente por:',
    options: [
      { id: 'a', text: 'Lançamento de esgoto doméstico e industrial sem tratamento adequado diretamente nos corpos d\'água' },
      { id: 'b', text: 'Excesso de chuvas naturais na região' },
      { id: 'c', text: 'Presença excessiva de peixes nos rios' },
      { id: 'd', text: 'Ausência total de urbanização nas margens dos rios' }
    ],
    correctOptionId: 'a',
    explanation: 'Grande parte da poluição de rios urbanos brasileiros decorre do lançamento de esgoto doméstico e efluentes industriais sem tratamento adequado, além do descarte irregular de resíduos sólidos — problemas agravados pela falta de infraestrutura de saneamento básico em muitas cidades.',
    difficulty: 'medium'
  },
  // Geografia — Globalização e Geografia Econômica
  {
    id: 'q_geo_globalizacao_economica_1',
    topicId: 'geo_globalizacao_economica',
    subject: 'Geografia',
    prompt: 'A fragmentação do processo produtivo entre diferentes países, em que cada etapa de fabricação de um produto ocorre onde é mais vantajosa economicamente, é conhecida como:',
    options: [
      { id: 'a', text: 'Autarquia econômica' },
      { id: 'b', text: 'Cadeia produtiva global (ou global commodity chain)' },
      { id: 'c', text: 'Protecionismo comercial' },
      { id: 'd', text: 'Economia de subsistência' }
    ],
    correctOptionId: 'b',
    explanation: 'As cadeias produtivas globais são uma marca da globalização econômica: componentes e etapas de um mesmo produto são fabricados em diferentes países conforme custo de mão de obra, insumos e logística.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_globalizacao_economica_2',
    topicId: 'geo_globalizacao_economica',
    subject: 'Geografia',
    prompt: 'Os blocos econômicos regionais, como o Mercosul e a União Europeia, têm como um de seus principais objetivos:',
    options: [
      { id: 'a', text: 'Eliminar completamente o comércio com países fora do bloco' },
      { id: 'b', text: 'Reduzir ou eliminar barreiras comerciais entre os países-membros, fortalecendo sua posição econômica conjunta' },
      { id: 'c', text: 'Unificar obrigatoriamente a moeda de todos os países-membros' },
      { id: 'd', text: 'Impedir a livre circulação de mercadorias entre os membros' }
    ],
    correctOptionId: 'b',
    explanation: 'Blocos econômicos regionais buscam reduzir tarifas e barreiras entre membros para ampliar o comércio interno e fortalecer o poder de negociação do grupo no cenário internacional — nem todos adotam moeda única, como é o caso do Mercosul.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_globalizacao_economica_3',
    topicId: 'geo_globalizacao_economica',
    subject: 'Geografia',
    prompt: 'A "divisão internacional do trabalho", conceito central para entender a globalização econômica, se refere a:',
    options: [
      { id: 'a', text: 'Todos os países desempenharem exatamente o mesmo papel na economia mundial' },
      { id: 'b', text: 'Diferentes países ou regiões se especializarem em determinadas funções na economia global (como produção de matérias-primas, manufatura ou serviços de alta tecnologia), de acordo com vantagens comparativas' },
      { id: 'c', text: 'Um único país concentrar toda a produção mundial de qualquer bem' },
      { id: 'd', text: 'A divisão igualitária da riqueza mundial entre todos os países' }
    ],
    correctOptionId: 'b',
    explanation: 'A divisão internacional do trabalho descreve como diferentes países/regiões se especializam em funções específicas na economia globalizada — por exemplo, alguns países concentram a extração de matérias-primas, outros a manufatura de baixo custo, e outros ainda serviços de alta tecnologia e pesquisa — de acordo com vantagens comparativas como custo de mão de obra, disponibilidade de recursos naturais ou nível tecnológico.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_globalizacao_economica_4',
    topicId: 'geo_globalizacao_economica',
    subject: 'Geografia',
    prompt: 'As empresas transnacionais (ou multinacionais), atores centrais da globalização econômica, se caracterizam por:',
    options: [
      { id: 'a', text: 'Operar exclusivamente dentro das fronteiras de seu país de origem' },
      { id: 'b', text: 'Possuir unidades produtivas, filiais ou operações em múltiplos países, buscando otimizar custos, acessar mercados e recursos em escala global' },
      { id: 'c', text: 'Serem obrigatoriamente controladas por governos nacionais' },
      { id: 'd', text: 'Produzirem apenas para consumo interno, sem qualquer exportação' }
    ],
    correctOptionId: 'b',
    explanation: 'Empresas transnacionais operam em múltiplos países simultaneamente, distribuindo etapas de produção, centros de distribuição e mercados consumidores de acordo com vantagens estratégicas em cada local (custo de mão de obra, incentivos fiscais, proximidade de mercados ou recursos) — um dos motores centrais da globalização econômica contemporânea.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_globalizacao_economica_5',
    topicId: 'geo_globalizacao_economica',
    subject: 'Geografia',
    prompt: 'Um dos efeitos mais discutidos da globalização econômica sobre os países em desenvolvimento é:',
    options: [
      { id: 'a', text: 'A eliminação total e imediata das desigualdades econômicas entre países' },
      { id: 'b', text: 'A possibilidade de maior integração aos mercados globais, mas também o risco de aprofundar desigualdades e dependência econômica em relação a economias mais desenvolvidas' },
      { id: 'c', text: 'O isolamento completo desses países do comércio internacional' },
      { id: 'd', text: 'A garantia automática de desenvolvimento econômico igual ao dos países mais ricos' }
    ],
    correctOptionId: 'b',
    explanation: 'A globalização econômica oferece a países em desenvolvimento oportunidades de integração a cadeias produtivas e mercados globais, mas esse processo é debatido justamente porque pode também aprofundar desigualdades — por exemplo, quando esses países ficam concentrados em atividades de menor valor agregado (extração de matérias-primas, manufatura básica), mantendo relações de dependência econômica e tecnológica em relação a países mais desenvolvidos.',
    difficulty: 'hard'
  },
  // Geografia — Geopolítica Regional Contemporânea
  {
    id: 'q_geo_geopolitica_regional_1',
    topicId: 'geo_geopolitica_regional',
    subject: 'Geografia',
    prompt: 'O termo "Oriente Médio" designa uma região marcada, entre outros fatores, por conflitos históricos ligados a:',
    options: [
      { id: 'a', text: 'Disputas territoriais, religiosas e pelo controle de recursos energéticos, como o petróleo' },
      { id: 'b', text: 'Ausência total de reservas de petróleo na região' },
      { id: 'c', text: 'Homogeneidade religiosa e étnica completa entre todos os países da região' },
      { id: 'd', text: 'Isolamento total em relação às potências ocidentais' }
    ],
    correctOptionId: 'a',
    explanation: 'A geopolítica do Oriente Médio é marcada por disputas territoriais e religiosas (como o conflito israelo-palestino), diversidade étnico-religiosa entre os países e grande relevância estratégica pelas reservas de petróleo da região.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_geopolitica_regional_2',
    topicId: 'geo_geopolitica_regional',
    subject: 'Geografia',
    prompt: 'Os BRICS (Brasil, Rússia, Índia, China, África do Sul, entre outros membros que aderiram mais recentemente) representam um agrupamento geopolítico que busca principalmente:',
    options: [
      { id: 'a', text: 'Ampliar a influência política e econômica de potências emergentes frente à ordem internacional tradicionalmente liderada por EUA e Europa Ocidental' },
      { id: 'b', text: 'Formar uma aliança militar nos moldes da OTAN' },
      { id: 'c', text: 'Unificar as moedas nacionais de seus membros' },
      { id: 'd', text: 'Restringir o comércio entre seus próprios membros' }
    ],
    correctOptionId: 'a',
    explanation: 'Os BRICS surgiram como articulação de potências emergentes buscando maior peso político e econômico no cenário internacional, historicamente dominado por EUA e potências europeias — sem caráter de aliança militar.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_geopolitica_regional_3',
    topicId: 'geo_geopolitica_regional',
    subject: 'Geografia',
    prompt: 'A União Europeia, um dos blocos regionais mais integrados do mundo, enfrentou em anos recentes um marco geopolítico significativo com:',
    options: [
      { id: 'a', text: 'A saída do Reino Unido do bloco (Brexit), formalizada após um referendo popular' },
      { id: 'b', text: 'A entrada simultânea de todos os países da Ásia no bloco' },
      { id: 'c', text: 'A fusão completa de todas as economias europeias em um único país' },
      { id: 'd', text: 'A dissolução total e definitiva do bloco' }
    ],
    correctOptionId: 'a',
    explanation: 'O Brexit — a saída do Reino Unido da União Europeia, decidida por referendo popular em 2016 e formalizada em 2020 — foi um marco geopolítico importante, gerando debates sobre soberania nacional, livre circulação de pessoas e os limites da integração regional europeia.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_geopolitica_regional_4',
    topicId: 'geo_geopolitica_regional',
    subject: 'Geografia',
    prompt: 'O conflito entre Rússia e Ucrânia, intensificado a partir de 2022, tem entre suas raízes geopolíticas discutidas:',
    options: [
      { id: 'a', text: 'A disputa por influência geopolítica na Europa Oriental, incluindo a possível expansão da OTAN e questões de soberania territorial da Ucrânia' },
      { id: 'b', text: 'Uma disputa exclusivamente religiosa, sem qualquer componente territorial ou geopolítico' },
      { id: 'c', text: 'Uma questão resolvida definitivamente por acordo diplomático nos anos 1990' },
      { id: 'd', text: 'A ausência total de interesse de outras potências no conflito' }
    ],
    correctOptionId: 'a',
    explanation: 'O conflito envolve, entre outros fatores, disputas históricas de influência geopolítica na Europa Oriental — incluindo o debate sobre a expansão da OTAN em direção às fronteiras russas, questões de soberania territorial (como a Crimeia e regiões do leste ucraniano) e identidades nacionais em disputa — um conflito com forte repercussão geopolítica global, inclusive em mercados de energia e alimentos.',
    difficulty: 'hard'
  },
  {
    id: 'q_geo_geopolitica_regional_5',
    topicId: 'geo_geopolitica_regional',
    subject: 'Geografia',
    prompt: 'A ascensão da China como potência econômica e geopolítica global nas últimas décadas está associada, entre outros fatores, a:',
    options: [
      { id: 'a', text: 'Um modelo de abertura econômica gradual ao capital estrangeiro, mantendo forte controle estatal e do Partido Comunista sobre setores estratégicos' },
      { id: 'b', text: 'Isolamento completo da economia chinesa em relação ao comércio internacional' },
      { id: 'c', text: 'Ausência total de investimentos em infraestrutura e tecnologia' },
      { id: 'd', text: 'Adoção de um sistema político idêntico ao dos países ocidentais' }
    ],
    correctOptionId: 'a',
    explanation: 'A China combinou reformas econômicas graduais (abertura ao investimento estrangeiro e ao comércio internacional, a partir do final dos anos 1970) com forte controle estatal e do Partido Comunista sobre setores estratégicos da economia — um modelo próprio que impulsionou seu crescimento econômico acelerado e sua crescente influência geopolítica global, incluindo projetos como a Nova Rota da Seda.',
    difficulty: 'medium'
  },
  // Geografia — Geografia Física do Brasil
  {
    id: 'q_geo_fisica_brasil_1',
    topicId: 'geo_fisica_brasil',
    subject: 'Geografia',
    prompt: 'O bioma brasileiro com a maior extensão territorial, ocupando principalmente a região Norte, é:',
    options: [
      { id: 'a', text: 'Cerrado' },
      { id: 'b', text: 'Caatinga' },
      { id: 'c', text: 'Amazônia' },
      { id: 'd', text: 'Mata Atlântica' }
    ],
    correctOptionId: 'c',
    explanation: 'O bioma Amazônia é o de maior extensão territorial no Brasil, cobrindo a maior parte da região Norte do país.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_fisica_brasil_2',
    topicId: 'geo_fisica_brasil',
    subject: 'Geografia',
    prompt: 'O relevo predominante no território brasileiro é caracterizado principalmente por:',
    options: [
      { id: 'a', text: 'Grandes cadeias de montanhas jovens e altas, como os Andes' },
      { id: 'b', text: 'Planaltos e planícies, com altitudes predominantemente moderadas, resultado de um relevo antigo e bastante desgastado pela erosão' },
      { id: 'c', text: 'Desertos que cobrem a maior parte do território' },
      { id: 'd', text: 'Ausência total de planícies' }
    ],
    correctOptionId: 'b',
    explanation: 'O Brasil está localizado em uma área tectonicamente estável (a Plataforma Sul-Americana), o que resultou em um relevo antigo, já bastante erodido, predominando planaltos e planícies de altitudes moderadas — sem grandes cadeias montanhosas jovens.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_fisica_brasil_3',
    topicId: 'geo_fisica_brasil',
    subject: 'Geografia',
    prompt: 'O clima predominante na maior parte do território brasileiro, marcado por temperaturas médias elevadas ao longo do ano, é classificado principalmente como:',
    options: [
      { id: 'a', text: 'Polar' },
      { id: 'b', text: 'Tropical, em suas diversas variações regionais' },
      { id: 'c', text: 'Desértico frio' },
      { id: 'd', text: 'Temperado continental, uniforme em todo o país' }
    ],
    correctOptionId: 'b',
    explanation: 'Por estar localizado majoritariamente entre os trópicos, o Brasil apresenta predominantemente climas tropicais (com variações regionais, como o tropical equatorial na Amazônia, o tropical semiárido no sertão nordestino e o tropical de altitude em áreas mais elevadas do Sudeste), com temperaturas médias elevadas ao longo do ano na maior parte do território.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_fisica_brasil_4',
    topicId: 'geo_fisica_brasil',
    subject: 'Geografia',
    prompt: 'O bioma Cerrado, o segundo maior do Brasil em extensão, é caracterizado principalmente por:',
    options: [
      { id: 'a', text: 'Vegetação de savana tropical, com árvores baixas e tortuosas, arbustos e um estrato herbáceo, adaptada a solos ácidos e à estação seca prolongada' },
      { id: 'b', text: 'Floresta densa e fechada, sem qualquer período de seca ao longo do ano' },
      { id: 'c', text: 'Vegetação exclusivamente aquática, sem qualquer espécie terrestre' },
      { id: 'd', text: 'Ausência total de vida vegetal' }
    ],
    correctOptionId: 'a',
    explanation: 'O Cerrado é um bioma de savana tropical, com árvores de troncos tortuosos e cascas grossas (adaptação ao fogo e à seca), arbustos e um denso estrato herbáceo, adaptado a solos ácidos e pobres em nutrientes e a uma estação seca bem definida — bastante diferente da floresta densa e úmida da Amazônia.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_fisica_brasil_5',
    topicId: 'geo_fisica_brasil',
    subject: 'Geografia',
    prompt: 'O desmatamento na Amazônia brasileira tem entre suas principais causas históricas:',
    options: [
      { id: 'a', text: 'A expansão de atividades como pecuária extensiva, agricultura e extração ilegal de madeira e minérios' },
      { id: 'b', text: 'Exclusivamente causas climáticas naturais, sem qualquer relação com atividade humana' },
      { id: 'c', text: 'A ausência total de qualquer atividade econômica na região' },
      { id: 'd', text: 'Um processo interrompido completamente desde a década de 1980' }
    ],
    correctOptionId: 'a',
    explanation: 'O desmatamento na Amazônia está historicamente associado à expansão da pecuária extensiva, à abertura de áreas para agricultura, e a atividades ilegais como extração de madeira e mineração — processos frequentemente ligados também à expansão de rodovias e à grilagem de terras públicas.',
    difficulty: 'medium'
  },
  // Geografia — Geografia Econômica do Brasil
  {
    id: 'q_geo_economica_brasil_1',
    topicId: 'geo_economica_brasil',
    subject: 'Geografia',
    prompt: 'O agronegócio brasileiro, um dos setores mais relevantes da economia do país, tem entre seus principais produtos de exportação:',
    options: [
      { id: 'a', text: 'Soja, carne bovina e café' },
      { id: 'b', text: 'Petróleo bruto exclusivamente' },
      { id: 'c', text: 'Produtos eletrônicos de alta tecnologia' },
      { id: 'd', text: 'Automóveis exclusivamente' }
    ],
    correctOptionId: 'a',
    explanation: 'O Brasil é um dos maiores exportadores mundiais de commodities agropecuárias, com destaque para soja, carne bovina e café entre seus principais produtos de exportação.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_economica_brasil_2',
    topicId: 'geo_economica_brasil',
    subject: 'Geografia',
    prompt: 'A região Sudeste concentra a maior parte da indústria brasileira principalmente devido a fatores históricos como:',
    options: [
      { id: 'a', text: 'Acúmulo de capital originado do café, mão de obra disponível, infraestrutura de transportes e proximidade de mercado consumidor' },
      { id: 'b', text: 'Clima extremamente frio, propício à instalação de fábricas' },
      { id: 'c', text: 'Isolamento geográfico total em relação ao restante do país' },
      { id: 'd', text: 'Ausência completa de outras atividades econômicas na região' }
    ],
    correctOptionId: 'a',
    explanation: 'A industrialização concentrada no Sudeste resulta de um processo histórico: o capital acumulado pela cafeicultura, disponibilidade de mão de obra (inclusive imigrante), infraestrutura de transporte e proximidade de um grande mercado consumidor favoreceram a instalação industrial na região.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_economica_brasil_3',
    topicId: 'geo_economica_brasil',
    subject: 'Geografia',
    prompt: 'A partir das últimas décadas do século XX, observou-se no Brasil um processo de desconcentração industrial, com a instalação de indústrias em regiões fora do Sudeste. Esse fenômeno é explicado principalmente por:',
    options: [
      { id: 'a', text: 'Incentivos fiscais oferecidos por estados de outras regiões, custos de mão de obra mais baixos e busca por proximidade de novos mercados consumidores' },
      { id: 'b', text: 'Uma decisão espontânea e sem qualquer motivação econômica das empresas' },
      { id: 'c', text: 'A proibição legal de novas indústrias se instalarem no Sudeste' },
      { id: 'd', text: 'O desaparecimento completo da indústria no Sudeste' }
    ],
    correctOptionId: 'a',
    explanation: 'A desconcentração industrial no Brasil foi impulsionada por incentivos fiscais (guerra fiscal entre estados), custos de mão de obra menores em outras regiões, saturação de infraestrutura no Sudeste e busca por proximidade de novos mercados consumidores em expansão — embora o Sudeste ainda concentre parcela expressiva da indústria nacional.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_economica_brasil_4',
    topicId: 'geo_economica_brasil',
    subject: 'Geografia',
    prompt: 'O Brasil é um dos maiores produtores mundiais de energia hidrelétrica, o que se relaciona diretamente com:',
    options: [
      { id: 'a', text: 'A abundância de grandes rios com desníveis aproveitáveis, especialmente em regiões de planalto' },
      { id: 'b', text: 'A ausência total de rios no território nacional' },
      { id: 'c', text: 'A predominância de um relevo montanhoso extremamente elevado em todo o país' },
      { id: 'd', text: 'A proibição de uso de outras fontes de energia' }
    ],
    correctOptionId: 'a',
    explanation: 'A grande disponibilidade de rios volumosos com desníveis aproveitáveis (especialmente em áreas de planalto, como a Bacia do Paraná) permitiu ao Brasil desenvolver uma matriz energética fortemente baseada em hidrelétricas, embora o país venha diversificando sua matriz com outras fontes renováveis, como eólica e solar.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_economica_brasil_5',
    topicId: 'geo_economica_brasil',
    subject: 'Geografia',
    prompt: 'O conceito de "commodity", frequentemente associado à pauta de exportações brasileira, se refere a:',
    options: [
      { id: 'a', text: 'Produtos manufaturados de altíssimo valor agregado e tecnologia exclusiva' },
      { id: 'b', text: 'Produtos primários (agrícolas, minerais) padronizados, negociados em larga escala no mercado internacional, com pouca diferenciação e agregação de valor' },
      { id: 'c', text: 'Serviços financeiros exclusivamente' },
      { id: 'd', text: 'Produtos exclusivos de uma única empresa, sem padronização de mercado' }
    ],
    correctOptionId: 'b',
    explanation: 'Commodities são produtos primários (como soja, minério de ferro, petróleo bruto) padronizados e negociados em larga escala em mercados internacionais, com preços definidos globalmente e pouca diferenciação entre produtores — uma característica marcante da pauta de exportações brasileira, com implicações sobre a dependência de preços internacionais e o valor agregado da economia.',
    difficulty: 'medium'
  },
  // Geografia — Geografia da População e Urbana do Brasil
  {
    id: 'q_geo_populacao_urbana_brasil_1',
    topicId: 'geo_populacao_urbana_brasil',
    subject: 'Geografia',
    prompt: 'O processo de êxodo rural no Brasil, intensificado sobretudo a partir da segunda metade do século XX, teve como uma de suas principais consequências:',
    options: [
      { id: 'a', text: 'A redução da população urbana em favor da rural' },
      { id: 'b', text: 'A acelerada urbanização do país, muitas vezes acompanhada de crescimento desordenado das cidades' },
      { id: 'c', text: 'O desaparecimento completo da agropecuária brasileira' },
      { id: 'd', text: 'A distribuição igualitária da população entre todas as regiões do país' }
    ],
    correctOptionId: 'b',
    explanation: 'O êxodo rural, impulsionado pela mecanização do campo e pela industrialização urbana, levou a uma rápida urbanização brasileira — muitas vezes desordenada, gerando periferias, favelas e déficit de infraestrutura nas grandes cidades.',
    difficulty: 'easy'
  },
  {
    id: 'q_geo_populacao_urbana_brasil_2',
    topicId: 'geo_populacao_urbana_brasil',
    subject: 'Geografia',
    prompt: 'A pirâmide etária brasileira vem passando, nas últimas décadas, por um processo de:',
    options: [
      { id: 'a', text: 'Rejuvenescimento acelerado da população' },
      { id: 'b', text: 'Envelhecimento populacional, com queda da taxa de natalidade e aumento da expectativa de vida' },
      { id: 'c', text: 'Estabilidade total, sem qualquer alteração estrutural' },
      { id: 'd', text: 'Redução da população total do país' }
    ],
    correctOptionId: 'b',
    explanation: 'A queda sustentada da taxa de natalidade e o aumento da expectativa de vida vêm alterando o formato da pirâmide etária brasileira, que se estreita na base e se alarga no topo — um processo de transição demográfica e envelhecimento populacional.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_populacao_urbana_brasil_3',
    topicId: 'geo_populacao_urbana_brasil',
    subject: 'Geografia',
    prompt: 'A macrocefalia urbana, fenômeno observado em algumas regiões metropolitanas brasileiras, se refere a:',
    options: [
      { id: 'a', text: 'A distribuição igualitária da população entre pequenas e grandes cidades de uma região' },
      { id: 'b', text: 'A concentração desproporcional da população e das atividades econômicas em uma única grande cidade (ou região metropolitana), em detrimento das demais cidades da região' },
      { id: 'c', text: 'O crescimento populacional exclusivo de áreas rurais' },
      { id: 'd', text: 'A ausência total de cidades grandes no país' }
    ],
    correctOptionId: 'b',
    explanation: 'A macrocefalia urbana ocorre quando uma cidade (geralmente a capital ou principal centro econômico de uma região) concentra desproporcionalmente população, empregos e serviços em relação às demais cidades da mesma região, criando um desequilíbrio na rede urbana — um padrão historicamente observado em várias regiões metropolitanas brasileiras.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_populacao_urbana_brasil_4',
    topicId: 'geo_populacao_urbana_brasil',
    subject: 'Geografia',
    prompt: 'A segregação socioespacial nas cidades brasileiras se manifesta, entre outras formas, por:',
    options: [
      { id: 'a', text: 'Distribuição totalmente igualitária de infraestrutura e serviços entre todos os bairros de uma cidade' },
      { id: 'b', text: 'Distância física e desigualdade de acesso a infraestrutura, serviços públicos e oportunidades entre diferentes grupos sociais e áreas da cidade' },
      { id: 'c', text: 'Ausência completa de diferenças entre bairros centrais e periféricos' },
      { id: 'd', text: 'Um fenômeno observado exclusivamente em outros países, nunca no Brasil' }
    ],
    correctOptionId: 'b',
    explanation: 'A segregação socioespacial se manifesta na desigual distribuição de infraestrutura urbana (saneamento, transporte, saúde, educação) e no distanciamento físico entre diferentes grupos sociais na cidade — frequentemente com populações de menor renda concentradas em periferias com pior acesso a serviços, enquanto áreas centrais ou nobres concentram melhor infraestrutura.',
    difficulty: 'medium'
  },
  {
    id: 'q_geo_populacao_urbana_brasil_5',
    topicId: 'geo_populacao_urbana_brasil',
    subject: 'Geografia',
    prompt: 'As migrações internas no Brasil, como o histórico fluxo de nordestinos para o Sudeste, foram impulsionadas principalmente por:',
    options: [
      { id: 'a', text: 'Fatores de repulsão (falta de oportunidades econômicas, secas prolongadas) na região de origem e fatores de atração (oferta de empregos industriais) na região de destino' },
      { id: 'b', text: 'Determinação legal obrigatória do governo federal' },
      { id: 'c', text: 'Ausência total de qualquer motivação econômica' },
      { id: 'd', text: 'Um fenômeno que nunca ocorreu de fato na história do país' }
    ],
    correctOptionId: 'a',
    explanation: 'As migrações internas brasileiras, como o fluxo histórico de nordestinos rumo ao Sudeste industrializado, foram impulsionadas pela combinação de fatores de repulsão na região de origem (secas recorrentes, concentração fundiária, falta de oportunidades econômicas) e fatores de atração no destino (oferta de empregos industriais e urbanos, melhores salários) — um padrão clássico de análise das migrações internas.',
    difficulty: 'medium'
  },
  // História — Idade Antiga
  {
    id: 'q_his_idade_antiga_1',
    topicId: 'his_idade_antiga',
    subject: 'História',
    prompt: 'A democracia praticada na Atenas antiga, frequentemente citada como referência histórica, era caracterizada por:',
    options: [
      { id: 'a', text: 'Participação política de todos os habitantes, sem qualquer exclusão' },
      { id: 'b', text: 'Uma democracia direta, mas restrita aos cidadãos do sexo masculino, livres e nascidos em Atenas — excluindo mulheres, escravizados e estrangeiros' },
      { id: 'c', text: 'Um sistema de voto obrigatório por representantes eleitos, semelhante ao atual' },
      { id: 'd', text: 'Ausência completa de qualquer forma de participação popular' }
    ],
    correctOptionId: 'b',
    explanation: 'A democracia ateniense era direta (os cidadãos deliberavam diretamente na Ecclesia), mas profundamente excludente: mulheres, escravizados e estrangeiros (metecos) não eram considerados cidadãos e não participavam da vida política.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_idade_antiga_2',
    topicId: 'his_idade_antiga',
    subject: 'História',
    prompt: 'O Império Romano, em seu apogeu, destacou-se historicamente por:',
    options: [
      { id: 'a', text: 'Uma extensa rede de leis, engenharia (estradas, aquedutos) e organização administrativa que integrou vastos territórios ao redor do Mediterrâneo' },
      { id: 'b', text: 'Isolamento total em relação aos povos vizinhos' },
      { id: 'c', text: 'Ausência de qualquer sistema jurídico organizado' },
      { id: 'd', text: 'Restringir-se apenas à Península Itálica, sem expansão territorial' }
    ],
    correctOptionId: 'a',
    explanation: 'Roma se destacou pela capacidade de administrar um vasto império por meio de um sistema jurídico influente (o Direito Romano), obras de engenharia como estradas e aquedutos, e uma estrutura administrativa que integrou territórios de três continentes ao redor do Mediterrâneo.',
    difficulty: 'medium'
  },
  // História — Idade Média
  {
    id: 'q_his_idade_media_1',
    topicId: 'his_idade_media',
    subject: 'História',
    prompt: 'O sistema feudal, predominante na Europa medieval, caracterizava-se principalmente por:',
    options: [
      { id: 'a', text: 'Relações de vassalagem e suserania, com a posse da terra (feudo) como base da organização social, política e econômica' },
      { id: 'b', text: 'Um governo central forte e unificado em toda a Europa' },
      { id: 'c', text: 'Ausência total de hierarquia social' },
      { id: 'd', text: 'Uma economia baseada exclusivamente no comércio marítimo internacional' }
    ],
    correctOptionId: 'a',
    explanation: 'O feudalismo se organizava em torno da posse da terra e de relações pessoais de vassalagem (fidelidade e proteção mútua entre suseranos e vassalos), num contexto de fragmentação do poder político central após a queda do Império Romano do Ocidente.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_idade_media_2',
    topicId: 'his_idade_media',
    subject: 'História',
    prompt: 'As Cruzadas, expedições militares religiosas ocorridas entre os séculos XI e XIII, tiveram entre suas principais motivações:',
    options: [
      { id: 'a', text: 'A reconquista de Jerusalém e da Terra Santa, além de interesses econômicos e políticos da Igreja e da nobreza europeia' },
      { id: 'b', text: 'A unificação política de toda a Europa sob um único rei' },
      { id: 'c', text: 'A abolição do sistema feudal' },
      { id: 'd', text: 'A criação da primeira república europeia' }
    ],
    correctOptionId: 'a',
    explanation: 'As Cruzadas combinaram motivações religiosas (retomar Jerusalém e a Terra Santa do domínio muçulmano) com interesses econômicos e políticos, como a expansão do comércio, o fortalecimento do poder da Igreja e a busca por terras e prestígio pela nobreza.',
    difficulty: 'medium'
  },
  // História — Idade Moderna e Iluminismo
  {
    id: 'q_his_moderna_iluminismo_1',
    topicId: 'his_moderna_iluminismo',
    subject: 'História',
    prompt: 'O Iluminismo, movimento intelectual do século XVIII, defendia principalmente:',
    options: [
      { id: 'a', text: 'O fortalecimento do poder absoluto dos reis por direito divino' },
      { id: 'b', text: 'O uso da razão como principal instrumento para compreender o mundo, criticando o absolutismo e os privilégios do Antigo Regime' },
      { id: 'c', text: 'A manutenção da servidão feudal como base da economia' },
      { id: 'd', text: 'A submissão total do pensamento científico à autoridade religiosa' }
    ],
    correctOptionId: 'b',
    explanation: 'Os iluministas (como Voltaire, Montesquieu e Rousseau) valorizavam a razão e a ciência, criticando o absolutismo monárquico, os privilégios da nobreza e do clero, e influenciando diretamente processos como a Revolução Francesa.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_moderna_iluminismo_2',
    topicId: 'his_moderna_iluminismo',
    subject: 'História',
    prompt: 'A Revolução Francesa (1789) teve como um de seus principais desdobramentos:',
    options: [
      { id: 'a', text: 'O fortalecimento definitivo da monarquia absolutista francesa' },
      { id: 'b', text: 'O fim do Antigo Regime na França e a difusão de ideais como liberdade, igualdade e fraternidade, influenciando movimentos posteriores em outras partes do mundo' },
      { id: 'c', text: 'A manutenção inalterada dos privilégios do clero e da nobreza' },
      { id: 'd', text: 'O isolamento total da França em relação ao restante da Europa' }
    ],
    correctOptionId: 'b',
    explanation: 'A Revolução Francesa derrubou o Antigo Regime, aboliu privilégios feudais e difundiu ideais iluministas (liberdade, igualdade, fraternidade) que influenciaram movimentos revolucionários e constitucionais em diversas partes do mundo nos séculos seguintes.',
    difficulty: 'medium'
  },
  // História — Imperialismo e Guerras Mundiais
  {
    id: 'q_his_imperialismo_guerras_1',
    topicId: 'his_imperialismo_guerras',
    subject: 'História',
    prompt: 'O imperialismo europeu do final do século XIX, especialmente na África e na Ásia, foi motivado principalmente por:',
    options: [
      { id: 'a', text: 'Busca de matérias-primas, mercados consumidores e prestígio político-militar entre as potências industrializadas' },
      { id: 'b', text: 'Desinteresse total das potências europeias por territórios além-mar' },
      { id: 'c', text: 'Acordos de cooperação igualitária com os povos colonizados' },
      { id: 'd', text: 'Ausência de qualquer motivação econômica' }
    ],
    correctOptionId: 'a',
    explanation: 'O imperialismo (ou neocolonialismo) foi impulsionado pela Segunda Revolução Industrial, que gerou necessidade de matérias-primas e novos mercados, além da disputa por prestígio e poder entre as potências europeias — resultando na partilha da África e de parte da Ásia.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_imperialismo_guerras_2',
    topicId: 'his_imperialismo_guerras',
    subject: 'História',
    prompt: 'A Primeira Guerra Mundial (1914-1918) teve como estopim imediato:',
    options: [
      { id: 'a', text: 'O assassinato do arquiduque Francisco Ferdinando, herdeiro do trono austro-húngaro, em Sarajevo' },
      { id: 'b', text: 'A invasão da Polônia pela Alemanha' },
      { id: 'c', text: 'O ataque a Pearl Harbor' },
      { id: 'd', text: 'A Revolução Russa de 1917' }
    ],
    correctOptionId: 'a',
    explanation: 'O assassinato do arquiduque Francisco Ferdinando em Sarajevo, em 1914, foi o estopim que desencadeou a Primeira Guerra Mundial, num contexto já tenso de rivalidades imperialistas, alianças militares e nacionalismos exacerbados na Europa.',
    difficulty: 'easy'
  },
  // História — Guerra Fria e Mundo Contemporâneo
  {
    id: 'q_his_guerra_fria_contemporaneo_1',
    topicId: 'his_guerra_fria_contemporaneo',
    subject: 'História',
    prompt: 'A Guerra Fria, período de disputa entre Estados Unidos e União Soviética após a Segunda Guerra Mundial, caracterizou-se por:',
    options: [
      { id: 'a', text: 'Confronto militar direto e declarado entre as duas potências em seus próprios territórios' },
      { id: 'b', text: 'Uma disputa ideológica, econômica e tecnológica entre capitalismo e socialismo, com conflitos indiretos (guerras por procuração) em outras regiões do mundo' },
      { id: 'c', text: 'Total ausência de tensão entre as duas potências' },
      { id: 'd', text: 'Aliança militar formal entre EUA e URSS' }
    ],
    correctOptionId: 'b',
    explanation: 'A Guerra Fria não envolveu confronto militar direto entre EUA e URSS, mas sim disputa ideológica (capitalismo x socialismo), corrida armamentista e espacial, e conflitos indiretos travados em outros países, como Coreia, Vietnã e Afeganistão.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_guerra_fria_contemporaneo_2',
    topicId: 'his_guerra_fria_contemporaneo',
    subject: 'História',
    prompt: 'A queda do Muro de Berlim, em 1989, é historicamente associada a:',
    options: [
      { id: 'a', text: 'O início da Guerra Fria' },
      { id: 'b', text: 'O fortalecimento do bloco socialista liderado pela URSS' },
      { id: 'c', text: 'O símbolo do fim da divisão entre os blocos capitalista e socialista na Europa, e um marco do processo que levaria ao fim da Guerra Fria' },
      { id: 'd', text: 'A criação da União Europeia' }
    ],
    correctOptionId: 'c',
    explanation: 'A queda do Muro de Berlim em 1989 simbolizou o colapso do bloco socialista na Europa Oriental, sendo um marco central no processo que culminaria no fim da Guerra Fria e na posterior dissolução da União Soviética em 1991.',
    difficulty: 'medium'
  },
  // História — Brasil Colônia
  {
    id: 'q_his_brasil_colonia_1',
    topicId: 'his_brasil_colonia',
    subject: 'História',
    prompt: 'A economia do Brasil Colônia, sobretudo entre os séculos XVI e XVIII, baseava-se principalmente em:',
    options: [
      { id: 'a', text: 'Uma economia agroexportadora, voltada ao mercado externo, com destaque para o açúcar e, posteriormente, o ouro' },
      { id: 'b', text: 'Uma economia industrial diversificada e voltada ao mercado interno' },
      { id: 'c', text: 'Ausência total de mão de obra escravizada' },
      { id: 'd', text: 'Isolamento comercial completo em relação a Portugal' }
    ],
    correctOptionId: 'a',
    explanation: 'A economia colonial brasileira baseava-se no pacto colonial, voltada à exportação de produtos primários — com destaque para o açúcar no período inicial e para o ouro durante o ciclo minerador do século XVIII — e amplamente sustentada pelo trabalho escravizado.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_brasil_colonia_2',
    topicId: 'his_brasil_colonia',
    subject: 'História',
    prompt: 'A Inconfidência Mineira (1789), um dos principais movimentos de contestação ao domínio português no Brasil Colônia, foi motivada principalmente por:',
    options: [
      { id: 'a', text: 'A insatisfação de setores da elite mineira com a cobrança de impostos, especialmente a derrama, além da influência de ideais iluministas' },
      { id: 'b', text: 'A abolição imediata da escravidão' },
      { id: 'c', text: 'A independência já consolidada do Brasil' },
      { id: 'd', text: 'Um acordo pacífico com a Coroa portuguesa para reduzir impostos' }
    ],
    correctOptionId: 'a',
    explanation: 'A Inconfidência Mineira envolveu setores da elite (como Tiradentes) insatisfeitos com a política fiscal portuguesa (sobretudo a ameaça da derrama, cobrança retroativa de impostos sobre o ouro) e influenciados por ideais iluministas e pelo exemplo da independência dos Estados Unidos.',
    difficulty: 'medium'
  },
  // História — Brasil Império
  {
    id: 'q_his_brasil_imperio_1',
    topicId: 'his_brasil_imperio',
    subject: 'História',
    prompt: 'A independência do Brasil, proclamada em 1822, resultou em um processo político caracterizado por:',
    options: [
      { id: 'a', text: 'Uma ruptura completa e imediata com todas as estruturas econômicas e sociais do período colonial' },
      { id: 'b', text: 'A manutenção de diversas estruturas herdadas do período colonial, como a escravidão e a grande propriedade rural, sob um novo regime monárquico' },
      { id: 'c', text: 'A implantação imediata de uma república democrática' },
      { id: 'd', text: 'O fim total dos laços econômicos com a Inglaterra' }
    ],
    correctOptionId: 'b',
    explanation: 'A independência do Brasil manteve a monarquia (com D. Pedro I como imperador) e preservou estruturas sociais e econômicas herdadas da colônia, como a escravidão e o latifúndio, configurando uma transição política sem rupturas sociais profundas.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_brasil_imperio_2',
    topicId: 'his_brasil_imperio',
    subject: 'História',
    prompt: 'A Lei Áurea, sancionada em 1888, teve como principal efeito:',
    options: [
      { id: 'a', text: 'Abolir formalmente a escravidão no Brasil, sem, no entanto, garantir políticas efetivas de inclusão social e econômica para os libertos' },
      { id: 'b', text: 'Conceder terras automaticamente a todos os ex-escravizados' },
      { id: 'c', text: 'Instituir a república no Brasil' },
      { id: 'd', text: 'Ampliar o direito de voto a todos os cidadãos, homens e mulheres' }
    ],
    correctOptionId: 'a',
    explanation: 'A Lei Áurea aboliu formalmente a escravidão no Brasil, mas não veio acompanhada de políticas de reparação, terra ou inclusão social para os libertos, contribuindo para desigualdades estruturais que persistiram após a abolição.',
    difficulty: 'easy'
  },
  // História — Primeira República e Era Vargas
  {
    id: 'q_his_primeira_republica_vargas_1',
    topicId: 'his_primeira_republica_vargas',
    subject: 'História',
    prompt: 'A política do "café com leite", característica da Primeira República (1889-1930), referia-se a:',
    options: [
      { id: 'a', text: 'Um acordo informal de alternância no poder entre as oligarquias de São Paulo (café) e Minas Gerais (leite)' },
      { id: 'b', text: 'Um programa de distribuição gratuita de alimentos à população' },
      { id: 'c', text: 'Uma política de industrialização acelerada' },
      { id: 'd', text: 'Um acordo comercial entre Brasil e Argentina' }
    ],
    correctOptionId: 'a',
    explanation: 'A política do "café com leite" descreve o revezamento na presidência entre as oligarquias paulista (associada à produção cafeeira) e mineira (associada à pecuária leiteira), uma marca do domínio das elites regionais durante a Primeira República.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_primeira_republica_vargas_2',
    topicId: 'his_primeira_republica_vargas',
    subject: 'História',
    prompt: 'O Estado Novo (1937-1945), período ditatorial do governo de Getúlio Vargas, foi marcado por:',
    options: [
      { id: 'a', text: 'Ampla liberdade de imprensa e pluripartidarismo' },
      { id: 'b', text: 'Centralização do poder no Executivo, censura, repressão política e, ao mesmo tempo, avanços na legislação trabalhista' },
      { id: 'c', text: 'A restauração da monarquia no Brasil' },
      { id: 'd', text: 'A total ausência de intervenção estatal na economia' },
    ],
    correctOptionId: 'b',
    explanation: 'O Estado Novo combinou autoritarismo — com censura, fechamento do Congresso e perseguição a opositores — com a criação de importantes direitos trabalhistas (como a CLT), consolidando Vargas como uma figura popular apesar do regime ditatorial.',
    difficulty: 'medium'
  },
  // História — República Liberal e Brasil Contemporâneo
  {
    id: 'q_his_republica_liberal_atual_1',
    topicId: 'his_republica_liberal_atual',
    subject: 'História',
    prompt: 'A ditadura militar brasileira (1964-1985) foi caracterizada, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'Ampla democracia participativa e liberdade de expressão' },
      { id: 'b', text: 'Supressão de direitos políticos, censura e repressão a opositores, sob um regime de exceção que durou mais de duas décadas' },
      { id: 'c', text: 'Eleições diretas e livres para presidente durante todo o período' },
      { id: 'd', text: 'Ausência completa de qualquer forma de resistência ou oposição' }
    ],
    correctOptionId: 'b',
    explanation: 'A ditadura militar instaurada em 1964 suprimiu direitos políticos, impôs censura e reprimiu opositores (incluindo tortura e perseguição), mantendo-se no poder por 21 anos até a redemocratização em 1985.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_republica_liberal_atual_2',
    topicId: 'his_republica_liberal_atual',
    subject: 'História',
    prompt: 'A Constituição de 1988, conhecida como "Constituição Cidadã", é um marco histórico por:',
    options: [
      { id: 'a', text: 'Ter restaurado o regime militar no Brasil' },
      { id: 'b', text: 'Consolidar o processo de redemocratização, ampliando direitos individuais, sociais e políticos após o fim da ditadura militar' },
      { id: 'c', text: 'Ter sido a primeira constituição republicana do Brasil' },
      { id: 'd', text: 'Ter eliminado o voto direto para presidente' }
    ],
    correctOptionId: 'b',
    explanation: 'A Constituição de 1988 consolidou a redemocratização brasileira, ampliando direitos fundamentais, sociais, políticos e trabalhistas, e estabelecendo as bases institucionais da República Federativa do Brasil atual.',
    difficulty: 'medium'
  },
  // Biologia — Estrutura e Fisiologia Celular
  {
    id: 'q_bio_estrutura_fisio_celular_1',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Qual organela é responsável pela produção de energia (ATP) por meio da respiração celular?',
    options: [
      { id: 'a', text: 'Complexo de Golgi' },
      { id: 'b', text: 'Mitocôndria' },
      { id: 'c', text: 'Ribossomo' },
      { id: 'd', text: 'Lisossomo' }
    ],
    correctOptionId: 'b',
    explanation: 'A mitocôndria é o principal sítio da respiração celular aeróbica, onde ocorre a produção de ATP por fosforilação oxidativa.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_2',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O modelo do mosaico fluido, usado para descrever a membrana plasmática, caracteriza-a como:',
    options: [
      { id: 'a', text: 'Uma estrutura rígida e estática, composta apenas por proteínas' },
      { id: 'b', text: 'Uma bicamada lipídica fluida, com proteínas dispersas que podem se mover lateralmente' },
      { id: 'c', text: 'Uma camada única de fosfolipídios, impermeável a todas as substâncias' },
      { id: 'd', text: 'Uma parede celular rígida, presente em todas as células' }
    ],
    correctOptionId: 'b',
    explanation: 'No modelo do mosaico fluido, a membrana é uma bicamada lipídica fluida na qual proteínas estão dispersas e podem se mover lateralmente, o que sustenta funções como permeabilidade seletiva e sinalização celular.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_3',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Uma célula é colocada em uma solução hipertônica em relação ao seu meio interno. O que se espera que aconteça com essa célula, por osmose?',
    options: [
      { id: 'a', text: 'A célula ganha água e incha, podendo se romper' },
      { id: 'b', text: 'A célula perde água para o meio externo, podendo murchar (crenação/plasmólise)' },
      { id: 'c', text: 'Não há qualquer movimento de água entre a célula e o meio' },
      { id: 'd', text: 'A célula dobra de tamanho instantaneamente' }
    ],
    correctOptionId: 'b',
    explanation: 'Em uma solução hipertônica (com maior concentração de soluto que o interior da célula), a água tende a sair da célula por osmose, seguindo o gradiente de concentração, em direção ao meio externo mais concentrado — causando murchamento da célula (plasmólise em células vegetais, crenação em hemácias, por exemplo).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_4',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O retículo endoplasmático rugoso (com ribossomos aderidos) e o retículo endoplasmático liso (sem ribossomos) têm funções diferentes na célula. Qual é a principal função do retículo endoplasmático rugoso?',
    options: [
      { id: 'a', text: 'Síntese de lipídios e desintoxicação de substâncias' },
      { id: 'b', text: 'Síntese e processamento inicial de proteínas destinadas à secreção ou a outras organelas' },
      { id: 'c', text: 'Digestão intracelular de macromoléculas' },
      { id: 'd', text: 'Produção de ATP por fosforilação oxidativa' }
    ],
    correctOptionId: 'b',
    explanation: 'O retículo endoplasmático rugoso tem ribossomos aderidos à sua superfície, que sintetizam proteínas destinadas à secreção, à membrana plasmática ou a outras organelas — essas proteínas entram no lúmen do retículo para processamento inicial (como dobramento) antes de seguir para o complexo de Golgi. O liso, sem ribossomos, é responsável pela síntese de lipídios e desintoxicação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_5',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Os lisossomos, organelas presentes em células eucarióticas (especialmente animais), têm como principal função:',
    options: [
      { id: 'a', text: 'Produzir energia por meio da respiração celular' },
      { id: 'b', text: 'Digerir macromoléculas e estruturas celulares desgastadas, por meio de enzimas digestivas' },
      { id: 'c', text: 'Sintetizar proteínas destinadas à secreção' },
      { id: 'd', text: 'Armazenar o material genético da célula' }
    ],
    correctOptionId: 'b',
    explanation: 'Os lisossomos contêm enzimas digestivas (hidrolases ácidas) capazes de degradar macromoléculas, organelas desgastadas (autofagia) e partículas englobadas por fagocitose — funcionando como o "sistema digestivo" da célula.',
    difficulty: 'easy'
  },
  // Biologia — Biotecnologia
  {
    id: 'q_bio_biotecnologia_1',
    topicId: 'bio_biotecnologia',
    subject: 'Biologia',
    prompt: 'A técnica de PCR (Reação em Cadeia da Polimerase) é utilizada principalmente para:',
    options: [
      { id: 'a', text: 'Sequenciar diretamente proteínas' },
      { id: 'b', text: 'Amplificar (copiar) um segmento específico de DNA, obtendo muitas cópias dele' },
      { id: 'c', text: 'Transferir genes entre diferentes espécies' },
      { id: 'd', text: 'Editar diretamente o RNA mensageiro' }
    ],
    correctOptionId: 'b',
    explanation: 'A PCR amplifica um trecho específico de DNA por meio de ciclos de aquecimento e resfriamento, usando primers e uma DNA polimerase, gerando milhões de cópias daquele segmento.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_biotecnologia_2',
    topicId: 'bio_biotecnologia',
    subject: 'Biologia',
    prompt: 'A tecnologia CRISPR-Cas9, amplamente usada em edição genética, funciona principalmente por meio de:',
    options: [
      { id: 'a', text: 'Um vírus que insere genes aleatoriamente no genoma' },
      { id: 'b', text: 'Uma enzima (Cas9) guiada por uma sequência de RNA que corta o DNA em um local específico, permitindo edições precisas' },
      { id: 'c', text: 'Um processo puramente químico, sem qualquer componente biológico' },
      { id: 'd', text: 'A fusão direta de células de diferentes espécies' }
    ],
    correctOptionId: 'b',
    explanation: 'No sistema CRISPR-Cas9, um RNA-guia direciona a enzima Cas9 até uma sequência específica de DNA, onde ela realiza um corte preciso — permitindo remover, inserir ou corrigir trechos do genoma.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_biotecnologia_3',
    topicId: 'bio_biotecnologia',
    subject: 'Biologia',
    prompt: 'Organismos geneticamente modificados (transgênicos), como plantas resistentes a determinados herbicidas, são produzidos principalmente por meio de:',
    options: [
      { id: 'a', text: 'Cruzamento seletivo tradicional entre variedades da mesma espécie, sem qualquer manipulação direta do DNA' },
      { id: 'b', text: 'Inserção direta, em laboratório, de um gene de interesse (às vezes de outra espécie) no genoma do organismo' },
      { id: 'c', text: 'Exposição a altas doses de radiação, sem controle sobre o resultado' },
      { id: 'd', text: 'Clonagem reprodutiva do organismo original, sem qualquer alteração genética' }
    ],
    correctOptionId: 'b',
    explanation: 'Um organismo transgênico é aquele que recebeu, por engenharia genética, um gene de interesse inserido diretamente em seu genoma — muitas vezes um gene originado de uma espécie diferente — conferindo uma característica específica (como resistência a um herbicida ou a uma praga), diferentemente do cruzamento seletivo tradicional, que apenas recombina genes já existentes na mesma espécie.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_biotecnologia_4',
    topicId: 'bio_biotecnologia',
    subject: 'Biologia',
    prompt: 'O teste de paternidade por DNA se baseia principalmente no fato de que:',
    options: [
      { id: 'a', text: 'Cada pessoa tem uma sequência de DNA completamente diferente de qualquer parente biológico' },
      { id: 'b', text: 'Metade do material genético de uma pessoa vem obrigatoriamente do pai biológico e a outra metade da mãe biológica, o que permite comparar marcadores genéticos específicos entre filho e possíveis pais' },
      { id: 'c', text: 'O DNA de uma pessoa muda completamente a cada geração, sem relação com os pais' },
      { id: 'd', text: 'Apenas o cromossomo Y é analisado, independentemente do sexo do filho' }
    ],
    correctOptionId: 'b',
    explanation: 'Um filho biológico herda metade de seus alelos do pai e metade da mãe. O teste de paternidade compara marcadores genéticos específicos (regiões de DNA muito variáveis entre indivíduos não aparentados) do suposto pai com os do filho, verificando se os alelos do filho podem de fato ter vindo daquele pai — com alta probabilidade estatística de exclusão ou confirmação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_biotecnologia_5',
    topicId: 'bio_biotecnologia',
    subject: 'Biologia',
    prompt: 'A clonagem reprodutiva, técnica usada para gerar um animal geneticamente idêntico a outro (como no caso da ovelha Dolly), envolve principalmente:',
    options: [
      { id: 'a', text: 'A fecundação normal entre um óvulo e um espermatozoide de indivíduos diferentes' },
      { id: 'b', text: 'A transferência do núcleo de uma célula somática (não reprodutiva) do indivíduo a ser clonado para um óvulo enucleado (sem núcleo próprio), que é então estimulado a se desenvolver' },
      { id: 'c', text: 'A simples divisão de um embrião já existente ao meio, sem qualquer manipulação de núcleo' },
      { id: 'd', text: 'A edição direta de genes específicos usando CRISPR-Cas9' }
    ],
    correctOptionId: 'b',
    explanation: 'Na clonagem reprodutiva (técnica usada para gerar a ovelha Dolly), o núcleo de uma célula somática do indivíduo a ser clonado é transferido para um óvulo do qual o núcleo original foi removido (enucleado). O óvulo reconstituído é então estimulado a se dividir e se desenvolver como um embrião, geneticamente idêntico (no núcleo) ao doador da célula somática.',
    difficulty: 'hard'
  },
  // Biologia — Zoologia
  {
    id: 'q_bio_zoologia_1',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os animais classificados como vertebrados pertencem ao filo:',
    options: [
      { id: 'a', text: 'Mollusca' },
      { id: 'b', text: 'Arthropoda' },
      { id: 'c', text: 'Chordata' },
      { id: 'd', text: 'Cnidaria' }
    ],
    correctOptionId: 'c',
    explanation: 'Os vertebrados formam um subfilo dentro do filo Chordata, cujas características incluem, em algum momento do desenvolvimento, notocorda, tubo neural dorsal e fendas faríngeas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_2',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os anfíbios são caracterizados, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'Respiração exclusivamente branquial durante toda a vida' },
      { id: 'b', text: 'Pele geralmente permeável e um ciclo de vida que tipicamente inclui uma fase aquática (larval) e uma fase terrestre (adulta)' },
      { id: 'c', text: 'Ausência total de qualquer fase aquática no ciclo de vida' },
      { id: 'd', text: 'Presença de penas que os protegem da dessecação' }
    ],
    correctOptionId: 'b',
    explanation: 'Anfíbios como rãs e sapos passam por metamorfose: iniciam a vida em ambiente aquático (girinos, com respiração branquial) e, na fase adulta, ocupam ambientes terrestres, respirando por pulmões e por uma pele fina e permeável, o que os mantém dependentes de ambientes úmidos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_3',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os artrópodes, o filo animal com maior número de espécies descritas, compartilham como características principais:',
    options: [
      { id: 'a', text: 'Corpo mole, sem qualquer proteção externa' },
      { id: 'b', text: 'Exoesqueleto de quitina e apêndices articulados (pernas, antenas)' },
      { id: 'c', text: 'Esqueleto interno ósseo, como os vertebrados' },
      { id: 'd', text: 'Ausência total de simetria corporal' }
    ],
    correctOptionId: 'b',
    explanation: 'Artrópodes (insetos, aracnídeos, crustáceos, entre outros) possuem um exoesqueleto rígido de quitina, que precisa ser trocado periodicamente (ecdise/muda) para permitir o crescimento, e apêndices articulados que dão nome ao filo (do grego, "pés articulados").',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_4',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'As aves, animais endotérmicos (de sangue quente), apresentam diversas adaptações para o voo, entre elas:',
    options: [
      { id: 'a', text: 'Ossos maciços e pesados, para maior estabilidade' },
      { id: 'b', text: 'Ossos pneumáticos (parcialmente ocos), penas leves e sacos aéreos que otimizam a respiração' },
      { id: 'c', text: 'Ausência completa de sistema respiratório especializado' },
      { id: 'd', text: 'Membros anteriores idênticos aos membros posteriores' }
    ],
    correctOptionId: 'b',
    explanation: 'As aves possuem diversas adaptações para reduzir peso e aumentar eficiência energética durante o voo: ossos pneumáticos (parcialmente ocos, mas ainda resistentes), penas leves, e um sistema respiratório com sacos aéreos que permite um fluxo praticamente unidirecional de ar através dos pulmões, tornando as trocas gasosas mais eficientes que em mamíferos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_5',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os mamíferos, grupo ao qual pertence a espécie humana, se diferenciam dos demais vertebrados principalmente pela presença de:',
    options: [
      { id: 'a', text: 'Glândulas mamárias (que produzem leite para os filhotes) e pelos' },
      { id: 'b', text: 'Respiração exclusivamente branquial' },
      { id: 'c', text: 'Desenvolvimento embrionário sempre externo, em ovos depositados no ambiente' },
      { id: 'd', text: 'Ausência total de regulação da temperatura corporal' }
    ],
    correctOptionId: 'a',
    explanation: 'As glândulas mamárias (que dão nome ao grupo) e a presença de pelos são características exclusivas dos mamíferos entre os vertebrados. A maioria dos mamíferos também é endotérmica (regula ativamente a temperatura corporal) e tem desenvolvimento embrionário interno (vivíparo), com exceções como os monotremados (ex.: ornitorrinco), que põem ovos.',
    difficulty: 'medium'
  },
  // Biologia — Botânica
  {
    id: 'q_bio_botanica_1',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'O processo pelo qual as plantas convertem energia luminosa em energia química, produzindo glicose e liberando oxigênio, é chamado de:',
    options: [
      { id: 'a', text: 'Respiração celular' },
      { id: 'b', text: 'Fotossíntese' },
      { id: 'c', text: 'Transpiração' },
      { id: 'd', text: 'Fermentação' }
    ],
    correctOptionId: 'b',
    explanation: 'A fotossíntese, realizada nos cloroplastos, converte energia luminosa, água e gás carbônico em glicose e oxigênio, sendo a base da cadeia produtiva de energia nos ecossistemas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_botanica_2',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'Os tecidos vasculares responsáveis, respectivamente, pelo transporte de água e sais minerais das raízes até as folhas, e pelo transporte dos produtos da fotossíntese pela planta, são:',
    options: [
      { id: 'a', text: 'Floema e xilema' },
      { id: 'b', text: 'Xilema e floema' },
      { id: 'c', text: 'Parênquima e colênquima' },
      { id: 'd', text: 'Epiderme e córtex' }
    ],
    correctOptionId: 'b',
    explanation: 'O xilema conduz a seiva bruta (água e sais minerais) das raízes até as folhas, enquanto o floema conduz a seiva elaborada (produtos da fotossíntese, como açúcares) das folhas para o restante da planta.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_3',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'As plantas angiospermas (que produzem flores e frutos) se diferenciam das gimnospermas (como pinheiros) principalmente por:',
    options: [
      { id: 'a', text: 'Produzirem sementes envolvidas por um fruto (originado do desenvolvimento do ovário), enquanto as gimnospermas produzem sementes "nuas", sem fruto envolvente' },
      { id: 'b', text: 'Não produzirem sementes de forma alguma' },
      { id: 'c', text: 'Não realizarem fotossíntese' },
      { id: 'd', text: 'Serem exclusivamente aquáticas' }
    ],
    correctOptionId: 'a',
    explanation: 'Angiospermas ("sementes em vaso/receptáculo") desenvolvem suas sementes dentro de um ovário, que se transforma em fruto após a fecundação. Já as gimnospermas ("sementes nuas") produzem sementes diretamente expostas, sem um fruto envolvente — como acontece nos cones (estróbilos) dos pinheiros.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_4',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'No ciclo de vida das plantas, ocorre uma alternância entre uma fase gametofítica (produtora de gametas, haploide) e uma fase esporofítica (produtora de esporos, diploide). Nas angiospermas, a fase predominante e visível do ciclo de vida é:',
    options: [
      { id: 'a', text: 'A fase gametofítica, representada pela planta inteira que vemos' },
      { id: 'b', text: 'A fase esporofítica, representada pela planta inteira que vemos, com os gametófitos reduzidos a estruturas microscópicas dentro da flor' },
      { id: 'c', text: 'Não há alternância de gerações nas angiospermas' },
      { id: 'd', text: 'Apenas a fase gametofítica existe, sem qualquer fase esporofítica' }
    ],
    correctOptionId: 'b',
    explanation: 'Nas angiospermas, a planta que vemos (raiz, caule, folhas, flores) é o esporófito (fase diploide, dominante). Os gametófitos (fase haploide, produtora de gametas) são extremamente reduzidos e microscópicos, formados dentro das estruturas florais (grão de pólen e saco embrionário) — ao contrário de plantas mais primitivas, como musgos, em que o gametófito é a fase dominante e visível.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_botanica_5',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'As raízes das plantas desempenham, além da fixação ao solo, um papel fundamental na absorção de água e nutrientes minerais. Essa absorção é significativamente aumentada por:',
    options: [
      { id: 'a', text: 'Pelos absorventes (radiculares), que multiplicam enormemente a área de superfície de contato da raiz com o solo' },
      { id: 'b', text: 'A presença de clorofila nas raízes, permitindo fotossíntese subterrânea' },
      { id: 'c', text: 'A ausência total de células especializadas na raiz' },
      { id: 'd', text: 'O crescimento exclusivamente em espessura da raiz, sem qualquer estrutura especializada' }
    ],
    correctOptionId: 'a',
    explanation: 'Os pelos absorventes (ou radiculares) são extensões finas e numerosas das células da epiderme da raiz, que aumentam drasticamente a área de superfície em contato com as partículas do solo e a água intersticial, otimizando a absorção de água e íons minerais dissolvidos.',
    difficulty: 'medium'
  },
  // Física — Cinemática Vetorial
  {
    id: 'q_fis_cinematica_vetorial_1',
    topicId: 'fis_cinematica_vetorial',
    subject: 'Física',
    prompt: 'Um projétil é lançado horizontalmente do topo de um penhasco de 45 m de altura, com velocidade inicial de 10 m/s. Usando g = 10 m/s², qual é o alcance horizontal do projétil ao atingir o solo?',
    options: [
      { id: 'a', text: '10 m' },
      { id: 'b', text: '15 m' },
      { id: 'c', text: '30 m' },
      { id: 'd', text: '45 m' }
    ],
    correctOptionId: 'c',
    explanation: 'Tempo de queda: h = ½gt² → 45 = 5t² → t² = 9 → t = 3 s. Alcance horizontal: x = v×t = 10×3 = 30 m.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_cinematica_vetorial_2',
    topicId: 'fis_cinematica_vetorial',
    subject: 'Física',
    prompt: 'Um barco atravessa um rio cuja correnteza tem velocidade de 3 m/s, paralela à margem. O barco se move a 4 m/s em relação à água, na direção perpendicular à margem (atravessando o rio). Qual é o módulo da velocidade resultante do barco em relação à margem?',
    options: [
      { id: 'a', text: '1 m/s' },
      { id: 'b', text: '5 m/s' },
      { id: 'c', text: '7 m/s' },
      { id: 'd', text: '12 m/s' }
    ],
    correctOptionId: 'b',
    explanation: 'As velocidades são perpendiculares entre si (correnteza paralela à margem, barco perpendicular a ela). O módulo da resultante é dado pelo Teorema de Pitágoras: √(3² + 4²) = √25 = 5 m/s.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_cinematica_vetorial_3',
    topicId: 'fis_cinematica_vetorial',
    subject: 'Física',
    prompt: 'Um vetor deslocamento tem componente horizontal de 8 m e componente vertical de 6 m. Qual é o módulo desse vetor deslocamento?',
    options: [
      { id: 'a', text: '8 m' },
      { id: 'b', text: '10 m' },
      { id: 'c', text: '14 m' },
      { id: 'd', text: '48 m' }
    ],
    correctOptionId: 'b',
    explanation: 'O módulo do vetor é dado pela composição das componentes perpendiculares (Teorema de Pitágoras): √(8² + 6²) = √100 = 10 m.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_cinematica_vetorial_4',
    topicId: 'fis_cinematica_vetorial',
    subject: 'Física',
    prompt: 'Um projétil é lançado obliquamente com velocidade inicial de 20 m/s, formando um ângulo de 30° com a horizontal (cos 30° ≈ 0,87). Qual é, aproximadamente, a componente horizontal dessa velocidade inicial?',
    options: [
      { id: 'a', text: '10 m/s' },
      { id: 'b', text: '14 m/s' },
      { id: 'c', text: '17,4 m/s' },
      { id: 'd', text: '20 m/s' }
    ],
    correctOptionId: 'c',
    explanation: 'A componente horizontal é vx = v×cos(θ) = 20×0,87 = 17,4 m/s.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_cinematica_vetorial_5',
    topicId: 'fis_cinematica_vetorial',
    subject: 'Física',
    prompt: 'Um projétil é lançado obliquamente com velocidade inicial de 20 m/s, a 30° acima da horizontal (sen 30° = 0,5). Usando g = 10 m/s², qual é, aproximadamente, o tempo total que o projétil permanece no ar até retornar à mesma altura de lançamento?',
    options: [
      { id: 'a', text: '1 s' },
      { id: 'b', text: '2 s' },
      { id: 'c', text: '4 s' },
      { id: 'd', text: '10 s' }
    ],
    correctOptionId: 'b',
    explanation: 'A componente vertical inicial é vy = v×sen(30°) = 20×0,5 = 10 m/s. O tempo até o ponto mais alto é vy/g = 10/10 = 1 s. Como a subida e a descida (até a mesma altura) são simétricas, o tempo total é o dobro: 2 s.',
    difficulty: 'hard'
  },
  // Física — Gravitação e Movimento Circular
  {
    id: 'q_fis_gravitacao_circular_1',
    topicId: 'fis_gravitacao_circular',
    subject: 'Física',
    prompt: 'Um satélite orbita a Terra a uma altitude constante, em movimento circular uniforme. Se a distância do satélite ao centro da Terra dobrar, o que acontece com a força gravitacional que a Terra exerce sobre ele?',
    options: [
      { id: 'a', text: 'Permanece igual' },
      { id: 'b', text: 'Dobra' },
      { id: 'c', text: 'Reduz à metade' },
      { id: 'd', text: 'Reduz a 1/4' }
    ],
    correctOptionId: 'd',
    explanation: 'A força gravitacional é inversamente proporcional ao quadrado da distância (F ∝ 1/r²). Dobrando a distância, a força se reduz a 1/2² = 1/4 do valor original.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_gravitacao_circular_2',
    topicId: 'fis_gravitacao_circular',
    subject: 'Física',
    prompt: 'Um planeta orbita o Sol a uma distância de 4 UA (unidades astronômicas). Pela Terceira Lei de Kepler (T² ∝ r³, com T em anos terrestres e r em UA), qual é, aproximadamente, o período orbital desse planeta?',
    options: [
      { id: 'a', text: '4 anos' },
      { id: 'b', text: '8 anos' },
      { id: 'c', text: '16 anos' },
      { id: 'd', text: '64 anos' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Terceira Lei de Kepler, T² = r³ (em unidades de anos e UA). Com r=4: T² = 4³ = 64, logo T = 8 anos.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_gravitacao_circular_3',
    topicId: 'fis_gravitacao_circular',
    subject: 'Física',
    prompt: 'Um carro faz uma curva circular de raio 50 m com velocidade constante de 10 m/s. Qual é o módulo da aceleração centrípeta desse carro?',
    options: [
      { id: 'a', text: '0,2 m/s²' },
      { id: 'b', text: '2 m/s²' },
      { id: 'c', text: '5 m/s²' },
      { id: 'd', text: '20 m/s²' }
    ],
    correctOptionId: 'b',
    explanation: 'A aceleração centrípeta é ac = v²/r = 10²/50 = 100/50 = 2 m/s².',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_gravitacao_circular_4',
    topicId: 'fis_gravitacao_circular',
    subject: 'Física',
    prompt: 'Dobrando a velocidade de um corpo em movimento circular uniforme, mantendo o raio da trajetória constante, o que acontece com a aceleração centrípeta?',
    options: [
      { id: 'a', text: 'Dobra' },
      { id: 'b', text: 'Quadruplica' },
      { id: 'c', text: 'Permanece igual' },
      { id: 'd', text: 'Reduz à metade' }
    ],
    correctOptionId: 'b',
    explanation: 'Como ac = v²/r, a aceleração centrípeta é proporcional ao QUADRADO da velocidade. Dobrando v, ac quadruplica.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_gravitacao_circular_5',
    topicId: 'fis_gravitacao_circular',
    subject: 'Física',
    prompt: 'Qual é a principal razão pela qual, em uma órbita circular, mesmo com velocidade escalar constante, dizemos que o satélite está em movimento acelerado?',
    options: [
      { id: 'a', text: 'Porque existe atrito no espaço' },
      { id: 'b', text: 'Porque a direção da velocidade muda constantemente, mesmo com módulo constante' },
      { id: 'c', text: 'Porque o satélite ganha energia cinética constantemente' },
      { id: 'd', text: 'Na verdade, esse movimento não é acelerado' }
    ],
    correctOptionId: 'b',
    explanation: 'Aceleração é a variação do vetor velocidade — não só do seu módulo. Mesmo com módulo constante, a mudança contínua de direção da velocidade no movimento circular já configura uma aceleração (a centrípeta).',
    difficulty: 'medium'
  },
  // Física — Dinâmica Energética e Transformações de Energia
  {
    id: 'q_fis_energia_1',
    topicId: 'fis_energia',
    subject: 'Física',
    prompt: 'Um corpo de massa 2 kg é erguido a uma altura de 5 m. Usando g = 10 m/s², qual é o trabalho realizado contra a gravidade para erguê-lo (assumindo velocidade constante)?',
    options: [
      { id: 'a', text: '10 J' },
      { id: 'b', text: '50 J' },
      { id: 'c', text: '100 J' },
      { id: 'd', text: '200 J' }
    ],
    correctOptionId: 'c',
    explanation: 'W = m×g×h = 2×10×5 = 100 J.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_energia_2',
    topicId: 'fis_energia',
    subject: 'Física',
    prompt: 'Um bloco de massa 2 kg desliza sobre uma superfície horizontal com atrito, partindo com velocidade de 10 m/s e parando após percorrer 20 m. Qual é o trabalho realizado pela força de atrito sobre o bloco?',
    options: [
      { id: 'a', text: '-50 J' },
      { id: 'b', text: '-100 J' },
      { id: 'c', text: '-200 J' },
      { id: 'd', text: '100 J' }
    ],
    correctOptionId: 'b',
    explanation: 'Pelo Teorema Trabalho-Energia, o trabalho da força resultante (aqui, só o atrito) é igual à variação de energia cinética: W = Ec_final - Ec_inicial = 0 - ½×2×10² = -100 J.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_energia_3',
    topicId: 'fis_energia',
    subject: 'Física',
    prompt: 'Uma mola ideal tem constante elástica k = 200 N/m. Qual é a energia potencial elástica armazenada quando ela é comprimida 0,1 m?',
    options: [
      { id: 'a', text: '0,1 J' },
      { id: 'b', text: '1 J' },
      { id: 'c', text: '2 J' },
      { id: 'd', text: '10 J' }
    ],
    correctOptionId: 'b',
    explanation: 'Epe = ½×k×x² = ½×200×0,1² = ½×200×0,01 = 1 J.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_energia_4',
    topicId: 'fis_energia',
    subject: 'Física',
    prompt: 'Um corpo desliza, a partir do repouso, por uma rampa sem atrito de altura 5 m. Usando g = 10 m/s², qual é a velocidade do corpo ao chegar na base da rampa?',
    options: [
      { id: 'a', text: '5 m/s' },
      { id: 'b', text: '7 m/s' },
      { id: 'c', text: '10 m/s' },
      { id: 'd', text: '50 m/s' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela conservação de energia mecânica: mgh = ½mv² → v = √(2gh) = √(2×10×5) = √100 = 10 m/s.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_energia_5',
    topicId: 'fis_energia',
    subject: 'Física',
    prompt: 'Um pêndulo é solto de uma altura de 0,8 m em relação ao ponto mais baixo de sua trajetória, sem atrito. Usando g = 10 m/s², qual é a velocidade do pêndulo ao passar pelo ponto mais baixo?',
    options: [
      { id: 'a', text: '2 m/s' },
      { id: 'b', text: '4 m/s' },
      { id: 'c', text: '8 m/s' },
      { id: 'd', text: '16 m/s' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela conservação de energia mecânica: v = √(2gh) = √(2×10×0,8) = √16 = 4 m/s.',
    difficulty: 'hard'
  },
  // Física — Eletrostática e Campo Elétrico
  {
    id: 'q_fis_eletrostatica_1',
    topicId: 'fis_eletrostatica',
    subject: 'Física',
    prompt: 'Duas cargas puntiformes de +2 μC e +3 μC estão separadas por uma distância de 3 m no vácuo (k ≈ 9×10⁹ N·m²/C²). Qual é, aproximadamente, a força elétrica entre elas?',
    options: [
      { id: 'a', text: '2 mN' },
      { id: 'b', text: '6 mN' },
      { id: 'c', text: '18 mN' },
      { id: 'd', text: '54 mN' }
    ],
    correctOptionId: 'b',
    explanation: 'F = k×q1×q2/r² = 9×10⁹ × 2×10⁻⁶ × 3×10⁻⁶ / 9 = 9×10⁹ × 6×10⁻¹² / 9 = 6×10⁻³ N = 6 mN.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_eletrostatica_2',
    topicId: 'fis_eletrostatica',
    subject: 'Física',
    prompt: 'Se a distância entre duas cargas puntiformes triplicar, mantendo as cargas constantes, o que acontece com a força elétrica entre elas?',
    options: [
      { id: 'a', text: 'Reduz para 1/3' },
      { id: 'b', text: 'Reduz para 1/9' },
      { id: 'c', text: 'Triplica' },
      { id: 'd', text: 'Permanece igual' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Lei de Coulomb, F ∝ 1/r². Triplicando a distância, a força se reduz a 1/3² = 1/9 do valor original.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletrostatica_3',
    topicId: 'fis_eletrostatica',
    subject: 'Física',
    prompt: 'O que caracteriza um campo elétrico uniforme, como o existente entre as placas de um capacitor de placas paralelas?',
    options: [
      { id: 'a', text: 'Linhas de campo paralelas e igualmente espaçadas, com mesma intensidade em todos os pontos' },
      { id: 'b', text: 'Linhas de campo que convergem para um único ponto' },
      { id: 'c', text: 'Campo que varia aleatoriamente de ponto a ponto' },
      { id: 'd', text: 'Ausência total de linhas de campo' }
    ],
    correctOptionId: 'a',
    explanation: 'Um campo elétrico uniforme tem a mesma intensidade e direção em todos os pontos, representado por linhas de campo paralelas e igualmente espaçadas.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletrostatica_4',
    topicId: 'fis_eletrostatica',
    subject: 'Física',
    prompt: 'Um elétron é colocado em um campo elétrico uniforme de intensidade 500 N/C. Sabendo que a carga do elétron é aproximadamente 1,6×10⁻¹⁹ C, qual é o módulo da força elétrica sobre o elétron?',
    options: [
      { id: 'a', text: '8×10⁻¹⁷ N' },
      { id: 'b', text: '8×10⁻¹⁹ N' },
      { id: 'c', text: '3,2×10⁻¹⁶ N' },
      { id: 'd', text: '5×10² N' }
    ],
    correctOptionId: 'a',
    explanation: 'F = q×E = 1,6×10⁻¹⁹ × 500 = 8×10⁻¹⁷ N.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_eletrostatica_5',
    topicId: 'fis_eletrostatica',
    subject: 'Física',
    prompt: 'Duas cargas de sinais opostos são colocadas próximas uma da outra. O que acontece com as linhas de campo elétrico entre elas?',
    options: [
      { id: 'a', text: 'Saem da carga negativa e entram na positiva' },
      { id: 'b', text: 'Saem da carga positiva e entram na negativa' },
      { id: 'c', text: 'São paralelas entre si, sem relação com as cargas' },
      { id: 'd', text: 'Não existem linhas de campo entre cargas de sinais opostos' }
    ],
    correctOptionId: 'b',
    explanation: 'Por convenção, as linhas de campo elétrico sempre saem de cargas positivas e entram em cargas negativas.',
    difficulty: 'medium'
  },
  // Física — Fundamentos de Ondas e Oscilações
  {
    id: 'q_fis_ondas_fundamentos_1',
    topicId: 'fis_ondas_fundamentos',
    subject: 'Física',
    prompt: 'Uma onda tem frequência de 20 Hz. Qual é o seu período?',
    options: [
      { id: 'a', text: '0,05 s' },
      { id: 'b', text: '0,2 s' },
      { id: 'c', text: '5 s' },
      { id: 'd', text: '20 s' }
    ],
    correctOptionId: 'a',
    explanation: 'O período é o inverso da frequência: T = 1/f = 1/20 = 0,05 s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_ondas_fundamentos_2',
    topicId: 'fis_ondas_fundamentos',
    subject: 'Física',
    prompt: 'Uma onda sonora se propaga no ar a 340 m/s e tem frequência de 680 Hz. Qual é o seu comprimento de onda?',
    options: [
      { id: 'a', text: '0,25 m' },
      { id: 'b', text: '0,5 m' },
      { id: 'c', text: '2 m' },
      { id: 'd', text: '1360 m' }
    ],
    correctOptionId: 'b',
    explanation: 'Usando v = f×λ: λ = v/f = 340/680 = 0,5 m.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_ondas_fundamentos_3',
    topicId: 'fis_ondas_fundamentos',
    subject: 'Física',
    prompt: 'O que diferencia uma onda mecânica de uma onda eletromagnética, em termos de necessidade de um meio material para se propagar?',
    options: [
      { id: 'a', text: 'A onda mecânica precisa de meio material; a eletromagnética se propaga até no vácuo' },
      { id: 'b', text: 'As duas precisam de meio material' },
      { id: 'c', text: 'Nenhuma das duas precisa de meio material' },
      { id: 'd', text: 'Apenas a eletromagnética precisa de meio material' }
    ],
    correctOptionId: 'a',
    explanation: 'Ondas mecânicas (como o som) precisam de um meio material (sólido, líquido ou gasoso) para se propagar, enquanto ondas eletromagnéticas (como a luz) se propagam mesmo no vácuo.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_ondas_fundamentos_4',
    topicId: 'fis_ondas_fundamentos',
    subject: 'Física',
    prompt: 'Uma onda transversal tem amplitude de 5 cm. O que representa fisicamente essa amplitude?',
    options: [
      { id: 'a', text: 'A distância entre duas cristas consecutivas' },
      { id: 'b', text: 'O deslocamento máximo de um ponto do meio em relação à posição de equilíbrio' },
      { id: 'c', text: 'A velocidade máxima da onda' },
      { id: 'd', text: 'O número de oscilações por segundo' }
    ],
    correctOptionId: 'b',
    explanation: 'A amplitude é o deslocamento máximo de um ponto do meio em relação à sua posição de equilíbrio (repouso), não devendo ser confundida com o comprimento de onda (distância entre cristas) ou a frequência.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_ondas_fundamentos_5',
    topicId: 'fis_ondas_fundamentos',
    subject: 'Física',
    prompt: 'Duas ondas idênticas se sobrepõem em fase (crista com crista, vale com vale) em um mesmo ponto do meio. Que tipo de interferência ocorre, e o que acontece com a amplitude resultante?',
    options: [
      { id: 'a', text: 'Interferência destrutiva, amplitude reduzida' },
      { id: 'b', text: 'Interferência construtiva, amplitude aumentada (soma das amplitudes)' },
      { id: 'c', text: 'As ondas se cancelam completamente' },
      { id: 'd', text: 'Não há interferência' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando duas ondas se sobrepõem em fase, seus efeitos se somam, resultando em interferência construtiva, com amplitude igual à soma das amplitudes individuais.',
    difficulty: 'hard'
  },
  // Física — Física Moderna
  {
    id: 'q_fis_fisica_moderna_1',
    topicId: 'fis_fisica_moderna',
    subject: 'Física',
    prompt: 'No efeito fotoelétrico, um metal só libera elétrons quando iluminado por luz de frequência igual ou superior a um valor mínimo, chamado frequência de corte. O que acontece se a luz incidente tiver frequência abaixo desse valor, mesmo com intensidade muito alta?',
    options: [
      { id: 'a', text: 'Elétrons são liberados de qualquer forma, com energia menor' },
      { id: 'b', text: 'Nenhum elétron é liberado, independentemente da intensidade da luz' },
      { id: 'c', text: 'O metal derrete' },
      { id: 'd', text: 'A frequência de corte não existe na prática' }
    ],
    correctOptionId: 'b',
    explanation: 'No efeito fotoelétrico, cada fóton precisa ter energia (E=hf) suficiente para arrancar um elétron. Abaixo da frequência de corte, nenhum fóton individual tem energia suficiente, e aumentar apenas a intensidade (mais fótons, não mais energéticos) não resolve isso.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_fisica_moderna_2',
    topicId: 'fis_fisica_moderna',
    subject: 'Física',
    prompt: 'Segundo a equação do efeito fotoelétrico de Einstein, a energia cinética máxima dos elétrons ejetados é dada por Ec = hf - W, onde W é a função trabalho do metal. O que representa fisicamente essa função trabalho W?',
    options: [
      { id: 'a', text: 'A energia mínima necessária para arrancar um elétron do metal' },
      { id: 'b', text: 'A velocidade da luz incidente' },
      { id: 'c', text: 'A frequência da luz incidente' },
      { id: 'd', text: 'A massa do elétron' }
    ],
    correctOptionId: 'a',
    explanation: 'A função trabalho W representa a energia mínima necessária para libertar um elétron da superfície do metal; a energia do fóton (hf) que excede esse valor se converte em energia cinética do elétron ejetado.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_fisica_moderna_3',
    topicId: 'fis_fisica_moderna',
    subject: 'Física',
    prompt: 'Segundo a Teoria da Relatividade Restrita, dois eventos que são simultâneos para um observador podem não ser simultâneos para outro observador em movimento relativo ao primeiro. O que essa ideia contraria, da física clássica (newtoniana)?',
    options: [
      { id: 'a', text: 'A noção de tempo absoluto, igual para todos os observadores' },
      { id: 'b', text: 'A lei da conservação de energia' },
      { id: 'c', text: 'A terceira lei de Newton' },
      { id: 'd', text: 'A lei de Coulomb' }
    ],
    correctOptionId: 'a',
    explanation: 'A física clássica assumia um tempo absoluto e universal. A Relatividade Restrita mostrou que a simultaneidade de eventos depende do referencial do observador, contrariando essa noção clássica.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_fisica_moderna_4',
    topicId: 'fis_fisica_moderna',
    subject: 'Física',
    prompt: 'De acordo com a dualidade onda-partícula, proposta na física quântica, a luz pode se comportar como onda em alguns experimentos (como a difração) e como partícula em outros (como o efeito fotoelétrico). Isso significa que:',
    options: [
      { id: 'a', text: 'A luz é sempre uma onda, e o comportamento de partícula é apenas uma ilusão' },
      { id: 'b', text: 'A luz é sempre uma partícula, e o comportamento de onda é apenas uma ilusão' },
      { id: 'c', text: 'A luz apresenta características tanto de onda quanto de partícula, dependendo do experimento realizado' },
      { id: 'd', text: 'A luz não é nem onda nem partícula, sendo um fenômeno totalmente sem relação com nenhum dos dois' }
    ],
    correctOptionId: 'c',
    explanation: 'A dualidade onda-partícula é um princípio central da física quântica: a luz (e outras entidades quânticas) apresenta comportamentos ondulatórios e corpusculares, cada um evidenciado por tipos diferentes de experimentos.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_fisica_moderna_5',
    topicId: 'fis_fisica_moderna',
    subject: 'Física',
    prompt: 'Segundo a Teoria da Relatividade Restrita, nenhum objeto com massa pode atingir ou ultrapassar a velocidade da luz no vácuo. O que acontece com a energia necessária para acelerar um objeto com massa à medida que sua velocidade se aproxima da velocidade da luz?',
    options: [
      { id: 'a', text: 'Permanece constante' },
      { id: 'b', text: 'Diminui progressivamente' },
      { id: 'c', text: 'Tende ao infinito' },
      { id: 'd', text: 'Torna-se negativa' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela Relatividade Restrita, a energia necessária para continuar acelerando um objeto com massa cresce cada vez mais rápido conforme sua velocidade se aproxima de c, tendendo ao infinito — por isso nenhum objeto com massa pode atingir a velocidade da luz.',
    difficulty: 'hard'
  },
  // Química — Modelos Atômicos e Estrutura do Átomo
  {
    id: 'q_qui_modelos_atomicos_1',
    topicId: 'qui_modelos_atomicos',
    subject: 'Química',
    prompt: 'Um átomo neutro X possui número de massa (A) igual a 40 e número atômico (Z) igual a 18. Quantos nêutrons esse átomo possui?',
    options: [
      { id: 'a', text: '18' },
      { id: 'b', text: '22' },
      { id: 'c', text: '40' },
      { id: 'd', text: '58' }
    ],
    correctOptionId: 'b',
    explanation: 'O número de massa A é a soma de prótons (Z) e nêutrons (n): A = Z + n. Logo, n = A - Z = 40 - 18 = 22 nêutrons.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_modelos_atomicos_2',
    topicId: 'qui_modelos_atomicos',
    subject: 'Química',
    prompt: 'Dois átomos, X e Y, possuem o mesmo número atômico (Z), mas números de massa (A) diferentes. Esses átomos são classificados como:',
    options: [
      { id: 'a', text: 'Isóbaros' },
      { id: 'b', text: 'Isótonos' },
      { id: 'c', text: 'Isótopos' },
      { id: 'd', text: 'Isoeletrônicos' }
    ],
    correctOptionId: 'c',
    explanation: 'Isótopos são átomos do mesmo elemento químico (mesmo Z), portanto com o mesmo número de prótons, mas com números de massa (A) diferentes, o que significa números de nêutrons diferentes.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_modelos_atomicos_3',
    topicId: 'qui_modelos_atomicos',
    subject: 'Química',
    prompt: 'Um átomo perde 3 elétrons e se transforma em um cátion X³⁺ que possui 10 elétrons. Qual é o número atômico (Z) desse elemento?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '10' },
      { id: 'c', text: '13' },
      { id: 'd', text: '16' }
    ],
    correctOptionId: 'c',
    explanation: 'O átomo neutro tinha 10 elétrons + 3 elétrons perdidos = 13 elétrons originalmente. Como um átomo neutro tem número de elétrons igual ao número de prótons (Z), Z = 13.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_modelos_atomicos_4',
    topicId: 'qui_modelos_atomicos',
    subject: 'Química',
    prompt: 'No modelo atômico de Bohr, um elétron emite um fóton de luz quando:',
    options: [
      { id: 'a', text: 'Absorve energia e salta para um nível de energia mais externo (mais afastado do núcleo)' },
      { id: 'b', text: 'Salta de um nível de energia mais externo para um nível mais interno (mais próximo do núcleo)' },
      { id: 'c', text: 'Permanece parado em um mesmo nível de energia, sem qualquer transição' },
      { id: 'd', text: 'É arrancado definitivamente do átomo, tornando-o um cátion' }
    ],
    correctOptionId: 'b',
    explanation: 'No modelo de Bohr, o elétron absorve energia (fóton) para saltar a um nível mais externo (mais energético) e emite um fóton de energia bem definida ao retornar a um nível mais interno (menos energético).',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_modelos_atomicos_5',
    topicId: 'qui_modelos_atomicos',
    subject: 'Química',
    prompt: 'Um átomo tem a distribuição eletrônica em camadas 2-8-8-2. Quantos elétrons esse átomo possui na camada de valência (última camada)?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '8' },
      { id: 'c', text: '18' },
      { id: 'd', text: '20' }
    ],
    correctOptionId: 'a',
    explanation: 'A camada de valência é a última camada eletrônica ocupada. Na distribuição 2-8-8-2, a última camada listada possui 2 elétrons, portanto essa é a quantidade de elétrons de valência.',
    difficulty: 'medium'
  },
  // Química — Radioatividade
  {
    id: 'q_qui_radioatividade_1',
    topicId: 'qui_radioatividade',
    subject: 'Química',
    prompt: 'Ao emitir uma partícula alfa, um núcleo radioativo sofre as seguintes variações em seu número atômico (Z) e número de massa (A):',
    options: [
      { id: 'a', text: 'Z diminui em 2 e A diminui em 4' },
      { id: 'b', text: 'Z aumenta em 1 e A permanece igual' },
      { id: 'c', text: 'Z permanece igual e A diminui em 2' },
      { id: 'd', text: 'Z diminui em 1 e A diminui em 1' }
    ],
    correctOptionId: 'a',
    explanation: 'A partícula alfa é um núcleo de hélio (2 prótons, 2 nêutrons). Ao ser emitida, o núcleo original perde 2 prótons (Z diminui em 2) e 4 unidades de massa no total (A diminui em 4).',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_radioatividade_2',
    topicId: 'qui_radioatividade',
    subject: 'Química',
    prompt: 'Ao emitir uma partícula beta (elétron), um núcleo radioativo sofre a seguinte variação em seu número atômico (Z)?',
    options: [
      { id: 'a', text: 'Z diminui em 1, pois um próton é perdido' },
      { id: 'b', text: 'Z aumenta em 1, pois um nêutron se converte em próton' },
      { id: 'c', text: 'Z permanece exatamente igual' },
      { id: 'd', text: 'Z diminui em 2, como na emissão alfa' }
    ],
    correctOptionId: 'b',
    explanation: 'Na emissão beta, um nêutron do núcleo se transforma em um próton, emitindo um elétron (partícula beta). Como o número de prótons aumenta em 1, Z aumenta em 1, enquanto A permanece o mesmo.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_radioatividade_3',
    topicId: 'qui_radioatividade',
    subject: 'Química',
    prompt: 'Uma amostra radioativa tem massa inicial de 160 g. Sabendo que sua meia-vida é de 5 dias, qual será, aproximadamente, a massa restante dessa amostra após 20 dias?',
    options: [
      { id: 'a', text: '80 g' },
      { id: 'b', text: '40 g' },
      { id: 'c', text: '20 g' },
      { id: 'd', text: '10 g' }
    ],
    correctOptionId: 'd',
    explanation: '20 dias equivalem a 4 meias-vidas (20 ÷ 5). A cada meia-vida a massa cai à metade: 160 → 80 → 40 → 20 → 10 g.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_radioatividade_4',
    topicId: 'qui_radioatividade',
    subject: 'Química',
    prompt: 'O urânio-238 (Z = 92) decai, através de uma série de emissões, até o chumbo-206 (Z = 82), estável. Sabendo que a diferença de número de massa é 32 e que cada partícula alfa emitida reduz A em 4, quantas partículas alfa foram emitidas nessa série de decaimentos?',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '6' },
      { id: 'c', text: '8' },
      { id: 'd', text: '10' }
    ],
    correctOptionId: 'c',
    explanation: 'A diferença de massa é 238 - 206 = 32. Como cada partícula alfa reduz A em 4 unidades, o número de partículas alfa emitidas é 32 ÷ 4 = 8.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_radioatividade_5',
    topicId: 'qui_radioatividade',
    subject: 'Química',
    prompt: 'A principal diferença entre os processos de fissão nuclear e fusão nuclear é que:',
    options: [
      { id: 'a', text: 'Na fissão, um núcleo pesado se divide em núcleos menores; na fusão, núcleos leves se unem para formar um núcleo mais pesado' },
      { id: 'b', text: 'Na fissão, núcleos leves se unem; na fusão, um núcleo pesado se divide' },
      { id: 'c', text: 'Ambos os processos consistem exclusivamente na emissão de partículas alfa' },
      { id: 'd', text: 'Não há qualquer diferença física entre os dois processos' }
    ],
    correctOptionId: 'a',
    explanation: 'Fissão nuclear é a divisão de um núcleo pesado (como urânio) em núcleos menores, liberando energia; fusão nuclear é a união de núcleos leves (como isótopos de hidrogênio) para formar um núcleo mais pesado, também liberando energia (processo que ocorre no Sol).',
    difficulty: 'medium'
  },
  // Química — Gases
  {
    id: 'q_qui_gases_1',
    topicId: 'qui_gases',
    subject: 'Química',
    prompt: 'Mantendo a temperatura constante, se o volume de um gás ideal for reduzido à metade, sua pressão, de acordo com a Lei de Boyle, deve:',
    options: [
      { id: 'a', text: 'Permanecer constante' },
      { id: 'b', text: 'Dobrar' },
      { id: 'c', text: 'Reduzir à metade' },
      { id: 'd', text: 'Quadruplicar' }
    ],
    correctOptionId: 'b',
    explanation: 'A Lei de Boyle estabelece que, a temperatura constante, pressão e volume de um gás são inversamente proporcionais (P₁V₁ = P₂V₂). Reduzindo o volume à metade, a pressão dobra.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_gases_2',
    topicId: 'qui_gases',
    subject: 'Química',
    prompt: 'Um gás ideal ocupa 2,0 L a 27 °C (300 K), sob pressão constante. Qual será seu volume, aproximadamente, se a temperatura for elevada para 600 K, mantendo a pressão constante (Lei de Charles/Gay-Lussac)?',
    options: [
      { id: 'a', text: '1,0 L' },
      { id: 'b', text: '2,0 L' },
      { id: 'c', text: '4,0 L' },
      { id: 'd', text: '6,0 L' }
    ],
    correctOptionId: 'c',
    explanation: 'A pressão constante, V/T é constante (Lei de Charles). Duplicando a temperatura absoluta (300 K → 600 K), o volume também duplica: 2,0 L → 4,0 L.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_gases_3',
    topicId: 'qui_gases',
    subject: 'Química',
    prompt: 'Uma mistura gasosa em um recipiente fechado exerce pressão total de 5 atm. Se o gás A contribui com 3 atm dessa pressão total, qual é a pressão parcial do gás B, supondo que a mistura contenha apenas os gases A e B?',
    options: [
      { id: 'a', text: '2 atm' },
      { id: 'b', text: '3 atm' },
      { id: 'c', text: '5 atm' },
      { id: 'd', text: '8 atm' }
    ],
    correctOptionId: 'a',
    explanation: 'Pela Lei de Dalton das pressões parciais, a soma das pressões parciais é igual à pressão total: P_total = P_A + P_B. Logo, P_B = 5 - 3 = 2 atm.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_gases_4',
    topicId: 'qui_gases',
    subject: 'Química',
    prompt: 'Nas Condições Normais de Temperatura e Pressão (CNTP: 0 °C e 1 atm), 1 mol de qualquer gás ideal ocupa aproximadamente 22,4 L (volume molar). Qual é o volume aproximado ocupado por 2 mol de um gás ideal nessas condições?',
    options: [
      { id: 'a', text: '11,2 L' },
      { id: 'b', text: '22,4 L' },
      { id: 'c', text: '44,8 L' },
      { id: 'd', text: '67,2 L' }
    ],
    correctOptionId: 'c',
    explanation: 'O volume molar nas CNTP é de 22,4 L por mol. Para 2 mol, o volume é diretamente proporcional: 2 × 22,4 = 44,8 L.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_gases_5',
    topicId: 'qui_gases',
    subject: 'Química',
    prompt: 'Um gás ideal, em um recipiente de volume variável, tem tanto sua pressão quanto seu volume aumentados simultaneamente. De acordo com a Equação Geral dos Gases (P₁V₁/T₁ = P₂V₂/T₂), o que deve necessariamente ter ocorrido com a temperatura absoluta do gás?',
    options: [
      { id: 'a', text: 'A temperatura absoluta necessariamente diminuiu' },
      { id: 'b', text: 'A temperatura absoluta necessariamente aumentou' },
      { id: 'c', text: 'A temperatura absoluta permaneceu necessariamente constante' },
      { id: 'd', text: 'Não é possível dizer nada sobre a temperatura sem valores numéricos' }
    ],
    correctOptionId: 'b',
    explanation: 'Como P e V aumentaram simultaneamente, o produto PV aumentou. Pela Equação Geral dos Gases, PV/T é constante quando n é fixo, então se PV aumentou, T também deve ter aumentado para manter a proporção.',
    difficulty: 'hard'
  },
  // Química — Química Inorgânica
  {
    id: 'q_qui_inorganica_1',
    topicId: 'qui_inorganica',
    subject: 'Química',
    prompt: 'O ácido HNO₃, muito usado na indústria e conhecido por sua alta capacidade oxidante, é corretamente nomeado como:',
    options: [
      { id: 'a', text: 'Ácido nitroso' },
      { id: 'b', text: 'Ácido nítrico' },
      { id: 'c', text: 'Ácido nitrídrico' },
      { id: 'd', text: 'Ácido nitroso hídrico' }
    ],
    correctOptionId: 'b',
    explanation: 'O HNO₃ é o ácido nítrico (nitrogênio no seu maior Nox comum, +5, entre os oxiácidos de nitrogênio); o ácido nitroso é o HNO₂, com nitrogênio em Nox +3.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_inorganica_2',
    topicId: 'qui_inorganica',
    subject: 'Química',
    prompt: 'Uma solução aquosa de hidróxido de sódio (NaOH), uma base forte, apresenta pH:',
    options: [
      { id: 'a', text: 'Igual a 7' },
      { id: 'b', text: 'Menor que 7' },
      { id: 'c', text: 'Maior que 7' },
      { id: 'd', text: 'Sempre igual a 14, independentemente da concentração' }
    ],
    correctOptionId: 'c',
    explanation: 'Bases, ao se dissociarem em água, liberam OH⁻, tornando a solução básica, com pH maior que 7 (o valor exato depende da concentração, mas nunca é igual nem menor que 7 para uma base forte em solução).',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_inorganica_3',
    topicId: 'qui_inorganica',
    subject: 'Química',
    prompt: 'Na reação de neutralização entre ácido clorídrico (HCl) e hidróxido de sódio (NaOH), os produtos formados são:',
    options: [
      { id: 'a', text: 'NaCl e H₂O' },
      { id: 'b', text: 'NaCl e H₂' },
      { id: 'c', text: 'Na₂O e HCl' },
      { id: 'd', text: 'NaOH e HCl, sem reação' }
    ],
    correctOptionId: 'a',
    explanation: 'HCl + NaOH → NaCl + H₂O. A reação entre um ácido e uma base forma um sal (NaCl) e água, típica de uma neutralização.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_inorganica_4',
    topicId: 'qui_inorganica',
    subject: 'Química',
    prompt: 'O óxido de sódio (Na₂O), ao reagir com água, forma NaOH, uma base. Esse óxido é classificado como um óxido:',
    options: [
      { id: 'a', text: 'Ácido' },
      { id: 'b', text: 'Básico' },
      { id: 'c', text: 'Neutro' },
      { id: 'd', text: 'Anfótero' }
    ],
    correctOptionId: 'b',
    explanation: 'Óxidos de metais alcalinos e alcalino-terrosos, como o Na₂O, reagem com água formando bases (hidróxidos), sendo por isso classificados como óxidos básicos.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_inorganica_5',
    topicId: 'qui_inorganica',
    subject: 'Química',
    prompt: 'O sulfato de alumínio, sal amplamente usado no tratamento de água, é formado pelo cátion Al³⁺ e pelo ânion SO₄²⁻. Qual é a fórmula molecular correta desse sal?',
    options: [
      { id: 'a', text: 'AlSO₄' },
      { id: 'b', text: 'Al₂(SO₄)₃' },
      { id: 'c', text: 'Al₃(SO₄)₂' },
      { id: 'd', text: 'Al(SO₄)₃' }
    ],
    correctOptionId: 'b',
    explanation: 'Para neutralizar as cargas, é preciso igualar 3+ e 2-: o mínimo múltiplo comum é 6, exigindo 2 cátions Al³⁺ (2×3=6) e 3 ânions SO₄²⁻ (3×2=6), resultando em Al₂(SO₄)₃.',
    difficulty: 'medium'
  },
  // Química — Oxirredução
  {
    id: 'q_qui_oxirreducao_1',
    topicId: 'qui_oxirreducao',
    subject: 'Química',
    prompt: 'Qual é o número de oxidação (Nox) do manganês (Mn) no íon permanganato (MnO₄⁻)?',
    options: [
      { id: 'a', text: '+2' },
      { id: 'b', text: '+4' },
      { id: 'c', text: '+6' },
      { id: 'd', text: '+7' }
    ],
    correctOptionId: 'd',
    explanation: 'Cada oxigênio tem Nox -2, totalizando -8 para os 4 átomos. Como a carga total do íon é -1: Nox(Mn) + (-8) = -1, logo Nox(Mn) = +7.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_oxirreducao_2',
    topicId: 'qui_oxirreducao',
    subject: 'Química',
    prompt: 'Na reação 2Fe + 3Cl₂ → 2FeCl₃, o ferro (Fe) sofre oxidação, saindo de Nox 0 para +3, enquanto o cloro sofre redução, saindo de Nox 0 para -1. Nessa reação, o cloro (Cl₂) atua como o:',
    options: [
      { id: 'a', text: 'Agente redutor, pois perde elétrons' },
      { id: 'b', text: 'Agente oxidante, pois ganha elétrons e provoca a oxidação do ferro' },
      { id: 'c', text: 'Catalisador da reação' },
      { id: 'd', text: 'Produto final da reação, sem papel na transferência de elétrons' }
    ],
    correctOptionId: 'b',
    explanation: 'O Cl₂ ganha elétrons (é reduzido, de 0 para -1) e, ao fazê-lo, provoca a oxidação do ferro — por isso é chamado de agente oxidante. O ferro, que perde elétrons, é o agente redutor.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_oxirreducao_3',
    topicId: 'qui_oxirreducao',
    subject: 'Química',
    prompt: 'Em uma reação de oxirredução, o agente oxidante é a espécie que:',
    options: [
      { id: 'a', text: 'Perde elétrons e sofre oxidação' },
      { id: 'b', text: 'Ganha elétrons e provoca a oxidação de outra espécie, sendo ela mesma reduzida' },
      { id: 'c', text: 'Não participa da transferência de elétrons' },
      { id: 'd', text: 'Sempre é um elemento no estado gasoso' }
    ],
    correctOptionId: 'b',
    explanation: 'O agente oxidante é a espécie que ganha elétrons (sofre redução), causando a oxidação de outra espécie na reação. O agente redutor, por sua vez, perde elétrons e sofre oxidação.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_oxirreducao_4',
    topicId: 'qui_oxirreducao',
    subject: 'Química',
    prompt: 'Um íon Fe²⁺ se transforma em Fe³⁺ em uma reação de oxirredução. Quantos elétrons esse íon perdeu nesse processo?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5' }
    ],
    correctOptionId: 'a',
    explanation: 'A variação de carga foi de +2 para +3, um aumento de 1 unidade positiva, o que corresponde à perda de exatamente 1 elétron.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_oxirreducao_5',
    topicId: 'qui_oxirreducao',
    subject: 'Química',
    prompt: 'Qual é o número de oxidação (Nox) do enxofre (S) na molécula de ácido sulfúrico (H₂SO₄)?',
    options: [
      { id: 'a', text: '+2' },
      { id: 'b', text: '+4' },
      { id: 'c', text: '+6' },
      { id: 'd', text: '-2' }
    ],
    correctOptionId: 'c',
    explanation: 'O hidrogênio tem Nox +1 (total +2) e cada oxigênio tem Nox -2 (total -8). Como a molécula é neutra: 2(+1) + Nox(S) + 4(-2) = 0 → Nox(S) = +6.',
    difficulty: 'medium'
  },
  // Química — Termoquímica
  {
    id: 'q_qui_termoquimica_1',
    topicId: 'qui_termoquimica',
    subject: 'Química',
    prompt: 'Uma reação química que libera calor para o ambiente, com variação de entalpia (ΔH) negativa, é classificada como:',
    options: [
      { id: 'a', text: 'Endotérmica' },
      { id: 'b', text: 'Exotérmica' },
      { id: 'c', text: 'Isotérmica' },
      { id: 'd', text: 'Adiabática' }
    ],
    correctOptionId: 'b',
    explanation: 'Reações exotérmicas liberam calor para o ambiente e têm ΔH negativo; reações endotérmicas absorvem calor e têm ΔH positivo.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_termoquimica_2',
    topicId: 'qui_termoquimica',
    subject: 'Química',
    prompt: 'A combustão completa de 1 mol de carbono grafite libera 394 kJ de energia (ΔH = -394 kJ/mol). Quanta energia é liberada na combustão completa de 2 mol de carbono grafite, nas mesmas condições?',
    options: [
      { id: 'a', text: '197 kJ' },
      { id: 'b', text: '394 kJ' },
      { id: 'c', text: '788 kJ' },
      { id: 'd', text: '1182 kJ' }
    ],
    correctOptionId: 'c',
    explanation: 'A entalpia de reação é uma grandeza extensiva, proporcional à quantidade de matéria. Para 2 mol, a energia liberada dobra: 2 × 394 = 788 kJ.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_termoquimica_3',
    topicId: 'qui_termoquimica',
    subject: 'Química',
    prompt: 'Considere as reações: A → B, com ΔH = -50 kJ/mol; e B → C, com ΔH = +30 kJ/mol. Qual é a variação de entalpia da reação global A → C, de acordo com a Lei de Hess?',
    options: [
      { id: 'a', text: '-80 kJ/mol' },
      { id: 'b', text: '-20 kJ/mol' },
      { id: 'c', text: '+20 kJ/mol' },
      { id: 'd', text: '+80 kJ/mol' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela Lei de Hess, a variação de entalpia da reação global é a soma algébrica das variações das etapas intermediárias, desde que elas se somem à reação total: -50 + 30 = -20 kJ/mol.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_termoquimica_4',
    topicId: 'qui_termoquimica',
    subject: 'Química',
    prompt: 'A entalpia padrão de formação (ΔHf°) de uma substância é definida como a variação de entalpia associada à:',
    options: [
      { id: 'a', text: 'Combustão completa de 1 mol da substância' },
      { id: 'b', text: 'Formação de 1 mol da substância a partir de seus elementos constituintes, no estado padrão' },
      { id: 'c', text: 'Decomposição total de 1 mol da substância em seus átomos isolados' },
      { id: 'd', text: 'Mudança de estado físico de 1 mol da substância, sem reação química' }
    ],
    correctOptionId: 'b',
    explanation: 'A entalpia padrão de formação é a variação de entalpia da reação de formação de 1 mol de uma substância a partir de seus elementos no estado padrão (forma mais estável, 25 °C e 1 atm).',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_termoquimica_5',
    topicId: 'qui_termoquimica',
    subject: 'Química',
    prompt: 'Uma reação exotérmica tem energia de ativação direta (Ea direta) igual a 60 kJ/mol e ΔH igual a -50 kJ/mol. Qual é, aproximadamente, a energia de ativação da reação inversa (Ea inversa)?',
    options: [
      { id: 'a', text: '10 kJ/mol' },
      { id: 'b', text: '50 kJ/mol' },
      { id: 'c', text: '60 kJ/mol' },
      { id: 'd', text: '110 kJ/mol' }
    ],
    correctOptionId: 'd',
    explanation: 'A energia de ativação da reação inversa é igual à energia de ativação direta menos o ΔH da reação: Ea_inversa = Ea_direta - ΔH = 60 - (-50) = 110 kJ/mol.',
    difficulty: 'hard'
  },
  // Química — Cinética Química
  {
    id: 'q_qui_cinetica_1',
    topicId: 'qui_cinetica',
    subject: 'Química',
    prompt: 'Em um experimento, quando a concentração de um reagente A é duplicada (mantendo os demais constantes), a velocidade da reação quadruplica. Qual é a ordem da reação em relação ao reagente A?',
    options: [
      { id: 'a', text: 'Ordem 0' },
      { id: 'b', text: 'Ordem 1' },
      { id: 'c', text: 'Ordem 2' },
      { id: 'd', text: 'Ordem 4' }
    ],
    correctOptionId: 'c',
    explanation: 'Se v = k[A]ⁿ, duplicar [A] e quadruplicar v significa que 2ⁿ = 4, logo n = 2. A reação é de segunda ordem em relação a A.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_cinetica_2',
    topicId: 'qui_cinetica',
    subject: 'Química',
    prompt: 'Em um experimento, quando a concentração de um reagente B é duplicada (mantendo os demais constantes), a velocidade da reação também duplica. Qual é a ordem da reação em relação ao reagente B?',
    options: [
      { id: 'a', text: 'Ordem 0' },
      { id: 'b', text: 'Ordem 1' },
      { id: 'c', text: 'Ordem 2' },
      { id: 'd', text: 'Ordem 3' }
    ],
    correctOptionId: 'b',
    explanation: 'Se v = k[B]ⁿ, duplicar [B] e duplicar v significa que 2ⁿ = 2, logo n = 1. A reação é de primeira ordem em relação a B.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_cinetica_3',
    topicId: 'qui_cinetica',
    subject: 'Química',
    prompt: 'A energia de ativação de uma reação química corresponde à:',
    options: [
      { id: 'a', text: 'Energia total liberada na reação' },
      { id: 'b', text: 'Energia mínima necessária para que uma colisão entre reagentes resulte em reação' },
      { id: 'c', text: 'Diferença entre as entalpias dos produtos e dos reagentes' },
      { id: 'd', text: 'Energia armazenada exclusivamente nos produtos da reação' }
    ],
    correctOptionId: 'b',
    explanation: 'A energia de ativação é a energia mínima que as partículas reagentes precisam ter, no momento da colisão, para que essa colisão seja efetiva e resulte na formação dos produtos.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_cinetica_4',
    topicId: 'qui_cinetica',
    subject: 'Química',
    prompt: 'Um catalisador heterogêneo (sólido) atua sobre reagentes em fase gasosa ou líquida. Triturar esse catalisador sólido, aumentando sua superfície de contato, tem como efeito principal:',
    options: [
      { id: 'a', text: 'Diminuir a velocidade da reação, pois reduz a estabilidade do catalisador' },
      { id: 'b', text: 'Aumentar a velocidade da reação, pois amplia a área de contato disponível para as colisões efetivas' },
      { id: 'c', text: 'Não ter qualquer efeito sobre a velocidade da reação' },
      { id: 'd', text: 'Alterar permanentemente o produto final da reação' }
    ],
    correctOptionId: 'b',
    explanation: 'Em catálise heterogênea, a reação ocorre na superfície do catalisador sólido. Aumentar a área de superfície (triturando o sólido) aumenta o número de sítios ativos disponíveis, acelerando a reação.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_cinetica_5',
    topicId: 'qui_cinetica',
    subject: 'Química',
    prompt: 'Segundo a Teoria das Colisões, para que uma colisão entre moléculas reagentes resulte efetivamente em reação química, são necessárias duas condições simultâneas:',
    options: [
      { id: 'a', text: 'Temperatura baixa e concentração alta' },
      { id: 'b', text: 'Orientação geométrica adequada e energia igual ou superior à energia de ativação' },
      { id: 'c', text: 'Presença obrigatória de um catalisador e ausência de luz' },
      { id: 'd', text: 'Pressão constante e volume constante' }
    ],
    correctOptionId: 'b',
    explanation: 'A Teoria das Colisões estabelece que uma colisão só é efetiva (leva à formação de produtos) se as moléculas colidirem com orientação geométrica favorável e com energia cinética igual ou superior à energia de ativação da reação.',
    difficulty: 'medium'
  },
  // Química — Eletroquímica
  {
    id: 'q_qui_eletroquimica_1',
    topicId: 'qui_eletroquimica',
    subject: 'Química',
    prompt: 'Na pilha de Daniell, formada por eletrodos de zinco e cobre, o zinco (Zn) sofre oxidação e o cobre (Cu²⁺) sofre redução. Nessa pilha, o eletrodo de zinco é o:',
    options: [
      { id: 'a', text: 'Cátodo, pois é onde ocorre a redução' },
      { id: 'b', text: 'Ânodo, pois é onde ocorre a oxidação' },
      { id: 'c', text: 'Eletrólito da pilha' },
      { id: 'd', text: 'Ponte salina da pilha' }
    ],
    correctOptionId: 'b',
    explanation: 'Em uma pilha (célula galvânica), a oxidação ocorre no ânodo (o zinco, que perde elétrons) e a redução ocorre no cátodo (o cobre, que ganha elétrons).',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_eletroquimica_2',
    topicId: 'qui_eletroquimica',
    subject: 'Química',
    prompt: 'Na pilha de Daniell, o potencial padrão de redução do Cu²⁺/Cu é +0,34 V e o do Zn²⁺/Zn é -0,76 V. Qual é o valor aproximado da diferença de potencial (ddp) dessa pilha?',
    options: [
      { id: 'a', text: '0,42 V' },
      { id: 'b', text: '0,76 V' },
      { id: 'c', text: '1,10 V' },
      { id: 'd', text: '1,44 V' }
    ],
    correctOptionId: 'c',
    explanation: 'A ddp da pilha é a diferença entre o potencial de redução do cátodo (maior, +0,34 V) e o do ânodo (menor, -0,76 V): E = 0,34 - (-0,76) = 1,10 V.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_eletroquimica_3',
    topicId: 'qui_eletroquimica',
    subject: 'Química',
    prompt: 'Na eletrólise aquosa de cloreto de sódio (salmoura), um dos produtos formados no cátodo, a partir da redução da água, é:',
    options: [
      { id: 'a', text: 'Gás cloro (Cl₂)' },
      { id: 'b', text: 'Gás hidrogênio (H₂)' },
      { id: 'c', text: 'Sódio metálico (Na)' },
      { id: 'd', text: 'Gás oxigênio (O₂)' }
    ],
    correctOptionId: 'b',
    explanation: 'Na eletrólise aquosa de NaCl, o cátodo reduz preferencialmente a água (não o Na⁺, mais difícil de reduzir), liberando gás hidrogênio (H₂) e íons OH⁻; o cloro (Cl₂) se forma no ânodo.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_eletroquimica_4',
    topicId: 'qui_eletroquimica',
    subject: 'Química',
    prompt: 'Em uma pilha (célula galvânica), o ânodo é o polo negativo. Já em uma célula eletrolítica (eletrólise), o ânodo é o polo:',
    options: [
      { id: 'a', text: 'Negativo, exatamente como na pilha' },
      { id: 'b', text: 'Positivo, pois está ligado ao polo positivo da fonte externa de energia' },
      { id: 'c', text: 'Neutro, sem polaridade definida' },
      { id: 'd', text: 'Indefinido, pois eletrólise não possui ânodo' }
    ],
    correctOptionId: 'b',
    explanation: 'Na eletrólise, a fonte externa de energia impõe a polaridade: o ânodo (onde ocorre oxidação) é conectado ao polo positivo da fonte, invertendo a convenção de sinal em relação à pilha, embora em ambos os casos a oxidação ocorra no ânodo.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_eletroquimica_5',
    topicId: 'qui_eletroquimica',
    subject: 'Química',
    prompt: 'A corrosão do ferro (formação de ferrugem) é um processo espontâneo de oxidação do ferro metálico em contato com oxigênio e umidade. Esse fenômeno pode ser entendido, do ponto de vista eletroquímico, como análogo ao funcionamento de:',
    options: [
      { id: 'a', text: 'Uma célula eletrolítica, pois exige energia elétrica externa' },
      { id: 'b', text: 'Uma pilha (célula galvânica), pois é um processo espontâneo de oxirredução' },
      { id: 'c', text: 'Uma reação de neutralização ácido-base' },
      { id: 'd', text: 'Um processo puramente físico, sem transferência de elétrons' }
    ],
    correctOptionId: 'b',
    explanation: 'A corrosão do ferro é um processo espontâneo de oxirredução (o ferro se oxida, o oxigênio se reduz), assim como ocorre em uma pilha — por isso é frequentemente descrita como uma "pilha de corrosão" em miniatura na superfície do metal.',
    difficulty: 'medium'
  },
  // Química — Equilíbrio Químico
  {
    id: 'q_qui_equilibrio_1',
    topicId: 'qui_equilibrio',
    subject: 'Química',
    prompt: 'Em uma reação reversível em equilíbrio, um valor de constante de equilíbrio (Kc) muito maior que 1 indica que, no equilíbrio:',
    options: [
      { id: 'a', text: 'Praticamente só existem reagentes' },
      { id: 'b', text: 'Reagentes e produtos estão em quantidades exatamente iguais' },
      { id: 'c', text: 'A concentração de produtos é predominante em relação à de reagentes' },
      { id: 'd', text: 'A reação não atingiu de fato o equilíbrio' }
    ],
    correctOptionId: 'c',
    explanation: 'Como Kc é a razão entre as concentrações dos produtos e dos reagentes (elevadas aos coeficientes estequiométricos), um Kc >> 1 indica que, no equilíbrio, a concentração de produtos é muito maior que a de reagentes.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_equilibrio_2',
    topicId: 'qui_equilibrio',
    subject: 'Química',
    prompt: 'A síntese de amônia, N₂(g) + 3H₂(g) ⇌ 2NH₃(g), é uma reação exotérmica (ΔH < 0). De acordo com o Princípio de Le Chatelier, aumentar a temperatura desse sistema em equilíbrio favorece o deslocamento no sentido:',
    options: [
      { id: 'a', text: 'Direto, formando mais NH₃' },
      { id: 'b', text: 'Inverso, consumindo NH₃ e formando mais N₂ e H₂' },
      { id: 'c', text: 'Nenhum, a temperatura não afeta o equilíbrio dessa reação' },
      { id: 'd', text: 'Direto, mas apenas se a pressão também for reduzida' }
    ],
    correctOptionId: 'b',
    explanation: 'Em uma reação exotérmica, o calor pode ser tratado como um "produto". Aumentar a temperatura desloca o equilíbrio no sentido endotérmico (inverso), consumindo o produto NH₃ e regenerando os reagentes N₂ e H₂.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_equilibrio_3',
    topicId: 'qui_equilibrio',
    subject: 'Química',
    prompt: 'Diferentemente de outras perturbações (como mudança de concentração ou pressão), uma mudança de temperatura em um sistema em equilíbrio químico tem um efeito único, que é:',
    options: [
      { id: 'a', text: 'Deslocar o equilíbrio sem alterar o valor da constante de equilíbrio (Kc)' },
      { id: 'b', text: 'Alterar o próprio valor numérico da constante de equilíbrio (Kc)' },
      { id: 'c', text: 'Nunca deslocar o equilíbrio, apenas acelerar a reação' },
      { id: 'd', text: 'Impedir que o sistema atinja o equilíbrio' }
    ],
    correctOptionId: 'b',
    explanation: 'Mudanças de concentração, pressão ou volume deslocam o equilíbrio mas mantêm Kc constante (a uma dada temperatura). Já a temperatura é a única perturbação que efetivamente altera o valor numérico de Kc.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_equilibrio_4',
    topicId: 'qui_equilibrio',
    subject: 'Química',
    prompt: 'Em um sistema gasoso em equilíbrio, a volume constante, a adição de um gás inerte (que não participa da reação, como o argônio) tem como efeito sobre a posição do equilíbrio:',
    options: [
      { id: 'a', text: 'Deslocar o equilíbrio para o lado com maior número de mols' },
      { id: 'b', text: 'Deslocar o equilíbrio para o lado com menor número de mols' },
      { id: 'c', text: 'Não deslocar o equilíbrio, pois as pressões parciais dos reagentes e produtos não se alteram' },
      { id: 'd', text: 'Deslocar totalmente o equilíbrio para os produtos, independentemente da reação' }
    ],
    correctOptionId: 'c',
    explanation: 'A volume constante, adicionar um gás inerte aumenta a pressão total, mas não altera as concentrações (pressões parciais) dos reagentes e produtos já presentes, portanto o equilíbrio não se desloca.',
    difficulty: 'hard'
  },
  {
    id: 'q_qui_equilibrio_5',
    topicId: 'qui_equilibrio',
    subject: 'Química',
    prompt: 'Para a reação em equilíbrio 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), qual é a expressão correta da constante de equilíbrio Kc?',
    options: [
      { id: 'a', text: 'Kc = [SO₃]² / ([SO₂]²·[O₂])' },
      { id: 'b', text: 'Kc = [SO₂]²·[O₂] / [SO₃]²' },
      { id: 'c', text: 'Kc = [SO₃] / ([SO₂]·[O₂])' },
      { id: 'd', text: 'Kc = [SO₂]·[O₂] / [SO₃]' }
    ],
    correctOptionId: 'a',
    explanation: 'A constante de equilíbrio é a razão entre as concentrações dos produtos e dos reagentes, cada uma elevada ao seu coeficiente estequiométrico: Kc = [SO₃]² / ([SO₂]²·[O₂]).',
    difficulty: 'medium'
  },
  // Português — Domínio da Norma Culta
  {
    id: 'q_por_norma_culta_1',
    topicId: 'por_norma_culta',
    subject: 'Português',
    prompt: 'Assinale a alternativa que respeita a concordância verbal segundo a norma-padrão:',
    options: [
      { id: 'a', text: 'Fazem dois anos que não nos vemos.' },
      { id: 'b', text: 'Faz dois anos que não nos vemos.' },
      { id: 'c', text: 'Houveram muitos candidatos na prova.' },
      { id: 'd', text: 'Deveram haver mais vagas.' }
    ],
    correctOptionId: 'b',
    explanation: 'O verbo "fazer" indicando tempo decorrido é impessoal e permanece na 3ª pessoa do singular ("faz dois anos"). O verbo "haver" no sentido de existir também é impessoal e singular ("houve muitos candidatos"), tornando "c" e "d" incorretas.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_norma_culta_2',
    topicId: 'por_norma_culta',
    subject: 'Português',
    prompt: 'Assinale a alternativa em que o uso do acento indicativo de crase está correto:',
    options: [
      { id: 'a', text: 'Ela foi à pé até a escola.' },
      { id: 'b', text: 'Entreguei o documento à ela pessoalmente.' },
      { id: 'c', text: 'Cheguei à escola antes das oito horas.' },
      { id: 'd', text: 'Refiro-me à você, não à ele.' }
    ],
    correctOptionId: 'c',
    explanation: 'A crase é a fusão da preposição "a" com o artigo feminino "a". "À escola" está correto, pois "escola" é substantivo feminino que admite artigo. "A pé" não leva crase (locução adverbial masculina); pronomes como "ela", "você" e "ele" não admitem artigo antes deles, logo não recebem crase.',
    difficulty: 'medium'
  },
  // Português — Análise Sintática
  {
    id: 'q_por_sintaxe_1',
    topicId: 'por_sintaxe',
    subject: 'Português',
    prompt: 'Na frase "O aluno estudou a matéria com dedicação", o termo "a matéria" exerce a função sintática de:',
    options: [
      { id: 'a', text: 'Sujeito' },
      { id: 'b', text: 'Objeto direto' },
      { id: 'c', text: 'Objeto indireto' },
      { id: 'd', text: 'Adjunto adverbial' }
    ],
    correctOptionId: 'b',
    explanation: '"Estudou o quê? A matéria" — como o verbo "estudar" é transitivo direto (não exige preposição obrigatória para seu complemento), "a matéria" é o objeto direto da oração.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_sintaxe_2',
    topicId: 'por_sintaxe',
    subject: 'Português',
    prompt: 'Na frase "Os candidatos, apesar do cansaço, mantiveram a concentração até o fim da prova", o termo "apesar do cansaço" exerce a função de:',
    options: [
      { id: 'a', text: 'Sujeito' },
      { id: 'b', text: 'Predicativo do sujeito' },
      { id: 'c', text: 'Adjunto adverbial de concessão' },
      { id: 'd', text: 'Complemento nominal' }
    ],
    correctOptionId: 'c',
    explanation: '"Apesar do cansaço" expressa uma ideia de concessão, contrastando com o resultado apresentado na oração principal — classifica-se como adjunto adverbial de concessão, tipicamente introduzido por locuções como "apesar de", "embora" e "ainda que".',
    difficulty: 'medium'
  },
  // Português — Entendimento de Texto
  {
    id: 'q_por_texto_1',
    topicId: 'por_texto',
    subject: 'Português',
    prompt: 'Em um texto, a ideia central defendida pelo autor, à qual os demais argumentos se articulam, é chamada de:',
    options: [
      { id: 'a', text: 'Repertório sociocultural' },
      { id: 'b', text: 'Tese' },
      { id: 'c', text: 'Conectivo' },
      { id: 'd', text: 'Coesão referencial' }
    ],
    correctOptionId: 'b',
    explanation: 'A tese é a ideia central defendida pelo autor em um texto dissertativo-argumentativo; os argumentos desenvolvidos ao longo do texto devem sustentar e se articular a essa tese.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_texto_2',
    topicId: 'por_texto',
    subject: 'Português',
    prompt: 'Quando um texto utiliza a expressão "por outro lado" para introduzir uma nova informação, ele está sinalizando, em termos de coesão textual, uma relação de:',
    options: [
      { id: 'a', text: 'Causa e consequência' },
      { id: 'b', text: 'Adição pura, sem qualquer contraste' },
      { id: 'c', text: 'Oposição ou contraste em relação à ideia anterior' },
      { id: 'd', text: 'Conclusão final do texto' }
    ],
    correctOptionId: 'c',
    explanation: '"Por outro lado" é um conectivo que introduz contraste ou oposição entre ideias, ajudando a organizar a argumentação e sinalizar mudanças de perspectiva dentro do texto.',
    difficulty: 'medium'
  },
  // Português — Literatura Clássica, Medieval e Barroca
  {
    id: 'q_por_lit_classica_barroca_1',
    topicId: 'por_lit_classica_barroca',
    subject: 'Português',
    prompt: 'O Barroco, movimento literário marcado pelo conflito entre valores religiosos e terrenos (fé x razão, espírito x matéria), teve como uma de suas principais características estilísticas o uso do:',
    options: [
      { id: 'a', text: 'Uso de frases extremamente simples e diretas, sem figuras de linguagem' },
      { id: 'b', text: 'Cultismo (jogo de palavras, metáforas rebuscadas) e do conceptismo (jogo de ideias, argumentação lógica)' },
      { id: 'c', text: 'Uma linguagem exclusivamente coloquial e popular' },
      { id: 'd', text: 'Temas exclusivamente voltados à vida cotidiana urbana moderna' }
    ],
    correctOptionId: 'b',
    explanation: 'O Barroco é marcado pelo conflito entre opostos (fé/razão, espírito/matéria) e, estilisticamente, pelo cultismo (ornamentação formal, jogo de palavras) e pelo conceptismo (argumentação elaborada, jogo de ideias).',
    difficulty: 'easy'
  },
  {
    id: 'q_por_lit_classica_barroca_2',
    topicId: 'por_lit_classica_barroca',
    subject: 'Português',
    prompt: 'No Brasil colonial, o principal representante do Barroco, conhecido por seus poemas satíricos e religiosos, foi:',
    options: [
      { id: 'a', text: 'Gregório de Matos' },
      { id: 'b', text: 'Machado de Assis' },
      { id: 'c', text: 'José de Alencar' },
      { id: 'd', text: 'Castro Alves' }
    ],
    correctOptionId: 'a',
    explanation: 'Gregório de Matos, conhecido como "Boca do Inferno", é o principal poeta do Barroco brasileiro, autor de poemas satíricos, religiosos e líricos na Bahia colonial.',
    difficulty: 'medium'
  },
  // Português — Romantismo e Realismo
  {
    id: 'q_por_lit_romantismo_realismo_1',
    topicId: 'por_lit_romantismo_realismo',
    subject: 'Português',
    prompt: 'O Romantismo, movimento literário do século XIX, caracterizou-se, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'Uma valorização da razão e da objetividade científica acima de tudo' },
      { id: 'b', text: 'A exaltação do sentimentalismo, da subjetividade, do nacionalismo e, muitas vezes, da idealização (do amor, da natureza, do índio)' },
      { id: 'c', text: 'Uma crítica social objetiva e desapaixonada da realidade' },
      { id: 'd', text: 'O abandono completo de qualquer tema nacional' }
    ],
    correctOptionId: 'b',
    explanation: 'O Romantismo é marcado pelo predomínio da emoção e da subjetividade, pelo nacionalismo e, frequentemente, pela idealização — como no indianismo de José de Alencar.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_lit_romantismo_realismo_2',
    topicId: 'por_lit_romantismo_realismo',
    subject: 'Português',
    prompt: 'O Realismo, que sucedeu o Romantismo no Brasil e teve em Machado de Assis um de seus principais expoentes, caracteriza-se, em contraste com o Romantismo, por:',
    options: [
      { id: 'a', text: 'Uma idealização excessiva dos personagens e das relações amorosas' },
      { id: 'b', text: 'Uma análise crítica e objetiva da sociedade e da psicologia humana, com personagens mais complexos e ambíguos' },
      { id: 'c', text: 'O abandono total da prosa em favor exclusivo da poesia' },
      { id: 'd', text: 'A exaltação ingênua dos sentimentos, sem qualquer crítica social' }
    ],
    correctOptionId: 'b',
    explanation: 'O Realismo reage contra a idealização romântica, propondo uma análise mais crítica e objetiva da sociedade e da psicologia dos personagens — como em Dom Casmurro, de Machado de Assis.',
    difficulty: 'medium'
  },
  // Português — Simbolismo, Pré-Modernismo e Modernismo
  {
    id: 'q_por_lit_modernismo_1',
    topicId: 'por_lit_modernismo',
    subject: 'Português',
    prompt: 'A Semana de Arte Moderna de 1922, em São Paulo, é considerada um marco histórico porque:',
    options: [
      { id: 'a', text: 'Consolidou o Romantismo como movimento oficial no Brasil' },
      { id: 'b', text: 'Inaugurou o Modernismo brasileiro, propondo a ruptura com estéticas tradicionais e a busca por uma identidade artística nacional renovada' },
      { id: 'c', text: 'Marcou o fim de toda a produção literária no Brasil' },
      { id: 'd', text: 'Foi um evento exclusivamente musical, sem relação com a literatura' }
    ],
    correctOptionId: 'b',
    explanation: 'A Semana de Arte Moderna de 1922 é o marco inaugural do Modernismo brasileiro, propondo ruptura com o academicismo e o Parnasianismo e buscando uma estética renovada e mais identificada com a realidade nacional.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_lit_modernismo_2',
    topicId: 'por_lit_modernismo',
    subject: 'Português',
    prompt: 'O Simbolismo, movimento literário de fins do século XIX, caracterizou-se principalmente por:',
    options: [
      { id: 'a', text: 'Uma linguagem objetiva, voltada à descrição científica da realidade' },
      { id: 'b', text: 'Uma linguagem musical e sugestiva, voltada à exploração do subjetivo, do onírico e do simbólico, em oposição ao Realismo/Naturalismo' },
      { id: 'c', text: 'A ausência total de qualquer recurso sonoro ou rítmico' },
      { id: 'd', text: 'A exaltação exclusiva de temas políticos e sociais' }
    ],
    correctOptionId: 'b',
    explanation: 'O Simbolismo valorizava a musicalidade, a sugestão (em vez da descrição direta), o subjetivismo e o misticismo, reagindo à objetividade do Realismo e do Naturalismo — com Cruz e Sousa como principal nome no Brasil.',
    difficulty: 'medium'
  },
  // Português — Literatura Contemporânea
  {
    id: 'q_por_lit_contemporanea_1',
    topicId: 'por_lit_contemporanea',
    subject: 'Português',
    prompt: 'A literatura brasileira contemporânea, produzida a partir de meados do século XX até os dias atuais, caracteriza-se, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'Uma unidade estética rígida e um único estilo dominante compartilhado por todos os autores' },
      { id: 'b', text: 'Uma grande diversidade de estilos, temas e vozes, incluindo maior espaço para autores antes marginalizados e abordagens de temas sociais urgentes' },
      { id: 'c', text: 'O retorno exclusivo aos moldes clássicos e formais do Parnasianismo' },
      { id: 'd', text: 'A ausência completa de qualquer crítica social' }
    ],
    correctOptionId: 'b',
    explanation: 'A literatura contemporânea brasileira se caracteriza pela pluralidade de estilos, temas e vozes, com maior visibilidade para autores historicamente marginalizados e forte diálogo com questões sociais atuais.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_lit_contemporanea_2',
    topicId: 'por_lit_contemporanea',
    subject: 'Português',
    prompt: 'Autores como Clarice Lispector e Guimarães Rosa, associados à prosa brasileira do século XX, são reconhecidos principalmente por:',
    options: [
      { id: 'a', text: 'Uma linguagem simples e convencional, sem qualquer inovação formal' },
      { id: 'b', text: 'Uma renovação da linguagem literária, explorando a introspecção psicológica (Lispector) e a experimentação linguística e o regionalismo universalizado (Guimarães Rosa)' },
      { id: 'c', text: 'Escreverem exclusivamente poesia parnasiana' },
      { id: 'd', text: 'Não terem qualquer relevância para a literatura brasileira contemporânea' }
    ],
    correctOptionId: 'b',
    explanation: 'Clarice Lispector é reconhecida pela profunda introspecção psicológica de sua prosa; Guimarães Rosa (autor de "Grande Sertão: Veredas") é reconhecido pela experimentação linguística e por um regionalismo que dialoga com temas universais.',
    difficulty: 'medium'
  },
  // Português — Fundamentos da Dissertação
  {
    id: 'q_por_red_fundamentos_1',
    topicId: 'por_red_fundamentos',
    subject: 'Português',
    prompt: 'O texto dissertativo-argumentativo, modelo cobrado por exames como o ENEM, tem como principal objetivo:',
    options: [
      { id: 'a', text: 'Narrar uma sequência de eventos fictícios' },
      { id: 'b', text: 'Defender um ponto de vista sobre um tema, por meio de argumentos consistentes e organizados' },
      { id: 'c', text: 'Descrever detalhadamente um objeto ou cena, sem qualquer defesa de ideia' },
      { id: 'd', text: 'Reproduzir literalmente um texto de referência, sem qualquer autoria própria' }
    ],
    correctOptionId: 'b',
    explanation: 'O texto dissertativo-argumentativo tem como finalidade central defender um ponto de vista (tese) sobre um tema, sustentando-o com argumentos organizados e consistentes.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_red_fundamentos_2',
    topicId: 'por_red_fundamentos',
    subject: 'Português',
    prompt: 'A estrutura clássica de uma redação dissertativo-argumentativa é organizada, tipicamente, em:',
    options: [
      { id: 'a', text: 'Apenas dois parágrafos: introdução e conclusão' },
      { id: 'b', text: 'Introdução (com tese), desenvolvimento (com argumentos) e conclusão (com síntese e, no caso do ENEM, proposta de intervenção)' },
      { id: 'c', text: 'Uma sequência de parágrafos narrativos, sem uma tese central' },
      { id: 'd', text: 'Exclusivamente diálogos entre personagens' }
    ],
    correctOptionId: 'b',
    explanation: 'A estrutura clássica segue: introdução (contextualização e apresentação da tese), desenvolvimento (argumentos que sustentam a tese) e conclusão (retomada da tese e, no ENEM, proposta de intervenção).',
    difficulty: 'medium'
  },
  // Português — Leitura de Coletânea e Repertório Temático
  {
    id: 'q_por_red_repertorio_1',
    topicId: 'por_red_repertorio',
    subject: 'Português',
    prompt: 'Na redação do ENEM, a "coletânea" apresentada junto à proposta de redação tem como função principal:',
    options: [
      { id: 'a', text: 'Fornecer a resposta pronta que o candidato deve copiar' },
      { id: 'b', text: 'Apresentar textos motivadores que ajudam a contextualizar o tema, servindo de ponto de partida — mas não de repertório suficiente por si só — para a argumentação do candidato' },
      { id: 'c', text: 'Substituir totalmente a necessidade de repertório sociocultural próprio' },
      { id: 'd', text: 'Avaliar exclusivamente a ortografia do candidato' }
    ],
    correctOptionId: 'b',
    explanation: 'Os textos motivadores da coletânea contextualizam o tema e servem de ponto de partida, mas espera-se que o candidato agregue repertório sociocultural próprio, sem apenas copiar ou parafrasear os textos apresentados.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_red_repertorio_2',
    topicId: 'por_red_repertorio',
    subject: 'Português',
    prompt: 'Um repertório sociocultural é considerado produtivo em uma redação quando:',
    options: [
      { id: 'a', text: 'É apenas citado, sem qualquer articulação com o argumento desenvolvido' },
      { id: 'b', text: 'Está efetivamente articulado ao argumento, contribuindo para sustentá-lo de forma pertinente ao tema' },
      { id: 'c', text: 'É usado de forma genérica, podendo ser aplicado a qualquer tema sem nenhum ajuste' },
      { id: 'd', text: 'Substitui integralmente a necessidade de argumentação própria do candidato' }
    ],
    correctOptionId: 'b',
    explanation: 'Um repertório é considerado produtivo quando está articulado de forma pertinente ao argumento e ao tema, e não apenas citado ou usado de forma genérica e descolada da discussão.',
    difficulty: 'medium'
  },
  // Português — Direitos Humanos e Redações Modelo
  {
    id: 'q_por_red_direitos_modelo_1',
    topicId: 'por_red_direitos_modelo',
    subject: 'Português',
    prompt: 'Ao abordar um tema relacionado a Direitos Humanos em uma redação dissertativo-argumentativa, é fundamental que o candidato:',
    options: [
      { id: 'a', text: 'Trate o respeito aos direitos humanos como um valor a ser relativizado conforme o caso' },
      { id: 'b', text: 'Mantenha uma perspectiva de defesa e respeito aos direitos humanos como princípio inegociável, mesmo ao discutir situações de violência ou criminalidade' },
      { id: 'c', text: 'Evite completamente qualquer menção a direitos humanos, mesmo que o tema exija isso' },
      { id: 'd', text: 'Defenda posições que envolvam qualquer forma de violação a esses direitos, se isso reforçar o argumento' }
    ],
    correctOptionId: 'b',
    explanation: 'Bancas como a do ENEM penalizam (podendo até zerar) redações que desrespeitem os direitos humanos; mesmo em temas sensíveis, como criminalidade, a defesa desses direitos deve ser mantida como princípio inegociável.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_red_direitos_modelo_2',
    topicId: 'por_red_direitos_modelo',
    subject: 'Português',
    prompt: 'Uma proposta de intervenção bem avaliada, em uma redação sobre um tema social sensível (como desigualdade ou violência), deve, entre outros aspectos:',
    options: [
      { id: 'a', text: 'Responsabilizar exclusivamente as vítimas pela situação apresentada' },
      { id: 'b', text: 'Propor uma ação com agente, meio e finalidade claros, respeitando os direitos humanos e sendo coerente com os argumentos desenvolvidos no texto' },
      { id: 'c', text: 'Ignorar completamente os direitos humanos, focando apenas em soluções punitivas' },
      { id: 'd', text: 'Ser genérica, sem qualquer detalhamento de agente ou meio de execução' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma boa proposta de intervenção detalha agente, meio e finalidade da ação, mantém coerência com os argumentos do texto e respeita os direitos humanos, mesmo ao tratar de temas sensíveis como violência ou desigualdade.',
    difficulty: 'medium'
  },
  // Inglês — Compreensão de Texto em Inglês
  {
    id: 'q_ing_01_1',
    topicId: 'ing_01',
    subject: 'Inglês',
    prompt: 'Read the excerpt below and answer the question.\n\n"Reading habits have changed significantly in the last decade. More people now read on smartphones and tablets than on paper, especially among younger generations. However, some studies suggest that reading on paper may still lead to better comprehension for complex texts."\n\nAccording to the text, what has changed in the last decade?',
    options: [
      { id: 'a', text: 'People stopped reading complex texts entirely' },
      { id: 'b', text: 'Reading habits have shifted, with more people reading on digital devices instead of paper' },
      { id: 'c', text: 'Paper books have become more popular than digital devices' },
      { id: 'd', text: 'Younger generations have completely stopped reading' }
    ],
    correctOptionId: 'b',
    explanation: 'The text states that more people now read on smartphones and tablets than on paper — indicating a clear shift in reading habits toward digital devices, especially among younger generations.',
    difficulty: 'easy'
  },
  {
    id: 'q_ing_01_2',
    topicId: 'ing_01',
    subject: 'Inglês',
    prompt: 'Read the excerpt below and answer the question.\n\n"Although digital reading is now more common, research indicates that readers often skim on screens rather than reading deeply. This is why some educators still recommend printed materials for subjects that require careful, sustained attention."\n\nWhat can be inferred from the word "although" at the beginning of the text?',
    options: [
      { id: 'a', text: 'It introduces a cause-and-effect relationship' },
      { id: 'b', text: 'It signals a contrast between the popularity of digital reading and a potential drawback associated with it' },
      { id: 'c', text: 'It has no grammatical or semantic function in the sentence' },
      { id: 'd', text: 'It indicates that the text will conclude immediately' }
    ],
    correctOptionId: 'b',
    explanation: '"Although" is a subordinating conjunction used to introduce contrast or concession. Here, it contrasts the popularity of digital reading with the drawback that readers tend to skim rather than read deeply on screens.',
    difficulty: 'medium'
  }
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 'pod_bio_01',
    topicId: 'bio_estrutura_fisio_celular',
    title: 'Citologia em 5 minutos',
    subject: 'Biologia',
    durationMinutes: 5,
    script: 'A célula é a unidade fundamental da vida. Toda célula possui uma membrana plasmática que controla o que entra e sai. Dentro dela, o citoplasma abriga as organelas. As mitocôndrias produzem energia na forma de ATP através da respiração celular. O núcleo guarda o material genético e comanda as atividades celulares. Entender a função de cada organela é a base para todo o resto da biologia celular e molecular que você vai estudar.'
  },
  {
    id: 'pod_bio_02',
    topicId: 'bio_genetica',
    title: 'Genética Mendeliana sem decoreba',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'Mendel descobriu que características são herdadas em unidades discretas, os genes, que existem em pares chamados alelos. Quando um alelo é dominante, ele se expressa mesmo na presença de um alelo recessivo. Um heterozigoto tem um alelo de cada tipo. Ao cruzar dois heterozigotos, a proporção fenotípica esperada é de três dominantes para um recessivo. Isso é a base do quadro de Punnett, sua principal ferramenta para prever cruzamentos.'
  },
  {
    id: 'pod_bio_03',
    topicId: 'bio_fisio_animal',
    title: 'Como o corpo humano se mantém em equilíbrio',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'O corpo humano funciona como um sistema integrado de sistemas orgânicos. O sistema cardiovascular bombeia sangue através do coração, que possui quatro câmaras: dois átrios e dois ventrículos. O sangue oxigenado sai do ventrículo esquerdo pela aorta e é distribuído para todo o corpo. Já os rins filtram o sangue através dos néfrons, removendo excretas e regulando o volume e a composição dos líquidos corporais. Entender como esses sistemas trabalham juntos, mantendo a homeostase, é essencial não só para o vestibular, mas para toda a sua futura formação em Medicina.'
  },
  {
    id: 'pod_bio_04',
    topicId: 'bio_ecologia',
    title: 'Ecologia: cadeias, teias e relações entre espécies',
    subject: 'Biologia',
    durationMinutes: 5,
    script: 'Toda cadeia alimentar começa nos produtores, organismos capazes de fotossíntese, que convertem energia luminosa em energia química. Os consumidores primários se alimentam dos produtores, os secundários predam os primários, e assim por diante, com perda de energia a cada nível trófico. As relações ecológicas podem ser harmônicas, como o mutualismo, onde ambas as espécies se beneficiam, ou desarmônicas, como o parasitismo, onde uma espécie prejudica a outra. Compreender ciclos biogeoquímicos, como o do carbono e do nitrogênio, também é fundamental para questões que conectam ecologia com sustentabilidade no vestibular.'
  },
  {
    id: 'pod_bio_05',
    topicId: 'bio_evolucao',
    title: 'Evolução: como Darwin explicou a diversidade da vida',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'A teoria da evolução por seleção natural, proposta por Darwin, explica como as espécies mudam ao longo do tempo. Dentro de uma população, existe variação genética natural entre os indivíduos. Aqueles com características mais vantajosas para o ambiente tendem a sobreviver mais e deixar mais descendentes, transmitindo essas características para as próximas gerações. Com o tempo, isso pode levar à especiação, o surgimento de novas espécies, especialmente quando populações ficam isoladas geograficamente. É importante lembrar que a seleção natural não tem propósito ou direção — ela apenas favorece quem está mais adaptado ao ambiente naquele momento.'
  },
  {
    id: 'pod_bio_06',
    topicId: 'bio_microbiologia',
    title: 'Bactérias, vírus e o sistema imunológico',
    subject: 'Biologia',
    durationMinutes: 7,
    script: 'Bactérias são organismos procariontes, sem núcleo delimitado por membrana, e possuem parede celular de peptideoglicano. Já os vírus não são considerados seres vivos por muitos biólogos, pois dependem completamente de uma célula hospedeira para se replicar. Nosso sistema imunológico se defende desses invasores em duas frentes: a imunidade inata, rápida e inespecífica, com barreiras físicas e células fagocitárias; e a imunidade adaptativa, mais lenta, porém específica, que gera células de memória — o princípio por trás das vacinas. Esse tema conecta biologia celular com saúde pública, um assunto recorrente em provas de Medicina.'
  },
  {
    id: 'pod_mat_01',
    topicId: 'mat_funcoes',
    title: 'Funções de primeiro grau na prática',
    subject: 'Matemática',
    durationMinutes: 4,
    script: 'Uma função de primeiro grau tem a forma f de x igual a a x mais b, onde a é o coeficiente angular e b o coeficiente linear. O coeficiente a define a inclinação da reta: se for positivo, a função é crescente, se for negativo, é decrescente. A raiz da função é o valor de x que zera f de x, ou seja, onde a reta cruza o eixo horizontal. Esse conceito aparece disfarçado em várias questões de física e economia no vestibular.'
  },
  {
    id: 'pod_mat_02',
    topicId: 'mat_combinatoria',
    title: 'Análise combinatória: quando somar e quando multiplicar',
    subject: 'Matemática',
    durationMinutes: 7,
    script: 'A maior pegadinha da análise combinatória é saber quando somar e quando multiplicar possibilidades. Use a multiplicação quando os eventos acontecem em sequência, um depois do outro. Use a soma quando são alternativas que se excluem. Permutação é usada quando todos os elementos são organizados em ordem. Combinação é usada quando a ordem não importa. Ler o enunciado com atenção às palavras chave, como pelo menos, no máximo e exatamente, evita a maioria dos erros de interpretação.'
  },
  {
    id: 'pod_mat_03',
    topicId: 'mat_funcoes',
    title: 'Funções de segundo grau e a parábola',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'A função de segundo grau tem a forma f de x igual a a x ao quadrado mais b x mais c, e seu gráfico é sempre uma parábola. Se o coeficiente a for positivo, a parábola tem concavidade para cima, com um ponto de mínimo. Se for negativo, a concavidade é para baixo, com um ponto de máximo. O discriminante, delta igual a b ao quadrado menos quatro a c, indica quantas raízes reais a função possui: duas se for positivo, uma se for zero, e nenhuma raiz real se for negativo. Essas funções aparecem em problemas de otimização, física e economia no vestibular.'
  },
  {
    id: 'pod_mat_04',
    topicId: 'mat_geometria_plana',
    title: 'Geometria plana: as fórmulas que mais caem',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Geometria plana estuda figuras em duas dimensões: triângulos, quadriláteros, círculos e suas propriedades. As fórmulas de área mais cobradas no vestibular incluem o triângulo, base vezes altura dividido por dois, o retângulo, base vezes altura, e o círculo, pi vezes o raio ao quadrado. O Teorema de Pitágoras, que relaciona os catetos e a hipotenusa de um triângulo retângulo, é uma das ferramentas mais versáteis, aparecendo até em questões de física e trigonometria. Praticar a visualização de figuras compostas, decompondo-as em formas mais simples, é a chave para resolver a maioria dos problemas.'
  },
  {
    id: 'pod_mat_05',
    topicId: 'mat_dados_probabilidade',
    title: 'Probabilidade sem mistério',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Probabilidade mede a chance de um evento acontecer, calculada como o número de casos favoráveis dividido pelo número total de casos possíveis. Em eventos independentes, como lançar um dado duas vezes, multiplicamos as probabilidades individuais. Já em eventos mutuamente exclusivos, que não podem ocorrer ao mesmo tempo, somamos as probabilidades. Esse conteúdo conecta diretamente com análise combinatória: muitas vezes é preciso contar as possibilidades usando permutação ou combinação antes mesmo de calcular a probabilidade. Ler o enunciado com atenção para identificar se os eventos são independentes ou excludentes evita a maioria dos erros nesse tópico.'
  },
  {
    id: 'pod_mat_06',
    topicId: 'mat_trigonometria',
    title: 'Trigonometria: seno, cosseno e tangente na prática',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'A trigonometria relaciona os ângulos de um triângulo retângulo com as medidas de seus lados. Seno é o cateto oposto dividido pela hipotenusa, cosseno é o cateto adjacente dividido pela hipotenusa, e tangente é o cateto oposto dividido pelo cateto adjacente. Vale a pena memorizar os valores notáveis para os ângulos de 30, 45 e 60 graus, que aparecem constantemente nas provas. Além do triângulo retângulo, a trigonometria se estende ao círculo trigonométrico, essencial para entender funções periódicas como movimento circular e ondas, temas que conectam diretamente com física.'
  },
  {
    id: 'pod_fis_01',
    topicId: 'fis_cinematica',
    title: 'Cinemática: as três equações que resolvem tudo',
    subject: 'Física',
    durationMinutes: 5,
    script: 'A cinemática descreve o movimento sem se preocupar com suas causas. As três equações fundamentais do movimento uniformemente variado são: velocidade igual a velocidade inicial mais aceleração vezes tempo; posição igual a posição inicial mais velocidade inicial vezes tempo mais metade da aceleração vezes tempo ao quadrado; e a equação de Torricelli, velocidade ao quadrado igual a velocidade inicial ao quadrado mais duas vezes aceleração vezes o deslocamento. Dominar essas três fórmulas resolve a grande maioria das questões de cinemática do vestibular.'
  },
  {
    id: 'pod_fis_02',
    topicId: 'fis_circuitos',
    title: 'Eletrodinâmica: série, paralelo e a Lei de Ohm',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Em circuitos em série, a corrente é a mesma em todos os componentes e as resistências se somam diretamente. Em circuitos em paralelo, a tensão é a mesma em todos os ramos e o inverso da resistência equivalente é a soma dos inversos de cada resistência. A Lei de Ohm, tensão igual a resistência vezes corrente, conecta essas três grandezas e é a ferramenta mais usada para resolver exercícios de eletrodinâmica no vestibular.'
  },
  {
    id: 'pod_fis_03',
    topicId: 'fis_leis_newton',
    title: 'As três Leis de Newton em um episódio só',
    subject: 'Física',
    durationMinutes: 6,
    script: 'As três Leis de Newton formam a base da mecânica clássica. A primeira, ou lei da inércia, diz que um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme, a menos que uma força atue sobre ele. A segunda lei estabelece que a força resultante é igual à massa vezes a aceleração, F igual a m vezes a. E a terceira lei, de ação e reação, afirma que toda força aplicada gera uma força de mesma intensidade e sentido oposto em outro corpo. Entender essas três leis juntas é o que permite resolver praticamente qualquer problema de dinâmica no vestibular.'
  },
  {
    id: 'pod_fis_04',
    topicId: 'fis_calorimetria',
    title: 'Termologia: calor, temperatura e mudanças de estado',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Termologia estuda o calor e suas transformações. Calor específico é a quantidade de energia necessária para elevar em um grau a temperatura de uma unidade de massa de uma substância, calculado pela fórmula Q igual a m vezes c vezes delta T. As mudanças de estado físico, como fusão e vaporização, ocorrem a temperatura constante, com o calor sendo usado para quebrar as ligações entre as moléculas, não para aumentar a temperatura. Já as leis dos gases relacionam pressão, volume e temperatura, sendo fundamentais para entender desde motores até fenômenos atmosféricos, um assunto que aparece com frequência em questões interdisciplinares.'
  },
  {
    id: 'pod_fis_05',
    topicId: 'fis_optica_geometrica',
    title: 'Óptica: luz, reflexão e a visão humana',
    subject: 'Física',
    durationMinutes: 5,
    script: 'A óptica estuda o comportamento da luz. Quando a luz passa de um meio para outro, ela sofre refração, mudando de direção devido à diferença de velocidade entre os meios — é esse fenômeno que causa o arco-íris, ao decompor a luz branca em suas cores. Já a reflexão ocorre quando a luz retorna ao meio de origem ao encontrar uma superfície, como em espelhos. No estudo da visão, é importante saber que na miopia a imagem se forma antes da retina, corrigida com lentes divergentes, enquanto na hipermetropia a imagem se forma depois da retina, corrigida com lentes convergentes.'
  },
  {
    id: 'pod_fis_06',
    topicId: 'fis_ondulatoria',
    title: 'Ondulatória: velocidade, frequência e ressonância',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Uma onda transporta energia sem transportar matéria. A velocidade de propagação de uma onda é o produto entre sua frequência e seu comprimento de onda, v igual a lambda vezes f. Ondas mecânicas, como o som, precisam de um meio material para se propagar, enquanto ondas eletromagnéticas, como a luz, se propagam até no vácuo. Um fenômeno interessante é a ressonância, quando um sistema vibra com amplitude máxima ao receber energia numa frequência igual à sua frequência natural — o mesmo princípio usado para sintonizar rádios e explicado em diversas questões de vestibular sobre ondas sonoras e vibrações.'
  },
  {
    id: 'pod_qui_01',
    topicId: 'qui_estequiometria',
    title: 'Estequiometria sem trava',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Estequiometria é a parte da química que calcula as quantidades de reagentes e produtos em uma reação química balanceada. Tudo começa com a lei de conservação das massas: a massa total dos reagentes é igual à massa total dos produtos. Usando os coeficientes da equação balanceada, conseguimos calcular proporções em mols, depois converter para massa usando a massa molar de cada substância. O segredo para não errar é sempre balancear a equação primeiro e trabalhar com a proporção de mols antes de qualquer outra conversão. É um dos tópicos mais cobrados no vestibular por unir cálculo e química num só problema.'
  },
  {
    id: 'pod_qui_02',
    topicId: 'qui_polaridade_geometria',
    title: 'Ligações químicas: iônica, covalente e polaridade',
    subject: 'Química',
    durationMinutes: 6,
    script: 'As ligações químicas explicam como os átomos se unem para formar substâncias. Na ligação iônica, um átomo perde elétrons e outro ganha, formando íons de cargas opostas que se atraem eletricamente — típico de metais com ametais. Na ligação covalente, os átomos compartilham pares de elétrons, geralmente entre ametais. A geometria da molécula e a diferença de eletronegatividade entre os átomos determinam se a molécula será polar ou apolar, o que explica propriedades importantes, como a razão pela qual a água dissolve tantas substâncias, sendo um solvente essencial para todos os processos biológicos.'
  },
  {
    id: 'pod_qui_03',
    topicId: 'qui_organica_fundamentos',
    title: 'Química orgânica: carbono, cadeias e funções',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Química orgânica estuda os compostos de carbono, o elemento capaz de formar quatro ligações covalentes e se unir a outros átomos de carbono formando cadeias longas e variadas. Os hidrocarbonetos, formados só por carbono e hidrogênio, são a base dessa área. A partir deles, surgem as funções orgânicas, como álcoois, quando um grupo hidroxila substitui um hidrogênio, e ácidos carboxílicos, com o grupo carboxila. Reconhecer o grupo funcional de um composto é o primeiro passo para prever suas propriedades e reações, um raciocínio que aparece direto nas questões de química orgânica do vestibular.'
  },
  {
    id: 'pod_qui_04',
    topicId: 'qui_solucoes',
    title: 'Soluções e concentração no dia a dia',
    subject: 'Química',
    durationMinutes: 5,
    script: 'Uma solução é uma mistura homogênea entre um soluto, presente em menor quantidade, e um solvente, presente em maior quantidade. A concentração mede a proporção entre eles, podendo ser expressa em gramas por litro, ou em quantidade de matéria, os mols por litro. Uma solução está saturada quando atingiu o limite máximo de soluto que consegue dissolver naquela temperatura; além desse ponto, o excesso forma um corpo de fundo. Esse conteúdo é a base para entender desde soro fisiológico até reações em laboratório, conectando química com aplicações do dia a dia e da medicina.'
  },
  {
    id: 'pod_bio_fisio_vegetal',
    topicId: 'bio_fisio_vegetal',
    title: 'Fisiologia vegetal: como a planta bebe água e "decide" para onde crescer',
    subject: 'Biologia',
    durationMinutes: 5,
    script: 'As plantas vasculares têm dois sistemas de transporte: o xilema, que leva água e sais minerais das raízes até as folhas, impulsionado pela transpiração; e o floema, que distribui os açúcares produzidos na fotossíntese para o resto da planta. Esse fluxo ascendente de seiva bruta depende de um efeito em cadeia de coesão entre moléculas de água, a chamada teoria da tensão-coesão-adesão. Além do transporte, hormônios vegetais como a auxina comandam o crescimento direcionado: quando a luz vem de um lado só, a auxina se acumula no lado sombreado e faz aquele lado crescer mais, curvando o caule em direção à luz — o fototropismo.'
  },
  {
    id: 'pod_fis_dinamica_impulsiva',
    topicId: 'fis_dinamica_impulsiva',
    title: 'Impulso e colisões: a física por trás de uma batida',
    subject: 'Física',
    durationMinutes: 5,
    script: 'A quantidade de movimento de um corpo é o produto entre sua massa e sua velocidade, e o impulso de uma força é exatamente a variação dessa quantidade de movimento. Em qualquer colisão, se não há forças externas relevantes agindo no sistema, a quantidade de movimento total se conserva — é o que permite calcular a velocidade dos corpos antes e depois de uma batida sem precisar saber os detalhes da força de contato entre eles. Colisões podem ser elásticas, quando a energia cinética também se conserva, ou inelásticas, quando parte dessa energia se transforma em calor, som ou deformação. Esse raciocínio de conservação é uma das ferramentas mais poderosas da física para o vestibular.'
  },
  {
    id: 'pod_fis_estatica',
    title: 'Estática e hidrostática: equilíbrio de corpos e empuxo',
    topicId: 'fis_estatica',
    subject: 'Física',
    durationMinutes: 5,
    script: 'Um corpo está em equilíbrio estático quando a força resultante e o torque resultante sobre ele são nulos. O torque, ou momento de uma força, depende não só da intensidade da força, mas também da distância dela até o ponto de rotação — por isso uma barra apoiada em um único ponto só fica em equilíbrio se esse ponto coincidir com o centro de massa. Já na hidrostática, o Princípio de Arquimedes explica por que objetos flutuam ou afundam: todo corpo submerso em um fluido recebe um empuxo para cima, igual ao peso do volume de fluido que ele desloca. Se esse empuxo for maior que o peso do objeto, ele flutua; se for menor, afunda.'
  },
  {
    id: 'pod_fis_eletromagnetismo',
    topicId: 'fis_eletromagnetismo',
    title: 'Eletromagnetismo: campos magnéticos, força e indução',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Cargas elétricas em movimento dentro de um campo magnético sofrem uma força perpendicular tanto à velocidade quanto ao campo, calculada com a regra da mão direita. Esse é o princípio por trás de motores elétricos. O caminho inverso também funciona: quando o fluxo magnético através de um circuito varia, uma corrente elétrica é induzida nele — é a chamada indução eletromagnética, base dos geradores. A Lei de Lenz garante que essa corrente induzida sempre se oponha à variação que a criou, um reflexo direto da conservação de energia. Entender essa relação de mão dupla entre eletricidade e magnetismo é essencial para as questões de eletromagnetismo do vestibular.'
  },
  {
    id: 'pod_por_redacao',
    topicId: 'por_red_fundamentos',
    title: 'Redação nota 1000: repertório, argumentação e proposta',
    subject: 'Português',
    durationMinutes: 6,
    script: 'Uma boa redação dissertativo-argumentativa começa com uma tese clara logo na introdução, seguida por parágrafos de desenvolvimento que sustentam essa tese com argumentos consistentes. O repertório sociocultural — dados, referências históricas, citações — só tem valor quando está articulado ao argumento, explicando por que aquela informação sustenta o que você está defendendo, e não apenas jogado no texto. A conclusão precisa trazer uma proposta de intervenção completa: quem faz (agente), como faz (meio), com que objetivo (finalidade) e, sempre que possível, um detalhamento da ação, tudo conectado aos argumentos já desenvolvidos. Coesão entre parágrafos e domínio da norma culta fecham o pacote que as bancas mais valorizam.'
  },
  {
    id: 'pod_bio_metabolismo_energetico',
    topicId: 'bio_metabolismo_energetico',
    title: 'Metabolismo energético: como a célula extrai energia dos alimentos',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'O metabolismo energético da célula converte a energia química dos alimentos em ATP, a moeda energética universal. Na respiração celular aeróbica, a glicose passa pela glicólise no citoplasma, depois pelo ciclo de Krebs e pela cadeia respiratória nas mitocôndrias, usando oxigênio como aceptor final de elétrons e produzindo a maior parte do ATP. Quando falta oxigênio, algumas células recorrem à fermentação, um processo menos eficiente que produz pouco ATP e gera subprodutos como o ácido lático, no caso das células musculares, ou o etanol, no caso das leveduras. Entender essas rotas metabólicas ajuda a explicar desde a fadiga muscular até processos industriais como a produção de pão e álcool.'
  },
  {
    id: 'pod_bio_codigo_genetico_sintese',
    topicId: 'bio_codigo_genetico_sintese',
    title: 'Do DNA à proteína: como a célula lê o código genético',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'Toda a informação genética de uma célula está armazenada no DNA, mas é através da síntese proteica que essa informação se transforma em características reais. O processo começa com a transcrição, em que uma sequência de DNA é copiada para uma molécula de RNA mensageiro no núcleo. Esse RNA mensageiro sai para o citoplasma, onde ocorre a tradução: os ribossomos leem a sequência de RNA em trincas de bases chamadas códons, e cada códon corresponde a um aminoácido específico, formando progressivamente uma cadeia de proteína. O código genético é praticamente universal entre os seres vivos, uma das evidências mais fortes da origem comum da vida na Terra.'
  },
  {
    id: 'pod_bio_biotecnologia',
    topicId: 'bio_biotecnologia',
    title: 'Biotecnologia: da PCR ao CRISPR',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'A biotecnologia moderna se apoia em ferramentas que permitem manipular o material genético com grande precisão. A PCR, ou reação em cadeia da polimerase, permite copiar milhões de vezes um trecho específico de DNA, sendo essencial para testes diagnósticos e exames de paternidade, por exemplo. Já a tecnologia CRISPR-Cas9 funciona como uma tesoura molecular guiada por RNA, capaz de cortar o DNA em um ponto exato do genoma, permitindo remover, corrigir ou inserir genes com uma precisão sem precedentes. Essas técnicas têm aplicações que vão da agricultura, com plantas mais resistentes, até a medicina, no desenvolvimento de terapias gênicas para doenças antes consideradas incuráveis.'
  },
  {
    id: 'pod_bio_zoologia',
    topicId: 'bio_zoologia',
    title: 'Zoologia: dos invertebrados aos vertebrados',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'A zoologia organiza a diversidade animal em grandes grupos, dos invertebrados, como os moluscos, os artrópodes e os cnidários, até os vertebrados, reunidos no filo Chordata. Cada grupo apresenta adaptações específicas: os artrópodes, por exemplo, têm um exoesqueleto de quitina e apêndices articulados, o que explica seu enorme sucesso evolutivo. Entre os vertebrados, a classificação em peixes, anfíbios, répteis, aves e mamíferos reflete diferentes soluções evolutivas para problemas como a respiração fora da água, a reprodução em ambiente terrestre e a regulação da temperatura corporal. Entender essas adaptações, e não apenas decorar nomes de filos e classes, é o que realmente ajuda a resolver questões de zoologia.'
  },
  {
    id: 'pod_bio_botanica',
    topicId: 'bio_botanica',
    title: 'Botânica: dos tecidos vegetais à reprodução das plantas',
    subject: 'Biologia',
    durationMinutes: 6,
    script: 'As plantas possuem tecidos especializados que sustentam suas funções vitais. O xilema conduz água e sais minerais das raízes até as folhas, enquanto o floema transporta os açúcares produzidos na fotossíntese para o restante da planta. Além da fisiologia, a botânica também trata da classificação e da reprodução dos vegetais: briófitas e pteridófitas dependem de água para a reprodução, enquanto gimnospermas e angiospermas desenvolveram estruturas como a semente e, no caso das angiospermas, o fruto e a flor, que ampliaram enormemente sua capacidade de dispersão e adaptação a ambientes terrestres.'
  },
  {
    id: 'pod_mat_aritmetica_proporcionalidade',
    topicId: 'mat_aritmetica_proporcionalidade',
    title: 'Proporcionalidade: a base de porcentagem, juros e escalas',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Proporcionalidade é um dos conceitos mais recorrentes no vestibular, aparecendo disfarçada em questões de porcentagem, juros, escalas de mapas e até em física e química. Duas grandezas são diretamente proporcionais quando, ao multiplicar uma por um número, a outra é multiplicada pelo mesmo número — como o preço total de um produto em função da quantidade comprada. Já grandezas inversamente proporcionais se comportam de forma oposta: quando uma aumenta, a outra diminui na mesma razão, como a velocidade e o tempo em um trajeto de distância fixa. Dominar a regra de três, simples ou composta, é a ferramenta prática mais direta para resolver esse tipo de problema rapidamente na prova.'
  },
  {
    id: 'pod_mat_teoria_numeros',
    topicId: 'mat_teoria_numeros',
    title: 'MDC, MMC e números primos: teoria dos números na prática',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'A teoria dos números trata das propriedades dos números inteiros, com destaque para os números primos, o máximo divisor comum e o mínimo múltiplo comum. O MDC de dois números é o maior número que divide ambos exatamente, útil, por exemplo, para dividir grupos ou terrenos em partes iguais. Já o MMC é o menor múltiplo comum entre eles, essencial em problemas de eventos periódicos, como sinais luminosos que piscam juntos em intervalos diferentes. Fatorar os números em primos é a estratégia mais confiável para calcular ambos com segurança, especialmente quando os números envolvidos são grandes.'
  },
  {
    id: 'pod_mat_sequencias_matrizes',
    topicId: 'mat_sequencias_matrizes',
    title: 'Progressões, matrizes e sistemas lineares',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'Progressões aritméticas e geométricas descrevem sequências de números com um padrão bem definido: na progressão aritmética, cada termo soma uma razão constante ao anterior; na geométrica, cada termo multiplica o anterior por uma razão constante. Já as matrizes organizam números em linhas e colunas, sendo fundamentais para representar e resolver sistemas de equações lineares, como aqueles que aparecem em problemas com múltiplas variáveis relacionadas entre si. Métodos como a substituição, a adição ou o escalonamento permitem encontrar a solução desses sistemas de forma organizada, uma habilidade que aparece tanto em matemática pura quanto em aplicações de física e economia.'
  },
  {
    id: 'pod_mat_geometria_espacial',
    topicId: 'mat_geometria_espacial',
    title: 'Geometria espacial: volumes e áreas de sólidos',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'A geometria espacial estuda figuras tridimensionais, como prismas, pirâmides, cilindros, cones e esferas, com foco no cálculo de suas áreas e volumes. O volume de um prisma, por exemplo, é obtido multiplicando a área da base pela altura, enquanto o volume de uma pirâmide ou de um cone é um terço desse mesmo produto. Já o volume da esfera segue uma fórmula própria, baseada no seu raio. Questões de vestibular costumam contextualizar esses sólidos em situações práticas, como o cálculo da quantidade de material necessário para construir uma caixa d\'água ou embalagens, exigindo não só a fórmula, mas a interpretação geométrica correta do problema.'
  },
  {
    id: 'pod_mat_geometria_analitica',
    topicId: 'mat_geometria_analitica',
    title: 'Geometria analítica: pontos, retas e distâncias no plano cartesiano',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'A geometria analítica conecta a álgebra à geometria, representando pontos, retas e outras figuras através de coordenadas no plano cartesiano. A distância entre dois pontos pode ser calculada por uma fórmula derivada do teorema de Pitágoras, enquanto o coeficiente angular de uma reta indica sua inclinação, sendo essencial para determinar se duas retas são paralelas ou perpendiculares. Esses conceitos permitem resolver algebricamente problemas que, de outra forma, exigiriam desenhos e medições — uma vantagem enorme em provas cronometradas, onde velocidade e precisão fazem toda a diferença.'
  },
  {
    id: 'pod_mat_equacoes',
    topicId: 'mat_equacoes',
    title: 'Equações e desigualdades: modelando problemas do mundo real',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Resolver um problema matemático frequentemente começa por traduzir uma situação real em uma equação ou desigualdade. Equações do primeiro e do segundo grau permitem encontrar valores exatos que satisfazem uma condição, como o ponto de equilíbrio entre custo e receita em um problema de economia. Já as desigualdades descrevem intervalos de valores possíveis, muito usadas em problemas de otimização, onde se busca o maior ou o menor valor possível dentro de certas restrições. Dominar essa modelagem algébrica é o que transforma um enunciado longo e confuso em uma expressão matemática simples e resolvível.'
  },
  {
    id: 'pod_mat_log_exponenciais',
    topicId: 'mat_log_exponenciais',
    title: 'Exponenciais e logaritmos: crescimento e seu inverso',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Funções exponenciais descrevem fenômenos de crescimento ou decrescimento acelerado, como o crescimento de uma população de bactérias ou a desvalorização de um bem ao longo do tempo. Os logaritmos, por sua vez, são a operação inversa da exponenciação: enquanto a exponencial responde quanto vale a potência, o logaritmo responde qual é o expoente que gera um determinado valor. Essa relação é essencial para resolver equações exponenciais mais complexas e aparece em contextos como escalas logarítmicas de terremotos, medições de pH e crescimento populacional — temas recorrentes em questões interdisciplinares do vestibular.'
  },
  {
    id: 'pod_mat_complexos_polinomios',
    topicId: 'mat_complexos_polinomios',
    title: 'Números complexos e polinômios',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'Os números complexos surgem para resolver equações que não têm solução dentro dos números reais, como a raiz quadrada de um número negativo, introduzindo a unidade imaginária i, definida por i ao quadrado igual a menos um. Já os polinômios são expressões algébricas com vários termos, e seu estudo envolve encontrar suas raízes, ou seja, os valores que os anulam. O Teorema Fundamental da Álgebra garante que todo polinômio de grau n tem exatamente n raízes complexas, contando multiplicidades — uma ideia que conecta esses dois temas e costuma aparecer em questões mais avançadas do vestibular.'
  },
  {
    id: 'pod_fis_cinematica_vetorial',
    topicId: 'fis_cinematica_vetorial',
    title: 'Cinemática vetorial: quando a direção importa',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Diferente da cinemática escalar, que trata apenas do módulo das grandezas, a cinemática vetorial considera também a direção e o sentido do movimento. Um exemplo clássico é o lançamento horizontal ou oblíquo, em que o movimento se decompõe em duas componentes independentes: uma horizontal, com velocidade constante, e uma vertical, sob ação da gravidade. Para somar vetores perpendiculares, como forças ou velocidades em direções diferentes, usa-se o teorema de Pitágoras para encontrar o módulo do vetor resultante. Dominar essa decomposição é essencial para resolver problemas de lançamento de projéteis e de movimento em duas dimensões.'
  },
  {
    id: 'pod_fis_gravitacao_circular',
    topicId: 'fis_gravitacao_circular',
    title: 'Gravitação universal e movimento circular',
    subject: 'Física',
    durationMinutes: 6,
    script: 'A Lei da Gravitação Universal de Newton descreve como todos os corpos com massa se atraem mutuamente, com uma força proporcional ao produto das massas e inversamente proporcional ao quadrado da distância entre elas — é essa força que mantém planetas em órbita e faz objetos caírem na Terra. Já no movimento circular, mesmo quando a velocidade escalar é constante, existe uma aceleração centrípeta, direcionada para o centro da trajetória, responsável por mudar continuamente a direção do movimento. É a força gravitacional que atua como força centrípeta na órbita dos planetas e satélites, mantendo-os em trajetórias curvas ao redor de um corpo central.'
  },
  {
    id: 'pod_fis_energia',
    topicId: 'fis_energia',
    title: 'Energia mecânica: cinética, potencial e sua conservação',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Todo corpo em movimento possui energia cinética, proporcional à sua massa e ao quadrado de sua velocidade. Já a energia potencial gravitacional depende da altura de um corpo em relação a um referencial. Quando apenas forças conservativas atuam sobre um sistema, como a gravidade sem atrito, a energia mecânica total — a soma da cinética com a potencial — permanece constante, podendo apenas se converter de uma forma para outra, como em uma montanha-russa. Já quando existe atrito ou outra força dissipativa, parte dessa energia se converte em calor, e a energia mecânica deixa de se conservar.'
  },
  {
    id: 'pod_fis_termodinamica_gases',
    topicId: 'fis_termodinamica_gases',
    title: 'Termodinâmica dos gases: pressão, volume e temperatura',
    subject: 'Física',
    durationMinutes: 6,
    script: 'As leis dos gases descrevem como pressão, volume e temperatura se relacionam em um gás ideal. A Lei de Boyle mostra que, a temperatura constante, pressão e volume são inversamente proporcionais: reduzir o volume aumenta a pressão. A Lei de Charles, por sua vez, relaciona volume e temperatura a pressão constante. Essas relações se resumem na Equação de Clapeyron, PV igual a nRT, que conecta todas as variáveis de um gás ideal em uma única fórmula. Além disso, as leis da termodinâmica explicam como calor e trabalho se relacionam: a energia não pode ser criada nem destruída, apenas convertida entre formas.'
  },
  {
    id: 'pod_fis_eletrostatica',
    topicId: 'fis_eletrostatica',
    title: 'Eletrostática: cargas, campos e força elétrica',
    subject: 'Física',
    durationMinutes: 6,
    script: 'A eletrostática estuda cargas elétricas em repouso e as forças que elas exercem entre si. Pela Lei de Coulomb, cargas de mesmo sinal se repelem e cargas de sinais opostos se atraem, com uma força que depende do produto das cargas e é inversamente proporcional ao quadrado da distância entre elas — uma relação semelhante à da gravitação universal. Ao redor de toda carga elétrica existe um campo elétrico, representado por linhas de campo que divergem de cargas positivas e convergem para cargas negativas. Esse conceito de campo é a base para entender fenômenos elétricos mais complexos, como capacitores e circuitos.'
  },
  {
    id: 'pod_fis_optica_instrumental',
    topicId: 'fis_optica_instrumental',
    title: 'Óptica instrumental: como lentes formam imagens',
    subject: 'Física',
    durationMinutes: 6,
    script: 'A óptica instrumental estuda como lentes e espelhos formam imagens, aplicando esse conhecimento a instrumentos como o olho humano, óculos, lupas, microscópios e telescópios. Lentes convergentes tendem a concentrar os raios de luz em um ponto, sendo usadas para corrigir a hipermetropia, enquanto lentes divergentes espalham os raios, corrigindo a miopia. A formação de imagens depende da posição do objeto em relação aos focos da lente, podendo gerar imagens reais ou virtuais, maiores ou menores que o objeto original. Entender esses princípios ajuda a explicar desde o funcionamento de instrumentos ópticos até problemas de visão comuns, um tema com forte conexão com biologia e medicina.'
  },
  {
    id: 'pod_fis_ondas_fundamentos',
    topicId: 'fis_ondas_fundamentos',
    title: 'Ondas: fundamentos de frequência, comprimento e velocidade',
    subject: 'Física',
    durationMinutes: 5,
    script: 'Uma onda transporta energia sem transportar matéria, e seu comportamento é descrito por três grandezas principais: a frequência, que indica quantas oscilações ocorrem por segundo; o comprimento de onda, a distância entre dois pontos equivalentes consecutivos da onda; e a velocidade de propagação, que relaciona as outras duas pela equação v igual a f vezes lambda. Ondas podem ser mecânicas, como o som, que precisam de um meio material para se propagar, ou eletromagnéticas, como a luz, que se propagam até no vácuo. Esses fundamentos são a base para entender fenômenos mais específicos, como reflexão, refração, interferência e ressonância.'
  },
  {
    id: 'pod_fis_fisica_moderna',
    topicId: 'fis_fisica_moderna',
    title: 'Física moderna: quântica e relatividade em poucos minutos',
    subject: 'Física',
    durationMinutes: 6,
    script: 'A física moderna revolucionou a forma como entendemos o universo no início do século vinte. O efeito fotoelétrico, explicado por Einstein, mostrou que a luz se comporta como pacotes discretos de energia, os fótons, capazes de arrancar elétrons de um material quando têm frequência suficientemente alta — uma ideia que deu origem à física quântica. Já a Teoria da Relatividade Restrita, também de Einstein, mostrou que espaço e tempo não são absolutos: à medida que um objeto se aproxima da velocidade da luz, o tempo passa mais devagar para ele, em relação a um observador parado, um fenômeno chamado dilatação temporal.'
  },
  {
    id: 'pod_qui_modelos_atomicos',
    topicId: 'qui_modelos_atomicos',
    title: 'Modelos atômicos: a evolução da ideia de átomo',
    subject: 'Química',
    durationMinutes: 6,
    script: 'A ideia de átomo evoluiu bastante ao longo da história da ciência. Dalton propôs o átomo como uma esfera maciça e indivisível. Thomson, ao descobrir o elétron, propôs o modelo do pudim de passas, com cargas negativas espalhadas em uma massa positiva. Rutherford, com seu famoso experimento de bombardeamento de folhas de ouro, descobriu que o átomo tem um núcleo pequeno, denso e positivo, com os elétrons girando ao redor. Bohr aperfeiçoou esse modelo propondo que os elétrons ocupam níveis de energia específicos ao redor do núcleo. O modelo atual, quântico, descreve os elétrons como distribuições de probabilidade em regiões chamadas orbitais.'
  },
  {
    id: 'pod_qui_radioatividade',
    topicId: 'qui_radioatividade',
    title: 'Radioatividade: decaimento nuclear e meia-vida',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Radioatividade é a emissão espontânea de partículas ou radiação por núcleos atômicos instáveis, em busca de uma configuração mais estável. As partículas alfa correspondem a núcleos de hélio, com dois prótons e dois nêutrons; as partículas beta são elétrons ou pósitrons emitidos quando um nêutron se transforma em próton, ou vice-versa; e a radiação gama é uma forma de energia eletromagnética de altíssima frequência, sem massa ou carga. Um conceito central nesse tema é a meia-vida: o tempo necessário para que metade dos núcleos de uma amostra radioativa decaia — usado, por exemplo, na datação por carbono-14 e em tratamentos de radioterapia.'
  },
  {
    id: 'pod_qui_gases',
    topicId: 'qui_gases',
    title: 'Comportamento dos gases: das leis simples à equação geral',
    subject: 'Química',
    durationMinutes: 5,
    script: 'O comportamento de um gás ideal é descrito por relações entre pressão, volume, temperatura e quantidade de matéria. A Lei de Boyle mostra que, a temperatura constante, pressão e volume são inversamente proporcionais. Já a Lei de Charles relaciona volume e temperatura a pressão constante, e a Lei de Gay-Lussac relaciona pressão e temperatura a volume constante. Todas essas leis particulares estão contidas na Equação de Clapeyron, PV igual a nRT, que permite calcular qualquer uma dessas variáveis quando as demais são conhecidas — um tema frequentemente cobrado em contextos práticos, como o comportamento de gases em pneus ou processos industriais.'
  },
  {
    id: 'pod_qui_inorganica',
    topicId: 'qui_inorganica',
    title: 'Funções inorgânicas: ácidos, bases, sais e óxidos',
    subject: 'Química',
    durationMinutes: 6,
    script: 'A química inorgânica classifica as substâncias em quatro grandes funções: ácidos, que liberam íons H⁺ em solução aquosa; bases, que liberam íons hidroxila OH⁻; sais, formados na reação de neutralização entre um ácido e uma base, junto com água; e óxidos, compostos binários formados por oxigênio e outro elemento. Cada função tem propriedades características: ácidos e bases, por exemplo, têm comportamentos opostos em relação a indicadores como o papel tornassol, e sua força depende do grau de ionização ou dissociação em água. Reconhecer essas funções e prever produtos de reações entre elas é uma habilidade fundamental testada com frequência em vestibulares.'
  },
  {
    id: 'pod_qui_oxirreducao',
    topicId: 'qui_oxirreducao',
    title: 'Oxirredução: quem ganha e quem perde elétrons',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Reações de oxirredução envolvem a transferência de elétrons entre espécies químicas. A espécie que perde elétrons sofre oxidação, aumentando seu número de oxidação; a que ganha elétrons sofre redução, diminuindo seu número de oxidação. Para identificar corretamente esses processos, é essencial saber calcular o número de oxidação de cada elemento em uma substância ou íon, seguindo regras como a de que o oxigênio geralmente tem Nox menos dois e o hidrogênio, mais um. Esse tema é a base para entender pilhas, baterias, corrosão de metais e processos industriais de eletrólise, todos aplicações diretas da oxirredução no dia a dia.'
  },
  {
    id: 'pod_qui_organica_reacoes',
    topicId: 'qui_organica_reacoes',
    title: 'Reações orgânicas: substituição, adição e eliminação',
    subject: 'Química',
    durationMinutes: 6,
    script: 'As reações da química orgânica costumam ser classificadas em três grandes tipos. Nas reações de substituição, um átomo ou grupo de átomos é trocado por outro, comuns em compostos saturados, como os alcanos. Nas reações de adição, típicas de compostos com ligações duplas ou triplas, como os alcenos e alcinos, novos átomos se ligam à molécula, quebrando essas ligações múltiplas. Já nas reações de eliminação, o processo é o oposto: a molécula perde átomos, formando uma ligação dupla ou tripla onde antes havia apenas ligações simples. Reconhecer o tipo de reação a partir da estrutura dos reagentes é essencial para prever corretamente os produtos formados.'
  },
  {
    id: 'pod_qui_termoquimica',
    topicId: 'qui_termoquimica',
    title: 'Termoquímica: energia liberada ou absorvida nas reações',
    subject: 'Química',
    durationMinutes: 5,
    script: 'A termoquímica estuda as trocas de energia, geralmente na forma de calor, que ocorrem durante as reações químicas. Uma reação é exotérmica quando libera calor para o ambiente, com variação de entalpia negativa; e é endotérmica quando absorve calor, com variação de entalpia positiva. A Lei de Hess permite calcular a variação de entalpia de uma reação global somando as variações de etapas intermediárias, mesmo sem realizar o experimento diretamente — uma ferramenta poderosa para prever quanto de energia uma reação libera ou consome, com aplicações que vão de combustíveis a processos biológicos como o metabolismo.'
  },
  {
    id: 'pod_qui_cinetica',
    topicId: 'qui_cinetica',
    title: 'Cinética química: o que acelera ou retarda uma reação',
    subject: 'Química',
    durationMinutes: 6,
    script: 'A cinética química estuda a velocidade das reações e os fatores que a influenciam. O aumento da temperatura geralmente acelera uma reação, pois eleva a energia cinética média das partículas, tornando as colisões entre elas mais frequentes e mais eficazes. O aumento da concentração dos reagentes também tende a acelerar a reação, pela mesma lógica. Já um catalisador acelera a reação por um caminho diferente: ele reduz a energia de ativação necessária, sem ser consumido no processo. Entender esses fatores explica processos do cotidiano, como a conservação de alimentos na geladeira, que funciona reduzindo a temperatura para desacelerar reações.'
  },
  {
    id: 'pod_qui_eletroquimica',
    topicId: 'qui_eletroquimica',
    title: 'Eletroquímica: pilhas e eletrólise',
    subject: 'Química',
    durationMinutes: 5,
    script: 'A eletroquímica estuda a relação entre reações químicas e energia elétrica, em dois processos opostos. Nas pilhas, uma reação de oxirredução espontânea gera corrente elétrica: a oxidação ocorre no ânodo e a redução no cátodo, com os elétrons fluindo pelo circuito externo. Já na eletrólise, o processo é invertido: fornece-se energia elétrica externa para forçar a ocorrência de uma reação não espontânea, como na produção industrial de metais ou na eletrodeposição de camadas metálicas sobre um objeto, como no processo de niquelação ou cromagem.'
  },
  {
    id: 'pod_qui_equilibrio',
    topicId: 'qui_equilibrio',
    title: 'Equilíbrio químico e o Princípio de Le Chatelier',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Em uma reação reversível, o equilíbrio químico é atingido quando a velocidade da reação direta se iguala à da reação inversa, e as concentrações de reagentes e produtos permanecem constantes ao longo do tempo — embora as reações continuem ocorrendo nos dois sentidos. O Princípio de Le Chatelier prevê como esse equilíbrio responde a perturbações: aumentar a concentração de um reagente desloca o equilíbrio no sentido de consumi-lo; aumentar a pressão, em reações gasosas, desloca o equilíbrio para o lado com menor número de mols de gás; e alterações de temperatura favorecem o sentido endotérmico ou exotérmico da reação.'
  },
  {
    id: 'pod_geo_cartografia',
    topicId: 'geo_cartografia',
    title: 'Cartografia: como ler e interpretar mapas',
    subject: 'Geografia',
    durationMinutes: 5,
    script: 'A cartografia é a ciência de representar a superfície terrestre em mapas, e entender seus fundamentos é essencial para interpretar corretamente qualquer questão que envolva um mapa no vestibular. A escala indica a relação entre a distância representada no mapa e a distância real: uma escala de um para cinquenta mil, por exemplo, significa que cada centímetro no mapa equivale a cinquenta mil centímetros na realidade. As projeções cartográficas são formas de representar a superfície esférica da Terra em uma superfície plana, e cada uma distorce algum aspecto — a projeção de Mercator, por exemplo, preserva os ângulos, mas distorce bastante as áreas em latitudes altas.'
  },
  {
    id: 'pod_geo_climatologia_socioambiental',
    topicId: 'geo_climatologia_socioambiental',
    title: 'Climatologia e problemas socioambientais',
    subject: 'Geografia',
    durationMinutes: 6,
    script: 'O clima resulta da interação entre diversos fatores, como latitude, altitude, correntes marítimas e massas de ar, e seu estudo se conecta diretamente a problemas socioambientais contemporâneos. O efeito estufa intensificado, causado principalmente pelo aumento da concentração de gases como o gás carbônico e o metano na atmosfera, está relacionado às mudanças climáticas globais. Já a ilha de calor urbana ocorre porque o asfalto e o concreto das cidades retêm mais calor do que áreas rurais ou vegetadas, elevando a temperatura local. Compreender essas dinâmicas é essencial para discutir temas como aquecimento global, desertificação e eventos climáticos extremos.'
  },
  {
    id: 'pod_geo_hidrogeografia',
    topicId: 'geo_hidrogeografia',
    title: 'Hidrogeografia: rios, bacias e recursos hídricos',
    subject: 'Geografia',
    durationMinutes: 5,
    script: 'A hidrogeografia estuda a distribuição e o comportamento das águas continentais, como rios, lagos e aquíferos. Rios de planalto, com relevo acidentado e presença de corredeiras, têm grande potencial para geração de energia hidrelétrica, enquanto rios de planície, com menor declividade, favorecem a navegação. O Brasil possui uma das maiores reservas de água doce do mundo, incluindo o Aquífero Guarani, um dos maiores reservatórios subterrâneos do planeta. Esse tema costuma se conectar com questões de sustentabilidade e gestão dos recursos hídricos, especialmente diante de episódios recentes de escassez de água em diferentes regiões do país.'
  },
  {
    id: 'pod_geo_globalizacao_economica',
    topicId: 'geo_globalizacao_economica',
    title: 'Globalização e geografia econômica',
    subject: 'Geografia',
    durationMinutes: 5,
    script: 'A globalização intensificou a interconexão econômica entre os países, criando cadeias produtivas globais em que diferentes etapas de fabricação de um mesmo produto ocorrem em diferentes países, conforme a vantagem econômica de cada um. Esse processo também impulsionou a formação de blocos econômicos regionais, como o Mercosul e a União Europeia, que buscam reduzir barreiras comerciais entre seus membros e fortalecer sua posição no cenário internacional. Ao mesmo tempo, a globalização aprofundou desigualdades entre países centrais e periféricos, um tema central para entender a divisão internacional do trabalho na economia mundial contemporânea.'
  },
  {
    id: 'pod_geo_geopolitica_regional',
    topicId: 'geo_geopolitica_regional',
    title: 'Geopolítica regional contemporânea',
    subject: 'Geografia',
    durationMinutes: 6,
    script: 'A geopolítica contemporânea é marcada por conflitos e disputas regionais com raízes históricas profundas. O Oriente Médio, por exemplo, concentra disputas territoriais e religiosas, além de grande relevância estratégica pelas reservas de petróleo da região. Já agrupamentos como os BRICS reúnem potências emergentes — Brasil, Rússia, Índia, China, África do Sul, entre outros países que aderiram mais recentemente — buscando ampliar sua influência política e econômica frente a uma ordem internacional historicamente liderada por Estados Unidos e Europa Ocidental. Entender esses arranjos ajuda a interpretar notícias internacionais e questões de atualidades.'
  },
  {
    id: 'pod_geo_fisica_brasil',
    topicId: 'geo_fisica_brasil',
    title: 'Geografia física do Brasil: relevo, clima e biomas',
    subject: 'Geografia',
    durationMinutes: 6,
    script: 'O território brasileiro se caracteriza por um relevo antigo e bastante desgastado pela erosão, predominando planaltos e planícies de altitude moderada, sem grandes cadeias montanhosas jovens como os Andes. Essa estabilidade geológica está relacionada à localização do Brasil na Plataforma Sul-Americana. O país também abriga uma grande diversidade de biomas, com destaque para a Amazônia, o bioma de maior extensão territorial, concentrado principalmente na região Norte. Conhecer as características físicas do território é a base para entender temas mais aplicados, como distribuição populacional, atividades econômicas e problemas ambientais em cada região do país.'
  },
  {
    id: 'pod_geo_economica_brasil',
    topicId: 'geo_economica_brasil',
    title: 'Geografia econômica do Brasil: agronegócio e indústria',
    subject: 'Geografia',
    durationMinutes: 6,
    script: 'A economia brasileira combina um agronegócio forte, com destaque para exportações de soja, carne bovina e café, com um parque industrial historicamente concentrado na região Sudeste. Essa concentração industrial tem raízes históricas: o capital acumulado pela cafeicultura, a disponibilidade de mão de obra, a infraestrutura de transportes e a proximidade de um grande mercado consumidor favoreceram a instalação de indústrias na região desde o início do século vinte. Compreender essa geografia econômica ajuda a explicar desigualdades regionais no Brasil, conectando história econômica com a organização espacial da produção no país.'
  },
  {
    id: 'pod_geo_populacao_urbana_brasil',
    topicId: 'geo_populacao_urbana_brasil',
    title: 'População e urbanização no Brasil',
    subject: 'Geografia',
    durationMinutes: 6,
    script: 'O Brasil passou por um intenso processo de urbanização a partir da segunda metade do século vinte, impulsionado pelo êxodo rural e pela industrialização das cidades. Esse crescimento urbano, muitas vezes desordenado, gerou periferias e favelas, além de déficits de infraestrutura em várias regiões metropolitanas. Ao mesmo tempo, a pirâmide etária brasileira vem se transformando: a queda da taxa de natalidade e o aumento da expectativa de vida têm levado a um processo de envelhecimento populacional, estreitando a base e alargando o topo da pirâmide — transformações com implicações diretas para políticas públicas de saúde, previdência e planejamento urbano.'
  },
  {
    id: 'pod_his_idade_antiga',
    topicId: 'his_idade_antiga',
    title: 'Idade Antiga: Grécia e Roma',
    subject: 'História',
    durationMinutes: 5,
    script: 'A Grécia Antiga legou ao mundo ocidental conceitos fundamentais, como a democracia praticada em Atenas — uma democracia direta, mas restrita aos cidadãos do sexo masculino, livres e nascidos na cidade, excluindo mulheres, escravizados e estrangeiros. Já o Império Romano se destacou pela capacidade de administrar um vasto território ao redor do Mediterrâneo, apoiado em um sistema jurídico influente, o Direito Romano, e em obras de engenharia como estradas e aquedutos. Estudar essas duas civilizações é essencial para entender as raízes de instituições políticas, jurídicas e culturais que ainda influenciam o mundo contemporâneo.'
  },
  {
    id: 'pod_his_idade_media',
    topicId: 'his_idade_media',
    title: 'Idade Média: feudalismo e Cruzadas',
    subject: 'História',
    durationMinutes: 5,
    script: 'A Idade Média europeia foi organizada, em grande parte, pelo sistema feudal, baseado na posse da terra e em relações pessoais de vassalagem entre suseranos e vassalos, em um contexto de fragmentação do poder político após a queda do Império Romano do Ocidente. Nesse período também ocorreram as Cruzadas, expedições militares religiosas que combinaram motivações espirituais, como a reconquista de Jerusalém, com interesses econômicos e políticos da Igreja e da nobreza europeia. Compreender essa organização social e esses conflitos ajuda a explicar transformações posteriores, como o enfraquecimento do feudalismo e o fortalecimento dos poderes monárquicos centralizados.'
  },
  {
    id: 'pod_his_moderna_iluminismo',
    topicId: 'his_moderna_iluminismo',
    title: 'Idade Moderna e Iluminismo',
    subject: 'História',
    durationMinutes: 5,
    script: 'O Iluminismo, movimento intelectual do século dezoito, valorizava a razão como principal instrumento para compreender o mundo, criticando o absolutismo monárquico e os privilégios da nobreza e do clero do Antigo Regime. Pensadores como Voltaire, Montesquieu e Rousseau influenciaram diretamente processos revolucionários posteriores, com destaque para a Revolução Francesa de 1789, que derrubou o Antigo Regime na França e difundiu ideais como liberdade, igualdade e fraternidade — princípios que inspiraram movimentos constitucionais e revolucionários em diversas partes do mundo nos séculos seguintes.'
  },
  {
    id: 'pod_his_imperialismo_guerras',
    topicId: 'his_imperialismo_guerras',
    title: 'Imperialismo e Guerras Mundiais',
    subject: 'História',
    durationMinutes: 6,
    script: 'O imperialismo europeu do final do século dezenove, também chamado de neocolonialismo, foi impulsionado pela Segunda Revolução Industrial, que gerou necessidade de novas matérias-primas e mercados consumidores, levando à partilha da África e de parte da Ásia entre as potências europeias. Essa disputa por territórios, prestígio e poder, somada a rivalidades e alianças militares, culminou na Primeira Guerra Mundial, deflagrada após o assassinato do arquiduque Francisco Ferdinando em Sarajevo, em 1914. Já a Segunda Guerra Mundial, décadas depois, teve raízes nas tensões não resolvidas do pós-primeira guerra e no avanço de regimes totalitários na Europa.'
  },
  {
    id: 'pod_his_guerra_fria_contemporaneo',
    topicId: 'his_guerra_fria_contemporaneo',
    title: 'Guerra Fria e o mundo contemporâneo',
    subject: 'História',
    durationMinutes: 6,
    script: 'A Guerra Fria foi marcada pela disputa ideológica, econômica e tecnológica entre Estados Unidos e União Soviética após a Segunda Guerra Mundial, sem confronto militar direto entre as duas potências, mas com conflitos indiretos travados em outros países, como Coreia, Vietnã e Afeganistão. A queda do Muro de Berlim, em 1989, simbolizou o colapso do bloco socialista na Europa Oriental, sendo um marco central no processo que levaria ao fim da Guerra Fria e à posterior dissolução da União Soviética, em 1991. Compreender esse período é essencial para entender a configuração geopolítica do mundo atual.'
  },
  {
    id: 'pod_his_brasil_colonia',
    topicId: 'his_brasil_colonia',
    title: 'Brasil Colônia: economia e resistência',
    subject: 'História',
    durationMinutes: 5,
    script: 'A economia do Brasil Colônia era voltada à exportação, sustentada pelo trabalho escravizado, com destaque para o açúcar no período inicial e para o ouro durante o ciclo minerador do século dezoito. Nesse contexto de exploração colonial, surgiram movimentos de contestação ao domínio português, como a Inconfidência Mineira, de 1789, que envolveu setores da elite mineira insatisfeitos com a política fiscal portuguesa — sobretudo a ameaça da derrama — e influenciados por ideais iluministas e pelo exemplo da independência dos Estados Unidos.'
  },
  {
    id: 'pod_his_brasil_imperio',
    topicId: 'his_brasil_imperio',
    title: 'Brasil Império: independência e abolição',
    subject: 'História',
    durationMinutes: 5,
    script: 'A independência do Brasil, proclamada em 1822, manteve o regime monárquico e preservou estruturas herdadas do período colonial, como a escravidão e o latifúndio, configurando uma transição política sem rupturas sociais profundas. Ao longo do Império, a escravidão foi gradualmente contestada, até ser formalmente abolida pela Lei Áurea, em 1888. No entanto, essa abolição não veio acompanhada de políticas de reparação, terra ou inclusão social para os libertos, contribuindo para desigualdades estruturais que persistiram muito além do fim formal da escravidão no país.'
  },
  {
    id: 'pod_his_primeira_republica_vargas',
    topicId: 'his_primeira_republica_vargas',
    title: 'Primeira República e Era Vargas',
    subject: 'História',
    durationMinutes: 6,
    script: 'A Primeira República brasileira, entre 1889 e 1930, foi marcada pela política do café com leite, um acordo informal de revezamento na presidência entre as oligarquias paulista e mineira. Esse arranjo entrou em crise com a Revolução de 1930, que levou Getúlio Vargas ao poder. Durante o Estado Novo, entre 1937 e 1945, Vargas combinou um governo autoritário, com censura e repressão a opositores, com avanços na legislação trabalhista, como a criação da CLT — uma combinação que ajuda a explicar sua popularidade duradoura, apesar do caráter ditatorial do regime.'
  },
  {
    id: 'pod_his_republica_liberal_atual',
    topicId: 'his_republica_liberal_atual',
    title: 'Da ditadura militar à redemocratização',
    subject: 'História',
    durationMinutes: 5,
    script: 'A ditadura militar brasileira, entre 1964 e 1985, suprimiu direitos políticos, impôs censura e reprimiu opositores, mantendo-se no poder por 21 anos até a redemocratização. Esse processo de abertura política culminou na promulgação da Constituição de 1988, conhecida como Constituição Cidadã, que consolidou a redemocratização do país, ampliando direitos individuais, sociais e políticos após décadas de regime autoritário. Compreender essa transição é fundamental para entender as bases institucionais da democracia brasileira contemporânea e os desafios que ainda persistem na garantia efetiva desses direitos.'
  },
  {
    id: 'pod_por_norma_culta',
    topicId: 'por_norma_culta',
    title: 'Norma culta: concordância e crase sem decoreba',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Dominar a norma culta não significa decorar regras soltas, mas entender a lógica por trás delas. Verbos impessoais, como fazer indicando tempo decorrido ou haver no sentido de existir, permanecem sempre na terceira pessoa do singular, mesmo quando o restante da frase sugere plural — por isso se diz faz dois anos e houve muitos candidatos, nunca fazem ou houveram. Já a crase é a fusão da preposição a com o artigo feminino a, e só ocorre antes de palavras que admitem esse artigo — por isso não existe crase antes de pronomes como ela, você ou ele, nem em locuções masculinas como a pé.'
  },
  {
    id: 'pod_por_sintaxe',
    topicId: 'por_sintaxe',
    title: 'Análise sintática: identificando as funções da frase',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Analisar sintaticamente uma frase significa identificar a função de cada termo em relação ao verbo e ao restante da oração. O sujeito é quem pratica ou sofre a ação verbal; o objeto direto completa o sentido de verbos transitivos diretos, sem precisar de preposição; e o objeto indireto completa verbos transitivos indiretos, exigindo uma preposição. Já os adjuntos adverbiais expressam circunstâncias, como tempo, modo, causa ou concessão, sem serem exigidos obrigatoriamente pelo verbo. Reconhecer essas funções ajuda não só em questões de gramática, mas também na interpretação de textos mais complexos, já que a estrutura sintática organiza o sentido da frase.'
  },
  {
    id: 'pod_por_texto',
    topicId: 'por_texto',
    title: 'Entendimento de texto: tese, argumentos e coesão',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Entender um texto vai além de captar seu significado literal: é preciso identificar a tese central defendida pelo autor e como os argumentos se articulam para sustentá-la. Conectivos como por outro lado, portanto ou apesar disso funcionam como sinalizadores dessa articulação, indicando relações de contraste, conclusão ou concessão entre as ideias. Essa habilidade de identificar a estrutura argumentativa de um texto é exatamente o que provas de interpretação de texto avaliam, indo muito além de simplesmente localizar informações explícitas — exigindo também inferência e compreensão das relações lógicas entre as partes do texto.'
  },
  {
    id: 'pod_por_lit_classica_barroca',
    topicId: 'por_lit_classica_barroca',
    title: 'Literatura clássica, medieval e barroca',
    subject: 'Português',
    durationMinutes: 5,
    script: 'O Barroco, movimento literário marcado pelo conflito entre valores religiosos e terrenos, entre fé e razão, caracteriza-se estilisticamente pelo cultismo, um jogo elaborado de palavras e metáforas, e pelo conceptismo, um jogo de ideias baseado em argumentação lógica. No Brasil colonial, Gregório de Matos, conhecido como Boca do Inferno, é o principal representante desse movimento, com poemas satíricos, religiosos e líricos que retratam as contradições da sociedade baiana da época. Entender esse contexto de conflito entre opostos é essencial para interpretar corretamente textos barrocos.'
  },
  {
    id: 'pod_por_lit_romantismo_realismo',
    topicId: 'por_lit_romantismo_realismo',
    title: 'Romantismo e Realismo na literatura brasileira',
    subject: 'Português',
    durationMinutes: 6,
    script: 'O Romantismo, movimento do século dezenove, exaltava o sentimentalismo, a subjetividade e o nacionalismo, muitas vezes idealizando o amor, a natureza e a figura do índio, como no indianismo de José de Alencar. Já o Realismo, que sucedeu o Romantismo, reagiu contra essa idealização, propondo uma análise mais crítica e objetiva da sociedade e da psicologia dos personagens — como em Dom Casmurro, de Machado de Assis, com sua narrativa ambígua e complexa. Comparar esses dois movimentos, entendendo o que cada um valorizava e criticava no anterior, é uma estratégia eficiente para responder questões que pedem contraste entre estilos de época.'
  },
  {
    id: 'pod_por_lit_modernismo',
    topicId: 'por_lit_modernismo',
    title: 'Simbolismo, Pré-Modernismo e Modernismo',
    subject: 'Português',
    durationMinutes: 6,
    script: 'O Simbolismo, de fins do século dezenove, valorizava a musicalidade, a sugestão e o subjetivismo, em oposição à objetividade do Realismo e do Naturalismo, tendo Cruz e Sousa como principal nome no Brasil. Já a Semana de Arte Moderna de 1922, em São Paulo, é considerada o marco inaugural do Modernismo brasileiro, propondo uma ruptura com estéticas tradicionais, como o Parnasianismo, e buscando uma identidade artística nacional renovada, com nomes como Mário e Oswald de Andrade. Entender essa transição entre movimentos ajuda a situar cronologicamente e estilisticamente as obras cobradas em provas.'
  },
  {
    id: 'pod_por_lit_contemporanea',
    topicId: 'por_lit_contemporanea',
    title: 'Literatura brasileira contemporânea',
    subject: 'Português',
    durationMinutes: 5,
    script: 'A literatura brasileira contemporânea, produzida a partir de meados do século vinte até os dias atuais, caracteriza-se por uma grande diversidade de estilos, temas e vozes, com maior espaço para autores antes marginalizados e forte diálogo com temas sociais urgentes. Autores como Clarice Lispector, reconhecida pela profunda introspecção psicológica de sua prosa, e Guimarães Rosa, conhecido pela experimentação linguística em obras como Grande Sertão: Veredas, são exemplos centrais dessa renovação da linguagem literária no século vinte, que ainda influencia a produção literária brasileira atual.'
  },
  {
    id: 'pod_por_red_repertorio',
    topicId: 'por_red_repertorio',
    title: 'Repertório sociocultural: como usar a coletânea a seu favor',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Na redação do ENEM e de vestibulares similares, a coletânea de textos motivadores serve para contextualizar o tema, funcionando como ponto de partida — mas não como repertório suficiente por si só. É esperado que o candidato agregue repertório sociocultural próprio, evitando copiar ou apenas parafrasear os textos apresentados. Um repertório é considerado produtivo quando está efetivamente articulado ao argumento desenvolvido, contribuindo para sustentá-lo de forma pertinente ao tema — e não apenas citado de forma genérica, solto e sem conexão real com a linha argumentativa do texto.'
  },
  {
    id: 'pod_por_red_argumentacao',
    topicId: 'por_red_argumentacao',
    title: 'Introdução, argumentação e coerência na redação',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Uma boa introdução dissertativo-argumentativa contextualiza o tema e apresenta claramente a tese que será defendida ao longo do texto. No desenvolvimento, cada parágrafo deve apresentar um argumento consistente, sustentado por repertório sociocultural pertinente, como dados estatísticos de fontes confiáveis — sempre articulados ao raciocínio do parágrafo, e não apenas citados soltos. A coerência argumentativa exige que os parágrafos dialoguem entre si, sem contradições, mantendo o foco na tese apresentada desde a introdução até a conclusão do texto.'
  },
  {
    id: 'pod_por_red_estrutura_coesao',
    topicId: 'por_red_estrutura_coesao',
    title: 'Coesão, conclusão e proposta de intervenção',
    subject: 'Português',
    durationMinutes: 5,
    script: 'A coesão textual é o que garante a fluidez entre as partes de uma redação, por meio de conectivos e referências que ligam frases e parágrafos de forma clara e organizada. Na conclusão, o texto deve retomar a tese, sintetizando os principais argumentos apresentados, e, no caso do ENEM, apresentar uma proposta de intervenção completa — com um agente definido, um meio de execução e uma finalidade clara, sempre coerente com os argumentos desenvolvidos ao longo do texto, e não uma ideia solta ao final.'
  },
  {
    id: 'pod_por_red_direitos_modelo',
    topicId: 'por_red_direitos_modelo',
    title: 'Direitos humanos na redação: um princípio inegociável',
    subject: 'Português',
    durationMinutes: 5,
    script: 'Ao abordar temas sociais sensíveis, como violência ou desigualdade, em uma redação dissertativo-argumentativa, é fundamental manter uma perspectiva de defesa e respeito aos direitos humanos como princípio inegociável — bancas como a do ENEM podem até zerar redações que desrespeitem esse princípio. Isso vale também para a proposta de intervenção: mesmo diante de temas como criminalidade, a solução proposta deve respeitar os direitos humanos, evitando responsabilizar exclusivamente as vítimas ou defender soluções puramente punitivas, sem qualquer dimensão social ou preventiva.'
  },
  {
    id: 'pod_ing_01',
    topicId: 'ing_01',
    title: 'Reading comprehension: estratégias para o vestibular',
    subject: 'Inglês',
    durationMinutes: 5,
    script: 'Questões de compreensão de texto em inglês, comuns em vestibulares, avaliam sua capacidade de entender um texto sem depender de tradução palavra por palavra. Uma estratégia eficiente é o skimming, uma leitura rápida para captar a ideia geral do texto antes de ler as perguntas, seguida do scanning, uma busca direcionada por informações específicas que as questões exigem. Preste atenção especial a conectivos como although, however e therefore, que sinalizam relações de contraste, concessão ou conclusão entre as ideias — exatamente como conectivos equivalentes funcionam em português. Você não precisa entender cada palavra do texto: focar na estrutura geral e nesses sinalizadores geralmente é suficiente para responder corretamente à maioria das questões.'
  }
];

export const mockStudyMethods: StudyMethod[] = [
  {
    id: 'method_active_recall',
    name: 'Evocação Ativa (Active Recall)',
    category: 'retencao',
    summary: 'Testar sua memória ativamente é muito mais eficaz do que reler o material passivamente.',
    steps: [
      'Feche o material de estudo antes de começar.',
      'Tente escrever ou falar tudo que lembra sobre o tópico, sem consultar nada.',
      'Compare com o material original e identifique as lacunas.',
      'Repita o processo focando apenas nas lacunas encontradas.'
    ],
    bestFor: ['Revisão de conteúdo teórico', 'Preparação para questões discursivas']
  },
  {
    id: 'method_spaced_repetition',
    name: 'Repetição Espaçada',
    category: 'retencao',
    summary: 'Revisar o conteúdo em intervalos crescentes de tempo consolida a memória de longo prazo.',
    steps: [
      'Revise um tópico novo no dia seguinte ao primeiro contato.',
      'Se lembrar bem, aumente o intervalo até a próxima revisão (ex: 3 dias, depois 7, depois 15).',
      'Se errar ou tiver dúvida, reduza o intervalo e revise antes.',
      'Use a tela de Revisões Adaptativas para acompanhar o que está vencendo.'
    ],
    bestFor: ['Matérias com muito conteúdo decorável', 'Fórmulas e definições']
  },
  {
    id: 'method_feynman',
    name: 'Técnica de Feynman',
    category: 'aquisicao',
    summary: 'Explicar um conceito em linguagem simples revela exatamente onde está sua lacuna de entendimento.',
    steps: [
      'Escolha um conceito e escreva o nome dele no topo de uma folha.',
      'Explique-o como se estivesse ensinando para alguém de 12 anos, sem jargões.',
      'Onde você travar ou usar termos complicados, volte ao material de estudo.',
      'Simplifique a explicação até ficar clara e fluida.'
    ],
    bestFor: ['Conceitos abstratos de Física e Química', 'Preparação para o Tutor Socrático']
  },
  {
    id: 'method_interleaving',
    name: 'Prática Intercalada (Interleaving)',
    category: 'aplicacao',
    summary: 'Alternar entre matérias ou tipos de problema numa mesma sessão melhora a capacidade de reconhecer qual estratégia usar.',
    steps: [
      'Em vez de fazer 20 questões seguidas do mesmo tópico, misture 2-3 tópicos relacionados.',
      'Alterne a ordem a cada sessão para evitar prever o próximo tipo de questão.',
      'Foque em identificar qual conceito a questão está testando antes de resolver.'
    ],
    bestFor: ['Simulados', 'Revisão final antes da prova']
  },
  {
    id: 'method_pomodoro',
    name: 'Pomodoro',
    category: 'foco',
    summary: 'Blocos curtos e cronometrados de foco intenso, intercalados com pausas curtas, sustentam a concentração por mais tempo.',
    steps: [
      'Escolha uma única tarefa de estudo.',
      'Estude com foco total por 25 minutos, sem distrações.',
      'Faça uma pausa de 5 minutos.',
      'A cada 4 ciclos, faça uma pausa mais longa de 15 a 30 minutos.'
    ],
    bestFor: ['Dias de baixa energia ou dificuldade de concentração', 'Sessões de estudo em casa']
  },
  {
    id: 'method_elaboration',
    name: 'Interrogação Elaborativa',
    category: 'aquisicao',
    summary: 'Perguntar "por quê" e "como" a cada novo fato conecta o conhecimento novo ao que você já sabe.',
    steps: [
      'Ao ler um fato novo, pare e pergunte "por que isso é verdade?".',
      'Tente responder com o que você já sabe antes de checar a resposta.',
      'Conecte explicitamente o novo conceito a outro que você já domina.'
    ],
    bestFor: ['Biologia e Química conceituais', 'Conexões interdisciplinares']
  }
];

export const mockBacklog: BacklogItem[] = [
  {
    id: 'backlog_qui_03',
    topicId: 'qui_organica_fundamentos',
    state: 1,
    dependencia: 2,
    incidencia: 3,
    lacuna: 3,
    urgencia: 2,
    custo: 2,
    independentSuccesses: 0,
    canExplainTypicalError: false,
    dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'backlog_mat_06',
    topicId: 'mat_trigonometria',
    state: 2,
    dependencia: 1,
    incidencia: 2,
    lacuna: 2,
    urgencia: 1,
    custo: 2,
    independentSuccesses: 1,
    canExplainTypicalError: false,
    dateAdded: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
];
