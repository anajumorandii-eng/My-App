export interface PrintCoverContext {
  subject?: string;
  topic?: string;
  subtopic?: string;
  work?: string;
  board?: string;
  purpose?: string;
}
export type CoverTheme = 'blood' | 'biology' | 'chemistry' | 'physics' | 'mathematics' | 'geography' | 'history' | 'literature';
export type VignettePosition = 'top_left' | 'bottom_left' | 'top_right' | 'bottom_right';
export interface PrintCoverSpec {
  brand_header: string;
  collection_subtitle: string;
  subject_title: string;
  topic_subtitle: string;
  exam_board: string;
  triad_keywords: [string, string, string];
  footer_tagline: string;
  footer_signature: string;
  visual_spec: { central_hero: string; vignettes: Partial<Record<VignettePosition, { label: string; illustration: string }>> };
}
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function selectCoverTheme(context: PrintCoverContext): CoverTheme {
  if (context.work) return 'literature';
  const name = normalize(context.subject || '');
  if (/biologia|ciencias da natureza/.test(name)) {
    return /sangue|imunolog|hematolog|cardiovascular|circulator|cardiac/.test(normalize(`${context.topic || ''} ${context.subtopic || ''}`)) ? 'blood' : 'biology';
  }
  if (/quimica/.test(name)) return 'chemistry';
  if (/fisica/.test(name)) return 'physics';
  if (/matematica|raciocinio logico/.test(name)) return 'mathematics';
  if (/geografia/.test(name)) return 'geography';
  if (/historia|filosofia|sociologia|humanas/.test(name)) return 'history';
  return 'literature';
}
const themes: Record<CoverTheme, { triad: [string, string, string]; hero: string }> = {
  blood: { triad: ['Circulação', 'Defesa', 'Memória'], hero: 'Anatomical heart, branching vessels and an artery carrying red blood cells; fine scientific etching and restrained watercolor.' },
  biology: { triad: ['Vida', 'Estrutura', 'Função'], hero: 'Natural-history atlas of organisms, leaf specimens, a cell, DNA and microscopy.' },
  chemistry: { triad: ['Estrutura', 'Propriedades', 'Transformações'], hero: 'Scientific plate of glass laboratory apparatus, molecular models and a distillation system.' },
  physics: { triad: ['Fenômenos', 'Modelos', 'Relações'], hero: 'Scientific plate of pendulum, prism, lenses, a spring-mass apparatus and wave geometry.' },
  mathematics: { triad: ['Modelar', 'Relacionar', 'Resolver'], hero: 'Applied mathematics atlas of geometry, graphs, a bridge and draughting instruments.' },
  geography: { triad: ['Espaço', 'Sociedade', 'Natureza'], hero: 'Geographical atlas of globe, mountains, river, topography and compass.' },
  history: { triad: ['Contexto', 'Processos', 'Permanências'], hero: 'Historical study plate of architecture, sculpture, books, maps and archival instruments.' },
  literature: { triad: ['Forma', 'Contexto', 'Interpretação'], hero: 'Literary study plate of open book, quill, ink, manuscript and a theater mask.' },
};
/** Bibliographic metadata is authoritative: no LLM can rewrite the title or invent a board. */
export function buildPrintCoverSpec(context: PrintCoverContext, fallbackTitle: string): PrintCoverSpec {
  const theme = selectCoverTheme(context);
  const review=/^revis[aã]o\b/i.test(context.purpose || '');
  return {
    brand_header: 'CRIVO', collection_subtitle: review ? 'CADERNOS DE REVISÃO' : 'CADERNOS DE APROFUNDAMENTO',
    subject_title: context.subject || (context.work ? 'Literatura' : 'Material de estudo'),
    topic_subtitle: context.work || context.topic || fallbackTitle,
    exam_board: context.board || '', triad_keywords: review ? ['Recordar','Conectar','Aplicar'] : [...themes[theme].triad],
    footer_tagline: context.purpose || 'Aprofundamento e raciocínio de prova',
    footer_signature: 'CRIVO • MATERIAL DE ESTUDO',
    visual_spec: { central_hero: `${review
      ? 'Revision cover: compose one unified central illustration with a compact, rounded organic silhouette and a clear dominant subject motif. Interweave the supporting details into that same illustration, suggesting synthesis and connections; do not distribute separate studies across the page.'
      : 'Deepening cover: compose one unified central illustration with a tall, richly detailed organic silhouette. Interweave a dominant subject motif, related instruments and structures into one continuous scene, suggesting mechanisms and depth.'
    } Subject vocabulary, to be selected for the actual topic rather than repeated wholesale: ${themes[theme].hero}`, vignettes: theme === 'blood' ? {
      top_left: { label: 'Hemácias', illustration: 'Biconcave red blood cells and cross-section in crimson watercolor etching.' },
      bottom_left: { label: 'Defesa', illustration: 'Vintage brass microscope and purple-nucleated leukocytes.' },
      top_right: { label: 'Anticorpos', illustration: 'Y-shaped immunoglobulin antibody structures.' },
      bottom_right: { label: 'Circulação', illustration: 'Longitudinal and cross-section of a capillary carrying erythrocytes.' },
    } : {} },
  };
}
