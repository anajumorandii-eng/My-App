import { FuvestDepthPanel } from '../components/FuvestDepthPanel';
import { PriorityStudyPanel } from '../components/PriorityStudyPanel';
import React, { useMemo, useState } from 'react';
import { ExamEvidencePanel } from '../components/ExamEvidencePanel';
import { literaryWorks } from '../data/literaryWorks';
import { Target, ChevronDown, BookOpen, AlertTriangle } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';
import { useAmbienteDaTela } from './visual-boards/ambiente';
import { ambienteDaMateria } from '../lib/visualAmbiente';

export default function Prioridades() {
  const subjects = useMemo(() => ['Biologia', 'Matemática', 'Física', 'Química', 'Geografia', 'História', 'Língua Portuguesa', 'Língua Inglesa', 'Literatura', 'Redação', 'Filosofia', 'Sociologia', 'Arte', 'Educação Física'], []);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [expandedWork, setExpandedWork] = useState<string | null>(null);


  // Map subject name to matching palette key
  const paletteKey = activeSubject === 'Língua Portuguesa' ? 'Português' : activeSubject;
  const currentPalette = PALETTES[paletteKey] ?? PALETTES.Matemática;
  const SubjIcon = SUBJECT_ICONS[paletteKey] ?? Target;
  // A cor da tela segue a matéria em foco pelo ambiente do app, em vez da
  // paleta que antes ficava fixa no contêiner e vencia o ambiente.
  const materiaDoAmbiente = paletteKey;
  const ambiente = useMemo(() => (materiaDoAmbiente ? ambienteDaMateria(materiaDoAmbiente) : null), [materiaDoAmbiente]);
  useAmbienteDaTela(ambiente);

  return (
    <div className="ni-main">
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>ANÁLISE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--action-primary)] text-[var(--text-inverse)]">
            <SubjIcon className="w-3 h-3" />
          </span>
          INCIDÊNCIA
        </span>
        <i />
        <b>PRIORIDADES POR VESTIBULAR</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Foque onde o retorno é maior.</h1>
          <p>Escolha o que estudar, entenda a recomendação e transforme a prioridade em resolução e revisão.</p>
        </div>
        <div className="ni-state">
          <i /> {activeSubject} · Evidências de cobrança
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="ni-subjects">
        {subjects.map((subject) => {
          const active = activeSubject === subject;
          const key = subject === 'Língua Portuguesa' ? 'Português' : subject;
          const subPal = PALETTES[key] ?? PALETTES.Matemática;
          const Icon = SUBJECT_ICONS[key] ?? Target;
          return (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              style={
                active
                  ? { backgroundColor: subPal.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                  : { display: 'inline-flex', alignItems: 'center', gap: '6px' }
              }
            >
              <Icon className="w-3 h-3" style={{ color: active ? PALETTE_INK : subPal.primary }} />
              <span>{subject}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <FuvestDepthPanel key={`depth-${activeSubject}`} subject={activeSubject} />
        {!['Arte', 'Educação Física'].includes(activeSubject) && <PriorityStudyPanel key={activeSubject} subject={activeSubject} />}
        <ExamEvidencePanel key={`evidence:${activeSubject}`} subject={activeSubject} />

        {/* Required reading section for Portuguese */}
        {activeSubject === 'Língua Portuguesa' && (
          <section className="mt-4">
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 subject-text" />
              Obras de leitura obrigatória
            </h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              Fuvest e Unicamp cobram obras literárias com peso decisivo na nota de Português.
            </p>
            <div className="space-y-4">
              {literaryWorks.map((list) => (
                <div key={list.board}>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-display font-medium text-xs text-[var(--text)]">{list.board}</h3>
                    <span className="text-[11px] font-mono text-[var(--dim)]">{list.cycle}</span>
                  </div>
                  {list.note && (
                    <div className="flex items-start p-2.5 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-400" />
                      <p>{list.note}</p>
                    </div>
                  )}
                  <Panel subject="Literatura" className="ni-panel divide-y divide-[var(--line)] overflow-hidden">
                    {list.works.map((work) => {
                      const key = `${list.board}_${work.title}`;
                      const isExpanded = expandedWork === key;
                      return (
                        <div key={key}>
                          <button
                            onClick={() => setExpandedWork(isExpanded ? null : key)}
                            className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[var(--surface2)] transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-xs text-[var(--text)] truncate">{work.title}</p>
                              <p className="text-[11px] text-[var(--dim)] mt-0.5">{work.author} • {work.movement}</p>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-3 text-xs text-[var(--dim)] leading-relaxed">
                              {work.examAngle}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Panel>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
