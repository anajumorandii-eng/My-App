import { createContext, useContext, useEffect } from 'react';
import { rgbDe, type Ambiente } from '../../lib/visualAmbiente';
import type { PreferenciasVisual } from '../../hooks/usePreferenciasVisual';

/**
 * Se a prancha do capítulo aberto usa a moldura tecnológica. Quem decide é o
 * Visual (por `usaMolduraTecnologica`), e não cada instrumento: antes cada um
 * passava `tecnologico` com a sua própria lista de ids, e a tela em volta não
 * tinha como saber. Uma fonte só faz a prancha e a tela acenderem juntas.
 */
export const MolduraTecnologicaContext = createContext(false);

export const useMolduraTecnologica = () => useContext(MolduraTecnologicaContext);

/**
 * Veste a tela inteira com o ambiente do capítulo enquanto ele está aberto: o
 * atributo e as cores vão no `<html>`, para alcançar também a barra do topo,
 * o trilho lateral e a barra de baixo, que ficam fora do Visual. Ao sair do
 * capítulo tudo é removido, e o resto do app volta à paleta de sempre.
 */
export function useAmbienteDaTela(ambiente: Ambiente | null, preferencias?: Pick<PreferenciasVisual, 'efeitos' | 'fundo'>) {
  const efeitos = preferencias?.efeitos ?? 'completo';
  const fundo = preferencias?.fundo ?? 'aurora';
  useEffect(() => {
    if (!ambiente || typeof document === 'undefined') return;
    const raiz = document.documentElement;
    const { a, b, c, fundo: fundoEscuro } = ambiente.paleta;
    const cores: Record<string, string> = {
      '--amb-a-neon': a, '--amb-b-neon': b, '--amb-c-neon': c, '--amb-fundo-escuro': fundoEscuro, '--amb-a-rgb': rgbDe(a),
    };
    raiz.dataset.ambiente = 'tecnologico';
    raiz.dataset.ambienteNome = ambiente.nome;
    // Efeitos e fundo escolhidos no painel Personalizar: o CSS lê daqui, e o
    // JS também (o valor que se decodifica não embaralha fora do "completo").
    raiz.dataset.efeitos = efeitos;
    raiz.dataset.fundo = fundo;
    for (const [nome, valor] of Object.entries(cores)) raiz.style.setProperty(nome, valor);
    return () => {
      delete raiz.dataset.ambiente;
      delete raiz.dataset.ambienteNome;
      delete raiz.dataset.efeitos;
      delete raiz.dataset.fundo;
      for (const nome of Object.keys(cores)) raiz.style.removeProperty(nome);
    };
  }, [ambiente, efeitos, fundo]);
}
