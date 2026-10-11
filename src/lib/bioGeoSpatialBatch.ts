/**
 * Lote espacial de Biologia e Geografia (11/10/2026). Mesma régua dos lotes anteriores:
 * um objeto por capítulo, no palco comum. Em Geografia humana os valores são fictícios e
 * declarados na nota: o modelo mostra a relação (fluxo, hierarquia, estágio), nunca um mapa
 * com fronteiras ou um dado inventado apresentado como real.
 */
export type BioGeoKind =
  | 'eco-levels'|'logistic'|'succession'|'carbon'|'nitrogen'|'water-cycle'|'eutrophication'|'air-inversion'|'biomagnification'|'bioremediation'
  | 'photosynthesis'|'chromosomes'|'sex-linked'|'dihybrid'|'epistasis'|'linkage'|'mutation'|'lamarck-darwin'|'selection'|'br-biomes'
  | 'cladogram'|'protists'|'sponge-cnidarian'|'body-cavity'|'mollusc'|'annelid'|'arthropod'|'arachnid'|'echinoderm'|'chordate'
  | 'heart-chambers'|'fungi'|'algae-depth'|'life-cycles'|'bryo-pterido'|'seed-fruit'|'bacterium'|'virus'|'lever-arm'|'synapse'
  | 'senses'|'endocrine-axis'|'glycemia'
  | 'env-pressures'|'env-diplomacy'|'shared-basin'|'river-profile'|'polarity'|'globalization'|'networks'|'lateralism'|'integration-stages'|'eu-circles'
  | 'inequality'|'migration'|'tourism'|'agri-systems'|'industrial-revolutions'|'fordism'|'core-periphery'|'cell-network'|'religion-diffusion'|'europe-tensions'
  | 'latam-trade'|'africa-borders'|'flying-geese'|'middle-east-resources'|'palestine-timeline'|'arab-spring'|'landscape'|'soil-horizons'|'protected-areas'|'br-rivers'
  | 'energy-matrix'|'biofuel-cycle'|'power-sources'|'br-electricity'|'open-pit'|'land-structure'|'br-industry'|'fiscal-war'|'age-pyramid'|'migration-waves'
  | 'urbanization'|'urban-hierarchy'|'transport-modes'|'trade-balance'|'demographic-bonus';
export interface BioGeoLesson {kind:BioGeoKind;title:string;label:string;min:number;max:number;step:number;initial:number;note:string;choices?:[string,string][];}
const l=(kind:BioGeoKind,title:string,label:string,min:number,max:number,step:number,initial:number,note:string,choices?:[string,string][]):BioGeoLesson=>({kind,title,label,min,max,step,initial,note,choices});
const B='summary-biologia-',G='summary-geografia-';
const FICT='Valores e regiões fictícios, só para mostrar a relação; não é mapa nem estatística.';

