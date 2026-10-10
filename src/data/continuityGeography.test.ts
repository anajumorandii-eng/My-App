import { describe, expect, it } from 'vitest';
import { geographyInteractiveSummaries, geographySummaryMaterials } from './geographyInteractiveSummaries';
import { interactiveSummaries } from './interactiveSummaries';
import { evaluateRetrievalAnswer, getReadingProgress } from '../lib/summaryEngine';
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
    expect(text).toContain('coexistiram');
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

const summary = (id: string) => interactiveSummaries.find(item => item.id === id)!;
describe('continuidade das pendências Design & Motion Kit', () => {
  it('ensina as condições da fusão e encaminha a recuperação para a explicação pertinente', () => {
    const item = summary('fis-termologia-calor');
    expect(item.sections.map(s => s.content).join(' ')).toMatch(/substância pura.*pressão constante/s);
    expect(item.retrieval[0].hint).toContain('Mudanças de estado');
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'A temperatura permanece constante; a energia modifica as interações entre partículas. No vácuo ocorre radiação.').firstMissingElement).toBeNull();
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'A temperatura permanece constante; no vácuo ocorre radiação.').firstMissingElement).not.toBeNull();
  });
  it('cobra simbiose e risco do branqueamento sem afirmar morte inevitável', () => {
    const item = summary('summary-biologia-poriferos-e-cnidarios');
    expect(item.sections[1].content).toContain('zooxantelas');
    expect(item.sections[1].content).toContain('não significa morte imediata');
    expect(item.retrieval[0].prompt).not.toContain('branqueamento mata');
    const answer = 'Perde zooxantelas e o aporte de nutrientes. Não significa morte imediata, pode se recuperar. Os flagelos movimentam a água e os coanócitos capturam partículas alimentares.';
    expect(evaluateRetrievalAnswer(item.retrieval[0], answer).firstMissingElement).toBeNull();
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'zooxantela nutriente coanócito').firstMissingElement).not.toBeNull();
  });
  it('sustenta os recortes históricos no texto sem transformar causas em condições necessárias', () => {
    const item = summary('summary-historia-a-montagem-da-colonizacao');
    const scene = historia.find(s => s.chapterId === item.id)!;
    expect(scene.question).not.toContain('nenhum sozinho suficiente');
    expect(scene.items.some(i => i.label === 'Circuito atlântico')).toBe(true);
    for (const recorte of scene.items) {
      const section = item.sections.find(s => s.title === recorte.section)!;
      expect(section.content).toContain(recorte.quote);
    }
    expect(item.sections[2].content).toContain('coexistiram');
    expect(item.sections[2].content).toContain('trabalho compulsório');
  });
  it.each(['fis-termologia-calor', 'summary-biologia-poriferos-e-cnidarios', 'summary-historia-a-montagem-da-colonizacao'])('solicita releitura apenas da revisão editorial de %s', id => {
    const item = summary(id);
    expect(item.sections.every(s => s.id.includes('-editorial-v3-'))).toBe(true);
    expect(getReadingProgress(item, { readSectionIds: [1,2,3,4,5].map(i => `${id}-editorial-v2-${i}`), status: 'em-revisao', important: true, answers: [] })).toBe(0);
  });
});


