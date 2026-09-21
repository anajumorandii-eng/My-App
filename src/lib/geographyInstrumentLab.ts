export type GeographyInstrumentId = 'time-zones' | 'map-scale' | 'aquifer' | 'energy-matrix' | 'network-redundancy';

export interface GeographyReadout { label: string; value: string; pivot?: boolean }
export interface GeographyInstrumentConfig {
  id: GeographyInstrumentId;
  name: string;
  question: string;
  control: { label: string; description: string; min: number; max: number; step: number; initial: number; display: (value: number) => string };
  relation: string;
  insight: string;
  readouts: (value: number) => GeographyReadout[];
}

const decimal = (value: number) => String(Math.round(value * 10) / 10).replace('.', ',');
export const longitudeToUtc = (longitude: number) => Math.round(longitude / 15);
export const realDistanceKm = (mapCentimeters: number, denominator: number) => mapCentimeters * denominator / 100_000;
export const aquiferBalance = (extraction: number, recharge = 100) => recharge - extraction;
export const energyShares = (fossil: number) => ({ fossil, lowCarbon: 100 - fossil });
export const routesAfterFailure = (routes: number) => Math.max(0, routes - 1);

export const GEOGRAPHY_INSTRUMENTS: Record<GeographyInstrumentId, GeographyInstrumentConfig> = {
  'time-zones': {
    id: 'time-zones', name: 'Longitude e hora local', question: 'Por que deslocar-se para leste adianta o relógio?',
    control: { label: 'Longitude', description: '15° correspondem a uma hora', min: -180, max: 180, step: 15, initial: -45, display: (v) => `${Math.abs(v)}° ${v < 0 ? 'O' : v > 0 ? 'L' : ''}`.trim() },
    relation: 'fuso teórico = longitude ÷ 15°',
    insight: 'A rotação de oeste para leste faz os lugares orientais receberem o meio-dia antes; Greenwich é a referência UTC 0.',
    readouts: (v) => { const utc = longitudeToUtc(v); return [
      { label: 'Longitude', value: `${v}°` }, { label: 'Fuso', value: `UTC${utc >= 0 ? '+' : ''}${utc}`, pivot: true },
      { label: 'Em relação a Greenwich', value: utc < 0 ? `${Math.abs(utc)} h atrás` : utc > 0 ? `${utc} h à frente` : 'mesma hora' },
    ]; },
  },
  'map-scale': {
    id: 'map-scale', name: 'Escala cartográfica', question: 'Quanto uma medida curta no mapa representa no território?',
    control: { label: 'Distância no mapa', description: 'escala fixa 1:250.000', min: 1, max: 12, step: 1, initial: 6, display: (v) => `${v} cm` },
    relation: 'distância real = medida no mapa × denominador da escala',
    insight: 'A conversão mantém a unidade: na escala 1:250.000, cada centímetro do mapa representa 2,5 quilômetros reais.',
    readouts: (v) => [
      { label: 'No mapa', value: `${v} cm` }, { label: 'Escala', value: '1:250.000' },
      { label: 'No terreno', value: `${decimal(realDistanceKm(v, 250_000))} km`, pivot: true },
    ],
  },
  aquifer: {
    id: 'aquifer', name: 'Balanço de um aquífero', question: 'Quando a extração passa a rebaixar o nível freático?',
    control: { label: 'Extração por poços', description: 'recarga natural fixa em 100 unidades', min: 0, max: 150, step: 10, initial: 120, display: (v) => `${v} un./ano` },
    relation: 'variação da reserva = recarga − extração',
    insight: 'Extrair acima da recarga gera déficit acumulado, rebaixa o lençol e pode contribuir para subsidência do solo.',
    readouts: (v) => { const balance = aquiferBalance(v); return [
      { label: 'Recarga', value: '100 un./ano' }, { label: 'Extração', value: `${v} un./ano` },
      { label: 'Balanço', value: `${balance > 0 ? '+' : ''}${balance} un./ano`, pivot: true },
    ]; },
  },
  'energy-matrix': {
    id: 'energy-matrix', name: 'Composição da matriz energética', question: 'Quanto da energia total ainda depende de fontes fósseis?',
    control: { label: 'Participação fóssil', description: 'petróleo, carvão e gás no consumo total', min: 0, max: 100, step: 5, initial: 80, display: (v) => `${v}%` },
    relation: 'matriz energética = transporte + indústria + eletricidade + aquecimento',
    insight: 'Matriz energética não é sinônimo de matriz elétrica: transporte e indústria mantêm peso fóssil mesmo onde a eletricidade é renovável.',
    readouts: (v) => { const shares = energyShares(v); return [
      { label: 'Fósseis', value: `${shares.fossil}%`, pivot: true }, { label: 'Demais fontes', value: `${shares.lowCarbon}%` },
      { label: 'Escopo', value: 'todos os usos' },
    ]; },
  },
  'network-redundancy': {
    id: 'network-redundancy', name: 'Redundância de redes mundiais', question: 'O que acontece quando um nó depende de uma única rota internacional?',
    control: { label: 'Rotas independentes', description: 'cabos ou corredores entre dois nós', min: 1, max: 5, step: 1, initial: 2, display: (v) => `${v} rotas` },
    relation: 'redundância = caminhos alternativos para o mesmo fluxo',
    insight: 'Redes são materiais e hierárquicas: romper uma rota isola um nó sem alternativa, mas não interrompe um nó redundante.',
    readouts: (v) => [
      { label: 'Rotas instaladas', value: String(v) }, { label: 'Após uma ruptura', value: String(routesAfterFailure(v)), pivot: true },
      { label: 'Situação', value: routesAfterFailure(v) ? 'fluxo preservado' : 'nó isolado' },
    ],
  },
};
