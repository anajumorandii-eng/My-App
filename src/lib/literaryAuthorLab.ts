/**
 * Perfis de autor de Literatura: seis capítulos monográficos (Machado de
 * Assis, Graciliano Ramos, Drummond, João Cabral, Clarice Lispector,
 * Guimarães Rosa) que compartilham a mesma pergunta — trajetória, técnica e
 * obra — apesar de tratarem de escritores muito diferentes entre si.
 *
 * Mesma arquitetura de `literaryTraitLab.ts` (três casos comparáveis, um só
 * componente desenha a cena), mas com eixo fixo e específico de autor, em vez
 * do eixo contexto/procedimento/autor de uma estética: aqui os três casos são
 * sempre Trajetória, Técnica e Obra, porque é isso que a prova cobra de um
 * autor — de onde ele vem, como ele escreve e o que ele escreveu. Usar o
 * mesmo eixo fixo de `historyPhaseLab.ts` (três casos, um selo comum) seria
 * emprestar rótulo genérico demais para autores tão distintos; três eixos
 * fixos e nomeados é o que torna os seis capítulos comparáveis entre si sem
 * apagar o que cada um tem de específico.
 *
 * Cada caso reorganiza, sem inventar, as seções já revisadas (rev 2) de
 * `deepSummaryContent.json` do capítulo correspondente. Nenhum título de
 * obra, nome de personagem ou data aqui é inventado.
 */
export type LiteraryAuthorId =
  | 'machado-de-assis'
  | 'graciliano-ramos'
  | 'carlos-drummond'
  | 'joao-cabral'
  | 'clarice-lispector'
  | 'guimaraes-rosa';

export interface LiteraryAuthorCase {
  label: 'Trajetória' | 'Técnica' | 'Obras';
  note: string;
  observation: string;
  conclusion: string;
}

export interface LiteraryAuthorConfig {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  cases: readonly [LiteraryAuthorCase, LiteraryAuthorCase, LiteraryAuthorCase];
  caution: string;
}

