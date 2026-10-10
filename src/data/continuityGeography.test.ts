import { describe, expect, it } from 'vitest';
import { geographyInteractiveSummaries, geographySummaryMaterials } from './geographyInteractiveSummaries';
import { interactiveSummaries } from './interactiveSummaries';
import { evaluateRetrievalAnswer } from '../lib/summaryEngine';
import { historia } from '../views/topic-scenes/data/historia';
import { validarLastro } from '../views/topic-scenes/lastro';
import { geografia } from '../views/topic-scenes/data/geografia';

describe('continuidade editorial de Geografia', () => {
  it('mantém conteúdo aprofundado de Geoeconomia e a classificação correta também no texto de relevo', () => {
    const geo = interactiveSummaries.find(item => item.id === 'summary-geografia-gedeconomia-mundial')!;
    expect(geo.contentStatus).toBe('aprofundado');
    expect(geo.sections.map(section => section.id)).toEqual([1,2,3,4,5].map(index => 'summary-geografia-gedeconomia-mundial-editorial-v2-' + index));
    expect(geo.retrieval[0].id).toBe('summary-geografia-gedeconomia-mundial-editorial-recall-v2');
    const relief = interactiveSummaries.find(item => item.id === 'summary-geografia-relevo-brasileiro')!;
    expect(relief.sections[0].content).toContain('Jurandyr Ross');
    expect(relief.sections[0].content).not.toContain('Aziz Ab-Sáber');
  });
  it('não apresenta a Escola de Sagres como instituição comprovada no resumo escrito', () => {
    const summary = interactiveSummaries.find(item => item.id === 'summary-historia-grandes-navegacoes-e-conquista-colonial')!;
    expect(summary.sections[0].content).not.toContain('centro de estudos náuticos associado');
    expect(summary.sections[1].content).toContain('negociado diretamente pelas Coroas de Portugal e Castela');
    expect(summary.sections[1].content).toContain('posteriormente confirmado pelo papa Júlio II em 1506');
    expect(summary.sections[1].content).not.toContain('mediado pelo papado');
    expect(summary.retrieval[0].prompt).toContain('Tordesilhas');
    expect(summary.retrieval[0].prompt).not.toContain('Madri');
    expect(summary.sections.map(section => section.id)).toEqual([1,2,3,4,5].map(index => 'summary-historia-grandes-navegacoes-e-conquista-colonial-editorial-v4-' + index));
    expect(summary.retrieval[0].id).toBe('summary-historia-grandes-navegacoes-e-conquista-colonial-editorial-recall-v4');
  });
  it('corrige Geoeconomia sem alterar IDs de resumo, material, seções ou recuperação', () => {
    const summary = geographyInteractiveSummaries.find(item => item.id === 'summary-geografia-gedeconomia-mundial')!;
    expect(summary.title).toBe('Geoeconomia Mundial');
    expect(summary.sections.map(section => section.id)).toEqual(['rapida', 'conceito', 'aplicacao', 'exercicio', 'prova'].map(suffix => 'geo-gedeconomia-mundial-' + suffix));
    expect(summary.retrieval[0].id).toBe('geo-gedeconomia-mundial-r1');
    expect(summary.retrieval[0].sectionId).toBe('geo-gedeconomia-mundial-exercicio');
    expect(geographySummaryMaterials.find(material => material.id === 'material-geografia-gedeconomia-mundial')?.chapter).toBe('Geoeconomia Mundial');
  });
  it('atribui a classificação de três formas do relevo a Jurandyr Ross', () => {
    const scene = geografia.find(entry => entry.chapterId === 'summary-geografia-relevo-brasileiro')!;
    expect(scene.question).toContain('Jurandyr Ross');
    expect(scene.question).not.toContain('Aziz');
    expect(scene.items.map(item => item.label)).toEqual(['Planaltos', 'Planícies', 'Depressões']);
  });
});

