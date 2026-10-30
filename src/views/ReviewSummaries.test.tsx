import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ auth: { user: null as null | { uid: string } }, generate: vi.fn(), loadGuides: vi.fn(async () => ({})), saveGuide: vi.fn(async () => {}), packet: vi.fn(), history: { errors: [] as unknown[], loading: false, warning: '' } }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => mocks.auth }));
vi.mock('../hooks/useErrorReviewHistory', () => ({ useErrorReviewHistory: () => mocks.history }));
vi.mock('../lib/literaryCatalog', () => ({ getLiteraryWorks: async () => [{id:'bras',slug:'bras-cubas',title:'Memórias póstumas de Brás Cubas',author:'Machado de Assis'}] }));
vi.mock('../components/DeepeningPdf', () => ({ DeepeningPdf: ({autoGenerate, generateCover}: {autoGenerate: boolean; generateCover: boolean}) => <div data-testid="review-pdf" data-auto={String(autoGenerate)} data-cover={String(generateCover)}>Exportação CRIVO</div> }));
vi.mock('../hooks/useStudyTargets', () => ({ useStudyTargets: () => ({ targets: [{ board: 'FUVEST' }] }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: mocks.generate, AiRequestError: class extends Error {} }));
vi.mock('../lib/loadStudyPacket', () => ({ loadStudyPacket: mocks.packet }));
vi.mock('../lib/strategyGuides', async () => ({ ...await vi.importActual('../lib/strategyGuides'), loadStrategyGuides: mocks.loadGuides, saveStrategyGuide: mocks.saveGuide }));
vi.mock('../components/AiText', () => ({ AiText: ({ text }: { text: string }) => <div>{text}</div> }));
import ReviewSummaries from './ReviewSummaries';
import { cacheStrategyGuides, readStrategyGuides } from '../lib/strategyGuides';
const mount = () => render(<MemoryRouter><ReviewSummaries /></MemoryRouter>);

it('permite excluir uma revisão antiga e gerar uma nova sem apagar aprofundamentos', async () => {
  const old = { key: 'review-old', kind: 'review-summary' as const, subject: 'Biologia', topicId: 'bio', topicName: 'Revisão antiga', chapter: '', board: '', text: 'Texto antigo', savedAt: '2025-01-01T00:00:00Z' };
  cacheStrategyGuides(null, { 'review-old': old, deep: { ...old, key: 'deep', kind: undefined, text: 'Aprofundamento preservado' } });
  mount();
  fireEvent.click(screen.getByRole('button', { name: 'Excluir material: Revisão antiga' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  await waitFor(() => expect(screen.getByText('Meus resumos de revisão (0)')).toBeInTheDocument());
  expect(readStrategyGuides(null).deep.text).toBe('Aprofundamento preservado');
  fireEvent.click(screen.getByRole('button', { name: 'Gerar resumo de revisão' }));
  await waitFor(() => expect(screen.getByText('Meus resumos de revisão (1)')).toBeInTheDocument());
});
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); mocks.auth.user = null; mocks.generate.mockReset(); mocks.saveGuide.mockClear();
  mocks.loadGuides.mockResolvedValue({});
  mocks.history.errors = []; mocks.history.loading = false;
  mocks.packet.mockResolvedValue({ topicId: 'mat_aritmetica_proporcionalidade', chapter: '', coverage: [], sources: [{ id: 'F1', title: 'Conceitos', kind: 'resumo', content: 'Proporções', excerpt: true }], referenceText: '[F1] Proporções' });
  mocks.generate.mockResolvedValue({ text: 'Síntese de revisão conferida\n## Recuperação ativa\n1. Explique.\n## Revisão de última hora\nLembre.\n## Gabarito da recuperação ativa\n1. Resposta separada.' });
});
afterEach(cleanup);
it('permite revisão geral e gera com o recorte e as fontes, salvando separadamente', async () => {
  mount();
  expect(screen.getByRole('button', { name: 'Gerar resumo de revisão' })).toBeEnabled();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Fuvest' }));
  fireEvent.click(screen.getByLabelText('Porcentagem'));
  fireEvent.click(screen.getByRole('button', { name: 'Gerar resumo de revisão' }));
  await waitFor(() => expect(mocks.generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ subject: 'Matemática', chapter: 'Porcentagem', targetBoards: ['FUVEST'], guideMode: 'review-summary', referenceText: '[F1] Proporções' }), expect.any(Function)));
  expect(await screen.findByText(/Síntese de revisão conferida/)).toBeInTheDocument();
  await waitFor(() => expect(Object.values(readStrategyGuides(null))).toHaveLength(1));
  expect(Object.values(readStrategyGuides(null))[0]).toMatchObject({ kind: 'review-summary', chapter: 'Porcentagem', board: 'FUVEST' });
  expect(screen.getByText('Meus resumos de revisão (1)')).toBeInTheDocument();
  expect(await screen.findByTestId('review-pdf')).toHaveAttribute('data-auto','true');
  expect(screen.getByTestId('review-pdf')).toHaveAttribute('data-cover','true');
  fireEvent.click(screen.getByRole('button', { name: 'Configurar nova revisão' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Unicamp/Comvest' }));
  expect(screen.queryByText(/Síntese de revisão conferida/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: /Porcentagem · FUVEST/ }));
  expect(screen.getByText(/Síntese de revisão conferida/)).toBeInTheDocument();
});
it('salva na conta e retoma a biblioteca após remontar sem misturar aprofundamentos', async () => {
  mocks.auth.user = { uid: 'A' };
  cacheStrategyGuides('A', { old: { key: 'old', subject: 'Biologia', topicId: 'bio_ecologia', topicName: 'Guia profundo', chapter: '', board: 'FUVEST', text: 'Aprofundamento preservado', savedAt: '2026-10-20T12:00:00Z' } });
  const first = mount();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Fuvest' }));
  fireEvent.click(screen.getByRole('button', { name: 'Gerar resumo de revisão' }));
  await waitFor(() => expect(mocks.saveGuide).toHaveBeenCalledWith('A', expect.objectContaining({ kind: 'review-summary' })));
  expect(screen.queryByText('Guia profundo')).toBeNull();
  expect(readStrategyGuides('A').old.text).toBe('Aprofundamento preservado');
  first.unmount(); mount();
  expect(screen.getByText('Meus resumos de revisão (1)')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Aritmética e Proporcionalidade · FUVEST/ }));
  expect(screen.getByText(/Síntese de revisão conferida/)).toBeInTheDocument();
  expect(await screen.findByTestId('review-pdf')).toHaveAttribute('data-auto','false');
});
it('falha da IA não apaga resumos e não salva uma resposta parcial', async () => {
  mocks.generate.mockImplementation(async (_task, _payload, onDelta) => { onDelta('Rascunho incompleto'); throw new Error('offline'); });
  mount();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Fuvest' }));
  fireEvent.click(screen.getByRole('button', { name: 'Gerar resumo de revisão' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível gerar');
  expect(screen.getByText('Rascunho incompleto')).toBeInTheDocument();
  expect(Object.keys(readStrategyGuides(null))).toHaveLength(0);
});
it('troca de conta durante a geração não exibe nem salva a resposta da conta anterior', async () => {
  let complete!: (value: { text: string }) => void;
  mocks.generate.mockImplementation(() => new Promise(resolve => { complete = resolve; }));
  mocks.auth.user = { uid: 'A' };
  const first = mount();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Fuvest' }));
  fireEvent.click(screen.getByRole('button', { name: 'Gerar resumo de revisão' }));
  await waitFor(() => expect(mocks.generate).toHaveBeenCalled());
  mocks.auth.user = { uid: 'B' };
  first.rerender(<MemoryRouter><ReviewSummaries /></MemoryRouter>);
  await act(async () => complete({ text: 'Resumo exclusivo de A' }));
  expect(screen.queryByText('Resumo exclusivo de A')).toBeNull();
  expect(mocks.saveGuide).not.toHaveBeenCalled();
});
it('seleções múltiplas, fase, profundidade e histórico chegam à geração e são retomados', async () => {
  mocks.history.errors = [{id:'err',topicId:'mat_aritmetica_proporcionalidade',questionId:'q',date:'2026-10-20',type:'unknown',notes:'Troquei a razão',confidence:'baixa'}];
  mount();
  fireEvent.click(screen.getByRole('checkbox',{name:'Unicamp/Comvest'}));
  fireEvent.click(screen.getByRole('checkbox',{name:'ENEM/Inep'}));
  fireEvent.change(screen.getByLabelText('Etapa — Unicamp/Comvest'),{target:{value:'second'}});
  fireEvent.change(screen.getByLabelText('Profundidade'),{target:{value:'deep'}});
  fireEvent.click(screen.getByRole('checkbox',{name:/Usar meus erros/}));
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({targetBoards:['ENEM','UNICAMP'],reviewOptions:expect.objectContaining({depth:'deep',scopes:{ENEM:'all',UNICAMP:'second'},useHistory:true}),errorHistory:expect.stringContaining('Troquei a razão')}),expect.any(Function)));
  await waitFor(()=>expect(Object.values(readStrategyGuides(null))).toHaveLength(1));
  const guide=Object.values(readStrategyGuides(null))[0];
  expect(guide.reviewOptions?.depth).toBe('deep');
  expect(screen.getByText(/Resposta separada\./).closest('details')).not.toHaveAttribute('open');
  expect(await screen.findByText('Exportação CRIVO')).toBeInTheDocument();
});
it('sem banca envia seleção vazia e não herda metas Fuvest', async()=>{
  mount(); fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({targetBoards:[],reviewOptions:expect.objectContaining({boards:[]})}),expect.any(Function)));
  expect(mocks.generate.mock.calls[0][1].board).toBeUndefined();
});
it('material datado usa apenas a extração fornecida e preserva a referência', async()=>{
  mount();
  fireEvent.change(screen.getByLabelText('Material de origem'),{target:{value:'provided'}});
  fireEvent.change(screen.getByLabelText('Tipo de material'),{target:{value:'current-affairs'}});
  fireEvent.change(screen.getByLabelText('Título do material'),{target:{value:'Boletim epidemiológico'}});
  fireEvent.change(screen.getByLabelText('Data da fonte (opcional)'),{target:{value:'2025-10-01'}});
  fireEvent.change(screen.getByLabelText('Texto ou extração do material'),{target:{value:'Dados de vacinação em 2025.'}});
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({topic:'Boletim epidemiológico',referenceText:expect.stringContaining('2025-10-01'),reviewOptions:expect.objectContaining({materialKind:'current-affairs',sourceDate:'2025-10-01'})}),expect.any(Function)));
  expect(mocks.packet).not.toHaveBeenCalled();
});
it('preserva resposta sem gabarito como rascunho sem salvar uma revisão incompleta', async()=>{
  mocks.generate.mockResolvedValue({text:'Revisão sem separação de respostas'});
  mount(); fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível gerar');
  expect(screen.getByText('Revisão sem separação de respostas')).toBeInTheDocument();
  expect(Object.keys(readStrategyGuides(null))).toHaveLength(0);
});

