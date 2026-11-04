/**
 * Aplica as listas de scripts/data/enem-reclassificacao/*.json ao banco.
 * Uso: npx tsx scripts/aplicar-reclassificacao-enem.mts [--write]
 * Recusa a lista inteira se um id não existir, se a questão não for do ENEM
 * ou se o capítulo não pertencer ao assunto no currículo — gravar pela metade
 * deixaria a análise misturando dois critérios, que é o defeito a corrigir.
 * A conferência em página original prevalece sobre listas anteriores.
 * Sem --write, apenas simula. Reaplicar não muda nada.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';
import type { Question } from '../src/types';
import { loadEnemEditorialClassifications, applyEnemEditorialClassifications } from './lib/enemEditorialClassifications';

const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Question[];
const manifest = JSON.parse(await readFile('scripts/data/enem-completo-2018-2025/manifest.json', 'utf8'));
const classifications = await loadEnemEditorialClassifications(mockTopics);
const ids = new Set(bank.map(question => question.id));
for (const id of classifications.keys()) if (!ids.has(id)) throw new Error(`Revisão sem questão no banco: ${id}`);
const reviewed = applyEnemEditorialClassifications(bank, classifications, new Set<string>(manifest.positions.map((position: { questionId: string }) => position.questionId)));
const changed = reviewed.filter((question, index) => question.topicId !== bank[index].topicId || question.subject !== bank[index].subject || question.chapter !== bank[index].chapter).length;
if (process.argv.includes('--write') && changed) await writeFile('public/questions.json', JSON.stringify(reviewed, null, 2) + '\n');
console.log(`${classifications.size} classificações editoriais; ${changed} alterações propostas. ${process.argv.includes('--write') ? 'Gravação autorizada por --write.' : 'Simulação; use --write para gravar.'}`);