describe('continuidade editorial de Brasil Colônia', () => {
  const summary = (id: string) => interactiveSummaries.find(item => item.id === 'summary-historia-' + id)!;
  const evaluate = (id: string, answer: string) => evaluateRetrievalAnswer(summary(id).retrieval[0], answer);

  it('avalia a participação popular na independência sem exigir reconhecimento internacional fora do texto', () => {
    const item = summary('a-independencia-do-brasil');
    expect(item.retrieval[0].prompt).not.toContain('reconhecimento internacional');
    expect(item.retrieval[0].expectedElements.map(element => element.label).join(' ')).not.toContain('sem participacao popular');
    const result = evaluate('a-independencia-do-brasil', 'Preservou monarquia, escravidão e latifúndio. Houve participação popular nas guerras; a Bahia consolidou a independência em 1823.');
    expect(result.firstMissingElement).toBeNull();
    expect(result.matchedElements).toHaveLength(3);
  });

  it('avalia roças e resistência com o conteúdo de Dinâmica Interna, sem cobrar pecuária não explicada', () => {
    const item = summary('dinamica-interna-da-colonizacao');
    expect(item.retrieval[0].prompt).not.toContain('pecuária');
    expect(evaluate('dinamica-interna-da-colonizacao', 'Roças produziam alimentos; o artesanato complementava a economia. Houve fugas para quilombos e sabotagem como resistência cotidiana.').firstMissingElement).toBeNull();
  });

  it('avalia os vetores de interiorização sem cobrar fiscalidade de outro capítulo', () => {
    const item = summary('a-interiorizacao-da-colonizacao');
    expect(item.retrieval[0].prompt).not.toContain('derrama');
    expect(evaluate('a-interiorizacao-da-colonizacao', 'A mineração atraiu migração e cidades. A capital foi transferida para o Rio de Janeiro em 1763. A pecuária fornecia carne, couro e animais de tração.').firstMissingElement).toBeNull();
  });

  it('compara as duas revoltas sem exigir uma conclusão sobre a Inglaterra ausente do texto', () => {
    const item = summary('a-crise-do-antigo-sistema-colonial');
    expect(item.retrieval[0].expectedElements.map(element => element.label).join(' ')).not.toContain('Inglaterra');
    expect(evaluate('a-crise-do-antigo-sistema-colonial', 'Terminou o exclusivo comercial. A Mineira mobilizou elites contra os impostos sobre o ouro e a derrama; a Baiana teve participação popular e defendeu a abolição.').firstMissingElement).toBeNull();
  });

  it('distingue a tomada de Macaco em 1694 da morte de Zumbi em 1695 nos trechos que ensinam a cronologia', () => {
    const item = summary('dinamica-interna-da-colonizacao');
    for (const index of [1, 3, 4]) {
      expect(item.sections[index].content).toContain('1694');
      expect(item.sections[index].content).toContain('1695');
      expect(item.sections[index].content).not.toContain('destruição definitiva em 1695');
    }
  });

  it('situa a Insurreição Pernambucana depois da administração de Nassau', () => {
    const item = summary('disputas-europeias-no-brasil-colonial');
    expect(item.sections[1].content).toContain('1637-1644');
    expect(item.sections[2].content).toContain('iniciada em 1645, após a saída de Nassau em 1644');
    expect(item.sections[2].content).not.toContain('ainda durante a administração de Nassau');
  });
});

describe('recuperação editorial de Mineração', () => {
  it('oferece uma recuperação avaliável sobre os três mecanismos de controle ensinados no capítulo', () => {
    const item = interactiveSummaries.find(summary => summary.id === 'summary-historia-a-mineracao-no-brasil-colonial')!;
    expect(item.retrieval).toHaveLength(1);
    const result = evaluateRetrievalAnswer(item.retrieval[0], 'O quinto separava 20% do ouro para a Coroa. As Casas de Fundição faziam barras seladas após reter o imposto. A derrama cobrava a diferença para a cota mínima coletivamente.');
    expect(result.matchedElements).toHaveLength(3);
    expect(result.firstMissingElement).toBeNull();
  });
});


