import { useCallback, useState } from 'react';
import { PALETAS_FIXAS, type ModoCor } from '../lib/visualAmbiente';

/**
 * Como a estudante quer o Visual: cor, intensidade dos efeitos e fundo.
 *
 * A Ana Júlia pediu "mais interações e personalizações". A cor automática
 * (matéria + conteúdo) continua o padrão; aqui ela pode trocar por uma paleta
 * fixa, baixar os efeitos (as partículas e a inclinação gastam bateria e nem
 * todo dia se quer movimento) ou trocar o fundo.
 *
 * Fica em `localStorage` por ser conveniência de quem usa, não dado de estudo.
 * Leitura e escrita em try/catch: com o armazenamento bloqueado (janela
 * privada) a tela abre no padrão e a escolha vale só nesta visita.
 */
export type Efeitos = 'completo' | 'suave' | 'minimo';
/**
 * `caderno` é papel envelhecido com os rabiscos da matéria; `papel`, o mesmo
 * papel sem rabiscos. Caderno é o padrão desde que a Ana Júlia pediu o fundo da
 * bancada óptica na tela inteira; quem já tinha escolhido outro fica com ele.
 */
export type Fundo = 'caderno' | 'papel' | 'aurora' | 'grade' | 'liso';

const FUNDOS: readonly Fundo[] = ['caderno', 'papel', 'aurora', 'grade', 'liso'];

export interface PreferenciasVisual {
  cor: ModoCor;
  efeitos: Efeitos;
  fundo: Fundo;
}

export const PREFERENCIAS_PADRAO: PreferenciasVisual = { cor: 'automatica', efeitos: 'completo', fundo: 'caderno' };

const CHAVE = 'crivo_visual_preferencias';

/** Aceita só valores conhecidos: uma chave antiga ou editada à mão não quebra a tela. */
export function lerPreferencias(bruto: string | null): PreferenciasVisual {
  try {
    const dado = JSON.parse(bruto ?? '{}') as Partial<PreferenciasVisual>;
    const cor = dado.cor === 'automatica' || dado.cor === 'materia' || (typeof dado.cor === 'string' && dado.cor in PALETAS_FIXAS) ? dado.cor : PREFERENCIAS_PADRAO.cor;
    const efeitos = dado.efeitos === 'suave' || dado.efeitos === 'minimo' || dado.efeitos === 'completo' ? dado.efeitos : PREFERENCIAS_PADRAO.efeitos;
    const fundo = FUNDOS.includes(dado.fundo as Fundo) ? (dado.fundo as Fundo) : PREFERENCIAS_PADRAO.fundo;
    return { cor, efeitos, fundo };
  } catch {
    return PREFERENCIAS_PADRAO;
  }
}

export function usePreferenciasVisual(): [PreferenciasVisual, (mudanca: Partial<PreferenciasVisual>) => void] {
  const [preferencias, setPreferencias] = useState<PreferenciasVisual>(() => {
    try { return lerPreferencias(localStorage.getItem(CHAVE)); } catch { return PREFERENCIAS_PADRAO; }
  });
  const mudar = useCallback((mudanca: Partial<PreferenciasVisual>) => {
    setPreferencias((atual) => {
      const nova = { ...atual, ...mudanca };
      try { localStorage.setItem(CHAVE, JSON.stringify(nova)); } catch { /* sem armazenamento: vale só nesta visita */ }
      return nova;
    });
  }, []);
  return [preferencias, mudar];
}
