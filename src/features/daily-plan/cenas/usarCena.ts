import { useEffect, useRef, useState } from 'react';
import { useCoresDaCena } from './coresDaCena';
import type { OpcoesDeCor } from './estudio3d';

interface CenaMontada { configurar(cores: OpcoesDeCor): void; destruir(): void }

/**
 * O que toda cena do Hoje repete em volta do motor: montar uma vez no palco,
 * cair na reserva se o WebGL for negado depois da sonda, seguir a cor da
 * matéria e o tema, e desmontar ao sair da aba. As quatro primeiras cenas
 * repetiam isso à mão; com doze, uma divergência entre elas viraria defeito
 * de uma matéria só.
 */
export function usarCena<C extends CenaMontada, Id extends string>(
  montar: (palco: HTMLElement, rotulos: Partial<Record<Id, HTMLElement | null>>, cores: OpcoesDeCor) => C,
) {
  const cores = useCoresDaCena();
  const [falhou, setFalhou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const cena = useRef<C | null>(null);
  const rotulos = useRef<Partial<Record<Id, HTMLElement | null>>>({});
  // O estado inicial entra pela primeira montagem; depois, pelos efeitos da cena.
  const inicial = useRef({ montar, cores });

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    try {
      const { montar: m, cores: c } = inicial.current;
      cena.current = m(el, rotulos.current, { acento: c.acento, escuro: c.escuro });
    } catch {
      setFalhou(true);
    }
    return () => { cena.current?.destruir(); cena.current = null; };
  }, []);
  useEffect(() => { cena.current?.configurar({ acento: cores.acento, escuro: cores.escuro }); }, [cores.acento, cores.escuro]);

  const guardar = (id: Id) => (el: HTMLElement | null) => { rotulos.current[id] = el; };
  return { palco, cena, guardar, falhou };
}
