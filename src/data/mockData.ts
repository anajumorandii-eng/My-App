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
  // Filosofia
  {
    id: 'fil_origem_pre_socraticos', name: 'Origens da Filosofia e os Pré-Socráticos', subject: 'Filosofia', prerequisites: [],
    chapters: [
      'O Nascimento da Filosofia: do Mito ao Logos', 'Os Filósofos da Physis: Tales, Anaximandro e Anaxímenes',
      'Heráclito e Parmênides: o Ser e o Devir', 'Os Sofistas e a Crise da Verdade',
    ],
  },
  {
    id: 'fil_socrates_platao', name: 'Sócrates e Platão', subject: 'Filosofia', prerequisites: ['fil_origem_pre_socraticos'],
    chapters: [
      'O Método Socrático e a Maiêutica', 'A Teoria das Ideias de Platão',
      'O Mito da Caverna', 'A Alegoria da Linha Dividida e o Conhecimento',
    ],
  },
  {
    id: 'fil_aristoteles', name: 'Aristóteles', subject: 'Filosofia', prerequisites: ['fil_socrates_platao'],
    chapters: [
      'Lógica e Metafísica Aristotélicas', 'A Ética a Nicômaco e a Doutrina do Meio-Termo',
      'Política Aristotélica: o Homem como Animal Político',
    ],
  },
  {
    id: 'fil_medieval', name: 'Filosofia Medieval', subject: 'Filosofia', prerequisites: ['fil_aristoteles'],
    chapters: [
      'Patrística e Santo Agostinho', 'Escolástica e Santo Tomás de Aquino', 'A Relação entre Fé e Razão',
    ],
  },
  {
    id: 'fil_moderna_racionalismo_empirismo', name: 'Filosofia Moderna: Racionalismo e Empirismo', subject: 'Filosofia', prerequisites: ['fil_medieval'],
    chapters: [
      'Descartes e o Método: a Dúvida Hiperbólica', 'Racionalismo Continental: Espinosa e Leibniz',
      'Empirismo Britânico: Locke, Berkeley e Hume', 'A Crítica de Hume à Causalidade',
    ],
  },
  {
    id: 'fil_contratualismo_iluminismo', name: 'Contratualismo Político e Iluminismo', subject: 'Filosofia', prerequisites: ['fil_moderna_racionalismo_empirismo'],
    chapters: [
      'Hobbes e o Estado de Natureza', 'Locke e os Direitos Naturais',
      'Rousseau e a Vontade Geral', 'O Ideal Iluminista de Razão e Progresso',
    ],
  },
  {
    id: 'fil_kant_idealismo', name: 'Kant e o Idealismo Alemão', subject: 'Filosofia', prerequisites: ['fil_contratualismo_iluminismo'],
    chapters: [
      'A Crítica da Razão Pura', 'A Ética Kantiana e o Imperativo Categórico', 'Hegel e a Dialética',
    ],
  },
  {
    id: 'fil_marx_critica_sociedade', name: 'Marx e a Crítica à Sociedade Capitalista', subject: 'Filosofia', prerequisites: ['fil_kant_idealismo'],
    chapters: [
      'O Materialismo Histórico', 'Alienação e Mais-Valia', 'A Luta de Classes na Filosofia Marxista',
    ],
  },
  {
    id: 'fil_niilismo_existencialismo', name: 'Nietzsche, Existencialismo e Filosofia Contemporânea', subject: 'Filosofia', prerequisites: ['fil_marx_critica_sociedade'],
    chapters: [
      'Nietzsche e a Crítica aos Valores Morais', 'O Existencialismo de Sartre',
      'A Escola de Frankfurt e a Indústria Cultural', 'Foucault e as Relações de Poder',
    ],
  },
  {
    id: 'fil_etica_politica_contemporanea', name: 'Ética e Política Contemporâneas', subject: 'Filosofia', prerequisites: ['fil_niilismo_existencialismo'],
    chapters: [
      'Justiça e Direitos Humanos', 'Ética Aplicada e Bioética', 'Filosofia Política Contemporânea',
    ],
  },
  // Sociologia
  {
    id: 'soc_formacao_ciencia', name: 'A Formação da Sociologia como Ciência', subject: 'Sociologia', prerequisites: [],
    chapters: [
      'O Contexto Histórico do Surgimento da Sociologia', 'O que é o Fato Social', 'Sociologia e Senso Comum',
    ],
  },
  {
    id: 'soc_durkheim', name: 'Émile Durkheim e o Fato Social', subject: 'Sociologia', prerequisites: ['soc_formacao_ciencia'],
    chapters: [
      'Solidariedade Mecânica e Solidariedade Orgânica', 'Anomia e Coesão Social', 'Educação e Socialização em Durkheim',
    ],
  },
  {
    id: 'soc_marx_sociologia', name: 'Karl Marx e a Sociologia', subject: 'Sociologia', prerequisites: ['soc_durkheim'],
    chapters: [
      'Modo de Produção e Estrutura Social', 'Ideologia e Alienação', 'A Luta de Classes na Análise Sociológica',
    ],
  },
  {
    id: 'soc_weber', name: 'Max Weber e a Ação Social', subject: 'Sociologia', prerequisites: ['soc_marx_sociologia'],
    chapters: [
      'Tipos de Ação Social', 'Dominação e Poder em Weber', 'Ética Protestante e o Espírito do Capitalismo',
    ],
  },
  {
    id: 'soc_cultura_identidade', name: 'Cultura, Identidade e Diversidade', subject: 'Sociologia', prerequisites: ['soc_weber'],
    chapters: [
      'Cultura e Etnocentrismo', 'Identidade e Diferença', 'Multiculturalismo e Relativismo Cultural',
    ],
  },
  {
    id: 'soc_estratificacao_desigualdade', name: 'Estratificação Social e Desigualdade', subject: 'Sociologia', prerequisites: ['soc_cultura_identidade'],
    chapters: [
      'Classes Sociais e Mobilidade Social', 'Desigualdade Racial no Brasil', 'Desigualdade de Gênero',
    ],
  },
  {
    id: 'soc_trabalho_sociedade', name: 'Trabalho e Sociedade', subject: 'Sociologia', prerequisites: ['soc_estratificacao_desigualdade'],
    chapters: [
      'Divisão Social do Trabalho', 'Transformações no Mundo do Trabalho', 'Precarização e Uberização do Trabalho',
    ],
  },
  {
    id: 'soc_movimentos_sociais', name: 'Movimentos Sociais e Cidadania', subject: 'Sociologia', prerequisites: ['soc_trabalho_sociedade'],
    chapters: [
      'Movimentos Sociais Clássicos e Contemporâneos', 'Cidadania e Direitos', 'Democracia e Participação Política',
    ],
  },
  {
    id: 'soc_globalizacao', name: 'Globalização e Sociedade Contemporânea', subject: 'Sociologia', prerequisites: ['soc_movimentos_sociais'],
    chapters: [
      'Globalização Econômica e Cultural', 'O Estado-Nação na Era Global', 'A Sociedade da Informação',
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
  { topicId: 'ing_01', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 0 },
  // Filosofia e Sociologia: matérias recém-cadastradas, ainda sem estudo real.
  { topicId: 'fil_origem_pre_socraticos', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_socrates_platao', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_aristoteles', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_medieval', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_moderna_racionalismo_empirismo', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_contratualismo_iluminismo', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_kant_idealismo', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_marx_critica_sociedade', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_niilismo_existencialismo', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'fil_etica_politica_contemporanea', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_formacao_ciencia', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_durkheim', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_marx_sociologia', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_weber', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_cultura_identidade', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_estratificacao_desigualdade', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_trabalho_sociedade', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_movimentos_sociais', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
  { topicId: 'soc_globalizacao', level: 0, uncertainty: 0.9, lastReviewed: new Date(0).toISOString(), errorSignals: 0 },
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

// O banco de questões (1.538 questões, 1,5 MB) saiu daqui pra
// public/questions.json: importado deste módulo ele entrava no bundle
// JavaScript de toda tela, mesmo nas que não têm questão nenhuma, e
// respondia por 45% de tudo que a primeira tela baixava. Agora é buscado sob
// demanda por useQuestions(), do mesmo jeito que os flashcards já eram em
// src/lib/flashcardContent.ts.

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
