// Famerp 2025, 2º dia: as 20 discursivas do caderno oficial (FMRP2401), com
// respostas-modelo escritas e calculadas do zero para o CRIVO. Mesmo critério
// de discursiveFamerp2026.ts: raciocínio completo, figura recortada do
// caderno e descrita no enunciado.

import type { DiscursiveQuestion } from '../types';

const SRC = 'https://www.curso-objetivo.br/vestibular/resolucao-comentada/famerp/2025/2dia/famerp2025_2dia_prova.pdf';
const fig = (n: number, alt: string) => [{ url: `/question-media/discursivas/famerp-2025/q${String(n).padStart(2, '0')}.webp`, alt }];
const base = { board: 'Famerp', year: 2025, sourceUrl: SRC } as const;

export const famerp2025Discursive: DiscursiveQuestion[] = [
  {
    ...base, id: 'disc_famerp_2025_q01', topicId: 'bio_ecologia', subject: 'Biologia',
    topic: 'Bactérias da pele de anfíbios e biomagnificação do arsênio',
    prompt: 'Um estudo da UFOP identificou na pele de anfíbios bactérias capazes de resistir ao arsênio e obteve indícios de que essa resistência se estende ao hospedeiro, protegendo-o da intoxicação. O arsênio é tóxico e carcinogênico; uma dose de 125 mg pode matar uma pessoa. (Revista Pesquisa Fapesp, agosto de 2024, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Cite a relação ecológica harmônica entre os anfíbios e as bactérias, considerando a proteção conferida pelos microrganismos. Que característica da pele dos anfíbios os torna muito suscetíveis aos poluentes?' },
      { letter: 'b', prompt: 'Explique como varia a concentração do arsênio nos organismos ao longo de uma cadeia alimentar. O que é um composto carcinogênico?' },
    ],
    modelAnswer: [
      'Item a: mutualismo (as bactérias têm abrigo e nutrientes; o anfíbio ganha proteção). A pele é fina, úmida, muito vascularizada e permeável (participa da respiração cutânea), absorvendo facilmente substâncias da água.',
      'Item b: o arsênio não é eliminado com facilidade e se acumula; a concentração aumenta a cada nível trófico (biomagnificação), sendo maior nos consumidores do topo. Carcinogênico é o agente capaz de induzir câncer, em geral por causar mutações que desregulam a divisão celular.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q02', topicId: 'bio_codigo_genetico_sintese', subject: 'Biologia',
    topic: 'Ciclo celular — fase S, citocinese e G0',
    prompt: 'O esquema ilustra os períodos de um ciclo celular de células somáticas: interfase (G1, S, G2) e divisão M, com uma saída de G1 para G0.',
    figures: fig(2, 'Ciclo celular circular com G1, S, G2 e M, e desvio de G1 para G0'),
    subItems: [
      { letter: 'a', prompt: 'Que tipo de divisão celular ocorre nas células somáticas? Em qual fase da interfase apresentada no esquema a DNA polimerase atua?' },
      { letter: 'b', prompt: 'Qual a importância dos microfilamentos na finalização da divisão celular? O que ocorre quando uma célula fica permanentemente na fase G0?' },
    ],
    modelAnswer: [
      'Item a: mitose. A DNA polimerase atua na fase S, quando o DNA é replicado.',
      'Item b: microfilamentos de actina (com miosina) formam o anel contrátil que estrangula a célula na citocinese, separando as células-filhas. Em G0 permanente a célula sai do ciclo e não se divide mais, mantendo-se diferenciada e funcional (ex.: neurônios, fibras musculares cardíacas).',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q03', topicId: 'bio_zoologia', subject: 'Biologia',
    topic: 'Nematódeos em criptobiose — osmose, glicólise e temperatura',
    prompt: 'Pesquisadores reviveram um par de vermes cilíndricos adormecidos havia quase 46 mil anos no permafrost da Sibéria, em criptobiose — estado que tolera falta de água, de oxigênio e temperaturas extremas. Eles voltaram à vida quando reidratados. Os vermes produzem trealose, dissacarídeo de glicoses, quando levemente desidratados, o que possivelmente lhes permite resistir ao congelamento. (BBC, 31.07.2023, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'A que filo pertence esse par de vermes? Que tipo de transporte de água pela membrana plasmática permitiu a reidratação das células?' },
      { letter: 'b', prompt: 'Interrompida a criptobiose, em que etapa da respiração celular as glicoses da trealose podem ser convertidas em ácidos pirúvicos? O que ocorre com a velocidade dos catalisadores presentes nos decompositores em ambientes com temperaturas próximas de zero?' },
    ],
    modelAnswer: [
      'Item a: filo Nematoda (nematódeos, vermes cilíndricos). Osmose — passagem de água pela membrana, do meio menos concentrado para o mais concentrado (em parte por aquaporinas).',
      'Item b: na glicólise, no citosol. Perto de 0 °C as enzimas ficam muito lentas (menos energia cinética e colisões), por isso a decomposição praticamente para — o que também explica a preservação no permafrost.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q04', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Pâncreas — glucagon × glicogênio; colesterol e hormônios esteroides',
    prompt: '“O pâncreas é uma glândula e o baço não. [...] Além de produzir a insulina, secreta o hormônio glicogênio, que também está envolvido na regulação do açúcar no sangue, bem como as enzimas digestivas lipases, que ajudam a digerir o colesterol e gorduras.” (Bill Bryson, Corpo: um guia para usuários, 2020, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Cite o equívoco conceitual presente no excerto. Qual a função da insulina no organismo?' },
      { letter: 'b', prompt: 'Em que órgão humano o colesterol é sintetizado? Por que as gônadas apresentam alta demanda por colesterol?' },
    ],
    modelAnswer: [
      'Item a: o hormônio pancreático é o glucagon, não o glicogênio (glicogênio é o polissacarídeo de reserva no fígado e nos músculos). A insulina reduz a glicemia: facilita a entrada de glicose nas células e estimula a formação de glicogênio.',
      'Item b: no fígado. As gônadas produzem hormônios esteroides (testosterona, estrógeno, progesterona), sintetizados a partir do colesterol.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q05', topicId: 'bio_botanica', subject: 'Biologia',
    topic: 'Flor e fruto do tomate — óvulos, sementes, partenocarpia e endosperma',
    prompt: 'A figura mostra as estruturas florais preservadas em um tomate e as que se desenvolvem em partes do fruto. Na flor estão indicados pedúnculo, sépala, ovário, filete, estame, estilete, estigma e uma estrutura X dentro do ovário; no fruto, pedúnculo, sépala, pericarpo e uma estrutura Y nas cavidades internas.',
    figures: fig(5, 'Flor do tomateiro e fruto cortado, com estruturas X (no ovário) e Y (no fruto)'),
    subItems: [
      { letter: 'a', prompt: 'Cite os nomes das estruturas apontadas pelas setas X e Y.' },
      { letter: 'b', prompt: 'Qual método artificial pode ser empregado na produção de tomates partenocárpicos? Por que nas angiospermas o núcleo das células do endosperma apresenta mais DNA materno do que paterno?' },
    ],
    modelAnswer: [
      'Item a: X são os óvulos (dentro do ovário); Y são as sementes, que se formam a partir dos óvulos fecundados.',
      'Item b: aplicação de hormônios (auxina, também giberelina) na flor não polinizada, induzindo o desenvolvimento do ovário em fruto sem sementes. O endosperma é triploide: resulta da fusão de dois núcleos polares do saco embrionário (maternos) com um núcleo espermático (paterno) — 2 conjuntos maternos para 1 paterno.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q06', topicId: 'bio_fisio_animal', subject: 'Biologia',
    topic: 'Excreção — néfron, ADH e transporte ativo',
    prompt: 'Os rins exercem rigoroso “controle de qualidade” sobre o sangue. Quando a concentração de alguma substância aumenta muito, eliminam o excesso; se uma pessoa bebe pouco líquido, reduzem o volume de urina. (Amabis e Martho, Biologia dos organismos, 2015, adaptado)',
    subItems: [
      { letter: 'a', prompt: 'Como é denominada a unidade funcional presente em grandes quantidades nos rins humanos? Por que a urina de uma pessoa saudável não apresenta muitas proteínas?' },
      { letter: 'b', prompt: 'Explique a ação hormonal que reduz o volume de urina. Por que a produção de ATP pelas células dos túbulos renais é primordial para manter as substâncias em quantidades normais no sangue?' },
    ],
    modelAnswer: [
      'Item a: néfron. As proteínas plasmáticas são grandes e não atravessam a barreira de filtração do glomérulo (cápsula de Bowman); as poucas filtradas são reabsorvidas.',
      'Item b: com pouca água, a osmolaridade do sangue sobe; o hipotálamo produz e a neuro-hipófise libera ADH (vasopressina), que aumenta a permeabilidade à água (aquaporinas) dos túbulos distais e ductos coletores: mais água volta ao sangue e a urina fica menor e mais concentrada. O ATP sustenta o transporte ativo (como a bomba de Na⁺/K⁺) que reabsorve glicose, aminoácidos e íons e secreta substâncias contra o gradiente.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q07', topicId: 'bio_genetica', subject: 'Biologia',
    topic: 'Herança quantitativa — massa dos frutos',
    prompt: 'Em uma espécie de planta, a massa dos frutos depende de três genes, A, B e E. Plantas aabbee produzem frutos de 200 g e plantas AABBEE, de 1 400 g. O cruzamento de duas plantas de mesmo genótipo gerou descendentes com frutos de diferentes massas; o gráfico do número de indivíduos pela massa é uma curva em sino, simétrica.',
    figures: fig(7, 'Curva em sino: número de indivíduos pela massa dos frutos'),
    subItems: [
      { letter: 'a', prompt: 'Qual tipo de herança genética determina a massa dos frutos? Cite o genótipo de um gameta produzido por uma planta de frutos de 1 400 g.' },
      { letter: 'b', prompt: 'Qual é o genótipo das plantas cruzadas? Qual a massa dos frutos produzidos pelos indivíduos gerados em maior proporção?' },
    ],
    modelAnswer: [
      'Item a: herança quantitativa (poligênica, aditiva). A planta AABBEE só produz gametas ABE.',
      'Item b: a distribuição contínua e simétrica, com os dois extremos, indica o triplo heterozigoto: AaBbEe × AaBbEe. Cada alelo dominante soma (1 400 − 200)/6 = 200 g. A classe mais frequente tem 3 alelos dominantes (20/64): 200 + 3·200 = 800 g.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q08', topicId: 'bio_genetica', subject: 'Biologia',
    topic: 'Corpúsculo de Barr e trissomias',
    prompt: 'As imagens 1, 2 e 3 mostram fibroblastos de uma mulher 46,XX, de uma mulher 47,XXX e de um homem 46,XY, não necessariamente nessa ordem. Na imagem 1 não há corpúsculo de Barr; na imagem 2 a seta aponta um corpúsculo; na imagem 3, dois.',
    figures: fig(8, 'Três núcleos: imagem 1 sem corpúsculo de Barr, imagem 2 com um e imagem 3 com dois'),
    subItems: [
      { letter: 'a', prompt: 'O que é um corpúsculo de Barr? Qual imagem mostra o fibroblasto da mulher com ploidia comum?' },
      { letter: 'b', prompt: 'Em qual fase da meiose ocorreu a falha que resultou na trissomia sexual? Diferencie, quanto aos tipos de cromossomos, essa trissomia da apresentada por uma mulher com síndrome de Down.' },
    ],
    modelAnswer: [
      'Item a: é um cromossomo X inativado e condensado (heterocromatina) no núcleo; o número de corpúsculos é o número de X menos 1. A mulher 46,XX tem um: imagem 2.',
      'Item b: na anáfase (I ou II), por não disjunção — os cromossomos X (ou as cromátides) não se separaram e um gameta ficou com dois X. A trissomia XXX envolve cromossomo sexual; a síndrome de Down é trissomia de um autossomo (cromossomo 21).',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q09', topicId: 'qui_termoquimica', subject: 'Química',
    topic: 'Obtenção do ítrio — lei de Hess',
    prompt: 'O ítrio metálico é obtido a partir do Y₂O₃ com HCl (formando YCl₃) e, na etapa final, YCl₃(g) → Y(s) + 3/2 Cl₂(g). Dados: (1) Y₂O₃(s) + 6 HCl(g) → 2 YCl₃(s) + 3 H₂O(l), ΔH = +96 kJ; (2) 2 YCl₃(s) → 2 YCl₃(g), ΔH = +224 kJ; (3) 2 Y(s) + 3/2 O₂(g) → Y₂O₃(s), ΔH = −1 864 kJ; (4) 3 H₂(g) + 3/2 O₂(g) → 3 H₂O(l), ΔH = −858 kJ; (5) 6 HCl(g) → 3 H₂(g) + 3 Cl₂(g), ΔH = +552 kJ.',
    subItems: [
      { letter: 'a', prompt: 'Analise a transformação 1 e classifique o óxido de ítrio quanto ao caráter ácido-base. Dê o nome da transformação 2.' },
      { letter: 'b', prompt: 'Usando a lei de Hess, apresente a soma das reações que resulta na etapa final e forneça a entalpia da reação que produz um mol de ítrio sólido.' },
    ],
    modelAnswer: [
      'Item a: o Y₂O₃ reage com ácido formando sal e água: é óxido básico. A transformação 2 (sólido → gasoso) é a sublimação.',
      'Item b: dividindo por 2 e ajustando sentidos — inverter (2): YCl₃(g) → YCl₃(s), −112 kJ; inverter (1): YCl₃(s) + 3/2 H₂O(l) → ½ Y₂O₃(s) + 3 HCl(g), −48 kJ; inverter (3): ½ Y₂O₃(s) → Y(s) + 3/4 O₂(g), +932 kJ; (4)/2: 3/2 H₂(g) + 3/4 O₂(g) → 3/2 H₂O(l), −429 kJ; (5)/2: 3 HCl(g) → 3/2 H₂(g) + 3/2 Cl₂(g), +276 kJ. Somando, cancelam-se YCl₃(s), H₂O, Y₂O₃, HCl, O₂ e H₂: YCl₃(g) → Y(s) + 3/2 Cl₂(g), ΔH = −112 − 48 + 932 − 429 + 276 = +619 kJ por mol de Y.',
    ],
    note: 'O item a do caderno escreve “Y₃O₂”, mas trata do Y₂O₃ das equações.',
    suggestedMinutes: 15,
  },
  {
    ...base, id: 'disc_famerp_2025_q10', topicId: 'qui_radioatividade', subject: 'Química',
    topic: 'Ítrio-90 — decaimento beta e meia-vida',
    prompt: 'O ítrio-90 emite radiação gama e partícula beta negativa. Como cátion Y³⁺, ligado a um composto orgânico (anel com quatro átomos de nitrogênio, cada um ligado a um grupo –CH₂–CO₂H), forma um radioterápico para tumores de fígado. Atividade de uma amostra (MBq) × tempo (h): 500 – 0; 400 – 21; 200 – 85; 125 – 128; 50 – 213.',
    figures: fig(10, 'Composto quelante com quatro nitrogênios no anel e tabela de atividade por tempo'),
    subItems: [
      { letter: 'a', prompt: 'Apresente o total de elétrons do cátion de ítrio. Dê o nome do arranjo geométrico ao redor dos átomos de nitrogênio no composto orgânico.' },
      { letter: 'b', prompt: 'Usando a notação ᴬ_Z X, determine o produto do decaimento radioativo do ítrio-90. Calcule a meia-vida do ítrio-90.' },
    ],
    modelAnswer: [
      'Item a: Y tem Z = 39; o Y³⁺ tem 36 elétrons. Cada N faz três ligações simples e tem um par de elétrons livre: geometria piramidal (pirâmide trigonal).',
      'Item b: emissão β⁻: ⁹⁰₃₉Y → ⁹⁰₄₀Zr + ⁰₋₁β; o produto é ⁹⁰₄₀Zr. De 500 para 125 MBq (duas meias-vidas) passaram 128 h: meia-vida = 64 h. Confere: em 213 h, 500/2^(213/64) ≈ 50 MBq.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q11', topicId: 'qui_eletroquimica', subject: 'Química',
    topic: 'Pilha de Edison (ferro–níquel)',
    prompt: 'A pilha de Edison usa compostos de ferro (polo negativo) e de níquel (polo positivo) em eletrólito com íons OH⁻, em compartimentos separados por membrana semipermeável. Semirreações de redução: Fe(OH)₂(s) + 2e⁻ → Fe(s) + 2 OH⁻(aq), E° = −0,88 V; NiOOH(s) + H₂O(l) + 1e⁻ → Ni(OH)₂(s) + OH⁻(aq), E° = +0,49 V.',
    figures: fig(11, 'Esquema da pilha de Edison com as semirreações de carga e descarga'),
    subItems: [
      { letter: 'a', prompt: 'Escreva a fórmula do composto formado pelo ânion do eletrólito e o cátion do metal alcalino do 2º período. Apresente o número de oxidação do níquel no NiOOH.' },
      { letter: 'b', prompt: 'No sentido da descarga, escreva a equação global e dê o potencial padrão da pilha (ddp).' },
    ],
    modelAnswer: [
      'Item a: o metal alcalino do 2º período é o lítio: LiOH. No NiOOH: Ni + 2(−2) + (+1) = 0 → Nox do Ni = +3.',
      'Item b: o ferro se oxida: Fe + 2 OH⁻ → Fe(OH)₂ + 2e⁻; o níquel se reduz (×2): 2 NiOOH + 2 H₂O + 2e⁻ → 2 Ni(OH)₂ + 2 OH⁻. Global: Fe(s) + 2 NiOOH(s) + 2 H₂O(l) → Fe(OH)₂(s) + 2 Ni(OH)₂(s). ddp = 0,49 − (−0,88) = 1,37 V.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q12', topicId: 'qui_oxirreducao', subject: 'Química',
    topic: 'NO₂ e água — ácido nítrico e pH',
    prompt: 'Em uma câmara fechada, dióxido de nitrogênio (NO₂) e vapor de água formaram ácido nítrico (HNO₃) e monóxido de nitrogênio (NO). Em uma gota de 0,050 mL formaram-se 5 × 10⁻⁸ mol de HNO₃.',
    subItems: [
      { letter: 'a', prompt: 'Equacione e balanceie a reação do dióxido de nitrogênio com a água.' },
      { letter: 'b', prompt: 'Calcule a concentração de ácido nítrico na gota, em mol/L. Dê o pH dessa gota.' },
    ],
    modelAnswer: [
      'Item a: 3 NO₂(g) + H₂O(l) → 2 HNO₃(aq) + NO(g) (o N vai de +4 para +5 em dois átomos e para +2 em um: desproporcionamento).',
      'Item b: V = 0,050 mL = 5 × 10⁻⁵ L. [HNO₃] = 5 × 10⁻⁸/5 × 10⁻⁵ = 1 × 10⁻³ mol/L. Ácido forte, totalmente ionizado: [H⁺] = 10⁻³ mol/L → pH = 3.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q13', topicId: 'qui_equilibrio', subject: 'Química',
    topic: 'Dimerização do ClO — Kc, temperatura e gás inerte',
    prompt: 'Duas moléculas de monóxido de cloro (ClO) ligam-se pelos átomos de oxigênio formando o dímero: 2 ClO(g) ⇌ (ClO)₂(g). Kc = 5,00 × 10⁷ a −25 °C e Kc = 6,02 × 10⁴ a 303 °C.',
    subItems: [
      { letter: 'a', prompt: 'Represente a fórmula estrutural do dímero (ClO)₂. Apresente a expressão da constante de equilíbrio da dimerização.' },
      { letter: 'b', prompt: 'Como o equilíbrio é afetado pelo aquecimento do sistema? Com a adição de um gás inerte ao sistema fechado, a pressão aumenta: qual componente tem a concentração aumentada?' },
    ],
    modelAnswer: [
      'Item a: Cl–O–O–Cl. Kc = [(ClO)₂]/[ClO]².',
      'Item b: Kc diminui com o aumento de temperatura, logo a dimerização é exotérmica; aquecer desloca o equilíbrio para a esquerda (mais monômero). O gás inerte, a volume constante, aumenta a pressão total mas não muda a quantidade nem o volume de ClO e (ClO)₂: nenhuma concentração aumenta, e o equilíbrio não se desloca.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q14', topicId: 'qui_organica_reacoes', subject: 'Química',
    topic: 'Oxidação enérgica de alceno — ácido acético e butanona',
    prompt: 'Um alceno de cadeia ramificada com 6 carbonos (composto 1) reage com KMnO₄ em meio ácido (+ 3 [O]) formando o composto 2, ácido acético (CH₃–COOH), e o composto 3, butanona (CH₃–CO–CH₂–CH₃). O composto 3, por redução, origina um álcool.',
    figures: fig(14, 'Composto 1 oxidado por KMnO4/H+ a composto 2 (ácido etanoico) e composto 3 (cetona), que é reduzido a álcool'),
    subItems: [
      { letter: 'a', prompt: 'Apresente a fórmula molecular do composto 1. Classifique o composto 3 quanto à polaridade.' },
      { letter: 'b', prompt: 'Calcule a massa molar, em g/mol, do álcool formado a partir do composto 3. Dê o nome da função orgânica do produto da reação entre um álcool e o composto 2.' },
    ],
    modelAnswer: [
      'Item a: a dupla se rompe entre os carbonos que viraram C=O: o carbono com H vira ácido (CH₃COOH) e o carbono sem H vira cetona. O alceno é CH₃–CH=C(CH₃)–CH₂–CH₃ (3-metilpent-2-eno), fórmula C₆H₁₂. A butanona é polar (grupo C=O).',
      'Item b: a redução da butanona dá butan-2-ol, C₄H₁₀O: 4·12 + 10·1 + 16 = 74 g/mol. Ácido carboxílico + álcool → éster (esterificação).',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q15', topicId: 'fis_cinematica', subject: 'Física',
    topic: 'Decolagem — MUV e segunda lei de Newton',
    prompt: 'Um avião de 60 000 kg parte do repouso no início da pista com aceleração constante de 1,5 m/s² e, depois de 40 s, alça voo.',
    subItems: [
      { letter: 'a', prompt: 'Calcule a velocidade do avião ao alçar voo, em m/s, e a intensidade média da resultante das forças sobre ele na pista, em newtons.' },
      { letter: 'b', prompt: 'Se a pista livre tem 1 600 m, a que distância do final da pista o avião alçou voo?' },
    ],
    modelAnswer: [
      'Item a: v = a·t = 1,5·40 = 60 m/s. F = m·a = 60 000·1,5 = 9,0 × 10⁴ N.',
      'Item b: Δs = a·t²/2 = 1,5·40²/2 = 1 200 m. Distância ao final: 1 600 − 1 200 = 400 m.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q16', topicId: 'fis_dinamica_impulsiva', subject: 'Física',
    topic: 'Bola de tênis — impulso e energia perdida no quique',
    prompt: 'Cada bola de tênis deve ter massa de 60 g e, solta de 2,5 m, deve retornar a uma altura entre 1,3 m e 1,5 m após a primeira colisão com o solo.',
    subItems: [
      { letter: 'a', prompt: 'No saque, o tenista golpeia a bola no ponto mais alto da trajetória, imprimindo-lhe 40 m/s. Calcule a quantidade de movimento adquirida, em kg·m/s, e o impulso aplicado pela raquete, em N·s.' },
      { letter: 'b', prompt: 'Desprezando a resistência do ar e com g = 10 m/s², calcule a energia cinética com que a bola, solta de 2,5 m, chega ao solo. Calcule a máxima energia mecânica que ela pode perder para cumprir a especificação.' },
    ],
    modelAnswer: [
      'Item a: Q = m·v = 0,060·40 = 2,4 kg·m/s. No ponto mais alto a velocidade era zero, então o impulso é a variação da quantidade de movimento: 2,4 N·s.',
      'Item b: Ec = m·g·h = 0,060·10·2,5 = 1,5 J. Para subir ao menos 1,3 m precisa manter 0,060·10·1,3 = 0,78 J; perda máxima = 1,5 − 0,78 = 0,72 J.',
    ],
    suggestedMinutes: 10,
  },
  {
    ...base, id: 'disc_famerp_2025_q17', topicId: 'fis_calorimetria', subject: 'Física',
    topic: 'Aquecimento e equilíbrio água–gelo',
    prompt: 'Ao nível do mar, 400 g de água a 20 °C são aquecidos numa chama e, após 8 minutos, chegam a 60 °C. Essa água, a 60 °C, é colocada num calorímetro ideal com gelo a 0 °C; no equilíbrio ainda há gelo junto à água líquida. Calor específico da água: 1 cal/(g·°C); calor latente de fusão: 80 cal/g.',
    subItems: [
      { letter: 'a', prompt: 'Calcule a taxa, em cal/min, com que a água absorveu calor durante o aquecimento.' },
      { letter: 'b', prompt: 'Determine a temperatura de equilíbrio, justificando pela configuração final. Calcule a massa de gelo que se fundiu.' },
    ],
    modelAnswer: [
      'Item a: Q = m·c·Δθ = 400·1·40 = 16 000 cal em 8 min → 2 000 cal/min.',
      'Item b: como sobrou gelo em contato com água líquida ao nível do mar, o equilíbrio é a 0 °C (temperatura de fusão). A água cede 400·1·60 = 24 000 cal, que fundem 24 000/80 = 300 g de gelo.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q18', topicId: 'fis_optica_instrumental', subject: 'Física',
    topic: 'Lente convergente projetando imagem',
    prompt: 'Uma criança projeta com uma lente convergente delgada a imagem nítida de um objeto luminoso de 5,0 cm numa parede, com a lente a 60 cm da parede e o objeto a 30 cm da lente.',
    subItems: [
      { letter: 'a', prompt: 'Calcule a altura da imagem, em cm, e determine sua natureza, justificando pelo fato de ter sido projetada.' },
      { letter: 'b', prompt: 'Calcule a distância focal, em cm, e a vergência, em dioptrias.' },
    ],
    modelAnswer: [
      'Item a: imagem projetada é real (formada pelos próprios raios) e, para lente convergente, invertida. A = −p′/p = −60/30 = −2: altura 2 × 5,0 = 10 cm, invertida.',
      'Item b: 1/f = 1/30 + 1/60 = 3/60 → f = 20 cm = 0,20 m. V = 1/f = 5,0 di.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q19', topicId: 'fis_ondulatoria', subject: 'Física',
    topic: 'Ondas estacionárias em corda e em tubos',
    prompt: 'Uma onda estacionária de 900 Hz, com comprimento de onda de 60 cm, está estabelecida numa corda com as duas extremidades fixas. A figura mostra três fusos (ventres) entre as extremidades, separadas pela distância L.',
    figures: fig(19, 'Onda estacionária com três fusos numa corda de comprimento L'),
    subItems: [
      { letter: 'a', prompt: 'Calcule L, em cm, e a velocidade de propagação da onda na corda, em m/s.' },
      { letter: 'b', prompt: 'Calcule, em cm, o menor comprimento de um tubo aberto numa extremidade e fechado na outra e o menor comprimento de um tubo aberto nas duas extremidades para que se estabeleçam ondas estacionárias de 60 cm de comprimento de onda.' },
    ],
    modelAnswer: [
      'Item a: cada fuso mede λ/2 = 30 cm; com três fusos, L = 90 cm. v = λ·f = 0,60·900 = 540 m/s.',
      'Item b: tubo fechado numa ponta: o modo fundamental tem L = λ/4 = 15 cm. Tubo aberto nas duas: L = λ/2 = 30 cm.',
    ],
    suggestedMinutes: 8,
  },
  {
    ...base, id: 'disc_famerp_2025_q20', topicId: 'fis_circuitos', subject: 'Física',
    topic: 'Fio de tungstênio — carga, elétrons e segunda lei de Ohm',
    prompt: 'Num fio cilíndrico de tungstênio, de comprimento L e área de seção 0,20 cm², passa corrente de 0,020 A, e a ddp entre as extremidades é 2,2 × 10⁻⁵ V.',
    subItems: [
      { letter: 'a', prompt: 'Com carga do elétron 1,6 × 10⁻¹⁹ C, calcule o número de elétrons que atravessa a seção do fio em 32 s.' },
      { letter: 'b', prompt: 'Sendo a resistividade do tungstênio 5,5 × 10⁻⁶ Ω·cm, calcule o comprimento do fio, em centímetros.' },
    ],
    modelAnswer: [
      'Item a: Q = i·Δt = 0,020·32 = 0,64 C. n = 0,64/1,6 × 10⁻¹⁹ = 4,0 × 10¹⁸ elétrons.',
      'Item b: R = U/i = 2,2 × 10⁻⁵/0,020 = 1,1 × 10⁻³ Ω. L = R·A/ρ = 1,1 × 10⁻³ · 0,20/5,5 × 10⁻⁶ = 40 cm.',
    ],
    suggestedMinutes: 8,
  },
];
