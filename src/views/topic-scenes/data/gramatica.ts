import type { SceneEntry } from '../types';

/** Capítulos de Gramática com cena-âncora. Vazio nesta etapa: a Task 1 só fixa a
 *  atribuição de família (documentada em
 *  `docs/visual-personalizado/12-familias-gramatica.md`); as entradas de
 *  `SceneEntry` (question, items, quote literal por item) ficam para a próxima
 *  tarefa. */
export const gramatica: SceneEntry[] = [];

/** Capítulos de Gramática sem cena-âncora, com o motivo específico ao conteúdo de
 *  cada um. A lista é lida pelo teste de completude: nenhum capítulo pode ficar
 *  fora das duas listas (`gramatica` + `gramaticaSemCena`). Raciocínio completo em
 *  `docs/visual-personalizado/12-familias-gramatica.md`. */
export const gramaticaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-gramatica-variacao-linguistica',
    motivo: 'Já tem experiência interativa própria (variation) no catálogo de topic-experiments.',
  },
  {
    chapterId: 'summary-gramatica-ambiguidade-duplicidade-no-lexico-e-na-sintaxe',
    motivo:
      'É o par binário ambiguidade lexical vs. sintática, com o restante do capítulo dedicado a reescrever frases para desfazer a ambiguidade — procedimento de correção, sem guarda-chuva de três ou mais variantes coexistentes, rivalidade, cadeia ou critério conjuntivo.',
  },
  {
    chapterId: 'summary-gramatica-artigo-numeral-e-adjetivo-no-sintagma-nominal',
    motivo:
      'Dois pares binários independentes (artigo definido/indefinido; adjetivo antes/depois do substantivo), cada um com efeito de sentido próprio, mas sem guarda-chuva que os una como variantes de uma mesma classificação, sem rivalidade e sem necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-gramatica-concordancia',
    motivo:
      'Lista de casos especiais de concordância verbal e nominal (sujeito composto, sujeito posposto, expressões partitivas, verbos impessoais; é proibido/proibida; anexo/obrigado; menos/alerta) sem guarda-chuva de tipos coexistentes, hierarquia, cadeia causal ou eixo comparativo — é checklist normativo caso a caso.',
  },
  {
    chapterId: 'summary-gramatica-funcoes-sintaticas-nominais-e-vocativo',
    motivo:
      'Dois pares binários de diferenciação (adjunto adnominal vs. complemento nominal, testados pelo critério agente/paciente; aposto vs. vocativo), sem guarda-chuva que os una como tipos coexistentes — o predicativo do objeto é citado de passagem, sem elaboração real, então não sustenta um terceiro item de tipologia.',
  },
  {
    chapterId: 'summary-gramatica-mecanismo-de-regencia',
    motivo:
      'Lista de regências verbais e nominais específicas (assistir, aspirar, precisar, concordar) e mudanças de sentido associadas a cada preposição; conteúdo lexical-normativo caso a caso, sem guarda-chuva de tipos, rivalidade, cadeia ou necessidade conjunta.',
  },
  {
    chapterId: 'summary-gramatica-o-lexico-em-contexto-variadas-possibilidades-semanticas',
    motivo:
      'Combina um par binário testado por diferenciação (polissemia vs. homonímia) com uma lista de relações de sentido definidas isoladamente e sem guarda-chuva (sinonímia, antonímia, hiperonímia/hiponímia) e outro par binário (denotação/conotação); nenhum dos três blocos sustenta sozinho uma família das oito.',
  },
  {
    chapterId: 'summary-gramatica-oracoes-adjetivas',
    motivo:
      'O núcleo do capítulo é o par binário restritiva/explicativa, sem terceiro tipo. A lista de pronomes relativos (que, quem, o qual, cujo, onde, quanto) é citada, mas só cujo e onde recebem elaboração real com citação própria — cobertura desigual demais para sustentar uma tipologia honesta dos seis pronomes.',
  },
  {
    chapterId: 'summary-gramatica-pontuacao-i-principios-para-o-uso-da-virgula',
    motivo:
      'Princípios e exemplos de uso da vírgula (enumeração, vocativo, aposto, expressão intercalada, restritiva/explicativa, deslocamento de adjunto adverbial) apresentados como orientação normativa caso a caso, sem guarda-chuva de tipos coexistentes, rivalidade, cadeia ou necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-gramatica-significados-implicitos',
    motivo:
      'Par binário pressuposto vs. subentendido, diferenciado por um teste de negação; dois membros apenas, sem guarda-chuva de três ou mais tipos de significado implícito, sem rivalidade teórica e sem necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-gramatica-substantivo-os-nomes-e-a-visao-do-enunciador',
    motivo:
      'O próprio texto rejeita a classificação como o conteúdo central ("As classificações importam menos por si do que pelo efeito"); o foco real é a escolha lexical como posicionamento (protesto vs. baderna), análise de efeito de sentido, não uma estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-gramatica-tipos-de-texto-explorando-elementos-concretos-e-conceitos-abstratos',
    motivo:
      'O capítulo é sobre a operação de escrita de generalizar um exemplo concreto em conceito abstrato (habilidade de redação), não uma estrutura de tipos coexistentes, rivalidade, cadeia ou critério conjuntivo; a distinção concreto/abstrato é meio para a habilidade de escrita, não conteúdo classificatório em si.',
  },
];
