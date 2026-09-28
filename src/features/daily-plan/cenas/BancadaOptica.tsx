import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { imagemDaLente, naturezaDaImagem, raiosNotaveis, type Ponto } from '../../../lib/lenteDelgada';
import { useCoresDaCena, type CoresDaCena } from './coresDaCena';

/**
 * Bancada óptica em 3D: a cena de Física do cartão do Hoje.
 *
 * Não é ilustração: a posição e o tamanho da imagem no anteparo saem de
 * lenteDelgada.ts (1/f = 1/p + 1/p'), o mesmo módulo que o node:test confere.
 * Arrastar o objeto pelo trilho, ou usar o controle abaixo da cena, move a
 * imagem como numa bancada de verdade.
 *
 * Escala: 1 unidade da cena = 5 cm. Foco de 10 cm.
 */

const CM_POR_UNIDADE = 5;
const FOCO = 2;
const ALTURA_OBJETO = 1.1;
const EIXO = 1.35;
const P_MIN = 3.2;
const P_MAX = 8;
const P_INICIAL = 5;

const fmt = (valor: number) => valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

function Ambiente() {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Reflexos de estúdio para o vidro e o latão. Sem eles a lente com
    // transmissão fica cinza e chapada.
    const pmrem = new THREE.PMREMGenerator(gl);
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = ambiente;
    return () => { scene.environment = null; ambiente.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
}

/** Cilindro entre dois pontos: é assim que os raios e o eixo viram volume. */
function Segmento({ de, ate, raio, cor, opacidade = 1, brilho = 2 }: { de: THREE.Vector3; ate: THREE.Vector3; raio: number; cor: string; opacidade?: number; brilho?: number }) {
  const { posicao, quaternion, comprimento } = useMemo(() => {
    const direcao = new THREE.Vector3().subVectors(ate, de);
    return {
      posicao: new THREE.Vector3().addVectors(de, ate).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao.clone().normalize()),
      comprimento: direcao.length(),
    };
  }, [de, ate]);
  return (
    <mesh position={posicao} quaternion={quaternion}>
      <cylinderGeometry args={[raio, raio, comprimento, 10, 1, true]} />
      {/* Sem iluminação: o raio é a própria luz. Com material iluminado, a luz
          da cena somava à cor e o raio escurecido para o tema claro voltava a
          ficar ciano-claro sobre o creme. */}
      <meshBasicMaterial color={new THREE.Color(cor).multiplyScalar(Math.min(brilho, 1.6))} transparent={opacidade < 1} opacity={opacidade} depthWrite={opacidade >= 1} toneMapped={false} />
    </mesh>
  );
}

/** Textura de halo radial, gerada uma vez: faz as fontes de luz "vazarem" sem pós-processamento. */
let texturaHalo: THREE.Texture | null = null;
function halo() {
  if (texturaHalo) return texturaHalo;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,.45)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  texturaHalo = new THREE.CanvasTexture(canvas);
  return texturaHalo;
}

