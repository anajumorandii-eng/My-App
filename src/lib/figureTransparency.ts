/** Remove o papel na apresentação; os pixels da fonte continuam preservados. */
export function transparentFigurePixels(source: Uint8ClampedArray, width: number, height: number, ink: ArrayLike<number>): Uint8ClampedArray {
  const result = source.slice();
  const count = width * height;
  const paper = new Uint8Array(count);
  let colored = 0, midtones = 0;
  for (let p = 0; p < count; p++) {
    const i = p * 4;
    const min = Math.min(source[i], source[i + 1], source[i + 2]);
    const max = Math.max(source[i], source[i + 1], source[i + 2]);
    paper[p] = Number(min >= 242 && max - min <= 10 || source[i + 3] === 0);
    if (max - min > 24) colored++;
    else if (min > 30 && max < 242) midtones++;
  }
  // Em fotografias, mapas e tirinhas, o branco interno pode ser uma letra ou
  // parte do objeto. Nelas só retiramos o papel conectado às bordas. Nos
  // gráficos de traço, o papel também preenche as células fechadas da grade.
  const preserveInterior = colored / count > 0.15 || midtones / count > 0.35;
  let background = paper;
  if (preserveInterior) {
    background = new Uint8Array(count);
    const queue = new Uint32Array(count);
    let head = 0, tail = 0;
    const enqueue = (p: number) => {
      if (paper[p] && !background[p]) { background[p] = 1; queue[tail++] = p; }
    };
    for (let x = 0; x < width; x++) { enqueue(x); enqueue((height - 1) * width + x); }
    for (let y = 0; y < height; y++) { enqueue(y * width); enqueue(y * width + width - 1); }
    while (head < tail) {
      const p = queue[head++], x = p % width;
      if (x > 0) enqueue(p - 1);
      if (x + 1 < width) enqueue(p + 1);
      if (p >= width) enqueue(p - width);
      if (p + width < count) enqueue(p + width);
    }
  }
  for (let p = 0; p < count; p++) {
    const i = p * 4;
    if (background[p]) { result[i + 3] = 0; continue; }
    const min = Math.min(source[i], source[i + 1], source[i + 2]);
    const max = Math.max(source[i], source[i + 1], source[i + 2]);
    if (max - min > 10 || min >= 242) continue;
    let outsideText = !preserveInterior;
    if (preserveInterior) {
      const x = p % width, y = Math.floor(p / width);
      for (let d = 1; d <= 4 && !outsideText; d++) {
        outsideText = x >= d && !!background[p - d] || x + d < width && !!background[p + d] ||
          y >= d && !!background[p - d * width] || y + d < height && !!background[p + d * width];
      }
    }
    if (outsideText) {
      // Traços neutros acompanham a tinta do tema; cores das séries e legendas
      // não são invertidas. A cobertura mantém o antialiasing e os tons da grade.
      result[i] = ink[0]; result[i + 1] = ink[1]; result[i + 2] = ink[2];
      result[i + 3] = Math.round(source[i + 3] * (1 - (source[i] + source[i + 1] + source[i + 2]) / 765));
    }
  }
  return result;
}
