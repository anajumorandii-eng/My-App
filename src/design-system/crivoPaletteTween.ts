import { PALETTE_TOKENS, type CrivoPalette } from './crivoSubjects';

const clamp = (value: number) => Number.isNaN(value) || value === Number.NEGATIVE_INFINITY
  ? 0
  : value === Number.POSITIVE_INFINITY
    ? 1
    : Math.min(1, Math.max(0, value));
const rgb = (hex: string) => {
  const value = hex.replace('#', '');
  const expanded = value.length === 3 ? value.split('').map((part) => part + part).join('') : value;
  const number = Number.parseInt(expanded, 16);
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255] as const;
};

export function lerpColor(from: string, to: string, progress: number): string {
  const amount = clamp(progress);
  const start = rgb(from), end = rgb(to);
  const channel = (index: number) => Math.round(start[index] + (end[index] - start[index]) * amount).toString(16).padStart(2, '0');
  return `#${channel(0)}${channel(1)}${channel(2)}`.toUpperCase();
}

export function tweenPalette(from: CrivoPalette, to: CrivoPalette, progress: number): CrivoPalette {
  return Object.fromEntries(PALETTE_TOKENS.map((token) => [token, lerpColor(from[token], to[token], progress)])) as CrivoPalette;
}

export function relLuminance(color: string): number {
  const transform = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const [red, green, blue] = rgb(color).map(transform);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function pickContrastTextColor(background: string): '#FFFFFF' | '#000000' {
  const luminance = relLuminance(background);
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? '#FFFFFF' : '#000000';
}
