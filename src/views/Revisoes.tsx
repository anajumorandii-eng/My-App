import {useEffect,useRef} from 'react';
import { useAuth } from '../context/AuthContext';
import { ReviewWorkspace } from '../components/ReviewWorkspace';
import { ReviewSessionGuide } from '../components/ReviewSessionGuide';
import { StudyPlanToday } from '../components/StudyPlanToday';
import { useStudyPlan } from '../hooks/useStudyPlan';

function ReviewGuideDisclosure({active,openResource}:{active:string;openResource:(resource:string,path?:string)=>void}){
 const disclosure=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(disclosure.current)disclosure.current.open=false;},[active]);
 return <details ref={disclosure} className="ni-panel px-4 py-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Consultar meu roteiro de revisão</summary><div className="mt-3"><ReviewSessionGuide open={openResource}/></div></details>;
}
export default function Revisoes() {
 const {user}=useAuth();
 const {plan,loading,error}=useStudyPlan();
 // Com cronograma importado, o dia dele é a primeira coisa da tela e fica
 // aberto: era o que mais orientava a sessão e estava atrás de dois cliques.
 // O roteiro genérico sai nesse caso, porque montaria blocos de 5 a 15
 // minutos ao lado dos blocos de 2h do cronograma, e os dois discordariam.
 const header=(open:(resource:string,path?:string)=>void,active:string)=>
  plan ? <StudyPlanToday plan={plan} open={open}/>
  : loading ? <p role="status" className="text-sm">Carregando seu cronograma...</p>
  : <>{error && <p role="alert" className="text-sm">{error}</p>}<ReviewGuideDisclosure active={active} openResource={open}/></>;
 return <div className="ni-main space-y-4">
  <div className="ni-route"><span>Estudar</span><i/><b>CENTRAL DE REVISÃO</b></div>
  <div className="ni-title"><div><h1>Revisões</h1><p>{plan ? 'O dia do seu cronograma, e as atividades para cumpri-lo.' : 'Crie uma revisão direcionada, retome um material salvo ou siga sua fila de estudo.'}</p></div></div>
  <ReviewWorkspace key={user?.uid??'sem-conta'} header={header}/>
 </div>;
}
