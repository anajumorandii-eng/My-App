import { createContext, useCallback, useContext, useState } from 'react';

/**
 * Como a estudante quer a cena 3D do capítulo: paleta do modelo, etiquetas,
 * piso e giro contínuo.
 *
 * A cena 3D era um suplemento abaixo de um esquema plano, e a Ana Júlia leu a
 * página como "uma divisão com tantas interpretações que atrapalham mais do que
 * ajudam": a ideia era a própria cena ser a experiência, com movimento e
 * personalização. Estas escolhas são dela, não do capítulo — valem para todas
 * as cenas e ficam no aparelho, como as de `usePreferenciasVisual`.
 */
export type CorDaCena = 'crivo' | 'materia' | 'floresta' | 'oceano' | 'grafite';

export interface PreferenciasCena {
  cor: CorDaCena;
  rotulos: boolean;
  piso: boolean;
  /** Órbita lenta e contínua; qualquer toque na cena a interrompe. */
  giro: boolean;
}

export const CORES_DA_CENA: readonly { id: CorDaCena; nome: string }[] = [
  { id: 'crivo', nome: 'Crivo' },
  { id: 'materia', nome: 'Da matéria' },
  { id: 'floresta', nome: 'Floresta' },
  { id: 'oceano', nome: 'Oceano' },
  { id: 'grafite', nome: 'Grafite' },
];

export const PREFERENCIAS_CENA_PADRAO: PreferenciasCena = { cor: 'crivo', rotulos: true, piso: true, giro: false };

const CHAVE = 'crivo_cena3d_preferencias';

/** Aceita só valores conhecidos: chave antiga ou editada à mão não quebra a cena. */
export function lerPreferenciasCena(bruto: string | null): PreferenciasCena {
  try {
    const dado = JSON.parse(bruto ?? '{}') as Partial<PreferenciasCena>;
    return {
      cor: CORES_DA_CENA.some(item => item.id === dado.cor) ? dado.cor as CorDaCena : PREFERENCIAS_CENA_PADRAO.cor,
      rotulos: typeof dado.rotulos === 'boolean' ? dado.rotulos : PREFERENCIAS_CENA_PADRAO.rotulos,
      piso: typeof dado.piso === 'boolean' ? dado.piso : PREFERENCIAS_CENA_PADRAO.piso,
      giro: typeof dado.giro === 'boolean' ? dado.giro : PREFERENCIAS_CENA_PADRAO.giro,
    };
  } catch {
    return PREFERENCIAS_CENA_PADRAO;
  }
}

export function usePreferenciasCena(): [PreferenciasCena, (mudanca: Partial<PreferenciasCena>) => void] {
  const [preferencias, setPreferencias] = useState<PreferenciasCena>(() => {
    try { return lerPreferenciasCena(localStorage.getItem(CHAVE)); } catch { return PREFERENCIAS_CENA_PADRAO; }
  });
  const mudar = useCallback((mudanca: Partial<PreferenciasCena>) => {
    setPreferencias(atual => {
      const nova = { ...atual, ...mudanca };
      try { localStorage.setItem(CHAVE, JSON.stringify(nova)); } catch { /* sem armazenamento: vale só nesta visita */ }
      return nova;
    });
  }, []);
  return [preferencias, mudar];
}

/**
 * O palco entrega as preferências ao desenho por contexto: os nove laboratórios
 * por matéria chamam `SpatialStage` cada um por conta própria, e passar a
 * escolha por propriedade exigiria mexer em todos para dizer a mesma coisa.
 */
export const PreferenciasCenaContext = createContext<PreferenciasCena>(PREFERENCIAS_CENA_PADRAO);
export const usePreferenciasCenaAtual = () => useContext(PreferenciasCenaContext);
