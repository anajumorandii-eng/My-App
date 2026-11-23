// Temas que se repetem nas 40 discursivas de Biologia da Famerp 2022–2026
// (8 por prova). Os anos saem da leitura de src/data/discursiveFamerp20XX.ts;
// as perguntas de treino são autorais, para não entregar as da aba
// Discursivas.

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasBiologia: DiscursiveTheme[] = [
  {
    id: 'bio-genetica',
    subject: 'Biologia',
    title: 'Genética: cruzamentos, herança ligada ao sexo e populações',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano, com 2 a 3 itens por prova**: Hardy-Weinberg no sistema ABO e dominância incompleta (2022), distrofia de Duchenne ligada ao X (2023), cariótipo com translocação (2024), herança quantitativa e corpúsculo de Barr (2025), ligação gênica em *Drosophila* e herança ligada ao Z em aves (2026). É o tema que mais vale ponto no 2º dia.`,
    explanation: md`### Base: alelos e gametas
Cada indivíduo tem dois alelos por gene (um de cada genitor) e passa **um** para cada gameta (1ª lei de Mendel). Escrever os gametas antes do cruzamento evita metade dos erros.

### Tipos de dominância
- **Completa**: Aa tem o fenótipo de AA. Aa × Aa → 3 : 1.
- **Incompleta**: o heterozigoto é intermediário (flor rosa entre vermelha e branca). Aa × Aa → 1 : 2 : 1 em genótipo **e** fenótipo.
- **Codominância**: os dois alelos se expressam (sangue AB).

### Alelos múltiplos: ABO
$I^A = I^B > i$. Tipo A pode ser $I^AI^A$ ou $I^Ai$; tipo O é $ii$. Pais A e B podem ter filho O se ambos forem heterozigotos.

### Herança ligada ao X
Genes no X. O homem (XY) tem um X só: um alelo recessivo já se expressa.
- Pai afetado passa o X para **todas** as filhas e para **nenhum** filho.
- Mãe portadora ($X^AX^a$) passa o alelo para metade dos filhos homens, que serão afetados.
- Exemplos: hemofilia, daltonismo, distrofia de Duchenne.

### Aves: sistema ZW
O macho é **ZZ** e a fêmea é **ZW**: a lógica se inverte. A fêmea expressa qualquer alelo do Z.

### Corpúsculo de Barr
Nas células com mais de um X, todos menos um se inativam e viram o corpúsculo de Barr. Número de corpúsculos $= \text{número de X} - 1$. Mulher XX tem 1; síndrome de Klinefelter (XXY) tem 1; síndrome de Turner (X0) tem 0.

### Alterações cromossômicas
- **Não disjunção** na meiose gera gametas com um cromossomo a mais ou a menos: trissomias (síndrome de Down, 21).
- **Translocação equilibrada**: o portador não tem sintomas, mas forma gametas desequilibrados e pode ter filhos afetados.

### Ligação gênica
Genes no mesmo cromossomo tendem a ir juntos. Os gametas **parentais** são os mais frequentes; os **recombinantes** surgem do crossing-over e sua frequência mede a distância (1% = 1 centimorgan).

### Herança quantitativa
Vários genes somam efeitos (altura, cor de pele, massa do fruto). Com $n$ pares de genes há $2n + 1$ classes de fenótipo, e cada alelo efetivo acrescenta $\dfrac{\text{máximo} - \text{mínimo}}{2n}$.

### Populações: Hardy-Weinberg
Numa população grande, sem seleção, mutação, migração ou deriva, as frequências se mantêm. Comece pela frequência dos homozigotos recessivos, que é observável: $q^2$.`,
    formulas: [
      { tex: String.raw`p + q = 1, \qquad p^2 + 2pq + q^2 = 1`, meaning: md`Hardy-Weinberg: $p^2$ = AA, $2pq$ = Aa, $q^2$ = aa.` },
      { tex: String.raw`p + q + r = 1 \quad (I^A, I^B, i)`, meaning: md`ABO: tipo O $= r^2$; tipo A $= p^2 + 2pr$.` },
      { tex: String.raw`\text{classes} = 2n + 1, \qquad \text{efeito de cada alelo} = \frac{\text{máx} - \text{mín}}{2n}`, meaning: md`Herança quantitativa com $n$ pares de genes.` },
      { tex: String.raw`P(A \text{ e } B) = P(A)\cdot P(B), \qquad P(A \text{ ou } B) = P(A) + P(B)`, meaning: md`Eventos independentes multiplicam; excludentes somam.` },
    ],
    applications: [
      md`**Saúde**: aconselhamento genético, doenças ligadas ao X, transfusão de sangue e eritroblastose fetal.`,
      md`**Evolução**: desvios de Hardy-Weinberg indicam seleção, deriva ou migração.`,
      md`**Biotecnologia**: transgênicos e marcadores (2026 juntou transgenia e herança ligada ao Z).`,
      md`**Matemática**: probabilidade e frações.`,
    ],
    strategy: [
      md`Defina as letras e escreva os genótipos possíveis de cada indivíduo.`,
      md`Use o heredograma: filho afetado de pais normais revela pais heterozigotos.`,
      md`Escreva os gametas e só depois o quadro de cruzamento.`,
      md`Separe "probabilidade de ser menino **e** afetado" de "probabilidade de um menino ser afetado".`,
      md`Na resposta, mostre o cruzamento: a banca dá nota ao caminho.`,
    ],
    examples: [
      {
        title: 'Ligada ao X',
        prompt: md`Mulher de visão normal, filha de pai daltônico, casa com homem de visão normal. Qual a probabilidade de terem um filho homem daltônico?`,
        steps: [md`Ela recebeu o $X^d$ do pai: é $X^DX^d$. Ele é $X^DY$.`, md`Filhos: $X^DX^D$, $X^DX^d$, $X^DY$, $X^dY$, cada um com $\frac14$.`, md`Filho homem daltônico: $\frac14$. Entre os filhos homens, $\frac12$.`],
      },
      {
        title: 'Hardy-Weinberg',
        prompt: md`Numa população em equilíbrio, 16% são aa. Qual a frequência de heterozigotos?`,
        steps: [md`$q^2 = 0{,}16 \Rightarrow q = 0{,}4$; $p = 0{,}6$.`, md`$2pq = 2 \cdot 0{,}6 \cdot 0{,}4 = 0{,}48 = 48\%$.`],
      },
    ],
    discursive: {
      prompt: md`Num casal, a mulher é portadora de um alelo recessivo ligado ao X que causa uma doença muscular, e o homem é normal. (a) Escreva os genótipos do casal. (b) Qual a probabilidade de uma filha ser afetada? E de um filho? (c) Por que a doença é muito mais frequente em homens?`,
      modelAnswer: [md`(a) Mulher $X^AX^a$; homem $X^AY$.`, md`(b) Filhas recebem o $X^A$ do pai: nenhuma afetada (0), metade portadoras. Filhos recebem o Y do pai e um X da mãe: $\frac12$ afetados.`, md`(c) O homem tem um só X; um único alelo recessivo se expressa. A mulher precisaria de dois.`],
      scoring: [md`Genótipos com a notação do X.`, md`Probabilidades separadas por sexo e justificadas pelo cruzamento.`, md`Justificativa da maior frequência em homens pela hemizigose.`],
    },
    traps: [
      { trap: md`Tratar herança ligada ao X como autossômica.`, fix: md`Escreva o X e o Y nos genótipos.` },
      { trap: md`Esquecer que nas aves a fêmea é ZW.`, fix: md`Em ZW, quem expressa o recessivo com um alelo só é a fêmea.` },
      { trap: md`Confundir frequência de alelo com de genótipo.`, fix: md`$q$ é alelo; $q^2$ é genótipo.` },
    ],
  },

  {
    id: 'bio-imunologia',
    subject: 'Biologia',
    title: 'Imunologia',
    years: [2023, 2024, 2026],
    howItFalls: md`Caiu em 2023 (anemia hemolítica autoimune e terapia CAR-T), 2024 (alergia: IgE, mastócitos e anafilaxia) e 2026 (fagocitose pelo macrófago e apresentação de antígeno). Sempre a partir de um caso clínico.`,
    explanation: md`### Duas linhas de defesa
- **Inata**: rápida e inespecífica. Barreiras (pele, mucosas), fagócitos (neutrófilos e macrófagos), inflamação, sistema complemento.
- **Adaptativa**: lenta na primeira vez, específica e com **memória**. Linfócitos B e T.

### Como a resposta adaptativa começa
1. O **macrófago** (ou célula dendrítica) fagocita o invasor e o digere em lisossomos.
2. Exibe pedaços dele (antígenos) na membrana, presos a proteínas do **MHC**: é a **apresentação de antígeno**.
3. O **linfócito T auxiliar (CD4)** reconhece o antígeno e libera citocinas que ativam os outros linfócitos.
4. O **linfócito B** se transforma em **plasmócito** e produz **anticorpos** específicos (imunidade humoral).
5. O **linfócito T citotóxico (CD8)** mata células infectadas ou tumorais (imunidade celular).
6. Ficam **células de memória**, que respondem mais rápido num segundo contato.

### Vacina e soro
- **Vacina**: antígeno → o corpo produz anticorpos e memória. Imunidade **ativa**, lenta e duradoura. Prevenção.
- **Soro**: anticorpos prontos. Imunidade **passiva**, imediata e temporária. Tratamento (picada de cobra).

### Quando o sistema erra
- **Alergia**: resposta exagerada a um antígeno inofensivo. Anticorpos **IgE** se prendem aos **mastócitos**; num novo contato, eles liberam **histamina**: vasodilatação, coceira, broncoconstrição. Na **anafilaxia**, a reação é sistêmica e a pressão cai; trata-se com adrenalina.
- **Autoimunidade**: anticorpos ou linfócitos atacam o próprio corpo. Na anemia hemolítica autoimune, anticorpos marcam as hemácias para destruição.

### Imunoterapia CAR-T
Linfócitos T do paciente são modificados geneticamente para expressar um receptor que reconhece as células do câncer, e depois são devolvidos ao corpo.`,
    applications: [
      md`**Saúde pública**: calendário vacinal, imunidade de rebanho.`,
      md`**Genética**: sistema ABO e Rh, eritroblastose fetal.`,
      md`**Biotecnologia**: anticorpos monoclonais e terapias com células modificadas.`,
      md`**Célula**: fagocitose, lisossomos e membrana.`,
    ],
    strategy: [
      md`Identifique a célula do caso (macrófago, linfócito B, T, mastócito).`,
      md`Diga o que ela faz e qual molécula usa (anticorpo, histamina, citocina).`,
      md`Classifique a imunidade: inata ou adaptativa; ativa ou passiva.`,
    ],
    examples: [
      {
        title: 'Vacina ou soro',
        prompt: md`Uma pessoa picada por cobra deve receber vacina ou soro? Por quê?`,
        steps: [md`Precisa de anticorpos imediatamente.`, md`Soro: traz anticorpos prontos (imunidade passiva). A vacina levaria dias.`],
      },
      {
        title: 'Memória',
        prompt: md`Por que a segunda exposição a um antígeno gera resposta mais rápida?`,
        steps: [md`Na primeira, formam-se linfócitos de memória.`, md`Na segunda, eles se ativam logo e produzem mais anticorpos em menos tempo.`],
      },
    ],
    discursive: {
      prompt: md`Uma pessoa alérgica a amendoim teve uma reação grave, com queda de pressão e dificuldade para respirar. (a) Que classe de anticorpo e que célula estão envolvidas? (b) Explique por que a pressão cai. (c) Por que a primeira exposição ao amendoim não causou reação?`,
      modelAnswer: [md`(a) Anticorpos IgE ligados a mastócitos.`, md`(b) No contato com o alérgeno, os mastócitos liberam histamina, que causa vasodilatação generalizada; o sangue se distribui num volume vascular maior e a pressão cai.`, md`(c) Na primeira exposição houve só a sensibilização: produção de IgE, que se prendeu aos mastócitos. A reação aparece nos contatos seguintes.`],
      scoring: [md`Nomeia IgE e mastócito.`, md`Liga histamina à vasodilatação e à queda de pressão.`, md`Explica a sensibilização prévia.`],
    },
    traps: [
      { trap: md`Dizer que o soro estimula a produção de anticorpos.`, fix: md`O soro já é o anticorpo.` },
      { trap: md`Chamar o linfócito B de produtor direto de anticorpo.`, fix: md`Quem produz é o plasmócito, que vem do linfócito B ativado.` },
      { trap: md`Confundir alergia com autoimunidade.`, fix: md`Alergia: alvo externo inofensivo. Autoimunidade: alvo do próprio corpo.` },
    ],
  },

  {
    id: 'bio-fisiologia-humana',
    subject: 'Biologia',
    title: 'Fisiologia humana',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 2022 (ponte de safena: valvas venosas e circulação coronária), 2024 (sistema nervoso e reflexo patelar), 2025 (pâncreas, glucagon e glicogênio; néfron, ADH e transporte ativo) e 2026 (ativação do pepsinogênio).`,
    explanation: md`### Circulação
O coração bombeia sangue por artérias (paredes grossas, alta pressão) e o recebe por veias (paredes finas, **valvas** que impedem o refluxo). O miocárdio é irrigado pelas **coronárias**; se elas entopem, o músculo fica sem oxigênio (infarto). Na **ponte de safena**, um pedaço da veia safena da perna liga a aorta à coronária depois da obstrução; ela é implantada **invertida** para as valvas não bloquearem o fluxo.

### Sistema nervoso: arco reflexo
Receptor → neurônio **sensitivo** → medula → neurônio **motor** → músculo. O reflexo patelar não passa pelo encéfalo, por isso é rápido e involuntário. O impulso viaja como potencial de ação; na sinapse, neurotransmissores atravessam a fenda.

### Glicemia
- Glicose alta → **insulina** (células beta do pâncreas) → células captam glicose; fígado e músculo a guardam como **glicogênio**.
- Glicose baixa → **glucagon** (células alfa) → fígado quebra glicogênio e libera glicose.
- Hormônios **esteroides** (cortisol, sexuais) derivam do **colesterol**; atravessam a membrana e agem no núcleo.

### Rim: o néfron
1. **Filtração** no glomérulo: passam água, sais, glicose, ureia; ficam células e proteínas.
2. **Reabsorção**: no túbulo proximal, glicose e aminoácidos voltam ao sangue por **transporte ativo** (gasta ATP). Se a glicemia passa do limite, sobra glicose na urina (diabetes).
3. **ADH** (hormônio antidiurético, da neuro-hipófise) aumenta a permeabilidade do ducto coletor à água, por aquaporinas: urina mais concentrada. Álcool inibe o ADH e aumenta a diurese.

### Digestão
Enzimas que digerem proteínas são produzidas **inativas** (zimogênios) para não digerirem a célula que as fabrica. O **pepsinogênio**, liberado no estômago, é ativado em **pepsina** pelo HCl; depois a própria pepsina ativa mais pepsinogênio (autocatálise). A pepsina age em pH ácido.`,
    applications: [
      md`**Saúde**: infarto, diabetes, desidratação, efeito do álcool.`,
      md`**Química**: pH, enzimas como catalisadores, transporte de íons.`,
      md`**Célula**: transporte ativo, receptores de membrana, síntese de proteínas.`,
    ],
    strategy: [
      md`Localize o órgão e a etapa (filtração, reabsorção, secreção).`,
      md`Nomeie a estrutura e a molécula (ADH, aquaporina, glucagon).`,
      md`Termine com a consequência no organismo (urina mais concentrada, glicemia sobe).`,
    ],
    examples: [
      {
        title: 'ADH',
        prompt: md`Por que quem bebe muito álcool urina mais?`,
        steps: [md`O álcool inibe a liberação de ADH.`, md`Com menos ADH, o ducto coletor reabsorve menos água e a urina fica mais volumosa e diluída.`],
      },
      {
        title: 'Glucagon',
        prompt: md`Durante um jejum, como a glicemia é mantida?`,
        steps: [md`A glicose cai e as células alfa do pâncreas liberam glucagon.`, md`O fígado quebra glicogênio e libera glicose no sangue.`],
      },
    ],
    discursive: {
      prompt: md`Em pessoas com diabetes não controlado, aparece glicose na urina. (a) Em que parte do néfron a glicose é normalmente reabsorvida, e por qual tipo de transporte? (b) Por que ela aparece na urina nesses pacientes? (c) Que hormônio pancreático está deficiente no diabetes tipo 1, e qual seu efeito?`,
      modelAnswer: [md`(a) No túbulo contorcido proximal, por transporte ativo, que depende de proteínas transportadoras e de ATP.`, md`(b) Com glicemia muito alta, a glicose filtrada excede a capacidade dos transportadores, que ficam saturados; o excedente segue na urina.`, md`(c) A insulina, que promove a captação de glicose pelas células e seu armazenamento como glicogênio, baixando a glicemia.`],
      scoring: [md`Local e tipo de transporte corretos.`, md`Explica a saturação dos transportadores.`, md`Nomeia a insulina e seu efeito.`],
    },
    traps: [
      { trap: md`Dizer que o ADH é produzido no rim.`, fix: md`É produzido no hipotálamo e liberado pela neuro-hipófise; age no rim.` },
      { trap: md`Inverter insulina e glucagon.`, fix: md`Insulina baixa a glicemia; glucagon sobe.` },
      { trap: md`Achar que o reflexo patelar passa pelo cérebro.`, fix: md`É medular.` },
    ],
  },

  {
    id: 'bio-vegetal',
    subject: 'Biologia',
    title: 'Fisiologia e reprodução vegetal',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: estiolamento e endosperma (2022), íons K⁺ e fechamento estomático (2023), óvulo vegetal e animal (2024), flor e fruto do tomate, partenocarpia e endosperma (2025), abertura estomática e absorção de água (2026).`,
    explanation: md`### Estômatos
Poros na folha controlados por duas **células-guarda**. O controle é osmótico:
1. Com luz e baixa concentração de CO₂, bombas de prótons fazem entrar **K⁺** nas células-guarda.
2. A concentração de solutos sobe e a água entra por **osmose**.
3. As células ficam **túrgidas** e, pela parede mais espessa do lado do poro, se curvam e **abrem** o estômato.
4. Com falta de água, o hormônio **ácido abscísico (ABA)** faz o K⁺ sair; a água sai, as células ficam flácidas e o estômato **fecha**.
O estômato aberto deixa entrar CO₂ para a fotossíntese, mas perde água: é um equilíbrio entre fotossíntese e transpiração.

### Transporte de água
A água entra pela raiz (pelos absorventes) e sobe pelo **xilema**, puxada pela **transpiração** nas folhas (teoria da coesão-tensão). Os açúcares descem pelo **floema**.

### Estiolamento
No escuro, a planta alonga muito o caule, fica amarelada (sem clorofila) e com folhas pequenas: gasta a reserva da semente tentando alcançar a luz.

### Reprodução das angiospermas
- **Dupla fecundação**: um núcleo espermático fecunda a oosfera (zigoto 2n, embrião) e outro se une aos dois núcleos polares (**endosperma 3n**, reserva nutritiva).
- **Óvulo** vira **semente**; **ovário** vira **fruto**.
- **Partenocarpia**: fruto sem fecundação, portanto sem sementes (banana, alguns tomates).
- Nas gimnospermas, o endosperma é n e não há fruto.`,
    applications: [
      md`**Ecologia**: plantas do Cerrado com raízes profundas e da Caatinga com estômatos que fecham de dia.`,
      md`**Química**: osmose e concentração de solutos.`,
      md`**Agricultura**: frutos sem sementes, irrigação e estresse hídrico.`,
      md`**Fotossíntese**: entrada de CO₂ pelos estômatos.`,
    ],
    strategy: [
      md`Em estômato, escreva a sequência: íon → osmose → turgor → abertura.`,
      md`Em reprodução, pergunte: virou semente (óvulo) ou fruto (ovário)? Qual a ploidia?`,
      md`Relacione sempre ao ambiente (luz, água, CO₂).`,
    ],
    examples: [
      {
        title: 'Seca',
        prompt: md`Por que, numa seca, as plantas fecham os estômatos e crescem menos?`,
        steps: [md`O ABA faz o K⁺ sair das células-guarda; a água sai e o estômato fecha, reduzindo a perda de água.`, md`Com o estômato fechado, entra menos CO₂ e a fotossíntese cai.`],
      },
      {
        title: 'Endosperma',
        prompt: md`Qual a ploidia do endosperma do milho e de onde vem?`,
        steps: [md`3n.`, md`Da união de um núcleo espermático com os dois núcleos polares, na dupla fecundação.`],
      },
    ],
    discursive: {
      prompt: md`Em folhas iluminadas, os estômatos se abrem; numa seca, se fecham mesmo com luz. (a) Explique o mecanismo de abertura. (b) Que hormônio promove o fechamento na seca? (c) Qual a consequência do fechamento para a fotossíntese?`,
      modelAnswer: [md`(a) Na luz, íons K⁺ entram nas células-guarda; aumenta a concentração de solutos, a água entra por osmose, as células ficam túrgidas e se curvam, abrindo o ostíolo.`, md`(b) O ácido abscísico (ABA).`, md`(c) Diminui a entrada de CO₂, reduzindo a taxa de fotossíntese.`],
      scoring: [md`Sequência completa: K⁺, osmose, turgor, abertura.`, md`Nomeia o ABA.`, md`Liga o fechamento à menor entrada de CO₂.`],
    },
    traps: [
      { trap: md`Dizer que a luz abre o estômato "diretamente".`, fix: md`A luz desencadeia a entrada de K⁺; quem abre é o turgor.` },
      { trap: md`Dizer que o fruto vem do óvulo.`, fix: md`Fruto vem do ovário; semente vem do óvulo.` },
    ],
  },

  {
    id: 'bio-ecologia',
    subject: 'Biologia',
    title: 'Ecologia a partir de notícia',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**, sempre com notícia ou caso: macaco-prego e palmeira juçara (2022), sucessão primária em ilha vulcânica (2023), fogo no Cerrado e na Amazônia (2024), biomagnificação do arsênio (2025) e petróleo na Foz do Amazonas e acidificação dos oceanos (2026).`,
    explanation: md`### Cadeias e teias
Energia flui do **produtor** para os **consumidores**, perdendo cerca de 90% em cada nível (respiração, calor). Por isso há poucos níveis tróficos. A matéria **circula** (ciclos biogeoquímicos); a energia **não**.

### Biomagnificação
Substâncias **não degradáveis e lipossolúveis** (metais como mercúrio e arsênio, inseticidas como DDT) se acumulam nos tecidos. A cada nível trófico, o consumidor come muitas presas e acumula o que todas tinham: a **concentração aumenta ao longo da cadeia**. Os predadores de topo, inclusive o ser humano, são os mais contaminados.

### Sucessão ecológica
- **Primária**: começa onde não havia solo (rocha vulcânica, duna). Pioneiras como **líquens** produzem ácidos que desgastam a rocha e formam o primeiro solo.
- **Secundária**: começa onde já havia solo, depois de um distúrbio (queimada, roça abandonada); é mais rápida.
- Ao longo da sucessão aumentam biomassa, diversidade e estabilidade até a **comunidade clímax**.

### Fogo
No **Cerrado**, o fogo é natural e as plantas têm adaptações (casca grossa e suberosa, órgãos subterrâneos, rebrota). Na **Amazônia**, a floresta não evoluiu com fogo: ele é resultado de desmatamento e destrói a comunidade.

### Acidificação dos oceanos
O CO₂ dissolvido forma ácido carbônico, que libera H⁺ e baixa o pH:
$\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 \rightleftharpoons \text{H}^+ + \text{HCO}_3^-$.
O H⁺ consome carbonato ($\text{CO}_3^{2-}$), que corais e moluscos usam para fazer seus esqueletos e conchas de $\text{CaCO}_3$.

### Dinâmica de populações
Densidade = indivíduos por área. Aumenta com natalidade e imigração; diminui com mortalidade e emigração. A falta de um recurso-chave (como o fruto da juçara) reduz a capacidade de suporte.`,
    formulas: [
      { tex: String.raw`\text{densidade} = \frac{\text{número de indivíduos}}{\text{área}}`, meaning: md`Densidade populacional.` },
      { tex: String.raw`\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}^+ + \text{HCO}_3^-`, meaning: md`Origem da acidificação dos oceanos.` },
    ],
    applications: [
      md`**Química**: equilíbrio do CO₂ na água e pH.`,
      md`**Geografia**: biomas, queimadas, mudanças climáticas, COP30.`,
      md`**Saúde**: contaminação de peixes por mercúrio.`,
      md`**Evolução**: adaptações das plantas do Cerrado ao fogo.`,
    ],
    strategy: [
      md`Identifique o conceito por trás da notícia (biomagnificação, sucessão, ciclo).`,
      md`Nomeie-o e explique o mecanismo, não só a consequência.`,
      md`Se houver cadeia, desenhe-a e indique o nível trófico.`,
    ],
    examples: [
      {
        title: 'Biomagnificação',
        prompt: md`Por que o mercúrio de um garimpo aparece em maior concentração em botos do que em peixes herbívoros?`,
        steps: [md`O mercúrio não é degradado nem excretado com facilidade.`, md`Cada nível trófico come muitos do nível anterior e acumula o mercúrio; o boto, no topo, tem a maior concentração.`],
      },
      {
        title: 'Sucessão',
        prompt: md`Que tipo de sucessão ocorre numa lava recém-solidificada, e quem são os pioneiros?`,
        steps: [md`Primária, pois não há solo.`, md`Líquens, que formam o primeiro solo.`],
      },
    ],
    discursive: {
      prompt: md`O aumento do CO₂ atmosférico ameaça os recifes de coral. (a) Explique, com equação química, como o CO₂ altera o pH da água do mar. (b) Por que essa alteração prejudica os corais?`,
      modelAnswer: [md`(a) O CO₂ se dissolve e reage com a água: $\text{CO}_2 + \text{H}_2\text{O} \rightleftharpoons \text{H}_2\text{CO}_3 \rightleftharpoons \text{H}^+ + \text{HCO}_3^-$. O aumento de H⁺ diminui o pH.`, md`(b) O H⁺ reage com o carbonato da água, tornando-o menos disponível; os corais usam carbonato para formar o esqueleto de $\text{CaCO}_3$, que passa a se formar com dificuldade e até a se dissolver.`],
      scoring: [md`Equação correta, com o H⁺ liberado.`, md`Relaciona H⁺ à queda de pH.`, md`Liga a falta de carbonato ao esqueleto calcário.`],
    },
    traps: [
      { trap: md`Dizer que a energia circula no ecossistema.`, fix: md`A matéria circula; a energia flui e se dissipa.` },
      { trap: md`Achar que o fogo é sempre destrutivo em qualquer bioma.`, fix: md`No Cerrado ele faz parte da dinâmica natural.` },
    ],
  },

  {
    id: 'bio-celula-molecular',
    subject: 'Biologia',
    title: 'Célula e biologia molecular',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: célula diploide e replicação semiconservativa (2022), enzimas e plasmídeos em superlarvas que digerem plástico (2023), síntese proteica em procariotos e eucariotos (2024), ciclo celular, fase S e G0 (2025), dogma central, código degenerado e splicing alternativo (2026).`,
    explanation: md`### Replicação
O DNA se duplica na **fase S** da interfase. É **semiconservativa**: cada molécula-filha tem uma fita antiga e uma nova. A DNA polimerase pareia A–T e C–G.

### Ciclo celular
G1 (crescimento) → S (duplicação do DNA) → G2 (preparação) → mitose → citocinese. Células que param de se dividir (neurônios, músculo) ficam em **G0**. A quantidade de DNA dobra na fase S e cai à metade na divisão.

### Dogma central
DNA → (transcrição) → RNA → (tradução) → proteína.
- **Transcrição**: no núcleo (eucariotos). O RNA mensageiro copia um gene.
- **Processamento** (só eucariotos): retirada dos **íntrons** e união dos **éxons**. No **splicing alternativo**, éxons diferentes são combinados, e um gene gera várias proteínas.
- **Tradução**: no ribossomo. Cada **códon** (3 bases) indica um aminoácido; o tRNA traz o aminoácido certo pelo anticódon.

### Código genético
- **Degenerado**: vários códons para o mesmo aminoácido (por isso algumas mutações não mudam a proteína).
- **Universal**: o mesmo em quase todos os seres, o que permite a transgenia.

### Procariotos e eucariotos
Procariotos não têm núcleo: transcrição e tradução ocorrem ao mesmo tempo, no citoplasma, e não há íntrons. Têm **plasmídeos**, pequenos DNAs circulares extras, que podem carregar genes de resistência ou de enzimas e ser transferidos entre bactérias.

### Enzimas
Proteínas catalisadoras específicas, com sítio ativo. Temperatura e pH fora do ideal as **desnaturam** (mudam a forma e param de funcionar).`,
    applications: [
      md`**Biotecnologia**: transgênicos, insulina produzida por bactérias, plasmídeos como vetores.`,
      md`**Saúde**: câncer como perda de controle do ciclo celular; antibióticos que agem no ribossomo bacteriano.`,
      md`**Evolução**: mutações como fonte de variação.`,
      md`**Química**: proteínas, ligações de hidrogênio no DNA, catálise.`,
    ],
    strategy: [
      md`Identifique a etapa (replicação, transcrição, tradução) e o local.`,
      md`Diga se o organismo é procarioto ou eucarioto e o que muda.`,
      md`Para mutações, verifique se o códon novo codifica o mesmo aminoácido.`,
    ],
    examples: [
      {
        title: 'Código degenerado',
        prompt: md`Uma mutação troca o códon GCU por GCC, e ambos codificam alanina. O que acontece com a proteína?`,
        steps: [md`O aminoácido continua o mesmo.`, md`A proteína não muda: mutação silenciosa, explicada pela degeneração do código.`],
      },
      {
        title: 'Splicing',
        prompt: md`Como os humanos têm cerca de 20 mil genes e muito mais tipos de proteína?`,
        steps: [md`Pelo splicing alternativo: os éxons de um mesmo gene são combinados de formas diferentes.`, md`Cada combinação gera um RNA maduro e uma proteína diferente.`],
      },
    ],
    discursive: {
      prompt: md`Pesquisadores inseriram num plasmídeo o gene de uma enzima que degrada plástico e o introduziram em bactérias. (a) O que é um plasmídeo? (b) Por que a bactéria consegue produzir a enzima de outro organismo? (c) Por que a enzima pode deixar de funcionar acima de certa temperatura?`,
      modelAnswer: [md`(a) Uma molécula pequena de DNA circular, separada do cromossomo bacteriano, que se replica de forma independente.`, md`(b) Porque o código genético é universal: os códons do gene são lidos da mesma forma pelos ribossomos da bactéria.`, md`(c) Porque a temperatura alta desnatura a proteína, alterando sua forma e o sítio ativo.`],
      scoring: [md`Define plasmídeo.`, md`Cita a universalidade do código.`, md`Explica a desnaturação pelo sítio ativo.`],
    },
    traps: [
      { trap: md`Dizer que a replicação é conservativa.`, fix: md`É semiconservativa: uma fita velha e uma nova.` },
      { trap: md`Atribuir íntrons a procariotos.`, fix: md`Procariotos não têm íntrons nem splicing.` },
    ],
  },
];
