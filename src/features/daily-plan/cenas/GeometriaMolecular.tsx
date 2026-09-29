import React, { useEffect, useRef, useState } from 'react';
import { MOLECULAS, ORDEM, ehPolar, type IdMolecula } from '../../../lib/geometriaMolecular';
import { useCoresDaCena } from './coresDaCena';
import { montarMolecula, type CenaMolecula, type IdRotulo } from './motorMolecula';

const fmtGraus = (g: number) => `${g.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

/**
 * Molécula em 3D: a cena de "Polaridade das Ligações e Geometria Molecular"
 * no cartão do Hoje.
 *
 * A estudante troca a molécula e gira com o dedo. A leitura dá as nuvens de
 * elétrons, a geometria, o ângulo e a polaridade — esta calculada pela soma
 * dos vetores das ligações em `lib/geometriaMolecular.ts`, não escrita à mão.
 * A sequência CH₄ → NH₃ → H₂O é a que os livros usam: as mesmas quatro
 * nuvens, e cada par livre fecha o ângulo e tira a molécula do tetraedro.
 */
export default function GeometriaMolecular({ reserva }: { reserva: React.ReactNode }) {
  const cores = useCoresDaCena();
  const [id, setId] = useState<IdMolecula>('NH3');
  const [falhou, setFalhou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const cena = useRef<CenaMolecula | null>(null);
  const rotulos = useRef<Partial<Record<IdRotulo, HTMLSpanElement | null>>>({});
  const coresRef = useRef(cores);
  coresRef.current = cores;
  const idRef = useRef(id);
  idRef.current = id;

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    try {
      cena.current = montarMolecula(el, rotulos.current, coresRef.current, idRef.current);
    } catch {
      // WebGL negado depois da sonda: volta ao Núcleo, como as outras cenas.
      setFalhou(true);
    }
    return () => { cena.current?.destruir(); cena.current = null; };
  }, []);
  useEffect(() => { cena.current?.definirMolecula(id); }, [id]);
  useEffect(() => { cena.current?.configurar({ acento: cores.acento, escuro: cores.escuro }); }, [cores.acento, cores.escuro]);

  const m = MOLECULAS[id];
  const polar = ehPolar(m);
  const guardar = (rid: IdRotulo) => (el: HTMLSpanElement | null) => { rotulos.current[rid] = el; };
  const nuvens = m.paresLigantes + m.paresNaoLigantes;
  const livres = m.paresNaoLigantes === 0 ? 'nenhum par livre' : m.paresNaoLigantes === 1 ? '1 par livre' : `${m.paresNaoLigantes} pares livres`;
  const descricao = `${m.formula}: ${nuvens} nuvens de elétrons no ${m.central}, ${m.paresLigantes} ligantes e ${livres}; geometria ${m.geometria}, ângulo de ${fmtGraus(m.anguloGraus)}; molécula ${polar ? 'polar' : 'apolar'}.`;

  if (falhou) return <>{reserva}</>;

  return (
    <figure className="crivo-cena crivo-cena--molecula" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('central')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">{m.central}</span>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} ref={guardar(`l${i}` as IdRotulo)} className="crivo-cena__rotulo">{i < m.ligacoes.length ? m.ligante : ''}</span>
        ))}
        <span ref={guardar('angulo')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{fmtGraus(m.anguloGraus)}</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Molécula">
          {ORDEM.map((mid) => (
            <button key={mid} type="button" aria-pressed={mid === id} onClick={() => setId(mid)}>{MOLECULAS[mid].formula}</button>
          ))}
        </div>
        <p className="crivo-cena__leitura">
          <b>{m.geometria} · {fmtGraus(m.anguloGraus)}</b> · {nuvens} nuvens: {m.paresLigantes} ligantes, {livres}
          <span>molécula {polar ? 'polar' : 'apolar'}{polar ? ': os vetores das ligações não se anulam' : ': os vetores das ligações se anulam'}</span>
        </p>
        <p className="crivo-cena__nota">Arraste de lado para girar a molécula.</p>
      </figcaption>
    </figure>
  );
}
