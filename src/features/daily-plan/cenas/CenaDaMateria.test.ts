import { describe, expect, it } from 'vitest';
import { mockTopics } from '../../../data/mockData';
import { CENAS_POR_TOPICO, temCena } from './CenaDaMateria';

describe('registro de cenas por tópico', () => {
  it('só aponta para tópicos que existem', () => {
    const ids = new Set(mockTopics.map((t) => t.id));
    for (const id of Object.keys(CENAS_POR_TOPICO)) expect(ids.has(id), id).toBe(true);
  });

  it('não empresta a bancada óptica a outro assunto da Física', () => {
    // Registrada por matéria, a lente abriria em "Circuitos Elétricos".
    expect(temCena('fis_optica_geometrica')).toBe(true);
    expect(temCena('fis_circuitos')).toBe(false);
    expect(temCena('fis_termodinamica_gases')).toBe(false);
    expect(temCena(undefined)).toBe(false);
  });

  it('cena de Biologia só no tópico dos ácidos nucleicos', () => {
    expect(temCena('bio_codigo_genetico_sintese')).toBe(true);
    expect(temCena('bio_ecologia')).toBe(false);
  });
});
