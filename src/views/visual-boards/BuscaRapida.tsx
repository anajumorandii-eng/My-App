import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, CornerDownLeft, Search } from 'lucide-react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { ambienteDoCapitulo, normalizar } from '../../lib/visualAmbiente';

const CHAVE_RECENTES = 'crivo_visual_recentes';
const MAX_RECENTES = 6;

/** Últimos capítulos abertos, do mais novo ao mais velho. */
export function lerRecentes(): string[] {
  try {
    const lista = JSON.parse(localStorage.getItem(CHAVE_RECENTES) ?? '[]');
    return Array.isArray(lista) ? lista.filter((id): id is string => typeof id === 'string') : [];
  } catch { return []; }
}

export function registrarRecente(id: string) {
  try {
    const lista = [id, ...lerRecentes().filter((item) => item !== id)].slice(0, MAX_RECENTES);
    localStorage.setItem(CHAVE_RECENTES, JSON.stringify(lista));
  } catch { /* sem armazenamento: a busca só não lembra os recentes */ }
}

/**
 * Todas as palavras digitadas precisam aparecer no capítulo, sem acento e em
 * qualquer ordem: "termo gases" acha "Termodinâmica: gases".
 */
// Índice montado uma vez: matéria, tópico e título, e à parte a visão geral e
// os títulos das seções. "mitose" não achava nada porque o capítulo se chama
// "Divisão Celular" — a palavra estava só no texto do capítulo.
let indice: { item: (typeof interactiveSummaries)[number]; cabeca: string; corpo: string }[] | null = null;
const montarIndice = () => (indice ??= interactiveSummaries.map((item) => ({
  item,
  cabeca: normalizar(`${item.subject} ${item.topic} ${item.title}`),
  corpo: normalizar(`${item.overview} ${item.sections.map((secao) => secao.title).join(' ')}`),
})));

export function buscarCapitulos(consulta: string, limite = 8) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (!termos.length) return [];
  return montarIndice()
    .map(({ item, cabeca, corpo }) => {
      const todos = `${cabeca} ${corpo}`;
      if (!termos.every((termo) => todos.includes(termo))) return null;
      const topico = normalizar(item.topic);
      // Tópico que começa com a busca, depois tópico que a contém, depois
      // matéria ou título, e por último quem só a tem no texto.
      const peso = topico.startsWith(termos[0]) ? 0 : topico.includes(termos[0]) ? 1 : termos.every((termo) => cabeca.includes(termo)) ? 2 : 3;
      return { item, peso };
    })
    .filter((resultado): resultado is { item: (typeof interactiveSummaries)[number]; peso: number } => resultado !== null)
    .sort((a, b) => a.peso - b.peso)
    .slice(0, limite)
    .map((resultado) => resultado.item);
}

/**
 * Busca rápida (⌘K / Ctrl+K), o atalho de paleta de comandos dos sites de
 * referência. Pula direto para qualquer capítulo sem voltar à biblioteca.
 * Sem texto, mostra os capítulos abertos por último. Cada resultado traz o
 * ponto na cor do próprio capítulo — a mesma do ambiente que vai abrir.
 */
export interface AtalhoTela { rotulo: string; destino: string }

/** Telas do app cujo nome casa com a busca: "caderno" leva ao Caderno de Erros. */
export function buscarTelas(consulta: string, telas: AtalhoTela[], limite = 3) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean);
  if (!termos.length) return [];
  return telas.filter((tela) => termos.every((termo) => normalizar(tela.rotulo).includes(termo))).slice(0, limite);
}

export { BotaoBuscar } from '../../components/BotaoBuscar';

