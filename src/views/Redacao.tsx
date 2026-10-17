import { StudyExportButton } from '../components/StudyExportButton';
import { EssayReviewAudit, type EssayAudit } from '../components/EssayReviewAudit';
import { EssayWorkshop } from '../components/EssayWorkshop';
import { emptyEssayPlan } from '../data/essayWorkshop';
import { readEssayCurrent, readEssayVersions, essayCorrectionQuestion, type EssayVersion } from '../lib/essayWorkspace';
import { useStudyDraft } from '../hooks/useStudyDraft';
import { isCorrection } from '../lib/tutorWorkspace';
import { StudyDraftNotice } from '../components/StudyDraftNotice';
import { useAuth } from '../context/AuthContext';
import React, { useState, useRef, useEffect } from 'react';
import {
  essayStructure,
  interventionFormula,
  repertoireGuidance,
  essayBoardProfiles,
  commonMistakes,
} from '../data/essayModule';
import { PenLine, ChevronDown, Lightbulb, AlertTriangle, CheckCircle2, XCircle, MessageSquareQuote, Sparkles, Save } from 'lucide-react';
import { aiErrorMessage, requestAiText } from '../lib/aiClient';
import { AnswerCorrection, parseAnswerCorrection } from '../lib/tutorContracts';
import { AiText } from '../components/AiText';
import { Panel } from '../components/ui/Panel';
import { SUBJECT_ICONS } from './Dashboard';

type Tab = 'pratica' | 'estrutura' | 'bancas' | 'erros' | 'checklist';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pratica', label: 'Escrever e Reescrever' },
  { id: 'estrutura', label: 'Guia de Estrutura' },
  { id: 'bancas', label: 'Por Vestibular' },
  { id: 'erros', label: 'Erros que Limitam a Nota' },
  { id: 'checklist', label: 'Checklist de Revisão' },
];

const PART_ORDER: Array<'Introdução' | 'Desenvolvimento' | 'Conclusão'> = ['Introdução', 'Desenvolvimento', 'Conclusão'];

