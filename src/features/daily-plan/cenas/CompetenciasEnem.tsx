import React, { useEffect, useMemo, useState } from 'react';
import {
  COMPETENCIAS, ELEMENTOS_DA_INTERVENCAO, MAXIMO, NIVEL, notaDaIntervencao, notaTotal,
  type Elemento, type IdCompetencia,
} from '../../../lib/competenciasEnem';
import { montarCompetencias, type CenaCompetencias, type IdRotulo } from './motorCompetencias';
import { usarCena } from './usarCena';

/**
 * Laboratório de Redação no cartão do Hoje: um simulador das cinco
 * competências do ENEM.
 *
 * As quatro primeiras mudam por nível, no controle deslizante; a quinta muda
 * pelos elementos da proposta de intervenção, que é como a correção a conta.
 * É um simulador, não a nota dela: abre em 120 em tudo, o meio da escala, e a
 * leitura diz isso.
 */
export default function CompetenciasEnem({ reserva }: { reserva: React.ReactNode }) {
  const [base, setBase] = useState<Record<Exclude<IdCompetencia, 'c5'>, number>>({ c1: 120, c2: 120, c3: 120, c4: 120 });
  const [elementos, setElementos] = useState<ReadonlySet<Elemento>>(() => new Set(['agente', 'ação', 'modo ou meio'] as const));
  const [foco, setFoco] = useState<IdCompetencia>('c5');
  const notas = useMemo(() => ({ ...base, c5: notaDaIntervencao(elementos) }), [base, elementos]);
  const { palco, cena, guardar, falhou } = usarCena<CenaCompetencias, IdRotulo>((el, r, c) => montarCompetencias(el, r, c, notas, foco));
  useEffect(() => { cena.current?.definir(notas, foco); }, [cena, notas, foco]);

  if (falhou) return <>{reserva}</>;
  const total = notaTotal(notas);
  const comp = COMPETENCIAS.find((c) => c.id === foco)!;
  const alternar = (e: Elemento) => setElementos((atual) => {
    const novo = new Set(atual);
    if (novo.has(e)) novo.delete(e); else novo.add(e);
    return novo;
  });
  const descricao = `Simulação das competências do ENEM: ${COMPETENCIAS.map((c) => `C${c.numero} ${notas[c.id]}`).join(', ')}; total ${total} de 1000.`;

  return (
    <figure className="crivo-cena crivo-cena--redacao" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        {COMPETENCIAS.map((c) => (
          <React.Fragment key={c.id}>
            <span ref={guardar(`n${c.id}`)} className={`crivo-cena__rotulo ${c.id === foco ? 'crivo-cena__rotulo--forte' : 'crivo-cena__rotulo--cota'}`}>{notas[c.id]}</span>
            <span ref={guardar(`r${c.id}`)} className="crivo-cena__rotulo crivo-cena__rotulo--cota">C{c.numero}</span>
          </React.Fragment>
        ))}
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Competência">
          {COMPETENCIAS.map((c) => (
            <button key={c.id} type="button" aria-pressed={c.id === foco} onClick={() => setFoco(c.id)}>C{c.numero}</button>
          ))}
        </div>
        {foco === 'c5' ? (
          <div className="crivo-cena__escolha" role="group" aria-label="Elementos da proposta de intervenção">
            {ELEMENTOS_DA_INTERVENCAO.map((e) => (
              <button key={e} type="button" aria-pressed={elementos.has(e)} onClick={() => alternar(e)}>{e}</button>
            ))}
          </div>
        ) : (
          <label className="crivo-cena__controle">
            <span>C{comp.numero} · {notas[foco]}</span>
            <input type="range" min={0} max={MAXIMO} step={NIVEL} value={notas[foco]} onChange={(e) => setBase((b) => ({ ...b, [foco]: Number(e.target.value) }))} />
          </label>
        )}
        <p className="crivo-cena__leitura">
          <b>total {total} de 1.000</b> · C{comp.numero}: {notas[foco]} de 200
          <span>{comp.resumo}{foco === 'c5' ? ` · ${elementos.size} de 5 elementos` : ''}</span>
        </p>
        <p className="crivo-cena__nota">Simulação, não a sua nota. Cada folha é um nível de 40 pontos; o contorno marca os 200.</p>
      </figcaption>
    </figure>
  );
}
