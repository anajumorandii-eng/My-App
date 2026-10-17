/** Sínteses didáticas apoiadas nos módulos publicados dos dossiês.
 * Não acrescentam citações, páginas, frequência de cobrança ou rubricas oficiais.
 * A exibição depende da publicação do módulo de análise da própria obra. */
export interface WorkStudyGuide {
  title: string;
  sections: { title: string; text: string }[];
  strategy: string[];
  pitfalls: string[];
}
export const workStudyGuides: Record<string, WorkStudyGuide> = {
  'a-vida-nao-e-util': {
    title: 'A vida não é útil',
    sections: [
      { title: 'O percurso do argumento', text: 'Os cinco textos retomam, por caminhos diferentes, a separação entre uma humanidade que se considera central e as outras formas de vida. A crítica à utilidade questiona a redução da existência a produção, consumo e desempenho. Dinheiro e tecnologia não aparecem isoladamente: entram num modo de organizar a vida que transforma seres e territórios em recursos. Por isso, o título não recomenda inatividade; desloca a pergunta sobre o valor da vida para além da finalidade econômica.' },
      { title: 'Como a forma sustenta a tese', text: 'A origem em falas, entrevistas e encontros ajuda a compreender a interlocução, as retomadas e as imagens concretas. Memória pessoal, narrativas indígenas e referências culturais funcionam como modos de pensar, não como ornamentos de uma tese abstrata. Sonhar, envolver-se e pisar leve abrem alternativas de relação com a Terra. Na leitura de uma passagem, é preciso explicar o que a imagem faz o interlocutor perceber antes de reduzi-la a uma palavra-chave como sustentabilidade.' },
      { title: 'Pandemia, desigualdade e limites da generalização', text: 'O contexto de 2020 torna visíveis a vulnerabilidade e a distribuição desigual da proteção. A recusa de voltar automaticamente à normalidade exige perguntar quem era beneficiado por ela. O livro articula crítica social e crítica ambiental, em vez de tratar natureza como cenário separado das pessoas. As formulações de Krenak devem ser lidas no argumento de cada ensaio; não constituem uma única voz que represente todos os povos indígenas.' },
    ],
    strategy: ['Em cada ensaio, escreva tese, interlocutor e uma imagem que faça o argumento avançar.', 'Escolha um contraste, como desenvolver/envolver, e explique o que muda na relação com a Terra em cada termo.', 'Numa questão, reconstrua a função do exemplo antes de relacioná-lo ao problema ambiental ou ao contexto da pandemia.'],
    pitfalls: ['Confundir crítica à utilidade com defesa de não fazer nada.', 'Substituir a leitura do argumento por um discurso ambiental genérico ou tratar povos indígenas como homogêneos.'],
  },
  'balada-de-amor-ao-vento': {
    title: 'Balada de Amor ao Vento',
    sections: [
      { title: 'Da lembrança amorosa à sobrevivência', text: 'Sarnau narra a vida a partir de uma posição de envelhecimento e trabalho no mercado. O amor por Mwando, o casamento com Nguila, a posição de primeira esposa, a fuga e os abandonos não formam apenas uma sequência sentimental: cada passagem altera suas condições materiais e sua margem de escolha. A distância entre a mulher que viveu e a mulher que conta permite ouvir afeto, cobrança e avaliação na mesma lembrança.' },
      { title: 'Duas trajetórias e uma narração dirigida a ouvintes', text: 'A primeira pessoa de Sarnau convive com capítulos em terceira pessoa dedicados a Mwando. A mudança amplia o campo de informação e impede presumir que tudo seja testemunhado por ela. A oralidade se constrói pela interlocução e pelos modos de organizar a experiência. Provérbios e valores comunitários podem aconselhar, mas também legitimar desigualdades: reconhecer uma forma tradicional não dispensa examinar seu efeito na situação concreta.' },
      { title: 'Casamento, religião e mundo colonial', text: 'Lobolo, poligamia e honra interferem no corpo, no trabalho e nos vínculos de Sarnau. O cristianismo e a monogamia tampouco oferecem uma libertação automática. A trajetória de Mwando e a deportação para Angola inserem coerção colonial e trabalho na história amorosa. O reencontro final deve ser relacionado às exigências e perdas acumuladas, sem converter o romance numa vitória simples do amor sobre todas as estruturas.' },
    ],
    strategy: ['Monte duas linhas de acontecimentos, Sarnau e Mwando, e assinale as mudanças de pessoa narrativa.', 'Escolha uma decisão de Sarnau e enumere suas alternativas reais, custos e dependências naquele momento.', 'Ao comentar um provérbio ou uma referência matrimonial, explique quem o mobiliza e que relação de poder ele sustenta.'],
    pitfalls: ['Tratar tradição africana como realidade única e imóvel.', 'Ler o reencontro como resolução completa da violência ou supor que monogamia equivale a emancipação.'],
  },
  'bras-cubas': {
    title: 'Memórias póstumas de Brás Cubas',
    sections: [
      { title: 'Uma vida reorganizada depois da morte', text: 'Brás começa pelo óbito e interrompe a vida narrada com digressões, teorias e provocações. O emplasto reúne a promessa de benefício público e a vontade de reconhecimento. Infância, relações amorosas, ambição política e convivência com dependentes aparecem selecionadas por quem controla a narrativa. Reconstruir os fatos ajuda, mas a ordem escolhida pelo defunto é parte essencial do sentido: ele pode adiar, abreviar e trocar a direção do relato.' },
      { title: 'O narrador como problema de leitura', text: 'A condição de morto não torna Brás imparcial. Seu discurso pode apresentar um gesto como generoso e deixar transparecer cálculo, vaidade ou privilégio. A leitura precisa separar acontecimento, explicação do narrador e indício que permite questioná-la. A conversa com o leitor também é uma relação de controle: elogios, broncas e mudanças de assunto orientam a atenção e testam a disposição de aceitar a versão oferecida.' },
      { title: 'Forma fragmentada e relações sociais', text: 'Prudêncio, D. Plácida e o almocreve permitem examinar como dependência, escravidão e desigualdade atravessam pequenas cenas. Não basta rotular o romance como crítica à sociedade: é necessário mostrar quem pode decidir, como o outro é descrito e que justificativa encobre o benefício de Brás. O Humanitismo e o balanço final entram nessa investigação como construções paródicas e avaliações interessadas. Capítulos curtos e interrupções não são ausência de composição; são instrumentos dela.' },
    ],
    strategy: ['Faça uma ficha com três colunas: fato narrado, juízo de Brás e detalhe que complica esse juízo.', 'Compare o tratamento dado a Prudêncio, D. Plácida e ao almocreve usando o mesmo eixo de dependência e reconhecimento.', 'Numa questão sobre ironia, identifique primeiro a discrepância e depois explique seu efeito, em vez de apenas escrever que o narrador é irônico.'],
    pitfalls: ['Tomar a morte como garantia de sinceridade ou neutralidade.', 'Confundir Machado com Brás ou apresentar o Humanitismo como tese defendida pelo romance.'],
  },
  'caminho-de-pedras': {
    title: 'Caminho de Pedras',
    sections: [
      { title: 'Duas histórias que se atravessam', text: 'A reorganização de um grupo comunista em Fortaleza e o vínculo entre Roberto e Noemi avançam juntos. A oposição entre intelectuais e operários revela disputas dentro do projeto de transformação social. Ao mesmo tempo, a mulher casada que busca outra relação encontra julgamento, instabilidade econômica e conflito em torno do filho. O romance torna insuficiente separar uma trama política importante de uma trama amorosa secundária.' },
      { title: 'Perspectivas, contradições e custo material', text: 'A terceira pessoa se aproxima de consciências diferentes, especialmente Roberto, Noemi e Filipe. O discurso indireto livre exige localizar de quem são as avaliações, sem atribuir todo pensamento à posição do narrador. A promessa de emancipação pode conviver com práticas conservadoras dentro do próprio grupo. Emprego, dinheiro, moradia e cuidado com o Guri fazem a liberdade chegar ao corpo e à rotina, em vez de permanecer palavra de ordem.' },
      { title: 'Perdas e continuidade sem solução pronta', text: 'Prisões, partidas e a morte do Guri impedem uma linha simples de progresso rumo à libertação. A experiência de Noemi reúne desejo de autonomia e perdas que a organização política não resolve. O final em aberto pede atenção à continuidade da vida e à precariedade das condições, sem transformar sofrimento em punição moral pelo adultério. A análise ganha força quando liga uma escolha de focalização a um desses impasses.' },
    ],
    strategy: ['Leia cada episódio em duas colunas: organização política e consequências na vida privada.', 'Marque expressões de avaliação e identifique a consciência à qual pertencem.', 'Para explicar a emancipação de Noemi, apresente uma possibilidade conquistada e um custo concreto que permanece.'],
    pitfalls: ['Reduzir o livro a propaganda partidária ou a um triângulo amoroso.', 'Interpretar a morte do filho como punição moral imposta à protagonista.'],
  },
  'cancao-para-ninar-menino-grande': {
    title: 'Canção para Ninar Menino Grande',
    sections: [
      { title: 'Um homem reconstruído por histórias de mulheres', text: 'Fio Jasmim atravessa cidades como maquinista e deixa relações por onde passa. A história não chega por um relato linear e autossuficiente do conquistador: uma narradora recompõe o que ouviu de Tina e de uma rede de mulheres. Os capítulos deslocam o centro entre experiências femininas distintas. O título anuncia Fio, mas a composição questiona seu poder de definir sozinho o significado dos encontros.' },
      { title: 'Escuta, desejo e diferença', text: 'As mulheres não são variações de um único papel de vítima ou amante. Seus desejos, decisões e circunstâncias precisam ser distinguidos, assim como o silêncio de Pérola Maria e a longa ligação de Tina com Fio. O menino grande reúne força socialmente atribuída ao masculino e dependência afetiva. A narração por histórias recebidas torna a escuta uma escolha formal: importa reconhecer quem conta, quem escuta e como a versão foi transmitida.' },
      { title: 'Mudança sem apagar o passado', text: 'A partida de Tina e o vazio de Fio devem ser relacionados às trajetórias anteriores, sem fazer do final uma cura automática do personagem. A confraria desloca a história individual para uma elaboração coletiva. As molduras da edição também pedem cuidado: um texto assinado pela autora é paratexto autoral, enquanto a narradora pertence ao romance. Escrevivência ajuda a pensar experiência e invenção; não autoriza identificar diretamente todas as vozes com Conceição Evaristo.' },
    ],
    strategy: ['Registre por capítulo quem vive a experiência, quem a transmite e quem a reconta.', 'Compare duas mulheres indicando escolhas e condições diferentes, não apenas a relação de ambas com Fio.', 'Relacione o título à trajetória de Tina e ao descentramento da versão masculina.'],
    pitfalls: ['Aceitar a autoimagem de Fio como verdade da narrativa.', 'Confundir narradora, autora e paratextos ou homogeneizar todas as mulheres.'],
  },
  'cancoes-escolhidas-14-letras': {
    title: 'Canções escolhidas — 14 letras',
    sections: [
      { title: 'Uma seleção, diferentes situações de fala', text: 'As quatorze letras de Paulo César Pinheiro não compõem um único enredo. Há viagem, solidão amorosa, memória histórica, repressão e resistência. Para perceber o conjunto, é mais útil comparar modos de enunciar do que procurar uma mensagem idêntica em todas as canções. Um eu que lembra um amor, uma voz coletiva e uma voz que encena poder produzem posições de leitura diferentes.' },
      { title: 'Imagens que fazem o texto avançar', text: 'Estrela, vento, muro, ponte e desfile não devem virar um dicionário de símbolos fixos. É a sequência da letra que determina como a imagem transforma obstáculo em passagem, medo em resistência ou festa em confronto. Paralelismo, antítese e repetição organizam essas relações. A análise precisa acompanhar uma mudança entre versos ou estrofes e explicar o que ela faz à expectativa do leitor.' },
      { title: 'História e canção sem atalhos', text: 'A memória dos vencidos e a resistência à repressão permitem relacionar linguagem e história. Esse contexto esclarece os conflitos, mas não substitui a leitura do que está escrito. A letra integra uma canção: melodia, arranjo e interpretação podem ampliar efeitos quando efetivamente escutados. Se a questão fornece apenas o texto, a resposta deve apoiar-se nele, sem inventar características musicais nem identificar automaticamente o eu lírico com o compositor.' },
    ],
    strategy: ['Para cada letra, anote voz, destinatário, imagem organizadora e mudança final.', 'Compare duas letras por um recurso preciso, como repetição ou oposição entre imagens, explicando efeitos distintos.', 'Separe o que a letra permite demonstrar do que exigiria ouvir uma gravação específica.'],
    pitfalls: ['Tratar a seleção como romance ou como um único poema contínuo.', 'Afirmar ritmo musical, arranjo ou interpretação sem fonte sonora fornecida.'],
  },
  'funerais-da-mamae-grande': {
    title: 'Os funerais da Mamãe Grande',
    sections: [
      { title: 'Oito contos, conflitos que se aproximam', text: 'A coleção reúne histórias autônomas: a visita de uma mãe ao túmulo do filho, um confronto no consultório de um dentista, a circulação de objetos e dinheiro, relações domésticas e a cerimônia que dá título ao volume. Não é necessário forçar todos os episódios a uma sequência única. A leitura do conjunto pode acompanhar como vergonha, prestígio, propriedade e violência distribuem posições dentro das comunidades.' },
      { title: 'Quem fala muda a medida do acontecimento', text: 'A economia de informação de um conto e a amplificação cerimonial de outro produzem efeitos distintos. O leitor precisa observar o acesso ao pensamento, o que é deixado em silêncio e o modo de apresentar autoridades. Em vez de classificar qualquer situação incomum como realismo mágico e encerrar a análise, convém demonstrar como o insólito, o exagero ou o contraste são construídos naquele texto.' },
      { title: 'Poder público, vida privada e julgamento', text: 'O poder aparece em relações concretas, não somente em discursos institucionais. Um atendimento, uma visita, uma negociação e um funeral fazem circular dependência e reconhecimento. No conto-título, a dimensão do rito pede comparação entre a importância proclamada e os interesses que a cerimônia reúne. Em outros contos, gestos pequenos e silêncios sustentam a tensão. A aproximação deve preservar essas diferenças de escala e composição.' },
    ],
    strategy: ['Faça oito fichas separadas: situação inicial, virada, voz e relação de poder.', 'Compare a contenção de um gesto em um conto com a amplificação do rito no conto-título.', 'Para analisar uma autoridade, mostre como ela aparece numa ação ou troca verbal e como a narração orienta o julgamento.'],
    pitfalls: ['Resumir toda a coleção pelo conto que lhe dá título.', 'Usar realismo mágico como explicação universal ou supor que todas as vozes avaliam os fatos do mesmo modo.'],
  },
  'geografia': {
    title: 'Geografia',
    sections: [
      { title: 'Uma organização por espaços e relações', text: 'As sete partes não contam a viagem contínua de uma personagem. Lugares como o Algarve, o Mediterrâneo e o Brasil convivem com casa, noite, ausência e reflexão sobre o poema. O título permite ler uma geografia de relações: a forma de perceber o exterior interfere na experiência íntima e na avaliação do mundo. Mar, luz, cal e pedra reaparecem, mas sua função deve ser demonstrada em cada poema.' },
      { title: 'Nomear, perceber e construir uma medida', text: 'A atenção a coisas concretas não produz um inventário neutro da paisagem. Escolhas de imagens, ritmo, contraste e organização verbal constroem nitidez, tensão ou perda. A Grécia e o Mediterrâneo entram nessa busca de medida, sem tornar todos os poemas ilustrações de uma ideia clássica pronta. Na análise, importa explicar como a disposição das palavras torna um espaço perceptível e que posição o eu lírico assume diante dele.' },
      { title: 'Intimidade e dimensão política', text: 'Cidade corrompida, povo humilhado e referências à violência histórica convivem com experiências de ausência e memória. Exterior e interior não precisam ser polos excludentes: a maneira de habitar e nomear o mundo pode também ser uma resposta ética. Para estudar o livro, preserve a diferença entre partes e poemas. O volume da edição reúne ainda O Cristo Cigano, mas esse outro título não deve ser incorporado ao recorte de Geografia.' },
    ],
    strategy: ['Monte um mapa das sete partes com uma imagem e uma tensão de cada uma.', 'Ao encontrar mar ou luz, descreva sua função no poema antes de atribuir um sentido universal.', 'Em uma comparação, use o mesmo eixo, como nomeação do espaço, e mostre o que muda na posição da voz lírica.'],
    pitfalls: ['Transformar paisagem em descrição apenas decorativa.', 'Misturar Geografia e O Cristo Cigano ou supor que todo eu lírico seja a autora em relato direto.'],
  },
  'gonzaga-de-sa': {
    title: 'Vida e morte de M. J. Gonzaga de Sá',
    sections: [
      { title: 'Uma biografia que também retrata o biógrafo', text: 'Augusto Machado escreve a vida de Gonzaga, mas sua seleção de encontros, falas e lembranças revela também o modo como o próprio narrador procura compreender o mundo. A morte aparece cedo: o interesse se desloca do suspense sobre o desfecho para o valor de uma existência sem grande reconhecimento público. Advertência e Explicação necessária integram esse problema de enquadramento, em vez de serem introduções dispensáveis.' },
      { title: 'O passeio como forma de conhecer a cidade', text: 'Caminhar, conversar e observar articulam episódios, memória urbana e reflexão social. A cidade não é apenas o fundo em que dois homens se encontram; seus espaços e emblemas distribuem visibilidade, poder e prestígio. A composição biográfica é atravessada por digressões e cenas, de modo que cultura e inteligência precisam ser relacionadas à experiência concreta de quem não ocupa o centro da vida oficial.' },
      { title: 'Reconhecimento, solidariedade e limites da voz', text: 'Os vínculos de cuidado complicam uma leitura de Gonzaga como simples homem isolado ou fracassado. A relação entre saber, obscuridade e atenção aos outros torna-se um eixo de avaliação da vida. Entretanto, falas de Gonzaga, comentários de Augusto e posição de Lima Barreto não são intercambiáveis. Uma resposta precisa marcar essas mediações e sustentar a interpretação com a cena efetivamente narrada.' },
    ],
    strategy: ['Separe em cada episódio o que Gonzaga diz e o que Augusto seleciona ou comenta.', 'Relacione um espaço percorrido a um mecanismo de reconhecimento ou exclusão.', 'Explique por que anunciar a morte cedo desloca o foco da narrativa para a construção do valor de uma vida.'],
    pitfalls: ['Confundir o biógrafo ficcional com o autor.', 'Ler o passeio como digressão inútil ou a obscuridade como ausência de vínculos e ação.'],
  },
  'memorias-de-martha': {
    title: 'Memórias de Martha',
    sections: [
      { title: 'Formação, trabalho e dependência', text: 'Martha adulta reconstitui a passagem da infância pobre no cortiço à escolarização e ao trabalho como professora. A trajetória não se esgota numa história de superação individual: o cuidado e o esforço da mãe sustentam possibilidades que a filha nem sempre reconhece no momento vivido. Amor frustrado, concurso, nomeação e casamento reorganizam expectativas de autonomia e reconhecimento.' },
      { title: 'Dois tempos no mesmo relato', text: 'A menina sente vergonha, desejo e medo; a mulher que escreve pode comentar, corrigir ou reinterpretar essas experiências. Esse desnível impede tomar cada reação infantil como avaliação definitiva do romance. Objetos e gestos recorrentes, como espelho, vestido e esmola, ajudam a localizar o que muda com a posição social e o que continua. Memória, portanto, é seleção e julgamento, não reprodução transparente do passado.' },
      { title: 'A instrução abre caminhos, mas não resolve tudo', text: 'Educação e trabalho ampliam a margem de ação de Martha, sem abolir preconceitos de classe e expectativas sobre as mulheres. O casamento sem paixão deve ser lido nesse conjunto de escolhas situadas, em vez de reduzir o romance a uma condenação ou celebração abstrata da instituição. A relação com a mãe e com o espaço de origem permite medir as dívidas afetivas e os limites da mobilidade conquistada.' },
    ],
    strategy: ['Registre a reação da menina e o comentário da narradora adulta em duas colunas.', 'Siga um objeto recorrente e mostre como muda de função conforme a posição social de Martha.', 'Ao discutir autonomia, relacione instrução, salário, vínculo com a mãe e condições do casamento.'],
    pitfalls: ['Chamar a trajetória de ascensão sem perdas nem contradições.', 'Confundir o julgamento da menina com a reflexão da narradora madura.'],
  },
  'morangos-mofados': {
    title: 'Morangos mofados — seis contos',
    sections: [
      { title: 'O recorte e as experiências de desencontro', text: 'O percurso de estudo cobre os seis contos exigidos no recorte cadastrado, não todos os textos do livro. Solidão, desejo e dificuldade de comunicação aproximam as narrativas, mas não apagam suas diferenças. Há diálogo sem identificação completa, busca de um destinatário, encontro sob ameaça e intimidade observada por terceiros. A incerteza sobre o que pode ser dito ou reconhecido é parte da experiência construída.' },
      { title: 'A forma dá corpo à hesitação', text: 'Diálogo puro, períodos longos, continuidade de um parágrafo, repetição e intervenção do narrador não são apenas marcas de estilo. Eles podem produzir aproximação frustrada, urgência, espera ou descompasso. É necessário localizar o procedimento em cada conto. As letras A e B de Diálogo não fixam por si mesmas nomes e gênero; uma leitura de desejo deve distinguir o que o texto explicita daquilo que permite propor como hipótese.' },
      { title: 'Intimidade, repressão e olhar coletivo', text: 'Terça-feira gorda e Aqueles dois permitem analisar a violência contra o desejo ou a intimidade entre homens, com formas de narração diferentes. O contexto de desencanto e repressão auxilia a leitura, mas não substitui a observação das cenas. Imagens como porta, frutas, planetas e pássaro precisam ser relacionadas à situação de enunciação. Ambiguidade não é um defeito a eliminar por uma biografia inventada para as personagens.' },
    ],
    strategy: ['Faça uma ficha por conto com voz, situação de comunicação, imagem e desfecho.', 'Classifique uma afirmação como explícita, inferida com indícios ou não sustentada antes de usá-la na resposta.', 'Compare dois desencontros pelo modo de narrar, preservando a diferença entre silêncio, repressão e violência.'],
    pitfalls: ['Estender o recorte de seis contos automaticamente a todo o livro.', 'Fixar identidade ou gênero onde o texto os mantém abertos ou reduzir toda ambiguidade à biografia do autor.'],
  },
  'nebulosas': {
    title: 'Nebulosas',
    sections: [
      { title: 'Entre expressão íntima e fala pública', text: 'O livro articula melancolia, saudade, natureza e morte com liberdade, escravidão e vida política. Não é preciso escolher entre uma poeta intimista e uma poeta pública: a leitura ganha densidade ao mostrar onde esses campos se cruzam. O vocabulário e as formas românticas ajudam a compor uma voz que sofre, imagina, se dirige a outros e disputa reconhecimento.' },
      { title: 'A vocação poética como questão do próprio livro', text: 'A dificuldade de escrever e ser reconhecida sendo mulher integra a construção da voz, em vez de funcionar somente como informação biográfica. Epígrafes, homenagens e interlocuções situam diálogos literários; é preciso examinar como cada poema os utiliza. O eu lírico não se converte automaticamente em depoimento factual de Narcisa Amália, mesmo quando a condição da poeta ajuda a compreender o problema histórico.' },
      { title: 'Liberdade, festa e contradição', text: 'A poesia pública torna possível relacionar defesa da liberdade e denúncia da escravidão, mas cada gesto de enunciação exige leitura própria. A festa pode ser confrontada com sofrimento e exclusão, de modo que o tom não se resume a celebração. Os quatro percursos do aplicativo são agrupamentos didáticos: o segundo e o terceiro subdividem a Segunda parte. Eles orientam o conjunto e não substituem a leitura individual dos poemas.' },
    ],
    strategy: ['Separe tema, interlocutor e tom, procurando depois o ponto em que o íntimo encontra o público.', 'Leia a epígrafe junto ao poema e explique uma relação demonstrável entre as duas vozes.', 'Num poema sobre liberdade, mostre a escolha de linguagem que transforma um ideal em posição de fala.'],
    pitfalls: ['Usar características do Romantismo como resposta pronta para qualquer poema.', 'Tratar os quatro percursos didáticos como divisões autorais ou como análise individual de todos os poemas.'],
  },
  'no-seu-pescoco': {
    title: 'No seu pescoço',
    sections: [
      { title: 'Doze contos, mobilidades desiguais', text: 'As narrativas são autônomas e aproximam experiências atravessadas por gênero, classe, raça, língua e deslocamento. Mudar de país não significa simplesmente abandonar uma identidade e receber outra: documentos, dinheiro, nome, trabalho e relações afetivas interferem nas possibilidades de ação. A leitura do conjunto precisa preservar a situação particular de cada personagem e não transformar uma trajetória em retrato único da Nigéria ou da diáspora.' },
      { title: 'Perspectiva e distribuição de informação', text: 'Em A cela um, o conhecimento da irmã é limitado; em Uma experiência privada, antecipações fazem o leitor saber o que Chika ainda ignora. A segunda pessoa de determinados contos reorganiza aproximação e distância em relação às protagonistas. Esses recursos não são adornos de uma mensagem social já pronta: fazem o leitor experimentar limites do saber e diferenças de poder. A pergunta sobre quem pode narrar reaparece também nas situações de escrita e reconhecimento.' },
      { title: 'Poder nos gestos e nas versões', text: 'Uma exigência sobre nome, uma resposta num encontro ou uma decisão diante de uma instituição pode tornar visível uma hierarquia. A interpretação deve acompanhar a cena, em vez de tratar imigração, racismo ou machismo como explicações que dispensam o texto. No conjunto, recusar uma demanda e contar uma história são possibilidades desigualmente distribuídas. O efeito de cada final depende da informação oferecida e do que permanece fora da perspectiva adotada.' },
    ],
    strategy: ['Mapeie por conto quem percebe, o que ignora e o que o leitor sabe a mais.', 'Analise um gesto relacionado a nome, dinheiro, documento ou língua como relação de poder concreta.', 'Ao comparar contos, fixe um recurso de voz ou distribuição de informação, em vez de apenas dizer que ambos tratam de imigração.'],
    pitfalls: ['Transformar doze contos em uma biografia contínua.', 'Tomar uma personagem como representante de uma cultura inteira ou confundir narrador e autora.'],
  },
  'olhos-dagua': {
    title: 'Olhos d’água',
    sections: [
      { title: 'A moldura de memória e continuidade', text: 'O conjunto abre com a busca da cor dos olhos da mãe e termina com o nascimento de Ayoluwa. Entre essas pontas, mulheres, crianças e jovens atravessam pobreza, violência, desejo e cuidado. A moldura não elimina os finais de morte: põe transmissão e continuidade em tensão com o luto. No conto-título, a pergunta passa da narradora à filha; no encerramento, a chegada da criança se torna tarefa de uma comunidade.' },
      { title: 'Interioridade em vez de inventário de violência', text: 'A proximidade com pensamentos e sensações impede reduzir as personagens a exemplos de uma estatística. Em Maria, o leitor conhece vínculos afetivos que os passageiros do ônibus ignoram; a diferença de informação ajuda a reconhecer a violência da acusação. Natalina exige distinguir maternidade biológica, imposição e escolha. Essas diferenças de perspectiva e trajetória precisam aparecer no resumo para que o tema social não apague a construção singular de cada conto.' },
      { title: 'Forma verbal, vozes e elaboração da experiência', text: 'Repetições, neologismos, oralidade e imagens que retornam no desfecho articulam afeto e violência. Em A gente combinamos de não morrer, a alternância de vozes aproxima pacto, medo, memória familiar e escrita. A concordância do título participa da enunciação coletiva, sem ser um lapso a corrigir. A escrevivência permite pensar experiência social e invenção literária, mas não torna narradoras e personagens cópias imediatas da autora.' },
    ],
    strategy: ['Para cada conto, identifique centro de percepção, revelação final e uma imagem que muda de sentido.', 'Compare abertura e encerramento do volume mostrando continuidade sem apagar as mortes dos outros contos.', 'Explique um neologismo ou repetição pela relação entre afeto, violência e voz, apoiando-se na passagem escolhida.'],
    pitfalls: ['Reduzir todas as mulheres a vítimas sem desejo nem decisão.', 'Tratar oralidade como erro ou a esperança final como cancelamento da violência.'],
  },
  'opusculo-humanitario': {
    title: 'Opúsculo humanitário',
    sections: [
      { title: 'A educação das mulheres como problema coletivo', text: 'O ensaio defende a educação feminina e a relaciona à organização social. O percurso passa por história, comparação entre países e crítica ao Brasil, para distribuir responsabilidades entre governo, famílias e instituições. Não há um enredo ficcional a reconstruir: resumir bem significa acompanhar como uma tese é sustentada, a quem se dirige e que objeções procura vencer.' },
      { title: 'Um argumento que muda de interlocutor', text: 'Apóstrofes, exemplos históricos, comparações e dados constroem uma intervenção dirigida a leitores específicos. A distinção entre instrução e educação impede reduzir a proposta a acumular informações. O problema envolve formação moral, práticas domésticas e lugar da mulher na sociedade. Em cada passagem, a pergunta produtiva é por que aquele exemplo seria persuasivo para o interlocutor convocado, e não apenas qual assunto está sendo tratado.' },
      { title: 'Denúncia e limites históricos no mesmo texto', text: 'A crítica à sociedade patriarcal e à escravidão convive com moral cristã, hierarquias sociais e preconceitos da época. Reconhecer esses limites não elimina a intervenção de Nísia Floresta; evita atribuir ao ensaio um programa contemporâneo que ele não formula. Os sete percursos do aplicativo agrupam os 62 capítulos para orientar a leitura. Não equivalem a sete partes autorais nem a uma análise individual completa de cada capítulo.' },
    ],
    strategy: ['Em cada percurso, registre tese parcial, destinatário e procedimento de convencimento.', 'Escolha uma comparação histórica e explique a conclusão que ela pretende legitimar sobre o Brasil.', 'Numa resposta crítica, apresente lado a lado uma denúncia e uma hierarquia que o próprio texto conserva.'],
    pitfalls: ['Ler o ensaio como romance ou identificar instrução e educação sem distinção.', 'Atribuir uma defesa irrestrita de igualdade contemporânea ou esquecer a natureza didática dos agrupamentos.'],
  },
  'paixao-segundo-gh': {
    title: 'A Paixão segundo G.H.',
    sections: [
      { title: 'Poucos gestos, uma experiência reconstruída', text: 'G.H. decide arrumar o quarto deixado por Janair, encontra o desenho na parede e uma barata no guarda-roupa. O golpe contra o inseto abre uma crise que excede a ação externa. A narradora conta no dia seguinte, dirigindo-se a uma mão imaginada: o romance é também a tentativa de dar forma posterior ao acontecido. Não basta resumir que uma mulher encontra uma barata e sofre uma revelação.' },
      { title: 'O quarto e o limite do olhar da patroa', text: 'A experiência começa num espaço doméstico que G.H. julgava conhecer sem realmente ter olhado. Janair e o mural introduzem uma relação social dentro do percurso existencial. A voz da ex-empregada, entretanto, não se torna diretamente disponível: o leitor a alcança pelas reconstruções de G.H. A análise deve perguntar o que a patroa reconhece, projeta ou ainda não pode saber, em vez de transformar sua interpretação em acesso total à outra mulher.' },
      { title: 'Linguagem, despersonalização e revisão', text: 'O encadeamento das seções pela repetição de frases faz a experiência avançar por retomadas. Contradições, imagens religiosas deslocadas e palavras como neutro e insosso testam os limites da identidade organizada e da linguagem. O gesto extremo associado à massa da barata tem seu instante em elipse e seu significado posteriormente revisto. A narrativa não oferece uma iluminação estável que possa ser traduzida numa lição única de autoajuda.' },
    ],
    strategy: ['Separe a sequência de ações no quarto da sequência em que G.H. as compreende ao narrar.', 'Siga uma frase repetida entre duas seções e explique o que a retomada altera.', 'Ao comentar Janair ou a barata, distinga o que a cena apresenta e o que a narradora projeta ou revê.'],
    pitfalls: ['Apagar classe e espaço doméstico para ler apenas uma crise abstrata.', 'Transformar o ato extremo em clímax descrito sem elipse ou a experiência em conclusão definitiva.'],
  },
  'prosas-seguidas-de-odes-minimas': {
    title: 'Prosas seguidas de Odes mínimas',
    sections: [
      { title: 'Duas partes, duas formas de tornar pequeno o que importa', text: 'As Prosas reconstroem infância, juventude, retratos familiares e encontros; as Odes mínimas dirigem um gênero elevado a objetos e situações cotidianos. A divisão muda a escala de observação sem romper necessariamente o livro. Uma lembrança breve e um objeto comum podem concentrar perda, humor e crítica. O estudo do conjunto deve preservar as vinte Prosas e as treze Odes como textos distintos.' },
      { title: 'Memória e desnível entre tempos', text: 'O adulto que recompõe a cena pode perceber o que a criança não compreendia. Esse desnível produz avaliação e ironia, não apenas nostalgia. A proximidade entre crônica, narrativa e poema exige atenção à condensação, à seleção do detalhe e ao fechamento. Identificar uma experiência biográfica possível não resolve a leitura: a voz organiza a lembrança para produzir um efeito no presente da enunciação.' },
      { title: 'A ode deslocada e os limites do riso', text: 'Bengala, óculos, garrafa, televisão e shopping recebem atenção que altera a expectativa de solenidade. O contraste pode criticar consumo e automatismos, mas também acolher vulnerabilidade e perda, como no endereçamento à perna esquerda. Nem todo poema termina numa piada. A passagem do túmulo ao recém-nascido permite pensar continuidade e finitude sem impor um progresso linear a todas as unidades.' },
    ],
    strategy: ['Nas Prosas, escreva o que a criança percebe e o que a voz adulta acrescenta.', 'Nas Odes, identifique o objeto, a expectativa do gênero e o efeito do desnível entre ambos.', 'Compare um texto de memória e uma ode por um detalhe concreto, indicando onde o humor cede lugar à perda ou à crítica.'],
    pitfalls: ['Supor que o título Prosas resolve sozinho a classificação formal.', 'Reduzir todos os poemas a humor ou ler a voz do texto como registro biográfico transparente.'],
  },
  'visao-das-plantas': {
    title: 'A Visão das Plantas',
    sections: [
      { title: 'Um regresso que não apaga a vida anterior', text: 'O capitão Celestino, ligado ao tráfico de escravizados e à violência, volta e passa a cultivar um jardim. A habilidade de cuidar das plantas convive com crimes e lembranças, sem que uma atividade substitua automaticamente a outra. Rumores, relatos às crianças, caderno, fantasmas e velhice fazem o passado retornar por formas diferentes. A epígrafe de Raul Brandão estabelece uma relação de reescrita que participa desse enquadramento.' },
      { title: 'Ver não é julgar do mesmo modo', text: 'O título desloca a atenção para uma visão que não coincide com a consciência humana. A indiferença das plantas não significa um certificado moral para o capitão. O leitor precisa distinguir a tranquilidade de uma personagem, a composição narrativa e o próprio julgamento. O contraste entre beleza do quintal e brutalidade do passado mantém uma tensão que uma explicação pronta de redenção faria desaparecer.' },
      { title: 'Fragmentos, memória e ausência de tribunal', text: 'Blocos narrativos e anotações não oferecem um processo judicial com veredito final. O que é lembrado, narrado, omitido ou pressentido interfere na leitura da responsabilidade. O cuidado pode ser também relação de propriedade e controle, hipótese a sustentar por cenas concretas. As doze partes do dossiê são recortes didáticos de uma obra sem capítulos numerados, e não uma divisão criada pela autora.' },
    ],
    strategy: ['Monte uma coluna de gestos de cuidado e outra de vestígios da violência, sem fazer uma anular a outra.', 'Separe quem observa, quem julga e o que a narração deixa sem resposta.', 'Compare epígrafe, caderno e relato narrativo como formas distintas de enquadrar o capitão.'],
    pitfalls: ['Concluir que o jardim prova arrependimento ou redenção.', 'Tratar a indiferença vegetal como aprovação moral ou os recortes didáticos como capítulos autorais.'],
  },
};
