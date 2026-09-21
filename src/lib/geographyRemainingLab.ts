/** Capítulos em que a própria relação espacial é manipulada pela prancha. */
export type GeographyRemainingId = 'digital-map' | 'map-elements' | 'world-basin' | 'brazilian-basins' | 'commons' | 'supply-chain' | 'technopole' | 'geoeconomics' | 'mining' | 'agrarian';
export type GeographyCase = { label: string; place: string; action: string; inference: string };
export type GeographyMechanism = { chapterId: string; title: string; question: string; relation: string; cases: readonly [GeographyCase, GeographyCase, GeographyCase]; caution: string };

export const GEOGRAPHY_REMAINING: Record<GeographyRemainingId, GeographyMechanism> = {
  'digital-map': {
    chapterId: 'summary-geografia-cartografia-digital', title: 'Sobreposição em um SIG',
    question: 'O que cada camada acrescenta à escolha de um trajeto?',
    relation: 'camadas georreferenciadas → cruzamento espacial → hipótese de localização',
    cases: [
      { label: 'Relevo', place: 'Território hipotético', action: 'Observe declividades no terreno.', inference: 'A inclinação revela possíveis obstáculos à estrada.' },
      { label: 'Hidrografia', place: 'Mesmo território', action: 'Sobreponha rios e áreas sujeitas à inundação.', inference: 'Agora o trajeto também precisa considerar travessias e cheias.' },
      { label: 'Ocupação', place: 'Mesmo território', action: 'Acrescente áreas construídas.', inference: 'As três camadas permitem comparar traçados; nenhuma decide sozinha a obra.' },
    ], caution: 'Camadas fictícias alinhadas em um mesmo sistema de referência; não são dados de uma cidade real.',
  },
  'map-elements': {
    chapterId: 'summary-geografia-representacoes-graficas-e-cartograficas', title: 'Decodifique um mapa temático',
    question: 'Que informação falta para interpretar uma mancha colorida?',
    relation: 'título + legenda + escala + orientação + fonte → leitura crítica',
    cases: [
      { label: 'Legenda', place: 'Mapa hipotético', action: 'Leia o símbolo azul na legenda.', inference: 'A legenda declara que azul significa superfície de água; a cor isolada não basta.' },
      { label: 'Escala', place: 'Mesmo mapa', action: 'Compare o segmento no papel com a barra de escala.', inference: 'A escala permite converter uma medida gráfica em distância no terreno.' },
      { label: 'Fonte', place: 'Mesmo mapa', action: 'Consulte a origem e a data dos dados.', inference: 'Dados antigos ou sem procedência limitam conclusões sobre a situação atual.' },
    ], caution: 'Mapa fictício: a distribuição das manchas não representa uma região real.',
  },
  'world-basin': {
    chapterId: 'summary-geografia-hidrogeografia-mundial', title: 'Usos ligados pela bacia',
    question: 'Por que uma retirada a montante afeta usuários a jusante?',
    relation: 'cabeceira + afluentes + captações → vazão e qualidade a jusante',
    cases: [
      { label: 'Captação', place: 'Montante', action: 'Retire água antes da confluência.', inference: 'Dependendo da retirada, pode chegar menos água ao curso principal.' },
      { label: 'Efluente', place: 'Curso médio', action: 'Lance efluente em um trecho do rio.', inference: 'Sua dispersão pode afetar a qualidade da água a jusante.' },
      { label: 'Coordenação', place: 'Bacia inteira', action: 'Compare os usos ao longo do curso e dos afluentes.', inference: 'A gestão precisa considerar a bacia, inclusive quando cruza fronteiras.' },
    ], caution: 'Rede hidrográfica hipotética; setas indicam direção do escoamento, não vazões reais.',
  },
  'brazilian-basins': {
    chapterId: 'summary-geografia-hidrogeografia-do-brasil', title: 'Percurso em uma bacia brasileira',
    question: 'Como usos sucessivos alteram o sistema hídrico?',
    relation: 'cabeceira → afluentes → barragem → jusante',
    cases: [
      { label: 'Cabeceira', place: 'Nascentes', action: 'Observe a cobertura vegetal no início do curso.', inference: 'A conservação do solo pode reduzir erosão e transporte de sedimentos.' },
      { label: 'Barragem', place: 'Curso principal', action: 'Interrompa o escoamento com um reservatório.', inference: 'A operação altera regimes de água a montante e a jusante.' },
      { label: 'Jusante', place: 'Trecho inferior', action: 'Integre contribuições dos afluentes e usos anteriores.', inference: 'O planejamento precisa considerar toda a área drenada, não só o canal principal.' },
    ], caution: 'Diagrama de bacia hipotética; as bacias brasileiras diferem em extensão, regime e uso.',
  },
  commons: {
    chapterId: 'summary-geografia-desafios-ambientais-do-seculo-xxi', title: 'Um recurso compartilhado', question: 'Por que o uso individual pode esgotar um bem comum?',
    relation: 'benefício privado imediato → pressão acumulada → recurso comum comprometido',
    cases: [
      { label: 'Uso isolado', place: 'Bem comum hipotético', action: 'Observe o ganho de quem retira primeiro.', inference: 'O benefício fica com o usuário, mas a redução do estoque é compartilhada.' },
      { label: 'Pressão somada', place: 'Mesmo bem', action: 'Acrescente retiradas de vários usuários.', inference: 'Decisões semelhantes se acumulam e podem ultrapassar a capacidade de reposição.' },
      { label: 'Regra coletiva', place: 'Gestão comum', action: 'Compare limites, fiscalização e cooperação.', inference: 'A coordenação procura alinhar o uso presente à permanência do recurso.' },
    ], caution: 'Esquema didático: não calcula a disponibilidade de um recurso real nem substitui dados ambientais locais.',
  },
  'supply-chain': {
    chapterId: 'summary-geografia-globalizacao-e-processos-economicos-atuais', title: 'Uma cadeia global de valor', question: 'Como uma etapa distante interfere no produto que chega ao mercado?',
    relation: 'projeto + produção distribuída + transporte + mercado → cadeia global de valor',
    cases: [
      { label: 'Projeto', place: 'Nó de comando', action: 'Localize onde se definem produto, marca e especificações.', inference: 'Funções de comando podem se concentrar em poucos lugares da rede.' },
      { label: 'Produção', place: 'Etapas distribuídas', action: 'Siga peças e serviços produzidos em lugares diferentes.', inference: 'A produção pode ser fragmentada entre territórios especializados.' },
      { label: 'Circulação', place: 'Corredor logístico', action: 'Observe a passagem por portos, estradas ou dados.', inference: 'O produto depende de fluxos materiais e informacionais para alcançar o mercado.' },
    ], caution: 'Cadeia hipotética: empresas reais combinam etapas e países de formas diferentes.',
  },
  technopole: {
    chapterId: 'summary-geografia-industria-ii', title: 'Condições de um tecnopolo', question: 'Por que atividades inovadoras tendem a se concentrar em certos lugares?',
    relation: 'pesquisa + capital + infraestrutura + empresas → ambiente de inovação',
    cases: [
      { label: 'Pesquisa', place: 'Universidade e centros técnicos', action: 'Comece pela produção e circulação de conhecimento.', inference: 'A proximidade com pesquisa amplia intercâmbios e formação especializada.' },
      { label: 'Capital', place: 'Rede de investimento', action: 'Acrescente recursos para transformar pesquisa em produto.', inference: 'Financiamento e serviços especializados ajudam a viabilizar inovação.' },
      { label: 'Conexões', place: 'Tecnopolo', action: 'Conecte empresas, infraestrutura e mão de obra qualificada.', inference: 'A aglomeração favorece trocas, mas não torna a inovação automática.' },
    ], caution: 'Diagrama de relações territoriais, não um mapa de tecnopolos reais.',
  },
  geoeconomics: {
    chapterId: 'summary-geografia-gedeconomia-mundial', title: 'Instrumentos geoeconômicos', question: 'Como uma decisão econômica pode produzir efeito geopolítico?',
    relation: 'instrumento econômico → alteração de fluxos → pressão ou negociação internacional',
    cases: [
      { label: 'Tarifa', place: 'Fronteira comercial', action: 'Eleve o custo de entrada de um produto.', inference: 'A tarifa altera incentivos de comércio sem ser apenas uma medida técnica.' },
      { label: 'Sanção', place: 'Fluxos financeiros e comerciais', action: 'Restrinja transações ou acesso a mercados.', inference: 'A restrição busca pressionar decisões, mas também pode redistribuir custos.' },
      { label: 'Tecnologia', place: 'Cadeia estratégica', action: 'Controle exportações de um insumo ou tecnologia.', inference: 'Dependências produtivas tornam o acesso tecnológico uma fonte de poder.' },
    ], caution: 'O esquema mostra mecanismos possíveis; efeitos concretos dependem de regras, aliados e alternativas de cada caso.',
  },
  mining: {
    chapterId: 'summary-geografia-producao-mineral', title: 'Do depósito ao impacto', question: 'Que relações espaciais ligam a extração mineral ao território?',
    relation: 'jazida + extração + beneficiamento + transporte + rejeitos → efeitos territoriais',
    cases: [
      { label: 'Jazida', place: 'Subsolo', action: 'Parta da ocorrência geológica do mineral.', inference: 'A distribuição desigual das jazidas condiciona onde a extração pode ocorrer.' },
      { label: 'Fluxo produtivo', place: 'Mina e infraestrutura', action: 'Siga o minério até beneficiamento e transporte.', inference: 'A atividade depende de energia, água e corredores logísticos além da mina.' },
      { label: 'Gestão de rejeitos', place: 'Entorno da operação', action: 'Inclua resíduos e monitoramento no percurso.', inference: 'O planejamento territorial precisa incorporar riscos e impactos socioambientais.' },
    ], caution: 'Fluxo didático: não representa uma mina, barragem ou empresa específica.',
  },
  agrarian: {
    chapterId: 'summary-geografia-o-espaco-agrario-brasileiro', title: 'Decisões no espaço agrário', question: 'Como terra, técnica e mercado reorganizam o campo brasileiro?',
    relation: 'estrutura fundiária + técnica + trabalho + mercado → organização agrária',
    cases: [
      { label: 'Terra', place: 'Estrutura fundiária', action: 'Compare a distribuição e o acesso à terra.', inference: 'A propriedade e a posse influenciam quem decide o uso do solo e em que escala.' },
      { label: 'Técnica', place: 'Produção rural', action: 'Acrescente máquinas, insumos e crédito.', inference: 'A modernização pode elevar produtividade, mas seu acesso é desigual.' },
      { label: 'Mercado', place: 'Circuito campo-cidade', action: 'Siga a produção até processamento e consumo.', inference: 'A produção rural se articula a preços, logística e demandas urbanas e externas.' },
    ], caution: 'Não reduz o campo a um único modelo: agricultura familiar e empresarial têm formas e inserções diversas.',
  },
};
