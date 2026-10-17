import { expect, it } from 'vitest';
import { prepareStudyExport } from './StudyExportButton';

it('exporta a resposta atual, escolhas e conteúdo sem botões e sem alterar o editor', () => {
  const source = document.createElement('div');
  source.innerHTML = '<h1>Minha explicação</h1><textarea>Valor inicial</textarea><select><option>Antes</option><option>Depois</option></select><button>Gerar</button><nav>Menu</nav><details><summary>Raciocínio</summary><p>Texto aprofundado.</p></details>';
  source.querySelector('textarea')!.value = 'Agora entendo o mecanismo.';
  source.querySelector('select')!.value = 'Depois';
  const copy = prepareStudyExport(source);
  expect(copy.textContent).toContain('Agora entendo o mecanismo.');
  expect(copy.textContent).toContain('Depois');
  expect(copy.textContent).toContain('Texto aprofundado.');
  expect(copy.querySelector('textarea, select, button, nav')).toBeNull();
  expect(source.querySelector('textarea')).not.toBeNull();
});
