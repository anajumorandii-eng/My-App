import { hasCorruptedApostilaText } from '../lib/apostilaTextQuality';
import { isStudyPacket, type StudyPacket } from '../lib/studySources';
import { Link } from 'react-router-dom';
import { SourceParagraphs } from './SourceParagraphs';
import { AiText } from './AiText';
import { replaceCorruptedApostilaSource } from '../lib/reviewedApostilaReferences';
export function StudySourcesPanel({ packet }: { packet: StudyPacket }) {
  if (!isStudyPacket(packet)) return <p className="text-sm">As fontes salvas precisam ser carregadas novamente para conferência.</p>;
  const sources = packet.sources.map(source => ({ source, replacement: replaceCorruptedApostilaSource(source, packet.chapter) }));
  return <section className="ni-panel p-4 space-y-3" aria-label="Fontes do estudo">
    <h3 data-heading-level="2" className="font-display text-lg">O que sustenta esta explicação</h3>
    <p className="text-xs text-[var(--dim)]">Os códigos F1, F2… identificam os materiais enviados à explicação. A cobertura abaixo descreve este recorte do banco; não estima frequência ou chance de cobrança.</p>
    {packet.coverage.length > 0 && <div className="overflow-x-auto"><table className="w-full text-xs text-left"><caption className="sr-only">Cobertura das questões por banca</caption><thead><tr><th>Banca</th><th>Questões no banco</th><th>Enunciados elegíveis</th><th>Enunciados no estudo</th></tr></thead><tbody>{packet.coverage.map(row => <tr key={row.board}><th className="py-2">{row.board}</th><td>{row.available}</td><td>{row.readable}</td><td>{row.included}</td></tr>)}</tbody></table></div>}
    <p className="text-xs text-[var(--dim)]">As contagens incluem questões cadastradas, não fichas analíticas ou resumos editoriais listados abaixo. Uma ficha pode orientar o estudo sem fornecer o enunciado completo.</p>
    <p className="text-xs text-[var(--dim)]">Questões com figuras e enunciados extensos permanecem na tela de questões. Sem origem identificada, um exercício não é apresentado como evidência de banca.</p>
    {sources.some(item => item.replacement) && <p role="status" className="text-sm">O texto da apostila foi corrigido neste guia salvo. Gere um novo aprofundamento para atualizar também a explicação que usou o texto antigo.</p>}
    {sources.length ? sources.map(item => {
      const source = item.replacement ?? item.source;
      return <details data-study-source key={source.id} className="border-t border-[var(--line)] pt-2">
        <summary className="cursor-pointer text-sm">[{source.id}] {source.title}{source.excerpt ? ' · recorte' : ''}</summary>
        <p data-source-reference className="text-xs mt-2">{source.kind === 'questao' ? 'Questão cadastrada com origem identificada.' : /ficha analítica|análise de questão/i.test(source.title + ' ' + source.content.slice(0, 100)) ? 'Ficha analítica; não contém o enunciado integral.' : 'Material de referência; não é questão integral.'} {source.excerpt ? 'Foi utilizado um recorte parcial.' : ''}</p>
        <div data-source-content>{hasCorruptedApostilaText(source.content)
          ? <p role="status" className="text-sm mt-3">Este recorte da apostila tem erros de extração e não pode ser conferido. É necessário refazer a extração do material original. Se este guia já foi gerado com o recorte, confira suas fórmulas e respostas na apostila.</p>
          : source.format === 'markdown' ? <AiText text={source.content} className="text-sm mt-3" /> : <SourceParagraphs text={source.content} />}</div>
        {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="text-xs underline">Conferir origem cadastrada</a>}
        {source.questionId && <Link to={`/questoes?topic=${encodeURIComponent(source.topicId ?? packet.topicId)}${source.board ? `&board=${encodeURIComponent(source.board)}` : ''}`} className="block text-xs underline mt-2">Abrir questões deste recorte</Link>}
      </details>;
    }) : <p className="text-sm">Ainda não há fonte elegível neste recorte. A explicação deve declarar essa lacuna; experimente outro capítulo ou consulte os materiais.</p>}
  </section>;
}
