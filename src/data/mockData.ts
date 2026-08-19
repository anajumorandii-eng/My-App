import { Topic, TopicMastery, UserProfile, ErrorLog, Question, PodcastEpisode, StudyMethod, BacklogItem, StudentGoals } from '../types';

// Currículo real, extraído dos sumários das apostilas (Anglo/Plural, cadernos de
// estudo 1-4, 1º e 2º semestres de 2026) da aluna. Agrupado por assunto/módulo —
// não por capítulo — para casar com a granularidade do plano de estudos.
export const mockTopics: Topic[] = [
  // Biologia
  {
    id: 'bio_celular', name: 'Biologia Celular', subject: 'Biologia', prerequisites: [],
    chapters: [
      'Origem da Vida e as Primeiras Células', 'Composição Química Celular: Compostos Inorgânicos',
      'Composição Química Celular: Carboidratos e Lipídios', 'Composição Química Celular: Proteínas e sua Função Estrutural',
      'Proteínas: Enzimas', 'Membranas Celulares', 'Citoplasma: Estrutura e Componentes I',
      'Citoplasma: Estrutura e Componentes II', 'Bioenergética: Fermentação e Respiração',
      'Bioenergética: Fotossíntese e Quimiossíntese', 'Ácidos Nucleicos', 'Biotecnologia',
      'Núcleo Celular', 'Divisão Celular', 'Mutações Cromossômicas e Gametogênese',
    ],
  },
  {
    id: 'bio_genetica', name: 'Genética', subject: 'Biologia', prerequisites: ['bio_celular'],
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
    id: 'bio_microbiologia', name: 'Microbiologia e Virologia', subject: 'Biologia', prerequisites: ['bio_celular'],
    chapters: ['Procariotos', 'Vírus'],
  },
  {
    id: 'bio_fisio_animal', name: 'Fisiologia Animal e Humana', subject: 'Biologia', prerequisites: ['bio_celular'],
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
    id: 'mat_algebrica', name: 'Modelagem Algébrica de Problemas', subject: 'Matemática', prerequisites: [],
    chapters: [
      'Técnicas Algébricas', 'Igualdades', 'Desigualdades', 'Modelagem Algébrica de Problemas I',
      'Equações do 2º Grau', 'Modelagem Algébrica de Problemas II', 'Introdução às Funções',
      'Transformações em Gráficos de Funções', 'Composição de Funções', 'Inversão de Funções',
      'Funções Bijetoras', 'Função Constante e Função Afim', 'Função Quadrática', 'Estudo do Sinal de Funções',
      'A Trigonometria dos Números Reais', 'Outras Razões Trigonométricas', 'A Relação Fundamental da Trigonometria',
      'Transformações Trigonométricas', 'Funções Trigonométricas', 'Módulo de um Número Real',
      'Introdução ao Modelo Exponencial', 'Introdução aos Logaritmos', 'Equações e Funções Logarítmicas',
      'Modelagem Exponencial de Problemas', 'Números Complexos', 'Polinômios', 'Equações Polinomiais',
    ],
  },
  {
    id: 'mat_geometrica', name: 'Modelagem Geométrica de Problemas', subject: 'Matemática', prerequisites: [],
    chapters: [
      'Introdução à Geometria Plana', 'Ângulos em Triângulos', 'Ângulos em Polígonos', 'Ângulos e Circunferências',
      'Simetrias e Congruências', 'Identificação de Simetrias I', 'Identificação de Simetrias II',
      'A Geometria da Proporcionalidade', 'Semelhança de Triângulos', 'O Ponto Médio e o Baricentro de um Triângulo',
      'Triângulo Retângulo', 'Trigonometria no Triângulo Retângulo', 'Relações Trigonométricas em Polígonos',
      'A Geometria Métrica Plana', 'Áreas de Polígonos', 'Área do Círculo e de suas Partes',
      'Razões entre Áreas de Figuras Planas', 'Áreas de Figuras Planas', 'O Universo Tridimensional',
      'Cubos e Paralelepípedos', 'Prismas', 'Pirâmides', 'Sólidos de Revolução', 'Razões entre Volumes de Sólidos',
      'Introdução à Geometria Analítica', 'Lugar Geométrico e Equação da Circunferência', 'Estudo Analítico da Reta',
      'Posições Relativas entre Duas Retas', 'Distância entre um Ponto e uma Reta',
      'Posições Relativas entre uma Reta e uma Circunferência', 'Introdução ao Estudo Analítico das Cônicas',
      'Representação Geométrica de Inequações', 'A Geometria dos Números Complexos',
    ],
  },
  {
    id: 'mat_numerica', name: 'Modelagem Numérica de Problemas', subject: 'Matemática', prerequisites: ['mat_algebrica'],
    chapters: [
      'Potências e Radicais', 'Razão e Proporção', 'Porcentagem', 'Introdução às Sequências',
      'Progressão Aritmética', 'Progressão Geométrica', 'Sequências', 'Sistemas de Equações',
      'Tabelas e Matrizes', 'Multiplicação de Matrizes', 'Determinantes', 'Discussão de Sistemas Lineares',
      'Médias', 'O Sistema de Numeração Decimal', 'Introdução à Teoria dos Números Inteiros',
      'Introdução às Técnicas de Contagem', 'O Problema da Fila', 'O Problema do Grupo', 'Técnicas de Contagem',
      'Introdução às Probabilidades', 'Operações com Probabilidades', 'Eventos Disjuntos e Eventos Independentes',
      'Estatística Descritiva',
    ],
  },
  // Física
  {
    id: 'fis_cinematica', name: 'Cinemática', subject: 'Física', prerequisites: ['mat_algebrica'],
    chapters: [
      'Cinemática Escalar. Conceitos Fundamentais', 'Movimento Uniforme', 'Movimento Uniformemente Variado',
      'O Movimento Circular',
    ],
  },
  {
    id: 'fis_dinamica', name: 'Dinâmica Newtoniana', subject: 'Física', prerequisites: ['fis_cinematica'],
    chapters: [
      'Grandezas Físicas e Operações com Vetores', 'Velocidade Vetorial', 'Composição de Movimentos',
      'Aceleração Vetorial', 'Força e seus Tipos', 'Resultante de um Sistema de Forças', 'As Leis de Newton',
      'A Força de Contato', 'Sistema de Corpos Interagindo e os Elementos Transmissores de Força',
      'Plano Inclinado', 'Leis da Gravitação', 'Dinâmica do Movimento Circular',
      'Analisando Movimentos Contidos em um Plano Vertical', 'Órbitas', 'Balística', 'Movimento Harmônico Simples (MHS)',
    ],
  },
  {
    id: 'fis_dinamica_impulsiva', name: 'Dinâmica Impulsiva', subject: 'Física', prerequisites: ['fis_dinamica'],
    chapters: ['Impulso e Quantidade de Movimento', 'Sistemas Isolados e a Conservação da Quantidade de Movimento', 'Colisões'],
  },
  {
    id: 'fis_energia', name: 'Dinâmica Energética e Transformações de Energia', subject: 'Física', prerequisites: ['fis_dinamica'],
    chapters: [
      'Trabalho e Energia: Trabalho de uma Força', 'Trabalho e Energia: Teorema da Energia Cinética',
      'Trabalho e Energia: o Teorema da Energia Potencial', 'Sistemas Conservativos e Sistemas Não Conservativos',
      'Potência, Máquina e Rendimento',
      "A Física por trás da Obtenção de Energia Elétrica, das Quedas-d'Água aos Reatores Nucleares",
      'Equivalência Massa-Energia',
    ],
  },
  {
    id: 'fis_estatica', name: 'Estática dos Corpos Sólidos e dos Fluidos', subject: 'Física', prerequisites: ['fis_dinamica'],
    chapters: ['Estática', 'Hidrostática: Densidade e Pressão'],
  },
  {
    id: 'fis_termofisica', name: 'Termofísica', subject: 'Física', prerequisites: [],
    chapters: [
      'Temperatura, Calor e seus Mecanismos de Transferência', 'Dilatação ou Contração Térmica dos Sólidos e Líquidos',
      'Calor Sensível e Calor Latente', 'Gases Ideais: Variáveis de Estado e as Transformações Gasosas',
      'Trabalho da Força de Pressão do Gás', 'Primeira Lei da Termodinâmica',
      'Primeira Lei da Termodinâmica Aplicada a Algumas Transformações Particulares', 'Máquinas Térmicas e Ciclo de Carnot',
    ],
  },
  {
    id: 'fis_eletricidade', name: 'Eletricidade', subject: 'Física', prerequisites: [],
    chapters: [
      'Eletrostática: Processos de Eletrização e Aplicações', 'Força Elétrica: Lei de Coulomb', 'Campo Elétrico',
      'Energia Potencial e Potencial Elétrico', 'Mapeamento do Campo Elétrico: Linhas de Força e Superfícies Equipotenciais',
      'Campo Elétrico Uniforme: Abordagem Escalar e Abordagem Vetorial', 'Dinâmica das Cargas Elétricas',
      'Corrente Elétrica', 'Potência Elétrica', 'Resistores', 'Medidores Elétricos', 'Geradores', 'Receptores',
      'Circuitos de Malha Única', 'Eletrodinâmica: as Leis de Kirchhoff', 'Capacitores',
    ],
  },
  {
    id: 'fis_eletromagnetismo', name: 'Eletromagnetismo', subject: 'Física', prerequisites: ['fis_eletricidade'],
    chapters: [
      'Ímãs, Campo de Indução Magnético devido a Ímãs e Campo Magnético Terrestre',
      'Campo Magnético devido à Corrente em Fio Reto e Espira: Descrição Vetorial e Aplicações',
      'Força Magnética e Análise de Lançamentos de Cargas em um Campo Magnético Uniforme',
      'Análise de Força Magnética em Fios Percorridos por Correntes Contínuas',
      'Indução Eletromagnética: Lei de Lenz', 'Indução Eletromagnética: Análise da Corrente Induzida em Geradores',
    ],
  },
  {
    id: 'fis_optica', name: 'Óptica Geométrica', subject: 'Física', prerequisites: [],
    chapters: [
      'Fundamentos da Óptica Geométrica', 'Reflexão em Superfícies Planas', 'Reflexão em Superfícies Esféricas',
      'Refração: Fundamentos, Leis e Aplicações', 'Lentes Esféricas: Estudo Gráfico',
      'Estudo Analítico das Lentes Esféricas', 'Equação do Fabricante de Lentes e Associação de Lentes',
      'Óptica da Visão', 'Microscópio e Luneta Astronômica (ou Telescópio Refrator): Noções Básicas',
    ],
  },
  {
    id: 'fis_ondas', name: 'Oscilações e Ondas', subject: 'Física', prerequisites: [],
    chapters: [
      'Conceitos Básicos', 'Equação Fundamental da Ondulatória', 'Ondulatória: Ondas Eletromagnéticas',
      'Ondulatória: Som e suas Propriedades', 'Intensidade Sonora', 'Reflexão, Eco, Reverberação e Refração de Ondas',
      'Fenômenos Ondulatórios: Análise de Refração e Reflexão em Cordas',
      'Fenômenos Ondulatórios: Difração, Polarização e Ressonância',
      'Interferência de Ondas: Análise Quantitativa, Aplicações e Batimento',
      'Um Caso Particular de Interferência: Onda Estacionária', 'Ondas Estacionárias em Cordas',
      'Ondas Estacionárias em Tubos', 'Efeito Doppler: Descrição e Estudo Quantitativo',
      'Noções Básicas de Física Quântica',
    ],
  },
  // Química
  {
    id: 'qui_atomistica', name: 'Atomística e Ligações Químicas', subject: 'Química', prerequisites: [],
    chapters: [
      'Evolução dos Modelos Atômicos', 'Organização da Tabela Periódica dos Elementos',
      'Radioatividade: o Estudo das Radiações', 'Ligações Químicas e Alotropia', 'Geometria Molecular',
      'Polaridade das Ligações e das Moléculas', 'Interações Intermoleculares',
    ],
  },
  {
    id: 'qui_geral', name: 'Química Geral', subject: 'Química', prerequisites: ['qui_atomistica'],
    chapters: [
      'Composição da Matéria: Estados Físicos', 'Separação de Misturas',
      'Transformações Físicas e Químicas e Balanceamento de Equações', 'Massa Atômica, Mol e Massa Molar',
      'O Estado Gasoso', 'Química Inorgânica', 'Estudo dos Gases II', 'Determinação de Fórmulas Químicas',
      'Estequiometria: Leis Ponderais', 'Cálculos Estequiométricos',
      'Equações Iônicas e outras Teorias para Ácidos e Bases', 'Processos de Oxirredução', 'Química Ambiental',
    ],
  },
  {
    id: 'qui_organica', name: 'Química Orgânica', subject: 'Química', prerequisites: ['qui_atomistica'],
    chapters: [
      'Introdução à Química Orgânica', 'Nomenclatura de Compostos Orgânicos',
      'Nomenclatura de Compostos Orgânicos Oxigenados e Nitrogenados',
      'Reconhecimento de Funções Orgânicas e Algumas de suas Propriedades', 'Isomeria', 'Combustíveis Fósseis',
      'Interpretando Reações Orgânicas', 'Reações de Substituição', 'Reações de Adição',
      'Reações de Oxidação em Hidrocarbonetos', 'Álcoois', 'Ácidos Graxos e Esterificação',
      'Transesterificação (Alcoólise)', 'Acidez e Basicidade (pKa)', 'Polímeros',
    ],
  },
  {
    id: 'qui_fisico_quimica', name: 'Físico-Química', subject: 'Química', prerequisites: ['qui_geral'],
    chapters: [
      'Dispersões', 'Efeitos Coligativos', 'Termoquímica I', 'Termoquímica II',
      'Introdução ao Estudo das Pilhas e Baterias', 'Cinética Química', 'Equilíbrios Químicos I',
      'Eletroquímica de Processos Espontâneos', 'Eletroquímica de Processos não Espontâneos',
      'Aspectos Quantitativos da Eletroquímica e Metalurgia', 'Deslocamento de Equilíbrio',
      'Equilíbrios Iônicos', 'Equilíbrios Iônicos II',
    ],
  },
  // Geografia
  {
    id: 'geo_geral', name: 'Geografia Geral', subject: 'Geografia', prerequisites: [],
    chapters: [
      'Coordenadas Geográficas', 'Movimentos da Terra', 'Sistema de Fusos Horários', 'Linguagem Cartográfica',
      'Projeções Cartográficas', 'Cartografia Digital', 'Representações Gráficas e Cartográficas',
      'Dinâmica Climática', 'Clima Mundial', 'Geomorfologia Mundial', 'Biogeografia Mundial',
      'Água na Superfície Terrestre', 'Geopolítica dos Recursos Hídricos', 'Hidrogeografia Mundial',
      'Desafios Ambientais do Século XXI', 'Geopolítica Ambiental', 'Do Mundo Bipolar ao Multipolar',
      'Globalização e Processos Econômicos Atuais', 'Geografia das Redes Mundiais',
      'Unilateralismo e Multilateralismo', 'Blocos Econômicos', 'União Europeia', 'Desigualdades Globais',
      'Mobilidade Populacional', 'Geografia do Turismo', 'Produção Agrícola Mundial', 'Indústria I', 'Indústria II',
      'Gedeconomia Mundial', 'Terrorismo Internacional', 'Geografia das Religiões', 'Tensões Geopolíticas na Europa',
      'Geopolítica e Geoeconomia da América Latina', 'África no Mundo Atual', 'Geopolítica e Geoeconomia da Ásia',
      'Geografia do Oriente Médio', 'Questão Palestina', 'Conflitos no Mundo Árabe',
    ],
  },
  {
    id: 'geo_brasil', name: 'Geografia do Brasil', subject: 'Geografia', prerequisites: ['geo_geral'],
    chapters: [
      'Paisagem, Espaço Geográfico e Ciência Geográfica', 'Geologia e Geomorfologia', 'Relevo Brasileiro',
      'Pedologia', 'Climatologia do Brasil', 'Biogeografia do Brasil I', 'Biogeografia do Brasil II',
      'Políticas Ambientais Brasileiras', 'Hidrogeografia do Brasil', 'Domínios Morfoclimáticos',
      'Matriz Energética', 'Combustíveis Fósseis e Biocombustíveis no Brasil', 'Energia Elétrica no Mundo',
      'Energia Elétrica no Brasil', 'Produção Mineral', 'Dinâmica Demográfica',
      'Estrutura Étnica e Fluxos Migratórios', 'Estrutura Ativa da População', 'O Espaço Agrário Brasileiro',
      'O Espaço Industrial Brasileiro I', 'O Espaço Industrial Brasileiro II', 'O Espaço Urbano I',
      'O Espaço Urbano II', 'As Redes de Transportes', 'Os Fluxos do Comércio Externo',
    ],
  },
  // História
  {
    id: 'his_geral', name: 'História Geral', subject: 'História', prerequisites: [],
    chapters: [
      'Introdução à História e Primeiras Civilizações', 'Antiguidade Clássica: o Mundo Grego',
      'Antiguidade Clássica: o Mundo Romano', 'Alta Idade Média e Feudalismo', 'Baixa Idade Média',
      'A Primeira Globalização', 'América Espanhola', 'Vida Urbana e Renascimento Cultural', 'Reforma Religiosa',
      'Absolutismo', 'Revolução Industrial', 'Iluminismo', 'Revolução Francesa', 'América no Século XIX',
      'Europa no Século XIX', 'Imperialismo e Belle Époque', 'Primeira Guerra Mundial (1914-1918)',
      'Grandes Revoluções do Século XX', 'O Período Entreguerras (1918-1939)', 'O Nazismo na Alemanha',
      'Segunda Guerra Mundial (1939-1945)', 'Guerra Fria', 'Descolonização Afro-Asiática',
      'América Latina no Século XX', 'O Fim da Guerra Fria',
    ],
  },
  {
    id: 'his_brasil', name: 'História do Brasil', subject: 'História', prerequisites: ['his_geral'],
    chapters: [
      'A História e o Brasil', 'Grandes Navegações e Conquista Colonial', 'A Montagem da Colonização',
      'Dinâmica Interna da Colonização', 'Disputas Europeias no Brasil Colonial', 'A Interiorização da Colonização',
      'A Mineração no Brasil Colonial', 'A Crise do Antigo Sistema Colonial', 'A Independência do Brasil',
      'Brasil Império: Formação do Estado Nacional Brasileiro', 'Brasil Império: o Período Regencial (1831-1840)',
      'Brasil Império: Segundo Reinado (1840-1889)', 'Brasil Império: o Declínio do Segundo Reinado',
      'A República da Espada', 'Ascensão e Domínio das Oligarquias',
      'A Primeira República: o Declínio Oligárquico (1889-1930)', 'A Era Vargas',
      'A Era Vargas: o Governo Constitucional (1934-1937)', 'A Era Vargas: o Estado Novo',
      'República Liberal (1945-1964): Democracia em Tempos de Guerra Fria',
      'República Liberal (1945-1964): Desenvolvimentismo e Populismo', 'Regime Militar (1964-1985) I',
      'Regime Militar (1964-1985) II', 'O Brasil Atual',
    ],
  },
  // Português
  {
    id: 'por_gramatica', name: 'Gramática', subject: 'Português', prerequisites: [],
    chapters: [
      'Língua: um Sistema Complexo', 'Variação Linguística', 'Substantivo: os Nomes e a Visão do Enunciador',
      'Tipos de Texto: Explorando Elementos Concretos e Conceitos Abstratos',
      'Artigo, Numeral e Adjetivo no Sintagma Nominal', 'Funções Sintáticas Nominais e Vocativo', 'Pronomes',
      'Verbo', 'Advérbio e Locuções Adverbiais: Circunstanciadores', 'Verbo e Sintaxe da Oração',
      'Tipos de Sujeito', 'Vozes Verbais', 'Concordância', 'Significados Implícitos', 'Tipos de Discurso',
      'Orações Substantivas', 'Orações Adjetivas', 'Orações Adverbiais', 'Orações Coordenadas',
      'Pontuação I: Princípios para o Uso da Vírgula', 'Pontuação II: Vírgula entre Orações e Outros Sinais de Pontuação',
      'O Léxico em Contexto: Variadas Possibilidades Semânticas', 'Ambiguidade: Duplicidade no Léxico e na Sintaxe',
      'Mecanismo de Regência', 'Crase', 'Processos de Formação de Palavras',
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
    id: 'por_literatura', name: 'Literatura', subject: 'Português', prerequisites: [],
    chapters: [
      'A Arte e suas Linguagens', 'Texto Literário x Texto não Literário', 'Trovadorismo e Humanismo',
      'Renascimento e Camões', 'Brasil: Primeiros Registros', 'A Estética Barroca', 'A Estética Neoclássica',
      'A Estética Romântica: Poesia', 'Elementos da Narrativa', 'A Estética Romântica: Prosa',
      'A Estética Realista', 'Machado de Assis', 'Naturalismo', 'Realismo Português: Eça de Queirós',
      'Parnasianismo', 'Simbolismo', 'Pré-Modernismo', 'Vanguardas Artísticas', 'Fernando Pessoa',
      'Semana de Arte Moderna', 'Modernismo no Brasil: Primeira Geração', 'Segunda Geração Modernista: Prosa',
      'Graciliano Ramos', 'Segunda Geração Modernista: Poesia', 'Carlos Drummond de Andrade',
      'João Cabral de Melo Neto', 'Poesia Concreta', 'Clarice Lispector', 'Guimarães Rosa',
      'Poesia Brasileira: 1960-1980', 'Prosa Brasileira: 1960-1980', 'Literatura Lusófona Contemporânea',
      'Poesia Brasileira Contemporânea', 'Prosa Brasileira Contemporânea', 'Artes Plásticas Brasileiras',
      'Teatro Brasileiro', 'Cancioneiro Popular Brasileiro',
    ],
  },
  {
    id: 'por_redacao', name: 'Redação', subject: 'Português', prerequisites: ['por_gramatica', 'por_texto'],
    chapters: [
      'A Dissertação no Vestibular: Mitos e Verdades', 'O que se Avalia na Dissertação: Competências e Habilidades',
      'Organizando as Ideias: Brainstorm e Mind Maps', 'Projeto de Texto em Favor da Progressão Textual',
      'Repertório: o Diferencial de Redações de Sucesso', 'Qual Será o Tema deste Ano: Grandes Eixos Temáticos',
      'Incrementando o Repertório: Meio Ambiente', 'Analisando Tema de Redação: Meio Ambiente',
      'Diferentes Graus de Adequação à Proposta', 'Tangenciamento e Fuga: a Fronteira do Tema',
      'Lendo a Coletânea: a Apreensão de Sentidos I', 'Lendo a Coletânea: a Apreensão de Sentidos II',
      'Lendo a Coletânea: a Compreensão e o Texto Autoral I', 'Lendo a Coletânea: a Compreensão e o Texto Autoral II',
      'Incrementando o Repertório: Educação e Trabalho', 'Analisando Tema de Redação: Educação e Trabalho',
      'Gêneros e sua Relação com a Estrutura do Texto', 'Estrutura Clássica do Texto Dissertativo',
      'Parágrafo de Introdução: Delimitando a Opinião', 'Parágrafo de Introdução: como Contextualizar',
      'Argumentação: Auditório Particular e Universal', 'Argumentação Quase-Lógica e Efeito de Verdade',
      'Incrementando o Repertório: Temas Abstratos', 'Analisando Tema Abstrato de Redação',
      'Argumentação e Coerência Interna', 'Argumentação e Coerência Externa',
      'Conclusão por Síntese ou Retomada da Tese', 'Conclusão: Sumarização, Focalização e Expressividade',
      'Proposta de Intervenção: Atores Sociais e Cidadania', 'Proposta de Intervenção: Viabilização e Inovação',
      'Proposta de Intervenção: Coerência Argumentativa', 'Proposta de Intervenção: Respeito aos Direitos Humanos',
      'Incrementando o Repertório: Arte, Cultura e Relações Sociais',
      'Analisando o Tema de Redação: Arte, Cultura e Relações Sociais',
      'Recursos Argumentativos: Dados Numéricos e Exemplos', 'Recursos Argumentativos: Vozes Prestigiadas',
      'Ressalvando o Ponto de Vista Contrário', 'Refutando o Ponto Contrário',
      'Incrementando o Repertório: Corpo, Saúde e Sexualidade', 'Analisando Tema de Redação: Corpo, Saúde e Sexualidade',
      'Recursos Argumentativos: Interdiscursividade e Intertextualidade',
      'Recursos Argumentativos: Temas de Redação já Analisados', 'Recursos Argumentativos: Fatos da Atualidade',
      'Recursos Argumentativos: Múltiplos Domínios do Saber', 'Incrementando o Repertório: Mídia e Sociedade',
      'Analisando Tema de Redação: Mídia e Sociedade', 'Recursos de Coesão Referencial no Texto Dissertativo',
      'Recursos de Coesão Sequencial no Texto Dissertativo', 'Coesão no Texto Dissertativo: Análise de Problemas',
      'Recursos Linguísticos: Norma, Clareza e Expressividade', 'Incrementando o Repertório: Violência, Leis e Punição',
      'Analisando Tema de Redação: Violência, Leis e Punição', 'Os Direitos Humanos de 1ª Geração: Direitos Individuais',
      'Os Direitos Humanos de 2ª e 3ª Geração: Direitos Sociais, Coletivos e Difusos',
      'Incrementando o Repertório: Cidadania e Poder', 'Analisando Tema de Redação: Cidadania e Poder',
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
  { topicId: 'bio_celular', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_genetica', level: 30, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'bio_evolucao', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 12 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'bio_ecologia', level: 40, uncertainty: 0.6, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'bio_zoologia', level: 25, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 16 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_botanica', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 18 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_microbiologia', level: 65, uncertainty: 0.35, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_fisio_animal', level: 55, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'bio_fisio_vegetal', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'mat_algebrica', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'mat_geometrica', level: 70, uncertainty: 0.3, lastReviewed: new Date(Date.now() - 8 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_numerica', level: 50, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'fis_cinematica', level: 75, uncertainty: 0.2, lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_dinamica', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_dinamica_impulsiva', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'fis_energia', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 13 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_estatica', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 17 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_termofisica', level: 35, uncertainty: 0.65, lastReviewed: new Date(Date.now() - 9 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_eletricidade', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'fis_eletromagnetismo', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 21 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'fis_optica', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 4 },
  { topicId: 'fis_ondas', level: 80, uncertainty: 0.15, lastReviewed: new Date(Date.now() - 6 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'qui_atomistica', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 4 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'qui_geral', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 3 },
  { topicId: 'qui_organica', level: 20, uncertainty: 0.85, lastReviewed: new Date(Date.now() - 11 * 86400000).toISOString(), errorSignals: 2 },
  { topicId: 'qui_fisico_quimica', level: 45, uncertainty: 0.5, lastReviewed: new Date(Date.now() - 7 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_geral', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'geo_brasil', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_geral', level: 30, uncertainty: 0.75, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'his_brasil', level: 20, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 25 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_gramatica', level: 45, uncertainty: 0.55, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_texto', level: 55, uncertainty: 0.45, lastReviewed: new Date(Date.now() - 9 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'por_literatura', level: 30, uncertainty: 0.7, lastReviewed: new Date(Date.now() - 14 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'por_redacao', level: 15, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 30 * 86400000).toISOString(), errorSignals: 0 },
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
    topicId: 'mat_numerica',
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
    topicId: 'bio_celular',
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
    topicId: 'bio_celular',
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
    topicId: 'mat_algebrica',
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
    topicId: 'mat_algebrica',
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
    topicId: 'mat_numerica',
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
    topicId: 'mat_numerica',
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
    topicId: 'mat_algebrica',
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
    topicId: 'mat_algebrica',
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
    topicId: 'mat_geometrica',
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
    topicId: 'mat_geometrica',
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
    topicId: 'mat_numerica',
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
    topicId: 'mat_numerica',
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
    topicId: 'mat_algebrica',
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
    topicId: 'mat_algebrica',
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
    topicId: 'fis_eletricidade',
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
    topicId: 'fis_eletricidade',
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
    topicId: 'fis_dinamica',
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
    topicId: 'fis_dinamica',
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
    topicId: 'fis_termofisica',
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
    topicId: 'fis_termofisica',
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
    topicId: 'fis_optica',
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
    topicId: 'fis_optica',
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
    topicId: 'fis_ondas',
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
    topicId: 'fis_ondas',
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
    topicId: 'qui_geral',
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
    topicId: 'qui_geral',
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
    topicId: 'qui_atomistica',
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
    topicId: 'qui_atomistica',
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
    topicId: 'qui_organica',
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
    topicId: 'qui_organica',
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
    topicId: 'qui_fisico_quimica',
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
    topicId: 'qui_fisico_quimica',
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
    topicId: 'qui_atomistica',
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
    topicId: 'mat_geometrica',
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
    topicId: 'qui_geral',
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
    topicId: 'qui_fisico_quimica',
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
    topicId: 'qui_organica',
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
    topicId: 'fis_termofisica',
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
    topicId: 'qui_atomistica',
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
    topicId: 'por_redacao',
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
    topicId: 'por_redacao',
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
  }
];

export const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: 'pod_bio_01',
    topicId: 'bio_celular',
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
    topicId: 'mat_algebrica',
    title: 'Funções de primeiro grau na prática',
    subject: 'Matemática',
    durationMinutes: 4,
    script: 'Uma função de primeiro grau tem a forma f de x igual a a x mais b, onde a é o coeficiente angular e b o coeficiente linear. O coeficiente a define a inclinação da reta: se for positivo, a função é crescente, se for negativo, é decrescente. A raiz da função é o valor de x que zera f de x, ou seja, onde a reta cruza o eixo horizontal. Esse conceito aparece disfarçado em várias questões de física e economia no vestibular.'
  },
  {
    id: 'pod_mat_02',
    topicId: 'mat_numerica',
    title: 'Análise combinatória: quando somar e quando multiplicar',
    subject: 'Matemática',
    durationMinutes: 7,
    script: 'A maior pegadinha da análise combinatória é saber quando somar e quando multiplicar possibilidades. Use a multiplicação quando os eventos acontecem em sequência, um depois do outro. Use a soma quando são alternativas que se excluem. Permutação é usada quando todos os elementos são organizados em ordem. Combinação é usada quando a ordem não importa. Ler o enunciado com atenção às palavras chave, como pelo menos, no máximo e exatamente, evita a maioria dos erros de interpretação.'
  },
  {
    id: 'pod_mat_03',
    topicId: 'mat_algebrica',
    title: 'Funções de segundo grau e a parábola',
    subject: 'Matemática',
    durationMinutes: 6,
    script: 'A função de segundo grau tem a forma f de x igual a a x ao quadrado mais b x mais c, e seu gráfico é sempre uma parábola. Se o coeficiente a for positivo, a parábola tem concavidade para cima, com um ponto de mínimo. Se for negativo, a concavidade é para baixo, com um ponto de máximo. O discriminante, delta igual a b ao quadrado menos quatro a c, indica quantas raízes reais a função possui: duas se for positivo, uma se for zero, e nenhuma raiz real se for negativo. Essas funções aparecem em problemas de otimização, física e economia no vestibular.'
  },
  {
    id: 'pod_mat_04',
    topicId: 'mat_geometrica',
    title: 'Geometria plana: as fórmulas que mais caem',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Geometria plana estuda figuras em duas dimensões: triângulos, quadriláteros, círculos e suas propriedades. As fórmulas de área mais cobradas no vestibular incluem o triângulo, base vezes altura dividido por dois, o retângulo, base vezes altura, e o círculo, pi vezes o raio ao quadrado. O Teorema de Pitágoras, que relaciona os catetos e a hipotenusa de um triângulo retângulo, é uma das ferramentas mais versáteis, aparecendo até em questões de física e trigonometria. Praticar a visualização de figuras compostas, decompondo-as em formas mais simples, é a chave para resolver a maioria dos problemas.'
  },
  {
    id: 'pod_mat_05',
    topicId: 'mat_numerica',
    title: 'Probabilidade sem mistério',
    subject: 'Matemática',
    durationMinutes: 5,
    script: 'Probabilidade mede a chance de um evento acontecer, calculada como o número de casos favoráveis dividido pelo número total de casos possíveis. Em eventos independentes, como lançar um dado duas vezes, multiplicamos as probabilidades individuais. Já em eventos mutuamente exclusivos, que não podem ocorrer ao mesmo tempo, somamos as probabilidades. Esse conteúdo conecta diretamente com análise combinatória: muitas vezes é preciso contar as possibilidades usando permutação ou combinação antes mesmo de calcular a probabilidade. Ler o enunciado com atenção para identificar se os eventos são independentes ou excludentes evita a maioria dos erros nesse tópico.'
  },
  {
    id: 'pod_mat_06',
    topicId: 'mat_algebrica',
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
    topicId: 'fis_eletricidade',
    title: 'Eletrodinâmica: série, paralelo e a Lei de Ohm',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Em circuitos em série, a corrente é a mesma em todos os componentes e as resistências se somam diretamente. Em circuitos em paralelo, a tensão é a mesma em todos os ramos e o inverso da resistência equivalente é a soma dos inversos de cada resistência. A Lei de Ohm, tensão igual a resistência vezes corrente, conecta essas três grandezas e é a ferramenta mais usada para resolver exercícios de eletrodinâmica no vestibular.'
  },
  {
    id: 'pod_fis_03',
    topicId: 'fis_dinamica',
    title: 'As três Leis de Newton em um episódio só',
    subject: 'Física',
    durationMinutes: 6,
    script: 'As três Leis de Newton formam a base da mecânica clássica. A primeira, ou lei da inércia, diz que um corpo tende a manter seu estado de repouso ou movimento retilíneo uniforme, a menos que uma força atue sobre ele. A segunda lei estabelece que a força resultante é igual à massa vezes a aceleração, F igual a m vezes a. E a terceira lei, de ação e reação, afirma que toda força aplicada gera uma força de mesma intensidade e sentido oposto em outro corpo. Entender essas três leis juntas é o que permite resolver praticamente qualquer problema de dinâmica no vestibular.'
  },
  {
    id: 'pod_fis_04',
    topicId: 'fis_termofisica',
    title: 'Termologia: calor, temperatura e mudanças de estado',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Termologia estuda o calor e suas transformações. Calor específico é a quantidade de energia necessária para elevar em um grau a temperatura de uma unidade de massa de uma substância, calculado pela fórmula Q igual a m vezes c vezes delta T. As mudanças de estado físico, como fusão e vaporização, ocorrem a temperatura constante, com o calor sendo usado para quebrar as ligações entre as moléculas, não para aumentar a temperatura. Já as leis dos gases relacionam pressão, volume e temperatura, sendo fundamentais para entender desde motores até fenômenos atmosféricos, um assunto que aparece com frequência em questões interdisciplinares.'
  },
  {
    id: 'pod_fis_05',
    topicId: 'fis_optica',
    title: 'Óptica: luz, reflexão e a visão humana',
    subject: 'Física',
    durationMinutes: 5,
    script: 'A óptica estuda o comportamento da luz. Quando a luz passa de um meio para outro, ela sofre refração, mudando de direção devido à diferença de velocidade entre os meios — é esse fenômeno que causa o arco-íris, ao decompor a luz branca em suas cores. Já a reflexão ocorre quando a luz retorna ao meio de origem ao encontrar uma superfície, como em espelhos. No estudo da visão, é importante saber que na miopia a imagem se forma antes da retina, corrigida com lentes divergentes, enquanto na hipermetropia a imagem se forma depois da retina, corrigida com lentes convergentes.'
  },
  {
    id: 'pod_fis_06',
    topicId: 'fis_ondas',
    title: 'Ondulatória: velocidade, frequência e ressonância',
    subject: 'Física',
    durationMinutes: 6,
    script: 'Uma onda transporta energia sem transportar matéria. A velocidade de propagação de uma onda é o produto entre sua frequência e seu comprimento de onda, v igual a lambda vezes f. Ondas mecânicas, como o som, precisam de um meio material para se propagar, enquanto ondas eletromagnéticas, como a luz, se propagam até no vácuo. Um fenômeno interessante é a ressonância, quando um sistema vibra com amplitude máxima ao receber energia numa frequência igual à sua frequência natural — o mesmo princípio usado para sintonizar rádios e explicado em diversas questões de vestibular sobre ondas sonoras e vibrações.'
  },
  {
    id: 'pod_qui_01',
    topicId: 'qui_geral',
    title: 'Estequiometria sem trava',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Estequiometria é a parte da química que calcula as quantidades de reagentes e produtos em uma reação química balanceada. Tudo começa com a lei de conservação das massas: a massa total dos reagentes é igual à massa total dos produtos. Usando os coeficientes da equação balanceada, conseguimos calcular proporções em mols, depois converter para massa usando a massa molar de cada substância. O segredo para não errar é sempre balancear a equação primeiro e trabalhar com a proporção de mols antes de qualquer outra conversão. É um dos tópicos mais cobrados no vestibular por unir cálculo e química num só problema.'
  },
  {
    id: 'pod_qui_02',
    topicId: 'qui_atomistica',
    title: 'Ligações químicas: iônica, covalente e polaridade',
    subject: 'Química',
    durationMinutes: 6,
    script: 'As ligações químicas explicam como os átomos se unem para formar substâncias. Na ligação iônica, um átomo perde elétrons e outro ganha, formando íons de cargas opostas que se atraem eletricamente — típico de metais com ametais. Na ligação covalente, os átomos compartilham pares de elétrons, geralmente entre ametais. A geometria da molécula e a diferença de eletronegatividade entre os átomos determinam se a molécula será polar ou apolar, o que explica propriedades importantes, como a razão pela qual a água dissolve tantas substâncias, sendo um solvente essencial para todos os processos biológicos.'
  },
  {
    id: 'pod_qui_03',
    topicId: 'qui_organica',
    title: 'Química orgânica: carbono, cadeias e funções',
    subject: 'Química',
    durationMinutes: 6,
    script: 'Química orgânica estuda os compostos de carbono, o elemento capaz de formar quatro ligações covalentes e se unir a outros átomos de carbono formando cadeias longas e variadas. Os hidrocarbonetos, formados só por carbono e hidrogênio, são a base dessa área. A partir deles, surgem as funções orgânicas, como álcoois, quando um grupo hidroxila substitui um hidrogênio, e ácidos carboxílicos, com o grupo carboxila. Reconhecer o grupo funcional de um composto é o primeiro passo para prever suas propriedades e reações, um raciocínio que aparece direto nas questões de química orgânica do vestibular.'
  },
  {
    id: 'pod_qui_04',
    topicId: 'qui_fisico_quimica',
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
    topicId: 'por_redacao',
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
    topicId: 'qui_organica',
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
    topicId: 'mat_algebrica',
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
