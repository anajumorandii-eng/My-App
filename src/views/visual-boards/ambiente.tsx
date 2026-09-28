import { createContext, useContext, useEffect } from 'react';
import type { Ambiente } from '../../lib/visualAmbiente';
import type { PreferenciasVisual } from '../../hooks/usePreferenciasVisual';
import { aplicarAmbiente, useAmbienteApp } from '../../design-system/ambiente/AmbienteProvider';

/**
 * Se a prancha do capítulo aberto usa a moldura tecnológica. Quem decide é o
 * Visual (por `usaMolduraTecnologica`), e não cada instrumento: antes cada um
 * passava `tecnologico` com a sua própria lista de ids, e a tela em volta não
 * tinha como saber. Uma fonte só faz a prancha e a tela acenderem juntas.
 */
export const MolduraTecnologicaContext = createContext(false);

export const useMolduraTecnologica = () => useContext(MolduraTecnologicaContext);

/**
 * Pede para a tela inteira o ambiente do conteúdo aberto (capítulo, matéria
 * filtrada) e o solta ao sair.
 *
 * Dentro do app, quem escreve no <html> é o `AmbienteProvider` do layout, e
 * este hook só registra o pedido. Fora dele (teste de componente, prancha
 * renderizada solta) aplica direto, como fazia antes de o ambiente valer
 * para o app todo.
 */
export function useAmbienteDaTela(ambiente: Ambiente | null, preferencias?: Pick<PreferenciasVisual, 'efeitos' | 'fundo'>) {
  const app = useAmbienteApp();
  const registrar = app?.registrar;
  const efeitos = preferencias?.efeitos ?? 'completo';
  const fundo = preferencias?.fundo ?? 'aurora';
  useEffect(() => {
    if (!ambiente || typeof document === 'undefined') return;
    if (registrar) {
      registrar(ambiente);
      return () => registrar(null);
    }
    return aplicarAmbiente(ambiente, { efeitos, fundo });
  }, [ambiente, registrar, efeitos, fundo]);
}