export const LITERARY_AUTHORS: Record<LiteraryAuthorId, LiteraryAuthorConfig> = {
  'machado-de-assis': {
    chapterId: 'summary-literatura-machado-de-assis',
    title: 'Machado de Assis',
    question: 'Por que Dom Casmurro não permite afirmar que Capitu traiu Bentinho?',
    relation: 'narrador não confiável + ironia + crítica ao Segundo Reinado → ruptura realista machadiana',
    cases: [
      { label: 'Trajetória', note: 'duas fases', observation: 'A obra machadiana divide-se entre a fase romântica, com A Mão e a Luva e Iaiá Garcia, e a fase realista, iniciada em 1881 com Memórias Póstumas de Brás Cubas.', conclusion: 'Memórias Póstumas rompe convenções narrativas e inaugura outra forma de tratar personagem, narrador e leitor.' },
      { label: 'Técnica', note: 'narrador não confiável', observation: 'Em Memórias Póstumas, o narrador é defunto autor, com liberdade total; em Dom Casmurro, Bento Santiago narra em causa própria, e a suspeita sobre Capitu depende só de sua versão.', conclusion: 'Afirmar que Capitu traiu como fato do enredo ignora que a obra não confirma — é construção de um narrador interessado.' },
      { label: 'Obras', note: 'ironia e crítica social', observation: 'Machado trabalha ironia, digressão, diálogo com o leitor e o humanitismo como paródia filosófica, com crítica à sociedade escravista e às elites do Segundo Reinado.', conclusion: 'Ler o humanitismo como filosofia séria, em vez de paródia, é deslize comum.' },
    ],
    caution: 'Perfil de autor: cobre só os traços mais cobrados; Machado tem contos e outros romances fora deste recorte.',
  },
  'graciliano-ramos': {
    chapterId: 'summary-literatura-graciliano-ramos',
    title: 'Graciliano Ramos',
    question: 'Por que o narrador de Vidas Secas acessa pensamentos de quem quase não fala?',
    relation: 'prosa enxuta + narrador que empresta voz + retirante sem palavra → Graciliano Ramos',
    cases: [
      { label: 'Trajetória', note: 'prosa enxuta', observation: 'Graciliano é conhecido pela prosa enxuta, sem adjetivação supérflua, com frases curtas — economia formal que corresponde à dureza do mundo narrado.', conclusion: 'Ler a secura da linguagem como pobreza estilística inverte o efeito buscado pelo autor.' },
      { label: 'Técnica', note: 'narrador empresta voz', observation: 'Em Vidas Secas, o narrador em terceira pessoa acessa o pensamento de personagens que não dominam a palavra, inclusive a cachorra Baleia.', conclusion: 'É o narrador quem dá forma ao que Fabiano e a família não conseguem dizer — não é articulação da própria personagem.' },
      { label: 'Obras', note: 'São Bernardo, Angústia', observation: 'São Bernardo é narrado por Paulo Honório, proprietário que reconstrói sua incapacidade de amar; Memórias do Cárcere relata a prisão do autor no Estado Novo.', conclusion: 'Confundir São Bernardo com Vidas Secas quanto ao foco narrativo é erro frequente — só o primeiro tem narrador-protagonista.' },
    ],
    caution: 'Perfil de autor: o recorte prioriza Vidas Secas e São Bernardo, as obras mais cobradas em prova.',
  },
  'carlos-drummond': {
    chapterId: 'summary-literatura-carlos-drummond-de-andrade',
    title: 'Carlos Drummond de Andrade',
    question: 'O que caracteriza A Rosa do Povo, e por que No meio do caminho causou escândalo?',
    relation: 'fase da trajetória + repetição deliberada + poema-símbolo → poética drummondiana',
    cases: [
      { label: 'Trajetória', note: 'três fases', observation: 'A trajetória de Drummond tem o gauchismo irônico de Alguma Poesia, a fase social de A Rosa do Povo, marcada pela guerra, e uma fase mais metafísica depois.', conclusion: 'A fase social não é abandono da subjetividade: o eu permanece, tensionado pela história.' },
      { label: 'Técnica', note: 'repetição estruturante', observation: 'Drummond combina coloquialidade e precisão, ironia e gravidade, usando a repetição como recurso estruturante e imagens de forte impacto a partir de elementos banais.', conclusion: 'Tratar a repetição em seus poemas como falha estilística ignora que é procedimento deliberado.' },
      { label: 'Obras', note: 'No meio do caminho', observation: 'No meio do caminho tornou-se símbolo da recepção escandalizada da poesia modernista; A Rosa do Povo é a fase de maior compromisso histórico, no contexto da Segunda Guerra.', conclusion: 'O prosaísmo e a repetição do poema contrariavam o padrão poético então consagrado.' },
    ],
    caution: 'Perfil de autor: a obra de Drummond é vasta; o recorte prioriza os poemas mais cobrados em vestibular.',
  },
  'joao-cabral': {
    chapterId: 'summary-literatura-joao-cabral-de-melo-neto',
    title: 'João Cabral de Melo Neto',
    question: 'Por que João Cabral é chamado de poeta engenheiro, e o que a redondilha maior traz para Morte e Vida Severina?',
    relation: 'recusa da inspiração + redondilha popular + imagem mineral do Nordeste → poeta engenheiro',
    cases: [
      { label: 'Trajetória', note: 'o poeta engenheiro', observation: 'João Cabral recusa a inspiração e o derramamento sentimental, defendendo a poesia como construção racional — o que lhe rendeu o apelido de poeta engenheiro.', conclusion: 'Sua linguagem é seca, concreta, avessa ao ornamento, com imagens minerais e vegetais do Nordeste.' },
      { label: 'Técnica', note: 'redondilha maior', observation: 'Morte e Vida Severina usa a redondilha maior, remetendo à tradição popular do cordel e do romanceiro, em uma estrutura de poema dramático, não romance.', conclusion: 'Classificar a obra como romance confunde procedimento narrativo com forma poética dramática.' },
      { label: 'Obras', note: 'Capibaribe e a pedra', observation: 'O Cão sem Plumas e O Rio tratam do Capibaribe como fio condutor da paisagem pernambucana; Educação pela Pedra sistematiza a poética da concisão e da resistência.', conclusion: 'Ler a secura cabralina como falta de emoção confunde procedimento com ausência de tema humano.' },
    ],
    caution: 'Perfil de autor: o recorte prioriza Morte e Vida Severina, a obra mais cobrada do autor em prova.',
  },
  'clarice-lispector': {
    chapterId: 'summary-literatura-clarice-lispector',
    title: 'Clarice Lispector',
    question: 'O que é epifania na narrativa de Clarice, e por que o narrador de A Hora da Estrela importa?',
    relation: 'consciência no lugar do enredo + sintaxe rompida + epifania cotidiana → prosa de Clarice',
    cases: [
      { label: 'Trajetória', note: 'prosa introspectiva', observation: 'Clarice desloca o foco do enredo para a consciência: pouco acontece exteriormente, e muito ocorre na percepção das personagens, em instantes de epifania.', conclusion: 'Buscar enredo tradicional em seus contos e concluir que nada acontece ignora que o acontecimento é interno.' },
      { label: 'Técnica', note: 'sintaxe rompida', observation: 'Sua escrita rompe a sintaxe convencional, usa repetição, paradoxo e interrogação, tematizando a insuficiência da linguagem para dizer a experiência.', conclusion: 'A forma encena a dificuldade que a personagem tem de nomear aquilo que a atravessa.' },
      { label: 'Obras', note: 'G.H. e A Hora da Estrela', observation: 'A Paixão segundo G.H. leva o experimento ao extremo com o encontro com uma barata; A Hora da Estrela apresenta Macabéa e o narrador Rodrigo S. M., que reflete sobre narrar.', conclusion: 'Ignorar Rodrigo S. M. em A Hora da Estrela deixa de fora parte central do sentido da obra.' },
    ],
    caution: 'Perfil de autor: o recorte prioriza as obras mais cobradas; Clarice também escreveu literatura infantil e crônicas.',
  },
  'guimaraes-rosa': {
    chapterId: 'summary-literatura-guimaraes-rosa',
    title: 'Guimarães Rosa',
    question: 'Por que a linguagem de Guimarães Rosa não é transcrição do falar sertanejo, e o pacto de Riobaldo se confirma?',
    relation: 'linguagem inventada + monólogo de Riobaldo + travessia como tema → Guimarães Rosa',
    cases: [
      { label: 'Trajetória', note: 'linguagem inventada', observation: 'Rosa reelabora a linguagem literária a partir do falar sertanejo, criando neologismos, recuperando arcaísmos e alterando a sintaxe — língua inventada, não transcrição.', conclusion: 'Tratar sua linguagem como registro fiel do falar sertanejo é o erro conceitual central.' },
      { label: 'Técnica', note: 'monólogo de Riobaldo', observation: 'Grande Sertão: Veredas é um monólogo de Riobaldo a um interlocutor mudo, rememorando o pacto possível com o demônio e o amor por Diadorim.', conclusion: 'O texto não confirma nem nega o pacto: a ambiguidade permanece como tema central, não falha de enredo.' },
      { label: 'Obras', note: 'Sagarana e travessia', observation: 'Em Sagarana e Primeiras Estórias, o sertão aparece como espaço físico e metafísico, com travessias e a impossibilidade de decidir de forma definitiva sobre o bem e o mal.', conclusion: 'Reduzir Grande Sertão a romance regionalista ignora sua dimensão filosófica e sua construção formal.' },
    ],
    caution: 'Perfil de autor: o recorte prioriza Grande Sertão: Veredas, a obra mais cobrada do autor em prova.',
  },
};