export const BIO_GEO_SPATIAL_LESSONS:Record<string,BioGeoLesson>={
  'bio-ecologia-introducao':l('eco-levels','Níveis de organização ecológica','Nível destacado',1,5,1,3,'Indivíduo ⊂ população ⊂ comunidade ⊂ ecossistema ⊂ biosfera. Cada nível inclui o anterior e acrescenta interações.'),
  'bio-ecologia-dinamica-populacoes':l('logistic','Crescimento logístico','Taxa r',.2,1,.1,.6,'N(t) com capacidade de suporte K = 100 e N₀ = 5. Perto de K o crescimento desacelera (resistência do meio).'),
  'bio-ecologia-sucessao':l('succession','Sucessão ecológica','Estágio',1,4,1,2,'Pioneiras → herbáceas → arbustos → clímax. Biomassa e diversidade tendem a aumentar; o modelo é esquemático.'),
  'bio-ecologia-ciclo-carbono':l('carbon','Ciclo do carbono','Intensidade do processo',1,5,1,3,'Reservatórios esquemáticos: atmosfera, plantas, oceano e combustíveis fósseis. A combustão transfere carbono fóssil para a atmosfera.',[['photosynthesis','Fotossíntese'],['respiration','Respiração'],['combustion','Combustão']]),
  'bio-ecologia-ciclo-nitrogenio':l('nitrogen','Ciclo do nitrogênio','Bactérias fixadoras',1,5,1,3,'N₂ → NH₃/NH₄⁺ (fixação) → NO₂⁻ → NO₃⁻ (nitrificação) → plantas; desnitrificação devolve N₂.'),
  'bio-ecologia-ciclo-hidrologico-poluicao-agua':l('water-cycle','Ciclo da água e poluente','Carga de poluente',0,5,1,2,'Evaporação, condensação, precipitação e escoamento. O poluente lançado no rio segue o escoamento, não a evaporação.'),
  'bio-ecologia-eutrofizacao':l('eutrophication','Eutrofização','Nutrientes lançados',0,5,1,2,'Excesso de N e P → proliferação de algas → decomposição consome O₂ → morte de peixes. Valores relativos.'),
  'bio-ecologia-poluicao-ar':l('air-inversion','Inversão térmica','Fumaça emitida',1,5,1,3,'Na inversão, a camada quente acima impede a subida do ar poluído junto ao solo.',[['normal','Condição normal'],['inversion','Inversão térmica']]),
  'bio-ecologia-biomagnificacao':l('biomagnification','Biomagnificação','Nível trófico',1,4,1,2,'Substância persistente e lipossolúvel; fator ilustrativo ×10 por nível. Biomassa diminui, concentração aumenta.'),
  'bio-ecologia-aquecimento-global-pops-biorremediacao':l('bioremediation','Biorremediação','Tempo de tratamento',0,1,.1,.5,'Microrganismos degradam o poluente orgânico no solo. Percurso conceitual, sem taxa real de degradação.'),
  [B+'bioenergetica-fotossintese-e-quimiossintese']:l('photosynthesis','Energia para a matéria orgânica','Intensidade de luz',0,5,1,3,'Fotossíntese: luz nos tilacoides; quimiossíntese: energia de oxidação de compostos inorgânicos, sem luz.',[['photo','Fotossíntese'],['chemo','Quimiossíntese']]),
  [B+'introducao-a-genetica']:l('chromosomes','Cromossomos homólogos e alelos','Locus destacado',1,4,1,2,'Par de homólogos: mesmo gene no mesmo locus, alelos podem ser iguais (homozigoto) ou diferentes (heterozigoto).'),
  [B+'heranca-sexual']:l('sex-linked','Herança ligada ao X','Filhos representados',1,4,1,2,'Gene recessivo no X (ex.: daltonismo). Homens hemizigotos expressam com um único alelo.',[['carrier','Mãe portadora × pai normal'],['father','Mãe normal × pai afetado']]),
  [B+'segunda-lei-de-mendel']:l('dihybrid','Diibridismo: 9:3:3:1','Classe destacada',1,4,1,1,'AaBb × AaBb com segregação independente: 16 combinações, quatro fenótipos.'),
  [B+'segunda-lei-de-mendel-e-interacao-genica']:l('epistasis','Interação gênica','Classe destacada',1,3,1,1,'Mesmos 16 encontros do diibridismo, proporções alteradas pela interação.',[['recessive','Epistasia recessiva 9:3:4'],['duplicate','Genes complementares 9:7']]),
  [B+'ligacao-genica']:l('linkage','Ligação e permutação','Distância em cM',0,50,5,20,'Genes no mesmo cromossomo. Recombinantes (%) ≈ distância em centimorgans, até ~50%.'),
  [B+'mutacoes-genicas']:l('mutation','Mutação na sequência','Posição alterada',1,6,1,3,'Sequência ilustrativa de 6 códons. Substituição altera um códon; inserção/deleção desloca a leitura.',[['substitution','Substituição'],['insertion','Inserção'],['deletion','Deleção']]),
  [B+'evolucao-biologica-construcao-historica']:l('lamarck-darwin','Lamarck × Darwin','Gerações',1,5,1,3,'Pescoços de girafa como exemplo clássico. Lamarck: uso e herança do adquirido; Darwin: variação prévia e seleção.',[['lamarck','Lamarck'],['darwin','Darwin']]),
  [B+'mecanismos-da-evolucao-biologica']:l('selection','Seleção natural sobre um alelo','Coeficiente de seleção',0,.5,.1,.2,'Frequência inicial 10%, alelo vantajoso dominante; 10 gerações modeladas.'),
  [B+'biomas-brasileiros']:l('br-biomes','Biomas brasileiros: vegetação e chuva','Indivíduos no recorte',3,7,1,5,'Perfis e chuva qualitativos (alta, média, baixa). Sem limites cartográficos.',[['amazon','Amazônia'],['atlantic','Mata Atlântica'],['cerrado','Cerrado'],['caatinga','Caatinga'],['pampa','Pampa'],['pantanal','Pantanal']]),
  [B+'classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica']:l('cladogram','Cladograma','Nó destacado',1,4,1,2,'Grupos: peixes, anfíbios, répteis, aves, mamíferos (simplificado). Cada nó é uma novidade evolutiva compartilhada.'),
  [B+'protozoarios-e-protozooses']:l('protists','Locomoção em protozoários','Velocidade relativa',1,5,1,3,'Ameba (pseudópodes), flagelado e ciliado. Formas esquemáticas.',[['amoeba','Sarcodíneo'],['flagellate','Flagelado'],['ciliate','Ciliado']]),
  [B+'poriferos-e-cnidarios']:l('sponge-cnidarian','Poríferos e cnidários','Fluxo de água',1,5,1,3,'Esponja: água entra pelos poros e sai pelo ósculo. Cnidário: pólipo ou medusa, com cavidade gastrovascular.',[['sponge','Porífero'],['polyp','Pólipo'],['medusa','Medusa']]),
  [B+'arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos']:l('body-cavity','Cavidade corporal','Espessura do mesoderma',1,4,1,2,'Corte transversal: acelomado (platelminto), pseudocelomado (nematódeo), celomado.',[['acoelom','Acelomado'],['pseudo','Pseudocelomado'],['coelom','Celomado']]),
  [B+'moluscos']:l('mollusc','Concha em espiral','Voltas da concha',1,5,.5,3,'Espiral logarítmica: a concha cresce mantendo a forma.'),
  [B+'anelideos']:l('annelid','Metameria e peristaltismo','Segmentos',6,14,2,10,'Anelídeo com segmentos repetidos; a onda de contração percorre o corpo.'),
  [B+'artropodes-insetos-crustaceos-e-miriapodes']:l('arthropod','Artrópodes: tagmas e patas','Tamanho relativo',1,3,1,2,'Inseto: cabeça, tórax, abdome, 6 patas. Crustáceo: cefalotórax, 10 patas (decápodes). Miriápode: muitos segmentos.',[['insect','Inseto'],['crustacean','Crustáceo'],['myriapod','Miriápode']]),
  [B+'artropodes-aracnideos']:l('arachnid','Aracnídeo','Abertura das patas',10,40,10,20,'Cefalotórax e abdome, 8 patas, quelíceras; sem antenas.'),
  [B+'equinodermos']:l('echinoderm','Simetria pentarradial','Rotação em graus',0,72,12,0,'Estrela-do-mar: cinco braços; girar 72° coincide consigo. Sistema ambulacrário esquemático.'),
  [B+'introducao-aos-cordados-e-os-peixes']:l('chordate','Características dos cordados','Estrutura destacada',1,4,1,1,'Notocorda, tubo nervoso dorsal, fendas faríngeas e cauda pós-anal.'),
  [B+'cordados-tetrapodes']:l('heart-chambers','Corações dos vertebrados','Mistura de sangue',0,1,.5,.5,'Peixe: 2 cavidades; anfíbio: 3; réptil (não crocodiliano): 3 com septo parcial; ave e mamífero: 4.',[['fish','Peixe'],['amphibian','Anfíbio'],['reptile','Réptil'],['bird','Ave/Mamífero']]),
  [B+'fungos']:l('fungi','Micélio e hifas','Tempo de crescimento',0,1,.1,.5,'Hifas ramificadas formam o micélio; corpo de frutificação esquemático.'),
  [B+'algas']:l('algae-depth','Algas e luz na água','Profundidade em m',0,60,10,20,'Atenuação esquemática da luz. Algas fotossintetizantes vivem onde há luz.'),
  [B+'ciclos-de-vida']:l('life-cycles','Ciclos de vida','Etapa do ciclo',0,1,.25,0,'Meiose e fecundação alternam n e 2n; em que fase ocorre a meiose define o ciclo.',[['haplontic','Haplobionte haplonte'],['diplontic','Haplobionte diplonte'],['alternation','Haplodiplobionte']]),
  [B+'plantas-terrestres-i-briofitas-e-pteridofitas']:l('bryo-pterido','Briófitas e pteridófitas','Altura relativa',1,5,1,3,'Briófitas: avasculares, pequenas, gametófito dominante. Pteridófitas: vasculares, esporófito dominante.',[['bryophyte','Briófita'],['pteridophyte','Pteridófita']]),
  [B+'plantas-terrestres-ii-gimnospermas-e-angiospermas']:l('seed-fruit','Sementes nuas e frutos','Desenvolvimento',0,1,.25,.5,'Gimnosperma: semente em estróbilo, sem fruto. Angiosperma: flor, ovário vira fruto.',[['gymno','Gimnosperma'],['angio','Angiosperma']]),
  [B+'procariotos']:l('bacterium','Célula bacteriana e divisão','Etapa da fissão binária',0,1,.25,0,'Sem núcleo organizado: nucleoide, plasmídeos, ribossomos 70S, parede e flagelo.'),
  [B+'virus']:l('virus','Vírus: cápsula e ciclo','Etapa do ciclo',0,1,.25,0,'Capsídeo icosaédrico esquemático. Adsorção → penetração → replicação → montagem → liberação.'),
  [B+'fisiologia-da-sustentacao-e-da-locomocao']:l('lever-arm','Antebraço como alavanca','Ângulo do cotovelo',30,150,15,90,'Peso de 50 N na mão a 35 cm; bíceps a 4 cm do cotovelo. F_bíceps = 50·35/4 no braço perpendicular.'),
  [B+'coordenacao-nervosa-ii']:l('synapse','Sinapse química','Neurotransmissor liberado',1,6,1,3,'Potencial chega ao terminal, vesículas liberam neurotransmissor, receptores pós-sinápticos respondem.'),
  [B+'sistemas-sensoriais-visao-e-audicao']:l('senses','Visão e audição','Frequência ou distância',1,5,1,3,'Audição: cóclea em espiral, agudos perto da base, graves no ápice. Visão: cristalino focaliza na retina.',[['hearing','Audição'],['vision','Visão']]),
  [B+'coordenacao-endocrina-i']:l('endocrine-axis','Eixo hipotálamo-hipófise-tireoide','Hormônio tireoidiano',1,5,1,3,'TRH → TSH → T3/T4; retroalimentação negativa reduz TRH e TSH quando T3/T4 sobem.'),
  [B+'coordenacao-endocrina-ii']:l('glycemia','Insulina e glucagon','Glicemia (mg/dL)',50,200,10,90,'Faixa de jejum de referência ~70–99 mg/dL. Insulina baixa a glicemia; glucagon eleva.'),

  [G+'desafios-ambientais-do-seculo-xxi']:l('env-pressures','Pressões ambientais no planeta','Intensidade das pressões',1,5,1,3,'Desmatamento, emissões, água e resíduos como pressões relacionadas. '+FICT),
  [G+'geopolitica-ambiental']:l('env-diplomacy','Diplomacia ambiental','Compromisso dos países',1,5,1,3,'Kyoto (1997): metas obrigatórias só para desenvolvidos. Paris (2015): todos apresentam NDCs. Responsabilidades comuns, porém diferenciadas.',[['kyoto','Kyoto'],['paris','Paris']]),
  [G+'geopolitica-dos-recursos-hidricos']:l('shared-basin','Bacia compartilhada','Volume retido na barragem',0,5,1,2,'País a montante controla a vazão de quem está a jusante. '+FICT),
  [G+'hidrogeografia-mundial']:l('river-profile','Perfil longitudinal do rio','Declividade do alto curso',2,6,1,4,'Alto curso: erosão e declive; médio: transporte; baixo: deposição. Esquema sem rio real.'),
  [G+'do-mundo-bipolar-ao-multipolar']:l('polarity','Da bipolaridade à multipolaridade','Polos de poder',2,6,1,2,'Guerra Fria: dois polos (EUA e URSS). Após 1991, ordem com mais centros de poder. Tamanhos ilustrativos.'),
  [G+'globalizacao-e-processos-economicos-atuais']:l('globalization','Globalização: fluxos','Intensidade dos fluxos',1,5,1,3,'Capitais, mercadorias, informação e pessoas entre centros. '+FICT),
  [G+'geografia-das-redes-mundiais']:l('networks','Redes: nós e conexões','Hubs',1,4,1,2,'Rede com hubs concentra conexões; a falha de um hub isola mais nós. '+FICT),
  [G+'unilateralismo-e-multilateralismo']:l('lateralism','Unilateralismo × multilateralismo','Países',4,8,1,6,'Unilateral: decisão parte de um centro. Multilateral: decisões negociadas entre muitos.',[['uni','Unilateralismo'],['multi','Multilateralismo']]),
  [G+'blocos-economicos']:l('integration-stages','Estágios de integração','Estágio',1,4,1,2,'Zona de livre comércio → união aduaneira (TEC) → mercado comum (pessoas e capitais) → união econômica e monetária.'),
  [G+'uniao-europeia']:l('eu-circles','União Europeia em círculos','Integração',1,3,1,2,'Conjuntos que não coincidem: membros da UE, zona do euro e espaço Schengen. Quantidades ilustrativas.'),
  [G+'desigualdades-globais']:l('inequality','Desigualdade de renda','Concentração',0,1,.1,.5,'Cinco quintis de uma população fictícia; índice de Gini calculado do modelo, não de um país.'),
  [G+'mobilidade-populacional']:l('migration','Fatores de repulsão e atração','Diferença de oportunidades',1,5,1,3,'Fluxo cresce com a diferença entre origem e destino. '+FICT),
  [G+'geografia-do-turismo']:l('tourism','Turismo e sazonalidade','Mês do ano',1,12,1,7,'Destino litorâneo fictício: alta temporada concentra fluxo. '+FICT),
  [G+'producao-agricola-mundial']:l('agri-systems','Sistemas agrícolas','Área cultivada',1,5,1,3,'Intensivo: muito capital por hectare, alta produtividade. Extensivo: pouco capital, produtividade menor. '+FICT,[['intensive','Intensivo'],['extensive','Extensivo']]),
  [G+'industria-i']:l('industrial-revolutions','Revoluções industriais','Fase',1,4,1,2,'1ª: carvão e vapor (séc. XVIII); 2ª: petróleo e eletricidade (séc. XIX–XX); 3ª: informática; 4ª: automação em rede.'),
  [G+'industria-ii']:l('fordism','Fordismo × toyotismo','Estoque produzido',1,5,1,3,'Fordismo: produção em massa e estoques. Toyotismo: just-in-time, produção puxada pela demanda.',[['ford','Fordismo'],['toyota','Toyotismo']]),
  [G+'gedeconomia-mundial']:l('core-periphery','Centro e periferia','Distância ao centro',1,3,1,2,'Divisão internacional do trabalho: centro concentra tecnologia e capital; periferia exporta produtos primários. Esquema.'),
  [G+'terrorismo-internacional']:l('cell-network','Organização em rede','Células conectadas',3,8,1,5,'Estrutura descentralizada em células, comparada a uma hierarquia. Modelo conceitual de organização, sem casos ou locais.',[['network','Rede de células'],['hierarchy','Hierarquia']]),
  [G+'geografia-das-religioes']:l('religion-diffusion','Difusão a partir de focos','Alcance da difusão',1,5,1,3,'Religiões universalizantes tendem a se difundir além do foco de origem; étnicas permanecem ligadas a um povo. Esquema.',[['universal','Universalizante'],['ethnic','Étnica']]),
  [G+'tensoes-geopoliticas-na-europa']:l('europe-tensions','Zonas de influência','Sobreposição',0,1,.25,.5,'Duas esferas de influência e uma faixa disputada entre elas. Modelo conceitual, sem países.'),
  [G+'geopolitica-e-geoeconomia-da-america-latina']:l('latam-trade','Exportação primária e termos de troca','Preço das commodities',1,5,1,3,'Exporta-se produto primário e importa-se industrializado; o saldo oscila com o preço das commodities. '+FICT),
  [G+'africa-no-mundo-atual']:l('africa-borders','Fronteiras artificiais','Grupos culturais',3,6,1,4,'Fronteiras retilíneas traçadas por potências (Conferência de Berlim, 1884–85) cortando grupos culturais. Esquema sem mapa real.'),
  [G+'geopolitica-e-geoeconomia-da-asia']:l('flying-geese','Modelo dos gansos voadores','Etapa',1,4,1,2,'Industrialização em sequência: Japão, depois Tigres Asiáticos, depois novos tigres e China. Alturas ilustrativas.'),
  [G+'geografia-do-oriente-medio']:l('middle-east-resources','Petróleo e água','Escassez de água',1,5,1,3,'Região com grandes reservas de petróleo e escassez hídrica. Barras qualitativas.'),
  [G+'questao-palestina']:l('palestine-timeline','Questão Palestina: marcos','Marco',1,5,1,1,'Linha do tempo factual: 1947 plano de partilha da ONU; 1948 criação de Israel; 1967 Guerra dos Seis Dias; 1993 Acordos de Oslo; 2005 retirada de Gaza. Sem mapa.'),
  [G+'conflitos-no-mundo-arabe']:l('arab-spring','Primavera Árabe','Marco',1,4,1,1,'Começa na Tunísia (dez. 2010) e se espalha em 2011, com desfechos distintos por país. Linha do tempo esquemática.'),
  [G+'paisagem-espaco-geografico-e-ciencia-geografica']:l('landscape','Paisagem natural e humanizada','Tempo de ocupação',0,1,.25,.5,'A paisagem acumula marcas de tempos diferentes (rugosidades). Esquema.'),
  [G+'pedologia']:l('soil-horizons','Horizontes do solo','Intemperismo',1,5,1,3,'O (orgânico), A (mineral com matéria orgânica), B (acúmulo), C (rocha alterada), R (rocha). Espessuras ilustrativas.'),
  [G+'politicas-ambientais-brasileiras']:l('protected-areas','Unidades de conservação','Zona destacada',1,2,1,1,'SNUC: proteção integral (uso indireto) e uso sustentável (uso direto controlado).'),
  [G+'hidrogeografia-do-brasil']:l('br-rivers','Rios de planalto e de planície','Desnível',1,5,1,3,'Rios de planalto: quedas, potencial hidrelétrico. Rios de planície: navegação. Esquema.',[['plateau','Planalto'],['plain','Planície']]),
  [G+'matriz-energetica']:l('energy-matrix','Matriz energética','Participação renovável (%)',10,60,5,45,'Ordem de grandeza: Brasil perto de metade renovável; média mundial bem menor. Use o controle para comparar.',[['brazil','Brasil (aprox.)'],['world','Mundo (aprox.)']]),
  [G+'combustiveis-fosseis-e-biocombustiveis-no-brasil']:l('biofuel-cycle','Fóssil × biocombustível','Etapa do ciclo',0,1,.25,0,'Etanol: o CO₂ emitido foi absorvido pela cana. Fóssil: carbono retirado do subsolo vai para a atmosfera. Emissões da produção omitidas.',[['ethanol','Etanol'],['fossil','Combustível fóssil']]),
  [G+'energia-eletrica-no-mundo']:l('power-sources','Fontes de eletricidade','Potência relativa',1,5,1,3,'Usinas esquemáticas: térmica, nuclear, hidrelétrica, eólica e solar.',[['thermal','Térmica'],['nuclear','Nuclear'],['hydro','Hidrelétrica'],['wind','Eólica'],['solar','Solar']]),
  [G+'energia-eletrica-no-brasil']:l('br-electricity','Eletricidade no Brasil','Volume dos reservatórios',1,5,1,3,'Predomínio hidrelétrico; em seca, térmicas são acionadas. Proporções ilustrativas.'),
  [G+'producao-mineral']:l('open-pit','Mina a céu aberto','Profundidade da cava',1,5,1,3,'Bancadas escalonadas; volume de estéril cresce com a profundidade. Esquema.'),
  [G+'o-espaco-agrario-brasileiro']:l('land-structure','Estrutura fundiária','Concentração',0,1,.2,.6,'Poucos estabelecimentos grandes ocupam a maior parte da área. '+FICT),
  [G+'o-espaco-industrial-brasileiro-i']:l('br-industry','Concentração e desconcentração industrial','Tempo',0,1,.25,0,'Concentração no Sudeste até os anos 1970; depois desconcentração relativa. Esquema sem mapa.'),
  [G+'o-espaco-industrial-brasileiro-ii']:l('fiscal-war','Guerra fiscal','Incentivo fiscal oferecido',1,5,1,3,'Fábrica fictícia se desloca para onde o incentivo supera o custo da mudança.'),
  [G+'dinamica-demografica']:l('age-pyramid','Transição demográfica','Estágio',1,4,1,2,'Pirâmide de base larga → base estreitando → topo alargado. Proporções ilustrativas.'),
  [G+'estrutura-etnica-e-fluxos-migratorios']:l('migration-waves','Formação da população brasileira','Período',1,4,1,1,'Indígenas; africanos escravizados (séc. XVI–XIX); europeus e asiáticos (fim do XIX–XX); migrações internas.'),
  [G+'o-espaco-urbano-i']:l('urbanization','Urbanização brasileira','Ano',1950,2010,10,1970,'Taxa de urbanização aproximada (IBGE): ~36% (1950), ~56% (1970), ~84% (2010).'),
  [G+'o-espaco-urbano-ii']:l('urban-hierarchy','Hierarquia urbana','Nível destacado',1,4,1,1,'Metrópole → capital regional → centro sub-regional → centro local. Esquema.'),
  [G+'as-redes-de-transportes']:l('transport-modes','Modais de transporte','Carga transportada',1,5,1,3,'Custo por tonelada-quilômetro: hidroviário < ferroviário < rodoviário (ordem qualitativa).',[['road','Rodoviário'],['rail','Ferroviário'],['water','Hidroviário']]),
  [G+'os-fluxos-do-comercio-externo']:l('trade-balance','Balança comercial','Exportações',1,10,1,6,'Importações fixas em 5 (unidades fictícias). Saldo = exportações − importações.'),
  'geo-bonus-demografico':l('demographic-bonus','Bônus demográfico','Estágio',1,4,1,2,'Razão de dependência = (jovens + idosos)/adultos. O bônus ocorre quando ela é mínima. Proporções ilustrativas.'),
};

export const logisticN=(r:number,t:number,K=100,N0=5)=>K/(1+(K/N0-1)*Math.exp(-r*t));
export const recombinantFraction=(cm:number)=>Math.min(.5,cm/100);
export function alleleAfter(s:number,gens:number,p0=.1){let p=p0;for(let g=0;g<gens;g++){const q=1-p,w=1-s*q*q;p=(p*p+p*q)/w;}return p;}
export function gini(shares:number[]){const n=shares.length,sorted=[...shares].sort((a,b)=>a-b),total=sorted.reduce((a,b)=>a+b,0);let s=0;sorted.forEach((x,i)=>{s+=(2*(i+1)-n-1)*x;});return s/(n*total);}
