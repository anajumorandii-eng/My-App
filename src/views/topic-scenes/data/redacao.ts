import type { SceneEntry } from '../types';

/** Capitulos de Redacao (Fase 5). Inventario concluido em
 *  docs/visual-personalizado/13-familias-redacao.md - a atribuicao de familia
 *  (ou lacuna) para os 58 capitulos ja foi decidida ali a partir da leitura
 *  integral de deepSummaryContent.json (subject === 'Redacao'). Esta tarefa
 *  cobriu so o inventario: as entradas de SceneEntry (question, items, quote
 *  literal por item) ficam para a tarefa seguinte. */
export const redacao: SceneEntry[] = [];

/** Capitulos sem cena-ancora, com o motivo especifico ao conteudo de cada
 *  um (nunca generico) - ver docs/visual-personalizado/13-familias-redacao.md
 *  para o raciocinio completo por tras de cada atribuicao. */
export const redacaoSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-redacao-a-dissertacao-no-vestibular-mitos-e-verdades',
    motivo: 'desmistifica exigências pontuais (número de linhas, uso de primeira pessoa, valor da citação) e compara critérios de bancas diferentes (Enem, Fuvest, Unicamp) lado a lado como informações institucionais equivalentes — não há rivalidade teórica entre elas (nenhuma é rejeitada em favor de outra, cada banca é simplesmente diferente) nem tipologia com guarda-chuva, é checklist de mitos a verificar no edital.',
  },
  {
    chapterId: 'summary-redacao-o-que-se-avalia-na-dissertacao-competencias-e-habilidades',
    motivo: 'as cinco competências do Enem são dimensões de avaliação simultâneas, cada uma valendo até 200 pontos de forma independente e cumulativa, não uma escala ordenada de graus nomeados nem tipos coexistentes com guarda-chuva nem elos causais entre si.',
  },
  {
    chapterId: 'summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps',
    motivo: 'é um procedimento de planejamento em etapas (brainstorm dirigido por perguntas, depois mapa mental, depois seleção) — sequência de método de estudo aplicada pelo próprio candidato, não uma estrutura testável de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-projeto-de-texto-em-favor-da-progressao-textual',
    motivo: 'apresenta formas de ordenar argumentos ("do mais imediato ao mais estrutural, do local ao global, da causa à consequência") como alternativas equivalentes que o autor escolhe livremente para o mesmo texto, não uma escala fixa de graus nem uma cadeia causal do próprio capítulo.',
  },
  {
    chapterId: 'summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso',
    motivo: 'a dicotomia "produtivo x decorativo" descreve dois usos possíveis do mesmo repertório pelo mesmo autor, não duas posições teóricas rivais sobre um fenômeno nem tipos coexistentes de repertório — é orientação de técnica de escrita.',
  },
  {
    chapterId: 'summary-redacao-qual-sera-o-tema-deste-ano-grandes-eixos-tematicos',
    motivo: 'lista oito eixos temáticos recorrentes (educação e trabalho, saúde e corpo, meio ambiente...) lado a lado, sem guarda-chuva que os declare tipos com propriedade estrutural distintiva cada — é enumeração de áreas de preparo, não tipologia.',
  },
  {
    chapterId: 'summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema',
    motivo: 'descreve tangenciamento e fuga pelos "dois movimentos" que os causam (subir ao eixo geral; descer a um exemplo particular) — mecanismos paralelos de erro de escrita, não um grau adicional distinto dos já cobertos em "Diferentes Graus de Adequação à Proposta" (mesma escala, sem novo degrau nomeado neste capítulo) nem rivalidade nem tipologia com guarda-chuva.',
  },
  {
    chapterId: 'summary-redacao-estrutura-classica-do-texto-dissertativo',
    motivo: 'descreve introdução, desenvolvimento e conclusão como partes sequenciais do mesmo texto que o candidato escreve, não tipos coexistentes de textos, nem estágios de uma escala qualitativa, nem elos causais entre eventos distintos — é sequência de composição.',
  },
  {
    chapterId: 'summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-i',
    motivo: 'é um procedimento de leitura ativa guiado por perguntas (assunto, posição, dado, relação com outros textos) aplicado pelo próprio candidato à coletânea da prova, não uma estrutura de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-ii',
    motivo: 'descreve como ler gráfico, charge e fotografia como habilidades de leitura por formato de material motivador, listadas lado a lado sem guarda-chuva que as una como "tipos" com propriedade estrutural comum — é lista de procedimentos por tipo de mídia, não tipologia de um fenômeno.',
  },
  {
    chapterId: 'summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-i',
    motivo: 'distingue "usar" de "copiar" a coletânea como acerto e erro do mesmo gesto de escrita (reformular vs. transcrever), não uma rivalidade teórica entre posições nem uma tipologia de variantes coexistentes.',
  },
  {
    chapterId: 'summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-ii',
    motivo: 'descreve modos de diálogo com a coletânea (concordar e apontar limite, contrapor dois textos, usar dado para leitura diferente) como opções de técnica argumentativa que o candidato escolhe para o mesmo parágrafo, sem guarda-chuva que os declare tipos coexistentes de um fenômeno externo.',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-meio-ambiente',
    motivo: 'é um banco de repertório para consulta (conceitos, marcos legais, dados) listado por item, sem estrutura de rivalidade, camada assimétrica, tipologia com guarda-chuva, critérios conjuntivos ou derivação causal entre os itens.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-meio-ambiente',
    motivo: 'é um procedimento guiado de montagem de argumento e proposta de intervenção sobre um tema de exemplo (descarte de eletrônicos, crise hídrica) — sequência de composição, não estrutura de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-educacao-e-trabalho',
    motivo: 'mesmo padrão de "Incrementando o Repertório: Meio Ambiente": banco de repertório listado item a item, sem guarda-chuva estrutural que una os conceitos como tipos, camadas ou elos causais.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-educacao-e-trabalho',
    motivo: 'mesmo padrão de "Analisando Tema de Redação: Meio Ambiente": procedimento guiado de montagem de argumento sobre evasão escolar, sequência de composição.',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-temas-abstratos',
    motivo: 'define o que são temas abstratos e lista repertório filosófico e literário disponível (liberdade positiva/negativa, autonomia kantiana, caverna de Platão) como itens de consulta, não tipologia com guarda-chuva que os declare variantes coexistentes de um mesmo fenômeno.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-abstrato-de-redacao',
    motivo: 'descreve um procedimento de estruturação (definir conceito na introdução, mostrar manifestação social, apontar tensão) — sequência de composição para qualquer tema abstrato, não estrutura testável de conteúdo.',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-corpo-saude-e-sexualidade',
    motivo: 'banco de repertório listado item a item (determinantes sociais da saúde, biopoder, SUS), mesmo padrão dos demais capítulos "Incrementando o Repertório", sem guarda-chuva estrutural.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-corpo-saude-e-sexualidade',
    motivo: 'procedimento guiado de montagem de argumento sobre saúde mental juvenil, mesmo padrão dos demais capítulos "Analisando Tema de Redação".',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-violencia-leis-e-punicao',
    motivo: 'banco de repertório (violência estrutural, seletividade penal, encarceramento em massa) listado item a item, sem guarda-chuva estrutural.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-violencia-leis-e-punicao',
    motivo: 'procedimento guiado de montagem de argumento sobre violência contra a mulher, mesmo padrão dos demais capítulos "Analisando Tema de Redação".',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-cidadania-e-poder',
    motivo: 'banco de repertório (gerações de Marshall, cidadania regulada, esfera pública de Habermas) listado item a item, sem guarda-chuva estrutural.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-cidadania-e-poder',
    motivo: 'procedimento guiado de montagem de argumento sobre participação política juvenil, mesmo padrão dos demais capítulos "Analisando Tema de Redação".',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-arte-cultura-e-relacoes-sociais',
    motivo: 'banco de repertório (indústria cultural, capital cultural de Bourdieu, patrimônio material/imaterial) listado item a item, sem guarda-chuva estrutural.',
  },
  {
    chapterId: 'summary-redacao-analisando-o-tema-de-redacao-arte-cultura-e-relacoes-sociais',
    motivo: 'procedimento guiado de montagem de argumento sobre acesso a bens culturais, mesmo padrão dos demais capítulos "Analisando Tema de Redação".',
  },
  {
    chapterId: 'summary-redacao-incrementando-o-repertorio-midia-e-sociedade',
    motivo: 'banco de repertório (indústria cultural, agenda-setting, bolha e câmara de eco) listado item a item, sem guarda-chuva estrutural.',
  },
  {
    chapterId: 'summary-redacao-analisando-tema-de-redacao-midia-e-sociedade',
    motivo: 'procedimento guiado de montagem de argumento sobre desinformação, mesmo padrão dos demais capítulos "Analisando Tema de Redação".',
  },
  {
    chapterId: 'summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao',
    motivo: 'trata de como formular a tese e decidir se anuncia os argumentos — orientação de composição do parágrafo de introdução, sem tipologia, rivalidade, camadas, critérios conjuntivos, escala ou cadeia causal no conteúdo do próprio capítulo.',
  },
  {
    chapterId: 'summary-redacao-paragrafo-de-introducao-como-contextualizar',
    motivo: 'os cinco "tipos" de contextualização (histórica, conceitual, comparativa, factual, alusiva) são um menu de recursos retóricos intercambiáveis que o mesmo autor escolhe (ou até combina) para abrir o mesmo parágrafo — ao contrário do guarda-chuva de gêneros textuais (que a prova atribui de forma exclusiva), aqui não há exclusividade nem categoria externa fixa sendo classificada, é recurso de estilo, não tipologia de um fenômeno.',
  },
  {
    chapterId: 'summary-redacao-argumentacao-auditorio-particular-e-universal',
    motivo: 'auditório particular e auditório universal são dois modos de dirigir-se ao leitor conforme o gênero da proposta — nenhum é rejeitado em favor do outro (a escolha depende do gênero, ambos são legítimos), o que afasta "contraste-de-posicoes"; e são só dois termos sem enumeração de variantes coexistentes, insuficiente para tipologia.',
  },
  {
    chapterId: 'summary-redacao-argumentacao-quase-logica-e-efeito-de-verdade',
    motivo: 'lista tipos de argumento quase-lógico (definição, comparação, causa, reciprocidade, regra de justiça, transitividade) como um menu de recursos retóricos que o autor escolhe conforme o caso, não uma tipologia de um fenômeno externo com guarda-chuva que os declare variantes coexistentes de algo que se observa no mundo.',
  },
  {
    chapterId: 'summary-redacao-argumentacao-e-coerencia-interna',
    motivo: 'define coerência interna e lista onde a incoerência costuma aparecer (tese x argumentos, desenvolvimento x proposta) — diagnóstico procedural de revisão de texto, não estrutura de conteúdo testável pelas oito famílias.',
  },
  {
    chapterId: 'summary-redacao-argumentacao-e-coerencia-externa',
    motivo: 'define coerência externa como compatibilidade com o conhecimento de mundo compartilhado e lista riscos (dado inventado, atribuição incorreta, proposta inviável) — critério de verificação factual, não estrutura testável.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-dados-numericos-e-exemplos',
    motivo: 'descreve quando um dado funciona e como sequenciar ideia, dado e explicação num parágrafo — recurso de técnica argumentativa a ser seguido, não tipologia, rivalidade, camada, critério conjuntivo, escala ou cadeia do conteúdo do capítulo.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-vozes-prestigiadas',
    motivo: 'descreve como usar argumento de autoridade (citar, reformular, explicar a relação) — procedimento de técnica argumentativa, não estrutura de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-ressalvando-o-ponto-de-vista-contrario',
    motivo: 'a concessão é descrita como uma estrutura de duas partes obrigatórias do mesmo parágrafo (concessão breve + reafirmação da tese) — receita de composição, não tipologia com variantes coexistentes nem rivalidade entre posições distintas do texto.',
  },
  {
    chapterId: 'summary-redacao-refutando-o-ponto-contrario',
    motivo: 'lista quatro estratégias de refutação (atacar premissa, atacar inferência, contraexemplo, levar às últimas consequências) como um menu de técnicas intercambiáveis que o mesmo autor escolhe para a mesma refutação, não guarda-chuva de tipos coexistentes de um fenômeno externo.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-interdiscursividade-e-intertextualidade',
    motivo: 'distingue intertextualidade (citar texto específico) de interdiscursividade (mobilizar discurso socialmente circulante) como dois recursos que coexistem sem rivalidade nem enumeração suficiente de variantes para tipologia — são só dois termos técnicos definidos por contraste, não tipos com guarda-chuva declarado.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-temas-de-redacao-ja-analisados',
    motivo: 'descreve como reaproveitar repertório de temas antigos e treinar com cronômetro — rotina de estudo procedural, não estrutura de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-fatos-da-atualidade',
    motivo: 'orienta como usar fato recente com precisão (data, local, atores) e como se manter atualizado — procedimento de técnica argumentativa, não estrutura testável.',
  },
  {
    chapterId: 'summary-redacao-recursos-argumentativos-multiplos-dominios-do-saber',
    motivo: 'lista áreas do conhecimento que "rendem" repertório (sociologia, história, geografia, biologia...) como fontes possíveis de referência, um checklist de onde buscar repertório, não uma tipologia que classifique essas áreas por propriedade estrutural distintiva declarada no texto.',
  },
  {
    chapterId: 'summary-redacao-conclusao-por-sintese-ou-retomada-da-tese',
    motivo: 'descreve síntese e retomada da tese como duas funções complementares do mesmo parágrafo de conclusão, ambas normalmente presentes juntas — não são posições rivais, tipos coexistentes com guarda-chuva, nem estágios de uma escala, é receita de composição.',
  },
  {
    chapterId: 'summary-redacao-conclusao-sumarizacao-focalizacao-e-expressividade',
    motivo: 'as três estratégias (sumarização, focalização, expressividade) são explicitamente combináveis no mesmo parágrafo ("as três podem ser combinadas"), não tipos mutuamente coexistentes que se escolhe entre si, nem estágios ordenados, nem posições rivais.',
  },
  {
    chapterId: 'summary-redacao-proposta-de-intervencao-atores-sociais-e-cidadania',
    motivo: 'lista agentes possíveis (poder público, setor privado, escola, mídia, sociedade civil) como opções que o candidato escolhe conforme o tema, sem guarda-chuva que os declare tipos com propriedade estrutural distintiva cada — é checklist de quem pode agir, mais próximo de menu do que de tipologia.',
  },
  {
    chapterId: 'summary-redacao-proposta-de-intervencao-viabilizacao-e-inovacao',
    motivo: 'descreve os cinco elementos de uma única proposta completa (agente, ação, meio, finalidade, detalhamento) como componentes simultâneos do mesmo texto, não tipos coexistentes, nem estágios ordenados, nem elos causais entre si.',
  },
  {
    chapterId: 'summary-redacao-proposta-de-intervencao-coerencia-argumentativa',
    motivo: 'descreve como testar se a proposta responde ao problema argumentado — procedimento de verificação de coerência entre parágrafos do próprio texto, não estrutura de conteúdo do mundo.',
  },
  {
    chapterId: 'summary-redacao-proposta-de-intervencao-respeito-aos-direitos-humanos',
    motivo: 'lista exemplos do que costuma violar direitos humanos (punição sem processo legal, castigos físicos, censura ampla) como advertências de erro a evitar, não uma tipologia positiva de variantes válidas coexistentes — é lista de proibições, não classificação testável.',
  },
  {
    chapterId: 'summary-redacao-recursos-de-coesao-referencial-no-texto-dissertativo',
    motivo: 'lista recursos de retomada (pronome, sinônimo, hiperônimo, elipse, expressão nominal) como ferramentas intercambiáveis dentro do mesmo parágrafo, um menu de técnica de coesão, não tipologia de um fenômeno externo com guarda-chuva.',
  },
  {
    chapterId: 'summary-redacao-recursos-de-coesao-sequencial-no-texto-dissertativo',
    motivo: 'lista relações lógicas de conectivo (adição, oposição, causa, condição...) como um menu de opções que o autor escolhe conforme a relação pretendida em cada frase, não tipos coexistentes de um fenômeno externo classificado pelo capítulo.',
  },
  {
    chapterId: 'summary-redacao-coesao-no-texto-dissertativo-analise-de-problemas',
    motivo: 'é diagnóstico de defeitos comuns de coesão (repetição excessiva, pronome sem referente, conectivo inadequado) com procedimento de correção — checklist de revisão, não estrutura de conteúdo testável.',
  },
  {
    chapterId: 'summary-redacao-recursos-linguisticos-norma-clareza-e-expressividade',
    motivo: 'trata norma-padrão, clareza e expressividade como três dimensões avaliadas simultaneamente no mesmo texto, não tipos coexistentes com guarda-chuva, nem estágios de uma escala ordenada, nem elos causais entre si.',
  },
  {
    chapterId: 'summary-redacao-os-direitos-humanos-de-1-geracao-direitos-individuais',
    motivo: 'descreve isoladamente apenas a primeira geração de direitos (civis e políticos); uma escala de graus exige ao menos dois degraus comparáveis dentro do próprio capítulo, e aqui a segunda e a terceira geração — que estabeleceriam a progressão — só aparecem no capítulo seguinte, não neste.',
  },
  {
    chapterId: 'summary-redacao-redacoes-nota-1000-trunfos-a-inspirar',
    motivo: 'descreve características que co-ocorrem no mesmo texto de nota máxima (tese clara, dois argumentos, coesão variada, proposta completa) como traços simultâneos de um texto ideal, não tipos coexistentes, estágios ordenados, nem elos causais entre si.',
  },
  {
    chapterId: 'summary-redacao-redacoes-na-midia-como-aprimorar',
    motivo: 'descreve uma rotina de treino em etapas sequenciais (ler comentários, autoavaliação, redação semanal, reescrita) — rotina de estudo procedural do próprio candidato, não estrutura de conteúdo do mundo testável pelas oito famílias.',
  },
];
