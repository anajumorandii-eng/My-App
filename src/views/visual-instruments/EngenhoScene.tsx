import React from 'react';
import { ExceptionalHumanitiesDrawing, ExceptionalSceneWindow } from './ExceptionalHumanitiesIllustration';

export function EngenhoScene({ index, label }: { index: number; label: string }) {
  return <ExceptionalSceneWindow label="Percorrer a sociedade colonial açucareira"><svg className="vs-plane ehi-illustration" viewBox="0 0 700 420" role="img" aria-label={`Além do canavial: a sociedade colonial açucareira: ${label} em foco`} data-history-phase="dinamica-interna-colonizacao"><ExceptionalHumanitiesDrawing kind="engenho" index={index}/></svg></ExceptionalSceneWindow>;
}
