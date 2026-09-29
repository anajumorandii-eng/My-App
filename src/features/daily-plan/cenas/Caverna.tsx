import React, { useEffect, useState } from 'react';
import { D_MAX, D_MIN, ESTATUA, PAREDE, alturaDaSombra, ampliacao } from '../../../lib/caverna';
import { montarCaverna, type CenaCaverna, type IdRotulo } from './motorCaverna';
import { usarCena } from './usarCena';

const num = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/**
 * Laboratório de Filosofia no cartão do Hoje: a alegoria da caverna, do
 * livro VII da República, montada com a óptica de verdade.
 *
 * A estudante aproxima e afasta a estátua do fogo; a sombra cresce e encolhe
 * sem que a estátua mude. A razão sai de `lib/caverna.ts`, conferida no
 * node:test.
 */
export default function Caverna({ reserva }: { reserva: React.ReactNode }) {
  const [d, setD] = useState(2);
  const { palco, cena, guardar, falhou } = usarCena<CenaCaverna, IdRotulo>((el, r, c) => montarCaverna(el, r, c, d));
  useEffect(() => { cena.current?.definir(d); }, [cena, d]);

  if (falhou) return <>{reserva}</>;
  const k = ampliacao(d), s = alturaDaSombra(d);
  const descricao = `Estátua de ${num(ESTATUA)} m a ${num(d)} m do fogo, parede a ${PAREDE} m: a sombra tem ${num(s)} m, ${num(k)} vezes a estátua.`;

  return (
    <figure className="crivo-cena crivo-cena--caverna" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('sombra')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">sombra ×{num(k)}</span>
        <span ref={guardar('estatua')} className="crivo-cena__rotulo">a coisa</span>
        <span ref={guardar('fogo')} className="crivo-cena__rotulo">fogo</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <label className="crivo-cena__controle">
          <span>Distância do fogo · {num(d)} m</span>
          <input type="range" min={D_MIN} max={D_MAX} step={0.25} value={d} onChange={(e) => setD(Number(e.target.value))} />
        </label>
        <p className="crivo-cena__leitura">
          <b>sombra = {num(ESTATUA)} m × {PAREDE}/{num(d)} = {num(s)} m</b>
          <span>a mesma estátua, sombras de tamanhos diferentes</span>
        </p>
        <p className="crivo-cena__nota">Platão, República, livro VII: quem só vê a parede toma a sombra pela coisa e não tem como saber o tamanho dela.</p>
      </figcaption>
    </figure>
  );
}
