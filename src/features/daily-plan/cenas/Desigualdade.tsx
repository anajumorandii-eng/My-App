import React, { useEffect, useState } from 'react';
import { GINI_MAX, REFERENCIAS } from '../../../lib/desigualdade';
import { montarDecimos, type CenaDecimos, type IdRotulo } from './motorDecimos';
import { usarCena } from './usarCena';

/** Com o artigo certo: "da Suécia", "dos EUA", "do Brasil". */
const DE: Record<string, string> = { suecia: 'da Suécia', eua: 'dos EUA', brasil: 'do Brasil' };

const gini = (g: number) => g.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Laboratório de Sociologia no cartão do Hoje: desigualdade de renda e o
 * índice de Gini.
 *
 * Abre no Gini do Brasil. As colunas seguem a curva modelo de
 * `lib/desigualdade.ts`, e a nota diz isso: são a forma de uma repartição com
 * aquele Gini, não a repartição medida do país — por isso a cena não escreve
 * porcentagens por décimo.
 */
export default function Desigualdade({ reserva }: { reserva: React.ReactNode }) {
  const [g, setG] = useState(0.52);
  const { palco, cena, guardar, falhou } = usarCena<CenaDecimos, IdRotulo>((el, r, c) => montarDecimos(el, r, c, g));
  useEffect(() => { cena.current?.definir(g); }, [cena, g]);

  if (falhou) return <>{reserva}</>;
  const ref = REFERENCIAS.find((r) => Math.abs(r.gini - g) < 0.005);
  const descricao = `Índice de Gini ${gini(g)}${ref ? `, perto do Gini ${DE[ref.id]}` : ''}. Dez colunas, do décimo mais pobre ao mais rico, com a fatia da renda de cada um.`;

  return (
    <figure className="crivo-cena crivo-cena--desigualdade" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('ricos')} className="crivo-cena__rotulo">10% mais ricos</span>
        <span ref={guardar('pobres')} className="crivo-cena__rotulo">10% mais pobres</span>
        <span ref={guardar('igualdade')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">igualdade</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Gini de referência">
          {REFERENCIAS.map((r) => (
            <button key={r.id} type="button" aria-pressed={Math.abs(r.gini - g) < 0.005} onClick={() => setG(r.gini)}>{r.nome} ≈ {gini(r.gini)}</button>
          ))}
        </div>
        <label className="crivo-cena__controle">
          <span>Gini · {gini(g)}</span>
          <input type="range" min={0} max={GINI_MAX} step={0.01} value={g} onChange={(e) => setG(Number(e.target.value))} />
        </label>
        <p className="crivo-cena__leitura">
          <b>Gini {gini(g)}</b>{ref ? ` · perto do Gini ${DE[ref.id]}` : ''} · 0 é renda igual, 1 é tudo com uma pessoa
          <span>Gini = 2 × área entre a diagonal da igualdade e a curva de Lorenz</span>
        </p>
        <p className="crivo-cena__nota">As colunas seguem uma curva modelo com esse Gini: dois países com o mesmo índice podem repartir a renda de jeitos diferentes.</p>
      </figcaption>
    </figure>
  );
}
