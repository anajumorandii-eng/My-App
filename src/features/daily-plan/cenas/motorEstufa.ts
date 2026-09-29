import * as THREE from 'three';
import { fracaoAteODobro } from '../../../lib/efeitoEstufa';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, texturaRadial, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Atualidades: a Terra, a camada de gases e o calor que volta.
 *
 * A luz do Sol chega em traço reto; o calor que a Terra devolve sai em traço
 * ondulado, porque é outra radiação (infravermelha), e é essa que o CO₂
 * absorve. A camada engrossa e escurece com o logaritmo da concentração, a
 * mesma escala do forçamento, e mais ondas voltam para a Terra. O número de
 * ondas é esquema, não medida: a medida é o forçamento da leitura.
 */

export type IdRotulo = 'sol' | 'calor' | 'camada';

export interface CenaEstufa {
  definir(ppm: number): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const R = 1.15;
const CENTRO = new THREE.Vector3(0.9, 1.45, 0);
const ONDAS = 6;

function onda(de: THREE.Vector3, para: THREE.Vector3, amplitude = 0.06, voltas = 5) {
  const dir = para.clone().sub(de), l = dir.length();
  dir.normalize();
  const lado = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 60; i += 1) {
    const t = i / 60;
    pts.push(de.clone().addScaledVector(dir, t * l).addScaledVector(lado, Math.sin(t * voltas * 2 * Math.PI) * amplitude));
  }
  return pts;
}

export function montarEstufa(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  ppmInicial: number,
): CenaEstufa {
  let ppm = ppmInicial;
  const espessura = () => 0.12 + 0.3 * fracaoAteODobro(ppm);

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const f = fracaoAteODobro(ppm);
    const papel = new THREE.Color(c.e ? '#e9d2a6' : '#fbf4e4');
    const acento = new THREE.Color(c.acento);
    // Terra em papel tingido, com paralelos a tinta.
    g.add(malha(new THREE.SphereGeometry(R, 56, 40), std(`#${papel.clone().lerp(acento, c.e ? 0.3 : 0.35).getHexString()}`, 0, 0.75), CENTRO.toArray() as [number, number, number]));
    for (const lat of [-60, -30, 0, 30, 60]) {
      const r = R * Math.cos(THREE.MathUtils.degToRad(lat)) * 1.004, y = CENTRO.y + R * Math.sin(THREE.MathUtils.degToRad(lat)) * 1.004;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 72; i += 1) { const a = (i / 72) * Math.PI * 2; pts.push(new THREE.Vector3(CENTRO.x + Math.cos(a) * r, y, Math.sin(a) * r)); }
      g.add(traco(pts, c.tinta, lat === 0 ? 0.7 : 0.35));
    }
    // Camada de gases: casca translúcida que engrossa com o CO₂.
    const casca = new THREE.Mesh(new THREE.SphereGeometry(R + espessura(), 56, 40), basic(c.acento, 1, { transparent: true, opacity: 0.08 + 0.22 * f, depthWrite: false }));
    casca.position.copy(CENTRO); g.add(casca);
    // Sol à esquerda, luz em traço reto até a superfície.
    const sol = new THREE.Vector3(-3.1, CENTRO.y + 0.4, 0);
    g.add(malha(new THREE.SphereGeometry(0.34, 32, 20), basic(c.e ? '#ffcf7a' : '#e8a13a', c.e ? 1.25 : 1), sol.toArray() as [number, number, number], [0, 0, 0], false));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaRadial('rgba(255,200,110,.55)', 'rgba(255,200,110,0)'), depthWrite: false }));
    halo.position.copy(sol); halo.scale.setScalar(1.5); g.add(halo);
    const luz = c.e ? '#ffcf7a' : '#b8741f';
    for (const dy of [-0.5, 0, 0.5]) {
      const alvo = new THREE.Vector3(CENTRO.x - Math.sqrt(R * R - dy * dy), CENTRO.y + dy, 0);
      g.add(traco([sol.clone().add(new THREE.Vector3(0.45, dy * 0.3, 0)), alvo], luz, 0.8));
    }
    // Calor de volta: ondas saindo da superfície; as primeiras são retidas e voltam.
    const retidas = Math.round(1 + 3 * f);
    for (let i = 0; i < ONDAS; i += 1) {
      const a = THREE.MathUtils.degToRad(-25 + (i * 110) / (ONDAS - 1));
      const dir = new THREE.Vector3(Math.cos(a), Math.sin(a), 0.25).normalize();
      const de = CENTRO.clone().addScaledVector(dir, R + 0.02);
      const topo = CENTRO.clone().addScaledVector(dir, R + espessura());
      if (i < retidas) {
        g.add(traco(onda(de, topo, 0.035, 2), c.acento, 0.95));
        const volta = CENTRO.clone().addScaledVector(dir.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.18), R + 0.03);
        g.add(traco(onda(topo, volta, 0.035, 2), c.acento, 0.95));
      } else {
        g.add(traco(onda(de, CENTRO.clone().addScaledVector(dir, R + 1.25), 0.045, 5), c.acento, 0.55));
      }
    }
    return g;
  }

  const foco3d = new THREE.Vector3(-0.35, 1.5, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(3.2 / (Math.tan(meia) * (w / h)), 2.1 / Math.tan(meia)), 5, 16);
      camera.position.set(foco3d.x, foco3d.y + d * 0.18, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      sol: () => new THREE.Vector3(-3.1, CENTRO.y + 1.0, 0),
      camada: () => CENTRO.clone().add(new THREE.Vector3(0.35, R + espessura() + 0.3, 0)),
      calor: () => CENTRO.clone().add(new THREE.Vector3(R + 0.95, 0.15, 0)),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });

  return {
    definir(novo) {
      if (novo === ppm) return;
      ppm = novo;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
