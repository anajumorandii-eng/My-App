import { readComvestAnswerKey, type ReviewedOfficialSource } from './officialExamExpansion';

export interface OfficialBatchSource extends ReviewedOfficialSource {
  answerKeyFormat: 'comvest' | 'fuvest' | 'vunesp' | 'enem';
  keyMarker: string;
  examSha256: string;
  answerKeySha256: string;
  answerKeyTextSha256: string;
  answerKeyTextFile: string;
  itemsFile: string;
}

/** Columns may be question ranges or different versions: never flatten both. */
export function readOfficialAnswerKey(text: string, source: OfficialBatchSource): Map<number, string> {
  if (!text.includes(String(source.year)) || !text.includes(source.keyMarker)) {
    throw new Error('Gabarito não corresponde à edição/processo declarado.');
  }
  if (source.answerKeyFormat === 'comvest') {
    if (source.board !== 'UNICAMP' || source.optionIds !== 'abcd' || source.firstNumber !== 1 || source.totalQuestions !== 72) {
      throw new Error('Identidade Comvest incompatível.');
    }
    return readComvestAnswerKey(text, source.version);
  }
  const answers = new Map<number, string>();
  const add = (number: string, answer: string) => {
    const n = Number(number);
    if (answers.has(n)) throw new Error(`Número repetido no gabarito: ${n}.`);
    answers.set(n, /^anulad/i.test(answer) ? '*' : answer.toLowerCase());
  };
  if (source.optionIds !== 'abcde') throw new Error('Banca exige cinco alternativas.');
  switch (source.answerKeyFormat) {
    case 'fuvest': {
      if (source.board !== 'FUVEST' || !/^V[1-4]$/.test(source.version) || source.firstNumber !== 1 || source.totalQuestions !== 90 ||
          !new RegExp(`PROVA\\s+${source.version}\\b`).test(text)) throw new Error('Versão Fuvest incompatível.');
      const column = Number(source.version[1]) - 1;
      for (const line of text.split('\n')) {
        if (!/^\s*\d{1,2}\s+[A-E*]\s/.test(line)) continue;
        const pairs = [...line.matchAll(/(\d{1,2})\s+([A-E*])/g)];
        if (pairs.length !== 8) throw new Error('Linha incompleta do gabarito Fuvest.');
        for (const pair of pairs.slice(column * 2, column * 2 + 2)) add(pair[1], pair[2]);
      }
      break;
    }
    case 'vunesp': {
      const totals: Record<string,number> = { UNESP: 90, FAMERP: 80, UNIFESP: 25 };
      if (source.version !== 'V1' || source.firstNumber !== 1 || totals[source.board] !== source.totalQuestions ||
          !/VERSÃO\s+1\b/i.test(text)) throw new Error('Versão Vunesp incompatível.');
      for (const pair of text.matchAll(/\b(\d{1,2})\s*-\s*([A-E*])\b/g)) add(pair[1], pair[2]);
      break;
    }
    case 'enem': {
      if (source.board !== 'ENEM' || source.version !== 'CD5 amarelo' || !source.phase.includes('2º dia') ||
          !source.phase.includes('regular') || source.firstNumber !== 91 || source.totalQuestions !== 90 ||
          !/Amarelo/i.test(text) || !/2º\s+DIA\s*-\s*CADERNO\s+5/.test(text)) throw new Error('Dia/caderno ENEM incompatível.');
      for (const line of text.split('\n')) {
        if (!/^\s*\d{2,3}\s+(?:[A-E*]|Anulad[oa])\s+\d{2,3}/i.test(line)) continue;
        const pairs = [...line.matchAll(/\b(\d{2,3})\s+([A-E*]\b|Anulad[oa]\b)/gi)];
        if (pairs.length !== 2) throw new Error('Linha incompleta do gabarito ENEM.');
        for (const pair of pairs) add(pair[1], pair[2]);
      }
      break;
    }
    default: throw new Error('Formato de gabarito desconhecido.');
  }
  if (answers.size !== source.totalQuestions || Array.from({length:source.totalQuestions}, (_, i) => source.firstNumber + i).some(n => !answers.has(n))) {
    throw new Error('Gabarito incompleto ou fora da faixa oficial.');
  }
  return answers;
}
