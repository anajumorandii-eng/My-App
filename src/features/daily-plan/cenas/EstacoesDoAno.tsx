import React, { useEffect, useState } from 'react';
import { CIDADES, alturaAoMeioDia, declinacao, diaDoAno, duracaoDoDia, escreverDia, escreverHoras, estacaoNoSul } from '../../../lib/estacoesDoAno';
import { montarEstacoes, type CenaEstacoes, type IdRotulo } from './motorEstacoes';
import { usarCena } from './usarCena';

const graus = (g: number) => `${g.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

/**
 * Laboratório de Geografia no cartão do Hoje: as estações do ano.
 *
 * Abre no dia de hoje e em São Paulo, a cidade quase sobre o Trópico de
 * Capricórnio. A estudante move a data e troca a cidade; a leitura dá a
 * declinação do Sol, a altura dele ao meio-dia e a duração do dia, contas de
 * `lib/estacoesDoAno.ts` conferidas no node:test.
 */
export default function EstacoesDoAno({ reserva }: { reserva: React.ReactNode }) {
  const [dia, setDia] = useState(() => diaDoAno(new Date()));
  const [idCidade, setIdCidade] = useState('sao-paulo');
  const cidade = CIDADES.find((c) => c.id === idCidade)!;
  const { palco, cena, guardar, falhou } = usarCena<CenaEstacoes, IdRotulo>((el, r, c) => montarEstacoes(el, r, c, dia, cidade));
  useEffect(() => { cena.current?.definir(dia, cidade); }, [cena, dia, cidade]);

  if (falhou) return <>{reserva}</>;
  const dec = declinacao(dia), alt = alturaAoMeioDia(cidade.latitude, dia), horas = duracaoDoDia(cidade.latitude, dia);
  const estacao = estacaoNoSul(dia);
  const descricao = `${escreverDia(dia)}, ${estacao} no hemisfério sul. Em ${cidade.nome}, o Sol sobe ${graus(alt)} ao meio-dia e o dia claro dura ${escreverHoras(horas)}.`;

  return (
    <figure className="crivo-cena crivo-cena--estacoes" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('sol')} className="crivo-cena__rotulo">Sol</span>
        <span ref={guardar('cidade')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">{cidade.nome}</span>
        <span ref={guardar('equador')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">Equador</span>
        <span ref={guardar('capricornio')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">Capricórnio</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Cidade">
          {CIDADES.map((c) => (
            <button key={c.id} type="button" aria-pressed={c.id === idCidade} onClick={() => setIdCidade(c.id)}>{c.nome}</button>
          ))}
        </div>
        <label className="crivo-cena__controle">
          <span>Data · {escreverDia(dia)}</span>
          <input type="range" min={1} max={365} value={dia} onChange={(e) => setDia(Number(e.target.value))} />
        </label>
        <p className="crivo-cena__leitura">
          <b>{estacao} no sul</b> · Sol a {graus(Math.abs(dec))} {dec >= 0 ? 'N' : 'S'} · ao meio-dia, {graus(alt)} de altura
          <span>dia claro em {cidade.nome}: {escreverHoras(horas)}</span>
        </p>
        <p className="crivo-cena__nota">Eixo inclinado 23,44°. Conta geométrica, sem a refração da atmosfera, que alonga o dia em alguns minutos.</p>
      </figcaption>
    </figure>
  );
}
