/**
 * Contas dos sólidos geométricos usados pelo instrumento de sólidos. Módulo
 * puro, sem React, para rodar em node:test. Os exemplos resolvidos dos
 * capítulos (paralelepípedo 3 x 4 x 12, pirâmide de base 6 e altura 4,
 * cilindro de raio 5 e altura 12, cubos semelhantes 3:2) são os testes.
 */

export interface Medidas {
  volume: number;
  areaLateral: number;
  areaTotal: number;
}

function positivo(valor: number, nome: string): number {
  if (!Number.isFinite(valor) || valor <= 0) throw new RangeError(`${nome} precisa ser um número positivo`);
  return valor;
}

function numeroDeLados(n: number): number {
  if (!Number.isInteger(n) || n < 3) throw new RangeError('o polígono precisa de um número inteiro de lados, no mínimo 3');
  return n;
}

/** Vírgula decimal e no máximo duas casas, como a estudante lê. */
export function formatar(valor: number): string {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

export function poligonoRegular(n: number, lado: number) {
  numeroDeLados(n);
  positivo(lado, 'o lado');
  const apotema = lado / (2 * Math.tan(Math.PI / n));
  const perimetro = n * lado;
  return {
    area: (perimetro * apotema) / 2,
    apotema,
    perimetro,
    raio: lado / (2 * Math.sin(Math.PI / n)),
  };
}

export function bloco(a: number, b: number, c: number) {
  positivo(a, 'a'); positivo(b, 'b'); positivo(c, 'c');
  return {
    volume: a * b * c,
    areaTotal: 2 * (a * b + a * c + b * c),
    diagonalFace: Math.hypot(a, b),
    diagonalPrincipal: Math.hypot(a, b, c),
  };
}

export function prisma(n: number, lado: number, altura: number) {
  positivo(altura, 'a altura');
  const base = poligonoRegular(n, lado);
  const areaLateral = base.perimetro * altura;
  return {
    areaBase: base.area,
    areaLateral,
    areaTotal: areaLateral + 2 * base.area,
    volume: base.area * altura,
  };
}

/** Pirâmide regular: o apótema da pirâmide liga o ápice ao meio de uma aresta da base. */
export function piramide(n: number, lado: number, altura: number) {
  positivo(altura, 'a altura');
  const base = poligonoRegular(n, lado);
  const apotema = Math.hypot(altura, base.apotema);
  const areaLateral = (base.perimetro * apotema) / 2;
  return {
    areaBase: base.area,
    apotema,
    areaLateral,
    areaTotal: areaLateral + base.area,
    volume: (base.area * altura) / 3,
  };
}

export function cilindro(r: number, h: number): Medidas {
  positivo(r, 'o raio'); positivo(h, 'a altura');
  const areaLateral = 2 * Math.PI * r * h;
  return { volume: Math.PI * r * r * h, areaLateral, areaTotal: areaLateral + 2 * Math.PI * r * r };
}

export function cone(r: number, h: number) {
  positivo(r, 'o raio'); positivo(h, 'a altura');
  const geratriz = Math.hypot(r, h);
  const areaLateral = Math.PI * r * geratriz;
  return { geratriz, volume: (Math.PI * r * r * h) / 3, areaLateral, areaTotal: areaLateral + Math.PI * r * r };
}

export function esfera(r: number) {
  positivo(r, 'o raio');
  return { volume: (4 / 3) * Math.PI * r ** 3, areaTotal: 4 * Math.PI * r * r };
}

/** Razão de semelhança linear k: comprimentos k, áreas k ao quadrado, volumes k ao cubo. */
export function semelhanca(k: number) {
  positivo(k, 'a razão de semelhança');
  return { comprimento: k, area: k * k, volume: k * k * k };
}

/**
 * Corte paralelo à base a uma fração t da altura, medida a partir do ápice: a
 * parte de cima é semelhante ao sólido inteiro na razão t, então vale t ao
 * cubo do volume; o tronco é o que sobra.
 */
export function cortePiramide(volume: number, t: number) {
  positivo(volume, 'o volume');
  if (!Number.isFinite(t) || t < 0 || t > 1) throw new RangeError('o corte precisa ficar entre 0 e 1 da altura');
  const menor = volume * t ** 3;
  return { menor, tronco: volume - menor };
}
