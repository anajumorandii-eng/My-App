// Matemática: capítulos que mais caem na objetiva da Famerp. Sem discursiva:
// o 2º dia da Famerp é só Biologia, Química e Física.

import type { ChapterTheory } from '../types';

const md = String.raw;

export const matematica: Record<string, ChapterTheory> = {
  'mat_aritmetica_proporcionalidade::Porcentagem': {
    howItFalls: md`Caiu nos **5 anos**. A Famerp quase nunca pede "calcule $x\%$ de $y$". Pede: comparação relativa ("A é 24% mais barato que B; quanto B é mais caro que A?"), porcentagem de um total lido em tabela (candidatos por curso), lucro sobre o custo (rifa), propriedades gerais ("$x\%$ de $y$ é igual a $y\%$ de $x$?") e conjuntos (quem tem água encanada, mas não esgoto).`,
    explanation: md`### Toda porcentagem tem uma base
$x\% = \dfrac{x}{100}$ **de alguma coisa**. A pergunta muda de resposta quando a base muda, e é aí que a Famerp monta as alternativas erradas.

### Comparação relativa
"A é 20% menor que B" usa **B** como base: $A = 0{,}8\,B$.
"Quanto B é maior que A" usa **A** como base: $B = \dfrac{A}{0{,}8} = 1{,}25\,A$, ou seja, 25% maior.
As duas porcentagens são diferentes porque as bases são diferentes.

### Fator multiplicativo
- Aumento de $i$: multiplique por $(1 + i)$.
- Desconto de $i$: multiplique por $(1 - i)$.
- Variações sucessivas: **multiplique** os fatores. Desconto de $x\%$ seguido de acréscimo de $x\%$ dá $(1 - \frac{x}{100})(1 + \frac{x}{100}) = 1 - \left(\frac{x}{100}\right)^2$, sempre **menor** que 1.

### Lucro
"Lucro de 60% sobre o custo": venda $= 1{,}6 \times$ custo. "Lucro de 60% sobre a venda" seria outra conta. Leia de quem é a base.

### Propriedades
$x\%$ de $y = \dfrac{x\,y}{100} = y\%$ de $x$: vale sempre, porque a multiplicação é comutativa. Desconto de $x\%$ sobre $y$ resulta em $\dfrac{(100 - x)\,y}{100}$.

### Porcentagem em tabela
Parte do total $= \dfrac{\text{parte}}{\text{total}} \times 100\%$. Quando a tabela dá "relação candidato/vaga" e "vagas", o número de candidatos é o **produto** dos dois.

### Conjuntos
Se todos os que têm esgoto também têm água, quem tem água mas não esgoto $=$ total com água $-$ total com esgoto.`,
    formulas: [
      { tex: String.raw`V_{\text{final}} = V_{\text{inicial}}\,(1 \pm i)`, meaning: md`Aumento (+) ou desconto (−) de taxa $i$ na forma decimal.` },
      { tex: String.raw`\text{variação} = \frac{V_{\text{final}} - V_{\text{inicial}}}{V_{\text{inicial}}}`, meaning: md`A base é sempre o valor **inicial** da comparação.` },
      { tex: String.raw`M = C\,(1 + i)^n`, meaning: md`Juros compostos: a mesma taxa aplicada $n$ vezes.` },
    ],
    applications: [
      md`**Estatística**: porcentagem de valores numa faixa e setores de gráfico.`,
      md`**Química**: pureza, rendimento, título e concentração em % (m/v).`,
      md`**Biologia**: proporções genéticas e frequências alélicas.`,
      md`**Geografia**: crescimento populacional, taxas de urbanização e desmatamento.`,
    ],
    strategy: [
      md`Sublinhe a base de cada porcentagem ("menor que **B**", "lucro sobre o **custo**").`,
      md`Transforme tudo em fator e escreva uma equação só.`,
      md`Para propriedades gerais, teste com números simples ($x = 10$, $y = 50$) antes de concluir.`,
    ],
    examples: [
      {
        title: 'Comparação relativa',
        prompt: md`O preço na loja A é 20% menor que na loja B. Em relação a A, quanto B é mais caro?`,
        steps: [md`$A = 0{,}8\,B \Rightarrow B = \dfrac{A}{0{,}8} = 1{,}25\,A$.`, md`B é 25% mais caro que A.`],
      },
      {
        title: 'Lucro sobre o custo',
        prompt: md`Uma rifa de 300 bilhetes a 8 reais cada deu lucro de 50% sobre o custo do prêmio. Quanto custou o prêmio?`,
        steps: [md`Arrecadação: $300 \times 8 = 2400$.`, md`$1{,}5 \times \text{custo} = 2400 \Rightarrow \text{custo} = 1600$ reais.`],
      },
    ],
    traps: [
      { trap: md`Responder que B é 20% maior porque A é 20% menor.`, fix: md`A base mudou: refaça a razão com a nova base.` },
      { trap: md`Somar aumentos sucessivos.`, fix: md`Multiplique os fatores: $1{,}1 \times 0{,}9 = 0{,}99$.` },
      { trap: md`Calcular o lucro sobre a venda quando o enunciado diz "sobre o custo".`, fix: md`Venda $= (1 + i) \times$ custo.` },
    ],
  },

  'mat_trigonometria::Trigonometria no Triângulo Retângulo': {
    howItFalls: md`Caiu em 4 anos (2022, 2023, 2024, 2026), sempre embutida em geometria: a diagonal de um retângulo com o cosseno dado, uma altura que divide um triângulo em ângulos de 30° e 45°, a tangente dada como dízima periódica e um avião observado a altitude constante.`,
    explanation: md`### As razões
No triângulo retângulo, para um ângulo agudo $\alpha$:
- $\sin\alpha = \dfrac{\text{cateto oposto}}{\text{hipotenusa}}$
- $\cos\alpha = \dfrac{\text{cateto adjacente}}{\text{hipotenusa}}$
- $\tan\alpha = \dfrac{\text{cateto oposto}}{\text{cateto adjacente}}$

Elas não dependem do tamanho do triângulo, só do ângulo: triângulos semelhantes têm as mesmas razões.

### Ângulos notáveis
| | 30° | 45° | 60° |
|---|---|---|---|
| sen | $\frac12$ | $\frac{\sqrt2}{2}$ | $\frac{\sqrt3}{2}$ |
| cos | $\frac{\sqrt3}{2}$ | $\frac{\sqrt2}{2}$ | $\frac12$ |
| tg | $\frac{\sqrt3}{3}$ | $1$ | $\sqrt3$ |

### Com uma razão dada, ache as outras
Use $\sin^2\alpha + \cos^2\alpha = 1$. Com $\cos\alpha = \frac35$, $\sin\alpha = \frac45$. Isso dá os dois catetos a partir da hipotenusa.

### Triângulo que não é retângulo
Trace uma **altura**: ela cria dois triângulos retângulos, que você resolve separadamente e depois soma as bases.

### Dízima vira fração
$0{,}5333\ldots = \dfrac{8}{15}$. Com a tangente em fração, você lê os catetos como 8 e 15 (ou múltiplos).`,
    formulas: [
      { tex: String.raw`\sin^2\alpha + \cos^2\alpha = 1`, meaning: md`Relação fundamental: dá uma razão a partir da outra.` },
      { tex: String.raw`\tan\alpha = \frac{\sin\alpha}{\cos\alpha}`, meaning: md`Tangente a partir de seno e cosseno.` },
      { tex: String.raw`a^2 = b^2 + c^2`, meaning: md`Pitágoras: $a$ é a hipotenusa.` },
    ],
    applications: [
      md`**Física**: decomposição de forças no plano inclinado ($P\sin\theta$, $P\cos\theta$), lançamentos, refração (Snell).`,
      md`**Geometria plana e espacial**: alturas, diagonais e áreas.`,
      md`**Cotidiano**: altura de prédios pela sombra, rampas de acessibilidade, distância de um avião.`,
    ],
    strategy: [
      md`Marque o ângulo e nomeie os três lados em relação a ele.`,
      md`Escolha a razão que liga o lado conhecido ao lado procurado.`,
      md`Se o triângulo não é retângulo, trace a altura.`,
    ],
    examples: [
      {
        title: 'Diagonal e cosseno',
        prompt: md`A diagonal de um retângulo mede 10 cm e forma um ângulo $\alpha$ com um lado, com $\cos\alpha = \frac35$. Qual a área?`,
        steps: [md`Lado adjacente: $10 \cdot \frac35 = 6$ cm.`, md`$\sin\alpha = \frac45$; lado oposto: $10 \cdot \frac45 = 8$ cm.`, md`Área $= 6 \times 8 = 48\ \text{cm}^2$.`],
      },
      {
        title: 'Altura que divide',
        prompt: md`Num triângulo, a altura de 6 cm forma com os lados ângulos de 45° e 60° com a vertical. Qual a base?`,
        steps: [md`Lado do 45°: $6 \tan 45^\circ = 6$ cm.`, md`Lado do 60°: $6 \tan 60^\circ = 6\sqrt3$ cm.`, md`Base $= 6 + 6\sqrt3 = 6(1 + \sqrt3)$ cm.`],
      },
    ],
    traps: [
      { trap: md`Trocar oposto e adjacente.`, fix: md`Adjacente é o cateto que encosta no ângulo marcado.` },
      { trap: md`Usar a tabela de 30° com o ângulo errado.`, fix: md`Confira qual ângulo da figura vale 30°: o complementar vale 60°.` },
    ],
  },

  'mat_dados_probabilidade::Estatística Descritiva': {
    howItFalls: md`Caiu em 4 anos (2022, 2023, 2024, 2026), sempre com gráfico ou tabela real: desmatamento anual na Amazônia, receitas e despesas de uma empresa, população por tipo de moradia, notas de uma aluna. Pede média, mediana, porcentagem de valores numa faixa e ângulo de setor circular.`,
    explanation: md`### Medidas de tendência central
- **Média aritmética**: soma dividida pela quantidade. Sensível a valores extremos.
- **Média ponderada**: cada valor multiplicado pelo seu peso; divide-se pela soma dos pesos.
- **Mediana**: o valor do meio dos dados **ordenados**. Com quantidade par, a média dos dois centrais. Não é afetada por valores extremos.
- **Moda**: o valor mais frequente.

### Lendo gráficos
- **Colunas e linhas**: leia o eixo vertical com atenção à escala (às vezes não começa no zero).
- **Setores (pizza)**: o ângulo é proporcional à fração do total. Um setor com 25% tem 90°.
- **Faixas**: "maior que 10 000 e menor que 15 000" **exclui** os extremos.

### Quantidade derivada
Às vezes a média é de uma grandeza calculada, como lucro = receita − despesa. Calcule a grandeza ano a ano e só depois a média.`,
    formulas: [
      { tex: String.raw`\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}`, meaning: md`Média aritmética.` },
      { tex: String.raw`\bar{x}_p = \frac{\sum x_i\,p_i}{\sum p_i}`, meaning: md`Média ponderada pelos pesos $p_i$.` },
      { tex: String.raw`\theta = \frac{\text{parte}}{\text{total}} \times 360^\circ`, meaning: md`Ângulo do setor circular.` },
    ],
    applications: [
      md`**Geografia**: dados de população, desmatamento e saneamento vêm em tabelas e gráficos.`,
      md`**Biologia**: média de experimentos, variação de populações.`,
      md`**Saúde**: interpretar exames e estudos (a mediana resiste a casos extremos).`,
      md`**Nota de vestibular**: notas ponderadas por peso de prova.`,
    ],
    strategy: [
      md`Copie os dados do gráfico numa lista antes de calcular.`,
      md`Para mediana, ordene; para faixa, decida se os extremos entram.`,
      md`Se a pergunta combina duas medidas, calcule cada uma separadamente.`,
    ],
    examples: [
      {
        title: 'Mediana com incógnita',
        prompt: md`Um aluno tirou $x$, $2x$ e $3x$ em três provas, com média 4. Qual a mediana?`,
        steps: [md`$\dfrac{x + 2x + 3x}{3} = 2x = 4 \Rightarrow x = 2$.`, md`Notas: 2, 4 e 6. Mediana $= 4$.`],
      },
      {
        title: 'Setor circular',
        prompt: md`Num município de 50 000 habitantes, 8 000 moram em condomínios. Qual o ângulo desse setor num gráfico de pizza?`,
        steps: [md`$\dfrac{8000}{50000} = 0{,}16$.`, md`$0{,}16 \times 360^\circ = 57{,}6^\circ$.`],
      },
    ],
    traps: [
      { trap: md`Calcular a mediana sem ordenar.`, fix: md`Ordene antes.` },
      { trap: md`Fazer média de médias de grupos de tamanhos diferentes.`, fix: md`Pondere pelo tamanho de cada grupo.` },
      { trap: md`Incluir os extremos numa faixa definida por "maior que" e "menor que".`, fix: md`Desigualdade estrita exclui o limite.` },
    ],
  },

  'mat_funcoes::Função Quadrática': {
    howItFalls: md`Caiu em 4 anos (2022–2025): lucro máximo pelo vértice, coeficientes a partir das raízes, a condição para duas raízes reais distintas e não negativas e a montagem de $y = ax^2 + bx + c$ a partir de três pontos de uma tabela.`,
    explanation: md`### Forma e gráfico
$f(x) = ax^2 + bx + c$, com $a \neq 0$. O gráfico é uma parábola:
- $a > 0$: concavidade para cima, o vértice é o **mínimo**.
- $a < 0$: concavidade para baixo, o vértice é o **máximo** (lucro, altura, área máximos).
- $c$ é onde a parábola corta o eixo $y$.

### Vértice
$x_v = -\dfrac{b}{2a}$ é a quantidade que otimiza; $y_v = f(x_v)$ é o valor ótimo. Por simetria, $x_v$ é a média das raízes.

### Raízes
$\Delta = b^2 - 4ac$ decide quantas existem: $\Delta > 0$ duas reais distintas; $\Delta = 0$ uma (dupla); $\Delta < 0$ nenhuma real.
Soma $= -\dfrac{b}{a}$, produto $= \dfrac{c}{a}$. Raízes conhecidas $r_1, r_2$: $f(x) = a(x - r_1)(x - r_2)$.

### Sinais das raízes
Duas raízes reais distintas e **não negativas**: $\Delta > 0$, soma $\geq 0$ e produto $\geq 0$.

### Três pontos dados
Substitua cada ponto em $y = ax^2 + bx + c$ e resolva o sistema de três equações. Subtrair uma equação da outra elimina $c$ e acelera.`,
    formulas: [
      { tex: String.raw`x_v = -\frac{b}{2a}, \qquad y_v = -\frac{\Delta}{4a}`, meaning: md`Coordenadas do vértice.` },
      { tex: String.raw`x = \frac{-b \pm \sqrt{\Delta}}{2a}, \qquad \Delta = b^2 - 4ac`, meaning: md`Bhaskara.` },
      { tex: String.raw`x_1 + x_2 = -\frac{b}{a}, \qquad x_1\,x_2 = \frac{c}{a}`, meaning: md`Soma e produto das raízes.` },
    ],
    applications: [
      md`**Física**: altura no lançamento vertical, $s = s_0 + v_0 t + \frac{a t^2}{2}$, é uma parábola no tempo.`,
      md`**Economia**: lucro = receita − custo, com máximo no vértice.`,
      md`**Geometria**: área máxima de um retângulo com perímetro fixo.`,
    ],
    strategy: [
      md`Se pede máximo ou mínimo, vá direto ao vértice.`,
      md`Se dá as raízes, escreva a forma fatorada.`,
      md`Se pede condição sobre raízes, use $\Delta$, soma e produto.`,
    ],
    examples: [
      {
        title: 'Lucro máximo',
        prompt: md`$L(x) = -x^2 + 600x$. Qual o lucro máximo?`,
        steps: [md`$x_v = -\dfrac{600}{2(-1)} = 300$.`, md`$L(300) = -90\,000 + 180\,000 = 90\,000$.`],
      },
      {
        title: 'Coeficientes pelas raízes',
        prompt: md`$f(x) = x^2 + mx + p$ corta o eixo $x$ em $-1$ e $5$. Calcule $m + p$.`,
        steps: [md`$f(x) = (x + 1)(x - 5) = x^2 - 4x - 5$.`, md`$m = -4$, $p = -5$, $m + p = -9$.`],
      },
    ],
    traps: [
      { trap: md`Responder $x_v$ quando a pergunta pede o valor máximo.`, fix: md`$x_v$ é a quantidade; o valor é $y_v$.` },
      { trap: md`Esquecer que "não negativas" admite zero.`, fix: md`Use soma $\geq 0$ e produto $\geq 0$.` },
    ],
  },

  'mat_geometria_espacial::Cubos e Paralelepípedos': {
    howItFalls: md`Caiu em 2022, 2024 e 2026: volume a partir da área total, o aumento de área ao cortar um prisma em dois e os sólidos formados quando um plano corta uma composição de cubos.`,
    explanation: md`### Paralelepípedo retângulo
Arestas $a$, $b$, $c$. Seis faces retangulares, opostas iguais duas a duas.

### Cubo
Caso particular com as três arestas iguais.

### Cortar um sólido
- O **volume total se conserva**: a soma dos volumes das partes é o volume original.
- A **área total aumenta** exatamente pelas faces novas: cada corte cria **duas** faces, uma em cada pedaço.

### Plano que corta um cubo
Um plano **perpendicular a uma face** que passa por uma diagonal dela (e, portanto, pela diagonal paralela da face oposta) divide o cubo em dois prismas triangulares iguais, cada um com metade do volume. Um plano qualquer que só contenha a diagonal de uma face pode cortar outra forma, como um tetraedro. Leia na figura como o plano corta.`,
    formulas: [
      { tex: String.raw`V = a\,b\,c`, meaning: md`Volume do paralelepípedo; no cubo, $V = a^3$.` },
      { tex: String.raw`A_T = 2(ab + ac + bc)`, meaning: md`Área total; no cubo, $A_T = 6a^2$.` },
      { tex: String.raw`d = \sqrt{a^2 + b^2 + c^2}`, meaning: md`Diagonal do paralelepípedo; no cubo, $d = a\sqrt3$.` },
    ],
    applications: [
      md`**Química e Física**: volume de recipientes, densidade, capacidade (1 L = 1 dm³).`,
      md`**Cotidiano**: embalagens, caixas d'água, quantidade de material.`,
      md`**Escala**: dobrar as arestas multiplica a área por 4 e o volume por 8.`,
    ],
    strategy: [
      md`Escreva a fórmula com as incógnitas e use o dado do enunciado para achá-las.`,
      md`Em corte, conte as faces novas.`,
      md`Desenhe o sólido e o plano de corte antes de calcular.`,
    ],
    examples: [
      {
        title: 'Volume pela área',
        prompt: md`Um paralelepípedo de base quadrada com lado 3 cm tem área total $90\ \text{cm}^2$. Qual o volume?`,
        steps: [md`$A_T = 2 \cdot 3^2 + 4 \cdot 3 \cdot h = 18 + 12h = 90$.`, md`$h = 6$ cm.`, md`$V = 3 \cdot 3 \cdot 6 = 54\ \text{cm}^3$.`],
      },
      {
        title: 'Corte',
        prompt: md`Um bloco de $4 \times 5 \times 10$ cm é cortado por um plano paralelo à face $4 \times 5$. Quanto a área total aumenta?`,
        steps: [md`O corte cria duas faces de $4 \times 5 = 20\ \text{cm}^2$.`, md`Aumento $= 40\ \text{cm}^2$; o volume não muda.`],
      },
    ],
    traps: [
      { trap: md`Achar que cortar muda o volume total.`, fix: md`O volume se conserva.` },
      { trap: md`Contar uma face só por corte.`, fix: md`Cada corte cria duas faces.` },
    ],
  },

  'mat_geometria_analitica::Posições Relativas entre Duas Retas': {
    howItFalls: md`Caiu de 2022 a 2024 com ruas e triângulos no plano cartesiano: reta perpendicular a outra num ponto, interseção de retas e comprimento de lado de um triângulo.`,
    explanation: md`### Coeficiente angular
$m = \dfrac{\Delta y}{\Delta x}$ mede a inclinação. Reta que passa por $(0, b)$ e $(a, 0)$: $m = -\dfrac{b}{a}$.

### Equação da reta
- Reduzida: $y = mx + n$ ($n$ é onde corta o eixo $y$).
- Por um ponto: $y - y_0 = m(x - x_0)$.
- Geral: $ax + by + c = 0$, com $m = -\dfrac{a}{b}$.

### Posições
- **Paralelas**: mesmo $m$, $n$ diferentes.
- **Concorrentes**: $m$ diferentes; o ponto comum sai do sistema.
- **Perpendiculares**: $m_1 \cdot m_2 = -1$, ou seja, $m_2$ é o inverso de $m_1$ com sinal trocado.

### Pontos notáveis
- Corte no eixo $x$: faça $y = 0$. No eixo $y$: $x = 0$.
- Distância entre pontos: Pitágoras nas diferenças das coordenadas.`,
    formulas: [
      { tex: String.raw`m = \frac{y_2 - y_1}{x_2 - x_1}`, meaning: md`Coeficiente angular.` },
      { tex: String.raw`y - y_0 = m\,(x - x_0)`, meaning: md`Reta por um ponto com inclinação $m$.` },
      { tex: String.raw`m_1 \cdot m_2 = -1`, meaning: md`Condição de perpendicularidade.` },
      { tex: String.raw`d = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`, meaning: md`Distância entre dois pontos.` },
    ],
    applications: [
      md`**Física**: gráficos $s \times t$ do MU são retas; a inclinação é a velocidade.`,
      md`**Cartografia**: coordenadas e distâncias em mapas.`,
      md`**Estatística**: tendência linear de um gráfico.`,
    ],
    strategy: [
      md`Ache o $m$ da reta conhecida.`,
      md`Para a perpendicular, use $-1/m$ e o ponto dado.`,
      md`Para interseção, resolva o sistema; para corte em eixo, zere a outra coordenada.`,
    ],
    examples: [
      {
        title: 'Perpendicular',
        prompt: md`A reta $s$ passa por $(0, 6)$ e $(3, 0)$. Qual a reta $r$ perpendicular a $s$ pela origem?`,
        steps: [md`$m_s = \dfrac{0 - 6}{3 - 0} = -2$.`, md`$m_r = \dfrac{1}{2}$.`, md`$r: y = \dfrac{x}{2}$.`],
      },
      {
        title: 'Interseção e distância',
        prompt: md`Ache o ponto comum de $y = 2x$ e $y = -x + 6$ e sua distância à origem.`,
        steps: [md`$2x = -x + 6 \Rightarrow x = 2$, $y = 4$.`, md`$d = \sqrt{2^2 + 4^2} = \sqrt{20} = 2\sqrt5$.`],
      },
    ],
    traps: [
      { trap: md`Usar $m_2 = -m_1$ para perpendiculares.`, fix: md`É $m_2 = -1/m_1$.` },
      { trap: md`Trocar $\Delta x$ e $\Delta y$.`, fix: md`$m$ é variação de $y$ sobre variação de $x$.` },
    ],
  },
};
