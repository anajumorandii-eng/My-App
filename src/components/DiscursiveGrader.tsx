import { useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed, XCircle } from 'lucide-react';
import { estimateScore, gradingProblems, MISS_LABELS, type CheckVerdict, type DiscursiveGrading, type ItemGrade, type MissWhere } from '../lib/discursiveGrading';

const VERDICTS: { value: CheckVerdict; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'completo', label: 'Completo', icon: CheckCircle2, color: 'var(--status-success)' },
  { value: 'parcial', label: 'Parcial', icon: CircleDashed, color: 'var(--status-warning)' },
  { value: 'faltou', label: 'Faltou', icon: XCircle, color: 'var(--status-error)' },
];

/**
 * Correção guiada: a estudante confere a própria resposta contra cada critério
 * do corretor, diz onde perdeu cada ponto e só então salva. A nota sai daí,
 * não de um botão fraco/mediano/forte decidido no olho.
 */
export function DiscursiveGrader({ checks, letters, disabled, onSave }: {
  checks: string[][];
  letters: string[];
  disabled?: boolean;
  onSave: (grading: DiscursiveGrading, toNotebook: boolean) => void;
}) {
  const [verdicts, setVerdicts] = useState<Record<string, CheckVerdict>>({});
  const [wheres, setWheres] = useState<Record<string, MissWhere>>({});
  const [toNotebook, setToNotebook] = useState(true);
  const key = (i: number, j: number) => `${i}:${j}`;

  const items: ItemGrade[] = useMemo(() => checks.map((item, i) => ({
    letter: letters[i] ?? String(i + 1),
    checks: item.map((text, j) => {
      const verdict = verdicts[key(i, j)] ?? 'completo';
      const where = wheres[key(i, j)];
      // Sem chave undefined: o Firestore recusa o documento inteiro por causa dela.
      return verdict !== 'completo' && where ? { text, verdict, where } : { text, verdict };
    }),
  })), [checks, letters, verdicts, wheres]);

  const answered = checks.every((item, i) => item.every((_, j) => verdicts[key(i, j)]));
  const problems = gradingProblems(items);
  const score = estimateScore(items);

  return (
    <section aria-labelledby="grader-title" className="rounded-xl border border-[var(--line)] p-4 space-y-4 text-xs">
      <div>
        <h3 id="grader-title" className="font-semibold text-sm text-[var(--text)]">Corrija sua resposta como a banca</h3>
        <p className="text-[var(--dim)] mt-1">Para cada critério, procure no que você escreveu. <b>Completo</b>: está lá, com o termo e a justificativa. <b>Parcial</b>: a ideia está, mas falta o termo exato, a justificativa ou a unidade. <b>Faltou</b>: não está.</p>
      </div>

      {checks.map((item, i) => (
        <fieldset key={i} className="space-y-2 min-w-0">
          <legend className="font-medium text-[var(--text)]">Item {letters[i] ?? i + 1}</legend>
          {item.map((text, j) => {
            const k = key(i, j); const verdict = verdicts[k];
            return (
              <div key={k} className="rounded-lg border border-[var(--line)] p-2 space-y-2">
                <p className="text-[var(--text)]">{text}</p>
                <div role="radiogroup" aria-label={`Critério: ${text}`} className="flex flex-wrap gap-1.5">
                  {VERDICTS.map((v) => {
                    const Icon = v.icon; const on = verdict === v.value;
                    return (
                      <button key={v.value} type="button" role="radio" aria-checked={on} disabled={disabled}
                        onClick={() => setVerdicts({ ...verdicts, [k]: v.value })}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border min-h-9"
                        style={{ borderColor: on ? v.color : 'var(--line)', background: on ? `color-mix(in srgb, ${v.color} 14%, transparent)` : undefined }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: v.color }} aria-hidden />{v.label}
                      </button>
                    );
                  })}
                </div>
                {verdict && verdict !== 'completo' && (
                  <label className="flex flex-col gap-1">
                    <span className="text-[var(--dim)]">Onde perdeu o ponto?</span>
                    <select value={wheres[k] ?? ''} disabled={disabled} onChange={(e) => setWheres({ ...wheres, [k]: e.target.value as MissWhere })}
                      className="w-full min-w-0 px-2 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)]">
                      <option value="" disabled>Escolha</option>
                      {(Object.keys(MISS_LABELS) as MissWhere[]).map((w) => <option key={w} value={w}>{MISS_LABELS[w].label}</option>)}
                    </select>
                    {/* A explicação fica fora da opção: texto longo no <option> alarga o
                        <select> até a opção maior e estourava o cartão no celular. */}
                    {wheres[k] && <span className="text-[11px] text-[var(--dim)]">{MISS_LABELS[wheres[k]].hint}</span>}
                  </label>
                )}
              </div>
            );
          })}
        </fieldset>
      ))}

      <div className="rounded-lg p-3 space-y-2" style={{ background: 'color-mix(in srgb, var(--action-primary) 8%, transparent)' }}>
        <p className="text-sm text-[var(--text)]" aria-live="polite">{answered ? <>Nota estimada: <b>{score.toLocaleString('pt-BR')} de 4</b></> : 'Marque todos os critérios para ver a nota estimada.'}</p>
        <p className="text-[11px] text-[var(--dim)]">Estimativa: cada item pesa igual e cada critério dentro dele também. A banca não publica a divisão interna dos 4 pontos.</p>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={toNotebook} disabled={disabled} onChange={(e) => setToNotebook(e.target.checked)} />
          Mandar cada ponto perdido para o Caderno de Erros
        </label>
        {answered && problems.length > 0 && <ul className="text-[11px] list-disc pl-4" style={{ color: 'var(--status-warning)' }}>{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
        <button type="button" disabled={disabled || !answered || problems.length > 0} onClick={() => onSave({ items, score }, toNotebook)}
          className="w-full py-2.5 bg-[var(--action-primary)] text-[var(--text-inverse)] rounded-xl font-semibold disabled:opacity-50">
          Salvar correção
        </button>
      </div>
    </section>
  );
}

/** Método de correção, para ler antes de abrir a resposta esperada. */
export function HowToGradeGuide() {
  return (
    <details className="rounded-xl border border-[var(--line)] p-3 text-xs">
      <summary className="cursor-pointer font-semibold text-[var(--text)]">Como corrigir uma dissertativa</summary>
      <ol className="list-decimal pl-5 mt-2 space-y-1.5 text-[var(--text)]">
        <li><b>Antes de abrir a resposta</b>, releia o que escreveu e sublinhe, em cada item, a frase que responde à pergunta. Se não achar uma frase assim, o item já está em risco.</li>
        <li><b>Compare critério por critério</b>, não o texto inteiro: o corretor procura pontos específicos, não uma redação parecida com a dele.</li>
        <li><b>Seja duro com o parcial.</b> Ideia certa com termo genérico, resposta sem o "por quê" ou conta sem unidade perdem ponto na Vunesp.</li>
        <li><b>Diga onde errou.</b> "Conceito" pede estudo; "termo" pede vocabulário; "conta ou unidade" pede atenção; "faltou justificar" pede o hábito de escrever o porquê.</li>
        <li><b>Reescreva só o item que perdeu ponto</b>, em até três linhas, e compare de novo. É a reescrita que fixa.</li>
      </ol>
      <p className="mt-2 font-medium text-[var(--text)]">O que mais custa ponto na Vunesp</p>
      <ul className="list-disc pl-5 mt-1 space-y-1 text-[var(--dim)]">
        <li>Responder com a categoria ampla quando o item pede o nome exato.</li>
        <li>Pular o "justifique" ou o "explique", dando só a resposta.</li>
        <li>Resultado sem unidade, ou com a unidade errada.</li>
        <li>Duas respostas para a mesma pergunta: o corretor considera a errada.</li>
        <li>Deixar em branco: resposta parcial pontua, branco é zero.</li>
      </ul>
    </details>
  );
}
