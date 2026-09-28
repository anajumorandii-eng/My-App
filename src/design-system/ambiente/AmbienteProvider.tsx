import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ambienteDaMateria, rgbDe, type Ambiente } from '../../lib/visualAmbiente';
import { usePreferenciasVisual, type PreferenciasVisual } from '../../hooks/usePreferenciasVisual';

/**
 * Ambiente de cor do app inteiro.
 *
 * O estilo tecnológico começou no Visual, que escrevia o ambiente direto no
 * <html>. Ao levar o estilo para as outras telas, dois escritores no mesmo
 * atributo virariam disputa: o layout pintando a cor padrão e o Visual a cor
 * do capítulo, cada um desfazendo o outro na limpeza. Aqui há um escritor só.
 *
 * - Sem tela pedindo nada, vale a cor que a estudante escolheu no Personalizar
 *   (ou a padrão, na cor automática).
 * - Uma tela com conteúdo — capítulo aberto no Visual ou nos Resumos — registra
 *   o ambiente dele com `useAmbienteDaTela` e o solta ao sair.
 */
interface AmbienteApp {
  preferencias: PreferenciasVisual;
  mudarPreferencias: (mudanca: Partial<PreferenciasVisual>) => void;
  /** O ambiente que uma tela pediu, se algum. */
  sobreposto: Ambiente | null;
  registrar: (ambiente: Ambiente | null) => void;
}

const AmbienteContext = createContext<AmbienteApp | null>(null);

export const useAmbienteApp = () => useContext(AmbienteContext);

/** Aplica o ambiente no <html>; devolve a função que desfaz. */
export function aplicarAmbiente(ambiente: Ambiente, preferencias: Pick<PreferenciasVisual, 'efeitos' | 'fundo'>) {
  const raiz = document.documentElement;
  const { a, b, c, fundo: fundoEscuro } = ambiente.paleta;
  const cores: Record<string, string> = {
    '--amb-a-neon': a, '--amb-b-neon': b, '--amb-c-neon': c, '--amb-fundo-escuro': fundoEscuro, '--amb-a-rgb': rgbDe(a),
  };
  raiz.dataset.ambiente = 'tecnologico';
  raiz.dataset.ambienteNome = ambiente.nome;
  // Efeitos e fundo escolhidos no Personalizar: o CSS lê daqui, e o JS também
  // (o valor que se decodifica não embaralha fora do "completo").
  raiz.dataset.efeitos = preferencias.efeitos;
  raiz.dataset.fundo = preferencias.fundo;
  for (const [nome, valor] of Object.entries(cores)) raiz.style.setProperty(nome, valor);
  return () => {
    delete raiz.dataset.ambiente;
    delete raiz.dataset.ambienteNome;
    delete raiz.dataset.efeitos;
    delete raiz.dataset.fundo;
    for (const nome of Object.keys(cores)) raiz.style.removeProperty(nome);
  };
}

export function AmbienteProvider({ children }: { children: React.ReactNode }) {
  const [preferencias, mudarPreferencias] = usePreferenciasVisual();
  const [sobreposto, setSobreposto] = useState<Ambiente | null>(null);
  const registrar = useCallback((ambiente: Ambiente | null) => setSobreposto(ambiente), []);
  const efetivo = useMemo(() => sobreposto ?? ambienteDaMateria('', preferencias.cor), [sobreposto, preferencias.cor]);

  useEffect(() => aplicarAmbiente(efetivo, preferencias), [efetivo, preferencias]);

  const valor = useMemo(() => ({ preferencias, mudarPreferencias, sobreposto, registrar }), [preferencias, mudarPreferencias, sobreposto, registrar]);
  return <AmbienteContext.Provider value={valor}>{children}</AmbienteContext.Provider>;
}
