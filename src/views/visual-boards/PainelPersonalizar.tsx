import React, { useEffect, useId, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { PALETAS_FIXAS, type Ambiente, type ModoCor } from '../../lib/visualAmbiente';
import type { Efeitos, Fundo, PreferenciasVisual } from '../../hooks/usePreferenciasVisual';

const EFEITOS: { valor: Efeitos; rotulo: string; detalhe: string }[] = [
  { valor: 'completo', rotulo: 'Completo', detalhe: 'Partículas, luz que segue o dedo, cartões que inclinam.' },
  { valor: 'suave', rotulo: 'Suave', detalhe: 'Sem partículas nem inclinação. Poupa bateria.' },
  { valor: 'minimo', rotulo: 'Mínimo', detalhe: 'Nada se move. Só cor e vidro.' },
];

const FUNDOS: { valor: Fundo; rotulo: string }[] = [
  { valor: 'caderno', rotulo: 'Caderno' },
  { valor: 'papel', rotulo: 'Papel' },
  { valor: 'aurora', rotulo: 'Aurora' },
  { valor: 'grade', rotulo: 'Grade' },
  { valor: 'liso', rotulo: 'Liso' },
];

/**
 * Painel "Personalizar": cor, efeitos e fundo, aplicados na hora. Mostra de
 * onde vem a cor automática ("matéria + conteúdo: espaço"), para a escolha não
 * parecer mágica — é a mesma regra de `lib/visualAmbiente.ts`.
 *
 * Abre sob o botão, fecha com Esc, com clique fora e ao escolher de novo o
 * botão. O foco volta ao botão ao fechar.
 */
export function PainelPersonalizar({ preferencias, onMudar, ambienteAutomatico }: {
  preferencias: PreferenciasVisual;
  onMudar: (mudanca: Partial<PreferenciasVisual>) => void;
  /** O que a cor automática escolheria aqui, para a legenda. */
  ambienteAutomatico: Ambiente | null;
}) {
  const [aberto, setAberto] = useState(false);
  const idPainel = useId();
  const botao = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (evento: KeyboardEvent) => { if (evento.key === 'Escape') { setAberto(false); botao.current?.focus(); } };
    const fora = (evento: PointerEvent) => {
      const alvo = evento.target as Node;
      if (!painel.current?.contains(alvo) && !botao.current?.contains(alvo)) setAberto(false);
    };
    document.addEventListener('keydown', tecla);
    document.addEventListener('pointerdown', fora);
    return () => { document.removeEventListener('keydown', tecla); document.removeEventListener('pointerdown', fora); };
  }, [aberto]);

  const legendaAutomatica = ambienteAutomatico
    ? ambienteAutomatico.origem === 'conteudo' ? `matéria + conteúdo: ${ambienteAutomatico.nome}` : `pela matéria: ${ambienteAutomatico.nome}`
    : 'pela matéria de cada capítulo';
  const cores: { valor: ModoCor; rotulo: string; detalhe?: string; amostra?: string[] }[] = [
    { valor: 'automatica', rotulo: 'Automática', detalhe: legendaAutomatica, amostra: ambienteAutomatico ? [ambienteAutomatico.paleta.a, ambienteAutomatico.paleta.b] : undefined },
    { valor: 'materia', rotulo: 'Só a matéria', detalhe: 'sem ajuste pelo conteúdo' },
    ...Object.entries(PALETAS_FIXAS).map(([nome, paleta]) => ({ valor: nome as ModoCor, rotulo: nome, amostra: [paleta.a, paleta.b, paleta.c] })),
  ];

  return (
    <div className="vs-personalizar">
      <button
        ref={botao}
        type="button"
        className="vs-acao-topo"
        // O texto some no celular (só o ícone cabe); sem este rótulo o botão
        // ficava sem nome para leitor de tela.
        aria-label="Personalizar"
        aria-expanded={aberto}
        aria-controls={idPainel}
        onClick={() => setAberto((valor) => !valor)}
      >
        <SlidersHorizontal aria-hidden="true" />
        <span>Personalizar</span>
      </button>
      {aberto && (
        <div ref={painel} id={idPainel} className="vs-personalizar-painel" role="dialog" aria-label="Personalizar o Visual">
          <div className="vs-personalizar-cabeca">
            <strong>Personalizar</strong>
            <button type="button" className="vs-personalizar-fechar" aria-label="Fechar" onClick={() => { setAberto(false); botao.current?.focus(); }}><X aria-hidden="true" /></button>
          </div>

          <fieldset>
            <legend>Cor</legend>
            <div className="vs-personalizar-cores">
              {cores.map((item) => (
                <button
                  key={item.valor}
                  type="button"
                  aria-pressed={preferencias.cor === item.valor}
                  onClick={() => onMudar({ cor: item.valor })}
                >
                  <span className="vs-personalizar-amostra" aria-hidden="true" style={item.amostra ? { background: `linear-gradient(135deg, ${item.amostra.join(', ')})` } : undefined} />
                  <span>
                    <b>{item.rotulo}</b>
                    {item.detalhe && <small>{item.detalhe}</small>}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Efeitos</legend>
            <div className="vs-personalizar-opcoes">
              {EFEITOS.map((item) => (
                <button key={item.valor} type="button" aria-pressed={preferencias.efeitos === item.valor} onClick={() => onMudar({ efeitos: item.valor })}>
                  <b>{item.rotulo}</b>
                  <small>{item.detalhe}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Fundo</legend>
            <p className="vs-personalizar-fundo-ajuda">Caderno: mapa de ideias com ícones e anotações da matéria. Papel: a mesma textura, sem desenhos.</p>
            <div className="vs-personalizar-segmento">
              {FUNDOS.map((item) => (
                <button key={item.valor} type="button" aria-pressed={preferencias.fundo === item.valor} onClick={() => onMudar({ fundo: item.valor })}>
                  <span className={`vs-personalizar-fundo vs-personalizar-fundo--${item.valor}`} aria-hidden="true" />
                  {item.rotulo}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}

export default PainelPersonalizar;
