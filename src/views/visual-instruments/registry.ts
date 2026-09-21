import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from '../visual-boards/types';
import { cartesianInstrument } from './CartesianInstrument';
import { analyticInstrument } from './AnalyticInstrument';
import { solidInstrument } from './SolidInstrument';
import { planarGeometryInstrument } from './PlanarGeometryInstrument';
import { areaGeometryInstrument } from './AreaGeometryInstrument';
import type { FamilyId } from '../../lib/curveFamilies';
import type { ConfigId } from '../../lib/analyticPlane';
import type { SolidConfigId } from '../../lib/solidInstruments';
import type { PlanarConfigId } from '../../lib/planarGeometry';
import type { AreaConfigId } from '../../lib/areaGeometry';
import { algebraInstrument } from './AlgebraInstrument';
import type { AlgebraConfigId } from '../../lib/algebraLab';
import { matrixInstrument } from './MatrixInstrument';
import type { MatrixConfigId } from '../../lib/matrixLab';
import { sequenceInstrument } from './SequenceInstrument';
import type { SequenceConfigId } from '../../lib/sequenceLab';
import { quantitiesInstrument } from './QuantitiesInstrument';
import type { QuantitiesConfigId } from '../../lib/quantitiesLab';
import { remainingMathInstrument } from './RemainingMathInstrument';
import type { RemainingId } from '../../lib/remainingMath';
import { kinematicsInstrument } from './KinematicsInstrument';
import type { KinematicsId } from '../../lib/kinematicsLab';
import { vectorsInstrument } from './VectorsInstrument';
import type { VectorId } from '../../lib/vectorsLab';
import { dynamicsInstrument } from './DynamicsInstrument';
import type { DynamicsId } from '../../lib/dynamicsLab';
import { orbitalInstrument } from './OrbitalInstrument';
import type { OrbitalId } from '../../lib/orbitalLab';
import { energyInstrument } from './EnergyInstrument';
import type { EnergyId } from '../../lib/energyLab';
import { thermoInstrument } from './ThermoInstrument';
import type { ThermoId } from '../../lib/thermoLab';
import { electricInstrument } from './ElectricInstrument';
import type { ElectricId } from '../../lib/electricLab';
import { electrostaticsInstrument } from './ElectrostaticsInstrument';
import type { ElectrostaticsId } from '../../lib/electrostaticsLab';
import { wavesInstrument } from './WavesInstrument';
import type { WavesId } from '../../lib/wavesLab';
import { magnetismInstrument } from './MagnetismInstrument';
import type { MagnetismId } from '../../lib/magnetismLab';
import { opticsInstrument } from './OpticsInstrument';
import type { OpticsId } from '../../lib/opticsLab';
import { mechanicsFinalInstrument } from './MechanicsFinalInstrument';
import type { MechanicsFinalId } from '../../lib/mechanicsFinalLab';
import { physicsRemainingInstrument } from './PhysicsRemainingInstrument';
import type { PhysicsRemainingId } from '../../lib/physicsRemainingLab';
import { electrochemistryInstrument } from './ElectrochemistryInstrument';
import type { ElectrochemistryId } from '../../lib/electrochemistryLab';
import { biologyInstrument } from './BiologyInstrument';
import type { BiologyInstrumentId } from '../../lib/biologyInstrumentLab';
import { geographyInstrument } from './GeographyInstrument';
import type { GeographyInstrumentId } from '../../lib/geographyInstrumentLab';
import { historyInstrument } from './HistoryInstrument';
import type { HistoryInstrumentId } from '../../lib/historyInstrumentLab';
import { grammarInstrument } from './GrammarInstrument';
import type { GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
import { englishInstrument } from './EnglishInstrument';
import type { EnglishInstrumentId } from '../../lib/englishInstrumentLab';

/**
 * Quais capítulos ganham prancha manipulável, e com que instrumento.
 *
 * Irmão do registro de pranchas autorais (`visual-boards/registry.ts`), e
 * consultado depois dele: cena desenhada à mão sempre ganha do instrumento
 * genérico quando existe para aquele capítulo.
 *
 * A diferença de economia entre os dois é a razão de este existir. A auditoria
 * mostrou 18 das 26 pranchas autorais alcançando exatamente um capítulo — o
 * currículo tem um capítulo por fenômeno, então cena desenhada não escala. Um
 * instrumento, não: o mesmo plano cartesiano serve treze capítulos de
 * Matemática porque todos eles são, literalmente, uma curva com parâmetros.
 *
 * O que NÃO muda é a regra de não emprestar ilustração: o instrumento só entra
 * onde ele é o objeto do capítulo. "Função quadrática" recebe a parábola porque
 * a parábola é o assunto; "Determinantes" não recebe nada, e continua no aviso,
 * até existir um instrumento de matriz. Preencher tela com o que estiver à mão
 * continua sendo o erro que o `ap_mat_fuvest_110` nomeia.
 */
export interface InstrumentEntry {
  id: string;
  subject: string;
  /** Todos os termos precisam aparecer no texto do capítulo. */
  keywords: string[];
  /** Quando um título é prefixo de outro, exige o tópico inteiro. */
  exactTopic?: string;
  Component: ComponentType<BoardProps>;
}

/** Atalho: uma entrada de plano cartesiano, com a família já embutida. */
function plano(id: string, keywords: string[], family: FamilyId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, Component: cartesianInstrument(family) };
}

