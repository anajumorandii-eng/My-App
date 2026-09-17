import type { SceneEntry } from '../types';

/** Cenas de Física. As 14 entradas abaixo seguem a atribuição de família fixada em
 *  docs/visual-personalizado/16-familias-fisica.md (Parte A: 11 capítulos; Parte B:
 *  3 capítulos). Toda `quote` é trecho literal de uma seção real de
 *  src/data/deepSummaryContent.json para aquele chapterId — nunca paráfrase. */
export const fisica: SceneEntry[] = [
  // Parte A — grade-de-eixos (1 capítulo)
  {
    chapterId: 'summary-fisica-aceleracao-vetorial',
    family: 'grade-de-eixos',
    question: 'Que tipo de movimento resulta do cruzamento entre presença de aceleração tangencial e presença de aceleração centrípeta?',
    eixos: {
      a: { nome: 'aceleração tangencial', polos: ['nula', 'não nula'] },
      b: { nome: 'aceleração centrípeta', polos: ['nula', 'não nula'] },
    },
    items: [
      {
        label: 'MRU',
        claim: 'nem a aceleração tangencial nem a centrípeta estão presentes',
        section: 'Ler cada movimento',
        quote: 'Num movimento retilíneo uniforme, tanto a aceleração tangencial quanto a centrípeta são nulas — não há mudança de módulo (movimento uniforme) nem mudança de direção (movimento retilíneo, sem qualquer curvatura de trajetória), e a aceleração vetorial resultante total é, portanto, completamente nula.',
        celula: { eixoA: 0, eixoB: 0 },
      },
      {
        label: 'MRUV',
        claim: 'a aceleração tangencial está presente, mas a centrípeta continua ausente',
        section: 'Ler cada movimento',
        quote: 'Num movimento retilíneo uniformemente variado, a aceleração tangencial é constante e não nula (o módulo da velocidade muda de forma constante e uniforme ao longo do tempo), enquanto a aceleração centrípeta é sempre nula (a trajetória permanece retilínea, sem qualquer curvatura, então não há mudança de direção envolvida em momento algum).',
        celula: { eixoA: 1, eixoB: 0 },
      },
      {
        label: 'MCU',
        claim: 'a aceleração tangencial está ausente, mas a centrípeta está presente',
        section: 'Ler cada movimento',
        quote: 'Num movimento circular uniforme, a situação se inverte exatamente: a aceleração tangencial é nula (o módulo da velocidade permanece constante durante todo o percurso circular), mas a aceleração centrípeta é constante em módulo e sempre não nula, sempre apontando para o centro exato da circunferência descrita, mudando continuamente de direção conforme o corpo avança ao longo da trajetória circular, mas nunca de módulo.',
        celula: { eixoA: 0, eixoB: 1 },
      },
      {
        label: 'MCUV',
        claim: 'as duas componentes, tangencial e centrípeta, estão presentes simultaneamente',
        section: 'Ler cada movimento',
        quote: 'Num movimento circular uniformemente variado, ambas as componentes estão simultaneamente presentes e são não nulas.',
        celula: { eixoA: 1, eixoB: 1 },
      },
    ],
  },
  // Parte A — tipologia (7 capítulos)
  {
    chapterId: 'summary-fisica-forca-e-seus-tipos',
    family: 'tipologia',
    question: 'Em que tipos as forças mais cobradas em vestibular se classificam, conforme sua origem física?',
    items: [
      {
        label: 'Peso',
        claim: 'a força gravitacional que a Terra exerce sobre um corpo, sempre vertical e para baixo',
        section: 'As forças que aparecem no vestibular',
        quote: 'o peso é a força gravitacional que a Terra exerce sobre um corpo, P=mg, sempre vertical e para baixo',
      },
      {
        label: 'Normal',
        claim: 'a força de contato que uma superfície exerce perpendicularmente a si mesma, nunca necessariamente vertical',
        section: 'As forças que aparecem no vestibular',
        quote: 'a força normal é a força de contato que uma superfície exerce perpendicularmente a si mesma sobre um corpo apoiado nela, sempre perpendicular à superfície de contato, nunca necessariamente vertical',
      },
      {
        label: 'Tração',
        claim: 'a força que um fio ou corda esticada exerce, sempre ao longo do fio, puxando, nunca empurrando',
        section: 'As forças que aparecem no vestibular',
        quote: 'a tração é a força que um fio ou corda esticada exerce sobre o corpo preso a ela, sempre ao longo do fio, puxando (nunca empurrando, já que fios não resistem à compressão)',
      },
      {
        label: 'Atrito',
        claim: 'a força de contato paralela à superfície, que se opõe ao movimento relativo ou à tendência dele',
        section: 'As forças que aparecem no vestibular',
        quote: 'o atrito é a força de contato paralela à superfície, que se opõe ao movimento relativo (atrito cinético) ou à tendência de movimento relativo (atrito estático) entre duas superfícies em contato',
      },
      {
        label: 'Elástica',
        claim: 'dada pela lei de Hooke, é a força restauradora exercida por uma mola deformada',
        section: 'As forças que aparecem no vestibular',
        quote: 'a força elástica, dada pela lei de Hooke F=kx, é a força restauradora exercida por uma mola deformada, proporcional à deformação x e sempre no sentido de restaurar o comprimento natural da mola',
      },
    ],
  },
  {
    chapterId: 'summary-fisica-colisoes',
    family: 'tipologia',
    question: 'Em que três tipos as colisões se classificam, conforme o que acontece com a energia cinética?',
    nota: 'a maioria das colisões reais do dia a dia, de carros a bolas que quicam perdendo altura, se encaixa nessa categoria intermediária',
    items: [
      {
        label: 'Elástica',
        claim: 'a energia cinética total se conserva exatamente, e os corpos se separam com a mesma energia cinética total que tinham antes',
        section: 'Os três tipos',
        quote: 'Na colisão perfeitamente elástica, a energia cinética total se conserva exatamente: os corpos se separam depois do choque com a mesma energia cinética total que tinham antes',
      },
      {
        label: 'Perfeitamente inelástica',
        claim: 'os corpos permanecem juntos após o choque, e a perda de energia cinética é máxima entre todas as colisões possíveis com aquelas massas e velocidades',
        section: 'Os três tipos',
        quote: 'Na colisão perfeitamente inelástica, os corpos permanecem juntos após o choque, movendo-se com velocidade comum, e é o tipo em que a perda de energia cinética é máxima dentre todas as colisões possíveis com aquelas massas e velocidades iniciais',
      },
      {
        label: 'Parcialmente elástica',
        claim: 'os corpos se separam após o choque, mas com energia cinética total menor que a inicial',
        section: 'Os três tipos',
        quote: 'as colisões parcialmente elásticas (ou inelásticas), em que os corpos se separam após o choque, mas com energia cinética total menor que a inicial',
      },
    ],
  },
  {
    chapterId:
      'summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares',
    family: 'tipologia',
    question: 'Que fontes de geração elétrica compartilham o mesmo princípio final, e qual delas é a exceção?',
    nota: 'Na energia solar fotovoltaica, o princípio é radicalmente diferente de todas as demais fontes mencionadas anteriormente: não há turbina nem gerador rotativo algum envolvido no processo',
    items: [
      {
        label: 'Hidrelétrica',
        claim: 'a energia potencial gravitacional da água represada é convertida em energia cinética que gira uma turbina hidráulica ligada ao gerador',
        section: 'Hidrelétrica e térmica',
        quote: "Na hidrelétrica, a energia potencial gravitacional da água represada numa altura elevada é convertida em energia cinética conforme a água cai através de dutos (as chamadas quedas-d'água controladas), e essa energia cinética da água em movimento rápido gira as pás de uma turbina hidráulica, cujo eixo está diretamente conectado ao gerador elétrico correspondente",
      },
      {
        label: 'Termelétrica',
        claim: 'a energia química do combustível é liberada por combustão na forma de calor, que forma vapor e gira uma turbina a vapor',
        section: 'Hidrelétrica e térmica',
        quote: 'Na termelétrica (seja movida a combustível fóssil, como carvão ou gás natural, seja a biomassa), a energia química contida no combustível é liberada por combustão na forma de calor, que aquece água até formar vapor sob alta pressão',
      },
      {
        label: 'Eólica',
        claim: 'a energia cinética do vento gira diretamente as pás da turbina eólica, sem etapa térmica intermediária',
        section: 'Eólica, solar e nuclear',
        quote: 'Na eólica, a energia cinética do vento em movimento gira diretamente as pás de um grande cata-vento (a turbina eólica propriamente dita), cujo eixo está conectado ao gerador elétrico correspondente',
      },
      {
        label: 'Solar fotovoltaica',
        claim: 'a exceção nomeada: não há turbina nem gerador rotativo, a luz converte-se em corrente elétrica diretamente pelo efeito fotovoltaico',
        section: 'Eólica, solar e nuclear',
        quote: 'Na energia solar fotovoltaica, o princípio é radicalmente diferente de todas as demais fontes mencionadas anteriormente: não há turbina nem gerador rotativo algum envolvido no processo',
      },
      {
        label: 'Nuclear',
        claim: 'segue o mesmo princípio da termelétrica, mas a fonte de calor vem da fissão nuclear controlada, não da combustão química',
        section: 'Eólica, solar e nuclear',
        quote: 'a usina nuclear segue exatamente o mesmo princípio geral de conversão da termelétrica convencional (calor gerando vapor, que gira uma turbina a vapor conectada a um gerador), mas a fonte de calor não vem da combustão química de um combustível fóssil qualquer, e sim da fissão nuclear controlada de átomos pesados',
      },
    ],
  },
  {
    // Este tópico é excluído da geração automática (excludeTopics em
    // physicsInteractiveSummaries.ts) e definido manualmente em
    // interactiveSummaries.ts com o id legado 'fis-termologia-calor', não
    // 'summary-fisica-...' — usar o id do catálogo real, não o padrão.
    chapterId: 'fis-termologia-calor',
    family: 'tipologia',
    question: 'Por quais três mecanismos fisicamente distintos o calor se transfere?',
    nota: 'é o único dos três mecanismos que não exige nenhum meio material',
    items: [
      {
        label: 'Condução',
        claim: 'ocorre por colisões moleculares sucessivas dentro de um material ou entre materiais em contato, sem transporte macroscópico de matéria',
        section: 'Condução, convecção e irradiação',
        quote: 'Condução ocorre por colisões moleculares sucessivas dentro de um mesmo material ou entre materiais em contato direto, sem transporte macroscópico de matéria',
      },
      {
        label: 'Convecção',
        claim: 'ocorre em fluidos pelo movimento macroscópico de porções inteiras do próprio fluido, criando correntes de convecção',
        section: 'Condução, convecção e irradiação',
        quote: 'Convecção ocorre em fluidos (líquidos e gases) através do movimento macroscópico de porções inteiras do próprio fluido: partes mais quentes, geralmente menos densas, sobem, enquanto partes mais frias, mais densas, descem, criando correntes de convecção que transportam calor por deslocamento físico de matéria',
      },
      {
        label: 'Irradiação',
        claim: 'o único dos três mecanismos que não exige nenhum meio material, capaz de atravessar o vácuo',
        section: 'Condução, convecção e irradiação',
        quote: 'Irradiação (ou radiação térmica) é o único dos três mecanismos que não exige nenhum meio material',
      },
    ],
  },
  {
    chapterId: 'summary-fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas',
    family: 'tipologia',
    question: 'Que transformações particulares surgem quando uma das três variáveis de estado do gás ideal é mantida fixa?',
    nota: 'a proporcionalidade direta ou inversa só vale exatamente porque a terceira variável está sendo mantida estritamente constante — introduzir qualquer variação nela invalida a lei simplificada, exigindo o retorno à equação de Clapeyron completa',
    items: [
      {
        label: 'Isotérmica',
        claim: 'temperatura constante; pressão e volume variam de forma inversamente proporcional, pela lei de Boyle-Mariotte',
        section: 'As transformações particulares',
        quote: 'Na transformação isotérmica (temperatura constante), a lei de Boyle-Mariotte estabelece que P×V = constante, então pressão e volume variam de forma inversamente proporcional',
      },
      {
        label: 'Isobárica',
        claim: 'pressão constante; volume e temperatura absoluta são diretamente proporcionais, pela lei de Gay-Lussac',
        section: 'As transformações particulares',
        quote: 'Na transformação isobárica (pressão constante), a lei de Gay-Lussac (também atribuída a Charles) dá V/T = constante, então volume e temperatura absoluta são diretamente proporcionais',
      },
      {
        label: 'Isocórica',
        claim: 'volume constante; pressão e temperatura absoluta são diretamente proporcionais',
        section: 'As transformações particulares',
        quote: 'Na transformação isocórica ou isovolumétrica (volume constante), P/T = constante, então pressão e temperatura absoluta são diretamente proporcionais',
      },
    ],
  },
  {
    chapterId:
      'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares',
    family: 'tipologia',
    question: 'Como a primeira lei da termodinâmica se simplifica em cada tipo de transformação particular?',
    nota: 'isotérmica, isovolumétrica, isobárica e adiabática, cada uma com sua simplificação característica',
    items: [
      {
        label: 'Isotérmica',
        claim: 'ΔU=0, e a primeira lei se reduz a Q=τ: todo o calor recebido se converte integralmente em trabalho',
        section: 'Isotérmica e isovolumétrica',
        quote: 'Na transformação isotérmica (temperatura constante), como a energia interna de um gás ideal depende exclusivamente da temperatura, ΔU=0, e a primeira lei se reduz a Q=τ: todo o calor recebido se converte integralmente em trabalho realizado pelo gás',
      },
      {
        label: 'Isovolumétrica',
        claim: 'o trabalho realizado pelo gás é nulo, e a primeira lei se reduz a ΔU=Q',
        section: 'Isotérmica e isovolumétrica',
        quote: 'Na transformação isovolumétrica (ou isocórica, volume constante), como o volume do gás não muda, ele não pode empurrar nada (não há deslocamento de um êmbolo ou fronteira móvel), então o trabalho realizado pelo gás é nulo, τ=0, e a primeira lei se reduz a ΔU=Q',
      },
      {
        label: 'Isobárica',
        claim: 'calor, trabalho e variação de energia interna são todos diferentes de zero simultaneamente, com τ=P×ΔV',
        section: 'Isobárica e adiabática',
        quote: 'Na transformação isobárica (pressão constante), tanto o calor trocado quanto o trabalho realizado e a variação de energia interna são, em geral, todos diferentes de zero simultaneamente, e o trabalho realizado pelo gás numa expansão (ou compressão) a pressão constante é calculado diretamente por τ=P×ΔV',
      },
      {
        label: 'Adiabática',
        claim: 'sem troca de calor com o ambiente, a primeira lei se reduz a ΔU=−τ',
        section: 'Isobárica e adiabática',
        quote: 'Na transformação adiabática (sem troca de calor com o ambiente, Q=0, seja porque o sistema está termicamente isolado, seja porque o processo ocorre rápido demais para haver tempo de troca térmica significativa), a primeira lei se reduz a ΔU=−τ',
      },
    ],
  },
  {
    chapterId: 'summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes',
    family: 'tipologia',
    question: 'Quais são os três processos clássicos de eletrização, e como cada um redistribui elétrons?',
    items: [
      {
        label: 'Atrito',
        claim: 'dois materiais diferentes trocam elétrons por causa de suas diferentes afinidades eletrônicas, ficando com cargas de mesmo módulo e sinais opostos',
        section: 'Os três processos',
        quote: 'Por atrito, dois materiais diferentes, ao serem esfregados um contra o outro, trocam elétrons por causa de suas diferentes afinidades eletrônicas — um material fica positivo e o outro, negativo, sempre com cargas de mesmo módulo',
      },
      {
        label: 'Contato',
        claim: 'um corpo eletrizado toca um corpo neutro e elétrons fluem entre eles até atingirem o mesmo potencial elétrico',
        section: 'Os três processos',
        quote: 'Por contato, um corpo eletrizado toca um corpo neutro (ou com carga diferente) e elétrons fluem entre eles até que ambos atinjam o mesmo potencial elétrico',
      },
      {
        label: 'Indução',
        claim: 'um corpo eletrizado se aproxima sem tocar, separando cargas dentro do condutor neutro sem alterar sua carga total',
        section: 'Os três processos',
        quote: 'Por indução, um corpo eletrizado se aproxima de um corpo neutro condutor sem tocá-lo, e o campo elétrico do primeiro repele os elétrons livres do condutor neutro para o lado mais distante (se o indutor for negativo) ou os atrai para o lado mais próximo (se for positivo), separando cargas dentro do condutor neutro sem alterar sua carga total',
      },
    ],
  },
  // Parte A — criterios-conjuntivos (1 capítulo)
  {
    chapterId: 'summary-fisica-estatica',
    family: 'criterios-conjuntivos',
    question: 'Que condições precisam se reunir, simultaneamente, para que um corpo extenso esteja em equilíbrio estático?',
    items: [
      {
        label: 'Translação',
        claim: 'a resultante de todas as forças que atuam sobre o corpo precisa ser nula',
        section: 'Parado não é simples',
        quote: 'a resultante de todas as forças que atuam sobre ele é nula (equilíbrio de translação, o mesmo critério usado para um ponto material)',
      },
      {
        label: 'Rotação',
        claim: 'a resultante de todos os torques em relação a qualquer ponto também precisa ser nula',
        section: 'Parado não é simples',
        quote: 'a resultante de todos os torques (momentos de força) em relação a qualquer ponto também é nula (equilíbrio de rotação)',
      },
      {
        label: 'Um critério só não basta',
        claim: 'forças perfeitamente equilibradas ainda podem deixar o corpo girar, se estiverem aplicadas em pontos diferentes de forma a criar torque resultante',
        section: 'Parado não é simples',
        quote: 'pode ter forças perfeitamente equilibradas e ainda assim começar a girar, se essas forças estiverem aplicadas em pontos diferentes de forma a criar um torque resultante não nulo',
      },
    ],
  },
  // Parte A — cadeia-de-derivacao (2 capítulos)
  {
    chapterId: 'summary-fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos',
    family: 'cadeia-de-derivacao',
    question: 'Como a dilatação superficial e a volumétrica se derivam diretamente da dilatação linear?',
    items: [
      {
        label: 'Linear',
        claim: 'mede a variação de comprimento numa única direção, base de toda a cadeia',
        section: 'As três dilatações',
        quote: 'A dilatação linear, ΔL = L₀×α×ΔT, mede a variação de comprimento numa única direção, com α o coeficiente de dilatação linear do material.',
      },
      {
        label: 'Superficial',
        claim: 'o coeficiente superficial vale o dobro do linear, decorrência direta de expandir (L₀+ΔL)²',
        section: 'As três dilatações',
        quote: 'o coeficiente superficial vale o dobro do linear, β = 2α — essa relação não é uma coincidência numérica, mas decorre diretamente de expandir (L₀+ΔL)² e desprezar o termo de segunda ordem em ΔL',
      },
      {
        label: 'Volumétrica',
        claim: 'pela mesma lógica, o coeficiente volumétrico é o triplo do linear, porque o volume envolve três dimensões lineares',
        section: 'As três dilatações',
        quote: 'Pela mesma lógica, a dilatação volumétrica, ΔV = V₀×γ×ΔT, tem coeficiente γ = 3α, o triplo do linear, porque volume envolve três dimensões lineares multiplicadas.',
      },
    ],
  },
  {
    chapterId: 'summary-fisica-calor-sensivel-e-calor-latente',
    family: 'cadeia-de-derivacao',
    question: 'Por que transformar gelo abaixo de 0°C em água líquida acima de 0°C exige três etapas sequenciais e não uma só?',
    items: [
      {
        label: 'Etapa 1: aquecer o gelo',
        claim: 'aquecimento sensível do gelo desde a temperatura inicial até atingir exatamente 0°C',
        section: 'Gelo até água líquida',
        quote: 'Primeira etapa: aquecimento sensível do gelo desde sua temperatura inicial (abaixo de 0°C) até atingir exatamente 0°C, usando a equação de calor sensível com o calor específico do gelo.',
      },
      {
        label: 'Etapa 2: fundir o gelo',
        claim: 'fusão completa do gelo a 0°C, sem qualquer variação de temperatura durante toda a etapa',
        section: 'Gelo até água líquida',
        quote: 'Segunda etapa: fusão completa do gelo a 0°C, transformando-o inteiramente em água líquida ainda a essa mesma temperatura de 0°C (sem qualquer variação de temperatura durante toda essa segunda etapa específica), usando a equação de calor latente de fusão.',
      },
      {
        label: 'Etapa 3: aquecer a água líquida',
        claim: 'aquecimento sensível da água já formada, desde 0°C até a temperatura final, só possível depois de a fusão terminar',
        section: 'Gelo até água líquida',
        quote: 'Terceira etapa: aquecimento sensível da água líquida já formada, desde 0°C até a temperatura final desejada acima de zero, usando novamente a equação de calor sensível, mas agora com o calor específico da água líquida (diferente do calor específico do gelo usado na primeira etapa)',
      },
    ],
  },
  // Parte B — tipologia (2 capítulos)
  {
    chapterId: 'summary-fisica-optica-da-visao',
    family: 'tipologia',
    question: 'Em que quatro defeitos visuais coexistentes se classificam os problemas de foco do olho humano?',
    nota: 'embora ambas dificultem a visão de perto e sejam corrigidas com lentes convergentes, têm causas fisiológicas distintas',
    items: [
      {
        label: 'Miopia',
        claim: 'converge a luz de objetos distantes num ponto situado antes da retina; corrige-se com lentes divergentes',
        section: 'Miopia e hipermetropia',
        quote: 'A miopia ocorre quando o olho, tipicamente por ser ligeiramente mais alongado do que o normal (ou por ter uma córnea com curvatura excessiva), converge a luz de objetos distantes num ponto situado antes da retina, e não exatamente sobre ela',
      },
      {
        label: 'Hipermetropia',
        claim: 'o problema oposto: converge a luz num ponto situado depois da retina; corrige-se com lentes convergentes',
        section: 'Miopia e hipermetropia',
        quote: 'A hipermetropia é o problema oposto: o olho, tipicamente por ser mais curto que o normal, converge a luz num ponto situado depois da retina',
      },
      {
        label: 'Presbiopia',
        claim: 'perda progressiva, relacionada à idade, da capacidade de acomodação do cristalino',
        section: 'Presbiopia e astigmatismo',
        quote: 'A presbiopia é a perda progressiva, relacionada à idade, da capacidade de acomodação do cristalino',
      },
      {
        label: 'Astigmatismo',
        claim: 'decorre de uma curvatura irregular da córnea, diferente dos defeitos de convergência excessiva ou insuficiente',
        section: 'Presbiopia e astigmatismo',
        quote: 'O astigmatismo, diferente dos defeitos anteriores (que envolvem convergência excessiva ou insuficiente ao longo de todos os meridianos do olho de forma simétrica), decorre de uma curvatura irregular da córnea',
      },
    ],
  },
  {
    chapterId: 'summary-fisica-ondulatoria-som-e-suas-propriedades',
    family: 'tipologia',
    question: 'Quais são as três qualidades fisiológicas do som, e a que grandeza física cada uma corresponde?',
    nota: 'cada uma dessas três qualidades pode variar de forma completamente independente das outras duas',
    items: [
      {
        label: 'Altura',
        claim: 'associada diretamente à frequência da onda sonora',
        section: 'As três qualidades fisiológicas',
        quote: 'A altura (se um som é "agudo" ou "grave") está associada diretamente à frequência da onda sonora',
      },
      {
        label: 'Timbre',
        claim: 'associado à composição harmônica da onda, o que distingue a mesma nota tocada por instrumentos diferentes',
        section: 'As três qualidades fisiológicas',
        quote: 'O timbre (a qualidade que permite distinguir a mesma nota tocada por instrumentos diferentes, como um violino e um piano) está associado à composição harmônica da onda',
      },
      {
        label: 'Intensidade',
        claim: 'associada à energia da onda por unidade de área e de tempo, correspondendo à amplitude da onda sonora',
        section: 'As três qualidades fisiológicas',
        quote: 'A intensidade (se um som é "forte" ou "fraco") está associada à energia da onda por unidade de área e de tempo, correspondendo à amplitude da onda sonora',
      },
    ],
  },
  // Parte B — escala-de-graus (1 capítulo)
  {
    chapterId: 'summary-fisica-ondulatoria-ondas-eletromagneticas',
    family: 'escala-de-graus',
    question: 'Como o espectro eletromagnético organiza as ondas eletromagnéticas em ordem crescente de frequência?',
    eixo: 'do rádio (menor frequência e energia por fóton) ao raio gama (maior frequência e energia por fóton)',
    items: [
      {
        label: 'Rádio',
        claim: 'baixíssima frequência e energia, atravessa facilmente paredes e é usada para comunicação a longa distância',
        section: 'O espectro',
        quote: 'ondas de rádio, de baixíssima frequência e energia, atravessam facilmente paredes e são usadas para comunicação a longa distância',
      },
      {
        label: 'Micro-ondas',
        claim: 'a frequência coincide com a rotação natural das moléculas de água, aquecendo alimentos por atrito molecular',
        section: 'Efeitos e aplicações',
        quote: 'micro-ondas aquecem alimentos porque sua frequência coincide aproximadamente com a frequência de rotação natural das moléculas de água, fazendo-as girar rapidamente e dissipar essa energia de rotação como calor por atrito molecular',
      },
      {
        label: 'Infravermelho',
        claim: 'emitido por qualquer corpo com temperatura acima do zero absoluto, usado em câmeras térmicas e controles remotos',
        section: 'Efeitos e aplicações',
        quote: 'infravermelho é emitido por qualquer corpo com temperatura acima do zero absoluto (radiação térmica), sendo usado em câmeras térmicas e em controles remotos',
      },
      {
        label: 'Luz visível',
        claim: 'a estreita faixa que o olho humano detecta, entre 400 e 700 nanômetros',
        section: 'O espectro',
        quote: 'luz visível (a estreita faixa que o olho humano detecta, de aproximadamente 400 a 700 nanômetros)',
      },
      {
        label: 'Ultravioleta',
        claim: 'energia suficiente para quebrar ligações químicas na pele, responsável pela vitamina D e por danos celulares',
        section: 'Efeitos e aplicações',
        quote: 'a luz ultravioleta, de energia suficiente para quebrar certas ligações químicas na pele, é a responsável tanto pela produção de vitamina D quanto pelos danos celulares que causam queimaduras solares e, em exposição prolongada, câncer de pele',
      },
      {
        label: 'Raios X',
        claim: 'atravessam tecidos moles com pouca absorção, mas são fortemente absorvidos por ossos, formando imagens médicas',
        section: 'Efeitos e aplicações',
        quote: 'raios X atravessam tecidos moles do corpo humano com pouca absorção, mas são fortemente absorvidos por ossos (mais densos), permitindo a formação de imagens médicas por diferença de absorção',
      },
      {
        label: 'Raios gama',
        claim: 'altíssima frequência e energia, penetram profundamente na matéria e podem ionizar átomos',
        section: 'O espectro',
        quote: 'raios gama, de altíssima frequência e energia, penetram profundamente na matéria e podem ionizar átomos, causando danos biológicos significativos',
      },
    ],
  },
];

