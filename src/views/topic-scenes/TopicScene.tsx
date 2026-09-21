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
  const Familia = ORGANIC_SCENE_IDS.has(entry.chapterId)
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
