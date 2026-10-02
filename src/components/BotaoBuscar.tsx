import { Search } from 'lucide-react';

/** Botão da busca rápida, com o atalho à vista para quem usa teclado. */
export function BotaoBuscar({ onBuscar, compacto }: { onBuscar: () => void; compacto?: boolean }) {
  return (
    <button type="button" className={`vs-acao-topo${compacto ? ' vs-acao-topo--compacto' : ''}`} onClick={onBuscar} aria-label={compacto ? 'Buscar' : undefined} aria-keyshortcuts="Meta+K Control+K">
      <Search aria-hidden="true" />
      {!compacto && <><span>Buscar</span><kbd aria-hidden="true">⌘K</kbd></>}
    </button>
  );
}