/** Capítulos de Física sem cena-âncora, com o motivo. Preenchido, nesta dispatch,
 *  apenas com os 31 capítulos da Parte A (capítulos 1-42 de summaryCurriculum.ts)
 *  que não sustentam nenhuma das oito famílias com citação literal real — ver
 *  docs/visual-personalizado/16-familias-fisica.md para o raciocínio completo.
 *  Uma segunda dispatch (Parte B, capítulos 43-85) edita este mesmo array,
 *  adicionando os gaps dessa segunda metade, sem remover os desta. */
export const fisicaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-fisica-cinematica-escalar-conceitos-fundamentais',
    motivo:
      'Conteúdo procedimental (referencial, deslocamento vs. distância, velocidade e aceleração médias, pegadinhas de sinal); não há tipos coexistentes, camadas causais, critérios conjuntivos, escala ordenada, derivação encadeada nem eixos cruzados — apenas definições e um exemplo resolvido.',
  },
  {
    chapterId: 'summary-fisica-movimento-uniforme',
    motivo:
      'Equação horária linear e leitura de gráfico S×t, aplicada a problemas de encontro e travessia de túnel; é procedimento de cálculo, sem nenhuma das oito estruturas de família.',
  },
  {
    chapterId: 'summary-fisica-movimento-uniformemente-variado',
    motivo:
      'Conjunto de equações do MUV e critério de escolha entre elas (Torricelli vs. equação horária) conforme o que o problema pede; é habilidade de escolha de fórmula, não uma estrutura classificável nas oito famílias.',
  },
  {
    chapterId: 'summary-fisica-o-movimento-circular',
    motivo:
      'A seção de acoplamentos descreve duas configurações mecânicas mutuamente exclusivas (correia: velocidade linear igual; eixo comum: velocidade angular igual), mas não há guarda-chuva de tipos que coexistem nem rivalidade teórica — é uma escolha binária de qual grandeza se conserva em cada acoplamento físico, mais próxima de uma regra de leitura do que de uma tipologia com nota de honestidade sobre combinação de tipos.',
  },
  {
    chapterId: 'summary-fisica-grandezas-fisicas-e-operacoes-com-vetores',
    motivo:
      'Operações matemáticas de soma (lei dos cossenos) e decomposição de vetores em componentes ortogonais; é técnica de cálculo vetorial, não uma das oito estruturas do types.ts.',
  },
  {
    chapterId: 'summary-fisica-velocidade-vetorial',
    motivo:
      'Distinções conceituais entre velocidade escalar média e vetorial média, e composição de velocidades relativas; conteúdo definicional e de fórmula, sem tipologia com guarda-chuva, critérios conjuntivos ou cadeia de derivação.',
  },
  {
    chapterId: 'summary-fisica-composicao-de-movimentos',
    motivo:
      'Princípio da independência dos movimentos de Galileu aplicado à travessia de rio; é estratégia de montagem de problema (menor tempo vs. menor distância), não uma estrutura de família — as duas estratégias são objetivos de otimização, não tipos coexistentes nem posições rivais.',
  },
  {
    chapterId: 'summary-fisica-resultante-de-um-sistema-de-forcas',
    motivo:
      'Método de soma vetorial por componentes e definição de equilíbrio como resultante nula; é técnica de cálculo, não tipologia nem critérios conjuntivos — a condição de equilíbrio de translação é um único critério (resultante=0), não uma conjunção de vários critérios independentes (essa conjunção, com torque incluído, só aparece no capítulo de Estática).',
  },
  {
    chapterId: 'summary-fisica-as-leis-de-newton',
    motivo:
      'As três leis são apresentadas lado a lado como fundamentos independentes, não como elos de uma derivação sequencial nem como tipos coexistentes de um mesmo fenômeno; o capítulo é definicional (diagrama de corpo livre, elevador, blocos conectados por fio e roldana).',
  },
  {
    chapterId: 'summary-fisica-a-forca-de-contato',
    motivo:
      'Decomposição da força de contato em componente normal e tangencial (atrito), e distinção entre atrito estático e cinético; são componentes complementares de uma mesma força de contato, que se somam e não competem, sem guarda-chuva de tipologia, critérios conjuntivos, escala ou derivação em cadeia.',
  },
  {
    chapterId:
      'summary-fisica-sistema-de-corpos-interagindo-e-os-elementos-transmissores-de-forca',
    motivo:
      'Estratégia dos dois passos (sistema completo, depois corpo isolado) para resolver a máquina de Atwood e configurações análogas; é técnica de resolução, não uma das oito famílias — não há tipos coexistentes nem cadeia causal explicitada no texto.',
  },
  {
    chapterId: 'summary-fisica-plano-inclinado',
    motivo:
      'Decomposição do peso em componentes e derivação do ângulo crítico de escorregamento (tan θ = μ); é uma única passagem algébrica curta, não uma cadeia de vários elos rotulados e dependentes como a família cadeia-de-derivacao exige (contraste com o capítulo de Dilatação, que tem essa cadeia de fato).',
  },
  {
    chapterId: 'summary-fisica-leis-da-gravitacao',
    motivo:
      'A lei da gravitação e as três leis de Kepler são apresentadas como fatos complementares sobre o mesmo fenômeno orbital, não como tipos que coexistem sob um guarda-chuva, nem como camadas causais, nem como critérios conjuntivos de um mesmo veredito.',
  },
  {
    chapterId: 'summary-fisica-dinamica-do-movimento-circular',
    motivo:
      "A seção 'Quem segura o corpo na curva' lista situações (atrito numa curva plana, tração num pêndulo cônico, normal numa pista inclinada) que exemplificam qual força faz o papel de força centrípeta, mas é um heurístico de diagnóstico caso a caso, não uma tipologia com guarda-chuva explícito nomeando um conjunto fechado de tipos.",
  },
  {
    chapterId: 'summary-fisica-analisando-movimentos-contidos-em-um-plano-vertical',
    motivo:
      'O contraste entre topo e fundo de uma trajetória circular vertical é a comparação de dois pontos específicos da mesma trajetória (mesma equação com sinais diferentes de peso e normal), não uma rivalidade teórica, nem tipos coexistentes, nem eixos ortogonais independentes.',
  },
  {
    chapterId: 'summary-fisica-orbitas',
    motivo:
      'Definição de velocidade orbital e da órbita geoestacionária a partir da terceira lei de Kepler; conteúdo definicional e de fórmula única, sem estrutura classificável nas oito famílias.',
  },
  {
    chapterId: 'summary-fisica-balistica',
    motivo:
      'Reafirma a independência dos dois movimentos (horizontal uniforme, vertical uniformemente variado) já vista em Composição de Movimentos; mesma natureza procedimental, sem tipologia, critérios conjuntivos ou cadeia de derivação.',
  },
  {
    chapterId: 'summary-fisica-movimento-harmonico-simples-mhs',
    motivo:
      'Definição da força restauradora, período (com isocronismo) e conservação de energia na oscilação; conteúdo definicional e de fórmula, sem tipos coexistentes nem outra estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-impulso-e-quantidade-de-movimento',
    motivo:
      'Teorema do impulso e leitura de área sob o gráfico força×tempo; procedimento e definição, sem estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento',
    motivo:
      'Definição de sistema isolado e conservação de momento em explosões e recuo; conteúdo definicional, sem tipologia nem outra estrutura aplicável.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-trabalho-de-uma-forca',
    motivo:
      'Definição de trabalho e de seu sinal conforme o ângulo, e regras de cálculo do trabalho de forças específicas (peso, normal, atrito); é uma lista de regras por força, não uma tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-teorema-da-energia-cinetica',
    motivo:
      'Teorema trabalho-energia e critério de quando usá-lo em vez das equações do MUV; conteúdo de escolha de ferramenta de cálculo, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-o-teorema-da-energia-potencial',
    motivo:
      'Definição de energia potencial gravitacional e elástica, e da relação τ=−ΔEp entre trabalho de força conservativa e energia potencial; conteúdo definicional, sem tipos coexistentes com guarda-chuva nem outra estrutura.',
  },
  {
    chapterId: 'summary-fisica-sistemas-conservativos-e-sistemas-nao-conservativos',
    motivo:
      'Distinção binária entre sistema conservativo e não conservativo é uma dicotomia definicional, sem nota de honestidade sobre combinação de tipos como a família tipologia exige, e sem lista de condições que precisem ser reunidas simultaneamente para um único veredito (o que descartaria também critérios-conjuntivos).',
  },
  {
    chapterId: 'summary-fisica-potencia-maquina-e-rendimento',
    motivo:
      'Definição de potência e rendimento, e conversão entre unidades (W, CV, HP); conteúdo definicional e procedimental, sem estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-equivalencia-massa-energia',
    motivo:
      'Relação E=mc² e defeito de massa em reações nucleares; conteúdo definicional e explicativo sobre um único princípio físico, sem tipos coexistentes, critérios conjuntivos ou cadeia de derivação rotulada em elos.',
  },
  {
    chapterId: 'summary-fisica-hidrostatica-densidade-e-pressao',
    motivo:
      'Paradoxo hidrostático, princípios de Pascal e de Arquimedes, e condição de flutuação; são três princípios complementares sobre fluidos em repouso, não tipos coexistentes sob um guarda-chuva comum, e a condição de flutuação é a comparação de duas densidades (um único critério), não uma conjunção de vários critérios independentes.',
  },
  {
    chapterId: 'summary-fisica-trabalho-da-forca-de-pressao-do-gas',
    motivo:
      'Cálculo do trabalho do gás (τ=P×ΔV) e leitura de área sob a curva no diagrama p-V; conteúdo procedimental e gráfico, sem tipologia ou outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-primeira-lei-da-termodinamica',
    motivo:
      'Equação geral ΔU=Q−τ e sua convenção de sinais; lei única com convenção de sinais, sem tipos coexistentes (esses aparecem no capítulo seguinte, sobre as transformações particulares) nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-maquinas-termicas-e-ciclo-de-carnot',
    motivo:
      'Segunda lei da termodinâmica, rendimento de máquinas térmicas e ciclo de Carnot como limite teórico; conteúdo definicional e de fórmula sobre um único conceito (rendimento máximo), sem tipos coexistentes nem outra estrutura aplicável.',
  },
  {
    chapterId: 'summary-fisica-forca-eletrica-lei-de-coulomb',
    motivo:
      'Lei de Coulomb e comparação de ordem de grandeza com a força gravitacional, mais a regra de superposição vetorial; é analogia estrutural entre duas leis e regra de cálculo, não rivalidade nem tipos coexistentes — conteúdo definicional e comparativo, sem estrutura das oito famílias.',
  },
  // --- Parte B (capítulos 43-85), ver docs/visual-personalizado/16-familias-fisica.md ---
  {
    chapterId: 'summary-fisica-campo-eletrico',
    motivo:
      'Definição operacional do campo (E=F/q) e da lei do campo de carga puntiforme (E=kQ/r²), com superposição vetorial; conteúdo definicional e de cálculo, sem tipologia, critérios conjuntivos, escala ordenada, cadeia de derivação em elos ou eixos cruzados.',
  },
  {
    chapterId: 'summary-fisica-energia-potencial-e-potencial-eletrico',
    motivo:
      'Contraste entre grandeza vetorial (campo) e escalar (potencial) e regra de sinal para movimento espontâneo de cargas; é distinção conceitual e de fórmula (V=kQ/r, τ=qΔV), não uma das oito estruturas — não há guarda-chuva de tipos nem conjunção de critérios.',
  },
  {
    chapterId:
      'summary-fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais',
    motivo:
      'Os três padrões visuais (carga isolada radial, placas paralelas uniforme, par de cargas opostas em arco) são um guia de leitura de figuras de prova, não uma tipologia do fenômeno físico em si com nota de honestidade sobre combinação de tipos; é heurística de reconhecimento visual, mais próxima de uma técnica de interpretação do que de uma classificação estrutural.',
  },
  {
    chapterId: 'summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial',
    motivo:
      'Fórmulas do campo uniforme (E=U/d) e decomposição do lançamento de cargas em componente paralela acelerada e perpendicular constante; é aplicação procedural do MRUV a cargas, sem tipologia, critérios conjuntivos ou escala.',
  },
  {
    chapterId: 'summary-fisica-dinamica-das-cargas-eletricas',
    motivo:
      'As leis de Newton reaplicadas a cargas elétricas, com equilíbrio de uma esfera suspensa e conservação de energia no movimento acelerado; é extensão procedural da dinâmica newtoniana, sem estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-corrente-eletrica',
    motivo:
      'Distinção entre sentido convencional e sentido real dos elétrons, e definição de velocidade de deriva; são definições e uma correção conceitual de convenção histórica, não tipologia nem outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-potencia-eletrica',
    motivo:
      'Três formas equivalentes da mesma fórmula de potência (P=Ui, P=i²R, P=U²/R) e conversão para consumo em kWh; conteúdo definicional e de conversão de unidades, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-resistores',
    motivo:
      'Segunda lei de Ohm (R=ρL/A) e regras de associação em série e paralelo; são fórmulas de cálculo com dependências geométricas opostas, não uma tipologia com guarda-chuva nem outra das oito estruturas.',
  },
  {
    chapterId: 'summary-fisica-medidores-eletricos',
    motivo:
      'Regras opostas de ligação de amperímetro (série, resistência nula ideal) e voltímetro (paralelo, resistência infinita ideal); é par de convenções de instrumentação com propriedades opostas, não tipologia nem critérios conjuntivos — não há guarda-chuva de tipos coexistentes, é uma dicotomia funcional fixa.',
  },
  {
    chapterId: 'summary-fisica-geradores',
    motivo:
      'Equação característica do gerador (U=ε−ri), curva característica e rendimento; conteúdo definicional e de fórmula sobre um único dispositivo, sem tipos coexistentes nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-receptores',
    motivo:
      "Equação característica do receptor (U=ε'+r'i), estruturalmente análoga (mas de sinal oposto) à do gerador; é comparação de fórmulas entre dois dispositivos complementares, não uma tipologia nem outra das oito estruturas.",
  },
  {
    chapterId: 'summary-fisica-circuitos-de-malha-unica',
    motivo:
      'Equação da malha única (ε=i(R+r)) e queda de tensão em cada trecho; é aplicação da conservação de energia a um circuito simples, procedimento de cálculo sem estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-eletrodinamica-as-leis-de-kirchhoff',
    motivo:
      'Lei dos nós e lei das malhas são duas ferramentas complementares aplicadas em conjunto para resolver um circuito, não duas condições que precisam ser reunidas para um único veredito (o que exigiria critérios-conjuntivos) nem tipos coexistentes de um fenômeno.',
  },
  {
    chapterId: 'summary-fisica-capacitores',
    motivo:
      'Definição de capacitância, energia armazenada e regras de associação em série e paralelo (opostas às de resistores); conteúdo definicional e procedimental, sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId:
      'summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre',
    motivo:
      'Inseparabilidade dos polos magnéticos, geometria das linhas de indução fechadas e a inversão de nomenclatura do polo magnético terrestre; são fatos definicionais sobre magnetismo, sem tipologia, critérios conjuntivos ou outra estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes',
    motivo:
      'Fórmulas do campo de um fio reto, de uma espira e de um solenoide, com a regra da mão direita; é uma progressão de fórmulas por configuração geométrica, não uma tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId:
      'summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme',
    motivo:
      'A trajetória circular (velocidade perpendicular ao campo) e a helicoidal (velocidade oblíqua) são dois regimes ao longo de uma única variável contínua (o ângulo de entrada), não dois eixos binários independentes cruzando em quatro células como grade-de-eixos exige, nem uma tipologia com guarda-chuva explícito de tipos coexistentes.',
  },
  {
    chapterId: 'summary-fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas',
    motivo:
      'Fórmula da força sobre um fio (F=BiLsenθ), regra de atração/repulsão entre fios paralelos e princípio do motor elétrico; conteúdo definicional e procedimental, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-inducao-eletromagnetica-lei-de-lenz',
    motivo:
      'A lei de Faraday e sua interpretação física pela lei de Lenz (conservação de energia) descrevem um único mecanismo causal, não tipos coexistentes nem critérios conjuntivos — é a mesma lei explicada em duas camadas de detalhe, não uma estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores',
    motivo:
      'Funcionamento do gerador de corrente alternada e do transformador; conteúdo definicional e explicativo de dois dispositivos que compartilham a lei de Faraday, sem tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-fundamentos-da-optica-geometrica',
    motivo:
      'Sombra/penumbra, eclipses e cor percebida de corpos; são fenômenos definicionais e geométricos distintos, sem guarda-chuva de tipologia (a menção a eclipse total/anular/parcial é uma observação lateral, não uma classificação central do capítulo) nem outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-reflexao-em-superficies-planas',
    motivo:
      'Lei da reflexão, propriedades da imagem no espelho plano (virtual, direita, mesma distância) e regra do tamanho mínimo; conteúdo definicional e geométrico, sem tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-reflexao-em-superficies-esfericas',
    motivo:
      "A regra das posições do objeto no espelho côncavo é uma tabela de consulta que mapeia uma única variável contínua (distância do objeto) em quatro faixas de resultado, não uma tipologia com tipos nomeados e coexistentes com nota de honestidade — mesmo padrão heurístico já descartado na Parte A para 'quem faz o papel de força centrípeta'.",
  },
  {
    chapterId: 'summary-fisica-refracao-fundamentos-leis-e-aplicacoes',
    motivo:
      'Lei de Snell, ângulo crítico e reflexão total interna; conteúdo definicional e de fórmula sobre um único fenômeno (a refração), sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-lentes-esfericas-estudo-grafico',
    motivo:
      'Mesma estrutura de "regra das posições" do objeto que o capítulo de espelhos esféricos — tabela de consulta sobre uma variável contínua, não uma tipologia com guarda-chuva de tipos coexistentes.',
  },
  {
    chapterId: 'summary-fisica-estudo-analitico-das-lentes-esfericas',
    motivo:
      'Equação de Gauss, convenção de sinais e vergência; conteúdo definicional e de convenção matemática, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes',
    motivo:
      'Equação de Halley e soma de vergências em associação de lentes justapostas; conteúdo de fórmula e procedimento de associação, sem tipologia nem outra estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas',
    motivo:
      'Papéis complementares de objetiva e ocular no microscópio e na luneta; conteúdo definicional sobre dois instrumentos específicos, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-conceitos-basicos',
    motivo:
      "As três classificações de onda (natureza, direção de vibração, dimensão) são independentes entre si e não populam de fato as quatro células de um cruzamento binário-binário — o próprio texto não apresenta o par 'eletromagnética e longitudinal', que fisicamente não ocorre para ondas eletromagnéticas livres —, então não sustentam grade-de-eixos; também não formam uma única tipologia com guarda-chuva, mas três critérios de classificação simultâneos e sobrepostos.",
  },
  {
    chapterId: 'summary-fisica-equacao-fundamental-da-ondulatoria',
    motivo:
      'Dedução de v=λf a partir das definições de período e comprimento de onda, em um único passo algébrico; não é uma cadeia de vários elos dependentes como a família cadeia-de-derivacao exige (contraste com a dilatação térmica da Parte A).',
  },
  {
    chapterId: 'summary-fisica-intensidade-sonora',
    motivo:
      'Definição de intensidade (I=P/A) e da escala logarítmica em decibéis; é conteúdo de fórmula e de conversão matemática, sem uma lista estruturada de itens graduados como a família escala-de-graus exige (ao contrário do espectro eletromagnético, que nomeia sete faixas em ordem) — aqui há só dois ou três valores de referência soltos nos exemplos, não uma escala com itens.',
  },
  {
    chapterId: 'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas',
    motivo:
      'Distinção binária entre eco e reverberação por limiar de tempo de percepção, mais a regra geométrica de refração de ondas; é dicotomia definicional e regra de desvio, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas',
    motivo:
      'Reflexão com ou sem inversão de fase em extremidade fixa vs. livre é uma dicotomia definicional (mesmo padrão já descartado na Parte A para sistemas conservativos/não conservativos), não uma tipologia com guarda-chuva de tipos coexistentes e nota de honestidade sobre combinação.',
  },
  {
    chapterId: 'summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia',
    motivo:
      'Três fenômenos ondulatórios distintos (difração, polarização, ressonância) tratados em seções separadas, sem guarda-chuva comum que os agrupe como tipos de uma mesma categoria — são tópicos independentes, não uma tipologia.',
  },
  {
    chapterId:
      'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento',
    motivo:
      'Condições de interferência construtiva e destrutiva formam uma dicotomia baseada na diferença de percurso, e o batimento é um fenômeno temporal à parte; conteúdo de fórmula e distinção binária, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-um-caso-particular-de-interferencia-onda-estacionaria',
    motivo:
      'Nós e ventres são os dois polos de um mesmo padrão espacial fixo (não tipos coexistentes independentes), e a restrição a certas frequências (harmônicos) é regra de encaixe geométrico; sem guarda-chuva de tipologia, critérios conjuntivos ou cadeia de derivação em elos dependentes.',
  },
  {
    chapterId: 'summary-fisica-ondas-estacionarias-em-cordas',
    motivo:
      'Série harmônica (λ_n=2L/n) e as três variáveis que o instrumentista controla (comprimento, tensão, densidade linear); conteúdo de fórmula e de aplicação prática, sem tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-ondas-estacionarias-em-tubos',
    motivo:
      'Tubo aberto (todos os harmônicos) vs. tubo fechado numa ponta (só harmônicos ímpares) é uma dicotomia de condição de contorno, sem o guarda-chuva explícito de três ou mais tipos coexistentes com nota de honestidade que caracteriza a tipologia nas demais aceitas (contraste com os cinco tipos de força, ou os três processos de eletrização, da Parte A) — é a mesma classe de dicotomia binária já descartada para sistemas conservativos/não conservativos.',
  },
  {
    chapterId: 'summary-fisica-efeito-doppler-descricao-e-estudo-quantitativo',
    motivo:
      'Fórmula geral do efeito Doppler com regra de sinais conforme aproximação ou afastamento; conteúdo de fórmula e convenção de sinal, sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-nocoes-basicas-de-fisica-quantica',
    motivo:
      'Quantização de energia, efeito fotoelétrico e dualidade onda-partícula; a dualidade é uma propriedade dupla de uma mesma entidade (luz, matéria), não dois tipos mutuamente exclusivos nem um guarda-chuva de tipos coexistentes — é a mesma entidade revelando duas facetas conforme o experimento, sem estrutura de família aplicável.',
  },
];
