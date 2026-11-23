// Teoria da Famerp por capítulo, no recorte em que a banca cobra.
//
// "Como cai" foi escrito a partir das questões reais da Famerp 2022–2026 no
// banco; os exemplos resolvidos são autorais, com números próprios, para não
// entregar a resposta das provas que a estudante usa no simulado. A chave é
// `${topicId}::${chapter}`, a mesma de boardPriorities: o teste confere que
// todo capítulo prioritário tem teoria, então importar um ano novo que faça
// surgir outro capítulo prioritário quebra o teste em vez de deixar um buraco.

import type { ChapterTheory } from './types';

export const famerpTheory: Record<string, ChapterTheory> = {
  'mat_aritmetica_proporcionalidade::Porcentagem': {
    howItFalls: 'Caiu nos 5 anos. A Famerp quase nunca pede "calcule x% de y": pede comparação relativa (A é 24% mais barato que B; quanto B é mais caro que A?), porcentagem de um total lido em tabela, lucro sobre o custo e propriedades gerais ("x% de y é igual a y% de x?").',
    concepts: [
      'Porcentagem é uma razão com denominador 100: x% = x/100. Toda porcentagem tem uma base, e a pergunta muda quando a base muda.',
      '"A é 20% menor que B" usa B como base: A = 0,8B. Já "quanto B é maior que A" usa A como base: B = A/0,8 = 1,25A, ou seja, 25% maior. Por isso as duas porcentagens não são iguais.',
      'Lucro de 60% sobre o custo: venda = 1,6 × custo. Lucro sobre a venda seria outra base.',
      'x% de y = (x·y)/100 = y% de x: a multiplicação é comutativa, então isso vale sempre.',
      'Desconto de x% seguido de acréscimo de x% não volta ao valor inicial: (1 − x/100)(1 + x/100) = 1 − (x/100)² < 1.',
    ],
    formulas: ['Aumento de i: × (1 + i)', 'Desconto de i: × (1 − i)', 'Variação percentual = (final − inicial) / inicial', 'Parte do total = parte / total × 100%'],
    example: {
      prompt: 'O preço de um livro na loja A é 20% menor que na loja B. Em relação ao preço da loja A, o preço da loja B é quantos por cento maior?',
      steps: ['Base B: A = 0,8B.', 'Isolando B: B = A / 0,8 = 1,25A.', 'Base A: B é 25% maior que A, e não 20%.'],
    },
    traps: [
      { trap: 'Responder que B é 20% maior porque A é 20% menor.', fix: 'A base mudou de B para A: refaça a razão com a nova base.' },
      { trap: 'Somar aumentos sucessivos.', fix: 'Multiplique os fatores: +10% e −10% dá 1,1 × 0,9 = 0,99.' },
    ],
  },

  'por_texto::Os Dois Níveis da Leitura': {
    howItFalls: 'Caiu em 4 anos, sempre com texto literário ou crônica (Florbela Espanca, Oliver Sacks, Machado de Assis). As perguntas são "depreende-se", "deixa transparecer o sentimento", "segundo o cronista": pedem o que está nas entrelinhas, mas apoiado no texto.',
    concepts: [
      'Nível explícito: o que o texto afirma. Nível implícito: o que ele pressupõe ou deixa subentendido.',
      'Pressuposto é marcado na própria frase e continua verdadeiro mesmo se a frase for negada: em "Ele deixou de fumar" e "Ele não deixou de fumar", pressupõe-se que ele fumava.',
      'Subentendido depende do contexto e o autor pode negá-lo: "Está calor aqui" pode sugerir "abra a janela".',
      'Sentimento ou ponto de vista de personagem se infere por escolhas de palavras, pontuação (exclamações, reticências) e pela situação descrita.',
      'A alternativa certa costuma ser uma paráfrase ou uma inferência curta. A errada generaliza, extrapola ou traz uma opinião verdadeira no mundo mas ausente do texto.',
    ],
    example: {
      prompt: 'Considere a frase: "Ainda não desisti de aprender piano." O que ela pressupõe?',
      steps: [
        '"Ainda não" indica uma situação que continua até o momento da fala.',
        '"Desistir de aprender" pressupõe que o aprendizado já começou e encontrou dificuldades.',
        'Pressupostos: a pessoa já tenta aprender piano há algum tempo, e desistir foi uma possibilidade considerada.',
      ],
    },
    traps: [
      { trap: 'Escolher a alternativa que é verdade sobre o tema, mas não está no texto.', fix: 'Volte ao trecho: se não houver passagem que sustente a alternativa, ela extrapola.' },
      { trap: 'Tomar a opinião de uma voz citada como a do autor.', fix: 'Identifique quem fala em cada trecho antes de atribuir a ideia.' },
    ],
  },

  'por_texto::Figuras de Linguagem': {
    howItFalls: 'Caiu em 4 anos. A banca pede para localizar a figura num trecho (antítese, personificação, sinestesia) ou dizer qual recurso produz o humor de uma tirinha. Em 2025 apareceu "incompatibilidade semântica entre os termos", que é a definição de paradoxo/oxímoro.',
    concepts: [
      'Antítese: aproxima palavras de sentido oposto ("nasce o sol e não dura mais que um dia").',
      'Paradoxo ou oxímoro: afirma juntas ideias que se contradizem, criando incompatibilidade semântica ("silêncio ensurdecedor").',
      'Personificação (prosopopeia): atribui ações ou sentimentos humanos a seres inanimados ou abstratos ("a cidade dormia").',
      'Sinestesia: mistura sensações de sentidos diferentes ("voz áspera": audição + tato).',
      'Metáfora: comparação sem conectivo. Metonímia: troca por relação de proximidade (autor pela obra, parte pelo todo). Ironia: diz o contrário do que pensa. Hipérbole: exagero. Eufemismo: suaviza.',
      'Nas tirinhas, o humor costuma vir de ambiguidade (palavra com dois sentidos), quebra de expectativa ou ironia.',
    ],
    example: {
      prompt: 'Classifique as figuras em: (I) "um grito amarelo cortou a tarde"; (II) "aquele riso triste".',
      steps: ['I: "grito" (audição) recebe uma cor (visão) → sinestesia.', 'II: riso (alegria) e triste (tristeza) se contradizem no mesmo ser → paradoxo/oxímoro.'],
    },
    traps: [
      { trap: 'Confundir antítese com paradoxo.', fix: 'Antítese opõe dois termos; paradoxo afirma os dois ao mesmo tempo sobre a mesma coisa.' },
      { trap: 'Chamar qualquer comparação de metáfora.', fix: 'Com "como", "tal qual" é comparação; sem conectivo é metáfora.' },
    ],
  },

  'bio_zoologia::Classificação Biológica, Nomenclatura Científica e Noções de Sistemática Filogenética': {
    howItFalls: 'Caiu em 4 anos, quase sempre a partir de hominídeos (Ardi, "homens das cavernas"), de uma tirinha ou de um cladograma. Pede a categoria taxonômica comum mais restrita, o grupo com maior semelhança genética num cladograma e o conceito biológico de espécie.',
    concepts: [
      'Hierarquia: Reino → Filo → Classe → Ordem → Família → Gênero → Espécie. Quanto mais restrita a categoria compartilhada, maior o parentesco.',
      'Nomenclatura binomial (Lineu): Gênero com inicial maiúscula + epíteto específico minúsculo, em itálico ou sublinhado (Homo sapiens). Duas espécies do mesmo gênero dividem a primeira palavra.',
      'Espécie biológica: populações que se cruzam na natureza gerando descendentes férteis. Espécies diferentes às vezes cruzam, mas os híbridos costumam ser estéreis (mula = égua × jumento).',
      'Cladograma: cada nó é um ancestral comum. Grupos que se unem no nó mais recente (mais próximo das pontas) são grupos-irmãos e têm maior semelhança genética.',
      'Humanos: ordem Primates, família Hominidae. Primatas têm, entre outras características, mãos com polegar oponível e visão binocular.',
    ],
    example: {
      prompt: 'Num cladograma, X e Y se unem num nó; esse par se une a Z; o grupo X-Y-Z se une a W. Quais táxons têm DNA mais semelhante?',
      steps: ['O nó X-Y é o mais recente: X e Y compartilham o ancestral comum mais próximo.', 'Logo X e Y têm maior semelhança de DNA; W é o mais distante dos três.'],
    },
    traps: [
      { trap: 'Achar que a categoria mais ampla (reino, filo) indica mais parentesco.', fix: 'É o contrário: quanto mais restrita a categoria em comum, mais próximo o parentesco.' },
      { trap: 'Ler a proximidade no cladograma pela posição na página.', fix: 'Leia pelos nós: vale quem divide o ancestral mais recente, não quem está desenhado ao lado.' },
    ],
  },

  'fis_estatica::Hidrostática: Densidade e Pressão': {
    howItFalls: 'Caiu em 4 anos, em situações do cotidiano: medir a densidade de uma maçã numa proveta, fruta boiando que o peixe puxa, copo cheio que transborda quando um objeto flutua, nível de água que sobe e faz a pressão no fundo aumentar.',
    concepts: [
      'Densidade d = m/V. O volume de um sólido irregular se mede pelo volume de líquido que ele desloca quando totalmente submerso.',
      'Pressão hidrostática p = d·g·h: depende só da profundidade e do líquido. Se h sobe a uma taxa constante, p sobe à taxa d·g·(Δh/Δt).',
      'Empuxo E = d_líquido · V_submerso · g: igual ao peso do líquido deslocado (Arquimedes).',
      'Corpo flutuando em equilíbrio: E = P. Por isso a massa de água derramada de um copo cheio é igual à massa do objeto que flutua.',
      'Fração submersa = d_corpo / d_líquido. Para afundar totalmente um corpo que flutua, a força extra é E_total − P.',
    ],
    formulas: ['d = m/V', 'p = p₀ + d·g·h', 'E = d_liq · V_sub · g', 'Flutuação: V_sub/V = d_corpo/d_liq'],
    example: {
      prompt: 'Uma fruta de massa 100 g flutua em água com 80% do volume submerso (g = 10 m/s²). Qual a força mínima para afundá-la totalmente?',
      steps: [
        'Em equilíbrio, E = P = 0,1 kg × 10 = 1,0 N, e esse empuxo corresponde a 80% do volume.',
        'Totalmente submersa: E_total = 1,0 / 0,8 = 1,25 N.',
        'Força extra = E_total − P = 1,25 − 1,0 = 0,25 N.',
      ],
    },
    traps: [
      { trap: 'Usar o volume total no empuxo de um corpo que flutua.', fix: 'Empuxo usa só o volume submerso.' },
      { trap: 'Esquecer a conversão: 1 g/mL = 1 g/cm³ = 10³ kg/m³.', fix: 'Passe tudo para o SI antes de multiplicar por g e h.' },
    ],
  },

  'his_guerra_fria_contemporaneo::Guerra Fria': {
    howItFalls: 'Caiu em 4 anos, sempre a partir de excerto de historiador (Hobsbawm, Aarão Reis, Lefort). Pede a origem da ruptura entre os aliados, o papel das armas nucleares, os efeitos do fim da Segunda Guerra no Brasil e movimentos como maio de 1968.',
    concepts: [
      'Origem: a aliança que derrotou o nazismo (EUA, URSS, Reino Unido) se desfez logo após 1945, na disputa pela Europa do pós-guerra.',
      'Bipolaridade: EUA (capitalismo liberal) × URSS (socialismo de partido único). Doutrina Truman (contenção) e Plano Marshall (reconstrução); OTAN × Pacto de Varsóvia.',
      'Dissuasão nuclear: as armas existiam mais para ameaçar que para serem usadas; a destruição mútua assegurada tornava a guerra direta improvável. Os conflitos foram indiretos (Coreia, Vietnã, Cuba).',
      'No Brasil, a vitória aliada em 1945 expôs a contradição de lutar contra o fascismo sob uma ditadura e acelerou a queda do Estado Novo; o país se alinhou aos EUA.',
      'Maio de 1968: revolta estudantil e operária na França, crítica tanto ao capitalismo quanto ao socialismo soviético; contracultura.',
      'Fim: perestroika e glasnost, queda do Muro de Berlim (1989), fim da URSS (1991).',
    ],
    example: {
      prompt: 'Raymond Aron resumiu a Guerra Fria como "paz impossível, guerra improvável". O que a frase explica?',
      steps: ['"Paz impossível": a rivalidade ideológica e geopolítica entre os blocos não tinha acordo.', '"Guerra improvável": o arsenal nuclear de ambos tornava o confronto direto suicida.', 'Conclusão: a disputa se deu por corrida armamentista, propaganda e conflitos periféricos.'],
    },
    traps: [
      { trap: 'Afirmar que EUA e URSS se enfrentaram militarmente de forma direta.', fix: 'O confronto foi indireto, em guerras periféricas.' },
      { trap: 'Ler o excerto pelo que você sabe, e não pelo que ele sustenta.', fix: 'A pergunta é "o excerto sustenta que": responda pela tese do autor.' },
    ],
  },

  'mat_trigonometria::Trigonometria no Triângulo Retângulo': {
    howItFalls: 'Caiu em 4 anos, embutida em geometria: diagonal de retângulo com cosseno dado, altura que divide um triângulo em ângulos de 30° e 45°, tangente dada como dízima, avião observado a altitude constante.',
    concepts: [
      'No triângulo retângulo: sen α = oposto/hipotenusa; cos α = adjacente/hipotenusa; tg α = oposto/adjacente.',
      'Tabela: sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2; cos é a ordem inversa; tg 30° = √3/3, tg 45° = 1, tg 60° = √3.',
      'Com um ângulo e um lado, os outros dois lados saem da razão certa. Com sen ou cos dado, use sen² + cos² = 1 para o outro.',
      'Altura que divide um triângulo em dois triângulos retângulos: resolva cada um separadamente e some as bases.',
      'Dízima periódica vira fração antes de usar: 0,5333… = 8/15.',
    ],
    formulas: ['sen² α + cos² α = 1', 'tg α = sen α / cos α', 'Área = base × altura / 2'],
    example: {
      prompt: 'A diagonal de um retângulo mede 10 cm e forma com um dos lados um ângulo α tal que cos α = 3/5. Qual a área do retângulo?',
      steps: ['Lado adjacente a α: 10 × 3/5 = 6 cm.', 'sen α = 4/5 (pois 9/25 + 16/25 = 1); lado oposto: 10 × 4/5 = 8 cm.', 'Área = 6 × 8 = 48 cm².'],
    },
    traps: [
      { trap: 'Trocar oposto e adjacente.', fix: 'Marque o ângulo na figura: adjacente é o cateto que encosta nele.' },
      { trap: 'Usar trigonometria do triângulo retângulo em triângulo qualquer.', fix: 'Trace uma altura para criar triângulos retângulos.' },
    ],
  },

  'mat_dados_probabilidade::Estatística Descritiva': {
    howItFalls: 'Caiu em 4 anos, sempre com gráfico ou tabela real (desmatamento, receitas de empresa, população por moradia): média, mediana, porcentagem de valores numa faixa e ângulo de setor circular.',
    concepts: [
      'Média aritmética = soma / quantidade. Média ponderada = Σ(valor × peso) / Σ pesos.',
      'Mediana: ordene os dados; é o valor central (n ímpar) ou a média dos dois centrais (n par). Resiste a valores extremos.',
      'Moda: valor mais frequente.',
      'Setor circular: ângulo = fração do total × 360°.',
      'Porcentagem de ocorrências numa faixa = quantidade na faixa / total × 100%. Atenção a "maior que" e "menor que", que excluem os extremos.',
    ],
    formulas: ['x̄ = Σx / n', 'Ângulo = (parte / total) × 360°'],
    example: {
      prompt: 'Nas três provas de um curso, um aluno tirou x, 2x e 3x. Se a média foi 4, qual a mediana?',
      steps: ['Média: (x + 2x + 3x)/3 = 2x = 4 → x = 2.', 'Notas: 2, 4 e 6, já em ordem.', 'Mediana = 4.'],
    },
    traps: [
      { trap: 'Calcular a mediana sem ordenar.', fix: 'Ordene sempre antes de pegar o valor central.' },
      { trap: 'Fazer a média de médias de grupos de tamanhos diferentes.', fix: 'Pondere pelo tamanho de cada grupo.' },
    ],
  },

  'mat_funcoes::Função Quadrática': {
    howItFalls: 'Caiu em 4 anos: lucro máximo pelo vértice, coeficientes a partir das raízes, condição para raízes reais distintas e não negativas, e montagem de y = ax² + bx + c a partir de três pontos de uma tabela.',
    concepts: [
      'f(x) = ax² + bx + c. Se a < 0, a parábola tem concavidade para baixo e o vértice é o máximo (lucro, altura máxima).',
      'Vértice: xᵥ = −b/2a; yᵥ = f(xᵥ) = −Δ/4a.',
      'Raízes: Δ = b² − 4ac; Δ > 0 dá duas raízes reais distintas. Soma = −b/a; produto = c/a.',
      'Raízes conhecidas r₁ e r₂: f(x) = a(x − r₁)(x − r₂).',
      'Duas raízes distintas e não negativas: Δ > 0, soma ≥ 0 e produto ≥ 0.',
      'Três pontos dados: substitua cada um em y = ax² + bx + c e resolva o sistema.',
    ],
    formulas: ['xᵥ = −b/2a', 'yᵥ = −Δ/4a', 'S = −b/a; P = c/a'],
    example: {
      prompt: 'O lucro de uma loja é L(x) = −x² + 600x, com x unidades vendidas. Qual o lucro máximo?',
      steps: ['a = −1 < 0: há máximo no vértice.', 'xᵥ = −600 / (2·(−1)) = 300.', 'L(300) = −90 000 + 180 000 = 90 000.'],
    },
    traps: [
      { trap: 'Responder xᵥ quando a pergunta pede o lucro máximo.', fix: 'xᵥ é a quantidade; o lucro é yᵥ.' },
      { trap: 'Esquecer que "não negativas" admite zero.', fix: 'Use produto ≥ 0 e soma ≥ 0, não > 0.' },
    ],
  },

  'qui_solucoes::Dispersões': {
    howItFalls: 'Caiu em 4 anos, sempre com dado do cotidiano: rótulo de bebida (gramas por 100 mL), refrigerante com sacarose, medicamento diluído em soro glicosado a 5% (m/v), defensivo agrícola dissolvido em centenas de litros.',
    concepts: [
      'Concentração comum C = massa do soluto / volume da solução (g/L ou g/mL).',
      'Concentração em quantidade de matéria (molaridade) M = n / V = m / (Massa molar × V), em mol/L.',
      'Título em massa/volume: 5% (m/v) = 5 g de soluto em 100 mL de solução.',
      'Proporção direta: se 100 mL têm 7,5 g, 250 mL têm 2,5 × 7,5 g.',
      'Diluição: a quantidade de soluto não muda. C₁V₁ = C₂V₂ e M₁V₁ = M₂V₂.',
      'Tomar parte de uma solução: a fração de volume retirada carrega a mesma fração de cada soluto.',
    ],
    formulas: ['C = m/V', 'M = m / (MM · V)', 'C₁V₁ = C₂V₂'],
    example: {
      prompt: 'Uma lata de 250 mL de bebida tem 12 g de sacarose (342 g/mol). Qual a concentração em mol/L?',
      steps: ['n = 12 / 342 ≈ 0,035 mol.', 'V = 0,250 L.', 'M = 0,035 / 0,250 ≈ 0,14 mol/L.'],
    },
    traps: [
      { trap: 'Deixar o volume em mL na molaridade.', fix: 'Molaridade é por litro: divida o volume por 1000.' },
      { trap: '"Solução mais diluída" com os números errados.', fix: 'Mais diluída = menos soluto e mais solvente: combine a menor massa com o maior volume.' },
    ],
  },

  'fis_cinematica::Movimento Uniforme': {
    howItFalls: 'Caiu de 2024 a 2026, em esporte e transporte: chute a 108 km/h, distância entre velocistas na chegada, número de ônibus numa linha, área sob a curva de um gráfico.',
    concepts: [
      'Movimento uniforme: velocidade constante, v = Δs/Δt, e s = s₀ + v·t.',
      'Conversão: km/h ÷ 3,6 = m/s.',
      'Distância entre dois corpos que terminam com a mesma velocidade: diferença de tempos × velocidade.',
      'Área sob o gráfico v × t é o deslocamento; área sob o gráfico a × t é a variação de velocidade. Verifique as grandezas dos eixos.',
      'Frota de uma linha circular: tempo de uma volta completa / intervalo entre saídas, arredondado para cima.',
    ],
    formulas: ['v = Δs/Δt', 's = s₀ + v·t', '1 m/s = 3,6 km/h'],
    example: {
      prompt: 'Uma bola sai do pé do jogador a 90 km/h e chega ao gol em 0,5 s, em velocidade constante. Qual a distância?',
      steps: ['90 km/h ÷ 3,6 = 25 m/s.', 'Δs = 25 × 0,5 = 12,5 m.'],
    },
    traps: [
      { trap: 'Multiplicar km/h por segundos.', fix: 'Converta para m/s antes.' },
      { trap: 'Arredondar o número de ônibus para baixo.', fix: 'Frota é sempre arredondada para cima: um ônibus a menos quebra o intervalo.' },
    ],
  },

  'his_brasil_colonia::A Montagem da Colonização': {
    howItFalls: 'Caiu em 3 anos, a partir de excertos (Laura de Mello e Souza, Schwartz, Vainfas): capitanias hereditárias, grande lavoura de produtos tropicais e relações com os povos indígenas.',
    concepts: [
      'Capitanias hereditárias (década de 1530): a Coroa delegou a colonização a donatários, que arcavam com os custos em troca de direitos; transferiu o investimento e o risco para particulares.',
      'Governo-Geral (1549, Tomé de Sousa) centralizou a administração sem extinguir as capitanias.',
      'Plantation açucareira: latifúndio, monocultura, mão de obra escravizada e produção para exportação, inserida no pacto colonial e no tráfico atlântico.',
      'Povos indígenas não foram só vítimas passivas: houve escravização e guerra, mas também alianças, trocas e apropriação de ferramentas europeias (machados, facas) para fins próprios.',
      'Ocupação concentrada no litoral até o século XVIII, com o sertão como fronteira de expansão.',
    ],
    example: {
      prompt: 'Por que as capitanias hereditárias interessavam à Coroa portuguesa em 1530?',
      steps: ['Portugal tinha poucos recursos para ocupar um território enorme e estava voltado ao comércio com o Oriente.', 'Delegar a donatários transferia custos e riscos a particulares, garantindo a posse contra outras potências.'],
    },
    traps: [
      { trap: 'Tratar os indígenas apenas como vítimas passivas.', fix: 'A historiografia atual destaca agência indígena: alianças, resistência e apropriação.' },
      { trap: 'Dizer que o Governo-Geral acabou com as capitanias.', fix: 'Ele as coordenou; as capitanias continuaram existindo.' },
    ],
  },

  'bio_evolucao::Mecanismos da Evolução Biológica': {
    howItFalls: 'Caiu em 3 anos: resistência de Plasmodium a medicamentos, frase associada à seleção natural de Darwin e Wallace, e distribuição de espécies de camelídeos em continentes diferentes.',
    concepts: [
      'Seleção natural: dentro da população há variação herdável preexistente; os indivíduos com características mais vantajosas naquele ambiente sobrevivem e se reproduzem mais, e a frequência dessas características aumenta.',
      'Resistência a medicamentos: o remédio não cria a mutação; ele elimina os sensíveis e seleciona os resistentes que já existiam.',
      'Teoria sintética: mutação e recombinação geram variação; seleção, deriva genética e migração mudam frequências.',
      'Especiação alopátrica: uma barreira geográfica separa populações; sem fluxo gênico, elas acumulam diferenças até o isolamento reprodutivo.',
      'Lamarck (uso e desuso, herança de características adquiridas) foi superado: o que se adquire em vida não passa aos filhos.',
    ],
    example: {
      prompt: 'Após anos de uso de um antibiótico num hospital, surgem bactérias resistentes. Explique pela teoria moderna.',
      steps: ['Mutações aleatórias já produziam algumas bactérias resistentes.', 'O antibiótico matou as sensíveis; as resistentes sobreviveram e se multiplicaram.', 'A frequência do gene de resistência aumentou na população: seleção, não adaptação dirigida.'],
    },
    traps: [
      { trap: '"O antibiótico induziu as bactérias a se adaptarem."', fix: 'O ambiente seleciona variação que já existia; não a cria.' },
      { trap: '"O indivíduo evolui."', fix: 'Quem evolui é a população, ao mudar a frequência dos alelos.' },
    ],
  },

  'fis_calorimetria::Calor Sensível e Calor Latente': {
    howItFalls: 'Caiu em 3 anos: equilíbrio térmico de bebida com sachê, ebulidor em cidade de altitude onde a água ferve abaixo de 100 °C, e gelo resfriando garrafas.',
    concepts: [
      'Calor sensível muda a temperatura: Q = m·c·ΔT. Capacidade térmica C = m·c, então Q = C·ΔT.',
      'Calor latente muda o estado sem mudar a temperatura: Q = m·L.',
      'Sistema isolado: a soma dos calores trocados é zero (ΣQ = 0). Quem esfria cede; quem esquenta recebe.',
      'Com potência constante, o tempo é proporcional ao calor necessário: t = Q/P. Em altitude a água ferve a menos de 100 °C, então o ΔT até a ebulição é menor e o tempo também.',
      'Com gelo, verifique primeiro se o calor disponível derrete todo o gelo.',
    ],
    formulas: ['Q = m·c·ΔT', 'Q = m·L', 'ΣQ = 0', 'P = Q/Δt'],
    example: {
      prompt: '200 g de água a 30 °C recebem 50 g de gelo a 0 °C (L = 80 cal/g; c = 1 cal/g·°C). Qual a temperatura final?',
      steps: ['Para derreter todo o gelo: 50 × 80 = 4000 cal. A água a 30 °C pode ceder até 200 × 30 = 6000 cal até 0 °C: o gelo derrete todo.', 'Balanço: 200·(30 − T) = 4000 + 50·(T − 0).', '6000 − 200T = 4000 + 50T → T = 8 °C.'],
    },
    traps: [
      { trap: 'Esquecer o calor latente na fusão do gelo.', fix: 'A mudança de estado consome m·L antes de a temperatura subir.' },
      { trap: 'Supor que toda água ferve a 100 °C.', fix: 'A temperatura de ebulição cai com a pressão atmosférica (altitude).' },
    ],
  },

  'fis_fisica_moderna::Noções Básicas de Física Quântica': {
    howItFalls: 'Caiu em 3 anos: efeito fotoelétrico (quais cores arrancam elétrons de um metal; energia cinética ao trocar de metal) e transição eletrônica no modelo de Bohr.',
    concepts: [
      'A luz é formada por fótons de energia E = h·f; quanto maior a frequência, maior a energia (violeta > azul > verde > vermelho).',
      'Efeito fotoelétrico: só há emissão se h·f ≥ W (função trabalho do metal). A energia cinética máxima do elétron é Ec = h·f − W.',
      'A intensidade da luz muda a quantidade de elétrons arrancados, não a energia de cada um.',
      'Trocar de metal com a mesma luz: a energia do fóton é a mesma; Ec muda pela diferença das funções trabalho.',
      'Modelo de Bohr: o elétron ocupa níveis de energia Eₙ = −13,6/n² eV (hidrogênio). Subir de nível absorve ΔE; descer emite um fóton de energia ΔE.',
    ],
    formulas: ['E = h·f', 'Ec = h·f − W', 'f₀ = W/h', 'ΔE = E_final − E_inicial'],
    example: {
      prompt: 'Um metal tem W = 2,9 eV (h = 4,1 × 10⁻¹⁵ eV·s). Entre vermelho (4,5), verde (5,5) e violeta (7,5) × 10¹⁴ Hz, quais luzes arrancam elétrons?',
      steps: ['Frequência de corte: f₀ = 2,9 / 4,1 × 10⁻¹⁵ ≈ 7,1 × 10¹⁴ Hz.', 'Só a violeta (7,5 × 10¹⁴ Hz) supera f₀.', 'Vermelho e verde não emitem elétrons, por mais intensos que sejam.'],
    },
    traps: [
      { trap: 'Achar que luz mais forte arranca elétrons mais rápidos.', fix: 'Intensidade aumenta o número de elétrons; a energia de cada um depende da frequência.' },
      { trap: 'Errar o sinal na transição de Bohr.', fix: 'Subir de nível (n maior) absorve energia; descer emite.' },
    ],
  },

  'geo_economica_brasil::O Espaço Agrário Brasileiro': {
    howItFalls: 'Caiu em 3 anos: grilagem de terras, expansão da cana-de-açúcar (mapa 1990 × 2015) e técnicas agrícolas sustentáveis apresentadas por imagem.',
    concepts: [
      'Grilagem: apropriação ilegal de terras públicas ou alheias com documentos falsos, muitas vezes "envelhecidos"; ligada ao desmatamento e a conflitos no campo.',
      'Concentração fundiária: poucos estabelecimentos concentram a maior parte da área; herança das sesmarias e da Lei de Terras (1850).',
      'Cana-de-açúcar: expansão a partir do interior paulista para MG, GO e MS, impulsionada pelo etanol e pelos carros flex, com mecanização da colheita.',
      'Agronegócio exportador (soja, milho, carne, cana) avança pelo Cerrado e pela borda da Amazônia; a agricultura familiar responde por boa parte dos alimentos do mercado interno.',
      'Técnicas sustentáveis: integração lavoura-pecuária-floresta (ILPF), plantio direto, rotação de culturas, sistemas agroflorestais.',
    ],
    example: {
      prompt: 'Um mapa mostra municípios produtores de cana concentrados em SP em 1990 e espalhados por MG, GO e MS em 2015. Que processo isso indica?',
      steps: ['Expansão da fronteira canavieira a partir do núcleo paulista.', 'Explicação: demanda por etanol, terras mais baratas e mecanização.'],
    },
    traps: [
      { trap: 'Confundir grilagem com reforma agrária.', fix: 'Grilagem é apropriação ilegal com documentos falsos; reforma agrária é redistribuição legal.' },
      { trap: 'Afirmar que o agronegócio produz a maior parte do alimento consumido no país.', fix: 'Ele domina as exportações; a agricultura familiar pesa no abastecimento interno.' },
    ],
  },

  'geo_fisica_brasil::Geologia e Geomorfologia': {
    howItFalls: 'Caiu em 3 anos: formação de relevo por imagem (Pedra Furada no Piauí), zona de subducção e dobramentos modernos do período Terciário.',
    concepts: [
      'Bacias sedimentares: rochas formadas por acúmulo de sedimentos (arenitos), com camadas visíveis; esculpidas por erosão do vento e da água ao longo de milhões de anos.',
      'Escudos cristalinos: rochas antigas, magmáticas e metamórficas, ricas em minerais metálicos.',
      'Subducção: a placa oceânica, mais densa, mergulha sob a continental; forma fossas oceânicas, vulcanismo e terremotos.',
      'Dobramentos modernos (Terciário, era Cenozoica): Andes, Alpes, Himalaia, Rochosas. São regiões instáveis, com terremotos e vulcões. O Brasil não tem dobramentos modernos.',
      'O Brasil fica no interior da placa Sul-Americana: relevo antigo e desgastado, sem grandes altitudes.',
    ],
    example: {
      prompt: 'Uma formação de arenito em camadas, com um arco aberto pela erosão, está no sertão do Nordeste. Qual a origem?',
      steps: ['Camadas indicam rocha sedimentar depositada ao longo do tempo.', 'O arco resulta da erosão diferencial: partes menos resistentes foram removidas pelo intemperismo.'],
    },
    traps: [
      { trap: 'Atribuir relevo brasileiro a dobramentos modernos.', fix: 'O Brasil tem relevo antigo, sem dobramentos do Terciário.' },
      { trap: 'Confundir fossa oceânica com dorsal.', fix: 'Fossa = placas convergentes (subducção); dorsal = placas divergentes.' },
    ],
  },

  'geo_climatologia_socioambiental::Desafios Ambientais do Século XXI': {
    howItFalls: 'Caiu de 2022 a 2024: perda de cobertura florestal por incêndios, tabela de esgoto coletado × tratado por região, e educação ambiental como resposta ao consumismo.',
    concepts: [
      'Incêndios florestais crescem com secas mais longas e temperaturas maiores (mudança climática) e com o uso do fogo para desmatar; liberam CO₂ e realimentam o aquecimento.',
      'Saneamento: coletar esgoto não é tratar. A diferença entre volume coletado e tratado vai sem tratamento para os rios; Norte e Nordeste têm os menores índices.',
      'Educação ambiental crítica questiona o modelo de acumulação e consumo, não só ensina a separar lixo.',
      'Acordos: Rio-92, Protocolo de Kyoto (1997), Acordo de Paris (2015, metas voluntárias nacionais), COP30 em Belém (2025).',
    ],
    example: {
      prompt: 'Uma tabela mostra, para uma região, 1,8 milhão m³/dia de esgoto coletado e 1,6 milhão tratado. O que se conclui?',
      steps: ['Cerca de 0,2 milhão m³/dia é coletado mas não tratado.', 'Esse esgoto chega aos corpos d\'água: coleta sem tratamento não resolve a poluição.'],
    },
    traps: [
      { trap: 'Tratar "coletado" e "tratado" como a mesma coisa.', fix: 'Leia o rótulo de cada coluna da tabela antes de comparar.' },
      { trap: 'Atribuir os incêndios só a causas naturais.', fix: 'A maior parte tem origem humana; o clima agrava a propagação.' },
    ],
  },

  'his_brasil_colonia::A Mineração no Brasil Colonial': {
    howItFalls: 'Caiu de 2024 a 2026, por excertos sobre a sociedade mineira: ostentação e roupas de luxo, participação feminina no comércio e a descoberta do ouro na passagem dos séculos XVII para XVIII.',
    concepts: [
      'Descoberta do ouro pelos bandeirantes paulistas no fim do século XVII, em Minas Gerais, depois em Goiás e Mato Grosso.',
      'Sociedade mais urbana e diversificada que a açucareira: comerciantes, artesãos, funcionários, militares, homens livres pobres e escravizados.',
      'Ostentação e barroco mineiro: riqueza aparente nas roupas e nas igrejas; também pobreza e fome nos primeiros anos.',
      'Mulheres, sobretudo negras e forras, tiveram papel no comércio ambulante (negras de tabuleiro) e nas vendas.',
      'Fiscalização dura da Coroa: quinto, casas de fundição, derrama; capital transferida para o Rio de Janeiro em 1763.',
    ],
    example: {
      prompt: 'Um excerto descreve, em Vila Rica do século XVIII, homens com casacos de seda e fios de ouro. O que isso mostra?',
      steps: ['A riqueza do ouro gerou camadas urbanas que exibiam status pelo consumo de luxo.', 'É a constituição de uma sociedade urbana e hierarquizada, diferente da rural do açúcar.'],
    },
    traps: [
      { trap: 'Descrever a sociedade mineira como só de senhores e escravizados.', fix: 'Ela teve camadas médias urbanas e grande diversidade.' },
      { trap: 'Datar a mineração no século XVI.', fix: 'O ouro foi achado no fim do XVII; o auge foi o XVIII.' },
    ],
  },

  'his_idade_media::Alta Idade Média e Feudalismo': {
    howItFalls: 'Caiu em 3 anos com textos de Le Goff, Duby e um monge medieval: ritual de vassalagem, obrigações dos servos e a explicação religiosa para a fome.',
    concepts: [
      'Vassalagem: relação entre nobres. O vassalo presta homenagem e jura fidelidade ao suserano, que lhe concede um feudo (investidura). O ritual tem gestos e objetos simbólicos.',
      'Servidão: relação entre senhor e camponês. O servo é preso à terra e deve corveia (trabalho nas terras do senhor), talha (parte da produção) e banalidades (uso do moinho, do forno).',
      'Obrigações pesadas levavam servos a fugir para outras terras ou, mais tarde, para as cidades.',
      'Mentalidade: a Igreja dava sentido ao mundo; fome, peste e guerras eram lidas como castigo divino pelos pecados.',
      'Economia agrária e de pouca circulação de moeda, sem desaparecer totalmente o comércio.',
    ],
    example: {
      prompt: 'Um cronista do ano 1000 explica uma grande fome como punição ao orgulho humano. O que o texto revela?',
      steps: ['A interpretação religiosa dos acontecimentos naturais, típica da mentalidade medieval.', 'O cronista é um monge: a visão vem de quem detinha a escrita e a interpretação do mundo.'],
    },
    traps: [
      { trap: 'Confundir vassalagem com servidão.', fix: 'Vassalagem liga nobres entre si; servidão liga senhor e camponês.' },
      { trap: 'Dizer que não havia nenhum comércio.', fix: 'Ele se retraiu, mas não desapareceu.' },
    ],
  },

  'mat_geometria_espacial::Cubos e Paralelepípedos': {
    howItFalls: 'Caiu em 3 anos: volume a partir da área total, aumento de área ao cortar um prisma em dois e sólidos formados por um plano que corta cubos.',
    concepts: [
      'Paralelepípedo retângulo de arestas a, b, c: volume V = abc; área total = 2(ab + ac + bc); diagonal d = √(a² + b² + c²).',
      'Cubo de aresta a: V = a³; área total = 6a²; diagonal = a√3.',
      'Ao cortar um sólido em dois, o volume total se conserva e a área total aumenta exatamente pelas faces novas criadas pelo corte (cada corte cria duas faces).',
      'Plano que corta um cubo pela diagonal de uma face o divide em dois prismas triangulares de mesmo volume.',
    ],
    formulas: ['V = abc', 'A = 2(ab + ac + bc)', 'd = √(a² + b² + c²)'],
    example: {
      prompt: 'Um paralelepípedo de base quadrada com lado 3 cm tem área total 90 cm². Qual o volume?',
      steps: ['Área = 2 · 3² + 4 · 3 · h = 18 + 12h = 90.', 'h = 6 cm.', 'V = 3 · 3 · 6 = 54 cm³.'],
    },
    traps: [
      { trap: 'Achar que cortar um sólido muda o volume total.', fix: 'Volume se conserva; só a área aumenta.' },
      { trap: 'Contar uma face só por corte.', fix: 'Cada corte cria duas faces, uma em cada pedaço.' },
    ],
  },

  'mat_geometria_analitica::Posições Relativas entre Duas Retas': {
    howItFalls: 'Caiu de 2022 a 2024 com ruas e triângulos no plano cartesiano: reta perpendicular a outra num ponto, interseção de retas e comprimento de lado.',
    concepts: [
      'Coeficiente angular m = Δy/Δx. Reta que passa por (0, b) e (a, 0): m = −b/a.',
      'Paralelas: mesmo m. Perpendiculares: m₁ · m₂ = −1.',
      'Equação pela reta que passa por (x₀, y₀) com coeficiente m: y − y₀ = m(x − x₀).',
      'Ponto de interseção: resolva o sistema das duas equações. Corte no eixo x: faça y = 0.',
      'Distância entre pontos: d = √(Δx² + Δy²).',
    ],
    formulas: ['m = Δy/Δx', 'm₁·m₂ = −1', 'y − y₀ = m(x − x₀)', 'd = √(Δx² + Δy²)'],
    example: {
      prompt: 'A reta s passa por (0, 6) e (3, 0). Qual a equação da reta r, perpendicular a s, que passa pela origem?',
      steps: ['m_s = (0 − 6)/(3 − 0) = −2.', 'm_r = −1/(−2) = 1/2.', 'Pela origem: y = x/2.'],
    },
    traps: [
      { trap: 'Usar m₂ = −m₁ para perpendiculares.', fix: 'É o inverso com sinal trocado: m₂ = −1/m₁.' },
      { trap: 'Trocar Δx e Δy no coeficiente angular.', fix: 'm = variação de y sobre variação de x.' },
    ],
  },

  'por_texto::Leitura de Textos Cômicos': {
    howItFalls: 'Caiu de 2024 a 2026 com meme, cartum e conto de humor (Millôr): pede o recurso que produz o humor e o sentimento ou traço revelado pelo personagem.',
    concepts: [
      'O humor nasce da quebra de expectativa: o texto constrói uma lógica e a última fala a desmonta.',
      'Recursos frequentes: ambiguidade (palavra ou frase com dois sentidos), ironia, exagero, inversão de papéis, nonsense.',
      'Em meme e tirinha, imagem e texto se completam: o sentido está na relação entre os dois.',
      'Pergunta sobre sentimento: leia a fala final pelo que ela revela (ressentimento, ingenuidade, vaidade).',
    ],
    example: {
      prompt: 'Num cartum, alguém diz "Vou escrever um livro sobre culinária." O outro pergunta "Você cozinha?" e ouve "Claro, já comi em vários restaurantes." De onde vem o humor?',
      steps: ['Espera-se que entender de culinária signifique cozinhar.', 'A resposta confunde consumir com produzir: a quebra de expectativa revela a falta de competência do personagem.'],
    },
    traps: [
      { trap: 'Descrever o assunto da tira em vez do recurso.', fix: 'A pergunta pede o mecanismo do humor (ambiguidade, ironia), não o tema.' },
      { trap: 'Ignorar a imagem.', fix: 'Em meme e cartum, a imagem costuma carregar metade do sentido.' },
    ],
  },

  'por_sintaxe::Orações Adverbiais': {
    howItFalls: 'Caiu de 2024 a 2026 sempre do mesmo jeito: um trecho sublinhado e a pergunta "expressa ideia de". Os conectivos usados foram "como", "não obstante" e "que" com valor consecutivo.',
    concepts: [
      'Causa: porque, já que, visto que, como (no início do período).',
      'Concessão: embora, ainda que, mesmo que, apesar de, não obstante (a ideia contrária não impede a principal).',
      'Conformidade: conforme, segundo, consoante, como ("fiz como você mandou").',
      'Comparação: como, tal qual, mais/menos… (do) que.',
      'Consequência: tão/tanto/tal… que.',
      'Condição: se, caso, desde que, contanto que. Finalidade: para que, a fim de que. Tempo: quando, assim que, enquanto. Proporção: à medida que.',
      'O conectivo "como" muda de valor: decida pelo sentido, testando a troca por "porque", "conforme" ou "assim como".',
    ],
    example: {
      prompt: 'Que ideia expressa a oração sublinhada em "Ela aceitou o convite, [como já esperávamos]"?',
      steps: ['Troque "como" por "conforme": "conforme já esperávamos" mantém o sentido.', 'A oração expressa conformidade.'],
    },
    traps: [
      { trap: 'Classificar "como" sempre como comparação.', fix: 'Teste a troca: porque (causa), conforme (conformidade), assim como (comparação).' },
      { trap: 'Confundir concessão com adversidade.', fix: 'Concessão vem em oração subordinada (embora, não obstante); adversidade é coordenada (mas).' },
    ],
  },

  'qui_polaridade_geometria::Interações Intermoleculares': {
    howItFalls: 'Caiu em 3 anos: ordem de temperaturas de ebulição em compostos de quatro carbonos, interação entre soluto e solvente orgânico, e polaridade de ligação com geometria (PCl₃).',
    concepts: [
      'Forças, da mais fraca para a mais forte: dipolo induzido (London) < dipolo permanente < ligação de hidrogênio.',
      'Ligação de hidrogênio: H ligado a F, O ou N interagindo com F, O ou N de outra molécula (álcoois, ácidos, aminas, água).',
      'Temperatura de ebulição sobe com interações mais fortes e com maior massa/superfície. Para cadeias parecidas: alcano < cetona/aldeído < álcool < ácido carboxílico.',
      'Polaridade da ligação: diferença de eletronegatividade (Δ ≠ 0 → ligação polar).',
      'Geometria: pares isolados no átomo central entortam a molécula. PCl₃ tem um par isolado no P → piramidal (polar). NH₃ também é piramidal; CH₄ é tetraédrica (apolar).',
    ],
    example: {
      prompt: 'Ordene por temperatura de ebulição crescente: propano, propanona, propan-1-ol e ácido propanoico.',
      steps: ['Propano: só London.', 'Propanona: dipolo permanente.', 'Propan-1-ol: ligação de hidrogênio.', 'Ácido propanoico: ligações de hidrogênio mais intensas (forma dímeros).', 'Ordem: propano < propanona < propan-1-ol < ácido propanoico.'],
    },
    traps: [
      { trap: 'Achar que ferver rompe ligações covalentes.', fix: 'Mudança de estado rompe interações entre moléculas, não ligações dentro delas.' },
      { trap: 'Concluir que molécula com ligações polares é sempre polar.', fix: 'Depende da geometria: no CO₂ os dipolos se anulam.' },
    ],
  },

  'qui_estequiometria::Separação de Misturas': {
    howItFalls: 'Caiu em 3 anos com tabela de propriedades: identificar substâncias num esquema pela densidade e pela temperatura de fusão, líquidos imiscíveis que formam camadas e separação da pólvora negra por solventes.',
    concepts: [
      'Líquidos imiscíveis formam camadas: o de menor densidade fica em cima. Separam-se em funil de decantação.',
      'Sólido que afunda ou flutua num líquido: compare as densidades.',
      'Estado físico à temperatura ambiente sai das temperaturas de fusão e ebulição: se a fusão está abaixo de 25 °C e a ebulição acima, é líquido.',
      'Dissolução fracionada: usa um solvente que dissolve só um componente e depois filtração (ex.: água dissolve o sal e não a areia).',
      'Água é polar e dissolve compostos iônicos e polares; solventes apolares (CS₂, CCl₄) dissolvem substâncias apolares como o enxofre.',
      'Destilação simples: sólido dissolvido em líquido. Fracionada: líquidos miscíveis com pontos de ebulição diferentes.',
    ],
    example: {
      prompt: 'Num tubo há água (1,00 g/cm³), óleo (0,92 g/cm³) e areia. Como ficam as fases e como separar?',
      steps: ['Areia, mais densa, fica no fundo; óleo, menos denso que a água, fica em cima.', 'Filtre (ou decante) a areia e separe óleo e água no funil de decantação.'],
    },
    traps: [
      { trap: 'Achar que o líquido mais "pesado" em massa fica embaixo.', fix: 'Quem decide é a densidade, não a massa.' },
      { trap: 'Usar destilação simples para dois líquidos miscíveis.', fix: 'Use a fracionada.' },
    ],
  },

  'qui_oxirreducao::Processos de Oxirredução': {
    howItFalls: 'Caiu em 3 anos: Nox do manganês no permanganato, quem oxida e quem reduz na queima da pólvora negra e a variação de Nox do cloro numa reação com hipoclorito.',
    concepts: [
      'Nox: substância simples = 0; H = +1 (exceto em hidretos metálicos); O = −2 (exceto em peróxidos); metais alcalinos = +1; alcalino-terrosos = +2.',
      'Soma dos Nox = 0 na molécula e = carga no íon.',
      'Oxidação: Nox aumenta (perde elétrons). Redução: Nox diminui (ganha elétrons).',
      'Agente oxidante é a espécie que sofre redução; agente redutor é a que sofre oxidação.',
      'Numa equação, compare o Nox de cada elemento nos reagentes e nos produtos para descobrir quem mudou.',
    ],
    formulas: ['Σ Nox = carga da espécie'],
    example: {
      prompt: 'Qual o Nox do cromo no dicromato, Cr₂O₇²⁻?',
      steps: ['Oxigênios: 7 × (−2) = −14.', '2x − 14 = −2 (carga do íon).', 'x = +6.'],
    },
    traps: [
      { trap: 'Igualar a soma dos Nox a zero num íon.', fix: 'Num íon, a soma é igual à carga.' },
      { trap: 'Chamar de oxidante quem se oxida.', fix: 'O oxidante provoca a oxidação do outro e, por isso, se reduz.' },
    ],
  },

  'qui_cinetica::Cinética Química': {
    howItFalls: 'Caiu em 3 anos: experimentos com lâmina ou palha de aço, ácido e temperatura diferentes; diagrama de energia com dois caminhos; sistemas com mais moléculas no mesmo volume.',
    concepts: [
      'Teoria das colisões: a reação ocorre quando há colisões efetivas, com energia suficiente (energia de ativação) e orientação adequada.',
      'Aumentam a velocidade: maior temperatura, maior concentração dos reagentes, maior superfície de contato (palha > lâmina; pó > pedaço) e catalisador.',
      'Mais moléculas no mesmo volume = maior concentração = mais colisões = maior velocidade.',
      'Diagrama de energia: Ea = topo − energia dos reagentes; ΔH = produtos − reagentes. O catalisador oferece um caminho com Ea menor e não muda ΔH.',
    ],
    example: {
      prompt: 'Qual experimento produz gás hidrogênio mais rápido? (1) zinco em grânulos, HCl 1 mol/L, 25 °C; (2) zinco em pó, HCl 2 mol/L, 40 °C; (3) zinco em grânulos, HCl 2 mol/L, 40 °C.',
      steps: ['(3) supera (1): mesma superfície, mas maior concentração e temperatura.', '(2) supera (3): mesma concentração e temperatura, mas o pó tem superfície de contato muito maior.', 'O mais rápido é o (2), que reúne os três fatores favoráveis.'],
    },
    traps: [
      { trap: 'Dizer que o catalisador altera o ΔH.', fix: 'Ele só diminui a energia de ativação.' },
      { trap: 'Ler Ea a partir do zero do gráfico.', fix: 'Ea é medida a partir da energia dos reagentes até o topo.' },
    ],
  },
};
