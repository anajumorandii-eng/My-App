import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {BookletPdf} from './BookletPdf';
const {create,requestArt,loadSaved,save,extract}=vi.hoisted(()=>({create:vi.fn(),requestArt:vi.fn(),loadSaved:vi.fn(),save:vi.fn(),extract:vi.fn()}));
vi.mock('../lib/savedBookletPdf',()=>({loadSavedBookletPdf:loadSaved,saveBookletPdf:save}));
vi.mock('../lib/bookletCoverFonts',()=>({bookletCoverFonts:()=>({serif:new Uint8Array(),display:new Uint8Array(),italic:new Uint8Array(),text:new Uint8Array()})}));
vi.mock('../lib/bookletArtwork',()=>({requestBookletArtwork:requestArt}));
vi.mock('../lib/bookletPdf',()=>({createBookletPdf:create,extractBookletCover:extract}));
afterEach(()=>{cleanup();vi.clearAllMocks();loadSaved.mockReset();save.mockReset();extract.mockReset();vi.unstubAllGlobals();});
const source={arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer} as Blob;
function setup(){
 const revoke=vi.fn();vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:revoke});
 return {revoke,view:render(<BookletPdf pdf={source} filename="Revisão.pdf"/>)};
}
it('gera sob demanda a partir do PDF pronto, oferece arquivo separado e libera sua URL',async()=>{
 create.mockResolvedValue({bytes:new Uint8Array([37,80,68,70]),sheets:2,blankPages:3});
 const {view,revoke}=setup();expect(create).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));
 expect(await screen.findByRole('link',{name:'Salvar livreto'})).toHaveAttribute('download','Revisão-livreto.pdf');
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]),undefined,undefined,undefined,'integrated',undefined);
 expect(screen.getByRole('status')).toHaveTextContent('2 folhas A4');
 expect(screen.getByText(/borda curta/)).toBeInTheDocument();
 view.unmount();expect(revoke).toHaveBeenCalledWith('blob:booklet');
});
it('uma falha deixa o PDF original intacto e permite tentar novamente',async()=>{
 create.mockRejectedValueOnce(new Error('invalid')).mockResolvedValue({bytes:new Uint8Array([37]),sheets:1,blankPages:0});
 setup();fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));
 expect(await screen.findByRole('alert')).toHaveTextContent('PDF comum continua disponível');
 fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));
 expect(await screen.findByRole('link',{name:'Abrir livreto'})).toHaveAttribute('href','blob:booklet');
});

it('cria uma segunda arte com os metadados da edição e reaproveita ao tentar a imposição novamente',async()=>{
 const context={subject:'Geografia',topic:'Climatologia',edition:'c8d8a3ac-3a14-4ea3-8e88-e177de5cebf5'};
 const art=new Uint8Array([7,8,9]);requestArt.mockResolvedValue(art);
 create.mockRejectedValueOnce(new Error('Falha na imposição')).mockResolvedValue({bytes:new Uint8Array([37]),sheets:1,blankPages:0});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Clima.pdf" context={context}/>);
 expect(requestArt).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));
 await screen.findByRole('alert');
 expect(requestArt).toHaveBeenCalledWith(context,expect.any(AbortSignal));
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]),art,context,expect.any(Object),'integrated',undefined);
 fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));await screen.findByRole('link',{name:'Abrir livreto'});
 expect(requestArt).toHaveBeenCalledTimes(1);
});
it('falha da segunda arte não publica um livreto com imagem repetida',async()=>{
 requestArt.mockRejectedValueOnce(new Error('Serviço indisponível'));
 render(<BookletPdf pdf={source} filename="Clima.pdf" context={{subject:'Geografia',topic:'Clima'}}/>);
 const before=create.mock.calls.length;
 fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));
 expect(await screen.findByRole('alert')).toHaveTextContent('Serviço indisponível');
 expect(create.mock.calls.length).toBe(before);expect(screen.queryByRole('link',{name:'Abrir livreto'})).not.toBeInTheDocument();
});

it('usa a versão repaginada e a reutiliza após falha, sem modificar o arquivo comum',async()=>{
 const repaginated={arrayBuffer:async()=>new Uint8Array([5,6,7]).buffer}as Blob;
 const getSource=vi.fn().mockResolvedValue(repaginated);
 create.mockRejectedValueOnce(new Error('Falha na imposição')).mockResolvedValue({bytes:new Uint8Array([37]),sheets:1,blankPages:0});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" getSource={getSource}/>);
 expect(getSource).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));await screen.findByRole('alert');
 expect(create).toHaveBeenCalledWith(new Uint8Array([5,6,7]),undefined,undefined,undefined,'integrated',undefined);
 fireEvent.click(screen.getByRole('button',{name:'Gerar livreto'}));await screen.findByRole('link',{name:'Abrir livreto'});
 expect(getSource).toHaveBeenCalledTimes(1);expect(new Uint8Array(await source.arrayBuffer())).toEqual(new Uint8Array([1,2,3]));
});


