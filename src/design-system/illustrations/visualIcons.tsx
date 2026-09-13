import React from 'react';
import type { PedagogicalStage } from '../../types/summary';

/*
 * Ícones do CRIVO Visual.
 *
 * A referência que a Ana Júlia mandou é pôster ilustrado (sketchnote gerado por
 * IA de imagem): cada mapa tem cena desenhada especificamente para aquele
 * conteúdo — um átomo de verdade, um circuito, planetas. Não há gerador de
 * imagem neste ambiente, e desenhar à mão uma cena única para cada um dos 612
 * capítulos não escala nem manualmente nem por código. A saída possível é
 * outra: um glifo por DISCIPLINA (14, não 612), reconhecível e específico do
 * conteúdo daquela área, redesenhado à mão em SVG — e um ícone por ESTÁGIO
 * pedagógico (5, fixos), para o pequeno selo de cada nó. Isso é ilustração de
 * verdade, só que na granularidade que dá para manter.
 */

// Os glifos são desenhados dentro de uma caixa 0..44 e devolvidos como <g>, não
// como <svg> próprio — assim o chamador os embute na prancha com um único
// transform (posição + escala), em vez de aninhar viewports.
function Icon({ children }: { children: React.ReactNode }) {
  return <g fill="none">{children}</g>;
}

