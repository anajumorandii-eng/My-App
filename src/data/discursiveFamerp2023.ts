// Famerp 2023, 2º dia: as 20 discursivas do caderno oficial (FMRP2201), com
// respostas-modelo escritas e calculadas do zero. Mesmo critério de
// discursiveFamerp2026.ts.

import type { DiscursiveQuestion } from '../types';

const SRC = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2023/2dia/famerp2023_2dia_prova.pdf';
const fig = (n: number, alt: string) => [{ url: `/question-media/discursivas/famerp-2023/q${String(n).padStart(2, '0')}.webp`, alt }];
const base = { board: 'Famerp', year: 2023, sourceUrl: SRC } as const;

export const famerp2023Discursive: DiscursiveQuestion[] = [
  {
    ...base, id: 'disc_famerp_2023_q01', topicId: 'bio_biotecnologia', subject: 'Biologia',
    topic: 'Superlarvas que digerem poliestireno — enzimas e plasmídeos',
    prompt: 'Cientistas australianos descobriram que superlarvas de tenébrio (Zophobas morio) se alimentam de poliestireno e que suas enzimas intestinais podem ser uma forma de reciclar esse plástico. As larvas sobreviveram só com poliestireno e chegaram a adultos, mas perderam diversidade microbiana intestinal: o plástico não é nutritivo. (Folha de S.Paulo, 11.06.2022, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Qual a função das enzimas intestinais das superlarvas na reciclagem do poliestireno? Cite um fator abiótico que influencia a atividade de uma enzima.' },
      { letter: 'b', prompt: 'Se os cientistas usarem plasmídeo bacteriano para sintetizar uma enzima da superlarva, o que deve ser descoberto antes de alterar o plasmídeo? Cite a propriedade do código genético que permite essa síntese.' },
    ],
    modelAnswer: [
      'Item a: catalisar a quebra (degradação) das moléculas do polímero em moléculas menores, acelerando a reação. Fatores: temperatura ou pH.',
      'Item b: o gene (a sequência de DNA) que codifica a enzima, para inseri-lo no plasmídeo. A universalidade do código genético: a bactéria lê os mesmos códons e produz a mesma proteína.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q02', topicId: 'bio_zoologia', subject: 'Biologia',
    topic: 'Ciclo do Trypanosoma cruzi — doença de Chagas',
    prompt: 'A figura representa o ciclo de vida de um protozoário parasita, alternando entre o ser humano (formas 2, 3 e 4; em 3, formas arredondadas agrupadas dentro de uma célula) e o inseto barbeiro (forma 1, alongada, com flagelo).',
    figures: fig(2, 'Ciclo do protozoário entre o ser humano e o barbeiro, com fases numeradas de 1 a 4'),
    subItems: [
      { letter: 'a', prompt: 'Cite a doença causada pelo protozoário. Qual número indica a fase em que ele não tem estrutura locomotora?' },
      { letter: 'b', prompt: 'Explique o que o protozoário provoca no coração e causa manifestações graves na fase crônica. Como o vetor transmite a doença?' },
    ],
    modelAnswer: [
      'Item a: doença de Chagas. Fase 3: amastigotas, intracelulares e sem flagelo livre.',
      'Item b: os amastigotas se multiplicam dentro das fibras do músculo cardíaco, que se rompem; a inflamação crônica destrói e substitui fibras por tecido fibroso, levando a aumento do coração (cardiomegalia), arritmias e insuficiência cardíaca. O barbeiro pica e defeca; as fezes contêm tripomastigotas, que entram pela lesão da picada ou por mucosas quando a pessoa coça.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q03', topicId: 'bio_ecologia', subject: 'Biologia',
    topic: 'Sucessão primária em ilha vulcânica',
    prompt: 'Ao longo de centenas de anos, uma ilha marítima recém-formada por erupção vulcânica foi colonizada por sucessivas comunidades até o clímax.',
    subItems: [
      { letter: 'a', prompt: 'Cite uma característica da comunidade pioneira que permite iniciar a sucessão. Como os organismos pioneiros chegaram à ilha?' },
      { letter: 'b', prompt: 'Por que a biomassa se torna estável no clímax? Por que há maior variedade de nichos no clímax?' },
    ],
    modelAnswer: [
      'Item a: são autótrofos resistentes a condições extremas e pouco exigentes (como liquens), capazes de viver sobre rocha nua e iniciar a formação de solo. Chegaram trazidos pelo vento, pelas correntes marinhas ou por aves.',
      'Item b: no clímax, a produção (fotossíntese) se iguala ao consumo (respiração de toda a comunidade): a produtividade líquida tende a zero e a biomassa não cresce mais. Há mais espécies e mais estratos e microambientes, o que multiplica as formas de explorar recursos — mais nichos.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q04', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Anemia hemolítica autoimune',
    prompt: 'A anemia hemolítica autoimune pode surgir em qualquer idade; em metade dos casos não se determina a causa, e pode acompanhar outra doença, como o lúpus eritematoso sistêmico. (Manual Merck, 2009, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Cite a célula sanguínea relacionada diretamente à anemia hemolítica. Em que local do corpo essa célula é normalmente destruída?' },
      { letter: 'b', prompt: 'Em que consiste a doença autoimune humoral que provoca a hemólise? Por que pessoas com anemia se cansam em atividades de baixo esforço?' },
    ],
    modelAnswer: [
      'Item a: a hemácia (eritrócito). Normalmente é destruída no baço (e também no fígado).',
      'Item b: o sistema imune produz anticorpos contra antígenos das próprias hemácias (autoanticorpos), que marcam essas células para destruição. Com menos hemácias e hemoglobina, chega menos O₂ aos músculos; a produção de ATP cai e a fadiga aparece cedo.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q05', topicId: 'bio_biotecnologia', subject: 'Biologia',
    topic: 'Terapia CAR-T',
    prompt: 'Na terapia CAR-T, células T do próprio paciente são retiradas do sangue e alteradas geneticamente para se encaixarem na superfície das células cancerosas e atacá-las; são multiplicadas em laboratório e reinseridas no paciente. (Folha de S.Paulo, 27.11.2021, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Por que há baixo risco de rejeição das células CAR-T? Que divisão celular está relacionada a um câncer?' },
      { letter: 'b', prompt: 'Cite a principal substância orgânica na superfície das células cancerosas que é alvo das células CAR-T. Uma pessoa curada poderá transmitir as células CAR-T aos descendentes? Justifique.' },
    ],
    modelAnswer: [
      'Item a: são células do próprio paciente (transplante autólogo), com os mesmos antígenos de histocompatibilidade (MHC); não são reconhecidas como estranhas. Mitose descontrolada.',
      'Item b: proteínas (antígenos de membrana, em geral glicoproteínas). Não: a alteração foi feita em linfócitos, células somáticas; não atinge os gametas e por isso não é herdada.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q06', topicId: 'bio_fisio_vegetal', subject: 'Biologia',
    topic: 'Íons K⁺ e fechamento estomático',
    prompt: 'O gráfico mostra a concentração de K⁺ nas células anexas e nas células-guarda de uma folha ao longo do tempo, sob efeito de um fitormônio numa dada condição do solo. No momento 1, o K⁺ é alto nas células-guarda e baixo nas anexas; no momento 2 as curvas se cruzam; no momento 3, o K⁺ está baixo nas células-guarda e alto nas anexas.',
    figures: fig(6, 'Gráfico de K⁺ nas células anexas e nas células-guarda nos momentos 1, 2 e 3'),
    subItems: [
      { letter: 'a', prompt: 'Qual a principal vantagem de muitas plantas manterem os estômatos fechados à noite? Cite uma condição abiótica do solo que pode induzir o fechamento mesmo com a planta iluminada.' },
      { letter: 'b', prompt: 'Em que momento, 1, 2 ou 3, os estômatos estão fechados? Justifique citando o fitormônio que induz o fechamento.' },
    ],
    modelAnswer: [
      'Item a: evitar a perda de água por transpiração num período em que, sem luz, não há fotossíntese a aproveitar o CO₂. Solo seco (pouca água disponível) ou muito salino.',
      'Item b: no momento 3. Sob ação do ácido abscísico, o K⁺ sai das células-guarda para as anexas; a água sai por osmose, as células-guarda ficam flácidas e o ostíolo se fecha.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q07', topicId: 'bio_genetica', subject: 'Biologia',
    topic: 'Distrofia de Duchenne — herança ligada ao X',
    prompt: 'A distrofia muscular de Duchenne é determinada por um alelo recessivo ligado ao sexo, mais comum no sexo masculino, que afeta os músculos esqueléticos e leva ao óbito precoce.',
    subItems: [
      { letter: 'a', prompt: 'Cite o cromossomo sexual onde está o alelo recessivo. Por que o sexo masculino é heterogamético?' },
      { letter: 'b', prompt: 'Um casal tem dois filhos, Giovana e Murilo; só Murilo tem a distrofia. Qual a probabilidade de Giovana gerar uma criança do sexo masculino com a distrofia? Demonstre os cálculos.' },
    ],
    modelAnswer: [
      'Item a: no cromossomo X. O homem é XY e forma dois tipos de gametas (com X ou com Y).',
      'Item b: Murilo (XᵈY) recebeu o Xᵈ da mãe, que é portadora (XᴰXᵈ); o pai é XᴰY. Giovana é portadora com probabilidade 1/2. Supondo um parceiro sem o alelo: P = 1/2 (ser portadora) × 1/2 (transmitir Xᵈ) × 1/2 (filho do sexo masculino) = 1/8.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q08', topicId: 'bio_evolucao', subject: 'Biologia',
    topic: 'Especiação no Havaí e cladograma',
    prompt: 'A imagem mostra a especiação alopátrica e simpátrica nas ilhas do Havaí a partir de uma espécie ancestral, com a idade aproximada das ilhas: Kaua’i (5,1 milhões de anos), O’ahu (3,7), Maui/Moloka’i (1,3) e Hawai’i (0,4). Aparecem as plantas Dubautia laxa, D. waialealae, D. scabra, D. linearis e Argyroxiphium sandwicense. A prova pede um cladograma com A. sandwicense, D. scabra e D. waialealae.',
    figures: fig(8, 'Mapa das ilhas do Havaí com idades e fotos das espécies de Dubautia e Argyroxiphium'),
    subItems: [
      { letter: 'a', prompt: 'Preencha o cladograma com Argyroxiphium sandwicense, Dubautia scabra e D. waialealae de acordo com o parentesco. Cite um mecanismo pós-zigótico que indique isolamento reprodutivo.' },
      { letter: 'b', prompt: 'Qual o principal fator que permitiu a especiação alopátrica? Por que ele é fundamental para a formação de novas espécies?' },
    ],
    modelAnswer: [
      'Item a: o raciocínio é usar as idades das ilhas: a espécie da ilha mais antiga (D. waialealae, de Kaua’i) separou-se primeiro e fica no ramo externo; as duas das ilhas mais jovens (A. sandwicense e D. scabra) ficam como grupo-irmão. Mecanismos pós-zigóticos: inviabilidade do híbrido, esterilidade do híbrido ou degeneração da geração F₂.',
      'Item b: o isolamento geográfico pelo mar entre as ilhas. Ele interrompe o fluxo gênico; cada população acumula diferenças próprias (mutação, seleção natural em ambientes diferentes, deriva) até ficar reprodutivamente isolada.',
    ],
    note: 'O cladograma a preencher está no campo de resposta do caderno; a distribuição exata das espécies pelas ilhas foi lida na figura e deve ser conferida nela.',
    uncertain: true,
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2023_q09', topicId: 'qui_organica_reacoes', subject: 'Química',
    topic: 'Etanoato de butila — isomeria e esterificação',
    prompt: 'O etanoato de butila (aroma de maçã e banana), CH₃–COO–CH₂–CH₂–CH₂–CH₃, é obtido pela esterificação entre um ácido e um álcool, com ácido sulfúrico como catalisador.',
    subItems: [
      { letter: 'a', prompt: 'Escreva a fórmula molecular do etanoato de butila. Represente o ácido carboxílico isômero de função dele, sem ramificações.' },
      { letter: 'b', prompt: 'Represente o ácido e o álcool precursores do etanoato de butila.' },
    ],
    modelAnswer: [
      'Item a: C₆H₁₂O₂. Isômero de função sem ramificação: ácido hexanoico, CH₃–CH₂–CH₂–CH₂–CH₂–COOH.',
      'Item b: ácido etanoico (acético), CH₃–COOH, e butan-1-ol, CH₃–CH₂–CH₂–CH₂–OH.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q10', topicId: 'qui_termoquimica', subject: 'Química',
    topic: 'Hidrogênio combustível — Nox e reagente limitante',
    prompt: 'O hidrogênio libera apenas vapor d’água: H₂(g) + ½ O₂(g) → H₂O(g), ΔH = −242 kJ.',
    subItems: [
      { letter: 'a', prompt: 'Escreva a distribuição eletrônica do O em níveis de energia. Determine a variação do Nox do oxigênio na reação.' },
      { letter: 'b', prompt: 'Determine a energia máxima liberada na reação entre 200 g de O₂ e 20 g de H₂.' },
    ],
    modelAnswer: [
      'Item a: K = 2, L = 6. Nox do O: 0 no O₂ → −2 na água; variação de 2 unidades (redução).',
      'Item b: H₂: 20/2 = 10 mol; O₂: 200/32 = 6,25 mol. Para 10 mol de H₂ bastam 5 mol de O₂: o H₂ é limitante. Energia = 10 × 242 = 2 420 kJ.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q11', topicId: 'qui_solucoes', subject: 'Química',
    topic: 'Raio iônico, abundância isotópica e mistura de soluções',
    prompt: 'Um técnico misturou 200 mL de KCl 0,2 mol/L com 300 mL de CaCl₂ 0,1 mol/L, obtendo 500 mL de solução. O cloro tem massa atômica 35,5 u e dois isótopos, ³⁵Cl e ³⁷Cl.',
    subItems: [
      { letter: 'a', prompt: 'Coloque Ca²⁺, Cl⁻ e K⁺ em ordem crescente de raio iônico. Determine a abundância isotópica do ³⁵Cl.' },
      { letter: 'b', prompt: 'Calcule a concentração, em mol/L, de Ca²⁺ e de Cl⁻ na solução final.' },
    ],
    modelAnswer: [
      'Item a: os três têm 18 elétrons; quanto mais prótons, menor o raio: Ca²⁺ < K⁺ < Cl⁻. 35x + 37(1 − x) = 35,5 → x = 0,75: 75% de ³⁵Cl.',
      'Item b: Ca²⁺: 0,3 × 0,1 = 0,03 mol / 0,5 L = 0,06 mol/L. Cl⁻: 0,2 × 0,2 = 0,04 mol (do KCl) + 2 × 0,03 = 0,06 mol (do CaCl₂) = 0,10 mol / 0,5 L = 0,20 mol/L.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q12', topicId: 'qui_estequiometria', subject: 'Química',
    topic: 'Airbag — gases e reagente em excesso',
    prompt: 'No airbag, a azida de sódio (NaN₃, 65 g/mol) se decompõe gerando N₂ (28 g/mol); o Fe₂O₃ (160 g/mol) reage com o sódio formado: 6 NaN₃(s) + Fe₂O₃(s) → 3 Na₂O(s) + 2 Fe(s) + 9 N₂(g). O airbag inflado tem 65,6 L; R = 0,082 atm·L/(mol·K).',
    subItems: [
      { letter: 'a', prompt: 'Quantas substâncias simples e quantas compostas há na equação? Calcule a quantidade de gás para encher o airbag a 27 °C e 1,2 atm.' },
      { letter: 'b', prompt: 'Determine a massa mínima de NaN₃ para produzir 126 g de N₂ num sistema com 100 g de Fe₂O₃. Determine a massa de Fe₂O₃ em excesso.' },
    ],
    modelAnswer: [
      'Item a: simples: Fe e N₂ (2); compostas: NaN₃, Fe₂O₃ e Na₂O (3). n = PV/RT = 1,2 × 65,6/(0,082 × 300) = 78,72/24,6 = 3,2 mol.',
      'Item b: 126 g de N₂ = 4,5 mol; NaN₃ = 4,5 × 6/9 = 3 mol = 195 g. Fe₂O₃ necessário = 3/6 = 0,5 mol = 80 g; excesso = 100 − 80 = 20 g.',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2023_q13', topicId: 'qui_eletroquimica', subject: 'Química',
    topic: 'Pilha ferro–chumbo',
    prompt: 'Uma pilha tem eletrodo de Fe em Fe²⁺ 1 mol/L e eletrodo de Pb em Pb²⁺ 1 mol/L, ligados por fio e por ponte salina. E°red: Fe²⁺/Fe = −0,44 V; Pb²⁺/Pb = −0,13 V.',
    figures: fig(13, 'Pilha com eletrodos de ferro e chumbo ligados por fio e ponte salina'),
    subItems: [
      { letter: 'a', prompt: 'Escreva a equação global iônica e determine a ddp padrão.' },
      { letter: 'b', prompt: 'Identifique o cátodo e o eletrodo onde ocorre a redução. Indique a movimentação dos íons na ponte salina de KNO₃.' },
    ],
    modelAnswer: [
      'Item a: Fe(s) + Pb²⁺(aq) → Fe²⁺(aq) + Pb(s). ddp = −0,13 − (−0,44) = 0,31 V.',
      'Item b: o cátodo é o eletrodo de chumbo, onde ocorre a redução Pb²⁺ + 2e⁻ → Pb. Na ponte salina, os K⁺ migram para o compartimento do Pb (repondo a carga positiva consumida) e os NO₃⁻ para o compartimento do Fe (compensando os Fe²⁺ formados).',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q14', topicId: 'qui_equilibrio', subject: 'Química',
    topic: 'Força dos ácidos e equilíbrio do HF',
    prompt: 'O H₂SO₄ é ácido forte; o HF (Ka = 7,0 × 10⁻⁴) e o HCN (Ka = 4,0 × 10⁻¹⁰) são parcialmente ionizados. Todos são nocivos ao ser humano.',
    subItems: [
      { letter: 'a', prompt: 'Represente a fórmula estrutural do HCN. Equacione a neutralização completa do ácido sulfúrico com KOH.' },
      { letter: 'b', prompt: 'Qual a concentração de HF não ionizado no equilíbrio numa solução de pH 2? Qual o efeito da adição de NaF sólido sobre a constante de ionização do HF?' },
    ],
    modelAnswer: [
      'Item a: H–C≡N. H₂SO₄ + 2 KOH → K₂SO₄ + 2 H₂O.',
      'Item b: pH 2 → [H⁺] = [F⁻] = 1 × 10⁻² mol/L. Ka = [H⁺][F⁻]/[HF] → [HF] = 10⁻⁴/7,0 × 10⁻⁴ ≈ 0,14 mol/L. Nenhum efeito sobre Ka, que só muda com a temperatura; o F⁻ adicionado desloca o equilíbrio no sentido do HF não ionizado (efeito do íon comum).',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q15', topicId: 'fis_termodinamica_gases', subject: 'Física',
    topic: 'Teoria cinética dos gases',
    prompt: 'A energia cinética média das moléculas de um gás ideal é Ec = (3/2)·k·T, com k = 1,4 × 10⁻²³ J/K.',
    subItems: [
      { letter: 'a', prompt: 'As moléculas se movem a 1,2 × 10³ m/s em média e percorrem 6,0 × 10⁻⁷ m entre colisões. Calcule o intervalo médio entre colisões e o número de colisões em 5,0 s.' },
      { letter: 'b', prompt: 'Noutro gás, Ec média = 2,1 × 10⁻²⁰ J e cada molécula tem 4,2 × 10⁻²⁶ kg. Calcule a temperatura e a velocidade de uma molécula com energia igual à média.' },
    ],
    modelAnswer: [
      'Item a: Δt = 6,0 × 10⁻⁷/1,2 × 10³ = 5,0 × 10⁻¹⁰ s. Em 5,0 s: 5,0/5,0 × 10⁻¹⁰ = 1,0 × 10¹⁰ colisões.',
      'Item b: T = 2Ec/(3k) = 4,2 × 10⁻²⁰/(4,2 × 10⁻²³) = 1,0 × 10³ K. ½ m v² = 2,1 × 10⁻²⁰ → v² = 4,2 × 10⁻²⁰/4,2 × 10⁻²⁶ = 1,0 × 10⁶ → v = 1,0 × 10³ m/s.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q16', topicId: 'fis_gravitacao_circular', subject: 'Física',
    topic: 'Asteroide em órbita elíptica — lei da gravitação',
    prompt: 'Um asteroide de 8,0 × 10⁸ kg descreve uma órbita elíptica em torno do Sol; no periélio P ele está a uma distância d do Sol e no afélio A, a 2d.',
    figures: fig(16, 'Órbita elíptica com o Sol a d do ponto P e a 2d do ponto A'),
    subItems: [
      { letter: 'a', prompt: 'Se a força do Sol em P é 4,0 × 10¹⁸ N, determine a aceleração do asteroide em P e a força do Sol sobre ele em A.' },
      { letter: 'b', prompt: 'Para um objeto de 2,0 kg na superfície do asteroide (esférico, raio 40 m; G = 6,6 × 10⁻¹¹ N·m²/kg²), calcule a aceleração gravitacional e o peso do objeto.' },
    ],
    modelAnswer: [
      'Item a: a = F/m = 4,0 × 10¹⁸/8,0 × 10⁸ = 5,0 × 10⁹ m/s². Com a distância dobrada, a força cai a 1/4: 1,0 × 10¹⁸ N.',
      'Item b: g = G·M/R² = 6,6 × 10⁻¹¹ × 8,0 × 10⁸/40² = 5,28 × 10⁻²/1 600 = 3,3 × 10⁻⁵ m/s². P = 2,0 × 3,3 × 10⁻⁵ = 6,6 × 10⁻⁵ N.',
    ],
    note: 'Os valores do item a são os do enunciado; servem para treinar a proporção 1/r², não para descrever um asteroide real.',
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q17', topicId: 'fis_calorimetria', subject: 'Física',
    topic: 'Condução de calor e dilatação superficial do alumínio',
    prompt: 'Uma barra de alumínio, a 0 °C, tem 50 cm de comprimento e 5,0 cm² de seção. Uma base é mantida a 0 °C e a outra a 100 °C. O fluxo de calor é Φ = k·A·Δθ/L, com k = 0,50 cal/(s·cm·°C).',
    subItems: [
      { letter: 'a', prompt: 'Calcule o fluxo de calor, em cal/s, e o calor que flui em 1,0 minuto.' },
      { letter: 'b', prompt: 'A área da base a 100 °C está 2,20 × 10⁻² cm² maior que a da base a 0 °C. Calcule os coeficientes de dilatação superficial e linear.' },
    ],
    modelAnswer: [
      'Item a: Φ = 0,50 × 5,0 × 100/50 = 5,0 cal/s. Em 60 s: 300 cal.',
      'Item b: β = ΔA/(A₀·Δθ) = 2,20 × 10⁻²/(5,0 × 100) = 4,4 × 10⁻⁵ °C⁻¹. α = β/2 = 2,2 × 10⁻⁵ °C⁻¹.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q18', topicId: 'fis_optica_geometrica', subject: 'Física',
    topic: 'Reflexão e refração numa interface plana',
    prompt: 'Um feixe de luz incide na superfície plana entre os meios 1 e 2 a 30° da normal; parte reflete (ângulo θ) e parte refrata (ângulo δ). A fonte está a 80 cm da superfície, e sua imagem por reflexão, a uma distância d do outro lado.',
    figures: fig(18, 'Feixe incidente a 30°, raio refletido θ, raio refratado δ; fonte a 80 cm e imagem a d'),
    subItems: [
      { letter: 'a', prompt: 'Determine θ e a distância d, justificando pelas leis da reflexão e pela formação de imagens.' },
      { letter: 'b', prompt: 'Com c = 300 000 km/s, n₁ = 1,0, sen 30° = 0,50 e sen δ = 0,20, calcule o índice do meio 2 e a velocidade da luz nele.' },
    ],
    modelAnswer: [
      'Item a: o ângulo de reflexão é igual ao de incidência: θ = 30°. A superfície funciona como espelho plano: a imagem é simétrica ao objeto, d = 80 cm.',
      'Item b: 1,0 × 0,50 = n₂ × 0,20 → n₂ = 2,5. v = c/n = 300 000/2,5 = 120 000 km/s.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2023_q19', topicId: 'fis_ondulatoria', subject: 'Física',
    topic: 'Onda estacionária e densidade linear da corda',
    prompt: 'A figura mostra uma onda estacionária numa corda X fixa em A e B, separados por 60 cm, com quatro fusos. A velocidade é dada por v = √(T/μ).',
    figures: fig(19, 'Onda estacionária com quatro fusos entre A e B, 60 cm'),
    subItems: [
      { letter: 'a', prompt: 'Com velocidade de 90 m/s, determine o comprimento de onda, em cm, e a frequência.' },
      { letter: 'b', prompt: 'A corda Y tem μ = 6,0 g/m e velocidade v_Y; na corda Z, v_Z = 2v_Y. Com mesma tração e mesmo comprimento, calcule μ_Z e a massa do trecho de Z entre as extremidades.' },
    ],
    modelAnswer: [
      'Item a: quatro fusos em 60 cm: cada um mede λ/2 = 15 cm, λ = 30 cm. f = v/λ = 90/0,30 = 300 Hz.',
      'Item b: com T igual, v ∝ 1/√μ; dobrar v exige μ quatro vezes menor: μ_Z = 6,0/4 = 1,5 g/m. Massa = 1,5 g/m × 0,60 m = 0,90 g.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2023_q20', topicId: 'fis_eletromagnetismo', subject: 'Física',
    topic: 'Equilíbrio de forças e movimento circular em campo magnético',
    prompt: 'Uma partícula de 4,0 × 10⁻⁹ kg e carga 2,0 × 10⁻⁹ C se move com velocidade constante de 500 m/s, horizontal, no plano xy, numa região com campo elétrico uniforme. O eixo z é vertical, e g aponta para −z.',
    figures: fig(20, 'Eixos x, y e z, com g para baixo e velocidade horizontal no plano xy'),
    subItems: [
      { letter: 'a', prompt: 'Com g = 10 m/s², calcule a força elétrica e determine sua direção e sentido, justificando pelas leis de Newton.' },
      { letter: 'b', prompt: 'Aplicado um campo magnético, a partícula passa a descrever movimento circular uniforme de raio 0,50 m a 500 m/s no plano xy. Calcule a intensidade do campo e apresente sua direção, justificando.' },
    ],
    modelAnswer: [
      'Item a: velocidade constante → resultante nula (1ª lei). A força elétrica equilibra o peso: F = m·g = 4,0 × 10⁻⁹ × 10 = 4,0 × 10⁻⁸ N, na direção do eixo z, sentido +z (para cima).',
      'Item b: a força magnética é a resultante centrípeta: q·v·B = m·v²/R → B = m·v/(q·R) = 4,0 × 10⁻⁹ × 500/(2,0 × 10⁻⁹ × 0,50) = 2,0 × 10³ T. Para a força ficar no plano xy e perpendicular à velocidade, B deve ser perpendicular a esse plano: direção do eixo z (regra da mão direita/esquerda); o sentido depende do sentido de giro.',
    ],
    note: 'O valor de B (2 000 T) é muito maior que os obtidos em laboratório; resulta dos dados do enunciado.',
    suggestedMinutes: 12,
  },
];
