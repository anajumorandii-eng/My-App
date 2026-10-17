import { isStudyPacket, type StudyPacket } from '../lib/studySources';
import { Link } from 'react-router-dom';
export function StudySourcesPanel({ packet }: { packet: StudyPacket }) {
  if (!isStudyPacket(packet)) return <p className="text-sm">As fontes salvas precisam ser carregadas novamente para conferência.</p>;
  return <section className="ni-panel p-4 space-y-3" aria-label="Fontes do estudo">
    <h3 className="font-display text-lg">O que sustenta esta explicação</h3>
    <p className="text-xs text-[var(--dim)]">Os códigos F1, F2… identificam os materiais enviados à explicação. A cobertura abaixo descreve este recorte do banco; não estima frequência ou chance de cobrança.</p>
    {packet.coverage.length > 0 && <div className="overflow-x-auto"><table className="w-full text-xs text-left"><caption className="sr-only">Cobertura das questões por banca</caption><thead><tr><th>Banca</th><th>No recorte</th><th>Textuais elegíveis</th><th>No estudo</th></tr></thead><tbody>{packet.coverage.map(row => <tr key={row.board}><th className="py-2">{row.board}</th><td>{row.available}</td><td>{row.readable}</td><td>{row.included}</td></tr>)}</tbody></table></div>}
    <p className="text-xs text-[var(--dim)]">Questões com figuras e enunciados extensos permanecem na tela de questões. Sem origem identificada, um exercício não é apresentado como evidência de banca.</p>
    {packet.sources.length ? packet.sources.map(source => <details key={source.id} className="border-t border-[var(--line)] pt-2"><summary className="cursor-pointer text-sm">[{source.id}] {source.title}{source.excerpt ? ' · recorte' : ''}</summary><p className="text-sm whitespace-pre-wrap leading-relaxed mt-3">{source.content}</p>{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="text-xs underline">Conferir origem cadastrada</a>}{source.questionId && <Link to={`/questoes?topic=${encodeURIComponent(source.topicId ?? packet.topicId)}${source.board ? `&board=${encodeURIComponent(source.board)}` : ''}`} className="block text-xs underline mt-2">Abrir questões deste recorte</Link>}</details>) : <p className="text-sm">Ainda não há fonte elegível neste recorte. A explicação deve declarar essa lacuna; experimente outro capítulo ou consulte os materiais.</p>}
  </section>;
}
