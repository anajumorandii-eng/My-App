import React, { useEffect, useRef, useState } from 'react';
import { MOLDE, codonDoPar, codons, parNaPosicao } from '../../../lib/duplaHelice';
import { useCoresDaCena } from './coresDaCena';
import { montarHelice, type Helice, type IdRotulo } from './motorDuplaHelice';

/**
 * Dupla-hélice de DNA: a cena de "Código Genético e Síntese Proteica" no
 * cartão do Hoje.
 *
 * A estudante escolhe um par (tocando o degrau ou pelo controle) e lê o
 * pareamento, as pontes de hidrogênio e o códon do RNAm que aquele trecho do
 * molde forma. Tudo sai de `lib/duplaHelice.ts`, conferido no node:test.
 * Parada como a bancada óptica: nada se mexe sozinho.
 */
export default function DuplaHelice({ reserva }: { reserva: React.ReactNode }) {
  const cores = useCoresDaCena();
  const [indice, setIndice] = useState(0);
  const [falhou, setFalhou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const helice = useRef<Helice | null>(null);
  const rotulos = useRef<Partial<Record<IdRotulo, HTMLSpanElement | null>>>({});
  const coresRef = useRef(cores);
  coresRef.current = cores;
  const indiceRef = useRef(indice);
  indiceRef.current = indice;

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    try {
      helice.current = montarHelice(el, rotulos.current, coresRef.current, indiceRef.current, setIndice);
    } catch {
      // WebGL negado depois da sonda: volta ao Núcleo, como a bancada.
      setFalhou(true);
    }
    return () => { helice.current?.destruir(); helice.current = null; };
  }, []);
  useEffect(() => { helice.current?.definirPar(indice); }, [indice]);
  useEffect(() => { helice.current?.configurar({ acento: cores.acento, escuro: cores.escuro }); }, [cores.acento, cores.escuro]);

  const par = parNaPosicao(indice);
  const codon = codonDoPar(indice);
  const guardar = (id: IdRotulo) => (el: HTMLSpanElement | null) => { rotulos.current[id] = el; };
  const descricao = `Dupla-hélice de DNA com ${MOLDE.length} pares. Par ${indice + 1}: ${par.molde} na fita molde, ${par.complementar} na complementar, ${par.pontesDeHidrogenio} pontes de hidrogênio; no RNAm entra ${par.rna}, no códon ${codon.trinca} (${codon.significado}).`;

  if (falhou) return <>{reserva}</>;

  return (
    <figure className="crivo-cena crivo-cena--helice" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('molde')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">{par.molde}</span>
        <span ref={guardar('complementar')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">{par.complementar}</span>
        <span ref={guardar('pontes')} className="crivo-cena__rotulo">{par.pontesDeHidrogenio} pontes de H</span>
        <span ref={guardar('fitaMolde3')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">3′ molde</span>
        <span ref={guardar('fitaMolde5')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">5′</span>
        <span ref={guardar('fitaComp5')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">5′</span>
        <span ref={guardar('fitaComp3')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">3′</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <label className="crivo-cena__controle">
          <span>Par em foco</span>
          <input type="range" min={1} max={MOLDE.length} step={1} value={indice + 1} onChange={(e) => setIndice(Number(e.target.value) - 1)} />
        </label>
        <p className="crivo-cena__leitura">
          <b>{par.molde}–{par.complementar}</b> · {par.pontesDeHidrogenio} pontes de H · RNA {par.rna}
          <span>
            RNAm {codons().map((c) => (c.numero === codon.numero ? `[${c.trinca}]` : c.trinca)).join(' ')} · {codon.significado}
          </span>
        </p>
        <p className="crivo-cena__nota">Sequência ilustrativa, escolhida para a tradução ser conferível.</p>
      </figcaption>
    </figure>
  );
}
