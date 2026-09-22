import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualCoverage, renderCoverageMarkdown } from './visualCoverage';
import { resolveVisualRepresentation, visualCandidates } from './visualRepresentation';

const chapter = (id: string) => interactiveSummaries.find((item) => item.id === id)!;

describe('visualCandidates', () => {
  it('lista todos os artefatos que casam, na ordem de prioridade do resolvedor', () => {
    // Introdução à Ecologia tem um experimento exato e também a prancha da
    // pirâmide trófica. A auditoria antiga chamava a segunda de "cena-âncora"
    // porque o campo anchorScene misturava cena, prancha e instrumento.
    expect(visualCandidates(chapter('bio-ecologia-introducao'))).toEqual([
      { kind: 'experiment', id: 'ecology' },
      { kind: 'board', id: 'trofico' },
    ]);
  });

  it('cada candidato traz o id do artefato que casou', () => {
    const [experimento] = visualCandidates(chapter('bio-ecologia-introducao'));
    expect(experimento).toEqual({ kind: 'experiment', id: 'ecology' });
  });

  it('um capítulo recém-coberto aponta para o instrumento editorial específico', () => {
    expect(visualCandidates(chapter('summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao'))).toEqual([
      { kind: 'instrument', id: 'intro-tese' },
    ]);
  });

  it('o primeiro candidato é sempre o que a tela resolve, em todos os capítulos', () => {
    const divergentes = interactiveSummaries
      .filter((summary) => (visualCandidates(summary)[0]?.kind ?? 'fallback') !== resolveVisualRepresentation(summary))
      .map((summary) => summary.id);
    expect(divergentes).toEqual([]);
  });
});

describe('buildVisualCoverage', () => {
  it('classifica cada capítulo pela representação que a tela resolve', () => {
    const coverage = buildVisualCoverage([chapter('bio-ecologia-introducao'), chapter('summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao')]);
    expect(coverage.total).toBe(2);
    expect(coverage.counts).toEqual({ experiment: 1, board: 0, instrument: 1, scene: 0, fallback: 0 });
    expect(coverage.rows.map((row) => [row.id, row.primary, row.artifact])).toEqual([
      ['bio-ecologia-introducao', 'experiment', 'ecology'],
      ['summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao', 'instrument', 'intro-tese'],
    ]);
  });

  it('registra o candidato que perdeu a disputa sem mudar a seleção exclusiva', () => {
    const [row] = buildVisualCoverage([chapter('bio-ecologia-introducao')]).rows;
    expect(row.primary).toBe('experiment');
    expect(row.ignored).toEqual([{ kind: 'board', id: 'trofico' }]);
    expect(buildVisualCoverage([chapter('bio-ecologia-introducao')]).contested).toBe(1);
  });

  const coverage = buildVisualCoverage(interactiveSummaries);

  it('conta cada capítulo uma única vez', () => {
    expect(coverage.total).toBe(interactiveSummaries.length);
    expect(coverage.rows.map((row) => row.id)).toEqual(interactiveSummaries.map((summary) => summary.id));
  });

  it('as contagens somam o total, no geral e em cada matéria', () => {
    const soma = (counts: Record<string, number>) => Object.values(counts).reduce((a, b) => a + b, 0);
    expect(soma(coverage.counts)).toBe(coverage.total);
    for (const subject of coverage.subjects) {
      expect(soma(subject.counts), subject.subject).toBe(subject.chapters);
    }
    expect(coverage.subjects.reduce((total, subject) => total + subject.chapters, 0)).toBe(coverage.total);
  });

  it('cada linha usa a representação da tela; o artefato é nulo exatamente nas lacunas', () => {
    for (const summary of interactiveSummaries) {
      const row = coverage.rows.find((item) => item.id === summary.id)!;
      expect(row.primary, summary.id).toBe(resolveVisualRepresentation(summary));
      expect(row.artifact === null, summary.id).toBe(row.primary === 'fallback');
    }
  });

  it('os candidatos que perdem nunca incluem o vencedor', () => {
    for (const row of coverage.rows) {
      expect(row.ignored.some((candidate) => candidate.kind === row.primary), row.id).toBe(false);
    }
  });

  it('o número de capítulos disputados bate com as linhas que têm candidato ignorado', () => {
    expect(coverage.contested).toBe(coverage.rows.filter((row) => row.ignored.length > 0).length);
  });
});

// Os arquivos versionados são gerados por este mesmo código. Se o registro de
// experimentos, pranchas, instrumentos ou cenas mudar sem regenerar, o teste
// falha; assim a matriz em docs/ nunca descreve um app que já não existe.
// Regenerar: npm run visual:matrix
const DOCS = 'docs/visual-personalizado';

function conferirArquivo(relativePath: string, esperado: string) {
  const arquivo = path.resolve(process.cwd(), relativePath);
  if (process.env.UPDATE_VISUAL_MATRIX) {
    writeFileSync(arquivo, esperado);
    return;
  }
  // O git do Windows converte para CRLF na cópia de trabalho; o que vale é o conteúdo.
  const atual = existsSync(arquivo) ? readFileSync(arquivo, 'utf8').replace(/\r\n/g, '\n') : null;
  const primeiraDivergencia = atual === null
    ? 'arquivo ausente'
    : esperado.split('\n').findIndex((linha, indice) => linha !== atual.split('\n')[indice]) + 1;
  expect(atual === esperado, `${relativePath} está desatualizado (primeira divergência: ${primeiraDivergencia}). Rode: npm run visual:matrix`).toBe(true);
}

describe('arquivos de referência da matriz', () => {
  const coverage = buildVisualCoverage(interactiveSummaries);

  it('a matriz em JSON está em dia com o código', () => {
    conferirArquivo(`${DOCS}/18-matriz-cobertura.json`, `${JSON.stringify(coverage, null, 2)}\n`);
  });

  it('o resumo em Markdown está em dia com o código', () => {
    conferirArquivo(`${DOCS}/18-matriz-cobertura.md`, renderCoverageMarkdown(coverage));
  });
});
