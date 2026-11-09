/** Coordenadas da folha inteira: gerador e compositor precisam reservar os mesmos espaços. */
export const bookletCoverLayout = {
  frameInset: 20,
  leftArtworkTop: .20,
  rightArtworkTop: .34,
  artworkBottom: .84,
  connectionTop: .40,
  connectionBottom: .55,
} as const;

export function fitBookletArtwork(alpha: Uint8Array | undefined, width: number, height: number, pageWidth: number) {
  const unchanged = { scale: 1, left: 0, top: 0 };
  if (!alpha) return unchanged;
  let leftTop = height, rightTop = height, bottom = 0, minX = width, maxX = 0, occupied = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    // Lavagens quase invisíveis não devem reduzir os protagonistas da capa.
    if (alpha[y * width + x] < 32) continue;
    occupied++;
    if (x < width / 2) leftTop = Math.min(leftTop, y);
    else rightTop = Math.min(rightTop, y);
    bottom = Math.max(bottom, y + 1);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + 1);
  }
  // Uma camada opaca não distingue objetos de fundo: o recorte nativo continua protegendo o texto.
  if (!occupied || occupied >= width * height * .98) return unchanged;
  const { artworkBottom, leftArtworkTop, rightArtworkTop, frameInset } = bookletCoverLayout;
  const topConstraints: [number, number][] = [];
  if (leftTop < height) topConstraints.push([leftTop / height, leftArtworkTop]);
  if (rightTop < height) topConstraints.push([rightTop / height, rightArtworkTop]);
  const sourceBottom = bottom / height;
  const horizontalExtent = Math.max(.5 - minX / width, maxX / width - .5);
  const scale = Math.min(1, (.5 - frameInset / pageWidth) / horizontalExtent,
    ...topConstraints.map(([sourceTop, targetTop]) => (artworkBottom - targetTop) / (sourceBottom - sourceTop)));
  const minimumTop = Math.max(...topConstraints.map(([sourceTop, targetTop]) => targetTop - sourceTop * scale));
  const maximumTop = artworkBottom - sourceBottom * scale;
  const top = Math.max(minimumTop, Math.min(0, maximumTop));
  return { scale, left: (1 - scale) / 2, top };
}