it('obra da biblioteca aceita outra banca e encaminha o tipo literário sem foco Fuvest', async()=>{
  mount();
  fireEvent.change(screen.getByLabelText('Material de origem'),{target:{value:'work'}});
  await screen.findByRole('option',{name:'Memórias póstumas de Brás Cubas — Machado de Assis'});
  fireEvent.change(screen.getByLabelText('Obra'),{target:{value:'obra:bras-cubas'}});
  fireEvent.click(screen.getByRole('checkbox',{name:'Unesp/Vunesp'}));
  fireEvent.change(screen.getByLabelText('Etapa — Unesp/Vunesp'),{target:{value:'second'}});
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({subject:'Literatura',topic:'Memórias póstumas de Brás Cubas',targetBoards:['UNESP'],reviewOptions:expect.objectContaining({materialKind:'literature',sourceMode:'work',scopes:{UNESP:'second'}})}),expect.any(Function)));
});

it('obras literárias aparecem na lista de matérias e geram revisão literária', async()=>{
  mount();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'__obras__'}});
  expect(screen.getByLabelText('Material de origem')).toHaveValue('work');
  await screen.findByRole('option',{name:'Memórias póstumas de Brás Cubas — Machado de Assis'});
  fireEvent.change(screen.getByLabelText('Obra'),{target:{value:'obra:bras-cubas'}});
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({subject:'Literatura',topic:'Memórias póstumas de Brás Cubas',reviewOptions:expect.objectContaining({materialKind:'literature',sourceMode:'work'})}),expect.any(Function)));
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'Biologia'}});
  expect(screen.getByLabelText('Material de origem')).toHaveValue('catalog');
  expect(screen.getByLabelText('Tipo de material')).toHaveValue('disciplinary');
});

