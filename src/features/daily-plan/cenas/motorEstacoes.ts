import * as THREE from 'three';
import { INCLINACAO, declinacao, type Cidade } from '../../../lib/estacoesDoAno';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, texturaRadial, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Geografia: o globo iluminado pelo Sol na data escolhida.
 *
 * O Sol fica sempre à esquerda e a câmera olha de lado, como no desenho da
 * órbita dos livros: assim a linha entre o dia e a noite aparece de frente, e
 * o que muda com a data é a inclinação do eixo em relação ao Sol. A metade
 * iluminada é pintada vértice a vértice pela direção do Sol, e não por uma
 * luz: com as luzes do estúdio a esfera ficava clara dos dois lados e a noite
 * sumia.
 */

export type IdRotulo = 'sol' | 'cidade' | 'capricornio' | 'equador';

export interface CenaEstacoes {
  definir(dia: number, cidade: Cidade): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const R = 1.25;
const CENTRO = new THREE.Vector3(0.6, 1.55, 0);
const EPS = THREE.MathUtils.degToRad(INCLINACAO);
/** O Sol vem da esquerda. */
const PARA_O_SOL = new THREE.Vector3(-1, 0, 0);

/**
 * Eixo da Terra na data: o ângulo entre o eixo e a direção do Sol dá a
 * declinação (sen δ = eixo · sol). O sinal de Λ leva o eixo para a frente
 * num semestre e para trás no outro, como a Terra correndo a órbita.
 */
function eixoNaData(dia: number) {
  const d = THREE.MathUtils.degToRad(declinacao(dia));
  const cosL = THREE.MathUtils.clamp(Math.sin(d) / Math.sin(EPS), -1, 1);
  const lado = Math.sin(((2 * Math.PI) / 365) * (dia + 10)) >= 0 ? 1 : -1;
  const L = Math.acos(cosL) * lado;
  return new THREE.Vector3(-Math.sin(EPS) * Math.cos(L), Math.cos(EPS), Math.sin(EPS) * Math.sin(L)).normalize();
}

export function montarEstacoes(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  diaInicial: number,
  cidadeInicial: Cidade,
): CenaEstacoes {
  let dia = diaInicial;
  let cidade = cidadeInicial;

  /** Base do globo na data: eixo e um meridiano voltado para a câmera, meio caminho do Sol. */
  function base() {
    const eixo = eixoNaData(dia);
    const frente = new THREE.Vector3(-0.55, 0, 1).projectOnPlane(eixo).normalize();
    return { eixo, frente };
  }
  const pontoNaLatitude = (lat: number, lon = 0) => {
    const { eixo, frente } = base();
    const leste = new THREE.Vector3().crossVectors(eixo, frente).normalize();
    const f = THREE.MathUtils.degToRad(lat), l = THREE.MathUtils.degToRad(lon);
    return frente.clone().multiplyScalar(Math.cos(f) * Math.cos(l))
      .addScaledVector(leste, Math.cos(f) * Math.sin(l))
      .addScaledVector(eixo, Math.sin(f))
      .multiplyScalar(R).add(CENTRO);
  };
  function paralelo(lat: number, cor: string, opacidade: number) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i += 1) pts.push(pontoNaLatitude(lat, (i / 96) * 360).sub(CENTRO).multiplyScalar(1.004).add(CENTRO));
    return traco(pts, cor, opacidade);
  }

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    // Globo: dia em papel tingido pela matéria, noite em tinta.
    const geo = new THREE.SphereGeometry(R, 72, 48);
    const dia0 = new THREE.Color(c.e ? '#e9d2a6' : '#fbf4e4').lerp(new THREE.Color(c.acento), c.e ? 0.18 : 0.22);
    const noite = new THREE.Color(c.e ? '#1a120b' : '#6b5540');
    const n = geo.attributes.normal, cores: number[] = [];
    const tmp = new THREE.Color();
    for (let i = 0; i < n.count; i += 1) {
      const luz = n.getX(i) * PARA_O_SOL.x + n.getY(i) * PARA_O_SOL.y + n.getZ(i) * PARA_O_SOL.z;
      // Crepúsculo estreito: a faixa larga borrava o limite que a lição é.
      const t = THREE.MathUtils.smoothstep(luz, -0.06, 0.1);
      tmp.copy(noite).lerp(dia0, t);
      // Um pouco de relevo no lado do dia, para a esfera não ler como disco.
      tmp.multiplyScalar(0.82 + 0.18 * Math.max(0, luz));
      cores.push(tmp.r, tmp.g, tmp.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cores, 3));
    g.add(malha(geo, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }), CENTRO.toArray() as [number, number, number]));
    // Eixo, Equador, trópicos e círculos polares, a tinta.
    const { eixo } = base();
    g.add(traco([CENTRO.clone().addScaledVector(eixo, -R * 1.35), CENTRO.clone().addScaledVector(eixo, R * 1.35)], c.tinta, 0.9));
    g.add(paralelo(0, c.tinta, 0.75));
    g.add(paralelo(-INCLINACAO, c.acento, 0.95));
    g.add(paralelo(INCLINACAO, c.tinta, 0.4));
    g.add(paralelo(90 - INCLINACAO, c.tinta, 0.3));
    g.add(paralelo(-(90 - INCLINACAO), c.tinta, 0.3));
    // Cidade: alfinete na latitude escolhida.
    const p = pontoNaLatitude(cidade.latitude);
    const saida = p.clone().sub(CENTRO).normalize();
    g.add(malha(new THREE.SphereGeometry(0.06, 16, 12), basic(c.acento, c.e ? 1.3 : 1), p.toArray() as [number, number, number], [0, 0, 0], false));
    g.add(traco([p, p.clone().addScaledVector(saida, 0.3)], c.acento));
    // Sol à esquerda, com raios paralelos até o globo.
    const sol = new THREE.Vector3(-3.3, CENTRO.y, 0);
    g.add(malha(new THREE.SphereGeometry(0.34, 32, 20), basic(c.e ? '#ffcf7a' : '#e8a13a', c.e ? 1.25 : 1), sol.toArray() as [number, number, number], [0, 0, 0], false));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaRadial('rgba(255,200,110,.55)', 'rgba(255,200,110,0)'), depthWrite: false }));
    halo.position.copy(sol); halo.scale.setScalar(1.6); g.add(halo);
    for (const dy of [-0.8, -0.4, 0, 0.4, 0.8]) {
      g.add(traco([new THREE.Vector3(sol.x + 0.5, CENTRO.y + dy, 0), new THREE.Vector3(CENTRO.x - Math.sqrt(R * R - dy * dy) - 0.08, CENTRO.y + dy, 0)], c.e ? '#ffcf7a' : '#b8741f', 0.5));
    }
    return g;
  }

  const foco3d = new THREE.Vector3(-0.3, 1.5, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      // Do Sol (x −3,6) à borda do globo (x 1,9): cerca de 5,6 de largura.
      const d = THREE.MathUtils.clamp(Math.max(3.1 / (Math.tan(meia) * (w / h)), 2.0 / Math.tan(meia)), 5, 16);
      camera.position.set(foco3d.x, foco3d.y + d * 0.2, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      cidade: () => { const p = pontoNaLatitude(cidade.latitude); return p.addScaledVector(p.clone().sub(CENTRO).normalize(), 0.42); },
      sol: () => new THREE.Vector3(-3.3, CENTRO.y + 0.62, 0),
      capricornio: () => pontoNaLatitude(-INCLINACAO, 62).add(new THREE.Vector3(0.1, -0.12, 0)),
      equador: () => pontoNaLatitude(0, 62).add(new THREE.Vector3(0.1, 0.14, 0)),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });

  return {
    definir(novoDia, novaCidade) {
      if (novoDia === dia && novaCidade.id === cidade.id) return;
      dia = novoDia; cidade = novaCidade;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