/** Atalho: uma entrada de plano analítico, com a configuração já embutida. */
function analitico(id: string, keywords: string[], config: ConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, Component: analyticInstrument(config) };
}

/** Atalho: uma entrada de sólido, com a configuração já embutida. */
function solido(id: string, keywords: string[], config: SolidConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, Component: solidInstrument(config) };
}

function geometriaPlana(id: string, keywords: string[], config: PlanarConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, Component: planarGeometryInstrument(config) };
}

function medidaPlana(id: string, keywords: string[], config: AreaConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, exactTopic: keywords[0], Component: areaGeometryInstrument(config) };
}

/** Álgebra exige leitura de cada forma simbólica; títulos parecidos não bastam. */
function algebra(id: string, topic: string, config: AlgebraConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords: [topic], exactTopic: topic, Component: algebraInstrument(config) };
}

function matriz(id: string, topic: string, config: MatrixConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords: [topic], exactTopic: topic, Component: matrixInstrument(config) };
}

function sequencia(id: string, topic: string, config: SequenceConfigId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords: [topic], exactTopic: topic, Component: sequenceInstrument(config) };
}
function quantidade(id:string,topic:string,config:QuantitiesConfigId):InstrumentEntry{return{id,subject:'Matemática',keywords:[topic],exactTopic:topic,Component:quantitiesInstrument(config)}}
function restante(id:string,topic:string,config:RemainingId):InstrumentEntry{return{id,subject:'Matemática',keywords:[topic],exactTopic:topic,Component:remainingMathInstrument(config)}}
function cinetica(id:string,topic:string,config:KinematicsId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:kinematicsInstrument(config)}}
function vetor(id:string,topic:string,config:VectorId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:vectorsInstrument(config)}}
function dinamica(id:string,topic:string,config:DynamicsId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:dynamicsInstrument(config)}}
function orbital(id:string,topic:string,config:OrbitalId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:orbitalInstrument(config)}}
function energia(id:string,topic:string,config:EnergyId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:energyInstrument(config)}}
function termo(id:string,topic:string,config:ThermoId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:thermoInstrument(config)}}
function eletrico(id:string,topic:string,config:ElectricId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:electricInstrument(config)}}
function eletrostatico(id:string,topic:string,config:ElectrostaticsId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:electrostaticsInstrument(config)}}
function ondulatorio(id:string,topic:string,config:WavesId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:wavesInstrument(config)}}
function magnetico(id:string,topic:string,config:MagnetismId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:magnetismInstrument(config)}}
function optico(id:string,topic:string,config:OpticsId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:opticsInstrument(config)}}
function mecanicaFinal(id:string,topic:string,config:MechanicsFinalId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:mechanicsFinalInstrument(config)}}
function fisicaRestante(id:string,topic:string,config:PhysicsRemainingId):InstrumentEntry{return{id,subject:'Física',keywords:[topic],exactTopic:topic,Component:physicsRemainingInstrument(config)}}
function eletroquimico(id:string,topic:string,config:ElectrochemistryId):InstrumentEntry{return{id,subject:'Química',keywords:[topic],exactTopic:topic,Component:electrochemistryInstrument(config)}}
function biologico(id:string,topic:string,config:BiologyInstrumentId):InstrumentEntry{return{id,subject:'Biologia',keywords:[topic],exactTopic:topic,Component:biologyInstrument(config)}}
function geografico(id:string,topic:string,config:GeographyInstrumentId):InstrumentEntry{return{id,subject:'Geografia',keywords:[topic],exactTopic:topic,Component:geographyInstrument(config)}}
function historico(id:string,topic:string,config:HistoryInstrumentId):InstrumentEntry{return{id,subject:'História',keywords:[topic],exactTopic:topic,Component:historyInstrument(config)}}
function gramatical(id:string,topic:string,config:GrammarInstrumentId):InstrumentEntry{return{id,subject:'Gramática',keywords:[topic],exactTopic:topic,Component:grammarInstrument(config)}}
function ingles(id:string,topic:string,config:EnglishInstrumentId):InstrumentEntry{return{id,subject:'Língua Inglesa',keywords:[topic],exactTopic:topic,Component:englishInstrument(config)}}

