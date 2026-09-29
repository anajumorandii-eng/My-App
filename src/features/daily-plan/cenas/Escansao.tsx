import React, { useEffect, useState } from 'react';
import { TEXTO_DO_VERSO, VERSOS, metro } from '../../../lib/escansao';
import { montarVerso, type CenaVerso, type IdRotulo } from './motorVerso';
import { usarCena } from './usarCena';

const CURTO: Record<string, string> = { 'i-juca': 'I-Juca-Pirama', exilio: 'Canção do exílio', amor: 'Camões', lacio: 'Bilac' };

/**
 * Laboratório de Literatura no cartão do Hoje: escansão de versos.
 *
 * Quatro versos de domínio público, do metro mais curto ao decassílabo. A
 * divisão em sílabas poéticas e as tônicas vêm de `lib/escansao.ts`, que o
 * node:test confere contra o verso escrito.
 */
export default function Escansao({ reserva }: { reserva: React.ReactNode }) {
  const [id, setId] = useState('amor');
  const verso = VERSOS.find((v) => v.id === id)!;
  const { palco, cena, guardar, falhou } = usarCena<CenaVerso, IdRotulo>((el, r, c) => montarVerso(el, r, c, verso));
  useEffect(() => { cena.current?.definir(verso); }, [cena, verso]);

  if (falhou) return <>{reserva}</>;
  const n = verso.silabas.length;
  const tonicas = verso.tonicas.map((t) => `${t}ª`).join(' e ');
  const descricao = `${TEXTO_DO_VERSO[verso.id]} (${verso.autor}, ${verso.obra}). Sílabas poéticas: ${verso.silabas.join(' / ')}. ${n} sílabas, ${metro(verso)}, tônicas na ${tonicas}.`;

  return (
    <figure className="crivo-cena crivo-cena--verso" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('ultima')} className="crivo-cena__rotulo">última tônica</span>
        <span ref={guardar('sobra')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{verso.sobra ? 'não conta' : ''}</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Verso">
          {VERSOS.map((v) => (
            <button key={v.id} type="button" aria-pressed={v.id === id} onClick={() => setId(v.id)}>{CURTO[v.id]}</button>
          ))}
        </div>
        <p className="crivo-cena__leitura">
          <b>{n} sílabas · {metro(verso)}</b> · tônicas na {tonicas}
          <span>“{TEXTO_DO_VERSO[verso.id]}” — {verso.autor}</span>
        </p>
        <p className="crivo-cena__nota">Conta-se até a última tônica, e vogais que se encontram entre palavras se fundem (‿).</p>
      </figcaption>
    </figure>
  );
}
