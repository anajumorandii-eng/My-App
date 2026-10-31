// Temas de Atualidades para a revisão por banca.
//
// A revisão de atualidades não pesquisa na internet: o prompt manda delimitar
// os fatos ao material recebido e à data dele (reviewSummaryPrompt.ts). Sem
// material, ou o resumo ficava vazio de fatos, ou o modelo completava de
// memória, com dados possivelmente superados. Cada tema aqui é esse material:
// fatos conferidos em fonte na data de `verifiedAt`, separados de contexto e
// de conceitos. Ao atualizar um fato, atualize também `verifiedAt` e a fonte.
//
// Nenhuma ficha afirma incidência em prova; "como pode cair" é orientação de
// estudo a partir do padrão das provas recentes, não previsão.

export interface CurrentAffairsTheme {
  id: string;
  title: string;
  /** Data (AAAA-MM-DD) em que os fatos foram conferidos nas fontes. */
  verifiedAt: string;
  sources: string[];
  text: string;
}

export const CURRENT_AFFAIRS_THEMES: CurrentAffairsTheme[] = [
  {
    id: 'ira-guerra-ormuz',
    title: 'Guerra do Irã e o Estreito de Ormuz',
    verifiedAt: '2026-10-31',
    sources: ['https://pt.wikipedia.org/wiki/Guerra_do_Ir%C3%A3', 'https://br.investing.com/news/commodities-news/marinha-da-guarda-revolucionaria-iraniana-diz-que-tres-petroleiros-pegaram-fogo-no-estreito-de-ormuz-2109949'],
    text: `FATOS VERIFICADOS
- Em 28/02/2026, Estados Unidos e Israel lançaram ataques coordenados contra o Irã. O líder supremo, aiatolá Ali Khamenei, foi morto; seu filho, Mojtaba Khamenei, assumiu como líder supremo em 08/03/2026.
- O Irã retaliou contra Israel e aliados regionais dos EUA e passou a restringir a navegação no Estreito de Ormuz.
- Um acordo interino em junho de 2026 interrompeu a troca direta de ataques, mas não firmou cessar-fogo duradouro nem normalizou o tráfego no estreito.
- No fim de outubro de 2026 o conflito seguia indefinido: em 29/10 petroleiros pegaram fogo após atingir minas em Ormuz (o número varia entre as fontes), e o petróleo Brent fechou a cerca de US$ 117 por barril em 30/10, segundo reportagens de mercado. O Irã condiciona a reabertura do estreito ao fim do bloqueio americano a seus portos e das sanções ao petróleo.

CONTEXTO
- Revolução Islâmica de 1979: queda do xá Reza Pahlevi, aliado dos EUA, e criação de uma república teocrática xiita liderada pelos aiatolás.
- Programa nuclear: o Irã é signatário do TNP; o acordo nuclear de 2015 limitava o enriquecimento de urânio em troca de alívio de sanções; os EUA saíram do acordo em 2018.
- "Eixo da Resistência": rede de aliados apoiados pelo Irã (Hezbollah no Líbano, Hamas em Gaza, Houthis no Iêmen, milícias no Iraque); os Houthis ameaçam também o estreito de Bab el-Mandeb, no mar Vermelho.
- A Fuvest 2025 cobrou o acordo China–Irã ligado à Nova Rota da Seda, à entrada do Irã nos BRICS e à tentativa de contornar o sistema de pagamentos em dólar.

CONCEITOS
- Ponto de estrangulamento (chokepoint) e segurança energética; choque do petróleo de 1973 como precedente; inflação de combustíveis e fertilizantes (ureia), com efeito sobre o agronegócio brasileiro.
- Xiitas × sunitas (Irã × Arábia Saudita); guerra por procuração (proxy); teocracia; sanções econômicas; multipolaridade.

COMO PODE CAIR
- Mapa do Golfo Pérsico com Ormuz; gráfico do preço do barril; relação entre conflito, petróleo, inflação e cadeias produtivas; comparação com 1973.`,
  },
  {
    id: 'gaza-palestina',
    title: 'Gaza, Israel e a questão palestina',
    verifiedAt: '2026-10-31',
    sources: ['https://www.opovo.com.br/noticias/mundo/2026/07/31/hamas-aceita-acordo-para-seu-desarmamento-e-retirada-de-israel-de-gaza.html'],
    text: `FATOS VERIFICADOS
- Em 07/10/2023, o Hamas atacou Israel, matando cerca de 1.200 pessoas e levando reféns para Gaza; a ofensiva israelense em resposta matou dezenas de milhares de palestinos, segundo as autoridades de saúde de Gaza, e destruiu grande parte da estrutura urbana do território.
- Um cessar-fogo entrou em vigor em outubro de 2025, com violações frequentes relatadas.
- Em 30/07/2026, o governo Trump anunciou que o "Conselho da Paz" fechou acordo para o desarmamento do Hamas; o grupo confirmou, condicionando a entrega das armas a uma força internacional de estabilização e à retirada das tropas israelenses. A implementação seguia incerta.
- A Fuvest 2026 cobrou a comparação de imagens de satélite de Gaza de 2021 e 2024 para identificar a destruição da paisagem urbana.

CONTEXTO
- Partilha da Palestina pela ONU (1947), criação de Israel (1948) e expulsão de palestinos (Nakba); Guerra dos Seis Dias (1967): ocupação da Cisjordânia, de Gaza e de Jerusalém Oriental.
- Intifadas (1987 e 2000); o Hamas surge em 1987, a partir da Irmandade Muçulmana; Acordos de Oslo (1993) e a Autoridade Palestina; o Hamas controla Gaza desde 2007.
- Assentamentos israelenses na Cisjordânia, considerados ilegais pela ONU e pela maioria dos países; Acordos de Abraão (2020) entre Israel e países árabes; mandado de prisão do Tribunal Penal Internacional contra Netanyahu (2024).
- Hezbollah, no Líbano, ligado ao Irã e enfraquecido pela guerra com Israel.

CONCEITOS
- Território, soberania e solução de dois Estados; refugiados e deslocamento forçado; crise humanitária; direito internacional humanitário; sensoriamento remoto e leitura de imagens de satélite.

COMO PODE CAIR
- Mapas da evolução territorial; imagens de satélite; charge sobre deslocamento de civis; relação entre conflito atual e partilha de 1947 e guerra de 1967.`,
  },
  {
    id: 'cop30-clima',
    title: 'COP30 em Belém e a agenda do clima',
    verifiedAt: '2026-10-31',
    sources: ['https://agenciagov.ebc.com.br/noticias/202511/cop30-aprova-o-pacote-belem-confira-as-decisoes-e-resultados-da-conferencia', 'https://anba.com.br/en/cop30-key-outcomes-of-the-summit/'],
    text: `FATOS VERIFICADOS
- A COP30, conferência do clima da ONU, ocorreu em Belém (PA) e terminou em 22/11/2025.
- Foi aprovado o "Pacote de Belém", com 29 decisões adotadas por consenso.
- O roteiro (mapa do caminho) para a transição para longe dos combustíveis fósseis foi retirado do texto final; ficou como iniciativa voluntária de um grupo de países.
- O pacote pede triplicar o financiamento para adaptação em países em desenvolvimento até 2035 e cita a meta de mobilizar US$ 1,3 trilhão por ano até 2035.
- Foi lançado o TFFF (Fundo Florestas Tropicais para Sempre): pagamentos de longo prazo a países que mantêm floresta em pé, com meta de US$ 25 bilhões; cerca de 20% destinados a povos indígenas e comunidades locais. Os valores já captados variam entre as fontes.

CONTEXTO
- Acordo de Paris (2015): limitar o aquecimento a bem menos de 2 °C, buscando 1,5 °C; metas nacionais (NDCs).
- Protocolo de Kyoto (1997): origem do mercado de carbono.

CONCEITOS
- Mitigação (reduzir emissões) × adaptação (conviver com os efeitos).
- Justiça climática e responsabilidades comuns, porém diferenciadas.
- Serviços ecossistêmicos da floresta; desmatamento e emissões; pagamento por serviços ambientais.

COMO PODE CAIR
- Texto ou gráfico sobre emissões, desmatamento ou eventos extremos, cobrando o mecanismo (efeito estufa, ciclo do carbono) e a escala (local × global).`,
  },
  {
    id: 'tarifaco-comercio',
    title: 'Tarifaço dos EUA e o comércio exterior brasileiro',
    verifiedAt: '2026-10-31',
    sources: ['https://www.aosfatos.org/noticias/trump-nao-cancelou-tarifa/'],
    text: `FATOS VERIFICADOS
- Em 1º/08/2025 passou a valer a tarifa de 50% dos EUA sobre parte dos produtos brasileiros; itens como aviões e suco de laranja ficaram de fora, e carnes, café e frutas foram atingidos.
- Em outubro de 2025 começaram negociações após encontro entre Lula e Trump na Malásia.
- Segundo o Aos Fatos, em fevereiro de 2026 a Suprema Corte dos EUA derrubou o tarifaço; em julho de 2026 os EUA impuseram novas tributações, entre elas 25% sobre aço e alumínio importados.

CONTEXTO
- Protecionismo × livre-comércio; OMC e regras multilaterais.
- Pauta exportadora brasileira concentrada em commodities; China como principal parceiro comercial, EUA como importante comprador de manufaturados.

CONCEITOS
- Tarifa, balança comercial, cadeias globais de valor, diversificação de mercados, multipolaridade.

COMO PODE CAIR
- Gráfico de exportações por destino ou por produto; relação entre política comercial de uma potência e economia regional (café, carne, aço).`,
  },
  {
    id: 'mercosul-ue',
    title: 'Acordo Mercosul–União Europeia',
    verifiedAt: '2026-10-31',
    sources: ['https://www.poder360.com.br/poder-internacional/sem-lula-ue-e-mercosul-assinam-acordo-neste-sabado/', 'https://www.barbieriadvogados.com/acordo-mercosul-uniao-europeia/'],
    text: `FATOS VERIFICADOS
- Assinado em 17/01/2026, em Assunção (Paraguai), após cerca de 26 anos de negociação: um Acordo de Parceria e um Acordo Comercial Interino.
- O Conselho da UE aprovou o texto em 09/01/2026 por maioria qualificada; a França votou contra.
- Em 21/01/2026, o Parlamento Europeu aprovou enviar o acordo ao Tribunal de Justiça da UE para análise de compatibilidade.
- Segundo fonte jurídica atualizada em outubro de 2026, o acordo é aplicado provisoriamente desde 1º/05/2026 entre a UE e Argentina, Brasil, Paraguai e Uruguai, mas a ratificação completa europeia segue pendente.

CONTEXTO
- Mercosul (1991) como união aduaneira imperfeita; UE como mercado comum.
- Resistência de agricultores europeus e preocupações ambientais (desmatamento) como obstáculos.

CONCEITOS
- Blocos econômicos, tarifa externa comum, regionalismo, cláusulas ambientais em acordos comerciais.

COMO PODE CAIR
- Comparação entre tipos de bloco; efeitos esperados sobre agronegócio e indústria; interesses divergentes entre países europeus.`,
  },
  {
    id: 'mapa-da-fome',
    title: 'Brasil fora do Mapa da Fome',
    verifiedAt: '2026-10-31',
    sources: ['https://www.opovo.com.br/noticias/brasil/2025/07/28/brasil-sai-do-mapa-da-fome-anuncia-onu.html'],
    text: `FATOS VERIFICADOS
- O relatório SOFI 2025 da ONU (FAO e outras agências), divulgado em 28/07/2025, indicou que o Brasil saiu do Mapa da Fome.
- Critério: prevalência de subnutrição abaixo de 2,5% da população, em média de três anos (2022–2024).
- O país já havia saído em 2014 e voltou ao mapa no triênio 2018–2020.

CONTEXTO
- O governo atribuiu o resultado a políticas de redução da pobreza, agricultura familiar e alimentação escolar; atribuição causal é interpretação, não dado do relatório.

CONCEITOS
- Subnutrição (indicador PoU) × insegurança alimentar × pobreza: medidas diferentes.
- Média móvel trienal; segurança alimentar; políticas de transferência de renda.

COMO PODE CAIR
- Gráfico de série histórica: ler média trienal, distinguir valor absoluto e porcentagem, não confundir correlação com causa.`,
  },
  {
    id: 'saude-zoonoses-vacinas',
    title: 'Arboviroses, gripe aviária e vacinas',
    verifiedAt: '2026-10-31',
    sources: ['https://comprerural.com/ministerio-da-agricultura-confirma-primeiro-caso-de-gripe-aviaria-em-granja-comercial-no-brasil/'],
    text: `FATOS VERIFICADOS
- Em maio de 2025 o Ministério da Agricultura confirmou o primeiro foco de gripe aviária H5N1 em granja comercial no Brasil, em Montenegro (RS); as aves foram eliminadas, mais de 20 destinos suspenderam temporariamente compras de frango, e o ministro afirmou em 27/05/2025 que o foco estava contido.
- A vacina contra a dengue Qdenga passou a ser oferecida pelo SUS em 2024 (tema de questão da Fuvest 2026).

CONTEXTO
- Arboviroses (dengue, chikungunya, zika, oropouche) dependem de vetores; temperatura e chuva alteram a distribuição e o ciclo dos mosquitos.
- Zoonoses: patógenos que passam de animais para humanos; vigilância em saúde única (humana, animal, ambiental).

CONCEITOS
- Vacina de vírus atenuado × inativado × de RNA; imunidade ativa e memória.
- Vetor × agente etiológico; transmissão; mutação e rearranjo em vírus influenza.

COMO PODE CAIR
- Texto de notícia com pergunta de Biologia: tipo de vacina, ciclo do vetor, por que o aquecimento amplia a área de transmissão.`,
  },
  {
    id: 'energia-margem-equatorial',
    title: 'Transição energética e petróleo na Margem Equatorial',
    verifiedAt: '2026-10-31',
    sources: ['https://www.opovo.com.br/noticias/economia/2025/10/20/petrobras-obtem-licenca-exploratoria-em-aguas-profundas-do-amapa.html'],
    text: `FATOS VERIFICADOS
- Em 20/10/2025 o Ibama concedeu à Petrobras licença de operação para perfurar o poço exploratório Morpho, no bloco FZA-M-059, na Bacia da Foz do Amazonas, a cerca de 175 km da costa do Amapá.
- O Ibama havia negado a licença em maio de 2023; a concessão de 2025 foi contestada por entidades socioambientais.

CONTEXTO
- Margem Equatorial: faixa costeira do Amapá ao Rio Grande do Norte, apontada como nova fronteira petrolífera.
- Tensão entre arrecadação e segurança energética, de um lado, e risco ambiental e compromissos climáticos, de outro, no mesmo ano em que o Brasil sediou a COP30.

CONCEITOS
- Matriz energética × matriz elétrica (a elétrica brasileira é majoritariamente renovável).
- Fontes renováveis e não renováveis; licenciamento ambiental; transição energética; minerais críticos (lítio, terras raras).

COMO PODE CAIR
- Gráfico da matriz energética; impactos de cada fonte; contradição entre expansão do petróleo e metas climáticas.`,
  },
  {
    id: 'trabalho-6x1',
    title: 'Trabalho: fim da escala 6x1 e plataformas digitais',
    verifiedAt: '2026-10-31',
    sources: ['https://www.gazetadopovo.com.br/economia/senado-aprova-pec-do-fim-da-escala-6x1/'],
    text: `FATOS VERIFICADOS
- A Câmara aprovou em maio de 2026 a PEC que reduz a jornada máxima de 44 para 40 horas semanais e acaba com a escala 6x1.
- Segundo a Gazeta do Povo, o Senado aprovou a PEC em dois turnos em 15/10/2026, com um voto contrário, e o texto seguiu para promulgação. O texto final e eventuais ajustes setoriais devem ser conferidos na fonte oficial.

CONTEXTO
- Jornada de 44 horas desde a Constituição de 1988; CLT (1943) na Era Vargas.
- Em março de 2025, a Fuvest 2026 usou o uso do termo "CLT" como xingamento entre jovens nas redes sociais para discutir trabalho.

CONCEITOS
- Precarização, informalidade, "uberização" e trabalho por plataformas; direitos trabalhistas; produtividade e tempo livre.

COMO PODE CAIR
- Texto ou charge sobre trabalho contemporâneo cobrando conceito sociológico (precarização, alienação) ou contexto histórico da CLT.`,
  },
  {
    id: 'ia-soberania-digital',
    title: 'Inteligência artificial, data centers e soberania digital',
    verifiedAt: '2026-10-31',
    sources: ['https://focoenem.com.br/vestibulares/temas-de-atualidades-que-podem-cair-na-fuvest-2027/'],
    text: `FATOS VERIFICADOS
- O simulado da Fuvest 2027 trouxe questão sobre concentração de cabos submarinos e data centers no Norte Global e seus efeitos sobre a soberania digital de outros países (segundo análise publicada do simulado).
- A Fuvest 2025 cobrou plataformas de dados (Big Tech) e a 2026 usou imagem gerada por IA.

CONTEXTO
- Data centers consomem muita energia e água para resfriamento; disputa entre potências por chips e IA.
- Regulação de IA e de plataformas em discussão no Brasil e no exterior.

CONCEITOS
- Sociedade da informação, algoritmos e bolhas, desinformação, privacidade e dados pessoais, soberania digital, desigualdade de acesso.

COMO PODE CAIR
- Texto sobre IA ou redes cobrando conceito sociológico ou filosófico (indústria cultural, vigilância) ou impacto ambiental da infraestrutura digital.`,
  },
  {
    id: 'indigenas-marco-temporal',
    title: 'Povos indígenas, marco temporal e garimpo',
    verifiedAt: '2026-10-31',
    // Sem link: os itens de prova vêm das questões Fuvest do banco do app, e as
    // decisões (STF 2023, Lei 14.701/2023) são fatos consolidados.
    sources: [],
    text: `FATOS VERIFICADOS
- A Fuvest 2026 cobrou charge sobre o marco temporal, e a Fuvest 2025 cobrou dados de garimpo ilegal em terras indígenas na Amazônia.
- Marco temporal: tese de que só seriam demarcáveis terras ocupadas por indígenas em 05/10/1988. O STF a declarou inconstitucional em setembro de 2023; o Congresso aprovou em seguida a Lei 14.701/2023, que a retomou, mantendo o conflito entre os Poderes.

CONTEXTO
- Constituição de 1988 (arts. 231 e 232): direitos originários sobre as terras tradicionalmente ocupadas.
- Garimpo ilegal: contaminação por mercúrio, crise sanitária, desmatamento.

CONCEITOS
- Direito originário × direito adquirido; territorialidade; etnocentrismo; conflitos agrários; separação de Poderes.

COMO PODE CAIR
- Charge ou mapa de terras indígenas e desmatamento, cobrando interpretação e o conceito jurídico ou sociológico em disputa.`,
  },
];
