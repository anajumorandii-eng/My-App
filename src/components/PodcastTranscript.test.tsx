import { useRef } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { PodcastPlayer } from '../features/podcast/PodcastPlayer';
import type { PodcastCue } from '../lib/podcastTiming';

const cues:PodcastCue[]=[{start:0,end:3,text:'Primeira explicação sobre osmose.',speaker:1},{start:3.2,end:8,text:'Segunda fala com uma pergunta.',speaker:2}];
function Demo({id='ep',script='Host1: Primeira explicação sobre osmose.\nHost2: Segunda fala com uma pergunta.',url='blob:audio',timing=cues}:{id?:string;script?:string;url?:string|null;timing?:PodcastCue[]}) {
 const audio=useRef<HTMLAudioElement>(null);
 return <PodcastPlayer episode={{id,title:'Osmose',subject:'Biologia',topicId:'bio',script,durationMinutes:1}} audioUrl={url} audioRef={audio} cues={timing} audioLoading={false} requestDisabled={false} onRequestAudio={()=>{}} onEnded={()=>{}} onPlay={()=>{}} onPause={()=>{}} onError={()=>{}}/>;
}
const audio=()=>screen.getByLabelText('Áudio de Osmose') as HTMLAudioElement;
const current=()=>screen.getByRole('region',{name:'Roteiro para acompanhar o áudio'}).querySelector('[aria-current="true"]');
it('acompanha o relógio da mídia em pausa, avanço, retorno e mudança de velocidade',()=>{
 render(<Demo/>);fireEvent.click(screen.getByRole('button',{name:'Acompanhar roteiro'}));
 audio().currentTime=1;fireEvent.timeUpdate(audio());expect(current()).toHaveTextContent('Primeira explicação');
 audio().currentTime=5;fireEvent.timeUpdate(audio());expect(current()).toHaveTextContent('Segunda fala');
 fireEvent.pause(audio());expect(current()).toHaveTextContent('Segunda fala');
 fireEvent.change(screen.getByLabelText('Velocidade de reprodução'),{target:{value:'2'}});expect(audio().playbackRate).toBe(2);
 audio().currentTime=.5;fireEvent.seeked(audio());expect(current()).toHaveTextContent('Primeira explicação');
 fireEvent.click(screen.getByRole('button',{name:'Avançar 15 segundos'}));
 audio().currentTime=8;fireEvent.ended(audio());expect(current()).toHaveTextContent('Segunda fala');
});
it('permite ler livremente, retomar acompanhamento e buscar um trecho sem iniciar áudio pausado',()=>{
 const play=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();render(<Demo/>);
 fireEvent.click(screen.getByRole('button',{name:'Acompanhar roteiro'}));
 const region=screen.getByRole('region',{name:'Roteiro para acompanhar o áudio'});
 fireEvent.wheel(region);expect(screen.getByRole('checkbox',{name:'Acompanhar automaticamente'})).not.toBeChecked();
 audio().currentTime=4;fireEvent.timeUpdate(audio());expect(current()).toHaveTextContent('Segunda fala');
 fireEvent.click(within(region).getByRole('button',{name:/Primeira explicação/}));expect(audio().currentTime).toBe(0);expect(play).not.toHaveBeenCalled();
 fireEvent.click(screen.getByRole('button',{name:'Voltar ao trecho atual'}));expect(screen.getByRole('checkbox',{name:'Acompanhar automaticamente'})).toBeChecked();
 play.mockRestore();
});
it('substitui o texto e os marcadores ao trocar de episódio e aceita áudio sem marcas',()=>{
 const view=render(<Demo/>);fireEvent.click(screen.getByRole('button',{name:'Acompanhar roteiro'}));
 audio().currentTime=4;fireEvent.timeUpdate(audio());
 view.rerender(<Demo id="outro" script="Um roteiro diferente." url="blob:outro" timing={[{start:0,end:6,text:'Um roteiro diferente.'}]}/>);
 expect(screen.queryByText('Primeira explicação sobre osmose.')).not.toBeInTheDocument();
 audio().currentTime=1;fireEvent.loadedMetadata(audio());expect(current()).toHaveTextContent('Um roteiro diferente.');
 view.rerender(<Demo id="legado" script="Texto antigo preservado." timing={[]}/>);
 expect(screen.getByText('Texto antigo preservado.')).toBeVisible();expect(screen.queryByRole('checkbox',{name:'Acompanhar automaticamente'})).not.toBeInTheDocument();
 expect(screen.getByText(/sem marcação de trechos/)).toBeVisible();
});
it('abre o roteiro completo antes da geração do áudio',()=>{
 render(<Demo url={null} timing={[]}/>);
 fireEvent.click(screen.getByRole('button',{name:'Ver roteiro'}));expect(screen.getByText(/Host1: Primeira explicação/)).toBeVisible();
 expect(screen.getByText(/Prepare o áudio/)).toBeVisible();
});
