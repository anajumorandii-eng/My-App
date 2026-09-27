import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Tipos gerados pelo cruzamento de dois eixos independentes. Os controles
 *  dos dois eixos, não os quatro rótulos resultantes, são o conteúdo: mover
 *  em cada eixo isoladamente muda a célula, e o rótulo de cada eixo vem da
 *  entrada, nunca chumbado no componente. */
/** Até duas linhas de ~15 letras: é o que cabe na célula de 170 com a letra
 *  manuscrita de 18 px. Quebra primeiro no "+" do cruzamento, depois no espaço. */
function quebrar(rotulo: string): string[] {
  if (rotulo.length <= 15) return [rotulo];
  const mais = rotulo.indexOf(' + ');
  if (mais > 0) return [rotulo.slice(0, mais + 2), rotulo.slice(mais + 3)];
  const meio = rotulo.lastIndexOf(' ', Math.ceil(rotulo.length / 2) + 3);
  return meio > 0 ? [rotulo.slice(0, meio), rotulo.slice(meio + 1)] : [rotulo];
}

export function GradeDeEixos({ entry }: { entry: SceneEntry }) {
  const [eixoA, setEixoA] = useState<0 | 1>(0);
  const [eixoB, setEixoB] = useState<0 | 1>(0);
  const transition = useSceneMotion();
  const eixos = entry.eixos;
  const celulaAtual = entry.items.find((it) => it.celula && it.celula.eixoA === eixoA && it.celula.eixoB === eixoB) ?? null;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · cruzamento de eixos</small>
        <h4>{entry.question}</h4>
      </header>
      {/* Quadro de 480, como as outras famílias: com 220 o .tc-label de 18 px
          ficava 2,2 vezes maior que o previsto, e "Ácido fraco + base forte"
          saía da célula e da tela (Equilíbrios Iônicos II). Os polos dos dois
          eixos vão escritos nas bordas, então a célula não precisa repetir o
          cruzamento inteiro para ser lida. */}
      <svg viewBox="0 0 480 400" role="img" aria-label={celulaAtual ? `Célula selecionada: ${celulaAtual.label}` : 'Nenhuma célula selecionada'}>
        {eixos && (
          <g className="tc-grade-eixos">
            <text x={290} y={392} textAnchor="middle" className="tc-grade-nome">{eixos.a.nome}</text>
            {eixos.a.polos.map((polo, a) => (
              <text key={polo} x={a === 0 ? 200 : 380} y={368} textAnchor="middle" className="tc-grade-polo">{polo}</text>
            ))}
            <text x={24} y={184} textAnchor="middle" transform="rotate(-90 24 184)" className="tc-grade-nome">{eixos.b.nome}</text>
            {/* Em pé, como o nome do eixo: "intergeracional" deitado não cabe
                na margem de 115 à esquerda da grade. */}
            {eixos.b.polos.map((polo, b) => {
              const cy = b === 0 ? 263 : 95;
              return <text key={polo} x={96} y={cy} textAnchor="middle" transform={`rotate(-90 96 ${cy})`} className="tc-grade-polo">{polo}</text>;
            })}
          </g>
        )}
        {[0, 1].map((a) =>
          [0, 1].map((b) => {
            const ativo = a === eixoA && b === eixoB;
            const x = a === 0 ? 115 : 295;
            const y = b === 0 ? 184 : 16;
            const it = entry.items.find((i2) => i2.celula && i2.celula.eixoA === a && i2.celula.eixoB === b);
            const linhas = it ? quebrar(it.label) : [];
            return (
              <motion.g
                key={`${a}-${b}`}
                animate={{ opacity: ativo ? 1 : 0.45 }}
                transition={transition}
                onClick={() => { setEixoA(a as 0 | 1); setEixoB(b as 0 | 1); }}
                style={{ cursor: 'pointer' }}
              >
                <rect x={x} y={y} width="170" height="158" rx="4" className={ativo ? 'tc-celula tc-celula-ativa' : 'tc-celula'} />
                {linhas.map((linha, i) => (
                  <text key={i} x={x + 85} y={y + 84 + (i - (linhas.length - 1) / 2) * 22} textAnchor="middle" className="tc-label">{linha}</text>
                ))}
              </motion.g>
            );
          }),
        )}
      </svg>
      {eixos && (
        <div className="tc-eixos">
          <fieldset className="tc-eixo">
            <legend>{eixos.a.nome}</legend>
            <div className="tc-choices">
              {eixos.a.polos.map((polo, i) => (
                <button key={polo} type="button" aria-pressed={eixoA === i} onClick={() => setEixoA(i as 0 | 1)}>
                  {polo}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="tc-eixo">
            <legend>{eixos.b.nome}</legend>
            <div className="tc-choices">
              {eixos.b.polos.map((polo, i) => (
                <button key={polo} type="button" aria-pressed={eixoB === i} onClick={() => setEixoB(i as 0 | 1)}>
                  {polo}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
      {celulaAtual && (
        <>
          <p className="tc-observation" role="status"><strong>{celulaAtual.label}:</strong> {celulaAtual.claim}</p>
          <blockquote className="tc-quote">“{celulaAtual.quote}” <cite>{celulaAtual.section}</cite></blockquote>
        </>
      )}
    </section>
  );
}
