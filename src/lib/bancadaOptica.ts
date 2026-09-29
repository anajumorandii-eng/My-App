/**
 * Medidas e preferências da bancada óptica do Hoje.
 *
 * Módulo puro, fora do motor 3D, para o node:test conferir a geometria que a
 * física impõe à cena. Na primeira versão do app o eixo estava baixo e a lente
 * pequena: o anel atravessava o carro, e com o objeto perto do foco o terceiro
 * raio notável passava por fora da lente. Nada disso quebrava lint nem teste,
 * só aparecia na captura; o teste de `bancadaOptica.test.ts` fixa as medidas.
 *
 * Escala: 1 unidade da cena = 5 cm.
 */

export const MEDIDAS = {
  cmPorUnidade: 5,
  foco: 2,
  /** Altura do objeto (a seta do porta-slide). */
  alturaObjeto: 0.75,
  /** Altura do eixo óptico acima do trilho. */
  eixo: 2.15,
  raioLente: 1.4,
  pMin: 3.2,
  pMax: 8,
  pInicial: 5,
  trilhoInicio: -9.6,
  trilhoFim: 7.6,
  /** Meia altura útil do anteparo, dentro da moldura. */
  meiaAlturaAnteparo: 1.35,
} as const;

export type Papel = 'milimetrado' | 'pautado' | 'liso';

/**
 * O que a estudante pode ajustar na cena. Fica no aparelho: é conforto de
 * leitura, não dado de estudo. Os rabiscos, o carimbo e o travelling saíram
 * junto com o fundo próprio e o movimento da cena; os rabiscos agora são do
 * fundo da tela inteira (Personalizar do topo).
 */
export interface PreferenciasDaCena {
  papel: Papel;
}

export const PREFERENCIAS_PADRAO: PreferenciasDaCena = { papel: 'milimetrado' };

export const CHAVE_PREFERENCIAS = 'crivo-cena-preferencias';

const PAPEIS: readonly Papel[] = ['milimetrado', 'pautado', 'liso'];

/** Lê o que veio do armazenamento sem confiar nele: campo ausente ou inválido volta ao padrão. */
export function lerPreferencias(bruto: string | null | undefined): PreferenciasDaCena {
  if (!bruto) return { ...PREFERENCIAS_PADRAO };
  let dado: unknown;
  try {
    dado = JSON.parse(bruto);
  } catch {
    return { ...PREFERENCIAS_PADRAO };
  }
  if (!dado || typeof dado !== 'object') return { ...PREFERENCIAS_PADRAO };
  const papel = (dado as Record<string, unknown>).papel;
  return { papel: PAPEIS.includes(papel as Papel) ? (papel as Papel) : PREFERENCIAS_PADRAO.papel };
}
