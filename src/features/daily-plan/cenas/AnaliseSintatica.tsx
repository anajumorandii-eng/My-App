import React, { useEffect, useState } from 'react';
import { FRASES, NOME_DA_TRANSITIVIDADE, predicado, temSujeito, textoDaFrase } from '../../../lib/analiseSintatica';
import { montarFrase, rotuloDoTermo, type CenaFrase, type IdRotulo } from './motorFrase';
import { usarCena } from './usarCena';

/**
 * Laboratório de Português no cartão do Hoje: análise sintática em blocos.
 *
 * Uma frase por transitividade. A estudante troca a frase e vê a função de
 * cada termo e o tipo de predicado; a coerência entre verbo e complementos é
 * conferida em `lib/analiseSintatica.ts`, no node:test.
 */
export default function AnaliseSintatica({ reserva }: { reserva: React.ReactNode }) {
  const [id, setId] = useState('vtdi');
  const frase = FRASES.find((f) => f.id === id)!;
  const { palco, cena, guardar, falhou } = usarCena<CenaFrase, IdRotulo>((el, r, c) => montarFrase(el, r, c, frase));
  useEffect(() => { cena.current?.definir(frase); }, [cena, frase]);

  if (falhou) return <>{reserva}</>;
  const verbo = frase.termos.find((t) => t.funcao === 'verbo')!;
  const descricao = `${textoDaFrase(frase)} ${frase.termos.map((t) => `"${t.texto}": ${t.funcao}`).join('; ')}. Verbo ${NOME_DA_TRANSITIVIDADE[frase.transitividade]}, ${predicado(frase)}.`;

  return (
    <figure className="crivo-cena crivo-cena--frase" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} ref={guardar(`t${i}` as IdRotulo)} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{rotuloDoTermo(frase, i)}</span>
        ))}
        <span ref={guardar('predicado')} className="crivo-cena__rotulo">{predicado(frase)}</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Transitividade do verbo">
          {FRASES.map((f) => (
            <button key={f.id} type="button" aria-pressed={f.id === id} onClick={() => setId(f.id)}>{f.transitividade}</button>
          ))}
        </div>
        <p className="crivo-cena__leitura">
          <b>“{verbo.texto}”: verbo {NOME_DA_TRANSITIVIDADE[frase.transitividade]}</b> · {predicado(frase)}{temSujeito(frase) ? '' : ' · oração sem sujeito'}
          <span>{frase.licao}</span>
        </p>
        <p className="crivo-cena__nota">VTD, VTI, VTDI, VI e VL: uma frase para cada transitividade.</p>
      </figcaption>
    </figure>
  );
}