export function BuscaRapida({ aberta, onFechar, onAbrir, telas = [], onIrParaTela }: {
  aberta: boolean;
  onFechar: () => void;
  onAbrir: (id: string) => void;
  /** Telas do app que a busca também encontra. */
  telas?: AtalhoTela[];
  onIrParaTela?: (destino: string) => void;
}) {
  const [consulta, setConsulta] = useState('');
  const [ativo, setAtivo] = useState(0);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!aberta) return;
    setConsulta(''); setAtivo(0);
    const id = window.setTimeout(() => campo.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [aberta]);

  const telasAchadas = useMemo(() => (consulta.trim() ? buscarTelas(consulta, telas) : []), [consulta, telas]);
  const resultados = useMemo(() => {
    if (consulta.trim()) return buscarCapitulos(consulta);
    const recentes = lerRecentes();
    return recentes.map((id) => interactiveSummaries.find((item) => item.id === id)).filter((item): item is (typeof interactiveSummaries)[number] => Boolean(item));
    // `aberta` entra na dependência para os recentes serem relidos a cada abertura.
  }, [consulta, aberta]);

  if (!aberta) return null;

  // Uma lista só para o teclado: primeiro as telas, depois os capítulos.
  const itens: ({ tipo: 'tela'; tela: AtalhoTela } | { tipo: 'capitulo'; capitulo: (typeof resultados)[number] })[] = [
    ...telasAchadas.map((tela) => ({ tipo: 'tela' as const, tela })),
    ...resultados.map((capitulo) => ({ tipo: 'capitulo' as const, capitulo })),
  ];
  const abrir = (id: string) => { onAbrir(id); onFechar(); };
  const escolher = (indice: number) => {
    const item = itens[indice];
    if (!item) return;
    if (item.tipo === 'tela') { onIrParaTela?.(item.tela.destino); onFechar(); } else abrir(item.capitulo.id);
  };
  const tecla = (evento: React.KeyboardEvent) => {
    if (evento.key === 'Escape') { evento.preventDefault(); onFechar(); }
    else if (evento.key === 'ArrowDown') { evento.preventDefault(); setAtivo((i) => Math.min(i + 1, itens.length - 1)); }
    else if (evento.key === 'ArrowUp') { evento.preventDefault(); setAtivo((i) => Math.max(i - 1, 0)); }
    else if (evento.key === 'Enter' && itens[ativo]) { evento.preventDefault(); escolher(ativo); }
  };
  const idItem = (indice: number) => { const item = itens[indice]; return item ? (item.tipo === 'tela' ? `vs-busca-tela-${indice}` : `vs-busca-${item.capitulo.id}`) : undefined; };

  return (
    <div className="vs-busca-fundo" onPointerDown={(evento) => { if (evento.target === evento.currentTarget) onFechar(); }}>
      <div className="vs-busca" role="dialog" aria-modal="true" aria-label="Buscar capítulo" onKeyDown={tecla}>
        <label className="vs-busca-campo">
          <Search aria-hidden="true" />
          <input
            ref={campo}
            value={consulta}
            onChange={(evento) => { setConsulta(evento.target.value); setAtivo(0); }}
            placeholder="Buscar capítulo ou tela — órbitas, mitose, caderno…"
            aria-label="Buscar capítulo"
            role="combobox"
            aria-expanded={itens.length > 0}
            aria-controls="vs-busca-lista"
            aria-activedescendant={idItem(ativo)}
          />
          <kbd>Esc</kbd>
        </label>
        {!consulta.trim() && resultados.length > 0 && <p className="vs-busca-grupo"><Clock aria-hidden="true" /> Abertos por último</p>}
        <ul id="vs-busca-lista" role="listbox" aria-label="Resultados">
          {telasAchadas.map((tela, indice) => (
            <li key={tela.destino} id={idItem(indice)} role="option" aria-selected={indice === ativo} onPointerEnter={() => setAtivo(indice)} onClick={() => escolher(indice)}>
              <span className="vs-busca-ponto vs-busca-ponto--tela" aria-hidden="true" />
              <span className="vs-busca-texto"><small>Tela</small><b>{tela.rotulo}</b></span>
              {indice === ativo && <CornerDownLeft className="vs-busca-enter" aria-hidden="true" />}
            </li>
          ))}
          {resultados.map((item, posicao) => { const indice = telasAchadas.length + posicao; return (
            <li
              key={item.id}
              id={idItem(indice)}
              role="option"
              aria-selected={indice === ativo}
              onPointerEnter={() => setAtivo(indice)}
              onClick={() => abrir(item.id)}
            >
              <span className="vs-busca-ponto" aria-hidden="true" style={{ background: ambienteDoCapitulo(item).paleta.a, boxShadow: `0 0 10px ${ambienteDoCapitulo(item).paleta.a}` }} />
              <span className="vs-busca-texto">
                <small>{item.subject}</small>
                <b>{item.topic}</b>
              </span>
              {indice === ativo && <CornerDownLeft className="vs-busca-enter" aria-hidden="true" />}
            </li>
          ); })}
        </ul>
        {consulta.trim() && itens.length === 0 && <p className="vs-busca-vazio" role="status">Nada encontrado com esses termos.</p>}
        {!consulta.trim() && resultados.length === 0 && <p className="vs-busca-vazio">Digite para buscar entre os {interactiveSummaries.length} capítulos.</p>}
        <p className="vs-busca-rodape"><kbd>↑</kbd><kbd>↓</kbd> navegar <kbd>↵</kbd> abrir <kbd>Esc</kbd> fechar</p>
      </div>
    </div>
  );
}

export default BuscaRapida;
