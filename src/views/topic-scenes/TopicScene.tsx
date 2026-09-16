import React from 'react';
import { sceneFor } from './sceneFor';
import { ContrasteDePosicoes } from './families/ContrasteDePosicoes';
import { EscalaDeGraus } from './families/EscalaDeGraus';
import { CadeiaDeDerivacao } from './families/CadeiaDeDerivacao';
import { CamadasDeDeterminacao } from './families/CamadasDeDeterminacao';
import { MovimentoDialetico } from './families/MovimentoDialetico';
import { Tipologia } from './families/Tipologia';
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
  const Familia = FAMILIAS[entry.family];
  return <Familia entry={entry} />;
}
