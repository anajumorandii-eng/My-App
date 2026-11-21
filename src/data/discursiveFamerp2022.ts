// Famerp 2022, 2º dia: as 20 discursivas do caderno oficial (FMRP2101), com
// respostas-modelo escritas e calculadas do zero. Mesmo critério de
// discursiveFamerp2026.ts.

import type { DiscursiveQuestion } from '../types';

const SRC = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2022/2dia/famerp2022_2dia_prova.pdf';
const fig = (n: number, alt: string) => [{ url: `/question-media/discursivas/famerp-2022/q${String(n).padStart(2, '0')}.webp`, alt }];
const base = { board: 'Famerp', year: 2022, sourceUrl: SRC } as const;

export const famerp2022Discursive: DiscursiveQuestion[] = [
  {
    ...base, id: 'disc_famerp_2022_q01', topicId: 'bio_fisio_vegetal', subject: 'Biologia',
    topic: 'Estiolamento e endosperma',
    prompt: 'Sementes de feijão podem germinar no escuro e originar brotos de feijão. A imagem mostra as plântulas estioladas (longas, finas e esbranquiçadas) alguns dias após o início da germinação.',
    figures: fig(1, 'Brotos de feijão estiolados, longos e esbranquiçados'),
    subItems: [
      { letter: 'a', prompt: 'Que processo metabólico as células do embrião realizam no escuro? Qual a vantagem adaptativa do estiolamento?' },
      { letter: 'b', prompt: 'Qual tecido da semente fornece nutrientes para o embrião da maioria das angiospermas germinar sem luz? Qual a origem desse tecido?' },
    ],
    modelAnswer: [
      'Item a: respiração celular, consumindo as reservas da semente (sem luz não há fotossíntese). O estiolamento concentra a energia no alongamento rápido do caule, sem gastar com clorofila e folhas grandes, aumentando a chance de alcançar a luz antes de esgotar as reservas.',
      'Item b: o endosperma. Ele resulta da dupla fecundação: um núcleo espermático se funde aos dois núcleos polares do saco embrionário, formando um tecido triploide (3n). (No feijão, as reservas já foram transferidas para os cotilédones.)',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q02', topicId: 'bio_zoologia', subject: 'Biologia',
    topic: 'Cladograma dos moluscos — rádula homóloga',
    prompt: 'O cladograma mostra relações hipotéticas entre Gastropoda, Cephalopoda, Bivalvia e Scaphopoda. Na base aparecem as novidades manto, pé muscular e rádula; o ramo de Gastropoda e Cephalopoda tem “cabeça bem desenvolvida” (Cephalopoda com “sistema circulatório fechado”); o ramo de Bivalvia e Scaphopoda tem “cabeça reduzida”, e Bivalvia tem “perda da rádula”.',
    figures: fig(2, 'Cladograma de quatro classes de moluscos com novidades evolutivas'),
    subItems: [
      { letter: 'a', prompt: 'Os moluscos apresentam que tipo de simetria? Cite um animal da classe Cephalopoda.' },
      { letter: 'b', prompt: 'Qual a função da rádula? Ela é um órgão homólogo ou análogo entre os grupos do cladograma? Justifique.' },
    ],
    modelAnswer: [
      'Item a: simetria bilateral. Exemplos de cefalópodes: polvo, lula, sépia, náutilo.',
      'Item b: a rádula é uma fita com dentes quitinosos que raspa e tritura o alimento. É homóloga: aparece no cladograma na base, no ancestral comum de todos os grupos, e foi herdada por eles (os bivalves a perderam depois).',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q03', topicId: 'bio_ecologia', subject: 'Biologia',
    topic: 'Macaco-prego e palmeira juçara — cadeia e densidade populacional',
    prompt: 'Numa reserva da Mata Atlântica, predadores de primatas (harpias, gaviões, onças, jaguatiricas) praticamente desapareceram. A densidade de macacos-pregos-pretos chegou a 66,2 indivíduos/km², mais de quatro vezes a de outros locais. Os macacos comem o palmito da juçara, e as palmeiras atacadas morrem. (Folha de S.Paulo, 15.11.2020, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Represente uma cadeia alimentar com três níveis tróficos, com organismos do texto, da qual o macaco faça parte. Qual nível ele ocupa?' },
      { letter: 'b', prompt: 'Cite um fator biótico que influencia a densidade populacional. A densidade de macacos poderá aumentar indefinidamente? Explique.' },
    ],
    modelAnswer: [
      'Item a: palmeira juçara → macaco-prego-preto → onça (ou harpia). O macaco é consumidor primário, no 2º nível trófico.',
      'Item b: predação (também competição, parasitismo, doenças, disponibilidade de alimento). Não: as palmeiras, seu alimento, estão morrendo; a falta de recurso, a competição e as doenças formam a resistência do meio, e a população tende a se estabilizar ou cair, limitada pela capacidade de suporte.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q04', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Ponte de safena — valvas venosas e circulação coronária',
    prompt: 'Na ponte de safena, criada por René Favaloro em 1967, a veia safena da perna é implantada no coração para tratar a doença arterial coronariana. Quase metade dos implantes se obstrui em até uma década, em parte por inflamação no endotélio. (Pesquisa Fapesp, setembro de 2021, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Em qual vaso citado no texto são encontradas valvas? Qual a função delas?' },
      { letter: 'b', prompt: 'Implantada no coração, a que condição de pressão a veia safena estará submetida? Qual a importância da irrigação do miocárdio pelas coronárias?' },
    ],
    modelAnswer: [
      'Item a: na veia safena (as veias têm valvas). Impedem o refluxo do sangue, garantindo o fluxo em um só sentido, de volta ao coração.',
      'Item b: a pressão arterial, muito maior que a pressão venosa para a qual a veia está adaptada (parede mais fina). As coronárias levam O₂ e nutrientes ao miocárdio, que trabalha sem parar; a obstrução causa isquemia e infarto.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q05', topicId: 'bio_codigo_genetico_sintese', subject: 'Biologia',
    topic: 'Célula diploide e replicação semiconservativa',
    prompt: 'A figura representa uma célula diploide com seis cromossomos: três pares de homólogos (um longo, um médio e um curto), cada par com um cromossomo branco e um laranja.',
    figures: fig(5, 'Célula com três pares de cromossomos homólogos, brancos e laranja'),
    subItems: [
      { letter: 'a', prompt: 'Por que a célula é diploide? Quantos centrômeros há na representação?' },
      { letter: 'b', prompt: 'A célula é mantida em meio com timina radioativa e todos os cromossomos têm um segmento AAACGTTT. Se ela chegar à metáfase mitótica, quantas cromátides-irmãs terão timina radioativa? Relacione o fenômeno à propriedade molecular do DNA.' },
    ],
    modelAnswer: [
      'Item a: os cromossomos estão em pares de homólogos (um de origem paterna, outro materna): 2n = 6. Há 6 centrômeros, um por cromossomo.',
      'Item b: na fase S cada cromossomo se duplica: 12 cromátides na metáfase, e todas têm timina radioativa. A replicação é semiconservativa: cada nova dupla-hélice conserva uma fita antiga e recebe uma fita nova, montada com os nucleotídeos do meio — inclusive a timina marcada.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q06', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Contraceptivo não hormonal e hormonal',
    prompt: 'A FDA aprovou um contraceptivo em gel sem hormônios, que altera o pH vaginal e impede a movimentação dos espermatozoides até o ovócito. (Veja, 10.06.2020, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Em que local do sistema genital feminino é mais comum a fecundação? Como deve ser o pH vaginal de uma mulher saudável?' },
      { letter: 'b', prompt: 'Cite um hormônio de contraceptivos hormonais. Como ele atua na contracepção?' },
    ],
    modelAnswer: [
      'Item a: na tuba uterina (terço próximo ao ovário). Ácido, em torno de 4, o que dificulta a proliferação de microrganismos patogênicos.',
      'Item b: progesterona (progestagênio sintético) ou estrógeno. Em doses contínuas, inibe por retroalimentação negativa a liberação de FSH e LH pela hipófise, e a ovulação não ocorre; a progesterona também espessa o muco cervical.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q07', topicId: 'bio_genetica', subject: 'Biologia',
    topic: 'Dominância incompleta e combinações gaméticas',
    prompt: 'Numa espécie de mamífero: cor da pelagem marrom (MM), creme (MB) e branca (BB); pelos curtos (LL ou Ll) ou longos (ll); olhos escuros (CC ou Cc) ou claros (cc). Os genes segregam-se independentemente.',
    subItems: [
      { letter: 'a', prompt: 'Qual tipo de herança ocorre na cor da pelagem? Justifique com o quadro.' },
      { letter: 'b', prompt: 'Como os genes estão distribuídos em relação aos loci? Quantas combinações gaméticas são possíveis no cruzamento MBLlCC × MBLlCc?' },
    ],
    modelAnswer: [
      'Item a: dominância incompleta (ausência de dominância): o heterozigoto MB tem fenótipo intermediário (creme) entre marrom e branco.',
      'Item b: em loci de cromossomos diferentes (pares não homólogos), por isso segregam independentemente. MBLlCC forma 2 × 2 × 1 = 4 tipos de gameta; MBLlCc forma 2 × 2 × 2 = 8. Combinações no cruzamento: 4 × 8 = 32.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q08', topicId: 'bio_evolucao', subject: 'Biologia',
    topic: 'Hardy-Weinberg no sistema ABO',
    prompt: 'O teorema de Hardy-Weinberg vale para populações infinitamente grandes, panmíticas e sem fatores evolutivos; nelas, as frequências gênicas e genotípicas permanecem constantes.',
    subItems: [
      { letter: 'a', prompt: 'Cite dois fatores evolutivos que alteram a frequência gênica.' },
      { letter: 'b', prompt: 'Numa população em equilíbrio para o sistema ABO, f(Iᴬ) = 0,3 e f(i) = 0,4. Calcule a frequência de indivíduos B heterozigotos e de indivíduos AB.' },
    ],
    modelAnswer: [
      'Item a: mutação, seleção natural, migração (fluxo gênico) e deriva genética (dois deles).',
      'Item b: f(Iᴮ) = 1 − 0,3 − 0,4 = 0,3. B heterozigoto (Iᴮi): 2 × 0,3 × 0,4 = 0,24 (24%). AB (IᴬIᴮ): 2 × 0,3 × 0,3 = 0,18 (18%).',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q09', topicId: 'qui_polaridade_geometria', subject: 'Química',
    topic: 'Solventes — interações, pressão de vapor e razão de mols',
    prompt: 'Dados: água (18 g/mol; 1,0 g/mL; ebulição 100 °C); éter etílico C₄H₁₀O (74 g/mol; 0,7 g/mL; 35 °C); hexano C₆H₁₄ (86 g/mol; 0,7 g/mL; 69 °C); etanol C₂H₅OH (46 g/mol; 0,8 g/mL; 78 °C).',
    subItems: [
      { letter: 'a', prompt: 'Qual a interação intermolecular no hexano? Qual solvente orgânico é mais solúvel em água?' },
      { letter: 'b', prompt: 'Ordene as substâncias em ordem crescente de pressão de vapor. Para volumes iguais de hexano e etanol, calcule n(hexano)/n(etanol).' },
    ],
    modelAnswer: [
      'Item a: dipolo induzido (forças de London), pois é apolar. O etanol, que faz ligações de hidrogênio com a água.',
      'Item b: quanto maior a temperatura de ebulição, menor a pressão de vapor: água < etanol < hexano < éter. Para um volume V: n(hex) = 0,7V/86 e n(et) = 0,8V/46 → razão = (0,7 × 46)/(86 × 0,8) = 32,2/68,8 ≈ 0,47.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q10', topicId: 'qui_equilibrio', subject: 'Química',
    topic: 'Eletrólitos, solvatação e pH do HF',
    prompt: 'A figura mostra três soluções: 1) KF, com íons K⁺ e F⁻; 2) glicose, só com moléculas; 3) HF, com poucas partículas ionizadas entre moléculas inteiras.',
    figures: fig(10, 'Soluções de KF (íons), glicose (moléculas) e HF (poucos íons)'),
    subItems: [
      { letter: 'a', prompt: 'Qual solução apresenta maior resistência à corrente elétrica? Escreva a reação entre o soluto da solução 3 e uma base que produza a solução 1.' },
      { letter: 'b', prompt: 'Desenhe a interação entre íons potássio e a água, com a geometria correta da molécula de água. Com grau de ionização do HF = 6 × 10⁻² e log 6 = 0,8, calcule o pH de uma solução 0,1 mol/L de HF.' },
    ],
    modelAnswer: [
      'Item a: a solução 2 (glicose), que não tem íons. HF(aq) + KOH(aq) → KF(aq) + H₂O(l).',
      'Item b: o K⁺ fica rodeado por moléculas de água angulares (cerca de 104,5°), com o oxigênio — polo negativo — voltado para o cátion. [H⁺] = 0,1 × 6 × 10⁻² = 6 × 10⁻³ mol/L; pH = −log(6 × 10⁻³) = 3 − 0,8 = 2,2.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q11', topicId: 'qui_estequiometria', subject: 'Química',
    topic: 'Fermentação da sacarose — rendimento pelo BaCO₃',
    prompt: 'C₁₂H₂₂O₁₁(aq) + H₂O(l) → 4 C₂H₅OH(aq) + 4 CO₂(g) (leveduras). Fermentou-se uma solução com 17,1 g de sacarose (342 g/mol); o CO₂ (44 g/mol) foi borbulhado em água de barita, Ba(OH)₂, formando 35,46 g de BaCO₃ (197 g/mol).',
    figures: fig(11, 'Frasco de fermentação ligado a frasco com água de barita'),
    subItems: [
      { letter: 'a', prompt: 'A fermentação deverá produzir solução ácida, básica ou neutra? Qual a função química da substância que confere esse caráter?' },
      { letter: 'b', prompt: 'Calcule a massa de CO₂ produzida e o rendimento da fermentação.' },
    ],
    modelAnswer: [
      'Item a: ácida. O CO₂ é um óxido ácido: parte dele se dissolve e forma ácido carbônico, que libera H⁺.',
      'Item b: BaCO₃: 35,46/197 = 0,18 mol = 0,18 mol de CO₂ → 7,92 g. Teórico: 17,1/342 = 0,05 mol de sacarose → 0,20 mol de CO₂. Rendimento = 0,18/0,20 = 90%.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q12', topicId: 'qui_termoquimica', subject: 'Química',
    topic: 'Hidrogenação do pent-1-eno — isomeria e diagrama de energia',
    prompt: 'A hidrogenação de 1 mol de pent-1-eno libera 123 kJ: H₂C=CH–CH₂–CH₂–CH₃ + H₂ → H₃C–CH₂–CH₂–CH₂–CH₃. No gráfico sem catalisador, os reagentes estão em x, o complexo ativado em 200 kJ/mol e o produto em −176 kJ/mol.',
    figures: fig(12, 'Diagrama de entalpia: reagentes em x, pico em 200 kJ/mol, produto em −176 kJ/mol'),
    subItems: [
      { letter: 'a', prompt: 'Escreva o isômero de cadeia normal do pent-1-eno que tem isomeria geométrica. Qual a isomeria plana entre eles?' },
      { letter: 'b', prompt: 'Determine x, a entalpia de formação do pent-1-eno. Com um catalisador que reduz em 150 kJ a energia do complexo ativado, qual o valor dessa energia na nova curva?' },
    ],
    modelAnswer: [
      'Item a: pent-2-eno, CH₃–CH=CH–CH₂–CH₃ (tem formas cis e trans). Isomeria de posição (da dupla ligação).',
      'Item b: ΔH = H(produtos) − H(reagentes): −123 = −176 − x → x = −53 kJ/mol (a entalpia do H₂ é zero). Com catalisador, o complexo ativado fica em 200 − 150 = 50 kJ/mol; a curva sai de −53, sobe até 50 e desce a −176, com o mesmo ΔH.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q13', topicId: 'qui_eletroquimica', subject: 'Química',
    topic: 'Ânodos de sacrifício e eletrólise em série',
    prompt: 'Três cubas eletrolíticas em série, com corrente de 19,3 A, contêm íons Mg²⁺, Al³⁺ e Zn²⁺. Potenciais de redução (V): Mg²⁺/Mg −2,37; Al³⁺/Al −1,66; Zn²⁺/Zn −0,76; Fe²⁺/Fe −0,44; 2 H₂O + 2e⁻ → H₂ + 2 OH⁻ −0,83.',
    figures: fig(13, 'Cubas em série com íons Mg2+, Al3+ e Zn2+ e tabela de potenciais'),
    subItems: [
      { letter: 'a', prompt: 'Por que Mg, Al e Zn protegem o ferro da corrosão? Qual ânodo de sacrifício pode ser obtido por eletrólise de solução aquosa de seus íons?' },
      { letter: 'b', prompt: 'Com F = 96 500 C/mol, calcule a massa de alumínio obtida com 0,24 F. Quanto tempo é necessário para obter a mesma massa de magnésio, com a mesma corrente?' },
    ],
    modelAnswer: [
      'Item a: têm potencial de redução menor que o do ferro (oxidam-se mais facilmente) e por isso se oxidam no lugar dele. Só o zinco: seu potencial (−0,76 V) é maior que o da redução da água (−0,83 V), então o Zn²⁺ se reduz antes da água; Mg²⁺ e Al³⁺ não.',
      'Item b: Al³⁺ + 3e⁻ → Al: 0,24/3 = 0,08 mol × 27 = 2,16 g. Mg: 2,16/24 = 0,09 mol, que exigem 0,18 mol de e⁻ = 0,18 × 96 500 = 17 370 C; t = 17 370/19,3 = 900 s.',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2022_q14', topicId: 'qui_organica_reacoes', subject: 'Química',
    topic: 'Sabões e detergentes — saponificação e sulfonação',
    prompt: 'Processo 1 (sabão): triglicerídeo + 3 NaOH → 3 sais de ácido graxo + glicerol. Processo 2 (detergente): etapa 1, cadeia de hidrocarboneto + benzeno → alquilbenzeno; etapa 2, alquilbenzeno + H₂SO₄ → ácido alquilbenzenossulfônico (–SO₃H em para); etapa 3, ácido + NaOH → sulfonato de sódio + água.',
    figures: fig(14, 'Reações de obtenção de sabão e das três etapas do detergente'),
    subItems: [
      { letter: 'a', prompt: 'A qual grupo de moléculas biológicas pertence a matéria-prima do sabão? Em qual etapa do detergente ocorre uma alquilação?' },
      { letter: 'b', prompt: 'Explique por que se usa NaOH na produção de sabões e detergentes. Sabendo que a cadeia ligada ao anel orienta a posição do –SO₃H, escreva outro produto possível na etapa 2.' },
    ],
    modelAnswer: [
      'Item a: lipídios (triglicerídeos de óleos e gorduras). Na etapa 1, em que a cadeia alquila se liga ao anel benzênico.',
      'Item b: o NaOH, base forte, hidrolisa o éster (saponificação) ou neutraliza o ácido sulfônico, formando o sal de sódio — a extremidade iônica, solúvel em água, que dá ao produto ação tensoativa. O grupo alquila é orto/para-dirigente; além do para, forma-se o isômero orto: –SO₃H no carbono vizinho ao da cadeia.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q15', topicId: 'fis_gravitacao_circular', subject: 'Física',
    topic: 'Lançamento horizontal e MUV — os dois gatos',
    prompt: 'Com g = 10 m/s², o gato 1, sobre uma mesa a 0,8 m do chão, salta horizontalmente a 1,5 m/s e leva 0,40 s para atingir o chão. No mesmo instante, o gato 2, no chão sob a mesma vertical Q, parte do repouso com aceleração constante a₂. Os dois chegam juntos ao ponto P, à distância d de Q.',
    figures: fig(15, 'Gato saltando da mesa em trajetória parabólica e gato correndo no chão até P'),
    subItems: [
      { letter: 'a', prompt: 'Qual o módulo da aceleração do gato 1 após o salto? Qual a componente vertical de sua velocidade ao atingir o chão?' },
      { letter: 'b', prompt: 'Quanto vale d? Qual a aceleração do gato 2?' },
    ],
    modelAnswer: [
      'Item a: só atua o peso: a = g = 10 m/s². vy = g·t = 10 × 0,40 = 4,0 m/s.',
      'Item b: na horizontal o movimento é uniforme: d = 1,5 × 0,40 = 0,60 m. Gato 2: d = a₂·t²/2 → a₂ = 2 × 0,60/0,40² = 7,5 m/s².',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2022_q16', topicId: 'fis_energia', subject: 'Física',
    topic: 'Roda d’água — tempo, velocidade angular e energia',
    prompt: 'Uma roda d’água gira com velocidade angular constante; tem 20 reservatórios de 5 L e raio R = √3/3 m. Uma calha despeja água (1 kg/L) a 1,25 L/s, e cada reservatório fica cheio ao passar sob ela. Após encher, o reservatório percorre 60° (sen 60° = √3/2) sem despejar, até ficar alinhado com o eixo e começar a esvaziar.',
    figures: fig(16, 'Roda d’água com reservatório cheio a 60° acima da horizontal do eixo'),
    subItems: [
      { letter: 'a', prompt: 'Qual o tempo para encher cada reservatório? Se a roda leva 80 s por volta, qual a velocidade angular?' },
      { letter: 'b', prompt: 'Qual a variação da energia potencial do volume V de água nesse trajeto (g = 10 m/s²)? Quantas voltas a roda deve dar para gerar 50 kWh?' },
    ],
    modelAnswer: [
      'Item a: t = 5/1,25 = 4,0 s. ω = 2π/80 = π/40 rad/s.',
      'Item b: a água desce de R·sen 60° acima do eixo até a altura do eixo: h = (√3/3)(√3/2) = 0,5 m. ΔEp = m·g·h = 5 × 10 × 0,5 = 25 J. Por volta, 20 reservatórios: 500 J. 50 kWh = 50 × 3,6 × 10⁶ = 1,8 × 10⁸ J → 1,8 × 10⁸/500 = 3,6 × 10⁵ voltas.',
    ],
    suggestedMinutes: 12,
  },
  {
    ...base, id: 'disc_famerp_2022_q17', topicId: 'fis_calorimetria', subject: 'Física',
    topic: 'Escolha do eixo pela dilatação linear',
    prompt: 'Seis eixos de 20,00 cm a 300 K foram testados; o escolhido não pode dilatar mais que 0,025 cm a cada 100 K. O gráfico mostra o comprimento até 800 K: alumínio ≈ 20,24 cm; latão ≈ 20,19; cobre ≈ 20,17; aço ≈ 20,12; titânio ≈ 20,09; invar ≈ 20,01.',
    figures: fig(17, 'Gráfico do comprimento de seis eixos de 300 K a 800 K'),
    subItems: [
      { letter: 'a', prompt: 'Qual material tem dilatação mais próxima, porém inferior, ao limite? Qual seu coeficiente de dilatação linear, em K⁻¹?' },
      { letter: 'b', prompt: 'Um eixo de 600 g, com calor específico 0,1 cal/(g·°C), é aquecido a 30 cal/s. Qual a taxa de variação da temperatura, em °C/s? Quanto tempo para elevar 100 °C?' },
    ],
    modelAnswer: [
      'Item a: o limite equivale a 0,125 cm em 500 K (de 300 a 800 K), ou seja, 20,125 cm a 800 K. O aço (≈ 20,12 cm) é o mais próximo abaixo. α = 0,12/(20 × 500) ≈ 1,2 × 10⁻⁵ K⁻¹.',
      'Item b: capacidade térmica C = 600 × 0,1 = 60 cal/°C; taxa = 30/60 = 0,5 °C/s. Para 100 °C: 100/0,5 = 200 s.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q18', topicId: 'fis_optica_instrumental', subject: 'Física',
    topic: 'Lupa — imagem virtual e ampliação de área',
    prompt: 'Um biólogo observa uma colônia de bactérias com uma lente convergente a 5,0 mm da colônia, que amplia a imagem 10 vezes.',
    subItems: [
      { letter: 'a', prompt: 'Sendo a imagem virtual e direita, a que distância da lente ela se forma? Qual a distância focal?' },
      { letter: 'b', prompt: 'Em t = 0, a colônia circular tem 0,40 mm de diâmetro, que cresce 0,02 mm/s. Com que taxa cresce o diâmetro da imagem? Qual a equação da área da imagem em função do tempo?' },
    ],
    modelAnswer: [
      'Item a: A = −p′/p = 10 → p′ = −50 mm: imagem a 50 mm da lente, do mesmo lado do objeto. 1/f = 1/5 + 1/(−50) = 9/50 → f = 50/9 ≈ 5,6 mm.',
      'Item b: a imagem amplia tudo 10 vezes: 10 × 0,02 = 0,2 mm/s. Diâmetro da imagem: D = 4,0 + 0,2t (mm). Área: A(t) = π(D/2)² = π(2,0 + 0,1t)² mm².',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q19', topicId: 'fis_fisica_moderna', subject: 'Física',
    topic: 'Opacidade do vidro e efeito fotoelétrico no argônio',
    prompt: 'Uma fonte de frequência variável ilumina uma placa de vidro e um detector mede a luz transmitida. O gráfico mostra intensidade de 100% até cerca de 4,0 × 10¹⁵ Hz (linha tracejada), caindo a zero logo depois. c = 3 × 10⁸ m/s. Um espectro indica: ultravioleta entre 10⁻⁸ m e 3,5 × 10⁻⁷ m; luz visível de 3,5 × 10⁻⁷ m a 7,0 × 10⁻⁷ m.',
    figures: fig(19, 'Montagem fonte–vidro–detector e gráfico de intensidade transmitida pela frequência'),
    subItems: [
      { letter: 'a', prompt: 'A partir de qual comprimento de onda a placa começa a ser opaca? A que região do espectro ele pertence?' },
      { letter: 'b', prompt: 'Ionizar o argônio exige 2,5 × 10⁻¹⁸ J. Com h = 6,6 × 10⁻³⁴ J·s, qual a energia cinética do elétron removido por um fóton de 4,0 × 10¹⁵ Hz?' },
    ],
    modelAnswer: [
      'Item a: λ = c/f = 3 × 10⁸/4,0 × 10¹⁵ = 7,5 × 10⁻⁸ m (a placa fica opaca para comprimentos menores que esse). Está no ultravioleta.',
      'Item b: E = h·f = 6,6 × 10⁻³⁴ × 4,0 × 10¹⁵ = 2,64 × 10⁻¹⁸ J. Ec = 2,64 × 10⁻¹⁸ − 2,5 × 10⁻¹⁸ = 1,4 × 10⁻¹⁹ J.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2022_q20', topicId: 'fis_circuitos', subject: 'Física',
    topic: 'Ponte de Wheatstone',
    prompt: 'Um circuito tem bateria de 5 V, amperímetro A e resistores R₁ = 5 Ω, R₂ = 10 Ω, R₃ = 25 Ω e R₄ = 50 Ω: R₁ e R₂ em série no ramo c–a–d; R₃ e R₄ em série no ramo c–b–d; a chave S, com o amperímetro, liga a a b.',
    figures: fig(20, 'Ponte de Wheatstone com R1, R2, R3, R4, chave S e amperímetro entre a e b'),
    subItems: [
      { letter: 'a', prompt: 'Com S desligada, qual a resistência equivalente e a corrente total?' },
      { letter: 'b', prompt: 'Trocados os resistores, com S ligada, o amperímetro marca zero. Prove que R₁·R₄ = R₂·R₃.' },
    ],
    modelAnswer: [
      'Item a: ramos em paralelo: R₁ + R₂ = 15 Ω e R₃ + R₄ = 75 Ω. R_eq = 15 × 75/90 = 12,5 Ω. i = 5/12,5 = 0,40 A.',
      'Item b: sem corrente no amperímetro, V_a = V_b; a corrente i₁ passa por R₁ e R₂, e i₂ por R₃ e R₄. De c até a e de c até b a queda é a mesma: i₁R₁ = i₂R₃. De a até d e de b até d também: i₁R₂ = i₂R₄. Dividindo: R₁/R₂ = R₃/R₄ → R₁·R₄ = R₂·R₃.',
    ],
    suggestedMinutes: 10,
  },
];