describe('continuidade integral: História e Geografia, rodada seguinte', () => {
  const models: Array<[string, string]> = [
  [
    "Introdução à História e Primeiras Civilizações",
    "O excedente pode sustentar quem não planta e favorecer a especialização de ofícios e o crescimento urbano. A Mesopotâmia conheceu cidades-Estado e impérios em diferentes períodos. O Egito desenvolveu uma tradição de centralização sob o faraó, mas também teve fases de fragmentação."
  ],
  [
    "Antiguidade Clássica: o Mundo Grego",
    "As cidades independentes partilhavam cultura, língua, religião e Jogos Olímpicos. Em Atenas, homens cidadãos participavam diretamente das assembleias; excluía mulheres, escravizados e metecos. Os vínculos culturais não criavam um governo único."
  ],
  [
    "Antiguidade Clássica: o Mundo Romano",
    "As guerras civis entre generais enfraqueceram a ordem republicana. Augusto concentrou poder militar e político e manteve formalmente as instituições republicanas, como o Senado e as magistraturas, sob sua autoridade predominante."
  ],
  [
    "Alta Idade Média e Feudalismo",
    "Os servos deviam trabalho, produtos e taxas ao senhor e sofriam restrições jurídicas e de mobilidade. A vassalagem ligava nobres: o vassalo recebia um feudo em troca de serviço militar e conselho, além de fidelidade. Eram relações distintas que podiam coexistir."
  ],
  [
    "Baixa Idade Média",
    "A mortalidade gerou escassez de trabalhadores, e os sobreviventes puderam negociar melhores condições, embora enfrentassem resistência dos senhores. As Cruzadas intensificaram o comércio mediterrâneo já existente e ampliaram contatos com o Oriente."
  ],
  [
    "América Espanhola",
    "A encomienda permitia ao beneficiário receber tributos das comunidades indígenas, em bens ou serviços conforme o contexto. A mita era trabalho compulsório em rodízio, adaptado pelos espanhóis para a mineração. A preferência por peninsulares em altos cargos frustrava setores criollos com poder econômico e participação local e alimentava seu descontentamento, contribuindo para as independências."
  ],
  [
    "Absolutismo",
    "Bossuet defendia o direito divino: o poder vinha de Deus. Hobbes defendia um pacto em busca de segurança, autorizando um soberano indiviso, que podia ser uma pessoa ou assembleia, sem renúncia à autoconservação. Versalhes aproximava nobres da corte e os vinculava a favores e etiqueta, restringindo sua autonomia política."
  ],
  [
    "Reforma Religiosa",
    "Lutero criticava a arrecadação associada a indulgências e defendia a justificação pela fé, em vez de tratar pagamentos como garantia de salvação. Trento reafirmou dogmas católicos e corrigiu abusos, mantendo as indulgências. Os jesuítas atuavam em educação e missões, inclusive nos territórios coloniais."
  ],
  [
    "Vida Urbana e Renascimento Cultural",
    "A riqueza comercial das cidades italianas permitia a mecenas financiar artistas e intelectuais. O humanismo valorizava as capacidades humanas e os textos clássicos, frequentemente convivendo com a fé cristã. A arte incorporava perspectiva linear e naturalismo anatômico, continuando a produzir temas religiosos e ampliando temas mitológicos e seculares."
  ],
  [
    "Iluminismo",
    "A defesa de direitos universais convivia com a escravidão colonial e com a exclusão das mulheres e não proprietários da participação política plena, embora essas exclusões fossem contestadas. Montesquieu propôs a separação dos poderes para evitar a concentração do poder e a tirania."
  ],
  [
    "Coordenadas Geográficas",
    "A latitude é medida a partir do equador, ao norte ou ao sul. A longitude é medida a partir de Greenwich, a leste ou a oeste. Um grau de latitude vale aproximadamente 111 km; um grau de longitude diminui porque os meridianos convergem nos polos."
  ],
  [
    "Movimentos da Terra",
    "Os hemisférios têm estações opostas ao mesmo tempo, o que a distância comum ao Sol não explica. A causa principal é a inclinação do eixo, combinada com a translação. Por volta de 21 de dezembro ocorre o solstício de verão no hemisfério sul: raios mais diretos e dias mais longos."
  ],
  [
    "Sistema de Fusos Horários",
    "UTC−3 está 12 horas atrás de UTC+9. Subtraindo 12 horas de 9h30 de segunda-feira, chego a 21h30 de domingo."
  ],
  [
    "Linguagem Cartográfica",
    "6 cm × 250.000 = 1.500.000 cm, ou 15 km. Essa é a distância em linha reta; a estrada pode ser maior porque depende do traçado."
  ],
  [
    "Projeções Cartográficas",
    "Mercator aumenta a distorção das áreas em latitudes altas, perto dos polos. Para comparar áreas de países, procuraria uma projeção equivalente, que preserva a proporção das áreas."
  ],
  [
    "Cartografia Digital",
    "O SIG faz um cruzamento de camadas: população e distância às unidades mostram necessidade e oferta, e renda e doenças ajudam a priorizar vazios assistenciais. GPS determina a posição do receptor; sensoriamento remoto observa a superfície por imagens à distância."
  ],
  [
    "Representações Gráficas e Cartográficas",
    "São dois quilômetros: 4 vezes 50.000 dá 200.000 cm, ou 2 km. Escala grande mostra uma área menor com mais detalhe. A anamorfose dimensiona áreas por uma variável, por exemplo população."
  ],
  [
    "Dinâmica Climática",
    "Na convectiva a superfície aquece o ar; na orográfica uma barreira montanhosa força a subida; na frontal o encontro de massas levanta o ar quente. Quando sobe, o ar expande e esfria, podendo atingir a saturação e condensar."
  ],
  [
    "Clima Mundial",
    "Perto de 30 graus o ar descende, forma alta pressão e aquece, reduzindo a umidade relativa e dificultando nuvens e chuva. Quito tem altitude elevada nos Andes, por isso sua temperatura é menor apesar de estar junto ao Equador."
  ],
  [
    "Geomorfologia Mundial",
    "O Himalaia cresce pela colisão entre a placa Indiana e a Euroasiática, que comprime e espessa a crosta. O Japão está numa zona de subducção do Círculo de Fogo do Pacífico e por isso tem muitos terremotos."
  ],
  [
    "Biogeografia Mundial",
    "Perto de 30°, o ar desce, comprime e aquece, dificultando nuvens e chuva. O deserto tem precipitação escassa; a savana alterna estação chuvosa e estação seca."
  ],
  [
    "Geopolítica Ambiental",
    "Kyoto tinha metas obrigatórias para países desenvolvidos. Paris exige NDCs com metas nacionais e obrigações de transparência. Uma barragem a montante pode alterar as vazões recebidas por países a jusante, principalmente durante enchimento ou seca."
  ],
  [
    "Geopolítica dos Recursos Hídricos",
    "A água pode estar distante da população, e seu acesso depende de infraestrutura de captação, tratamento e distribuição. O uso a montante afeta quem está a jusante; a cooperação e os acordos pactuam usos, dados e solução de controvérsias."
  ],
  [
    "Desafios Ambientais do Século XXI",
    "Mitigação reduz emissões e atua nas causas. Adaptação prepara a sociedade para os impactos. As responsabilidades comuns porém diferenciadas consideram a responsabilidade histórica e a capacidade de cada país."
  ],
  [
    "Água na Superfície Terrestre",
    "Quase toda a água é salgada, nos oceanos. Grande parte da doce está em geleiras e no subsolo, distante do uso imediato. A bacia pede gestão integrada porque o uso a montante afeta quantidade e qualidade a jusante."
  ],
  [
    "Hidrogeografia Mundial",
    "O Egito está a jusante e depende do Nilo. O enchimento e a operação da barragem podem alterar a vazão recebida, sobretudo em secas, conforme as chuvas e os acordos. A agricultura é o setor que mais retira água doce."
  ],
  [
    "Do Mundo Bipolar ao Multipolar",
    "Não houve guerra aberta e generalizada entre EUA e URSS, mas houve guerras periféricas como Coreia e Vietnã, apoiadas pelas superpotências, e episódios de combate direto. A interpretação multipolar destaca vários centros de poder que disputam influência com pesos desiguais."
  ],
  [
    "Globalização e Processos Econômicos Atuais",
    "Distribuir etapas entre países permite aproveitar vantagens de custo e tecnologia. Concentrar uma etapa em poucos fornecedores cria gargalos: uma interrupção local pode parar a cadeia inteira. Diversificar fornecedores e fazer nearshoring reduz dependências e aumenta a resiliência, mesmo com custos maiores no curto prazo."
  ],
  [
    "Geografia das Redes Mundiais",
    "As redes ligam nós de comando com alta conectividade, e a proximidade física não determina a intensidade dos fluxos. Cabos submarinos concentram o tráfego de dados entre continentes: controlá-los ou rompê-los afeta comunicações e torna regiões com poucas rotas vulneráveis."
  ],
  [
    "Unilateralismo e Multilateralismo",
    "A composição do Conselho preserva a estrutura do pós-guerra de 1945, com cinco membros permanentes. Seu veto pode bloquear decisões não processuais, gerando críticas de representatividade. O problema climático ultrapassa fronteiras e exige cooperação global, pois nenhum país o resolve sozinho."
  ]
];
  it.each(models)('aceita recuperação natural sobre conteúdo ensinado em %s', (topic, answer) => {
    const item = interactiveSummaries.find(s => s.title === topic)!;
    expect(item.sections).toHaveLength(5);
    expect(item.retrieval).toHaveLength(1);
    const result = evaluateRetrievalAnswer(item.retrieval[0], answer);
    expect(result.firstMissingElement).toBeNull();
    expect(result.matchedElements).toHaveLength(item.retrieval[0].expectedElements.length);
  });
  const sceneTopics = ["Introdução à História e Primeiras Civilizações","Antiguidade Clássica: o Mundo Grego","Antiguidade Clássica: o Mundo Romano","Alta Idade Média e Feudalismo","Baixa Idade Média","América Espanhola","Absolutismo","Reforma Religiosa","Vida Urbana e Renascimento Cultural","Iluminismo","Movimentos da Terra","Sistema de Fusos Horários","Linguagem Cartográfica","Projeções Cartográficas","Cartografia Digital","Representações Gráficas e Cartográficas","Dinâmica Climática","Clima Mundial","Geomorfologia Mundial","Biogeografia Mundial","Geopolítica Ambiental","Geopolítica dos Recursos Hídricos","Desafios Ambientais do Século XXI","Água na Superfície Terrestre","Hidrogeografia Mundial","Do Mundo Bipolar ao Multipolar","Globalização e Processos Econômicos Atuais","Geografia das Redes Mundiais","Unilateralismo e Multilateralismo"];
  it.each(sceneTopics)('preserva a cena e suas citações em %s', topic => {
    const item = interactiveSummaries.find(s => s.title === topic)!;
    const entry = [...historia, ...geografia].find(s => s.chapterId === item.id);
    expect(entry).toBeDefined();
    expect(validarLastro(entry!, item)).toEqual([]);
  });
  it('não aceita só os pontos de origem como explicação completa das coordenadas', () => {
    const item = interactiveSummaries.find(s => s.title === 'Coordenadas Geográficas')!;
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'Equador e Greenwich.').firstMissingElement).not.toBeNull();
  });
  it('distingue servidão de liberdade jurídica', () => {
    const item = interactiveSummaries.find(s => s.title === 'Alta Idade Média e Feudalismo')!;
    expect(item.sections[1].content).toContain('dependência jurídica');
    expect(item.sections[1].content).not.toContain('juridicamente livres mas presos');
  });
  it('mede inclinação em relação à perpendicular e qualifica equinócios', () => {
    const item = interactiveSummaries.find(s => s.title === 'Movimentos da Terra')!;
    expect(item.sections[1].content).toMatch(/23,5.*perpendicular/);
    expect(item.sections[3].content).not.toContain('duração igual em todo o planeta');
    expect(item.sections[3].content).toMatch(/polares/);
  });
  it('distingue vinculação jurídica de Paris de metas nacionalmente definidas', () => {
    const item = interactiveSummaries.find(s => s.title === 'Geopolítica Ambiental')!;
    expect(item.sections[1].content).toContain('juridicamente vinculante');
    expect(item.sections[1].content).not.toContain('não vinculantes');
  });
  it('distingue crátons, escudos e colisão continental de subducção', () => {
    const item = interactiveSummaries.find(s => s.title === 'Geomorfologia Mundial')!;
    expect(item.sections[0].content).toContain('incluem escudos');
    expect(item.sections[0].content).toContain('não forma um arco vulcânico como o andino');
  });
});

