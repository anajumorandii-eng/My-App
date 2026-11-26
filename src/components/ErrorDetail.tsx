import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ExternalLink, RotateCcw, Sparkles } from 'lucide-react';
import type { ErrorLog } from '../types';
import { discursiveQuestions } from '../data/discursiveQuestions';
import { famerpExpectedChecks } from '../data/famerpExpectedChecks';
import { ERROR_TYPE_LABELS } from '../lib/errorLabels';
import { AiText } from './AiText';

// Tipos que ela pode escolher ao corrigir o diagnóstico. 'unknown' entra
// porque recusar a hipótese ("Não foi isso") volta para ele, como no registro.
const EDITABLE_TYPES = Object.keys(ERROR_TYPE_LABELS) as ErrorLog['type'][];

// "ni-button" não tem estilo nesta tela: os botões saíam como texto solto.
const BTN = 'inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-lg border border-[var(--line)] text-xs text-[var(--text)] hover:border-[var(--action-primary)] disabled:opacity-50';
const BTN_PRIMARY = 'inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--action-primary)] text-[var(--text-inverse)]';

/** O item da discursiva a que o critério perdido pertence, pela lista do corretor. */
function itemOf(questionId: string, breakPoint: string | undefined): number | null {
  const checks = famerpExpectedChecks[questionId];
  if (!checks || !breakPoint) return null;
  const index = checks.findIndex((item) => item.includes(breakPoint));
  return index >= 0 ? index : null;
}

/**
 * O erro aberto: a questão, o que a banca esperava, o que ela escreveu, o
 * diagnóstico editável e o que fazer agora. Antes o cartão era só leitura —
 * não abria a questão, não deixava corrigir o tipo nem dar o erro por
 * superado, e o Caderno virava uma lista sem uso.
 */
export function ErrorDetail({ log, onUpdate, onExplain, explaining }: {
  log: ErrorLog;
  onUpdate: (next: ErrorLog) => void;
  onExplain: (log: ErrorLog) => void;
  explaining: boolean;
}) {
  const question = discursiveQuestions.find((q) => q.id === log.questionId);
  const item = question ? itemOf(question.id, log.breakPoint) : null;
  const subItem = item !== null ? question?.subItems?.[item] : undefined;
  const [reflection, setReflection] = useState(log.reflection ?? '');
  const [editingType, setEditingType] = useState(false);

  const redoLink = question
    ? `/treino-2a-fase?banca=${encodeURIComponent(question.board)}&questao=${encodeURIComponent(question.id)}`
    : log.questionId.startsWith('manual_') ? null : `/questoes?topic=${encodeURIComponent(log.topicId)}`;

  return (
    <div className="mt-3 space-y-4 border-t border-[var(--line)] pt-3 text-xs text-[var(--text)]">
      {question && (
        <section className="space-y-1">
          <h4 className="font-semibold">A questão · {question.board} {question.year}</h4>
          <p className="text-[var(--dim)] leading-relaxed">{question.prompt}</p>
          {subItem && <p className="leading-relaxed"><b>Item {subItem.letter}:</b> {subItem.prompt}</p>}
        </section>
      )}

      {(log.breakPoint || (question && item !== null)) && (
        <section className="space-y-1">
          <h4 className="font-semibold">O que a banca esperava</h4>
          {log.breakPoint && <p>Critério que você perdeu: <b>{log.breakPoint}</b></p>}
          {question && item !== null && question.modelAnswer[item] && <p className="text-[var(--dim)] leading-relaxed">{question.modelAnswer[item]}</p>}
        </section>
      )}

      {log.evidence && (
        <section className="space-y-1">
          <h4 className="font-semibold">O que você escreveu</h4>
          <p className="whitespace-pre-wrap leading-relaxed rounded-lg border border-[var(--line)] p-2">{log.evidence}</p>
        </section>
      )}

      <section className="space-y-2">
        <h4 className="font-semibold">Diagnóstico</h4>
        {editingType ? (
          <label className="flex flex-col gap-1">
            <span className="text-[var(--dim)]">Qual foi o tipo do erro?</span>
            <select value={log.type} onChange={(e) => { onUpdate({ ...log, type: e.target.value as ErrorLog['type'], confidence: 'confirmado' }); setEditingType(false); }}
              className="w-full min-w-0 px-2 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)]">
              {EDITABLE_TYPES.map((t) => <option key={t} value={t}>{ERROR_TYPE_LABELS[t]}</option>)}
            </select>
          </label>
        ) : (
          <p>Tipo registrado: <b>{ERROR_TYPE_LABELS[log.type]}</b>{log.confidence === 'confirmado' ? ' · confirmado por você' : ''}</p>
        )}
        {!editingType && log.confidence !== 'confirmado' && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={BTN} onClick={() => onUpdate({ ...log, confidence: 'confirmado' })}>Foi isso mesmo</button>
            <button type="button" className={BTN} onClick={() => setEditingType(true)}>Foi outro tipo</button>
            {/* Mesma regra do registro: recusar devolve para "não sei", em vez de
                deixar marcado o palpite recém-negado. */}
            <button type="button" className={BTN} onClick={() => onUpdate({ ...log, type: 'unknown', confidence: 'baixa' })}>Não sei o motivo</button>
          </div>
        )}
        <label className="flex flex-col gap-1">
          <span className="text-[var(--dim)]">O que passou pela sua cabeça na hora? É a evidência mais forte do diagnóstico.</span>
          <textarea value={reflection} rows={3} onChange={(e) => setReflection(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)]" />
        </label>
        {reflection.trim() !== (log.reflection ?? '').trim() && (
          <button type="button" className={BTN} onClick={() => onUpdate({ ...log, reflection: reflection.trim() })}>Salvar relato</button>
        )}
        {!log.aiHypothesis && (
          <button type="button" className={BTN} disabled={explaining} onClick={() => onExplain(reflection.trim() ? { ...log, reflection: reflection.trim() } : log)}>
            <Sparkles className="w-3.5 h-3.5" aria-hidden />{explaining ? 'Gerando explicação…' : 'Explicar este erro com IA'}
          </button>
        )}
        {log.aiHypothesis && <div className="rounded-lg border border-[var(--line)] p-2"><AiText text={log.aiHypothesis} /></div>}
      </section>

      <section className="space-y-2">
        <h4 className="font-semibold">O que fazer agora</h4>
        <div className="flex flex-wrap gap-2">
          {redoLink && (
            <Link to={redoLink} className={BTN_PRIMARY}><ExternalLink className="w-3.5 h-3.5" aria-hidden />{question ? 'Refazer esta questão' : 'Treinar questões deste tópico'}</Link>
          )}
          {log.resolvedAt ? (
            <button type="button" className={BTN} onClick={() => { const { resolvedAt: _drop, ...rest } = log; onUpdate(rest); }}>
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />Voltar para os ativos
            </button>
          ) : (
            <button type="button" className={BTN} onClick={() => onUpdate({ ...log, resolvedAt: new Date().toISOString() })}>
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />Refiz e acertei: marcar como superado
            </button>
          )}
        </div>
        <p className="text-[var(--dim)]">As revisitas de 1, 3 e 7 dias deste erro aparecem em Revisões.</p>
      </section>
    </div>
  );
}
