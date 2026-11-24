// Como a Famerp cobra cada capítulo prioritário, tipo por tipo, a partir da
// leitura das 89 questões reais desses capítulos (2022–2026). Cada tipo cita
// as questões; o teste confere que elas existem no banco e são do capítulo.
//
// O método de resolução é dado sem a letra do gabarito: a estudante ainda
// precisa aplicá-lo. Quem guarda 2025 e 2026 para o simulado é avisado na
// tela antes de abrir esta seção.

import type { ExamPattern } from '../types';

const md = String.raw;

export const famerpPatterns: Record<string, ExamPattern[]> = {
  // ───────────────────────── Física ─────────────────────────
  'fis_estatica::Hidrostática: Densidade e Pressão': [
    {
      title: 'Flutuação: empuxo igual ao peso',
      questions: ['2022 q66', '2025 q64'],
      asks: md`Um corpo **flutua em equilíbrio** e a pergunta é sobre a água deslocada ou sobre a força extra para afundá-lo. Em 2022, a massa de água que transborda de um copo cheio; em 2025, a força que um peixe faz para afundar uma fruta com 85% do volume submerso.`,
      solve: [
        md`Escreva $E = P$: em equilíbrio, o empuxo equilibra o peso.`,
        md`Como $E$ = peso do líquido deslocado, a **massa de água deslocada é a massa do corpo**. Isso responde o copo que transborda sem conta nenhuma.`,
        md`Para afundar totalmente: o empuxo cresce na proporção do volume. Se 85% submerso dá $E = P$, 100% dá $E_{\text{total}} = P/0{,}85$.`,
        md`Força mínima $= E_{\text{total}} - P$. Faça a conta só no fim, com o $P$ dado.`,
      ],
      distractors: md`Frações e múltiplos da massa (m/2, 2m, m/4) para quem acha que a água derramada depende do volume submerso; o próprio peso (0,34 N) para quem esquece de subtrair; e o empuxo total para quem não desconta o peso.`,
    },
    {
      title: 'Densidade pela água deslocada',
      questions: ['2023 q65'],
      asks: md`Medir a densidade de um corpo sem balança, com uma proveta: uma leitura com o corpo **flutuando** e outra com ele **totalmente submerso**.`,
      solve: [
        md`Leitura flutuando − leitura inicial = volume deslocado em equilíbrio. Esse volume de água tem a **massa do corpo** ($E = P$).`,
        md`Leitura submerso − leitura inicial = **volume do corpo**.`,
        md`$d = \dfrac{m}{V}$, com a massa da primeira etapa e o volume da segunda.`,
      ],
      distractors: md`Alternativas próximas (0,70 a 0,90 g/mL) que saem de trocar as leituras: usar o volume submerso como massa ou a leitura final em vez da diferença.`,
    },
    {
      title: 'Pressão hidrostática que varia no tempo',
      questions: ['2024 q65'],
      asks: md`O nível de um tanque sobe a uma taxa constante; pede a taxa de aumento da pressão no fundo.`,
      solve: [
        md`$p = d\,g\,h$, então $\dfrac{\Delta p}{\Delta t} = d\,g\,\dfrac{\Delta h}{\Delta t}$.`,
        md`Converta a taxa do nível para m/min antes de multiplicar (5,0 cm/min = 0,050 m/min).`,
        md`A forma e a área do tanque não entram: a pressão só depende da altura.`,
      ],
      distractors: md`Potências de 10 erradas (2,0 × 10², 5,0 × 10², 2,5 × 10³) de quem não converte cm para m ou multiplica pelo tempo.`,
    },
  ],

  'fis_cinematica::Movimento Uniforme': [
    {
      title: 'Conversão de unidades e distância',
      questions: ['2024 q62'],
      asks: md`Velocidade em km/h e tempo em segundos: distância percorrida.`,
      solve: [md`Divida por 3,6: 108 km/h = 30 m/s.`, md`$\Delta s = v\,\Delta t$.`],
      distractors: md`Valores vizinhos (10 a 15 m) que saem de dividir errado ou de não converter.`,
    },
    {
      title: 'Frota de uma linha circular',
      questions: ['2025 q61'],
      asks: md`Comprimento do percurso, velocidade média e intervalo entre saídas: número mínimo de ônibus.`,
      solve: [md`Tempo de uma volta $= \dfrac{\text{percurso}}{v_m}$, em minutos.`, md`Frota $= \dfrac{\text{tempo de volta}}{\text{intervalo}}$, arredondada **para cima**.`],
      distractors: md`O número logo abaixo ou acima do certo, para quem arredonda errado ou deixa o tempo em horas.`,
    },
    {
      title: 'Distância entre corredores',
      questions: ['2026 q62'],
      asks: md`Dois atletas cruzam a linha com uma diferença de tempo, ambos à mesma velocidade final; pede a distância entre eles quando o primeiro termina.`,
      solve: [md`O segundo ainda precisa de $\Delta t$ para terminar.`, md`Distância $= v \times \Delta t$, com a diferença de tempos.`],
      distractors: md`Distâncias calculadas com as velocidades médias de cada atleta (100/tempo), que dão valores um pouco diferentes do certo.`,
    },
    {
      title: 'Significado da área sob um gráfico',
      questions: ['2026 q61'],
      asks: md`Gráfico de **vazão** (L/s) × tempo de uma artéria; pede o que a área sob a curva representa.`,
      solve: [md`Área = grandeza do eixo vertical × grandeza do eixo horizontal.`, md`(L/s) × s = L: a área é um **volume**.`, md`Faça sempre a análise dimensional antes de olhar as alternativas.`],
      distractors: md`Velocidade, fluxo médio, massa e aceleração: grandezas que aparecem no contexto mas não têm a unidade da área.`,
    },
  ],

  'fis_calorimetria::Calor Sensível e Calor Latente': [
    {
      title: 'Equilíbrio térmico com um recipiente',
      questions: ['2026 q66'],
      asks: md`Água quente numa xícara fria; a xícara tem **capacidade térmica** dada. Pede a temperatura de equilíbrio.`,
      solve: [md`Calor cedido pela água = calor recebido pela xícara.`, md`$m\,c\,(T_i - T) = C_{\text{xícara}}\,(T - T_{\text{xícara}})$.`, md`A capacidade térmica já é $m\,c$: use direto.`],
      distractors: md`Média simples das temperaturas e valores de quem esquece a xícara.`,
    },
    {
      title: 'Gelo derretendo: calor latente',
      questions: ['2023 q66'],
      asks: md`Gelo a 0 °C resfria garrafas até 0 °C; pede a capacidade térmica de cada garrafa.`,
      solve: [md`Calor para derreter o gelo: $Q = m\,L$ (massa em gramas).`, md`Esse calor sai das garrafas: $Q = n\,C\,\Delta T$.`, md`Divida pelo número de garrafas.`],
      distractors: md`O valor total (sem dividir por 20) e valores de quem usa a massa em kg com L em cal/g.`,
    },
    {
      title: 'Potência constante e altitude',
      questions: ['2024 q66'],
      asks: md`O mesmo ebulidor aquece a mesma água até a ebulição em duas cidades; numa delas a água ferve abaixo de 100 °C.`,
      solve: [md`Potência igual: o tempo é proporcional ao calor, logo a $\Delta T$.`, md`$t_2 = t_1 \cdot \dfrac{\Delta T_2}{\Delta T_1}$.`],
      distractors: md`Tempos vizinhos de quem usa as temperaturas finais em vez das variações.`,
    },
  ],

  'fis_fisica_moderna::Noções Básicas de Física Quântica': [
    {
      title: 'Transição no modelo de Bohr',
      questions: ['2023 q70'],
      asks: md`A fórmula $E_n = -13{,}6/n^2$ é dada; pede a energia absorvida entre dois níveis.`,
      solve: [md`Calcule $E$ dos dois níveis.`, md`$\Delta E = E_{\text{final}} - E_{\text{inicial}}$: subir de nível dá valor positivo (absorção).`],
      distractors: md`A energia de um dos níveis sozinha (1,51 ou 3,40 eV) e a soma em vez da diferença.`,
    },
    {
      title: 'Quais luzes arrancam elétrons',
      questions: ['2025 q70'],
      asks: md`Tabela de cores com frequências e a energia mínima do metal; pede quais cores produzem emissão.`,
      solve: [md`Frequência mínima $f_0 = E_0/h$, com $h$ inteiro no denominador.`, md`Emitem as cores com $f \geq f_0$: as de frequência mais alta (do violeta para baixo).`],
      distractors: md`Conjuntos que incluem uma cor a mais ou a menos do limite, e conjuntos com as cores de **menor** frequência.`,
    },
    {
      title: 'Mesma luz, metais diferentes',
      questions: ['2026 q70'],
      asks: md`Sabe-se a energia cinética dos elétrons num metal; pede a energia cinética em outro metal com a mesma luz.`,
      solve: [md`Energia do fóton $= E_c + E_0$ no primeiro metal.`, md`No segundo: $E_c' = E_{\text{fóton}} - E_0'$.`, md`Se o resultado fosse negativo, não haveria emissão.`],
      distractors: md`A energia cinética original, a diferença entre as funções trabalho e potências de 10 trocadas.`,
    },
  ],

  // ───────────────────────── Química ─────────────────────────
  'qui_solucoes::Dispersões': [
    {
      title: 'Concentração em mol/L a partir de rótulo ou bula',
      questions: ['2022 q52', '2023 q56'],
      asks: md`Massa de soluto e volume dados (às vezes como faixa, "0,75 a 1 kg em 300 a 400 L"); pede a molaridade.`,
      solve: [md`Se há faixa, escolha o extremo pedido: **mais diluída** = menor massa no maior volume.`, md`$n = m/M$, depois $\mathfrak{M} = n/V$ com $V$ em litros.`],
      distractors: md`Os outros cruzamentos da faixa (mais concentrada, massas e volumes trocados) e o valor sem converter mL em L.`,
    },
    {
      title: 'Porção de uma solução preparada',
      questions: ['2024 q55'],
      asks: md`Um fármaco dissolvido em soro glicosado a 5% (m/v); o paciente recebe uma parte. Pede as massas de fármaco e de glicose recebidas.`,
      solve: [md`Fração recebida = volume recebido / volume total.`, md`Fármaco: massa total × fração. Glicose: 5 g por 100 mL do soro × volume recebido.`],
      distractors: md`Combinações em que uma das massas está certa e a outra usa o volume total ou esquece a fração.`,
    },
    {
      title: 'Regra de três com limite de rótulo',
      questions: ['2026 q59'],
      asks: md`Limite em g por 100 mL; pede a quantidade mínima num volume maior.`,
      solve: [md`Proporção direta: g/100 mL × volume.`],
      distractors: md`O próprio limite (para 100 mL), a fração errada e um fator 10 a mais.`,
    },
  ],

  'qui_polaridade_geometria::Interações Intermoleculares': [
    {
      title: 'Ordem de temperatura de ebulição',
      questions: ['2022 q53'],
      asks: md`Quatro compostos de mesma cadeia (alcano, cetona, álcool, ácido); pede a ordem crescente de ebulição.`,
      solve: [md`Classifique a interação de cada um: London < dipolo < ligação de H.`, md`Entre ácido e álcool, o ácido fica acima (dímeros).`],
      distractors: md`Ordens invertidas (decrescente) e ordens que trocam só o par álcool–ácido ou cetona–alcano.`,
    },
    {
      title: 'Interação entre soluto e solvente',
      questions: ['2025 q55'],
      asks: md`Fórmulas estruturais de um soluto e de um solvente (amina); pede a principal interação entre eles.`,
      solve: [md`Procure H ligado a N, O ou F em um deles e N, O ou F com par livre no outro: ligação de hidrogênio.`, md`Só depois considere dipolo permanente.`],
      distractors: md`Íon-dipolo e ligação iônica (não há íons), dipolo-dipolo e dipolo-induzido.`,
    },
    {
      title: 'Polaridade da ligação e geometria',
      questions: ['2026 q58'],
      asks: md`Eletronegatividades dadas; pede o tipo de ligação e a geometria do PCl₃.`,
      solve: [md`Diferença de eletronegatividade pequena e não nula: covalente **polar**.`, md`Átomo central com 3 ligações e 1 par isolado: **piramidal**.`],
      distractors: md`"Iônica" para quem vê a diferença de eletronegatividade e "plana trigonal" para quem esquece o par isolado.`,
    },
  ],

  'qui_estequiometria::Separação de Misturas': [
    {
      title: 'Esquema de separação com solubilidades',
      questions: ['2023 q53'],
      asks: md`Fluxograma de separação da pólvora negra com água e depois CS₂; pede o que sobra em cada etapa.`,
      solve: [md`Siga etapa por etapa: o que dissolve vai para o líquido, o que não dissolve fica no filtro.`, md`Evaporar ou destilar um líquido deixa como sólido o que estava dissolvido nele.`],
      distractors: md`Permutações das três substâncias.`,
    },
    {
      title: 'Camadas e densidade',
      questions: ['2025 q52', '2026 q51'],
      asks: md`Tabela de densidades (e temperaturas de fusão); pede quais substâncias formam as fases, ou que sólido boia e qual afunda num líquido.`,
      solve: [md`Líquidos que formam duas fases são **imiscíveis**; o menos denso fica em cima.`, md`Sólido boia se é menos denso que o líquido.`, md`Estado físico a 25 °C: fusão abaixo de 25 °C = não é sólido.`],
      distractors: md`Pares miscíveis (metanol e água) e substâncias que nem são sólidas a 25 °C.`,
    },
  ],

  'qui_oxirreducao::Processos de Oxirredução': [
    {
      title: 'Nox num íon',
      questions: ['2026 q56'],
      asks: md`Nox de um elemento num íon poliatômico.`,
      solve: [md`Soma dos Nox = carga do íon.`],
      distractors: md`O valor com o sinal trocado e o valor de quem iguala a soma a zero.`,
    },
    {
      title: 'Quem oxida e quem reduz numa equação',
      questions: ['2022 q57', '2023 q54'],
      asks: md`Equação real (hipoclorito com glicina; pólvora negra); pede oxidante, redutor ou a variação de Nox.`,
      solve: [md`Calcule o Nox de cada elemento antes e depois.`, md`Quem sobe se oxida e é redutor; quem desce se reduz e é oxidante.`, md`Cuidado: pode haver **dois** redutores (C e S na pólvora).`],
      distractors: md`Trocar oxidante e redutor, e dizer que uma espécie "não participa" quando seu Nox muda.`,
    },
  ],

  'qui_cinetica::Cinética Química': [
    {
      title: 'Qual experimento é mais rápido',
      questions: ['2025 q56', '2022 q56'],
      asks: md`Tabela de experimentos (superfície, concentração, temperatura) ou sistemas com mesmo volume e mais moléculas.`,
      solve: [md`Marque o fator favorável em cada linha.`, md`O mais rápido reúne mais superfície, concentração e temperatura.`, md`Mais moléculas no mesmo volume, ou mesmo número em volume menor: concentração maior.`],
      distractors: md`Linhas com só um fator alto (concentração alta e lâmina, por exemplo).`,
    },
    {
      title: 'Diagrama de energia com catalisador',
      questions: ['2023 q60'],
      asks: md`Dois caminhos entre os mesmos reagentes e produtos; pede a interpretação.`,
      solve: [md`Caminho de pico mais baixo = catalisado; $E_a$ medida dos reagentes ao topo.`, md`Produtos abaixo dos reagentes: exotérmica, e o $\Delta H$ é o mesmo nos dois caminhos.`],
      distractors: md`"Catalisador libera energia", "caminho mais alto é mais rápido" e $\Delta H$ calculado como soma de alturas.`,
    },
  ],

  // ───────────────────────── Biologia ─────────────────────────
  'bio_zoologia::Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética': [
    {
      title: 'Categoria taxonômica comum',
      questions: ['2023 q43', '2026 q44'],
      asks: md`Hominídeo (Ardi, "homens das cavernas"); pede a categoria comum mais restrita ou a ordem e sua característica exclusiva.`,
      solve: [md`Escreva a hierarquia e desça até onde as duas espécies ainda coincidem.`, md`**Confira o nome da categoria** em cada alternativa: Hominidae é família, não gênero; Mammalia é classe, não ordem.`, md`Característica exclusiva tem de ser só daquele grupo: glândulas mamárias e placenta são de todos os mamíferos (placentários).`],
      distractors: md`A banca coloca o táxon certo com a **categoria errada** ("gênero Hominidae") e características verdadeiras, mas não exclusivas.`,
    },
    {
      title: 'Conceito de espécie e cruzamento',
      questions: ['2024 q44'],
      asks: md`Tirinha com dois besouros do mesmo gênero e espécies diferentes; pede o resultado do cruzamento.`,
      solve: [md`Nomes com o mesmo gênero e epítetos diferentes: espécies diferentes.`, md`Espécies diferentes podem cruzar, mas a prole é inviável ou estéril.`],
      distractors: md`Justificativas com a categoria errada (gêneros ou famílias diferentes) para a mesma conclusão.`,
    },
    {
      title: 'Leitura de cladograma',
      questions: ['2025 q44'],
      asks: md`Cladograma de DNA com sete táxons; pede quais têm maior semelhança.`,
      solve: [md`Procure o par unido no nó mais próximo das pontas.`, md`Táxons vizinhos na página, mas unidos num nó mais antigo, não são os mais próximos.`],
      distractors: md`Pares desenhados lado a lado, mas de ramos diferentes.`,
    },
  ],

  'bio_evolucao::Mecanismos da Evolução Biológica': [
    {
      title: 'Resistência e seleção natural',
      questions: ['2022 q50', '2024 q50'],
      asks: md`Resistência do *Plasmodium* à cloroquina, ou "qual frase descreve a seleção natural".`,
      solve: [md`Procure a alternativa em que a variação **já existe** e é **selecionada**.`, md`Elimine "todos desenvolvem", "adaptam-se toda vez", "aprimoraram para", "desenvolveram porque": é lamarckismo.`],
      distractors: md`Frases lamarckistas bem escritas, com exemplos reais (águias, lebres do Ártico, frutos coloridos), em que o ambiente "provoca" a mudança.`,
    },
    {
      title: 'Especiação e distribuição geográfica',
      questions: ['2025 q49'],
      asks: md`Mapa da dispersão dos camelídeos; pede a hipótese que explica espécies diferentes em continentes diferentes.`,
      solve: [md`Separação geográfica + interrupção do fluxo gênico = especiação **alopátrica**.`, md`Simpátrica é sem separação geográfica; convergência é semelhança sem parentesco próximo.`],
      distractors: md`Conceitos reais (deriva, convergência, simpátrica) com a definição torcida.`,
    },
  ],

  // ───────────────────────── Matemática ─────────────────────────
  'mat_aritmetica_proporcionalidade::Porcentagem': [
    {
      title: 'Comparação relativa entre dois valores',
      questions: ['2026 q72'],
      asks: md`"A é 24% mais barato que B; quanto B é mais caro que A?"`,
      solve: [md`$A = 0{,}76\,B \Rightarrow B = A/0{,}76$.`, md`Divida e subtraia 1: a porcentagem é maior que 24%.`],
      distractors: md`A faixa que contém 24% e faixas vizinhas da resposta certa.`,
    },
    {
      title: 'Parte de um total em tabela ou texto',
      questions: ['2025 q71', '2022 q71'],
      asks: md`Tabela de vagas e relação candidato/vaga; ou porcentagens de população com água e esgoto.`,
      solve: [md`Candidatos = vagas × relação; some o total antes de dividir.`, md`Conjuntos encaixados (quem tem esgoto também tem água): a diferença das porcentagens dá quem tem só água.`],
      distractors: md`Porcentagem calculada sobre um subtotal, ou usando a relação candidato/vaga como se fosse o número de candidatos.`,
    },
    {
      title: 'Lucro sobre o custo',
      questions: ['2023 q71'],
      asks: md`Rifa com todos os bilhetes vendidos e lucro de 60% sobre o custo do prêmio.`,
      solve: [md`Arrecadação = preço × número de bilhetes.`, md`Arrecadação $= 1{,}6 \times$ custo.`],
      distractors: md`Arrecadação × 0,6 ou arrecadação − 60% (lucro sobre a venda).`,
    },
    {
      title: 'Julgar afirmações gerais',
      questions: ['2024 q75'],
      asks: md`Três afirmações sobre porcentagem com $x$ e $y$; pede quais são sempre verdadeiras.`,
      solve: [md`Teste cada uma com números simples ($x = 10$, $y = 50$).`, md`Uma única falha basta para derrubar "sempre".`],
      distractors: md`Combinações que incluem a afirmação do desconto seguido de acréscimo, que parece verdadeira e não é.`,
    },
  ],

  'mat_trigonometria::Trigonometria no Triângulo Retângulo': [
    {
      title: 'Razão dada, lados e área',
      questions: ['2026 q77', '2023 q74'],
      asks: md`Cosseno ou tangente dado (às vezes como dízima); pede área de retângulo ou razão entre áreas de círculos.`,
      solve: [md`Dízima vira fração; razão trigonométrica vira dois lados proporcionais.`, md`Ache o terceiro lado por Pitágoras.`, md`Razão entre áreas de círculos = razão dos raios **ao quadrado**.`],
      distractors: md`A razão dos raios sem elevar ao quadrado e áreas com o lado errado.`,
    },
    {
      title: 'Altura que divide o triângulo',
      questions: ['2024 q76'],
      asks: md`Triângulo com altura que forma 30° e 45°; pede a área.`,
      solve: [md`Resolva o triângulo de 45° primeiro (altura = cateto conhecido).`, md`No de 30°, use a tangente para o outro pedaço da base.`, md`Área = base total × altura / 2.`],
      distractors: md`Múltiplos da resposta (×2, ÷2) de quem esquece de dividir por 2 ou soma errado.`,
    },
    {
      title: 'Problema de observação',
      questions: ['2022 q62'],
      asks: md`Avião a altitude constante visto sob um ângulo; pede a velocidade.`,
      solve: [md`Desenhe o triângulo: altitude é o cateto adjacente ao ângulo com a vertical.`, md`Deslocamento $= h \tan\alpha$; velocidade = deslocamento / tempo, convertendo para km/h.`],
      distractors: md`Raízes trocadas ($\sqrt2$ em vez de $\sqrt3$) e fatores errados de conversão.`,
    },
  ],

  'mat_dados_probabilidade::Estatística Descritiva': [
    {
      title: 'Média e mediana combinadas',
      questions: ['2022 q72', '2024 q79'],
      asks: md`Notas em função de uma incógnita, ou gráfico de receitas e despesas; pede mediana ou a média entre lucro médio e mediana.`,
      solve: [md`Monte a equação da média para achar a incógnita.`, md`Calcule a grandeza derivada (lucro) ano a ano.`, md`Ordene antes da mediana.`],
      distractors: md`A média no lugar da mediana e médias com um ano a menos.`,
    },
    {
      title: 'Contagem num gráfico',
      questions: ['2023 q73'],
      asks: md`Barras anuais de desmatamento; pede a porcentagem de anos numa faixa.`,
      solve: [md`Conte só os anos do período pedido.`, md`"Maior que" e "menor que" excluem os limites.`],
      distractors: md`Porcentagens de quem conta o gráfico inteiro ou inclui os limites.`,
    },
    {
      title: 'Ângulo de setor',
      questions: ['2026 q80'],
      asks: md`Porcentagem de uma parte **dentro de outra** (12,5% dos que moram na zona urbana); pede o ângulo do setor.`,
      solve: [md`Fração do total = fração da zona urbana × fração dentro dela.`, md`Ângulo = fração × 360°.`],
      distractors: md`12,5% de 360° direto, sem multiplicar pela fração urbana.`,
    },
  ],

  'mat_funcoes::Função Quadrática': [
    {
      title: 'Máximo pelo vértice',
      questions: ['2025 q80'],
      asks: md`Lucro em função do número de empregados; pede o lucro máximo.`,
      solve: [md`$x_v = -b/2a$; o pedido é $L(x_v)$.`],
      distractors: md`O dobro do máximo e o valor de $x_v$ multiplicado por algo.`,
    },
    {
      title: 'Coeficientes por raízes ou pontos',
      questions: ['2023 q76', '2022 q78'],
      asks: md`Raízes dadas; ou três pontos de uma tabela. Pede uma expressão com os coeficientes.`,
      solve: [md`Raízes: $f(x) = (x - r_1)(x - r_2)$ e expanda.`, md`Três pontos: monte o sistema e subtraia equações para eliminar $c$.`],
      distractors: md`Sinais trocados na expansão e expoentes negativos interpretados errado.`,
    },
    {
      title: 'Condição sobre as raízes',
      questions: ['2024 q80'],
      asks: md`Valores de $c$ para duas raízes reais distintas e não negativas.`,
      solve: [md`$\Delta > 0$, soma $\geq 0$, produto $\geq 0$; faça a interseção.`],
      distractors: md`Intervalos que esquecem uma das condições ou trocam $<$ por $\leq$.`,
    },
  ],

  'mat_geometria_espacial::Cubos e Paralelepípedos': [
    {
      title: 'Volume pela área total',
      questions: ['2026 q79'],
      asks: md`Base quadrada e área total dadas; pede o volume.`,
      solve: [md`$A_T = 2\ell^2 + 4\ell h$; ache $h$.`, md`$V = \ell^2 h$.`],
      distractors: md`Volumes vizinhos de quem erra a contagem das faces.`,
    },
    {
      title: 'Cortes: área nova e volume',
      questions: ['2024 q77', '2022 q76'],
      asks: md`Um prisma cortado em escada, ou cubos cortados por um plano vertical; pede a área acrescentada ou o volume de uma parte.`,
      solve: [md`Área acrescentada = 2 × área da superfície de corte (cada pedaço ganha uma).`, md`Volume: conte os cubos inteiros de cada lado; onde o plano passa na diagonal de um bloco de **dois cubos vizinhos**, esse bloco vira dois prismas triangulares iguais, cada um com o volume de **um cubo** (o plano não divide cada cubo ao meio).`],
      distractors: md`A área do corte contada uma vez só e volumes de quem atribui o bloco cortado inteiro a um dos lados.`,
    },
  ],

  'mat_geometria_analitica::Posições Relativas entre Duas Retas': [
    {
      title: 'Reta perpendicular',
      questions: ['2022 q80', '2024 q78'],
      asks: md`Uma reta dada por dois pontos; pede a perpendicular por um ponto, ou onde ela corta o eixo $x$.`,
      solve: [md`$m$ da reta dada; $m_\perp = -1/m$.`, md`$y - y_0 = m_\perp(x - x_0)$; para o eixo $x$, faça $y = 0$.`],
      distractors: md`O próprio $m$ (paralela), $-m$, e cortes no eixo com sinal trocado.`,
    },
    {
      title: 'Interseção e distância',
      questions: ['2023 q78'],
      asks: md`Equações gerais de duas retas e um ponto; pede o comprimento de um lado.`,
      solve: [md`Resolva o sistema para achar o vértice.`, md`Distância entre os pontos por Pitágoras.`],
      distractors: md`Raízes de números vizinhos ($\sqrt{58}$ a $\sqrt{63}$) de pequenos erros de conta.`,
    },
  ],

  // ───────────────────────── Português ─────────────────────────
  'por_texto::Os Dois Níveis da Leitura': [
    {
      title: '"Segundo o autor" / "de acordo com o cronista"',
      questions: ['2022 q8', '2025 q7'],
      asks: md`Pede a tese do texto inteiro, muitas vezes de texto histórico ou crônica do século XIX.`,
      solve: [md`Resuma o texto numa frase antes de ler as alternativas.`, md`A certa repete essa frase com outras palavras.`],
      distractors: md`Alternativas com parte verdadeira e parte inventada ("beneficiou ambos os grupos"), generalizações ("nada escapa ao tempo") e ideias opostas ao texto.`,
    },
    {
      title: 'Sentimento ou incômodo de uma personagem',
      questions: ['2023 q7', '2026 q7'],
      asks: md`Trecho de crônica ou ensaio; pede o sentimento que a fala revela.`,
      solve: [md`Releia a fala e o que a cerca: o narrador costuma nomear ou insinuar a reação.`, md`Escolha o sentimento com apoio literal ("pesa no espírito de todos, com seu mistério" → o desconhecido).`],
      distractors: md`Sentimentos plausíveis no tema, mas sem apoio (desemprego, pobreza, mágoa).`,
    },
    {
      title: 'Ideal estético do eu lírico',
      questions: ['2026 q3'],
      asks: md`Soneto em que o eu lírico fala dos próprios versos; pede o critério do verso ideal.`,
      solve: [md`Procure o que o eu lírico lamenta e o que deseja: os versos atuais "iludem" e "mentem"; o ideal "dissesse isto que sinto".`, md`O critério é o oposto do defeito apontado.`],
      distractors: md`Valores estéticos reais (beleza, originalidade, erudição) que não respondem ao defeito do poema.`,
    },
  ],

  'por_texto::Figuras de Linguagem': [
    {
      title: 'Achar a figura nomeada',
      questions: ['2022 q3', '2026 q6', '2026 q8'],
      asks: md`A banca nomeia a figura (às vezes com a definição) e pede o trecho em que ela ocorre.`,
      solve: [md`Teste o critério da figura em cada trecho: sinestesia exige dois sentidos; antítese, dois polos opostos; personificação, ação humana em ser não humano.`],
      distractors: md`Trechos com outras figuras (metáfora, hipérbole) e trechos com só um dos sentidos.`,
    },
    {
      title: 'Figura descrita pelo efeito',
      questions: ['2025 q8'],
      asks: md`"Incompatibilidade semântica entre os termos": pede a expressão.`,
      solve: [md`Traduza: é o paradoxo ou oxímoro.`, md`Ache dois termos que se contradizem ("sublime" + "ridicularia").`],
      distractors: md`Expressões com adjetivo inesperado, mas sem contradição.`,
    },
    {
      title: 'Recurso que produz o humor',
      questions: ['2023 q1'],
      asks: md`Tirinha cujo humor vem de nomes contrários.`,
      solve: [md`Identifique a oposição entre o que o personagem diz de si e o nome que dá.`],
      distractors: md`Figuras de outra família (eufemismo, sinestesia, hipérbole).`,
    },
  ],

  'por_texto::Leitura de Textos Cômicos': [
    {
      title: 'Recurso do humor',
      questions: ['2025 q6'],
      asks: md`Cartum; pede o recurso que produz o humor.`,
      solve: [md`Descubra a palavra entendida de dois jeitos ("entender de cinema" × "ir ao cinema").`],
      distractors: md`Figuras que existem no texto, mas não produzem o humor.`,
    },
    {
      title: 'O que a fala ou a imagem revela',
      questions: ['2024 q8', '2026 q1'],
      asks: md`Conto curto ou meme; pede o sentimento ou o traço do personagem.`,
      solve: [md`A fala final reinterpreta tudo: o casamento tratado como desgraça revela mágoa.`, md`No meme, a imagem diz o que a legenda omite: a mãe dando entrevista à TV = indiscreta.`],
      distractors: md`Traços genéricos (impulsiva, sensível, arrogante) sem apoio na imagem ou na fala.`,
    },
  ],

  'por_sintaxe::Orações Adverbiais': [
    {
      title: 'Trecho sublinhado: que ideia expressa',
      questions: ['2024 q6', '2025 q9', '2026 q9'],
      asks: md`Sempre o mesmo formato: um trecho sublinhado e cinco relações.`,
      solve: [md`Identifique o conectivo e teste a troca: tão… que → consequência; não obstante → concessão; como → conformidade, comparação ou causa.`, md`Releia a frase inteira com o conectivo trocado.`],
      distractors: md`As cinco alternativas são relações reais; as erradas são as que o conectivo poderia ter em **outro** contexto.`,
    },
  ],

  // ───────────────────────── História ─────────────────────────
  'his_guerra_fria_contemporaneo::Guerra Fria': [
    {
      title: '"O excerto destaca/sustenta"',
      questions: ['2023 q28', '2025 q30', '2024 q29'],
      asks: md`Excerto de historiador ou filósofo; pede o fenômeno ou a tese.`,
      solve: [md`Grife a frase-chave (aliança que derrotou o nazismo → bipolarização; ameaça "sem intenção de cumpri-la").`, md`Escolha a alternativa que traduz essa frase.`],
      distractors: md`Fatos reais do período (macarthismo, ONU, Muro de Berlim) com explicação errada.`,
    },
    {
      title: 'Consequências do fim da Segunda Guerra',
      questions: ['2026 q29'],
      asks: md`Pede o efeito internacional e brasileiro do desfecho da guerra.`,
      solve: [md`Vitória das democracias: queda de regimes autoritários e valorização da democracia, inclusive o fim do Estado Novo.`],
      distractors: md`Efeitos que aconteceram só depois (proibição do PCB em 1947) ou o contrário do que ocorreu.`,
    },
  ],

  'his_brasil_colonia::A Montagem da Colonização': [
    {
      title: 'O excerto caracteriza',
      questions: ['2022 q23', '2023 q22'],
      asks: md`Texto sobre machados de ferro e pau-brasil; ou sobre o território fragmentado das capitanias.`,
      solve: [md`Procure o "mas" do texto: ali está a tese (indígenas apropriaram a técnica; fragmentação persistiu).`],
      distractors: md`Alternativas sobre o tema geral (replantio, escravidão) que o excerto não aborda.`,
    },
    {
      title: 'Conhecimento direto sobre a colônia',
      questions: ['2023 q23', '2026 q24'],
      asks: md`Efeito das capitanias; ou base da grande lavoura no século XVII.`,
      solve: [md`Capitanias: desenvolvimento desigual entre áreas.`, md`Século XVII: engenho de açúcar com trabalho africano escravizado.`],
      distractors: md`Produtos e mão de obra de outros períodos (café, imigrantes, algodão).`,
    },
  ],

  'his_brasil_colonia::A Mineração no Brasil Colonial': [
    {
      title: 'Processo revelado pelo excerto',
      questions: ['2024 q23', '2026 q23'],
      asks: md`Migração para as minas ou o Caminho Novo e o abastecimento; pede o processo.`,
      solve: [md`Migração para as minas = deslocamento do eixo econômico para o Centro-Sul.`, md`Caminhos e mercadorias = rede de circulação ligando as Minas ao Rio e a São Paulo.`],
      distractors: md`Exageros ("fim das exportações de açúcar") e anacronismos (ferrovias, Estados Unidos).`,
    },
    {
      title: 'Atividade econômica e sociedade',
      questions: ['2025 q24'],
      asks: md`Mulheres no pequeno comércio; pede o papel dessa atividade.`,
      solve: [md`O comércio ambulante abastecia uma população espalhada pelas vilas.`],
      distractors: md`"Exclusivamente por pessoas livres" (muitas eram escravizadas) e afirmações absolutas.`,
    },
  ],

  'his_idade_media::Alta Idade Média e Feudalismo': [
    {
      title: 'O texto sustenta',
      questions: ['2022 q21', '2024 q21', '2025 q22'],
      asks: md`Le Goff sobre rituais e servos; monge do ano 1000 sobre a fome.`,
      solve: [md`Ritual de vassalagem = vínculo simbólico entre nobres.`, md`Le Goff 2024: servos raramente presos à gleba, com deslocamento entre feudos e cidades.`, md`Monge: fome como castigo divino.`],
      distractors: md`O senso comum que o texto contradiz ("servos presos à terra", "vínculo de vassalagem entre senhor e servo").`,
    },
  ],

  // ───────────────────────── Geografia ─────────────────────────
  'geo_economica_brasil::O Espaço Agrário Brasileiro': [
    {
      title: 'Leitura de mapa ou infográfico',
      questions: ['2024 q33', '2023 q37'],
      asks: md`Mapas de cana de 1990 e 2015; infográfico da FAO com benefícios de uma técnica.`,
      solve: [md`Compare os mapas: onde escureceu?`, md`Benefícios ecológicos + saberes + resiliência rural = agroecologia.`],
      distractors: md`Regiões onde não houve mudança e técnicas reais, mas de outra finalidade (terraceamento).`,
    },
    {
      title: 'Conceito a partir de notícia',
      questions: ['2025 q34'],
      asks: md`Notícia de grilagem; pede a definição.`,
      solve: [md`Grilagem = apropriação de terras com documentos falsos.`],
      distractors: md`Instrumentos legais (Lei de Terras, Estatuto da Terra, reforma agrária).`,
    },
  ],

  'geo_fisica_brasil::Geologia e Geomorfologia': [
    {
      title: 'Estrutura geológica e tempo',
      questions: ['2022 q37'],
      asks: md`Formações de instabilidade tectônica do Terciário.`,
      solve: [md`Terciário + instabilidade = dobramentos modernos.`],
      distractors: md`Estruturas antigas e estáveis (escudos, crátons, dobramentos antigos).`,
    },
    {
      title: 'Leitura de bloco-diagrama ou foto',
      questions: ['2024 q35', '2025 q36'],
      asks: md`Placa em subducção; arco de rocha em camadas.`,
      solve: [md`Depressão onde a placa mergulha = fossa oceânica.`, md`Camadas + cor alaranjada + clima seco = arenito sedimentar modelado pelo vento.`],
      distractors: md`Rochas ígneas e metamórficas e agentes errados.`,
    },
  ],

  'geo_climatologia_socioambiental::Desafios Ambientais do Século XXI': [
    {
      title: 'Tabela de saneamento',
      questions: ['2023 q33'],
      asks: md`Esgoto gerado, coletado e tratado por região.`,
      solve: [md`Compare as colunas por região.`, md`A conclusão costuma ligar os números às desigualdades socioeconômicas.`],
      distractors: md`Afirmações que a tabela contradiz.`,
    },
    {
      title: 'Causa ou tese a partir de texto',
      questions: ['2022 q38', '2024 q36'],
      asks: md`Educação ambiental; incêndios florestais.`,
      solve: [md`Educação ambiental = resposta à sociedade de consumo.`, md`Incêndios crescentes = mudanças climáticas.`],
      distractors: md`Causas que reduziriam o problema (agroflorestas, terraceamento).`,
    },
  ],
};
