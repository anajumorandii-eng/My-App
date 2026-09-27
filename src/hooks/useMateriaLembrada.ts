import { useState } from 'react';

/**
 * Matéria escolhida no filtro de uma tela, lembrada entre idas e voltas.
 *
 * No Visual e nos Resumos a matéria morava num `useState` da lista: abrir um
 * card desmontava a lista (Visual) ou trocava a URL por `?summary=` (Resumos),
 * e ao voltar o filtro caía em "Todas". A Ana Júlia escolhia Matemática,
 * abria um capítulo e voltava para a lista inteira.
 *
 * Guardado em `localStorage` por ser conveniência de quem usa, não dado de
 * estudo. Leitura e escrita ficam em try/catch porque o armazenamento pode
 * estar bloqueado (janela privada), e aí a tela só volta a abrir em "Todas".
 * Um `?subject=` na URL tem prioridade: é um link que pediu aquela matéria.
 */
export function useMateriaLembrada(chave: string, daUrl?: string | null): [string, (materia: string) => void] {
  const [materia, setMateria] = useState(() => {
    if (daUrl) return daUrl;
    try { return localStorage.getItem(chave) ?? ''; } catch { return ''; }
  });
  const definir = (nova: string) => {
    setMateria(nova);
    try { localStorage.setItem(chave, nova); } catch { /* sem armazenamento: vale só nesta visita */ }
  };
  return [materia, definir];
}
