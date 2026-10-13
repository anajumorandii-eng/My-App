import config from './playwright.visual-refinement.config';
export default { ...config, testMatch: ['visual-recovery.spec.ts', 'visual-refinement-continuation.spec.ts'] };
