import { useAuth } from '../context/AuthContext';
import { ReviewWorkspace } from '../components/ReviewWorkspace';
import { ReviewSessionGuide } from '../components/ReviewSessionGuide';
export default function Revisoes() {
  const {user}=useAuth();
  return <div className="ni-main space-y-4">
    <div className="ni-route"><span>Estudar</span><i/><b>CENTRAL DE REVISÃO</b></div>
    <div className="ni-title"><div><h1>Revisar para conseguir usar o que aprendeu.</h1><p>Questões, erros, resumos de revisão por banca, obras e redação no mesmo lugar, com um roteiro para o tempo disponível até as provas.</p></div></div>
    <ReviewWorkspace key={user?.uid??'sem-conta'} header={open=><>
      <div className="ni-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm">Retome o essencial de uma matéria com foco na banca da sua prova.</p>
        <button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-semibold" onClick={()=>open('resumos-banca')}>Criar resumo por banca</button>
      </div>
      <ReviewSessionGuide open={open}/>
    </>} />
  </div>;
}
