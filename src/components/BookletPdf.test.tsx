import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {BookletPdf} from './BookletPdf';
const {create,requestArt}=vi.hoisted(()=>({create:vi.fn(),requestArt:vi.fn()}));
vi.mock('../lib/bookletArtwork',()=>({requestBookletArtwork:requestArt}));
vi.mock('../lib/bookletPdf',()=>({createBookletPdf:create}));
afterEach(()=>{cleanup();vi.clearAllMocks();vi.unstubAllGlobals();});
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
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]),undefined);
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
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]),art);
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
