import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { ReviewSummaryText } from './ReviewSummaryText';
afterEach(cleanup);
it('resolve rótulos antigos antes de separar o gabarito, sem expor a resposta junto da figura',async()=>{
 const visual={type:'flow',title:'Circulação',caption:'Esquema didático.',steps:['Entrada','Saída'],question:'V2. O que mudou?'};
 const text='```study-visual\n'+JSON.stringify(visual)+'\n```\n\n## Gabarito da recuperação ativa\n\n### Respostas das perguntas visuais\n\n**V2.** A resposta esperada.';
 const {container}=render(<ReviewSummaryText text={text}/>);
 await waitFor(()=>expect(screen.getByText('Questão de verificação 1')).toBeInTheDocument());
 expect(container.querySelector('[data-study-visual]')?.textContent).not.toContain('A resposta esperada');
 await waitFor(()=>expect(screen.getByText('Resposta da questão de verificação 1.')).toBeInTheDocument());
 expect(screen.getByText('Resposta da questão de verificação 1.').closest('details')).not.toHaveAttribute('open');
 expect(container.textContent).not.toContain('V2.');
});
