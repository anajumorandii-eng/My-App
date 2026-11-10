import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';
import manual from '../../docs/MANUAL-CRIVO.md?raw';
import { StudyReaderButton } from '../components/StudyReaderButton';

// O manual mora em docs/ e é lido daqui, em vez de copiado para o código: com
// duas cópias, a do app e a do repositório deixariam de concordar na primeira
// tela que mudasse. O título sai do texto porque o cabeçalho da tela já o diz.
const semTitulo = manual.replace(/^# .*\n+/, '');
// O sumário fica só na tela: a Leitura Crivo monta o próprio índice lateral
// pelos títulos, e com os dois o leitor abria com a mesma lista repetida.
const [abertura, depoisDaAbertura = ''] = semTitulo.split(/\n(?=## Sumário\n)/);
const fimDoSumario = depoisDaAbertura.indexOf('\n---\n');
const sumario = fimDoSumario < 0 ? depoisDaAbertura : depoisDaAbertura.slice(0, fimDoSumario);
const corpo = fimDoSumario < 0 ? '' : depoisDaAbertura.slice(fimDoSumario);

// Mesmo critério de âncora do GitHub (acentos preservados), para que o sumário
// e as remissões do manual funcionem tanto aqui quanto no repositório.
const ancora = (texto: string) => texto.toLocaleLowerCase('pt-BR').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');
const textoDe = (filhos: ReactNode): string => Array.isArray(filhos) ? filhos.map(textoDe).join('') : typeof filhos === 'string' || typeof filhos === 'number' ? String(filhos) : filhos && typeof filhos === 'object' && 'props' in filhos ? textoDe((filhos as { props: { children?: ReactNode } }).props.children) : '';

export default function Ajuda() {
  const artigo = useRef<HTMLElement>(null);
  return <div className="ni-main space-y-4">
    <div className="ni-route"><span>Minha conta</span><i /><b>AJUDA</b></div>
    <div className="ni-title"><div><h1>Manual do CRIVO</h1><p>O que cada tela faz, quando usá-la e o que move o seu domínio.</p></div></div>
    <section className="ni-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3" aria-label="Formas de ler o manual">
      <p className="text-sm">Na Leitura Crivo o manual abre em página inteira, com índice das seções, ajuste de fonte e de cor e impressão em PDF.</p>
      <StudyReaderButton title="Manual do CRIVO" label="Ler na Leitura Crivo" getContent={() => artigo.current} />
    </section>
    <article ref={artigo} className="ni-panel crivo-manual min-w-0 space-y-3 px-5 py-5 leading-relaxed" data-print-topic="Manual do CRIVO" data-print-purpose="Manual de uso">
      <Markdown texto={abertura} />
      <nav aria-label="Sumário do manual" data-reader-exclude className="space-y-3"><Markdown texto={sumario} /></nav>
      <Markdown texto={corpo} />
    </article>
  </div>;
}

function Markdown({ texto }: { texto: string }) {
  return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 id={ancora(textoDe(children))} className="pt-4 text-xl font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 id={ancora(textoDe(children))} className="pt-2 text-lg font-semibold">{children}</h3>,
          h4: ({ children }) => <h4 className="font-semibold">{children}</h4>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>,
          a: ({ href, children }) => <a className="underline underline-offset-2" href={href}>{children}</a>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-[var(--action-primary)] bg-[var(--surface-secondary)] px-4 py-3">{children}</blockquote>,
          code: ({ children }) => <code className="rounded bg-[var(--surface-secondary)] px-1 text-[0.9em]">{children}</code>,
          hr: () => null,
          // Mesmo enquadramento das tabelas do AiTextRenderer: a rolagem
          // horizontal fica dentro da tabela, nunca na página do celular.
          table: ({ children }) => <div role="region" aria-label="Tabela do manual" tabIndex={0} className="my-3 max-w-full overflow-x-auto rounded-lg border border-[var(--line)]"><table className="w-full border-collapse text-left text-sm leading-relaxed">{children}</table></div>,
          th: ({ children }) => <th scope="col" className="border-b border-[var(--line)] bg-[var(--surface-secondary)] px-3 py-2 align-top font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b border-[var(--line)] px-3 py-2 align-top">{children}</td>,
        }}
      >{texto}</ReactMarkdown>;
}