export default function Redacao() {
  const { user } = useAuth();
  const scope = user?.uid ?? 'demo';
  return <EssayEditor key={scope} scope={scope} />;
}
function EssayEditor({ scope }: { scope: string }) {
  const currentKey = `crivo_essay_current_v1:${scope}`;
  const [savedWorkspace] = useState(() => readEssayCurrent(scope));
  const versionsKey = `crivo_essay_versions_v1:${scope}`;
  const [plan, setPlan] = useState(savedWorkspace.plan);
  const [versions, setVersions] = useState(() => readEssayVersions(versionsKey));
  const [audit, setAudit] = useState<EssayAudit>({});
  const [saveMessage, setSaveMessage] = useState('');
  const [rewriteCorrection, setRewriteCorrection, rewriteCorrectionStatus] = useStudyDraft('redacao:rewriteCorrection', null, isCorrection);
  const correctionEpoch = useRef(0);
  useEffect(() => () => { correctionEpoch.current++; }, []);
  const invalidate = () => { setAudit({}); correctionEpoch.current++; setCorrection(null); setRewriteCorrection(null); setPracticeError(null); setSaveMessage(''); };

  const [tab, setTab] = useState<Tab>('pratica');
  const [expandedBoard, setExpandedBoard] = useState<string | null>(essayBoardProfiles[0]?.board ?? null);
  const [board, setBoard] = useState(savedWorkspace.board);
  const [theme, setTheme] = useState(savedWorkspace.theme);
  const [draft, setDraft] = useState(savedWorkspace.draft);
  const [rewrite, setRewrite] = useState(savedWorkspace.rewrite);
  const [correction, setCorrection, correctionStatus] = useStudyDraft('redacao:correction', null, isCorrection);
  const [correcting, setCorrecting] = useState(false);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  const [autoSaveStatus, setAutoSaveStatus] = useState('empty');
  useEffect(() => {
    try { localStorage.setItem(currentKey, JSON.stringify({ board, theme, draft, rewrite, plan })); setAutoSaveStatus('saved'); }
    catch { setAutoSaveStatus('unavailable'); }
  }, [currentKey, board, theme, draft, rewrite, plan]);

  const saveDraft = () => {
    setSaveMessage(''); setPracticeError(null);
    try {
      localStorage.setItem(currentKey, JSON.stringify({ board, theme, draft, rewrite, plan }));
      const version: EssayVersion = { id: crypto.randomUUID(), date: new Date().toISOString(), board, theme, draft, rewrite, plan: { ...plan } };
      const previous = versions[0];
      const unchanged = previous && previous.board === board && previous.theme === theme && previous.draft === draft && previous.rewrite === rewrite && JSON.stringify(previous.plan) === JSON.stringify(plan);
      const next = unchanged ? versions : [version, ...versions].slice(0, 20);
      localStorage.setItem(versionsKey, JSON.stringify(next));
      setVersions(next); setSaveMessage('Versão salva neste navegador.'); return true;
    } catch { setPracticeError('Não foi possível salvar neste navegador. O texto permanece aberto; copie-o antes de sair.'); return false; }
  };

  const correctEssay = async (phase: 'draft' | 'rewrite' = 'draft') => {
    const text = phase === 'rewrite' ? rewrite : draft;
    if (!theme.trim() || !text.trim()) return;
    const question = essayCorrectionQuestion(board, theme.trim(), plan, phase === 'rewrite' ? { draft, rupture: correction?.rupturaPoint ?? 'Sem diagnóstico anterior disponível; compare as duas versões sem inventar o retorno da primeira.' } : undefined);
    if (text.trim().length > 12000 || question.length > 12000) { setPracticeError('O texto ou o contexto de correção excede 12.000 caracteres. Reduza as informações de planejamento ou da coletânea mantendo o necessário para avaliar a proposta.'); return; }
    if (!saveDraft()) return;
    const epoch = ++correctionEpoch.current;
    setCorrecting(true); setPracticeError(null);
    if (phase === 'rewrite') setRewriteCorrection(null); else { setCorrection(null); setRewriteCorrection(null); }
    try {
      const result = await requestAiText('answer-correction', {
        topic: `Redação — ${theme.trim().slice(0, 270)}`,
        subject: 'Língua Portuguesa / Redação', answerKind: 'essay', board, question, studentAnswer: text.trim(),
      });
      if (correctionEpoch.current !== epoch) return;
      const feedback = parseAnswerCorrection(result.text);
      if (phase === 'rewrite') setRewriteCorrection(feedback);
      else { setCorrection(feedback); setRewrite(current => current.trim() ? current : text); }
    } catch (error) {
      if (correctionEpoch.current === epoch) setPracticeError(aiErrorMessage(error));
    } finally { setCorrecting(false); }
  };

  const PenIcon = SUBJECT_ICONS['Português'] ?? PenLine;

  return (
    <div className="ni-main" data-study-export>
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>REDAÇÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--action-primary)] text-[var(--text-inverse)]">
            <PenIcon className="w-3 h-3" />
          </span>
          ATELIÊ DE ESCRITA
        </span>
        <i />
        <b>TREINO DE REDAÇÃO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Escreva com estrutura, argumente com evidência.</h1>
          <p>Estrutura de texto, proposta de intervenção, repertório produtivo e análise de critérios específicos por vestibular.</p>
        </div>
        <div className="ni-state">
          <i /> critérios de {essayBoardProfiles.length} bancas
        </div>
      </div>

      <div className="mb-4"><StudyDraftNotice statuses={[autoSaveStatus, correctionStatus, rewriteCorrectionStatus]} /><p className="text-xs text-[var(--dim)]">O rascunho atual é salvo automaticamente. Use “Salvar rascunho” para criar uma versão no histórico.</p></div>
      <div className="mb-4"><StudyExportButton title={`Redação — ${theme || board}`} /></div>
      {/* Tabs */}
      <div className="ni-subjects">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={
                active
                  ? { backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)', borderRadius: '4px', padding: '2px 8px' }
                  : undefined
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Practice Tab */}
      {tab === 'pratica' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              aria-label="Banca da redação"
              value={board}
              onChange={(e) => { invalidate(); setBoard(e.target.value); }}
              className="border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
            >
              {['ENEM', 'Fuvest', 'Unicamp', 'Unesp/Vunesp', 'Famerp', 'Unifesp'].map((item) => (
                <option key={item} value={item} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{item}</option>
              ))}
            </select>
            <input
              value={theme}
              aria-label="Tema da redação"
              onChange={(e) => { invalidate(); setTheme(e.target.value); }}
              placeholder="Tema ou proposta de redação..."
              className="md:col-span-2 border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
            />
          </div>

          {scope !== 'demo' && !savedWorkspace.draft && Boolean(localStorage.getItem('juju-essay-draft')) && <div className="ni-panel p-3 text-sm"><p>Há um rascunho anterior neste navegador que não estava associado a uma conta. Importar copia o texto para o espaço desta conta.</p><button className="ni-button mt-2" onClick={() => { if ((draft.trim() || theme.trim() || rewrite.trim()) && !saveDraft()) return; invalidate(); setTheme(localStorage.getItem('juju-essay-theme') ?? ''); setDraft(localStorage.getItem('juju-essay-draft') ?? ''); setRewrite(localStorage.getItem('juju-essay-rewrite') ?? ''); }}>Importar meu rascunho anterior</button></div>}
          <EssayWorkshop board={board} plan={plan} onChange={value => { invalidate(); setPlan(value); }} />
          <p className="text-xs text-[var(--dim)]">A correção por IA é formativa. Compare seus trechos com a proposta e os critérios; ela não é uma nota oficial. Planejamento e versões são salvos neste navegador, até 20 versões recentes.</p>
          {saveMessage && <p role="status" className="text-sm">{saveMessage}</p>}
          <Panel subject="Português" className="ni-panel p-5">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-[var(--text)]">Primeira versão (rascunho)</span>
              <span className="text-[var(--dim)] font-mono">{draft.trim() ? draft.trim().split(/\s+/).length : 0} palavras</span>
            </div>
            <textarea
              value={draft}
              aria-label="Primeira versão da redação"
              maxLength={12000}
              onChange={(e) => { invalidate(); setDraft(e.target.value); }}
              rows={14}
              placeholder="Escreva sua redação aqui..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-4 text-xs text-[var(--text)] leading-relaxed outline-none focus:border-[var(--primary)]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={saveDraft}
                className="flex items-center px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Salvar rascunho
              </button>
              <button
                onClick={() => void correctEssay('draft')}
                disabled={correcting || !theme.trim() || !draft.trim()}
                className="flex items-center px-3.5 py-1.5 bg-[var(--action-primary)] text-[var(--text-inverse)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {correcting ? 'Corrigindo...' : 'Corrigir com IA'}
              </button>
            </div>
            {practiceError && <p className="text-xs text-rose-500 mt-2">{practiceError}</p>}
          </Panel>

          {(correction || rewrite.trim()) && (
            <div className="space-y-4">
              {correction && <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['O que funcionou', correction.acertos],
                  ['Primeiro ponto de ruptura', correction.rupturaPoint],
                  ['Por que compromete o texto', correction.porque],
                  ['Correção mínima sugerida', correction.correcaoMinima],
                ].map(([title, content]) => (
                  <Panel key={title} subject="Português" className="ni-panel p-4 text-xs">
                    <p className="font-semibold mb-1 subject-text">{title}</p>
                    <AiText text={content} className="text-[var(--text)] leading-relaxed" />
                  </Panel>
                ))}
              </div>

              <Panel subject="Português" className="ni-panel p-5 text-xs">
                <p className="font-semibold mb-1 text-[var(--text)]">Versão-modelo para comparação</p>
                <AiText text={correction.respostaModelo} className="text-[var(--dim)] leading-relaxed" />
              </Panel>

              </>}
              <Panel subject="Português" className="ni-panel p-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-[var(--text)]">Reescrita para comparação</span>
                  <span className="text-[var(--dim)]">Confira o ponto de ruptura ou compare a versão salva com a proposta</span>
                </div>
                <textarea
                  value={rewrite}
                  aria-label="Reescrita da redação"
                  maxLength={12000}
                  onChange={(e) => { setAudit({}); correctionEpoch.current++; setRewriteCorrection(null); setPracticeError(null); setRewrite(e.target.value); }}
                  rows={14}
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-4 text-xs text-[var(--text)] leading-relaxed outline-none focus:border-[var(--primary)]"
                />
                <button
                  onClick={saveDraft}
                  disabled={rewrite.trim() === draft.trim()}
                  className="mt-3 flex items-center px-4 py-2 bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Salvar reescrita
                </button>
                <button className="ni-button mt-3 ml-2" disabled={correcting || !rewrite.trim() || rewrite.trim() === draft.trim()} onClick={() => void correctEssay('rewrite')}>Reavaliar reescrita</button>
                {rewriteCorrection && <div className="space-y-3 mt-4 text-sm" role="status"><h3 className="font-semibold">Retorno da reescrita</h3><p><b>O que melhorou ou funcionou:</b> {rewriteCorrection.acertos}</p><p><b>Ponto que ainda exige trabalho:</b> {rewriteCorrection.rupturaPoint}</p><p>{rewriteCorrection.porque}</p><p><b>Próxima mudança:</b> {rewriteCorrection.correcaoMinima}</p></div>}
                <p className="text-xs mt-3">Após revisar, reconstrua de memória o problema, a mudança feita e seu efeito. No próximo treino, aplique a mesma habilidade a outro tema.</p>
              </Panel>
            </div>
          )}
        </div>
      )}

      {tab === 'pratica' && versions.length > 0 && <details className="ni-panel p-4 mt-4"><summary className="cursor-pointer font-semibold">Versões salvas neste navegador ({versions.length})</summary><p className="text-xs mt-2">Ao restaurar, substitua o texto aberto somente depois de salvar as mudanças que deseja manter.</p><ul className="space-y-2 mt-3">{versions.map(version => <li key={version.id} className="text-sm border-t border-[var(--line)] pt-2">{version.board} · {version.theme || 'Sem tema'} · {new Date(version.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}<button className="ni-button ml-2" disabled={correcting} onClick={() => { if (!saveDraft()) return; invalidate(); setBoard(version.board); setTheme(version.theme); setDraft(version.draft); setRewrite(version.rewrite); setPlan({ ...emptyEssayPlan, ...version.plan }); }}>Restaurar versão</button></li>)}</ul></details>}

      {/* Structure Guide Tab */}
      {tab === 'estrutura' && (
        <div className="space-y-6">
          <p className="text-sm">Este guia organiza argumentação dissertativa. Para carta, nota, crônica ou outro gênero, planeje a situação comunicativa e siga a proposta, sem impor um esquema fixo de parágrafos.</p>
          {PART_ORDER.map((part) => (
            <section key={part} className="space-y-3">
              <h2 className="font-display font-medium text-sm text-[var(--text)]">{part}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {essayStructure
                  .filter((s) => s.part === part)
                  .map((s) => (
                    <Panel key={s.title} subject="Português" interactive className="ni-panel p-4">
                      <h3 className="font-semibold text-xs text-[var(--text)]">{s.title}</h3>
                      <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{s.description}</p>
                    </Panel>
                  ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1">Fórmula da Proposta de Intervenção</h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              Exigida no ENEM. Nas demais provas, siga o comando e os critérios vigentes; não imponha esta fórmula a todo gênero.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interventionFormula.map((el) => (
                <Panel key={el.letter} subject="Português" interactive className="ni-panel p-4 flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs font-mono"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' }}
                  >
                    {el.letter}
                  </span>
                  <div>
                    <h3 className="font-semibold text-xs text-[var(--text)]">{el.title}</h3>
                    <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{el.description}</p>
                  </div>
                </Panel>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1 flex items-center">
              <MessageSquareQuote className="w-4 h-4 mr-2 subject-text" />
              Repertório Sociocultural Produtivo
            </h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              A diferença entre um repertório que soma pontos e um que só ocupa espaço.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Panel subject="Biologia" className="ni-panel p-5">
                <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.productive.map((p, i) => (
                    <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                      <span className="mr-2 text-emerald-800 dark:text-emerald-300">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel subject="História" className="ni-panel p-5">
                <p className="text-xs font-semibold text-[#e08391] mb-2 flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Não-produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.nonProductive.map((p, i) => (
                    <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                      <span className="mr-2 text-[#e08391]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
            <Panel subject="Português" className="ni-panel p-4 mt-3">
              <p className="text-xs font-semibold text-[var(--text)] mb-2">Conectivos e frases de ligação prontas</p>
              <div className="flex flex-wrap gap-2">
                {repertoireGuidance.connectivePhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--primary) 18%, transparent)', color: 'var(--text)' }}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </Panel>
          </section>
        </div>
      )}

      {/* Boards Tab */}
      {tab === 'bancas' && (
        <section className="space-y-3">
          {essayBoardProfiles.map((b) => {
            const isExpanded = expandedBoard === b.board;
            return (
              <Panel key={b.board} subject="Português" className="ni-panel overflow-hidden">
                <button
                  onClick={() => setExpandedBoard(isExpanded ? null : b.board)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                >
                  <div className="min-w-0 flex items-center">
                    <h3 className="font-display font-medium text-sm text-[var(--text)] truncate">{b.board}</h3>
                    {b.uncertain && <AlertTriangle className="w-3.5 h-3.5 ml-2 text-amber-800 dark:text-amber-300 shrink-0" />}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[var(--line)] space-y-3">
                    {b.note && (
                      <div className="flex items-start p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-800 dark:text-amber-300" />
                        <p>{b.note}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-0.5">Formato</p>
                      <p className="text-xs text-[var(--dim)] leading-relaxed">{b.format}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-0.5">Pontuação</p>
                      <p className="text-xs text-[var(--dim)] leading-relaxed">{b.scoring}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-1">Critérios de correção</p>
                      <div className="space-y-1.5">
                        {b.criteria.map((c) => (
                          <div key={c.name} className="pl-3 border-l-2 border-[var(--primary)]/40">
                            <p className="text-xs font-medium text-[var(--text)]">{c.name}</p>
                            <p className="text-[11px] text-[var(--dim)]">{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#e08391] mb-1 flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1 text-[#e08391]" />
                        O que zera ou penaliza pesado
                      </p>
                      <ul className="space-y-1">
                        {b.zeroRules.map((r, i) => (
                          <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                            <span className="mr-2 text-[#e08391]">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)] flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 subject-text shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{b.keyToMaxScore}</p>
                    </div>
                  </div>
                )}
              </Panel>
            );
          })}
        </section>
      )}

      {/* Common Mistakes Tab */}
      {tab === 'erros' && (
        <section className="space-y-3">
          <p className="text-xs text-[var(--dim)] mb-2">
            Identifique qual problema aparece no seu texto e corrija o mecanismo. Penalidades e descritores dependem da proposta e do documento vigente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonMistakes.map((m) => (
              <Panel key={m.mistake} subject="Português" interactive className="ni-panel p-4">
                <h3 className="font-semibold text-xs text-[#e08391] flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#e08391]" />
                  {m.mistake}
                </h3>
                <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">{m.why}</p>
              </Panel>
            ))}
          </div>
        </section>
      )}

      {/* Checklist Tab */}
      {tab === 'checklist' && (
        <Panel subject="Português" className="ni-panel p-6">
          <EssayReviewAudit board={board} audit={audit} onChange={setAudit} />
        </Panel>
      )}
    </div>
  );
}
