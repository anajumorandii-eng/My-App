import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
import Revisoes from '../src/views/Revisoes';
import '../src/index.css';
import '../src/design-system/css/nucleo-instrumental-prototype.css';
import '../src/design-system/css/nucleo-instrumental-rail.css';
import '../src/design-system/css/nucleo-instrumental-cores.css';
import '../src/design-system/css/nucleo-instrumental-brand.css';
export function mountReviewWorkspace(){
 const root=document.createElement('div');root.className='ni-prototype ni-production-app crivo-editorial is-light';root.style.cssText='display:block;min-height:100vh;--primary:#315d50;--wash:#e8ede6';document.body.append(root);
 createRoot(root).render(<MemoryRouter initialEntries={['/revisoes?recurso=resumos-banca']}><Revisoes/></MemoryRouter>);
}
