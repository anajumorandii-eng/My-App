import {useEffect,useRef} from 'react';
import { useAuth } from '../context/AuthContext';
import { ReviewWorkspace } from '../components/ReviewWorkspace';
import { ReviewSessionGuide } from '../components/ReviewSessionGuide';

function ReviewGuideDisclosure({active,openResource}:{active:string;openResource:(resource:string,path?:string)=>void}){
 const disclosure=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(disclosure.current)disclosure.current.open=false;},[active]);
 return <details ref={disclosure} className="ni-panel px-4 py-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Consultar meu roteiro de revisão</summary><div className="mt-3"><ReviewSessionGuide open={openResource}/></div></details>;
}
export default function Revisoes() {
 const {user}=useAuth();
 return <div className="ni-main space-y-4">
  <div className="ni-route"><span>Estudar</span><i/><b>CENTRAL DE REVISÃO</b></div>
  <div className="ni-title"><div><h1>Revisões</h1><p>Crie uma revisão direcionada, retome um material salvo ou siga sua fila de estudo.</p></div></div>
  <ReviewWorkspace key={user?.uid??'sem-conta'} header={(open,active)=><ReviewGuideDisclosure active={active} openResource={open}/>}/>
 </div>;
}
