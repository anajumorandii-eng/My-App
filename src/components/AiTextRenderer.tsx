import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { StudyParagraph } from './StudyParagraph';
import { Children, isValidElement } from 'react';
import { StudyVisual } from './StudyVisual';

const greek: Record<string, string> = { α: 'alpha', β: 'beta', γ: 'gamma', θ: 'theta', π: 'pi', φ: 'phi', ω: 'omega', λ: 'lambda', μ: 'mu', Δ: 'Delta', Σ: 'Sigma', Ω: 'Omega' };
function normalizeMathExpression(expression: string) {
  return expression.split(/(\\(?:text|textrm|textnormal|textbf|operatorname)\{(?:\\.|[^{}]|\{[^{}]*\})*\})/g).map((segment,index) => index%2 ? segment : [...segment].map(character => {
    const point = character.codePointAt(0)!;
    const normalized = point >= 0x1d400 && point <= 0x1d7ff ? character.normalize('NFKD') : character;
    return [...normalized].map(value => greek[value] ? '\\' + greek[value] + '{}' : value).join('');
  }).join('')).join('').replace(/\\\$/g, '\\textdollar{}');
}

// A IA às vezes usa delimitadores estilo MathJax (\[ \] e \( \)) em vez do
// $ $ / $$ $$ que o remark-math reconhece. Normalizamos antes de renderizar.
function normalizeMathDelimiters(text: string): string {
  // Code is literal: neither currency nor math delimiters may be rewritten there.
  return text.split(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`+[^`\n]*`+)/g)
    .map((part, index) => index % 2 ? part : part
      .replace(/(?<!\\)R\$(?=\s*\d)/g, 'R\\$')
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => '\n$$\n' + expr.trim() + '\n$$\n')
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, expr) => '$' + expr + '$')
      // Block delimiters must own their lines, otherwise the opening expression
      // can become fence metadata and swallow the following prose.
      .replace(/(?<!\\)\$\$([\s\S]*?)(?<!\\)\$\$/g, (_, expr) => '\n$$\n' + normalizeMathExpression(expr.trim()) + '\n$$\n')
      .replace(/(?<![\\$])\$((?:\\.|[^$\n])+?)(?<!\\)\$(?!\$)/g, (_, expr) => '$' + normalizeMathExpression(expr) + '$'))
    .join('');
}

export default function AiTextRenderer({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`min-w-0 max-w-full space-y-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          pre: ({ children }) => {
            const child = Children.toArray(children)[0];
            if (isValidElement<{ className?: string; children?: React.ReactNode }>(child) && child.props.className === 'language-study-visual') {
              return <StudyVisual source={String(child.props.children ?? '')} />;
            }
            return <pre className="overflow-x-auto whitespace-pre-wrap">{children}</pre>;
          },
          table: ({ children }) => (
            <div role="region" aria-label="Tabela de estudo" tabIndex={0}
              className="my-3 max-w-full overflow-x-auto rounded-lg border border-[var(--line)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <table className="w-full table-fixed border-collapse text-left text-sm leading-relaxed">{children}</table>
            </div>
          ),
          th: ({ children, style }) => (
            <th scope="col" style={style} className="border-b border-[var(--line)] bg-[var(--surface-secondary)] px-3 py-2 align-top font-semibold break-words [overflow-wrap:anywhere]">{children}</th>
          ),
          td: ({ children, style }) => (
            <td style={style} className="border-b border-[var(--line)] px-3 py-2 align-top break-words [overflow-wrap:anywhere]">{children}</td>
          ),
          p: StudyParagraph,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children, start }) => <ol start={start} className="list-decimal pl-5 space-y-1">{children}</ol>,
          h1: ({ children }) => <h3 data-heading-level="1" className="font-semibold text-base mt-3">{children}</h3>,
          h2: ({ children }) => <h3 data-heading-level="2" className="font-semibold text-base mt-3">{children}</h3>,
          h3: ({ children }) => <h4 data-heading-level="3" className="font-semibold mt-2">{children}</h4>,
          code: ({ children, className }) => (
            <code className={`${className ?? ''} px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[0.9em]`}>{children}</code>
          ),
        }}
      >
        {normalizeMathDelimiters(text)}
      </ReactMarkdown>
    </div>
  );
}
