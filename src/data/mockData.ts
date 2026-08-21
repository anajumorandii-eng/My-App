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
    chapter: 'Bioenergética: Fermentação e Respiração',
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
    chapter: 'Bioenergética: Fermentação e Respiração',
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
    chapter: 'Bioenergética: Fotossíntese e Quimiossíntese',
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
    chapter: 'Bioenergética: Fermentação e Respiração',
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
    chapter: 'Bioenergética: Fermentação e Respiração',
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
  {
    id: 'q_bio_metabolismo_energetico_6',
    chapter: 'Proteínas: Enzimas',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'As enzimas são catalisadores biológicos, geralmente de natureza proteica, cuja principal função é:',
    options: [
      { id: 'a', text: 'Fornecer energia diretamente às reações metabólicas' },
      { id: 'b', text: 'Diminuir a energia de ativação das reações químicas, acelerando-as, sem serem consumidas no processo' },
      { id: 'c', text: 'Ser consumidas totalmente a cada reação que catalisam' },
      { id: 'd', text: 'Alterar o produto final de uma reação química' }
    ],
    correctOptionId: 'b',
    explanation: 'Enzimas são catalisadores biológicos que diminuem a energia de ativação necessária para uma reação ocorrer, acelerando-a consideravelmente, sem serem consumidas no processo — podendo catalisar a mesma reação repetidamente.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_metabolismo_energetico_7',
    chapter: 'Proteínas: Enzimas',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'O modelo de "encaixe induzido" (diferente do antigo modelo "chave-fechadura") descreve a interação entre uma enzima e seu substrato como:',
    options: [
      { id: 'a', text: 'Um encaixe rígido e perfeito, sem qualquer mudança de forma da enzima' },
      { id: 'b', text: 'Uma interação em que o sítio ativo da enzima muda ligeiramente sua conformação ao se ligar ao substrato, ajustando-se para otimizar a catálise' },
      { id: 'c', text: 'Uma ligação permanente e irreversível entre enzima e substrato' },
      { id: 'd', text: 'Uma interação em que a enzima é degradada ao se ligar ao substrato' }
    ],
    correctOptionId: 'b',
    explanation: 'O modelo do encaixe induzido propõe que o sítio ativo da enzima não é uma forma perfeitamente rígida (como uma fechadura), mas sim flexível, ajustando ligeiramente sua conformação ao entrar em contato com o substrato — otimizando o encaixe e a catálise da reação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_metabolismo_energetico_8',
    chapter: 'Proteínas: Enzimas',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'Um aumento excessivo de temperatura, muito além da temperatura ótima de uma enzima, geralmente causa:',
    options: [
      { id: 'a', text: 'Aumento indefinido da velocidade da reação catalisada' },
      { id: 'b', text: 'Desnaturação da enzima, perdendo sua conformação tridimensional e, consequentemente, sua função catalítica' },
      { id: 'c', text: 'Nenhum efeito sobre a atividade enzimática' },
      { id: 'd', text: 'Transformação da enzima em substrato' }
    ],
    correctOptionId: 'b',
    explanation: 'Temperaturas muito acima da temperatura ótima de uma enzima rompem as ligações que mantêm sua estrutura tridimensional, causando desnaturação — a perda da conformação espacial e, com ela, da capacidade catalítica da enzima, geralmente de forma irreversível.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_metabolismo_energetico_9',
    chapter: 'Bioenergética: Fotossíntese e Quimiossíntese',
    topicId: 'bio_metabolismo_energetico',
    subject: 'Biologia',
    prompt: 'A quimiossíntese, processo realizado por certas bactérias (como as que vivem em fontes hidrotermais no fundo do oceano), se assemelha à fotossíntese porque ambas:',
    options: [
      { id: 'a', text: 'Utilizam luz solar como fonte de energia' },
      { id: 'b', text: 'São processos autotróficos que produzem matéria orgânica a partir de matéria inorgânica, mas usando fontes de energia diferentes (luz na fotossíntese, energia química de reações inorgânicas na quimiossíntese)' },
      { id: 'c', text: 'Ocorrem exclusivamente em plantas' },
      { id: 'd', text: 'Não produzem qualquer tipo de energia utilizável pelo organismo' }
    ],
    correctOptionId: 'b',
    explanation: 'Tanto a fotossíntese quanto a quimiossíntese são processos autotróficos, produzindo matéria orgânica a partir de matéria inorgânica (CO2), mas diferem na fonte de energia: a fotossíntese usa energia luminosa, enquanto a quimiossíntese usa a energia liberada por reações químicas inorgânicas (como a oxidação de compostos de enxofre), permitindo que certas bactérias vivam sem luz solar, como no fundo do oceano.',
    difficulty: 'medium'
  },
  // Biologia — Código Genético e Síntese Proteica
  {
    id: 'q_bio_codigo_genetico_sintese_1',
    chapter: 'Ácidos Nucleicos',
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
    chapter: 'Ácidos Nucleicos',
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
    chapter: 'Mutações Cromossômicas e Gametogênese',
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
    chapter: 'Ácidos Nucleicos',
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
    chapter: 'Ácidos Nucleicos',
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
  {
    id: 'q_bio_codigo_genetico_sintese_6',
    chapter: 'Divisão Celular',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'A mitose, tipo de divisão celular responsável pelo crescimento e reparo de tecidos, produz, a partir de uma célula-mãe:',
    options: [
      { id: 'a', text: 'Duas células-filhas geneticamente idênticas entre si e à célula-mãe, com o mesmo número de cromossomos' },
      { id: 'b', text: 'Quatro células-filhas com metade do número de cromossomos da célula-mãe' },
      { id: 'c', text: 'Duas células-filhas geneticamente diferentes entre si' },
      { id: 'd', text: 'Uma única célula, sem qualquer divisão real' }
    ],
    correctOptionId: 'a',
    explanation: 'A mitose produz duas células-filhas geneticamente idênticas entre si e idênticas à célula-mãe original, mantendo o mesmo número de cromossomos (processo diploide-diploide, por exemplo) — um mecanismo essencial para o crescimento, a reposição de células e a reprodução assexuada.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_7',
    chapter: 'Divisão Celular',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'A meiose, diferente da mitose, é o tipo de divisão celular responsável pela formação de gametas, produzindo, a partir de uma célula-mãe diploide:',
    options: [
      { id: 'a', text: 'Duas células-filhas diploides, idênticas entre si' },
      { id: 'b', text: 'Quatro células-filhas haploides (com metade do número de cromossomos), geneticamente diferentes entre si devido à recombinação gênica' },
      { id: 'c', text: 'Uma única célula diploide' },
      { id: 'd', text: 'Duas células-filhas, uma diploide e outra haploide' }
    ],
    correctOptionId: 'b',
    explanation: 'A meiose envolve duas divisões celulares sucessivas, produzindo quatro células-filhas haploides (n), com metade do número de cromossomos da célula-mãe diploide (2n). Devido ao crossing-over e à segregação independente dos cromossomos, essas células são geneticamente diferentes entre si — a base da variabilidade genética na reprodução sexuada.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_8',
    chapter: 'Divisão Celular',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'O crossing-over (permutação), fenômeno que ocorre durante a meiose, consiste em:',
    options: [
      { id: 'a', text: 'A destruição de parte do material genético do gameta' },
      { id: 'b', text: 'A troca de segmentos entre cromátides homólogas, gerando novas combinações de alelos e aumentando a variabilidade genética dos gametas' },
      { id: 'c', text: 'A duplicação exata do DNA sem qualquer troca de material' },
      { id: 'd', text: 'Um erro raro que sempre resulta em doenças genéticas' }
    ],
    correctOptionId: 'b',
    explanation: 'O crossing-over é a troca de segmentos de DNA entre cromátides homólogas durante a prófase I da meiose, criando novas combinações de alelos nos cromossomos recombinantes — um mecanismo natural (não um erro) que aumenta significativamente a variabilidade genética dos gametas produzidos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_codigo_genetico_sintese_9',
    chapter: 'Mutações Cromossômicas e Gametogênese',
    topicId: 'bio_codigo_genetico_sintese',
    subject: 'Biologia',
    prompt: 'A síndrome de Down, causada por uma alteração no número de cromossomos (trissomia do cromossomo 21), é um exemplo de:',
    options: [
      { id: 'a', text: 'Mutação gênica pontual, afetando apenas um nucleotídeo' },
      { id: 'b', text: 'Mutação cromossômica numérica (aneuploidia), decorrente de um erro na separação dos cromossomos durante a gametogênese (não disjunção)' },
      { id: 'c', text: 'Uma característica hereditária dominante comum, sem relação com erros de divisão celular' },
      { id: 'd', text: 'Uma infecção viral adquirida após o nascimento' }
    ],
    correctOptionId: 'b',
    explanation: 'A síndrome de Down é uma aneuploidia (mutação cromossômica numérica), na qual o indivíduo possui uma cópia extra do cromossomo 21 (trissomia). Geralmente resulta de um erro de não disjunção durante a meiose na formação dos gametas, quando os cromossomos homólogos (ou cromátides-irmãs) não se separam corretamente.',
    difficulty: 'medium'
  },
  // Biologia — Genética
  {
    id: 'q_bio_genetica_1',
    chapter: 'Introdução à Genética',
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
    chapter: 'Segunda Lei de Mendel',
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
    chapter: 'Introdução à Genética',
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
    chapter: 'Herança Sexual',
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
  {
    id: 'q_bio_genetica_5',
    chapter: 'Alelos Múltiplos e Herança dos Grupos Sanguíneos',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'O sistema sanguíneo ABO é determinado por um gene com três alelos possíveis (IA, IB, i), sendo um exemplo de:',
    options: [
      { id: 'a', text: 'Herança ligada ao sexo' },
      { id: 'b', text: 'Alelos múltiplos: mais de dois alelos possíveis para o mesmo gene na população, embora cada indivíduo possua apenas dois' },
      { id: 'c', text: 'Uma característica determinada por dois genes diferentes' },
      { id: 'd', text: 'Herança citoplasmática, fora do núcleo' }
    ],
    correctOptionId: 'b',
    explanation: 'O sistema ABO é um exemplo clássico de alelos múltiplos: existem três alelos possíveis na população (IA, IB, i) para o mesmo gene, embora cada indivíduo diploide carregue apenas dois deles (um de cada progenitor).',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_genetica_6',
    chapter: 'Alelos Múltiplos e Herança dos Grupos Sanguíneos',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'No sistema ABO, os alelos IA e IB são codominantes entre si, e ambos são dominantes sobre o alelo i. Um indivíduo com genótipo IAIB apresenta fenótipo sanguíneo:',
    options: [
      { id: 'a', text: 'Tipo A' },
      { id: 'b', text: 'Tipo AB, pois os dois alelos IA e IB se expressam simultaneamente' },
      { id: 'c', text: 'Tipo O' },
      { id: 'd', text: 'Tipo B' }
    ],
    correctOptionId: 'b',
    explanation: 'Como IA e IB são codominantes, um indivíduo IAIB expressa simultaneamente os dois antígenos (A e B) nas hemácias, resultando no fenótipo sanguíneo tipo AB.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_7',
    chapter: 'Alelos Múltiplos e Herança dos Grupos Sanguíneos',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'O sistema Rh, que classifica o sangue como Rh positivo ou Rh negativo, é relevante clinicamente na gestação porque:',
    options: [
      { id: 'a', text: 'Nunca causa qualquer problema, independentemente da combinação entre mãe e feto' },
      { id: 'b', text: 'Uma mãe Rh negativo gestando um feto Rh positivo pode desenvolver anticorpos contra o fator Rh do feto, o que pode afetar gestações Rh positivas subsequentes' },
      { id: 'c', text: 'Determina exclusivamente o sexo do bebê' },
      { id: 'd', text: 'Só é relevante para o tipo sanguíneo ABO, sem qualquer relação com gestação' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando uma mãe Rh negativo gesta um feto Rh positivo (herdado do pai), pode haver sensibilização do sistema imune materno ao entrar em contato com o sangue fetal (geralmente no parto), gerando anticorpos anti-Rh que podem atacar as hemácias de um feto Rh positivo em gestações futuras — por isso a importância do acompanhamento e, quando necessário, da profilaxia com imunoglobulina anti-Rh.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_8',
    chapter: 'Segunda Lei de Mendel',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A Segunda Lei de Mendel (Lei da Segregação Independente) se aplica corretamente à transmissão conjunta de duas características quando:',
    options: [
      { id: 'a', text: 'Os genes que determinam essas características estão localizados em cromossomos diferentes (ou distantes o suficiente no mesmo cromossomo), segregando de forma independente durante a meiose' },
      { id: 'b', text: 'Os genes estão sempre no mesmo cromossomo, próximos um do outro' },
      { id: 'c', text: 'As duas características são determinadas por um único gene' },
      { id: 'd', text: 'Não há qualquer relação entre os genes e os cromossomos' }
    ],
    correctOptionId: 'a',
    explanation: 'A Segunda Lei de Mendel pressupõe que os genes de características diferentes segregam de forma independente durante a formação dos gametas — o que ocorre quando esses genes estão em cromossomos diferentes (ou suficientemente distantes no mesmo cromossomo, permitindo recombinação livre por crossing-over).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_9',
    chapter: 'Segunda Lei de Mendel',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'No cruzamento entre um indivíduo AaBb e um indivíduo aabb (retrocruzamento-teste), qual é a proporção fenotípica esperada na prole, considerando segregação independente?',
    options: [
      { id: 'a', text: '9:3:3:1' },
      { id: 'b', text: '1:1:1:1' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '1:2:1' }
    ],
    correctOptionId: 'b',
    explanation: 'O indivíduo AaBb produz 4 tipos de gametas em igual proporção (AB, Ab, aB, ab), enquanto aabb produz apenas um tipo (ab). Combinando-os, obtém-se 4 fenótipos diferentes em proporção igual: 1:1:1:1 — esse tipo de cruzamento (com o duplo-recessivo) é chamado de cruzamento-teste, usado para determinar o genótipo de um indivíduo com fenótipo dominante.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_10',
    chapter: 'Segunda Lei de Mendel e Interação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Na interação gênica, uma característica é determinada pela ação conjunta de dois ou mais genes diferentes, ao contrário da herança mendeliana simples (um gene, uma característica). Um exemplo clássico é a herança da:',
    options: [
      { id: 'a', text: 'Cor dos olhos determinada por um único gene' },
      { id: 'b', text: 'Forma da crista em galinhas, resultado da interação entre dois genes diferentes, gerando quatro tipos de crista' },
      { id: 'c', text: 'Tipagem sanguínea ABO, determinada por um único gene com múltiplos alelos' },
      { id: 'd', text: 'Cor da pele humana, determinada por um único gene dominante' }
    ],
    correctOptionId: 'b',
    explanation: 'A forma da crista em galinhas é um exemplo clássico de interação gênica: dois genes diferentes (cada um com um alelo dominante e um recessivo) interagem para determinar quatro fenótipos possíveis de crista (ervilha, rosa, noz e simples), em vez de uma herança simples de um único gene.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_11',
    chapter: 'Segunda Lei de Mendel e Interação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A epistasia, um tipo específico de interação gênica, ocorre quando:',
    options: [
      { id: 'a', text: 'Um gene mascara ou impede a expressão fenotípica de outro gene, não alélico a ele' },
      { id: 'b', text: 'Dois alelos do mesmo gene se expressam simultaneamente (codominância)' },
      { id: 'c', text: 'Um gene está localizado no cromossomo X' },
      { id: 'd', text: 'Não há qualquer relação entre os genes envolvidos' }
    ],
    correctOptionId: 'a',
    explanation: 'Na epistasia, um gene (chamado epistático) mascara ou suprime a expressão fenotípica de outro gene não alélico (chamado hipostático) — diferente da dominância comum, que ocorre entre alelos do mesmo gene.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_12',
    chapter: 'Segunda Lei de Mendel e Interação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A herança poligênica (ou quantitativa), como a que determina a cor da pele humana ou a estatura, se caracteriza por:',
    options: [
      { id: 'a', text: 'Ser determinada por um único par de alelos, com dominância completa' },
      { id: 'b', text: 'Ser determinada por vários genes atuando em conjunto, cada um contribuindo de forma aditiva, gerando uma variação contínua e gradual do fenótipo (não categorias discretas)' },
      { id: 'c', text: 'Não ter qualquer influência genética, sendo determinada apenas pelo ambiente' },
      { id: 'd', text: 'Produzir sempre apenas dois fenótipos possíveis, como no cruzamento mendeliano simples' }
    ],
    correctOptionId: 'b',
    explanation: 'Características poligênicas são determinadas por vários genes atuando conjuntamente, cada um contribuindo com um pequeno efeito aditivo — o que gera uma variação contínua do fenótipo (como uma gama de tons de pele ou alturas), ao contrário de características mendelianas simples, que geram categorias fenotípicas discretas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_13',
    chapter: 'Ligação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A ligação gênica (ou linkage) ocorre quando dois genes estão:',
    options: [
      { id: 'a', text: 'Localizados no mesmo cromossomo, próximos um do outro, e tendem a ser herdados juntos, não seguindo a segregação independente da Segunda Lei de Mendel' },
      { id: 'b', text: 'Localizados em cromossomos diferentes' },
      { id: 'c', text: 'Ambos localizados fora do núcleo celular' },
      { id: 'd', text: 'Determinando exatamente a mesma característica' }
    ],
    correctOptionId: 'a',
    explanation: 'Genes ligados estão no mesmo cromossomo, próximos entre si, e por isso tendem a ser transmitidos juntos aos gametas, não seguindo a segregação totalmente independente prevista pela Segunda Lei de Mendel — uma exceção importante a essa lei.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_14',
    chapter: 'Ligação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A frequência de recombinação entre dois genes ligados (medida pela porcentagem de gametas recombinantes) é usada para:',
    options: [
      { id: 'a', text: 'Determinar exatamente a cor dos olhos de um indivíduo' },
      { id: 'b', text: 'Estimar a distância relativa entre os dois genes no cromossomo: quanto maior a frequência de recombinação, mais distantes eles provavelmente estão' },
      { id: 'c', text: 'Provar que os genes estão em cromossomos diferentes' },
      { id: 'd', text: 'Eliminar a necessidade de mapas genéticos' }
    ],
    correctOptionId: 'b',
    explanation: 'Quanto mais distantes dois genes estiverem no mesmo cromossomo, maior a chance de ocorrer crossing-over entre eles durante a meiose, gerando mais gametas recombinantes. Por isso, a frequência de recombinação é usada para estimar distâncias relativas entre genes, permitindo construir mapas genéticos (mapas de ligação).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_15',
    chapter: 'Ligação Gênica',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Genes completamente ligados (sem qualquer recombinação entre eles, geralmente por estarem extremamente próximos no cromossomo) produzem, em um cruzamento-teste, gametas:',
    options: [
      { id: 'a', text: 'Apenas do tipo parental, na mesma proporção da célula original, sem qualquer gameta recombinante' },
      { id: 'b', text: 'Exclusivamente do tipo recombinante' },
      { id: 'c', text: 'Em proporção idêntica à segregação independente (1:1:1:1)' },
      { id: 'd', text: 'Aleatórios, sem qualquer padrão' }
    ],
    correctOptionId: 'a',
    explanation: 'Quando dois genes estão completamente ligados (sem recombinação detectável), eles são sempre transmitidos juntos como estavam originalmente nos cromossomos parentais, gerando apenas gametas do tipo parental — sem os gametas recombinantes que apareceriam se houvesse crossing-over entre eles.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_genetica_16',
    chapter: 'Mutações Gênicas',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'A anemia falciforme, doença genética recessiva, é causada por uma mutação gênica que altera:',
    options: [
      { id: 'a', text: 'Um cromossomo inteiro' },
      { id: 'b', text: 'Um único nucleotídeo no gene da hemoglobina, resultando na troca de um aminoácido na proteína, o que altera a forma das hemácias' },
      { id: 'c', text: 'O número total de cromossomos da célula' },
      { id: 'd', text: 'Nenhuma proteína, sendo uma doença puramente ambiental' }
    ],
    correctOptionId: 'b',
    explanation: 'A anemia falciforme resulta de uma mutação pontual (troca de um único nucleotídeo) no gene que codifica a hemoglobina, causando a substituição de um aminoácido na proteína — o que altera a forma da hemoglobina e, consequentemente, das hemácias, que assumem formato de foice em condições de baixa oxigenação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_17',
    chapter: 'Mutações Gênicas',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Mutações gênicas, embora geralmente associadas a efeitos neutros ou prejudiciais, também são a fonte última de:',
    options: [
      { id: 'a', text: 'Toda a variabilidade genética que existiu ou existirá, sendo a matéria-prima sobre a qual a seleção natural pode atuar ao longo do tempo' },
      { id: 'b', text: 'Nenhuma consequência evolutiva relevante' },
      { id: 'c', text: 'Apenas doenças, nunca de características vantajosas' },
      { id: 'd', text: 'Mudanças exclusivamente no fenótipo, nunca no genótipo' }
    ],
    correctOptionId: 'a',
    explanation: 'Apesar de a maioria das mutações serem neutras ou prejudiciais, elas são a fonte última de toda nova variabilidade genética em uma população — sem mutações, não haveria matéria-prima genética nova sobre a qual a seleção natural pudesse atuar, tornando-as fundamentais (embora indiretamente) para a evolução.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_genetica_18',
    chapter: 'Mutações Gênicas',
    topicId: 'bio_genetica',
    subject: 'Biologia',
    prompt: 'Agentes mutagênicos, como a radiação ultravioleta e certos compostos químicos, aumentam a taxa de mutações gênicas principalmente porque:',
    options: [
      { id: 'a', text: 'Danificam diretamente a estrutura do DNA (por exemplo, formando ligações anômalas entre bases), aumentando a chance de erros durante a replicação ou o reparo do DNA' },
      { id: 'b', text: 'Não têm qualquer efeito sobre o material genético' },
      { id: 'c', text: 'Atuam exclusivamente sobre proteínas, nunca sobre o DNA' },
      { id: 'd', text: 'Sempre corrigem mutações já existentes' }
    ],
    correctOptionId: 'a',
    explanation: 'Agentes mutagênicos (físicos, como radiação UV, ou químicos) danificam diretamente a estrutura do DNA — por exemplo, formando dímeros de timina que distorcem a dupla-hélice — aumentando a probabilidade de erros durante a replicação ou de falhas nos mecanismos de reparo celular, o que eleva a taxa de mutações gênicas.',
    difficulty: 'medium'
  },
  // Biologia — Fisiologia Animal e Humana
  {
    id: 'q_bio_fisio_animal_1',
    chapter: 'Coração e Vasos Sanguíneos',
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
    chapter: 'Fisiologia da Excreção',
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
    chapter: 'Fisiologia da Coordenação Nervosa I',
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
    chapter: 'Fisiologia da Respiração',
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
    chapter: 'Coordenação Endócrina I',
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
  {
    id: 'q_bio_fisio_animal_6',
    chapter: 'Embriologia Animal',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Durante o desenvolvimento embrionário animal, a gastrulação é um processo fundamental porque:',
    options: [
      { id: 'a', text: 'Origina os três folhetos germinativos (ectoderma, mesoderma e endoderma), a partir dos quais todos os tecidos e órgãos se diferenciam' },
      { id: 'b', text: 'É a etapa em que o zigoto se divide pela primeira vez' },
      { id: 'c', text: 'Ocorre apenas em animais que se reproduzem assexuadamente' },
      { id: 'd', text: 'Marca o momento da fecundação do óvulo pelo espermatozoide' }
    ],
    correctOptionId: 'a',
    explanation: 'A gastrulação é o processo de movimentação e reorganização celular que estabelece os três folhetos germinativos primários — ectoderma, mesoderma e endoderma —, cada um dando origem a um conjunto específico de tecidos e órgãos (por exemplo, o ectoderma origina pele e sistema nervoso, o mesoderma origina músculos e esqueleto, e o endoderma origina o revestimento do tubo digestório).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_7',
    chapter: 'Embriologia Animal',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Os anexos embrionários (âmnio, córion, saco vitelino e alantoide), presentes em répteis, aves e mamíferos, têm como função principal:',
    options: [
      { id: 'a', text: 'Substituir completamente a placenta em todos os vertebrados' },
      { id: 'b', text: 'Proteger, nutrir e permitir trocas gasosas para o embrião durante seu desenvolvimento, muitas vezes fora de um ambiente aquático' },
      { id: 'c', text: 'Produzir gametas para a próxima geração' },
      { id: 'd', text: 'Realizar fotossíntese para fornecer energia ao embrião' }
    ],
    correctOptionId: 'b',
    explanation: 'Os anexos embrionários evoluíram como uma adaptação à reprodução em ambiente terrestre: o âmnio protege o embrião em um ambiente líquido próprio, o córion participa das trocas gasosas, o saco vitelino armazena nutrientes, e o alantoide armazena excretas e auxilia nas trocas gasosas — conjunto que permitiu a répteis, aves e mamíferos se reproduzirem sem depender diretamente da água externa.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_8',
    chapter: 'Embriologia Animal',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Logo após a fecundação, o zigoto humano passa por uma série de divisões mitóticas rápidas chamadas clivagem, resultando inicialmente em uma estrutura chamada:',
    options: [
      { id: 'a', text: 'Mórula, uma massa compacta de células ainda sem cavidade interna' },
      { id: 'b', text: 'Nêurula, já com o tubo neural formado' },
      { id: 'c', text: 'Gástrula, já com os três folhetos germinativos definidos' },
      { id: 'd', text: 'Feto, com órgãos já totalmente formados' }
    ],
    correctOptionId: 'a',
    explanation: 'A clivagem consiste em divisões mitóticas sucessivas e rápidas do zigoto, sem aumento de volume total, formando primeiro a mórula (massa compacta de células). Em seguida, a mórula se cavita e forma a blástula (no ser humano, o blastocisto), para só depois passar pela gastrulação — a ordem correta de desenvolvimento é clivagem → blástula → gástrula → nêurula.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_9',
    chapter: 'Fisiologia da Sustentação e da Locomoção',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A contração muscular esquelética ocorre, segundo o modelo do filamento deslizante, pela ação de duas proteínas principais. Essas proteínas são:',
    options: [
      { id: 'a', text: 'Colágeno e queratina' },
      { id: 'b', text: 'Actina e miosina, cujos filamentos deslizam um sobre o outro, encurtando o sarcômero' },
      { id: 'c', text: 'Hemoglobina e mioglobina' },
      { id: 'd', text: 'Insulina e glucagon' }
    ],
    correctOptionId: 'b',
    explanation: 'No modelo do filamento deslizante, os filamentos finos de actina deslizam sobre os filamentos grossos de miosina (usando ATP como fonte de energia e cálcio como sinalizador), encurtando o comprimento do sarcômero e, consequentemente, de toda a fibra muscular — mecanismo básico da contração muscular esquelética e cardíaca.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_10',
    chapter: 'Fisiologia da Sustentação e da Locomoção',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O tecido ósseo humano é constantemente remodelado ao longo da vida pela ação conjunta de dois tipos celulares com funções opostas:',
    options: [
      { id: 'a', text: 'Osteoblastos, que formam nova matriz óssea, e osteoclastos, que reabsorvem (degradam) tecido ósseo' },
      { id: 'b', text: 'Condrócitos e hepatócitos, ambos formadores de matriz óssea' },
      { id: 'c', text: 'Neurônios e células gliais' },
      { id: 'd', text: 'Hemácias e leucócitos' }
    ],
    correctOptionId: 'a',
    explanation: 'Os osteoblastos são responsáveis por sintetizar e depositar nova matriz óssea (colágeno e sais de cálcio), enquanto os osteoclastos reabsorvem tecido ósseo existente. O equilíbrio dinâmico entre essas duas atividades permite a remodelação óssea contínua, a reparação de fraturas e a regulação dos níveis de cálcio no sangue.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_11',
    chapter: 'Fisiologia da Sustentação e da Locomoção',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'As articulações sinoviais (como o joelho e o cotovelo), que permitem grande amplitude de movimento, apresentam uma cavidade preenchida por um líquido que reduz o atrito entre os ossos. Esse líquido é chamado de:',
    options: [
      { id: 'a', text: 'Líquido cefalorraquidiano' },
      { id: 'b', text: 'Líquido sinovial' },
      { id: 'c', text: 'Linfa' },
      { id: 'd', text: 'Plasma sanguíneo' }
    ],
    correctOptionId: 'b',
    explanation: 'O líquido sinovial, secretado pela membrana sinovial que reveste a cápsula articular, lubrifica a articulação, reduz o atrito entre as superfícies ósseas cobertas por cartilagem e auxilia na nutrição da cartilagem articular, que não possui vasos sanguíneos próprios.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_animal_12',
    chapter: 'Fisiologia da Digestão',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A maior parte da absorção de nutrientes provenientes da digestão (aminoácidos, açúcares simples, ácidos graxos) ocorre em qual porção do sistema digestório humano?',
    options: [
      { id: 'a', text: 'No estômago' },
      { id: 'b', text: 'No intestino delgado, graças à grande área de superfície oferecida pelas vilosidades e microvilosidades' },
      { id: 'c', text: 'No intestino grosso' },
      { id: 'd', text: 'No esôfago' }
    ],
    correctOptionId: 'b',
    explanation: 'O intestino delgado é o principal local de absorção de nutrientes: suas paredes internas apresentam dobras, vilosidades e microvilosidades que multiplicam enormemente a área de superfície disponível para a absorção de aminoácidos, monossacarídeos, ácidos graxos e outros produtos finais da digestão para a corrente sanguínea e linfática.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_animal_13',
    chapter: 'Fisiologia da Digestão',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O pâncreas exerce um papel duplo na digestão e na fisiologia humana. Em relação à sua função exócrina digestiva, o pâncreas secreta:',
    options: [
      { id: 'a', text: 'Apenas insulina e glucagon diretamente no sangue' },
      { id: 'b', text: 'Enzimas digestivas (como tripsina, amilase e lipase pancreáticas) e bicarbonato, lançados no duodeno para digerir proteínas, carboidratos e lipídios e neutralizar a acidez do quimo' },
      { id: 'c', text: 'Bile, armazenada posteriormente na vesícula biliar' },
      { id: 'd', text: 'Ácido clorídrico, para digestão no estômago' }
    ],
    correctOptionId: 'b',
    explanation: 'A porção exócrina do pâncreas produz e libera no duodeno enzimas digestivas (tripsina e quimotripsina para proteínas, amilase pancreática para carboidratos, lipase para lipídios) e bicarbonato de sódio, que neutraliza a acidez do quimo vindo do estômago, criando o pH ideal para a ação dessas enzimas. A função endócrina (insulina/glucagon) é feita por células diferentes, as ilhotas de Langerhans.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_14',
    chapter: 'Fisiologia da Digestão',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A bile, produzida pelo fígado e armazenada na vesícula biliar, participa da digestão de lipídios principalmente por meio de sua ação:',
    options: [
      { id: 'a', text: 'Enzimática direta, quebrando ligações químicas dos triglicerídeos' },
      { id: 'b', text: 'Emulsificante, quebrando as grandes gotas de gordura em gotículas menores, aumentando a superfície de contato para a ação da lipase' },
      { id: 'c', text: 'De neutralização do pH ácido do estômago' },
      { id: 'd', text: 'De digestão de proteínas, semelhante à pepsina' }
    ],
    correctOptionId: 'b',
    explanation: 'A bile não contém enzimas digestivas; sua ação é emulsificante — os sais biliares quebram grandes glóbulos de gordura em gotículas menores (emulsificação), aumentando muito a área de superfície disponível para que a lipase pancreática atue de forma eficiente na digestão dos triglicerídeos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_15',
    chapter: 'Sangue e Imunologia',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'As hemácias (eritrócitos) humanas maduras têm uma característica estrutural incomum entre as células do corpo: elas',
    options: [
      { id: 'a', text: 'Possuem núcleo grande e muitas mitocôndrias' },
      { id: 'b', text: 'Perdem o núcleo durante sua maturação, otimizando o espaço interno para transporte de hemoglobina e oxigênio' },
      { id: 'c', text: 'São as maiores células do corpo humano' },
      { id: 'd', text: 'Realizam fotossíntese para produzir seu próprio ATP' }
    ],
    correctOptionId: 'b',
    explanation: 'As hemácias humanas maduras perdem o núcleo e a maioria das organelas durante a eritropoiese, o que aumenta o espaço interno disponível para moléculas de hemoglobina, otimizando sua função de transporte de oxigênio — em compensação, isso limita sua vida útil (cerca de 120 dias) e capacidade de autorreparo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_16',
    chapter: 'Sangue e Imunologia',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'As plaquetas (fragmentos celulares presentes no sangue) desempenham papel central em qual processo fisiológico?',
    options: [
      { id: 'a', text: 'Transporte de oxigênio pelos tecidos' },
      { id: 'b', text: 'Coagulação sanguínea, ao se aglutinarem e liberarem fatores que iniciam a cascata de coagulação em locais de lesão vascular' },
      { id: 'c', text: 'Produção de anticorpos específicos' },
      { id: 'd', text: 'Digestão de patógenos por fagocitose' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando há lesão em um vaso sanguíneo, as plaquetas aderem ao local, se agregam e liberam substâncias que desencadeiam a cascata de coagulação, culminando na conversão de fibrinogênio em fibrina e na formação do coágulo, que estanca o sangramento.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_17',
    chapter: 'Sangue e Imunologia',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Os leucócitos (glóbulos brancos) são um grupo diverso de células com papel central na imunidade. Qual das opções descreve corretamente uma de suas funções?',
    options: [
      { id: 'a', text: 'Os linfócitos B, quando ativados, podem se diferenciar em plasmócitos produtores de anticorpos' },
      { id: 'b', text: 'Todos os leucócitos são incapazes de sair da corrente sanguínea' },
      { id: 'c', text: 'Os leucócitos são responsáveis exclusivamente pelo transporte de oxigênio' },
      { id: 'd', text: 'Os leucócitos não participam de nenhum mecanismo de defesa imunológica' }
    ],
    correctOptionId: 'a',
    explanation: 'Os linfócitos B, ao serem ativados por um antígeno específico (com auxílio de linfócitos T auxiliares), diferenciam-se em plasmócitos, células especializadas na produção e secreção de grandes quantidades de anticorpos direcionados àquele antígeno — parte central da resposta imune adaptativa humoral.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_18',
    chapter: 'Coração e Vasos Sanguíneos',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O ciclo cardíaco é dividido em duas fases principais. A sístole ventricular corresponde a:',
    options: [
      { id: 'a', text: 'O relaxamento dos ventrículos, permitindo seu enchimento com sangue' },
      { id: 'b', text: 'A contração dos ventrículos, que ejeta o sangue para a artéria pulmonar e para a aorta' },
      { id: 'c', text: 'A parada completa e simultânea de todas as câmaras cardíacas' },
      { id: 'd', text: 'A fase em que apenas os átrios se contraem' }
    ],
    correctOptionId: 'b',
    explanation: 'A sístole ventricular é a fase de contração dos ventrículos, que gera pressão suficiente para abrir as valvas semilunares e ejetar o sangue para a artéria pulmonar (ventrículo direito) e para a aorta (ventrículo esquerdo). Já a diástole é a fase de relaxamento, em que as câmaras se enchem de sangue.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_19',
    chapter: 'Coração e Vasos Sanguíneos',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Em relação à estrutura dos vasos sanguíneos, é correto afirmar que:',
    options: [
      { id: 'a', text: 'As artérias têm paredes mais espessas e elásticas, adaptadas a suportar a alta pressão do sangue bombeado pelo coração' },
      { id: 'b', text: 'Os capilares possuem paredes musculares espessas, semelhantes às das artérias' },
      { id: 'c', text: 'As veias sempre transportam sangue arterial e as artérias sempre transportam sangue venoso' },
      { id: 'd', text: 'Todos os vasos sanguíneos têm exatamente a mesma espessura de parede' }
    ],
    correctOptionId: 'a',
    explanation: 'As artérias possuem paredes musculares e elásticas espessas, adaptadas para suportar a alta pressão do sangue ejetado pelo coração. Os capilares, em contraste, têm paredes finíssimas (uma única camada de células), o que favorece as trocas de gases e nutrientes com os tecidos. As veias têm paredes mais finas que as artérias e contam com valvas para evitar refluxo, já que operam sob baixa pressão.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_20',
    chapter: 'Fisiologia da Respiração',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A inspiração pulmonar humana é impulsionada principalmente pela contração de qual músculo, que aumenta o volume da caixa torácica?',
    options: [
      { id: 'a', text: 'O diafragma, que se contrai e se achata, aumentando o volume torácico e reduzindo a pressão interna, permitindo a entrada de ar' },
      { id: 'b', text: 'O músculo cardíaco' },
      { id: 'c', text: 'O músculo liso do esôfago' },
      { id: 'd', text: 'Os músculos da língua' }
    ],
    correctOptionId: 'a',
    explanation: 'Durante a inspiração, o diafragma se contrai e se achata (descendo), aumentando o volume da cavidade torácica; isso reduz a pressão interna dos pulmões abaixo da pressão atmosférica, fazendo o ar fluir para dentro. Na expiração normal (passiva), o diafragma relaxa e retorna à sua posição em cúpula.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_21',
    chapter: 'Fisiologia da Respiração',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O transporte de oxigênio pelo sangue depende fundamentalmente de uma proteína presente nas hemácias. Essa proteína é:',
    options: [
      { id: 'a', text: 'A hemoglobina, que se liga reversivelmente ao oxigênio nos pulmões e o libera nos tecidos' },
      { id: 'b', text: 'A queratina' },
      { id: 'c', text: 'A insulina' },
      { id: 'd', text: 'O colágeno' }
    ],
    correctOptionId: 'a',
    explanation: 'A hemoglobina, presente em alta concentração nas hemácias, liga-se reversivelmente ao oxigênio nos capilares pulmonares (onde a concentração de O2 é alta) formando oxi-hemoglobina, e o libera nos tecidos periféricos (onde a concentração de O2 é baixa e a demanda é alta), sendo essencial para o transporte eficiente de oxigênio no sangue.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_animal_22',
    chapter: 'Fisiologia da Excreção',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O hormônio antidiurético (ADH ou vasopressina) atua nos rins regulando a reabsorção de água. Seu principal efeito é:',
    options: [
      { id: 'a', text: 'Aumentar a permeabilidade dos túbulos coletores à água, aumentando sua reabsorção e produzindo uma urina mais concentrada' },
      { id: 'b', text: 'Impedir totalmente a formação de urina' },
      { id: 'c', text: 'Diminuir a reabsorção de água, sempre produzindo urina diluída' },
      { id: 'd', text: 'Atuar exclusivamente sobre o glomérulo, sem efeito nos túbulos' }
    ],
    correctOptionId: 'a',
    explanation: 'Quando há desidratação ou aumento da osmolaridade do sangue, o ADH é liberado pela hipófise posterior e aumenta a permeabilidade dos túbulos coletores renais à água, elevando sua reabsorção e concentrando a urina — um mecanismo importante de regulação do equilíbrio hídrico do corpo.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_23',
    chapter: 'Fisiologia da Excreção',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Ao longo dos túbulos renais, após a filtração glomerular, ocorrem os processos de reabsorção tubular e secreção tubular. A reabsorção tubular consiste em:',
    options: [
      { id: 'a', text: 'Retornar à corrente sanguínea substâncias úteis do filtrado, como glicose, aminoácidos e a maior parte da água' },
      { id: 'b', text: 'Filtrar o sangue pela primeira vez no glomérulo' },
      { id: 'c', text: 'Eliminar diretamente a urina para o exterior do corpo' },
      { id: 'd', text: 'Produzir hemácias novas' }
    ],
    correctOptionId: 'a',
    explanation: 'Após a filtração no glomérulo, o filtrado (semelhante ao plasma) passa pelos túbulos renais, onde substâncias úteis ao organismo — como glicose, aminoácidos e a maior parte da água — são reabsorvidas de volta para a corrente sanguínea, enquanto a secreção tubular adiciona certas substâncias (como íons H+ e alguns fármacos) do sangue para o filtrado, ajustando a composição final da urina.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_24',
    chapter: 'Fisiologia da Coordenação Nervosa I',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O potencial de ação em um neurônio é gerado por mudanças rápidas na permeabilidade da membrana a determinados íons. A despolarização inicial do potencial de ação é causada principalmente por:',
    options: [
      { id: 'a', text: 'Entrada rápida de íons sódio (Na+) através de canais de sódio dependentes de voltagem que se abrem' },
      { id: 'b', text: 'Saída de íons cálcio (Ca2+) da célula' },
      { id: 'c', text: 'Entrada de íons cloreto (Cl-) na célula' },
      { id: 'd', text: 'Ausência total de qualquer movimento iônico' }
    ],
    correctOptionId: 'a',
    explanation: 'Quando o estímulo atinge o limiar, canais de sódio dependentes de voltagem se abrem, permitindo um rápido influxo de Na+ para dentro do neurônio, o que despolariza a membrana (torna o interior mais positivo) — essa fase de despolarização é seguida pela repolarização, causada pelo efluxo de íons potássio (K+).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_25',
    chapter: 'Fisiologia da Coordenação Nervosa I',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O arco reflexo (como o reflexo patelar) é um circuito nervoso que permite uma resposta motora rápida a um estímulo, sem a necessidade de processamento consciente pelo encéfalo. Esse circuito envolve, na ordem correta:',
    options: [
      { id: 'a', text: 'Receptor sensorial → neurônio sensorial (aferente) → centro integrador na medula espinal → neurônio motor (eferente) → músculo (efetuador)' },
      { id: 'b', text: 'Apenas o cérebro, sem qualquer participação da medula espinal' },
      { id: 'c', text: 'Músculo → medula → cérebro → receptor sensorial, nessa ordem' },
      { id: 'd', text: 'Um único neurônio que faz todo o trajeto do estímulo à resposta' }
    ],
    correctOptionId: 'a',
    explanation: 'No arco reflexo, um receptor sensorial capta o estímulo e o neurônio aferente (sensorial) conduz o impulso até um centro integrador na medula espinal (não no cérebro), onde geralmente faz sinapse direta ou por um interneurônio com o neurônio eferente (motor), que conduz a resposta até o músculo efetuador — permitindo uma resposta muito mais rápida que se o sinal precisasse chegar ao encéfalo primeiro.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_26',
    chapter: 'Coordenação Nervosa II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O sistema nervoso autônomo, responsável por regular funções involuntárias do corpo (como frequência cardíaca e digestão), se divide em duas divisões com ações geralmente antagônicas. Essas divisões são:',
    options: [
      { id: 'a', text: 'Simpático e parassimpático, sendo o simpático associado a respostas de "luta ou fuga" e o parassimpático a respostas de "repouso e digestão"' },
      { id: 'b', text: 'Sensorial e motor, sem qualquer relação com respostas involuntárias' },
      { id: 'c', text: 'Central e periférico, ambos exclusivamente voluntários' },
      { id: 'd', text: 'Aferente e eferente, controlando apenas os músculos esqueléticos' }
    ],
    correctOptionId: 'a',
    explanation: 'O sistema nervoso autônomo divide-se em simpático, que prepara o corpo para situações de estresse ou emergência ("luta ou fuga": aumenta frequência cardíaca, dilata pupilas, reduz digestão), e parassimpático, que promove funções de "repouso e digestão" (reduz frequência cardíaca, estimula digestão) — as duas divisões geralmente atuam de forma antagônica sobre os mesmos órgãos-alvo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_27',
    chapter: 'Coordenação Nervosa II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O cerebelo, uma das principais estruturas do encéfalo humano, tem como função principal:',
    options: [
      { id: 'a', text: 'Coordenar o equilíbrio, a postura e a precisão dos movimentos voluntários' },
      { id: 'b', text: 'Processar exclusivamente informações visuais' },
      { id: 'c', text: 'Produzir hormônios diretamente na corrente sanguínea' },
      { id: 'd', text: 'Controlar a digestão de forma isolada, sem relação com o restante do sistema nervoso' }
    ],
    correctOptionId: 'a',
    explanation: 'O cerebelo integra informações sensoriais (proprioceptivas, vestibulares e visuais) com comandos motores do córtex cerebral para ajustar e refinar o equilíbrio, a postura e a precisão/coordenação dos movimentos voluntários — lesões cerebelares tipicamente causam perda de coordenação motora (ataxia), sem paralisia.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_28',
    chapter: 'Sistemas Sensoriais: Visão e Audição',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Na retina do olho humano, dois tipos principais de fotorreceptores captam a luz. Os cones são responsáveis por:',
    options: [
      { id: 'a', text: 'Visão em cores e alta acuidade visual em condições de boa luminosidade' },
      { id: 'b', text: 'Visão em preto e branco em condições de baixa luminosidade, sendo muito mais sensíveis à luz que os bastonetes' },
      { id: 'c', text: 'Produção de lágrimas' },
      { id: 'd', text: 'Acomodação do cristalino' }
    ],
    correctOptionId: 'a',
    explanation: 'Os cones são fotorreceptores especializados em visão de cores (existem três tipos, sensíveis a diferentes comprimentos de onda) e alta acuidade visual, mas exigem boa luminosidade para funcionar bem. Já os bastonetes são muito mais sensíveis à luz (permitindo visão em baixa luminosidade), porém não distinguem cores e têm menor acuidade.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_29',
    chapter: 'Sistemas Sensoriais: Visão e Audição',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'No ouvido interno, a cóclea é a estrutura responsável pela audição propriamente dita. Sua função é:',
    options: [
      { id: 'a', text: 'Converter as vibrações mecânicas do som em impulsos nervoros, por meio de células ciliadas sensíveis a diferentes frequências' },
      { id: 'b', text: 'Amplificar exclusivamente o som, sem qualquer conversão em sinal nervoso' },
      { id: 'c', text: 'Controlar o equilíbrio corporal, sem qualquer relação com a audição' },
      { id: 'd', text: 'Produzir cera (cerúmen) para proteger o canal auditivo' }
    ],
    correctOptionId: 'a',
    explanation: 'A cóclea é uma estrutura espiralada preenchida por líquido, contendo o órgão de Corti com células ciliadas que, ao serem deformadas pelas ondas sonoras (transmitidas pelos ossículos do ouvido médio), convertem essa energia mecânica em impulsos nervosos enviados ao encéfalo via nervo auditivo — diferentes regiões da cóclea respondem a diferentes frequências sonoras.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_30',
    chapter: 'Coordenação Endócrina I',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A hipófise (glândula pituitária) é frequentemente chamada de "glândula mestra" porque:',
    options: [
      { id: 'a', text: 'Produz hormônios que regulam a atividade de várias outras glândulas endócrinas, como a tireoide e as adrenais' },
      { id: 'b', text: 'É a única glândula endócrina do corpo humano' },
      { id: 'c', text: 'Não sofre qualquer regulação por outras estruturas' },
      { id: 'd', text: 'Produz apenas insulina' }
    ],
    correctOptionId: 'a',
    explanation: 'A hipófise secreta hormônios trópicos que estimulam e regulam a atividade de outras glândulas endócrinas (por exemplo, TSH estimula a tireoide, ACTH estimula o córtex adrenal), coordenando boa parte do sistema endócrino — por isso é chamada de "glândula mestra", embora ela própria seja regulada pelo hipotálamo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_31',
    chapter: 'Coordenação Endócrina I',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A glândula tireoide produz os hormônios tiroxina (T4) e tri-iodotironina (T3), cuja principal função é:',
    options: [
      { id: 'a', text: 'Regular a taxa metabólica basal do corpo, influenciando o consumo de oxigênio e a produção de calor pelas células' },
      { id: 'b', text: 'Regular exclusivamente os níveis de glicose no sangue' },
      { id: 'c', text: 'Controlar a coagulação sanguínea' },
      { id: 'd', text: 'Produzir anticorpos' },
    ],
    correctOptionId: 'a',
    explanation: 'Os hormônios tireoidianos T3 e T4 atuam sobre praticamente todas as células do corpo, regulando a taxa metabólica basal — influenciam o consumo de oxigênio, a produção de calor e o metabolismo de carboidratos, lipídios e proteínas. Disfunções na tireoide (hipo ou hipertireoidismo) alteram significativamente o metabolismo geral do corpo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_32',
    chapter: 'Coordenação Endócrina II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O pâncreas endócrino, através das ilhotas de Langerhans, regula os níveis de glicose no sangue por meio de dois hormônios antagônicos. São eles:',
    options: [
      { id: 'a', text: 'Insulina (reduz a glicemia, promovendo a entrada de glicose nas células) e glucagon (aumenta a glicemia, estimulando a quebra de glicogênio hepático)' },
      { id: 'b', text: 'Adrenalina e cortisol, ambos produzidos pelo pâncreas' },
      { id: 'c', text: 'Apenas insulina, sem qualquer hormônio antagônico' },
      { id: 'd', text: 'TSH e ACTH' }
    ],
    correctOptionId: 'a',
    explanation: 'As células beta das ilhotas de Langerhans produzem insulina, que reduz a glicemia ao facilitar a entrada de glicose nas células e estimular sua conversão em glicogênio; as células alfa produzem glucagon, que eleva a glicemia estimulando a quebra do glicogênio hepático (glicogenólise) e a produção de glicose (gliconeogênese). Juntos, mantêm a glicemia dentro de uma faixa estreita.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_33',
    chapter: 'Coordenação Endócrina II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A maioria dos hormônios do corpo humano é regulada por um mecanismo de retroalimentação (feedback) negativa. Isso significa que:',
    options: [
      { id: 'a', text: 'O aumento da concentração de um hormônio (ou de seu efeito) tende a inibir sua própria produção adicional, mantendo a homeostase' },
      { id: 'b', text: 'O aumento de um hormônio sempre estimula ainda mais sua própria produção, sem qualquer limite' },
      { id: 'c', text: 'Os hormônios não sofrem qualquer tipo de regulação' },
      { id: 'd', text: 'Apenas hormônios sexuais utilizam retroalimentação' }
    ],
    correctOptionId: 'a',
    explanation: 'No feedback negativo (o mecanismo mais comum na regulação hormonal), o aumento de um hormônio ou de seu efeito fisiológico sinaliza para a glândula produtora (ou para o eixo hipotálamo-hipófise que a controla) reduzir a produção adicional — como ocorre com o hormônio tireoidiano, que inibe a liberação de TSH pela hipófise, mantendo os níveis hormonais dentro de uma faixa estável (homeostase).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_34',
    chapter: 'Reprodução Humana e Métodos Contraceptivos',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'No ciclo menstrual humano, a ovulação (liberação do óvulo pelo ovário) é desencadeada principalmente por:',
    options: [
      { id: 'a', text: 'Um pico repentino do hormônio luteinizante (LH), estimulado pelo aumento prévio de estrogênio' },
      { id: 'b', text: 'Uma queda contínua de progesterona ao longo de todo o ciclo' },
      { id: 'c', text: 'A ausência total de hormônios hipofisários' },
      { id: 'd', text: 'A menstruação em si, que ocorre simultaneamente à ovulação' }
    ],
    correctOptionId: 'a',
    explanation: 'Ao longo da fase folicular, o estrogênio produzido pelo folículo em desenvolvimento aumenta progressivamente; quando atinge um nível suficientemente alto, ele desencadeia (por retroalimentação positiva, uma exceção à regra geral) um pico abrupto de LH pela hipófise, o que induz a ovulação cerca de 24-36 horas depois.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_35',
    chapter: 'Reprodução Humana e Métodos Contraceptivos',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Os métodos contraceptivos hormonais (como a pílula anticoncepcional combinada) previnem a gravidez principalmente por:',
    options: [
      { id: 'a', text: 'Inibir a ovulação, mantendo níveis hormonais artificialmente estáveis que impedem o pico de LH necessário para liberar o óvulo' },
      { id: 'b', text: 'Formar uma barreira física entre espermatozoide e óvulo, como um preservativo' },
      { id: 'c', text: 'Destruir diretamente os espermatozoides no trato reprodutivo' },
      { id: 'd', text: 'Impedir totalmente a menstruação, sem qualquer efeito sobre a ovulação' }
    ],
    correctOptionId: 'a',
    explanation: 'A pílula combinada (estrogênio + progestagênio) mantém níveis hormonais relativamente constantes e elevados, o que impede o pico de LH necessário para desencadear a ovulação — diferentemente de métodos de barreira (como preservativos), que atuam impedindo fisicamente o encontro entre espermatozoide e óvulo, sem interferir no eixo hormonal.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_animal_36',
    chapter: 'Reprodução Humana e Métodos Contraceptivos',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'Ao contrário da produção contínua de espermatozoides (espermatogênese) nos testículos a partir da puberdade, a produção de óvulos na mulher (ovogênese) tem uma característica distinta:',
    options: [
      { id: 'a', text: 'Os oócitos primários já estão formados desde a vida fetal, ficando estacionados em uma fase da meiose até serem recrutados ciclo a ciclo' },
      { id: 'b', text: 'Novos oócitos são produzidos continuamente ao longo de toda a vida adulta da mulher, assim como os espermatozoides' },
      { id: 'c', text: 'A ovogênese não envolve qualquer processo de meiose' },
      { id: 'd', text: 'Cada oócito primário origina, ao final, quatro óvulos funcionais, assim como ocorre na espermatogênese' }
    ],
    correctOptionId: 'a',
    explanation: 'Diferentemente da espermatogênese (contínua a partir da puberdade), na ovogênese os oócitos primários já são formados durante a vida fetal e ficam estacionados na prófase I da meiose até serem recrutados, um a cada ciclo, a partir da puberdade. Além disso, a meiose na ovogênese é desigual, produzindo um óvulo funcional e corpúsculos polares (não aproveitáveis) a cada ciclo, e só se completa caso ocorra fecundação.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_37',
    chapter: 'Coordenação Nervosa II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'O córtex cerebral humano é dividido em áreas especializadas para diferentes funções. A área de Broca, localizada no lobo frontal, está diretamente associada a:',
    options: [
      { id: 'a', text: 'A produção da fala articulada — lesões nessa área causam dificuldade para falar, embora a compreensão da linguagem possa permanecer intacta' },
      { id: 'b', text: 'O processamento exclusivamente de estímulos visuais' },
      { id: 'c', text: 'O controle do equilíbrio corporal' },
      { id: 'd', text: 'A produção de hormônios hipofisários' }
    ],
    correctOptionId: 'a',
    explanation: 'A área de Broca, no lobo frontal (geralmente do hemisfério esquerdo), está associada à produção motora da fala. Lesões nessa área causam a chamada afasia de Broca, em que a pessoa compreende a linguagem mas tem grande dificuldade para articular palavras e frases de forma fluente — distinta da área de Wernicke, associada à compreensão da linguagem.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_38',
    chapter: 'Sistemas Sensoriais: Visão e Audição',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'A acomodação visual, processo pelo qual o olho ajusta o foco para enxergar objetos a diferentes distâncias, é realizada principalmente por meio de:',
    options: [
      { id: 'a', text: 'Mudanças na curvatura do cristalino, controladas pela contração ou relaxamento do músculo ciliar' },
      { id: 'b', text: 'Movimentos do globo ocular inteiro, sem qualquer alteração no cristalino' },
      { id: 'c', text: 'Dilatação e contração exclusivas da pupila' },
      { id: 'd', text: 'Mudanças na quantidade de fotorreceptores ativos na retina' }
    ],
    correctOptionId: 'a',
    explanation: 'O músculo ciliar, ao se contrair ou relaxar, altera a tensão sobre os ligamentos suspensores que sustentam o cristalino, modificando sua curvatura: para focar objetos próximos, o cristalino se torna mais convexo (músculo ciliar contraído); para objetos distantes, ele se achata (músculo ciliar relaxado). Esse ajuste fino de foco é chamado de acomodação visual.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_animal_39',
    chapter: 'Coordenação Endócrina II',
    topicId: 'bio_fisio_animal',
    subject: 'Biologia',
    prompt: 'As glândulas adrenais (suprarrenais), localizadas sobre os rins, produzem o hormônio adrenalina (epinefrina) em situações de estresse. Seus efeitos incluem:',
    options: [
      { id: 'a', text: 'Reduzir a frequência cardíaca e promover sonolência' },
      { id: 'b', text: 'Aumentar a frequência cardíaca, elevar a glicemia e redirecionar o fluxo sanguíneo para os músculos, preparando o corpo para uma resposta rápida' },
      { id: 'c', text: 'Diminuir exclusivamente a pressão arterial, sem qualquer outro efeito' },
      { id: 'd', text: 'Atuar apenas sobre o sistema digestório, estimulando a digestão' }
    ],
    correctOptionId: 'b',
    explanation: 'A adrenalina, liberada pela medula das glândulas adrenais em resposta a situações de estresse ou perigo, atua em conjunto com o sistema nervoso simpático: aumenta a frequência cardíaca e a pressão arterial, eleva a glicemia (mobilizando reservas de glicogênio) e redireciona o fluxo sanguíneo para os músculos esqueléticos, preparando rapidamente o corpo para a resposta de "luta ou fuga".',
    difficulty: 'medium'
  },
  // Biologia — Ecologia
  {
    id: 'q_bio_ecologia_1',
    chapter: 'Introdução à Ecologia',
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
    chapter: 'Introdução à Ecologia',
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
    chapter: 'Introdução à Ecologia',
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
    chapter: 'Ciclos Biogeoquímicos – Ciclo do Carbono',
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
  {
    id: 'q_bio_ecologia_5',
    chapter: 'Dinâmica de Populações',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O crescimento populacional em forma de "J" (exponencial), observado quando uma população tem recursos praticamente ilimitados, tende a ser substituído, na prática, pelo crescimento em forma de "S" (logístico) principalmente porque:',
    options: [
      { id: 'a', text: 'Os recursos do ambiente são finitos, e a população eventualmente se aproxima da capacidade de suporte do meio, desacelerando seu crescimento' },
      { id: 'b', text: 'As populações nunca crescem de forma exponencial em nenhuma circunstância' },
      { id: 'c', text: 'O crescimento em "S" ocorre apenas em laboratório, nunca na natureza' },
      { id: 'd', text: 'A capacidade de suporte do ambiente é sempre infinita' }
    ],
    correctOptionId: 'a',
    explanation: 'O crescimento exponencial (em "J") só se sustenta enquanto os recursos são abundantes. Na prática, à medida que a população cresce, os recursos (alimento, espaço) tornam-se limitantes, e fatores como competição e predação desaceleram o crescimento, que se estabiliza próximo à capacidade de suporte do ambiente — gerando a curva em "S" (logística).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_6',
    chapter: 'Dinâmica de Populações',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A capacidade de suporte de um ambiente, conceito central na dinâmica de populações, se refere a:',
    options: [
      { id: 'a', text: 'O número máximo de espécies diferentes que podem viver em um mesmo local' },
      { id: 'b', text: 'O tamanho populacional máximo que um ambiente consegue sustentar de forma estável, considerando os recursos disponíveis' },
      { id: 'c', text: 'A taxa de natalidade de uma população, isoladamente' },
      { id: 'd', text: 'Uma medida fixa, igual para todas as espécies e ambientes' }
    ],
    correctOptionId: 'b',
    explanation: 'A capacidade de suporte é o tamanho populacional máximo que um determinado ambiente pode sustentar de forma estável a longo prazo, dados os recursos disponíveis (alimento, água, espaço, abrigo) — variando conforme a espécie e as condições específicas de cada ambiente.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_ecologia_7',
    chapter: 'Dinâmica de Populações',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Fatores dependentes da densidade populacional (como competição por alimento e disseminação de doenças) regulam o tamanho de uma população principalmente porque:',
    options: [
      { id: 'a', text: 'Seu efeito se intensifica à medida que a densidade populacional aumenta, funcionando como um mecanismo natural de controle' },
      { id: 'b', text: 'Atuam da mesma forma, independentemente do tamanho da população' },
      { id: 'c', text: 'Não têm qualquer relação com o tamanho da população' },
      { id: 'd', text: 'Só atuam quando a população está muito pequena' }
    ],
    correctOptionId: 'a',
    explanation: 'Fatores dependentes da densidade (como competição por recursos, predação e disseminação de doenças) se intensificam à medida que a densidade populacional aumenta — quanto mais indivíduos, maior a competição e a facilidade de transmissão de doenças —, atuando como um mecanismo natural que tende a limitar o crescimento populacional quando ele se aproxima da capacidade de suporte.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_8',
    chapter: 'Espécies Invasoras e Controle Biológico',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Uma espécie invasora, introduzida em um novo ambiente (geralmente pela ação humana), costuma se tornar um problema ecológico grave principalmente porque:',
    options: [
      { id: 'a', text: 'Chega ao novo ambiente já adaptada, mas sem seus predadores ou competidores naturais, podendo se proliferar descontroladamente e prejudicar espécies nativas' },
      { id: 'b', text: 'É sempre mais fraca que as espécies nativas, nunca representando risco algum' },
      { id: 'c', text: 'Nunca consegue sobreviver fora de seu ambiente de origem' },
      { id: 'd', text: 'É automaticamente eliminada pelo ambiente em poucos meses' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma espécie invasora, ao chegar a um novo ambiente sem os predadores, parasitas ou competidores naturais que normalmente controlariam sua população em seu habitat de origem, pode se proliferar sem controle, competindo com espécies nativas por recursos e, em muitos casos, causando desequilíbrios ecológicos significativos ou até extinções locais.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_9',
    chapter: 'Espécies Invasoras e Controle Biológico',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O controle biológico, estratégia usada para conter populações de pragas ou espécies invasoras, consiste em:',
    options: [
      { id: 'a', text: 'Utilizar exclusivamente produtos químicos sintéticos (agrotóxicos)' },
      { id: 'b', text: 'Introduzir ou favorecer um inimigo natural (predador, parasita ou patógeno) da praga ou espécie invasora, para reduzir sua população de forma mais natural' },
      { id: 'c', text: 'Eliminar completamente todas as espécies de um ecossistema' },
      { id: 'd', text: 'Não ter qualquer relação com o manejo de pragas' }
    ],
    correctOptionId: 'b',
    explanation: 'O controle biológico consiste em usar inimigos naturais (predadores, parasitoides ou patógenos específicos) de uma praga ou espécie invasora para reduzir sua população, como alternativa (ou complemento) ao uso de agrotóxicos — buscando um controle mais sustentável e com menor impacto ambiental, embora exija estudo cuidadoso para evitar que o próprio agente de controle se torne um problema.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_10',
    chapter: 'Espécies Invasoras e Controle Biológico',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A introdução de um agente de controle biológico sem estudos prévios adequados pode, paradoxalmente, causar novos problemas ecológicos porque:',
    options: [
      { id: 'a', text: 'O agente introduzido pode não se limitar à praga-alvo, atacando também espécies nativas, tornando-se ele mesmo uma nova espécie invasora' },
      { id: 'b', text: 'Isso nunca acontece na prática, sendo sempre um método totalmente seguro' },
      { id: 'c', text: 'O agente de controle sempre desaparece completamente após eliminar a praga-alvo' },
      { id: 'd', text: 'Não há qualquer risco ecológico associado ao controle biológico' }
    ],
    correctOptionId: 'a',
    explanation: 'Um agente de controle biológico mal avaliado pode não se restringir à espécie-alvo, atacando também espécies nativas ou se estabelecendo e se proliferando descontroladamente no novo ambiente — tornando-se, ele mesmo, uma nova espécie invasora e criando um problema ecológico adicional, em vez de resolver o original.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_ecologia_11',
    chapter: 'Sucessão Ecológica',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A comunidade clímax, estágio final de uma sucessão ecológica, é caracterizada por:',
    options: [
      { id: 'a', text: 'Ser instável e mudar completamente a cada poucos dias' },
      { id: 'b', text: 'Ser uma comunidade relativamente estável, em equilíbrio dinâmico com as condições ambientais locais, que se mantém até que uma nova perturbação ocorra' },
      { id: 'c', text: 'Ser composta exclusivamente por espécies pioneiras' },
      { id: 'd', text: 'Nunca ocorrer na natureza' }
    ],
    correctOptionId: 'b',
    explanation: 'A comunidade clímax é o estágio relativamente estável e maduro de uma sucessão ecológica, em equilíbrio dinâmico com as condições ambientais (clima, solo) da região — tendendo a se manter dessa forma até que uma nova perturbação (natural ou humana) reinicie o processo sucessional.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_12',
    chapter: 'Sucessão Ecológica',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'As espécies pioneiras, primeiras a colonizar um ambiente durante uma sucessão ecológica, geralmente compartilham características como:',
    options: [
      { id: 'a', text: 'Crescimento lento e grande porte, como grandes árvores' },
      { id: 'b', text: 'Rápido crescimento, alta capacidade de dispersão e tolerância a condições ambientais adversas (como solo pobre em nutrientes ou grande exposição solar)' },
      { id: 'c', text: 'Total dependência de uma comunidade já estabelecida para sobreviver' },
      { id: 'd', text: 'Serem sempre as espécies dominantes da comunidade clímax final' }
    ],
    correctOptionId: 'b',
    explanation: 'Espécies pioneiras (como líquens e certas gramíneas) costumam ter crescimento rápido, alta capacidade de dispersão de sementes ou esporos e tolerância a condições ambientais adversas — características que lhes permitem colonizar ambientes ainda inóspitos, antes de espécies de crescimento mais lento se estabelecerem nas etapas seguintes da sucessão.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_13',
    chapter: 'Ciclos Biogeoquímicos – Ciclo do Carbono',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'No ciclo do carbono, o CO2 atmosférico é removido principalmente pela ação de:',
    options: [
      { id: 'a', text: 'Respiração celular dos animais' },
      { id: 'b', text: 'Fotossíntese, realizada por produtores (plantas, algas e cianobactérias), que fixam o carbono do CO2 em moléculas orgânicas' },
      { id: 'c', text: 'Queima de combustíveis fósseis' },
      { id: 'd', text: 'Decomposição de matéria orgânica' }
    ],
    correctOptionId: 'b',
    explanation: 'A fotossíntese é o principal processo que remove CO2 da atmosfera, fixando o carbono em moléculas orgânicas (como a glicose) nos produtores — o carbono fixado então circula pela cadeia alimentar, sendo devolvido à atmosfera por processos como a respiração celular e a decomposição.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_ecologia_14',
    chapter: 'Ciclo do Nitrogênio',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A fixação biológica do nitrogênio, processo pelo qual o N2 atmosférico (inerte, inutilizável pela maioria dos seres vivos) é convertido em compostos nitrogenados utilizáveis (como amônia), é realizada principalmente por:',
    options: [
      { id: 'a', text: 'Todas as plantas, sem exceção' },
      { id: 'b', text: 'Bactérias fixadoras de nitrogênio, algumas vivendo livremente no solo e outras em associação simbiótica com raízes de certas plantas (como as leguminosas)' },
      { id: 'c', text: 'Exclusivamente por processos físicos, sem qualquer participação de seres vivos' },
      { id: 'd', text: 'Animais herbívoros, durante a digestão' }
    ],
    correctOptionId: 'b',
    explanation: 'A fixação biológica do nitrogênio é realizada por bactérias fixadoras (como as do gênero Rhizobium, em simbiose com raízes de leguminosas, e outras de vida livre no solo), que convertem o N2 atmosférico em amônia (NH3) — uma forma que pode ser incorporada por plantas e, através da cadeia alimentar, por outros organismos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_15',
    chapter: 'Ciclo do Nitrogênio',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A nitrificação, etapa do ciclo do nitrogênio realizada por bactérias nitrificantes no solo, consiste na conversão de:',
    options: [
      { id: 'a', text: 'Amônia (ou amônio) em nitrito e, depois, em nitrato — formas mais facilmente absorvidas pelas raízes das plantas' },
      { id: 'b', text: 'Nitrato diretamente em gás nitrogênio atmosférico' },
      { id: 'c', text: 'Proteínas em carboidratos' },
      { id: 'd', text: 'Gás nitrogênio em oxigênio' }
    ],
    correctOptionId: 'a',
    explanation: 'Na nitrificação, bactérias específicas do solo convertem amônia/amônio primeiro em nitrito, e depois em nitrato — uma forma nitrogenada geralmente mais facilmente absorvida pelas raízes das plantas do que o próprio amônio, dando continuidade ao ciclo do nitrogênio.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_16',
    chapter: 'Ciclo do Nitrogênio',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A desnitrificação, etapa final do ciclo do nitrogênio realizada por bactérias desnitrificantes (geralmente em ambientes com pouco oxigênio, como solos encharcados), tem como efeito:',
    options: [
      { id: 'a', text: 'Converter nitrato de volta em gás nitrogênio (N2), devolvendo-o à atmosfera e fechando o ciclo' },
      { id: 'b', text: 'Aumentar indefinidamente a quantidade de nitrato disponível no solo' },
      { id: 'c', text: 'Converter gás nitrogênio diretamente em proteínas' },
      { id: 'd', text: 'Não ter qualquer papel no ciclo do nitrogênio' }
    ],
    correctOptionId: 'a',
    explanation: 'A desnitrificação converte nitrato (NO3⁻) de volta em gás nitrogênio (N2), que retorna à atmosfera — fechando o ciclo do nitrogênio e evitando o acúmulo indefinido de compostos nitrogenados no solo e na água.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_17',
    chapter: 'Ciclo Hidrológico e Poluição da Água',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A poluição de corpos d\'água por esgoto doméstico não tratado, um problema ambiental comum, prejudica os ecossistemas aquáticos principalmente porque:',
    options: [
      { id: 'a', text: 'Aumenta a quantidade de oxigênio dissolvido disponível para os peixes' },
      { id: 'b', text: 'Fornece excesso de matéria orgânica, que é decomposta por bactérias que consomem grandes quantidades de oxigênio dissolvido na água, podendo causar a morte de peixes e outros organismos aquáticos por asfixia' },
      { id: 'c', text: 'Não tem qualquer efeito sobre os organismos aquáticos' },
      { id: 'd', text: 'Elimina completamente a presença de bactérias na água' }
    ],
    correctOptionId: 'b',
    explanation: 'O excesso de matéria orgânica do esgoto é decomposto por bactérias aeróbicas, que consomem grandes quantidades de oxigênio dissolvido na água durante esse processo — reduzindo drasticamente o oxigênio disponível para peixes e outros organismos aquáticos, podendo causar sua morte por asfixia.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_18',
    chapter: 'Ciclo Hidrológico e Poluição da Água',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A impermeabilização do solo pela urbanização (asfalto, concreto) afeta o ciclo hidrológico local principalmente porque:',
    options: [
      { id: 'a', text: 'Aumenta a infiltração de água no solo, reduzindo enchentes' },
      { id: 'b', text: 'Reduz a infiltração da água da chuva no solo, aumentando o escoamento superficial e elevando o risco de enchentes' },
      { id: 'c', text: 'Não tem qualquer efeito sobre o ciclo hidrológico' },
      { id: 'd', text: 'Elimina completamente a evaporação de água nas cidades' }
    ],
    correctOptionId: 'b',
    explanation: 'Superfícies impermeabilizadas (asfalto, concreto) impedem que a água da chuva infiltre no solo, aumentando o volume de água que escoa superficialmente — sobrecarregando sistemas de drenagem urbana e elevando significativamente o risco de enchentes em áreas urbanizadas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_ecologia_19',
    chapter: 'Ciclo Hidrológico e Poluição da Água',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'As matas ciliares, vegetação preservada às margens de rios e lagos, desempenham um papel importante na proteção dos corpos d\'água porque:',
    options: [
      { id: 'a', text: 'Ajudam a filtrar sedimentos e poluentes carregados pela água da chuva antes que cheguem ao rio, além de estabilizar as margens contra erosão' },
      { id: 'b', text: 'Não têm qualquer função ecológica relevante' },
      { id: 'c', text: 'Aumentam a poluição da água ao redor' },
      { id: 'd', text: 'Impedem completamente qualquer entrada de água no rio' }
    ],
    correctOptionId: 'a',
    explanation: 'As matas ciliares atuam como uma barreira natural, filtrando sedimentos, agrotóxicos e outros poluentes carregados pelo escoamento superficial antes que atinjam o corpo d\'água, além de estabilizar o solo das margens com suas raízes, reduzindo a erosão e o assoreamento dos rios.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_20',
    chapter: 'Eutrofização',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A eutrofização de um corpo d\'água, processo frequentemente causado pelo excesso de nutrientes (como nitrogênio e fósforo de fertilizantes ou esgoto), se caracteriza por:',
    options: [
      { id: 'a', text: 'Uma redução drástica na quantidade de nutrientes disponíveis na água' },
      { id: 'b', text: 'Um crescimento excessivo de algas e plantas aquáticas (proliferação, incluindo florações de algas), que pode levar à morte de peixes por falta de oxigênio quando essa biomassa se decompõe' },
      { id: 'c', text: 'A purificação natural da água, sem qualquer consequência ecológica' },
      { id: 'd', text: 'O aumento permanente da transparência da água' }
    ],
    correctOptionId: 'b',
    explanation: 'A eutrofização ocorre quando o excesso de nutrientes (nitrogênio, fósforo) estimula o crescimento explosivo de algas e plantas aquáticas. Quando essa grande quantidade de biomassa morre, sua decomposição por bactérias consome muito oxigênio dissolvido, podendo causar a morte de peixes e outros organismos aquáticos por asfixia.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_21',
    chapter: 'Eutrofização',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'As florações de algas (blooms), fenômeno associado à eutrofização, podem representar um risco adicional à saúde pública quando envolvem:',
    options: [
      { id: 'a', text: 'Cianobactérias capazes de produzir toxinas nocivas, contaminando a água usada para consumo humano ou recreação' },
      { id: 'b', text: 'Apenas espécies de algas completamente inofensivas, sem qualquer risco à saúde' },
      { id: 'c', text: 'Uma redução da quantidade de algas na água' },
      { id: 'd', text: 'Nenhum tipo de risco, já que algas são sempre benéficas ao ecossistema' }
    ],
    correctOptionId: 'a',
    explanation: 'Algumas florações de algas, especialmente as causadas por cianobactérias, podem produzir toxinas nocivas à saúde humana e animal, contaminando a água usada para abastecimento, pesca ou recreação — um risco adicional de saúde pública associado a corpos d\'água eutrofizados.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_22',
    chapter: 'Poluição do Ar',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O ozônio troposférico (próximo à superfície), formado pela reação de poluentes emitidos por veículos e indústrias sob luz solar, é considerado um poluente prejudicial porque:',
    options: [
      { id: 'a', text: 'Protege a superfície terrestre da radiação ultravioleta, da mesma forma que o ozônio da estratosfera' },
      { id: 'b', text: 'Causa irritação respiratória e danos a plantas e materiais, sendo prejudicial à saúde e ao ambiente ao nível do solo, diferente do ozônio estratosférico (protetor)' },
      { id: 'c', text: 'É completamente inofensivo à saúde humana' },
      { id: 'd', text: 'Não tem qualquer relação com poluentes veiculares ou industriais' }
    ],
    correctOptionId: 'b',
    explanation: 'Diferente do ozônio da estratosfera (que protege contra radiação UV), o ozônio troposférico é um poluente prejudicial: formado pela reação fotoquímica de poluentes (óxidos de nitrogênio e compostos orgânicos voláteis) sob luz solar, causa irritação respiratória em seres humanos e danos a plantas e materiais.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_ecologia_23',
    chapter: 'Poluição do Ar',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O material particulado (partículas sólidas ou líquidas em suspensão no ar, como fuligem e poeira), emitido principalmente por veículos e indústrias, é especialmente prejudicial à saúde quando:',
    options: [
      { id: 'a', text: 'Suas partículas são grandes o suficiente para não penetrar no sistema respiratório' },
      { id: 'b', text: 'Suas partículas são finas o suficiente para penetrar profundamente nos pulmões (e até na corrente sanguínea), causando ou agravando doenças respiratórias e cardiovasculares' },
      { id: 'c', text: 'É composto exclusivamente de vapor de água' },
      { id: 'd', text: 'Nunca atinge as vias respiratórias humanas' }
    ],
    correctOptionId: 'b',
    explanation: 'Partículas finas (como o material particulado fino, MP2,5) conseguem penetrar profundamente no sistema respiratório, alcançando os alvéolos pulmonares e, em alguns casos, a corrente sanguínea — associando-se a doenças respiratórias, cardiovasculares e outros problemas de saúde, especialmente com exposição prolongada.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_24',
    chapter: 'Biomagnificação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A biomagnificação (ou magnificação trófica) é o fenômeno pelo qual certas substâncias tóxicas (como metais pesados e alguns pesticidas):',
    options: [
      { id: 'a', text: 'Se diluem progressivamente à medida que sobem na cadeia alimentar, tornando-se inofensivas nos consumidores de topo' },
      { id: 'b', text: 'Se acumulam em concentrações cada vez maiores nos organismos de níveis tróficos mais altos, já que cada nível consome muitos organismos do nível anterior sem eliminar completamente essas substâncias' },
      { id: 'c', text: 'Afetam exclusivamente os produtores da cadeia alimentar' },
      { id: 'd', text: 'Não têm qualquer relação com a posição do organismo na cadeia alimentar' }
    ],
    correctOptionId: 'b',
    explanation: 'Na biomagnificação, substâncias tóxicas persistentes (não facilmente eliminadas pelo organismo) se acumulam em concentrações cada vez maiores à medida que sobem na cadeia alimentar, já que cada predador consome muitas presas contaminadas, concentrando a substância — por isso predadores de topo (como grandes peixes ou aves) costumam apresentar as maiores concentrações dessas substâncias.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_25',
    chapter: 'Biomagnificação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O mercúrio, um metal pesado tóxico que sofre biomagnificação em ambientes aquáticos, representa um risco particular para populações humanas que:',
    options: [
      { id: 'a', text: 'Consomem regularmente peixes de grande porte e predadores de topo, que tendem a acumular as maiores concentrações desse metal' },
      { id: 'b', text: 'Não consomem nenhum tipo de peixe' },
      { id: 'c', text: 'Vivem exclusivamente em regiões desérticas, sem qualquer corpo d\'água próximo' },
      { id: 'd', text: 'Consomem apenas produtores primários, como algas' }
    ],
    correctOptionId: 'a',
    explanation: 'Por causa da biomagnificação, peixes predadores de topo (como atum e outros peixes grandes) tendem a acumular as maiores concentrações de mercúrio na cadeia alimentar aquática — por isso populações humanas que consomem regularmente esses peixes em grande quantidade correm maior risco de exposição a esse metal tóxico.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_26',
    chapter: 'Poluição: Aquecimento Global, POPs e Biorremediação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'Os Poluentes Orgânicos Persistentes (POPs), como certos organoclorados, são particularmente preocupantes do ponto de vista ambiental porque:',
    options: [
      { id: 'a', text: 'Se degradam rapidamente no ambiente, desaparecendo em poucos dias' },
      { id: 'b', text: 'Resistem à degradação por longos períodos, podem se dispersar por longas distâncias e tendem a se acumular nos tecidos adiposos dos organismos (bioacumulação), sofrendo biomagnificação ao longo da cadeia alimentar' },
      { id: 'c', text: 'São compostos exclusivamente inorgânicos' },
      { id: 'd', text: 'Não têm qualquer capacidade de se acumular em organismos vivos' }
    ],
    correctOptionId: 'b',
    explanation: 'Poluentes Orgânicos Persistentes (POPs) são caracterizados por sua resistência à degradação ambiental (permanecendo por anos ou décadas), capacidade de se dispersar por longas distâncias (inclusive por via atmosférica) e tendência a se acumular no tecido adiposo de organismos vivos, sofrendo biomagnificação ao longo da cadeia alimentar — características que tornam seu controle e eliminação especialmente desafiadores.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_ecologia_27',
    chapter: 'Poluição: Aquecimento Global, POPs e Biorremediação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A biorremediação, técnica que utiliza organismos vivos (geralmente micro-organismos) para tratar ambientes contaminados, consiste em:',
    options: [
      { id: 'a', text: 'Utilizar bactérias, fungos ou plantas capazes de degradar, absorver ou neutralizar poluentes presentes no solo, na água ou no ar, reduzindo a contaminação de forma mais sustentável' },
      { id: 'b', text: 'Utilizar exclusivamente processos físicos, sem qualquer participação de organismos vivos' },
      { id: 'c', text: 'Aumentar deliberadamente a quantidade de poluentes em um ambiente' },
      { id: 'd', text: 'Uma técnica que nunca é utilizada na prática' }
    ],
    correctOptionId: 'a',
    explanation: 'A biorremediação utiliza a capacidade metabólica de certos organismos (bactérias, fungos, ou mesmo plantas, na fitorremediação) para degradar, absorver ou neutralizar poluentes presentes em solos, águas ou no ar contaminados — uma alternativa geralmente mais sustentável e de menor custo do que métodos exclusivamente físicos ou químicos de descontaminação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_28',
    chapter: 'Biomas Brasileiros',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O Pantanal, bioma brasileiro caracterizado por grandes planícies alagáveis sazonalmente, é considerado uma das áreas de maior biodiversidade do planeta principalmente devido a:',
    options: [
      { id: 'a', text: 'Seu regime de cheias e secas sazonais, que cria uma grande diversidade de habitats e favorece a concentração de fauna, especialmente durante a estação seca' },
      { id: 'b', text: 'Ser um bioma completamente árido, sem qualquer presença de água' },
      { id: 'c', text: 'Estar localizado exclusivamente em regiões de altitude elevada' },
      { id: 'd', text: 'Não ter qualquer relação com corpos d\'água' }
    ],
    correctOptionId: 'a',
    explanation: 'O regime sazonal de cheias (na estação chuvosa) e secas (quando a água se retrai, concentrando animais ao redor dos corpos d\'água remanescentes) cria uma grande diversidade de habitats e favorece a observação e a concentração de fauna abundante, tornando o Pantanal um dos ecossistemas de maior biodiversidade visível do planeta.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_29',
    chapter: 'Ciclos Biogeoquímicos – Ciclo do Carbono',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'No ciclo do carbono, o processo de fotossíntese e o processo de respiração celular desempenham papéis opostos e complementares. Isso significa que:',
    options: [
      { id: 'a', text: 'A fotossíntese remove CO2 da atmosfera, fixando-o em matéria orgânica, enquanto a respiração celular libera CO2 de volta à atmosfera ao degradar essa matéria orgânica' },
      { id: 'b', text: 'Ambos os processos liberam CO2 para a atmosfera, sem qualquer processo de fixação' },
      { id: 'c', text: 'A respiração celular ocorre apenas em plantas, nunca em animais' },
      { id: 'd', text: 'A fotossíntese libera carbono, e a respiração o fixa em compostos orgânicos' }
    ],
    correctOptionId: 'a',
    explanation: 'A fotossíntese, realizada por organismos autotróficos, remove CO2 da atmosfera e o converte em compostos orgânicos (glicose) usando energia luminosa. A respiração celular, realizada por praticamente todos os seres vivos, quebra essas moléculas orgânicas para obter energia, liberando CO2 de volta à atmosfera — os dois processos, em equilíbrio, mantêm o ciclo do carbono na biosfera.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_30',
    chapter: 'Eutrofização',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A eutrofização de corpos d\'água, frequentemente causada pelo excesso de nutrientes (nitrogênio e fósforo) provenientes de esgoto ou fertilizantes agrícolas, pode levar à morte de peixes principalmente porque:',
    options: [
      { id: 'a', text: 'O excesso de nutrientes causa proliferação de algas, cuja posterior decomposição por bactérias consome grande parte do oxigênio dissolvido na água, causando hipóxia' },
      { id: 'b', text: 'Os nutrientes são diretamente tóxicos para os peixes' },
      { id: 'c', text: 'A eutrofização reduz a temperatura da água drasticamente' },
      { id: 'd', text: 'O excesso de nutrientes impede totalmente a fotossíntese na água' }
    ],
    correctOptionId: 'a',
    explanation: 'O excesso de nutrientes (nitrogênio, fósforo) estimula um crescimento explosivo de algas e cianobactérias (florações). Quando essas algas morrem, sua decomposição por bactérias aeróbicas consome grande quantidade do oxigênio dissolvido na água, gerando hipóxia (baixa concentração de oxigênio) que pode causar a morte em massa de peixes e outros organismos aquáticos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_31',
    chapter: 'Poluição do Ar',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A chuva ácida, fenômeno associado à poluição atmosférica urbana e industrial, é formada principalmente pela reação da água da chuva com:',
    options: [
      { id: 'a', text: 'Óxidos de enxofre (SOx) e óxidos de nitrogênio (NOx), liberados na queima de combustíveis fósseis, que reagem com a umidade atmosférica formando ácidos sulfúrico e nítrico' },
      { id: 'b', text: 'Oxigênio puro, sem qualquer poluente envolvido' },
      { id: 'c', text: 'Vapor d\'água exclusivamente, sem qualquer gás poluente' },
      { id: 'd', text: 'Gases nobres, como o argônio' }
    ],
    correctOptionId: 'a',
    explanation: 'A queima de combustíveis fósseis (em veículos e indústrias) libera óxidos de enxofre e de nitrogênio na atmosfera. Esses gases reagem com a água presente no ar, formando ácido sulfúrico e ácido nítrico, que caem como chuva ácida, capaz de acidificar solos e corpos d\'água, corroer construções e prejudicar a vegetação.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_32',
    chapter: 'Biomagnificação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'A biomagnificação de certos poluentes (como mercúrio ou alguns pesticidas) ao longo de uma cadeia alimentar significa que:',
    options: [
      { id: 'a', text: 'A concentração do poluente tende a aumentar progressivamente a cada nível trófico, atingindo as maiores concentrações nos predadores de topo de cadeia' },
      { id: 'b', text: 'O poluente se dilui progressivamente a cada nível trófico, sendo inofensivo para os predadores de topo' },
      { id: 'c', text: 'A concentração do poluente permanece exatamente igual em todos os níveis tróficos' },
      { id: 'd', text: 'O fenômeno ocorre apenas em ambientes terrestres, nunca em ambientes aquáticos' }
    ],
    correctOptionId: 'a',
    explanation: 'Poluentes persistentes e lipossolúveis (como mercúrio e certos organoclorados) não são facilmente eliminados pelo organismo e se acumulam nos tecidos. Como cada predador consome muitas presas ao longo da vida, a concentração desses poluentes tende a aumentar a cada nível trófico (biomagnificação), atingindo os níveis mais altos nos predadores de topo de cadeia — inclusive o ser humano, em muitos casos.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_ecologia_33',
    chapter: 'Poluição: Aquecimento Global, POPs e Biorremediação',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O efeito estufa, fenômeno natural intensificado pela atividade humana e associado ao aquecimento global, ocorre porque determinados gases atmosféricos (como CO2 e metano):',
    options: [
      { id: 'a', text: 'Retêm parte da radiação infravermelha (calor) reemitida pela superfície terrestre, impedindo que ela escape totalmente para o espaço' },
      { id: 'b', text: 'Bloqueiam completamente a entrada de luz solar na atmosfera' },
      { id: 'c', text: 'Não têm qualquer capacidade de absorver ou reter energia' },
      { id: 'd', text: 'Resfriam diretamente a superfície terrestre' }
    ],
    correctOptionId: 'a',
    explanation: 'Gases de efeito estufa, como CO2 e metano, são relativamente transparentes à luz visível do Sol, mas absorvem parte da radiação infravermelha (calor) que a superfície terrestre reemite, redirecionando parte dessa energia de volta à superfície. Esse fenômeno é natural e necessário para manter a Terra habitável, mas o aumento das concentrações desses gases pela atividade humana intensifica a retenção de calor, causando o aquecimento global.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_ecologia_34',
    chapter: 'Biomas Brasileiros',
    topicId: 'bio_ecologia',
    subject: 'Biologia',
    prompt: 'O Cerrado, segundo maior bioma brasileiro em extensão, é caracterizado por uma vegetação típica de:',
    options: [
      { id: 'a', text: 'Árvores de grande porte com troncos retos e copas densamente fechadas, formando um dossel contínuo' },
      { id: 'b', text: 'Árvores e arbustos de porte baixo a médio, com troncos tortuosos, casca grossa e raízes profundas, adaptados a solos ácidos e pobres e a um regime de estação seca prolongada' },
      { id: 'c', text: 'Vegetação exclusivamente aquática submersa' },
      { id: 'd', text: 'Ausência total de vegetação, sendo um bioma desértico' }
    ],
    correctOptionId: 'b',
    explanation: 'O Cerrado é uma savana tropical caracterizada por árvores e arbustos de porte baixo a médio, com troncos tortuosos e casca grossa (adaptação ao fogo, comum na estação seca) e raízes profundas que alcançam lençóis freáticos, permitindo sobreviver a solos ácidos, pobres em nutrientes e a uma estação seca prolongada — bem diferente da vegetação densa e fechada de florestas como a Amazônia.',
    difficulty: 'medium'
  },
  // Biologia — Evolução
  {
    id: 'q_bio_evolucao_1',
    chapter: 'Evolução Biológica: Construção Histórica',
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
    chapter: 'Mecanismos da Evolução Biológica',
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
    chapter: 'Evolução Biológica: Construção Histórica',
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
    chapter: 'Mecanismos da Evolução Biológica',
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
    chapter: 'Mecanismos da Evolução Biológica',
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
    chapter: 'Procariotos',
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
    chapter: 'Vírus',
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
    chapter: 'Procariotos',
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
  {
    id: 'q_bio_microbiologia_6',
    chapter: 'Vírus',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'O ciclo lisogênico de um vírus bacteriófago se diferencia do ciclo lítico principalmente porque:',
    options: [
      { id: 'a', text: 'No ciclo lisogênico, o DNA viral se integra ao cromossomo bacteriano e é replicado passivamente junto com ele por várias gerações, sem lise imediata da célula' },
      { id: 'b', text: 'No ciclo lisogênico, a célula hospedeira é sempre destruída imediatamente após a infecção' },
      { id: 'c', text: 'O ciclo lisogênico não envolve nenhum tipo de material genético viral' },
      { id: 'd', text: 'Apenas o ciclo lítico ocorre em vírus de DNA, nunca em vírus de RNA' }
    ],
    correctOptionId: 'a',
    explanation: 'No ciclo lisogênico, o DNA do bacteriófago se integra ao cromossomo da bactéria hospedeira (tornando-se um prófago) e é duplicado passivamente a cada divisão celular, sem produzir novas partículas virais nem lisar a célula — ao contrário do ciclo lítico, em que o vírus replica-se ativamente e rompe (lisa) a célula hospedeira para liberar novas partículas virais.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_microbiologia_7',
    chapter: 'Vírus',
    topicId: 'bio_microbiologia',
    subject: 'Biologia',
    prompt: 'Vírus de RNA, como o HIV, utilizam uma enzima chamada transcriptase reversa. A função dessa enzima é:',
    options: [
      { id: 'a', text: 'Transcrever RNA viral em DNA, que pode então se integrar ao genoma da célula hospedeira' },
      { id: 'b', text: 'Traduzir diretamente o RNA viral em proteínas, sem qualquer intermediário' },
      { id: 'c', text: 'Degradar o DNA da célula hospedeira' },
      { id: 'd', text: 'Sintetizar a cápsula proteica do vírus diretamente a partir do DNA' }
    ],
    correctOptionId: 'a',
    explanation: 'A transcriptase reversa, presente em retrovírus como o HIV, catalisa a transcrição reversa: converte o RNA genômico viral em DNA complementar (cDNA). Esse DNA pode então se integrar ao genoma da célula hospedeira, onde passa a ser transcrito e traduzido junto com os genes da própria célula, um processo inverso ao "dogma central" tradicional (DNA → RNA).',
    difficulty: 'hard'
  },
  // Matemática — Funções
  {
    id: 'q_mat_funcoes_1',
    chapter: 'Composição de Funções',
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
    chapter: 'Inversão de Funções',
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
    chapter: 'Introdução às Funções',
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
    chapter: 'Função Quadrática',
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
    chapter: 'Estudo do Sinal de Funções',
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
  {
    id: 'q_mat_funcoes_6',
    chapter: 'Introdução às Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Uma relação f associa a cada elemento x de um conjunto A exatamente um elemento y de um conjunto B. Para que essa relação seja considerada uma função, é necessário que:',
    options: [
      { id: 'a', text: 'Todo elemento de A tenha correspondência com pelo menos um elemento de B, podendo haver elementos de A sem correspondente' },
      { id: 'b', text: 'Todo elemento de A tenha correspondência com exatamente um único elemento de B' },
      { id: 'c', text: 'Todo elemento de B tenha correspondência com todos os elementos de A' },
      { id: 'd', text: 'Os conjuntos A e B tenham necessariamente o mesmo número de elementos' }
    ],
    correctOptionId: 'b',
    explanation: 'Por definição, uma função f: A → B associa a cada elemento do domínio A um, e apenas um, elemento do contradomínio B. Se algum elemento de A não tiver imagem, ou tiver mais de uma imagem, a relação não é uma função.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_funcoes_7',
    chapter: 'Introdução às Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'O teste da reta vertical é usado para verificar se um gráfico representa uma função. Ele consiste em:',
    options: [
      { id: 'a', text: 'Verificar se toda reta vertical traçada no plano intercepta o gráfico em no máximo um ponto' },
      { id: 'b', text: 'Verificar se toda reta horizontal intercepta o gráfico em exatamente um ponto' },
      { id: 'c', text: 'Contar quantas vezes o gráfico cruza o eixo x' },
      { id: 'd', text: 'Verificar se o gráfico é simétrico em relação à origem' }
    ],
    correctOptionId: 'a',
    explanation: 'Se alguma reta vertical (x = k, para algum k) interceptasse o gráfico em mais de um ponto, isso significaria que o valor x = k tem mais de uma imagem associada — o que violaria a definição de função. Por isso, o gráfico representa uma função se, e somente se, toda reta vertical o intercepta em no máximo um ponto.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_8',
    chapter: 'Transformações em Gráficos de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Se o gráfico de g(x) é obtido a partir do gráfico de f(x) pela transformação g(x) = f(x) + 3, o que ocorre com o gráfico?',
    options: [
      { id: 'a', text: 'Desloca-se 3 unidades para a esquerda' },
      { id: 'b', text: 'Desloca-se 3 unidades para a direita' },
      { id: 'c', text: 'Desloca-se 3 unidades para cima' },
      { id: 'd', text: 'Desloca-se 3 unidades para baixo' }
    ],
    correctOptionId: 'c',
    explanation: 'Somar uma constante positiva à função, g(x) = f(x) + k (k > 0), desloca todo o gráfico verticalmente para cima em k unidades, já que cada valor de y aumenta em k mantendo o mesmo x.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_funcoes_9',
    chapter: 'Transformações em Gráficos de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Se g(x) = f(-x), o gráfico de g é obtido a partir do gráfico de f por meio de:',
    options: [
      { id: 'a', text: 'Uma reflexão em torno do eixo y' },
      { id: 'b', text: 'Uma reflexão em torno do eixo x' },
      { id: 'c', text: 'Uma translação horizontal' },
      { id: 'd', text: 'Uma rotação de 180° em torno da origem' }
    ],
    correctOptionId: 'a',
    explanation: 'Trocar x por -x no argumento da função reflete o gráfico horizontalmente em torno do eixo y: cada ponto (x, y) do gráfico original passa a corresponder ao ponto (-x, y) no gráfico de g.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_10',
    chapter: 'Composição de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Sejam f(x) = 2x + 1 e g(x) = x². Qual é o valor de (f∘g)(3), ou seja, f(g(3))?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '10' },
      { id: 'c', text: '19' },
      { id: 'd', text: '49' }
    ],
    correctOptionId: 'c',
    explanation: 'Primeiro calcula-se g(3) = 3² = 9. Em seguida, f(9) = 2×9 + 1 = 19.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_11',
    chapter: 'Inversão de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Para que uma função f admita uma função inversa f⁻¹, é necessário que f seja:',
    options: [
      { id: 'a', text: 'Apenas sobrejetora' },
      { id: 'b', text: 'Bijetora (injetora e sobrejetora ao mesmo tempo)' },
      { id: 'c', text: 'Apenas contínua' },
      { id: 'd', text: 'Necessariamente crescente em todo o seu domínio' }
    ],
    correctOptionId: 'b',
    explanation: 'A função inversa só existe (como função) quando f é bijetora: injetora garante que cada imagem venha de um único elemento do domínio (necessário para que f⁻¹ seja bem definida, sem ambiguidade), e sobrejetora garante que todo elemento do contradomínio tenha um correspondente no domínio (necessário para que f⁻¹ esteja definida em todo o seu próprio domínio).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_12',
    chapter: 'Inversão de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Se f(x) = 3x - 6, qual é a expressão da função inversa f⁻¹(x)?',
    options: [
      { id: 'a', text: 'f⁻¹(x) = x/3 - 6' },
      { id: 'b', text: 'f⁻¹(x) = (x + 6)/3' },
      { id: 'c', text: 'f⁻¹(x) = 3x + 6' },
      { id: 'd', text: 'f⁻¹(x) = (x - 6)/3' }
    ],
    correctOptionId: 'b',
    explanation: 'Para achar a inversa, escreve-se y = 3x - 6 e troca-se x por y (e vice-versa): x = 3y - 6. Isolando y: x + 6 = 3y → y = (x + 6)/3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_13',
    chapter: 'Funções Bijetoras',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Uma função f: A → B é dita sobrejetora quando:',
    options: [
      { id: 'a', text: 'Todo elemento de B é imagem de pelo menos um elemento de A, ou seja, o conjunto imagem de f coincide com o contradomínio B' },
      { id: 'b', text: 'Elementos distintos do domínio sempre têm imagens distintas' },
      { id: 'c', text: 'Nenhum elemento de B possui correspondente em A' },
      { id: 'd', text: 'A função não possui domínio definido' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma função é sobrejetora (ou "sobre") quando todo elemento do contradomínio B é atingido por pelo menos um elemento do domínio A, isto é, o conjunto imagem coincide exatamente com o contradomínio — não sobra nenhum elemento de B sem correspondente.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_14',
    chapter: 'Funções Bijetoras',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Uma função f: A → B é dita injetora (ou injetiva) quando:',
    options: [
      { id: 'a', text: 'Elementos distintos do domínio sempre têm imagens distintas no contradomínio (nunca dois elementos de A "caem" no mesmo ponto de B)' },
      { id: 'b', text: 'Todo elemento do contradomínio é imagem de algum elemento do domínio' },
      { id: 'c', text: 'A função não possui contradomínio definido' },
      { id: 'd', text: 'O domínio e o contradomínio são conjuntos idênticos' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma função é injetora quando elementos diferentes do domínio nunca compartilham a mesma imagem: se x1 ≠ x2, então f(x1) ≠ f(x2). Uma função pode ser injetora sem ser sobrejetora (e vice-versa); quando é ambas ao mesmo tempo, é chamada de bijetora.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_15',
    chapter: 'Função Constante e Função Afim',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'A função afim f(x) = ax + b, com a ≠ 0, tem como gráfico uma reta. O coeficiente "a" (coeficiente angular) representa:',
    options: [
      { id: 'a', text: 'O valor de f(0), ou seja, onde a reta cruza o eixo y' },
      { id: 'b', text: 'A taxa de variação da função — quanto y varia para cada unidade de variação em x — determinando a inclinação da reta' },
      { id: 'c', text: 'A raiz da função, sempre' },
      { id: 'd', text: 'Um valor que nunca pode ser negativo' }
    ],
    correctOptionId: 'b',
    explanation: 'O coeficiente angular "a" indica a inclinação da reta: quanto o valor de f(x) varia para cada aumento de uma unidade em x. Se a > 0, a função é crescente; se a < 0, é decrescente. O coeficiente "b" (coeficiente linear) é que determina onde a reta cruza o eixo y, ou seja, f(0) = b.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_funcoes_16',
    chapter: 'Função Constante e Função Afim',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Uma função constante f(x) = k (onde k é um número real fixo) tem como característica gráfica:',
    options: [
      { id: 'a', text: 'Uma reta horizontal, paralela ao eixo x, passando pelo ponto (0, k)' },
      { id: 'b', text: 'Uma reta vertical, paralela ao eixo y' },
      { id: 'c', text: 'Uma parábola com vértice na origem' },
      { id: 'd', text: 'Uma reta que passa necessariamente pela origem' }
    ],
    correctOptionId: 'a',
    explanation: 'Na função constante f(x) = k, o valor de y é sempre k, independentemente do valor de x escolhido. Isso resulta em uma reta horizontal (paralela ao eixo x), passando pelo ponto (0, k) — diferente da função afim geral, que tem inclinação não nula.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_funcoes_17',
    chapter: 'Função Constante e Função Afim',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Uma reta passa pelos pontos (1, 5) e (3, 11). Qual é o coeficiente angular dessa reta?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '6' }
    ],
    correctOptionId: 'b',
    explanation: 'O coeficiente angular é dado por a = (y2 - y1)/(x2 - x1) = (11 - 5)/(3 - 1) = 6/2 = 3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_18',
    chapter: 'Função Quadrática',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Na função quadrática f(x) = ax² + bx + c (com a ≠ 0), o sinal do coeficiente "a" determina:',
    options: [
      { id: 'a', text: 'A concavidade da parábola: para cima se a > 0 (ponto de mínimo) ou para baixo se a < 0 (ponto de máximo)' },
      { id: 'b', text: 'Apenas a posição do eixo de simetria da parábola' },
      { id: 'c', text: 'O número de raízes reais da função, sempre' },
      { id: 'd', text: 'Se a função é crescente ou decrescente em todo o seu domínio, sem exceções' }
    ],
    correctOptionId: 'a',
    explanation: 'Se a > 0, a parábola tem concavidade voltada para cima e possui um ponto de mínimo (seu vértice); se a < 0, a concavidade é voltada para baixo e o vértice é um ponto de máximo. O sinal de "a" não determina diretamente o número de raízes (isso depende do discriminante Δ = b² - 4ac).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_19',
    chapter: 'Função Quadrática',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Qual é a coordenada x do vértice da parábola f(x) = x² - 6x + 8?',
    options: [
      { id: 'a', text: '2' },
      { id: 'b', text: '3' },
      { id: 'c', text: '4' },
      { id: 'd', text: '6' }
    ],
    correctOptionId: 'b',
    explanation: 'A coordenada x do vértice é dada por xv = -b/(2a) = -(-6)/(2×1) = 6/2 = 3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_funcoes_20',
    chapter: 'Estudo do Sinal de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'Estudar o sinal de uma função f(x) significa determinar:',
    options: [
      { id: 'a', text: 'Os intervalos do domínio em que f(x) é positiva, negativa ou nula' },
      { id: 'b', text: 'Apenas o valor máximo que a função pode assumir' },
      { id: 'c', text: 'Se a função é par ou ímpar' },
      { id: 'd', text: 'O domínio da função, exclusivamente' }
    ],
    correctOptionId: 'a',
    explanation: 'O estudo do sinal de uma função consiste em identificar, para cada intervalo do domínio, se f(x) > 0 (função positiva), f(x) < 0 (função negativa) ou f(x) = 0 (raízes da função) — informação essencial, por exemplo, para resolver inequações e analisar o comportamento gráfico da função.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_funcoes_21',
    chapter: 'Estudo do Sinal de Funções',
    topicId: 'mat_funcoes',
    subject: 'Matemática',
    prompt: 'No estudo do sinal da função afim f(x) = 2x - 6, para quais valores de x temos f(x) > 0?',
    options: [
      { id: 'a', text: 'x > 3' },
      { id: 'b', text: 'x < 3' },
      { id: 'c', text: 'x > 6' },
      { id: 'd', text: 'x < -3' }
    ],
    correctOptionId: 'a',
    explanation: 'A raiz de f(x) = 2x - 6 é x = 3. Como a função é crescente (coeficiente angular positivo), f(x) > 0 para valores de x maiores que a raiz, ou seja, x > 3.',
    difficulty: 'medium'
  },
  // Matemática — Análise Combinatória
  {
    id: 'q_mat_combinatoria_1',
    chapter: 'O Problema da Fila',
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
    chapter: 'O Problema do Grupo',
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
    chapter: 'O Problema do Grupo',
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
    chapter: 'O Problema da Fila',
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
    chapter: 'Técnicas de Contagem',
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
  {
    id: 'q_mat_combinatoria_6',
    chapter: 'Introdução às Técnicas de Contagem',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'O Princípio Fundamental da Contagem (Princípio Multiplicativo) afirma que, se uma decisão pode ser tomada em etapas sucessivas e independentes, com m1 possibilidades na primeira etapa, m2 na segunda, e assim por diante, o número total de possibilidades é:',
    options: [
      { id: 'a', text: 'A soma m1 + m2 + ... + mn' },
      { id: 'b', text: 'O produto m1 × m2 × ... × mn' },
      { id: 'c', text: 'Sempre igual ao maior valor entre m1, m2, ..., mn' },
      { id: 'd', text: 'A média aritmética entre m1, m2, ..., mn' }
    ],
    correctOptionId: 'b',
    explanation: 'O Princípio Fundamental da Contagem estabelece que, para etapas sucessivas e independentes, o número total de possibilidades é o produto do número de opções de cada etapa — e não a soma, que seria usada apenas se as etapas fossem alternativas mutuamente exclusivas (ou isso ou aquilo), não sucessivas.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_combinatoria_7',
    chapter: 'Introdução às Técnicas de Contagem',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'Um restaurante oferece 4 opções de entrada, 5 de prato principal e 3 de sobremesa. De quantas formas diferentes um cliente pode montar uma refeição completa, escolhendo uma opção de cada categoria?',
    options: [
      { id: 'a', text: '12' },
      { id: 'b', text: '15' },
      { id: 'c', text: '60' },
      { id: 'd', text: '20' }
    ],
    correctOptionId: 'c',
    explanation: 'Pelo Princípio Fundamental da Contagem, multiplica-se o número de opções de cada etapa independente: 4 × 5 × 3 = 60 combinações possíveis de refeição completa.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_combinatoria_8',
    chapter: 'O Problema da Fila',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'De quantas maneiras diferentes 5 pessoas distintas podem se organizar em uma fila?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '25' },
      { id: 'c', text: '60' },
      { id: 'd', text: '120' }
    ],
    correctOptionId: 'd',
    explanation: 'Trata-se de uma permutação simples de 5 elementos distintos: P(5) = 5! = 5×4×3×2×1 = 120.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_combinatoria_9',
    chapter: 'Técnicas de Contagem',
    topicId: 'mat_combinatoria',
    subject: 'Matemática',
    prompt: 'A diferença essencial entre um arranjo e uma combinação, ambos com r elementos escolhidos de um conjunto de n elementos, é que:',
    options: [
      { id: 'a', text: 'No arranjo, a ordem dos elementos escolhidos importa (formando agrupamentos distintos); na combinação, a ordem não importa' },
      { id: 'b', text: 'No arranjo, elementos podem se repetir; na combinação, nunca' },
      { id: 'c', text: 'Combinação e arranjo são sempre exatamente o mesmo valor, para quaisquer n e r' },
      { id: 'd', text: 'A combinação sempre resulta em um número maior que o arranjo, para os mesmos n e r' }
    ],
    correctOptionId: 'a',
    explanation: 'No arranjo A(n,r), a ordem dos r elementos escolhidos importa — {1,2,3} e {3,2,1} são agrupamentos diferentes. Na combinação C(n,r), a ordem não importa — esses dois seriam o mesmo agrupamento. Por isso, para os mesmos n e r (com r > 1), A(n,r) é sempre maior que C(n,r), já que A(n,r) = C(n,r) × r!.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Plana
  {
    id: 'q_mat_geometria_plana_1',
    chapter: 'Semelhança de Triângulos',
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
    chapter: 'Áreas de Polígonos',
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
    chapter: 'Triângulo Retângulo',
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
    chapter: 'Ângulos em Polígonos',
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
    chapter: 'Triângulo Retângulo',
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
    id: 'q_mat_geometria_plana_41',
    chapter: 'Introdução à Geometria Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Na geometria plana, dois postulados fundamentais estabelecem que:',
    options: [
      { id: 'a', text: 'Por dois pontos distintos passa uma única reta, e por três pontos não colineares passa um único plano' },
      { id: 'b', text: 'Por dois pontos distintos passam infinitas retas' },
      { id: 'c', text: 'Três pontos quaisquer são sempre colineares' },
      { id: 'd', text: 'Não existe uma reta única definida por dois pontos' }
    ],
    correctOptionId: 'a',
    explanation: 'Dois dos postulados básicos da geometria euclidiana afirmam que dois pontos distintos determinam uma única reta que passa por ambos, e que três pontos não colineares determinam um único plano — a base para toda a construção lógica da geometria plana e espacial.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_42',
    chapter: 'Introdução à Geometria Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Duas retas no mesmo plano que nunca se encontram, mantendo sempre a mesma distância entre si, são chamadas de:',
    options: [
      { id: 'a', text: 'Retas concorrentes' },
      { id: 'b', text: 'Retas paralelas' },
      { id: 'c', text: 'Retas perpendiculares' },
      { id: 'd', text: 'Retas coincidentes' }
    ],
    correctOptionId: 'b',
    explanation: 'Retas paralelas estão no mesmo plano e nunca se interceptam, mantendo distância constante entre si em toda a sua extensão — diferente das retas concorrentes, que se cruzam em um único ponto.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_43',
    chapter: 'Introdução à Geometria Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Quando duas retas paralelas são cortadas por uma reta transversal, os ângulos correspondentes formados são:',
    options: [
      { id: 'a', text: 'Sempre suplementares (somam 180°)' },
      { id: 'b', text: 'Sempre congruentes (têm a mesma medida)' },
      { id: 'c', text: 'Sempre complementares (somam 90°)' },
      { id: 'd', text: 'Impossíveis de determinar sem medição direta' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando uma transversal corta duas retas paralelas, os ângulos correspondentes (que ocupam a mesma posição relativa em cada interseção) são sempre congruentes — uma propriedade fundamental usada para demonstrar diversos teoremas de geometria plana.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_44',
    chapter: 'Ângulos em Triângulos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um triângulo tem ângulos internos medindo 50° e 70°. Qual é a medida do terceiro ângulo?',
    options: [
      { id: 'a', text: '50°' },
      { id: 'b', text: '60°' },
      { id: 'c', text: '70°' },
      { id: 'd', text: '120°' }
    ],
    correctOptionId: 'b',
    explanation: 'A soma dos ângulos internos de qualquer triângulo é 180°. Logo, o terceiro ângulo mede 180° - 50° - 70° = 60°.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_5',
    chapter: 'Ângulos em Triângulos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O ângulo externo de um triângulo, formado pelo prolongamento de um dos lados, é igual a:',
    options: [
      { id: 'a', text: 'Sempre 90°, independentemente do triângulo' },
      { id: 'b', text: 'A soma dos dois ângulos internos não adjacentes a ele' },
      { id: 'c', text: 'A metade do ângulo interno adjacente' },
      { id: 'd', text: 'Sempre igual ao maior ângulo interno do triângulo' }
    ],
    correctOptionId: 'b',
    explanation: 'O teorema do ângulo externo estabelece que a medida de um ângulo externo de um triângulo é igual à soma das medidas dos dois ângulos internos não adjacentes a ele (os dois "distantes" daquele vértice) — consequência direta de que a soma dos ângulos internos é 180°.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_6',
    chapter: 'Ângulos em Polígonos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a soma dos ângulos internos de um pentágono regular?',
    options: [
      { id: 'a', text: '360°' },
      { id: 'b', text: '450°' },
      { id: 'c', text: '540°' },
      { id: 'd', text: '720°' }
    ],
    correctOptionId: 'c',
    explanation: 'A soma dos ângulos internos de um polígono de n lados é (n-2)×180°. Para o pentágono (n=5): (5-2)×180° = 3×180° = 540°.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_7',
    chapter: 'Ângulos em Polígonos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'A soma dos ângulos externos de qualquer polígono convexo (um em cada vértice) é sempre igual a:',
    options: [
      { id: 'a', text: '180°, independentemente do número de lados' },
      { id: 'b', text: '360°, independentemente do número de lados' },
      { id: 'c', text: '(n-2)×180°, dependendo do número de lados n' },
      { id: 'd', text: 'Sempre igual à soma dos ângulos internos' }
    ],
    correctOptionId: 'b',
    explanation: 'Diferentemente da soma dos ângulos internos (que depende do número de lados), a soma dos ângulos externos de qualquer polígono convexo é sempre igual a 360° — o equivalente a dar uma volta completa ao percorrer o contorno do polígono.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_8',
    chapter: 'Ângulos e Circunferências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um ângulo central em uma circunferência mede 80°. Qual é a medida do arco correspondente?',
    options: [
      { id: 'a', text: '40°' },
      { id: 'b', text: '80°' },
      { id: 'c', text: '160°' },
      { id: 'd', text: '360°' }
    ],
    correctOptionId: 'b',
    explanation: 'O ângulo central tem vértice no centro da circunferência, e sua medida é sempre igual à medida do arco que ele subtende.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_9',
    chapter: 'Ângulos e Circunferências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um ângulo inscrito em uma circunferência subtende um arco de 100°. Qual é a medida desse ângulo inscrito?',
    options: [
      { id: 'a', text: '25°' },
      { id: 'b', text: '50°' },
      { id: 'c', text: '100°' },
      { id: 'd', text: '200°' }
    ],
    correctOptionId: 'b',
    explanation: 'A medida de um ângulo inscrito em uma circunferência é sempre igual à metade da medida do arco correspondente que ele subtende: 100°/2 = 50°.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_10',
    chapter: 'Ângulos e Circunferências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Uma reta tangente a uma circunferência forma com o raio no ponto de tangência um ângulo de:',
    options: [
      { id: 'a', text: '45°, sempre' },
      { id: 'b', text: '90°, sempre' },
      { id: 'c', text: '180°, sempre' },
      { id: 'd', text: 'Um valor que varia conforme o raio da circunferência' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma propriedade fundamental da tangência é que a reta tangente a uma circunferência é sempre perpendicular ao raio traçado até o ponto de tangência, formando um ângulo de 90° — independentemente do tamanho do raio.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_11',
    chapter: 'Simetrias e Congruências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Duas figuras geométricas são consideradas congruentes quando:',
    options: [
      { id: 'a', text: 'Têm exatamente a mesma forma e o mesmo tamanho, podendo ser sobrepostas perfeitamente' },
      { id: 'b', text: 'Têm a mesma forma, mas tamanhos diferentes' },
      { id: 'c', text: 'Têm o mesmo perímetro, mas formas diferentes' },
      { id: 'd', text: 'Ocupam a mesma posição no plano cartesiano' }
    ],
    correctOptionId: 'a',
    explanation: 'Figuras congruentes têm exatamente a mesma forma e o mesmo tamanho — todos os lados e ângulos correspondentes são iguais — de modo que uma pode ser sobreposta exatamente sobre a outra, possivelmente após uma translação, rotação ou reflexão.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_12',
    chapter: 'Simetrias e Congruências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O critério de congruência de triângulos LAL (Lado-Ângulo-Lado) garante que dois triângulos são congruentes quando:',
    options: [
      { id: 'a', text: 'Têm dois lados e o ângulo entre eles (ângulo compreendido) respectivamente congruentes' },
      { id: 'b', text: 'Têm apenas um lado em comum, sem qualquer informação sobre ângulos' },
      { id: 'c', text: 'Têm três ângulos congruentes, mas lados de tamanhos diferentes' },
      { id: 'd', text: 'Têm o mesmo perímetro, independentemente dos lados individuais' }
    ],
    correctOptionId: 'a',
    explanation: 'O critério LAL estabelece que, se dois lados de um triângulo e o ângulo formado entre eles são respectivamente congruentes aos de outro triângulo, então os dois triângulos são congruentes — um dos critérios clássicos de congruência (junto com ALA e LLL).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_13',
    chapter: 'Simetrias e Congruências',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Uma figura apresenta simetria axial (ou de reflexão) em relação a uma reta r quando:',
    options: [
      { id: 'a', text: 'Ao ser refletida em relação à reta r, a figura coincide exatamente consigo mesma' },
      { id: 'b', text: 'A figura pode ser girada em qualquer ângulo e permanece idêntica' },
      { id: 'c', text: 'A figura não possui nenhum eixo de simetria' },
      { id: 'd', text: 'A reta r deve necessariamente passar fora da figura' }
    ],
    correctOptionId: 'a',
    explanation: 'A simetria axial ocorre quando existe uma reta (eixo de simetria) tal que, ao refletir a figura em relação a ela, a imagem obtida coincide exatamente com a figura original — como ocorre, por exemplo, com qualquer diâmetro de uma circunferência.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_14',
    chapter: 'Identificação de Simetrias I',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um quadrado possui quantos eixos de simetria?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '4' },
      { id: 'd', text: 'Infinitos' }
    ],
    correctOptionId: 'c',
    explanation: 'O quadrado possui 4 eixos de simetria: as duas diagonais e as duas retas que passam pelos pontos médios de lados opostos.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_15',
    chapter: 'Identificação de Simetrias I',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Uma circunferência possui quantos eixos de simetria?',
    options: [
      { id: 'a', text: 'Nenhum' },
      { id: 'b', text: 'Exatamente 2' },
      { id: 'c', text: 'Exatamente 4' },
      { id: 'd', text: 'Infinitos (qualquer reta que passe pelo centro)' }
    ],
    correctOptionId: 'd',
    explanation: 'Toda reta que passa pelo centro de uma circunferência (isto é, todo diâmetro) é um eixo de simetria, já que reflete a circunferência exatamente sobre si mesma — por isso a circunferência tem infinitos eixos de simetria.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_16',
    chapter: 'Identificação de Simetrias I',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um triângulo escaleno (com os três lados de medidas diferentes) possui quantos eixos de simetria?',
    options: [
      { id: 'a', text: 'Nenhum' },
      { id: 'b', text: '1' },
      { id: 'c', text: '3' },
      { id: 'd', text: 'Infinitos' }
    ],
    correctOptionId: 'a',
    explanation: 'Como o triângulo escaleno não tem nenhum lado ou ângulo repetido, não existe nenhuma reta em relação à qual a figura seja simétrica — diferente do triângulo isósceles (1 eixo) e do equilátero (3 eixos).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_17',
    chapter: 'Identificação de Simetrias II',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Uma figura apresenta simetria de rotação (ou simetria rotacional) quando:',
    options: [
      { id: 'a', text: 'Existe um ângulo de rotação, menor que 360°, em torno de um ponto, que faz a figura coincidir consigo mesma' },
      { id: 'b', text: 'A figura só coincide consigo mesma após uma rotação de exatamente 360°' },
      { id: 'c', text: 'A figura precisa necessariamente ser refletida para coincidir consigo mesma' },
      { id: 'd', text: 'É exclusiva de figuras tridimensionais' }
    ],
    correctOptionId: 'a',
    explanation: 'A simetria rotacional existe quando há algum ângulo de rotação menor que 360° (em torno de um ponto central) que leva a figura a coincidir exatamente consigo mesma — por exemplo, um hexágono regular tem simetria rotacional de 60°.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_18',
    chapter: 'Identificação de Simetrias II',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um retângulo (não quadrado) apresenta simetria de rotação de qual ordem (menor ângulo, diferente de 360°, que leva a figura a coincidir consigo mesma)?',
    options: [
      { id: 'a', text: '90°' },
      { id: 'b', text: '180°' },
      { id: 'c', text: '270°' },
      { id: 'd', text: 'Não apresenta nenhuma simetria de rotação' }
    ],
    correctOptionId: 'b',
    explanation: 'Um retângulo (com lados de comprimentos diferentes) coincide consigo mesmo ao ser rotacionado 180° em torno de seu centro, mas não a 90° (isso só ocorreria se fosse um quadrado, onde os lados são iguais).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_19',
    chapter: 'Identificação de Simetrias II',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um hexágono regular apresenta simetria de rotação de qual menor ângulo (diferente de 360°)?',
    options: [
      { id: 'a', text: '30°' },
      { id: 'b', text: '60°' },
      { id: 'c', text: '90°' },
      { id: 'd', text: '120°' }
    ],
    correctOptionId: 'b',
    explanation: 'Um polígono regular de n lados apresenta simetria de rotação em múltiplos de 360°/n. Para o hexágono (n=6): 360°/6 = 60° é o menor ângulo de rotação que faz a figura coincidir consigo mesma.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_20',
    chapter: 'A Geometria da Proporcionalidade',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Duas figuras são ditas semelhantes quando:',
    options: [
      { id: 'a', text: 'Têm a mesma forma, com ângulos correspondentes congruentes e lados correspondentes proporcionais, podendo ter tamanhos diferentes' },
      { id: 'b', text: 'Têm exatamente o mesmo tamanho e a mesma forma' },
      { id: 'c', text: 'Têm o mesmo perímetro, independentemente da forma' },
      { id: 'd', text: 'São necessariamente congruentes' }
    ],
    correctOptionId: 'a',
    explanation: 'Figuras semelhantes preservam a forma (ângulos correspondentes iguais) mas podem ter tamanhos diferentes, com os lados correspondentes proporcionais entre si (razão de semelhança constante) — a congruência é um caso particular de semelhança, em que a razão de semelhança é 1.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_21',
    chapter: 'A Geometria da Proporcionalidade',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Se dois polígonos são semelhantes com razão de semelhança k, a razão entre suas áreas é:',
    options: [
      { id: 'a', text: 'k' },
      { id: 'b', text: 'k²' },
      { id: 'c', text: '2k' },
      { id: 'd', text: 'k³' }
    ],
    correctOptionId: 'b',
    explanation: 'Quando duas figuras planas são semelhantes com razão de semelhança k (entre os lados correspondentes), a razão entre suas áreas é k², já que a área é uma grandeza que envolve o produto de duas dimensões lineares.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_22',
    chapter: 'A Geometria da Proporcionalidade',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O Teorema de Tales estabelece que, quando um feixe de retas paralelas é cortado por duas retas transversais, os segmentos determinados sobre uma transversal são:',
    options: [
      { id: 'a', text: 'Sempre congruentes entre si, independentemente da configuração' },
      { id: 'b', text: 'Proporcionais aos segmentos correspondentes determinados na outra transversal' },
      { id: 'c', text: 'Sempre perpendiculares às retas paralelas' },
      { id: 'd', text: 'Impossíveis de comparar entre as duas transversais' }
    ],
    correctOptionId: 'b',
    explanation: 'O Teorema de Tales afirma que, quando retas paralelas cortam duas transversais, os segmentos determinados em uma transversal são proporcionais aos segmentos correspondentes determinados na outra — uma ferramenta fundamental para resolver problemas de proporcionalidade em geometria.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_23',
    chapter: 'Semelhança de Triângulos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O critério AA (Ângulo-Ângulo) de semelhança de triângulos garante que dois triângulos são semelhantes quando:',
    options: [
      { id: 'a', text: 'Têm dois ângulos respectivamente congruentes (o terceiro ângulo será automaticamente igual, já que a soma dos ângulos internos é 180°)' },
      { id: 'b', text: 'Têm todos os lados proporcionais, mas ângulos diferentes' },
      { id: 'c', text: 'Têm o mesmo perímetro' },
      { id: 'd', text: 'Têm apenas um ângulo em comum, sem qualquer outra informação' }
    ],
    correctOptionId: 'a',
    explanation: 'Pelo critério AA, basta que dois ângulos de um triângulo sejam respectivamente congruentes aos de outro triângulo para garantir a semelhança — como a soma dos ângulos internos é sempre 180°, o terceiro ângulo automaticamente também será igual, um dos critérios mais usados por exigir menos informação que LLL ou LAL.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_24',
    chapter: 'O Ponto Médio e o Baricentro de um Triângulo',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'A mediana de um triângulo é o segmento que liga:',
    options: [
      { id: 'a', text: 'Um vértice ao ponto médio do lado oposto' },
      { id: 'b', text: 'Os pontos médios de dois lados quaisquer' },
      { id: 'c', text: 'Um vértice ao vértice oposto, diagonalmente' },
      { id: 'd', text: 'O centro da circunferência circunscrita a cada vértice' }
    ],
    correctOptionId: 'a',
    explanation: 'A mediana de um triângulo é o segmento de reta que conecta um vértice ao ponto médio do lado oposto a esse vértice. Todo triângulo possui exatamente três medianas, uma para cada vértice.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_25',
    chapter: 'O Ponto Médio e o Baricentro de um Triângulo',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O baricentro de um triângulo, ponto de encontro das três medianas, divide cada mediana em qual razão, a partir do vértice?',
    options: [
      { id: 'a', text: '1:1 (o ponto médio exato da mediana)' },
      { id: 'b', text: '2:1 (dois terços da mediana a partir do vértice, um terço a partir do lado oposto)' },
      { id: 'c', text: '3:1' },
      { id: 'd', text: '1:3' }
    ],
    correctOptionId: 'b',
    explanation: 'O baricentro divide cada mediana na razão 2:1, ficando a uma distância do vértice igual a 2/3 do comprimento total da mediana, e a 1/3 de distância do ponto médio do lado oposto — uma propriedade importante em física, já que o baricentro corresponde ao centro de massa de uma placa triangular homogênea.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_plana_26',
    chapter: 'O Ponto Médio e o Baricentro de um Triângulo',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'O Teorema da Base Média de um triângulo afirma que o segmento que liga os pontos médios de dois lados de um triângulo é:',
    options: [
      { id: 'a', text: 'Paralelo ao terceiro lado e igual à metade de sua medida' },
      { id: 'b', text: 'Perpendicular ao terceiro lado' },
      { id: 'c', text: 'Igual em medida ao terceiro lado' },
      { id: 'd', text: 'Sempre maior que o terceiro lado' }
    ],
    correctOptionId: 'a',
    explanation: 'O Teorema da Base Média estabelece que o segmento que une os pontos médios de dois lados de um triângulo é paralelo ao terceiro lado e possui exatamente metade de seu comprimento — uma consequência da semelhança entre o triângulo menor formado e o triângulo original (razão de semelhança 1:2).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_27',
    chapter: 'A Geometria Métrica Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Em um triângulo retângulo, o Teorema de Pitágoras relaciona as medidas dos lados através da fórmula:',
    options: [
      { id: 'a', text: 'a + b = c, onde c é a hipotenusa' },
      { id: 'b', text: 'a² = b² + c², onde a é um dos catetos' },
      { id: 'c', text: 'a² = b² + c², onde a é a hipotenusa e b, c são os catetos' },
      { id: 'd', text: 'a × b = c, onde c é a hipotenusa' }
    ],
    correctOptionId: 'c',
    explanation: 'O Teorema de Pitágoras estabelece que, em um triângulo retângulo, o quadrado da medida da hipotenusa (o lado oposto ao ângulo reto, sempre o maior lado) é igual à soma dos quadrados das medidas dos catetos: a² = b² + c².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_28',
    chapter: 'A Geometria Métrica Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Em um triângulo retângulo, a altura relativa à hipotenusa forma dois triângulos menores. Esses dois triângulos menores e o triângulo original são, entre si:',
    options: [
      { id: 'a', text: 'Congruentes, sempre' },
      { id: 'b', text: 'Semelhantes entre si' },
      { id: 'c', text: 'Sem qualquer relação geométrica entre si' },
      { id: 'd', text: 'Sempre equiláteros' }
    ],
    correctOptionId: 'b',
    explanation: 'Ao traçar a altura relativa à hipotenusa em um triângulo retângulo, formam-se dois triângulos menores que são semelhantes entre si e também semelhantes ao triângulo original — a base das relações métricas do triângulo retângulo (como h² = m×n, entre outras).',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_plana_29',
    chapter: 'A Geometria Métrica Plana',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um triângulo retângulo tem catetos medindo 6 cm e 8 cm. Qual é a medida da hipotenusa?',
    options: [
      { id: 'a', text: '10 cm' },
      { id: 'b', text: '12 cm' },
      { id: 'c', text: '14 cm' },
      { id: 'd', text: '48 cm' }
    ],
    correctOptionId: 'a',
    explanation: 'Pelo Teorema de Pitágoras: hipotenusa² = 6² + 8² = 36 + 64 = 100, logo a hipotenusa = √100 = 10 cm.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_30',
    chapter: 'Áreas de Polígonos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a área de um trapézio com bases medindo 6 cm e 10 cm, e altura de 5 cm?',
    options: [
      { id: 'a', text: '30 cm²' },
      { id: 'b', text: '40 cm²' },
      { id: 'c', text: '50 cm²' },
      { id: 'd', text: '80 cm²' }
    ],
    correctOptionId: 'b',
    explanation: 'A área do trapézio é dada por A = (base maior + base menor)×altura/2 = (10+6)×5/2 = 80/2 = 40 cm².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_31',
    chapter: 'Áreas de Polígonos',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a área de um losango cujas diagonais medem 8 cm e 12 cm?',
    options: [
      { id: 'a', text: '24 cm²' },
      { id: 'b', text: '48 cm²' },
      { id: 'c', text: '96 cm²' },
      { id: 'd', text: '20 cm²' }
    ],
    correctOptionId: 'b',
    explanation: 'A área do losango é dada por A = (diagonal maior × diagonal menor)/2 = (12×8)/2 = 96/2 = 48 cm².',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_32',
    chapter: 'Área do Círculo e de suas Partes',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a área de um círculo de raio 5 cm? (use π ≈ 3,14)',
    options: [
      { id: 'a', text: '15,7 cm²' },
      { id: 'b', text: '31,4 cm²' },
      { id: 'c', text: '78,5 cm²' },
      { id: 'd', text: '157 cm²' }
    ],
    correctOptionId: 'c',
    explanation: 'A área do círculo é A = π×r² = 3,14×5² = 3,14×25 = 78,5 cm².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_33',
    chapter: 'Área do Círculo e de suas Partes',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um setor circular tem ângulo central de 90° em um círculo de raio 4 cm. Qual é a área desse setor? (use π ≈ 3,14)',
    options: [
      { id: 'a', text: '6,28 cm²' },
      { id: 'b', text: '12,56 cm²' },
      { id: 'c', text: '25,12 cm²' },
      { id: 'd', text: '50,24 cm²' }
    ],
    correctOptionId: 'b',
    explanation: 'A área do setor é proporcional ao ângulo central: A = (ângulo/360°)×π×r² = (90/360)×3,14×16 = 0,25×50,24 = 12,56 cm².',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_34',
    chapter: 'Área do Círculo e de suas Partes',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'A coroa circular é a região entre duas circunferências concêntricas. Sua área é calculada por:',
    options: [
      { id: 'a', text: 'A soma das áreas dos dois círculos' },
      { id: 'b', text: 'A diferença entre a área do círculo maior e a área do círculo menor' },
      { id: 'c', text: 'O produto entre os dois raios' },
      { id: 'd', text: 'A média aritmética entre as duas áreas' }
    ],
    correctOptionId: 'b',
    explanation: 'A coroa circular é a região compreendida entre duas circunferências concêntricas de raios diferentes; sua área é obtida subtraindo a área do círculo menor (o "buraco" interno) da área do círculo maior: A = π×(R² - r²).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_35',
    chapter: 'Razões entre Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Dois triângulos semelhantes têm razão de semelhança 3:2 entre seus lados correspondentes. Qual é a razão entre suas áreas?',
    options: [
      { id: 'a', text: '3:2' },
      { id: 'b', text: '6:4' },
      { id: 'c', text: '9:4' },
      { id: 'd', text: '27:8' }
    ],
    correctOptionId: 'c',
    explanation: 'A razão entre as áreas de figuras semelhantes é o quadrado da razão de semelhança entre os lados: (3/2)² = 9/4, ou seja, razão 9:4.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_36',
    chapter: 'Razões entre Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um quadrado tem seu lado dobrado. O que ocorre com sua área?',
    options: [
      { id: 'a', text: 'A área também dobra' },
      { id: 'b', text: 'A área quadruplica' },
      { id: 'c', text: 'A área permanece igual' },
      { id: 'd', text: 'A área triplica' }
    ],
    correctOptionId: 'b',
    explanation: 'Como a razão de semelhança entre os lados é 2, a razão entre as áreas é 2² = 4 — ou seja, ao dobrar o lado de um quadrado, sua área quadruplica.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_plana_37',
    chapter: 'Razões entre Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Ao ligar os pontos médios dos três lados de um triângulo, formando um triângulo menor no interior, qual é a razão entre a área do triângulo menor e a área do triângulo original?',
    options: [
      { id: 'a', text: '1:2' },
      { id: 'b', text: '1:3' },
      { id: 'c', text: '1:4' },
      { id: 'd', text: '1:8' }
    ],
    correctOptionId: 'c',
    explanation: 'Pelo Teorema da Base Média, o triângulo médio (formado pelos pontos médios dos lados) é semelhante ao triângulo original com razão de semelhança 1:2. Logo, a razão entre as áreas é (1/2)² = 1/4, ou seja, 1:4.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_plana_38',
    chapter: 'Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Qual é a área de um triângulo com base 12 cm e altura 7 cm?',
    options: [
      { id: 'a', text: '19 cm²' },
      { id: 'b', text: '42 cm²' },
      { id: 'c', text: '84 cm²' },
      { id: 'd', text: '168 cm²' }
    ],
    correctOptionId: 'b',
    explanation: 'A área do triângulo é A = (base×altura)/2 = (12×7)/2 = 84/2 = 42 cm².',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_plana_39',
    chapter: 'Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'A fórmula de Heron permite calcular a área de um triângulo conhecendo apenas:',
    options: [
      { id: 'a', text: 'A base e a altura' },
      { id: 'b', text: 'As medidas dos três lados, sem necessidade de conhecer a altura' },
      { id: 'c', text: 'Apenas os três ângulos internos' },
      { id: 'd', text: 'O raio da circunferência circunscrita, exclusivamente' }
    ],
    correctOptionId: 'b',
    explanation: 'A fórmula de Heron, A = √[p(p-a)(p-b)(p-c)] (onde p é o semiperímetro), permite calcular a área de qualquer triângulo conhecendo apenas as medidas dos três lados, sem a necessidade de conhecer diretamente a altura relativa a nenhum deles.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_plana_40',
    chapter: 'Áreas de Figuras Planas',
    topicId: 'mat_geometria_plana',
    subject: 'Matemática',
    prompt: 'Um terreno retangular tem 20 m de largura e 30 m de comprimento. Qual é sua área?',
    options: [
      { id: 'a', text: '50 m²' },
      { id: 'b', text: '100 m²' },
      { id: 'c', text: '300 m²' },
      { id: 'd', text: '600 m²' }
    ],
    correctOptionId: 'd',
    explanation: 'A área do retângulo é A = base × altura = 20 × 30 = 600 m².',
    difficulty: 'easy'
  },
  // Matemática — Probabilidade e Interpretação de Dados
  {
    id: 'q_mat_dados_probabilidade_1',
    chapter: 'Eventos Disjuntos e Eventos Independentes',
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
    chapter: 'Operações com Probabilidades',
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
    chapter: 'Operações com Probabilidades',
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
    chapter: 'Estatística Descritiva',
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
    chapter: 'Eventos Disjuntos e Eventos Independentes',
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
  {
    id: 'q_mat_dados_probabilidade_6',
    chapter: 'Introdução às Probabilidades',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'A probabilidade de ocorrência de um evento é definida, no espaço amostral equiprovável, como:',
    options: [
      { id: 'a', text: 'O número de casos favoráveis ao evento' },
      { id: 'b', text: 'A razão entre o número de casos favoráveis e o número total de casos possíveis' },
      { id: 'c', text: 'O número total de casos possíveis, exclusivamente' },
      { id: 'd', text: 'A diferença entre casos favoráveis e casos possíveis' }
    ],
    correctOptionId: 'b',
    explanation: 'Em um espaço amostral equiprovável (todos os resultados igualmente prováveis), a probabilidade de um evento A é P(A) = (número de casos favoráveis a A) / (número total de casos possíveis) — sempre um valor entre 0 e 1.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_dados_probabilidade_7',
    chapter: 'Introdução às Probabilidades',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Ao lançar um dado honesto de 6 faces, qual é a probabilidade de obter um número par?',
    options: [
      { id: 'a', text: '1/6' },
      { id: 'b', text: '1/3' },
      { id: 'c', text: '1/2' },
      { id: 'd', text: '2/3' }
    ],
    correctOptionId: 'c',
    explanation: 'Existem 3 números pares possíveis (2, 4, 6) entre os 6 resultados possíveis do dado. Probabilidade = 3/6 = 1/2.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_dados_probabilidade_8',
    chapter: 'Introdução às Probabilidades',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'Se a probabilidade de chover amanhã é de 30%, qual é a probabilidade de não chover?',
    options: [
      { id: 'a', text: '30%' },
      { id: 'b', text: '50%' },
      { id: 'c', text: '70%' },
      { id: 'd', text: '100%' }
    ],
    correctOptionId: 'c',
    explanation: 'A probabilidade do evento complementar (não chover) é sempre 100% menos a probabilidade do evento original: 100% - 30% = 70%. Isso vale porque um evento e seu complementar cobrem todos os casos possíveis, sem sobreposição.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_dados_probabilidade_9',
    chapter: 'Operações com Probabilidades',
    topicId: 'mat_dados_probabilidade',
    subject: 'Matemática',
    prompt: 'A probabilidade condicional P(A|B), lida como "probabilidade de A dado B", representa:',
    options: [
      { id: 'a', text: 'A probabilidade de A ocorrer, sabendo-se que o evento B já ocorreu' },
      { id: 'b', text: 'A probabilidade de A e B ocorrerem simultaneamente, sem qualquer relação de dependência' },
      { id: 'c', text: 'A probabilidade de nenhum dos dois eventos ocorrer' },
      { id: 'd', text: 'Sempre o mesmo valor que P(B|A)' }
    ],
    correctOptionId: 'a',
    explanation: 'A probabilidade condicional P(A|B) mede a probabilidade de A ocorrer, considerando que já se sabe que B ocorreu — é calculada por P(A|B) = P(A∩B)/P(B), e não é, em geral, igual a P(B|A) (a menos que P(A) = P(B)).',
    difficulty: 'medium'
  },
  // Matemática — Trigonometria
  {
    id: 'q_mat_trigonometria_1',
    chapter: 'Relações Trigonométricas em Polígonos',
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
    chapter: 'A Relação Fundamental da Trigonometria',
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
    chapter: 'Funções Trigonométricas',
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
    chapter: 'Trigonometria no Triângulo Retângulo',
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
    chapter: 'Relações Trigonométricas em Polígonos',
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
  {
    id: 'q_mat_trigonometria_6',
    chapter: 'Trigonometria no Triângulo Retângulo',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Em um triângulo retângulo, o cosseno de um ângulo agudo é definido como a razão entre:',
    options: [
      { id: 'a', text: 'O cateto oposto ao ângulo e a hipotenusa' },
      { id: 'b', text: 'O cateto adjacente ao ângulo e a hipotenusa' },
      { id: 'c', text: 'O cateto oposto e o cateto adjacente' },
      { id: 'd', text: 'A hipotenusa e o cateto adjacente' }
    ],
    correctOptionId: 'b',
    explanation: 'No triângulo retângulo, o cosseno de um ângulo agudo é a razão entre a medida do cateto adjacente a esse ângulo e a medida da hipotenusa (cos θ = cateto adjacente / hipotenusa) — diferente do seno, que usa o cateto oposto.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_trigonometria_7',
    chapter: 'A Trigonometria dos Números Reais',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'O ciclo trigonométrico (circunferência de raio 1 centrada na origem) permite estender as razões trigonométricas para além dos ângulos agudos de um triângulo retângulo. Nesse contexto, o seno de um ângulo θ corresponde a:',
    options: [
      { id: 'a', text: 'A abscissa (coordenada x) do ponto correspondente a θ no ciclo trigonométrico' },
      { id: 'b', text: 'A ordenada (coordenada y) do ponto correspondente a θ no ciclo trigonométrico' },
      { id: 'c', text: 'O raio da circunferência, sempre igual a 1' },
      { id: 'd', text: 'A distância entre dois pontos quaisquer da circunferência' }
    ],
    correctOptionId: 'b',
    explanation: 'No ciclo trigonométrico, para um ângulo θ medido a partir do eixo x positivo, o cosseno de θ corresponde à abscissa (x) e o seno de θ corresponde à ordenada (y) do ponto onde o lado terminal do ângulo intercepta a circunferência de raio 1 — essa representação permite definir seno e cosseno para qualquer ângulo real, não apenas os agudos de um triângulo.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_8',
    chapter: 'A Trigonometria dos Números Reais',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'No ciclo trigonométrico, um ângulo de 180° corresponde, em radianos, a:',
    options: [
      { id: 'a', text: 'π/2' },
      { id: 'b', text: 'π' },
      { id: 'c', text: '2π' },
      { id: 'd', text: 'π/4' }
    ],
    correctOptionId: 'b',
    explanation: 'A conversão entre graus e radianos usa a proporção 180° = π rad. Logo, um ângulo de 180° corresponde exatamente a π radianos.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_trigonometria_9',
    chapter: 'Outras Razões Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A tangente de um ângulo θ, no triângulo retângulo, é definida como a razão entre:',
    options: [
      { id: 'a', text: 'O cateto oposto e o cateto adjacente a θ, equivalendo também a sen θ / cos θ' },
      { id: 'b', text: 'A hipotenusa e o cateto oposto' },
      { id: 'c', text: 'O cateto adjacente e a hipotenusa' },
      { id: 'd', text: 'A soma dos dois catetos e a hipotenusa' }
    ],
    correctOptionId: 'a',
    explanation: 'A tangente de um ângulo é definida como a razão entre o cateto oposto e o cateto adjacente a esse ângulo, o que é equivalente a tan θ = sen θ / cos θ — uma identidade que decorre diretamente das definições de seno e cosseno.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_trigonometria_10',
    chapter: 'Outras Razões Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A cossecante de um ângulo θ é definida como:',
    options: [
      { id: 'a', text: 'O inverso multiplicativo do seno: csc θ = 1/sen θ' },
      { id: 'b', text: 'O inverso multiplicativo do cosseno' },
      { id: 'c', text: 'O mesmo que a tangente' },
      { id: 'd', text: 'A soma entre seno e cosseno' }
    ],
    correctOptionId: 'a',
    explanation: 'A cossecante é definida como o inverso multiplicativo do seno: csc θ = 1/sen θ (para sen θ ≠ 0). De forma análoga, a secante é o inverso do cosseno (sec θ = 1/cos θ) e a cotangente é o inverso da tangente (cot θ = 1/tan θ = cos θ/sen θ).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_11',
    chapter: 'Outras Razões Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Sabendo que tan θ = 3/4 e que θ é um ângulo agudo, qual é o valor de cot θ (cotangente de θ)?',
    options: [
      { id: 'a', text: '3/4' },
      { id: 'b', text: '4/3' },
      { id: 'c', text: '1' },
      { id: 'd', text: '7/12' }
    ],
    correctOptionId: 'b',
    explanation: 'A cotangente é o inverso multiplicativo da tangente: cot θ = 1/tan θ = 1/(3/4) = 4/3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_12',
    chapter: 'A Relação Fundamental da Trigonometria',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A relação fundamental da trigonometria estabelece que, para qualquer ângulo θ:',
    options: [
      { id: 'a', text: 'sen θ + cos θ = 1' },
      { id: 'b', text: 'sen²θ + cos²θ = 1' },
      { id: 'c', text: 'sen θ × cos θ = 1' },
      { id: 'd', text: 'sen²θ - cos²θ = 1' }
    ],
    correctOptionId: 'b',
    explanation: 'A relação fundamental da trigonometria, sen²θ + cos²θ = 1, é válida para qualquer ângulo θ e decorre diretamente do Teorema de Pitágoras aplicado ao triângulo retângulo formado no ciclo trigonométrico (onde a hipotenusa tem comprimento 1).',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_trigonometria_13',
    chapter: 'A Relação Fundamental da Trigonometria',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Sabendo que sen θ = 0,6 e que θ é um ângulo agudo, qual é o valor de cos θ, usando a relação fundamental da trigonometria?',
    options: [
      { id: 'a', text: '0,4' },
      { id: 'b', text: '0,6' },
      { id: 'c', text: '0,8' },
      { id: 'd', text: '1,0' }
    ],
    correctOptionId: 'c',
    explanation: 'Pela relação fundamental, cos²θ = 1 - sen²θ = 1 - 0,36 = 0,64, logo cos θ = √0,64 = 0,8 (positivo, pois θ é agudo).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_14',
    chapter: 'Transformações Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A fórmula da soma de arcos para o seno, sen(a+b), é dada por:',
    options: [
      { id: 'a', text: 'sen a × cos b + sen b × cos a' },
      { id: 'b', text: 'sen a × sen b + cos a × cos b' },
      { id: 'c', text: 'sen a + sen b' },
      { id: 'd', text: 'cos a × cos b - sen a × sen b' }
    ],
    correctOptionId: 'a',
    explanation: 'A fórmula da soma de arcos para o seno é sen(a+b) = sen a·cos b + sen b·cos a — uma identidade trigonométrica fundamental usada para simplificar e calcular senos de ângulos compostos.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_trigonometria_15',
    chapter: 'Transformações Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A fórmula do arco duplo para o cosseno, cos(2a), pode ser escrita, entre outras formas equivalentes, como:',
    options: [
      { id: 'a', text: 'cos²a - sen²a' },
      { id: 'b', text: '2×sen a' },
      { id: 'c', text: 'sen a + cos a' },
      { id: 'd', text: 'cos²a + sen²a' }
    ],
    correctOptionId: 'a',
    explanation: 'A fórmula do cosseno do arco duplo é cos(2a) = cos²a - sen²a, que também pode ser reescrita (usando a relação fundamental) como 2cos²a - 1 ou 1 - 2sen²a. A opção (d), cos²a + sen²a, é sempre igual a 1 pela relação fundamental, não representando cos(2a).',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_trigonometria_16',
    chapter: 'Transformações Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Sabendo que sen a = 0,5, qual é o valor de sen(2a), usando a fórmula do arco duplo sen(2a) = 2×sen a×cos a, considerando cos a = 0,87 (aproximadamente)?',
    options: [
      { id: 'a', text: '0,435' },
      { id: 'b', text: '0,87' },
      { id: 'c', text: '1,0' },
      { id: 'd', text: '1,74' }
    ],
    correctOptionId: 'b',
    explanation: 'Aplicando a fórmula: sen(2a) = 2×0,5×0,87 = 0,87.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_trigonometria_17',
    chapter: 'Funções Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'A função f(x) = sen(x) tem como período:',
    options: [
      { id: 'a', text: 'π' },
      { id: 'b', text: '2π' },
      { id: 'c', text: 'π/2' },
      { id: 'd', text: 'Não é uma função periódica' }
    ],
    correctOptionId: 'b',
    explanation: 'A função seno é periódica com período 2π, ou seja, sen(x + 2π) = sen(x) para todo x — o gráfico se repete identicamente a cada intervalo de 2π radianos.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_trigonometria_18',
    chapter: 'Funções Trigonométricas',
    topicId: 'mat_trigonometria',
    subject: 'Matemática',
    prompt: 'Qual é o período da função f(x) = tan(x)?',
    options: [
      { id: 'a', text: 'π/2' },
      { id: 'b', text: 'π' },
      { id: 'c', text: '2π' },
      { id: 'd', text: '4π' }
    ],
    correctOptionId: 'b',
    explanation: 'Diferentemente das funções seno e cosseno (período 2π), a função tangente tem período π, ou seja, tan(x + π) = tan(x) para todo x em que a tangente está definida.',
    difficulty: 'medium'
  },
  // Física — Cinemática Escalar
  {
    id: 'q_fis_cinematica_1',
    chapter: 'Cinemática Escalar. Conceitos Fundamentais',
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
    chapter: 'Movimento Uniformemente Variado',
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
    chapter: 'Movimento Uniforme',
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
    chapter: 'Movimento Uniformemente Variado',
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
    chapter: 'Resistores',
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
    chapter: 'Circuitos de Malha Única',
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
    chapter: 'Resistores',
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
    chapter: 'Circuitos de Malha Única',
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
    chapter: 'Potência Elétrica',
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
    chapter: 'As Leis de Newton',
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
    chapter: 'A Força de Contato',
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
    chapter: 'Sistema de Corpos Interagindo e os Elementos Transmissores de Força',
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
    chapter: 'As Leis de Newton',
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
    chapter: 'Sistema de Corpos Interagindo e os Elementos Transmissores de Força',
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
    chapter: 'Calor Sensível e Calor Latente',
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
    chapter: 'Calor Sensível e Calor Latente',
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
    chapter: 'Calor Sensível e Calor Latente',
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
    chapter: 'Temperatura, Calor e seus Mecanismos de Transferência',
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
    chapter: 'Gases Ideais: Variáveis de Estado e as Transformações Gasosas',
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
    chapter: 'Gases Ideais: Variáveis de Estado e as Transformações Gasosas',
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
    chapter: 'Trabalho da Força de Pressão do Gás',
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
    chapter: 'Primeira Lei da Termodinâmica',
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
    chapter: 'Gases Ideais: Variáveis de Estado e as Transformações Gasosas',
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
    chapter: 'Reflexão em Superfícies Esféricas',
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
    chapter: 'Reflexão em Superfícies Planas',
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
    chapter: 'Lentes Esféricas: Estudo Gráfico',
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
    chapter: 'Refração: Fundamentos, Leis e Aplicações',
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
    chapter: 'Reflexão em Superfícies Planas',
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
    chapter: 'Óptica da Visão',
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
    chapter: 'Óptica da Visão',
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
    chapter: 'Microscópio e Luneta Astronômica (ou Telescópio Refrator): Noções Básicas',
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
    chapter: 'Microscópio e Luneta Astronômica (ou Telescópio Refrator): Noções Básicas',
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
    chapter: 'Óptica da Visão',
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
    chapter: 'Efeito Doppler: Descrição e Estudo Quantitativo',
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
    chapter: 'Ondas Estacionárias em Tubos',
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
    chapter: 'Fenômenos Ondulatórios: Difração, Polarização e Ressonância',
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
    chapter: 'Ondas Estacionárias em Cordas',
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
    chapter: 'Ondulatória: Som e suas Propriedades',
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
    chapter: 'Cálculos Estequiométricos',
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
    chapter: 'Cálculos Estequiométricos',
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
    chapter: 'Cálculos Estequiométricos',
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
    chapter: 'Cálculos Estequiométricos',
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
    chapter: 'Geometria Molecular',
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
    chapter: 'Polaridade das Ligações e das Moléculas',
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
    chapter: 'Geometria Molecular',
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
    chapter: 'Interações Intermoleculares',
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
    chapter: 'Nomenclatura de Compostos Orgânicos',
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
    chapter: 'Introdução à Química Orgânica',
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
    chapter: 'Isomeria',
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
    chapter: 'Introdução à Química Orgânica',
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
    chapter: 'Dispersões',
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
    chapter: 'Dispersões',
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
    chapter: 'Dispersões',
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
    chapter: 'Dispersões',
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
    chapter: 'Reconhecimento de Funções Orgânicas e Algumas de suas Propriedades',
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
    chapter: 'Herança Sexual',
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
    chapter: 'Cálculos Estequiométricos',
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
    chapter: 'Dispersões',
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
    chapter: 'Movimento Uniformemente Variado',
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
    chapter: 'Reações de Oxidação em Hidrocarbonetos',
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
    chapter: 'Ácidos Graxos e Esterificação',
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
    chapter: 'Reações de Adição',
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
    chapter: 'Ácidos Graxos e Esterificação',
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
    chapter: 'Álcoois',
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
    chapter: 'Biomas Brasileiros',
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
    chapter: 'Calor Sensível e Calor Latente',
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
    chapter: 'Ligações Químicas e Alotropia',
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
    chapter: 'Traqueófitas: Transpiração e Reposição Rápida de Água',
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
    chapter: 'Fisiologia Vegetal: Hormônios Vegetais',
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
    chapter: 'Traqueófitas: Transpiração e Reposição Rápida de Água',
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
    chapter: 'Morfofisiologia Vegetal: Caules e Folhas',
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
    chapter: 'Fisiologia Vegetal: Hormônios Vegetais',
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
  {
    id: 'q_bio_fisio_vegetal_6',
    chapter: 'Histologia e Morfologia Vegetal',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Os meristemas são tecidos vegetais formados por células indiferenciadas com alta capacidade de divisão. Sua principal função é:',
    options: [
      { id: 'a', text: 'Realizar fotossíntese em grande escala' },
      { id: 'b', text: 'Originar, por divisão celular contínua, novos tecidos e permitir o crescimento da planta ao longo de toda a sua vida' },
      { id: 'c', text: 'Armazenar exclusivamente substâncias de reserva' },
      { id: 'd', text: 'Conduzir a seiva elaborada' }
    ],
    correctOptionId: 'b',
    explanation: 'Os meristemas são tecidos embrionários formados por células indiferenciadas com grande capacidade de divisão mitótica. A partir deles, por diferenciação celular, originam-se os demais tecidos vegetais (de revestimento, fundamentais e condutores), permitindo o crescimento contínuo (indeterminado) característico das plantas, tanto em comprimento (meristemas apicais) quanto em espessura (meristemas laterais, como o câmbio).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_vegetal_7',
    chapter: 'Histologia e Morfologia Vegetal',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'A epiderme, tecido de revestimento que recobre externamente raízes, caules e folhas jovens, tem entre suas funções principais:',
    options: [
      { id: 'a', text: 'Realizar toda a fotossíntese da planta' },
      { id: 'b', text: 'Proteger a planta contra perda excessiva de água e contra a entrada de patógenos, muitas vezes auxiliada por uma cutícula cerosa' },
      { id: 'c', text: 'Conduzir a seiva bruta das raízes até as folhas' },
      { id: 'd', text: 'Armazenar grandes quantidades de amido' }
    ],
    correctOptionId: 'b',
    explanation: 'A epiderme é o tecido de revestimento externo da planta, geralmente formado por uma única camada de células vivas justapostas, muitas vezes recoberta por uma cutícula cerosa (impermeabilizante). Suas funções incluem proteção contra a perda excessiva de água por evaporação e contra a entrada de microrganismos patogênicos, além de abrigar estruturas especializadas como estômatos e pelos.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_vegetal_8',
    chapter: 'Histologia e Morfologia Vegetal',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Os tecidos fundamentais (parênquima, colênquima e esclerênquima) desempenham papéis distintos na planta. O parênquima clorofiliano, especificamente, é responsável principalmente por:',
    options: [
      { id: 'a', text: 'Sustentação rígida em órgãos já totalmente diferenciados, por meio de paredes espessadas por lignina' },
      { id: 'b', text: 'Realizar fotossíntese, sendo abundante no mesofilo das folhas' },
      { id: 'c', text: 'Conduzir seiva bruta a longas distâncias' },
      { id: 'd', text: 'Formar exclusivamente a epiderme das folhas' }
    ],
    correctOptionId: 'b',
    explanation: 'O parênquima clorofiliano (ou clorênquima) é rico em cloroplastos e constitui a maior parte do mesofilo das folhas, sendo o principal responsável pela realização da fotossíntese na planta. Já o colênquima oferece sustentação flexível em órgãos ainda em crescimento, e o esclerênquima oferece sustentação rígida em órgãos já maduros, com paredes espessadas por lignina.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_fisio_vegetal_9',
    chapter: 'Morfofisiologia Vegetal: Caules e Folhas',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Nas plantas lenhosas, o crescimento em espessura do caule (crescimento secundário) é resultado da atividade de qual estrutura meristemática?',
    options: [
      { id: 'a', text: 'O meristema apical caulinar, exclusivamente' },
      { id: 'b', text: 'O câmbio (meristema lateral), que produz novas camadas de xilema e floema secundários ano após ano' },
      { id: 'c', text: 'A epiderme, por divisão contínua de suas células' },
      { id: 'd', text: 'Os estômatos' }
    ],
    correctOptionId: 'b',
    explanation: 'O crescimento secundário (em espessura) das plantas lenhosas resulta da atividade do câmbio vascular, um meristema lateral situado entre o xilema e o floema primários, que produz novas camadas de xilema secundário (para dentro) e floema secundário (para fora) a cada período de crescimento — processo responsável pela formação dos "anéis de crescimento" visíveis no tronco de árvores.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_10',
    chapter: 'Morfofisiologia Vegetal: Caules e Folhas',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'As folhas são o principal órgão fotossintetizante da maioria das plantas. Sua estrutura achatada e delgada favorece a fotossíntese principalmente porque:',
    options: [
      { id: 'a', text: 'Maximiza a área de captação de luz solar e facilita a difusão de gases (CO2 e O2) através dos estômatos' },
      { id: 'b', text: 'Impede totalmente a entrada de luz, forçando a planta a depender de outros órgãos' },
      { id: 'c', text: 'Aumenta o peso da planta, sem qualquer vantagem fotossintética' },
      { id: 'd', text: 'Elimina a necessidade de água para a fotossíntese' }
    ],
    correctOptionId: 'a',
    explanation: 'A forma achatada e delgada da maioria das folhas maximiza a área de superfície exposta à luz solar (essencial para captar energia luminosa) e mantém uma distância curta entre o ar externo e as células do mesofilo, facilitando a difusão eficiente de CO2 (entrada) e O2 (saída) através dos estômatos.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_fisio_vegetal_11',
    chapter: 'Traqueófitas: Transpiração e Reposição Rápida de Água',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Além da transpiração foliar, a raiz de uma planta pode gerar uma "pressão radicular" que empurra a água para cima no xilema, especialmente à noite. Esse fenômeno é evidenciado por um efeito visível chamado:',
    options: [
      { id: 'a', text: 'Gutação, em que gotas de água (não orvalho) surgem nas bordas das folhas devido à pressão positiva na raiz' },
      { id: 'b', text: 'Fotossíntese noturna' },
      { id: 'c', text: 'Fototropismo negativo' },
      { id: 'd', text: 'Dormência de sementes' }
    ],
    correctOptionId: 'a',
    explanation: 'A gutação é a exsudação de gotas de água líquida (não confundir com orvalho, que é condensação) pelas bordas ou pontas das folhas de certas plantas, especialmente à noite, quando a transpiração é baixa mas a absorção radicular continua, gerando pressão radicular positiva que empurra o excesso de água para fora através de estruturas especializadas (hidatódios).',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_12',
    chapter: 'Fisiologia Vegetal: Transporte no Floema',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'Ao contrário do xilema (transporte unidirecional, das raízes às folhas), o floema transporta a seiva elaborada (rica em açúcares) de forma:',
    options: [
      { id: 'a', text: 'Sempre unidirecional, das raízes para as folhas' },
      { id: 'b', text: 'Bidirecional, dos órgãos-fonte (produtores de açúcar, como folhas fotossintetizantes) para os órgãos-dreno (consumidores ou armazenadores, como raízes e frutos), podendo mudar de direção conforme a necessidade da planta' },
      { id: 'c', text: 'Exclusivamente das folhas para a atmosfera' },
      { id: 'd', text: 'Não existe transporte no floema, apenas armazenamento local' }
    ],
    correctOptionId: 'b',
    explanation: 'O transporte pelo floema segue o modelo fonte-dreno: a seiva elaborada flui dos órgãos-fonte (que produzem ou liberam açúcares, como folhas fotossintetizantes maduras) para os órgãos-dreno (que consomem ou armazenam açúcares, como raízes, frutos em crescimento ou sementes). Como fontes e drenos podem mudar ao longo do desenvolvimento da planta, o sentido do fluxo no floema pode se inverter, ao contrário do fluxo unidirecional do xilema.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_13',
    chapter: 'Fisiologia Vegetal: Transporte no Floema',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'O modelo do fluxo de pressão (ou fluxo em massa), proposto para explicar o transporte pelo floema, baseia-se na ideia de que:',
    options: [
      { id: 'a', text: 'O carregamento ativo de açúcares nas células-fonte reduz o potencial hídrico ali, atraindo água por osmose e gerando uma pressão de turgor que empurra a seiva elaborada em direção às regiões de menor pressão (drenos)' },
      { id: 'b', text: 'A seiva elaborada é transportada exclusivamente por evaporação nas folhas' },
      { id: 'c', text: 'Não há qualquer movimento de água envolvido no transporte do floema' },
      { id: 'd', text: 'O transporte no floema depende unicamente da força da gravidade' }
    ],
    correctOptionId: 'a',
    explanation: 'No modelo do fluxo de pressão, o carregamento ativo (com gasto de energia) de açúcares nas células do floema próximas à fonte reduz o potencial hídrico ali, o que atrai água por osmose do xilema adjacente; isso gera uma pressão de turgor elevada na região da fonte, que empurra a seiva elaborada ao longo dos tubos crivados em direção às regiões de menor pressão, próximas aos drenos, onde os açúcares são descarregados.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_14',
    chapter: 'Fisiologia Vegetal: Transporte no Floema',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'As células condutoras do floema (elementos crivados) apresentam uma característica única entre as células vegetais especializadas em transporte: elas',
    options: [
      { id: 'a', text: 'São células mortas na maturidade, sem qualquer conteúdo citoplasmático' },
      { id: 'b', text: 'Permanecem vivas na maturidade, mas perdem a maioria das organelas (incluindo o núcleo), dependendo de células-companheiras adjacentes para suas funções metabólicas' },
      { id: 'c', text: 'Possuem parede celular espessada por lignina, como os vasos do xilema' },
      { id: 'd', text: 'Realizam fotossíntese ativa para produzir seu próprio alimento' }
    ],
    correctOptionId: 'b',
    explanation: 'Os elementos crivados (células condutoras do floema) permanecem vivos na maturidade, mas perdem o núcleo e a maior parte das organelas, o que reduz a resistência ao fluxo da seiva elaborada. Para suprir suas necessidades metabólicas, dependem de células-companheiras adjacentes, conectadas por plasmodesmos — uma relação de interdependência única no reino vegetal.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_fisio_vegetal_15',
    chapter: 'Fisiologia Vegetal: Hormônios Vegetais',
    topicId: 'bio_fisio_vegetal',
    subject: 'Biologia',
    prompt: 'As giberelinas, um grupo de hormônios vegetais, têm entre suas funções conhecidas:',
    options: [
      { id: 'a', text: 'Inibir totalmente o crescimento do caule, em qualquer situação' },
      { id: 'b', text: 'Promover o alongamento do caule e quebrar a dormência de sementes, estimulando sua germinação' },
      { id: 'c', text: 'Promover exclusivamente o amadurecimento de frutos, como o etileno' },
      { id: 'd', text: 'Atuar apenas em raízes, sem qualquer efeito na parte aérea da planta' }
    ],
    correctOptionId: 'b',
    explanation: 'As giberelinas promovem o alongamento do caule (efeito clássico observado em plantas anãs tratadas com giberelina, que passam a crescer normalmente) e têm papel importante na quebra de dormência de sementes, estimulando a síntese de enzimas (como a alfa-amilase) que mobilizam reservas de amido necessárias para a germinação.',
    difficulty: 'medium'
  },
  // Física — Dinâmica Impulsiva
  {
    id: 'q_fis_dinamica_impulsiva_1',
    chapter: 'Impulso e Quantidade de Movimento',
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
    chapter: 'Impulso e Quantidade de Movimento',
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
    chapter: 'Colisões',
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
    chapter: 'Colisões',
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
    chapter: 'Impulso e Quantidade de Movimento',
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
    chapter: 'Estática',
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
    chapter: 'Hidrostática: Densidade e Pressão',
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
    chapter: 'Hidrostática: Densidade e Pressão',
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
    chapter: 'Estática',
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
    chapter: 'Hidrostática: Densidade e Pressão',
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
    chapter: 'Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme',
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
    chapter: 'Análise de Força Magnética em Fios Percorridos por Correntes Contínuas',
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
    chapter: 'Indução Eletromagnética: Lei de Lenz',
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
    chapter: 'Indução Eletromagnética: Lei de Lenz',
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
    chapter: 'Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme',
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
    chapter: 'Recursos Argumentativos: Dados Numéricos e Exemplos',
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
    id: 'q_por_red_argumentacao_2',
    chapter: 'Argumentação e Coerência Interna',
    topicId: 'por_red_argumentacao',
    subject: 'Português',
    prompt: 'Em um parágrafo de desenvolvimento de uma redação dissertativo-argumentativa, a estrutura considerada mais eficaz costuma seguir a lógica de:',
    options: [
      { id: 'a', text: 'Apresentar apenas uma afirmação solta, sem qualquer justificativa ou exemplo' },
      { id: 'b', text: 'Apresentar um argumento (afirmação relacionada à tese), desenvolvê-lo com explicação, dado ou exemplo, e articulá-lo de volta à tese central' },
      { id: 'c', text: 'Narrar uma história pessoal, sem qualquer relação com o tema' },
      { id: 'd', text: 'Listar o maior número possível de argumentos diferentes, sem aprofundar nenhum deles' }
    ],
    correctOptionId: 'b',
    explanation: 'Um parágrafo argumentativo eficaz apresenta uma ideia-núcleo (o argumento), a desenvolve com uma justificativa, dado ou exemplo que a sustente, e a conecta de volta à tese — evitando tanto afirmações soltas sem sustentação quanto um acúmulo raso de muitos argumentos não aprofundados.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_argumentacao_3',
    chapter: 'Argumentação e Coerência Interna',
    topicId: 'por_red_argumentacao',
    subject: 'Português',
    prompt: 'A coerência textual, um dos critérios avaliados em uma redação dissertativo-argumentativa, se refere principalmente a:',
    options: [
      { id: 'a', text: 'O uso correto de acentuação e pontuação' },
      { id: 'b', text: 'A relação lógica entre as ideias do texto, garantindo que não haja contradições internas e que os argumentos se conectem de forma consistente à tese' },
      { id: 'c', text: 'O tamanho exato de cada parágrafo' },
      { id: 'd', text: 'A caligrafia utilizada na redação' }
    ],
    correctOptionId: 'b',
    explanation: 'Coerência é a qualidade que garante a lógica interna do texto: que as ideias se encadeiem sem contradições, que os argumentos realmente sustentem a tese proposta, e que o texto faça sentido como um todo — diferente da coesão, que trata da conexão gramatical/textual entre as partes (uso de conectivos, pronomes, etc.).',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_argumentacao_4',
    chapter: 'Recursos Argumentativos: Vozes Prestigiadas',
    topicId: 'por_red_argumentacao',
    subject: 'Português',
    prompt: 'O uso de um argumento de autoridade em uma redação dissertativo-argumentativa (por exemplo, citar um especialista ou uma pesquisa científica) é eficaz principalmente quando:',
    options: [
      { id: 'a', text: 'É usado isoladamente, sem qualquer conexão com o raciocínio do candidato' },
      { id: 'b', text: 'Está integrado ao raciocínio do candidato, reforçando (e não substituindo) a argumentação própria sobre o tema' },
      { id: 'c', text: 'É inventado ou impreciso, desde que pareça convincente' },
      { id: 'd', text: 'Ocupa a maior parte do texto, deixando pouco espaço para as ideias do próprio candidato' }
    ],
    correctOptionId: 'b',
    explanation: 'Um argumento de autoridade é mais eficaz quando complementa e reforça o raciocínio já desenvolvido pelo candidato, servindo como sustentação adicional — e não quando substitui a reflexão própria ou é usado de forma solta, sem integração ao restante da argumentação.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_argumentacao_5',
    chapter: 'Argumentação e Coerência Interna',
    topicId: 'por_red_argumentacao',
    subject: 'Português',
    prompt: 'Um dos erros argumentativos mais comuns em redações é a chamada "circularidade" — quando o candidato:',
    options: [
      { id: 'a', text: 'Apresenta uma tese clara logo na introdução' },
      { id: 'b', text: 'Repete a mesma ideia com palavras diferentes ao longo do texto, sem de fato avançar ou aprofundar o raciocínio' },
      { id: 'c', text: 'Conclui o texto retomando brevemente a tese' },
      { id: 'd', text: 'Utiliza exemplos concretos para sustentar os argumentos' }
    ],
    correctOptionId: 'b',
    explanation: 'A circularidade argumentativa ocorre quando o texto parece avançar, mas na verdade fica reafirmando a mesma ideia inicial com outras palavras, sem acrescentar novos ângulos, evidências ou aprofundamento — um problema de progressão textual que compromete a qualidade da argumentação.',
    difficulty: 'hard'
  },
  {
    id: 'q_por_red_estrutura_coesao_1',
    chapter: 'Proposta de Intervenção: Viabilização e Inovação',
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
  {
    id: 'q_por_red_estrutura_coesao_2',
    chapter: 'Recursos de Coesão Sequencial no Texto Dissertativo',
    topicId: 'por_red_estrutura_coesao',
    subject: 'Português',
    prompt: 'Os conectivos (como "portanto", "além disso", "no entanto") desempenham, em um texto dissertativo-argumentativo, o papel principal de:',
    options: [
      { id: 'a', text: 'Preencher espaço no texto, sem função lógica real' },
      { id: 'b', text: 'Estabelecer e sinalizar explicitamente as relações lógicas entre as ideias (adição, oposição, conclusão, entre outras), garantindo a coesão textual' },
      { id: 'c', text: 'Substituir a necessidade de uma tese clara' },
      { id: 'd', text: 'Encerrar obrigatoriamente cada parágrafo do texto' }
    ],
    correctOptionId: 'b',
    explanation: 'Conectivos são elementos coesivos que explicitam a relação lógica entre as partes do texto — por exemplo, "portanto" sinaliza conclusão, "além disso" sinaliza adição, e "no entanto" sinaliza contraste — orientando o leitor na compreensão da progressão argumentativa.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_estrutura_coesao_3',
    chapter: 'Conclusão por Síntese ou Retomada da Tese',
    topicId: 'por_red_estrutura_coesao',
    subject: 'Português',
    prompt: 'Em uma conclusão de redação dissertativo-argumentativa, além da proposta de intervenção (exigida pelo ENEM), é esperado que o candidato também:',
    options: [
      { id: 'a', text: 'Introduza um argumento completamente novo, não discutido antes no texto' },
      { id: 'b', text: 'Retome, de forma sintética, a tese e os principais argumentos desenvolvidos, fechando o raciocínio de forma coerente com o restante do texto' },
      { id: 'c', text: 'Repita literalmente, palavra por palavra, a introdução do texto' },
      { id: 'd', text: 'Evite qualquer menção à tese apresentada anteriormente' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma boa conclusão retoma de forma sintética (não repetitiva) a tese e os principais argumentos já desenvolvidos, encerrando o raciocínio de forma coerente — e não introduzindo argumentos totalmente novos, que deveriam ter sido tratados no desenvolvimento.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_estrutura_coesao_4',
    chapter: 'Recursos de Coesão Referencial no Texto Dissertativo',
    topicId: 'por_red_estrutura_coesao',
    subject: 'Português',
    prompt: 'A coesão referencial, um dos mecanismos de coesão textual, consiste em:',
    options: [
      { id: 'a', text: 'Retomar um termo já mencionado anteriormente no texto por meio de pronomes, sinônimos ou expressões equivalentes, evitando repetições desnecessárias' },
      { id: 'b', text: 'Utilizar sempre o mesmo substantivo repetidamente, sem qualquer variação' },
      { id: 'c', text: 'Eliminar toda pontuação do texto' },
      { id: 'd', text: 'Utilizar apenas frases muito curtas, sem qualquer conector' }
    ],
    correctOptionId: 'a',
    explanation: 'A coesão referencial retoma elementos já citados no texto por meio de pronomes (ele, essa, aquilo), sinônimos ou expressões equivalentes, evitando repetições desnecessárias e mantendo o texto fluido e bem articulado.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_estrutura_coesao_5',
    chapter: 'Proposta de Intervenção: Viabilização e Inovação',
    topicId: 'por_red_estrutura_coesao',
    subject: 'Português',
    prompt: 'Uma proposta de intervenção que sugere apenas "o governo deveria fazer mais campanhas de conscientização" tende a receber uma avaliação mais baixa, nos critérios do ENEM, principalmente porque:',
    options: [
      { id: 'a', text: 'É uma proposta detalhada e completa, sem qualquer problema' },
      { id: 'b', text: 'É uma proposta genérica, sem detalhamento do meio de execução, e não especifica como a campanha seria implementada nem sua conexão direta com os argumentos do texto' },
      { id: 'c', text: 'Menciona o governo como agente, o que nunca é aceito pela banca' },
      { id: 'd', text: 'Não pode envolver nenhum órgão público, apenas ONGs' }
    ],
    correctOptionId: 'b',
    explanation: 'Embora "o governo" seja um agente válido, a proposta se torna fraca por ser genérica: não detalha o meio de execução (como seria feita a campanha, por qual órgão específico, com quais parceiros), nem articula claramente essa ação aos argumentos já desenvolvidos no texto — características exigidas para uma proposta de intervenção nota máxima.',
    difficulty: 'hard'
  },
  // Matemática — Aritmética e Proporcionalidade
  {
    id: 'q_mat_aritmetica_proporcionalidade_1',
    chapter: 'Razão e Proporção',
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
    chapter: 'Razão e Proporção',
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
    chapter: 'Porcentagem',
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
    chapter: 'Razão e Proporção',
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
    chapter: 'Razão e Proporção',
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
  {
    id: 'q_mat_aritmetica_proporcionalidade_6',
    chapter: 'Potências e Radicais',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Qual é o valor de 2⁻³?',
    options: [
      { id: 'a', text: '-8' },
      { id: 'b', text: '-6' },
      { id: 'c', text: '1/8' },
      { id: 'd', text: '8' }
    ],
    correctOptionId: 'c',
    explanation: 'Um expoente negativo indica o inverso da potência com expoente positivo: 2⁻³ = 1/2³ = 1/8.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_7',
    chapter: 'Potências e Radicais',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Qual é o valor de √144?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '11' },
      { id: 'c', text: '12' },
      { id: 'd', text: '14' }
    ],
    correctOptionId: 'c',
    explanation: '12 × 12 = 144, logo √144 = 12.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_8',
    chapter: 'Potências e Radicais',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Simplificando a expressão √50, obtemos:',
    options: [
      { id: 'a', text: '5√2' },
      { id: 'b', text: '2√5' },
      { id: 'c', text: '25√2' },
      { id: 'd', text: '10√5' }
    ],
    correctOptionId: 'a',
    explanation: '50 = 25 × 2, e √25 = 5, então √50 = √25 × √2 = 5√2.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_aritmetica_proporcionalidade_9',
    chapter: 'Porcentagem',
    topicId: 'mat_aritmetica_proporcionalidade',
    subject: 'Matemática',
    prompt: 'Um produto que custava R$ 80,00 teve um desconto de 15%. Qual é o novo preço?',
    options: [
      { id: 'a', text: 'R$ 12,00' },
      { id: 'b', text: 'R$ 65,00' },
      { id: 'c', text: 'R$ 68,00' },
      { id: 'd', text: 'R$ 92,00' }
    ],
    correctOptionId: 'c',
    explanation: 'O desconto é 15% de 80 = 0,15 × 80 = 12. O novo preço é 80 - 12 = R$ 68,00.',
    difficulty: 'easy'
  },
  // Matemática — Teoria dos Números Inteiros
  {
    id: 'q_mat_teoria_numeros_1',
    chapter: 'Introdução à Teoria dos Números Inteiros',
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
    chapter: 'Introdução à Teoria dos Números Inteiros',
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
    chapter: 'Introdução à Teoria dos Números Inteiros',
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
    chapter: 'Introdução à Teoria dos Números Inteiros',
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
    chapter: 'Introdução à Teoria dos Números Inteiros',
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
  {
    id: 'q_mat_teoria_numeros_6',
    chapter: 'O Sistema de Numeração Decimal',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'No número 3.542, o algarismo 5 ocupa a posição das:',
    options: [
      { id: 'a', text: 'Unidades' },
      { id: 'b', text: 'Dezenas' },
      { id: 'c', text: 'Centenas' },
      { id: 'd', text: 'Unidades de milhar' }
    ],
    correctOptionId: 'c',
    explanation: 'No sistema de numeração decimal (posicional), cada posição representa uma potência de 10. Em 3.542, da direita para a esquerda temos: 2 (unidades), 4 (dezenas), 5 (centenas), 3 (unidades de milhar) — logo, o 5 ocupa a posição das centenas.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_teoria_numeros_7',
    chapter: 'O Sistema de Numeração Decimal',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'O sistema de numeração decimal é chamado de "posicional" porque:',
    options: [
      { id: 'a', text: 'O valor de cada algarismo depende da posição que ele ocupa no número' },
      { id: 'b', text: 'Os algarismos podem ser escritos em qualquer ordem sem alterar o valor do número' },
      { id: 'c', text: 'Utiliza apenas os algarismos 0 e 1' },
      { id: 'd', text: 'Cada número deve ter exatamente 10 algarismos' }
    ],
    correctOptionId: 'a',
    explanation: 'No sistema posicional decimal, o mesmo algarismo representa valores diferentes conforme sua posição: o 3 em "300" vale 3 centenas, mas em "30" vale 3 dezenas — diferente de sistemas não posicionais (como os numerais romanos), em que o valor de cada símbolo é fixo.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_teoria_numeros_8',
    chapter: 'O Sistema de Numeração Decimal',
    topicId: 'mat_teoria_numeros',
    subject: 'Matemática',
    prompt: 'O número 2.475 pode ser decomposto, segundo o valor posicional de cada algarismo, como:',
    options: [
      { id: 'a', text: '2 + 4 + 7 + 5' },
      { id: 'b', text: '2×1000 + 4×100 + 7×10 + 5×1' },
      { id: 'c', text: '2×10 + 4×10 + 7×10 + 5×10' },
      { id: 'd', text: '2475 × 1' }
    ],
    correctOptionId: 'b',
    explanation: 'A decomposição de um número decimal segue o valor posicional (potências de 10) de cada algarismo: 2.475 = 2×1000 + 4×100 + 7×10 + 5×1, refletindo exatamente o sistema de numeração posicional de base 10.',
    difficulty: 'easy'
  },
  // Matemática — Sequências, Matrizes e Sistemas Lineares
  {
    id: 'q_mat_sequencias_matrizes_1',
    chapter: 'Progressão Aritmética',
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
    chapter: 'Progressão Geométrica',
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
    chapter: 'Progressão Aritmética',
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
    chapter: 'Determinantes',
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
    chapter: 'Progressão Geométrica',
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
  {
    id: 'q_mat_sequencias_matrizes_6',
    chapter: 'Introdução às Sequências',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma sequência numérica é definida pela lei de formação an = 2n + 1, para n = 1, 2, 3, .... Qual é o valor do quarto termo (a4)?',
    options: [
      { id: 'a', text: '7' },
      { id: 'b', text: '8' },
      { id: 'c', text: '9' },
      { id: 'd', text: '11' }
    ],
    correctOptionId: 'c',
    explanation: 'Substituindo n = 4 na fórmula: a4 = 2×4 + 1 = 9.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_7',
    chapter: 'Introdução às Sequências',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma sequência é dita recursiva quando:',
    options: [
      { id: 'a', text: 'Cada termo é definido em função de um ou mais termos anteriores da própria sequência' },
      { id: 'b', text: 'Todos os termos são iguais entre si' },
      { id: 'c', text: 'A sequência possui um número finito e pequeno de termos, sempre' },
      { id: 'd', text: 'Não existe nenhuma regra ou padrão entre os termos' }
    ],
    correctOptionId: 'a',
    explanation: 'Em uma sequência recursiva, cada termo (a partir de um certo ponto) é calculado a partir de termos anteriores, por meio de uma fórmula de recorrência — como na sequência de Fibonacci, em que cada termo é a soma dos dois anteriores.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_8',
    chapter: 'Progressão Aritmética',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma progressão aritmética (PA) tem primeiro termo 5 e razão 4. Qual é o vigésimo termo (a20)?',
    options: [
      { id: 'a', text: '76' },
      { id: 'b', text: '80' },
      { id: 'c', text: '81' },
      { id: 'd', text: '85' }
    ],
    correctOptionId: 'c',
    explanation: 'O termo geral da PA é an = a1 + (n-1)×r. Logo, a20 = 5 + (20-1)×4 = 5 + 76 = 81.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_9',
    chapter: 'Sequências',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'A sequência de Fibonacci (1, 1, 2, 3, 5, 8, 13, ...) é construída segundo a regra:',
    options: [
      { id: 'a', text: 'Cada termo, a partir do terceiro, é a soma dos dois termos imediatamente anteriores' },
      { id: 'b', text: 'Cada termo é o dobro do termo anterior' },
      { id: 'c', text: 'Cada termo é obtido somando 1 ao termo anterior' },
      { id: 'd', text: 'Os termos seguem uma razão constante, como em uma progressão geométrica' }
    ],
    correctOptionId: 'a',
    explanation: 'Na sequência de Fibonacci, cada termo (a partir do terceiro) é obtido somando os dois termos imediatamente anteriores: 1+1=2, 1+2=3, 2+3=5, 3+5=8, e assim por diante — não sendo, portanto, nem uma PA nem uma PG.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_10',
    chapter: 'Sequências',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma sequência é dita finita quando:',
    options: [
      { id: 'a', text: 'Possui um número limitado (finito) de termos' },
      { id: 'b', text: 'Possui infinitos termos, sem exceção' },
      { id: 'c', text: 'Todos os termos são números finitos, mesmo que a sequência tenha infinitos termos' },
      { id: 'd', text: 'É sempre uma progressão aritmética' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma sequência finita é aquela que possui um número limitado de termos (por exemplo, os dias da semana, com 7 termos), em oposição a uma sequência infinita, que continua indefinidamente (como os números naturais).',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_11',
    chapter: 'Sequências',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma sequência (an) é dita crescente quando:',
    options: [
      { id: 'a', text: 'Cada termo é maior que o termo anterior, para todo n' },
      { id: 'b', text: 'Cada termo é menor que o termo anterior, para todo n' },
      { id: 'c', text: 'Todos os termos são iguais entre si' },
      { id: 'd', text: 'A sequência possui apenas números negativos' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma sequência é crescente quando an+1 > an para todo n do domínio considerado, ou seja, cada termo é estritamente maior que o termo imediatamente anterior.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_12',
    chapter: 'Sistemas de Equações',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Resolvendo o sistema de equações {x + y = 10; x - y = 2}, quais são os valores de x e y?',
    options: [
      { id: 'a', text: 'x = 5, y = 5' },
      { id: 'b', text: 'x = 6, y = 4' },
      { id: 'c', text: 'x = 4, y = 6' },
      { id: 'd', text: 'x = 8, y = 2' }
    ],
    correctOptionId: 'b',
    explanation: 'Somando as duas equações: 2x = 12 → x = 6. Substituindo na primeira: 6 + y = 10 → y = 4.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_13',
    chapter: 'Sistemas de Equações',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'O método da substituição, usado para resolver sistemas de equações lineares, consiste em:',
    options: [
      { id: 'a', text: 'Isolar uma variável em uma das equações e substituir sua expressão na outra equação' },
      { id: 'b', text: 'Somar diretamente as duas equações sem qualquer manipulação prévia' },
      { id: 'c', text: 'Multiplicar as duas equações por zero' },
      { id: 'd', text: 'Ignorar uma das equações do sistema' }
    ],
    correctOptionId: 'a',
    explanation: 'No método da substituição, isola-se uma variável em termos da outra em uma das equações, e essa expressão é substituída na outra equação, reduzindo o sistema a uma única equação com uma incógnita, que pode então ser resolvida diretamente.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_14',
    chapter: 'Tabelas e Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma matriz de ordem 3x4 possui:',
    options: [
      { id: 'a', text: '3 linhas e 4 colunas, totalizando 12 elementos' },
      { id: 'b', text: '4 linhas e 3 colunas, totalizando 12 elementos' },
      { id: 'c', text: '3 elementos apenas' },
      { id: 'd', text: '7 elementos, correspondentes à soma 3+4' }
    ],
    correctOptionId: 'a',
    explanation: 'Na notação de ordem de uma matriz (m x n), o primeiro número indica o número de linhas e o segundo o número de colunas. Uma matriz 3x4 tem 3 linhas e 4 colunas, totalizando 3×4 = 12 elementos.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_15',
    chapter: 'Tabelas e Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma matriz quadrada é aquela em que:',
    options: [
      { id: 'a', text: 'O número de linhas é igual ao número de colunas' },
      { id: 'b', text: 'Todos os elementos são iguais a zero' },
      { id: 'c', text: 'Possui apenas uma linha' },
      { id: 'd', text: 'Possui apenas uma coluna' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma matriz quadrada tem o mesmo número de linhas e colunas (ordem n x n) — só matrizes quadradas possuem determinante definido e diagonal principal no sentido usual.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_16',
    chapter: 'Tabelas e Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Ao somar duas matrizes de mesma ordem, o resultado é obtido:',
    options: [
      { id: 'a', text: 'Somando os elementos correspondentes (mesma posição) de cada matriz' },
      { id: 'b', text: 'Multiplicando todos os elementos de uma matriz pelos da outra, um a um' },
      { id: 'c', text: 'Somando apenas os elementos da diagonal principal' },
      { id: 'd', text: 'É impossível somar duas matrizes, mesmo de mesma ordem' }
    ],
    correctOptionId: 'a',
    explanation: 'A soma de matrizes de mesma ordem é feita elemento a elemento: cada elemento da matriz resultante é a soma dos elementos correspondentes (de mesma posição - linha e coluna) das duas matrizes originais.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_17',
    chapter: 'Multiplicação de Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Para que seja possível multiplicar a matriz A (de ordem m x n) pela matriz B, é necessário que:',
    options: [
      { id: 'a', text: 'B tenha exatamente n linhas (o número de colunas de A deve ser igual ao número de linhas de B)' },
      { id: 'b', text: 'A e B tenham exatamente a mesma ordem' },
      { id: 'c', text: 'B tenha exatamente m colunas' },
      { id: 'd', text: 'Ambas as matrizes sejam quadradas' }
    ],
    correctOptionId: 'a',
    explanation: 'A multiplicação de matrizes A(m x n) por B só é definida quando o número de colunas de A (n) é igual ao número de linhas de B — o produto resultante terá ordem m x p, onde p é o número de colunas de B.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_18',
    chapter: 'Multiplicação de Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Diferentemente da multiplicação de números reais, a multiplicação de matrizes:',
    options: [
      { id: 'a', text: 'É sempre comutativa: A×B = B×A, para quaisquer matrizes A e B' },
      { id: 'b', text: 'Não é, em geral, comutativa: A×B pode ser diferente de B×A' },
      { id: 'c', text: 'Nunca pode ser realizada, em nenhuma situação' },
      { id: 'd', text: 'Sempre resulta em uma matriz identidade' }
    ],
    correctOptionId: 'b',
    explanation: 'Ao contrário da multiplicação de números reais, a multiplicação de matrizes não é, em geral, comutativa: A×B costuma ser diferente de B×A (e às vezes um dos dois produtos nem está definido) — uma propriedade importante a se ter em mente ao operar com matrizes.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_19',
    chapter: 'Multiplicação de Matrizes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'A matriz identidade I, ao multiplicar qualquer matriz quadrada A de mesma ordem, tem como propriedade:',
    options: [
      { id: 'a', text: 'A×I = I×A = A, funcionando como o elemento neutro da multiplicação de matrizes' },
      { id: 'b', text: 'A×I resulta sempre na matriz nula' },
      { id: 'c', text: 'A×I altera completamente todos os elementos de A' },
      { id: 'd', text: 'A×I só é definida se A for uma matriz linha' }
    ],
    correctOptionId: 'a',
    explanation: 'A matriz identidade (com 1 na diagonal principal e 0 nas demais posições) funciona como o elemento neutro multiplicativo: multiplicar qualquer matriz quadrada A pela matriz identidade de mesma ordem (à esquerda ou à direita) resulta na própria matriz A, sem alterações.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_20',
    chapter: 'Determinantes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Qual é o determinante da matriz [[4, 2], [3, 1]]?',
    options: [
      { id: 'a', text: '-2' },
      { id: 'b', text: '2' },
      { id: 'c', text: '4' },
      { id: 'd', text: '10' }
    ],
    correctOptionId: 'a',
    explanation: 'Para uma matriz 2x2 [[a,b],[c,d]], o determinante é ad - bc. Aqui: 4×1 - 2×3 = 4 - 6 = -2.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_21',
    chapter: 'Determinantes',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Se o determinante de uma matriz quadrada A é igual a zero, isso significa que:',
    options: [
      { id: 'a', text: 'A matriz A é invertível (possui matriz inversa)' },
      { id: 'b', text: 'A matriz A não é invertível (não possui matriz inversa)' },
      { id: 'c', text: 'Todos os elementos de A são necessariamente zero' },
      { id: 'd', text: 'A matriz A é obrigatoriamente a matriz identidade' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma matriz quadrada só é invertível (admite matriz inversa) se, e somente se, seu determinante for diferente de zero. Se det(A) = 0, a matriz é chamada de singular e não possui inversa.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_22',
    chapter: 'Discussão de Sistemas Lineares',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Um sistema linear é classificado como "possível e determinado" (SPD) quando:',
    options: [
      { id: 'a', text: 'Possui exatamente uma única solução' },
      { id: 'b', text: 'Possui infinitas soluções' },
      { id: 'c', text: 'Não possui nenhuma solução' },
      { id: 'd', text: 'Possui exatamente duas soluções' }
    ],
    correctOptionId: 'a',
    explanation: 'Um sistema linear possível e determinado (SPD) é aquele que admite exatamente uma única solução — geralmente identificado, no método da matriz dos coeficientes, quando o determinante dessa matriz é diferente de zero.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_23',
    chapter: 'Discussão de Sistemas Lineares',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Um sistema linear é classificado como "impossível" (SI) quando:',
    options: [
      { id: 'a', text: 'Não admite nenhuma solução que satisfaça simultaneamente todas as equações do sistema' },
      { id: 'b', text: 'Admite exatamente uma solução' },
      { id: 'c', text: 'Admite infinitas soluções' },
      { id: 'd', text: 'É sempre um sistema com apenas uma equação' }
    ],
    correctOptionId: 'a',
    explanation: 'Um sistema linear impossível (SI) é aquele em que não existe nenhum conjunto de valores para as incógnitas que satisfaça todas as equações simultaneamente — geometricamente, por exemplo, pode corresponder a duas retas paralelas e distintas no plano, que nunca se cruzam.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_sequencias_matrizes_24',
    chapter: 'Médias',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'A média aritmética dos números 4, 8, 10 e 14 é:',
    options: [
      { id: 'a', text: '8' },
      { id: 'b', text: '9' },
      { id: 'c', text: '9,5' },
      { id: 'd', text: '11' }
    ],
    correctOptionId: 'b',
    explanation: 'A média aritmética é a soma dos valores dividida pela quantidade de valores: (4+8+10+14)/4 = 36/4 = 9.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_sequencias_matrizes_25',
    chapter: 'Médias',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'A média geométrica é mais apropriada que a média aritmética quando se trabalha com:',
    options: [
      { id: 'a', text: 'Taxas de crescimento ou variações percentuais compostas ao longo do tempo' },
      { id: 'b', text: 'Somas simples de valores absolutos, sem qualquer relação multiplicativa' },
      { id: 'c', text: 'Valores que nunca podem ser positivos' },
      { id: 'd', text: 'Conjuntos de dados com apenas um único valor' }
    ],
    correctOptionId: 'a',
    explanation: 'A média geométrica é mais adequada para representar taxas de crescimento compostas (como rendimentos de investimento ao longo de vários períodos), já que ela captura corretamente o efeito multiplicativo dessas variações, diferentemente da média aritmética, que trataria as taxas de forma aditiva.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_sequencias_matrizes_26',
    chapter: 'Médias',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Um aluno obteve notas 6, 7 e 9 em três avaliações com pesos 2, 3 e 5, respectivamente. Qual é sua média ponderada?',
    options: [
      { id: 'a', text: '7,0' },
      { id: 'b', text: '7,3' },
      { id: 'c', text: '7,8' },
      { id: 'd', text: '8,0' }
    ],
    correctOptionId: 'c',
    explanation: 'A média ponderada é a soma dos produtos nota×peso dividida pela soma dos pesos: (6×2 + 7×3 + 9×5)/(2+3+5) = (12+21+45)/10 = 78/10 = 7,8.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_sequencias_matrizes_27',
    chapter: 'Progressão Geométrica',
    topicId: 'mat_sequencias_matrizes',
    subject: 'Matemática',
    prompt: 'Uma progressão geométrica (PG) tem primeiro termo 3 e razão 2. Qual é o quinto termo (a5)?',
    options: [
      { id: 'a', text: '24' },
      { id: 'b', text: '48' },
      { id: 'c', text: '32' },
      { id: 'd', text: '96' }
    ],
    correctOptionId: 'b',
    explanation: 'O termo geral da PG é an = a1 × r^(n-1). Logo, a5 = 3 × 2⁴ = 3 × 16 = 48.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Espacial
  {
    id: 'q_mat_geometria_espacial_1',
    chapter: 'Sólidos de Revolução',
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
    chapter: 'Razões entre Volumes de Sólidos',
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
    chapter: 'Cubos e Paralelepípedos',
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
    chapter: 'Sólidos de Revolução',
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
    chapter: 'Razões entre Volumes de Sólidos',
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
  {
    id: 'q_mat_geometria_espacial_6',
    chapter: 'O Universo Tridimensional',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Na geometria espacial, dois planos distintos que nunca se interceptam, em nenhum ponto, são chamados de:',
    options: [
      { id: 'a', text: 'Planos concorrentes' },
      { id: 'b', text: 'Planos paralelos' },
      { id: 'c', text: 'Planos perpendiculares' },
      { id: 'd', text: 'Planos coincidentes' }
    ],
    correctOptionId: 'b',
    explanation: 'Dois planos distintos são paralelos quando não possuem nenhum ponto em comum, ou seja, nunca se interceptam — análogo ao conceito de retas paralelas, mas estendido ao espaço tridimensional.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_7',
    chapter: 'O Universo Tridimensional',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Uma reta é considerada perpendicular a um plano quando:',
    options: [
      { id: 'a', text: 'Ela é perpendicular a todas as retas do plano que passam pelo ponto de interseção' },
      { id: 'b', text: 'Ela é paralela a apenas uma reta do plano' },
      { id: 'c', text: 'Ela não intercepta o plano em nenhum ponto' },
      { id: 'd', text: 'Ela está contida no próprio plano' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma reta é perpendicular a um plano quando forma um ângulo de 90° com toda e qualquer reta do plano que passe pelo ponto de interseção entre a reta e o plano — não basta ser perpendicular a apenas uma reta do plano.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_8',
    chapter: 'O Universo Tridimensional',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Duas retas no espaço tridimensional que não são paralelas e também não se interceptam são chamadas de:',
    options: [
      { id: 'a', text: 'Retas concorrentes' },
      { id: 'b', text: 'Retas coincidentes' },
      { id: 'c', text: 'Retas reversas (ou retas ortogonais/reversas, conforme o ângulo)' },
      { id: 'd', text: 'Retas perpendiculares, sempre' }
    ],
    correctOptionId: 'c',
    explanation: 'No espaço tridimensional (diferente do plano), duas retas podem não ser paralelas e ainda assim nunca se cruzarem, por estarem em planos diferentes — são chamadas de retas reversas, um conceito que não existe na geometria plana, onde duas retas não paralelas sempre se interceptam.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_espacial_9',
    chapter: 'Cubos e Paralelepípedos',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Qual é o volume de um cubo cuja aresta mede 5 cm?',
    options: [
      { id: 'a', text: '15 cm³' },
      { id: 'b', text: '25 cm³' },
      { id: 'c', text: '100 cm³' },
      { id: 'd', text: '125 cm³' }
    ],
    correctOptionId: 'd',
    explanation: 'O volume do cubo é dado por V = a³ = 5³ = 125 cm³.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_10',
    chapter: 'Cubos e Paralelepípedos',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um paralelepípedo retângulo tem dimensões 3 cm, 4 cm e 6 cm. Qual é seu volume?',
    options: [
      { id: 'a', text: '13 cm³' },
      { id: 'b', text: '36 cm³' },
      { id: 'c', text: '48 cm³' },
      { id: 'd', text: '72 cm³' }
    ],
    correctOptionId: 'd',
    explanation: 'O volume do paralelepípedo retângulo é o produto das três dimensões: V = 3×4×6 = 72 cm³.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_11',
    chapter: 'Prismas',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um prisma é um sólido geométrico caracterizado por:',
    options: [
      { id: 'a', text: 'Duas bases paralelas e congruentes, unidas por faces laterais planas (em geral, paralelogramos)' },
      { id: 'b', text: 'Uma única base e um vértice (ápice), com faces laterais triangulares' },
      { id: 'c', text: 'Ser sempre uma esfera perfeita' },
      { id: 'd', text: 'Não possuir nenhuma face plana' }
    ],
    correctOptionId: 'a',
    explanation: 'Um prisma é definido por duas bases paralelas e congruentes (polígonos idênticos), conectadas por faces laterais planas, geralmente paralelogramos (retângulos, no caso de prismas retos) — diferente das pirâmides, que possuem uma única base e um ápice.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_12',
    chapter: 'Prismas',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'O volume de um prisma qualquer (reto ou oblíquo) é calculado por:',
    options: [
      { id: 'a', text: 'Área da base × altura' },
      { id: 'b', text: '(Área da base × altura)/3' },
      { id: 'c', text: 'Perímetro da base × altura' },
      { id: 'd', text: 'Área da base × área lateral' }
    ],
    correctOptionId: 'a',
    explanation: 'O volume de qualquer prisma (reto ou oblíquo) é dado pelo produto da área da base pela altura (distância perpendicular entre as duas bases) — diferente das pirâmides, cujo volume tem um fator adicional de 1/3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_13',
    chapter: 'Prismas',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Um prisma reto de base triangular (área da base = 12 cm²) tem altura de 10 cm. Qual é o seu volume?',
    options: [
      { id: 'a', text: '40 cm³' },
      { id: 'b', text: '60 cm³' },
      { id: 'c', text: '120 cm³' },
      { id: 'd', text: '360 cm³' }
    ],
    correctOptionId: 'c',
    explanation: 'O volume do prisma é área da base × altura = 12 × 10 = 120 cm³.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_espacial_14',
    chapter: 'Pirâmides',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'O volume de uma pirâmide é calculado por:',
    options: [
      { id: 'a', text: 'Área da base × altura' },
      { id: 'b', text: '(Área da base × altura)/2' },
      { id: 'c', text: '(Área da base × altura)/3' },
      { id: 'd', text: '2×(Área da base × altura)' }
    ],
    correctOptionId: 'c',
    explanation: 'O volume da pirâmide é V = (área da base × altura)/3 — o fator 1/3 a diferencia do prisma de mesma base e altura, que teria o triplo do volume.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_espacial_15',
    chapter: 'Pirâmides',
    topicId: 'mat_geometria_espacial',
    subject: 'Matemática',
    prompt: 'Uma pirâmide de base quadrada (lado 6 cm) tem altura de 9 cm. Qual é o seu volume?',
    options: [
      { id: 'a', text: '54 cm³' },
      { id: 'b', text: '108 cm³' },
      { id: 'c', text: '162 cm³' },
      { id: 'd', text: '324 cm³' }
    ],
    correctOptionId: 'b',
    explanation: 'Área da base = 6² = 36 cm². Volume = (36×9)/3 = 324/3 = 108 cm³.',
    difficulty: 'medium'
  },
  // Matemática — Geometria Analítica
  {
    id: 'q_mat_geometria_analitica_1',
    chapter: 'Estudo Analítico da Reta',
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
    chapter: 'Distância entre um Ponto e uma Reta',
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
    chapter: 'Lugar Geométrico e Equação da Circunferência',
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
    chapter: 'Posições Relativas entre Duas Retas',
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
    chapter: 'Introdução à Geometria Analítica',
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
  {
    id: 'q_mat_geometria_analitica_6',
    chapter: 'Introdução à Geometria Analítica',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a distância entre os pontos A(1, 2) e B(4, 6)?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '7' }
    ],
    correctOptionId: 'c',
    explanation: 'A distância entre dois pontos é d = √[(x2-x1)² + (y2-y1)²] = √[(4-1)² + (6-2)²] = √[9+16] = √25 = 5.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_analitica_7',
    chapter: 'Lugar Geométrico e Equação da Circunferência',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'A equação (x-2)² + (y+3)² = 16 representa, no plano cartesiano, uma circunferência com:',
    options: [
      { id: 'a', text: 'Centro (2, -3) e raio 4' },
      { id: 'b', text: 'Centro (-2, 3) e raio 16' },
      { id: 'c', text: 'Centro (2, -3) e raio 16' },
      { id: 'd', text: 'Centro (-2, -3) e raio 4' }
    ],
    correctOptionId: 'a',
    explanation: 'Na equação reduzida (x-a)² + (y-b)² = r², o centro é (a, b) e o raio é r. Aqui, a = 2, b = -3 (pois y-(-3) = y+3), e r² = 16, logo r = 4.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_8',
    chapter: 'Estudo Analítico da Reta',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a equação geral da reta que passa pelos pontos A(1, 2) e B(3, 6)?',
    options: [
      { id: 'a', text: 'y = 2x' },
      { id: 'b', text: 'y = x + 1' },
      { id: 'c', text: 'y = 3x - 1' },
      { id: 'd', text: 'y = 4x - 2' }
    ],
    correctOptionId: 'a',
    explanation: 'O coeficiente angular é (6-2)/(3-1) = 4/2 = 2. Usando o ponto A: y - 2 = 2(x - 1) → y = 2x - 2 + 2 = 2x.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_9',
    chapter: 'Estudo Analítico da Reta',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'A equação geral de uma reta, ax + by + c = 0, pode ser reescrita na forma reduzida y = mx + q. Nessa conversão, o coeficiente angular m é dado por:',
    options: [
      { id: 'a', text: 'm = -a/b (com b ≠ 0)' },
      { id: 'b', text: 'm = a/c' },
      { id: 'c', text: 'm = -c/b' },
      { id: 'd', text: 'm = b/a' }
    ],
    correctOptionId: 'a',
    explanation: 'Isolando y na equação geral ax + by + c = 0: by = -ax - c → y = (-a/b)x + (-c/b). Comparando com y = mx + q, temos m = -a/b (o coeficiente angular) e q = -c/b (o coeficiente linear).',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_analitica_10',
    chapter: 'Posições Relativas entre Duas Retas',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Duas retas r e s são concorrentes quando:',
    options: [
      { id: 'a', text: 'Possuem coeficientes angulares diferentes, cruzando-se em exatamente um ponto' },
      { id: 'b', text: 'Possuem exatamente o mesmo coeficiente angular e o mesmo coeficiente linear' },
      { id: 'c', text: 'Possuem o mesmo coeficiente angular, mas coeficientes lineares diferentes' },
      { id: 'd', text: 'Nunca se interceptam em nenhum ponto' }
    ],
    correctOptionId: 'a',
    explanation: 'Duas retas são concorrentes quando têm coeficientes angulares diferentes, o que garante que elas se cruzem em exatamente um ponto — diferente de retas paralelas (mesmo coeficiente angular, coeficientes lineares diferentes) ou coincidentes (mesmo coeficiente angular e linear).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_11',
    chapter: 'Distância entre um Ponto e uma Reta',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'A fórmula para calcular a distância de um ponto P(x0, y0) até uma reta de equação geral ax + by + c = 0 é:',
    options: [
      { id: 'a', text: 'd = |ax0 + by0 + c| / √(a² + b²)' },
      { id: 'b', text: 'd = (ax0 + by0 + c) / (a + b)' },
      { id: 'c', text: 'd = a×x0 + b×y0' },
      { id: 'd', text: 'd = √(a² + b²)' }
    ],
    correctOptionId: 'a',
    explanation: 'A distância de um ponto P(x0, y0) a uma reta ax + by + c = 0 é dada por d = |ax0 + by0 + c| / √(a² + b²) — o valor absoluto no numerador garante que a distância seja sempre não negativa.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_analitica_12',
    chapter: 'Distância entre um Ponto e uma Reta',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é a distância do ponto P(0, 0) até a reta de equação 3x + 4y - 10 = 0?',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5' }
    ],
    correctOptionId: 'b',
    explanation: 'd = |3×0 + 4×0 - 10| / √(3² + 4²) = |-10| / √25 = 10/5 = 2.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_13',
    chapter: 'Posições Relativas entre uma Reta e uma Circunferência',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Uma reta é dita secante a uma circunferência quando:',
    options: [
      { id: 'a', text: 'A distância entre o centro da circunferência e a reta é menor que o raio, interceptando-a em dois pontos' },
      { id: 'b', text: 'A distância entre o centro e a reta é exatamente igual ao raio' },
      { id: 'c', text: 'A distância entre o centro e a reta é maior que o raio' },
      { id: 'd', text: 'A reta passa exatamente pelo centro da circunferência, sempre' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma reta secante intercepta a circunferência em exatamente dois pontos, o que ocorre quando a distância do centro da circunferência até a reta é menor que o raio. Se a distância for igual ao raio, a reta é tangente (um único ponto de interseção); se for maior, a reta é externa (nenhum ponto de interseção).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_14',
    chapter: 'Posições Relativas entre uma Reta e uma Circunferência',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Uma reta é tangente a uma circunferência quando a distância entre o centro da circunferência e a reta é:',
    options: [
      { id: 'a', text: 'Menor que o raio' },
      { id: 'b', text: 'Exatamente igual ao raio' },
      { id: 'c', text: 'Maior que o raio' },
      { id: 'd', text: 'Igual ao diâmetro' }
    ],
    correctOptionId: 'b',
    explanation: 'A reta tangente toca a circunferência em exatamente um único ponto, o que ocorre precisamente quando a distância do centro até a reta é igual ao raio — nesse caso a reta é perpendicular ao raio no ponto de tangência.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_15',
    chapter: 'Posições Relativas entre uma Reta e uma Circunferência',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Uma circunferência tem centro (0,0) e raio 5. A reta x = 8 (vertical) é, em relação a essa circunferência:',
    options: [
      { id: 'a', text: 'Secante, cruzando-a em dois pontos' },
      { id: 'b', text: 'Tangente, tocando-a em um único ponto' },
      { id: 'c', text: 'Externa, sem nenhum ponto de interseção' },
      { id: 'd', text: 'Coincidente com a própria circunferência' }
    ],
    correctOptionId: 'c',
    explanation: 'A distância do centro (0,0) até a reta vertical x = 8 é 8, que é maior que o raio 5. Como a distância é maior que o raio, a reta é externa à circunferência, sem nenhum ponto de interseção.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_16',
    chapter: 'Introdução ao Estudo Analítico das Cônicas',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'As cônicas (elipse, parábola, hipérbole e circunferência) recebem esse nome porque:',
    options: [
      { id: 'a', text: 'São todas obtidas pela interseção de um plano com um cone duplo, variando o ângulo de corte' },
      { id: 'b', text: 'São figuras exclusivamente tridimensionais, sem representação no plano' },
      { id: 'c', text: 'Foram descobertas por um matemático de sobrenome "Cônico"' },
      { id: 'd', text: 'Só existem no espaço, nunca no plano cartesiano' }
    ],
    correctOptionId: 'a',
    explanation: 'As cônicas recebem esse nome porque cada uma delas (circunferência, elipse, parábola, hipérbole) pode ser obtida geometricamente como a curva de interseção entre um plano e um cone duplo, variando o ângulo de inclinação do plano em relação ao eixo do cone.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_17',
    chapter: 'Introdução ao Estudo Analítico das Cônicas',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Uma elipse é definida como o lugar geométrico dos pontos do plano cuja:',
    options: [
      { id: 'a', text: 'Soma das distâncias a dois pontos fixos (focos) é constante' },
      { id: 'b', text: 'Diferença das distâncias a dois pontos fixos é constante' },
      { id: 'c', text: 'Distância a um único ponto fixo é sempre a mesma' },
      { id: 'd', text: 'Distância a uma reta fixa e a um ponto fixo são sempre iguais' }
    ],
    correctOptionId: 'a',
    explanation: 'A elipse é definida como o lugar geométrico dos pontos cuja soma das distâncias a dois pontos fixos (os focos) é constante — diferente da hipérbole (diferença constante), da circunferência (distância a um único ponto fixo) e da parábola (distância a um ponto e a uma reta fixos, sempre iguais).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_18',
    chapter: 'Introdução ao Estudo Analítico das Cônicas',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Uma parábola é definida como o lugar geométrico dos pontos do plano equidistantes de:',
    options: [
      { id: 'a', text: 'Dois pontos fixos (os focos)' },
      { id: 'b', text: 'Um ponto fixo (o foco) e uma reta fixa (a diretriz)' },
      { id: 'c', text: 'Duas retas fixas paralelas entre si' },
      { id: 'd', text: 'Um único ponto fixo (o centro), sempre' }
    ],
    correctOptionId: 'b',
    explanation: 'A parábola é definida como o lugar geométrico dos pontos equidistantes de um ponto fixo, chamado foco, e de uma reta fixa, chamada diretriz — cada ponto da parábola tem exatamente a mesma distância até o foco e até a diretriz.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_19',
    chapter: 'Representação Geométrica de Inequações',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'A inequação y > 2x + 1 representa, no plano cartesiano, geometricamente:',
    options: [
      { id: 'a', text: 'Toda a região do plano acima da reta y = 2x + 1 (excluindo a própria reta)' },
      { id: 'b', text: 'Apenas a reta y = 2x + 1' },
      { id: 'c', text: 'Toda a região abaixo da reta y = 2x + 1' },
      { id: 'd', text: 'Um único ponto do plano' }
    ],
    correctOptionId: 'a',
    explanation: 'A inequação y > 2x + 1 representa o semiplano acima da reta y = 2x + 1 (sem incluir a própria reta, já que a desigualdade é estrita) — todos os pontos cuja coordenada y é maior que o valor correspondente na reta.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_20',
    chapter: 'Representação Geométrica de Inequações',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'A inequação x² + y² ≤ 9 representa, no plano cartesiano, geometricamente:',
    options: [
      { id: 'a', text: 'Apenas os pontos da circunferência de centro (0,0) e raio 3' },
      { id: 'b', text: 'Todos os pontos internos e sobre a circunferência de centro (0,0) e raio 3 (o disco fechado)' },
      { id: 'c', text: 'Todos os pontos externos à circunferência de centro (0,0) e raio 3' },
      { id: 'd', text: 'Uma reta, não uma região' }
    ],
    correctOptionId: 'b',
    explanation: 'A equação x² + y² = 9 representa a circunferência de centro (0,0) e raio 3 (já que r² = 9). A inequação x² + y² ≤ 9 inclui essa circunferência e também todos os pontos internos a ela (mais próximos da origem), formando o disco fechado.',
    difficulty: 'hard'
  },
  {
    id: 'q_mat_geometria_analitica_21',
    chapter: 'Representação Geométrica de Inequações',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Um sistema de inequações no plano cartesiano, com duas ou mais inequações combinadas, representa geometricamente:',
    options: [
      { id: 'a', text: 'A união de todas as regiões definidas por cada inequação, separadamente' },
      { id: 'b', text: 'A interseção das regiões definidas por cada inequação — apenas os pontos que satisfazem todas simultaneamente' },
      { id: 'c', text: 'Sempre o plano inteiro, sem exceção' },
      { id: 'd', text: 'Nunca uma região, apenas pontos isolados' }
    ],
    correctOptionId: 'b',
    explanation: 'A solução de um sistema de inequações é a interseção das regiões definidas por cada inequação individual — ou seja, apenas os pontos do plano que satisfazem todas as inequações do sistema simultaneamente, formando geralmente uma região poligonal (usada, por exemplo, em problemas de programação linear).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_22',
    chapter: 'A Geometria dos Números Complexos',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'No plano de Argand-Gauss, um número complexo z = a + bi é representado como o ponto:',
    options: [
      { id: 'a', text: '(a, b), onde a é a coordenada no eixo real e b no eixo imaginário' },
      { id: 'b', text: '(b, a), invertendo a ordem' },
      { id: 'c', text: 'Apenas o valor de a, ignorando a parte imaginária' },
      { id: 'd', text: 'Um ponto fora do plano cartesiano, em um espaço à parte' }
    ],
    correctOptionId: 'a',
    explanation: 'No plano de Argand-Gauss (plano complexo), o número complexo z = a + bi é representado pelo ponto de coordenadas (a, b): a parte real (a) no eixo horizontal (eixo real) e a parte imaginária (b) no eixo vertical (eixo imaginário).',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_geometria_analitica_23',
    chapter: 'A Geometria dos Números Complexos',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'O módulo de um número complexo z = a + bi, geometricamente, representa:',
    options: [
      { id: 'a', text: 'A distância do ponto (a, b) até a origem do plano complexo' },
      { id: 'b', text: 'O ângulo formado entre o eixo real e o segmento que liga a origem ao ponto' },
      { id: 'c', text: 'Apenas o valor de a, ignorando b' },
      { id: 'd', text: 'Sempre um número negativo' }
    ],
    correctOptionId: 'a',
    explanation: 'O módulo de z = a + bi, calculado como |z| = √(a² + b²), representa geometricamente a distância entre o ponto (a, b), que representa z no plano complexo, e a origem (0, 0) — análogo ao cálculo da distância entre dois pontos na geometria analítica.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_geometria_analitica_24',
    chapter: 'A Geometria dos Números Complexos',
    topicId: 'mat_geometria_analitica',
    subject: 'Matemática',
    prompt: 'Qual é o módulo do número complexo z = 3 + 4i?',
    options: [
      { id: 'a', text: '3' },
      { id: 'b', text: '4' },
      { id: 'c', text: '5' },
      { id: 'd', text: '7' }
    ],
    correctOptionId: 'c',
    explanation: '|z| = √(3² + 4²) = √(9+16) = √25 = 5.',
    difficulty: 'easy'
  },
  // Matemática — Equações, Desigualdades e Modelagem Algébrica
  {
    id: 'q_mat_equacoes_1',
    chapter: 'Modelagem Algébrica de Problemas I',
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
    chapter: 'Desigualdades',
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
    chapter: 'Modelagem Algébrica de Problemas II',
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
    chapter: 'Desigualdades',
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
    chapter: 'Técnicas Algébricas',
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
  {
    id: 'q_mat_equacoes_6',
    chapter: 'Igualdades',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Uma igualdade matemática que é verdadeira para todos os valores possíveis das variáveis envolvidas é chamada de:',
    options: [
      { id: 'a', text: 'Equação' },
      { id: 'b', text: 'Identidade' },
      { id: 'c', text: 'Inequação' },
      { id: 'd', text: 'Função' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma identidade é uma igualdade válida para todos os valores possíveis das variáveis (por exemplo, (a+b)² = a² + 2ab + b²), diferente de uma equação, que só é verdadeira para valores específicos das incógnitas (suas soluções ou raízes).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_7',
    chapter: 'Igualdades',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Ao resolver uma equação, uma das propriedades fundamentais da igualdade permite que:',
    options: [
      { id: 'a', text: 'Somando (ou subtraindo) o mesmo valor a ambos os lados da equação, a igualdade se mantém' },
      { id: 'b', text: 'Somando um valor apenas a um dos lados, a igualdade se mantém' },
      { id: 'c', text: 'Multiplicando apenas um lado por zero, a igualdade se mantém' },
      { id: 'd', text: 'Elevar apenas um dos lados ao quadrado sempre preserva a igualdade' }
    ],
    correctOptionId: 'a',
    explanation: 'Uma propriedade fundamental da igualdade é que somar (ou subtrair) o mesmo valor a ambos os lados de uma equação preserva a igualdade — a base de praticamente toda manipulação algébrica usada para isolar a incógnita e resolver equações.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_equacoes_8',
    chapter: 'Igualdades',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Ao elevar ambos os lados de uma equação ao quadrado (uma técnica comum para resolver equações irracionais), é necessário depois:',
    options: [
      { id: 'a', text: 'Verificar as soluções obtidas na equação original, pois esse processo pode introduzir soluções estranhas (que não satisfazem a equação original)' },
      { id: 'b', text: 'Assumir automaticamente que todas as soluções obtidas são válidas, sem qualquer verificação' },
      { id: 'c', text: 'Dividir o resultado final por dois, sempre' },
      { id: 'd', text: 'Ignorar completamente o resultado obtido' }
    ],
    correctOptionId: 'a',
    explanation: 'Elevar ao quadrado ambos os lados de uma equação não é uma operação reversível de forma direta: pode introduzir soluções estranhas, que satisfazem a equação elevada ao quadrado mas não a equação original. Por isso, é essencial verificar cada solução obtida na equação original antes de aceitá-la como válida.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_9',
    chapter: 'Desigualdades',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Ao multiplicar ou dividir ambos os lados de uma desigualdade por um número negativo, é necessário:',
    options: [
      { id: 'a', text: 'Inverter o sentido da desigualdade' },
      { id: 'b', text: 'Manter o sentido da desigualdade inalterado' },
      { id: 'c', text: 'Transformar a desigualdade em uma igualdade' },
      { id: 'd', text: 'Somar 1 a ambos os lados, além da multiplicação' }
    ],
    correctOptionId: 'a',
    explanation: 'Ao multiplicar ou dividir uma desigualdade por um número negativo, o sentido da desigualdade deve ser invertido (por exemplo, se a < b, então -a > -b) — um erro comum é esquecer essa inversão ao resolver inequações.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_10',
    chapter: 'Modelagem Algébrica de Problemas I',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'A idade de Pedro é o dobro da idade de sua irmã Ana. Juntos, eles têm 36 anos. Qual é a idade de Ana?',
    options: [
      { id: 'a', text: '10 anos' },
      { id: 'b', text: '12 anos' },
      { id: 'c', text: '18 anos' },
      { id: 'd', text: '24 anos' }
    ],
    correctOptionId: 'b',
    explanation: 'Se a idade de Ana é x, a de Pedro é 2x. Juntos: x + 2x = 36 → 3x = 36 → x = 12 anos (Ana) e 24 anos (Pedro).',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_equacoes_11',
    chapter: 'Modelagem Algébrica de Problemas I',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Um número somado ao seu triplo resulta em 48. Qual é esse número?',
    options: [
      { id: 'a', text: '10' },
      { id: 'b', text: '12' },
      { id: 'c', text: '14' },
      { id: 'd', text: '16' }
    ],
    correctOptionId: 'b',
    explanation: 'Se o número é x, a equação é x + 3x = 48 → 4x = 48 → x = 12.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_equacoes_12',
    chapter: 'Equações do 2º Grau',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Usando a fórmula de Bhaskara, quais são as raízes da equação x² - 5x + 6 = 0?',
    options: [
      { id: 'a', text: 'x = 1 e x = 6' },
      { id: 'b', text: 'x = 2 e x = 3' },
      { id: 'c', text: 'x = -2 e x = -3' },
      { id: 'd', text: 'x = 5 e x = 6' }
    ],
    correctOptionId: 'b',
    explanation: 'Δ = (-5)² - 4×1×6 = 25 - 24 = 1. x = (5 ± √1)/2 = (5±1)/2, resultando em x = 3 ou x = 2.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_13',
    chapter: 'Equações do 2º Grau',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Na equação do 2º grau ax² + bx + c = 0, quando o discriminante Δ = b² - 4ac é negativo, isso significa que a equação:',
    options: [
      { id: 'a', text: 'Possui duas raízes reais e distintas' },
      { id: 'b', text: 'Possui exatamente uma raiz real (raiz dupla)' },
      { id: 'c', text: 'Não possui nenhuma raiz real (as raízes são números complexos não reais)' },
      { id: 'd', text: 'Possui infinitas raízes reais' }
    ],
    correctOptionId: 'c',
    explanation: 'Quando Δ < 0, a raiz quadrada de Δ na fórmula de Bhaskara envolve um número negativo, o que não tem solução dentro dos números reais — a equação não possui raízes reais, apenas raízes complexas (não reais). Se Δ = 0, há uma raiz dupla; se Δ > 0, há duas raízes reais distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_14',
    chapter: 'Modelagem Algébrica de Problemas II',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Um retângulo tem perímetro de 28 cm e o comprimento é 4 cm maior que a largura. Quais são as dimensões desse retângulo?',
    options: [
      { id: 'a', text: 'Largura 5 cm e comprimento 9 cm' },
      { id: 'b', text: 'Largura 6 cm e comprimento 10 cm' },
      { id: 'c', text: 'Largura 4 cm e comprimento 8 cm' },
      { id: 'd', text: 'Largura 7 cm e comprimento 11 cm' }
    ],
    correctOptionId: 'a',
    explanation: 'Se a largura é x, o comprimento é x+4. O perímetro é 2(x + x+4) = 28 → 2(2x+4) = 28 → 4x+8=28 → 4x=20 → x=5 (largura) e x+4=9 (comprimento).',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_equacoes_15',
    chapter: 'Técnicas Algébricas',
    topicId: 'mat_equacoes',
    subject: 'Matemática',
    prompt: 'Fatorando a expressão x² - 9, obtemos:',
    options: [
      { id: 'a', text: '(x - 3)(x - 3)' },
      { id: 'b', text: '(x + 3)(x - 3)' },
      { id: 'c', text: '(x + 9)(x - 1)' },
      { id: 'd', text: 'Não é possível fatorar essa expressão' }
    ],
    correctOptionId: 'b',
    explanation: 'A expressão x² - 9 é uma diferença de quadrados (x² - 3²), que se fatora pela regra a² - b² = (a+b)(a-b): x² - 9 = (x+3)(x-3).',
    difficulty: 'medium'
  },
  // Matemática — Logaritmos e Exponenciais
  {
    id: 'q_mat_log_exponenciais_1',
    chapter: 'Introdução aos Logaritmos',
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
    chapter: 'Introdução ao Modelo Exponencial',
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
    chapter: 'Equações e Funções Logarítmicas',
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
    chapter: 'Modelagem Exponencial de Problemas',
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
    chapter: 'Introdução aos Logaritmos',
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
  {
    id: 'q_mat_log_exponenciais_6',
    chapter: 'Introdução ao Modelo Exponencial',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Uma função exponencial f(x) = a×bˣ (com b > 1) é caracterizada por:',
    options: [
      { id: 'a', text: 'Crescimento cada vez mais lento à medida que x aumenta' },
      { id: 'b', text: 'Crescimento cada vez mais rápido à medida que x aumenta (a variável está no expoente)' },
      { id: 'c', text: 'Um valor constante, independente de x' },
      { id: 'd', text: 'Decrescimento constante, sempre' }
    ],
    correctOptionId: 'b',
    explanation: 'Na função exponencial com base b > 1, o crescimento se acelera cada vez mais à medida que x aumenta, já que a variável está no expoente — diferente do crescimento linear (constante) ou polinomial, que crescem de forma mais previsível e gradual.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_7',
    chapter: 'Introdução ao Modelo Exponencial',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Uma população de bactérias dobra a cada hora, começando com 100 indivíduos. Quantas bactérias existirão após 3 horas?',
    options: [
      { id: 'a', text: '300' },
      { id: 'b', text: '400' },
      { id: 'c', text: '600' },
      { id: 'd', text: '800' }
    ],
    correctOptionId: 'd',
    explanation: 'O modelo é P(t) = 100×2ᵗ. Após 3 horas: P(3) = 100×2³ = 100×8 = 800 bactérias.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_8',
    chapter: 'Equações e Funções Logarítmicas',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Para que log_b(x) esteja definido, é necessário que:',
    options: [
      { id: 'a', text: 'A base b seja positiva, diferente de 1, e o logaritmando x seja positivo' },
      { id: 'b', text: 'A base b possa ser qualquer número real, inclusive negativo' },
      { id: 'c', text: 'O logaritmando x possa ser negativo ou zero, sem restrição' },
      { id: 'd', text: 'A base b seja sempre igual a 1' }
    ],
    correctOptionId: 'a',
    explanation: 'Para que o logaritmo log_b(x) esteja definido no conjunto dos números reais, a base b deve ser positiva e diferente de 1 (b > 0, b ≠ 1), e o logaritmando x deve ser estritamente positivo (x > 0) — essas condições de existência devem sempre ser verificadas.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_9',
    chapter: 'Modelagem Exponencial de Problemas',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'Um material radioativo tem meia-vida de 10 anos (a cada 10 anos, a quantidade se reduz à metade). Partindo de 80 g, quantos gramas restarão após 30 anos?',
    options: [
      { id: 'a', text: '5 g' },
      { id: 'b', text: '10 g' },
      { id: 'c', text: '20 g' },
      { id: 'd', text: '40 g' }
    ],
    correctOptionId: 'b',
    explanation: 'Em 30 anos, ocorrem 3 períodos de meia-vida (30/10 = 3). A cada período, a quantidade se reduz à metade: 80 → 40 → 20 → 10 g.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_log_exponenciais_10',
    chapter: 'Modelagem Exponencial de Problemas',
    topicId: 'mat_log_exponenciais',
    subject: 'Matemática',
    prompt: 'A escala Richter, usada para medir a magnitude de terremotos, é uma escala logarítmica. Isso significa que um terremoto de magnitude 6 libera, em termos de energia, aproximadamente quantas vezes mais energia que um de magnitude 5?',
    options: [
      { id: 'a', text: 'O dobro' },
      { id: 'b', text: 'Aproximadamente 10 vezes mais' },
      { id: 'c', text: 'Aproximadamente 32 vezes mais' },
      { id: 'd', text: 'A mesma quantidade de energia' }
    ],
    correctOptionId: 'c',
    explanation: 'Na escala Richter, cada aumento de uma unidade corresponde a um aumento de aproximadamente 10 vezes na amplitude das ondas sísmicas, mas de aproximadamente 31,6 vezes na energia liberada — uma consequência direta da natureza logarítmica da escala, em que pequenas diferenças numéricas escondem diferenças enormes na grandeza real medida.',
    difficulty: 'hard'
  },
  // Matemática — Números Complexos e Polinômios
  {
    id: 'q_mat_complexos_polinomios_1',
    chapter: 'Números Complexos',
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
    chapter: 'Números Complexos',
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
    chapter: 'Equações Polinomiais',
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
    chapter: 'Números Complexos',
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
    chapter: 'Equações Polinomiais',
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
  {
    id: 'q_mat_complexos_polinomios_6',
    chapter: 'Módulo de um Número Real',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'O módulo (ou valor absoluto) de um número real x, representado por |x|, é definido como:',
    options: [
      { id: 'a', text: 'x, se x ≥ 0, e -x, se x < 0 — sempre um valor não negativo' },
      { id: 'b', text: 'Sempre igual a x, mesmo quando x é negativo' },
      { id: 'c', text: 'Sempre um número negativo' },
      { id: 'd', text: 'x², para qualquer valor de x' }
    ],
    correctOptionId: 'a',
    explanation: 'O módulo de um número real x é definido por partes: |x| = x quando x ≥ 0, e |x| = -x quando x < 0 (o que resulta em um valor positivo, já que -x é positivo quando x é negativo) — o módulo representa a distância de x até zero na reta real, sempre não negativa.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_complexos_polinomios_7',
    chapter: 'Módulo de um Número Real',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Qual é o valor de |-7| + |3|?',
    options: [
      { id: 'a', text: '-4' },
      { id: 'b', text: '4' },
      { id: 'c', text: '10' },
      { id: 'd', text: '-10' }
    ],
    correctOptionId: 'c',
    explanation: '|-7| = 7 e |3| = 3. Somando: 7 + 3 = 10.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_complexos_polinomios_8',
    chapter: 'Módulo de um Número Real',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Quantas soluções reais tem a equação |x + 1| = 4?',
    options: [
      { id: 'a', text: 'Nenhuma' },
      { id: 'b', text: 'Uma' },
      { id: 'c', text: 'Duas' },
      { id: 'd', text: 'Infinitas' }
    ],
    correctOptionId: 'c',
    explanation: 'A equação modular se desdobra em dois casos: x+1 = 4 (x = 3) ou x+1 = -4 (x = -5). Ambos são soluções válidas, logo há duas soluções reais.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_complexos_polinomios_9',
    chapter: 'Polinômios',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'O grau de um polinômio é determinado por:',
    options: [
      { id: 'a', text: 'O maior expoente da variável presente no polinômio, com coeficiente não nulo' },
      { id: 'b', text: 'O número total de termos do polinômio' },
      { id: 'c', text: 'A soma de todos os coeficientes' },
      { id: 'd', text: 'O menor expoente da variável presente no polinômio' }
    ],
    correctOptionId: 'a',
    explanation: 'O grau de um polinômio é dado pelo maior expoente da variável que aparece com coeficiente não nulo. Por exemplo, no polinômio 3x⁴ - 2x² + 5, o grau é 4, já que esse é o maior expoente com coeficiente diferente de zero.',
    difficulty: 'easy'
  },
  {
    id: 'q_mat_complexos_polinomios_10',
    chapter: 'Polinômios',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'Dividindo o polinômio P(x) = x² - 5x + 6 por (x - 2), qual é o quociente?',
    options: [
      { id: 'a', text: 'x - 3' },
      { id: 'b', text: 'x + 3' },
      { id: 'c', text: 'x - 2' },
      { id: 'd', text: 'x + 2' }
    ],
    correctOptionId: 'a',
    explanation: 'Como x=2 é raiz de P(x) (2² - 5×2 + 6 = 4-10+6 = 0), a divisão é exata. Fatorando: x² - 5x + 6 = (x-2)(x-3), logo o quociente é x-3.',
    difficulty: 'medium'
  },
  {
    id: 'q_mat_complexos_polinomios_11',
    chapter: 'Polinômios',
    topicId: 'mat_complexos_polinomios',
    subject: 'Matemática',
    prompt: 'O Teorema do Resto afirma que o resto da divisão de um polinômio P(x) por (x - a) é igual a:',
    options: [
      { id: 'a', text: 'P(a), o valor do polinômio calculado em x = a' },
      { id: 'b', text: 'Sempre zero, para qualquer polinômio' },
      { id: 'c', text: 'O grau do polinômio P(x)' },
      { id: 'd', text: 'A soma dos coeficientes de P(x)' }
    ],
    correctOptionId: 'a',
    explanation: 'O Teorema do Resto estabelece que, ao dividir um polinômio P(x) por (x - a), o resto dessa divisão é exatamente P(a) — o valor do polinômio calculado substituindo x por a. Se P(a) = 0, então (x-a) é um fator de P(x) (Teorema de D\'Alembert), e a divisão é exata.',
    difficulty: 'medium'
  },
  // Geografia — Cartografia e Fundamentos
  {
    id: 'q_geo_cartografia_1',
    chapter: 'Linguagem Cartográfica',
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
    chapter: 'Projeções Cartográficas',
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
    chapter: 'Representações Gráficas e Cartográficas',
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
    chapter: 'Cartografia Digital',
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
    chapter: 'Projeções Cartográficas',
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
    chapter: 'Desafios Ambientais do Século XXI',
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
    chapter: 'Desafios Ambientais do Século XXI',
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
    chapter: 'Desafios Ambientais do Século XXI',
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
    chapter: 'Dinâmica Climática',
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
    chapter: 'Desafios Ambientais do Século XXI',
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
    chapter: 'Hidrogeografia Mundial',
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
    chapter: 'Hidrogeografia Mundial',
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
    chapter: 'Hidrogeografia Mundial',
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
    chapter: 'Hidrogeografia Mundial',
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
    chapter: 'Hidrogeografia Mundial',
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
    chapter: 'Globalização e Processos Econômicos Atuais',
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
    chapter: 'Blocos Econômicos',
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
    chapter: 'Globalização e Processos Econômicos Atuais',
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
    chapter: 'Globalização e Processos Econômicos Atuais',
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
    chapter: 'Desigualdades Globais',
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
    chapter: 'Geografia do Oriente Médio',
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
    chapter: 'Tensões Geopolíticas na Europa',
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
    chapter: 'Tensões Geopolíticas na Europa',
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
    chapter: 'Geopolítica e Geoeconomia da Ásia',
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
    chapter: 'Biogeografia do Brasil I',
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
    chapter: 'Relevo Brasileiro',
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
    chapter: 'Climatologia do Brasil',
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
    chapter: 'Biogeografia do Brasil I',
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
    chapter: 'Políticas Ambientais Brasileiras',
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
    chapter: 'O Espaço Agrário Brasileiro',
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
    chapter: 'O Espaço Industrial Brasileiro I',
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
    chapter: 'O Espaço Industrial Brasileiro II',
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
    chapter: 'Energia Elétrica no Brasil',
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
    chapter: 'O Espaço Agrário Brasileiro',
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
    chapter: 'O Espaço Urbano I',
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
    chapter: 'Dinâmica Demográfica',
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
    chapter: 'O Espaço Urbano II',
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
    chapter: 'O Espaço Urbano II',
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
    chapter: 'Estrutura Étnica e Fluxos Migratórios',
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
    chapter: 'Antiguidade Clássica: o Mundo Grego',
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
    chapter: 'Antiguidade Clássica: o Mundo Romano',
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
  {
    id: 'q_his_idade_antiga_3',
    chapter: 'Introdução à História e Primeiras Civilizações',
    topicId: 'his_idade_antiga',
    subject: 'História',
    prompt: 'O Código de Hamurábi, um dos conjuntos de leis mais antigos conhecidos, elaborado na Babilônia antiga, é historicamente relevante principalmente por:',
    options: [
      { id: 'a', text: 'Ser o primeiro documento escrito da história da humanidade, sem qualquer relação com leis' },
      { id: 'b', text: 'Representar uma das primeiras tentativas conhecidas de sistematizar e tornar públicas normas jurídicas, com penas frequentemente baseadas no princípio de "olho por olho"' },
      { id: 'c', text: 'Ter sido escrito em papel, antecipando a invenção do papiro egípcio' },
      { id: 'd', text: 'Não ter qualquer relação com organização social ou jurídica' }
    ],
    correctOptionId: 'b',
    explanation: 'O Código de Hamurábi, gravado em uma estela de pedra na Babilônia (cerca de 1750 a.C.), reúne leis que regulavam diversos aspectos da vida social, comercial e familiar, com penas frequentemente baseadas no princípio de reciprocidade ("olho por olho, dente por dente") — sendo um marco na história do direito escrito.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_idade_antiga_4',
    chapter: 'Introdução à História e Primeiras Civilizações',
    topicId: 'his_idade_antiga',
    subject: 'História',
    prompt: 'A civilização egípcia antiga, desenvolvida ao longo do rio Nilo, teve sua organização social e econômica fortemente marcada por:',
    options: [
      { id: 'a', text: 'A total independência em relação ao regime de cheias do Nilo' },
      { id: 'b', text: 'A dependência das cheias periódicas do Nilo para a agricultura, além de uma estrutura social hierarquizada, com o faraó no topo, considerado uma figura de poder político e religioso' },
      { id: 'c', text: 'A ausência completa de qualquer forma de governo centralizado' },
      { id: 'd', text: 'Uma economia baseada exclusivamente no comércio marítimo de longa distância' }
    ],
    correctOptionId: 'b',
    explanation: 'O Egito Antigo dependia diretamente das cheias periódicas do rio Nilo para fertilizar as terras e viabilizar a agricultura, base de sua economia. A sociedade era hierarquizada, com o faraó ocupando o topo, considerado um governante com autoridade tanto política quanto religiosa (frequentemente associado a divindades).',
    difficulty: 'easy'
  },
  {
    id: 'q_his_idade_antiga_5',
    chapter: 'Antiguidade Clássica: o Mundo Romano',
    topicId: 'his_idade_antiga',
    subject: 'História',
    prompt: 'A expansão do Império Romano e sua posterior fragmentação (queda do Império Romano do Ocidente, em 476 d.C.) marcaram uma transição histórica importante porque:',
    options: [
      { id: 'a', text: 'Não trouxeram nenhuma mudança significativa para a organização política e social da Europa' },
      { id: 'b', text: 'Encerraram, para a maior parte da historiografia ocidental, o período da Idade Antiga, abrindo caminho para a fragmentação política que caracterizaria a Idade Média' },
      { id: 'c', text: 'Resultaram na unificação política imediata de toda a Europa sob um único governo' },
      { id: 'd', text: 'Ocorreram sem qualquer relação com invasões de povos externos ao império' }
    ],
    correctOptionId: 'b',
    explanation: 'A queda do Império Romano do Ocidente, em 476 d.C., é tradicionalmente usada pela historiografia ocidental como marco do fim da Idade Antiga e início da Idade Média — um período marcado pela fragmentação política em reinos menores, muitas vezes associada às invasões de povos germânicos sobre o território romano.',
    difficulty: 'medium'
  },
  // História — Idade Média
  {
    id: 'q_his_idade_media_1',
    chapter: 'Alta Idade Média e Feudalismo',
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
    chapter: 'Alta Idade Média e Feudalismo',
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
  {
    id: 'q_his_idade_media_3',
    chapter: 'Alta Idade Média e Feudalismo',
    topicId: 'his_idade_media',
    subject: 'História',
    prompt: 'A Igreja Católica, durante a Idade Média europeia, exerceu um papel de grande influência na sociedade principalmente porque:',
    options: [
      { id: 'a', text: 'Estava completamente separada de qualquer assunto político ou econômico, restrita apenas a questões espirituais' },
      { id: 'b', text: 'Concentrava enorme poder político, econômico (com vastas propriedades de terra) e ideológico, influenciando desde a legitimação dos governantes até a vida cotidiana da população' },
      { id: 'c', text: 'Não possuía qualquer propriedade de terra' },
      { id: 'd', text: 'Era subordinada em todas as decisões aos reis e à nobreza local' }
    ],
    correctOptionId: 'b',
    explanation: 'Na Europa medieval, a Igreja Católica acumulava grande poder político (legitimando reis, influenciando decisões), econômico (era uma das maiores proprietárias de terras, cobrando o dízimo) e ideológico (controlando a educação e a interpretação religiosa da vida cotidiana), tornando-se uma das instituições centrais da sociedade feudal.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_idade_media_4',
    chapter: 'Baixa Idade Média',
    topicId: 'his_idade_media',
    subject: 'História',
    prompt: 'A Peste Negra, epidemia que assolou a Europa no século XIV, teve entre suas consequências históricas mais relevantes:',
    options: [
      { id: 'a', text: 'Uma redução populacional tão drástica que contribuiu para o enfraquecimento do sistema feudal, ao alterar a relação entre oferta de mão de obra e demanda por trabalhadores' },
      { id: 'b', text: 'Nenhum impacto significativo na estrutura social ou econômica europeia' },
      { id: 'c', text: 'O fortalecimento imediato e definitivo do sistema feudal' },
      { id: 'd', text: 'A eliminação completa do comércio entre as cidades europeias' }
    ],
    correctOptionId: 'a',
    explanation: 'A Peste Negra dizimou uma parcela expressiva da população europeia (estima-se que entre um terço e metade em algumas regiões), reduzindo drasticamente a mão de obra disponível. Essa escassez de trabalhadores aumentou seu poder de barganha frente aos senhores feudais, contribuindo, entre outros fatores, para o enfraquecimento gradual do sistema feudal nos séculos seguintes.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_idade_media_5',
    chapter: 'Baixa Idade Média',
    topicId: 'his_idade_media',
    subject: 'História',
    prompt: 'O ressurgimento do comércio e das cidades (burgos) na Baixa Idade Média está associado ao surgimento de um novo grupo social, a burguesia, cuja principal característica inicial era:',
    options: [
      { id: 'a', text: 'Ser formada por nobres proprietários de grandes extensões de terra' },
      { id: 'b', text: 'Ser formada por comerciantes e artesãos urbanos, cuja riqueza vinha do comércio e do trabalho manufatureiro, e não da posse de terras' },
      { id: 'c', text: 'Ser composta exclusivamente por membros do clero' },
      { id: 'd', text: 'Não ter qualquer papel econômico relevante na sociedade medieval' }
    ],
    correctOptionId: 'b',
    explanation: 'A burguesia medieval surgiu nas cidades (burgos) em ressurgimento, formada principalmente por comerciantes e artesãos cuja riqueza vinha da atividade comercial e manufatureira urbana — uma fonte de riqueza diferente da posse de terras, que sustentava o poder da nobreza feudal, e que gradualmente ganharia importância crescente na sociedade europeia.',
    difficulty: 'medium'
  },
  // História — Idade Moderna e Iluminismo
  {
    id: 'q_his_moderna_iluminismo_1',
    chapter: 'Iluminismo',
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
    chapter: 'Revolução Francesa',
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
  {
    id: 'q_his_moderna_iluminismo_3',
    chapter: 'Absolutismo',
    topicId: 'his_moderna_iluminismo',
    subject: 'História',
    prompt: 'O Absolutismo monárquico, sistema político predominante em boa parte da Europa entre os séculos XVI e XVIII, se caracterizava por:',
    options: [
      { id: 'a', text: 'A concentração do poder político nas mãos do rei, frequentemente justificada pela teoria do direito divino dos reis, com pouca ou nenhuma divisão de poderes' },
      { id: 'b', text: 'A divisão equilibrada de poderes entre Executivo, Legislativo e Judiciário' },
      { id: 'c', text: 'A eliminação total da nobreza como grupo social' },
      { id: 'd', text: 'A adoção de eleições diretas para escolha do monarca' }
    ],
    correctOptionId: 'a',
    explanation: 'O Absolutismo concentrava o poder político no monarca, frequentemente legitimado pela ideia do direito divino dos reis (o poder do rei viria diretamente de Deus), sem a divisão de poderes que caracterizaria sistemas políticos posteriores — um sistema que os pensadores iluministas viriam a criticar duramente.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_moderna_iluminismo_4',
    chapter: 'Vida Urbana e Renascimento Cultural',
    topicId: 'his_moderna_iluminismo',
    subject: 'História',
    prompt: 'A Revolução Científica, ocorrida entre os séculos XVI e XVII (com figuras como Galileu, Copérnico e Newton), contribuiu para o pensamento iluminista posterior principalmente ao:',
    options: [
      { id: 'a', text: 'Reforçar a ideia de que o conhecimento deveria se basear exclusivamente na autoridade religiosa tradicional' },
      { id: 'b', text: 'Estabelecer o método científico e a observação empírica como formas privilegiadas de compreender a natureza, influenciando a valorização iluminista da razão como ferramenta de conhecimento' },
      { id: 'c', text: 'Não ter qualquer relação com o desenvolvimento do pensamento europeu posterior' },
      { id: 'd', text: 'Consolidar definitivamente o modelo geocêntrico do universo' }
    ],
    correctOptionId: 'b',
    explanation: 'A Revolução Científica consolidou o método científico (observação, experimentação, formulação de leis matemáticas) como forma privilegiada de compreender a natureza, desafiando explicações baseadas exclusivamente na autoridade religiosa ou na tradição — um espírito que influenciou diretamente a valorização iluminista da razão como principal instrumento de conhecimento.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_moderna_iluminismo_5',
    chapter: 'América no Século XIX',
    topicId: 'his_moderna_iluminismo',
    subject: 'História',
    prompt: 'A Independência dos Estados Unidos (1776) é frequentemente citada como uma das primeiras aplicações práticas de ideais iluministas porque:',
    options: [
      { id: 'a', text: 'Resultou na criação de uma monarquia absolutista' },
      { id: 'b', text: 'Instituiu uma república baseada em princípios como soberania popular, divisão de poderes e direitos individuais, inspirados em pensadores iluministas' },
      { id: 'c', text: 'Manteve as treze colônias sob controle britânico' },
      { id: 'd', text: 'Não teve qualquer influência sobre movimentos revolucionários posteriores, como a Revolução Francesa' }
    ],
    correctOptionId: 'b',
    explanation: 'A independência dos Estados Unidos resultou na criação de uma república fundamentada em princípios iluministas como a soberania popular, a divisão de poderes (Executivo, Legislativo e Judiciário) e a garantia de direitos individuais — servindo, inclusive, de inspiração e referência para revolucionários franceses poucos anos depois.',
    difficulty: 'medium'
  },
  // História — Imperialismo e Guerras Mundiais
  {
    id: 'q_his_imperialismo_guerras_1',
    chapter: 'Imperialismo e Belle Époque',
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
    chapter: 'Primeira Guerra Mundial (1914-1918)',
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
  {
    id: 'q_his_imperialismo_guerras_3',
    chapter: 'Imperialismo e Belle Époque',
    topicId: 'his_imperialismo_guerras',
    subject: 'História',
    prompt: 'A Conferência de Berlim (1884-1885), realizada por potências europeias, teve como principal objetivo:',
    options: [
      { id: 'a', text: 'Estabelecer regras para a partilha colonial da África entre as potências europeias, sem qualquer participação dos povos africanos nas decisões' },
      { id: 'b', text: 'Conceder independência imediata a todos os territórios africanos' },
      { id: 'c', text: 'Formar uma aliança militar entre países africanos e europeus' },
      { id: 'd', text: 'Encerrar definitivamente o comércio entre Europa e África' }
    ],
    correctOptionId: 'a',
    explanation: 'A Conferência de Berlim reuniu potências europeias para estabelecer regras e critérios para a partilha territorial da África entre si, num processo conduzido inteiramente pelos europeus, sem qualquer participação ou consulta aos povos africanos diretamente afetados pelas decisões — um marco do imperialismo europeu no continente.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_imperialismo_guerras_4',
    chapter: 'O Nazismo na Alemanha',
    topicId: 'his_imperialismo_guerras',
    subject: 'História',
    prompt: 'A ascensão do nazismo na Alemanha, na década de 1930, foi favorecida, entre outros fatores, por:',
    options: [
      { id: 'a', text: 'A prosperidade econômica alemã e a total ausência de ressentimento em relação ao Tratado de Versalhes' },
      { id: 'b', text: 'A crise econômica, o desemprego e o ressentimento nacionalista alemão decorrente das duras condições impostas pelo Tratado de Versalhes após a Primeira Guerra Mundial' },
      { id: 'c', text: 'O apoio unânime e imediato de todas as potências europeias ao governo de Hitler' },
      { id: 'd', text: 'A ausência completa de qualquer discurso nacionalista na Alemanha do período' }
    ],
    correctOptionId: 'b',
    explanation: 'A ascensão do nazismo foi favorecida pela grave crise econômica alemã (agravada pela Grande Depressão de 1929), pelo alto desemprego, e pelo ressentimento nacionalista alimentado pelas duras condições impostas à Alemanha pelo Tratado de Versalhes ao final da Primeira Guerra Mundial (reparações pesadas, perda de território, humilhação nacional) — um terreno fértil explorado pela propaganda nazista.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_imperialismo_guerras_5',
    chapter: 'Segunda Guerra Mundial (1939-1945)',
    topicId: 'his_imperialismo_guerras',
    subject: 'História',
    prompt: 'O Holocausto, o extermínio sistemático de judeus e outros grupos por parte do regime nazista durante a Segunda Guerra Mundial, é historicamente relevante por representar:',
    options: [
      { id: 'a', text: 'Um evento isolado, sem qualquer planejamento estatal por trás dele' },
      { id: 'b', text: 'Um genocídio planejado e executado de forma sistemática pelo Estado nazista, resultando na morte de milhões de judeus e de outros grupos perseguidos' },
      { id: 'c', text: 'Um episódio sem qualquer repercussão no direito internacional posterior' },
      { id: 'd', text: 'Uma política aplicada apenas fora do território alemão' }
    ],
    correctOptionId: 'b',
    explanation: 'O Holocausto foi um genocídio planejado e executado sistematicamente pelo Estado nazista, resultando no extermínio de aproximadamente seis milhões de judeus, além de outros grupos perseguidos (como ciganos, pessoas com deficiência e opositores políticos) — um evento que teve profundas repercussões no direito internacional posterior, incluindo a criação do conceito jurídico de "crime contra a humanidade" e a definição legal de genocídio.',
    difficulty: 'hard'
  },
  // História — Guerra Fria e Mundo Contemporâneo
  {
    id: 'q_his_guerra_fria_contemporaneo_1',
    chapter: 'Guerra Fria',
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
    chapter: 'O Fim da Guerra Fria',
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
  {
    id: 'q_his_guerra_fria_contemporaneo_3',
    chapter: 'Guerra Fria',
    topicId: 'his_guerra_fria_contemporaneo',
    subject: 'História',
    prompt: 'A Crise dos Mísseis de Cuba (1962), um dos episódios mais tensos da Guerra Fria, é considerada historicamente relevante por:',
    options: [
      { id: 'a', text: 'Ter levado EUA e URSS ao ponto mais próximo de um confronto nuclear direto durante toda a Guerra Fria, resolvida por negociação diplomática' },
      { id: 'b', text: 'Ter resultado em um ataque nuclear efetivo entre as duas potências' },
      { id: 'c', text: 'Não ter gerado qualquer tensão entre as potências envolvidas' },
      { id: 'd', text: 'Ter sido resolvida por meio de uma guerra convencional prolongada' }
    ],
    correctOptionId: 'a',
    explanation: 'A Crise dos Mísseis de Cuba, desencadeada pela instalação de mísseis soviéticos em território cubano, levou EUA e URSS ao momento de maior tensão e risco de confronto nuclear direto durante toda a Guerra Fria — uma crise que foi, no fim, resolvida por meio de negociação diplomática entre as duas potências, evitando o pior cenário.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_guerra_fria_contemporaneo_4',
    chapter: 'Descolonização Afro-Asiática',
    topicId: 'his_guerra_fria_contemporaneo',
    subject: 'História',
    prompt: 'O processo de descolonização da África e da Ásia, intensificado especialmente após a Segunda Guerra Mundial, resultou em:',
    options: [
      { id: 'a', text: 'A manutenção indefinida do domínio colonial europeu sobre esses territórios' },
      { id: 'b', text: 'O surgimento de dezenas de novos países independentes, embora muitos enfrentassem, após a independência, desafios como fronteiras artificiais herdadas do período colonial e instabilidade política' },
      { id: 'c', text: 'A ausência total de qualquer conflito posterior à independência desses territórios' },
      { id: 'd', text: 'A anexação imediata desses territórios pelos Estados Unidos ou pela União Soviética' }
    ],
    correctOptionId: 'b',
    explanation: 'O processo de descolonização, acelerado após a Segunda Guerra Mundial, resultou na independência de dezenas de novos países na África e na Ásia. Muitos desses países, no entanto, enfrentaram desafios pós-independência ligados a fronteiras artificiais traçadas pelas potências coloniais (sem considerar divisões étnicas ou culturais locais) e a instabilidade política, muitas vezes agravada pela disputa de influência entre EUA e URSS durante a Guerra Fria.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_guerra_fria_contemporaneo_5',
    chapter: 'O Fim da Guerra Fria',
    topicId: 'his_guerra_fria_contemporaneo',
    subject: 'História',
    prompt: 'Os atentados de 11 de setembro de 2001, nos Estados Unidos, tiveram como um de seus principais desdobramentos geopolíticos:',
    options: [
      { id: 'a', text: 'O fortalecimento imediato e definitivo da paz mundial, sem qualquer conflito posterior' },
      { id: 'b', text: 'O início da chamada "Guerra ao Terror", incluindo invasões militares lideradas pelos Estados Unidos ao Afeganistão e, posteriormente, ao Iraque' },
      { id: 'c', text: 'A dissolução imediata da ONU' },
      { id: 'd', text: 'O fim de qualquer tensão entre países ocidentais e o Oriente Médio' }
    ],
    correctOptionId: 'b',
    explanation: 'Os atentados de 11 de setembro de 2001 levaram os Estados Unidos a declarar a chamada "Guerra ao Terror", que incluiu a invasão militar ao Afeganistão (2001) — em resposta ao regime Talibã, que abrigava a liderança da Al-Qaeda — e, posteriormente, ao Iraque (2003), com profundas e duradouras repercussões geopolíticas no Oriente Médio e nas relações internacionais.',
    difficulty: 'medium'
  },
  // História — Brasil Colônia
  {
    id: 'q_his_brasil_colonia_1',
    chapter: 'Dinâmica Interna da Colonização',
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
    chapter: 'A Crise do Antigo Sistema Colonial',
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
  {
    id: 'q_his_brasil_colonia_3',
    chapter: 'A Montagem da Colonização',
    topicId: 'his_brasil_colonia',
    subject: 'História',
    prompt: 'O sistema de capitanias hereditárias, adotado por Portugal para colonizar o Brasil a partir de 1534, se caracterizava por:',
    options: [
      { id: 'a', text: 'Dividir o território em faixas de terra doadas a donatários, com poderes administrativos e a responsabilidade de colonizar e defender a área, mas sem transferir a posse plena da terra (que permanecia da Coroa)' },
      { id: 'b', text: 'Conceder independência total às capitanias em relação a Portugal' },
      { id: 'c', text: 'Ser um sistema de sucesso amplamente uniforme em todas as capitanias' },
      { id: 'd', text: 'Não ter qualquer relação com a defesa do território colonial' }
    ],
    correctOptionId: 'a',
    explanation: 'O sistema de capitanias hereditárias dividiu o litoral brasileiro em faixas de terra doadas a donatários (a posse era transferida, mas não a soberania, que permanecia da Coroa portuguesa), com a responsabilidade de administrar, colonizar e defender a área — um sistema que teve resultados bastante desiguais, com poucas capitanias prosperando de fato.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_brasil_colonia_4',
    chapter: 'Dinâmica Interna da Colonização',
    topicId: 'his_brasil_colonia',
    subject: 'História',
    prompt: 'O tráfico transatlântico de pessoas escravizadas, que trouxe milhões de africanos ao Brasil colonial, teve como principal justificativa econômica, do ponto de vista dos colonizadores, a necessidade de:',
    options: [
      { id: 'a', text: 'Mão de obra em larga escala para sustentar atividades como a produção açucareira e, mais tarde, a mineração' },
      { id: 'b', text: 'Substituir integralmente o trabalho livre europeu, que já era predominante na colônia' },
      { id: 'c', text: 'Realizar exclusivamente trabalhos domésticos, sem qualquer papel na produção econômica' },
      { id: 'd', text: 'Cumprir exigências religiosas específicas da Igreja Católica' }
    ],
    correctOptionId: 'a',
    explanation: 'O tráfico transatlântico de pessoas escravizadas foi impulsionado pela necessidade de mão de obra em larga escala para sustentar atividades econômicas centrais da colônia, como a produção açucareira nos engenhos e, posteriormente, a extração de ouro e diamantes durante o ciclo minerador — a base sobre a qual se estruturou boa parte da economia colonial brasileira.',
    difficulty: 'easy'
  },
  {
    id: 'q_his_brasil_colonia_5',
    chapter: 'Dinâmica Interna da Colonização',
    topicId: 'his_brasil_colonia',
    subject: 'História',
    prompt: 'O Pacto Colonial (ou exclusivo metropolitano), princípio que regia as relações econômicas entre Portugal e sua colônia brasileira, determinava que:',
    options: [
      { id: 'a', text: 'O comércio da colônia deveria ocorrer livremente com qualquer país, sem restrições' },
      { id: 'b', text: 'A colônia deveria comercializar exclusivamente com a metrópole (Portugal), que se beneficiava do monopólio sobre a exportação e importação de produtos coloniais' },
      { id: 'c', text: 'A colônia teria total autonomia política e econômica em relação a Portugal' },
      { id: 'd', text: 'Não existia qualquer regulamentação sobre o comércio colonial' }
    ],
    correctOptionId: 'b',
    explanation: 'O Pacto Colonial estabelecia que a colônia deveria comercializar exclusivamente com sua metrópole, garantindo a Portugal o monopólio sobre a compra dos produtos coloniais (como açúcar e, depois, ouro) e a venda de produtos manufaturados à colônia — um sistema que subordinava economicamente o Brasil colonial aos interesses da Coroa portuguesa.',
    difficulty: 'medium'
  },
  // História — Brasil Império
  {
    id: 'q_his_brasil_imperio_1',
    chapter: 'Brasil Império: Formação do Estado Nacional Brasileiro',
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
    chapter: 'Brasil Império: o Declínio do Segundo Reinado',
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
  {
    id: 'q_his_brasil_imperio_3',
    chapter: 'Brasil Império: o Período Regencial (1831-1840)',
    topicId: 'his_brasil_imperio',
    subject: 'História',
    prompt: 'O Período Regencial (1831-1840), fase em que o Brasil foi governado por regentes devido à menoridade de D. Pedro II, foi marcado por:',
    options: [
      { id: 'a', text: 'Estabilidade política completa, sem qualquer revolta ou tensão regional' },
      { id: 'b', text: 'Diversas revoltas regionais (como a Cabanagem, a Sabinada e a Revolução Farroupilha), refletindo tensões sociais, econômicas e políticas em diferentes partes do território' },
      { id: 'c', text: 'O fim definitivo da monarquia no Brasil' },
      { id: 'd', text: 'A abolição imediata da escravidão' }
    ],
    correctOptionId: 'b',
    explanation: 'O Período Regencial foi marcado por instabilidade política e diversas revoltas regionais — como a Cabanagem (Pará), a Sabinada (Bahia) e a Revolução Farroupilha (Rio Grande do Sul) — que refletiam tensões sociais, econômicas e disputas de poder em um contexto de enfraquecimento do poder central durante a menoridade do futuro imperador D. Pedro II.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_brasil_imperio_4',
    chapter: 'Brasil Império: Segundo Reinado (1840-1889)',
    topicId: 'his_brasil_imperio',
    subject: 'História',
    prompt: 'A Guerra do Paraguai (1864-1870), o maior conflito armado da história da América do Sul, envolveu o Paraguai de um lado e, do outro, a Tríplice Aliança, formada por:',
    options: [
      { id: 'a', text: 'Brasil, Argentina e Uruguai' },
      { id: 'b', text: 'Brasil, Bolívia e Chile' },
      { id: 'c', text: 'Apenas o Brasil, isoladamente' },
      { id: 'd', text: 'Argentina, Chile e Peru' }
    ],
    correctOptionId: 'a',
    explanation: 'A Guerra do Paraguai (ou Guerra da Tríplice Aliança) opôs o Paraguai à aliança formada por Brasil, Argentina e Uruguai, resultando em um conflito longo e extremamente custoso em vidas humanas, com impacto demográfico e econômico duradouro sobre o Paraguai.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_brasil_imperio_5',
    chapter: 'Brasil Império: o Declínio do Segundo Reinado',
    topicId: 'his_brasil_imperio',
    subject: 'História',
    prompt: 'A Proclamação da República no Brasil, em 1889, foi liderada principalmente por:',
    options: [
      { id: 'a', text: 'Um amplo movimento popular espontâneo, sem qualquer participação militar' },
      { id: 'b', text: 'Setores das Forças Armadas (com destaque para o Marechal Deodoro da Fonseca), com apoio de setores da elite descontentes com o Império, em um movimento com pouca participação popular direta' },
      { id: 'c', text: 'Uma decisão do próprio Imperador D. Pedro II, favorável à mudança de regime' },
      { id: 'd', text: 'Um referendo popular nacional' }
    ],
    correctOptionId: 'b',
    explanation: 'A Proclamação da República foi liderada por setores das Forças Armadas, com destaque para o Marechal Deodoro da Fonseca, contando com apoio de setores da elite (como cafeicultores insatisfeitos e republicanos) descontentes com o Império — um movimento conduzido essencialmente "de cima para baixo", com pouca participação popular direta no momento da proclamação.',
    difficulty: 'medium'
  },
  // História — Primeira República e Era Vargas
  {
    id: 'q_his_primeira_republica_vargas_1',
    chapter: 'Ascensão e Domínio das Oligarquias',
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
    chapter: 'A Era Vargas: o Estado Novo',
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
  {
    id: 'q_his_primeira_republica_vargas_3',
    chapter: 'Ascensão e Domínio das Oligarquias',
    topicId: 'his_primeira_republica_vargas',
    subject: 'História',
    prompt: 'O voto de cabresto, prática eleitoral marcante da Primeira República brasileira, se referia a:',
    options: [
      { id: 'a', text: 'Um sistema de voto totalmente livre, secreto e sem qualquer influência externa' },
      { id: 'b', text: 'A manipulação e o controle do voto de eleitores, muitas vezes dependentes economicamente de coronéis locais, que direcionavam o resultado das eleições em favor das oligarquias' },
      { id: 'c', text: 'Um sistema de votação exclusivamente por correspondência' },
      { id: 'd', text: 'A extensão do direito de voto às mulheres pela primeira vez' }
    ],
    correctOptionId: 'b',
    explanation: 'O voto de cabresto era uma prática comum na Primeira República em que coronéis (grandes proprietários rurais com forte poder local) controlavam o voto de eleitores dependentes deles econômica ou socialmente, garantindo resultados eleitorais favoráveis às oligarquias — uma das faces do chamado "coronelismo" que caracterizou a política do período.',
    difficulty: 'medium'
  },
  {
    id: 'q_his_primeira_republica_vargas_4',
    chapter: 'A Primeira República: o Declínio Oligárquico (1889-1930)',
    topicId: 'his_primeira_republica_vargas',
    subject: 'História',
    prompt: 'A Revolução de 1930, que levou Getúlio Vargas ao poder e encerrou a Primeira República, teve entre seus fatores desencadeadores:',
    options: [
      { id: 'a', text: 'A crise do modelo agroexportador cafeeiro, agravada pela Grande Depressão de 1929, e o rompimento da política do "café com leite" (com a candidatura de Getúlio Vargas contra a indicação paulista)' },
      { id: 'b', text: 'Um acordo pacífico entre todas as oligarquias regionais para a continuidade do sistema' },
      { id: 'c', text: 'A ausência total de qualquer crise econômica no período' },
      { id: 'd', text: 'A restauração da monarquia brasileira' }
    ],
    correctOptionId: 'a',
    explanation: 'A Revolução de 1930 foi impulsionada pela crise do modelo agroexportador cafeeiro (agravada pela Grande Depressão de 1929, que derrubou os preços internacionais do café) e pelo rompimento da aliança "café com leite", quando Minas Gerais apoiou Getúlio Vargas em vez de aceitar a indicação de outro candidato paulista — resultando em um movimento armado que depôs o presidente eleito e levou Vargas ao poder.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_primeira_republica_vargas_5',
    chapter: 'A Era Vargas: o Estado Novo',
    topicId: 'his_primeira_republica_vargas',
    subject: 'História',
    prompt: 'A Consolidação das Leis do Trabalho (CLT), criada durante o governo de Getúlio Vargas em 1943, teve como principal característica:',
    options: [
      { id: 'a', text: 'Eliminar completamente qualquer direito trabalhista existente até então' },
      { id: 'b', text: 'Reunir e sistematizar diversos direitos trabalhistas (como jornada de trabalho, férias remuneradas e salário mínimo) em um único conjunto de leis, ao mesmo tempo em que os sindicatos ficavam sob forte controle e tutela do Estado' },
      { id: 'c', text: 'Ser aplicada exclusivamente aos trabalhadores rurais' },
      { id: 'd', text: 'Ter sido revogada imediatamente após sua criação' }
    ],
    correctOptionId: 'b',
    explanation: 'A CLT sistematizou diversos direitos trabalhistas conquistados ao longo do governo Vargas (jornada de trabalho, férias remuneradas, salário mínimo, entre outros), representando um avanço social importante. Ao mesmo tempo, os sindicatos permaneceram sob forte controle e tutela do Estado (o chamado sindicalismo atrelado), o que limitava sua autonomia frente ao governo — uma combinação característica do populismo trabalhista de Vargas.',
    difficulty: 'medium'
  },
  // História — República Liberal e Brasil Contemporâneo
  {
    id: 'q_his_republica_liberal_atual_1',
    chapter: 'Regime Militar (1964-1985) I',
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
    chapter: 'O Brasil Atual',
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
  {
    id: 'q_his_republica_liberal_atual_3',
    chapter: 'Regime Militar (1964-1985) II',
    topicId: 'his_republica_liberal_atual',
    subject: 'História',
    prompt: 'O "Milagre Econômico" brasileiro, período de forte crescimento econômico durante a ditadura militar (especialmente entre 1969 e 1973), é frequentemente lembrado por:',
    options: [
      { id: 'a', text: 'Ter promovido crescimento econômico acelerado, mas com forte concentração de renda e sem redução das desigualdades sociais no país' },
      { id: 'b', text: 'Ter reduzido drasticamente as desigualdades sociais brasileiras' },
      { id: 'c', text: 'Ter ocorrido em um contexto de plena liberdade política e democrática' },
      { id: 'd', text: 'Não ter qualquer relação com investimento estatal na economia' }
    ],
    correctOptionId: 'a',
    explanation: 'O "Milagre Econômico" foi um período de crescimento acelerado do PIB brasileiro, sustentado por forte investimento estatal e endividamento externo, mas que ocorreu em paralelo à repressão política do regime militar e resultou em concentração de renda, sem redução significativa das desigualdades sociais — um crescimento que não se traduziu em distribuição equitativa de seus benefícios.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_republica_liberal_atual_4',
    chapter: 'Regime Militar (1964-1985) II',
    topicId: 'his_republica_liberal_atual',
    subject: 'História',
    prompt: 'O movimento "Diretas Já", ocorrido em 1984, foi um marco importante do processo de redemocratização brasileira porque:',
    options: [
      { id: 'a', text: 'Reivindicava eleições diretas para presidente da República, mobilizando grandes manifestações populares, embora a emenda que propunha isso não tenha sido aprovada naquele momento pelo Congresso' },
      { id: 'b', text: 'Resultou imediatamente em eleições diretas para presidente naquele mesmo ano' },
      { id: 'c', text: 'Foi organizado e apoiado diretamente pelo governo militar' },
      { id: 'd', text: 'Não teve qualquer repercussão popular significativa' }
    ],
    correctOptionId: 'a',
    explanation: 'O movimento "Diretas Já" mobilizou grandes manifestações populares em todo o Brasil, reivindicando eleições diretas para presidente da República. Apesar da forte mobilização, a emenda constitucional que propunha isso (Emenda Dante de Oliveira) não foi aprovada pelo Congresso em 1984 — a eleição seguinte ainda seria indireta, mas o movimento teve papel simbólico fundamental no processo de redemocratização que culminaria, poucos anos depois, na Constituição de 1988 e em eleições diretas.',
    difficulty: 'hard'
  },
  {
    id: 'q_his_republica_liberal_atual_5',
    chapter: 'O Brasil Atual',
    topicId: 'his_republica_liberal_atual',
    subject: 'História',
    prompt: 'O Plano Real, implementado em 1994, é historicamente relevante por ter:',
    options: [
      { id: 'a', text: 'Aumentado a inflação brasileira a níveis ainda mais altos do que os anteriores' },
      { id: 'b', text: 'Conseguido estabilizar a economia brasileira, controlando um longo período de hiperinflação que afetava o país desde décadas anteriores' },
      { id: 'c', text: 'Restaurado o regime militar no Brasil' },
      { id: 'd', text: 'Eliminado completamente qualquer forma de moeda no país' }
    ],
    correctOptionId: 'b',
    explanation: 'O Plano Real, lançado em 1994, conseguiu estabilizar a economia brasileira após décadas de alta inflação (e episódios de hiperinflação), por meio de uma nova moeda (o Real) e mecanismos de transição que ajudaram a "ancorar" as expectativas de preços — um dos planos econômicos mais bem-sucedidos da história recente do país no combate à inflação crônica.',
    difficulty: 'medium'
  },
  // Biologia — Estrutura e Fisiologia Celular
  {
    id: 'q_bio_estrutura_fisio_celular_1',
    chapter: 'Citoplasma: Estrutura e Componentes I',
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
    chapter: 'Membranas Celulares',
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
    chapter: 'Membranas Celulares',
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
    chapter: 'Citoplasma: Estrutura e Componentes II',
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
    chapter: 'Citoplasma: Estrutura e Componentes II',
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
  {
    id: 'q_bio_estrutura_fisio_celular_6',
    chapter: 'Origem da Vida e as Primeiras Células',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O experimento de Miller-Urey (1953), que simulou condições da atmosfera primitiva da Terra com descargas elétricas sobre uma mistura de gases, é historicamente relevante porque:',
    options: [
      { id: 'a', text: 'Provou definitivamente como a vida surgiu na Terra' },
      { id: 'b', text: 'Demonstrou que moléculas orgânicas simples (como aminoácidos) podem se formar espontaneamente a partir de compostos inorgânicos, sob condições semelhantes às da Terra primitiva' },
      { id: 'c', text: 'Criou as primeiras células vivas em laboratório' },
      { id: 'd', text: 'Refutou completamente qualquer hipótese de evolução química' }
    ],
    correctOptionId: 'b',
    explanation: 'O experimento demonstrou que aminoácidos e outras moléculas orgânicas simples podem se formar a partir de compostos inorgânicos (metano, amônia, hidrogênio, água) sob energia externa (descargas elétricas simulando raios) — uma evidência a favor da hipótese da evolução química, sem provar como a vida de fato surgiu.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_7',
    chapter: 'Origem da Vida e as Primeiras Células',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'As primeiras células a surgir na Terra, segundo a maioria das hipóteses científicas, eram provavelmente:',
    options: [
      { id: 'a', text: 'Eucarióticas complexas, com núcleo bem definido' },
      { id: 'b', text: 'Procarióticas simples, sem núcleo organizado, semelhantes a bactérias atuais' },
      { id: 'c', text: 'Organismos multicelulares já bem desenvolvidos' },
      { id: 'd', text: 'Idênticas às células vegetais atuais, já com cloroplastos' }
    ],
    correctOptionId: 'b',
    explanation: 'As evidências fósseis e moleculares indicam que as primeiras células foram procarióticas (sem núcleo organizado por membrana), estruturalmente mais simples — semelhantes às bactérias atuais —, surgindo bilhões de anos antes das primeiras células eucarióticas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_8',
    chapter: 'Origem da Vida e as Primeiras Células',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'A teoria endossimbiótica propõe que mitocôndrias e cloroplastos, organelas presentes em células eucarióticas, teriam se originado a partir de:',
    options: [
      { id: 'a', text: 'Dobramentos da própria membrana plasmática da célula eucariótica, sem qualquer relação externa' },
      { id: 'b', text: 'Bactérias procarióticas de vida livre que passaram a viver em simbiose dentro de uma célula hospedeira ancestral, sendo progressivamente incorporadas' },
      { id: 'c', text: 'Vírus que infectaram a célula e nunca mais saíram' },
      { id: 'd', text: 'Fragmentos do núcleo celular que se especializaram' }
    ],
    correctOptionId: 'b',
    explanation: 'A teoria endossimbiótica, hoje amplamente aceita, propõe que mitocôndrias e cloroplastos descendem de bactérias de vida livre (procariontes) que foram incorporadas por endocitose em uma célula hospedeira ancestral, estabelecendo uma relação simbiótica que se tornou permanente — evidenciada, por exemplo, pelo fato de essas organelas terem seu próprio DNA circular, semelhante ao de bactérias.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_9',
    chapter: 'Composição Química Celular: Compostos Inorgânicos',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'A água é a substância mais abundante nos seres vivos, sendo fundamental para a vida principalmente porque:',
    options: [
      { id: 'a', text: 'É uma molécula apolar, o que facilita reações com lipídios' },
      { id: 'b', text: 'É uma molécula polar, capaz de formar pontes de hidrogênio, o que a torna um excelente solvente para substâncias polares e permite reações químicas em meio aquoso' },
      { id: 'c', text: 'Não participa de nenhuma reação química celular' },
      { id: 'd', text: 'Está presente apenas em organismos aquáticos' }
    ],
    correctOptionId: 'b',
    explanation: 'A polaridade da molécula de água, decorrente da diferença de eletronegatividade entre oxigênio e hidrogênio, permite a formação de pontes de hidrogênio entre suas moléculas e com outras substâncias polares — tornando-a um excelente solvente (o "solvente universal") e o meio onde ocorre a maioria das reações metabólicas celulares.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_10',
    chapter: 'Composição Química Celular: Compostos Inorgânicos',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Os sais minerais, compostos inorgânicos presentes nos seres vivos, desempenham funções como:',
    options: [
      { id: 'a', text: 'Fornecer a maior parte da energia metabólica da célula' },
      { id: 'b', text: 'Participar da formação de estruturas rígidas (como ossos e conchas) e da regulação de processos celulares (como a contração muscular e a condução de impulsos nervosos)' },
      { id: 'c', text: 'Substituir completamente a função das proteínas' },
      { id: 'd', text: 'Não ter qualquer função biológica relevante' }
    ],
    correctOptionId: 'b',
    explanation: 'Sais minerais (como cálcio, fósforo, sódio e potássio) participam da formação de estruturas rígidas (ossos, conchas, exoesqueletos) e são essenciais para processos fisiológicos como a contração muscular, a condução de impulsos nervosos e o equilíbrio osmótico — mesmo não sendo fontes diretas de energia como carboidratos e lipídios.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_11',
    chapter: 'Composição Química Celular: Compostos Inorgânicos',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Uma solução tampão (buffer), presente no sangue e em outros fluidos biológicos, tem como função:',
    options: [
      { id: 'a', text: 'Aumentar drasticamente o pH do meio a cada reação química' },
      { id: 'b', text: 'Resistir a variações bruscas de pH, mantendo-o relativamente estável mesmo diante da adição de pequenas quantidades de ácidos ou bases' },
      { id: 'c', text: 'Eliminar completamente qualquer variação de pH, tornando-o sempre neutro' },
      { id: 'd', text: 'Não ter qualquer relação com o equilíbrio ácido-base do organismo' }
    ],
    correctOptionId: 'b',
    explanation: 'Soluções tampão resistem a variações bruscas de pH, absorvendo o excesso de H⁺ ou OH⁻ adicionado ao meio — um mecanismo essencial para manter o pH sanguíneo dentro de uma faixa estreita e compatível com a vida, mesmo diante de pequenas alterações na produção ou eliminação de ácidos e bases pelo metabolismo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_12',
    chapter: 'Composição Química Celular: Carboidratos e Lipídios',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'A glicose é classificada como um monossacarídeo, a unidade mais simples dos carboidratos. O glicogênio (reserva energética em animais) e o amido (reserva energética em plantas) são exemplos de:',
    options: [
      { id: 'a', text: 'Monossacarídeos, assim como a glicose' },
      { id: 'b', text: 'Polissacarídeos, formados pela união de muitas unidades de glicose' },
      { id: 'c', text: 'Lipídios de reserva energética' },
      { id: 'd', text: 'Proteínas estruturais' }
    ],
    correctOptionId: 'b',
    explanation: 'Glicogênio e amido são polissacarídeos — macromoléculas formadas pela união de milhares de unidades de glicose por ligações glicosídicas — que funcionam como reservas energéticas de longo prazo em animais e plantas, respectivamente.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_13',
    chapter: 'Composição Química Celular: Carboidratos e Lipídios',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Os fosfolipídios, principais componentes estruturais das membranas celulares, têm uma característica molecular fundamental para essa função, que é:',
    options: [
      { id: 'a', text: 'Serem moléculas completamente apolares, sem qualquer região hidrofílica' },
      { id: 'b', text: 'Serem anfipáticos: possuem uma "cabeça" polar (hidrofílica) e "caudas" apolares (hidrofóbicas), o que os leva a se organizar espontaneamente em bicamadas em meio aquoso' },
      { id: 'c', text: 'Serem incapazes de se organizar em qualquer estrutura ordenada' },
      { id: 'd', text: 'Não terem qualquer relação com a formação de membranas biológicas' }
    ],
    correctOptionId: 'b',
    explanation: 'Fosfolipídios são moléculas anfipáticas: a "cabeça" (grupo fosfato) é polar/hidrofílica, e as "caudas" (ácidos graxos) são apolares/hidrofóbicas. Em meio aquoso, essa dupla natureza faz com que se organizem espontaneamente em bicamadas, com as caudas voltadas para dentro (protegidas da água) e as cabeças voltadas para o meio aquoso — a base estrutural de todas as membranas biológicas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_14',
    chapter: 'Composição Química Celular: Carboidratos e Lipídios',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O colesterol, um tipo de lipídio (esteroide) presente nas membranas de células animais, tem como função:',
    options: [
      { id: 'a', text: 'Regular a fluidez da membrana, tornando-a nem excessivamente rígida nem excessivamente fluida, conforme a temperatura' },
      { id: 'b', text: 'Ser a única molécula que compõe a membrana plasmática' },
      { id: 'c', text: 'Impedir completamente qualquer movimento das proteínas de membrana' },
      { id: 'd', text: 'Não ter qualquer função na membrana celular' }
    ],
    correctOptionId: 'a',
    explanation: 'O colesterol se intercala entre os fosfolipídios da membrana, ajudando a regular sua fluidez: em temperaturas mais altas, restringe o movimento excessivo dos fosfolipídios (evitando fluidez excessiva); em temperaturas mais baixas, impede que a membrana se torne rígida demais — mantendo a membrana funcional em uma faixa de temperaturas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_15',
    chapter: 'Composição Química Celular: Proteínas e sua Função Estrutural',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'As proteínas são formadas pela união de unidades menores chamadas:',
    options: [
      { id: 'a', text: 'Nucleotídeos' },
      { id: 'b', text: 'Aminoácidos, unidos por ligações peptídicas' },
      { id: 'c', text: 'Monossacarídeos' },
      { id: 'd', text: 'Ácidos graxos' }
    ],
    correctOptionId: 'b',
    explanation: 'Proteínas são polímeros formados pela união de aminoácidos através de ligações peptídicas, formando cadeias (polipeptídeos) que se dobram em estruturas tridimensionais específicas, determinando a função de cada proteína.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_16',
    chapter: 'Composição Química Celular: Proteínas e sua Função Estrutural',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'A estrutura tridimensional final de uma proteína (sua conformação enovelada) é fundamental para sua função porque:',
    options: [
      { id: 'a', text: 'A forma da proteína não tem qualquer relação com sua função biológica' },
      { id: 'b', text: 'A forma específica determina como a proteína interage com outras moléculas (como um encaixe), sendo essencial para funções como catálise enzimática, reconhecimento de receptores e função estrutural' },
      { id: 'c', text: 'Todas as proteínas têm exatamente a mesma forma, independentemente da sequência de aminoácidos' },
      { id: 'd', text: 'A forma só importa para proteínas estruturais, nunca para enzimas' }
    ],
    correctOptionId: 'b',
    explanation: 'A conformação tridimensional de uma proteína determina sua função: enzimas precisam de um sítio ativo com forma específica para se ligar ao substrato, proteínas estruturais (como o colágeno) precisam de uma forma que confira resistência mecânica, e receptores precisam de uma forma que reconheça moléculas específicas — perder essa conformação (desnaturação) geralmente significa perder a função.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_17',
    chapter: 'Composição Química Celular: Proteínas e sua Função Estrutural',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O colágeno, a proteína mais abundante no corpo humano, presente na pele, tendões e ossos, é um exemplo de proteína com função:',
    options: [
      { id: 'a', text: 'Enzimática, catalisando reações metabólicas' },
      { id: 'b', text: 'Estrutural, conferindo resistência mecânica e sustentação aos tecidos' },
      { id: 'c', text: 'Hormonal, regulando o metabolismo à distância' },
      { id: 'd', text: 'De transporte de oxigênio no sangue' }
    ],
    correctOptionId: 'b',
    explanation: 'O colágeno tem função estrutural: sua estrutura fibrosa em tripla-hélice confere resistência mecânica e sustentação a tecidos como pele, tendões, cartilagens e ossos — diferente de proteínas enzimáticas (como a amilase), hormonais (como a insulina) ou de transporte (como a hemoglobina).',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_18',
    chapter: 'Citoplasma: Estrutura e Componentes I',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O citoesqueleto, uma rede de filamentos proteicos presente no citoplasma das células eucarióticas, tem como uma de suas principais funções:',
    options: [
      { id: 'a', text: 'Produzir ATP por respiração celular' },
      { id: 'b', text: 'Dar sustentação e forma à célula, além de participar de movimentos celulares e do transporte intracelular de organelas' },
      { id: 'c', text: 'Armazenar o material genético da célula' },
      { id: 'd', text: 'Realizar a fotossíntese em células vegetais' }
    ],
    correctOptionId: 'b',
    explanation: 'O citoesqueleto (formado por microfilamentos, filamentos intermediários e microtúbulos) dá sustentação estrutural à célula, mantém sua forma, participa de movimentos celulares (como a contração muscular e a locomoção de células como leucócitos) e serve como "trilhos" para o transporte de organelas e vesículas dentro da célula.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_19',
    chapter: 'Citoplasma: Estrutura e Componentes I',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'Os centríolos, estruturas cilíndricas formadas por microtúbulos, presentes na maioria das células animais, estão diretamente relacionados a:',
    options: [
      { id: 'a', text: 'A produção de ATP na respiração celular' },
      { id: 'b', text: 'A organização do fuso mitótico durante a divisão celular e a formação de cílios e flagelos' },
      { id: 'c', text: 'A síntese de proteínas' },
      { id: 'd', text: 'A digestão intracelular de macromoléculas' }
    ],
    correctOptionId: 'b',
    explanation: 'Os centríolos organizam o fuso mitótico (estrutura de microtúbulos que separa os cromossomos durante a divisão celular) e também dão origem aos corpos basais que organizam cílios e flagelos — estruturas relacionadas ao movimento celular ou ao movimento de fluidos sobre a superfície de certas células.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_20',
    chapter: 'Núcleo Celular',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O envoltório nuclear (carioteca), membrana dupla que delimita o núcleo nas células eucarióticas, possui poros nucleares cuja função é:',
    options: [
      { id: 'a', text: 'Impedir totalmente qualquer troca de substâncias entre núcleo e citoplasma' },
      { id: 'b', text: 'Permitir a passagem seletiva de substâncias entre o núcleo e o citoplasma, como RNA mensageiro (saindo) e proteínas (entrando)' },
      { id: 'c', text: 'Produzir ATP para as atividades nucleares' },
      { id: 'd', text: 'Substituir a função dos ribossomos na síntese proteica' }
    ],
    correctOptionId: 'b',
    explanation: 'Os poros nucleares são estruturas complexas que atravessam o envoltório nuclear, permitindo o transporte seletivo e controlado de moléculas entre núcleo e citoplasma — como a saída de RNA mensageiro (produzido no núcleo, mas traduzido no citoplasma) e a entrada de proteínas necessárias às atividades nucleares.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_21',
    chapter: 'Núcleo Celular',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'O nucléolo, estrutura densa visível dentro do núcleo (mas sem membrana própria), tem como principal função:',
    options: [
      { id: 'a', text: 'Armazenar todo o DNA da célula' },
      { id: 'b', text: 'Sintetizar e montar os componentes do RNA ribossômico (rRNA), formando as subunidades dos ribossomos' },
      { id: 'c', text: 'Realizar a digestão de macromoléculas' },
      { id: 'd', text: 'Produzir energia para as atividades celulares' }
    ],
    correctOptionId: 'b',
    explanation: 'O nucléolo é a região do núcleo onde o RNA ribossômico é sintetizado e onde as subunidades ribossômicas começam a ser montadas, antes de serem exportadas ao citoplasma através dos poros nucleares para completar a formação dos ribossomos funcionais.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_estrutura_fisio_celular_22',
    chapter: 'Núcleo Celular',
    topicId: 'bio_estrutura_fisio_celular',
    subject: 'Biologia',
    prompt: 'A cromatina, material observado no núcleo de células que não estão se dividindo, corresponde a:',
    options: [
      { id: 'a', text: 'DNA associado a proteínas (histonas), em uma forma mais frouxa e descondensada do que os cromossomos visíveis durante a divisão celular' },
      { id: 'b', text: 'Uma estrutura exclusivamente proteica, sem qualquer DNA' },
      { id: 'c', text: 'RNA ribossômico armazenado temporariamente' },
      { id: 'd', text: 'Uma organela citoplasmática, não nuclear' }
    ],
    correctOptionId: 'a',
    explanation: 'A cromatina é o complexo de DNA associado a proteínas histonas, em um estado mais descondensado (frouxo) durante a maior parte do ciclo celular, o que facilita o acesso aos genes para transcrição. Durante a divisão celular, essa cromatina se condensa, tornando-se visível como cromossomos bem definidos.',
    difficulty: 'medium'
  },
  // Biologia — Biotecnologia
  {
    id: 'q_bio_biotecnologia_1',
    chapter: 'Biotecnologia',
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
    chapter: 'Biotecnologia',
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
    chapter: 'Biotecnologia',
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
    chapter: 'Biotecnologia',
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
    chapter: 'Biotecnologia',
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
    chapter: 'Introdução aos Cordados e os Peixes',
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
    chapter: 'Cordados Tetrápodes',
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
    chapter: 'Artrópodes: Insetos, Crustáceos e Miriápodes',
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
    chapter: 'Cordados Tetrápodes',
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
    chapter: 'Cordados Tetrápodes',
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
  {
    id: 'q_bio_zoologia_6',
    chapter: 'Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Na nomenclatura binomial criada por Lineu, o nome científico de uma espécie (como Homo sapiens) é formado por:',
    options: [
      { id: 'a', text: 'Apenas o nome do gênero, sem qualquer outro termo' },
      { id: 'b', text: 'Duas palavras: o nome do gênero (com inicial maiúscula) seguido do epíteto específico (em minúscula), geralmente em latim e grafados em itálico' },
      { id: 'c', text: 'Um número de identificação, sem qualquer relação com palavras' },
      { id: 'd', text: 'O nome popular do organismo, sem qualquer padronização' }
    ],
    correctOptionId: 'b',
    explanation: 'A nomenclatura binomial de Lineu identifica cada espécie por duas palavras: o gênero (iniciado por maiúscula) e o epíteto específico (em minúscula), ambos geralmente em latim e escritos em itálico (ou sublinhados, quando manuscritos) — um padrão universal que evita confusões causadas pelos nomes populares, que variam entre regiões e idiomas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_7',
    chapter: 'Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Um cladograma, ferramenta usada na sistemática filogenética, representa graficamente:',
    options: [
      { id: 'a', text: 'Apenas a distribuição geográfica atual das espécies, sem relação evolutiva' },
      { id: 'b', text: 'As relações de parentesco evolutivo entre diferentes grupos de organismos, baseadas em características compartilhadas por ancestralidade comum' },
      { id: 'c', text: 'A quantidade de indivíduos de cada espécie em uma população' },
      { id: 'd', text: 'Uma classificação puramente alfabética das espécies' }
    ],
    correctOptionId: 'b',
    explanation: 'Um cladograma é uma representação gráfica (em forma de árvore ramificada) das relações de parentesco evolutivo entre grupos de organismos, construída a partir de características compartilhadas que indicam ancestralidade comum — quanto mais recente o ponto de ramificação compartilhado entre dois grupos, mais próximo é seu parentesco evolutivo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_8',
    chapter: 'Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A hierarquia taxonômica tradicional, do nível mais abrangente ao mais específico, segue a ordem:',
    options: [
      { id: 'a', text: 'Espécie, Gênero, Família, Ordem, Classe, Filo, Reino, Domínio' },
      { id: 'b', text: 'Domínio, Reino, Filo, Classe, Ordem, Família, Gênero, Espécie' },
      { id: 'c', text: 'Reino, Domínio, Espécie, Gênero, Filo, Classe, Ordem, Família' },
      { id: 'd', text: 'Não existe qualquer hierarquia entre esses níveis taxonômicos' }
    ],
    correctOptionId: 'b',
    explanation: 'A hierarquia taxonômica tradicional vai do nível mais abrangente (Domínio) ao mais específico (Espécie): Domínio, Reino, Filo, Classe, Ordem, Família, Gênero, Espécie — cada nível agrupa organismos com características cada vez mais específicas e um parentesco evolutivo cada vez mais próximo.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_9',
    chapter: 'Protozoários e Protozooses',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os protozoários são organismos unicelulares eucarióticos, heterotróficos, que podem causar diversas doenças (protozooses) em humanos. Um exemplo é a malária, causada por um protozoário do gênero:',
    options: [
      { id: 'a', text: 'Plasmodium, transmitido pela picada do mosquito Anopheles' },
      { id: 'b', text: 'Escherichia, uma bactéria intestinal' },
      { id: 'c', text: 'Influenza, um vírus respiratório' },
      { id: 'd', text: 'Penicillium, um fungo' }
    ],
    correctOptionId: 'a',
    explanation: 'A malária é causada por protozoários do gênero Plasmodium, transmitidos pela picada de fêmeas infectadas do mosquito Anopheles, que atuam como vetores biológicos da doença.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_10',
    chapter: 'Protozoários e Protozooses',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A doença de Chagas, protozoose causada pelo Trypanosoma cruzi, é transmitida principalmente por:',
    options: [
      { id: 'a', text: 'Água contaminada, por ingestão direta' },
      { id: 'b', text: 'Fezes de triatomíneos (o "barbeiro"), que contaminam o local da picada quando a pessoa coça a região' },
      { id: 'c', text: 'Contato direto pelo ar, como um vírus respiratório' },
      { id: 'd', text: 'Picada direta do inseto, sem qualquer relação com suas fezes' }
    ],
    correctOptionId: 'b',
    explanation: 'A transmissão da doença de Chagas ocorre principalmente quando o triatomíneo (o "barbeiro"), ao picar a pessoa para se alimentar de sangue, defeca próximo ao local da picada — o protozoário presente nas fezes do inseto penetra no organismo quando a pessoa coça o local, levando as fezes contaminadas para a ferida.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_11',
    chapter: 'Protozoários e Protozooses',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A amebíase, protozoose intestinal causada pela Entamoeba histolytica, é transmitida principalmente por:',
    options: [
      { id: 'a', text: 'Picada de mosquito infectado' },
      { id: 'b', text: 'Ingestão de água ou alimentos contaminados com cistos do protozoário, geralmente por falta de saneamento básico adequado' },
      { id: 'c', text: 'Contato sanguíneo direto, como uma transfusão' },
      { id: 'd', text: 'Herança genética dos pais' }
    ],
    correctOptionId: 'b',
    explanation: 'A amebíase é transmitida principalmente pela via fecal-oral, através da ingestão de água ou alimentos contaminados com cistos de Entamoeba histolytica, um problema associado à falta de saneamento básico e a más condições de higiene.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_12',
    chapter: 'Poríferos e Cnidários',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'As esponjas (filo Porífera), animais aquáticos considerados os mais simples estruturalmente entre os metazoários, se alimentam principalmente por meio de:',
    options: [
      { id: 'a', text: 'Fotossíntese, como as plantas' },
      { id: 'b', text: 'Filtração da água que passa por seu corpo, capturando partículas de alimento (filtração realizada pelos coanócitos)' },
      { id: 'c', text: 'Caça ativa de presas de grande porte' },
      { id: 'd', text: 'Absorção direta de nutrientes do solo' }
    ],
    correctOptionId: 'b',
    explanation: 'As esponjas se alimentam por filtração: células especializadas chamadas coanócitos, localizadas no interior do corpo, criam correntes de água que passam pelo organismo, capturando partículas de alimento (bactérias e outros microrganismos) em suspensão.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_13',
    chapter: 'Poríferos e Cnidários',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os cnidários (como águas-vivas, corais e anêmonas) possuem uma estrutura de defesa e captura de presas característica do filo, chamada:',
    options: [
      { id: 'a', text: 'Coanócitos' },
      { id: 'b', text: 'Cnidócitos, células urticantes que disparam um filamento com substâncias tóxicas ao serem estimuladas' },
      { id: 'c', text: 'Nefrídios' },
      { id: 'd', text: 'Ventosas musculares' }
    ],
    correctOptionId: 'b',
    explanation: 'Os cnidários possuem cnidócitos, células especializadas contendo um filamento enrolado (nematocisto) que é disparado ao ser estimulado, injetando substâncias urticantes/tóxicas usadas tanto para captura de presas quanto para defesa — uma característica exclusiva e definidora do filo.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_14',
    chapter: 'Poríferos e Cnidários',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os recifes de coral, formados por colônias de corais (cnidários), são construídos ao longo de gerações pelo acúmulo de:',
    options: [
      { id: 'a', text: 'Exoesqueletos de carbonato de cálcio secretados pelos pólipos de coral' },
      { id: 'b', text: 'Areia trazida pelas correntes marinhas, sem qualquer participação biológica' },
      { id: 'c', text: 'Restos de plantas terrestres levadas pelo vento' },
      { id: 'd', text: 'Conchas de moluscos exclusivamente' }
    ],
    correctOptionId: 'a',
    explanation: 'Os recifes de coral são estruturas formadas ao longo de muitas gerações pelo acúmulo de exoesqueletos de carbonato de cálcio (calcário) secretados pelos pólipos de coral — pequenos animais cnidários que vivem em colônias, sustentando um dos ecossistemas marinhos de maior biodiversidade do planeta.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_15',
    chapter: 'Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A teníase, verminose intestinal causada pela tênia (um platelminto, ou "verme achatado"), é transmitida principalmente pela ingestão de:',
    options: [
      { id: 'a', text: 'Carne de boi ou porco mal cozida, contendo cisticercos (larvas da tênia)' },
      { id: 'b', text: 'Água do mar contaminada' },
      { id: 'c', text: 'Picada de um inseto vetor' },
      { id: 'd', text: 'Ar contaminado por esporos' }
    ],
    correctOptionId: 'a',
    explanation: 'A teníase é adquirida principalmente pela ingestão de carne (bovina ou suína) mal cozida contendo cisticercos, a forma larval da tênia, que se desenvolve no intestino humano em um verme adulto após a ingestão.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_16',
    chapter: 'Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A ascaridíase, verminose intestinal causada pelo nematódeo (verme cilíndrico) Ascaris lumbricoides, é transmitida principalmente por:',
    options: [
      { id: 'a', text: 'Ingestão de água ou alimentos contaminados com ovos do parasita, geralmente presentes em solo ou água poluídos por fezes humanas' },
      { id: 'b', text: 'Picada de mosquito infectado' },
      { id: 'c', text: 'Contato sexual' },
      { id: 'd', text: 'Herança genética' }
    ],
    correctOptionId: 'a',
    explanation: 'A ascaridíase é transmitida pela via fecal-oral, através da ingestão de água ou alimentos (como verduras mal lavadas) contaminados com ovos do Ascaris lumbricoides, um problema diretamente associado à falta de saneamento básico adequado.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_17',
    chapter: 'Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Uma diferença estrutural fundamental entre platelmintos (vermes achatados, como a tênia) e nematódeos (vermes cilíndricos, como a lombriga) é que:',
    options: [
      { id: 'a', text: 'Platelmintos têm corpo achatado dorsoventralmente, enquanto nematódeos têm corpo cilíndrico, alongado e não segmentado' },
      { id: 'b', text: 'Ambos têm exatamente a mesma forma corporal, sem qualquer diferença' },
      { id: 'c', text: 'Apenas nematódeos são parasitas, enquanto platelmintos nunca causam doenças' },
      { id: 'd', text: 'Platelmintos são sempre maiores que nematódeos' }
    ],
    correctOptionId: 'a',
    explanation: 'Platelmintos têm corpo achatado dorsoventralmente (achatado de cima para baixo, como uma fita), enquanto nematódeos têm corpo cilíndrico, alongado e não segmentado (como um fio) — uma diferença estrutural que dá nome aos dois filos e reflete organizações corporais distintas.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_18',
    chapter: 'Moluscos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os moluscos, filo que inclui caracóis, mexilhões e polvos, apresentam grande diversidade de formas corporais, mas compartilham, entre outras características, a presença de:',
    options: [
      { id: 'a', text: 'Um exoesqueleto de quitina, como os artrópodes' },
      { id: 'b', text: 'Um manto (dobra do corpo que geralmente secreta a concha, quando presente) e um pé muscular, usado para locomoção ou fixação' },
      { id: 'c', text: 'Ausência total de sistema nervoso' },
      { id: 'd', text: 'Corpo sempre segmentado, como os anelídeos' }
    ],
    correctOptionId: 'b',
    explanation: 'Moluscos compartilham características como o manto (uma dobra do corpo que, em muitas espécies, secreta a concha calcária) e um pé muscular, usado para locomoção (como em caracóis), fixação (como em mexilhões) ou mesmo capturar presas (como nos tentáculos de polvos, uma modificação do pé).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_19',
    chapter: 'Moluscos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os cefalópodes (como polvos e lulas), considerados os moluscos com sistema nervoso mais desenvolvido, se destacam por:',
    options: [
      { id: 'a', text: 'Serem os únicos moluscos com concha externa bem desenvolvida' },
      { id: 'b', text: 'Apresentarem comportamentos complexos, como capacidade de aprendizado, camuflagem ativa e, em muitas espécies, redução ou perda da concha externa' },
      { id: 'c', text: 'Não possuírem qualquer tipo de sistema nervoso' },
      { id: 'd', text: 'Serem exclusivamente herbívoros' }
    ],
    correctOptionId: 'b',
    explanation: 'Cefalópodes como polvos e lulas têm o sistema nervoso mais desenvolvido entre os invertebrados, exibindo comportamentos complexos (aprendizado, resolução de problemas) e capacidade de camuflagem ativa (mudança rápida de cor e textura). A maioria das espécies também apresenta redução ou perda evolutiva da concha externa, diferente de outros moluscos como caracóis.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_20',
    chapter: 'Anelídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'As minhocas, anelídeos comuns no solo, são consideradas benéficas para a agricultura principalmente porque:',
    options: [
      { id: 'a', text: 'Consomem exclusivamente as raízes das plantas cultivadas, prejudicando a produção' },
      { id: 'b', text: 'Ao se locomoverem pelo solo e se alimentarem de matéria orgânica, aeram e fertilizam o solo, melhorando sua estrutura e disponibilidade de nutrientes' },
      { id: 'c', text: 'Eliminam completamente a necessidade de água para as plantações' },
      { id: 'd', text: 'Não têm qualquer efeito sobre as propriedades do solo' }
    ],
    correctOptionId: 'b',
    explanation: 'As minhocas beneficiam a agricultura ao se locomoverem através do solo (criando canais que melhoram a aeração e a infiltração de água) e ao se alimentarem de matéria orgânica em decomposição, cujos resíduos (húmus) enriquecem o solo com nutrientes disponíveis às plantas.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_21',
    chapter: 'Anelídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A principal característica estrutural que dá nome ao filo dos anelídeos (como minhocas e sanguessugas) é:',
    options: [
      { id: 'a', text: 'A ausência total de qualquer segmentação corporal' },
      { id: 'b', text: 'O corpo dividido em uma série de segmentos (anéis) repetidos, chamados metâmeros' },
      { id: 'c', text: 'A presença obrigatória de uma concha externa' },
      { id: 'd', text: 'A capacidade exclusiva de voo' }
    ],
    correctOptionId: 'b',
    explanation: 'O nome "anelídeo" reflete a característica definidora do filo: o corpo é dividido em uma série de segmentos (anéis) repetidos, chamados metâmeros, cada um contendo, em geral, estruturas internas e externas semelhantes — uma organização corporal chamada metameria.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_22',
    chapter: 'Artrópodes: Insetos, Crustáceos e Miriápodes',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os insetos, o grupo de artrópodes com maior número de espécies descritas, apresentam corpo tipicamente dividido em três regiões:',
    options: [
      { id: 'a', text: 'Cabeça, tórax e abdômen' },
      { id: 'b', text: 'Cabeça, cefalotórax e cauda' },
      { id: 'c', text: 'Apenas cabeça e corpo, sem qualquer outra divisão' },
      { id: 'd', text: 'Quatro regiões: cabeça, pescoço, tórax e abdômen' }
    ],
    correctOptionId: 'a',
    explanation: 'O corpo dos insetos é tipicamente dividido em três regiões (tagmas): cabeça, tórax (de onde partem as pernas e, quando presentes, as asas) e abdômen — uma organização corporal característica da classe Insecta, diferente de outros artrópodes como os crustáceos (que costumam ter cefalotórax e abdômen).',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_23',
    chapter: 'Artrópodes: Aracnídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os aracnídeos (como aranhas, escorpiões e carrapatos) se diferenciam dos insetos, entre outros aspectos, por apresentarem:',
    options: [
      { id: 'a', text: 'Seis pares de pernas e antenas bem desenvolvidas' },
      { id: 'b', text: 'Quatro pares de pernas, corpo geralmente dividido em cefalotórax e abdômen, e ausência de antenas' },
      { id: 'c', text: 'Asas bem desenvolvidas na maioria das espécies' },
      { id: 'd', text: 'Corpo dividido em cabeça, tórax e abdômen, como os insetos' }
    ],
    correctOptionId: 'b',
    explanation: 'Aracnídeos apresentam quatro pares de pernas (oito ao todo), corpo tipicamente dividido em cefalotórax (fusão de cabeça e tórax) e abdômen, e não possuem antenas — características que os diferenciam claramente dos insetos (seis pernas, três pares, corpo em três regiões, com antenas).',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_24',
    chapter: 'Artrópodes: Aracnídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'As aranhas, aracnídeos predadores, capturam suas presas principalmente por meio de:',
    options: [
      { id: 'a', text: 'Fotossíntese, obtendo energia diretamente da luz solar' },
      { id: 'b', text: 'Veneno inoculado por quelíceras (estruturas bucais especializadas) e, em muitas espécies, teias de seda usadas para capturar presas' },
      { id: 'c', text: 'Filtração de partículas suspensas na água, como as esponjas' },
      { id: 'd', text: 'Absorção direta de nutrientes do ar' }
    ],
    correctOptionId: 'b',
    explanation: 'Aranhas são predadoras que utilizam quelíceras para injetar veneno em suas presas, imobilizando-as ou matando-as, e muitas espécies constroem teias de seda para capturar presas que voam ou se movem próximo a elas — duas adaptações características do grupo.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_25',
    chapter: 'Equinodermos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os equinodermos (como estrelas-do-mar e ouriços-do-mar), animais exclusivamente marinhos, apresentam uma característica estrutural única entre os invertebrados, chamada:',
    options: [
      { id: 'a', text: 'Sistema circulatório fechado, como o dos anelídeos' },
      { id: 'b', text: 'Sistema aquífero (ou vascular aquífero), uma rede de canais preenchidos com água usada para locomoção, alimentação e trocas gasosas' },
      { id: 'c', text: 'Exoesqueleto de quitina, como os artrópodes' },
      { id: 'd', text: 'Ausência total de simetria corporal' }
    ],
    correctOptionId: 'b',
    explanation: 'O sistema aquífero (ou ambulacrário) é uma característica exclusiva dos equinodermos: uma rede interna de canais preenchidos com água que se conecta aos "pés ambulacrários", pequenas estruturas usadas para locomoção, fixação a substratos e, em algumas espécies, para capturar alimento.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_26',
    chapter: 'Equinodermos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'A simetria radial (organização do corpo em torno de um eixo central, geralmente em cinco partes) é uma característica típica dos equinodermos adultos, embora suas larvas apresentem:',
    options: [
      { id: 'a', text: 'Simetria radial idêntica à do adulto, sem qualquer diferença' },
      { id: 'b', text: 'Simetria bilateral, sugerindo uma origem evolutiva a partir de ancestrais com simetria bilateral, com a simetria radial surgindo secundariamente durante o desenvolvimento' },
      { id: 'c', text: 'Ausência completa de qualquer tipo de simetria' },
      { id: 'd', text: 'Simetria radial em seis partes, diferente do adulto' }
    ],
    correctOptionId: 'b',
    explanation: 'Um dado interessante da biologia evolutiva dos equinodermos é que suas larvas (na fase de vida livre) apresentam simetria bilateral, mesmo que os adultos exibam simetria radial — um indício de que o grupo descende evolutivamente de ancestrais com simetria bilateral, e que a simetria radial dos adultos é uma característica derivada, surgida secundariamente.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_zoologia_27',
    chapter: 'Introdução aos Cordados e os Peixes',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os peixes, primeiros vertebrados a surgir na história evolutiva, respiram principalmente por meio de:',
    options: [
      { id: 'a', text: 'Pulmões, como os mamíferos' },
      { id: 'b', text: 'Brânquias, estruturas especializadas na extração de oxigênio dissolvido na água' },
      { id: 'c', text: 'Pele exclusivamente, sem qualquer órgão respiratório especializado' },
      { id: 'd', text: 'Traqueias, como os insetos' }
    ],
    correctOptionId: 'b',
    explanation: 'Os peixes respiram por meio de brânquias, estruturas ricamente vascularizadas que extraem o oxigênio dissolvido na água conforme ela passa sobre elas — uma adaptação eficiente para a vida em ambiente aquático, diferente da respiração pulmonar dos vertebrados terrestres.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_zoologia_28',
    chapter: 'Introdução aos Cordados e os Peixes',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Todos os cordados (filo ao qual pertencem os vertebrados) compartilham, em algum momento do desenvolvimento embrionário, quatro características estruturais básicas, entre elas:',
    options: [
      { id: 'a', text: 'A notocorda, um bastão flexível de sustentação, presente ao longo do dorso do embrião' },
      { id: 'b', text: 'Um exoesqueleto de quitina' },
      { id: 'c', text: 'Ausência total de qualquer estrutura de sustentação corporal' },
      { id: 'd', text: 'Quatro pares de patas bem desenvolvidas' }
    ],
    correctOptionId: 'a',
    explanation: 'A notocorda é uma das características definidoras do filo Chordata, presente em algum momento do desenvolvimento embrionário de todos os cordados — um bastão flexível de sustentação ao longo do dorso, que nos vertebrados é substituído (ou envolvido) pela coluna vertebral durante o desenvolvimento.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_29',
    chapter: 'Moluscos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'O filo Mollusca reúne animais com grande diversidade de forma (caracóis, polvos, mexilhões), mas que compartilham um plano corporal básico comum, incluindo:',
    options: [
      { id: 'a', text: 'Pé muscular (usado para locomoção ou captura de presas), massa visceral e manto (que em muitas espécies secreta uma concha calcária)' },
      { id: 'b', text: 'Exoesqueleto de quitina segmentado, como os artrópodes' },
      { id: 'c', text: 'Sistema ambulacrário, exclusivo de equinodermos' },
      { id: 'd', text: 'Notocorda em algum estágio do desenvolvimento' }
    ],
    correctOptionId: 'a',
    explanation: 'Apesar da grande diversidade de formas entre gastrópodes (caracóis), bivalves (mexilhões) e cefalópodes (polvos, lulas), todos os moluscos compartilham um plano corporal básico com pé muscular, massa visceral (contendo os órgãos internos) e manto — uma dobra do tegumento que, em muitas espécies, secreta uma concha calcária protetora.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_30',
    chapter: 'Anelídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os anelídeos (como a minhoca) apresentam o corpo dividido em uma série de segmentos repetidos (metâmeros). Essa segmentação corporal (metameria) representa uma vantagem evolutiva porque:',
    options: [
      { id: 'a', text: 'Permite maior especialização de diferentes regiões do corpo e movimentos mais eficientes e independentes entre segmentos' },
      { id: 'b', text: 'Impede totalmente a locomoção do animal' },
      { id: 'c', text: 'Elimina a necessidade de qualquer sistema nervoso' },
      { id: 'd', text: 'É exclusiva de anelídeos, não sendo encontrada em nenhum outro filo animal' }
    ],
    correctOptionId: 'a',
    explanation: 'A metameria (segmentação do corpo em unidades repetidas) permite que diferentes segmentos se especializem em funções distintas ao longo da evolução, além de possibilitar movimentos mais eficientes e coordenados (cada segmento pode se contrair de forma relativamente independente, como se observa na locomoção peristáltica das minhocas). A metameria também está presente, de forma diferente, em artrópodes e cordados.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_zoologia_31',
    chapter: 'Artrópodes: Aracnídeos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os aracnídeos (aranhas, escorpiões, ácaros) se diferenciam dos insetos, entre outras características, por apresentarem:',
    options: [
      { id: 'a', text: 'Corpo geralmente dividido em duas regiões (cefalotórax e abdômen) e quatro pares de pernas, sem antenas' },
      { id: 'b', text: 'Corpo dividido em cabeça, tórax e abdômen, com três pares de pernas e um par de antenas' },
      { id: 'c', text: 'Ausência total de qualquer tipo de apêndice locomotor' },
      { id: 'd', text: 'Exoesqueleto composto de celulose, como as plantas' }
    ],
    correctOptionId: 'a',
    explanation: 'Os aracnídeos apresentam corpo tipicamente dividido em cefalotórax e abdômen, quatro pares de pernas locomotoras e ausência de antenas — diferentemente dos insetos, que têm corpo dividido em cabeça, tórax e abdômen distintos, três pares de pernas e um par de antenas. Essas diferenças estruturais ajudam a diferenciar as duas classes dentro do filo Arthropoda.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_zoologia_32',
    chapter: 'Equinodermos',
    topicId: 'bio_zoologia',
    subject: 'Biologia',
    prompt: 'Os equinodermos (como estrelas-do-mar e ouriços-do-mar) possuem um sistema exclusivo do filo, utilizado para locomoção, alimentação e trocas gasosas. Esse sistema é chamado de:',
    options: [
      { id: 'a', text: 'Sistema ambulacrário (ou aquífero), uma rede de canais preenchidos por água que movimenta os pés ambulacrais por variação de pressão hidráulica' },
      { id: 'b', text: 'Sistema circulatório fechado, semelhante ao dos anelídeos' },
      { id: 'c', text: 'Sistema traqueal, semelhante ao dos insetos' },
      { id: 'd', text: 'Sistema nervoso centralizado em um cérebro complexo' }
    ],
    correctOptionId: 'a',
    explanation: 'O sistema ambulacrário (ou aquífero) é exclusivo dos equinodermos: uma rede interna de canais preenchidos por água do mar que, por variações de pressão hidráulica, movimenta pequenas estruturas chamadas pés ambulacrais, usadas na locomoção lenta, na fixação a superfícies, na captura de alimento e também em trocas gasosas — um sistema sem equivalente em nenhum outro filo animal.',
    difficulty: 'hard'
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
    chapter: 'Plantas Terrestres II: Gimnospermas e Angiospermas',
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
    chapter: 'Plantas Terrestres II: Gimnospermas e Angiospermas',
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
    chapter: 'Ciclos de Vida',
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
    chapter: 'Plantas Terrestres II: Gimnospermas e Angiospermas',
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
  {
    id: 'q_bio_botanica_6',
    chapter: 'Fungos',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'A parede celular dos fungos, diferentemente da das plantas, é composta principalmente por:',
    options: [
      { id: 'a', text: 'Celulose' },
      { id: 'b', text: 'Quitina' },
      { id: 'c', text: 'Peptidoglicano' },
      { id: 'd', text: 'Lignina' }
    ],
    correctOptionId: 'b',
    explanation: 'A parede celular fúngica é formada majoritariamente por quitina, um polissacarídeo nitrogenado também encontrado no exoesqueleto de artrópodes — o que distingue os fungos das plantas (parede de celulose) e das bactérias (parede de peptidoglicano), sendo uma das razões pelas quais os fungos formam um reino à parte.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_7',
    chapter: 'Fungos',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'Os fungos obtêm nutrientes de forma heterotrófica por absorção. Isso significa que eles:',
    options: [
      { id: 'a', text: 'Realizam fotossíntese para produzir seu próprio alimento' },
      { id: 'b', text: 'Ingerem partículas sólidas de alimento por fagocitose' },
      { id: 'c', text: 'Secretam enzimas digestivas no ambiente externo e depois absorvem as moléculas simples resultantes' },
      { id: 'd', text: 'Obtêm energia exclusivamente por quimiossíntese' }
    ],
    correctOptionId: 'c',
    explanation: 'Os fungos são heterótrofos por absorção: liberam enzimas digestivas (digestão extracorpórea) que quebram a matéria orgânica do substrato em moléculas pequenas, as quais são então absorvidas através da parede e membrana celular — estratégia essencial ao papel dos fungos como decompositores.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_8',
    chapter: 'Fungos',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'As leveduras (como Saccharomyces cerevisiae), usadas na produção de pão e bebidas fermentadas, são fungos que se destacam por:',
    options: [
      { id: 'a', text: 'Serem sempre pluricelulares e formarem grandes corpos de frutificação visíveis' },
      { id: 'b', text: 'Serem unicelulares e se reproduzirem predominantemente por brotamento (gemulação)' },
      { id: 'c', text: 'Realizarem fotossíntese oxigênica' },
      { id: 'd', text: 'Não realizarem qualquer tipo de respiração celular' }
    ],
    correctOptionId: 'b',
    explanation: 'Leveduras são fungos unicelulares cuja forma mais comum de reprodução assexuada é o brotamento (gemulação), em que uma célula-filha surge como uma protuberância da célula-mãe. Sua fermentação (respiração anaeróbica) é a base da produção de pão, cerveja e vinho.',
    difficulty: 'easy'
  },
  {
    id: 'q_bio_botanica_9',
    chapter: 'Algas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'As algas, organismos fotossintetizantes classificados fora do reino Plantae, têm importância ecológica por serem:',
    options: [
      { id: 'a', text: 'Consumidoras primárias na maioria dos ecossistemas aquáticos' },
      { id: 'b', text: 'Produtoras primárias, responsáveis por grande parte da fotossíntese e da produção de oxigênio nos oceanos' },
      { id: 'c', text: 'Decompositoras exclusivas de matéria orgânica no fundo do oceano' },
      { id: 'd', text: 'Parasitas obrigatórias de peixes e outros organismos marinhos' }
    ],
    correctOptionId: 'b',
    explanation: 'As algas (especialmente o fitoplâncton) são a base da cadeia alimentar aquática como produtoras primárias, realizando fotossíntese e sendo responsáveis por uma fração substancial da produção mundial de oxigênio, além de fixarem grande parte do carbono atmosférico.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_10',
    chapter: 'Algas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'Em relação à organização do corpo das algas, é correto afirmar que:',
    options: [
      { id: 'a', text: 'Todas as algas são obrigatoriamente unicelulares' },
      { id: 'b', text: 'Todas as algas são obrigatoriamente pluricelulares e possuem tecidos verdadeiros como as plantas' },
      { id: 'c', text: 'Há algas unicelulares (como diatomáceas) e pluricelulares (como algumas algas pardas e vermelhas), mas mesmo as pluricelulares não formam tecidos verdadeiros' },
      { id: 'd', text: 'Todas as algas possuem raiz, caule e folha diferenciados' }
    ],
    correctOptionId: 'c',
    explanation: 'As algas apresentam grande diversidade: existem formas unicelulares (diatomáceas, algumas cianobactérias fotossintetizantes) e pluricelulares (macroalgas pardas e vermelhas), mas seu corpo (talo) não possui a diferenciação em tecidos verdadeiros (vasculares, dérmicos, fundamentais) que caracteriza as plantas terrestres — por isso não são classificadas como Plantae.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_11',
    chapter: 'Algas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'A diversidade de pigmentos fotossintéticos entre os grupos de algas (clorofilas, ficoeritrina, ficocianina, fucoxantina) está diretamente relacionada a:',
    options: [
      { id: 'a', text: 'Diferenças aleatórias sem função adaptativa' },
      { id: 'b', text: 'Adaptações que permitem captar comprimentos de onda de luz disponíveis em diferentes profundidades da coluna d\'água' },
      { id: 'c', text: 'Ausência total de fotossíntese em algumas espécies' },
      { id: 'd', text: 'Uma única espécie de alga que apresenta todos esses pigmentos simultaneamente' }
    ],
    correctOptionId: 'b',
    explanation: 'À medida que a profundidade aumenta, a luz solar é filtrada seletivamente pela água (vermelho e laranja são absorvidos primeiro). Pigmentos acessórios como ficoeritrina (algas vermelhas) e fucoxantina (algas pardas) permitem captar comprimentos de onda que penetram mais fundo, possibilitando fotossíntese em profundidades onde a clorofila sozinha seria ineficiente.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_botanica_12',
    chapter: 'Ciclos de Vida',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'O conceito de "alternância de gerações", presente no ciclo de vida de plantas e de várias algas, refere-se à alternância entre:',
    options: [
      { id: 'a', text: 'Uma fase multicelular haploide (gametófito) e uma fase multicelular diploide (esporófito)' },
      { id: 'b', text: 'Duas fases diploides distintas, sem qualquer fase haploide' },
      { id: 'c', text: 'Reprodução exclusivamente assexuada em todas as fases do ciclo' },
      { id: 'd', text: 'Um único indivíduo que nunca produz esporos nem gametas' }
    ],
    correctOptionId: 'a',
    explanation: 'A alternância de gerações caracteriza-se pela sucessão entre uma geração multicelular haploide (gametófito, que produz gametas por mitose) e uma geração multicelular diploide (esporófito, que produz esporos haploides por meiose) — padrão comum a briófitas, pteridófitas, gimnospermas e angiospermas, variando apenas o grau de dominância e redução de cada fase.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_13',
    chapter: 'Plantas Terrestres I: Briófitas e Pteridófitas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'As briófitas (como os musgos) são consideradas plantas terrestres primitivas principalmente porque:',
    options: [
      { id: 'a', text: 'Possuem tecidos vasculares (xilema e floema) bem desenvolvidos' },
      { id: 'b', text: 'Não possuem tecidos vasculares verdadeiros, dependendo de água líquida para a fecundação e apresentando porte pequeno' },
      { id: 'c', text: 'Produzem sementes e flores' },
      { id: 'd', text: 'São exclusivamente aquáticas, nunca ocorrendo em ambiente terrestre' }
    ],
    correctOptionId: 'b',
    explanation: 'As briófitas não possuem tecido vascular verdadeiro (avasculares), o que limita seu porte (geralmente pequeno) e sua distribuição de água/nutrientes por difusão célula a célula. Além disso, seus gametas masculinos flagelados dependem de um filme de água líquida para nadar até o gameta feminino, restringindo-as a ambientes úmidos.',
    difficulty: 'medium'
  },
  {
    id: 'q_bio_botanica_14',
    chapter: 'Plantas Terrestres I: Briófitas e Pteridófitas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'Em relação às pteridófitas (como as samambaias), é correto afirmar que:',
    options: [
      { id: 'a', text: 'São as primeiras plantas a apresentar tecido vascular (xilema e floema), mas ainda dependem de água líquida para a fecundação, como as briófitas' },
      { id: 'b', text: 'Não possuem qualquer tecido de condução de seiva' },
      { id: 'c', text: 'Produzem sementes, como as gimnospermas' },
      { id: 'd', text: 'O esporófito é reduzido e dependente do gametófito, como nas briófitas' }
    ],
    correctOptionId: 'a',
    explanation: 'As pteridófitas foram o primeiro grupo a evoluir tecidos vasculares verdadeiros (xilema e floema), permitindo maior porte e melhor distribuição de água e nutrientes. Porém, assim como as briófitas, ainda produzem gametas masculinos flagelados que dependem de água líquida para atingir o gameta feminino — por isso ainda não são consideradas totalmente independentes da água para reprodução, ao contrário de gimnospermas e angiospermas.',
    difficulty: 'hard'
  },
  {
    id: 'q_bio_botanica_15',
    chapter: 'Plantas Terrestres I: Briófitas e Pteridófitas',
    topicId: 'bio_botanica',
    subject: 'Biologia',
    prompt: 'Nas pteridófitas, a folha adulta enrolada em forma de báculo (chamada "cabeça de bispo" ou crosier), visível antes de se desenrolar completamente, é uma característica de desenvolvimento típica:',
    options: [
      { id: 'a', text: 'Das flores das angiospermas' },
      { id: 'b', text: 'Das folhas jovens (frondes) das samambaias, que se desenrolam à medida que crescem' },
      { id: 'c', text: 'Dos cones das gimnospermas' },
      { id: 'd', text: 'Dos rizoides das briófitas' }
    ],
    correctOptionId: 'b',
    explanation: 'As frondes (folhas) jovens das samambaias emergem enroladas em espiral (crosier ou "cabeça de bispo") e se desenrolam gradualmente durante o crescimento — um padrão de desenvolvimento foliar característico das pteridófitas, distinto do desenvolvimento foliar de gimnospermas e angiospermas.',
    difficulty: 'medium'
  },
  // Física — Cinemática Vetorial
  {
    id: 'q_fis_cinematica_vetorial_1',
    chapter: 'Composição de Movimentos',
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
    chapter: 'Composição de Movimentos',
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
    chapter: 'Grandezas Físicas e Operações com Vetores',
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
    chapter: 'Composição de Movimentos',
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
    chapter: 'Composição de Movimentos',
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
    chapter: 'Órbitas',
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
    chapter: 'Leis da Gravitação',
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
    chapter: 'Dinâmica do Movimento Circular',
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
    chapter: 'Dinâmica do Movimento Circular',
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
    chapter: 'Órbitas',
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
    chapter: 'Trabalho e Energia: Trabalho de uma Força',
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
    chapter: 'Trabalho e Energia: Teorema da Energia Cinética',
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
    chapter: 'Trabalho e Energia: o Teorema da Energia Potencial',
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
    chapter: 'Sistemas Conservativos e Sistemas Não Conservativos',
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
    chapter: 'Sistemas Conservativos e Sistemas Não Conservativos',
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
    chapter: 'Força Elétrica: Lei de Coulomb',
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
    chapter: 'Força Elétrica: Lei de Coulomb',
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
    chapter: 'Campo Elétrico Uniforme: Abordagem Escalar e Abordagem Vetorial',
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
    chapter: 'Dinâmica das Cargas Elétricas',
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
    chapter: 'Mapeamento do Campo Elétrico: Linhas de Força e Superfícies Equipotenciais',
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
    chapter: 'Conceitos Básicos',
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
    chapter: 'Equação Fundamental da Ondulatória',
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
    chapter: 'Conceitos Básicos',
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
    chapter: 'Conceitos Básicos',
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
    chapter: 'Conceitos Básicos',
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
    chapter: 'Noções Básicas de Física Quântica',
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
    chapter: 'Noções Básicas de Física Quântica',
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
    chapter: 'Noções Básicas de Física Quântica',
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
    chapter: 'Noções Básicas de Física Quântica',
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
    chapter: 'Noções Básicas de Física Quântica',
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
    chapter: 'Evolução dos Modelos Atômicos',
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
    chapter: 'Evolução dos Modelos Atômicos',
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
    chapter: 'Evolução dos Modelos Atômicos',
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
    chapter: 'Evolução dos Modelos Atômicos',
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
    chapter: 'Organização da Tabela Periódica dos Elementos',
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
    chapter: 'Radioatividade: o Estudo das Radiações',
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
    chapter: 'Radioatividade: o Estudo das Radiações',
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
    chapter: 'Radioatividade: o Estudo das Radiações',
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
    chapter: 'Radioatividade: o Estudo das Radiações',
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
    chapter: 'Radioatividade: o Estudo das Radiações',
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
    chapter: 'O Estado Gasoso',
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
    chapter: 'O Estado Gasoso',
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
    chapter: 'Estudo dos Gases II',
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
    chapter: 'O Estado Gasoso',
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
    chapter: 'Estudo dos Gases II',
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
    chapter: 'Química Inorgânica',
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
    chapter: 'Equações Iônicas e outras Teorias para Ácidos e Bases',
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
    chapter: 'Equações Iônicas e outras Teorias para Ácidos e Bases',
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
    chapter: 'Química Inorgânica',
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
    chapter: 'Química Inorgânica',
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
    chapter: 'Processos de Oxirredução',
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
    chapter: 'Processos de Oxirredução',
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
    chapter: 'Processos de Oxirredução',
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
    chapter: 'Processos de Oxirredução',
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
    chapter: 'Processos de Oxirredução',
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
    chapter: 'Termoquímica I',
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
    chapter: 'Termoquímica I',
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
    chapter: 'Termoquímica II',
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
    chapter: 'Termoquímica I',
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
    chapter: 'Termoquímica II',
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
    chapter: 'Cinética Química',
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
    chapter: 'Cinética Química',
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
    chapter: 'Cinética Química',
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
    chapter: 'Cinética Química',
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
    chapter: 'Cinética Química',
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
    chapter: 'Introdução ao Estudo das Pilhas e Baterias',
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
    chapter: 'Aspectos Quantitativos da Eletroquímica e Metalurgia',
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
    chapter: 'Eletroquímica de Processos não Espontâneos',
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
    chapter: 'Eletroquímica de Processos não Espontâneos',
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
    chapter: 'Eletroquímica de Processos Espontâneos',
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
    chapter: 'Equilíbrios Químicos I',
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
    chapter: 'Deslocamento de Equilíbrio',
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
    chapter: 'Deslocamento de Equilíbrio',
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
    chapter: 'Deslocamento de Equilíbrio',
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
    chapter: 'Equilíbrios Químicos I',
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
    chapter: 'Concordância',
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
    chapter: 'Crase',
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
  {
    id: 'q_por_norma_culta_3',
    chapter: 'Mecanismo de Regência',
    topicId: 'por_norma_culta',
    subject: 'Português',
    prompt: 'Assinale a alternativa em que a regência verbal está de acordo com a norma-padrão:',
    options: [
      { id: 'a', text: 'Assisti o filme inteiro sem interrupções.' },
      { id: 'b', text: 'Assisti ao filme inteiro sem interrupções.' },
      { id: 'c', text: 'Prefiro mais viajar de trem do que de avião.' },
      { id: 'd', text: 'Namorei com ela por dois anos.' }
    ],
    correctOptionId: 'b',
    explanation: 'O verbo "assistir", no sentido de "ver/presenciar", é transitivo indireto na norma-padrão, exigindo a preposição "a" ("assistir ao filme"). "Preferir" não deve ser reforçado por "mais... do que" (basta "prefiro viajar de trem a viajar de avião"), e "namorar" é transitivo direto, sem a preposição "com".',
    difficulty: 'hard'
  },
  {
    id: 'q_por_norma_culta_4',
    chapter: 'Pronomes',
    topicId: 'por_norma_culta',
    subject: 'Português',
    prompt: 'Assinale a alternativa em que a colocação pronominal está de acordo com a norma-padrão:',
    options: [
      { id: 'a', text: 'Me empresta seu caderno, por favor.' },
      { id: 'b', text: 'Empresta-me seu caderno, por favor.' },
      { id: 'c', text: 'Nunca me falaram sobre isso.' },
      { id: 'd', text: 'Telefonaram-me ontem à noite, mas eu não vi a chamada.' }
    ],
    correctOptionId: 'c',
    explanation: 'Na norma-padrão, a próclise (pronome antes do verbo) é obrigatória quando a frase é iniciada por palavra de sentido negativo, como "nunca" — por isso "nunca me falaram" está correto. Iniciar a frase com o pronome oblíquo átono ("Me empresta") é evitado na norma-padrão escrita formal.',
    difficulty: 'hard'
  },
  {
    id: 'q_por_norma_culta_5',
    chapter: 'Concordância',
    topicId: 'por_norma_culta',
    subject: 'Português',
    prompt: 'Assinale a alternativa em que a concordância nominal está de acordo com a norma-padrão:',
    options: [
      { id: 'a', text: 'Seguem anexo os documentos solicitados.' },
      { id: 'b', text: 'Segue anexas as fotos solicitadas.' },
      { id: 'c', text: 'Está incluso, na embalagem, o manual de instruções.' },
      { id: 'd', text: 'As despesas extras estão incluso na fatura.' }
    ],
    correctOptionId: 'c',
    explanation: '"Anexo" e "incluso" são adjetivos e devem concordar em gênero e número com o substantivo a que se referem. Em "está incluso o manual" (masculino singular), a concordância está correta. Já em "seguem anexo os documentos" (deveria ser "anexos", concordando com "documentos", masculino plural) e "as despesas... incluso" (deveria ser "inclusas", concordando com "despesas", feminino plural), há erro de concordância.',
    difficulty: 'hard'
  },
  // Português — Análise Sintática
  {
    id: 'q_por_sintaxe_1',
    chapter: 'Funções Sintáticas Nominais e Vocativo',
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
    chapter: 'Orações Adverbiais',
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
  {
    id: 'q_por_sintaxe_3',
    chapter: 'Orações Adjetivas',
    topicId: 'por_sintaxe',
    subject: 'Português',
    prompt: 'Na frase "O livro que comprei ontem é excelente", a oração "que comprei ontem" exerce a função de:',
    options: [
      { id: 'a', text: 'Oração subordinada substantiva' },
      { id: 'b', text: 'Oração subordinada adjetiva, restringindo o sentido de "o livro"' },
      { id: 'c', text: 'Oração coordenada assindética' },
      { id: 'd', text: 'Oração subordinada adverbial de tempo' }
    ],
    correctOptionId: 'b',
    explanation: '"Que comprei ontem" retoma e qualifica o antecedente "o livro" (funcionando como um adjetivo), classificando-se como oração subordinada adjetiva — nesse caso, restritiva, pois especifica exatamente qual livro está sendo mencionado.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_sintaxe_4',
    chapter: 'Orações Substantivas',
    topicId: 'por_sintaxe',
    subject: 'Português',
    prompt: 'Na frase "É necessário que os candidatos cheguem cedo ao local de prova", a oração "que os candidatos cheguem cedo ao local de prova" exerce a função sintática de:',
    options: [
      { id: 'a', text: 'Sujeito da oração principal' },
      { id: 'b', text: 'Objeto direto da oração principal' },
      { id: 'c', text: 'Adjunto adverbial' },
      { id: 'd', text: 'Aposto' }
    ],
    correctOptionId: 'a',
    explanation: 'A oração "que os candidatos cheguem cedo..." completa o sentido do predicado "é necessário", funcionando como sujeito da oração principal (equivalente a dizer "Que os candidatos cheguem cedo é necessário") — uma oração subordinada substantiva subjetiva.',
    difficulty: 'hard'
  },
  {
    id: 'q_por_sintaxe_5',
    chapter: 'Funções Sintáticas Nominais e Vocativo',
    topicId: 'por_sintaxe',
    subject: 'Português',
    prompt: 'Na frase "Maria, minha melhor amiga, chegou atrasada à reunião", o termo "minha melhor amiga" exerce a função sintática de:',
    options: [
      { id: 'a', text: 'Predicativo do sujeito' },
      { id: 'b', text: 'Aposto, explicando ou identificando o termo anterior ("Maria")' },
      { id: 'c', text: 'Objeto direto' },
      { id: 'd', text: 'Vocativo' }
    ],
    correctOptionId: 'b',
    explanation: '"Minha melhor amiga" explica/identifica quem é "Maria", sem exercer função verbal (não depende de um verbo de ligação, como ocorreria com um predicativo) — trata-se de um aposto, termo que esclarece ou detalha outro termo da oração.',
    difficulty: 'medium'
  },
  // Português — Entendimento de Texto
  {
    id: 'q_por_texto_1',
    chapter: 'Fatores de Textualidade',
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
    chapter: 'Fatores de Textualidade',
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
  {
    id: 'q_por_texto_3',
    chapter: 'Os Dois Níveis da Leitura',
    topicId: 'por_texto',
    subject: 'Português',
    prompt: 'Ao interpretar um texto, a diferença entre uma informação explícita e uma informação implícita (uma inferência) é que:',
    options: [
      { id: 'a', text: 'A informação explícita está diretamente escrita no texto; a informação implícita precisa ser deduzida a partir de pistas textuais e do contexto, sem estar literalmente escrita' },
      { id: 'b', text: 'Não existe qualquer diferença entre os dois tipos de informação' },
      { id: 'c', text: 'A informação implícita é sempre falsa, enquanto a explícita é sempre verdadeira' },
      { id: 'd', text: 'Apenas textos literários possuem informações implícitas' }
    ],
    correctOptionId: 'a',
    explanation: 'Informações explícitas estão diretamente escritas no texto, podendo ser localizadas literalmente. Informações implícitas (inferências) não estão escritas diretamente, mas podem ser deduzidas logicamente a partir de pistas textuais, do contexto e do conhecimento de mundo do leitor.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_texto_4',
    chapter: 'Modelos de Leitura e Distorções Interpretativas',
    topicId: 'por_texto',
    subject: 'Português',
    prompt: 'Identificar a intenção comunicativa de um autor (por exemplo, se ele pretende convencer, criticar ironicamente ou informar de forma neutra) é uma habilidade de leitura fundamental porque:',
    options: [
      { id: 'a', text: 'O sentido de um texto pode mudar significativamente dependendo dessa intenção — um texto irônico, por exemplo, pode expressar o oposto do que está literalmente escrito' },
      { id: 'b', text: 'Todo texto tem exatamente a mesma intenção comunicativa, independentemente do gênero' },
      { id: 'c', text: 'A intenção do autor nunca pode ser identificada com segurança' },
      { id: 'd', text: 'Apenas textos jornalísticos possuem intenção comunicativa' }
    ],
    correctOptionId: 'a',
    explanation: 'Reconhecer a intenção comunicativa é essencial porque o sentido de um texto pode depender diretamente dela — um exemplo claro é a ironia, em que o autor comunica, propositalmente, o oposto do sentido literal das palavras, e o leitor precisa reconhecer essa intenção para interpretar corretamente o texto.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_texto_5',
    chapter: 'Fatores de Textualidade',
    topicId: 'por_texto',
    subject: 'Português',
    prompt: 'Quando um texto argumentativo apresenta um contra-argumento (uma ideia contrária à tese) para em seguida refutá-lo, essa estratégia é utilizada principalmente para:',
    options: [
      { id: 'a', text: 'Enfraquecer a própria tese defendida pelo autor' },
      { id: 'b', text: 'Antecipar e neutralizar possíveis objeções do leitor, fortalecendo a argumentação ao demonstrar que o autor considerou pontos de vista diferentes' },
      { id: 'c', text: 'Confundir o leitor propositalmente, sem qualquer função argumentativa' },
      { id: 'd', text: 'Substituir a necessidade de apresentar argumentos próprios' }
    ],
    correctOptionId: 'b',
    explanation: 'Apresentar e refutar um contra-argumento é uma estratégia argumentativa que fortalece o texto: ao antecipar possíveis objeções e respondê-las de forma consistente, o autor demonstra domínio do tema e neutraliza objeções antes mesmo que o leitor as formule, reforçando a credibilidade da tese defendida.',
    difficulty: 'hard'
  },
  // Português — Literatura Clássica, Medieval e Barroca
  {
    id: 'q_por_lit_classica_barroca_1',
    chapter: 'A Estética Barroca',
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
    chapter: 'A Estética Barroca',
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
  {
    id: 'q_por_lit_classica_barroca_3',
    chapter: 'Renascimento e Camões',
    topicId: 'por_lit_classica_barroca',
    subject: 'Português',
    prompt: 'O Classicismo, movimento literário que antecedeu o Barroco em Portugal (com Luís de Camões como principal expoente), caracterizava-se, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'A valorização do equilíbrio, da razão e dos modelos greco-romanos, em oposição aos exageros e conflitos que marcariam o Barroco posterior' },
      { id: 'b', text: 'A exaltação exclusiva do sentimentalismo subjetivo, sem qualquer preocupação formal' },
      { id: 'c', text: 'Uma linguagem popular e coloquial, sem qualquer influência clássica' },
      { id: 'd', text: 'Temas voltados exclusivamente à vida cotidiana urbana moderna' }
    ],
    correctOptionId: 'a',
    explanation: 'O Classicismo valorizava o equilíbrio, a razão e o retorno aos modelos estéticos greco-romanos (mitologia, formas poéticas clássicas), buscando harmonia formal — características que contrastam com os conflitos, exageros e o jogo de opostos que marcariam o Barroco na sequência.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_classica_barroca_4',
    chapter: 'Renascimento e Camões',
    topicId: 'por_lit_classica_barroca',
    subject: 'Português',
    prompt: 'A obra "Os Lusíadas", de Luís de Camões, é considerada um marco da literatura em língua portuguesa principalmente por:',
    options: [
      { id: 'a', text: 'Narrar, em versos épicos, as navegações portuguesas e a viagem de Vasco da Gama à Índia, celebrando os feitos históricos de Portugal' },
      { id: 'b', text: 'Ser uma obra em prosa, sem qualquer relação com a poesia épica' },
      { id: 'c', text: 'Tratar exclusivamente de temas religiosos, sem qualquer relação com a história de Portugal' },
      { id: 'd', text: 'Ter sido escrita originalmente em espanhol e depois traduzida' }
    ],
    correctOptionId: 'a',
    explanation: '"Os Lusíadas" é um poema épico que narra, com forte influência dos modelos clássicos greco-romanos (como a Eneida, de Virgílio), as navegações portuguesas e a viagem de Vasco da Gama à Índia, celebrando os feitos históricos e a identidade nacional portuguesa — sendo uma das obras mais importantes da literatura em língua portuguesa.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_classica_barroca_5',
    chapter: 'A Estética Barroca',
    topicId: 'por_lit_classica_barroca',
    subject: 'Português',
    prompt: 'O jogo entre cultismo (valorização da forma, dos jogos de palavras e das metáforas rebuscadas) e conceptismo (valorização do conteúdo, da argumentação lógica e do jogo de ideias) no Barroco reflete, em última análise, o conflito central desse movimento entre:',
    options: [
      { id: 'a', text: 'Fé (valores religiosos) e razão/mundo terreno (prazeres materiais), típico da mentalidade da Contrarreforma' },
      { id: 'b', text: 'Presente e futuro, sem qualquer relação com questões religiosas' },
      { id: 'c', text: 'Cidade e campo, como única tensão temática relevante' },
      { id: 'd', text: 'Nenhum conflito relevante, sendo um estilo puramente decorativo' }
    ],
    correctOptionId: 'a',
    explanation: 'O Barroco reflete o conflito característico de sua época (marcada pela Contrarreforma católica): a tensão entre os valores religiosos e espirituais (fé, pecado, salvação) e os prazeres e tentações do mundo terreno e material — um dilema existencial que se manifesta tanto no conteúdo dos textos quanto no próprio jogo estilístico entre cultismo e conceptismo.',
    difficulty: 'hard'
  },
  // Português — Romantismo e Realismo
  {
    id: 'q_por_lit_romantismo_realismo_1',
    chapter: 'A Estética Romântica: Prosa',
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
    chapter: 'Machado de Assis',
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
  {
    id: 'q_por_lit_romantismo_realismo_3',
    chapter: 'A Estética Romântica: Prosa',
    topicId: 'por_lit_romantismo_realismo',
    subject: 'Português',
    prompt: 'O indianismo, tema recorrente na obra de José de Alencar durante o Romantismo brasileiro (como em "Iracema" e "O Guarani"), representa uma tentativa de:',
    options: [
      { id: 'a', text: 'Retratar de forma documental e crítica a situação real dos povos indígenas no Brasil do século XIX' },
      { id: 'b', text: 'Construir uma identidade nacional idealizada, elevando o indígena a uma figura heroica e nobre, associada às origens do Brasil' },
      { id: 'c', text: 'Criticar duramente a colonização portuguesa, sem qualquer idealização' },
      { id: 'd', text: 'Descrever exclusivamente a vida urbana das grandes cidades brasileiras' }
    ],
    correctOptionId: 'b',
    explanation: 'O indianismo romântico não pretendia ser um retrato realista da vida indígena, mas sim uma construção idealizada e heroica do indígena como símbolo das origens nobres da nação brasileira, servindo ao projeto romântico de construção de uma identidade nacional — um tratamento bem diferente da complexidade social real vivida pelos povos indígenas.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_romantismo_realismo_4',
    chapter: 'Naturalismo',
    topicId: 'por_lit_romantismo_realismo',
    subject: 'Português',
    prompt: 'O Naturalismo, movimento literário próximo ao Realismo (com Aluísio Azevedo como principal nome no Brasil, autor de "O Cortiço"), se diferencia por:',
    options: [
      { id: 'a', text: 'Retratar personagens fortemente influenciados por fatores biológicos e sociais (como hereditariedade, meio ambiente e instintos), muitas vezes em ambientes de degradação social' },
      { id: 'b', text: 'Idealizar completamente os personagens, sem qualquer traço de crítica social' },
      { id: 'c', text: 'Evitar completamente qualquer descrição do ambiente social dos personagens' },
      { id: 'd', text: 'Focar exclusivamente em temas religiosos e espirituais' }
    ],
    correctOptionId: 'a',
    explanation: 'O Naturalismo radicaliza a objetividade do Realismo, incorporando fortes influências das ciências naturais da época (como o determinismo biológico e social), retratando personagens condicionados por hereditariedade, instintos e o ambiente social em que vivem — muitas vezes em cenários de degradação e miséria, como no cortiço retratado por Aluísio Azevedo.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_romantismo_realismo_5',
    chapter: 'Machado de Assis',
    topicId: 'por_lit_romantismo_realismo',
    subject: 'Português',
    prompt: 'Machado de Assis, em romances como "Dom Casmurro" e "Memórias Póstumas de Brás Cubas", é reconhecido por uma característica narrativa marcante, que é:',
    options: [
      { id: 'a', text: 'O uso de narradores completamente confiáveis e objetivos, sem qualquer ambiguidade' },
      { id: 'b', text: 'O uso de narradores em primeira pessoa cuja confiabilidade é questionável, deixando ao leitor a tarefa de interpretar criticamente os fatos narrados' },
      { id: 'c', text: 'A ausência total de análise psicológica dos personagens' },
      { id: 'd', text: 'O uso exclusivo de narração em terceira pessoa onisciente e imparcial' }
    ],
    correctOptionId: 'b',
    explanation: 'Uma marca central da obra de Machado de Assis é o uso de narradores em primeira pessoa cuja confiabilidade é ambígua ou questionável — como Bentinho em "Dom Casmurro", cuja versão sobre a suposta traição de Capitu é contada apenas por sua própria perspectiva, deixando ao leitor a tarefa de julgar criticamente os fatos, sem uma verdade definitiva apresentada pelo texto.',
    difficulty: 'hard'
  },
  // Português — Simbolismo, Pré-Modernismo e Modernismo
  {
    id: 'q_por_lit_modernismo_1',
    chapter: 'Semana de Arte Moderna',
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
    chapter: 'Simbolismo',
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
  {
    id: 'q_por_lit_modernismo_3',
    chapter: 'Modernismo no Brasil: Primeira Geração',
    topicId: 'por_lit_modernismo',
    subject: 'Português',
    prompt: 'A primeira fase do Modernismo brasileiro (fase heroica, 1922-1930) é caracterizada, entre outros aspectos, por:',
    options: [
      { id: 'a', text: 'Um forte espírito de ruptura e experimentação, com a valorização do verso livre, da linguagem coloquial e de temas nacionais tratados de forma inovadora, muitas vezes com humor e irreverência' },
      { id: 'b', text: 'Um apego rígido às formas poéticas clássicas, sem qualquer inovação' },
      { id: 'c', text: 'A ausência total de qualquer preocupação com a identidade nacional' },
      { id: 'd', text: 'Uma linguagem exclusivamente rebuscada e distante da fala cotidiana' }
    ],
    correctOptionId: 'a',
    explanation: 'A fase heroica do Modernismo brasileiro (iniciada com a Semana de Arte Moderna de 1922) é marcada pelo espírito de ruptura com o passado acadêmico, pela experimentação formal (verso livre, ausência de rima obrigatória), pela valorização da linguagem coloquial e por uma abordagem inovadora e muitas vezes irreverente de temas nacionais — como em obras de Mário de Andrade e Oswald de Andrade.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_modernismo_4',
    chapter: 'Pré-Modernismo',
    topicId: 'por_lit_modernismo',
    subject: 'Português',
    prompt: 'O Pré-Modernismo, movimento de transição no início do século XX (com Euclides da Cunha e Lima Barreto como nomes de destaque), caracteriza-se principalmente por:',
    options: [
      { id: 'a', text: 'Um retrato idealizado e romantizado da realidade social brasileira' },
      { id: 'b', text: 'Uma abordagem crítica das contradições sociais brasileiras (como o contraste entre litoral e sertão, ou as desigualdades urbanas), com estilo ainda em transição entre estéticas do século XIX e o Modernismo posterior' },
      { id: 'c', text: 'A ausência total de qualquer crítica social' },
      { id: 'd', text: 'A adoção exclusiva do verso livre, sem qualquer traço de prosa realista' }
    ],
    correctOptionId: 'b',
    explanation: 'O Pré-Modernismo, exemplificado por obras como "Os Sertões" (Euclides da Cunha, sobre a Guerra de Canudos) e "Triste Fim de Policarpo Quaresma" (Lima Barreto), aborda de forma crítica contradições sociais brasileiras, com um estilo de transição entre características ainda ligadas ao século XIX e antecipações do espírito crítico e nacional que seria plenamente desenvolvido pelo Modernismo.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_modernismo_5',
    chapter: 'Modernismo no Brasil: Primeira Geração',
    topicId: 'por_lit_modernismo',
    subject: 'Português',
    prompt: 'O "Manifesto Antropófago" (1928), de Oswald de Andrade, propunha, como estratégia de construção de uma identidade cultural brasileira, a ideia de:',
    options: [
      { id: 'a', text: 'Rejeitar completamente qualquer influência cultural estrangeira' },
      { id: 'b', text: '"Devorar" (assimilar criticamente) influências culturais estrangeiras e nacionais, recombinando-as de forma original para criar algo genuinamente brasileiro, em vez de apenas copiar modelos europeus' },
      { id: 'c', text: 'Copiar fielmente os modelos literários europeus, sem qualquer adaptação' },
      { id: 'd', text: 'Abandonar completamente qualquer referência à cultura indígena ou africana' }
    ],
    correctOptionId: 'b',
    explanation: 'A metáfora da "antropofagia" (devorar) proposta por Oswald de Andrade defendia que a cultura brasileira deveria assimilar criticamente (e não simplesmente copiar) influências externas e internas — europeias, indígenas, africanas — "devorando-as" e recombinando-as de forma original, gerando uma produção cultural genuinamente brasileira, e não uma mera imitação de modelos estrangeiros.',
    difficulty: 'hard'
  },
  // Português — Literatura Contemporânea
  {
    id: 'q_por_lit_contemporanea_1',
    chapter: 'Prosa Brasileira Contemporânea',
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
    chapter: 'Clarice Lispector',
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
  {
    id: 'q_por_lit_contemporanea_3',
    topicId: 'por_lit_contemporanea',
    subject: 'Português',
    prompt: 'A Geração de 1945, na poesia brasileira (com nomes como João Cabral de Melo Neto), é frequentemente descrita como uma reação:',
    options: [
      { id: 'a', text: 'Ao excesso de subjetivismo e informalidade da primeira fase modernista, propondo um retorno a maior rigor formal e objetividade na construção poética' },
      { id: 'b', text: 'Contra qualquer forma de rigor ou disciplina na escrita poética' },
      { id: 'c', text: 'Ao Barroco, movimento imediatamente anterior' },
      { id: 'd', text: 'Contra a própria existência da poesia como gênero literário' }
    ],
    correctOptionId: 'a',
    explanation: 'A Geração de 1945 (poesia de "45") reagiu ao que considerava um excesso de informalidade e subjetivismo herdado da primeira fase do Modernismo, propondo maior rigor formal, objetividade e um trabalho mais cuidadoso e "arquitetônico" com a linguagem — como se observa na poesia extremamente controlada e precisa de João Cabral de Melo Neto.',
    difficulty: 'hard'
  },
  {
    id: 'q_por_lit_contemporanea_4',
    chapter: 'Prosa Brasileira Contemporânea',
    topicId: 'por_lit_contemporanea',
    subject: 'Português',
    prompt: 'A literatura marginal (ou literatura periférica), que ganhou visibilidade crescente no Brasil a partir das últimas décadas, se caracteriza por:',
    options: [
      { id: 'a', text: 'Ser produzida exclusivamente por autores de classe média alta, sem qualquer relação com as periferias urbanas' },
      { id: 'b', text: 'Dar voz literária a experiências e perspectivas de moradores de periferias urbanas, muitas vezes retratando de dentro (e não apenas sobre) a realidade social dessas comunidades' },
      { id: 'c', text: 'Evitar completamente qualquer crítica social' },
      { id: 'd', text: 'Ser um movimento restrito exclusivamente à poesia clássica' }
    ],
    correctOptionId: 'b',
    explanation: 'A literatura marginal/periférica é caracterizada por autores que, muitas vezes vindos das próprias periferias urbanas, narram essas realidades a partir de dentro — em contraste com uma tradição literária anterior que costumava retratar essas realidades a partir de uma perspectiva externa — trazendo novas vozes e perspectivas à literatura brasileira contemporânea.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_lit_contemporanea_5',
    chapter: 'Prosa Brasileira Contemporânea',
    topicId: 'por_lit_contemporanea',
    subject: 'Português',
    prompt: 'O crescente reconhecimento de autoras e autores negros na literatura brasileira contemporânea (como Conceição Evaristo, entre outros) tem contribuído para:',
    options: [
      { id: 'a', text: 'Ampliar as perspectivas e temas presentes na literatura nacional, incluindo experiências historicamente sub-representadas no cânone literário brasileiro' },
      { id: 'b', text: 'Reduzir a diversidade temática da literatura brasileira' },
      { id: 'c', text: 'Restringir a literatura brasileira a um único tema exclusivo' },
      { id: 'd', text: 'Eliminar completamente a produção de outros grupos de autores' }
    ],
    correctOptionId: 'a',
    explanation: 'O crescente espaço conquistado por autoras e autores negros na literatura contemporânea contribui para ampliar a diversidade de vozes, perspectivas e temas presentes na produção literária nacional, trazendo experiências e olhares historicamente sub-representados no cânone literário brasileiro tradicional.',
    difficulty: 'medium'
  },
  // Português — Fundamentos da Dissertação
  {
    id: 'q_por_red_fundamentos_1',
    chapter: 'A Dissertação no Vestibular: Mitos e Verdades',
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
    chapter: 'Estrutura Clássica do Texto Dissertativo',
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
  {
    id: 'q_por_red_fundamentos_3',
    chapter: 'Estrutura Clássica do Texto Dissertativo',
    topicId: 'por_red_fundamentos',
    subject: 'Português',
    prompt: 'A tese de uma redação dissertativo-argumentativa deve, idealmente, ser apresentada:',
    options: [
      { id: 'a', text: 'Apenas na conclusão do texto, nunca antes' },
      { id: 'b', text: 'Já na introdução, de forma clara, para orientar o leitor sobre qual será o ponto de vista defendido e sustentado ao longo do texto' },
      { id: 'c', text: 'De forma ambígua, deixando o leitor sem saber qual é o posicionamento do candidato' },
      { id: 'd', text: 'Somente de forma implícita, sem nunca ser explicitada diretamente' }
    ],
    correctOptionId: 'b',
    explanation: 'A tese deve ser apresentada de forma clara já na introdução, orientando o leitor sobre o ponto de vista que será defendido — os argumentos do desenvolvimento e a conclusão devem estar diretamente conectados a essa tese inicial, sem ambiguidade sobre o posicionamento do candidato.',
    difficulty: 'easy'
  },
  {
    id: 'q_por_red_fundamentos_4',
    chapter: 'A Dissertação no Vestibular: Mitos e Verdades',
    topicId: 'por_red_fundamentos',
    subject: 'Português',
    prompt: 'Diferentemente de um texto dissertativo-expositivo (que apenas expõe informações sobre um tema, de forma mais neutra), o texto dissertativo-argumentativo se distingue por:',
    options: [
      { id: 'a', text: 'Necessariamente incluir diálogos entre personagens' },
      { id: 'b', text: 'Defender explicitamente um ponto de vista sobre o tema, buscando convencer o leitor por meio de argumentos, e não apenas informar de forma neutra' },
      { id: 'c', text: 'Ser escrito exclusivamente em terceira pessoa' },
      { id: 'd', text: 'Não poder utilizar dados ou repertório sociocultural' }
    ],
    correctOptionId: 'b',
    explanation: 'Enquanto o texto dissertativo-expositivo busca apenas apresentar/explicar informações sobre um tema de forma mais neutra, o dissertativo-argumentativo vai além: defende explicitamente um ponto de vista (tese), buscando convencer o leitor por meio de argumentos organizados — a modalidade exigida, por exemplo, na redação do ENEM.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_fundamentos_5',
    chapter: 'Tangenciamento e Fuga: a Fronteira do Tema',
    topicId: 'por_red_fundamentos',
    subject: 'Português',
    prompt: 'A "fuga ao tema", um dos erros mais graves em uma redação (podendo até zerar o texto em exames como o ENEM), ocorre quando o candidato:',
    options: [
      { id: 'a', text: 'Aborda uma perspectiva menos comum, mas ainda dentro do tema proposto' },
      { id: 'b', text: 'Desenvolve um texto sobre um assunto diferente do que foi efetivamente proposto, ainda que de alguma forma relacionado superficialmente a ele' },
      { id: 'c', text: 'Utiliza repertório sociocultural pouco conhecido' },
      { id: 'd', text: 'Apresenta uma tese muito específica sobre o tema' }
    ],
    correctOptionId: 'b',
    explanation: 'A fuga ao tema ocorre quando o texto produzido não trata efetivamente do assunto especificamente proposto pela banca, ainda que mantenha alguma relação superficial ou tangencial com ele — um erro grave porque o texto deixa de responder ao que foi realmente solicitado, sendo penalizado severamente (podendo até zerar a redação em exames como o ENEM).',
    difficulty: 'medium'
  },
  // Português — Leitura de Coletânea e Repertório Temático
  {
    id: 'q_por_red_repertorio_1',
    chapter: 'Lendo a Coletânea: a Apreensão de Sentidos I',
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
  {
    id: 'q_por_red_repertorio_3',
    topicId: 'por_red_repertorio',
    subject: 'Português',
    prompt: 'Além dos textos motivadores da coletânea (fornecidos pela banca), um repertório sociocultural amplo e diversificado (histórico, filosófico, científico, artístico, entre outros) é valorizado em uma redação principalmente porque:',
    options: [
      { id: 'a', text: 'Demonstra maior domínio do tema e capacidade de conectar diferentes áreas do conhecimento à argumentação, desde que bem articulado' },
      { id: 'b', text: 'É avaliado exclusivamente pela quantidade de referências citadas, independentemente da articulação' },
      { id: 'c', text: 'Substitui totalmente a necessidade de uma tese própria' },
      { id: 'd', text: 'É irrelevante para a nota final da redação' }
    ],
    correctOptionId: 'a',
    explanation: 'Um repertório amplo e diversificado, quando bem articulado ao argumento, demonstra ao avaliador que o candidato consegue conectar diferentes áreas do conhecimento (história, filosofia, ciência, arte) à discussão proposta — o que é valorizado nos critérios de avaliação, desde que a articulação (e não apenas a quantidade de citações) seja pertinente e produtiva.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_repertorio_4',
    topicId: 'por_red_repertorio',
    subject: 'Português',
    prompt: 'Um erro comum ao utilizar repertório sociocultural em uma redação é:',
    options: [
      { id: 'a', text: 'Citar uma referência de forma genérica, sem conectá-la especificamente ao argumento sendo desenvolvido, tratando-a como um "enfeite" desconectado do raciocínio' },
      { id: 'b', text: 'Escolher uma referência diretamente relacionada ao argumento em discussão' },
      { id: 'c', text: 'Explicar brevemente como a referência se conecta ao ponto defendido' },
      { id: 'd', text: 'Usar uma referência que o candidato de fato compreende bem' }
    ],
    correctOptionId: 'a',
    explanation: 'Um erro frequente é citar uma referência (um filme, um livro, um dado histórico) de forma solta e genérica, sem de fato conectá-la ao argumento específico que está sendo desenvolvido — tratando-a como um "enfeite" textual, e não como parte real da sustentação lógica do argumento.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_repertorio_5',
    topicId: 'por_red_repertorio',
    subject: 'Português',
    prompt: 'Ao se preparar para a prova de redação, construir um repertório sociocultural amplo com antecedência (lendo sobre diferentes temas, história, atualidades) é uma estratégia recomendada principalmente porque:',
    options: [
      { id: 'a', text: 'Garante automaticamente a nota máxima, independentemente da qualidade da argumentação' },
      { id: 'b', text: 'Aumenta a chance de o candidato ter, no momento da prova, referências pertinentes disponíveis para conectar de forma consistente ao tema sorteado, o que pode ser mais difícil de improvisar sob pressão' },
      { id: 'c', text: 'É desnecessário, já que a coletânea da prova sempre é suficiente sozinha' },
      { id: 'd', text: 'Só é útil para temas de ciências exatas' }
    ],
    correctOptionId: 'b',
    explanation: 'Construir repertório com antecedência amplia o "banco" de referências disponíveis ao candidato, aumentando a chance de que, no dia da prova, ele já tenha conhecimento prévio sobre aspectos relacionados ao tema sorteado — uma vantagem importante, já que buscar e articular referências pertinentes de improviso, sob pressão do tempo de prova, é consideravelmente mais difícil.',
    difficulty: 'medium'
  },
  // Português — Direitos Humanos e Redações Modelo
  {
    id: 'q_por_red_direitos_modelo_1',
    chapter: 'Os Direitos Humanos de 1ª Geração: Direitos Individuais',
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
    chapter: 'Os Direitos Humanos de 1ª Geração: Direitos Individuais',
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
  {
    id: 'q_por_red_direitos_modelo_3',
    chapter: 'Redações Nota 1000: Trunfos a Inspirar',
    topicId: 'por_red_direitos_modelo',
    subject: 'Português',
    prompt: 'Redações consideradas "nota 1000" pelo ENEM costumam compartilhar, entre outras características:',
    options: [
      { id: 'a', text: 'Um domínio da norma-padrão da língua, argumentação consistente e bem estruturada, repertório sociocultural produtivo e articulado, e uma proposta de intervenção detalhada e coerente com os argumentos do texto' },
      { id: 'b', text: 'Um texto extenso, independentemente da qualidade dos argumentos' },
      { id: 'c', text: 'O uso de linguagem extremamente rebuscada, mesmo quando prejudica a clareza' },
      { id: 'd', text: 'A ausência total de qualquer repertório sociocultural, focando apenas na opinião pessoal do candidato' }
    ],
    correctOptionId: 'a',
    explanation: 'Redações nota máxima combinam bom domínio da norma-padrão, argumentação consistente e organizada, repertório sociocultural bem articulado ao tema, e uma proposta de intervenção completa e coerente com o restante do texto — a excelência não está no tamanho do texto ou na complexidade artificial da linguagem, mas na qualidade e coerência de todos esses elementos combinados.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_direitos_modelo_4',
    chapter: 'Os Direitos Humanos de 1ª Geração: Direitos Individuais',
    topicId: 'por_red_direitos_modelo',
    subject: 'Português',
    prompt: 'Ao discutir um tema como a violência urbana em uma redação, um candidato que sugere, mesmo implicitamente, que certos grupos sociais "merecem" ser tratados com violência estaria:',
    options: [
      { id: 'a', text: 'Fazendo uma análise puramente técnica, sem qualquer problema ético' },
      { id: 'b', text: 'Violando o princípio de respeito aos direitos humanos, o que pode resultar em penalização severa (incluindo zerar a redação em exames como o ENEM)' },
      { id: 'c', text: 'Demonstrando originalidade argumentativa, o que seria bem avaliado' },
      { id: 'd', text: 'Seguindo a estrutura ideal de uma proposta de intervenção' }
    ],
    correctOptionId: 'b',
    explanation: 'Qualquer proposta ou argumentação que sugira, mesmo implicitamente, a legitimidade de tratamento violento ou desumano contra qualquer grupo social viola o princípio de respeito aos direitos humanos — um critério que, em exames como o ENEM, pode levar à atribuição de nota zero à redação inteira, independentemente da qualidade técnica de outros aspectos do texto.',
    difficulty: 'medium'
  },
  {
    id: 'q_por_red_direitos_modelo_5',
    chapter: 'Os Direitos Humanos de 2ª e 3ª Geração: Direitos Sociais, Coletivos e Difusos',
    topicId: 'por_red_direitos_modelo',
    subject: 'Português',
    prompt: 'Ao abordar um tema social sensível, como a situação de pessoas em vulnerabilidade social, uma redação que evita estigmatizar ou culpabilizar individualmente essas pessoas, buscando entender fatores estruturais (sociais, econômicos, históricos) por trás da situação, demonstra:',
    options: [
      { id: 'a', text: 'Uma análise superficial, sem qualquer profundidade' },
      { id: 'b', text: 'Uma abordagem mais madura e sofisticada do tema, capaz de ir além de explicações simplistas, articulando fatores estruturais à discussão' },
      { id: 'c', text: 'Um desrespeito às normas de redação' },
      { id: 'd', text: 'Uma fuga completa ao tema proposto' }
    ],
    correctOptionId: 'b',
    explanation: 'Analisar um tema social sensível considerando fatores estruturais (em vez de simplesmente culpabilizar indivíduos pela própria situação) demonstra uma abordagem mais madura e sofisticada, capaz de articular causas mais profundas à discussão — uma qualidade valorizada na avaliação da competência argumentativa de uma redação.',
    difficulty: 'hard'
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
  },
  {
    id: 'q_ing_01_3',
    chapter: 'Text Comprehension: Global Warming',
    topicId: 'ing_01',
    subject: 'Inglês',
    prompt: 'Read the excerpt below and answer the question.\n\n"Climate scientists warn that unless global emissions are cut drastically within the next decade, some of the damage caused to ecosystems could become irreversible. Governments, however, have been slow to agree on binding targets, often citing economic concerns."\n\nWhat is the main tension presented in this excerpt?',
    options: [
      { id: 'a', text: 'Between two different groups of scientists who disagree about climate change' },
      { id: 'b', text: 'Between the urgency scientists describe for emission cuts and the slow pace of government action, often justified by economic concerns' },
      { id: 'c', text: 'Between governments that want faster action and scientists who are more cautious' },
      { id: 'd', text: 'There is no tension; both scientists and governments fully agree on the same timeline' }
    ],
    correctOptionId: 'b',
    explanation: 'The excerpt sets up a contrast (signaled by "however") between the urgency scientists place on cutting emissions and the comparatively slow response from governments, who cite economic concerns as a reason for delay.',
    difficulty: 'medium'
  },
  {
    id: 'q_ing_01_4',
    topicId: 'ing_01',
    subject: 'Inglês',
    prompt: 'Read the excerpt below and answer the question.\n\n"She used to dismiss social media as a waste of time. Nowadays, however, she relies on it daily to keep up with news and friends abroad."\n\nWhat does the phrase "used to" indicate about the subject\'s past behavior?',
    options: [
      { id: 'a', text: 'That she still holds the same opinion about social media today' },
      { id: 'b', text: 'That she had a habitual attitude or behavior in the past that is no longer true in the present' },
      { id: 'c', text: 'That she will dismiss social media again in the future' },
      { id: 'd', text: 'That the sentence is describing a hypothetical situation, not something that really happened' }
    ],
    correctOptionId: 'b',
    explanation: '"Used to" describes a habitual state or repeated action in the past that no longer applies now — here, signaling that she previously dismissed social media, a stance clearly contrasted (via "however" and "nowadays") with her current daily reliance on it.',
    difficulty: 'easy'
  },
  {
    id: 'q_ing_01_5',
    topicId: 'ing_01',
    subject: 'Inglês',
    prompt: 'Read the excerpt below and answer the question.\n\n"Had the company invested earlier in renewable energy, it would likely have avoided the steep losses it faced when fuel prices spiked."\n\nWhat kind of situation is being described by this sentence structure?',
    options: [
      { id: 'a', text: 'A real, ongoing situation happening in the present' },
      { id: 'b', text: 'A hypothetical situation about the past — describing something that did not actually happen, and its imagined consequence' },
      { id: 'c', text: 'A simple factual statement about a decision the company is currently making' },
      { id: 'd', text: 'A prediction about something that will definitely happen in the future' }
    ],
    correctOptionId: 'b',
    explanation: 'This is a third conditional structure ("Had [subject] + past participle, ... would have + past participle"), used to describe a hypothetical alternative to the past: the company did not invest earlier, and the sentence imagines what would have happened if it had.',
    difficulty: 'hard'
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
