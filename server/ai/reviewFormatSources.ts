import type { StudySource } from '../../src/lib/studySources';
const formats: Record<string, { cycle: string; url: string; description: string }> = {
  FUVEST: { cycle: '2027', url: 'https://www.fuvest.br/arquivos/vestibular/fuvest2027-guia-provas.pdf', description: 'Guia de Provas: primeira fase de múltipla escolha; segunda fase com questões discursivas. Componentes da segunda fase dependem da carreira e do dia; não suponha toda matéria em toda carreira.' },
  UNICAMP: { cycle: '2027', url: 'https://www.comvest.unicamp.br/wp-content/uploads/2026/07/VU2027-Manual-do-Ingresso.pdf', description: 'Manual do Ingresso: primeira fase objetiva; segunda fase dissertativa, com componentes comuns e específicos por área. Medicina integra Ciências Biológicas/Saúde.' },
  UNESP: { cycle: '2027', url: 'https://documento.vunesp.com.br/documento/stream/Nzg4ODEzMw%3d%3d', description: 'Manual do Candidato republicado em 24/09/2026: primeira fase de Conhecimentos Gerais com questões objetivas; segunda fase com questões discursivas e redação. Não confundir segunda fase com um segundo dia de prova objetiva.' },
  FAMERP: { cycle: '2027', url: 'https://documento.vunesp.com.br/documento/stream/Nzg2MzQ2NA%3d%3d', description: 'Edital de abertura, capítulo VIII: Conhecimentos Gerais com objetivas dos oito componentes; Conhecimentos Específicos com dissertativas de Biologia, Química e Física, e redação. São provas/componentes, sem chamar os dois dias de primeira e segunda fases eliminatórias. Matemática não integra as específicas deste ciclo.' },
  UNIFESP: { cycle: '2027 — Medicina, sistema misto', url: 'https://documento.vunesp.com.br/documento/stream/NzkxNzM1OA%3d%3d', description: 'Edital 723/2026, itens 1.2.1 e 5.1–5.3: parte objetiva do ENEM 2026 + provas complementares. Complementares: Português/Inglês de múltipla escolha e redação; Conhecimentos Específicos analítico-expositivos de Biologia, Química, Física e Matemática. Não chamar ENEM de primeira fase própria nem toda complementar de discursiva; não transpor para outras modalidades/cursos.' },
  ENEM: { cycle: '2026', url: 'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/perguntas-frequentes', description: 'Orientações do Inep: exame com provas objetivas por áreas e redação, aplicado em dias distintos. Os dias não são fases seletivas. Na revisão disciplinar, treine questões objetivas; redação somente se selecionada como conteúdo.' },
};
export function reviewFormatSources(boards: string[]): StudySource[] {
  return boards.flatMap((board, index) => {
    const format = formats[board];
    return format ? [{ id: `R${index+1}`, title: `Formato oficial · ${board} · ${format.cycle}`, kind: 'resumo' as const, content: `Paráfrase do documento oficial consultado em 23/10/2026, não prova de incidência nem de padrão temático. Escopo do ciclo ${format.cycle}; não inferir regras de edições posteriores.\n${format.description}`, excerpt: true, board, url: format.url }] : [];
  });
}
