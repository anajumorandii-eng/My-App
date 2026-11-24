// Temas das 30 discursivas de Química da Famerp 2022–2026 (6 por prova),
// reescritos a partir da leitura de cada questão real. Os tipos de cobrança
// citam as questões ("2025 q11" = disc_famerp_2025_q11) e o teste confere que
// cada uma das 30 aparece em algum tema. As perguntas de treino são autorais.
//
// Achado que organiza tudo: toda questão tem dois itens. O (a) cobra química
// geral embutida no contexto; o (b) é o cálculo ou a equação do tema. Por isso
// existe um tema só para o item (a).

import type { DiscursiveTheme } from '../types';

const md = String.raw;

export const discursivasQuimica: DiscursiveTheme[] = [
  {
    id: 'qui-geral-item-a',
    subject: 'Química',
    title: 'Química geral do item (a): os pontos que abrem cada questão',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Em **quase todas** as 30 discursivas, o item (a) cobra química geral dentro do contexto da questão: fórmula do ânion fosfato (2024), primeira ionização do H₂SO₄ (2024), distribuição eletrônica e Nox do oxigênio (2023), raio iônico e abundância isotópica (2023), elétrons do Y³⁺ e geometria do nitrogênio (2025), LiOH e Nox do Ni no NiOOH (2025), carga do Ca no CaO e caráter do óxido (2026), fórmula estrutural do metano e polaridade da ligação C–H (2026), grupo do cloro e Lewis do Cl₂ (2026), Mn(OH)₂ e função inorgânica (2026), nêutrons do ouro-197 e elétrons do Au³⁺ (2026). São pontos rápidos, que só se perdem por falta de revisão.`,
    explanation: md`### Por que este tema existe
A Famerp usa um contexto (um fertilizante, um radioterápico, uma pilha) para cobrar, no item (a), um conhecimento básico que **não depende** do cálculo do item (b). Quem domina esta lista garante cerca de metade dos pontos de Química antes de qualquer conta.

### Átomo, íons e tabela
- **Prótons** $= Z$; **nêutrons** $= A - Z$; **elétrons** do átomo neutro $= Z$.
- **Íons**: cátion perde elétrons ($\text{Au}^{3+}$: $79 - 3 = 76$), ânion ganha ($\text{Cl}^-$: 18).
- **Distribuição em camadas** (K, L, M, N…): O ($Z = 8$) → K = 2, L = 6. Em subníveis (Linus Pauling): $1s^2\,2s^2\,2p^4$.
- **Grupos**: 1 alcalinos (Li, Na, K…), 2 alcalino-terrosos, 15 família do nitrogênio, 16 calcogênios, 17 **halogênios** (F, Cl, Br, I), 18 gases nobres. "Metal alcalino do 2º período" = Li.
- **Raio iônico** em espécies **isoeletrônicas** (mesmo número de elétrons): quanto mais prótons, mais o núcleo atrai e **menor** o raio. $\text{Ca}^{2+} < \text{K}^+ < \text{Cl}^-$ (todos com 18 elétrons).
- **Massa atômica média** pela abundância isotópica: $35x + 37(1 - x) = 35{,}5$.

### Ligações, Lewis e geometria
- **Lewis**: mostre os elétrons de valência; cada traço é um par compartilhado. Cl₂: cada Cl com 3 pares livres e 1 par compartilhado. CO₂: O=C=O, duas duplas e dois pares livres em cada O. HCN: H–C≡N.
- **Polaridade da ligação**: diferença de eletronegatividade. C–H tem diferença muito pequena: covalente praticamente apolar. P–Cl: covalente polar.
- **Geometria pelo átomo central** (ligações + pares livres):
  - 4 ligações, 0 pares → tetraédrica (CH₄, CCl₄);
  - 3 ligações, 1 par → **piramidal** (NH₃, PCl₃, N de amina);
  - 2 ligações, 2 pares → angular (H₂O, cerca de 104,5°);
  - 3 ligações, 0 pares → trigonal plana (BF₃);
  - 2 ligações, 0 pares → linear (CO₂, HCN).

### Funções inorgânicas e óxidos
- **Ácido** libera H⁺ em água; a ionização dos poliácidos é **por etapas**: $\text{H}_2\text{SO}_4 + \text{H}_2\text{O} \rightarrow \text{H}_3\text{O}^+ + \text{HSO}_4^-$ é só a primeira.
- **Base** (hidróxido): cátion metálico + OH⁻ → Mn(OH)₂, LiOH, Ca(OH)₂. Monte a fórmula cruzando as cargas.
- **Sal**: produto de ácido + base. **Neutralização completa**: $\text{H}_2\text{SO}_4 + 2\,\text{KOH} \rightarrow \text{K}_2\text{SO}_4 + 2\,\text{H}_2\text{O}$.
- **Óxido básico**: óxido de metal que reage com água formando base, ou com ácido formando sal e água (CaO, Y₂O₃). **Óxido ácido**: de ametal, reage com água formando ácido (CO₂, NO₂, SO₃).
- **Ânions que caem**: fosfato $\text{PO}_4^{3-}$, sulfato $\text{SO}_4^{2-}$, nitrato $\text{NO}_3^-$, carbonato $\text{CO}_3^{2-}$, hidróxido $\text{OH}^-$.

### Nox
Soma igual à carga. Ni no NiOOH: $x + 2(-2) + 1 = 0 \Rightarrow x = +3$. Br no $\text{BrO}_3^-$: $x - 6 = -1 \Rightarrow +5$.

### Interações intermoleculares e propriedades
- Hexano: só London (apolar). Etanol: ligação de hidrogênio, por isso solúvel em água.
- **Pressão de vapor** é inversa à temperatura de ebulição: quem ferve mais fácil evapora mais.
- **Condução elétrica** em solução exige **íons**: KF conduz bem, HF pouco (ionização parcial), glicose não conduz.
- **Solvatação**: o íon fica rodeado por moléculas de água, com o lado de carga oposta voltado para ele (O para o cátion, H para o ânion).

### Substâncias simples e compostas
Simples: um só elemento (Fe, N₂, Cl₂). Composta: mais de um (NaN₃, Fe₂O₃).`,
    applications: [
      md`**Todo o 2º dia de Química**: o item (a) de quase todas as questões vem desta lista, qualquer que seja o tema do item (b).`,
      md`**Objetiva**: interações intermoleculares, Nox e ligações também caem na 1ª fase.`,
      md`**Biologia**: ligações de hidrogênio, polaridade e íons explicam membrana, DNA e transporte.`,
    ],
    strategy: [
      md`Responda o item (a) primeiro e com cuidado: é ponto rápido e independe da conta.`,
      md`Se pede **fórmula**, cruze as cargas e confira a neutralidade.`,
      md`Se pede **geometria**, conte ligações e pares livres no átomo central e escreva os dois números.`,
      md`Se pede **classificação** (óxido, função, ligação), dê o nome **e** a justificativa em meia linha ("óxido básico: reage com água formando base").`,
    ],
    examples: [
      {
        title: 'Íons e partículas',
        prompt: md`Quantos prótons, nêutrons e elétrons tem o íon $^{56}_{26}\text{Fe}^{3+}$?`,
        steps: [md`Prótons $= 26$.`, md`Nêutrons $= 56 - 26 = 30$.`, md`Elétrons $= 26 - 3 = 23$.`],
      },
      {
        title: 'Geometria',
        prompt: md`Dê a geometria e a polaridade da molécula de H₂S.`,
        steps: [md`S central com 2 ligações e 2 pares livres: **angular**.`, md`Os dipolos das ligações não se anulam: molécula **polar**.`],
      },
    ],
    discursive: {
      prompt: md`O sulfato de magnésio (MgSO₄) é usado como laxante. (a) Escreva a fórmula do hidróxido de magnésio e a equação da neutralização completa desse hidróxido pelo ácido sulfúrico. (b) Quantos elétrons tem o íon Mg²⁺ ($Z = 12$)? Esse íon é maior ou menor que o Na⁺ ($Z = 11$)? Justifique.`,
      modelAnswer: [
        md`(a) $\text{Mg(OH)}_2$. $\text{Mg(OH)}_2 + \text{H}_2\text{SO}_4 \rightarrow \text{MgSO}_4 + 2\,\text{H}_2\text{O}$.`,
        md`(b) $12 - 2 = 10$ elétrons. Menor: Mg²⁺ e Na⁺ são isoeletrônicos (10 elétrons), e o Mg²⁺ tem mais prótons, que atraem mais a eletrosfera.`,
      ],
      scoring: [md`Fórmula com as cargas cruzadas e equação balanceada com a água.`, md`Número de elétrons do íon.`, md`Justificativa do raio pela carga nuclear em espécies isoeletrônicas.`],
    },
    patterns: [
      {
        title: 'Fórmulas, íons e funções inorgânicas',
        questions: ['2024 q09', '2025 q11', '2026 q12', '2023 q14', '2025 q12'],
        asks: md`Fórmula do fosfato e 1ª ionização do H₂SO₄; LiOH; Mn(OH)₂ e sua função; neutralização completa do H₂SO₄; NO₂ + água.`,
        solve: [md`Lembre a carga dos ânions comuns e cruze com a do cátion.`, md`Ionização por etapas: a 1ª etapa libera **um** H⁺.`, md`Neutralização completa: todos os H⁺ do ácido com OH⁻ da base.`],
        distractors: md`Não há alternativas: perde-se ponto por fórmula com cargas erradas, por ionização total escrita como "primeira etapa" e por equação sem balancear.`,
      },
      {
        title: 'Átomo, tabela e raio',
        questions: ['2023 q10', '2023 q11', '2026 q13', '2026 q11'],
        asks: md`Distribuição do O; raio de Ca²⁺, K⁺ e Cl⁻ e abundância do ³⁵Cl; nêutrons do ouro-197 e elétrons do Au³⁺; grupo do cloro e Lewis do Cl₂.`,
        solve: [md`Escreva $Z$, $A$ e a carga antes de contar.`, md`Raio de isoeletrônicos: mais prótons, menor raio.`, md`Abundância: média ponderada com $x$ e $1 - x$.`],
        distractors: md`Contar elétrons do átomo neutro no lugar do íon, e ordenar raios pelo número atômico sem notar que são isoeletrônicos.`,
      },
      {
        title: 'Ligação, geometria e interações',
        questions: ['2025 q10', '2026 q10', '2022 q09', '2022 q10'],
        asks: md`Geometria do N num ligante; estrutura do metano e caráter da ligação C–H; interação no hexano, solubilidade e pressão de vapor; condução elétrica e solvatação do K⁺.`,
        solve: [md`Geometria: ligações + pares livres no átomo central.`, md`Pressão de vapor: ordem inversa à da temperatura de ebulição.`, md`Desenhe a água angular com o O voltado para o cátion.`],
        distractors: md`Geometria "plana" para N com par livre, água desenhada linear, e confundir quem conduz mais (íons) com quem conduz menos.`,
      },
      {
        title: 'Óxidos e caráter ácido-base',
        questions: ['2026 q09', '2025 q09', '2022 q11'],
        asks: md`Carga do Ca no CaO e seu caráter; Y₂O₃ com HCl; solução de fermentação ácida pelo CO₂.`,
        solve: [md`Óxido de metal que reage com ácido ou água formando base: básico.`, md`Óxido de ametal que forma ácido em água: ácido (CO₂ → H₂CO₃).`, md`Justifique com a reação.`],
        distractors: md`Classificar sem justificar e chamar de ácido o óxido de metal.`,
      },
    ],
    traps: [
      { trap: md`Contar os elétrons do átomo neutro quando a pergunta é sobre o íon.`, fix: md`Cátion: $Z$ − carga; ânion: $Z$ + carga.` },
      { trap: md`Desenhar geometria sem considerar os pares livres.`, fix: md`Pares livres contam para a forma: NH₃ é piramidal, H₂O é angular.` },
      { trap: md`Escrever a ionização total como se fosse a 1ª etapa.`, fix: md`Poliácidos ionizam um H⁺ por etapa.` },
    ],
  },

  {
    id: 'qui-eletroquimica',
    subject: 'Química',
    title: 'Pilhas, baterias, eletrólise e corrosão',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**: cubas eletrolíticas em série com Mg, Al e Zn e ânodos de sacrifício (2022), pilha Fe–Pb com ponte salina de KNO₃ (2023), bafômetro com eletrodos de platina em meio ácido (2024), pilha de Edison Fe–Ni em meio alcalino (2025), pilha Zn–Mn com um lado em NaOH e outro em H₂SO₄ (2026). A banca sempre dá as semirreações com $E^\circ$ e pede a equação global, a ddp, o cátodo, o sentido dos íons ou o tempo e a massa numa eletrólise.`,
    explanation: md`### 1. Pilha: a oxirredução separada em dois compartimentos
Numa pilha (célula galvânica), o agente redutor e o oxidante ficam em compartimentos separados. Os elétrons que um perde passam por um **fio** até o outro: isso é a corrente elétrica. É uma reação **espontânea**: transforma energia química em elétrica.

### 2. Quem é cátodo e quem é ânodo
- Compare os **potenciais de redução** ($E^\circ_{\text{red}}$) da tabela. O **maior** tem mais tendência a receber elétrons: ali ocorre a **redução**, e esse eletrodo é o **cátodo**, polo **positivo**.
- O **menor** se oxida: é o **ânodo**, polo **negativo**.
- Regra de memória: **Ânodo = Oxidação** (as duas começam com vogal); **Cátodo = Redução** (as duas com consoante).

### 3. A ddp
$$\Delta E^\circ = E^\circ_{\text{red, cátodo}} - E^\circ_{\text{red, ânodo}}$$
Use os dois potenciais **de redução**, como estão na tabela, e **não** multiplique pelo coeficiente: potencial é propriedade intensiva. Numa pilha, $\Delta E^\circ > 0$. Ex.: Fe–Pb: $-0{,}13 - (-0{,}44) = 0{,}31$ V; Zn–Mn: $1{,}23 - (-1{,}21) = 2{,}44$ V.

### 4. Montando a equação global
1. Copie a semirreação do cátodo como está.
2. **Inverta** a do ânodo (vira oxidação, com elétrons à direita).
3. Multiplique para **igualar os elétrons**.
4. Some e cancele o que aparece dos dois lados (elétrons, OH⁻, H₂O).
Exemplo da pilha de Edison: o Ni recebe 1 e⁻ e o Fe libera 2 e⁻, então a do níquel vai ×2:
$\text{Fe} + 2\,\text{NiOOH} + 2\,\text{H}_2\text{O} \rightarrow \text{Fe(OH)}_2 + 2\,\text{Ni(OH)}_2$.

### 5. Balancear em meio ácido ou básico (método do íon-elétron)
Quando a semirreação não vem pronta:
1. Balanceie o elemento que muda de Nox.
2. Balanceie o **O** com $\text{H}_2\text{O}$.
3. Balanceie o **H** com $\text{H}^+$ (meio ácido).
4. Balanceie a **carga** com elétrons.
5. Em **meio básico**, some OH⁻ dos dois lados para neutralizar cada H⁺ (H⁺ + OH⁻ = H₂O) e simplifique a água.
Na pilha de 2026, o lado ácido tem $\text{MnO}_2 + 4\text{H}^+ + 2e^- \rightarrow \text{Mn}^{2+} + 2\text{H}_2\text{O}$ e o lado básico tem $\text{Zn} + 4\text{OH}^- \rightarrow \text{Zn(OH)}_4^{2-} + 2e^-$: cada lado com o meio em que está.

### 6. O que acontece em cada eletrodo e na solução
- **Ânodo metálico**: perde massa (o metal vira íon) e a concentração do seu cátion **aumenta**.
- **Cátodo**: ganha massa se o metal se deposita, e a concentração do cátion que se reduz **diminui**.
- **Ponte salina** (KNO₃, KCl): mantém as soluções neutras. Os **cátions** (K⁺) migram para o **cátodo**, repondo a carga positiva consumida; os **ânions** (NO₃⁻) migram para o **ânodo**, compensando os cátions que se formam. Sem ponte, a pilha para em segundos.
- **Notação**: $\text{Fe} \mid \text{Fe}^{2+} \parallel \text{Pb}^{2+} \mid \text{Pb}$ (ânodo à esquerda, ponte no meio, cátodo à direita).

### 7. Pilhas e baterias comerciais
- **Alcalina** (Zn/MnO₂ em KOH), **de Edison** (Fe/Ni em KOH), **chumbo-ácido** (carros), **íons de lítio** (celulares).
- **Recarregar = eletrólise**: a fonte externa força a reação inversa da descarga. Só é recarregável a célula cuja reação de descarga é **reversível** e cujo projeto conserva os produtos onde a reação inversa os alcança: aderidos ao eletrodo (chumbo-ácido, lítio) ou guardados em tanques de eletrólito (baterias de fluxo). Na pilha alcalina comum, a descarga não se reverte de forma controlada.

### 8. Eletrólise: reação forçada
Uma fonte externa obriga a reação não espontânea (energia elétrica → química).
- **Cátodo** continua sendo onde ocorre a redução, mas agora é o polo **negativo**; **ânodo**, oxidação, é o polo **positivo**.
- **Ígnea** (sal fundido, sem água): o cátion e o ânion do sal se descarregam (NaCl fundido → Na e Cl₂).
- **Aquosa**: o cátion do sal **compete** com a água. Reduz-se quem tiver **maior** $E^\circ_{\text{red}}$. A redução da água ($2\text{H}_2\text{O} + 2e^- \rightarrow \text{H}_2 + 2\text{OH}^-$) tem $E^\circ = -0{,}83$ V em condição **padrão** ($[\text{OH}^-] = 1$ mol/L, meio básico); em pH 7 fica perto de $-0{,}41$ V. Use o valor que a questão fornecer (em 2022, $-0{,}83$ V). O Zn²⁺ ($-0{,}76$ V) se deposita antes da água; Mg²⁺ ($-2{,}37$) e Al³⁺ ($-1{,}66$) não, por isso **Mg e Al só se obtêm por eletrólise ígnea** (pergunta de 2022).
- No ânodo, ânions **não oxigenados** (Cl⁻, Br⁻, I⁻) e OH⁻ se oxidam antes da água; os **oxigenados** (SO₄²⁻, NO₃⁻) e o F⁻ não, e quem se oxida é a água, liberando O₂.

### 9. Cálculos com o faraday
1. Carga: $Q = i\,t$ (A × s = C).
2. Mols de elétrons: $n_{e^-} = Q / 96\,500$.
3. Pela semirreação, mols de produto: $\text{Al}^{3+} + 3e^- \rightarrow \text{Al}$ (3 e⁻ por Al), $\text{Mg}^{2+} + 2e^- \rightarrow \text{Mg}$.
4. Massa $= n \times M$; volume de gás com o volume molar.
- **Em série**, a mesma carga passa por todas as cubas: os **mols de elétrons** são iguais; os mols de cada metal dependem da carga do íon.

### 10. Corrosão e proteção
O ferro enferruja ao se oxidar ($\text{Fe} \rightarrow \text{Fe}^{2+} + 2e^-$) com O₂ e água como oxidante; sal acelera porque aumenta a condutividade.
- **Ânodo de sacrifício**: metal com $E^\circ_{\text{red}}$ **menor** que o do ferro (Zn, Mg, Al): ele vira o ânodo e se oxida no lugar do ferro, que fica como cátodo.
- **Galvanização** (cobrir com zinco) protege mesmo se riscada, pelo mesmo princípio. **Estanho** (lata) só protege enquanto intacto: é mais nobre que o ferro.`,
    formulas: [
      { tex: String.raw`\Delta E^\circ = E^\circ_{\text{red, cátodo}} - E^\circ_{\text{red, ânodo}}`, meaning: md`ddp padrão; positiva numa pilha. Não se multiplica pelos coeficientes.` },
      { tex: String.raw`Q = i\,t`, meaning: md`Carga (C) = corrente (A) × tempo (s).` },
      { tex: String.raw`n_{e^-} = \frac{Q}{96\,500\ \text{C/mol}}`, meaning: md`Mols de elétrons; 1 F = 96 500 C.` },
      { tex: String.raw`m = \frac{Q}{96\,500} \cdot \frac{M}{k}`, meaning: md`Massa depositada; $k$ = número de elétrons por átomo na semirreação.` },
    ],
    applications: [
      md`**Cotidiano**: pilhas e baterias, galvanização, proteção de cascos e tubulações.`,
      md`**Indústria**: alumínio (eletrólise ígnea da bauxita), cloro e soda (eletrólise da salmoura), cromagem e niquelação.`,
      md`**Saúde e trânsito**: bafômetro eletroquímico (2024).`,
      md`**Biologia**: respiração celular é uma cadeia de oxirredução; impulso nervoso usa gradientes de íons.`,
      md`**Física**: ddp, corrente e carga são as mesmas grandezas dos circuitos.`,
    ],
    strategy: [
      md`Escreva os dois $E^\circ_{\text{red}}$ lado a lado e marque o maior: cátodo.`,
      md`Escreva explicitamente "cátodo: redução, polo +; ânodo: oxidação, polo −" (na eletrólise, polos invertidos).`,
      md`Monte a global: copie, inverta, iguale elétrons, some, simplifique.`,
      md`Calcule a ddp com os potenciais de redução, sem multiplicar.`,
      md`Em eletrólise: $Q = it$ → mols de e⁻ → semirreação → massa. Em série, mesmos mols de e⁻.`,
    ],
    examples: [
      {
        title: 'Pilha Zn–Cu completa',
        prompt: md`Dados $E^\circ(\text{Cu}^{2+}/\text{Cu}) = +0{,}34$ V e $E^\circ(\text{Zn}^{2+}/\text{Zn}) = -0{,}76$ V: cátodo, global, ddp, massa dos eletrodos e ponte de KCl.`,
        steps: [md`Cátodo: Cu (maior $E^\circ$), $\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu}$; ganha massa, $[\text{Cu}^{2+}]$ cai.`, md`Ânodo: $\text{Zn} \rightarrow \text{Zn}^{2+} + 2e^-$; perde massa, $[\text{Zn}^{2+}]$ sobe.`, md`Global: $\text{Zn} + \text{Cu}^{2+} \rightarrow \text{Zn}^{2+} + \text{Cu}$; $\Delta E^\circ = 1{,}10$ V.`, md`Ponte: K⁺ para o lado do cobre, Cl⁻ para o lado do zinco.`],
      },
      {
        title: 'Eletrólise em série',
        prompt: md`Duas cubas em série, uma com Ag⁺ e outra com Cu²⁺, recebem 0,20 mol de elétrons. Que massas se depositam? (Ag = 108; Cu = 63,5)`,
        steps: [md`Ag⁺ + e⁻ → Ag: 0,20 mol de Ag $= 21{,}6$ g.`, md`Cu²⁺ + 2e⁻ → Cu: 0,10 mol de Cu $= 6{,}35$ g.`, md`Mesmos mols de elétrons, mols de metal diferentes.`],
      },
    ],
    discursive: {
      prompt: md`Uma bateria usa as semirreações $\text{Ag}_2\text{O} + \text{H}_2\text{O} + 2e^- \rightarrow 2\,\text{Ag} + 2\,\text{OH}^-$ ($E^\circ = +0{,}34$ V) e $\text{ZnO} + \text{H}_2\text{O} + 2e^- \rightarrow \text{Zn} + 2\,\text{OH}^-$ ($E^\circ = -1{,}26$ V), em meio alcalino. (a) Qual eletrodo é o polo negativo? Que espécie se oxida? (b) Escreva a equação global da descarga e calcule a ddp. (c) O que é preciso fazer para recarregar a bateria, e que tipo de processo é esse?`,
      modelAnswer: [
        md`(a) O eletrodo de zinco, de menor potencial de redução: o Zn se oxida a ZnO (ânodo).`,
        md`(b) Ânodo: $\text{Zn} + 2\,\text{OH}^- \rightarrow \text{ZnO} + \text{H}_2\text{O} + 2e^-$. Cátodo: $\text{Ag}_2\text{O} + \text{H}_2\text{O} + 2e^- \rightarrow 2\,\text{Ag} + 2\,\text{OH}^-$. Global: $\text{Zn} + \text{Ag}_2\text{O} \rightarrow \text{ZnO} + 2\,\text{Ag}$. ddp $= 0{,}34 - (-1{,}26) = 1{,}60$ V.`,
        md`(c) Aplicar uma fonte externa de ddp maior que 1,60 V no sentido oposto, forçando a reação inversa: é uma eletrólise.`,
      ],
      scoring: [md`Identifica o ânodo pelo menor potencial e a espécie oxidada.`, md`Inverte a semirreação certa, cancela OH⁻ e H₂O e chega à global balanceada.`, md`ddp com os potenciais de redução, sem multiplicar.`, md`Relaciona recarga a eletrólise com fonte externa.`],
    },
    patterns: [
      {
        title: 'Equação global e ddp a partir das semirreações',
        questions: ['2023 q13', '2025 q11', '2026 q12'],
        asks: md`Semirreações de redução com $E^\circ$, às vezes em meio alcalino ou com cada lado num meio; pede a global e a ddp.`,
        solve: [md`Maior $E^\circ$ reduz; inverta a outra.`, md`Iguale os elétrons (Edison: Ni ×2).`, md`Some, cancele OH⁻, H₂O e elétrons, e confira cargas e átomos.`, md`ddp = maior − menor.`],
        distractors: md`Não há alternativas: perde-se ponto por inverter a semirreação errada, por esquecer de igualar os elétrons e por multiplicar o $E^\circ$.`,
      },
      {
        title: 'Cátodo, polos e ponte salina',
        questions: ['2023 q13', '2024 q11'],
        asks: md`Identificar o cátodo e o eletrodo da redução; movimento dos íons na ponte de KNO₃; no bafômetro, as semirreações nos eletrodos negativo e positivo e a global.`,
        solve: [md`Redução = cátodo = polo + na pilha.`, md`Cátions da ponte vão para o cátodo; ânions para o ânodo, e diga **por quê** (repor a carga).`, md`Some as duas semirreações dadas para a global.`],
        distractors: md`Mandar os cátions para o ânodo "porque é negativo" sem pensar no que cada solução perde ou ganha de carga.`,
      },
      {
        title: 'Eletrólise, faraday e ânodo de sacrifício',
        questions: ['2022 q13'],
        asks: md`Cubas em série com Mg²⁺, Al³⁺ e Zn²⁺: por que protegem o ferro, qual se obtém em solução aquosa, massa de Al com 0,24 F e tempo para a mesma massa de Mg.`,
        solve: [md`Protegem porque têm $E^\circ_{\text{red}}$ menor que o do Fe e se oxidam no lugar dele.`, md`Em água, só se deposita o cátion com $E^\circ$ maior que o da redução da água: o Zn.`, md`Al: 0,24 F / 3; Mg: massa → mols → ×2 elétrons → C → $t = Q/i$.`],
        distractors: md`Usar 2 elétrons para o Al, ou a mesma quantidade de elétrons para massas diferentes sem refazer a proporção.`,
      },
    ],
    traps: [
      { trap: md`Multiplicar o $E^\circ$ pelo coeficiente.`, fix: md`O potencial não depende da quantidade.` },
      { trap: md`Usar "ânodo = polo negativo" na eletrólise.`, fix: md`Na eletrólise o ânodo é positivo; ânodo é sempre onde ocorre oxidação.` },
      { trap: md`Dizer que Mg ou Al se depositam em eletrólise aquosa.`, fix: md`A água se reduz antes; eles exigem eletrólise ígnea.` },
      { trap: md`Esquecer OH⁻ e H₂O ao somar semirreações em meio básico.`, fix: md`Confira átomos e cargas depois de cancelar.` },
    ],
  },

  {
    id: 'qui-organica',
    subject: 'Química',
    title: 'Orgânica: estruturas, isomeria e reações',
    years: [2022, 2023, 2024, 2025, 2026],
    howItFalls: md`Caiu **todo ano**, sempre com uma molécula real: pent-1-eno e pent-2-eno (2022), sabões e detergentes (2022), etanoato de butila (2023), produtos da redução do CO₂ (2024), prednisona e prednisolona (2024), oxidação enérgica de um alceno ramificado (2025), ácido ferúlico (2026). Pede fórmula molecular, isômeros desenhados, carbonos assimétricos e quaternários, porcentagem em massa, reação e nome da função.`,
    explanation: md`### 1. Ler e escrever estruturas
- **Fórmula molecular** a partir da estrutural: conte C, H e O com cuidado. Em anel benzênico, cada vértice é um C; cada C faz 4 ligações, o que falta são H. Ácido ferúlico: 6 C do anel + 1 do OCH₃ + 3 da cadeia = C₁₀; H e O contados um a um.
- **Fórmula geral** para conferir: alcano $\text{C}_n\text{H}_{2n+2}$; alceno $\text{C}_n\text{H}_{2n}$; álcool saturado $\text{C}_n\text{H}_{2n+2}\text{O}$.
- **Carbono insaturado**: tem ligação dupla ou tripla (eteno).
- **Classificação do carbono**: primário (ligado a 1 C), secundário (2), terciário (3), **quaternário** (4 C).

### 2. Funções e nomenclatura
| Função | Grupo | Nome |
|---|---|---|
| Álcool | –OH em C saturado | -ol |
| Aldeído | –CHO | -al (etanal) |
| Cetona | C=O entre C | -ona (butanona) |
| Ácido | –COOH | ácido …-oico |
| Éster | –COO– | …-oato de …-ila |
| Amina, amida | N | -amina, -amida |
| Éter | C–O–C | …óxi… |

### 3. Isomeria plana
Mesma fórmula molecular, estrutura diferente:
- **Cadeia**: normal × ramificada.
- **Posição**: o grupo ou a dupla muda de lugar (pent-1-eno × pent-2-eno; propan-1-ol × propan-2-ol).
- **Função**: funções diferentes (ácido hexanoico × etanoato de butila; álcool × éter).
- **Metameria** (compensação): o heteroátomo muda de posição.
- **Tautomeria**: aldeído/cetona ⇌ enol.

### 4. Isomeria geométrica (cis-trans)
Exige **dupla C=C** com **dois ligantes diferentes em cada carbono** da dupla. **Cis**: ligantes iguais (ou os maiores) do mesmo lado; **trans**: em lados opostos. Para **desenhar o cis**, mantenha a dupla e ponha os dois H do mesmo lado. Hidrogenar a dupla elimina a isomeria.

### 5. Isomeria óptica
**Carbono assimétrico (quiral, C\*)**: quatro ligantes **diferentes**. Carbono com dupla (como C=O) **nunca** é quiral. Número de isômeros ópticos ativos: $2^n$. Na prova, **aponte** cada C\* e mostre que os ligantes diferem.

### 6. Reações
- **Esterificação**: ácido + álcool ⇌ éster + água (catálise ácida). Para achar os precursores de um éster, **corte** na ligação C–O do lado do oxigênio simples: a parte com C=O vem do ácido, a outra do álcool.
- **Hidrólise** do éster: o inverso. Em meio básico (NaOH), **saponificação**: gordura → sal de ácido graxo (sabão) + glicerol.
- **Hidrogenação**: alceno + H₂ (Ni, Pt) → alcano. Exotérmica.
- **Oxidação de álcoois**: primário → aldeído → ácido; secundário → cetona; terciário não oxida.
- **Redução**: o inverso (cetona → álcool secundário; prednisona → prednisolona).
- **Oxidação enérgica de alceno** (KMnO₄/H⁺): a dupla se rompe; carbono da dupla **com H** vira **ácido**, **sem H** vira **cetona**, carbono terminal (=CH₂) vira CO₂ + H₂O. Para achar o alceno, **junte** os dois C=O dos produtos numa dupla.
- **Substituição aromática**: alquilação (cadeia + benzeno) e sulfonação (–SO₃H). Grupos alquila e –OH são **orto/para-dirigentes**.

### 7. Sabões e detergentes
Molécula com cauda **apolar** (cadeia longa) e cabeça **polar/iônica**: forma **micelas** que envolvem a gordura e a levam para a água. O NaOH transforma a parte ácida em sal de sódio, a cabeça iônica. Sabão precipita em água dura (Ca²⁺, Mg²⁺); detergente sulfonado não.

### 8. Porcentagem em massa
$\%\,\text{O} = \dfrac{n_{\text{O}} \cdot 16}{M} \times 100$. Use a massa molar dada no enunciado.`,
    formulas: [
      { tex: String.raw`\text{R–COOH} + \text{R'–OH} \rightleftharpoons \text{R–COO–R'} + \text{H}_2\text{O}`, meaning: md`Esterificação; o nome do éster vem do ácido (-oato) e do álcool (-ila).` },
      { tex: String.raw`\text{isômeros ópticos ativos} = 2^n`, meaning: md`$n$ = carbonos quirais diferentes.` },
      { tex: String.raw`\%\,X = \frac{n_X \cdot M_X}{M_{\text{molécula}}} \times 100`, meaning: md`Porcentagem em massa de um elemento.` },
    ],
    applications: [
      md`**Saúde**: corticoides (prednisona), fármacos quirais, metabolismo hepático como redução e oxidação.`,
      md`**Alimentos e cosméticos**: aromas são ésteres; antioxidantes como o ácido ferúlico.`,
      md`**Ambiente**: sabões e detergentes, redução do CO₂ a combustíveis.`,
      md`**Biologia**: lipídios (ésteres de glicerol), aminoácidos quirais, glicose.`,
    ],
    strategy: [
      md`Desenhe a estrutura completa antes de contar ou classificar.`,
      md`Isomeria: diga o **tipo** e **mostre** a condição (o C\* com os quatro ligantes, a dupla com ligantes diferentes).`,
      md`Reação: escreva reagentes e produtos com fórmula estrutural e dê o nome da função formada.`,
      md`Em oxidação enérgica, monte o alceno unindo os carbonos das carbonilas.`,
    ],
    examples: [
      {
        title: 'Precursores de um éster',
        prompt: md`Quais o ácido e o álcool que formam o propanoato de metila, $\text{CH}_3\text{CH}_2\text{COOCH}_3$?`,
        steps: [md`Corte entre o O simples e o CH₃: a parte com C=O é do ácido propanoico, $\text{CH}_3\text{CH}_2\text{COOH}$.`, md`A outra parte vem do metanol, $\text{CH}_3\text{OH}$.`],
      },
      {
        title: 'Alceno pela oxidação',
        prompt: md`A oxidação enérgica de um alceno deu propanona e ácido propanoico. Qual o alceno?`,
        steps: [md`Propanona: $(\text{CH}_3)_2\text{C}=\text{O}$, carbono sem H na dupla.`, md`Ácido propanoico: $\text{CH}_3\text{CH}_2\text{C(=O)OH}$, carbono com H na dupla.`, md`Unindo: $(\text{CH}_3)_2\text{C}=\text{CH–CH}_2\text{CH}_3$, 2-metilpent-2-eno, $\text{C}_6\text{H}_{12}$.`],
      },
    ],
    discursive: {
      prompt: md`O ácido lático, $\text{CH}_3\text{–CH(OH)–COOH}$, é produzido nos músculos. (a) Escreva a fórmula molecular e identifique as funções. (b) Indique o carbono assimétrico e quantos isômeros ópticos ativos existem. (c) Escreva a equação da reação com etanol e dê o nome do produto orgânico.`,
      modelAnswer: [
        md`(a) $\text{C}_3\text{H}_6\text{O}_3$; álcool e ácido carboxílico.`,
        md`(b) O carbono central, ligado a H, OH, CH₃ e COOH (quatro ligantes diferentes). $2^1 = 2$ isômeros ópticos ativos.`,
        md`(c) $\text{CH}_3\text{CH(OH)COOH} + \text{CH}_3\text{CH}_2\text{OH} \rightleftharpoons \text{CH}_3\text{CH(OH)COOCH}_2\text{CH}_3 + \text{H}_2\text{O}$; lactato de etila (éster).`,
      ],
      scoring: [md`Fórmula molecular correta e as duas funções.`, md`Aponta o C\* e lista os quatro ligantes; aplica $2^n$.`, md`Equação com a água e nome do éster.`],
    },
    patterns: [
      {
        title: 'Fórmula molecular e isômeros desenhados',
        questions: ['2023 q09', '2026 q14', '2022 q12'],
        asks: md`Fórmula molecular de um éster ou de um ácido aromático; desenhar o isômero de função, o isômero cis, ou o isômero de cadeia normal com isomeria geométrica e dizer a isomeria plana.`,
        solve: [md`Conte C, H e O vértice a vértice.`, md`Isômero de função: mesma fórmula, outra função (éster ↔ ácido).`, md`Cis: mesma dupla, H do mesmo lado.`, md`Posição da dupla: pent-1-eno × pent-2-eno.`],
        distractors: md`Perde-se ponto por contar H errado no anel, desenhar um isômero com fórmula diferente e chamar de "cadeia" a isomeria de posição.`,
      },
      {
        title: 'Carbonos assimétricos, quaternários e porcentagem',
        questions: ['2024 q14'],
        asks: md`Esteroide: contar C\* na prednisona e quaternários na prednisolona; % de oxigênio; tipo de reação na conversão.`,
        solve: [md`C\*: quatro ligantes diferentes; o C da carbonila não conta.`, md`Quaternário: ligado a quatro carbonos.`, md`C=O → CH–OH: redução.`],
        distractors: md`Contar como quiral o carbono da C=O e chamar de "oxidação" a entrada de hidrogênio.`,
      },
      {
        title: 'Reação e função do produto',
        questions: ['2024 q10', '2025 q14', '2022 q14'],
        asks: md`Escolher o par ácido + álcool que forma o éster de menor massa e um isômero de posição; achar o alceno pela oxidação enérgica e o álcool da redução; funções do sabão e do detergente, alquilação e posição orto/para.`,
        solve: [md`Éster de menor massa: ácido e álcool menores disponíveis.`, md`Alceno: una os carbonos das carbonilas.`, md`Sabão: base forte hidrolisa o éster e forma o sal de sódio; alquila é orto/para-dirigente.`],
        distractors: md`Escolher o par errado de compostos e esquecer o isômero orto.`,
      },
    ],
    traps: [
      { trap: md`Chamar de cis-trans uma dupla com dois ligantes iguais num carbono.`, fix: md`Cada carbono da dupla precisa de dois ligantes diferentes.` },
      { trap: md`Contar o carbono da carbonila como quiral.`, fix: md`Carbono com dupla não tem quatro ligantes.` },
      { trap: md`Esquecer a água na esterificação.`, fix: md`Forma-se éster **e** água.` },
      { trap: md`Dizer que álcool terciário vira cetona.`, fix: md`Terciário não se oxida nas condições usuais.` },
    ],
  },

  {
    id: 'qui-estequiometria',
    subject: 'Química',
    title: 'Estequiometria, soluções e gases',
    years: [2022, 2023, 2024, 2026],
    howItFalls: md`Caiu em 4 anos, sempre num processo real: fermentação da sacarose medida pelo BaCO₃ (2022), hidrogênio com reagente limitante (2023), airbag com gases e excesso (2023), mistura de KCl e CaCl₂ (2023), superfosfato com pureza (2024), etanol no sangue e no ar expirado (2024), teor de CaCO₃ pela perda de massa (2026), limite de exposição ao CCl₄ (2026).`,
    explanation: md`### 1. A proporção vem dos coeficientes
A equação **balanceada** dá a proporção em **mols**. Massa, volume e número de partículas são só caminhos para chegar aos mols e voltar.

### 2. Roteiro de todo cálculo
1. Balanceie a equação (às vezes é pedido no item).
2. Converta o dado para mols: $n = m/M$; gás: $n = PV/RT$ ou volume molar; solução: $n = \mathfrak{M}\,V$.
3. Aplique a **pureza** no começo: só a parte pura reage.
4. Use a proporção dos coeficientes.
5. Aplique o **rendimento** no fim.
6. Converta para a unidade pedida.

### 3. Reagente limitante e excesso
Divida os mols de cada reagente pelo seu coeficiente: o **menor** quociente é o limitante e define o produto. Excesso = dado − consumido. No hidrogênio de 2023: 10 mol de H₂ precisam de 5 mol de O₂; havia 6,25 mol: o H₂ limita.

### 4. Rendimento medido por um produto
Às vezes o rendimento é medido indiretamente: o CO₂ da fermentação foi absorvido em água de barita e pesado como BaCO₃. Mols de BaCO₃ = mols de CO₂ real; compare com o teórico.

### 5. Perda de massa
Num aquecimento em que sai um gás, a **perda de massa é a massa do gás**: 125 g − 81 g = 44 g de CO₂ = 1 mol, logo 1 mol de CaCO₃. Teor = massa do componente ÷ massa da amostra.

### 6. Gases
$PV = nRT$, com **T em kelvin** ($T = \theta + 273$) e $R = 0{,}082$ atm·L/(mol·K). Nas CATP (25 °C, 1 bar) o volume molar é cerca de 25 L/mol; nas CNTP (0 °C, 1 atm), 22,4 L/mol: use o que o enunciado der.

### 7. Soluções e misturas
- $\mathfrak{M} = n/V$. Ao **misturar** soluções, some os **mols** de cada íon e divida pelo volume total.
- Um sal dissociado dá íons em proporção: 1 CaCl₂ → 1 Ca²⁺ + **2** Cl⁻. Ao somar Cl⁻ do KCl e do CaCl₂, use esse 2.
- % em volume: 5% de etanol em 500 mL = 25 mL de etanol; com a densidade, massa.

### 8. Concentração em massa por volume de ar
Limites de exposição vêm em mg/m³: massa = limite × volume do ambiente; com a densidade do líquido, o volume correspondente.`,
    formulas: [
      { tex: String.raw`n = \frac{m}{M} = \frac{PV}{RT} = \mathfrak{M}\,V`, meaning: md`Três caminhos para os mols: massa, gás (T em K) e solução (V em L).` },
      { tex: String.raw`\text{rendimento} = \frac{\text{quantidade real}}{\text{quantidade teórica}}`, meaning: md`Compare em mols ou em massa, do mesmo produto.` },
      { tex: String.raw`d = \frac{m}{V}`, meaning: md`Liga massa e volume de líquidos (etanol, CCl₄).` },
    ],
    applications: [
      md`**Indústria**: fertilizantes (superfosfato), cal, airbag.`,
      md`**Saúde**: alcoolemia, limites de exposição a solventes, doses.`,
      md`**Ambiente**: CO₂ emitido, poluentes em mg/m³.`,
      md`**Física**: gases ideais e transformações.`,
    ],
    strategy: [
      md`Escreva a equação balanceada no topo.`,
      md`Organize em linhas: dado → mols → proporção → mols pedidos → unidade.`,
      md`Marque onde entram pureza (início) e rendimento (fim).`,
      md`Em mistura de soluções, trabalhe com mols de cada íon.`,
    ],
    examples: [
      {
        title: 'Mistura de soluções',
        prompt: md`Misturam-se 100 mL de NaCl 0,30 mol/L com 400 mL de MgCl₂ 0,10 mol/L. Qual $[\text{Cl}^-]$ final?`,
        steps: [md`Cl⁻ do NaCl: $0{,}1 \times 0{,}30 = 0{,}03$ mol.`, md`Cl⁻ do MgCl₂: $2 \times 0{,}4 \times 0{,}10 = 0{,}08$ mol.`, md`$[\text{Cl}^-] = 0{,}11/0{,}5 = 0{,}22$ mol/L.`],
      },
      {
        title: 'Gás com PV = nRT',
        prompt: md`Quantos mols de gás enchem um balão de 41 L a 27 °C e 1,2 atm?`,
        steps: [md`$T = 300$ K.`, md`$n = \dfrac{1{,}2 \times 41}{0{,}082 \times 300} = 2{,}0$ mol.`],
      },
    ],
    discursive: {
      prompt: md`Para produzir cal, aquecem-se 250 kg de calcário com 80% de CaCO₃ (100 g/mol): $\text{CaCO}_3 \rightarrow \text{CaO} + \text{CO}_2$. (a) Qual o caráter do CaO? (b) Que massa de CaO (56 g/mol) se forma com rendimento de 90%? (c) Que volume de CO₂ é liberado, nas CATP (25 L/mol), considerando o mesmo rendimento?`,
      modelAnswer: [
        md`(a) Óxido básico: com água forma $\text{Ca(OH)}_2$.`,
        md`(b) Puro: $0{,}8 \times 250 = 200$ kg $= 2\,000$ mol. Teórico: 2 000 mol de CaO $= 112$ kg. Real: $112 \times 0{,}9 = 100{,}8$ kg.`,
        md`(c) $2\,000 \times 0{,}9 = 1\,800$ mol de CO₂ × 25 L $= 45\,000$ L.`,
      ],
      scoring: [md`Classifica e justifica o óxido.`, md`Pureza no começo, proporção 1:1, rendimento no fim, com unidade.`, md`Volume pelo volume molar dado.`],
    },
    patterns: [
      {
        title: 'Rendimento, pureza e teor',
        questions: ['2022 q11', '2024 q09', '2026 q09'],
        asks: md`Rendimento da fermentação medido pelo BaCO₃; massa de H₂SO₄ para 500 kg de rocha com 80% de fosfato; teor de CaCO₃ pela perda de massa.`,
        solve: [md`Balanceie primeiro (2024 pedia).`, md`Pureza antes da proporção.`, md`Perda de massa = gás que saiu.`],
        distractors: md`Aplicar pureza ou rendimento no lugar errado e usar a proporção 1:1 quando a equação tem 1:2.`,
      },
      {
        title: 'Limitante, excesso e gases',
        questions: ['2023 q10', '2023 q12'],
        asks: md`Energia máxima de 200 g de O₂ com 20 g de H₂; quantidade de gás num airbag a 27 °C e 1,2 atm; NaN₃ mínimo e Fe₂O₃ em excesso.`,
        solve: [md`Mols/coeficiente: o menor limita.`, md`$PV = nRT$ com T em kelvin.`, md`Excesso = dado − consumido.`],
        distractors: md`Calcular a energia com o reagente em excesso e usar 27 em vez de 300 K.`,
      },
      {
        title: 'Soluções, misturas e concentrações',
        questions: ['2023 q11', '2024 q11', '2026 q10'],
        asks: md`Concentração de Ca²⁺ e Cl⁻ após misturar KCl e CaCl₂; mols de etanol no ar expirado; massa máxima de CCl₄ num galpão e o volume líquido.`,
        solve: [md`Some mols de cada íon com a proporção do sal.`, md`Siga a cadeia de conversões do enunciado (volume → massa → por mL de sangue → mols).`, md`mg/m³ × m³; depois $V = m/d$.`],
        distractors: md`Esquecer o "2" do Cl⁻ no CaCl₂ e dividir pelo volume de uma solução só.`,
      },
    ],
    traps: [
      { trap: md`Aplicar o rendimento no início.`, fix: md`Pureza no começo, rendimento no fim.` },
      { trap: md`Temperatura em °C em $PV = nRT$.`, fix: md`Use kelvin.` },
      { trap: md`Somar concentrações ao misturar soluções.`, fix: md`Some mols e divida pelo volume total.` },
    ],
  },

  {
    id: 'qui-termoquimica',
    subject: 'Química',
    title: 'Termoquímica: entalpia, Hess e diagramas',
    years: [2022, 2024, 2025, 2026],
    howItFalls: md`Caiu em 4 anos: entalpia de formação do pent-1-eno lida num diagrama e efeito do catalisador (2022), energia da combustão do H₂ e entalpia de combustão do etanol por calores de formação (2024), obtenção do ítrio por Hess com cinco equações (2025), ΔH da cloração do metano por calores de formação e classificação (2026).`,
    explanation: md`### 1. Entalpia
$\Delta H = H_{\text{produtos}} - H_{\text{reagentes}}$. Negativo: **exotérmica** (libera calor); positivo: **endotérmica**.

### 2. Calores (entalpias) de formação
É o $\Delta H$ de formar 1 mol da substância a partir das substâncias simples no estado padrão. **Substância simples no estado padrão tem $\Delta H_f = 0$** (H₂, O₂, Cl₂, C grafite). Então:
$$\Delta H = \sum n\,\Delta H_f(\text{produtos}) - \sum n\,\Delta H_f(\text{reagentes})$$
Multiplique cada $\Delta H_f$ pelo coeficiente. **Reconheça equações de formação** no enunciado: "C(s) + 2 H₂(g) → CH₄(g)" é a formação do metano; a combustão do H₂ é a formação da água.

### 3. Lei de Hess
O $\Delta H$ só depende dos estados inicial e final. Para chegar à equação-alvo:
1. Para cada substância da alvo, ache a equação dada em que ela aparece **uma vez só**.
2. Coloque-a do lado certo: **inverteu, troca o sinal**.
3. Ajuste o coeficiente: **multiplicou ou dividiu, faça o mesmo com o $\Delta H$**.
4. Some tudo; o que aparece dos dois lados cancela (inclusive com coeficientes fracionários).
5. Confira se sobrou exatamente a alvo.
No ítrio de 2025, foram cinco equações divididas por 2 e três invertidas: organize numa tabela com a equação ajustada e o novo $\Delta H$ ao lado.

### 4. Diagrama de energia
- Reagentes num nível, produtos em outro: $\Delta H$ = produtos − reagentes.
- O topo é o complexo ativado; $E_a$ = topo − reagentes.
- **Catalisador** abaixa o topo; reagentes, produtos e $\Delta H$ ficam iguais. Se o catalisador reduz o complexo ativado em 150 kJ, o novo topo está 150 kJ abaixo.
- Se o enunciado dá o $\Delta H$ da reação e a entalpia do produto, a do reagente sai da subtração (com a do H₂ igual a zero).

### 5. Energia de ligação
Romper absorve, formar libera: $\Delta H = \sum E_{\text{rompidas}} - \sum E_{\text{formadas}}$ (ordem **inversa** à dos calores de formação).

### 6. Energia de uma quantidade
$\Delta H$ por mol × número de mols. Para comparar combustíveis, calcule por grama ($|\Delta H|/M$).`,
    formulas: [
      { tex: String.raw`\Delta H = \sum n\,\Delta H_f(\text{prod}) - \sum n\,\Delta H_f(\text{reag})`, meaning: md`Calores de formação; substância simples no padrão vale zero.` },
      { tex: String.raw`\Delta H = \sum E_{\text{rompidas}} - \sum E_{\text{formadas}}`, meaning: md`Energias de ligação.` },
      { tex: String.raw`E_a = H_{\text{complexo ativado}} - H_{\text{reagentes}}`, meaning: md`Lida no diagrama.` },
    ],
    applications: [
      md`**Energia**: comparação entre etanol, gasolina e hidrogênio.`,
      md`**Metalurgia**: obtenção de metais (ítrio) exige energia.`,
      md`**Biologia**: a respiração celular libera a energia da glicose em etapas.`,
      md`**Cinética**: catalisador e energia de ativação no mesmo diagrama.`,
    ],
    strategy: [
      md`Antes de usar Hess, veja se as equações são de **formação**: aí é só produtos − reagentes.`,
      md`Em Hess, faça uma tabela: equação ajustada | operação | novo $\Delta H$.`,
      md`Classifique pelo sinal e escreva a palavra (exotérmica, endotérmica).`,
    ],
    examples: [
      {
        title: 'Calores de formação',
        prompt: md`Calcule o $\Delta H$ de $\text{CH}_4 + 2\,\text{O}_2 \rightarrow \text{CO}_2 + 2\,\text{H}_2\text{O}(l)$, com $\Delta H_f$: CH₄ −75, CO₂ −394, H₂O −286 kJ/mol.`,
        steps: [md`Produtos: $-394 + 2(-286) = -966$.`, md`Reagentes: $-75 + 0 = -75$.`, md`$\Delta H = -966 - (-75) = -891$ kJ: exotérmica.`],
      },
      {
        title: 'Hess',
        prompt: md`Dados $\text{C} + \text{O}_2 \rightarrow \text{CO}_2$ ($-394$) e $\text{CO} + \frac12\text{O}_2 \rightarrow \text{CO}_2$ ($-283$), calcule o $\Delta H$ de $\text{C} + \frac12\text{O}_2 \rightarrow \text{CO}$.`,
        steps: [md`Mantenha a 1ª: $-394$.`, md`Inverta a 2ª: $+283$.`, md`Soma: $-111$ kJ.`],
      },
    ],
    discursive: {
      prompt: md`Considere: (I) $\text{S} + \text{O}_2 \rightarrow \text{SO}_2$, $\Delta H = -297$ kJ; (II) $2\,\text{SO}_3 \rightarrow 2\,\text{SO}_2 + \text{O}_2$, $\Delta H = +198$ kJ. (a) O SO₃ é um óxido ácido ou básico? Justifique com uma equação. (b) Calcule o $\Delta H$ de $\text{S} + \frac32\text{O}_2 \rightarrow \text{SO}_3$ e classifique a reação.`,
      modelAnswer: [
        md`(a) Ácido: $\text{SO}_3 + \text{H}_2\text{O} \rightarrow \text{H}_2\text{SO}_4$.`,
        md`(b) Mantém (I): $-297$. Inverte (II) e divide por 2: $\text{SO}_2 + \frac12\text{O}_2 \rightarrow \text{SO}_3$, $-99$. Soma: $-396$ kJ, exotérmica.`,
      ],
      scoring: [md`Classifica o óxido com a equação.`, md`Inversão e divisão com sinal e valor corretos.`, md`Resultado com unidade e classificação.`],
    },
    patterns: [
      {
        title: 'Calores de formação',
        questions: ['2024 q13', '2026 q11'],
        asks: md`Entalpia de combustão do etanol; ΔH da cloração do metano a partir de três equações que são de formação.`,
        solve: [md`Reconheça que são formações (e que a combustão do H₂ dá o $\Delta H_f$ da água).`, md`Produtos − reagentes, com coeficientes; Cl₂ e O₂ valem zero.`],
        distractors: md`Esquecer de multiplicar pelo coeficiente (4 HCl) e inverter a ordem da subtração.`,
      },
      {
        title: 'Hess com muitas equações',
        questions: ['2025 q09'],
        asks: md`Cinco equações para chegar a $\text{YCl}_3(g) \rightarrow \text{Y} + \frac32\text{Cl}_2$.`,
        solve: [md`Divida tudo por 2 quando a alvo tem 1 mol de Y.`, md`Inverta as que estão no sentido errado.`, md`Tabela com cada $\Delta H$ ajustado e soma.`],
        distractors: md`Dividir a equação e não o $\Delta H$, ou esquecer uma inversão.`,
      },
      {
        title: 'Diagrama de energia e catalisador',
        questions: ['2022 q12'],
        asks: md`Ler a entalpia do reagente pelo $\Delta H$ e pela entalpia do produto, e o novo complexo ativado com catalisador.`,
        solve: [md`$\Delta H = H_p - H_r$ → isole $H_r$.`, md`Catalisador: topo − 150 kJ; o resto igual.`],
        distractors: md`Mudar os níveis de reagente e produto com o catalisador.`,
      },
    ],
    traps: [
      { trap: md`Inverter a equação sem trocar o sinal.`, fix: md`Inverteu, troca o sinal.` },
      { trap: md`Dividir a equação e esquecer o $\Delta H$.`, fix: md`O $\Delta H$ acompanha o coeficiente.` },
      { trap: md`Dar $\Delta H_f \neq 0$ para H₂, O₂ ou Cl₂.`, fix: md`Substância simples no estado padrão vale zero.` },
    ],
  },

  {
    id: 'qui-equilibrio',
    subject: 'Química',
    title: 'Equilíbrio, pH e cinética',
    years: [2022, 2023, 2024, 2025],
    howItFalls: md`Caiu em 4 anos: pH do HF pelo grau de ionização (2022), [HF] no equilíbrio pelo Ka e efeito do íon comum (2023), lei de velocidade pelo método das velocidades iniciais (2024), pH da gota de HNO₃ e Kc, temperatura e gás inerte na dimerização do ClO (2025).`,
    explanation: md`### 1. Equilíbrio dinâmico e Kc
As reações direta e inversa continuam com velocidades iguais. Para $a\text{A} + b\text{B} \rightleftharpoons c\text{C} + d\text{D}$:
$$K_c = \frac{[\text{C}]^c[\text{D}]^d}{[\text{A}]^a[\text{B}]^b}$$
Sólidos e líquidos puros ficam fora. **Só a temperatura muda $K$.**

### 2. Le Chatelier, com o porquê
- **Concentração**: acrescentar reagente desloca para os produtos (e vice-versa).
- **Pressão** (por variação de volume): favorece o lado com **menos mols de gás**.
- **Temperatura**: aquecer favorece o sentido **endotérmico**. Se $K$ **diminui** quando a temperatura sobe, a reação direta é **exotérmica** (dimerização do ClO).
- **Gás inerte a volume constante**: a pressão total sobe, mas as **concentrações** dos participantes não mudam: nada se desloca e nenhuma concentração aumenta.
- **Catalisador**: não desloca, só acelera a chegada.

### 3. Ácidos e pH
- $\text{pH} = -\log[\text{H}^+]$. Com $\log 6 = 0{,}8$: $-\log(6\times10^{-3}) = 3 - 0{,}8 = 2{,}2$.
- **Ácido forte monoprótico** (HCl, HNO₃): $[\text{H}^+]$ = concentração do ácido.
- **Ácido fraco**: $[\text{H}^+] = \alpha\,\mathfrak{M}$ (α = grau de ionização) e $K_a = \dfrac{[\text{H}^+][\text{A}^-]}{[\text{HA}]}$. Se o pH é dado, $[\text{H}^+] = [\text{A}^-] = 10^{-\text{pH}}$ e $[\text{HA}] = [\text{H}^+]^2/K_a$.
- **Força** do ácido: maior $K_a$, mais forte.
- **Efeito do íon comum**: acrescentar F⁻ (NaF) a uma solução de HF desloca a ionização para o HF não ionizado; $K_a$ não muda.
- Ao converter volume, cuidado com a potência: 0,050 mL $= 5\times10^{-5}$ L.

### 4. Cinética: lei de velocidade
$v = k[\text{A}]^x[\text{B}]^y$. As ordens saem de **experimentos**:
1. Ache dois experimentos em que só a concentração de um reagente muda.
2. Fator na concentração $f$ e fator na velocidade $F$: $f^x = F$.
3. Dobrou e a velocidade dobrou → ordem 1; quadruplicou → ordem 2; não mudou → 0.
Fatores de cinética (temperatura, superfície, concentração, catalisador): veja o capítulo da objetiva.`,
    formulas: [
      { tex: String.raw`K_c = \frac{[\text{C}]^c\,[\text{D}]^d}{[\text{A}]^a\,[\text{B}]^b}`, meaning: md`Sólidos e líquidos puros fora; só a temperatura muda $K$.` },
      { tex: String.raw`\text{pH} = -\log[\text{H}^+], \qquad [\text{H}^+] = \alpha\,\mathfrak{M}`, meaning: md`Ácido fraco com grau de ionização α.` },
      { tex: String.raw`K_a = \frac{[\text{H}^+][\text{A}^-]}{[\text{HA}]}`, meaning: md`Constante de ionização; maior $K_a$, ácido mais forte.` },
      { tex: String.raw`v = k\,[\text{A}]^x[\text{B}]^y, \qquad f^{\,x} = F`, meaning: md`Ordem pelo método das velocidades iniciais.` },
    ],
    applications: [
      md`**Ambiente**: chuva ácida (NO₂ → HNO₃), camada de ozônio (ClO).`,
      md`**Biologia**: tampão do sangue, pH estomacal e enzimas.`,
      md`**Indústria**: amônia (Haber-Bosch) e controle de reatores.`,
      md`**Saúde**: HF e HCN como ácidos tóxicos.`,
    ],
    strategy: [
      md`Escreva a expressão de $K$ antes de qualquer conta.`,
      md`Em deslocamento, diga o sentido e o motivo ("favorece o endotérmico").`,
      md`Em pH, decida: forte monoprótico, poliprótico ou fraco.`,
      md`Em cinética, monte a tabela de fatores dois a dois.`,
    ],
    examples: [
      {
        title: 'Ácido fraco pelo pH',
        prompt: md`Uma solução de ácido acético ($K_a = 1{,}8\times10^{-5}$) tem pH 3. Qual a concentração de ácido não ionizado?`,
        steps: [md`$[\text{H}^+] = [\text{A}^-] = 10^{-3}$.`, md`$[\text{HA}] = \dfrac{10^{-6}}{1{,}8\times10^{-5}} \approx 0{,}056$ mol/L.`],
      },
      {
        title: 'Ordem de reação',
        prompt: md`Ao triplicar [A] com [B] fixo, a velocidade fica 9 vezes maior. Qual a ordem em A?`,
        steps: [md`$3^x = 9 \Rightarrow x = 2$.`],
      },
    ],
    discursive: {
      prompt: md`Considere $\text{N}_2\text{O}_4(g) \rightleftharpoons 2\,\text{NO}_2(g)$, com $K_c$ maior a temperaturas mais altas. (a) Escreva a expressão de $K_c$. (b) A reação direta é exotérmica ou endotérmica? Justifique. (c) O que acontece com o equilíbrio se o volume do recipiente diminuir?`,
      modelAnswer: [
        md`(a) $K_c = \dfrac{[\text{NO}_2]^2}{[\text{N}_2\text{O}_4]}$.`,
        md`(b) Endotérmica: o aquecimento favorece o sentido endotérmico, e como $K_c$ aumenta com a temperatura, o sentido favorecido é o direto.`,
        md`(c) A pressão aumenta e o equilíbrio se desloca para o lado com menos mols de gás, o do N₂O₄.`,
      ],
      scoring: [md`Expressão com o expoente 2.`, md`Liga a variação de $K$ com a temperatura ao caráter da reação.`, md`Desloca para o lado de menos mols de gás e justifica.`],
    },
    patterns: [
      {
        title: 'pH de ácido forte e fraco',
        questions: ['2022 q10', '2025 q12', '2023 q14'],
        asks: md`pH do HF com α e log dado; pH de uma gota com HNO₃; [HF] não ionizado num pH dado e efeito do NaF.`,
        solve: [md`Fraco: $[\text{H}^+] = \alpha\mathfrak{M}$; forte: concentração direta.`, md`Converta mL em L com cuidado.`, md`Íon comum desloca para o não ionizado; $K_a$ fixo.`],
        distractors: md`Tratar o HF como forte e dizer que o NaF muda o $K_a$.`,
      },
      {
        title: 'Kc, temperatura e gás inerte',
        questions: ['2025 q13'],
        asks: md`Estrutura do dímero, expressão de Kc, efeito do aquecimento a partir de dois valores de Kc e efeito do gás inerte.`,
        solve: [md`$K$ cai com o aquecimento → direta exotérmica → aquecer desloca para a esquerda.`, md`Inerte a volume constante: concentrações iguais, sem deslocamento.`],
        distractors: md`Achar que mais pressão total desloca o equilíbrio mesmo sem mudar as concentrações.`,
      },
      {
        title: 'Lei de velocidade',
        questions: ['2024 q12'],
        asks: md`Fórmula do HBr, Nox do Br no BrO₃⁻, ordem em relação ao H⁺ e equação da velocidade com quatro experimentos.`,
        solve: [md`Pares de experimentos com uma só mudança.`, md`$f^x = F$ para cada reagente.`, md`Monte $v = k[\ldots]$ com as três ordens.`],
        distractors: md`Tirar as ordens dos coeficientes da equação (5 e 6).`,
      },
    ],
    traps: [
      { trap: md`Dizer que o catalisador desloca o equilíbrio.`, fix: md`Ele só acelera a chegada.` },
      { trap: md`Achar que mudar concentração muda $K$.`, fix: md`Só a temperatura muda $K$.` },
      { trap: md`Ordens pelos coeficientes da equação global.`, fix: md`Ordens vêm do experimento.` },
    ],
  },

  {
    id: 'qui-radioatividade',
    subject: 'Química',
    title: 'Radioatividade',
    years: [2025, 2026],
    howItFalls: md`Caiu nos dois últimos anos, com isótopos de uso médico: ítrio-90, com o produto do decaimento beta e a meia-vida lida numa tabela de atividade (2025); ouro-198, com a partícula da captura e o produto do decaimento beta (2026). O item (a) cobrou elétrons de íons e nêutrons.`,
    explanation: md`### 1. Emissões
- **Alfa** ($^4_2\alpha$): núcleo de hélio; $A$ cai 4, $Z$ cai 2. Pouco penetrante.
- **Beta negativa** ($^0_{-1}\beta$): um nêutron vira próton e emite um elétron; $A$ não muda, $Z$ **sobe 1**.
- **Gama** ($\gamma$): onda eletromagnética, sem massa nem carga; acompanha os decaimentos e é muito penetrante.

### 2. Equações nucleares
A soma dos $A$ e a soma dos $Z$ são iguais dos dois lados. O elemento sai do $Z$ (consulte a tabela). ⁹⁰Y ($Z = 39$) → ⁹⁰Zr ($Z = 40$); ¹⁹⁸Au ($Z = 79$) → ¹⁹⁸Hg ($Z = 80$).

### 3. Identificar a partícula que falta
Faça o balanço: na captura $^{197}_{79}\text{Au} + a \rightarrow\ ^{198}_{79}\text{Au}$, a partícula tem $A = 1$ e $Z = 0$: **nêutron** ($^1_0\text{n}$).

### 4. Meia-vida
Tempo para metade dos núcleos (ou da atividade) decair. Não depende de temperatura, pressão ou ligação química.
- Restante após $n$ meias-vidas: $\left(\frac12\right)^n$.
- **Em tabela**: procure dois valores em que a atividade caiu à metade ou a um quarto. De 500 para 125 MBq são duas meias-vidas; se isso levou 128 h, $t_{1/2} = 64$ h. Confira com outro ponto da tabela.

### 5. Usos
Radioterapia (⁹⁰Y em tumores de fígado), traçadores (¹⁹⁸Au), diagnóstico, datação por ¹⁴C, usinas (fissão).`,
    formulas: [
      { tex: String.raw`^{A}_{Z}\text{X} \rightarrow\ ^{A}_{Z+1}\text{Y} + ^{0}_{-1}\beta`, meaning: md`Decaimento beta.` },
      { tex: String.raw`^{A}_{Z}\text{X} \rightarrow\ ^{A-4}_{Z-2}\text{Y} + ^{4}_{2}\alpha`, meaning: md`Decaimento alfa.` },
      { tex: String.raw`A = \frac{A_0}{2^n}, \qquad n = \frac{t}{t_{1/2}}`, meaning: md`Atividade ou massa restante.` },
    ],
    applications: [
      md`**Saúde**: radioterapia, medicina nuclear, traçadores.`,
      md`**Energia**: fissão nuclear.`,
      md`**Arqueologia**: datação por carbono-14.`,
    ],
    strategy: [
      md`Escreva a equação com $A$ e $Z$ e confira as duas somas.`,
      md`Ache o elemento pelo $Z$.`,
      md`Meia-vida: procure pontos com razão 2 ou 4 e confira com outro.`,
    ],
    examples: [
      {
        title: 'Produto do beta',
        prompt: md`Qual o produto do decaimento beta do $^{131}_{53}\text{I}$?`,
        steps: [md`$A = 131$, $Z = 54$: $^{131}_{54}\text{Xe}$.`],
      },
      {
        title: 'Meia-vida pela tabela',
        prompt: md`A atividade cai de 800 para 100 unidades em 24 dias. Qual a meia-vida?`,
        steps: [md`$800 \rightarrow 400 \rightarrow 200 \rightarrow 100$: 3 meias-vidas.`, md`$24/3 = 8$ dias.`],
      },
    ],
    discursive: {
      prompt: md`O cobalto-60 ($Z = 27$), usado em radioterapia, sofre decaimento beta com meia-vida de cerca de 5 anos. (a) Quantos nêutrons tem o ⁶⁰Co? (b) Escreva a equação do decaimento, identificando o produto. (c) Que fração da atividade resta após 15 anos?`,
      modelAnswer: [md`(a) $60 - 27 = 33$ nêutrons.`, md`(b) $^{60}_{27}\text{Co} \rightarrow\ ^{60}_{28}\text{Ni} + ^{0}_{-1}\beta$; forma-se o níquel.`, md`(c) 15 anos = 3 meias-vidas: $\frac18$.`],
      scoring: [md`Nêutrons por $A - Z$.`, md`Equação balanceada e elemento pelo $Z$.`, md`Número de meias-vidas e fração.`],
    },
    patterns: [
      {
        title: 'Equação nuclear e partícula',
        questions: ['2025 q10', '2026 q13'],
        asks: md`Produto do decaimento beta do ⁹⁰Y e do ¹⁹⁸Au; partícula da captura no ouro; meia-vida do ⁹⁰Y por uma tabela de atividade.`,
        solve: [md`Beta: $Z + 1$, mesmo $A$.`, md`Partícula pelo balanço de $A$ e $Z$.`, md`Meia-vida por dois pontos com razão 4.`],
        distractors: md`Diminuir o $Z$ no beta e usar dois pontos que não têm razão de potência de 2.`,
      },
    ],
    traps: [
      { trap: md`No beta, diminuir o $Z$.`, fix: md`No beta negativo, $Z$ aumenta 1.` },
      { trap: md`Achar que a temperatura muda a meia-vida.`, fix: md`A meia-vida é propriedade do núcleo.` },
    ],
  },
];