it('mantém as escolhas e explica a retomada após atualizar os arquivos do aplicativo',async()=>{
 const view=mount();
 fireEvent.change(screen.getByLabelText('Material de origem'),{target:{value:'provided'}});
 fireEvent.change(screen.getByLabelText('Título do material'),{target:{value:'Roteiro de fisiologia'}});
 fireEvent.change(screen.getByLabelText('Texto ou extração do material'),{target:{value:'Texto autoral sintético sobre circulação.'}});
 fireEvent.change(screen.getByLabelText('Profundidade'),{target:{value:'deep'}});
 fireEvent.click(screen.getByRole('checkbox',{name:'Unicamp/Comvest'}));
 fireEvent.change(screen.getByLabelText('Etapa — Unicamp/Comvest'),{target:{value:'second'}});
 window.dispatchEvent(new Event('crivo:before-asset-reload'));
 view.unmount();mount();
 expect(screen.getByLabelText('Título do material')).toHaveValue('Roteiro de fisiologia');
 expect(screen.getByLabelText('Texto ou extração do material')).toHaveValue('Texto autoral sintético sobre circulação.');
 expect(screen.getByLabelText('Profundidade')).toHaveValue('deep');
 expect(screen.getByLabelText('Etapa — Unicamp/Comvest')).toHaveValue('second');
 expect(screen.getByRole('status',{name:'Atualização do aplicativo'})).toHaveTextContent('Sua seleção foi mantida');
 expect(mocks.generate).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
 await screen.findByTestId('review-pdf');
 expect(screen.queryByRole('status',{name:'Atualização do aplicativo'})).not.toBeInTheDocument();
});
it('reabre a revisão salva após a atualização sem gerar outra versão automaticamente',async()=>{
 const old={key:'recover-saved',kind:'review-summary' as const,subject:'Biologia',topicId:'bio',topicName:'Fisiologia salva',chapter:'',board:'FUVEST',text:'Texto de revisão preservado',savedAt:'2025-01-01T00:00:00Z'};
 cacheStrategyGuides(null,{[old.key]:old});
 const view=mount();
 fireEvent.click(screen.getByRole('button',{name:/Fisiologia salva · FUVEST/}));
 await screen.findByTestId('review-pdf');
 window.dispatchEvent(new Event('crivo:before-asset-reload'));
 view.unmount();mount();
 expect(await screen.findByTestId('review-pdf')).toHaveAttribute('data-auto','false');
 expect(screen.getByRole('article',{name:'Resumo selecionado'})).toHaveTextContent('Texto de revisão preservado');
 expect(mocks.generate).not.toHaveBeenCalled();
});

