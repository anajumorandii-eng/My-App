import React, { useEffect, useState } from 'react';
import { DOBRO, HOJE, PRE_INDUSTRIAL, aumento, forcamento } from '../../../lib/efeitoEstufa';
import { montarEstufa, type CenaEstufa, type IdRotulo } from './motorEstufa';
import { usarCena } from './usarCena';

const num = (v: number, casas = 1) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });

const MARCOS = [
  { ppm: PRE_INDUSTRIAL, nome: 'pré-industrial' },
  { ppm: HOJE, nome: 'hoje' },
  { ppm: DOBRO, nome: 'o dobro' },
];

/**
 * Laboratório de Atualidades no cartão do Hoje: efeito estufa e forçamento
 * radiativo.
 *
 * Abre em 420 ppm, o valor de hoje. O forçamento sai de `lib/efeitoEstufa.ts`,
 * conferido no node:test; temperatura só aparece no dobro, onde o IPCC dá a
 * faixa provável.
 */
export default function EfeitoEstufa({ reserva }: { reserva: React.ReactNode }) {
  const [ppm, setPpm] = useState(HOJE);
  const { palco, cena, guardar, falhou } = usarCena<CenaEstufa, IdRotulo>((el, r, c) => montarEstufa(el, r, c, ppm));
  useEffect(() => { cena.current?.definir(ppm); }, [cena, ppm]);

  if (falhou) return <>{reserva}</>;
  const df = forcamento(ppm);
  const descricao = `CO₂ em ${ppm} ppm, ${num(aumento(ppm), 0)}% acima do pré-industrial: forçamento radiativo de ${num(df, 2)} watts por metro quadrado.`;

  return (
    <figure className="crivo-cena crivo-cena--estufa" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('sol')} className="crivo-cena__rotulo">luz do Sol</span>
        <span ref={guardar('camada')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">CO₂ {ppm} ppm</span>
        <span ref={guardar('calor')} className="crivo-cena__rotulo">calor</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Concentração de referência">
          {MARCOS.map((m) => (
            <button key={m.ppm} type="button" aria-pressed={m.ppm === ppm} onClick={() => setPpm(m.ppm)}>{m.nome} · {m.ppm}</button>
          ))}
        </div>
        <label className="crivo-cena__controle">
          <span>CO₂ · {ppm} ppm</span>
          <input type="range" min={PRE_INDUSTRIAL} max={DOBRO} step={5} value={ppm} onChange={(e) => setPpm(Number(e.target.value))} />
        </label>
        <p className="crivo-cena__leitura">
          <b>ΔF = 5,35 · ln({ppm}/{PRE_INDUSTRIAL}) = {num(df, 2)} W/m²</b> · {num(aumento(ppm), 0)}% acima do pré-industrial
          <span>{ppm === DOBRO ? 'no dobro, o IPCC estima de 2,5 a 4 °C de aquecimento (faixa provável)' : 'energia a mais retida por metro quadrado da Terra'}</span>
        </p>
        <p className="crivo-cena__nota">Luz em traço reto, calor (infravermelho) em onda: é o calor que o CO₂ absorve e devolve.</p>
      </figcaption>
    </figure>
  );
}
