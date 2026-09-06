/**
 * Extrai o texto dos PDFs de "provas brutas/" para "provas-extraidas/", um
 * .txt por PDF, com marcador de página — é o insumo para transcrever questões
 * reais no acervo (src/data/discursiveQuestions.ts e public/questions.json)
 * conferindo contra o documento original, em vez de reconstruir.
 *
 * A pasta de saída é ignorada pelo git, mesma regra de materiais-extraidos/.
 *
 * Uso:
 *   npx tsx scripts/extract-provas.ts            # extrai o que ainda não foi extraído
 *   npx tsx scripts/extract-provas.ts --force    # reextrai tudo
 *   npx tsx scripts/extract-provas.ts Fuvest     # só arquivos cujo caminho contém "Fuvest"
 *
 * PDF escaneado (sem camada de texto) não é extraível aqui: o script sinaliza
 * e o caminho é o OCR de scripts/ocr-apostila.sh, já usado nas apostilas.
 */
import { readFile, readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { PDFParse } from 'pdf-parse';

const SRC_DIR = 'provas brutas';
const OUT_DIR = 'provas-extraidas';

/** Bancas cujo nome o script reconhece no nome do arquivo (ver o README da pasta). */
const BOARDS = ['Fuvest', 'Unicamp', 'Comvest', 'Unesp', 'Vunesp', 'Famerp', 'Unifesp', 'ENEM'];

/**
 * Abaixo disso, a página quase certamente não tem camada de texto — é scan.
 * Cabeçalho e número de página sozinhos já passam de ~40 caracteres, então o
 * corte precisa ser baixo para não acusar falso positivo em página de abertura.
 */
const MIN_CHARS_PER_PAGE = 40;

interface Meta { board?: string; year?: number; phase?: string }

function parseMeta(filename: string): Meta {
  const board = BOARDS.find((b) => filename.toLowerCase().includes(b.toLowerCase()));
  const year = filename.match(/\b(19|20)\d{2}\b/)?.[0];
  const phase = /\b1a?\s*fase|primeira\s*fase/i.test(filename) ? '1ª fase'
    : /\b2a?\s*fase|segunda\s*fase/i.test(filename) ? '2ª fase'
    : undefined;
  return { board, year: year ? Number(year) : undefined, phase };
}

async function extractOne(pdfPath: string, outPath: string, filename: string) {
  const buffer = await readFile(pdfPath);
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const meta = parseMeta(filename);
    const header = [
      `# ${filename}`,
      meta.board ? `banca: ${meta.board}` : 'banca: (não identificada pelo nome do arquivo)',
      meta.year ? `ano: ${meta.year}` : 'ano: (não identificado pelo nome do arquivo)',
      meta.phase ? `fase: ${meta.phase}` : 'fase: (não identificada pelo nome do arquivo)',
      `páginas: ${result.pages.length}`,
      '',
    ].join('\n');

    const body = result.pages
      .map((p) => `\n===== página ${p.num} =====\n${p.text.trim()}`)
      .join('\n');

    await writeFile(outPath, header + body + '\n', 'utf8');

    const empty = result.pages.filter((p) => p.text.trim().length < MIN_CHARS_PER_PAGE);
    return { pages: result.pages.length, empty: empty.map((p) => p.num), meta };
  } finally {
    await parser.destroy();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const filter = args.find((a) => !a.startsWith('--'));

  let entries: string[];
  try {
    // As provas ficam em subpastas por banca e ano (FUVEST/2026/...), então a
    // varredura precisa ser recursiva — a lista plana só via a raiz.
    entries = (await readdir(SRC_DIR, { recursive: true, withFileTypes: true }))
      .filter((d) => d.isFile())
      .map((d) => relative(SRC_DIR, join(d.parentPath ?? d.path, d.name)));
  } catch {
    console.error(`Pasta "${SRC_DIR}" não encontrada. Crie-a e suba os PDFs das provas (ver o README dela).`);
    process.exit(1);
  }

  const pdfs = entries
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .filter((f) => !filter || f.toLowerCase().includes(filter.toLowerCase()))
    .sort();

  if (!pdfs.length) {
    console.log(`Nenhum PDF em "${SRC_DIR}"${filter ? ` com "${filter}" no caminho` : ''}.`);
    console.log('Suba as provas nessa pasta e rode de novo — o README de lá explica como nomear.');
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  console.log(`${pdfs.length} PDF(s) a processar.\n`);

  const scanned: string[] = [];
  let done = 0;
  let skipped = 0;

  for (const filename of pdfs) {
    const pdfPath = join(SRC_DIR, filename);
    const outPath = join(OUT_DIR, filename.replace(/\.pdf$/i, '.txt'));
    await mkdir(dirname(outPath), { recursive: true });

    // Ponteiro do Git LFS tem ~130 bytes: o arquivo está versionado, mas o
    // conteúdo não foi baixado nesta cópia do repositório.
    const { size } = await stat(pdfPath);
    if (size < 1024) {
      const head = (await readFile(pdfPath, 'utf8').catch(() => '')).slice(0, 40);
      if (head.startsWith('version https://git-lfs')) {
        console.log(`~ ${filename}: ponteiro LFS, conteúdo não baixado (rode "git lfs pull")`);
        skipped++;
        continue;
      }
    }

    if (!force) {
      const already = await stat(outPath).then(() => true).catch(() => false);
      if (already) {
        console.log(`~ ${filename}: já extraído (use --force para refazer)`);
        skipped++;
        continue;
      }
    }

    try {
      const { pages, empty, meta } = await extractOne(pdfPath, outPath, filename);
      const label = [meta.board, meta.year, meta.phase].filter(Boolean).join(' ') || 'sem metadados no nome';
      console.log(`✓ ${filename} — ${pages} páginas [${label}]`);
      if (empty.length) {
        console.log(`  ! ${empty.length} página(s) sem texto: ${empty.slice(0, 12).join(', ')}${empty.length > 12 ? '…' : ''}`);
        if (empty.length > pages / 2) scanned.push(filename);
      }
      done++;
    } catch (error) {
      console.error(`✗ ${filename}: ${(error as Error).message}`);
    }
  }

  console.log(`\n${done} extraído(s), ${skipped} pulado(s). Saída em ${OUT_DIR}/`);

  if (scanned.length) {
    console.log('\nAparentemente escaneados (maioria das páginas sem camada de texto):');
    for (const f of scanned) console.log(`  - ${f}`);
    console.log('Esses precisam de OCR: scripts/ocr-apostila.sh <pasta> <saida.txt>');
  }
}

main();
