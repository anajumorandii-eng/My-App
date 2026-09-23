import React from 'react';
import { sceneFor } from './sceneFor';
import { ContrasteDePosicoes } from './families/ContrasteDePosicoes';
import { EscalaDeGraus } from './families/EscalaDeGraus';
import { CadeiaDeDerivacao } from './families/CadeiaDeDerivacao';
import { CamadasDeDeterminacao } from './families/CamadasDeDeterminacao';
import { MovimentoDialetico } from './families/MovimentoDialetico';
import { Tipologia } from './families/Tipologia';
import { QuimicaTipologia } from './families/QuimicaTipologia';
import { ORGANIC_SCENE_IDS, QuimicaOrganica } from './families/QuimicaOrganica';
import { BIOLOGY_PHYSIOLOGY_SCENE_IDS, BiologiaFisiologia } from './families/BiologiaFisiologia';
import { BIOLOGY_PROCESS_IDS, BiologiaProcessos } from './families/BiologiaProcessos';
import { PHYSICS_MECHANISM_IDS, FisicaMecanismos } from './families/FisicaMecanismos';
import { LINGUAGENS_LITERATURA_SCENE_IDS, LinguagensLiteratura } from './families/LinguagensLiteratura';
import { CriteriosConjuntivos } from './families/CriteriosConjuntivos';
import { GradeDeEixos } from './families/GradeDeEixos';
import type { SceneEntry, SceneFamily } from './types';

const FAMILIAS: Record<SceneFamily, React.ComponentType<{ entry: SceneEntry }>> = {
  'contraste-de-posicoes': ContrasteDePosicoes,
  'escala-de-graus': EscalaDeGraus,
  'cadeia-de-derivacao': CadeiaDeDerivacao,
  'camadas-de-determinacao': CamadasDeDeterminacao,
  'movimento-dialetico': MovimentoDialetico,
  'tipologia': Tipologia,
  'criterios-conjuntivos': CriteriosConjuntivos,
  'grade-de-eixos': GradeDeEixos,
};

export function TopicScene({ summaryId }: { summaryId: string }) {
  const entry = sceneFor(summaryId);
  if (!entry) return null;
  const quimicaGeometrica = entry.chapterId === 'summary-quimica-geometria-molecular';
  const Familia = BIOLOGY_PHYSIOLOGY_SCENE_IDS.has(entry.chapterId)
    ? BiologiaFisiologia
    : BIOLOGY_PROCESS_IDS.has(entry.chapterId)
      ? BiologiaProcessos
    : PHYSICS_MECHANISM_IDS.has(entry.chapterId)
      ? FisicaMecanismos
    : LINGUAGENS_LITERATURA_SCENE_IDS.has(entry.chapterId)
      ? LinguagensLiteratura
    : ORGANIC_SCENE_IDS.has(entry.chapterId)
      ? QuimicaOrganica
      : quimicaGeometrica
        ? QuimicaTipologia
        : FAMILIAS[entry.family];
  return (
    <div className="vs-handdrawn-container">
      <Familia entry={entry} />
    </div>
  );
}