describe('continuidade editorial do lote de 30 capítulos de História', () => {
  const models = [
  {
    "topic": "Brasil Império: Formação do Estado Nacional Brasileiro",
    "answer": "Era o quarto poder exclusivo do imperador: podia dissolver a Câmara e nomear ministros. A Confederação do Equador combateu seu autoritarismo e a centralização."
  },
  {
    "topic": "Brasil Império: Segundo Reinado (1840-1889)",
    "answer": "O tráfico transatlântico foi proibido, mas a escravidão continuou e aumentou o comércio interno de escravizados. A guerra fortaleceu o Exército."
  },
  {
    "topic": "Brasil Império: o Declínio do Segundo Reinado",
    "answer": "A Questão Religiosa desgastou as relações com parte do clero; a Militar afastou setores do Exército; a abolição sem indenização desagradou proprietários escravistas."
  },
  {
    "topic": "Brasil Império: o Período Regencial (1831-1840)",
    "answer": "Os grupos disputavam centralização e descentralização durante a menoridade de Pedro II. O golpe antecipou a maioridade em 1840, aos 14 anos, embora a Constituição exigisse 18; a coroação foi em 1841."
  },
  {
    "topic": "A República da Espada",
    "answer": "A dissolução do Congresso gerou crise que levou à renúncia de Deodoro. Prudente de Morais marcou o início de governos civis."
  },
  {
    "topic": "Ascensão e Domínio das Oligarquias",
    "answer": "A política dos governadores garantia apoio mútuo entre o presidente e as oligarquias. A verificação de poderes barrava opositores. Taubaté previa compra do excedente de café para valorização."
  },
  {
    "topic": "A Primeira República: o Declínio Oligárquico (1889-1930)",
    "answer": "A queda do preço do café enfraqueceu a elite cafeeira. O tenentismo criticava a corrupção eleitoral e a concentração de poder oligárquico."
  },
  {
    "topic": "A Era Vargas",
    "answer": "O Ministério do Trabalho controlava sindicatos. Havia jornada de oito horas e férias remuneradas. A Constituição confirmou voto feminino e secreto já previstos no Código Eleitoral de 1932."
  },
  {
    "topic": "A Era Vargas: o Estado Novo",
    "answer": "A CLT sistematizou direitos trabalhistas em 1943, enquanto o controle sindical e a censura do DIP limitavam a autonomia. Combater o fascismo no exterior expunha a contradição com a ditadura interna."
  },
  {
    "topic": "A Era Vargas: o Governo Constitucional (1934-1937)",
    "answer": "O Plano Cohen foi uma simulação divulgada como documento autêntico para dar pretexto ao golpe de 1937 e ao Estado Novo. Os polos eram os integralistas e a ANL antifascista."
  },
  {
    "topic": "República Liberal (1945-1964): Democracia em Tempos de Guerra Fria",
    "answer": "O PCB teve registro cassado e voltou à clandestinidade; o anticomunismo restringiu o pluralismo. Lott defendeu a posse de Kubitschek e o resultado eleitoral em 1955."
  },
  {
    "topic": "República Liberal (1945-1964): Desenvolvimentismo e Populismo",
    "answer": "O planejamento estatal atraía capital estrangeiro. O parlamentarismo reduziu os poderes de Goulart para viabilizar a posse. O plebiscito de 1963 restaurou o presidencialismo."
  },
  {
    "topic": "Regime Militar (1964-1985) I",
    "answer": "O AI-5 permitiu recesso do Congresso e cassação de mandatos; suspendeu habeas corpus em crimes políticos e ampliou repressão e tortura. O milagre concentrou renda por arrocho salarial."
  },
  {
    "topic": "Regime Militar (1964-1985) II",
    "answer": "A abertura foi lenta, gradual e controlada pelos militares. A interpretação de crimes conexos protegeu agentes da repressão e dificultou sua responsabilização. A emenda das Diretas foi rejeitada e Tancredo foi eleito pelo Colégio Eleitoral."
  },
  {
    "topic": "O Brasil Atual",
    "answer": "A Constituição ampliou direitos sociais e políticos, estabeleceu o SUS e participação por plebiscitos. O Plano Real usou a URV e lançou o real em 1994 para estabilizar os preços."
  },
  {
    "topic": "América Latina no Século XX",
    "answer": "Lideranças carismáticas e personalistas conquistavam apoio das massas urbanas ampliando direitos trabalhistas. A Operação Condor coordenou a repressão transnacional entre ditaduras."
  },
  {
    "topic": "América no Século XIX",
    "answer": "As rivalidades entre elites regionais enfraqueceram a unidade política. A economia continuou exportando matérias-primas e dependente de empréstimos e investimento estrangeiro."
  },
  {
    "topic": "Descolonização Afro-Asiática",
    "answer": "Persistiu a exportação de matérias-primas. A Índia tornou-se independente em 1947 após resistência de Gandhi e negociação, com violência na partição. A Argélia venceu uma guerra de libertação e tornou-se independente em 1962."
  },
  {
    "topic": "A Primeira Globalização",
    "answer": "Epidemias como varíola atingiram povos sem imunidade prévia e se combinaram com violência e trabalho compulsório. O pacto restringia o comércio à metrópole."
  },
  {
    "topic": "Europa no Século XIX",
    "answer": "A Alemanha unificada criou potência industrial e militar no centro da Europa. Marx e Engels defendiam transformação revolucionária; Bernstein defendia reformas eleitorais e negociação parlamentar."
  },
  {
    "topic": "Imperialismo e Belle Époque",
    "answer": "A indústria buscava matérias-primas, mercados e investimento de capitais excedentes. Berlim definiu regras de ocupação colonial sem representantes africanos."
  },
  {
    "topic": "Primeira Guerra Mundial (1914-1918)",
    "answer": "Sarajevo foi estopim diante de rivalidades imperialistas, alianças e nacionalismo; decisões de governos ampliaram a guerra. Reparações e ressentimento alemão foram explorados pelo nazismo."
  },
  {
    "topic": "O Período Entreguerras (1918-1939)",
    "answer": "Desemprego e miséria aumentaram o descrédito das democracias liberais. O New Deal usou intervenção estatal, obras públicas e regulação financeira."
  },
  {
    "topic": "O Nazismo na Alemanha",
    "answer": "Hindenburg nomeou Hitler chanceler; poderes de exceção e repressão suprimiram a oposição. Wannsee coordenou a implementação do genocídio já em curso."
  },
  {
    "topic": "Grandes Revoluções do Século XX",
    "answer": "A estratégia soviética privilegiava o proletariado urbano; a chinesa, o campesinato. A Constituição mexicana reconheceu a reforma agrária."
  },
  {
    "topic": "Guerra Fria",
    "answer": "Mísseis soviéticos em Cuba criavam risco de confronto nuclear. A contenção buscava impedir a expansão comunista."
  },
  {
    "topic": "O Fim da Guerra Fria",
    "answer": "A abertura expôs tensões nacionalistas. Perestroika era reforma econômica; glasnost, abertura política. O Muro caiu em 1989 e a URSS se dissolveu em 1991."
  },
  {
    "topic": "Segunda Guerra Mundial (1939-1945)",
    "answer": "Stalingrado marcou a virada e a reversão do avanço alemão. A ONU buscava segurança coletiva e diplomacia internacional."
  },
  {
    "topic": "Revolução Francesa",
    "answer": "Clero e nobreza tinham privilégios tributários que sobrecarregavam o Terceiro Estado. Mulheres eram excluídas da cidadania política."
  },
  {
    "topic": "Revolução Industrial",
    "answer": "A perda de acesso a terras comunais empurrou camponeses ao trabalho assalariado. Luditas destruíam máquinas; cartistas pediam sufrágio universal masculino."
  }
];
  it.each(models)('avalia a resposta-modelo ensinada em $topic', ({ topic, answer }) => {
    const item = interactiveSummaries.find(summary => summary.title === topic)!;
    expect(item).toBeDefined();
    expect(item.retrieval).toHaveLength(1);
    const question = item.retrieval[0];
    const result = evaluateRetrievalAnswer(question, answer);
    expect(result.firstMissingElement).toBeNull();
    expect(result.matchedElements).toHaveLength(question.expectedElements.length);
  });
  const content = (topic: string, index: number) => interactiveSummaries.find(summary => summary.title === topic)!.sections[index].content;
  it('distingue liberdade aos 60 anos e serviços obrigatórios até os 65 na Lei dos Sexagenários', () => {
    const text = content('Brasil Império: o Declínio do Segundo Reinado', 0);
    expect(text).toContain('60 anos ou mais');
    expect(text).toContain('até três anos');
    expect(text).toContain('aos 65');
  });
  it('distingue Assembleia Nacional em junho e Constituinte em julho de 1789', () => {
    const text = content('Revolução Francesa', 1);
    expect(text).toContain('17 de junho de 1789');
    expect(text).toContain('9 de julho');
    expect(text).not.toContain('Constituinte em junho');
  });
  it('distingue a anexação do Texas da cessão territorial após a guerra', () => {
    const text = content('América no Século XIX', 1);
    expect(text).toContain('Texas já havia sido anexado em 1845');
    expect(text).toContain('Califórnia e Novo México');
  });
  it('apresenta Wannsee como coordenação do genocídio já em curso', () => {
    const text = content('O Nazismo na Alemanha', 2);
    expect(text).toContain('fuzilamentos em massa já ocorriam em 1941');
    expect(text).toContain('coordenou a implementação');
    expect(text).not.toContain('decisão formalizada na Conferência');
  });
  it('distingue Bandung de Belgrado e o gatilho de criação do Pacto de Varsóvia', () => {
    expect(content('Guerra Fria', 2)).toContain('Belgrado (1961)');
    expect(content('Guerra Fria', 2)).toContain('antecedente a Conferência de Bandung (1955)');
    expect(content('Guerra Fria', 0)).toContain('entrada da Alemanha Ocidental na Otan');
  });
  it('não apresenta a ampliação do tráfico como substituição uniforme nem catequese como ausência de coerção', () => {
    const text = content('A Montagem da Colonização', 2);
    expect(text).toContain('coexistiu por séculos');
    expect(text).toContain('trabalho compulsório');
    expect(text).not.toContain('catequização como alternativa ao trabalho forçado');
  });
  it('não recompensa respostas feitas só dos antigos atalhos de palavras', () => {
    for (const [topic, answer] of [
      ['Grandes Revoluções do Século XX', 'Mao, 1917, sovietes.'],
      ['Guerra Fria', 'direto, confronto, apoio, próximo'],
      ['O Brasil Atual', 'real inflação moeda'],
    ]) {
      const question = interactiveSummaries.find(summary => summary.title === topic)!.retrieval[0];
      expect(evaluateRetrievalAnswer(question, answer).transferUnlocked).toBe(false);
    }
  });
});


