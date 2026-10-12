import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { resolveVisualRepresentation } from '../visualRepresentation';
import { hotspotStep, resolveStageDeclaration } from './contract';
import { stageDeclarationFor } from './declarations';

const summary = interactiveSummaries.find((item) => item.id === 'summary-quimica-geometria-molecular') ?? interactiveSummaries[0];
const map = buildVisualMap(summary);

describe('contrato do palco imersivo', () => {
  it('sem declaração, oferece um ponto por nó, na ordem das etapas', () => {
    const { hotspots, layers } = resolveStageDeclaration(map, null);
    expect(hotspots.map((spot) => spot.nodeId)).toEqual(map.nodes.map((node) => node.id));
    expect(hotspots.map((spot) => hotspotStep(map, spot))).toEqual(map.nodes.map((_, i) => i));
    expect(layers).toEqual([]);
  });

  it('descarta ponto que aponta para nó inexistente ou etapa fora do trilho', () => {
    const { hotspots } = resolveStageDeclaration(map, { hotspots: [
      { id: 'a', label: 'Par isolado', nodeId: map.nodes[1].id },
      { id: 'b', label: 'Fantasma', nodeId: 'nao-existe' },
      { id: 'c', label: 'Etapa 9', step: 9 },
      { id: 'd', label: 'Solto' },
      { id: 'e', label: '  ', step: 0 },
    ] });
    expect(hotspots.map((spot) => spot.id)).toEqual(['a']);
    expect(hotspotStep(map, hotspots[0])).toBe(1);
  });

  it('volta ao padrão quando nenhum ponto declarado é válido, e não repete camada', () => {
    const { hotspots, layers } = resolveStageDeclaration(map, {
      hotspots: [{ id: 'x', label: 'x', nodeId: 'nada' }],
      layers: [{ id: 'm', label: 'Modelo' }, { id: 'm', label: 'Outro' }],
    });
    expect(hotspots).toHaveLength(map.nodes.length);
    expect(layers).toEqual([{ id: 'm', label: 'Modelo' }]);
  });

  it('nenhum dos capítulos quebra o palco: todo ponto resolve para uma etapa real', () => {
    for (const item of interactiveSummaries) {
      const itemMap = buildVisualMap(item);
      const { hotspots } = resolveStageDeclaration(itemMap, stageDeclarationFor(item, resolveVisualRepresentation(item)));
      for (const spot of hotspots) {
        const step = hotspotStep(itemMap, spot);
        expect(step).toBeGreaterThanOrEqual(0);
        expect(step).toBeLessThan(itemMap.nodes.length);
      }
    }
  });
});