describe('continuidade de Física — segunda rodada', () => {
  const cases = [
    ['o-movimento-circular', '2 Hz; T = 0,5 s. A velocidade depende do raio: v = omega R.', '2 Hz; a velocidade depende do raio.'],
    ['as-leis-de-newton', 'N = 720 N. A resultante aponta para cima. Ação e reação atuam em corpos diferentes.', 'A resultante aponta para cima e o par atua em corpos diferentes.'],
    ['dinamica-do-movimento-circular', 'A resultante centrípeta vale 2000 N e é fornecida pelo atrito estático.', 'A resultante centrípeta é fornecida pelo atrito.'],
    ['trabalho-e-energia-trabalho-de-uma-forca', '100 J para força paralela; 50 J a 60°, devido ao cosseno do ângulo.', '50 J a 60°, devido ao cosseno do ângulo.'],
    ['hidrostatica-densidade-e-pressao', '100000 Pa de pressão manométrica. Depende da profundidade, não da forma.', 'Depende da profundidade, não da forma.'],
    ['trabalho-da-forca-de-pressao-do-gas', '400 J: pressão vezes variação de volume; área sob a curva.', 'Pressão vezes variação de volume; área sob a curva.'],
    ['campo-eletrico', '2000 N/C, razão entre força e carga. Não depende da carga de prova.', 'É a razão entre força e carga, não depende da prova.'],
    ['capacitores', '100 microcoulombs; energia 0,001 J. O dielétrico aumenta a capacitância.', 'Energia 0,001 J; o dielétrico aumenta a capacitância.'],
  ];
  for (const [slug, complete, incomplete] of cases) {
    it(`exige o resultado e a explicação em ${slug}`, () => {
      const item = interactiveSummaries.find(summary => summary.id === `summary-fisica-${slug}`)!;
      expect(item).toBeDefined();
      expect(evaluateRetrievalAnswer(item.retrieval[0], complete).transferUnlocked).toBe(true);
      expect(evaluateRetrievalAnswer(item.retrieval[0], incomplete).transferUnlocked).toBe(false);
      expect(evaluateRetrievalAnswer(item.retrieval[0], '').matchedElements).toEqual([]);
      expect(getReadingProgress(item, { readSectionIds: [1,2,3,4,5].map(index => `${item.id}-editorial-v2-${index}`), status: 'em-revisao', important: false, answers: [] })).toBe(0);
    });
  }
});

it('não valida critérios de recuperação com resposta vazia em nenhum capítulo', () => {
  for (const summary of interactiveSummaries) {
    for (const question of summary.retrieval) {
      expect(evaluateRetrievalAnswer(question, '').matchedElements, summary.id).toEqual([]);
    }
  }
});