export const INSTRUMENTS: InstrumentEntry[] = [
  plano('funcoes-introducao', ['introdução às funções'], 'afim'),
  plano('funcao-afim', ['função afim'], 'afim'),
  plano('funcao-quadratica', ['função quadrática'], 'quadratica'),
  plano('estudo-do-sinal', ['estudo do sinal'], 'quadratica'),
  plano('transformacoes-graficos', ['transformações em gráficos'], 'quadratica'),
  plano('modulo-real', ['módulo de um número real'], 'modular'),
  plano('funcoes-logaritmicas', ['funções logarítmicas'], 'logaritmica'),
  plano('inversao-funcoes', ['inversão de funções'], 'logaritmica'),
  plano('modelagem-exponencial', ['modelagem exponencial'], 'exponencial'),
  plano('funcoes-trigonometricas', ['funções trigonométricas'], 'senoidal'),
  plano('transformacoes-trigonometricas', ['transformações trigonométricas'], 'senoidal'),
  plano('polinomios', ['polinômios'], 'polinomial'),
  plano('equacoes-polinomiais', ['equações polinomiais'], 'polinomial'),

  // Geometria analítica: aqui a manipulação é arrastar um ponto, não mover um
  // parâmetro — a diferença sai do conteúdo, não de preferência de interface.
  analitico('geometria-analitica', ['introdução à geometria analítica'], 'dois-pontos'),
  analitico('ponto-medio', ['ponto médio'], 'dois-pontos'),
  analitico('reta-analitica', ['estudo analítico da reta'], 'dois-pontos'),
  analitico('distancia-ponto-reta', ['distância entre um ponto e uma reta'], 'ponto-reta'),
  analitico('circunferencia', ['equação da circunferência'], 'circunferencia'),
  analitico('duas-retas', ['posições relativas entre duas retas'], 'duas-retas'),
  analitico('reta-e-circunferencia', ['posições relativas entre uma reta e uma circunferência'], 'reta-circunferencia'),
  analitico('complexos', ['números complexos'], 'complexo'),

  // Sólidos: o objeto do capítulo é o próprio sólido, com as medidas nas mãos.
  // "O Universo Tridimensional" fica de fora de propósito: trata de retas e
  // planos no espaço, e o instrumento de sólidos não é o objeto dele.
  solido('cubos-paralelepipedos', ['cubos e paralelepípedos'], 'bloco'),
  solido('prismas', ['prismas'], 'prisma'),
  solido('piramides', ['pirâmides'], 'piramide'),
  solido('solidos-de-revolucao', ['sólidos de revolução'], 'revolucao'),
  solido('razoes-entre-volumes', ['razões entre volumes de sólidos'], 'semelhanca'),

  // Geometria plana: nove capítulos compartilham o laboratório, mas cada um
  // recebe configuração, desenho, controle e invariável próprios.
  geometriaPlana('geometria-plana-fundamentos', ['introdução à geometria plana'], 'fundamentos'),
  geometriaPlana('angulos-triangulo', ['ângulos em triângulos'], 'angulos-triangulo'),
  geometriaPlana('angulos-poligono', ['ângulos em polígonos'], 'angulos-poligono'),
  geometriaPlana('angulos-circunferencia', ['ângulos e circunferências'], 'angulos-circunferencia'),
  geometriaPlana('simetrias-congruencias', ['simetrias e congruências'], 'congruencia'),
  // II precisa vir antes de I: o resolvedor trabalha por inclusão textual e o
  // título "Identificação de Simetrias II" também contém o prefixo de I.
  geometriaPlana('simetrias-ii', ['identificação de simetrias ii'], 'simetria-ii'),
  geometriaPlana('simetrias-i', ['identificação de simetrias i'], 'simetria-i'),
  geometriaPlana('geometria-proporcionalidade', ['geometria da proporcionalidade'], 'tales'),
  geometriaPlana('semelhanca-triangulos', ['semelhança de triângulos'], 'semelhanca'),

  // Segunda leva: relações métricas e áreas usam medição/decomposição, não o
  // laboratório de ângulos da primeira leva.
  medidaPlana('triangulo-retangulo-metrico', ['triângulo retângulo'], 'triangulo-retangulo'),
  medidaPlana('geometria-metrica-plana', ['a geometria métrica plana'], 'geometria-metrica'),
  medidaPlana('areas-poligonos', ['áreas de polígonos'], 'areas-poligonos'),
  medidaPlana('area-circulo-partes', ['área do círculo e de suas partes'], 'area-circulo'),
  medidaPlana('razoes-areas-planas', ['razões entre áreas de figuras planas'], 'razoes-areas'),
  medidaPlana('areas-figuras-planas', ['áreas de figuras planas'], 'areas-compostas'),

  // Álgebra: cada configuração põe a operação do capítulo sob controle. Não
  // inclui Composição/Bijeção: nelas o objeto visual é uma função, não a forma
  // algébrica isolada, portanto terão uma família própria.
  algebra('tecnicas-algebricas', 'técnicas algébricas', 'fatoracao'),
  algebra('igualdades', 'igualdades', 'igualdades'),
  algebra('desigualdades', 'desigualdades', 'desigualdades'),
  algebra('modelagem-algebrica-i', 'modelagem algébrica de problemas i', 'modelagem-linear'),
  algebra('modelagem-algebrica-ii', 'modelagem algébrica de problemas ii', 'modelagem-quadratica'),
  algebra('representacao-geometrica-inequacoes', 'representação geométrica de inequações', 'inequacoes-plano'),

  matriz('sistemas-equacoes', 'sistemas de equações', 'sistemas'),
  matriz('tabelas-matrizes', 'tabelas e matrizes', 'matrizes'),
  matriz('multiplicacao-matrizes', 'multiplicação de matrizes', 'produto'),
  matriz('determinantes', 'determinantes', 'determinante'),
  matriz('discussao-sistemas', 'discussão de sistemas lineares', 'discussao'),
  sequencia('progressao-aritmetica', 'progressão aritmética', 'pa'),
  sequencia('progressao-geometrica', 'progressão geométrica', 'pg'),
  quantidade('razao-proporcao','razão e proporção','razao'),
  quantidade('porcentagem','porcentagem','porcentagem'),
  quantidade('sistema-decimal','o sistema de numeração decimal','decimal'),
  quantidade('numeros-inteiros','introdução à teoria dos números inteiros','inteiros'),
  quantidade('medias','médias','medias'),
  restante('problema-fila','o problema da fila','fila'),restante('problema-grupo','o problema do grupo','grupo'),restante('operacoes-probabilidades','operações com probabilidades','prob'),restante('eventos','eventos disjuntos e eventos independentes','eventos'),restante('estatistica-descritiva','estatística descritiva','estatistica'),restante('trig-poligonos','relações trigonométricas em polígonos','trig-poligonos'),restante('outras-razoes-trig','outras razões trigonométricas','trig-outras'),restante('universo-tridimensional','o universo tridimensional','espaco'),restante('conicas','introdução ao estudo analítico das cônicas','conicas'),restante('composicao-funcoes','composição de funções','composicao'),restante('funcoes-bijetoras','funções bijetoras','bijeção'),
  cinetica('movimento-uniforme','movimento uniforme','mu'),cinetica('movimento-uniformemente-variado','movimento uniformemente variado','muv'),
  vetor('grandezas-vetores','grandezas físicas e operações com vetores','vetores'),vetor('velocidade-vetorial','velocidade vetorial','velocidade'),vetor('composicao-movimentos','composição de movimentos','composicao'),
  dinamica('resultante-forcas','resultante de um sistema de forças','resultante'),dinamica('forca-contato','a força de contato','contato'),dinamica('corpos-interagindo','sistema de corpos interagindo e os elementos transmissores de força','corpos'),dinamica('plano-inclinado','plano inclinado','plano'),
  orbital('gravidade','leis da gravitação','gravidade'),orbital('dinamica-circular','dinâmica do movimento circular','circular'),orbital('orbitas','órbitas','orbitas'),orbital('balistica','balística','balistica'),
  energia('impulso','impulso e quantidade de movimento','impulso'),energia('conservacao-momento','sistemas isolados e a conservação da quantidade de movimento','momento'),energia('trabalho-forca','trabalho e energia: trabalho de uma força','trabalho'),energia('energia-cinetica','trabalho e energia: teorema da energia cinética','cinetica'),energia('potencia','potência, máquina e rendimento','potencia'),
  termo('trabalho-gas','trabalho da força de pressão do gás','gas-work'),termo('primeira-lei','primeira lei da termodinâmica','first-law'),termo('ciclo-carnot','máquinas térmicas e ciclo de carnot','carnot'),
  eletrico('corrente-eletrica','corrente elétrica','current'),eletrico('potencia-eletrica','potência elétrica','power'),eletrico('resistores','resistores','resistor'),eletrico('leis-kirchhoff','eletrodinâmica: as leis de kirchhoff','kirchhoff'),eletrico('capacitores','capacitores','capacitor'),
  eletrostatico('lei-coulomb','força elétrica: lei de coulomb','coulomb'),eletrostatico('campo-eletrico','campo elétrico','field'),eletrostatico('potencial-eletrico','energia potencial e potencial elétrico','potential'),eletrostatico('campo-uniforme','campo elétrico uniforme: abordagem escalar e abordagem vetorial','uniform-field'),eletrostatico('dinamica-cargas','dinâmica das cargas elétricas','charge-dynamics'),
  ondulatorio('intensidade-sonora','intensidade sonora','sound-intensity'),ondulatorio('interferencia-ondas','interferência de ondas: análise quantitativa, aplicações e batimento','interference'),ondulatorio('ondas-cordas','ondas estacionárias em cordas','string-harmonics'),ondulatorio('efeito-doppler','efeito doppler: descrição e estudo quantitativo','doppler'),
  magnetico('fio-espira','campo magnético devido à corrente em fio reto e espira: descrição vetorial e aplicações','fio-espira'),magnetico('carga-em-b','força magnética e análise de lançamentos de cargas em um campo magnético uniforme','carga-em-b'),magnetico('fios-paralelos','análise de força magnética em fios percorridos por correntes contínuas','fios-paralelos'),magnetico('lenz','indução eletromagnética: lei de lenz','lenz'),magnetico('gerador-inducao','indução eletromagnética: análise da corrente induzida em geradores','gerador'),
  optico('espelho-plano','reflexão em superfícies planas','plane-mirror'),optico('espelho-esferico','reflexão em superfícies esféricas','spherical-mirror'),optico('refracao','refração: fundamentos, leis e aplicações','refraction'),optico('optica-visao','óptica da visão','vision'),
  mecanicaFinal('plano-vertical','analisando movimentos contidos em um plano vertical','vertical-plane'),mecanicaFinal('mhs','movimento harmônico simples (mhs)','mhs'),mecanicaFinal('energia-potencial','trabalho e energia: o teorema da energia potencial','potential-energy'),mecanicaFinal('nao-conservativo','sistemas conservativos e sistemas não conservativos','nonconservative'),mecanicaFinal('massa-energia','equivalência massa-energia','mass-energy'),
  fisicaRestante('eco-refracao','reflexão, eco, reverberação e refração de ondas','echo'),fisicaRestante('difracao-polarizacao','fenômenos ondulatórios: difração, polarização e ressonância','diffraction'),fisicaRestante('ondas-tubos','ondas estacionárias em tubos','tube-harmonics'),fisicaRestante('fisica-quantica','noções básicas de física quântica','quantum-photon'),
  eletroquimico('redox','processos de oxirredução','redox'),eletroquimico('pilhas-baterias','introdução ao estudo das pilhas e baterias','cells'),eletroquimico('eletroquimica-espontanea','eletroquímica de processos espontâneos','spontaneous'),eletroquimico('eletrolise','eletroquímica de processos não espontâneos','electrolysis'),eletroquimico('faraday-metalurgia','aspectos quantitativos da eletroquímica e metalurgia','quantitative'),
  biologico('acidos-nucleicos','ácidos nucleicos','nucleic-acids'),biologico('ligacao-genica','ligação gênica','linkage'),biologico('coracao-vasos','coração e vasos sanguíneos','circulation'),biologico('fisiologia-respiracao','fisiologia da respiração','respiration'),biologico('hormonios-vegetais','fisiologia vegetal: hormônios vegetais','plant-hormones'),
  geografico('fusos-horarios','sistema de fusos horários','time-zones'),geografico('linguagem-cartografica','linguagem cartográfica','map-scale'),geografico('agua-superficie','água na superfície terrestre','aquifer'),geografico('matriz-energetica','matriz energética','energy-matrix'),geografico('redes-mundiais','geografia das redes mundiais','network-redundancy'),
  historico('america-xix','américa no século xix','america-xix'),historico('segunda-guerra','segunda guerra mundial (1939-1945)','wwii-fronts'),historico('guerra-fria','guerra fria','cold-war'),historico('interiorizacao-colonial','a interiorização da colonização','interiorization'),historico('mineracao-colonial','a mineração no brasil colonial','mining-colony'),
  gramatical('sintagma-nominal','artigo, numeral e adjetivo no sintagma nominal','noun-phrase'),gramatical('concordancia','concordância','agreement'),gramatical('pontuacao-i','pontuação i: princípios para o uso da vírgula','comma-scope'),gramatical('crase','crase','crasis'),gramatical('vozes-verbais','vozes verbais','verbal-voice'),
  ingles('songs-poems','text comprehension: songs and poems','poetry-reading'),ingles('calories-energy','text comprehension: calories and energy','quantity-language'),ingles('earthquakes','text comprehension: earthquakes','modal-certainty'),ingles('greenhouse-gases','text comprehension: ecology (greenhouse gases)','cause-connectors'),ingles('human-brain','text comprehension: the human brain','research-claims'),
];

function chapterText(summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>): string {
  return [summary.subject, summary.topic, summary.title].join(' ').toLowerCase();
}

export function findInstrument(
  summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>,
): InstrumentEntry | null {
  const text = chapterText(summary);
  return INSTRUMENTS.find(
    (item) => item.subject === summary.subject
      && (!item.exactTopic || summary.topic.toLowerCase() === item.exactTopic)
      && item.keywords.every((k) => text.includes(k)),
  ) ?? null;
}
