import type { InteractiveSummary } from '../types/summary';
import { visualCandidates } from './visualRepresentation';
import type { VisualCandidate, VisualRepresentation } from './visualRepresentation';

/**
 * Uma linha por capítulo. `primary` e `artifact` são o que a tela mostra;
 * `ignored` são os outros artefatos que também casam e perdem a disputa.
 * Registrá-los não muda a seleção exclusiva: só deixa visível que existe
 * sobreposição a resolver.
 */
export interface CoverageRow {
  id: string;
  subject: string;
  title: string;
  primary: VisualRepresentation;
  /** Id do artefato primário; nulo exatamente quando o capítulo é uma lacuna. */
  artifact: string | null;
  ignored: VisualCandidate[];
}

export type RepresentationCounts = Record<VisualRepresentation, number>;

export interface SubjectCoverage {
  subject: string;
  chapters: number;
  counts: RepresentationCounts;
}

export interface VisualCoverage {
  total: number;
  counts: RepresentationCounts;
  /** Capítulos com mais de um artefato candidato. */
  contested: number;
  subjects: SubjectCoverage[];
  rows: CoverageRow[];
}

function emptyCounts(): RepresentationCounts {
  return { experiment: 0, board: 0, instrument: 0, scene: 0, fallback: 0 };
}

/**
 * Matriz de cobertura derivada de `visualCandidates`, a mesma função que a
 * tela usa para escolher o que mostrar. O relatório antigo tinha um campo
 * `anchorScene` que misturava cena, prancha e instrumento; aqui cada
 * artefato tem o seu tipo, e nenhuma contagem trata tipos diferentes como
 * equivalentes.
 */
export function buildVisualCoverage(summaries: InteractiveSummary[]): VisualCoverage {
  const counts = emptyCounts();
  const subjects = new Map<string, SubjectCoverage>();

  const rows = summaries.map((summary): CoverageRow => {
    const [winner, ...ignored] = visualCandidates(summary);
    const primary: VisualRepresentation = winner?.kind ?? 'fallback';

    counts[primary] += 1;
    let subject = subjects.get(summary.subject);
    if (!subject) {
      subject = { subject: summary.subject, chapters: 0, counts: emptyCounts() };
      subjects.set(summary.subject, subject);
    }
    subject.chapters += 1;
    subject.counts[primary] += 1;

    return { id: summary.id, subject: summary.subject, title: summary.title, primary, artifact: winner?.id ?? null, ignored };
  });

  return {
    total: rows.length,
    counts,
    contested: rows.filter((row) => row.ignored.length > 0).length,
    subjects: [...subjects.values()],
    rows,
  };
}

const LABELS: Record<VisualRepresentation, string> = {
  experiment: 'Experimento exato',
  board: 'Prancha autoral',
  instrument: 'Instrumento',
  scene: 'Cena validada',
  fallback: 'Lacuna honesta',
};
const ORDER: VisualRepresentation[] = ['experiment', 'board', 'instrument', 'scene', 'fallback'];

function percent(part: number, total: number): string {
  return `${((part / total) * 100).toFixed(1).replace('.', ',')}%`;
}

function describe(candidate: VisualCandidate): string {
  return `${LABELS[candidate.kind]} (${candidate.id})`;
}

/** Barra vertical dentro de uma célula quebraria a tabela. */
function cell(text: string): string {
  return text.replace(/\|/g, '\\|');
}

/** Resumo legível da matriz; o detalhe capítulo a capítulo fica no JSON. */
export function renderCoverageMarkdown(coverage: VisualCoverage): string {
  const lines: string[] = [
    '# Matriz de cobertura visual',
    '',
    'Gerada por `npm run visual:matrix` a partir do resolvedor da tela',
    '(`src/views/visualRepresentation.ts`). Não edite à mão: o teste',
    '`src/views/visualCoverage.test.ts` falha se este arquivo divergir do código.',
    '',
    'Cada capítulo tem uma única representação primária, na ordem experimento,',
    'prancha, instrumento, cena e lacuna. Lacuna honesta é o capítulo que ainda',
    'não tem artefato próprio e recebe o aviso, sem emprestar a ilustração de',
    'outro assunto. O detalhe capítulo a capítulo está em',
    '`18-matriz-cobertura.json`.',
    '',
    '## Total',
    '',
    '| Representação | Capítulos | Parcela |',
    '| --- | ---: | ---: |',
    ...ORDER.map((kind) => `| ${LABELS[kind]} | ${coverage.counts[kind]} | ${percent(coverage.counts[kind], coverage.total)} |`),
    `| **Total** | **${coverage.total}** | |`,
    '',
    '## Por matéria',
    '',
    `| Matéria | Capítulos | ${ORDER.map((kind) => LABELS[kind]).join(' | ')} |`,
    `| --- | ---: | ${ORDER.map(() => '---:').join(' | ')} |`,
    ...coverage.subjects.map((subject) => `| ${cell(subject.subject)} | ${subject.chapters} | ${ORDER.map((kind) => subject.counts[kind]).join(' | ')} |`),
    '',
    '## Capítulos com mais de um candidato',
    '',
  ];

  const contested = coverage.rows.filter((row) => row.ignored.length > 0);
  if (contested.length === 0) {
    lines.push('Nenhum. Cada capítulo tem no máximo um artefato registrado.');
  } else {
    lines.push(
      `${contested.length} capítulos têm mais de um artefato registrado. A seleção continua exclusiva: vence o primeiro da ordem acima.`,
      '',
      '| Capítulo | Matéria | Vence | Perde |',
      '| --- | --- | --- | --- |',
      ...contested.map((row) => `| ${cell(row.title)} | ${cell(row.subject)} | ${LABELS[row.primary]} (${row.artifact}) | ${row.ignored.map(describe).join('; ')} |`),
    );
  }

  return `${lines.join('\n')}\n`;
}