const SUBJECT_ICONS: Record<string, () => React.ReactElement> = {
  Física: () => (
    <Icon>
      <path d="M6 30 Q 12 12, 18 30 T 30 30 T 42 14" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
      <circle cx="18" cy="30" r="2.4" fill="currentColor" />
      <circle cx="30" cy="30" r="2.4" fill="currentColor" />
    </Icon>
  ),
  Química: () => (
    <Icon>
      <path d="M17 6 V16 L8 34 Q7 37 10 37 H34 Q37 37 36 34 L27 16 V6" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <path d="M14 6 H30" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
      <circle cx="19" cy="30" r="1.6" fill="currentColor" />
      <circle cx="25" cy="26" r="1.3" fill="currentColor" />
      <circle cx="22" cy="33" r="1.1" fill="currentColor" />
    </Icon>
  ),
  // Dupla hélice: duas senoides defasadas meio ciclo (por isso os "M"s opostos
  // em y) mais os travessões nos pontos em que elas se cruzam. A primeira
  // versão usava curvas Q com âncoras fora de fase e virava um X — a senoide
  // via sucessão de arcos C fica com o cruzamento no lugar certo.
  Biologia: () => (
    <Icon>
      <path d="M12 4 C20 4, 6 12, 14 16 C22 20, 8 28, 16 32 C20 34, 24 36, 26 40" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
      <path d="M26 4 C18 4, 32 12, 24 16 C16 20, 30 28, 22 32 C18 34, 14 36, 12 40" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
      <path d="M13.2 9 H24.8 M11 16 H27 M13.2 23 H24.8 M11 32 H27" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  // Sigma explícito (contorno de "Σ", não um zigue-zague genérico) mais eixos e
  // curva — soma discreta e função contínua, as duas caras da matéria.
  Matemática: () => (
    <Icon>
      <path d="M27 7 H15 L21.5 15 L15 23 H27" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M7 37 V22 M7 37 H26" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" opacity="0.55" />
      <path d="M9 33 Q16 20, 22 27 T35 15" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  Geografia: () => (
    <Icon>
      <circle cx="22" cy="22" r="15" strokeWidth="2" stroke="currentColor" />
      <path d="M22 7 Q30 22, 22 37 Q14 22, 22 7" strokeWidth="1.6" stroke="currentColor" />
      <path d="M7 22 H37 M22 22 L30 12" strokeWidth="1.4" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  História: () => (
    <Icon>
      <path d="M9 14 H35 M11 14 V33 M33 14 V33 M8 34 H36" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
      <path d="M13 33 V19 M19 33 V19 M25 33 V19 M31 33 V19" strokeWidth="1.6" stroke="currentColor" />
      <path d="M7 14 L22 6 L37 14" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
    </Icon>
  ),
  Filosofia: () => (
    <Icon>
      <path d="M16 10 Q14 4, 22 4 Q30 4, 27 11 Q31 13, 29 19 L27 32 Q27 37, 22 37 Q17 37, 17 32 L15 19 Q13 13, 16 10 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <path d="M17 32 H27" strokeWidth="1.6" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  Sociologia: () => (
    <Icon>
      <circle cx="14" cy="16" r="4.2" strokeWidth="2" stroke="currentColor" />
      <circle cx="30" cy="16" r="4.2" strokeWidth="2" stroke="currentColor" />
      <circle cx="22" cy="31" r="4.2" strokeWidth="2" stroke="currentColor" />
      <path d="M17 19 L19 27 M27 19 L25 27 M17.5 15 H26.5" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  Literatura: () => (
    <Icon>
      <path d="M22 10 Q14 6, 7 9 V32 Q14 29, 22 33 Q30 29, 37 32 V9 Q30 6, 22 10 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <path d="M22 10 V33" strokeWidth="1.6" stroke="currentColor" />
    </Icon>
  ),
  Gramática: () => (
    <Icon>
      <text x="22" y="27" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="20" fill="currentColor">Aa</text>
      <path d="M9 34 Q22 30, 35 34" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  'Entendimento de Texto': () => (
    <Icon>
      <path d="M9 10 H29 M9 16 H29 M9 22 H23" strokeWidth="1.8" stroke="currentColor" strokeLinecap="round" opacity="0.85" />
      <circle cx="27" cy="28" r="7" strokeWidth="2" stroke="currentColor" />
      <path d="M32 33 L38 39" strokeWidth="2.2" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
  'Língua Inglesa': () => (
    <Icon>
      <path d="M8 10 H36 Q38 10, 38 12 V26 Q38 28, 36 28 H18 L10 35 V28 H8 Q6 28, 6 26 V12 Q6 10, 8 10 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <circle cx="15" cy="19" r="1.6" fill="currentColor" />
      <circle cx="22" cy="19" r="1.6" fill="currentColor" />
      <circle cx="29" cy="19" r="1.6" fill="currentColor" />
    </Icon>
  ),
  Redação: () => (
    <Icon>
      <path d="M31 6 L38 13 L16 35 L7 37 L9 28 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <path d="M26 11 L33 18" strokeWidth="1.8" stroke="currentColor" />
      <path d="M8 40 Q18 36, 28 40 T44 38" strokeWidth="1.6" stroke="currentColor" strokeLinecap="round" opacity="0.6" />
    </Icon>
  ),
  Atualidades: () => (
    <Icon>
      <path d="M8 12 H30 V32 Q30 35, 27 35 H11 Q8 35, 8 32 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
      <path d="M30 15 H33 Q36 15, 36 18 V32 Q36 35, 33 35 H27" strokeWidth="1.8" stroke="currentColor" strokeLinejoin="round" />
      <path d="M12 17 H26 M12 21 H26 M12 25 H21" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    </Icon>
  ),
};

const FALLBACK_ICON = () => (
  <Icon>
    <path d="M22 10 Q14 6, 7 9 V32 Q14 29, 22 33 Q30 29, 37 32 V9 Q30 6, 22 10 Z" strokeWidth="2" stroke="currentColor" strokeLinejoin="round" />
  </Icon>
);

/** Retângulo lógico 0..44 em que o glifo da disciplina é desenhado. */
export const SUBJECT_GLYPH_BOX = 44;

export function SubjectGlyph({ subject }: { subject: string }) {
  const render = SUBJECT_ICONS[subject] ?? FALLBACK_ICON;
  return render();
}

export const HAS_SUBJECT_GLYPH = (subject: string) => subject in SUBJECT_ICONS;

/* Ícones de estágio: fixos, reaproveitados em qualquer disciplina — o selo de
   cada nó marca ONDE na sequência pedagógica ele está, não do que ele trata. */
/** Retângulo lógico 0..20 em que o glifo de estágio é desenhado. */
export const STAGE_GLYPH_BOX = 20;

function StageIcon({ children }: { children: React.ReactNode }) {
  return <g fill="none">{children}</g>;
}

const STAGE_ICONS: Record<PedagogicalStage, () => React.ReactElement> = {
  intuicao: () => (
    <StageIcon>
      <path d="M10 2.5 C6 2.5 4 5.5 4 8.5 C4 11 5.5 12 6.5 13.5 V16 H13.5 V13.5 C14.5 12 16 11 16 8.5 C16 5.5 14 2.5 10 2.5 Z" strokeWidth="1.5" stroke="currentColor" />
      <path d="M7.5 18 H12.5" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    </StageIcon>
  ),
  conceito: () => (
    <StageIcon>
      <path d="M10 3 Q5.5 1.5 3 3.5 V15.5 Q5.5 13.5 10 15 Q14.5 13.5 17 15.5 V3.5 Q14.5 1.5 10 3 Z" strokeWidth="1.5" stroke="currentColor" strokeLinejoin="round" />
      <path d="M10 3 V15" strokeWidth="1.3" stroke="currentColor" />
    </StageIcon>
  ),
  aplicacao: () => (
    <StageIcon>
      <circle cx="10" cy="10" r="7" strokeWidth="1.5" stroke="currentColor" />
      <circle cx="10" cy="10" r="3.6" strokeWidth="1.4" stroke="currentColor" />
      <circle cx="10" cy="10" r="0.9" fill="currentColor" />
    </StageIcon>
  ),
  estrategia: () => (
    <StageIcon>
      <path d="M10 2 L12.3 7.2 L18 8 L13.8 11.8 L15 17.5 L10 14.6 L5 17.5 L6.2 11.8 L2 8 L7.7 7.2 Z" strokeWidth="1.4" stroke="currentColor" strokeLinejoin="round" />
    </StageIcon>
  ),
  exercicio: () => (
    <StageIcon>
      <path d="M4 15.5 L4.8 12 L13.5 3.3 Q14.5 2.3 15.5 3.3 L16.7 4.5 Q17.7 5.5 16.7 6.5 L8 15.2 Z" strokeWidth="1.5" stroke="currentColor" strokeLinejoin="round" />
      <path d="M12 5 L15 8" strokeWidth="1.3" stroke="currentColor" />
      <path d="M4 15.5 L7.8 15.2" strokeWidth="1.3" stroke="currentColor" strokeLinecap="round" />
    </StageIcon>
  ),
};

export function StageGlyph({ stage }: { stage: PedagogicalStage }) {
  return STAGE_ICONS[stage]();
}
