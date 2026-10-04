import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

/**
 * Texto do botão principal sobre o próprio fundo, nos tokens-base de index.css.
 *
 * Dentro do layout o ambiente tecnológico redefine os dois tokens, mas fora dele
 * os tokens-base valem sozinhos: é o caso da tela de erro do ErrorBoundary da
 * raiz, que aparece quando o layout (e com ele o AmbienteProvider) cai. No
 * escuro, "Tentar de novo" saía em ink-950 sobre burgundy-600, 2,7:1.
 */
const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

function bloco(seletor: string) {
  const inicio = css.indexOf(`${seletor} {`);
  assert.ok(inicio >= 0, `bloco ${seletor} não encontrado em index.css`);
  return css.slice(inicio, css.indexOf('\n}', inicio));
}

function declaracoes(texto: string) {
  const mapa = new Map<string, string>();
  for (const [, nome, valor] of texto.matchAll(/--([\w-]+):\s*([^;]+);/g)) mapa.set(nome, valor.trim());
  return mapa;
}

const claro = declaracoes(bloco(':root'));
const escuro = new Map([...claro, ...declaracoes(bloco(':root.dark'))]);

function resolver(tokens: Map<string, string>, nome: string): string {
  const valor = tokens.get(nome);
  assert.ok(valor, `--${nome} não declarado`);
  const alias = /^var\(--([\w-]+)\)$/.exec(valor);
  return alias ? resolver(tokens, alias[1]) : valor;
}

function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string) {
  const [claroL, escuroL] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claroL + 0.05) / (escuroL + 0.05);
}

for (const [tema, tokens] of [['claro', claro], ['escuro', escuro]] as const) {
  for (const fundo of ['action-primary', 'action-primary-hover', 'action-primary-pressed']) {
    test(`texto do botão principal sobre --${fundo} no tema ${tema} passa de 4,5:1`, () => {
      const razao = contraste(resolver(tokens, 'text-inverse'), resolver(tokens, fundo));
      assert.ok(razao >= 4.5, `${razao.toFixed(2)}:1`);
    });
  }
}
