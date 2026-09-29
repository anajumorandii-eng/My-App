import React, { useEffect, useRef, useState } from 'react';
import { ALTURA_MAX, ALTURA_MIN, BASE, ORDEM, escrever, medir, temAltura, type IdSolido } from '../../../lib/solidos';
import { useCoresDaCena } from './coresDaCena';
import { montarSolido, type CenaSolido, type IdRotulo } from './motorSolido';

const NOMES: Record<IdSolido, string> = { prisma: 'Prisma', cilindro: 'Cilindro', piramide: 'Pirâmide', cone: 'Cone', esfera: 'Esfera' };
const num = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/**
 * Laboratório de Matemática no cartão do Hoje: sólidos geométricos.
 *
 * A estudante troca o sólido, muda a altura e gira com o dedo. A leitura dá
 * volume e área total com as fórmulas dos livros, em múltiplos de π quando
 * cabe, e a medida auxiliar que a prova cobra (geratriz do cone, apótema da
 * pirâmide). As contas saem de `lib/solidos.ts`, conferido no node:test.
 */
export default function SolidosGeometricos({ reserva }: { reserva: React.ReactNode }) {
  const cores = useCoresDaCena();
  const [id, setId] = useState<IdSolido>('cone');
  const [altura, setAltura] = useState(4);
  const [falhou, setFalhou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const cena = useRef<CenaSolido | null>(null);
  const rotulos = useRef<Partial<Record<IdRotulo, HTMLSpanElement | null>>>({});
  const inicial = useRef({ cores, id, altura });

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    try {
      const { cores: c, id: i, altura: a } = inicial.current;
      cena.current = montarSolido(el, rotulos.current, c, i, a);
    } catch {
      // WebGL negado depois da sonda: volta ao Núcleo, como as outras cenas.
      setFalhou(true);
    }
    return () => { cena.current?.destruir(); cena.current = null; };
  }, []);
  useEffect(() => { cena.current?.definir(id, altura); }, [id, altura]);
  useEffect(() => { cena.current?.configurar({ acento: cores.acento, escuro: cores.escuro }); }, [cores.acento, cores.escuro]);

  const l = medir(id, altura);
  const redondo = id === 'cilindro' || id === 'cone' || id === 'esfera';
  const guardar = (rid: IdRotulo) => (el: HTMLSpanElement | null) => { rotulos.current[rid] = el; };
  const descricao = `${l.nome}: ${redondo ? 'raio' : 'lado da base'} ${BASE}${temAltura(id) ? `, altura ${num(altura)}` : ''}; volume ${escrever(l.volume)}, área total ${escrever(l.areaTotal)}.`;

  if (falhou) return <>{reserva}</>;

  return (
    <figure className="crivo-cena crivo-cena--solido" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
        <span ref={guardar('altura')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{temAltura(id) ? `h = ${num(altura)}` : ''}</span>
        <span ref={guardar('base')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{redondo ? `r = ${BASE}` : `ℓ = ${BASE}`}</span>
        <span ref={guardar('auxiliar')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">{l.auxiliar ? `${l.auxiliar.nome === 'geratriz' ? 'g' : 'ap'} = ${num(l.auxiliar.valor)}` : ''}</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <div className="crivo-cena__escolha" role="group" aria-label="Sólido">
          {ORDEM.map((s) => (
            <button key={s} type="button" aria-pressed={s === id} onClick={() => setId(s)}>{NOMES[s]}</button>
          ))}
        </div>
        {temAltura(id) && (
          <label className="crivo-cena__controle">
            <span>Altura</span>
            <input type="range" min={ALTURA_MIN} max={ALTURA_MAX} step={0.5} value={altura} onChange={(e) => setAltura(Number(e.target.value))} />
          </label>
        )}
        <p className="crivo-cena__leitura">
          <b>{l.formulaVolume}</b> · V = {escrever(l.volume)}
          <span>área total = {escrever(l.areaTotal)}{l.auxiliar ? ` · ${l.auxiliar.nome} = ${num(l.auxiliar.valor)}` : ''}</span>
        </p>
        <p className="crivo-cena__nota">Base de medida {BASE}. Arraste de lado para girar.</p>
      </figcaption>
    </figure>
  );
}
