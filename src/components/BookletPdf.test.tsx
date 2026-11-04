import {afterEach,expect,it,vi} from 'vitest';
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {BookletPdf} from './BookletPdf';
const {create}=vi.hoisted(()=>({create:vi.fn()}));
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
 expect(create).toHaveBeenCalledWith(new Uint8Array([1,2,3]));
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
