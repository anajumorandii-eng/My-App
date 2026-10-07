import { lazyBoardFactory } from '../visual-boards/lazyBoard';
import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from '../visual-boards/types';
const cartesianInstrument = lazyBoardFactory(() => import('./CartesianInstrument').then(module => ({ default: module.cartesianInstrument })));
const analyticInstrument = lazyBoardFactory(() => import('./AnalyticInstrument').then(module => ({ default: module.analyticInstrument })));
const solidInstrument = lazyBoardFactory(() => import('./SolidInstrument').then(module => ({ default: module.solidInstrument })));
const planarGeometryInstrument = lazyBoardFactory(() => import('./PlanarGeometryInstrument').then(module => ({ default: module.planarGeometryInstrument })));
const areaGeometryInstrument = lazyBoardFactory(() => import('./AreaGeometryInstrument').then(module => ({ default: module.areaGeometryInstrument })));
import type { FamilyId } from '../../lib/curveFamilies';
import type { ConfigId } from '../../lib/analyticPlane';
import type { SolidConfigId } from '../../lib/solidInstruments';
import type { PlanarConfigId } from '../../lib/planarGeometry';
import type { AreaConfigId } from '../../lib/areaGeometry';
const algebraInstrument = lazyBoardFactory(() => import('./AlgebraInstrument').then(module => ({ default: module.algebraInstrument })));
import type { AlgebraConfigId } from '../../lib/algebraLab';
const matrixInstrument = lazyBoardFactory(() => import('./MatrixInstrument').then(module => ({ default: module.matrixInstrument })));
import type { MatrixConfigId } from '../../lib/matrixLab';
const sequenceInstrument = lazyBoardFactory(() => import('./SequenceInstrument').then(module => ({ default: module.sequenceInstrument })));
import type { SequenceConfigId } from '../../lib/sequenceLab';
const quantitiesInstrument = lazyBoardFactory(() => import('./QuantitiesInstrument').then(module => ({ default: module.quantitiesInstrument })));
import type { QuantitiesConfigId } from '../../lib/quantitiesLab';
const remainingMathInstrument = lazyBoardFactory(() => import('./RemainingMathInstrument').then(module => ({ default: module.remainingMathInstrument })));
import type { RemainingId } from '../../lib/remainingMath';
const kinematicsInstrument = lazyBoardFactory(() => import('./KinematicsInstrument').then(module => ({ default: module.kinematicsInstrument })));
import type { KinematicsId } from '../../lib/kinematicsLab';
const vectorsInstrument = lazyBoardFactory(() => import('./VectorsInstrument').then(module => ({ default: module.vectorsInstrument })));
import type { VectorId } from '../../lib/vectorsLab';
const dynamicsInstrument = lazyBoardFactory(() => import('./DynamicsInstrument').then(module => ({ default: module.dynamicsInstrument })));
import type { DynamicsId } from '../../lib/dynamicsLab';
const orbitalInstrument = lazyBoardFactory(() => import('./OrbitalInstrument').then(module => ({ default: module.orbitalInstrument })));
import type { OrbitalId } from '../../lib/orbitalLab';
const energyInstrument = lazyBoardFactory(() => import('./EnergyInstrument').then(module => ({ default: module.energyInstrument })));
import type { EnergyId } from '../../lib/energyLab';
const thermoInstrument = lazyBoardFactory(() => import('./ThermoInstrument').then(module => ({ default: module.thermoInstrument })));
import type { ThermoId } from '../../lib/thermoLab';
const electricInstrument = lazyBoardFactory(() => import('./ElectricInstrument').then(module => ({ default: module.electricInstrument })));
import type { ElectricId } from '../../lib/electricLab';
const electrostaticsInstrument = lazyBoardFactory(() => import('./ElectrostaticsInstrument').then(module => ({ default: module.electrostaticsInstrument })));
import type { ElectrostaticsId } from '../../lib/electrostaticsLab';
const wavesInstrument = lazyBoardFactory(() => import('./WavesInstrument').then(module => ({ default: module.wavesInstrument })));
import type { WavesId } from '../../lib/wavesLab';
const magnetismInstrument = lazyBoardFactory(() => import('./MagnetismInstrument').then(module => ({ default: module.magnetismInstrument })));
import type { MagnetismId } from '../../lib/magnetismLab';
const opticsInstrument = lazyBoardFactory(() => import('./OpticsInstrument').then(module => ({ default: module.opticsInstrument })));
import type { OpticsId } from '../../lib/opticsLab';
const mechanicsFinalInstrument = lazyBoardFactory(() => import('./MechanicsFinalInstrument').then(module => ({ default: module.mechanicsFinalInstrument })));
import type { MechanicsFinalId } from '../../lib/mechanicsFinalLab';
const physicsRemainingInstrument = lazyBoardFactory(() => import('./PhysicsRemainingInstrument').then(module => ({ default: module.physicsRemainingInstrument })));
import type { PhysicsRemainingId } from '../../lib/physicsRemainingLab';
const electrochemistryInstrument = lazyBoardFactory(() => import('./ElectrochemistryInstrument').then(module => ({ default: module.electrochemistryInstrument })));
import type { ElectrochemistryId } from '../../lib/electrochemistryLab';
const chemistryInstrument = lazyBoardFactory(() => import('./ChemistryInstrument').then(module => ({ default: module.chemistryInstrument })));
import type { ChemistryId } from '../../lib/chemistryInstrumentLab';
const biologyInstrument = lazyBoardFactory(() => import('./BiologyInstrument').then(module => ({ default: module.biologyInstrument })));
const biologyRemainingInstrument = lazyBoardFactory(() => import('./BiologyRemainingInstrument').then(module => ({ default: module.biologyRemainingInstrument })));
import type { BiologyRemainingId } from '../../lib/biologyRemainingLab';
import type { BiologyInstrumentId } from '../../lib/biologyInstrumentLab';
const geographyInstrument = lazyBoardFactory(() => import('./GeographyInstrument').then(module => ({ default: module.geographyInstrument })));
import type { GeographyInstrumentId } from '../../lib/geographyInstrumentLab';
const geographyRemainingInstrument = lazyBoardFactory(() => import('./GeographyRemainingInstrument').then(module => ({ default: module.geographyRemainingInstrument })));
import type { GeographyRemainingId } from '../../lib/geographyRemainingLab';
const geographyContextInstrument = lazyBoardFactory(() => import('./GeographyContextInstrument').then(module => ({ default: module.geographyContextInstrument })));
import type { GeographyContextId } from '../../lib/geographyContextLab';
const currentAffairsContextInstrument = lazyBoardFactory(() => import('./CurrentAffairsContextInstrument').then(module => ({ default: module.currentAffairsContextInstrument })));
import type { CurrentAffairsContextId } from '../../lib/currentAffairsContextLab';
const historyInstrument = lazyBoardFactory(() => import('./HistoryInstrument').then(module => ({ default: module.historyInstrument })));
import type { HistoryInstrumentId } from '../../lib/historyInstrumentLab';
const historyPhaseInstrument = lazyBoardFactory(() => import('./HistoryPhaseInstrument').then(module => ({ default: module.historyPhaseInstrument })));
import type { HistoryPhaseId } from '../../lib/historyPhaseLab';
const grammarInstrument = lazyBoardFactory(() => import('./GrammarInstrument').then(module => ({ default: module.grammarInstrument })));
import type { GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
const englishInstrument = lazyBoardFactory(() => import('./EnglishInstrument').then(module => ({ default: module.englishInstrument })));
import type { EnglishInstrumentId } from '../../lib/englishInstrumentLab';
const writingInstrument = lazyBoardFactory(() => import('./WritingInstrument').then(module => ({ default: module.writingInstrument })));
import type { WritingInstrumentId } from '../../lib/writingInstrumentLab';
const writingOperationInstrument = lazyBoardFactory(() => import('./WritingOperations').then(module => ({ default: module.writingOperationInstrument })));
import { type WritingOperationId } from './WritingOperations';
const readingInstrument = lazyBoardFactory(() => import('./ReadingInstrument').then(module => ({ default: module.readingInstrument })));
import type { ReadingInstrumentId } from '../../lib/readingInstrumentLab';
const literaryTraitInstrument = lazyBoardFactory(() => import('./LiteraryTraitInstrument').then(module => ({ default: module.literaryTraitInstrument })));
import type { LiteraryTraitId } from '../../lib/literaryTraitLab';
const literaryAuthorInstrument = lazyBoardFactory(() => import('./LiteraryAuthorInstrument').then(module => ({ default: module.literaryAuthorInstrument })));
import type { LiteraryAuthorId } from '../../lib/literaryAuthorLab';
import { LITERATURE_FOUNDATIONS } from './literatureFoundationsCatalog';
const literatureFoundationInstrument = lazyBoardFactory(() => import('./LiteratureFoundations').then(module => ({ default: module.literatureFoundationInstrument })));
import { type LiteratureFoundationId } from './LiteratureFoundations';
const sociologyInstrument = lazyBoardFactory(() => import('./SociologyOperations').then(module => ({ default: module.sociologyInstrument })));
import { type SociologyOperationId } from './SociologyOperations';
const philosophyInstrument = lazyBoardFactory(() => import('./PhilosophyOperations').then(module => ({ default: module.philosophyInstrument })));
import { type PhilosophyOperationId } from './PhilosophyOperations';

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
 * a parábola é o assunto; "Determinantes" só passou a ter prancha quando existiu
 * o instrumento de matriz — antes disso ficava no aviso, e não com a parábola.
 * Preencher tela com o que estiver à mão continua sendo o erro que o
 * `ap_mat_fuvest_110` nomeia.
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
function quimico(id:string,topic:string,config:ChemistryId):InstrumentEntry{return{id,subject:'Química',keywords:[topic],exactTopic:topic,Component:chemistryInstrument(config)}}
function biologico(id:string,topic:string,config:BiologyInstrumentId):InstrumentEntry{return{id,subject:'Biologia',keywords:[topic],exactTopic:topic,Component:biologyInstrument(config)}}
function biologicoRestante(id:string,topic:string,config:BiologyRemainingId):InstrumentEntry{return{id,subject:'Biologia',keywords:[topic.toLowerCase()],exactTopic:topic.toLowerCase(),Component:biologyRemainingInstrument(config)}}
function geografico(id:string,topic:string,config:GeographyInstrumentId):InstrumentEntry{return{id,subject:'Geografia',keywords:[topic],exactTopic:topic,Component:geographyInstrument(config)}}
function geograficoRestante(id:string,topic:string,config:GeographyRemainingId):InstrumentEntry{return{id,subject:'Geografia',keywords:[topic],exactTopic:topic,Component:geographyRemainingInstrument(config)}}
function geograficoContexto(id:string,topic:string,config:GeographyContextId):InstrumentEntry{return{id,subject:'Geografia',keywords:[topic],exactTopic:topic,Component:geographyContextInstrument(config)}}
function atualidadesContexto(id:string,topic:string,config:CurrentAffairsContextId):InstrumentEntry{return{id,subject:'Atualidades',keywords:[topic],exactTopic:topic,Component:currentAffairsContextInstrument(config)}}
function historico(id:string,topic:string,config:HistoryInstrumentId):InstrumentEntry{return{id,subject:'História',keywords:[topic],exactTopic:topic,Component:historyInstrument(config)}}
/**
 * Variante de linha do tempo comparada (ver `historyPhaseLab.ts`): mesma
 * economia de `geograficoRestante`, só que cada capítulo aqui não tem um
 * objeto manipulável único — tem uma sequência de fases ou processos
 * paralelos que se comparam. Molde de `geograficoRestante` de propósito, para
 * ficar fácil de auditar as duas listas lado a lado.
 */
function historicoFase(id:string,topic:string,config:HistoryPhaseId):InstrumentEntry{return{id,subject:'História',keywords:[topic],exactTopic:topic,Component:historyPhaseInstrument(config)}}
function gramatical(id:string,topic:string,config:GrammarInstrumentId):InstrumentEntry{return{id,subject:'Gramática',keywords:[topic],exactTopic:topic,Component:grammarInstrument(config)}}
function ingles(id:string,topic:string,config:EnglishInstrumentId):InstrumentEntry{return{id,subject:'Língua Inglesa',keywords:[topic],exactTopic:topic,Component:englishInstrument(config)}}
function redacao(id:string,topic:string,config:WritingInstrumentId):InstrumentEntry{return{id,subject:'Redação',keywords:[topic],exactTopic:topic,Component:writingInstrument(config)}}
function escrita(id:string,topic:string,op:WritingOperationId):InstrumentEntry{return{id,subject:'Redação',keywords:[topic],exactTopic:topic,Component:writingOperationInstrument(op)}}
function leitura(id:string,topic:string,config:ReadingInstrumentId):InstrumentEntry{return{id,subject:'Entendimento de Texto',keywords:[topic],exactTopic:topic,Component:readingInstrument(config)}}
/**
 * Literatura, rodada de cobertura pedida pela Ana Júlia: capítulos sem objeto
 * manipulável único ganham instrumento genérico de três facetas comparáveis,
 * não cena autoral (fora do escopo de Literatura por decisão anterior). Duas
 * famílias, porque a pergunta muda entre elas — ver comentário de
 * `literaryTraitLab.ts`/`literaryAuthorLab.ts` para a distinção.
 */
function literario(id:string,topic:string,config:LiteraryTraitId):InstrumentEntry{return{id,subject:'Literatura',keywords:[topic],exactTopic:topic,Component:config in LITERATURE_FOUNDATIONS ? literatureFoundationInstrument(config as LiteratureFoundationId) : literaryTraitInstrument(config)}}
function literarioAutor(id:string,topic:string,config:LiteraryAuthorId):InstrumentEntry{return{id,subject:'Literatura',keywords:[topic],exactTopic:topic,Component:literaryAuthorInstrument(config)}}

function filosofia(id:PhilosophyOperationId,topic:string):InstrumentEntry{return{id,subject:'Filosofia',keywords:[topic],exactTopic:topic,Component:philosophyInstrument(id)}}
function sociologia(id:SociologyOperationId,topic:string):InstrumentEntry{return{id,subject:'Sociologia',keywords:[topic],exactTopic:topic,Component:sociologyInstrument(id)}}

export const INSTRUMENTS: InstrumentEntry[] = [
  plano('funcoes-introducao', ['introdução às funções'], 'afim'),
  plano('funcao-afim', ['função afim'], 'afim'),
  plano('funcao-quadratica', ['função quadrática'], 'quadratica'),
  plano('estudo-do-sinal', ['estudo do sinal'], 'sinal'),
  plano('transformacoes-graficos', ['transformações em gráficos'], 'transformacao'),
  plano('modulo-real', ['módulo de um número real'], 'modular'),
  plano('funcoes-logaritmicas', ['funções logarítmicas'], 'logaritmica'),
  plano('inversao-funcoes', ['inversão de funções'], 'inversa'),
  plano('modelagem-exponencial', ['modelagem exponencial'], 'exponencial'),
  plano('funcoes-trigonometricas', ['funções trigonométricas'], 'senoidal'),
  plano('transformacoes-trigonometricas', ['transformações trigonométricas'], 'senoidal'),
  plano('polinomios', ['polinômios'], 'polinomial'),
  plano('equacoes-polinomiais', ['equações polinomiais'], 'polinomial'),

  // Geometria analítica: aqui a manipulação é arrastar um ponto, não mover um
  // parâmetro — a diferença sai do conteúdo, não de preferência de interface.
  analitico('geometria-analitica', ['introdução à geometria analítica'], 'alinhamento'),
  analitico('ponto-medio', ['ponto médio'], 'baricentro'),
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
  optico('espelho-plano','reflexão em superfícies planas','plane-mirror'),optico('espelho-esferico','reflexão em superfícies esféricas','spherical-mirror'),optico('refracao','refração: fundamentos, leis e aplicações','refraction'),
  mecanicaFinal('plano-vertical','analisando movimentos contidos em um plano vertical','vertical-plane'),mecanicaFinal('mhs','movimento harmônico simples (mhs)','mhs'),mecanicaFinal('energia-potencial','trabalho e energia: o teorema da energia potencial','potential-energy'),mecanicaFinal('nao-conservativo','sistemas conservativos e sistemas não conservativos','nonconservative'),mecanicaFinal('massa-energia','equivalência massa-energia','mass-energy'),
  fisicaRestante('eco-refracao','reflexão, eco, reverberação e refração de ondas','echo'),fisicaRestante('difracao-polarizacao','fenômenos ondulatórios: difração, polarização e ressonância','diffraction'),fisicaRestante('ondas-tubos','ondas estacionárias em tubos','tube-harmonics'),fisicaRestante('fisica-quantica','noções básicas de física quântica','quantum-photon'),
  fisicaRestante('movimento-circular','o movimento circular','circular-motion'),
  fisicaRestante('mapeamento-campo-eletrico','mapeamento do campo elétrico: linhas de força e superfícies equipotenciais','electric-field-map'),
  fisicaRestante('medidores-eletricos','medidores elétricos','electric-meters'),
  fisicaRestante('geradores-eletricos','geradores','generator'),
  fisicaRestante('receptores-eletricos','receptores','receiver'),
  fisicaRestante('imas-campo-terrestre','ímãs, campo de indução magnético devido a ímãs e campo magnético terrestre','magnet-field'),
  fisicaRestante('fundamentos-optica','fundamentos da óptica geométrica','geometric-optics'),
  fisicaRestante('microscopio-luneta','microscópio e luneta astronômica (ou telescópio refrator): noções básicas','optical-instruments'),
  fisicaRestante('conceitos-ondas','conceitos básicos','wave-basics'),
  fisicaRestante('reflexao-cordas','fenômenos ondulatórios: análise de refração e reflexão em cordas','rope-boundary'),
  fisicaRestante('onda-estacionaria','um caso particular de interferência: onda estacionária','string-standing-wave'),
  eletroquimico('redox','processos de oxirredução','redox'),eletroquimico('pilhas-baterias','introdução ao estudo das pilhas e baterias','cells'),eletroquimico('eletroquimica-espontanea','eletroquímica de processos espontâneos','spontaneous'),eletroquimico('eletrolise','eletroquímica de processos não espontâneos','electrolysis'),eletroquimico('faraday-metalurgia','aspectos quantitativos da eletroquímica e metalurgia','quantitative'),
  quimico('gas-state','o estado gasoso','gas-state'),
  quimico('gas-law','estudo dos gases ii','gas-law'),
  quimico('separation','separação de misturas','separation'),
  quimico('balancing','transformações físicas e químicas e balanceamento de equações','balancing'),
  quimico('mole','massa atômica, mol e massa molar','mole'),
  quimico('formula','determinação de fórmulas químicas','formula'),
  quimico('stoichiometry','cálculos estequiométricos','stoichiometry'),
  quimico('carbon-chain','introdução à química orgânica','carbon-chain'),
  quimico('organic-name','nomenclatura de compostos orgânicos','organic-name'),
  quimico('addition','reações de adição','addition'),
  quimico('oxidation','reações de oxidação em hidrocarbonetos','oxidation'),
  quimico('esterification','ácidos graxos e esterificação','esterification'),
  quimico('biodiesel','transesterificação (alcoólise)','biodiesel'),
  quimico('acidity','acidez e basicidade (pka)','acidity'),
  quimico('polymer','polímeros','polymer'),
  quimico('equilibrium-shift','deslocamento de equilíbrio','equilibrium-shift'),
  quimico('ionic-equilibrium','equilíbrios iônicos','ionic-equilibrium'),
  quimico('acid-weathering','equilíbrios químicos i','acid-weathering'),
  biologicoRestante('introducao-genetica','Introdução à Genética','genetics-intro'),
  biologicoRestante('alelos-multiplos','Alelos Múltiplos e Herança dos Grupos Sanguíneos','blood-groups'),
  biologicoRestante('sustentacao-locomocao','Fisiologia da Sustentação e da Locomoção','locomotion'),
  biologicoRestante('coordenacao-endocrina-i','Coordenação Endócrina I','endocrine'),
  biologicoRestante('poluicao-ar','Poluição do Ar','air-pollution'),
  biologicoRestante('clima-pops-biorremediacao','Poluição: Aquecimento Global, POPs e Biorremediação','climate-pops'),
  biologicoRestante('compostos-inorganicos','Composição Química Celular: Compostos Inorgânicos','inorganic'),
  biologicoRestante('citoplasma-i','Citoplasma: Estrutura e Componentes I','cytoplasm-two'),
  biologicoRestante('citoplasma-ii','Citoplasma: Estrutura e Componentes II','cytoplasm-one'),
  biologicoRestante('nucleo-celular','Núcleo Celular','nucleus'),
  biologicoRestante('mutacoes-cromossomicas','Mutações Cromossômicas e Gametogênese','chromosome-mutations'),
  biologicoRestante('biotecnologia','Biotecnologia','biotechnology'),
  biologicoRestante('poriferos-cnidarios','Poríferos e Cnidários','cnidarians'),
  biologicoRestante('arquitetura-corporal','Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos','body-plan'),
  biologicoRestante('artropodes-insetos','Artrópodes: Insetos, Crustáceos e Miriápodes','insects'),
  biologicoRestante('artropodes-aracnideos','Artrópodes: Aracnídeos','arachnids'),
  biologicoRestante('cordados-peixes','Introdução aos Cordados e os Peixes','fish'),
  biologicoRestante('gimnospermas-angiospermas','Plantas Terrestres II: Gimnospermas e Angiospermas','angiosperms'),
  biologicoRestante('procariotos','Procariotos','procaryotes'),
  biologicoRestante('sistemas-sensoriais','Sistemas Sensoriais: Visão e Audição','senses'),
  biologicoRestante('reproducao-humana','Reprodução Humana e Métodos Contraceptivos','reproduction'),
  biologicoRestante('histologia-vegetal','Histologia e Morfologia Vegetal','plant-tissues'),
  biologicoRestante('caules-folhas','Morfofisiologia Vegetal: Caules e Folhas','stems-leaves'),
  biologico('acidos-nucleicos','ácidos nucleicos','nucleic-acids'),biologico('ligacao-genica','ligação gênica','linkage'),biologico('fisiologia-respiracao','fisiologia da respiração','respiration'),biologico('hormonios-vegetais','fisiologia vegetal: hormônios vegetais','plant-hormones'),
  geografico('fusos-horarios','sistema de fusos horários','time-zones'),geografico('linguagem-cartografica','linguagem cartográfica','map-scale'),geografico('agua-superficie','água na superfície terrestre','aquifer'),geografico('matriz-energetica','matriz energética','energy-matrix'),geografico('redes-mundiais','geografia das redes mundiais','network-redundancy'),
  geograficoRestante('digital-map','cartografia digital','digital-map'),
  geograficoRestante('map-elements','representações gráficas e cartográficas','map-elements'),
  geograficoRestante('world-basin','hidrogeografia mundial','world-basin'),
  geograficoRestante('brazilian-basins','hidrogeografia do brasil','brazilian-basins'),
  geograficoRestante('commons','desafios ambientais do século xxi','commons'),
  geograficoRestante('supply-chain','globalização e processos econômicos atuais','supply-chain'),
  geograficoRestante('technopole','indústria ii','technopole'),
  geograficoRestante('geoeconomics','gedeconomia mundial','geoeconomics'),
  geograficoRestante('mining','produção mineral','mining'),
  geograficoRestante('agrarian','o espaço agrário brasileiro','agrarian'),
  geograficoContexto('governanca-ambiental','geopolítica ambiental','environmental-governance'),
  geograficoContexto('uniao-europeia','união europeia','eu-integration'),
  geograficoContexto('energia-eletrica-brasil','energia elétrica no brasil','electricity-system'),
  geograficoContexto('fluxos-populacionais','estrutura étnica e fluxos migratórios','population-flows'),
  geograficoContexto('rede-comercio-externo','os fluxos do comércio externo','trade-network'),
  geograficoContexto('conflito-europa','tensões geopolíticas na europa','urban-conflict'),

  // Rodada de fechamento de lacuna (set/2026): mesmo laboratório de três
  // recortes, agora cobrindo geopolítica regional e geografia econômica e
  // ambiental do Brasil — sem cena nova, só configuração nova, exatamente a
  // economia que o instrumento existe para dar.
  geograficoContexto('unilateralismo-multilateralismo','unilateralismo e multilateralismo','unilateral-multilateral'),
  geograficoContexto('terrorismo-internacional','terrorismo internacional','international-terrorism'),
  geograficoContexto('geografia-religioes','geografia das religiões','religious-geography'),
  geograficoContexto('geopolitica-america-latina','geopolítica e geoeconomia da américa latina','latin-america-geopolitics'),
  geograficoContexto('africa-mundo-atual','áfrica no mundo atual','africa-geopolitics'),
  geograficoContexto('geopolitica-asia','geopolítica e geoeconomia da ásia','asia-geopolitics'),
  geograficoContexto('geografia-oriente-medio','geografia do oriente médio','middle-east-geography'),
  geograficoContexto('questao-palestina','questão palestina','palestinian-question'),
  geograficoContexto('conflitos-mundo-arabe','conflitos no mundo árabe','arab-world-conflicts'),
  geograficoContexto('energia-eletrica-mundo','energia elétrica no mundo','world-electricity-sources'),
  geograficoContexto('combustiveis-biocombustiveis-brasil','combustíveis fósseis e biocombustíveis no brasil','fossil-biofuels-brazil'),
  geograficoContexto('espaco-industrial-brasileiro-ii','o espaço industrial brasileiro ii','brazil-industrial-command'),
  geograficoContexto('biogeografia-brasil-i','biogeografia do brasil i','brazil-biogeography-i'),
  geograficoContexto('biogeografia-brasil-ii','biogeografia do brasil ii','brazil-biogeography-ii'),
  geograficoContexto('politicas-ambientais-brasileiras','políticas ambientais brasileiras','brazilian-environmental-policy'),
  atualidadesContexto('cop30-belem','clima, energia e meio ambiente','cop30-belem'),

  historico('america-xix','américa no século xix','america-xix'),historico('segunda-guerra','segunda guerra mundial (1939-1945)','wwii-fronts'),historico('guerra-fria','guerra fria','cold-war'),historico('interiorizacao-colonial','a interiorização da colonização','interiorization'),historico('mineracao-colonial','a mineração no brasil colonial','mining-colony'),
  historicoFase('grandes-revolucoes-seculo-xx','grandes revoluções do século xx','grandes-revolucoes-seculo-xx'),
  historicoFase('america-latina-seculo-xx','américa latina no século xx','america-latina-seculo-xx'),
  historicoFase('dinamica-interna-colonizacao','dinâmica interna da colonização','dinamica-interna-colonizacao'),
  historicoFase('disputas-europeias-brasil-colonial','disputas europeias no brasil colonial','disputas-europeias-brasil-colonial'),
  historicoFase('segundo-reinado','brasil império: segundo reinado (1840-1889)','segundo-reinado'),
  historicoFase('republica-da-espada','a república da espada','republica-da-espada'),
  historicoFase('republica-liberal-democracia','república liberal (1945-1964): democracia em tempos de guerra fria','republica-liberal-democracia'),
  historicoFase('republica-liberal-desenvolvimentismo','república liberal (1945-1964): desenvolvimentismo e populismo','republica-liberal-desenvolvimentismo'),
  historicoFase('regime-militar-i','regime militar (1964-1985) i','regime-militar-i'),
  historicoFase('regime-militar-ii','regime militar (1964-1985) ii','regime-militar-ii'),
  gramatical('sintagma-nominal','artigo, numeral e adjetivo no sintagma nominal','noun-phrase'),gramatical('concordancia','concordância','agreement'),gramatical('pontuacao-i','pontuação i: princípios para o uso da vírgula','comma-scope'),gramatical('crase','crase','crasis'),gramatical('vozes-verbais','vozes verbais','verbal-voice'),
  gramatical('pronomes','pronomes','pronoun-reference'),gramatical('verbo','verbo','verbal-aspect'),gramatical('ambiguidade','ambiguidade: duplicidade no léxico e na sintaxe','ambiguity'),gramatical('oracoes-coordenadas','orações coordenadas','clause-relations'),
  // Rodada de 21/09/2026: cobertura máxima decidida pela Ana Júlia, mesmo sem
  // um "objeto" manipulável clássico — o instrumento manipula a leitura da
  // frase (ver `WideRelationScene` em GrammarInstrument.tsx). "Verbo e Sintaxe
  // da Oração" é capítulo distinto de "Verbo" (que já usa verbal-aspect):
  // aqui o eixo é transitividade, lá é tempo/aspecto.
  gramatical('lingua-sistema','língua: um sistema complexo','language-system'),
  gramatical('substantivo-visao-enunciador','substantivo: os nomes e a visão do enunciador','noun-class'),
  gramatical('tipos-de-texto','tipos de texto: explorando elementos concretos e conceitos abstratos','text-type'),
  gramatical('adverbio-circunstanciadores','advérbio e locuções adverbiais: circunstanciadores','adverb-circumstance'),
  gramatical('verbo-sintaxe-oracao','verbo e sintaxe da oração','verb-syntax'),
  gramatical('significados-implicitos','significados implícitos','implicit-meaning'),
  gramatical('tipos-de-discurso','tipos de discurso','discourse-type'),
  gramatical('pontuacao-ii','pontuação ii: vírgula entre orações e outros sinais de pontuação','clause-punctuation'),
  gramatical('lexico-em-contexto','o léxico em contexto: variadas possibilidades semânticas','lexical-context'),
  gramatical('mecanismo-regencia','mecanismo de regência','government'),
  gramatical('formacao-palavras','processos de formação de palavras','word-formation'),
  gramatical('funcoes-sintaticas-nominais','funções sintáticas nominais e vocativo','nominal-function'),
  gramatical('tipos-de-sujeito','tipos de sujeito','subject-type'),
  gramatical('oracoes-substantivas','orações substantivas','noun-clause'),
  gramatical('oracoes-adjetivas','orações adjetivas','adjective-clause'),
  gramatical('oracoes-adverbiais','orações adverbiais','adverbial-clause'),
  ingles('taxonomy','text comprehension: taxonomy and terminology','taxonomy-hierarchy'),
  ingles('songs-poems','text comprehension: songs and poems','poetry-reading'),ingles('calories-energy','text comprehension: calories and energy','quantity-language'),ingles('earthquakes','text comprehension: earthquakes','modal-certainty'),ingles('greenhouse-gases','text comprehension: ecology (greenhouse gases)','cause-connectors'),ingles('human-brain','text comprehension: the human brain','research-claims'),
  // Cada capítulo usa seu próprio trecho e mecanismo de leitura.
  ingles('hurricanes','text comprehension: hurricanes','hurricane-forecast'),
  ingles('pollution','text comprehension: pollution','pollution-connectors'),
  ingles('global-warming','text comprehension: global warming','warming-evidence'),
  ingles('novels-short-stories','text comprehension: novels/short stories','narrative-inference'),
  ingles('bacteria','text comprehension: bacteria','bacteria-context'),
  ingles('viruses','text comprehension: viruses','comparison-signals'),
  ingles('discrimination-against-women','text comprehension: discrimination against women','stance-language'),
  ingles('women-empowerment','text comprehension: women empowerment','empowerment-language'),
  ingles('digital-technology','text comprehension: digital technology','digital-conditions'),
  ingles('health-probiotics','text comprehension: health – probiotics','probiotic-evidence'),
  ingles('stem-cells','text comprehension: stem cells','stem-cell-trials'),
  redacao('dissertacao-mitos','a dissertação no vestibular: mitos e verdades','essay-myths'),redacao('avaliacao-dissertacao','o que se avalia na dissertação: competências e habilidades','evaluation'),redacao('organizacao-ideias','organizando as ideias: brainstorm e mind maps','idea-map'),redacao('repertorio','repertório: o diferencial de redações de sucesso','repertoire'),redacao('eixos-tematicos','qual será o tema deste ano: grandes eixos temáticos','theme-axes'),
  // Oficina de redação, rodada 1: cada entrada aponta para a decisão concreta
  // do capítulo. As famílias se repetem apenas quando a operação de escrita é
  // a mesma; a configuração muda exemplos, diagnóstico, consequência e ação.
  redacao('adequacao-proposta','diferentes graus de adequação à proposta','prompt-fit'),
  redacao('fronteira-tema','tangenciamento e fuga: a fronteira do tema','prompt-boundary'),
  redacao('genero-estrutura','gêneros e sua relação com a estrutura do texto','genre-letter'),
  redacao('estrutura-dissertativa','estrutura clássica do texto dissertativo','genre-dissertation'),
  redacao('coletanea-sentidos-i','lendo a coletânea: a apreensão de sentidos i','source-sense'),
  redacao('coletanea-sentidos-ii','lendo a coletânea: a apreensão de sentidos ii','source-visual'),
  redacao('coletanea-autoria-i','lendo a coletânea: a compreensão e o texto autoral i','source-authorship'),
  redacao('coletanea-autoria-ii','lendo a coletânea: a compreensão e o texto autoral ii','source-dialogue'),
  escrita('rep-meio-ambiente','incrementando o repertório: meio ambiente','rep-environment'),
  escrita('tema-meio-ambiente','analisando tema de redação: meio ambiente','theme-environment'),
  escrita('rep-educacao-trabalho','incrementando o repertório: educação e trabalho','rep-work'),
  escrita('tema-educacao-trabalho','analisando tema de redação: educação e trabalho','theme-work'),
  escrita('rep-abstratos','incrementando o repertório: temas abstratos','rep-abstract'),
  escrita('tema-abstrato','analisando tema abstrato de redação','theme-abstract'),
  escrita('rep-corpo-saude','incrementando o repertório: corpo, saúde e sexualidade','rep-body'),
  escrita('tema-corpo-saude','analisando tema de redação: corpo, saúde e sexualidade','theme-body'),
  escrita('rep-violencia','incrementando o repertório: violência, leis e punição','rep-violence'),
  escrita('tema-violencia','analisando tema de redação: violência, leis e punição','theme-violence'),
  escrita('rep-cidadania','incrementando o repertório: cidadania e poder','rep-citizenship'),
  escrita('tema-cidadania','analisando tema de redação: cidadania e poder','theme-citizenship'),
  escrita('rep-arte-cultura','incrementando o repertório: arte, cultura e relações sociais','rep-culture'),
  escrita('tema-arte-cultura','analisando o tema de redação: arte, cultura e relações sociais','theme-culture'),
  escrita('rep-midia','incrementando o repertório: mídia e sociedade','rep-media'),
  escrita('tema-midia','analisando tema de redação: mídia e sociedade','theme-media'),
  redacao('intro-tese','parágrafo de introdução: delimitando a opinião','intro-thesis'),redacao('intro-contexto','parágrafo de introdução: como contextualizar','intro-context'),redacao('auditorio','argumentação: auditório particular e universal','audience'),redacao('quase-logica','argumentação quase-lógica e efeito de verdade','quasi-logic'),redacao('coerencia-interna','argumentação e coerência interna','internal-coherence'),redacao('coerencia-externa','argumentação e coerência externa','external-coherence'),
  redacao('dados-exemplos','recursos argumentativos: dados numéricos e exemplos','data-examples'),redacao('vozes-prestigiadas','recursos argumentativos: vozes prestigiadas','prestigious-voices'),redacao('ressalva','ressalvando o ponto de vista contrário','concession'),redacao('refutacao','refutando o ponto contrário','refutation'),redacao('interdiscursividade','recursos argumentativos: interdiscursividade e intertextualidade','intertextuality'),redacao('temas-analisados','recursos argumentativos: temas de redação já analisados','repertoire-bank'),redacao('fatos-atualidade','recursos argumentativos: fatos da atualidade','current-affairs'),redacao('multiplos-dominios','recursos argumentativos: múltiplos domínios do saber','domains'),
  redacao('conclusao-sintese','conclusão por síntese ou retomada da tese','conclusion-synthesis'),redacao('conclusao-foco','conclusão: sumarização, focalização e expressividade','conclusion-focus'),redacao('intervencao-atores','proposta de intervenção: atores sociais e cidadania','intervention-agents'),redacao('intervencao-viabilidade','proposta de intervenção: viabilização e inovação','intervention-feasibility'),redacao('intervencao-coerencia','proposta de intervenção: coerência argumentativa','intervention-coherence'),redacao('intervencao-direitos','proposta de intervenção: respeito aos direitos humanos','intervention-rights'),
  redacao('coesao-referencial','recursos de coesão referencial no texto dissertativo','reference-cohesion'),redacao('coesao-sequencial','recursos de coesão sequencial no texto dissertativo','sequential-cohesion'),redacao('coesao-problemas','coesão no texto dissertativo: análise de problemas','cohesion-diagnosis'),redacao('linguagem-clareza','recursos linguísticos: norma, clareza e expressividade','language-clarity'),redacao('direitos-1','os direitos humanos de 1ª geração: direitos individuais','rights-generations'),redacao('direitos-23','os direitos humanos de 2ª e 3ª geração: direitos sociais, coletivos e difusos','rights-social'),redacao('nota-mil','redações nota 1000: trunfos a inspirar','model-essay'),redacao('redacao-midia','redações na mídia: como aprimorar','media-revision'),
  leitura('textualidade','fatores de textualidade','textuality'),
  leitura('niveis-leitura','os dois níveis da leitura','levels'),leitura('intertextualidade','intertextualidade e interdiscursividade','intertext'),leitura('generos','gêneros textuais','genres'),leitura('narrativos','gêneros narrativos e níveis de compreensão','narrative'),leitura('nao-verbais','gêneros não verbais: fundamentos de leitura','nonverbal'),leitura('funcoes','funções da linguagem','functions'),leitura('poetica','função poética e linguagem literária','poetic'),leitura('figuras','figuras de linguagem','figures'),leitura('distorcoes','modelos de leitura e distorções interpretativas','distortions'),leitura('comicos','leitura de textos cômicos','comic'),leitura('tdic','tecnologias digitais da informação e comunicação (tdic): impactos sociais','tdic'),

  // Literatura: estéticas/campos e autores. A Entrega F substitui as facetas
  // dos fundamentos por operações em exemplos autorais, preservando IDs.
  // Texto Literário usa o experimento prioritário; os demais capítulos
  // seguem nas frentes LG3, sem ampliar casamentos por palavra incidental.
  literario('art-languages','a arte e suas linguagens','art-languages'),
  { id: 'medieval-voices', subject: 'Literatura', keywords: ['trovadorismo e humanismo'], exactTopic: 'trovadorismo e humanismo', Component: literatureFoundationInstrument('medieval-voices') },
  literario('renaissance-camoes','renascimento e camões','renaissance-camoes'),
  literario('first-records','brasil: primeiros registros','first-records'),
  literario('baroque','a estética barroca','baroque'),
  literario('neoclassic','a estética neoclássica','neoclassic'),
  literario('romantic-poetry','a estética romântica: poesia','romantic-poetry'),
  { id: 'romantic-prose', subject: 'Literatura', keywords: ['a estética romântica: prosa'], exactTopic: 'a estética romântica: prosa', Component: literatureFoundationInstrument('romantic-prose') },
  literario('narrative-elements','elementos da narrativa','narrative-elements'),
  literario('realism','a estética realista','realism'),
  literario('naturalism','naturalismo','naturalism'),
  literario('eca-de-queiros','realismo português: eça de queirós','eca-de-queiros'),
  literario('parnassianism','parnasianismo','parnassianism'),
  literario('symbolism','simbolismo','symbolism'),
  literario('pre-modernism','pré-modernismo','pre-modernism'),
  literario('modern-art-week','semana de arte moderna','modern-art-week'),
  literario('modernism-first-generation','modernismo no brasil: primeira geração','modernism-first-generation'),
  literario('modernism-second-generation','segunda geração modernista: poesia','modernism-second-generation'),
  { id: 'modernism-second-prose', subject: 'Literatura', keywords: ['segunda geração modernista: prosa'], exactTopic: 'segunda geração modernista: prosa', Component: literatureFoundationInstrument('modernism-second-prose') },
  { id: 'vanguards', subject: 'Literatura', keywords: ['vanguardas artísticas'], exactTopic: 'vanguardas artísticas', Component: literatureFoundationInstrument('vanguards') },
  { id: 'fernando-pessoa', subject: 'Literatura', keywords: ['fernando pessoa'], exactTopic: 'fernando pessoa', Component: literatureFoundationInstrument('fernando-pessoa') },
  literario('concrete-poetry','poesia concreta','concrete-poetry'),
  { id: 'poetry-1960-1980', subject: 'Literatura', keywords: ['poesia brasileira: 1960-1980'], exactTopic: 'poesia brasileira: 1960-1980', Component: literatureFoundationInstrument('poetry-1960-1980') },
  literario('prose-1960-1980','prosa brasileira: 1960-1980','prose-1960-1980'),
  { id: 'poetry-contemporary', subject: 'Literatura', keywords: ['poesia brasileira contemporânea'], exactTopic: 'poesia brasileira contemporânea', Component: literatureFoundationInstrument('poetry-contemporary') },
  { id: 'prose-contemporary', subject: 'Literatura', keywords: ['prosa brasileira contemporânea'], exactTopic: 'prosa brasileira contemporânea', Component: literatureFoundationInstrument('prose-contemporary') },
  literario('lusophone-contemporary','literatura lusófona contemporânea','lusophone-contemporary'),
  literario('brazilian-visual-arts','artes plásticas brasileiras','brazilian-visual-arts'),
  literario('brazilian-theater','teatro brasileiro','brazilian-theater'),
  literario('popular-songbook','cancioneiro popular brasileiro','popular-songbook'),
  { id: 'machado-de-assis', subject: 'Literatura', keywords: ['machado de assis'], exactTopic: 'machado de assis', Component: literatureFoundationInstrument('machado-de-assis') },
  { id: 'graciliano-ramos', subject: 'Literatura', keywords: ['graciliano ramos'], exactTopic: 'graciliano ramos', Component: literatureFoundationInstrument('graciliano-ramos') },
  { id: 'carlos-drummond', subject: 'Literatura', keywords: ['carlos drummond de andrade'], exactTopic: 'carlos drummond de andrade', Component: literatureFoundationInstrument('carlos-drummond') },
  { id: 'joao-cabral', subject: 'Literatura', keywords: ['joão cabral de melo neto'], exactTopic: 'joão cabral de melo neto', Component: literatureFoundationInstrument('joao-cabral') },
  { id: 'clarice-lispector', subject: 'Literatura', keywords: ['clarice lispector'], exactTopic: 'clarice lispector', Component: literatureFoundationInstrument('clarice-lispector') },
  { id: 'guimaraes-rosa', subject: 'Literatura', keywords: ['guimarães rosa'], exactTopic: 'guimarães rosa', Component: literatureFoundationInstrument('guimaraes-rosa') },
  // Sociologia H3: o caso autoral em que o conceito opera. Solidariedade fica
  // no experimento prioritário, que já mostra a mesma oficina.
  sociologia('social-fact','o que é o fato social'),
  sociologia('anomie-grid','anomia e coesão social'),
  sociologia('identity-difference','identidade e diferença'),
  sociologia('mobility-grid','classes sociais e mobilidade social'),
  sociologia('citizenship-rights','cidadania e direitos'),
  sociologia('information-society','a sociedade da informação'),
  // Sociologia H2: tipologias e cadeias que eram cartões de rótulo. O tipo
  // escolhido ou o elo retirado redesenha o mesmo caso autoral do capítulo.
  sociologia('education-socialization','educação e socialização em durkheim'),
  sociologia('mode-of-production','modo de produção e estrutura social'),
  sociologia('ideology-alienation','ideologia e alienação'),
  sociologia('social-action-types','tipos de ação social'),
  sociologia('weber-domination','dominação e poder em weber'),
  sociologia('protestant-ethic','ética protestante e o espírito do capitalismo'),
  sociologia('gender-inequality','desigualdade de gênero'),
  sociologia('platform-work','precarização e uberização do trabalho'),
  sociologia('social-movements','movimentos sociais clássicos e contemporâneos'),
  sociologia('democracy-forms','democracia e participação política'),
  sociologia('globalization-flows','globalização econômica e cultural'),
  sociologia('nation-state','o estado-nação na era global'),
  // Filosofia H3: o argumento desenhado. Mito e logos fica no experimento
  // prioritário, que mostra a mesma oficina.
  filosofia('socratic-method','o método socrático e a maiêutica'),
  filosofia('cave','o mito da caverna'),
  filosofia('divided-line','a alegoria da linha dividida e o conhecimento'),
  filosofia('golden-mean','a ética a nicômaco e a doutrina do meio-termo'),
  filosofia('cartesian-doubt','descartes e o método: a dúvida hiperbólica'),
  filosofia('hegel-dialectic','hegel e a dialética'),
  filosofia('nietzsche-genealogy','nietzsche e a crítica aos valores morais'),
  // Filosofia H2: cadeias e camadas com o argumento visível.
  filosofia('aristotle-logic','lógica e metafísica aristotélicas'),
  filosofia('aquinas-synthesis','escolástica e santo tomás de aquino'),
  filosofia('hume-causation','a crítica de hume à causalidade'),
  filosofia('hobbes-state','hobbes e o estado de natureza'),
  filosofia('locke-rights','locke e os direitos naturais'),
  filosofia('rousseau-general-will','rousseau e a vontade geral'),
  filosofia('kant-duty','a ética kantiana e o imperativo categórico'),
  filosofia('historical-materialism','o materialismo histórico'),
  filosofia('class-struggle','a luta de classes na filosofia marxista'),
  filosofia('sartre-freedom','o existencialismo de sartre'),
  filosofia('frankfurt-culture','a escola de frankfurt e a indústria cultural'),
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
