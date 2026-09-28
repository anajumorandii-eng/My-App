import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
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
 * O objeto é o de uma bancada real: uma caixa de luz com a seta recortada na
 * face, e a imagem é essa seta projetada no anteparo.
 *
 * Escala: 1 unidade da cena = 5 cm. Foco de 10 cm.
 */

const CM_POR_UNIDADE = 5;
const FOCO = 2;
const ALTURA_OBJETO = 1.1;
const EIXO = 1.35;
const RAIO_LENTE = 1.05;
const P_MIN = 3.2;
const P_MAX = 8;
const P_INICIAL = 5;
const TRILHO_INICIO = -9.6;
const TRILHO_FIM = 7.6;

const fmt = (valor: number) => valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const noEixo = (ponto: Ponto) => new THREE.Vector3(ponto.x, EIXO + ponto.y, 0);

function Ambiente() {
  const { gl, scene } = useThree();
  useEffect(() => {
    // Reflexos de estúdio para o vidro e o latão. Sem eles a lente com
    // transmissão fica cinza e chapada.
    const pmrem = new THREE.PMREMGenerator(gl);
    const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = ambiente;
    scene.environmentIntensity = 0.45;
    return () => { scene.environment = null; ambiente.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
}

/**
 * Brilho das fontes de luz, como a câmera do vídeo de referência.
 *
 * Só no escuro: no claro, o fundo creme passa do limiar de luminância e a cena
 * inteira estouraria. A profundidade de campo (BokehPass) foi testada e saiu:
 * serrilhava as bordas do anteparo e custava uma passada inteira a mais.
 */
function PosProcesso({ cores }: { cores: CoresDaCena }) {
  const { gl, scene, camera, size } = useThree();
  const cadeia = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    // Limiar alto: brilham a seta, os raios e os focos, que são luz; o latão
    // e o anteparo, que só refletem, ficam de fora.
    const brilho = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.4, 0.92);
    composer.addPass(brilho);
    composer.addPass(new OutputPass());
    return { composer, brilho };
  }, [gl, scene, camera]);

  useEffect(() => {
    cadeia.composer.setPixelRatio(gl.getPixelRatio());
    cadeia.composer.setSize(size.width, size.height);
  }, [cadeia, gl, size]);
  useEffect(() => {
    cadeia.brilho.enabled = cores.escuro;
  }, [cadeia, cores.escuro]);
  useEffect(() => () => cadeia.composer.dispose(), [cadeia]);

  useFrame(() => {
    cadeia.composer.render();
  }, 1);
  return null;
}

/** Textura de halo radial, gerada uma vez: o brilho em volta das fontes de luz. */
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

/** Cilindro entre dois pontos: é assim que os raios e o eixo viram volume. */
function Segmento({ de, ate, raio, cor, opacidade = 1, brilho = 1 }: { de: THREE.Vector3; ate: THREE.Vector3; raio: number; cor: string; opacidade?: number; brilho?: number }) {
  const { posicao, quaternion, comprimento } = useMemo(() => {
    const direcao = new THREE.Vector3().subVectors(ate, de);
    return {
      posicao: new THREE.Vector3().addVectors(de, ate).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao.clone().normalize()),
      comprimento: direcao.length(),
    };
  }, [de, ate]);
  const cor3 = useMemo(() => new THREE.Color(cor).multiplyScalar(brilho), [cor, brilho]);
  return (
    <mesh position={posicao} quaternion={quaternion}>
      <cylinderGeometry args={[raio, raio, comprimento, 10, 1, true]} />
      {/* Sem iluminação: o raio é a própria luz. Com material iluminado, a luz
          da cena somava à cor e o raio escurecido para o tema claro voltava a
          ficar claro sobre o creme. */}
      <meshBasicMaterial color={cor3} transparent={opacidade < 1} opacity={opacidade} depthWrite={opacidade >= 1} toneMapped={false} />
    </mesh>
  );
}