it('combina tópicos com capítulos próprios, salva sem substituir o individual e restaura o recorte', async () => {
  const view = mount();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'), {target:{value:'Biologia'}});
  fireEvent.change(screen.getByLabelText('Tópico do resumo'), {target:{value:'bio_ecologia'}});
  fireEvent.click(screen.getByLabelText('Dinâmica de Populações'));
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(Object.values(readStrategyGuides(null))).toHaveLength(1));
  fireEvent.click(screen.getByRole('button',{name:'Configurar nova revisão'}));
  fireEvent.click(screen.getByText('Combinar mais tópicos de Biologia na mesma revisão'));
  fireEvent.click(screen.getByRole('checkbox',{name:'Evolução'}));
  fireEvent.click(screen.getByLabelText('Mecanismos da Evolução Biológica'));
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.packet).toHaveBeenLastCalledWith(expect.objectContaining({id:'bio_ecologia'}),'',[],[{topic:expect.objectContaining({id:'bio_evolucao'}),chapter:''}],expect.objectContaining({depth:'strategic',topicCuts:{bio_ecologia:['Dinâmica de Populações'],bio_evolucao:['Mecanismos da Evolução Biológica']}})));
  expect(mocks.generate).toHaveBeenLastCalledWith('review-tip',expect.objectContaining({topic:'Ecologia + Evolução',chapters:expect.stringContaining('Evolução: Mecanismos da Evolução Biológica'),guideMode:'review-summary'}),expect.any(Function));
  await waitFor(()=>expect(Object.values(readStrategyGuides(null))).toHaveLength(2));
  const combined=Object.values(readStrategyGuides(null)).find(g=>g.selections?.length===2)!;
  expect(combined.selections).toEqual([{topicId:'bio_ecologia',topicName:'Ecologia',chapter:'',cuts:['Dinâmica de Populações']},{topicId:'bio_evolucao',topicName:'Evolução',chapter:'',cuts:['Mecanismos da Evolução Biológica']}]);
  expect(document.querySelector('[data-print-subtopic]')?.getAttribute('data-print-subtopic')).toContain('Mecanismos da Evolução Biológica');
  view.unmount();mount();
  fireEvent.click(screen.getByRole('button',{name:/^Ecologia \+ Evolução/}));
  fireEvent.click(screen.getByRole('button',{name:'Configurar nova revisão'}));
  expect(screen.getByRole('checkbox',{name:'Evolução'})).toBeChecked();
  expect(screen.getByLabelText('Dinâmica de Populações')).toBeChecked();
  expect(screen.getByLabelText('Mecanismos da Evolução Biológica')).toBeChecked();
});

