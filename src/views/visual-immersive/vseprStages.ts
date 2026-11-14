import { MOLECULAS, momentoResultante, type IdMolecula, type Vetor } from '../../lib/geometriaMolecular';

/**
 * As cinco moléculas da cena imersiva de geometria molecular, orientadas para
 * que a passagem de uma à outra seja o próprio argumento da repulsão.
 *
 * `lib/geometriaMolecular.ts` já tem as direções de cada molécula, mas cada
 * uma na orientação que fica melhor sozinha (o metano nos cantos de um cubo, a
 * amônia com o par livre para cima). Interpolar entre elas fazia a molécula
 * dar uma cambalhota que não significa nada. Aqui as quatro nuvens ocupam
 * sempre as mesmas quatro posições, e o que se vê mudar é só o que a teoria
 * diz que muda: entra uma nuvem, as outras cedem espaço; uma ligação vira par
 * livre, o ângulo fecha.
 *
 * Os ângulos não são reescritos: saem de `MOLECULAS[id].anguloGraus`, e o
 * teste confere que as direções daqui reproduzem cada um.
 */
export type TipoDeNuvem = 'ligacao' | 'par' | 'vazia';

export interface Nuvem { tipo: TipoDeNuvem; direcao: Vetor }

export interface EstagioVsepr { id: IdMolecula; nuvens: [Nuvem, Nuvem, Nuvem, Nuvem] }

const rad = (graus: number) => (graus * Math.PI) / 180;
const norm = ([x, y, z]: Vetor): Vetor => { const n = Math.hypot(x, y, z); return [x / n, y / n, z / n]; };
const soma = (a: Vetor, b: Vetor): Vetor => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vezes = (a: Vetor, k: number): Vetor => [a[0] * k, a[1] * k, a[2] * k];
const cruz = (a: Vetor, b: Vetor): Vetor => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

const CIMA: Vetor = [0, 1, 0];

/**
 * Três direções em volta do eixo vertical, inclinadas para baixo até o ângulo
 * entre elas ser o pedido: 120° dá o plano, 109,5° o tetraedro, 107° a amônia.
 * cos θ = 1 − 1,5 sen²β, com β medido a partir de −y.
 */
function tripe(anguloGraus: number): [Vetor, Vetor, Vetor] {
  const b = Math.asin(Math.sqrt((1 - Math.cos(rad(anguloGraus))) / 1.5));
  const em = (az: number): Vetor => norm([Math.sin(b) * Math.cos(rad(az)), -Math.cos(b), Math.sin(b) * Math.sin(rad(az))]);
  return [em(0), em(120), em(240)];
}

const angulo = (id: IdMolecula) => MOLECULAS[id].anguloGraus;
const liga = (direcao: Vetor): Nuvem => ({ tipo: 'ligacao', direcao });
const par = (direcao: Vetor): Nuvem => ({ tipo: 'par', direcao });
const vazia = (direcao: Vetor): Nuvem => ({ tipo: 'vazia', direcao });

const plano = tripe(angulo('BF3'));
const tetra = tripe(angulo('CH4'));
const amonia = tripe(angulo('NH3'));

/**
 * A água a partir da amônia: as ligações 1 e 2 ficam, fechando até 104,5° em
 * volta do eixo que já as separava; a ligação 0 e o par de cima viram os dois
 * pares livres, do outro lado. O ângulo entre os pares (114°) é ilustrativo —
 * a cena só afirma o das ligações.
 */
function agua(): [Nuvem, Nuvem, Nuvem, Nuvem] {
  const eixo = norm(soma(amonia[1], amonia[2]));
  const lado: Vetor = [0, 0, 1];
  const fora = norm(cruz(eixo, lado));
  const meio = rad(angulo('H2O') / 2), abertura = rad(57);
  const ligacao = (s: number) => norm(soma(vezes(eixo, Math.cos(meio)), vezes(lado, s * Math.sin(meio))));
  const livre = (s: number) => norm(soma(vezes(eixo, -Math.cos(abertura)), vezes(fora, s * Math.sin(abertura))));
  // O par que já estava em cima continua sendo o mais alto dos dois.
  const [alto, baixo] = livre(1)[1] > livre(-1)[1] ? [livre(1), livre(-1)] : [livre(-1), livre(1)];
  return [par(alto), par(baixo), liga(ligacao(1)), liga(ligacao(-1))];
}

/** Ordem das nuvens: [de cima, tripé 0, tripé 1, tripé 2]. */
export const ESTAGIOS: Record<IdMolecula, EstagioVsepr> = {
  // Duas nuvens: opostas. A terceira e a de cima ainda não existem, e ficam
  // guardadas onde vão aparecer, para surgirem sem atravessar a molécula.
  CO2: { id: 'CO2', nuvens: [vazia(CIMA), vazia(plano[0]), liga([0, 0, 1]), liga([0, 0, -1])] },
  BF3: { id: 'BF3', nuvens: [vazia(CIMA), liga(plano[0]), liga(plano[1]), liga(plano[2])] },
  CH4: { id: 'CH4', nuvens: [liga(CIMA), liga(tetra[0]), liga(tetra[1]), liga(tetra[2])] },
  NH3: { id: 'NH3', nuvens: [par(CIMA), liga(amonia[0]), liga(amonia[1]), liga(amonia[2])] },
  H2O: { id: 'H2O', nuvens: agua() },
};

export const SEQUENCIA: IdMolecula[] = ['CO2', 'BF3', 'CH4', 'NH3', 'H2O'];

export const ligacoesDe = (estagio: EstagioVsepr) => estagio.nuvens.filter(n => n.tipo === 'ligacao').map(n => n.direcao);

/**
 * Para onde aponta o dipolo resultante (do lado positivo para o negativo), ou
 * `null` quando os vetores das ligações se anulam.
 *
 * Nas cinco moléculas os ligantes são iguais, então a soma das direções basta
 * (a mesma simplificação de `geometriaMolecular.ts`). O sentido depende de
 * quem puxa os elétrons: na água e na amônia é o átomo central, e o dipolo
 * aponta contra a soma das ligações; no CO₂ e no BF₃ são os ligantes, mas ali
 * a soma é nula e não há sentido a escolher.
 */
export function dipoloResultante(estagio: EstagioVsepr): Vetor | null {
  if (momentoResultante(MOLECULAS[estagio.id]) < 1e-6) return null;
  const s = ligacoesDe(estagio).reduce<Vetor>(soma, [0, 0, 0]);
  const centralPuxa = estagio.id === 'NH3' || estagio.id === 'H2O';
  return norm(vezes(s, centralPuxa ? -1 : 1));
}
