import regular from '../assets/print/fonts/LiberationSerif-Regular.ttf?inline';
import bold from '../assets/print/fonts/LiberationSerif-Bold.ttf?inline';
import italic from '../assets/print/fonts/LiberationSerif-Italic.ttf?inline';
import boldItalic from '../assets/print/fonts/LiberationSerif-BoldItalic.ttf?inline';

// This is the face used by the Linux renderer's Times fallback. Bundle it so
// operating-system substitutions cannot change metrics or the final pagination.
export const printBodyFontStyles = [
  [regular, 400, 'normal'], [bold, 700, 'normal'],
  [italic, 400, 'italic'], [boldItalic, 700, 'italic'],
].map(([src, weight, style]) => `@font-face { font-family: 'Liberation Serif'; src: url('${src}') format('truetype'); font-weight: ${weight}; font-style: ${style}; font-display: block; }`).join('\n');
