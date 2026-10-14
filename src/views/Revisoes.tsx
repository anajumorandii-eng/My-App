import { useAuth } from '../context/AuthContext';
import { ReviewWorkspace } from '../components/ReviewWorkspace';
import { ReviewSessionGuide } from '../components/ReviewSessionGuide';
export default function Revisoes() {
  const {user}=useAuth();
  return <div className="ni-main space-y-4">
    <div className="ni-route"><span>Estudar</span><i/><b>CENTRAL DE REVISÃO</b></div>
    <div className="ni-title"><div><h1>Revisar para conseguir usar o que aprendeu.</h1><p>Questões, erros, resumos, obras e redação no mesmo lugar, com um roteiro para o tempo disponível até as provas.</p></div></div>
    <ReviewWorkspace key={user?.uid??'sem-conta'} header={open=><ReviewSessionGuide open={open}/>} />
  </div>;
}