function Halo({ posicao, cor, escala, opacidade = 0.8 }: { posicao: [number, number, number]; cor: string; escala: number; opacidade?: number }) {
  const mapa = useMemo(halo, []);
  return (
    <sprite position={posicao} scale={[escala, escala, 1]}>
      <spriteMaterial map={mapa} color={cor} transparent opacity={opacidade} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
}

const noEixo = (ponto: Ponto) => new THREE.Vector3(ponto.x, EIXO + ponto.y, 0);

function Raios({ p, cores }: { p: number; cores: CoresDaCena }) {
  const raios = useMemo(() => raiosNotaveis(p, FOCO, ALTURA_OBJETO), [p]);
  return (
    <group>
      {raios.map((raio, i) => raio.slice(1).map((ponto, j) => {
        const de = noEixo(raio[j]);
        const ate = noEixo(ponto);
        return (
          <group key={`${i}-${j}`}>
            <Segmento de={de} ate={ate} raio={0.014} cor={cores.raioNucleo} brilho={3 * cores.brilho} />
            <Segmento de={de} ate={ate} raio={0.055} cor={cores.raio} opacidade={0.22} brilho={2.2 * cores.brilho} />
          </group>
        );
      }))}
    </group>
  );
}

function Seta({ altura, cor, invertida = false, brilho = 1 }: { altura: number; cor: string; invertida?: boolean; brilho?: number }) {
  const sinal = invertida ? -1 : 1;
  const haste = Math.max(altura - 0.22, 0.05);
  return (
    <group>
      <mesh position={[0, sinal * haste / 2, 0]}>
        <cylinderGeometry args={[0.035, 0.035, haste, 12]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.4 * brilho} toneMapped={false} />
      </mesh>
      <mesh position={[0, sinal * (haste + 0.11), 0]} rotation={[invertida ? Math.PI : 0, 0, 0]}>
        <coneGeometry args={[0.1, 0.22, 16]} />
        <meshStandardMaterial color={cor} emissive={cor} emissiveIntensity={2.4 * brilho} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Carro que desliza no trilho, com a haste até o eixo óptico. */
function Carro({ x, altura, cores }: { x: number; altura: number; cores: CoresDaCena }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.2, 1.05]} />
        <meshStandardMaterial color={cores.metalEscuro} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.2, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 16]} />
        <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.3 + altura / 2, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, altura, 16]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Lente({ cores }: { cores: CoresDaCena }) {
  const geometria = useMemo(() => {
    // Perfil biconvexo girado em torno do eixo: mais grossa no centro, fina na borda.
    const raio = 1.05, espessura = 0.2, passos = 24;
    const pontos: THREE.Vector2[] = [];
    for (let i = 0; i <= passos; i += 1) {
      const r = (raio * i) / passos;
      pontos.push(new THREE.Vector2(r, -espessura * (1 - (r / raio) ** 2) - 0.01));
    }
    for (let i = passos; i >= 0; i -= 1) {
      const r = (raio * i) / passos;
      pontos.push(new THREE.Vector2(r, espessura * (1 - (r / raio) ** 2) + 0.01));
    }
    const lathe = new THREE.LatheGeometry(pontos, 64);
    lathe.rotateZ(-Math.PI / 2);
    return lathe;
  }, []);
  return (
    <group position={[0, EIXO, 0]}>
      <mesh geometry={geometria} castShadow>
        <meshPhysicalMaterial color={cores.vidro} transmission={1} thickness={0.6} roughness={0.03} ior={1.52} clearcoat={1} clearcoatRoughness={0.05} attenuationColor={cores.vidro} attenuationDistance={3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[1.1, 0.075, 20, 72]} />
        <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.28} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, Math.cos((i * Math.PI) / 2) * 1.1, Math.sin((i * Math.PI) / 2) * 1.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 12]} />
          <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function Anteparo({ pLinha, aumento, cores }: { pLinha: number; aumento: number; cores: CoresDaCena }) {
  return (
    <group position={[pLinha, 0, 0]}>
      <mesh position={[0.04, EIXO, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 2.5, 2.1]} />
        <meshStandardMaterial color={cores.anteparo} roughness={0.85} metalness={0} />
      </mesh>
      {/* Moldura em quatro barras. Um box em wireframe mostrava as diagonais
          dos triângulos, e o anteparo parecia rachado. */}
      {[[0, 1.3, 0, 2.24, 0.07], [0, -1.3, 0, 2.24, 0.07], [0, 0, 1.08, 0.07, 2.6], [0, 0, -1.08, 0.07, 2.6]].map(([_, y, z, largura, altura], i) => (
        <mesh key={i} position={[0.04, EIXO + y, z]} castShadow>
          <boxGeometry args={[0.09, altura, largura]} />
          <meshStandardMaterial color={cores.metalEscuro} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <group position={[-0.01, EIXO, 0]}>
        <Seta altura={Math.abs(aumento) * ALTURA_OBJETO} cor={cores.imagem} invertida brilho={cores.brilho} />
        <Halo posicao={[-0.05, aumento * ALTURA_OBJETO, 0]} cor={cores.imagem} escala={0.9} opacidade={cores.escuro ? 0.85 : 0.45} />
      </group>
    </group>
  );
}

function Trilho({ cores }: { cores: CoresDaCena }) {
  const marcas = useRef<THREE.InstancedMesh>(null);
  const inicio = -9, fim = 7.5;
  const total = Math.round((fim - inicio) / 0.2) + 1;
  useEffect(() => {
    const malha = marcas.current;
    if (!malha) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < total; i += 1) {
      const x = inicio + i * 0.2;
      const longa = Math.abs(x - Math.round(x)) < 1e-6;
      m.compose(new THREE.Vector3(x, 0.101, 0.42), new THREE.Quaternion(), new THREE.Vector3(1, 1, longa ? 1.8 : 1));
      malha.setMatrixAt(i, m);
    }
    malha.instanceMatrix.needsUpdate = true;
  }, [total]);
  return (
    <group>
      <mesh position={[(inicio + fim) / 2, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[fim - inicio, 0.2, 0.95]} />
        <meshStandardMaterial color={cores.metalEscuro} metalness={0.65} roughness={0.42} />
      </mesh>
      <mesh position={[(inicio + fim) / 2, 0.105, 0]}>
        <boxGeometry args={[fim - inicio, 0.012, 0.28]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.3} />
      </mesh>
      <instancedMesh ref={marcas} args={[undefined, undefined, total]}>
        <boxGeometry args={[0.012, 0.004, 0.06]} />
        <meshBasicMaterial color={cores.marca} />
      </instancedMesh>
    </group>
  );
}

function EixoEFocos({ cores }: { cores: CoresDaCena }) {
  return (
    <group>
      <Segmento de={new THREE.Vector3(-8.8, EIXO, 0)} ate={new THREE.Vector3(7.3, EIXO, 0)} raio={0.006} cor={cores.eixo} opacidade={0.5} brilho={1} />
      {[-FOCO, FOCO].map((x) => <Halo key={`h${x}`} posicao={[x, EIXO, 0]} cor={cores.raio} escala={0.55} opacidade={cores.escuro ? 0.8 : 0.4} />)}
      {[-FOCO, FOCO].map((x) => (
        <mesh key={x} position={[x, EIXO, 0]}>
          <sphereGeometry args={[0.06, 20, 20]} />
          <meshStandardMaterial color={cores.raio} emissive={cores.raio} emissiveIntensity={3 * cores.brilho} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Posiciona rótulos HTML sobre pontos da cena. Texto em HTML, e não em 3D,
 * para usar a fonte do app e ser lido por leitor de tela.
 */
function Rotulos({ alvos }: { alvos: { ref: React.RefObject<HTMLSpanElement | null>; ponto: () => THREE.Vector3 }[] }) {
  const { camera, size } = useThree();
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    // A matriz da câmera só se atualiza no render, depois deste quadro. Sem
    // atualizar aqui, os rótulos saíam na posição do quadro anterior — e com
    // movimento reduzido, em que a cena só redesenha sob demanda, ficavam
    // fora da cena para sempre.
    camera.updateMatrixWorld();
    for (const alvo of alvos) {
      const el = alvo.ref.current;
      if (!el) continue;
      v.copy(alvo.ponto()).project(camera);
      // Preso dentro da cena, como o clamp do SceneNote: no celular o objeto
      // fica perto da borda e o rótulo saía pela metade.
      const meia = el.offsetWidth / 2 + 4;
      const x = THREE.MathUtils.clamp(((v.x + 1) / 2) * size.width, meia, size.width - meia);
      const y = Math.max(((1 - v.y) / 2) * size.height, el.offsetHeight + 4);
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    }
  });
  return null;
}

function Camera({ movimento }: { movimento: boolean }) {
  const { camera, size } = useThree();
  const alvo = useMemo(() => new THREE.Vector3(-1.0, 1.3, 0), []);
  useFrame(({ clock }) => {
    // Câmera baixa, na diagonal do trilho: o objeto grande em primeiro plano,
    // a lente no meio e o anteparo ao fundo. De frente, a bancada inteira
    // cabia na coluna mas virava um risco fino; a profundidade é que dá escala.
    // A distância acompanha a proporção da coluna (iPad e celular diferem).
    const perspectiva = camera as THREE.PerspectiveCamera;
    const meiaAbertura = THREE.MathUtils.degToRad(perspectiva.fov / 2);
    const aspecto = size.width / Math.max(size.height, 1);
    const distancia = THREE.MathUtils.clamp(4.9 / (Math.tan(meiaAbertura) * aspecto), 8, 18);
    // Um travelling lento, como na apresentação de um produto. Parado para
    // quem pede movimento reduzido.
    const t = movimento ? clock.getElapsedTime() : 0;
    const angulo = -0.66 + Math.sin(t * 0.1) * 0.08;
    camera.position.set(alvo.x + Math.sin(angulo) * distancia, alvo.y + distancia * (0.2 + Math.sin(t * 0.07) * 0.015), Math.cos(angulo) * distancia);
    camera.lookAt(alvo);
  });
  return null;
}

function Cena({ p, onP, cores, movimento, rotulos }: {
  p: number;
  onP: (p: number) => void;
  cores: CoresDaCena;
  movimento: boolean;
  rotulos: { ref: React.RefObject<HTMLSpanElement | null>; ponto: () => THREE.Vector3 }[];
}) {
  const imagem = imagemDaLente(p, FOCO)!;
  const arrastando = useRef(false);
  const planoArraste = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ponto = useMemo(() => new THREE.Vector3(), []);
  const mover = (evento: ThreeEvent<PointerEvent>) => {
    if (!arrastando.current) return;
    if (evento.ray.intersectPlane(planoArraste, ponto)) onP(THREE.MathUtils.clamp(-ponto.x, P_MIN, P_MAX));
  };
  return (
    <>
      <Ambiente />
      <Camera movimento={movimento} />
      <Rotulos alvos={rotulos} />
      <hemisphereLight args={[cores.ceu, cores.chao, 0.55]} />
      <directionalLight position={[-4, 9, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={6} shadow-camera-bottom={-4} />
      <pointLight position={[-p, EIXO + ALTURA_OBJETO, 0.3]} color={cores.objeto} intensity={4} distance={4} />

      <Trilho cores={cores} />
      <EixoEFocos cores={cores} />
      <Carro x={0} altura={EIXO - 1.2} cores={cores} />
      <Lente cores={cores} />

      <group
        onPointerDown={(e) => { e.stopPropagation(); arrastando.current = true; (e.target as Element | null)?.setPointerCapture?.(e.pointerId); }}
        onPointerUp={() => { arrastando.current = false; }}
        onPointerMove={mover}
      >
        <Carro x={-p} altura={EIXO - 0.3} cores={cores} />
        <group position={[-p, EIXO, 0]}>
          <Seta altura={ALTURA_OBJETO} cor={cores.objeto} brilho={cores.brilho} />
          <Halo posicao={[0, ALTURA_OBJETO, 0]} cor={cores.objeto} escala={1.1} opacidade={cores.escuro ? 0.9 : 0.5} />
          {/* Área de toque maior que a seta fina, para o dedo achar o objeto. */}
          <mesh>
            <boxGeometry args={[0.9, 3, 1.4]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
      </group>
      {/* Plano invisível que recebe o arraste quando o ponteiro sai da seta. */}
      <mesh position={[-1, EIXO, 0]} onPointerMove={mover} onPointerUp={() => { arrastando.current = false; }}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Raios p={p} cores={cores} />
      <Anteparo pLinha={imagem.pLinha} aumento={imagem.aumento} cores={cores} />
      <Carro x={imagem.pLinha} altura={EIXO - 1.2} cores={cores} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <shadowMaterial opacity={0.28} />
      </mesh>
    </>
  );
}

export default function BancadaOptica() {
  const reduzido = useReducedMotion() ?? false;
  const cores = useCoresDaCena();
  const [p, setP] = useState(reduzido ? P_INICIAL : P_MAX);
  const [visivel, setVisivel] = useState(true);
  const caixa = useRef<HTMLDivElement>(null);
  const rotuloF = useRef<HTMLSpanElement>(null);
  const rotuloF2 = useRef<HTMLSpanElement>(null);
  const rotuloObjeto = useRef<HTMLSpanElement>(null);
  const rotuloImagem = useRef<HTMLSpanElement>(null);
  const pRef = useRef(p);
  pRef.current = p;

  // Entrada de cena: o objeto desliza até a posição inicial e a imagem se
  // forma no anteparo enquanto ele anda.
  useEffect(() => {
    if (reduzido) return;
    let quadro = 0;
    const inicio = performance.now();
    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / 1800, 1);
      const suave = 1 - (1 - t) ** 3;
      setP(P_MAX + (P_INICIAL - P_MAX) * suave);
      if (t < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [reduzido]);

  // Fora da tela, a cena para de desenhar: poupa bateria no iPad.
  useEffect(() => {
    const el = caixa.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const imagem = imagemDaLente(p, FOCO)!;
  const rotulos = useMemo(() => [
    { ref: rotuloF, ponto: () => new THREE.Vector3(-FOCO, EIXO - 0.25, 0) },
    { ref: rotuloF2, ponto: () => new THREE.Vector3(FOCO, EIXO - 0.25, 0) },
    { ref: rotuloObjeto, ponto: () => new THREE.Vector3(-pRef.current, EIXO + ALTURA_OBJETO + 0.35, 0) },
    { ref: rotuloImagem, ponto: () => {
      const im = imagemDaLente(pRef.current, FOCO)!;
      return new THREE.Vector3(im.pLinha, EIXO + 1.55, 0);
    } },
  ], []);

  const descricao = `Bancada óptica: objeto a ${fmt(p * CM_POR_UNIDADE)} cm de uma lente convergente de foco ${FOCO * CM_POR_UNIDADE} cm; imagem ${naturezaDaImagem(imagem)}, a ${fmt(imagem.pLinha * CM_POR_UNIDADE)} cm da lente.`;

  return (
    <figure ref={caixa} className="crivo-cena crivo-cena--optica" aria-label={descricao}>
      <div className="crivo-cena__palco" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          camera={{ fov: 28, near: 0.1, far: 160, position: [-4, 6, 24] }}
          frameloop={visivel ? (reduzido ? 'demand' : 'always') : 'never'}
          style={{ touchAction: 'pan-y' }}
        >
          <Cena p={p} onP={setP} cores={cores} movimento={!reduzido} rotulos={rotulos} />
        </Canvas>
        <span ref={rotuloF} className="crivo-cena__rotulo">F</span>
        <span ref={rotuloF2} className="crivo-cena__rotulo">F′</span>
        <span ref={rotuloObjeto} className="crivo-cena__rotulo crivo-cena__rotulo--forte">objeto</span>
        <span ref={rotuloImagem} className="crivo-cena__rotulo crivo-cena__rotulo--forte">imagem</span>
      </div>
      <figcaption className="crivo-cena__painel">
        <label className="crivo-cena__controle">
          <span>Distância do objeto</span>
          <input
            type="range"
            min={P_MIN * CM_POR_UNIDADE}
            max={P_MAX * CM_POR_UNIDADE}
            step={1}
            value={Math.round(p * CM_POR_UNIDADE)}
            onChange={(e) => setP(Number(e.target.value) / CM_POR_UNIDADE)}
          />
        </label>
        <p className="crivo-cena__leitura">
          <b>p = {fmt(p * CM_POR_UNIDADE)} cm</b> · p′ = {fmt(imagem.pLinha * CM_POR_UNIDADE)} cm · f = {FOCO * CM_POR_UNIDADE} cm
          <span>imagem {naturezaDaImagem(imagem)}</span>
        </p>
      </figcaption>
    </figure>
  );
}
