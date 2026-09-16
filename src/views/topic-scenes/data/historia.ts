import type { SceneEntry } from '../types';

/** Capítulos de História sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Esta é a inventariação da Task 1 (ver docs/visual-personalizado/09-familias-historia.md):
 *  além da lacuna já conhecida de Fase 1 (capítulo introdutório com experiência
 *  interativa própria), inclui todo capítulo cujo conteúdo real, lido com o
 *  teste de rivalidade/assimetria/derivação genuína, não sustenta honestamente
 *  nenhuma das cinco famílias existentes nem das três pendentes da Fase 2.
 *  A maioria desses capítulos tem formato de levantamento (2-4 aspectos
 *  paralelos do mesmo período, mais "pegadinhas" que alertam justamente contra
 *  reduzir causas múltiplas a uma cadeia única ou a uma rivalidade binária) —
 *  ver a seção "Padrão geral" do documento de famílias para a justificativa
 *  completa desse achado. */
export const historiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes',
    motivo: 'Já tem experiência interativa própria (sources) no catálogo de topic-experiments, ocupando o mesmo slot do fluxo de Explorar.',
  },
  {
    chapterId: 'summary-historia-a-crise-do-antigo-sistema-colonial',
    motivo: 'Combina causas multicausais convergentes (Iluminismo, Revolução Industrial britânica, crescimento colonial) com um evento externo não derivado delas (invasão napoleônica que motiva a transferência da Corte); não há cadeia de dependência, rivalidade nem camada estrutural sustentável no capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-a-era-vargas',
    motivo: 'Governo Provisório, Constituição de 1934 e trabalhismo são aspectos paralelos e não estritamente dependentes entre si; nenhuma família é sustentada com honestidade para o capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-a-era-vargas-o-estado-novo',
    motivo: 'Centralização, propaganda, industrialização e a contradição da guerra são pilares paralelos do regime, não uma cadeia de dependência nem uma camada com assimetria de base explícita cobrindo o capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-a-interiorizacao-da-colonizacao',
    motivo: 'Bandeiras, mineração e pecuária/drogas do sertão são atividades econômicas paralelas e independentes entre si, sem cadeia de dependência, rivalidade ou tipologia de um único fenômeno.',
  },
  {
    chapterId: 'summary-historia-a-mineracao-no-brasil-colonial',
    motivo: 'Articulação econômica, fiscalidade, vida social e revoltas são aspectos paralelos do mesmo período; nenhuma família cobre o capítulo inteiro sem forçar a estrutura.',
  },
  {
    chapterId: 'summary-historia-a-montagem-da-colonizacao',
    motivo: 'Capitanias/Governo-Geral, economia açucareira e substituição da mão de obra escrava são processos distintos com lógicas próprias, sem uma cadeia, rivalidade ou camada única para o capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930',
    motivo: 'Tenentismo, movimento operário e modernismo são descritos como sintomas paralelos e convergentes de uma crise mais ampla, mas o texto não estabelece uma base condicionando-os com assimetria explícita suficiente para camadas-de-determinação, nem cadeia ou rivalidade.',
  },
  {
    chapterId: 'summary-historia-a-republica-da-espada',
    motivo: 'Governos militares iniciais, crises do período e transição para civis compõem periodização descritiva sem cadeia de dependência, rivalidade genuína ou camada estrutural assimétrica.',
  },
  {
    chapterId: 'summary-historia-absolutismo',
    motivo: 'Direito divino e contratualismo hobbesiano são justificativas teóricas distintas para a mesma conclusão prática (poder absoluto) — não rivalizam pela mesma pergunta, apenas a fundamentam por vias diferentes; sem isso, o capítulo não sustenta nenhuma família.',
  },
  {
    chapterId: 'summary-historia-alta-idade-media-e-feudalismo',
    motivo: 'Conteúdo é predominantemente definicional e comparativo (servo vs. escravizado, vassalagem vs. absolutismo posterior), sem processo de cadeia, rivalidade sobre pergunta compartilhada ou camada estrutural no capítulo.',
  },
  {
    chapterId: 'summary-historia-america-latina-no-seculo-xx',
    motivo: 'Populismo, ditaduras militares e redemocratização são fenômenos sucessivos descritos como categorias amplas com várias instâncias nacionais paralelas cada uma, não uma cadeia única nem tipologia de um único fenômeno.',
  },
  {
    chapterId: 'summary-historia-america-no-seculo-xix',
    motivo: 'Independências latino-americanas, expansão dos EUA e neocolonialismo são três blocos regionais distintos sem cadeia, rivalidade compartilhada ou camada assimétrica unificando o capítulo.',
  },
  {
    chapterId: 'summary-historia-antiguidade-classica-o-mundo-grego',
    motivo: 'Atenas e Esparta são pólis paralelas e independentes — não rivais quanto a uma mesma pergunta, nem tipos que se combinam num único caso. Comparação entre casos paralelos e independentes não é coberta por nenhuma família existente nem pelas pendentes da Fase 2.',
  },
  {
    chapterId: 'summary-historia-antiguidade-classica-o-mundo-romano',
    motivo: 'República, escravidão/economia e queda/legado são blocos temáticos amplos sem cadeia de dependência estrita, rivalidade compartilhada ou camada assimétrica cobrindo o capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-baixa-idade-media',
    motivo: 'Renascimento comercial, Cruzadas e crise do século XIV são processos com relações apenas indiretas entre si; sem cadeia de dependência estrita, rivalidade ou camada assimétrica clara.',
  },
  {
    chapterId: 'summary-historia-brasil-imperio-segundo-reinado-1840-1889',
    motivo: 'Estabilidade política/café, fim do tráfico e Guerra do Paraguai são processos paralelos do mesmo reinado sem cadeia de dependência direta, rivalidade compartilhada ou camada assimétrica única.',
  },
  {
    chapterId: 'summary-historia-dinamica-interna-da-colonizacao',
    motivo: 'Sociedade do açúcar, resistência escrava e atividades subsidiárias são aspectos paralelos da mesma formação social, sem cadeia, rivalidade ou camada assimétrica que unifique o capítulo.',
  },
  {
    chapterId: 'summary-historia-disputas-europeias-no-brasil-colonial',
    motivo: 'França Antártica e invasões holandesas são episódios cronologicamente distintos e não conectados causalmente entre si; a comparação entre esses dois episódios paralelos não configura tipologia de um único fenômeno nem cadeia de dependência.',
  },
  {
    chapterId: 'summary-historia-guerra-fria',
    motivo: 'Bipolaridade, conflitos por procuração e Terceiro Mundo são aspectos paralelos amplos do período, sem cadeia de dependência estrita, rivalidade compartilhada ou camada assimétrica única.',
  },
  {
    chapterId: 'summary-historia-iluminismo',
    motivo: 'Os pensadores iluministas compartilham base racionalista comum, mas propõem mecanismos específicos e distintos (separação de poderes, soberania popular, liberalismo econômico) que não rivalizam pela mesma conclusão nem constituem tipos paralelos aplicados a um caso comum.',
  },
  {
    chapterId: 'summary-historia-o-brasil-atual',
    motivo: 'Constituição de 1988, estabilização econômica e crises recentes são blocos temáticos amplos e paralelos, sem cadeia, rivalidade ou camada assimétrica que sustente o capítulo inteiro.',
  },
  {
    chapterId: 'summary-historia-regime-militar-1964-1985-i',
    motivo: 'Instalação do regime, anos de chumbo e milagre econômico são aspectos paralelos do mesmo período, sem uma base estrutural com assimetria explícita, cadeia de dependência estrita ou rivalidade compartilhada.',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria',
    motivo: 'Redemocratização, anticomunismo institucionalizado e crises institucionais (1954, 1955) são aspectos paralelos; a contradição pluralismo/exclusão do PCB é uma inconsistência de um único sistema, não uma rivalidade entre duas posições que disputam a mesma pergunta.',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo',
    motivo: 'Plano de Metas, tensão nacionalismo/capital estrangeiro e crise de 1961-1964 são aspectos paralelos nem sempre dependentes entre si; a tensão nacionalista não configura rivalidade decisória nem camada assimétrica suficientemente explícita.',
  },
  {
    chapterId: 'summary-historia-segunda-guerra-mundial-1939-1945',
    motivo: 'As frentes europeia e do Pacífico avançam em paralelo e não dependem estritamente uma da outra; o capítulo é melhor descrito como narrativa cronológica multifacetada do que como cadeia única de derivação.',
  },
];

/** Task 1 não escreve cenas — apenas o inventário e o esqueleto. As Tasks
 *  seguintes (análogas às Tasks 4-8 de Fase 1) preenchem esta lista,
 *  família por família, a partir da atribuição definitiva registrada em
 *  docs/visual-personalizado/09-familias-historia.md. */
export const historia: SceneEntry[] = [];