/**
 * O feixe inteiro, não só os três raios: um cone de luz do topo do objeto até
 * a borda da lente, e outro da lente até o topo da imagem. É o que se vê numa
 * sala escura com fumaça, e o que dá corpo à convergência.
 */
function Feixe({ de, ate, cores }: { de: THREE.Vector3; ate: THREE.Vector3; cores: CoresDaCena }) {
  const geometria = useMemo(() => {
    const segmentos = 48;
    const posicoes: number[] = [];
    const disco = (i: number) => {
      const a = (i / segmentos) * Math.PI * 2;
      return [0, EIXO + Math.cos(a) * RAIO_LENTE * 0.96, Math.sin(a) * RAIO_LENTE * 0.96];
    };
    for (const apice of [de, ate]) {
      for (let i = 0; i < segmentos; i += 1) {
        posicoes.push(apice.x, apice.y, apice.z, ...disco(i), ...disco(i + 1));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(posicoes, 3));
    return g;
  }, [de, ate]);
  useEffect(() => () => geometria.dispose(), [geometria]);
  return (
    <mesh geometry={geometria}>
      <meshBasicMaterial
        color={cores.raio}
        transparent
        opacity={cores.escuro ? 0.045 : 0.07}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={cores.escuro ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

function Raios({ p, cores }: { p: number; cores: CoresDaCena }) {
  const raios = useMemo(() => raiosNotaveis(p, FOCO, ALTURA_OBJETO), [p]);
  return (
    <group>
      <Feixe de={noEixo(raios[0][0])} ate={noEixo(raios[0][2])} cores={cores} />
      {raios.map((raio, i) => raio.slice(1).map((ponto, j) => {
        const de = noEixo(raio[j]);
        const ate = noEixo(ponto);
        return (
          <group key={`${i}-${j}`}>
            <Segmento de={de} ate={ate} raio={0.012} cor={cores.raioNucleo} brilho={cores.escuro ? 1.25 : 1} />
            <Segmento de={de} ate={ate} raio={0.045} cor={cores.raio} opacidade={0.22} brilho={cores.escuro ? 1.3 : 1} />
          </group>
        );
      }))}
    </group>
  );
}

/** Contorno de seta em 2D: a máscara da caixa de luz e a imagem no anteparo. */
function formaDeSeta(altura: number) {
  const haste = 0.07, larguraPonta = 0.26, ponta = 0.3;
  const s = new THREE.Shape();
  s.moveTo(-haste / 2, 0);
  s.lineTo(haste / 2, 0);
  s.lineTo(haste / 2, altura - ponta);
  s.lineTo(larguraPonta / 2, altura - ponta);
  s.lineTo(0, altura);
  s.lineTo(-larguraPonta / 2, altura - ponta);
  s.lineTo(-haste / 2, altura - ponta);
  s.closePath();
  return s;
}

function SetaLuminosa({ altura, cor, intensidade }: { altura: number; cor: string; intensidade: number }) {
  const geometria = useMemo(() => new THREE.ShapeGeometry(formaDeSeta(altura)), [altura]);
  useEffect(() => () => geometria.dispose(), [geometria]);
  const cor3 = useMemo(() => new THREE.Color(cor).multiplyScalar(intensidade), [cor, intensidade]);
  return (
    <mesh geometry={geometria}>
      <meshBasicMaterial color={cor3} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Botão serrilhado de aperto, dos carros e da lente. Facetado de propósito: é o serrilhado. */
function Botao({ posicao, raio = 0.08, cores }: { posicao: [number, number, number]; raio?: number; cores: CoresDaCena }) {
  return (
    <group position={posicao} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[raio, raio, 0.09, 18]} />
        <meshStandardMaterial color={cores.metalEscuro} metalness={0.6} roughness={0.45} flatShading />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[raio * 0.55, raio * 0.55, 0.02, 24]} />
        <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

/** Carro que desliza no trilho, com trava serrilhada e a haste até a peça. */
function Carro({ x, altura, cores }: { x: number; altura: number; cores: CoresDaCena }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.22, 1.12]} />
        <meshStandardMaterial color={cores.metalEscuro} metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.64, 0.03, 1.14]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.25} />
      </mesh>
      <Botao posicao={[0, 0.3, 0.62]} cores={cores} />
      <mesh position={[0, 0.41 + altura / 2, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, altura, 20]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 0.06, 20]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

/** O objeto: caixa de luz com a seta recortada na face voltada para a lente. */
function CaixaDeLuz({ p, cores }: { p: number; cores: CoresDaCena }) {
  const altura = ALTURA_OBJETO + 0.55;
  const baseCaixa = EIXO - 0.35;
  return (
    <group position={[-p, 0, 0]}>
      <Carro x={0} altura={baseCaixa - 0.44} cores={cores} />
      <group position={[-0.24, baseCaixa + altura / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.46, altura, 0.8]} />
          <meshStandardMaterial color={cores.metalEscuro} metalness={0.55} roughness={0.4} />
        </mesh>
        {/* Aletas de ventilação no topo, como numa lâmpada de bancada. */}
        {[-0.2, -0.07, 0.06, 0.19].map((z) => (
          <mesh key={z} position={[0, altura / 2 + 0.03, z * 0.8]}>
            <boxGeometry args={[0.36, 0.06, 0.04]} />
            <meshStandardMaterial color={cores.aco} metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0.235, 0, 0]}>
          <boxGeometry args={[0.02, altura - 0.12, 0.7]} />
          <meshStandardMaterial color="#0d0f10" metalness={0.2} roughness={0.6} />
        </mesh>
      </group>
      <group position={[0.012, EIXO, 0]} rotation={[0, Math.PI / 2, 0]}>
        <SetaLuminosa altura={ALTURA_OBJETO} cor={cores.objeto} intensidade={cores.escuro ? 2.2 : 1.3} />
      </group>
      <Halo posicao={[0.05, EIXO + ALTURA_OBJETO * 0.55, 0]} cor={cores.objeto} escala={1.6} opacidade={cores.escuro ? 0.4 : 0.25} />
      <pointLight position={[0.4, EIXO + ALTURA_OBJETO * 0.6, 0]} color={cores.objeto} intensity={cores.escuro ? 6 : 3} distance={5} decay={2} />
    </group>
  );
}

function Lente({ cores }: { cores: CoresDaCena }) {
  const geometria = useMemo(() => {
    // Perfil biconvexo girado em torno do eixo: mais grossa no centro, fina na borda.
    const espessura = 0.2, passos = 28;
    const pontos: THREE.Vector2[] = [];
    for (let i = 0; i <= passos; i += 1) {
      const r = (RAIO_LENTE * i) / passos;
      pontos.push(new THREE.Vector2(r, -espessura * (1 - (r / RAIO_LENTE) ** 2) - 0.01));
    }
    for (let i = passos; i >= 0; i -= 1) {
      const r = (RAIO_LENTE * i) / passos;
      pontos.push(new THREE.Vector2(r, espessura * (1 - (r / RAIO_LENTE) ** 2) + 0.01));
    }
    const lathe = new THREE.LatheGeometry(pontos, 72);
    lathe.rotateZ(-Math.PI / 2);
    return lathe;
  }, []);
  return (
    <group>
      <Carro x={0} altura={EIXO - RAIO_LENTE - 0.55} cores={cores} />
      <group position={[0, EIXO, 0]}>
        <mesh geometry={geometria} castShadow>
          <meshPhysicalMaterial
            color={cores.vidro}
            transmission={1}
            thickness={0.7}
            roughness={0.02}
            ior={1.52}
            dispersion={4}
            clearcoat={1}
            clearcoatRoughness={0.03}
            iridescence={0.25}
            iridescenceIOR={1.3}
            attenuationColor={cores.vidro}
            attenuationDistance={3}
          />
        </mesh>
        {/* Anel duplo de latão, com a borda serrilhada de ajuste. */}
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[RAIO_LENTE + 0.06, 0.07, 24, 96]} />
          <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.22} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[RAIO_LENTE + 0.13, RAIO_LENTE + 0.13, 0.12, 96, 1, true]} />
          <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.35} flatShading side={THREE.DoubleSide} />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[0.07, Math.cos((i * Math.PI) / 3) * (RAIO_LENTE + 0.13), Math.sin((i * Math.PI) / 3) * (RAIO_LENTE + 0.13)]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 0.05, 12]} />
            <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.15} />
          </mesh>
        ))}
        {/* Garfo que segura o anel, até a haste do carro. */}
        <mesh position={[0, -RAIO_LENTE - 0.25, 0]} castShadow>
          <boxGeometry args={[0.14, 0.3, 0.26]} />
          <meshStandardMaterial color={cores.latao} metalness={1} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function Anteparo({ pLinha, aumento, cores }: { pLinha: number; aumento: number; cores: CoresDaCena }) {
  const alturaImagem = Math.abs(aumento) * ALTURA_OBJETO;
  return (
    <group position={[pLinha, 0, 0]}>
      <Carro x={0} altura={EIXO - 1.5} cores={cores} />
      <mesh position={[0.05, EIXO, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.04, 2.7, 2.3]} />
        <meshStandardMaterial color={cores.anteparo} roughness={0.95} metalness={0} />
      </mesh>
      {/* Moldura em quatro barras. Um box em wireframe mostrava as diagonais
          dos triângulos, e o anteparo parecia rachado. */}
      {([[1.39, 2.46, 0.08], [-1.39, 2.46, 0.08]] as const).map(([y, largura, altura], i) => (
        <mesh key={i} position={[0.06, EIXO + y, 0]} castShadow>
          <boxGeometry args={[0.1, altura, largura]} />
          <meshStandardMaterial color={cores.metalEscuro} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {[1.19, -1.19].map((z) => (
        <mesh key={z} position={[0.06, EIXO, z]} castShadow>
          <boxGeometry args={[0.1, 2.86, 0.08]} />
          <meshStandardMaterial color={cores.metalEscuro} metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {/* A imagem: a seta da caixa de luz, invertida e na escala do aumento. */}
      <group position={[0.025, EIXO, 0]} rotation={[Math.PI, Math.PI / 2, 0]}>
        <SetaLuminosa altura={alturaImagem} cor={cores.imagem} intensidade={cores.escuro ? 1.8 : 1} />
      </group>
      <Halo posicao={[0, EIXO - alturaImagem * 0.55, 0]} cor={cores.imagem} escala={1.2 + alturaImagem} opacidade={cores.escuro ? 0.5 : 0.25} />
    </group>
  );
}

/** Régua gravada no trilho: um traço por centímetro, número a cada 10. */
function useTexturaDaRegua(cores: CoresDaCena) {
  return useMemo(() => {
    const cm = (TRILHO_FIM - TRILHO_INICIO) * CM_POR_UNIDADE;
    const pxPorCm = 24;
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(cm * pxPorCm);
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = cores.escuro ? '#1d2022' : '#2a2d31';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = cores.marca;
    ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= cm; i += 1) {
      const x = i * pxPorCm;
      const altura = i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11;
      ctx.fillRect(x - 1, 0, 2, altura);
      if (i % 10 === 0 && i > 0 && i < cm) ctx.fillText(String(i), x, 58);
    }
    const textura = new THREE.CanvasTexture(canvas);
    textura.anisotropy = 8;
    textura.colorSpace = THREE.SRGBColorSpace;
    return textura;
  }, [cores.escuro, cores.marca]);
}

function Trilho({ cores }: { cores: CoresDaCena }) {
  const regua = useTexturaDaRegua(cores);
  const perfil = useMemo(() => {
    // Perfil em cauda de andorinha, extrudado ao longo do trilho.
    const s = new THREE.Shape();
    s.moveTo(-0.5, -0.12);
    s.lineTo(0.5, -0.12);
    s.lineTo(0.5, 0.04);
    s.lineTo(0.3, 0.19);
    s.lineTo(-0.3, 0.19);
    s.lineTo(-0.5, 0.04);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: TRILHO_FIM - TRILHO_INICIO, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    g.rotateY(Math.PI / 2);
    g.translate(TRILHO_INICIO, 0, 0);
    return g;
  }, []);
  useEffect(() => () => perfil.dispose(), [perfil]);
  const comprimento = TRILHO_FIM - TRILHO_INICIO;
  return (
    <group>
      <mesh geometry={perfil} receiveShadow castShadow>
        <meshStandardMaterial color={cores.metalEscuro} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[(TRILHO_INICIO + TRILHO_FIM) / 2, 0.195, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[comprimento, 0.6]} />
        <meshStandardMaterial color={cores.aco} metalness={1} roughness={0.28} />
      </mesh>
      {/* Régua na face inclinada voltada para a câmera. */}
      <mesh position={[(TRILHO_INICIO + TRILHO_FIM) / 2, 0.115, 0.4]} rotation={[-Math.atan2(0.15, 0.2), 0, 0]}>
        <planeGeometry args={[comprimento, 0.24]} />
        <meshStandardMaterial map={regua} metalness={0.3} roughness={0.5} />
      </mesh>
      {[TRILHO_INICIO + 0.4, TRILHO_FIM - 0.4].map((x) => (
        <mesh key={x} position={[x, -0.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.16, 1.5]} />
          <meshStandardMaterial color={cores.metalEscuro} metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function Estudio({ cores }: { cores: CoresDaCena }) {
  return (
    <group>
      {/* Mesa de estúdio, lisa e um pouco reflexiva; a névoa da cena apaga o
          horizonte e a bancada fica isolada, como numa foto de produto. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]} receiveShadow>
        <planeGeometry args={[80, 40]} />
        <meshStandardMaterial color={cores.mesa} roughness={0.7} metalness={0} />
      </mesh>
    </group>
  );
}

function EixoEFocos({ cores }: { cores: CoresDaCena }) {
  return (
    <group>
      <Segmento de={new THREE.Vector3(TRILHO_INICIO + 0.6, EIXO, 0)} ate={new THREE.Vector3(TRILHO_FIM - 0.3, EIXO, 0)} raio={0.005} cor={cores.eixo} opacidade={0.45} />
      {[-FOCO, FOCO].map((x) => (
        <group key={x} position={[x, EIXO, 0]}>
          <mesh>
            <sphereGeometry args={[0.055, 20, 20]} />
            <meshBasicMaterial color={new THREE.Color(cores.raio).multiplyScalar(cores.escuro ? 1.6 : 1)} toneMapped={false} />
          </mesh>
          <Halo posicao={[0, 0, 0]} cor={cores.raio} escala={0.5} opacidade={cores.escuro ? 0.7 : 0.35} />
        </group>
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
  const alvo = useMemo(() => new THREE.Vector3(-1.5, 1.25, 0), []);
  useFrame(({ clock }) => {
    // Câmera baixa, na diagonal do trilho: a caixa de luz em primeiro plano,
    // a lente no meio e o anteparo ao fundo. De frente, a bancada inteira
    // cabia na coluna mas virava um risco fino; a profundidade é que dá escala.
    // A distância acompanha a proporção da coluna (iPad e celular diferem).
    const perspectiva = camera as THREE.PerspectiveCamera;
    const meiaAbertura = THREE.MathUtils.degToRad(perspectiva.fov / 2);
    const aspecto = size.width / Math.max(size.height, 1);
    const distancia = THREE.MathUtils.clamp(5.6 / (Math.tan(meiaAbertura) * aspecto), 9, 19);
    // Um travelling lento, como na apresentação de um produto. Parado para
    // quem pede movimento reduzido.
    const t = movimento ? clock.getElapsedTime() : 0;
    const angulo = -0.66 + Math.sin(t * 0.1) * 0.08;
    camera.position.set(alvo.x + Math.sin(angulo) * distancia, alvo.y + distancia * (0.2 + Math.sin(t * 0.07) * 0.015), Math.cos(angulo) * distancia);
    camera.lookAt(alvo);
  });
  return null;
}

type AlvoDeRotulo = { ref: React.RefObject<HTMLSpanElement | null>; ponto: () => THREE.Vector3 };

function Cena({ p, onP, cores, movimento, rotulos }: {
  p: number;
  onP: (p: number) => void;
  cores: CoresDaCena;
  movimento: boolean;
  rotulos: AlvoDeRotulo[];
}) {
  const imagem = imagemDaLente(p, FOCO)!;
  const arrastando = useRef(false);
  const planoArraste = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ponto = useMemo(() => new THREE.Vector3(), []);
  const mover = (evento: ThreeEvent<PointerEvent>) => {
    if (!arrastando.current) return;
    if (evento.ray.intersectPlane(planoArraste, ponto)) onP(THREE.MathUtils.clamp(-ponto.x, P_MIN, P_MAX));
  };
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(cores.fundo);
    scene.fog = new THREE.Fog(cores.fundo, 14, 30);
  }, [scene, cores.fundo]);
  return (
    <>
      <Ambiente />
      <Camera movimento={movimento} />
      <Rotulos alvos={rotulos} />
      <PosProcesso cores={cores} />
      <hemisphereLight args={[cores.ceu, cores.chao, cores.escuro ? 0.22 : 0.7]} />
      <directionalLight position={[-3, 10, 7]} intensity={cores.escuro ? 1.3 : 1.8} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} shadow-camera-left={-11} shadow-camera-right={11} shadow-camera-top={7} shadow-camera-bottom={-5} />
      {/* Luz de recorte por trás, que desenha a silhueta do latão e do vidro.
          Branca: na cor do acento ela tingia o chão inteiro. */}
      <directionalLight position={[6, 5, -8]} intensity={cores.escuro ? 0.9 : 0.5} />

      <Estudio cores={cores} />
      <Trilho cores={cores} />
      <EixoEFocos cores={cores} />
      <Lente cores={cores} />

      <group
        onPointerDown={(e) => { e.stopPropagation(); arrastando.current = true; (e.target as Element | null)?.setPointerCapture?.(e.pointerId); }}
        onPointerUp={() => { arrastando.current = false; }}
        onPointerMove={mover}
      >
        <CaixaDeLuz p={p} cores={cores} />
        {/* Área de toque maior que a caixa, para o dedo achar o objeto. */}
        <mesh position={[-p - 0.2, EIXO, 0]}>
          <boxGeometry args={[1.2, 3.2, 1.6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
      {/* Plano invisível que recebe o arraste quando o ponteiro sai da caixa. */}
      <mesh position={[-1, EIXO, 0]} onPointerMove={mover} onPointerUp={() => { arrastando.current = false; }}>
        <planeGeometry args={[40, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Raios p={p} cores={cores} />
      <Anteparo pLinha={imagem.pLinha} aumento={imagem.aumento} cores={cores} />
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
  const rotulos = useMemo<AlvoDeRotulo[]>(() => [
    { ref: rotuloF, ponto: () => new THREE.Vector3(-FOCO, EIXO - 0.25, 0) },
    { ref: rotuloF2, ponto: () => new THREE.Vector3(FOCO, EIXO - 0.25, 0) },
    { ref: rotuloObjeto, ponto: () => new THREE.Vector3(-pRef.current - 0.3, EIXO + ALTURA_OBJETO + 0.75, 0) },
    { ref: rotuloImagem, ponto: () => {
      const im = imagemDaLente(pRef.current, FOCO)!;
      return new THREE.Vector3(im.pLinha, EIXO + 1.7, 0);
    } },
  ], []);

  const descricao = `Bancada óptica: objeto a ${fmt(p * CM_POR_UNIDADE)} cm de uma lente convergente de foco ${FOCO * CM_POR_UNIDADE} cm; imagem ${naturezaDaImagem(imagem)}, a ${fmt(imagem.pLinha * CM_POR_UNIDADE)} cm da lente.`;

  return (
    <figure ref={caixa} className="crivo-cena crivo-cena--optica" aria-label={descricao}>
      <div className="crivo-cena__palco" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
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
