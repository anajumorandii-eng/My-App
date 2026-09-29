/**
 * Rabiscos do fundo de caderno: o que cada matéria escreve na margem.
 *
 * O fundo de papel envelhecido veio da bancada óptica do Hoje, em que a Ana
 * Júlia aprovou o caderno de óptica atrás da cena e pediu o mesmo na tela
 * inteira, "com ícones, personalizações". A regra é a da cena: **só conteúdo
 * verdadeiro da matéria**. Fórmula certa, data certa, obra com o ano certo —
 * fundo decorativo que ensina errado é pior que fundo liso.
 *
 * Módulo puro, para o node:test conferir que toda matéria tem o seu caderno e
 * que nenhuma frase é longa demais para o espaço do ladrilho.
 */

/** Esboços desenhados em SVG pelo componente, cada um num quadro de 140 × 100. */
export type Esboco =
  | 'lente' | 'onda' | 'parabola' | 'triangulo' | 'helice' | 'celula' | 'hexagono' | 'frasco'
  | 'linha-do-tempo' | 'coluna' | 'rosa-dos-ventos' | 'curvas-de-nivel' | 'aspas' | 'livro'
  | 'pena' | 'globo';

export interface CadernoDaMateria {
  /** Quatro anotações, nesta ordem nos quatro lugares de texto do ladrilho. */
  anotacoes: [string, string, string, string];
  esbocos: [Esboco, Esboco];
}

export const CADERNOS: Record<string, CadernoDaMateria> = {
  Física: {
    anotacoes: ['1/f = 1/p + 1/p′', 'F = m · a', 'v = λ · f', 'U = R · i'],
    esbocos: ['lente', 'onda'],
  },
  Matemática: {
    anotacoes: ['a² + b² = c²', 'Δ = b² − 4ac', 'sen²x + cos²x = 1', 'x = (−b ± √Δ) / 2a'],
    esbocos: ['parabola', 'triangulo'],
  },
  Biologia: {
    anotacoes: ['6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂', 'Aa × Aa → 1 AA : 2 Aa : 1 aa', 'A–T · C–G', 'DNA → RNA → proteína'],
    esbocos: ['helice', 'celula'],
  },
  Química: {
    anotacoes: ['PV = nRT', 'pH = −log [H⁺]', 'n = m / M', 'NaCl → Na⁺ + Cl⁻'],
    esbocos: ['hexagono', 'frasco'],
  },
  História: {
    anotacoes: ['1822 · Independência', '1888 · Lei Áurea', '1889 · República', '1930 · Era Vargas'],
    esbocos: ['linha-do-tempo', 'coluna'],
  },
  Geografia: {
    anotacoes: ['Trópico de Capricórnio ≈ 23°26′ S', 'escala 1 : 50 000', 'Equador · 0°', 'N · L · S · O'],
    esbocos: ['rosa-dos-ventos', 'curvas-de-nivel'],
  },
  Português: {
    anotacoes: ['sujeito + predicado', 'a + a = à', 'mas → oposição', 'por que · porque · porquê'],
    esbocos: ['aspas', 'pena'],
  },
  Literatura: {
    anotacoes: ['Memórias Póstumas · 1881', 'Quincas Borba · 1891', 'Dom Casmurro · 1899', 'Vidas Secas · 1938'],
    esbocos: ['livro', 'pena'],
  },
  Redação: {
    anotacoes: ['tese → argumentos → proposta', 'agente · ação · meio · finalidade', 'além disso · portanto', 'repertório legitimado'],
    esbocos: ['pena', 'aspas'],
  },
  Atualidades: {
    anotacoes: ['Acordo de Paris · 2015', 'Agenda 2030 · 17 ODS', 'COP30 · Belém', 'IDH'],
    esbocos: ['globo', 'linha-do-tempo'],
  },
};

/** Tela sem matéria: uma anotação de cada ciência da natureza e da Matemática. */
export const CADERNO_DO_CRIVO: CadernoDaMateria = {
  anotacoes: ['1/f = 1/p + 1/p′', 'a² + b² = c²', 'PV = nRT', 'DNA → RNA → proteína'],
  esbocos: ['lente', 'helice'],
};

export function cadernoDa(materia: string | undefined): CadernoDaMateria {
  return (materia && CADERNOS[materia]) || CADERNO_DO_CRIVO;
}
