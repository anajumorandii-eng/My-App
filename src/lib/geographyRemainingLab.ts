/** Capítulos em que a própria relação espacial é manipulada pela prancha. */
export type GeographyRemainingId = 'digital-map' | 'map-elements' | 'world-basin' | 'brazilian-basins';
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
};
