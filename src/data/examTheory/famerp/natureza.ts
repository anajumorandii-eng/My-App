// Biologia, Química e Física: capítulos que mais caem na objetiva da Famerp.
// Estas matérias também são as únicas do 2º dia, por isso cada capítulo traz
// uma discursiva com resposta-modelo e o que a correção de 0 a 4 confere.
// String.raw mantém as barras do LaTeX sem escapar.

import type { ChapterTheory } from '../types';

const md = String.raw;

export const natureza: Record<string, ChapterTheory> = {
  'bio_zoologia::Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética': {
    howItFalls: md`Caiu em 4 dos 5 anos (2023–2026). O ponto de partida é sempre um caso: fóssil de hominídeo (Ardi), "homens das cavernas", tirinha com dois besouros de nomes científicos parecidos, cladograma montado a partir de DNA. As perguntas são de três tipos: **qual a categoria comum mais restrita** entre duas espécies, **quais táxons são mais aparentados num cladograma** e **se duas espécies podem gerar descendência fértil**.`,
    explanation: md`### Para que serve classificar
A classificação moderna não agrupa por aparência, e sim por **ancestralidade comum**. Dois seres ficam no mesmo grupo porque descendem de um mesmo ancestral, e quanto mais recente esse ancestral, mais restrito é o grupo que eles dividem.

### A hierarquia
Reino → Filo → Classe → Ordem → Família → Gênero → Espécie. Cada degrau para baixo é mais restrito: o lobo e o cão dividem até o gênero (*Canis*); o lobo e o gato só até a ordem (Carnivora). A pergunta "qual categoria revela **maior** parentesco" pede a **mais baixa** que as duas espécies compartilham.

### Nomenclatura binomial
Proposta por Lineu: *Gênero epíteto*. O gênero vem com maiúscula, o epíteto com minúscula, e o nome inteiro em itálico (ou sublinhado à mão). Dois nomes com a mesma primeira palavra são do mesmo gênero; com primeiras palavras diferentes, são de gêneros diferentes, por mais parecidos que pareçam.

### Espécie biológica
Espécie é um conjunto de populações que **se cruzam na natureza e geram descendentes férteis**. Espécies diferentes às vezes cruzam, mas o isolamento reprodutivo aparece depois: o híbrido costuma ser estéril (a mula, de égua com jumento, não se reproduz). Por isso "cruzou e nasceu filhote" não basta para dizer que é a mesma espécie.

### Cladograma
É uma árvore de hipóteses de parentesco. Cada **nó** é um ancestral comum; cada **ramo** termina num grupo atual. Para comparar parentesco, procure o nó mais recente que une os dois grupos: quem se une mais perto das pontas é mais aparentado e, se a árvore foi feita com DNA, tem DNA mais semelhante. A posição na página não importa: girar os ramos em torno de um nó não muda a árvore.

### Humanos na classificação
Reino Animalia, filo Chordata, classe Mammalia, ordem **Primates**, família **Hominidae**, gênero *Homo*. Os primatas têm mãos preênseis com polegar oponível, unhas em vez de garras e visão binocular frontal, adaptações à vida nas árvores.`,
    applications: [
      md`**Evolução humana**: comparar *Homo sapiens* com fósseis (Ardipithecus, Australopithecus) pela categoria compartilhada.`,
      md`**Evolução**: cladograma é a forma de representar especiação e ancestralidade; caiu também nas discursivas (cladograma dos moluscos em 2022, especiação no Havaí em 2023).`,
      md`**Genética molecular**: a semelhança de sequências de DNA é o dado que monta o cladograma.`,
      md`**Zoologia e botânica**: toda a sistemática dos grupos usa a mesma lógica de caracteres compartilhados.`,
    ],
    strategy: [
      md`Identifique o que a pergunta compara: duas espécies (categoria), vários táxons (cladograma) ou cruzamento (conceito de espécie).`,
      md`Categoria: escreva a classificação das duas lado a lado e desça até onde elas ainda coincidem.`,
      md`Cladograma: marque com o dedo o nó que une cada par; o par do nó mais recente é o mais aparentado.`,
      md`Cruzamento: pergunte "os filhos são férteis?". Se não forem, são espécies diferentes.`,
    ],
    examples: [
      {
        title: 'Categoria comum',
        prompt: md`O leão (*Panthera leo*) e a onça (*Panthera onca*) pertencem à família Felidae; o gato doméstico (*Felis catus*) também. Qual categoria indica maior parentesco entre o leão e a onça?`,
        steps: [md`Leão e onça dividem o gênero *Panthera*.`, md`Gato e leão só dividem até a família Felidae.`, md`O gênero é mais restrito que a família: leão e onça são mais aparentados entre si.`],
      },
      {
        title: 'Cladograma',
        prompt: md`Num cladograma, X e Y se unem num nó; esse par se une a Z; o grupo X-Y-Z se une a W. Quais táxons têm DNA mais semelhante?`,
        steps: [md`O nó que une X e Y é o mais próximo das pontas.`, md`Logo X e Y têm o ancestral comum mais recente e o DNA mais semelhante; W é o mais distante dos quatro.`],
      },
    ],
    discursive: {
      prompt: md`Num zoológico, um tigre (*Panthera tigris*) e uma leoa (*Panthera leo*) tiveram um filhote, o tigreão, que é estéril. (a) Tigre e leão são da mesma espécie? Justifique. (b) Indique a categoria taxonômica mais restrita que eles compartilham.`,
      modelAnswer: [md`(a) Não. Espécie é o grupo cujos indivíduos se cruzam e geram descendentes **férteis**; o tigreão é estéril, o que mostra isolamento reprodutivo entre tigre e leão.`, md`(b) O gênero *Panthera*, indicado pela primeira palavra comum aos dois nomes científicos.`],
      scoring: [md`Responde "não" e usa o critério de fertilidade da prole (não só "nomes diferentes").`, md`Nomeia o gênero e justifica pela nomenclatura binomial.`],
    },
    traps: [
      { trap: md`Achar que a categoria mais ampla (reino, filo) indica mais parentesco.`, fix: md`É o contrário: quanto mais restrita a categoria em comum, mais recente o ancestral e maior o parentesco.` },
      { trap: md`Ler parentesco pela posição na página do cladograma.`, fix: md`Leia pelos nós; ramos podem girar sem mudar a árvore.` },
      { trap: md`"Cruzaram e tiveram filhote, então são a mesma espécie."`, fix: md`O critério é descendência **fértil**.` },
    ],
  },

  'bio_evolucao::Mecanismos da Evolução Biológica': {
    howItFalls: md`Caiu em 2022, 2024 e 2025: resistência do *Plasmodium* a antimaláricos, a frase que resume a seleção natural de Darwin e Wallace, e camelídeos distribuídos por continentes diferentes. A banca cobra **o mecanismo**, e a alternativa errada quase sempre é lamarckista ("adquiriu para sobreviver").`,
    explanation: md`### Seleção natural em quatro passos
1. **Variação**: os indivíduos de uma população não são iguais, e parte dessa diferença é herdável (vem de mutações e da recombinação na reprodução sexuada).
2. **Excesso de descendentes**: nascem mais indivíduos do que o ambiente sustenta.
3. **Sobrevivência e reprodução diferenciais**: quem tem características mais vantajosas **naquele ambiente** deixa mais filhos.
4. **Mudança de frequência**: a característica vantajosa fica mais comum geração após geração.

Note o ponto central: **o ambiente não cria a variação, ele seleciona a que já existe**. O antimalárico não faz o parasita ficar resistente; ele mata os sensíveis, e os resistentes, que já existiam por mutação ao acaso, sobram e se multiplicam.

### Teoria sintética (neodarwinismo)
Juntou Darwin à genética: a variação vem de **mutação** e **recombinação**; as frequências dos alelos mudam por **seleção natural**, **deriva genética** (acaso, mais forte em populações pequenas) e **migração** (fluxo gênico). A unidade que evolui é a **população**, não o indivíduo.

### Especiação
- **Alopátrica**: uma barreira geográfica (oceano, deriva dos continentes, cordilheira) separa populações. Sem fluxo gênico, cada uma acumula mutações e sofre seleções diferentes, até não conseguirem mais se reproduzir entre si.
- Espécies aparentadas em continentes diferentes, como camelos na Ásia, dromedários na África e lhamas na América do Sul, são explicadas por um ancestral comum que se dispersou e depois teve as populações isoladas.

### Por que Lamarck foi superado
Lamarck propunha uso e desuso e herança dos caracteres adquiridos. O que um organismo adquire em vida (um músculo treinado) não altera seus gametas e não passa aos filhos.`,
    applications: [
      md`**Saúde**: resistência a antibióticos, antivirais, inseticidas e antimaláricos; por isso o tratamento deve ser completo.`,
      md`**Classificação**: cladogramas representam a história evolutiva.`,
      md`**Genética de populações**: Hardy-Weinberg descreve a população **sem** evolução; desvios indicam seleção, deriva ou migração.`,
      md`**Ecologia**: especiação em ilhas (Havaí, Galápagos) e espécies invasoras.`,
    ],
    strategy: [
      md`Procure a palavra-chave da alternativa: "para", "precisou", "adquiriu" indicam lamarckismo; "já existiam", "foram selecionados" indicam darwinismo.`,
      md`Em resistência, a resposta tem sempre três partes: variação preexistente, morte dos sensíveis, aumento da frequência dos resistentes.`,
      md`Em distribuição geográfica, procure isolamento + ancestral comum.`,
    ],
    examples: [
      {
        title: 'Resistência',
        prompt: md`Após anos de uso de um inseticida, uma população de mosquitos passou a ter maioria resistente. Explique.`,
        steps: [md`Mutações ao acaso já tinham produzido alguns mosquitos resistentes.`, md`O inseticida matou os sensíveis; os resistentes sobreviveram e deixaram mais descendentes.`, md`A frequência do alelo de resistência aumentou: seleção, não adaptação dirigida.`],
      },
      {
        title: 'Especiação',
        prompt: md`Duas populações de um lagarto ficaram separadas em ilhas por 2 milhões de anos e hoje não produzem descendentes férteis entre si. Que tipo de especiação ocorreu?`,
        steps: [md`A separação foi geográfica (ilhas), o que interrompeu o fluxo gênico.`, md`Com mutações e seleção diferentes, surgiu isolamento reprodutivo: especiação **alopátrica**.`],
      },
    ],
    discursive: {
      prompt: md`Em hospitais, bactérias resistentes a um antibiótico se tornaram comuns após anos de uso intenso. (a) Explique, segundo a teoria sintética da evolução, a origem da resistência. (b) Por que interromper o tratamento antes do prazo favorece esse processo?`,
      modelAnswer: [md`(a) Mutações aleatórias produziram bactérias resistentes antes do uso do antibiótico. O antibiótico eliminou as sensíveis, e as resistentes sobreviveram e se multiplicaram, aumentando a frequência do gene de resistência na população (seleção natural).`, md`(b) Interromper cedo mata só as mais sensíveis e deixa vivas as parcialmente resistentes, que se reproduzem e ficam mais frequentes.`],
      scoring: [md`Afirma que a resistência **já existia** (mutação) e não foi induzida pelo remédio.`, md`Descreve a sobrevivência diferencial e o aumento de frequência.`, md`Em (b), relaciona a interrupção à sobrevivência dos menos sensíveis.`],
    },
    traps: [
      { trap: md`"O antibiótico induziu as bactérias a se adaptarem."`, fix: md`O ambiente seleciona variação preexistente; não a cria.` },
      { trap: md`"O indivíduo evolui."`, fix: md`Evolui a população, pela mudança na frequência dos alelos.` },
      { trap: md`Atribuir a Darwin o conhecimento de genes e mutações.`, fix: md`Darwin não conhecia a origem da variação; isso veio com a teoria sintética.` },
    ],
  },

  'qui_solucoes::Dispersões': {
    howItFalls: md`Caiu em 4 dos 5 anos, sempre com dado de rótulo ou de rotina: gramas de açúcar por 100 mL de bebida, sacarose num refrigerante, medicamento diluído em soro glicosado a 5% (m/v) e defensivo agrícola dissolvido em centenas de litros. O cálculo é curto; o que derruba é **unidade** e **proporção**.`,
    explanation: md`### O que é concentração
Toda concentração é **quantidade de soluto dividida pela quantidade de solução**. O que muda de uma forma para outra é como você mede cada parte.

### As formas que caem
- **Concentração comum** ($C$): massa de soluto por volume de solução, em g/L ou g/mL.
- **Concentração em quantidade de matéria** (molaridade, $\mathfrak{M}$): mols de soluto por litro de solução.
- **Título em massa por volume**: "5% (m/v)" significa 5 g de soluto em **100 mL** de solução.
- **Partes por milhão** (ppm): 1 mg de soluto por kg (ou por L, em água) de solução.

### Diluição
Diluir é acrescentar solvente. A **quantidade de soluto não muda**, só o volume aumenta; por isso a concentração cai na mesma proporção em que o volume cresce.

### Retirar parte de uma solução
Se você tira 30 mL de uma solução de 270 mL, leva junto $30/270$ de cada soluto que está nela. A concentração da porção retirada é a mesma da solução original.

### Por que os rótulos dão "por 100 mL"
É uma proporção pronta. Se 100 mL têm 7,5 g, 250 mL têm $2{,}5 \times 7{,}5 = 18{,}75$ g. Na prova, monte a regra de três antes de pensar em fórmula.`,
    formulas: [
      { tex: String.raw`C = \frac{m_{\text{soluto}}}{V_{\text{solução}}}`, meaning: md`Concentração comum, em g/L. Use quando o enunciado dá massa e volume.` },
      { tex: String.raw`\mathfrak{M} = \frac{n}{V} = \frac{m}{M \cdot V}`, meaning: md`Molaridade, em mol/L: $n$ = mols, $m$ = massa (g), $M$ = massa molar (g/mol), $V$ em **litros**.` },
      { tex: String.raw`C = \mathfrak{M} \cdot M`, meaning: md`Converte mol/L em g/L multiplicando pela massa molar.` },
      { tex: String.raw`C_1 V_1 = C_2 V_2`, meaning: md`Diluição: a massa (ou o número de mols) de soluto antes e depois é a mesma.` },
    ],
    applications: [
      md`**Saúde**: dose de medicamento, soro fisiológico (0,9% m/v de NaCl), soro glicosado, alcoolemia.`,
      md`**Alimentos**: rótulos nutricionais, teor de açúcar e sódio.`,
      md`**Ambiente**: limites de poluentes em ppm na água e no ar.`,
      md`**Estequiometria**: reações em solução usam $n = \mathfrak{M} \cdot V$ para chegar aos mols.`,
      md`**Discursiva**: a Famerp combinou concentração com estequiometria e com limite de exposição (CCl₄ em 2026).`,
    ],
    strategy: [
      md`Anote a unidade pedida antes de começar (g/L, mol/L, mg).`,
      md`Passe volume para litros se a resposta é em mol/L.`,
      md`Se o enunciado dá "por 100 mL" ou "%", resolva por regra de três.`,
      md`Em diluição, escreva $C_1V_1 = C_2V_2$ e isole o que falta.`,
    ],
    examples: [
      {
        title: 'Molaridade',
        prompt: md`Uma lata de 250 mL tem 12 g de sacarose ($M = 342$ g/mol). Qual a concentração em mol/L?`,
        steps: [md`$n = \dfrac{12}{342} \approx 0{,}035$ mol.`, md`$V = 0{,}250$ L.`, md`$\mathfrak{M} = \dfrac{0{,}035}{0{,}250} \approx 0{,}14$ mol/L.`],
      },
      {
        title: 'Diluição e porção',
        prompt: md`Dissolvem-se 300 mg de um fármaco em 200 mL de soro glicosado a 5% (m/v). O paciente recebe 50 mL dessa mistura. Que massas de fármaco e de glicose ele recebe?`,
        steps: [md`Fração recebida: $\dfrac{50}{200} = \dfrac{1}{4}$.`, md`Fármaco: $\dfrac{300}{4} = 75$ mg.`, md`Glicose: 5 g em 100 mL, logo 10 g em 200 mL; $\dfrac{10}{4} = 2{,}5$ g.`],
      },
    ],
    discursive: {
      prompt: md`Um soro fisiológico tem 0,9% (m/v) de NaCl ($M = 58{,}5$ g/mol). (a) Calcule a concentração em g/L e em mol/L. (b) Que volume de água deve ser acrescentado a 100 mL de solução de NaCl 1,8% (m/v) para obter o soro fisiológico?`,
      modelAnswer: [md`(a) 0,9 g em 100 mL $\Rightarrow C = 9$ g/L; $\mathfrak{M} = \dfrac{9}{58{,}5} \approx 0{,}15$ mol/L.`, md`(b) $C_1V_1 = C_2V_2 \Rightarrow 1{,}8 \cdot 100 = 0{,}9 \cdot V_2 \Rightarrow V_2 = 200$ mL. Acrescentar 100 mL de água.`],
      scoring: [md`Converte % (m/v) em g/L corretamente.`, md`Usa a massa molar para mol/L, com unidade.`, md`Aplica a conservação do soluto e responde o volume **acrescentado**, não o final.`],
    },
    traps: [
      { trap: md`Deixar o volume em mL na molaridade.`, fix: md`Molaridade é por litro: divida o volume em mL por 1000.` },
      { trap: md`Responder o volume final quando a pergunta pede o volume acrescentado.`, fix: md`Acrescentado = final − inicial.` },
      { trap: md`"Solução mais diluída" com os números errados.`, fix: md`Mais diluída = menor massa de soluto e maior volume de solução.` },
    ],
  },

  'qui_polaridade_geometria::Interações Intermoleculares': {
    howItFalls: md`Caiu em 2022, 2025 e 2026: ordenar temperaturas de ebulição de compostos com quatro carbonos (alcano, cetona, álcool, ácido), identificar a interação entre um soluto e um solvente orgânico, e classificar ligações e geometria do PCl₃.`,
    explanation: md`### Interação intermolecular não é ligação química
Ligação química (covalente, iônica) une átomos **dentro** da molécula. Interação intermolecular atrai uma molécula **à outra**. Ferver água rompe interações entre moléculas de H₂O; as ligações O–H continuam inteiras.

### As três forças, da mais fraca para a mais forte
1. **Dipolo induzido (London)**: existe em todas as moléculas; é a única entre moléculas apolares. Cresce com o tamanho da molécula, porque nuvens eletrônicas maiores se deformam mais.
2. **Dipolo permanente**: entre moléculas polares, em que um lado é parcialmente positivo e o outro parcialmente negativo (cetonas, aldeídos, HCl).
3. **Ligação de hidrogênio**: caso especial e mais forte de dipolo, quando o H está ligado a **F, O ou N** e é atraído pelo par de elétrons de F, O ou N de outra molécula (água, álcoois, ácidos carboxílicos, aminas).

### Temperatura de ebulição
Para ferver, é preciso separar as moléculas; quanto mais forte a interação, mais energia e maior a temperatura. Compare primeiro o **tipo** de interação e, só entre moléculas com o mesmo tipo, o **tamanho**.
Para cadeias de mesmo tamanho: alcano < aldeído/cetona < álcool < ácido carboxílico. O ácido fica acima do álcool porque forma duas ligações de hidrogênio por par de moléculas (dímeros).

### Polaridade da ligação e da molécula
- Ligação polar: átomos com eletronegatividades diferentes. P (2,2) e Cl (3,2) formam ligação polar.
- Molécula polar: a soma dos dipolos não se anula. Isso depende da **geometria**. Pares de elétrons não ligantes no átomo central entortam a molécula.
- PCl₃: o P tem 3 ligações e 1 par isolado → geometria **piramidal**, molécula polar (como NH₃). CO₂ tem ligações polares, mas é linear e os dipolos se anulam: molécula apolar.

### Solubilidade
"Semelhante dissolve semelhante": polar dissolve polar, apolar dissolve apolar. Duas substâncias capazes de ligação de hidrogênio se misturam bem.`,
    applications: [
      md`**Separação de misturas**: destilação fracionada separa pelos pontos de ebulição, que dependem das interações.`,
      md`**Biologia**: ligações de hidrogênio mantêm a dupla-hélice do DNA e a estrutura das proteínas; a água tem alto calor específico por causa delas.`,
      md`**Orgânica**: solubilidade de vitaminas (A, D, E, K apolares; C e complexo B polares), sabões e detergentes.`,
      md`**Discursiva**: solventes e pressão de vapor (Famerp 2022).`,
    ],
    strategy: [
      md`Para cada substância, pergunte: tem H ligado a F, O ou N? Então tem ligação de hidrogênio.`,
      md`Se não, é polar? Então dipolo permanente. Se apolar, só London.`,
      md`Ordene pelo tipo de interação; desempate pelo tamanho da cadeia.`,
      md`Para geometria, conte ligações e pares isolados no átomo central.`,
    ],
    examples: [
      {
        title: 'Ordem de ebulição',
        prompt: md`Ordene por temperatura de ebulição crescente: propano, propanona, propan-1-ol e ácido propanoico.`,
        steps: [md`Propano: apolar, só London.`, md`Propanona: polar, dipolo permanente.`, md`Propan-1-ol: ligação de hidrogênio.`, md`Ácido propanoico: ligações de hidrogênio mais intensas (dímeros).`, md`Ordem: propano < propanona < propan-1-ol < ácido propanoico.`],
      },
      {
        title: 'Geometria e polaridade',
        prompt: md`Classifique a molécula de NCl₃ quanto à geometria e à polaridade.`,
        steps: [md`N central com 3 ligações e 1 par isolado.`, md`Geometria piramidal; dipolos não se anulam: molécula polar.`],
      },
    ],
    discursive: {
      prompt: md`Etanol (CH₃CH₂OH) e éter dimetílico (CH₃OCH₃) têm a mesma massa molar, mas o etanol ferve a 78 °C e o éter a −24 °C. (a) Explique a diferença. (b) Qual deles é mais solúvel em água? Justifique.`,
      modelAnswer: [md`(a) O etanol tem H ligado a O e forma ligações de hidrogênio entre suas moléculas; o éter não tem H ligado a O e suas moléculas interagem por dipolo permanente, mais fraco. Separar as moléculas do etanol exige mais energia.`, md`(b) O etanol, porque forma ligações de hidrogênio com a água.`],
      scoring: [md`Nomeia ligação de hidrogênio e justifica pela presença de O–H.`, md`Compara com a interação do éter e relaciona força à temperatura de ebulição.`, md`Justifica a solubilidade pela interação com a água.`],
    },
    traps: [
      { trap: md`Achar que ferver rompe ligações covalentes.`, fix: md`Ferver rompe interações entre moléculas.` },
      { trap: md`Concluir que toda molécula com ligações polares é polar.`, fix: md`Depende da geometria: CO₂ e CCl₄ são apolares.` },
      { trap: md`Achar que qualquer H forma ligação de hidrogênio.`, fix: md`Só H ligado a F, O ou N.` },
    ],
  },

  'qui_estequiometria::Separação de Misturas': {
    howItFalls: md`Caiu em 2023, 2025 e 2026, sempre com tabela de propriedades (densidade, temperatura de fusão, solubilidade em dois solventes) e um esquema de separação para identificar o que sai em cada etapa.`,
    explanation: md`### A ideia
Separar uma mistura é explorar uma **propriedade em que os componentes diferem**: tamanho de partícula, densidade, solubilidade, temperatura de ebulição, magnetismo. Escolha o método olhando para a diferença, não para os nomes.

### Misturas heterogêneas
- **Filtração**: sólido não dissolvido + líquido (areia e água).
- **Decantação**: deixa o mais denso ir ao fundo. Para dois líquidos imiscíveis, use o **funil de decantação**: o de menor densidade fica em cima.
- **Centrifugação**: acelera a decantação (sangue: plasma e células).
- **Separação magnética**: ferro e areia.

### Misturas homogêneas
- **Evaporação**: recupera o sólido dissolvido e perde o solvente (salinas).
- **Destilação simples**: sólido dissolvido em líquido; recupera o líquido.
- **Destilação fracionada**: líquidos miscíveis com temperaturas de ebulição diferentes (petróleo, álcool e água).
- **Liquefação e destilação do ar**: separa N₂ e O₂.

### Dissolução fracionada
Usa um solvente que dissolve só um componente. Depois, filtra-se o que não dissolveu e evapora-se o solvente para recuperar o dissolvido. A regra é a polaridade: água dissolve sais e compostos polares; dissulfeto de carbono (CS₂) e CCl₄ dissolvem substâncias apolares, como o enxofre.

### Ler a tabela
- Estado físico a 25 °C: se a fusão está abaixo e a ebulição acima, é líquido.
- Objeto que boia ou afunda num líquido: compare as densidades.`,
    applications: [
      md`**Indústria**: refino do petróleo, obtenção de sal, purificação de água.`,
      md`**Laboratório e saúde**: centrifugação do sangue, cromatografia.`,
      md`**Ambiente**: tratamento de água (decantação, filtração) e de esgoto.`,
      md`**Interações intermoleculares**: explicam a solubilidade e os pontos de ebulição usados na separação.`,
    ],
    strategy: [
      md`Liste os componentes e a propriedade que diferencia cada par.`,
      md`Siga o esquema etapa por etapa, anotando o que fica retido e o que passa.`,
      md`Em dois líquidos imiscíveis, o menos denso vai para cima.`,
    ],
    examples: [
      {
        title: 'Camadas',
        prompt: md`Num tubo há água (1,00 g/cm³), óleo (0,92 g/cm³) e areia. Como ficam as fases e como separar?`,
        steps: [md`Areia, mais densa, no fundo; óleo, menos denso que a água, em cima.`, md`Filtre a areia e separe óleo e água no funil de decantação.`],
      },
      {
        title: 'Dissolução fracionada',
        prompt: md`Mistura de sal (NaCl), enxofre e areia. Proponha uma separação.`,
        steps: [md`Adicione água: o sal dissolve; filtre e evapore o filtrado para recuperar o sal.`, md`No resíduo (enxofre + areia), adicione CS₂: o enxofre dissolve; filtre e evapore o CS₂ para recuperar o enxofre.`, md`A areia fica no filtro.`],
      },
    ],
    discursive: {
      prompt: md`Uma mistura contém álcool etílico (ebulição 78 °C), água (100 °C) e areia. (a) Que método separa a areia? (b) Que método separa álcool e água, e qual sai primeiro? Justifique.`,
      modelAnswer: [md`(a) Filtração: a areia não se dissolve e fica retida no filtro.`, md`(b) Destilação fracionada, porque são líquidos miscíveis com temperaturas de ebulição diferentes; o álcool, de menor temperatura de ebulição, destila primeiro.`],
      scoring: [md`Nomeia filtração e justifica pela insolubilidade.`, md`Nomeia a destilação **fracionada** (não simples).`, md`Indica a ordem de saída pela temperatura de ebulição.`],
    },
    traps: [
      { trap: md`Achar que o líquido com mais massa fica embaixo.`, fix: md`Quem decide é a densidade.` },
      { trap: md`Usar destilação simples para dois líquidos miscíveis.`, fix: md`Use a fracionada.` },
    ],
  },

  'qui_oxirreducao::Processos de Oxirredução': {
    howItFalls: md`Caiu em 2022, 2023 e 2026: Nox do Mn no permanganato, quem oxida e quem reduz na queima da pólvora negra e a variação de Nox do cloro numa reação com hipoclorito. E a oxirredução é a base das **pilhas**, que caíram nas discursivas dos 5 anos.`,
    explanation: md`### Número de oxidação (Nox)
É a carga que o átomo teria se todos os elétrons de cada ligação ficassem com o átomo mais eletronegativo. É uma contabilidade, não uma carga real.

### Regras, na ordem de prioridade
1. Substância simples: Nox = 0 (O₂, Fe, Cl₂).
2. Íon monoatômico: Nox = carga (Na⁺ = +1, Cl⁻ = −1).
3. Metais alcalinos (grupo 1) = +1; alcalino-terrosos (grupo 2) = +2.
4. H = +1 (exceto em hidretos metálicos, como NaH, em que é −1).
5. O = −2 (exceto em peróxidos, como H₂O₂, em que é −1).
6. A soma dos Nox é 0 numa molécula e igual à carga num íon.

### Oxidação e redução
- **Oxidação**: perda de elétrons, **Nox aumenta**.
- **Redução**: ganho de elétrons, **Nox diminui**.
- Uma não existe sem a outra: os elétrons que um perde, o outro ganha.

### Agentes
- **Agente oxidante**: provoca a oxidação do outro; por isso **ele se reduz**.
- **Agente redutor**: provoca a redução do outro; por isso **ele se oxida**.

### Como achar quem mudou
Calcule o Nox de cada elemento nos reagentes e nos produtos. Na pólvora negra ($10\,\text{KNO}_3 + 3\,\text{S} + 8\,\text{C}$), o N vai de +5 a 0 (reduz), o S vai de 0 a +6 e o C de 0 a +4 (oxidam).`,
    formulas: [
      { tex: String.raw`\sum \text{Nox} = \text{carga da espécie}`, meaning: md`Zero na molécula neutra; igual à carga no íon.` },
    ],
    applications: [
      md`**Pilhas e baterias**: o ânodo oxida e o cátodo reduz (discursivas de 2022 a 2026).`,
      md`**Corrosão e ânodo de sacrifício**: o ferro oxida; um metal mais reativo oxida em seu lugar.`,
      md`**Bafômetro**: o etanol oxida e o dicromato (laranja) reduz a Cr³⁺ (verde).`,
      md`**Biologia**: respiração celular e fotossíntese são cadeias de oxirredução.`,
      md`**Análise química**: titulação com permanganato.`,
    ],
    strategy: [
      md`Escreva os Nox de todos os elementos acima da equação.`,
      md`Marque quem subiu (oxidou) e quem desceu (reduziu).`,
      md`O agente é a **substância** inteira que contém o elemento que mudou.`,
    ],
    examples: [
      {
        title: 'Nox num íon',
        prompt: md`Qual o Nox do cromo no dicromato, $\text{Cr}_2\text{O}_7^{2-}$?`,
        steps: [md`Oxigênios: $7 \times (-2) = -14$.`, md`$2x - 14 = -2$.`, md`$x = +6$.`],
      },
      {
        title: 'Oxidante e redutor',
        prompt: md`Na reação $\text{Zn} + \text{Cu}^{2+} \rightarrow \text{Zn}^{2+} + \text{Cu}$, identifique quem se oxida, quem se reduz e os agentes.`,
        steps: [md`Zn: 0 → +2, oxida; é o agente redutor.`, md`Cu²⁺: +2 → 0, reduz; é o agente oxidante.`],
      },
    ],
    discursive: {
      prompt: md`No bafômetro, o etanol ($\text{C}_2\text{H}_5\text{OH}$) é oxidado a ácido acético ($\text{CH}_3\text{COOH}$) pelo dicromato, que vira $\text{Cr}^{3+}$. (a) Qual a variação de Nox do cromo? (b) Qual é o agente oxidante? (c) Por que a cor muda?`,
      modelAnswer: [md`(a) No dicromato o Cr tem Nox +6; em Cr³⁺, +3: variação de −3 (redução).`, md`(b) O dicromato, porque contém o cromo, que se reduz.`, md`(c) O dicromato é laranja e o Cr³⁺ é verde; a mudança indica a presença de álcool no ar expirado.`],
      scoring: [md`Calcula os dois Nox com a soma igual à carga.`, md`Identifica o oxidante como a espécie que se reduz.`, md`Relaciona a mudança de cor à mudança de espécie do cromo.`],
    },
    traps: [
      { trap: md`Igualar a soma dos Nox a zero num íon.`, fix: md`Num íon, a soma é igual à carga.` },
      { trap: md`Chamar de oxidante quem se oxida.`, fix: md`O oxidante se reduz.` },
      { trap: md`Dar o elemento como agente.`, fix: md`O agente é a substância (o dicromato, não "o cromo").` },
    ],
  },

  'qui_cinetica::Cinética Química': {
    howItFalls: md`Caiu em 2022, 2023 e 2025: experimentos com lâmina ou palha de aço em ácido de concentrações e temperaturas diferentes, diagrama de energia com dois caminhos e sistemas com mais moléculas no mesmo volume. Nas discursivas, apareceu a lei de velocidade (2024).`,
    explanation: md`### Teoria das colisões
Uma reação só acontece quando as partículas **colidem** com **energia suficiente** (pelo menos a energia de ativação, $E_a$) e com **orientação adequada**. A velocidade depende de quantas colisões assim acontecem por segundo.

### Os quatro fatores
1. **Temperatura**: mais temperatura, partículas mais rápidas, mais colisões com energia acima de $E_a$. É o fator mais forte.
2. **Concentração** (ou pressão, para gases): mais partículas no mesmo volume, mais colisões.
3. **Superfície de contato**: sólido dividido (pó, palha) expõe mais partículas ao outro reagente que o mesmo sólido inteiro (lâmina, bloco).
4. **Catalisador**: oferece um caminho com $E_a$ menor. Não é consumido e **não muda o ΔH**.

### Diagrama de energia
- $E_a$ = do nível dos reagentes até o topo da curva (complexo ativado).
- $\Delta H$ = produtos − reagentes. Negativo se os produtos estão abaixo (exotérmica).
- Com catalisador, o topo fica mais baixo, mas reagentes e produtos ficam no mesmo lugar.

### Lei de velocidade
Para $a\text{A} + b\text{B} \rightarrow$ produtos, $v = k[\text{A}]^x[\text{B}]^y$. Os expoentes $x$ e $y$ (ordens) **saem de experimentos**, não da equação balanceada (exceto em reação elementar). Método: compare dois experimentos em que só a concentração de um reagente muda e veja quanto a velocidade muda.`,
    formulas: [
      { tex: String.raw`v = k\,[\text{A}]^{x}\,[\text{B}]^{y}`, meaning: md`$k$ depende da temperatura; $x$ e $y$ são as ordens, obtidas experimentalmente.` },
      { tex: String.raw`E_a = E_{\text{complexo ativado}} - E_{\text{reagentes}}`, meaning: md`Lida no diagrama, a partir dos reagentes.` },
      { tex: String.raw`\Delta H = H_{\text{produtos}} - H_{\text{reagentes}}`, meaning: md`Não depende do caminho: o catalisador não muda.` },
    ],
    applications: [
      md`**Cotidiano**: geladeira conserva alimento (temperatura baixa), lenha em lascas pega fogo mais rápido (superfície).`,
      md`**Biologia**: enzimas são catalisadores biológicos; temperatura e pH alteram sua atividade.`,
      md`**Ambiente**: conversores catalíticos dos carros.`,
      md`**Equilíbrio**: o catalisador acelera a chegada ao equilíbrio sem deslocá-lo.`,
    ],
    strategy: [
      md`Faça uma tabela com os fatores de cada experimento e marque o favorável.`,
      md`O mais rápido é o que reúne mais fatores favoráveis; compare dois a dois quando só um fator muda.`,
      md`No diagrama, meça sempre a partir dos reagentes.`,
      md`Na lei de velocidade, dobre uma concentração e veja o efeito: dobrou → ordem 1; quadruplicou → ordem 2; não mudou → ordem 0.`,
    ],
    examples: [
      {
        title: 'Fatores',
        prompt: md`Qual produz H₂ mais rápido? (1) zinco em grânulos, HCl 1 mol/L, 25 °C; (2) zinco em pó, HCl 2 mol/L, 40 °C; (3) zinco em grânulos, HCl 2 mol/L, 40 °C.`,
        steps: [md`(3) supera (1): mesma superfície, mais concentração e temperatura.`, md`(2) supera (3): mesma concentração e temperatura, mais superfície.`, md`O mais rápido é o (2).`],
      },
      {
        title: 'Ordem de reação',
        prompt: md`Ao dobrar $[\text{A}]$ com $[\text{B}]$ fixo, a velocidade quadruplica; ao dobrar $[\text{B}]$ com $[\text{A}]$ fixo, ela dobra. Escreva a lei de velocidade.`,
        steps: [md`$2^x = 4 \Rightarrow x = 2$.`, md`$2^y = 2 \Rightarrow y = 1$.`, md`$v = k[\text{A}]^2[\text{B}]$.`],
      },
    ],
    discursive: {
      prompt: md`A decomposição da água oxigenada é lenta, mas fica rápida ao se adicionar um pouco de iodeto ou a enzima catalase. (a) Explique o papel desses aditivos usando um diagrama de energia. (b) O ΔH da reação muda? Justifique.`,
      modelAnswer: [md`(a) São catalisadores: oferecem um caminho de reação com energia de ativação menor, de modo que mais colisões têm energia suficiente e a velocidade aumenta. No diagrama, o topo da curva fica mais baixo.`, md`(b) Não. O ΔH depende só das energias de reagentes e produtos, que não mudam.`],
      scoring: [md`Nomeia catalisador e energia de ativação.`, md`Relaciona menor $E_a$ a mais colisões efetivas.`, md`Justifica que o ΔH não muda pelos estados inicial e final.`],
    },
    traps: [
      { trap: md`Dizer que o catalisador altera o ΔH.`, fix: md`Ele só diminui a energia de ativação.` },
      { trap: md`Tirar as ordens da equação balanceada.`, fix: md`Ordens vêm do experimento (salvo reação elementar).` },
      { trap: md`Ler $E_a$ a partir do zero do gráfico.`, fix: md`Meça a partir dos reagentes.` },
    ],
  },

  'fis_estatica::Hidrostática: Densidade e Pressão': {
    howItFalls: md`Caiu em 4 dos 5 anos (2022–2025), em cenas do cotidiano: medir a densidade de uma maçã pela água deslocada numa proveta, uma fruta boiando que o peixe puxa para baixo, um copo cheio que transborda quando um objeto flutua e um recipiente que enche e faz a pressão no fundo subir.`,
    explanation: md`### Densidade
$d = m/V$. Para um sólido irregular, o volume se mede pela água que ele **desloca** quando está **totalmente** submerso (a diferença de leitura na proveta).

### Pressão hidrostática
A pressão no fundo de um líquido vem do peso da coluna de líquido acima. Por isso só depende da **profundidade** $h$, da densidade do líquido e de $g$, e não da forma do recipiente nem da quantidade de líquido. Se o nível sobe a uma taxa constante, a pressão sobe a uma taxa $d\,g\,\frac{\Delta h}{\Delta t}$.

### Empuxo (Arquimedes)
Um corpo mergulhado recebe uma força para cima igual ao **peso do líquido que ele desloca**. Por isso o empuxo usa o volume **submerso**, não o volume do corpo.

### Flutuação
Um corpo em equilíbrio boiando tem $E = P$. Daí saem duas consequências que a Famerp adora:
1. **Fração submersa** $= \dfrac{d_{\text{corpo}}}{d_{\text{líquido}}}$. Gelo ($0{,}92$) em água fica com 92% submerso.
2. **Massa de líquido deslocado = massa do corpo**. Num copo cheio até a borda, a água que transborda pesa o mesmo que o objeto que passa a flutuar.

### Força para afundar
Para mergulhar totalmente um corpo que flutua, é preciso a força extra $F = E_{\text{total}} - P$, em que $E_{\text{total}}$ é o empuxo com o corpo inteiro submerso.`,
    formulas: [
      { tex: String.raw`d = \frac{m}{V}`, meaning: md`Em g/cm³ ou kg/m³. $1\ \text{g/cm}^3 = 1\ \text{g/mL} = 10^3\ \text{kg/m}^3$.` },
      { tex: String.raw`p = p_0 + d\,g\,h`, meaning: md`Pressão a uma profundidade $h$; $p_0$ é a pressão na superfície. A parte $d\,g\,h$ é a pressão hidrostática.` },
      { tex: String.raw`E = d_{\text{líq}}\,V_{\text{sub}}\,g`, meaning: md`Empuxo: densidade do **líquido** e volume **submerso**.` },
      { tex: String.raw`\frac{V_{\text{sub}}}{V} = \frac{d_{\text{corpo}}}{d_{\text{líq}}}`, meaning: md`Fração submersa de um corpo que flutua em equilíbrio.` },
    ],
    applications: [
      md`**Saúde**: medida de pressão arterial, soro posicionado acima do braço, mergulho e descompressão.`,
      md`**Cotidiano**: navios flutuam por deslocarem muita água; submarinos ajustam a densidade com tanques de lastro.`,
      md`**Biologia**: bexiga natatória dos peixes regula a flutuação.`,
      md`**Discursiva**: o salto ornamental de 2026 juntou energia, empuxo e trabalho.`,
    ],
    strategy: [
      md`Desenhe o corpo com $P$ para baixo e $E$ para cima.`,
      md`Pergunte se o corpo está boiando (use $E = P$) ou totalmente submerso (use o volume inteiro).`,
      md`Converta tudo para o SI antes de multiplicar por $g$ e $h$.`,
    ],
    examples: [
      {
        title: 'Força para afundar',
        prompt: md`Uma fruta de 100 g flutua com 80% do volume submerso ($g = 10\ \text{m/s}^2$). Qual a força mínima para afundá-la totalmente?`,
        steps: [md`Boiando: $E = P = 0{,}1 \times 10 = 1{,}0$ N, que corresponde a 80% do volume.`, md`Totalmente submersa: $E_{\text{total}} = \dfrac{1{,}0}{0{,}8} = 1{,}25$ N.`, md`$F = E_{\text{total}} - P = 0{,}25$ N.`],
      },
      {
        title: 'Taxa de pressão',
        prompt: md`O nível de água num tanque sobe 2,0 cm por minuto ($d = 10^3\ \text{kg/m}^3$, $g = 10\ \text{m/s}^2$). A que taxa aumenta a pressão no fundo?`,
        steps: [md`$\Delta h/\Delta t = 0{,}02$ m/min.`, md`$\Delta p/\Delta t = d\,g\,\Delta h/\Delta t = 10^3 \cdot 10 \cdot 0{,}02 = 200$ Pa/min.`],
      },
    ],
    discursive: {
      prompt: md`Um bloco de madeira de 600 g e densidade $0{,}6\ \text{g/cm}^3$ flutua em água ($1{,}0\ \text{g/cm}^3$). (a) Que fração do volume fica submersa? (b) Qual o empuxo? (c) Que massa máxima pode ser colocada sobre o bloco sem que ele afunde?`,
      modelAnswer: [md`(a) $\dfrac{V_{\text{sub}}}{V} = \dfrac{0{,}6}{1{,}0} = 60\%$.`, md`(b) Em equilíbrio, $E = P = 0{,}6 \times 10 = 6$ N.`, md`(c) Volume do bloco: $600/0{,}6 = 1000\ \text{cm}^3$. Totalmente submerso, desloca 1000 g de água, que sustentam 1000 g no total; a massa extra é $1000 - 600 = 400$ g.`],
      scoring: [md`Usa a razão de densidades.`, md`Justifica $E = P$ pelo equilíbrio.`, md`Calcula o volume e o limite pela água deslocada, com unidades.`],
    },
    traps: [
      { trap: md`Usar o volume total no empuxo de um corpo que flutua.`, fix: md`Empuxo usa o volume submerso.` },
      { trap: md`Achar que a pressão no fundo depende da largura do recipiente.`, fix: md`Só depende da profundidade, do líquido e de $g$.` },
      { trap: md`Misturar g/cm³ com kg/m³.`, fix: md`Converta para o SI antes da conta.` },
    ],
  },

  'fis_cinematica::Movimento Uniforme': {
    howItFalls: md`Caiu de 2024 a 2026 em esporte e transporte: chute a 108 km/h, distância entre velocistas na chegada, quantos ônibus manter numa linha e o significado da área sob a curva de um gráfico. Nas discursivas, cinemática aparece todo ano, quase sempre já com aceleração.`,
    explanation: md`### Velocidade constante
No movimento uniforme (MU), o corpo percorre distâncias iguais em tempos iguais. A velocidade é a razão $\Delta s / \Delta t$ e o gráfico $s \times t$ é uma reta.

### Conversão
$1\ \text{m/s} = 3{,}6\ \text{km/h}$. Para passar de km/h para m/s, divida por 3,6. Quase toda questão de MU da Famerp mistura as unidades de propósito.

### Encontros e distâncias
- Dois corpos no mesmo sentido: a distância muda com a **diferença** das velocidades.
- Em sentidos opostos: com a **soma**.
- Dois atletas que terminam com a mesma velocidade, um $\Delta t$ depois do outro: quando o primeiro cruza a linha, o segundo está a $v\,\Delta t$ dela.

### Área sob o gráfico
- Em $v \times t$, a área é o **deslocamento**.
- Em $a \times t$, a área é a **variação de velocidade**.
- Em $F \times t$, a área é o **impulso**.
Antes de responder, leia o que está em cada eixo.

### Frota de uma linha circular
Se uma volta leva $T$ e os ônibus saem a cada intervalo $\Delta t$, a frota mínima é $T / \Delta t$, **arredondada para cima**.`,
    formulas: [
      { tex: String.raw`v = \frac{\Delta s}{\Delta t}`, meaning: md`Velocidade média; no MU, é a velocidade em todo instante.` },
      { tex: String.raw`s = s_0 + v\,t`, meaning: md`Função horária do MU: posição em cada instante.` },
      { tex: String.raw`v\,[\text{m/s}] = \frac{v\,[\text{km/h}]}{3{,}6}`, meaning: md`Conversão de unidades.` },
    ],
    applications: [
      md`**Trânsito**: distância de reação (velocidade × tempo de reação), radares por trecho.`,
      md`**Esportes**: ritmo de corrida, diferença entre atletas.`,
      md`**Óptica e ondas**: luz e som em meio homogêneo se propagam em MU; ecolocalização e ultrassom.`,
      md`**Gráficos em geral**: interpretar área e inclinação vale em várias matérias.`,
    ],
    strategy: [
      md`Converta as unidades antes de qualquer conta.`,
      md`Escreva a função horária de cada corpo com o mesmo referencial.`,
      md`Em gráfico, identifique os eixos e decida se a resposta é área ou inclinação.`,
    ],
    examples: [
      {
        title: 'Conversão',
        prompt: md`Uma bola sai a 90 km/h e chega ao gol em 0,5 s, em velocidade constante. Qual a distância?`,
        steps: [md`$90 / 3{,}6 = 25\ \text{m/s}$.`, md`$\Delta s = 25 \times 0{,}5 = 12{,}5$ m.`],
      },
      {
        title: 'Frota',
        prompt: md`Uma linha circular tem 18 km, os ônibus fazem média de 24 km/h e saem a cada 15 min. Qual a frota mínima?`,
        steps: [md`Tempo de volta: $18/24 = 0{,}75$ h $= 45$ min.`, md`$45/15 = 3$ ônibus.`],
      },
    ],
    discursive: {
      prompt: md`Dois corredores terminam uma prova de 100 m em 9,80 s e 9,95 s, ambos com velocidade final constante de 11 m/s. (a) Qual a distância entre eles quando o vencedor cruza a linha? (b) Qual a velocidade média do vencedor em km/h?`,
      modelAnswer: [md`(a) O segundo chega $\Delta t = 0{,}15$ s depois, a 11 m/s: $d = 11 \times 0{,}15 = 1{,}65$ m.`, md`(b) $v_m = \dfrac{100}{9{,}80} \approx 10{,}2\ \text{m/s} \approx 36{,}7$ km/h.`],
      scoring: [md`Usa a diferença de tempo com a velocidade final.`, md`Calcula a velocidade média pela distância total e converte a unidade.`],
    },
    traps: [
      { trap: md`Multiplicar km/h por segundos.`, fix: md`Converta para m/s antes.` },
      { trap: md`Arredondar a frota para baixo.`, fix: md`Frota é sempre arredondada para cima.` },
      { trap: md`Confundir velocidade média com a média das velocidades.`, fix: md`Velocidade média = distância total / tempo total.` },
    ],
  },

  'fis_calorimetria::Calor Sensível e Calor Latente': {
    howItFalls: md`Caiu em 2023, 2024 e 2026: equilíbrio térmico de bebida com um sachê, ebulidor numa cidade de altitude onde a água ferve abaixo de 100 °C e gelo resfriando garrafas. Nas discursivas, termologia caiu nos 5 anos (gelo–água em 2025).`,
    explanation: md`### Calor é energia em trânsito
Calor flui do corpo mais quente para o mais frio até as temperaturas se igualarem (equilíbrio térmico).

### Calor sensível
Muda a **temperatura**. Depende da massa, do material (calor específico $c$) e da variação de temperatura. A capacidade térmica $C = m\,c$ é o calor para variar 1 °C o corpo inteiro.

### Calor latente
Muda o **estado físico** com a temperatura **constante**. Enquanto o gelo derrete a 0 °C, todo o calor recebido vai para a mudança de estado. Fusão do gelo: $L = 80$ cal/g; vaporização da água: $L = 540$ cal/g.

### Equilíbrio em sistema isolado
A soma de todos os calores é zero: o que um cede, o outro recebe. Use calor **cedido negativo** e **recebido positivo**, ou escreva "calor cedido = calor recebido" com valores positivos.

### Gelo: o teste que evita o erro
Antes do balanço, verifique se o calor disponível derrete **todo** o gelo. Se não derrete, a temperatura final é 0 °C e sobra gelo.

### Potência constante
Se uma fonte fornece calor à taxa $P$, o tempo é proporcional ao calor necessário: $\Delta t = Q/P$. Em altitude, a pressão é menor e a água ferve abaixo de 100 °C; o $\Delta T$ até a ebulição é menor, e o tempo também.`,
    formulas: [
      { tex: String.raw`Q = m\,c\,\Delta T`, meaning: md`Calor sensível; $c_{\text{água}} = 1$ cal/(g·°C).` },
      { tex: String.raw`Q = m\,L`, meaning: md`Calor latente; sem variação de temperatura.` },
      { tex: String.raw`C = m\,c \quad\Rightarrow\quad Q = C\,\Delta T`, meaning: md`Capacidade térmica do corpo inteiro.` },
      { tex: String.raw`\sum Q = 0`, meaning: md`Sistema isolado: calores cedidos e recebidos se anulam.` },
      { tex: String.raw`P = \frac{Q}{\Delta t}`, meaning: md`Potência térmica da fonte.` },
    ],
    applications: [
      md`**Saúde**: suor resfria o corpo porque a evaporação absorve calor latente; compressa de gelo.`,
      md`**Clima**: o alto calor específico da água modera a temperatura de cidades litorâneas (maritimidade).`,
      md`**Cozinha**: panela de pressão cozinha mais rápido porque a água ferve acima de 100 °C.`,
      md`**Biologia**: a água como regulador térmico dos seres vivos.`,
    ],
    strategy: [
      md`Liste quem cede e quem recebe calor.`,
      md`Com gelo, teste primeiro se ele derrete todo.`,
      md`Monte o balanço numa única equação e resolva para a temperatura final.`,
    ],
    examples: [
      {
        title: 'Gelo e água',
        prompt: md`200 g de água a 30 °C recebem 50 g de gelo a 0 °C ($L = 80$ cal/g). Qual a temperatura final?`,
        steps: [md`Derreter todo o gelo: $50 \times 80 = 4000$ cal. A água pode ceder até $200 \times 30 = 6000$ cal: o gelo derrete todo.`, md`$200\,(30 - T) = 4000 + 50\,T$.`, md`$6000 - 200T = 4000 + 50T \Rightarrow T = 8\ ^\circ\text{C}$.`],
      },
      {
        title: 'Altitude',
        prompt: md`Um ebulidor leva 12 min para aquecer água de 20 °C a 100 °C. Numa cidade onde a água ferve a 80 °C, quanto tempo leva com a mesma potência e a mesma massa?`,
        steps: [md`O tempo é proporcional a $\Delta T$: 80 °C contra 60 °C.`, md`$t = 12 \times \dfrac{60}{80} = 9$ min.`],
      },
    ],
    discursive: {
      prompt: md`Para resfriar um suco de 300 g a 25 °C, colocam-se 30 g de gelo a 0 °C. Considere o calor específico do suco igual ao da água e despreze trocas com o ambiente. (a) Todo o gelo derrete? Justifique com cálculo. (b) Qual a temperatura final?`,
      modelAnswer: [md`(a) Derreter todo o gelo exige $30 \times 80 = 2400$ cal. O suco pode ceder até $300 \times 25 = 7500$ cal até 0 °C. Como 7500 > 2400, todo o gelo derrete.`, md`(b) $300\,(25 - T) = 2400 + 30\,T \Rightarrow 7500 - 300T = 2400 + 30T \Rightarrow T \approx 15{,}5\ ^\circ\text{C}$.`],
      scoring: [md`Compara o calor disponível com o necessário para a fusão.`, md`Inclui o calor latente e o aquecimento da água de fusão.`, md`Resultado com unidade.`],
    },
    traps: [
      { trap: md`Esquecer o calor latente na fusão do gelo.`, fix: md`A mudança de estado consome $m\,L$ antes de a temperatura subir.` },
      { trap: md`Esquecer de aquecer a água que veio do gelo.`, fix: md`Depois de derreter, essa água também vai de 0 °C até $T$.` },
      { trap: md`Supor que toda água ferve a 100 °C.`, fix: md`A temperatura de ebulição cai com a altitude.` },
    ],
  },

  'fis_fisica_moderna::Noções Básicas de Física Quântica': {
    howItFalls: md`Caiu em 2023, 2025 e 2026: quais cores de luz arrancam elétrons de um metal, a energia cinética dos elétrons ao trocar de metal e a energia absorvida numa transição eletrônica no modelo de Bohr. Nas discursivas, efeito fotoelétrico apareceu em 2022.`,
    explanation: md`### A luz em pacotes
A luz é formada por **fótons**, cada um com energia $E = h\,f$. A energia depende só da **frequência**: violeta > azul > verde > amarelo > vermelho. Luz mais intensa tem **mais** fótons, não fótons mais energéticos.

### Efeito fotoelétrico
Um elétron só sai do metal se **um único fóton** tiver energia pelo menos igual à **função trabalho** $W$ do metal. O que sobra vira energia cinética do elétron:
$$E_c = h\,f - W$$
- Abaixo da frequência de corte $f_0 = W/h$, nenhum elétron sai, por mais intensa que seja a luz.
- Acima dela, aumentar a intensidade aumenta o **número** de elétrons; aumentar a frequência aumenta a **energia** de cada um.
- Mesma luz em metais diferentes: o fóton tem a mesma energia, e a diferença das $E_c$ é a diferença das funções trabalho.

### Modelo de Bohr
No átomo de hidrogênio, o elétron só ocupa níveis de energia permitidos, $E_n = -13{,}6/n^2$ eV. Para **subir** de nível, absorve exatamente a diferença de energia; ao **descer**, emite um fóton com essa energia. Isso explica os espectros de linhas e as cores dos fogos de artifício e das luzes de neon.`,
    formulas: [
      { tex: String.raw`E = h\,f = \frac{h\,c}{\lambda}`, meaning: md`Energia do fóton. $h = 6{,}6\times10^{-34}$ J·s $= 4{,}1\times10^{-15}$ eV·s.` },
      { tex: String.raw`E_c = h\,f - W`, meaning: md`Energia cinética máxima do elétron arrancado; $W$ é a função trabalho do metal.` },
      { tex: String.raw`f_0 = \frac{W}{h}`, meaning: md`Frequência de corte: abaixo dela não há emissão.` },
      { tex: String.raw`E_n = -\frac{13{,}6}{n^2}\ \text{eV}, \qquad \Delta E = E_{\text{final}} - E_{\text{inicial}}`, meaning: md`Níveis do hidrogênio; $\Delta E > 0$ é absorção.` },
    ],
    applications: [
      md`**Tecnologia**: células fotovoltaicas, sensores de portas automáticas, câmeras digitais.`,
      md`**Saúde**: radiação UV (mais energética) causa danos ao DNA; a infravermelha não.`,
      md`**Química**: teste de chama e modelos atômicos (Bohr) explicam as cores emitidas por cada elemento.`,
      md`**Ondas**: $c = \lambda f$ conecta frequência e comprimento de onda.`,
    ],
    strategy: [
      md`Calcule a energia do fóton (ou a frequência de corte) antes de olhar as alternativas.`,
      md`Compare com $W$: emite se $h\,f \geq W$.`,
      md`Em Bohr, escreva os dois níveis e subtraia na ordem final − inicial.`,
    ],
    examples: [
      {
        title: 'Frequência de corte',
        prompt: md`Um metal tem $W = 2{,}9$ eV ($h = 4{,}1\times10^{-15}$ eV·s). Entre vermelho ($4{,}5$), verde ($5{,}5$) e violeta ($7{,}5$), em $10^{14}$ Hz, quais luzes arrancam elétrons?`,
        steps: [md`$f_0 = \dfrac{2{,}9}{4{,}1\times10^{-15}} \approx 7{,}1\times10^{14}$ Hz.`, md`Só a violeta supera $f_0$.`],
      },
      {
        title: 'Bohr',
        prompt: md`Quanta energia absorve o elétron do hidrogênio ao passar de $n = 1$ para $n = 2$?`,
        steps: [md`$E_1 = -13{,}6$ eV; $E_2 = -13{,}6/4 = -3{,}4$ eV.`, md`$\Delta E = -3{,}4 - (-13{,}6) = 10{,}2$ eV.`],
      },
    ],
    discursive: {
      prompt: md`Luz de frequência $1{,}0\times10^{15}$ Hz incide sobre um metal de função trabalho 2,3 eV ($h = 4{,}1\times10^{-15}$ eV·s). (a) Calcule a energia cinética máxima dos elétrons. (b) O que acontece com essa energia e com o número de elétrons se a intensidade da luz dobrar?`,
      modelAnswer: [md`(a) $E = h\,f = 4{,}1$ eV; $E_c = 4{,}1 - 2{,}3 = 1{,}8$ eV.`, md`(b) A energia cinética máxima não muda, pois depende da frequência; o número de elétrons emitidos dobra, pois há o dobro de fótons.`],
      scoring: [md`Calcula a energia do fóton e subtrai a função trabalho, com unidade.`, md`Separa o efeito da intensidade (número) do da frequência (energia).`],
    },
    traps: [
      { trap: md`Achar que luz mais intensa arranca elétrons mais rápidos.`, fix: md`Intensidade aumenta o número; a energia depende da frequência.` },
      { trap: md`Errar a divisão por potência de 10.`, fix: md`Agrupe o denominador: $W/(h)$, com $h$ inteiro entre parênteses.` },
      { trap: md`Inverter o sinal na transição de Bohr.`, fix: md`Subir de nível absorve; descer emite.` },
    ],
  },
};
