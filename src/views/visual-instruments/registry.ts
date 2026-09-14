import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from '../visual-boards/types';
import { cartesianInstrument } from './CartesianInstrument';
import type { FamilyId } from '../../lib/curveFamilies';

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
  Component: ComponentType<BoardProps>;
}

/** Atalho: uma entrada de plano cartesiano, com a família já embutida. */
function plano(id: string, keywords: string[], family: FamilyId): InstrumentEntry {
  return { id, subject: 'Matemática', keywords, Component: cartesianInstrument(family) };
}

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
];

function chapterText(summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>): string {
  return [summary.subject, summary.topic, summary.title].join(' ').toLowerCase();
}

export function findInstrument(
  summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>,
): InstrumentEntry | null {
  const text = chapterText(summary);
  return INSTRUMENTS.find(
    (item) => item.subject === summary.subject && item.keywords.every((k) => text.includes(k)),
  ) ?? null;
}