describe('lastro das cenas do lote editorial', () => {
  const topics = ["Brasil Império: Formação do Estado Nacional Brasileiro","Brasil Império: Segundo Reinado (1840-1889)","Brasil Império: o Declínio do Segundo Reinado","Brasil Império: o Período Regencial (1831-1840)","A República da Espada","Ascensão e Domínio das Oligarquias","A Primeira República: o Declínio Oligárquico (1889-1930)","A Era Vargas","A Era Vargas: o Estado Novo","A Era Vargas: o Governo Constitucional (1934-1937)","República Liberal (1945-1964): Democracia em Tempos de Guerra Fria","República Liberal (1945-1964): Desenvolvimentismo e Populismo","Regime Militar (1964-1985) I","Regime Militar (1964-1985) II","O Brasil Atual","América Latina no Século XX","América no Século XIX","Descolonização Afro-Asiática","A Primeira Globalização","Europa no Século XIX","Imperialismo e Belle Époque","Primeira Guerra Mundial (1914-1918)","O Período Entreguerras (1918-1939)","O Nazismo na Alemanha","Grandes Revoluções do Século XX","Guerra Fria","O Fim da Guerra Fria","Segunda Guerra Mundial (1939-1945)","Revolução Francesa","Revolução Industrial","A Montagem da Colonização","A Crise do Antigo Sistema Colonial","A Interiorização da Colonização"];
  it.each(topics)('mantém as citações da cena ativas em %s', topic => {
    const item = interactiveSummaries.find(summary => summary.title === topic)!;
    const entry = historia.find(scene => scene.chapterId === item.id);
    if (entry) expect(validarLastro(entry, item)).toEqual([]);
  });
});
