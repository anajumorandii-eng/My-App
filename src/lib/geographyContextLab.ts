/** Relações territoriais que pedem comparação entre recortes, não um cálculo. */
export type GeographyContextId =
  | 'environmental-governance'
  | 'eu-integration'
  | 'electricity-system'
  | 'population-flows'
  | 'trade-network'
  | 'urban-conflict';

export interface GeographyContextCase {
  label: string;
  location: string;
  observation: string;
  conclusion: string;
}

export interface GeographyContext {
  chapterId: string;
  title: string;
  question: string;
  relation: string;
  cases: readonly [GeographyContextCase, GeographyContextCase, GeographyContextCase];
  caution: string;
}

export const GEOGRAPHY_CONTEXTS: Record<GeographyContextId, GeographyContext> = {
  'environmental-governance': {
    chapterId: 'summary-geografia-geopolitica-ambiental',
    title: 'Uma questão ambiental em escalas',
    question: 'Por que uma decisão territorial pode exigir coordenação para além de suas fronteiras?',
    relation: 'território local + fluxos transfronteiriços + acordos → governança ambiental',
    cases: [
      { label: 'Território', location: 'Área de decisão', observation: 'Comece por quem usa, protege ou transforma um recurso em um lugar concreto.', conclusion: 'Impactos e interesses surgem em territórios situados, com atores e regras próprios.' },
      { label: 'Fluxo', location: 'Além da fronteira', observation: 'Siga água, ar, biodiversidade ou emissões para além do limite político.', conclusion: 'O efeito ambiental pode alcançar lugares que não participaram da decisão inicial.' },
      { label: 'Coordenação', location: 'Escala internacional', observation: 'Compare acordos, financiamento e fiscalização entre os envolvidos.', conclusion: 'A cooperação não elimina conflitos, mas cria meios para negociar responsabilidades compartilhadas.' },
    ],
    caution: 'Esquema de escalas: não representa uma negociação, país ou tratado específico.',
  },
  'eu-integration': {
    chapterId: 'summary-geografia-uniao-europeia',
    title: 'Integração europeia em prática',
    question: 'Que conexões a integração regional aproxima — e quais decisões continuam nacionais?',
    relation: 'circulação + regras comuns + decisões nacionais → integração regional',
    cases: [
      { label: 'Circulação', location: 'Entre membros', observation: 'Observe a redução de barreiras para bens, pessoas e serviços em espaços integrados.', conclusion: 'A integração altera os fluxos cotidianos sem tornar os territórios idênticos.' },
      { label: 'Regra comum', location: 'Instituições do bloco', observation: 'Acrescente normas e instâncias que coordenam parte das decisões.', conclusion: 'Regras compartilhadas criam compromissos, mas sua aplicação envolve negociação política.' },
      { label: 'Decisão nacional', location: 'Estados membros', observation: 'Compare competências do bloco com políticas que cada Estado preserva.', conclusion: 'A integração combina ação conjunta e soberanias nacionais; não equivale a um Estado único.' },
    ],
    caution: 'Diagrama conceitual: a União Europeia tem instituições e exceções que variam conforme o tema.',
  },
  'electricity-system': {
    chapterId: 'summary-geografia-energia-eletrica-no-brasil',
    title: 'Equilíbrio do sistema elétrico',
    question: 'Como fontes, transmissão e consumo precisam se articular para a eletricidade chegar?',
    relation: 'geração + transmissão + demanda → operação do sistema elétrico',
    cases: [
      { label: 'Geração', location: 'Usinas e fontes', observation: 'Compare fontes que produzem em ritmos e lugares diferentes.', conclusion: 'A oferta depende tanto da fonte disponível quanto de sua localização no território.' },
      { label: 'Transmissão', location: 'Rede interligada', observation: 'Siga a eletricidade entre áreas produtoras e centros consumidores.', conclusion: 'Linhas e subestações conectam distâncias, mas também criam limites de capacidade e perdas.' },
      { label: 'Demanda', location: 'Cidades e atividades', observation: 'Observe como o consumo varia ao longo do dia e entre regiões.', conclusion: 'Operar o sistema é equilibrar oferta e demanda continuamente, com planejamento de longo prazo.' },
    ],
    caution: 'Rede hipotética: não informa a participação real de fontes nem a operação de uma usina brasileira.',
  },
  'population-flows': {
    chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
    title: 'Fluxos e redes migratórias',
    question: 'Como uma migração reorganiza simultaneamente origem, destino e trajetos?',
    relation: 'origem + deslocamento + destino → redes migratórias',
    cases: [
      { label: 'Origem', location: 'Lugar de partida', observation: 'Identifique condições de trabalho, família, moradia ou conflito que influenciam a decisão.', conclusion: 'A saída se relaciona a condições concretas, mas pessoas em situação semelhante podem fazer escolhas diferentes.' },
      { label: 'Trajeto', location: 'Corredor migratório', observation: 'Acompanhe redes de informação, transporte e apoio que tornam um caminho viável.', conclusion: 'A migração não é apenas uma linha no mapa: redes sociais e custos moldam o percurso.' },
      { label: 'Destino', location: 'Lugar de chegada', observation: 'Compare trabalho, serviços, moradia e vínculos disponíveis no novo lugar.', conclusion: 'A chegada reorganiza tanto o destino quanto as relações mantidas com a origem.' },
    ],
    caution: 'Fluxo hipotético: não representa uma rota migratória real nem reduz migração a uma causa única.',
  },
  'trade-network': {
    chapterId: 'summary-geografia-os-fluxos-do-comercio-externo',
    title: 'Uma rede de comércio exterior',
    question: 'Como produção, logística e destino se conectam em um fluxo de exportação?',
    relation: 'produção + corredor logístico + mercado externo → comércio exterior',
    cases: [
      { label: 'Produção', location: 'Região produtora', observation: 'Comece por bens e serviços que entram na pauta comercial.', conclusion: 'O que se exporta depende de especializações produtivas, tecnologia e condições do território.' },
      { label: 'Logística', location: 'Portos e corredores', observation: 'Siga o bem por estradas, ferrovias, terminais e portos.', conclusion: 'Infraestrutura conecta produtores a mercados, mas custos e gargalos alteram a competitividade.' },
      { label: 'Mercado', location: 'Parceiros externos', observation: 'Compare destinos, preços e exigências de compradores.', conclusion: 'Dependência de poucos produtos ou parceiros pode aumentar a vulnerabilidade a mudanças externas.' },
    ],
    caution: 'Rede ilustrativa: não retrata uma pauta, porto ou parceiro comercial específico.',
  },
  'urban-conflict': {
    chapterId: 'summary-geografia-tensoes-geopoliticas-na-europa',
    title: 'Tensões no território europeu',
    question: 'Como fronteiras, identidades e alianças podem se sobrepor em uma tensão geopolítica?',
    relation: 'território + identidades + alianças → tensões geopolíticas',
    cases: [
      { label: 'Território', location: 'Área disputada', observation: 'Localize fronteiras, recursos, rotas e posições estratégicas em jogo.', conclusion: 'O espaço importa porque concentra acessos e delimita quem exerce autoridade.' },
      { label: 'Identidades', location: 'Grupos e comunidades', observation: 'Compare memórias, línguas e pertencimentos mobilizados por diferentes atores.', conclusion: 'Identidade pode dar sentido político ao conflito, sem explicar sozinha suas causas.' },
      { label: 'Alianças', location: 'Escala regional', observation: 'Observe apoios diplomáticos, econômicos ou militares que conectam atores externos.', conclusion: 'Alianças ampliam a escala de uma tensão local e alteram os custos de negociação.' },
    ],
    caution: 'Esquema analítico: não simplifica conflitos europeus a três causas nem substitui a cronologia de cada caso.',
  },
};
