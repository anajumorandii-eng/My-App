// Famerp 2024, 2º dia: as 20 discursivas do caderno oficial (FMRP2301), com
// respostas-modelo escritas e calculadas do zero. Mesmo critério de
// discursiveFamerp2026.ts.

import type { DiscursiveQuestion } from '../types';

const SRC = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2024/2dia/famerp2024_2dia_prova.pdf';
const fig = (n: number, alt: string) => [{ url: `/question-media/discursivas/famerp-2024/q${String(n).padStart(2, '0')}.webp`, alt }];
const base = { board: 'Famerp', year: 2024, sourceUrl: SRC } as const;

export const famerp2024Discursive: DiscursiveQuestion[] = [
  {
    ...base, id: 'disc_famerp_2024_q01', topicId: 'bio_ecologia', subject: 'Biologia',
    topic: 'Fogo no Cerrado e na Amazônia — sucessão e adaptações',
    prompt: 'Os incêndios também ocorrem em outros biomas além da Amazônia, mas os efeitos diferem. As florestas tropicais não evoluíram na presença do fogo; nelas ele resulta do desmatamento. Já o Cerrado evoluiu com o fogo, que é um fator abiótico importante para sua manutenção. (Jornal da Unesp, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Qual o tipo de sucessão ecológica que ocorre em áreas naturais devastadas pelo fogo? Cite um componente do tronco das árvores do Cerrado que as protege do fogo.' },
      { letter: 'b', prompt: 'Qual característica das raízes das árvores do Cerrado permite sua sobrevivência onde há pouca água na superfície do solo? Como os vegetais de grande porte da Amazônia se mantêm exuberantes em solo arenoso e pobre em nutrientes?' },
    ],
    modelAnswer: [
      'Item a: sucessão secundária (há solo e banco de sementes remanescentes). O súber (cortiça) espesso da casca isola os tecidos vivos do calor.',
      'Item b: raízes longas e profundas (pivotantes) que alcançam o lençol freático. Na Amazônia, os nutrientes estão na biomassa e na serapilheira: a decomposição rápida (calor e umidade) recicla-os e as raízes superficiais, com micorrizas, os absorvem logo — a ciclagem é rápida e quase fechada.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q02', topicId: 'bio_codigo_genetico_sintese', subject: 'Biologia',
    topic: 'Síntese proteica em procariotos e eucariotos',
    prompt: 'A figura compara a síntese proteica numa célula procariótica (DNA solto no citoplasma, ribossomos traduzindo o RNAm enquanto ele é transcrito) e numa eucariótica (DNA dentro do núcleo, RNAm imaturo que vira RNAm maduro e sai para os ribossomos no citoplasma).',
    figures: fig(2, 'Síntese proteica em célula procariótica e em célula eucariótica'),
    subItems: [
      { letter: 'a', prompt: 'Cite o local da célula procariótica em que ocorre a transcrição. A partir de qual estrutura na figura é possível distinguir a célula procariótica da eucariótica?' },
      { letter: 'b', prompt: 'Por que as proteínas formadas por todos os ribossomos da célula procariótica terão a mesma sequência de aminoácidos? Por que o RNAm maduro é menor que o imaturo?' },
    ],
    modelAnswer: [
      'Item a: no citoplasma (região do nucleoide), pois não há núcleo. A eucariótica tem envoltório nuclear (carioteca) separando o DNA do citoplasma; a procariótica não.',
      'Item b: todos os ribossomos (polirribossomo) traduzem a mesma molécula de RNAm, lendo os mesmos códons. O RNAm imaturo passa por splicing: os íntrons são removidos e só os éxons permanecem.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q03', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Sistema nervoso difuso e reflexo patelar',
    prompt: 'As figuras mostram o sistema nervoso de uma hidra (rede de neurônios espalhada pelo corpo) e o de um cachorro, com o encéfalo indicado por X, a medula espinal ao longo das costas por Y e um nervo do membro anterior por Z.',
    figures: fig(3, 'Rede nervosa da hidra e sistema nervoso de cachorro com X (encéfalo), Y (medula) e Z (nervo)'),
    subItems: [
      { letter: 'a', prompt: 'Qual o tipo de sistema nervoso da hidra? Cite o órgão encefálico dos mamíferos que controla o ritmo respiratório.' },
      { letter: 'b', prompt: 'Sendo a fisiologia do cachorro semelhante à humana, cite a letra (X, Y ou Z) do órgão do sistema nervoso central que participa do reflexo patelar. Explique o reflexo, citando os nervos periféricos envolvidos.' },
    ],
    modelAnswer: [
      'Item a: sistema nervoso difuso (rede nervosa, sem centralização). O bulbo (medula oblonga) controla o ritmo respiratório.',
      'Item b: Y, a medula espinal. A batida no tendão estira o músculo da coxa; o neurônio sensitivo (nervo aferente/sensitivo) leva o impulso à medula pela raiz dorsal; lá faz sinapse direta com o neurônio motor, cujo nervo eferente (motor) faz o músculo contrair e a perna se estender — sem passar pelo encéfalo.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q04', topicId: 'bio_codigo_genetico_sintese', subject: 'Biologia',
    topic: 'Cariótipo masculino e translocação',
    prompt: 'Analise o cariograma de uma pessoa: 22 pares de autossomos numerados de 1 a 22 e os cromossomos sexuais X e Y.',
    figures: fig(4, 'Cariograma com 22 pares de autossomos e cromossomos X e Y'),
    subItems: [
      { letter: 'a', prompt: 'Quantos autossomos existem em uma célula somática dessa pessoa? Por que os cromossomos sexuais não são homólogos?' },
      { letter: 'b', prompt: 'Suponha que durante a meiose houve troca de segmentos entre os cromossomos 10 e 14. Cite o tipo de mutação cromossômica estrutural. Por que essa alteração não é uma permutação (crossing-over)?' },
    ],
    modelAnswer: [
      'Item a: 44 autossomos (22 pares). X e Y têm tamanhos, formas e genes diferentes; só compartilham pequenas regiões (pseudoautossômicas).',
      'Item b: translocação. A permutação ocorre entre cromossomos homólogos, trocando trechos equivalentes; 10 e 14 não são homólogos.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q05', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Alergia — IgE, mastócitos e anafilaxia',
    prompt: 'Poeira, pelos ou pólen podem causar reações alérgicas: o corpo apresenta hipersensibilidade a alérgenos, reconhecidos por anticorpos IgE que se ligam a algumas células conjuntivas, as quais liberam histamina. Em casos graves, ocorre choque anafilático.',
    subItems: [
      { letter: 'a', prompt: 'A qual classe de substâncias orgânicas pertencem os anticorpos? Por que a reação alérgica é considerada um tipo de imunidade adquirida?' },
      { letter: 'b', prompt: 'Cite a célula conjuntiva que libera a histamina. Que efeito nas vias respiratórias dificulta a respiração no choque anafilático?' },
    ],
    modelAnswer: [
      'Item a: proteínas (imunoglobulinas). Depende de contato prévio com o alérgeno (sensibilização), com produção de IgE específica e células de memória — é específica e se desenvolve ao longo da vida.',
      'Item b: o mastócito. A histamina contrai a musculatura lisa dos bronquíolos (broncoconstrição) e causa edema das vias aéreas (inclusive de glote), reduzindo a passagem do ar.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q06', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Óvulo vegetal × animal; ovulação e fecundação',
    prompt: 'O termo “óvulo” designa uma estrutura reprodutiva em animais e em vegetais espermatófitos, mas em cada grupo o óvulo tem estrutura diferente.',
    subItems: [
      { letter: 'a', prompt: 'Por que nos espermatófitos o óvulo é mais complexo do que nos animais?' },
      { letter: 'b', prompt: 'Por que o termo “ovulação” não é adequado ao evento do período fértil da mulher? Qual fenômeno biológico estimula a formação do óvulo na tuba uterina?' },
    ],
    modelAnswer: [
      'Item a: o óvulo vegetal é uma estrutura multicelular (megasporângio): tegumentos, nucelo e o saco embrionário (gametófito feminino) com a oosfera; o óvulo animal é uma única célula, o gameta.',
      'Item b: o que o ovário libera é o ovócito secundário, parado na metáfase II, e não um óvulo. A meiose II só se completa — formando o óvulo — quando o espermatozoide penetra o ovócito, isto é, a fecundação.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q07', topicId: 'bio_zoologia', subject: 'Biologia',
    topic: 'Ascaridíase — transmissão e ciclo pulmonar',
    prompt: 'A imagem mostra a eclosão de um ovo de Ascaris lumbricoides, com a saída da larva. Esse verme causa a ascaridíase.',
    figures: fig(7, 'Ovo de Ascaris lumbricoides liberando a larva'),
    subItems: [
      { letter: 'a', prompt: 'A que filo pertence esse verme? Cite a principal forma de transmissão ao ser humano.' },
      { letter: 'b', prompt: 'Em que órgão do corpo humano o ovo eclode? Por que a pessoa com ascaridíase pode apresentar pneumonia?' },
    ],
    modelAnswer: [
      'Item a: Nematoda. Ingestão de ovos embrionados em água ou alimentos contaminados por fezes humanas (falta de saneamento e higiene).',
      'Item b: no intestino delgado. As larvas atravessam a parede intestinal, vão pelo sangue ao fígado, coração e pulmões; nos alvéolos causam inflamação (síndrome de Loeffler) antes de subirem pela traqueia, serem deglutidas e voltarem ao intestino.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q08', topicId: 'bio_evolucao', subject: 'Biologia',
    topic: 'Gafanhoto rosa — aposematismo e probabilidade',
    prompt: 'Um gafanhoto rosa raro foi avistado no País de Gales. A cor rosa (eritrismo) é causada por um gene autossômico recessivo. (BBC, 12.07.2023, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Explique, do ponto de vista evolutivo, por que esses gafanhotos poderiam ser numerosos caso o rosa fosse uma coloração de advertência (aposematismo).' },
      { letter: 'b', prompt: 'Uma fêmea verde, filha de gafanhotos heterozigotos, foi cruzada com um macho rosa e produziu 90 ovos. Calcule a probabilidade de essa fêmea ser heterozigota. Dentre os 90 ovos, quantas fêmeas rosas são esperadas?' },
    ],
    modelAnswer: [
      'Item a: se o rosa sinalizasse impalatabilidade, predadores aprenderiam a evitá-lo; os rosas sobreviveriam e se reproduziriam mais, e a seleção natural aumentaria a frequência do alelo na população.',
      'Item b: de Aa × Aa, entre os verdes (AA ou Aa), 2/3 são Aa. Com macho aa, se ela for Aa, metade da prole é rosa; metade dos filhotes é fêmea. P(fêmea rosa) = 2/3 × 1/2 × 1/2 = 1/6 → 90 × 1/6 = 15 fêmeas rosas esperadas.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q09', topicId: 'qui_estequiometria', subject: 'Química',
    topic: 'Superfosfato simples — balanceamento e estequiometria com pureza',
    prompt: 'O superfosfato simples (CaH₄(PO₄)₂ + CaSO₄) é obtido pela reação do fosfato de cálcio, Ca₃(PO₄)₂ (310 g/mol), com o ácido sulfúrico, H₂SO₄ (98 g/mol): Ca₃(PO₄)₂ + H₂SO₄ → CaH₄(PO₄)₂ + CaSO₄ (não balanceada).',
    subItems: [
      { letter: 'a', prompt: 'Apresente a fórmula do ânion fosfato. Escreva a equação da primeira etapa de ionização do ácido sulfúrico.' },
      { letter: 'b', prompt: 'Balanceie a equação. Calcule a massa de ácido sulfúrico, em kg, para reagir completamente com 500 kg de rocha fosfática com 80% de fosfato de cálcio.' },
    ],
    modelAnswer: [
      'Item a: PO₄³⁻. H₂SO₄ + H₂O → H₃O⁺ + HSO₄⁻.',
      'Item b: Ca₃(PO₄)₂ + 2 H₂SO₄ → CaH₄(PO₄)₂ + 2 CaSO₄. Fosfato puro: 0,80 × 500 = 400 kg; 400/310 ≈ 1,29 kmol; ácido: 2 × 1,29 × 98 ≈ 253 kg.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q10', topicId: 'qui_organica_fundamentos', subject: 'Química',
    topic: 'Produtos da redução do CO₂ — funções, éster e isomeria',
    prompt: 'A figura mostra, em modelo de esferas, produtos da redução eletroquímica do CO₂: composto 1 (HCOOH, ácido metanoico), 2 (CO), 3 (CH₄), 4 (C₂H₄, eteno), 5 (CH₃CH₂OH, etanol) e 6 (CH₃CH₂CH₂OH, propan-1-ol). (Química Nova na Escola, 2023, adaptado)',
    figures: fig(10, 'Modelos de esferas do CO2 e dos compostos 1 a 6 obtidos na sua redução'),
    subItems: [
      { letter: 'a', prompt: 'Identifique o número da estrutura que representa um ácido carboxílico. Escreva a fórmula molecular do composto que possui carbono insaturado.' },
      { letter: 'b', prompt: 'Indique os números do par de compostos que, ao reagir, formam o éster de menor massa molar. Escreva a fórmula estrutural de um isômero de posição do álcool de maior massa molar.' },
    ],
    modelAnswer: [
      'Item a: composto 1 (ácido metanoico, HCOOH). O hidrocarboneto com carbono insaturado é o eteno, C₂H₄ (composto 4), com dupla C=C.',
      'Item b: o único ácido é o 1; o éster menor sai com o álcool menor da lista, o etanol (5): par 1 e 5, formando metanoato de etila. O álcool de maior massa é o propan-1-ol; seu isômero de posição é o propan-2-ol, CH₃–CH(OH)–CH₃.',
    ],
    note: 'A identificação dos compostos foi feita pelas cores e quantidades de esferas da figura do caderno.',
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q11', topicId: 'qui_eletroquimica', subject: 'Química',
    topic: 'Bafômetro — oxidação do etanol e cálculo no ar expirado',
    prompt: 'No bafômetro eletroquímico, o etanol (C₂H₅OH, 46 g/mol, d = 0,8 g/mL) é oxidado sobre platina em meio ácido. Eletrodo negativo: C₂H₅OH(g) → CH₃CHO(g) + 2 H⁺ + 2e⁻. Eletrodo positivo: ½ O₂(g) + 2 H⁺ + 2e⁻ → H₂O(l). 1 mL de sangue contém tanto álcool quanto 2 L de ar expirado.',
    subItems: [
      { letter: 'a', prompt: 'Identifique a interação intermolecular mais forte no etanol e a função orgânica do produto da oxidação.' },
      { letter: 'b', prompt: 'Escreva a equação global. Considerando 5 L de sangue, calcule a quantidade de matéria de etanol em 2 L de ar expirado por quem ingeriu 500 mL de cerveja com 5% de etanol em volume.' },
    ],
    modelAnswer: [
      'Item a: ligação de hidrogênio (pelo grupo –OH). O produto, CH₃CHO, é um aldeído (etanal).',
      'Item b: C₂H₅OH(g) + ½ O₂(g) → CH₃CHO(g) + H₂O(l). Etanol ingerido: 0,05 × 500 = 25 mL × 0,8 = 20 g, distribuídos em 5 L (5 000 mL) de sangue: 0,004 g/mL. 2 L de ar equivalem a 1 mL de sangue: 0,004 g / 46 ≈ 8,7 × 10⁻⁵ mol.',
    ],
    note: 'O cálculo supõe que todo o etanol ingerido esteja no sangue, como pede o enunciado.',
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2024_q12', topicId: 'qui_cinetica', subject: 'Química',
    topic: 'Lei de velocidade pelo método das velocidades iniciais',
    prompt: 'Reação: BrO₃⁻ + 5 Br⁻ + 6 H⁺ → 3 Br₂ + 3 H₂O. Experimentos ([BrO₃⁻], [Br⁻], [H⁺] em mol/L → velocidade em mol/(L·s)): 1) 0,20; 0,20; 0,20 → 2,4 × 10⁻³. 2) 0,40; 0,20; 0,20 → 4,8 × 10⁻³. 3) 0,20; 0,60; 0,20 → 7,2 × 10⁻³. 4) 0,40; 0,20; 0,40 → 1,92 × 10⁻².',
    subItems: [
      { letter: 'a', prompt: 'Qual a fórmula molecular do ácido bromídrico? Qual o Nox do bromo no BrO₃⁻?' },
      { letter: 'b', prompt: 'Determine a ordem em relação ao H⁺. Escreva a equação da velocidade.' },
    ],
    modelAnswer: [
      'Item a: HBr. No BrO₃⁻: Br + 3(−2) = −1 → Nox = +5.',
      'Item b: 1→2: dobra [BrO₃⁻], velocidade dobra → ordem 1. 1→3: triplica [Br⁻], velocidade triplica → ordem 1. 2→4: dobra [H⁺], velocidade quadruplica (4,8 × 10⁻³ → 1,92 × 10⁻²) → ordem 2. v = k·[BrO₃⁻]·[Br⁻]·[H⁺]².',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q13', topicId: 'qui_termoquimica', subject: 'Química',
    topic: 'Hidrogênio e etanol — volume molar e entalpia de combustão',
    prompt: 'Combustão completa: C₂H₅OH(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(l); H₂(g) + ½ O₂(g) → H₂O(l) + 286 kJ. Calores de formação: CO₂ = −394 kJ/mol; C₂H₅OH = −278 kJ/mol. 1 mol de H₂ (2 g/mol) ocupa 25 L nas CATP.',
    subItems: [
      { letter: 'a', prompt: 'Escreva a fórmula de Lewis do CO₂. Qual o volume ocupado por 100 g de H₂ nas CATP?' },
      { letter: 'b', prompt: 'Calcule a energia produzida na combustão de 10 g de H₂. Qual a entalpia de combustão do etanol?' },
    ],
    modelAnswer: [
      'Item a: O=C=O, com duas ligações duplas e dois pares não ligantes em cada oxigênio. 100 g = 50 mol × 25 L = 1 250 L.',
      'Item b: 10 g = 5 mol × 286 kJ = 1 430 kJ. Como a combustão do H₂ é a formação da água, ΔHf(H₂O) = −286 kJ/mol. ΔHc = [2(−394) + 3(−286)] − (−278) = −788 − 858 + 278 = −1 368 kJ/mol.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q14', topicId: 'qui_organica_fundamentos', subject: 'Química',
    topic: 'Prednisona e prednisolona — carbonos assimétricos e redução',
    prompt: 'Prednisona e prednisolona são glicocorticoides. A prednisona é inerte e, no fígado, vira prednisolona: a carbonila (C=O) do carbono 11 do esqueleto esteroide passa a hidroxila (CH–OH); o restante da molécula é igual.',
    figures: fig(14, 'Estruturas da prednisona e da prednisolona'),
    subItems: [
      { letter: 'a', prompt: 'Qual a quantidade de carbonos assimétricos da prednisona? Qual o número de carbonos quaternários da prednisolona?' },
      { letter: 'b', prompt: 'Calcule a porcentagem em massa de oxigênio na prednisona (358 g/mol). Que tipo de reação ocorre na conversão da prednisona em prednisolona?' },
    ],
    modelAnswer: [
      'Item a: 6 carbonos assimétricos na prednisona (C8, C9, C10, C13, C14 e C17); o C11, com C=O, não é. A prednisolona tem 2 carbonos quaternários (C10 e C13, cada um ligado a quatro carbonos); o C17 tem ligação com O.',
      'Item b: a prednisona (C₂₁H₂₆O₅) tem 5 O: 5 × 16 = 80 g; 80/358 ≈ 22,3%. É uma redução (cetona → álcool secundário, com adição de hidrogênio).',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2024_q15', topicId: 'fis_leis_newton', subject: 'Física',
    topic: 'Caminhão com dois reboques — MUV e forças',
    prompt: 'Um caminhão é formado por cavalo mecânico (CM) e dois reboques, R₁ e R₂, de 20 toneladas cada. Parte do repouso com aceleração constante de 0,80 m/s² durante 20 s.',
    figures: fig(15, 'Cavalo mecânico com dois reboques R1 e R2'),
    subItems: [
      { letter: 'a', prompt: 'Calcule a velocidade, em m/s, e a distância percorrida, em metros, após 20 s.' },
      { letter: 'b', prompt: 'Calcule a resultante no reboque R₂. Se as forças de resistência sobre R₂ somam 3 000 N, calcule a força aplicada em R₂ pelo reboque R₁.' },
    ],
    modelAnswer: [
      'Item a: v = 0,80 × 20 = 16 m/s. d = 0,80 × 20²/2 = 160 m.',
      'Item b: F_res = m·a = 20 000 × 0,80 = 1,6 × 10⁴ N. F − 3 000 = 16 000 → F = 1,9 × 10⁴ N.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q16', topicId: 'fis_dinamica_impulsiva', subject: 'Física',
    topic: 'Colisão inelástica entre dois veículos',
    prompt: 'Um veículo A (3 200 kg) andava a 10 m/s; um veículo B (800 kg), a 20 m/s, colide com sua traseira. Após a colisão, seguem unidos a 12 m/s no mesmo sentido.',
    figures: fig(16, 'Veículo B a 20 m/s atrás do veículo A a 10 m/s; após a batida seguem juntos a 12 m/s'),
    subItems: [
      { letter: 'a', prompt: 'Calcule a quantidade de movimento de A antes da colisão e o impulso recebido por A.' },
      { letter: 'b', prompt: 'Calcule a energia cinética de A antes da colisão e a energia cinética dissipada pelo sistema.' },
    ],
    modelAnswer: [
      'Item a: Q_A = 3 200 × 10 = 3,2 × 10⁴ kg·m/s. Depois: 3 200 × 12 = 3,84 × 10⁴; impulso = 6,4 × 10³ N·s.',
      'Item b: Ec_A = ½ × 3 200 × 10² = 1,6 × 10⁵ J. Antes: 1,6 × 10⁵ + ½ × 800 × 20² = 3,2 × 10⁵ J; depois: ½ × 4 000 × 12² = 2,88 × 10⁵ J; dissipada: 3,2 × 10⁴ J.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q17', topicId: 'fis_termodinamica_gases', subject: 'Física',
    topic: 'Resfriamento isovolumétrico — primeira lei e equação de Clapeyron',
    prompt: 'Uma câmara de volume invariável contém 45 mol de ar a 1,0 × 10⁵ Pa e 300 K. A temperatura é reduzida a 60 K. Considere o ar gás ideal.',
    subItems: [
      { letter: 'a', prompt: 'Se a energia interna diminuiu 225 kJ, calcule o trabalho realizado e o calor perdido, em kJ.' },
      { letter: 'b', prompt: 'Calcule a pressão a 60 K. Calcule quantos mols de ar devem ser introduzidos para a pressão voltar ao valor inicial, mantendo 60 K.' },
    ],
    modelAnswer: [
      'Item a: volume constante → trabalho nulo (0 kJ). Q = ΔU = −225 kJ: o ar perdeu 225 kJ de calor.',
      'Item b: P/T constante: P = 1,0 × 10⁵ × 60/300 = 2,0 × 10⁴ Pa. Para voltar a 1,0 × 10⁵ Pa a 60 K, n deve ser 5 vezes maior: 225 mol; introduzir 225 − 45 = 180 mol.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q18', topicId: 'fis_optica_geometrica', subject: 'Física',
    topic: 'Imagens em espelhos planos paralelos e em ângulo',
    prompt: 'Figura 1: um objeto O entre dois espelhos planos paralelos E₁ e E₂, a 40 cm de E₁ e 30 cm de E₂, formando infinitas imagens. Figura 2: os espelhos passam a formar ângulo de 72° e o objeto fica no centro da configuração.',
    figures: fig(18, 'Objeto entre espelhos paralelos (40 cm e 30 cm) e espelhos a 72°'),
    subItems: [
      { letter: 'a', prompt: 'Localize as duas primeiras imagens conjugadas por E₁ e as duas primeiras por E₂ na figura 1, indicando suas distâncias ao espelho que as conjuga.' },
      { letter: 'b', prompt: 'Determine o número de imagens na figura 2. Quantas são primárias (reflexão direta do objeto) e quantas secundárias?' },
    ],
    modelAnswer: [
      'Item a: E₁: 1ª imagem a 40 cm atrás de E₁ (imagem do objeto); 2ª imagem é a de E₁ da 1ª imagem de E₂ (que está a 30 cm atrás de E₂, ou seja, 100 cm de E₁): 100 cm atrás de E₁. E₂: 1ª a 30 cm; 2ª, imagem da 1ª de E₁ (40 cm atrás de E₁ = 110 cm de E₂): 110 cm atrás de E₂.',
      'Item b: N = 360°/72° − 1 = 4 imagens. 2 primárias (uma de cada espelho) e 2 secundárias.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2024_q19', topicId: 'fis_circuitos', subject: 'Física',
    topic: 'Lanterna de LEDs em série com resistor',
    prompt: 'O circuito de uma lanterna tem bateria ideal de 12 V, um resistor R, quatro LEDs idênticos (L₁ a L₄) e uma chave, todos em série. Com a chave fechada, cada LED tem 2,5 V e corrente de 20 mA.',
    figures: fig(19, 'Circuito série com resistor R, quatro LEDs, chave e bateria de 12 V'),
    subItems: [
      { letter: 'a', prompt: 'Calcule a ddp no resistor e sua resistência.' },
      { letter: 'b', prompt: 'Para cada LED, calcule a potência de operação e a energia consumida em 5 min.' },
    ],
    modelAnswer: [
      'Item a: LEDs em série: 4 × 2,5 = 10 V. U_R = 12 − 10 = 2,0 V. R = 2,0/0,020 = 100 Ω.',
      'Item b: P = 2,5 × 0,020 = 0,050 W. E = 0,050 × 300 s = 15 J.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2024_q20', topicId: 'fis_eletrostatica', subject: 'Física',
    topic: 'Potencial de carga puntiforme',
    prompt: 'O potencial de uma carga puntiforme Q a uma distância d é V = k·Q/d, com k = 9,0 × 10⁹ N·m²/C² no ar. Um objeto produz V = 1,6 × 10⁻³ V a 18 m, no ar.',
    subItems: [
      { letter: 'a', prompt: 'Calcule a carga do objeto. Com carga do elétron 1,6 × 10⁻¹⁹ C, calcule quantos elétrons foram removidos.' },
      { letter: 'b', prompt: 'Com outra carga, num meio de k desconhecido, o objeto produz 6,0 × 10⁻³ V a 27 m. Obtenha o potencial a 9,0 m e esboce V em função de d.' },
    ],
    modelAnswer: [
      'Item a: Q = V·d/k = 1,6 × 10⁻³ × 18/9,0 × 10⁹ = 3,2 × 10⁻¹² C (positiva, pois perdeu elétrons). n = 3,2 × 10⁻¹²/1,6 × 10⁻¹⁹ = 2,0 × 10⁷ elétrons.',
      'Item b: V é inversamente proporcional a d: a 9 m (um terço de 27 m) o potencial triplica: 1,8 × 10⁻² V. O gráfico é um ramo de hipérbole: V muito grande perto do objeto, decrescendo e tendendo a zero para distâncias grandes.',
    ],
    suggestedMinutes: 10,
  },
];