it('limita a quatro tópicos e limpa a combinação ao trocar de matéria ou material', () => {
  mount();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'Biologia'}});
  fireEvent.change(screen.getByLabelText('Tópico do resumo'),{target:{value:'bio_ecologia'}});
  fireEvent.click(screen.getByText('Combinar mais tópicos de Biologia na mesma revisão'));
  for(const name of ['Evolução','Botânica','Fisiologia Animal e Humana']) fireEvent.click(screen.getByRole('checkbox',{name}));
  expect(screen.getByRole('checkbox',{name:'Genética'})).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox',{name:'Evolução'}));
  expect(screen.getByRole('checkbox',{name:'Genética'})).toBeEnabled();
  fireEvent.change(screen.getByLabelText('Material de origem'),{target:{value:'provided'}});
  expect(screen.queryByText('Combinar mais tópicos de Biologia na mesma revisão')).toBeNull();
  fireEvent.change(screen.getByLabelText('Material de origem'),{target:{value:'catalog'}});
  expect(screen.getByRole('checkbox',{name:'Botânica'})).not.toBeChecked();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'Química'}});
  expect(screen.queryByRole('checkbox',{name:'Botânica'})).toBeNull();
});

it('inclui dificuldades dos tópicos adicionais e preserva as etapas selecionadas', async()=>{
  mocks.history.errors=[{id:'erro-extra',topicId:'bio_evolucao',questionId:'q',date:'2026-10-24',type:'unknown',notes:'Confundi seleção natural com adaptação intencional',confidence:'baixa'}];
  mount();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'Biologia'}});
  fireEvent.change(screen.getByLabelText('Tópico do resumo'),{target:{value:'bio_ecologia'}});
  fireEvent.click(screen.getByText('Combinar mais tópicos de Biologia na mesma revisão'));
  fireEvent.click(screen.getByRole('checkbox',{name:'Evolução'}));
  fireEvent.click(screen.getByRole('checkbox',{name:'Unicamp/Comvest'}));
  fireEvent.change(screen.getByLabelText('Etapa — Unicamp/Comvest'),{target:{value:'second'}});
  fireEvent.click(screen.getByRole('checkbox',{name:/Usar meus erros registrados/}));
  fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
  await waitFor(()=>expect(mocks.generate).toHaveBeenCalledWith('review-tip',expect.objectContaining({targetBoards:['UNICAMP'],reviewOptions:expect.objectContaining({scopes:{UNICAMP:'second'},useHistory:true}),errorHistory:expect.stringContaining('Confundi seleção natural')}),expect.any(Function)));
  expect(mocks.generate.mock.calls[0][1].errorHistory).toContain('Evolução');
});

