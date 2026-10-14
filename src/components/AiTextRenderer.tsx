import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// A IA às vezes usa delimitadores estilo MathJax (\[ \] e \( \)) em vez do
// $ $ / $$ $$ que o remark-math reconhece. Normalizamos antes de renderizar.
function normalizeMathDelimiters(text: string): string {
  return text
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, expr) => `$$${expr}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, expr) => `$${expr}$`);
}

export default function AiTextRenderer({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`min-w-0 max-w-full space-y-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          table: ({ children }) => (
            <div role="region" aria-label="Tabela de estudo" tabIndex={0}
              className="my-3 max-w-full overflow-x-auto rounded-lg border border-[var(--line)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm leading-relaxed">{children}</table>
            </div>
          ),
          th: ({ children, style }) => (
            <th scope="col" style={style} className="border-b border-[var(--line)] bg-[var(--surface-secondary)] px-3 py-2 align-top font-semibold">{children}</th>
          ),
          td: ({ children, style }) => (
            <td style={style} className="border-b border-[var(--line)] px-3 py-2 align-top">{children}</td>
          ),
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1">{children}</ol>,
          h1: ({ children }) => <h3 className="font-semibold text-base mt-3">{children}</h3>,
          h2: ({ children }) => <h3 className="font-semibold text-base mt-3">{children}</h3>,
          h3: ({ children }) => <h4 className="font-semibold mt-2">{children}</h4>,
          code: ({ children }) => (
            <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[0.9em]">{children}</code>
          ),
        }}
      >
        {normalizeMathDelimiters(text)}
      </ReactMarkdown>
    </div>
  );
}
