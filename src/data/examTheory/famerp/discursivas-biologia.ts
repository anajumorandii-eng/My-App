// Temas das 40 discursivas de Biologia da Famerp 2022–2026 (8 por prova),
// reescritos a partir da leitura de cada questão real. Os tipos de cobrança
// citam as questões ("2025 q06" = disc_famerp_2025_q06) e o teste confere que
// as 40 aparecem. As perguntas de treino são autorais.
//
// Achado que organiza tudo: o item (a) pede um nome exato (filo, célula,
// órgão, local, classe de substância, hormônio); o item (b) pede o "por que"
// de um mecanismo, quase sempre a partir de uma notícia. Por isso há um tema
// para o vocabulário que o item (a) cobra.

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasBiologia: DiscursiveTheme[] = [
  {
    id: 'bio-item-a',
    subject: 'Biologia',
    title: 'Nomear com precisão: o vocabulário que o item (a) cobra',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Em quase todas as 40 questões, o item (a) pede um **nome exato**: o tipo de simetria e um cefalópode (2022), o filo de um verme (2024 e 2025), a célula ligada à anemia hemolítica e onde ela é destruída (2023), a classe orgânica dos anticorpos e da actina (2024 e 2026), o tipo de sistema nervoso da hidra e o órgão que controla a respiração (2024), a unidade funcional do rim (2025), o tubo acima da notocorda e a cavidade revestida por mesoderme (2026), o órgão e o ácido do estômago (2026), o tipo de endocitose do macrófago (2026). É ponto que se perde trocando um termo por outro parecido.`,
    explanation: md`### Por que este tema existe
A Famerp abre quase toda questão com uma pergunta de **identificação**. Ela não aceita "uma célula do sangue" quando pede "a hemácia", nem "proteínas e lipídios" quando pede "a classe orgânica". Esta lista reúne os termos que apareceram e os vizinhos com que costumam ser confundidos.

### Classes de substâncias orgânicas
- **Proteínas**: enzimas, anticorpos (imunoglobulinas), actina e miosina, hemoglobina, hormônios peptídicos (insulina, glucagon, ADH).
- **Lipídios**: fosfolipídios (membranas), triglicerídeos (reserva), **esteroides** (colesterol, testosterona, estrógeno, progesterona, cortisol).
- **Carboidratos**: glicose, sacarose, **trealose** (dissacarídeo de glicoses), glicogênio (reserva animal), amido (vegetal), celulose.
- **Ácidos nucleicos**: DNA e RNA.

### Órgãos, células e locais que caíram
- **Hemácia** (eritrócito): destruída no **baço** (e fígado).
- **Néfron**: unidade funcional do rim. **Glomérulo** filtra; túbulos reabsorvem.
- **Bulbo** (medula oblonga): controla respiração e batimentos.
- **Estômago**: produz **pepsinogênio** e **ácido clorídrico**.
- **Tuba uterina**: local da fecundação.
- **Fígado**: sintetiza colesterol, armazena glicogênio.
- **Mastócito**: célula do conjuntivo que libera histamina.
- **Macrófago**: fagocita e apresenta antígenos.

### Grupos animais
- **Moluscos**: simetria bilateral, corpo mole, manto, pé muscular, **rádula** (fita dentada que raspa o alimento). Classes: gastrópodes (caramujo), bivalves (mexilhão; perderam a rádula), **cefalópodes** (polvo, lula, sépia, náutilo).
- **Nematoda**: vermes cilíndricos, tubo digestório completo (*Ascaris*, nematódeos de vida livre).
- **Cnidários** (hidra): sistema nervoso **difuso**, em rede, sem centralização.

### Embriologia
- **Ectoderma** → epiderme e sistema nervoso (**tubo neural** → encéfalo e medula).
- **Mesoderma** → músculos, ossos, sangue, notocorda.
- **Endoderma** → revestimento do tubo digestório e glândulas anexas.
- **Celoma**: cavidade **revestida inteiramente por mesoderme** (celoma verdadeiro).

### Endocitose
**Fagocitose**: englobar partícula sólida com pseudópodes. **Pinocitose**: englobar líquido. **Mediada por receptor**: com receptores específicos.

### Como escrever
Dê o termo técnico **e** uma característica que o identifica: "mastócito, célula do tecido conjuntivo que armazena histamina".`,
    applications: [
      md`**Todo o 2º dia de Biologia**: o item (a) de quase todas as questões vem desta lista.`,
      md`**Objetiva**: classificação, fisiologia e citologia caem na 1ª fase.`,
      md`**Química**: classes de substâncias orgânicas e funções.`,
    ],
    strategy: [
      md`Responda com o termo exato, não com a categoria ampla.`,
      md`Se pede "onde", diga o órgão **e**, se couber, a estrutura (estômago, células principais).`,
      md`Se pede "qual classe", diga o grupo orgânico (proteína, lipídio).`,
    ],
    examples: [
      {
        title: 'Classe orgânica',
        prompt: md`A que classe de substâncias pertencem a insulina, o colesterol e o glicogênio?`,
        steps: [md`Insulina: proteína (hormônio peptídico).`, md`Colesterol: lipídio (esteroide).`, md`Glicogênio: carboidrato (polissacarídeo de reserva).`],
      },
      {
        title: 'Folheto embrionário',
        prompt: md`De qual folheto se origina o sistema nervoso, e qual estrutura embrionária o forma?`,
        steps: [md`Ectoderma.`, md`Tubo neural, formado pela invaginação do ectoderma acima da notocorda.`],
      },
    ],
    discursive: {
      prompt: md`Uma notícia descreve uma lula gigante encontrada numa praia. (a) A que filo e a que classe ela pertence? Que tipo de simetria apresenta? (b) Cite a estrutura dos moluscos usada para raspar o alimento e um grupo de moluscos que a perdeu.`,
      modelAnswer: [md`(a) Filo Mollusca, classe Cephalopoda; simetria bilateral.`, md`(b) A rádula; os bivalves (mexilhões, ostras), que se alimentam por filtração.`],
      scoring: [md`Filo e classe corretos.`, md`Simetria bilateral.`, md`Rádula e o grupo que a perdeu.`],
    },
    patterns: [
      {
        title: 'Identificar célula, órgão ou local',
        questions: ['2023 q04', '2025 q06', '2026 q05', '2024 q03', '2022 q04'],
        asks: md`Célula da anemia hemolítica e onde é destruída; unidade funcional do rim; órgão do pepsinogênio e ácido gástrico; órgão que controla a respiração; vaso com valvas.`,
        solve: [md`Termo exato + uma característica.`],
        distractors: md`Não há alternativas: perde-se ponto com termos vizinhos (fígado por baço, medula por bulbo, artéria por veia).`,
      },
      {
        title: 'Classificar organismo e estrutura',
        questions: ['2022 q02', '2024 q07', '2025 q03', '2026 q02'],
        asks: md`Simetria e exemplo de cefalópode; filo do *Ascaris* e do nematódeo do permafrost; tubo neural e celoma.`,
        solve: [md`Filo e classe pelo nome científico.`, md`Folheto e estrutura embrionária.`],
        distractors: md`Chamar nematódeo de platelminto e celoma de "cavidade do corpo".`,
      },
      {
        title: 'Classe de substância e tipo de processo',
        questions: ['2024 q05', '2026 q03'],
        asks: md`Classe orgânica dos anticorpos; tipo de endocitose e classe da actina.`,
        solve: [md`Proteína; fagocitose.`],
        distractors: md`Responder "glicídio" para anticorpo ou "pinocitose" para englobar bactéria.`,
      },
    ],
    traps: [
      { trap: md`Responder a categoria ampla ("célula do sangue").`, fix: md`Dê o nome exato (hemácia).` },
      { trap: md`Confundir glucagon (hormônio) com glicogênio (polissacarídeo).`, fix: md`A Famerp cobrou exatamente esse erro num excerto em 2025.` },
    ],
  },

  {
    id: 'bio-genetica',
    subject: 'Biologia',
    title: 'Genética: cruzamentos, cromossomos e populações',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`É o tema **mais cobrado do 2º dia**: 9 das 40 questões. Dominância incompleta e número de combinações gaméticas (2022), Hardy-Weinberg no ABO (2022), Duchenne ligada ao X com probabilidade para a irmã (2023), cariótipo e translocação (2024), gafanhoto rosa com probabilidade condicional (2024), herança quantitativa (2025), corpúsculo de Barr e não disjunção (2025), ligação gênica com distância em UR (2026), transgênico com gene no Z em aves (2026). A banca exige **"demonstre os cálculos"**.`,
    explanation: md`### 1. Gametas: o passo que mais erra
Cada par de alelos segrega; cada gameta leva **um** alelo de cada gene. Número de tipos de gameta = $2^n$, com $n$ = número de genes em **heterozigose** (em segregação independente). MBLlCC: 2 × 2 × 1 = 4; MBLlCc: 2 × 2 × 2 = 8. **Combinações** num cruzamento = produto dos tipos de gameta dos dois (4 × 8 = 32).

### 2. Tipos de dominância
- **Completa**: Aa = AA no fenótipo; 3 : 1.
- **Incompleta**: heterozigoto **intermediário** (creme entre marrom e branco); 1 : 2 : 1 em genótipo e fenótipo.
- **Codominância**: os dois se expressam (sangue AB).

### 3. Segregação independente × ligação
- **2ª lei de Mendel** vale para genes em **cromossomos diferentes** (pares não homólogos).
- **Ligados** (mesmo cromossomo): os gametas **parentais** são os mais frequentes. A frequência de recombinantes (por **crossing-over**, na prófase I) = distância em **UR** (centimorgans). Com 26 UR: 26% recombinantes (13% de cada), 74% parentais (37% de cada).
- Crossing-over só ocorre entre **homólogos**; troca entre não homólogos é **translocação** (mutação estrutural).

### 4. Probabilidade condicional
"Filha **verde** de pais heterozigotos": ela não pode ser aa, então $P(\text{Aa}) = \frac{2}{3}$ (não $\frac12$). Depois multiplique pelas outras condições (passar o alelo, ser fêmea). Duchenne: irmã normal de um afetado, com mãe portadora: $P(\text{portadora}) = \frac12$; filho homem afetado: $\frac12 \cdot \frac12 \cdot \frac12 = \frac18$ (portadora × passar $X^d$ × menino). **Explicite cada fator.**

### 5. Herança ligada ao sexo
- **XY**: o homem é **heterogamético** (forma gametas X e Y). Recessivo no X se expressa no homem com um só alelo. Pai passa o X às filhas e o Y aos filhos.
- **ZW (aves)**: a **fêmea** é ZW (heterogamética), o macho ZZ. A fêmea passa o **Z aos filhos machos** e o W às fêmeas. Gene no Z de uma galinha só chega aos filhos machos.

### 6. Herança quantitativa (poligênica)
Vários genes de efeito aditivo; distribuição em **sino**. Com $n$ pares: $2n + 1$ classes; cada alelo efetivo soma $\frac{\text{máx} - \text{mín}}{2n}$. A classe mais frequente tem $n$ alelos efetivos. Triplo heterozigoto × triplo heterozigoto gera os dois extremos.

### 7. Populações: Hardy-Weinberg
Equilíbrio em população grande, panmítica, sem **mutação, seleção, migração ou deriva** (esses são os fatores evolutivos). ABO: $p + q + r = 1$; B heterozigoto $= 2qr$; AB $= 2pq$.

### 8. Cromossomos
- Cariótipo humano: 46 = 44 autossomos + 2 sexuais. X e Y **não são homólogos** (tamanho e genes diferentes; só pequenas regiões pseudoautossômicas).
- **Corpúsculo de Barr**: X inativado e condensado; número = X − 1 (46,XX → 1; 47,XXX → 2; 46,XY → 0).
- **Não disjunção** (na anáfase I ou II) gera gametas com cromossomo a mais. XXX é trissomia **sexual**; Down é trissomia de **autossomo** (21).`,
    formulas: [
      { tex: String.raw`\text{tipos de gameta} = 2^{n}`, meaning: md`$n$ = genes em heterozigose, com segregação independente.` },
      { tex: String.raw`p + q = 1,\qquad p^2 + 2pq + q^2 = 1`, meaning: md`Hardy-Weinberg com **dois** alelos.` },
      { tex: String.raw`p + q + r = 1,\qquad (p + q + r)^2 = p^2 + q^2 + r^2 + 2pq + 2pr + 2qr = 1`, meaning: md`Com **três** alelos (ABO: $p$ = Iᴬ, $q$ = Iᴮ, $r$ = i): B heterozigoto $= 2qr$, AB $= 2pq$. A identidade de dois alelos não vale aqui.` },
      { tex: String.raw`\text{efeito por alelo} = \frac{\text{máx} - \text{mín}}{2n}`, meaning: md`Herança quantitativa.` },
      { tex: String.raw`\%\ \text{parentais} = 100\% - \text{UR}`, meaning: md`Ligação gênica; divida igualmente entre os dois tipos.` },
    ],
    applications: [
      md`**Saúde**: aconselhamento genético, Duchenne, hemofilia, síndromes cromossômicas.`,
      md`**Biotecnologia**: transgênicos e sexagem de aves.`,
      md`**Evolução**: fatores que alteram frequências.`,
      md`**Agricultura**: melhoramento de caracteres quantitativos.`,
    ],
    strategy: [
      md`Escreva os genótipos de todos os indivíduos citados.`,
      md`Liste os gametas antes de cruzar.`,
      md`Probabilidade: um fator por condição, escrito e justificado.`,
      md`Termine com a fração **e** a porcentagem ou o número esperado.`,
    ],
    examples: [
      {
        title: 'Probabilidade condicional',
        prompt: md`Um homem normal, filho de pais heterozigotos para um alelo recessivo autossômico, casa com uma mulher afetada. Qual a probabilidade de terem um filho afetado?`,
        steps: [md`$P(\text{Aa}) = \frac23$ (ele não é aa).`, md`Se Aa × aa, filho afetado: $\frac12$.`, md`$\frac23 \cdot \frac12 = \frac13$.`],
      },
      {
        title: 'Ligação',
        prompt: md`Genes a 10 UR; indivíduo AB/ab. Que gametas e proporções?`,
        steps: [md`Parentais AB e ab: 45% cada.`, md`Recombinantes Ab e aB: 5% cada.`],
      },
    ],
    discursive: {
      prompt: md`Em aves, um alelo dominante ligado ao Z causa plumagem barrada. (a) Qual o sexo heterogamético nas aves? (b) Um macho barrado heterozigoto é cruzado com uma fêmea não barrada. Que proporção dos filhotes machos e das fêmeas será barrada? Demonstre.`,
      modelAnswer: [md`(a) A fêmea (ZW).`, md`(b) Macho $Z^BZ^b$ × fêmea $Z^bW$. Machos: $Z^BZ^b$ ou $Z^bZ^b$ → $\frac12$ barrados. Fêmeas: $Z^BW$ ou $Z^bW$ → $\frac12$ barradas.`],
      scoring: [md`Identifica a fêmea como heterogamética.`, md`Genótipos com Z e W.`, md`Proporções por sexo com o cruzamento escrito.`],
    },
    patterns: [
      {
        title: 'Gametas, dominância e Hardy-Weinberg',
        questions: ['2022 q07', '2022 q08', '2025 q07'],
        asks: md`Tipo de herança da pelagem e combinações gaméticas; fatores evolutivos e frequências no ABO; herança quantitativa, gameta de AABBEE e massa mais frequente.`,
        solve: [md`$2^n$ por indivíduo e produto entre os dois.`, md`$r = 1 - p - q$; $2qr$ e $2pq$.`, md`Efeito por alelo e classe central.`],
        distractors: md`Somar tipos de gameta em vez de multiplicar e calcular AB como $p \cdot q$ sem o 2.`,
      },
      {
        title: 'Herança ligada ao sexo e probabilidade',
        questions: ['2023 q07', '2026 q08', '2024 q08'],
        asks: md`Cromossomo do alelo e por que o homem é heterogamético; probabilidade de a irmã ter filho afetado; gene no Z para só machos; probabilidade condicional com o gafanhoto rosa.`,
        solve: [md`Genótipos com X/Y ou Z/W.`, md`Um fator por condição, incluindo $\frac23$ quando o fenótipo exclui o homozigoto recessivo.`],
        distractors: md`Usar $\frac12$ em vez de $\frac23$ e esquecer o fator do sexo do filho.`,
      },
      {
        title: 'Cromossomos, mutações e ligação',
        questions: ['2024 q04', '2025 q08', '2026 q07'],
        asks: md`Autossomos e por que X e Y não são homólogos; translocação × permutação; corpúsculo de Barr e não disjunção; crossing-over, separação de X e Y e gametas parentais a 26 UR.`,
        solve: [md`Barr = X − 1.`, md`Permutação só entre homólogos.`, md`Parentais = (100 − UR)/2 cada.`],
        distractors: md`Chamar a troca entre 10 e 14 de crossing-over e dar 74% a um único tipo parental.`,
      },
    ],
    traps: [
      { trap: md`Usar $\frac12$ para "ser heterozigoto" quando o fenótipo é dominante.`, fix: md`Entre AA e Aa de pais Aa × Aa, $P(\text{Aa}) = \frac23$.` },
      { trap: md`Tratar aves como XY.`, fix: md`Em aves, a fêmea é ZW.` },
      { trap: md`Não mostrar os cálculos.`, fix: md`A banca pede "demonstre": escreva cada fator.` },
    ],
  },

  {
    id: 'bio-imunologia',
    subject: 'Biologia',
    title: 'Imunologia e sangue',
    years: [2023, 2024, 2026],
    howItFalls: md`Caiu em 3 anos com 4 questões: anemia hemolítica autoimune (2023), terapia CAR-T contra o câncer (2023), alergia com IgE, mastócitos e anafilaxia (2024), fagocitose pelo macrófago, fusão de membranas e apresentação de antígeno ao T CD4 (2026).`,
    explanation: md`### 1. Inata e adaptativa
- **Inata**: rápida, inespecífica. Barreiras, fagócitos (neutrófilos, macrófagos), inflamação.
- **Adaptativa (adquirida)**: específica, com **memória**, depende de contato prévio. Linfócitos B e T.

### 2. Do macrófago ao anticorpo
1. **Fagocitose**: o macrófago engloba a bactéria com pseudópodes (actina); forma-se o endossomo.
2. **Fusão com o lisossomo** (possível porque as membranas são bicamadas fluidas de **fosfolipídios**): o endolisossomo digere a bactéria.
3. **Apresentação**: fragmentos do antígeno vão à superfície ligados ao **MHC de classe II**.
4. O **linfócito T CD4 (auxiliar)** reconhece o complexo pelo receptor (TCR) e libera citocinas que ativam B e T CD8.
5. **Linfócito B** → **plasmócito** → anticorpos (imunoglobulinas, **proteínas**).
6. **T CD8 (citotóxico)** destrói células infectadas ou tumorais.
7. Ficam **células de memória**.

### 3. Alergia e anafilaxia
Hipersensibilidade a um alérgeno inofensivo. Na **sensibilização**, formam-se **IgE** que se fixam aos **mastócitos** (células do conjuntivo). No novo contato, os mastócitos liberam **histamina**: vasodilatação, edema e **broncoconstrição** (contração da musculatura lisa dos bronquíolos). Na **anafilaxia**, é sistêmica: queda de pressão e edema de glote. É imunidade **adquirida** porque depende de contato prévio e de resposta específica.

### 4. Autoimunidade
O sistema produz **autoanticorpos** contra antígenos do próprio corpo. Na anemia hemolítica autoimune, eles marcam as **hemácias** para destruição (no baço). Menos hemácias → menos hemoglobina → menos O₂ aos músculos → menos ATP aeróbio → **fadiga** em pequeno esforço.

### 5. Câncer e terapia CAR-T
Câncer = **mitose descontrolada**. Na CAR-T, linfócitos T do **próprio paciente** são modificados para reconhecer uma **proteína** da superfície tumoral. Baixo risco de rejeição: mesmos antígenos de histocompatibilidade (**MHC**). A modificação é em células **somáticas**: não passa aos filhos.

### 6. Vacina e soro
Vacina: antígeno → imunidade **ativa**, memória. Soro: anticorpos prontos → **passiva**, imediata, temporária.`,
    applications: [
      md`**Saúde**: alergias, anafilaxia (adrenalina), doenças autoimunes (lúpus), imunoterapia do câncer, vacinas.`,
      md`**Biotecnologia**: células modificadas geneticamente.`,
      md`**Célula**: endocitose, lisossomos, membrana fluida.`,
      md`**Genética**: células somáticas × germinativas.`,
    ],
    strategy: [
      md`Nomeie a célula e a molécula (mastócito/histamina, plasmócito/anticorpo, macrófago/MHC II).`,
      md`Explique a cadeia causa → efeito até o sintoma.`,
      md`Herança: só alteração em células germinativas passa aos filhos.`,
    ],
    examples: [
      {
        title: 'Memória',
        prompt: md`Por que a segunda exposição a um antígeno gera resposta mais rápida e intensa?`,
        steps: [md`A primeira formou linfócitos de memória.`, md`Na segunda, eles se ativam logo e produzem mais anticorpos em menos tempo.`],
      },
      {
        title: 'Herança de terapia',
        prompt: md`Uma terapia altera células da medula óssea de um paciente. Os filhos herdarão a alteração?`,
        steps: [md`Não: são células somáticas.`, md`Só alterações nas células da linhagem germinativa passam aos gametas.`],
      },
    ],
    discursive: {
      prompt: md`Uma pessoa alérgica a camarão teve dificuldade para respirar após comê-lo. (a) Por que a reação não ocorreu na primeira vez em que ela comeu camarão? (b) Que célula e que substância causam o fechamento das vias aéreas, e como?`,
      modelAnswer: [md`(a) Na primeira exposição houve sensibilização: produção de IgE específica, que se fixou aos mastócitos. A reação exige esse contato prévio (imunidade adquirida).`, md`(b) Os mastócitos liberam histamina, que contrai a musculatura lisa dos bronquíolos (broncoconstrição) e causa edema, estreitando as vias aéreas.`],
      scoring: [md`Sensibilização e IgE.`, md`Mastócito e histamina.`, md`Broncoconstrição e edema como mecanismo.`],
    },
    patterns: [
      {
        title: 'Autoimunidade e terapia celular',
        questions: ['2023 q04', '2023 q05'],
        asks: md`Célula e local de destruição; mecanismo autoimune e fadiga; por que a CAR-T não é rejeitada, divisão no câncer, alvo proteico e se é herdada.`,
        solve: [md`Autoanticorpos marcam hemácias.`, md`Menos O₂ → menos ATP → fadiga.`, md`Células próprias (MHC); somáticas não passam aos filhos.`],
        distractors: md`Não há alternativas: perde-se ponto dizendo "o corpo rejeita menos" sem citar o MHC, ou afirmando herança de alteração somática.`,
      },
      {
        title: 'Alergia e apresentação de antígeno',
        questions: ['2024 q05', '2026 q03'],
        asks: md`Classe dos anticorpos e por que a alergia é imunidade adquirida; mastócito e efeito nas vias aéreas; fagocitose, actina, fusão por fosfolipídios e sinalização ao T CD4.`,
        solve: [md`Proteína; contato prévio e especificidade.`, md`Histamina → broncoconstrição.`, md`Antígeno no MHC II reconhecido pelo TCR do CD4.`],
        distractors: md`Dizer que o macrófago "produz anticorpos".`,
      },
    ],
    traps: [
      { trap: md`Dizer que o linfócito B produz anticorpo diretamente.`, fix: md`Quem produz é o plasmócito.` },
      { trap: md`Confundir alergia com autoimunidade.`, fix: md`Alergia: alvo externo inofensivo; autoimunidade: alvo próprio.` },
    ],
  },

  {
    id: 'bio-fisiologia-humana',
    subject: 'Biologia',
    title: 'Fisiologia humana',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 4 anos com 5 questões: ponte de safena com valvas e pressão arterial (2022), sistema nervoso difuso, bulbo e reflexo patelar (2024), excerto com erro conceitual sobre o pâncreas e síntese de colesterol (2025), néfron, proteínas na urina, ADH e ATP nos túbulos (2025), experimento com pepsinogênio, ácido e bicarbonato (2026).`,
    explanation: md`### 1. Circulação
- **Artérias**: parede grossa e elástica, pressão alta. **Veias**: parede fina, pressão baixa, **valvas** que impedem o refluxo.
- **Coronárias** irrigam o miocárdio, que trabalha sem parar; obstrução → isquemia → infarto.
- Na **ponte de safena**, a veia passa a receber **pressão arterial**, muito maior que a que suporta normalmente: por isso tende a se obstruir.

### 2. Sistema nervoso
- **Difuso** (cnidários, hidra): rede sem centralização. **Centralizado**: encéfalo + medula.
- **Bulbo**: centro respiratório e cardiovascular.
- **Reflexo patelar** (arco reflexo **medular**): batida no tendão estira o quadríceps → **neurônio sensitivo** (aferente, raiz dorsal) → sinapse **direta** na medula com o **neurônio motor** (eferente) → contração e extensão da perna, sem passar pelo encéfalo.

### 3. Pâncreas e glicemia
- Endócrino: **insulina** (baixa a glicemia: glicose entra nas células, vira glicogênio) e **glucagon** (sobe a glicemia: quebra de glicogênio no fígado).
- Exócrino: suco pancreático (lipase, amilase, tripsinogênio, bicarbonato).
- **Glicogênio** é polissacarídeo de reserva, não hormônio: confundir os dois foi o "equívoco conceitual" cobrado em 2025.
- **Colesterol**: sintetizado no **fígado**; precursor dos hormônios **esteroides** (gônadas: testosterona, estrógeno, progesterona; suprarrenal: cortisol).

### 4. Rim
- **Néfron**: glomérulo + cápsula de Bowman (filtração) e túbulos (reabsorção e secreção).
- **Proteínas** não aparecem na urina: são grandes demais para a barreira de filtração; proteína na urina indica lesão.
- **ADH** (produzido no **hipotálamo**, liberado pela **neuro-hipófise**): com pouca água, a osmolaridade sobe; o ADH aumenta a permeabilidade dos túbulos distais e ductos coletores (aquaporinas); mais água volta ao sangue e a urina fica menor e concentrada.
- **ATP** sustenta o **transporte ativo** (bomba Na⁺/K⁺) que reabsorve glicose, aminoácidos e íons contra o gradiente.

### 5. Digestão de proteínas no estômago
- Células principais produzem **pepsinogênio** (inativo, para não digerir a própria célula); células parietais, **HCl**.
- O ácido **ativa** o pepsinogênio em **pepsina** e mantém o pH ácido em que ela age.
- **Bicarbonato** neutraliza o ácido: sem pH ácido não há ativação, e a pepsina se desnatura em meio básico (como no duodeno).
- Leitura de experimento: compare os tubos que diferem em **um só** fator.`,
    applications: [
      md`**Saúde**: infarto e revascularização, diabetes, desidratação, álcool e ADH, refluxo e antiácidos.`,
      md`**Química**: pH, catálise enzimática, transporte de íons.`,
      md`**Célula**: transporte ativo, receptores, hormônios esteroides.`,
    ],
    strategy: [
      md`Localize órgão e etapa.`,
      md`Nomeie estrutura e molécula.`,
      md`Feche com a consequência no organismo.`,
      md`Em experimento, compare tubos dois a dois.`,
    ],
    examples: [
      {
        title: 'ADH e álcool',
        prompt: md`Por que quem bebe álcool urina mais?`,
        steps: [md`O álcool inibe a liberação de ADH.`, md`Com menos ADH, o ducto coletor reabsorve menos água: urina volumosa e diluída.`],
      },
      {
        title: 'Experimento',
        prompt: md`Tubo A: amilase + amido a 37 °C → digerido. Tubo B: amilase fervida + amido a 37 °C → não digerido. O que se conclui?`,
        steps: [md`Só muda o aquecimento prévio da enzima.`, md`A fervura desnaturou a amilase.`],
      },
    ],
    discursive: {
      prompt: md`Uma pessoa desidratada produz pouca urina, e muito concentrada. (a) Que hormônio age, onde é produzido e de onde é liberado? (b) Explique como ele reduz o volume de urina. (c) Por que a glicose normalmente não aparece na urina?`,
      modelAnswer: [md`(a) ADH (vasopressina), produzido no hipotálamo e liberado pela neuro-hipófise.`, md`(b) Aumenta a permeabilidade à água dos túbulos distais e ductos coletores (aquaporinas): mais água volta ao sangue e a urina fica menor e mais concentrada.`, md`(c) A glicose filtrada é reabsorvida no túbulo proximal por transporte ativo, que gasta ATP.`],
      scoring: [md`Hormônio, local de produção e de liberação.`, md`Mecanismo com aquaporinas e ducto coletor.`, md`Reabsorção ativa da glicose.`],
    },
    patterns: [
      {
        title: 'Circulação e sistema nervoso',
        questions: ['2022 q04', '2024 q03'],
        asks: md`Vaso com valvas e sua função; pressão sobre a safena e papel das coronárias; tipo de sistema nervoso da hidra, bulbo e explicação do reflexo patelar com os nervos.`,
        solve: [md`Valvas = veias, impedem refluxo.`, md`Pressão arterial na veia.`, md`Sensitivo → medula → motor, sem encéfalo.`],
        distractors: md`Não há alternativas: perde-se ponto ao pôr o reflexo patelar no cérebro e esquecer de nomear os nervos.`,
      },
      {
        title: 'Rim, pâncreas e digestão',
        questions: ['2025 q06', '2025 q04', '2026 q05'],
        asks: md`Néfron, proteínas na urina, ADH e ATP; erro conceitual (glicogênio × glucagon), função da insulina, colesterol e gônadas; pepsinogênio, HCl, ativação e bicarbonato.`,
        solve: [md`Filtração por tamanho; ADH e aquaporinas; transporte ativo.`, md`Glucagon é o hormônio; colesterol vira esteroides.`, md`Ácido ativa; bicarbonato neutraliza.`],
        distractors: md`Aceitar "glicogênio" como hormônio e esquecer que, sem pH ácido, o pepsinogênio nem chega a ser ativado.`,
      },
    ],
    traps: [
      { trap: md`Dizer que o ADH é produzido no rim ou na neuro-hipófise.`, fix: md`Produzido no hipotálamo, liberado pela neuro-hipófise, age no rim.` },
      { trap: md`Confundir glucagon e glicogênio.`, fix: md`Glucagon: hormônio. Glicogênio: reserva.` },
      { trap: md`Pôr o reflexo patelar no cérebro.`, fix: md`É medular.` },
    ],
  },

  {
    id: 'bio-vegetal',
    subject: 'Biologia',
    title: 'Fisiologia e reprodução vegetal',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: estiolamento, respiração no escuro e endosperma (2022), gráfico de K⁺ nas células-guarda e fechamento estomático (2023), óvulo vegetal × animal (2024), flor e fruto do tomate, partenocarpia e DNA materno no endosperma (2025), gráfico de abertura estomática ao longo do dia e fechamento ao meio-dia (2026). Dois dos cinco vieram com **gráfico** para interpretar.`,
    explanation: md`### 1. Estômatos: abertura
1. Luz e CO₂ baixo ativam bombas de prótons; **K⁺ entra** nas células-guarda (vindo das células anexas).
2. A concentração de solutos sobe; a **água entra por osmose**.
3. As células ficam **túrgidas** e se curvam: o ostíolo **abre**.
4. Entra CO₂ para a fotossíntese.

### 2. Estômatos: fechamento
- **Ácido abscísico (ABA)**, produzido com falta de água: K⁺ **sai** das células-guarda, a água sai, as células ficam **flácidas** e o ostíolo **fecha**.
- **À noite**: sem luz não há fotossíntese; fechar evita perder água à toa.
- **Ao meio-dia** em dias quentes e secos: a transpiração supera a absorção, a planta entra em déficit hídrico e fecha temporariamente (a queda "X" do gráfico de 2026).
- **Solo seco ou salino** induz fechamento mesmo com luz.

### 3. Transpiração e umidade
A transpiração depende da diferença de vapor entre a folha e o ar. **Ar úmido** → diferença menor → transpiração **menor**. Vento, calor e ar seco aumentam a transpiração.

### 4. Ler o gráfico
Em gráfico de K⁺: K⁺ **alto** nas células-guarda = estômato **aberto**; K⁺ **baixo** nelas (alto nas anexas) = **fechado**. Em gráfico diário: abertura acompanha a luz; absorção de água acompanha a transpiração com atraso.

### 5. Germinação e estiolamento
No escuro, o embrião faz **respiração celular** consumindo as reservas. **Estiolamento**: caule longo e fino, sem clorofila, folhas pequenas; investe energia em crescer até a luz antes que as reservas acabem.

### 6. Reprodução das angiospermas
- **Óvulo vegetal** é **multicelular**: tegumentos, nucelo e **saco embrionário** (gametófito feminino) com a **oosfera**. O óvulo animal é uma única célula.
- **Dupla fecundação**: um núcleo espermático + oosfera → zigoto (2n); outro + **dois núcleos polares** → **endosperma (3n)**. Endosperma tem **2 conjuntos maternos e 1 paterno**.
- **Óvulo → semente; ovário → fruto** (pericarpo).
- **Partenocarpia**: fruto sem fecundação, sem sementes; induzida artificialmente com **auxina** (e giberelina).
- No feijão, as reservas foram para os **cotilédones**.`,
    applications: [
      md`**Ecologia**: adaptações do Cerrado e da Caatinga à seca.`,
      md`**Química**: osmose e concentração de solutos.`,
      md`**Agricultura**: frutos sem sementes, irrigação, broto de feijão.`,
      md`**Fotossíntese e respiração**: entrada de CO₂ e uso de reservas.`,
    ],
    strategy: [
      md`Estômato: escreva a sequência K⁺ → osmose → turgor → abertura (ou o inverso).`,
      md`Gráfico: diga o que cada curva indica antes de responder.`,
      md`Reprodução: diga a origem (óvulo/ovário) e a ploidia.`,
    ],
    examples: [
      {
        title: 'Gráfico de K⁺',
        prompt: md`Num gráfico, o K⁺ nas células-guarda cai enquanto sobe nas anexas. O que acontece com o estômato e por quê?`,
        steps: [md`K⁺ sai das células-guarda; a água sai por osmose.`, md`Células flácidas: estômato fechando (ação do ABA).`],
      },
      {
        title: 'DNA no endosperma',
        prompt: md`Por que o endosperma tem mais DNA materno que paterno?`,
        steps: [md`Resulta de dois núcleos polares (maternos) + um núcleo espermático (paterno).`, md`3n: dois conjuntos maternos, um paterno.`],
      },
    ],
    discursive: {
      prompt: md`Em dias muito quentes e secos, muitas plantas fecham os estômatos por volta do meio-dia. (a) Explique o mecanismo do fechamento, citando o hormônio. (b) Qual a vantagem e qual o custo desse fechamento para a planta?`,
      modelAnswer: [md`(a) O ácido abscísico faz o K⁺ sair das células-guarda; a água sai por osmose, elas ficam flácidas e o ostíolo se fecha.`, md`(b) Vantagem: reduz a perda de água por transpiração quando ela supera a absorção. Custo: entra menos CO₂ e a fotossíntese cai.`],
      scoring: [md`ABA e saída de K⁺.`, md`Osmose e flacidez.`, md`Vantagem hídrica e custo fotossintético.`],
    },
    patterns: [
      {
        title: 'Estômatos com gráfico',
        questions: ['2023 q06', '2026 q04'],
        asks: md`Vantagem de fechar à noite, condição do solo que induz fechamento, momento em que estão fechados pelo K⁺; por que abrem de dia, efeito da umidade do ar, hormônio do fechamento e condição do fechamento ao meio-dia.`,
        solve: [md`K⁺ baixo nas células-guarda = fechado; ABA.`, md`Ar úmido reduz transpiração.`, md`Meio-dia quente e seco = déficit hídrico.`],
        distractors: md`Não há alternativas: perde-se ponto dizendo que a luz "abre diretamente" o estômato, sem o K⁺ e a osmose.`,
      },
      {
        title: 'Germinação, óvulo, flor e fruto',
        questions: ['2022 q01', '2024 q06', '2025 q05'],
        asks: md`Processo do embrião no escuro e vantagem do estiolamento; endosperma e origem; por que o óvulo vegetal é mais complexo; estruturas X e Y do tomate, partenocarpia e DNA materno no endosperma.`,
        solve: [md`Respiração consumindo reservas.`, md`Óvulo multicelular com saco embrionário.`, md`Óvulo → semente; auxina; 2 polares + 1 espermático.`],
        distractors: md`Dizer que a planta faz fotossíntese no escuro e que o fruto vem do óvulo.`,
      },
    ],
    traps: [
      { trap: md`Dizer que o fruto vem do óvulo.`, fix: md`Fruto vem do ovário; semente vem do óvulo.` },
      { trap: md`Achar que o endosperma é 2n.`, fix: md`É 3n nas angiospermas.` },
    ],
  },

  {
    id: 'bio-ecologia',
    subject: 'Biologia',
    title: 'Ecologia a partir de notícia',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**, sempre com notícia: macaco-prego e palmeira juçara sem predadores (2022), sucessão primária em ilha vulcânica (2023), fogo no Cerrado e na Amazônia (2024), bactérias da pele de anfíbios e biomagnificação do arsênio (2025), petróleo na Foz do Amazonas, acidificação e corais (2026).`,
    explanation: md`### 1. Cadeias e níveis tróficos
Produtor (1º nível) → consumidor primário (2º) → secundário (3º)… Cerca de 90% da energia se perde em cada nível. Ao montar uma cadeia com organismos do texto, use **só** os citados e diga o nível pedido.

### 2. Densidade populacional e resistência do meio
Densidade aumenta com natalidade e imigração; diminui com mortalidade e emigração. **Fatores bióticos**: predação, competição, parasitismo, doenças, alimento. Sem predadores, a população cresce, mas **não indefinidamente**: a falta de recurso, a competição e as doenças (resistência do meio) a limitam à **capacidade de suporte**.

### 3. Sucessão ecológica
- **Primária** (rocha nua, lava, duna): pioneiros **autótrofos resistentes e pouco exigentes** (liquens) iniciam o solo. Chegam por **vento, correntes marinhas ou aves**.
- **Secundária** (após fogo ou desmatamento): já há solo e banco de sementes.
- **Clímax**: produção bruta ≈ respiração de **toda a comunidade** → **produtividade líquida da comunidade ≈ 0**, biomassa estável. Mais espécies, estratos e microambientes → **mais nichos**.

### 4. Fogo nos biomas
- **Cerrado** evoluiu com fogo: **súber (cortiça) espesso** na casca isola os tecidos; **raízes profundas** alcançam a água; órgãos subterrâneos rebrotam.
- **Amazônia** não evoluiu com fogo. O solo é **pobre e arenoso**; os nutrientes estão na biomassa e na **serapilheira**, com decomposição rápida e absorção por raízes superficiais e micorrizas (ciclagem rápida e quase fechada).

### 5. Relações ecológicas
Harmônicas: **mutualismo** (ambos ganham, interdependência), protocooperação, comensalismo. Desarmônicas: predação, parasitismo, competição.

### 6. Poluentes
- **Biomagnificação**: substâncias não degradáveis e acumulativas (arsênio, mercúrio, DDT) **aumentam de concentração a cada nível trófico**; o topo é o mais contaminado.
- **Anfíbios** são indicadores de poluição: pele fina, úmida, vascularizada e **permeável** (respiração cutânea).
- **Carcinogênico**: agente que induz câncer, em geral por mutações que desregulam a divisão.

### 7. Oceanos
- **Acidificação**: $\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 \rightleftharpoons \text{H}^+ + \text{HCO}_3^-$; mais H⁺, pH menor, menos carbonato para esqueletos de $\text{CaCO}_3$.
- **Óleo na superfície**: bloqueia a luz e as trocas gasosas. As **zooxantelas** (algas simbiontes dos corais) não fazem fotossíntese; falta matéria orgânica e O₂ e o coral morre (além da toxicidade).`,
    formulas: [
      { tex: String.raw`\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}^+ + \text{HCO}_3^-`, meaning: md`Origem da acidificação.` },
      { tex: String.raw`\text{PPL} = \text{PPB} - \text{R}_{\text{produtores}}`, meaning: md`Produtividade primária líquida: o que sobra aos consumidores. Não zera no clímax.` },
      { tex: String.raw`\text{PLC} = \text{PPB} - \text{R}_{\text{comunidade}}`, meaning: md`Produtividade líquida da **comunidade** (descontada a respiração de todos): tende a zero no clímax, e a biomassa para de crescer.` },
    ],
    applications: [
      md`**Geografia**: biomas, queimadas, exploração de petróleo, COP30.`,
      md`**Química**: equilíbrio do CO₂ e pH.`,
      md`**Saúde**: contaminação por metais, câncer.`,
      md`**Evolução**: adaptações ao fogo.`,
    ],
    strategy: [
      md`Ache o conceito por trás da notícia e nomeie-o.`,
      md`Explique o mecanismo, não só a consequência.`,
      md`Em cadeia, use só organismos do texto e indique o nível.`,
    ],
    examples: [
      {
        title: 'Resistência do meio',
        prompt: md`Sem onças, uma população de capivaras cresce. Ela crescerá para sempre?`,
        steps: [md`Não.`, md`Alimento, espaço, competição e doenças limitam a população à capacidade de suporte.`],
      },
      {
        title: 'Biomagnificação',
        prompt: md`Por que golfinhos têm mais mercúrio que as sardinhas que comem?`,
        steps: [md`O mercúrio não é eliminado e se acumula.`, md`Cada nível consome muitos indivíduos do anterior: a concentração aumenta ao longo da cadeia.`],
      },
    ],
    discursive: {
      prompt: md`Após um incêndio, uma área de Cerrado se regenera em poucos anos. (a) Que tipo de sucessão ocorre? Justifique. (b) Cite duas adaptações das árvores do Cerrado ao fogo e à seca.`,
      modelAnswer: [md`(a) Secundária: já existem solo e banco de sementes e órgãos subterrâneos remanescentes.`, md`(b) Súber (cortiça) espesso na casca, que isola os tecidos do calor; raízes profundas que alcançam o lençol freático.`],
      scoring: [md`Sucessão secundária com justificativa.`, md`Duas adaptações nomeadas e explicadas.`],
    },
    patterns: [
      {
        title: 'Populações, cadeias e sucessão',
        questions: ['2022 q03', '2023 q03', '2024 q01'],
        asks: md`Cadeia com três níveis e nível do macaco; fator biótico e limite da densidade; característica dos pioneiros e como chegaram; biomassa e nichos no clímax; sucessão após fogo, súber, raízes e solo amazônico.`,
        solve: [md`Use organismos do texto.`, md`Resistência do meio e capacidade de suporte.`, md`No clímax a produtividade líquida da comunidade ≈ 0; mais estratos = mais nichos.`],
        distractors: md`Não há alternativas: perde-se ponto dizendo que a população "cresce sem limite" e que o solo amazônico é fértil.`,
      },
      {
        title: 'Poluentes e oceanos',
        questions: ['2025 q01', '2026 q01'],
        asks: md`Relação harmônica bactéria–anfíbio, pele permeável, biomagnificação e carcinogênico; gás da queima e acidificação; óleo e morte dos corais.`,
        solve: [md`Mutualismo.`, md`Concentração crescente por nível.`, md`CO₂ → H⁺; óleo bloqueia luz → zooxantelas param.`],
        distractors: md`Dizer que a concentração diminui ao longo da cadeia.`,
      },
    ],
    traps: [
      { trap: md`Dizer que a energia circula.`, fix: md`A matéria circula; a energia flui e se dissipa.` },
      { trap: md`Achar que floresta exuberante prova solo fértil.`, fix: md`Na Amazônia os nutrientes estão na biomassa.` },
    ],
  },

  {
    id: 'bio-celula-molecular',
    subject: 'Biologia',
    title: 'Célula e biologia molecular',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**, com 6 questões: célula diploide, centrômeros e timina radioativa (2022), enzimas que degradam poliestireno e plasmídeo (2023), síntese proteica em procariotos e eucariotos (2024), ciclo celular com fase S, citocinese e G0 (2025), criptobiose com osmose, glicólise e temperatura (2025), dogma central, código degenerado e splicing alternativo (2026).`,
    explanation: md`### 1. Cromossomos e ploidia
- **Diploide (2n)**: cromossomos em **pares de homólogos** (um paterno, um materno). Na figura, conte pares de mesmo tamanho e forma.
- **Centrômeros** = número de cromossomos (um por cromossomo, duplicado ou não).
- Após a fase S, cada cromossomo tem **duas cromátides-irmãs**: na metáfase, 2n cromossomos = 4n cromátides.

### 2. Replicação semiconservativa
Na **fase S**, a **DNA polimerase** copia o DNA; cada molécula-filha tem **uma fita antiga e uma nova**. Com timina radioativa no meio, **todas** as cromátides-irmãs saem marcadas (cada uma tem uma fita nova).

### 3. Ciclo celular
G1 (crescimento) → **S** (replicação) → G2 → **M** (mitose + citocinese). Células somáticas se dividem por **mitose**. **Citocinese** animal: anel contrátil de **microfilamentos de actina** (com miosina) estrangula a célula. **G0**: célula sai do ciclo, fica diferenciada e não se divide (neurônios, músculo cardíaco).

### 4. Dogma central e síntese proteica
DNA → (**replicação**) DNA; DNA → (**transcrição**) RNAm; RNAm → (**tradução**) proteína, no **ribossomo**.
- **Procariotos**: sem núcleo; transcrição no citoplasma (nucleoide), tradução **simultânea**; vários ribossomos lendo o **mesmo RNAm** (polirribossomo) fazem proteínas **iguais**.
- **Eucariotos**: transcrição no núcleo; **carioteca** separa DNA e citoplasma; o pré-RNAm passa por **splicing**: **íntrons removidos**, éxons unidos — por isso o RNAm maduro é menor.
- **Splicing alternativo**: éxons combinados de formas diferentes → proteínas diferentes do mesmo gene.
- **Código degenerado**: vários códons por aminoácido → mutação silenciosa.
- **Código universal**: bactéria lê gene de outra espécie (transgenia).
- **Mutação herdável**: copiada na **replicação** em células da linhagem germinativa.

### 5. Engenharia genética
**Plasmídeo**: DNA circular extra das bactérias. Para produzir uma proteína de outra espécie, é preciso **identificar o gene** (a sequência) e inseri-lo com **enzimas de restrição** (cortam em sequências específicas) e ligase.

### 6. Enzimas
Proteínas catalisadoras, específicas. Temperatura e pH alteram a atividade; frio **reduz** a velocidade (menos colisões), calor excessivo **desnatura**.

### 7. Membrana e metabolismo
- **Osmose**: água atravessa a membrana do meio menos concentrado para o mais concentrado (aquaporinas).
- **Glicólise**: no **citosol**, glicose → 2 ácidos pirúvicos (2 ATP líquidos), sem O₂.`,
    applications: [
      md`**Biotecnologia**: insulina recombinante, transgênicos, plasmídeos.`,
      md`**Saúde**: câncer, quimioterápicos que agem na fase S.`,
      md`**Ambiente**: enzimas que degradam plásticos.`,
      md`**Química**: ligações de hidrogênio no DNA, catálise.`,
    ],
    strategy: [
      md`Diga a etapa (replicação, transcrição, tradução) e o local.`,
      md`Diga se é procarioto ou eucarioto e o que muda.`,
      md`Conte cromossomos por centrômeros e cromátides pela fase.`,
    ],
    examples: [
      {
        title: 'Contagem',
        prompt: md`Célula 2n = 8 na metáfase mitótica: quantos centrômeros e quantas cromátides?`,
        steps: [md`8 centrômeros (8 cromossomos).`, md`16 cromátides (cada cromossomo duplicado).`],
      },
      {
        title: 'Mutação silenciosa',
        prompt: md`GCU muda para GCC, ambos alanina. O que acontece com a proteína?`,
        steps: [md`Mesmo aminoácido: proteína inalterada (código degenerado).`],
      },
    ],
    discursive: {
      prompt: md`Para produzir insulina humana, insere-se o gene humano num plasmídeo bacteriano. (a) Por que é preciso usar o DNA complementar ao RNAm maduro, e não o gene inteiro do cromossomo? (b) Por que a bactéria produz a mesma proteína que a célula humana?`,
      modelAnswer: [md`(a) O gene humano tem íntrons, e a bactéria não faz splicing; o DNA feito a partir do RNAm maduro já tem só os éxons.`, md`(b) O código genético é universal: a bactéria lê os mesmos códons e une os mesmos aminoácidos.`],
      scoring: [md`Relaciona íntrons à falta de splicing em procariotos.`, md`Universalidade do código.`],
    },
    patterns: [
      {
        title: 'Cromossomos, replicação e ciclo',
        questions: ['2022 q05', '2025 q02'],
        asks: md`Por que a célula é diploide, centrômeros, cromátides marcadas e replicação semiconservativa; divisão das somáticas, fase da DNA polimerase, microfilamentos na citocinese e G0.`,
        solve: [md`Pares de homólogos; centrômeros = cromossomos.`, md`Toda cromátide tem fita nova.`, md`Fase S; anel de actina; G0 sem divisão.`],
        distractors: md`Não há alternativas: perde-se ponto contando cromátides como cromossomos e dizendo que só metade sai marcada.`,
      },
      {
        title: 'Síntese proteica, código e engenharia genética',
        questions: ['2024 q02', '2026 q06', '2023 q01'],
        asks: md`Local da transcrição em procarioto e o que distingue as células; proteínas iguais e RNAm maduro menor; etapa da mutação herdável, ribossomo, código degenerado e splicing alternativo; função das enzimas, fator abiótico, gene a descobrir e universalidade.`,
        solve: [md`Citoplasma; carioteca.`, md`Mesmo RNAm; íntrons removidos.`, md`Replicação; degenerado; splicing alternativo.`, md`Catálise; temperatura ou pH; gene; universal.`],
        distractors: md`Dizer que a mutação passa aos filhos na tradução.`,
      },
      {
        title: 'Membrana e metabolismo',
        questions: ['2025 q03'],
        asks: md`Transporte que reidratou as células, etapa que gera ácido pirúvico e velocidade das enzimas perto de 0 °C.`,
        solve: [md`Osmose.`, md`Glicólise, no citosol.`, md`Frio reduz a velocidade.`],
        distractors: md`Chamar de "transporte ativo" a entrada de água e dizer que o frio desnatura.`,
      },
    ],
    traps: [
      { trap: md`Replicação conservativa.`, fix: md`É semiconservativa.` },
      { trap: md`Atribuir íntrons a procariotos.`, fix: md`Procariotos não têm íntrons nem splicing.` },
      { trap: md`Dizer que o frio desnatura enzimas.`, fix: md`O frio reduz a atividade; o calor excessivo desnatura.` },
    ],
  },

  {
    id: 'bio-evolucao-classificacao',
    subject: 'Biologia',
    title: 'Evolução e classificação',
    years: [2022, 2023],
    howItFalls: md`Caiu em 2022 (cladograma dos moluscos: função da rádula e se é homóloga) e 2023 (especiação no Havaí: montar um cladograma pelas idades das ilhas, mecanismos pós-zigóticos e isolamento geográfico). O aposematismo de 2024 entrou junto com a genética.`,
    explanation: md`### 1. Homologia e analogia
- **Homólogas**: mesma origem embrionária e ancestral comum, funções podendo diferir (rádula nos moluscos; braço humano e asa de morcego).
- **Análogas**: mesma função, origens diferentes (asa de inseto e de ave): convergência.
- No cladograma, uma estrutura que aparece **na base**, no ancestral comum, e é herdada pelos ramos é **homóloga**. Perder depois (bivalves sem rádula) não muda isso.

### 2. Cladogramas
Nós = ancestrais comuns; grupos que se unem no nó mais recente são **grupos-irmãos**. **Novidades evolutivas** marcadas num ramo valem para todos os descendentes daquele ponto.

### 3. Especiação
- **Alopátrica**: **isolamento geográfico** (mar entre ilhas) interrompe o fluxo gênico; mutação, seleção em ambientes diferentes e deriva acumulam diferenças até o **isolamento reprodutivo**.
- **Simpátrica**: sem barreira geográfica.
- Em arquipélagos de origem vulcânica, ilhas **mais antigas** foram colonizadas primeiro: suas espécies se separaram antes e ficam nos ramos **mais externos** do cladograma.

### 4. Isolamento reprodutivo
- **Pré-zigótico**: impede a fecundação (comportamento, época, mecânico, habitat, gamético).
- **Pós-zigótico**: zigoto formado, mas **inviabilidade do híbrido**, **esterilidade do híbrido** ou **degeneração da F₂**.

### 5. Seleção natural e aposematismo
**Aposematismo**: coloração de advertência em organismos impalatáveis; predadores aprendem a evitá-los, os portadores sobrevivem mais e a frequência do alelo aumenta por seleção natural.`,
    applications: [
      md`**Classificação**: sistemática filogenética e nomenclatura.`,
      md`**Genética**: frequências alélicas e seleção.`,
      md`**Geografia**: arquipélagos vulcânicos e biogeografia.`,
    ],
    strategy: [
      md`Homóloga: aponte o ancestral comum no cladograma.`,
      md`Em ilhas, ordene pela idade: mais antiga, ramo mais externo.`,
      md`Especiação: barreira → sem fluxo gênico → diferenças → isolamento reprodutivo.`,
    ],
    examples: [
      {
        title: 'Homologia',
        prompt: md`Asa de morcego e nadadeira de golfinho são homólogas ou análogas?`,
        steps: [md`Homólogas: mesmos ossos, mesma origem em mamíferos, funções diferentes.`],
      },
      {
        title: 'Pós-zigótico',
        prompt: md`Cite um mecanismo pós-zigótico de isolamento.`,
        steps: [md`Esterilidade do híbrido (mula).`],
      },
    ],
    discursive: {
      prompt: md`Duas espécies de lagarto vivem em ilhas de 4 e 1 milhão de anos, e uma terceira no continente de onde vieram. (a) Que fator permitiu a especiação, e por que ele é fundamental? (b) Cite um mecanismo de isolamento pós-zigótico.`,
      modelAnswer: [md`(a) O isolamento geográfico pelo mar, que interrompe o fluxo gênico; cada população acumula diferenças (mutação, seleção, deriva) até se isolar reprodutivamente.`, md`(b) Inviabilidade ou esterilidade do híbrido.`],
      scoring: [md`Isolamento geográfico e fluxo gênico.`, md`Mecanismo pós-zigótico correto.`],
    },
    patterns: [
      {
        title: 'Cladograma e homologia',
        questions: ['2022 q02', '2023 q08'],
        asks: md`Simetria, cefalópode, função da rádula e se é homóloga; preencher um cladograma pelas idades das ilhas, mecanismo pós-zigótico e fator da especiação alopátrica.`,
        solve: [md`Estrutura na base = homóloga.`, md`Ilha mais antiga = ramo externo.`, md`Isolamento geográfico interrompe o fluxo gênico.`],
        distractors: md`Não há alternativas: perde-se ponto chamando a rádula de análoga por ter sido perdida nos bivalves.`,
      },
    ],
    traps: [
      { trap: md`Achar que estrutura perdida num grupo deixa de ser homóloga.`, fix: md`Homologia é origem comum.` },
      { trap: md`Confundir pré e pós-zigótico.`, fix: md`Pós-zigótico: o zigoto se forma.` },
    ],
  },

  {
    id: 'bio-reproducao-parasitas',
    subject: 'Biologia',
    title: 'Reprodução humana, embriologia e parasitoses',
    years: [2022, 2023, 2024, 2026],
    howItFalls: md`Caiu em 4 anos: contraceptivo em gel que altera o pH vaginal e contraceptivos hormonais (2022), ciclo do *Trypanosoma cruzi* e lesão cardíaca (2023), por que "ovulação" não é o termo adequado (2024), ciclo do *Ascaris* com fase pulmonar (2024), notocorda, tubo neural, celoma e vírus que atravessam a placenta (2026).`,
    explanation: md`### 1. Reprodução humana
- **Fecundação**: na **tuba uterina**, no terço próximo ao ovário.
- **pH vaginal** saudável: ácido (cerca de 4), dificulta microrganismos.
- O ovário libera um **ovócito secundário** parado na **metáfase II**; a meiose II só termina — formando o **óvulo** — quando o espermatozoide penetra. Por isso "ovulação" é um nome impreciso.
- **Contraceptivos hormonais**: estrógeno e progesterona (sintéticos) inibem, por **retroalimentação negativa**, FSH e LH da hipófise: não há ovulação. A progesterona também espessa o muco cervical.

### 2. Embriologia
- **Notocorda** (mesoderma) induz o ectoderma acima a formar o **tubo neural** (encéfalo e medula).
- No ser humano, a notocorda é substituída pela **coluna vertebral**; restos dela formam o núcleo pulposo dos discos.
- **Celoma**: cavidade revestida inteiramente por mesoderme.
- **Placenta**: trocas entre mãe e feto; alguns vírus (rubéola, zika) a **atravessam** pelo sangue materno e causam malformações.

### 3. Doença de Chagas
- *Trypanosoma cruzi*, protozoário flagelado. Vetor: **barbeiro**.
- Transmissão: o barbeiro pica e **defeca**; as fezes com tripomastigotas entram pela lesão ou mucosas quando a pessoa coça. Também por alimentos (açaí, caldo de cana) e transfusão.
- Dentro das células, **amastigotas** (sem flagelo livre) se multiplicam; no coração, destroem fibras e geram inflamação e **fibrose**: cardiomegalia, arritmias, insuficiência cardíaca na fase crônica.

### 4. Ascaridíase
- *Ascaris lumbricoides*, filo **Nematoda**.
- Transmissão: **ingestão de ovos** em água ou alimento contaminado por fezes (falta de saneamento).
- O ovo eclode no **intestino delgado**; as larvas atravessam a parede, vão pelo sangue a fígado, coração e **pulmões**; nos alvéolos causam inflamação (pneumonia, síndrome de Loeffler); sobem pela traqueia, são deglutidas e voltam ao intestino, onde viram adultas.

### 5. Prevenção
Saneamento básico, higiene dos alimentos, melhoria das casas de pau a pique (barbeiro), controle do vetor.`,
    applications: [
      md`**Saúde pública**: saneamento, vigilância de vetores, pré-natal (rubéola, zika).`,
      md`**Fisiologia**: hormônios e retroalimentação.`,
      md`**Geografia**: doenças ligadas à pobreza e à falta de saneamento.`,
    ],
    strategy: [
      md`Em ciclo de parasita, diga hospedeiro, forma e caminho no corpo.`,
      md`Em transmissão, cite o mecanismo (fezes do barbeiro, ingestão de ovos).`,
      md`Em reprodução, use o termo exato (ovócito secundário, tuba uterina).`,
    ],
    examples: [
      {
        title: 'Ovulação',
        prompt: md`O que o ovário libera na ovulação, e quando se forma o óvulo?`,
        steps: [md`Um ovócito secundário em metáfase II.`, md`O óvulo se forma quando a meiose II se completa, na fecundação.`],
      },
      {
        title: 'Placenta',
        prompt: md`Como o vírus da zika chega ao embrião?`,
        steps: [md`Pelo sangue materno, atravessando a placenta para a circulação fetal.`],
      },
    ],
    discursive: {
      prompt: md`A esquistossomose e a ascaridíase são doenças ligadas à falta de saneamento. (a) A que filo pertence o *Ascaris* e como ele é transmitido? (b) Por que a ascaridíase pode causar sintomas pulmonares?`,
      modelAnswer: [md`(a) Nematoda; por ingestão de ovos em água ou alimentos contaminados por fezes humanas.`, md`(b) As larvas eclodem no intestino, atravessam a parede, vão pelo sangue aos pulmões e inflamam os alvéolos antes de subir pela traqueia e voltar ao intestino.`],
      scoring: [md`Filo e transmissão corretos.`, md`Ciclo pulmonar explicado.`],
    },
    patterns: [
      {
        title: 'Parasitoses',
        questions: ['2023 q02', '2024 q07'],
        asks: md`Doença, fase sem estrutura locomotora, lesão cardíaca e transmissão pelo barbeiro; filo, transmissão, local de eclosão e pneumonia.`,
        solve: [md`Amastigota intracelular sem flagelo.`, md`Fibras cardíacas destruídas → fibrose.`, md`Fezes do barbeiro; ovos ingeridos; ciclo pulmonar.`],
        distractors: md`Não há alternativas: perde-se ponto dizendo que o barbeiro transmite "pela picada" sem as fezes.`,
      },
      {
        title: 'Reprodução e embriologia',
        questions: ['2022 q06', '2024 q06', '2026 q02'],
        asks: md`Local da fecundação e pH vaginal; hormônio e ação do contraceptivo; por que "ovulação" é impreciso; tubo neural, celoma, substituto da notocorda e vírus pela placenta.`,
        solve: [md`Tuba uterina; ácido.`, md`Retroalimentação negativa de FSH e LH.`, md`Ovócito secundário; meiose II na fecundação.`, md`Coluna vertebral; placenta.`],
        distractors: md`Pôr a fecundação no útero e dizer que o ovário libera um óvulo.`,
      },
    ],
    traps: [
      { trap: md`Dizer que a fecundação ocorre no útero.`, fix: md`Ocorre na tuba uterina.` },
      { trap: md`Dizer que o barbeiro transmite pela saliva.`, fix: md`Transmite pelas fezes contaminadas.` },
    ],
  },
];