it('retoma tópicos e capítulos adicionais após atualização do aplicativo',()=>{
  const view=mount();
  fireEvent.change(screen.getByLabelText('Matéria do resumo'),{target:{value:'Biologia'}});
  fireEvent.change(screen.getByLabelText('Tópico do resumo'),{target:{value:'bio_ecologia'}});
  fireEvent.click(screen.getByText('Combinar mais tópicos de Biologia na mesma revisão'));
  fireEvent.click(screen.getByRole('checkbox',{name:'Evolução'}));
  fireEvent.click(screen.getByLabelText('Mecanismos da Evolução Biológica'));
  act(()=>window.dispatchEvent(new Event('crivo:before-asset-reload')));
  view.unmount();mount();
  expect(screen.getByLabelText('Tópico do resumo')).toHaveValue('bio_ecologia');
  expect(screen.getByLabelText('Mecanismos da Evolução Biológica')).toBeChecked();
  expect(mocks.generate).not.toHaveBeenCalled();
});

it('gera recortes múltiplos por tópico e restaura a seleção salva com recorte personalizado',async()=>{
 mount();fireEvent.change(screen.getByLabelText('Tópico do resumo'),{target:{value:'mat_geometria_plana'}});
 fireEvent.click(screen.getByText('Selecionar subtópicos de Geometria Plana'));
 fireEvent.click(screen.getByLabelText('Ângulos na circunferência'));fireEvent.click(screen.getByLabelText('Área do círculo'));
 fireEvent.change(screen.getByLabelText('Recorte personalizado de Geometria Plana'),{target:{value:'Meu erro em áreas compostas'}});fireEvent.click(screen.getByRole('button',{name:'Adicionar recorte'}));
 fireEvent.click(screen.getByText('Combinar mais tópicos de Matemática na mesma revisão'));fireEvent.click(screen.getByRole('checkbox',{name:'Funções'}));
 fireEvent.click(screen.getByText('Selecionar subtópicos de Funções'));fireEvent.click(screen.getByLabelText('Função Quadrática'));
 fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));await waitFor(()=>expect(mocks.generate).toHaveBeenCalled());
 const request=mocks.generate.mock.calls[0][1];expect(request.chapters).toContain('Ângulos na circunferência + Área do círculo + Meu erro em áreas compostas');expect(request.chapters).toContain('Função Quadrática');
 await waitFor(()=>expect(Object.values(readStrategyGuides(null))).toHaveLength(1));
 const saved=Object.values(readStrategyGuides(null))[0];expect(saved.reviewOptions?.topicCuts?.mat_geometria_plana).toHaveLength(3);expect(saved.selections?.[0].cuts).toHaveLength(3);
 fireEvent.click(screen.getByRole('button',{name:/Geometria Plana \+ Funções · Geral/}));fireEvent.click(screen.getByRole('button',{name:'Editar configurações desta revisão'}));
 expect(screen.getByLabelText('Área do círculo')).toBeChecked();expect(screen.getByLabelText('Meu erro em áreas compostas')).toBeChecked();expect(screen.getByLabelText('Função Quadrática')).toBeChecked();
});
it('salva e restaura a preferência por revisão sem figuras',async()=>{
 mount();
 const figures=screen.getByRole('checkbox',{name:/Incluir figuras quando ajudarem/});
 expect(figures).toBeChecked();fireEvent.click(figures);
 fireEvent.click(screen.getByRole('button',{name:'Gerar resumo de revisão'}));
 await waitFor(()=>expect(screen.getByText('Meus resumos de revisão (1)')).toBeInTheDocument());
 expect(mocks.generate.mock.calls[0][1].reviewOptions.visualMode).toBe('text');
 expect(Object.values(readStrategyGuides(null))[0].reviewOptions?.visualMode).toBe('text');
 cleanup();mount();
 const open=screen.getByRole('button',{name:/Aritmética e Proporcionalidade/,pressed:false});fireEvent.click(open);
 fireEvent.click(screen.getByRole('button',{name:'Editar configurações desta revisão'}));
 expect(screen.getByRole('checkbox',{name:/Incluir figuras quando ajudarem/})).not.toBeChecked();
});
