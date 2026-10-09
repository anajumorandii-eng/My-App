import React, { useId } from 'react';
import { StudyObjectIcon } from '../views/visual-boards/StudyObjectIcon';
import { cadernoDa, type Esboco } from '../lib/rabiscosDaMateria';

/** Fundo decorativo de papel com um mapa de ideias da matéria.
 * As ramificações agrupam anotações verdadeiras, sem indicar relações causais.
 * O padrão SVG é fixo, não captura cliques e não adiciona alvos ao teclado.
 * O mapa aparece uma vez; efeitos suaves e movimento reduzido ficam estáticos.
 */

const LARGURA = 1000;
const ALTURA = 720;
const RAMOS = [
  { x: 38, y: 80, caminho: 'M500 350 C340 350 380 126 344 126', cor: 'vinho' },
  { x: 656, y: 112, caminho: 'M500 350 C630 350 600 158 656 158', cor: 'azul' },
  { x: 58, y: 510, caminho: 'M500 350 C350 350 400 556 364 556', cor: 'verde' },
  { x: 636, y: 542, caminho: 'M500 350 C630 350 600 588 636 588', cor: 'ouro' },
];

/** Cada esboço num quadro de 140 × 100, só traço. */
function DesenhoDoEsboco({ tipo }: { tipo: Esboco }) {
  switch (tipo) {
    case 'lente':
      return (
        <>
          <path d="M4 50 H136" />
          <ellipse cx="60" cy="50" rx="7" ry="34" />
          <path d="M8 26 H60 L112 50 M8 50 H112 M8 74 H60 L112 50" />
          <circle cx="112" cy="50" r="2.5" className="crivo-caderno__cheio" />
          <text x="106" y="70">F′</text>
        </>
      );
    case 'onda':
      return (
        <>
          <path d="M4 50 C18 14 32 14 46 50 S74 86 88 50 S116 14 130 50" />
          <path d="M4 50 H136" strokeDasharray="3 4" />
          {/* λ de crista a crista: a primeira em x = 25, a seguinte um período (84) depois. */}
          <path d="M25 18 H109 M25 14 V22 M109 14 V22" />
          <text x="62" y="12">λ</text>
        </>
      );
    case 'parabola':
      return (
        <>
          <path d="M10 80 H130 M70 96 V6" />
          <path d="M22 12 Q70 128 118 12" />
          <circle cx="70" cy="70" r="2.5" className="crivo-caderno__cheio" />
          <text x="76" y="92">V</text>
        </>
      );
    case 'triangulo':
      return (
        <>
          <path d="M20 88 H120 V16 Z" />
          <path d="M108 88 V76 H120" />
          <text x="64" y="100">a</text>
          <text x="126" y="56">b</text>
          <text x="58" y="46">c</text>
        </>
      );
    case 'helice':
      return (
        <>
          <path d="M6 20 C30 20 30 80 54 80 S78 20 102 20 S126 80 134 80" />
          <path d="M6 80 C30 80 30 20 54 20 S78 80 102 80 S126 20 134 20" />
          <path d="M18 26 V74 M42 26 V74 M66 26 V74 M90 26 V74 M114 26 V74" strokeDasharray="2 3" />
        </>
      );
    case 'celula':
      return (
        <>
          <path d="M20 50 C20 14 120 10 124 48 C128 88 22 92 20 50 Z" />
          <circle cx="66" cy="50" r="15" />
          <circle cx="66" cy="50" r="4" className="crivo-caderno__cheio" />
          <ellipse cx="102" cy="40" rx="9" ry="5" />
          <ellipse cx="40" cy="64" rx="8" ry="4.5" />
        </>
      );
    case 'hexagono':
      return (
        <>
          <path d="M70 8 L110 30 V72 L70 94 L30 72 V30 Z" />
          <circle cx="70" cy="51" r="22" />
        </>
      );
    case 'frasco':
      return (
        <>
          <path d="M58 6 H82 M62 6 V38 L28 92 H112 L78 38 V6" />
          <path d="M42 70 H98" strokeDasharray="4 3" />
        </>
      );
    case 'linha-do-tempo':
      return (
        <>
          <path d="M4 50 H130 L124 45 M130 50 L124 55" />
          <path d="M22 42 V58 M56 42 V58 M90 42 V58" />
          <circle cx="56" cy="50" r="4" className="crivo-caderno__cheio" />
        </>
      );
    case 'coluna':
      return (
        <>
          <path d="M40 8 H100 L96 16 H44 Z M44 92 H96 M40 98 H100" />
          <path d="M50 16 V92 M60 16 V92 M70 16 V92 M80 16 V92 M90 16 V92" />
        </>
      );
    case 'rosa-dos-ventos':
      return (
        <>
          <circle cx="70" cy="52" r="34" />
          <path d="M70 8 L78 52 L70 96 L62 52 Z M26 52 L70 44 L114 52 L70 60 Z" />
          <text x="65" y="6">N</text>
        </>
      );
    case 'curvas-de-nivel':
      return (
        <>
          <path d="M12 60 C10 20 120 8 128 48 C134 90 16 98 12 60 Z" />
          <path d="M34 58 C32 32 104 26 108 52 C112 78 38 82 34 58 Z" />
          <path d="M56 56 C56 42 86 40 88 54 C90 68 58 70 56 56 Z" />
        </>
      );
    case 'aspas':
      return <text x="30" y="80" className="crivo-caderno__grande">“ ”</text>;
    case 'livro':
      return (
        <>
          <path d="M70 24 C52 12 26 12 10 20 V86 C26 78 52 78 70 90 C88 78 114 78 130 86 V20 C114 12 88 12 70 24 Z M70 24 V90" />
          <path d="M24 36 H56 M24 48 H56 M84 36 H116 M84 48 H116" strokeDasharray="3 3" />
        </>
      );
    case 'pena':
      return (
        <>
          <path d="M20 92 C50 70 96 40 124 8 C104 38 82 56 60 70" />
          <path d="M20 92 L60 70 M40 80 L46 70 M52 72 L60 60" />
        </>
      );
    case 'globo':
      return (
        <>
          <circle cx="70" cy="50" r="40" />
          <ellipse cx="70" cy="50" rx="16" ry="40" />
          <path d="M30 50 H110 M36 30 H104 M36 70 H104" />
        </>
      );
  }
}

