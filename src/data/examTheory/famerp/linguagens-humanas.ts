// Português, História e Geografia: capítulos que mais caem na objetiva da
// Famerp. Nestas matérias a "fórmula" é o procedimento de leitura: por isso a
// estratégia pesa mais que o conteúdo listado.

import type { ChapterTheory } from '../types';

const md = String.raw;

export const linguagensHumanas: Record<string, ChapterTheory> = {
  'por_texto::Os Dois Níveis da Leitura': {
    howItFalls: md`Caiu em 4 dos 5 anos (2022, 2023, 2025, 2026), com soneto (Florbela Espanca), ensaio (Oliver Sacks), crônica (Machado de Assis) e texto de historiadores. As perguntas são "depreende-se", "deixa transparecer o sentimento", "segundo o cronista", "o trecho ressalta". Todas pedem o que está **nas entrelinhas, mas apoiado no texto**.`,
    explanation: md`### Explícito e implícito
Todo texto diz coisas diretamente (nível explícito) e outras que o leitor precisa deduzir (nível implícito). O implícito tem dois tipos, que a banca separa.

### Pressuposto
Está **marcado na frase** por uma palavra e continua verdadeiro mesmo se a frase for negada.
- "Ele **deixou de** fumar" e "Ele **não** deixou de fumar" pressupõem que ele fumava.
- Marcadores comuns: *ainda*, *já*, *voltar a*, *continuar*, *deixar de*, *até*, *também*, verbos como *descobrir* e *perceber* (pressupõem que o fato é verdadeiro).

### Subentendido
Depende do **contexto** e o autor pode negá-lo ("Não foi isso que eu quis dizer"). "Está calor aqui" pode subentender "abra a janela".

### Sentimento e ponto de vista
Infira pelas **escolhas do texto**: adjetivos, exclamações, reticências, ironia, o que o narrador destaca e o que ele omite. "Não vejo a hora de fazer oitenta anos" revela expectativa positiva, não medo da velhice.

### Como a alternativa certa costuma ser
Uma **paráfrase** ou uma inferência curta. As erradas: generalizam ("todos", "sempre"), extrapolam (vão além do texto), invertem a relação de causa ou trazem uma ideia verdadeira no mundo mas ausente do texto.`,
    applications: [
      md`**Todas as matérias**: História e Geografia da Famerp partem de excertos e perguntam "o excerto sustenta que"; a técnica é a mesma.`,
      md`**Literatura**: ideal estético do eu lírico e posição do cronista.`,
      md`**Inglês**: os textos de ciência pedem o mesmo cuidado com o que o texto afirma e o que só sugere.`,
      md`**Redação**: usar a coletânea sem copiar exige entender o que cada texto pressupõe.`,
    ],
    strategy: [
      md`Leia o enunciado antes do texto e grife o que ele pede (sentimento, tese, pressuposto).`,
      md`Volte ao trecho indicado e procure a palavra que sustenta cada alternativa.`,
      md`Elimine as que generalizam, extrapolam ou dizem algo que o texto não diz.`,
      md`Entre as que restam, fique com a que tem apoio explícito numa passagem.`,
    ],
    examples: [
      {
        title: 'Pressuposto',
        prompt: md`O que pressupõe a frase "Ainda não desisti de aprender piano"?`,
        steps: [md`"Ainda não" indica que a situação continua até agora.`, md`"Desistir de aprender" pressupõe que o aprendizado começou e teve dificuldades.`, md`Pressupostos: a pessoa já tenta aprender há algum tempo e desistir foi uma possibilidade.`],
      },
      {
        title: 'Sentimento',
        prompt: md`Num ensaio, o autor diz: "Aos oitenta, finalmente terei tempo para tudo o que adiei". Que sentimento ele revela sobre a velhice?`,
        steps: [md`"Finalmente" indica algo desejado.`, md`"Tempo para tudo o que adiei" mostra a velhice como liberdade.`, md`Sentimento: expectativa positiva, não temor.`],
      },
    ],
    traps: [
      { trap: md`Escolher a alternativa verdadeira sobre o tema, mas ausente do texto.`, fix: md`Se nenhuma passagem a sustenta, ela extrapola.` },
      { trap: md`Atribuir ao autor a opinião de uma voz que ele cita.`, fix: md`Identifique quem fala em cada trecho.` },
    ],
  },

  'por_texto::Figuras de Linguagem': {
    howItFalls: md`Caiu em 4 dos 5 anos. A banca pede para **localizar** a figura num trecho (antítese, personificação, sinestesia), para dizer **qual recurso produz o humor** de uma tirinha, ou descreve a figura sem nomeá-la ("incompatibilidade semântica entre os termos" = paradoxo).`,
    explanation: md`### Figuras de oposição
- **Antítese**: aproxima palavras de sentido oposto. "Era o melhor dos tempos, era o pior dos tempos."
- **Paradoxo (oxímoro)**: afirma **ao mesmo tempo** ideias que se contradizem, criando incompatibilidade de sentido. "Silêncio ensurdecedor", "doce amargura".

### Figuras de semelhança e proximidade
- **Metáfora**: comparação sem conectivo. "Aquele aluno é uma enciclopédia."
- **Comparação**: com conectivo (*como*, *tal qual*). "Forte como um touro."
- **Metonímia**: troca por proximidade: autor pela obra ("li Machado"), parte pelo todo ("pediu a mão"), marca pelo produto.

### Figuras de sentido e efeito
- **Personificação (prosopopeia)**: ações ou sentimentos humanos a seres inanimados ou abstratos. "O tempo me ensinou."
- **Sinestesia**: mistura de sentidos diferentes. "Voz áspera" (audição + tato), "cheiro doce" (olfato + paladar).
- **Hipérbole**: exagero. **Eufemismo**: suavização. **Ironia**: diz o contrário do que pensa, para criticar.

### Humor em tirinhas
O humor quase sempre vem de **ambiguidade** (palavra com dois sentidos), **quebra de expectativa** ou **ironia**. Pergunte qual palavra o personagem entendeu de outro jeito.`,
    applications: [
      md`**Literatura**: reconhecer estéticas (o Barroco usa antítese e paradoxo; o Simbolismo, sinestesia).`,
      md`**Textos cômicos**: identificar o recurso do humor.`,
      md`**Redação**: usar metáfora e comparação com intenção.`,
    ],
    strategy: [
      md`Para cada alternativa, pergunte qual é a relação entre os termos: oposição, semelhança, troca ou mistura de sentidos.`,
      md`Oposição: se os dois termos são afirmados juntos do mesmo ser, é paradoxo; se só aproximados, antítese.`,
      md`Se a pergunta descreve a figura, traduza a descrição em nome antes de olhar as alternativas.`,
    ],
    examples: [
      {
        title: 'Classificação',
        prompt: md`Classifique: (I) "um grito amarelo cortou a tarde"; (II) "aquele riso triste".`,
        steps: [md`I: o grito (audição) recebe uma cor (visão): sinestesia.`, md`II: riso e triste são afirmados juntos do mesmo ser: paradoxo.`],
      },
      {
        title: 'Humor',
        prompt: md`Numa tirinha, o chefe pede "um relatório na minha mesa" e o funcionário deixa uma folha em branco **sobre** a mesa. Qual o recurso?`,
        steps: [md`"Na minha mesa" foi entendido no sentido literal de lugar, e não de entrega do trabalho pronto.`, md`Ambiguidade explorada para quebra de expectativa.`],
      },
    ],
    traps: [
      { trap: md`Confundir antítese e paradoxo.`, fix: md`Antítese opõe dois termos; paradoxo afirma os dois juntos do mesmo ser.` },
      { trap: md`Chamar comparação de metáfora.`, fix: md`Com conectivo é comparação.` },
    ],
  },

  'por_texto::Leitura de Textos Cômicos': {
    howItFalls: md`Caiu de 2024 a 2026 com meme, cartum e conto curto de humor (Millôr Fernandes). Pede **o recurso que produz o humor** ou **o traço do personagem** revelado pela fala final.`,
    explanation: md`### Como o humor funciona
O texto constrói uma lógica e a última fala ou imagem a **desmonta**. A graça está na distância entre o que se esperava e o que aconteceu.

### Recursos frequentes
- **Ambiguidade**: palavra ou frase entendida em outro sentido.
- **Ironia**: o personagem diz o contrário do que a situação mostra.
- **Exagero** e **absurdo**: a situação vai além do plausível.
- **Inversão de papéis**: quem deveria saber não sabe, quem deveria cuidar descuida.
- **Confusão entre consumir e produzir**, entre saber e aparentar saber.

### Imagem e texto
Em meme e cartum, o sentido nasce da **relação** entre o que está escrito e o que se vê. Um meme com legenda "minha mãe no dia seguinte" e a foto de alguém dando entrevista à TV caracteriza a mãe como quem espalha o segredo.

### Sentimento do personagem
A pergunta final do conto revela o que o personagem pensa de verdade: ressentimento, ingenuidade, vaidade.`,
    applications: [
      md`**Figuras de linguagem**: muitas tiras exploram ironia e ambiguidade.`,
      md`**Interpretação**: o mesmo cuidado com o implícito.`,
      md`**Inglês**: memes e tirinhas em inglês já caíram em outras bancas.`,
    ],
    strategy: [
      md`Descreva em uma frase o que se esperava.`,
      md`Descreva o que aconteceu.`,
      md`O recurso é o que transforma uma coisa na outra.`,
    ],
    examples: [
      {
        title: 'Cartum',
        prompt: md`— Vou escrever um livro sobre culinária. — Você cozinha? — Claro, já comi em vários restaurantes. De onde vem o humor?`,
        steps: [md`Esperado: entender de culinária = cozinhar.`, md`Aconteceu: o personagem confunde consumir com produzir.`, md`A quebra de expectativa revela sua falta de competência.`],
      },
      {
        title: 'Conto',
        prompt: md`Depois de ouvir o anjo da guarda listar todas as vezes em que o salvou, o homem pergunta: "E onde você estava no dia do meu casamento?". O que a pergunta revela?`,
        steps: [md`Ele trata o casamento como um perigo do qual deveria ter sido salvo.`, md`Revela arrependimento ou ressentimento com o casamento, dito com ironia.`],
      },
    ],
    traps: [
      { trap: md`Descrever o assunto da tira em vez do recurso.`, fix: md`A pergunta pede o mecanismo do humor.` },
      { trap: md`Ignorar a imagem.`, fix: md`Em meme e cartum, a imagem carrega metade do sentido.` },
    ],
  },

  'por_sintaxe::Orações Adverbiais': {
    howItFalls: md`Caiu de 2024 a 2026 sempre do mesmo jeito: um trecho **sublinhado** e a pergunta "no contexto, expressa ideia de". Os conectivos foram *como*, *não obstante* e *que* com valor de consequência.`,
    explanation: md`### O que é
Oração adverbial funciona como um advérbio da oração principal: indica causa, tempo, condição etc. O **conectivo** sugere a relação, mas o **sentido** decide.

### Relações e conectivos
| Relação | Conectivos |
|---|---|
| Causa | porque, já que, visto que, **como** (no início) |
| Concessão | embora, ainda que, mesmo que, apesar de, **não obstante** |
| Condição | se, caso, desde que, contanto que |
| Conformidade | conforme, segundo, consoante, **como** |
| Comparação | como, tal qual, mais/menos... (do) que |
| Consequência | tão/tanto/tal... **que** |
| Finalidade | para que, a fim de que |
| Tempo | quando, assim que, enquanto |
| Proporção | à medida que, à proporção que |

### Concessão não é adversidade
Concessão admite um fato que **não impede** a principal: "Embora chovesse, saímos". Adversidade (*mas*, *porém*) é coordenação, não adverbial.

### O conectivo *como*
Teste a troca: por *porque* → causa; por *conforme* → conformidade; por *assim como* → comparação.

### Oração reduzida
Sem conectivo, com verbo no infinitivo, gerúndio ou particípio: "**Terminada a aula**, saímos" (tempo). Desenvolva para descobrir a relação: "Quando terminou a aula".`,
    applications: [
      md`**Interpretação**: a relação lógica entre as partes do texto é o que sustenta a tese do autor.`,
      md`**Redação**: conectivos certos dão coesão aos argumentos; a banca cobra coesão.`,
      md`**Pontuação**: oração adverbial anteposta costuma vir com vírgula.`,
    ],
    strategy: [
      md`Leia a frase inteira, não só o trecho sublinhado.`,
      md`Troque o conectivo por outro de cada relação e veja qual mantém o sentido.`,
      md`Se não houver conectivo, desenvolva a oração reduzida.`,
    ],
    examples: [
      {
        title: 'O como',
        prompt: md`Que ideia expressa a oração em "Ela aceitou o convite, **como já esperávamos**"?`,
        steps: [md`Troque por "conforme já esperávamos": o sentido se mantém.`, md`Conformidade.`],
      },
      {
        title: 'Concessão',
        prompt: md`Que ideia expressa "**Não obstante o cansaço**, terminou a prova"?`,
        steps: [md`O cansaço é um obstáculo que não impediu terminar.`, md`Concessão (equivale a "embora estivesse cansado").`],
      },
    ],
    traps: [
      { trap: md`Classificar *como* sempre como comparação.`, fix: md`Teste a troca por porque, conforme ou assim como.` },
      { trap: md`Confundir concessão com adversidade.`, fix: md`Concessão é subordinada (embora); adversidade é coordenada (mas).` },
    ],
  },

  'his_guerra_fria_contemporaneo::Guerra Fria': {
    howItFalls: md`Caiu em 4 dos 5 anos (2023–2026), sempre a partir de excerto de historiador (Hobsbawm, Aarão Reis, Lefort, Luis Felipe da Silva Neves). Pede a origem da ruptura entre os aliados, o papel das armas nucleares, o efeito do fim da Segunda Guerra no Brasil e o significado de maio de 1968.`,
    explanation: md`### Origem
A aliança que derrotou o nazismo (EUA, URSS, Reino Unido) se desfez logo depois de 1945. A disputa pela Europa do pós-guerra (Alemanha dividida, governos pró-soviéticos no Leste) mostrou que os projetos eram incompatíveis.

### Os dois blocos
- **EUA**: capitalismo liberal; Doutrina Truman (1947, conter o comunismo) e Plano Marshall (reconstruir a Europa e afastá-la do socialismo); OTAN (1949).
- **URSS**: socialismo de partido único; Comecon e Pacto de Varsóvia (1955).

### Equilíbrio do terror
As armas nucleares existiam mais para **ameaçar** que para serem usadas: a destruição mútua assegurada tornava a guerra direta suicida. Por isso o confronto foi **indireto**: corrida armamentista e espacial, propaganda e guerras periféricas (Coreia, Vietnã, Afeganistão) e a crise dos mísseis de Cuba (1962).

### Brasil
A vitória aliada em 1945 expôs a contradição de lutar contra o fascismo sob a ditadura do Estado Novo, que caiu naquele ano. O Brasil se alinhou aos EUA; o anticomunismo justificou o golpe de 1964.

### Maio de 1968
Revolta estudantil e operária na França, que criticava tanto o capitalismo de consumo quanto o socialismo soviético; parte da contracultura e de movimentos no mundo todo.

### Fim
Perestroika e glasnost (Gorbachev), queda do Muro de Berlim (1989) e fim da URSS (1991).`,
    applications: [
      md`**Brasil República**: queda do Estado Novo, golpe de 1964 e Regime Militar.`,
      md`**América Latina**: Revolução Cubana, ditaduras apoiadas pelos EUA, Operação Condor.`,
      md`**Geografia**: ordem bipolar e, depois, multipolar; descolonização afro-asiática no contexto dos blocos.`,
      md`**Física**: energia nuclear e fissão.`,
    ],
    strategy: [
      md`Leia o excerto e escreva em uma frase a tese do autor.`,
      md`A pergunta "o excerto sustenta que" pede a tese do texto, não o que você sabe.`,
      md`Desconfie de alternativas com "confronto direto" entre as superpotências.`,
    ],
    examples: [
      {
        title: 'Frase-síntese',
        prompt: md`Raymond Aron resumiu a Guerra Fria como "paz impossível, guerra improvável". O que a frase explica?`,
        steps: [md`"Paz impossível": a rivalidade ideológica não tinha acordo.`, md`"Guerra improvável": o arsenal nuclear tornava o confronto direto suicida.`, md`Conclusão: disputa por corrida armamentista e conflitos periféricos.`],
      },
      {
        title: 'Brasil',
        prompt: md`Por que o fim da Segunda Guerra enfraqueceu o Estado Novo?`,
        steps: [md`O Brasil lutou ao lado das democracias contra o fascismo.`, md`Manter uma ditadura em casa ficou contraditório; a oposição cresceu e Vargas foi deposto em 1945.`],
      },
    ],
    traps: [
      { trap: md`Afirmar que EUA e URSS se enfrentaram militarmente de forma direta.`, fix: md`O confronto foi indireto.` },
      { trap: md`Responder pelo que você sabe, e não pela tese do excerto.`, fix: md`A pergunta é sobre o que o autor sustenta.` },
    ],
  },

  'his_brasil_colonia::A Montagem da Colonização': {
    howItFalls: md`Caiu em 2022, 2023 e 2026, a partir de excertos (Laura de Mello e Souza, Stuart Schwartz, Ronaldo Vainfas): capitanias hereditárias, a grande lavoura de produtos tropicais e as relações com os povos indígenas.`,
    explanation: md`### Por que colonizar só a partir de 1530
Até então Portugal se dedicava ao lucrativo comércio com o Oriente. A presença de franceses no litoral e a queda desse comércio levaram à ocupação efetiva.

### Capitanias hereditárias (década de 1530)
A Coroa dividiu o território em faixas entregues a **donatários**, que bancavam a colonização em troca de direitos (cobrar tributos, doar sesmarias). Assim, **transferia custos e riscos a particulares** e garantia a posse. Poucas prosperaram (Pernambuco e São Vicente).

### Governo-Geral (1549)
Tomé de Sousa fundou Salvador e centralizou a administração, **sem extinguir** as capitanias.

### Plantation açucareira
Latifúndio, monocultura, mão de obra escravizada e produção para exportação, dentro do **pacto colonial** (a colônia só comercia com a metrópole). O tráfico atlântico de africanos escravizados era, ele mesmo, um negócio lucrativo.

### Os povos indígenas
Não foram só vítimas passivas. Houve escravização, guerras e epidemias, mas também **alianças**, trocas e apropriação de ferramentas europeias (machados, facas de metal) para fins próprios. A historiografia atual destaca essa **agência** indígena.`,
    applications: [
      md`**Mineração**: o deslocamento do eixo econômico para o Centro-Sul no século XVIII.`,
      md`**Geografia**: concentração fundiária atual tem raiz nas sesmarias e na plantation.`,
      md`**Sociologia**: desigualdade racial e herança da escravidão.`,
    ],
    strategy: [
      md`Identifique o tema do excerto: administração, economia ou relações sociais.`,
      md`Procure a palavra-chave da tese (custos, agência, exportação).`,
      md`Desconfie de alternativas que tratam a colonização como projeto só da Coroa ou indígenas como passivos.`,
    ],
    examples: [
      {
        title: 'Capitanias',
        prompt: md`Por que as capitanias hereditárias interessavam à Coroa?`,
        steps: [md`Portugal tinha poucos recursos para ocupar um território enorme.`, md`Delegar a donatários transferia custos e riscos e garantia a posse contra outras potências.`],
      },
      {
        title: 'Agência indígena',
        prompt: md`Um excerto descreve indígenas usando machados europeus em suas próprias guerras. O que ele caracteriza?`,
        steps: [md`Apropriação de tecnologia europeia para fins indígenas.`, md`Mostra agência, e não apenas submissão.`],
      },
    ],
    traps: [
      { trap: md`Tratar os indígenas apenas como vítimas passivas.`, fix: md`A historiografia atual destaca alianças, resistência e apropriação.` },
      { trap: md`Dizer que o Governo-Geral extinguiu as capitanias.`, fix: md`Ele as coordenou; continuaram existindo.` },
    ],
  },

  'his_brasil_colonia::A Mineração no Brasil Colonial': {
    howItFalls: md`Caiu de 2024 a 2026, por excertos sobre a sociedade mineira: ostentação e roupas de luxo, participação feminina no comércio e a descoberta do ouro na passagem dos séculos XVII para XVIII.`,
    explanation: md`### Descoberta
Bandeirantes paulistas acharam ouro em Minas Gerais no fim do século XVII; depois em Goiás e Mato Grosso. Houve corrida de colonos e conflitos (Guerra dos Emboabas, 1707–1709).

### Uma sociedade diferente da açucareira
Mais **urbana** e **diversificada**: comerciantes, artesãos, funcionários, militares, padres, homens livres pobres e escravizados. A riqueza se exibia em roupas de luxo e nas igrejas do barroco mineiro, mas também havia fome e pobreza nos primeiros anos.

### Mulheres
Sobretudo negras, escravizadas e forras, tiveram papel no comércio ambulante (as "negras de tabuleiro") e nas vendas, apesar das tentativas das autoridades de controlá-las.

### Controle da Coroa
Quinto (20% do ouro), casas de fundição, derrama (cobrança forçada dos atrasados). A capital foi transferida para o Rio de Janeiro em 1763, por onde o ouro saía. A pressão fiscal está na origem da Inconfidência Mineira (1789).

### Mercado interno
Tropeiros, gado do Sul e alimentos de outras capitanias abasteciam as minas, integrando regiões da colônia.`,
    applications: [
      md`**Montagem da colonização**: o eixo econômico se desloca do Nordeste para o Centro-Sul.`,
      md`**Arte**: barroco mineiro (Aleijadinho).`,
      md`**Geografia**: urbanização do interior e formação de rotas.`,
    ],
    strategy: [
      md`Situe o excerto no século XVIII.`,
      md`Pergunte qual traço social ele mostra: urbanização, ostentação, diversidade, papel feminino, fiscalização.`,
    ],
    examples: [
      {
        title: 'Ostentação',
        prompt: md`Um excerto descreve, em Vila Rica do século XVIII, homens com casacos de seda e fios de ouro. O que isso mostra?`,
        steps: [md`A riqueza do ouro gerou camadas urbanas que exibiam status pelo consumo de luxo.`, md`É a formação de uma sociedade urbana e hierarquizada.`],
      },
      {
        title: 'Fiscalização',
        prompt: md`Por que a capital da colônia foi para o Rio de Janeiro em 1763?`,
        steps: [md`O ouro de Minas era escoado pelo porto do Rio.`, md`Aproximar a administração da região mineradora facilitava o controle fiscal.`],
      },
    ],
    traps: [
      { trap: md`Descrever a sociedade mineira só com senhores e escravizados.`, fix: md`Ela teve camadas médias urbanas e grande diversidade.` },
      { trap: md`Datar a mineração no século XVI.`, fix: md`O ouro foi achado no fim do XVII; o auge foi o XVIII.` },
    ],
  },

  'his_idade_media::Alta Idade Média e Feudalismo': {
    howItFalls: md`Caiu em 2022, 2024 e 2025 com textos de Jacques Le Goff, Georges Duby e de um monge do ano 1000: o ritual de vassalagem, as obrigações dos servos e a explicação religiosa para a fome.`,
    explanation: md`### Duas relações diferentes
- **Vassalagem**: entre **nobres**. O vassalo presta **homenagem** e jura **fidelidade** ao suserano, que lhe concede um **feudo** (investidura). O ritual usa gestos (mãos do vassalo entre as do senhor, beijo) e objetos simbólicos (um ramo, um punhado de terra) que representam a terra concedida.
- **Servidão**: entre o **senhor** e o **camponês**. O servo é preso à terra, não pode ser vendido separado dela, e deve obrigações.

### Obrigações dos servos
- **Corveia**: dias de trabalho nas terras do senhor.
- **Talha**: parte da produção.
- **Banalidades**: taxas pelo uso do moinho, do forno e do lagar.
- Taxas pesadas levavam servos a fugir para outras terras e, mais tarde, para as cidades.

### Mentalidade
A Igreja dava sentido ao mundo e monopolizava a escrita. Fome, peste e guerra eram lidas como **castigo divino** pelos pecados. Por isso o monge que explica a fome como punição ao orgulho humano revela a mentalidade, não a causa.

### Economia
Agrária, de baixa circulação de moeda, voltada à subsistência do feudo; o comércio se retraiu, mas não desapareceu.`,
    applications: [
      md`**Baixa Idade Média**: renascimento comercial e urbano, crise do século XIV.`,
      md`**Sociologia**: estratificação por estamentos (clero, nobreza, servos) e não por classes.`,
      md`**Interpretação**: ler o lugar social de quem escreve (o monge).`,
    ],
    strategy: [
      md`Defina se o texto fala de nobre com nobre (vassalagem) ou senhor com camponês (servidão).`,
      md`Para textos de época, pergunte quem escreve e o que isso revela sobre a mentalidade.`,
    ],
    examples: [
      {
        title: 'Mentalidade',
        prompt: md`Um cronista do ano 1000 explica uma grande fome como castigo ao orgulho humano. O que o texto revela?`,
        steps: [md`A leitura religiosa dos fenômenos naturais.`, md`O cronista é monge: a interpretação vem de quem detinha a escrita.`],
      },
      {
        title: 'Ritual',
        prompt: md`Por que o ritual de vassalagem usava objetos como um punhado de terra?`,
        steps: [md`Numa sociedade de poucos letrados, o gesto e o objeto simbolizavam o contrato.`, md`A terra representava o feudo concedido.`],
      },
    ],
    traps: [
      { trap: md`Confundir vassalagem com servidão.`, fix: md`Vassalagem liga nobres; servidão liga senhor e camponês.` },
      { trap: md`Dizer que não havia nenhum comércio.`, fix: md`Ele se retraiu, mas não desapareceu.` },
    ],
  },

  'geo_economica_brasil::O Espaço Agrário Brasileiro': {
    howItFalls: md`Caiu em 2023, 2024 e 2025: grilagem de terras (notícia de 2024), expansão da cana-de-açúcar entre 1990 e 2015 (mapa) e técnicas agrícolas sustentáveis apresentadas por infográfico.`,
    explanation: md`### Estrutura fundiária
Poucos estabelecimentos concentram a maior parte da área agrícola. A raiz está nas sesmarias e na Lei de Terras (1850), que só permitia acesso à terra por compra.

### Grilagem
Apropriação ilegal de terra pública ou alheia com **documentos falsos**, às vezes "envelhecidos" (o nome vem de guardar papéis com grilos para amarelá-los). Hoje inclui alterar marcos e registrar terras em cadastros ambientais. Está ligada ao desmatamento e a conflitos no campo.

### Modernização e fronteira agrícola
Mecanização, insumos químicos e sementes melhoradas, com concentração de terra e êxodo rural ("modernização conservadora"). A fronteira avançou do Sul e Sudeste para o Cerrado (Centro-Oeste e Matopiba) e a borda da Amazônia.

### Cana-de-açúcar
Expansão a partir do interior paulista para Minas, Goiás e Mato Grosso do Sul, puxada pelo **etanol** e pelos carros flex; a colheita foi mecanizada e a queima reduzida.

### Agronegócio e agricultura familiar
O agronegócio domina as **exportações** (soja, milho, carne, açúcar, café). A agricultura familiar responde por boa parte dos alimentos do mercado interno.

### Técnicas sustentáveis
Integração lavoura-pecuária-floresta (ILPF), plantio direto (sem revolver o solo), rotação de culturas, sistemas agroflorestais e recuperação de pastagens degradadas.`,
    applications: [
      md`**Questões ambientais**: desmatamento, queimadas e perda de biodiversidade.`,
      md`**História**: sesmarias, Lei de Terras e estrutura colonial.`,
      md`**Biologia**: ciclos do carbono e do nitrogênio no solo; controle biológico.`,
    ],
    strategy: [
      md`Em mapa de dois anos, descreva o que mudou e onde.`,
      md`Explique a mudança por um fator: mercado (etanol), tecnologia, preço da terra ou política.`,
      md`Em infográfico de técnica, procure o nome que reúne os benefícios mostrados.`,
    ],
    examples: [
      {
        title: 'Mapa da cana',
        prompt: md`Um mapa mostra municípios canavieiros concentrados em SP em 1990 e espalhados por MG, GO e MS em 2015. Que processo isso indica?`,
        steps: [md`Expansão da fronteira canavieira a partir do núcleo paulista.`, md`Causas: demanda por etanol, terras mais baratas, mecanização.`],
      },
      {
        title: 'Grilagem',
        prompt: md`Por que a grilagem está ligada ao desmatamento?`,
        steps: [md`O grileiro desmata para simular uso e posse da terra.`, md`A terra "regularizada" é vendida ou incorporada à pecuária e à agricultura.`],
      },
    ],
    traps: [
      { trap: md`Confundir grilagem com reforma agrária.`, fix: md`Grilagem é apropriação ilegal; reforma agrária é redistribuição legal.` },
      { trap: md`Dizer que o agronegócio produz a maior parte do alimento consumido no país.`, fix: md`Ele domina as exportações; a agricultura familiar pesa no abastecimento interno.` },
    ],
  },

  'geo_fisica_brasil::Geologia e Geomorfologia': {
    howItFalls: md`Caiu em 2022, 2024 e 2025: formação de relevo por imagem (Pedra Furada, no Piauí), zona de subducção e dobramentos modernos do período Terciário.`,
    explanation: md`### Estruturas geológicas
- **Escudos cristalinos**: rochas antigas, magmáticas e metamórficas; ricos em minerais metálicos (ferro, manganês).
- **Bacias sedimentares**: rochas formadas por acúmulo de sedimentos, em **camadas**; guardam petróleo, gás e carvão.
- **Dobramentos modernos** (Terciário, era Cenozoica): Andes, Alpes, Himalaia, Rochosas. Regiões instáveis, com terremotos e vulcões. O **Brasil não tem** dobramentos modernos.

### Placas tectônicas
- **Convergentes**: se aproximam. Placa oceânica, mais densa, mergulha sob a continental (**subducção**): forma fossas oceânicas, vulcões e cordilheiras.
- **Divergentes**: se afastam; forma dorsais oceânicas.
- **Transformantes**: deslizam lado a lado (falha de San Andreas).
O Brasil fica no **interior** da placa Sul-Americana: relevo antigo, desgastado, sem grandes altitudes e com pouca atividade sísmica.

### Agentes do relevo
- **Internos** (tectonismo, vulcanismo) criam formas.
- **Externos** (intemperismo, erosão pela água e pelo vento) desgastam. A **erosão diferencial** remove mais as partes menos resistentes, produzindo arcos e chapadas, como na Serra da Capivara.

### Classificação de Ross
Relevo brasileiro em planaltos, planícies e depressões.`,
    applications: [
      md`**Pedologia**: o tipo de rocha e o clima formam o solo.`,
      md`**Economia**: minérios nos escudos, petróleo nas bacias.`,
      md`**Desastres**: terremotos e tsunamis em zonas de subducção (Chile, Japão).`,
    ],
    strategy: [
      md`Em imagem, procure camadas (sedimentar) ou rocha maciça (cristalina).`,
      md`Em esquema de placas, veja se elas se aproximam ou se afastam.`,
      md`Desconfie de qualquer alternativa que dê ao Brasil dobramentos modernos.`,
    ],
    examples: [
      {
        title: 'Arco de arenito',
        prompt: md`Uma formação de arenito em camadas, com um arco aberto, está no sertão nordestino. Qual a origem?`,
        steps: [md`Camadas indicam rocha sedimentar.`, md`O arco resulta da erosão diferencial ao longo de milhões de anos.`],
      },
      {
        title: 'Subducção',
        prompt: md`O que se forma onde uma placa oceânica mergulha sob uma continental?`,
        steps: [md`Fossa oceânica no ponto de mergulho.`, md`Cordilheira e vulcões no continente, além de terremotos.`],
      },
    ],
    traps: [
      { trap: md`Atribuir ao relevo brasileiro dobramentos modernos.`, fix: md`O Brasil tem relevo antigo, sem dobramentos do Terciário.` },
      { trap: md`Confundir fossa com dorsal.`, fix: md`Fossa = convergência; dorsal = divergência.` },
    ],
  },

  'geo_climatologia_socioambiental::Desafios Ambientais do Século XXI': {
    howItFalls: md`Caiu de 2022 a 2024: perda de cobertura florestal por incêndios, tabela de esgoto coletado e tratado por região e educação ambiental como resposta ao consumismo.`,
    explanation: md`### Incêndios e floresta
Os incêndios florestais cresceram com secas mais longas e temperaturas maiores, associadas à mudança climática, e com o uso do fogo para desmatar. Eles liberam CO₂, que reforça o aquecimento: um ciclo que se realimenta.

### Saneamento
**Coletar** esgoto não é **tratar**. A diferença entre o volume coletado e o tratado chega sem tratamento aos rios. Norte e Nordeste têm os piores índices. Falta de saneamento se traduz em doenças de veiculação hídrica.

### Educação ambiental crítica
Não se limita a ensinar a separar lixo: questiona o modelo de **acumulação e consumo** que gera o problema.

### Acordos internacionais
Rio-92 (Agenda 21, convenções do clima e da biodiversidade), Protocolo de Kyoto (1997, metas para países desenvolvidos), Acordo de Paris (2015, metas voluntárias nacionais, as NDCs), COP30 em Belém (2025). Princípio das **responsabilidades comuns, porém diferenciadas**.`,
    applications: [
      md`**Biologia**: ciclo do carbono, efeito estufa, acidificação dos oceanos (discursiva de 2026).`,
      md`**Química**: poluição do ar, chuva ácida.`,
      md`**Saúde**: doenças ligadas à falta de saneamento.`,
      md`**Redação**: tema ambiental é recorrente em vestibulares.`,
    ],
    strategy: [
      md`Em tabela, leia o rótulo de cada coluna antes de comparar.`,
      md`Em excerto, identifique a tese (causa humana, crítica ao consumo).`,
      md`Relacione causa e consequência: desmatamento → incêndio → CO₂ → aquecimento.`,
    ],
    examples: [
      {
        title: 'Saneamento',
        prompt: md`Uma região coleta 1,8 milhão de m³/dia de esgoto e trata 1,6 milhão. O que se conclui?`,
        steps: [md`Cerca de 0,2 milhão de m³/dia é coletado sem tratamento.`, md`Esse esgoto vai para os rios: coleta sem tratamento não resolve a poluição.`],
      },
      {
        title: 'Incêndios',
        prompt: md`Por que os incêndios florestais agravam o aquecimento global?`,
        steps: [md`Queimar biomassa libera CO₂ que estava estocado.`, md`Mais CO₂ intensifica o efeito estufa, que prolonga secas e favorece novos incêndios.`],
      },
    ],
    traps: [
      { trap: md`Tratar "coletado" e "tratado" como a mesma coisa.`, fix: md`Leia o rótulo de cada coluna.` },
      { trap: md`Atribuir os incêndios só a causas naturais.`, fix: md`A maior parte tem origem humana; o clima agrava a propagação.` },
    ],
  },
};
