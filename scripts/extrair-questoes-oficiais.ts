/**
 * CLI que cruza uma prova extraída com o gabarito oficial e grava o rascunho.
 * A lógica de verdade — e os testes dela — está em src/lib/officialQuestions.ts.
 *
 * uso: tsx scripts/extrair-questoes-oficiais.ts <prova.txt> <gabarito.txt> <saida.json> [coluna]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { lerGabaritoFuvest, lerProva, montar } from '../src/lib/officialQuestions';

async function main() {
  const [provaPath, gabaritoPath, saida, colunaArg] = process.argv.slice(2);
  if (!provaPath || !gabaritoPath || !saida) {
    console.error('uso: extrair-questoes-oficiais.ts <prova.txt> <gabarito.txt> <saida.json> [coluna]');
    process.exit(2);
  }
  const coluna = Number(colunaArg ?? 0);
  const prova = await readFile(provaPath, 'utf8');
  const gabarito = await readFile(gabaritoPath, 'utf8');

  const ano = Number(provaPath.match(/(20\d{2})/)?.[1] ?? 0);
  const marcador = /\{(\d{2})\}/g;
  const blocos = lerProva(prova, marcador);
  const respostas = lerGabaritoFuvest(gabarito, coluna);

  const { questoes, descartes } = montar(blocos, respostas, ['A', 'B', 'C', 'D', 'E'], {
    board: 'FUVEST',
    year: ano,
    sourceUrl: gabarito.split('\n')[0].replace('fonte: ', '').trim(),
  });

  const porMotivo = descartes.reduce<Record<string, number>>((acc, d) => {
    acc[d.motivo] = (acc[d.motivo] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`questões no caderno: ${blocos.size}`);
  console.log(`respostas no gabarito: ${respostas.size}`);
  console.log(`aproveitadas: ${questoes.length}`);
  console.log('descartadas:', porMotivo);

  await mkdir(dirname(saida), { recursive: true });
  await writeFile(saida, JSON.stringify(questoes, null, 2), 'utf8');
  console.log(`rascunho gravado em ${saida}`);
}

main();
