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
  autonomyIndex: 35 // starts low, increases over time
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
  // Biologia — Citologia
  {
    id: 'q_bio_01_1',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Qual organela é responsável pela produção de ATP através da respiração celular aeróbica?',
    options: [
      { id: 'a', text: 'Complexo de Golgi' },
      { id: 'b', text: 'Mitocôndria' },
      { id: 'c', text: 'Retículo endoplasmático liso' },
      { id: 'd', text: 'Lisossomo' }
    ],
    correctOptionId: 'b',
    explanation: 'A mitocôndria realiza a fosforilação oxidativa na cadeia transportadora de elétrons, gerando a maior parte do ATP celular.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_01_2',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'Qual estrutura é responsável pela síntese de proteínas na célula?',
    options: [
      { id: 'a', text: 'Ribossomo' },
      { id: 'b', text: 'Complexo de Golgi' },
      { id: 'c', text: 'Peroxissomo' },
      { id: 'd', text: 'Vacúolo' }
    ],
    correctOptionId: 'a',
    explanation: 'Os ribossomos traduzem o RNA mensageiro em cadeias polipeptídicas, sendo a estrutura responsável pela síntese proteica, livres no citoplasma ou aderidos ao retículo endoplasmático rugoso.',
    difficulty: 'easy'
  },
  // Biologia — Genética
  {
    id: 'q_bio_02_1',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'No cruzamento entre dois heterozigotos (Aa x Aa), qual a proporção fenotípica esperada considerando dominância completa?',
    options: [
      { id: 'a', text: '1:1' },
      { id: 'b', text: '1:2:1' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '9:3:3:1' }
    ],
    correctOptionId: 'c',
    explanation: 'Com dominância completa, o cruzamento Aa x Aa produz genótipos na proporção 1AA:2Aa:1aa, resultando em fenótipos 3 dominantes : 1 recessivo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_02_2',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Qual é a probabilidade de dois indivíduos heterozigotos Aa gerarem um filho homozigoto recessivo (aa)?',
    options: [
      { id: 'a', text: '0%' },
      { id: 'b', text: '25%' },
      { id: 'c', text: '50%' },
      { id: 'd', text: '75%' }
    ],
    correctOptionId: 'b',
    explanation: 'No cruzamento Aa x Aa, a proporção genotípica esperada é 1AA:2Aa:1aa, portanto 1/4 (25%) de chance de gerar um filho aa.',
    difficulty: 'medium'
  },
  // Biologia — Fisiologia Humana
  {
    id: 'q_bio_03_1',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Qual câmara do coração bombeia sangue oxigenado para todo o corpo através da artéria aorta?',
    options: [
      { id: 'a', text: 'Átrio direito' },
      { id: 'b', text: 'Ventrículo direito' },
      { id: 'c', text: 'Átrio esquerdo' },
      { id: 'd', text: 'Ventrículo esquerdo' }
    ],
    correctOptionId: 'd',
    explanation: 'O ventrículo esquerdo recebe sangue oxigenado do átrio esquerdo (vindo dos pulmões) e o bombeia com alta pressão para a aorta, distribuindo-o para todo o corpo.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_03_2',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Qual é a principal função dos néfrons nos rins?',
    options: [
      { id: 'a', text: 'Produzir hemácias' },
      { id: 'b', text: 'Filtrar o sangue e formar a urina' },
      { id: 'c', text: 'Armazenar bile' },
      { id: 'd', text: 'Regular a temperatura corporal' }
    ],
    correctOptionId: 'b',
    explanation: 'Os néfrons são as unidades funcionais dos rins, responsáveis por filtrar o sangue, reabsorver substâncias úteis e formar a urina, eliminando excretas e regulando o equilíbrio hídrico.',
    difficulty: 'easy'
  },
  // Biologia — Ecologia
  {
    id: 'q_bio_04_1',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Em uma cadeia alimentar, qual nível trófico é ocupado pelos organismos que realizam fotossíntese?',
    options: [
      { id: 'a', text: 'Consumidores primários' },
      { id: 'b', text: 'Consumidores secundários' },
      { id: 'c', text: 'Produtores' },
      { id: 'd', text: 'Decompositores' }
    ],
    correctOptionId: 'c',
    explanation: 'Os produtores (como plantas e algas) realizam fotossíntese, convertendo energia luminosa em energia química, e ocupam a base de toda cadeia alimentar.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_04_2',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O que caracteriza uma relação de mutualismo entre duas espécies?',
    options: [
      { id: 'a', text: 'Uma espécie se beneficia e a outra é prejudicada' },
      { id: 'b', text: 'Ambas as espécies se beneficiam e frequentemente dependem uma da outra' },
      { id: 'c', text: 'Uma espécie se beneficia e a outra não é afetada' },
      { id: 'd', text: 'Ambas as espécies competem pelo mesmo recurso' }
    ],
    correctOptionId: 'b',
    explanation: 'No mutualismo, as duas espécies envolvidas se beneficiam da interação, muitas vezes de forma obrigatória, como no caso de líquens (fungos e algas/cianobactérias).',
    difficulty: 'medium'
  },
  // Biologia — Evolução
  {
    id: 'q_bio_05_1',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'Segundo a teoria da seleção natural de Darwin, o que determina a sobrevivência e reprodução diferencial dos indivíduos em uma população?',
    options: [
      { id: 'a', text: 'O uso e desuso das características' },
      { id: 'b', text: 'Características adquiridas durante a vida' },
      { id: 'c', text: 'Variações hereditárias mais adaptadas ao ambiente' },
      { id: 'd', text: 'A vontade do organismo em se adaptar' }
    ],
    correctOptionId: 'c',
    explanation: 'A seleção natural atua sobre variações hereditárias já existentes na população; indivíduos com características mais adaptadas ao ambiente tendem a sobreviver e deixar mais descendentes.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_05_2',
    topicId: 'bio_evolucao',
    subject: 'Biologia',
    prompt: 'O que é especiação por isolamento geográfico (alopátrica)?',
    options: [
      { id: 'a', text: 'Formação de novas espécies quando populações são separadas fisicamente e acumulam diferenças genéticas independentes' },
      { id: 'b', text: 'Formação de espécies na mesma área geográfica sem qualquer barreira' },
      { id: 'c', text: 'Extinção de uma espécie por competição' },
      { id: 'd', text: 'Cruzamento entre espécies diferentes' }
    ],
    correctOptionId: 'a',
    explanation: 'Na especiação alopátrica, uma barreira geográfica separa populações de uma mesma espécie; isoladas, elas acumulam mutações e adaptações distintas até não conseguirem mais se reproduzir entre si.',
    difficulty: 'medium'
  },
  // Biologia — Microbiologia e Imunologia
  {
    id: 'q_bio_06_1',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Qual estrutura é comum a todas as bactérias e ausente nas células eucarióticas?',
    options: [
      { id: 'a', text: 'Núcleo delimitado por membrana' },
      { id: 'b', text: 'Parede celular de peptideoglicano' },
      { id: 'c', text: 'Mitocôndrias' },
      { id: 'd', text: 'Retículo endoplasmático' }
    ],
    correctOptionId: 'b',
    explanation: 'As bactérias possuem parede celular composta por peptideoglicano (característica exclusiva de procariontes) e não possuem núcleo delimitado por membrana nem organelas membranosas complexas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_06_2',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Qual é a principal diferença entre imunidade inata e imunidade adaptativa?',
    options: [
      { id: 'a', text: 'A inata é específica e tem memória; a adaptativa não' },
      { id: 'b', text: 'A inata é rápida e inespecífica; a adaptativa é mais lenta, específica e gera memória' },
      { id: 'c', text: 'Apenas a adaptativa existe em humanos' },
      { id: 'd', text: 'A inata só atua contra vírus' }
    ],
    correctOptionId: 'b',
    explanation: 'A imunidade inata é a primeira linha de defesa, rápida mas inespecífica (ex: barreiras físicas, fagócitos). A imunidade adaptativa é mais lenta para se desenvolver, porém específica e gera células de memória, base da vacinação.',
    difficulty: 'hard'
  },
  // Matemática — Funções de 1º Grau
  {
    id: 'q_mat_01_1',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é o valor de x para que a função f(x) = 2x - 6 seja igual a zero?',
    options: [
      { id: 'a', text: 'x = -3' },
      { id: 'b', text: 'x = 0' },
      { id: 'c', text: 'x = 3' },
      { id: 'd', text: 'x = 6' }
    ],
    correctOptionId: 'c',
    explanation: 'Isolando x: 2x - 6 = 0 → 2x = 6 → x = 3. Essa é a raiz da função, onde o gráfico cruza o eixo x.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_01_2',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é o coeficiente angular da reta representada pela função f(x) = -3x + 7?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '-3' },
      { id: 'c', text: '3' },
      { id: 'd', text: '-7' }
    ],
    correctOptionId: 'b',
    explanation: 'Na forma f(x) = ax + b, o coeficiente angular é o valor de a, que determina a inclinação da reta. Aqui, a = -3, indicando uma função decrescente.',
    difficulty: 'easy'
  },
  // Matemática — Análise Combinatória
  {
    id: 'q_mat_02_1',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'De quantas formas 3 pessoas podem se sentar em 3 cadeiras em fila?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '6' },
      { id: 'c', text: '9' },
      { id: 'd', text: '12' }
    ],
    correctOptionId: 'b',
    explanation: 'É uma permutação simples de 3 elementos: 3! = 3 × 2 × 1 = 6 formas distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_02_2',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'Uma senha é formada por 4 dígitos distintos, escolhidos entre 0 e 9. Quantas senhas diferentes podem ser formadas?',
    options: [
      { id: 'a', text: '5040' },
      { id: 'b', text: '10000' },
      { id: 'c', text: '210' },
      { id: 'd', text: '720' }
    ],
    correctOptionId: 'a',
    explanation: 'É um arranjo simples de 10 elementos tomados 4 a 4 (ordem importa, sem repetição): A(10,4) = 10×9×8×7 = 5040.',
    difficulty: 'hard'
  },
  // Matemática — Funções de 2º Grau
  {
    id: 'q_mat_03_1',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é o valor do discriminante (Δ) da função f(x) = x² - 5x + 6?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '-1' },
      { id: 'c', text: '49' },
      { id: 'd', text: '25' }
    ],
    correctOptionId: 'a',
    explanation: 'Δ = b² - 4ac = (-5)² - 4(1)(6) = 25 - 24 = 1. Como Δ > 0, a função possui duas raízes reais distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_03_2',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é o vértice da parábola representada por f(x) = x² - 4x + 3?',
    options: [
      { id: 'a', text: '(2, -1)' },
      { id: 'b', text: '(-2, 1)' },
      { id: 'c', text: '(2, 1)' },
      { id: 'd', text: '(4, 3)' }
    ],
    correctOptionId: 'a',
    explanation: 'xv = -b/2a = 4/2 = 2. yv = f(2) = 4 - 8 + 3 = -1. O vértice é (2, -1), ponto de mínimo da parábola (concavidade para cima).',
    difficulty: 'medium'
  },
  // Matemática — Geometria Plana
  {
    id: 'q_mat_04_1',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a área de um triângulo retângulo com catetos medindo 6 cm e 8 cm?',
    options: [
      { id: 'a', text: '14 cm²' },
      { id: 'b', text: '24 cm²' },
      { id: 'c', text: '48 cm²' },
      { id: 'd', text: '28 cm²' }
    ],
    correctOptionId: 'b',
    explanation: 'A área do triângulo é (base × altura) / 2. Usando os catetos como base e altura: (6 × 8) / 2 = 24 cm².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_04_2',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um círculo tem raio de 5 cm. Qual é aproximadamente sua área, considerando π ≈ 3,14?',
    options: [
      { id: 'a', text: '15,7 cm²' },
      { id: 'b', text: '31,4 cm²' },
      { id: 'c', text: '78,5 cm²' },
      { id: 'd', text: '157 cm²' }
    ],
    correctOptionId: 'c',
    explanation: 'A área do círculo é π × r². Com r = 5: 3,14 × 25 = 78,5 cm².',
    difficulty: 'easy'
  },
  // Matemática — Probabilidade
  {
    id: 'q_mat_05_1',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Ao lançar um dado de 6 faces uma vez, qual a probabilidade de obter um número par?',
    options: [
      { id: 'a', text: '1/6' },
      { id: 'b', text: '1/3' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '2/3' }
    ],
    correctOptionId: 'c',
    explanation: 'Há 3 números pares (2, 4, 6) em 6 possibilidades totais, logo a probabilidade é 3/6 = 1/2.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_05_2',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Em uma urna há 4 bolas vermelhas e 6 bolas azuis. Retirando uma bola ao acaso, qual a probabilidade de ela ser vermelha?',
    options: [
      { id: 'a', text: '0,2' },
      { id: 'b', text: '0,4' },
      { id: 'c', text: '0,5' },
      { id: 'd', text: '0,6' }
    ],
    correctOptionId: 'b',
    explanation: 'A probabilidade é o número de casos favoráveis sobre o total: 4 vermelhas / 10 bolas totais = 0,4 (40%).',
    difficulty: 'easy'
  },
  // Matemática — Trigonometria
  {
    id: 'q_mat_06_1',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Qual é o valor de sen(30°)?',
    options: [
      { id: 'a', text: '0' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '√2/2' },
      { id: 'd', text: '√3/2' }
    ],
    correctOptionId: 'b',
    explanation: 'sen(30°) = 1/2 é um dos valores notáveis da trigonometria, obtido a partir do triângulo retângulo de ângulos 30-60-90.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_06_2',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Em um triângulo retângulo, o cateto oposto a um ângulo mede 3 e a hipotenusa mede 5. Qual é o valor do cosseno desse ângulo?',
    options: [
      { id: 'a', text: '3/5' },
      { id: 'b', text: '4/5' },
      { id: 'c', text: '3/4' },
      { id: 'd', text: '5/4' }
    ],
    correctOptionId: 'b',
    explanation: 'Pelo Teorema de Pitágoras, o cateto adjacente é √(5² - 3²) = √16 = 4. Como cosseno = cateto adjacente/hipotenusa, cos = 4/5.',
    difficulty: 'medium'
  },
  // Física — Cinemática
  {
    id: 'q_fis_01_1',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um corpo parte do repouso com aceleração constante de 2 m/s². Qual sua velocidade após 5 segundos?',
    options: [
      { id: 'a', text: '2,5 m/s' },
      { id: 'b', text: '5 m/s' },
      { id: 'c', text: '7 m/s' },
      { id: 'd', text: '10 m/s' }
    ],
    correctOptionId: 'd',
    explanation: 'Usando v = v0 + a·t, com v0 = 0: v = 2 × 5 = 10 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_01_2',
    topicId: 'fis_cinematica',
    subject: 'Física',
    prompt: 'Um objeto é lançado verticalmente para cima com velocidade inicial de 20 m/s. Desprezando a resistência do ar (g = 10 m/s²), quanto tempo leva para atingir a altura máxima?',
    options: [
      { id: 'a', text: '1 s' },
      { id: 'b', text: '2 s' },
      { id: 'c', text: '3 s' },
      { id: 'd', text: '4 s' }
    ],
    correctOptionId: 'b',
    explanation: 'Na altura máxima, v = 0. Usando v = v0 - g·t: 0 = 20 - 10t → t = 2 s.',
    difficulty: 'medium'
  },
  // Física — Eletrodinâmica
  {
    id: 'q_fis_02_1',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Em um circuito com dois resistores de 10Ω em série ligados a uma fonte de 20V, qual a corrente total no circuito?',
    options: [
      { id: 'a', text: '0,5 A' },
      { id: 'b', text: '1 A' },
      { id: 'c', text: '2 A' },
      { id: 'd', text: '4 A' }
    ],
    correctOptionId: 'b',
    explanation: 'Resistência equivalente em série: 10 + 10 = 20Ω. Pela Lei de Ohm, I = V/R = 20/20 = 1 A.',
    difficulty: 'hard'
  },
  {
    id: 'q_fis_02_2',
    topicId: 'fis_circuitos',
    subject: 'Física',
    prompt: 'Dois resistores de 10Ω cada estão associados em paralelo. Qual é a resistência equivalente?',
    options: [
      { id: 'a', text: '20Ω' },
      { id: 'b', text: '10Ω' },
      { id: 'c', text: '5Ω' },
      { id: 'd', text: '2Ω' }
    ],
    correctOptionId: 'c',
    explanation: 'Em paralelo, 1/Req = 1/10 + 1/10 = 2/10, logo Req = 10/2 = 5Ω.',
    difficulty: 'medium'
  },
  // Física — Dinâmica
  {
    id: 'q_fis_03_1',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'Segundo a Segunda Lei de Newton, qual é a força resultante necessária para acelerar um corpo de 5 kg a 4 m/s²?',
    options: [
      { id: 'a', text: '1,25 N' },
      { id: 'b', text: '9 N' },
      { id: 'c', text: '20 N' },
      { id: 'd', text: '0,8 N' }
    ],
    correctOptionId: 'c',
    explanation: 'F = m × a = 5 × 4 = 20 N, conforme a Segunda Lei de Newton (F = m.a).',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_03_2',
    topicId: 'fis_leis_newton',
    subject: 'Física',
    prompt: 'De acordo com a Terceira Lei de Newton (ação e reação), quando você empurra uma parede, o que acontece?',
    options: [
      { id: 'a', text: 'Nada acontece com a parede' },
      { id: 'b', text: 'A parede exerce sobre você uma força de mesma intensidade e direção oposta' },
      { id: 'c', text: 'A parede exerce uma força maior sobre você' },
      { id: 'd', text: 'A força de reação ocorre apenas em objetos com massa maior' }
    ],
    correctOptionId: 'b',
    explanation: 'A Terceira Lei de Newton afirma que para toda ação há uma reação de mesma intensidade, mesma direção e sentido oposto, atuando em corpos diferentes — por isso a parede "empurra de volta".',
    difficulty: 'medium'
  },
  // Física — Termologia
  {
    id: 'q_fis_04_1',
    topicId: 'fis_calorimetria',
    subject: 'Física',
    prompt: 'Um corpo recebe 500 cal de calor e sua temperatura varia de 20°C para 30°C. Sabendo que sua massa é 100g, qual é o calor específico do material (Q = m·c·ΔT)?',
    options: [
      { id: 'a', text: '0,5 cal/g°C' },
      { id: 'b', text: '1 cal/g°C' },
      { id: 'c', text: '5 cal/g°C' },
      { id: 'd', text: '0,1 cal/g°C' }
    ],
    correctOptionId: 'a',
    explanation: 'Q = m·c·ΔT → 500 = 100 × c × 10 → c = 500/1000 = 0,5 cal/g°C.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_04_2',
    topicId: 'fis_termodinamica_gases',
    subject: 'Física',
    prompt: 'O que ocorre com as moléculas de um gás quando sua temperatura aumenta, mantendo o volume constante?',
    options: [
      { id: 'a', text: 'Diminuem de velocidade e a pressão cai' },
      { id: 'b', text: 'Aumentam de velocidade média, aumentando a pressão' },
      { id: 'c', text: 'Param de se mover' },
      { id: 'd', text: 'Reduzem de tamanho' }
    ],
    correctOptionId: 'b',
    explanation: 'O aumento de temperatura eleva a energia cinética média das moléculas, fazendo-as se mover mais rápido e colidir com mais frequência e intensidade nas paredes do recipiente, aumentando a pressão (Lei de Gay-Lussac).',
    difficulty: 'medium'
  },
  // Física — Óptica
  {
    id: 'q_fis_05_1',
    topicId: 'fis_optica_geometrica',
    subject: 'Física',
    prompt: 'O que causa a formação do arco-íris na atmosfera?',
    options: [
      { id: 'a', text: 'Reflexão da luz solar em nuvens' },
      { id: 'b', text: 'Refração e dispersão da luz branca ao atravessar gotas de água' },
      { id: 'c', text: 'Absorção seletiva de cores pelo ar' },
      { id: 'd', text: 'Difração da luz em partículas de poeira' }
    ],
    correctOptionId: 'b',
    explanation: 'A luz branca do sol, ao entrar nas gotas de água, sofre refração, reflexão interna e nova refração, sendo decomposta (dispersa) em suas cores componentes devido aos diferentes índices de refração de cada comprimento de onda.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_05_2',
    topicId: 'fis_optica_instrumental',
    subject: 'Física',
    prompt: 'Uma pessoa míope enxerga mal objetos distantes porque a imagem se forma:',
    options: [
      { id: 'a', text: 'Atrás da retina' },
      { id: 'b', text: 'Exatamente sobre a retina' },
      { id: 'c', text: 'Na frente da retina' },
      { id: 'd', text: 'Fora do olho' }
    ],
    correctOptionId: 'c',
    explanation: 'Na miopia, o olho é mais "alongado" ou o cristalino tem convergência excessiva, fazendo a imagem de objetos distantes se formar antes da retina. Corrige-se com lentes divergentes (côncavas).',
    difficulty: 'easy'
  },
  // Física — Ondulatória
  {
    id: 'q_fis_06_1',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'Uma onda tem frequência de 50 Hz e comprimento de onda de 4 m. Qual é sua velocidade de propagação?',
    options: [
      { id: 'a', text: '12,5 m/s' },
      { id: 'b', text: '54 m/s' },
      { id: 'c', text: '200 m/s' },
      { id: 'd', text: '46 m/s' }
    ],
    correctOptionId: 'c',
    explanation: 'A velocidade de propagação é v = λ × f = 4 × 50 = 200 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_06_2',
    topicId: 'fis_ondulatoria',
    subject: 'Física',
    prompt: 'O que caracteriza o fenômeno da ressonância?',
    options: [
      { id: 'a', text: 'Duas ondas se anulando completamente' },
      { id: 'b', text: 'Um sistema vibrando com amplitude máxima ao receber energia numa frequência igual à sua frequência natural' },
      { id: 'c', text: 'A reflexão de uma onda numa superfície' },
      { id: 'd', text: 'A mudança de meio de propagação de uma onda' }
    ],
    correctOptionId: 'b',
    explanation: 'Ressonância ocorre quando um sistema é forçado a vibrar numa frequência igual à sua frequência natural de oscilação, resultando em amplitude de vibração muito maior — como um copo de cristal quebrando com um som na frequência certa.',
    difficulty: 'hard'
  },
  // Química — Estequiometria
  {
    id: 'q_qui_01_1',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Na reação 2H₂ + O₂ → 2H₂O, quantos mols de água são produzidos a partir de 4 mols de H₂ (com O₂ em excesso)?',
    options: [
      { id: 'a', text: '2 mols' },
      { id: 'b', text: '4 mols' },
      { id: 'c', text: '8 mols' },
      { id: 'd', text: '1 mol' }
    ],
    correctOptionId: 'b',
    explanation: 'Pela proporção estequiométrica da equação balanceada, 2 mols de H₂ produzem 2 mols de H₂O (proporção 1:1). Logo, 4 mols de H₂ produzem 4 mols de H₂O.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_01_2',
    topicId: 'qui_estequiometria',
    subject: 'Química',
    prompt: 'Qual é a massa molar aproximada do CO₂ (considerando C = 12 g/mol e O = 16 g/mol)?',
    options: [
      { id: 'a', text: '28 g/mol' },
      { id: 'b', text: '32 g/mol' },
      { id: 'c', text: '44 g/mol' },
      { id: 'd', text: '16 g/mol' }
    ],
    correctOptionId: 'c',
    explanation: 'Massa molar do CO₂ = 12 (C) + 2×16 (O) = 12 + 32 = 44 g/mol.',
    difficulty: 'easy'
  },
  // Química — Ligações Químicas
  {
    id: 'q_qui_02_1',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'Qual tipo de ligação química ocorre entre um metal e um ametal, com transferência de elétrons?',
    options: [
      { id: 'a', text: 'Ligação covalente' },
      { id: 'b', text: 'Ligação metálica' },
      { id: 'c', text: 'Ligação iônica' },
      { id: 'd', text: 'Ligação de hidrogênio' }
    ],
    correctOptionId: 'c',
    explanation: 'A ligação iônica ocorre pela transferência de elétrons de um átomo (geralmente metal, que perde elétrons) para outro (geralmente ametal, que ganha elétrons), formando íons de cargas opostas que se atraem.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_02_2',
    topicId: 'qui_polaridade_geometria',
    subject: 'Química',
    prompt: 'Por que a molécula de água (H₂O) é polar?',
    options: [
      { id: 'a', text: 'Porque possui apenas ligações covalentes apolares' },
      { id: 'b', text: 'Porque tem geometria angular e diferença de eletronegatividade entre H e O, gerando um dipolo elétrico' },
      { id: 'c', text: 'Porque é uma molécula iônica' },
      { id: 'd', text: 'Porque não possui pares de elétrons não ligantes' }
    ],
    correctOptionId: 'b',
    explanation: 'O oxigênio é mais eletronegativo que o hidrogênio e a molécula tem geometria angular (não linear), fazendo com que os vetores de dipolo não se cancelem, resultando em uma molécula polar — essencial para as propriedades da água.',
    difficulty: 'medium'
  },
  // Química — Química Orgânica
  {
    id: 'q_qui_03_1',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Qual é o nome do composto orgânico mais simples da função álcool, com um único átomo de carbono?',
    options: [
      { id: 'a', text: 'Metanol' },
      { id: 'b', text: 'Etanol' },
      { id: 'c', text: 'Metano' },
      { id: 'd', text: 'Ácido fórmico' }
    ],
    correctOptionId: 'a',
    explanation: 'O metanol (CH₃OH) é o álcool mais simples, com um átomo de carbono ligado a uma hidroxila (-OH), grupo funcional característico dos álcoois.',
    difficulty: 'easy'
  },
  {
    id: 'q_qui_03_2',
    topicId: 'qui_organica_fundamentos',
    subject: 'Química',
    prompt: 'Qual é a principal característica que define um hidrocarboneto?',
    options: [
      { id: 'a', text: 'Conter apenas átomos de carbono e hidrogênio' },
      { id: 'b', text: 'Conter obrigatoriamente oxigênio' },
      { id: 'c', text: 'Ser sempre um composto cíclico' },
      { id: 'd', text: 'Conter nitrogênio na cadeia' }
    ],
    correctOptionId: 'a',
    explanation: 'Hidrocarbonetos são compostos orgânicos formados exclusivamente por átomos de carbono e hidrogênio, como o metano (CH₄) e o etano (C₂H₆).',
    difficulty: 'easy'
  },
  // Química — Soluções e Concentração
  {
    id: 'q_qui_04_1',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'Uma solução foi preparada dissolvendo 20 g de sal em 500 mL de água. Qual é a concentração em g/L?',
    options: [
      { id: 'a', text: '20 g/L' },
      { id: 'b', text: '40 g/L' },
      { id: 'c', text: '10 g/L' },
      { id: 'd', text: '4 g/L' }
    ],
    correctOptionId: 'b',
    explanation: 'Concentração (g/L) = massa do soluto (g) / volume da solução (L) = 20 / 0,5 = 40 g/L.',
    difficulty: 'medium'
  },
  {
    id: 'q_qui_04_2',
    topicId: 'qui_solucoes',
    subject: 'Química',
    prompt: 'O que significa dizer que uma solução está "saturada"?',
    options: [
      { id: 'a', text: 'Ela contém mais soluto do que consegue dissolver, com corpo de fundo' },
      { id: 'b', text: 'Ela atingiu a quantidade máxima de soluto dissolvido para aquela temperatura, sem sobra' },
      { id: 'c', text: 'Ela contém apenas água pura' },
      { id: 'd', text: 'Ela está sempre em ebulição' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma solução saturada é aquela que atingiu o limite de solubilidade do soluto naquela temperatura — dissolveu o máximo possível sem formar precipitado. Além desse ponto, o excesso forma corpo de fundo.',
    difficulty: 'medium'
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
  // Física — Dinâmica Impulsiva
  {
    id: 'q_fis_dinamica_impulsiva_1',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Um corpo de massa 2 kg tem sua velocidade alterada de 3 m/s para 8 m/s por uma força constante durante 0,5 s. Qual é o impulso dessa força sobre o corpo?',
    options: [
      { id: 'a', text: '2,5 N·s' },
      { id: 'b', text: '5 N·s' },
      { id: 'c', text: '10 N·s' },
      { id: 'd', text: '16 N·s' }
    ],
    correctOptionId: 'c',
    explanation: 'O impulso é igual à variação da quantidade de movimento: I = Δp = m·(v - v0) = 2 × (8 - 3) = 10 N·s. Não é necessário usar o tempo diretamente, já que o teorema do impulso relaciona impulso e variação de momento linear.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_dinamica_impulsiva_2',
    topicId: 'fis_dinamica_impulsiva',
    subject: 'Física',
    prompt: 'Dois patinadores em repouso sobre o gelo (sem atrito) se empurram. O patinador A tem massa 60 kg e o patinador B tem massa 40 kg. Se A se afasta com velocidade de 2 m/s, qual é a velocidade de afastamento de B?',
    options: [
      { id: 'a', text: '1,3 m/s' },
      { id: 'b', text: '2 m/s' },
      { id: 'c', text: '3 m/s' },
      { id: 'd', text: '4 m/s' }
    ],
    correctOptionId: 'c',
    explanation: 'Como o sistema parte do repouso e não há forças externas horizontais, a quantidade de movimento total se conserva e é igual a zero: mA·vA = mB·vB → 60 × 2 = 40 × vB → vB = 3 m/s, em sentido oposto ao de A.',
    difficulty: 'medium'
  },
  // Física — Estática dos Corpos Sólidos e dos Fluidos
  {
    id: 'q_fis_estatica_1',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Uma barra horizontal e homogênea de 4 m de comprimento está apoiada em um único ponto de apoio. Para que a barra fique em equilíbrio estático, esse ponto de apoio deve estar localizado:',
    options: [
      { id: 'a', text: 'Em uma das extremidades da barra' },
      { id: 'b', text: 'No centro de massa da barra' },
      { id: 'c', text: 'A 1 m de uma das extremidades' },
      { id: 'd', text: 'Em qualquer ponto, desde que a barra seja rígida' }
    ],
    correctOptionId: 'b',
    explanation: 'Para uma barra homogênea em equilíbrio apoiada em um único ponto, o apoio deve coincidir com o centro de massa (nesse caso, o ponto médio), de forma que o torque do peso em relação ao apoio seja nulo.',
    difficulty: 'easy'
  },
  {
    id: 'q_fis_estatica_2',
    topicId: 'fis_estatica',
    subject: 'Física',
    prompt: 'Um objeto de volume 200 cm³ é totalmente submerso em água (densidade 1 g/cm³). Considerando g = 10 m/s², qual é o valor do empuxo exercido pela água sobre o objeto?',
    options: [
      { id: 'a', text: '0,2 N' },
      { id: 'b', text: '2 N' },
      { id: 'c', text: '20 N' },
      { id: 'd', text: '200 N' }
    ],
    correctOptionId: 'b',
    explanation: 'Pelo Princípio de Arquimedes, E = ρ_fluido × V × g = 1000 kg/m³ × 200×10⁻⁶ m³ × 10 = 2 N. O empuxo é igual ao peso do volume de líquido deslocado pelo objeto.',
    difficulty: 'medium'
  },
  // Física — Eletromagnetismo
  {
    id: 'q_fis_eletromagnetismo_1',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Uma carga elétrica positiva se move para a direita em uma região onde há um campo magnético uniforme apontando para dentro da página. Usando a regra da mão direita, a força magnética sobre a carga aponta para:',
    options: [
      { id: 'a', text: 'Cima' },
      { id: 'b', text: 'Baixo' },
      { id: 'c', text: 'Fora da página' },
      { id: 'd', text: 'Dentro da página' }
    ],
    correctOptionId: 'a',
    explanation: 'A força magnética é dada por F = qv × B. Apontando os dedos na direção de v (direita) e curvando-os para B (para dentro da página), o polegar aponta para cima — essa é a direção de F para uma carga positiva.',
    difficulty: 'medium'
  },
  {
    id: 'q_fis_eletromagnetismo_2',
    topicId: 'fis_eletromagnetismo',
    subject: 'Física',
    prompt: 'Um ímã é aproximado rapidamente de uma espira condutora fechada, fazendo o fluxo magnético através dela aumentar. De acordo com a Lei de Lenz, a corrente induzida na espira:',
    options: [
      { id: 'a', text: 'Cria um campo magnético que reforça o aumento do fluxo' },
      { id: 'b', text: 'Cria um campo magnético que se opõe ao aumento do fluxo' },
      { id: 'c', text: 'Não é gerada, pois a espira está em repouso' },
      { id: 'd', text: 'Tem sentido aleatório, imprevisível pela lei' }
    ],
    correctOptionId: 'b',
    explanation: 'A Lei de Lenz estabelece que a corrente induzida sempre flui em um sentido que se opõe à variação do fluxo magnético que a gerou (conservação de energia) — nesse caso, criando um campo magnético contrário ao aumento do fluxo do ímã se aproximando.',
    difficulty: 'medium'
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
    prompt: 'Uma receita rende 8 porções usando 300 g de farinha. Mantendo a mesma proporção, quantos gramas de farinha são necessários para render 20 porções?',
    options: [
      { id: 'a', text: '600 g' },
      { id: 'b', text: '750 g' },
      { id: 'c', text: '800 g' },
      { id: 'd', text: '900 g' }
    ],
    correctOptionId: 'b',
    explanation: 'A razão é 300/8 = 37,5 g por porção. Para 20 porções: 37,5 × 20 = 750 g.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_2',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Um produto teve o preço aumentado em 20% e, em seguida, sobre o novo preço, foi aplicado um desconto de 20%. Em relação ao preço original, o preço final está:',
    options: [
      { id: 'a', text: 'Igual ao original' },
      { id: 'b', text: '4% menor' },
      { id: 'c', text: '4% maior' },
      { id: 'd', text: '2% menor' }
    ],
    correctOptionId: 'b',
    explanation: 'Partindo de 100: após +20% fica 120; após -20% sobre 120 fica 120 × 0,8 = 96. Isso é 4% menor que o valor original de 100, pois aumento e desconto percentuais sucessivos não se cancelam quando aplicados sobre bases diferentes.',
    difficulty: 'medium'
  },
  // Matemática — Teoria dos Números Inteiros
  {
    id: 'q_mat_teoria_numeros_1',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Qual é o máximo divisor comum (MDC) entre 84 e 126?',
    options: [
      { id: 'a', text: '6' },
      { id: 'b', text: '14' },
      { id: 'c', text: '21' },
      { id: 'd', text: '42' }
    ],
    correctOptionId: 'd',
    explanation: '84 = 2² × 3 × 7 e 126 = 2 × 3² × 7. O MDC toma os fatores comuns com menor expoente: 2 × 3 × 7 = 42.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_teoria_numeros_2',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'Dois sinais luminosos, um a cada 18 segundos e outro a cada 24 segundos, piscam juntos às 8h00. Depois de quantos segundos eles voltarão a piscar juntos novamente?',
    options: [
      { id: 'a', text: '36 segundos' },
      { id: 'b', text: '48 segundos' },
      { id: 'c', text: '72 segundos' },
      { id: 'd', text: '432 segundos' }
    ],
    correctOptionId: 'c',
    explanation: 'A resposta é o MMC(18, 24). 18 = 2 × 3² e 24 = 2³ × 3, então MMC = 2³ × 3² = 72 segundos.',
    difficulty: 'medium'
  },
  // Matemática — Sequências, Matrizes e Sistemas Lineares
  {
    id: 'q_mat_sequencias_matrizes_1',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Numa progressão aritmética, o primeiro termo é 5 e a razão é 4. Qual é o 12º termo dessa progressão?',
    options: [
      { id: 'a', text: '44' },
      { id: 'b', text: '48' },
      { id: 'c', text: '49' },
      { id: 'd', text: '53' }
    ],
    correctOptionId: 'c',
    explanation: 'aₙ = a₁ + (n-1)r → a₁₂ = 5 + 11 × 4 = 5 + 44 = 49.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_2',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Resolvendo o sistema linear { x + y = 10 ; x − y = 2 }, os valores de x e y são, respectivamente:',
    options: [
      { id: 'a', text: '4 e 6' },
      { id: 'b', text: '6 e 4' },
      { id: 'c', text: '5 e 5' },
      { id: 'd', text: '8 e 2' }
    ],
    correctOptionId: 'b',
    explanation: 'Somando as duas equações: 2x = 12 → x = 6. Substituindo em x + y = 10: y = 4.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Espacial
  {
    id: 'q_mat_geometria_espacial_1',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Qual é o volume de um cubo cuja aresta mede 5 cm?',
    options: [
      { id: 'a', text: '25 cm³' },
      { id: 'b', text: '75 cm³' },
      { id: 'c', text: '100 cm³' },
      { id: 'd', text: '125 cm³' }
    ],
    correctOptionId: 'd',
    explanation: 'O volume do cubo é aresta³ = 5³ = 125 cm³.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_2',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um cilindro reto tem raio da base igual a 3 cm e altura igual a 10 cm. Qual é aproximadamente o seu volume? (use π ≈ 3,14)',
    options: [
      { id: 'a', text: '94,2 cm³' },
      { id: 'b', text: '188,4 cm³' },
      { id: 'c', text: '282,6 cm³' },
      { id: 'd', text: '376,8 cm³' }
    ],
    correctOptionId: 'c',
    explanation: 'V = π × r² × h = 3,14 × 9 × 10 = 282,6 cm³.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Analítica
  {
    id: 'q_mat_geometria_analitica_1',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a distância entre os pontos A(1, 2) e B(4, 6) no plano cartesiano?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '7' }
    ],
    correctOptionId: 'c',
    explanation: 'd = √[(4-1)² + (6-2)²] = √(9 + 16) = √25 = 5.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_analitica_2',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é o coeficiente angular da reta que passa pelos pontos A(2, 3) e B(5, 9)?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '6' }
    ],
    correctOptionId: 'b',
    explanation: 'm = (y₂ - y₁)/(x₂ - x₁) = (9 - 3)/(5 - 2) = 6/3 = 2.',
    difficulty: 'medium'
  },
  // Matemática — Equações, Desigualdades e Modelagem Algébrica
  {
    id: 'q_mat_equacoes_1',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Qual é o conjunto solução da equação do 2º grau x² − 5x + 6 = 0?',
    options: [
      { id: 'a', text: '{1, 6}' },
      { id: 'b', text: '{2, 3}' },
      { id: 'c', text: '{-2, -3}' },
      { id: 'd', text: '{2, -3}' }
    ],
    correctOptionId: 'b',
    explanation: 'Fatorando: (x-2)(x-3) = 0, pois 2 × 3 = 6 e 2 + 3 = 5. Logo x = 2 ou x = 3.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_equacoes_2',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Para quais valores de x a desigualdade 2x − 3 > 7 é satisfeita?',
    options: [
      { id: 'a', text: 'x > 2' },
      { id: 'b', text: 'x > 5' },
      { id: 'c', text: 'x < 5' },
      { id: 'd', text: 'x > 10' }
    ],
    correctOptionId: 'b',
    explanation: '2x - 3 > 7 → 2x > 10 → x > 5.',
    difficulty: 'easy'
  },
  // Matemática — Logaritmos e Exponenciais
  {
    id: 'q_mat_log_exponenciais_1',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Qual é o valor de log₂(32)?',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '5' },
      { id: 'c', text: '6' },
      { id: 'd', text: '16' }
    ],
    correctOptionId: 'b',
    explanation: 'log₂(32) é o expoente x tal que 2ˣ = 32. Como 2⁵ = 32, log₂(32) = 5.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_log_exponenciais_2',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Uma população de bactérias dobra a cada hora, partindo de 100 indivíduos. Quantas bactérias haverá após 4 horas?',
    options: [
      { id: 'a', text: '400' },
      { id: 'b', text: '800' },
      { id: 'c', text: '1200' },
      { id: 'd', text: '1600' }
    ],
    correctOptionId: 'd',
    explanation: 'Crescimento exponencial: P(t) = 100 × 2ᵗ. Em t = 4: 100 × 2⁴ = 100 × 16 = 1600.',
    difficulty: 'medium'
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
