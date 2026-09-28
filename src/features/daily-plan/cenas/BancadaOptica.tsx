import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { imagemDaLente, naturezaDaImagem } from '../../../lib/lenteDelgada';
import { CHAVE_PREFERENCIAS, MEDIDAS, lerPreferencias, type Papel, type PreferenciasDaCena } from '../../../lib/bancadaOptica';
import { useCoresDaCena } from './coresDaCena';
import { montarBancada, type Bancada, type IdRotulo } from './motorBancadaOptica';

/**
 * Bancada óptica em 3D: a cena de Física do cartão do Hoje.
 *
 * Não é ilustração: a posição e o tamanho da imagem no anteparo saem de
 * lenteDelgada.ts (1/f = 1/p + 1/p'), o mesmo módulo que o node:test confere.
 * Arrastar a caixa de luz pelo trilho, ou usar o controle abaixo da cena, move
 * a imagem como numa bancada de verdade.
 *
 * O desenho mora em motorBancadaOptica.ts; aqui ficam o estado, os rótulos em
 * HTML (fonte do app e leitor de tela) e a personalização.
 *
 * Sem entrada animada: o objeto já aparece na posição inicial. A Ana Júlia
 * pediu a cena parada, mudando só pelo gesto dela.
 */

const { cmPorUnidade: CM, foco: FOCO, pMin: P_MIN, pMax: P_MAX, pInicial: P_INICIAL } = MEDIDAS;
const fmt = (valor: number) => valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

function lerDoAparelho(): PreferenciasDaCena {
  try {
    return lerPreferencias(window.localStorage.getItem(CHAVE_PREFERENCIAS));
  } catch {
    return lerPreferencias(null);
  }
}

const PAPEIS: { valor: Papel; nome: string }[] = [
  { valor: 'milimetrado', nome: 'Milimetrado' },
  { valor: 'pautado', nome: 'Pautado' },
  { valor: 'liso', nome: 'Liso' },
];

export default function BancadaOptica({ reserva }: { reserva: React.ReactNode }) {
  const cores = useCoresDaCena();
  const [p, setP] = useState<number>(P_INICIAL);
  const [preferencias, setPreferencias] = useState(lerDoAparelho);
  const [falhou, setFalhou] = useState(false);
  const palco = useRef<HTMLDivElement>(null);
  const bancada = useRef<Bancada | null>(null);
  const rotulos = useRef<Partial<Record<IdRotulo, HTMLSpanElement | null>>>({});
  const opcoes = { acento: cores.acento, escuro: cores.escuro, preferencias };
  const opcoesRef = useRef(opcoes);
  opcoesRef.current = opcoes;
  const pRef = useRef(p);
  pRef.current = p;

  useEffect(() => {
    const el = palco.current;
    if (!el) return;
    try {
      bancada.current = montarBancada(el, rotulos.current, opcoesRef.current, pRef.current, setP);
    } catch {
      // WebGL anunciado mas indisponível na hora (contexto perdido, limite de
      // contextos): volta ao Núcleo do Crivo, como o aparelho sem WebGL. Só
      // esconder os rótulos deixava um palco vazio com controles soltos.
      setFalhou(true);
    }
    return () => { bancada.current?.destruir(); bancada.current = null; };
  }, []);

  useEffect(() => { bancada.current?.definirP(p); }, [p]);
  useEffect(() => {
    bancada.current?.configurar({ acento: cores.acento, escuro: cores.escuro, preferencias });
  }, [cores.acento, cores.escuro, preferencias]);

  const ajustar = (mudanca: Partial<PreferenciasDaCena>) => {
    setPreferencias((antes) => {
      const novas = { ...antes, ...mudanca };
      try { window.localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(novas)); } catch { /* aba anônima: vale só nesta visita */ }
      return novas;
    });
  };

  const imagem = imagemDaLente(p, FOCO)!;
  const natureza = naturezaDaImagem(imagem);
  const descricao = `Bancada óptica: objeto a ${fmt(p * CM)} cm de uma lente convergente de foco ${FOCO * CM} cm; imagem ${natureza}, a ${fmt(imagem.pLinha * CM)} cm da lente.`;
  const guardar = (id: IdRotulo) => (el: HTMLSpanElement | null) => { rotulos.current[id] = el; };

  if (falhou) return <>{reserva}</>;

  return (
    <figure className="crivo-cena crivo-cena--optica" aria-label={descricao}>
      <div ref={palco} className="crivo-cena__palco" aria-hidden="true">
            <span ref={guardar('F')} className="crivo-cena__rotulo">F</span>
            <span ref={guardar('F2')} className="crivo-cena__rotulo">F′</span>
            <span ref={guardar('objeto')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">objeto</span>
            <span ref={guardar('imagem')} className="crivo-cena__rotulo crivo-cena__rotulo--forte">imagem {imagem.real ? 'real' : 'virtual'}, {imagem.invertida ? 'invertida' : 'direita'}</span>
            <span ref={guardar('cotaP')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">p = {fmt(p * CM)} cm</span>
            <span ref={guardar('cotaPl')} className="crivo-cena__rotulo crivo-cena__rotulo--cota">p′ = {fmt(imagem.pLinha * CM)} cm</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <label className="crivo-cena__controle">
          <span>Distância do objeto</span>
          <input
            type="range"
            min={P_MIN * CM}
            max={P_MAX * CM}
            step={1}
            value={Math.round(p * CM)}
            onChange={(e) => setP(Number(e.target.value) / CM)}
          />
        </label>
        <p className="crivo-cena__leitura">
          <b>p = {fmt(p * CM)} cm</b> · p′ = {fmt(imagem.pLinha * CM)} cm · f = {FOCO * CM} cm
          <span>imagem {natureza}</span>
        </p>
        <details className="crivo-cena__ajustes">
          <summary>
            <SlidersHorizontal aria-hidden="true" />
            Personalizar cena
          </summary>
          <div className="crivo-cena__ajustes-corpo">
            <fieldset>
              <legend>Papel da mesa</legend>
              {PAPEIS.map(({ valor, nome }) => (
                <button key={valor} type="button" aria-pressed={preferencias.papel === valor} onClick={() => ajustar({ papel: valor })}>{nome}</button>
              ))}
            </fieldset>
          </div>
        </details>
      </figcaption>
    </figure>
  );
}
