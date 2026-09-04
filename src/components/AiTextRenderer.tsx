import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
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
    <div className={`space-y-2 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
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