it('recupera o mesmo livreto após sair e voltar, sem repaginar nem gerar arte',async()=>{
 const getSource=vi.fn();loadSaved.mockResolvedValue({blob:source,sheets:3});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:saved-booklet'),revokeObjectURL:vi.fn()});
 const props={pdf:source,filename:'Revisão.pdf',documentId:'a'.repeat(64),getSource};
 const view=render(<BookletPdf {...props}/>);
 expect(screen.queryByRole('button',{name:'Gerar livreto'})).toBeNull();
 expect(await screen.findByRole('link',{name:'Abrir livreto'})).toHaveAttribute('href','blob:saved-booklet');
 expect(screen.getByRole('status')).toHaveTextContent('Livreto salvo na sua conta: 3 folhas A4');
 view.unmount();render(<BookletPdf {...props}/>);await screen.findByRole('link',{name:'Abrir livreto'});
 expect(loadSaved).toHaveBeenCalledTimes(2);expect(getSource).not.toHaveBeenCalled();expect(requestArt).not.toHaveBeenCalled();expect(create).not.toHaveBeenCalled();expect(save).not.toHaveBeenCalled();
});
it('falha ao recuperar não gera outro livreto e permite recuperar o anterior',async()=>{
 loadSaved.mockRejectedValueOnce(new Error('Falha temporária')).mockResolvedValue({blob:source,sheets:1});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:saved-booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'b'.repeat(64)}/>);
 await screen.findByRole('alert');expect(screen.queryByRole('button',{name:'Gerar livreto'})).toBeNull();
 expect(create).not.toHaveBeenCalled();expect(requestArt).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Tentar recuperar livreto'}));await screen.findByRole('link',{name:'Abrir livreto'});
 expect(create).not.toHaveBeenCalled();
});
it('salva os bytes preparados e uma falha no salvamento não repete a geração',async()=>{
 loadSaved.mockResolvedValue(undefined);save.mockRejectedValueOnce(new Error('Falha ao salvar')).mockResolvedValue(undefined);
 create.mockResolvedValue({bytes:new Uint8Array([37,80,68,70]),sheets:2,blankPages:1});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'c'.repeat(64)}/>);
 fireEvent.click(await screen.findByRole('button',{name:'Gerar livreto'}));await screen.findByRole('alert');
 expect(screen.queryByRole('link',{name:'Abrir livreto'})).toBeNull();
 const prepared=save.mock.calls[0][1];expect(prepared.size).toBe(4);expect(prepared.type).toBe('application/pdf');
 fireEvent.click(screen.getByRole('button',{name:'Tentar salvar livreto'}));await screen.findByRole('link',{name:'Abrir livreto'});
 expect(create).toHaveBeenCalledTimes(1);expect(save.mock.calls[1][1]).toBe(prepared);
});
it('só substitui o livreto salvo por pedido explícito e mantém o anterior acessível durante a tentativa',async()=>{
 const context={subject:'Geografia',topic:'Urbanização',edition:'c8d8a3ac-3a14-4ea3-8e88-e177de5cebf5'};
 loadSaved.mockResolvedValue({blob:source,sheets:1});save.mockRejectedValueOnce(new Error('Falha ao salvar')).mockResolvedValue(undefined);
 requestArt.mockResolvedValue(new Uint8Array([7]));create.mockResolvedValue({bytes:new Uint8Array([37]),sheets:2,blankPages:0});
 vi.stubGlobal('URL',{createObjectURL:vi.fn().mockReturnValueOnce('blob:old').mockReturnValueOnce('blob:new'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" context={context} documentId={'d'.repeat(64)}/>);
 await screen.findByRole('link',{name:'Abrir livreto'});expect(requestArt).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Gerar novo livreto'}));await screen.findByRole('alert');
 expect(screen.getByRole('link',{name:'Abrir livreto'})).toHaveAttribute('href','blob:old');expect(URL.revokeObjectURL).not.toHaveBeenCalled();
 expect(requestArt.mock.calls[0][0].edition).not.toBe(context.edition);
 fireEvent.click(screen.getByRole('button',{name:'Tentar salvar livreto'}));
 await screen.findByText(/salvo na sua conta: 2 folhas/);
 expect(screen.getByRole('link',{name:'Abrir livreto'})).toHaveAttribute('href','blob:new');expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:old');
 expect(requestArt).toHaveBeenCalledTimes(1);expect(create).toHaveBeenCalledTimes(1);
});


it('capa separada oferece dois PDFs, contagens e instruções específicas, e recupera cada formato salvo',async()=>{
 const stored={blob:source,coverBlob:source,sheets:2,blankPages:3,contentPages:5,layoutVersion:2};
 loadSaved.mockImplementation(async(_id,_signal,mode)=>mode==='separate'?stored:undefined);
 vi.stubGlobal('URL',{createObjectURL:vi.fn().mockReturnValueOnce('blob:body').mockReturnValueOnce('blob:cover').mockReturnValue('blob:restored'),revokeObjectURL:vi.fn()});
 const view=render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'e'.repeat(64)}/>);
 await screen.findByRole('button',{name:'Gerar livreto'});
 fireEvent.click(screen.getByRole('radio',{name:'Livreto com capa separada'}));
 expect(await screen.findByRole('link',{name:'Abrir Capa'})).toHaveAttribute('href','blob:cover');
 expect(screen.getByRole('link',{name:'Salvar Capa'})).toHaveAttribute('download','Revisão-capa.pdf');
 expect(screen.getByRole('link',{name:'Salvar Miolo'})).toHaveAttribute('download','Revisão-miolo.pdf');
 expect(screen.getByRole('status')).toHaveTextContent('3 folhas A4 no total. Capa: 1 folha. Miolo: 2 folhas.');
 expect(screen.getByText(/3 páginas de leitura A5 em branco/)).toHaveTextContent('somente ao final do miolo');
 expect(screen.getByText(/Contracapa à esquerda/)).toHaveTextContent('somente na frente');
 expect(screen.getByText(/Não selecione novamente/)).toHaveTextContent('2 páginas por folha');
 view.unmount();render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'e'.repeat(64)}/>);
 fireEvent.click(screen.getByRole('radio',{name:'Livreto com capa separada'}));await screen.findByRole('link',{name:'Abrir Miolo'});
 expect(create).not.toHaveBeenCalled();expect(requestArt).not.toHaveBeenCalled();
});
it('ao preparar outro formato, usa a capa salva e o miolo nativo em vez de cortar o PDF imposto',async()=>{
 const existingCover=new Uint8Array([9,8,7]);extract.mockResolvedValue(existingCover);
 loadSaved.mockImplementation(async(_id,_signal,mode)=>mode==='integrated'?{blob:source,sheets:2}:undefined);
 const getSource=vi.fn().mockResolvedValue(source);
 create.mockResolvedValue({bytes:new Uint8Array([37]),coverBytes:existingCover,layoutVersion:2,contentPages:5,sheets:2,blankPages:3});save.mockResolvedValue(undefined);
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" context={{subject:'Geografia',topic:'Urbanização'}} getSource={getSource} documentId={'f'.repeat(64)}/>);
 await screen.findByRole('link',{name:'Abrir livreto'});
 fireEvent.click(screen.getByRole('radio',{name:'Livreto com capa separada'}));
 fireEvent.click(await screen.findByRole('button',{name:'Gerar livreto'}));await screen.findByRole('link',{name:'Abrir Miolo'});
 expect(requestArt).not.toHaveBeenCalled();expect(extract).toHaveBeenCalledTimes(1);
 expect(getSource).toHaveBeenCalledWith(expect.any(AbortSignal),'separate');
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]),undefined,expect.any(Object),undefined,'separate',existingCover);
 expect(save.mock.calls[0][3]).toBe('separate');expect(save.mock.calls[0][4].type).toBe('application/pdf');
 expect(save.mock.calls[0][5]).toMatchObject({mode:'separate',contentPages:5,blankPages:3,sheets:2,coverSheets:1});
});
it('arquivo legado permanece acessível, sinaliza a montagem anterior e não gera outra edição automaticamente',async()=>{
 loadSaved.mockResolvedValue({blob:source,sheets:2,legacy:true});
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:legacy'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'a'.repeat(64)}/>);
 await screen.findByRole('link',{name:'Abrir livreto'});expect(screen.getByText(/anterior à correção da montagem/)).toBeInTheDocument();
 expect(screen.queryByText(/imposição já está pronta/)).toBeNull();expect(create).not.toHaveBeenCalled();
});

it('corrige o arquivo legado a pedido, mantendo a capa e reconstruindo o miolo nativo',async()=>{
 loadSaved.mockResolvedValue({blob:source,sheets:2,legacy:true});extract.mockResolvedValue(new Uint8Array([9]));save.mockResolvedValue(undefined);
 create.mockResolvedValue({bytes:new Uint8Array([37]),coverBytes:new Uint8Array([9]),sheets:2,blankPages:3,contentPages:3,layoutVersion:2});
 const getSource=vi.fn().mockResolvedValue(source);
 vi.stubGlobal('URL',{createObjectURL:vi.fn(()=> 'blob:booklet'),revokeObjectURL:vi.fn()});
 render(<BookletPdf pdf={source} filename="Revisão.pdf" documentId={'b'.repeat(64)} getSource={getSource} context={{subject:'Geografia',topic:'Urbanização'}}/>);
 fireEvent.click(await screen.findByRole('button',{name:'Corrigir montagem mantendo capa'}));
 await screen.findByRole('button',{name:'Gerar novo livreto'});
 expect(requestArt).not.toHaveBeenCalled();expect(getSource).toHaveBeenCalledWith(expect.any(AbortSignal),'integrated');expect(extract).toHaveBeenCalledTimes(1);
});
