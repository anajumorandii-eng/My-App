import { PDFParse } from 'pdf-parse';
import { WorkUnitType } from '../../src/types/literaryWorks';

export interface PageText {
  num: number;
  text: string;
}

export interface UnitCandidate {
  type: WorkUnitType;
  order: number;
  title: string;
  pdfStartPage: number;
  pdfEndPage: number;
  extractionConfidence: 'high' | 'medium' | 'low';
}

/** Etapa C (extração estruturada) — abre o PDF e devolve o texto de cada página. */
export async function extractPagesText(buffer: Buffer): Promise<PageText[]> {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.pages.map((p) => ({ num: p.num, text: p.text }));
  } finally {
    await parser.destroy();
  }
}

const CHAPTER_HEADING = /^cap[ií]tulo\s+([ivxlcdm]+|\d+)\.?\s*$/i;
const PART_HEADING = /^parte\s+([ivxlcdm]+|\d+)\.?\s*$/i;

function firstNonEmptyLine(text: string): string | undefined {
  return text.split('\n').map((l) => l.trim()).find((l) => l.length > 0);
}

/**
 * Detecta capítulos/partes numerados em prosa ("CAPÍTULO I", "Parte 2", ...),
 * cada um seguido de uma linha de subtítulo (ex.: "Óbito do autor"). Não é um
 * parser genérico de estrutura literária — é um heurístico de sinalização
 * (roteiro seção 10/Fase 1: "segmentador por unidade"), sempre com
 * extractionConfidence < 'high' pra deixar claro que precisa de validação
 * humana antes de virar WorkUnit definitivo (Etapa C do roteiro).
 */
export function segmentChapters(pages: PageText[]): UnitCandidate[] {
  const boundaries: { pageNum: number; heading: string; subtitle?: string }[] = [];
  for (const page of pages) {
    // varre a página inteira, não só a primeira linha: capítulos curtos (comuns
    // em Machado de Assis, por ex.) cabem vários por página.
    const lines = page.text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    for (let i = 0; i < lines.length; i++) {
      if (CHAPTER_HEADING.test(lines[i]) || PART_HEADING.test(lines[i])) {
        const next = lines[i + 1];
        const subtitle = next && !CHAPTER_HEADING.test(next) && !PART_HEADING.test(next) ? next : undefined;
        boundaries.push({ pageNum: page.num, heading: lines[i], subtitle });
      }
    }
  }
  if (boundaries.length === 0) return [];

  const lastPage = pages[pages.length - 1]?.num ?? boundaries[boundaries.length - 1].pageNum;
  return boundaries.map((b, i) => {
    const nextPage = boundaries[i + 1]?.pageNum ?? lastPage + 1;
    // dois capítulos podem começar na mesma página (capítulos curtos) — nesse
    // caso o fim fica na própria página, em vez de virar um intervalo inválido.
    const pdfEndPage = nextPage > b.pageNum ? nextPage - 1 : b.pageNum;
    return {
      type: 'chapter' as WorkUnitType,
      order: i + 1,
      title: b.subtitle ? `${b.heading} — ${b.subtitle}` : b.heading,
      pdfStartPage: b.pageNum,
      pdfEndPage,
      // 'medium', não 'high': o título de capítulo é confiável, mas o fim da
      // unidade é inferido pelo início do próximo, não confirmado.
      extractionConfidence: 'medium' as const,
    };
  });
}

/**
 * Detecta poemas/canções — um por página ou por sequência curta de páginas —
 * a partir do padrão observado nas obras poéticas auditadas na Fase 0
 * (ver AUDITORIA_FASE0.md): a página começa com um título curto isolado
 * (poucas palavras, sem pontuação final), seguido do corpo do poema.
 */
export function segmentPoems(pages: PageText[]): UnitCandidate[] {
  const boundaries: { pageNum: number; title: string }[] = [];
  for (const page of pages) {
    const lines = page.text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) continue;
    const title = lines[0];
    const looksLikeTitle = title.length > 0 && title.length <= 60
      && !/[.,;:]$/.test(title)
      && !/^[ivxlcdm]+\s*\./i.test(title); // exclui numeração de seção tipo "IV . dual"
    if (looksLikeTitle) {
      boundaries.push({ pageNum: page.num, title });
    }
  }
  if (boundaries.length === 0) return [];

  const lastPage = pages[pages.length - 1]?.num ?? boundaries[boundaries.length - 1].pageNum;
  return boundaries.map((b, i) => {
    const nextPage = boundaries[i + 1]?.pageNum ?? lastPage + 1;
    return {
      type: 'poem' as WorkUnitType,
      order: i + 1,
      title: b.title,
      pdfStartPage: b.pageNum,
      pdfEndPage: nextPage - 1,
      // heurístico de layout (título isolado no topo da página) — mais frágil
      // que a numeração explícita de capítulo, por isso 'low'.
      extractionConfidence: 'low' as const,
    };
  });
}

/**
 * Ponto de entrada único: tenta capítulos numerados primeiro (sinal mais
 * forte); cai pro heurístico de poema quando o tipo declarado da obra é
 * poesia/canção; sem nenhum boundary encontrado, devolve a obra inteira como
 * uma única unidade de baixa confiança — nunca um corte arbitrário por
 * tamanho (seção 7/Etapa C do roteiro).
 */
export function segmentIntoUnits(pages: PageText[], workGenre: 'chapter' | 'poem' | 'song'): UnitCandidate[] {
  const chapters = segmentChapters(pages);
  if (chapters.length > 0) return chapters;

  if (workGenre === 'poem' || workGenre === 'song') {
    const poems = segmentPoems(pages);
    if (poems.length > 0) return poems;
  }

  const firstPage = pages[0]?.num ?? 1;
  const lastPage = pages[pages.length - 1]?.num ?? firstPage;
  return [{
    type: workGenre === 'chapter' ? 'chapter' : workGenre,
    order: 1,
    title: firstNonEmptyLine(pages[0]?.text ?? '') ?? 'Obra completa',
    pdfStartPage: firstPage,
    pdfEndPage: lastPage,
    extractionConfidence: 'low',
  }];
}
