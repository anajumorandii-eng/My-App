import {
  Aperture, BookText, ChartSpline, Dna, FilePenLine, FlaskConical, Landmark,
  Map, Newspaper, TextQuote, type LucideIcon,
} from 'lucide-react';

type EvidenceDefinition = {
  icon: LucideIcon;
  label: string;
};

/**
 * Ícone e rótulo de cada matéria nas abas do Hoje.
 *
 * O arquivo guardava também as "fichas" do cartão da decisão: dez imagens de
 * papel envelhecido (5,4 MB), uma por matéria. Eram raster: não acompanhavam o
 * tema claro/escuro nem a cor do ambiente, e não diziam nada da recomendação.
 * O lugar delas agora é do Núcleo do Crivo e do campo de fatores, que já
 * existiam no cartão escondidos por CSS e são desenhados a partir da decisão.
 */
export const SUBJECT_EVIDENCE: Record<string, EvidenceDefinition> = {
  Física: { icon: Aperture, label: 'Bancada óptica' },
  Matemática: { icon: ChartSpline, label: 'Construção matemática' },
  Biologia: { icon: Dna, label: 'Mapa biológico' },
  Química: { icon: FlaskConical, label: 'Caderno de reação' },
  História: { icon: Landmark, label: 'Caderno de evidências' },
  Geografia: { icon: Map, label: 'Leitura de território' },
  Português: { icon: TextQuote, label: 'Arquitetura da frase' },
  Literatura: { icon: BookText, label: 'Arquivo literário' },
  Redação: { icon: FilePenLine, label: 'Mapa argumentativo' },
  Atualidades: { icon: Newspaper, label: 'Linha de contexto' },
};

export function subjectEvidenceFor(subject: string): EvidenceDefinition {
  return SUBJECT_EVIDENCE[subject] ?? SUBJECT_EVIDENCE.Matemática;
}
