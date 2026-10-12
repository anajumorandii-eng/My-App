import type { PedagogicalStage } from '../../types/summary';
import { focusTerms, sentenceWith } from '../../lib/stageFocus';

/**
 * Camadas do mapa/documento de História e Geografia no palco.
 *
 * Nas cenas de História e Geografia a etapa já escolhe o recorte que a seção
 * dela discute (`useStageCases`). Só isso deixava 48 dos 103 capítulos com a
 * cena mostrando no máximo dois recortes ao longo das cinco etapas, e 15 com o
 * mesmo recorte nas cinco (varredura de 12/10/2026), porque os
 * rótulos curtos da cena ("Barragem sem acordo") quase nunca reaparecem
 * inteiros no texto de outra seção. Forçar um recorte por etapa seria inventar
 * qual recorte cada etapa discute.
 *
 * O que muda de verdade entre as etapas é a operação de leitura — e ela é a
 * mesma nos 613 capítulos, porque a ordem dos estágios é fixa. Então a etapa
 * escolhe também a camada do documento: observar antes de ler, relacionar o
 * recorte com a afirmação, comparar dois recortes lado a lado, ler o alerta da
 * seção de pegadinhas e, no exercício, procurar na cena o recorte que sustenta
 * a resposta. Nenhuma camada cria texto: o que aparece é a afirmação e a
 * citação do recorte, ou uma frase da própria seção da etapa.
 *
 * Módulo puro, sem React, para rodar em teste sem montar a cena.
 */
export type HgLayer = 'observar' | 'relacionar' | 'comparar' | 'armadilha' | 'missao';

export const LAYER_BY_STAGE: Record<PedagogicalStage, HgLayer> = {
  intuicao: 'observar',
  conceito: 'relacionar',
  aplicacao: 'comparar',
  estrategia: 'armadilha',
  exercicio: 'missao',
};

export const LAYER_INFO: Record<HgLayer, { titulo: string; instrucao: string }> = {
  observar: { titulo: 'Camada · observar', instrucao: 'Olhe a figura antes de ler a afirmação: o que muda de um recorte para outro?' },
  relacionar: { titulo: 'Camada · relação', instrucao: 'A afirmação do recorte ao lado da figura que a mostra.' },
  comparar: { titulo: 'Camada · comparação', instrucao: 'Dois recortes do mesmo capítulo lado a lado: o vínculo aparece na diferença.' },
  armadilha: { titulo: 'Camada · armadilha', instrucao: 'O alerta que esta etapa faz, lido sobre a figura.' },
  missao: { titulo: 'Camada · missão', instrucao: 'Escolha na cena o recorte que sustenta a resposta do exercício; a afirmação fica coberta até você conferir.' },
};

export interface LayerSection { title: string; content: string }

/**
 * Frase da seção da etapa que cita o recorte. É ela que a camada põe sobre a
 * figura: a mesma etapa lida no painel, agora no lugar do mapa a que se refere.
 * Sem citação, `null` — e a camada diz que a etapa não nomeia o recorte, em vez
 * de pôr ali uma frase qualquer.
 */
export function stepReading(section: LayerSection | undefined, label: string): string | null {
  if (!section) return null;
  const termos = focusTerms(label);
  if (termos.length === 0) return null;
  return sentenceWith(section.content, termos);
}

/**
 * Segundo recorte da comparação: o segundo que a etapa discute, senão o
 * vizinho do ativo. Nunca o próprio ativo.
 */
export function comparisonPartner(active: number, focus: number[], total: number): number {
  const citado = focus.find((index) => index !== active);
  if (citado !== undefined) return citado;
  return total > 1 ? (active + 1) % total : active;
}
