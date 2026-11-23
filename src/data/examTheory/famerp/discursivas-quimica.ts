// Temas que se repetem nas 30 discursivas de Química da Famerp 2022–2026
// (6 por prova). Perguntas de treino autorais.

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasQuimica: DiscursiveTheme[] = [
  {
    id: 'qui-eletroquimica',
    subject: 'Química',
    title: 'Pilhas, eletrólise e corrosão',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: ânodos de sacrifício e eletrólise em série (2022), pilha ferro–chumbo (2023), bafômetro por oxidação do etanol (2024), pilha de Edison, ferro–níquel (2025) e pilha zinco–manganês em meio alcalino e ácido (2026). A banca dá uma tabela de potenciais e pede cátodo, ânodo, semirreações, ΔE° e a reação global.`,
    explanation: md`### Pilha: reação espontânea que gera corrente
Numa pilha, a oxirredução acontece com os reagentes separados, e os elétrons passam por um fio.
- **Cátodo**: onde ocorre **redução**; é o **polo positivo**. Fica a espécie com **maior** potencial de redução ($E^\circ$).
- **Ânodo**: onde ocorre **oxidação**; é o **polo negativo**. O metal do ânodo se **desgasta**.
- Os elétrons saem do ânodo e vão ao cátodo pelo fio; a **ponte salina** (ou o eletrólito) fecha o circuito com íons e mantém as soluções neutras.

### Como montar a resposta
1. Compare os $E^\circ$ de redução da tabela: o maior reduz (cátodo), o menor oxida (ânodo).
2. Escreva a semirreação de redução como está na tabela.
3. Escreva a do ânodo **invertida**.
4. Iguale os elétrons multiplicando as semirreações (o $E^\circ$ **não** se multiplica) e some.

### Eletrólise: reação forçada
Uma fonte externa obriga a reação não espontânea. O cátodo continua sendo onde ocorre redução, mas agora é o **polo negativo**; o ânodo, onde ocorre oxidação, é o **positivo**.
- A carga é $Q = i\,t$, e cada mol de elétrons transporta 96 500 C (1 faraday).
- Em **eletrólises em série**, a mesma corrente passa por todas as cubas: o número de mols de elétrons é o mesmo em cada uma.

### Corrosão e proteção
O ferro enferruja ao se oxidar na presença de água e oxigênio. Um **ânodo de sacrifício** é um metal com $E^\circ$ de redução **menor** que o do ferro (zinco, magnésio): ele se oxida no lugar do ferro. A galvanização (cobrir com zinco) usa o mesmo princípio.`,
    formulas: [
      { tex: String.raw`\Delta E^\circ = E^\circ_{\text{red, cátodo}} - E^\circ_{\text{red, ânodo}}`, meaning: md`Positivo numa pilha (espontânea). Não multiplique os potenciais pelos coeficientes.` },
      { tex: String.raw`Q = i\,t`, meaning: md`Carga em coulombs: corrente (A) vezes tempo (s).` },
      { tex: String.raw`n_{e^-} = \frac{Q}{96\,500\ \text{C/mol}}`, meaning: md`Mols de elétrons; ligue à semirreação para achar a massa depositada.` },
    ],
    applications: [
      md`**Cotidiano**: pilhas alcalinas, baterias de celular e de carro, galvanização.`,
      md`**Indústria**: obtenção de alumínio, cloro e soda por eletrólise; cromagem.`,
      md`**Saúde e trânsito**: bafômetro.`,
      md`**Biologia**: a respiração celular também transfere elétrons por uma cadeia de oxirredução.`,
    ],
    strategy: [
      md`Escreva os dois $E^\circ$ lado a lado e marque o maior.`,
      md`Diga explicitamente "cátodo: redução, polo +" e "ânodo: oxidação, polo −".`,
      md`Balanceie os elétrons antes de somar.`,
      md`Em eletrólise, comece pela carga e pelos mols de elétrons.`,
    ],
    examples: [
      {
        title: 'Pilha',
        prompt: md`Dados $E^\circ(\text{Cu}^{2+}/\text{Cu}) = +0{,}34$ V e $E^\circ(\text{Zn}^{2+}/\text{Zn}) = -0{,}76$ V, monte a pilha.`,
        steps: [md`Cátodo: cobre (maior $E^\circ$): $\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu}$.`, md`Ânodo: zinco: $\text{Zn} \rightarrow \text{Zn}^{2+} + 2e^-$.`, md`Global: $\text{Zn} + \text{Cu}^{2+} \rightarrow \text{Zn}^{2+} + \text{Cu}$.`, md`$\Delta E^\circ = 0{,}34 - (-0{,}76) = 1{,}10$ V.`],
      },
      {
        title: 'Eletrólise',
        prompt: md`Que massa de cobre ($M = 63{,}5$ g/mol) se deposita com 2,0 A durante 9650 s?`,
        steps: [md`$Q = 2{,}0 \times 9650 = 19\,300$ C.`, md`$n_{e^-} = 19\,300 / 96\,500 = 0{,}20$ mol.`, md`$\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu}$: $0{,}10$ mol de Cu $= 6{,}35$ g.`],
      },
    ],
    discursive: {
      prompt: md`Para proteger o casco de aço de um navio, prendem-se blocos de magnésio. Dados $E^\circ(\text{Fe}^{2+}/\text{Fe}) = -0{,}44$ V e $E^\circ(\text{Mg}^{2+}/\text{Mg}) = -2{,}37$ V. (a) Explique por que o magnésio protege o ferro. (b) Escreva a semirreação do metal que se desgasta. (c) Por que os blocos precisam ser trocados periodicamente?`,
      modelAnswer: [md`(a) O magnésio tem menor potencial de redução, logo maior tendência a se oxidar: atua como ânodo e se oxida no lugar do ferro, que fica como cátodo e não enferruja (ânodo de sacrifício).`, md`(b) $\text{Mg} \rightarrow \text{Mg}^{2+} + 2e^-$.`, md`(c) Porque o magnésio é consumido ao se oxidar.`],
      scoring: [md`Compara os potenciais e conclui quem oxida.`, md`Semirreação de oxidação balanceada.`, md`Relaciona o desgaste à oxidação.`],
    },
    traps: [
      { trap: md`Multiplicar o $E^\circ$ pelo coeficiente.`, fix: md`O potencial não depende da quantidade.` },
      { trap: md`Usar "ânodo = polo negativo" na eletrólise.`, fix: md`Na eletrólise o ânodo é o polo positivo; o que não muda é ânodo = oxidação.` },
      { trap: md`Escolher para ânodo de sacrifício um metal mais nobre que o ferro.`, fix: md`Tem de ter $E^\circ$ de redução menor.` },
    ],
  },

  {
    id: 'qui-organica',
    subject: 'Química',
    title: 'Orgânica: funções, isomeria e reações',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: hidrogenação do pent-1-eno com isomeria e diagrama de energia, sabões e detergentes (2022), etanoato de butila (2023), produtos da redução do CO₂ e carbonos assimétricos da prednisona (2024), oxidação enérgica de alceno (2025), ácido ferúlico com isomeria cis-trans e esterificação (2026).`,
    explanation: md`### Funções pelo grupo
| Função | Grupo | Terminação |
|---|---|---|
| Álcool | –OH em C saturado | -ol |
| Aldeído | –CHO (ponta) | -al |
| Cetona | C=O no meio | -ona |
| Ácido carboxílico | –COOH | ácido ...-oico |
| Éster | –COO– | ...-oato de ...-ila |
| Amina | –NH₂ | -amina |
| Amida | –CONH₂ | -amida |

### Isomeria geométrica (cis-trans)
Exige **dupla ligação C=C** e **dois ligantes diferentes em cada carbono** da dupla. Cis: grupos iguais do mesmo lado; trans: lados opostos.

### Isomeria óptica
Exige **carbono quiral (assimétrico)**, com **quatro ligantes diferentes**. Cada carbono quiral diferente dobra o número de isômeros: $2^n$ isômeros opticamente ativos. Na resposta, **aponte** o carbono e liste os quatro ligantes.

### Reações que caem
- **Esterificação**: ácido carboxílico + álcool ⇌ éster + água (catálise ácida). O inverso é a **hidrólise**; em meio básico, **saponificação**.
- **Hidrogenação**: alceno + H₂ (Ni, Pt) → alcano. Elimina a dupla e, com ela, a isomeria cis-trans.
- **Oxidação de álcoois**: primário → aldeído → ácido; secundário → cetona; terciário não oxida.
- **Oxidação enérgica de alceno** (KMnO₄ em meio ácido, a quente): a dupla se rompe. Carbono da dupla com H → ácido carboxílico; carbono sem H → cetona; carbono terminal (=CH₂) → CO₂ + H₂O.
- **Redução**: o inverso (cetona → álcool secundário).

### Sabões e detergentes
Sabão é o sal de ácido graxo, com cauda **apolar** e cabeça **polar**: forma **micelas** que envolvem a gordura. Precipita em água dura (Ca²⁺, Mg²⁺). Detergente sintético (sulfonato) não precipita.`,
    formulas: [
      { tex: String.raw`\text{R–COOH} + \text{R'–OH} \rightleftharpoons \text{R–COO–R'} + \text{H}_2\text{O}`, meaning: md`Esterificação: o nome do éster vem do ácido (-oato) e do álcool (-ila).` },
      { tex: String.raw`\text{isômeros ópticos ativos} = 2^n`, meaning: md`$n$ = número de carbonos quirais diferentes.` },
    ],
    applications: [
      md`**Saúde**: medicamentos quirais (um isômero ativo, outro inativo ou tóxico), anti-inflamatórios esteroides.`,
      md`**Alimentos**: aromas são ésteres; gordura trans vem da hidrogenação parcial.`,
      md`**Ambiente**: sabões, detergentes e poluição; CO₂ como matéria-prima.`,
      md`**Biologia**: lipídios (ésteres de glicerol), aminoácidos quirais.`,
    ],
    strategy: [
      md`Desenhe a fórmula estrutural antes de responder.`,
      md`Isomeria: verifique as condições uma a uma e justifique com elas.`,
      md`Reações: escreva os reagentes, os produtos e o nome de cada um.`,
    ],
    examples: [
      {
        title: 'Nome do éster',
        prompt: md`Que éster se forma de ácido propanoico e metanol?`,
        steps: [md`Parte do ácido: propan**oato**. Parte do álcool: met**ila**.`, md`Propanoato de metila: $\text{CH}_3\text{CH}_2\text{COOCH}_3$.`],
      },
      {
        title: 'Cis-trans',
        prompt: md`O but-1-eno tem isomeria geométrica? E o but-2-eno?`,
        steps: [md`But-1-eno: o C1 tem dois H iguais: não tem.`, md`But-2-eno: cada carbono da dupla tem H e CH₃: tem cis e trans.`],
      },
    ],
    discursive: {
      prompt: md`O ácido lático ($\text{CH}_3\text{–CH(OH)–COOH}$) é produzido nos músculos. (a) Que funções orgânicas ele tem? (b) Ele apresenta isomeria óptica? Justifique indicando o carbono responsável. (c) Escreva a equação da reação dele com etanol e dê o nome da função formada.`,
      modelAnswer: [md`(a) Álcool (–OH) e ácido carboxílico (–COOH).`, md`(b) Sim: o carbono central é quiral, ligado a quatro grupos diferentes: H, OH, CH₃ e COOH.`, md`(c) $\text{CH}_3\text{CH(OH)COOH} + \text{CH}_3\text{CH}_2\text{OH} \rightleftharpoons \text{CH}_3\text{CH(OH)COOCH}_2\text{CH}_3 + \text{H}_2\text{O}$; forma-se um éster (lactato de etila).`],
      scoring: [md`Nomeia as duas funções.`, md`Aponta o carbono e lista os quatro ligantes.`, md`Equação balanceada com a água e nome da função.`],
    },
    traps: [
      { trap: md`Dizer que há isomeria cis-trans quando um carbono da dupla tem dois ligantes iguais.`, fix: md`Cada carbono da dupla precisa de dois ligantes diferentes.` },
      { trap: md`Afirmar que álcool terciário vira cetona.`, fix: md`Álcool terciário não se oxida nas condições usuais.` },
      { trap: md`Esquecer a água na esterificação.`, fix: md`A reação forma éster **e** água.` },
    ],
  },

  {
    id: 'qui-estequiometria',
    subject: 'Química',
    title: 'Estequiometria com pureza, rendimento e excesso',
    years: [2022, 2023, 2024, 2026],
    howItFalls: md`Caiu em 4 anos: fermentação da sacarose com rendimento medido pelo BaCO₃ (2022), hidrogênio como combustível com reagente limitante e airbag com gases (2023), superfosfato simples com balanceamento e pureza (2024), teor de CaCO₃ numa mistura e limite de exposição ao CCl₄ (2026). Quase sempre num processo industrial ou de laboratório real.`,
    explanation: md`### A proporção vem da equação
Os coeficientes da equação **balanceada** dão a proporção em **mols**. Massa e volume são só formas de chegar aos mols e de voltar deles.

### Roteiro
1. Balanceie a equação.
2. Converta o dado para mols. Se há **pureza**, aplique-a **antes**: só a parte pura reage.
3. Use a proporção dos coeficientes.
4. Aplique o **rendimento** no **fim**: ele diz quanto do teórico realmente se formou.
5. Converta para a unidade pedida.

### Reagente limitante
Divida os mols de cada reagente pelo seu coeficiente; o **menor** resultado é o limitante. Ele acaba primeiro e define a quantidade de produto. Excesso = quantidade dada − quantidade que reagiu.

### Gases
Nas condições dadas, use o volume molar informado (por exemplo, 22,4 L/mol nas CNTP ou 25 L/mol a 25 °C e 1 atm) ou $PV = nRT$ com temperatura em kelvin.

### Teor numa mistura
Se só um componente reage, a quantidade de produto revela a massa desse componente; teor = massa do componente ÷ massa da amostra.`,
    formulas: [
      { tex: String.raw`n = \frac{m}{M}`, meaning: md`Mols a partir da massa e da massa molar.` },
      { tex: String.raw`PV = nRT`, meaning: md`$T$ em kelvin; $R = 0{,}082$ atm·L/(mol·K).` },
      { tex: String.raw`m_{\text{real}} = m_{\text{teórica}} \times \text{rendimento}`, meaning: md`Rendimento aplicado no fim.` },
      { tex: String.raw`m_{\text{puro}} = m_{\text{amostra}} \times \text{pureza}`, meaning: md`Pureza aplicada no começo.` },
    ],
    applications: [
      md`**Indústria**: fertilizantes, cal, cimento, combustíveis.`,
      md`**Saúde**: dose de medicamentos, airbag, limites de exposição.`,
      md`**Ambiente**: CO₂ emitido por combustíveis.`,
      md`**Soluções**: reações em solução usam $n = \mathfrak{M}V$.`,
    ],
    strategy: [
      md`Escreva a equação balanceada no topo da resposta.`,
      md`Organize em linhas: dado → mols → proporção → mols do pedido → unidade.`,
      md`Marque onde entram pureza e rendimento.`,
    ],
    examples: [
      {
        title: 'Pureza e rendimento',
        prompt: md`Aquecem-se 200 g de calcário com 80% de $\text{CaCO}_3$ ($M = 100$). A decomposição $\text{CaCO}_3 \rightarrow \text{CaO} + \text{CO}_2$ tem rendimento de 90%. Que massa de CaO ($M = 56$) se obtém?`,
        steps: [md`Puro: $200 \times 0{,}8 = 160$ g $= 1{,}6$ mol.`, md`Teórico: 1,6 mol de CaO $= 89{,}6$ g.`, md`Real: $89{,}6 \times 0{,}9 \approx 80{,}6$ g.`],
      },
      {
        title: 'Limitante',
        prompt: md`Misturam-se 4 mol de H₂ e 3 mol de O₂ em $2\text{H}_2 + \text{O}_2 \rightarrow 2\text{H}_2\text{O}$. Quem limita e quanto sobra?`,
        steps: [md`H₂: $4/2 = 2$; O₂: $3/1 = 3$. Limitante: H₂.`, md`Reagem 2 mol de O₂; sobra 1 mol. Formam-se 4 mol de água.`],
      },
    ],
    discursive: {
      prompt: md`Uma amostra de 10,0 g de uma mistura de $\text{CaCO}_3$ ($M = 100$) e areia foi tratada com ácido em excesso, liberando 0,0800 mol de CO₂. (a) Escreva a equação, com HCl. (b) Calcule o teor de CaCO₃ na amostra.`,
      modelAnswer: [md`(a) $\text{CaCO}_3 + 2\text{HCl} \rightarrow \text{CaCl}_2 + \text{H}_2\text{O} + \text{CO}_2$.`, md`(b) A proporção é 1 : 1, logo 0,0800 mol de CaCO₃ $= 8{,}00$ g. Teor $= 8{,}00/10{,}0 = 80\%$.`],
      scoring: [md`Equação balanceada.`, md`Usa a proporção molar para achar o CaCO₃.`, md`Teor com a massa da amostra e unidade em %.`],
    },
    traps: [
      { trap: md`Aplicar o rendimento no início.`, fix: md`Pureza no começo, rendimento no fim.` },
      { trap: md`Calcular com equação não balanceada.`, fix: md`A proporção só vale com os coeficientes certos.` },
      { trap: md`Temperatura em °C nos gases.`, fix: md`Use kelvin.` },
    ],
  },

  {
    id: 'qui-termoquimica',
    subject: 'Química',
    title: 'Termoquímica e lei de Hess',
    years: [2024, 2025, 2026],
    howItFalls: md`Caiu nos 3 últimos anos: volume molar e entalpia de combustão do hidrogênio e do etanol (2024), obtenção do ítrio por lei de Hess (2025) e obtenção do CCl₄ por lei de Hess (2026). É tema em alta.`,
    explanation: md`### Entalpia
$\Delta H = H_{\text{produtos}} - H_{\text{reagentes}}$.
- **Exotérmica** ($\Delta H < 0$): libera calor (combustões).
- **Endotérmica** ($\Delta H > 0$): absorve calor.

### Lei de Hess
O $\Delta H$ depende só dos estados inicial e final, não do caminho. Por isso dá para somar equações conhecidas até obter a pedida:
1. Arrume cada equação para que as substâncias fiquem do lado certo da equação-alvo.
2. **Inverteu** a equação: troque o sinal do $\Delta H$.
3. **Multiplicou** a equação: multiplique o $\Delta H$ pelo mesmo número.
4. Some tudo; o que aparece dos dois lados se cancela. O $\Delta H$ final é a soma.

### Energia de ligação
Romper ligação **absorve** energia; formar ligação **libera**. $\Delta H = \sum(\text{rompidas}) - \sum(\text{formadas})$. Note que a ordem é **inversa** à da entalpia de formação.

### Comparar combustíveis
Calcule a energia por grama ($|\Delta H| / M$) ou por volume. O hidrogênio libera muita energia por grama, mas é um gás de baixa densidade e difícil de armazenar.`,
    formulas: [
      { tex: String.raw`\Delta H = H_{\text{produtos}} - H_{\text{reagentes}}`, meaning: md`Com entalpias de formação: substâncias simples no estado padrão valem 0.` },
      { tex: String.raw`\Delta H = \sum E_{\text{rompidas}} - \sum E_{\text{formadas}}`, meaning: md`Com energias de ligação.` },
      { tex: String.raw`\Delta H_{\text{total}} = \Delta H_1 + \Delta H_2 + \dots`, meaning: md`Lei de Hess, depois de inverter e multiplicar as etapas.` },
    ],
    applications: [
      md`**Energia**: comparação de combustíveis (etanol, gasolina, hidrogênio).`,
      md`**Biologia**: respiração celular como "combustão" controlada da glicose.`,
      md`**Indústria**: metalurgia e processos que exigem energia.`,
      md`**Física**: calorimetria mede o calor liberado.`,
    ],
    strategy: [
      md`Escreva a equação-alvo no topo.`,
      md`Para cada substância da alvo, ache a etapa onde ela aparece uma vez só e ajuste.`,
      md`Mostre cada operação (invertida, ×2) com o novo $\Delta H$.`,
    ],
    examples: [
      {
        title: 'Hess',
        prompt: md`Dados: $\text{C} + \text{O}_2 \rightarrow \text{CO}_2$, $\Delta H = -394$ kJ; $\text{CO} + \frac12\text{O}_2 \rightarrow \text{CO}_2$, $\Delta H = -283$ kJ. Calcule o $\Delta H$ de $\text{C} + \frac12\text{O}_2 \rightarrow \text{CO}$.`,
        steps: [md`Mantenha a 1ª: $-394$ kJ.`, md`Inverta a 2ª: $\text{CO}_2 \rightarrow \text{CO} + \frac12\text{O}_2$, $+283$ kJ.`, md`Some: $\Delta H = -394 + 283 = -111$ kJ.`],
      },
      {
        title: 'Energia por grama',
        prompt: md`O etanol ($M = 46$) libera 1370 kJ/mol e o hidrogênio ($M = 2$) libera 286 kJ/mol. Qual libera mais energia por grama?`,
        steps: [md`Etanol: $1370/46 \approx 29{,}8$ kJ/g.`, md`Hidrogênio: $286/2 = 143$ kJ/g. O hidrogênio, cerca de 5 vezes mais.`],
      },
    ],
    discursive: {
      prompt: md`Considere: (I) $\text{S} + \text{O}_2 \rightarrow \text{SO}_2$, $\Delta H = -297$ kJ; (II) $2\text{SO}_3 \rightarrow 2\text{SO}_2 + \text{O}_2$, $\Delta H = +198$ kJ. (a) Calcule o $\Delta H$ de $\text{S} + \frac32\text{O}_2 \rightarrow \text{SO}_3$. (b) A reação é exo ou endotérmica?`,
      modelAnswer: [md`(a) Mantém-se (I): $-297$ kJ. Inverte-se (II) e divide-se por 2: $\text{SO}_2 + \frac12\text{O}_2 \rightarrow \text{SO}_3$, $\Delta H = -99$ kJ. Somando: $\Delta H = -297 - 99 = -396$ kJ.`, md`(b) Exotérmica, pois $\Delta H < 0$.`],
      scoring: [md`Mostra a inversão e a divisão com o sinal e o valor corrigidos.`, md`Soma correta com unidade.`, md`Classifica pelo sinal.`],
    },
    traps: [
      { trap: md`Inverter a equação sem trocar o sinal.`, fix: md`Inverteu, troca o sinal.` },
      { trap: md`Dividir a equação e esquecer de dividir o $\Delta H$.`, fix: md`O $\Delta H$ acompanha o coeficiente.` },
      { trap: md`Subtrair formadas menos rompidas em energia de ligação.`, fix: md`É rompidas menos formadas.` },
    ],
  },

  {
    id: 'qui-equilibrio',
    subject: 'Química',
    title: 'Equilíbrio químico, ácidos e pH',
    years: [2022, 2023, 2025],
    howItFalls: md`Caiu em 2022 (eletrólitos, solvatação e pH do HF), 2023 (força dos ácidos e equilíbrio do HF) e 2025 (NO₂ e água formando ácido nítrico; dimerização do ClO com Kc, temperatura e gás inerte).`,
    explanation: md`### Equilíbrio dinâmico
As reações direta e inversa continuam, com velocidades iguais; as concentrações ficam constantes.

### Constante de equilíbrio
Para $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$: $K_c = \dfrac{[\text{C}]^c[\text{D}]^d}{[\text{A}]^a[\text{B}]^b}$. Sólidos e líquidos puros não entram. $K_c$ grande: equilíbrio deslocado para os produtos. **Só a temperatura muda $K_c$.**

### Le Chatelier
O equilíbrio se desloca para **compensar** a perturbação:
- Mais reagente ou menos produto → para os produtos.
- Mais pressão → para o lado com **menos mols de gás**.
- Mais temperatura → no sentido **endotérmico** (e $K$ muda).
- **Catalisador** não desloca.
- **Gás inerte a volume constante** não desloca: as concentrações dos participantes não mudam.

### Ácidos fortes e fracos
- Forte: ioniza praticamente todo. Nos **monoácidos** fortes (HCl, HNO₃), $[\text{H}^+]$ = concentração do ácido. Num poliácido como o H₂SO₄, cada ionização acrescenta H⁺: a 1ª é total, e a 2ª também contribui, então $[\text{H}^+]$ é maior que a concentração do ácido.
- Fraco: ioniza pouco e fica em equilíbrio: CH₃COOH, HF, H₂CO₃.
- O **HF é fraco** apesar de o flúor ser o mais eletronegativo: a ligação H–F é muito forte e o F⁻, pequeno, é muito solvatado.

### pH
$\text{pH} = -\log[\text{H}^+]$. Ácido: pH < 7; básico: pH > 7 (a 25 °C). Cada unidade de pH a menos é **10 vezes** mais H⁺.`,
    formulas: [
      { tex: String.raw`K_c = \frac{[\text{C}]^c\,[\text{D}]^d}{[\text{A}]^a\,[\text{B}]^b}`, meaning: md`Concentrações no equilíbrio; sólidos e líquidos puros ficam de fora.` },
      { tex: String.raw`\text{pH} = -\log[\text{H}^+], \qquad \text{pH} + \text{pOH} = 14`, meaning: md`A 25 °C.` },
      { tex: String.raw`K_a = \frac{[\text{H}^+][\text{A}^-]}{[\text{HA}]} \approx \alpha^2\,\mathfrak{M}`, meaning: md`Ácido fraco com grau de ionização $\alpha$ pequeno; $[\text{H}^+] = \alpha\,\mathfrak{M}$.` },
    ],
    applications: [
      md`**Biologia**: tampão do sangue (CO₂/HCO₃⁻), acidificação dos oceanos.`,
      md`**Ambiente**: chuva ácida (NO₂ e SO₂ formando ácidos).`,
      md`**Indústria**: síntese da amônia (Haber-Bosch) usa pressão e temperatura para deslocar o equilíbrio.`,
      md`**Cinética**: catalisador acelera a chegada ao equilíbrio sem deslocá-lo.`,
    ],
    strategy: [
      md`Escreva a expressão de $K_c$ antes de qualquer conta.`,
      md`Em deslocamento, diga para onde e por quê ("para compensar o aumento de...").`,
      md`Em pH, decida se o ácido é forte e monoprótico (concentração direta), poliprótico (some as ionizações) ou fraco (use $K_a$).`,
    ],
    examples: [
      {
        title: 'Le Chatelier',
        prompt: md`Em $\text{N}_2 + 3\text{H}_2 \rightleftharpoons 2\text{NH}_3$, $\Delta H < 0$, o que aumenta a produção de amônia?`,
        steps: [md`Aumentar a pressão: o lado dos produtos tem 2 mols de gás contra 4.`, md`Diminuir a temperatura: favorece o sentido exotérmico (direto).`, md`Retirar amônia à medida que se forma.`],
      },
      {
        title: 'pH',
        prompt: md`Qual o pH de uma solução de HCl 0,01 mol/L?`,
        steps: [md`Ácido forte: $[\text{H}^+] = 10^{-2}$ mol/L.`, md`$\text{pH} = 2$.`],
      },
    ],
    discursive: {
      prompt: md`Considere $2\text{NO}_2(g) \rightleftharpoons \text{N}_2\text{O}_4(g)$, $\Delta H < 0$. (a) Escreva a expressão de $K_c$. (b) O que acontece com o equilíbrio e com $K_c$ ao aquecer o sistema? (c) E ao adicionar argônio mantendo o volume constante?`,
      modelAnswer: [md`(a) $K_c = \dfrac{[\text{N}_2\text{O}_4]}{[\text{NO}_2]^2}$.`, md`(b) O aquecimento favorece o sentido endotérmico, o inverso: o equilíbrio se desloca para o NO₂ e $K_c$ diminui.`, md`(c) Nada: a volume constante, o gás inerte não altera as concentrações de NO₂ e N₂O₄.`],
      scoring: [md`Expressão com o expoente correto.`, md`Sentido endotérmico e diminuição de $K_c$ justificados.`, md`Justifica que as concentrações não mudam com o gás inerte.`],
    },
    traps: [
      { trap: md`Dizer que o catalisador desloca o equilíbrio.`, fix: md`Ele só acelera a chegada ao equilíbrio.` },
      { trap: md`Achar que mudar a concentração muda $K_c$.`, fix: md`Só a temperatura muda $K_c$.` },
      { trap: md`Achar que o HF é forte porque o F é muito eletronegativo.`, fix: md`A ligação H–F forte faz o HF ionizar pouco.` },
    ],
  },

  {
    id: 'qui-radioatividade',
    subject: 'Química',
    title: 'Radioatividade',
    years: [2025, 2026],
    howItFalls: md`Caiu em 2025 (ítrio-90: decaimento beta e meia-vida) e 2026 (ouro-198: captura de nêutron e decaimento beta), sempre com isótopo de uso médico.`,
    explanation: md`### Emissões
- **Alfa** ($^4_2\alpha$): núcleo de hélio. O número de massa $A$ cai 4 e o atômico $Z$ cai 2. Pouco penetrante (para numa folha de papel).
- **Beta** ($^0_{-1}\beta$): um nêutron vira próton e emite um elétron. $A$ não muda; $Z$ **aumenta 1**. Penetração média.
- **Gama** ($\gamma$): onda eletromagnética, sem massa nem carga. Muito penetrante.

### Balanceamento
A soma dos $A$ e a soma dos $Z$ são iguais dos dois lados. Escreva as equações nucleares conferindo os dois números.

### Captura de nêutron
$^{197}_{79}\text{Au} + ^1_0\text{n} \rightarrow ^{198}_{79}\text{Au}$: $A$ aumenta 1 e $Z$ não muda (mesmo elemento, isótopo mais pesado).

### Meia-vida
Tempo para metade dos núcleos decair. Não depende de temperatura, pressão nem ligação química. Depois de $n$ meias-vidas, resta $\left(\frac12\right)^n$ da amostra.

### Usos médicos
Isótopos de meia-vida curta, como o ítrio-90 e o ouro-198, são usados em radioterapia: a radiação beta destrói células próximas e a atividade cai depressa.`,
    formulas: [
      { tex: String.raw`^{A}_{Z}\text{X} \rightarrow\ ^{A-4}_{Z-2}\text{Y} + ^{4}_{2}\alpha`, meaning: md`Decaimento alfa.` },
      { tex: String.raw`^{A}_{Z}\text{X} \rightarrow\ ^{A}_{Z+1}\text{Y} + ^{0}_{-1}\beta`, meaning: md`Decaimento beta.` },
      { tex: String.raw`m = \frac{m_0}{2^n}, \qquad n = \frac{t}{t_{1/2}}`, meaning: md`Massa restante após o tempo $t$.` },
    ],
    applications: [
      md`**Saúde**: radioterapia, medicina nuclear, raios X e esterilização.`,
      md`**Energia**: fissão nuclear em usinas; fusão no Sol.`,
      md`**Arqueologia**: datação por carbono-14.`,
      md`**Física**: energia de ligação nuclear e $E = mc^2$.`,
    ],
    strategy: [
      md`Escreva a equação nuclear e balanceie $A$ e $Z$.`,
      md`Use a tabela periódica para achar o elemento pelo $Z$.`,
      md`Em meia-vida, conte quantas meias-vidas cabem no tempo.`,
    ],
    examples: [
      {
        title: 'Beta',
        prompt: md`O estrôncio-90 ($Z = 38$) sofre decaimento beta. Qual o produto?`,
        steps: [md`$A = 90$; $Z = 39$.`, md`$Z = 39$ é o ítrio: $^{90}_{39}\text{Y}$.`],
      },
      {
        title: 'Meia-vida',
        prompt: md`Um isótopo tem meia-vida de 3 dias. Quanto resta de 80 mg depois de 9 dias?`,
        steps: [md`$n = 9/3 = 3$.`, md`$m = 80/2^3 = 10$ mg.`],
      },
    ],
    discursive: {
      prompt: md`O iodo-131 ($Z = 53$), usado no tratamento da tireoide, sofre decaimento beta e tem meia-vida de 8 dias. (a) Escreva a equação do decaimento, identificando o elemento formado. (b) Que fração da dose resta após 24 dias? (c) Por que é importante usar um isótopo de meia-vida curta?`,
      modelAnswer: [md`(a) $^{131}_{53}\text{I} \rightarrow\ ^{131}_{54}\text{Xe} + ^{0}_{-1}\beta$; forma-se o xenônio.`, md`(b) 24 dias = 3 meias-vidas: resta $\frac18$.`, md`(c) A atividade cai depressa, o que limita a exposição do paciente à radiação depois do tratamento.`],
      scoring: [md`Equação balanceada em $A$ e $Z$ e elemento identificado.`, md`Número de meias-vidas e fração.`, md`Relaciona meia-vida curta a menor exposição.`],
    },
    traps: [
      { trap: md`No beta, diminuir o $Z$.`, fix: md`No beta, $Z$ aumenta 1.` },
      { trap: md`Achar que temperatura muda a meia-vida.`, fix: md`A meia-vida é propriedade do núcleo.` },
    ],
  },
];