export function FundoCaderno({ materia }: { materia?: string }) {
  const id = `caderno-${useId().replace(/:/g, '')}`;
  const caderno = cadernoDa(materia);
  return (
    <div className="crivo-caderno crivo-caderno--mapa" aria-hidden="true" data-materia={materia || 'Crivo'}>
      <svg width="100%" height="100%">
        <defs>
          <linearGradient id={`${id}-papel`} x2="0" y2="1">
            <stop stopColor="var(--mapa-cartao-luz)" /><stop offset="1" stopColor="var(--mapa-cartao)" />
          </linearGradient>
          <pattern id={id} width={LARGURA} height={ALTURA} patternUnits="userSpaceOnUse">
            <g className="crivo-caderno__mapa">
              {RAMOS.map((ramo, i) => (
                <g key={ramo.cor} className={`crivo-caderno__ramo crivo-caderno__ramo--${ramo.cor}`}>
                  <path className="crivo-caderno__conexao" d={ramo.caminho} pathLength="1" />
                  <g transform={`translate(${ramo.x} ${ramo.y})`}>
                    <rect className="crivo-caderno__sombra" x="3" y="6" width="306" height="92" rx="18" />
                    <rect className="crivo-caderno__cartao" width="306" height="92" rx="18" fill={`url(#${id}-papel)`} />
                    <circle cx="22" cy="24" r="4" fill="currentColor" />
                    <text className="crivo-caderno__numero" x="37" y="28">0{i + 1}</text>
                    <text className="crivo-caderno__ideia" x="20" y="61">{caderno.anotacoes[i]}</text>
                  </g>
                </g>
              ))}
              <circle className="crivo-caderno__sombra" cx="503" cy="356" r="61" />
              <circle className="crivo-caderno__raiz" cx="500" cy="350" r="61" fill={`url(#${id}-papel)`} />
              <svg x="461" y="303" width="78" height="78"><StudyObjectIcon subject={materia || 'Crivo'} /></svg>
              <text className="crivo-caderno__materia" x="500" y="388" textAnchor="middle">{materia || 'Crivo'}</text>
            </g>
            {caderno.esbocos.map((esboco, i) => (
              <g key={esboco} transform={`translate(${i === 0 ? 85 : 780} 290) scale(1.05)`} className="crivo-caderno__esboco">
                <DesenhoDoEsboco tipo={esboco} />
              </g>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
