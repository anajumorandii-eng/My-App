import React, { useEffect, useState } from 'react';
import { PERIODOS, duracao, fracao } from '../../../lib/periodosDoBrasil';
import { montarLinhaDoTempo, type CenaLinhaDoTempo, type IdRotulo } from './motorLinhaDoTempo';
import { usarCena } from './usarCena';

const pct = (x: number) => `${Math.round(x * 100)}%`;

/**
 * Laboratório de História no cartão do Hoje: os períodos do Brasil em
 * proporção. A leitura dá a duração, a fatia da história do país e os marcos
 * do período — as datas saem de `lib/periodosDoBrasil.ts`, conferido no
 * node:test.
 */
export default function LinhaDoTempo({ reserva }: { reserva: React.ReactNode }) {
  const [id, setId] = useState('colonia');
  const periodo = PERIODOS.find((p) => p.id === id)!;
  const { palco, cena, guardar, falhou } = usarCena<CenaLinhaDoTempo, IdRotulo>((el, r, c) => montarLinhaDoTempo(el, r, c, periodo));
  useEffect(() => { cena.current?.definir(periodo); }, [cena, periodo]);

  if (falhou) return <>{reserva}</>;
  const anos = duracao(periodo);
  const fim = periodo.fechamento === 'em curso' ? 'hoje' : String(periodo.fim);
  const descricao = `${periodo.nome}, de ${periodo.inicio} a ${fim}: ${anos} anos, ${pct(fracao(periodo))} da história do Brasil desde 1500. Marcos: ${periodo.marcos.map((m) => `${m.ano}, ${m.texto}`).join('; ')}.`;

  return (
    <figure className="crivo-cena crivo-cena--historia" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} ref={guardar(`m${i}` as IdRotulo)} className="crivo-cena__rotulo crivo-cena__rotulo--forte">{periodo.marcos[i]?.ano ?? ''}</span>
        ))}
        <span ref={guardar('inicio')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{periodo.inicio}</span>
        <span ref={guardar('fim')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{fim}</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Período">
          {PERIODOS.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => setId(p.id)}>{p.curto}</button>
          ))}
        </div>
        <p className="crivo-cena__leitura">
          <b>{periodo.nome}</b> · {periodo.inicio}–{fim} · {anos} anos, {pct(fracao(periodo))} da história
          <span>{periodo.marcos.map((m) => `${m.ano} ${m.texto}`).join(' · ')}</span>
        </p>
        <p className="crivo-cena__nota">Atrás, 1500 até hoje em proporção; na frente, o período ampliado. Vai de {periodo.abertura} a {periodo.fechamento === 'em curso' ? 'hoje' : periodo.fechamento}.</p>
      </figcaption>
    </figure>
  );
}
