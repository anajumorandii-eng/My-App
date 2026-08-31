import type { Transition, Variants } from 'motion/react';
import { FieldType, getSubjectProfile } from './crivoSubjects';

export interface SubjectMotionConfig {
  containerVariants: Variants;
  itemVariants: Variants;
  hoverProps: {
    whileHover: Record<string, any>;
    whileTap: Record<string, any>;
    transition: Transition;
  };
  tabTransition: Transition;
}

export function getMotionConfigForSubject(subject?: string): SubjectMotionConfig {
  const profile = getSubjectProfile(subject);
  return getMotionConfigForFieldType(profile.fieldType);
}

export function getMotionConfigForFieldType(fieldType: FieldType): SubjectMotionConfig {
  switch (fieldType) {
    case 'grid':
    case 'lenses':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.02 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, scale: 0.96, y: 8 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 420, damping: 28 },
          },
        },
        hoverProps: {
          whileHover: { y: -3, scale: 1.015 },
          whileTap: { scale: 0.98 },
          transition: { type: 'spring', stiffness: 500, damping: 25 },
        },
        tabTransition: { type: 'spring', stiffness: 450, damping: 30 },
      };

    case 'chamber':
    case 'social':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.07, delayChildren: 0.04 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          },
        },
        hoverProps: {
          whileHover: { y: -4, scale: 1.01 },
          whileTap: { scale: 0.97 },
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        },
        tabTransition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      };

    case 'organic':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.03 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, scale: 0.92 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 360, damping: 22 },
          },
        },
        hoverProps: {
          whileHover: { scale: 1.02, y: -2 },
          whileTap: { scale: 0.96 },
          transition: { type: 'spring', stiffness: 400, damping: 20 },
        },
        tabTransition: { type: 'spring', stiffness: 350, damping: 24 },
      };

    case 'paired':
    case 'dialectic':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, x: -12, y: 4 },
          visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          },
        },
        hoverProps: {
          whileHover: { x: 3, y: -2 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        },
        tabTransition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      };

    case 'syntax':
    case 'argument':
    case 'semantic':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.02 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
          },
        },
        hoverProps: {
          whileHover: { y: -2 },
          whileTap: { scale: 0.99 },
          transition: { duration: 0.18 },
        },
        tabTransition: { duration: 0.28, ease: 'easeInOut' },
      };

    case 'layer':
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.03 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, x: 14 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          },
        },
        hoverProps: {
          whileHover: { y: -3, scale: 1.01 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.22 },
        },
        tabTransition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
      };

    case 'topography':
    case 'pulse':
    case 'neutral':
    default:
      return {
        containerVariants: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.02 },
          },
        },
        itemVariants: {
          hidden: { opacity: 0, y: 8 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.32, ease: 'easeOut' },
          },
        },
        hoverProps: {
          whileHover: { y: -3, scale: 1.01 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2 },
        },
        tabTransition: { duration: 0.25, ease: 'easeOut' },
      };
  }
}
