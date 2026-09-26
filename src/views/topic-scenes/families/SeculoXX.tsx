import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { Scene } from './cenaKit';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}
void motion; void usePaced;

export const SCENES_LOTE8: Record<string, React.ComponentType<Scene>> = {};
export const HEADERS_LOTE8: Record<string, string> = {};
